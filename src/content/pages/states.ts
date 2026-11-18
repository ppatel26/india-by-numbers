// States and UTs. Copy is verbatim from the board.
// The map values, legend bands and tooltip values are built from data.

export interface Section {
  heading: string
  body: string
}

export interface MapMeasure {
  /** Chart slug for the measure. */
  chart: string
  label: string
}

export interface CoverageRow {
  dataSet: string
  period: string
  /** States and UTs with data, of 36. */
  of36: number
  gaps: string
}

export interface StatesPage {
  breadcrumb: string
  title: string
  hindi: string
  intro: string
  map: {
    number: string
    title: string
    subtitle: string
    switcherLabel: string
    menuHeads: { measure: string; coverage: string }
    coverage: (n: number, of: number) => string
    measures: readonly MapMeasure[]
    legend: { india: (value: string) => string; noData: (n: number, reason: string) => string; ut: string; selected: (state: string) => string }
    tooltip: {
      value: (state: string, value: string) => string
      rank: (p: { rank: string; of: number; india: string }) => string
      open: (state: string) => string
    }
    note: string
    source: string
  }
  aToZ: {
    eyebrow: string
    heading: string
    filterPlaceholder: string
    typeLabels: { state: string; ut: string }
    note: string
  }
  boundaries: {
    eyebrow: string
    heading: string
    intro: string
    changes: readonly Section[]
    link: string
    coverageHeads: { dataSet: string; period: string; of36: string; gaps: string }
    coverage: readonly CoverageRow[]
  }
}

