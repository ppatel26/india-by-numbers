/**
 * Social images, 1200 by 630, made at build time with the chart engine and resvg.
 * Topic pages show their pigment, emblem and headline figures; chart pages show
 * the chart itself; state pages show the state's names and its tile.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Placed } from '~/content'
import profile from '~/content/pages/state-profile'
import { TOPICS, type Topic } from '~/content/types'
import { openView, renderPlot } from './charts'
import { FONT } from './charts/axes'
import { show } from './charts/model'
import { tableOf } from './charts/table'
import { figureValue } from './figures'
import { GRID, places, type Place } from './geography'
import { embed, Markup, svg } from './markup'
import { row } from './profile'
import { textBlock, toPng, wrap } from './render'
import { shaped } from './shape'
import { SITE, checkedOf } from './site'
import { colors, pigments, resolveVars } from './tokens'

const W = 1200
const H = 630
const DISPLAY = "'Marcellus', serif"

/** Cut-out objects are PNG with transparency; the methods relief is a photo on black. */
const emblem = (name: string): string => {
  const file = name === 'methods' ? 'methods.jpg' : `${name}.png`
  const type = name === 'methods' ? 'jpeg' : 'png'
  return `data:image/${type};base64,${readFileSync(join(process.cwd(), 'src/assets/emblems', file)).toString('base64')}`
}

const seal = readFileSync(join(process.cwd(), 'src/assets/brand/seal.svg'), 'utf8').replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')

/** The wordmark: seal and name, in the given colour. */
function wordmark(x: number, y: number, color: string): Markup {
  return svg`<svg x="${x}" y="${y}" width="40" height="40" viewBox="0 0 1024 1023" color="${color}">${new Markup(seal)}</svg>
<text x="${x + 54}" y="${y + 22}" font-family="${DISPLAY}" font-size="22" letter-spacing="0.5" fill="${color}">INDIA BY NUMBERS</text>
${shaped(SITE.hindiName, 'Devanagari', x + 54, y + 42, 15, color).el}`
}

/** A topic object with a soft cast shadow. The methods relief keeps a radial fade into its dark ground. */
function object(name: string, x: number, y: number, size: number): Markup {
  const id = `o-${name}-${Math.round(x)}-${Math.round(y)}`
  const fade = name === 'methods'
  return svg`<defs>${
    fade
      ? svg`<radialGradient id="${id}-g"><stop offset="0.72" stop-color="#fff"/><stop offset="0.98" stop-color="#000"/></radialGradient><mask id="${id}"><rect x="${x}" y="${y}" width="${size}" height="${size}" fill="url(#${id}-g)"/></mask>`
      : svg`<filter id="${id}" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="${size * 0.04}" stdDeviation="${size * 0.035}" flood-color="#000" flood-opacity="0.32"/></filter>`
  }</defs>
<image href="${emblem(name)}" x="${x}" y="${y}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet" ${fade ? svg`mask="url(#${id})"` : svg`filter="url(#${id})"`}/>`
}

