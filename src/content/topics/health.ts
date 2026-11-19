import type { Chart, Series, Source, Topic } from '../types'


// The ORGI catalogue gives "Date published 2026-05-20".
const SRS_BULLETIN_2024: Source = {
  publisher: 'ORGI',
  release: 'SRS Bulletin 2024 (Vol. 59 No. 1)',
  released: '2026-05-20',
  url: 'https://censusindia.gov.in/nada/index.php/catalog/47150/download/51394',
}

// The ORGI catalogue gives "Date published 2026-05-20" (catalog/47151).
const SRS_MMR_2022_24: Source = {
  publisher: 'ORGI',
  release: 'SRS Special Bulletin on Maternal Mortality in India 2022-24',
  released: '2026-05-20',
  url: 'https://censusindia.gov.in/nada/index.php/catalog/47151/download/51395',
}

// The ORGI catalogue gives "Date published 2026-05-18" (catalog/47148).
const SRS_LIFE_TABLES: Source = {
  publisher: 'ORGI',
  release: 'SRS Based Abridged Life Tables 2020-24',
  released: '2026-05-18',
  url: 'https://censusindia.gov.in/nada/index.php/catalog/47148/download/51393',
}

// The file states no date. The ORGI catalogue gives "Date published 2014-01-01" (catalog/33218),
// a year-only entry, so the year is 2014.
const SRS_COMPENDIUM: Source = {
  publisher: 'ORGI',
  release: "SRS Compendium of India's Fertility and Mortality Indicators 1971-2013",
  released: '2014',
  url: 'https://censusindia.gov.in/nada/index.php/catalog/33218/download/37035',
}

const SRS_BIRTH_RATIO_REPORTS: readonly Source[] = [
  {
    publisher: 'ORGI',
    release: 'SRS Statistical Report 2017',
    released: '2020',
    url: 'https://censusindia.gov.in/nada/index.php/catalog/44373/download/48042/SRS_STAT_2017.pdf',
  },
  {
    publisher: 'ORGI',
    release: 'SRS Statistical Report 2019',
    released: '2022-03-01',
    url: 'https://censusindia.gov.in/nada/index.php/catalog/44375/download/48046/SRS_STAT_2019.pdf',
  },
  {
    publisher: 'ORGI',
    release: 'SRS Statistical Report 2020',
    released: '2022-09-22',
    url: 'https://censusindia.gov.in/nada/index.php/catalog/44376/download/48048/SRS_STAT_2020.pdf',
  },
  {
    publisher: 'ORGI',
    release: 'SRS Statistical Report 2024',
    released: '2026-05-20',
    url: 'https://censusindia.gov.in/nada/index.php/catalog/47152/download/51396',
  },
]

const NFHS_1: Source = {
  publisher: 'IIPS for MoHFW · DHS Program archive',
  release: 'NFHS-1 (1992-93) India report',
  released: '1995-08',
  url: 'https://dhsprogram.com/pubs/pdf/FRIND1/FRIND1.pdf',
}

const NFHS_2: Source = {
  publisher: 'IIPS and ORC Macro · DHS Program archive',
  release: 'NFHS-2 (1998-99) India report',
  released: '2000-10',
  url: 'https://dhsprogram.com/pubs/pdf/FRIND2/FRIND2.pdf',
}

const NFHS_3: Source = {
  publisher: 'IIPS and Macro International · DHS Program archive',
  release: 'NFHS-3 (2005-06) India report, Volume I',
  released: '2007-09',
  url: 'https://dhsprogram.com/pubs/pdf/FRIND3/FRIND3-Vol1AndVol2.pdf',
}

const NFHS_4: Source = {
  publisher: 'IIPS and ICF · DHS Program archive',
  release: 'NFHS-4 (2015-16) India report',
  released: '2017-12',
  url: 'https://dhsprogram.com/pubs/pdf/FR339/FR339.pdf',
}

const NFHS_5: Source = {
  publisher: 'IIPS and ICF · DHS Program archive',
  release: 'NFHS-5 (2019-21) India report, Volume I',
  released: '2022-03',
  url: 'https://dhsprogram.com/pubs/pdf/FR375/FR375.pdf',
}

const NFHS_6: Source = {
  publisher: 'IIPS and MoHFW',
  release: 'NFHS-6 (2023-24) India and State/UT Fact Sheets',
  released: '2026-05-29',
  url: 'https://www.nfhsiips.in/nfhsuser/assets/National%20Family%20Health%20Survey%20(NFHS-6)%202023-2024%20Fact%20Sheets.pdf',
}

const PIB_ANAEMIA: Source = {
  publisher: 'PIB, Ministry of Women and Child Development',
  release: 'Release 1782638, Annexure-I, citing NFHS-5',
  released: '2021-12-17',
  url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=1782638',
}

// PIB release 2336478 confirms the report was public by 15 Nov 2026.
const NHA_2023_24: Source = {
  publisher: 'MoHFW and NHSRC',
  release: 'National Health Accounts Estimates for India 2023-24',
  released: '2026-11-15',
  url: 'https://nhsrcindia.org/sites/default/files/2026-11/NHA%20Report%202023-24.pdf',
}

const withTable = (s: Source, table: string): Source => ({ ...s, release: `${s.release}, ${table}` })

