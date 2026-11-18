import type { Source, Topic } from '../types'

// Data: research/data/prices. tests/unit/prose.test.ts checks every number in the prose.

// ---------------------------------------------------------------- Sources

const CPI_RELEASE: Source = {
  publisher: 'MoSPI (NSO)',
  release: 'Press Release of Consumer Price Index on base 2024=100 for October 2026',
  released: '2026-11-12',
  url: 'https://www.mospi.gov.in/uploads/latestReleases/latest_release_1794478693814_7c90e80f-9e64-4aa4-b44a-1dc727b0fed9_Press_Release_of_CPI_for_October_2026_.pdf',
}

// One board row covers both endpoints. The base 2012=100 series is read from
// https://api.mospi.gov.in/api/cpi/getCPIIndex (final series, last month December 2025).
const CPI_API: Source = {
  publisher: 'MoSPI (NSO)',
  release: 'eSankhyiki API: CPI base 2024=100 (getCPIData) and base 2012=100 (getCPIIndex)',
  released: '2026-11-12',
  url: 'https://api.mospi.gov.in/api/cpi/getCPIData',
}

// The board row covers Tables 40 and 236. Its link is the Handbook page named in the
// README; the charts cite each table file below.
const RBI_HANDBOOK: Source = {
  publisher: 'RBI',
  release: 'Handbook of Statistics on Indian Economy 2025-26, Table 40 (policy rates) and Table 236 (CPI-IW, Labour Bureau data)',
  released: '2026-07-31',
  url: 'https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=Handbook%20of%20Statistics%20on%20Indian%20Economy',
}

const RBI_TABLE_40: Source = {
  publisher: 'RBI',
  release: 'Handbook of Statistics on Indian Economy 2025-26, Table 40: Major Monetary Policy Rates and Reserve Requirements',
  released: '2026-07-31',
  url: 'https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/40T_HBIE31072026FF3E894445944DA8A3C011F1653F999A.XLSX',
}

const RBI_TABLE_236: Source = {
  publisher: 'RBI',
  release: 'Handbook of Statistics on Indian Economy 2025-26, Table 236: Consumer Price Index (Average of Months), Annual Variation (Labour Bureau and NSO data)',
  released: '2026-07-31',
  url: 'https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/236T_HBIE310720260380CC1834364289AF00337B7FFD8336.XLSX',
}

const RBI_HIKE: Source = {
  publisher: 'RBI',
  release: "Governor's Statement: repo rate raised to 5.50%",
  released: '2026-10-07',
  url: 'https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63744',
}

// One README row for three statements (8 Apr, 5 Jun, 5 Aug 2026). This is the
// 5 Aug one; the others are prid=62515 (8 Apr) and prid=62864 (5 Jun).
const RBI_HOLDS: Source = {
  publisher: 'RBI',
  release: "Governor's Statements, 8 Apr, 5 Jun and 5 Aug 2026: repo rate unchanged at 5.25%",
  released: '2026-08-05',
  url: 'https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63288',
}

// A live page. 25 Mar 2026 is the date the RBI retained the target (board row).
const RBI_TARGET: Source = {
  publisher: 'RBI',
  release: 'Monetary Policy Framework: inflation target 4%, band 2% to 6%, 1 Apr 2026 to 31 Mar 2031',
  released: '2026-03-25',
  url: 'https://www.rbi.org.in/scripts/fs_overview.aspx?fn=2752',
}

// One row for the ten monthly releases that give the CFPI (each month's final value is in the next release).
const CFPI_RELEASES: Source = {
  publisher: 'MoSPI (NSO)',
  release: 'Press Releases of Consumer Price Index on base 2024=100, January to October 2026: Consumer Food Price Index (CFPI)',
  released: '2026-11-12',
  url: 'https://www.mospi.gov.in/uploads/latestReleases/latest_release_1794478693814_7c90e80f-9e64-4aa4-b44a-1dc727b0fed9_Press_Release_of_CPI_for_October_2026_.pdf',
}

const CPI_NEXT = '2026-12-14'

const MONTHLY = 'prices/cpi-inflation-monthly.csv'
const DIVISIONS_LATEST = 'prices/cpi-inflation-by-division-latest.csv'
const DIVISIONS_2026 = 'prices/cpi-inflation-by-division-2026.csv'
const GROUPS_2012 = 'prices/cpi-inflation-by-group-2012-base.csv'
const RURAL_URBAN = 'prices/cpi-inflation-rural-urban.csv'

