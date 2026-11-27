/**
 * Scatter: one dot per state or UT at its values on two measures. India is a pair of crossed
 * reference lines, not a dot. No fitted line: the chart shows an association, never a cause.
 */
import { scaleLinear } from 'd3-scale'
import type { Format } from '~/content/types'
import { fmt } from '~/lib/format'
import { INDIA, places, type Place } from '~/lib/geography'
import { svg, type Markup } from '~/lib/markup'
import { FONT, WIDTH, frame, tipAttr, yGrid, type Width } from './axes'
import { seriesOf, show, type Of, type SeriesData } from './model'
import type { Point } from '~/lib/data'

/** A short name for a label on the plot: "Andhra", "W Bengal", "J&K". */
export const plotName = (p: Place): string => p.short.replace('-', '')

interface Box {
  l: number
  t: number
  r: number
  b: number
}
const overlaps = (a: Box, b: Box): boolean => a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t

/** Lines of "No data: A, B." that wrap at `chars` characters. */
export function wrapList(head: string, names: readonly string[], chars: number): string[] {
  const out: string[] = []
  for (const word of names.length ? `${head} ${names.join(', ')}.`.split(' ') : []) {
    const last = out.at(-1)
    if (last !== undefined && last.length + word.length + 1 <= chars) out[out.length - 1] = `${last} ${word}`
    else out.push(word)
  }
  return out
}

export interface ScatterPoint {
  place: Place
  x: Point
  y: Point
}

/** The states and UTs with a value on both measures, and India's pair. */
export function scatterData(chart: Of<'scatter'>): { sx: SeriesData; sy: SeriesData; pts: ScatterPoint[]; india?: { x?: Point; y?: Point }; none: Place[] } {
  const [sx, sy] = seriesOf(chart) as [SeriesData, SeriesData]
  const at = (s: SeriesData, k: string) => s.points.find((p) => p.x === k && p.y !== null)
  const pts = places.flatMap((place) => {
    const x = at(sx, place.slug)
    const y = at(sy, place.slug)
    return x && y ? [{ place, x, y }] : []
  })
  const none = places.filter((p) => !pts.some((q) => q.place === p))
  const ix = at(sx, INDIA)
  const iy = at(sy, INDIA)
  return { sx, sy, pts, india: ix || iy ? { x: ix, y: iy } : undefined, none }
}

