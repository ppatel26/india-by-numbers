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

const TREND = 'education/education-school-trend-india.csv'
const DROPOUT = 'education/education-dropout-by-state.csv'
const GER_SCHOOL = 'education/education-ger-school-by-state.csv'
const PTR = 'education/education-ptr-by-state.csv'
const FACILITIES = 'education/education-school-facilities-by-state.csv'
const GER_HE_STATE = 'education/education-higher-ed-ger-by-state.csv'
const GER_HE_INDIA = 'education/education-higher-ed-ger-india.csv'
const LITERACY = 'education/education-literacy-by-state.csv'

const OLD_YEARS = ['2020-21', '2021-22']
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

/** Chart 1.1: one series per indicator, level and method (to 2021-22, from 2022-23). */
const trendSeries: Series[] = INDICATORS.flatMap(([ind, indicator]) =>
  LEVELS.filter(([lvl]) => !(ind === 'dropout' && lvl === 'higher-secondary')).flatMap(([lvl, level, label, color]) =>
    (
      [
        ['old', OLD_YEARS],
        ['new', NEW_YEARS],
      ] as const
    ).map(([m, years]) => ({
      key: `${ind}-${lvl}-${m}`,
      label,
      color,
      ...(ind === 'enrol' ? { format: { scale: 'crore', decimals: 2 } as const } : {}),
      file: TREND,
      where: { indicator, level, period: years },
    })),
  ),
)

const trendPanel = (ind: string) => trendSeries.filter((s) => s.key.startsWith(`${ind}-`)).map((s) => s.key)

