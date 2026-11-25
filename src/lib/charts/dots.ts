import { scaleLinear } from 'd3-scale'
import { INDIA, geoName, isPlace, place } from '~/lib/geography'
import { svg, type Markup } from '~/lib/markup'
import { colorVar } from '~/lib/tokens'
import { FONT, REF_ROW, WIDTH, frame, refRows, valueRefs, type Width } from './axes'
import { drawn, seriesOf, tipLine, type Of, type SeriesData } from './model'
import { fmt } from '~/lib/format'

/**
 * Display name for a row key: a state slug, 'india', or a category as published. The one state
 * or UT name too long for a label column (Dadra and Nagar Haveli and Daman and Diu) uses its
 * short form.
 */
export const rowName = (key: string, fit = true): string => {
  if (!(key === INDIA || isPlace(key))) return key
  const name = geoName(key)
  return fit && name.length > 30 && key !== INDIA ? place(key).short.replace('-', '') : name
}

/** A label column wide enough for its longest name (Hanken 12.5 px runs about 6.8 px a character). */
export const nameColumn = (names: readonly string[], narrow: boolean): number =>
  Math.min(narrow ? 118 : 240, 16 + Math.max(...names.map((n) => n.length)) * 6.8)

export const legendItemWidth = (label: string): number => 30 + label.length * 7

/** Height of one legend row. */
export const KEY_ROW = 20

/** Legend entries in rows no wider than `maxW`: each entry's row and x. */
export function legendLayout<S extends { label: string }>(series: readonly S[], maxW = Infinity): { s: S; x: number; row: number }[] {
  let x = 0
  let row = 0
  return series.map((s) => {
    const w = legendItemWidth(s.label)
    if (x > 0 && x + w - 14 > maxW) {
      row++
      x = 0
    }
    const at = { s, x, row }
    x += w
    return at
  })
}

/** Rows a legend takes at this width. */
export const legendRows = (series: readonly { label: string }[], maxW = Infinity): number => Math.max(0, ...legendLayout(series, maxW).map((e) => e.row + 1))

export function legend(series: readonly SeriesData[], hollow: readonly string[] = [], y = 12, maxW = Infinity): Markup {
  return svg`<g class="key">${legendLayout(series, maxW).map(({ s, x: at, row }) => {
    const ring = hollow.includes(s.key)
    const ly = y + row * KEY_ROW
    return svg`<circle cx="${at + 6}" cy="${ly - 4}" r="5" fill="${ring ? 'var(--paper)' : colorVar(s.color)}" stroke="${colorVar(s.color)}" stroke-width="1.5"/>
<text x="${at + 16}" y="${ly}" font-size="12.5" fill="var(--ink)">${s.label}</text>`
  })}</g>`
}

/** Phone row names: common words shortened, then cut to `max` characters. */
const WORDS: readonly (readonly [RegExp, string])[] = [
  [/\bNorth\b/g, 'N'],
  [/\bSouth\b/g, 'S'],
  [/\bEast\b/g, 'E'],
  [/\bWest\b/g, 'W'],
  [/\bInterior\b/g, 'Int.'],
  [/\bPradesh\b/g, 'Pr.'],
  [/\band\b/g, '&'],
]
export function fitRow(key: string, max: number): string {
  if (key === INDIA || isPlace(key)) {
    const name = geoName(key)
    return name.length > max && key !== INDIA ? place(key).short.replace('-', '') : name
  }
  if (key.length <= max) return key
  const short = WORDS.reduce((t, [re, to]) => t.replace(re, to), key)
  return short.length <= max ? short : `${short.slice(0, max - 1).trimEnd()}…`
}

