import type { Color, Series, Source, Topic } from '../types'

// Data: research/data/agriculture (README: "Proposed charts", "Gaps and cautions").
// tests/unit/prose.test.ts checks every number in the prose.
//
// Licence: chart only the NSS round 77 CSVs. Agricultural Statistics at a Glance (the crop and
// Agriculture Census CSVs) asks for permission by mail before reuse, and the owner has not asked
// yet. No figure from those CSVs goes on this page until the reply is kept.

// ---------------------------------------------------------------- Sources

// The cover page says September 2021. The PDF was created on 10 Mar 2023; MoSPI does not say what changed.
const report587: Source = {
  publisher: 'NSO, MoSPI',
  release:
    'NSS Report No. 587, Situation Assessment of Agricultural Households and Land and Livestock Holdings of Households in Rural India, 2019 (NSS round 77)',
  released: '2021-09',
  url: 'https://www.mospi.gov.in/sites/default/files/publication_reports/Report_587m_0.pdf',
}

// The API gives no release date. The API takes no survey code for round 77.
const nss77Api = (indicator: number): Source => ({
  publisher: 'NSO, MoSPI',
  release: `eSankhyiki API, NSS round 77, indicator ${indicator}`,
  released: 'not stated',
  url: `https://api.mospi.gov.in/api/nss-77/getNss77Records?indicator_code=${indicator}&Format=JSON`,
})

// ---------------------------------------------------------------- Data

const INCOME = 'agriculture/agri-household-income-by-source.csv'
const DEBT = 'agriculture/agri-household-debt.csv'
const LOANS = 'agriculture/agri-household-loans-by-source.csv'
const LAND = 'agriculture/land-possessed-by-size-class.csv'
const HOLDINGS = 'agriculture/operational-holdings-nss.csv'

const CHECKED = '2026-11-25'

/** Size classes of land possessed, smallest first, as the CSVs name them. */
const LAND_CLASSES = [
  'less than 0.01 ha',
  '0.01 to 0.40 ha',
  '0.41 to 1.00 ha',
  '1.01 to 2.00 ha',
  '2.01 to 4.00 ha',
  '4.01 to 10.00 ha',
  'more than 10.00 ha',
] as const

const LAND_LABELS: Readonly<Record<string, string>> = {
  'all sizes': 'All agricultural households',
  ...Object.fromEntries(LAND_CLASSES.map((c) => [c, c.replace(/^less/, 'Less').replace(/^more/, 'More')])),
}

/** Sources of income in Statement 5.1A, in its order. */
const INCOME_SOURCES = [
  ['wages', 'Wages and salaries', 's2'],
  ['leasing out of land', 'Rent from land leased out', 's7'],
  ['crop production', 'Crop production', 's4'],
  ['farming of animals', 'Farming of animals', 's5'],
  ['non-farm business', 'Non-farm business', 's6'],
] as const satisfies readonly (readonly [string, string, Color])[]

/** Sources of loans in Statement 5.8.1, institutional first. */
const LENDERS = [
  ['scheduled commercial bank', 'Scheduled commercial bank'],
  ['regional rural bank', 'Regional rural bank'],
  ['co-operative society', 'Co-operative society'],
  ['co-operative bank', 'Co-operative bank'],
  ['self-help group (bank linked or not)', 'Self-help group'],
  ['other institutional agencies', 'Other institutional agencies'],
  ['agricultural moneylender', 'Agricultural moneylender'],
  ['professional moneylender', 'Professional moneylender'],
  ['relatives and friends', 'Relatives and friends'],
  ['other non-institutional agencies', 'Other non-institutional agencies'],
] as const

/** Size categories of operational holdings in Statement 2.9. Landless holdings are left out: 0.0% or no value. */
const HOLDING_SIZES = [
  ['marginal', 'Marginal, up to 1 ha'],
  ['small', 'Small, 1 to 2 ha'],
  ['semi-medium', 'Semi-medium, 2 to 4 ha'],
  ['medium', 'Medium, 4 to 10 ha'],
  ['large', 'Large, more than 10 ha'],
] as const

/** The rounds of Statement 2.9, one series each: 2002-03 has a kharif and a rabi value. */
const HOLDING_ROUNDS = [
  ['2018-19', '', '2018-19', 's4'],
  ['2012-13', '', '2012-13', 's5'],
  ['2002-03', 'kharif', '2002-03, kharif season', 's1'],
  ['2002-03', 'rabi', '2002-03, rabi season', 's6'],
] as const satisfies readonly (readonly [string, string, string, Color])[]

