/** Notes on a time axis, shared by line and column charts: spans, markers, breaks and callouts. */
import type { ScaleLinear } from 'd3-scale'
import type { Chart, Callout, Breakpoint } from '~/content/types'
import { attr, svg, type Markup } from '~/lib/markup'
import { both } from '~/lib/format'
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
  /** Boxes already taken (end labels): callouts keep clear of them. */
  avoid?: readonly Box[]
  /** The frame's right edge: no label runs past it. Default: `right`. */
  edge?: number
}

interface Box {
  l: number
  t: number
  r: number
  b: number
}

const overlaps = (a: Box, b: Box): boolean => a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t

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


/** Width of a rule label: 10.5 px mono capitals. */
const ruleText = (s: string): number => s.length * 6.4

/**
 * A break or marker line with its labels. A label that would run into another rule, another
 * rule's label or past the frame is left out; the line stays.
 */
function rule(b: Breakpoint, box: NoteBox, dotted: boolean, taken: Box[], prev = -Infinity, next = Infinity): Markup | null {
  const bx = box.xOf(b.x)
  if (bx === undefined) return null
  const stroke = dotted ? 'var(--ink)' : 'var(--slate)'
  const edge = box.edge ?? box.right ?? Infinity
  const ty = box.top - 12
  const place = (s: string, side: 'left' | 'right'): Markup | null => {
    const w = ruleText(s)
    const l = side === 'left' ? bx - 6 - w : bx + 6
    const r: Box = { l: l - 3, t: ty - 9, r: l + w + 3, b: ty + 2 }
    const clear = l >= 0 && l + w <= edge && (side === 'left' ? l >= prev + 4 : l + w <= next - 4) && !taken.some((o) => overlaps(o, r))
    if (!clear) return null
    taken.push(r)
    return mono(side === 'left' ? bx - 6 : bx + 6, ty, s, side === 'left' ? 'end' : 'start', stroke)
  }
  const before = b.before ? place(b.before, 'left') : null
  const label = !b.label ? null : place(b.label, b.before ? 'right' : 'left') ?? (b.before ? null : place(b.label, 'right'))
  // Labels sit in the band above the plot (callers leave 24 px for them), clear of the lines.
  return svg`<line x1="${bx}" x2="${bx}" y1="${box.top - 22}" y2="${box.bottom}" stroke="${stroke}"${dotted ? svg` stroke-dasharray="2 3"` : null}/>
${before}${label}`
}

function callout(c: Callout, chart: WithNotes, box: NoteBox, taken: Box[]): Markup | null {
  const s = box.series.find((se) => se.key === c.series)
  const p = s?.points.find((pt) => pt.x === c.x)
  const px = p && box.xOf(p.x)
  // The end label already names a series' last value.
  if (!s || !p || p.y === null || px === undefined || (box.endLabeled?.has(s.key) && s.points.findLast((q) => q.y !== null) === p)) return null
  const py = box.y(p.y)
  const shown = both(() => c.label ?? `${show(chart, p, s).text} ${when(p.label)}`)
  const text = shown.text
  const rules = [...(chart.breaks ?? []), ...(chart.markers ?? [])].flatMap((b) => {
    const rx = box.xOf(b.x)
    return rx === undefined ? [] : [rx]
  })
  if (box.capAt) return capLabel(text, px, box, p.y < 0, rules, shown.alt)
  const segs: Seg[] = [...lineSegments(box), ...rules.map((rx): Seg => [rx, box.top - 22, rx, box.bottom])]
  const left = box.left ?? -Infinity
  const right = box.edge ?? box.right ?? Infinity
  // Farther spots last, sideways before up and down: between two close lines the near ones can all be crossed.
  const offsets: readonly (readonly [number, number])[] = [[7, -7], [7, 15], [-7, -7], [-7, 15], [7, -21], [7, 29], [-7, -21], [-7, 29], [21, -21], [21, 29], [-21, -21], [-21, 29], [7, -37], [-7, -37], [7, 45], [-7, 45], [7, -53], [-7, -53]]
  // Try the text on one line, then on two: a long label near the edge fits as two short lines.
  const split = (t: string): string[] => {
    const words = t.split(' ')
    if (words.length < 2) return [t]
    let best = [t]
    let worst = Infinity
    for (let i = 1; i < words.length; i++) {
      const a = words.slice(0, i).join(' ')
      const b = words.slice(i).join(' ')
      if (Math.max(a.length, b.length) < worst) [best, worst] = [[a, b], Math.max(a.length, b.length)]
    }
    return best
  }
  type Spot = { x: number; y: number; r: Box; lines: string[]; crossed: number }
  // Each line of the other form: the same split, so line i swaps with line i.
  const altLines = (lines: string[]): string[] | undefined => (shown.alt === undefined ? undefined : lines.length === 1 ? [shown.alt] : split(shown.alt))
  const spotsFor = (lines: string[]): Spot[] => {
    // Room for the longer form, so the switch never pushes the text over a line or off the frame.
    const w = Math.max(...lines.map((l) => l.length), ...(altLines(lines) ?? []).map((l) => l.length)) * 6.5
    const h = (lines.length - 1) * 14
    return offsets
      .map(([dx, dy]) => {
        const start = dx > 0 ? px + dx : px + dx - w
        // A two-line label above its point grows upwards.
        const ty = dy < 0 ? py + dy - h : py + dy
        const r = { l: start - 2, t: ty - 11, r: start + w + 2, b: ty + h + 3 }
        return { x: start, y: ty, r, lines, crossed: segs.filter((sg) => crosses(sg, r)).length }
      })
      .filter((o) => o.r.l >= left && o.r.r <= right && o.r.t >= box.top - 4 && o.r.b <= box.bottom && ![...(box.avoid ?? []), ...taken].some((a) => overlaps(a, o.r)))
  }
  const one = spotsFor([text])
  // Two lines only when the other form splits in two as well.
  const two = text.includes(' ') && (shown.alt === undefined || split(shown.alt).length === 2) ? spotsFor(split(text)) : []
  // Best: one line crossing nothing; then two lines crossing nothing; then whatever crosses least.
  const best =
    one.find((o) => o.crossed === 0) ??
    two.find((o) => o.crossed === 0) ??
    [...one, ...two].sort((a, b) => a.crossed - b.crossed)[0]
  if (!best) return null
  taken.push(best.r)
  // A label that had to move away from its point keeps a grey leader line back to it.
  const gapX = px < best.r.l ? best.r.l - px : px > best.r.r ? px - best.r.r : 0
  const gapY = py < best.r.t ? best.r.t - py : py > best.r.b ? py - best.r.b : 0
  const far = gapX > 12 || gapY > 16
  const lx = best.x < px ? best.r.r - 2 : best.r.l + 2
  const ly = best.y < py ? best.r.b : best.r.t
  return svg`${far ? svg`<path d="M${px} ${py}L${lx} ${ly}" stroke="var(--slate)" fill="none"/>` : null}<circle cx="${px}" cy="${py}" r="3.5" fill="${colorVar(s.color)}" stroke="var(--paper)" stroke-width="1.5"/>
<text x="${best.x}" y="${best.y}" font-size="12" fill="var(--ink)" paint-order="stroke" stroke="var(--paper)" stroke-width="3">${best.lines.map((l, i) => svg`<tspan x="${best.x}" dy="${i === 0 ? 0 : 14}"${attr('data-alt', altLines(best.lines)?.[i])}>${l}</tspan>`)}</text>`
}

