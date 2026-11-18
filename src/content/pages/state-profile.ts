// State profile: Tamil Nadu. The page is built for all 36 states
// and UTs from data, so the copy here is templates. Each template reproduces the board's Tamil Nadu
// sentence when given the Tamil Nadu values (shown in the comment above it).

import type { Pick, TopicSlug } from '../types'

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
  /** No rank for this row (the values are not comparable across states). */
  noRank?: boolean
  /** Note under the India value, for example "India excl. Surat". */
  indiaNote?: string
}

export interface ProfileSection {
  topic: TopicSlug
  heading: string
  /** Measure rows on the board, in order. Values come from the topic's by-state charts. */
  measures: readonly MeasureRow[]
  /** Footnote under the rows; the "Checked" date is appended. */
  footnote: string
}

/** 1 -> "1st", 2 -> "2nd", 11 -> "11th". */
export const ordinal = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`
}

/** "Tamil Nadu" -> "Tamil Nadu's". */
const possessive = (name: string): string => (name.endsWith('s') ? `${name}'` : `${name}'s`)

/** ["Puducherry", "Dadra and Nagar Haveli and Daman and Diu"] -> "Puducherry, and Dadra and ...". */
const list = (names: readonly string[]): string =>
  names.length < 2 ? (names[0] ?? '') : `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`

export interface StateProfile {
  breadcrumb: (state: string) => string
  typeLabel: { state: string; ut: string }
  /** Standfirst. Board: infant mortality. */
  standfirst: (p: { year: string; value: string; state: string; india: string }) => string
  onThisPage: (n: number) => string
  picker: string
  locator: string
  stripKey: { heading: string; india: string; others: string; ends: string }
  columns: { measure: string; state: (state: string) => string; india: string; rank: string; strip: string }
  rank: (p: { rank: number; of: number; direction: 'highest' | 'lowest'; joint?: boolean }) => string
  seeAll: (topic: string) => string
  tableLinks: string
  checked: (date: string) => string
  noData: (state: string) => string
  /** One sentence per topic section, by topic. */
  sentences: {
    prices: (p: { state: string; value: string; period: string; india: string; faster: boolean; higher: readonly string[] }) => string
    economy: (p: { state: string; value: string; period: string; rank: number; of: number; growth: string; indiaGrowth: string }) => string
    population: (p: {
      state: string
      value: string
      year: string
      india: string
      lower?: { names: readonly string[]; value: string }
      level?: { names: readonly string[]; value: string }
    }) => string
    jobs: (p: { year: string; value: string; state: string; india: string }) => string
    health: (p: { state: string; value: string; period: string; rankPhrase: string; of: number; india: string }) => string
    education: (p: { state: string; value: string; period: string; rankPhrase: string; india: string }) => string
    elections: (p: { state: string; value: string; india: string }) => string
    climate: (p: { state: string; value: string; date: string; rank: number; of: number; extra?: string }) => string
    religion: (p: { year: string; value: string; state: string; language: string }) => string
  }
  sections: readonly ProfileSection[]
  gaps: {
    eyebrow: string
    heading: (state: string) => string
    rows: readonly Section[]
  }
  prevNext: { previous: string; next: string; all: string }
}

const stateProfile: StateProfile = {
  breadcrumb: (state) => `Home / States / ${state}`,
  typeLabel: { state: 'State', ut: 'Union territory' },
  // "In 2024, 11 in every 1,000 babies born in Tamil Nadu died before their first birthday, against 24 across India."
  standfirst: ({ year, value, state, india }) =>
    `In ${year}, ${value} in every 1,000 babies born in ${state} died before their first birthday, against ${india} across India.`,
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
  // "19th highest of 36", "Joint 2nd lowest of 22"
  rank: ({ rank, of, direction, joint }) => `${joint ? 'Joint ' : ''}${ordinal(rank)} ${direction} of ${of}`,
  seeAll: (topic) => `See all ${topic} charts`,
  tableLinks: 'Table · CSV',
  checked: (date) => `Checked ${date}.`,
  noData: (state) => `No data for ${state}`,
  sentences: {
    // "Prices in Tamil Nadu rose by 7.29% in the year to October 2026, faster than India's 6.09%.
    //  Only Puducherry, and Dadra and Nagar Haveli and Daman and Diu, had higher rates."
    prices: ({ state, value, period, india, faster, higher }) =>
      `Prices in ${state} rose by ${value} in the year to ${period}, ${faster ? 'faster' : 'slower'} than India's ${india}.` +
      (higher.length === 0
        ? ''
        : higher.length === 1
          ? ` Only ${higher[0]} had a higher rate.`
          : ` Only ${list(higher)}, had higher rates.`),
    // "Income per person in Tamil Nadu was ₹3,61,619 in 2024-25, 7th highest of the 32 states and UTs
    //  with data. Its economy grew by 11.2% in real terms, against 6.4% for India on the same base."
    economy: ({ state, value, period, rank, of, growth, indiaGrowth }) =>
      `Income per person in ${state} was ${value} in ${period}, ${ordinal(rank)} highest of the ${of} states and UTs with data. Its economy grew by ${growth} in real terms, against ${indiaGrowth} for India on the same base.`,
    // "Women in Tamil Nadu had 1.3 children on average in 2024, below the replacement level of 2.1 and
    //  India's 1.9. Only Delhi was lower, at 1.2. Kerala and West Bengal were level, at 1.3."
    // The board's sentence is for a state below 2.1; a state above it needs "above".
    population: ({ state, value, year, india, lower, level }) =>
      `Women in ${state} had ${value} children on average in ${year}, ${Number(value) < 2.1 ? 'below' : 'above'} the replacement level of 2.1 and India's ${india}.` +
      (lower ? ` Only ${lower.names.join(' and ')} ${lower.names.length > 1 ? 'were' : 'was'} lower, at ${lower.value}.` : '') +
      (level ? ` ${level.names.join(' and ')} ${level.names.length > 1 ? 'were' : 'was'} level, at ${level.value}.` : ''),
    // "In 2025, 47.3% of women in Tamil Nadu were working or looking for work (usual status, ages 15+),
    //  against 40.0% across India."
    jobs: ({ year, value, state, india }) =>
      `In ${year}, ${value} of women in ${state} were working or looking for work (usual status, ages 15+), against ${india} across India.`,
    // "Tamil Nadu's maternal mortality ratio was 25 deaths per 1,00,000 live births in 2022-24, second
    //  only to Kerala among 19 bigger states. India's was 87."
    health: ({ state, value, period, rankPhrase, of, india }) =>
      `${possessive(state)} maternal mortality ratio was ${value} deaths per 1,00,000 live births in ${period}, ${rankPhrase} among ${of} bigger states. India's was ${india}.`,
    // "Tamil Nadu's college enrolment ratio was 52.3 in 2023-24, the highest of any large state.
    //  India's was 30.0."
    education: ({ state, value, period, rankPhrase, india }) =>
      `${possessive(state)} college enrolment ratio was ${value} in ${period}, ${rankPhrase}. India's was ${india}.`,
    // "70.14% of Tamil Nadu's electors voted in the 2024 Lok Sabha election, against 66.10% across India."
    elections: ({ state, value, india }) =>
      `${value} of ${possessive(state)} electors voted in the 2024 Lok Sabha election, against ${india} across India.`,
    // "Tamil Nadu had 30,401 MW of renewable power capacity on 31 October 2026, 4th of the 36 states
    //  and UTs. Only Gujarat had more wind capacity."
    climate: ({ state, value, date, rank, of, extra }) =>
      `${state} had ${value} MW of renewable power capacity on ${date}, ${ordinal(rank)} of the ${of} states and UTs.${extra ? ` ${extra}` : ''}`,
    // "In 2011, 88.37% of people in Tamil Nadu gave Tamil as their mother tongue. Census 2011 is the
    //  latest count of religion and language; Census 2027 will update both."
    religion: ({ year, value, state, language }) =>
      `In ${year}, ${value} of people in ${state} gave ${language} as their mother tongue. Census 2011 is the latest count of religion and language; Census 2027 will update both.`,
  },
  // Section headings and measure rows, in board order. Only the rows read in full from the board
  // carry sub and source lines.
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
      ],
      footnote:
        "Ranks count only states and UTs with data. State accounts are on base 2011-12; India's 2022-23-base GDP figures do not compare.",
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
      ],
      footnote:
        'Ranks count only states and UTs with data. Annual rates use usual status (ps+ss); monthly rates use current weekly status and do not compare.',
    },
    {
      topic: 'health',
      heading: 'Health',
      measures: [
        { label: 'Infant mortality', chart: 'infant-mortality-by-state' },
        { label: 'Life expectancy', chart: 'life-expectancy-by-state', series: 'female', pick: { where: { sex: 'total' } } },
        { label: 'Maternal mortality', chart: 'maternal-mortality-by-state' },
        { label: 'Children who are stunted', chart: 'stunting-by-state', series: 'nfhs6' },
      ],
      footnote: 'Ranks count only states and UTs with data. SRS and NFHS figures are survey estimates.',
    },
    {
      topic: 'education',
      heading: 'Education',
      measures: [
        { label: 'School enrolment, classes 11-12', chart: 'ger-higher-secondary-by-state' },
        { label: 'College enrolment, age 18-23', chart: 'college-enrolment-ratio-by-state', series: 'total' },
        { label: 'Literacy, age 7+', chart: 'literacy-by-state', series: 'plfs-2025' },
      ],
      footnote: 'Ranks count only states and UTs with data. A gross enrolment ratio can pass 100 when pupils outside the age group enrol.',
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
          noRank: true,
        },
      ],
      footnote: 'Census 2011 counted 35 units: Telangana sits inside Andhra Pradesh and Ladakh inside Jammu and Kashmir.',
    },
  ],
  // "Data gaps" band. The board rows are for Tamil Nadu; the first, second and fourth apply to every
  // state; the third applies to the states that held an assembly election in 2026.
  gaps: {
    eyebrow: 'About the data',
    heading: (state) => `What is missing for ${state}?`,
    rows: [
      { heading: 'Anaemia in women, NFHS-6', body: 'Not in the NFHS-6 fact sheets for any state. Latest: NFHS-5 (2019-21).' },
      { heading: 'Monsoon rainfall by state, 2026', body: 'IMD publishes rainfall by subdivision, not by state.' },
      // Board: "ECI's final turnout for the 2026 Tamil Nadu assembly election is not yet in our data."
      // Rewritten (copy G: say what the publisher does, not what our data lacks). The board also
      // uses its wording in the Elections section's no-data row. DECIDE: confirm the new wording.
      {
        heading: 'Assembly turnout, 2026',
        body: 'ECI publishes final turnout in its Index Cards. The provisional poll-day figure is on the Elections page.',
      },
      { heading: 'Religion and language after 2011', body: 'No count since Census 2011. Census 2027 will collect both.' },
    ],
  },
  prevNext: { previous: 'Previous', next: 'Next', all: 'All 36 states and UTs' },
}

