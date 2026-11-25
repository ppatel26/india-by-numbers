import type { Breakpoint, Format, Source, Topic } from '../types'

// Data: research/data/trade-payments (README: "Proposed charts", "Gaps and cautions"). This topic
// uses the seven trade CSVs. The three payments CSVs belong to the Economy topic.
// tests/unit/prose.test.ts checks every number in the prose.

// ---------------------------------------------------------------- Sources
// One source per Handbook table. RBI serves each table as an HTML page at
// PublicationsView.aspx?id=<23825 + table number>. Every table page carries "Date : Jul 31, 2026".
// Tables 111 to 119 name DGCI&S as their source; RBI does not mark them as third-party copyright.

const HANDBOOK = 'Handbook of Statistics on Indian Economy 2025-26'

const table = (n: number, title: string, dgcis = false): Source => ({
  publisher: 'RBI',
  release: `${HANDBOOK}, Table ${n}: ${title}${dgcis ? ' (source: DGCI&S)' : ''}`,
  released: '2026-07-31',
  url: `https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=${23825 + n}`,
})

const T111 = table(111, "India's Foreign Trade - US Dollar", true)
const T113 = table(113, 'Exports of Major Commodities - US Dollar', true)
const T115 = table(115, 'Imports of Major Commodities - US Dollar', true)
const T119 = table(119, 'Direction of Foreign Trade - US Dollar', true)
const T128 = table(128, "Key Components of India's Balance of Payments - US Dollar")
const T130 = table(130, 'Invisibles by Category of Transactions - US Dollar')
const T144 = table(144, 'Foreign Exchange Reserves')
const T241 = table(241, 'Balance of Payments Indicators')

const NOTES: Source = {
  publisher: 'RBI',
  release: `${HANDBOOK}, Notes on Tables`,
  released: '2026-07-31',
  url: 'https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=24071',
}

// ---------------------------------------------------------------- Data

const DIR = 'trade-payments'
const CURRENT = `${DIR}/current-account-annual.csv`
const INDICATORS = `${DIR}/bop-indicators-annual.csv`
const TRADE = `${DIR}/merchandise-trade-annual.csv`
const COMMODITY = `${DIR}/merchandise-trade-by-commodity.csv`
const PARTNER = `${DIR}/merchandise-trade-by-partner.csv`
const RESERVES = `${DIR}/forex-reserves-end-march.csv`

const CHECKED = '2026-11-25'

const fy = (y: number): string => `${y}-${String((y + 1) % 100).padStart(2, '0')}`
const fyRange = (from: number, to: number): string[] => Array.from({ length: to - from + 1 }, (_, i) => fy(from + i))

/** Table 130 starts in 2006-07. Table 128 starts in 1996-97, so its rows in the parts chart are cut to match. */
const FROM_2006 = fyRange(2006, 2025)

/** RBI publishes US$ million. The site shows US$ billion. */
const USD: Format = { unit: 'US$', multiply: 1e-3, decimals: 1, suffix: ' billion' }

/** Table 241 computes each ratio on the GDP series of its time. */
const GDP_BASES: readonly Breakpoint[] = [
  { x: '2004-05', label: 'GDP base 2004-05', before: 'Base 1999-2000' },
  { x: '2011-12', label: 'GDP base 2011-12' },
  { x: '2022-23', label: 'GDP base 2022-23' },
]

/** The ten largest of the 30 named export groups in 2025-26 (Table 113), largest first. */
const TOP_EXPORTS = [
  'Engineering Goods',
  'Petroleum Products',
  'Electronic Goods',
  'Drugs & Pharmaceuticals',
  'Organic & Inorganic Chemicals',
  'Gems & Jewellery',
  'RMG of all Textiles',
  'Cotton Yarn/Fabs./made-ups, Handloom Products etc.',
  'Rice',
  'Marine Products',
]

/** The ten largest of the 30 named import groups in 2025-26 (Table 115), largest first. */
const TOP_IMPORTS = [
  'Petroleum, Crude & products',
  'Electronic goods',
  'Gold',
  'Machinery, electrical & non-electrical',
  'Transport equipment',
  'Non-ferrous metals',
  'Organic & Inorganic Chemicals',
  'Coal, Coke & Briquettes, etc.',
  'Artificial resins, plastic materials, etc.',
  'Iron & Steel',
]

