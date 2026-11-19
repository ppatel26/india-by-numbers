import type { Source, Topic } from '../types'

// Data: research/data/economy. tests/unit/prose.test.ts checks every number in the prose.

// ---------------------------------------------------------------- Period lists
// The two bases overlap. The board draws the old base only up to the break, so the old
// series pick lists its periods.

const fy = (y: number): string => `${y}-${String((y + 1) % 100).padStart(2, '0')}`

/** Financial-year quarters, "2012-13 Q1" to "2022-23 Q4". */
const fyQuarters = (from: number, to: number): string[] => {
  const out: string[] = []
  for (let y = from; y <= to; y++) for (let q = 1; q <= 4; q++) out.push(`${fy(y)} Q${q}`)
  return out
}

/** Months "YYYY-MM" from one month to another, both included. */
const months = (from: string, to: string): string[] => {
  const out: string[] = []
  let [y, m] = from.split('-').map(Number) as [number, number]
  for (;;) {
    const s = `${y}-${String(m).padStart(2, '0')}`
    out.push(s)
    if (s === to) return out
    if (++m > 12) {
      m = 1
      y++
    }
  }
}

// ---------------------------------------------------------------- Sources

const GDP_PRESS_NOTE: Source = {
  publisher: 'MoSPI (NSO)',
  release: 'Press Note on Quarterly Estimates of GDP for Q1 (April-June) 2026-27',
  released: '2026-08-31',
  url: 'https://www.mospi.gov.in/uploads/latestReleases/latest_release_1788172583113_d65a77cf-240e-4491-82ee-59f78618fa41_Press_Note_on_GDP_Estimates_for_Q1_2026-27.pdf',
}

// One board row for the whole eSankhyiki API (national accounts, state accounts,
// IIP), dated by its latest update. The link is the national accounts endpoint; the
// charts cite the endpoint each one uses.
const ESANKHYIKI: Source = {
  publisher: 'MoSPI (NSO)',
  release: 'eSankhyiki API: National Accounts (base 2011-12 and base 2022-23), state accounts, IIP',
  released: '2026-10-28',
  url: 'https://api.mospi.gov.in/api/nas/getNASData?base_year=2022-23&series=Current',
}

// Base 2022-23 is read from this URL; base 2011-12 (Current and Back series) from
// https://api.mospi.gov.in/api/nas/getNASData?base_year=2011-12. 31 Aug 2026 is the last
// update (the board's "updated 31 Aug 2026").
const NAS_API: Source = {
  publisher: 'MoSPI (NSO)',
  release: 'eSankhyiki API, National Accounts, base 2011-12 and base 2022-23',
  released: '2026-08-31',
  url: 'https://api.mospi.gov.in/api/nas/getNASData?base_year=2022-23&series=Current',
}

// The README gives the URL for indicator 25 (per capita NSDP). GSDP growth is
// indicator 26 of the same endpoint. 15 Apr 2026 is the state data release (RBI note).
const STATE_API: Source = {
  publisher: 'MoSPI (NSO)',
  release: 'eSankhyiki API, state accounts: per capita NSDP (indicator 25) and GSDP growth (indicator 26), base 2011-12',
  released: '2026-04-15',
  url: 'https://api.mospi.gov.in/api/nas/getNASData?base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=25',
}

const IIP_API: Source = {
  publisher: 'MoSPI (NSO)',
  release: 'eSankhyiki API, Index of Industrial Production (base 2011-12 and base 2022-23), monthly',
  released: '2026-10-28',
  url: 'https://api.mospi.gov.in/api/iip/getIIPData',
}

const IIP_2004_API: Source = {
  publisher: 'MoSPI (NSO)',
  release: 'eSankhyiki API, monthly Index of Industrial Production on base 2004-05, final series to March 2017',
  released: '2017-05-12',
  url: 'https://api.mospi.gov.in/api/iip/getIIPData?Format=JSON&base_year=2004-05&frequency=Monthly&category_code=4&limit=100&page=1',
}

const IIP_RELEASE: Source = {
  publisher: 'PIB for MoSPI',
  release: 'Quick Estimates of IIP and Use-Based Index for September 2026 (base 2022-23=100)',
  released: '2026-10-28',
  url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2329475',
}

// The board row covers Tables 9, 10 and 133. Its link is the Handbook page named
// in the README; the charts cite each table file below.
const RBI_HANDBOOK: Source = {
  publisher: 'RBI',
  release: 'Handbook of Statistics on Indian Economy 2025-26, Tables 9 and 10 (income per person) and 133 (exchange rate)',
  released: '2026-07-31',
  url: 'https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=Handbook%20of%20Statistics%20on%20Indian%20Economy',
}

