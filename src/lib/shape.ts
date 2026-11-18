/**
 * Text as SVG paths, shaped with HarfBuzz. resvg mis-orders Indic and
 * Nastaliq clusters, so social images draw those names as outlines.
 * Build time only.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import * as hb from 'harfbuzzjs'
import { svg, type Markup } from './markup'

const FONT_DIR = join(process.cwd(), 'assets/fonts')

/** The TrueType file for each script's display face. */
const FILES: Record<string, string> = {
  Devanagari: 'TiroDevanagariHindi.ttf',
  Bengali: 'NotoSansBengali.ttf',
  Tamil: 'NotoSansTamil.ttf',
  Telugu: 'NotoSansTelugu.ttf',
  Kannada: 'NotoSansKannada.ttf',
  Malayalam: 'NotoSansMalayalam.ttf',
  Gujarati: 'NotoSansGujarati.ttf',
  Gurmukhi: 'NotoSansGurmukhi.ttf',
  Oriya: 'NotoSansOriya.ttf',
  'Meetei Mayek': 'NotoSansMeeteiMayek.ttf',
  Arabic: 'NotoNastaliqUrdu.ttf',
}

const fonts = new Map<string, { font: hb.Font; upem: number }>()

function load(script: string): { font: hb.Font; upem: number } {
  const file = FILES[script]
  if (!file) throw new Error(`No font for script ${script}`)
  let hit = fonts.get(file)
  if (!hit) {
    const face = new hb.Face(new hb.Blob(readFileSync(join(FONT_DIR, file)).buffer as ArrayBuffer))
    hit = { font: new hb.Font(face), upem: face.upem }
    fonts.set(file, hit)
  }
  return hit
}

/** Shaped text at (x, y) on its baseline. Returns the outlines and the advance width. */
export function shaped(text: string, script: string, x: number, y: number, size: number, fill: string): { el: Markup; width: number } {
  const { font, upem } = load(script)
  const buf = new hb.Buffer()
  buf.addText(text)
  buf.guessSegmentProperties()
  hb.shape(font, buf)
  const k = size / upem
  // Right-to-left runs come back in visual order, so the pen runs left to right for every script.
  const positions = buf.getGlyphPositions()
  const glyphs = buf.getGlyphInfos().map((g, i) => ({ id: g.codepoint, pos: positions[i]! }))
  const width = glyphs.reduce((a, g) => a + g.pos.xAdvance, 0) * k
  let pen = 0
  const paths = glyphs.map((g) => {
    const gx = pen + g.pos.xOffset
    pen += g.pos.xAdvance
    return svg`<path transform="translate(${(gx * k).toFixed(2)} ${(-g.pos.yOffset * k).toFixed(2)}) scale(${k.toFixed(5)} ${(-k).toFixed(5)})" d="${font.glyphToPath(g.id)}"/>`
  })
  return { el: svg`<g transform="translate(${x} ${y})" fill="${fill}">${paths}</g>`, width }
}
