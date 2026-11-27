/**
 * Slope: two periods per state or UT, one scale at both ends. A line joins a state's two values;
 * a state with one value keeps its dot and no line. India is drawn in ink.
 */
import { scaleLinear } from 'd3-scale'
import type { Format } from '~/content/types'
import { decimalsOf, fmt } from '~/lib/format'
import { INDIA, places } from '~/lib/geography'
import { svg, type Markup } from '~/lib/markup'
import { WIDTH, frame, spread, tipAttr, type Width } from './axes'
import { fitRow, rowName } from './dots'
import { drawn, show, type Of, type SeriesData } from './model'
import { wrapList } from './scatter'
import type { Point } from '~/lib/data'

export interface SlopeRow {
  key: string
  a?: Point
  b?: Point
  /** b minus a, to the data's digits; undefined when either end is missing. */
  change?: number
}

/** India first, then the states and UTs with a value at either end, in name order. */
export function slopeRows(chart: Of<'slope'>): { a: SeriesData; b: SeriesData; rows: SlopeRow[]; none: string[] } {
  const [a, b] = drawn(chart) as [SeriesData, SeriesData]
  const at = (s: SeriesData, k: string) => s.points.find((p) => p.x === k && p.y !== null)
  const keys = [INDIA, ...places.map((p) => p.slug)]
  const rows = keys.flatMap((key): SlopeRow[] => {
    const pa = at(a, key)
    const pb = at(b, key)
    if (!pa && !pb) return []
    const d = Math.max(decimalsOf(pa?.raw ?? ''), decimalsOf(pb?.raw ?? ''))
    return [{ key, a: pa, b: pb, change: pa && pb ? +(pb.y! - pa.y!).toFixed(d) : undefined }]
  })
  const none = places.filter((p) => !rows.some((r) => r.key === p.slug)).map((p) => p.name)
  return { a, b, rows, none }
}

/** The change in the chart's unit: a rate in % changes by percentage points. */
export const changeFormat = (f: Format | undefined, d: number): Format => ({ ...f, unit: f?.unit === '%' ? 'pp' : f?.unit, signed: true, decimals: d, scale: 'none' })

/** The rows with the largest change either way, India aside. */
export function movers(rows: readonly SlopeRow[], n: number): string[] {
  return rows
    .filter((r) => r.key !== INDIA && r.change !== undefined)
    .sort((x, y) => Math.abs(y.change!) - Math.abs(x.change!))
    .slice(0, n)
    .map((r) => r.key)
}

