// Fixed copy and the measure rows of the state pages. The sentences that quote a
// state's values are in src/lib/profile.ts, next to the numbers they use.

import type { Format, Pick, TopicSlug } from '../types'
import { count } from './counts'

export interface Section {
  heading: string
  body: string
}

/**
 * One row of a state page: a by-state chart, or one series of it, with optional changes to its
 * pick (for example the rural rows of the inflation chart). Period, unit, status and source come
 * from the chart.
 */
export interface MeasureRow {
  label: string
  chart: string
  /** For dots and bars charts: the series to read. */
  series?: string
  /** Changes to the chart's pick: `where` merges, `y` replaces. */
  pick?: { where?: Pick['where']; y?: string; file?: string }
  /** Column that names this row for each state, for example the language column. */
  labelFrom?: string
  /** Replaces the chart's number format, for a row that reads another column. */
  format?: Format
  /** No rank for this row (the values are not comparable across states). */
  noRank?: boolean
  /** Note under the India value, for example "India excl. Surat". */
  indiaNote?: string
  /** Leave India's column empty: the state's value has no national equivalent (its own largest language). */
  noIndia?: boolean
}

export interface ProfileSection {
  topic: TopicSlug
  heading: string
  /** Measure rows, in order. Values come from the topic's by-state charts. */
  measures: readonly MeasureRow[]
  /** Footnote under the rows; the "Checked" date is appended. */
  footnote: string
}

export interface StateProfile {
  typeLabel: { state: string; ut: string }
  onThisPage: (n: number) => string
  picker: string
  locator: string
  stripKey: { heading: string; india: string; others: string; ends: string }
  columns: { measure: string; state: (state: string) => string; india: string; rank: string; strip: string }
  seeAll: (topic: string) => string
  checked: (date: string) => string
  noData: (state: string) => string
  sections: readonly ProfileSection[]
  gaps: {
    eyebrow: string
    heading: (state: string) => string
    rows: readonly Section[]
  }
  prevNext: { previous: string; next: string; all: string }
}

