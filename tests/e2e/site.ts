/** Shared helpers: the page list comes from the built sitemap. */
import type { APIRequestContext } from '@playwright/test'

export async function sitemap(request: APIRequestContext): Promise<string[]> {
  const xml = await (await request.get('/sitemap.xml')).text()
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).pathname)
}

export const meta = (html: string, key: string): string | undefined =>
  html.match(new RegExp(`<meta (?:name|property)="${key}" content="([^"]*)"`))?.[1]

/** Sample pages of every kind, for browser and accessibility checks. */
export const SAMPLE = ['/', '/topics/', '/prices/', '/population/', '/economy/', '/charts/cpi-inflation-by-state/', '/charts/usd-inr-monthly/', '/charts/farm-income-and-debt-by-state/', '/charts/facility-births-by-state/', '/charts/rural-spending-by-item/', '/charts/central-government-money/', '/charts/', '/states/', '/states/tamil-nadu/', '/how-we-check/', '/sources/', '/releases/', '/corrections/', '/about/', '/search/?q=inflation']
