import type { Source, Topic } from '../types'
import { WDI, WDI_ABOUT, comparison } from '../international'

// Data: research/data/defence (README) and research/data/international (the WDI comparison).
// tests/unit/prose.test.ts checks every number in the prose.
//
// Council decisions (docs/design-direction.md, "Defence"): the RBI series, which leaves out
// defence pensions, is the only long series of spending. The PIB budget split, which counts
// pensions, stands alone in its own chart. Never join the two. Print PIB's figures only, not its
// words such as "record" or "skyrocket".

// ---------------------------------------------------------------- Sources

const T89: Source = {
  publisher: 'RBI',
  release: 'Handbook of Statistics on Indian Economy 2025-26, Table 89: Major Heads of Expenditure of the Central Government',
  released: '2026-07-31',
  url: 'https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=23914',
}

const PIB_MOD = (id: string, release: string, released: string, capture: string): Source => ({
  publisher: 'PIB for the Ministry of Defence',
  release,
  released,
  url: `https://web.archive.org/web/${capture}/https://www.pib.gov.in/PressReleasePage.aspx?PRID=${id}`,
})

const EXPORTS_2023 = PIB_MOD('1912885', 'Press release 1912885 on defence exports, 2016-17 to 2022-23', '2023-04-01', '20250718200616')
const EXPORTS_2025 = PIB_MOD('2117348', 'Press release 2117348 on defence exports in 2024-25', '2025-04-01', '20261127053745')
const EXPORTS_2026 = PIB_MOD('2248124', 'Press release 2248124 on defence exports in 2025-26', '2026-04-02', '20261127054446')

const BUDGET_2026: Source = {
  publisher: 'PIB for the Ministry of Defence',
  release: 'Backgrounder: Defence in Union Budget 2026-27',
  released: '2026-02-03',
  url: 'https://static.pib.gov.in/WriteReadData/specificdocs/documents/2026/feb/doc202623778301.pdf',
}

// ---------------------------------------------------------------- Data

const SPEND = 'defence/defence-spending-1987-2027.csv'
const EXPORTS = 'defence/defence-exports.csv'
const SPLIT = 'defence/defence-budget-split-2026-27.csv'

const CHECKED = '2026-11-27'
const LAKH_CRORE = { unit: '₹', multiply: 1e7, scale: 'lakh crore', decimals: 2 } as const
const CRORE = { unit: '₹', multiply: 1e7, scale: 'crore', decimals: 0 } as const

const PENSION_KNOW =
  'RBI counts defence spending without defence pensions and the civil spending of the Ministry of Defence. The Ministry\'s own budget total counts both, so it is larger. This page does not join the two.'

const ESTIMATE_KNOW =
  'The figures for 2025-26 are revised estimates and those for 2026-27 budget estimates. The other years are accounts. The tooltip names the status of each year.'

const YEAR_KNOW = 'Each year is a financial year, April to March.'

