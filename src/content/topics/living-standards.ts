import type { Breakpoint, Color, Series, Source, Topic } from '../types'

// Sources: research/data/living-standards/README.md, "Sources".

// Released with the press note of 30 Jan 2025; the PDF was created the same day.
const hces2023_24: Source = {
  publisher: 'NSO, MoSPI',
  release: 'NSS Report No. 592, Survey on Household Consumption Expenditure: 2023-24',
  released: '2025-01-30',
  url: 'https://www.mospi.gov.in/sites/default/files/publication_reports/Final_Report_HCES_2023-24L.pdf',
}

const hcesPress2023_24: Source = {
  publisher: 'NSO, MoSPI',
  release: 'Press note, Household Consumption Expenditure Survey: 2023-24 (detailed report)',
  released: '2025-01-30',
  url: 'https://www.mospi.gov.in/sites/default/files/press_release/HCES_Report202324_Press_Note_30012025.pdf',
}

// The press note of 30 Jan 2025 dates the report to June 2024; the PDF was created on 7 Jun 2024.
const hces2022_23: Source = {
  publisher: 'NSO, MoSPI',
  release: 'NSS Report No. 591, Survey on Household Consumption Expenditure: 2022-23',
  released: '2024-06',
  url: 'https://www.mospi.gov.in/sites/default/files/publication_reports/Report_591_HCES_2022-23New.pdf',
}

// The API gives no release date. Its values match the reports (README).
const hcesApi = (indicator: number): Source => ({
  publisher: 'NSO, MoSPI',
  release: `eSankhyiki API, Household Consumption Expenditure Survey (HCES), indicator ${indicator}`,
  released: 'not stated',
  url: `https://api.mospi.gov.in/api/hces/getHcesRecords?indicator_code=${indicator}&Format=JSON`,
})

// NSS round 79, July 2022 to June 2023. The PDF is dated 9 Oct 2024.
const cams2022_23: Source = {
  publisher: 'NSO, MoSPI',
  release: 'NSS Report No. 590, CAMS 2022-23 (NSS round 79)',
  released: '2024-10-09',
  url: 'https://www.mospi.gov.in/sites/default/files/publication_reports/CAMS%20Report_October_N.pdf',
}

const camsApi = (indicators: string, code: number): Source => ({
  publisher: 'NSO, MoSPI',
  release: `eSankhyiki API, NSS round 79, CAMS 2022-23 (survey code 1), ${indicators}`,
  released: 'not stated',
  url: `https://api.mospi.gov.in/api/nss-79/getNss79Records?indicator_code=${code}&survey_code=1&Format=JSON`,
})

// NSS round 76, July to December 2018. The PDF is dated 22 Nov 2019.
const nss76: Source = {
  publisher: 'NSO, MoSPI',
  release: 'NSS Report No. 584, Drinking Water, Sanitation, Hygiene and Housing Condition in India (NSS round 76)',
  released: '2019-11-22',
  url: 'https://www.mospi.gov.in/sites/default/files/publication_reports/Report_584_final_0.pdf',
}

const nss76Api: Source = {
  publisher: 'NSO, MoSPI',
  release: 'eSankhyiki API, NSS round 76 (survey code 2), indicator 16',
  released: 'not stated',
  url: 'https://api.mospi.gov.in/api/nss-76/getNss76Records?indicator_code=16&survey_code=2&Format=JSON',
}

const MPCE_STATE = 'living-standards/mpce-by-state.csv'
const MPCE_ROUNDS = 'living-standards/mpce-india-rounds.csv'
const ITEM_SHARES = 'living-standards/mpce-item-shares-india-rounds.csv'
const FOOD_STATE = 'living-standards/food-share-by-state.csv'
const GINI = 'living-standards/gini-mpce.csv'
const AMENITIES = 'living-standards/household-amenities-by-state.csv'
const INTERNET = 'living-standards/internet-and-ict-skills-by-state.csv'
const BANK = 'living-standards/bank-account-by-state.csv'

const CHECKED = '2026-11-25'

/** HCES values without imputation: the set that compares with surveys before 2022-23. */
const HCES = { period: '2023-24', imputation: 'without' } as const

