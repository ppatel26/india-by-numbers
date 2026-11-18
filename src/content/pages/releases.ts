// Copy for the Releases page. The corrections log is in corrections.ts.

import type { TopicSlug } from '../types'
import { count } from './counts'

export type ReleaseKind = 'New period' | 'Revision' | 'Method break' | 'Correction' | 'New chart'

export interface DueRow {
  date: string
  /** "Expected": a fixed monthly day, not announced. "Announced": the publisher gave the date. */
  certainty: 'Expected' | 'Announced'
  release: string
  detail: string
  charts: string
  topics: readonly TopicSlug[]
}

export interface ChangeRow {
  released: string
  release: string
  detail?: string
  kind: ReleaseKind
  charts: string
  topics: readonly TopicSlug[]
}

export interface ReleasesPage {
  breadcrumb: string
  title: string
  hindi: string
  /** For search engines and link previews; not shown on the page. */
  description: string
  feed: string
  checked: string
  dueNext: {
    eyebrow: string
    heading: string
    key: string
    heads: { date: string; release: string; charts: string }
    rows: readonly DueRow[]
  }
  changeLog: {
    eyebrow: string
    heading: string
    filters: { kindLabel: string; kinds: readonly string[]; topicLabel: string; allTopics: string }
    count: (n: number, from: string, to: string) => string
    heads: { released: string; release: string; kind: string; charts: string }
    rows: readonly ChangeRow[]
    footnote: string
  }
}

