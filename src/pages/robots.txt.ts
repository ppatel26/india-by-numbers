import type { APIRoute } from 'astro'
import { NOINDEX } from '~/lib/site'

export const GET: APIRoute = ({ site }) =>
  new Response(NOINDEX ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nDisallow: /lab/\n\nSitemap: ${new URL('/sitemap.xml', site)}\n`, {
    headers: { 'Content-Type': 'text/plain' },
  })
