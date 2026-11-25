import type { Color, Series, Source, Topic } from '../types'

// Sources: research/data/jobs/README.md.

const plfsMonthlyOct2026: Source = {
  publisher: 'NSO, MoSPI',
  release: 'PLFS Monthly Bulletin, October 2026',
  released: '2026-11-16',
  url: 'https://www.mospi.gov.in/uploads/publications_reports/publications_reports1794821821618_7cec3a56-a5c5-4a5e-a347-3b5e1b5f4a63_Monthly_Bulletin_PLFS_Oct_2026.pdf',
}

const plfsMonthlyPressOct2026: Source = {
  publisher: 'NSO, MoSPI',
  release: 'Press note, PLFS Monthly Bulletin, October 2026',
  released: '2026-11-16',
  url: 'https://www.mospi.gov.in/uploads/latestreleasesfiles/1794825935157-Monthly_Press_note_PLFS_Oct_2026.pdf',
}

const plfsMonthlyPressMar2026: Source = {
  publisher: 'NSO, MoSPI',
  release: 'Press note, PLFS Monthly Bulletin, March 2026 (revised)',
  released: '2026-04-15',
  url: 'https://www.mospi.gov.in/uploads/latestreleasesfiles/1776249342330-Monthly_Press_note_March_2026_rev_V2.pdf',
}

const plfsQuarterlyJulSep2026: Source = {
  publisher: 'NSO, MoSPI',
  release: 'PLFS Quarterly Bulletin, July to September 2026',
  released: '2026-11-10',
  url: 'https://www.mospi.gov.in/uploads/publications_reports/publications_reports1794297172776_05eae330-7f2d-45ec-84c5-07031201ecf1_PLFS_QB_July-Sept_2026_m.pdf',
}

const plfsQuarterlyAprJun2025: Source = {
  publisher: 'NSO, MoSPI',
  release: 'PLFS Quarterly Bulletin, April to June 2025',
  released: '2025-08-18',
  url: 'https://www.mospi.gov.in/uploads/publications_reports/publications_reports1757323377120_dab45d40-9160-4804-8ac0-387846ebd44d_QuarterlyBulletinPLFS_April_June_2025.pdf',
}

// The date is the MoSPI archive date (README).
const plfsQuarterlyOctDec2024: Source = {
  publisher: 'NSO, MoSPI',
  release: 'PLFS Quarterly Bulletin, October to December 2024',
  released: '2025-01-16',
  url: 'https://www.mospi.gov.in/sites/default/files/publication_reports/PLFS_Quarterly_Bulletin_Oct-Dec24.pdf',
}

const plfsQuarterlyAprJun2024: Source = {
  publisher: 'NSO, MoSPI',
  release: 'PLFS Quarterly Bulletin, April to June 2024',
  released: '2024-08-16',
  url: 'https://www.mospi.gov.in/sites/default/files/publication_reports/Quarterly_Bulletin_PLFS_April_June_2024.pdf',
}

// The date is the press note date (README).
const plfsQuarterlyJanMar2023: Source = {
  publisher: 'NSO, MoSPI',
  release: 'PLFS Quarterly Bulletin, January to March 2023',
  released: '2023-05-29',
  url: 'https://www.mospi.gov.in/sites/default/files/publication_reports/QuarterlyBulletinPLFS%20JanuaryMarch2023.pdf',
}

// The bulletin has no cover date; its PDF is dated 16 Jun 2022, so the month is June 2022.
const plfsQuarterlyJanMar2022: Source = {
  publisher: 'NSO, MoSPI',
  release: 'PLFS Quarterly Bulletin, January to March 2022',
  released: '2022-06',
  url: 'https://www.mospi.gov.in/sites/default/files/publication_reports/Quarterly%20Bulletin%20PLFS%20January%20-%20March%202022.pdf',
}

// The bulletin has no cover date; its PDF is dated 14 Mar 2022, so the month is March 2022.
const plfsQuarterlyAprJun2021: Source = {
  publisher: 'NSO, MoSPI',
  release: 'PLFS Quarterly Bulletin, April to June 2021',
  released: '2022-03',
  url: 'https://www.mospi.gov.in/sites/default/files/publication_reports/Quarterly%20Bulletin%20PLFS%20April-June%202021.pdf',
}

// The file carries no date; this is the MoSPI archive date (README).
const plfsQuarterlyPressOctDec2021: Source = {
  publisher: 'NSO, MoSPI',
  release: 'Press note, PLFS Quarterly Bulletin, October to December 2021',
  released: '2023-02-27',
  url: 'https://www.mospi.gov.in/uploads/documents/Press_note_QB_October_December_20211651839674736.pdf',
}

// Released 2 Aug 2021: PIB release 1741589 and the bulletin's cover date.
const plfsQuarterlyJulSep2020: Source = {
  publisher: 'NSO, MoSPI',
  release: 'PLFS Quarterly Bulletin, July to September 2020',
  released: '2021-08-02',
  url: 'https://www.mospi.gov.in/sites/default/files/publication_reports/PLFS_Quarterly_Bulletin_Jul_Sep_2020.pdf',
}

// The bulletin has no cover date; its PDF is dated 16 Oct 2020, so the month is October 2020.
const plfsQuarterlyJulSep2019: Source = {
  publisher: 'NSO, MoSPI',
  release: 'PLFS Quarterly Bulletin, July to September 2019',
  released: '2020-10',
  url: 'https://www.mospi.gov.in/sites/default/files/publication_reports/Quarterly_Bulletin_July_September_2019_M.pdf',
}

