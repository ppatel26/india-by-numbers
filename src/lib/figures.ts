/** Headline figures: one value read from a chart's data, with its hallmark. */
import { placed } from '~/content'
import type { Figure, Status } from '~/content/types'
import { formatNumber, type Shown } from './format'
import { latest } from './data'
import { seriesOf, show, statesOf, pointAt, type SeriesData } from './charts/model'

const lastT = (s: SeriesData): number => latest(s.points)?.t ?? -Infinity

export interface FigureValue {
  value: Shown
  label: string
  period: string
  status: readonly Status[]
  office: string
  href: string
}

export function figureValue(f: Figure): FigureValue {
  const { chart } = placed(f.chart)
  const pt =
    chart.kind === 'states'
      ? statesOf(chart).india
      : (() => {
          const all = seriesOf(chart)
          // Default: the series that reaches the latest period (the current base, not the old
          // one); among those, India (ink) before its parts.
          const rank = (x: SeriesData) => lastT(x) + (x.color === 'ink' ? 1e-6 : 0)
          const s = f.series ? all.find((x) => x.key === f.series) : all.toSorted((a, b) => rank(b) - rank(a))[0]
          if (!s) throw new Error(`${f.chart}: no series ${f.series}`)
          return pointAt(s, f.x)
        })()
  if (!pt || pt.y === null) throw new Error(`${f.chart}: no value for the figure "${f.label}"`)
  return {
    value: f.format ? formatNumber(pt.y, f.format, pt.raw) : show(chart, pt),
    label: f.label,
    period: f.period ?? (chart.kind === 'states' ? chart.punches.period : pt.label),
    // A method break belongs to a series, not to one value.
    status: (chart.status ?? []).filter((x) => x !== 'Method break'),
    office: chart.punches.office,
    href: `/charts/${chart.slug}/`,
  }
}
