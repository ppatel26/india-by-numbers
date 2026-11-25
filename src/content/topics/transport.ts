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

// ---------------------------------------------------------------- Data

const BY_STATE = 'transport/road-accidents-by-state.csv'
const TREND = 'transport/road-accidents-india-1970-2024.csv'
const ROAD_USER = 'transport/road-deaths-by-road-user.csv'
const DEVICE = 'transport/road-deaths-helmet-seatbelt-by-state.csv'
const MODE = 'transport/travel-mode-by-state-2025-26.csv'
const FACT_SHEET = 'transport/travel-india-fact-sheet-2025-26.csv'

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

const topic: Topic = {
  slug: 'transport',
  name: 'Transport',
  hindi: 'परिवहन',
  question: 'How many people die on the roads, and how do people travel?',
  standfirst:
    'In 2024, the police recorded 1,77,175 road deaths, or 12.6 for every lakh people. People on two-wheelers were 46.2% of them. In 2025-26, 42.6% of workers who travelled 1 km or more to work went by two-wheeler. This topic covers road safety and household travel. Railways, aviation, freight and vehicle registrations are not covered yet.',
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
  ],
  about: {
    intro:
      'Road safety figures are police records, not survey estimates. MoRTH counts the road accidents that the police record, and police counts are lower than survey-based estimates of road deaths. Deaths per lakh people use MoRTH\'s own population figures, and a state comparison also compares how well each state records accidents. Travel figures come from the first National Household Travel Survey, a sample survey. Railways, aviation, freight and vehicle registrations are not covered yet: rail appears only as a mode of travel in the survey.',
    publisher:
      'The Transport Research Wing of the Ministry of Road Transport and Highways (MoRTH) publishes Road Accidents in India, from the records of the police of each state and UT. The National Statistics Office (NSO), MoSPI, publishes the National Household Travel Survey (NHTS) 2025-26.',
    frequency:
      'Road Accidents in India: once a year. MoRTH gives no release date for the 2024 edition; it says the report was late because of the move to the e-DAR system. NHTS: first round, July 2025 to June 2026, fact sheet released on 5 Oct 2026. No date published for the next releases.',
    revisions:
      'Every 2023 count and rate in the 2024 edition equals the 2023 edition, except Lakshadweep deaths: "-" in 2023, 0 in 2024. MoRTH notes that it reconciled West Bengal data for 2015 to 2017, 2019 and 2020, and Tamil Nadu data for 2017 to 2020.',
    breaks:
      "West Bengal did not send its 2024 data in MoRTH's formats. MoRTH recast it from e-DAR totals: the totals are valid, but the 2024 breakdowns by road user, helmet and seat belt follow West Bengal's 2023 pattern. From 2021, MoRTH computes rates with the Registrar General's population projections of July 2020.",
    coverage:
      'Road safety: India and all 36 states and UTs, calendar years 2023 and 2024, with India from 1970. MoRTH gives 1970, 1980 and 1990, then every year from 1995. Travel: India and all 36 states and UTs, July 2025 to June 2026, trips of 1 km or more. Chandigarh has no rural sample.',
    missing:
      'No railways, aviation, freight or vehicle registrations yet. No accidents by road type, cause or time of day, and no city figures: MoRTH prints them, but they are not built yet. No road length or vehicle count after 2022. No trip distance: the NHTS does not publish one. No road accident data for 2025: a dated MoRTH report comes first. Neither publisher states a reuse licence.',
  },
  sources: [rai2024, raiMetadata, nhtsFactSheet, nhtsPressNote, nhtsA3, nhtsA5, nhtsB2, nhtsB4],
  related: [
    { label: 'Health: Deaths by cause group', href: '/charts/causes-of-death/' },
    { label: 'Crime and justice: Recorded crime rate by state', href: '/charts/crime-rate-by-state/' },
    { label: 'Jobs: Women in the labour force by state', href: '/charts/women-labour-force-by-state/' },
    { label: 'Living standards: Household spending by state', href: '/charts/household-spending-by-state/' },
    { label: 'How we check: method breaks', href: '/how-we-check/#part-3' },
  ],
}

export default topic
