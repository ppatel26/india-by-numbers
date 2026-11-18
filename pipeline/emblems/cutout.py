"""Cut each topic object out of its coloured backdrop, so it sits on any ground with no box or glow.

Usage: python3 -I pipeline/emblems/cutout.py SRC_DIR public/emblems src/assets/emblems
SRC_DIR holds the generated objects, one PNG per topic on its pigment backdrop (not kept in git).
The backdrop and its shadow share the backdrop's chroma; the silver objects are near neutral.
Alpha follows the chroma distance from the backdrop. Half-covered edge pixels are un-mixed from
the backdrop colour so no coloured fringe remains.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

SRC, WEB, OG = (Path(a) for a in sys.argv[1:4])
FILES = {
    'population': 'pop', 'prices': 'prices', 'economy': 'econ', 'jobs': 'jobs2', 'health': 'health',
    'education': 'edu', 'elections': 'elec', 'climate': 'climate2', 'religion-and-culture': 'rel', 'home': 'seal',
}
# Backdrop-coloured parts of an object (the voter's violet ink, violet reflections) turn clear too;
# every object sits on its own pigment, which shows through in the same colour.


def cut(src: Path) -> Image.Image:
    rgb = np.asarray(Image.open(src).convert('RGB')).astype(np.float64)
    h, w, _ = rgb.shape
    border = np.concatenate([rgb[:8].reshape(-1, 3), rgb[-8:].reshape(-1, 3), rgb[:, :8].reshape(-1, 3), rgb[:, -8:].reshape(-1, 3)])
    bg = np.median(border, axis=0)
    chroma = rgb / np.maximum(rgb.sum(axis=2, keepdims=True), 1)
    bg_c = bg / bg.sum()
    span = np.linalg.norm(bg_c - 1 / 3)
    d = np.linalg.norm(chroma - bg_c, axis=2) / span
    alpha = np.clip((d - 0.30) / (0.70 - 0.30), 0, 1)
    a = alpha[..., None]
    # Un-mix the backdrop from edge pixels: observed = a * fg + (1 - a) * bg.
    fg = np.where(a > 0.02, (rgb - (1 - a) * bg) / np.maximum(a, 0.02), rgb)
    out = np.dstack([np.clip(fg, 0, 255), alpha * 255]).astype(np.uint8)
    im = Image.fromarray(out, 'RGBA')
    im = im.crop(im.getbbox())
    side = max(im.size)
    square = Image.new('RGBA', (int(side * 1.06), int(side * 1.06)), (0, 0, 0, 0))
    square.paste(im, ((square.width - im.width) // 2, (square.height - im.height) // 2), im)
    return square


for name, file in FILES.items():
    im = cut(SRC / f'{file}.png')
    web = im.copy()
    web.thumbnail((640, 640), Image.LANCZOS)
    web.save(WEB / f'{name}.webp', 'WEBP', quality=86, method=6)
    og = im.copy()
    og.thumbnail((520, 520), Image.LANCZOS)
    og.save(OG / f'{name}.png', optimize=True)
    print(name, im.size)
