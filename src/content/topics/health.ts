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

// The ORGI catalogue gives "Date published 2026-05-20" (catalog/47147).
const SRS_COD_2022_24: Source = {
  publisher: 'ORGI',
  release: 'SRS Cause of Death in India 2022-2024',
  released: '2026-05-20',
  url: 'https://censusindia.gov.in/nada/index.php/catalog/47147/download/51392/SRS_COD-STATISTICS_2022-2024.pdf',
}

// The ORGI catalogue gives "Date published 2025-09-03" (catalog/46176).
const SRS_COD_2021_23: Source = {
  publisher: 'ORGI',
  release: 'SRS Cause of Death in India 2021-2023',
  released: '2025-09-03',
  url: 'https://censusindia.gov.in/nada/index.php/catalog/46176/download/50424',
}

// The ORGI catalogue gives "Date published 2026-07-01" (catalog/47155).
export const CRS_2024: Source = {
  publisher: 'ORGI',
  release: 'Vital Statistics of India based on the Civil Registration System 2024',
  released: '2026-07-01',
  url: 'https://censusindia.gov.in/nada/index.php/catalog/47155/download/51401/CRS_Report_2024.pdf',
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

const NHA_2013_14: Source = {
  publisher: 'MoHFW and NHSRC',
  release: 'National Health Accounts Estimates for India 2013-14',
  released: '2016-08',
  url: 'https://nhsrcindia.org/sites/default/files/2021-06/NATIONAL%20HEALTH%20ACCOUNTS-%20Estimates%20for%20India-2013-14.pdf',
}

const NHA_2004_05: Source = {
  publisher: 'MoHFW',
  release: 'National Health Accounts India 2004-05 (archived copy)',
  released: '2009',
  url: 'https://archive.org/download/PARI.national-health-accounts-2004-05/national-health-accounts-2004-05.pdf',
}

const NCMH: Source = {
  publisher: 'MoHFW',
  release: 'Report of the National Commission on Macroeconomics and Health (archived copy)',
  released: '2005',
  url: 'https://archive.org/download/PARI.report-of-the-national-commission-on-macroeconomics-and-health/report-of-the-national-commission-on-macroeconomics-and-health.pdf',
}

const WHO_GHED: Source = {
  publisher: 'WHO',
  release: 'Global Health Expenditure Database, India',
  released: '2025-12-12',
  url: 'https://apps.who.int/nha/database/Home/IndicatorsDownload/en',
}

const withTable = (s: Source, table: string): Source => ({ ...s, release: `${s.release}, ${table}` })

function healthSpendingSeries(
  key: string, label: string, color: Series['color'], where: NonNullable<Series['where']>, dash = false,
): Series {
  return {
    key, label, color, dash, file: 'health/out-of-pocket-health-spending.csv',
    x: 'year', xLabel: 'period', note: 'note', where: { geography: 'india', use: 'chart', ...where },
  }
}

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

const COD = 'health/srs-causes-of-death-india.csv'
const COD_SEX = { women: 'female', men: 'male', all: 'person' } as const
const COD_GROUPS = ['non-communicable', 'communicable-maternal-perinatal-nutritional', 'injuries', 'ill-defined'] as const

const codGroup = (sex: keyof typeof COD_SEX, period: string, color: Series['color'], hidden = false): Series => ({
  key: `${sex}-${period}`,
  label: sex === 'all' ? `Women and men, ${period}` : period,
  color,
  hidden,
  file: COD,
  where: { table: 'cause-group', period, sex: COD_SEX[sex], cause: COD_GROUPS },
})

// ORGI's top 10 for 2022-24, in its rank order. It ranks ill-defined deaths last.
const TOP_CAUSES = [
  'cardiovascular', 'neoplasms', 'respiratory-diseases', 'digestive', 'respiratory-infections',
  'fever-unknown-origin', 'unintentional-injuries-other', 'diabetes', 'genito-urinary', 'ill-defined',
] as const

export const sexRatioAtBirthIndia: Chart = {
  kind: 'line',
  slug: 'sex-ratio-at-birth-india',
  title: 'Sex ratio at birth in India, 1998-00 to 2022-24',
  subtitle: 'Girls born per 1,000 boys, India, three-year periods.',
  punches: { office: 'ORGI · SRS', unit: 'per 1,000 boys', period: '2022-24' },
  status: ['Survey estimate'],
  sources: [SRS_COMPENDIUM, ...SRS_BIRTH_RATIO_REPORTS].map((source) => withTable(source, 'Table 16')),
  format: { decimals: 0 },
  note: 'The marked years are when SRS replaced its sample.',
  y: { min: 870, max: 930, step: 10 },
  markers: [{ x: '2004', label: '2004 sample' }, { x: '2014', label: '2014 sample' }],
  series: [
    { key: 'total', label: 'India', color: 'ink', file: 'health/sex-ratio-at-birth-india.csv', x: 'mid_year', xLabel: 'period', where: { residence: 'total' } },
  ],
  know: [
    'The ratio counts girls born for every 1,000 boys born. A ratio of 1,000 means equal numbers.',
    'The Sample Registration System (SRS) estimates the ratio from a sample of births. It replaced the sample in 2004 and 2014.',
    'Each point sits at the middle year of its three-year period, so neighbouring points share two years.',
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
      lede: 'Yes. Since 1971 the rural rate fell from 138 to 27, and the urban rate to 17.',
      blocks: [
        {
          chart: {
            kind: 'line',
            slug: 'infant-mortality',
            title: 'Infant mortality in India, 1971 to 2024',
            subtitle: 'Deaths before age one, India, total, rural and urban.',
            punches: { office: 'ORGI', unit: 'per 1,000', period: '2024' },
            status: ['Survey estimate'],
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
        { text: 'The fall has slowed: the ratio was 88 in both 2020-22 and 2021-23. The target is below 70.' },
        {
          chart: {
            kind: 'line',
            slug: 'maternal-mortality',
            title: 'Maternal mortality in India, 1997-98 to 2022-24',
            subtitle: 'Deaths from pregnancy or childbirth, India, three-year periods (1997-98 is two years).',
            punches: { office: 'ORGI', unit: 'per 1,00,000', period: '2022-24' },
            status: ['Survey estimate'],
            note: 'Points to 2011-13 are not evenly spaced. The line breaks where ORGI published no bulletin, for 2012-14 and 2013-15.',
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
            subtitle: 'Expected lifespan of a newborn, India, women, men and total.',
            punches: { office: 'ORGI', unit: 'years', period: '2020-24' },
            status: ['Survey estimate'],
            note: 'The first four points (dots) are separate five-year periods. Later points are overlapping five-year periods, placed at their middle year.',
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
              'Life expectancy at birth is the years a newborn would live if the death rates of the period stayed the same.',
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
            subtitle: 'Women and men, India and the 22 states with life tables.',
            punches: { office: 'ORGI', unit: 'years', period: '2020-24' },
            status: ['Survey estimate'],
            note: 'Rows are sorted by the total for women and men. The other 14 states and UTs have no life table.',
            sources: [withTable(SRS_LIFE_TABLES, 'Statement 3')],
            format: { decimals: 1 },
            by: 'geography',
            sortBy: 'total',
            series: [
              { key: 'female', label: 'Women', color: 's3', file: 'health/life-expectancy-by-state-2020-24.csv', x: 'geography', where: { residence: 'total', sex: 'female' } },
              { key: 'male', label: 'Men', color: 's2', file: 'health/life-expectancy-by-state-2020-24.csv', x: 'geography', where: { residence: 'total', sex: 'male' } },
              { key: 'total', label: 'Total', color: 'ink', hidden: true, file: 'health/life-expectancy-by-state-2020-24.csv', x: 'geography', where: { residence: 'total', sex: 'total' } },
            ],
            know: [
              'SRS publishes life tables for India, the 21 bigger states and Himachal Pradesh. It gives no figure for the other 14 states and UTs.',
              'Each figure covers the five years 2020 to 2024 together.',
              'For women and men together, life expectancy ranges from 64.7 years in Chhattisgarh to 75.6 years in Kerala.',
              'Women outlive men in all 22 states. The gaps on this page are our subtraction of the published values.',
              'SRS "Jammu and Kashmir" is the union territory; Ladakh is not in the life tables.',
            ],
            processing: [
              'We take life expectancy at birth, residence total, for women, men and the total from Statement 3 of the SRS life tables 2020-24.',
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
      title: 'What do people die of?',
      lede: 'Non-communicable diseases, such as heart disease and cancer, caused 60.1% of deaths in India in 2022-24.',
      blocks: [
        { text: 'Communicable, maternal, perinatal and nutritional conditions caused 22.6% of deaths among women and 17.7% among men. Injuries caused 12.6% of deaths among men, against 7.5% among women.' },
        {
          chart: {
            kind: 'bars',
            slug: 'causes-of-death',
            title: 'Deaths by cause group in India, 2021-23 and 2022-24',
            subtitle: 'Share of deaths in each major cause group, women and men, India.',
            punches: { office: 'ORGI · SRS', unit: '% of deaths', period: '2022-24' },
            status: ['Survey estimate'],
            note: 'The two periods share the years 2022 and 2023.',
            sources: [withTable(SRS_COD_2021_23, 'Table 2.1A'), withTable(SRS_COD_2022_24, 'Table 2.1A')],
            format: { unit: '%', decimals: 1 },
            by: 'cause',
            rowHead: 'Cause group',
            order: COD_GROUPS,
            labels: {
              'non-communicable': 'Non-communicable diseases',
              'communicable-maternal-perinatal-nutritional': 'Communicable, maternal, perinatal and nutritional',
              injuries: 'Injuries',
              'ill-defined': 'Ill-defined causes',
            },
            axis: { min: 0, max: 70 },
            panels: [
              { label: 'Women', series: ['women-2021-23', 'women-2022-24'] },
              { label: 'Men', series: ['men-2021-23', 'men-2022-24'] },
            ],
            series: [
              codGroup('women', '2021-23', 'slate'),
              codGroup('women', '2022-24', 's3'),
              codGroup('men', '2021-23', 'slate'),
              codGroup('men', '2022-24', 's2'),
              codGroup('all', '2021-23', 'ink', true),
              codGroup('all', '2022-24', 'ink', true),
            ],
            know: [
              'SRS staff ask the family about each death in the sample households (a verbal autopsy). Two physicians each assign a cause from the report, and a third settles any disagreement.',
              'Each value pools three years of sample deaths: 1,51,472 coded deaths for 2022-24 and 1,59,296 for 2021-23.',
              'The report gives four cause groups. Communicable, maternal, perinatal and nutritional conditions are one group.',
              'Ill-defined causes are deaths that could not be diagnosed from the interview. They are 12.9% of deaths among women and 7.4% among men.',
              'The report gives figures for India, regions and zones only. It has no state figures.',
            ],
            processing: [
              'We take the share of deaths in each cause group, for men, women and persons, from Table 2.1A of each report.',
              'We keep the shares as ORGI prints them, to one decimal place.',
              'We show the two latest reports. Their periods overlap, so we do not plot them as a trend.',
            ],
            nextRelease: 'not announced',
          },
        },
        { text: 'Heart and blood vessel diseases caused 32.1% of all deaths in 2022-24. Doctors could not assign a cause to 9.7% of deaths.' },
        {
          chart: {
            kind: 'bars',
            slug: 'top-causes-of-death',
            title: 'Top 10 causes of death in India, 2022-24',
            subtitle: 'Share of all deaths, all ages, women and men, India.',
            punches: { office: 'ORGI · SRS', unit: '% of deaths', period: '2022-24' },
            status: ['Survey estimate'],
            note: 'ORGI ranks ill-defined deaths tenth because no cause could be found for them.',
            sources: [withTable(SRS_COD_2022_24, 'Table 2.3A')],
            format: { unit: '%', decimals: 1 },
            by: 'cause',
            rowHead: 'Cause',
            order: TOP_CAUSES,
            labels: {
              cardiovascular: 'Heart and blood vessel diseases',
              neoplasms: 'Cancer and other neoplasms',
              'respiratory-diseases': 'Respiratory diseases',
              digestive: 'Digestive diseases',
              'respiratory-infections': 'Respiratory infections',
              'fever-unknown-origin': 'Fever of unknown origin',
              'unintentional-injuries-other': 'Accidental injuries, not motor vehicle',
              diabetes: 'Diabetes',
              'genito-urinary': 'Genito-urinary diseases',
              'ill-defined': 'Ill-defined causes',
            },
            series: [
              { key: 'all', label: 'Women and men', color: 'ink', file: COD, where: { table: 'top-10', period: '2022-24', sex: 'person', cause: TOP_CAUSES } },
              { key: 'women', label: 'Women', color: 's3', file: COD, where: { table: 'top-10', period: '2022-24', sex: 'female', cause: TOP_CAUSES } },
              { key: 'men', label: 'Men', color: 's2', file: COD, where: { table: 'top-10', period: '2022-24', sex: 'male', cause: TOP_CAUSES } },
            ],
            know: [
              'ORGI ranks the causes by their share of all deaths. It puts ill-defined deaths tenth, though their share is the second largest, because they have no diagnosis.',
              'The other causes together account for 18.3% of deaths. The data file keeps that row.',
              'In 2021-23 respiratory infections ranked second, at 9.3% of deaths. The data file keeps that list.',
            ],
            processing: [
              'We take the top 10 causes and their shares for men, women and persons from Table 2.3A of the 2022-24 report.',
              'We keep ORGI\'s rank order and its shares, to one decimal place.',
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
            subtitle: 'Children with stunting, wasting or severe wasting, India.',
            punches: { office: 'IIPS', unit: '%', period: '2023-24' },
            status: ['Survey estimate', 'Method break', 'Provisional'],
            note: 'Solid lines cover children under 5, dashed lines children under 3. Both have a value for 2005-06.',
            sources: [withTable(NFHS_3, 'Tables 10.2 and 10.3'), withTable(NFHS_4, 'Table 10.2'), NFHS_6],
            format: { decimals: 1, unit: '%' },
            y: { min: 0, max: 60, step: 10 },
            breaks: [{ x: '2006', before: 'Under 3', label: 'Under 5' }],
            joined: true,
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
              'The under-3 lines cover the last two children of ever-married women. NFHS-3 recalculated NFHS-2 and NFHS-3 on the WHO growth standards.',
              'NFHS-1 used an older growth reference and did not measure height in five states, so it has no comparable estimate.',
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
        {
          chart: {
            kind: 'line',
            slug: 'births-in-health-facilities',
            title: 'Births in health facilities in India, 1992-93 to 2023-24',
            subtitle: 'Share of births in a health facility, India.',
            punches: { office: 'IIPS', unit: '%', period: '2023-24' },
            status: ['Survey estimate', 'Method break', 'Provisional'],
            note: 'The dashed line counts the last two births before the survey; the solid line counts all births. 2005-06 has both.',
            sources: [withTable(NFHS_3, 'Tables 8.12 and 8.23'), withTable(NFHS_4, 'Table 8.27'), NFHS_6],
            format: { decimals: 1, unit: '%' },
            y: { min: 0, max: 100, step: 20 },
            breaks: [{ x: '2006', before: 'Last two births', label: 'All births' }],
            joined: true,
            series: [
              { ...nfhsTrend('last-two', 'Last two births', 'ink', 'institutional-births', 'last-two-births'), dash: true },
              nfhsTrend('all', 'Facility births', 'ink', 'institutional-births', 'all-births'),
            ],
            know: [
              'The NFHS-3 report aligns the first three rounds to the last two births in the prior three years.',
              'The early definition covers ever-married women only. In 2005-06 it gives 40.8%, and the later definition gives 38.7%.',
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
            subtitle: 'Children aged 12 to 23 months with all basic doses, India.',
            punches: { office: 'IIPS', unit: '%', period: '2023-24' },
            status: ['Survey estimate', 'Method break', 'Provisional'],
            note: 'From NFHS-5 the survey counts the pentavalent vaccine as well as DPT. The break marks this change.',
            sources: [withTable(NFHS_1, 'Table 9.10'), withTable(NFHS_2, 'Table 6.9'), withTable(NFHS_3, 'Tables 9.3 and 9.6'), withTable(NFHS_4, 'Tables 9.3 and 9.6'), NFHS_6],
            format: { decimals: 1, unit: '%' },
            y: { min: 0, max: 100, step: 20 },
            breaks: [{ x: '2020', label: 'NFHS-5 method' }],
            joined: true,
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
              'In the first four rounds, the card-seen rate covers only children whose cards the interviewer saw. Do not compare it with the later fact-sheet rates.',
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
            subtitle: 'Women aged 15 to 49 with anaemia, India.',
            punches: { office: 'IIPS', unit: '%', period: '2019-21' },
            status: ['Survey estimate', 'Method break'],
            note: 'NFHS-6 did not report anaemia. MoHFW moved the measure to a separate survey, which has not published results.',
            sources: [withTable(NFHS_3, 'Table 10.24.1'), withTable(NFHS_4, 'Table 10.21.1'), PIB_ANAEMIA],
            format: { decimals: 1, unit: '%' },
            y: { min: 45, max: 60, step: 5 },
            breaks: [{ x: '2006', before: 'Ever married', label: 'All women' }],
            joined: true,
            series: [
              { ...nfhsTrend('ever-married', 'Ever-married women', 'ink', 'anaemia-women-15-49', 'ever-married-women'), dash: true },
              nfhsTrend('all', 'All women', 'ink', 'anaemia-women-15-49', 'all-women'),
            ],
            know: [
              'The survey uses a finger-prick blood sample to measure haemoglobin.',
              'The threshold is below 12 grams per decilitre for women who are not pregnant and below 11 for pregnant women.',
              'NFHS-2 tested ever-married women only. NFHS-3 reported both groups and left out Nagaland. NFHS-1 did not test haemoglobin.',
              'MoHFW moved the measure to the ICMR-NIN Diet and Biomarkers Survey (DABS-I). It uses venous blood and has not published results.',
            ],
            processing: [
              'Take the estimates for ever-married women from Table 10.24.1 of the NFHS-3 report.',
              'Take the estimates for all women from the NFHS-3 and NFHS-4 reports and PIB release 1782638.',
              'Use each source’s estimate for any anaemia, which includes mild, moderate and severe anaemia.',
            ],
            nextRelease: 'not announced',
          },
        },
        { text: 'Stunting fell in 33 of the 35 states and UTs surveyed. It rose only in Andaman and Nicobar Islands and Lakshadweep, which have small samples.' },
        {
          chart: {
            kind: 'dots',
            slug: 'stunting-by-state',
            title: 'Child stunting by state and UT, 2015-16 to 2023-24',
            subtitle: 'Share of children under 5 who are too short for their age.',
            punches: { office: 'IIPS', unit: '%', period: '2023-24' },
            status: ['Survey estimate', 'Provisional'],
            note: 'Three UTs have no 2015-16 value because their boundaries changed. NFHS-6 did not survey Manipur.',
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
              'NFHS-4 to NFHS-6 use the same WHO growth standards.',
              'NFHS-4 reports Andhra Pradesh and Telangana separately.',
              'NFHS-4 used older boundaries for Jammu and Kashmir, Ladakh, and Dadra and Nagar Haveli and Daman and Diu, so those rows start at NFHS-5.',
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
      lede: "Households paid 42.7% of India's health bill from their own pockets in 2023-24, down from 64.2% in 2013-14. The government paid 43.5%.",
      blocks: [
        { text: 'The National Health Accounts say a new household survey in 2017-18 may explain part of the fall.' },
        {
          chart: {
            kind: 'line',
            slug: 'out-of-pocket-health-spending',
            title: 'Out-of-pocket and government health spending shares, India, 2000 to 2023-24',
            subtitle: 'Shares of health spending paid by households and by government, India.',
            punches: { office: 'MoHFW · WHO', unit: '% of spending', period: '2000 to 2023-24' },
            status: ['Method break'],
            note: 'Solid lines and dots: Indian accounts, % of total spending. Dashed lines: WHO estimates, % of current spending.',
            sources: [
              withTable(NHA_2023_24, 'Table 1'), withTable(NHA_2013_14, 'Table 6'),
              withTable(NHA_2004_05, 'Tables 1.1, 1.5 and 4.1'), withTable(NCMH, 'Figure 2.5 and Table 2.14'), WHO_GHED,
            ],
            format: { decimals: 1, unit: '%' },
            y: { min: 0, max: 80, step: 20 },
            breaks: [
              { x: '2013', label: 'Annual NHA starts' },
              { x: '2017', label: 'New survey' },
              { x: '2022', label: 'New sources' },
            ],
            callouts: [
              { series: 'public-provisional', x: '2007', label: 'Government (provisional)' },
            ],
            series: [
              // WHO runs unbroken from 2000, beside the Indian accounts where both exist.
              healthSpendingSeries('oope-who', 'Out of pocket (WHO)', 's7', { series: 'oope-share-of-che', source_kind: 'international estimate', use: ['chart', 'overlap'] }, true),
              healthSpendingSeries('ghe-who', 'Government (WHO)', 's6', { series: 'gghed-share-of-che', source_kind: 'international estimate', use: ['chart', 'overlap'] }, true),
              ...([
                ['oope', 'Out of pocket', 's7', 'oope-share-of-the'],
                ['ghe', 'Government', 's6', 'ghe-share-of-the'],
              ] as const).flatMap(([key, label, color, series]) => [
                healthSpendingSeries(`${key}-2001`, label, color, { series, period: '2001-02', source_kind: 'archived copy' }),
                healthSpendingSeries(`${key}-2004`, label, color, { series, period: '2004-05', source_kind: key === 'oope' ? 'archived copy' : 'official' }),
                healthSpendingSeries(`${key}-nss71`, label, color, { series, source: 'nha-2023-24', period: ['2013-14', '2014-15', '2015-16', '2016-17'] }),
                healthSpendingSeries(key, label, color, { series, source: 'nha-2023-24', period: ['2017-18', '2018-19', '2019-20', '2020-21', '2021-22', '2022-23', '2023-24'] }),
              ]),
              healthSpendingSeries('public-provisional', 'Government (provisional)', 's6', { series: 'public-share-of-the', source_kind: 'archived copy' }),
            ],
            know: [
              'Out-of-pocket spending is what households pay directly for care. Governments, insurers and others pay other shares.',
              'Total health expenditure includes capital spending. Current health expenditure excludes it. WHO counts domestic general government spending.',
              'The early Indian accounts used a different method. Public spending from 2005-06 to 2008-09 is provisional.',
              'The accounts used the 2014 household survey through 2016-17. A new survey with a bigger sample first informed the 2017-18 figures.',
              'The 2022-23 accounts added new data sources. The out-of-pocket share rose from 39.4% to 43.4% that year.',
            ],
            processing: [
              'Draw the Indian accounts where they give a share, and the WHO estimates for every year from 2000 beside them.',
              'Keep the 2001-02 and 2004-05 figures separate. Split the annual Indian series when the household survey changes in 2017-18.',
              'Compare the shares by the start year of each Indian financial year. Keep the overlapping WHO figures in the data file.',
            ],
            nextRelease: 'not announced',
          },
        },
        { text: "Uttar Pradesh households paid the most, 67.1% of the state's health bill. Uttarakhand households paid the least, 26.7%." },
        {
          chart: {
            kind: 'states',
            slug: 'out-of-pocket-health-spending-by-state',
            title: 'Out-of-pocket share of health spending by state, 2023-24',
            subtitle: 'Share of total health spending that households pay directly, 21 states.',
            punches: { office: 'NHSRC', unit: '% of total', period: '2023-24' },
            note: 'Only 21 states have large enough samples. A high share need not mean hardship: Kerala also spends much per person.',
            sources: [withTable(NHA_2023_24, 'Table A.6')],
            format: { decimals: 1, unit: '%' },
            // LATER: the board gives this frame Chart and Table tabs only, no Map (21 states); 'states' always has a Map tab.
            data: { file: 'health/out-of-pocket-health-spending.csv', where: { series: 'oope-share-of-the', period: '2023-24' } },
            open: 'chart',
            scale: 'seq',
            short: 'Out-of-pocket share',
            know: [
              'NHSRC gives shares for 21 states only. Assam is the only North-Eastern one. Other states and UTs, including Delhi and Goa, have samples too small.',
              'State shares still rest on the NSS 75th round (2017-18).',
              'A high share does not on its own show hardship. Kerala\'s share, 65.2%, sits beside total spending of ₹13,605 per person.',
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
            subtitle: 'Deaths before age one, 36 states and UTs. Smaller states and UTs: 2022-24.',
            punches: { office: 'ORGI', unit: 'per 1,000', period: '2024' },
            status: ['Survey estimate'],
            note: "Compare each state with its own group. Manipur's rate of 2 rests on a small sample.",
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
              'SRS gives a single-year rate for India and the 21 bigger states. The 15 smaller states and UTs get a three-year pool, 2022-24.',
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
            subtitle: 'Deaths from pregnancy or childbirth, 19 states. The chart shows 95% confidence intervals.',
            punches: { office: 'ORGI', unit: 'per 1,00,000', period: '2022-24' },
            status: ['Survey estimate'],
            note: 'SRS groups the other states and UTs into one ratio. The intervals are wide: small gaps may not be real.',
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
              'The 95% confidence intervals are wide, so small gaps may not be real. Kerala\'s runs from 0 to 50, Chhattisgarh\'s from 48 to 199.',
              'The bulletin also gives three regional subtotals. This chart does not show them.',
            ],
            processing: [
              'We take each ratio and its 95% confidence interval from Table 1 of the SRS Special Bulletin on Maternal Mortality 2022-24.',
              'We rank the states by the published ratio and show the group as one bar.',
              'We keep the ratios and the interval limits as ORGI prints them, as whole numbers.',
            ],
            nextRelease: 'not announced',
          },
        },
        { text: 'Nagaland registered 26.8% of the deaths that ORGI estimates for 2024, and Arunachal Pradesh 43.7%. Across India the share was 99.4%.' },
        {
          chart: {
            kind: 'dots',
            slug: 'registration-of-births-and-deaths-by-state',
            title: 'Registration of births and deaths by state and UT, 2024',
            subtitle: 'Registered births and deaths as a share of the births and deaths ORGI estimates, 36 states and UTs.',
            punches: { office: 'ORGI · CRS', unit: '% of estimated', period: '2024' },
            note: 'ORGI prints 100.0% for each state that registers more events than it estimates.',
            sources: [withTable(CRS_2024, 'Statement 2')],
            format: { decimals: 1, unit: '%' },
            by: 'geography',
            pin: ['india'],
            sortBy: 'deaths',
            axis: { min: 0, max: 100 },
            map: { series: 'deaths', scale: 'seq', better: 'high' },
            series: [
              { key: 'deaths', label: 'Deaths', color: 's8', file: 'health/crs-registration-level-by-state-2024.csv', x: 'geography', where: { event: 'deaths' }, note: 'note' },
              { key: 'births', label: 'Births', color: 's5', file: 'health/crs-registration-level-by-state-2024.csv', x: 'geography', where: { event: 'births' }, note: 'note' },
            ],
            know: [
              'The Civil Registration System (CRS) counts the births and deaths that people register. Registered counts are not true totals: an event that nobody registers is not counted.',
              'ORGI computes the level of registration against estimated events. It multiplies the SRS birth or death rate by the projected mid-year population, and divides the registered events by that estimate.',
              'ORGI prints 100.0% where registered events exceed the estimate. It says events are registered where they happen, while SRS counts people where they live, and that SRS estimates for small states can be low.',
              'India\'s level divides all registered events by all estimated events, so it is not capped at 100.',
              'The mid-year populations come from the 2011-based projections of the National Commission on Population.',
            ],
            processing: [
              'We take the estimated births and deaths and the level of registration for India and each state and UT from Statement 2 of the CRS report 2024.',
              'We add the registered births and deaths for 2024 from Statements 10 and 11, and check that the states add up to India.',
              'We check that each estimate equals the state\'s SRS 2024 rate times its mid-year population.',
              'The data file also keeps our own ratio of registered to estimated events, marked derived. It is not capped at 100.',
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
      'The Registrar General of India (ORGI) runs the Sample Registration System (SRS), a survey of births and deaths, and compiles the Civil Registration System (CRS) of registered births and deaths. IIPS runs the National Family Health Survey (NFHS) for MoHFW. NHSRC compiles the National Health Accounts.',
    frequency:
      'SRS Bulletin: yearly, latest 20 May 2026. Maternal mortality, life tables and causes of death: pooled periods, with the bulletin. CRS: yearly, 2024 report on 1 Jul 2026. NFHS: every few years, NFHS-6 on 29 May 2026. Health accounts: yearly, latest November 2026.',
    revisions:
      'NFHS-6 results are provisional, as the fact sheets say. The NFHS-5 values shown are as printed in the NFHS-6 fact sheets. The National Health Accounts added new data sources in 2022-23.',
    breaks:
      'Infant mortality excludes J&K in 1991 to 1997, life expectancy in 1987-91 to 1997-01. Life expectancy periods overlap from 1987-91. Maternal mortality skips 2012-14 and 2013-15. Health accounts break in 2017-18 and 2022-23.',
    coverage:
      'Infant mortality: all 36 states and UTs. Life tables: India and 22 states. Maternal mortality: 19 states and one group for the rest. Causes of death: India only. CRS: all 36 states and UTs. NFHS-6: 35 states and UTs, not Manipur. Health accounts: 21 states.',
    missing:
      'NFHS-6 reports no anaemia and no infant or child mortality. SRS gives no life expectancy, under-5 or neonatal mortality for smaller states and UTs, and causes of death for no state. No publisher states a reuse licence.',
  },
  sources: [
    SRS_BULLETIN_2024, SRS_MMR_2022_24, SRS_LIFE_TABLES, SRS_COD_2022_24, SRS_COD_2021_23, CRS_2024, SRS_COMPENDIUM, ...SRS_BIRTH_RATIO_REPORTS,
    NFHS_1, NFHS_2, NFHS_3, NFHS_4, NFHS_5, NFHS_6, PIB_ANAEMIA, NHA_2023_24, NHA_2013_14, NHA_2004_05, NCMH, WHO_GHED,
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
