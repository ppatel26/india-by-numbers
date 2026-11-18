/**
 * Every number in a topic's prose must appear in that topic's data, as published.
 * Years, dates, ages, ranks, base years and denominators are not data values and are skipped.
 */
import { describe, expect, it } from 'vitest'
import { topics } from '~/content'
import type { Chart, Topic } from '~/content/types'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { DATA_DIR, rows } from '~/lib/data'

const filesOf = (c: Chart): string[] =>
  c.kind === 'states' || c.kind === 'table' ? [c.data.file] : c.kind === 'pyramid' ? [c.left.file, c.right.file] : c.series.map((s) => s.file)

/** Every number in the topic's data folders (CSVs and the README headline tables), as printed. */
function pool(t: Topic): Set<string> {
  const dirs = new Set(t.parts.flatMap((p) => p.blocks.flatMap((b) => ('chart' in b ? filesOf(b.chart).map((f) => f.split('/')[0]!) : []))))
  const out = new Set<string>()
  const add = (n: string) => {
    const x = Math.abs(Number(n))
    out.add(n.replace(/^-/, ''))
    // Prose rounds to the chart's digits, and quotes large counts in crore and lakh.
    for (const d of [0, 1, 2]) out.add(x.toFixed(d))
    for (const k of [1e7, 1e5, 1e4, 1e6]) for (const d of [1, 2]) out.add(((x * (x < 1e5 ? 1000 : 1)) / k).toFixed(d))
  }
  const numbersIn = (text: string) => text.match(/-?\d+(\.\d+)?/g) ?? []
  for (const dir of dirs)
    for (const f of readdirSync(join(DATA_DIR, dir))) {
      if (f.endsWith('.csv')) for (const r of rows(`${dir}/${f}`)) for (const v of Object.values(r)) numbersIn(v.replace(/,/g, '')).forEach(add)
      // README tables write grouped numbers: 1,21,08,54,977 and 5,63,113.
      else numbersIn(readFileSync(join(DATA_DIR, dir, f), 'utf8').replace(/\d{1,3}(,\d{2,3})+/g, (m) => m.replace(/,/g, ''))).forEach(add)
    }
  return out
}

/** Values the prose computes from chart data (a difference or a share), checked by hand. */
const DERIVED: Record<string, readonly string[]> = {
  health: ['0.9', '7.1'], // life expectancy gap between women and men, chart 3.2
  climate: ['56.84'], // share of the four largest states in India's renewable capacity, chart 5.1
}

const SKIP = [
  /\b(1[89]\d\d|20\d\d)(-\d{2})?\b(?!\.\d)/g, // years and financial years
  /\b\d{1,2} (January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g, // dates
  /\b\d+(st|nd|rd|th)\b/g, // ranks
  /\b\d{4}=100\b/g, // index bases
  /\bper [\d,]+\b/g, // denominators
  /\b(ages?|aged) \d+(\s?(to|-)\s?\d+|\+)?/gi, // ages
  /\b\d+(\+|-\d+)\b/g, // age bands like 15+ and 15-29
  /\b(more than|above|under|below|at least|over)\s₹?[\d,.]+/gi, // thresholds
  /\b[\d,]+ or more\b/gi,
  /\bband of \d+% to \d+%/gi,
  /\b(Q[1-4]|NFHS-\d|class(es)? \d+(-\d+)?|Table \d+(\.\d+)?|Report \d+|\d+ (states|UTs|units))\b/gi,
]

function numbers(text: string): string[] {
  let t = text
  for (const re of SKIP) t = t.replace(re, ' ')
  return [...t.matchAll(/₹?(\d[\d,]*\.\d+|\d{1,3}(,\d{2,3})+|\d+(?=%| per cent| percentage| crore| lakh))/g)].map((m) => m[0].replace(/[₹,]/g, ''))
}

const prose = (t: Topic): [string, string][] => [
  ['standfirst', t.standfirst],
  ...t.parts.flatMap((p, i): [string, string][] => [
    [`part ${i + 1} lede`, p.lede],
    ...p.blocks.flatMap((b, j): [string, string][] => ('text' in b ? [[`part ${i + 1} text ${j + 1}`, b.text]] : [])),
  ]),
]

describe.each(topics.map((t) => [t.slug, t] as const))('%s prose', (_, t) => {
  const values = pool(t)
  it.each(prose(t))('%s quotes only published values', (_, text) => {
    const missing = numbers(text).filter((n) => !values.has(n) && !values.has(String(Number(n))) && !DERIVED[t.slug]?.includes(n))
    expect(missing, text).toEqual([])
  })
})
