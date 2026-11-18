import type { APIRoute } from 'astro'
import { charts, topics } from '~/content'
import { places } from '~/lib/geography'
import { SYNONYMS, normalise, type Entry } from '~/lib/search'

const entry = (e: Omit<Entry, 'words'>, extra = ''): Entry => ({ ...e, words: normalise(`${e.title} ${e.detail} ${extra}`) })

export const GET: APIRoute = () => {
  const index: Entry[] = [
    ...topics.map((t) => entry({ kind: 'Topic', title: t.name, detail: t.hindi, href: `/${t.slug}/` }, `${SYNONYMS[t.slug]} ${t.parts.map((p) => p.title).join(' ')}`)),
    ...places.map((p) =>
      entry({ kind: 'State', title: p.name, detail: p.native?.name ?? p.hindi ?? '', href: `/states/${p.slug}/` }, `${p.hindi ?? ''} ${p.code} ${p.type === 'ut' ? 'union territory' : 'state'}`),
    ),
    ...charts.map((c) => entry({ kind: 'Chart', title: c.chart.title, detail: `${c.topic.name} · ${c.chart.subtitle}`, href: `/charts/${c.chart.slug}/` }, SYNONYMS[c.topic.slug])),
  ]
  return new Response(JSON.stringify(index), { headers: { 'Content-Type': 'application/json' } })
}
