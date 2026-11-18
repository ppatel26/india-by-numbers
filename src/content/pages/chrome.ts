// Site chrome: the kit nav and kit footer, the same on every board (S01 to S18).
// Labels are verbatim from the boards. The boards give no URLs: every href here is a proposed route.

export interface Link {
  label: string
  href: string
}

export interface FooterColumn {
  heading: string
  links: readonly Link[]
}

export interface Chrome {
  wordmark: string
  wordmarkHindi: string
  nav: readonly Link[]
  searchPlaceholder: string
  /** Number switch: Indian grouping or international. */
  numberSwitch: { lakhCrore: string; million: string }
  languageSwitch: { english: string; hindi: string }
  footer: {
    identity: string
    columns: readonly FooterColumn[]
    licence: string
    /** Footer base, right: "Checked 17 Nov 2026". */
    checked: (date: string) => string
  }
}

const chrome: Chrome = {
  wordmark: 'India by Numbers',
  wordmarkHindi: 'आँकड़ों में भारत',
  nav: [
    { label: 'Topics', href: '/topics/' },
    { label: 'States', href: '/states/' },
    { label: 'All charts', href: '/charts/' },
    { label: 'Sources', href: '/sources/' },
    { label: 'How we check', href: '/how-we-check/' },
  ],
  searchPlaceholder: 'Search charts, topics and states',
  numberSwitch: { lakhCrore: 'Lakh · crore', million: 'Million' },
  languageSwitch: { english: 'EN', hindi: 'हिंदी' },
  footer: {
    identity: 'An independent project. Not affiliated with the Government of India.',
    columns: [
      {
        heading: 'Topics',
        links: [
          { label: 'Population', href: '/topics/population/' },
          { label: 'Prices', href: '/topics/prices/' },
          { label: 'Economy', href: '/topics/economy/' },
          { label: 'Jobs', href: '/topics/jobs/' },
          { label: 'Health', href: '/topics/health/' },
          { label: 'Education', href: '/topics/education/' },
          { label: 'Elections', href: '/topics/elections/' },
          { label: 'Climate', href: '/topics/climate/' },
          { label: 'Religion and culture', href: '/topics/religion-and-culture/' },
        ],
      },
      {
        heading: 'States',
        links: [
          { label: 'All 36 states and UTs', href: '/states/' },
          { label: 'States (28)', href: '/states/#states' },
          { label: 'Union territories (8)', href: '/states/#union-territories' },
          { label: 'Choose your state', href: '/states/#a-to-z' },
        ],
      },
      {
        heading: 'About the data',
        links: [
          { label: 'How we check', href: '/how-we-check/' },
          { label: 'Sources', href: '/sources/' },
          { label: 'Releases', href: '/releases/' },
          { label: 'Corrections', href: '/releases/#corrections' },
          { label: 'All charts', href: '/charts/' },
        ],
      },
      {
        heading: 'Project',
        links: [
          { label: 'About', href: '/about/' },
          { label: 'Reuse and licence', href: '/about/#reuse' },
          { label: 'Report a problem', href: '/releases/#report' },
          // DECIDE: the board has no contact address yet. copy: no placeholder email.
          { label: 'Contact', href: '/about/#contact' },
          { label: 'हिंदी में पढ़ें', href: '/hi/' },
        ],
      },
    ],
    licence: "Licence: CC BY 4.0. Publisher data stays under each publisher's terms.",
    checked: (date) => `Checked ${date}`,
  },
}

export default chrome
