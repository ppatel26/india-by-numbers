/** Site-wide facts. Change CHECKED when a data check finishes. */
export const SITE = {
  name: 'India by Numbers',
  hindiName: 'आँकड़ों में भारत',
  tagline: "India's official statistics, checked and charted",
  /** The date we last checked every figure against its publisher. */
  checked: '2026-11-17',
  licence: 'Licence: CC BY 4.0. Publisher data stays under each publisher’s terms.',
  repo: 'https://github.com/ppatel26/india-by-numbers',
  author: { name: 'Parv', handle: '@patel_parv', url: 'https://x.com/patel_parv' },
  searchPlaceholder: 'Search charts, topics and states',
} as const

/** Keep search engines out (robots meta and robots.txt), for example on a preview copy. */
export const NOINDEX = false

export const ogImagePath = (path: string): string => `/og${path === '/' ? '/home' : path.replace(/\/$/, '')}.png`