const topic: Topic = {
  slug: 'education',
  name: 'Education',
  hindi: 'शिक्षा',
  question: 'How many children are in school, and how far do they get?',
  standfirst:
    'In 2025-26, 24.72 crore children were enrolled from pre-primary to class 12, against 24.69 crore in 2024-25.',
  figures: [
    { chart: 'school-enrolment-trend', series: 'enrol-total-new', label: 'Students, pre-primary to class 12' },
    { chart: 'ger-higher-secondary-by-state', label: 'Enrolment ratio, classes 11 and 12' },
    { chart: 'college-enrolment-ratio', series: 'all', label: 'College enrolment ratio, age 18-23' },
  ],
  nextRelease: 'not announced',
  parts: [
    {
      title: 'How many children are in school?',
      lede: 'UDISE+ is a yearly count of every school, run by the Ministry of Education. Schools enter their own data. The reference date for 2025-26 was 31 March 2026.',
      blocks: [
        { text: 'Primary enrolment (classes 1 to 5) fell to 10.19 crore in 2025-26, from 10.44 crore in 2024-25.' },
        {
          chart: {
            kind: 'line',
            slug: 'school-enrolment-trend',
            title: 'Children in school in India by level, 2020-21 to 2025-26',
            subtitle:
              'Enrolment (crore), gross enrolment ratio and dropout rate (%) by school level, India, 2020-21 to 2025-26.',
            punches: { office: 'MoE', unit: 'crore · %', period: '2025-26' },
            status: ['Method break'],
            note: 'From 2022-23, UDISE+ records each student and uses new population projections. The booklet says ratios are strictly not comparable with figures up to 2021-22, so the lines are not joined. Each year is as first published. Levels follow the existing structure (classes 1-5, 6-8, 9-10, 11-12), not the NEP 2020 structure.',
            sources: [udise2025_26, udise2024_25, udise2023_24, udise2022_23, udise2021_22],
            series: [
              ...trendSeries,
              // Read for the first headline figure and the standfirst; not drawn.
              {
                key: 'enrol-total-new',
                label: 'All levels, pre-primary to 12',
                color: 'ink',
                hidden: true,
                file: TREND,
                where: { indicator: 'enrolment', level: 'total (pre-primary to higher secondary)', period: NEW_YEARS },
              },
            ],
            panels: [
              { label: 'Enrolment', series: trendPanel('enrol'), own: true },
              { label: 'Gross enrolment ratio', series: trendPanel('ger') },
              { label: 'Dropout rate, %', series: trendPanel('dropout'), own: true },
            ],
            breaks: [{ x: '2022-23', label: 'New method' }],
            know: [
              'UDISE+ is an administrative count. Each school enters its own data, with a reference date of 31 March at the end of the school year.',
              'From 2022-23, UDISE+ collects data for each student, not school totals, and uses revised population projections. The booklet says ratios are strictly not comparable with figures up to 2021-22. Primary GER fell from 103.39 to 96.2 and the primary dropout rate rose from 1.45% to 7.8% across the break, mostly because of the change of method.',
              'The gross enrolment ratio (GER) divides enrolment at a level, of any age, by the population of the official age for that level, so it can be above 100.',
              'Each year is as first published. Later booklets do not restate earlier years.',
              'Levels follow the existing structure. The NEP 2020 structure groups classes differently and gives different ratios.',
            ],
            processing: [
              'Read Table 1, "National Highlights", from each UDISE+ booklet (existing structure): 2021-22 (for 2020-21 and 2021-22), 2022-23, 2023-24, 2024-25 and 2025-26.',
              'Take each year from its own booklet, as first published.',
              'Show enrolment in crore of students; keep ratios and rates as published.',
              'Split each level into two series at 2022-23, the start of student-level data.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'Which states keep children in school?',
      lede: 'Two measures show who stays in school. The dropout rate is the share of students who leave a level during the year. The gross enrolment ratio (GER) divides enrolment at a level, of any age, by the population of the official age for that level, so it can be above 100.',
      blocks: [
        {
          text: 'In 2025-26 the dropout rate in classes 9 and 10 was highest in Karnataka (18.1%) and lowest in Chandigarh (1.3%).',
        },
        {
          chart: {
            kind: 'states',
            slug: 'dropout-rate-by-state',
            title: 'Dropout rate in classes 9 and 10 by state and UT, 2025-26',
            subtitle: 'Students in classes 9 and 10 who dropped out, %, 36 states and UTs, 2025-26.',
            punches: { office: 'MoE', unit: '%', period: '2025-26' },
            note: 'Each state and UT is one equal tile. The grid is not a map of borders. Rates are as published in UDISE+ Table 6.13; the India rate fell from 11.5% in 2024-25 to 9.5%.',
            sources: [udise2025_26],
            format: { unit: '%', decimals: 1 },
            data: { file: DROPOUT, where: { level: 'secondary (9-10)', sex: 'total' }, x: 'geography' },
            open: 'map',
            scale: 'seq',
            better: 'low',
            short: 'Dropout, classes 9-10',
            know: [
              'The dropout rate is the share of students in a level who leave school during the year. The rate here is for secondary level, classes 9 and 10.',
              'In 2025-26 the rate was 9.5% for India, highest in Karnataka (18.1%) and lowest in Chandigarh (1.3%).',
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
          text: 'In 2025-26 the enrolment ratio in classes 11 and 12 was 61.7 for India, 42.1 in Bihar and 91.9 in Kerala.',
        },
        {
          chart: {
            kind: 'states',
            slug: 'ger-higher-secondary-by-state',
            title: 'Enrolment ratio in classes 11 and 12 by state and UT, 2025-26',
            subtitle:
              'Gross enrolment ratio, higher secondary (classes 11 and 12), boys and girls, 36 states and UTs, 2025-26.',
            punches: { office: 'MoE', unit: 'GER', period: '2025-26' },
            note: 'India is a reference line, not a rank. GER counts enrolment of any age, so it can be above 100. The booklet warns that ratios for UTs and some small states changed with the new population projections.',
            sources: [udise2025_26],
            format: { decimals: 1 },
            data: { file: GER_SCHOOL, where: { level: 'higher secondary (11-12)', sex: 'total' }, x: 'geography' },
            open: 'chart',
            scale: 'seq',
            better: 'high',
            short: 'GER, classes 11-12',
            know: [
              'The gross enrolment ratio (GER) divides enrolment in classes 11 and 12, of any age, by the population of the official age for those classes. It can be above 100: Chandigarh has 108.2.',
              'A ratio above 100 can mean over-age or under-age students, students from other states, or a low population projection.',
              'The booklet warns that ratios for UTs and some small states changed with the new population projections from 2022-23.',
              'The ratio covers boys and girls together, all social groups.',
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
      lede: "UDISE+ records teachers and facilities for each school. The figures for electricity and girls' toilets count only those that work.",
      blocks: [
        {
          text: 'India had 15 pupils for each teacher at secondary level in 2025-26, and Jharkhand had 31, the most of any state.',
        },
        {
          chart: {
            kind: 'states',
            slug: 'pupils-per-teacher-by-state',
            title: 'Pupils per teacher at secondary level by state and UT, 2025-26',
            subtitle: 'Pupils per teacher, secondary (classes 9 and 10), 36 states and UTs, 2025-26.',
            punches: { office: 'MoE', unit: 'pupils', period: '2025-26' },
            note: 'India is a reference line, not a rank. A lower number means fewer pupils for each teacher.',
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
          text: 'Two in three schools (67.4%) had internet in 2025-26, but in West Bengal it was one in five (19.7%).',
        },
        {
          // Rows keep the CSV order, which is sorted by internet share.
          chart: {
            kind: 'table',
            slug: 'school-facilities-by-state',
            title: 'School facilities by state and UT, 2025-26',
            subtitle:
              "Share of schools with internet, working electricity and a working girls' toilet, %, India and 36 states and UTs, 2025-26. Sorted by internet.",
            punches: { office: 'MoE', unit: '% schools', period: '2025-26' },
            note: 'Derived: internet shares are schools with internet divided by all schools, from Table 2.5. The India value (67.4%) matches the published figure. Electricity and toilets count only working facilities (Tables 8.6 and 8.8), so they are lower than the 95.0% and 98.5% in Table 1, which count any connection or toilet.',
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
              'Internet shares are derived: schools with internet divided by all schools, from Table 2.5. For India the derived share is 67.4%, the same as the share Table 1 publishes.',
              "Electricity and girls' toilets count only facilities that work (Tables 8.6 and 8.8). Table 1 also gives shares for any electricity connection or any girls' toilet, which are higher. The two do not mix.",
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
      title: 'How many young adults go to college?',
      lede: 'The All India Survey on Higher Education (AISHE) covers universities and colleges, which submit data voluntarily. Its latest report covers 2023-24 and was released on 8 July 2026.',
      blocks: [
        {
          text: 'Women overtook men in higher education in 2017-18, and in 2023-24 the ratio was 31.2 for women and 28.9 for men.',
        },
        {
          chart: {
            kind: 'line',
            slug: 'college-enrolment-ratio',
            title: 'College enrolment ratio in India by sex, 2011-12 to 2023-24',
            subtitle:
              'Gross enrolment ratio in higher education, per cent of people aged 18 to 23, India, 2011-12 to 2023-24.',
            punches: { office: 'MoE', unit: 'GER 18-23', period: '2023-24' },
            note: 'All years use population projections based on Census 2011. AISHE reports run two years behind; the 2023-24 report is the latest.',
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
              'In 2017-18 the ratio was 24.6 for women and 24.5 for men, the first year women were ahead. In 2023-24 it was 31.2 for women and 28.9 for men.',
              'Universities and colleges submit data to AISHE voluntarily. The latest report covers 2023-24.',
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
          text: 'In 2023-24 the ratio ranged from 7.1 in Lakshadweep to 72.3 in Puducherry, and Tamil Nadu, at 52.3, was highest among large states.',
        },
        {
          chart: {
            sortBy: 'total',
            kind: 'dots',
            slug: 'college-enrolment-ratio-by-state',
            title: 'College enrolment ratio by state and UT, women and men, 2023-24',
            subtitle:
              'Gross enrolment ratio in higher education, per cent of people aged 18 to 23, 36 states and UTs, 2023-24. Sorted by the ratio for women.',
            punches: { office: 'MoE', unit: 'GER 18-23', period: '2023-24' },
            note: 'India is a reference line, not a rank. Ratios use population projections based on Census 2011. Institutions submit data to AISHE voluntarily.',
            sources: [aishe2023_24],
            format: { decimals: 1 },
            by: 'geography',
            refs: [{ value: 30.0, label: 'India 30.0 (women 31.2, men 28.9)' }],
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
      lede: 'The last full count of literacy is the 2011 Census. Since then, the only national figures come from sample surveys. Census 2027 will give new counts.',
      blocks: [
        {
          text: 'The PLFS survey estimated that 81.1% of people aged 7 and over could read and write in 2025: 87.5% of men and 74.9% of women.',
        },
        {
          // LATER: the board draws 2025 as ranked bars (Tamil Nadu in series-1) with 2011 as rings; dots is the closest kind.
          chart: {
            kind: 'dots',
            slug: 'literacy-by-state',
            title: 'Literacy by state and UT, 2025 survey and 2011 Census',
            subtitle:
              'Share of people aged 7 and over who can read and write, %, 36 states and UTs. Bars: 2025 survey estimate. Rings: 2011 Census count. The two are not joined.',
            punches: { office: 'MoSPI', unit: '% 7+', period: '2025' },
            status: ['Survey estimate'],
            note: 'Telangana and Ladakh did not exist in 2011. * The 2011 Andhra Pradesh figure includes present Telangana, and Jammu and Kashmir includes Ladakh, so they do not compare with 2025. The 2011 Dadra and Nagar Haveli and Daman and Diu figure adds the two former UTs. India: 72.98% in 2011. Derived: Census 2011 rates are literates divided by the population aged 7 and over.',
            sources: [plfsAnnual2025, census2011Pca],
            format: { unit: '%' },
            by: 'geography',
            hollow: ['census-2011'],
            refs: [{ value: 81.1, label: 'India 81.1% (2025)' }],
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
              'The 2025 values are survey estimates from the Periodic Labour Force Survey. The 2011 values are a full count from the Census. The gap between them mixes real change with a change of method, so the two are not joined.',
              'The 2011 Census counted 72.98% of people aged 7 and over as literate. The 2025 survey estimated 81.1%.',
              'In 2011 Andhra Pradesh included present Telangana and Jammu and Kashmir included Ladakh, so those rows do not compare with 2025. Dadra and Nagar Haveli and Daman and Diu were two UTs in 2011; their counts are added.',
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
      ],
    },
  ],
  // LATER: the About band's side line ("How each education figure is made, where it breaks, and what is missing.") has no field.
  about: {
    intro:
      'All values are as published. We last checked every source on 18 November 2026. School figures are an administrative count of schools, college figures come from a survey of institutions, and literacy comes from a household survey and the Census.',
    publisher:
      'The Ministry of Education publishes school data through UDISE+ (Department of School Education and Literacy) and college data through the All India Survey on Higher Education, AISHE (Department of Higher Education). The National Statistics Office (NSO), MoSPI, publishes the PLFS literacy estimate. The Office of the Registrar General of India (ORGI) runs the Census.',
    frequency:
      'UDISE+: once a year. The 2025-26 booklet came out on 7 Jul 2026, with a reference date of 31 Mar 2026. AISHE: once a year, about two years after the academic year; the 2023-24 report came out on 8 Jul 2026. PLFS annual report: once a year. Census: the last full count was in 2011.',
    revisions:
      'Each UDISE+ year is shown as first published; later booklets do not restate earlier years. AISHE and Census figures are final as published. MoSPI released the PLFS 2025 report on 27 Mar 2026 and a revised file on 29 May 2026.',
    breaks:
      'From 2022-23, UDISE+ collects data for each student, not school totals, and uses revised population projections. The booklet says ratios are strictly not comparable with figures up to 2021-22. Primary GER fell from 103.39 to 96.2 and the primary dropout rate rose from 1.45% to 7.8%, mostly because of the change of method. AISHE ratios use population projections based on Census 2011. Literacy in 2011 is a full count and in 2025 a sample survey, so the two are not joined.',
    coverage:
      'India and all 36 states and UTs. School figures use the existing structure: primary (classes 1-5), upper primary (6-8), secondary (9-10) and higher secondary (11-12). UDISE+ also publishes NEP 2020 figures, such as a secondary GER of 71.7% for classes 9 to 12, which is a different measure. College ratios cover people aged 18 to 23; literacy covers people aged 7 and over. In 2011, Andhra Pradesh included present Telangana and Jammu and Kashmir included Ladakh.',
    missing:
      'UDISE+ booklets before 2020-21 use a different layout, so the school series starts in 2020-21. The latest AISHE report covers 2023-24. AISHE gives no SC or ST ratio for several UTs, and its 2023-24 highlights give two ST ratios for 2022-23 (23.5 and 22.6); this page uses no ST figures. Census 2027 enumeration runs to early 2027 and will replace the 2011 literacy counts. No publisher states a reuse licence for these data.',
  },
  sources: [
    udise2025_26,
    udise2024_25,
    udise2023_24,
    udise2022_23,
    udise2021_22,
    aishe2023_24,
    aisheTimeSeries,
    plfsAnnual2025,
    census2011Pca,
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
