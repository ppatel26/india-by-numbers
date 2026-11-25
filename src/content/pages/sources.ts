// Copy for the Sources page: one block per publisher.

import type { TopicSlug } from '../types'
import { count } from './counts'

export interface DataSet {
  name: string
  detail: string
  /** How often the publisher releases it. */
  rhythm: string
  /** Picks this data set's releases out of the publisher's chart sources, for "latest used". */
  match: RegExp
}

export interface Publisher {
  short: string
  /** Logo files in public/logos/, without extension (sources: pipeline/logos/README.md). */
  logos: readonly string[]
  full: string
  topics: readonly TopicSlug[]
  dataSets: readonly DataSet[]
  licence: string
  /** Where and in what form it publishes, one item each. */
  access: readonly string[]
  /** One caveat a reader needs, if any. */
  note?: string
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
  /** For search engines and link previews; not shown on the page. */
  description: string
  checked: string
  summary: { finding: string; licence: string }
  chart: { number: string; title: string; subtitle: string; note: string }
  publishers: {
    eyebrow: string
    heading: string
    /** Under the heading: whose the logos are. */
    logoNote: string
    labels: {
      charts: (n: number) => string
      dataSet: string
      detail: string
      rhythm: string
      latest: string
      notStated: string
      licence: string
      access: string
      site: string
    }
    list: readonly Publisher[]
  }
  notUsed: { eyebrow: string; heading: string; heads: { source: string; why: string }; rows: readonly NotUsed[] }
}

const NOT_STATED = 'Not stated'

