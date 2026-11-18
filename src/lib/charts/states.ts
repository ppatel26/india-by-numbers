/** One value per state and UT: ranked bars with an India line, and the tile map. */
import { scaleLinear } from 'd3-scale'
import { decimalsOf, fmt } from '~/lib/format'
import { GRID, type Place } from '~/lib/geography'
import { attr, svg, type Markup } from '~/lib/markup'
import { colorVar, div, seq, textOn, type Token } from '~/lib/tokens'
import { FONT, WIDTH, frame, type Width } from './axes'
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
  return [`${p.name}: ${show(chart, pt).text}${pt.note ? ` (${pt.note})` : ''}`, gapText(chart, data, pt.y)].filter(Boolean).join('\n')
}

export function renderRanked(chart: Of<'states'>, width: Width): Markup {
  const data = statesOf(chart)
  const narrow = width === 'narrow'
  const W = WIDTH[width]
  const rows = ranked(data)
  const rowH = 20
  const m = { top: 30, right: 56, bottom: 8, left: narrow ? 118 : 200 }
  const H = m.top + rows.length * rowH + m.bottom
  const vals = rows.flatMap((r) => (r.pt?.y != null ? [r.pt.y] : []))
  const india = chart.total ? null : (data.india?.y ?? null)
  const x = scaleLinear()
    .domain([Math.min(0, ...vals), Math.max(...vals, india ?? 0)])
    .nice()
    .range([m.left, W - m.right])
  const ix = india === null ? null : x(india)

  const body = rows.map((r, i) => {
    const y = m.top + i * rowH
    const name = narrow ? (r.place.name.length > 16 ? r.place.short.replace('-', '') : r.place.name) : r.place.name
    const label = svg`<a href="${href(r.place)}"><text class="name" x="${m.left - 8}" y="${y + 14}" text-anchor="end" font-size="12.5" fill="var(--ink)">${name}</text></a>`
    if (!r.pt || r.pt.y === null)
      return svg`<g class="row" data-geo="${r.place.slug}" data-tip="${r.place.name}: No data">${label}<text x="${m.left}" y="${y + 14}" font-family="${FONT.mono}" font-size="10.5" fill="var(--slate)">NO DATA</text></g>`
    const v = show(chart, r.pt)
    const x0 = x(Math.min(0, r.pt.y))
    const x1 = x(Math.max(0, r.pt.y))
    const end = r.pt.y >= 0 ? x1 : x0
    const textW = v.text.length * 7 + 6
    // Keep value labels off the India line: inside the bar end, or past the line.
    const crosses = ix !== null && end < ix && end + textW > ix - 2
    const inside = crosses && end - m.left > textW + 4
    const lx = inside ? end - 4 : crosses ? ix! + 6 : end + 5
    return svg`<g class="row" data-geo="${r.place.slug}" data-tip="${stateTip(chart, data, r.place)}">${label}
<rect class="bar" x="${x0}" y="${y + 3}" width="${Math.max(1, x1 - x0)}" height="${rowH - 6}" fill="var(--other)"/>
<text class="value${inside ? ' inside' : ''}" x="${lx}" y="${y + 14}" text-anchor="${inside ? 'end' : 'start'}" font-size="12" fill="var(--ink)"${attr('data-alt', v.alt)}>${v.text}</text></g>`
  })

  const indiaLine =
    ix === null || !data.india
      ? null
      : svg`<line x1="${ix}" x2="${ix}" y1="${m.top - 6}" y2="${H - m.bottom}" stroke="var(--ink)" stroke-width="1.5"/>
<text x="${ix}" y="${m.top - 12}" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--ink)">India ${show(chart, data.india).text}</text>`

  return frame(width, H, chart.title, svg`<g class="rows">${body}</g>${indiaLine}`)
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
  const ramp = seq.slice(Math.max(0, seq.length - edges.length - 1))
  const v = (n: number) => fmt(n, { ...f, decimals: Math.max(d, decimalsOf(String(n))) })
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
  const size = narrow ? 40 : 64
  const gap = narrow ? 3 : 4
  const b = bins(chart, data)
  // Pattern ids must be unique on the page: a hidden view's pattern does not paint.
  const noData = `nodata-${chart.slug}-${width}`
  const tiles = data.values.map(({ place, pt }) => {
    const x = (place.col - 1) * (size + gap)
    const y = (place.row - 1) * (size + gap)
    const has = pt && pt.y !== null
    const token: Token | undefined = has ? binOf(b, pt.y!).token : undefined
    const ink = token ? textOn(token) : 'var(--ink)'
    const v = has ? show(chart, pt) : undefined
    const [l1, l2] = place.short.includes('-') ? place.short.split('-').map((s, i) => (i === 0 ? `${s}-` : s)) : [place.short]
    const name = narrow
      ? svg`<text x="${x + 4}" y="${y + 13}" font-size="10.5" font-weight="600" fill="${ink}">${place.code}</text>`
      : svg`<text x="${x + 5}" y="${y + 14}" font-size="11" font-weight="600" fill="${ink}">${l1}${l2 ? svg`<tspan x="${x + 5}" dy="12">${l2}</tspan>` : null}</text>`
    return svg`<a href="${href(place)}" class="tile" data-geo="${place.slug}" data-tip="${stateTip(chart, data, place)}">
<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="2" fill="${token ? colorVar(token) : `url(#${noData})`}"/>
${place.type === 'ut' ? svg`<path d="M${x + size - 9} ${y}h9v9z" fill="${ink}"/>` : null}${name}
<text x="${x + (narrow ? 4 : 5)}" y="${y + size - (narrow ? 6 : 8)}" font-size="${narrow ? 10.5 : 12}" fill="${ink}"${attr('data-alt', v?.alt)}>${v?.text ?? '–'}</text></a>`
  })
  const mapW = GRID.cols * (size + gap)
  const mapH = GRID.rows * (size + gap)
  const head = legendHeading(chart, data)
  const lx = narrow ? 0 : mapW + 40
  const ly = narrow ? mapH + 16 : 8
  const items = [...b.map((x) => ({ fill: colorVar(x.token), label: x.label })), { fill: `url(#${noData})`, label: 'No data' }]
  const legend = svg`<g class="legend" transform="translate(${lx},${ly})">
<text y="12" font-size="13" font-weight="600" fill="var(--ink)">${head.india}</text>
<text y="32" font-size="12" fill="var(--slate)">${head.sub}</text>
${items.map((it, i) => svg`<rect x="0" y="${46 + i * 24}" width="16" height="16" rx="2" fill="${it.fill}"/><text x="24" y="${58 + i * 24}" font-size="12" fill="var(--ink)">${it.label}</text>`)}
<path d="M0 ${54 + items.length * 24}h16v16h-16z" fill="var(--grid)"/><path d="M7 ${54 + items.length * 24}h9v9z" fill="var(--ink)"/>
<text x="24" y="${66 + items.length * 24}" font-size="12" fill="var(--ink)">Corner mark: union territory</text></g>`
  const H = narrow ? ly + 80 + items.length * 24 : Math.max(mapH, 100 + items.length * 24)
  const defs = svg`<defs><pattern id="${noData}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="var(--grid)"/><line x1="0" y1="0" x2="0" y2="6" stroke="var(--other)" stroke-width="2"/></pattern></defs>`
  return frame(width, H, `${chart.title}: map`, svg`${defs}<g class="tiles">${tiles}</g>${legend}`)
}

