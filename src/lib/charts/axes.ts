/** Shared plot parts: sizes, scales, gridlines, ticks, labels and hover targets. */
import { scaleLinear, type ScaleLinear } from 'd3-scale'
import type { Axis, Format } from '~/content/types'
import { formatTick, type Shown } from '~/lib/format'
import { colorVar } from '~/lib/tokens'
import { attr, svg, type Markup } from '~/lib/markup'
import type { Point } from '~/lib/data'

/** wide: the page; narrow: a phone; half: one of two panels side by side on the page (phone layout). */
/** `page` is the full page width (--page), for the States page map only. */
export type Width = 'wide' | 'half' | 'narrow' | 'page'
export const WIDTH: Record<Width, number> = { wide: 912, half: 444, narrow: 358, page: 1200 }

export const FONT = {
  ui: "'Hanken Grotesk', system-ui, sans-serif",
  mono: "'Geist Mono', ui-monospace, monospace",
} as const

export function frame(width: Width, height: number, label: string, body: Markup | Markup[]): Markup {
  const w = WIDTH[width]
  const inner = svg`${body}`
  // A plot with links in it (state names, tiles) is a group; an image cannot hold links.
  const role = inner.html.includes('<a ') ? 'group' : 'img'
  return svg`<svg class="plot" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${height}" width="${w}" height="${height}" role="${role}" aria-label="${label}" font-family="${FONT.ui}">${inner}</svg>`
}

/** A y scale from 0 (or the data minimum, when below 0) to a nice maximum. */
export function yScale(values: readonly number[], range: [number, number], axis: Axis = {}): ScaleLinear<number, number> {
  const lo = axis.min ?? Math.min(0, ...values)
  const hi = axis.max ?? Math.max(...values)
  const s = scaleLinear().domain([lo, hi]).range(range)
  return axis.min !== undefined && axis.max !== undefined ? s : s.nice(5)
}

export function yTicks(s: ScaleLinear<number, number>, axis: Axis = {}): number[] {
  if (!axis.step) return s.ticks(5)
  const [lo, hi] = s.domain() as [number, number]
  const out: number[] = []
  for (let v = Math.ceil(lo / axis.step) * axis.step; v <= hi + 1e-9; v += axis.step) out.push(+v.toFixed(6))
  return out
}

/**
 * Tick labels print the fewest decimals that keep every tick exact: "20 crore", not "20.0 crore".
 * Unscaled ticks already drop trailing zeros; crore and lakh ticks need it worked out.
 */
function tickLabels(ticks: readonly number[], f: Format | undefined): (t: number, withUnit: boolean) => Shown {
  // An axis that reaches a lakh reads in one unit on every tick: 0, 1 lakh, 2 lakh.
  const peak = Math.max(...ticks.map((t) => Math.abs(t * (f?.multiply ?? 1))))
  const auto: Format['scale'] = f?.scale === undefined && peak >= 1e5 ? (peak >= 1e7 ? 'crore' : 'lakh') : f?.scale
  const base: Format = { ...f, scale: auto, decimals: undefined, unit: f?.unit === 'pp' ? '' : f?.unit }
  const per = (f?.scale === 'crore' ? 1e7 : f?.scale === 'lakh' ? 1e5 : 0) / (f?.multiply ?? 1)
  const exact = (d: number) => ticks.every((t) => Math.abs(Math.round((t / per) * 10 ** d) - (t / per) * 10 ** d) < 1e-6)
  const d = per ? ([0, 1, 2].find(exact) ?? 2) : 0
  // The baseline reads plain 0; the unit, the scale word (crore, lakh) and any suffix sit on the
  // top tick only, as "%" does: 160 crore, 120, 80.
  const bare = (x: string) => x.replace(/ (crore|lakh|thousand|million|billion)$/, '')
  return (t, withUnit) => {
    if (t === 0 && !withUnit) return { text: '0' }
    const shown = formatTick(t, { ...base, unit: withUnit ? base.unit : '', suffix: withUnit ? base.suffix : '' }, d)
    return withUnit ? shown : { text: bare(shown.text), alt: shown.alt && bare(shown.alt) }
  }
}

