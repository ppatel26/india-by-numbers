import type { Breakpoint, Color, Series, Source, Topic } from '../types'

// Sources: research/data/crime/README.md, "Sources" and "Raw files".

const NCRB = 'NCRB, Ministry of Home Affairs'
const DOJ = 'Department of Justice, Ministry of Law and Justice'
const UPLOADS = 'https://www.ncrb.gov.in/uploads/'

// NCRB gives no release date for Crime in India 2024, on the year page or in the volumes. News
// reports give 6 May 2026, and the PDF metadata gives 7 Apr to 13 May 2026, so neither is the
// publisher's date. The source line says "not stated".
const cii2024 = (volume: 'I' | 'II' | 'III', path: string): Source => ({
  publisher: NCRB,
  release: `Crime in India 2024, Volume ${volume}`,
  released: 'not stated',
  url: `${UPLOADS}${path}`,
})

const cii2024v1 = cii2024('I', 'files/11CrimeinIndia2024-VolumeI.pdf')
const cii2024v2 = cii2024('II', 'files/2CrimeinIndia2024-VolumeII.pdf')
const cii2024v3 = cii2024('III', 'files/3CrimeinIndia2024-VolumeIII1.pdf')

// Earlier editions: NCRB dates none of them on its year pages.
const ciiEdition = (year: number, path: string): Source => ({
  publisher: NCRB,
  release: `Crime in India ${year}, Volume I`,
  released: 'not stated',
  url: `${UPLOADS}${path}`,
})

const CII_EDITIONS: readonly Source[] = [
  ciiEdition(2023, 'files/1CrimeinIndia2023PartI1.pdf'),
  ciiEdition(2022, 'nationalcrimerecordsbureau/custom/1701607577CrimeinIndia2022Book1.pdf'),
  ciiEdition(2021, 'nationalcrimerecordsbureau/custom/1696831798CII2021Volume1.pdf'),
  ciiEdition(2020, 'nationalcrimerecordsbureau/post/16959885631653645869CII2020Volume1.pdf'),
  ciiEdition(2019, 'nationalcrimerecordsbureau/custom/1653730573_CII%202019%20Volume%201.pdf'),
  ciiEdition(2018, 'nationalcrimerecordsbureau/custom/1653734481_Crime%20in%20India%202018%20-%20Volume%201_3_0_0.pdf'),
  ciiEdition(2017, 'nationalcrimerecordsbureau/post/16959893381653885627CrimeinIndia2017-Volume100.pdf'),
]

// The revised report "with West Bengal data". Its file name dates it: "PSI-2024Ason15092026".
// The first release, of 6 May 2026, used West Bengal's 2023 data.
const psi2024: Source = {
  publisher: NCRB,
  release: 'Prison Statistics India 2024, revised report with West Bengal data',
  released: '2026-09-15',
  url: `${UPLOADS}files/PSI-2024Ason15092026.pdf`,
}

// The Executive Summaries carry no date. The 2024 summary prints the revised figures.
const psiSummary = (year: number, path: string): Source => ({
  publisher: NCRB,
  release: `Prison Statistics India ${year}, Executive Summary`,
  released: 'not stated',
  url: `${UPLOADS}${path}`,
})

const PSI_SUMMARIES: readonly Source[] = [
  psiSummary(2024, 'files/ExecutiveSummary-2024.pdf'),
  psiSummary(2023, 'files/ExecutiveSummary2023.pdf'),
  psiSummary(2022, 'nationalcrimerecordsbureau/custom/psiyearwise2022/170161282705ExecutiveSummary2022.pdf'),
  psiSummary(2021, 'nationalcrimerecordsbureau/custom/1670309599_Executive_ncrb_Summary-2021.pdf'),
  psiSummary(2020, '2022/July/11/custom/psi/executive_ncrb_summary-2020.pdf'),
  psiSummary(2019, 'nationalcrimerecordsbureau/post/1679133917Executive-Summary-2019.pdf'),
  psiSummary(2018, '2022/July/11/custom/psi/psi-executive-summary-2018.pdf'),
  psiSummary(2017, '2022/July/11/custom/psi/psi-executive-summary-2017.pdf'),
  psiSummary(2016, '2022/July/11/custom/psi/psi-executive-summary-2016.pdf'),
]

// Parliament answers: the release date is the date of the answer.
const ls3295: Source = {
  publisher: DOJ,
  release: 'Lok Sabha unstarred question 3295, Case Pendency in Judiciary',
  released: '2026-08-07',
  url: 'https://elibrary.sansad.in/server/api/core/bitstreams/66563714-2b9c-4a02-884f-3893b5b6e128/content',
}

const ls3371: Source = {
  publisher: DOJ,
  release: 'Lok Sabha unstarred question 3371, Cases Pendency and e-Courts Project',
  released: '2026-08-07',
  url: 'https://sansad.in/getFile/lsapps/loksabhaquestions/annex/188/AU3371_Lq6K9K.pdf',
}

const rs597: Source = {
  publisher: DOJ,
  release: 'Rajya Sabha unstarred question 597, Pending cases in Indian courts',
  released: '2026-07-23',
  url: 'https://sansad.in/getFile/annex/271/AU597_ZRzDHo.pdf?source=pqars',
}

const BY_STATE = 'crime/crime-by-state-2024.csv'
const TREND = 'crime/crime-india-trend.csv'
const MURDER = 'crime/murder-by-state-2024.csv'
const WOMEN = 'crime/crimes-against-women-by-state-2024.csv'
const DISPOSAL = 'crime/police-and-court-disposal-by-state-2024.csv'
const PRISONS = 'crime/prisons-by-state-2024.csv'
const PRISONS_TREND = 'crime/prisons-india-trend.csv'
const DISTRICT = 'crime/court-pendency-district-by-state.csv'
const HIGH = 'crime/court-pendency-high-courts.csv'
const SC_ST = 'crime/crimes-against-scs-sts-by-state-2024.csv'
const CUSTODY = 'crime/deaths-in-police-custody-2024.csv'
const PRISON_DEATHS = 'crime/prison-deaths-2024.csv'
const POLICE_CASES = 'crime/cases-against-police-personnel-2024.csv'
const TRAFFICKING = 'crime/human-trafficking-by-state-2024.csv'
const MISSING = 'crime/missing-children-by-state-2024.csv'

const CHECKED = '2026-11-25'
/** The day the part on Scheduled Castes and Tribes, custody, trafficking and missing children was checked. */
const CHECKED_PART6 = '2026-11-27'
const COUNT = { scale: 'none', decimals: 0 } as const