function page(body: Markup, ground: string): Buffer {
  const doc = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="${FONT.ui}">
<rect width="${W}" height="${H}" fill="${ground}"/>${body}</svg>`
  return toPng(resolveVars(doc.html), W)
}

const upper = (s: string) => s.toUpperCase()

/** A display size at which caps text fits `width` (Marcellus caps run about 0.66 em wide). */
const fit = (text: string, width: number, max: number): number => Math.min(max, Math.floor(width / (text.length * 0.66)))

export function topicImage(t: Topic): Buffer {
  const p = pigments[t.slug]
  const ink = p.text === 'light' ? colors.silver : colors.ink
  const dim = p.text === 'light' ? colors['silver-dim'] : colors['on-light-dim']
  const figs = t.figures.map(figureValue)
  return page(
    svg`${object(t.slug, 772, 56, 380)}
${wordmark(64, 56, ink)}
<text x="64" y="196" font-family="${FONT.mono}" font-size="16" letter-spacing="2" fill="${dim}">TOPIC</text>
<text x="64" y="292" font-family="${DISPLAY}" font-size="${fit(upper(t.name), 620, 92)}" fill="${ink}">${upper(t.name)}</text>
${shaped(t.hindi, 'Devanagari', 66, 350, 40, ink).el}
${figs.map((f, i) => {
  const x = 64 + i * 260
  return svg`<line x1="${x}" x2="${x + 230}" y1="430" y2="430" stroke="${dim}" stroke-opacity="0.6"/>
<text x="${x}" y="484" font-size="40" font-weight="500" fill="${ink}">${f.value.text}</text>
${textBlock(f.label, x, 494, 230, 18, svg` fill="${ink}"`, 23, 2).el}
<text x="${x}" y="572" font-family="${FONT.mono}" font-size="14" letter-spacing="0.6" fill="${dim}">${upper([f.period, ...f.status].join(' · '))}</text>`
})}`,
    p.hex,
  )
}

export function chartImage(p: Placed): Buffer {
  const { chart, topic } = p
  const pig = pigments[topic.slug]
  const head = textBlock(chart.title, 64, 112, 1072, 40, svg` font-weight="600" fill="var(--ink)"`, 50, 2)
  const sub = textBlock(chart.subtitle, 64, 120 + head.height, 1072, 20, svg` fill="var(--slate)"`, 28, 2)
  const top = 136 + head.height + sub.height
  const room = H - top - 70
  const s = chart.kind === 'table' ? undefined : renderPlot(chart, openView(chart) === 'map' ? 'map' : 'chart', 'wide').html
  const [, vw, vh] = s ? (s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)!.map(Number) as [number, number, number]) : [0, 1, 1]
  const width = Math.min(1072, (room * vw) / vh)
  // A plot squeezed below half the card's width is unreadable: show the first rows of its table instead.
  const plot = s && width >= 536 ? embed(s, 64 + (1072 - width) / 2, top, width).el : tableRows(p, top, room)
  const punches = [chart.punches.office, chart.punches.unit, chart.punches.period, ...(chart.status ?? [])].join('  ·  ')
  return page(
    svg`<rect width="${W}" height="10" fill="${pig.hex}"/>
<rect x="64" y="52" width="12" height="12" fill="${pig.hex}"/>
<text x="86" y="63" font-family="${FONT.mono}" font-size="15" letter-spacing="1.5" fill="var(--ink)">${upper(topic.name)} · ${p.number}</text>
<text x="1136" y="63" text-anchor="end" font-family="${DISPLAY}" font-size="20" fill="var(--lac)">INDIA BY NUMBERS</text>
${head.el}${sub.el}${plot}
<line x1="64" x2="1136" y1="${H - 56}" y2="${H - 56}" stroke="var(--rule)"/>
<text x="64" y="${H - 28}" font-family="${FONT.mono}" font-size="14" letter-spacing="0.6" fill="var(--ink)">${upper(punches)}</text>
<text x="1136" y="${H - 28}" text-anchor="end" font-size="15" fill="var(--slate)">${chart.sources[0]?.publisher ?? ''} · checked ${checkedOf(chart).split('-').reverse().join('.')}</text>`,
    colors.paper,
  )
}

/** The first rows of a chart's table, for charts too tall to shrink into the card. */
function tableRows(p: Placed, top: number, room: number): Markup {
  const t = tableOf(p.chart)
  const rows = t.rows.slice(0, Math.floor(room / 34) - 1)
  const cols = t.columns.slice(0, 4)
  const colX = (i: number) => 64 + (i === 0 ? 0 : 420 + (i - 1) * 220)
  return svg`${cols.map((c, i) => svg`<text x="${colX(i)}" y="${top + 16}" font-family="${FONT.mono}" font-size="13" fill="var(--slate)">${upper(c).slice(0, 26)}</text>`)}
${rows.map((r, j) => {
  const y = top + 52 + j * 34
  return svg`<line x1="64" x2="1136" y1="${y - 24}" y2="${y - 24}" stroke="var(--rule)"/>
<text x="64" y="${y}" font-size="20" font-weight="600" fill="var(--ink)">${r.head.slice(0, 34)}</text>
${r.cells.slice(0, 3).map((c, i) => svg`<text x="${colX(i + 1)}" y="${y}" font-size="20" fill="var(--ink)">${c.shown.text.slice(0, 18)}</text>`)}`
})}`
}

/** The 36 tiles, this state's in series-1. */
function locator(current: string, x0: number, y0: number, size: number): Markup {
  const gap = 5
  return svg`${places.map((pl: Place) => {
    const on = pl.slug === current
    return svg`<rect x="${x0 + (pl.col - 1) * (size + gap)}" y="${y0 + (pl.row - 1) * (size + gap)}" width="${size}" height="${size}" rx="3" fill="${on ? 'var(--s1)' : 'var(--band)'}"/>
<text x="${x0 + (pl.col - 1) * (size + gap) + size / 2}" y="${y0 + (pl.row - 1) * (size + gap) + size / 2 + 5}" text-anchor="middle" font-family="${FONT.mono}" font-size="13" fill="${on ? 'var(--paper)' : 'var(--slate)'}">${pl.code}</text>`
  })}`
}

export function stateImage(pl: Place): Buffer {
  const measures = [profile.sections[0]!.measures[0]!, profile.sections[1]!.measures[0]!, profile.sections[4]!.measures[0]!]
  const rows = measures.map((m) => row(m, pl.slug))
  const native = pl.native && pl.native.name !== pl.hindi ? pl.native : undefined
  const size = 46
  const name = upper(pl.name)
  const lines = fit(name, 620, 84) < 52 ? wrap(name, Math.ceil(name.length / 2) + 4) : [name]
  const fs = Math.min(...lines.map((l) => fit(l, 620, lines.length > 1 ? 60 : 84)))
  // Names in other scripts share one line of 620 px; long ones shrink to fit.
  const probe = (k: number) => (pl.hindi ? shaped(pl.hindi, 'Devanagari', 0, 0, k, '').width : 0) + (native ? shaped(native.name, native.script, 0, 0, k, '').width + 32 : 0)
  const k = Math.min(38, (38 * 620) / Math.max(1, probe(38)))
  const hindi = pl.hindi ? shaped(pl.hindi, 'Devanagari', 66, 326, k, colors.slate) : undefined
  return page(
    svg`${wordmark(64, 52, colors.lac)}
<text x="64" y="176" font-family="${FONT.mono}" font-size="16" letter-spacing="2" fill="var(--slate)">${pl.type === 'ut' ? 'UNION TERRITORY' : 'STATE'} BESIDE INDIA</text>
${lines.map((l, i) => svg`<text x="64" y="${262 - (lines.length - 1 - i) * fs * 1.02}" font-family="${DISPLAY}" font-size="${fs}" fill="var(--ink)">${l}</text>`)}
${hindi?.el}${native ? shaped(native.name, native.script, 66 + (hindi?.width ?? 0) + 32, 326, k, colors.slate).el : null}
${rows.map((r, i) => {
  const x = 64 + i * 225
  return svg`<line x1="${x}" x2="${x + 200}" y1="420" y2="420" stroke="var(--rule)"/>
<text x="${x}" y="470" font-size="34" font-weight="500" fill="var(--ink)">${r.value ? show(r.chart, r.value).text : 'No data'}</text>
<text x="${x}" y="502" font-size="17" fill="var(--ink)">${r.label}</text>
<text x="${x}" y="528" font-family="${FONT.mono}" font-size="12.5" fill="var(--slate)">INDIA ${r.data.india ? show(r.chart, r.data.india).text : ''} · ${upper(r.chart.punches.period)}</text>`
})}
${locator(pl.slug, W - 64 - GRID.cols * (size + 5) + 5, 150, size)}`,
    colors.paper,
  )
}

/** The nine topics as pigment tiles, each with its object: the site at a glance. */
function mosaic(x0: number, y0: number, size: number): Markup {
  const gap = 8
  return svg`${TOPICS.map((t, i) => {
    const x = x0 + (i % 3) * (size + gap)
    const y = y0 + Math.floor(i / 3) * (size + gap)
    return svg`<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="4" fill="${pigments[t].hex}"/>${object(t, x + size * 0.1, y + size * 0.1, size * 0.8)}`
  })}`
}

/**
 * Index and about pages: their title on lac, beside the nine topics. How we check
 * sits on kajal with the merchant and scribe relief, as on its page.
 */
export function plainImage(title: string, line: string, look: 'topics' | 'methods' = 'topics'): Buffer {
  const t = textBlock(upper(title), 64, 176, 560, 64, svg` font-family="${DISPLAY}" fill="var(--silver)"`, 72, 3)
  const l = textBlock(line, 64, 200 + t.height, 540, 26, svg` fill="var(--silver-dim)"`, 36, 4)
  const art = look === 'methods' ? object('methods', 680, 75, 480) : mosaic(660, 57, 166)
  return page(svg`${art}${wordmark(64, 56, colors.silver)}${t.el}${l.el}`, look === 'methods' ? colors.kajal : colors.lac)
}