/** Left margin wide enough for the longest y tick label (Geist Mono 11 px runs about 7 px a character). */
export function yRoom(values: readonly number[], axis: Axis | undefined, f?: Format): number {
  const s = yScale(values, [1, 0], axis)
  const ticks = yTicks(s, axis)
  const label = tickLabels(ticks, f)
  const longest = Math.max(...ticks.map((t) => label(t, true).text.length))
  return Math.max(32, longest * 7 + 12)
}

/** Horizontal gridlines with labels at the left. The top label carries the unit. */
export function yGrid(s: ScaleLinear<number, number>, ticks: number[], x0: number, x1: number, f?: Format): Markup {
  const top = ticks.at(-1)
  const label = tickLabels(ticks, f)
  return svg`<g class="y-grid">${ticks.map((t) => {
    const y = s(t)
    const shown = label(t, t === top)
    return svg`<line x1="${x0}" x2="${x1}" y1="${y}" y2="${y}" stroke="${t === 0 ? colorVar('ink') : 'var(--grid)'}" stroke-width="1"/>
<text x="${x0 - 8}" y="${y + 4}" text-anchor="end" font-family="${FONT.mono}" font-size="11" fill="var(--slate)"${attr('data-alt', shown.alt)}>${shown.text}</text>`
  })}</g>`
}

/** Labels under a time axis. A label that would run past the plot edge is aligned to it. "\n" breaks a label in two lines. */
export function xLabels(ticks: readonly { x: number; label: string }[], y: number, edges?: { left: number; right: number }): Markup {
  // Place each label (edge labels align to the edge), then drop any that would touch its neighbour.
  const placed = ticks.map((t) => {
    const w = Math.max(...t.label.split('\n').map((l) => l.length)) * 6.6
    const anchor = edges && t.x + w / 2 > edges.right ? 'end' : edges && t.x - w / 2 < edges.left - 6 ? 'start' : 'middle'
    const tx = anchor === 'end' ? Math.min(t.x + 4, edges!.right + 4) : anchor === 'start' ? t.x - 4 : t.x
    const l = anchor === 'end' ? tx - w : anchor === 'start' ? tx : tx - w / 2
    return { ...t, anchor, tx, l, r: l + w }
  })
  const kept = [...placed]
  for (let i = 1; i < kept.length; i++) if (kept[i]!.l < kept[i - 1]!.r + 10) kept.splice(i === kept.length - 1 ? i - 1 : i--, 1)
  return svg`<g class="x-ticks">${kept.map((t) => {
    const { anchor, tx } = t
    return svg`<line x1="${t.x}" x2="${t.x}" y1="${y - 4}" y2="${y}" stroke="var(--ink)"/>
<text x="${tx}" y="${y + 14}" text-anchor="${anchor}" font-family="${FONT.mono}" font-size="11" fill="var(--slate)">${t.label.split('\n').map((l, i) => svg`<tspan x="${tx}" dy="${i === 0 ? 0 : 13}">${l}</tspan>`)}</text>`
  })}</g>`
}

/** How many time labels fit across a plot: each needs its own width and some air. */
export const tickRoom = (width: number, label: string): number => Math.max(2, Math.floor(width / (label.length * 6.6 + 22)))

/**
 * Tick positions for a time axis. Calendar data gets year ticks; financial
 * years and other spans get every n-th label.
 */
