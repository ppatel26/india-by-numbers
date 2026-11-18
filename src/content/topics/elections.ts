import type { Source, Topic } from '../types'


// --- Sources (research/data/elections/README.md, rows S1 to S16) ---

// S1. URL as in the README checks of 18 Nov 2026 (the "&" is percent-encoded).
const WMI_2025: Source = {
  publisher: 'MoSPI',
  release: 'Women and Men in India 2025',
  released: '2026-04-29',
  url: 'https://www.mospi.gov.in/uploads/publications_reports/publications_reports1777367728766_db830db0-1895-4032-82fe-f6daefed0f7f_Women_%26_Men_in_India_2025__Complete_publication.pdf',
}

const withTable = (s: Source, table: string): Source => ({ ...s, release: `${s.release}, ${table}` })
const WMI_5_2 = withTable(WMI_2025, 'Table 5.2')
const WMI_5_3 = withTable(WMI_2025, 'Table 5.3')
const WMI_5_6 = withTable(WMI_2025, 'Table 5.6')
const WMI_5_7 = withTable(WMI_2025, 'Table 5.7')

// S2. The file states no release date; the PDF is dated 25 Dec 2024, so the month is December 2024.
const ECI_REPORT_20: Source = {
  publisher: 'ECI',
  release: 'GE 2024 Statistical Report 20, Performance of National Parties',
  released: '2024-12',
  url: 'https://www.eci.gov.in/eci-backend/public/all_files/GE-2024-statistical-report/20-Performance-of-National-Parties.pdf',
}

// S3. The file states no release date; the PDF is dated 25 Dec 2024, so the month is December 2024.
const ECI_REPORT_33: Source = {
  publisher: 'ECI',
  release: 'GE 2024 Statistical Report 33, Constituency Wise Detailed Results',
  released: '2024-12',
  url: 'https://www.eci.gov.in/eci-backend/public/all_files/GE-2024-statistical-report/33-Constituency-Wise-Detailed-Result.pdf',
}

// S4. Page last updated 05/06/2024.
const ECI_RESULTS_JUN_2024: Source = {
  publisher: 'ECI',
  release: 'General Election to Parliamentary Constituencies: Trends and Results, June 2024',
  released: '2024-06-05',
  url: 'https://results.eci.gov.in/PcResultGenJune2024/index.htm',
}

// S5 (Delhi). Page last updated 08/02/2025.
const ECI_RESULTS_DELHI_2025: Source = {
  publisher: 'ECI',
  release: 'Trends and Results, February 2025 (NCT of Delhi)',
  released: '2025-02-08',
  url: 'https://results.eci.gov.in/ResultAcGenFeb2025/index.htm',
}

// S5 (Bihar). The page shows no update date; the board says "Nov 2025".
const ECI_RESULTS_BIHAR_2025: Source = {
  publisher: 'ECI',
  release: 'Trends and Results, November 2025 (Bihar)',
  released: 'not stated',
  url: 'https://results.eci.gov.in/ResultAcGenNov2025/index.htm',
}

// S6. Index page last updated 05/05/2026. The state pages (S03, S11, S22, S25, U07) sit under it.
const ECI_RESULTS_MAY_2026: Source = {
  publisher: 'ECI',
  release: 'Trends and Results, May 2026 (Assam, Kerala, Puducherry, Tamil Nadu, West Bengal)',
  released: '2026-05-05',
  url: 'https://results.eci.gov.in/ResultAcGenMay2026/index.htm',
}

// README check of 18 Nov 2026 (144-Falta re-poll). The page states no date. The
// README dates the declaration 24 May 2026 from Akashvani, a news source, so we do not use it here.
const ECI_RESULT_FALTA_2026: Source = {
  publisher: 'ECI',
  release: 'Trends and Results, May 2026: 144-Falta (West Bengal), re-poll result',
  released: 'not stated',
  url: 'https://results.eci.gov.in/ResultAcGenMay2026/candidateswise-S25144.htm',
}

