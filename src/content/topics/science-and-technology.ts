import type { Color, Series, Source, Topic } from '../types'
import { WDI, WDI_ABOUT, comparison } from '../international'

// Data: research/data/science-technology (README: "Proposed charts", "Gaps and cautions") and
// research/data/international (the WDI comparisons). tests/unit/prose.test.ts checks every number
// in the prose.
//
// Licence: IP India allows reuse without asking, with the credit "Office of the Controller General
// of Patents, Designs and Trade Marks, Government of India (ipindia.gov.in)". DST's R&D Statistics
// (NSTMIS) and TRAI's telecom indicators ask for permission by mail first, and the owner has not
// asked yet: no figure from them goes on this page until the reply is kept.

// ---------------------------------------------------------------- Sources

const IP_INDIA = 'Office of the CGPDTM (IP India)'

// The annual report page gives "Published on 02-05-2026" for almost every report, which looks like
// a re-upload date. The 2024-25 PDF was created on 24 Nov 2025.
const ar2425: Source = {
  publisher: IP_INDIA,
  release: 'Annual Report 2024-25, Office of the Controller General of Patents, Designs, Trade Marks and Geographical Indications',
  released: 'not stated',
  url: 'https://ipindia.gov.in/storage/uploads/docs-operator/7a8f0ca4-5a8e-416e-b8d4-5647ec352bb9.pdf',
}

// A scanned report. The PDF was created on 9 Jun 2016.
const ar1415: Source = {
  publisher: IP_INDIA,
  release: 'Annual Report 2014-15, Office of the Controller General of Patents, Designs, Trade Marks and Geographical Indications',
  released: 'not stated',
  url: 'https://ipindia.gov.in/storage/uploads/docs-operator/d6c55361-1cf1-46a7-b98f-01cbd944b657.pdf',
}

// ---------------------------------------------------------------- Data

const DIR = 'science-technology'
const APPS = `${DIR}/patent-applications.csv`
const GRANTS = `${DIR}/patents-granted-and-in-force.csv`
const BY_STATE = `${DIR}/patent-applications-by-state.csv`
const BY_TYPE = `${DIR}/patent-applications-by-applicant-type.csv`
const BY_FIELD = `${DIR}/patents-by-field.csv`

const CHECKED = '2026-11-26'
const COUNT = { scale: 'none', decimals: 0 } as const

/** Who filed, in the order of Appendix C: residents first, then the three routes of non-residents. */
const APPLICANTS = [
  ['residents', 'Indian residents', 's4'],
  ['non-residents, ordinary', 'Non-residents, ordinary', 's2'],
  ['non-residents, convention', 'Non-residents, convention', 's6'],
  ['non-residents, PCT national phase', 'Non-residents, PCT national phase', 's5'],
] as const satisfies readonly (readonly [string, string, Color])[]

/** Categories of Indian applicants, in the order of the category table. */
const APPLICANT_TYPES = [
  ['educational institution', 'Educational institutions', 's1'],
  ['natural person', 'Individuals', 's2'],
  ['other than natural person', 'Companies and other bodies', 's5'],
  ['startup', 'Startups', 's6'],
  ['small entity', 'Small entities', 's3'],
] as const satisfies readonly (readonly [string, string, Color])[]

/** Major fields of invention in Appendix E and F. Pharmaceuticals are left out: from 2022-23 they are counted in Chemical. */
const FIELDS: Readonly<Record<string, string>> = {
  'computer science and electronics': 'Computer science and electronics',
  'mechanical engineering': 'Mechanical engineering',
  chemical: 'Chemical, with pharmaceuticals',
  'bio-medical': 'Bio-medical',
  communication: 'Communication',
  electrical: 'Electrical',
  physics: 'Physics',
  'polymer science and technology': 'Polymer science and technology',
  'other fields': 'Other fields',
}

