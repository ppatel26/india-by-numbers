/** Small multiples for column and bar charts: one sub-chart per panel, laid out in a grid. */
import { scaleLinear } from 'd3-scale'
import type { Axis } from '~/content/types'
import { embed, svg, type Markup } from '~/lib/markup'
import { WIDTH, frame, type Width } from './axes'
import { drawn, type Of } from './model'
import { signLegend } from './columns'

type Paneled = Of<'columns'> | Of<'bars'>

const GAP = 24
const HEAD = 26

/** The value range across all panels that share a scale. */
function sharedAxis(chart: Paneled): Axis {
  const ys = drawn(chart)
    .filter((s) => chart.panels!.some((p) => !p.own && p.series.includes(s.key)))
    .flatMap((s) => s.points.flatMap((p) => (p.y === null ? [] : [p.y])))
  return nice(Math.min(0, ...ys), Math.max(...ys))
}

/** A range rounded out to clean numbers, so the top tick stays on the plot. */
function nice(min: number, max: number): Axis {
  const [lo, hi] = scaleLinear().domain([min, max]).nice(5).domain() as [number, number]
  return { min: lo, max: hi }
}

export function renderPanels<C extends Paneled>(chart: C, width: Width, one: (c: C, w: Width, inPanel?: boolean) => Markup): Markup {
  const panels = chart.panels!
  // On the page, two panels per row fill the width; on a phone, one.
  const perRow = width === 'wide' ? 2 : 1
  const cellWidth: Width = width === 'wide' ? 'half' : 'narrow'
  const cell = WIDTH[cellWidth]
  const shared = sharedAxis(chart)
  // An odd number of column panels on the page: the first (India) spans the full width, so no
  // panel sits alone on the last row.
  const lead = width === 'wide' && chart.kind === 'columns' && panels.length % 2 === 1 && panels.length > 1
  const plots = panels.map((p, i) => {
    // A panel on its own scale still reaches its reference lines (a majority line stays on the plot).
    const ownYs = drawn(chart).filter((s) => p.series.includes(s.key)).flatMap((s) => s.points.flatMap((q) => (q.y === null ? [] : [q.y])))
    const own = nice(Math.min(0, ...ownYs), Math.max(...ownYs, ...(p.refs ?? []).map((r) => r.value * 1.08)))
    const axis = p.own ? own : shared
    const sub = {
      ...chart,
      panels: undefined,
      series: chart.series.filter((s) => p.series.includes(s.key)),
      refs: p.refs ?? ('refs' in chart ? chart.refs : undefined),
      // The chart's own axis settings win over the computed range.
      ...(chart.kind === 'bars' ? { axis: { ...axis, ...chart.axis } } : { y: { ...axis, ...chart.y } }),
    } as C
    return { p, html: one(sub, lead && i === 0 ? 'wide' : cellWidth, true).html, width: lead && i === 0 ? WIDTH.wide : cell }
  })
  // Columns coloured by sign get one key above all the panels.
  const key = chart.kind === 'columns' && chart.sign ? signLegend(chart.sign) : null
  let y = key ? 28 : 0
  const rows: Markup[] = []
  const groups = lead ? [plots.slice(0, 1)] : []
  for (let i = lead ? 1 : 0; i < plots.length; i += perRow) groups.push(plots.slice(i, i + perRow))
  for (const row of groups) {
    const placed = row.map(({ p, html, width: w }, j) => {
      const x = j * (cell + GAP)
      const plot = embed(html, x, y + HEAD, w)
      return {
        el: svg`<text x="${x}" y="${y + 16}" font-size="13" font-weight="600" fill="var(--ink)">${p.label}${p.note ? svg`<tspan font-weight="400" fill="var(--slate)">  ${p.note}</tspan>` : null}</text>${plot.el}`,
        height: plot.height,
      }
    })
    rows.push(svg`${placed.map((r) => r.el)}`)
    y += HEAD + Math.max(...placed.map((r) => r.height)) + GAP
  }
  return frame(width, y - GAP, chart.title, svg`${key}${rows}`)
}
