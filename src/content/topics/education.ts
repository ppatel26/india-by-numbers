import type { Series, Source, Topic } from '../types'

// Sources: research/data/education/README.md, "Sources".

const udise2025_26: Source = {
  publisher: 'Ministry of Education',
  release: 'UDISE+ 2025-26 booklet, existing structure',
  released: '2026-07-07',
  url: 'https://dashboard.udiseplus.gov.in/report2026/static/media/UDISE+2025_26_Booklet_existing.edd7cd16d934a10377ba.pdf',
}

// Released 28 Aug 2025: PIB release 2161543; the PDF is dated the same day.
const udise2024_25: Source = {
  publisher: 'Ministry of Education',
  release: 'UDISE+ 2024-25 booklet, existing structure',
  released: '2025-08-28',
  url: 'https://dashboard.udiseplus.gov.in/report2026/static/media/UDISE+2024_25_Booklet_existing.118ba29d4773e6372f72.pdf',
}

// The 2022-23 and 2023-24 booklets came out together. Both PDFs are dated 30 Dec 2024; the
// ministry's page for the 2023-24 booklet was created on 27 Dec 2024.
const udise2023_24: Source = {
  publisher: 'Ministry of Education',
  release: 'UDISE+ 2023-24 booklet, existing structure',
  released: '2024-12-30',
  url: 'https://dashboard.udiseplus.gov.in/report2026/static/media/UDISE+2023_24_Booklet_existing.309eabf9e4889db93bcb.pdf',
}

const udise2022_23: Source = {
  publisher: 'Ministry of Education',
  release: 'UDISE+ 2022-23 booklet, existing structure',
  released: '2024-12-30',
  url: 'https://dashboard.udiseplus.gov.in/report2026/static/media/UDISE+2022_23_Booklet_existing.d209e7c7516d77939da9.pdf',
}

// Released 3 Nov 2022: PIB release 1873307; the PDF is dated the same day.
const udise2021_22: Source = {
  publisher: 'Ministry of Education',
  release: 'UDISE+ 2021-22 booklet',
  released: '2022-11-03',
  url: 'https://dashboard.udiseplus.gov.in/report2026/static/media/UDISE+2021_22_Booklet.f55c1a60ed700e6c7892.pdf',
}

const udise2020_21: Source = {
  publisher: 'Ministry of Education',
  release: 'UDISE+ 2020-21 report',
  released: '2022',
  url: 'https://dashboard.udiseplus.gov.in/report2026/static/media/UDISE+2020_21_Booklet.2cfe0df9249cc690d12d.pdf',
}

const udise2019_20: Source = {
  publisher: 'Ministry of Education',
  release: 'UDISE+ 2019-20 report',
  released: '2021',
  url: 'https://dashboard.udiseplus.gov.in/report2026/static/media/UDISE+2019_20_Booklet.2fea294ea7332fcb5f0c.pdf',
}

const udise2018_19: Source = {
  publisher: 'Ministry of Education',
  release: 'UDISE+ 2018-19 report',
  released: 'not stated',
  url: 'https://dashboard.udiseplus.gov.in/report2026/static/media/UDISE+2018_19_Booklet.61e6bf9d5e445574ee1d.docx',
}

// The report PDF is linked from https://aishe.gov.in/ (README).
const aishe2023_24: Source = {
  publisher: 'Ministry of Education',
  release: 'All India Survey on Higher Education, Final Report 2023-24',
  released: '2026-07-08',
  url: 'https://cdnbbsr.s3waas.gov.in/s392049debbe566ca5782a3045cf300a3c/uploads/2026/07/202607131602421770.pdf',
}

// The ministry gives "File uploaded Jun 2025" and no day.
const aisheTimeSeries: Source = {
  publisher: 'Ministry of Education',
  release: 'AISHE time series for GER, based on 2011 population projection',
  released: '2025-06',
  url: 'https://cdnbbsr.s3waas.gov.in/s392049debbe566ca5782a3045cf300a3c/uploads/2025/06/202506041164303308.pdf',
}

const plfsAnnual2025: Source = {
  publisher: 'NSO, MoSPI',
  release: 'PLFS Annual Report 2025, Appendix A, Table (7) (revised file, 29 May 2026)',
  released: '2026-03-27',
  url: 'https://www.mospi.gov.in/uploads/publications_reports/publications_reports1780040415321_0624fb13-fb47-40bc-b470-7c7e9635c3ef_PLFS_2025_F_REV_29052026.pdf',
}

// Released 30 Apr 2013: PIB release 95372, "Census 2011: Abstract- Primary Data Released".
const census2011Pca: Source = {
  publisher: 'ORGI, Census of India',
  release: 'Census 2011 Primary Census Abstract, India and states',
  released: '2013-04-30',
  url: 'https://censusindia.gov.in/nada/index.php/catalog/6191/download/9268/DDW_PCA0000_2011_Indiastatedist.xlsx',
}

// NSS round 80. The PDF is dated 26 Aug 2025, the day of PIB release 2160863.
const cmse2025: Source = {
  publisher: 'NSO, MoSPI',
  release: 'NSS Report No. 595, CMS: Education 2025 (NSS round 80, April to June 2025)',
  released: '2025-08-26',
  url: 'https://www.mospi.gov.in/uploads/publications_reports/publications_reports1757588642898_9ba30fe0-3677-478c-8d53-9a0d2ba107f0_CMS_E_2025L.pdf',
}