/** The 12 countries with the most exports plus imports in 2025-26 (Table 119), largest first. */
const TOP_PARTNERS = [
  'People’s Republic of China',
  'U S A',
  'U A E',
  'Russia',
  'Saudi Arabia',
  'Singapore',
  'Hong Kong',
  'Germany',
  'Iraq',
  'Japan',
  'South Korea',
  'Switzerland',
]

// ---------------------------------------------------------------- Shared know lines

const BPM_KNOW =
  'Tables 128 to 131 follow the older RBI presentation of receipts, payments and "invisibles". The Handbook gives the IMF Balance of Payments Manual, 6th edition (BPM6), presentation only for 2022-23 to 2025-26, in Table 126. Its Notes on Tables give no year in which RBI moved from BPM5 to BPM6, so this chart shows no break for it.'

const PRELIMINARY_KNOW = 'RBI marks 2025-26 as preliminary estimates. The next Handbook will revise them.'

const CUSTOMS_KNOW =
  'These are customs figures from the Directorate General of Commercial Intelligence and Statistics (DGCI&S). They differ from the goods figures in the balance of payments, which add and remove items by method. In 2025-26, customs exports were US$4,41,730.1 million and balance of payments exports US$4,46,147 million.'

const TRADE_STATUS_KNOW = 'RBI marks 2025-26 as provisional and 2024-25 as revised. The next Handbook will revise them.'

const OTHER_KNOW = 'RBI groups goods into 31 commodity groups. "Other Commodities" is what the other 30 groups leave out, so it is not shown here.'

