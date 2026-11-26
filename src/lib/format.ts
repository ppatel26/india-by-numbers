/**
 * Number display. Million and billion by default, with international digit grouping;
 * the "Lakh · crore" switch shows the Indian form. `formatNumber` returns both,
 * and the page script swaps them (see src/scripts/numbers.ts).
 * The functions below build the Indian form as `text` and the international form as `alt`;
 * `intlFirst` turns that round at the one exit, so the page HTML is in the default form.
 */
import type { Format } from '~/content/types'

export interface Shown {
  /** The default (million) text. */
  text: string
  /** The lakh and crore text, when it differs. */
  alt?: string
}

/** True only inside `both`, while it builds the lakh and crore form of a string. */
let indianOut = false

/** Indian form first in, international form first out (or as it came, inside `both`). */
const intlFirst = (s: Shown): Shown => (indianOut || s.alt === undefined ? s : { text: s.alt, alt: s.text })

/**
 * Build a string that holds formatted numbers, such as a tooltip or a callout, in both forms:
 * `text` in million mode, and `alt` in lakh and crore mode when it differs.
 */
export function both(build: () => string): Shown {
  const text = build()
  indianOut = true
  try {
    const alt = build()
    return alt === text ? { text } : { text, alt }
  } finally {
    indianOut = false
  }
}

const indian = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 })
const intl = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 2 })

/** Digits after the point in a published value: "6.09" -> 2. */
export const decimalsOf = (raw: string): number => raw.split('.')[1]?.length ?? 0

function grouped(n: number, d: number, nf: Intl.NumberFormat): string {
  const s = n.toFixed(d)
  if (Math.abs(n) < 1000) return s
  const [int, frac] = s.split('.')
  return nf.format(Number(int)) + (frac ? `.${frac}` : '')
}

/** `d`: digits after the point in crore or lakh (default 1); the million/billion form follows it. */
function scaled(n: number, scale: Format['scale'], d = 1): Shown {
  if (scale === 'crore') {
    const text = `${grouped(n / 1e7, d, indian)} crore`
    const alt = Math.abs(n) >= 1e9 ? `${(n / 1e9).toFixed(d + 1)} billion` : `${grouped(n / 1e6, d, intl)} million`
    return { text, alt }
  }
  if (scale === 'lakh') {
    const text = `${grouped(n / 1e5, d, indian)} lakh`
    // Under a million the international reading is the plain number: ₹205,324, not ₹205.32 thousand.
    const alt = Math.abs(n) >= 1e6 ? `${(n / 1e6).toFixed(d + 1)} million` : grouped(n, 0, intl)
    return { text, alt }
  }
  throw new Error(`Unknown scale ${scale}`)
}

/** A currency sign goes after the minus: -US$25.4, not US$-25.4. */
const withUnit = (s: string, unit: Format['unit'], suffix = ''): string =>
  (unit === '₹' || unit === 'US$' ? s.replace(/^([-+]?)/, `$1${unit}`) : unit === 'pp' ? `${s} pp` : `${s}${unit ?? ''}`) + suffix

/**
 * Format a value. Pass the published string as `raw` to keep the publisher's
 * digits; computed values pass a number and `decimals`.
 */
export const formatNumber = (value: number, fmt: Format = {}, raw?: string): Shown => intlFirst(indianFirst(value, fmt, raw))

function indianFirst(value: number, fmt: Format = {}, raw?: string): Shown {
  // Round the product to 12 significant digits: 30,00,000 × 1e-5 is 30.000000000000004 in floating point.
  if (fmt.multiply) return indianFirst(Number((value * fmt.multiply).toPrecision(12)), { ...fmt, multiply: undefined })
  // A lakh or more, with no scale set, reads in lakh or crore: nobody should count digits.
  // Tables and CSVs keep every digit (they pass scale 'none').
  if (fmt.scale === undefined && Math.abs(value) >= 1e5) {
    const scale = Math.abs(value) >= 1e7 ? 'crore' : 'lakh'
    const n = Math.abs(value) / (scale === 'crore' ? 1e7 : 1e5)
    const d = n < 10 ? 2 : n < 100 ? 1 : 0
    // Drop trailing zeros: ₹6 lakh, not ₹6.00 lakh.
    const s = scaled(value, scale, decimalsOf(String(Number(n.toFixed(d)))))
    // Under a million the international reading is the plain number, not "157.14 thousand".
    const alt = Math.abs(value) < 1e6 ? (value < 0 ? '-' : '') + grouped(Math.abs(value), raw ? decimalsOf(raw) : 0, intl) : s.alt
    return { text: withUnit(s.text, fmt.unit, fmt.suffix), alt: alt && withUnit(alt, fmt.unit, fmt.suffix) }
  }
  if (fmt.scale && fmt.scale !== 'none') {
    const s = scaled(value, fmt.scale, fmt.decimals)
    return { text: withUnit(s.text, fmt.unit, fmt.suffix), alt: s.alt && withUnit(s.alt, fmt.unit, fmt.suffix) }
  }
  const d = fmt.decimals ?? (raw ? decimalsOf(raw) : Math.min(2, decimalsOf(String(value))))
  const sign = value < 0 ? '-' : fmt.signed && value > 0 ? '+' : ''
  const a = Math.abs(value)
  const text = withUnit(sign + grouped(a, d, indian), fmt.unit, fmt.suffix)
  const alt = withUnit(sign + grouped(a, d, intl), fmt.unit, fmt.suffix)
  return alt === text ? { text } : { text, alt }
}

/** The international unit for an axis that reaches `peak`: one unit on every tick. */
export interface IntlScale {
  per: number
  word: '' | ' million' | ' billion'
}
export const intlScale = (peak: number): IntlScale => (peak >= 1e9 ? { per: 1e9, word: ' billion' } : peak >= 1e6 ? { per: 1e6, word: ' million' } : { per: 1, word: '' })

/**
 * An axis tick: as formatNumber, but crore and lakh ticks print `d` decimals, so 20 crore, not 20.0.
 * The international form uses one unit for the whole axis (`i`) with its own decimals (`di`),
 * so an axis never reads 400, 800, 1.20 billion.
 */
export function formatTick(value: number, fmt: Format, d: number, i: IntlScale, di: number): Shown {
  if (!fmt.scale || fmt.scale === 'none') return formatNumber(value, fmt)
  const v = value * (fmt.multiply ?? 1)
  const indianText = withUnit(scaled(v, fmt.scale, d).text, fmt.unit, fmt.suffix)
  const intlText = withUnit(`${grouped(v / i.per, di, intl)}${i.word}`, fmt.unit, fmt.suffix)
  return intlFirst({ text: indianText, alt: intlText })
}

/** Plain text in the default (million) mode. */
export const fmt = (value: number, f?: Format, raw?: string): string => formatNumber(value, f, raw).text

/** 1st, 2nd, 3rd, 4th ... */
export function ordinal(n: number): string {
  const teen = n % 100 >= 11 && n % 100 <= 13
  return `${n}${teen ? 'th' : (['th', 'st', 'nd', 'rd'][n % 10] ?? 'th')}`
}
