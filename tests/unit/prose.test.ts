/**
 * Every number in a topic's prose must appear in that topic's data, as published.
 * Years, dates, ages, ranks, base years and denominators are not data values and are skipped.
 */
import { describe, expect, it } from 'vitest'
import { chartsIn, topics } from '~/content'
import type { Topic } from '~/content/types'
import { picksOf } from '~/lib/metadata'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { DATA_DIR, rows } from '~/lib/data'
import { isGated } from '~/content/gated'

/** Every number in the topic's data folders (CSVs and the README headline tables), as printed. */
function pool(t: Topic): Set<string> {
  const dirs = new Set(t.parts.flatMap((p) => p.blocks.flatMap((b) => chartsIn(b).flatMap((c) => picksOf(c).map((k) => k.file.split('/')[0]!)))))
  const out = new Set<string>()
  const add = (n: string) => {
    const x = Math.abs(Number(n))
    out.add(n.replace(/^-/, ''))
    // Prose rounds to the chart's digits, and quotes large counts in crore and lakh, and US$
    // million in billion (k = 1e3).
    for (const d of [0, 1, 2]) out.add(x.toFixed(d))
    for (const k of [1e7, 1e5, 1e4, 1e6, 1e3]) for (const d of [1, 2]) out.add(((x * (x < 1e5 ? 1000 : 1)) / k).toFixed(d))
  }
  const numbersIn = (text: string) => text.match(/-?\d+(\.\d+)?/g) ?? []
  // Numbers from files the site may not show yet (src/content/gated.ts). They leave the pool unless
  // a file the site may show also has them, so prose cannot quote them, even through a README.
  const gated = new Set<string>()
  const shown = new Set<string>()
  for (const dir of dirs)
    for (const f of readdirSync(join(DATA_DIR, dir)))
      if (f.endsWith('.csv'))
        for (const r of rows(`${dir}/${f}`)) for (const v of Object.values(r)) numbersIn(v.replace(/,/g, '')).forEach((n) => (isGated(`${dir}/${f}`) ? gated : shown).add(n.replace(/^-/, '')))
  for (const dir of dirs)
    for (const f of readdirSync(join(DATA_DIR, dir))) {
      if (f.endsWith('.csv') && isGated(`${dir}/${f}`)) continue
      if (f.endsWith('.csv'))
        for (const r of rows(`${dir}/${f}`)) {
          for (const v of Object.values(r)) numbersIn(v.replace(/,/g, '')).forEach(add)
          // A count published in lakh reads in crore: 2,54,666.92 lakh is 2,546.67 crore.
          if (r.unit?.startsWith('lakh') && r.value) for (const d of [0, 1, 2]) out.add((Math.abs(Number(r.value)) / 100).toFixed(d))
        }
      // README tables write grouped numbers: 1,21,08,54,977 and 5,63,113.
      else
        numbersIn(readFileSync(join(DATA_DIR, dir, f), 'utf8').replace(/\d{1,3}(,\d{2,3})+/g, (m) => m.replace(/,/g, '')))
          .filter((n) => !gated.has(n.replace(/^-/, '')) || shown.has(n.replace(/^-/, '')))
          .forEach(add)
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

// One test per topic; a failure names the passage and the numbers not found in the data.
describe('prose quotes only published values', () => {
  it.each(topics.map((t) => [t.slug, t] as const))('%s', (_, t) => {
    const values = pool(t)
    for (const [where, text] of prose(t)) {
      const missing = numbers(text).filter((n) => !values.has(n) && !values.has(String(Number(n))) && !DERIVED[t.slug]?.includes(n))
      expect(missing, `${where}: ${text}`).toEqual([])
    }
  })
})
