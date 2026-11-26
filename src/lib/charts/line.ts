import { scaleLinear } from 'd3-scale'
import { curveStepAfter, line as d3line } from 'd3-shape'
import type { Point } from '~/lib/data'
import { svg, attr, type Markup } from '~/lib/markup'
import { colorVar } from '~/lib/tokens'
import { parsePeriod } from '~/lib/period'
import { WIDTH, frame, note, noteWidth, yRoom, hit, spread, tickRoom, timeTicks, xLabels, yGrid, yScale, yTicks, type Width } from './axes'
import { legend, legendItemWidth } from './dots'
import { drawn, show, tipLine, when, type Of, type SeriesData } from './model'
import { timeNotes } from './notes'

/**
 * Split a series where values are missing, and (for regular series) where the
 * period step jumps, so gaps stay gaps. Step series, such as policy rates, change
 * at irregular dates and are never split by spacing.
 */
export function segments(pts: readonly Point[], regular = true): Point[][] {
  const steps = pts.slice(1).map((p, i) => p.t - pts[i]!.t).sort((a, b) => a - b)
  const typical = steps[Math.floor(steps.length / 2)] ?? 1
  // A daily series skips weekends and holidays: only a gap of a week or more is a real gap.
  const limit = typical < 2 / 365 ? 7 / 365 : typical * 1.8
  const out: Point[][] = [[]]
  pts.forEach((p, i) => {
    const prev = pts[i - 1]
    if (p.y === null || (regular && prev && p.t - prev.t > limit)) out.push([])
    if (p.y !== null) out.at(-1)!.push(p)
  })
  return out.filter((s) => s.length > 0)
}

/** Words in lines of at most `chars` characters; the last of `max` lines ends in "…" when cut. */
export function wrapLines(text: string, chars: number, max: number): string[] {
  const lines: string[] = []
  for (const word of text.split(' ')) {
    const last = lines.at(-1)
    if (last !== undefined && last.length + word.length + 1 <= chars) lines[lines.length - 1] = `${last} ${word}`
    else lines.push(word)
  }
  if (lines.length <= max) return lines
  const kept = lines.slice(0, max)
  kept[max - 1] = `${kept[max - 1]!.slice(0, chars - 1).trimEnd()}…`
  return kept
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
  // At most four panels to a row; more wrap to the next row.
  const perRow = narrow ? 1 : Math.min(4, panels.length)
  const W = WIDTH[width]
  const panelW = (W - (perRow - 1) * 24) / perRow
  const panelH = panels.length > 1 ? (narrow ? 200 : 240) : narrow ? 280 : 380
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
  // Small multiples carry no end labels, so two or more series need a key above the panels.
  // One entry per name and colour. A colour worn by several names is each panel's own series,
  // which the panel title already names, so it gets no entry.
  const named = [...new Map(all.map((s) => [`${s.label}|${s.color}`, s])).values()]
  const seen = named.filter((s) => named.filter((o) => o.color === s.color).length === 1)
  const keyRows: SeriesData[][] = []
  if (panels.length > 1 && seen.length > 1) {
    let used = 0
    for (const item of seen) {
      const width = legendItemWidth(item.label)
      if (keyRows.length === 0 || used + width > W) {
        keyRows.push([])
        used = 0
      }
      keyRows.at(-1)!.push(item)
      used += width
    }
  }
  const keyH = keyRows.length * 26
  return frame(
    width,
    keyH + rows * panelH + (rows - 1) * 24,
    chart.title,
    svg`${keyRows.map((row, i) => legend(row, [], 12 + i * 26))}<g transform="translate(0,${keyH})">${body}</g>`,
  )
}

