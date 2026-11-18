/** Static routes that make one file per chart. */
import type { APIRoute } from 'astro'
import { charts, type Placed } from '~/content'

export function chartFiles(make: (p: Placed) => { body: string | Uint8Array<ArrayBuffer>; type: string }, opts: { images?: boolean } = {}) {
  const getStaticPaths = () =>
    charts
      .filter((c) => !opts.images || c.chart.kind !== 'table')
      .map((c) => ({ params: { slug: c.chart.slug }, props: { placed: c } }))
  const GET: APIRoute = ({ props }) => {
    const { body, type } = make((props as { placed: Placed }).placed)
    return new Response(body, { headers: { 'Content-Type': type } })
  }
  return { getStaticPaths, GET }
}
