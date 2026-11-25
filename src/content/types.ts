/**
 * The content model. Topic modules in src/content/topics/ are plain data in
 * these shapes. Every number a reader sees comes from a CSV in research/data,
 * picked by a `Pick`; prose may quote numbers, and tests/unit/prose.test.ts
 * checks each one against the chart data.
 */

export const TOPICS = [
  'population',
  'prices',
  'economy',
  'jobs',
  'living-standards',
  'health',
  'education',
  'elections',
  'crime-and-justice',
  'climate',
  'religion-and-culture',
] as const
export type TopicSlug = (typeof TOPICS)[number]

export type Status = 'Provisional' | 'Projection' | 'Survey estimate' | 'Method break'

/** Chart colours. `ink` is India, `s1` the selected state. See src/styles/tokens.css. */
export type Color = 'ink' | 'slate' | 'other' | 's1' | 's2' | 's3' | 's4' | 's5' | 's6' | 's7' | 's8'

export interface Source {
  publisher: string
  release: string
  /** Publisher release date: YYYY-MM-DD; YYYY-MM or YYYY when the publisher gives no day; or 'not stated'. */
  released: string
  url: string
}

/** Select rows from one CSV in research/data. */
export interface Pick {
  /** Path under research/data, for example 'prices/cpi-inflation-monthly.csv'. */
  file: string
  /** Keep rows where each column equals the value, or one of the values. */
  where?: Record<string, string | readonly string[]>
  /** Column that holds the x value. Default 'period'; 'geography' for by-state charts. */
  x?: string
  /** Column that holds the number. Default 'value'. */
  y?: string
  /** Multiply each value, to put two files on one axis (projections in thousands beside counts in persons). The CSV keeps the published value and unit. */
  multiply?: number
  /** Column with the label to show for each x, when x is not the label (for example x 'mid_year', label 'period'). */
  xLabel?: string
  /** Column with a note for each value, shown in tooltips and tables (for example an estimate basis). */
  note?: string
  /** Columns with the lower and upper bounds of a confidence interval, drawn as whiskers. */
  interval?: readonly [string, string]
}

export interface Series extends Pick {
  key: string
  label: string
  color: Color
  /** Dashed line: projections. */
  dash?: boolean
  /** Read for figures and the table, but not drawn. */
  hidden?: boolean
  /** This series' number format, when it differs from the chart's (for example mm beside %). */
  format?: Format
}

export interface Format {
  /** Digits after the point. Default: as many as the data has, up to 2. */
  decimals?: number
  /** '%' prints 6.09%, '₹' prints ₹93.57, 'pp' prints 1.20 pp, '°C' prints 0.65°C. */
  unit?: '%' | '₹' | 'pp' | '°C' | ''
  /** Print a plus sign on positive values: +0.65°C. */
  signed?: boolean
  /** Multiply the published value first, for example 1000 for "thousand persons". */
  multiply?: number
  /** Words after the number, for example ' mm' or ' years'. */
  suffix?: string
  /** 'crore' and 'lakh' print 142.6 crore (and 1.43 billion in million mode). */
  scale?: 'crore' | 'lakh' | 'none'
}

export interface Axis {
  min?: number
  max?: number
  /** Distance between gridlines. */
  step?: number
}

export interface Breakpoint {
  /** The x value where the new method starts. */
  x: string
  label: string
  /** Label for the side before the break, for example 'NSS 2014 survey'. */
  before?: string
}

/** One small multiple: a group of series keys, with its own label, and optionally its own scale. */
export interface Panel {
  label: string
  series: readonly string[]
  /** This panel gets its own value scale (and its first series' units). */
  own?: boolean
  /** Reference lines for this panel only, for example an assembly's majority. */
  refs?: readonly ValueRef[]
  /** A short line beside the label, for example "Turnout 85.38%". */
  note?: string
}

/** A reference line at a value on the value axis. */
export interface ValueRef {
  value: number
  label: string
}

/** A labelled point: value and period by default, or your own text. */
export interface Callout {
  series: string
  x: string
  label?: string
}