export function renderSlope(chart: Of<'slope'>, width: Width): Markup {
  const { a, b, rows, none } = slopeRows(chart)
  const compact = width !== 'wide'
  const W = WIDTH[width]
  const name = (k: string) => (compact ? fitRow(k, 12) : rowName(k))
  const val = (p: Point, s: SeriesData) => show(chart, p, s).text
  // On phones: India, the chosen rows and the largest movers carry labels; every other row has one
  // that shows only when its state is selected.
  const named = new Set([INDIA, ...(chart.labels ?? []), ...(compact ? movers(rows, 3) : rows.map((r) => r.key))])
  const leftText = (r: SlopeRow) => `${name(r.key)} ${val(r.a!, a)}`
  const rightText = (r: SlopeRow) => `${val(r.b!, b)} ${name(r.key)}`
  const longest = Math.max(...rows.flatMap((r) => [r.a ? leftText(r).length : 0, r.b ? rightText(r).length : 0]))
  const side = Math.min(compact ? 124 : 250, 12 + longest * 6.3)
  const x0 = side
  const x1 = W - side
  const all = rows.flatMap((r) => [r.a?.y, r.b?.y].filter((v): v is number => v != null))
  const top = 34
  const gap = 13
  const plotH = compact ? 330 : Math.max(380, rows.length * gap + 10)
  const y = scaleLinear()
    .domain([chart.axis?.min ?? Math.min(...all), chart.axis?.max ?? Math.max(...all)])
    .nice(5)
    .range([top + plotH, top])
  const missLines = wrapList('No data:', none, Math.floor(W / 6.4))
  const H = top + plotH + 20 + (missLines.length ? missLines.length * 17 : 0)

  // Labels at each end, spread so none touch; the line runs to the point, a leader to the label.
  const place = (end: 'a' | 'b') => {
    const items = rows.filter((r) => named.has(r.key) && r[end]).map((r) => ({ key: r.key, y: y(r[end]!.y!) }))
    return new Map(spread(items, gap, top - 4, top + plotH + 4).map((i) => [i.key, i.ly]))
  }
  const left = place('a')
  const right = place('b')
  const headY = 14
  const head = svg`<text x="${x0}" y="${headY}" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">${a.label}</text>
<text x="${x1}" y="${headY}" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">${b.label}</text>
<line x1="${x0}" x2="${x0}" y1="${top - 6}" y2="${top + plotH}" stroke="var(--grid)"/>
<line x1="${x1}" x2="${x1}" y1="${top - 6}" y2="${top + plotH}" stroke="var(--grid)"/>`

  const d = Math.max(0, ...rows.flatMap((r) => [decimalsOf(r.a?.raw ?? ''), decimalsOf(r.b?.raw ?? '')]))
  const tip = (r: SlopeRow) => () =>
    [rowName(r.key, false), `${a.label}: ${r.a ? val(r.a, a) : 'No data'}`, `${b.label}: ${r.b ? val(r.b, b) : 'No data'}`, ...(r.change !== undefined ? [`Change: ${fmt(r.change, changeFormat(a.format ?? chart.format, d))}`] : [])].join('\n')
  // India last, so its line sits on top.
  const ordered = [...rows].sort((p, q) => Number(p.key === INDIA) - Number(q.key === INDIA))
  const marks = ordered.map((r) => {
    const india = r.key === INDIA
    const ya = r.a ? y(r.a.y!) : undefined
    const yb = r.b ? y(r.b.y!) : undefined
    const stroke = india ? 'var(--ink)' : 'var(--other-line)'
    const line = ya !== undefined && yb !== undefined ? svg`<line class="slope-line" x1="${x0}" y1="${ya}" x2="${x1}" y2="${yb}" stroke="${stroke}" stroke-width="${india ? 2.5 : 1.25}"/>` : null
    const hitLine = ya !== undefined && yb !== undefined ? svg`<line x1="${x0}" y1="${ya}" x2="${x1}" y2="${yb}" stroke="transparent" stroke-width="9"/>` : null
    const dots = svg`${ya !== undefined ? svg`<circle class="slope-dot" cx="${x0}" cy="${ya}" r="${india ? 4 : 3}" fill="${stroke}"/>` : null}${yb !== undefined ? svg`<circle class="slope-dot" cx="${x1}" cy="${yb}" r="${india ? 4 : 3}" fill="${stroke}"/>` : null}`
    const shown = named.has(r.key)
    const weight = india ? 600 : 400
    const label = (end: 'a' | 'b') => {
      const p = r[end]
      if (!p) return null
      const at = end === 'a' ? x0 - 8 : x1 + 8
      const py = y(p.y!)
      const ly = (end === 'a' ? left : right).get(r.key) ?? py
      const text = end === 'a' ? leftText(r) : rightText(r)
      const anchor = end === 'a' ? 'end' : 'start'
      const leader = shown && Math.abs(ly - py) > 3 ? svg`<path d="M${end === 'a' ? x0 - 2 : x1 + 2} ${py}L${at + (end === 'a' ? 3 : -3)} ${ly - 4}" stroke="var(--grid)" fill="none"/>` : null
      return shown
        ? svg`${leader}<text class="slope-label" x="${at}" y="${ly}" text-anchor="${anchor}" font-size="12" font-weight="${weight}" fill="var(--ink)">${text}</text>`
        : svg`<text class="slope-label sel-label" display="none" x="${at}" y="${py + 4}" text-anchor="${anchor}" font-size="12" font-weight="600" fill="var(--ink)" paint-order="stroke" stroke="var(--paper)" stroke-width="3">${text}</text>`
    }
    const aria = tip(r)().replace(/\n/g, '; ')
    const body = svg`${line}${dots}${hitLine}`
    return svg`<g class="slope" data-geo="${r.key}"${tipAttr(tip(r))}>${r.key === INDIA ? body : svg`<a href="/states/${r.key}/" aria-label="${aria}">${body}</a>`}${label('a')}${label('b')}</g>`
  })
  const missNote = missLines.map((l, i) => svg`<text x="0" y="${top + plotH + 30 + i * 17}" font-size="12" fill="var(--slate)">${l}</text>`)
  return frame(width, H, chart.title, svg`${head}<g class="slopes">${marks}</g>${missNote}`)
}
