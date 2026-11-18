import { scaleLinear } from 'd3-scale'
import { curveStepAfter, line as d3line } from 'd3-shape'
import type { Point } from '~/lib/data'
import { svg, attr, type Markup } from '~/lib/markup'
import { colorVar } from '~/lib/tokens'
import { parsePeriod } from '~/lib/period'
import { WIDTH, frame, note, yRoom, hit, spread, timeTicks, xLabels, yGrid, yScale, yTicks, type Width } from './axes'
import { drawn, show, tipLine, type Of, type SeriesData } from './model'
import { timeNotes } from './notes'

/**
 * Split a series where values are missing, and (for regular series) where the
 * period step jumps, so gaps stay gaps. Step series, such as policy rates, change
 * at irregular dates and are never split by spacing.
 */
export function segments(pts: readonly Point[], regular = true): Point[][] {
  const steps = pts.slice(1).map((p, i) => p.t - pts[i]!.t).sort((a, b) => a - b)
  const typical = steps[Math.floor(steps.length / 2)] ?? 1
  const out: Point[][] = [[]]
  pts.forEach((p, i) => {
    const prev = pts[i - 1]
    if (p.y === null || (regular && prev && p.t - prev.t > typical * 1.8)) out.push([])
    if (p.y !== null) out.at(-1)!.push(p)
  })
  return out.filter((s) => s.length > 0)
}

/** Ranges with no data inside a series: [last value before, first value after]. */
const holes = (segs: readonly Point[][]): [Point, Point][] => segs.slice(1).map((s, i) => [segs[i]!.at(-1)!, s[0]!])

interface Panel {
  label?: string
  series: SeriesData[]
}

export function renderLine(chart: Of<'line'>, width: Width): Markup {
  const all = drawn(chart).map((s) => (chart.extendTo ? extend(s, chart.extendTo) : s))
  const panels: Panel[] = chart.panels
    ? chart.panels.map((p) => ({ label: p.label, series: all.filter((s) => p.series.includes(s.key)) }))
    : [{ series: all }]
  const narrow = width === 'narrow'
  const perRow = narrow ? 1 : panels.length
  const W = WIDTH[width]
  const panelW = (W - (perRow - 1) * 24) / perRow
  const panelH = panels.length > 1 ? (narrow ? 200 : 240) : narrow ? 260 : 360
  const rows = Math.ceil(panels.length / perRow)
  // The shared scale covers every series except those in panels with their own scale.
  const ownKeys = new Set((chart.panels ?? []).filter((p) => p.own).flatMap((p) => p.series))
  const values = all.filter((s) => !ownKeys.has(s.key)).flatMap((s) => s.points.flatMap((p) => (p.y === null ? [] : [p.y])))
  const extra = [chart.band?.to, ...(chart.refs ?? []).map((r) => r.y)].filter((v) => v !== undefined)
  const body = panels.map((panel, i) => {
    const ox = (i % perRow) * (panelW + 24)
    const oy = Math.floor(i / perRow) * (panelH + 24)
    const own = chart.panels?.[i]?.own
    const scaleOn = own ? panel.series.flatMap((s) => s.points.flatMap((p) => (p.y === null ? [] : [p.y]))) : [...values, ...extra]
    return svg`<g transform="translate(${ox},${oy})">${linePanel(chart, panel, panelW, panelH, scaleOn, narrow, panels.length > 1, own)}</g>`
  })
  return frame(width, rows * panelH + (rows - 1) * 24, chart.title, body)
}

