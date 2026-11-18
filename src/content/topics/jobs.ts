import type { Source, Topic } from '../types'

// Sources: research/data/jobs/README.md, "Sources". All MoSPI NSO, PLFS.

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
const AG_YEAR = 'agricultural year (Jul-Jun)'
const CAL_YEAR = 'calendar year (Jan-Dec)'

/** Chart 2.1: one series per indicator, sex and survey segment. */
const annualSeries = (['LFPR', 'WPR', 'UR'] as const).flatMap((indicator) =>
  (
    [
      ['female', 'Women', 's3'],
      ['male', 'Men', 's2'],
      ['person', 'All people', 'ink'],
    ] as const
  ).flatMap(([sex, label, color]) =>
    (
      [
        ['jul-jun', AG_YEAR],
        ['calendar', CAL_YEAR],
      ] as const
    ).map(([seg, periodType]) => ({
      key: `${indicator.toLowerCase()}-${sex}-${seg}`,
      label,
      color,
      file: ANNUAL,
      where: { geography: 'india', indicator, sex, period_type: periodType },
    })),
  ),
)

const annualPanel = (indicator: string) =>
  annualSeries.filter((s) => s.key.startsWith(`${indicator}-`)).map((s) => s.key)

/** Chart 4.1: one series per area and sex. */
const youthSeries = (['rural+urban', 'urban', 'rural'] as const).flatMap((sector) =>
  (
    [
      ['female', 'Young women', 's3'],
      ['male', 'Young men', 's2'],
      ['person', 'All aged 15-29', 'ink'],
    ] as const
  ).map(([sex, label, color]) => ({
    key: `${sector === 'rural+urban' ? 'all' : sector}-${sex}`,
    label,
    color,
    file: YOUTH,
    where: { geography: 'india', sector, sex, age_group: '15-29' },
  })),
)

const youthPanel = (prefix: string) => youthSeries.filter((s) => s.key.startsWith(`${prefix}-`)).map((s) => s.key)

