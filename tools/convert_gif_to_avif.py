#!/usr/bin/env python3
"""
Convert GIF animations to AVIF or animated WebP via ffmpeg.

Default behaviour:
  Scans SOURCE directories for *.gif and writes converted files into DST_DIR,
  preserving the original filename (only suffix changes).

Usage:
    python convert_gif_to_avif.py [options]

Options:
    --src DIR [DIR ...]  Source directory/directories (override defaults)
    --dst DIR            Output directory (default: ../assets/images-animated)
    --format FORMAT      Output format: avif (default) or webp
    --crf N              [avif] AV1 quality 0-63, lower=better (default: 20)
    --encoder-speed N    [avif] Encoder speed 0-10, lower=better/slower (default: 4)
    --quality N          [webp] WebP quality 0-100, higher=better (default: 100)
    --playback-speed X   Playback speed multiplier, e.g. 2.0=2x faster (default: 1.0)
    --overwrite          Re-encode even if output is already newer than source
    --dry-run            Print ffmpeg commands without executing them

Requires:
    ffmpeg in PATH  (with libaom-av1 and libwebp_anim support)
    pip install tqdm   (optional, for progress bar)
"""

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

try:
    from tqdm import tqdm
    HAS_TQDM = True
except ImportError:
    HAS_TQDM = False

# ── Project-relative defaults ────────────────────────────────────────────────
_ROOT = Path(__file__).parent.parent  # 项目根目录（tools 的上一级）

DEFAULT_SRC_DIRS: list[Path] = [
    _ROOT / "assets" / "images-animated",  # GIF 源文件所在目录
]
DEFAULT_DST_DIR: Path = _ROOT / "assets" / "images-animated"  # 转换结果输出目录

DEFAULT_FORMAT         = "webp"  # 输出格式：avif 或 webp
DEFAULT_CRF            = 20      # [avif] AV1 画质，0=最好，63=最差
DEFAULT_ENCODER_SPEED  = 4       # [avif] 编码速度，0=最慢最好，10=最快最差
DEFAULT_QUALITY        = 100     # [webp] WebP 画质，0=最差，100=最好
DEFAULT_PLAYBACK_SPEED = 1.0     # 播放速度倍率，1.0=原速，2.0=2 倍速


# ── Helpers ──────────────────────────────────────────────────────────────────
def check_ffmpeg() -> None:
    if shutil.which("ffmpeg") is None:
        sys.exit(
            "ERROR: ffmpeg not found in PATH.\n"
            "Install it from https://ffmpeg.org/download.html "
            "and make sure it is on PATH."
        )


def is_up_to_date(src: Path, dst: Path) -> bool:
    return dst.exists() and dst.stat().st_mtime >= src.stat().st_mtime


def human_size(n: float) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if n < 1024:
            return f"{n:.1f} {unit}"
        n /= 1024
    return f"{n:.1f} TB"


def build_vf(playback_speed: float) -> str:
    """
    Build the -vf filter chain.
    setpts=(1/speed)*PTS  →  speed>1 faster, speed<1 slower.
    """
    filters: list[str] = []
    if playback_speed != 1.0:
        filters.append(f"setpts={1.0 / playback_speed:.6g}*PTS")
    # AV1 / WebP both require even dimensions
    filters.append("scale=trunc(iw/2)*2:trunc(ih/2)*2")
    return ",".join(filters)


def build_cmd(
    src: Path,
    dst: Path,
    fmt: str,
    crf: int,
    encoder_speed: int,
    quality: int,
    playback_speed: float,
) -> list[str]:
    """Return the ffmpeg command list for the given format."""
    base = ["ffmpeg", "-y", "-i", str(src), "-vf", build_vf(playback_speed)]

    if fmt == "webp":
        # libwebp_anim: animated WebP, quality 0-100, loop 0 = infinite
        return base + [
            "-c:v", "libwebp_anim",
            "-quality", str(quality),
            "-loop", "0",
            str(dst),
        ]
    else:  # avif (default)
        return base + [
            "-c:v", "av1",
            "-pix_fmt", "yuva420p",
            "-crf", str(crf),
            "-cpu-used", str(encoder_speed),
            str(dst),
        ]


def convert_one(
    src: Path,
    dst: Path,
    fmt: str,
    crf: int,
    encoder_speed: int,
    quality: int,
    playback_speed: float,
    dry_run: bool,
) -> bool:
    dst.parent.mkdir(parents=True, exist_ok=True)
    cmd = build_cmd(src, dst, fmt, crf, encoder_speed, quality, playback_speed)

    if dry_run:
        print(f"  [dry-run] {' '.join(cmd)}")
        return True

    result = subprocess.run(
        cmd,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
        text=True,
    )
    if result.returncode != 0:
        print(f"\n  FAILED: {src.name}")
        print(result.stderr[-600:].strip())
        return False
    return True


