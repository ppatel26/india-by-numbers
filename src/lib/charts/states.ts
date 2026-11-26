/** One value per state and UT: ranked bars with an India line, and the tile map. */
import { scaleLinear } from 'd3-scale'
import { decimalsOf, fmt } from '~/lib/format'
import { GRID, type Place } from '~/lib/geography'
import { attr, svg, type Markup } from '~/lib/markup'
import { colorVar, div, seq, textOn, type Token } from '~/lib/tokens'
import { WIDTH, frame, tipAttr, type Width } from './axes'
import { nameColumn, rowName } from './dots'
import { gapFormat, ranked, show, statesOf, type Of, type StateData } from './model'

const href = (p: Place) => `/states/${p.slug}/`

/** "1.20 points above India (6.09%)" */
function gapText(chart: Of<'states'>, data: StateData, y: number): string {
  const india = data.india
  if (!india || india.y === null || chart.total) return ''
  const d = Math.max(decimalsOf(india.raw), 1)
  const gap = +(y - india.y).toFixed(d)
  if (gap === 0) return `Same as India (${show(chart, india).text})`
  const unit = chart.format?.unit === '%' ? 'points' : ''
  return `${fmt(Math.abs(gap), gapFormat(chart.format, d))}${unit ? ` ${unit}` : ''} ${gap > 0 ? 'above' : 'below'} India (${show(chart, india).text})`
}

export function stateTip(chart: Of<'states'>, data: StateData, p: Place): string {
  const pt = data.values.find((v) => v.place.slug === p.slug)?.pt
  if (!pt || pt.y === null) return `${p.name}: No data${chart.missing?.[p.slug] ? `. ${chart.missing[p.slug]}` : ''}`
  const ci = pt.interval ? `95% interval ${fmt(pt.interval[0], chart.format)} to ${fmt(pt.interval[1], chart.format)}` : ''
  return [`${p.name}: ${show(chart, pt).text}${pt.note ? ` (${pt.note})` : ''}`, ci, gapText(chart, data, pt.y)].filter(Boolean).join('\n')
}