// Bigger states and the one "other states" group that SRS gives a maternal mortality ratio for.
// The CSV also has three regional subtotals; the board does not plot them.
const MMR_STATES = [
  'india',
  'uttar-pradesh',
  'madhya-pradesh',
  'chhattisgarh',
  'odisha',
  'uttarakhand',
  'bihar',
  'haryana',
  'west-bengal',
  'rajasthan',
  'assam',
  'other-states',
  'jharkhand',
  'punjab',
  'karnataka',
  'gujarat',
  'telangana',
  'andhra-pradesh',
  'maharashtra',
  'tamil-nadu',
  'kerala',
] as const

const nfhsTrend = (key: string, label: string, color: Series['color'], indicator: string, basis: string): Series => ({
  key, label, color,
  file: 'health/nfhs-india-history.csv',
  x: 'mid_year',
  xLabel: 'period',
  where: { geography: 'india', indicator, basis },
  note: 'note',
})

export const sexRatioAtBirthIndia: Chart = {
  kind: 'line',
  slug: 'sex-ratio-at-birth-india',
  title: 'Sex ratio at birth in India, 1998-00 to 2022-24',
  subtitle: 'Girls born per 1,000 boys born. Each estimate covers three years.',
  punches: { office: 'ORGI · SRS', unit: 'per 1,000 boys', period: '2022-24' },
  status: ['Survey estimate'],
  sources: [SRS_COMPENDIUM, ...SRS_BIRTH_RATIO_REPORTS].map((source) => withTable(source, 'Table 16')),
  format: { decimals: 0 },
  note: 'The Sample Registration System (SRS) replaced its sample in 2004 and 2014. Each point sits at the middle year of its three-year period, so neighbouring points share two years. The national estimates agree where the reports overlap.',
  y: { min: 870, max: 930, step: 10 },
  markers: [{ x: '2004', label: '2004 sample' }, { x: '2014', label: '2014 sample' }],
  series: [
    { key: 'total', label: 'India', color: 'ink', file: 'health/sex-ratio-at-birth-india.csv', x: 'mid_year', xLabel: 'period', where: { residence: 'total' } },
  ],
  know: [
    'The ratio counts girls born for every 1,000 boys born. A ratio of 1,000 means equal numbers.',
    'The SRS estimates the ratio from a sample of births.',
    'Some three-year periods include more than one sample design.',
  ],
  processing: [
    'Read the national row from Table 16 of the SRS Compendium and the SRS Statistical Reports.',
    'Check that the figures agree in overlapping periods before joining the tables.',
    'Use the total for the trend. The data file also keeps the rural and urban ratios.',
  ],
  nextRelease: 'not announced',
}