/** Notes drawn on a time axis. */
interface TimeNotes {
  breaks?: readonly Breakpoint[]
  /** Plain vertical markers, for example 'Today' or a survey change that is not a method break. */
  markers?: readonly Breakpoint[]
  /** Shaded x ranges, for example years that exclude a state. */
  spans?: readonly { from: string; to: string; label: string }[]
  callouts?: readonly Callout[]
}

interface ChartBase {
  slug: string
  title: string
  subtitle: string
  /** Hallmark punches: office, unit, period. */
  punches: { office: string; unit: string; period: string }
  status?: readonly Status[]
  note?: string
  sources: readonly Source[]
  format?: Format
  /** Chart page: "What you should know about this data". */
  know?: readonly string[]
  /** Chart page: "How we process this figure", in order. */
  processing?: readonly string[]
  /** YYYY-MM-DD: the day we last checked this chart against its publisher. Default: SITE.checked. */
  checked?: string
  /** YYYY-MM-DD from the publisher's calendar, 'YYYY-MM-DD (estimated)' when we infer it from past releases, or 'not announced'. */
  nextRelease?: string
}

export type Chart =
  | (ChartBase &
      TimeNotes & {
        kind: 'line'
        series: readonly Series[]
        y?: Axis
        /** Shaded range, for example the RBI tolerance band; `since` is the x where it starts. */
        band?: { from: number; to: number; label: string; since?: string }
        /** Reference lines, with an optional start period for each line. */
        refs?: readonly { y: number; label: string; since?: string }[]
        /** Small multiples: one panel per group of series keys. */
        panels?: readonly Panel[]
        /** Draw steps: a value holds until the next one (policy rates). */
        step?: boolean
        /** Join every value, however far apart: survey rounds come at uneven intervals, with no round missing. */
        joined?: boolean
        /** Hold the last value flat to this date (YYYY-MM-DD), for step lines. */
        extendTo?: string
      })
  | (ChartBase &
      TimeNotes & {
      kind: 'columns'
      series: readonly Series[]
      y?: Axis
      /** Small multiples, two to a row on wide screens. */
      panels?: readonly Panel[]
      stacked?: boolean
      /** Colour each column by its sign, for example rainfall above or below normal. */
      sign?: { above: Color; below: Color; aboveLabel: string; belowLabel: string }
      /** Columns for the whole period (the year, the season), by x: drawn in ink and set apart by a dashed rule. */
      whole?: readonly string[]
    })
  | (ChartBase &
      TimeNotes & {
        kind: 'area'
        series: readonly Series[]
        y?: Axis
      })
  | (ChartBase & {
      /** One value per state and UT: ranked bars, tile map and table in one frame. */
      kind: 'states'
      data: Pick
      /** The view that opens first. */
      open?: 'map' | 'chart'
      /** Map colours: 'seq' for size, 'div' for the gap from India. */
      scale?: 'seq' | 'div'
      /** Which end is better, for ranks on state pages. Omit when neither is. */
      better?: 'high' | 'low'
      /** Short label used on state pages, for example 'Inflation'. */
      short: string
      /** Fixed map bin edges, low to high, when the board sets them. */
      bins?: readonly number[]
      /** On the chart's own page, a slider steps the map through these values of a column (months, years). */
      timeline?: { column: string; values: readonly string[] }
      /** India's value is a total of the states (capacity, seats): no gap from India, no India line. */
      total?: boolean
      /** Why a state has no value, shown in its tooltip and the table: { manipur: 'Not surveyed in NFHS-6' }. */
      missing?: Readonly<Record<string, string>>
    })
  | (ChartBase & {
      /** Several values per row, as dots on one line: two periods, or women and men. */
      kind: 'dots'
      series: readonly Series[]
      /** Column that names the rows. Default 'geography'. */
      by?: string
      /** Hollow ring for these series keys (earlier periods). */
      hollow?: readonly string[]
      /** Sort rows by this series, drawn or hidden. Default: the first drawn. */
      sortBy?: string
      /** Rows that go first, whatever their value: usually ['india']. */
      pin?: readonly string[]
      /** Value axis range, when 0 would squash the dots (fertility from 1.0). */
      axis?: Axis
      /** Add a Map tab that colours this series (rows must be states). */
      map?: { series: string; scale?: 'seq' | 'div'; better?: 'high' | 'low' }
      /** Vertical reference lines, for example the replacement level of 2.1. */
      refs?: readonly ValueRef[]
      /** Why a row has no value, shown in the map tooltip: { manipur: 'Not surveyed in NFHS-6' }. */
      missing?: Readonly<Record<string, string>>
    })
  | (ChartBase & {
      /** Horizontal bars by category. Several series are grouped, or stacked to 100. */
      kind: 'bars'
      series: readonly Series[]
      /** Column that names the categories. */
      by: string
      stacked?: boolean
      /** Category order and display labels. Default: by value, high to low. */
      order?: readonly string[]
      labels?: Readonly<Record<string, string>>
      /** Heading of the category column in the table view. Default: "Category". */
      rowHead?: string
      /** Highlight one category with series-1, for example India's latest value. */
      highlight?: string
      /** A fixed colour per category, for example each religion's slot. */
      colors?: Readonly<Record<string, Color>>
      /** Text where a category has no value: { 'anaemia-women-15-49': 'Not in NFHS-6' }. */
      missing?: Readonly<Record<string, string>>
      /** Vertical reference lines, for example "All items 6.09%". */
      refs?: readonly ValueRef[]
      /** Value axis range; panels on a shared scale set it. */
      axis?: Axis
      /** Small multiples, two to a row on wide screens. */
      panels?: readonly Panel[]
    })
  | (ChartBase & {
      kind: 'pyramid'
      left: Series
      right: Series
      /** Column that holds the age group. */
      by: string
      /** Share axis maximum, in percent: one value for every period, so the tabs compare. */
      max?: number
    })
  | (ChartBase & {
      kind: 'table'
      data: Pick
      /** Column that names the rows. */
      by: string
      /** Heading of the row-name column. Default: "State or UT" for geography, else the column name. */
      rowHead?: string
      /** `text` shows a text cell in short form: { 'Vote share published in ECI Report 20': 'ECI' }. */
      columns: readonly { key: string; label: string; where?: Pick['where']; y?: string; format?: Format; text?: Readonly<Record<string, string>> }[]
      /** Colour numeric cells in bins, low to high edges (a heat table), with a legend. */
      bins?: readonly number[]
    })