const topic: Topic = {
  slug: 'trade',
  name: 'Trade',
  hindi: 'व्यापार',
  question: 'Does India spend more abroad than it earns, and what does it buy and sell?',
  standfirst:
    'In 2025-26, India ran a current account deficit of 0.61% of GDP: it paid out more abroad than it took in. In the balance of payments, a goods deficit of US$337.3 billion was mostly offset by a services surplus and by money that Indians abroad send home. This topic is India only. It covers goods, services, remittances, the current account and foreign exchange reserves.',
  figures: [
    { chart: 'current-account-balance', label: 'Current account balance, share of GDP. Below zero is a deficit' },
    { chart: 'merchandise-exports-imports', series: 'exports', label: 'Goods exports, customs data' },
    { chart: 'forex-reserves', series: 'total', label: 'Foreign exchange reserves, end of March 2026' },
  ],
  nextRelease: 'RBI Handbook of Statistics 2026-27, not announced',
  parts: [
    {
      title: 'Does India spend more abroad than it earns?',
      lede: 'India ran a current account deficit of 0.61% of GDP in 2025-26, or US$25.4 billion. The last surplus was in 2020-21, at 0.93% of GDP. The deficit was largest in 2012-13, at 4.81%.',
      blocks: [
        {
          chart: {
            kind: 'columns',
            slug: 'current-account-balance',
            checked: CHECKED,
            title: 'Current account balance as a share of GDP, 1987-88 to 2025-26',
            subtitle: 'Current account balance divided by GDP at current market prices, India, each financial year. Below zero is a deficit.',
            punches: { office: 'RBI', unit: '% of GDP', period: '2025-26' },
            status: ['Provisional', 'Method break'],
            note: 'RBI heads the column "CAD / GDP", but the sign shows the balance: a negative value is a deficit, a positive value a surplus.',
            sources: [T241],
            format: { unit: '%', decimals: 2 },
            sign: { above: 's5', below: 's1', aboveLabel: 'Surplus', belowLabel: 'Deficit' },
            series: [
              {
                key: 'balance',
                label: 'Current account balance',
                color: 'ink',
                file: INDICATORS,
                where: { indicator: 'current-account-balance-to-gdp' },
                note: 'status',
              },
            ],
            breaks: GDP_BASES,
            callouts: [
              { series: 'balance', x: '2012-13' },
              { series: 'balance', x: '2020-21' },
            ],
            know: [
              'The current account records trade in goods and services, income on investments and wages, and transfers such as money sent home. A deficit means that India paid more abroad than it received. The capital account, foreign investment and borrowing, pays for the gap.',
              'RBI divides by GDP at current market prices on the base of the time: 1999-2000 up to 2003-04, 2004-05 for 2004-05 to 2010-11, 2011-12 for 2011-12 to 2021-22, and 2022-23 from 2022-23. The chart breaks at each change.',
              'RBI marks 2024-25 as revised estimates and 2025-26 as provisional estimates. The tooltip names the status of each year.',
              'India had surpluses in 2001-02 to 2003-04 and in 2020-21.',
              BPM_KNOW,
            ],
            processing: [
              'Read the current account column of Handbook Table 241 for 1987-88 to 2025-26, as RBI prints it, to two decimals.',
              'Check 2025-26 (-0.61) and 2011-12 (-4.29) against the table.',
              'Record the GDP base of each year from the table note.',
              'Colour each column by its sign: surplus or deficit.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'Goods drive the deficit. In the balance of payments for 2025-26, India imported US$337.3 billion more goods than it exported. A services surplus of US$216.6 billion and net transfers from Indians abroad of US$144.8 billion covered most of it. Income paid abroad on investments took US$48.2 billion.',
        },
        {
          chart: {
            kind: 'columns',
            slug: 'current-account-parts',
            checked: CHECKED,
            title: 'Parts of the current account, 2006-07 to 2025-26',
            subtitle: 'Net value of each part, US$ billion, India. Columns above zero bring money in; columns below zero take it out.',
            punches: { office: 'RBI', unit: 'US$ billion', period: '2025-26' },
            status: ['Provisional'],
            note: 'The parts add up to the current account balance, within rounding. The data table gives the balance for each year.',
            sources: [T128, T130],
            format: USD,
            stacked: true,
            series: [
              { key: 'goods', label: 'Goods', color: 's1', file: CURRENT, where: { item: 'trade-balance', flow: 'net', unit: 'US$ million', period: FROM_2006 }, note: 'status' },
              { key: 'services', label: 'Services', color: 's5', file: CURRENT, where: { item: 'services', flow: 'net', unit: 'US$ million' }, note: 'status' },
              { key: 'private-transfers', label: 'Private transfers', color: 's2', file: CURRENT, where: { item: 'private-transfers', flow: 'net', unit: 'US$ million' }, note: 'status' },
              { key: 'income', label: 'Income', color: 's6', file: CURRENT, where: { item: 'income', flow: 'net', unit: 'US$ million' }, note: 'status' },
              { key: 'official-transfers', label: 'Official transfers', color: 'other', file: CURRENT, where: { item: 'official-transfers', flow: 'net', unit: 'US$ million' }, note: 'status' },
              {
                key: 'current-account',
                label: 'Current account balance',
                color: 'ink',
                hidden: true,
                file: CURRENT,
                where: { item: 'current-account', flow: 'net', unit: 'US$ million', period: FROM_2006 },
                note: 'status',
              },
            ],
            know: [
              'Goods is the trade balance in the balance of payments: exports minus imports. Services covers travel, transportation, insurance, government services and miscellaneous services, which include software and business services. Private transfers are mostly money that Indians abroad send home. Income is investment income and compensation of employees, received minus paid.',
              'India had a current account surplus of US$23.9 billion in 2020-21, when imports fell.',
              'Goods come from Table 128. The other parts come from Table 130, which starts in 2006-07. RBI also prints both tables in ₹ crore (Tables 129 and 131); the data file keeps them.',
              BPM_KNOW,
              PRELIMINARY_KNOW,
            ],
            processing: [
              'Read the trade balance and the current account from Handbook Table 128, and the net services, income, private transfers and official transfers from Table 130, in US$ million.',
              'Check that the five parts add up to the Table 128 current account in each year, within US$1 million of rounding.',
              'Check the 2025-26 current account (US$ -25,365 million) and 2020-21 (US$ 23,912 million) against Table 128.',
              'Divide by 1,000 to show US$ billion. The data file keeps US$ million.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How much do Indians abroad send home?',
      lede: 'Private transfers to India were US$155.1 billion in 2025-26, up from US$30.8 billion in 2006-07. Most of this is money that Indians working abroad send home.',
      blocks: [
        {
          chart: {
            kind: 'line',
            slug: 'remittances',
            checked: CHECKED,
            title: 'Private transfers received by India, 2006-07 to 2025-26',
            subtitle: 'Private transfer receipts, mostly money sent home by Indians abroad, US$ billion a year.',
            punches: { office: 'RBI', unit: 'US$ billion', period: '2025-26' },
            status: ['Provisional'],
            note: 'Receipts only. Private transfers that India sends abroad are smaller: the net figure is in the parts of the current account chart.',
            sources: [T130],
            format: USD,
            y: { min: 0 },
            series: [
              {
                key: 'receipts',
                label: 'Private transfer receipts',
                color: 'ink',
                file: CURRENT,
                where: { item: 'private-transfers', flow: 'receipts', unit: 'US$ million' },
                note: 'status',
              },
            ],
            callouts: [
              { series: 'receipts', x: '2006-07' },
              { series: 'receipts', x: '2025-26' },
            ],
            know: [
              'RBI counts private transfers as "mostly remittances": money that Indians working abroad send to their families. They also include gifts and donations.',
              'Since 1992-93, gold and silver brought in by Indians returning from abroad count in imports, with a matching entry in private transfer receipts.',
              'Receipts fell in 2015-16 and 2016-17, and in 2020-21.',
              PRELIMINARY_KNOW,
            ],
            processing: [
              'Read private transfer receipts from Handbook Table 130, in US$ million, for 2006-07 to 2025-26.',
              'Check 2025-26 (US$ 1,55,120 million) against the table.',
              'Divide by 1,000 to show US$ billion.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How much does India export and import?',
      lede: 'India exported goods worth US$441.7 billion in 2025-26 and imported US$775.0 billion, by customs data. The trade deficit was US$333.2 billion.',
      blocks: [
        {
          chart: {
            kind: 'line',
            slug: 'merchandise-exports-imports',
            checked: CHECKED,
            title: 'Goods exports and imports, 1987-88 to 2025-26',
            subtitle: 'Merchandise exports and imports by customs data, US$ billion a year, India.',
            punches: { office: 'RBI · DGCI&S', unit: 'US$ billion', period: '2025-26' },
            status: ['Provisional'],
            note: 'Customs figures. They differ from the goods figures in the balance of payments, so this chart does not match the current account charts.',
            sources: [T111],
            format: USD,
            y: { min: 0 },
            series: [
              { key: 'exports', label: 'Exports', color: 's5', file: TRADE, where: { product: 'total', flow: 'exports' }, note: 'status' },
              { key: 'imports', label: 'Imports', color: 's1', file: TRADE, where: { product: 'total', flow: 'imports' }, note: 'status' },
              { key: 'balance', label: 'Trade balance', color: 'ink', hidden: true, file: TRADE, where: { product: 'total', flow: 'trade-balance' }, note: 'status' },
            ],
            know: [
              CUSTOMS_KNOW,
              'Imports have been larger than exports in every year since 1987-88.',
              'Oil made up US$173.9 billion of imports in 2025-26. The data file splits exports and imports into oil and non-oil goods.',
              'Handbook tables disagree on 2024-25 imports: Table 111 gives US$7,21,131.5 million, and Tables 115 and 119 give US$7,21,200.2 million. Each chart keeps its own table.',
              TRADE_STATUS_KNOW,
            ],
            processing: [
              'Read total exports, imports and the trade balance from Handbook Table 111, in US$ million, for 1987-88 to 2025-26.',
              'Check exports in 2025-26 (US$ 4,41,730.1 million), imports in 1987-88 (US$ 17,155.7 million) and the trade balance in 2025-26 (US$ -3,33,248.1 million) against the table.',
              'Divide by 1,000 to show US$ billion.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'Engineering goods were the largest export group in 2025-26, at US$122.4 billion. Electronic goods exports grew from US$11.1 billion in 2020-21 to US$48.0 billion.',
        },
        {
          chart: {
            kind: 'bars',
            slug: 'top-exports',
            checked: CHECKED,
            title: 'Largest goods exports by commodity group, 2025-26',
            subtitle: 'The ten largest of 31 RBI commodity groups, US$ billion, with 2020-21 for comparison.',
            punches: { office: 'RBI · DGCI&S', unit: 'US$ billion', period: '2025-26' },
            status: ['Provisional'],
            note: 'Customs data. RBI commodity groups, not a full product classification.',
            sources: [T113],
            format: USD,
            by: 'commodity',
            rowHead: 'Commodity group',
            axis: { min: 0, max: 175000 },
            series: [
              { key: '2025-26', label: '2025-26', color: 'ink', file: COMMODITY, x: 'commodity', where: { flow: 'exports', period: '2025-26', commodity: TOP_EXPORTS }, note: 'status' },
              { key: '2020-21', label: '2020-21', color: 'other', file: COMMODITY, x: 'commodity', where: { flow: 'exports', period: '2020-21', commodity: TOP_EXPORTS } },
            ],
            order: TOP_EXPORTS,
            labels: {
              'Engineering Goods': 'Engineering goods',
              'Petroleum Products': 'Petroleum products',
              'Electronic Goods': 'Electronic goods',
              'Drugs & Pharmaceuticals': 'Drugs and pharmaceuticals',
              'Organic & Inorganic Chemicals': 'Organic and inorganic chemicals',
              'Gems & Jewellery': 'Gems and jewellery',
              'RMG of all Textiles': 'Ready-made garments',
              'Cotton Yarn/Fabs./made-ups, Handloom Products etc.': 'Cotton yarn, fabrics, handloom',
              Rice: 'Rice',
              'Marine Products': 'Marine products',
            },
            know: [
              OTHER_KNOW,
              CUSTOMS_KNOW,
              TRADE_STATUS_KNOW,
            ],
            processing: [
              'Read exports by commodity group from Handbook Table 113, in US$ million, for 2020-21 and 2025-26.',
              'Check Engineering Goods in 2025-26 (US$ 1,22,433.8 million) against the table.',
              'Rank the 30 named groups by 2025-26 value and keep the ten largest. Leave out "Other Commodities" and the total.',
              'Divide by 1,000 to show US$ billion.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'Crude oil and petroleum products were the largest import in 2025-26, at US$173.9 billion. Electronic goods came second, at US$116.2 billion, and gold third, at US$72.0 billion.',
        },
        {
          chart: {
            kind: 'bars',
            slug: 'top-imports',
            checked: CHECKED,
            title: 'Largest goods imports by commodity group, 2025-26',
            subtitle: 'The ten largest of 31 RBI commodity groups, US$ billion, with 2020-21 for comparison.',
            punches: { office: 'RBI · DGCI&S', unit: 'US$ billion', period: '2025-26' },
            status: ['Provisional'],
            note: 'Customs data. RBI commodity groups, not a full product classification.',
            sources: [T115],
            format: USD,
            by: 'commodity',
            rowHead: 'Commodity group',
            axis: { min: 0, max: 250000 },
            series: [
              { key: '2025-26', label: '2025-26', color: 'ink', file: COMMODITY, x: 'commodity', where: { flow: 'imports', period: '2025-26', commodity: TOP_IMPORTS }, note: 'status' },
              { key: '2020-21', label: '2020-21', color: 'other', file: COMMODITY, x: 'commodity', where: { flow: 'imports', period: '2020-21', commodity: TOP_IMPORTS } },
            ],
            order: TOP_IMPORTS,
            labels: {
              'Petroleum, Crude & products': 'Crude oil and petroleum products',
              'Electronic goods': 'Electronic goods',
              Gold: 'Gold',
              'Machinery, electrical & non-electrical': 'Machinery',
              'Transport equipment': 'Transport equipment',
              'Non-ferrous metals': 'Non-ferrous metals',
              'Organic & Inorganic Chemicals': 'Organic and inorganic chemicals',
              'Coal, Coke & Briquettes, etc.': 'Coal and coke',
              'Artificial resins, plastic materials, etc.': 'Plastics and resins',
              'Iron & Steel': 'Iron and steel',
            },
            know: [
              'Table 115 gives total imports of US$7,74,978.2 million in 2025-26 and marks 2023-24 and 2024-25 as revised.',
              OTHER_KNOW,
              CUSTOMS_KNOW,
              'RBI marks 2025-26 as provisional. The next Handbook will revise it.',
            ],
            processing: [
              'Read imports by commodity group from Handbook Table 115, in US$ million, for 2020-21 and 2025-26.',
              'Check gold in 2025-26 (US$ 71,977.3 million) and total imports in 2024-25 (US$ 7,21,200.2 million) against the table.',
              'Rank the 30 named groups by 2025-26 value and keep the ten largest. Leave out "Other Commodities" and the total.',
              'Divide by 1,000 to show US$ billion.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'Who does India trade with?',
      lede: 'The United States bought the most Indian goods in 2025-26, US$87.3 billion, and sold India US$53.5 billion. China sold India US$131.6 billion of goods and bought US$19.5 billion.',
      blocks: [
        {
          chart: {
            kind: 'bars',
            slug: 'trade-partners',
            checked: CHECKED,
            title: 'Goods exports and imports by partner country, 2025-26',
            subtitle: 'The 12 countries with the most trade with India, exports plus imports, US$ billion.',
            punches: { office: 'RBI · DGCI&S', unit: 'US$ billion', period: '2025-26' },
            status: ['Provisional'],
            note: 'Customs data. Countries are ordered by exports plus imports.',
            sources: [T119],
            format: USD,
            by: 'partner',
            rowHead: 'Country',
            axis: { min: 0, max: 200000 },
            series: [
              { key: 'exports', label: 'Exports from India', color: 's5', file: PARTNER, x: 'partner', where: { level: 'country', period: '2025-26', flow: 'exports', partner: TOP_PARTNERS }, note: 'status' },
              { key: 'imports', label: 'Imports into India', color: 's1', file: PARTNER, x: 'partner', where: { level: 'country', period: '2025-26', flow: 'imports', partner: TOP_PARTNERS }, note: 'status' },
            ],
            order: TOP_PARTNERS,
            labels: {
              'People’s Republic of China': 'China',
              'U S A': 'United States',
              'U A E': 'United Arab Emirates',
            },
            know: [
              'RBI names 40 countries under its country groups ("Of which:"). It does not list every country, so the countries do not add up to the total.',
              'India buys more from China than it sells there. In 2025-26 it sold more to the United States than it bought.',
              'Table 119 gives 2025-26 totals of US$4,41,745.9 million for exports and US$7,76,013.6 million for imports, a little above Table 111.',
              'RBI marks 2025-26 as provisional and 2021-22 to 2024-25 as revised. The next Handbook will revise them.',
            ],
            processing: [
              'Read exports and imports by country from Handbook Table 119, in US$ million, for 2025-26.',
              'Check exports to the USA (US$ 87,316.0 million) and imports from China (US$ 1,31,633.4 million) against the table.',
              'Add exports and imports for each country, and keep the 12 largest.',
              'Divide by 1,000 to show US$ billion.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How large are the foreign exchange reserves?',
      lede: "India's foreign exchange reserves were US$691.1 billion at the end of March 2026, enough for 10.59 months of imports. At the end of March 1991 they were US$5.8 billion.",
      blocks: [
        {
          text: 'Gold reserves grew from US$52.7 billion at the end of March 2024 to US$115.4 billion at the end of March 2026. Foreign currency assets were US$552.3 billion.',
        },
        {
          chart: {
            kind: 'area',
            slug: 'forex-reserves',
            checked: CHECKED,
            title: 'Foreign exchange reserves, 1968-69 to 2025-26',
            subtitle: "RBI's reserves at the end of each financial year (31 March), by part, US$ billion.",
            punches: { office: 'RBI', unit: 'US$ billion', period: '31 MAR 2026' },
            note: 'Each value is a stock on 31 March, not a flow over the year. RBI marks some early SDR and reserve tranche values as negligible.',
            sources: [T144, T241],
            format: USD,
            y: { min: 0, max: 800000, step: 200000 },
            series: [
              { key: 'foreign-currency-assets', label: 'Foreign currency assets', color: 's5', file: RESERVES, where: { component: 'foreign-currency-assets', unit: 'US$ million' }, note: 'note' },
              { key: 'gold', label: 'Gold', color: 's8', file: RESERVES, where: { component: 'gold', unit: 'US$ million' }, note: 'note' },
              { key: 'sdrs', label: 'SDRs', color: 's3', file: RESERVES, where: { component: 'sdrs', unit: 'US$ million' }, note: 'note' },
              { key: 'reserve-tranche-position', label: 'IMF reserve tranche', color: 's6', file: RESERVES, where: { component: 'reserve-tranche-position', unit: 'US$ million' }, note: 'note' },
              { key: 'total', label: 'Total reserves', color: 'ink', hidden: true, file: RESERVES, where: { component: 'total', unit: 'US$ million' } },
            ],
            know: [
              'Reserves are the foreign assets that RBI holds: foreign currency assets, gold, Special Drawing Rights (SDRs) from the IMF, and the reserve tranche position in the IMF.',
              'Foreign currency assets in US dollars include the change in value of other currencies that RBI holds, such as the euro, sterling and yen.',
              'Gold includes 200 tonnes that RBI bought from the IMF on 3 November 2009. SDRs include IMF allocations on 28 August 2009 and 23 August 2021.',
              'Import cover is reserves divided by a month of imports (Table 241). It was 10.59 months in 2025-26 and 17.38 months in 2020-21.',
              'RBI also prints reserves in ₹ crore. The rupee value changes with the exchange rate; the data file keeps both.',
            ],
            processing: [
              'Read the four parts and the total from Handbook Table 144, in US$ million, at the end of each financial year from 1968-69 to 2025-26.',
              'Check the total at the end of March 2026 (US$ 6,91,108 million) and March 1969 (US$ 769 million), and gold in March 2026 (₹ 10,94,309 crore), against the table.',
              'Show values RBI marks "-" (negligible) as zero in the stack, with a note.',
              'Divide by 1,000 to show US$ billion.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
  ],
  about: {
    intro:
      'This topic is India only: no RBI table gives trade or the balance of payments by state. It covers goods, services, remittances, the current account and foreign exchange reserves. The rupee exchange rate is in the Economy topic.',
    publisher:
      'The Reserve Bank of India (RBI) publishes every figure here, in its Handbook of Statistics on Indian Economy 2025-26 (31 July 2026). The foreign trade tables (111 to 119) come from customs data of the Directorate General of Commercial Intelligence and Statistics (DGCI&S), Ministry of Commerce and Industry.',
    frequency:
      'The Handbook comes out once a year. The 2025-26 edition is dated 31 July 2026. RBI has not announced the date of the next edition.',
    revisions:
      'RBI marks 2025-26 as provisional or preliminary in every table, and 2024-25 as revised in most. The next Handbook will revise them. We use the word Provisional for both.',
    breaks:
      'The share of GDP uses the GDP series of its time, with new bases in 2004-05, 2011-12 and 2022-23; the chart breaks at each. The Handbook gives no year in which RBI moved from the BPM5 to the BPM6 presentation, so the current account charts show no break for it.',
    coverage:
      'India only. Current account parts: 2006-07 to 2025-26. Current account share of GDP: 1987-88 to 2025-26. Goods trade: 1987-88 to 2025-26. Goods by commodity: 2020-21 to 2025-26; by partner: 2021-22 to 2025-26. Reserves: end of March 1969 to end of March 2026. All values in US$, as RBI prints them; RBI also prints ₹ tables.',
    missing:
      'No figures by state. No services trade by partner country. Customs and balance of payments goods figures differ, so the trade charts and the current account charts do not match. Reuse: the RBI Copyright Policy says its material "may be reproduced accurately and without modification, subject to appropriate acknowledgement of the RBI as the source".',
  },
  sources: [T241, T128, T130, T111, T113, T115, T119, T144, NOTES],
  related: [
    { label: 'Economy: Rupees per US dollar since 1950', href: '/charts/usd-inr-annual/' },
    { label: 'Economy: Real GDP growth', href: '/charts/gdp-growth-annual/' },
    { label: 'Prices: RBI repo rate since 2001', href: '/charts/repo-rate/' },
    { label: 'How we check: method breaks', href: '/how-we-check/#part-3' },
  ],
}

export default topic