/** Years with one population base and one law: NCRB changed the base in 2018 and 2020, and the law in 2024. */
const RATE_SPANS = [
  ['2015-2017', ['2015', '2016', '2017']],
  ['2018-2019', ['2018', '2019']],
  ['2020-2023', ['2020', '2021', '2022', '2023']],
  ['2024', ['2024']],
] as const

const RATE_BREAKS: readonly Breakpoint[] = [
  { x: '2018', label: 'New population base' },
  { x: '2020', label: 'New population base' },
  { x: '2024', label: 'BNS from 1 Jul' },
]

const LAWS = [
  ['ipc-bns-sll', 'All cognizable crimes', 'ink'],
  ['ipc-bns', 'IPC and BNS', 's1'],
  ['sll', 'Special and local laws', 's2'],
] as const satisfies readonly (readonly [string, string, Color])[]

/** One line per law and span, so no line joins values across a break. */
const rateSeries: Series[] = LAWS.flatMap(([law, label, color]) =>
  RATE_SPANS.map(([span, period]) => ({
    key: `${law}-${span}`,
    label,
    color,
    file: TREND,
    where: { crime_head: 'all-cognizable', indicator: 'crime-rate', law, period },
    note: 'population_base',
  })),
)

/** Recorded causes of deaths in police custody, Table 16A.3, with "Others" last. */
const CUSTODY_CAUSES = [
  'illness-or-death-in-hospital-during-treatment',
  'suicide',
  'while-escaping-from-custody',
  'injuries-sustained-prior-to-police-custody',
  'injuries-in-police-custody-due-to-physical-assault-by-police',
  'road-accident-or-journey-connected-with-investigation',
  'others',
]

/** Causes of deaths in prisons, Tables 8.1, 8.2 and 8.4. Execution, firing and assault by outside elements had no deaths in 2024. */
const PRISON_CAUSES = ['illness', 'ageing', 'suicide', 'accidental', 'murder-by-inmates', 'negligence-or-excess-by-jail-personnel', 'others', 'not-known']

/** Types of incident in Table 16A.6, in the table's order. */
const HRV_TYPES = ['encounter-killing', 'deaths-in-custody', 'illegal-detention', 'torture-causing-hurt-or-injury', 'extortion', 'others']

/** Tooltip text for the states and UTs where NCRB prints "-" for the rate. */
const noRate = (group: string, places: readonly string[]): Record<string, string> =>
  Object.fromEntries(places.map((p) => [p, `NCRB prints no rate: it gives the ${group} population of Census 2011 as 0.0 lakh`]))

/** Year-end pendency from LS 3295. The answer gives 2021 and 2022 with no day. */
const YEAR_END = ['2021', '2022', '2023-12-31', '2024-12-31', '2025-12-31']

// Know lines that several charts share.
const REGISTRATION_KNOW =
  'NCRB counts the cases that the police register (first information reports, or FIRs). A higher recorded rate can mean that more crimes are reported and registered, not that more crimes happen. A low rate can mean that crimes go unregistered.'

const COMPARE_KNOW =
  'NCRB says that "States/UTs may not be compared purely on the basis of crime figures". This chart does not show which states are safer.'

const PRINCIPAL_KNOW =
  'NCRB counts the principal offence only. When one FIR names several offences, NCRB counts the one with the heaviest punishment, so lesser offences are undercounted.'

const BASE_KNOW =
  "NCRB computes every rate with its own population base: for 2024, the mid-year projected population of the Technical Group on Population Projections (July 2020), based on Census 2011. We copy NCRB's rates and do not recompute them."

const BNS_KNOW =
  'The Bharatiya Nyaya Sanhita (BNS) replaced the Indian Penal Code (IPC) on 1 July 2024. NCRB counts IPC and BNS cases together for rates. Under the BNS, simple hurt and criminal intimidation are not cognizable, so NCRB leaves them out from 1 July 2024.'

const PRISON_DAY_KNOW = 'Each value is a count on 31 December 2024, not an average over the year.'

const PSI_REVISED_KNOW =
  "NCRB revised Prison Statistics India 2024 on 15 Sep 2026 with West Bengal's 2024 data. The first release, of 6 May 2026, used West Bengal's 2023 data. This page uses the revised report."

const ATROCITY_KNOW =
  'NCRB counts a crime against a Scheduled Caste or Scheduled Tribe person by a person who is not from a Scheduled Caste or Scheduled Tribe. It leaves out cases under the IPC or the BNS alone, without the SC/ST (Prevention of Atrocities) Act, because it takes those to be crimes by Scheduled Caste or Scheduled Tribe persons.'

const CENSUS_BASE_KNOW =
  'NCRB computes this rate with the Scheduled Caste or Scheduled Tribe population of Census 2011, not with a projection for 2024. The other NCRB rates on this page use the projected population of 2024.'

const NHRC_KNOW =
  'The National Human Rights Commission (NHRC) also counts deaths in custody, from the reports that it receives. Its counts differ from NCRB counts. This page shows NCRB counts only and does not combine the two.'

const NJDG_KNOW =
  'Each answer quotes the National Judicial Data Grid (NJDG) on a stated date. NJDG is a live dashboard, and counts for nearby dates can differ by more than real change. Gujarat had 19,67,723 cases on 9 Mar 2026 and 15,60,074 on 23 Mar 2026.'

