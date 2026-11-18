/** One social image per page: /og/<page path>.png, named by src/lib/site.ts ogImagePath. */
import type { APIRoute } from 'astro'
import { charts, topics } from '~/content'
import { places } from '~/lib/geography'
import { chartImage, plainImage, stateImage, topicImage } from '~/lib/og'
import { SITE } from '~/lib/site'

const counts = `Charts of India's official statistics: ${topics.length} topics, ${charts.length} charts, ${places.length} states and UTs.`

const plain: Record<string, [string, string]> = {
  home: ['India by Numbers', counts],
  topics: ['Topics', `${topics.length} topics, ${charts.length} charts.`],
  charts: ['All charts', `${charts.length} charts, by topic.`],
  states: ['States and union territories', `${places.length} states and UTs, each beside India.`],
  'how-we-check': ['How we check', 'You should not have to take our word for it.'],
  sources: ['Sources', 'The publishers behind every figure.'],
  releases: ['Releases', 'New releases and what is due next.'],
  corrections: ['Corrections', 'What we got wrong, and what we changed.'],
  about: [`About ${SITE.name}`, 'A free, independent site for India’s official statistics. Not a government website.'],
  search: ['Search', counts],
}

export function getStaticPaths() {
  return [
    ...Object.entries(plain).map(([path, [title, line]]) => ({
      params: { path },
      props: { make: () => plainImage(title, line, path === 'how-we-check' ? 'methods' : 'topics') },
    })),
    ...topics.map((t) => ({ params: { path: t.slug }, props: { make: () => topicImage(t) } })),
    ...charts.map((c) => ({ params: { path: `charts/${c.chart.slug}` }, props: { make: () => chartImage(c) } })),
    ...places.map((p) => ({ params: { path: `states/${p.slug}` }, props: { make: () => stateImage(p) } })),
  ]
}

export const GET: APIRoute = ({ props }) =>
  new Response(new Uint8Array((props as { make: () => Buffer }).make()), { headers: { 'Content-Type': 'image/png' } })