// ---------------------------------------------------------------- Topic

const topic: Topic = {
  slug: 'prices',
  name: 'Prices',
  hindi: 'कीमतें',
  question: 'How fast are prices rising in India now, and how does that compare with the RBI target?',
  standfirst: "Consumer prices rose by 6.09% in the year to October 2026, above the RBI's upper limit of 6%.",
  figures: [
    { chart: 'cpi-inflation', series: 'base-2024', label: 'Consumer price inflation' },
    { chart: 'cpi-inflation-by-division-2026', series: 'cfpi', label: 'Consumer Food Price Index (CFPI)' },
    { chart: 'repo-rate', label: 'RBI policy repo rate', period: 'From 7 Oct 2026' },
  ],
  nextRelease: 'CPI for November 2026, expected 14 Dec 2026',
  parts: [
    {
      title: 'How fast are prices rising?',
      lede: 'The RBI aims for 4%, within a band of 2% to 6%. Before October 2026, inflation was last above that band in October 2024, at 6.21%. In October 2025 it was 0.25%, the lowest since the series began in January 2012.',
      blocks: [
        {
          chart: {
            kind: 'line',
            slug: 'cpi-inflation',
            title: 'Inflation in India, January 2012 to October 2026',
            subtitle:
              'Annual change in the Consumer Price Index, rural and urban combined, %, January 2012 to October 2026. Base 2012=100 to December 2025; base 2024=100 from January 2026.',
            punches: { office: 'MoSPI', unit: '% y/y', period: 'OCT 2026' },
            status: ['Provisional', 'Method break'],
            note: 'MoSPI gives no rate for June to December 2013 or for April and May 2020 (lockdown). The two bases use different baskets and weights, so the lines are not joined.',
            sources: [CPI_RELEASE, CPI_API, RBI_TARGET],
            format: { unit: '%' },
            series: [
              // The base 2012=100 rows include the empty months (June to December 2013,
              // April and May 2020), so the line breaks there.
              { key: 'base-2012', label: 'India, base 2012=100', color: 'ink', file: MONTHLY, where: { base: '2012=100' } },
              { key: 'base-2024', label: 'India, base 2024=100', color: 'ink', file: MONTHLY, where: { base: '2024=100' } },
            ],
            y: { min: 0, max: 12, step: 2 },
            band: { from: 2, to: 6, label: 'RBI tolerance band 2% to 6%' },
            refs: [{ y: 4, label: 'Target 4%' }],
            breaks: [{ x: '2026-01', label: 'Method break: new base 2024=100' }],
            callouts: [{ series: 'base-2024', x: '2026-10' }],
            know: [
              'This is the change in consumer prices on the same month a year earlier, for rural and urban India combined.',
              'October 2026 is provisional. MoSPI finalises it with the November release, due on 14 December 2026.',
              'CPI moved to base 2024=100 in January 2026, with a new basket and new weights. The 2012=100 series ends in December 2025. The two series are not joined.',
              'MoSPI gives no rate for June to December 2013: the 2012-base back series stops in May 2013 and the current series starts its rates in January 2014. It gives none for April and May 2020, the lockdown months.',
              'The RBI target is 4%, with a band of 2% to 6%, retained for 1 April 2026 to 31 March 2031.',
            ],
            processing: [
              'Fetch the all-India general index and rate for each month from the MoSPI eSankhyiki API: base 2012=100 (back series to May 2013, current series from January 2014) and base 2024=100 (from January 2026).',
              'Check October 2026 against the press release of 12 Nov 2026.',
              'Keep the months with no published rate as empty rows. Do not fill them in.',
              'Keep the two bases as separate series and mark the break at January 2026.',
              'Draw the RBI target and band from the Monetary Policy Framework page.',
            ],
            nextRelease: CPI_NEXT,
          },
        },
        { text: 'Inflation for industrial workers reached 13.1% in 1998-99 and 12.4% in 2009-10. In 2024-25 it was 3.4%, and the CPI Combined was 4.6%.' },
        {
          chart: {
            kind: 'line',
            slug: 'cpi-inflation-long-run',
            title: 'Inflation in India over the long run, 1993-94 to 2025-26',
            subtitle:
              'Change in the average Consumer Price Index for the financial year, %. CPI for industrial workers (CPI-IW) from 1993-94; CPI Combined from 2012-13 to 2024-25.',
            punches: { office: 'RBI', unit: '% y/y', period: '2025-26' },
            note: 'CPI-IW covers industrial workers only and is compiled by the Labour Bureau. Its base changed in 2005-06 and 2020-21; RBI links the series. CPI Combined for 2025-26 spans two bases (1.7% for April to December 2025 on 2012=100; 3.1% for January to March 2026 on 2024=100), so we do not plot one value for that year.',
            sources: [RBI_TABLE_236],
            format: { unit: '%', decimals: 1 },
            series: [
              {
                key: 'cpi-iw',
                label: 'CPI for industrial workers (CPI-IW)',
                color: 's2',
                file: 'prices/cpi-annual-inflation-long-run.csv',
                where: { series: 'CPI-IW (industrial workers)' },
              },
              {
                key: 'cpi-combined',
                label: 'CPI Combined',
                color: 'ink',
                file: 'prices/cpi-annual-inflation-long-run.csv',
                // The empty note drops the two split 2025-26 rows.
                where: { series: 'CPI Combined (all India)', note: '' },
              },
            ],
            y: { min: 0, max: 14, step: 2 },
            callouts: [
              { series: 'cpi-iw', x: '1998-99' },
              { series: 'cpi-iw', x: '2009-10' },
              { series: 'cpi-iw', x: '2025-26' },
              { series: 'cpi-combined', x: '2024-25' },
            ],
            know: [
              'Each value is the change in the average index for the financial year (April to March) on the year before, not a change on the same month.',
              'CPI-IW covers industrial workers only. The Labour Bureau compiles it. It is a different measure from the CPI Combined.',
              'CPI-IW changed base in 2005-06 (2001=100) and 2020-21 (2016=100). RBI links the series with factors given in the table notes.',
              'CPI Combined starts in 2012-13. For 2025-26 RBI gives two values: 1.7% for April to December 2025 (base 2012=100) and 3.1% for January to March 2026 (base 2024=100).',
            ],
            processing: [
              'Read Table 236 of the RBI Handbook of Statistics on Indian Economy 2025-26 (31 Jul 2026).',
              'Keep CPI-IW and CPI Combined as separate series.',
              'Keep the two part-year CPI Combined values for 2025-26 in the data, and leave them off the line.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'Which states have the highest inflation?',
      lede: 'In October 2026 inflation was highest in Puducherry, at 7.96%, and lowest in Mizoram, at 2.85%. Among the large states, Tamil Nadu (7.29%), Telangana (7.26%) and Andhra Pradesh (7.25%) had the highest rates.',
      blocks: [
        { text: "All eight north-eastern states had lower inflation than India's 6.09%. Eight states and UTs were more than 0.5 percentage points above it, led by Puducherry (7.96%)." },
        {
          chart: {
            kind: 'states',
            slug: 'cpi-inflation-by-state',
            title: 'Inflation by state and UT, October 2026',
            subtitle:
              'Annual change in the Consumer Price Index (2024=100), rural and urban combined, %, 36 states and UTs, October 2026. Colour shows the gap from India.',
            punches: { office: 'MoSPI', unit: '% y/y', period: 'OCT 2026' },
            status: ['Provisional'],
            note: 'Each state and UT is one equal tile; the grid does not show borders. MoSPI says state indices use thinner samples than the national index.',
            sources: [CPI_RELEASE, CPI_API],
            format: { unit: '%' },
            data: { file: 'prices/cpi-inflation-by-state.csv', where: { period: '2026-10', sector: 'combined' } },
            open: 'map',
            scale: 'div',
            better: 'low',
            short: 'Inflation',
            timeline: { column: 'period', values: ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10'] },
            // From the chart page design, "What you should know about this indicator".
            know: [
              'October 2026 is provisional. MoSPI finalises it with the November release, due on 14 December 2026.',
              'CPI moved to a new base, 2024=100, in January 2026, with a new basket and new weights. Rates on the old base, 2012=100, end in December 2025. Do not compare them with this chart without the break.',
              "Each value combines rural and urban prices. In October 2026 India's rural rate was 6.63% and its urban rate 5.41%. Chandigarh has no rural index, so its combined rate equals its urban rate, 5.23%.",
              'State indices rest on thinner samples than the national index. MoSPI asks users to treat state-level item indices with caution.',
            ],
            // From the chart page design, "How we process this figure".
            processing: [
              'Fetch the state general index and rate for each month and sector from the MoSPI eSankhyiki API (base 2024=100).',
              'Check October 2026 against Annexure III of the press release of 12 Nov 2026.',
              'Keep rural, urban and combined as separate series. The map shows combined.',
              "Place each state in a band by its gap from India's rate, in percentage points.",
            ],
            nextRelease: CPI_NEXT,
          },
        },
      ],
    },
    {
      title: 'What is driving inflation?',
      lede: 'Food and drink, 36.75% of the basket, rose by 8.51% in the year to October 2026. Personal care and miscellaneous goods rose by 10.14%, and restaurants and accommodation by 10.06%. Health rose by only 2.05%.',
      blocks: [
        {
          chart: {
            kind: 'bars',
            slug: 'cpi-inflation-by-division',
            title: 'Inflation by spending division, India, October 2026',
            subtitle:
              "Annual change in the Consumer Price Index (2024=100), rural and urban combined, %, October 2026. Weight is the division's share of the basket, %. Divisions follow COICOP 2018.",
            punches: { office: 'MoSPI', unit: '% y/y', period: 'OCT 2026' },
            status: ['Provisional'],
            note: 'The release has no division 12. Division 13 is personal care, social protection and miscellaneous goods and services. MoSPI names gold and silver jewellery among the fastest-rising items (silver jewellery: 52.39%).',
            sources: [CPI_RELEASE],
            format: { unit: '%' },
            by: 'division',
            // LATER: the board prints a "Weight" column (weight_combined) beside each bar; 'bars' has no value column.
            refs: [{ value: 6.09, label: 'All items 6.09%' }],
            labels: {
              'Personal care, social protection and miscellaneous goods and services': 'Personal care and miscellaneous',
              'Furnishings, household equipment and routine household maintenance': 'Furnishings and household equipment',
              'Housing, water, electricity, gas and other fuels': 'Housing, water and fuels',
            },
            series: [
              {
                key: 'oct-2026',
                label: 'Annual change, Oct 2026',
                color: 'ink',
                file: DIVISIONS_LATEST,
                where: {
                  sector: 'combined',
                  division_code: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '13'],
                },
              },
            ],
            know: [
              'Each bar is the change in prices for one of the 12 spending divisions on October 2025, for rural and urban India combined.',
              'The divisions follow COICOP 2018 and are new with base 2024=100. They do not match the six groups of the 2012 series.',
              "The weight is the division's share of the basket, from Annexure I of the press release. Food and beverages has the largest weight, 36.75%.",
              'October 2026 is provisional. MoSPI finalises it with the November release, due on 14 December 2026.',
            ],
            processing: [
              'Fetch the all-India division indices and rates for October 2026 from the MoSPI eSankhyiki API (base 2024=100).',
              'Check each rate against the press release of 12 Nov 2026, and take the weights from its Annexure I.',
              'Sort the divisions by rate, highest first, and show the general index as the reference.',
            ],
            nextRelease: CPI_NEXT,
          },
        },
        { text: 'Headline inflation rose in every month of 2026, from 2.74% in January to 6.09% in October. Of the four largest divisions, food and beverages rose fastest, to 8.51%.' },
        {
          chart: {
            kind: 'line',
            slug: 'cpi-inflation-by-division-2026',
            title: 'Inflation by spending division, India, 2026',
            subtitle:
              'Annual change in the Consumer Price Index (2024=100), rural and urban combined, %, January to October 2026. The four largest divisions by weight. Same scale in every panel.',
            punches: { office: 'MoSPI', unit: '% y/y', period: 'OCT 2026' },
            status: ['Provisional'],
            sources: [CPI_API, CFPI_RELEASES],
            format: { unit: '%' },
            // LATER: each panel on the board has a sub-label with the division weight ("Weight 36.75%").
            series: [
              { key: 'food', label: 'Food and beverages', color: 'ink', file: DIVISIONS_2026, where: { sector: 'combined', division_code: '01' } },
              { key: 'cfpi', label: 'Food price index (CFPI)', color: 's8', file: 'prices/cfpi-inflation-2026.csv', where: { sector: 'combined' } },
              { key: 'housing', label: 'Housing, water, electricity, gas and other fuels', color: 'ink', file: DIVISIONS_2026, where: { sector: 'combined', division_code: '04' } },
              { key: 'transport', label: 'Transport', color: 'ink', file: DIVISIONS_2026, where: { sector: 'combined', division_code: '07' } },
              { key: 'clothing', label: 'Clothing and footwear', color: 'ink', file: DIVISIONS_2026, where: { sector: 'combined', division_code: '03' } },
              { key: 'all-items', label: 'All items', color: 'other', file: DIVISIONS_2026, where: { sector: 'combined', division_code: '00' } },
            ],
            y: { step: 5 },
            panels: [
              { label: 'Food and beverages', series: ['food', 'cfpi', 'all-items'] },
              { label: 'Housing, water and fuels', series: ['housing', 'all-items'] },
              { label: 'Transport', series: ['transport', 'all-items'] },
              { label: 'Clothing and footwear', series: ['clothing', 'all-items'] },
            ],
            callouts: [
              { series: 'food', x: '2026-10' },
              // The CFPI label sits at September so that it does not cover the food label at October.
              { series: 'cfpi', x: '2026-09', label: 'CFPI' },
              { series: 'housing', x: '2026-10' },
              { series: 'transport', x: '2026-10' },
              { series: 'clothing', x: '2026-10' },
            ],
            know: [
              'Each line is the change in prices for one division on the same month a year earlier, for rural and urban India combined.',
              'The four divisions shown carry the largest weights: food and beverages (36.75%), housing, water and fuels (17.66%), transport (8.80%), and clothing and footwear (6.38%).',
              'The series starts in January 2026, the first month on base 2024=100. January to September are final; October is provisional.',
              'All items is the general index, 6.09% in October 2026.',
              'The Consumer Food Price Index (CFPI) covers food items only, with its own weights. It is not the same as the food and beverages division: 8.94% against 8.51% in October 2026.',
            ],
            processing: [
              'Fetch the all-India division indices and rates from the MoSPI eSankhyiki API, one request per month and sector (base 2024=100).',
              'Pick the four divisions with the largest weights in Annexure I of the press release.',
              'Draw each division with the general index in the same panel, on one shared scale.',
              'Read the CFPI for each month from the monthly press releases: the final value from the next release, and October 2026 (provisional) from the release of 12 Nov 2026.',
            ],
            nextRelease: CPI_NEXT,
          },
        },
        { text: 'Food prices swing far more than other prices. On the old 2012 base, food and drink inflation peaked at 12.16% in December 2019 and fell to -3.72% in October 2025. Fuel and light peaked at 14.35% in October 2021.' },
        {
          chart: {
            kind: 'line',
            slug: 'cpi-inflation-by-group-2012',
            title: 'Inflation by group, India, 2014 to 2025 (old 2012 base)',
            subtitle:
              'Annual change in the Consumer Price Index (2012=100), rural and urban combined, %, January 2014 to December 2025. Four of the 2012 groups. Same scale in every panel. These groups do not match the 2024 divisions in 3.1 and 3.2.',
            punches: { office: 'MoSPI', unit: '% y/y', period: 'DEC 2025' },
            // The board cites the 2012=100 group indices, final series to December
            // 2025 (getCPIIndex). The API row carries the latest update date.
            sources: [CPI_API],
            format: { unit: '%' },
            // LATER: each panel on the board has a sub-label with the peak ("Peak 12.16 · Dec 2019"); the peaks are callouts here.
            series: [
              { key: 'food', label: 'Food and beverages', color: 'ink', file: GROUPS_2012, where: { sector: 'combined', group: 'Food and Beverages' } },
              { key: 'fuel', label: 'Fuel and light', color: 'ink', file: GROUPS_2012, where: { sector: 'combined', group: 'Fuel and Light' } },
              { key: 'housing', label: 'Housing (urban only)', color: 'ink', file: GROUPS_2012, where: { sector: 'combined', group: 'Housing' } },
              { key: 'clothing', label: 'Clothing and footwear', color: 'ink', file: GROUPS_2012, where: { sector: 'combined', group: 'Clothing and Footwear' } },
              { key: 'general', label: 'All items (General)', color: 'other', file: GROUPS_2012, where: { sector: 'combined', group: 'General' } },
            ],
            y: { step: 5 },
            panels: [
              { label: 'Food and beverages', series: ['food', 'general'] },
              { label: 'Fuel and light', series: ['fuel', 'general'] },
              { label: 'Housing (urban only)', series: ['housing', 'general'] },
              { label: 'Clothing and footwear', series: ['clothing', 'general'] },
            ],
            callouts: [
              { series: 'food', x: '2019-12' },
              { series: 'food', x: '2025-10' },
              { series: 'fuel', x: '2021-10' },
              { series: 'housing', x: '2014-05' },
              { series: 'clothing', x: '2022-09' },
            ],
            know: [
              'These are the six groups of the 2012=100 series; the chart shows four of them and the general index. The series ends in December 2025.',
              'The 2012 groups do not map one to one onto the 2024 divisions. "Food and beverages" exists in both, with different contents and weights.',
              'Housing in the 2012 series is an urban index only.',
              'MoSPI gives no general index rate for April and May 2020, the lockdown months.',
            ],
            processing: [
              'Fetch the all-India group indices and rates for January 2014 to December 2025 from the MoSPI eSankhyiki API (getCPIIndex, base 2012=100, current series), one month per request.',
              'Check that every month and group appears once.',
              'Draw each group with the general index in the same panel, on one shared scale.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'Is inflation higher in villages or in towns?',
      lede: 'In October 2026 prices rose faster in villages than in towns: 6.63% in rural areas and 5.41% in urban areas. Rural inflation has been higher than urban in every month since February 2026.',
      blocks: [
        {
          chart: {
            kind: 'line',
            slug: 'cpi-inflation-rural-urban',
            title: 'Rural and urban inflation in India, January 2014 to October 2026',
            subtitle:
              'Annual change in the Consumer Price Index for rural and urban areas, %, January 2014 to October 2026. Base 2012=100 to December 2025; base 2024=100 from January 2026.',
            punches: { office: 'MoSPI', unit: '% y/y', period: 'OCT 2026' },
            status: ['Provisional', 'Method break'],
            note: 'MoSPI gives no rate for April and May 2020 (lockdown). The two bases use different baskets and weights, so the lines are not joined at January 2026. Rural and urban combined: 6.09% in October 2026.',
            sources: [CPI_RELEASE, CPI_API],
            format: { unit: '%' },
            series: [
              { key: 'rural-2012', label: 'Rural, base 2012=100', color: 's4', file: RURAL_URBAN, where: { sector: 'rural', base: '2012=100' } },
              { key: 'rural-2024', label: 'Rural', color: 's4', file: RURAL_URBAN, where: { sector: 'rural', base: '2024=100' } },
              { key: 'urban-2012', label: 'Urban, base 2012=100', color: 's5', file: RURAL_URBAN, where: { sector: 'urban', base: '2012=100' } },
              { key: 'urban-2024', label: 'Urban', color: 's5', file: RURAL_URBAN, where: { sector: 'urban', base: '2024=100' } },
            ],
            y: { min: -2, max: 10, step: 2 },
            breaks: [{ x: '2026-01', label: 'Method break: new base 2024=100' }],
            callouts: [
              { series: 'rural-2024', x: '2026-10' },
              { series: 'urban-2024', x: '2026-10' },
            ],
            know: [
              'Rural and urban are separate price indices with their own baskets and weights. The combined index is not a simple average of the two.',
              'October 2026 is provisional. MoSPI finalises it with the November release, due on 14 December 2026.',
              'CPI moved to base 2024=100 in January 2026. The 2012=100 series ends in December 2025, and the lines do not join across the break.',
              'MoSPI gives no rate for April and May 2020, the lockdown months.',
            ],
            processing: [
              'Fetch the all-India rural and urban general indices and rates from the MoSPI eSankhyiki API: base 2012=100 to December 2025, base 2024=100 from January 2026.',
              'Check October 2026 against the press release of 12 Nov 2026.',
              'Keep each sector and base as a separate series and mark the break at January 2026.',
            ],
            nextRelease: CPI_NEXT,
          },
        },
      ],
    },
    {
      title: 'How has the RBI responded?',
      lede: 'The RBI raised its repo rate by 0.25 percentage points to 5.50% on 7 October 2026, the first rise since February 2023. It had cut the rate from 6.50% to 5.25% during 2025.',
      blocks: [
        {
          chart: {
            kind: 'line',
            slug: 'repo-rate',
            title: 'RBI policy repo rate, June 2008 to November 2026',
            subtitle: 'Policy repo rate, % a year, by effective date of each change, 12 June 2008 to 17 November 2026.',
            punches: { office: 'RBI', unit: '% a year', period: '7 OCT 2026' },
            note: 'The repo rate became the single policy rate on 3 May 2011. The MPC kept the rate at 5.25% in April, June and August 2026.',
            sources: [RBI_TABLE_40, RBI_HIKE, RBI_HOLDS],
            format: { unit: '%', decimals: 2 },
            step: true,
            extendTo: '2026-11-17',
            // The note gives the full text: the repo rate became the single policy rate on 3 May 2011.
            markers: [{ x: '2011-05-03', label: 'Single policy rate' }],
            series: [
              { key: 'repo', label: 'RBI policy repo rate', color: 'ink', file: 'prices/repo-rate.csv', x: 'effective_date' },
            ],
            y: { min: 0, max: 10, step: 2 },
            callouts: [
              { series: 'repo', x: '2008-07-30', label: '9.00%, 30 Jul 2008' },
              { series: 'repo', x: '2020-05-22', label: '4.00%, May 2020 to May 2022' },
              { series: 'repo', x: '2023-02-08', label: '6.50%, 8 Feb 2023' },
            ],
            know: [
              "The repo rate is the RBI's policy rate: the rate at which it lends to banks. The Monetary Policy Committee (MPC) sets it.",
              'Each point is a change, dated by the day it took effect. The rate holds until the next change.',
              'The repo rate became the single policy rate on 3 May 2011 (Table 40, note 5).',
              'The data start in June 2008. Older rates are in earlier editions of the RBI Handbook.',
            ],
            processing: [
              'Read every repo rate change from 12 June 2008 to 5 December 2025 in Table 40 of the RBI Handbook of Statistics on Indian Economy 2025-26.',
              "Add the rise to 5.50% from the Governor's Statement of 7 October 2026.",
              "Check the 2026 meetings with no change against the Governor's Statements of 8 April, 5 June and 5 August 2026.",
              'Check the current rate against the RBI home page on 17 November 2026.',
            ],
            nextRelease: '2026-12-04',
          },
        },
      ],
    },
  ],
  // LATER: the About band's side line ("How each prices figure is made, where it breaks, and what is missing.") has no field.
  about: {
    intro:
      'All values are as published. We read every source on 17 November 2026. The October 2026 values match the MoSPI CPI press release of 12 November 2026, table by table.',
    publisher:
      'The National Statistics Office (NSO), MoSPI, compiles the Consumer Price Index (CPI) for rural, urban and combined India, for each state and UT, and for 12 spending divisions. The Reserve Bank of India (RBI) sets the repo rate and publishes CPI for industrial workers (CPI-IW) from the Labour Bureau in its Handbook of Statistics.',
    frequency:
      'CPI: monthly. MoSPI released the October 2026 figures on 12 November 2026. The November 2026 release is expected on 14 December 2026. Repo rate: set at each Monetary Policy Committee meeting. CPI-IW long-run table: once a year, in the RBI Handbook (latest 31 July 2026).',
    revisions:
      'The latest month is provisional. MoSPI makes October 2026 final with the November release. September 2026 is final.',
    breaks:
      'From January 2026 the CPI uses base 2024=100, a new basket and new weights, and 12 COICOP 2018 divisions in place of 6 groups. The 2012=100 series ends in December 2025. We show both and do not join them. The 2012 groups (chart 3.3) do not match the 2024 divisions (3.1, 3.2). CPI-IW changed base in 2005-06 and 2020-21; RBI links it.',
    coverage:
      'All India, rural, urban and combined. All 36 states and UTs have a combined value for October 2026. State indices use thinner samples than the national index, and MoSPI asks users to read state item indices with caution. CPI-IW covers industrial workers only.',
    missing:
      'MoSPI gives no inflation rate for June to December 2013 in either 2012-base series, and none for April and May 2020, the lockdown months. Repo rates before April 2008 are in earlier editions of the RBI Handbook. No publisher states a reuse licence for these data.',
  },
  sources: [CPI_RELEASE, CFPI_RELEASES, CPI_API, RBI_HANDBOOK, RBI_HIKE, RBI_TARGET],
  related: [
    { label: 'Economy: Industrial production, month by month', href: '/charts/iip-growth/' },
    { label: 'Economy: Rupees per US dollar since 1986-87', href: '/charts/usd-inr-annual/' },
    { label: 'Economy: Quarterly GDP growth', href: '/charts/gdp-growth-quarterly/' },
    { label: 'States: Tamil Nadu profile', href: '/states/tamil-nadu/' },
    { label: 'How we check: method breaks', href: '/how-we-check/#part-3' },
  ],
}

export default topic
