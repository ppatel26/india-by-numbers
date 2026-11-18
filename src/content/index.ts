/** The site's content: topics in order, and every chart with its place on its topic page. */
import { TOPICS, type Block, type Chart, type Part, type Topic, type TopicSlug } from './types'

const modules = import.meta.glob<{ default: Topic }>('./topics/*.ts', { eager: true })

export const topics: readonly Topic[] = TOPICS.flatMap((slug) => {
  const mod = modules[`./topics/${slug}.ts`]
  return mod ? [mod.default] : []
})

export function topic(slug: TopicSlug): Topic {
  const t = topics.find((x) => x.slug === slug)
  if (!t) throw new Error(`No topic ${slug}`)
  return t
}

export interface Placed {
  chart: Chart
  topic: Topic
  part: Part
  /** 1-based part number. */
  partNo: number
  /** "2.1": part number, then position in the part. The charts of one period switch share it. */
  number: string
  /** The period switch the chart sits in, this chart included. */
  periods?: readonly PeriodLink[]
}

export interface PeriodLink {
  label: string
  short: string
  slug: string
}

/** The charts in a block: none, one, or one per period. */
export const chartsIn = (b: Block): Chart[] => ('chart' in b ? [b.chart] : 'periods' in b ? b.periods.map((p) => p.chart) : [])

export const charts: readonly Placed[] = topics.flatMap((t) =>
  t.parts.flatMap((part, i) =>
    part.blocks
      .flatMap((b) => ('text' in b ? [] : [b]))
      .flatMap((b, j): Placed[] => {
        const at = { topic: t, part, partNo: i + 1, number: `${i + 1}.${j + 1}` }
        if ('chart' in b) return [{ chart: b.chart, ...at }]
        const periods = b.periods.map((p) => ({ label: p.label, short: p.short, slug: p.chart.slug }))
        return b.periods.map((p) => ({ chart: p.chart, ...at, periods }))
      }),
  ),
)

const bySlug = new Map<string, Placed>()
for (const c of charts) {
  if (bySlug.has(c.chart.slug)) throw new Error(`Two charts use the slug "${c.chart.slug}"`)
  bySlug.set(c.chart.slug, c)
}

export function placed(slug: string): Placed {
  const c = bySlug.get(slug)
  if (!c) throw new Error(`No chart "${slug}"`)
  return c
}

/** Anchor id for a part on its topic page. */
export const partId = (partNo: number): string => `part-${partNo}`