const stateProfile: StateProfile = {
  typeLabel: { state: 'State', ut: 'Union territory' },
  onThisPage: (n) => `On this page · ${n} topics`,
  picker: 'Switch state',
  locator: 'One tile per state and UT',
  stripKey: {
    heading: 'How to read the strips',
    india: 'India',
    others: 'Each other state and UT with data',
    ends: 'Ends show the lowest and highest values.',
  },
  // Ledger column headings.
  columns: { measure: 'Measure', state: (state) => state, india: 'India', rank: 'Rank', strip: 'Among states and UTs' },
  seeAll: (topic) => `See all ${topic} charts`,
  checked: (date) => `Checked ${date}.`,
  noData: (state) => `No data for ${state}`,
  sections: [
    {
      topic: 'prices',
      heading: 'Prices',
      measures: [
        { label: 'Inflation, rural and urban', chart: 'cpi-inflation-by-state' },
        { label: 'Inflation, rural', chart: 'cpi-inflation-by-state', pick: { where: { sector: 'rural' } } },
        { label: 'Inflation, urban', chart: 'cpi-inflation-by-state', pick: { where: { sector: 'urban' } } },
      ],
      footnote: 'Ranks count only states and UTs with data.',
    },
    {
      topic: 'economy',
      heading: 'Economy',
      measures: [
        { label: 'Income per person', chart: 'income-per-person-by-state', indiaNote: 'Per capita NNI' },
        { label: 'Growth of the state economy', chart: 'gsdp-growth-by-state', indiaNote: 'Base 2011-12' },
        { label: 'Factory jobs', chart: 'factory-jobs-by-state' },
        { label: 'Workers in small firms', chart: 'small-firm-workers-by-state' },
      ],
      footnote:
        "Ranks count only states and UTs with data. State accounts are on base 2011-12; India's 2022-23-base GDP figures do not compare. Factory jobs (ASI) and small-firm workers (ASUSE) come from different surveys; do not add them.",
    },
    {
      topic: 'population',
      heading: 'Population',
      measures: [
        { label: 'Fertility rate', chart: 'fertility-rate-by-state', series: '2024' },
        { label: 'Birth rate', chart: 'birth-death-rates-by-state', series: 'birth' },
        { label: 'Sex ratio at birth', chart: 'sex-ratio-at-birth-by-state', series: '2022-24' },
        { label: 'People living in towns', chart: 'urban-share-by-state' },
      ],
      footnote: 'Ranks count only states and UTs with data. SRS figures are sample estimates.',
    },
    {
      topic: 'jobs',
      heading: 'Jobs',
      measures: [
        { label: 'Women in the labour force', chart: 'women-labour-force-by-state' },
        { label: 'Unemployment, age 15+', chart: 'unemployment-by-state', series: 'adults' },
        { label: 'Unemployment, age 15-29', chart: 'unemployment-by-state', series: 'youth' },
        { label: "Women's unpaid domestic and care work", chart: 'women-unpaid-work-by-state' },
      ],
      footnote:
        'Ranks count only states and UTs with data. Annual rates use usual status (ps+ss); monthly rates use current weekly status and do not compare. Unpaid work is minutes a day from the Time Use Survey 2024.',
    },
    {
      topic: 'living-standards',
      heading: 'Living standards',
      measures: [
        { label: 'Rural spending per person, a month', chart: 'household-spending-by-state', series: 'rural' },
        { label: 'Urban spending per person, a month', chart: 'household-spending-by-state', series: 'urban' },
        { label: 'Food share of rural spending', chart: 'food-share-by-state' },
        { label: 'Households with clean cooking fuel', chart: 'clean-cooking-fuel-by-state' },
        { label: 'Women who used the internet, age 15+', chart: 'internet-use-women-and-men', series: 'female' },
        { label: 'Women with a bank account, age 18+', chart: 'bank-accounts-women-and-men', series: 'female' },
      ],
      footnote:
        'Ranks count only states and UTs with data. All values are survey estimates. Spending is in rupees at current prices, without imputation for free items (HCES 2023-24). Small states and UTs have small samples and wide errors.',
    },
    {
      topic: 'health',
      heading: 'Health',
      measures: [
        { label: 'Infant mortality', chart: 'infant-mortality-by-state' },
        { label: 'Life expectancy', chart: 'life-expectancy-by-state', series: 'female', pick: { where: { sex: 'total' } } },
        { label: 'Maternal mortality', chart: 'maternal-mortality-by-state' },
        { label: 'Children who are stunted', chart: 'stunting-by-state', series: 'nfhs6' },
        { label: 'Men who use tobacco', chart: 'tobacco-use-by-state', series: 'men-nfhs6' },
        { label: 'Women overweight or obese', chart: 'overweight-by-state', series: 'women-nfhs6' },
        { label: 'Deaths registered', chart: 'registration-of-births-and-deaths-by-state', series: 'deaths' },
      ],
      footnote: 'Ranks count only states and UTs with data. SRS and NFHS figures are survey estimates. Infant mortality is a 2022-24 average for smaller states and UTs and a 2024 value for the others, so ranks mix the two. Deaths registered is a share of the deaths ORGI estimates, and ORGI caps it at 100%.',
    },
    {
      topic: 'education',
      heading: 'Education',
      measures: [
        { label: 'School enrolment, classes 11-12', chart: 'ger-higher-secondary-by-state' },
        { label: 'College enrolment, age 18-23', chart: 'college-enrolment-ratio-by-state', series: 'total' },
        { label: 'Literacy, age 7+', chart: 'literacy-by-state', series: 'plfs-2025' },
        { label: 'Years of schooling, age 25+', chart: 'mean-years-of-schooling-by-state' },
        { label: 'Spending per school student', chart: 'school-spending-by-state' },
        { label: 'Students in government schools', chart: 'government-school-share-by-state' },
      ],
      footnote: 'Ranks count only states and UTs with data. A gross enrolment ratio can pass 100 when pupils outside the age group enrol. NSS values are survey estimates, with wide errors in small states and UTs.',
    },
    {
      topic: 'elections',
      heading: 'Elections',
      measures: [
        { label: 'Lok Sabha turnout', chart: 'lok-sabha-turnout-by-state', indiaNote: 'India excl. Surat' },
        { label: "Women's turnout", chart: 'lok-sabha-turnout-by-state', pick: { where: { series: 'turnout_women' } }, indiaNote: 'India excl. Surat' },
        { label: "'None of the above' votes", chart: 'nota-share-by-state' },
      ],
      footnote: 'Ranks count only states and UTs with data.',
    },
    {
      topic: 'crime-and-justice',
      heading: 'Crime and justice',
      measures: [
        { label: 'Recorded crimes per lakh people', chart: 'crime-rate-by-state', noRank: true },
        { label: 'Recorded murders per lakh people', chart: 'murder-rate-by-state', noRank: true },
        { label: 'Recorded crimes against women, per lakh women', chart: 'crimes-against-women-by-state', noRank: true },
        { label: 'Charge-sheeting rate', chart: 'chargesheeting-and-conviction-by-state', series: 'chargesheeting' },
        { label: 'Conviction rate', chart: 'chargesheeting-and-conviction-by-state', series: 'conviction' },
        { label: 'Prison occupancy', chart: 'prison-occupancy-by-state' },
        { label: 'Undertrials, share of prisoners', chart: 'undertrials-by-state' },
        { label: 'Cases pending in district courts', chart: 'district-court-pendency-by-state' },
      ],
      footnote:
        'Ranks count only states and UTs with data. Recorded crime rows have no rank: a higher recorded rate can mean better registration, not more crime, and NCRB says states should not be compared on crime figures alone. Prisons as on 31 Dec 2024. Pending cases are a count on 30 Jul 2026, not a rate.',
    },
    {
      topic: 'transport',
      heading: 'Transport',
      measures: [
        { label: 'Road deaths per lakh people', chart: 'road-deaths-per-lakh-by-state' },
        { label: 'Road deaths per 100 accidents', chart: 'road-accident-severity-by-state' },
        { label: 'Workers who go to work by two-wheeler', chart: 'two-wheeler-commute-by-state' },
      ],
      footnote:
        'Ranks count only states and UTs with data. Road deaths are police records within 30 days of the accident, so a low value can mean fewer records as well as fewer deaths. The two-wheeler share is a survey estimate, with wide errors in small states and UTs.',
    },
    {
      topic: 'climate',
      heading: 'Climate',
      measures: [
        { label: 'Renewable power capacity', chart: 'renewable-capacity-by-state' },
        { label: 'Solar capacity', chart: 'renewable-capacity-by-state', pick: { where: { series: 'solar_total' } } },
        { label: 'Wind capacity', chart: 'renewable-capacity-by-state', pick: { where: { series: 'wind' } } },
      ],
      footnote: 'Capacity is in megawatts (MW). India is a total, so these strips carry no India mark.',
    },
    {
      topic: 'religion-and-culture',
      heading: 'Religion and culture',
      measures: [
        { label: 'Reported Hindu', chart: 'religion-by-state', series: 'hindu' },
        { label: 'Reported Muslim', chart: 'religion-by-state', series: 'muslim' },
        { label: 'Reported Christian', chart: 'religion-by-state', series: 'christian' },
        {
          label: 'Largest mother tongue:',
          chart: 'mother-tongues-by-state',
          pick: { file: 'religion-culture/languages-top3-by-state-2011.csv', where: { rank: '1' }, y: 'share_pct' },
          labelFrom: 'language',
          format: { unit: '%', decimals: 2 },
          noIndia: true,
          indiaNote: 'No national figure for the same language',
          noRank: true,
        },
      ],
      footnote: 'Census 2011 counted 35 units: Telangana sits inside Andhra Pradesh and Ladakh inside Jammu and Kashmir.',
    },
  ],
  gaps: {
    eyebrow: 'About the data',
    heading: (state) => `What is missing for ${state}?`,
    rows: [
      { heading: 'Anaemia in women, NFHS-6', body: 'Not in the NFHS-6 fact sheets for any state. Latest: NFHS-5 (2019-21).' },
      { heading: 'Monsoon rainfall by state, 2026', body: 'IMD publishes rainfall by subdivision, not by state.' },
      { heading: 'Religion and language after 2011', body: 'No count since Census 2011. Census 2027 will collect both.' },
    ],
  },
  prevNext: { previous: 'Previous', next: 'Next', all: `All ${count.places} states and UTs` },
}

export default stateProfile
