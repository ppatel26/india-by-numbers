import type { Chart, Series, Source, Topic } from '../types'
import { sexRatioAtBirthIndia } from './health'

// Data: research/data/population/README.md.


const CENSUS_URL_A02 =
  'https://censusindia.gov.in/nada/index.php/catalog/43333/download/47001/00%20A%202-India.xls'
const SRS_REPORT_URL =
  'https://censusindia.gov.in/nada/index.php/catalog/47152/download/51396/SRS_STAT_2024.pdf'

const censusA02: Source = {
  publisher: 'ORGI',
  release: 'Census of India 2011, Table A-02, Decadal variation in population 1901-2011',
  released: '2022-06-01',
  url: CENSUS_URL_A02,
}

const censusA02States: Source = {
  publisher: 'ORGI',
  release: 'Census of India 2011, Table A-02, Decadal variation in population 1901-2011, India and States',
  released: '2022-06-01',
  url: CENSUS_URL_A02,
}

const censusA01: Source = {
  publisher: 'ORGI',
  release: 'Census of India 2011, Table A-01, Number of villages, towns, households, population and area',
  released: '2022-05-05',
  url: 'https://censusindia.gov.in/nada/index.php/catalog/42526/download/46152/A-1_NO_OF_VILLAGES_TOWNS_HOUSEHOLDS_POPULATION_AND_AREA.xlsx',
}

const censusC14: Source = {
  publisher: 'ORGI',
  release: 'Census of India 2011, Table C-14, Population in five year age-group by residence and sex',
  released: '2021-01-19',
  url: 'https://censusindia.gov.in/nada/index.php/catalog/1541/download/4618/DDW-0000C-14.xls',
}

const srsReport: Source = {
  publisher: 'ORGI',
  release: 'SRS Statistical Report 2024',
  released: '2026-05-20',
  url: SRS_REPORT_URL,
}

const srsReportT15: Source = { ...srsReport, release: 'SRS Statistical Report 2024, Table 15' }
const srsReportT16: Source = { ...srsReport, release: 'SRS Statistical Report 2024, Table 16' }

const srsBulletin: Source = {
  publisher: 'ORGI',
  release: 'SRS Bulletin 2024, Volume 59 No. 1',
  released: '2026-05-20',
  url: 'https://censusindia.gov.in/nada/index.php/catalog/47150/download/51394/SRS_Bulletin_2024_Vol_59_No_1.pdf',
}

const srsBulletinT1: Source = { ...srsBulletin, release: 'SRS Bulletin 2024, Volume 59 No. 1, Table 1' }

// The report is dated July 2020 and gives no day.
const projections: Source = {
  publisher: 'MoHFW, National Commission on Population',
  release: 'Population Projections for India and States 2011-2036, Report of the Technical Group',
  released: '2020-07',
  url: 'https://www.mohfw-dohfw.gov.in/static/uploads/2025/10/1c3c2048814bd3747f44e661f8547055.pdf',
}

const projectionsTable = (table: string): Source => ({
  ...projections,
  release: `Population Projections for India and States 2011-2036, July 2020, Table ${table}`,
  url: 'https://web.archive.org/web/20251213143513id_/https://mohfw.gov.in/sites/default/files/Population%20Projection%20Report%202011-2036%20-%20upload_compressed_0.pdf',
})

const srsCompendium: Source = {
  publisher: 'ORGI',
  release: "SRS Compendium of India's Fertility and Mortality Indicators 1971-2013, Table 1",
  released: '2014',
  url: 'https://censusindia.gov.in/nada/index.php/catalog/33218/download/37035',
}

const srsReport2018: Source = {
  publisher: 'ORGI',
  release: 'SRS Statistical Report 2018, Tables 12, 13 and 15',
  released: '2020-06-01',
  url: 'https://censusindia.gov.in/nada/index.php/catalog/44374/download/48044/SRS_STAT_2018.pdf',
}

const wpp: Source = {
  publisher: 'United Nations Population Division',
  release: 'World Population Prospects 2024, Demographic Indicators, Medium variant',
  released: '2024-07-11',
  url: 'https://population.un.org/wpp/assets/Excel%20Files/1_Indicator%20(Standard)/CSV_FILES/WPP2024_Demographic_Indicators_Medium.csv.gz',
}

const wppAge: Source = {
  ...wpp,
  release: 'World Population Prospects 2024, Population by five-year age group and sex',
  url: 'https://population.un.org/wpp/assets/Excel%20Files/1_Indicator%20(Standard)/CSV_FILES/WPP2024_PopulationByAge5GroupSex_Medium.csv.gz',
}

const census1961: Source = {
  publisher: 'ORGI',
  release: 'Census 1961, Social and Cultural Tables, Table C-III Part A',
  released: 'not stated',
  url: 'https://censusindia.gov.in/nada/index.php/catalog/32022/download/35203/22949_1961_SCT.pdf',
}

const censusUrbanHistory: Source = {
  publisher: 'ORGI',
  release: 'Study on Distribution of Infrastructural Facilities and Levels and Trends of Urbanisation, Appendix Table VI.2',
  released: 'not stated',
  url: 'https://censusindia.gov.in/nada/index.php/catalog/32083/download/35264/28075_1991_INF.pdf',
}

const census1991Urban: Source = {
  publisher: 'IIPS',
  release: 'National Family Health Survey 1992-93, Table 1.1, citing ORGI Census 1991',
  released: '1995-08',
  url: 'https://dhsprogram.com/pubs/pdf/FRIND1/FRIND1.pdf',
}

