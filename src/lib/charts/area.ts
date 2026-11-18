import { scaleLinear } from 'd3-scale'
import { area as d3area, stack, type SeriesPoint } from 'd3-shape'
import { svg, attr, type Markup } from '~/lib/markup'
import { colorVar } from '~/lib/tokens'
import { WIDTH, frame, hit, spread, timeTicks, xLabels, yGrid, yScale, yTicks, type Width } from './axes'
import { drawn, show, type Of } from './model'
import { timeNotes } from './notes'

/** Stacked areas: shares or parts of a total over time. Segments are split by 2 px white gaps. */
export function renderArea(chart: Of<'area'>, width: Width): Markup {
  const series = drawn(chart)
  const narrow = width === 'narrow'
  const W = WIDTH[width]
  const H = narrow ? 280 : 380
  const m = { top: 16, right: narrow ? 96 : 170, bottom: 30, left: 48 }
  const xs = [...new Map(series.flatMap((s) => s.points).map((p) => [p.x, p])).values()].sort((a, b) => a.t - b.t)
  // One row per period; a missing part counts as zero so the stack stays closed.
  const table = xs.map((p) => ({ t: p.t, ...Object.fromEntries(series.map((s) => [s.key, s.points.find((q) => q.x === p.x)?.y ?? 0])) }))
  const stacks = stack<Record<string, number>>().keys(series.map((s) => s.key))(table as Record<string, number>[])
  const x = scaleLinear().domain([xs[0]!.t, xs.at(-1)!.t]).range([m.left, W - m.right])
  const y = yScale(stacks.at(-1)!.map((d) => d[1]), [H - m.bottom, m.top], chart.y)
  const shape = d3area<SeriesPoint<Record<string, number>>>()
    .x((d) => x(d.data.t!))
    .y0((d) => y(d[0]))
    .y1((d) => y(d[1]))

  const tOf = new Map(xs.map((p) => [p.x, p.t]))
  const notes = timeNotes(chart, { xOf: (v) => (tOf.has(v) ? x(tOf.get(v)!) : undefined), y, top: m.top, bottom: H - m.bottom, series, endLabels: true })
  const areas = series.map(
    (s, i) => svg`<path d="${shape(stacks[i]!) ?? ''}" fill="${colorVar(s.color)}" stroke="var(--paper)" stroke-width="2" stroke-linejoin="round"/>`,
  )
  const last = xs.at(-1)!
  const labels = spread(
    series.map((s, i) => {
      const top = stacks[i]!.at(-1)!
      return { s, y: y((top[0] + top[1]) / 2) }
    }),
    28,
    m.top,
    H - m.bottom,
  ).map(({ s, ly }) => {
    const p = s.points.find((q) => q.x === last.x)
    const v = p && p.y !== null ? show(chart, p) : undefined
    return svg`<text x="${W - m.right + 8}" y="${ly - 2}" font-size="12" font-weight="600" fill="var(--ink)">${s.label}</text>
<text x="${W - m.right + 8}" y="${ly + 12}" font-size="12" fill="var(--ink)"${attr('data-alt', v?.alt)}>${v?.text ?? 'No data'}</text>`
  })
  const hits = xs.map((p, i) => {
    const x0 = i ? (x(xs[i - 1]!.t) + x(p.t)) / 2 : x(p.t) - 4
    const x1 = i < xs.length - 1 ? (x(xs[i + 1]!.t) + x(p.t)) / 2 : x(p.t) + 4
    const lines = [...series].reverse().map((s) => {
      const q = s.points.find((v) => v.x === p.x)
      return `${s.label}: ${q && q.y !== null ? show(chart, q).text : 'No data'}`
    })
    return hit(x0, m.top, x1 - x0, H - m.top - m.bottom, [p.label, ...lines].join('\n'))
  })
  return frame(
    width,
    H,
    chart.title,
    svg`${yGrid(y, yTicks(y, chart.y), m.left, W - m.right, chart.format)}${areas}${notes.under}
${xLabels(timeTicks(xs, x, narrow ? 4 : 8), H - m.bottom)}${labels}${notes.over}<g class="hits">${hits}</g>`,
  )
}