const plfsAnnual2025: Source = {
  publisher: 'NSO, MoSPI',
  release: 'PLFS Annual Report 2025 (revised file, 29 May 2026)',
  released: '2026-03-27',
  url: 'https://www.mospi.gov.in/uploads/publications_reports/publications_reports1780040415321_0624fb13-fb47-40bc-b470-7c7e9635c3ef_PLFS_2025_F_REV_29052026.pdf',
}

const plfsAnnualPress2025: Source = {
  publisher: 'NSO, MoSPI',
  release: 'Press note, PLFS Annual Report 2025',
  released: '2026-03-27',
  url: 'https://www.mospi.gov.in/uploads/latestReleases/latest_release_1774607827733_3e8964a9-268b-4cc9-ad65-cfc8a9e32f08_Press_note_AR_PLFS_2025_23032025_V2.1_26032026_final.pdf',
}

const plfsAnnualPress2023_24: Source = {
  publisher: 'NSO, MoSPI',
  release: 'Press note, PLFS Annual Report July 2023 to June 2024',
  released: '2024-09-23',
  url: 'https://www.mospi.gov.in/uploads/documents/Press_note_AR_PLFS_2023_24_22092024.pdf',
}

const plfsAnnual2020_21: Source = {
  publisher: 'NSO, MoSPI',
  release: 'PLFS Annual Report, July 2020 to June 2021',
  released: '2022-06',
  url: 'https://www.mospi.gov.in/sites/default/files/publication_reports/Annual_Report_PLFS_2020%2021_0.pdf',
}

const plfsAnnual2023_24: Source = {
  publisher: 'NSO, MoSPI',
  release: 'PLFS Annual Report, July 2023 to June 2024',
  released: '2024-09-23',
  url: 'https://www.mospi.gov.in/sites/default/files/publication_reports/AnnualReport_PLFS2023-24L2.pdf',
}

const nssSources = ([
  ['409', '1993-94', '1997-03', 'https://www.mospi.gov.in/sites/default/files/publication_reports/409_final.pdf'],
  ['458, Part II', '1999-2000', '2001-05', 'https://microdata.gov.in/NADA/index.php/catalog/90/download/6116'],
  ['515, Part I', '2004-05', '2006-09', 'https://microdata.gov.in/NADA/index.php/catalog/109/download/4351'],
  ['537', '2009-10', '2011-11', 'https://microdata.gov.in/NADA/index.php/catalog/124/download/4371'],
  ['554', '2011-12', '2014-01', 'https://www.mospi.gov.in/sites/default/files/publication_reports/nss_report_554_31jan14.pdf'],
] as const).map(([report, period, released, url]): Source => ({
  publisher: 'NSSO, MoSPI',
  release: `NSS Report ${report}, Employment and Unemployment in India, ${period}`,
  released,
  url,
}))

const historySources = [plfsAnnual2025, plfsAnnual2023_24, plfsAnnual2020_21, ...nssSources]

const tus2024: Source = {
  publisher: 'NSO, MoSPI',
  release: 'Time Use in India 2024 (Time Use Survey, January to December 2024)',
  released: '2025-03-28',
  url: 'https://www.mospi.gov.in/sites/default/files/publication_reports/TUS_Report_2024_28.03.2025F.pdf',
}

// The report has no cover date; its PDF is dated 29 Sep 2020, so the month is September 2020.
const tus2019: Source = {
  publisher: 'NSO, MoSPI',
  release: 'Time Use in India 2019 (Time Use Survey, January to December 2019)',
  released: '2020-09',
  url: 'https://www.mospi.gov.in/sites/default/files/publication_reports/Report_TUS_2019_0.pdf',
}

const quarterlySources = [
  plfsQuarterlyJulSep2026,
  plfsQuarterlyAprJun2025,
  plfsQuarterlyOctDec2024,
  plfsQuarterlyAprJun2024,
  plfsQuarterlyJanMar2023,
  plfsQuarterlyJanMar2022,
  plfsQuarterlyPressOctDec2021,
  plfsQuarterlyAprJun2021,
  plfsQuarterlyJulSep2020,
  plfsQuarterlyJulSep2019,
] as const

const MONTHLY = 'jobs/jobs-monthly-lfpr-wpr-ur.csv'
const QUARTERLY = 'jobs/jobs-unemployment-quarterly.csv'
const ANNUAL = 'jobs/jobs-lfpr-wpr-ur-annual.csv'
const STATUS = 'jobs/jobs-employment-status.csv'
const INDUSTRY = 'jobs/jobs-employment-by-industry.csv'
const YOUTH = 'jobs/jobs-youth-unemployment-annual.csv'
const LFPR_STATE = 'jobs/jobs-lfpr-by-state-2025.csv'
const UR_STATE = 'jobs/jobs-unemployment-by-state-2025.csv'

const OLD_DESIGN = 'old design to Dec 2024: urban only'
const NEW_DESIGN = 'new design from Jan 2025: rural and urban'
const CAL_YEAR = 'calendar year (Jan-Dec)'
const NSS = 'NSS employment and unemployment survey'
const JUL_JUN = 'PLFS July to June'
const history = (stem: string) => `jobs/jobs-${stem}-history.csv`
const TIME_USE = 'jobs/jobs-time-use-india.csv'
const TIME_USE_STATE = 'jobs/jobs-time-use-by-state-2024.csv'

const historyPeriods = [
  { key: 'nss-early', basis: 'NSS before the 30-day rule' },
  { key: 'nss', basis: NSS },
  { key: 'jul-jun', basis: JUL_JUN },
] as const

const surveyBreaks = [
  { x: '2004-07-01', label: '30-day rule' },
  { x: '2017-07-01', label: 'PLFS starts' },
  { x: '2025', label: 'Jan-Dec' },
]

