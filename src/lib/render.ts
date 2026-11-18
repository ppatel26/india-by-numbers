/**
 * Files made from charts: the standalone SVG (title, plot, hallmark and
 * source, so a reused image keeps its provenance), and PNG through resvg.
 * Build time only.
 */
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { Resvg } from '@resvg/resvg-js'
import type { Chart } from '~/content/types'
import { openView, renderPlot } from './charts'
import { FONT, WIDTH } from './charts/axes'
import { Markup, svg } from './markup'
import { formatDate } from './period'
import { SITE } from './site'
import { sourceLine } from './sources'
import { resolveVars } from './tokens'

const FONT_DIR = join(process.cwd(), 'assets/fonts')
const fontFiles = readdirSync(FONT_DIR)
  .filter((f) => f.endsWith('.ttf'))
  .map((f) => join(FONT_DIR, f))

/** Break text into lines of at most `chars` characters, at spaces. */
export function wrap(text: string, chars: number): string[] {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(/\s+/)) {
    if (line && (line + ' ' + word).length > chars) {
      lines.push(line)
      line = word
    } else line = line ? `${line} ${word}` : word
  }
  if (line) lines.push(line)
  return lines
}

/** Lines of text, one <text> each. Average glyph width is about half the font size. */
export function textBlock(text: string, x: number, y: number, width: number, size: number, attrs: Markup, lineHeight = size * 1.35, max = 4): { el: Markup; height: number } {
  const lines = wrap(text, Math.floor(width / (size * 0.5))).slice(0, max)
  return {
    el: svg`${lines.map((l, i) => svg`<text x="${x}" y="${y + size + i * lineHeight}" font-size="${size}"${attrs}>${l}</text>`)}`,
    height: lines.length * lineHeight,
  }
}

/** Width and height of an SVG string's root. */
export function sizeOf(s: string): { w: number; h: number } {
  const m = s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)
  if (!m) throw new Error('No viewBox')
  return { w: +m[1]!, h: +m[2]! }
}

/** Put an SVG inside another at (x, y), scaled to `width`. */
export function embed(inner: string, x: number, y: number, width: number): { el: Markup; height: number } {
  const { w, h } = sizeOf(inner)
  const height = (h * width) / w
  const body = inner.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')
  return { el: svg`<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="0 0 ${w} ${h}">${new Markup(body)}</svg>`, height }
}

export function chartSvg(chart: Chart): string {
  if (chart.kind === 'table') throw new Error(`${chart.slug}: a table has no image`)
  const view = openView(chart) === 'map' ? 'map' : 'chart'
  const pad = 40
  const W = WIDTH.wide + pad * 2
  const title = textBlock(chart.title, pad, pad - 6, WIDTH.wide, 24, svg` font-weight="600" fill="var(--ink)"`, 32, 2)
  const sub = textBlock(chart.subtitle, pad, pad + title.height + 2, WIDTH.wide, 15, svg` fill="var(--slate)"`, 22, 4)
  const top = pad + title.height + sub.height + 24
  const plot = embed(renderPlot(chart, view, 'wide').html, pad, top, WIDTH.wide)
  const footY = top + plot.height + 28
  const status = (chart.status ?? []).join(' · ')
  const punches = [chart.punches.office, chart.punches.unit, `Checked ${formatDate(SITE.checked)}`, chart.punches.period].join('  ·  ')
  const src = textBlock(sourceLine(chart.sources), pad, footY + 18, WIDTH.wide, 13, svg` fill="var(--slate)"`, 19, 4)
  const credit = footY + 18 + src.height + 22
  const H = credit + pad - 10
  return resolveVars(
    svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="${FONT.ui}">
<rect width="${W}" height="${H}" fill="var(--paper)"/>
${title.el}${sub.el}${plot.el}
<line x1="${pad}" x2="${W - pad}" y1="${footY - 10}" y2="${footY - 10}" stroke="var(--rule)"/>
<text x="${pad}" y="${footY + 6}" font-family="${FONT.mono}" font-size="11.5" fill="var(--ink)">${punches.toUpperCase()}${status ? `  ·  ${status.toUpperCase()}` : ''}</text>
${src.el}
<text x="${pad}" y="${credit}" font-size="13" font-weight="600" fill="var(--lac)">${SITE.name}</text>
<text x="${pad + 130}" y="${credit}" font-size="13" fill="var(--slate)">/charts/${chart.slug}/ · CC BY 4.0</text>
</svg>`.html,
  )
}

export function toPng(svgText: string, width: number): Buffer {
  const r = new Resvg(svgText, {
    fitTo: { mode: 'width', value: width },
    font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Hanken Grotesk' },
    background: '#FFFFFF',
  })
  return r.render().asPng()
}