/** Survey rounds with one method: MRP to 2004-05, MMRP to 2011-12, HCES from 2022-23. */
const ROUNDS = [
  ['mrp', ['1999-00', '2004-05']],
  ['mmrp', ['2009-10', '2011-12']],
  ['hces', ['2022-23', '2023-24']],
] as const

/** Both breaks on the spending and food lines. */
const ROUND_BREAKS: readonly Breakpoint[] = [
  { x: '2009-10', label: 'Modified recall period' },
  { x: '2022-23', label: 'HCES method', before: 'NSS rounds' },
]

const SECTORS = [
  ['rural', 'Rural', 's4'],
  ['urban', 'Urban', 's5'],
] as const satisfies readonly (readonly [string, string, Color])[]

/** One line per sector and method, so no line joins values across a method break. */
const roundSeries = (file: string, where: Record<string, string>): Series[] =>
  SECTORS.flatMap(([sector, label, color]) =>
    ROUNDS.map(([method, periods]) => ({ key: `${sector}-${method}`, label, color, file, where: { ...where, sector, period: periods } })),
  )

const HCES_BREAK_KNOW =
  'MoSPI lists four changes from HCES 2022-23: about 405 items instead of about 347, three questionnaires instead of one, three monthly visits instead of one, and computer-assisted interviews. It says to note these when comparing with 2011-12 and earlier.'

const SMALL_SAMPLE_KNOW =
  'MoSPI warns that small states and UTs have small samples. CAMS surveyed 80 urban households in Chandigarh, 159 in Lakshadweep and 160 in Ladakh.'

/** Women and men, everyone in the age group, rural and urban together. */
const sexSeries = (file: string, where: Record<string, string>): Series[] => [
  { key: 'female', label: 'Women', color: 's3', file, where: { ...where, sex: 'female', sector: 'rural+urban' }, x: 'geography' },
  { key: 'male', label: 'Men', color: 's2', file, where: { ...where, sex: 'male', sector: 'rural+urban' }, x: 'geography' },
  // The Map tab, the sort and the headline figure; not drawn.
  { key: 'person', label: 'Everyone', color: 'ink', hidden: true, file, where: { ...where, sex: 'person', sector: 'rural+urban' }, x: 'geography' },
]

const SKILLS = [
  ['used internet in last 3 months', 'Used the internet'],
  ['sent messages with attached files in last 3 months', 'Sent a message with a file'],
  ['used copy and paste in last 3 months', 'Used copy and paste'],
  ['can send or receive email', 'Can send or receive email'],
] as const