function linePanel(chart: Of<'line'>, panel: Panel, W: number, H: number, values: number[], narrow: boolean, small: boolean, own = false): Markup {
  const endLabels = !small
  // End labels need room for the longest series name (about 7 px a character at 12.5 px).
  const labelRoom = Math.max(...panel.series.map((s) => s.label.length), 8) * 7 + 12
  // A panel on its own scale may also have its own unit (enrolment in crore beside ratios).
  const f = own ? (panel.series[0]?.format ?? chart.format) : chart.format
  const axis = own ? undefined : chart.y
  const m = { top: panel.label ? 34 : 16, right: endLabels ? Math.min(labelRoom, W * (narrow ? 0.4 : 0.22)) : 12, bottom: 28, left: yRoom(values, axis, f) }
  const pts = panel.series.flatMap((s) => s.points)
  const ts = pts.map((p) => p.t)
  const x = scaleLinear().domain([Math.min(...ts), Math.max(...ts)]).range([m.left, W - m.right])
  const y = yScale(values, [H - m.bottom, m.top], axis)
  const ticks = yTicks(y, axis)
  const sorted = [...new Map(pts.map((p) => [p.x, p])).values()].sort((a, b) => a.t - b.t)
  const path = d3line<Point>().x((p) => x(p.t)).y((p) => y(p.y!))
  if (chart.step) path.curve(curveStepAfter)
  const tOf = new Map(pts.map((p) => [p.x, p.t]))
  const notes = timeNotes(chart, {
    xOf: (v) => {
      const t = tOf.get(v) ?? parsePeriod(v).t
      return t >= x.domain()[0]! && t <= x.domain()[1]! ? x(t) : undefined
    },
    y,
    top: m.top,
    bottom: H - m.bottom,
    right: W - m.right,
    series: panel.series,
    endLabels,
  })

  const band = chart.band
  const bandX0 = band ? x(Math.max(x.domain()[0]!, parseBandStart(band))) : 0
  const bandEl = band
    ? svg`<rect x="${bandX0}" y="${y(band.to)}" width="${W - m.right - bandX0}" height="${y(band.from) - y(band.to)}" fill="var(--band)"/>
${note(bandX0 + 6, y(band.to) + 14, band.label)}`
    : null

  const refs = (chart.refs ?? []).map(
    (r) => svg`<line x1="${m.left}" x2="${W - m.right}" y1="${y(r.y)}" y2="${y(r.y)}" stroke="var(--slate)" stroke-dasharray="2 3"/>
${note(W - m.right - 4, y(r.y) - 5, r.label, 'end')}`,
  )

  const segs = panel.series.map((s) => segments(s.points, !chart.step))
  const lines = panel.series.map((s, i) =>
    segs[i]!.map((seg) =>
      seg.length === 1
        ? svg`<circle cx="${x(seg[0]!.t)}" cy="${y(seg[0]!.y!)}" r="2.5" fill="${colorVar(s.color)}"/>`
        : svg`<path d="${path(seg) ?? ''}" fill="none" stroke="${colorVar(s.color)}" stroke-width="${s.color === 'ink' ? 2 : 1.75}" stroke-linejoin="round"${attr('stroke-dasharray', s.dash ? '5 4' : undefined)}/>`,
    ),
  )

  // "No data" under a hole in the first series, when the hole is wide enough to label.
  const noData = (segs[0] ? holes(segs[0]) : [])
    .filter(([a, b]) => x(b.t) - x(a.t) > 50)
    .map(([a, b]) => note((x(a.t) + x(b.t)) / 2, H - m.bottom - 6, 'No data', 'middle'))

  const ends = endLabels
    ? spread(
        panel.series.flatMap((s) => {
          const last = s.points.findLast((p) => p.y !== null)
          return last ? [{ s, p: last, y: y(last.y!) }] : []
        }),
        30,
        m.top,
        H - m.bottom,
      ).map(({ s, p, ly }) => {
        const v = show(chart, p, s)
        return svg`<circle cx="${x(p.t)}" cy="${y(p.y!)}" r="3" fill="${colorVar(s.color)}"/>
<text x="${x(p.t) + 8}" y="${ly - 2}" font-size="12.5" font-weight="600" fill="var(--ink)">${s.label}</text>
<text x="${x(p.t) + 8}" y="${ly + 12}" font-size="12.5" fill="var(--ink)"${attr('data-alt', v.alt)}>${v.text}${narrow ? '' : ` in ${p.label}`}</text>`
      })
    : []

  const hits = sorted.map((p, i) => {
    const prev = sorted[i - 1]
    const next = sorted[i + 1]
    const x0 = prev ? (x(prev.t) + x(p.t)) / 2 : x(p.t) - 4
    const x1 = next ? (x(next.t) + x(p.t)) / 2 : x(p.t) + 4
    const lines = panel.series.map((s) => tipLine(chart, s, s.points.find((q) => q.x === p.x)))
    return hit(x0, m.top, x1 - x0, H - m.top - m.bottom, [p.label, ...lines].join('\n'))
  })

  return svg`${panel.label ? svg`<text x="${m.left}" y="14" font-size="13" font-weight="600" fill="var(--ink)">${panel.label}</text>` : null}
${bandEl}${yGrid(y, ticks, m.left, W - m.right, f)}${refs}${notes.under}
${xLabels(timeTicks(sorted, x, narrow || small ? 4 : 8), H - m.bottom)}
${noData}${lines}${notes.over}${ends}<g class="hits">${hits}</g>`
}

/** Hold the last value to a date, so a step line reaches today. */
function extend(s: SeriesData, to: string): SeriesData {
  const last = s.points.at(-1)
  if (!last || last.x >= to) return s
  return { ...s, points: [...s.points, { ...last, x: to, label: parsePeriod(to).label, t: parsePeriod(to).t }] }
}

function parseBandStart(band: NonNullable<Of<'line'>['band']>): number {
  return band.since ? parsePeriod(band.since).t : -Infinity
}

