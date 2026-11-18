/**
 * Periods as the publishers write them, placed on one time axis.
 * `t` is a decimal year at the start of the period.
 */
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const
const LONG_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const

export type PeriodKind = 'year' | 'month' | 'day' | 'span' | 'fy-quarter' | 'quarter' | 'range'

export interface Period {
  kind: PeriodKind
  t: number
  label: string
}

const month = (m: string): string => MONTHS[Number(m) - 1] ?? m

/**
 * "2012-01" is January 2012 in a monthly series, but "1999-01" is 1999 to 2001
 * in a series of spans. `yyMm` says which one a "YYYY-NN" value is; get it
 * from the whole column with `yyMmOf`.
 */
export function parsePeriod(s: string, yyMm: 'month' | 'span' = guessYyMm(s)): Period {
  let m: RegExpMatchArray | null
  if ((m = s.match(/^(\d{4})$/))) return { kind: 'year', t: +m[1]!, label: s }
  if ((m = s.match(/^(\d{4})-(\d{2})$/)) && yyMm === 'month')
    return { kind: 'month', t: +m[1]! + (+m[2]! - 1) / 12, label: `${month(m[2]!)} ${m[1]}` }
  if ((m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/)))
    return { kind: 'day', t: +m[1]! + (+m[2]! - 1) / 12 + (+m[3]! - 1) / 365, label: formatDate(s) }
  if ((m = s.match(/^(\d{4})-(\d{2})$/))) return { kind: 'span', t: +m[1]!, label: s }
  if ((m = s.match(/^(\d{4})-(\d{2}) Q([1-4])$/)))
    return { kind: 'fy-quarter', t: +m[1]! + 0.25 * +m[3]!, label: `Q${m[3]} ${m[1]}-${m[2]}` }
  if ((m = s.match(/^(\d{4})-Q([1-4])$/))) {
    const q = +m[2]!
    return { kind: 'quarter', t: +m[1]! + 0.25 * (q - 1), label: `${MONTHS[3 * q - 3]}-${MONTHS[3 * q - 1]} ${m[1]}` }
  }
  if ((m = s.match(/^(\d{4})-(\d{2})(?:-\d{2})?\/(\d{4})-(\d{2})(?:-\d{2})?$/))) {
    const [, y1, m1, y2, m2] = m
    const start = y1 === y2 ? month(m1!) : `${month(m1!)} ${y1}`
    return { kind: 'range', t: +y1! + (+m1! - 1) / 12, label: `${start} to ${month(m2!)} ${y2}` }
  }
  throw new Error(`Unknown period format: "${s}"`)
}

const YY_MM = /^(\d{4})-(\d{2})$/

/** One value alone: a span when the suffix cannot be a month or is the next year ("2011-12"). */
function guessYyMm(s: string): 'month' | 'span' {
  const m = s.match(YY_MM)
  if (!m) return 'month'
  const end = +m[2]!
  return end < 1 || end > 12 || end === (+m[1]! + 1) % 100 ? 'span' : 'month'
}

/** A column is monthly when no suffix exceeds 12 and some year appears twice. */
export function yyMmOf(xs: readonly string[]): 'month' | 'span' {
  const hits = xs.map((x) => x.match(YY_MM)).filter((m) => m !== null)
  if (hits.length === 0) return 'month'
  if (hits.length === 1) return guessYyMm(xs.find((x) => YY_MM.test(x))!)
  if (hits.some((m) => +m[2]! > 12 || +m[2]! < 1)) return 'span'
  const years = hits.map((m) => m[1])
  return new Set(years).size < years.length ? 'month' : 'span'
}

/** "2026-11-12" -> "12 Nov 2026"; long: "12 November 2026". */
export function formatDate(iso: string, style: 'short' | 'long' = 'short'): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return iso
  const names = style === 'long' ? LONG_MONTHS : MONTHS
  return `${+m[3]!} ${names[+m[2]! - 1]} ${m[1]}`
}

/** Period words for running text: "2026-10" -> "October 2026". */
export function longPeriod(s: string): string {
  const p = parsePeriod(s)
  if (p.kind !== 'month') return p.label
  const [y, mm] = s.split('-')
  return `${LONG_MONTHS[+mm! - 1]} ${y}`
}
