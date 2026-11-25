import type { Source, Topic } from '../types'

// Data: research/data/transport (README: "Proposed charts", "Gaps and cautions").
// tests/unit/prose.test.ts checks every number in the prose.

// ---------------------------------------------------------------- Sources

const MORTH = 'Transport Research Wing, MoRTH'
const MORTH_FILES = 'https://morth.gov.in/backend/documents/uploaded/'

// MoRTH gives no release date for Road Accidents in India 2024. Its document list gives
// 2024-01-01, which is before the end of the data year, so it is a placeholder. The PDF metadata
// (15 Jun 2026) is not the publisher's date. The source line says "not stated".
const rai2024: Source = {
  publisher: MORTH,
  release: 'Road Accidents in India 2024',
  released: 'not stated',
  url: `${MORTH_FILES}Road%20Accidents%20in%20India%20-%202024.pdf`,
}

// The metadata file says "Last Posted Date 13-05-2026".
const raiMetadata: Source = {
  publisher: MORTH,
  release: 'Metadata, Road Accidents in India',
  released: '2026-05-13',
  url: `${MORTH_FILES}Road%20Accidents%20in%20India.pdf`,
}

// The press note is "Dated: 05th October, 2026"; the MoSPI release list gives the same day.
const NHTS_DATE = '2026-10-05'
const NHTS_FILES = 'https://www.mospi.gov.in/uploads/documents/documents/'

const nhtsFactSheet: Source = {
  publisher: 'NSO, MoSPI',
  release: 'Fact Sheet, Household Travel in India 2025-26 (National Household Travel Survey)',
  released: NHTS_DATE,
  url: 'https://www.mospi.gov.in/uploads/publications_reports/publications_reports1791198151034_8d52ad0c-75ba-4040-a445-32c2ca98958e_Factsheet_-_NHTS.pdf',
}

const nhtsPressNote: Source = {
  publisher: 'NSO, MoSPI',
  release: 'Press note, National Household Travel Survey, July 2025 to June 2026',
  released: NHTS_DATE,
  url: 'https://www.mospi.gov.in/uploads/latestReleases/latest_release_1791197961812_aef550fd-c694-4955-9e26-296148e3714d_Press_Note_-_NHTS.pdf',
}

const nhtsTable = (name: string, file: string): Source => ({
  publisher: 'NSO, MoSPI',
  release: `National Household Travel Survey 2025-26, ${name}`,
  released: NHTS_DATE,
  url: `${NHTS_FILES}${file}`,
})

const nhtsA3 = nhtsTable('Appendix A Table 3, mode of travel to an educational institution', '1791197092617-Table_3.xlsx')
const nhtsA5 = nhtsTable('Appendix A Table 5, mode of travel to a workplace', '1791197068068-Table_5.xlsx')
const nhtsB2 = nhtsTable('Appendix B Table 2, relative standard errors of Table A3', '1791196810096-RSE_Table_2.xlsx')
const nhtsB4 = nhtsTable('Appendix B Table 4, relative standard errors of Table A5', '1791196831860-RSE_Table_4.xlsx')

// The press note is dated "23rd September, 2026"; the MoSPI release list gives the same day.
// The report itself is not on the release list; its cover says "September, 2026".
const DTES_DATE = '2026-09-23'
const DTES_FILES = 'https://www.mospi.gov.in/uploads/documents/DTES_tables/'

const dtesReport: Source = {
  publisher: 'NSO, MoSPI',
  release: 'NSS Report 597, Domestic Tourism in India (NSS round 80, July 2025 to June 2026)',
  released: DTES_DATE,
  url: 'https://www.mospi.gov.in/uploads/publications_reports/publications_reports1790160086463_10b96a4e-35b0-416b-83b7-9cb3b364ca8c_DomesticTourism_report_597_(1).pdf',
}

const dtesPressNote: Source = {
  publisher: 'NSO, MoSPI',
  release: 'Press note, Domestic Tourism Expenditure Survey, NSS round 80 (July 2025 to June 2026)',
  released: DTES_DATE,
  url: 'https://www.mospi.gov.in/uploads/latestReleases/latest_release_1790159417509_e87601c9-a7f3-4290-9600-46c078186d81_Press_Note_DTES_220926.pdf',
}

const dtesTable = (name: string, file: string): Source => ({
  publisher: 'NSO, MoSPI',
  release: `NSS Report 597, ${name}`,
  released: DTES_DATE,
  url: `${DTES_FILES}${file}`,
})

const dtesT1 = dtesTable('Appendix A Table 1, households reporting overnight trips by State/UT', 'Table1.xlsx')
const dtesT15 = dtesTable('Appendix A Table 15, average spending per overnight trip by item', 'Table15.xlsx')

// ---------------------------------------------------------------- Data

const BY_STATE = 'transport/road-accidents-by-state.csv'
const TREND = 'transport/road-accidents-india-1970-2024.csv'
const ROAD_USER = 'transport/road-deaths-by-road-user.csv'
const DEVICE = 'transport/road-deaths-helmet-seatbelt-by-state.csv'
const MODE = 'transport/travel-mode-by-state-2025-26.csv'
const FACT_SHEET = 'transport/travel-india-fact-sheet-2025-26.csv'
const TOURISM_STATES = 'transport/tourism-households-by-state-2025-26.csv'
const TOURISM = 'transport/tourism-india-2025-26.csv'

const CHECKED = '2026-11-25'

