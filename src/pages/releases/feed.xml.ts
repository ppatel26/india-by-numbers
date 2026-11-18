/** RSS 2.0 feed of the change log on /releases/, newest first. */
import type { APIRoute } from 'astro'
import page from '~/content/pages/releases'
import { escape } from '~/lib/markup'
import { MONTHS } from '~/lib/period'
import { SITE } from '~/lib/site'

/** "16 Nov 2026" -> RFC 822 date at midnight UTC. */
function rfc822(date: string): string {
  const [d, mon, y] = date.split(' ')
  const m = MONTHS.indexOf(mon as (typeof MONTHS)[number])
  if (m < 0 || !d || !y) throw new Error(`Releases feed: bad date "${date}"`)
  return new Date(Date.UTC(+y, m, +d)).toUTCString()
}

export const GET: APIRoute = ({ site }) => {
  const base = new URL('/releases/', site)
  const rows = page.changeLog.rows
  const items = rows.map((r, i) => {
    const text = [r.detail, `${r.kind}. ${page.changeLog.heads.charts}: ${r.charts}.`].filter(Boolean).join(' ')
    return `<item>
<title>${escape(r.release)}</title>
<link>${base}</link>
<guid isPermaLink="false">${escape(`${base}#${rows.length - i}`)}</guid>
<pubDate>${rfc822(r.released)}</pubDate>
<category>${escape(r.kind)}</category>
<description>${escape(text)}</description>
</item>`
  })
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${escape(`${SITE.name}: ${page.title.toLowerCase()}`)}</title>
<link>${base}</link>
<description>${escape(page.description)}</description>
<language>en-IN</language>
${rows[0] ? `<lastBuildDate>${rfc822(rows[0].released)}</lastBuildDate>` : ''}
${items.join('\n')}
</channel>
</rss>
`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
