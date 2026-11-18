/**
 * The publisher release calendar (research/data/release-calendar.csv; sources in research/data/README.md).
 * Only dates a publisher has announced count as due; our own estimates do not.
 */
import { rows } from './data'
import { formatDate, longPeriod } from './period'
import { SITE } from './site'

export interface Due {
  /** YYYY-MM-DD */
  date: string
  publisher: string
  /** The release in the site's words, with its period: "GDP, Q2 FY 2026-27". */
  name: string
}

/** Reader-facing names for the calendar's release titles. */
const NAMES: Readonly<Record<string, string>> = {
  'Quarterly GDP estimates': 'GDP',
  'First Advance Estimates of GDP': 'GDP, first advance estimate',
  'Index of Industrial Production': 'Industrial production',
  'Consumer Price Index': 'Inflation',
  'PLFS monthly bulletin': 'Unemployment',
  'Monetary Policy Committee meeting (final day)': 'RBI policy rate',
}

/** "2026-10" -> "October 2026"; "2026-27 Q2" -> "Q2 FY 2026-27"; "2026-27" -> "FY 2026-27"; a date span -> "". */
function periodOf(p: string): string {
  const q = p.match(/^(\d{4}-\d{2}) (Q[1-4])$/)
  if (q) return `${q[2]} FY ${q[1]}`
  if (/^\d{4}-\d{2}$/.test(p) && +p.slice(5) > 12) return `FY ${p}`
  if (/^\d{4}-\d{2}$/.test(p)) return longPeriod(p)
  return ''
}

const calendar = rows('release-calendar.csv')

/** The next `n` announced releases after the day we last checked the site. */
export function upcoming(n: number): Due[] {
  return calendar
    .filter((r) => r.status === 'announced' && r.expected_date! > SITE.checked)
    .sort((a, b) => a.expected_date!.localeCompare(b.expected_date!))
    .slice(0, n)
    .map((r) => {
      const period = periodOf(r.period_covered ?? '')
      const name = NAMES[r.release!] ?? r.release!
      return { date: r.expected_date!, publisher: r.publisher!, name: period ? `${name}, ${period}` : name }
    })
}

/** " 4 DEC 2026": fixed width, for the split-flap board. */
export const flapDate = (iso: string): string => formatDate(iso).toUpperCase().padStart(11)