const topic: Topic = {
  slug: 'crime-and-justice',
  name: 'Crime and justice',
  hindi: 'अपराध और न्याय',
  question: 'How much crime do the police record, and how full are the prisons and courts?',
  standfirst:
    'In 2024, the police recorded 418.9 cognizable crimes for every lakh people. Of all prisoners, 72.5% were undertrials.',
  figures: [
    { chart: 'crime-rate-by-state', label: 'Cognizable crimes recorded per lakh people' },
    { chart: 'undertrials-by-state', label: 'Prisoners who are undertrials' },
    { chart: 'district-court-pendency-by-state', label: 'Cases pending in district courts', format: { scale: 'crore', decimals: 2 } },
  ],
  nextRelease: 'not announced',
  parts: [
    {
      title: 'How much crime do the police record?',
      lede: 'In 2024, the police recorded {{5885867 lakh 2}} cognizable crimes, or 418.9 for every lakh people. The new criminal law changed what NCRB counts, so 2024 does not compare exactly with 2023.',
      blocks: [
        {
          chart: {
            kind: 'states',
            slug: 'crime-rate-by-state',
            noRank: true,
            checked: CHECKED,
            title: 'Recorded crime rate by state, 2024',
            subtitle: 'Cognizable crimes registered by the police, IPC, BNS and special and local laws, per lakh people, by state and UT.',
            punches: { office: 'NCRB', unit: 'per lakh people', period: '2024' },
            note: 'A higher recorded rate can mean better registration, not more crime. NCRB says states should not be compared on crime figures alone.',
            sources: [cii2024v1],
            format: { decimals: 1 },
            data: { file: BY_STATE, where: { period: '2024', indicator: 'crime-rate', law: 'ipc-bns-sll' }, x: 'geography' },
            open: 'map',
            scale: 'seq',
            bins: [100, 200, 300, 500, 1000],
            short: 'Recorded crime rate',
            know: [
              REGISTRATION_KNOW,
              'NCRB says a rise in recorded crime can come from police services that make reporting easier, such as e-FIRs and women help desks.',
              COMPARE_KNOW,
              'A cognizable crime is one that the police can register and investigate without a court order. The total adds IPC and BNS crimes to crimes under special and local laws (SLL), such as state prohibition acts.',
              'NCRB gives no weight to how serious a crime is: a murder and a liquor-law case count as one each. In Gujarat, the total rate is 847.0, but the IPC and BNS rate is 227.7.',
              PRINCIPAL_KNOW,
              BASE_KNOW,
              BNS_KNOW,
            ],
            processing: [
              'Read Table 1A.3 of Crime in India 2024, Volume I: total cognizable crimes and the crime rate for 2024.',
              'Check India (418.9), Kerala (1,389.0) and Nagaland (61.6) against the table.',
              'Check that the population in Table 1A.1 equals the one in Table 1A.3 for every row.',
              'Match state names to the site geography table.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'The national rate rose from 374.1 in 2015 to 487.8 in 2020, the highest in the series. NCRB does not explain the 2020 value in its tables. In 2024, special and local laws added 166.6 crimes per lakh people to the 252.3 under the IPC and the BNS.',
        },
        {
          chart: {
            kind: 'line',
            slug: 'crime-rate-india',
            checked: CHECKED,
            title: 'Recorded crime rate in India, 2015 to 2024',
            subtitle: 'Cognizable crimes registered by the police per lakh people: all crimes, IPC and BNS crimes, and special and local law crimes.',
            punches: { office: 'NCRB', unit: 'per lakh people', period: '2015-2024' },
            status: ['Method break'],
            note: 'Lines break where NCRB changed its population base (2018, 2020) and where the BNS replaced the IPC (1 Jul 2024).',
            sources: [cii2024v1, ...CII_EDITIONS],
            format: { decimals: 1 },
            y: { min: 0 },
            breaks: RATE_BREAKS,
            series: rateSeries,
            know: [
              REGISTRATION_KNOW,
              BNS_KNOW,
              'NCRB links part of the fall in 2024 to the BNS. Cases of hurt fell from 6,36,767 in 2023 to 4,41,996 in 2024, partly because simple hurt is no longer cognizable.',
              'Each rate keeps the population base of its own edition: the Registrar General estimate for 2017, the November 2019 projections for 2018 and 2019, and the July 2020 projections from 2020. The tooltip names the base of each year.',
              'Counts come from the latest edition that prints each year, because NCRB revises them. Rates come from the edition of their own year.',
              'Before 1 July 2024, the IPC and BNS line counts IPC crimes only.',
            ],
            processing: [
              'Read Table 1.1 of each Crime in India edition from 2017 to 2024. Each edition prints three years.',
              'Use the latest edition that prints each year.',
              'Check the 2015 rate (374.1, Crime in India 2017) and the 2020 rate (487.8, Crime in India 2022) against the tables.',
              'Keep each population base and each law on its own line.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How many murders and crimes against women do the police record?',
      lede: 'In 2024, the police recorded 27,049 murders, or 1.9 for every lakh people. They recorded {{441534 plain 0}} crimes against women, or 64.6 for every lakh women.',
      blocks: [
        {
          chart: {
            kind: 'states',
            slug: 'murder-rate-by-state',
            noRank: true,
            checked: CHECKED,
            title: 'Recorded murder rate by state, 2024',
            subtitle: 'Murder cases registered by the police per lakh people, by state and UT.',
            punches: { office: 'NCRB', unit: 'per lakh people', period: '2024' },
            note: 'Murder is Section 302 of the IPC and Section 103 of the BNS. NCRB says states should not be compared on crime figures alone.',
            sources: [cii2024v1],
            format: { decimals: 1 },
            data: { file: MURDER, where: { period: '2024', indicator: 'murder-rate' }, x: 'geography' },
            open: 'map',
            scale: 'seq',
            short: 'Recorded murder rate',
            know: [
              'Murder is one crime head with one definition in both laws: Section 302 of the IPC and Section 103 of the BNS, counted together.',
              'Uttar Pradesh recorded the most murders, 3,218, and Bihar 2,787. States with more people record more cases. The rate divides by population.',
              'Lakshadweep recorded no murders in 2024, and Ladakh one.',
              REGISTRATION_KNOW,
              PRINCIPAL_KNOW,
              BASE_KNOW,
            ],
            processing: [
              'Read Table 2A.1 of Crime in India 2024, Volume I: murder cases for 2022 to 2024 and the murder rate for 2024.',
              'Check India (27,049 cases), Uttar Pradesh (3,218) and the Jharkhand rate (3.7) against the table.',
              'Match state names to the site geography table.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'Kerala recorded the highest total crime rate in 2024, 1,389.0 per lakh people, but a murder rate of 0.9, below the India rate. For crimes against women, the recorded rate was 130.7 per lakh women in Delhi and 128.6 in Telangana, and 5.1 in Nagaland.',
        },
        {
          chart: {
            kind: 'states',
            slug: 'crimes-against-women-by-state',
            noRank: true,
            checked: CHECKED,
            title: 'Recorded crimes against women by state, 2024',
            subtitle: 'Crimes against women registered by the police, IPC, BNS and special and local laws, per lakh women, by state and UT.',
            punches: { office: 'NCRB', unit: 'per lakh women', period: '2024' },
            note: 'A higher recorded rate can mean that more women report crimes and the police register them. NCRB says states should not be compared on crime figures alone.',
            sources: [cii2024v1],
            format: { decimals: 1 },
            data: { file: WOMEN, where: { period: '2024', indicator: 'crime-rate' }, x: 'geography' },
            open: 'map',
            scale: 'seq',
            bins: [20, 40, 60, 80, 100],
            short: 'Recorded crimes against women',
            know: [
              'The rate is crimes against women per lakh women. NCRB uses the female mid-year projected population for 2024.',
              REGISTRATION_KNOW,
              'The 2024 total adds new BNS heads, for example Section 69, sexual intercourse by deceitful means: 1,325 cases.',
              'The India rate was 57.9 in 2017 and 64.6 in 2024. The population base changed in 2018 and 2020, and the law in 2024.',
              PRINCIPAL_KNOW,
              COMPARE_KNOW,
            ],
            processing: [
              'Read Table 3A.1 of Crime in India 2024, Volume I: crimes against women (IPC, BNS and SLL), cases for 2022 to 2024 and the rate for 2024.',
              'Check India (64.6), Telangana (128.6) and Delhi (13,396 cases) against the table.',
              'Match state names to the site geography table.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How many cases end in a charge-sheet or a conviction?',
      lede: 'In 2024, the police filed a charge-sheet in 72.1% of the cases they closed. In the courts, 53.3% of completed trials ended in a conviction.',
      blocks: [
        {
          text: 'In West Bengal, the police charge-sheeted 90.6% of the cases they closed, but 7.1% of completed trials ended in a conviction. In Mizoram, 95.6% of completed trials ended in a conviction.',
        },
        {
          chart: {
            kind: 'dots',
            slug: 'chargesheeting-and-conviction-by-state',
            checked: CHECKED,
            title: 'Charge-sheeting and conviction rates by state, 2024',
            subtitle: 'Share of cases closed by the police with a charge-sheet, and share of completed trials that ended in a conviction, IPC and BNS crimes, by state and UT.',
            punches: { office: 'NCRB', unit: '% of cases', period: '2024' },
            note: 'The two rates have different bases: cases closed by the police, and trials completed in court.',
            sources: [cii2024v3],
            format: { unit: '%', decimals: 1 },
            by: 'geography',
            pin: ['india'],
            sortBy: 'conviction',
            axis: { min: 0, max: 100 },
            map: { series: 'conviction', scale: 'seq' },
            series: [
              { key: 'chargesheeting', label: 'Charge-sheeting rate', color: 's2', file: DISPOSAL, where: { indicator: 'chargesheeting-rate' }, x: 'geography' },
              { key: 'conviction', label: 'Conviction rate', color: 's1', file: DISPOSAL, where: { indicator: 'conviction-rate' }, x: 'geography' },
            ],
            know: [
              "A charge-sheet is the police report that sends a case to court. NCRB's charge-sheeting rate is cases charge-sheeted divided by cases the police disposed of, times 100.",
              "NCRB's conviction rate is cases convicted divided by trials completed, times 100. Trials completed in 2024 include cases registered in earlier years.",
              'NCRB counts IPC and BNS cases together for police and court disposals.',
              'At the end of 2024, 90.3% of the IPC and BNS cases before the courts were still waiting for trial.',
              "Manipur charge-sheeted 10.4% of cases. NCRB gives no reason. It marks Manipur's figure for cases pending investigation as provisional.",
            ],
            processing: [
              'Read Table 17A.2 (police disposal) and Table 18A.2 (court disposal) of Crime in India 2024, Volume III.',
              'Check India (72.1% charge-sheeting, 53.3% conviction) and West Bengal (7.1% conviction) against the tables.',
              'Check that the charge-sheeting rate in Table 17A.2 equals the rate in Table 1A.1 for every row.',
              'Match state names to the site geography table.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How full are the prisons, and how many prisoners are undertrials?',
      lede: "On 31 December 2024, India's prisons held {{509012 plain 0}} people, in space for {{453769 plain 0}}: an occupancy rate of 112.2%. Of these prisoners, 72.5% were undertrials.",
      blocks: [
        {
          text: 'An undertrial is a prisoner whose case is under investigation or trial, and who has not been convicted. Occupancy was highest at 131.4% in 2022. The undertrial share rose from 67.6% in 2014 to 77.1% in 2021, and was 72.5% in 2024.',
        },
        {
          chart: {
            kind: 'line',
            slug: 'prisons-india',
            checked: CHECKED,
            title: 'Prison occupancy and undertrials in India, 2014 to 2024',
            subtitle: 'Prisoners as a share of prison capacity, and undertrials as a share of all prisoners, on 31 December of each year.',
            punches: { office: 'NCRB', unit: '%', period: '2014-2024' },
            note: 'Counts on 31 December. Occupancy above 100% means more prisoners than places. The undertrial share is derived from the published counts of undertrials and prisoners.',
            sources: [psi2024, ...PSI_SUMMARIES],
            format: { unit: '%', decimals: 1 },
            y: { min: 0, max: 140, step: 20 },
            series: [
              { key: 'occupancy', label: 'Occupancy rate', color: 'ink', file: PRISONS_TREND, where: { indicator: 'occupancy-rate' } },
              { key: 'undertrials', label: 'Undertrial share', color: 'ink', file: PRISONS_TREND, where: { indicator: 'undertrial-share' }, note: 'note' },
            ],
            panels: [
              { label: 'Occupancy rate', series: ['occupancy'] },
              { label: 'Undertrials, share of prisoners', series: ['undertrials'] },
            ],
            know: [
              "NCRB's occupancy rate is the number of prisoners divided by the prison capacity, times 100. Above 100% means more prisoners than places.",
              'The undertrial share is undertrials divided by all prisoners, times 100, to one decimal. It matches the share NCRB prints for 2018, 2020, 2023 and 2024.',
              'The share counts everyone held on the day, including people held for a short time. It does not show how long they have been held.',
              'Each year comes from the latest Prison Statistics India that prints it. Editions from 2020 print different 2018 and 2019 figures from the earlier editions, with no footnote. We use the later figures.',
              PSI_REVISED_KNOW,
            ],
            processing: [
              'Read the Executive Summary of each Prison Statistics India edition from 2016 to 2024. Each prints three years.',
              'Use the latest edition that prints each year.',
              'Divide undertrials by prisoners for each year.',
              'Check 2014 occupancy (117.4%), 2022 occupancy (131.4%) and the 2024 undertrial share (72.5%) against the summaries.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'In 2024, prisons in Delhi held 194.6% of their capacity, and prisons in Meghalaya 163.5%. In 19 states and UTs, prisons held more people than their capacity.',
        },
        {
          chart: {
            kind: 'states',
            slug: 'prison-occupancy-by-state',
            checked: CHECKED,
            title: 'Prison occupancy by state, 2024',
            subtitle: 'Prisoners as a share of prison capacity on 31 December 2024, by state and UT. Above 100% means overcrowded.',
            punches: { office: 'NCRB', unit: '% of capacity', period: '31 Dec 2024' },
            note: 'The map bins break at 100%: darker bins hold more prisoners than places.',
            sources: [psi2024],
            format: { unit: '%', decimals: 1 },
            data: { file: PRISONS, where: { indicator: 'occupancy-rate', sex: 'total' }, x: 'geography' },
            open: 'map',
            scale: 'seq',
            bins: [50, 75, 100, 125, 150],
            short: 'Prison occupancy',
            know: [
              "NCRB's occupancy rate is the number of prisoners divided by the prison capacity, times 100.",
              PRISON_DAY_KNOW,
              "Women's prisons and wards were 67.6% full in India, and men's 115.5%.",
              "Lakshadweep's prisons held 5 people, in space for 64.",
              PSI_REVISED_KNOW,
            ],
            processing: [
              'Read Table 1.2 of Prison Statistics India 2024 (revised): capacity, prisoners and occupancy rate.',
              'Check India (112.2%) and Delhi (194.6%) against the table.',
              'Check that prisoners in Table 1.2 equal prisoners in Table 2.1.',
              'Match state names to the site geography table.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'In Bihar, 87.2% of prisoners were undertrials. In the Andaman and Nicobar Islands the share was 42.5%.',
        },
        {
          chart: {
            kind: 'states',
            slug: 'undertrials-by-state',
            checked: CHECKED,
            title: 'Undertrials as a share of prisoners by state, 2024',
            subtitle: 'Prisoners whose case is under investigation or trial, as a share of all prisoners on 31 December 2024, by state and UT.',
            punches: { office: 'NCRB', unit: '% of prisoners', period: '31 Dec 2024' },
            note: 'Small UTs hold few prisoners: Lakshadweep held 5, all undertrials.',
            sources: [psi2024],
            format: { unit: '%', decimals: 1 },
            data: { file: PRISONS, where: { indicator: 'undertrial-share' }, x: 'geography' },
            open: 'map',
            scale: 'seq',
            short: 'Undertrial share',
            know: [
              'An undertrial is a prisoner whose case is under investigation or trial. NCRB counts convicts, undertrials and detenues (people held without charge under preventive laws) separately.',
              'The share counts everyone held on the day, including people held for a short time. It does not show how long they have been held.',
              PRISON_DAY_KNOW,
              PSI_REVISED_KNOW,
            ],
            processing: [
              'Read Table 2.2 of Prison Statistics India 2024 (revised): undertrials as a share of all prisoners.',
              'Check India (72.5%) and Bihar (87.2%) against the table.',
              'Match state names to the site geography table.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How many cases wait in the courts?',
      lede: 'On 30 July 2026, {{49911920 crore 2}} cases were pending in the district and subordinate courts, and {{6466970 lakh 2}} in the High Courts. The Supreme Court had 95,954.',
      blocks: [
        {
          chart: {
            kind: 'columns',
            slug: 'court-pendency-india',
            checked: CHECKED,
            title: 'Cases pending in the courts of India, 2021 to 2025',
            subtitle: 'Cases pending at the end of each year, in the district and subordinate courts and in the 25 High Courts. Panels have different scales.',
            punches: { office: 'MoLJ', unit: 'cases', period: '2021-2025' },
            note: 'From one Lok Sabha answer, which quotes NJDG. It gives 2021 and 2022 with no date. The values for 2023 to 2025 are as on 31 December.',
            sources: [ls3295],
            format: { scale: 'crore', decimals: 2 },
            series: [
              { key: 'district', label: 'District and subordinate courts', color: 'ink', file: DISTRICT, where: { geography: 'india', case_type: 'all', pending_for: 'all', period: YEAR_END } },
              { key: 'high', label: 'High Courts', color: 'ink', file: HIGH, where: { court: 'high-courts-total', case_type: 'all', pending_for: 'all', period: YEAR_END }, format: { scale: 'lakh', decimals: 2 } },
            ],
            panels: [
              { label: 'District and subordinate courts, crore', series: ['district'], own: true },
              { label: 'High Courts, lakh', series: ['high'], own: true },
            ],
            know: [
              'Pendency is a count of cases, not a rate. The answers give no population or number of judges to divide by.',
              NJDG_KNOW,
              'For a trend, use these year-end values from one answer. Do not read a change between two nearby dates in different answers as a trend.',
              'The High Courts total does not include the Supreme Court. The Supreme Court had 92,101 cases pending at the end of 2025.',
              'A Lok Sabha answer of 13 Feb 2026 gives the same values for 2023 to 2025 and dates them to 31 December.',
            ],
            processing: [
              'Read Annexures I and II of Lok Sabha unstarred question 3295 (7 Aug 2026).',
              'Check that the states add up to the Total row in each annexure.',
              'Check 2023 to 2025 against Lok Sabha unstarred question 2362 (13 Feb 2026). All agree.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'At the end of 2025, {{47657328 crore 2}} cases were pending in the district courts, against {{41053498 crore 2}} in 2021. On 16 July 2026, {{5437032 lakh 2}} district court cases had been pending for more than 10 years. Uttar Pradesh had the most pending cases on 30 July 2026, {{11990328 crore 2}}, then Maharashtra with {{6170497 lakh 2}}. These are counts, not rates: states with more people have more cases.',
        },
        {
          chart: {
            kind: 'states',
            slug: 'district-court-pendency-by-state',
            checked: CHECKED,
            title: 'Cases pending in district courts by state, 30 Jul 2026',
            subtitle: 'Cases pending in the district and subordinate courts of each state and UT. Darker means more cases.',
            punches: { office: 'MoLJ', unit: 'cases', period: '30 Jul 2026' },
            note: 'A count, not a rate: states with more people have more cases. From a Lok Sabha answer of 7 Aug 2026, which quotes NJDG.',
            sources: [ls3371, rs597],
            format: { scale: 'none', decimals: 0 },
            data: { file: DISTRICT, where: { period: '2026-07-30', case_type: 'all', pending_for: 'all' }, x: 'geography' },
            total: true,
            open: 'map',
            scale: 'seq',
            bins: [10000, 100000, 500000, 1000000, 3000000],
            short: 'Cases pending, district courts',
            know: [
              'Pendency is a count of cases, not a rate. The answer gives no population or number of judges to divide by.',
              NJDG_KNOW,
              'A Rajya Sabha answer of 23 Jul 2026 gives cases by age on 16 Jul 2026: 54,37,032 district court cases had been pending for more than 10 years, 23,09,086 of them in Uttar Pradesh.',
              'High Courts are not on this map: seven High Courts serve more than one state or UT.',
            ],
            processing: [
              'Read Annexure II of Lok Sabha unstarred question 3371 (7 Aug 2026), as on 30 Jul 2026.',
              'Check that the states add up to the Total row. Check Uttar Pradesh (1,19,90,328) against the annexure.',
              'Read cases by age from Annexure II of Rajya Sabha unstarred question 597 (23 Jul 2026).',
              'Match state names to the site geography table.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'What do the police record on crimes against Scheduled Castes and Scheduled Tribes, deaths in custody, trafficking and missing children?',
      lede: 'In 2024, the police recorded 55,698 crimes against Scheduled Castes and 9,966 against Scheduled Tribes. NCRB recorded 65 deaths in police custody and 1,953 deaths in prisons.',
      blocks: [
        {
          text: 'For every lakh Scheduled Caste people, the police recorded 27.7 crimes against Scheduled Castes across India, 68.5 in Madhya Pradesh and 57.3 in Rajasthan. Uttar Pradesh recorded the most cases, 14,642. The rate of 164.2 in Mizoram comes from 2 cases and a very small Scheduled Caste population.',
        },
        {
          chart: {
            kind: 'states',
            slug: 'crimes-against-scheduled-castes-by-state',
            noRank: true,
            checked: CHECKED_PART6,
            title: 'Recorded crimes against Scheduled Castes by state, 2024',
            subtitle: 'Crimes against Scheduled Caste people registered by the police, per lakh Scheduled Caste people (Census 2011), by state and UT.',
            punches: { office: 'NCRB', unit: 'per lakh SC people', period: '2024' },
            note: 'A higher recorded rate can mean that more crimes are reported and registered. NCRB says states should not be compared on crime figures alone.',
            sources: [cii2024v2],
            format: { decimals: 1 },
            data: { file: SC_ST, where: { period: '2024', group: 'scheduled-castes', indicator: 'crime-rate' }, x: 'geography' },
            open: 'map',
            scale: 'seq',
            bins: [5, 10, 20, 40, 60],
            short: 'Recorded crimes against SCs',
            missing: noRate('Scheduled Caste', ['arunachal-pradesh', 'nagaland', 'andaman-nicobar', 'lakshadweep']),
            know: [
              ATROCITY_KNOW,
              CENSUS_BASE_KNOW,
              'Mizoram recorded 2 cases. NCRB gives its Scheduled Caste population as 0.0 lakh, so 2 cases give a rate of 164.2.',
              'Across India, the police recorded 57,582 cases in 2022, 57,789 in 2023 and 55,698 in 2024.',
              REGISTRATION_KNOW,
              PRINCIPAL_KNOW,
              BNS_KNOW,
            ],
            processing: [
              'Read Table 7A.1 of Crime in India 2024, Volume II: cases for 2022 to 2024, the Scheduled Caste population of Census 2011 and the rate for 2024.',
              'Check that the states and UTs add up to the India total for each year.',
              'Check India (55,698 cases, rate 27.7), Uttar Pradesh (14,642 cases) and Madhya Pradesh (rate 68.5) against the table.',
              'Keep each "-" in the table as an empty value.',
              'Match state names to the site geography table.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'For every lakh Scheduled Tribe people, the police recorded 9.5 crimes against Scheduled Tribes across India, 29.9 in Kerala and 20.7 in Madhya Pradesh. Madhya Pradesh recorded the most cases, 3,165. Manipur recorded 3,399 cases in 2023 and 289 in 2024.',
        },
        {
          chart: {
            kind: 'states',
            slug: 'crimes-against-scheduled-tribes-by-state',
            noRank: true,
            checked: CHECKED_PART6,
            title: 'Recorded crimes against Scheduled Tribes by state, 2024',
            subtitle: 'Crimes against Scheduled Tribe people registered by the police, per lakh Scheduled Tribe people (Census 2011), by state and UT.',
            punches: { office: 'NCRB', unit: 'per lakh ST people', period: '2024' },
            note: 'A higher recorded rate can mean that more crimes are reported and registered. NCRB says states should not be compared on crime figures alone.',
            sources: [cii2024v2],
            format: { decimals: 1 },
            data: { file: SC_ST, where: { period: '2024', group: 'scheduled-tribes', indicator: 'crime-rate' }, x: 'geography' },
            open: 'map',
            scale: 'seq',
            bins: [1, 5, 10, 20, 25],
            short: 'Recorded crimes against STs',
            missing: noRate('Scheduled Tribe', ['haryana', 'punjab', 'chandigarh', 'delhi', 'puducherry']),
            know: [
              ATROCITY_KNOW,
              CENSUS_BASE_KNOW,
              'Manipur recorded 1 case in 2022, 3,399 in 2023 and 289 in 2024. NCRB gives no reason in its tables.',
              'Across India, the police recorded 10,064 cases in 2022, 12,960 in 2023 and 9,966 in 2024.',
              REGISTRATION_KNOW,
              PRINCIPAL_KNOW,
            ],
            processing: [
              'Read Table 7C.1 of Crime in India 2024, Volume II: cases for 2022 to 2024, the Scheduled Tribe population of Census 2011 and the rate for 2024.',
              'Check that the states and UTs add up to the India total for each year.',
              'Check India (9,966 cases, rate 9.5) and Manipur (3,399 cases in 2023) against the table.',
              'Keep each "-" in the table as an empty value.',
              'Match state names to the site geography table.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'Of the 65 people who died in police custody in 2024, 40 were not on remand and 25 were on police or judicial remand. The police recorded illness or death in hospital as the cause for 28 people, and suicide for 22.',
        },
        {
          chart: {
            kind: 'bars',
            slug: 'deaths-in-police-custody-by-cause',
            checked: CHECKED_PART6,
            title: 'Deaths in police custody by recorded cause, India, 2024',
            subtitle: 'Deaths of people in police custody or lockup, by the cause that the police recorded, India.',
            punches: { office: 'NCRB', unit: 'deaths', period: '2024' },
            note: 'NCRB counts 65 deaths: 40 of people not on remand and 25 of people on police or judicial remand.',
            sources: [cii2024v3],
            format: COUNT,
            by: 'cause',
            rowHead: 'Recorded cause',
            order: CUSTODY_CAUSES,
            labels: {
              'illness-or-death-in-hospital-during-treatment': 'Illness, or death in hospital during treatment',
              suicide: 'Suicide',
              'while-escaping-from-custody': 'While escaping from custody',
              'injuries-sustained-prior-to-police-custody': 'Injuries sustained before police custody',
              'injuries-in-police-custody-due-to-physical-assault-by-police': 'Injuries from assault by police in custody',
              'road-accident-or-journey-connected-with-investigation': 'Road accident or journey in investigation',
              others: 'Others',
            },
            series: [
              { key: 'deaths', label: 'Deaths', color: 'ink', file: CUSTODY, where: { geography: 'india', remand: 'all', indicator: 'deaths-reported', cause: CUSTODY_CAUSES } },
            ],
            know: [
              'The cause is the one that the state and UT police report to NCRB. It is not the finding of an enquiry or a court.',
              '"Not on remand" includes people who were arrested but not yet produced before a court. "On remand" means police or judicial remand.',
              'For the 40 deaths of people not on remand, 20 magisterial and 14 judicial enquiries were ordered. For the 25 deaths on remand, 8 magisterial and 7 judicial enquiries were ordered.',
              'The police registered 6 cases over deaths of people not on remand, and 7 over deaths of people on remand. NCRB records no charge-sheet, no conviction and no arrest of a policeman in these cases in 2024.',
              'Gujarat reported 17 deaths and Maharashtra 16.',
              'Prison Statistics India counts deaths of prison inmates separately. Do not add the two counts.',
              NHRC_KNOW,
            ],
            processing: [
              'Read Tables 16A.1, 16A.2 and 16A.3 of Crime in India 2024, Volume III.',
              'Check that the states and UTs add up to the India total in every column.',
              'Check, for India and every state, that the deaths in Tables 16A.1 and 16A.2 add up to the total in Table 16A.2, and that the causes in Table 16A.3 add up to the same total.',
              'Check India (65 deaths: 22 suicides, 28 from illness or in hospital) and Gujarat (17 deaths) against the tables.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'Prisons recorded 1,953 deaths of inmates in 2024. Of these, 1,727 were natural deaths: 1,652 from illness and 75 from ageing. Of the 169 un-natural deaths, 126 were suicides. Rajasthan reported 57 deaths with the cause not known.',
        },
        {
          chart: {
            kind: 'bars',
            slug: 'prison-deaths-by-cause',
            checked: CHECKED_PART6,
            title: 'Deaths in prisons by cause, India, 2024',
            subtitle: 'Deaths of prison inmates during 2024, by cause, India. Illness and ageing are natural deaths; the others are un-natural.',
            punches: { office: 'NCRB', unit: 'deaths', period: '2024' },
            note: 'These are deaths in prisons, not in police custody. NCRB counts the two separately.',
            sources: [psi2024],
            format: COUNT,
            by: 'cause',
            rowHead: 'Cause',
            order: PRISON_CAUSES,
            labels: {
              illness: 'Illness',
              ageing: 'Ageing',
              suicide: 'Suicide',
              accidental: 'Accident',
              'murder-by-inmates': 'Murder by other inmates',
              'negligence-or-excess-by-jail-personnel': 'Negligence or excess by jail personnel',
              others: 'Other un-natural causes',
              'not-known': 'Cause not known',
            },
            series: [{ key: 'deaths', label: 'Deaths', color: 'ink', file: PRISON_DEATHS, where: { geography: 'india', cause: PRISON_CAUSES } }],
            know: [
              'NCRB divides deaths into natural deaths (illness and ageing) and un-natural deaths (suicide, murder by inmates, accidents, negligence or excess by jail personnel, and others).',
              'NCRB recorded no death by execution, by firing or by assault by outside elements in prisons in 2024.',
              'All 57 deaths with the cause not known are in Rajasthan.',
              'Uttar Pradesh reported the most deaths, 330, then Punjab with 228.',
              'Deaths in police custody are counted separately, in Crime in India. Do not add the two counts.',
              NHRC_KNOW,
              PSI_REVISED_KNOW,
            ],
            processing: [
              'Read Tables 8.1, 8.2 and 8.4 of Prison Statistics India 2024 (revised).',
              'Check that the states and UTs add up to the India total in every column.',
              'Check, for India and every state, that natural, un-natural and not-known deaths add up to the total, and that the causes in Tables 8.2 and 8.4 add up to the natural and un-natural deaths in Table 8.1.',
              'Check India (1,953 deaths, 1,652 from illness, 126 suicides) and Rajasthan (57 not known) against the tables.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'NCRB has a category for "Cases Registered against State Police Personnel for Human Right Violation". In 2024 it lists 13 such cases across India: 6 for deaths in custody and 4 for encounter killings. None of the 13 was charge-sheeted in 2024.',
        },
        {
          chart: {
            kind: 'bars',
            slug: 'cases-against-police-human-right-violation',
            checked: CHECKED_PART6,
            title: 'Cases against police personnel for "Human Right Violation", India, 2024',
            subtitle: 'Cases that NCRB lists as "Cases Registered against State Police Personnel for Human Right Violation", by type of incident, India.',
            punches: { office: 'NCRB', unit: 'cases', period: '2024' },
            note: '13 cases in all. NCRB gives this table for India only, not by state.',
            sources: [cii2024v3],
            format: COUNT,
            by: 'incidence',
            rowHead: 'Type of incident',
            order: HRV_TYPES,
            labels: {
              'encounter-killing': 'Encounter killing',
              'deaths-in-custody': 'Deaths in custody',
              'illegal-detention': 'Illegal detention',
              'torture-causing-hurt-or-injury': 'Torture, causing hurt or injury',
              extortion: 'Extortion',
              others: 'Others',
            },
            series: [
              { key: 'cases', label: 'Cases registered', color: 'ink', file: POLICE_CASES, where: { category: 'human-right-violation', indicator: 'cases-registered', incidence: HRV_TYPES } },
            ],
            know: [
              'The category name is NCRB\'s own: "Cases Registered against State Police Personnel for Human Right Violation" (Table 16A.6). It covers the state police only.',
              'Of the 13 cases, the police closed 3 with a final report. None was charge-sheeted in 2024. The police arrested 5 policemen, all in cases of extortion.',
              'NCRB does not link this table to its count of 65 deaths in police custody.',
              'For all offences, NCRB lists 6,269 cases registered against state police personnel in 2024 (Table 16A.5). Chandigarh reported 4,069 of them. NCRB gives no reason.',
              'The National Human Rights Commission (NHRC) takes complaints separately. This page shows NCRB counts only.',
            ],
            processing: [
              'Read Table 16A.6 of Crime in India 2024, Volume III, and the cases registered in Table 16A.5.',
              'Check that the six types add up to the total in every column of Table 16A.6, and that the states and UTs add up to the India total in Table 16A.5.',
              'Check the total (13 cases), encounter killing (4) and deaths in custody (6) against the table.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'Anti-human trafficking units registered 2,135 cases in 2024: 1,125 under the IPC and 1,010 under the BNS. Telangana registered 423 cases and Maharashtra 337. The units counted 6,018 victims of trafficking, 2,297 of them below 18 years.',
        },
        {
          chart: {
            kind: 'states',
            slug: 'human-trafficking-by-state',
            noRank: true,
            checked: CHECKED_PART6,
            title: 'Human trafficking cases by state, 2024',
            subtitle: 'Cases of human trafficking registered by anti-human trafficking units, IPC and BNS, by state and UT. Darker means more cases.',
            punches: { office: 'NCRB', unit: 'cases', period: '2024' },
            note: 'A count, not a rate: states with more people can have more cases. NCRB says states should not be compared on crime figures alone.',
            sources: [cii2024v3],
            format: COUNT,
            data: { file: TRAFFICKING, where: { period: '2024', indicator: 'cases', law: 'ipc-bns', age: 'all', sex: 'total' }, x: 'geography' },
            total: true,
            open: 'map',
            scale: 'seq',
            bins: [1, 10, 50, 100, 200],
            short: 'Human trafficking cases',
            know: [
              'NCRB counts only the cases that are reported to the anti-human trafficking units (AHTUs) of each state and UT.',
              'NCRB prints a rate per lakh people, but to one decimal: it is 0.2 for India, and 0.0 or 0.1 in 23 of the 36 states and UTs. So this chart shows the counts. The rate is in the data file.',
              'In 2024, 1,125 cases were registered under the IPC and 1,010 under the BNS, which replaced the IPC on 1 July 2024. NCRB counted 2,250 cases in 2022 and 2,183 in 2023.',
              'The units counted 6,018 victims of trafficking and 5,839 victims rescued. Rescued victims include victims of earlier cases and of cases registered in other states.',
              'Seven states and UTs registered no case: Mizoram, Nagaland, Sikkim, the Andaman and Nicobar Islands, Dadra and Nagar Haveli and Daman and Diu, Ladakh and Lakshadweep.',
              REGISTRATION_KNOW,
            ],
            processing: [
              'Read Tables 14.1, 14.3 and 14.4 of Crime in India 2024, Volume III.',
              'Check that IPC and BNS cases add up to the total in every row, and that the states and UTs add up to the India total.',
              'Check India (2,135 cases, 6,018 victims) and Telangana (423 cases) against the tables.',
              'Match state names to the site geography table.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'In 2024, 98,375 children were reported missing, and 48,800 children missing from earlier years were still untraced. Of these {{147175 plain 0}} children, the police traced 98,826 during 2024, or 67.1%. Girls were 75,603 of the children reported missing in 2024.',
        },
        {
          chart: {
            kind: 'states',
            slug: 'missing-children-traced-by-state',
            noRank: true,
            checked: CHECKED_PART6,
            title: 'Missing children traced by state, 2024',
            subtitle: 'Children below 18 traced during 2024, as a share of all missing children: those reported missing in 2024 and those still untraced from earlier years, by state and UT.',
            punches: { office: 'NCRB', unit: '% traced', period: '2024' },
            note: 'Children traced in 2024 include children who went missing in earlier years.',
            sources: [cii2024v3],
            format: { unit: '%', decimals: 1 },
            data: { file: MISSING, where: { period: '2024', indicator: 'recovery-percentage', sex: 'total' }, x: 'geography' },
            open: 'map',
            scale: 'seq',
            bins: [30, 50, 65, 80, 90],
            short: 'Missing children traced',
            missing: { mizoram: 'NCRB records no missing children', lakshadweep: 'NCRB records no missing children' },
            know: [
              "NCRB's recovery percentage is the children traced in 2024 divided by all missing children, times 100. All missing children are the children reported missing in 2024 plus the children still untraced from earlier years.",
              'In 2024, 98,375 children were reported missing and 48,800 were still untraced from earlier years: 1,47,175 in all. The police traced 98,826. At the end of 2024, 48,349 were still untraced.',
              'Girls were 75,603 of the 98,375 children reported missing in 2024.',
              'West Bengal reported the most children missing in 2024, 15,849, then Madhya Pradesh with 14,296.',
              'The table carries the NCRB footnote "States/UTs may not be compared purely on the basis of crime figures".',
            ],
            processing: [
              'Read Table 15.1 of Crime in India 2024, Volume III (two pages).',
              'Check, for every row and for boys, girls and transgender children, that the children untraced from earlier years plus the children missing in 2024 equal all missing children, and that all missing children less those traced equal those still untraced.',
              'Check that the states and UTs add up to the India total.',
              'Check India (98,375 missing in 2024, 98,826 traced, 67.1%) and Odisha (26.4%) against the table.',
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
      'NCRB counts the crimes that the police register, not all crimes. A higher recorded crime rate can mean better registration, not more crime. NCRB counts only the principal offence in each case, and computes rates with its own population base. These figures do not show which states are safer: NCRB says states should not be compared on crime figures alone.',
    publisher:
      'The National Crime Records Bureau (NCRB), Ministry of Home Affairs, publishes Crime in India and Prison Statistics India. Court pendency comes from answers by the Department of Justice, Ministry of Law and Justice (MoLJ), in the Lok Sabha and the Rajya Sabha. Each answer quotes the National Judicial Data Grid (NJDG).',
    frequency:
      'Crime in India and Prison Statistics India: once a year. NCRB gives no release date for Crime in India 2024. Prison Statistics India 2024 came out on 6 May 2026 and was revised on 15 Sep 2026. Pendency: in answers to questions in Parliament, with no fixed schedule. No date published for the next releases.',
    revisions:
      "NCRB revises counts in later editions, so the national trend uses the latest edition that prints each year. This page uses the revised Prison Statistics India 2024, with West Bengal's 2024 data. NJDG is a live dashboard: counts for nearby dates can differ.",
    breaks:
      'The Bharatiya Nyaya Sanhita (BNS) replaced the Indian Penal Code (IPC) on 1 July 2024, and NCRB links part of the fall in 2024 to it: simple hurt and criminal intimidation are no longer cognizable. NCRB also changed the population base of its rates in 2018 and in 2020. The national crime rate chart breaks at each change. NCRB rates of crimes against Scheduled Castes and Scheduled Tribes use the Census 2011 population of each group, not a projection.',
    coverage:
      'India and all 36 states and UTs. Crime: calendar year 2024, with national rates from 2015. Prisons: 31 December 2024, with India from 2014. Crimes against Scheduled Castes and Scheduled Tribes, deaths in police custody and in prisons, trafficking and missing children: 2024. Deaths by cause and cases against police for human right violation are shown for India only. Courts: district courts by state on 30 July 2026, and year-end totals for India from 2021. High Courts and the Supreme Court are shown for India only.',
    missing:
      'No crime figures for cities. No trend in the charge-sheeting or conviction rate. No data on how long undertrials are held. Murder and crimes against women rates start in 2017. High Court pendency is not shown by state, because seven High Courts serve more than one state or UT. No custody death counts from the National Human Rights Commission (NHRC): they differ from NCRB counts, and this page does not combine the two. No trend in deaths in custody before 2024. No publisher states a reuse licence; NCRB pages say "All Rights Reserved".',
  },
  sources: [cii2024v1, cii2024v2, cii2024v3, ...CII_EDITIONS, psi2024, ...PSI_SUMMARIES, ls3295, ls3371, rs597],
  related: [
    { label: 'Population: Population projection', href: '/charts/population-projection/' },
    { label: 'Elections: Lok Sabha turnout by state', href: '/charts/lok-sabha-turnout-by-state/' },
    { label: 'Education: Literacy by state', href: '/charts/literacy-by-state/' },
    { label: 'Living standards: Household spending by state', href: '/charts/household-spending-by-state/' },
    { label: 'How we check: method breaks', href: '/how-we-check/#part-3' },
  ],
}

export default topic
