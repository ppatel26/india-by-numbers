// Copy for the Sources page: one block per publisher.

import type { TopicSlug } from '../types'
import { count } from './counts'

export interface Publisher {
  short: string
  full: string
  /** Charts that use this publisher, counted from the chart sources. */
  charts: number
  topics: readonly TopicSlug[]
  whatWeTake: string
  /** null when the publisher states no rhythm. */
  rhythm: string | null
  latestRelease: string
  licence: string
  howItPublishes: string
  site: string
}

export interface NotUsed {
  source: string
  why: string
}

export interface SourcesPage {
  breadcrumb: string
  title: string
  hindi: string
  intro: string
  checked: string
  summary: { finding: string; licence: string }
  chart: { number: string; title: string; subtitle: string; note: string }
  publishers: { eyebrow: string; heading: string; labels: { charts: (n: number) => string; whatWeTake: string; rhythm: string; latest: string; licence: string; how: string }; list: readonly Publisher[] }
  notUsed: { eyebrow: string; heading: string; heads: { source: string; why: string }; rows: readonly NotUsed[] }
}

const PUBLISHERS: readonly Publisher[] = [
  {
    short: 'MoSPI',
    full: 'National Statistics Office (NSO), Ministry of Statistics and Programme Implementation',
    charts: 26,
    topics: ['prices', 'economy', 'jobs', 'education', 'elections'],
    whatWeTake:
      'Consumer Price Index (base 2012=100 to Dec 2025, base 2024=100 from Jan 2026); National Accounts (GDP, GVA, state income); Index of Industrial Production; Periodic Labour Force Survey (monthly, quarterly, annual); Women and Men in India 2025 (election tables).',
    rhythm: 'CPI monthly. IIP monthly, on the 28th. PLFS monthly and quarterly bulletins and an annual report. GDP quarterly, with annual revisions.',
    latestRelease:
      'PLFS Monthly Bulletin, October 2026, released 16 Nov 2026. Also CPI for October 2026 (12 Nov 2026) and IIP for September 2026 (28 Oct 2026).',
    licence: "Not stated on the publisher's site.",
    howItPublishes:
      'The eSankhyiki API (api.mospi.gov.in) for CPI, GDP, IIP and PLFS, and a press note with each release. The API has no PLFS monthly figure for March 2026; the press note gives it.',
    site: 'https://api.mospi.gov.in',
  },
  {
    short: 'ORGI',
    full: 'Office of the Registrar General and Census Commissioner, India: Census of India and Sample Registration System',
    charts: 19,
    topics: ['population', 'health', 'education', 'religion-and-culture'],
    whatWeTake:
      'Census 2011 tables A-01, A-02, C-01, C-14, C-16 and the Primary Census Abstract; Census 2001 table C-01; SRS Bulletin and Statistical Report 2024; SRS maternal mortality bulletin 2022-24; SRS abridged life tables 2020-24.',
    rhythm: 'Census at each count. Census 2027 door-to-door counting runs to 28 Feb 2027 in most states. SRS yearly.',
    latestRelease: 'SRS Statistical Report 2024 and SRS Bulletin 2024, 20 May 2026.',
    licence: 'No licence stated. The catalogue pages say "Rights Reserved".',
    howItPublishes:
      'Census tables and reports on censusindia.gov.in. Census 2011 is the latest full count, so every Census figure shows its year.',
    site: 'https://censusindia.gov.in',
  },
  {
    short: 'MoE',
    full: 'Ministry of Education: UDISE+ (Department of School Education and Literacy) and AISHE (Department of Higher Education)',
    charts: 7,
    topics: ['education'],
    whatWeTake:
      'UDISE+ booklets for 2021-22 to 2025-26 (existing structure); AISHE final report 2023-24 and the AISHE enrolment ratio time series from 2011-12.',
    rhythm: 'UDISE+ yearly. AISHE yearly, about two years behind the academic year it covers.',
    latestRelease: 'UDISE+ 2025-26, 7 Jul 2026. AISHE 2023-24, 8 Jul 2026.',
    licence: "Not stated on the publisher's site.",
    howItPublishes:
      'UDISE+ booklets for schools (udiseplus.gov.in) and AISHE reports for higher education (aishe.gov.in). The latest AISHE report covers 2023-24 and came out on 8 July 2026.',
    site: 'https://udiseplus.gov.in',
  },
  {
    short: 'RBI',
    full: 'Reserve Bank of India',
    charts: 5,
    topics: ['prices', 'economy'],
    whatWeTake:
      'Policy repo rate; Handbook of Statistics on Indian Economy 2025-26, tables 9, 10, 40, 133 and 236. Table 236 carries CPI series from the Labour Bureau (via RBI) and NSO. FBIL (via RBI): reference rate for the US dollar.',
    rhythm: 'Repo rate at each Monetary Policy Committee meeting. Handbook yearly. Reference rate each working day.',
    latestRelease: "Governor's Statement, 7 Oct 2026 (repo rate raised to 5.50%). FBIL (via RBI) reference rate for 18 Nov 2026: ₹93.36 per US$.",
    licence: "Not stated on the publisher's site.",
    howItPublishes:
      'Handbook tables in Excel (rbidocs.rbi.org.in), policy statements on rbi.org.in, and the FBIL (via RBI) reference rate for each working day.',
    site: 'https://www.rbi.org.in',
  },
  {
    short: 'IMD',
    full: 'India Meteorological Department, Ministry of Earth Sciences',
    charts: 5,
    topics: ['climate'],
    whatWeTake:
      'All-India monsoon rainfall, 1901 to 2026 (IMD Pune); the 2026 monsoon by subdivision and by month; the Statement on the Climate of India during 2025.',
    rhythm: 'Monsoon report at the end of each season. Climate statement each January.',
    latestRelease: 'Salient features of the 2026 southwest monsoon, 30 Sep 2026.',
    licence: "Not stated on the publisher's site.",
    howItPublishes:
      'IMD publishes monsoon rainfall by meteorological subdivision, not by state, in its daily weather report. The 2026 season table is an image. Several states have more than one subdivision.',
    site: 'https://mausam.imd.gov.in',
  },
  {
    short: 'ECI',
    full: 'Election Commission of India',
    charts: 3,
    topics: ['elections'],
    whatWeTake:
      'General election 2024 statistical reports 20 and 33; results pages for June 2024, February 2025, November 2025 and May 2026; Tamil Nadu 2026 detailed results.',
    rhythm: 'After each election.',
    latestRelease: 'Assembly election results, May 2026: results pages last updated 5 May 2026; statistical reports published 8 May 2026.',
    licence: "Not stated on the publisher's site.",
    howItPublishes:
      "Results on results.eci.gov.in and statistical reports as PDF on eci.gov.in. Each source line gives the original ECI address. Five more election charts use ECI data through MoSPI's Women and Men in India 2025.",
    site: 'https://www.eci.gov.in',
  },
  {
    short: 'PIB',
    full: 'Press Information Bureau, Government of India',
    charts: 3,
    topics: ['economy', 'health', 'elections'],
    whatWeTake:
      'Press releases that carry figures for other offices: the IIP quick estimate for September 2026 (MoSPI); state election turnout (ECI); NFHS-5 anaemia by state (a Lok Sabha reply of 17 Dec 2021).',
    rhythm: "With each ministry's release.",
    latestRelease: 'Quick estimates of IIP for September 2026, 28 Oct 2026.',
    licence: "Not stated on the publisher's site.",
    howItPublishes: 'Press releases for every ministry on pib.gov.in. The release of 29 May 2026 gives the NFHS-6 India values.',
    site: 'https://www.pib.gov.in',
  },
  {
    short: 'CEA',
    full: 'Central Electricity Authority',
    charts: 2,
    topics: ['climate'],
    whatWeTake: 'Installed Capacity reports: the March edition of each year from 2014 to 2026, and the report as on 31 Oct 2026.',
    rhythm: 'Monthly.',
    latestRelease: 'Installed Capacity as on 31 Oct 2026. CEA gives no release date for it.',
    licence: "Not stated on the publisher's site.",
    howItPublishes: 'Monthly installed capacity reports on cea.nic.in, in PDF and Excel.',
    site: 'https://cea.nic.in',
  },
  {
    short: 'MoHFW and IIPS',
    full: 'Ministry of Health and Family Welfare: National Family Health Survey (run by the International Institute for Population Sciences) and National Health Accounts (NHSRC)',
    charts: 2,
    topics: ['health'],
    whatWeTake:
      'NFHS-6 (2023-24) India and state fact sheets, provisional, which print NFHS-5 (2019-21) beside them; National Health Accounts Estimates for India 2023-24.',
    rhythm: 'NFHS rounds come several years apart.',
    latestRelease:
      'NFHS-6 fact sheets, 29 May 2026. National Health Accounts 2023-24, released by 15 Nov 2026 (PIB).',
    licence: "Not stated on the publisher's site.",
    howItPublishes: 'NFHS-6 fact sheets on nfhsiips.in, for India and each state. They print the NFHS-5 value beside each NFHS-6 value.',
    site: 'https://www.nfhsiips.in',
  },
  {
    short: 'MNRE',
    full: 'Ministry of New and Renewable Energy',
    charts: 1,
    topics: ['climate'],
    whatWeTake: 'State-wise installed capacity of renewable power, by location, as on 31 Oct 2026.',
    rhythm: 'A state-wise capacity table each month.',
    latestRelease: 'Table as on 31 Oct 2026, published 12 Nov 2026.',
    licence: "Not stated on the publisher's site.",
    howItPublishes: 'A state-wise table of renewable capacity, as PDF on mnre.gov.in, published 12 November 2026.',
    site: 'https://mnre.gov.in',
  },
  {
    short: 'NCP, MoHFW',
    full: 'National Commission on Population, MoHFW: Technical Group on Population Projections',
    charts: 1,
    topics: ['population'],
    whatWeTake: 'Population projections for India and the states, 2011 to 2036. We show them as Projection.',
    rhythm: 'One report. No update announced.',
    latestRelease: 'Report dated July 2020 (file uploaded October 2025).',
    licence: "Not stated on the publisher's site.",
    howItPublishes:
      'The Technical Group report on population projections, on mohfw-dohfw.gov.in and linked from censusindia.gov.in. The report predates SRS data for 2020 onward.',
    site: 'https://mohfw-dohfw.gov.in',
  },
]

