/**
 * Slope: two periods per state or UT, one scale at both ends. A line joins a state's two values;
 * a state with one value keeps its dot and no line. India is drawn in ink.
 */
import { scaleLinear } from 'd3-scale'
import type { Format } from '~/content/types'
import { decimalsOf, fmt } from '~/lib/format'
import { INDIA, places } from '~/lib/geography'
import { svg, type Markup } from '~/lib/markup'
import { WIDTH, frame, tipAttr, type Width } from './axes'
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

/**
 * Label positions for points at `y`, in order, at least `gap` apart and inside [lo, hi]. Each
 * label moves no further than its neighbours force it.
 */
export function stack(ys: readonly number[], gap: number, lo: number, hi: number): number[] {
  const order = ys.map((y, i) => ({ y, i })).sort((a, b) => a.y - b.y)
  const n = order.length
  const at = order.map((o) => o.y)
  for (let k = 0; k < n; k++) at[k] = Math.max(at[k]!, lo + k * gap, k ? at[k - 1]! + gap : -Infinity)
  for (let k = n - 1; k >= 0; k--) at[k] = Math.min(at[k]!, hi - (n - 1 - k) * gap, k < n - 1 ? at[k + 1]! - gap : Infinity)
  // Pull each run of touching labels back towards the middle of its points.
  for (let start = 0; start < n; ) {
    let end = start
    while (end + 1 < n && at[end + 1]! - at[end]! <= gap + 1e-9) end++
    const want = order.slice(start, end + 1).reduce((a, o) => a + o.y, 0) / (end - start + 1)
    const have = (at[start]! + at[end]!) / 2
    const shift = Math.max(lo - at[start]!, Math.min(hi - at[end]!, want - have))
    const prev = start ? at[start - 1]! + gap : -Infinity
    const next = end < n - 1 ? at[end + 1]! - gap : Infinity
    const ok = Math.max(prev - at[start]!, Math.min(next - at[end]!, shift))
    for (let k = start; k <= end; k++) at[k]! += ok
    start = end + 1
  }
  const out: number[] = new Array(n)
  order.forEach((o, k) => (out[o.i] = at[k]!))
  return out
}

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
  // Labels sit a little away from the axis, so a leader can fan out to a label moved off its point.
  const off = compact ? 14 : 30
  const side = Math.min(compact ? 128 : 260, off + 8 + longest * 6.3)
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
    const items = rows.filter((r) => named.has(r.key) && r[end])
    const ly = stack(items.map((r) => y(r[end]!.y!)), gap, top, top + plotH + 4)
    return new Map(items.map((r, i) => [r.key, ly[i]!]))
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
      const dir = end === 'a' ? -1 : 1
      const axis = end === 'a' ? x0 : x1
      const at = axis + dir * off
      const py = y(p.y!)
      const ly = (end === 'a' ? left : right).get(r.key) ?? py
      const text = end === 'a' ? leftText(r) : rightText(r)
      const anchor = end === 'a' ? 'end' : 'start'
      const leader = svg`<path d="M${axis + dir * 5} ${py}L${at - dir * 4} ${ly - 4}" stroke="var(--other-line)" stroke-width="0.75" fill="none"/>`
      return shown
        ? svg`${leader}<text class="slope-label" x="${at}" y="${ly}" text-anchor="${anchor}" font-size="12" font-weight="${weight}" fill="var(--ink)">${text}</text>`
        : svg`<text class="slope-label sel-label" display="none" x="${axis + dir * 8}" y="${py + 4}" text-anchor="${anchor}" font-size="12" font-weight="600" fill="var(--ink)" paint-order="stroke" stroke="var(--paper)" stroke-width="3">${text}</text>`
    }
    const aria = tip(r)().replace(/\n/g, '; ')
    const body = svg`${line}${dots}${hitLine}`
    return svg`<g class="slope" data-geo="${r.key}"${tipAttr(tip(r))}>${r.key === INDIA ? body : svg`<a href="/states/${r.key}/" aria-label="${aria}">${body}</a>`}${label('a')}${label('b')}</g>`
  })
  const missNote = missLines.map((l, i) => svg`<text x="0" y="${top + plotH + 30 + i * 17}" font-size="12" fill="var(--slate)">${l}</text>`)
  return frame(width, H, chart.title, svg`${head}<g class="slopes">${marks}</g>${missNote}`)
}