// Table 9 (current prices) is this file; Table 10 (constant prices) is
// https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/10T_HBIE310720268B682995CC224C51B22FC6036E99B7D1.XLSX
const RBI_TABLE_9: Source = {
  publisher: 'RBI',
  release: 'Handbook of Statistics on Indian Economy 2025-26, Tables 9 and 10: Per Capita Net State Domestic Product, state-wise',
  released: '2026-07-31',
  url: 'https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/9T_HBIE31072026A3F18AB442CE4A23BEC929D29B406162.XLSX',
}

const RBI_TABLE_133: Source = {
  publisher: 'RBI',
  release: 'Handbook of Statistics on Indian Economy 2025-26, Table 133: Exchange Rate of the Rupee (financial year average and end-year)',
  released: '2026-07-31',
  url: 'https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/133T_HBIE3107202637939AFB4EE946719F742BEB8AEC5E18.XLSX',
}

const FBIL_ARCHIVE: Source = {
  publisher: 'RBI (FBIL)',
  release: 'Reference Rate Archive, US dollar, working days 1 Jan to 18 Nov 2026',
  released: '2026-11-18',
  url: 'https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx',
}

const RBI_ARCHIVE_LONG: Source = {
  publisher: 'RBI',
  release: 'Reference Rate Archive, US dollar, working days 25 Aug 1998 to 24 Jul 2018',
  released: 'not stated',
  url: 'https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx',
}

const FBIL_RATES: Source = {
  publisher: 'RBI (FBIL)',
  release: 'FBIL Reference Rates, US dollar, working days 10 Jul 2018 to 31 Dec 2025',
  released: 'not stated',
  url: 'https://www.fbil.org.in/',
}

const RBI_HOME: Source = {
  publisher: 'RBI',
  release: 'Home page, Current Rates: ₹93.3558 per US dollar at 1:00 pm (source FBIL)',
  released: '2026-11-18',
  url: 'https://www.rbi.org.in/',
}

const QUARTERLY = 'economy/gdp-growth-quarterly.csv'
const ANNUAL = 'economy/gdp-growth-annual.csv'
const SHARES = 'economy/gva-sector-shares.csv'
const IIP = 'economy/iip-growth-monthly.csv'
const IIP_NEXT = '2026-11-30'

/** Financial years 1950-51 to 2021-22: the 2011-12 base rows before the 2022-23 base starts. */
const BEFORE_2022_23 = Array.from({ length: 72 }, (_, i) => `${1950 + i}-${String((51 + i) % 100).padStart(2, '0')}`)

// ---------------------------------------------------------------- Topic

