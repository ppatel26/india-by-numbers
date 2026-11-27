"""Cut each topic object out of its coloured backdrop, so it sits on any ground with no box or glow.

Usage: python3 -I pipeline/emblems/cutout.py SRC_DIR public/emblems src/assets/emblems [TOPIC ...]
With topic names, only those objects are cut; the others keep their files (their sources are not kept).
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
ONLY = set(sys.argv[4:])
# One entry per object that exists. A topic whose object is not made yet has no entry here and no
# alt text in src/lib/emblems.ts; the site then leaves its object out. Add both when the owner
# approves the image.
FILES = {
    'population': 'pop', 'prices': 'prices', 'economy': 'econ', 'jobs': 'jobs2', 'health': 'health',
    'education': 'edu', 'elections': 'elec', 'climate': 'climate2', 'religion-and-culture': 'rel', 'home': 'seal',
    'crime-and-justice': 'tarazu', 'living-standards': 'tiffin', 'trade': 'uru', 'transport': 'cart', 'agriculture': 'hal',
    'science-and-technology': 'aryabhata',
}
# Backdrop-coloured parts of an object (the voter's violet ink, violet reflections) turn clear too;
# every object sits on its own pigment, which shows through in the same colour.


def square(im: Image.Image) -> Image.Image:
    """Crop to the object and centre it on a transparent square with a 3% margin."""
    im = im.crop(im.getbbox())
    side = max(im.size)
    sq = Image.new('RGBA', (int(side * 1.06), int(side * 1.06)), (0, 0, 0, 0))
    sq.paste(im, ((sq.width - im.width) // 2, (sq.height - im.height) // 2), im)
    return sq


def cut(src: Path) -> Image.Image:
    source = Image.open(src)
    # A source that already has transparency (an image model that outputs alpha) is used as is.
    # Silver on a light pigment reflects the backdrop, so keying by colour cuts holes in the metal.
    if source.mode in ('RGBA', 'LA') and np.asarray(source.convert('RGBA'))[..., 3].min() < 255:
        return square(source.convert('RGBA'))
    rgb = np.asarray(source.convert('RGB')).astype(np.float64)
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
    return square(Image.fromarray(out, 'RGBA'))


unknown = ONLY - FILES.keys()
if unknown:
    sys.exit(f'Unknown topics: {sorted(unknown)}')
for name, file in FILES.items():
    if ONLY and name not in ONLY:
        continue
    im = cut(SRC / f'{file}.png')
    web = im.copy()
    web.thumbnail((640, 640), Image.LANCZOS)
    web.save(WEB / f'{name}.webp', 'WEBP', quality=86, method=6)
    og = im.copy()
    og.thumbnail((520, 520), Image.LANCZOS)
    og.save(OG / f'{name}.png', optimize=True)
    print(name, im.size)
