/**
 * State pages: each measure row (state value, India, rank, strip) and each
 * topic's sentence, computed from the same chart data as the topic pages.
 */
import { placed } from '~/content'
import profile, { type MeasureRow } from '~/content/pages/state-profile'
import type { TopicSlug } from '~/content/types'
import { select, type Point } from './data'
import { byState, show, standing, statesOf, type Of, type StateData } from './charts/model'
import { place } from './geography'
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
  if (!spec.pick) return base
  const { where, ...rest } = spec.pick
  return { ...base, data: { ...base.data, ...rest, where: { ...base.data.where, ...where } } }
}

/** Rank from the nearer end: "3rd highest" or "5th lowest". Ties share a rank. */
export function rankIn(data: StateData, slug: string): Rank | undefined {
  const st = standing(data, slug)
  if (!st) return undefined
  return st.top <= st.bottom ? { n: st.top, of: st.of, dir: 'highest', joint: st.joint } : { n: st.bottom, of: st.of, dir: 'lowest', joint: st.joint }
}

export const rankText = (r: Rank): string => profile.rank({ rank: r.n, of: r.of, direction: r.dir, joint: r.joint })

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

const names = (slugs: readonly string[]) => slugs.map((s) => place(s).name)

/** States whose value is above (or below) this state's. */
function beyond(r: Row, side: 'above' | 'below'): string[] {
  const y = r.value?.y
  if (y == null) return []
  return r.data.values
    .filter((v) => v.pt?.y != null && (side === 'above' ? v.pt.y > y : v.pt.y < y))
    .sort((a, b) => (side === 'above' ? b.pt!.y! - a.pt!.y! : a.pt!.y! - b.pt!.y!))
    .map((v) => v.place.slug)
}

const text = (r: Row | undefined, p?: Point) => (r && p ? show(r.chart, p).text : '')

/** One sentence for a topic section, or undefined when the state has no value for its main measure. */
export function sentence(topic: TopicSlug, slug: string, rows: readonly Row[]): string | undefined {
  const state = place(slug).name
  const [a, b] = rows
  if (!a?.value) return undefined
  const s = profile.sentences
  const v = text(a, a.value)
  const india = text(a, a.data.india)
  switch (topic) {
    case 'prices': {
      const higher = beyond(a, 'above')
      return s.prices({ state, value: v, period: periodOf(a.chart), india, faster: a.value.y! > (a.data.india?.y ?? 0), higher: higher.length <= 3 ? names(higher) : [] })
    }
    case 'economy':
      if (!a.rank || !b?.value) return undefined
      return s.economy({ state, value: v, period: periodOf(a.chart), rank: standing(a.data, slug)!.top, of: a.rank.of, growth: text(b, b.value), indiaGrowth: text(b, b.data.india) })
    case 'population': {
      const lower = beyond(a, 'below')
      const lowerVals = new Set(lower.map((l) => a.data.values.find((x) => x.place.slug === l)!.pt!.raw))
      const level = a.data.values.filter((x) => x.place.slug !== slug && x.pt?.y === a.value!.y).map((x) => x.place.slug)
      return s.population({
        state,
        value: v,
        year: periodOf(a.chart),
        india,
        lower: lower.length > 0 && lower.length <= 2 && lowerVals.size === 1 ? { names: names(lower), value: [...lowerVals][0]! } : undefined,
        level: level.length > 0 && level.length <= 3 ? { names: names(level), value: v } : undefined,
      })
    }
    case 'jobs':
      return s.jobs({ year: periodOf(a.chart), value: v, state, india })
    case 'health': {
      const mmr = rows[2]
      if (!mmr?.value || !mmr.rank) return undefined
      const lowest = beyond(mmr, 'below')
      const phrase =
        mmr.rank.dir !== 'lowest' ? rankText(mmr.rank).replace(/ of \d+$/, '')
        : lowest.length === 0 ? 'the lowest'
        : lowest.length === 1 ? `second only to ${place(lowest[0]!).name}`
        : rankText(mmr.rank).replace(/ of \d+$/, '')
      return s.health({ state, value: text(mmr, mmr.value), period: periodOf(mmr.chart), rankPhrase: phrase, of: mmr.rank.of, india: text(mmr, mmr.data.india) })
    }
    case 'education': {
      if (!b?.value || !b.rank) return undefined
      return s.education({ state, value: text(b, b.value), period: periodOf(b.chart), rankPhrase: `${rankText(b.rank)} states and UTs with data`, india: text(b, b.data.india) })
    }
    case 'elections':
      return s.elections({ state, value: v, india })
    case 'climate':
      if (!a.rank) return undefined
      return s.climate({ state, value: v, date: periodOf(a.chart), rank: standing(a.data, slug)!.top, of: a.rank.of })
    case 'religion-and-culture': {
      const tongue = rows.at(-1)
      if (!tongue?.value) return undefined
      return s.religion({ year: periodOf(tongue.chart), value: text(tongue, tongue.value), state, language: tongue.label.replace(tongue.spec.label, '').trim() })
    }
  }
}