const holdingSeries = (measure: string, prefix: string): Series[] =>
  HOLDING_ROUNDS.map(([period, season, label, color]) => ({
    key: `${prefix}-${period}${season ? `-${season}` : ''}`,
    label,
    color,
    file: HOLDINGS,
    x: 'size_category',
    where: { geography: 'india', period, season, measure, size_category: HOLDING_SIZES.map(([k]) => k) },
  }))

/** Places with no value of their own in NSS round 77. */
const MISSING: Readonly<Record<string, string>> = {
  goa: 'No value in NSS round 77',
  delhi: 'No value in NSS round 77',
  ladakh: 'Counted with Jammu and Kashmir in 2019',
  'andaman-nicobar': 'In the NSS group of UTs, with no value of its own',
  chandigarh: 'In the NSS group of UTs, with no value of its own',
  'dnh-dd': 'In the NSS group of UTs, with no value of its own',
  lakshadweep: 'In the NSS group of UTs, with no value of its own',
  puducherry: 'In the NSS group of UTs, with no value of its own',
}

// Know lines that several charts share.
const HOUSEHOLD_KNOW =
  'NSS round 77 counts an agricultural household if it received more than ₹4,000 from agricultural activities, such as crops, animals, fishery or bee-keeping, and had at least one member self-employed in agriculture in the last 365 days. A household that lives only on farm labour is not an agricultural household.'

const RURAL_KNOW =
  'The survey covered rural India only, from January to December 2019. Agricultural households were 54.0% of rural households.'

const SAMPLE_KNOW =
  'MoSPI gives a state only if it has at least 300 sample rural households. Some values in small states still rest on few households.'

const STATES_KNOW =
  'The report gives 28 states one by one. Jammu and Kashmir includes Ladakh. Six small UTs are joined in one group, which has no place on the map, and Goa and Delhi have no value.'

const DEBT_KNOW =
  'Debt is the loan outstanding, with interest, on the day of the first interview, between January and August 2019. MoSPI says these figures do not compare with the All India Debt and Investment Survey of the same round.'