const sources: SourcesPage = {
  breadcrumb: 'About the data / Sources',
  title: 'Sources',
  hindi: 'स्रोत',
  intro: `Every figure on this site comes from one of these ${PUBLISHERS.length} publishers. The first release has ${count.charts} charts.`,
  checked: 'Page checked 18 Nov 2026',
  summary: {
    finding: `Two offices, MoSPI and ORGI, supply the data for most of the ${count.charts} charts. Some charts combine two publishers, so the bars add up to more than ${count.charts}.`,
    licence:
      `None of the ${PUBLISHERS.length} publishers states an open reuse licence. ORGI's catalogue says "Rights Reserved". Publisher data stays under each publisher's terms.`,
  },
  // A horizontal bar chart of charts by publisher. The Sources page counts the bars from the
  // source lines of every chart at build time.
  chart: {
    number: '1.1',
    title: 'Charts that use each publisher',
    subtitle: 'Number of charts in release 1, by publisher of the release each chart uses, 18 Nov 2026',
    note: "Note: Derived. We count the publisher on the source line of each chart. Five election charts use MoSPI's tables of ECI data and count under MoSPI. Source: India by Numbers, chart register, 18 Nov 2026. Checked 18 Nov 2026.",
  },
  publishers: {
    eyebrow: 'Publishers, by number of charts',
    heading: 'Who publishes the data we use?',
    labels: {
      charts: (n) => (n === 1 ? 'chart uses it' : 'charts use it'),
      whatWeTake: 'What we take',
      rhythm: 'Release rhythm',
      latest: 'Latest release used',
      licence: 'Licence',
      how: 'How it publishes',
    },
    list: PUBLISHERS,
  },
  notUsed: {
    eyebrow: 'Checked and left out',
    heading: 'Which sources do we not use?',
    heads: { source: 'Source', why: 'Why we do not use it' },
    rows: [
      {
        source: 'Open Government Data (data.gov.in)',
        why: "It republishes files from other offices. We take each file from the publisher's own release page.",
      },
      {
        source: 'NITI Aayog, NDAP (ndap.niti.gov.in)',
        why: "It republishes other offices' data. We take each figure from the office that first released it.",
      },
      {
        source: 'NFHS-5 fact sheets (rchiips.org)',
        why: 'The NFHS-6 fact sheets print the NFHS-5 value beside each NFHS-6 value, so most NFHS-5 values come from them.',
      },
      {
        source: "India's 4th Biennial Update Report (unfccc.int)",
        why: 'Not in release 1. Per-person CO2 emissions from this report come in a later release.',
      },
      {
        source: 'MoSPI, EnviStats India 2025',
        why: 'A scanned PDF with a chart and no table of values.',
      },
      {
        source: 'News reports of official figures',
        why: 'Not a release. Example: All India Radio reported a 60.54% turnout for the Delhi 2025 election. We found no ECI release for it, so we leave it out and show "No data".',
      },
    ],
  },
}

export default sources