const census2001Pca: Source = {
  publisher: 'ORGI',
  release: 'Census 2001, Primary Census Abstract, India',
  released: 'not stated',
  url: 'https://censusindia.gov.in/nada/index.php/catalog/20614/download/23746/PC01_PCA_TOT_00_00.xls',
}

const projectionsT8 = projectionsTable('8')

// The board lists the five gazette notifications on one line; the model takes one URL per source.
const gazettes: readonly Source[] = [
  {
    publisher: 'ORGI',
    release: 'Gazette S.O. 2681(E), Census 2027 to be taken, with reference dates',
    released: '2025-06-16',
    url: 'https://censusindia.gov.in/nada/index.php/catalog/45572/download/49769/GAZ_NOTIFICATION_07.pdf',
  },
  {
    publisher: 'ORGI',
    release: 'Gazette S.O. 99(E), house-listing, 1 Apr to 30 Sep 2026',
    released: '2026-01-07',
    url: 'https://censusindia.gov.in/nada/index.php/catalog/47084/download/51329/GAZ_NOTIFICATION_10.pdf',
  },
  {
    publisher: 'ORGI',
    release: 'Gazette S.O. 4301(E), count in Ladakh and snow-bound areas',
    released: '2026-08-03',
    url: 'https://censusindia.gov.in/nada/index.php/catalog/47160/download/51406/GAZ_NOTIFICATION_13.pdf',
  },
  {
    publisher: 'ORGI',
    release: 'Gazette S.O. 4729(E), count in Goa, Uttar Pradesh, Punjab and Uttarakhand',
    released: '2026-09-05',
    url: 'https://censusindia.gov.in/nada/index.php/catalog/47171/download/51418/GAZ_NOTIFICATION_18.pdf',
  },
  {
    publisher: 'ORGI',
    release: 'Gazette S.O. 5913(E), count in all other states and UTs, 25 Jan to 28 Feb 2027',
    released: '2026-10-30',
    url: 'https://censusindia.gov.in/nada/index.php/catalog/47179/download/51426/GAZ_NOTIFICATION_20.pdf',
  },
]

const AGE_GROUPS = [
  '0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', '40-44',
  '45-49', '50-54', '55-59', '60-64', '65-69', '70-74', '75-79', '80+',
] as const

const TFR = 'population/tfr-by-state-2019-2024.csv'
const BIRTH_DEATH = 'population/birth-death-rates-by-state-2024.csv'
const SRB = 'population/sex-ratio-at-birth-by-state.csv'
const PROJ = 'population/population-projections-2011-2036.csv'
const PYRAMID = 'population/population-pyramid-2011.csv'
const PYRAMID_HISTORY = 'population/population-pyramid-1951-2026.csv'
const URBAN_PROJECTION = 'population/urban-share-projected-2012-2026.csv'
const CENSUS_COUNTS = 'population/population-census-1901-2011.csv'
const SRB_HISTORY = 'population/sex-ratio-at-birth-india-1950-2026.csv'
const PROJECTED_RATES = 'population/vital-rates-projected-by-state.csv'

function agePyramid(period: '1951' | '1961' | '2026'): Chart {
  const projected = period === '2026'
  const historicalCensus = period === '1961'
  return {
    kind: 'pyramid',
    slug: `population-pyramid-${period}`,
    title: `Population by age and sex in India, ${period}`,
    subtitle: projected
      ? 'Share of all people in each age group and sex, India, 1 March.'
      : historicalCensus
        ? 'People by age group and sex, India. Groups from age 35 span more years.'
        : 'Share of all people in each age group and sex, India, 1 July.',
    punches: { office: projected ? 'MoHFW · NCP' : historicalCensus ? 'ORGI' : 'UN', unit: 'persons', period },
    ...(projected ? { status: ['Projection'] } : {}),
    ...(historicalCensus ? { note: 'Excludes part of the North-East Frontier Agency, and people whose age was unknown.' } : {}),
    sources: [projected ? projectionsTable('18') : historicalCensus ? census1961 : wppAge],
    format: { scale: 'crore' },
    by: 'age_group',
    left: {
      key: 'men', label: 'Men', color: 's2',
      file: PYRAMID_HISTORY, where: { period, sex: 'male' }, x: 'age_group',
    },
    right: {
      key: 'women', label: 'Women', color: 's3',
      file: PYRAMID_HISTORY, where: { period, sex: 'female' }, x: 'age_group',
    },
    processing: projected
      ? ['Read age and sex totals in thousands from Table 18. Multiply by 1,000 to get persons.']
      : historicalCensus
        ? ['Read the national male and female counts by age group from Table C-III Part A.']
        : ['Read the UN estimates by age and sex. Add all age groups from age 80 to get the 80+ group.'],
  }
}

const vitalSources = [wpp, srsCompendium, srsReport2018, { ...srsReport, release: 'SRS Statistical Report 2024, Tables 12, 13 and 15' }]

function vitalSeries(metric: string, label: string, color: Series['color']): Series[] {
  return [
    { basis: 'wpp_estimate', label: `${label} (UN estimate)`, dash: true },
    { basis: 'srs', label: `${label} (SRS)`, dash: false },
    { basis: 'wpp_projection', label: `${label} (UN projection)`, dash: true },
  ].map(({ basis, label, dash }) => ({
    key: `${metric}-${basis}`, label, dash, color,
    file: 'population/vital-rates-india-1950-2026.csv',
    where: { series: metric, basis },
  }))
}