const topic: Topic = {
  slug: 'agriculture',
  name: 'Agriculture',
  hindi: 'कृषि',
  question: 'How much do farm households earn, and how many are in debt?',
  standfirst:
    'In 2018-19, an agricultural household earned ₹10,218 a month, more of it from wages than from crops.',
  figures: [
    { chart: 'farm-income-by-state', label: 'Income of an agricultural household, a month' },
    { chart: 'farm-households-in-debt-by-state', label: 'Agricultural households in debt' },
    { chart: 'farm-debt-by-land-size', series: 'loan', x: 'all sizes', label: 'Average loan, all agricultural households', period: '2019' },
  ],
  nextRelease: 'not announced',
  parts: [
    {
      title: 'How much does a farm household earn, and from what?',
      lede: 'In 2018-19, an agricultural household earned ₹10,218 a month on average: ₹4,063 from wages and ₹3,798 from crops.',
      blocks: [
        {
          chart: {
            kind: 'bars',
            slug: 'farm-income-by-source',
            checked: CHECKED,
            title: 'Income of agricultural households by source and land size, 2018-19',
            subtitle: 'Average monthly income per agricultural household, by source and size class of land possessed, rupees at current prices, India.',
            punches: { office: 'MoSPI', unit: '₹ a month', period: '2018-19' },
            status: ['Survey estimate'],
            note: 'Net receipts after paid out expenses. Rural agricultural households only.',
            sources: [report587, nss77Api(24)],
            format: { unit: '₹', decimals: 0 },
            by: 'land_possessed',
            rowHead: 'Land possessed',
            stacked: true,
            order: ['all sizes', ...LAND_CLASSES],
            labels: LAND_LABELS,
            series: [
              ...INCOME_SOURCES.map(([source, label, color]): Series => ({
                key: source,
                label,
                color,
                file: INCOME,
                x: 'land_possessed',
                where: { geography: 'india', expenses: 'paid out expenses', source },
              })),
              // The table and the prose; not drawn.
              { key: 'total', label: 'Total', color: 'ink', hidden: true, file: INCOME, x: 'land_possessed', where: { geography: 'india', expenses: 'paid out expenses', source: 'total' } },
            ],
            know: [
              HOUSEHOLD_KNOW,
              'Income is wages and salaries, rent from land leased out, and the net receipt from crops, from farming of animals and from a non-farm business, for July 2018 to June 2019. Pensions and money sent home are left out.',
              'MoSPI gives two sets of net receipts. This chart deducts the expenses paid out. The second set also deducts imputed expenses, such as farm-saved seed and unpaid family labour: it gives ₹8,337 a month for India.',
              'Land possessed is land owned, plus land leased in, minus land leased out, plus land otherwise possessed.',
              'Incomes are at the current prices of 2018-19. Compare them with later years only after allowing for inflation.',
              RURAL_KNOW,
            ],
            processing: [
              'Read Statement 5.1A of NSS Report No. 587: India, by size class of land possessed, paid out expenses.',
              'Check every value against indicator 24 of NSS round 77 on the eSankhyiki API (social group "All"). All agree.',
              'Keep the total as published. The five sources add up to it within a rupee.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'Households with 0.41 to 1.00 ha earned more from wages (₹3,906 a month) than from crops (₹2,683). Households with more than 10.00 ha earned ₹43,599 a month from crops.',
        },
        {
          text: 'Income ranged from ₹4,895 a month in Jharkhand to ₹29,348 in Meghalaya. In Punjab it was ₹26,701.',
        },
        {
          chart: {
            kind: 'states',
            slug: 'farm-income-by-state',
            checked: CHECKED,
            title: 'Income of agricultural households by state, 2018-19',
            subtitle: 'Average monthly income per agricultural household, all sources, rupees at current prices, by state.',
            punches: { office: 'MoSPI', unit: '₹ a month', period: '2018-19' },
            status: ['Survey estimate'],
            note: 'Net receipts after paid out expenses. Rural agricultural households only. Small states have small samples.',
            sources: [report587, nss77Api(24)],
            format: { unit: '₹', decimals: 0 },
            data: { file: INCOME, where: { land_possessed: 'all sizes', source: 'total', expenses: 'paid out expenses' }, x: 'geography' },
            open: 'map',
            scale: 'seq',
            better: 'high',
            short: 'Farm household income',
            missing: MISSING,
            know: [
              HOUSEHOLD_KNOW,
              'Income is the total of wages, rent from land leased out, and the net receipt from crops, animals and a non-farm business, for July 2018 to June 2019.',
              'MoSPI also gives each state a second set, after paid out and imputed expenses, such as farm-saved seed and unpaid family labour. For India it is ₹8,337 a month. This chart uses paid out expenses only.',
              STATES_KNOW,
              SAMPLE_KNOW,
            ],
            processing: [
              'Read Statement 5.1A.1 of NSS Report No. 587: the total income of each state, all sizes of land, paid out expenses.',
              'Check every value against indicator 24 of NSS round 77 on the eSankhyiki API. All agree.',
              'Leave out the group of north-eastern states and the group of UTs: they have no place in the site geography table.',
              'Match state names to the site geography table.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How many farm households are in debt?',
      lede: 'In 2019, 50.2% of agricultural households had a loan outstanding. Averaged over all agricultural households, in debt or not, the loan outstanding was ₹74,121.',
      blocks: [
        {
          chart: {
            kind: 'states',
            slug: 'farm-households-in-debt-by-state',
            checked: CHECKED,
            title: 'Agricultural households in debt by state, 2019',
            subtitle: 'Share of agricultural households with a loan outstanding, by state.',
            punches: { office: 'MoSPI', unit: '% of households', period: '2019' },
            status: ['Survey estimate'],
            note: 'Loans outstanding on the day of the first interview, January to August 2019. Rural agricultural households only.',
            sources: [report587],
            format: { unit: '%', decimals: 1 },
            data: { file: DEBT, where: { land_possessed: 'all sizes', measure: 'indebted agricultural households' }, x: 'geography' },
            open: 'map',
            scale: 'seq',
            short: 'Farm households in debt',
            missing: MISSING,
            know: [
              'A household is in debt if it has a loan outstanding from any source.',
              DEBT_KNOW,
              'Neither end of the scale is better. A loan can pay for seed and machines as well as cover a loss.',
              STATES_KNOW,
              SAMPLE_KNOW,
            ],
            processing: [
              'Read Statement 5.7.1 of NSS Report No. 587: the share of indebted agricultural households in each state.',
              'Check every value against column 23 of Table 29 of Appendix A, one page for each state. All agree.',
              'Do not use indicator 33 of the eSankhyiki API: it repeats the values of Andhra Pradesh under every state.',
              'Match state names to the site geography table.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'More than 90% of agricultural households were in debt in Andhra Pradesh (93.2%) and Telangana (91.7%), against 6.0% in Nagaland.',
        },
        {
          text: 'Households with more land owe more. The average loan outstanding rose from ₹26,883 for households with less than 0.01 ha to {{₹791132 plain 0}} for those with more than 10.00 ha.',
        },
        {
          chart: {
            kind: 'bars',
            slug: 'farm-debt-by-land-size',
            checked: CHECKED,
            title: 'Debt of agricultural households by land size, 2019',
            subtitle: 'Share of agricultural households in debt, and average loan outstanding per agricultural household, by size class of land possessed, India.',
            punches: { office: 'MoSPI', unit: '% and ₹', period: '2019' },
            status: ['Survey estimate'],
            note: 'Each panel has its own scale. The average loan counts every agricultural household, in debt or not.',
            sources: [report587],
            by: 'land_possessed',
            rowHead: 'Land possessed',
            order: ['all sizes', ...LAND_CLASSES],
            labels: LAND_LABELS,
            panels: [
              { label: 'Households in debt, %', series: ['indebted'], own: true },
              { label: 'Average loan outstanding, ₹', series: ['loan'], own: true },
            ],
            series: [
              {
                key: 'indebted',
                label: 'Households in debt',
                color: 'ink',
                format: { unit: '%', decimals: 1 },
                file: DEBT,
                x: 'land_possessed',
                where: { geography: 'india', measure: 'indebted agricultural households' },
              },
              {
                key: 'loan',
                label: 'Average loan outstanding',
                color: 'ink',
                format: { unit: '₹', decimals: 0 },
                file: DEBT,
                x: 'land_possessed',
                where: { geography: 'india', measure: 'average outstanding loan' },
              },
            ],
            know: [
              DEBT_KNOW,
              'The average loan is the amount outstanding divided by all agricultural households in the class, in debt or not.',
              'Loans are at the current prices of 2019.',
            ],
            processing: [
              'Read Statement 5.7 of NSS Report No. 587: India, by size class of land possessed.',
              'Check every value against columns 23 and 24 of the India page of Table 29 of Appendix A. All agree.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'Do farm households borrow from banks or from moneylenders?',
      lede: 'In 2019, banks, co-operatives and other institutions gave 69.6% of the amount that agricultural households owed. Professional moneylenders gave 14.0%.',
      blocks: [
        {
          chart: {
            kind: 'bars',
            slug: 'farm-loans-by-source',
            checked: CHECKED,
            title: 'Loans of agricultural households by source, 2019',
            subtitle: 'Share of the amount of loans outstanding, by source of the loan, India.',
            punches: { office: 'MoSPI', unit: '% of amount owed', period: '2019' },
            status: ['Survey estimate'],
            note: 'The first six sources are institutional, the last four non-institutional. Rural agricultural households only.',
            sources: [report587],
            format: { unit: '%', decimals: 1 },
            by: 'source',
            rowHead: 'Source of loan',
            order: LENDERS.map(([k]) => k),
            labels: Object.fromEntries(LENDERS),
            series: [{ key: 'share', label: 'India', color: 'ink', file: LOANS, x: 'source', where: { geography: 'india', source: LENDERS.map(([k]) => k) } }],
            know: [
              'Each share is a part of the amount owed, not of the number of loans or households.',
              'A self-help group counts whether or not it is linked to a bank.',
              DEBT_KNOW,
            ],
            processing: [
              'Read the India row of Statement 5.8.1 of NSS Report No. 587, as Statement 5.8 also gives it.',
              'Check each source against the "all sizes" row of the India page of Table 29 of Appendix A, per 1,000 divided by 10. All agree within the rounding of the parts.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'Non-institutional sources gave 57.6% of the amount owed in Telangana and 79.7% in Manipur. In Sikkim they gave 0.7%.',
        },
        {
          chart: {
            kind: 'bars',
            slug: 'farm-loans-banks-and-moneylenders',
            checked: CHECKED,
            title: 'Loans of agricultural households from institutions and moneylenders by state, 2019',
            subtitle: 'Share of the amount of loans outstanding from non-institutional and from institutional sources, by state.',
            punches: { office: 'MoSPI', unit: '% of amount owed', period: '2019' },
            status: ['Survey estimate'],
            note: 'Each total adds the published sources, so a state can add to 99.9% or 100.1%. Small states have small samples.',
            sources: [report587],
            format: { unit: '%', decimals: 1 },
            by: 'geography',
            rowHead: 'State',
            stacked: true,
            axis: { min: 0, max: 100 },
            series: [
              { key: 'non-institutional', label: 'Moneylenders, relatives and other non-institutional sources', color: 's1', file: LOANS, where: { source: 'all non-institutional sources' }, x: 'geography' },
              { key: 'institutional', label: 'Banks, co-operatives and other institutions', color: 's5', file: LOANS, where: { source: 'all institutional sources' }, x: 'geography' },
            ],
            know: [
              'Institutional sources are scheduled commercial banks, regional rural banks, co-operative societies and banks, self-help groups and other institutional agencies. Non-institutional sources are agricultural and professional moneylenders, relatives and friends, and others.',
              'MoSPI prints each source, not the two totals, by state. We add them up. For India, the report gives the totals in Figure 5.9: 69.6% and 30.7%.',
              'In Arunachal Pradesh, loans from relatives and friends (23.5% of the amount) rest on 34 sample households.',
              DEBT_KNOW,
              STATES_KNOW,
            ],
            processing: [
              'Read Statement 5.8.1 of NSS Report No. 587: the share of the amount owed to each of ten sources, India and each state.',
              'Check each source against the "all sizes" row of Table 29 of Appendix A for that state. All agree within the rounding of the parts.',
              'Derived: add the six institutional sources (columns 2 to 7) and the four non-institutional sources (columns 8 to 11) of Statement 5.8.1. Each total is marked derived in the CSV.',
              'Check the India totals against Figure 5.9 of the report (69.6 and 30.7). Both agree.',
              'Sort the states by the non-institutional share, highest first.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How much land do farm households have?',
      lede: 'In July to December 2018, 34.2% of agricultural households had 0.01 to 0.40 ha of land, and 35.6% had 0.41 to 1.00 ha. Just 0.4% had more than 10.00 ha.',
      blocks: [
        {
          chart: {
            kind: 'bars',
            slug: 'land-possessed-by-farm-households',
            checked: CHECKED,
            title: 'Land possessed by agricultural households and all rural households, 2018',
            subtitle: 'Share of households in each size class of land possessed, agricultural households and all rural households, India.',
            punches: { office: 'MoSPI', unit: '% of households', period: 'Jul to Dec 2018' },
            status: ['Survey estimate'],
            note: 'Land possessed in July to December 2018, the first visit of the survey.',
            sources: [report587, nss77Api(16)],
            format: { unit: '%', decimals: 1 },
            by: 'land_possessed',
            rowHead: 'Land possessed',
            order: LAND_CLASSES,
            labels: LAND_LABELS,
            series: [
              { key: 'agricultural', label: 'Agricultural households', color: 's4', file: LAND, x: 'land_possessed', where: { geography: 'india', household_type: 'agricultural', land_possessed: [...LAND_CLASSES] } },
              { key: 'rural', label: 'All rural households', color: 'slate', file: LAND, x: 'land_possessed', where: { geography: 'india', household_type: 'rural', land_possessed: [...LAND_CLASSES] } },
            ],
            know: [
              'Land possessed is land owned, plus land leased in, minus land leased out, plus land otherwise possessed.',
              'Of rural households that are not agricultural, 69.0% had 0.01 to 0.40 ha and 26.8% had less than 0.01 ha.',
              HOUSEHOLD_KNOW,
            ],
            processing: [
              'Read Statement 1.3.1 of NSS Report No. 587: the India rows for agricultural and for all rural households.',
              'Check each share against indicator 16 of NSS round 77 on the eSankhyiki API, which gives the number of households in each class. Each share is within 0.05 percentage points of the count divided by the total. We publish the report shares and compute none.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'Marginal holdings, up to 1 ha, were 72.6% of operational holdings in 2018-19, against 69.8% in the 2002-03 kharif season. They covered 31.7% of the area operated, against 22.6%.',
        },
        {
          chart: {
            kind: 'bars',
            slug: 'operational-holdings-by-size',
            checked: CHECKED,
            title: 'Operational holdings in rural India by size, 2002-03 to 2018-19',
            subtitle: 'Share of operational holdings and of the area they operate, by size category, India, three NSS rounds.',
            punches: { office: 'MoSPI', unit: '% of holdings', period: '2018-19' },
            status: ['Survey estimate'],
            note: 'Each round is a separate survey. The 2002-03 round gives a kharif and a rabi value. Landless holdings are left out: 0.0% or no value.',
            sources: [report587],
            format: { unit: '%', decimals: 1 },
            by: 'size_category',
            rowHead: 'Size of holding',
            order: HOLDING_SIZES.map(([k]) => k),
            labels: Object.fromEntries(HOLDING_SIZES),
            axis: { min: 0, max: 80 },
            panels: [
              { label: 'Share of holdings', series: holdingSeries('share of holdings', 'holdings').map((s) => s.key) },
              { label: 'Share of area operated', series: holdingSeries('share of area operated', 'area').map((s) => s.key) },
            ],
            series: [...holdingSeries('share of holdings', 'holdings'), ...holdingSeries('share of area operated', 'area')],
            know: [
              'An operational holding is all the land that a household uses, wholly or partly, for agricultural production, owned or not.',
              'Report 587 reprints the 2012-13 and 2002-03 values from NSS Report No. 571. It gives one value for 2018-19 and for 2012-13, and a kharif and a rabi value for 2002-03. We show each value as published and do not join them.',
              'These are NSS survey estimates for rural India. The Agriculture Census counts holdings separately, and its figures differ.',
              RURAL_KNOW,
            ],
            processing: [
              'Read Statement 2.9 of NSS Report No. 587: the share of holdings and of area operated in each size category, India.',
              'Check that the categories of each round add up to 100 within rounding. All do.',
              'Leave out the landless category: 0.0% in 2018-19 and 2012-13, and no value in 2002-03.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
  ],
  about: {
    intro:
      'Every figure here comes from one survey of rural India: NSS round 77, 2019. It covers agricultural households: those that received more than ₹4,000 from agricultural activities in the last 365 days and had at least one member self-employed in agriculture. Households that live only on farm labour are not agricultural households, so their income and debt are not here. Crop area, production and yields will follow, from the Ministry of Agriculture and Farmers Welfare.',
    publisher:
      'The National Statistics Office (NSO), MoSPI, publishes NSS Report No. 587, Situation Assessment of Agricultural Households and Land and Livestock Holdings of Households in Rural India, 2019 (NSS round 77), and part of the same data on its eSankhyiki API.',
    frequency:
      'One survey round, January to December 2019, with two visits to each household. The report cover is dated September 2021. The earlier rounds were NSS round 70 (2013) and round 59 (2003). No date published for the next round.',
    revisions:
      'MoSPI has one edition of Report 587. The PDF was created on 10 Mar 2023, after the cover date; MoSPI does not say what changed.',
    breaks:
      'Round 77 counts rent from land leased out, which round 70 did not collect, and adds a set of incomes after imputed expenses. MoSPI asks for due care in any comparison with round 70, so this topic shows no income trend. The 2012-13 and 2002-03 holdings come from NSS Report No. 571, as Report 587 reprints them.',
    coverage:
      'Rural India only. India and 28 states one by one; Jammu and Kashmir includes Ladakh. Income is for July 2018 to June 2019, in rupees at current prices. Debt is the loan outstanding on the day of the first visit, January to August 2019. Land possessed is for July to December 2018.',
    missing:
      'No crop area, production or yield yet: they come from the yearly crop statistics of the Ministry of Agriculture and Farmers Welfare, which asks for permission before reuse, and will follow. No value for Goa, Delhi or the UTs other than Jammu and Kashmir. No livestock, crop sales, crop insurance or MSP figures yet: the API has them, but they are not built. MoSPI states no reuse licence.',
  },
  sources: [report587, nss77Api(16), nss77Api(24)],
  related: [
    { label: 'Jobs: Workers by broad industry', href: '/charts/employment-by-industry-history/' },
    { label: 'Living standards: Household spending by state', href: '/charts/household-spending-by-state/' },
    { label: 'Economy: Share of output by sector', href: '/charts/gva-sector-shares/' },
    { label: 'How we check: method breaks', href: '/how-we-check/#part-3' },
  ],
}

export default topic
