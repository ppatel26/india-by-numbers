/**
 * Design tokens: the one source for colours. The site CSS reads them as
 * custom properties (see `tokenCss`), and chart exports (SVG, PNG, OG
 * images) replace `var(--name)` with the hex value (see `resolveVars`).
 * Values and contrast checks: docs/design-direction.md, "Colour system v2".
 */
import type { Color, TopicSlug } from '~/content/types'

export const colors = {
  paper: '#FFFFFF',
  ink: '#16181D',
  slate: '#555B68',
  rule: '#DCDAD6',
  band: '#F2F1EE',
  grid: '#ECEBE8',
  kajal: '#141211',
  'kajal-rule': '#3A3533',
  silver: '#FFFFFF',
  'silver-dim': '#E9E3E0',
  'on-light-dim': '#463C26',
  lac: '#99221F',
  other: '#C9CCD1',
  'other-line': '#9AA0A8',
  s1: '#CC2827',
  s2: '#00909C',
  s3: '#7233BB',
  s4: '#279662',
  s5: '#1C6DDA',
  s6: '#AA8726',
  s7: '#A11C6C',
  s8: '#C46C23',
  'seq-1': '#50C1C7',
  'seq-2': '#34A8AD',
  'seq-3': '#1F8E93',
  'seq-4': '#127479',
  'seq-5': '#0C5B5F',
  'seq-6': '#0D4346',
  'div-1': '#104A97',
  'div-2': '#246ED4',
  'div-3': '#72A0E3',
  'div-mid': '#E3E1DC',
  'div-5': '#E67B70',
  'div-6': '#C92F2C',
  'div-7': '#8E1717',
} as const

export type Token = keyof typeof colors

/** Topic pigments: hero grounds and topic tags. Never a data colour. */
export const pigments: Record<TopicSlug, { name: string; hex: string; text: 'light' | 'dark' }> = {
  prices: { name: 'lac', hex: '#99221F', text: 'light' },
  population: { name: 'rani', hex: '#902061', text: 'light' },
  elections: { name: 'jamuni', hex: '#6731A8', text: 'light' },
  education: { name: 'lapis', hex: '#1952A2', text: 'light' },
  climate: { name: 'mor', hex: '#1E6066', text: 'light' },
  health: { name: 'neem', hex: '#1E6534', text: 'light' },
  jobs: { name: 'mehendi', hex: '#4D5D1A', text: 'light' },
  economy: { name: 'haldi', hex: '#E5B736', text: 'dark' },
  'religion-and-culture': { name: 'kesar', hex: '#F48E2F', text: 'dark' },
}

export const seq = ['seq-1', 'seq-2', 'seq-3', 'seq-4', 'seq-5', 'seq-6'] as const satisfies readonly Token[]
/** Far below, below, a little below, near, a little above, above, far above. */
export const div = ['div-1', 'div-2', 'div-3', 'div-mid', 'div-5', 'div-6', 'div-7'] as const satisfies readonly Token[]

export const colorVar = (c: Color | Token): string => `var(--${c})`

const luminance = (hex: string): number => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
}

/** Text colour for a fill: white when it contrasts more than ink does. */
export function textOn(fill: Token): 'var(--paper)' | 'var(--ink)' {
  const l = luminance(colors[fill])
  const white = 1.05 / (l + 0.05)
  const ink = (l + 0.05) / (luminance(colors.ink) + 0.05)
  return white > ink ? 'var(--paper)' : 'var(--ink)'
}

export const tokenCss = (): string =>
  `:root{${Object.entries(colors)
    .map(([k, v]) => `--${k}:${v}`)
    .join(';')}}`

/** Replace CSS variables with hex values, for SVG and PNG files. */
export const resolveVars = (svg: string): string =>
  svg.replace(/var\(--([a-z0-9-]+)\)/g, (m, name: string) => (colors as Record<string, string>)[name] ?? m)