export function timeTicks(pts: readonly Point[], x: (t: number) => number, max: number): { x: number; label: string }[] {
  const spans = pts.some((p) => /^\d{4}-\d{2}$|Q\d/.test(p.label))
  if (pts.some((p) => /Q\d/.test(p.label))) {
    // Quarters: tick the first quarter of a year, every n-th year, so ticks never cycle Q1, Q4, Q3.
    const firsts = pts.filter((p) => /Q1\b/.test(p.label))
    const step = Math.max(1, Math.ceil(firsts.length / max))
    const last = firsts.length - 1
    return firsts.filter((_, i) => (last - i) % step === 0).map((p) => ({ x: x(p.t), label: p.label }))
  }
  if (spans) {
    // Count back from the last period, so the axis always names where the data ends.
    const step = Math.max(1, Math.ceil(pts.length / max))
    const last = pts.length - 1
    return pts.filter((_, i) => (last - i) % step === 0).map((p) => ({ x: x(p.t), label: p.label }))
  }
  const t0 = pts[0]!.t
  const t1 = pts.at(-1)!.t
  if (t1 - t0 < 1.5 && /^\d{1,2} [A-Z][a-z]{2} \d{4}$/.test(pts[0]!.label)) {
    // Daily data: a tick at the first day of each month, "Jan 2026", then "Feb", "Mar".
    const firsts = pts.filter((p, i) => i === 0 || p.label.slice(-8) !== pts[i - 1]!.label.slice(-8))
    const step = Math.max(1, Math.ceil(firsts.length / max))
    return firsts
      .filter((_, i) => i % step === 0)
      .map((p, i) => {
        const [mon, year] = p.label.split(' ').slice(1)
        return { x: x(p.t), label: i === 0 || mon === 'Jan' ? `${mon} ${year}` : mon! }
      })
  }
  if (t1 - t0 < 3) {
    // Under three years: month ticks, a whole number of quarters apart where possible, with the
    // year on the first tick and on each January.
    const raw = Math.max(1, Math.ceil(pts.length / max))
    const step = raw <= 1 ? 1 : raw <= 3 ? 3 : raw <= 6 ? 6 : 12
    return pts
      .filter((_, i) => i % step === 0)
      .map((p, i) => ({ x: x(p.t), label: i === 0 || p.label.startsWith('Jan') ? p.label : p.label.split(' ')[0]! }))
  }
  return scaleLinear()
    .domain([t0, t1])
    .ticks(max)
    .filter((t) => Number.isInteger(t))
    .map((t) => ({ x: x(t), label: String(t) }))
}

/**
 * Spread labels so they do not overlap. Each label wants to sit at `y`;
 * the result keeps the order and leaves `gap` between neighbours.
 */
export function spread<T extends { y: number }>(items: T[], gap: number, lo: number, hi: number): (T & { ly: number })[] {
  // Labels that would overlap form a group, centred on the mean of where its members want to be,
  // so each label stays as close to its own point as the others allow. Groups merge until none overlap.
  const sorted = [...items].sort((a, b) => a.y - b.y)
  type Group = { members: T[]; top: number }
  const groups: Group[] = []
  for (const it of sorted) {
    groups.push({ members: [it], top: it.y })
    for (;;) {
      const g = groups.at(-1)!
      const prev = groups.at(-2)
      if (!prev || prev.top + prev.members.length * gap <= g.top) break
      const members = [...prev.members, ...g.members]
      const mean = members.reduce((a, m) => a + m.y, 0) / members.length
      groups.splice(-2, 2, { members, top: mean - ((members.length - 1) * gap) / 2 })
    }
  }
  // Keep the whole set inside [lo, hi].
  const first = groups[0]
  const last = groups.at(-1)
  if (last) {
    const over = last.top + (last.members.length - 1) * gap - hi
    if (over > 0) for (const g of groups) g.top -= over
  }
  if (first && first.top < lo) {
    const under = lo - first.top
    for (const g of groups) g.top += under
  }
  return groups.flatMap((g) => g.members.map((m, i) => ({ ...m, ly: g.top + i * gap })))
}