export type ChartKind = Chart['kind']

/** A headline figure. The value is read from the chart's data. */
export interface Figure {
  chart: string
  /** Series key. Default: the first series, or India for 'states' charts. */
  series?: string
  /** x value. Default: the latest. */
  x?: string
  label: string
  /** Replaces the period punch, for example 'From 7 Oct 2026'. */
  period?: string
  /** Replaces the chart's format, for a figure read from a hidden series in another unit. */
  format?: Format
}

/** One chart at each of several time scales (2026 day by day, since 1998 month by month): one card with a period switch. */
export interface Period {
  /** The switch label: "2026, daily". */
  label: string
  /** On phones: "Daily". */
  short: string
  chart: Chart
}

export type Block = { text: string } | { chart: Chart } | { periods: readonly Period[] }

export interface Part {
  title: string
  lede: string
  blocks: readonly Block[]
}

export interface AboutTheData {
  /** One paragraph above the six rows. */
  intro?: string
  publisher: string
  frequency: string
  revisions: string
  breaks: string
  coverage: string
  missing: string
}

export interface Topic {
  slug: TopicSlug
  name: string
  hindi: string
  /** One plain question for the home and topics lists. */
  question: string
  standfirst: string
  figures: readonly [Figure, Figure, Figure]
  /** Meta strip, for example 'CPI for November 2026, expected 14 Dec 2026'. */
  nextRelease: string
  parts: readonly Part[]
  about: AboutTheData
  sources: readonly Source[]
  related: readonly { label: string; href: string }[]
  /** Short notes in the rail, under "Comparing", for example the Census 2027 note. */
  /** Short notes in the rail: a date or a word, then what happens. */
  rail?: readonly { title: string; rows: readonly (readonly [string, string])[]; source?: string }[]
}
