/**
 * The site's one dynamic route: "Report a problem" (POST /api/report) stores
 * the report in D1. Every other request is a static file from dist/. Pages on
 * www carry canonical links to indiabynumbers.org.
 */
interface Env {
  ASSETS: Fetcher
  DB: D1Database
}

const LIMITS = { page: 300, problem: 4000, source: 1000, email: 200 } as const
type Field = keyof typeof LIMITS

const back = (url: URL, status: 'sent' | 'error') => Response.redirect(new URL(`/corrections/?${status}=1#report`, url).toString(), 303)

async function report(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url)
  const form = await request.formData().catch(() => null)
  if (!form) return back(url, 'error')
  // Bots fill the hidden "website" field; people never see it.
  if (String(form.get('website') ?? '') !== '') return back(url, 'sent')
  const value = (f: Field) => String(form.get(f) ?? '').trim().slice(0, LIMITS[f])
  const problem = value('problem')
  if (problem.length < 5) return back(url, 'error')
  try {
    await env.DB.prepare('INSERT INTO reports (page, problem, source, email, created_at) VALUES (?, ?, ?, ?, ?)')
      .bind(value('page'), problem, value('source'), value('email'), new Date().toISOString())
      .run()
  } catch (e) {
    console.error('report not stored', e)
    return back(url, 'error')
  }
  return back(url, 'sent')
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url)
    if (url.pathname === '/api/report') {
      return request.method === 'POST' ? report(request, env) : new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } })
    }
    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
