/**
 * State pages: each measure row (state value, India, rank, strip) and each
 * topic's sentence, computed from the same chart data as the topic pages.
 */
import { placed } from '~/content'
import type { MeasureRow } from '~/content/pages/state-profile'
import type { TopicSlug } from '~/content/types'
import { select, type Point } from './data'
import { byState, show, standing, statesOf, type Of, type StateData } from './charts/model'
import { ordinal } from './format'
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

const names = (slugs: readonly string[]) => slugs.map((s) => place(s).name)

/** "Tamil Nadu" -> "Tamil Nadu's". */
const possessive = (name: string): string => (name.endsWith('s') ? `${name}'` : `${name}'s`)

/** "A", "A and B", "A, B, and C". */
const list = (items: readonly string[]): string =>
  items.length < 3 ? items.join(' and ') : `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`

/** States whose value is above (or below) this state's, nearest first. */
function beyond(r: Row, side: 'above' | 'below'): string[] {
  const y = r.value?.y
  if (y == null) return []
  return r.data.values
    .filter((v) => v.pt?.y != null && (side === 'above' ? v.pt.y > y : v.pt.y < y))
    .sort((a, b) => (side === 'above' ? b.pt!.y! - a.pt!.y! : a.pt!.y! - b.pt!.y!))
    .map((v) => v.place.slug)
}

const shown = (r: Row, p?: Point) => (p ? show(r.chart, p).text : '')

/** "the lowest", "second only to Kerala", or "3rd lowest", for a measure where low is good. */
function lowPhrase(r: Row): string {
  const below = beyond(r, 'below')
  if (below.length === 0) return 'the lowest'
  if (below.length === 1) return `second only to ${place(below[0]!).name}`
  return rankText(r.rank!).replace(/ of \d+$/, '')
}

/**
 * One sentence for a topic section, from its rows (in the order of the content
 * module), or undefined when the state has no value for the main measure.
 */
export function sentence(topic: TopicSlug, slug: string, rows: readonly Row[]): string | undefined {
  const state = place(slug).name
  const [a, b, c] = rows
  if (!a?.value) return undefined
  const v = shown(a, a.value)
  const india = shown(a, a.data.india)
  switch (topic) {
    case 'prices': {
      const higher = beyond(a, 'above')
      const pace = a.value.y! > (a.data.india?.y ?? 0) ? 'faster' : 'slower'
      const rest = higher.length === 1 ? ` Only ${names(higher)[0]} had a higher rate.` : higher.length && higher.length <= 3 ? ` Only ${list(names(higher))} had higher rates.` : ''
      return `Prices in ${state} rose by ${v} in the year to ${periodOf(a.chart)}, ${pace} than India's ${india}.${rest}`
    }
    case 'economy': {
      if (!a.rank) return undefined
      const top = `${ordinal(standing(a.data, slug)!.top)} highest of the ${a.rank.of} states and UTs with data`
      const growth = b?.value ? ` Its economy grew by ${shown(b, b.value)} in real terms, against ${shown(b, b.data.india)} for India on the same base.` : ''
      return `Income per person in ${state} was ${v} in ${periodOf(a.chart)}, ${top}.${growth}`
    }
    case 'population': {
      const lower = beyond(a, 'below')
      const lowerAt = new Set(lower.map((l) => a.data.values.find((x) => x.place.slug === l)!.pt!.raw))
      const level = a.data.values.filter((x) => x.place.slug !== slug && x.pt?.y === a.value!.y).map((x) => x.place.name)
      const was = (n: number) => (n > 1 ? 'were' : 'was')
      return (
        `In ${periodOf(a.chart)}, the fertility rate in ${state} was ${v} children per woman: the number a woman would have if that year's birth rates held through her life. The replacement level is 2.1; India's rate was ${india}.` +
        (lower.length > 0 && lower.length <= 2 && lowerAt.size === 1 ? ` Only ${list(names(lower))} ${was(lower.length)} lower, at ${[...lowerAt][0]}.` : '') +
        (level.length > 0 && level.length <= 3 ? ` ${list(level)} ${was(level.length)} level, at ${v}.` : '')
      )
    }
    case 'jobs':
      return `In ${periodOf(a.chart)}, ${v} of women in ${state} were working or looking for work (usual status, ages 15+), against ${india} across India.`
    case 'health': {
      if (!c?.value || !c.rank) return undefined
      const phrase = c.rank.dir === 'lowest' ? lowPhrase(c) : rankText(c.rank).replace(/ of \d+$/, '')
      return `${possessive(state)} maternal mortality ratio was ${shown(c, c.value)} deaths per 1,00,000 live births in ${periodOf(c.chart)}, ${phrase} among ${c.rank.of} bigger states. India's was ${shown(c, c.data.india)}.`
    }
    case 'education':
      if (!b?.value || !b.rank) return undefined
      return `${possessive(state)} college enrolment ratio was ${shown(b, b.value)} in ${periodOf(b.chart)}, ${rankText(b.rank)} states and UTs with data. India's was ${shown(b, b.data.india)}.`
    case 'elections':
      return `${v} of ${possessive(state)} electors voted in the 2024 Lok Sabha election, against ${india} across India.`
    case 'climate':
      if (!a.rank) return undefined
      return `${state} had ${v} MW of renewable power capacity on ${periodOf(a.chart)}, ${ordinal(standing(a.data, slug)!.top)} highest of the ${a.rank.of} states and UTs.`
    case 'religion-and-culture': {
      const tongue = rows.at(-1)
      if (!tongue?.value) return undefined
      const language = tongue.label.replace(tongue.spec.label, '').trim()
      return `In ${periodOf(tongue.chart)}, ${shown(tongue, tongue.value)} of people in ${state} gave ${language} as their mother tongue. Census 2011 is the latest count of religion and language; Census 2027 will update both.`
    }
  }
}
