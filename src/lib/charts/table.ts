/** Every chart's values as a table: the Table view and the CSV download. */
import { csvFormatRows } from 'd3-dsv'
import type { Chart } from '~/content/types'
import { select, toNumber, type Point } from '~/lib/data'
import { decimalsOf, fmt, formatNumber, type Shown } from '~/lib/format'
import { INDIA } from '~/lib/geography'
import { seq, type Token } from '~/lib/tokens'
import { rowName } from './dots'
import { exact, gapFormat, seriesOf, standing, statesOf, type Of, type SeriesData } from './model'

export interface Cell {
  shown: Shown
  /** The value as published, for the CSV. Empty when there is none. */
  raw: string
  /** Heat-table colour for this cell. */
  fill?: Token
}

export interface TableModel {
  columns: string[]
  rows: { key: string; head: string; cells: Cell[] }[]
}

const none: Cell = { shown: { text: 'No data' }, raw: '' }
const dash: Cell = { shown: { text: '–' }, raw: '' }

/** A table cell: every published digit, and the value's note when it has one. */
function cell(chart: Chart, p: Point | undefined, s?: SeriesData): Cell {
  if (!p || p.y === null) return none
  const v = exact(chart, p, s)
  return p.note ? { shown: { text: `${v.text} (${p.note})`, alt: v.alt && `${v.alt} (${p.note})` }, raw: p.raw } : { shown: v, raw: p.raw }
}

export function tableOf(chart: Chart): TableModel {
  switch (chart.kind) {
    case 'states':
      return statesTable(chart)
    case 'table':
      return plainTable(chart)
    case 'line':
    case 'columns':
    case 'area': {
      // One column per measure: series with the same panel and label (one measure on two
      // bases, or two survey designs) share a column, since their periods do not overlap.
      const series = seriesOf(chart)
      const panelOf = (key: string) => (chart.kind === 'line' ? chart.panels?.find((p) => p.series.includes(key))?.label : undefined)
      const groups = new Map<string, SeriesData[]>()
      for (const s of series) {
        const name = panelOf(s.key) ? `${panelOf(s.key)}: ${s.label}` : s.label
        groups.set(name, [...(groups.get(name) ?? []), s])
      }
      const xs = [...new Map(series.flatMap((s) => s.points).map((p) => [p.x, p])).values()].sort((a, b) => b.t - a.t)
      const at = (g: SeriesData[], x: string) => {
        const s = g.find((se) => se.points.some((p) => p.x === x && p.y !== null)) ?? g[0]!
        return cell(chart, s.points.find((p) => p.x === x), s)
      }
      return {
        columns: ['Period', ...groups.keys()],
        rows: xs.map((x) => ({ key: x.x, head: x.label, cells: [...groups.values()].map((g) => at(g, x.x)) })),
      }
    }
    case 'dots':
    case 'bars':
    case 'pyramid': {
      const series = seriesOf(chart)
      const bars = chart.kind === 'bars' ? chart : undefined
      // A bar chart's table follows the chart's own row order, including rows it marks as missing.
      const keys = bars?.order ? [...bars.order] : [...new Set(series.flatMap((s) => s.points.map((p) => p.x)))]
      const label = bars ? (k: string) => bars.labels?.[k] ?? rowName(k, false) : (k: string) => rowName(k, false)
      const head = bars?.rowHead ?? (chart.kind === 'pyramid' ? 'Age group' : chart.kind === 'dots' && (chart.by ?? 'geography') === 'geography' ? 'State or UT' : 'Category')
      return {
        columns: [head, ...series.map((s) => s.label)],
        // A category missing from a series (a party that did not stand) is a dash, not missing data;
        // a row the chart marks as missing carries its note.
        rows: keys.map((k) => ({
          key: k,
          head: label(k),
          cells: series.map((s) =>
            s.points.some((p) => p.x === k) ? cell(chart, s.points.find((p) => p.x === k), s) : bars?.missing?.[k] ? { shown: { text: bars.missing[k]! }, raw: '' } : dash,
          ),
        })),
      }
    }
  }
}

function statesTable(chart: Of<'states'>): TableModel {
  const data = statesOf(chart)
  const india = data.india
  const d = india ? Math.max(decimalsOf(india.raw), 1) : 1
  const rows = [
    ...(india ? [{ key: INDIA, head: 'India', pt: india }] : []),
    ...data.values.map((v) => ({ key: v.place.slug, head: v.place.name, pt: v.pt })),
  ]
  const gapCol = !chart.total
  const ciCol = rows.some((r) => r.pt?.interval)
  const interval = (p?: Point): Cell => (p?.interval ? { shown: { text: `${fmt(p.interval[0], chart.format)} to ${fmt(p.interval[1], chart.format)}` }, raw: p.interval.join(' to ') } : { shown: { text: '' }, raw: '' })
  return {
    columns: ['State or UT', chart.punches.unit, ...(ciCol ? ['95% interval'] : []), ...(gapCol ? ['Gap from India'] : []), `Rank (of ${data.values.filter((v) => v.pt?.y != null).length})`],
    rows: rows.map((r) => {
      const has = r.pt && r.pt.y !== null
      const gap = has && india?.y != null && r.key !== INDIA ? +(r.pt!.y! - india.y).toFixed(d) : null
      const st = r.key === INDIA ? undefined : standing(data, r.key)
      const rank = st && { rank: chart.better === 'low' ? st.bottom : st.top }
      return {
        key: r.key,
        head: r.head,
        cells: [
          r.pt?.y == null && chart.missing?.[r.key] ? { shown: { text: `No data: ${chart.missing[r.key]}` }, raw: '' } : cell(chart, r.pt),
          ...(ciCol ? [interval(r.pt)] : []),
          ...(!gapCol ? [] : [gap === null ? { shown: { text: r.key === INDIA ? '' : 'No data' }, raw: '' } : { shown: { text: (gap > 0 ? '+' : '') + fmt(gap, gapFormat(chart.format, d)) }, raw: gap.toFixed(d) }]),
          rank ? { shown: { text: String(rank.rank) }, raw: String(rank.rank) } : { shown: { text: '' }, raw: '' },
        ],
      }
    }),
  }
}