// The API gives no release date. Its values match the report (README).
const cmse2025Api: Source = {
  publisher: 'NSO, MoSPI',
  release: 'eSankhyiki API, NSS round 80, CMS: Education 2025 (survey code 2)',
  released: 'not stated',
  url: 'https://api.mospi.gov.in/api/nss-80/getIndicatorList?survey_code=2',
}

// NSS round 79, July 2022 to June 2023. The PDF is dated 9 Oct 2024.
const cams2022_23: Source = {
  publisher: 'NSO, MoSPI',
  release: 'NSS Report No. 590, CAMS 2022-23 (NSS round 79)',
  released: '2024-10-09',
  url: 'https://www.mospi.gov.in/sites/default/files/publication_reports/CAMS%20Report_October_N.pdf',
}

const cams2022_23Api: Source = {
  publisher: 'NSO, MoSPI',
  release: 'eSankhyiki API, NSS round 79, CAMS 2022-23 (survey code 1), indicator 3',
  released: 'not stated',
  url: 'https://api.mospi.gov.in/api/nss-79/getNss79Records?indicator_code=3&survey_code=1&Format=JSON',
}

const TREND = 'education/education-school-trend-india.csv'
const DROPOUT = 'education/education-dropout-by-state.csv'
const GER_SCHOOL = 'education/education-ger-school-by-state.csv'
const PTR = 'education/education-ptr-by-state.csv'
const FACILITIES = 'education/education-school-facilities-by-state.csv'
const GER_HE_STATE = 'education/education-higher-ed-ger-by-state.csv'
const GER_HE_INDIA = 'education/education-higher-ed-ger-india.csv'
const LITERACY = 'education/education-literacy-by-state.csv'
const SPEND = 'education/education-spending-per-student.csv'
const SCHOOL_TYPE = 'education/education-school-type-by-state.csv'
const COACHING = 'education/education-private-coaching.csv'
const MYS = 'education/education-mean-years-schooling-by-state.csv'

/** NSS rows for everyone: both sexes, rural and urban together. */
const ALL_PERSONS = { sex: 'person', sector: 'rural+urban' } as const

const NSS_STATE_KNOW =
  'MoSPI says the survey was not designed for state estimates. Sample sizes in small states and UTs may be too small for reliable values.'

const spendSeries = (key: string, label: string, color: Series['color'], schoolType: string): Series => ({
  key,
  label,
  color,
  file: SPEND,
  where: { geography: 'india', school_type: schoolType, ...ALL_PERSONS },
})

const SCHOOL_TREND_SOURCES = [
  udise2025_26, udise2024_25, udise2023_24, udise2022_23, udise2021_22, udise2020_21, udise2019_20, udise2018_19,
  {
    publisher: 'Ministry of Education and NIEPA',
    release: 'UDISE 2017-18 Flash Statistics, provisional, archived copy',
    released: '2020',
    url: 'https://web.archive.org/web/20210410164422id_/http://udise.in/Downloads/Publications/Documents/Flash_Statistics_on_School_Education-2017-18_Provisional.pdf',
  },
  {
    publisher: 'Ministry of Education and NIEPA',
    release: 'UDISE 2016-17 Flash Statistics, archived copy',
    released: '2018',
    url: 'https://web.archive.org/web/20201228051951id_/http://udise.in/Downloads/Publications/Documents/Flash_Statistics_on_School_Education-2016-17.pdf',
  },
  {
    publisher: 'Ministry of Education and NIEPA',
    release: 'UDISE 2015-16 Flash Statistics, archived copy',
    released: '2016',
    url: 'https://web.archive.org/web/20201222145336id_/http://udise.in/Downloads/Publications/Documents/U-DISE-SchoolEducationInIndia-2015-16.pdf',
  },
  {
    publisher: 'Ministry of Education and NIEPA',
    release: 'UDISE 2014-15 Flash Statistics, archived copy',
    released: '2015',
    url: 'https://web.archive.org/web/20220214122726id_/http://www.dise.in/Downloads/Publications/Documents/U-DISE-SchoolEducationInIndia-2014-15.pdf',
  },
  {
    publisher: 'Ministry of Education and NIEPA',
    release: 'UDISE 2013-14 Flash Statistics, archived copy',
    released: '2014-07',
    url: 'https://web.archive.org/web/20220119021654id_/http://udise.in/Downloads/Publications/Documents/U-DISE-SchoolEducationInIndia-2013-14.pdf',
  },
  {
    publisher: 'Ministry of Education and NIEPA',
    release: 'DISE 2012-13 Elementary Flash Statistics, archived copy',
    released: '2013',
    url: 'https://web.archive.org/web/20220121184043id_/http://udise.in/Downloads/Publications/Documents/Flash%20Statistics%202012-13.pdf',
  },
  {
    publisher: 'Ministry of Education and NIEPA',
    release: 'UDISE 2012-13 Secondary Flash Statistics, archived copy',
    released: '2013',
    url: 'https://web.archive.org/web/20220121184114id_/http://udise.in/Downloads/Publications/Documents/SEMIS-FLASH-Statistics-2012-13.pdf',
  },
] satisfies Source[]
const HISTORICAL_YEARS = ['2012-13', '2013-14', '2014-15', '2015-16', '2016-17', '2017-18']
const OLD_YEARS = ['2018-19', '2019-20', '2020-21', '2021-22']
const NEW_YEARS = ['2022-23', '2023-24', '2024-25', '2025-26']

