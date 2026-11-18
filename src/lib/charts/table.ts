/** Every chart's values as a table: the Table view and the CSV download. */
import { csvFormatRows } from 'd3-dsv'
import type { Chart } from '~/content/types'
import { select, toNumber, type Point } from '~/lib/data'
import { decimalsOf, fmt, formatNumber, type Shown } from '~/lib/format'
import { INDIA } from '~/lib/geography'
import { rowName } from './dots'
import { gapFormat, seriesOf, show, standing, statesOf, type Of } from './model'

export interface Cell {
  shown: Shown
  /** The value as published, for the CSV. Empty when there is none. */
  raw: string
}

export interface TableModel {
  columns: string[]
  rows: { key: string; head: string; cells: Cell[] }[]
}

const none: Cell = { shown: { text: 'No data' }, raw: '' }
const cell = (chart: Chart, p: Point | undefined): Cell => (p && p.y !== null ? { shown: show(chart, p), raw: p.raw } : none)

export function tableOf(chart: Chart): TableModel {
  switch (chart.kind) {
    case 'states':
      return statesTable(chart)
    case 'table':
      return plainTable(chart)
    case 'line':
    case 'columns':
    case 'area': {
      const series = seriesOf(chart)
      const xs = [...new Map(series.flatMap((s) => s.points).map((p) => [p.x, p])).values()].sort((a, b) => b.t - a.t)
      return {
        columns: ['Period', ...series.map((s) => s.label)],
        rows: xs.map((x) => ({ key: x.x, head: x.label, cells: series.map((s) => cell(chart, s.points.find((p) => p.x === x.x))) })),
      }
    }
    case 'dots':
    case 'bars':
    case 'pyramid': {
      const series = seriesOf(chart)
      const keys = [...new Set(series.flatMap((s) => s.points.map((p) => p.x)))]
      const label = chart.kind === 'bars' ? (k: string) => chart.labels?.[k] ?? rowName(k) : rowName
      return {
        columns: [chart.kind === 'pyramid' ? 'Age group' : chart.kind === 'dots' && (chart.by ?? 'geography') === 'geography' ? 'State or UT' : 'Category', ...series.map((s) => s.label)],
        rows: keys.map((k) => ({ key: k, head: label(k), cells: series.map((s) => cell(chart, s.points.find((p) => p.x === k))) })),
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
  return {
    columns: ['State or UT', chart.punches.unit, 'Gap from India', `Rank (of ${data.values.filter((v) => v.pt?.y != null).length})`],
    rows: rows.map((r) => {
      const has = r.pt && r.pt.y !== null
      const gap = has && india?.y != null && r.key !== INDIA ? +(r.pt!.y! - india.y).toFixed(d) : null
      const st = r.key === INDIA ? undefined : standing(data, r.key)
      const rank = st && { rank: chart.better === 'low' ? st.bottom : st.top }
      return {
        key: r.key,
        head: r.head,
        cells: [
          cell(chart, r.pt),
          gap === null ? { shown: { text: r.key === INDIA ? '' : 'No data' }, raw: '' } : { shown: { text: (gap > 0 ? '+' : '') + fmt(gap, gapFormat(chart.format, d)) }, raw: gap.toFixed(d) },
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
    columns: [chart.by === 'geography' ? 'State or UT' : chart.by, ...chart.columns.map((c) => c.label)],
    rows: keys.map((k) => ({
      key: k,
      head: rowName(k),
      cells: chart.columns.map((c) => {
        const r = picked.find((row) => row[chart.by] === k && Object.entries(c.where ?? {}).every(([col, v]) => (typeof v === 'string' ? row[col] === v : v.includes(row[col]!))))
        const raw = r?.[c.y ?? c.key]?.trim() ?? ''
        if (!raw) return none
        // Table columns may hold text, such as a party name.
        const shown = /^-?[\d,]*\.?\d+$/.test(raw) ? formatNumber(toNumber(raw)!, c.format ?? chart.format, raw) : { text: raw }
        return { shown, raw }
      }),
    })),
  }
}

/** The displayed data as CSV, with the source on every row. */
export function tableCsv(chart: Chart): string {
  const t = tableOf(chart)
  const src = chart.sources[0]
  const head = [...t.columns, 'unit', 'source', 'released']
  const lines = t.rows.map((r) => [r.head, ...r.cells.map((c) => c.raw), chart.punches.unit, src ? `${src.publisher}, ${src.release}` : '', src?.released ?? ''])
  return csvFormatRows([head, ...lines]) + '\n'
}
