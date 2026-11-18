/** Notes on a time axis, shared by line and column charts: spans, markers, breaks and callouts. */
import type { ScaleLinear } from 'd3-scale'
import type { Chart, Callout, Breakpoint } from '~/content/types'
import { svg, type Markup } from '~/lib/markup'
import { colorVar } from '~/lib/tokens'
import { note as mono } from './axes'
import { show, type SeriesData } from './model'

type WithNotes = Extract<Chart, { kind: 'line' | 'columns' | 'area' }>

export interface NoteBox {
  /** Pixel x of an x value, or undefined when it is not on the axis. */
  xOf: (x: string) => number | undefined
  y: ScaleLinear<number, number>
  top: number
  bottom: number
  series: readonly SeriesData[]
  /** True when the chart labels each series at its end. */
  endLabels?: boolean
}


function rule(b: Breakpoint, box: NoteBox, dotted: boolean): Markup | null {
  const bx = box.xOf(b.x)
  if (bx === undefined) return null
  const stroke = dotted ? 'var(--ink)' : 'var(--slate)'
  return svg`<line x1="${bx}" x2="${bx}" y1="${box.top - 6}" y2="${box.bottom}" stroke="${stroke}"${dotted ? svg` stroke-dasharray="2 3"` : null}/>
${b.before ? mono(bx - 6, box.top + 6, b.before, 'end', stroke) : null}${mono(b.before ? bx + 6 : bx - 6, box.top + 6, b.label, b.before ? 'start' : 'end', stroke)}`
}

function callout(c: Callout, chart: WithNotes, box: NoteBox): Markup | null {
  const s = box.series.find((se) => se.key === c.series)
  const p = s?.points.find((pt) => pt.x === c.x)
  const px = p && box.xOf(p.x)
  // The end label already names a series' last value.
  if (!s || !p || p.y === null || px === undefined || (box.endLabels && s.points.findLast((q) => q.y !== null) === p)) return null
  const py = box.y(p.y)
  const text = c.label ?? `${show(chart, p, s).text} in ${p.label}`
  return svg`<circle cx="${px}" cy="${py}" r="3" fill="${colorVar(s.color)}"/>
<text x="${px + 7}" y="${p.y >= 0 ? py - 6 : py + 14}" font-size="12" fill="var(--ink)" paint-order="stroke" stroke="var(--paper)" stroke-width="3">${text}</text>`
}

/** `under` goes below the data marks, `over` above them. */
export function timeNotes(chart: WithNotes, box: NoteBox): { under: Markup; over: Markup } {
  const spans = (chart.spans ?? []).map((s) => {
    const a = box.xOf(s.from)
    const b = box.xOf(s.to)
    if (a === undefined || b === undefined) return null
    return svg`<rect x="${a}" y="${box.top}" width="${Math.max(2, b - a)}" height="${box.bottom - box.top}" fill="var(--band)"/>${mono(a + 4, box.top + 12, s.label)}`
  })
  return {
    under: svg`${spans}${(chart.markers ?? []).map((m) => rule(m, box, false))}${(chart.breaks ?? []).map((b) => rule(b, box, true))}`,
    over: svg`${(chart.callouts ?? []).map((c) => callout(c, chart, box))}`,
  }
}
