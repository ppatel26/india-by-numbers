"""Add the rupee sign (U+20B9) to the Hanken Grotesk files used for chart images.

Hanken Grotesk has no rupee sign, so resvg set any line with one in another face. This copies the
glyph from Noto Sans Devanagari (both are SIL OFL 1.1, neither reserves its name), scaled to
Hanken's cap height, into each Hanken weight. Files that already have the sign are left alone.
Usage: python3 -I pipeline/fonts/add_rupee.py [--fonts assets/fonts]
"""
from pathlib import Path
import argparse

from fontTools.pens.transformPen import TransformPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont

RUPEE = 0x20B9
ap = argparse.ArgumentParser()
ap.add_argument('--fonts', default='assets/fonts')
root = Path(ap.parse_args().fonts)
donor = TTFont(root / 'NotoSansDevanagari.ttf')
source = donor.getBestCmap()[RUPEE]
donor_glyphs = donor.getGlyphSet()
donor_cap = donor['OS/2'].sCapHeight
donor_advance, _ = donor['hmtx'][source]

for path in sorted(root.glob('HankenGrotesk-*.ttf')):
    font = TTFont(path)
    if RUPEE in font.getBestCmap():
        print(f'{path.name}: has the rupee sign already')
        continue
    k = font['OS/2'].sCapHeight / donor_cap
    pen = TTGlyphPen(font.getGlyphSet())
    donor_glyphs[source].draw(TransformPen(pen, (k, 0, 0, k, 0, 0)))
    glyph = pen.glyph()
    glyph.recalcBounds(font['glyf'])
    name = 'uni20B9'
    order = font.getGlyphOrder() + [name]
    font.setGlyphOrder(order)
    font['glyf'].glyphOrder = order
    font['glyf'].glyphs[name] = glyph
    font['hmtx'][name] = (round(donor_advance * k), glyph.xMin)
    for table in font['cmap'].tables:
        if table.isUnicode():
            table.cmap[RUPEE] = name
    font.save(path)
    print(f'{path.name}: added the rupee sign')