/** Road users, largest share of deaths in 2024 first. */
const ROAD_USERS = [
  ['two-wheelers', 'Two-wheelers'],
  ['pedestrians', 'Pedestrians'],
  ['cars-taxis-vans-lmvs', 'Cars, taxis, vans and light vehicles'],
  ['others', 'Other road users'],
  ['trucks-lorries', 'Trucks and lorries'],
  ['auto-rickshaws', 'Auto-rickshaws'],
  ['bicycles', 'Bicycles'],
  ['buses', 'Buses'],
  ['other-non-motorised-vehicles', 'Other non-motor vehicles, with e-rickshaws'],
] as const

/** Modes of daily travel, one order for work and school so the two charts compare. Water and air are left out: 0.0% or no value. */
const MODES = [
  ['walk', 'Walk'],
  ['bicycle', 'Bicycle'],
  ['two-wheeler', 'Two-wheeler'],
  ['bus', 'Bus'],
  ['auto-rickshaw', 'Auto-rickshaw or e-rickshaw'],
  ['car', 'Car or taxi'],
  ['train-metro-monorail-tram', 'Metro, suburban train or tram'],
  ['rail', 'Inter-city rail'],
  ['cycle-rickshaw', 'Cycle rickshaw'],
  ['others', 'Other'],
] as const

/** Modes of overnight trips, largest share first. Walk, bicycle, cycle rickshaw and water are each 0.3% or less. */
const OVERNIGHT_MODES = [
  ['bus', 'Bus'],
  ['rail', 'Inter-city rail'],
  ['car', 'Car or taxi'],
  ['two-wheeler', 'Two-wheeler'],
  ['train-metro-monorail-tram', 'Metro, suburban train or tram'],
  ['auto-rickshaw', 'Auto-rickshaw or e-rickshaw'],
  ['air', 'Air'],
  ['others', 'Other'],
] as const

/** Leading purposes of overnight trips, in MoSPI's order, each with its reference period. */
const PURPOSES = [
  ['holidaying-leisure-recreation-365-days', 'Holiday, leisure and recreation (365 days)'],
  ['pilgrimage-religious-365-days', 'Pilgrimage and religious (365 days)'],
  ['health-medical-365-days', 'Health and medical (365 days)'],
  ['shopping-365-days', 'Shopping (365 days)'],
  ['all-365-days', 'All four purposes (365 days)'],
  ['business-30-days', 'Business (30 days)'],
  ['social-30-days', 'Social (30 days)'],
  ['education-training-30-days', 'Education and training (30 days)'],
  ['others-30-days', 'Other (30 days)'],
  ['all-30-days', 'All four purposes (30 days)'],
] as const

/** The eight leading purposes, without the two "all" rows: the rows of the spending-by-item chart. */
const ITEM_ROWS = PURPOSES.filter(([k]) => !k.startsWith('all-')).map(([k]) => k)

/** Items of spending on an overnight trip, Table 15. The package is a tour bought as one price. */
const SPENDING_ITEMS = [
  ['medical', 'Medical', 's1'],
  ['transport', 'Transport', 's2'],
  ['shopping', 'Shopping', 's3'],
  ['accommodation', 'Accommodation', 's4'],
  ['food-and-drink', 'Food and drink', 's5'],
  ['package', 'Package tour', 's6'],
  ['recreation-religious-cultural-sporting', 'Recreation, religious, cultural and sport', 's7'],
  ['others', 'Other', 's8'],
] as const

const modeKeys = (list: readonly (readonly [string, string])[]): string[] => list.map(([k]) => k)

/** Rural and urban bars, and the two together for figures and the table. */
const sectorSeries = (purpose: 'work' | 'education') =>
  (
    [
      ['rural', 'Rural', 's4', false],
      ['urban', 'Urban', 's5', false],
      ['rural+urban', 'Rural and urban', 'ink', true],
    ] as const
  ).map(([sector, label, color, hidden]) => ({
    key: sector,
    label,
    color,
    hidden,
    file: MODE,
    x: 'mode',
    where: { geography: 'india', purpose, sex: 'person', sector, mode: modeKeys(MODES) },
  }))

/** Rural and urban bars from the tourism file, and the two together for figures and the table. */
const tourismSeries = (measure: string, where: Record<string, string | readonly string[]>) =>
  (
    [
      ['rural', 'Rural', 's4', false],
      ['urban', 'Urban', 's5', false],
      ['rural+urban', 'Rural and urban', 'ink', true],
    ] as const
  ).map(([sector, label, color, hidden]) => ({
    key: sector,
    label,
    color,
    hidden,
    file: TOURISM,
    x: 'purpose_period',
    where: { measure, sector, ...where },
  }))

// Know lines that several charts share.
const POLICE_KNOW =
  'MoRTH counts the road accidents that the police of each state and UT record. It is not a survey. A death counts if it happens within 30 days of the accident.'

const UNDERCOUNT_KNOW =
  'Police records undercount road deaths. MoRTH says deaths in hospital after 30 days can be missed, because police and hospital records are not linked, and that accidents where the driver cannot be identified may go unreported. Survey-based estimates of road deaths are higher than these counts.'

const RATE_KNOW =
  "MoRTH computes each rate per lakh people with its own population figures: from 2021, the projections of the Registrar General of India (July 2020). We copy MoRTH's rates and do not recompute them."

const REPORTING_KNOW =
  'A state comparison also compares reporting. A low rate can mean fewer deaths or fewer records. Lakshadweep recorded no road deaths in 2024, and Manipur 2.2 per lakh people.'

const WEST_BENGAL_KNOW =
  "West Bengal did not send its 2024 data in MoRTH's reporting formats. MoRTH recast it from the totals of the Electronic Detailed Accident Report (e-DAR) system. West Bengal's totals are valid, but its 2024 breakdowns follow its 2023 pattern, so the India breakdown for 2024 carries a method break for West Bengal."

const NHTS_KNOW =
  'The National Household Travel Survey (NHTS) is the first of its kind, from July 2025 to June 2026. There is no earlier round to compare with.'

