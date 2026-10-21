"""Score live vs clone frames written by scripts/compare.sh or scripts/motion.sh.

Usage: python scripts/diff-frames.py [--dir=<frames dir>] [prefix ...]   e.g. home-1440 sky-001-1440
Prints, per frame, the share of differing pixels and the row bands that differ,
and writes live | clone | heatmap composites to <frames dir>/sbs/.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

args = sys.argv[1:]
root = Path("docs/design-references/skyfall.ai/compare")
if args and args[0].startswith("--dir="):
    root = Path(args.pop(0)[len("--dir="):])
out = root / "sbs"
out.mkdir(exist_ok=True)
prefixes = args or [""]


def bands(mask_rows, min_len=6):
    found, start = [], None
    for y, hit in enumerate(mask_rows):
        if hit and start is None:
            start = y
        elif not hit and start is not None:
            if y - start >= min_len:
                found.append((start, y))
            start = None
    if start is not None and len(mask_rows) - start >= min_len:
        found.append((start, len(mask_rows)))
    return found


for live_path in sorted(root.glob("*-live.png")):
    name = live_path.name[: -len("-live.png")]
    if not any(name.startswith(p) for p in prefixes):
        continue
    clone_path = root / f"{name}-clone.png"
    if not clone_path.exists():
        continue
    live = np.asarray(Image.open(live_path).convert("RGB")).astype(np.int16)
    clone = np.asarray(Image.open(clone_path).convert("RGB")).astype(np.int16)
    h = min(live.shape[0], clone.shape[0])
    w = min(live.shape[1], clone.shape[1])
    live, clone = live[:h, :w], clone[:h, :w]
    delta = np.abs(live - clone).max(axis=2)
    mask = delta > 32
    share = mask.mean() * 100
    rows = mask.mean(axis=1) > 0.02
    band_text = " ".join(f"{a}-{b}" for a, b in bands(rows)) or "-"
    print(f"{name:28s} {share:6.2f}%  rows: {band_text}")
    if share > 0.3:
        heat = np.zeros((h, w, 3), dtype=np.uint8)
        heat[..., 0] = np.clip(delta * 3, 0, 255)
        strip = np.concatenate(
            [live.astype(np.uint8), np.full((h, 8, 3), 255, np.uint8), clone.astype(np.uint8),
             np.full((h, 8, 3), 255, np.uint8), heat],
            axis=1,
        )
        img = Image.fromarray(strip)
        img = img.resize((img.width // 2, img.height // 2), Image.LANCZOS)
        img.save(out / f"{name}.png")