const topic: Topic = {
  slug: 'health',
  name: 'Health',
  hindi: 'स्वास्थ्य',
  question: 'How many babies die before their first birthday, and how fast has that fallen since 1971?',
  standfirst:
    'In 2024, 24 of every 1,000 babies born in India died before their first birthday, down from 129 in 1971.',
  figures: [
    { chart: 'infant-mortality', series: 'total', x: '2024', label: 'Infant deaths per 1,000 live births' },
    { chart: 'maternal-mortality', series: 'india', x: '2022-24', label: 'Maternal deaths per 1,00,000 live births' },
    // The chart plots life expectancy at the middle year of each period: 2022 is 2020-24.
    { chart: 'life-expectancy', series: 'total', x: '2022', label: 'Life expectancy at birth', period: '2020-24' },
  ],
  nextRelease: 'SRS Bulletin 2025, not announced',
  parts: [
    {
      title: 'Are fewer babies dying?',
      lede: 'In 2024 the rate was 27 in rural areas and 17 in urban areas, down from 138 and 82 in 1971.',
      blocks: [
        {
          chart: {
            kind: 'line',
            slug: 'infant-mortality',
            title: 'Infant mortality in India, 1971 to 2024',
            subtitle: 'Infant deaths per 1,000 live births, India, total, rural and urban, 1971 to 2024.',
            punches: { office: 'ORGI', unit: 'per 1,000', period: '2024' },
            status: ['Survey estimate'],
            note: 'The India rate for 1991 to 1997 leaves out Jammu and Kashmir. The SRS Compendium also notes that Mizoram is left out before 1995, and rural Nagaland from 1995 to 2003.',
            sources: [withTable(SRS_COMPENDIUM, 'Table 1'), withTable(SRS_BULLETIN_2024, 'Table 1')],
            format: { decimals: 0 },
            spans: [{ from: '1991', to: '1997', label: 'Excludes J&K' }],
            y: { min: 0, max: 160, step: 40 },
            series: [
              { key: 'total', label: 'India, total', color: 'ink', file: 'health/imr-india-1971-2024.csv', where: { geography: 'india', series: 'total' } },
              { key: 'rural', label: 'Rural', color: 's4', file: 'health/imr-india-1971-2024.csv', where: { geography: 'india', series: 'rural' } },
              { key: 'urban', label: 'Urban', color: 's5', file: 'health/imr-india-1971-2024.csv', where: { geography: 'india', series: 'urban' } },
            ],
            know: [
              'The infant mortality rate counts deaths before age one for every 1,000 live births in the same year.',
              'The Sample Registration System (SRS) is a large sample survey of births and deaths, run by the Office of the Registrar General of India (ORGI).',
              'The India rate leaves out Jammu and Kashmir in 1991 to 1997, Mizoram before 1995, and rural Nagaland from 1995 to 2003.',
              'Values to 2013 come from the SRS Compendium; from 2014 each value comes from that year\'s SRS Bulletin.',
            ],
            processing: [
              'We take the total, rural and urban rates for India from Table 1 of the SRS Compendium 1971-2013.',
              'We add one value a year for 2014 to 2024 from Table 1 of each SRS Bulletin.',
              'We keep the rates as ORGI prints them, as whole numbers. We do not smooth or fill any year.',
              'We mark the years that leave out Jammu and Kashmir, as the compendium does.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How many women die in pregnancy and childbirth?',
      lede: 'In 2022-24, 87 women died from pregnancy or childbirth for every 1,00,000 live births, down from 398 in 1997-98.',
      blocks: [
        { text: 'The fall has slowed: the ratio was 88 in 2020-22 and in 2021-23, against a Sustainable Development Goal target of below 70.' },
        {
          chart: {
            kind: 'line',
            slug: 'maternal-mortality',
            title: 'Maternal mortality in India, 1997-98 to 2022-24',
            subtitle: 'Maternal deaths per 1,00,000 live births, India, three-year periods (1997-98 is two years).',
            punches: { office: 'ORGI', unit: 'per 1,00,000', period: '2022-24' },
            status: ['Survey estimate'],
            note: 'SRS pools several years because maternal deaths are rare in a sample. To 2011-13 the points are the periods SRS chose, so they are not evenly spaced. The ORGI catalogue lists no bulletin for 2012-14 or 2013-15, so the line breaks there. Values for 2014-16 to 2021-23 are the labels on the trend chart in the 2022-24 bulletin.',
            sources: [withTable(SRS_COMPENDIUM, 'Table 13'), SRS_MMR_2022_24],
            format: { decimals: 0 },
            y: { min: 0, max: 400, step: 100 },
            refs: [{ y: 70, label: 'SDG target: below 70' }],
            // The line breaks at the gap and the chart labels it "No data".
            // LATER: the board joins the points up to 2011-13 and names the gap "No data 2012-14, 2013-15"; the line splits where periods are not consecutive.
            // LATER: the board labels every point with its value only; a callout per point would crowd the line.
            series: [
              { key: 'india', label: 'India', color: 'ink', file: 'health/mmr-india-1997-2024.csv', where: { geography: 'india' } },
            ],
            know: [
              'The maternal mortality ratio counts the women who die from pregnancy or childbirth for every 1,00,000 live births.',
              'SRS pools three years for each value because maternal deaths are rare in a sample. 1997-98 covers two years.',
              'The periods to 2011-13 are not consecutive, and ORGI lists no bulletin for 2012-14 or 2013-15.',
              'The Sustainable Development Goal (SDG) target is a ratio below 70.',
            ],
            processing: [
              'We take 1997-98 to 2011-13 from Table 13 of the SRS Compendium 1971-2013.',
              'We take 2014-16 to 2022-24 from the trend chart labels in the SRS Special Bulletin on Maternal Mortality 2022-24.',
              'We plot one point per pooled period and leave a gap where ORGI has no bulletin.',
              'We keep the ratios as ORGI prints them, as whole numbers.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How long do people live?',
      lede: 'A baby born in India in 2020-24 could expect to live 70.6 years. Women live 4.1 years longer than men.',
      blocks: [
        { text: 'In 1970-75, men lived slightly longer than women: 50.5 years against 49.0.' },
        {
          chart: {
            kind: 'line',
            slug: 'life-expectancy',
            title: 'Life expectancy at birth in India, 1970-75 to 2020-24',
            subtitle: 'Years a newborn could expect to live at the death rates of each period, women, men and total.',
            punches: { office: 'ORGI', unit: 'years', period: '2020-24' },
            status: ['Survey estimate'],
            note: 'Life expectancy fell from 70.0 years in 2016-20 to 69.8 in 2017-21, periods that include the COVID-19 years, then rose again; the life tables give no reason. The first four periods (dots) are separate five-year blocks. From 1987-91 the periods are five-year moving averages that overlap, plotted at their middle year. The India figure for 1987-91 to 1997-01 leaves out Jammu and Kashmir.',
            sources: [withTable(SRS_LIFE_TABLES, 'Statement 1')],
            format: { decimals: 1 },
            y: { min: 40, max: 80, step: 10 },
            // Each period sits at its middle year (`mid_year`) and is labelled with `period`.
            // 1987-91 is at 1989 and 1997-01 at 1999.
            spans: [{ from: '1989', to: '1999', label: 'Excludes J&K' }],
            // LATER: the board draws the first four points (separate five-year blocks) as dots.
            series: [
              { key: 'total', label: 'India, total', color: 'ink', file: 'health/life-expectancy-india-1970-2024.csv', x: 'mid_year', xLabel: 'period', where: { geography: 'india', residence: 'total', sex: 'total' } },
              { key: 'female', label: 'Women', color: 's3', file: 'health/life-expectancy-india-1970-2024.csv', x: 'mid_year', xLabel: 'period', where: { geography: 'india', residence: 'total', sex: 'female' } },
              { key: 'male', label: 'Men', color: 's2', file: 'health/life-expectancy-india-1970-2024.csv', x: 'mid_year', xLabel: 'period', where: { geography: 'india', residence: 'total', sex: 'male' } },
            ],
            know: [
              'Life expectancy at birth is the number of years a newborn would live if the death rates of the period stayed the same all its life.',
              'ORGI builds abridged life tables from SRS deaths, so the figures are survey estimates.',
              'The first four periods are separate five-year blocks. From 1987-91 the periods overlap, so neighbouring points share four years.',
              'The India figure for 1987-91 to 1997-01 leaves out Jammu and Kashmir.',
              'The dip from 70.0 years (2016-20) to 69.8 (2017-21) falls in periods that include the COVID-19 years. The life tables give no reason.',
            ],
            processing: [
              'We take life expectancy at birth for India, residence total, from Statement 1 of the SRS Based Abridged Life Tables 2020-24.',
              'We keep the total, the women and the men series as published, to one decimal place.',
              'We place each period at its middle year so that the overlapping periods sit on one time axis.',
              'We do not join, smooth or fill any period.',
            ],
            nextRelease: 'not announced',
          },
        },
        { text: 'Women outlive men in all 22 states with data. The gap runs from 0.9 years in Bihar to 7.1 years in Himachal Pradesh.' },
        {
          chart: {
            kind: 'dots',
            slug: 'life-expectancy-by-state',
            title: 'Life expectancy at birth by state and sex, 2020-24',
            subtitle: 'Years, women and men, India and the 22 states with SRS life tables, 2020-24.',
            punches: { office: 'ORGI', unit: 'years', period: '2020-24' },
            status: ['Survey estimate'],
            note: 'For women and men together, life expectancy at birth ranges from 64.7 years in Chhattisgarh to 75.6 years in Kerala. SRS publishes life tables for the 21 bigger states and Himachal Pradesh only, and gives no figure for the other 14 states and UTs.',
            sources: [withTable(SRS_LIFE_TABLES, 'Statement 3')],
            format: { decimals: 1 },
            by: 'geography',
            sortBy: 'total',
            series: [
              { key: 'female', label: 'Women', color: 's3', file: 'health/life-expectancy-by-state-2020-24.csv', x: 'geography', where: { residence: 'total', sex: 'female' } },
              { key: 'male', label: 'Men', color: 's2', file: 'health/life-expectancy-by-state-2020-24.csv', x: 'geography', where: { residence: 'total', sex: 'male' } },
              { key: 'total', label: 'Women and men', color: 'ink', hidden: true, file: 'health/life-expectancy-by-state-2020-24.csv', x: 'geography', where: { residence: 'total', sex: 'total' } },
            ],
            know: [
              'SRS publishes life tables for India, the 21 bigger states and Himachal Pradesh. It gives no figure for the other 14 states and UTs.',
              'Each figure covers the five years 2020 to 2024 together.',
              'Women outlive men in all 22 states. The gaps on this page are our subtraction of the published values.',
              'SRS "Jammu and Kashmir" is the union territory; Ladakh is not in the life tables.',
            ],
            processing: [
              'We take life expectancy at birth by state, residence total, for women, men and the total from Statement 3 of the SRS Based Abridged Life Tables 2020-24.',
              'We sort the states by the published total.',
              'We compute the gap between women and men by subtraction, to one decimal place.',
              'We show states with no published table as "No data".',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'Are children better nourished?',
      lede: '29.3% of children under 5 in India were stunted in 2023-24, down from 35.5% in 2019-21. These NFHS-6 results are provisional.',
      blocks: [
        {
          chart: {
            kind: 'line',
            slug: 'child-nutrition',
            title: 'Child stunting and wasting in India, 1998-99 to 2023-24',
            subtitle: 'Share of children with stunting, wasting or severe wasting.',
            punches: { office: 'IIPS', unit: '%', period: '2023-24' },
            status: ['Survey estimate', 'Method break', 'Provisional'],
            note: 'The dashed lines cover the last two children under age 3 of ever-married women. NFHS-3 recalculated both rounds on the WHO growth standards. The solid lines cover all children under age 5. Both groups have a value in 2005-06. NFHS-1 used an older growth reference and did not measure height in five states, so it has no comparable national estimate here.',
            sources: [withTable(NFHS_3, 'Tables 10.2 and 10.3'), withTable(NFHS_4, 'Table 10.2'), NFHS_6],
            format: { decimals: 1, unit: '%' },
            y: { min: 0, max: 60, step: 10 },
            breaks: [{ x: '2006', before: 'Under 3', label: 'Under 5' }],
            series: [
              { ...nfhsTrend('stunted-under-3', 'Stunting, under 3', 'ink', 'stunted', 'under-three-who'), dash: true },
              { ...nfhsTrend('wasted-under-3', 'Wasting, under 3', 's4', 'wasted', 'under-three-who'), dash: true },
              { ...nfhsTrend('severely-wasted-under-3', 'Severe wasting, under 3', 's3', 'severely-wasted', 'under-three-who'), dash: true },
              nfhsTrend('stunted', 'Stunting', 'ink', 'stunted', 'under-five-who'),
              nfhsTrend('wasted', 'Wasting', 's4', 'wasted', 'under-five-who'),
              nfhsTrend('severely-wasted', 'Severe wasting', 's3', 'severely-wasted', 'under-five-who'),
            ],
            know: [
              'Stunting means a child is too short for their age. Wasting means a child is too thin for their height.',
              'Wasting includes severe wasting. A child can have both stunting and wasting.',
              'NFHS-6 results are provisional, as the fact sheets say.',
            ],
            processing: [
              'Use the like-for-like estimates that the NFHS-3 report tabulates for children under age 3 in NFHS-2 and NFHS-3.',
              'Use the WHO standards for all children under age 5 from NFHS-3 to NFHS-6.',
              'Keep the two age groups on separate lines.',
            ],
            nextRelease: 'not announced',
          },
        },
        { text: 'Births in a health facility rose from 88.6% to 90.6% between the two latest rounds.' },
        {
          chart: {
            kind: 'line',
            slug: 'births-in-health-facilities',
            title: 'Births in health facilities in India, 1992-93 to 2023-24',
            subtitle: 'Share of births in a health facility. In 2005-06 the survey reports both definitions.',
            punches: { office: 'IIPS', unit: '%', period: '2023-24' },
            status: ['Survey estimate', 'Method break', 'Provisional'],
            note: 'The early definition covers the last two births to ever-married women in the three years before the survey. The later definition uses all births. In 2005-06 the early definition gives 40.8% and the later definition gives 38.7%.',
            sources: [withTable(NFHS_3, 'Tables 8.12 and 8.23'), withTable(NFHS_4, 'Table 8.27'), NFHS_6],
            format: { decimals: 1, unit: '%' },
            y: { min: 0, max: 100, step: 20 },
            breaks: [{ x: '2006', before: 'Last two births', label: 'All births' }],
            series: [
              { ...nfhsTrend('last-two', 'Last two births', 'ink', 'institutional-births', 'last-two-births'), dash: true },
              nfhsTrend('all', 'Facility births', 'ink', 'institutional-births', 'all-births'),
            ],
            know: [
              'The NFHS-3 report aligns the first three rounds to the last two births in the prior three years.',
              'NFHS-3 to NFHS-5 also report all births in the prior five years. The NFHS-6 fact sheet gives its own result beside the NFHS-5 estimate.',
              'NFHS-6 results are provisional.',
            ],
            processing: [
              'Take the early series from Table 8.23 of the NFHS-3 report.',
              'Take both all-birth estimates from Table 8.27 of the NFHS-4 report, then use the NFHS-6 fact sheet for the latest two rounds.',
              'Separate the lines where the survey changes the group of births.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          chart: {
            kind: 'line',
            slug: 'childhood-vaccination',
            title: 'Full childhood vaccination in India, 1992-93 to 2023-24',
            subtitle: 'Share of children aged 12 to 23 months with all basic doses. The two lines use different sources of vaccination records.',
            punches: { office: 'IIPS', unit: '%', period: '2023-24' },
            status: ['Survey estimate', 'Method break', 'Provisional'],
            note: 'In the first four rounds, the card-only rate covers children whose cards the interviewer saw. Keep those rates separate from the later fact-sheet rates. From NFHS-5 the questionnaire counts the pentavalent vaccine alongside DPT. The break marks the change. The NFHS-6 estimates are provisional.',
            sources: [withTable(NFHS_1, 'Table 9.10'), withTable(NFHS_2, 'Table 6.9'), withTable(NFHS_3, 'Tables 9.3 and 9.6'), withTable(NFHS_4, 'Tables 9.3 and 9.6'), NFHS_6],
            format: { decimals: 1, unit: '%' },
            y: { min: 0, max: 100, step: 20 },
            breaks: [{ x: '2020', label: 'NFHS-5 method' }],
            series: [
              nfhsTrend('basic-dpt', 'Card or recall, early', 'ink', 'full-immunisation-card-or-recall', 'basic-vaccines-dpt'),
              nfhsTrend('card-seen', 'Card seen', 's4', 'full-immunisation-card', 'card-seen'),
              nfhsTrend('card-or-recall', 'Card or recall', 'ink', 'full-immunisation-card-or-recall', 'factsheet-card-or-recall'),
              nfhsTrend('card-only', 'Card only', 's4', 'full-immunisation-card', 'factsheet-card-only'),
            ],
            know: [
              'The early schedule includes BCG, measles and three doses each of DPT and polio. It excludes the polio dose at birth.',
              'Card or recall uses the vaccination card or the mother’s answers.',
              'The card-only and card-or-recall rates have different denominators in the early reports.',
            ],
            processing: [
              'Use the vaccine source tables in the first four national reports for the share among children whose cards were seen.',
              'Use the NFHS-3 and NFHS-4 trend tables for the early card-or-recall series.',
              'Keep the NFHS-5 and NFHS-6 values as paired in the NFHS-6 fact sheet.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          chart: {
            kind: 'line',
            slug: 'anaemia-among-women',
            title: 'Anaemia among women in India, 1998-99 to 2019-21',
            subtitle: 'Share of women aged 15 to 49 with anaemia. In 2005-06 the survey reports both groups.',
            punches: { office: 'IIPS', unit: '%', period: '2019-21' },
            status: ['Survey estimate', 'Method break'],
            note: 'NFHS-2 tested ever-married women. NFHS-3 reported estimates for ever-married women and for all women, and excluded Nagaland from both. NFHS-1 did not test haemoglobin. NFHS-6 did not report anaemia.',
            sources: [withTable(NFHS_3, 'Table 10.24.1'), withTable(NFHS_4, 'Table 10.21.1'), PIB_ANAEMIA],
            format: { decimals: 1, unit: '%' },
            y: { min: 45, max: 60, step: 5 },
            breaks: [{ x: '2006', before: 'Ever married', label: 'All women' }],
            series: [
              { ...nfhsTrend('ever-married', 'Ever-married women', 'ink', 'anaemia-women-15-49', 'ever-married-women'), dash: true },
              nfhsTrend('all', 'All women', 'ink', 'anaemia-women-15-49', 'all-women'),
            ],
            know: [
              'The survey uses a finger-prick blood sample to measure haemoglobin.',
              'The threshold is below 12 grams per decilitre for women who are not pregnant and below 11 for pregnant women.',
              'MoHFW plans to use a different test with venous blood in a separate survey.',
            ],
            processing: [
              'Take the estimates for ever-married women from Table 10.24.1 of the NFHS-3 report.',
              'Take the estimates for all women from the NFHS-3 and NFHS-4 reports and PIB release 1782638.',
              'Use each source’s estimate for any anaemia, which includes mild, moderate and severe anaemia.',
            ],
            nextRelease: 'not announced',
          },
        },
        { text: 'Stunting fell in 33 of the 35 states and UTs surveyed. It rose only in Andaman and Nicobar Islands and in Lakshadweep, where the samples are small.' },
        {
          chart: {
            kind: 'dots',
            slug: 'stunting-by-state',
            title: 'Stunting among children under 5 by state and UT, 2015-16 to 2023-24',
            subtitle: 'Share of children under 5 who are too short for their age. NFHS-4 to NFHS-6 use the same WHO growth standards.',
            punches: { office: 'IIPS', unit: '%', period: '2023-24' },
            status: ['Survey estimate', 'Provisional'],
            note: 'NFHS-4 uses older boundaries for Jammu and Kashmir, Ladakh, and Dadra and Nagar Haveli and Daman and Diu. Those rows start at NFHS-5. Manipur has no NFHS-6 estimate because the survey did not run there.',
            sources: [withTable(NFHS_4, 'Table 10.2'), withTable(NFHS_5, 'Table 10.2, Manipur'), NFHS_6],
            format: { decimals: 1, unit: '%' },
            by: 'geography',
            hollow: ['nfhs4'],
            pin: ['india'],
            sortBy: 'nfhs6',
            map: { series: 'nfhs6', scale: 'seq', better: 'low' },
            missing: { manipur: 'NFHS-6 did not survey Manipur' },
            series: [
              { key: 'nfhs4', label: '2015-16', color: 's3', file: 'health/nfhs-stunting-history-by-state.csv', where: { round: 'NFHS-4' } },
              { key: 'nfhs5', label: '2019-21', color: 'slate', file: 'health/nfhs-stunting-history-by-state.csv', where: { round: 'NFHS-5' } },
              { key: 'nfhs6', label: '2023-24', color: 'ink', file: 'health/nfhs-stunting-history-by-state.csv', where: { round: 'NFHS-6' } },
            ],
            know: [
              'A stunted child is too short for their age, a sign of long-term undernutrition.',
              'NFHS-4 reports Andhra Pradesh and Telangana separately. Three current UTs have different boundaries from the areas in the NFHS-4 report.',
              'NFHS-6 results are provisional, as the fact sheets say.',
              'In 2023-24, Dadra and Nagar Haveli and Daman and Diu had the highest share at 37.1%. Puducherry had the lowest at 16.6%.',
              'Samples in Andaman and Nicobar Islands and Lakshadweep are small, so their changes are less certain.',
            ],
            processing: [
              'Take the NFHS-4 estimates from Table 10.2 of the national report where boundaries match.',
              'Take both recent estimates from the NFHS-6 state and UT fact sheets. Use the NFHS-5 national report for Manipur.',
              'Sort the states and UTs by the NFHS-6 value. Place India first.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'Who pays for health care?',
      lede: "Households paid 42.7% of India's health bill out of their own pockets in 2023-24, down from 64.2% in 2013-14. The government's share rose from 28.6% to 43.5%.",
      blocks: [
        { text: 'Part of the fall comes from a change of method in 2017-18, when the accounts moved to a newer household survey with a bigger sample.' },
        {
          chart: {
            kind: 'line',
            slug: 'out-of-pocket-health-spending',
            title: 'Out-of-pocket and government shares of health spending, India, 2013-14 to 2023-24',
            subtitle: 'Out-of-pocket spending by households and government health spending, % of total health expenditure, India, 2013-14 to 2023-24.',
            punches: { office: 'NHSRC', unit: '% of total', period: '2023-24' },
            status: ['Method break'],
            note: 'The two shares do not add up to 100%: other private spending, such as health insurance, and donor funds make up the rest. The line breaks between 2016-17 and 2017-18 because the household survey behind the accounts changed, from NSS 2014 (six-month recall) to NSS 2017-18 (one-year recall, bigger sample). New data sources were added in 2022-23, when the share rose from 39.4% to 43.4%, so the 2021-22 low is not a clean trend point.',
            sources: [withTable(NHA_2023_24, 'Table 1')],
            format: { decimals: 1, unit: '%' },
            y: { min: 0, max: 70, step: 10 },
            // Both are changes of method, so both are dotted breaks.
            breaks: [
              { x: '2017-18', label: 'NSS 2017-18 survey', before: 'NSS 2014 survey' },
              { x: '2022-23', label: 'New sources' },
            ],
            series: [
              { key: 'oope-nss71', label: 'Out of pocket', color: 's7', file: 'health/out-of-pocket-health-spending.csv', where: { geography: 'india', series: 'oope-share-of-the', period: ['2013-14', '2014-15', '2015-16', '2016-17'] } },
              { key: 'oope', label: 'Out of pocket', color: 's7', file: 'health/out-of-pocket-health-spending.csv', where: { geography: 'india', series: 'oope-share-of-the', period: ['2017-18', '2018-19', '2019-20', '2020-21', '2021-22', '2022-23', '2023-24'] } },
              { key: 'ghe-nss71', label: 'Government', color: 's6', file: 'health/out-of-pocket-health-spending.csv', where: { geography: 'india', series: 'ghe-share-of-the', period: ['2013-14', '2014-15', '2015-16', '2016-17'] } },
              { key: 'ghe', label: 'Government', color: 's6', file: 'health/out-of-pocket-health-spending.csv', where: { geography: 'india', series: 'ghe-share-of-the', period: ['2017-18', '2018-19', '2019-20', '2020-21', '2021-22', '2022-23', '2023-24'] } },
            ],
            know: [
              'Out-of-pocket spending is what households pay directly for care, at the point of use. Total health expenditure (THE) adds spending by government, insurers and others.',
              'To 2016-17 the accounts extrapolate household spending from the NSS 71st round (2014, six-month recall). From 2017-18 they use the NSS 75th round (2017-18, one-year recall, bigger sample).',
              'NHSRC says the change in the out-of-pocket share "may be attributed to several factors", including this change of survey.',
              'The 2022-23 accounts added new data sources. The share rose from 39.4% in 2021-22 to 43.4% in 2022-23.',
            ],
            processing: [
              'We take the out-of-pocket and government shares of total health expenditure for India from Table 1 of the National Health Accounts Estimates for India 2023-24.',
              'We split each line at 2017-18, where the household survey changes, and do not join the two parts.',
              'We keep the shares as published, to one decimal place.',
            ],
            nextRelease: 'not announced',
          },
        },
        { text: "Households in Uttar Pradesh paid 67.1% of the state's health bill in 2023-24, the highest share of the 21 states. Uttarakhand had the lowest, at 26.7%." },
        {
          chart: {
            kind: 'states',
            slug: 'out-of-pocket-health-spending-by-state',
            title: 'Out-of-pocket share of health spending by state, 2023-24',
            subtitle: 'Out-of-pocket spending by households, % of total health expenditure, 21 states, 2023-24.',
            punches: { office: 'NHSRC', unit: '% of total', period: '2023-24' },
            note: "NHSRC reports 21 states. Assam is the only one from the North-East. The other North-Eastern states, Goa and the UTs, including Delhi, are left out because their survey samples are too small. State shares still rest on the 2017-18 household survey. Kerala's high share (65.2%) sits beside high total spending, ₹13,605 per person, so the share alone does not show hardship.",
            sources: [withTable(NHA_2023_24, 'Table A.6')],
            format: { decimals: 1, unit: '%' },
            // LATER: the board gives this frame Chart and Table tabs only, no Map (21 states); 'states' always has a Map tab.
            data: { file: 'health/out-of-pocket-health-spending.csv', where: { series: 'oope-share-of-the', period: '2023-24' } },
            open: 'chart',
            scale: 'seq',
            short: 'Out-of-pocket share',
            know: [
              'NHSRC gives state shares for 21 states only. It leaves out the small states, the UTs and the North-East because their survey samples are too small.',
              'State shares still rest on the NSS 75th round (2017-18).',
              'A high share does not on its own show hardship. Kerala\'s share sits beside high total spending per person.',
              'The NHA "Jammu and Kashmir" includes the erstwhile state, so it includes Ladakh.',
            ],
            processing: [
              'We take the out-of-pocket share of total health expenditure for each state from Table A.6 of the National Health Accounts Estimates for India 2023-24.',
              'We take the India value from Table 1 of the same report for the reference line.',
              'We rank the 21 states by the published share.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How does health differ across the states?',
      lede: 'A baby born in Chhattisgarh is four and a half times as likely to die before age one as a baby born in Kerala: 36 per 1,000 against 8.',
      blocks: [
        {
          chart: {
            kind: 'states',
            slug: 'infant-mortality-by-state',
            title: 'Infant mortality by state and UT, 2024',
            subtitle: 'Infant deaths per 1,000 live births, 36 states and UTs. Bigger states: 2024. Smaller states and UTs: three-year pool, 2022-24.',
            punches: { office: 'ORGI', unit: 'per 1,000', period: '2024' },
            status: ['Survey estimate'],
            note: "For the 15 smaller states and UTs, SRS pools three years because each year's sample is small. Manipur's rate of 2 is the lowest, but it rests on 130 sample units. SRS gives rural and urban rates for India and the 21 bigger states only.",
            sources: [withTable(SRS_BULLETIN_2024, 'Table 1')],
            format: { decimals: 0 },
            // LATER: the board draws pooled (2022-24) rates with a dotted tile edge, from `estimate_basis`.
            bins: [10, 15, 20, 25, 30],
            data: { file: 'health/imr-by-state-2024.csv', note: 'estimate_basis' },
            open: 'map',
            scale: 'seq',
            better: 'low',
            short: 'Infant mortality',
            know: [
              'The infant mortality rate counts deaths before age one for every 1,000 live births.',
              'SRS gives a single-year 2024 rate for India and the 21 bigger states. For the 15 smaller states and UTs, the rate is a three-year pool, 2022-24.',
              'Compare a state with the states in its own group, because the two groups use different periods.',
              'Manipur\'s rate of 2 rests on 130 SRS sample units only.',
              'Rural and urban rates exist for India and the 21 bigger states only.',
            ],
            processing: [
              'We take the rate for India and each of the 36 states and UTs from Table 1 of the SRS Bulletin 2024.',
              'We record for each state whether ORGI gives a single year or a three-year pool.',
              'We keep the rates as ORGI prints them, as whole numbers.',
              'We colour the map in fixed bins of 5 per 1,000.',
            ],
            nextRelease: 'not announced',
          },
        },
        { text: 'Uttar Pradesh had the highest maternal mortality ratio in 2022-24, at 154 per 1,00,000 live births. Kerala had the lowest, at 24.' },
        {
          chart: {
            kind: 'states',
            slug: 'maternal-mortality-by-state',
            title: 'Maternal mortality by state, 2022-24',
            subtitle: 'Maternal deaths per 1,00,000 live births, 19 states, 2022-24, with 95% confidence intervals.',
            punches: { office: 'ORGI', unit: 'per 1,00,000', period: '2022-24' },
            status: ['Survey estimate'],
            note: "SRS gives a ratio for 19 bigger states and one ratio for all other states and UTs together, so the map shows the 19 states only. The intervals are wide: Kerala's runs from 0 to 50, and Chhattisgarh's from 48 to 199.",
            sources: [withTable(SRS_MMR_2022_24, 'Table 1')],
            format: { decimals: 0 },
            // Whiskers show the 95% confidence interval SRS publishes for each state.
            data: { file: 'health/mmr-by-state-2022-24.csv', where: { geography: MMR_STATES }, interval: ['ci95_lower', 'ci95_upper'] },
            open: 'chart',
            scale: 'seq',
            better: 'low',
            short: 'Maternal mortality',
            know: [
              'The maternal mortality ratio counts the women who die from pregnancy or childbirth for every 1,00,000 live births, pooled over 2022 to 2024.',
              'SRS gives a ratio for 19 bigger states. It reports all the other states and UTs together as one group.',
              'The 95% confidence intervals are wide, so small gaps between states may not be real.',
              'The bulletin also gives three regional subtotals. This chart does not show them.',
            ],
            processing: [
              'We take the ratio and its 95% confidence interval for India, 19 states and the "other states" group from Table 1 of the SRS Special Bulletin on Maternal Mortality in India 2022-24.',
              'We rank the states by the published ratio and show the group as one bar.',
              'We keep the ratios and the interval limits as ORGI prints them, as whole numbers.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
  ],
  // LATER: the About band's side line ("How each health measure is made, which are surveys, where the series break, and what is missing.") has no field.
  about: {
    publisher:
      'The Office of the Registrar General of India (ORGI) runs the Sample Registration System (SRS), a large sample survey of births and deaths. It publishes infant and maternal mortality and life tables from it. The International Institute for Population Sciences (IIPS) runs the National Family Health Survey (NFHS) for the Ministry of Health and Family Welfare (MoHFW). The National Health Systems Resource Centre (NHSRC) compiles the National Health Accounts for MoHFW.',
    frequency:
      'SRS Bulletin: once a year. The 2024 bulletin came out on 20 May 2026; ORGI has not announced a date for 2025. Maternal mortality and life tables: pooled periods, published alongside the bulletin. NFHS: one round every few years; the NFHS-6 fact sheets came out on 29 May 2026. National Health Accounts: once a year; NHSRC posted the 2023-24 estimates in November 2026.',
    revisions:
      'NFHS-6 results are provisional, as the fact sheets say. The NFHS-5 values shown are as printed in the NFHS-6 fact sheets. The National Health Accounts added new data sources in 2022-23.',
    breaks:
      'The India infant mortality rate leaves out Jammu and Kashmir in 1991 to 1997, and life expectancy leaves it out in 1987-91 to 1997-01. Life expectancy uses five-year blocks to 1986-90 and overlapping five-year averages after that. The maternal mortality series jumps from 2011-13 to 2014-16. Out-of-pocket spending changes household survey between 2016-17 and 2017-18, and the accounts add new data sources in 2022-23.',
    coverage:
      'SRS infant mortality covers all 36 states and UTs; for the 15 smaller ones the rate is a 2022-24 pool. Life tables cover India, the 21 bigger states and Himachal Pradesh. Maternal mortality covers 19 states and one group for the rest. NFHS-6 covers 35 states and UTs, all except Manipur. State health accounts cover 21 states. SRS state series before 2014 do not split Andhra Pradesh and Telangana.',
    missing:
      'NFHS-6 did not report anaemia; MoHFW will use a separate ICMR survey with a different blood test. NFHS-6 gives no infant or child mortality, so this page uses SRS. SRS publishes no life expectancy, under-5 or neonatal mortality for the smaller states and UTs. None of the publishers states a reuse licence for these data.',
  },
  sources: [
    SRS_BULLETIN_2024, SRS_MMR_2022_24, SRS_LIFE_TABLES, SRS_COMPENDIUM, ...SRS_BIRTH_RATIO_REPORTS,
    NFHS_1, NFHS_2, NFHS_3, NFHS_4, NFHS_5, NFHS_6, PIB_ANAEMIA, NHA_2023_24,
  ],
  related: [
    { label: 'Population: Fertility rate by state', href: '/charts/fertility-rate-by-state/' },
    { label: 'Population: Birth rate and death rate', href: '/charts/birth-death-rates-by-state/' },
    { label: 'Population: Sex ratio at birth in India', href: '/charts/sex-ratio-at-birth-india/' },
    { label: 'Population: Sex ratio at birth by state', href: '/charts/sex-ratio-at-birth-by-state/' },
    { label: 'States: Tamil Nadu profile', href: '/states/tamil-nadu/' },
    { label: 'How we check: survey estimates', href: '/how-we-check/' },
  ],
}

export default topic