const topic: Topic = {
  slug: 'jobs',
  name: 'Jobs',
  hindi: 'रोज़गार',
  question: 'How many people are out of work, and is the rate going up or down?',
  standfirst:
    'In October 2026, 4.9% of people aged 15 and over who were working or looking for work were unemployed, down from 5.2% a year earlier.',
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
      lede: 'The monthly survey counts what people did in the 7 days before the interview, the current weekly status. Since April 2025 the rate has stayed between 4.7% and 5.6%. In October 2026 it was 6.7% in towns and cities and 4.2% in villages.',
      blocks: [
        {
          chart: {
            kind: 'line',
            slug: 'unemployment-rate-monthly',
            title: 'Unemployment rate in India, April 2025 to October 2026',
            subtitle:
              'Unemployed people as a share of the labour force, India, ages 15 and over, current weekly status, %, monthly, April 2025 to October 2026.',
            punches: { office: 'MoSPI', unit: '% 15+', period: 'OCT 2026' },
            status: ['Survey estimate'],
            note: 'Monthly estimates began in April 2025, after the survey design changed in January 2025. MoSPI gives no rural rate for March 2026; the overall and urban rates for that month come from its press note of 15 April 2026.',
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
              'The rate is the share of the labour force, people working or looking for work, who had no work in the 7 days before the interview (current weekly status). It covers people aged 15 and over.',
              'Monthly estimates start in April 2025, after PLFS moved to a new sample design in January 2025. There is no monthly series before that.',
              'MoSPI gives no rural rate for March 2026, and no rates by sex or for ages 15 to 29 for that month. The overall rate (5.1%) and the urban rate (6.8%) for March 2026 come from the press note of 15 April 2026.',
              'Weekly rates are higher than the usual-status rates in the annual report. In 2025 the usual-status rate was 3.1%, and the weekly rate was between 4.7% and 5.6% in every month from April to December.',
            ],
            processing: [
              'Read the monthly LFPR, WPR and unemployment rates for April 2025 to October 2026 from the MoSPI eSankhyiki API (PLFS, current weekly status).',
              'Add March 2026 from the sentences of the revised March 2026 press note, because the API skips that month.',
              'Check June to October 2026 against Statement 3 of the October 2026 bulletin, and October 2025 to October 2026 against the chart in the October 2026 press note.',
              'Keep rural, urban and rural plus urban as separate series, for persons aged 15 and over.',
            ],
            nextRelease: '2026-12-15',
          },
        },
        {
          text: 'Urban unemployment reached 20.8% in April to June 2020, during the first COVID-19 lockdown, and was 6.8% in July to September 2026.',
        },
        {
          chart: {
            kind: 'line',
            slug: 'urban-unemployment-quarterly',
            title: 'Urban unemployment rate, July 2018 to September 2026',
            subtitle:
              'Unemployed people as a share of the labour force, India, urban areas, ages 15 and over and 15 to 29, current weekly status, %, quarterly, July to September 2018 to July to September 2026.',
            punches: { office: 'MoSPI', unit: '% urban', period: 'JUL-SEP 2026' },
            status: ['Survey estimate', 'Method break'],
            note: "Values come from the bulletin tables. For April to June 2019, MoSPI's data service gives 21.6% for ages 15 and over, which is the rate for ages 15 to 29; the bulletin gives 8.8%. The new survey design starts in April to June 2025, so the two parts of each line are not joined. There is no estimate for January to March 2025.",
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
              'PLFS moved to a new sample design in January 2025. The new urban series starts in April to June 2025. MoSPI says to take the change into account when comparing with releases up to December 2024.',
              'There is no estimate for January to March 2025.',
              'The rate uses the current weekly status: activity in the 7 days before the interview.',
            ],
            processing: [
              'Read each quarter from the bulletin tables (Statement 5 in the old design), not from the eSankhyiki API, because the API gives wrong values for some past quarters.',
              'Use the latest bulletin that carries each quarter: Jul-Sep 2019, Jul-Sep 2020, Apr-Jun 2021, the Oct-Dec 2021 press note, Jan-Mar 2022, Jan-Mar 2023, Apr-Jun 2024, Oct-Dec 2024, Apr-Jun 2025 and Jul-Sep 2026. The Oct-Dec 2021 press note gives ages 15 and over only; ages 15 to 29 for 2021 come from the Jan-Mar 2022 bulletin.',
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
      lede: 'The annual report counts what people did over the 365 days before the interview, the usual status. Its rates are lower than the weekly rates. On this measure, 40.0% of women aged 15 and over were in the labour force in 2025, against 79.1% of men. In 2017-18 the rate for women was 23.3%.',
      blocks: [
        {
          // LATER: the board puts July to June years and calendar years side by side, each on its own x range; here they share one axis.
          chart: {
            kind: 'line',
            slug: 'labour-force-by-sex-annual',
            title: 'Work and unemployment in India, by sex, 2017-18 to 2025',
            subtitle:
              'Labour force participation rate, worker population ratio and unemployment rate, India, ages 15 and over, usual status, %, July to June years 2017-18 to 2023-24 and calendar years 2022 to 2025.',
            punches: { office: 'MoSPI', unit: '% 15+', period: '2025' },
            status: ['Survey estimate', 'Method break'],
            note: 'Left of each dotted line: July to June years, from the 2023-24 report. Right: calendar years, from the 2025 report. The two series overlap in time and are not joined. The unemployment rate is a share of the labour force; the other two are shares of all people aged 15 and over. In 2025 the unemployment rate was 3.1% for women, men and all people.',
            sources: [plfsAnnual2025, plfsAnnualPress2025, plfsAnnualPress2023_24],
            format: { unit: '%', decimals: 1 },
            series: annualSeries,
            panels: [
              { label: 'Labour force participation', series: annualPanel('lfpr') },
              { label: 'Worker population ratio', series: annualPanel('wpr') },
              { label: 'Unemployment rate', series: annualPanel('ur'), own: true },
            ],
            breaks: [{ x: '2022', label: 'Calendar years' }],
            know: [
              'The usual status (principal plus subsidiary) counts activity over the 365 days before the interview. Its rates are lower than the weekly rates in the monthly bulletins.',
              'Up to 2023-24 the annual reports covered July to June years. From 2025 they cover calendar years. MoSPI also published calendar-year estimates for 2022 to 2024 in the 2025 report.',
              'The two series overlap in time but are not the same numbers: the participation rate was 59.6% for 2024 and 60.1% for 2023-24.',
              'The participation rate and the worker population ratio are shares of all people aged 15 and over. The unemployment rate is a share of the labour force only.',
            ],
            processing: [
              'Read July to June years 2017-18 to 2023-24 from Tables 1 to 3 of the 2023-24 press note (23 September 2024).',
              'Read calendar years 2022 to 2025 from Highlights Tables 1 to 3 of the PLFS Annual Report 2025.',
              'Check the 2025 headline values (LFPR 59.3%, WPR 57.4%, UR 3.1%) against the report tables.',
              'Keep the two period types as separate series for each indicator and sex.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'What kind of work do people do?',
      lede: 'Most workers in India run their own farm or small business, or help in a family one. In 2025, 56.2% of workers were self-employed, 23.6% had a regular wage or salary and 20.2% did casual labour.',
      blocks: [
        {
          // LATER: the board adds rows "Men, 2025" and "Women, 2025" under "By sex"; bars read one category column.
          chart: {
            kind: 'bars',
            slug: 'employment-status',
            title: 'Workers in India by type of work, 2022 to 2025',
            subtitle: 'Share of workers of all ages, India, usual status, %, 2022 to 2025.',
            punches: { office: 'MoSPI', unit: '% workers', period: '2025' },
            status: ['Survey estimate'],
            note: 'Self-employed covers own-account workers, employers and unpaid helpers in a household business. Shares may not add to 100 because of rounding.',
            sources: [plfsAnnual2025],
            format: { unit: '%', decimals: 1 },
            by: 'period',
            stacked: true,
            order: ['2022', '2023', '2024', '2025'],
            highlight: '2025',
            series: [
              {
                key: 'self-employed',
                label: 'Self-employed',
                color: 's2',
                file: STATUS,
                where: { geography: 'india', sector: 'rural+urban', sex: 'person', status: 'all self-employed' },
              },
              {
                key: 'regular',
                label: 'Regular wage or salary',
                color: 's5',
                file: STATUS,
                where: { geography: 'india', sector: 'rural+urban', sex: 'person', status: 'regular wage/salary' },
              },
              {
                key: 'casual',
                label: 'Casual labour',
                color: 's8',
                file: STATUS,
                where: { geography: 'india', sector: 'rural+urban', sex: 'person', status: 'casual labour' },
              },
            ],
            know: [
              'Self-employed workers run their own business or farm, employ others, or help without pay in a household business. MoSPI publishes the two parts separately; this chart shows their total.',
              'Women workers are more often self-employed than men, mostly because more of them help without pay in a family business.',
              'The shares cover workers of all ages on the usual status, which counts activity over the 365 days before the interview.',
            ],
            processing: [
              'Read Statement 7 of the PLFS Annual Report 2025 for calendar years 2022 to 2025, by sector and sex.',
              'Keep the published total for self-employed; do not add its two parts again.',
              'Check the 2025 headline values (self-employed 56.2%, regular wage or salary 23.6%) against the press note.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'Agriculture still employed 43.0% of workers in 2025, down from 45.5% in 2022, and 59.8% of women workers.',
        },
        {
          chart: {
            kind: 'bars',
            slug: 'employment-by-industry',
            title: 'Workers in India by industry, 2025',
            subtitle:
              'Share of all workers and of women workers, India, all ages, usual status, %, 2025, with the 2022 share for all workers. Ranked by the share of all workers in 2025.',
            punches: { office: 'MoSPI', unit: '% workers', period: '2025' },
            status: ['Survey estimate'],
            note: 'Industries follow the National Industrial Classification (NIC) 2008. Shares may not add to 100 because of rounding.',
            sources: [plfsAnnual2025],
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
              {
                key: 'all-2025',
                label: 'All workers, 2025',
                color: 'ink',
                file: INDUSTRY,
                where: { geography: 'india', period: '2025', sector: 'rural+urban', sex: 'person' },
              },
              {
                key: 'women-2025',
                label: 'Women workers, 2025',
                color: 's3',
                file: INDUSTRY,
                where: { geography: 'india', period: '2025', sector: 'rural+urban', sex: 'female' },
              },
              // LATER: the board draws 2022 as a triangle marker above each "All workers" bar; bars have no marker series.
              {
                key: 'all-2022',
                label: 'All workers, 2022',
                color: 'other',
                file: INDUSTRY,
                where: { geography: 'india', period: '2022', sector: 'rural+urban', sex: 'person' },
              },
            ],
            know: [
              'Industries follow the National Industrial Classification (NIC) 2008. "Other services" includes public administration, education, health, finance and other services.',
              'The shares cover workers of all ages on the usual status, which counts activity over the 365 days before the interview.',
              'Agriculture fell from 45.5% of workers in 2022 to 43.0% in 2025. Construction fell from 13.4% to 12.0%.',
            ],
            processing: [
              'Read Statement 8 of the PLFS Annual Report 2025 for calendar years 2022 to 2025, by sector and sex.',
              'Drop the published "all" row, which is the total of 100.',
              'Order the industries by their 2025 share of all workers.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How hard is it for young people to find a job?',
      lede: 'In 2025, 9.9% of people aged 15 to 29 in the labour force were unemployed, against 3.1% of all adults (usual status). For young women in towns and cities the rate was 18.9%.',
      blocks: [
        {
          chart: {
            kind: 'line',
            slug: 'youth-unemployment',
            title: 'Youth unemployment in India, by sex and area, 2022 to 2025',
            subtitle:
              'Unemployed people aged 15 to 29 as a share of the labour force of that age, India, usual status, %, calendar years 2022 to 2025.',
            punches: { office: 'MoSPI', unit: '% 15-29', period: '2025' },
            status: ['Survey estimate'],
            note: 'Calendar-year figures from the 2025 annual report. Usual-status rates are lower than the weekly rates, so the two are not compared.',
            sources: [plfsAnnual2025],
            format: { unit: '%', decimals: 1 },
            y: { min: 0, max: 20, step: 10 },
            series: youthSeries,
            panels: [
              { label: 'All areas', series: youthPanel('all') },
              { label: 'Towns and cities', series: youthPanel('urban') },
              { label: 'Villages', series: youthPanel('rural') },
            ],
            know: [
              'The rate is the share of the labour force aged 15 to 29 with no work, on the usual status, which counts activity over the 365 days before the interview.',
              'Young women in towns and cities have the highest rate: 18.9% in 2025, down from 21.9% in 2022.',
              'The series uses calendar years from the 2025 annual report. Earlier reports used July to June years, which are not shown here.',
            ],
            processing: [
              'Read Statement 18 of the PLFS Annual Report 2025 for calendar years 2022 to 2025.',
              'Keep each area (rural, urban, rural plus urban) and sex as a separate series.',
              'Check the 2025 headline rate for ages 15 to 29 (9.9%) against the press note.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How do jobs differ between the states?',
      lede: 'In 2025, 66.7% of women aged 15 and over in Sikkim were in the labour force, five times the rate in Delhi (13.1%). The India rate was 40.0% (usual status). Samples are small in the smaller states and UTs, so read their figures with care.',
      blocks: [
        {
          chart: {
            kind: 'states',
            slug: 'women-labour-force-by-state',
            title: 'Women in the labour force by state and UT, 2025',
            subtitle:
              'Share of women aged 15 and over who work or look for work, usual status, rural and urban combined (Chandigarh: urban only), %, all 36 states and UTs, 2025.',
            punches: { office: 'MoSPI', unit: '% women', period: '2025' },
            status: ['Survey estimate'],
            note: 'This is the usual-status rate for 2025 (India 40.0%). The monthly rate for October 2026, on the current weekly status, was 35.0%; the two are different measures. Samples are small in Lakshadweep, the Andaman and Nicobar Islands, Ladakh, Chandigarh and Dadra and Nagar Haveli and Daman and Diu; Chandigarh has urban data only.',
            sources: [plfsAnnual2025],
            format: { unit: '%', decimals: 1 },
            data: { file: LFPR_STATE, where: { sex: 'female', age_group: '15+' }, x: 'geography' },
            open: 'map',
            scale: 'seq',
            better: 'high',
            short: 'Women in the labour force',
            know: [
              'The rate is the share of women aged 15 and over who work or look for work, on the usual status (principal plus subsidiary), which counts activity over the 365 days before the interview.',
              'It is a different measure from the monthly rate on the current weekly status: 40.0% for India in 2025 on the usual status, 35.0% in October 2026 on the weekly status.',
              'MoSPI warns that samples for the smaller states and UTs may not support reliable estimates. Read Lakshadweep, the Andaman and Nicobar Islands, Ladakh, Chandigarh and Dadra and Nagar Haveli and Daman and Diu with care.',
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
            title: 'Unemployment rate by state and UT, all adults and young people, 2025',
            subtitle:
              'Unemployed people as a share of the labour force, all 36 states and UTs, ages 15 and over and 15 to 29, usual status, %, 2025.',
            punches: { office: 'MoSPI', unit: '%', period: '2025' },
            status: ['Survey estimate'],
            note: 'India is shown as two reference lines, not a rank. Samples are small in the smaller states and UTs, so their rates are less reliable.',
            sources: [plfsAnnual2025],
            format: { unit: '%', decimals: 1 },
            by: 'geography',
            sortBy: 'youth',
            map: { series: 'adults', scale: 'seq', better: 'low' },
            refs: [
              { value: 3.1, label: 'India 3.1%, 15+' },
              { value: 9.9, label: 'India 9.9%, 15-29' },
            ],
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
              'The rate is the share of the labour force with no work, on the usual status, which counts activity over the 365 days before the interview.',
              'In 2025 the rate for ages 15 and over ranged from 0.9% in Gujarat to 10.0% in the Andaman and Nicobar Islands. Among states, Goa had the highest rate, 8.3%.',
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
      'The National Statistics Office (NSO), Ministry of Statistics and Programme Implementation (MoSPI), runs the Periodic Labour Force Survey (PLFS), a household survey.',
    frequency:
      'Monthly bulletin (current weekly status, India, rural and urban): the October 2026 bulletin came out on 16 Nov 2026. Quarterly bulletin: the July to September 2026 bulletin came out on 10 Nov 2026. Annual report (usual status, all states and UTs): the 2025 report came out on 27 Mar 2026.',
    revisions:
      'MoSPI issued a revised file of the 2025 annual report on 29 May 2026 and a revised March 2026 press note on 15 Apr 2026. This page uses both.',
    breaks:
      'In January 2025 the survey moved to a new sample design. Monthly rates began in April 2025. Quarterly rates for rural areas began in April to June 2025; before that they covered towns and cities only. Annual reports moved from July to June years to calendar years. MoSPI says to take this into account when comparing with releases up to December 2024. Weekly and yearly rates are different measures: in 2025 the usual-status unemployment rate was 3.1%, and the weekly rate was between 4.7% and 5.6% in every month from April to December.',
    coverage:
      'India, rural and urban areas, people aged 15 and over and aged 15 to 29. The annual report covers all 36 states and UTs. Samples are small in Lakshadweep, the Andaman and Nicobar Islands, Ladakh, Chandigarh and Dadra and Nagar Haveli and Daman and Diu, and Chandigarh has urban data only. Counts of workers (61.6 crore in 2025: 41.6 crore men and 20.0 crore women) use MoHFW population projections, not a census.',
    missing:
      'MoSPI gives no rural rate for March 2026, and no rates by sex or for young people for that month. There is no quarterly estimate for January to March 2025. This page has no urban rate for ages 15 to 29 for October 2020 to December 2021. Earnings and EPFO payroll data are not on this page. No publisher states a reuse licence for these data.',
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