const subsidiaryRule = 'From 2004-05, the survey counted subsidiary work if it lasted at least 30 days in the past year.'
const surveyChange = 'PLFS replaced NSS in 2017-18 and changed its sample design in 2025. For 2022 to 2024 there are both calendar and July to June estimates.'
const historyNote = 'Dashed lines and the 2025 dots are calendar years. Lines break at each change of survey method.'

function seriesByPeriod(
  series: Pick<Series, 'key' | 'label' | 'color'>,
  stem: string,
  currentFile: string,
  where: NonNullable<Series['where']>,
  currentWhere = where,
): Series[] {
  return [
    ...historyPeriods.map(({ key, basis }) => ({
      ...series,
      key: `${series.key}-${key}`,
      file: history(stem),
      where: { ...where, period_basis: basis },
      x: 'plot_period',
      xLabel: 'period',
      note: 'derived',
    })),
    {
      ...series,
      key: `${series.key}-calendar`,
      file: currentFile,
      where: { ...currentWhere, period: ['2022', '2023', '2024'] },
      dash: true,
    },
    { ...series, file: currentFile, where: { ...currentWhere, period: '2025' } },
  ]
}

/** Keep these lines in the table and download, but do not draw them: each key with its period parts. */
const hide = (series: readonly Series[], keys: readonly string[]): Series[] =>
  series.map((s) => (keys.some((k) => s.key === k || s.key.startsWith(`${k}-`)) ? { ...s, hidden: true } : s))

const sexSeries = [
  { key: 'female', label: 'Women', color: 's3' },
  { key: 'male', label: 'Men', color: 's2' },
  { key: 'person', label: 'All people', color: 'ink' },
] as const

const annualSeries = (['LFPR', 'WPR', 'UR'] as const).flatMap((indicator) =>
  sexSeries.flatMap((series) => {
    const where = { geography: 'india', indicator, sex: series.key }
    return seriesByPeriod(
      { ...series, key: `${indicator.toLowerCase()}-${series.key}` },
      'annual-rates',
      ANNUAL,
      where,
      { ...where, period_type: CAL_YEAR },
    )
  }),
)

const annualPanel = (indicator: string) =>
  annualSeries.filter((s) => s.key.startsWith(`${indicator}-`)).map((s) => s.key)

const youthSeries = (['rural+urban', 'urban', 'rural'] as const).flatMap((sector) =>
  sexSeries.flatMap((series) => seriesByPeriod(
    {
      ...series,
      key: `${sector === 'rural+urban' ? 'all' : sector}-${series.key}`,
      label: { female: 'Young women', male: 'Young men', person: 'All aged 15-29' }[series.key],
    },
    'youth-unemployment',
    YOUTH,
    { geography: 'india', sector, sex: series.key, age_group: '15-29' },
  )),
)

const youthPanel = (prefix: string) => youthSeries.filter((s) => s.key.startsWith(`${prefix}-`)).map((s) => s.key)

const statusGroups = [
  { key: 'self-employed', label: 'Self-employed', category: 'all self-employed' },
  { key: 'regular', label: 'Regular wage or salary', category: 'regular wage/salary' },
  { key: 'casual', label: 'Casual labour', category: 'casual labour' },
] as const

const statusSeries = statusGroups.flatMap(({ key, label, category }) => seriesByPeriod(
  { key, label, color: 'ink' },
  'employment-status',
  STATUS,
  { geography: 'india', sector: 'rural+urban', sex: 'person', status: category },
))

const broadIndustryGroups = [
  { key: 'agriculture', label: 'Agriculture', color: 'ink', industry: 'agriculture' },
  { key: 'other-services', label: 'Other services', color: 'ink', industry: 'other services' },
  { key: 'trade', label: 'Trade and hospitality', color: 'ink', industry: 'trade, hotel & restaurant' },
  { key: 'manufacturing', label: 'Manufacturing', color: 'ink', industry: 'manufacturing' },
  { key: 'construction', label: 'Construction', color: 'ink', industry: 'construction' },
  { key: 'transport', label: 'Transport services', color: 'ink', industry: 'transport, storage & communications' },
  { key: 'utilities', label: 'Electricity and water', color: 'ink', industry: 'electricity, water, etc.' },
  { key: 'mining', label: 'Mining and quarrying', color: 'ink', industry: 'mining & quarrying' },
] as const

const broadIndustrySeries = broadIndustryGroups.flatMap(({ key, label, color, industry }) => seriesByPeriod(
  { key, label, color },
  'employment-by-industry',
  INDUSTRY,
  { geography: 'india', sector: 'rural+urban', sex: 'person', industry },
))

const industrySeries = (
  period: string,
  color: Color,
  { women = false, hidden = false } = {},
): Series => ({
  key: `${women ? 'women' : 'all'}-${period}`,
  label: women ? `Women, ${period}` : period,
  color,
  file: period.includes('-') ? history('employment-by-industry') : INDUSTRY,
  where: { geography: 'india', period, sector: 'rural+urban', sex: women ? 'female' : 'person' },
  format: { unit: '%', decimals: 1 },
  note: period === '2011-12' ? 'derived' : undefined,
  hidden,
})

/** Time Use Survey: one series per sex and survey year, for India, rural plus urban, ages 15-59. */
const timeUseActivities = ['employment', 'unpaid domestic services', 'unpaid caregiving'] as const
const timeUseLabels = {
  employment: 'Paid work (employment and related)',
  'unpaid domestic services': 'Unpaid domestic services',
  'unpaid caregiving': 'Unpaid caregiving',
} as const
const timeUseSeries = (measure: string): Series[] =>
  (['female', 'male'] as const).flatMap((sex) =>
    (['2019', '2024'] as const).map((period) => ({
      key: `${sex}-${period}`,
      label: `${sex === 'female' ? 'Women' : 'Men'}, ${period}`,
      color: period === '2019' ? 'other' : sex === 'female' ? 's3' : 's2',
      file: TIME_USE,
      where: { geography: 'india', period, sex, sector: 'rural+urban', age_group: '15-59', measure },
      x: 'activity',
    })),
  )