/**
 * A column callout: the text centred on the column's cap, raised clear of every bar it spans.
 * When it has to rise above its own cap, a short rule ties it back to the column.
 */
function capLabel(text: string, px: number, box: NoteBox, below = false, rules: readonly number[] = [], alt?: string): Markup {
  const half = (Math.max(text.length, alt?.length ?? 0) * 6.6) / 2 + 4
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
<text x="${cx}" y="${ty}" text-anchor="middle" font-size="12" font-weight="500" fill="var(--ink)" paint-order="stroke" stroke="var(--paper)" stroke-width="3"${attr('data-alt', alt)}>${text}</text>`
}

/** `under` goes below the data marks, `over` above them. */
export function timeNotes(chart: WithNotes, box: NoteBox): { under: Markup; over: Markup } {
  // Markers and breaks in x order, so each label knows how much room it has.
  const rules = [...(chart.markers ?? []).map((b) => ({ b, dotted: false })), ...(chart.breaks ?? []).map((b) => ({ b, dotted: true }))]
    .map((r) => ({ ...r, x: box.xOf(r.b.x) }))
    .filter((r): r is typeof r & { x: number } => r.x !== undefined)
    .sort((a, c) => a.x - c.x)
  const ruleBoxes: Box[] = []
  const callBoxes: Box[] = []
  const spans = (chart.spans ?? []).map((s) => {
    const a = box.xOf(s.from)
    const b = box.xOf(s.to)
    if (a === undefined || b === undefined) return null
    // A span label that would touch another span's label, or run past the frame, is left out.
    const r: Box = { l: a + 2, t: box.top + 1, r: a + 6 + ruleText(s.label), b: box.top + 15 }
    const fits = r.r <= (box.edge ?? box.right ?? Infinity) && !callBoxes.some((o) => overlaps(o, r))
    // Callouts keep clear of the span's label.
    if (fits) callBoxes.push(r)
    return svg`<rect x="${a}" y="${box.top}" width="${Math.max(2, b - a)}" height="${box.bottom - box.top}" fill="var(--band)"/>${fits ? mono(a + 4, box.top + 12, s.label) : null}`
  })
  return {
    under: svg`${spans}${rules.map(({ b, dotted }, i) => rule(b, box, dotted, ruleBoxes, rules[i - 1]?.x, rules[i + 1]?.x))}`,
    over: svg`${(chart.callouts ?? []).map((c) => callout(c, chart, box, callBoxes))}`,
  }
}
