/**
 * A tagged template for SVG and HTML strings. Interpolated strings are
 * escaped; `Markup` values and arrays of them are inserted as they are.
 * Charts are strings so the same code makes the page view, the SVG and PNG
 * files and the social images.
 */
export class Markup {
  constructor(readonly html: string) {}
  toString(): string {
    return this.html
  }
}

const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
export const escape = (s: string): string => s.replace(/[&<>"']/g, (c) => ESC[c]!)

type Value = Markup | string | number | boolean | null | undefined | readonly Value[]

function part(v: Value): string {
  if (v === null || v === undefined || v === false || v === true) return ''
  if (v instanceof Markup) return v.html
  if (Array.isArray(v)) return v.map(part).join('')
  if (typeof v === 'number') return String(Math.round(v * 100) / 100)
  return escape(v as string)
}

export function svg(strings: TemplateStringsArray, ...values: Value[]): Markup {
  let out = strings[0]!
  values.forEach((v, i) => (out += part(v) + strings[i + 1]!))
  return new Markup(out)
}

/** Optional attribute: attr('data-alt', alt) -> ` data-alt="..."` or nothing. */
export const attr = (name: string, value: string | number | undefined | null): Markup =>
  new Markup(value === undefined || value === null || value === '' ? '' : ` ${name}="${part(value)}"`)

/** Width and height of an SVG string's root. */
export function sizeOf(s: string): { w: number; h: number } {
  const m = s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)
  if (!m) throw new Error('No viewBox')
  return { w: +m[1]!, h: +m[2]! }
}

/** Put an SVG inside another at (x, y), scaled to `width`. */
export function embed(inner: string, x: number, y: number, width: number): { el: Markup; height: number } {
  const { w, h } = sizeOf(inner)
  const height = (h * width) / w
  const body = inner.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')
  return { el: svg`<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="0 0 ${w} ${h}">${new Markup(body)}</svg>`, height }
}
