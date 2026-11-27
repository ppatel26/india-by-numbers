/** Rangoli inks, built from the site tokens. Rangoli powder is bright and chalky on a lac ground. */
import { colors, pigments } from '~/lib/tokens'

/** Mix a hex colour toward white (w > 0) or black (w < 0). */
const mix = (hex: string, w: number): string => {
  const n = parseInt(hex.slice(1), 16)
  const to = w >= 0 ? 255 : 0
  const k = Math.abs(w)
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(v + (to - v) * k))
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

export const INKS: Readonly<Record<string, string>> = {
  white: colors.silver,
  haldi: pigments.economy.hex,
  kesar: pigments['religion-and-culture'].hex,
  'kesar-chalk': mix(pigments['religion-and-culture'].hex, 0.35),
  firozi: pigments['living-standards'].hex,
  manjistha: pigments.trade.hex,
  neel: pigments.transport.hex,
  dhani: pigments.agriculture.hex,
  banafsha: pigments['science-and-technology'].hex,
  khaki: pigments.defence.hex,
  'rani-chalk': mix(pigments.population.hex, 0.62),
  'jamuni-chalk': mix(pigments.elections.hex, 0.55),
  'mor-chalk': mix(pigments.climate.hex, 0.45),
  // Tone on tone: a darker and a lighter lac, for rangoli that read as texture, not colour.
  'lac-deep': mix(pigments.prices.hex, -0.35),
  'lac-light': mix(pigments.prices.hex, 0.3),
}
