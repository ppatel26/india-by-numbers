import type { Series, Source, Topic } from '../types'

// Data: research/data/religion-culture/README.md.

/** Each religion keeps one colour across the page (chart 1.1 and the by-state chart). */
const RELIGION_COLORS = {
  Hindu: 's1',
  Muslim: 's2',
  Christian: 's3',
  // Sikh is orange, not green, so it never sits beside Muslim teal in a look-alike hue.
  Sikh: 's8',
  Buddhist: 's5',
  Jain: 's6',
  'Other religions and persuasions': 's7',
  'Religion not stated': 'other',
} as const

const C01_URL =
  'https://censusindia.gov.in/nada/index.php/catalog/11361/download/14474/DDW00C-01%20MDDS.XLS'
const C16_URL =
  'https://censusindia.gov.in/nada/index.php/catalog/10191/download/13303/DDW-C16-STMT-MDDS-0000.XLSX'

const c01: Source = {
  publisher: 'ORGI',
  release: 'Census of India 2011, Table C-01, Population by religious community',
  released: '2021-01-21',
  url: C01_URL,
}

const c01States: Source = {
  ...c01,
  release: 'Census of India 2011, Table C-01, Population by religious community, India and States',
}

const c01Appendix: Source = {
  publisher: 'ORGI',
  release: 'Census of India 2011, Table C-01 Appendix, communities under "Other religions and persuasions"',
  released: '2021-01-21',
  url: 'https://censusindia.gov.in/nada/index.php/catalog/11398/download/14511/DDW00C-01%20Appendix%20MDDS.xlsx',
}

const c01Census2001: Source = {
  publisher: 'ORGI',
  release: 'Census of India 2001, Table C-01, Population by religious community, India and States',
  released: '2021-02-13',
  url: 'https://censusindia.gov.in/nada/index.php/catalog/21462/download/24594/PC01_C01_00.xls',
}

const historicalReligion: Source[] = [
  {
    publisher: 'ORGI',
    release: 'Census 1961, Paper 1 of 1963, religion, India totals for 1951',
    released: '1963',
    url: 'https://censusindia.gov.in/nada/index.php/catalog/31326/download/34507/53027_1961_REL.pdf',
  },
  {
    publisher: 'ORGI',
    release: 'Census 1971, Religion, Statement I, India totals for 1961 and 1971',
    released: '1972',
    url: 'https://censusindia.gov.in/nada/index.php/catalog/31626/download/34807/24477_1971_REI.pdf',
  },
  {
    publisher: 'ORGI',
    release: 'Census 1981, Paper 3 of 1984, Table HH-15, Household population by religion of head of household',
    released: '1984',
    url: 'https://censusindia.gov.in/nada/index.php/catalog/30879/download/34060/26795_1981_HH.pdf',
  },
  {
    publisher: 'ORGI',
    release: 'Census 1991, Table C-9, Religion, India',
    released: '2021-11-17',
    url: 'https://censusindia.gov.in/nada/index.php/catalog/35737/download/39400/1991-C09T-0100.xlsx',
  },
  {
    publisher: 'ORGI',
    release: 'Census 1991, Religion, Paper 1 of 1995, coverage notes for Table C-9',
    released: '1995',
    url: 'https://censusindia.gov.in/nada/index.php/catalog/32995/download/36813/48848_1991_REL.pdf',
  },
]

const c16: Source = {
  publisher: 'ORGI',
  release: 'Census of India 2011, Table C-16, Population by mother tongue (language statement)',
  released: '2022-07-04',
  url: C16_URL,
}

const c16States: Source = {
  ...c16,
  release: 'Census of India 2011, Table C-16, Population by mother tongue, India and States',
}

const gazette4505: Source = {
  publisher: 'ORGI',
  release: 'Gazette S.O. 4505(E), questions for Census 2027 phase II',
  released: '2026-08-14',
  url: 'https://censusindia.gov.in/nada/index.php/catalog/47163/download/51410/GAZ_NOTIFICATION_15.pdf',
}