/** A small mono label with a white halo, so lines under it do not hide it. */
export const note = (x: number, y: number, text: string, anchor: 'start' | 'middle' | 'end' = 'start', fill = 'var(--slate)'): Markup =>
  svg`<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${FONT.mono}" font-size="10.5" fill="${fill}" paint-order="stroke" stroke="var(--paper)" stroke-width="3" stroke-linejoin="round">${text.toUpperCase()}</text>`

/** Width of a `note` label: 10.5 px mono capitals. */
export const noteWidth = (text: string): number => text.length * 6.4

/** Height of one extra row of reference labels. */
export const REF_ROW = 14

/**
 * Where each reference label goes: right of its line, else left of it, else one row up.
 * No label runs past the plot's right edge or the frame's left edge, and none touches another.
 */
export function refPlaces(refs: readonly { value: number; label: string }[] | undefined, x: ScaleLinear<number, number>): { at: number; tx: number; anchor: 'start' | 'end'; row: number; label: string }[] {
  const edge = x.range()[1]!
  const placed: { l: number; r: number; row: number }[] = []
  return [...(refs ?? [])]
    .sort((a, b) => a.value - b.value)
    .map((ref) => {
      const at = x(ref.value)
      const w = noteWidth(ref.label)
      const free = (l: number, row: number) => l >= 0 && l + w <= edge + 4 && !placed.some((p) => p.row === row && l < p.r + 8 && l + w > p.l - 8)
      const tries = [0, 1, 2].flatMap((row) => [
        { l: at + 4, anchor: 'start' as const, row },
        { l: at - 4 - w, anchor: 'end' as const, row },
      ])
      const pick = tries.find((t) => free(t.l, t.row)) ?? { l: Math.max(0, Math.min(at + 4, edge - w)), anchor: 'start' as const, row: 0 }
      const l = pick.l
      placed.push({ l, r: l + w, row: pick.row })
      return { at, tx: pick.anchor === 'start' ? l : l + w, anchor: pick.anchor, row: pick.row, label: ref.label }
    })
}

/** Rows of reference labels a chart needs above its plot. */
export const refRows = (refs: readonly { value: number; label: string }[] | undefined, x: ScaleLinear<number, number>): number =>
  Math.max(0, ...refPlaces(refs, x).map((p) => p.row + 1))

/**
 * Vertical reference lines across a horizontal value axis, with labels at the top. The line
 * stops at each `gap` (a y range with text in it), so it never strikes through a label.
 */
/** A stretch of y where reference lines break: [top, bottom], or [top, bottom, left, right] for a box (a value label). */
export type Gap = readonly [number, number] | readonly [number, number, number, number]

export function valueRefs(refs: readonly { value: number; label: string }[] | undefined, x: ScaleLinear<number, number>, top: number, bottom: number, gaps: readonly Gap[] = []): Markup {
  return svg`${refPlaces(refs, x).map((p) => {
    // The label sits above the line's top, clear of the first row of marks.
    const cuts = gaps
      .filter(([a, b, l, r]) => b > top && a < bottom && (l === undefined || (p.at >= l - 2 && p.at <= r! + 2)))
      .sort((a, b) => a[0] - b[0])
    let d = ''
    let y0 = top
    for (const [a, b] of cuts) {
      if (a > y0) d += `M${p.at} ${y0}V${a}`
      y0 = Math.max(y0, b)
    }
    if (bottom > y0) d += `M${p.at} ${y0}V${bottom}`
    return svg`<path d="${d}" stroke="var(--slate)" stroke-dasharray="3 3" fill="none"/>
${note(p.tx, top - 6 - p.row * REF_ROW, p.label, p.anchor)}`
  })}`
}

/** An invisible hover target. The page script shows `tip` (lines split by "\n"). */
export const hit = (x: number, y: number, w: number, h: number, tip: string): Markup =>
  svg`<rect class="hit" x="${x}" y="${y}" width="${Math.max(1, w)}" height="${Math.max(1, h)}" fill="transparent" data-tip="${tip}" tabindex="-1"/>`
