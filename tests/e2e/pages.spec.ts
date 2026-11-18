import { expect, test } from '@playwright/test'
import { meta, sitemap } from './site'

test('every page in the sitemap has a title, a description, one h1, a canonical link and a social image', async ({ request }) => {
  const pages = await sitemap(request)
  expect(pages.length).toBeGreaterThan(120)
  const images = new Set<string>()
  for (const path of pages) {
    const res = await request.get(path)
    expect(res.status(), path).toBe(200)
    const html = await res.text()
    expect(html.match(/<h1[\s>]/g)?.length, `${path}: one h1`).toBe(1)
    expect(html, path).toMatch(/<title>[^<]*India by Numbers[^<]*<\/title>/)
    expect(meta(html, 'description')?.length, `${path}: description`).toBeGreaterThan(20)
    expect(html).toContain(`<link rel="canonical" href="https://indiabynumbers.org${path}"`)
    const og = meta(html, 'og:image')
    expect(og, `${path}: og:image`).toBeTruthy()
    images.add(new URL(og!).pathname)
    expect(html, `${path}: em dash`).not.toContain('—')
  }
  for (const img of images) {
    const res = await request.get(img)
    expect(res.status(), img).toBe(200)
    expect(res.headers()['content-type']).toBe('image/png')
    expect((await res.body()).length, img).toBeGreaterThan(20_000)
  }
})

test('every internal link and file resolves', async ({ request }) => {
  const pages = await sitemap(request)
  const links = new Set<string>()
  for (const path of pages) {
    const html = await (await request.get(path)).text()
    for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) links.add(m[1]!)
  }
  const broken: string[] = []
  for (const link of links) {
    const res = await request.get(link, { maxRedirects: 2 })
    if (res.status() !== 200) broken.push(`${res.status()} ${link}`)
  }
  expect(broken).toEqual([])
})

test('chart files carry the right types and data', async ({ request }) => {
  const csv = await request.get('/charts/cpi-inflation-by-state.csv')
  expect(csv.headers()['content-type']).toContain('text/csv')
  const text = await csv.text()
  // One row per value, with its own period, unit and status.
  expect(text.split('\n')[0]).toBe('entity,series,period,value,unit,status,note,sources')
  expect(text).toContain('Tamil Nadu,Inflation,2026-10,7.29,percent,provisional,')
  const pop = await (await request.get('/charts/population-projection.csv')).text()
  expect(pop).toContain('India,Projection,2036,1522288,thousand persons')
  const json = await (await request.get('/charts/cpi-inflation-by-state.json')).json()
  expect(json.status).toContain('Provisional')
  const svg = await request.get('/charts/cpi-inflation-by-state.svg')
  expect(svg.headers()['content-type']).toContain('image/svg+xml')
  expect(await svg.text()).toContain('Inflation by state and UT')
})

test('unknown pages return the 404 page', async ({ request }) => {
  const res = await request.get('/no-such-page/')
  expect(res.status()).toBe(404)
  expect(await res.text()).toContain('<h1')
})

test('robots.txt points search engines at the sitemap', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text()
  expect(robots).toContain('Allow: /')
  expect(robots).toContain('Sitemap: https://indiabynumbers.org/sitemap.xml')
  expect((await request.get('/')).headers()['x-robots-tag']).toBeUndefined()
})
