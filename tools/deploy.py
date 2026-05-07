#!/usr/bin/env python3
"""Deploy LcL-Web to Tencent COS using cos-python-sdk-v5."""

import os
import sys
import argparse
import hashlib
import mimetypes
from pathlib import Path
from qcloud_cos import CosConfig, CosS3Client, CosServiceError
from tqdm import tqdm

# ── Config ──────────────────────────────────────────────────────────────────
# 从环境变量读取，避免密钥提交到仓库
# 使用前先设置: set COS_SECRET_ID=xxx && set COS_SECRET_KEY=xxx (Windows)
#              export COS_SECRET_ID=xxx && export COS_SECRET_KEY=xxx (Linux)
SECRET_ID  = os.environ.get("COS_SECRET_ID", "")
SECRET_KEY = os.environ.get("COS_SECRET_KEY", "")
REGION     = "ap-guangzhou"
BUCKET     = "lclgame-res-1304962048"
COS_PREFIX = "LcL-Web/"          # Remote base path
LOCAL_ROOT = Path(__file__).parent.parent.resolve()

# Always-ignored dirs
ALWAYS_IGNORE = {".git", "tools"}
# Dirs skipped by default; include with --full or --include=demos,...
OPTIONAL_IGNORE = {"demos"}
# ────────────────────────────────────────────────────────────────────────────


def md5_file(path: Path) -> str:
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def collect_local_files(ignore_dirs: set):
    """Yield (local_path, cos_key) for every file under LOCAL_ROOT."""
    for root, dirs, files in os.walk(LOCAL_ROOT):
        # Prune ignored directories in-place
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        for fname in files:
            local_path = Path(root) / fname
            rel = local_path.relative_to(LOCAL_ROOT)
            cos_key = COS_PREFIX + rel.as_posix()
            yield local_path, cos_key


def collect_cos_keys(client) -> dict[str, str]:
    """Return {cos_key: etag} for all objects under COS_PREFIX."""
    keys = {}
    marker = ""
    while True:
        resp = client.list_objects(
            Bucket=BUCKET,
            Prefix=COS_PREFIX,
            Marker=marker,
            MaxKeys=1000,
        )
        for obj in resp.get("Contents", []):
            keys[obj["Key"]] = obj["ETag"].strip('"')
        if resp.get("IsTruncated") == "true":
            marker = resp["NextMarker"]
        else:
            break
    return keys


def guess_content_type(path: Path) -> str:
    mime, _ = mimetypes.guess_type(str(path))
    return mime or "application/octet-stream"


# Static assets (images/videos) are content-addressed; cache 1 year.
# HTML/JS/CSS may change; cache 10 minutes with revalidation.
_LONG_CACHE_EXTS  = {".webp", ".avif", ".png", ".jpg", ".jpeg", ".gif", ".mp4", ".webm"}
_SHORT_CACHE_EXTS = {".html", ".js", ".css"}

def cache_control(path: Path) -> str:
    ext = path.suffix.lower()
    if ext in _LONG_CACHE_EXTS:
        return "public, max-age=31536000, immutable"
    if ext in _SHORT_CACHE_EXTS:
        return "public, max-age=600, must-revalidate"
    return "public, max-age=3600"


def parse_args():
    parser = argparse.ArgumentParser(description="Deploy LcL-Web to Tencent COS")
    group = parser.add_mutually_exclusive_group()
    group.add_argument(
        "--full", action="store_true",
        help="Deploy everything including optional dirs (e.g. demos/)"
    )
    group.add_argument(
        "--include", metavar="DIR", type=lambda s: set(s.split(",")),
        help="Comma-separated optional dirs to include, e.g. --include=demos"
    )
    return parser.parse_args()


def main():
    args = parse_args()

    if args.full:
        extra = OPTIONAL_IGNORE          # include all optional dirs
        skip_note = "(full deploy)"
    elif args.include:
        extra = OPTIONAL_IGNORE - args.include
        skip_note = f"(including: {', '.join(args.include)})"
    else:
        extra = set()                    # skip all optional dirs
        skip_note = f"(skipping: {', '.join(OPTIONAL_IGNORE)})  tip: use --full or --include=demos"

    ignore_dirs = ALWAYS_IGNORE | (OPTIONAL_IGNORE - extra)

    config = CosConfig(Region=REGION, SecretId=SECRET_ID, SecretKey=SECRET_KEY)
    client = CosS3Client(config)

    print("Scanning COS...")
    remote = collect_cos_keys(client)

    # Collect all local files first to get total count
    print(f"Scanning local files... {skip_note}")
    all_files = list(collect_local_files(ignore_dirs))

    local_keys = set()
    uploaded_files = []
    skip_count = 0
    error_count = 0

    print(f"Syncing  {LOCAL_ROOT}  =>  cos://{BUCKET}/{COS_PREFIX}\n")
    bar = tqdm(all_files, unit="file", ncols=80, colour="cyan")
    for local_path, cos_key in bar:
        local_keys.add(cos_key)
        local_md5 = md5_file(local_path)
        rel = str(local_path.relative_to(LOCAL_ROOT))
        if remote.get(cos_key) == local_md5:
            skip_count += 1
            bar.set_postfix_str(f"skip {rel}", refresh=False)
            continue
        try:
            with open(local_path, "rb") as f:
                client.put_object(
                    Bucket=BUCKET,
                    Body=f,
                    Key=cos_key,
                    ContentType=guess_content_type(local_path),
                    CacheControl=cache_control(local_path),
                )
            uploaded_files.append(rel)
            bar.set_postfix_str(f"↑ {rel}", refresh=False)
        except CosServiceError as e:
            error_count += 1
            tqdm.write(f"  [ERROR] {cos_key}: {e.get_error_code()} {e.get_error_msg()}")

    bar.close()

    # Delete remote objects that no longer exist locally
    delete_keys = [k for k in remote if k not in local_keys]
    deleted_files = []
    if delete_keys:
        for cos_key in tqdm(delete_keys, desc="Deleting", unit="file", ncols=80, colour="red"):
            try:
                client.delete_object(Bucket=BUCKET, Key=cos_key)
                deleted_files.append(cos_key)
            except CosServiceError as e:
                tqdm.write(f"  [ERROR] delete {cos_key}: {e.get_error_code()}")
                error_count += 1

    # ── Summary ──────────────────────────────────────────────────────────────
    print()
    if uploaded_files:
        print(f"Uploaded ({len(uploaded_files)}):")
        for f in uploaded_files:
            print(f"  + {f}")
    if deleted_files:
        print(f"Deleted ({len(deleted_files)}):")
        for f in deleted_files:
            print(f"  - {f}")
    if not uploaded_files and not deleted_files:
        print("Everything up to date, nothing changed.")

    print()
    print(f"Done — uploaded: {len(uploaded_files)}, skipped: {skip_count}, "
          f"deleted: {len(deleted_files)}, errors: {error_count}")
    sys.exit(1 if error_count else 0)


if __name__ == "__main__":
    main()