const fertilityIndia: Chart = {
  slug: 'fertility-rate-india',
  kind: 'line',
  title: 'Total fertility rate in India, 1950 to 2026',
  subtitle: 'Children a woman would have at the year’s rates, India. 2.1 is replacement level.',
  punches: { office: 'ORGI · UN', unit: 'per woman', period: '1950-2026' },
  status: ['Survey estimate', 'Projection'],
  note: 'Solid lines are SRS sample estimates, 1971 to 2024. Dashed lines are UN estimates and projections.',
  sources: vitalSources,
  format: { decimals: 2 },
  y: { min: 0, max: 7, step: 1 },
  breaks: [{ x: '1971', label: 'SRS starts' }],
  series: vitalSeries('fertility_rate', 'Fertility', 'ink'),
  refs: [{ y: 2.1, label: '2.1' }],
  know: [
    'The MoHFW fertility assumptions cover five-year periods. The UN publishes a value for each year.',
    'The SRS estimates come from a sample survey. The UN uses a statistical model.',
  ],
}

const vitalRatesIndia: Chart = {
  slug: 'birth-death-rates-india',
  kind: 'line',
  title: 'Birth and death rates in India, 1950 to 2026',
  subtitle: 'Live births and deaths per 1,000 people per year, India.',
  punches: { office: 'ORGI · UN', unit: 'per 1,000', period: '1950-2026' },
  status: ['Survey estimate', 'Projection'],
  note: 'Solid lines are SRS sample estimates, 1971 to 2024. Dashed lines are UN estimates and projections.',
  sources: vitalSources,
  format: { decimals: 2 },
  y: { min: 0, max: 50, step: 10 },
  breaks: [{ x: '1971', label: 'SRS starts' }],
  series: [...vitalSeries('birth_rate', 'Births', 's5'), ...vitalSeries('death_rate', 'Deaths', 's8')],
  know: ['MoHFW publishes rates for five-year periods. The UN publishes a value for each year.'],
}

function projectedRate(metric: string, label: string, color: Series['color']): Series {
  return {
    key: metric, label, color, file: PROJECTED_RATES,
    where: { series: metric }, x: 'geography',
  }
}

const projectedFertilityStates: Chart = {
  slug: 'fertility-rate-by-state-projected',
  kind: 'dots',
  title: 'Assumed fertility rate by state and UT, 2026-30',
  subtitle: 'Children per woman assumed for each state and UT.',
  punches: { office: 'MoHFW · NCP', unit: 'per woman', period: '2026-30' },
  status: ['Projection'],
  note: 'One rate covers the five years. The north-eastern states other than Assam share one rate.',
  sources: [projectionsTable('3')],
  format: { decimals: 2 },
  pin: ['india'],
  axis: { min: 1, max: 3.5 },
  refs: [{ value: 2.1, label: 'Replacement level 2.1' }],
  series: [projectedRate('fertility_rate', 'MoHFW assumption', 's1')],
}

const projectedVitalRatesStates: Chart = {
  slug: 'birth-death-rates-by-state-projected',
  kind: 'dots',
  title: 'Projected birth and death rates by state and UT, 2026-30',
  subtitle: 'Live births and deaths per 1,000 people per year, by state and UT.',
  punches: { office: 'MoHFW · NCP', unit: 'per 1,000', period: '2026-30' },
  status: ['Projection'],
  note: 'MoHFW gives rates for 22 states and UTs. The north-eastern states other than Assam share one rate.',
  sources: [projectionsTable('17A')],
  format: { decimals: 1 },
  pin: ['india'],
  axis: { min: 0, max: 30 },
  series: [projectedRate('birth_rate', 'Projected birth rate', 's5'), projectedRate('death_rate', 'Projected death rate', 's8')],
}

const projectedBirthRatioStates: Chart = {
  slug: 'sex-ratio-at-birth-by-state-projected',
  kind: 'dots',
  title: 'Assumed sex ratio at birth by state and UT, 2026',
  subtitle: 'Assumed girls born per 1,000 boys, by state and UT.',
  punches: { office: 'MoHFW · NCP', unit: 'per 1,000 boys', period: '2026' },
  status: ['Projection'],
  note: 'MoHFW gives ratios for 22 states and UTs.',
  sources: [projectionsTable('6')],
  format: { decimals: 0 },
  pin: ['india'],
  axis: { min: 840, max: 1000 },
  refs: [{ value: 1000, label: '' }],
  series: [projectedRate('sex_ratio_at_birth', 'MoHFW assumption', 's1')],
}