export function renderRanked(chart: Of<'states'>, width: Width): Markup {
  const data = statesOf(chart)
  const narrow = width === 'narrow'
  const W = WIDTH[width]
  // States with no value go in one line under the bars, not in a stack of empty rows.
  const rows = ranked(data).filter((r) => r.pt?.y != null)
  const missing = ranked(data).filter((r) => r.pt?.y == null).map((r) => rowName(r.place.slug))
  const shortName = (p: Place) => (narrow && p.name.length > 16 ? p.short.replace('-', '') : rowName(p.slug))
  const rowH = 20
  // Room at the right for the longest value label ("₹6.46 lakh"), past the longest bar.
  const longest = Math.max(...rows.map((r) => show(chart, r.pt!).text.length))
  const m = { top: 30, right: Math.max(56, longest * 6.8 + 10), bottom: 8, left: nameColumn(rows.map((r) => shortName(r.place)), narrow) }
  // The no-data line wraps at the plot width.
  const perLine = Math.floor((W - 8) / 6.4)
  const missLines: string[] = []
  for (const word of missing.length ? `No data: ${missing.join(', ')}.`.split(' ') : []) {
    const last = missLines.at(-1)
    if (last !== undefined && last.length + word.length + 1 <= perLine) missLines[missLines.length - 1] = `${last} ${word}`
    else missLines.push(word)
  }
  const rowsH = m.top + rows.length * rowH
  const H = rowsH + (missLines.length ? 12 + missLines.length * 17 : 0) + m.bottom
  const vals = rows.flatMap((r) => (r.pt?.y != null ? [r.pt.y] : []))
  const india = chart.total ? null : (data.india?.y ?? null)
  const x = scaleLinear()
    .domain([Math.min(0, ...vals), Math.max(...vals, ...rows.flatMap((r) => r.pt?.interval ?? []), india ?? 0)])
    .nice()
    .range([m.left, W - m.right])
  const ix = india === null ? null : x(india)

  // Each value label's box, so the India line can stop short of it.
  const boxes: [number, number, number, number][] = []
  const body = rows.map((r, i) => {
    const y = m.top + i * rowH
    const label = svg`<a href="${href(r.place)}"><text class="name" x="${m.left - 8}" y="${y + 14}" text-anchor="end" font-size="12.5" fill="var(--ink)">${shortName(r.place)}</text></a>`
    const pt = r.pt!
    const v = show(chart, pt)
    const x0 = x(Math.min(0, pt.y!))
    const x1 = x(Math.max(0, pt.y!))
    const ci = pt.interval
    // The value belongs to the bar end, or past the whisker when the bar has a confidence
    // interval, so the whisker never runs through it.
    const barEnd = pt.y! >= 0 ? x1 : x0
    const lx = ci ? Math.max(barEnd, x(ci[1])) + 5 : barEnd + 5
    boxes.push([lx - 3, lx + v.text.length * 7 + 3, y + 2, y + rowH - 2])
    const whisker = ci
      ? svg`<path d="M${x(ci[0])} ${y + rowH / 2}H${x(ci[1])}M${x(ci[0])} ${y + 7}V${y + rowH - 7}M${x(ci[1])} ${y + 7}V${y + rowH - 7}" stroke="var(--slate)" fill="none"/>`
      : null
    return svg`<g class="row" data-geo="${r.place.slug}" ${tipAttr(() => stateTip(chart, data, r.place))}>${label}
<rect class="bar" x="${x0}" y="${y + 3}" width="${Math.max(1, x1 - x0)}" height="${rowH - 6}" fill="var(--other)"/>${whisker}
<text class="value" x="${lx}" y="${y + 14}" paint-order="stroke" stroke="var(--paper)" stroke-width="4" font-size="12" fill="var(--ink)"${attr('data-alt', v.alt)}>${v.text}</text></g>`
  })

  // The India line runs the full height but breaks around any value label it would cross.
  let indiaPath = ''
  if (ix !== null) {
    let y0 = m.top - 6
    for (const [l, r, t, b] of boxes) {
      if (ix < l || ix > r) continue
      if (t > y0) indiaPath += `M${ix} ${y0}V${t}`
      y0 = b
    }
    if (rowsH > y0) indiaPath += `M${ix} ${y0}V${rowsH}`
  }
  const indiaLine =
    ix === null || !data.india
      ? null
      : svg`<path d="${indiaPath}" stroke="var(--ink)" stroke-width="1.5" fill="none"/>
<text x="${ix}" y="${m.top - 12}" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">India ${show(chart, data.india).text}</text>`

  const missNote = missLines.map((l, i) => svg`<text x="0" y="${rowsH + 22 + i * 17}" font-size="12" fill="var(--slate)">${l}</text>`)
  return frame(width, H, chart.title, svg`${indiaLine}<g class="rows">${body}</g>${missNote}`)
}

export interface Bin {
  token: Token
  label: string
  test: (y: number) => boolean
}

const niceStep = (v: number): number => {
  const p = 10 ** Math.floor(Math.log10(v))
  const f = v / p
  return (f >= 5 ? 5 : f >= 2.5 ? 2.5 : f >= 2 ? 2 : 1) * p
}

