#!/usr/bin/env python3
"""Convert all PNG images in assets/images/ to WebP."""

from pathlib import Path
from PIL import Image
from tqdm import tqdm

ASSETS_DIR = Path(__file__).parent.parent / "assets" / "images"
# PNG source files (formerly in source-houdini / source-unity-tools) are now
# co-located here alongside their .webp conversions.
QUALITY = 100  # 92 is a good balance of quality vs size


def convert_all():
    pngs = list(ASSETS_DIR.glob("*.png"))
    if not pngs:
        print("No PNG files found.")
        return

    total_before = sum(p.stat().st_size for p in pngs)
    converted = 0
    skipped = 0

    for png in tqdm(pngs, unit="file", ncols=80, colour="cyan"):
        webp = png.with_suffix(".webp")
        if webp.exists() and webp.stat().st_mtime >= png.stat().st_mtime:
            skipped += 1
            continue
        img = Image.open(png)
        img.save(webp, "WEBP", quality=QUALITY, method=6)
        converted += 1

    total_after = sum(p.with_suffix(".webp").stat().st_size for p in pngs)
    print(f"\nConverted: {converted}, Skipped (up-to-date): {skipped}")
    print(f"Before: {total_before/1024/1024:.1f} MB  →  After: {total_after/1024/1024:.1f} MB  "
          f"(saved {(1 - total_after/total_before)*100:.0f}%)")


if __name__ == "__main__":
    convert_all()