const birthRatioIndia: Chart = {
  slug: 'sex-ratio-at-birth-india',
  kind: 'line',
  title: 'Sex ratio at birth in India, 1950 to 2022-24',
  subtitle: 'Girls born per 1,000 boys, India. SRS values are three-year averages.',
  punches: { office: 'ORGI · UN', unit: 'per 1,000 boys', period: '1950 to 2022-24' },
  status: ['Survey estimate'],
  note: 'Each SRS value sits at the middle year of its three-year period.',
  sources: [wpp, ...sexRatioAtBirthIndia.sources],
  format: { decimals: 0 },
  y: { min: 870, max: 970, step: 20 },
  breaks: [{ x: '1999', label: 'SRS starts' }],
  series: [
    { key: 'un', label: 'UN estimate', color: 'slate', dash: true, file: SRB_HISTORY, x: 'year', xLabel: 'period', where: { basis: 'wpp_estimate' } },
    { key: 'srs', label: 'SRS sample estimate', color: 'ink', file: SRB_HISTORY, x: 'year', xLabel: 'period', where: { basis: 'srs' } },
  ],
  processing: [
    'Convert the UN ratio from boys per 100 girls to girls per 1,000 boys.',
    'Use the SRS national ratio for each three-year period from 1998-00 to 2022-24.',
  ],
  know: [
    'The SRS estimates the ratio from a sample of births. It changed its sample in 2004 and 2014.',
    'Each UN estimate uses one year. Each SRS period shares two years with the next period.',
    'MoHFW published state assumptions for 2026 in July 2020. The state view shows them as assumptions.',
    'The line stops at 2022-24. The MoHFW 2026 assumption (905, made in 2020) and the UN projection (937) sit on different levels from SRS.',
  ],
}

const growthIndia: Chart = {
  slug: 'population-growth-india',
  kind: 'line',
  title: 'Average annual population growth in India, 1901 to 2026',
  subtitle: 'Average yearly growth between censuses, India, and from 2011 to the 2026 projection.',
  punches: { office: 'ORGI · MoHFW', unit: '% per year', period: '1901-2026' },
  status: ['Projection'],
  sources: [censusA02, projectionsTable('8')],
  format: { unit: '%', decimals: 2 },
  y: { min: -0.5, max: 2.5, step: 0.5 },
  series: [
    { key: 'census', label: 'Census', color: 'ink', file: 'population/population-growth-india-1901-2026.csv', x: 'year', xLabel: 'period', where: { source_kind: 'official' } },
    { key: 'projection', label: 'MoHFW projection', color: 's1', file: 'population/population-growth-india-1901-2026.csv', x: 'year', xLabel: 'period', where: { source_kind: 'official projection' } },
  ],
  processing: ['Divide the end count by the start count. Take the root for the number of years in the period. Subtract one and multiply by 100.'],
}

const projectedGrowthStates: Chart = {
  slug: 'population-growth-by-state-2026',
  kind: 'states',
  title: 'Projected population growth by state and UT, 2011 to 2026',
  subtitle: 'Change from Census 2011 to the projected population on 1 March 2026.',
  note: 'MoHFW gives separate figures for Telangana and Ladakh.',
  punches: { office: 'MoHFW · NCP', unit: '% change', period: '2011-2026' },
  status: ['Projection'],
  sources: [projectionsTable('8')],
  format: { unit: '%', decimals: 2 },
  data: { file: 'population/population-growth-by-state-2011-2026.csv', note: 'note' },
  open: 'map',
  scale: 'seq',
  bins: [10, 20, 30],
  short: 'Projected population growth',
  processing: ['Divide the change in population by the 2011 base in Table 8. Multiply by 100. Use the same boundaries for both years.'],
}

const projectedUrbanStates: Chart = {
  slug: 'urban-share-by-state-2026',
  kind: 'states',
  title: 'Projected urban share by state and UT, 2026',
  subtitle: 'Share of each state’s people in urban areas, on 1 March 2026.',
  punches: { office: 'MoHFW · NCP', unit: '% of people', period: '2026' },
  status: ['Projection'],
  sources: [projectionsTable('10'), projectionsTable('9'), projectionsTable('8')],
  format: { unit: '%', decimals: 2 },
  data: { file: URBAN_PROJECTION, where: { period: '2026' } },
  open: 'map',
  scale: 'seq',
  short: 'Projected urban share',
  processing: [
    'Read the share for each state and UT from Table 10.',
    'For Dadra and Nagar Haveli and Daman and Diu, add the urban totals in Table 9 and divide by the combined population from Table 8.',
  ],
}

const urbanIndia: Chart = {
  slug: 'urban-share-india',
  kind: 'line',
  title: 'Urban share of people in India, 1901 to 2026',
  subtitle: 'Share of India’s people in urban areas, at each census and in the projection.',
  punches: { office: 'ORGI · MoHFW', unit: '% of people', period: '1901-2026' },
  status: ['Projection'],
  note: 'The Census definition of urban areas changed over time.',
  sources: [censusUrbanHistory, census1991Urban, census2001Pca, censusA01, projectionsTable('10')],
  format: { unit: '%', decimals: 2 },
  y: { min: 0, max: 40, step: 10 },
  series: [
    { key: 'census', label: 'Census', color: 'ink', file: 'population/urban-share-india-1901-2011.csv', note: 'source' },
    { key: 'projection', label: 'MoHFW projection', color: 's1', dash: true, file: URBAN_PROJECTION, where: { geography: 'india' } },
  ],
  know: [
    'The 1981 share includes an estimate for Assam, where the census did not take place.',
    'The IIPS report gives the 1991 Census share. The 1991 census did not take place in Jammu and Kashmir.',
    'MoHFW projects the urban share for 1 March of each year.',
  ],
}

