// How we check. Copy is verbatim from the board.

import type { Status } from '../types'

export interface Section {
  heading: string
  body: string
}

export interface Check {
  number: string
  heading: string
  body: string
  machine: string
  person: string
}

export interface Punch {
  heading: string
  example: string
  body: string
}

export interface StatusRow {
  /** null: the "No status word" row. */
  status: Status | null
  /** Example hallmark: office, unit, period. */
  hallmark?: { office: string; unit: string; period: string }
  means: string
  changes: string
}

export interface BreakExample {
  /** Chart slug the plot reads; the frame on this page is a copy. */
  chart: string
  title: string
  subtitle: string
  finding: string
  note: string
  hallmark: { office: string; unit: string; period: string; status: readonly Status[] }
  source: string
}

export interface Row {
  cells: readonly string[]
}

export interface HowWeCheck {
  breadcrumb: string
  title: string
  hindi: string
  intro: string
  checked: string
  object: { caption: string }
  part1: { eyebrow: string; heading: string; lede: string; labels: { machine: string; person: string }; checks: readonly Check[] }
  part2: {
    eyebrow: string
    heading: string
    lede: string
    punches: readonly Punch[]
    statusHeads: readonly string[]
    statuses: readonly StatusRow[]
    rule: Section
  }
  part3: {
    eyebrow: string
    heading: string
    lede: string
    examples: readonly BreakExample[]
    revisions: { heading: string; body: string; heads: readonly string[]; rows: readonly Row[] }
  }
  part4: { eyebrow: string; heading: string; rules: readonly Section[] }
  part5: {
    eyebrow: string
    heading: string
    lede: string
    heads: readonly string[]
    targets: readonly Row[]
    actions: { report: string; log: string }
  }
}

