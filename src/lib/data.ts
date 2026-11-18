/** Read the CSVs in research/data and pick rows from them. Build time only. */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { csvParse } from 'd3-dsv'
import type { Pick } from '~/content/types'
import { parsePeriod, yyMmOf } from './period'

const isPeriod = (x: string, yyMm: 'month' | 'span'): boolean => {
  try {
    parsePeriod(x, yyMm)
    return true
  } catch {
    return false
  }
}

export type Row = Readonly<Record<string, string>>

export const DATA_DIR = join(process.cwd(), 'research/data')

const cache = new Map<string, readonly Row[]>()

export function rows(file: string): readonly Row[] {
  let hit = cache.get(file)
  if (!hit) {
    hit = csvParse(readFileSync(join(DATA_DIR, file), 'utf8'))
    cache.set(file, hit)
  }
  return hit
}

export function csvText(file: string): string {
  return readFileSync(join(DATA_DIR, file), 'utf8')
}

const matches = (row: Row, where: Pick['where']): boolean =>
  !where ||
  Object.entries(where).every(([col, want]) => {
    const have = row[col]
    if (have === undefined) throw new Error(`No column "${col}"`)
    return typeof want === 'string' ? have === want : want.includes(have)
  })

export function select(p: Pick): readonly Row[] {
  try {
    return rows(p.file).filter((r) => matches(r, p.where))
  } catch (e) {
    throw new Error(`${p.file}: ${(e as Error).message}`)
  }
}

/** One value as published. `raw` keeps the publisher's digits for display. */
export interface Point {
  x: string
  /** Display label: "Oct 2026" for x "2026-10"; the x itself for categories. */
  label: string
  /** Position on a time axis (decimal year), or NaN for categories. */
  t: number
  y: number | null
  raw: string
  /** The CSV row the value came from: its period, unit and status travel with it. */
  row: Row
  /** The pick's note column for this value, if any. */
  note?: string
}

export function toNumber(raw: string | undefined): number | null {
  if (raw === undefined || raw.trim() === '') return null
  const n = Number(raw.replace(/,/g, ''))
  if (Number.isNaN(n)) throw new Error(`Not a number: "${raw}"`)
  return n
}

/**
 * The points of a pick. On a time axis they come in period order; categories
 * keep the CSV order. Fails on two rows with the same x.
 */
export function points(p: Pick, axis: 'time' | 'category' = 'time', defaultX = 'period'): Point[] {
  const xCol = p.x ?? defaultX
  const yCol = p.y ?? 'value'
  const picked = select(p)
  const yyMm = yyMmOf(picked.map((r) => r[xCol] ?? ''))
  // A time chart whose x is not a period (for example seasons) keeps the CSV order.
  const time = axis === 'time' && picked.every((r) => isPeriod(r[xCol] ?? '', yyMm))
  const out: Point[] = []
  const seen = new Set<string>()
  for (const r of picked) {
    const x = r[xCol]
    if (x === undefined) throw new Error(`${p.file}: no column "${xCol}"`)
    if (seen.has(x)) throw new Error(`${p.file}: two rows for ${xCol}=${x}; narrow the "where"`)
    seen.add(x)
    const raw = r[yCol]
    if (raw === undefined) throw new Error(`${p.file}: no column "${yCol}"`)
    const period = time ? parsePeriod(x, yyMm) : undefined
    const label = (p.xLabel && r[p.xLabel]) || period?.label || x
    const note = (p.note && r[p.note]) || undefined
    out.push({ x, label, t: period?.t ?? (axis === 'time' ? out.length : NaN), y: toNumber(raw), raw: raw.trim(), row: r, note })
  }
  return time ? out.sort((a, b) => a.t - b.t) : out
}

export const latest = (pts: readonly Point[]): Point | undefined => pts.findLast((pt) => pt.y !== null)