function linePanel(chart: Of<'line'>, panel: Panel, W: number, H: number, values: number[], narrow: boolean, small: boolean, own = false): Markup {
  const endLabels = !small
  // End labels need room for the longest name or "value in period" line (about 7 px a character).
  const lastLine = (s: SeriesData) => {
    const p = s.points.findLast((q) => q.y !== null)
    if (!p) return 0
    const v = show(chart, p, s)
    // Room for the longer of the two number forms, so the switch never runs a label off the frame.
    return Math.max(v.text.length, v.alt?.length ?? 0) + (narrow ? 0 : 1 + when(p.label).length)
  }
  const labelRoom = Math.max(...panel.series.map((s) => Math.max(s.label.length, lastLine(s))), 8) * 7 + 12
  // A panel on its own scale may also have its own unit (enrolment in crore beside ratios).
  const f = own ? (panel.series[0]?.format ?? chart.format) : chart.format
  const axis = own ? undefined : chart.y
  // Room above the plot: the panel label, a key for the band and reference lines, and the
  // labels of method breaks and markers, so none of them sits on the data.
  // The key names the band; each reference line is labelled at its own right end.
  const keyed = !!chart.band
  const ruled = (chart.breaks ?? []).length + (chart.markers ?? []).length > 0
  const top = (panel.label ? 34 : 16) + (keyed ? 24 : 0) + (ruled ? 24 : 0)
  const m = { top, right: endLabels ? Math.min(labelRoom, W * (narrow ? 0.4 : 0.22)) : 12, bottom: 28, left: yRoom(values, axis, f) }
  const pts = panel.series.flatMap((s) => s.points)
  const ts = pts.map((p) => p.t)
  const x = scaleLinear().domain([Math.min(...ts), Math.max(...ts)]).range([m.left, W - m.right])
  const y = yScale(values, [H - m.bottom, m.top], axis)
  const ticks = yTicks(y, axis)
  const sorted = [...new Map(pts.map((p) => [p.x, p])).values()].sort((a, b) => a.t - b.t)
  const path = d3line<Point>().x((p) => x(p.t)).y((p) => y(p.y!))
  if (chart.step) path.curve(curveStepAfter)
  const tOf = new Map(pts.map((p) => [p.x, p.t]))
  const tLast = Math.max(...panel.series.flatMap((s) => s.points.filter((p) => p.y !== null).map((p) => p.t)))
  const endLabeled = new Set(
    endLabels ? panel.series.filter((s) => tLast - (s.points.findLast((p) => p.y !== null)?.t ?? -Infinity) < 0.5).map((s) => s.key) : [],
  )
  // End labels name the series that reach the right edge. A series that stops earlier (an old
  // base, an old survey design) is named in the tooltip and the table instead. A long name wraps
  // to the room at the right, so it never runs off the frame.
  const room = m.right - 8
  const perLine = Math.max(8, Math.floor(room / 7))
  const endItems = endLabels
    ? panel.series.flatMap((s) => {
        const last = s.points.findLast((p) => p.y !== null)
        if (!last || tLast - last.t >= 0.5) return []
        const v = show(chart, last, s)
        const full = `${v.text} ${when(last.label)}`
        const long = narrow || Math.max(full.length, (v.alt ?? '').length + full.length - v.text.length) > perLine
        const value = long ? v.text : full
        const alt = v.alt && (long ? v.alt : `${v.alt} ${when(last.label)}`)
        return [{ s, p: last, v, value, alt, names: wrapLines(s.label, perLine, 2), y: y(last.y!) }]
      })
    : []
  const nameRows = Math.max(1, ...endItems.map((e) => e.names.length))
  // The first name line sits 12 px above its anchor, so the top anchor stays 12 px inside the plot.
  const placedEnds = spread(endItems, 16 + nameRows * 14, m.top + 12, H - m.bottom)
  const endBoxes = placedEnds.map(({ p, names, ly }) => ({ l: x(p.t) + 4, t: ly - 14, r: W, b: ly + names.length * 14 + 2 }))
  const ends = placedEnds.map(({ s, p, value, alt, names, ly }) => {
    // A label pushed away from its dot gets a short grey connector, so it never reads as data.
    const moved = Math.abs(ly + 3 - y(p.y!)) > 9
    return svg`${moved ? svg`<path d="M${x(p.t) + 3} ${y(p.y!)}L${x(p.t) + 6} ${ly + 3}" stroke="var(--slate)" fill="none"/>` : null}<circle cx="${x(p.t)}" cy="${y(p.y!)}" r="3" fill="${colorVar(s.color)}"/>
${names.map((n, i) => svg`<text x="${x(p.t) + 8}" y="${ly - 2 + i * 14}" font-size="12.5" font-weight="600" fill="var(--ink)">${n}</text>`)}
<text x="${x(p.t) + 8}" y="${ly - 2 + names.length * 14}" font-size="12.5" fill="var(--ink)"${attr('data-alt', alt)}>${value}</text>`
  })

  const notes = timeNotes(chart, {
    xOf: (v) => {
      const t = tOf.get(v) ?? parsePeriod(v).t
      return t >= x.domain()[0]! && t <= x.domain()[1]! ? x(t) : undefined
    },
    y,
    top: m.top,
    bottom: H - m.bottom,
    left: m.left,
    right: W - m.right,
    series: panel.series,
    endLabeled,
    avoid: endBoxes,
    edge: W,
    step: chart.step,
  })

  const band = chart.band
  const annotationStart = (since?: string) => since ? Math.max(m.left, x(tOf.get(since) ?? parsePeriod(since).t)) : m.left
  const right = W - m.right
  const bandX0 = annotationStart(band?.since)
  const bandEl = band && bandX0 < right ? svg`<rect x="${bandX0}" y="${y(band.to)}" width="${right - bandX0}" height="${y(band.from) - y(band.to)}" fill="var(--band)"/>` : null
  const refs = (chart.refs ?? []).map((r) => {
    const start = annotationStart(r.since)
    if (start >= right) return null
    return svg`<line x1="${start}" x2="${right}" y1="${y(r.y)}" y2="${y(r.y)}" stroke="var(--slate)" stroke-dasharray="2 3"/>
${note(right - 4, y(r.y) - 5, r.label, 'end')}`
  })
  // The key names the band and the reference lines above the plot, not on top of the lines.
  const keyY = (panel.label ? 34 : 16) + 6
  let kx = m.left
  const key = keyed
    ? svg`${band ? (() => {
        const at = kx
        kx += 26 + band.label.length * 6.6 + 18
        return svg`<rect x="${at}" y="${keyY - 9}" width="18" height="12" fill="var(--band)" stroke="var(--rule)"/><text x="${at + 24}" y="${keyY + 1}" font-size="12" fill="var(--slate)">${band.label}</text>`
      })() : null}`
    : null

  const segs = panel.series.map((s) => segments(s.points, !chart.step && !chart.joined))
  const lines = panel.series.map((s, i) =>
    segs[i]!.map((seg) =>
      seg.length === 1
        ? svg`<circle cx="${x(seg[0]!.t)}" cy="${y(seg[0]!.y!)}" r="2.5" fill="${colorVar(s.color)}"/>`
        : svg`<path d="${path(seg) ?? ''}" fill="none" stroke="${colorVar(s.color)}" stroke-width="${s.color === 'ink' ? 2 : 1.75}" stroke-linejoin="round"${attr('stroke-dasharray', s.dash ? '5 4' : undefined)}/>`,
    ),
  )

  // "No data" inside each hole wide enough to label, at the height of the line it interrupts.
  // One note per stretch of axis: a hole shared by several series is labelled once.
  // Only a real missing value counts: a gap that is just the spacing between periods is not one.
  const taken: [number, number][] = []
  const noData = segs.flatMap((sg, i) => {
    const s = panel.series[i]!
    return holes(sg).flatMap(([a, b]) => {
      const x0 = x(a.t)
      const x1 = x(b.t)
      const missing = s.points.some((p) => p.y === null && p.t > a.t && p.t < b.t)
      // The label claims its own width too: two holes side by side must not print on each other.
      const half = noteWidth('No data') / 2 + 4
      const a0 = Math.min(x0, (x0 + x1) / 2 - half)
      const a1 = Math.max(x1, (x0 + x1) / 2 + half)
      if (!missing || x1 - x0 < 50 || taken.some(([p, q]) => a0 < q && a1 > p)) return []
      taken.push([a0, a1])
      const ly = Math.max(m.top + 12, (y(a.y!) + y(b.y!)) / 2 - 8)
      return [note((x0 + x1) / 2, ly, 'No data', 'middle', colorVar(s.color))]
    })
  })

  const byLabel = Map.groupBy(panel.series, (s) => `${s.label}|${s.color}`)
  const hits = sorted.map((p, i) => {
    const prev = sorted[i - 1]
    const next = sorted[i + 1]
    const x0 = prev ? (x(prev.t) + x(p.t)) / 2 : x(p.t) - 4
    const x1 = next ? (x(next.t) + x(p.t)) / 2 : x(p.t) + 4
    const lines = () => [...byLabel.values()].flatMap((group) => {
      const available = group.flatMap((s) => {
        const point = s.points.find((q) => q.x === p.x && q.y !== null)
        return point ? [tipLine(chart, s, point)] : []
      })
      return available.length ? available : [tipLine(chart, group[0]!, undefined)]
    })
    return hit(x0, m.top, x1 - x0, H - m.top - m.bottom, () => [p.label, ...lines()].join('\n'))
  })

  return svg`${panel.label ? svg`<text x="${m.left}" y="14" font-size="13" font-weight="600" fill="var(--ink)">${panel.label}</text>` : null}
${key}${bandEl}${yGrid(y, ticks, m.left, W - m.right, f)}${refs}${notes.under}
${xLabels(timeTicks(sorted, x, Math.min(narrow || small ? 5 : 8, tickRoom(W - m.left - m.right, sorted.at(-1)?.label ?? '2026'))), H - m.bottom, { left: m.left, right: W - m.right })}
${noData}${lines}${notes.over}${ends}<g class="hits">${hits}</g>`
}

/** Hold the last value to a date, so a step line reaches today. */
function extend(s: SeriesData, to: string): SeriesData {
  const last = s.points.at(-1)
  if (!last || last.x >= to) return s
  return { ...s, points: [...s.points, { ...last, x: to, label: parsePeriod(to).label, t: parsePeriod(to).t }] }
}

