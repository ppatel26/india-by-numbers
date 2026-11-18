/** Every HTML page on the site, for the sitemap and the end-to-end tests. */
import { charts, topics } from '~/content'
import { places } from './geography'

export const STATIC_PAGES = ['/', '/topics/', '/charts/', '/states/', '/sources/', '/how-we-check/', '/releases/', '/corrections/', '/about/', '/search/'] as const

export const allPages = (): string[] => [
  ...STATIC_PAGES,
  ...topics.map((t) => `/${t.slug}/`),
  ...charts.map((c) => `/charts/${c.chart.slug}/`),
  ...places.map((p) => `/states/${p.slug}/`),
]
