import type { Source, Topic } from '../types'


const IMD_SEASON_2026: Source = {
  publisher: 'IMD',
  release: 'Salient Features of the 2026 Southwest Monsoon Season (press release)',
  released: '2026-09-30',
  url: 'https://internal.imd.gov.in/press_release/20260930_pr_5361.pdf',
}

const IMD_SDWR_2026_09_30: Source = {
  publisher: 'IMD National Weather Forecasting Centre',
  release: 'Special Daily Weather Report, Table-2',
  released: '2026-09-30',
  url: 'https://mausam.imd.gov.in/backend/assets/pdf_to_img_nwfc_monsoon/14_IMD%20SDWR%2030%20September%202026_6abce82b302f8.png',
}

// IMD Pune states no release date for this live table.
const IMD_PUNE_ALL_INDIA: Source = {
  publisher: 'IMD Pune, Climate Research and Services',
  release: 'India (June-Sept) Rainfall, all-India table, 1901 to 2026',
  released: 'not stated',
  url: 'https://imdpune.gov.in/cmpg/Product/Rainfall_Data.html',
}

// IMD Pune states no release date for this image.
const IMD_PUNE_RFSTATS_2026: Source = {
  publisher: 'IMD Pune, Climate Research and Services',
  release: 'Rainfall statistics, monsoon season 2026',
  released: 'not stated',
  url: 'https://imdpune.gov.in/seasons_previous/swmonsoon/swmonsoon26/rfstats.gif',
}

const IMD_CLIMATE_2025: Source = {
  publisher: 'IMD',
  release: 'Statement on the Climate of India during 2025 (press release)',
  released: '2026-01-01',
  url: 'https://internal.imd.gov.in/press_release/20260101_pr_4602.pdf',
}

// CEA states no release date for its monthly reports; the list page shows none.
// The URL is the CEA list page that holds every edition; the README gives one download id per edition.
const CEA_CAPACITY: Source = {
  publisher: 'Central Electricity Authority (CEA)',
  release: 'Installed Capacity reports, March editions 2014 to 2026 and the report as on 31 Oct 2026',
  released: 'not stated',
  url: 'https://cea.nic.in/reports/dashboardView?headingId=107&subHeadingId=1003&subSubHeadingId=10014&lang=en',
}

const MNRE_STATES_2026_10: Source = {
  publisher: 'Ministry of New and Renewable Energy (MNRE)',
  release: 'State-wise (Location based) installed capacity of Renewable Power as on 31.10.2026',
  released: '2026-11-12',
  url: 'https://mnre.gov.in/static/uploads/2026/11/4519bf2a3faca1ef18d71b8a267812a6.pdf',
}

const RAIN_BY_MONTH = 'climate/monsoon-2026-by-month-and-region.csv'
const CAPACITY = 'climate/installed-capacity-by-source-2014-2026.csv'
const SUBDIVISIONS = 'climate/monsoon-2026-by-subdivision.csv'

// India and the 36 states and UTs. The MNRE table also has an "Others" row (49.31 MW, no state);
// the board leaves it off the chart and the map.
const STATES_AND_INDIA = [
  'india',
  'andhra-pradesh', 'arunachal-pradesh', 'assam', 'bihar', 'chhattisgarh', 'goa', 'gujarat', 'haryana',
  'himachal-pradesh', 'jharkhand', 'karnataka', 'kerala', 'madhya-pradesh', 'maharashtra', 'manipur',
  'meghalaya', 'mizoram', 'nagaland', 'odisha', 'punjab', 'rajasthan', 'sikkim', 'tamil-nadu', 'telangana',
  'tripura', 'uttar-pradesh', 'uttarakhand', 'west-bengal', 'andaman-nicobar', 'chandigarh', 'dnh-dd',
  'delhi', 'jammu-kashmir', 'ladakh', 'lakshadweep', 'puducherry',
] as const