// S7
const PIB_BIHAR_2025: Source = {
  publisher: 'ECI via PIB',
  release: 'Bihar Legislative Assembly elections: highest ever voter turnout of 67.13% (Release ID 2189428)',
  released: '2025-11-12',
  url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2189428',
}

// S10. Also gives Kerala.
const PIB_ASSAM_KERALA_PUDUCHERRY_2026: Source = {
  publisher: 'ECI via PIB',
  release: 'Assam and Puducherry record highest-ever poll participation (Release ID 2250605)',
  released: '2026-04-09',
  url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2250605&reg=48&lang=2',
}

// S11
const PIB_TN_WB1_2026: Source = {
  publisher: 'ECI via PIB',
  release: 'Tamil Nadu and West Bengal (Phase I) poll participation (Release ID 2255010)',
  released: '2026-04-23',
  url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2255010&reg=3&lang=2',
}

// S12. Also the source of "previous highest 84.72% (2011)".
const PIB_WB2_2026: Source = {
  publisher: 'ECI via PIB',
  release: 'West Bengal records highest-ever poll-participation since Independence (Release ID 2256756)',
  released: '2026-04-29',
  url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2256756&reg=3&lang=1',
}

// S14
const PIB_ECINET_2026: Source = {
  publisher: 'ECI via PIB',
  release: 'Index Cards and Statistical Reports published on ECINET; re-poll in 144-Falta, West Bengal (Release ID 2258991)',
  released: '2026-05-08',
  url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2258991&reg=3&lang=1',
}

// --- Picks ---

const STATES_AND_UTS = [
  'andhra-pradesh', 'arunachal-pradesh', 'assam', 'bihar', 'chhattisgarh', 'goa', 'gujarat', 'haryana',
  'himachal-pradesh', 'jharkhand', 'karnataka', 'kerala', 'madhya-pradesh', 'maharashtra', 'manipur',
  'meghalaya', 'mizoram', 'nagaland', 'odisha', 'punjab', 'rajasthan', 'sikkim', 'tamil-nadu', 'telangana',
  'tripura', 'uttar-pradesh', 'uttarakhand', 'west-bengal', 'andaman-nicobar', 'chandigarh', 'dnh-dd',
  'delhi', 'jammu-kashmir', 'ladakh', 'lakshadweep', 'puducherry',
] as const

// The board starts chart 2.1 at 1957: there is no sex break-up for 1951-52.
const ELECTIONS_FROM_1957 = [
  '1957', '1962', '1967', '1971', '1977', '1980', '1984', '1989', '1991', '1996', '1998', '1999',
  '2004', '2009', '2014', '2019', '2024',
] as const

const TURNOUT_BY_SEX = 'elections/lok-sabha-turnout-by-sex.csv'
const ELECTORS = 'elections/lok-sabha-electors.csv'
const WOMEN_CANDIDATES = 'elections/lok-sabha-women-candidates-and-mps.csv'
const TURNOUT_BY_STATE = 'elections/lok-sabha-2024-turnout-by-state.csv'
const SEATS_BY_STATE = 'elections/lok-sabha-2024-seats-and-women-mps-by-state.csv'
const NOTA_BY_STATE = 'elections/lok-sabha-2024-nota-by-state.csv'
const PARTY_RESULTS = 'elections/lok-sabha-2024-party-results.csv'
const ASSEMBLY_SEATS = 'elections/assembly-2025-2026-seats-by-party.csv'

const assembly = (geography: string, label: string) => ({
  key: geography,
  label,
  color: 'other' as const,
  file: ASSEMBLY_SEATS,
  where: { geography },
  x: 'party_abbr',
  y: 'seats_won',
})

