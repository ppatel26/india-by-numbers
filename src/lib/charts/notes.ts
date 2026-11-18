/** Notes on a time axis, shared by line and column charts: spans, markers, breaks and callouts. */
import type { ScaleLinear } from 'd3-scale'
import type { Chart, Callout, Breakpoint } from '~/content/types'
import { svg, type Markup } from '~/lib/markup'
import { colorVar } from '~/lib/tokens'
import { note as mono } from './axes'
import { show, when, type SeriesData } from './model'

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
  /** Series that carry an end label: a callout on that same last point would repeat it. */
  endLabeled?: ReadonlySet<string>
  /**
   * Column charts: the highest bar top (pixel y) between two pixel x values. A callout sits on
   * the cap of its column, above any neighbour its text crosses, with no dot.
   */
  capAt?: (x0: number, x1: number) => number
  /** Column charts: the lowest bar bottom (pixel y) between two pixel x values, for negative values. */
  floorAt?: (x0: number, x1: number) => number
  /** Step lines hold each value until the next point. */
  step?: boolean
}

type Seg = readonly [number, number, number, number]

/** The drawn lines as pixel segments, so a callout can keep its text off them. */
function lineSegments(box: NoteBox): Seg[] {
  return box.series.flatMap((s) => {
    const pts = s.points.flatMap((p) => {
      const px = p.y === null ? undefined : box.xOf(p.x)
      return px === undefined ? [] : [[px, box.y(p.y!)] as const]
    })
    return pts.slice(1).flatMap(([x1, y1], i): Seg[] => {
      const [x0, y0] = pts[i]!
      return box.step ? [[x0, y0, x1, y0], [x1, y0, x1, y1]] : [[x0, y0, x1, y1]]
    })
  })
}

/** True when a segment passes through a rectangle (Liang-Barsky clipping). */
function crosses([x0, y0, x1, y1]: Seg, r: { l: number; t: number; r: number; b: number }): boolean {
  let lo = 0
  let hi = 1
  const dx = x1 - x0
  const dy = y1 - y0
  for (const [p, q] of [[-dx, x0 - r.l], [dx, r.r - x0], [-dy, y0 - r.t], [dy, r.b - y0]] as const) {
    if (p === 0) {
      if (q < 0) return false
    } else {
      const t = q / p
      if (p < 0) lo = Math.max(lo, t)
      else hi = Math.min(hi, t)
      if (lo > hi) return false
    }
  }
  return true
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
  if (!s || !p || p.y === null || px === undefined || (box.endLabeled?.has(s.key) && s.points.findLast((q) => q.y !== null) === p)) return null
  const py = box.y(p.y)
  const text = c.label ?? `${show(chart, p, s).text} ${when(p.label)}`
  const rules = [...(chart.breaks ?? []), ...(chart.markers ?? [])].flatMap((b) => {
    const rx = box.xOf(b.x)
    return rx === undefined ? [] : [rx]
  })
  if (box.capAt) return capLabel(text, px, box, p.y < 0, rules)
  // Try spots around the point, nearest first, and take the first whose text crosses no line.
  const w = text.length * 6.5
  const segs: Seg[] = [...lineSegments(box), ...rules.map((rx): Seg => [rx, box.top - 22, rx, box.bottom])]
  // Farther spots last, sideways before up and down: between two close lines the near ones can all be crossed.
  const offsets: readonly (readonly [number, number])[] = [[7, -7], [7, 15], [-7, -7], [-7, 15], [7, -21], [7, 29], [-7, -21], [-7, 29], [21, -21], [21, 29], [-21, -21], [-21, 29], [7, -37], [-7, -37], [7, 45], [-7, 45], [7, -53], [-7, -53]]
  const spots = offsets.map(([dx, dy]) => {
    const start = dx > 0 ? px + dx : px + dx - w
    return { x: start, y: py + dy, r: { l: start - 2, t: py + dy - 11, r: start + w + 2, b: py + dy + 3 } }
  }).filter((o) => o.r.l >= (box.left ?? -Infinity) && o.r.r <= (box.right ?? Infinity) && o.r.t >= box.top - 4 && o.r.b <= box.bottom)
  const at = spots.findIndex((o) => !segs.some((sg) => crosses(sg, o.r)))
  const best = spots[at] ?? spots[0] ?? { x: px + 7, y: py - 7, r: { l: px, t: py, r: px, b: py } }
  // A label that had to move away from its point keeps a leader line back to it.
  const far = at >= 4
  const lx = best.x < px ? best.r.r - 2 : best.r.l + 2
  const ly = best.y < py ? best.r.b : best.r.t
  return svg`${far ? svg`<path d="M${px} ${py}L${lx} ${ly}" stroke="${colorVar(s.color)}" fill="none"/>` : null}<circle cx="${px}" cy="${py}" r="3.5" fill="${colorVar(s.color)}" stroke="var(--paper)" stroke-width="1.5"/>
<text x="${best.x}" y="${best.y}" font-size="12" fill="var(--ink)" paint-order="stroke" stroke="var(--paper)" stroke-width="3">${text}</text>`
}

/**
 * A column callout: the text centred on the column's cap, raised clear of every bar it spans.
 * When it has to rise above its own cap, a short rule ties it back to the column.
 */
function capLabel(text: string, px: number, box: NoteBox, below = false, rules: readonly number[] = []): Markup {
  const half = (text.length * 6.6) / 2 + 4
  let cx = Math.max((box.left ?? -Infinity) + half, Math.min(px, (box.right ?? Infinity) - half))
  // Keep the text off any break or marker rule: shift it to the column's side of the rule.
  for (const rx of rules) if (Math.abs(rx - cx) < half + 2) cx = rx >= px ? rx - half - 3 : rx + half + 3
  // A negative column's label hangs below its end, clear of any deeper neighbour.
  const edge = below ? box.floorAt! : box.capAt!
  const own = edge(px - 1, px + 1)
  const clear = below ? Math.max(own, edge(cx - half, cx + half)) : Math.min(own, edge(cx - half, cx + half))
  const ty = below ? clear + 16 : Math.max(12, clear - 8)
  const tied = Math.abs(own - ty) > (below ? 26 : 18)
  const y1 = below ? own + 2 : own - 2
  const y2 = below ? ty - 12 : ty + 4
  return svg`${tied ? svg`<line x1="${px}" x2="${px}" y1="${y1}" y2="${y2}" stroke="var(--slate)"/>` : null}
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