const timeUsePanels = [
  { label: 'Women aged 15-59', series: ['female-2019', 'female-2024'] },
  { label: 'Men aged 15-59', series: ['male-2019', 'male-2024'] },
]
const diaryNote =
  'The Time Use Survey records what each person did over one 24-hour day, from 4 am to 4 am, in 30-minute slots. It counts every activity in a slot, up to three.'
const notPlfs =
  'PLFS measures work by usual status (the past year) or weekly status (the past 7 days). A day in a time-use diary is a different measure, so these figures do not compare with PLFS rates.'

const topic: Topic = {
  slug: 'jobs',
  name: 'Jobs',
  hindi: 'रोज़गार',
  question: 'How many people are out of work, and is the rate going up or down?',
  standfirst:
    'In October 2026, 4.9% of the labour force aged 15 and over was unemployed, down from 5.2% a year earlier.',
  figures: [
    { chart: 'unemployment-rate-monthly', series: 'india', label: 'Unemployment rate, ages 15+, current weekly status' },
    {
      chart: 'unemployment-rate-monthly',
      series: 'lfpr-women',
      label: 'Women in the labour force, ages 15+, current weekly status',
    },
    { chart: 'youth-unemployment', series: 'all-person', label: 'Youth unemployment, ages 15-29, usual status' },
  ],
  nextRelease: 'PLFS for November 2026, expected 15 Dec 2026',
  parts: [
    {
      title: 'How many people are out of work?',
      lede: 'Since April 2025 the monthly rate has stayed between 4.7% and 5.6%. It is higher in towns and cities than in villages.',
      blocks: [
        {
          chart: {
            kind: 'line',
            slug: 'unemployment-rate-monthly',
            title: 'Unemployment rate in India, April 2025 to October 2026',
            subtitle: 'Unemployed share of the labour force, current weekly status, rural and urban India.',
            punches: { office: 'MoSPI', unit: '% 15+', period: 'OCT 2026' },
            status: ['Survey estimate'],
            note: 'The rural line has no value for March 2026. MoSPI did not publish one.',
            sources: [plfsMonthlyOct2026, plfsMonthlyPressOct2026, plfsMonthlyPressMar2026],
            format: { unit: '%', decimals: 1 },
            y: { min: 0, max: 8, step: 2 },
            series: [
              {
                key: 'rural',
                label: 'Rural',
                color: 's4',
                file: MONTHLY,
                where: { indicator: 'UR', sector: 'rural', sex: 'person', age_group: '15+' },
              },
              {
                key: 'urban',
                label: 'Urban',
                color: 's5',
                file: MONTHLY,
                where: { indicator: 'UR', sector: 'urban', sex: 'person', age_group: '15+' },
              },
              {
                key: 'india',
                label: 'India',
                color: 'ink',
                file: MONTHLY,
                where: { indicator: 'UR', sector: 'rural+urban', sex: 'person', age_group: '15+' },
              },
              // Read for the second headline figure (35.0%, October 2026); not drawn.
              {
                key: 'lfpr-women',
                label: 'Women in the labour force',
                color: 's3',
                hidden: true,
                file: MONTHLY,
                where: { indicator: 'LFPR', sector: 'rural+urban', sex: 'female', age_group: '15+' },
              },
            ],
            know: [
              'The rate is the share of the labour force aged 15+ with no work in the 7 days before the interview (current weekly status).',
              'Monthly estimates start in April 2025, after PLFS moved to a new sample design in January 2025. There is no monthly series before that.',
              'MoSPI gives no rural rate for March 2026, and no rates by sex or age for that month.',
              'Weekly rates run higher than the usual-status rates in the annual report. In 2025 the usual-status rate was 3.1%.',
            ],
            processing: [
              'Read the monthly LFPR, WPR and unemployment rates for April 2025 to October 2026 from the MoSPI eSankhyiki API (PLFS, current weekly status).',
              'Add the overall and urban rates for March 2026 from the revised March 2026 press note, because the API skips that month.',
              'Check June to October 2026 against Statement 3 of the October 2026 bulletin, and October 2025 to October 2026 against the press note chart.',
              'Keep rural, urban and rural plus urban as separate series, for persons aged 15 and over.',
            ],
            nextRelease: '2026-12-15',
          },
        },
        {
          text: 'Urban unemployment peaked at 20.8% in April to June 2020, during the first COVID-19 lockdown.',
        },
        {
          chart: {
            kind: 'line',
            slug: 'urban-unemployment-quarterly',
            title: 'Urban unemployment rate, July 2018 to September 2026',
            subtitle: 'Unemployed share of the labour force, urban India, current weekly status.',
            punches: { office: 'MoSPI', unit: '% urban', period: 'JUL-SEP 2026' },
            status: ['Survey estimate', 'Method break'],
            note: 'The lines break where the survey design changed. There is no estimate for January to March 2025.',
            sources: quarterlySources,
            format: { unit: '%', decimals: 1 },
            y: { min: 0, max: 40, step: 10 },
            series: [
              {
                key: 'youth-old',
                label: 'Age 15-29',
                color: 's8',
                file: QUARTERLY,
                where: { sector: 'urban', sex: 'person', age_group: '15-29', survey_design: OLD_DESIGN },
              },
              {
                key: 'youth-new',
                label: 'Age 15-29',
                color: 's8',
                file: QUARTERLY,
                where: { sector: 'urban', sex: 'person', age_group: '15-29', survey_design: NEW_DESIGN },
              },
              {
                key: 'adults-old',
                label: 'Age 15+',
                color: 'ink',
                file: QUARTERLY,
                where: { sector: 'urban', sex: 'person', age_group: '15+', survey_design: OLD_DESIGN },
              },
              {
                key: 'adults-new',
                label: 'Age 15+',
                color: 'ink',
                file: QUARTERLY,
                where: { sector: 'urban', sex: 'person', age_group: '15+', survey_design: NEW_DESIGN },
              },
            ],
            breaks: [{ x: '2025-Q2', label: 'New survey design' }],
            callouts: [{ series: 'adults-old', x: '2020-Q2' }],
            know: [
              'Before 2025 the quarterly bulletins covered towns and cities only. The urban series is the one that runs across both survey designs.',
              'PLFS moved to a new sample design in January 2025. MoSPI says to allow for this when comparing with releases up to December 2024.',
              'The rate uses the current weekly status: activity in the 7 days before the interview.',
              "For April to June 2019, MoSPI's data service gives 21.6% for ages 15+, the rate for ages 15 to 29. The bulletin gives 8.8%.",
            ],
            processing: [
              'Read each quarter from the bulletin tables (Statement 5 in the old design). The eSankhyiki API gives wrong values for some past quarters.',
              'Use the latest bulletin that carries each quarter. The source list names each one.',
              'The Oct-Dec 2021 press note gives ages 15+ only. Ages 15 to 29 for 2021 come from the Jan-Mar 2022 bulletin.',
              'Check April to June 2025 between the API and the bulletin.',
              'Tag each row with its survey design and keep the old and new designs as separate series.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How many people work?',
      lede: "Women's labour force participation fell from 42.7% in 2004-05 to 23.3% in 2017-18. It then rose to 40.0% in 2025.",
      blocks: [
        {
          chart: {
            kind: 'line',
            slug: 'labour-force-by-sex-annual',
            title: 'Labour force, work and unemployment in India, 1993-94 to 2025',
            subtitle: 'Rates for women and men, ages 15 and over, usual status, India.',
            punches: { office: 'MoSPI', unit: '% 15+', period: '2025' },
            status: ['Survey estimate', 'Method break'],
            note: historyNote,
            sources: [plfsAnnual2025, plfsAnnualPress2025, plfsAnnualPress2023_24, ...nssSources],
            format: { unit: '%', decimals: 1 },
            // All people's unemployment rate sits on the women's and men's lines, so it is not drawn.
            series: hide(annualSeries, ['ur-person']),
            panels: [
              { label: 'Labour force participation', series: annualPanel('lfpr') },
              { label: 'Worker population ratio', series: annualPanel('wpr') },
              { label: 'Unemployment rate', series: annualPanel('ur'), own: true },
            ],
            breaks: surveyBreaks,
            know: [
              'Usual status counts work and job search over the 365 days before the interview. It includes principal and subsidiary activity.',
              'Participation and worker population rates use all people aged 15 and over. The unemployment rate uses people in the labour force aged 15 and over.',
              surveyChange,
              subsidiaryRule,
              'PLFS reports used July to June years through 2023-24. The 2025 report moved to calendar years.',
              'The chart does not draw the unemployment rate for all people, because it sits on the lines for women and men. The table gives it.',
            ],
            processing: [
              'Read the NSS rates for ages 15 and over in each report. Calculate unemployment as a share of the labour force in that age group.',
              'Read PLFS rates from Tables 1 to 3 of the 2023-24 press note and Highlights Tables 1 to 3 of the 2025 report.',
              'Keep separate series for each survey design and period basis.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How do women and men spend their day?',
      lede: 'In 2024, women aged 15-59 who did unpaid domestic work spent 305 minutes a day on it. Men who did such work spent 86 minutes.',
      blocks: [
        {
          chart: {
            kind: 'bars',
            slug: 'time-use-paid-unpaid-work',
            title: 'Time spent on paid and unpaid work by women and men, 2019 and 2024',
            subtitle: 'Average minutes a day for those who did each activity, ages 15-59, rural and urban India.',
            punches: { office: 'MoSPI', unit: 'min 15-59', period: '2024' },
            status: ['Survey estimate'],
            note: 'Each bar is the average for people who did the activity on the survey day. People who did not are left out.',
            sources: [tus2024, tus2019],
            format: { decimals: 0, suffix: ' min' },
            by: 'activity',
            order: timeUseActivities,
            labels: timeUseLabels,
            rowHead: 'Activity',
            axis: { min: 0, max: 500, step: 100 },
            series: timeUseSeries('minutes per participant'),
            panels: timeUsePanels,
            know: [
              diaryNote,
              'MoSPI leads its report with ages 15-59 for paid work and domestic services. The data file also has ages 6 and over.',
              'Paid work is ICATUS major division 1, employment and related activities. It includes travel to work and job search.',
              notPlfs,
              'Both surveys ran from January to December and used the same activity classification (ICATUS 2016).',
            ],
            processing: [
              'Read minutes per participant (indicator 7) for 2019 and 2024 from the MoSPI eSankhyiki API, for ICATUS major divisions 1, 3 and 4.',
              'Check the 2024 values against Statement 6 of Time Use in India 2024, and the 2019 values against Statement 10 of Time Use in India 2019. All agree.',
              'Keep rural plus urban, ages 15-59, for women and men.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'In 2024, 25.0% of women aged 15-59 did paid work on the survey day, up from 21.8% in 2019. Among men, 75.0% did.',
        },
        {
          chart: {
            kind: 'bars',
            slug: 'time-use-participation',
            title: 'Women and men who did paid and unpaid work in a day, 2019 and 2024',
            subtitle: 'Share of people who did each activity on the survey day, ages 15-59, rural and urban India.',
            punches: { office: 'MoSPI', unit: '% 15-59', period: '2024' },
            status: ['Survey estimate'],
            sources: [tus2024, tus2019],
            format: { unit: '%', decimals: 1 },
            by: 'activity',
            order: timeUseActivities,
            labels: timeUseLabels,
            rowHead: 'Activity',
            axis: { min: 0, max: 100, step: 25 },
            series: timeUseSeries('participation rate'),
            panels: timeUsePanels,
            know: [
              diaryNote,
              'The participation rate is the share of people who did the activity at any time in the 24 hours. The diary records an activity that fills at least 10 minutes of a slot.',
              notPlfs,
              'A person can take part in several activities on one day, so the shares do not add up to 100%.',
            ],
            processing: [
              'Read participation rates (indicator 6) for 2019 and 2024 from the MoSPI eSankhyiki API, for ICATUS major divisions 1, 3 and 4.',
              'Check the 2024 values against Statement 5 of Time Use in India 2024, and the 2019 values against Statement 9 of Time Use in India 2019. All agree.',
              'Keep rural plus urban, ages 15-59, for women and men.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'In 2024, women in Arunachal Pradesh spent 387 minutes a day on unpaid domestic and care work, the most of any state or UT. Women in Goa spent 218 minutes. The India average was 283 minutes.',
        },
        {
          chart: {
            kind: 'states',
            slug: 'women-unpaid-work-by-state',
            title: 'Unpaid domestic and care work by women, by state and UT, 2024',
            subtitle: 'Average minutes a day per woman aged 6 and over, rural and urban, including women who did none.',
            punches: { office: 'MoSPI', unit: 'min/day', period: '2024' },
            status: ['Survey estimate'],
            note: 'Each value adds two published figures: unpaid domestic services and unpaid caregiving.',
            sources: [tus2024],
            format: { decimals: 0, suffix: ' min' },
            data: { file: TIME_USE_STATE, where: { sex: 'female', activity: 'unpaid domestic services and caregiving' }, x: 'geography', note: 'note' },
            open: 'map',
            scale: 'seq',
            short: "Women's unpaid domestic and care work",
            know: [
              diaryNote,
              'The value is the average over all women aged 6 and over, including those who did no such work that day. MoSPI gives state values for ages 6 and over only.',
              'Unpaid domestic services include cooking, cleaning, shopping and household management. Unpaid caregiving covers care of children and adults in the household.',
              'MoSPI warns that samples for the smaller states and UTs may not give reliable estimates for some measures.',
              'Chandigarh has urban data only.',
              notPlfs,
            ],
            processing: [
              'Read minutes per person in unpaid domestic services and unpaid caregiving, rural plus urban, for women, from Statement 7.1 of Time Use in India 2024.',
              'Add the two values for each state and UT. The sum is ours, so the data file marks it derived. It keeps both published values.',
              'Check the All India row of Statement 7.1 against the eSankhyiki API (indicator 8). All agree.',
              'Match state names to the site geography table, for all 36 states and UTs.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'What kind of work do people do?',
      lede: 'Most workers are self-employed. In 2025, 56.2% were self-employed, 23.6% had a regular wage or salary and 20.2% did casual labour.',
      blocks: [
        {
          chart: {
            kind: 'line',
            slug: 'employment-status',
            title: 'Workers in India by type of work, 1993-94 to 2025',
            subtitle: 'Share of workers of all ages in each type of work, usual status, India.',
            punches: { office: 'MoSPI', unit: '% workers', period: '2025' },
            status: ['Survey estimate', 'Method break'],
            note: historyNote,
            sources: historySources,
            format: { unit: '%', decimals: 1 },
            y: { min: 0, max: 70, step: 20 },
            series: statusSeries,
            panels: statusGroups.map(({ key, label }) => ({
              label,
              series: statusSeries.filter((s) => s.key === key || s.key.startsWith(`${key}-`)).map((s) => s.key),
            })),
            breaks: surveyBreaks,
            know: [
              'Self-employed workers run their own business or farm, employ others, or help without pay in a household business.',
              'The shares cover workers of all ages on usual status. Shares can differ from 100% in total because of rounding.',
              surveyChange,
              subsidiaryRule,
            ],
            processing: [
              'Use published NSS shares where available. Calculate the remaining shares from the published worker counts.',
              'Read the July to June estimates from the 2020-21 and 2023-24 PLFS annual reports and the calendar estimates from Statement 7 of the 2025 report.',
              'Keep separate series for each survey design and period basis.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'Agriculture employed 64.9% of workers in 1993-94 and 43.0% in 2025. Construction rose from 3.2% to 12.0%.',
        },
        {
          chart: {
            kind: 'line',
            slug: 'employment-by-industry-history',
            title: 'Workers in India by broad industry, 1993-94 to 2025',
            subtitle: 'Share of workers of all ages in each industry, usual status, India.',
            punches: { office: 'MoSPI', unit: '% workers', period: '2025' },
            status: ['Survey estimate', 'Method break'],
            note: 'Each panel has its own scale. Dashed lines are calendar years 2022 to 2024.',
            sources: historySources,
            format: { unit: '%', decimals: 1 },
            series: broadIndustrySeries,
            // One panel per group, each on its own scale: agriculture and mining differ a hundredfold.
            panels: broadIndustryGroups.map(({ key, label }) => ({ label, own: true, series: broadIndustrySeries.filter((s) => s.key.startsWith(`${key}-`)).map((s) => s.key) })),
            breaks: [...surveyBreaks.slice(0, 2), { x: '2025', before: 'Old', label: '2025 redesign' }],
            know: [
              'Usual status includes principal and subsidiary work.',
              'MoSPI compares these eight broad industry groups across NSS rounds. Transport includes storage and communications. Trade includes hotels and restaurants.',
              surveyChange,
              subsidiaryRule,
              'The NSS table has no electricity and water share for rural women in 1993-94 and 1999-2000. The national estimate uses zero there.',
            ],
            processing: [
              'Read the NSS Report 554 shares for rural and urban men and women. Weight them by published worker counts to get national shares before 2011-12.',
              'Combine NIC 2008 sections as specified by MoSPI for 2011-12. Use the published PLFS shares from 2017-18 onward.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'In 2025, agriculture employed 59.8% of women who worked.',
        },
        {
          chart: {
            kind: 'bars',
            slug: 'employment-by-industry',
            title: 'Workers in India by industry, 2011-12 to 2025',
            subtitle: 'Share of workers of all ages in each industry, usual status, India.',
            punches: { office: 'MoSPI', unit: '% workers', period: '2025' },
            status: ['Survey estimate', 'Method break'],
            note: 'The bars for women are for 2025. The 2011-12 value is from NSS, a different survey.',
            sources: [plfsAnnual2025, plfsAnnual2023_24, plfsAnnual2020_21, nssSources[4]!],
            format: { unit: '%', decimals: 1 },
            by: 'industry',
            order: [
              'agriculture',
              'other services',
              'trade, hotel & restaurant',
              'manufacturing',
              'construction',
              'transport, storage & communications',
              'electricity, water, etc.',
              'mining & quarrying',
            ],
            labels: {
              agriculture: 'Agriculture',
              'other services': 'Other services',
              'trade, hotel & restaurant': 'Trade, hotels and restaurants',
              manufacturing: 'Manufacturing',
              construction: 'Construction',
              'transport, storage & communications': 'Transport, storage and communications',
              'electricity, water, etc.': 'Electricity, water and similar',
              'mining & quarrying': 'Mining and quarrying',
            },
            series: [
              industrySeries('2011-12', 's5'),
              industrySeries('2017-18', 's4'),
              industrySeries('2022', 'other'),
              industrySeries('2025', 'ink'),
              industrySeries('2025', 's3', { women: true }),
              ...['2018-19', '2019-20', '2020-21', '2021-22', '2022-23', '2023-24', '2023', '2024'].map(
                (period) => industrySeries(period, 'ink', { hidden: true }),
              ),
            ],
            know: [
              'The eight groups use the same sections of the National Industrial Classification 2008. Earlier NSS rounds used older classifications.',
              'The 2011-12 and 2017-18 estimates cover July to June. The 2022 and 2025 estimates cover January to December.',
              'The data table includes all PLFS July to June years and all calendar years from 2022 to 2025.',
            ],
            processing: [
              'Group sections from NSS Report 554, Table 27, using the PLFS definition of each industry.',
              'Read the PLFS July to June shares from the 2020-21 and 2023-24 annual reports. Read the calendar shares from Statement 8 of the 2025 report.',
              'Rank the industries by their 2025 share of all workers. The total row is 100%.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How hard is it for young people to find a job?',
      lede: 'Youth unemployment has fallen since the first PLFS survey, to 9.9% in 2025. Young women in towns and cities had the highest rate, 18.9%.',
      blocks: [
        {
          chart: {
            kind: 'line',
            slug: 'youth-unemployment',
            title: 'Youth unemployment by sex and area, 1993-94 to 2025',
            subtitle: 'Unemployed share of the labour force aged 15 to 29, usual status, India.',
            punches: { office: 'MoSPI', unit: '% 15-29', period: '2025' },
            status: ['Survey estimate', 'Method break'],
            note: historyNote,
            sources: historySources,
            format: { unit: '%', decimals: 1 },
            y: { min: 0, max: 30, step: 10 },
            // The All areas panel shows the total; towns and villages show young women against young men.
            series: hide(youthSeries, ['all-female', 'all-male', 'urban-person', 'rural-person']),
            panels: [
              { label: 'All areas', series: youthPanel('all') },
              { label: 'Towns and cities', series: youthPanel('urban') },
              { label: 'Villages', series: youthPanel('rural') },
            ],
            breaks: surveyBreaks,
            know: [
              'The rate is the share of the labour force aged 15 to 29 with no work, over the 365 days before the interview (usual status).',
              'The NSS reports give rates for rural and urban women and men. Estimates for larger groups use the published age-group tables.',
              'The chart draws the total for all areas, and young women and young men in towns and in villages. The table gives every group.',
              surveyChange,
              subsidiaryRule,
            ],
            processing: [
              'Read NSS Reports 537 and 554 for rural and urban rates by sex.',
              'Calculate the other NSS rates from published data for ages 15 to 19, 20 to 24 and 25 to 29.',
              'Read PLFS rates from the 2020-21, 2023-24 and 2025 annual reports.',
              'Keep separate series for each survey design and period basis.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How do jobs differ between the states?',
      lede: "Women's labour force participation in 2025 ranged from 66.7% in Sikkim to 13.1% in Delhi.",
      blocks: [
        {
          chart: {
            kind: 'states',
            slug: 'women-labour-force-by-state',
            title: 'Women in the labour force by state and UT, 2025',
            subtitle: 'Women aged 15 and over who work or look for work, usual status.',
            punches: { office: 'MoSPI', unit: '% women', period: '2025' },
            status: ['Survey estimate'],
            note: 'Samples are small in the smaller states and UTs. Read their values with care.',
            sources: [plfsAnnual2025],
            format: { unit: '%', decimals: 1 },
            data: { file: LFPR_STATE, where: { sex: 'female', age_group: '15+' }, x: 'geography' },
            open: 'map',
            scale: 'seq',
            better: 'high',
            short: 'Women in the labour force',
            know: [
              'Usual status (principal plus subsidiary) counts activity over the 365 days before the interview.',
              'The India rate was 40.0% in 2025 on usual status. The monthly weekly-status rate, 35.0% in October 2026, is a different measure.',
              'MoSPI warns that small samples may not give reliable estimates.',
              'Small samples: Lakshadweep, Andaman and Nicobar Islands, Ladakh, Chandigarh, and Dadra and Nagar Haveli and Daman and Diu.',
              'Chandigarh has urban data only. Ladakh is shown apart from Jammu and Kashmir, and Dadra and Nagar Haveli and Daman and Diu is one UT.',
            ],
            processing: [
              'Read Table 16.0 of Appendix A of the PLFS Annual Report 2025 (rural plus urban, ages 15 and over).',
              'Check every state and UT against the eSankhyiki API for PLFS 2025.',
              'Match state names to the site geography table, for all 36 states and UTs.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'In every state and UT, people aged 15 to 29 had a higher unemployment rate than all adults in 2025.',
        },
        {
          chart: {
            kind: 'dots',
            slug: 'unemployment-by-state',
            title: 'Unemployment rate by state and UT, adults and youth, 2025',
            subtitle: 'Unemployed share of the labour force, usual status, by state and UT.',
            punches: { office: 'MoSPI', unit: '%', period: '2025' },
            status: ['Survey estimate'],
            note: 'Rates for the smaller states and UTs are less reliable.',
            sources: [plfsAnnual2025],
            format: { unit: '%', decimals: 1 },
            by: 'geography',
            sortBy: 'youth',
            map: { series: 'adults', scale: 'seq', better: 'low' },
            series: [
              {
                key: 'adults',
                label: 'Ages 15 and over',
                color: 'ink',
                file: UR_STATE,
                where: { sex: 'person', age_group: '15+' },
                x: 'geography',
              },
              {
                key: 'youth',
                label: 'Ages 15-29',
                color: 's8',
                file: UR_STATE,
                where: { sex: 'person', age_group: '15-29' },
                x: 'geography',
              },
            ],
            know: [
              'The rate is the share of the labour force with no work over the 365 days before the interview (usual status).',
              'In 2025 the rate for ages 15+ ranged from 0.9% in Gujarat to 10.0% in Andaman and Nicobar Islands. Goa led the states (8.3%).',
              'MoSPI warns that samples for the smaller states and UTs may not support reliable estimates.',
              'Chandigarh has urban data only.',
            ],
            processing: [
              'Read Table 18.0 of Appendix A of the PLFS Annual Report 2025 (rural plus urban), for ages 15 and over and 15 to 29.',
              'Check every state and UT against the eSankhyiki API for PLFS 2025.',
              'Match state names to the site geography table, for all 36 states and UTs.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
  ],
  // LATER: the About band's side line ("How each jobs figure is made, where it breaks, and what is missing.") has no field.
  about: {
    publisher:
      'The National Statistics Office (NSO), MoSPI, runs the Periodic Labour Force Survey (PLFS) and the Time Use Survey (TUS). The National Sample Survey (NSS) measured employment before PLFS.',
    frequency:
      'Monthly bulletin (weekly status): latest on 16 Nov 2026. Quarterly bulletin: latest on 10 Nov 2026. Annual report (usual status, all states and UTs): latest on 27 Mar 2026. Time Use Survey: 2019 and 2024, report on 28 Mar 2025.',
    revisions:
      'MoSPI revised the 2025 annual report on 29 May 2026 and the March 2026 press note on 15 Apr 2026. This page uses both.',
    breaks:
      'A new sample design started in January 2025. Monthly rates and rural quarterly rates began in April 2025. Annual reports moved to calendar years. Weekly and yearly rates are different measures. The Time Use Survey records one 24-hour day per person, so its measures of work do not compare with PLFS rates.',
    coverage:
      'India, rural and urban, ages 15 and over and 15 to 29. The annual report covers all 36 states and UTs. Counts of workers use MoHFW population projections, not a census. The Time Use Survey covers people aged 6 and over; its state values are for 2024 only.',
    missing:
      'No rural rate for March 2026. No quarterly estimate for January to March 2025. No earnings or EPFO data. No stated reuse licence.',
  },
  sources: [
    plfsMonthlyOct2026,
    plfsMonthlyPressOct2026,
    plfsQuarterlyJulSep2026,
    ...quarterlySources.slice(1),
    plfsMonthlyPressMar2026,
    plfsAnnual2025,
    plfsAnnualPress2025,
    plfsAnnualPress2023_24,
    plfsAnnual2023_24,
    plfsAnnual2020_21,
    ...nssSources,
    tus2024,
    tus2019,
  ],
  related: [
    // The Economy and Population chart slugs belong to other modules; these point at the topic pages.
    { label: 'Economy: Quarterly GDP growth', href: '/economy/' },
    { label: 'Education: Literacy by state', href: '/charts/literacy-by-state/' },
    { label: 'Population: People by state', href: '/population/' },
    { label: 'States: Tamil Nadu profile', href: '/states/tamil-nadu/' },
    { label: 'How we check: method breaks', href: '/how-we-check/#part-3' },
  ],
}

export default topic