/** Two or more values per row as dots on one line, sorted by the first series. */
export function renderDots(chart: Of<'dots'>, width: Width): Markup {
  const series = drawn(chart)
  const narrow = width === 'narrow'
  const W = WIDTH[width]
  const hollow = chart.hollow ?? []
  const keys = [...new Set(series.flatMap((s) => s.points.map((p) => p.x)))]
  const val = (s: SeriesData, k: string) => s.points.find((p) => p.x === k)
  const first = seriesOf(chart).find((s) => s.key === chart.sortBy) ?? series[0]!
  const pin = chart.pin ?? []
  const rank = (k: string) => (pin.includes(k) ? Infinity : (val(first, k)?.y ?? -Infinity))
  keys.sort((a, b) => rank(b) - rank(a))
  // Say which series sets the order; with two years or two sexes the reader cannot tell.
  // Only when that series has every row; rows split across series keep their own order.
  const sorts = keys.every((k) => pin.includes(k) || val(first, k)?.y != null)
  // "Ranked by women", but "Ranked by CPI": a leading capital stays only on an acronym.
  const by = /^[A-Z][a-z]/.test(first.label) ? first.label[0]!.toLowerCase() + first.label.slice(1) : first.label
  const ranked = sorts && (series.length > 1 || first.hidden) ? `Ranked by ${by}` : ''
  // The key wraps to the width. "Ranked by" sits at the right of a one-row key when it fits,
  // else on its own line under the key.
  const keyRows = legendRows(series, W)
  const keyWidth = series.reduce((w, s) => w + legendItemWidth(s.label), 0)
  const ownLine = !!ranked && (keyRows > 1 || keyWidth + ranked.length * 6.6 + 24 > W)
  const rowH = 20
  const label = (k: string) => (narrow ? fitRow(k, 16) : rowName(k))
  const m = { top: 0, right: 24, bottom: 28, left: nameColumn(keys.map(label), narrow) }
  const all = series.flatMap((s) => s.points.flatMap((p) => (p.y === null ? [] : [p.y])))
  const refVals = (chart.refs ?? []).map((r) => r.value)
  // A dot's position carries the value, so the axis need not start at zero.
  const lo = chart.axis?.min ?? Math.min(...all, ...refVals)
  const hi = chart.axis?.max ?? Math.max(...all, ...refVals)
  const x = scaleLinear().domain([lo, hi]).nice().range([m.left, W - m.right])
  // Reference labels that would touch take a second row.
  m.top = 40 + (keyRows - 1) * KEY_ROW + (ownLine ? 16 : 0) + Math.max(0, refRows(chart.refs, x) - 1) * REF_ROW
  const H = m.top + keys.length * rowH + m.bottom
  const ticks = x.ticks(narrow ? 4 : 6)

  const grid = svg`${ticks.map((t) => svg`<line x1="${x(t)}" x2="${x(t)}" y1="${m.top - 6}" y2="${H - m.bottom}" stroke="var(--grid)"/>
<text x="${x(t)}" y="${H - m.bottom + 16}" text-anchor="middle" font-family="${FONT.mono}" font-size="11" fill="var(--slate)">${fmt(t, { ...chart.format, decimals: undefined })}</text>`)}`

  const rows = keys.map((k, i) => {
    const y = m.top + i * rowH + rowH / 2
    const vs = series.map((s) => ({ s, p: val(s, k) })).filter((v) => v.p?.y != null)
    const xs = vs.map((v) => x(v.p!.y!))
    const india = k === INDIA
    const tip = [rowName(k, false), ...series.map((s) => tipLine(chart, s, val(s, k)))].join('\n')
    const name = svg`<text class="name" x="${m.left - 8}" y="${y + 4}" text-anchor="end" font-size="12.5" font-weight="${india ? 600 : 400}" fill="var(--ink)">${label(k)}</text>`
    return svg`<g class="row" data-geo="${k}" data-tip="${tip}">${india ? svg`<rect x="0" y="${y - rowH / 2}" width="${W}" height="${rowH}" fill="var(--band)"/>` : null}
${isPlace(k) ? svg`<a href="/states/${k}/">${name}</a>` : name}
${xs.length > 1 ? svg`<line x1="${Math.min(...xs)}" x2="${Math.max(...xs)}" y1="${y}" y2="${y}" stroke="var(--other-line)"/>` : null}
${[...vs].sort((a, b) => Number(hollow.includes(b.s.key)) - Number(hollow.includes(a.s.key))).map((v) => {
  // An open ring is a size larger and drawn first, so a filled dot inside it never hides it,
  // and equal values show both marks.
  const ring = hollow.includes(v.s.key)
  return svg`<circle cx="${x(v.p!.y!)}" cy="${y}" r="${ring ? 6.5 : 4}" fill="${ring ? 'var(--paper)' : colorVar(v.s.color)}" stroke="${ring ? colorVar(v.s.color) : 'var(--paper)'}" stroke-width="1.5"/>`
})}</g>`
  })
  const rankText = ranked ? svg`<text x="${ownLine ? 0 : W}" y="${ownLine ? 12 + keyRows * KEY_ROW - 2 : 12}" text-anchor="${ownLine ? 'start' : 'end'}" font-size="12.5" fill="var(--slate)">${ranked}</text>` : null
  return frame(width, H, chart.title, svg`${legend(series, hollow, 12, W)}${rankText}${grid}${valueRefs(chart.refs, x, m.top - 6, H - m.bottom)}${rows}`)
}
