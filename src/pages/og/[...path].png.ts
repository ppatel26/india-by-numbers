/** One social image per page: /og/<page path>.png, named by src/lib/site.ts ogImagePath. */
import type { APIRoute } from 'astro'
import { charts, topics } from '~/content'
import { places } from '~/lib/geography'
import { chartImage, plainImage, stateImage, topicImage } from '~/lib/og'
import { SITE } from '~/lib/site'

const counts = `${topics.length} topics, ${charts.length} charts and ${places.length} states and UTs. Every figure carries its publisher, its period and the date we checked it.`

const plain: Record<string, [string, string]> = {
  home: ['India, counted.', counts],
  topics: ['Topics', 'Each topic page answers a few plain questions. Every chart has a table, a source and a CSV.'],
  charts: ['All charts', `${charts.length} charts. Every chart has a table, a source and a CSV.`],
  states: ['States and union territories', "One state's figures beside India's, on every topic."],
  'how-we-check': ['How we check', 'You should not have to take our word for it.'],
  sources: ['Sources', 'Every figure on this site comes from one of these publishers.'],
  releases: ['Releases', 'What changed on this site, and what is due next.'],
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