const LEVELS = [
  ['primary', 'primary (1-5)', 'Primary, 1-5', 's1'],
  ['upper-primary', 'upper primary (6-8)', 'Upper primary, 6-8', 's2'],
  ['secondary', 'secondary (9-10)', 'Secondary, 9-10', 's3'],
  ['higher-secondary', 'higher secondary (11-12)', 'Higher secondary, 11-12', 's4'],
] as const

const INDICATORS = [
  ['enrol', 'enrolment'],
  ['ger', 'GER'],
  ['dropout', 'dropout rate'],
] as const

/** Keep each method in its own series. */
const trendSeries: Series[] = INDICATORS.flatMap(([ind, indicator]) =>
  LEVELS.flatMap(([lvl, level, label, color]) => {
    const periods = ind === 'dropout' && lvl === 'higher-secondary'
      ? [
          ['udise-early', ['2013-14']],
          ['udise-late', ['2015-16', '2016-17']],
        ] as const
      : [
          ['udise', HISTORICAL_YEARS],
          ['old', OLD_YEARS],
          ['new', NEW_YEARS],
        ] as const
    return periods.map(([method, years]) => ({
      key: `${ind}-${lvl}-${method}`,
      label,
      color,
      ...(ind === 'enrol' ? { format: { scale: 'crore', decimals: 2 } as const } : {}),
      file: TREND,
      where: { indicator, level, period: years },
    }))
  }),
)

const trendPanel = (ind: string) => trendSeries.filter((s) => s.key.startsWith(`${ind}-`)).map((s) => s.key)

