import { scaleLinear } from 'd3-scale'
import { svg, attr, type Markup } from '~/lib/markup'
import { fillVar, textOn } from '~/lib/tokens'
import { FONT, REF_ROW, WIDTH, frame, refRows, valueRefs, type Gap, type Width } from './axes'
import { KEY_ROW, legend, legendRows, rowName } from './dots'
import { drawn, show, tipLine, type Of, type SeriesData } from './model'

/** Horizontal bars by category: one series, grouped series, or stacked to a total. */
export function renderBars(chart: Of<'bars'>, width: Width): Markup {
  const series = drawn(chart)
  const narrow = width !== 'wide'
  const W = WIDTH[width]
  const val = (s: SeriesData, k: string) => s.points.find((p) => p.x === k)
  const keys = chart.order
    ? [...chart.order]
    : [...new Set(series.flatMap((s) => s.points.map((p) => p.x)))].sort(
        (a, b) => (val(series[0]!, b)?.y ?? -Infinity) - (val(series[0]!, a)?.y ?? -Infinity),
      )
  const name = (k: string) => chart.labels?.[k] ?? rowName(k)
  const grouped = !chart.stacked && series.length > 1
  // Paired bars get a 2 px gap, so their value labels never touch.
  const barH = grouped ? 13 : 14
  // On phones the category name sits above its bars, so long names never clip.
  const above = narrow ? 18 : 0
  const rowH = (grouped ? series.length * barH + 10 : 22) + above
  const labelW = narrow ? 0 : Math.min(260, 16 + Math.max(...keys.map((k) => name(k).length)) * 7)
  const total = (k: string) => series.reduce((a, s) => a + (val(s, k)?.y ?? 0), 0)
  const ys = series.flatMap((s) => s.points.flatMap((p) => (p.y === null ? [] : [p.y])))
  const max = chart.axis?.max ?? (chart.stacked ? Math.max(...keys.map(total)) : Math.max(...ys))
  const min = chart.axis?.min ?? (chart.stacked ? 0 : Math.min(0, ...ys))
  // A negative bar's value label hangs left of the bar: leave room for the longest one.
  const negRoom = Math.max(
    0,
    ...series.flatMap((s) => s.points.filter((p) => p.y !== null && p.y < 0).map((p) => show(chart, p, s).text.length * 6.6 + 8)),
  )
  // A stack fills to 100 and carries its values inside, so it needs no room at the right.
  const m = { top: 0, right: chart.stacked ? 4 : narrow ? 52 : 64, bottom: 8, left: labelW + negRoom }
  const x = scaleLinear().domain([min, max]).nice().range([m.left, W - m.right])
  // The key wraps to the width; reference labels sit in a band above the bars, never over them.
  const keyRows = series.length > 1 ? legendRows(series, W) : 0
  const refBand = chart.refs?.length ? 18 + (refRows(chart.refs, x) - 1) * REF_ROW : 0
  m.top = (keyRows ? 32 + (keyRows - 1) * KEY_ROW : 8) + refBand
  const H = m.top + keys.length * rowH + m.bottom
  // On phones each name sits on its own line above its bars: lines across the plot skip it.
  const nameGaps: Gap[] = above ? keys.map((_, i): Gap => [m.top + i * rowH, m.top + i * rowH + above]) : []
  // Reference lines also break around value labels they would cross ("45.0%" by a majority line).
  const labelGaps: Gap[] = []

  const rows = keys.map((k, i) => {
    const y = m.top + i * rowH
    const tip = [chart.labels?.[k] ?? rowName(k, false), ...series.map((s) => tipLine(chart, s, val(s, k)))].join('\n')
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
        return svg`<rect x="${x0}" y="${bandTop + 3}" width="${Math.max(0, w - 1)}" height="${bandH - 6}" fill="${fillVar(s.color)}"/>
${w > v.text.length * 7 + 8 ? svg`<text x="${x0 + 4}" y="${bandTop + bandH / 2 + 4}" font-size="11.5" fill="${ink}"${attr('data-alt', v.alt)}>${v.text}</text>` : null}`
      }
      const by = grouped ? bandTop + 4 + j * barH : bandTop + (bandH - barH) / 2
      const fill = fillVar(chart.colors?.[k] ?? (hi && series.length === 1 ? 's1' : s.color))
      const x0 = x(Math.min(0, p.y))
      const x1 = x(Math.max(0, p.y))
      const tw = v.text.length * (grouped ? 6.2 : 6.8)
      labelGaps.push(p.y >= 0 ? [by - 1, by + barH, x1 + 5, x1 + 5 + tw] : [by - 1, by + barH, x0 - 5 - tw, x0 - 5])
      return svg`<rect x="${x0}" y="${by}" width="${Math.max(1, x1 - x0)}" height="${barH - 3}" fill="${fill}"/>
<text x="${(p.y >= 0 ? x1 : x0) + (p.y >= 0 ? 5 : -5)}" y="${by + (barH - 3) / 2 + 4}" text-anchor="${p.y >= 0 ? 'start' : 'end'}" font-size="${grouped ? 11 : 12}" fill="var(--ink)" paint-order="stroke" stroke="var(--paper)" stroke-width="3"${attr('data-alt', v.alt)}>${v.text}</text>`
    })
    return svg`<g class="row" data-tip="${tip}">${label}${marks}</g>`
  })
  // Negative values hang from a zero line.
  const zero =
    min < 0
      ? svg`<path d="${keys.map((_, i) => `M${x(0)} ${m.top + i * rowH + above}V${m.top + (i + 1) * rowH}`).join('')}" stroke="var(--ink)" fill="none"/>`
      : null
  return frame(width, H, chart.title, svg`${keyRows ? legend(series, [], 12, W) : null}${valueRefs(chart.refs, x, m.top - 4, H - m.bottom, [...nameGaps, ...labelGaps])}${zero}${rows}`)
}
