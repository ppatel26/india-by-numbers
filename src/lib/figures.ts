/** Headline figures: one value read from a chart's data, with its hallmark. */
import { placed } from '~/content'
import type { Figure, Status } from '~/content/types'
import { formatNumber, type Shown } from './format'
import { latest } from './data'
import { parsePeriod } from './period'
import { seriesOf, show, statesOf, pointAt, type SeriesData } from './charts/model'

/** "2026-10" -> "Oct 2026"; spans and years stay as published. */
function rowPeriod(p: string | undefined): string | undefined {
  if (!p) return undefined
  try {
    return parsePeriod(p).label
  } catch {
    return p
  }
}

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
  const { pt, s } =
    chart.kind === 'states'
      ? { pt: statesOf(chart).india, s: undefined }
      : (() => {
          const all = seriesOf(chart)
          // Default: the series that reaches the latest period (the current base, not the old
          // one); among those, India (ink) before its parts.
          const rank = (x: SeriesData) => lastT(x) + (x.color === 'ink' ? 1e-6 : 0)
          const s = f.series ? all.find((x) => x.key === f.series) : all.toSorted((a, b) => rank(b) - rank(a))[0]
          if (!s) throw new Error(`${f.chart}: no series ${f.series}`)
          return { pt: pointAt(s, f.x), s }
        })()
  if (!pt || pt.y === null) throw new Error(`${f.chart}: no value for the figure "${f.label}"`)
  return {
    // The figure takes its series' own format (enrolment in crore beside ratios), then the chart's.
    value: f.format ? formatNumber(pt.y, f.format, pt.raw) : show(chart, pt, s),
    label: f.label,
    // A time chart's x is the period; for states and categories, the row's own period column is.
    period: f.period ?? (chart.kind === 'line' || chart.kind === 'columns' || chart.kind === 'area' ? pt.label : rowPeriod(pt.row.period) ?? chart.punches.period),
    // A method break belongs to a series, not to one value.
    status: (chart.status ?? []).filter((x) => x !== 'Method break'),
    office: chart.punches.office,
    href: `/charts/${chart.slug}/`,
  }
}
