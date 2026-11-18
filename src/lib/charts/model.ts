/** Resolve a chart spec into its data: series of points, or one value per state. */
import type { Chart, Color, Format, Series } from '~/content/types'
import { latest, points, type Point } from '~/lib/data'
import { INDIA, places, type Place } from '~/lib/geography'
import { formatNumber, type Shown } from '~/lib/format'

export interface SeriesData {
  key: string
  label: string
  color: Color
  dash?: boolean
  hidden?: boolean
  points: Point[]
}

export type Of<K extends Chart['kind']> = Extract<Chart, { kind: K }>

const categoryKinds = new Set<Chart['kind']>(['dots', 'bars', 'pyramid'])

function byColumn(chart: Chart): string | undefined {
  if (chart.kind === 'dots') return chart.by ?? 'geography'
  if (chart.kind === 'bars' || chart.kind === 'pyramid') return chart.by
  return undefined
}

const resolve = (chart: Chart, s: Series): SeriesData => {
  const category = categoryKinds.has(chart.kind)
  const x = s.x ?? byColumn(chart)
  return {
    key: s.key,
    label: s.label,
    color: s.color,
    dash: s.dash,
    hidden: s.hidden,
    points: points({ ...s, x }, category ? 'category' : 'time'),
  }
}

/** The series a chart draws: all but the hidden ones. */
export const drawn = (chart: Chart): SeriesData[] => seriesOf(chart).filter((s) => !s.hidden)

export function seriesOf(chart: Chart): SeriesData[] {
  switch (chart.kind) {
    case 'line':
    case 'columns':
    case 'area':
    case 'dots':
    case 'bars':
      return chart.series.map((s) => resolve(chart, s))
    case 'pyramid':
      return [resolve(chart, chart.left), resolve(chart, chart.right)]
    case 'states':
    case 'table':
      return []
  }
}

export interface StateValue {
  place: Place
  pt?: Point
}

export interface StateData {
  india?: Point
  values: StateValue[]
}

/**
 * One series of a by-state dots or bars chart as a 'states' chart: for its Map
 * tab, and for state pages. Default: the mapped series, else the sort series, else the last.
 */
export function asStates(chart: Of<'dots'> | Of<'bars'>, key?: string): Of<'states'> {
  const want = key ?? (chart.kind === 'dots' ? (chart.map?.series ?? chart.sortBy) : undefined) ?? chart.series.at(-1)?.key
  const s = chart.series.find((x) => x.key === want)
  if (!s) throw new Error(`${chart.slug}: no series ${want}`)
  const map = chart.kind === 'dots' ? chart.map : undefined
  return { ...chart, kind: 'states', data: { ...s, x: s.x ?? chart.by ?? 'geography' }, scale: map?.scale, better: map?.better, short: s.label }
}

/** Any chart with one value per state, as a 'states' chart; undefined for others. */
export function byState(chart: Chart, key?: string): Of<'states'> | undefined {
  if (chart.kind === 'states') return chart
  if ((chart.kind === 'dots' || chart.kind === 'bars') && (chart.by ?? 'geography') === 'geography') return asStates(chart, key)
  return undefined
}

export function statesOf(chart: Of<'states'>): StateData {
  const pts = points({ ...chart.data, x: chart.data.x ?? 'geography' }, 'category')
  const by = new Map(pts.map((p) => [p.x, p]))
  return {
    india: by.get(INDIA),
    values: places.map((place) => ({ place, pt: by.get(place.slug) })),
  }
}

/** States with a value, highest first; then those with none. */
export function ranked(data: StateData): StateValue[] {
  const has = data.values.filter((v) => v.pt?.y != null)
  const none = data.values.filter((v) => v.pt?.y == null)
  return [...has.sort((a, b) => b.pt!.y! - a.pt!.y!), ...none]
}

/** Where a state stands among those with data: its rank from the top and from the bottom. Equal values share a rank. */
export interface Standing {
  top: number
  bottom: number
  of: number
  joint: boolean
}

export function standing(data: StateData, slug: string): Standing | undefined {
  const ys = data.values.flatMap((v) => (v.pt?.y != null ? [v.pt.y] : []))
  const me = data.values.find((v) => v.place.slug === slug)?.pt?.y
  if (me == null) return undefined
  return {
    top: ys.filter((y) => y > me).length + 1,
    bottom: ys.filter((y) => y < me).length + 1,
    of: ys.length,
    joint: ys.filter((y) => y === me).length > 1,
  }
}

export const show = (chart: Chart, pt: Point): Shown => formatNumber(pt.y!, chart.format, pt.raw)

/** Format for a gap from India, in the chart's unit ('%' becomes percentage points). */
export const gapFormat = (f: Format | undefined, decimals: number): Format => ({
  ...f,
  unit: f?.unit === '%' ? '' : f?.unit,
  decimals,
  scale: 'none',
})

/** The value a headline figure or a state page shows: latest by default. */
export function pointAt(series: SeriesData, x?: string): Point | undefined {
  return x ? series.points.find((p) => p.x === x) : latest(series.points)
}