const howWeCheck: HowWeCheck = {
  breadcrumb: 'About the data / How we check',
  title: 'How we check',
  hindi: 'हम कैसे जाँचते हैं',
  intro:
    "Every figure on this site comes from a publisher's own release. This page says what we do to it before it reaches a chart, and what we never do.",
  checked: 'Page checked 17 Nov 2026',
  object: {
    caption:
      'Recast · A merchant and a scribe weigh goods. Red sandstone relief, made with an image model. It stands in for no data.',
  },
  part1: {
    eyebrow: 'Part 1 · Before a figure publishes',
    heading: 'What happens to a number before it reaches a chart?',
    lede: 'Four checks, in this order. A machine does the repeat work. A person decides what publishes.',
    labels: { machine: 'Machine', person: 'Person' },
    // The checks list.
    checks: [
      {
        number: '01',
        heading: 'Fetch',
        body: 'We download the release as the publisher posted it: the PDF, the Excel sheet or the API response. We store the file with its address, the time we fetched it and a SHA-256 checksum. If we use a copy from another official page, the source line names it.',
        machine: 'Watches each release page and stores the file.',
        person: 'Confirms it is the release the chart needs.',
      },
      {
        number: '02',
        heading: 'Read',
        body: "One parser per source turns the file into rows with a unit, a period and a base year. Where a table exists only as an image, a person types the values from the page and checks doubtful digits at a higher zoom. Example: four election tables in MoSPI's Women and Men in India 2025 have no text layer, so we read them at 2.5x and checked doubtful digits at 4x.",
        machine: 'Parses text, Excel and API files. Stops on any row it cannot decode.',
        person: 'Types values from images and marks them as transcribed.',
      },
      {
        number: '03',
        heading: 'Compare',
        body: "We check the rows against the publisher's own totals and press release. Example: in all 542 constituencies of ECI's 2024 Report 33, the candidate votes sum to the published total. CEA's parts sum to its grand total of 5,63,113 MW for 31 October 2026.",
        machine: 'Sums parts, compares with the last fetch, lists new and revised values.',
        person: 'Reads every revision and every text claim that no longer matches.',
      },
      {
        number: '04',
        heading: 'Stamp',
        body: 'A person reads the list of changes and merges it. Nothing publishes on its own. Each figure gets its hallmark: the office that published it, the unit, our assay seal and the period, plus a status word when one applies. The page shows the date we checked it.',
        machine: 'Builds the pages, the CSV, PNG and SVG files with the hallmark on each.',
        person: 'Merges the change. Without a merge, the site keeps the old figure.',
      },
    ],
  },
  // The hallmark explanation.
  part2: {
    eyebrow: 'Part 2 · The hallmark',
    heading: 'What does the mark on each figure say?',
    lede: 'Every figure carries four punches, read left to right, like the hallmark on a silver coin. A status word follows when the figure is not final.',
    punches: [
      {
        heading: '1 · Office',
        example: 'MoSPI',
        body: 'Who published the figure, by short name: MoSPI, RBI, ORGI, IIPS, ECI, IMD, CEA, MNRE. Square corners, like an office stamp.',
      },
      {
        heading: '2 · Unit',
        example: '% y/y',
        body: 'What the number counts. "% y/y" is the change on the same month a year earlier. Others: persons, per 1,000 live births, MW. Round ends.',
      },
      {
        heading: '3 · Assay seal',
        example: '',
        body: 'Our mark. A person traced the figure to a stored release file and checked it on the date shown. We never put the seal on a figure we have not traced.',
      },
      {
        heading: '4 · Period',
        example: 'OCT 2026',
        body: 'When the figure applies, with four-digit years: OCT 2026 for a month, Q1 2026-27 for a quarter, 2024 for a year, 2022-24 for a span of years.',
      },
    ],
    statusHeads: ['Status word, with a real figure', 'What it means', 'When it changes'],
    statuses: [
      {
        status: 'Provisional',
        hallmark: { office: 'MoSPI', unit: '% y/y', period: 'OCT 2026' },
        means: 'The publisher may still revise it. CPI inflation of 6.09% for October 2026 is provisional (MoSPI, 12 November 2026).',
        changes: 'Removed when the publisher marks it final. For CPI, that is the November release, due 14 December 2026.',
      },
      {
        status: 'Projection',
        hallmark: { office: 'MoHFW', unit: 'persons', period: 'MAR 2026' },
        means: "A publisher's estimate for a date with no count. India's population of 142.6 crore on 1 March 2026 comes from the MoHFW Technical Group's projections of July 2020. We draw projections as a dashed line.",
        changes: 'Replaced by a count when Census 2027 publishes. Its reference date in most states is 1 March 2027.',
      },
      {
        status: 'Survey estimate',
        hallmark: { office: 'MoSPI', unit: '% 15+', period: 'OCT 2026' },
        means: "From a sample survey, not a full count, so it has a margin of error. Unemployment of 4.9% in October 2026 comes from MoSPI's PLFS: people aged 15 and over, current weekly status.",
        changes: 'Never removed. Small states and UTs get an extra note where the publisher warns about sample size.',
      },
      {
        status: 'Method break',
        hallmark: { office: 'MoSPI', unit: '% y/y', period: 'JAN 2026' },
        means: 'The publisher changed the base, the method or the coverage. Values on the two sides do not compare directly. CPI moved to base 2024=100 in January 2026, so we draw two lines, not one.',
        changes: 'Never removed. The chart page lists every break with its date.',
      },
      {
        status: null,
        means: 'The publisher calls the figure final. Census 2011 counts, such as 1,21,08,54,977 people on 1 March 2011, carry no status word, but every Census figure shows its year.',
        changes: 'A final figure can still be revised. A revision is listed on the Releases page.',
      },
    ],
    rule: {
      heading: 'One rule per series',
      body: 'Every page uses the same word for the same series. Provisional: CPI\'s latest month, the IIP quick estimate, IMD\'s monsoon 2026 figures and assembly turnout for 2026. Survey estimate: PLFS, SRS and NFHS-5; NFHS-6 is Survey estimate and Provisional. Projection: population projections. No status word: GDP, the repo rate, the FBIL rate, Census 2011, UDISE+, AISHE, ECI 2024, CEA and MNRE. A value we compute, such as a gap from India, says "Derived" in the chart note.',
    },
  },
  part3: {
    eyebrow: 'Part 3 · Revisions and base-year changes',
    heading: 'What happens when a publisher changes its method?',
    lede: 'We keep both series and mark the break. We do not splice them into one line. Two changes in the last two years show how this looks.',
    // The board numbers these 3.1 and 3.2. Each plot is a copy of a topic chart.
    examples: [
      {
        chart: 'cpi-inflation', // The board plots Jan 2025 to Oct 2026, both bases.
        title: 'Consumer price inflation, January 2025 to October 2026',
        subtitle: '% change on the same month a year earlier, India, rural and urban combined',
        finding:
          'In December 2025, the last month on base 2012=100, prices rose by 1.33%. In January 2026, on base 2024=100 with 12 divisions and new weights, they rose by 2.74%. The two do not compare directly.',
        note: 'Note: MoSPI also publishes a 2024-base back series from 2013. Its rates match the 2012 series, so it is a rescaled link, not a new measure. We do not use it.',
        hallmark: { office: 'MoSPI', unit: '% y/y', period: 'OCT 2026', status: ['Provisional', 'Method break'] },
        source:
          'Source: MoSPI, Consumer Price Index (2012=100) to December 2025 and (2024=100) from January 2026, October 2026 release, 12 Nov 2026. Checked 17 Nov 2026.',
      },
      {
        chart: 'urban-unemployment-quarterly', // The board plots Jan-Mar 2022 to Jul-Sep 2026.
        title: 'Urban unemployment, Jan-Mar 2022 to Jul-Sep 2026',
        subtitle: '% of the urban labour force aged 15+, current weekly status, by quarter',
        finding:
          'PLFS moved to a new sample design in January 2025. There is no quarterly estimate for January to March 2025. Urban unemployment was 6.4% in October to December 2024 on the old design and 6.8% in April to June 2025 on the new one.',
        note: 'Note: MoSPI says to take the new design into account when comparing with releases up to December 2024.',
        hallmark: { office: 'MoSPI', unit: '% 15+', period: 'Q2 2026-27', status: ['Survey estimate', 'Method break'] },
        source: 'Source: MoSPI NSO, PLFS Quarterly Bulletin, July to September 2026, 10 Nov 2026. Checked 17 Nov 2026.',
      },
    ],
    revisions: {
      heading: 'When a publisher revises a figure',
      body: 'A revised figure carries the word "Revised", the earlier value and the date of the change. We keep every earlier version.',
      heads: ['Figure', 'Earlier figure', 'Revised to', 'Status now'],
      rows: [
        { cells: ['Industrial production growth, August 2026', '8.0%, quick estimate', '7.8%, final (28 Oct 2026)', 'Final'] },
        { cells: ['Real GDP growth, 2024-25', '7.1% (RBI Handbook, 31 Jul 2026)', '7.2% (MoSPI, 31 Aug 2026)', 'MoSPI revised 2022-23 to 2025-26 in one release'] },
        { cells: ['Bihar assembly election turnout, 2025', '66.91% (poll day, 11 Nov 2025)', '67.13% (12 Nov 2025)', "Provisional until ECI's Index Card"] },
      ],
    },
  },
  part4: {
    eyebrow: 'Part 4 · Limits we keep',
    heading: 'What do we never do?',
    rules: [
      {
        heading: 'No forecasts of our own',
        body: "Every projection on this site is a publisher's. India's population for 2026 comes from the MoHFW Technical Group's report of July 2020. We mark it Projection and name the report.",
      },
      {
        heading: 'No invented values',
        body: 'Where a publisher gives no figure, we show "No data" and say why. The MoSPI CPI series give no inflation rate for June to December 2013, or for April and May 2020. Those months stay empty.',
      },
      {
        heading: 'No interpolation',
        body: 'We do not draw a line across a gap, and we do not join two methods into one line. PLFS has no estimate for January to March 2025, so chart 3.2 has a gap there.',
      },
      {
        heading: 'No figure without a source',
        body: 'On 12 November 2026 the RBI ticker showed ₹93.77 per US dollar. A ticker is not a dated release, so we use the FBIL reference rate: ₹93.57 for 17 November 2026.',
      },
    ],
  },
  part5: {
    eyebrow: 'Part 5 · Corrections',
    heading: 'What if we get something wrong?',
    lede: 'Anyone can report a problem from any chart page. A fixed error gets a dated note on the chart and a row in the public corrections log. A publisher revision is not a correction; it goes on the Releases page.',
    heads: ['Step', 'Target'],
    targets: [
      { cells: ['We reply to a report', 'Within 2 working days'] },
      { cells: ['We fix the error, or explain why the figure is right', 'Within 7 working days'] },
      { cells: ['A note stays on the affected chart', 'For 12 months'] },
      { cells: ['We publish a reviewed update after a publisher release', 'Within 5 working days'] },
      { cells: ["We find an error in a publisher's own data", 'We tell the publisher and record it on the chart page'] },
    ],
    actions: { report: 'Report a problem', log: 'See the corrections log' },
  },
}

export default howWeCheck
