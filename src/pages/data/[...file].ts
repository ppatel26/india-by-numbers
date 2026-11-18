/** The source CSVs from research/data, as published on the site ("Download full data"). */
import { readdirSync } from 'node:fs'
import { join, relative } from 'node:path'
import type { APIRoute } from 'astro'
import { DATA_DIR, csvText } from '~/lib/data'

const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(join(dir, d.name)) : d.name.endsWith('.csv') ? [join(dir, d.name)] : []))

export const getStaticPaths = () => walk(DATA_DIR).map((f) => ({ params: { file: relative(DATA_DIR, f) } }))

export const GET: APIRoute = ({ params }) => new Response(csvText(params.file!), { headers: { 'Content-Type': 'text/csv; charset=utf-8' } })