const applicantSeries = (): Series[] =>
  APPLICANTS.map(([applicant, label, color]) => ({ key: applicant, label, color, file: APPS, where: { geography: 'india', applicant } }))

// Know lines that several charts share.
const RESIDENT_KNOW =
  'A resident is an applicant whose address is in India. The office counts an application by its first applicant, so an application by an Indian and a foreign applicant together counts once.'

const ROUTES_KNOW =
  'Non-residents file in three ways: an ordinary application filed first in India; a convention application, which claims the date of an earlier filing in another country; and a national phase application under the Patent Cooperation Treaty (PCT), which enters India after an international application.'

const YEAR_KNOW = 'Each year is a financial year, April to March.'

const GRANT_KNOW =
  'A patent is granted after the office examines an application. Examination starts only when the applicant asks for it, so a grant usually comes some years after the filing.'

const topic: Topic = {
  slug: 'science-and-technology',
  name: 'Science and technology',
  hindi: 'विज्ञान और प्रौद्योगिकी',
  question: 'How many patents do Indians file, and how much does India spend on research?',
  standfirst:
    'In 2024-25, {{110375 plain 0}} patent applications were filed in India, 61.79% of them by Indian residents. In 2005-06, residents filed 4,521 of 24,505.',
  figures: [
    { chart: 'patent-applications', series: 'all applicants', label: 'Patent applications filed' },
    { chart: 'patent-applications', series: 'residents', label: 'Patent applications by Indian residents' },
    { chart: 'patents-granted', series: 'all', label: 'Patents granted' },
  ],
  nextRelease: 'Annual report for 2025-26: not announced',
  parts: [
    {
      title: 'How many patents do Indians apply for?',
      lede: 'Indian residents filed 68,201 patent applications in 2024-25, up from 4,521 in 2005-06. Their share of all filings rose to 61.79%.',
      blocks: [
        {
          chart: {
            kind: 'columns',
            slug: 'patent-applications',
            checked: CHECKED,
            title: 'Patent applications filed in India by residents and non-residents, 2005-06 to 2024-25',
            subtitle: 'Patent applications filed at the Indian Patent Office each financial year, by Indian residents and by non-residents through each route.',
            punches: { office: 'IP India', unit: 'applications', period: '2024-25' },
            note: 'Non-residents are split by route. In 2006-07 the parts do not add up to the published total of 28,940.',
            sources: [ar2425, ar1415],
            format: COUNT,
            stacked: true,
            series: [
              ...applicantSeries(),
              // The figures, the table and the prose; not drawn.
              { key: 'all applicants', label: 'All applicants', color: 'ink', hidden: true, file: APPS, where: { geography: 'india', applicant: 'all applicants' } },
            ],
            know: [
              RESIDENT_KNOW,
              ROUTES_KNOW,
              YEAR_KNOW,
              'For 2006-07 the report prints residents 5,314 and a total of 28,940, but the parts add up to 29,744. We show the values as printed.',
              'For 2019-20 Appendix C gives 56,468 applications and Appendix D of the same report 56,267. This chart uses Appendix C, which splits the total.',
            ],
            processing: [
              'Read Appendix C of the Annual Report 2024-25 for 2015-16 to 2024-25, and Appendix C of the Annual Report 2014-15 for 2005-06 to 2014-15.',
              'The 2014-15 report is a scan, so we read its table from the page image. We check 2013-14 and 2014-15 against Appendix C of the Annual Report 2022-23. All agree.',
              'Check 2015-16 to 2022-23 against the Annual Report 2022-23, and 2020-21 to 2024-25 against the trends table in the 2024-25 report. All agree.',
              'Check that residents and the three routes add up to the total each year. All do, except 2006-07.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'Tamil Nadu filed the most applications in 2024-25, 15,440, then Karnataka, 8,371, and Maharashtra, 7,893.',
        },
        {
          chart: {
            kind: 'states',
            slug: 'patent-applications-by-state',
            checked: CHECKED,
            title: 'Patent applications by Indian applicants by state, 2024-25',
            subtitle: 'Patent applications filed by Indian applicants, by the state or UT of the applicant, all routes.',
            punches: { office: 'IP India', unit: 'applications', period: '2024-25' },
            note: 'Counts, not rates: a state with more people and more firms files more. The office lists no applications from Lakshadweep.',
            sources: [ar2425],
            format: COUNT,
            data: { file: BY_STATE, where: { period: '2024-25', route: 'all routes' }, x: 'geography' },
            total: true,
            open: 'map',
            scale: 'seq',
            bins: [100, 500, 1000, 2500, 5000],
            short: 'Patent applications',
            timeline: { column: 'period', values: ['2023-24', '2024-25'] },
            missing: { lakshadweep: 'Not listed in Appendix B' },
            know: [
              'The state is the state of origin of the application: the address of the Indian applicant.',
              'The office places each application by the address of the Indian applicant. A firm\'s filings count where its address is, which may not be where the research was done.',
              'Educational institutions filed more than half of all Indian applications in 2024-25. A state with many such filings can rise fast in one year.',
              YEAR_KNOW,
            ],
            processing: [
              'Read Appendix B of the Annual Report 2024-25: ordinary, convention and PCT national phase applications by state, 2024-25 and 2023-24.',
              'Add the three routes for each state. Almost every application is an ordinary one.',
              'Check that the states add up to the TOTAL row, and that the total equals the applications by residents in Appendix C. Both agree.',
              'Check Tamil Nadu (15,440), Karnataka (8,371) and Maharashtra (7,893) against the report text. All agree.',
              'Match state names to the site geography table.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'Educational institutions filed 37,681 applications in 2024-25, more than half of all Indian filings. Individuals filed 17,170, and startups 2,680.',
        },
        {
          chart: {
            kind: 'columns',
            slug: 'patent-applications-by-applicant-type',
            checked: CHECKED,
            title: 'Patent applications by Indian applicants by type of applicant, 2020-21 to 2024-25',
            subtitle: 'Patent applications filed by Indian applicants each financial year, by the category the applicant files under.',
            punches: { office: 'IP India', unit: 'applications', period: '2024-25' },
            note: 'The table gives no filings by educational institutions in 2020-21, before they had a category of their own.',
            sources: [ar2425],
            format: COUNT,
            stacked: true,
            series: APPLICANT_TYPES.map(([applicant_type, label, color]) => ({
              key: applicant_type,
              label,
              color,
              file: BY_TYPE,
              where: { geography: 'india', origin: 'indian', applicant_type },
            })),
            know: [
              'An applicant files under one category, and the category sets the fee. Individuals, startups, small entities and educational institutions pay lower fees.',
              'The Patents (Amendment) Rules of September 2021 gave educational institutions their own lower fee. The table gives them 0 in 2020-21 and 7,405 in 2021-22.',
              'Companies and other bodies are "other than natural persons" that are not a startup, a small entity or an educational institution.',
              'For 2020-21 the categories add up to 24,336, against a published total of 24,326.',
              YEAR_KNOW,
            ],
            processing: [
              'Read the table "Trends in Category-Wise Patent of Applications" in Chapter 2 of the Annual Report 2024-25: Indian applicants.',
              'Check that the categories add up to the Indian total each year, and that the total equals the residents in Appendix C. All agree, except the sum for 2020-21.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How many patents does India grant?',
      lede: 'The office granted 33,504 patents in 2024-25, after {{103057 plain 0}} in 2023-24. Indian patentees received 10,682 of them.',
      blocks: [
        {
          chart: {
            kind: 'columns',
            slug: 'patents-granted',
            checked: CHECKED,
            title: 'Patents granted in India to Indian and foreign patentees, 2005-06 to 2024-25',
            subtitle: 'Patents granted by the Indian Patent Office each financial year, by whether the patentee is Indian or foreign.',
            punches: { office: 'IP India', unit: 'patents', period: '2024-25' },
            note: 'Grants follow the office\'s examination work, not the filings of the same year. The report gives no reason for the peak in 2023-24.',
            sources: [ar2425, ar1415],
            format: COUNT,
            stacked: true,
            series: [
              { key: 'indian', label: 'Indian patentees', color: 's4', file: GRANTS, where: { geography: 'india', measure: 'patents granted', patentee: 'indian' } },
              { key: 'foreign', label: 'Foreign patentees', color: 's5', file: GRANTS, where: { geography: 'india', measure: 'patents granted', patentee: 'foreign' } },
              // Derived: the sum of Indian and foreign patentees. The figures, the table and the prose; not drawn.
              { key: 'all', label: 'All patentees', color: 'ink', hidden: true, file: GRANTS, where: { geography: 'india', measure: 'patents granted', patentee: 'all' } },
            ],
            know: [
              GRANT_KNOW,
              'Grants rose from 30,073 in 2021-22 to 1,03,057 in 2023-24, then fell to 33,504 in 2024-25. Applications examined fell from 73,165 in 2020-21 to 15,726 in 2024-25. The report does not explain either change.',
              YEAR_KNOW,
            ],
            processing: [
              'Read Appendix D of the Annual Report 2024-25 for 2015-16 to 2024-25, and Appendix D of the Annual Report 2014-15 for 2005-06 to 2014-15, from the page image.',
              'Check the overlapping years against the Annual Report 2022-23, and 2020-21 to 2024-25 against the trends table in the 2024-25 report. All agree.',
            ],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'On 1 April 2025, {{230480 plain 0}} patents were in force in India. Indian patentees held 50,848 of them, up from 4,486 in 2005-06.',
        },
        {
          chart: {
            kind: 'line',
            slug: 'patents-in-force',
            checked: CHECKED,
            title: 'Patents in force in India held by Indian and foreign patentees, 2005-06 to 2024-25',
            subtitle: 'Patents in force at the end of each financial year, by whether the patentee is Indian or foreign.',
            punches: { office: 'IP India', unit: 'patents', period: '2024-25' },
            note: 'A patent stays in force for up to 20 years from filing while its owner pays the yearly renewal fee.',
            sources: [ar2425, ar1415],
            format: COUNT,
            series: [
              { key: 'indian', label: 'Indian patentees', color: 's4', file: GRANTS, where: { geography: 'india', measure: 'patents in force', patentee: 'indian' } },
              { key: 'foreign', label: 'Foreign patentees', color: 's5', file: GRANTS, where: { geography: 'india', measure: 'patents in force', patentee: 'foreign' } },
            ],
            know: [
              'A patent in force has been granted, has not expired and has not lapsed for an unpaid renewal fee.',
              'The report for 2024-25 gives the count "as on April 1, 2025".',
              YEAR_KNOW,
            ],
            processing: ['Read Appendix D of the Annual Reports 2024-25 and 2014-15, as for patents granted.'],
            nextRelease: 'not announced',
          },
        },
        {
          text: 'Computer science and electronics had the most applications in 2024-25, 29,494, and the most patents granted, 10,058.',
        },
        {
          chart: {
            kind: 'bars',
            slug: 'patents-by-field',
            checked: CHECKED,
            title: 'Patent applications and grants in India by field of invention, 2024-25',
            subtitle: 'Patent applications filed and patents granted in 2024-25, by the major field of invention the office assigns.',
            punches: { office: 'IP India', unit: 'applications · patents', period: '2024-25' },
            note: 'Chemical includes pharmaceuticals. Other fields include biotechnology, food, metallurgy, textiles and civil engineering.',
            sources: [ar2425],
            format: COUNT,
            by: 'field',
            rowHead: 'Field of invention',
            order: Object.keys(FIELDS),
            labels: FIELDS,
            series: [
              { key: 'filed', label: 'Applications filed', color: 's2', file: BY_FIELD, x: 'field', where: { period: '2024-25', measure: 'applications filed', group: 'major', field: Object.keys(FIELDS) } },
              { key: 'granted', label: 'Patents granted', color: 's4', file: BY_FIELD, x: 'field', where: { period: '2024-25', measure: 'patents granted', group: 'major', field: Object.keys(FIELDS) } },
            ],
            panels: [
              { label: 'Applications filed', series: ['filed'], own: true },
              { label: 'Patents granted', series: ['granted'], own: true },
            ],
            know: [
              'The office assigns each application to one field. A grant in 2024-25 is mostly for an application filed in an earlier year.',
              'From 2022-23 the office counts pharmaceuticals with chemical, so this chart shows the two together.',
              'For patents granted, the fields add up to 33,506, against a published total of 33,504.',
            ],
            processing: [
              'Read Appendix E (applications) and Appendix F (grants) of the Annual Report 2024-25, the row for 2024-25.',
              'Check that the major fields add up to the total, and that Appendix E1 and F1 add up to "other fields". Applications agree; grants differ by 2.',
            ],
            nextRelease: 'not announced',
          },
        },
      ],
    },
    {
      title: 'How does India\'s research compare?',
      lede: 'India spent 0.65% of its GDP on research and development in 2020, by the World Bank\'s figures. China spent 2.36%, and the world 2.46%.',
      blocks: [
        {
          chart: comparison({
            slug: 'rd-spending-comparison',
            checked: CHECKED,
            file: 'wdi-rd-spending.csv',
            title: 'Spending on research and development, India and other countries, 2000 and 2020',
            subtitle: 'Gross domestic spending on research and development as a share of GDP, five rows with a value in both years.',
            unit: '% of GDP',
            latest: '2020',
            base: '2000',
            countries: ['IND', 'CHN', 'IDN', 'LKA', 'WLD'],
            format: { unit: '%', decimals: 2 },
            sources: [WDI.rd],
            note: 'Bangladesh, Nepal and Pakistan have no value for 2020, so they are left out.',
            know: [
              'Research and development spending counts the current and capital spending of firms, government, universities and non-profit bodies on research done in the country, whoever pays for it.',
              'The UNESCO Institute for Statistics collects the figures from national research surveys. In India the Department of Science and Technology (DST) runs the survey.',
              'DST published new estimates in 2026, from its first national survey since 2018-19. They start in 2021-22 and are much higher. WDI does not carry them yet, so this chart stops at 2020.',
            ],
            processing: ['Leave out Bangladesh, Nepal and Pakistan, which have no 2020 value.', 'Show each value to two decimals.', 'Rank the rows by the 2020 value.'],
          }),
        },
        {
          text: 'India had 259 researchers for every million people in 2020, up from 111 in 2000. China had 1,600 and the world 1,652.',
        },
        {
          chart: comparison({
            slug: 'researchers-comparison',
            checked: CHECKED,
            file: 'wdi-researchers-per-million.csv',
            title: 'Researchers per million people, India and other countries, 2000 and 2020',
            subtitle: 'Researchers engaged in research and development, per million people, five rows with a value in both years.',
            unit: 'per million people',
            latest: '2020',
            base: '2000',
            countries: ['IND', 'CHN', 'IDN', 'LKA', 'WLD'],
            format: { decimals: 0 },
            sources: [WDI.researchers],
            note: 'Bangladesh, Nepal and Pakistan have no value for one of the two years, so they are left out.',
            know: [
              'Researchers are professionals who do research or develop concepts, theories, models, techniques, instruments, software or methods. WDI divides their number by the mid-year population.',
              'The figures come from national research surveys. WDI notes that the timing and coverage of these surveys, and their methods, differ between countries.',
            ],
            processing: ['Leave out Bangladesh, Nepal and Pakistan.', 'Show each value to the nearest whole researcher.', 'Rank the rows by the 2020 value.'],
          }),
        },
        {
          text: 'Researchers in India published {{228174.31 plain 0}} scientific and technical articles in 2023, up from 18,905 in 1996.',
        },
        {
          chart: {
            kind: 'line',
            slug: 'journal-articles',
            checked: CHECKED,
            title: 'Scientific and technical journal articles from India, 1996 to 2023',
            subtitle: 'Articles in science and engineering journals with at least one author in India, counted by share of authors, each calendar year.',
            punches: { office: 'World Bank', unit: 'articles', period: '2023' },
            note: 'An article with authors in two countries counts half to each, so a year\'s count can have decimals.',
            sources: [WDI.articles],
            format: { scale: 'none', decimals: 0 },
            series: [{ key: 'india', label: 'India', color: 'ink', file: 'international/wdi-journal-articles.csv', where: { country: 'india' } }],
            know: [
              'The National Science Foundation (NSF) of the United States counts the articles in its Science and Engineering Indicators, from the Scopus database. The World Bank reprints the count in WDI.',
              'Articles are counted by the share of authors in each country: an article with three authors, one of them in India, counts one third to India.',
              'WDI says values before 2003 come from earlier editions of the NSF report and may not be strictly comparable with later years. Scopus holds articles with an English title and abstract only.',
              'No Indian office publishes its own count, so this chart uses the WDI series for India alone.',
            ],
            processing: ['Take the India values for 1996 to 2023 from one World Bank WDI API response, update of 11 Nov 2026.', 'Show each value to the nearest whole article.'],
            nextRelease: 'not announced',
          },
        },
      ],
    },
  ],
  about: {
    intro:
      'Patents here come from the annual reports of the Indian patent office. Research spending and researchers come from the World Bank, for comparison with other countries. India\'s own research spending figures, from the Department of Science and Technology, and the price of mobile data, from TRAI, will follow: both publishers ask for permission before reuse.',
    publisher:
      ['The Office of the Controller General of Patents, Designs, Trade Marks and Geographical Indications (CGPDTM, "IP India"), Department for Promotion of Industry and Internal Trade, publishes an annual report with the year\'s patent, design and trade mark figures.', WDI_ABOUT].join(' '),
    frequency:
      'IP India: one annual report each financial year, April to March, published some months after the year ends; the report for 2024-25 is the latest. WDI: updated several times a year; this page uses the update of 11 Nov 2026.',
    revisions:
      'IP India reprints ten years of filings and grants in each report. The years that overlap in the 2014-15, 2022-23 and 2024-25 reports agree. WDI revises whole series at each update.',
    breaks:
      'From 2022-23 the office counts pharmaceutical applications with chemical. Educational institutions became a category of applicant in 2021-22. In WDI, India\'s research spending stops at 2020, before DST\'s new survey.',
    coverage:
      'All India, with filings by state for 2023-24 and 2024-25. The state is the address of the Indian applicant. Grants and patents in force are for India only, by Indian or foreign patentee.',
    missing:
      'India\'s own research spending, researchers and mobile data prices are not here yet: DST and TRAI ask for permission by mail before reuse. No grants by state. No values for Lakshadweep. Bangladesh, Nepal and Pakistan have no research spending or researcher values for the comparison years.',
  },
  sources: [ar2425, ar1415, WDI.rd, WDI.researchers, WDI.articles],
  related: [
    { label: 'Education: College enrolment ratio by state', href: '/charts/college-enrolment-ratio-by-state/' },
    { label: 'Living standards: Internet use by state, women and men', href: '/charts/internet-use-women-and-men/' },
    { label: 'Economy: UPI payments', href: '/charts/upi-transactions/' },
    { label: 'How we check: derived values', href: '/how-we-check/#hallmark' },
  ],
}

export default topic
