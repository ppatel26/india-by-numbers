import type { Source } from '~/content/types'
import { formatDate, parsePeriod } from './period'
import { SITE } from './site'

/** "12 Nov 2026", "May 2026" when the publisher gives only a month, or "release date not stated". */
export function releasedText(s: Source): string {
  if (s.released === 'not stated') return 'release date not stated'
  return /^\d{4}-\d{2}$/.test(s.released) ? parsePeriod(s.released, 'month').label : formatDate(s.released)
}

/** "Source: MoSPI, CPI release for October 2026, 12 Nov 2026. Checked 18 Nov 2026." */
export function sourceLine(sources: readonly Source[], full = true, checked: string = SITE.checked): string {
  // In a chart frame, a long list of releases shortens to the latest; the chart page lists them all.
  if (!full && sources.length > 2) {
    const [first] = sources
    return `Sources: ${first!.publisher}, ${first!.release}, ${releasedText(first!)}, and ${sources.length - 1} more, listed on the chart page. Checked ${formatDate(checked)}.`
  }
  const list = sources.map((s) => `${s.publisher}, ${s.release}, ${releasedText(s)}`).join('; ')
  return `Source${sources.length > 1 ? 's' : ''}: ${list}. Checked ${formatDate(checked)}.`
}

/** "Sources: ORGI (1 Jun 2022) · NCP, MoHFW (Jul 2020)": one entry per publisher, with its latest release. */
export function sourceBrief(sources: readonly Source[]): string {
  const latest = new Map<string, Source>()
  for (const s of sources) {
    const name = publisherOf(s.publisher)
    const had = latest.get(name)
    if (!had || (s.released !== 'not stated' && (had.released === 'not stated' || s.released > had.released))) latest.set(name, s)
  }
  return `Source${latest.size > 1 ? 's' : ''}: ${[...latest].map(([name, s]) => (s.released === 'not stated' ? name : `${name} (${releasedText(s)})`)).join(' · ')}`
}

/** Unique sources, in first-seen order. */
export function uniqueSources(sources: Iterable<Source>): Source[] {
  const seen = new Map<string, Source>()
  for (const s of sources) {
    const key = `${s.publisher}|${s.release}|${s.released}`
    if (!seen.has(key)) seen.set(key, s)
  }
  return [...seen.values()]
}

/**
 * Source lines name publishers in several ways ("NSO, MoSPI", "ECI via PIB"). The first rule that
 * matches gives the publisher's short name. Order matters: a release that PIB carries for another
 * office counts under PIB.
 */
const PUBLISHER_RULES: readonly (readonly [RegExp, string])[] = [
  [/\bPIB\b/, 'PIB'],
  [/National Commission on Population/, 'NCP, MoHFW'],
  [/United Nations Population Division/, 'UN Population Division'],
  [/\bIIPS\b|\bMoHFW\b|NHSRC/, 'MoHFW and IIPS'],
  [/\bWHO\b/, 'WHO'],
  [/\bORGI\b/, 'ORGI'],
  [/MoSPI|\bNSO\b/, 'MoSPI'],
  [/Ministry of Education/, 'MoE'],
  [/\bRBI\b/, 'RBI'],
  [/Labour Bureau/, 'Labour Bureau'],
  [/\bIMF\b/, 'IMF'],
  [/World Bank/, 'World Bank'],
  [/\bIMD\b/, 'IMD'],
  [/\bECI\b/, 'ECI'],
  [/\bCEA\b/, 'CEA'],
  [/\bMNRE\b/, 'MNRE'],
  [/\bNCRB\b/, 'NCRB'],
  [/Ministry of Law and Justice/, 'MoLJ'],
  [/\bMoRTH\b/, 'MoRTH'],
  [/\bCGPDTM\b/, 'IP India'],
  [/Panchayati Raj/, 'MoPR'],
]

/** The short name of the publisher on a source line, as the Sources page lists it. */
export function publisherOf(publisher: string): string {
  const hit = PUBLISHER_RULES.find(([re]) => re.test(publisher))
  if (!hit) throw new Error(`No publisher rule for "${publisher}"`)
  return hit[1]
}
