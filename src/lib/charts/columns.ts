import { scaleBand } from 'd3-scale'
import { svg, type Markup } from '~/lib/markup'
import { colorVar, fillVar } from '~/lib/tokens'
import { WIDTH, frame, hit, tickRoom, xLabels, yGrid, yRoom, yScale, yTicks, type Width } from './axes'
import { KEY_ROW, legend, legendRows } from './dots'
import { drawn, tipLine, type Of } from './model'
import { timeNotes } from './notes'

/** A key for columns coloured by sign: "Above normal", "Below normal". */
export function signLegend(sign: NonNullable<Of<'columns'>['sign']>, y = 12): Markup {
  const items = [
    { c: sign.above, l: sign.aboveLabel },
    { c: sign.below, l: sign.belowLabel },
  ]
  let x = 0
  return svg`<g class="key">${items.map((it) => {
    const at = x
    x += 30 + it.l.length * 7
    return svg`<rect x="${at}" y="${y - 10}" width="12" height="12" fill="${colorVar(it.c)}"/><text x="${at + 18}" y="${y}" font-size="12.5" fill="var(--ink)">${it.l}</text>`
  })}</g>`
}

/** Columns over time. Series that share an x sit side by side, or stack when `stacked`. */
export function renderColumns(chart: Of<'columns'>, width: Width, inPanel = false): Markup {
  const series = drawn(chart)
  const narrow = width !== 'wide'
  const W = WIDTH[width]
  const xs = [...new Map(series.flatMap((s) => s.points).map((p) => [p.x, p])).values()].sort((a, b) => a.t - b.t)
  // Few columns with long names ("Pre-monsoon, Mar-May") wrap each name onto up to three lines,
  // at spaces, commas and hyphens, rather than drop some names.
  const wrapTick = (l: string, chars: number): string[] => {
    const parts = l.split(/(?<=-)|,? /).filter(Boolean)
    const lines: string[] = []
    for (const part of parts) {
      const last = lines.at(-1)
      const join = last === undefined ? '' : last.endsWith('-') ? last + part : `${last} ${part}`
      if (last !== undefined && join.length <= chars) lines[lines.length - 1] = join
      else lines.push(part)
    }
    return lines
  }
  // A key for columns coloured by sign, unless the panels around this chart draw one. Stacked
  // series get a key of their own: their colours name the parts.
  const signKey = chart.sign && !inPanel ? signLegend(chart.sign) : null
  const keyRows = !chart.sign && !inPanel && chart.stacked && series.length > 1 ? legendRows(series, W) : 0
  const seriesKey = keyRows ? legend(series, [], 12, W) : null
  const keyH = signKey ? 24 : keyRows ? 8 + keyRows * KEY_ROW : 0
  const H = (narrow ? 260 : 340) + keyH
  const at = (x: string) => series.map((s) => ({ s, p: s.points.find((q) => q.x === x) })).filter((v) => v.p?.y != null)
  // A stack diverges at zero: positive parts rise from it and negative parts hang below it, so
  // parts of mixed sign (a trade deficit beside a services surplus) never overlap.
  const sums = xs.map((p) => at(p.x).reduce(([lo, hi], v) => (v.p!.y! < 0 ? [lo + v.p!.y!, hi] : [lo, hi + v.p!.y!]) as [number, number], [0, 0] as [number, number]))
  const values = chart.stacked ? sums.flat() : series.flatMap((s) => s.points.flatMap((p) => (p.y === null ? [] : [p.y])))
  // Break and marker labels get their own band above the plot.
  const ruled = (chart.breaks ?? []).length + (chart.markers ?? []).length > 0
  const m = { top: (ruled ? 40 : 16) + keyH, right: 12, bottom: 30, left: yRoom(values, chart.y, chart.format) }
  // A few wide columns get more air between them, so the fill does not read as one dark block.
  const x = scaleBand<string>().domain(xs.map((p) => p.x)).range([m.left, W - m.right]).paddingInner(xs.length <= 24 ? 0.38 : 0.2)
  const y = yScale(values, [H - m.bottom, m.top], chart.y)

  // The whole-period columns (the year after its seasons) sit apart, behind a dashed rule.
  const isWhole = (k: string) => chart.whole?.includes(k) ?? false
  const firstWhole = xs.findIndex((p) => isWhole(p.x))
  const wholeRule =
    firstWhole > 0
      ? svg`<line class="whole" x1="${x(xs[firstWhole]!.x)! - (x.step() - x.bandwidth()) / 2}" x2="${x(xs[firstWhole]!.x)! - (x.step() - x.bandwidth()) / 2}" y1="${m.top}" y2="${H - m.bottom}" stroke="var(--slate)" stroke-dasharray="3 3"/>`
      : null

  const bars = xs.map((p) => {
    const here = at(p.x)
    const bx = x(p.x)!
    let up = 0
    let down = 0
    return here.map((v, i) => {
      const val = v.p!.y!
      const fill = isWhole(p.x) ? fillVar('ink') : chart.sign ? colorVar(val >= 0 ? chart.sign.above : chart.sign.below) : fillVar(v.s.color)
      if (chart.stacked) {
        const from = val < 0 ? down : up
        const to = from + val
        if (val < 0) down = to
        else up = to
        return svg`<rect x="${bx}" y="${y(Math.max(from, to))}" width="${x.bandwidth()}" height="${Math.abs(y(from) - y(to))}" fill="${fill}"/>`
      }
      const w = x.bandwidth() / here.length
      return svg`<rect x="${bx + i * w}" y="${Math.min(y(0), y(val))}" width="${w}" height="${Math.abs(y(val) - y(0))}" fill="${fill}"/>`
    })
  })

  // Label every column when each label fits its own column; otherwise every n-th.
  const widest = Math.max(...xs.map((p) => p.label.length)) * 6.6 + 8
  const chars = Math.floor((x.step() - 6) / 6.6)
  const wrapped = xs.map((p) => wrapTick(p.label, chars))
  const tickLines = x.step() < widest && xs.length <= 12 && wrapped.every((w) => w.length <= 3 && w.every((l) => l.length <= chars)) ? Math.max(...wrapped.map((w) => w.length)) : 1
  const step = x.step() >= widest || tickLines > 1 ? 1 : Math.max(1, Math.ceil(xs.length / Math.min(narrow ? 4 : 9, tickRoom(W - m.left - m.right, xs.at(-1)?.label ?? '2026'))))
  const ticks = xs.filter((_, i) => i % step === 0).map((p, i) => ({ x: x(p.x)! + x.bandwidth() / 2, label: tickLines > 1 ? wrapped[i]!.join('\n') : p.label }))

  // The top of each column, for callouts that must clear their neighbours.
  const caps = xs.map((p, i) => {
    const vals = at(p.x).map((v) => v.p!.y!)
    const [lo, hi] = chart.stacked ? sums[i]! : [Math.min(0, ...vals), Math.max(0, ...vals)]
    return { x0: x(p.x)!, x1: x(p.x)! + x.bandwidth(), y: y(hi), low: y(lo) }
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
    hit(x(p.x)!, m.top, x.step(), H - m.top - m.bottom, () => [p.label, ...at(p.x).map((v) => tipLine(chart, v.s, v.p))].join('\n')),
  )

  return frame(
    width,
    H + (tickLines - 1) * 13,
    chart.title,
    svg`${signKey}${seriesKey}${yGrid(y, yTicks(y, chart.y), m.left, W - m.right, chart.format)}${notes.under}${wholeRule}${bars}
<line x1="${m.left}" x2="${W - m.right}" y1="${y(0)}" y2="${y(0)}" stroke="var(--ink)"/>
${xLabels(ticks, H - m.bottom, { left: m.left, right: W - m.right })}${notes.over}<g class="hits">${hits}</g>`,
  )
}
