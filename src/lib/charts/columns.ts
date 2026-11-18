import { scaleBand } from 'd3-scale'
import { svg, type Markup } from '~/lib/markup'
import { colorVar, fillVar } from '~/lib/tokens'
import { WIDTH, frame, hit, tickRoom, xLabels, yGrid, yRoom, yScale, yTicks, type Width } from './axes'
import { drawn, tipLine, type Of } from './model'
import { timeNotes } from './notes'

/** Columns over time. Series that share an x sit side by side, or stack when `stacked`. */
export function renderColumns(chart: Of<'columns'>, width: Width): Markup {
  const series = drawn(chart)
  const narrow = width !== 'wide'
  const W = WIDTH[width]
  const H = narrow ? 260 : 340
  const xs = [...new Map(series.flatMap((s) => s.points).map((p) => [p.x, p])).values()].sort((a, b) => a.t - b.t)
  const at = (x: string) => series.map((s) => ({ s, p: s.points.find((q) => q.x === x) })).filter((v) => v.p?.y != null)
  const totals = xs.map((p) => at(p.x).reduce((a, v) => a + (chart.stacked ? v.p!.y! : 0), 0))
  const values = chart.stacked ? totals : series.flatMap((s) => s.points.flatMap((p) => (p.y === null ? [] : [p.y])))
  // Break and marker labels get their own band above the plot.
  const ruled = (chart.breaks ?? []).length + (chart.markers ?? []).length > 0
  const m = { top: ruled ? 40 : 16, right: 12, bottom: 30, left: yRoom(values, chart.y, chart.format) }
  // A few wide columns get more air between them, so the fill does not read as one dark block.
  const x = scaleBand<string>().domain(xs.map((p) => p.x)).range([m.left, W - m.right]).paddingInner(xs.length <= 24 ? 0.38 : 0.2)
  const y = yScale(values, [H - m.bottom, m.top], chart.y)

  const bars = xs.map((p) => {
    const here = at(p.x)
    const bx = x(p.x)!
    let base = 0
    return here.map((v, i) => {
      const val = v.p!.y!
      const fill = chart.sign ? colorVar(val >= 0 ? chart.sign.above : chart.sign.below) : fillVar(v.s.color)
      if (chart.stacked) {
        const y0 = y(base)
        base += val
        return svg`<rect x="${bx}" y="${y(base)}" width="${x.bandwidth()}" height="${Math.max(0, y0 - y(base))}" fill="${fill}"/>`
      }
      const w = x.bandwidth() / here.length
      return svg`<rect x="${bx + i * w}" y="${Math.min(y(0), y(val))}" width="${w}" height="${Math.abs(y(val) - y(0))}" fill="${fill}"/>`
    })
  })

  // Label every column when each label fits its own column; otherwise every n-th.
  const widest = Math.max(...xs.map((p) => p.label.length)) * 6.6 + 8
  const step = x.step() >= widest ? 1 : Math.max(1, Math.ceil(xs.length / Math.min(narrow ? 4 : 9, tickRoom(W - m.left - m.right, xs.at(-1)?.label ?? '2026'))))
  const ticks = xs.filter((_, i) => i % step === 0).map((p) => ({ x: x(p.x)! + x.bandwidth() / 2, label: p.label }))

  // The top of each column, for callouts that must clear their neighbours.
  const caps = xs.map((p, i) => {
    const vals = at(p.x).map((v) => v.p!.y!)
    const top = chart.stacked ? totals[i]! : Math.max(0, ...vals)
    return { x0: x(p.x)!, x1: x(p.x)! + x.bandwidth(), y: y(top), low: y(Math.min(0, ...vals)) }
  })
  const near = (a: number, b: number) => caps.filter((c) => c.x1 >= a && c.x0 <= b)
  const capAt = (a: number, b: number) => Math.min(y(0), ...near(a, b).map((c) => c.y))
  const floorAt = (a: number, b: number) => Math.max(y(0), ...near(a, b).map((c) => c.low))

  const notes = timeNotes(chart, {
    // Notes sit at the centre of their column.
    xOf: (v) => (x(v) === undefined ? undefined : x(v)! + x.bandwidth() / 2),
    y,
    top: m.top,
    bottom: H - m.bottom,
    left: m.left,
    right: W - m.right,
    series,
    capAt,
    floorAt,
  })

  const hits = xs.map((p) =>
    hit(x(p.x)!, m.top, x.step(), H - m.top - m.bottom, [p.label, ...at(p.x).map((v) => tipLine(chart, v.s, v.p))].join('\n')),
  )

  return frame(
    width,
    H,
    chart.title,
    svg`${yGrid(y, yTicks(y, chart.y), m.left, W - m.right, chart.format)}${notes.under}${bars}
<line x1="${m.left}" x2="${W - m.right}" y1="${y(0)}" y2="${y(0)}" stroke="var(--ink)"/>
${xLabels(ticks, H - m.bottom, { left: m.left, right: W - m.right })}${notes.over}<g class="hits">${hits}</g>`,
  )
}
