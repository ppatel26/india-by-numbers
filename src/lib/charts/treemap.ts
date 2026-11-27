/**
 * Treemap: parts of a whole as tiles, at most two levels. Squarified layout (Bruls, Huizing and
 * van Wijk, 2000): tiles as close to square as the order allows, so areas compare.
 */
import type { Color } from '~/content/types'
import type { Point } from '~/lib/data'
import { svg, type Markup } from '~/lib/markup'
import { fillVar, textOn } from '~/lib/tokens'
import { WIDTH, frame, tipAttr, type Width } from './axes'
import { drawn, seriesOf, show, type Of, type SeriesData } from './model'

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

/** The worst aspect ratio in a row of areas laid along a side of this length. */
function worst(row: readonly number[], side: number): number {
  const s = row.reduce((a, v) => a + v, 0)
  const hi = Math.max(...row)
  const lo = Math.min(...row)
  return Math.max((side * side * hi) / (s * s), (s * s) / (side * side * lo))
}

/**
 * Lay out items in a rectangle, largest first, each with an area in proportion to its value.
 * Items of 0 or less get no tile. The tiles fill the rectangle exactly and never overlap.
 */
export function squarify<T extends { value: number }>(items: readonly T[], rect: Rect): (T & Rect)[] {
  const sorted = items.filter((i) => i.value > 0).sort((a, b) => b.value - a.value)
  const total = sorted.reduce((a, i) => a + i.value, 0)
  if (!sorted.length || rect.w <= 0 || rect.h <= 0) return []
  const scale = (rect.w * rect.h) / total
  const out: (T & Rect)[] = []
  let r = { ...rect }
  let row: T[] = []
  const areas = (xs: readonly T[]) => xs.map((i) => i.value * scale)
  const place = (xs: readonly T[], last: boolean) => {
    const a = areas(xs)
    const s = a.reduce((p, v) => p + v, 0)
    if (r.w >= r.h) {
      // A column at the left, as wide as the row's area needs.
      const w = last ? r.w : s / r.h
      let y = r.y
      xs.forEach((it, i) => {
        const h = i === xs.length - 1 ? r.y + r.h - y : a[i]! / w
        out.push({ ...it, x: r.x, y, w, h })
        y += h
      })
      r = { x: r.x + w, y: r.y, w: r.w - w, h: r.h }
    } else {
      // A row along the top.
      const h = last ? r.h : s / r.w
      let x = r.x
      xs.forEach((it, i) => {
        const w = i === xs.length - 1 ? r.x + r.w - x : a[i]! / h
        out.push({ ...it, x, y: r.y, w, h })
        x += w
      })
      r = { x: r.x, y: r.y + h, w: r.w, h: r.h - h }
    }
  }
  for (const it of sorted) {
    const side = Math.min(r.w, r.h)
    if (row.length && worst(areas([...row, it]), side) > worst(areas(row), side)) {
      place(row, false)
      row = []
    }
    row.push(it)
  }
  place(row, true)
  return out
}

export interface Part {
  key: string
  label: string
  value: number
  pt: Point
  /** The parent's label, for a part in a group. */
  group?: string
}

export interface TreemapData {
  series: SeriesData
  parts: Part[]
  /** Top-level tiles: a part on its own, or a group of parts. */
  tops: { key: string; label: string; value: number; parts: Part[]; group: boolean }[]
  total: number
  /** The published total from a hidden series, when the chart picks one. */
  published?: Point
}

/** Parts of a treemap chart, their groups and their total. A part is never counted twice. */
export function treemapData(chart: Of<'treemap'>): TreemapData {
  const series = drawn(chart)[0]!
  const hidden = seriesOf(chart).find((s) => s.hidden)
  const parts: Part[] = series.points
    .filter((p) => p.y !== null)
    .map((p) => {
      const g = chart.parent ? chart.parent.groups[p.row[chart.parent.column] ?? ''] : undefined
      return { key: p.x, label: chart.labels?.[p.x] ?? p.x, value: p.y!, pt: p, group: g }
    })
  const tops: TreemapData['tops'] = []
  for (const p of parts) {
    if (!p.group) tops.push({ key: p.key, label: p.label, value: p.value, parts: [p], group: false })
    else {
      const t = tops.find((x) => x.group && x.label === p.group)
      if (t) {
        t.parts.push(p)
        t.value += p.value
      } else tops.push({ key: p.group, label: p.group, value: p.value, parts: [p], group: true })
    }
  }
  return { series, parts, tops, total: parts.reduce((a, p) => a + p.value, 0), published: hidden?.points.find((p) => p.y !== null) }
}

const GROUP_COLORS: readonly Color[] = ['s2', 's5', 's4', 's6']

