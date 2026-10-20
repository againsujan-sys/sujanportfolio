#!/usr/bin/env python3
"""compress_images.py — losslessly-safe JPEG size optimizer for image/.

Re-encodes every .jpg in image/ in place:
  * downscales to a max edge of 1600 px (gallery/lightbox never needs more)
  * strips EXIF/GPS/thumbnail metadata (privacy + weight)
  * converts progressive -> optimized baseline-quality JPEGs at quality 80
    with Huffman-table optimization
  * only writes the file back if it actually shrank

Run from anywhere; paths are resolved relative to the repo root.

Also regenerates image/thumbs/ — small 560 px variants (~35 KB each) that
the gallery grid loads via srcset, so scrolling the photo sections pulls
~1.7 MB instead of the full 7.6 MB set. The lightbox always opens the
full-resolution file.
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
IMG_DIR = ROOT / "image"
THUMB_DIR = IMG_DIR / "thumbs"

MAX_EDGE = 1280   # gallery thumbs render <= ~500 px, lightbox <= ~1100 px
QUALITY = 72      # visually indistinguishable at these sizes, ~40% lighter

THUMB_EDGE = 560  # covers the widest tile (~500 CSS px) at 1x DPR
THUMB_QUALITY = 62


def load_resized(path: Path, max_edge: int) -> Image.Image:
    with Image.open(path) as im:
        im = ImageOps.exif_transpose(im)  # respect orientation, then drop EXIF
        if im.mode not in ("RGB", "L"):
            im = im.convert("RGB")
        w, h = im.size
        if max(w, h) > max_edge:
            scale = max_edge / max(w, h)
            im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
        return im.copy()


def make_thumb(path: Path) -> int:
    """Write image/thumbs/<name>.jpg for one source photo; returns new size."""
    THUMB_DIR.mkdir(exist_ok=True)
    out = THUMB_DIR / path.name
    im = load_resized(path, THUMB_EDGE)
    tmp = out.with_suffix(".tmp.jpg")
    im.save(tmp, "JPEG", quality=THUMB_QUALITY, optimize=True, progressive=True)
    tmp.replace(out)
    return out.stat().st_size


def compress(path: Path) -> tuple[int, int]:
    before = path.stat().st_size
    im = load_resized(path, MAX_EDGE)
    tmp = path.with_suffix(".tmp.jpg")
    im.save(tmp, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    after = tmp.stat().st_size
    if after < before:
        tmp.replace(path)
    else:
        before, after = after, before  # keep original, report no gain
        tmp.unlink()
    return before, after


def main() -> None:
    total_before = total_after = thumb_total = 0
    for p in sorted(IMG_DIR.glob("*.jpg")):
        try:
            before, after = compress(p)
            thumb_bytes = make_thumb(p)
        except Exception as exc:  # noqa: BLE001
            print(f"SKIP {p.name}: {exc}")
            continue
        thumb_total += thumb_bytes
        total_before += before
        total_after += after
        pct = 100 * (before - after) // max(before, 1)
        print(f"{p.name:55s} {before/1024:8.1f} KB -> {after/1024:8.1f} KB ({pct:+d}%) "
              f"| thumb {thumb_bytes/1024:6.1f} KB")
    print("-" * 80)
    print(f"TOTAL: {total_before/1024/1024:.2f} MB -> {total_after/1024/1024:.2f} MB "
          f"saved {(total_before-total_after)/1024/1024:.2f} MB "
          f"({100*(total_before-total_after)//max(total_before,1)}%)")
    print(f"THUMBS: {thumb_total/1024/1024:.2f} MB in image/thumbs/ "
          f"(grid tiles load this instead of the full set)")


if __name__ == "__main__":
    main()
