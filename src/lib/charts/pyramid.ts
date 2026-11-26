import { scaleLinear } from 'd3-scale'
import { fmt } from '~/lib/format'
import { svg, type Markup } from '~/lib/markup'
import { colorVar } from '~/lib/tokens'
import { FONT, WIDTH, frame, tipAttr, type Width } from './axes'
import { legend } from './dots'
import type { Point } from '~/lib/data'
import { seriesOf, type Of, type SeriesData } from './model'

/** Age pyramid: each bar is the group's share of the whole population. Youngest at the bottom. */
export function renderPyramid(chart: Of<'pyramid'>, width: Width): Markup {
  const [left, right] = seriesOf(chart) as [SeriesData, SeriesData]
  const narrow = width === 'narrow'
  const W = WIDTH[width]
  const groups = left.points.map((p) => p.x)
  const total = [...left.points, ...right.points].reduce((a, p) => a + (p.y ?? 0), 0)
  const share = (y: number | null) => ((y ?? 0) / total) * 100
  const max = Math.max(...[...left.points, ...right.points].map((p) => share(p.y)))
  const rowH = narrow ? 13 : 16
  const mid = W / 2
  const gutter = 34
  const m = { top: 32, bottom: 26 }
  const H = m.top + groups.length * rowH + m.bottom
  const x = scaleLinear().domain([0, Math.max(max, chart.max ?? 0)]).nice().range([0, mid - gutter - 8])
  const rows = [...groups].reverse().map((g, i) => {
    const y = m.top + i * rowH
    const l = left.points.find((p) => p.x === g)
    const r = right.points.find((p) => p.x === g)
    const line = (s: SeriesData, p: Point | undefined) =>
      `${s.label}: ${fmt(share(p?.y ?? null), { decimals: 2, unit: '%' })} (${p?.y != null ? fmt(p.y, { scale: 'lakh' }) : 'no data'})`
    const tip = () => `Age ${g}\n${line(left, l)}\n${line(right, r)}`
    return svg`<g class="row"${tipAttr(tip)}>
<rect x="${mid - gutter - x(share(l?.y ?? null))}" y="${y + 1}" width="${x(share(l?.y ?? null))}" height="${rowH - 2}" fill="${colorVar(left.color)}"/>
<rect x="${mid + gutter}" y="${y + 1}" width="${x(share(r?.y ?? null))}" height="${rowH - 2}" fill="${colorVar(right.color)}"/>
<text x="${mid}" y="${y + rowH - 4}" text-anchor="middle" font-family="${FONT.mono}" font-size="10.5" fill="var(--slate)">${g}</text></g>`
  })
  const ticks = x.ticks(narrow ? 2 : 4)
  const axis = ticks.map((t) => svg`<text x="${mid - gutter - x(t)}" y="${H - 8}" text-anchor="middle" font-family="${FONT.mono}" font-size="11" fill="var(--slate)">${t}%</text>
<text x="${mid + gutter + x(t)}" y="${H - 8}" text-anchor="middle" font-family="${FONT.mono}" font-size="11" fill="var(--slate)">${t}%</text>`)
  // Shares are of everyone whose age was recorded; the Census also counts people of unstated age.
  const caption = svg`<text x="${W}" y="12" text-anchor="end" font-size="12" fill="var(--slate)">Share of all people with a stated age</text>`
  return frame(width, H, chart.title, svg`${legend([left, right])}${narrow ? null : caption}${rows}${axis}`)
}