const states: StatesPage = {
  breadcrumb: 'Home / States',
  title: 'States and union territories',
  hindi: 'राज्य और केंद्र शासित प्रदेश',
  intro:
    "India has 28 states and 8 union territories, and each one has a page that puts its figures beside India's on every topic. The map below shows one measure: income per person in 2024-25.",
  map: {
    number: '1',
    title: 'Income per person by state and UT, 2024-25',
    subtitle:
      'Net state domestic product per person, rupees a year, current prices (base 2011-12), FY 2024-25. India is per capita net national income.',
    switcherLabel: 'Colour the map by',
    menuHeads: { measure: 'Measure · period', coverage: 'States and UTs' },
    coverage: (n, of) => `${n} of ${of}`,
    // Board order. Slugs are in topic modules this file does not own, except where noted.
    measures: [
      { chart: 'cpi-inflation-by-state', label: 'Inflation, Oct 2026' },
      { chart: 'income-per-person-by-state', label: 'Income per person, FY 2024-25' },
      { chart: 'infant-mortality-by-state', label: 'Infant mortality, 2024' },
      { chart: 'women-labour-force-by-state', label: 'Women in the labour force, 2025' },
      { chart: 'lok-sabha-turnout-by-state', label: 'Lok Sabha turnout, 2024' },
      { chart: 'renewable-capacity-by-state', label: 'Renewable power capacity, 31 Oct 2026' },
      { chart: 'fertility-rate-by-state', label: 'Fertility rate, 2024' },
      { chart: 'ger-higher-secondary-by-state', label: 'School enrolment ratio, classes 11-12, 2025-26' },
    ],
    legend: {
      india: (value) => `India: ${value}`,
      // Board: "No data (4): not in MoSPI's 2024-25 release". The reason is per measure.
      noData: (n, reason) => `No data (${n}): ${reason}`,
      ut: 'Corner mark: union territory',
      selected: (state) => `Outline: selected state (${state})`,
    },
    tooltip: {
      value: (state, value) => `${state}: ${value}`,
      // Board: "7th highest of 32 · India ₹2,05,324"
      rank: ({ rank, of, india }) => `${rank} highest of ${of} · India ${india}`,
      open: (state) => `Open the ${state} page →`,
    },
    note: "Note: Each state and UT is one equal tile; the grid is not a map of borders. MoSPI's 2024-25 release has no figures for Nagaland, Ladakh, Lakshadweep, and Dadra and Nagar Haveli and Daman and Diu. Assam and Haryana are MoSPI figures as on 1 Aug 2025, from the RBI Handbook. Jammu and Kashmir covers the union territory only, without Ladakh.",
    source:
      'Source: National Statistics Office, MoSPI, state-wise per capita NSDP (base 2011-12), eSankhyiki API, state data released 15 Apr 2026. India: RBI, Handbook of Statistics on Indian Economy 2025-26, Table 9, 31 Jul 2026. Checked 17 Nov 2026.',
  },
  aToZ: {
    eyebrow: '28 states · 8 union territories',
    heading: 'Every state and UT, A to Z',
    filterPlaceholder: 'Filter 36 states and UTs',
    typeLabels: { state: 'State', ut: 'UT' },
    note: 'DNH and DD is short for Dadra and Nagar Haveli and Daman and Diu, two UTs that merged in 2020.',
  },
  // The geography-change note.
  boundaries: {
    eyebrow: 'About the data',
    heading: 'Which states does each data set cover?',
    intro:
      "India has had 28 states and 8 union territories since 2020. The latest census, in 2011, counted 35 units, so three of today's tiles do not match it.",
    changes: [
      {
        heading: 'Telangana',
        body: 'Formed from Andhra Pradesh in 2014. Census 2011 counts it inside undivided Andhra Pradesh, so Telangana has no 2011 figures, and 2011 Andhra Pradesh figures do not compare with later ones.',
      },
      {
        heading: 'Ladakh',
        body: 'A union territory since 2019. Census 2011 counts it inside the former state of Jammu and Kashmir. State accounts from 2019-20 cover the UT of Jammu and Kashmir without Ladakh.',
      },
      {
        heading: 'Dadra and Nagar Haveli and Daman and Diu (DNH and DD)',
        body: 'Two UTs until they merged in 2020. For 2011 we add the two published counts and mark the sum "Derived".',
      },
    ],
    link: 'How we handle boundary changes',
    coverageHeads: { dataSet: 'Data set', period: 'Period', of36: 'Of 36', gaps: 'Gaps and cautions' },
    coverage: [
      { dataSet: 'Inflation (CPI)', period: 'Oct 2026', of36: 36, gaps: 'Provisional. Rural rate: no Chandigarh' },
      { dataSet: 'Income per person', period: 'FY 2024-25', of36: 32, gaps: 'No 2024-25 figure for Nagaland, Ladakh, Lakshadweep, DNH and DD' },
      { dataSet: 'Growth of state economy', period: 'FY 2024-25', of36: 30, gaps: 'Also no Assam or Haryana. Base 2011-12.' },
      { dataSet: 'Infant mortality, birth rate', period: '2024', of36: 36, gaps: 'Survey estimate. 15 smaller states and UTs: 2022-24 average' },
      { dataSet: 'Fertility rate, sex ratio at birth', period: '2024; 2022-24', of36: 22, gaps: 'Survey estimate. SRS gives the 22 bigger states and UTs only' },
      { dataSet: 'Life expectancy', period: '2020-24', of36: 22, gaps: 'Survey estimate. 21 bigger states and Himachal Pradesh' },
      { dataSet: 'Maternal mortality', period: '2022-24', of36: 19, gaps: 'Survey estimate. The rest form one "other states" group' },
      { dataSet: 'Child nutrition (NFHS-6)', period: '2023-24', of36: 35, gaps: 'Survey estimate · Provisional. No survey in Manipur' },
      { dataSet: 'Jobs (PLFS)', period: '2025', of36: 36, gaps: 'Survey estimate. Small samples in small states and UTs' },
      { dataSet: 'School enrolment (UDISE+)', period: '2025-26', of36: 36, gaps: 'Method change in 2022-23' },
      { dataSet: 'College enrolment (AISHE)', period: '2023-24', of36: 36, gaps: 'Uses Census 2011 population' },
      { dataSet: 'Lok Sabha turnout', period: '2024', of36: 36, gaps: '2024 boundaries. India excludes Surat.' },
      { dataSet: 'Renewable power capacity', period: '31 Oct 2026', of36: 36, gaps: 'Capacity built in the state (location based)' },
      { dataSet: 'Census 2011: population, religion, language', period: '2011', of36: 34, gaps: 'No Telangana or Ladakh rows. DNH and DD derived.' },
    ],
  },
}

export default states