export function renderScatter(chart: Of<'scatter'>, width: Width): Markup {
  const { sx, sy, pts, india, none } = scatterData(chart)
  const compact = width !== 'wide'
  const W = WIDTH[width]
  const fx: Format | undefined = sx.format ?? chart.format
  const fy: Format | undefined = sy.format ?? chart.format
  const xs = [...pts.map((p) => p.x.y!), ...(india?.x ? [india.x.y!] : [])]
  const ys = [...pts.map((p) => p.y.y!), ...(india?.y ? [india.y.y!] : [])]
  const y = scaleLinear()
    .domain([chart.y.axis?.min ?? Math.min(...ys), chart.y.axis?.max ?? Math.max(...ys)])
    .nice(5)
  const yTicks = y.ticks(5)
  const tickW = Math.max(...yTicks.map((t, i) => fmt(t, { ...fy, decimals: undefined, ...(i === yTicks.length - 1 ? {} : { unit: fy?.unit === '%' ? '%' : '' }) }).length))
  const m = { top: 34, right: compact ? 12 : 20, bottom: 52, left: Math.max(36, tickW * 7 + 14) }
  // Short enough that the social image (1200 by 630) can show the plot, not its table.
  const plotH = width === 'wide' ? 340 : width === 'half' ? 330 : 300
  const missLines = wrapList('No data:', none.map((p) => p.name), Math.floor(W / 6.4))
  const H = m.top + plotH + m.bottom + (missLines.length ? 8 + missLines.length * 17 : 0)
  y.range([m.top + plotH, m.top])
  const x = scaleLinear()
    .domain([chart.x.axis?.min ?? Math.min(...xs), chart.x.axis?.max ?? Math.max(...xs)])
    .nice(6)
    .range([m.left, W - m.right])
  const bottom = m.top + plotH
  const grid = yGrid(y, yTicks, m.left, W - m.right, fy)
  // As many x ticks as fit, each label with room to spare.
  const xLabel = (t: number) => fmt(t, { ...fx, decimals: undefined })
  const fits = (ts: number[]) => ts.length * (Math.max(...ts.map((t) => xLabel(t).length)) * 6.8 + 16) <= W - m.left - m.right
  const xTicks = [6, 5, 4, 3, 2].map((n) => x.ticks(n)).find(fits) ?? x.ticks(2)
  const xGrid = svg`<g class="x-grid">${xTicks.map((t, i) => {
    const label = xLabel(t)
    const anchor = i === xTicks.length - 1 && x(t) + label.length * 3.4 > W ? 'end' : 'middle'
    return svg`<line x1="${x(t)}" x2="${x(t)}" y1="${m.top}" y2="${bottom}" stroke="var(--grid)"/>
<text x="${x(t)}" y="${bottom + 16}" text-anchor="${anchor}" font-family="${FONT.mono}" font-size="11" fill="var(--slate)">${label}</text>`
  })}</g>`
  // Axis titles: the measure and its unit, at the top of the y axis and the right of the x axis.
  const titles = svg`<text x="0" y="14" font-size="12.5" font-weight="600" fill="var(--ink)">${sy.label}</text>
<text x="${W - m.right}" y="${bottom + 38}" text-anchor="end" font-size="12.5" font-weight="600" fill="var(--ink)">${sx.label}</text>`

  const r = compact ? 4 : 4.5
  const at = pts.map((p) => ({ ...p, cx: x(p.x.y!), cy: y(p.y.y!) }))
  // Each dot is taken space for labels, except its own.
  const dots: Box[] = at.map((p) => ({ l: p.cx - r, t: p.cy - r, r: p.cx + r, b: p.cy + r }))
  const clear = (b: Box) => !dots.some((d) => overlaps(d, b))

  // India: a vertical and a horizontal line at its two values, each labelled clear of the dots.
  const taken: Box[] = []
  let indiaMarks: Markup | null = null
  if (india) {
    const parts: Markup[] = []
    const label = (tries: { x: number; y: number; anchor: 'start' | 'end' }[], text: string) => {
      const w = text.length * 6.6
      const boxes = tries.map((t) => ({ ...t, box: { l: t.anchor === 'start' ? t.x : t.x - w, t: t.y - 11, r: t.anchor === 'start' ? t.x + w : t.x, b: t.y + 3 } }))
      const fit = boxes.filter((t) => t.box.l >= m.left - 2 && t.box.r <= W && t.box.t >= m.top - 4 && t.box.b <= bottom)
      const best = fit.find((t) => clear(t.box)) ?? fit[0] ?? boxes[0]!
      taken.push(best.box)
      return svg`<text x="${best.x}" y="${best.y}" text-anchor="${best.anchor}" font-size="12" font-weight="600" fill="var(--ink)" paint-order="stroke" stroke="var(--paper)" stroke-width="3">${text}</text>`
    }
    if (india.x) {
      const ix = x(india.x.y!)
      parts.push(svg`<line x1="${ix}" x2="${ix}" y1="${m.top}" y2="${bottom}" stroke="var(--ink)" stroke-width="1.25"/>`)
      parts.push(label([{ x: ix + 4, y: m.top + 10, anchor: 'start' }, { x: ix - 4, y: m.top + 10, anchor: 'end' }, { x: ix + 4, y: bottom - 6, anchor: 'start' }, { x: ix - 4, y: bottom - 6, anchor: 'end' }], `India ${show(chart, india.x, sx).text}`))
    }
    if (india.y) {
      const iy = y(india.y.y!)
      const R = W - m.right
      parts.push(svg`<line x1="${m.left}" x2="${R}" y1="${iy}" y2="${iy}" stroke="var(--ink)" stroke-width="1.25"/>`)
      parts.push(label([{ x: R, y: iy - 5, anchor: 'end' }, { x: R, y: iy + 14, anchor: 'end' }, { x: m.left + 4, y: iy - 5, anchor: 'start' }, { x: m.left + 4, y: iy + 14, anchor: 'start' }], `India ${show(chart, india.y, sy).text}`))
    }
    indiaMarks = svg`<g class="india">${parts}</g>`
  }

  // Which dots get a label: the chosen outliers first, then (on the page) those furthest from
  // the middle of the cloud, while a label still fits clear of every dot and label.
  const named = new Set(chart.labels ?? [])
  const mx = at.reduce((a, p) => a + p.cx, 0) / Math.max(1, at.length)
  const my = at.reduce((a, p) => a + p.cy, 0) / Math.max(1, at.length)
  const order = [...at].sort((a, b) => Number(named.has(b.place.slug)) - Number(named.has(a.place.slug)) || Math.hypot(b.cx - mx, b.cy - my) - Math.hypot(a.cx - mx, a.cy - my))
  const labelOf = new Map<string, { x: number; y: number; anchor: 'start' | 'end' }>()
  const spot = (p: (typeof at)[number]) => {
    const text = plotName(p.place)
    const w = text.length * 6.4
    const tries = [
      { x: p.cx + r + 3, y: p.cy + 4, anchor: 'start' as const, l: p.cx + r + 2, t: p.cy - 7 },
      { x: p.cx - r - 3, y: p.cy + 4, anchor: 'end' as const, l: p.cx - r - 3 - w, t: p.cy - 7 },
      { x: p.cx - w / 2, y: p.cy - r - 4, anchor: 'start' as const, l: p.cx - w / 2, t: p.cy - r - 15 },
      { x: p.cx - w / 2, y: p.cy + r + 12, anchor: 'start' as const, l: p.cx - w / 2, t: p.cy + r + 1 },
    ]
    return tries.map((t) => ({ ...t, box: { l: t.l, t: t.t, r: t.l + w, b: t.t + 13 } }))
  }
  const inside = (b: Box) => b.l >= m.left && b.r <= W - 2 && b.t >= m.top - 2 && b.b <= bottom
  for (const p of order) {
    if (compact && !named.has(p.place.slug)) continue
    const own = dots[at.indexOf(p)]!
    const free = spot(p).find((s) => inside(s.box) && ![...taken, ...dots.filter((d) => d !== own)].some((o) => overlaps(o, s.box)))
    if (!free) continue
    taken.push(free.box)
    labelOf.set(p.place.slug, free)
  }

  const tipFor = (p: ScatterPoint) => () => [p.place.name, `${sx.label}: ${show(chart, p.x, sx).text}`, `${sy.label}: ${show(chart, p.y, sy).text}`].join('\n')
  // Keyboard order runs left to right.
  const marks = [...at]
    .sort((a, b) => a.cx - b.cx)
    .map((p) => {
      const l = labelOf.get(p.place.slug)
      const name = plotName(p.place)
      // A dot with no label still carries one, shown only when its state is selected.
      const label = l
        ? svg`<text class="pt-label" x="${l.x}" y="${l.y}" text-anchor="${l.anchor}" font-size="11.5" fill="var(--ink)" paint-order="stroke" stroke="var(--paper)" stroke-width="3">${name}</text>`
        : svg`<text class="pt-label sel-label" display="none" x="${p.cx + r + 3}" y="${p.cy + 4}" font-size="11.5" font-weight="600" fill="var(--ink)" paint-order="stroke" stroke="var(--paper)" stroke-width="3">${name}</text>`
      const aria = `${p.place.name}: ${sx.label} ${show(chart, p.x, sx).text}; ${sy.label} ${show(chart, p.y, sy).text}`
      return svg`<g class="pt" data-geo="${p.place.slug}"${tipAttr(tipFor(p))}><a href="/states/${p.place.slug}/" aria-label="${aria}"><circle class="dot" cx="${p.cx}" cy="${p.cy}" r="${r}" fill="var(--slate)" stroke="var(--paper)" stroke-width="1.25"/><circle cx="${p.cx}" cy="${p.cy}" r="${r + 5}" fill="transparent"/></a>${label}</g>`
    })
  const missNote = missLines.map((line, i) => svg`<text x="0" y="${bottom + 62 + i * 17}" font-size="12" fill="var(--slate)">${line}</text>`)
  return frame(width, H, chart.title, svg`${titles}${grid}${xGrid}${indiaMarks}<g class="pts">${marks}</g>${missNote}`)
}