const PUBLISHERS: readonly Publisher[] = [
  {
    short: 'MoSPI',
    logos: ['mospi'],
    full: 'National Statistics Office (NSO), Ministry of Statistics and Programme Implementation',
    topics: ['prices', 'economy', 'jobs', 'living-standards', 'health', 'education', 'elections', 'transport'],
    dataSets: [
      { name: 'Consumer Price Index', detail: 'Base 2012=100 to Dec 2025; base 2024=100 from Jan 2026', rhythm: 'Monthly, on the 12th', match: /Consumer Price Index|CPI/ },
      { name: 'National Accounts', detail: 'GDP, GVA and state income', rhythm: 'Quarterly, with annual revisions', match: /National Accounts|GDP|state accounts/ },
      { name: 'Index of Industrial Production', detail: 'Base 2011-12 and base 2022-23', rhythm: 'Monthly, on the 28th', match: /Industrial Production/ },
      { name: 'Periodic Labour Force Survey', detail: 'Monthly and quarterly bulletins, annual report', rhythm: 'Monthly, quarterly and yearly', match: /PLFS/ },
      { name: 'Time Use Survey', detail: 'Reports for 2019 and 2024', rhythm: 'Two rounds so far, 2019 and 2024', match: /Time Use/ },
      { name: 'Women and Men in India', detail: 'Election tables, from ECI data', rhythm: 'Yearly', match: /Women and Men in India/ },
      { name: 'NSS education surveys', detail: 'CMS: Education 2025 (round 80) and CAMS 2022-23 (round 79)', rhythm: 'One-off survey rounds', match: /CMS: Education|CAMS/ },
      { name: 'Household Consumption Expenditure Survey', detail: 'HCES 2022-23 and 2023-24, with India values from 1999-00', rhythm: 'Survey rounds; the round before 2022-23 was 2011-12', match: /Household Consumption Expenditure/ },
      { name: 'NSS round 76', detail: 'Persons with disabilities (Report 583); drinking water, sanitation, hygiene and housing condition (Report 584), 2018', rhythm: 'One-off survey round', match: /round 76/ },
      { name: 'National Household Travel Survey', detail: 'NHTS 2025-26 fact sheet and Appendix A and B tables: mode of travel to work and school, overnight trips', rhythm: 'First round, July 2025 to June 2026', match: /Household Travel/ },
    ],
    licence: NOT_STATED,
    access: ['eSankhyiki API (api.mospi.gov.in)', 'A press note with each release'],
    note: 'The API has no PLFS monthly figure for March 2026. The press note gives it.',
    site: 'https://www.mospi.gov.in',
  },
  {
    short: 'ORGI',
    logos: ['orgi'],
    full: 'Office of the Registrar General and Census Commissioner, India',
    topics: ['population', 'health', 'education', 'religion-and-culture'],
    dataSets: [
      { name: 'Census of India', detail: '2011 tables A-01, A-02, C-01, C-14, C-16 and the Primary Census Abstract; 2001 table C-01', rhythm: 'Each census. The 2027 count runs to 28 Feb 2027 in most states.', match: /Census/ },
      { name: 'Sample Registration System', detail: 'Bulletin and Statistical Report 2024; maternal mortality 2022-24; life tables 2020-24; causes of death 2021-23 and 2022-24', rhythm: 'Yearly', match: /SRS/ },
      { name: 'Civil Registration System', detail: 'Vital Statistics of India based on CRS 2024: registration level and sex ratio of registered births', rhythm: 'Yearly', match: /Civil Registration/ },
    ],
    licence: '"Rights Reserved" on its catalogue pages',
    access: ['Census tables and reports (censusindia.gov.in)', 'SRS bulletins and reports as PDF'],
    note: 'Census 2011 is the latest full count, so every Census figure shows its year.',
    site: 'https://censusindia.gov.in',
  },
  {
    short: 'MoE',
    logos: ['moe'],
    full: 'Ministry of Education',
    topics: ['education'],
    dataSets: [
      { name: 'UDISE+', detail: 'Schools: booklets 2021-22 to 2025-26, existing structure', rhythm: 'Yearly', match: /UDISE/ },
      { name: 'AISHE', detail: 'Higher education: report 2023-24; enrolment ratios from 2011-12', rhythm: 'Yearly, about two years after the year it covers', match: /AISHE|Higher Education/ },
    ],
    licence: NOT_STATED,
    access: ['UDISE+ booklets (udiseplus.gov.in)', 'AISHE reports (aishe.gov.in)'],
    site: 'https://udiseplus.gov.in',
  },
  {
    short: 'RBI',
    logos: ['rbi'],
    full: 'Reserve Bank of India',
    topics: ['prices', 'economy', 'trade'],
    dataSets: [
      { name: 'Policy repo rate', detail: "Governor's statements", rhythm: 'At each Monetary Policy Committee meeting', match: /Governor/ },
      { name: 'Inflation target', detail: '4%, with a band of 2% to 6%, to 31 Mar 2031', rhythm: 'Every five years', match: /Monetary Policy Framework/ },
      { name: 'Handbook of Statistics on Indian Economy', detail: 'Tables 9, 10, 40, 133 and 236; for trade, Tables 111, 113, 115 and 119 (DGCI&S data), 128, 130, 144 and 241', rhythm: 'Yearly', match: /Handbook/ },
      { name: 'Rupee reference rate', detail: 'US dollar, since 25 Aug 1998; set by FBIL since 10 Jul 2018', rhythm: 'Each working day', match: /Reference Rate|Current Rates/ },
      { name: 'Payment System Indicators', detail: 'UPI, NEFT, RTGS, IMPS and card payments, monthly from June 2020', rhythm: 'Monthly', match: /Payment System Indicators/ },
    ],
    licence: 'RBI Copyright Policy: material "may be reproduced accurately and without modification, subject to appropriate acknowledgement of the RBI as the source".',
    access: ['Handbook tables in Excel (rbidocs.rbi.org.in) and as web pages (rbi.org.in)', 'Statements, rates and payment tables (rbi.org.in)', 'FBIL reference rates (fbil.org.in)'],
    note: 'Handbook table 236 carries CPI series from the Labour Bureau and NSO.',
    site: 'https://www.rbi.org.in',
  },
  {
    short: 'Labour Bureau',
    logos: [],
    full: 'Labour Bureau, Ministry of Labour and Employment',
    topics: ['prices'],
    dataSets: [
      { name: 'Consumer Price Index for Industrial Workers', detail: 'All-India index and inflation rates', rhythm: 'Monthly', match: /CPI-IW/ },
    ],
    licence: NOT_STATED,
    access: ['Monthly index letters and annual reports as PDF'],
    site: 'https://labourbureau.gov.in',
  },
  {
    short: 'IMD',
    logos: ['imd'],
    full: 'India Meteorological Department, Ministry of Earth Sciences',
    topics: ['climate'],
    dataSets: [
      { name: 'All-India monsoon rainfall', detail: '1901 to 2026, from IMD Pune', rhythm: 'After each monsoon', match: /India \(June-Sept\) Rainfall/ },
      { name: 'The 2026 monsoon', detail: 'By subdivision and by month', rhythm: 'After each monsoon', match: /Salient Features|Daily Weather Report|Rainfall statistics/ },
      { name: 'Statement on the Climate of India', detail: 'Temperature and extremes, 2025', rhythm: 'Each January', match: /Climate of India/ },
    ],
    licence: NOT_STATED,
    access: ['Press releases and reports (mausam.imd.gov.in)', 'Rainfall tables (imdpune.gov.in)'],
    note: 'IMD gives rainfall by meteorological subdivision, not by state. The 2026 season table is an image.',
    site: 'https://mausam.imd.gov.in',
  },
  {
    short: 'ECI',
    logos: ['eci'],
    full: 'Election Commission of India',
    topics: ['elections'],
    dataSets: [
      { name: 'Statistical reports', detail: 'General election 2024, reports 20 and 33', rhythm: 'After each general election', match: /Statistical Report/ },
      { name: 'Results pages', detail: 'June 2024, February 2025, November 2025 and May 2026', rhythm: 'After each election', match: /Trends and Results/ },
    ],
    licence: NOT_STATED,
    access: ['Results (results.eci.gov.in)', 'Statistical reports as PDF (eci.gov.in)'],
    note: "Five more election charts use ECI data through MoSPI's Women and Men in India 2025.",
    site: 'https://www.eci.gov.in',
  },
  {
    short: 'PIB',
    logos: ['pib'],
    full: 'Press Information Bureau, Government of India',
    topics: ['economy', 'health', 'elections'],
    dataSets: [
      { name: 'Industrial production, quick estimate', detail: 'For MoSPI', rhythm: 'Monthly', match: /IIP/ },
      { name: 'State election turnout', detail: 'For ECI', rhythm: 'After each phase of polling', match: /poll|turnout/i },
      { name: 'NFHS-5 anaemia by state', detail: 'A Lok Sabha reply of 17 Dec 2021', rhythm: 'One release', match: /NFHS-5/ },
    ],
    licence: NOT_STATED,
    access: ["Press releases for every ministry (pib.gov.in)"],
    site: 'https://www.pib.gov.in',
  },
  {
    short: 'CEA',
    logos: ['cea'],
    full: 'Central Electricity Authority',
    topics: ['climate'],
    dataSets: [
      { name: 'Installed capacity', detail: 'By source: March editions 2014 to 2026, and 31 Oct 2026', rhythm: 'Monthly', match: /Installed Capacity/ },
    ],
    licence: NOT_STATED,
    access: ['Monthly reports in PDF and Excel (cea.nic.in)'],
    note: 'CEA gives no release date for its reports.',
    site: 'https://cea.nic.in',
  },
  {
    short: 'MoHFW and IIPS',
    logos: ['mohfw', 'iips'],
    full: 'Ministry of Health and Family Welfare, with the International Institute for Population Sciences and NHSRC',
    topics: ['health', 'population'],
    dataSets: [
      { name: 'National Family Health Survey (NFHS-6)', detail: 'India and state fact sheets, 2023-24, provisional', rhythm: 'Rounds several years apart', match: /NFHS-6/ },
      { name: 'National Family Health Survey (1992-93)', detail: 'The urban share from Census 1991, as cited by IIPS.', rhythm: 'Historical report', match: /National Family Health Survey 1992-93/ },
      { name: 'National Health Accounts', detail: 'Health spending shares in India and the states', rhythm: 'Annual since 2013-14', match: /National Health Accounts|National Commission on Macroeconomics and Health/ },
    ],
    licence: NOT_STATED,
    access: ['NFHS fact sheets (nfhsiips.in)', 'Reports (mohfw.gov.in)'],
    note: 'The NFHS-6 fact sheets print the NFHS-5 value beside each NFHS-6 value.',
    site: 'https://www.nfhsiips.in',
  },
  {
    short: 'MNRE',
    logos: ['mnre'],
    full: 'Ministry of New and Renewable Energy',
    topics: ['climate'],
    dataSets: [
      { name: 'Renewable capacity by state', detail: 'By location, as on 31 Oct 2026', rhythm: 'Monthly', match: /Renewable Power/ },
    ],
    licence: NOT_STATED,
    access: ['A state-wise table as PDF (mnre.gov.in)'],
    site: 'https://mnre.gov.in',
  },
  {
    short: 'NCP, MoHFW',
    logos: ['mohfw'],
    full: 'National Commission on Population, MoHFW: Technical Group on Population Projections',
    topics: ['population'],
    dataSets: [
      { name: 'Population projections', detail: 'India and the states, 2011 to 2036. Shown as Projection.', rhythm: 'One report. No update announced.', match: /Population Projections/ },
    ],
    licence: NOT_STATED,
    access: ['The Technical Group report (mohfw-dohfw.gov.in)'],
    note: 'The report predates SRS data for 2020 onward.',
    site: 'https://mohfw-dohfw.gov.in',
  },
  {
    short: 'UN Population Division',
    logos: [],
    full: 'United Nations Department of Economic and Social Affairs, Population Division',
    topics: ['population'],
    dataSets: [
      { name: 'World Population Prospects 2024', detail: 'Age and sex estimates for 1951 and annual national rates through 2026.', rhythm: 'Periodic revisions', match: /World Population Prospects 2024/ },
    ],
    licence: NOT_STATED,
    access: ['CSV files for the medium projection variant'],
    site: 'https://population.un.org/wpp/',
  },
  {
    short: 'IMF',
    logos: [],
    full: 'International Monetary Fund',
    topics: ['economy'],
    dataSets: [
      { name: 'International Financial Statistics', detail: 'India, calendar-year average rupees per US dollar, 1950 to 1969', rhythm: 'Historical series', match: /International Financial Statistics/ },
    ],
    licence: NOT_STATED,
    access: ['International Financial Statistics via DBnomics'],
    site: 'https://data.imf.org/en',
  },
  {
    short: 'WHO',
    logos: [],
    full: 'World Health Organization',
    topics: ['health'],
    dataSets: [
      { name: 'Global Health Expenditure Database', detail: 'Out-of-pocket and domestic government shares of current health spending in India', rhythm: 'Annually', match: /Global Health Expenditure Database/ },
    ],
    licence: NOT_STATED,
    access: ['Excel and Global Health Observatory API'],
    site: 'https://apps.who.int/nha/database/',
  },
  {
    short: 'NCRB',
    logos: [],
    full: 'National Crime Records Bureau, Ministry of Home Affairs',
    topics: ['crime-and-justice'],
    dataSets: [
      { name: 'Crime in India', detail: 'Crimes, murder, crimes against women, police and court disposal, 2024; national rates from 2015', rhythm: 'Yearly', match: /Crime in India/ },
      { name: 'Prison Statistics India', detail: 'Prison capacity, prisoners and undertrials, 31 Dec 2024; India from 2014', rhythm: 'Yearly', match: /Prison Statistics India/ },
    ],
    licence: 'Not stated. NCRB pages say "All Rights Reserved".',
    access: ['Volumes and tables as PDF (ncrb.gov.in)'],
    note: 'NCRB gives no release date for Crime in India 2024. Its site opens in Hindi; the English pages list the volumes.',
    site: 'https://www.ncrb.gov.in',
  },
  {
    short: 'MoLJ',
    logos: [],
    full: 'Department of Justice, Ministry of Law and Justice',
    topics: ['crime-and-justice'],
    dataSets: [
      { name: 'Answers in Parliament on court pendency', detail: 'Cases pending in the district courts, High Courts and the Supreme Court, from NJDG', rhythm: 'When a question is asked', match: /unstarred question/ },
    ],
    licence: NOT_STATED,
    access: ['Answers to Lok Sabha and Rajya Sabha questions as PDF (sansad.in)'],
    note: 'Each answer quotes the National Judicial Data Grid (NJDG) on a stated date. NJDG is a live dashboard.',
    site: 'https://doj.gov.in',
  },
  {
    short: 'MoRTH',
    logos: [],
    full: 'Transport Research Wing, Ministry of Road Transport and Highways',
    topics: ['transport'],
    dataSets: [
      { name: 'Road Accidents in India', detail: 'Accidents, deaths and injuries by state, 2023 and 2024; road users killed; deaths without a helmet or seat belt; India from 1970', rhythm: 'Yearly', match: /Road Accidents in India/ },
    ],
    licence: NOT_STATED,
    access: ['Reports as PDF (morth.gov.in)'],
    note: 'Counts are police records of accidents, not a survey. MoRTH gives no release date for Road Accidents in India 2024. Its site opens in Hindi.',
    site: 'https://morth.gov.in',
  },
]