/** Map bins: equal steps of size (seq) or of the gap from India (div). */
export function bins(chart: Of<'states'>, data: StateData): Bin[] {
  const vals = data.values.flatMap((v) => (v.pt?.y != null ? [v.pt.y] : []))
  const f = chart.format
  const d = Math.max(...data.values.map((v) => (v.pt ? decimalsOf(v.pt.raw) : 0)), 0)
  const india = data.india?.y
  if (chart.scale === 'div' && india != null) {
    const a = niceStep(Math.max(...vals.map((v) => Math.abs(v - india))) / 4)
    const t = [a, 2 * a, 4 * a]
    const g = (n: number) => fmt(n, gapFormat(f, decimalsOf(String(a))))
    const v = (n: number) => fmt(n, { ...f, decimals: d })
    const up = chart.better === 'high' ? ([...div].reverse() as Token[]) : ([...div] as Token[])
    const step = 1 / 10 ** d
    return [
      { token: up[6]!, label: `More than ${g(t[2]!)} above (over ${v(india + t[2]!)})`, test: (y) => y - india > t[2]! },
      { token: up[5]!, label: `${g(t[1]!)} to ${g(t[2]!)} above (${v(india + t[1]! + step)} to ${v(india + t[2]!)})`, test: (y) => y - india > t[1]! },
      { token: up[4]!, label: `${g(t[0]!)} to ${g(t[1]!)} above (${v(india + t[0]! + step)} to ${v(india + t[1]!)})`, test: (y) => y - india > t[0]! },
      { token: up[3]!, label: `Within ${g(t[0]!)} of India (${v(india - t[0]!)} to ${v(india + t[0]!)})`, test: (y) => y - india >= -t[0]! },
      { token: up[2]!, label: `${g(t[0]!)} to ${g(t[1]!)} below (${v(india - t[1]!)} to ${v(india - t[0]! - step)})`, test: (y) => y - india >= -t[1]! },
      { token: up[1]!, label: `${g(t[1]!)} to ${g(t[2]!)} below (${v(india - t[2]!)} to ${v(india - t[1]! - step)})`, test: (y) => y - india >= -t[2]! },
      { token: up[0]!, label: `More than ${g(t[2]!)} below (under ${v(india - t[2]!)})`, test: () => true },
    ]
  }
  // At most six bins, one ramp colour each.
  const auto = (n: number): number[] => {
    const e = scaleLinear().domain([Math.min(...vals), Math.max(...vals)]).nice(n).ticks(n).slice(1, -1)
    return e.length + 1 > seq.length && n > 2 ? auto(n - 1) : e
  }
  const edges = chart.bins ? [...chart.bins] : auto(6)
  // Spread the bins over the whole ramp (lightest to darkest), so neighbouring bins read apart.
  const n = edges.length + 1
  const ramp = Array.from({ length: Math.min(n, seq.length) }, (_, i) => seq[n === 1 ? seq.length - 1 : Math.round((i * (seq.length - 1)) / (Math.min(n, seq.length) - 1))]!)
  // Bin edges are round numbers: print them as such (30,000, not 30,000.00).
  const v = (n: number) => fmt(n, { ...f, decimals: decimalsOf(String(n)) })
  return [...edges, Infinity]
    .map((hi, i) => {
      const lo = i === 0 ? -Infinity : edges[i - 1]!
      const label = i === 0 ? `Under ${v(hi)}` : hi === Infinity ? `${v(lo)} and over` : `${v(lo)} to under ${v(hi)}`
      return { token: ramp[Math.min(i, ramp.length - 1)]!, label, test: (y: number) => y >= lo && y < hi }
    })
    .reverse()
}

export const binOf = (b: Bin[], y: number): Bin => b.find((x) => x.test(y)) ?? b.at(-1)!

export function legendHeading(chart: Of<'states'>, data: StateData): { india: string; sub: string } {
  const india = data.india ? `${chart.total ? 'India total' : 'India'}: ${show(chart, data.india).text}` : ''
  const sub =
    chart.scale === 'div' && !chart.total
      ? `${chart.short}: gap from India${chart.format?.unit === '%' ? ', percentage points' : ''}`
      : `${chart.short}, ${chart.punches.unit}`
  return { india, sub }
}