const topic: Topic = {
  slug: 'living-standards',
  name: 'Living standards',
  hindi: 'जीवन स्तर',
  question: 'How much do households spend, and what do they have at home?',
  standfirst:
    'In 2023-24, households in villages spent ₹4,122 a month on each person, and households in towns ₹6,996. This topic has no income or poverty figures: these surveys measure spending, not income.',
  figures: [
    { chart: 'household-spending-by-state', series: 'rural', x: 'india', label: 'Rural spending per person, a month' },
    { chart: 'clean-cooking-fuel-by-state', label: 'Households that cook with clean fuel' },
    { chart: 'internet-use-women-and-men', series: 'person', x: 'india', label: 'Used the internet in the last 3 months, ages 15+' },
  ],
  nextRelease: 'not announced',
  parts: [
    {
      title: 'How much do households spend?',
      lede: 'In 2023-24, rural spending per person ranged from ₹2,739 a month in Chhattisgarh to ₹9,377 in Sikkim. In every state and UT, urban households spent more per person than rural households.',
      blocks: [
        {
          chart: {
            kind: 'dots',
            slug: 'household-spending-by-state',
            checked: CHECKED,
            title: 'Household spending per person by state, rural and urban, 2023-24',
            subtitle: 'Monthly per capita consumption expenditure (MPCE), rupees at current prices, by state and UT.',
            punches: { office: 'MoSPI', unit: '₹ a month', period: '2023-24' },
            status: ['Survey estimate'],
            note: 'Values without imputation for free items. Small states and UTs have wide margins of error.',
            sources: [hces2023_24, hcesApi(1)],
            format: { unit: '₹', decimals: 0 },
            by: 'geography',
            pin: ['india'],
            sortBy: 'rural',
            map: { series: 'rural', scale: 'seq' },
            series: [
              { key: 'rural', label: 'Rural', color: 's4', file: MPCE_STATE, where: { ...HCES, sector: 'rural' }, x: 'geography' },
              { key: 'urban', label: 'Urban', color: 's5', file: MPCE_STATE, where: { ...HCES, sector: 'urban' }, x: 'geography' },
            ],
            know: [
              'MPCE is the consumption of a household in a month divided by the number of people in it. It counts what a household buys, grows or receives, not what it earns.',
              'HCES 2023-24 ran from August 2023 to July 2024 and covered 2,61,953 households.',
              'MoSPI also publishes values with imputation, which add a value for free items from welfare schemes, such as PDS grain and free laptops. With imputation, rural MPCE was ₹4,247 in 2023-24. This chart uses the values without imputation, which compare with earlier surveys.',
              'The relative standard error is under 5% for most states, but 16.87% for urban Telangana, 13.42% for rural Dadra and Nagar Haveli and Daman and Diu and 11.52% for urban Chandigarh.',
              'Values are in current prices. MoSPI deflates only the India values, not the state values.',
            ],
            processing: [
              'Read indicator 1 of the HCES API from the eSankhyiki API.',
              'Check all 148 cells of Statement 1 in NSS Report No. 592 and NSS Report No. 591. All agree.',
              'Read the relative standard errors from Table C1 of each report.',
              'Match state names to the site geography table.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'At 2011-12 prices, rural spending per person rose from ₹978 a month in 1999-00 to ₹2,079 in 2023-24. Urban spending rose from ₹1,823 to ₹3,632. The survey method changed after 2011-12, so the last two rounds do not compare exactly with the earlier ones.',
        },
        {
          chart: {
            kind: 'line',
            slug: 'household-spending-over-time',
            checked: CHECKED,
            title: 'Household spending per person in India, 1999-00 to 2023-24',
            subtitle: 'Monthly per capita consumption expenditure, rural and urban, rupees at 2011-12 prices.',
            punches: { office: 'MoSPI', unit: '₹ at 2011-12 prices', period: '2023-24' },
            status: ['Survey estimate', 'Method break'],
            note: 'Lines break where the survey method changed: in 2009-10 (recall period) and in 2022-23 (HCES). Survey rounds come at uneven intervals.',
            sources: [hces2023_24],
            format: { unit: '₹', decimals: 0 },
            y: { min: 0 },
            joined: true,
            breaks: ROUND_BREAKS,
            series: roundSeries(MPCE_ROUNDS, { geography: 'india', prices: '2011-12 prices' }),
            know: [
              'MoSPI converts each round to 2011-12 prices with its own price indices: CPI for agricultural and industrial workers before 2011-12, and CPI rural and urban after it.',
              'At current prices, rural MPCE was ₹1,430 in 2011-12 and ₹4,122 in 2023-24. Urban MPCE was ₹2,630 and ₹6,996.',
              HCES_BREAK_KNOW,
              'The 1999-00 and 2004-05 rounds use the mixed recall period (MRP). From 2009-10, MoSPI uses the modified mixed recall period (MMRP).',
              'All values are without imputation for free items.',
            ],
            processing: [
              'Read Table 3.3 of NSS Report No. 592: India, rural and urban, current prices and 2011-12 prices.',
              'Check the 2022-23 and 2023-24 values at current prices against indicator 1 of the HCES API.',
              'Keep each method on its own line.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'What share of spending goes on food?',
      lede: 'In 2023-24, food took 47.04% of rural spending, against 59.40% in 1999-00. In towns, food took 39.68% of spending.',
      blocks: [
        {
          chart: {
            kind: 'line',
            slug: 'food-share-of-spending',
            checked: CHECKED,
            title: 'Share of household spending on food in India, 1999-00 to 2023-24',
            subtitle: 'Food as a share of monthly per capita consumption expenditure, rural and urban, India.',
            punches: { office: 'MoSPI', unit: '% of MPCE', period: '2023-24' },
            status: ['Survey estimate', 'Method break'],
            note: 'Lines break where the survey method changed: in 2009-10 (recall period) and in 2022-23 (HCES).',
            sources: [hces2023_24, hcesApi(4)],
            format: { unit: '%', decimals: 2 },
            y: { min: 0, max: 70, step: 10 },
            joined: true,
            breaks: ROUND_BREAKS,
            series: roundSeries(ITEM_SHARES, { geography: 'india', item_group: 'food: total' }),
            know: [
              'Food covers cereals, pulses, milk, sugar and salt, edible oil, egg, fish and meat, vegetables, fruit, spices, beverages and processed food.',
                            HCES_BREAK_KNOW,
              'Values are without imputation for free items.',
            ],
            processing: [
              'Read Tables 3.11R and 3.11U of NSS Report No. 592, row "food: total".',
              'Check the 2022-23 and 2023-24 values against indicator 4 of the HCES API.',
              'Keep each method on its own line.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'In 2023-24, food took more than half of rural spending in eight states and UTs, among them Assam (53.22%), Bihar (52.53%) and West Bengal (51.54%). In rural Kerala and Delhi it took 40.32%.',
        },
        {
          chart: {
            kind: 'states',
            slug: 'food-share-by-state',
            checked: CHECKED,
            title: 'Share of rural household spending on food by state, 2023-24',
            subtitle: 'Food as a share of monthly per capita consumption expenditure in villages, by state and UT.',
            punches: { office: 'MoSPI', unit: '% of MPCE', period: '2023-24' },
            status: ['Survey estimate'],
            note: 'Rural households, values without imputation. Small states and UTs have wide margins of error.',
            sources: [hces2023_24, hcesApi(4)],
            format: { unit: '%', decimals: 2 },
            data: { file: FOOD_STATE, where: { ...HCES, sector: 'rural', item_group: 'food' }, x: 'geography' },
            open: 'map',
            scale: 'seq',
            short: 'Food share, rural',
            know: [
              'The share is food spending divided by all consumption spending, for rural households.',
              'In towns, the India share was 39.68%. It was highest in Lakshadweep (54.10%) and Ladakh (52.63%).',
            ],
            processing: [
              'Read the "Food Total" category of indicator 4 of the HCES API.',
              'Check it against rows 15 and 31 of Statements 4R, 4U, 11R and 11U of NSS Reports No. 592 and 591. All 1,184 cells agree.',
              'Match state names to the site geography table.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'Is spending becoming more equal?',
      lede: 'In 2023-24, the Gini coefficient of rural spending was 0.237, against 0.283 in 2011-12. In towns it was 0.284, against 0.363.',
      blocks: [
        {
          text: 'The Gini coefficient measures how unequal spending is, from 0, where everyone spends the same, to 1, where one person spends everything. The survey method changed after 2011-12.',
        },
        {
          chart: {
            kind: 'columns',
            slug: 'consumption-inequality',
            checked: CHECKED,
            title: 'Inequality of household spending in India, 2011-12 to 2023-24',
            subtitle: 'Gini coefficient of monthly per capita consumption expenditure, rural and urban, India.',
            punches: { office: 'MoSPI', unit: 'Gini, 0 to 1', period: '2023-24' },
            status: ['Survey estimate', 'Method break'],
            note: 'A lower value means more equal spending. The survey method changed after 2011-12.',
            sources: [hces2023_24, hcesApi(9)],
            format: { decimals: 3 },
            y: { min: 0, max: 0.4, step: 0.1 },
            breaks: [{ x: '2022-23', label: 'HCES method', before: 'NSS round 68' }],
            series: [
              { key: 'rural', label: 'Rural', color: 's4', file: GINI, where: { geography: 'india', sector: 'rural', imputation: 'without' } },
              { key: 'urban', label: 'Urban', color: 's5', file: GINI, where: { geography: 'india', sector: 'urban', imputation: 'without' } },
            ],
            know: [
              'The Gini coefficient measures inequality of consumption spending, not of income or wealth.',
              HCES_BREAK_KNOW,
              'Values are without imputation for free items. With imputation, the 2023-24 values were 0.230 for rural and 0.279 for urban India.',
            ],
            processing: [
              'Read the 2011-12 values from Table 3.15 of NSS Report No. 592. Table 3.15 of NSS Report No. 591 gives the same values.',
              'Read 2022-23 and 2023-24 from indicator 9 of the HCES API, and check them against Statements 9 and 15 of each report.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How many homes have clean cooking fuel and an improved water source?',
      lede: 'In 2022-23, 63.4% of households cooked mainly with clean fuel, such as LPG or electricity. In towns the share was 92.9%; in villages it was 49.3%.',
      blocks: [
        {
          chart: {
            kind: 'states',
            slug: 'clean-cooking-fuel-by-state',
            checked: CHECKED,
            title: 'Households that cook with clean fuel by state, 2022-23',
            subtitle: 'Share of households whose main cooking fuel is LPG, natural gas, biogas, electricity or solar, by state and UT.',
            punches: { office: 'MoSPI', unit: '% households', period: '2022-23' },
            status: ['Survey estimate'],
            note: 'The share counts households with a cooking arrangement. Small states and UTs have small samples.',
            sources: [cams2022_23, camsApi('indicator 27', 27)],
            format: { unit: '%', decimals: 1 },
            data: { file: AMENITIES, where: { measure: 'clean fuel for cooking', sector: 'rural+urban' }, x: 'geography' },
            open: 'map',
            scale: 'seq',
            better: 'high',
            short: 'Clean cooking fuel',
            know: [
              'Clean fuel means that the main source of energy for cooking is LPG or other natural gas, gobar gas or other biogas, electricity (solar and wind included) or a solar cooker.',
              'In rural Jharkhand, 18.1% of households cooked with clean fuel.',
              'CAMS 2022-23 (NSS round 79) ran from July 2022 to June 2023.',
              SMALL_SAMPLE_KNOW,
            ],
            processing: [
              'Read indicator 27 of NSS round 79, survey code 1, from the eSankhyiki API.',
              'Check every value in Table 25 of NSS Report No. 590. All agree.',
              'Match state names to the site geography table.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'In 2022-23, 95.7% of households had an improved main source of drinking water. The share was lowest in Lakshadweep (43.5%), Kerala (54.4%) and Manipur (65.6%).',
        },
        {
          chart: {
            kind: 'dots',
            slug: 'improved-drinking-water-by-state',
            checked: CHECKED,
            title: 'Households with an improved source of drinking water by state, 2018 and 2022-23',
            subtitle: 'Share of households whose main source of drinking water is an improved source, by state and UT.',
            punches: { office: 'MoSPI', unit: '% households', period: '2022-23' },
            status: ['Survey estimate'],
            note: 'Filled dots: CAMS 2022-23. Rings: NSS round 76, July to December 2018. In 2018, Jammu and Kashmir included Ladakh.',
            sources: [cams2022_23, camsApi('indicator 28', 28), nss76, nss76Api],
            format: { unit: '%', decimals: 1 },
            by: 'geography',
            pin: ['india'],
            hollow: ['nss-2018'],
            sortBy: 'cams-2022-23',
            map: { series: 'cams-2022-23', scale: 'seq', better: 'high' },
            series: [
              {
                key: 'cams-2022-23',
                label: '2022-23',
                color: 'ink',
                file: AMENITIES,
                where: { measure: 'improved principal source of drinking water', period: '2022-23', sector: 'rural+urban' },
                x: 'geography',
              },
              {
                key: 'nss-2018',
                label: '2018',
                color: 'slate',
                file: AMENITIES,
                where: { measure: 'improved principal source of drinking water', period: '2018', sector: 'rural+urban' },
                x: 'geography',
                note: 'note',
              },
            ],
            know: [
              'Improved sources are 12 of 17 source types: bottled water, piped water into the dwelling, yard or plot, piped water from a neighbour, a public tap, a tube well, a hand pump, a protected well, a public or private tanker truck, a protected spring and rainwater collection.',
              'Both surveys use the same 17 source types and the same 12 improved types. The 2018 round ran for six months and CAMS for twelve.',
              'The 2018 values have no row for Ladakh, then part of Jammu and Kashmir, or for Dadra and Nagar Haveli and Daman and Diu, then two UTs.',
              'The API gives the 2018 values of Tripura and Uttarakhand under each other. We use the values in the report.',
              SMALL_SAMPLE_KNOW,
            ],
            processing: [
              'Read indicator 28 of NSS round 79 and indicator 16 of NSS round 76 from the eSankhyiki API.',
              'Check 2022-23 against Table 26 of NSS Report No. 590 and 2018 against Statement 6.1 of NSS Report No. 584.',
              'Use the report values for Tripura and Uttarakhand in 2018.',
              'Match state names to the site geography table.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How many people use the internet?',
      lede: 'In 2022-23, 49.3% of women aged 15 and over had used the internet in the last 3 months, against 65.5% of men.',
      blocks: [
        {
          chart: {
            kind: 'dots',
            slug: 'internet-use-women-and-men',
            checked: CHECKED,
            title: 'Internet use by state, women and men, 2022-23',
            subtitle: 'Share of people aged 15 and over who used the internet in the last 3 months, by state and UT.',
            punches: { office: 'MoSPI', unit: '% aged 15+', period: '2022-23' },
            status: ['Survey estimate'],
            note: 'Rural and urban together. Small states and UTs have small samples.',
            sources: [cams2022_23, camsApi('indicator 19', 19)],
            format: { unit: '%', decimals: 1 },
            by: 'geography',
            pin: ['india'],
            sortBy: 'person',
            axis: { min: 0, max: 100 },
            map: { series: 'person', scale: 'seq', better: 'high' },
            series: sexSeries(INTERNET, { measure: 'used internet in last 3 months', age_group: '15+' }),
            know: [
              'The measure counts people who used the internet in the last 3 months.',
              'Women used the internet least in Bihar (40.1%) and Odisha (40.8%), and most in Mizoram (91.5%).',
              SMALL_SAMPLE_KNOW,
            ],
            processing: [
              'Read indicator 19 of NSS round 79, survey code 1, from the eSankhyiki API.',
              'Check every value in Table 17 of NSS Report No. 590, for all three age groups. All agree.',
              'Match state names to the site geography table.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'Among people aged 15 to 24, 78.3% of women and 87.9% of men had used the internet in the last 3 months. Fewer had used copy and paste: 64.9% of women and 76.9% of men.',
        },
        {
          chart: {
            kind: 'bars',
            slug: 'digital-skills',
            checked: CHECKED,
            title: 'Digital skills of young people in India, women and men, 2022-23',
            subtitle: 'Share of people aged 15 to 24 who did each task in the last 3 months, India.',
            punches: { office: 'MoSPI', unit: '% aged 15-24', period: '2022-23' },
            status: ['Survey estimate'],
            note: 'Email is a skill the person says they have. The other tasks were done in the last 3 months.',
            sources: [cams2022_23, camsApi('indicators 19, 21, 22 and 23', 19)],
            format: { unit: '%', decimals: 1 },
            by: 'measure',
            rowHead: 'Task',
            order: SKILLS.map(([m]) => m),
            labels: Object.fromEntries(SKILLS),
            series: [
              { key: 'female', label: 'Women', color: 's3', file: INTERNET, where: { geography: 'india', age_group: '15-24', sex: 'female', sector: 'rural+urban', measure: SKILLS.map(([m]) => m) } },
              { key: 'male', label: 'Men', color: 's2', file: INTERNET, where: { geography: 'india', age_group: '15-24', sex: 'male', sector: 'rural+urban', measure: SKILLS.map(([m]) => m) } },
            ],
            know: [
              'CAMS gives each task for ages 15 to 24, 15 to 29 and 15 and over. This chart shows ages 15 to 24.',
              'For email, the survey asked whether the person can send or receive email. For the other tasks, it asked whether they did them in the last 3 months.',
              'Among everyone aged 15 and over, 43.4% could send or receive email.',
            ],
            processing: [
              'Read indicators 19, 21, 22 and 23 of NSS round 79, survey code 1, from the eSankhyiki API.',
              'Check them against Tables 17, 19, 20 and 21 of NSS Report No. 590. All agree.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How many adults have a bank account?',
      lede: 'In 2022-23, 94.6% of people aged 18 and over had an account with a bank, another financial institution or a mobile money provider: 92.8% of women and 96.2% of men.',
      blocks: [
        {
          chart: {
            kind: 'dots',
            slug: 'bank-accounts-women-and-men',
            checked: CHECKED,
            title: 'Bank and mobile money accounts by state, women and men, 2022-23',
            subtitle: 'Share of people aged 18 and over with an account, alone or jointly, by state and UT.',
            punches: { office: 'MoSPI', unit: '% aged 18+', period: '2022-23' },
            status: ['Survey estimate'],
            note: 'Accounts in a bank, another financial institution or with a mobile money provider. Small states and UTs have small samples.',
            sources: [cams2022_23, camsApi('indicator 14', 14)],
            format: { unit: '%', decimals: 1 },
            by: 'geography',
            pin: ['india'],
            sortBy: 'female',
            axis: { min: 50, max: 100 },
            map: { series: 'female', scale: 'seq', better: 'high' },
            series: sexSeries(BANK, { measure: 'has a bank or mobile money account', age_group: '18+' }),
            know: [
              'An account counts if the person holds it alone or jointly with someone else.',
              'The share of women with an account was lowest in Manipur (78.9%) and Meghalaya (80.3%).',
              SMALL_SAMPLE_KNOW,
            ],
            processing: [
              'Read indicator 14 of NSS round 79, survey code 1, from the eSankhyiki API.',
              'Check every value in Table 12 of NSS Report No. 590. All 333 agree.',
              'Match state names to the site geography table.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
  ],
  about: {
    intro:
      'Every figure here comes from a household survey. This topic has no income, poverty line or housing stock data: the surveys measure spending and household amenities, not income or the houses people live in.',
    publisher:
      "NSO, MoSPI, publishes all three surveys: the Household Consumption Expenditure Survey (HCES) 2022-23 and 2023-24, the CAMS 2022-23 survey (NSS round 79), and NSS round 76 (2018) on drinking water and housing.",
    frequency:
      'HCES: 2022-23 and 2023-24; the round before was 2011-12. The 2023-24 report came out on 30 Jan 2025. CAMS: 2022-23, report on 9 Oct 2024. NSS round 76: report on 22 Nov 2019. No release date published for the next rounds.',
    revisions: 'This page uses the first published edition of each report.',
    breaks:
      'HCES 2022-23 changed the method from the 2011-12 round: about 405 items instead of about 347, three questionnaires instead of one, three monthly visits instead of one, and computer-assisted interviews instead of pen and paper. A second break sits between 2004-05 and 2009-10, when the recall period changed. Drinking water uses one definition in 2018 and 2022-23, but the 2018 round ran for six months.',
    coverage:
      'India and all 36 states and UTs, rural and urban. Spending is in rupees per person per month, at current prices; only India has values at 2011-12 prices. Internet and skills cover ages 15 and over, bank accounts ages 18 and over. State series start in 2022-23.',
    missing:
      'No income, poverty line or housing stock. No ownership of durable goods such as fridges or vehicles: HCES publishes no table on it. Small states and UTs have small samples and wide errors. No publisher states a reuse licence.',
  },
  sources: [hces2023_24, hcesPress2023_24, hces2022_23, hcesApi(1), hcesApi(4), hcesApi(9), cams2022_23, camsApi('indicators 14, 19, 21 to 23, 27 and 28', 14), nss76, nss76Api],
  related: [
    { label: 'Prices: Consumer price inflation by state', href: '/charts/cpi-inflation-by-state/' },
    { label: 'Economy: Income per person by state', href: '/charts/income-per-person-by-state/' },
    { label: 'Education: Mean years of schooling by state', href: '/charts/mean-years-of-schooling-by-state/' },
    { label: 'Jobs: Women in the labour force by state', href: '/charts/women-labour-force-by-state/' },
    { label: 'How we check: method breaks', href: '/how-we-check/#part-3' },
  ],
}

export default topic
