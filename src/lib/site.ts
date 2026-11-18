/** Site-wide facts. Change CHECKED when a data check finishes. */
export const SITE = {
  name: 'India by Numbers',
  hindiName: 'आँकड़ों में भारत',
  tagline: "India's official statistics, checked and charted",
  /** The date we last checked every figure against its publisher. */
  checked: '2026-11-17',
  licence: 'Licence: CC BY 4.0. Publisher data stays under each publisher’s terms.',
  repo: 'https://github.com/ppatel26/india-by-numbers',
  searchPlaceholder: 'Search charts, topics and states',
} as const

/**
 * Keep search engines out until the site has its own domain. Also set in
 * public/_headers (X-Robots-Tag) and src/pages/robots.txt.ts.
 */
export const NOINDEX = true

export const ogImagePath = (path: string): string => `/og${path === '/' ? '/home' : path.replace(/\/$/, '')}.png`
