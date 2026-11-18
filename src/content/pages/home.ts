// Home. Copy is verbatim from the board.
// The ledger figures, the topic tiles and the state pairs are built from data and topic modules.
// This file records which chart each row reads. `// CHECK SLUG` marks a slug in a topic module
// that this module does not own: the slug is a guess.

import type { TopicSlug } from '../types'

export interface Section {
  heading: string
  body: string
}

export interface LedgerRow {
  topic: TopicSlug
  /** Chart slug the figure is read from. */
  chart: string
  series?: string
  x?: string
  /** Measure line, as on the board. The build fills the value from data. */
  measure: string
  /** Comparison line, as on the board. Its numbers come from the same chart. */
  compare: string
  /** "Released 17 Nov 2026" or "Announced 7 Oct 2026". */
  released: string
}

export interface StatePair {
  chart: string
  series?: string
  label: string
  /** Office · unit · status, as on the board. */
  meta: string
}

export interface Home {
  eyebrow: string
  title: string
  standfirst: string
  search: { placeholder: string; key: string; tryLabel: string; tryTerms: readonly string[] }
  newest: { heading: string; intro: string; checked: string; link: string; rows: readonly LedgerRow[] }
  browse: { heading: string; intro: string; link: string; tileChartsLabel: (n: number) => string }
  comingLater: { label: string; topics: readonly string[] }
  stateBeside: {
    heading: string
    intro: string
    pickerLabel: string
    defaultState: string
    legendNote: string
    pairs: readonly StatePair[]
    note: string
    sources: string
    map: {
      eyebrow: string
      text: (p: { state: string; rank: string; of: number; measure: string; above: string }) => string
      selected: (state: string) => string
      ut: string
      profileLink: (state: string) => string
      allLink: string
    }
  }
  howWeCheck: { eyebrow: string; heading: string; body: string; link: string; steps: readonly Section[] }
}

