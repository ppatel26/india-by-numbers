// Copy for the How we check page.

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
  example?: string
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
  part1: { eyebrow: string; heading: string; lede: string; labels: { machine: string; person: string; example: string }; checks: readonly Check[] }
  part2: {
    eyebrow: string
    heading: string
    lede: string
    punches: readonly Punch[]
    statusHeads: readonly string[]
    statuses: readonly StatusRow[]
    rule: { heading: string; items: readonly { word: string; series: string }[] }
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
    "Every figure comes from a publisher's own release.",
  checked: 'Page checked 18 Nov 2026',
  part1: {
    eyebrow: 'Part 1 · Before a figure publishes',
    heading: 'What happens to a number before it reaches a chart?',
    lede: 'Four steps, in order. Scripts do the repeat work. A person decides what goes live.',
    labels: { machine: 'Script', person: 'Person', example: 'Example' },
    checks: [
      {
        number: '01',
        heading: 'Fetch',
        body: 'We download each release as the publisher posted it, and record its address and SHA-256 checksum.',
        machine: 'Downloads the file.',
        person: 'Confirms it is the release the chart needs.',
      },
      {
        number: '02',
        heading: 'Read',
        body: 'A script for each source turns the file into rows, each with a unit, a period and a base year.',
        machine: 'Reads PDF text, Excel and API files. Stops on a row it cannot read.',
        person: 'Types the values from tables that exist only as images, and marks them transcribed.',
        example: 'Four election tables in Women and Men in India 2025 are images. We read them at 2.5x zoom, and doubtful digits at 4x.',
      },
      {
        number: '03',
        heading: 'Compare',
        body: "The rows must add up to the publisher's own totals.",
        machine: 'Adds up the parts. A test fails if the text quotes a number that is not in the data.',
        person: 'Reads every revised value and rewrites any sentence it changes.',
        example: 'ECI Report 33: candidate votes add up to the total in all 542 constituencies. CEA: the parts add up to 5.63 lakh MW on 31 October 2026.',
      },
      {
        number: '04',
        heading: 'Stamp',
        body: 'A person reviews the change and publishes it. Nothing goes live on its own.',
        machine: 'Builds every page, CSV, PNG and SVG, each with its hallmark.',
        person: 'Publishes the change. Until then, the site keeps the old figure.',
      },
    ],
  },
  // The hallmark explanation.
  part2: {
    eyebrow: 'Part 2 · The hallmark',
    heading: 'What does the mark on each figure say?',
    lede: 'Four punches, read left to right, like the hallmark on a silver coin. A status word follows when a figure is not final.',
    punches: [
      {
        heading: '1 · Office',
        example: 'MoSPI',
        body: 'Who published it: MoSPI, RBI, ORGI and the others. Square corners, like an office stamp.',
      },
      {
        heading: '2 · Unit',
        example: '% y/y',
        body: 'What the number counts. "% y/y" is the change on the same month a year earlier. Round ends.',
      },
      {
        heading: '3 · Assay seal',
        example: '',
        body: 'Our mark: we traced the figure to a stored release file on the date shown.',
      },
      {
        heading: '4 · Period',
        example: 'OCT 2026',
        body: 'When the figure applies: OCT 2026, Q1 2026-27, 2024, or 2022-24 for a span of years.',
      },
    ],
    statusHeads: ['Status word, with a real figure', 'What it means', 'When it changes'],
    statuses: [
      {
        status: 'Provisional',
        hallmark: { office: 'MoSPI', unit: '% y/y', period: 'OCT 2026' },
        means: 'The publisher may still revise it. Example: CPI inflation of 6.09% for October 2026.',
        changes: 'Dropped when the publisher marks it final. For CPI, on 14 December 2026.',
      },
      {
        status: 'Projection',
        hallmark: { office: 'MoHFW', unit: 'persons', period: 'MAR 2026' },
        means: "A publisher's estimate for a date with no count. Example: 142.6 crore people on 1 March 2026. Drawn as a dashed line.",
        changes: 'Replaced by the Census 2027 count.',
      },
      {
        status: 'Survey estimate',
        hallmark: { office: 'MoSPI', unit: '% 15+', period: 'OCT 2026' },
        means: 'From a sample, not a full count, so it has a margin of error. Example: unemployment of 4.9% in October 2026 (PLFS).',
        changes: 'Never dropped. Small states and UTs get a note on sample size.',
      },
      {
        status: 'Method break',
        hallmark: { office: 'MoSPI', unit: '% y/y', period: 'JAN 2026' },
        means: 'The base, method or coverage changed, so the two sides do not compare. Example: CPI moved to base 2024=100 in January 2026.',
        changes: 'Never dropped. The chart page lists each break.',
      },
      {
        status: null,
        means: 'Final, as the publisher says. Example: Census 2011 counted 121.09 crore people.',
        changes: 'A final figure can still be revised. Revisions go on the Releases page.',
      },
    ],
    rule: {
      heading: 'The same word for the same series, on every page',
      items: [
        { word: 'Provisional', series: "CPI's latest month, the IIP quick estimate, monsoon 2026, assembly turnout 2026, NFHS-6" },
        { word: 'Survey estimate', series: 'PLFS, SRS, NFHS-5, NFHS-6' },
        { word: 'Projection', series: 'Population projections' },
        { word: 'No status word', series: 'GDP, the repo rate, the FBIL rate, Census 2011, UDISE+, AISHE, ECI 2024, CEA, MNRE' },
        { word: 'Derived', series: 'A value we compute, such as a gap from India. Shown in the chart note.' },
      ],
    },
  },
  part3: {
    eyebrow: 'Part 3 · Revisions and base-year changes',
    heading: 'What happens when a publisher changes its method?',
    lede: 'We keep both series and mark the break. We never splice them into one line.',
    examples: [
      {
        chart: 'cpi-inflation',
        title: 'Consumer price inflation, January 2025 to October 2026',
        subtitle: '% change on the same month a year earlier, India, rural and urban combined',
        finding:
          'December 2025, the last month on base 2012=100: 1.33%. January 2026, the first on base 2024=100: 2.74%. The two do not compare directly.',
        note: 'Note: MoSPI also publishes a 2024-base back series from 2013. It only rescales the old series, so we do not use it.',
        hallmark: { office: 'MoSPI', unit: '% y/y', period: 'OCT 2026', status: ['Provisional', 'Method break'] },
        source:
          'Source: MoSPI, Consumer Price Index (2012=100) to December 2025 and (2024=100) from January 2026, October 2026 release, 12 Nov 2026. Checked 18 Nov 2026.',
      },
      {
        chart: 'urban-unemployment-quarterly',
        title: 'Urban unemployment, Jan-Mar 2022 to Jul-Sep 2026',
        subtitle: '% of the urban labour force aged 15+, current weekly status, by quarter',
        finding:
          'PLFS changed its sample design in January 2025, with no estimate for January to March 2025. Urban unemployment: 6.4% in October to December 2024 (old design), 6.8% in April to June 2025 (new design).',
        note: 'Note: MoSPI says to take the new design into account when comparing with releases up to December 2024.',
        hallmark: { office: 'MoSPI', unit: '% 15+', period: 'Q2 2026-27', status: ['Survey estimate', 'Method break'] },
        source: 'Source: MoSPI NSO, PLFS Quarterly Bulletin, July to September 2026, 10 Nov 2026. Checked 18 Nov 2026.',
      },
    ],
    revisions: {
      heading: 'When a publisher revises a figure',
      body: 'A revised figure shows the earlier value and the date of the change. We keep every earlier version.',
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
        body: "Every projection is a publisher's. We mark it Projection and name the report.",
      },
      {
        heading: 'No invented values',
        body: 'Where a publisher gives no figure, we show "No data" and say why. Example: CPI has no rate for April and May 2020.',
      },
      {
        heading: 'No interpolation',
        body: 'No line crosses a gap, and no line joins two methods. PLFS has no estimate for January to March 2025, so chart 3.2 shows a gap.',
      },
      {
        heading: 'No figure without a dated release',
        body: 'A live ticker is not a release. For the rupee we use the FBIL reference rate, which carries its date.',
      },
    ],
  },
  part5: {
    eyebrow: 'Part 5 · Corrections',
    heading: 'What if we get something wrong?',
    lede: 'Report a problem from any chart page. Publisher revisions go on the Releases page.',
    heads: ['When', 'What we do'],
    targets: [
      { cells: ['A report arrives', "We check it against the publisher's release."] },
      { cells: ['The figure is wrong', 'We fix it, put a dated note on the chart for 12 months, and log it on the Corrections page.'] },
      { cells: ['The figure is right', 'If you left an email, we reply with the source.'] },
      { cells: ["The publisher's own data has an error", 'We tell the publisher and record it on the chart page.'] },
    ],
    actions: { report: 'Report a problem', log: 'See the corrections log' },
  },
}

export default howWeCheck