const gazette5913: Source = {
  publisher: 'ORGI',
  release: 'Gazette S.O. 5913(E), Census 2027 count in most states',
  released: '2026-10-30',
  url: 'https://censusindia.gov.in/nada/index.php/catalog/47179/download/51426/GAZ_NOTIFICATION_20.pdf',
}

const RELIGIONS = [
  'Hindu',
  'Muslim',
  'Christian',
  'Sikh',
  'Buddhist',
  'Jain',
  'Other religions and persuasions',
  'Religion not stated',
] as const

const RELIGION_TREND = 'religion-culture/religion-india-1951-2011.csv'

const trendLabel = (religion: (typeof RELIGIONS)[number]) => {
  if (religion === 'Other religions and persuasions') return 'Other religions'
  if (religion === 'Religion not stated') return 'Unstated'
  return religion
}

const religionTrend: Series[] = RELIGIONS.flatMap((religion, i) =>
  ([
    ['early', ['1951', '1961', '1971']],
    ['household', ['1981']],
    ['later', ['1991', '2001', '2011']],
  ] as const).map(([key, years]) => ({
    key: `religion-${i}-${key}`,
    label: trendLabel(religion),
    color: RELIGION_COLORS[religion],
    file: RELIGION_TREND,
    where: { religion, period: years },
    y: 'share_pct',
  })),
)

const religionOthers1951: Series = {
  key: 'others-1951',
  label: '1951 Others',
  color: 'slate',
  file: RELIGION_TREND,
  where: { religion: 'Others' },
  y: 'share_pct',
}

const religionTrendKeys = (label: string) => religionTrend.filter((s) => s.label === label).map((s) => s.key)

const RELIGION_BY_STATE = 'religion-culture/religion-by-state-2011.csv'

const religionSeries = (
  religion: (typeof RELIGIONS)[number],
  key: string,
  label: string,
  color: Series['color'],
): Series => ({
  key,
  label,
  color,
  file: RELIGION_BY_STATE,
  where: { religion },
  x: 'geography',
  y: 'share_pct',
})

// The 15 largest languages by mother-tongue speakers, as on the board ("Others" is not a language).
const TOP_LANGUAGES = [
  'Hindi',
  'Bengali',
  'Marathi',
  'Telugu',
  'Tamil',
  'Gujarati',
  'Urdu',
  'Kannada',
  'Odia',
  'Malayalam',
  'Punjabi',
  'Assamese',
  'Maithili',
  'Bhili/Bhilodi',
  'Santali',
] as const

// Board order for the by-state charts: India, then states and UTs A to Z, then the two units with no
// 2011 figures of their own.
const STATE_ORDER = [
  'india',
  'andaman-nicobar',
  'andhra-pradesh',
  'arunachal-pradesh',
  'assam',
  'bihar',
  'chandigarh',
  'chhattisgarh',
  'dnh-dd',
  'delhi',
  'goa',
  'gujarat',
  'haryana',
  'himachal-pradesh',
  'jammu-kashmir',
  'jharkhand',
  'karnataka',
  'kerala',
  'lakshadweep',
  'madhya-pradesh',
  'maharashtra',
  'manipur',
  'meghalaya',
  'mizoram',
  'nagaland',
  'odisha',
  'puducherry',
  'punjab',
  'rajasthan',
  'sikkim',
  'tamil-nadu',
  'tripura',
  'uttar-pradesh',
  'uttarakhand',
  'west-bengal',
  'telangana',
  'ladakh',
] as const

