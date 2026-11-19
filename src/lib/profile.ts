/**
 * State pages: each measure row (state value, India, rank, strip), computed from
 * the same chart data as the topic pages.
 */
import { placed } from '~/content'
import type { MeasureRow } from '~/content/pages/state-profile'
import { select, type Point } from './data'
import { byState, show, standing, statesOf, type Of, type StateData } from './charts/model'
import { ordinal } from './format'
import { formatDate, longPeriod } from './period'

export interface Rank {
  n: number
  of: number
  dir: 'highest' | 'lowest'
  joint: boolean
}

export interface Row {
  spec: MeasureRow
  chart: Of<'states'>
  data: StateData
  label: string
  value?: Point
  rank?: Rank
}

/** The chart a row reads: the by-state chart, its series, and the row's own changes. */
export function measureChart(spec: MeasureRow): Of<'states'> {
  const c = placed(spec.chart).chart
  // A table holds several rows per state; the row's pick narrows it to one.
  const base = c.kind === 'table' ? ({ ...c, kind: 'states', data: { ...c.data, x: 'geography' }, short: spec.label } as const) : byState(c, spec.series)
  if (!base) throw new Error(`${spec.chart} has no value per state`)
  const format = spec.format ?? base.format
  if (!spec.pick) return { ...base, format }
  const { where, ...rest } = spec.pick
  return { ...base, format, data: { ...base.data, ...rest, where: { ...base.data.where, ...where } } }
}

/** Rank from the nearer end: "3rd highest" or "5th lowest". Ties share a rank. */
export function rankIn(data: StateData, slug: string): Rank | undefined {
  const st = standing(data, slug)
  if (!st) return undefined
  return st.top <= st.bottom ? { n: st.top, of: st.of, dir: 'highest', joint: st.joint } : { n: st.bottom, of: st.of, dir: 'lowest', joint: st.joint }
}

/** "19th highest of 36", "Joint 2nd lowest of 22". */
export const rankText = (r: Rank): string => `${r.joint ? 'Joint ' : ''}${ordinal(r.n)} ${r.dir} of ${r.of}`

/** The page's opening sentence, from infant mortality. */
export function standfirst(r: Row | undefined, state: string): string | undefined {
  if (!r?.value || !r.data.india) return undefined
  return `In ${periodOf(r.chart)}, ${shown(r, r.value)} in every 1,000 babies born in ${state} died before their first birthday, against ${shown(r, r.data.india)} across India.`
}

export function row(spec: MeasureRow, slug: string): Row {
  const chart = measureChart(spec)
  const data = statesOf(chart)
  const value = data.values.find((v) => v.place.slug === slug)?.pt
  const extra = spec.labelFrom ? select(chart.data).find((r) => r[chart.data.x ?? 'geography'] === slug)?.[spec.labelFrom] : undefined
  return {
    spec,
    chart,
    data,
    label: extra ? `${spec.label} ${extra}` : spec.label,
    value: value?.y != null ? value : undefined,
    rank: spec.noRank ? undefined : rankIn(data, slug),
  }
}

/** The period of a chart's rows, in words: "October 2026", "2024", "31 October 2026". */
export function periodOf(chart: Of<'states'>): string {
  const p = select(chart.data)[0]?.period
  if (!p) return chart.punches.period
  return /^\d{4}-\d{2}-\d{2}$/.test(p) ? formatDate(p, 'long') : longPeriod(p)
}

const shown = (r: Row, p?: Point) => (p ? show(r.chart, p).text : '')