/** The tile grid. Each tile links to its state page. */
export function renderTiles(chart: Of<'states'>, width: Width): Markup {
  const data = statesOf(chart)
  const narrow = width === 'narrow'
  const gap = narrow ? 3 : 4
  // The grid takes the width the legend leaves (legend 270 px, 40 px between). Tiles are square
  // up to the chart width; wider pages make them wider, not taller.
  const size = narrow ? 40 : Math.floor((WIDTH.wide - 270 - 40) / GRID.cols) - gap
  const tileW = narrow ? size : Math.floor((WIDTH[width] - 270 - 40) / GRID.cols) - gap
  const b = bins(chart, data)
  // Pattern ids must be unique on the page: a hidden view's pattern does not paint.
  const noData = `nodata-${chart.slug}-${width}`
  const tiles = data.values.map(({ place, pt }) => {
    const x = (place.col - 1) * (tileW + gap)
    const y = (place.row - 1) * (size + gap)
    const has = pt && pt.y !== null
    const token: Token | undefined = has ? binOf(b, pt.y!).token : undefined
    const ink = token ? textOn(token) : 'var(--ink)'
    const v = has ? show(chart, pt) : undefined
    // A long value (₹2,16,590) shrinks to fit its tile rather than running into the next one.
    const vSize = Math.min(narrow ? 10.5 : 12, ((tileW - 9) / Math.max(1, (v?.text.length ?? 1) * 0.58)))
    const [l1, l2] = place.short.includes('-') ? place.short.split('-').map((s, i) => (i === 0 ? `${s}-` : s)) : [place.short]
    const name = narrow
      ? svg`<text x="${x + 4}" y="${y + 13}" font-size="10.5" font-weight="600" fill="${ink}">${place.code}</text>`
      : svg`<text x="${x + 5}" y="${y + 14}" font-size="11" font-weight="600" fill="${ink}">${l1}${l2 ? svg`<tspan x="${x + 5}" dy="12">${l2}</tspan>` : null}</text>`
    return svg`<a href="${href(place)}" class="tile" data-geo="${place.slug}" ${tipAttr(() => stateTip(chart, data, place))}>
<rect x="${x}" y="${y}" width="${tileW}" height="${size}" rx="2" fill="${token ? colorVar(token) : `url(#${noData})`}"/>
${place.type === 'ut' ? svg`<path d="M${x + tileW - 10} ${y}h10v10z" fill="var(--paper)"/>` : null}${name}
<text x="${x + (narrow ? 4 : 5)}" y="${y + size - (narrow ? 6 : 8)}" font-size="${vSize.toFixed(1)}" fill="${ink}"${attr('data-alt', v?.alt)}>${v?.text ?? '–'}</text></a>`
  })
  const mapW = GRID.cols * (tileW + gap)
  const mapH = GRID.rows * (size + gap)
  const head = legendHeading(chart, data)
  const lx = narrow ? 0 : mapW + 40
  const ly = narrow ? mapH + 16 : 8
  const anyMissing = data.values.some((v) => !v.pt || v.pt.y === null)
  const items = [...b.map((x) => ({ fill: colorVar(x.token), label: x.label })), ...(anyMissing ? [{ fill: `url(#${noData})`, label: 'No data' }] : [])]
  const legend = svg`<g class="legend" transform="translate(${lx},${ly})">
<text y="12" font-size="13" font-weight="600" fill="var(--ink)">${head.india}</text>
<text y="32" font-size="12" fill="var(--slate)">${head.sub}</text>
${items.map((it, i) => svg`<rect x="0" y="${46 + i * 24}" width="16" height="16" rx="2" fill="${it.fill}"/><text x="24" y="${58 + i * 24}" font-size="12" fill="var(--ink)">${it.label}</text>`)}
<path d="M0 ${54 + items.length * 24}h16v16h-16z" fill="var(--slate)"/><path d="M8 ${54 + items.length * 24}h8v8z" fill="var(--paper)"/>
<text x="24" y="${66 + items.length * 24}" font-size="12" fill="var(--ink)">Corner mark: union territory</text></g>`
  const H = narrow ? ly + 80 + items.length * 24 : Math.max(mapH, 100 + items.length * 24)
  const defs = svg`<defs><pattern id="${noData}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="var(--grid)"/><line x1="0" y1="0" x2="0" y2="6" stroke="var(--other)" stroke-width="2"/></pattern></defs>`
  return frame(width, H, `${chart.title}: map`, svg`${defs}<g class="tiles">${tiles}</g>${legend}`)
}