const topic: Topic = {
  slug: 'religion-and-culture',
  name: 'Religion and culture',
  hindi: 'धर्म और संस्कृति',
  question: 'What religions do people in India report, and in what numbers?',
  standfirst: 'Census 2011 is the latest count of religion and mother tongue. Earlier censuses record how religion shares changed.',
  figures: [
    { chart: 'religion-in-india', series: 'share', x: 'Hindu', label: 'Reported their religion as Hindu' },
    { chart: 'religion-in-india', series: 'share', x: 'Muslim', label: 'Reported their religion as Muslim' },
    // 121 is a derived count of the C-16 language rows (languages-count-2011.csv).
    {
      chart: 'mother-tongues',
      series: 'count',
      x: 'Languages with 10,000 or more speakers',
      format: { decimals: 0, unit: '' },
      label: 'Languages with 10,000+ speakers',
      period: '2011 · 22 scheduled, 99 other',
    },
  ],
  nextRelease: 'Census 2027 religion and language tables, not announced',
  parts: [
    {
      title: 'Which religions do people report?',
      lede: 'In 2011, 96.63 crore people in India (79.80%) reported their religion as Hindu, 17.22 crore (14.23%) as Muslim and 2.78 crore (2.30%) as Christian. 28.67 lakh people (0.24%) did not state a religion.',
      blocks: [
        {
          // LATER: the board adds a 100% strip of the eight shares and prints the number of people (column 'value') beside each bar.
          chart: {
            slug: 'religion-in-india',
            kind: 'bars',
            title: 'Religion in India, 2011',
            subtitle:
              'People by the religion they reported, % of all people, India, Census 2011.',
            punches: { office: 'ORGI', unit: '% of people', period: '2011' },
            // The board gives Sarna's count (from the C-01 Appendix). No CSV holds it, so the note names
            // the group without the number.
            note: '"Other religions and persuasions" groups many smaller faiths; the largest within it is Sarna. Shares are our arithmetic on the published counts (people ÷ all people × 100); rounded, they add to 100.02%.',
            sources: [c01, c01Appendix],
            format: { unit: '%', decimals: 2 },
            by: 'religion',
            order: RELIGIONS,
            colors: RELIGION_COLORS,
            series: [
              {
                key: 'share',
                label: 'Share of people',
                color: 'ink',
                file: 'religion-culture/religion-india-2011.csv',
                where: { residence: 'total' },
                x: 'religion',
                y: 'share_pct',
              },
            ],
            know: [
              'Religion is what each person reported to the census. The categories are the Census names, as published.',
              '"Other religions and persuasions" groups many smaller faiths. The C-01 Appendix lists them; Sarna is the largest.',
              'ORGI publishes counts. Each share is the count divided by all people, times 100, to two decimals.',
              'Table C-01 also splits each religion by rural and urban residence.',
              'No official count of religion exists after Census 2011. Census 2027 asks the question again.',
            ],
            processing: [
              'Read the India rows of Table C-01 (Excel): people by religious community, total, rural and urban.',
              'Divide each count by all people and round to two decimals.',
              'Read the C-01 Appendix for the communities inside "Other religions and persuasions".',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'The Hindu share was 84.98% in 1951 and 79.80% in 2011. The Muslim share was 9.91% in 1951 and 14.23% in 2011. Census coverage changed over this period.',
        },
        {
          chart: {
            slug: 'religion-change',
            kind: 'line',
            title: 'Population share by religion in India, 1951 to 2011',
            subtitle: 'Shares use all people covered by each religion table. In 1981 the Census usually used the household head’s religion.',
            punches: { office: 'ORGI', unit: '% of people', period: '1951 to 2011' },
            status: ['Method break'],
            note: 'The Census could not count Assam in 1981 or Jammu and Kashmir in 1991. Other exclusions affect the 1951, 1961, 1971, 1991 and 2001 totals.',
            sources: [...historicalReligion, c01Census2001, c01],
            format: { unit: '%', decimals: 2 },
            series: [...religionTrend, religionOthers1951],
            panels: [
              { label: 'Hindu', series: religionTrendKeys('Hindu') },
              { label: 'Muslim', series: religionTrendKeys('Muslim'), own: true },
              {
                label: 'Other categories',
                series: [...RELIGIONS.slice(2).map(trendLabel).flatMap(religionTrendKeys), religionOthers1951.key],
                own: true,
              },
            ],
            y: { min: 75, max: 90, step: 5 },
            breaks: [{ x: '1981', label: '1981 method' }],
            know: [
              '1951 excludes Jammu and Kashmir, Pondicherry and the North East Frontier Agency. The religion breakdown also excludes 268,602 people in Punjab. ORGI gives one combined Others category for this census.',
              'The 1961 and 1971 totals in the 1971 report exclude Sikkim. The 1961 religion breakdown also excludes Arunachal Pradesh, where the Census used an abridged schedule.',
              'In 1981 the Census used the head’s religion for normal and houseless households. It used individual returns for institutional households. The Census could not count Assam because of disturbed conditions.',
              'In 1991 the Census could not count Jammu and Kashmir or 33 villages of Akrani and Akkalkuwa tehsils in Dhule district, Maharashtra. ORGI included the village population from secondary sources in the total. The villages have no religion breakdown.',
              'The 2001 C-01 table excludes the Mao-Maram, Paomata and Purul sub-divisions of Senapati district, Manipur.',
            ],
            processing: [
              'Read the published India counts in the ORGI reports and workbooks.',
              'Divide each count by the population covered by the religion breakdown. Round to two decimals.',
              'Plot 1981 as separate points. Plot the combined 1951 Others category as a separate point.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'Which mother tongues do people report?',
      lede: 'In 2011, 52.83 crore people (43.63%) gave a mother tongue grouped under Hindi. Bengali came second with 9.72 crore (8.03%), then Marathi with 8.30 crore (6.86%). The Census lists 22 scheduled languages and 99 other languages, each with 10,000 or more speakers.',
      blocks: [
        {
          // LATER: the board draws languages outside the Eighth Schedule as hollow bars, prints the number of
          // people beside each bar, and labels the Hindi bar "Includes Bhojpuri and other mother tongues grouped under Hindi".
          chart: {
            slug: 'mother-tongues',
            kind: 'bars',
            title: 'Mother tongues in India, 15 largest languages, 2011',
            subtitle:
              'People by the language group of the mother tongue they reported, % of all people, India, Census 2011. The 15 shown cover 95.87% of people.',
            punches: { office: 'ORGI', unit: '% of people', period: '2011' },
            // The board gives Bhojpuri's count. No CSV holds it, so the note names it without the number.
            note: 'The Census groups mother tongues under a language. "Hindi" here includes Bhojpuri and other mother tongues grouped under Hindi, so it counts more people than those who reported Hindi itself. This chart shows mother tongue, not every language a person speaks. ORGI publishes second and third languages in Table C-17. * Bhili/Bhilodi is the only one of the 15 that is not among the 22 scheduled languages.',
            sources: [c16],
            format: { unit: '%', decimals: 2 },
            by: 'language',
            order: TOP_LANGUAGES,
            labels: { 'Bhili/Bhilodi': 'Bhili/Bhilodi *' },
            series: [
              {
                key: 'share',
                label: 'Share of people',
                color: 'ink',
                file: 'religion-culture/languages-india-2011.csv',
                where: { language: TOP_LANGUAGES },
                x: 'language',
                y: 'share_pct',
              },
              // Read for the third headline figure (121 languages); not drawn.
              {
                key: 'count',
                label: 'Number of languages',
                format: { decimals: 0 },
                color: 'ink',
                hidden: true,
                file: 'religion-culture/languages-count-2011.csv',
                where: { language: 'Languages with 10,000 or more speakers' },
                x: 'language',
              },
            ],
            know: [
              'Mother tongue is the language a person reported as their mother tongue. It is not every language a person speaks.',
              'The Census groups mother tongues under a language. "Hindi" includes Bhojpuri and many other mother tongues.',
              'Table C-16 lists 22 scheduled languages and 99 others, each with 10,000 or more speakers. Bhili/Bhilodi is the largest language outside the Eighth Schedule.',
              'ORGI publishes counts. Each share is the count divided by all people, times 100, to two decimals.',
              'ORGI publishes second and third languages in Table C-17.',
            ],
            processing: [
              'Read the India language statement of Table C-16 (Excel): people by language, with each mother tongue grouped under its language.',
              'Mark each language as in or outside the Eighth Schedule, as the statement does.',
              'Divide each count by all people and round to two decimals.',
              'Rank the languages by people and show the 15 largest. The data file keeps all 121 and the "Others" group.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How do religion and language differ between states?',
      lede: 'In 27 of the 34 units in the 2011 data, Hindus were the largest group. Muslims were the largest group in Lakshadweep (96.58%) and Jammu and Kashmir (68.31%), Sikhs in Punjab (57.69%), and Christians in Nagaland (87.93%), Mizoram (87.16%), Meghalaya (74.59%) and Arunachal Pradesh (30.26%). The 34 units are the 35 of Census 2011 with Dadra and Nagar Haveli and Daman and Diu counted as one.',
      blocks: [
        {
          // LATER: the board opens this frame on its Table view and has a Map tab, one religion at a time; 'bars' has neither.
          chart: {
            slug: 'religion-by-state',
            kind: 'bars',
            title: 'Religion by state and UT, 2011',
            subtitle: 'People by the religion they reported, % of each state or UT, states and UTs as in Census 2011.',
            punches: { office: 'ORGI', unit: '% of people', period: '2011' },
            note: 'Census 2011 had 35 units. Telangana (formed 2014) is counted inside Andhra Pradesh, and Ladakh (a UT since 2019) inside Jammu and Kashmir; they have no 2011 figures of their own. Dadra and Nagar Haveli and Daman and Diu were two UTs in 2011; their counts are added (derived), so the table has 34 units. Shares are derived from the published counts.',
            sources: [c01States],
            format: { unit: '%', decimals: 2 },
            by: 'geography',
            stacked: true,
            order: STATE_ORDER,
            labels: {
              telangana: 'Telangana (in Andhra Pradesh in 2011)',
              ladakh: 'Ladakh (in Jammu and Kashmir in 2011)',
            },
            series: [
              religionSeries('Hindu', 'hindu', 'Hindu', 's1'),
              religionSeries('Muslim', 'muslim', 'Muslim', 's2'),
              religionSeries('Christian', 'christian', 'Christian', 's3'),
              religionSeries('Sikh', 'sikh', 'Sikh', 's8'),
              religionSeries('Buddhist', 'buddhist', 'Buddhist', 's5'),
              religionSeries('Jain', 'jain', 'Jain', 's6'),
              religionSeries('Other religions and persuasions', 'other', 'Other religions and persuasions', 's7'),
              religionSeries('Religion not stated', 'not-stated', 'Religion not stated', 'other'),
            ],
            know: [
              'Religion is what each person reported to the census. The categories are the Census names, as published.',
              'Census 2011 had 35 units. Andhra Pradesh includes present-day Telangana, and Jammu and Kashmir includes present-day Ladakh.',
              'Dadra and Nagar Haveli and Daman and Diu were two UTs in 2011. Their row adds the two counts, marked Derived, so the data has 34 units.',
              'Each share is the count divided by all people in the state or UT, times 100, to two decimals.',
            ],
            processing: [
              'Read the state rows of Table C-01 (Excel): people by religious community, total of rural and urban.',
              'Map each Census 2011 unit to a present-day state or UT. Leave Telangana and Ladakh empty.',
              'Add the counts of Dadra and Nagar Haveli and of Daman and Diu.',
              'Divide each count by all people in the unit and round to two decimals.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'In 2011, 97.03% of people in Kerala gave Malayalam as their mother tongue. In Nagaland, the largest language, Konyak, was the mother tongue of 12.34%. Hindi was the largest language in 11 states and UTs.',
        },
        {
          // LATER: the board has Map and Chart tabs (tiles coloured by the largest language), and rows for
          // Telangana ("In Andhra Pradesh") and Ladakh ("In Jammu and Kashmir"); 'table' has neither.
          chart: {
            slug: 'mother-tongues-by-state',
            kind: 'table',
            title: 'Three largest mother tongues in each state and UT, 2011',
            subtitle:
              'Language groups by people who reported them as mother tongue, % of each state or UT, states and UTs as in Census 2011.',
            punches: { office: 'ORGI', unit: '% of people', period: '2011' },
            note: 'The "Others" group is left out when ranking. Language groups follow the Census; "Hindi" includes mother tongues such as Bhojpuri. Telangana and Ladakh have no 2011 tables of their own. Values for Dadra and Nagar Haveli and Daman and Diu are our sums of two 2011 UTs.',
            sources: [c16States],
            data: { file: 'religion-culture/languages-top3-by-state-2011.csv', x: 'geography' },
            by: 'geography',
            columns: [
              { key: 'first', label: 'Largest', where: { rank: '1' }, y: 'language' },
              { key: 'first-share', label: 'Largest, %', where: { rank: '1' }, y: 'share_pct', format: { decimals: 2 } },
              { key: 'second', label: 'Second', where: { rank: '2' }, y: 'language' },
              { key: 'second-share', label: 'Second, %', where: { rank: '2' }, y: 'share_pct', format: { decimals: 2 } },
              { key: 'third', label: 'Third', where: { rank: '3' }, y: 'language' },
              { key: 'third-share', label: 'Third, %', where: { rank: '3' }, y: 'share_pct', format: { decimals: 2 } },
            ],
            know: [
              'Mother tongue is the language a person reported as their mother tongue, grouped into languages as the Census groups them.',
              'The "Others" group is left out when ranking.',
              'Census 2011 had 35 units. Andhra Pradesh includes present-day Telangana, and Jammu and Kashmir includes present-day Ladakh.',
              'Dadra and Nagar Haveli and Daman and Diu were two UTs in 2011. Their row adds the two counts, marked Derived.',
            ],
            processing: [
              'Read the state language statements of Table C-16 (Excel): people by language in each state and UT.',
              'Leave out the "Others" group and rank the languages by people in each unit.',
              'Keep the three largest, and divide each count by all people in the unit, to two decimals.',
              'Map each Census 2011 unit to a present-day state or UT, and add the two 2011 UTs of Dadra and Nagar Haveli and Daman and Diu.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
  ],
  // LATER: the About band's side line ("How the religion and language counts are made, and what they leave out.") has no field.
  about: {
    intro:
      'Religion and mother tongue are what each person reported to the census. We use the Census category names as published. Shares are derived from the published counts, to two decimals.',
    publisher:
      'The Office of the Registrar General and Census Commissioner, India (ORGI), Ministry of Home Affairs, runs the Census. Religion comes from Table C-01, Population by religious community. Mother tongue comes from Table C-16, Population by mother tongue.',
    frequency:
      'Each census. Census 2011 is the latest count of religion and language. Census 2027 asks about religion and mother tongue again (questions notified on 14 August 2026). In most states its count runs from 25 January to 28 February 2027, with a revision round from 1 to 5 March 2027.',
    revisions:
      'Census 2011 tables are final. Census 2027 tables will replace them when ORGI publishes them; no date is announced.',
    breaks:
      'The 1981 Census used the household head’s religion for most people. Before and after 1981, the returns give each person’s religion. The population covered also changes between censuses.',
    coverage:
      'Census 2011 had 35 units. Telangana is inside Andhra Pradesh, and Ladakh inside Jammu and Kashmir. Dadra and Nagar Haveli and Daman and Diu were two UTs; we add their counts and mark the sum "Derived", so the 2011 data on this page has 34 units. Mother tongues are grouped into languages as the Census groups them: "Hindi" includes Bhojpuri and other mother tongues. Table C-16 lists 22 scheduled languages and 99 others with 10,000 or more speakers.',
    missing:
      'There is no official count of religion or language after 2011. NFHS-5 (2019-21, IIPS for MoHFW) reports the religion of household heads; it is a sample survey, not a count. ORGI publishes bilingual and trilingual counts in Table C-17. ORGI states no open licence; its catalog pages say "Rights Reserved".',
  },
  // The board lists Table C-01 and its Appendix on one line; they are two files with two URLs.
  sources: [c01States, c01Appendix, c01Census2001, ...historicalReligion, c16, gazette4505, gazette5913],
  rail: [
    {
      title: 'Census 2027',
      rows: [
        ['Asks', 'Religion and mother tongue'],
        ['Jan-Feb 2027', 'Count in most states and UTs'],
        ['1-5 Mar 2027', 'Revision round'],
        ['Tables', 'Not announced'],
      ],
      source: 'ORGI gazette notifications',
    },
  ],
  related: [
    { label: 'Population: Population growth by state and UT, 2001 to 2011', href: '/charts/population-growth-by-state/' },
    { label: 'Education: Literacy by state', href: '/charts/literacy-by-state/' },
    { label: 'States: Tamil Nadu profile', href: '/states/tamil-nadu/' },
    { label: 'How we check: derived shares', href: '/how-we-check/' },
  ],
}

export default topic