const KM_KNOW =
  'The NHTS counts only trips of 1 km or more. A trip\'s main mode is the one that covered the longest distance. Each share is of the people who travelled 1 km or more for that purpose.'

const DTES_KNOW =
  'MoSPI advises users not to compare the NHTS with the Domestic Tourism Expenditure Survey: the two surveys define a trip differently.'

const DTES_NHTS_KNOW =
  'This survey (the Domestic Tourism Expenditure Survey, DTES) and the National Household Travel Survey (NHTS) both ran from July 2025 to June 2026. They define a trip differently and use different reference periods: 365 or 30 days here, 28 travel days in the NHTS. MoSPI says their results are not strictly comparable. Do not set these figures beside the overnight trips chart above.'

const DTES_PERIODS_KNOW =
  'MoSPI counts overnight trips for holidays, pilgrimage, health and shopping over the last 365 days, and trips for business, social visits, education and other purposes over the last 30 days. The two groups do not add up, and a 30-day count does not compare with a 365-day count.'

const DTES_TRIP_KNOW =
  'An overnight trip is a round trip outside the usual environment of at least 12 hours that include midnight to 5 am, and of no more than 180 days. Travel to work or school, and other regular, frequent movements, are not trips. The leading purpose is the purpose without which no member of the household would have made the trip.'

const DTES_ROUND_KNOW =
  'The previous survey, NSS round 72, counted pilgrimage trips over 30 days, not 365. MoSPI says the two rounds are not strictly comparable.'

