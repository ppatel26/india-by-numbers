import { scaleLinear } from 'd3-scale'
import { INDIA, geoName, isPlace, place } from '~/lib/geography'
import { svg, type Markup } from '~/lib/markup'
import { colorVar } from '~/lib/tokens'
import { FONT, WIDTH, frame, valueRefs, type Width } from './axes'
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

export function legend(series: readonly SeriesData[], hollow: readonly string[] = [], y = 12): Markup {
  let x = 0
  return svg`<g class="key">${series.map((s) => {
    const at = x
    x += 30 + s.label.length * 7
    const ring = hollow.includes(s.key)
    return svg`<circle cx="${at + 6}" cy="${y - 4}" r="5" fill="${ring ? 'var(--paper)' : colorVar(s.color)}" stroke="${colorVar(s.color)}" stroke-width="1.5"/>
<text x="${at + 16}" y="${y}" font-size="12.5" fill="var(--ink)">${s.label}</text>`
  })}</g>`
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
  const rowH = 20
  const m = { top: 40, right: 24, bottom: 28, left: nameColumn(keys.map((k) => rowName(k)), narrow) }
  const H = m.top + keys.length * rowH + m.bottom
  const all = series.flatMap((s) => s.points.flatMap((p) => (p.y === null ? [] : [p.y])))
  const refVals = (chart.refs ?? []).map((r) => r.value)
  // A dot's position carries the value, so the axis need not start at zero.
  const lo = chart.axis?.min ?? Math.min(...all, ...refVals)
  const hi = chart.axis?.max ?? Math.max(...all, ...refVals)
  const x = scaleLinear().domain([lo, hi]).nice().range([m.left, W - m.right])
  const ticks = x.ticks(narrow ? 4 : 6)

  const grid = svg`${ticks.map((t) => svg`<line x1="${x(t)}" x2="${x(t)}" y1="${m.top - 6}" y2="${H - m.bottom}" stroke="var(--grid)"/>
<text x="${x(t)}" y="${H - m.bottom + 16}" text-anchor="middle" font-family="${FONT.mono}" font-size="11" fill="var(--slate)">${fmt(t, { ...chart.format, decimals: undefined })}</text>`)}`

  const rows = keys.map((k, i) => {
    const y = m.top + i * rowH + rowH / 2
    const vs = series.map((s) => ({ s, p: val(s, k) })).filter((v) => v.p?.y != null)
    const xs = vs.map((v) => x(v.p!.y!))
    const india = k === INDIA
    const tip = [rowName(k, false), ...series.map((s) => tipLine(chart, s, val(s, k)))].join('\n')
    const label = rowName(k)
    const name = svg`<text class="name" x="${m.left - 8}" y="${y + 4}" text-anchor="end" font-size="12.5" font-weight="${india ? 600 : 400}" fill="var(--ink)">${narrow && label.length > 17 ? `${label.slice(0, 15)}…` : label}</text>`
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
  return frame(width, H, chart.title, svg`${legend(series, hollow)}${grid}${valueRefs(chart.refs, x, m.top - 6, H - m.bottom)}${rows}`)
}
