import type { APIRoute } from 'astro'
import { allPages } from '~/lib/pages'
import { SITE } from '~/lib/site'

export const GET: APIRoute = ({ site }) => {
  const urls = allPages()
    .map((p) => `<url><loc>${new URL(p, site)}</loc><lastmod>${SITE.checked}</lastmod></url>`)
    .join('')
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
