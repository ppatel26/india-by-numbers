/**
 * Number display. Lakh and crore by default, with Indian digit grouping;
 * the "Million" switch shows the international form. `formatNumber` returns
 * both, and the page script swaps them (see src/scripts/numbers.ts).
 */
import type { Format } from '~/content/types'

export interface Shown {
  text: string
  /** The million-mode text, when it differs. */
  alt?: string
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
    const alt = Math.abs(n) >= 1e6 ? `${(n / 1e6).toFixed(d + 1)} million` : `${grouped(n / 1e3, d, intl)} thousand`
    return { text, alt }
  }
  throw new Error(`Unknown scale ${scale}`)
}

const withUnit = (s: string, unit: Format['unit'], suffix = ''): string =>
  (unit === '₹' ? `₹${s}` : unit === 'pp' ? `${s} pp` : `${s}${unit ?? ''}`) + suffix

/**
 * Format a value. Pass the published string as `raw` to keep the publisher's
 * digits; computed values pass a number and `decimals`.
 */
export function formatNumber(value: number, fmt: Format = {}, raw?: string): Shown {
  if (fmt.multiply) return formatNumber(value * fmt.multiply, { ...fmt, multiply: undefined })
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

/** An axis tick: as formatNumber, but crore and lakh ticks print `d` decimals, so 20 crore, not 20.0. */
export function formatTick(value: number, fmt: Format, d: number): Shown {
  if (!fmt.scale || fmt.scale === 'none') return formatNumber(value, fmt)
  const s = scaled(value * (fmt.multiply ?? 1), fmt.scale, d)
  return { text: withUnit(s.text, fmt.unit, fmt.suffix), alt: s.alt && withUnit(s.alt, fmt.unit, fmt.suffix) }
}

/** Plain text in the default (lakh and crore) mode. */
export const fmt = (value: number, f?: Format, raw?: string): string => formatNumber(value, f, raw).text

/** 1st, 2nd, 3rd, 4th ... */
export function ordinal(n: number): string {
  const teen = n % 100 >= 11 && n % 100 <= 13
  return `${n}${teen ? 'th' : (['th', 'st', 'nd', 'rd'][n % 10] ?? 'th')}`
}
