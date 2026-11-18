import type { Series, Source, Topic } from '../types'

// Board S06. Data: research/data/religion-culture/README.md.

// LATER: copy F gives each religion a fixed colour slot; 'bars' colours by series, so charts 1.1 and 1.2 are ink (3.1 uses the slots).

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
  standfirst: 'All figures on this page come from Census 2011, the latest count of religion and mother tongue.',
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
      lede: 'In 2011, 96,62,57,353 people in India (79.80%) reported their religion as Hindu, 17,22,45,158 (14.23%) as Muslim and 2,78,19,588 (2.30%) as Christian. 28,67,303 people (0.24%) did not state a religion.',
      blocks: [
        {
          // LATER: the board adds a 100% strip of the eight shares and prints the number of people (column 'value') beside each bar.
          chart: {
            slug: 'religion-in-india',
            kind: 'bars',
            title: 'Religion in India, 2011',
            subtitle:
              'People by the religion they reported, % of all people and number of people, India, Census 2011.',
            punches: { office: 'ORGI', unit: '% of people', period: '2011' },
            // The board gives Sarna's count (from the C-01 Appendix). No CSV holds it, so the note names
            // the group without the number.
            note: '"Other religions and persuasions" groups many smaller faiths; the largest within it is Sarna. Shares are our arithmetic on the published counts (people ÷ all people × 100).',
            sources: [c01, c01Appendix],
            format: { unit: '%', decimals: 2 },
            by: 'religion',
            order: RELIGIONS,
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
          text: "The Hindu share of the population was 79.80% in 2011, against 80.46% in 2001. The Muslim share was 14.23%, against 13.43%. No other group's share moved by more than 0.2 percentage points.",
        },
        {
          // LATER: the board adds a "Change" column (2011 minus 2001, pp); 'bars' has no derived column. 2001 is slate, 2011 ink.
          chart: {
            slug: 'religion-change',
            kind: 'bars',
            title: 'Religion in India, 2001 and 2011',
            subtitle:
              'People by the religion they reported, % of all people, India, Census 2001 and Census 2011. Change in percentage points.',
            punches: { office: 'ORGI', unit: '% of people', period: '2001, 2011' },
            note: 'The 2001 total (1,02,86,10,328) leaves out three sub-divisions of Senapati district, Manipur, so it is 1,27,108 lower than the total in Table A-02. This has no visible effect on the shares. Change is the 2011 share minus the 2001 share.',
            sources: [c01Census2001, c01],
            format: { unit: '%', decimals: 2 },
            by: 'religion',
            order: RELIGIONS,
            series: [
              {
                key: '2001',
                label: '2001',
                color: 'slate',
                file: 'religion-culture/religion-india-2001-2011.csv',
                where: { period: '2001' },
                x: 'religion',
                y: 'share_pct',
              },
              {
                key: '2011',
                label: '2011',
                color: 'ink',
                file: 'religion-culture/religion-india-2001-2011.csv',
                where: { period: '2011' },
                x: 'religion',
                y: 'share_pct',
              },
            ],
            know: [
              'Both censuses use the same eight categories, so the shares compare directly.',
              'The 2001 table leaves out the Mao-Maram, Paomata and Purul sub-divisions of Senapati district, Manipur. Its total is 1,27,108 lower than the total in Table A-02.',
              'A change in share is in percentage points: the 2011 share minus the 2001 share.',
              'The 2001 tables use older state names: Uttaranchal, Orissa and Pondicherry.',
            ],
            processing: [
              'Read the India rows of Table C-01 for Census 2001 and Census 2011 (Excel).',
              'Divide each count by the total of the same census and round to two decimals.',
              'Subtract the 2001 share from the 2011 share for each religion.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'Which mother tongues do people report?',
      lede: 'In 2011, 52,83,47,193 people (43.63%) gave a mother tongue grouped under Hindi. Bengali came second with 9,72,37,669 (8.03%), then Marathi with 8,30,26,680 (6.86%). The Census lists 22 scheduled languages and 99 other languages, each with 10,000 or more speakers.',
      blocks: [
        {
          // LATER: the board draws languages outside the Eighth Schedule as hollow bars, prints the number of
          // people beside each bar, and labels the Hindi bar "Includes Bhojpuri and other mother tongues grouped under Hindi".
          chart: {
            slug: 'mother-tongues',
            kind: 'bars',
            title: 'Mother tongues in India, 15 largest languages, 2011',
            subtitle:
              'People by the language group of the mother tongue they reported, % of all people and number of people, India, Census 2011.',
            punches: { office: 'ORGI', unit: '% of people', period: '2011' },
            // The board gives Bhojpuri's count. No CSV holds it, so the note names it without the number.
            note: 'The Census groups mother tongues under a language. "Hindi" here includes Bhojpuri and other mother tongues grouped under Hindi, so it counts more people than those who reported Hindi itself. This chart shows mother tongue, not every language a person speaks. ORGI publishes second and third languages in Table C-17.',
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
              religionSeries('Sikh', 'sikh', 'Sikh', 's4'),
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
              { key: 'first-share', label: '%', where: { rank: '1' }, y: 'share_pct', format: { decimals: 2 } },
              { key: 'second', label: 'Second', where: { rank: '2' }, y: 'language' },
              { key: 'second-share', label: '%', where: { rank: '2' }, y: 'share_pct', format: { decimals: 2 } },
              { key: 'third', label: 'Third', where: { rank: '3' }, y: 'language' },
              { key: 'third-share', label: '%', where: { rank: '3' }, y: 'share_pct', format: { decimals: 2 } },
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
      'Chart 1.2 compares the same eight categories in Census 2001 and Census 2011. The 2001 total (1,02,86,10,328) leaves out three sub-divisions of Senapati district, Manipur, so it is 1,27,108 lower than the total in Table A-02. The 2001 tables use older names: Uttaranchal, Orissa and Pondicherry.',
    coverage:
      'Census 2011 had 35 units. Telangana is inside Andhra Pradesh, and Ladakh inside Jammu and Kashmir. Dadra and Nagar Haveli and Daman and Diu were two UTs; we add their counts and mark the sum "Derived", so the 2011 data on this page has 34 units. Mother tongues are grouped into languages as the Census groups them: "Hindi" includes Bhojpuri and other mother tongues. Table C-16 lists 22 scheduled languages and 99 others with 10,000 or more speakers.',
    missing:
      'There is no official count of religion or language after 2011. NFHS-5 (2019-21, IIPS for MoHFW) reports the religion of household heads; it is a sample survey, not a count. ORGI publishes bilingual and trilingual counts in Table C-17. ORGI states no open licence; its catalog pages say "Rights Reserved".',
  },
  // The board lists Table C-01 and its Appendix on one line; they are two files with two URLs.
  sources: [c01States, c01Appendix, c01Census2001, c16, gazette4505, gazette5913],
  rail: [
    {
      title: 'Census 2027',
      body: 'Census 2027 asks about religion and mother tongue again. No results are published yet. 25 Jan to 28 Feb 2027: Count in most states and UTs. 1 to 5 Mar 2027: Revision round. Not announced: Religion and language tables. Source: ORGI gazette notifications, 14 Aug and 30 Oct 2026.',
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
