#!/usr/bin/env python3
"""将 LcL-Web 部署到腾讯云 COS（使用 cos-python-sdk-v5）。"""

import os
import sys
import json
import argparse
import hashlib
import mimetypes
from pathlib import Path
from qcloud_cos import CosConfig, CosS3Client, CosServiceError
from tqdm import tqdm

# ── 配置 ─────────────────────────────────────────────────────────────────────
# 密钥从 tools/secrets.json 读取，该文件已加入 .gitignore，不会提交到仓库
# 首次使用请复制 secrets.example.json 为 secrets.json 并填入真实密钥
_SECRETS_FILE = Path(__file__).parent / "secrets.json"
if not _SECRETS_FILE.exists():
    sys.exit(f"[ERROR] 密钥文件不存在: {_SECRETS_FILE}\n"
             f"  请复制 secrets.example.json 为 secrets.json 并填入真实密钥")
_secrets   = json.loads(_SECRETS_FILE.read_text(encoding="utf-8"))
SECRET_ID  = _secrets["SECRET_ID"]
SECRET_KEY = _secrets["SECRET_KEY"]
REGION     = "ap-guangzhou"
BUCKET     = "lclgame-res-1304962048"
COS_PREFIX = "LcL-Web/"          # 云端根路径
LOCAL_ROOT = Path(__file__).parent.parent.resolve()

# 始终忽略的目录
ALWAYS_IGNORE = {".git", "tools"}
# 默认跳过的目录，可通过 --full 或 --include=demos 包含
OPTIONAL_IGNORE = {"demos"}
# ─────────────────────────────────────────────────────────────────────────────


def md5_file(path: Path) -> str:
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def collect_local_files(ignore_dirs: set):
    """遍历 LOCAL_ROOT，逐个返回 (本地路径, cos_key)。"""
    for root, dirs, files in os.walk(LOCAL_ROOT):
        # 原地过滤忽略目录
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        for fname in files:
            local_path = Path(root) / fname
            rel = local_path.relative_to(LOCAL_ROOT)
            cos_key = COS_PREFIX + rel.as_posix()
            yield local_path, cos_key


def collect_cos_keys(client) -> dict[str, str]:
    """返回 COS_PREFIX 下所有对象的 {cos_key: etag} 字典。"""
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


# 图片/视频等静态资源缓存 7 天
# JS/CSS 缓存 10 分钟，有更新最多等待 10 分钟生效
# HTML 不缓存，每次都向服务器验证，确保用户立即获取最新页面
_LONG_CACHE_EXTS  = {".webp", ".avif", ".png", ".jpg", ".jpeg", ".gif", ".mp4", ".webm"}
_SHORT_CACHE_EXTS = {".js", ".css"}
_NO_CACHE_EXTS    = {".html"}

def cache_control(path: Path) -> str:
    ext = path.suffix.lower()
    if ext in _LONG_CACHE_EXTS:
        return "public, max-age=604800"          # 7 天
    if ext in _NO_CACHE_EXTS:
        return "no-cache"                        # 每次都向服务器验证是否有新版本
    if ext in _SHORT_CACHE_EXTS:
        return "public, max-age=600, must-revalidate"
    return "public, max-age=3600"


def parse_args():
    parser = argparse.ArgumentParser(description="将 LcL-Web 部署到腾讯云 COS")
    group = parser.add_mutually_exclusive_group()
    group.add_argument(
        "--full", action="store_true",
        help="完整部署，包含所有可选目录（如 demos/）"
    )
    group.add_argument(
        "--include", metavar="DIR", type=lambda s: set(s.split(",")),
        help="指定要包含的可选目录，多个用逗号分隔，如 --include=demos"
    )
    return parser.parse_args()


def main():
    args = parse_args()

    if args.full:
        extra = OPTIONAL_IGNORE          # 包含所有可选目录
        skip_note = "（完整部署）"
    elif args.include:
        extra = OPTIONAL_IGNORE - args.include
        skip_note = f"（包含: {', '.join(args.include)}）"
    else:
        extra = set()                    # 跳过所有可选目录
        skip_note = f"（跳过: {', '.join(OPTIONAL_IGNORE)}）  提示: 使用 --full 或 --include=demos"

    ignore_dirs = ALWAYS_IGNORE | (OPTIONAL_IGNORE - extra)

    config = CosConfig(Region=REGION, SecretId=SECRET_ID, SecretKey=SECRET_KEY)
    client = CosS3Client(config)

    print("正在扫描 COS...")
    remote = collect_cos_keys(client)

    # 先收集所有本地文件以获取总数
    print(f"正在扫描本地文件... {skip_note}")
    all_files = list(collect_local_files(ignore_dirs))

    local_keys = set()
    uploaded_files = []
    skip_count = 0
    error_count = 0

    print(f"同步  {LOCAL_ROOT}  =>  cos://{BUCKET}/{COS_PREFIX}\n")
    bar = tqdm(all_files, unit="file", ncols=80, colour="cyan")
    for local_path, cos_key in bar:
        local_keys.add(cos_key)
        local_md5 = md5_file(local_path)
        rel = str(local_path.relative_to(LOCAL_ROOT))
        if remote.get(cos_key) == local_md5:
            skip_count += 1
            bar.set_postfix_str(f"跳过 {rel}", refresh=False)
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
            tqdm.write(f"  [错误] {cos_key}: {e.get_error_code()} {e.get_error_msg()}")

    bar.close()

    # 删除本地已不存在的云端对象
    delete_keys = [k for k in remote if k not in local_keys]
    deleted_files = []
    if delete_keys:
        for cos_key in tqdm(delete_keys, desc="删除中", unit="file", ncols=80, colour="red"):
            try:
                client.delete_object(Bucket=BUCKET, Key=cos_key)
                deleted_files.append(cos_key)
            except CosServiceError as e:
                tqdm.write(f"  [错误] 删除 {cos_key}: {e.get_error_code()}")
                error_count += 1

    # ── 汇总 ─────────────────────────────────────────────────────────────────
    print()
    if uploaded_files:
        print(f"已上传 ({len(uploaded_files)}):")
        for f in uploaded_files:
            print(f"  + {f}")
    if deleted_files:
        print(f"已删除 ({len(deleted_files)}):")
        for f in deleted_files:
            print(f"  - {f}")
    if not uploaded_files and not deleted_files:
        print("所有文件均为最新，无需更新。")

    print()
    print(f"完成 — 上传: {len(uploaded_files)}, 跳过: {skip_count}, "
          f"删除: {len(deleted_files)}, 错误: {error_count}")
    sys.exit(1 if error_count else 0)


if __name__ == "__main__":
    main()
