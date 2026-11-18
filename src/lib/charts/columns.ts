import { scaleBand } from 'd3-scale'
import type { Point } from '~/lib/data'
import { svg, type Markup } from '~/lib/markup'
import { colorVar } from '~/lib/tokens'
import { WIDTH, frame, hit, xLabels, yGrid, yScale, yTicks, type Width } from './axes'
import { drawn, show, type Of } from './model'
import { timeNotes } from './notes'

/** Columns over time. Series that share an x sit side by side, or stack when `stacked`. */
export function renderColumns(chart: Of<'columns'>, width: Width): Markup {
  const series = drawn(chart)
  const narrow = width === 'narrow'
  const W = WIDTH[width]
  const H = narrow ? 260 : 340
  const m = { top: 16, right: 12, bottom: 30, left: 40 }
  const xs = [...new Map(series.flatMap((s) => s.points).map((p) => [p.x, p])).values()].sort((a, b) => a.t - b.t)
  const x = scaleBand<string>().domain(xs.map((p) => p.x)).range([m.left, W - m.right]).paddingInner(0.2)

  const at = (x: string) => series.map((s) => ({ s, p: s.points.find((q) => q.x === x) })).filter((v) => v.p?.y != null)
  const totals = xs.map((p) => at(p.x).reduce((a, v) => a + (chart.stacked ? v.p!.y! : 0), 0))
  const values = chart.stacked ? totals : series.flatMap((s) => s.points.flatMap((p) => (p.y === null ? [] : [p.y])))
  const y = yScale(values, [H - m.bottom, m.top], chart.y)

  const bars = xs.map((p) => {
    const here = at(p.x)
    const bx = x(p.x)!
    let base = 0
    return here.map((v, i) => {
      const val = v.p!.y!
      const fill = chart.sign ? colorVar(val >= 0 ? chart.sign.above : chart.sign.below) : colorVar(v.s.color)
      if (chart.stacked) {
        const y0 = y(base)
        base += val
        return svg`<rect x="${bx}" y="${y(base)}" width="${x.bandwidth()}" height="${Math.max(0, y0 - y(base))}" fill="${fill}"/>`
      }
      const w = x.bandwidth() / here.length
      return svg`<rect x="${bx + i * w}" y="${Math.min(y(0), y(val))}" width="${w}" height="${Math.abs(y(val) - y(0))}" fill="${fill}"/>`
    })
  })

  const step = Math.max(1, Math.ceil(xs.length / (narrow ? 4 : 9)))
  const ticks = xs.filter((_, i) => i % step === 0).map((p) => ({ x: x(p.x)! + x.bandwidth() / 2, label: p.label }))

  const notes = timeNotes(chart, {
    // Notes sit at the centre of their column.
    xOf: (v) => (x(v) === undefined ? undefined : x(v)! + x.bandwidth() / 2),
    y,
    top: m.top,
    bottom: H - m.bottom,
    series,
  })

  const hits = xs.map((p) =>
    hit(x(p.x)!, m.top, x.step(), H - m.top - m.bottom, [p.label, ...at(p.x).map((v) => `${v.s.label}: ${show(chart, v.p as Point).text}`)].join('\n')),
  )

  return frame(
    width,
    H,
    chart.title,
    svg`${yGrid(y, yTicks(y, chart.y), m.left, W - m.right, chart.format)}${notes.under}${bars}
<line x1="${m.left}" x2="${W - m.right}" y1="${y(0)}" y2="${y(0)}" stroke="var(--ink)"/>
${xLabels(ticks, H - m.bottom)}${notes.over}<g class="hits">${hits}</g>`,
  )
}