const topic: Topic = {
  slug: 'transport',
  name: 'Transport',
  hindi: 'परिवहन',
  question: 'How many people die on the roads, and how do people travel?',
  standfirst:
    'In 2024, the police recorded 1,77,175 road deaths, or 12.6 for every lakh people. People on two-wheelers were 46.2% of them. In 2025-26, 42.6% of workers who travelled 1 km or more to work went by two-wheeler. This topic covers road safety, household travel and domestic tourism. Railways, aviation, freight and vehicle registrations are not covered yet.',
  figures: [
    { chart: 'road-deaths-india', series: 'deaths', label: 'Road deaths recorded by the police', period: '2024', format: { scale: 'none', decimals: 0 } },
    { chart: 'road-deaths-per-lakh-by-state', label: 'Road deaths per lakh people' },
    { chart: 'two-wheeler-commute-by-state', label: 'Workers who go to work by two-wheeler' },
  ],
  nextRelease: 'not announced',
  parts: [
    {
      title: 'How many people die on the roads in each state?',
      lede: 'In 2024, the police recorded 4,87,707 road accidents, in which 1,77,175 people died and 4,71,441 were injured. That is 12.6 deaths for every lakh people. The rate was highest in Tamil Nadu (23.9), Chhattisgarh (22.8) and Telangana (20.8).',
      blocks: [
        {
          chart: {
            kind: 'states',
            slug: 'road-deaths-per-lakh-by-state',
            checked: CHECKED,
            title: 'Road deaths per lakh people by state, 2024',
            subtitle: 'People killed in road accidents recorded by the police, per lakh people, by state and UT.',
            punches: { office: 'MoRTH', unit: 'per lakh people', period: '2024' },
            note: 'Police-recorded; deaths within 30 days of the accident. A low rate can mean fewer deaths or fewer records.',
            sources: [rai2024],
            format: { decimals: 1 },
            data: { file: BY_STATE, where: { period: '2024', indicator: 'deaths-per-lakh-population' }, x: 'geography' },
            open: 'map',
            scale: 'seq',
            better: 'low',
            bins: [4, 8, 12, 16, 20],
            short: 'Road death rate',
            know: [
              POLICE_KNOW,
              UNDERCOUNT_KNOW,
              RATE_KNOW,
              REPORTING_KNOW,
              'States with more people record more deaths. Uttar Pradesh recorded the most, 24,118. The rate divides by population.',
              "West Bengal's 2024 total was recast from e-DAR data. MoRTH says the total is valid.",
            ],
            processing: [
              'Read Annexure 3 of Road Accidents in India 2024: persons killed and the rate per lakh population, 2023 and 2024.',
              'Check India (1,77,175 deaths) and the Chhattisgarh rate (22.8) against the annexure.',
              'Check that the states and UTs add up to the Total row.',
              'Match state names to the site geography table.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'Tamil Nadu recorded the most road accidents in 2024, 67,526, and Uttar Pradesh the most deaths, 24,118. Kerala recorded 48,834 accidents but 3,880 deaths: 7.9 deaths for every 100 accidents, against 36.3 for India. In Mizoram the figure was 93.2, and in Punjab 78.5.',
        },
        {
          chart: {
            kind: 'states',
            slug: 'road-accident-severity-by-state',
            checked: CHECKED,
            title: 'Road deaths per 100 accidents by state, 2024',
            subtitle: 'People killed for every 100 road accidents recorded by the police, by state and UT.',
            punches: { office: 'MoRTH', unit: 'deaths per 100 accidents', period: '2024' },
            note: 'Police-recorded; deaths within 30 days of the accident. A state that records few minor accidents shows a high value.',
            sources: [rai2024],
            format: { decimals: 1 },
            data: { file: BY_STATE, where: { period: '2024', indicator: 'severity' }, x: 'geography' },
            open: 'map',
            scale: 'seq',
            better: 'low',
            bins: [15, 30, 45, 60, 75],
            short: 'Accident severity',
            know: [
              'MoRTH calls this measure accident severity: road accident deaths per 100 accidents.',
              'The measure depends on which accidents the police record. Where minor accidents go unrecorded, each recorded accident looks more deadly.',
              POLICE_KNOW,
              UNDERCOUNT_KNOW,
              'Lakshadweep recorded 0 deaths in 2024, so its value is 0.0.',
            ],
            processing: [
              'Read Annexure 6 of Road Accidents in India 2024: deaths per 100 accidents, 2023 and 2024. India is the "National Average" row.',
              'Check India (36.3) and Mizoram (93.2) against the annexure.',
              'Match state names to the site geography table.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'Have road deaths risen over time?',
      lede: 'Road deaths rose from 14,500 in 1970 to 1,77,175 in 2024. Accidents rose more slowly: from 4,05,637 in 2001 to 4,87,707 in 2024, with a high of 5,05,770 in 2015.',
      blocks: [
        {
          chart: {
            kind: 'line',
            slug: 'road-deaths-india',
            checked: CHECKED,
            title: 'Road accidents and road deaths in India, 1970 to 2024',
            subtitle: 'Road accidents and people killed, as recorded by the police, India. Panels have different scales.',
            punches: { office: 'MoRTH', unit: 'accidents, persons killed', period: '1970-2024' },
            note: 'Police-recorded; deaths within 30 days of the accident. MoRTH gives 1970, 1980 and 1990, then every year from 1995: the early years are dots.',
            sources: [rai2024],
            y: { min: 0 },
            series: [
              { key: 'deaths', label: 'Road deaths', color: 'ink', file: TREND, where: { indicator: 'deaths' } },
              { key: 'accidents', label: 'Road accidents', color: 'ink', file: TREND, where: { indicator: 'accidents' } },
            ],
            panels: [
              { label: 'Road deaths', series: ['deaths'], own: true },
              { label: 'Road accidents', series: ['accidents'], own: true },
            ],
            know: [
              POLICE_KNOW,
              UNDERCOUNT_KNOW,
              'MoRTH links the fall in 2020 to the Covid-19 pandemic and the nationwide lockdown.',
              'MoRTH notes that it reconciled the data for West Bengal for 2015 to 2017, 2019 and 2020, and for Tamil Nadu for 2017 to 2020.',
              'The 2021 to 2024 counts equal the Total rows of the state annexures.',
            ],
            processing: [
              'Read Annexure 1 of Road Accidents in India 2024: accidents, persons killed and persons injured, 1970 to 2024.',
              'Check 1970 accidents (1,14,100) and 2020 deaths (1,38,383) against the annexure.',
              'Check that 2021 to 2024 equal the Total rows of Annexures 2 and 3.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'Deaths rose faster than the population. The rate rose from 2.7 deaths per lakh people in 1970 to 12.1 in 2019. It fell to 10.4 in 2020, the year of the Covid-19 lockdown, and reached 12.6 in 2024.',
        },
        {
          chart: {
            kind: 'line',
            slug: 'road-deaths-per-lakh-india',
            checked: CHECKED,
            title: 'Road deaths per lakh people in India, 1970 to 2024',
            subtitle: 'People killed in road accidents recorded by the police, per lakh people, India.',
            punches: { office: 'MoRTH', unit: 'per lakh people', period: '1970-2024' },
            note: 'Police-recorded; deaths within 30 days of the accident. The early years are dots: MoRTH gives 1970, 1980 and 1990, then every year from 1995.',
            sources: [rai2024],
            format: { decimals: 1 },
            y: { min: 0 },
            series: [{ key: 'rate', label: 'Road deaths per lakh people', color: 'ink', file: TREND, where: { indicator: 'deaths-per-lakh-population' } }],
            callouts: [{ series: 'rate', x: '2020', label: '2020: Covid-19 lockdown' }],
            know: [
              RATE_KNOW,
              'For years before 2021, MoRTH uses the population printed in Annexure 1 and does not name its source for each year.',
              POLICE_KNOW,
              UNDERCOUNT_KNOW,
              'MoRTH also gives deaths per 10,000 vehicles and per 10,000 km of roads, but only to 2022: it has no road length or vehicle count for 2023 and 2024.',
            ],
            processing: [
              'Read Annexure 1 of Road Accidents in India 2024: persons killed per lakh population.',
              'Check 2024 (12.6) against the annexure and against Annexure 3.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'Who dies on the roads?',
      lede: 'In 2024, 81,780 of the people killed on the roads were on two-wheelers: 46.2% of all road deaths. Pedestrians were 20.6%, or 36,526 people.',
      blocks: [
        {
          chart: {
            kind: 'bars',
            slug: 'road-deaths-by-road-user',
            checked: CHECKED,
            title: 'Road deaths by road user in India, 2023 and 2024',
            subtitle: 'Share of people killed in road accidents, by the kind of road user they were, India.',
            punches: { office: 'MoRTH', unit: '% of road deaths', period: '2024' },
            note: 'Police-recorded; deaths within 30 days of the accident. The road user is the person killed, not the vehicle that hit them.',
            sources: [rai2024],
            format: { unit: '%', decimals: 1 },
            by: 'road_user',
            rowHead: 'Road user',
            order: modeKeys(ROAD_USERS),
            labels: Object.fromEntries(ROAD_USERS),
            series: [
              { key: '2024', label: '2024', color: 'ink', file: ROAD_USER, x: 'road_user', where: { geography: 'india', indicator: 'share-of-deaths', sex: 'person', period: '2024' } },
              { key: '2023', label: '2023', color: 'other', file: ROAD_USER, x: 'road_user', where: { geography: 'india', indicator: 'share-of-deaths', sex: 'person', period: '2023' } },
            ],
            know: [
              'A road user is the person killed: a pedestrian, or a driver or passenger of that vehicle. MoRTH gives the vehicle that hit them in other tables, which this chart does not use.',
              '"Other road users" are other motor vehicles, animal-drawn vehicles, cycle rickshaws, hand carts and other persons.',
              WEST_BENGAL_KNOW,
              POLICE_KNOW,
              'Of the 81,780 people killed on two-wheelers in 2024, 72,665 were men and 9,115 women.',
            ],
            processing: [
              'Read Table 4.4 of Road Accidents in India 2024: deaths and share of deaths by road user, 2023 and 2024.',
              'Check two-wheeler deaths in 2024 (81,780) and pedestrian deaths in 2023 (35,221) against the table.',
              'Check that Table 4.4 equals the Total row of Annexure 29 for 2024.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'In 2024, the police recorded 39,470 drivers and 14,652 passengers who died without a helmet. They recorded 7,489 drivers and 6,977 passengers who died without a seat belt.',
        },
        {
          chart: {
            kind: 'bars',
            slug: 'helmet-and-seat-belt-deaths',
            checked: CHECKED,
            title: 'Road deaths of people without a helmet or seat belt in India, 2024',
            subtitle: 'People killed who were not wearing a helmet or a seat belt, drivers and passengers, India.',
            punches: { office: 'MoRTH', unit: 'persons killed', period: '2024' },
            note: 'Counts, not shares: MoRTH gives no count of people who wore one.',
            sources: [rai2024],
            format: { scale: 'none', decimals: 0 },
            by: 'device',
            rowHead: 'Device not worn',
            stacked: true,
            order: ['helmet', 'seat-belt'],
            labels: { helmet: 'No helmet', 'seat-belt': 'No seat belt' },
            series: [
              { key: 'driver', label: 'Drivers', color: 's2', file: DEVICE, x: 'device', where: { geography: 'india', victim: 'driver', indicator: 'deaths' } },
              { key: 'passenger', label: 'Passengers', color: 's6', file: DEVICE, x: 'device', where: { geography: 'india', victim: 'passenger', indicator: 'deaths' } },
            ],
            know: [
              'These are people killed who were not wearing the device, as the police recorded it. MoRTH gives no count of victims who wore one, so no share of helmet or seat belt use can be made.',
              'In all, 54,122 people died without a helmet and 14,466 without a seat belt.',
              'MoRTH also counts the people injured without a helmet or a seat belt. This chart shows deaths only.',
              WEST_BENGAL_KNOW,
              POLICE_KNOW,
            ],
            processing: [
              'Read Annexure 37 (non-wearing of helmet) and Annexure 38 (non-wearing of seat belt) of Road Accidents in India 2024.',
              'Check India drivers killed without a helmet (39,470) and passengers killed without a seat belt (6,977) against Table 3.3.',
              'Check that the states and UTs add up to the Total rows.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How do people travel to work and to school?',
      lede: 'In 2025-26, 57.6% of workers aged 15 and over travelled 1 km or more to work, and 66.4% of students aged 6 and over travelled 1 km or more to school or college.',
      blocks: [
        {
          text: 'In towns, 52.3% of workers who travelled 1 km or more went by two-wheeler. In villages, walking (36.6%) was almost as common as the two-wheeler (37.1%).',
        },
        {
          chart: {
            kind: 'bars',
            slug: 'commute-mode-to-work',
            checked: CHECKED,
            title: 'How workers travel to work in India, rural and urban, 2025-26',
            subtitle: 'Main mode of travel of workers aged 15 and over who travelled 1 km or more to work, India.',
            punches: { office: 'MoSPI', unit: '% of workers', period: '2025-26' },
            status: ['Survey estimate'],
            note: 'The main mode is the one that covered the longest distance. Water and air are left out: 0.0% or no value.',
            sources: [nhtsFactSheet, nhtsA5],
            format: { unit: '%', decimals: 1 },
            by: 'mode',
            rowHead: 'Mode',
            order: modeKeys(MODES),
            labels: Object.fromEntries(MODES),
            series: sectorSeries('work'),
            know: [
              NHTS_KNOW,
              KM_KNOW,
              '"Two-wheeler" includes ride-hail and rental two-wheelers. "Car or taxi" includes ride-hail cars. "Bus" includes company and inter-city buses. "Metro, suburban train or tram" also includes monorail.',
              'Workers are aged 15 and over. The reference period is 30 travel days for a fixed workplace and one travel day for others.',
              'The urban values have higher relative standard errors (RSE) than the rural ones: 4.3% for urban two-wheelers, 21.2% for urban buses.',
            ],
            processing: [
              'Read Table 4 of the NHTS fact sheet and Appendix A Table 5: mode of travel to work, persons, rural, urban and rural and urban.',
              'Check the India two-wheeler share (42.6%) against Table 4.',
              'Check that the all-India rows of Table A5 equal Table 4.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'The two-wheeler share of workers ranged from 5.7% in Nagaland to 92.7% in Puducherry. It was 59.1% in Tamil Nadu and 61.5% in Telangana, two of the states with the highest road death rates.',
        },
        {
          chart: {
            kind: 'states',
            slug: 'two-wheeler-commute-by-state',
            checked: CHECKED,
            title: 'Workers who go to work by two-wheeler, by state, 2025-26',
            subtitle: 'Share of workers aged 15 and over who travelled 1 km or more to work with a two-wheeler as the main mode, by state and UT.',
            punches: { office: 'MoSPI', unit: '% of workers', period: '2025-26' },
            status: ['Survey estimate'],
            note: 'Rural and urban together. Values for small states and UTs, and some large ones, have wide margins of error.',
            sources: [nhtsFactSheet, nhtsA5, nhtsB4],
            format: { unit: '%', decimals: 1 },
            data: { file: MODE, where: { purpose: 'work', sector: 'rural+urban', sex: 'person', mode: 'two-wheeler' }, x: 'geography' },
            open: 'map',
            scale: 'seq',
            bins: [20, 35, 45, 55, 65],
            short: 'Two-wheeler to work',
            know: [
              'The relative standard error (RSE) is above 20% for Meghalaya (28.5%), Nagaland (24.5%), Madhya Pradesh (21.7%) and Ladakh (20.0%). Read these values as rough.',
              KM_KNOW,
              '"Two-wheeler" includes ride-hail and rental two-wheelers.',
              NHTS_KNOW,
            ],
            processing: [
              'Read Appendix A Table 5 of the NHTS: mode of travel to work, rural and urban, persons, by state and UT.',
              'Read the RSE of each value from Appendix B Table 4.',
              'Check India (42.6%) against fact sheet Table 4.',
              'Match state names to the site geography table. The workbooks name Kerala "Keralam".',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'Students travelled mostly on foot, by bus or by bicycle: 37.0% walked, 29.5% went by bus and 15.8% by bicycle. In villages, 40.5% walked.',
        },
        {
          chart: {
            kind: 'bars',
            slug: 'commute-mode-to-school',
            checked: CHECKED,
            title: 'How students travel to school or college in India, rural and urban, 2025-26',
            subtitle: 'Main mode of travel of students aged 6 and over who travelled 1 km or more to an educational institution, India.',
            punches: { office: 'MoSPI', unit: '% of students', period: '2025-26' },
            status: ['Survey estimate'],
            note: 'The main mode is the one that covered the longest distance. Water and air are left out: 0.0% or no value.',
            sources: [nhtsFactSheet, nhtsA3],
            format: { unit: '%', decimals: 1 },
            by: 'mode',
            rowHead: 'Mode',
            order: modeKeys(MODES),
            labels: Object.fromEntries(MODES),
            series: sectorSeries('education'),
            know: [
              NHTS_KNOW,
              KM_KNOW,
              'A child who walks less than 1 km to school is not in these figures.',
              '"Bus" includes school buses. Students are aged 6 and over, by current weekly status. The reference period is 90 travel days.',
              'The urban values have higher relative standard errors (RSE) than the rural ones: 12.8% for urban buses, 17.8% for urban walking.',
            ],
            processing: [
              'Read Table 2 of the NHTS fact sheet and Appendix A Table 3: mode of travel to an educational institution, persons, rural, urban and rural and urban.',
              'Check the rural walk share (40.5%) against Table 2.',
              'Check that the all-India rows of Table A3 equal Table 2.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How do households travel on overnight trips?',
      lede: 'Among households that made an overnight trip in 28 travel days, 55.8% went by bus and 17.7% by inter-city rail. In towns, rail carried 22.7%.',
      blocks: [
        {
          chart: {
            kind: 'bars',
            slug: 'overnight-trip-mode',
            checked: CHECKED,
            title: 'How households travel on overnight trips in India, rural and urban, 2025-26',
            subtitle: 'Share of households that made an overnight trip in the last 28 travel days, by mode, India.',
            punches: { office: 'MoSPI', unit: '% of households', period: '2025-26' },
            status: ['Survey estimate'],
            note: 'A household can use more than one mode. Walk, bicycle, cycle rickshaw and water are left out: each is 0.3% or less.',
            sources: [nhtsFactSheet],
            format: { unit: '%', decimals: 1 },
            by: 'category',
            rowHead: 'Mode',
            order: modeKeys(OVERNIGHT_MODES),
            labels: Object.fromEntries(OVERNIGHT_MODES),
            series: (
              [
                ['rural', 'Rural', 's4', false],
                ['urban', 'Urban', 's5', false],
                ['rural+urban', 'Rural and urban', 'ink', true],
              ] as const
            ).map(([sector, label, color, hidden]) => ({
              key: sector,
              label,
              color,
              hidden,
              file: FACT_SHEET,
              x: 'category',
              where: { table: 'NHTS 2025-26 fact sheet, Table 7', sector, category: modeKeys(OVERNIGHT_MODES) },
            })),
            know: [
              'An overnight trip is a trip with at least one night away from home. The reference period is 28 travel days.',
              'Most overnight trips were for socialising, communication and religious practice: 70.2% of households that made one, in fact sheet Table 6.',
              DTES_KNOW,
              NHTS_KNOW,
              'The fact sheet prints 14 for rural inter-city rail, with no decimal. We show it as 14.0%.',
            ],
            processing: [
              'Read Table 7 of the NHTS fact sheet: mode of overnight trips, rural, urban and rural and urban.',
              'Check the bus share, rural and urban (55.8%), against the table.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How do Indians travel for leisure, family and pilgrimage?',
      lede: 'In 2025-26, 36.1% of households made at least one overnight trip for a holiday, a pilgrimage, health care, shopping, a social visit, business or study. In villages the share was 35.2%, and in towns 37.7%.',
      blocks: [
        {
          chart: {
            kind: 'states',
            slug: 'overnight-trip-households-by-state',
            checked: CHECKED,
            title: 'Households that made an overnight trip, by state, 2025-26',
            subtitle: 'Share of households that made at least one overnight trip: a holiday, pilgrimage, health or shopping trip in the last 365 days, or a business, social, education or other trip in the last 30 days, by state and UT.',
            punches: { office: 'MoSPI', unit: '% of households', period: '2025-26' },
            status: ['Survey estimate'],
            note: 'Denominator: all households. Derived from MoSPI\'s counts of households in Appendix A Table 1. Rural and urban together.',
            sources: [dtesReport, dtesT1],
            format: { unit: '%', decimals: 1 },
            data: { file: TOURISM_STATES, where: { sector: 'rural+urban', trip_type: 'overnight', indicator: 'share-of-households-with-trip' }, x: 'geography' },
            open: 'map',
            scale: 'seq',
            bins: [25, 30, 35, 40, 50],
            short: 'Overnight trips',
            know: [
              'MoSPI prints this share for India only (Statement 3.1). For each state and UT we divide the households that reported an overnight trip by all households, both from Appendix A Table 1. India\'s value equals Statement 3.1. MoSPI\'s own state shares of same-day trips (Statement 3.16) use the same division.',
              DTES_PERIODS_KNOW,
              DTES_TRIP_KNOW,
              'MoSPI gives no standard error for this share. The relative standard errors of the trip counts are highest in small states and UTs, up to 61.41% for urban 30-day trips in Mizoram. Lakshadweep (240 sample households) and Ladakh (360) have the smallest samples.',
              DTES_NHTS_KNOW,
            ],
            processing: [
              'Read Appendix A Table 1 of NSS Report 597: estimated households, and households that reported an overnight trip, rural, urban and rural and urban, by state and UT (in hundreds).',
              'Divide column 3 by column 2 and multiply by 100, to one decimal. Mark the result derived.',
              'Check India (35.2% rural, 37.7% urban, 36.1% rural and urban) against Statement 3.1.',
              'Check all 110 values of Statement 3.16 against the same division on Table 19, to confirm the method.',
              'Match state names to the site geography table. MoSPI names Kerala "Keralam".',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'The share ranged from 18.7% in Meghalaya to 62.9% in Lakshadweep. It was 47.6% in Tamil Nadu and in Rajasthan, and 36.9% in Uttar Pradesh.',
        },
        {
          text: 'Pilgrimage was the leading purpose of 16.1 overnight trips for every 100 households in a year, and health care of 10.0. Urban households made 13.5 holiday trips for every 100 households in a year, against 4.0 in villages. Social visits gave 16.1 trips for every 100 households in a month.',
        },
        {
          chart: {
            kind: 'bars',
            slug: 'overnight-trips-by-purpose',
            checked: CHECKED,
            title: 'Overnight trips by leading purpose in India, rural and urban, 2025-26',
            subtitle: 'Overnight trips for every 100 households, by the leading purpose of the trip, India. Holiday, pilgrimage, health and shopping trips are over the last 365 days; the others over the last 30 days.',
            punches: { office: 'MoSPI', unit: 'trips per 100 households', period: '2025-26' },
            status: ['Survey estimate'],
            note: 'Denominator: all households, with or without a trip. Do not compare a 365-day count with a 30-day count.',
            sources: [dtesReport, dtesT1, dtesT15],
            format: { decimals: 1 },
            by: 'purpose_period',
            rowHead: 'Leading purpose (reference period)',
            order: PURPOSES.map(([k]) => k),
            labels: Object.fromEntries(PURPOSES),
            series: tourismSeries('overnight-trips-per-100-households', {}),
            know: [
              DTES_PERIODS_KNOW,
              DTES_TRIP_KNOW,
              'A trip counts once, however many household members travel together on it. "Social" covers visits to friends and relatives, weddings and other family events, and visits to one\'s hometown.',
              DTES_ROUND_KNOW,
              DTES_NHTS_KNOW,
            ],
            processing: [
              'Read Statement 3.2 of NSS Report 597: average number of overnight trips per 100 households, by leading purpose, rural, urban and rural and urban.',
              'Check pilgrimage, rural (15.5), and social, rural and urban (16.1), against the statement.',
              'Check each value against the trip counts of Appendix A Table 15 divided by the households of Table 1.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'A trip for health care cost the most: ₹32,167 on average. Urban households spent ₹41,649 on such a trip, and rural households ₹29,454. A social trip cost ₹2,543.',
        },
        {
          chart: {
            kind: 'bars',
            slug: 'overnight-trip-spending-by-purpose',
            checked: CHECKED,
            title: 'Spending per overnight trip by leading purpose in India, rural and urban, 2025-26',
            subtitle: 'Average spending on one overnight trip, in rupees, by the leading purpose of the trip, India.',
            punches: { office: 'MoSPI', unit: '₹ per trip', period: '2025-26' },
            status: ['Survey estimate'],
            note: 'Denominator: overnight trips. Spending for the whole trip, not per person. Holiday, pilgrimage, health and shopping trips are over the last 365 days; the others over the last 30 days.',
            sources: [dtesReport, dtesT15],
            format: { unit: '₹', decimals: 0 },
            by: 'purpose_period',
            rowHead: 'Leading purpose (reference period)',
            order: PURPOSES.map(([k]) => k),
            labels: Object.fromEntries(PURPOSES),
            series: tourismSeries('average-spending-per-overnight-trip', { item: 'total' }),
            know: [
              'Spending covers everything related to the trip, before, during or after it, whoever paid: the household, or an institution such as a government office. It includes package tours.',
                            'Relative standard errors of spending per trip for India are 1.35% (rural) and 2.18% (urban) for 365-day trips, and 1.86% and 2.98% for 30-day trips.',
              DTES_PERIODS_KNOW,
              DTES_NHTS_KNOW,
            ],
            processing: [
              'Read Appendix A Table 15 of NSS Report 597: total spending per overnight trip, by leading purpose, rural, urban and rural and urban.',
              'Check health, rural and urban (₹32,167), and business, rural (₹5,179), against Statements 3.13 and 3.15.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'Medical care was ₹23,361 of the cost of a health trip. On a holiday trip, transport was the largest item, at ₹3,685. On a shopping trip, shopping was ₹13,408.',
        },
        {
          chart: {
            kind: 'bars',
            slug: 'overnight-trip-spending-by-item',
            checked: CHECKED,
            title: 'What an overnight trip costs, by item, India, 2025-26',
            subtitle: 'Average spending on one overnight trip, in rupees, by item and by the leading purpose of the trip, rural and urban India.',
            punches: { office: 'MoSPI', unit: '₹ per trip', period: '2025-26' },
            status: ['Survey estimate'],
            note: 'Denominator: overnight trips. Each item is rounded, so the items can differ from the total by a few rupees.',
            sources: [dtesReport, dtesT15],
            format: { unit: '₹', decimals: 0 },
            by: 'purpose_period',
            rowHead: 'Leading purpose (reference period)',
            stacked: true,
            order: ITEM_ROWS,
            labels: Object.fromEntries(PURPOSES),
            series: [
              ...SPENDING_ITEMS.map(([item, label, color]) => ({
                key: item,
                label,
                color,
                file: TOURISM,
                x: 'purpose_period',
                where: { measure: 'average-spending-per-overnight-trip', sector: 'rural+urban', item, purpose_period: ITEM_ROWS },
              })),
              {
                key: 'total',
                label: 'Total',
                color: 'ink',
                hidden: true,
                file: TOURISM,
                x: 'purpose_period',
                where: { measure: 'average-spending-per-overnight-trip', sector: 'rural+urban', item: 'total', purpose_period: ITEM_ROWS },
              },
            ],
            know: [
              'A package tour is a trip that a tour operator sells as one product, with more than one service: transport, a place to stay, food or sightseeing. Its cost is one item; MoSPI does not split it.',
              '"Recreation" covers recreation, religious, cultural and sporting activities. "Medical" covers medical and health-related spending.',
              'MoSPI gives the items for rural and urban areas separately in Statements 3.14a and 3.14b, as shares of spending outside the package. This chart shows rural and urban together.',
              DTES_PERIODS_KNOW,
              DTES_NHTS_KNOW,
            ],
            processing: [
              'Read Appendix A Table 15 of NSS Report 597: average spending per overnight trip by item, rural and urban together.',
              'Check every value against Statement 3.13, for example transport on a holiday trip (₹3,685).',
              'Check that the package and the items outside it add up to the total, within a few rupees.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
  ],
  about: {
    intro:
      'Road safety figures are police records, not survey estimates. MoRTH counts the road accidents that the police record, and police counts are lower than survey-based estimates of road deaths. Deaths per lakh people use MoRTH\'s own population figures, and a state comparison also compares how well each state records accidents. Travel figures come from the first National Household Travel Survey, a sample survey. Tourism figures come from the Domestic Tourism Expenditure Survey, another sample survey of the same year, with its own definition of a trip: MoSPI says the two do not compare. Railways, aviation, freight and vehicle registrations are not covered yet: rail appears only as a mode of travel in the survey.',
    publisher:
      'The Transport Research Wing of the Ministry of Road Transport and Highways (MoRTH) publishes Road Accidents in India, from the records of the police of each state and UT. The National Statistics Office (NSO), MoSPI, publishes the National Household Travel Survey (NHTS) 2025-26, and the Domestic Tourism Expenditure Survey (DTES) in NSS Report 597.',
    frequency:
      'Road Accidents in India: once a year. MoRTH gives no release date for the 2024 edition; it says the report was late because of the move to the e-DAR system. NHTS: first round, July 2025 to June 2026, fact sheet released on 5 Oct 2026. DTES: NSS round 80, July 2025 to June 2026, released on 23 Sep 2026; earlier rounds were in 2008-09 and 2014-15. No date published for the next releases.',
    revisions:
      'Every 2023 count and rate in the 2024 edition equals the 2023 edition, except Lakshadweep deaths: "-" in 2023, 0 in 2024. MoRTH notes that it reconciled West Bengal data for 2015 to 2017, 2019 and 2020, and Tamil Nadu data for 2017 to 2020.',
    breaks:
      "West Bengal did not send its 2024 data in MoRTH's formats. MoRTH recast it from e-DAR totals: the totals are valid, but the 2024 breakdowns by road user, helmet and seat belt follow West Bengal's 2023 pattern. From 2021, MoRTH computes rates with the Registrar General's population projections of July 2020.",
    coverage:
      'Road safety: India and all 36 states and UTs, calendar years 2023 and 2024, with India from 1970. MoRTH gives 1970, 1980 and 1990, then every year from 1995. Travel: India and all 36 states and UTs, July 2025 to June 2026, trips of 1 km or more. Tourism: India and all 36 states and UTs, July 2025 to June 2026; trips and spending for India only. Chandigarh has no rural sample in either survey.',
    missing:
      'No railways, aviation, freight or vehicle registrations yet. No accidents by road type, cause or time of day, and no city figures: MoRTH prints them, but they are not built yet. No road length or vehicle count after 2022. No trip distance: the NHTS does not publish one. No road accident data for 2025: a dated MoRTH report comes first. No tourism comparison with the 2014-15 round, which counted pilgrimage trips over 30 days. Neither publisher states a reuse licence.',
  },
  sources: [rai2024, raiMetadata, nhtsFactSheet, nhtsPressNote, nhtsA3, nhtsA5, nhtsB2, nhtsB4, dtesReport, dtesPressNote, dtesT1, dtesT15],
  related: [
    { label: 'Health: Deaths by cause group', href: '/charts/causes-of-death/' },
    { label: 'Crime and justice: Recorded crime rate by state', href: '/charts/crime-rate-by-state/' },
    { label: 'Jobs: Women in the labour force by state', href: '/charts/women-labour-force-by-state/' },
    { label: 'Living standards: Household spending by state', href: '/charts/household-spending-by-state/' },
    { label: 'How we check: method breaks', href: '/how-we-check/#part-3' },
  ],
}

export default topic
