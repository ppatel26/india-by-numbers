/** What a chart is, where it comes from and how to cite it: the chart page and its JSON file. */
import type { Placed } from '~/content'
import type { Chart, Pick, Source } from '~/content/types'
import { select } from './data'
import { INDIA, places } from './geography'
import { formatDate, parsePeriod, yyMmOf } from './period'
import { SITE } from './site'
import { releasedText } from './sources'

/** Every pick a chart reads. */
export function picksOf(chart: Chart): Pick[] {
  if (chart.kind === 'states' || chart.kind === 'table') return [chart.data]
  if (chart.kind === 'pyramid') return [chart.left, chart.right]
  return [...chart.series]
}

/** The periods a chart covers, from the period column of every row it reads. */
export function dateRange(p: Placed): string {
  const rows = picksOf(p.chart).flatMap((k) => select(k))
  const periods = [...new Set(rows.map((r) => r.period ?? r.date ?? r.effective_date).filter((x): x is string => !!x))]
  if (periods.length === 0) return p.chart.punches.period
  const sorted = periods.map((x) => ({ x, t: safeT(x) })).sort((a, b) => a.t - b.t)
  const label = (x: string) => (Number.isNaN(safeT(x)) ? x : parsePeriod(x, yyMmOf(periods)).label)
  if (sorted.length <= 3) return sorted.map((s) => label(s.x)).join(', ')
  return `${label(sorted[0]!.x)} to ${label(sorted.at(-1)!.x)}`
}

const safeT = (x: string): number => {
  try {
    return parsePeriod(x).t
  } catch {
    return NaN
  }
}

/** "36 states and UTs, and India": counted from the geography column of every row the chart reads. */
export function geographyOf(p: Placed): string {
  const geos = new Set(picksOf(p.chart).flatMap((k) => select(k).map((r) => r.geography ?? '')))
  const n = places.filter((pl) => geos.has(pl.slug)).length
  if (n === 0) return 'India'
  return `${n} states and UTs${geos.has(INDIA) ? ', and India' : ''}`
}

/** "14 Dec 2026", "17 Dec 2026 (estimated)" or "Not announced". */
export function nextReleaseText(chart: Chart): string {
  const m = chart.nextRelease?.match(/^(\d{4}-\d{2}-\d{2})( \(estimated\))?$/)
  return m ? `${formatDate(m[1]!)}${m[2] ?? ''}` : 'Not announced'
}

/** The latest release among a chart's sources. */
export const latestSource = (chart: Chart): Source | undefined =>
  [...chart.sources].filter((s) => /^\d{4}/.test(s.released)).sort((a, b) => b.released.localeCompare(a.released))[0] ?? chart.sources[0]

export function citation(p: Placed, origin: string): { inline: string; full: string } {
  const src = p.chart.sources[0]
  const url = `${origin}/charts/${p.chart.slug}/`
  return {
    inline: `${src?.publisher ?? ''}, ${src?.release ?? ''}; ${SITE.name}.`,
    full: `${src?.publisher ?? ''}. “${src?.release ?? ''}” (${src ? releasedText(src) : ''}). Processed by ${SITE.name}. “${p.chart.title}”, ${url}, checked ${formatDate(SITE.checked)}.`,
  }
}

export function metadataOf(p: Placed) {
  const { chart } = p
  return {
    slug: chart.slug,
    title: chart.title,
    subtitle: chart.subtitle,
    topic: p.topic.slug,
    section: p.number,
    unit: chart.punches.unit,
    period: dateRange(p),
    geography: geographyOf(p),
    status: chart.status ?? [],
    note: chart.note ?? null,
    whatYouShouldKnow: chart.know ?? [],
    processing: chart.processing ?? [],
    sources: chart.sources,
    checked: SITE.checked,
    nextRelease: nextReleaseText(chart),
    licence: 'CC BY 4.0 for our charts and text. Publisher data stays under each publisher’s terms.',
    files: {
      csv: `/charts/${chart.slug}.csv`,
      ...(chart.kind === 'table' ? {} : { png: `/charts/${chart.slug}.png`, svg: `/charts/${chart.slug}.svg` }),
    },
  }
}
