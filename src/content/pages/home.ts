// Copy for the home page. Figures are read from the charts named here.

import type { TopicSlug } from '../types'
import { count } from './counts'

export interface LedgerRow {
  topic: TopicSlug
  /** Chart slug the figure is read from. */
  chart: string
  series?: string
  x?: string
  /** Measure line. The value comes from the chart. */
  measure: string
  /** Comparison line. Its numbers come from the same chart. */
  compare: string
  /** "Released 17 Nov 2026" or "Announced 7 Oct 2026". */
  released: string
}

export interface StatePair {
  chart: string
  series?: string
  label: string
  /** Office · unit · status. */
  meta: string
}

export interface Home {
  title: string
  /** For search engines and link previews; not shown on the page. */
  description: string
  search: { placeholder: string; key: string; tryLabel: string; tryTerms: readonly string[] }
  newest: { heading: string; checked: string; link: string; rows: readonly LedgerRow[] }
  browse: { heading: string; link: string; tileChartsLabel: (n: number) => string }
  comingLater: { label: string; topics: readonly string[] }
  stateBeside: {
    heading: string
    pickerLabel: string
    defaultState: string
    legendNote: string
    pairs: readonly StatePair[]
    note: string
    sources: string
    map: {
      eyebrow: string
      /** The chosen state's rank on the first pair, e.g. "3rd highest of 36". */
      text: (p: { state: string; rank: string }) => string
      /** Before and after the state's name in the profile link. */
      profileLink: readonly [string, string]
      allLink: string
    }
  }
}

const home: Home = {
  title: "Charts of India's official statistics",
  description: "Charts of India's official statistics, for India and its 36 states and union territories: prices, the economy, jobs, population, health, education, elections, climate, and religion and culture.",
  search: {
    placeholder: 'Search charts, topics and states',
    key: '/',
    tryLabel: 'Try',
    tryTerms: ['Inflation by state, October 2026', 'Youth unemployment', 'Monsoon rainfall since 1901'],
  },
  newest: {
    heading: 'Newest figures',
    checked: 'Checked 18 Nov 2026',
    link: 'All releases',
    rows: [
      {
        topic: 'economy',
        chart: 'usd-inr-daily',
        measure: 'Rupees per US dollar, 18 November 2026',
        compare: 'Down from ₹93.57 on 17 November · FBIL reference rate',
        released: 'Released 18 Nov 2026',
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
    pickerLabel: 'State',
    defaultState: 'tamil-nadu',
    legendNote: 'Bars start at zero · each row on its own scale',
    pairs: [
      { chart: 'cpi-inflation-by-state', label: 'Inflation, October 2026', meta: '% y/y · Provisional' },
      { chart: 'income-per-person-by-state', label: 'Income per person, FY 2024-25', meta: '₹ a year · current prices' },
      // In src/content/topics/health.ts.
      { chart: 'infant-mortality-by-state', label: 'Infant mortality, 2024', meta: 'per 1,000 live births · Survey estimate' },
      { chart: 'women-labour-force-by-state', label: 'Women in the labour force, 2025', meta: '% of women 15+ · Survey estimate' },
      // In src/content/topics/elections.ts.
      { chart: 'lok-sabha-turnout-by-state', label: 'Lok Sabha turnout, 2024', meta: '% of electors' },
      { chart: 'fertility-rate-by-state', label: 'Fertility rate, 2024', meta: 'children per woman · Survey estimate' },
    ],
    note: 'Income per person: net state domestic product for a state, net national income for India.',
    sources: 'Sources: MoSPI (CPI, state accounts, PLFS, ECI turnout), RBI, ORGI (SRS).',
    map: {
      eyebrow: `${count.places} states and UTs`,
      text: ({ state, rank }) => `${state}: ${rank} for inflation, October 2026.`,
      profileLink: ['Open the ', ' page'],
      allLink: `All ${count.places} states and UTs`,
    },
  },
}

export default home