function plainTable(chart: Of<'table'>): TableModel {
  const picked = select(chart.data)
  const keys = [...new Set(picked.map((r) => r[chart.by]!))]
  return {
    columns: [chart.rowHead ?? (chart.by === 'geography' ? 'State or UT' : chart.by), ...chart.columns.map((c) => c.label)],
    rows: keys.map((k) => ({
      key: k,
      // The one very long UT name uses its short form, so the row does not wrap to four lines.
      head: rowName(k),
      cells: chart.columns.map((c) => {
        const r = picked.find((row) => row[chart.by] === k && Object.entries(c.where ?? {}).every(([col, v]) => (typeof v === 'string' ? row[col] === v : v.includes(row[col]!))))
        const raw = r?.[c.y ?? c.key]?.trim() ?? ''
        if (!raw) return none
        // Table columns may hold text, such as a party name.
        const n = /^-?[\d,]*\.?\d+$/.test(raw) ? toNumber(raw)! : null
        const shown = n === null ? { text: c.text?.[raw] ?? raw } : formatNumber(n, c.format ?? chart.format, raw)
        return { shown, raw, fill: n === null || !chart.bins ? undefined : heat(chart.bins, n) }
      }),
    })),
  }
}

/** The ramp colour for a value, given bin edges low to high. */
export const heat = (edges: readonly number[], v: number): Token => {
  const i = edges.filter((e) => v >= e).length
  return seq[Math.round((i * (seq.length - 1)) / edges.length)]!
}

/** One row per published value: who or what, when, the value as published, its unit, status and note. */
function observations(chart: Chart): { entity: string; series: string; pt: Point; y?: string; x?: string }[] {
  if (chart.kind === 'states') {
    const d = statesOf(chart)
    return [...(d.india ? [{ entity: 'India', series: chart.short, pt: d.india }] : []), ...d.values.flatMap((v) => (v.pt ? [{ entity: v.place.name, series: chart.short, pt: v.pt }] : []))]
  }
  const name = chart.kind === 'bars' ? (k: string) => chart.labels?.[k] ?? rowName(k) : rowName
  // Over time, the row's place names the entity; by category, the category does.
  const time = chart.kind === 'line' || chart.kind === 'columns' || chart.kind === 'area'
  const entity = (pt: Point) => (time ? rowName(pt.row.geography ?? 'india') : name(pt.x))
  // A panel names the measure: "Enrolment: Primary, 1-5", as in the Table view.
  const panels = 'panels' in chart ? (chart.panels ?? []) : []
  const label = (s: SeriesData) => {
    const panel = panels.find((p) => p.series.includes(s.key))?.label
    return panel && panel !== s.label ? `${panel}: ${s.label}` : s.label
  }
  const defs = chart.kind === 'pyramid' ? [chart.left, chart.right] : 'series' in chart ? chart.series : []
  const def = (key: string) => defs.find((d) => d.key === key)
  const obs = seriesOf(chart).flatMap((s) => s.points.map((pt) => ({ entity: entity(pt), series: label(s), pt, y: def(s.key)?.y, x: def(s.key)?.x })))
  // Rows that still share entity, series and period (a season, an area, or the parts of a summed
  // series) are told apart by the text columns that differ between them.
  const key = (o: (typeof obs)[number]) => `${o.entity}|${o.series}|${o.pt.row.period ?? o.pt.label}`
  const groups = Map.groupBy(obs, key)
  return obs.map((o) => {
    const same = groups.get(key(o))!
    if (same.length < 2) return o
    const differ = Object.keys(o.pt.row).filter((c) => c !== 'note' && !/^-?[\d,.]*$/.test(o.pt.row[c] ?? '') && new Set(same.map((x) => x.pt.row[c])).size > 1)
    // The series' own category column says it best (season_name, not season and season_name).
    const cols = o.x && differ.includes(o.x) ? [o.x] : differ
    return cols.length ? { ...o, series: `${o.series}: ${cols.map((c) => o.pt.row[c]).join(', ')}` } : o
  })
}

/** A series that plots a column other than `value` (a share beside a count) takes the chart's unit, not the row's. */
const unitOf = (chart: Chart, pt: Point, s?: { y?: string }): string => (s?.y && s.y !== 'value' ? chart.punches.unit : (pt.row.unit ?? chart.punches.unit))

const SOURCE_COLUMNS = ['period', 'value', 'unit', 'status', 'note', 'sources'] as const

/** The chart's data as CSV: one row per value, with its own period, unit and status, and the chart's sources. */
export function tableCsv(chart: Chart): string {
  const sources = chart.sources.map((s) => `${s.publisher}, ${s.release}, ${s.released}`).join('; ')
  if (chart.kind === 'table') {
    const t = tableOf(chart)
    return csvFormatRows([[...t.columns, 'sources'], ...t.rows.map((r) => [r.head, ...r.cells.map((c) => c.raw), sources])]) + '\n'
  }
  const lines = observations(chart).map(({ entity, series, pt, y }) => [
    entity,
    series,
    pt.row.period ?? pt.label,
    pt.raw,
    unitOf(chart, pt, { y }),
    pt.row.status ?? pt.row.estimate ?? '',
    pt.note ?? '',
    sources,
  ])
  return csvFormatRows([['entity', 'series', ...SOURCE_COLUMNS], ...lines]) + '\n'
}