const releases: ReleasesPage = {
  breadcrumb: 'About the data / Releases and corrections',
  title: 'Releases and corrections',
  hindi: 'रिलीज़ और सुधार',
  description: 'New publisher releases, the releases due next, and our corrections, for India by Numbers.',
  feed: 'Feed (RSS)',
  checked: 'Page checked 18 Nov 2026',
  dueNext: {
    eyebrow: 'Upcoming',
    heading: 'Due next',
    key: 'Announced: the publisher has given the date. Expected: the publisher keeps a fixed day each month but has not announced this one.',
    heads: { date: 'Date', release: 'Release', charts: 'Charts it will update' },
    rows: [
      {
        date: '30 Nov 2026',
        certainty: 'Announced',
        release: 'MoSPI · IIP for October 2026',
        detail: "MoSPI's calendar gives 28 Nov, a Saturday, so it moves to the next working day.",
        charts: 'Industrial production growth · Industrial production by sector',
        topics: ['economy'],
      },
      {
        date: '30 Nov 2026',
        certainty: 'Announced',
        release: 'MoSPI · GDP for Q2 FY 2026-27 (Jul to Sep 2026)',
        detail: 'The second quarterly estimate of the year.',
        charts: 'Quarterly GDP growth',
        topics: ['economy'],
      },
      {
        date: '4 Dec 2026',
        certainty: 'Announced',
        release: 'RBI · Monetary Policy Committee decision',
        detail: 'The committee meets from 2 to 4 Dec 2026.',
        charts: 'RBI policy repo rate',
        topics: ['prices'],
      },
      {
        date: '14 Dec 2026',
        certainty: 'Announced',
        release: 'MoSPI · CPI for November 2026',
        detail: "MoSPI's calendar gives 12 Dec, a Saturday. Also makes October 2026 (6.09%) final.",
        charts:
          'Consumer price inflation since 2012 · Inflation by state · What is driving inflation · Inflation by spending division in 2026 · Rural and urban inflation',
        topics: ['prices'],
      },
      {
        date: '15 Dec 2026',
        certainty: 'Announced',
        release: 'MoSPI · PLFS monthly bulletin for November 2026',
        detail: 'Unemployment for November 2026.',
        charts: 'Unemployment rate, month by month',
        topics: ['jobs'],
      },
    ],
  },
  changeLog: {
    eyebrow: 'Change log · newest first',
    heading: 'What has changed?',
    filters: {
      kindLabel: 'Kind',
      kinds: ['All', 'New period', 'Revision', 'Method break', 'Correction'],
      topicLabel: 'Topic',
      allTopics: `All ${count.topics} topics`,
    },
    count: (n, from, to) => `${n} releases, ${from} to ${to}`,
    heads: { released: 'Released', release: 'Publisher and release', kind: 'Kind', charts: 'Charts updated' },
    rows: [
      {
        released: '16 Nov 2026',
        release: 'MoSPI · PLFS Monthly Bulletin, October 2026',
        detail: 'Unemployment 4.9% in Oct 2026, from 5.0% in Sep 2026.',
        kind: 'New period',
        charts: 'Unemployment rate, month by month',
        topics: ['jobs'],
      },
      {
        released: '12 Nov 2026',
        release: 'MoSPI · CPI for October 2026',
        detail: 'Inflation 6.09% (provisional). September 2026 now final at 5.54%.',
        kind: 'New period',
        charts:
          'Consumer price inflation since 2012 · Inflation by state · What is driving inflation · Inflation by spending division in 2026 · Rural and urban inflation',
        topics: ['prices'],
      },
      {
        released: '12 Nov 2026',
        release: 'MNRE · Renewable power capacity by state, as on 31 Oct 2026',
        kind: 'New period',
        charts: 'Renewable power capacity by state',
        topics: ['climate'],
      },
      {
        released: '10 Nov 2026',
        release: 'MoSPI · PLFS Quarterly Bulletin, Jul-Sep 2026',
        detail: 'Urban unemployment 6.8%.',
        kind: 'New period',
        charts: 'Urban unemployment since 2018',
        topics: ['jobs'],
      },
      {
        released: '28 Oct 2026',
        release: 'MoSPI (via PIB) · IIP for September 2026, quick estimate',
        detail: 'Growth 6.7%. August 2026 revised from 8.0% to 7.8%.',
        kind: 'Revision',
        charts: 'Industrial production, month by month',
        topics: ['economy'],
      },
      {
        released: '7 Oct 2026',
        release: "RBI · Governor's Statement",
        detail: 'Repo rate raised from 5.25% to 5.50%.',
        kind: 'New period',
        charts: 'The RBI policy repo rate since 2008',
        topics: ['prices'],
      },
      {
        released: '30 Sep 2026',
        release: 'IMD · 2026 southwest monsoon, end of season',
        detail: '759.4 mm, 87% of the long period average.',
        kind: 'New period',
        charts: 'Monsoon rainfall since 1901 · 2026 monsoon by subdivision · 2026 monsoon month by month',
        topics: ['climate'],
      },
      {
        released: '31 Aug 2026',
        release: 'MoSPI · GDP for Q1 FY 2026-27',
        detail: 'Growth 7.8%. 2022-23 to 2025-26 revised; 2024-25 now 7.2%.',
        kind: 'Revision',
        charts: 'Quarterly GDP growth · Annual GDP growth since 1951-52 · Farming, industry and services',
        topics: ['economy'],
      },
      {
        released: '31 Jul 2026',
        release: 'RBI · Handbook of Statistics on Indian Economy 2025-26',
        kind: 'New period',
        charts: 'Inflation over the long run · Rupees per US dollar since 1986-87 · Income per person by state',
        topics: ['prices', 'economy'],
      },
      {
        released: '8 Jul 2026',
        release: 'MoE · AISHE 2023-24',
        detail: 'College enrolment ratio 30.0.',
        kind: 'New period',
        charts: 'College enrolment ratio by state · College enrolment ratio over time',
        topics: ['education'],
      },
      {
        released: '7 Jul 2026',
        release: 'MoE · UDISE+ 2025-26',
        detail: '24.72 crore students, pre-primary to class 12.',
        kind: 'New period',
        charts: 'Children in school · Enrolment ratio by state · Dropout rate by state · Pupils per teacher · Electricity, toilets and internet in schools',
        topics: ['education'],
      },
      {
        released: '29 May 2026',
        release: 'IIPS for MoHFW · NFHS-6 (2023-24) fact sheets',
        detail: 'Provisional. Stunting 29.3%, from 35.5% in NFHS-5.',
        kind: 'New period',
        charts: 'Child nutrition and care by state',
        topics: ['health'],
      },
      {
        released: '20 May 2026',
        release: 'ORGI · SRS 2024: Bulletin and Statistical Report',
        detail: 'Infant mortality 24 per 1,000 live births. Maternal mortality 2022-24 and life tables 2020-24 also came out in May 2026.',
        kind: 'New period',
        charts:
          'Infant mortality since 1971 · Infant mortality by state · Maternal mortality · Life expectancy · Fertility rate by state · Birth and death rates by state · Sex ratio at birth',
        topics: ['health', 'population'],
      },
      {
        released: '8 May 2026',
        release: 'ECI · Assembly elections, May 2026',
        detail: 'Assam, Kerala, Tamil Nadu, West Bengal, Puducherry. Turnout provisional.',
        kind: 'New period',
        charts: 'State assembly elections, 2025 and 2026',
        topics: ['elections'],
      },
      {
        released: '29 Apr 2026',
        release: 'MoSPI · Women and Men in India 2025',
        detail: 'Election tables 1952 to 2024, from ECI data.',
        kind: 'New chart',
        charts: 'Lok Sabha turnout, men and women · Number of electors · Turnout by state, 2024 · Women candidates and MPs · Seats and women MPs by state',
        topics: ['elections'],
      },
      {
        released: '15 Apr 2026',
        release: 'MoSPI · State accounts, base 2011-12',
        detail: 'Release date as given in the RBI Handbook.',
        kind: 'New period',
        charts: 'Income per person by state · Economic growth by state',
        topics: ['economy'],
      },
      {
        released: '27 Mar 2026',
        release: 'MoSPI · PLFS Annual Report 2025',
        detail: 'The first annual report on calendar years, after the January 2025 design change.',
        kind: 'Method break',
        charts:
          'Labour force participation, by sex · Women in the labour force, by state · Unemployment by state · What kind of work people do · Jobs by industry · Youth unemployment · Literacy by state',
        topics: ['jobs', 'education'],
      },
      {
        released: '27 Feb 2026',
        release: 'MoSPI · National Accounts, new base 2022-23',
        detail: 'Years before 2022-23 stay on base 2011-12.',
        kind: 'Method break',
        charts: 'Quarterly GDP growth · Annual GDP growth since 1951-52 · Farming, industry and services',
        topics: ['economy'],
      },
      {
        released: '1 Jan 2026',
        release: 'IMD · Statement on the Climate of India during 2025',
        detail: '+0.28°C against the 1991-2020 average; the 8th warmest year since 1901.',
        kind: 'New period',
        charts: "India's warmest years · Temperature in 2025 by season",
        topics: ['climate'],
      },
    ],
    footnote:
      "Not in this list, because the publisher states no release date: CEA's Installed Capacity report as on 31 Oct 2026, which feeds charts on this site. Daily FBIL reference rates are not logged as releases.",
  },
}

export default releases
