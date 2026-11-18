/** The site's content: topics in order, and every chart with its place on its topic page. */
import { TOPICS, type Chart, type Part, type Topic, type TopicSlug } from './types'

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
  /** "2.1": part number, then position in the part. */
  number: string
}

export const charts: readonly Placed[] = topics.flatMap((t) =>
  t.parts.flatMap((part, i) =>
    part.blocks
      .flatMap((b) => ('chart' in b ? [b.chart] : []))
      .map((chart, j) => ({ chart, topic: t, part, partNo: i + 1, number: `${i + 1}.${j + 1}` })),
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
