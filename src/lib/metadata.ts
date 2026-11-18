/** What a chart is, where it comes from and how to cite it: the chart page and its JSON file. */
import type { Placed } from '~/content'
import { seriesOf, statesOf } from './charts/model'
import { formatDate } from './period'
import { SITE } from './site'
import { releasedText } from './sources'

export function dateRange(p: Placed): string {
  const { chart } = p
  if (chart.kind !== 'line' && chart.kind !== 'columns' && chart.kind !== 'area') return chart.punches.period
  const sorted = seriesOf(chart)
    .flatMap((s) => s.points)
    .sort((a, b) => a.t - b.t)
  const first = sorted[0]?.label
  const last = sorted.at(-1)?.label
  return first === last ? (first ?? '') : `${first} to ${last}`
}

export function geographyOf(p: Placed): string {
  const { chart } = p
  if (chart.kind === 'states') {
    const d = statesOf(chart)
    const n = d.values.filter((v) => v.pt?.y != null).length
    return `${n} states and UTs${d.india ? ', and India' : ''}`
  }
  return 'India'
}

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
    nextRelease: chart.nextRelease ?? 'not announced',
    licence: 'CC BY 4.0 for our charts and text. Publisher data stays under each publisher’s terms.',
    files: {
      csv: `/charts/${chart.slug}.csv`,
      ...(chart.kind === 'table' ? {} : { png: `/charts/${chart.slug}.png`, svg: `/charts/${chart.slug}.svg` }),
    },
  }
}