const home: Home = {
  eyebrow: "India's official statistics, checked and charted",
  title: 'India, counted.',
  standfirst: 'Every figure carries its publisher, its period and the date we checked it.',
  search: {
    // The counts (9, 69, 36) are live counts on the built site.
    placeholder: 'Search 9 topics, 69 charts and 36 states and UTs',
    key: '/',
    tryLabel: 'Try',
    tryTerms: ['Inflation by state, October 2026', 'Youth unemployment', 'Monsoon rainfall since 1901'],
  },
  newest: {
    heading: 'Newest figures',
    intro: 'The latest headline number from each release, newest release first.',
    checked: 'Checked 17 Nov 2026',
    link: 'All releases',
    // Board order: newest release first.
    rows: [
      {
        topic: 'economy',
        chart: 'usd-inr-daily',
        measure: 'Rupees per US dollar, 17 November 2026',
        compare: 'Down from ₹94.12 on 16 November · FBIL reference rate',
        released: 'Released 17 Nov 2026',
      },
      {
        topic: 'jobs',
        chart: 'unemployment-rate-monthly',
        measure: 'Unemployment rate, age 15 and over, October 2026',
        compare: 'Down from 5.0% in September 2026 · current weekly status',
        released: 'Released 16 Nov 2026',
      },
      {
        topic: 'prices',
        chart: 'cpi-inflation',
        measure: 'Consumer price inflation, October 2026',
        compare: 'Up from 5.54% in September 2026',
        released: 'Released 12 Nov 2026',
      },
      {
        topic: 'economy',
        chart: 'iip-growth',
        measure: 'Industrial production growth, September 2026',
        compare: 'Down from 7.8% in August 2026 · quick estimate, base 2022-23',
        released: 'Released 28 Oct 2026',
      },
      {
        topic: 'prices',
        chart: 'repo-rate',
        measure: 'RBI policy repo rate, from 7 October 2026',
        compare: 'Up 0.25 percentage points from 5.25%',
        released: 'Announced 7 Oct 2026',
      },
      {
        topic: 'climate',
        chart: 'monsoon-rainfall',
        measure: 'Monsoon rainfall, June to September 2026',
        compare: '759.4 mm against a long-period average of 868.6 mm (1971 to 2020) · 13th lowest since 1901',
        released: 'Released 30 Sep 2026',
      },
      {
        topic: 'economy',
        chart: 'gdp-growth-quarterly',
        measure: 'Real GDP growth, Q1 FY 2026-27 (Apr to Jun 2026)',
        compare: 'Up from 6.9% a year earlier · base 2022-23',
        released: 'Released 31 Aug 2026',
      },
      {
        // In src/content/topics/health.ts: bars chart, series 'nfhs6', category 'stunted'.
        topic: 'health',
        chart: 'child-nutrition',
        series: 'nfhs6',
        x: 'stunted',
        measure: 'Children under 5 who are stunted, NFHS-6 (2023-24)',
        compare: 'Down from 35.5% in NFHS-5 (2019-21) · provisional fact sheet',
        released: 'Released 29 May 2026',
      },
    ],
  },
  browse: {
    heading: 'Browse by topic',
    intro: 'Nine topics, 69 charts. Each topic page answers a few plain questions with charts, tables and sources.',
    link: 'All topics',
    tileChartsLabel: (n) => `${n} charts`,
  },
  comingLater: {
    label: 'Coming later',
    topics: [
      'Public finance',
      'Energy',
      'Air quality',
      'Crime',
      'Housing and water',
      'Agriculture',
      'Migration',
      'Trade',
      'Poverty and inequality',
      'Transport',
    ],
  },
  stateBeside: {
    heading: 'Your state beside India',
    intro: "Choose a state or union territory. Its latest figures sit next to India's, on every topic.",
    pickerLabel: 'State',
    defaultState: 'tamil-nadu',
    legendNote: 'Bars start at zero · each row on its own scale',
    pairs: [
      { chart: 'cpi-inflation-by-state', label: 'Inflation, October 2026', meta: 'MoSPI · % y/y · Provisional' },
      { chart: 'income-per-person-by-state', label: 'Income per person, FY 2024-25', meta: 'MoSPI, RBI · ₹ · current prices' },
      // In src/content/topics/health.ts.
      { chart: 'infant-mortality-by-state', label: 'Infant mortality, 2024', meta: 'ORGI SRS · deaths per 1,000 live births · Survey estimate' },
      { chart: 'women-labour-force-by-state', label: 'Women in the labour force, 2025, usual status', meta: 'MoSPI PLFS · % of women 15+ · Survey estimate' },
      // In src/content/topics/elections.ts.
      { chart: 'lok-sabha-turnout-by-state', label: 'Turnout, Lok Sabha 2024', meta: 'ECI via MoSPI · % of electors' },
      { chart: 'fertility-rate-by-state', label: 'Fertility rate, 2024', meta: 'ORGI SRS · children per woman · Survey estimate' },
    ],
    note: "Note: Income per person compares each state's net state domestic product per person with India's net national income per person, both base 2011-12. Women in the labour force uses usual status, age 15+, and is a survey estimate. Inflation for October 2026 is provisional.",
    sources:
      'Sources: MoSPI CPI release, 12 Nov 2026; MoSPI state accounts and RBI Handbook 2025-26; SRS Bulletin 2024; PLFS Annual Report 2025; Women and Men in India 2025 (ECI data); SRS Statistical Report 2024.',
    map: {
      eyebrow: '36 states and union territories',
      // Board: "Each tile opens a state profile. Tamil Nadu ranks 3rd of 36 for inflation in October
      // 2026, after Puducherry and Dadra and Nagar Haveli and Daman and Diu."
      text: ({ state, rank, of, measure, above }) =>
        `Each tile opens a state profile. ${state} ranks ${rank} of ${of} for ${measure}, after ${above}.`,
      selected: (state) => `${state}, selected`,
      ut: 'Union territory',
      profileLink: (state) => `See the ${state} profile`,
      allLink: 'All 36 states and UTs',
    },
  },
  howWeCheck: {
    eyebrow: 'How we check',
    heading: 'You should not have to take our word for it',
    body: 'Every number on this site comes from a release that a government office published. We keep the file, show what changed, and stamp each figure with a hallmark.',
    link: 'Read how we check',
    steps: [
      {
        heading: '1 · Fetch',
        body: 'We store each release file as the publisher put it out, with its web address, the time we fetched it and a checksum.',
      },
      {
        heading: '2 · Compare',
        body: 'A parser reads the file. A diff shows every new period and every revised value next to the old one.',
      },
      {
        heading: '3 · Review',
        body: 'A person checks each change against the release document. Nothing publishes on its own.',
      },
      {
        heading: '4 · Hallmark',
        body: 'Each figure carries four punches: the office, the unit, the date we checked it and the period. Provisional, survey and method-break figures say so.',
      },
    ],
  },
}

export default home
