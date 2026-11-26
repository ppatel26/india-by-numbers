/**
 * Counts in prose. A count in a standfirst, a part lede or a finding is written as a marker that
 * holds the published value, so it reads in the same form as every figure and follows the number
 * switch:
 *
 *   'India had {{1210854977 crore 2}} people at Census 2011.'
 *   -> "1.211 billion" by default, "121.09 crore" in lakh and crore mode.
 *
 * Marker: {{[₹|US$]VALUE SCALE DECIMALS [MILLION_DECIMALS]}}
 * - VALUE: the published value in plain units (persons, rupees, MW), with no grouping commas.
 * - SCALE: crore, lakh, lakh-crore, or plain (a full number: 1,77,175 or 177,175).
 * - DECIMALS: digits after the point in the lakh and crore form, as the sentence prints them.
 * - MILLION_DECIMALS: digits in the million form, when they differ (see Format.intlDecimals).
 * Rates such as "for every lakh people" are words, not counts, and take no marker.
 */
import type { Format } from '~/content/types'
import { formatNumber, type Shown } from './format'
import { escape } from './markup'

const MARKER = /\{\{(₹|US\$)?(-?\d+(?:\.\d+)?) (crore|lakh|lakh-crore|plain) (\d)(?: (\d))?\}\}/g
const SCALES = { crore: 'crore', lakh: 'lakh', 'lakh-crore': 'lakh crore', plain: 'none' } as const

/** Every `{{` in prose must be a valid marker; anything else is a typo. */
export const strayMarker = (text: string): boolean => text.replace(MARKER, '').includes('{{')

function shown(m: RegExpMatchArray): Shown {
  const [, unit, value, scale, d, di] = m
  const f: Format = {
    unit: unit as Format['unit'],
    scale: SCALES[scale as keyof typeof SCALES],
    decimals: Number(d),
    ...(di === undefined ? {} : { intlDecimals: Number(di) }),
  }
  return formatNumber(Number(value), f)
}

type Part = string | Shown

function parts(text: string): Part[] {
  const out: Part[] = []
  let at = 0
  for (const m of text.matchAll(MARKER)) {
    out.push(text.slice(at, m.index), shown(m))
    at = m.index! + m[0].length
  }
  out.push(text.slice(at))
  return out.filter((p) => p !== '')
}

/** HTML for a page: each count is a span the number switch swaps. Everything else is escaped. */
export const proseHtml = (text: string): string =>
  parts(text)
    .map((p) => (typeof p === 'string' ? escape(p) : p.alt === undefined ? escape(p.text) : `<span data-alt="${escape(p.alt)}">${escape(p.text)}</span>`))
    .join('')

/** Plain text, for a meta description or a search entry: the default (million) form. */
export const prosePlain = (text: string): string => parts(text).map((p) => (typeof p === 'string' ? p : p.text)).join('')

/** Plain text in the lakh and crore form: the prose as it reads in that mode. */
export const proseIndian = (text: string): string => parts(text).map((p) => (typeof p === 'string' ? p : (p.alt ?? p.text))).join('')