const topic: Topic = {
  slug: 'climate',
  name: 'Climate',
  hindi: 'जलवायु',
  question: 'How much rain did the 2026 monsoon bring, and how does it compare with 125 years of records?',
  standfirst:
    'India got 759.4 mm of rain in the 2026 monsoon, 12.6% below the long-period average. Only 12 monsoons since 1901 were drier.',
  figures: [
    {
      chart: 'monsoon-rainfall',
      series: 'rain-mm',
      x: '2026',
      format: { decimals: 1, suffix: ' mm' },
      label: 'Monsoon rain, 87% of the long-period average',
      period: 'Jun to Sep 2026',
    },
    { chart: 'warmest-years', series: 'anomaly', x: '2025', label: '2025 against 1991-2020; 2024 was warmest, +0.65°C' },
    { chart: 'non-fossil-capacity-share', series: 'non-fossil', x: '2026-10-31', label: 'Non-fossil share of installed power capacity', period: '31 Oct 2026' },
  ],
  nextRelease: 'MNRE and CEA capacity for November 2026, estimated mid-December 2026',
  parts: [
    {
      title: 'How much rain did the 2026 monsoon bring?',
      lede: 'IMD measures monsoon rain against the long-period average (LPA): 868.6 mm, the mean June to September rainfall for 1971 to 2020. The driest monsoon since 1901 was in 1972, 22.3% below the LPA. The wettest was in 1917, 26.6% above.',
      blocks: [
        {
          chart: {
            kind: 'columns',
            slug: 'monsoon-rainfall',
            title: 'Monsoon rainfall in India, 1901 to 2026',
            subtitle: 'Departure of June to September rainfall from the long-period average (LPA) of 868.6 mm (1971 to 2020), %, India.',
            punches: { office: 'IMD', unit: '% from LPA', period: 'JUN-SEP 2026' },
            status: ['Provisional'],
            note: 'The 2026 value comes from real-time data. IMD may revise it in its final monsoon report. IMD gives the 2026 departure as -12.6% in its all-India table and rounds it to -13% in its daily weather report.',
            sources: [IMD_PUNE_ALL_INDIA, IMD_SEASON_2026],
            format: { decimals: 1, unit: '%' },
            y: { min: -30, max: 30, step: 10 },
            sign: { above: 's5', below: 's1', aboveLabel: 'Wetter than the LPA', belowLabel: 'Drier than the LPA' },
            // LATER: "Provisional" applies to the 2026 value only; status is set per chart.
            series: [
              { key: 'india', label: 'India', color: 'ink', file: 'climate/monsoon-rainfall-all-india-1901-2026.csv', y: 'departure_pct_from_lpa', where: { geography: 'india', season: 'jun-sep' } },
              // Read for the hero figure (759.4 mm) and the table; not drawn.
              { key: 'rain-mm', label: 'Rainfall, mm', color: 'ink', hidden: true, format: { decimals: 1, suffix: ' mm' }, file: 'climate/monsoon-rainfall-all-india-1901-2026.csv', y: 'rainfall_mm', where: { geography: 'india', season: 'jun-sep' } },
            ],
            callouts: [
              { series: 'india', x: '1917', label: '1917: wettest, +26.6%' },
              { series: 'india', x: '1972', label: '1972: driest, -22.3%' },
            ],
            // LATER: the board also labels "2026: 12.6% below"; a callout on the last column is cut off.
            know: [
              'The long-period average (LPA) is the mean June to September rainfall for India over 1971 to 2020: 868.6 mm.',
              'The 2026 value comes from real-time data. IMD may revise it in its final monsoon report.',
              'IMD gives the 2026 departure as -12.6% in its all-India table and rounds it to -13% in its daily weather report.',
            ],
            processing: [
              'We take June to September rainfall and its departure from the LPA for each year from 1901 to 2026 from the IMD Pune all-India table.',
              'We check the 2026 value against the IMD season press release of 30 September 2026.',
              'We keep the departures as IMD prints them, to one decimal place.',
              'We colour each column by its sign: wetter or drier than the LPA.',
            ],
            nextRelease: 'not announced',
          },
        },
        { text: 'June 2026 brought 35% less rain than normal across India. In Central India, June rain was half of normal, then July was 33% above normal.' },
        {
          chart: {
            kind: 'columns',
            slug: 'monsoon-2026-by-month',
            title: 'Monsoon rainfall in 2026 by month, India and its four regions',
            subtitle: 'Departure of rainfall from the long-period average for each month and for the season (June to September), %, 2026.',
            punches: { office: 'IMD', unit: '% from LPA', period: 'JUN-SEP 2026' },
            status: ['Provisional'],
            note: 'The regions are IMD\'s four homogeneous regions. IMD documents differ slightly: East and Northeast India got 1,017.1 mm in the season table and 1,016.3 mm in the season report table. The report text gives June rain for India as 104 mm; its table gives 106.8 mm. This chart uses the table values.',
            sources: [IMD_PUNE_RFSTATS_2026, IMD_SEASON_2026],
            format: { decimals: 1, unit: '%' },
            y: { min: -60, max: 40, step: 20 },
            sign: { above: 's5', below: 's1', aboveLabel: 'Wetter than normal', belowLabel: 'Drier than normal' },
            panels: [
              { label: 'All India', series: ['india'] },
              { label: 'Northwest', series: ['northwest'] },
              { label: 'East and Northeast', series: ['east-northeast'] },
              { label: 'Central', series: ['central'] },
              { label: 'South Peninsula', series: ['south-peninsula'] },
            ],
            // x is the `month` label column (Jun to Sep, then Season), so the columns keep the CSV order.
            series: [
              { key: 'india', label: 'All India', color: 'ink', file: RAIN_BY_MONTH, x: 'month', y: 'departure_pct', where: { geography: 'india' } },
              { key: 'northwest', label: 'Northwest', color: 'ink', file: RAIN_BY_MONTH, x: 'month', y: 'departure_pct', where: { geography: 'northwest-india' } },
              { key: 'east-northeast', label: 'East and Northeast', color: 'ink', file: RAIN_BY_MONTH, x: 'month', y: 'departure_pct', where: { geography: 'east-northeast-india' } },
              { key: 'central', label: 'Central', color: 'ink', file: RAIN_BY_MONTH, x: 'month', y: 'departure_pct', where: { geography: 'central-india' } },
              { key: 'south-peninsula', label: 'South Peninsula', color: 'ink', file: RAIN_BY_MONTH, x: 'month', y: 'departure_pct', where: { geography: 'south-peninsula' } },
            ],
            know: [
              'IMD divides India into four homogeneous regions: Northwest, Central, East and Northeast, and the South Peninsula.',
              'Each monthly departure compares that month\'s rain with its own long-period average, so a wet month can follow a dry one in the same season.',
              'The 2026 values come from real-time data. IMD may revise them in its final monsoon report.',
              'IMD documents differ slightly on some 2026 totals. This chart uses the table values.',
            ],
            processing: [
              'We take rainfall, normal rainfall and the departure for each month and for the season, for India and each region, from the IMD Pune rainfall statistics for the 2026 season.',
              'We check the season values against the IMD season press release of 30 September 2026.',
              'Where IMD\'s report text and table differ, we keep the table value and note the difference.',
              'We keep the departures as published, to one decimal place.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'Which parts of India were short of rain?',
      lede: 'IMD divides India into 36 meteorological subdivisions and four homogeneous regions. In 2026, two of the four regions had deficient rain: East and Northeast India, 26% below normal, and the South Peninsula, 24% below.',
      blocks: [
        { text: "17 of the 36 subdivisions had deficient rain in 2026, covering 42% of India's area. Arunachal Pradesh was 44% short and Punjab 41% short. Odisha was the only subdivision with excess rain, at 29% above normal." },
        {
          chart: {
            kind: 'dots',
            slug: 'monsoon-2026-by-subdivision',
            title: 'Monsoon rainfall by meteorological subdivision, 2026',
            subtitle: 'Departure of rainfall from normal, %, IMD\'s 36 meteorological subdivisions, 1 Jun to 30 Sep 2026. Sorted from the wettest to the driest.',
            punches: { office: 'IMD', unit: '% from normal', period: '1 JUN-30 SEP 2026' },
            status: ['Provisional'],
            note: "Colours show IMD's own category for each subdivision. Subdivisions do not follow state lines: Maharashtra has four, and Haryana, Chandigarh and Delhi share one. IMD rounds these departures to whole numbers; India's -13% is -12.6% in IMD's all-India table.",
            sources: [IMD_SDWR_2026_09_30, IMD_SEASON_2026],
            format: { decimals: 0, unit: '%' },
            by: 'name',
            // One series per IMD category, so each dot takes its category colour. Rows are picked by
            // column values (type and category), not by position.
            // Rows keep the CSV order (wettest to driest): each row has a value in one series only.
            // LATER: the board sorts from the largest shortfall and draws each dot on a stem from zero; dots sort high to low and have no stems.
            refs: [{ value: -13, label: 'India -13%' }],
            series: [
              { key: 'excess', label: 'Excess: wetter than normal', color: 's5', file: SUBDIVISIONS, x: 'name', y: 'departure_pct', where: { geography_type: 'met-subdivision', category: 'excess' } },
              { key: 'normal', label: 'Normal', color: 'other', file: SUBDIVISIONS, x: 'name', y: 'departure_pct', where: { geography_type: 'met-subdivision', category: 'normal' } },
              { key: 'deficient', label: 'Deficient: drier than normal', color: 's1', file: SUBDIVISIONS, x: 'name', y: 'departure_pct', where: { geography_type: 'met-subdivision', category: 'deficient' } },
            ],
            know: [
              'IMD publishes 2026 monsoon rainfall by meteorological subdivision, not by state. Subdivisions do not follow state lines.',
              'IMD gives each subdivision a category: excess, normal or deficient. The colours follow it.',
              'IMD rounds the subdivision departures to whole numbers.',
              'The 2026 values come from real-time data. IMD may revise them in its final monsoon report.',
            ],
            processing: [
              'We take rainfall, normal rainfall, the departure and IMD\'s category for each of the 36 subdivisions from Table-2 of the IMD Special Daily Weather Report of 30 September 2026.',
              'We compare all 41 rows (36 subdivisions, four regions and India) with the IMD table image, and the category counts with the IMD season press release.',
              'We colour each subdivision by the category IMD gives it. We do not set our own bins.',
              'We do not draw this chart on the state map, because subdivisions do not match states.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'Which years were warmest, and how warm was 2025?',
      lede: "IMD compares each year's average land temperature with the average for 1991 to 2020. The difference is the temperature anomaly. IMD has not released its annual temperature series since 1901 as data; its statement for 2025 gives a warming trend of 0.68°C per 100 years over 1901 to 2025.",
      blocks: [
        { text: "2024 was India's warmest year since records began in 1901, at 0.65°C above the 1991 to 2020 average. 2025 was the eighth warmest, at 0.28°C above." },
        {
          chart: {
            kind: 'bars',
            slug: 'warmest-years',
            title: "India's warmest years since 1901",
            subtitle: 'Annual mean land surface air temperature, difference from the 1991 to 2020 average, °C, India. The years IMD names in its statement for 2025.',
            punches: { office: 'IMD', unit: '°C vs 1991-2020', period: '2025' },
            note: 'IMD names the five warmest years and the rank of 2025, but not the 6th and 7th warmest years. Older IMD statements used the 1981 to 2010 average, so their figures do not compare with these.',
            sources: [IMD_CLIMATE_2025],
            format: { decimals: 2, unit: '°C', signed: true },
            by: 'period',
            order: ['2024', '2016', '2009', '2010', '2017', '2025'],
            highlight: '2025',
            // LATER: the board fills 2025 in ink (highlight is series-1), prints each rank from
            // `rank_warmest_since_1901`, and adds a gap row "6th and 7th: not named by IMD".
            series: [
              { key: 'anomaly', label: 'Other years', color: 'other', file: 'climate/warmest-years-temperature-anomaly.csv', x: 'period', where: { geography: 'india' } },
            ],
            know: [
              'The anomaly is the difference between a year\'s mean land surface air temperature and the 1991 to 2020 average.',
              'IMD names the five warmest years since 1901 and the rank of 2025. It does not name the 6th and 7th warmest years.',
              'IMD publishes its annual temperature series since 1901 only as a chart image, not as data.',
              'Older IMD statements used the 1981 to 2010 average, so their anomalies do not compare with these.',
            ],
            processing: [
              'We take the anomaly and the rank of each named year from the text of the IMD Statement on the Climate of India during 2025.',
              'We keep the anomalies as IMD states them, to two decimal places.',
              'We do not estimate the years that IMD does not name.',
            ],
            nextRelease: 'not announced',
          },
        },
        { text: 'January and February 2025 were 1.17°C warmer than the 1991 to 2020 average, the warmest winter since 1901. October to December was 0.10°C cooler than average.' },
        {
          chart: {
            kind: 'columns',
            slug: 'temperature-2025-by-season',
            title: 'Temperature in India by season, 2025',
            subtitle: 'Mean land surface air temperature, difference from the 1991 to 2020 average, °C, India, 2025.',
            punches: { office: 'IMD', unit: '°C vs 1991-2020', period: '2025' },
            note: "IMD's seasons are winter (January and February), pre-monsoon (March to May), monsoon (June to September) and post-monsoon (October to December).",
            sources: [IMD_CLIMATE_2025],
            format: { decimals: 2, unit: '°C', signed: true },
            y: { min: -0.5, max: 1.5, step: 0.5 },
            sign: { above: 's1', below: 's5', aboveLabel: 'Warmer than average', belowLabel: 'Cooler than average' },
            // x is the `season_name` label column; the CSV lists the four seasons, then the year.
            // LATER: the board sets the year apart with a dashed rule.
            series: [
              { key: 'anomaly', label: 'India', color: 'ink', file: 'climate/temperature-anomaly-2025-by-season.csv', x: 'season_name', where: { geography: 'india', period: '2025' } },
            ],
            know: [
              'IMD\'s seasons are winter (January and February), pre-monsoon (March to May), monsoon (June to September) and post-monsoon (October to December).',
              'Each value is the difference from the 1991 to 2020 average for the same season.',
              'IMD says the 2025 winter anomaly, +1.17°C, is the highest since 1901.',
            ],
            processing: [
              'We take the anomaly for each season and for the year from the text of the IMD Statement on the Climate of India during 2025.',
              'We keep the anomalies as IMD states them, to two decimal places.',
              'We colour each column by its sign: warmer or cooler than average.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How fast is power capacity moving away from coal?',
      lede: 'The Central Electricity Authority (CEA) counts the power capacity of utilities every month. Capacity is the most power that plants can make at once. It is not the power that they made in a period.',
      blocks: [
        { text: 'Solar capacity grew from 2,632 MW in March 2014 to 1,74,547 MW in October 2026. Coal and lignite capacity grew from 1,45,273 MW to 2,31,438 MW.' },
        {
          chart: {
            kind: 'area',
            slug: 'power-capacity-by-source',
            title: 'Installed power capacity in India by source, 2014 to 2026',
            subtitle: 'Megawatts (MW) of installed capacity at utilities, India, on 31 March of each year and on 31 Oct 2026.',
            punches: { office: 'CEA', unit: 'MW', period: '31 OCT 2026' },
            status: ['Method break'],
            note: 'Before March 2019, CEA counted lignite inside coal. In 2017 MNRE revised renewable capacity for March 2014 to March 2017. CEA counts off-grid renewable capacity from August 2021. CEA removed plants on long outage from its count in April 2025 and August 2026, which explains most of the fall in gas capacity. Other renewables are small hydro, bio-power and waste-to-energy. Captive plants are not included.',
            sources: [CEA_CAPACITY],
            format: { decimals: 0, scale: 'none' },
            y: { min: 0, max: 600000, step: 100000 },
            // LATER: the board sums sources into seven bands, each labelled with its total ("Coal and
            // lignite 2,31,438 MW"); a series reads one CSV row per x, so each source is its own series,
            // in its band's colour. `coal` takes `coal-incl-lignite` to March 2018 and `coal` after.
            breaks: [
              { x: '2022-03-31', label: 'Off-grid renewables added' },
              { x: '2026-03-31', label: 'Plants on long outage removed' },
              { x: '2026-10-31', label: '' },
            ],
            series: [
              { key: 'coal', label: 'Coal and lignite', color: 'slate', file: CAPACITY, where: { geography: 'india', source: ['coal-incl-lignite', 'coal'] } },
              { key: 'lignite', label: 'Coal and lignite', color: 'slate', file: CAPACITY, where: { geography: 'india', source: 'lignite' } },
              { key: 'gas', label: 'Gas and diesel', color: 's6', file: CAPACITY, where: { geography: 'india', source: 'gas' } },
              { key: 'diesel', label: 'Gas and diesel', color: 's6', file: CAPACITY, where: { geography: 'india', source: 'diesel' } },
              { key: 'nuclear', label: 'Nuclear', color: 's3', file: CAPACITY, where: { geography: 'india', source: 'nuclear' } },
              { key: 'large-hydro', label: 'Large hydro', color: 's5', file: CAPACITY, where: { geography: 'india', source: 'large-hydro' } },
              { key: 'wind', label: 'Wind', color: 's2', file: CAPACITY, where: { geography: 'india', source: 'wind' } },
              { key: 'solar', label: 'Solar', color: 's8', file: CAPACITY, where: { geography: 'india', source: 'solar' } },
              { key: 'small-hydro', label: 'Other renewables', color: 's4', file: CAPACITY, where: { geography: 'india', source: 'small-hydro' } },
              { key: 'bio-power', label: 'Other renewables', color: 's4', file: CAPACITY, where: { geography: 'india', source: 'bio-power' } },
              { key: 'waste-to-energy', label: 'Other renewables', color: 's4', file: CAPACITY, where: { geography: 'india', source: 'waste-to-energy' } },
            ],
            know: [
              'Installed capacity is the most power that plants can make at once, in megawatts (MW). It is not the power that they made in a period.',
              'CEA counts utilities only. Captive plants are not included.',
              'Before March 2019 CEA had no lignite column; lignite plants are counted inside coal.',
              'CEA counts off-grid renewable capacity from August 2021. In 2017 MNRE revised renewable capacity for March 2014 to March 2017.',
              'CEA removed plants on long outage from 30 April 2025 and from 31 August 2026. This explains most of the fall in gas capacity.',
            ],
            processing: [
              'We take capacity by source for India from each March edition of the CEA Installed Capacity report, 2014 to 2026, and from the report as on 31 October 2026.',
              'For March 2014 to March 2017 we use the renewable values that CEA prints as revised by MNRE.',
              'We add coal and lignite, gas and diesel, and small hydro, bio-power and waste-to-energy, to make seven bands.',
              'We check that the sources add up to CEA\'s total for each date.',
            ],
            nextRelease: '2026-12-17 (estimated)',
          },
        },
        { text: "On 31 October 2026, non-fossil sources made up 55.45% of India's 5,63,113 MW of power capacity, up from 32.31% in March 2014." },
        {
          chart: {
            kind: 'line',
            slug: 'non-fossil-capacity-share',
            title: 'Non-fossil share of installed power capacity in India, 2014 to 2026',
            subtitle: 'Share of total installed capacity at utilities, %, India, on 31 March of each year and on 31 Oct 2026.',
            punches: { office: 'CEA', unit: '%', period: '31 OCT 2026' },
            note: "Derived. CEA prints the non-fossil share for 31 Oct 2026 (55.45%) and 31 Mar 2026. We computed the other shares from CEA's published MW: non-fossil = (nuclear + hydro + renewables) / total. CEA's method changes in 2019, 2021, 2025 and 2026 (chart 4.1) also affect these shares.",
            sources: [CEA_CAPACITY],
            format: { decimals: 2, unit: '%' },
            y: { min: 0, max: 60, step: 10 },
            refs: [{ y: 50, label: 'Half of all capacity' }],
            series: [
              { key: 'non-fossil', label: 'Non-fossil: nuclear, hydro and other renewables', color: 's4', file: 'climate/non-fossil-share-of-capacity-2014-2026.csv', where: { geography: 'india', series: 'non-fossil' } },
              { key: 'wind-solar-other', label: 'Wind, solar and other renewables', color: 's2', file: 'climate/non-fossil-share-of-capacity-2014-2026.csv', where: { geography: 'india', series: 'wind-solar-other-re' } },
            ],
            know: [
              'Non-fossil capacity is nuclear, large hydro and renewable capacity, as a share of all installed capacity at utilities.',
              'CEA prints the non-fossil share for 31 October 2026 and 31 March 2026. We derived the other values from CEA\'s published MW.',
              'CEA\'s method changes in 2019, 2021, 2025 and 2026 also change the shares (see chart 4.1).',
            ],
            processing: [
              'We take capacity by source from each March edition of the CEA Installed Capacity report, 2014 to 2026, and from the report as on 31 October 2026.',
              'We compute non-fossil = (nuclear + hydro + renewables) / total, and wind, solar and other renewables = renewables / total.',
              'Where CEA prints the share, we check our value against it and publish CEA\'s figure.',
              'We round the shares to two decimal places.',
            ],
            nextRelease: '2026-12-17 (estimated)',
          },
        },
      ],
    },
    {
      title: 'Which states have the most renewable power?',
      lede: 'The Ministry of New and Renewable Energy (MNRE) publishes renewable power capacity for all 36 states and union territories. India had 3,03,463 MW on 31 October 2026.',
      blocks: [
        { text: "Gujarat has the most renewable capacity, at 56,289 MW, followed by Rajasthan at 52,134 MW. Tamil Nadu is fourth, with 30,401 MW. The four states above 30,000 MW hold 56.84% of India's total." },
        {
          chart: {
            kind: 'states',
            slug: 'renewable-capacity-by-state',
            title: 'Renewable power capacity by state and union territory, 31 Oct 2026',
            subtitle: 'Installed capacity of solar, wind, bio-power, small hydro and large hydro, MW, 36 states and UTs, as on 31 Oct 2026.',
            punches: { office: 'MNRE', unit: 'MW', period: '31 OCT 2026' },
            note: 'MNRE places each plant in the state where it stands. CEA\'s state tables add each state\'s share of central plants, so their figures differ. The total includes large hydro. MNRE lists a further 49.31 MW under "Others" with no state; it is in the India total.',
            sources: [MNRE_STATES_2026_10],
            format: { decimals: 0, scale: 'none' },
            bins: [500, 2000, 5000, 10000, 30000],
            data: { file: 'climate/renewable-capacity-by-state-2026-10.csv', where: { series: 'total_re', geography: STATES_AND_INDIA } },
            total: true,
            open: 'map',
            scale: 'seq',
            short: 'Renewable capacity',
            know: [
              'MNRE places each plant in the state where it stands. CEA\'s state tables add each state\'s share of central plants, so the two differ.',
              'The total includes solar, wind, bio-power, small hydro and large hydro.',
              'MNRE lists 49.31 MW under "Others" with no state. It is in the India total but not on the map.',
              'Blank cells in the MNRE table stay blank. We do not set them to zero.',
            ],
            processing: [
              'We take total renewable capacity for each of the 36 states and UTs, and for India, from the MNRE state-wise table as on 31 October 2026.',
              'We check that the state rows and "Others" add up to MNRE\'s India total of 3,03,463 MW.',
              'We round the values to whole megawatts for display.',
            ],
            nextRelease: '2026-12-14 (estimated)',
          },
        },
      ],
    },
  ],
  // LATER: the About band's side line ("How each climate figure is made, where it breaks, and what is missing.") has no field.
  about: {
    intro:
      'All values are as published. Every figure on this page is a measurement or a count by IMD, CEA or MNRE, not a survey estimate. We last checked every source on 18 November 2026.',
    publisher:
      'The India Meteorological Department (IMD), Ministry of Earth Sciences, measures rainfall and temperature for India, its four homogeneous regions and 36 meteorological subdivisions. The Central Electricity Authority (CEA) counts the installed power capacity of utilities. The Ministry of New and Renewable Energy (MNRE) publishes renewable capacity by state.',
    frequency:
      'Monsoon: daily during the season, with a season report after 30 September (30 Sep 2026). Temperature: one statement a year, each January (1 Jan 2026). CEA capacity: monthly (latest as on 31 Oct 2026). MNRE state table: monthly (latest 12 Nov 2026, as on 31 Oct 2026).',
    revisions:
      'The 2026 monsoon figures come from real-time data, and IMD may revise them in its final monsoon report. In 2017 MNRE revised renewable capacity for March 2014 to March 2017, mainly by adding about 3,000 MW of captive bagasse cogeneration; we use the revised values. IMD documents differ slightly on some 2026 totals; we use the table values.',
    breaks:
      'Rainfall is compared with the long-period average, 868.6 mm, the mean for 1971 to 2020. Temperature anomalies are against 1991 to 2020; older IMD statements used 1981 to 2010, and we do not join the two. CEA counted lignite inside coal before March 2019, counts off-grid renewables from August 2021, and removed plants on long outage from 30 April 2025 and 31 August 2026.',
    coverage:
      'Rainfall: India, 4 homogeneous regions and 36 meteorological subdivisions, which do not follow state lines. Capacity: utilities only; captive plants are not included. MNRE places each plant in the state where it stands, for all 36 states and UTs; 49.31 MW under "Others" has no state.',
    missing:
      'IMD publishes its annual temperature series since 1901 only as a chart image, not as data. IMD publishes 2026 monsoon rainfall by subdivision, not by state. IMD does not name the 6th and 7th warmest years. IMD, CEA and MNRE state no reuse licence for these data.',
  },
  sources: [
    IMD_SEASON_2026,
    IMD_SDWR_2026_09_30,
    IMD_PUNE_ALL_INDIA,
    IMD_PUNE_RFSTATS_2026,
    IMD_CLIMATE_2025,
    CEA_CAPACITY,
    MNRE_STATES_2026_10,
  ],
  related: [
    { label: 'States: Tamil Nadu profile', href: '/states/tamil-nadu/' },
    { label: 'States and union territories', href: '/states/' },
    { label: 'How we check: method breaks', href: '/how-we-check/' },
    { label: 'Releases and corrections', href: '/releases/' },
  ],
}

export default topic
