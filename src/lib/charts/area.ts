import { scaleLinear } from 'd3-scale'
import { area as d3area, stack, type Series, type SeriesPoint } from 'd3-shape'
import type { Point } from '~/lib/data'
import { parsePeriod } from '~/lib/period'
import { svg, attr, type Markup } from '~/lib/markup'
import { colorVar } from '~/lib/tokens'
import { WIDTH, frame, hit, spread, timeTicks, xLabels, yGrid, yRoom, yScale, yTicks, type Width } from './axes'
import { drawn, show, tipLine, type Of, type SeriesData } from './model'
import { timeNotes } from './notes'

type Stack = { series: SeriesData[]; xs: Point[]; layers: Series<Record<string, number>, string>[] }

/**
 * Stack each method segment on its own. Series that start before a break form one
 * stack, the rest another, so shares on two bases never add up to 200%.
 */
function stacksOf(chart: Of<'area'>, series: SeriesData[]): Stack[] {
  const cut = chart.breaks?.[0] ? parsePeriod(chart.breaks[0].x).t : Infinity
  const groups = [series.filter((s) => (s.points[0]?.t ?? 0) < cut), series.filter((s) => (s.points[0]?.t ?? 0) >= cut)]
  return groups
    .filter((g) => g.length > 0)
    .map((g) => {
      const xs = [...new Map(g.flatMap((s) => s.points).map((p) => [p.x, p])).values()].sort((a, b) => a.t - b.t)
      // One row per period; a missing part counts as zero so the stack stays closed.
      const rows = xs.map((p) => ({ t: p.t, ...Object.fromEntries(g.map((s) => [s.key, s.points.find((q) => q.x === p.x)?.y ?? 0])) }))
      return { series: g, xs, layers: stack<Record<string, number>>().keys(g.map((s) => s.key))(rows) }
    })
}

/** Stacked areas: shares or parts of a total over time. Segments are split by 2 px white gaps. */
export function renderArea(chart: Of<'area'>, width: Width): Markup {
  const series = drawn(chart)
  const narrow = width === 'narrow'
  const W = WIDTH[width]
  const H = narrow ? 280 : 380
  const stacks = stacksOf(chart, series)
  const tops = stacks.flatMap((g) => g.layers.at(-1)!.map((d) => d[1]))
  const m = { top: 16, right: narrow ? 96 : 170, bottom: 30, left: yRoom(tops, chart.y, chart.format) }
  const xs = [...new Map(stacks.flatMap((g) => g.xs).map((p) => [p.x, p])).values()].sort((a, b) => a.t - b.t)
  const x = scaleLinear().domain([xs[0]!.t, xs.at(-1)!.t]).range([m.left, W - m.right])
  const y = yScale(tops, [H - m.bottom, m.top], chart.y)
  const shape = d3area<SeriesPoint<Record<string, number>>>()
    .x((d) => x(d.data.t!))
    .y0((d) => y(d[0]))
    .y1((d) => y(d[1]))

  const tOf = new Map(xs.map((p) => [p.x, p.t]))
  const notes = timeNotes(chart, { xOf: (v) => (tOf.has(v) ? x(tOf.get(v)!) : undefined), y, top: m.top, bottom: H - m.bottom, right: W - m.right, series, endLabels: true })
  const areas = stacks.flatMap((g) =>
    g.series.map((s, i) => svg`<path d="${shape(g.layers[i]!) ?? ''}" fill="${colorVar(s.color)}" stroke="var(--paper)" stroke-width="2" stroke-linejoin="round"/>`),
  )
  // End labels name the parts of the latest stack only.
  const end = stacks.at(-1)!
  const last = end.xs.at(-1)!
  const labels = spread(
    end.series.map((s, i) => {
      const top = end.layers[i]!.at(-1)!
      return { s, y: y((top[0] + top[1]) / 2) }
    }),
    28,
    m.top,
    H - m.bottom,
  ).map(({ s, ly }) => {
    const p = s.points.find((q) => q.x === last.x)
    const v = p && p.y !== null ? show(chart, p, s) : undefined
    return svg`<text x="${W - m.right + 8}" y="${ly - 2}" font-size="12" font-weight="600" fill="var(--ink)">${s.label}</text>
<text x="${W - m.right + 8}" y="${ly + 12}" font-size="12" fill="var(--ink)"${attr('data-alt', v?.alt)}>${v?.text ?? 'No data'}</text>`
  })
  const hits = xs.map((p, i) => {
    const x0 = i ? (x(xs[i - 1]!.t) + x(p.t)) / 2 : x(p.t) - 4
    const x1 = i < xs.length - 1 ? (x(xs[i + 1]!.t) + x(p.t)) / 2 : x(p.t) + 4
    const here = [...series].reverse().filter((s) => s.points.some((v) => v.x === p.x))
    return hit(x0, m.top, x1 - x0, H - m.top - m.bottom, [p.label, ...here.map((s) => tipLine(chart, s, s.points.find((v) => v.x === p.x)))].join('\n'))
  })
  return frame(
    width,
    H,
    chart.title,
    svg`${yGrid(y, yTicks(y, chart.y), m.left, W - m.right, chart.format)}${areas}${notes.under}
${xLabels(timeTicks(xs, x, narrow ? 4 : 8), H - m.bottom)}${labels}${notes.over}<g class="hits">${hits}</g>`,
  )
}