/** Width of text at 12 px Hanken (about 6.4 px a character). */
const textW = (s: string, size = 12) => s.length * size * 0.54

export const shareText = (value: number, total: number): string => `${((value / total) * 100).toFixed(1)}%`

/** True when the values are already shares of 100, so a share of the total would repeat them. */
export const isShares = (chart: Of<'treemap'>, total: number): boolean => chart.format?.unit === '%' && Math.abs(total - 100) < 0.5

/** Words in lines of at most `chars` characters; undefined when a word is longer than that. */
function lines(text: string, chars: number): string[] | undefined {
  const out: string[] = []
  for (const w of text.split(' ')) {
    if (w.length > chars) return undefined
    const last = out.at(-1)
    if (last !== undefined && last.length + 1 + w.length <= chars) out[out.length - 1] = `${last} ${w}`
    else out.push(w)
  }
  return out
}

export function renderTreemap(chart: Of<'treemap'>, width: Width): Markup {
  const data = treemapData(chart)
  const W = WIDTH[width]
  const H = width === 'wide' ? 440 : width === 'half' ? 380 : 420
  const head = 18
  const shares = isShares(chart, data.total)
  const groups = data.tops.filter((t) => t.group)
  const color = (t: { key: string; group: boolean }): Color => chart.colors?.[t.key] ?? (t.group ? GROUP_COLORS[groups.findIndex((g) => g.key === t.key) % GROUP_COLORS.length]! : 'other')
  const tiles: Markup[] = []
  const amount = (value: number, pt?: Point) => {
    const v = show(chart, pt ?? { x: '', label: '', t: NaN, y: value, raw: String(+value.toFixed(6)), row: {} }, data.series).text
    return shares ? v : `${v} · ${shareText(value, data.total)}`
  }
  const tip = (p: Part) => () =>
    [p.label, ...(p.group ? [`In ${p.group}`] : []), `${data.series.label}: ${show(chart, p.pt, data.series).text}`, ...(shares ? [] : [`Share of the total: ${shareText(p.value, data.total)}`])].join('\n')
  const tile = (p: Part, r: Rect, c: Color) => {
    const fill = fillVar(c)
    const ink = textOn(c === 'ink' ? 'ink-fill' : c)
    const value = amount(p.value, p.pt)
    const pad = 6
    // A label only where it fits: the name on up to three lines, then the value; else the name
    // alone; else nothing. The table lists every part.
    const name = lines(p.label, Math.floor((r.w - 2 * pad) / 6.5))
    const room = (n: number) => 8 + n * 14
    const withValue = name && name.length <= 3 && r.h >= room(name.length + 1) && r.w - 2 * pad >= textW(value, 11.5)
    const nameOnly = name && name.length <= 3 && r.h >= room(name.length)
    const text = withValue || nameOnly
      ? svg`<text x="${r.x + pad}" y="${r.y + 16}" font-size="12" font-weight="600" fill="${ink}">${name!.map((l, i) => svg`<tspan x="${r.x + pad}" dy="${i ? 14 : 0}">${l}</tspan>`)}</text>${withValue ? svg`<text x="${r.x + pad}" y="${r.y + 16 + name!.length * 14 + 1}" font-size="11.5" fill="${ink}">${value}</text>` : null}`
      : null
    return svg`<g class="part"${tipAttr(tip(p))}><rect x="${r.x}" y="${r.y}" width="${Math.max(0, r.w)}" height="${Math.max(0, r.h)}" fill="${fill}" stroke="var(--paper)" stroke-width="2"/>${text}</g>`
  }
  for (const t of squarify(data.tops, { x: 0, y: 0, w: W, h: H })) {
    const c = color(t)
    if (!t.group) {
      tiles.push(tile(t.parts[0]!, t, c))
      continue
    }
    // A group: a strip with its name and total (or its name alone, where the total does not fit),
    // then its parts inside.
    const label = [`${t.label} · ${amount(t.value)}`, t.label].find((l) => t.w > textW(l) + 12)
    const strip = t.h > 40 && label !== undefined
    const inner = strip ? { x: t.x, y: t.y + head, w: t.w, h: t.h - head } : t
    tiles.push(svg`<g class="group"><rect x="${t.x}" y="${t.y}" width="${t.w}" height="${t.h}" fill="var(--paper)" stroke="var(--ink)" stroke-width="1"/>${strip ? svg`<text x="${t.x + 6}" y="${t.y + 13}" font-size="12" font-weight="600" fill="var(--ink)">${label}</text>` : null}</g>`)
    for (const p of squarify(t.parts, inner)) tiles.push(tile(p, p, c))
  }
  return frame(width, H, chart.title, svg`<g class="tiles">${tiles}</g>`)
}