const sources: SourcesPage = {
  breadcrumb: 'About the data / Sources',
  title: 'Sources',
  hindi: 'स्रोत',
  description: `The ${PUBLISHERS.length} publishers behind India by Numbers: what we take from each, how often it releases, and its terms.`,
  checked: 'Page checked 18 Nov 2026',
  summary: {
    finding: `Two offices, MoSPI and ORGI, supply the data for most of the ${count.charts} charts. Some charts combine two publishers, so the bars add up to more than ${count.charts}.`,
    licence:
      'Publisher data stays under each publisher’s terms. The ORGI catalogue says "Rights Reserved".',
  },
  // A horizontal bar chart of charts by publisher. The Sources page counts the bars from the
  // source lines of every chart at build time.
  chart: {
    number: '1.1',
    title: 'Charts that use each publisher',
    subtitle: 'Number of charts in release 1, by publisher, 18 Nov 2026',
    note: "Note: Derived from each chart's source line. Five election charts use MoSPI tables of ECI data and count under MoSPI. Source: India by Numbers, chart register, 18 Nov 2026. Checked 18 Nov 2026.",
  },
  publishers: {
    eyebrow: 'Publishers, by number of charts',
    heading: 'Who publishes the data we use?',
    logoNote: 'Each logo belongs to its publisher and only identifies it. India by Numbers is not affiliated with any of them.',
    labels: {
      charts: (n) => (n === 1 ? 'chart uses it' : 'charts use it'),
      dataSet: 'Data set',
      detail: 'What we take',
      rhythm: 'How often',
      latest: 'Latest used',
      notStated: 'Date not stated',
      licence: 'Licence',
      access: 'Published as',
      site: 'Website',
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
        why: 'The NFHS-6 fact sheets also print most NFHS-5 values, so we take them from there.',
      },
      {
        source: "India's 4th Biennial Update Report (unfccc.int)",
        why: 'Not in release 1. Its per-person CO2 emissions come in a later release.',
      },
      {
        source: 'MoSPI, EnviStats India 2025',
        why: 'A scanned PDF with a chart and no table of values.',
      },
      {
        source: 'Department of Justice, compilation of pendency answers (doj.gov.in)',
        why: 'The server refused access (HTTP 403) on 25 Nov 2026. The compilation repeats answers that sansad.in also publishes, so we take each answer from there.',
      },
      {
        source: 'Answers in Parliament with road accident figures for 2025 and 2026 (sansad.in)',
        why: 'The figures come from the e-DAR system and are marked provisional. We wait for a dated MoRTH report.',
      },
      {
        source: 'News reports of official figures',
        why: 'Not a release. Example: All India Radio reported 60.54% turnout for Delhi 2025. We found no ECI release for it, so we show "No data".',
      },
    ],
  },
}

export default sources
