import type { Chart, Format, Source, Status, ValueRef } from './types'

// Charts that compare India with other countries. Data: research/data/international.
// Rule R6 (research/source-discovery.md): every country, India included, comes from one WDI
// series, one WDI update and one period. The panel is fixed: never change it to change
// India's rank.

/** The WDI update the comparison charts print: WDI's "last updated" date. */
export const WDI_UPDATED = '2026-11-11'

/** The panel, in the API's country codes. */
const PANEL = 'IND;BGD;PAK;NPL;LKA;CHN;IDN;WLD'

/** A WDI series as a source line: publisher, series name and code, update date, the API query we read. */
const wdiSource = (code: string, name: string): Source => ({
  publisher: 'World Bank',
  release: `World Development Indicators, ${name} (${code})`,
  released: WDI_UPDATED,
  url: `https://api.worldbank.org/v2/country/${PANEL}/indicator/${code}?source=2&format=json&per_page=2000`,
})

/** The WDI series the comparison charts use. */
export const WDI = {
  gdp: wdiSource('NY.GDP.PCAP.PP.KD', 'GDP per capita, PPP (constant 2021 international $)'),
  lifeExpectancy: wdiSource('SP.DYN.LE00.IN', 'Life expectancy at birth, total (years), from UN World Population Prospects 2024'),
  fertility: wdiSource('SP.DYN.TFRT.IN', 'Fertility rate, total (births per woman), from UN World Population Prospects 2024'),
  co2: wdiSource('EN.GHG.CO2.PC.CE.AR5', 'Carbon dioxide (CO2) emissions excluding LULUCF per capita, from EDGAR (JRC)'),
  womenLabourForce: wdiSource('SL.TLF.CACT.FE.ZS', 'Labor force participation rate, female (% of female population ages 15+) (modeled ILO estimate)'),
  rd: wdiSource('GB.XPD.RSDV.GD.ZS', 'Research and development expenditure (% of GDP), from the UNESCO Institute for Statistics'),
  researchers: wdiSource('SP.POP.SCIE.RD.P6', 'Researchers in R&D (per million people), from the UNESCO Institute for Statistics'),
  articles: wdiSource('IP.JRN.ARTC.SC', 'Scientific and technical journal articles, from the National Science Foundation'),
  armedForces: wdiSource('MS.MIL.TOTL.TF.ZS', 'Armed forces personnel (% of total labor force), from IISS, The Military Balance'),
} as const

/** For "About the data": the publisher sentence each topic adds. */
export const WDI_ABOUT = 'The World Bank publishes the World Development Indicators (WDI). This page uses WDI only to compare India with other countries.'

export const UN_MIGRANT_STOCK: Source = {
  publisher: 'United Nations Population Division (UN DESA)',
  release: 'International Migrant Stock 2024, origin file and destination and origin file, Table 1',
  released: '2025-02-07',
  url: 'https://www.un.org/development/desa/pd/content/international-migrant-stock',
}

interface Comparison {
  slug: string
  /** CSV file name in research/data/international. */
  file: string
  title: string
  subtitle: string
  unit: string
  /** The latest year with a value for every country, and no projection. */
  latest: string
  /** The year of the rings. Default 1990. */
  base?: string
  /** Rows to show, by WDI code, when some panel countries have no value in either year. The note must name them. */
  countries?: readonly string[]
  format: Format
  sources: readonly Source[]
  status?: readonly Status[]
  /** Vertical reference lines, for example the replacement fertility rate. */
  refs?: readonly ValueRef[]
  /** Added after the panel note. */
  note?: string
  /** YYYY-MM-DD: the day we checked this chart. Default 2026-11-25, when the first five were made. */
  checked?: string
  know: readonly string[]
  /** Steps after the shared first step. */
  processing: readonly string[]
}

/** A dots chart of the panel: rings for 1990 (or `base`), filled dots for the latest year, ranked by the latest year. */
export function comparison(c: Comparison): Chart {
  const file = `international/${c.file}`
  const base = c.base ?? '1990'
  const rows: Record<string, readonly string[]> = c.countries ? { iso3: c.countries } : {}
  return {
    kind: 'dots',
    slug: c.slug,
    checked: c.checked ?? '2026-11-25',
    title: c.title,
    subtitle: c.subtitle,
    punches: { office: 'World Bank', unit: c.unit, period: c.latest },
    ...(c.status ? { status: c.status } : {}),
    note: `Rings: ${base}. Dots: ${c.latest}. Every value comes from one WDI series, updated 11 Nov 2026.${c.note ? ` ${c.note}` : ''}`,
    sources: c.sources,
    format: c.format,
    by: 'country',
    hollow: [base],
    sortBy: 'latest',
    ...(c.refs ? { refs: c.refs } : {}),
    series: [
      { key: 'latest', label: c.latest, color: 'ink', file, where: { period: c.latest, ...rows } },
      { key: base, label: base, color: 'slate', file, where: { period: base, ...rows } },
    ],
    know: [
      'The panel is the same on every comparison chart: India, Bangladesh, Pakistan, Nepal, Sri Lanka, China and Indonesia, and the world. We do not change it.',
      ...c.know,
    ],
    processing: [
      `Take the ${c.latest} and ${base} values for ${c.countries ? `the ${c.countries.length} rows with both` : 'all eight rows'} from one World Bank WDI API response, update of 11 Nov 2026. Keep every digit WDI prints.`,
      ...c.processing,
    ],
    nextRelease: 'not announced',
  }
}