# ── Main ─────────────────────────────────────────────────────────────────────
def main() -> None:
    parser = argparse.ArgumentParser(
        description="Convert GIF files to AVIF or animated WebP via ffmpeg.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument(
        "--src", nargs="+", type=Path, default=None, metavar="DIR",
        help=f"Source directories (default: {[str(d) for d in DEFAULT_SRC_DIRS]})",
    )
    parser.add_argument(
        "--dst", type=Path, default=DEFAULT_DST_DIR, metavar="DIR",
        help=f"Output directory (default: {DEFAULT_DST_DIR})",
    )
    parser.add_argument(
        "--format", choices=["avif", "webp"], default=DEFAULT_FORMAT,
        help=f"Output format: avif or webp (default: {DEFAULT_FORMAT})",
    )
    parser.add_argument(
        "--crf", type=int, default=DEFAULT_CRF,
        help=f"[avif] AV1 CRF quality 0-63 (default: {DEFAULT_CRF})",
    )
    parser.add_argument(
        "--encoder-speed", type=int, default=DEFAULT_ENCODER_SPEED,
        dest="encoder_speed",
        help=f"[avif] AV1 encoder speed 0-10 (default: {DEFAULT_ENCODER_SPEED})",
    )
    parser.add_argument(
        "--quality", type=int, default=DEFAULT_QUALITY,
        help=f"[webp] WebP quality 0-100 (default: {DEFAULT_QUALITY})",
    )
    parser.add_argument(
        "--playback-speed", type=float, default=DEFAULT_PLAYBACK_SPEED,
        dest="playback_speed",
        help=f"Playback speed multiplier (default: {DEFAULT_PLAYBACK_SPEED})",
    )
    parser.add_argument(
        "--overwrite", action="store_true",
        help="Re-encode even if output is already up to date",
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Show ffmpeg commands without executing them",
    )
    args = parser.parse_args()

    if args.playback_speed <= 0:
        sys.exit("ERROR: --playback-speed must be a positive number.")

    check_ffmpeg()

    src_dirs: list[Path] = [d.resolve() for d in (args.src or DEFAULT_SRC_DIRS)]
    dst_dir:  Path       = args.dst.resolve()
    suffix    = f".{args.format}"   # ".avif" or ".webp"

    # Collect all GIF files
    all_gifs: list[Path] = []
    for d in src_dirs:
        if not d.is_dir():
            print(f"  WARNING: source directory not found, skipping: {d}")
            continue
        all_gifs.extend(sorted(d.glob("*.gif")))

    if not all_gifs:
        print("No GIF files found in any of the source directories:")
        for d in src_dirs:
            print(f"  {d}")
        return

    # Header
    fmt_detail = (
        f"CRF {args.crf}  |  encoder-speed {args.encoder_speed}"
        if args.format == "avif"
        else f"quality {args.quality}/100"
    )
    speed_hint = f"  (×{args.playback_speed})" if args.playback_speed != 1.0 else ""
    print(f"Output         : {dst_dir}")
    print(f"Format         : {args.format.upper()}  ({fmt_detail})")
    print(f"Playback speed : {args.playback_speed}{speed_hint}")
    print(f"Found          : {len(all_gifs)} GIF file(s)\n")

    converted   = 0
    skipped     = 0
    failed      = 0
    size_before = 0.0
    size_after  = 0.0

    iterator = (
        tqdm(all_gifs, unit="file", ncols=88, colour="cyan")
        if HAS_TQDM else all_gifs
    )

    for gif in iterator:
        out = dst_dir / gif.with_suffix(suffix).name

        if not args.overwrite and is_up_to_date(gif, out):
            skipped += 1
            if HAS_TQDM:
                iterator.set_postfix(skip=skipped, ok=converted, fail=failed)  # type: ignore[union-attr]
            else:
                print(f"  SKIP  {gif.name}")
            continue

        if not HAS_TQDM:
            print(f"  →  {gif.name}  →  {out.name} …", end=" ", flush=True)

        sb = gif.stat().st_size
        ok = convert_one(
            gif, out,
            args.format, args.crf, args.encoder_speed,
            args.quality, args.playback_speed,
            args.dry_run,
        )

        if ok:
            if not args.dry_run and out.exists():
                size_before += sb
                size_after  += out.stat().st_size
            converted += 1
            if not HAS_TQDM:
                print("OK")
        else:
            failed += 1
            if not HAS_TQDM:
                print("FAILED")

        if HAS_TQDM:
            iterator.set_postfix(skip=skipped, ok=converted, fail=failed)  # type: ignore[union-attr]

    # Summary
    line = "─" * 50
    print(f"\n{line}")
    print(f"  Converted : {converted}")
    print(f"  Skipped   : {skipped}  (already up to date)")
    print(f"  Failed    : {failed}")
    if size_before > 0:
        ratio = (1 - size_after / size_before) * 100
        print(
            f"  Size      : {human_size(size_before)} → {human_size(size_after)}"
            f"  (saved {ratio:.0f}%)"
        )
    print(line)

    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main()