const topic: Topic = {
  slug: 'defence',
  name: 'Defence',
  hindi: 'रक्षा',
  question: 'How much does India spend on defence, and how much does it export?',
  standfirst:
    'The central government spent {{₹4507330000000 lakh-crore 2}} on defence in 2024-25, 9.69% of its spending, not counting pensions. Defence exports were {{₹384240000000 crore 0}} in 2025-26.',
  figures: [
    { chart: 'defence-spending', series: 'total', x: '2024-25', label: 'Defence spending, revenue and capital' },
    { chart: 'defence-share-of-spending', series: 'share', x: '2024-25', label: 'Share of central government spending' },
    { chart: 'defence-exports', series: 'all', label: 'Defence exports' },
  ],
  nextRelease: 'Defence exports for 2026-27: April 2027 (estimated)',
  parts: [
    {
      title: 'How much does India spend on defence?',
      lede: 'Defence spending was {{₹4507330000000 lakh-crore 2}} in 2024-25, up from {{₹119680000000 crore 0}} in 1987-88, at current prices. Its share of central government spending fell from 17.53% to 9.69%.',
      blocks: [
        {
          chart: {
            kind: 'columns',
            slug: 'defence-spending',
            checked: CHECKED,
            title: 'Defence spending by the central government, 1987-88 to 2026-27',
            subtitle: 'Revenue spending on defence and capital outlay on defence each financial year, ₹ lakh crore at current prices. Defence pensions are not included.',
            punches: { office: 'RBI', unit: '₹ lakh crore', period: '2026-27 BE' },
            note: '2025-26 is a revised estimate and 2026-27 a budget estimate. Current prices: no allowance for inflation.',
            sources: [T89],
            format: LAKH_CRORE,
            stacked: true,
            series: [
              { key: 'revenue', label: 'Revenue spending: pay, stores, running costs', color: 's5', file: SPEND, where: { measure: 'revenue expenditure: defence' }, note: 'status' },
              { key: 'capital', label: 'Capital outlay: equipment and buildings', color: 's6', file: SPEND, where: { measure: 'capital outlay: defence' }, note: 'status' },
              // Derived: the sum of the two. The figures, the table and the prose; not drawn.
              { key: 'total', label: 'Defence spending', color: 'ink', hidden: true, file: SPEND, where: { measure: 'defence: revenue and capital' }, note: 'status' },
            ],
            know: [
              PENSION_KNOW,
              'Revenue spending pays for pay and allowances, stores and the running of the forces. Capital outlay buys equipment and builds assets.',
              ESTIMATE_KNOW,
              'The values are at current prices. Part of the rise since 1987-88 is inflation.',
              YEAR_KNOW,
            ],
            processing: [
              'Read columns 3 (revenue expenditure on defence) and 9 (capital outlay on defence) of RBI Handbook Table 89.',
              'Add the two for each year: the total is a derived value. RBI gives no total for defence.',
              'Check that revenue and capital spending add up to total expenditure, within 1 crore of rounding, for every year. All do.',
              'Show the values in ₹ lakh crore. RBI publishes ₹ crore.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          chart: {
            kind: 'line',
            slug: 'defence-share-of-spending',
            checked: CHECKED,
            title: 'Defence as a share of central government spending, 1987-88 to 2026-27',
            subtitle: 'Revenue spending and capital outlay on defence as a share of total central government expenditure, each financial year.',
            punches: { office: 'RBI', unit: '% of spending', period: '2026-27 BE' },
            note: 'A derived share: defence spending from Table 89 divided by total expenditure from the same table. Defence pensions are not included.',
            sources: [T89],
            format: { unit: '%', decimals: 2 },
            series: [{ key: 'share', label: 'Defence share of spending', color: 'ink', file: SPEND, where: { measure: 'defence: share of total expenditure' }, note: 'status' }],
            know: [
              PENSION_KNOW,
              'Total expenditure includes interest payments, which take a large and rising share of central spending. A falling defence share can mean that other spending grew faster.',
              'In 2020-21 total expenditure rose by more than a quarter, with pandemic spending, so the defence share fell that year.',
              ESTIMATE_KNOW,
            ],
            processing: [
              'Read columns 3, 9 and 10 of RBI Handbook Table 89.',
              'Divide revenue spending plus capital outlay on defence by total expenditure, and show the result to two decimals. This is a derived value.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'In the 2026-27 budget, 26.40% of the Ministry of Defence allocation is for pay and allowances, 27.95% for capital spending and 21.84% for defence pensions.',
        },
        {
          chart: {
            kind: 'bars',
            slug: 'defence-budget-split-2026-27',
            checked: CHECKED,
            title: 'How the Ministry of Defence budget is split, 2026-27',
            subtitle: 'Share of the Ministry of Defence allocation in the Union Budget 2026-27, by head, budget estimate.',
            punches: { office: 'PIB', unit: '% of allocation', period: '2026-27 BE' },
            note: 'This total counts defence pensions and civil organisations, unlike the RBI series above. Budget estimate.',
            sources: [BUDGET_2026],
            format: { unit: '%', decimals: 2 },
            by: 'head',
            rowHead: 'Head',
            labels: {
              'capital expenditure': 'Capital spending',
              'revenue: pay and allowances': 'Pay and allowances',
              'defence pensions': 'Defence pensions',
              'revenue: sustenance and operational preparedness': 'Upkeep and operations',
              'civil organisations': 'Civil organisations',
            },
            series: [{ key: 'share', label: 'Share of allocation', color: 's5', file: SPLIT, x: 'head', where: { period: '2026-27' } }],
            know: [
              'The Ministry of Defence allocation for 2026-27 is ₹7.85 lakh crore, the backgrounder says. It counts defence pensions and the civil organisations of the Ministry.',
              'Upkeep and operations is revenue spending on "sustenance and operational preparedness": stores, fuel, repairs and running costs.',
              'PIB gives the split as shares only. We print the shares and do not work out rupee values.',
            ],
            processing: [
              'Read the sentence that splits the allocation in the PIB backgrounder "Defence in Union Budget 2026-27" (3 Feb 2026).',
              'Check that the five shares add up to 100. They do.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How much defence equipment does India export?',
      lede: 'Defence exports were {{₹384240000000 crore 0}} in 2025-26, up from {{₹15210000000 crore 0}} in 2016-17, at current prices. Defence public sector undertakings exported {{₹210710000000 crore 0}} of it.',
      blocks: [
        {
          chart: {
            kind: 'columns',
            slug: 'defence-exports',
            checked: CHECKED,
            title: 'Defence exports from India, 2016-17 to 2025-26',
            subtitle: 'Value of defence exports each financial year, ₹ crore at current prices, by public and private exporters where the Ministry of Defence gives the split.',
            punches: { office: 'PIB', unit: '₹ crore', period: '2025-26' },
            note: 'PIB gives no split by exporter before 2023-24. Current prices: no allowance for inflation.',
            sources: [EXPORTS_2023, EXPORTS_2025, EXPORTS_2026],
            format: CRORE,
            stacked: true,
            series: [
              { key: 'total-only', label: 'All exporters, no split given', color: 'slate', file: EXPORTS, where: { exporter: 'all exporters', period: ['2016-17', '2017-18', '2018-19', '2019-20', '2020-21', '2021-22', '2022-23'] } },
              { key: 'dpsu', label: 'Defence public sector undertakings', color: 's5', file: EXPORTS, where: { exporter: 'DPSUs' } },
              { key: 'private', label: 'Private sector', color: 's6', file: EXPORTS, where: { exporter: 'private sector' } },
              // The figures, the table and the prose; not drawn.
              { key: 'all', label: 'All exporters', color: 'ink', hidden: true, file: EXPORTS, where: { exporter: 'all exporters' } },
            ],
            know: [
              'The Department of Defence Production counts the exports it authorises. The figures come from Ministry of Defence press releases on PIB.',
              'The 2016-17 to 2022-23 values come from one release of 1 April 2023, which gives 2022-23 as "approx. Rs 16,000 crore" in its text and 15,920 in its table. We use the table.',
              'Defence public sector undertakings (DPSUs) are the companies the Ministry owns. The private sector is every other exporter.',
              YEAR_KNOW,
            ],
            processing: [
              'Read the table in PIB release 1912885 (1 Apr 2023) for 2016-17 to 2022-23, and the text of releases 2117348 (1 Apr 2025) and 2248124 (2 Apr 2026) for 2023-24 to 2025-26.',
              'pib.gov.in refuses scripts, so we read each release from an Internet Archive copy, named in the source link.',
              'Check that the DPSU and private values add up to each total, and that the 2024-25 values in the 2026 release equal the 2025 release. All agree.',
            ],
            nextRelease: '2027-04-02 (estimated)',
          },
        },
      ],
    },
    {
      title: 'How large are India\'s armed forces?',
      lede: 'Armed forces were 0.58% of India\'s labour force in 2020, by the World Bank\'s figures, against 0.79% for the world and 1.25% for Pakistan.',
      blocks: [
        {
          chart: comparison({
            slug: 'armed-forces-comparison',
            checked: CHECKED,
            file: 'wdi-armed-forces-share-of-labour-force.csv',
            title: 'Armed forces as a share of the labour force, India and other countries, 1990 and 2020',
            subtitle: 'Active armed forces personnel, including paramilitary forces that could support them, as a share of the labour force.',
            unit: '% of labour force',
            latest: '2020',
            format: { unit: '%', decimals: 2 },
            sources: [WDI.armedForces],
            know: [
              'The World Bank takes the count of armed forces from The Military Balance of the International Institute for Strategic Studies (IISS). It counts paramilitary forces when their training and equipment suggest they could support the regular forces.',
              'The labour force is everyone who works or looks for work, by the ILO definition, so the share changes when the labour force grows.',
              'WDI has no value for any country after 2020.',
            ],
            processing: ['Show each value to two decimals.', 'Rank the rows by the 2020 value.'],
          }),
        },
      ],
    },
  ],
  about: {
    intro:
      'Spending here comes from the RBI, which reprints the central government\'s budget accounts and leaves out defence pensions. Exports and the budget split come from Ministry of Defence releases on PIB. The armed forces comparison comes from the World Bank. No state figures exist for defence.',
    publisher:
      ['The RBI publishes the Handbook of Statistics on Indian Economy each year; Table 89 gives the major heads of central government spending from the Union Budget documents. PIB publishes Ministry of Defence press releases and backgrounders.', WDI_ABOUT].join(' '),
    frequency:
      'RBI Handbook: yearly (latest 31 Jul 2026). Union Budget: each February. Defence exports: a release each April for the year just ended. WDI: several updates a year; this page uses the update of 11 Nov 2026.',
    revisions:
      'Budget estimates become revised estimates and then accounts. PIB has given different figures for the same year in different releases, for example defence production in 2024-25. We keep the figure of each release we name.',
    breaks:
      'No method break in the RBI series. The RBI series leaves out defence pensions; the PIB budget split counts them, so the two are never joined.',
    coverage:
      'All India. Central government spending only: the states do not spend on defence. Exports by value, not by item or buyer.',
    missing:
      'No spending at constant prices; no military spending comparison between countries, because the World Bank series for it carries SIPRI terms that need permission; no defence production series, because PIB gives only scattered years; no imports. The Ministry of Defence and the Department of Defence Production websites ask for permission by mail before reuse.',
  },
  sources: [T89, BUDGET_2026, EXPORTS_2023, EXPORTS_2025, EXPORTS_2026, WDI.armedForces],
  related: [
    { label: 'Economy: GDP growth', href: '/charts/gdp-growth-annual/' },
    { label: 'Trade: Merchandise trade', href: '/trade/' },
    { label: 'Science and technology: Patent applications', href: '/charts/patent-applications/' },
    { label: 'How we check: derived values', href: '/how-we-check/#hallmark' },
  ],
}

export default topic