export default stateProfile

// Other row notes on the board, for the build:
// - No-data rows: heading "No data for {state}" (Health, Climate) or "No official figure for {state}
//   yet" (Elections, assembly turnout), with a reason line. Board reasons for Tamil Nadu:
//   anaemia: "NFHS-6 fact sheets left out anaemia for every state. MoHFW will use a separate ICMR
//   survey instead. The latest figure is NFHS-5 (2019-21): 53.4% in Tamil Nadu, 57.0% for India."
//   monsoon: 'IMD publishes monsoon rainfall by meteorological subdivision, not by state. "Tamil Nadu,
//   Puducherry & Karaikal" had 262.0 mm, 20% below normal (deficient).'
// - Rank notes under the rank: "Chandigarh: urban only", "No 2024-25 figure for Nagaland, Ladakh,
//   Lakshadweep, or DNH and DD", "22 bigger states and UTs", "15 smaller: 2022-24 pool",
//   "Level with Jammu and Kashmir".
// - Mother tongue row has no rank. Board: "Largest language in Tamil Nadu" / "No rank: our file holds
//   each state's top 3 languages only. Hindi is India's largest, at 43.63%." DECIDE: "our file holds"
//   is a note about our data (copy G). Suggested: "No rank: the language table covers each
//   state's top 3 languages only."