const topic: Topic = {
  slug: 'economy',
  name: 'Economy',
  hindi: 'अर्थव्यवस्था',
  question: "How fast is India's economy growing now, and how does that compare with the past 75 years?",
  standfirst: 'Real GDP grew by 7.8% in April to June 2026, up from 6.9% a year earlier.',
  figures: [
    { chart: 'gdp-growth-quarterly', series: 'base-2022-23', label: 'Real GDP growth' },
    { chart: 'iip-growth', series: 'base-2022-23', label: 'Industrial output (quick estimate)' },
    // LATER: the board's figure punch reads "FBIL via RBI"; a Figure has no office of its own.
    { chart: 'usd-inr-daily', label: 'Rupees per US dollar' },
  ],
  nextRelease: 'IIP for October 2026 and GDP for Q2 FY 2026-27, both 30 Nov 2026',
  parts: [
    {
      title: 'How fast is the economy growing?',
      lede: 'The fastest quarter on the new 2022-23 base was January to March 2026, at 8.6%. On the old base, output fell by 23.1% in April to June 2020, during the COVID-19 lockdown.',
      blocks: [
        {
          chart: {
            kind: 'columns',
            slug: 'gdp-growth-quarterly',
            title: 'Quarterly GDP growth in India, Q1 2012-13 to Q1 2026-27',
            subtitle:
              'Change in real GDP on the same quarter a year earlier, %. Base 2011-12 to Q4 2022-23; base 2022-23 from Q1 2023-24. Quarters follow the financial year (Q1 = April to June).',
            punches: { office: 'MoSPI', unit: '% y/y', period: 'Q1 2026-27' },
            status: ['Method break'],
            note: 'The two bases overlap from Q1 2023-24 to Q2 2025-26 and give different numbers for the same quarter (Q1 2025-26: 7.8% on base 2011-12, 6.9% on base 2022-23). The chart shows the new base where it exists. The marker shows the change of base between Q4 2022-23 and Q1 2023-24, two consecutive quarters.',
            sources: [GDP_PRESS_NOTE, NAS_API],
            format: { unit: '%', decimals: 1 },
            callouts: [
              { series: 'base-2011-12', x: '2020-21 Q1' },
              { series: 'base-2011-12', x: '2021-22 Q1' },
            ],
            // LATER: the board also labels 8.6% (Q4 2025-26) and 7.8% (Q1 2026-27); callouts at the right edge are cut off.
            series: [
              {
                key: 'base-2011-12',
                label: 'India, base 2011-12',
                color: 'ink',
                file: QUARTERLY,
                where: { base: '2011-12', period: fyQuarters(2012, 2022) },
              },
              { key: 'base-2022-23', label: 'India, base 2022-23', color: 'ink', file: QUARTERLY, where: { base: '2022-23' } },
            ],
            y: { step: 10 },
            breaks: [{ x: '2023-24 Q1', label: 'Base 2022-23 from Q1 2023-24' }],
            know: [
              'Real GDP is output at constant prices, so the rate shows growth after inflation. Each bar compares a quarter with the same quarter a year earlier.',
              'Quarters follow the financial year: Q1 is April to June.',
              'MoSPI moved GDP to base 2022-23 on 27 February 2026. The new base starts in 2022-23, so its growth rates start in Q1 2023-24. Earlier quarters are on base 2011-12.',
              'The two bases give different rates where they overlap, Q1 2023-24 to Q2 2025-26. For Q1 2025-26 they give 7.8% (base 2011-12) and 6.9% (base 2022-23).',
              'MoSPI revises recent quarters with each release. The release of 31 August 2026 revised Q1 2022-23 to Q4 2025-26.',
            ],
            processing: [
              'Fetch the quarterly real GDP growth rate (indicator 22) for both bases from the MoSPI eSankhyiki API.',
              'Check Q1 2026-27 against the press note of 31 Aug 2026.',
              'Draw base 2011-12 to Q4 2022-23 and base 2022-23 from Q1 2023-24, and mark the break.',
              'Keep the overlapping quarters on base 2011-12 in the data, and leave them off the chart.',
            ],
            nextRelease: '2026-11-30',
          },
        },
        { text: "India's economy grew by 7.8% in 2025-26. It shrank in six years since 1951. The largest fall was 5.78% in 2020-21, during COVID-19; the one before that was 5.24% in 1979-80." },
        {
          chart: {
            kind: 'columns',
            slug: 'gdp-growth-annual',
            title: 'Annual GDP growth in India, 1951-52 to 2025-26',
            subtitle:
              'Change in real GDP on the year before, %. 1951-52 to 2022-23 derived by us from constant-price GDP levels (base 2011-12); 2023-24 to 2025-26 as published (base 2022-23).',
            punches: { office: 'MoSPI', unit: '% y/y', period: '2025-26' },
            status: ['Method break'],
            note: 'Derived. Growth for 1951-52 to 2022-23 is computed from published constant-price GDP; it matches RBI Handbook Table 227 for 2019-20 to 2022-23 (3.87%, -5.78%, 9.69%, 7.61%). 2025-26 is a Provisional Estimate and 2024-25 a First Revised Estimate. The revision of 31 August 2026 raised 2023-24 to 7.3% and 2024-25 to 7.2%.',
            sources: [NAS_API],
            format: { unit: '%' },
            callouts: [
              { series: 'base-2011-12', x: '1979-80' },
              { series: 'base-2011-12', x: '2020-21' },
            ],
            // LATER: the board also labels 7.8% in 2025-26; callouts at the right edge are cut off.
            series: [
              { key: 'base-2011-12', label: 'India, base 2011-12 (derived)', color: 'ink', file: ANNUAL, where: { base: '2011-12' } },
              { key: 'base-2022-23', label: 'India, base 2022-23', color: 'ink', file: ANNUAL, where: { base: '2022-23' }, note: 'estimate' },
            ],
            y: { min: -8, max: 12, step: 4 },
            breaks: [{ x: '2023-24', label: 'Base 2022-23 from 2023-24' }],
            know: [
              'Each bar is the change in real GDP for the financial year (April to March) on the year before.',
              'For 1951-52 to 2022-23 we derive the rate from the constant-price GDP levels that MoSPI publishes on base 2011-12. For 2023-24 to 2025-26 the rate is as MoSPI publishes it on base 2022-23.',
              'The derived rates match RBI Handbook Table 227 for 2019-20 to 2022-23.',
              '2025-26 is a Provisional Estimate and 2024-25 a First Revised Estimate. Both can change.',
              'The RBI Handbook of 31 July 2026 has older rates for 2023-24 (7.21%) and 2024-25 (7.1%). The release of 31 August 2026 revised them to 7.3% and 7.2%.',
            ],
            processing: [
              'Fetch GDP at constant 2011-12 prices from the MoSPI eSankhyiki API: the back series (1950-51 to 2011-12) and the current series (2011-12 to 2022-23, latest estimate for each year).',
              'Compute growth on the year before from the levels, for 1951-52 to 2022-23.',
              'Check the derived rates against RBI Handbook Table 227 for 2019-20 to 2022-23.',
              'Add the published growth rates on base 2022-23 for 2023-24 to 2025-26, and mark the break.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How has the economy moved from farming to services?',
      lede: "In 1950-51 farming, forestry, fishing and mining made up 54% of India's output and services 31%. By 2025-26 services made up 54% and the primary sector 20%.",
      blocks: [
        {
          chart: {
            kind: 'area',
            slug: 'gva-sector-shares',
            title: 'Shares of the economy by sector, India, 1950-51 to 2025-26',
            subtitle:
              'Share of gross value added (GVA) at current prices, %. Derived by us from published GVA by industry. Base 2011-12 to 2021-22; base 2022-23 from 2022-23.',
            punches: { office: 'MoSPI', unit: '% of GVA', period: '2025-26' },
            status: ['Method break'],
            note: 'Derived from published GVA. Primary is agriculture, livestock, forestry and fishing, plus mining and quarrying. Industry (secondary) is manufacturing, utilities and construction. Services (tertiary) is total GVA minus the two. In 2022-23 the bases differ: primary 20.12% on base 2011-12, 22.04% on base 2022-23. Shares may not add to 100 because of rounding.',
            sources: [NAS_API],
            format: { unit: '%', decimals: 2 },
            // Each sector is two series, one per base; both bases have a 2022-23 row, so the
            // 2011-12 series stop at 2021-22 and the stack holds 100% in every year.
            // LATER: the board labels the 1950-51 shares on the plot; area callouts sit at the raw value, not the stack.
            // LATER: area labels every series at the last year, so the base 2011-12 series print "No data".
            series: [
              { key: 'primary-2011-12', label: 'Primary, base 2011-12', color: 's4', file: SHARES, where: { sector: 'primary', base: '2011-12', period: BEFORE_2022_23 } },
              { key: 'primary-2022-23', label: 'Primary', color: 's4', file: SHARES, where: { sector: 'primary', base: '2022-23' } },
              { key: 'secondary-2011-12', label: 'Industry, base 2011-12', color: 's6', file: SHARES, where: { sector: 'secondary', base: '2011-12', period: BEFORE_2022_23 } },
              { key: 'secondary-2022-23', label: 'Industry', color: 's6', file: SHARES, where: { sector: 'secondary', base: '2022-23' } },
              { key: 'tertiary-2011-12', label: 'Services, base 2011-12', color: 's5', file: SHARES, where: { sector: 'tertiary', base: '2011-12', period: BEFORE_2022_23 } },
              { key: 'tertiary-2022-23', label: 'Services', color: 's5', file: SHARES, where: { sector: 'tertiary', base: '2022-23' } },
            ],
            breaks: [{ x: '2022-23', label: 'Base 2022-23', before: 'Base 2011-12' }],
            y: { min: 0, max: 100, step: 25 },
            know: [
              "Each share is the sector's part of gross value added (GVA) at current prices. The three shares add to 100%.",
              'Primary is agriculture, livestock, forestry and fishing, plus mining and quarrying. Industry is manufacturing, utilities and construction. Services is the rest.',
              'We derive the shares from the GVA levels that MoSPI publishes. The grouping follows the MoSPI press note of 31 August 2026.',
              'The 2022-23 base starts in 2022-23. That year has a value on both bases, and they differ by about 2 points for the primary sector.',
            ],
            processing: [
              'Fetch GVA by industry at current prices (indicator 1) from the MoSPI eSankhyiki API: back series and current series on base 2011-12, and current series on base 2022-23.',
              'Add the industries into the primary and secondary sectors, and take services as total GVA minus the two.',
              'Divide each sector by total GVA for the year.',
              'Keep each base as a separate series and mark the break at 2022-23.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'Which states are richest and poorest per person?',
      lede: "In 2024-25 income per person was highest in Sikkim, at ₹6.46 lakh, and in Goa, at ₹6.37 lakh. It was lowest in Bihar, at ₹69,211: less than a ninth of Sikkim's. The national figure was ₹2.05 lakh.",
      blocks: [
        { text: 'Income per person was above the national figure in 19 of the 32 states and UTs with data. Four had more than ₹4 lakh a year: Sikkim, Goa, Delhi and Chandigarh.' },
        {
          chart: {
            kind: 'states',
            slug: 'income-per-person-by-state',
            title: 'Income per person by state and UT, 2024-25',
            subtitle:
              'Net state domestic product per person, rupees a year, current prices, 2024-25. State accounts are on the 2011-12 base. Darker means higher.',
            punches: { office: 'MoSPI', unit: '₹ a year', period: '2024-25' },
            note: 'India is per capita net national income, the comparator the RBI uses. 32 of 36 states and UTs: there is no 2024-25 figure for Nagaland (latest 2023-24), Ladakh, Lakshadweep, and Dadra and Nagar Haveli and Daman and Diu. Assam and Haryana: MoSPI data as on 1 August 2025, from the RBI Handbook.',
            sources: [STATE_API, RBI_TABLE_9],
            format: { unit: '₹', decimals: 0 },
            data: { file: 'economy/per-capita-nsdp-by-state.csv', where: { price_basis: 'current prices' } },
            open: 'map',
            scale: 'seq',
            better: 'high',
            short: 'Income per person',
            know: [
              'Income per person is net state domestic product (NSDP) per person, in rupees a year at current prices. It is not household income.',
              'The India value is per capita net national income, the comparator the RBI uses in the same table.',
              'MoSPI has no 2024-25 value for Nagaland (latest 2023-24: ₹1.55 lakh), Ladakh, Lakshadweep, and Dadra and Nagar Haveli and Daman and Diu. Assam and Haryana are MoSPI data as on 1 August 2025, from the RBI Handbook.',
              'State accounts are on base 2011-12. From 2019-20 Jammu and Kashmir covers the union territory only, without Ladakh, so its values before and after do not compare.',
            ],
            processing: [
              'Fetch per capita NSDP at current prices for 2024-25 (indicator 25, base 2011-12) from the MoSPI eSankhyiki API.',
              'Add Assam, Haryana and the all-India per capita net national income from Tables 9 and 10 of the RBI Handbook 2025-26.',
              'Mark the four states and UTs with no 2024-25 value as no data.',
            ],
            nextRelease: 'not announced',
          },
        },
        { text: 'Arunachal Pradesh grew fastest in 2024-25, at 13.8%, followed by Goa (12.0%) and Mizoram (11.3%). The Andaman and Nicobar Islands grew slowest, at 4.5%.' },
        {
          chart: {
            kind: 'states',
            slug: 'gsdp-growth-by-state',
            title: 'Economic growth by state and UT, 2024-25',
            subtitle:
              'Change in real gross state domestic product (GSDP) on 2023-24, %, constant 2011-12 prices. State accounts are on the 2011-12 base. India: GDP growth on base 2011-12 (6.4%), not the 7.2% headline on base 2022-23.',
            punches: { office: 'MoSPI', unit: '% y/y', period: '2024-25' },
            note: 'India is a reference line, not a rank. 30 of 36 states and UTs: the MoSPI release has no 2024-25 figure for Assam, Haryana, Nagaland, Ladakh, Lakshadweep, and Dadra and Nagar Haveli and Daman and Diu. Only 15 states have 2025-26 figures, so the chart shows 2024-25. State accounts are on base 2011-12; do not compare them with the national headline on base 2022-23.',
            sources: [STATE_API],
            format: { unit: '%', decimals: 1 },
            data: { file: 'economy/gsdp-growth-by-state.csv' },
            open: 'chart',
            // The board opens this chart on the ranked bar; the map is not drawn. 'div'
            // colours the gap from India, as on the other growth and rate maps.
            scale: 'div',
            better: 'high',
            short: 'GSDP growth',
            know: [
              'Growth is the change in real gross state domestic product (GSDP) on the year before, at constant 2011-12 prices.',
              'State accounts are still on base 2011-12. The India value, 6.4%, is GDP growth on the same base, not the 7.2% headline on base 2022-23.',
              'MoSPI has no 2024-25 growth for Assam, Haryana, Nagaland, Ladakh, Lakshadweep, and Dadra and Nagar Haveli and Daman and Diu.',
              'Only 15 states have 2025-26 figures, so the chart shows 2024-25.',
            ],
            processing: [
              'Fetch the GSDP growth rate for 2024-25 (indicator 26, base 2011-12) from the MoSPI eSankhyiki API.',
              'Take the India value from GDP growth on base 2011-12 (Provisional Estimate) in the same API.',
              'Mark the six states and UTs with no 2024-25 value as no data.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How is industry doing month by month?',
      lede: 'Industrial output grew by 6.7% in September 2026, with manufacturing up 7.6% and electricity and gas up 11.2%. Mining fell by 6.2%.',
      blocks: [
        {
          chart: {
            kind: 'line',
            slug: 'iip-growth',
            title: 'Industrial production growth in India, April 2006 to September 2026',
            subtitle:
              'Change in the Index of Industrial Production (IIP) on the same month a year earlier. Each base year has a separate line.',
            punches: { office: 'MoSPI', unit: '% y/y', period: 'SEP 2026' },
            status: ['Provisional', 'Method break'],
            note: 'The lines switch to base 2011-12 in April 2013 and to base 2022-23 in April 2024. MoSPI gives no rate for April 2021 on base 2011-12.',
            sources: [IIP_2004_API, IIP_API, IIP_RELEASE],
            format: { unit: '%', decimals: 1 },
            // The CSV has no row for April 2021, so the line breaks there (a two-month step).
            // LATER: the board labels the gap "No data, Apr 2021"; a span label there collides with the May 2021 callout and the break label.
            series: [
              {
                key: 'base-2004-05',
                label: 'India, base 2004-05',
                color: 'slate',
                file: 'economy/iip-growth-base-2004-05.csv',
                where: { period: months('2006-04', '2013-03') },
              },
              {
                key: 'base-2011-12',
                label: 'India, base 2011-12',
                color: 'ink',
                file: IIP,
                where: { category: 'General', base: '2011-12', period: months('2013-04', '2024-03') },
              },
              { key: 'base-2022-23', label: 'India, base 2022-23', color: 'ink', file: IIP, where: { category: 'General', base: '2022-23' } },
            ],
            y: { min: -60, max: 30, step: 15 },
            breaks: [
              { x: '2013-04', before: 'Base 2004-05', label: 'Base 2011-12' },
              { x: '2024-04', label: 'Base 2022-23' },
            ],
            callouts: [
              { series: 'base-2011-12', x: '2020-04' },
              { series: 'base-2011-12', x: '2021-05' },
              { series: 'base-2022-23', x: '2026-09' },
            ],
            know: [
              'The IIP measures the volume of output in mining, manufacturing, and electricity and gas. Each point compares a month with the same month a year earlier.',
              'September 2026 is a quick estimate. MoSPI revises it with the next release: August 2026 went from 8.0% to 7.8%.',
              'The published year-on-year rates on base 2004-05 and base 2011-12 differ in all 48 months that overlap.',
              'The 2011-12 and 2022-23 bases overlap from April 2024 to March 2026 and give different rates.',
              'Output fell 57.3% in April 2020 during the COVID-19 lockdown. It grew 27.6% in May 2021 from a low level.',
            ],
            processing: [
              'Read the monthly general index and growth rate for each base from the MoSPI eSankhyiki API.',
              'Check September 2026 against the PIB release of 28 Oct 2026.',
              'Omit the first year of rates on each base because the API compares those months with the base-year average.',
              'Compare the rates where the bases overlap. Use the latest base that has a year-on-year rate and mark each switch.',
            ],
            nextRelease: IIP_NEXT,
          },
        },
        { text: 'August 2026 is now final at 7.8%, down from the 8.0% quick estimate. Mining fell in both months: by 4.6% in August and 6.2% in September.' },
        {
          chart: {
            kind: 'bars',
            slug: 'iip-growth-by-sector',
            title: 'Industrial production growth by sector, August and September 2026',
            subtitle:
              'Change in the IIP (base 2022-23) on the same month a year earlier, %. September 2026 quick estimate; August 2026 final.',
            punches: { office: 'MoSPI', unit: '% y/y', period: 'SEP 2026' },
            status: ['Provisional'],
            note: 'The overall index comes first; the three sectors after it are not ranked. MoSPI revises each quick estimate the next month.',
            sources: [IIP_RELEASE],
            format: { unit: '%', decimals: 1 },
            by: 'category',
            series: [
              { key: 'sep-2026', label: 'Sep 2026 (quick estimate)', color: 'ink', file: IIP, where: { base: '2022-23', period: '2026-09' } },
              { key: 'aug-2026', label: 'Aug 2026 (final)', color: 'other', file: IIP, where: { base: '2022-23', period: '2026-08' } },
            ],
            order: ['General', 'Manufacturing', 'Electricity & Gas Supply', 'Mining & Quarrying'],
            labels: {
              General: 'All industry (general index)',
              Manufacturing: 'Manufacturing',
              'Electricity & Gas Supply': 'Electricity and gas',
              'Mining & Quarrying': 'Mining and quarrying',
            },
            know: [
              'Each bar compares a month with the same month a year earlier, on base 2022-23.',
              'September 2026 is a quick estimate and will be revised with the October release. August 2026 is final.',
              'The new base, 2022-23, gives valid growth rates from April 2024. Older months are on base 2011-12.',
            ],
            processing: [
              'Fetch the sector indices and growth rates for August and September 2026 from the MoSPI eSankhyiki API (getIIPData, base 2022-23).',
              'Check them against the PIB release of 28 Oct 2026.',
              'Show September and August side by side for each sector, with the general index first.',
            ],
            nextRelease: IIP_NEXT,
          },
        },
      ],
    },
    {
      title: 'How many rupees does a US dollar cost?',
      lede: 'A US dollar cost ₹12.78 on average in 1986-87 and ₹88.31 in 2025-26. At the end of March 2026 it cost ₹94.65.',
      blocks: [
        { text: 'On 18 November 2026 a dollar cost ₹93.3558, up from ₹89.9792 on 1 January. The rupee was weakest on 20 May 2026, at ₹96.8441 per dollar.' },
        {
          periods: [
            {
              label: '2026, daily',
              short: 'Daily',
              chart: {
                kind: 'line',
                slug: 'usd-inr-daily',
                title: 'The rupee in 2026, day by day',
                subtitle: 'FBIL reference rate, rupees per US dollar, working days, 1 January to 18 November 2026. A higher line means a weaker rupee.',
                punches: { office: 'FBIL', unit: '₹ per US$', period: '18 NOV 2026' },
                note: 'The rate for 18 November 2026 is as at 1:00 pm on the RBI home page.',
                sources: [FBIL_ARCHIVE, RBI_HOME],
                format: { unit: '₹', decimals: 2 },
                series: [
                  { key: 'fbil', label: 'FBIL reference rate', color: 'ink', file: 'economy/usd-inr-daily-2026.csv', x: 'date' },
                ],
                y: { min: 88, max: 98, step: 2 },
                callouts: [
                  { series: 'fbil', x: '2026-01-01' },
                  { series: 'fbil', x: '2026-05-20' },
                ],
                know: [
                  'The FBIL reference rate is the benchmark rate for the rupee against the US dollar, set by Financial Benchmarks India each working day.',
                  'A higher value means a weaker rupee: more rupees for one dollar.',
                  'The rate for 18 November 2026 is as at 1:00 pm, from the RBI home page.',
                  'Weekends and market holidays have no rate.',
                ],
                processing: [
                  'Read the US dollar rate for each working day from 1 January to 18 November 2026 in the RBI Reference Rate Archive (source FBIL).',
                  'Check 18 November 2026 against the "Current Rates" box on the RBI home page.',
                  "Keep the publisher's four decimals in the data. Days with no rate have no row.",
                ],
                nextRelease: '2026-11-18',
              },
            },

            {
              label: 'Since 1998, monthly',
              short: 'Monthly',
              chart: {
                kind: 'line',
                slug: 'usd-inr-monthly',
                title: 'The rupee since 1998, month by month',
                subtitle: 'Monthly average of the daily reference rate, rupees per US dollar, September 1998 to November 2026. A higher line means a weaker rupee.',
                punches: { office: 'RBI', unit: '₹ per US$', period: 'NOV 2026' },
                status: ['Provisional'],
                note: 'RBI reference rate to 9 July 2018, FBIL reference rate from 10 July 2018. November 2026 is 1 to 18 November. February 2021 is the average of 8 days: FBIL gives no rate for 1 to 15 or 19 February 2021.',
                sources: [RBI_ARCHIVE_LONG, FBIL_RATES, FBIL_ARCHIVE],
                format: { unit: '₹', decimals: 2 },
                series: [{ key: 'monthly', label: 'Rupees per US dollar', color: 'ink', file: 'economy/usd-inr-monthly.csv' }],
                y: { min: 0, max: 100, step: 20 },
                callouts: [
                  { series: 'monthly', x: '1998-09' },
                  { series: 'monthly', x: '2008-01' },
                  { series: 'monthly', x: '2026-07' },
                ],
                know: [
                  'Each value is the average of the reference rates for the working days of that month. A higher value means a weaker rupee.',
                  'The rupee was strongest in January 2008, at an average of ₹39.37 per dollar, and weakest in July 2026, at ₹95.82.',
                  'RBI set the reference rate until 9 July 2018. Financial Benchmarks India (FBIL) has set it since 10 July 2018.',
                  'November 2026 is a part month and can change.',
                ],
                processing: [
                  'Read the US dollar rate for each working day from 25 August 1998 to 24 July 2018 in the RBI Reference Rate Archive.',
                  'Read the FBIL US dollar reference rate for each working day from 10 July 2018 to 31 December 2025 from fbil.org.in. For 2026, use the daily series of chart "The rupee in 2026, day by day".',
                  'Take each day from one source: RBI to 9 July 2018, FBIL after. Average the days of each month. August 1998 starts on the 25th, so the series starts in September 1998.',
                  'Check: the average of all days in each financial year from 1999-00 to 2025-26 is within ₹0.08 of the financial-year average in RBI Handbook Table 133.',
                ],
                nextRelease: '2026-11-18',
              },
            },
            {
              label: 'Since 1986-87, yearly',
              short: 'Yearly',
              chart: {
                kind: 'line',
                slug: 'usd-inr-annual',
                title: 'Rupees per US dollar, 1986-87 to 2025-26',
                subtitle: 'Average exchange rate for the financial year, rupees per US dollar, 1986-87 to 2025-26.',
                punches: { office: 'RBI', unit: '₹ per US$', period: '2025-26' },
                note: 'To 1991-92, official rates; from 1992-93, FEDAI indicative rates; from May 2012, RBI reference rates; from 10 July 2018, FBIL reference rates.',
                sources: [RBI_TABLE_133],
                format: { unit: '₹', decimals: 2 },
                series: [
                  {
                    key: 'average',
                    label: 'Rupees per US dollar',
                    color: 'ink',
                    file: 'economy/usd-inr-annual.csv',
                    where: { measure: 'financial-year average' },
                  },
                ],
                y: { min: 0, max: 100, step: 20 },
                callouts: [
                  { series: 'average', x: '1986-87' },
                  { series: 'average', x: '1991-92', label: '1991-92 and 1992-93: devaluation, then a market rate' },
                  { series: 'average', x: '2025-26' },
                ],
                know: [
                  'Each value is the average rate for the financial year (April to March). A higher value means a weaker rupee.',
                  'The rate source changes over time: official rates to 1991-92, FEDAI indicative rates from 1992-93, RBI reference rates from May 2012 and FBIL reference rates from 10 July 2018.',
                  'The jumps in 1991-92 and 1992-93 reflect the 1991 devaluation and the move to a market rate.',
                  'The same table gives the rate at the end of each financial year: ₹94.65 at the end of March 2026.',
                ],
                processing: [
                  'Read Table 133 of the RBI Handbook of Statistics on Indian Economy 2025-26 (31 Jul 2026).',
                  'Keep the financial-year average and the end-of-year rate as separate series; the chart shows the average.',
                  "Keep the publisher's four decimals in the data; the chart shows two.",
                ],
                nextRelease: 'not announced',
              },
            },
          ],
        },
      ],
    },
  ],
  // LATER: the About band's side line ("How each economy figure is made, where it breaks, and what is missing.") has no field.
  about: {
    publisher:
      'The National Statistics Office (NSO), MoSPI, publishes the national accounts (GDP, GVA by industry), the state accounts and the Index of Industrial Production (IIP). The Reserve Bank of India (RBI) publishes the exchange rate tables; the daily reference rate comes from Financial Benchmarks India (FBIL).',
    frequency:
      'GDP: quarterly. MoSPI released the Q1 2026-27 estimates on 31 August 2026. IIP: monthly, on the 28th; the October 2026 release is expected on 28 November 2026. State accounts: as states report. RBI Handbook: once a year (latest 31 July 2026). FBIL reference rate: each working day.',
    revisions:
      'The release of 31 August 2026 revised 2022-23 to 2025-26. The RBI Handbook of 31 July 2026 has the earlier growth rates (7.21% for 2023-24, 7.1% for 2024-25); this page uses the newer 7.3% and 7.2%. 2025-26 is a Provisional Estimate. MoSPI revises each IIP quick estimate the next month: August 2026 went from 8.0% to 7.8%.',
    breaks:
      'GDP moved to base 2022-23 on 27 February 2026; earlier years stay on base 2011-12, and every chart marks the break. State accounts are still on base 2011-12, so state growth does not compare with the national 2022-23 headline. IIP moved to base 2022-23; its growth rates are valid from April 2024. Derived: annual growth before 2023-24 (chart 1.2) and all sector shares (chart 2.1).',
    coverage:
      'All India for GDP, GVA, IIP and the exchange rate. Income per person covers 32 of the 36 states and UTs for 2024-25; GSDP growth covers 30. India in chart 3.1 is per capita net national income, the comparator the RBI uses. From 2019-20 Jammu and Kashmir covers the union territory only, without Ladakh.',
    missing:
      'MoSPI has no 2024-25 income per person for Nagaland (latest 2023-24: ₹1.55 lakh), Ladakh, Lakshadweep, and Dadra and Nagar Haveli and Daman and Diu, and no 2024-25 GSDP growth for those four plus Assam and Haryana. Only 15 states have 2025-26 figures. MoSPI gives no IIP rate for April 2021 on the 2011-12 base. No publisher states a reuse licence for these data.',
  },
  sources: [GDP_PRESS_NOTE, ESANKHYIKI, IIP_RELEASE, RBI_HANDBOOK, FBIL_ARCHIVE, RBI_HOME],
  related: [
    { label: 'Prices: Consumer price inflation since 2012', href: '/charts/cpi-inflation/' },
    { label: 'Prices: RBI repo rate since 2001', href: '/charts/repo-rate/' },
    { label: 'Jobs: Unemployment rate by state', href: '/charts/unemployment-by-state/' },
    { label: 'States: Tamil Nadu profile', href: '/states/tamil-nadu/' },
    { label: 'How we check: derived values', href: '/how-we-check/#hallmark' },
  ],
}

export default topic