const topic: Topic = {
  slug: 'elections',
  name: 'Elections',
  hindi: 'चुनाव',
  // Home tile (S01) lists two questions; the first is used here.
  question: 'What share of electors vote?',
  standfirst:
    'India had 97.80 crore electors at the 2024 general election, up from 17.32 crore at the first general election in 1951-52.',
  // LATER: the board's figure punch says "ECI"; a Figure takes the chart's office (MoSPI, which compiles ECI data).
  // LATER: Figure 2 has a footnote on the board ("* MoSPI's Women and Men in India 2025 gives 66.10% in Table 5.7 and 65.7% in Table 5.6.").
  // Figure 3 reads 74 from chart 2.1 (Table 5.2); Table 5.3 (chart 3.2) also gives 74 of 543.
  figures: [
    { chart: 'lok-sabha-electors', series: 'total', x: '2024', label: 'Electors', period: '2024 general election' },
    { chart: 'lok-sabha-turnout-by-state', label: 'Electors who voted', period: '2024 general election' },
    {
      chart: 'women-candidates-and-mps',
      series: 'elected',
      x: '2024',
      label: 'Women MPs, 13.62% of seats',
      period: '18th Lok Sabha · 20 Dec 2024',
      format: { decimals: 0, suffix: ' of 543' },
    },
  ],
  nextRelease: 'not announced',
  parts: [
    {
      title: 'How many people vote?',
      lede: "In 2024, 65.8% of women electors voted, against 65.6% of men. In 1962, the figures were 46.6% and 62.0%. Women's turnout first passed men's in 2019, at 67.2% against 67.0%, in the elections with figures by sex.",
      blocks: [
        {
          chart: {
            kind: 'line',
            slug: 'lok-sabha-turnout-by-sex',
            title: 'Lok Sabha turnout, women and men, 1952 to 2024',
            subtitle: 'Share of electors who voted at each general election, %. Women, men and all electors.',
            punches: { office: 'MoSPI', unit: '% of electors', period: '1952-2024' },
            note: 'This chart uses MoSPI Table 5.6, which gives 65.7% for all electors in 2024. Table 5.7 gives 66.10%, used in the headline figure and the state charts. The tables do not say why they differ. There are no figures by sex for 1952, 1957 and 1971. The 1952 and 1957 totals are calculated on valid votes polled. Both tables are MoSPI compilations of Election Commission of India data.',
            sources: [WMI_5_6],
            format: { decimals: 1, unit: '%' },
            y: { min: 40, max: 80, step: 10 },
            spans: [
              { from: '1952', to: '1957', label: 'No data by sex' },
              { from: '1971', to: '1971', label: 'No data by sex' },
            ],
            series: [
              { key: 'women', label: 'Women', color: 's3', file: TURNOUT_BY_SEX, where: { series: 'women' } },
              { key: 'total', label: 'All electors', color: 'ink', file: TURNOUT_BY_SEX, where: { series: 'total' } },
              { key: 'men', label: 'Men', color: 's2', file: TURNOUT_BY_SEX, where: { series: 'men' } },
            ],
            callouts: [
              { series: 'women', x: '1962' },
              { series: 'men', x: '1962' },
              { series: 'women', x: '2019' },
              { series: 'men', x: '2019' },
            ],
            know: [
              'Turnout is the share of electors on the roll who voted. MoSPI compiles these figures from Election Commission of India (ECI) data.',
              'MoSPI gives two values for 2024: 65.7% in Table 5.6 and 66.10% in Table 5.7. The tables do not say why. This chart uses Table 5.6 for every year.',
              'There are no figures by sex for 1952, 1957 and 1971, so the women and men lines have gaps there.',
              'The totals for 1952 and 1957 are calculated on valid votes polled, not on all votes.',
              'The first general election ran from October 1951 to February 1952. MoSPI dates it 1952.',
            ],
            processing: [
              'We take every value from Table 5.6 of MoSPI, Women and Men in India 2025.',
              'The table has no text layer, so we type the values from the page and check doubtful digits at a higher zoom.',
              'We keep the values as published, to one decimal place.',
              'We leave the years with no figures by sex empty. We do not estimate them.',
              'We do not put Table 5.7 values on this chart.',
            ],
            nextRelease: 'not announced',
          },
        },
        { text: 'The number of electors fell only once, in 1991, from 49.89 crore to 49.84 crore.' },
        {
          chart: {
            kind: 'line',
            slug: 'lok-sabha-electors',
            title: 'Number of electors, 1952 to 2024',
            subtitle: 'Electors on the roll at each Lok Sabha general election, crore.',
            punches: { office: 'MoSPI', unit: 'crore', period: '1952-2024' },
            note: 'The first general election ran in 1951-52; the source dates it 1952. Totals for 2014 to 2024 include third-gender electors.',
            sources: [WMI_5_6],
            // The CSV holds million electors (978.0); the chart prints crore (97.80 crore).
            format: { decimals: 2, scale: 'crore', multiply: 1e6 },
            y: { min: 0, max: 1000, step: 200 },
            series: [{ key: 'total', label: 'All electors', color: 'ink', file: ELECTORS, where: { series: 'total' } }],
            callouts: [
              { series: 'total', x: '1952' },
              { series: 'total', x: '1991' },
              { series: 'total', x: '2024' },
            ],
            know: [
              'An elector is a person on the electoral roll, so able to vote. MoSPI compiles the counts from Election Commission of India data.',
              'The first general election ran from October 1951 to February 1952. MoSPI dates it 1952.',
              'Totals for 2014, 2019 and 2024 include third-gender electors.',
              'For 1991, the published counts of men and women add up to less than the published total. We show the values as published.',
              'There is no count of electors by sex for 1952 and 1957.',
            ],
            processing: [
              'We take the totals from Table 5.6 of MoSPI, Women and Men in India 2025.',
              'The table has no text layer, so we type the values from the page and check doubtful digits at a higher zoom.',
              'MoSPI gives millions of electors. We show crore: 10 million is 1 crore.',
              'We keep the values as published and do not correct the 1991 totals.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How many women stand, and how many win?',
      lede: '800 women stood for the Lok Sabha in 2024, 9.6% of the 8,359 candidates. 74 of them won. In 1957, 45 women stood and 27 won. A woman who stood in 2024 was more likely to win than a man: 9.3% of women candidates won, against 6.2% of men.',
      blocks: [
        {
          chart: {
            kind: 'columns',
            slug: 'women-candidates-and-mps',
            title: 'Women candidates and women MPs, 1957 to 2024',
            subtitle: 'Number of women who stood for the Lok Sabha, and number elected, at each general election. The two panels have different scales: in 2024, 74 of 800 women candidates won.',
            punches: { office: 'MoSPI', unit: 'people', period: '1957-2024' },
            // The board marks the 1999 bar with "*" and starts the note's second sentence with "*".
            // LATER: no way to mark one column with a footnote symbol.
            note: 'There are no figures by sex for 1951-52. For 1999 the source gives 494 men and 52 women elected, 546 in total, more than the 543 seats; we show the values as published. The 2024 counts are for 542 seats polled; Surat was won unopposed.',
            sources: [WMI_5_2],
            format: { decimals: 0 },
            panels: [
              { label: 'Women candidates', series: ['candidates'], own: true },
              { label: 'Women MPs elected', series: ['elected'], own: true },
            ],
            series: [
              {
                key: 'candidates',
                label: 'Women candidates',
                color: 's3',
                file: WOMEN_CANDIDATES,
                where: { series: 'candidates_women', period: ELECTIONS_FROM_1957 },
              },
              {
                key: 'elected',
                label: 'Women MPs elected',
                color: 's3',
                file: WOMEN_CANDIDATES,
                where: { series: 'elected_women', period: ELECTIONS_FROM_1957 },
              },
            ],
            know: [
              'The counts come from the Election Commission of India and the Lok Sabha Secretariat, compiled by MoSPI.',
              'There is no break-up of candidates by sex for the first general election, in 1951-52.',
              'For 1999 the source gives 494 men and 52 women elected, 546 in all, more than the 543 seats. We keep the values as published.',
              'The 2024 counts cover the 542 seats that went to a poll. Surat was won unopposed.',
              'The Lok Sabha Secretariat gives a second count for the 18th Lok Sabha: 74 women MPs, 13.62% of 543 seats, as on 20 December 2024 (chart 3.2).',
            ],
            processing: [
              'We take the counts from Table 5.2 of MoSPI, Women and Men in India 2025.',
              'The table has no text layer, so we type the values from the page and check doubtful digits at a higher zoom.',
              'We checked the 2024 counts against ECI Report 33: 800 women candidates and 74 women elected in both.',
              'We keep the counts as published, including the 1999 values.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'Which states vote the most?',
      lede: '66.10% of electors voted in 2024. Turnout was lowest in Bihar, at 56.28%, and highest in Lakshadweep, at 84.98%. Among states with more than 2 crore electors, Assam (81.87%) and Andhra Pradesh (81.78%) had the highest turnout.',
      blocks: [
        {
          chart: {
            kind: 'states',
            slug: 'lok-sabha-turnout-by-state',
            title: 'Turnout by state and UT, 2024 general election',
            subtitle: 'Share of electors who voted, %, 18th Lok Sabha election, 2024. Darker tiles had higher turnout.',
            punches: { office: 'MoSPI', unit: '% of electors', period: '2024' },
            note: "Tamil Nadu, outlined, was 70.14%, above India's 66.10%. Gujarat excludes Surat, where the seat was won unopposed and no poll was held. Lakshadweep counts are rounded to thousands in the source.",
            sources: [WMI_5_7],
            format: { decimals: 2, unit: '%' },
            data: { file: TURNOUT_BY_STATE, where: { series: 'turnout_total' }, x: 'geography' },
            open: 'map',
            scale: 'seq',
            short: 'Lok Sabha turnout',
            know: [
              'Turnout is the share of electors on the roll who voted. MoSPI compiles it from ECI data for the 18th Lok Sabha election.',
              'India and Gujarat exclude Surat, where the seat was won unopposed and no poll was held.',
              'MoSPI gives 66.10% for India in Table 5.7 and 65.7% in Table 5.6. This chart uses Table 5.7.',
              'Lakshadweep counts are rounded to thousands in the source, so its rate is less exact than the others.',
              'The chart uses 2024 boundaries: Jammu and Kashmir and Ladakh are separate, and Dadra and Nagar Haveli and Daman and Diu are one UT.',
            ],
            processing: [
              'We take the published turnout for India and all 36 states and UTs from Table 5.7 of MoSPI, Women and Men in India 2025.',
              'The table has no text layer, so we type the values from the page and check doubtful digits at a higher zoom.',
              'We recompute voters divided by electors for every row. All 37 rows agree with the published rate within 0.6 points.',
              'We show the published rate, to two decimal places.',
            ],
            nextRelease: 'not announced',
          },
        },
        { text: 'West Bengal elected 11 women MPs, the most of any state; 14 states and UTs elected none.' },
        {
          chart: {
            kind: 'bars',
            slug: 'lok-sabha-seats-women-mps-by-state',
            title: 'Lok Sabha seats and women MPs by state and UT, 2024',
            subtitle: 'Seats in the 18th Lok Sabha and the number held by women, as on 20 Dec 2024. Ranked by seats.',
            punches: { office: 'MoSPI', unit: 'seats', period: '20 DEC 2024' },
            note: 'India: 74 women MPs of 543 seats, 13.62% as published. These counts are from the Lok Sabha Secretariat and include Surat. The source gives state shares as whole numbers.',
            sources: [WMI_5_3],
            format: { decimals: 0 },
            by: 'name',
            highlight: 'Tamil Nadu',
            // LATER: the board overlays the women bar on the seats bar and adds SEATS, WOMEN and SHARE
            // columns (series 'women_share'); bars are grouped here, sorted by seats.
            series: [
              {
                key: 'seats',
                label: 'Seats',
                color: 'other',
                file: SEATS_BY_STATE,
                where: { series: 'seats', geography: STATES_AND_UTS },
                x: 'name',
              },
              {
                key: 'women',
                label: 'Won by women',
                color: 's3',
                file: SEATS_BY_STATE,
                where: { series: 'women_mps', geography: STATES_AND_UTS },
                x: 'name',
              },
            ],
            know: [
              'The counts are from the Lok Sabha Secretariat, as on 20 December 2024, compiled by MoSPI.',
              'They include Surat, won unopposed, so India has 543 seats here, not the 542 seats polled.',
              "The source gives each state's share of women MPs as a whole number. Only the India share has decimals: 13.62%.",
            ],
            processing: [
              'We take seats and women MPs for India and all 36 states and UTs from Table 5.3 of MoSPI, Women and Men in India 2025.',
              'We check that the state rows sum to the published India totals: 74 women MPs and 543 seats.',
              'We keep the shares as published.',
            ],
            nextRelease: 'not announced',
          },
        },
        { text: '63,71,839 voters chose "None of the above" (NOTA) in 2024, 0.99% of votes counted.' },
        {
          chart: {
            kind: 'states',
            slug: 'nota-share-by-state',
            title: 'NOTA share by state and UT, 2024 general election',
            subtitle: 'Votes for "None of the above" as a share of votes counted (valid votes plus NOTA), %. Derived by India by Numbers.',
            punches: { office: 'ECI', unit: '% of votes counted', period: '2024' },
            note: 'Derived. ECI Report 33 gives NOTA votes for each constituency. We added them by state, with postal votes, over 542 constituencies. Gujarat excludes Surat, where no poll was held.',
            sources: [ECI_REPORT_33],
            format: { decimals: 2, unit: '%' },
            data: { file: NOTA_BY_STATE, where: { series: 'nota_share' }, x: 'geography' },
            open: 'chart',
            scale: 'seq',
            short: 'NOTA share',
            know: [
              'Voters can choose "None of the above" (NOTA) instead of a candidate. NOTA votes do not change who wins.',
              'The share is NOTA votes divided by votes counted: valid votes for candidates plus NOTA, including postal votes.',
              'ECI does not count NOTA in valid votes, so this denominator is larger than the one used for party vote shares.',
              'India and Gujarat exclude Surat, where no poll was held.',
              'We compute these shares. ECI publishes the constituency counts, not a state table.',
            ],
            processing: [
              'We read every candidate row and NOTA row for the 542 constituencies in ECI Report 33.',
              'We check that the candidate votes in each constituency sum to the published total.',
              'We add NOTA votes and votes counted by state, and divide.',
              'We round the share to two decimal places.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'Who won seats in 2024, and in the states since?',
      lede: 'The Bharatiya Janata Party won 240 of 543 seats with 36.93% of valid votes. The Indian National Congress won 99 seats with 21.4%. Independents won 7 seats. The other 725 parties not shown by name won 37 seats between them.',
      blocks: [
        {
          chart: {
            kind: 'table',
            slug: 'lok-sabha-party-results-2024',
            title: 'Seats and vote share by party, 2024 general election',
            subtitle: 'Seats won (of 543) and share of valid votes, %. Each party with at least 1% of valid votes or at least 5 seats. Independent candidates are one group; the last row combines all remaining parties.',
            punches: { office: 'ECI', unit: 'seats · %', period: '2024' },
            note: '"ECI" shares are as published in ECI Report 20 for national parties. "Derived" shares are our calculation: votes in ECI Report 33 divided by 63,89,90,692 valid votes, the ECI total. NOTA is not part of valid votes. The BJP\'s 240 seats include Surat, won unopposed; ECI Report 20 counts 239. Party names are as ECI prints them.',
            sources: [ECI_RESULTS_JUN_2024, ECI_REPORT_20, ECI_REPORT_33],
            data: { file: PARTY_RESULTS },
            by: 'party_name',
            // LATER: the board draws bars in the seats and share cells, a rule above the last two rows,
            // "Independents" for the IND row, and BASIS as "ECI" or "Derived"; the CSV 'notes' column holds a sentence.
            columns: [
              { key: 'seats', label: 'Seats won, of 543', y: 'seats_won', format: { decimals: 0 } },
              { key: 'share', label: 'Share of valid votes, %', y: 'vote_share_pct', format: { unit: '%' } },
              { key: 'basis', label: 'Basis', y: 'notes' },
            ],
            know: [
              'Seats are from the final ECI results page. They include Surat, won unopposed, so the BJP has 240 here and 239 in ECI Report 20.',
              'Vote shares are of valid votes. NOTA is not a valid vote, so ECI leaves it out of the denominator.',
              'ECI Report 20 publishes vote shares for the six national parties. For every other party we divide its votes in ECI Report 33 by the ECI total of valid votes.',
              'The chart names every party with at least 1% of valid votes or at least 5 seats. The other 725 parties are one row; independents have their own row.',
              'Party names are as ECI prints them, including spelling.',
            ],
            processing: [
              'We take seats from the ECI results page for June 2024.',
              'We take votes from ECI Report 33 and check the national totals and the six national parties against ECI Report 20.',
              'We compute the shares that ECI does not publish and mark them "Derived".',
              'We checked the seats against a second ECI results capture, of 10 June 2024. All 18 named parties and independents match.',
            ],
            nextRelease: 'not announced',
          },
        },
        { text: 'West Bengal recorded a provisional turnout of 92.47% in April 2026; its previous highest was 84.72% in 2011.' },
        {
          chart: {
            kind: 'bars',
            slug: 'assembly-elections-2025-2026',
            title: 'State assembly elections, 2025 and 2026',
            subtitle: 'Seats won by party, seven states and UTs. Main polls February 2025 to April 2026; West Bengal includes the re-poll of 21 May 2026. Each panel has its own scale.',
            punches: { office: 'ECI', unit: 'seats · %', period: '2025-2026' },
            status: ['Provisional'],
            // Board note said "West Bengal: results for 293 of 294 seats; ECI ordered a re-poll in
            // 144-Falta for 21 May 2026." The data now includes the Falta result (README check,
            // 18 Nov 2026: BJP 208, all 294 seats), so that sentence is rewritten from the data.
            note: "Turnout for 2026 is the provisional poll-day figure from ECI releases. It excludes service voters and postal ballots. Bihar's 67.13% is also provisional; ECI gives final turnout in its Index Cards. Delhi 2025: no ECI turnout figure is shown. West Bengal: the seat count includes the 144-Falta re-poll of 21 May 2026. Puducherry counts 30 elected seats, not nominated members.",
            sources: [
              ECI_RESULTS_DELHI_2025,
              ECI_RESULTS_BIHAR_2025,
              ECI_RESULTS_MAY_2026,
              ECI_RESULT_FALTA_2026,
              PIB_BIHAR_2025,
              PIB_ASSAM_KERALA_PUDUCHERRY_2026,
              PIB_TN_WB1_2026,
              PIB_WB2_2026,
            ],
            format: { decimals: 0 },
            by: 'party_abbr',
            // Each assembly on its own scale, with the seats needed for a majority.
            panels: [
              { label: 'Delhi 2025, 70 seats', series: ['delhi'], own: true, refs: [{ value: 36, label: 'Majority 36' }] },
              { label: 'Bihar 2025, 243 seats', series: ['bihar'], own: true, refs: [{ value: 122, label: 'Majority 122' }] },
              { label: 'Assam 2026, 126 seats', series: ['assam'], own: true, refs: [{ value: 64, label: 'Majority 64' }] },
              { label: 'Kerala 2026, 140 seats', series: ['kerala'], own: true, refs: [{ value: 71, label: 'Majority 71' }] },
              { label: 'Puducherry 2026, 30 seats', series: ['puducherry'], own: true, refs: [{ value: 16, label: 'Majority 16' }] },
              { label: 'Tamil Nadu 2026, 234 seats', series: ['tamil-nadu'], own: true, refs: [{ value: 118, label: 'Majority 118' }] },
              { label: 'West Bengal 2026, 294 seats', series: ['west-bengal'], own: true, refs: [{ value: 148, label: 'Majority 148' }] },
            ],
            series: [
              assembly('delhi', 'Delhi'),
              assembly('bihar', 'Bihar'),
              assembly('assam', 'Assam'),
              assembly('kerala', 'Kerala'),
              assembly('puducherry', 'Puducherry'),
              assembly('tamil-nadu', 'Tamil Nadu'),
              assembly('west-bengal', 'West Bengal'),
            ],
            know: [
              'Seven states and UTs held a general assembly election between February 2025 and April 2026: Delhi and Bihar in 2025; Assam, Kerala, Puducherry, Tamil Nadu and West Bengal in 2026.',
              'Turnout is the poll-day figure from ECI releases. It excludes service voters and postal ballots, so the final figure in ECI Index Cards can be higher.',
              'ECI gives no turnout release for Delhi 2025, so the chart shows no Delhi turnout.',
              'West Bengal includes the result of the re-poll in 144-Falta, held on 21 May 2026.',
              'Puducherry has 30 elected seats. Nominated members are not counted.',
            ],
            processing: [
              'We take seats for every party that won one from the ECI results pages for each election.',
              'We take turnout from the ECI releases on PIB for each poll.',
              'We check that the parties in each state sum to the assembly size.',
              'We keep party names and short names as ECI prints them.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
  ],
  // LATER: the About band's side line ("How each election figure is made, where it breaks, and what is missing.") has no field.
  about: {
    intro:
      "ECI's reports are the source; we read archived copies of the original ECI pages.",
    publisher:
      'The Election Commission of India (ECI) runs national and state elections and publishes electors, votes and results. MoSPI republishes the Lok Sabha series by sex in Women and Men in India 2025. The Lok Sabha Secretariat gives the count of women MPs.',
    frequency:
      'Lok Sabha general elections take place every five years; the latest was in 2024. Each state holds its assembly election at the end of its own five-year term. ECI publishes results on counting day and statistical reports later. Women and Men in India is annual; the 2025 edition came out on 29 April 2026.',
    revisions:
      'Results are final when ECI declares them. Poll-day turnout for assembly elections is provisional: it excludes postal ballots and service voters, and ECI gives final turnout in its Index Cards. The Lok Sabha counts on this page are final.',
    breaks:
      'Counts have no base year. The state charts use 2024 boundaries: Jammu and Kashmir and Ladakh are separate, and Dadra and Nagar Haveli and Daman and Diu are one UT. Earlier elections used other boundaries, so no state series goes back before 2024. MoSPI dates the first general election 1952; it ran from October 1951 to February 1952.',
    coverage:
      'All 543 Lok Sabha seats. Surat was won unopposed in 2024, so turnout and votes cover 542 constituencies and seat counts cover 543. MoSPI gives 65.7% turnout for 2024 in Table 5.6 and 66.10% in Table 5.7, without saying why they differ; chart 1.1 uses Table 5.6, the headline figure and chart 3.1 use Table 5.7. Assembly elections: Delhi and Bihar (2025); Assam, Kerala, Puducherry, Tamil Nadu and West Bengal (2026).',
    missing:
      'No turnout by sex for 1952, 1957 and 1971, and no electors by sex for 1952 and 1957. ECI Report 20 gives vote shares for the six national parties; we derived the other party shares, and NOTA by state, from ECI Report 33. This page shows no party vote shares for the 2025 and 2026 assembly elections and no turnout for Delhi 2025. For 1999, MoSPI gives 494 men and 52 women elected, 546 in all; we keep the values as published. No ECI or MoSPI file states a reuse licence.',
  },
  // The board has six rows; rows that name two releases are split so each has its own link and date.
  sources: [
    { ...WMI_2025, release: 'Women and Men in India 2025, chapter 5, Tables 5.2, 5.3, 5.6 and 5.7' },
    ECI_REPORT_20,
    ECI_REPORT_33,
    ECI_RESULTS_JUN_2024,
    ECI_RESULTS_DELHI_2025,
    ECI_RESULTS_BIHAR_2025,
    ECI_RESULTS_MAY_2026,
    ECI_RESULT_FALTA_2026,
    PIB_BIHAR_2025,
    PIB_ASSAM_KERALA_PUDUCHERRY_2026,
    PIB_TN_WB1_2026,
    PIB_WB2_2026,
    PIB_ECINET_2026,
  ],
  related: [
    { label: 'States: Tamil Nadu profile', href: '/states/tamil-nadu/' },
    { label: 'Population: Population growth by state', href: '/charts/population-growth-by-state/' },
    { label: 'How we check: derived figures', href: '/how-we-check/#hallmark' },
  ],
}

export default topic
