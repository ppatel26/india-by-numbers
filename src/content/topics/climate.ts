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

const IMD_PUNE_TEMPERATURE: Source = {
  publisher: 'IMD Pune, Climate Research and Services',
  release: 'All India Time Series of Temperature, Mean Temperature table',
  released: 'not stated',
  url: 'https://imdpune.gov.in/cmpg/Product/allindia_temp.html',
}

const IMD_CLIMATE_2025: Source = {
  publisher: 'IMD',
  release: 'Statement on the Climate of India during 2025 (press release)',
  released: '2026-01-01',
  url: 'https://internal.imd.gov.in/press_release/20260101_pr_4602.pdf',
}

const CEA_GROWTH: Source = {
  publisher: 'Central Electricity Authority (CEA)',
  release: 'Growth of Electricity Sector in India, 1947 to 2025, Table 2',
  released: '2026-09-03',
  url: 'https://cea.nic.in/whats-new/file?path=/home/cea_website/reports/general/en/Growth_Book_2025_1788430103505.pdf&mode=view',
}

const CEA_EXECUTIVE: Source = {
  publisher: 'Central Electricity Authority (CEA)',
  release: 'Executive Summary, March editions 2006 to 2013',
  released: 'not stated',
  url: 'https://cea.nic.in/reports/dashboardView?headingId=107&subHeadingId=1003&subSubHeadingId=10071&title=Executive%20Summary&lang=en',
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
const HISTORIC_CAPACITY = 'climate/historic-installed-capacity-1947-2013.csv'
const CAPACITY_SHARE = 'climate/non-fossil-share-of-capacity-1947-2026.csv'
const CAPACITY_BREAKS = [
  // Source changes in 1998 and 2006 share one label; the lines are too close for two.
  { x: '1998-03-31', label: 'New sources' },
  { x: '2006-03-31', label: '' },
  { x: '2014-03-31', label: 'Revised' },
  { x: '2022-03-31', label: 'Off-grid added', before: ' ' },
] as const
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
    "India's 2026 monsoon brought 759.4 mm, 12.6% below the long-period average. Only 12 monsoons since 1901 were drier.",
  figures: [
    {
      chart: 'monsoon-rainfall',
      series: 'rain-mm',
      x: '2026',
      format: { decimals: 1, suffix: ' mm' },
      label: 'Monsoon rain, 87% of the long-period average',
      period: 'Jun to Sep 2026',
    },
    { chart: 'annual-temperature-anomaly', series: 'anomaly', x: '2025', label: '2025 temperature above the 1991 to 2020 average' },
    { chart: 'non-fossil-capacity-share', series: 'non-fossil', x: '2026-10-31', label: 'Non-fossil share of installed power capacity', period: '31 Oct 2026' },
  ],
  nextRelease: 'MNRE and CEA capacity for November 2026, estimated mid-December 2026',
  parts: [
    {
      title: 'How much rain did the 2026 monsoon bring?',
      lede: 'The 2026 monsoon brought 87% of the long-period average (LPA) of 868.6 mm. The LPA is the mean June to September rain for 1971 to 2020.',
      blocks: [
        {
          chart: {
            kind: 'columns',
            slug: 'monsoon-rainfall',
            title: 'Monsoon rainfall in India, 1901 to 2026',
            subtitle: 'June to September rainfall, departure from the LPA (1971 to 2020 mean), India.',
            punches: { office: 'IMD', unit: '% from LPA', period: 'JUN-SEP 2026' },
            status: ['Provisional'],
            note: 'Only the 2026 value is provisional. IMD may revise it in its final monsoon report.',
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
              'The 2026 value comes from real-time data.',
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
            title: 'Monsoon rainfall by month, India and four regions, 2026',
            subtitle: 'Departure from the long-period average for each month and the season, 2026.',
            punches: { office: 'IMD', unit: '% from LPA', period: 'JUN-SEP 2026' },
            status: ['Provisional'],
            note: 'Each month is compared with its own long-period average. The last column is the whole season.',
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
              'A wet month can follow a dry one in the same season.',
              'The 2026 values come from real-time data. IMD may revise them in its final monsoon report.',
              'IMD documents differ slightly. East and Northeast India got 1,017.1 mm in the season table and 1,016.3 mm in the report table.',
              'The report text gives June rain for India as 104 mm, and its table 106.8 mm. This chart uses the table values.',
            ],
            processing: [
              'For India and each region, we take rainfall, normal rainfall and the departure by month and season from the IMD Pune 2026 statistics.',
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
      lede: "Two of IMD's four homogeneous regions had deficient rain in 2026: East and Northeast India, 26% below normal, and the South Peninsula, 24% below.",
      blocks: [
        { text: "17 of the 36 subdivisions had deficient rain, covering 42% of India's area. Odisha was the only one with excess rain, 29% above normal." },
        {
          chart: {
            kind: 'dots',
            slug: 'monsoon-2026-by-subdivision',
            title: 'Monsoon rainfall by meteorological subdivision, 2026',
            subtitle: 'Rain against normal, IMD\'s 36 meteorological subdivisions, wettest to driest.',
            punches: { office: 'IMD', unit: '% from normal', period: '1 JUN-30 SEP 2026' },
            status: ['Provisional'],
            note: "Subdivisions do not follow state lines. IMD rounds these values, so India's -12.6% shows here as -13%.",
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
              'IMD publishes 2026 rain by meteorological subdivision, not by state. Maharashtra has four subdivisions, and Haryana, Chandigarh and Delhi share one.',
              'IMD gives each subdivision a category: excess, normal or deficient. The colours follow it.',
              'IMD rounds the subdivision departures to whole numbers. India\'s -13% is -12.6% in IMD\'s all-India table.',
              'The 2026 values come from real-time data. IMD may revise them in its final monsoon report.',
            ],
            processing: [
              'We take rainfall, normal rainfall, the departure and the category for each subdivision from Table-2 of the IMD Special Daily Weather Report, 30 September 2026.',
              'We check all 41 rows (36 subdivisions, four regions and India) against the IMD table image, and the category counts against the season press release.',
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
      lede: "2024 was India's warmest year since 1901, 0.65°C above the 1991 to 2020 mean. IMD ranked 2025 eighth, 0.28°C above.",
      blocks: [
        {
          chart: {
            kind: 'line',
            slug: 'annual-temperature-anomaly',
            title: 'Annual mean temperature anomaly in India, 1901 to 2025',
            subtitle: 'Annual land surface air temperature, difference from the 1991 to 2020 mean, India.',
            punches: { office: 'IMD', unit: '°C vs 1991-2020', period: '1901 TO 2025' },
            sources: [IMD_PUNE_TEMPERATURE, IMD_CLIMATE_2025],
            format: { decimals: 2, unit: '°C', signed: true },
            y: { min: -1.5, max: 1, step: 0.5 },
            markers: [{ x: '2025', label: '2025 climate statement' }],
            series: [
              { key: 'anomaly', label: 'India', color: 'ink', file: 'climate/annual-temperature-anomaly-1901-2025.csv', note: 'note', where: { geography: 'india' } },
            ],
            callouts: [
              { series: 'anomaly', x: '2024', label: '2024 · Warmest' },
              { series: 'anomaly', x: '2016', label: '2016 · Second warmest' },
            ],
            know: [
              'IMD Pune gives the 1991 to 2020 annual mean as 25.09°C.',
              'The IMD climate statement ranks 2024 first, 2016 second and 2025 eighth.',
            ],
            processing: [
              'Subtract the published 1991 to 2020 mean from each annual mean in the IMD Pune table.',
              'Check that all six annual anomalies named in the 2025 statement match the calculated values to two decimal places.',
              'Use the climate statement’s published anomaly for 2025.',
            ],
            nextRelease: 'not announced',
          },
        },
        { text: 'Winter 2025 (January and February) was the warmest since 1901, at 1.17°C above average. October to December was 0.10°C below average.' },
        {
          chart: {
            kind: 'columns',
            slug: 'temperature-2025-by-season',
            title: 'Temperature in India by season, 2025',
            subtitle: 'Land surface air temperature by season, difference from the 1991 to 2020 average, India.',
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
      lede: "Non-fossil sources made up 55.45% of India's power capacity on 31 October 2026, up from 32.31% in March 2014. Capacity is the most power plants can make at once.",
      blocks: [
        { text: 'Solar grew from 2,632 MW in March 2014 to 1.75 lakh MW in October 2026. Coal and lignite grew from 1.45 to 2.31 lakh MW.' },
        {
          chart: {
            kind: 'area',
            slug: 'power-capacity-by-source',
            title: 'Installed power capacity in India by source, 1947 to 2026',
            subtitle: 'Utility capacity by source. Before 2014: thermal, nuclear, and hydro with renewables.',
            punches: { office: 'CEA', unit: 'MW', period: '31 OCT 2026' },
            status: ['Method break'],
            note: 'Dates are uneven before 1997. The breaks mark changes in what CEA counts.',
            sources: [CEA_GROWTH, CEA_EXECUTIVE, CEA_CAPACITY],
            format: { decimals: 0 },
            y: { min: 0, max: 600000, step: 100000 },
            breaks: CAPACITY_BREAKS,
            series: [
              { key: 'historic-thermal', label: 'Thermal', color: 'other', file: HISTORIC_CAPACITY, where: { source: 'thermal' } },
              { key: 'historic-nuclear', label: 'Nuclear', color: 's3', file: HISTORIC_CAPACITY, where: { source: 'nuclear' } },
              { key: 'historic-hydro-and-res', label: 'Hydro and other renewables', color: 's5', file: HISTORIC_CAPACITY, where: { source: 'hydro-and-res' } },
              { key: 'coal', label: 'Coal, lignite', color: 'other', file: CAPACITY, where: { geography: 'india', source: ['coal-incl-lignite', 'coal'] } },
              { key: 'lignite', label: 'Coal, lignite', color: 'other', file: CAPACITY, where: { geography: 'india', source: 'lignite' } },
              { key: 'gas', label: 'Gas, diesel', color: 's6', file: CAPACITY, where: { geography: 'india', source: 'gas' } },
              { key: 'diesel', label: 'Gas, diesel', color: 's6', file: CAPACITY, where: { geography: 'india', source: 'diesel' } },
              { key: 'nuclear', label: 'Nuclear', color: 's3', file: CAPACITY, where: { geography: 'india', source: 'nuclear' } },
              { key: 'large-hydro', label: 'Large hydro', color: 's5', file: CAPACITY, where: { geography: 'india', source: 'large-hydro' } },
              { key: 'wind', label: 'Wind', color: 's2', file: CAPACITY, where: { geography: 'india', source: 'wind' } },
              { key: 'solar', label: 'Solar', color: 's8', file: CAPACITY, where: { geography: 'india', source: 'solar' } },
              { key: 'small-hydro', label: 'Other RE', color: 's4', file: CAPACITY, where: { geography: 'india', source: 'small-hydro' } },
              { key: 'bio-power', label: 'Other RE', color: 's4', file: CAPACITY, where: { geography: 'india', source: 'bio-power' } },
              { key: 'waste-to-energy', label: 'Other RE', color: 's4', file: CAPACITY, where: { geography: 'india', source: 'waste-to-energy' } },
            ],
            know: [
              'Installed capacity is the most power that the plants can supply at once.',
              'CEA reports December 1947 and 1950, selected March dates to 1997, then every March, and October 2026. Straight segments join the dates.',
              'From March 1998 to 2004, CEA lists wind under non-conventional energy. A renewables figure starts in March 2005, and broader totals in 2006.',
              'In March 2008, CEA moved 1,168 MW of small hydro from hydro into renewables. Earlier sections combine hydro and other renewables for this reason.',
              'CEA counted lignite under coal before March 2019. Other renewable energy (RE) includes small hydro, bio-power and waste-to-energy.',
              'CEA counts off-grid renewables from August 2021. CEA removed plants on long outage in April 2025 and August 2026.',
            ],
            processing: [
              'Use the CEA growth booklet to March 1997. Use the historical table in the March 2006 Executive Summary for March 1998 to March 2005.',
              'Use each March Executive Summary for 2006 to 2013. Group capacity by thermal, nuclear, and hydro and other renewables for all historical dates.',
              'Use the monthly Installed Capacity reports from March 2014. Check the historical and monthly figures in their overlap.',
            ],
            nextRelease: '2026-12-17 (estimated)',
          },
        },
        {
          chart: {
            kind: 'line',
            slug: 'non-fossil-capacity-share',
            title: 'Non-fossil share of power capacity in India, 1947 to 2026',
            subtitle: 'Non-fossil and other renewable shares of utility capacity, India.',
            punches: { office: 'CEA', unit: '%', period: '31 OCT 2026' },
            status: ['Method break'],
            note: 'Non-fossil is nuclear, hydro and other renewables. The other renewables line starts in March 2008.',
            sources: [CEA_GROWTH, CEA_EXECUTIVE, CEA_CAPACITY],
            format: { decimals: 2, unit: '%' },
            y: { min: 0, max: 60, step: 10 },
            breaks: CAPACITY_BREAKS,
            series: [
              { key: 'non-fossil-plan', label: 'Non-fossil, booklet', color: 's4', file: CAPACITY_SHARE, where: { series: 'non-fossil', method: 'plan' } },
              { key: 'non-fossil-legacy', label: 'Non-fossil, early archive', color: 's4', file: CAPACITY_SHARE, where: { series: 'non-fossil', method: 'legacy' } },
              { key: 'non-fossil-executive', label: 'Non-fossil, March summaries', color: 's4', file: CAPACITY_SHARE, where: { series: 'non-fossil', method: 'executive' } },
              { key: 'non-fossil-monthly', label: 'Non-fossil, grid only', color: 's4', file: CAPACITY_SHARE, where: { series: 'non-fossil', method: 'monthly' } },
              { key: 'non-fossil', label: 'Non-fossil', color: 's4', file: CAPACITY_SHARE, where: { series: 'non-fossil', method: 'off-grid' } },
              { key: 'renewables-executive', label: 'Other renewables, March summaries', color: 's8', file: CAPACITY_SHARE, where: { series: 'wind-solar-other-re', method: 'executive' } },
              { key: 'renewables-monthly', label: 'Other renewables, grid only', color: 's8', file: CAPACITY_SHARE, where: { series: 'wind-solar-other-re', method: 'monthly' } },
              { key: 'renewables-off-grid', label: 'Other renewables', color: 's8', file: CAPACITY_SHARE, where: { series: 'wind-solar-other-re', method: 'off-grid' } },
            ],
            know: [
              'The early CEA booklet gives selected dates. The archive begins its annual series in 1998.',
              'Other renewables include small hydro, wind, solar, bio-power and waste-to-energy. Large hydro is part of the non-fossil share.',
              'From March 1998 to 2004, the archive lists wind separately. March 2005 adds another renewables figure. CEA gives a broader renewables total from March 2006.',
              'The other renewables line starts in March 2008, when CEA moved small hydro into its renewables total.',
              'The monthly figures include revised renewable totals from March 2014. The March 2022 observation is the first to include off-grid capacity.',
              'CEA removed plants on long outage in April 2025 and August 2026.',
            ],
            processing: [
              'Add nuclear, hydro and other renewables. Divide by total capacity and multiply by 100.',
              'Use the CEA published shares for March and October 2026.',
              'Keep reporting methods in separate lines.',
            ],
            nextRelease: '2026-12-17 (estimated)',
          },
        },
      ],
    },
    {
      title: 'Which states have the most renewable power?',
      lede: 'Gujarat has the most renewable capacity, 56,289 MW, then Rajasthan, 52,134 MW. India had 3.03 lakh MW on 31 October 2026.',
      blocks: [
        { text: "The four states above 30,000 MW hold 56.84% of India's total. Tamil Nadu is fourth, with 30,401 MW." },
        {
          chart: {
            kind: 'states',
            slug: 'renewable-capacity-by-state',
            title: 'Renewable power capacity by state and UT, 31 Oct 2026',
            subtitle: 'Solar, wind, bio-power, small hydro and large hydro, 36 states and UTs.',
            punches: { office: 'MNRE', unit: 'MW', period: '31 OCT 2026' },
            note: 'MNRE places each plant in the state where it stands, so its figures differ from CEA state tables.',
            sources: [MNRE_STATES_2026_10],
            format: { decimals: 0 },
            bins: [500, 2000, 5000, 10000, 30000],
            data: { file: 'climate/renewable-capacity-by-state-2026-10.csv', where: { series: 'total_re', geography: STATES_AND_INDIA } },
            total: true,
            open: 'map',
            scale: 'seq',
            short: 'Renewable capacity',
            know: [
              'MNRE places each plant in the state where it stands. CEA\'s state tables add each state\'s share of central plants, so the two differ.',
              'MNRE lists 49.31 MW under "Others" with no state. It is in the India total but not on the map.',
              'Blank cells in the MNRE table stay blank. We do not set them to zero.',
            ],
            processing: [
              'We take total renewable capacity for India and each of the 36 states and UTs from the MNRE state-wise table as on 31 October 2026.',
              'We check that the state rows and "Others" add up to MNRE\'s India total of 3.03 lakh MW.',
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
    publisher:
      'The India Meteorological Department (IMD) measures rainfall and temperature. The Central Electricity Authority (CEA) counts utility power capacity. The Ministry of New and Renewable Energy (MNRE) publishes renewable capacity by state.',
    frequency:
      'Monsoon: daily in the season, with a season report after 30 September. Temperature: one statement each January. CEA and MNRE capacity: monthly, latest as on 31 Oct 2026.',
    revisions:
      'IMD may revise the 2026 monsoon figures in its final report. In 2017 MNRE revised 2014 to 2017 capacity, mainly by adding about 3,000 MW of captive bagasse cogeneration. We use the revised values.',
    breaks:
      'CEA moved small hydro into renewables in March 2008, used revised renewable totals from March 2014, counted lignite under coal before March 2019, and added off-grid renewables from August 2021.',
    coverage:
      'Rainfall: India, 4 regions and 36 subdivisions, which do not follow state lines. Capacity: utilities from 1947, selected dates to 1997, then each March. MNRE: all 36 states and UTs.',
    missing:
      'IMD publishes 2026 monsoon rain by subdivision, not by state. IMD, CEA and MNRE state no reuse licence.',
  },
  sources: [
    IMD_SEASON_2026,
    IMD_SDWR_2026_09_30,
    IMD_PUNE_ALL_INDIA,
    IMD_PUNE_RFSTATS_2026,
    IMD_PUNE_TEMPERATURE,
    IMD_CLIMATE_2025,
    CEA_GROWTH,
    CEA_EXECUTIVE,
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