const topic: Topic = {
  slug: 'population',
  name: 'Population',
  hindi: 'जनसंख्या',
  question: 'How many people live in India, and how fast has the number grown since 1901?',
  standfirst:
    'India had a projected 142.6 crore people on 1 March 2026. Census 2011 counted 121.09 crore.',
  figures: [
    {
      chart: 'population-projection',
      series: 'projection',
      x: '2026',
      label: 'People in India, projected',
      period: '1 Mar 2026',
    },
    { chart: 'fertility-rate-by-state', series: '2024', x: 'india', label: 'Children per woman (fertility rate)' },
    { chart: 'sex-ratio-at-birth-by-state', series: '2022-24', x: 'india', label: 'Girls born for every 1,000 boys' },
  ],
  nextRelease: 'Census 2027 first results, not announced',
  parts: [
    {
      title: 'How many people live in India?',
      lede: 'India had 121.1 crore people at Census 2011, up from 36.1 crore in 1951. MoHFW projects 142.6 crore for 1 March 2026.',
      blocks: [
        {
          chart: {
            slug: 'population-by-census',
            kind: 'line',
            title: "India's population, 1901 to 2026",
            subtitle: 'People in India: census counts to 2011, then projections to 2026.',
            punches: { office: 'ORGI', unit: 'persons', period: '1901-2026' },
            status: ['Projection'],
            sources: [censusA02, projectionsT8],
            format: { scale: 'crore' },
            y: { min: 0, max: 1600000000, step: 400000000 },
            series: [
              {
                key: 'population',
                label: 'Census count',
                color: 'ink',
                file: CENSUS_COUNTS,
                y: 'population',
              },
              {
                key: 'projected',
                label: 'Projected',
                color: 'ink',
                dash: true,
                file: PROJ,
                where: { geography: 'india', period: Array.from({ length: 16 }, (_, i) => String(2011 + i)) },
                multiply: 1000,
              },
            ],
            callouts: [
              { series: 'population', x: '1901' },
              { series: 'population', x: '1951' },
              { series: 'population', x: '2011', label: 'Census 2011: 121.1 crore' },
            ],
            // LATER: the board also labels 2011; a callout on the last column is cut off.
            know: [
              'Census 2011 is the latest full count. Its reference date was 00:00 on 1 March 2011.',
              'Assam had no census in 1981, and Jammu and Kashmir none in 1991. The India totals for those years include interpolated figures from ORGI.',
              'The 2001 total includes an estimate for the Mao Maram, Paomata and Purul sub-divisions of Senapati district, Manipur.',
              'The decade to 1921 is the only one in which the count fell (−0.31%).',
              'Census 2027 is under way. Its results will be the first new count since 2011.',
              'From 2012 the line is a MoHFW projection (July 2020), not a count. It starts from Census 2011 and SRS trends.',
            ],
            processing: [
              'Read the India population at each census, 1901 to 2011, from Table A-02 (Excel).',
              'Read the projections for 1 March 2011 to 2026 from Table 8, in thousands. Multiply by 1,000. The CSV keeps the published thousands.',
              'Check the 2011 growth rate, 17.70%, against the PDF of the same table.',
              'Keep the change since the previous census as ORGI publishes it, in persons and in percent.',
              'Carry the A-02 footnotes into the note column: the interpolated years and the Senapati estimate.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: "How old is India's population?",
      // The board adds an SRS 2024 age split (24.0% aged 0 to 14, 9.7% aged 60+). No CSV holds it
      // (SRS Statistical Report 2024, Statement 3), so the sentence is left out until one does.
      lede: 'In 2011, children aged 10 to 14 were the largest age group. The 2026 projection puts people aged 25 to 29 in the largest group.',
      blocks: [
        {
          periods: [
            { label: '2026 projection', short: '2026', chart: agePyramid('2026') },
            {
              label: '2011 census',
              short: '2011',
              // LATER: the board labels two bars ("Largest group, aged 10 to 14", "Aged 80 and over"); 'pyramid' has no callouts.
              chart: {
                slug: 'population-pyramid',
                kind: 'pyramid',
                title: 'Population by age and sex in India, 2011',
                subtitle: 'Share of people with a stated age, by five-year age group and sex, India.',
                punches: { office: 'ORGI', unit: 'persons', period: '2011' },
                sources: [censusC14],
                format: { scale: 'crore' },
                by: 'age_group',
                left: {
                  key: 'men',
                  label: 'Men',
                  color: 's2',
                  file: PYRAMID,
                  where: { sex: 'male', age_group: AGE_GROUPS },
                  x: 'age_group',
                },
                right: {
                  key: 'women',
                  label: 'Women',
                  color: 's3',
                  file: PYRAMID,
                  where: { sex: 'female', age_group: AGE_GROUPS },
                  x: 'age_group',
                },
                know: [
                  'The pyramid shows Census 2011, the latest full count. No newer count by age exists.',
                  '44.9 lakh people did not state their age. The pyramid leaves them out. The data file keeps them as a separate row.',
                  'Each bar adds rural and urban people. Table C-14 also gives each age group by residence.',
                ],
                processing: [
                  'Read the India rows of Table C-14 (Excel): people by five-year age group and sex, rural and urban together.',
                  'Keep the 17 age groups from 0-4 to 80+. Leave out the "Age not stated" row.',
                  'Draw men on the left and women on the right, on one scale.',
                ],
                nextRelease: 'not announced',
              },
            },
            { label: '1961 census', short: '1961', chart: agePyramid('1961') },
            { label: '1951 UN estimate', short: '1951', chart: agePyramid('1951') },
          ],
        },
      ],
    },
    {
      title: 'How many babies are born, and how many people die?',
      lede: 'In 2024 India had 18.3 births per 1,000 people and 6.4 deaths. The fertility rate was 1.9 children per woman, below replacement level.',
      blocks: [
        {
          periods: [
            { label: 'India, 1950 to 2026', short: 'India', chart: fertilityIndia },
            { label: 'States, 2026-30 assumption', short: 'Projected', chart: projectedFertilityStates },
            {
              label: 'States, 2019 and 2024',
              short: 'States',
              chart: {
                pin: ['india'],
                axis: { min: 1, max: 3.5 },
                slug: 'fertility-rate-by-state',
                kind: 'dots',
                title: 'Fertility rate by state, 2019 and 2024',
                subtitle: 'Children a woman would have at current rates, 22 bigger states and UTs.',
                punches: { office: 'ORGI · SRS', unit: 'per woman', period: '2024' },
                status: ['Survey estimate'],
                sources: [srsReportT15],
                format: { decimals: 1 },
                sortBy: '2024',
                refs: [{ value: 2.1, label: 'Replacement level: 2.1' }],
                series: [
                  {
                    key: '2019',
                    label: '2019',
                    color: 'slate',
                    file: TFR,
                    where: { period: '2019', residence: 'total' },
                    x: 'geography',
                  },
                  {
                    key: '2024',
                    label: '2024',
                    color: 'ink',
                    file: TFR,
                    where: { period: '2024', residence: 'total' },
                    x: 'geography',
                  },
                ],
                hollow: ['2019'],
                know: [
                  'The Sample Registration System (SRS) is a sample survey run by ORGI. Its rates are estimates, not counts.',
                  'The SRS gives a fertility rate only for the 22 bigger states and UTs. The other 14 have no estimate.',
                  'Rates are rounded to one decimal in the report, so small changes may not show.',
                  'A rate of 2.1 is the replacement level: the rate at which each generation replaces itself.',
                  'The SRS 2024 sample frame is Census 2011.',
                ],
                processing: [
                  'Read Table 15 of the SRS Statistical Report 2024 (PDF): total fertility rate by state, 2019 to 2024, total, rural and urban.',
                  'Cross-check each value with Statement 24 of the same report.',
                  'Show the total rate for 2019 and 2024. The data file keeps every year and the rural and urban rates.',
                ],
                nextRelease: 'not announced',
              },
            },
          ],
        },
        {
          text: 'Fertility was 5.2 children per woman in 1971. In 2024, 16 of the 22 bigger states and UTs were below 2.1.',
        },
        {
          periods: [
            { label: 'India, 1950 to 2026', short: 'India', chart: vitalRatesIndia },
            { label: 'States, 2026-30 projection', short: 'Projected', chart: projectedVitalRatesStates },
            {
              label: 'States, 2024',
              short: 'States',
              chart: {
                slug: 'birth-death-rates-by-state',
                kind: 'dots',
                title: 'Birth rate and death rate by state, 2024',
                subtitle: 'Births and deaths per 1,000 people per year, 36 states and UTs.',
                punches: { office: 'ORGI · SRS', unit: 'per 1,000', period: '2024' },
                status: ['Survey estimate'],
                note: 'Rates for small states and UTs rest on small samples.',
                sources: [srsBulletinT1],
                format: { decimals: 1 },
                axis: { min: 0, max: 30 },
                sortBy: 'birth',
                map: { series: 'birth', scale: 'seq' },
                series: [
                  {
                    key: 'birth',
                    label: 'Birth rate',
                    color: 's5',
                    file: BIRTH_DEATH,
                    where: { series: 'birth_rate', residence: 'total' },
                    x: 'geography',
                  },
                  {
                    key: 'death',
                    label: 'Death rate',
                    color: 's8',
                    file: BIRTH_DEATH,
                    where: { series: 'death_rate', residence: 'total' },
                    x: 'geography',
                  },
                ],
                know: [
                  'The SRS gives birth and death rates for all 36 states and UTs.',
                  'Values for small states and UTs rest on small samples. The Manipur estimate rests on 130 sample units.',
                  'The bulletin gives 95% confidence limits for each rate in Tables 2 and 3.',
                  'The natural growth rate is the birth rate minus the death rate. The SRS publishes it in the same table.',
                ],
                processing: [
                  'Read Table 1 of the SRS Bulletin 2024 (PDF): birth, death, natural growth and infant mortality rates by state, total, rural and urban.',
                  'Match each state name to the 36 present-day states and UTs.',
                  'Show the total birth and death rates for 2024, sorted by birth rate.',
                ],
                nextRelease: 'not announced',
              },
            },
          ],
        },
        {
          text: 'In 2022-24, 918 girls were born for every 1,000 boys, up from 907 in 2018-20.',
        },
        { chart: birthRatioIndia },
        {
          periods: [
            { label: 'States, 2026 assumption', short: 'Projected', chart: projectedBirthRatioStates },
            {
              label: 'States, 2018-20 and 2022-24',
              short: 'SRS',
              chart: {
                pin: ['india'],
                axis: { min: 840 },
                slug: 'sex-ratio-at-birth-by-state',
                kind: 'dots',
                title: 'Sex ratio at birth by state, 2018-20 and 2022-24',
                subtitle: 'Girls born per 1,000 boys, three-year averages, 22 bigger states and UTs.',
                punches: { office: 'ORGI · SRS', unit: 'per 1,000 boys', period: '2022-24' },
                status: ['Survey estimate'],
                note: 'The dotted line marks 1,000: equal numbers of girls and boys.',
                sources: [srsReportT16],
                format: { decimals: 0 },
                sortBy: '2022-24',
                // The line sits at the right edge of the axis, so its label goes in the note.
                refs: [{ value: 1000, label: '' }],
                series: [
                  {
                    key: '2018-20',
                    label: '2018-20',
                    color: 'slate',
                    file: SRB,
                    where: { period: '2018-20', residence: 'total' },
                    x: 'geography',
                  },
                  {
                    key: '2022-24',
                    label: '2022-24',
                    color: 'ink',
                    file: SRB,
                    where: { period: '2022-24', residence: 'total' },
                    x: 'geography',
                  },
                ],
                hollow: ['2018-20'],
                know: [
                  'Each value is an average over three years, for example 2022-24.',
                  'The SRS gives sex ratio at birth only for the 22 bigger states and UTs. The other 14 have no estimate.',
                  'The report gives whole numbers. A ratio of 1,000 means equal numbers of girls and boys born.',
                  'The SRS is a sample survey, so each ratio is an estimate, not a count of births.',
                ],
                processing: [
                  'Read Table 16 of the SRS Statistical Report 2024 (PDF): girls born per 1,000 boys, three-year averages from 2018-20 to 2022-24, total, rural and urban.',
                  'Cross-check each value with Statement 16 of the same report.',
                  'Show the total ratio for 2018-20 and 2022-24. The data file keeps the periods between and the rural and urban ratios.',
                ],
                nextRelease: 'not announced',
              },
            },
          ],
        },
      ],
    },
    {
      title: 'Where do people live?',
      lede: 'Uttar Pradesh had 19.98 crore people in 2011, more than any other state. Nagaland was the only state whose population fell between 2001 and 2011 (−0.58%).',
      blocks: [
        {
          periods: [
            { label: 'India, 1901 to 2026', short: 'India', chart: growthIndia },
            { label: 'States, 2011 to 2026', short: 'Projection', chart: projectedGrowthStates },
            {
              label: 'States, 2001 to 2011',
              short: 'Census',
              // LATER: the board's Table view adds "people counted in 2011" (series 'population'); 'states' takes one value per state.
              chart: {
                slug: 'population-growth-by-state',
                kind: 'states',
                title: 'Population growth by state and UT, 2001 to 2011',
                subtitle: 'Change in population from Census 2001 to Census 2011, on 2011 boundaries.',
                punches: { office: 'ORGI', unit: '% change', period: '2001-2011' },
                note: 'Telangana and Ladakh have no 2011 figures. They are counted in Andhra Pradesh and in Jammu and Kashmir.',
                sources: [censusA02States],
                format: { unit: '%', decimals: 2 },
                data: {
                  file: 'population/population-by-state-2011.csv',
                  where: { series: 'decadal_growth_pct' },
                  x: 'geography',
                },
                open: 'map',
                scale: 'seq',
                short: 'Population growth',
                know: [
                  'Growth is the change in people counted between Census 2001 and Census 2011, as ORGI publishes it.',
                  'Census 2011 had 35 units. Andhra Pradesh includes present-day Telangana, and Jammu and Kashmir includes present-day Ladakh.',
                  'Dadra and Nagar Haveli and Daman and Diu were two UTs in 2011. Their tile uses the summed counts, marked Derived.',
                  'Nagaland is the only state whose count fell, by 0.58%.',
                ],
                processing: [
                  'Read the state rows of Table A-02 (Excel): people counted in 2011 and the change since 2001.',
                  'Map each Census 2011 unit to a present-day state or UT. Leave Telangana and Ladakh empty.',
                  'Add the 2001 and 2011 counts of Dadra and Nagar Haveli and of Daman and Diu, and compute their growth from the sums.',
                  'Place each state in a band by its growth rate.',
                ],
                nextRelease: 'not announced',
              },
            },
          ],
        },
        {
          text: 'The share of people in urban areas rose from 10.84% in 1901 to 31.14% in 2011. MoHFW projects 36.01% for 2026.',
        },
        {
          periods: [
            { label: 'India, 1901 to 2026', short: 'India', chart: urbanIndia },
            { label: 'States, 2026 projection', short: 'Projection', chart: projectedUrbanStates },
            {
              label: 'States, 2011 census',
              short: 'Census',
              chart: {
                slug: 'urban-share-by-state',
                kind: 'states',
                title: 'Urban share by state and UT, 2011',
                subtitle: 'Share of each state’s people in urban areas, Census 2011, on today’s states.',
                punches: { office: 'ORGI', unit: '% of people', period: '2011' },
                note: 'Telangana and Ladakh have no 2011 figures. They are counted in Andhra Pradesh and in Jammu and Kashmir.',
                sources: [censusA01],
                format: { unit: '%', decimals: 2 },
                data: {
                  file: 'population/urban-share-by-state-2011.csv',
                  where: { series: 'urban_share_pct' },
                  x: 'geography',
                },
                scale: 'seq',
                short: 'Urban share',
                know: [
                  '"Urban" follows the Census 2011 definition: statutory towns and census towns.',
                  'ORGI publishes counts, not shares. Each share is urban people divided by all people, times 100, to two decimals.',
                  'Census 2011 had 35 units. Telangana is inside Andhra Pradesh, and Ladakh inside Jammu and Kashmir.',
                  'Dadra and Nagar Haveli and Daman and Diu were two UTs in 2011. Their share comes from the summed counts, marked Derived.',
                ],
                processing: [
                  'Read total and urban people for each state from Table A-01 (Excel).',
                  'Divide urban people by all people and round to two decimals.',
                  'Map each Census 2011 unit to a present-day state or UT. Leave Telangana and Ladakh empty.',
                ],
                nextRelease: 'not announced',
              },
            },
          ],
        },
      ],
    },
    {
      title: 'How might the population change?',
      lede: 'MoHFW projects 152.2 crore people in India on 1 March 2036, up from 142.6 crore in 2026. These are projections made in 2020, not counts.',
      blocks: [
        {
          // LATER: the board frame has a Map tab (state projections for 2026, same file); 'line' has no map view.
          chart: {
            slug: 'population-projection',
            kind: 'line',
            title: 'Population of India with projections, 1901 to 2036',
            subtitle: 'People in India: census counts to 2011, then projections for 1 March to 2036.',
            punches: { office: 'ORGI · MoHFW', unit: 'crore', period: '1901-2036' },
            status: ['Projection'],
            sources: [censusA02, projectionsT8],
            // The report gives thousand persons: 1,425,908 thousand prints as 142.6 crore.
            format: { scale: 'crore', decimals: 1 },
            y: { min: 0, max: 1600000000, step: 400000000 },
            markers: [
              { x: '2027-03-01', label: 'Census 2027' },
            ],
            series: [
              {
                key: 'projection',
                label: 'Projection',
                color: 'ink',
                dash: true,
                file: PROJ,
                where: { geography: 'india' },
                multiply: 1000,
              },
              {
                key: 'census',
                label: 'Census count',
                color: 'ink',
                file: CENSUS_COUNTS,
                y: 'population',
              },
            ],
            callouts: [
              { series: 'census', x: '2011' },
              { series: 'projection', x: '2036' },
            ],
            know: [
              'These are projections, not counts. The Technical Group made them in July 2020 from Census 2011 and SRS trends.',
              'The projections predate the SRS estimates for 2020 onward, so they do not use the latest birth and death rates.',
              'The report uses a cohort component method for the 22 bigger states and the north-east group. Goa and the small UTs use a simpler method.',
              'The projected values are for 1 March of each year.',
              'Census 2027 will give the first new count. Its reference date is 1 March 2027 in most states.',
            ],
            processing: [
              'Read Table 8 of the Technical Group report (PDF): people on 1 March of each year, 2011 to 2036, by state, in thousands.',
              'Multiply the report values by 1,000 to get persons.',
              'Read the Census counts from Table A-02. Keep the count and projection series separate.',
              'Add the Dadra and Nagar Haveli and the Daman and Diu columns for the present-day UT, marked Derived.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
  ],
  // LATER: the About band's side line ("How each population figure is made: counts, survey estimates and projections.") has no field.
  about: {
    intro:
      'Census 2011 is a count of every person. The SRS is a sample survey. The 2026 and 2036 values are projections.',
    publisher:
      'The Office of the Registrar General and Census Commissioner, India (ORGI), Ministry of Home Affairs, runs the Census and the Sample Registration System (SRS). The National Commission on Population (MoHFW) publishes the projections.',
    frequency:
      'Census: latest full count 2011. Census 2027 is under way, reference date 1 March 2027 in most states. SRS: yearly. The 2024 report came out on 20 May 2026. Projections: one report, July 2020.',
    revisions:
      'Census 2011 tables are final. Census 2027 counts will replace them. ORGI has announced no date. SRS rates are rounded to one decimal. The SRS bulletin gives 95% confidence limits.',
    breaks:
      'Census figures are counts on the reference date. The projections start from Census 2011 and SRS trends. They do not use SRS estimates from 2020. We never join projections and counts as one series.',
    coverage:
      'Census 2011 had 35 units: Andhra Pradesh includes Telangana, and Jammu and Kashmir includes Ladakh. We sum Dadra and Nagar Haveli and Daman and Diu. The SRS and projections use the present 36 units.',
    // The report's Daman and Diu 2036 figures (19.69 lakh people, 16.70 lakh male) look odd. No CSV
    // holds them (the file has the merged dnh-dd total only), so "Small-UT projections can look odd"
    // names the oddity without the numbers.
    missing:
      'No count exists after 2011. The SRS gives no fertility rate or sex ratio at birth for 14 smaller states and UTs. Small-UT projections can look odd. Neither publisher states an open licence.',
  },
  // The board lists the SRS report and bulletin on one line; they are two releases with two URLs.
  sources: [censusA02, censusA01, censusC14, census1961, censusUrbanHistory, census1991Urban, census2001Pca, srsCompendium, srsReport2018, srsReport, srsBulletin, projections, wpp, wppAge, ...gazettes],
  rail: [
    {
      title: 'Census 2027',
      rows: [
        ['Apr-Sep 2026', 'House-listing, done'],
        ['Dec 2026-Jan 2027', 'Count in four states'],
        ['Jan-Feb 2027', 'Count in other states (Manipur not set)'],
        ['1 Mar 2027', 'Reference date'],
        ['Results', 'Not announced'],
      ],
      source: 'ORGI gazette notifications',
    },
  ],
  related: [
    { label: 'Health: Infant mortality by state', href: '/charts/infant-mortality-by-state/' },
    { label: 'Religion and culture: Religion by state, 2011', href: '/charts/religion-by-state/' },
    { label: 'States: Tamil Nadu profile', href: '/states/tamil-nadu/' },
    { label: 'How we check: counts, survey estimates and projections', href: '/how-we-check/' },
  ],
}

export default topic