const topic: Topic = {
  slug: 'education',
  name: 'Education',
  hindi: 'शिक्षा',
  question: 'How many children are in school, and how far do they get?',
  standfirst:
    'In 2025-26, {{247219766 crore 2}} children were enrolled from pre-primary to class 12, against {{246932680 crore 2}} in 2024-25.',
  figures: [
    { chart: 'school-enrolment-trend', series: 'enrol-total-new', label: 'Students, pre-primary to class 12' },
    { chart: 'ger-higher-secondary-by-state', label: 'Enrolment ratio, classes 11 and 12' },
    { chart: 'college-enrolment-ratio', series: 'all', label: 'College enrolment ratio, age 18-23' },
  ],
  nextRelease: 'not announced',
  parts: [
    {
      title: 'How many children are in school?',
      lede: 'Total enrolment barely changed in 2025-26. Primary enrolment (classes 1 to 5) fell from {{104381347 crore 2}} to {{101915874 crore 2}}.',
      blocks: [
        {
          chart: {
            kind: 'line',
            slug: 'school-enrolment-trend',
            title: 'School enrolment and dropout in India, 2012-13 to 2025-26',
            subtitle: 'Enrolment, gross enrolment ratio and dropout rate by school level, India.',
            punches: { office: 'MoE', unit: 'crore · %', period: '2025-26' },
            status: ['Method break'],
            note: 'Lines break in 2018-19 and 2022-23, where the count changed method. Do not compare across them.',
            sources: SCHOOL_TREND_SOURCES,
            series: [
              ...trendSeries,
              // Read for the first headline figure and the standfirst; not drawn.
              {
                key: 'enrol-total-new',
                label: 'All levels, pre-primary to 12',
                color: 'ink',
                hidden: true,
                format: { scale: 'crore', decimals: 2 },
                file: TREND,
                where: { indicator: 'enrolment', level: 'total (pre-primary to higher secondary)', period: NEW_YEARS },
              },
            ],
            panels: [
              { label: 'Enrolment', series: trendPanel('enrol'), own: true },
              { label: 'Gross enrolment ratio', series: trendPanel('ger') },
              { label: 'Dropout rate, %', series: trendPanel('dropout'), own: true },
            ],
            breaks: [{ x: '2018-19', label: 'UDISE+' }, { x: '2022-23', label: 'New data' }],
            know: [
              'UDISE+ is a yearly Ministry of Education count of every school. Schools enter their own data. The 2025-26 reference date was 31 March 2026.',
              'Values for 2012-13 to 2017-18 come from archived copies of the UDISE Flash Statistics.',
              'UDISE+ replaced UDISE in 2018-19. Schools began to upload their returns to a system with built-in validation checks.',
              'From 2022-23, UDISE+ collects data for each student and uses revised population projections. The Ministry advises against comparing ratios across this break.',
              'The gross enrolment ratio (GER) divides enrolment at a level, of any age, by the population of official age. It can exceed 100.',
              'The 2016-17 report estimates enrolment for classes 11 and 12 in Andhra Pradesh and Karnataka.',
              'The last verified UDISE dropout cohort began in 2016-17.',
              'Classes 11 and 12 have dropout figures for some UDISE years. UDISE+ publishes dropout rates for classes 1 to 10.',
              'The NEP 2020 structure groups classes differently and gives different ratios.',
            ],
            processing: [
              'Read the UDISE national totals and keep the published digits. Assign each UDISE dropout rate to the year the cohort started.',
              'Read the India totals in Tables 3.1, 5.1 and 5.13 for 2018-19 to 2020-21. Use Table 1 in each booklet from 2021-22.',
              'Check the 2020-21 values against Table 1 of the 2021-22 booklet. All 13 values agree.',
              'Display enrolment in crore.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'Which states keep children in school?',
      lede: 'In 2025-26 the dropout rate in classes 9 and 10 ranged from 18.1% in Karnataka to 1.3% in Chandigarh.',
      blocks: [
        {
          chart: {
            kind: 'states',
            slug: 'dropout-rate-by-state',
            title: 'Dropout rate in classes 9 and 10 by state, 2025-26',
            subtitle: 'Share of students in classes 9 and 10 who left school during the year.',
            punches: { office: 'MoE', unit: '%', period: '2025-26' },
            sources: [udise2025_26],
            format: { unit: '%', decimals: 1 },
            data: { file: DROPOUT, where: { level: 'secondary (9-10)', sex: 'total' }, x: 'geography' },
            open: 'map',
            scale: 'seq',
            better: 'low',
            short: 'Dropout, classes 9-10',
            know: [
              'The dropout rate is the share of students at a level who leave school during the year. This chart shows classes 9 and 10.',
              'The India rate fell from 11.5% in 2024-25 to 9.5% in 2025-26.',
              'Dropout rates from 2022-23 use student-level data and do not compare with rates up to 2021-22.',
              'UDISE+ is an administrative count. Schools enter their own data.',
            ],
            processing: [
              'Read Table 6.13 of the UDISE+ 2025-26 booklet (existing structure), all students.',
              'Check that the table parses to 37 rows: 36 states and UTs and India.',
              'Match state names to the site geography table.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'The enrolment ratio in classes 11 and 12 was 61.7 for India, 42.1 in Bihar and 91.9 in Kerala.',
        },
        {
          chart: {
            kind: 'states',
            slug: 'ger-higher-secondary-by-state',
            title: 'Enrolment ratio in classes 11 and 12 by state, 2025-26',
            subtitle: 'Gross enrolment ratio in classes 11 and 12, boys and girls, by state.',
            punches: { office: 'MoE', unit: 'GER', period: '2025-26' },
            note: 'The ratio counts students of any age, so it can exceed 100.',
            sources: [udise2025_26],
            format: { decimals: 1 },
            data: { file: GER_SCHOOL, where: { level: 'higher secondary (11-12)', sex: 'total' }, x: 'geography' },
            open: 'chart',
            scale: 'seq',
            better: 'high',
            short: 'GER, classes 11-12',
            know: [
              'The GER divides enrolment in classes 11 and 12, of any age, by the population of official age. Chandigarh has 108.2.',
              'A ratio above 100 can mean over-age or under-age students, students from other states, or a low population projection.',
              'The booklet warns that ratios for UTs and some small states changed with the new population projections from 2022-23.',
              'The ratio covers all social groups.',
            ],
            processing: [
              'Read Table 6.1 of the UDISE+ 2025-26 booklet (existing structure), all social groups.',
              'Keep each value as published. Cap nothing.',
              'Match state names to the site geography table.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'Do schools have teachers, power and internet?',
      lede: 'India had 15 pupils for each secondary teacher in 2025-26. Two in three schools (67.4%) had internet.',
      blocks: [
        {
          chart: {
            kind: 'states',
            slug: 'pupils-per-teacher-by-state',
            title: 'Pupils per secondary teacher by state, 2025-26',
            subtitle: 'Pupils for each teacher in classes 9 and 10, by state and UT.',
            punches: { office: 'MoE', unit: 'pupils', period: '2025-26' },
            sources: [udise2025_26],
            format: { decimals: 0 },
            data: { file: PTR, where: { level: 'secondary (9-10)' }, x: 'geography' },
            open: 'chart',
            scale: 'seq',
            better: 'low',
            short: 'Pupils per teacher',
            know: [
              'The pupil-teacher ratio divides students in classes 9 and 10 by the teachers who teach them.',
              'In 2025-26 India had 15 pupils for each teacher at this level. Jharkhand had 31. Ladakh and Sikkim had 5.',
              'The booklet publishes whole numbers.',
              'UDISE+ is an administrative count. Schools enter their own data.',
            ],
            processing: [
              'Read Table 4.12 of the UDISE+ 2025-26 booklet (existing structure).',
              'Keep each value as published, in whole pupils.',
              'Match state names to the site geography table.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'In West Bengal only one school in five (19.7%) had internet.',
        },
        {
          // Rows keep the CSV order, which is sorted by internet share.
          chart: {
            kind: 'table',
            slug: 'school-facilities-by-state',
            title: 'School facilities by state and UT, 2025-26',
            subtitle: "Schools with internet, working electricity and a working girls' toilet, by state.",
            punches: { office: 'MoE', unit: '% schools', period: '2025-26' },
            note: 'Rows are sorted by internet. Electricity and toilets count only facilities that work.',
            sources: [udise2025_26],
            format: { unit: '%', decimals: 1 },
            data: { file: FACILITIES },
            by: 'geography',
            bins: [40, 60, 80, 90, 97],
            columns: [
              { key: 'internet', label: 'Internet', where: { facility: 'internet facility' }, y: 'value' },
              { key: 'electricity', label: 'Working electricity', where: { facility: 'functional electricity' }, y: 'value' },
              { key: 'toilet', label: "Working girls' toilet", where: { facility: "functional girls' toilet" }, y: 'value' },
            ],
            know: [
              'Internet shares are derived: schools with internet divided by all schools (Table 2.5). The India share, 67.4%, matches Table 1.',
              "Electricity and girls' toilets count only working facilities (Tables 8.6 and 8.8).",
              "Table 1 counts any connection or toilet, so its shares are higher: 95.0% and 98.5%. Do not mix the two.",
              'In 2025-26 West Bengal had the lowest internet share, 19.7%, and Meghalaya the lowest share for working electricity, 28.7%.',
              'UDISE+ is an administrative count. Schools enter their own data.',
            ],
            processing: [
              'Read the number of schools with internet and all schools from Table 2.5 (continued) of the UDISE+ 2025-26 booklet, and divide.',
              "Read working electricity from Table 8.6 and working girls' toilets from Table 8.8, all managements.",
              'Check the India internet share against Table 1, and the low values for Meghalaya and West Bengal against the counts in Table 2.5.',
              'Mark the internet column as derived.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'What do families spend on school?',
      lede: 'In 2025 families spent ₹12,616 on average for each school student in the academic year. The figure was ₹2,863 in government schools and ₹28,693 in private unaided schools.',
      blocks: [
        {
          chart: {
            kind: 'bars',
            slug: 'school-spending-by-level-and-type',
            checked: '2026-11-25',
            title: 'Spending per school student by level and type of school, 2025',
            subtitle: 'Average household spending per student in the current academic year, India.',
            punches: { office: 'MoSPI', unit: '₹ a year', period: '2025' },
            status: ['Survey estimate'],
            note: 'Spending leaves out private coaching. Rupees at the prices of the 2025 survey.',
            sources: [cmse2025, cmse2025Api],
            format: { unit: '₹', decimals: 0 },
            by: 'level',
            rowHead: 'Level',
            order: ['pre-primary', 'primary', 'middle', 'secondary', 'higher secondary', 'all levels'],
            labels: {
              'pre-primary': 'Pre-primary',
              primary: 'Primary, 1-5',
              middle: 'Middle, 6-8',
              secondary: 'Secondary, 9-10',
              'higher secondary': 'Higher secondary, 11-12',
              'all levels': 'All levels',
            },
            series: [
              spendSeries('government', 'Government', 's2', 'government'),
              spendSeries('private-aided', 'Private aided', 's5', 'private aided'),
              spendSeries('private-unaided', 'Private unaided, recognised', 's3', 'private unaided (recognised)'),
              spendSeries('all', 'All schools', 'ink', 'all'),
            ],
            know: [
              'Spending covers course fees, transport, uniforms, textbooks and stationery, and other items, paid or due in the current academic year. It leaves out private coaching.',
              'Values are rupees at the prices of April to June 2025, as the survey recorded them.',
              'Private aided schools are privately run with government aid. The report also gives "Others", which includes unrecognised private schools and taught 0.8% of students.',
              'Pre-primary includes anganwadis. Primary is classes 1 to 5, middle 6 to 8, secondary 9 and 10, and higher secondary 11 and 12.',
              'The survey does not compare with NSS round 75 (2017-18), which counted coaching as school spending and left anganwadis out of pre-primary.',
              'The survey asked 52,085 households about 57,742 students, from April to June 2025.',
            ],
            processing: [
              'Read indicators 30, 31 and 32 of NSS round 80, survey code 2, from the eSankhyiki API.',
              'Check them against NSS Report No. 595: Statement 2.5 (all 60 values) and every page of Tables 5.1 and 5.2, whose all-India rows are Statements 2.3 and 2.4. All agree.',
              'Show all students, rural and urban together.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'Among states, spending per student ranged from ₹5,656 in Bihar to ₹25,720 in Haryana. Chandigarh had the highest value of any state or UT, ₹49,711.',
        },
        {
          chart: {
            kind: 'states',
            slug: 'school-spending-by-state',
            checked: '2026-11-25',
            title: 'Spending per school student by state, 2025',
            subtitle: 'Average household spending per student in the current academic year, all levels and types of school.',
            punches: { office: 'MoSPI', unit: '₹ a year', period: '2025' },
            status: ['Survey estimate'],
            note: 'Small states and UTs have wide margins of error. Chandigarh has no rural sample.',
            sources: [cmse2025, cmse2025Api],
            format: { unit: '₹', decimals: 0 },
            data: { file: SPEND, where: { level: 'all levels', school_type: 'all', ...ALL_PERSONS }, x: 'geography' },
            open: 'map',
            scale: 'seq',
            short: 'Spending per school student',
            know: [
              'The average covers all students from pre-primary to class 12, in government and private schools. It leaves out private coaching.',
              "Private schools cost more, so a state's average depends on how many of its students attend them.",
              NSS_STATE_KNOW,
              'For this measure the relative standard error passes 25% in Arunachal Pradesh, Chandigarh, Dadra and Nagar Haveli and Daman and Diu, Ladakh, Lakshadweep and Puducherry (RSE Table 1).',
              'Values are rupees at the prices of April to June 2025.',
            ],
            processing: [
              'Read indicator 30 of NSS round 80, survey code 2, from the eSankhyiki API: all levels, all students, rural and urban.',
              'Check every value on the six pages of Table 5.1 in NSS Report No. 595. All 1,998 agree.',
              'Match state names to the site geography table.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'Government schools taught 55.9% of students. The share was 81.7% in Bihar and 15.3% in Goa.',
        },
        {
          chart: {
            kind: 'states',
            slug: 'government-school-share-by-state',
            checked: '2026-11-25',
            title: 'Students in government schools by state, 2025',
            subtitle: 'Share of students from pre-primary to class 12 who attend a government school, by state.',
            punches: { office: 'MoSPI', unit: '% students', period: '2025' },
            status: ['Survey estimate'],
            sources: [cmse2025, cmse2025Api],
            format: { unit: '%', decimals: 1 },
            data: { file: SCHOOL_TYPE, where: { school_type: 'government', ...ALL_PERSONS }, x: 'geography' },
            open: 'map',
            scale: 'seq',
            short: 'In government schools',
            know: [
              'The survey asks households which school each student attends. UDISE+ counts enrolment from school returns, so the two shares can differ.',
              'Private aided schools taught 11.3% of students and private unaided recognised schools 31.9%. Neither counts as government here.',
              'Government schools taught 66.0% of rural students and 30.1% of urban students.',
              NSS_STATE_KNOW,
            ],
            processing: [
              'Read indicator 24 of NSS round 80, survey code 2, from the eSankhyiki API.',
              'Check every value on the four pages of Table 2 in NSS Report No. 595, whose all-India rows are Statement 1.2. All 1,332 agree.',
              'Match state names to the site geography table.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'In 2025, 27.0% of school students took private coaching. In Tripura the share was 78.6%, and in West Bengal 74.6%.',
        },
        {
          chart: {
            kind: 'states',
            slug: 'private-coaching-by-state',
            checked: '2026-11-25',
            title: 'Students who take private coaching by state, 2025',
            subtitle: 'Share of school students who took private coaching or tuition in the current academic year.',
            punches: { office: 'MoSPI', unit: '% students', period: '2025' },
            status: ['Survey estimate'],
            sources: [cmse2025, cmse2025Api],
            format: { unit: '%', decimals: 1 },
            data: { file: COACHING, where: { level: 'all levels', ...ALL_PERSONS }, x: 'geography' },
            open: 'map',
            scale: 'seq',
            short: 'Private coaching',
            know: [
              'Coaching covers private coaching and tuition classes taken in the current academic year, for students from pre-primary to class 12.',
              'Across India the share rose from 11.6% in pre-primary to 37.8% in classes 9 and 10.',
              'Urban students took coaching more often than rural students: 30.7% against 25.5%.',
              NSS_STATE_KNOW,
            ],
            processing: [
              'Read indicator 38 of NSS round 80, survey code 2, from the eSankhyiki API.',
              'Check every value on the six pages of Table 11 in NSS Report No. 595, whose all-India rows are Statement 3.1. All 1,998 agree.',
              'Match state names to the site geography table.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How many young adults go to college?',
      lede: 'In 2023-24 the college enrolment ratio was 30.0. Women have been ahead of men since 2017-18.',
      blocks: [
        {
          chart: {
            kind: 'line',
            slug: 'college-enrolment-ratio',
            title: 'College enrolment ratio in India by sex, 2011-12 to 2023-24',
            subtitle: 'Gross enrolment ratio in higher education, people aged 18 to 23, India.',
            punches: { office: 'MoE', unit: 'GER 18-23', period: '2023-24' },
            note: 'AISHE reports run two years behind. The 2023-24 report is the latest.',
            sources: [aisheTimeSeries, aishe2023_24],
            format: { decimals: 1 },
            y: { min: 0 },
            markers: [{ x: '2017-18', label: '2017-18: women overtake men' }],
            series: [
              {
                key: 'women',
                label: 'Women',
                color: 's3',
                file: GER_HE_INDIA,
                where: { geography: 'india', sex: 'female' },
              },
              { key: 'men', label: 'Men', color: 's2', file: GER_HE_INDIA, where: { geography: 'india', sex: 'male' } },
              { key: 'all', label: 'All', color: 'ink', file: GER_HE_INDIA, where: { geography: 'india', sex: 'total' } },
            ],
            know: [
              'The ratio divides enrolment in higher education, of any age, by the population aged 18 to 23.',
              'All years use population projections based on Census 2011, so the series is consistent from 2011-12.',
              'In 2017-18 women were ahead for the first year: 24.6 against 24.5. In 2023-24 it was 31.2 for women and 28.9 for men.',
              'Universities and colleges submit data to AISHE voluntarily. The 2023-24 report came out on 8 July 2026.',
            ],
            processing: [
              'Read 2011-12 to 2021-22 from the AISHE time series for GER based on the 2011 population projection.',
              'Read 2022-23 and 2023-24 from Table 47 of the AISHE 2023-24 final report.',
              'Check that Table 47 matches the time series file for 2019-20 to 2021-22.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'The ratio ranged from 7.1 in Lakshadweep to 72.3 in Puducherry. Tamil Nadu, at 52.3, was highest among large states.',
        },
        {
          chart: {
            sortBy: 'total',
            kind: 'dots',
            slug: 'college-enrolment-ratio-by-state',
            title: 'College enrolment ratio by state, women and men, 2023-24',
            subtitle: 'Gross enrolment ratio in higher education, ages 18 to 23, by state.',
            punches: { office: 'MoE', unit: 'GER 18-23', period: '2023-24' },
            sources: [aishe2023_24],
            format: { decimals: 1 },
            by: 'geography',
            series: [
              {
                key: 'women',
                label: 'Women',
                color: 's3',
                file: GER_HE_STATE,
                where: { sex: 'female', social_group: 'all categories' },
                x: 'geography',
              },
              {
                key: 'men',
                label: 'Men',
                color: 's2',
                file: GER_HE_STATE,
                where: { sex: 'male', social_group: 'all categories' },
                x: 'geography',
              },
              // The sort key and the prose values for Tamil Nadu and Bihar; not drawn.
              {
                key: 'total',
                label: 'Women and men',
                color: 'ink',
                hidden: true,
                file: GER_HE_STATE,
                where: { sex: 'total', social_group: 'all categories' },
                x: 'geography',
              },
            ],
            know: [
              'The ratio divides enrolment in higher education, of any age, by the population aged 18 to 23. It uses projections based on Census 2011.',
              'Students who study in another state count where they study, so small UTs with many colleges, such as Puducherry and Chandigarh, show high ratios.',
              'In 2023-24 the ratio was 30.0 for India. Among large states, Tamil Nadu was highest at 52.3 and Bihar lowest at 17.7.',
              'Universities and colleges submit data to AISHE voluntarily.',
            ],
            processing: [
              'Read Table 19 of the AISHE 2023-24 final report, all categories, based on the 2011 population.',
              'Keep the rows for all social groups only.',
              'Match state names to the site geography table.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How many people can read and write?',
      lede: 'A 2025 survey estimated that 81.1% of people aged 7 and over could read and write: 87.5% of men and 74.9% of women.',
      blocks: [
        {
          // LATER: the board draws 2025 as ranked bars (Tamil Nadu in series-1) with 2011 as rings; dots is the closest kind.
          chart: {
            kind: 'dots',
            slug: 'literacy-by-state',
            title: 'Literacy by state and UT, 2025 survey and 2011 Census',
            subtitle: 'People aged 7 and over who can read and write, by state.',
            punches: { office: 'MoSPI', unit: '% 7+', period: '2025' },
            status: ['Survey estimate'],
            note: 'Filled dots: 2025 survey. Rings: 2011 Census. In 2011, Andhra Pradesh included Telangana and Jammu and Kashmir included Ladakh.',
            sources: [plfsAnnual2025, census2011Pca],
            format: { unit: '%' },
            by: 'geography',
            hollow: ['census-2011'],
            series: [
              {
                key: 'plfs-2025',
                label: '2025, PLFS survey estimate',
                color: 'ink',
                file: LITERACY,
                where: { period: '2025', sex: 'person' },
                x: 'geography',
              },
              {
                key: 'census-2011',
                label: '2011, Census count',
                color: 'slate',
                file: LITERACY,
                where: { period: '2011', sex: 'person' },
                x: 'geography',
              },
              {
                key: 'plfs-2025-men',
                label: 'Men, 2025',
                color: 's2',
                hidden: true,
                file: LITERACY,
                where: { period: '2025', sex: 'male' },
                x: 'geography',
              },
              {
                key: 'plfs-2025-women',
                label: 'Women, 2025',
                color: 's3',
                hidden: true,
                file: LITERACY,
                where: { period: '2025', sex: 'female' },
                x: 'geography',
              },
            ],
            know: [
              'The 2025 values are PLFS survey estimates. The 2011 values are a full Census count. The gap mixes real change with a change of method.',
              'The 2011 Census counted 72.98% of people aged 7 and over as literate. The 2025 survey estimated 81.1%.',
              'In 2011 Andhra Pradesh included Telangana and Jammu and Kashmir included Ladakh. Those rows do not compare with 2025.',
              'Dadra and Nagar Haveli and Daman and Diu were two UTs in 2011. Their counts are added.',
              'The 2011 rates are derived: literates divided by the population aged 7 and over.',
              'Census 2027 enumeration runs to early 2027 and will replace the 2011 counts.',
            ],
            processing: [
              'Read the 2025 rates from Table (7) of Appendix A of the PLFS Annual Report 2025 (rural plus urban, age 7 and over).',
              'Derive the 2011 rates from the Census 2011 Primary Census Abstract: literates divided by the population minus children aged 0 to 6.',
              'Check the derived 2011 rates against the published Census rates: 72.98% for India, 94.00% for Kerala and 61.80% for Bihar.',
              'Add the 2011 counts of Dadra and Nagar Haveli and of Daman and Diu into one row.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'States with more literate people did not always send more young people to college. Mizoram had the highest literacy, 99.8%, and a college enrolment ratio of 31.5. Telangana had 74.6% literacy and a ratio of 46.6.',
        },
        {
          chart: {
            kind: 'scatter',
            slug: 'literacy-and-college-enrolment-by-state',
            title: 'Literacy and college enrolment by state and UT, 2025 and 2023-24',
            subtitle: 'Share of people aged 7 and over who can read and write, 2025, against the gross enrolment ratio in higher education, ages 18 to 23, 2023-24. One dot per state or UT.',
            punches: { office: 'MoSPI · MoE', unit: '% 7+ · GER 18-23', period: '2025 and 2023-24' },
            status: ['Survey estimate'],
            note: 'An association, not a cause. The two measures are about one year apart: no literacy estimate by state exists for 2023-24. The lines mark India.',
            sources: [plfsAnnual2025, aishe2023_24],
            x: { key: 'literacy', label: 'Literacy, % aged 7+', color: 'slate', format: { unit: '%' }, file: LITERACY, where: { period: '2025', sex: 'person' } },
            y: { key: 'ger', label: 'College enrolment ratio, 18-23', color: 'slate', format: { decimals: 1 }, file: GER_HE_STATE, where: { period: '2023-24', sex: 'total', social_group: 'all categories' } },
            labels: ['mizoram', 'telangana', 'puducherry', 'chandigarh', 'bihar', 'lakshadweep'],
            know: [
              'This chart shows how the two measures sit together in each state. It does not show that one causes the other.',
              'The periods do not match. Literacy is from PLFS, January to December 2025. The enrolment ratio is from AISHE 2023-24, the latest report. PLFS gives no literacy by state for 2023-24, and the Census gives it for 2011 only.',
              'Literacy counts everyone aged 7 and over. The enrolment ratio divides enrolment in higher education, of any age, by the population aged 18 to 23.',
              'Students who study in another state count where they study, so small UTs with many colleges, such as Puducherry and Chandigarh, show high ratios.',
              'Literacy in 2025 is a survey estimate. Universities and colleges submit data to AISHE voluntarily.',
            ],
            processing: [
              'Read literacy from Table (7) of Appendix A of the PLFS Annual Report 2025 (rural plus urban, age 7 and over), as in the chart above.',
              'Read the enrolment ratio from Table 19 of the AISHE 2023-24 final report, all categories, as in the college chart.',
              'Pair the two values by state. Draw no fitted line.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'In 2022-23 adults aged 25 and over had spent 7.5 years in school or college on average. Goa had 11.6 years. Andhra Pradesh and Rajasthan had 6.1.',
        },
        {
          chart: {
            kind: 'states',
            slug: 'mean-years-of-schooling-by-state',
            checked: '2026-11-25',
            title: 'Mean years of schooling by state, age 25 and over, 2022-23',
            subtitle: 'Average years spent in formal education by people aged 25 and over, by state.',
            punches: { office: 'MoSPI', unit: 'years, 25+', period: '2022-23' },
            status: ['Survey estimate'],
            sources: [cams2022_23, cams2022_23Api],
            format: { decimals: 1, suffix: ' years' },
            data: { file: MYS, where: { age_group: '25+', ...ALL_PERSONS }, x: 'geography' },
            open: 'map',
            scale: 'seq',
            better: 'high',
            short: 'Years of schooling, 25+',
            know: [
              'The mean counts the years each person spent in formal education, pre-primary included, whether or not the course was completed. Repeated years do not count. People who never enrolled count as 0.',
              'Women aged 25 and over had 6.3 years on average and men 8.6 years. For everyone aged 15 and over the India value was 8.4 years.',
              'The survey, CAMS, ran from July 2022 to June 2023 as NSS round 79. It is a household survey, so each value is a survey estimate.',
            ],
            processing: [
              'Read indicator 3 of NSS round 79, survey code 1, from the eSankhyiki API.',
              'Check every value in Table 3 of NSS Report No. 590 (ages 15+ and 25+). All 666 agree.',
              'Match state names to the site geography table.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
  ],
  // LATER: the About band's side line ("How each education figure is made, where it breaks, and what is missing.") has no field.
  about: {
    intro:
      'Schools report their own counts. Colleges answer a survey of institutions. Literacy, schooling and household spending on school come from household surveys and the Census.',
    publisher:
      'The Ministry of Education publishes school data (UDISE+) and college data (AISHE). NSO, MoSPI, publishes the PLFS literacy estimate and the NSS surveys of school spending (CMS: Education 2025) and schooling (CAMS 2022-23). The Registrar General of India (ORGI) runs the Census.',
    frequency:
      'UDISE+: yearly, latest on 7 Jul 2026. AISHE: yearly, about two years behind; latest on 8 Jul 2026. PLFS: yearly. NSS education surveys: one-off rounds, latest on 26 Aug 2025. Census: last full count in 2011.',
    revisions:
      'AISHE and Census figures are final as published. MoSPI revised the PLFS 2025 report on 29 May 2026.',
    breaks:
      'UDISE+ replaced UDISE in 2018-19. From 2022-23 it counts each student and uses new population projections; do not compare ratios across this break. Literacy: 2011 is a full count, 2025 a survey. School spending in 2025 does not compare with NSS round 75 (2017-18).',
    coverage:
      'India and all 36 states and UTs. School levels use the existing structure, not NEP 2020. College ratios cover ages 18 to 23. Literacy covers ages 7 and over. School spending covers students from pre-primary to class 12.',
    missing:
      'UDISE dropout rates for 2017-18 could not be checked by cohort year. AISHE gives no SC or ST ratio for several UTs. NSS state values for small states and UTs have wide errors. No publisher states a reuse licence.',
  },
  sources: [
    ...SCHOOL_TREND_SOURCES,
    aishe2023_24,
    aisheTimeSeries,
    plfsAnnual2025,
    census2011Pca,
    cmse2025,
    cmse2025Api,
    cams2022_23,
    cams2022_23Api,
  ],
  related: [
    { label: 'Jobs: Unemployment among people aged 15 to 29', href: '/charts/youth-unemployment/' },
    { label: 'Jobs: Women in the labour force by state', href: '/charts/women-labour-force-by-state/' },
    // The Population chart slug belongs to another module; this points at the topic page.
    { label: 'Population: People by state', href: '/population/' },
    { label: 'States: Tamil Nadu profile', href: '/states/tamil-nadu/' },
    { label: 'How we check: method breaks', href: '/how-we-check/#part-3' },
  ],
}

export default topic
