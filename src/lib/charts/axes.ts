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
  const base: Format = { ...f, decimals: undefined, unit: f?.unit === 'pp' ? '' : f?.unit }
  const per = (f?.scale === 'crore' ? 1e7 : f?.scale === 'lakh' ? 1e5 : 0) / (f?.multiply ?? 1)
  const exact = (d: number) => ticks.every((t) => Math.abs(Math.round((t / per) * 10 ** d) - (t / per) * 10 ** d) < 1e-6)
  const d = per ? ([0, 1, 2].find(exact) ?? 2) : 0
  // The baseline reads plain 0; the unit sits on the top tick.
  return (t, withUnit) => (t === 0 && !withUnit ? { text: '0' } : formatTick(t, { ...base, unit: withUnit ? base.unit : '' }, d))
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

/** Labels under a time axis. A label that would run past the plot edge is aligned to it. */
export function xLabels(ticks: readonly { x: number; label: string }[], y: number, edges?: { left: number; right: number }): Markup {
  // Place each label (edge labels align to the edge), then drop any that would touch its neighbour.
  const placed = ticks.map((t) => {
    const w = t.label.length * 6.6
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
<text x="${tx}" y="${y + 14}" text-anchor="${anchor}" font-family="${FONT.mono}" font-size="11" fill="var(--slate)">${t.label}</text>`
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
  if (spans) {
    const step = Math.max(1, Math.ceil(pts.length / max))
    return pts.filter((_, i) => i % step === 0).map((p) => ({ x: x(p.t), label: p.label }))
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

/** Vertical reference lines across a horizontal value axis, with labels at the top. */
export function valueRefs(refs: readonly { value: number; label: string }[] | undefined, x: ScaleLinear<number, number>, top: number, bottom: number): Markup {
  const edge = x.range()[1]!
  return svg`${(refs ?? []).map((r) => {
    const at = x(r.value)
    // Near the right edge the label reads leftwards from the line.
    const left = edge - at < r.label.length * 7
    // The label sits above the line's top, clear of the first row of marks.
    return svg`<line x1="${at}" x2="${at}" y1="${top}" y2="${bottom}" stroke="var(--slate)" stroke-dasharray="3 3"/>
${note(left ? at - 4 : at + 4, top - 6, r.label, left ? 'end' : 'start')}`
  })}`
}

/** An invisible hover target. The page script shows `tip` (lines split by "\n"). */
export const hit = (x: number, y: number, w: number, h: number, tip: string): Markup =>
  svg`<rect class="hit" x="${x}" y="${y}" width="${Math.max(1, w)}" height="${Math.max(1, h)}" fill="transparent" data-tip="${tip}" tabindex="-1"/>`
