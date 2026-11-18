import type { Source, Topic } from '../types'
import { formatDate } from '~/lib/period'
import { SITE } from '~/lib/site'

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

const projectionsT8: Source = {
  ...projections,
  release: 'Population Projections for India and States 2011-2036, Report of the Technical Group, Table 8',
}

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

const PROJECTION_YEARS = [
  '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024',
  '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034', '2035', '2036',
] as const

const TFR = 'population/tfr-by-state-2019-2024.csv'
const BIRTH_DEATH = 'population/birth-death-rates-by-state-2024.csv'
const SRB = 'population/sex-ratio-at-birth-by-state.csv'
const PROJ = 'population/population-projections-2011-2036.csv'
const PYRAMID = 'population/population-pyramid-2011.csv'

const topic: Topic = {
  slug: 'population',
  name: 'Population',
  hindi: 'जनसंख्या',
  question: 'How many people live in India, and how fast has the number grown since 1901?',
  standfirst:
    'India had a projected 142.6 crore people on 1 March 2026. The last full count, Census 2011, found 1,21,08,54,977 people.',
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
      lede: "India's population in 2011 was more than three times its 1951 count of 36,10,88,090. Growth over the decade to 2011 was 17.70%, the slowest since the decade to 1951 (13.31%).",
      blocks: [
        {
          // LATER: the board prints the change since the previous census (change_since_previous_census_pct) as a second row of labels.
          chart: {
            slug: 'population-by-census',
            kind: 'columns',
            title: "India's population at each census, 1901 to 2011",
            subtitle:
              'Number of people counted, and change since the previous census (%), India, census years 1901 to 2011.',
            punches: { office: 'ORGI', unit: 'persons', period: '1901-2011' },
            note: 'Assam in 1981 and Jammu and Kashmir in 1991 had no census; ORGI gives interpolated figures. The 2001 total includes an estimate for three sub-divisions of Senapati district, Manipur.',
            sources: [censusA02],
            format: { scale: 'crore' },
            y: { min: 0, step: 200000000 },
            series: [
              {
                key: 'population',
                label: 'People counted',
                color: 'ink',
                file: 'population/population-census-1901-2011.csv',
                y: 'population',
              },
            ],
            callouts: [
              { series: 'population', x: '1901' },
              { series: 'population', x: '1951' },
            ],
            // LATER: the board also labels 2011; a callout on the last column is cut off.
            know: [
              'Census 2011 is the latest full count. Its reference date was 00:00 on 1 March 2011.',
              'Assam had no census in 1981, and Jammu and Kashmir had none in 1991. ORGI gives interpolated figures for them, so the India totals for those years include estimates.',
              'The 2001 total includes an estimate for the Mao Maram, Paomata and Purul sub-divisions of Senapati district, Manipur.',
              'The decade to 1921 is the only one in which the count fell (−0.31%).',
              'Census 2027 is under way. Its results will be the first new count since 2011.',
            ],
            processing: [
              'Read the India population at each census, 1901 to 2011, from Table A-02 (Excel).',
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
      lede: 'In 2011, the largest age group was children aged 10 to 14: 13,27,09,212 people. There were 1,12,89,005 people aged 80 and over.',
      blocks: [
        {
          // LATER: the board labels two bars ("Largest group, aged 10 to 14", "Aged 80 and over"); 'pyramid' has no callouts.
          chart: {
            slug: 'population-pyramid',
            kind: 'pyramid',
            title: 'Population pyramid of India, 2011',
            subtitle: 'Number of men and women in each five-year age group, India, Census 2011.',
            punches: { office: 'ORGI', unit: 'persons', period: '2011' },
            note: '44,89,802 people did not state their age. They are not in the pyramid.',
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
              '44,89,802 people did not state their age. The pyramid leaves them out; the data file keeps them as a separate row.',
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
      ],
    },
    {
      title: 'How many babies are born, and how many people die?',
      lede: 'Women in India had 1.9 children on average in 2024, below the replacement level of 2.1. Replacement level is the rate at which each generation replaces itself. Bihar had the highest rate (2.9) and Delhi the lowest (1.2). 16 of the 22 bigger states and UTs were below 2.1.',
      blocks: [
        {
          chart: {
            pin: ['india'],
            axis: { min: 1, max: 3.5 },
            slug: 'fertility-rate-by-state',
            kind: 'dots',
            title: 'Fertility rate by state, 2019 and 2024',
            subtitle:
              'Total fertility rate: the average number of children a woman would have at current rates, 22 bigger states and UTs, 2019 and 2024.',
            punches: { office: 'ORGI · SRS', unit: 'per woman', period: '2024' },
            status: ['Survey estimate'],
            note: 'The SRS gives a fertility rate only for the 22 bigger states and UTs. The other 14 have no estimate. Values are rounded to one decimal in the source.',
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
        {
          text: "India's birth rate was 18.3 per 1,000 people in 2024, and its death rate was 6.4. Bihar had the highest birth rate (26.8) and Andaman and Nicobar Islands the lowest (9.9).",
        },
        {
          chart: {
            slug: 'birth-death-rates-by-state',
            kind: 'dots',
            title: 'Birth rate and death rate by state, 2024',
            subtitle:
              'Live births and deaths in the year per 1,000 people, all 36 states and UTs, 2024, sorted by birth rate.',
            punches: { office: 'ORGI · SRS', unit: 'per 1,000', period: '2024' },
            status: ['Survey estimate'],
            note: 'The SRS is a sample survey. Values for small states and UTs rest on small samples; the Manipur estimate rests on 130 sample units.',
            sources: [srsBulletinT1],
            format: { decimals: 1 },
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
              'Read Table 1 of the SRS Bulletin 2024, Volume 59 No. 1 (PDF): birth, death, natural growth and infant mortality rates by state, total, rural and urban.',
              'Match each state name to the 36 present-day states and UTs.',
              'Show the total birth and death rates for 2024, sorted by birth rate.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'For every 1,000 boys born in India in 2022-24, 918 girls were born, up from 907 in 2018-20. Chhattisgarh had the highest ratio (978) and Uttarakhand the lowest (872).',
        },
        {
          chart: {
            pin: ['india'],
            axis: { min: 840 },
            slug: 'sex-ratio-at-birth-by-state',
            kind: 'dots',
            title: 'Sex ratio at birth by state, 2018-20 and 2022-24',
            subtitle:
              'Girls born for every 1,000 boys born, three-year averages, 22 bigger states and UTs, 2018-20 and 2022-24.',
            punches: { office: 'ORGI · SRS', unit: 'per 1,000 boys', period: '2022-24' },
            status: ['Survey estimate'],
            note: 'The SRS gives this ratio only for the 22 bigger states and UTs. Each value is an average over three years. The dotted line marks 1,000: equal numbers of girls and boys.',
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
    {
      title: 'Where do people live?',
      lede: 'Uttar Pradesh had 19,98,12,341 people in 2011, more than any other state. Nagaland was the only state whose population fell between 2001 and 2011 (−0.58%). These are Census 2011 units, so Telangana and Ladakh have no figures of their own.',
      blocks: [
        {
          // LATER: the board's Table view adds "people counted in 2011" (series 'population'); 'states' takes one value per state.
          chart: {
            slug: 'population-growth-by-state',
            kind: 'states',
            title: 'Population growth by state and UT, 2001 to 2011',
            subtitle:
              'Change in the number of people counted between Census 2001 and Census 2011, %, and people counted in 2011, states and UTs as in Census 2011.',
            punches: { office: 'ORGI', unit: '% change', period: '2001-2011' },
            note: 'Each state and UT is one equal tile; the grid is not a map of borders. Telangana and Ladakh have no 2011 figures of their own: their people are counted in Andhra Pradesh and in Jammu and Kashmir. Dadra and Nagar Haveli and Daman and Diu were two UTs in 2011; the tile shows their sum (derived).',
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
              'Dadra and Nagar Haveli and Daman and Diu were two UTs in 2011. Their tile adds the two counts and computes growth from the sums, marked Derived.',
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
        {
          text: "In 2011, 31.14% of India's people lived in urban areas. The share was 97.50% in Delhi and 10.03% in Himachal Pradesh.",
        },
        {
          chart: {
            slug: 'urban-share-by-state',
            kind: 'states',
            title: 'Share of people living in towns, by state and UT, 2011',
            subtitle: 'People in urban areas as a share of all people, %, states and UTs as in Census 2011.',
            punches: { office: 'ORGI', unit: '% of people', period: '2011' },
            note: '"Urban" follows the Census 2011 definition: statutory towns and census towns. Each share is derived from the published counts (urban people ÷ all people × 100).',
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
    {
      title: 'How might the population change?',
      lede: 'The Technical Group on Population Projections (MoHFW, National Commission on Population) projects 152.2 crore people in India by 1 March 2036, up from 142.6 crore in 2026. Uttar Pradesh alone is projected at 24.3 crore in 2026. These are projections made in 2020, not counts. Census 2027 will give the first new count.',
      blocks: [
        {
          // LATER: the board frame has a Map tab (state projections for 2026, same file); 'line' has no map view.
          chart: {
            slug: 'population-projection',
            kind: 'line',
            title: 'Projected population of India, 2011 to 2036',
            subtitle:
              'Number of people on 1 March of each year, crore, India: Census 2011, then projections for 2012 to 2036.',
            punches: { office: 'MoHFW · NCP', unit: 'crore', period: '2011-2036' },
            status: ['Projection'],
            note: 'These are projections made in July 2020 from Census 2011 and SRS trends. They are not counts, and they do not use the SRS rates for 2020 onward. The report gives values in thousands; 1 crore is 10,000 thousand.',
            sources: [projectionsT8],
            // The report gives thousand persons: 1,425,908 thousand prints as 142.6 crore.
            format: { scale: 'crore', decimals: 1, multiply: 1000 },
            y: { min: 1100000, max: 1600000, step: 100000 },
            // The two markers are 3.5 months apart: "Today" is labelled left of its line, Census 2027 right
            // of its line (a blank `before` puts the label on the right).
            markers: [
              { x: SITE.checked, label: `Today, ${formatDate(SITE.checked)}` },
              { x: '2027-03-01', label: 'Census 2027, ref. date 1 Mar 2027', before: ' ' },
            ],
            series: [
              {
                key: 'projection',
                label: 'Projection',
                color: 'ink',
                dash: true,
                file: PROJ,
                where: { geography: 'india', period: PROJECTION_YEARS },
              },
              {
                key: 'census',
                label: 'Census 2011 count',
                color: 'ink',
                file: PROJ,
                where: { geography: 'india', period: '2011' },
              },
            ],
            callouts: [
              { series: 'census', x: '2011' },
              { series: 'projection', x: '2026' },
              { series: 'projection', x: '2036' },
            ],
            know: [
              'These are projections, not counts. The Technical Group made them in July 2020 from Census 2011 and SRS trends.',
              'The projections predate the SRS estimates for 2020 onward, so they do not use the latest birth and death rates.',
              'The report uses a cohort component method for the 22 bigger states and the north-east as a group, and a simpler mathematical method for Goa and the small UTs.',
              'Each value is for 1 March of the year. The 2011 value is the Census 2011 count as the report gives it.',
              'Census 2027 will give the first new count. Its reference date is 1 March 2027 in most states.',
            ],
            processing: [
              'Read Table 8 of the Technical Group report (PDF): people on 1 March of each year, 2011 to 2036, for India and each state, in thousands.',
              'Keep the report values in thousands. Show them in crore (10,000 thousand is 1 crore).',
              'Keep the 2011 Census value apart from the projections for 2012 to 2036, so the chart does not join a count to a projection.',
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
      'This page uses three kinds of figure. Census 2011 is a count of every person. The SRS is a sample survey. The 2026 and 2036 values are projections. Each chart says which one it shows.',
    publisher:
      'The Office of the Registrar General and Census Commissioner, India (ORGI), Ministry of Home Affairs, runs the Census and the Sample Registration System (SRS). The National Commission on Population, Ministry of Health and Family Welfare (MoHFW), publishes the population projections of its Technical Group.',
    frequency:
      'Census: the latest full count is Census 2011, with 00:00 on 1 March 2011 as its reference date. Census 2027 is under way; its reference date is 1 March 2027 in most states. SRS: once a year; the 2024 report and bulletin came out on 20 May 2026. Projections: one report, dated July 2020.',
    revisions:
      'Census 2011 tables are final. Census 2027 counts will replace them when ORGI publishes results; no date is announced. SRS rates are rounded to one decimal, and the bulletin gives 95% confidence limits in Tables 2 and 3.',
    breaks:
      'Census figures are counts on the reference date. The projections start from Census 2011 and use SRS trends; they predate the SRS estimates for 2020 onward. We never join projections to Census counts as one series. The SRS 2024 sample frame is Census 2011.',
    coverage:
      'Census 2011 had 35 units. Telangana (formed 2014) is inside Andhra Pradesh, and Ladakh (a UT since 2019) is inside Jammu and Kashmir. Dadra and Nagar Haveli and Daman and Diu were two UTs until 2020; we add their 2011 counts and mark the sum "Derived". The SRS and the projections use the present 36 units. The SRS gives birth and death rates for all 36, but fertility rate and sex ratio at birth only for the 22 bigger states and UTs.',
    // The board quotes Daman and Diu 2036 figures (19.69 lakh people, 16.70 lakh male) from the report.
    // No CSV holds them (the file has the merged dnh-dd total only), so the sentence names the oddity
    // without the numbers.
    missing:
      'There is no count after 2011. The 2026 values are projections, and the 2024 values are sample estimates. The SRS gives no fertility rate or sex ratio at birth for the 14 smaller states and UTs. For Goa and the small UTs the projections use a simpler method, and some look odd: for Daman and Diu the report projects far more males than females in 2036. ORGI and MoHFW state no open licence for these files.',
  },
  // The board lists the SRS report and bulletin on one line; they are two releases with two URLs.
  sources: [censusA02, censusA01, censusC14, srsReport, srsBulletin, projections, ...gazettes],
  rail: [
    {
      title: 'Census 2027',
      body: 'The next count is under way. No results are published yet. 1 Apr to 30 Sep 2026: House-listing, all states and UTs. Done. 1 Dec 2026 to 4 Jan 2027: Count in Goa, Uttar Pradesh, Punjab and Uttarakhand. 25 Jan to 28 Feb 2027: Count in all other states and UTs. Reference date 1 Mar 2027. Manipur: dates not yet set. Source: ORGI gazette notifications, 16 Jun 2025 to 30 Oct 2026.',
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
