import type { Source } from '~/content/types'
import { formatDate, parsePeriod } from './period'
import { SITE } from './site'

/** "12 Nov 2026", "May 2026" when the publisher gives only a month, or "release date not stated". */
export function releasedText(s: Source): string {
  if (s.released === 'not stated') return 'release date not stated'
  return /^\d{4}-\d{2}$/.test(s.released) ? parsePeriod(s.released, 'month').label : formatDate(s.released)
}

/** "Source: MoSPI, CPI release for October 2026, 12 Nov 2026. Checked 18 Nov 2026." */
export function sourceLine(sources: readonly Source[], full = true): string {
  // In a chart frame, a long list of releases shortens to the latest; the chart page lists them all.
  if (!full && sources.length > 2) {
    const [first] = sources
    return `Sources: ${first!.publisher}, ${first!.release}, ${releasedText(first!)}, and ${sources.length - 1} more, listed on the chart page. Checked ${formatDate(SITE.checked)}.`
  }
  const list = sources.map((s) => `${s.publisher}, ${s.release}, ${releasedText(s)}`).join('; ')
  return `Source${sources.length > 1 ? 's' : ''}: ${list}. Checked ${formatDate(SITE.checked)}.`
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
