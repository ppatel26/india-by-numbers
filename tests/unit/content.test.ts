/** Every chart reads real rows, and the content follows the site rules. */
import { describe, expect, it } from 'vitest'
import { charts, topics } from '~/content'
import { TOPICS } from '~/content/types'
import { renderPlot, viewsOf } from '~/lib/charts'
import { byState, seriesOf, statesOf } from '~/lib/charts/model'
import { tableOf } from '~/lib/charts/table'
import { GRID, places } from '~/lib/geography'
import { rows } from '~/lib/data'
import { formatDate } from '~/lib/period'
import { upcoming } from '~/lib/releases'
import { SITE } from '~/lib/site'
import releases from '~/content/pages/releases'
import sourcesPage from '~/content/pages/sources'
import { publisherOf } from '~/lib/sources'

describe('topics', () => {
  it('has all nine, in order', () => {
    expect(topics.map((t) => t.slug)).toEqual([...TOPICS])
  })
})

describe.each(charts.map((c) => [c.chart.slug, c] as const))('chart %s', (_, { chart }) => {
  it('reads values from its CSV', () => {
    const s = byState(chart)
    const values = s ? statesOf(s).values.flatMap((v) => (v.pt?.y != null ? [v.pt.y] : [])) : seriesOf(chart).flatMap((x) => x.points.flatMap((p) => (p.y === null ? [] : [p.y])))
    if (chart.kind !== 'table') expect(values.length).toBeGreaterThan(0)
    expect(tableOf(chart).rows.length).toBeGreaterThan(0)
  })

  it('renders every view', () => {
    for (const v of viewsOf(chart)) if (v !== 'table') expect(renderPlot(chart, v, 'wide').html).toMatch(/^<svg/)
  })

  it('names its source with a release date and link', () => {
    expect(chart.sources.length).toBeGreaterThan(0)
    for (const s of chart.sources) {
      expect(s.released).toMatch(/^(\d{4}(-\d{2}(-\d{2})?)?|not stated)$/)
      expect(s.url).toMatch(/^https?:\/\//)
    }
  })

  it('uses four-digit years in its period punch', () => {
    expect(chart.punches.period).not.toMatch(/\b'\d{2}\b/)
  })
})

describe('copy', () => {
  const text = JSON.stringify(topics)
  it('has no em dashes', () => expect(text).not.toContain('—'))
  it.each(['dive into', 'deep dive', 'unlock', 'insights', 'at a glance', 'comprehensive', "it's worth noting", 'tapestry', 'delve', 'robust', 'seamless', 'leverage', 'empower', 'key takeaways', 'shed light'])(
    'avoids "%s"',
    (phrase) => expect(text.toLowerCase()).not.toContain(phrase),
  )
  it('does not point at the interface', () => expect(text).not.toMatch(/the (Table|Map|Chart) tab/))
})

describe('geography', () => {
  it('has 36 places, each on its own tile, with unique codes', () => {
    expect(places).toHaveLength(36)
    expect(new Set(places.map((p) => `${p.col},${p.row}`)).size).toBe(36)
    expect(new Set(places.map((p) => p.code)).size).toBe(36)
    for (const p of places) {
      expect(p.col).toBeLessThanOrEqual(GRID.cols)
      expect(p.row).toBeLessThanOrEqual(GRID.rows)
    }
  })
})

describe('release calendar', () => {
  it('lists only announced dates after the check, soonest first', () => {
    const due = upcoming(5)
    expect(due.length).toBeGreaterThan(0)
    expect(due.every((d) => d.date > SITE.checked)).toBe(true)
    expect(due.map((d) => d.date)).toEqual([...due.map((d) => d.date)].sort())
    expect(due[0]!.name).not.toMatch(/undefined/)
  })
  it('agrees with the "Due next" table on the Releases page', () => {
    const announced = rows('release-calendar.csv').filter((r) => r.status === 'announced')
    for (const row of releases.dueNext.rows) {
      const publisher = row.release.split(' · ')[0]
      const match = announced.some((r) => r.publisher === publisher && formatDate(r.expected_date!) === row.date)
      expect(match, `${row.date} ${row.release}`).toBe(row.certainty === 'Announced')
    }
  })
})

describe('sources page', () => {
  const all = charts.flatMap((c) => c.chart.sources)
  it('names a publisher for every chart source, and lists each one', () => {
    const listed = new Set(sourcesPage.publishers.list.map((p) => p.short))
    for (const s of all) expect(listed.has(publisherOf(s.publisher)), s.publisher).toBe(true)
  })
  it('matches each data set to at least one of its publisher\'s chart sources', () => {
    for (const p of sourcesPage.publishers.list)
      for (const d of p.dataSets)
        expect(all.some((s) => publisherOf(s.publisher) === p.short && d.match.test(s.release)), `${p.short}: ${d.name}`).toBe(true)
  })
})
