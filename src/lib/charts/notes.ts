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
  /** Left and right edges of the plot: callouts near them stay inside. */
  left?: number
  right?: number
  series: readonly SeriesData[]
  /** True when the chart labels each series at its end. */
  endLabels?: boolean
  /**
   * Column charts: the highest bar top (pixel y) between two pixel x values. A callout sits on
   * the cap of its column, above any neighbour its text crosses, with no dot.
   */
  capAt?: (x0: number, x1: number) => number
}


function rule(b: Breakpoint, box: NoteBox, dotted: boolean): Markup | null {
  const bx = box.xOf(b.x)
  if (bx === undefined) return null
  const stroke = dotted ? 'var(--ink)' : 'var(--slate)'
  // Labels sit in the band above the plot (callers leave 24 px for them), clear of the lines.
  return svg`<line x1="${bx}" x2="${bx}" y1="${box.top - 22}" y2="${box.bottom}" stroke="${stroke}"${dotted ? svg` stroke-dasharray="2 3"` : null}/>
${b.before ? mono(bx - 6, box.top - 12, b.before, 'end', stroke) : null}${mono(b.before ? bx + 6 : bx - 6, box.top - 12, b.label, b.before ? 'start' : 'end', stroke)}`
}

function callout(c: Callout, chart: WithNotes, box: NoteBox): Markup | null {
  const s = box.series.find((se) => se.key === c.series)
  const p = s?.points.find((pt) => pt.x === c.x)
  const px = p && box.xOf(p.x)
  // The end label already names a series' last value.
  if (!s || !p || p.y === null || px === undefined || (box.endLabels && s.points.findLast((q) => q.y !== null) === p)) return null
  const py = box.y(p.y)
  const text = c.label ?? `${show(chart, p, s).text} in ${p.label}`
  if (box.capAt && p.y >= 0) return capLabel(text, px, box)
  const left = box.right !== undefined && px + 7 + text.length * 6.5 > box.right
  return svg`<circle cx="${px}" cy="${py}" r="3" fill="${colorVar(s.color)}"/>
<text x="${left ? px - 7 : px + 7}" y="${p.y >= 0 ? py - 6 : py + 14}" text-anchor="${left ? 'end' : 'start'}" font-size="12" fill="var(--ink)" paint-order="stroke" stroke="var(--paper)" stroke-width="3">${text}</text>`
}

/**
 * A column callout: the text centred on the column's cap, raised clear of every bar it spans.
 * When it has to rise above its own cap, a short rule ties it back to the column.
 */
function capLabel(text: string, px: number, box: NoteBox): Markup {
  const half = (text.length * 6.6) / 2 + 4
  const cx = Math.max((box.left ?? -Infinity) + half, Math.min(px, (box.right ?? Infinity) - half))
  const own = box.capAt!(px - 1, px + 1)
  const clear = Math.min(own, box.capAt!(cx - half, cx + half))
  const ty = Math.max(12, clear - 8)
  const tied = own - ty > 18
  return svg`${tied ? svg`<line x1="${px}" x2="${px}" y1="${own - 2}" y2="${ty + 4}" stroke="var(--slate)"/>` : null}
<text x="${cx}" y="${ty}" text-anchor="middle" font-size="12" font-weight="500" fill="var(--ink)" paint-order="stroke" stroke="var(--paper)" stroke-width="3">${text}</text>`
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
