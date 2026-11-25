/** Site-wide facts. Change CHECKED when a data check finishes. */
export const SITE = {
  name: 'India by Numbers',
  hindiName: 'आँकड़ों में भारत',
  tagline: "India's official statistics, checked and charted",
  /** The date we last checked every figure against its publisher. A chart's own `checked` date can be later. */
  checked: '2026-11-18',
  licence: 'Licence: text, charts and data files CC BY 4.0; code MIT. Publisher data stays under each publisher’s terms.',
  repo: 'https://github.com/ppatel26/india-by-numbers',
  author: { name: 'Parv', handle: '@patel_parv', url: 'https://x.com/patel_parv' },
  searchPlaceholder: 'Search charts, topics and states',
} as const

/** The day a chart was last checked against its publisher: its own date, else the site-wide one. */
export const checkedOf = (chart: { checked?: string }): string => chart.checked ?? SITE.checked

/** The latest check among these charts, for "Updated" lines that cover many charts. */
export const latestChecked = (list: readonly { checked?: string }[]): string =>
  list.reduce<string>((max, c) => (checkedOf(c) > max ? checkedOf(c) : max), SITE.checked)

/** Keep search engines out (robots meta and robots.txt), for example on a preview copy. */
export const NOINDEX = false

export const ogImagePath = (path: string): string => `/og${path === '/' ? '/home' : path.replace(/\/$/, '')}.png`
