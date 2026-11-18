/** Shared plot parts: sizes, scales, gridlines, ticks, labels and hover targets. */
import { scaleLinear, type ScaleLinear } from 'd3-scale'
import type { Axis, Format } from '~/content/types'
import { formatNumber } from '~/lib/format'
import { colorVar } from '~/lib/tokens'
import { attr, svg, type Markup } from '~/lib/markup'
import type { Point } from '~/lib/data'

export type Width = 'wide' | 'narrow'
export const WIDTH: Record<Width, number> = { wide: 912, narrow: 358 }

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

const tickFormat = (f: Format | undefined): Format => ({ ...f, decimals: undefined, unit: f?.unit === 'pp' ? '' : f?.unit })

/** Horizontal gridlines with labels at the left. The top label carries the unit. */
export function yGrid(s: ScaleLinear<number, number>, ticks: number[], x0: number, x1: number, f?: Format): Markup {
  const top = ticks.at(-1)
  return svg`<g class="y-grid">${ticks.map((t) => {
    const y = s(t)
    const shown = formatNumber(t, { ...tickFormat(f), unit: t === top ? tickFormat(f).unit : '' })
    return svg`<line x1="${x0}" x2="${x1}" y1="${y}" y2="${y}" stroke="${t === 0 ? colorVar('ink') : 'var(--grid)'}" stroke-width="1"/>
<text x="${x0 - 8}" y="${y + 4}" text-anchor="end" font-family="${FONT.mono}" font-size="11" fill="var(--slate)"${attr('data-alt', shown.alt)}>${shown.text}</text>`
  })}</g>`
}

/** Labels under a time axis. */
export function xLabels(ticks: readonly { x: number; label: string }[], y: number): Markup {
  return svg`<g class="x-ticks">${ticks.map(
    (t) => svg`<line x1="${t.x}" x2="${t.x}" y1="${y - 4}" y2="${y}" stroke="var(--ink)"/>
<text x="${t.x}" y="${y + 14}" text-anchor="middle" font-family="${FONT.mono}" font-size="11" fill="var(--slate)">${t.label}</text>`,
  )}</g>`
}

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
  if (t1 - t0 < 1.5) {
    // Under two years: month ticks.
    const step = Math.max(1, Math.ceil(pts.length / max))
    return pts.filter((_, i) => i % step === 0).map((p) => ({ x: x(p.t), label: p.label }))
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
  const out = items.map((it) => ({ ...it, ly: it.y })).sort((a, b) => a.ly - b.ly)
  for (let i = 1; i < out.length; i++) out[i]!.ly = Math.max(out[i]!.ly, out[i - 1]!.ly + gap)
  const over = (out.at(-1)?.ly ?? 0) - hi
  if (over > 0) for (const o of out) o.ly -= over
  for (let i = out.length - 2; i >= 0; i--) out[i]!.ly = Math.min(out[i]!.ly, out[i + 1]!.ly - gap)
  for (const o of out) o.ly = Math.max(lo, o.ly)
  return out
}

/** A small mono label with a white halo, so lines under it do not hide it. */
export const note = (x: number, y: number, text: string, anchor: 'start' | 'middle' | 'end' = 'start', fill = 'var(--slate)'): Markup =>
  svg`<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${FONT.mono}" font-size="10.5" fill="${fill}" paint-order="stroke" stroke="var(--paper)" stroke-width="3" stroke-linejoin="round">${text.toUpperCase()}</text>`

/** Vertical reference lines across a horizontal value axis, with labels at the top. */
export function valueRefs(refs: readonly { value: number; label: string }[] | undefined, x: (v: number) => number, top: number, bottom: number): Markup {
  return svg`${(refs ?? []).map((r) => svg`<line x1="${x(r.value)}" x2="${x(r.value)}" y1="${top}" y2="${bottom}" stroke="var(--ink)" stroke-dasharray="3 3"/>
${note(x(r.value) + 4, top + 10, r.label)}`)}`
}

/** An invisible hover target. The page script shows `tip` (lines split by "\n"). */
export const hit = (x: number, y: number, w: number, h: number, tip: string): Markup =>
  svg`<rect class="hit" x="${x}" y="${y}" width="${Math.max(1, w)}" height="${Math.max(1, h)}" fill="transparent" data-tip="${tip}" tabindex="-1"/>`
