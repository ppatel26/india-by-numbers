import { scaleLinear } from 'd3-scale'
import { svg, attr, type Markup } from '~/lib/markup'
import { colorVar, textOn } from '~/lib/tokens'
import { FONT, WIDTH, frame, valueRefs, type Width } from './axes'
import { legend, rowName } from './dots'
import { drawn, show, tipLine, type Of, type SeriesData } from './model'

/** Horizontal bars by category: one series, grouped series, or stacked to a total. */
export function renderBars(chart: Of<'bars'>, width: Width): Markup {
  const series = drawn(chart)
  const narrow = width === 'narrow'
  const W = WIDTH[width]
  const val = (s: SeriesData, k: string) => s.points.find((p) => p.x === k)
  const keys = chart.order
    ? [...chart.order]
    : [...new Set(series.flatMap((s) => s.points.map((p) => p.x)))].sort(
        (a, b) => (val(series[0]!, b)?.y ?? -Infinity) - (val(series[0]!, a)?.y ?? -Infinity),
      )
  const name = (k: string) => chart.labels?.[k] ?? rowName(k)
  const grouped = !chart.stacked && series.length > 1
  const barH = grouped ? 10 : 14
  // On phones the category name sits above its bars, so long names never clip.
  const above = narrow ? 18 : 0
  const rowH = (grouped ? series.length * barH + 8 : 22) + above
  const labelW = narrow ? 0 : Math.min(260, 16 + Math.max(...keys.map((k) => name(k).length)) * 7)
  const m = { top: series.length > 1 ? 32 : 8, right: narrow ? 52 : 64, bottom: 8, left: labelW }
  const H = m.top + keys.length * rowH + m.bottom
  const total = (k: string) => series.reduce((a, s) => a + (val(s, k)?.y ?? 0), 0)
  const max = chart.axis?.max ?? (chart.stacked ? Math.max(...keys.map(total)) : Math.max(...series.flatMap((s) => s.points.map((p) => p.y ?? 0))))
  const min = chart.axis?.min ?? (chart.stacked ? 0 : Math.min(0, ...series.flatMap((s) => s.points.map((p) => p.y ?? 0))))
  const x = scaleLinear().domain([min, max]).nice().range([m.left, W - m.right])

  const rows = keys.map((k, i) => {
    const y = m.top + i * rowH
    const tip = [name(k), ...series.map((s) => tipLine(chart, s, val(s, k)))].join('\n')
    const hi = chart.highlight === k
    const label = above
      ? svg`<text x="0" y="${y + 13}" font-size="12.5" font-weight="${hi ? 600 : 400}" fill="var(--ink)">${name(k)}</text>`
      : svg`<text x="${m.left - 8}" y="${y + rowH / 2 + 4}" text-anchor="end" font-size="12.5" font-weight="${hi ? 600 : 400}" fill="var(--ink)">${name(k)}</text>`
    const bandTop = y + above
    const bandH = rowH - above
    let base = 0
    const marks = series.map((s, j) => {
      const p = val(s, k)
      if ((!p || p.y === null) && chart.missing?.[k])
        return svg`<text x="${x(0) + 4}" y="${(grouped ? bandTop + 4 + j * barH : bandTop + (bandH - barH) / 2) + barH - 3}" font-family="${FONT.mono}" font-size="10.5" fill="var(--slate)">${chart.missing[k]!.toUpperCase()}</text>`
      if (!p || p.y === null) return null
      const v = show(chart, p, s)
      if (chart.stacked) {
        const x0 = x(base)
        base += p.y
        const w = x(base) - x0
        const ink = textOn(s.color)
        return svg`<rect x="${x0}" y="${bandTop + 3}" width="${Math.max(0, w - 1)}" height="${bandH - 6}" fill="${colorVar(s.color)}"/>
${w > v.text.length * 7 + 8 ? svg`<text x="${x0 + 4}" y="${bandTop + bandH / 2 + 4}" font-size="11.5" fill="${ink}"${attr('data-alt', v.alt)}>${v.text}</text>` : null}`
      }
      const by = grouped ? bandTop + 4 + j * barH : bandTop + (bandH - barH) / 2
      const fill = colorVar(chart.colors?.[k] ?? (hi && series.length === 1 ? 's1' : s.color))
      const x0 = x(Math.min(0, p.y))
      const x1 = x(Math.max(0, p.y))
      return svg`<rect x="${x0}" y="${by}" width="${Math.max(1, x1 - x0)}" height="${barH - 1}" fill="${fill}"/>
<text x="${(p.y >= 0 ? x1 : x0) + (p.y >= 0 ? 5 : -5)}" y="${by + barH - 2}" text-anchor="${p.y >= 0 ? 'start' : 'end'}" font-size="${grouped ? 11 : 12}" fill="var(--ink)"${attr('data-alt', v.alt)}>${v.text}</text>`
    })
    return svg`<g class="row" data-tip="${tip}">${label}${marks}</g>`
  })
  return frame(width, H, chart.title, svg`${series.length > 1 ? legend(series) : null}${rows}${valueRefs(chart.refs, x, m.top - 4, H - m.bottom)}`)
}
