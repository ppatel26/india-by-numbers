/** Every chart reads real rows, and the content follows the site rules. */
import { describe, expect, it } from 'vitest'
import { charts, placed, topics } from '~/content'
import home from '~/content/pages/home'
import tiles from '~/content/pages/tiles'
import { figureValue } from '~/lib/figures'
import { TOPICS } from '~/content/types'
import { renderPlot, viewsOf } from '~/lib/charts'
import { byState, seriesOf, statesOf, type Of } from '~/lib/charts/model'
import { tableOf } from '~/lib/charts/table'
import { GRID, places } from '~/lib/geography'
import { rows } from '~/lib/data'
import { formatDate } from '~/lib/period'
import { upcoming } from '~/lib/releases'
import { SITE } from '~/lib/site'
import { picksOf } from '~/lib/metadata'
import { isGated, GATED } from '~/content/gated'
import releases from '~/content/pages/releases'
import sourcesPage from '~/content/pages/sources'
import { publisherOf } from '~/lib/sources'

describe('topics', () => {
  it('has all sixteen, in order', () => {
    expect(topics.map((t) => t.slug)).toEqual([...TOPICS])
  })
})

// One check over all charts; a failure names the chart.
describe('every chart', () => {
  it('reads values from its CSV', () => {
    for (const { chart } of charts) {
      const s = byState(chart)
      const values = s ? statesOf(s).values.flatMap((v) => (v.pt?.y != null ? [v.pt.y] : [])) : seriesOf(chart).flatMap((x) => x.points.flatMap((p) => (p.y === null ? [] : [p.y])))
      if (chart.kind !== 'table') expect(values.length, chart.slug).toBeGreaterThan(0)
      expect(tableOf(chart).rows.length, chart.slug).toBeGreaterThan(0)
    }
  })
  it('renders every view', () => {
    for (const { chart } of charts) for (const v of viewsOf(chart)) if (v !== 'table') expect(renderPlot(chart, v, 'wide').html, `${chart.slug} ${v}`).toMatch(/^<svg/)
  })
  it('lists only gated files that exist', () => {
    for (const g of GATED) expect(rows(g.file).length, g.file).toBeGreaterThan(0)
  })
  it('reads no file that the site may not show yet', () => {
    for (const { chart } of charts) for (const k of picksOf(chart)) expect(isGated(k.file), `${chart.slug} reads ${k.file}`).toBe(false)
  })
  it('has a check date that is a real day, not before the site check or its own sources', () => {
    for (const { chart } of charts) {
      if (chart.checked === undefined) continue
      expect(chart.checked, chart.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(Number.isNaN(Date.parse(chart.checked)), chart.slug).toBe(false)
      expect(chart.checked >= SITE.checked, `${chart.slug}: ${chart.checked} is before ${SITE.checked}`).toBe(true)
      for (const s of chart.sources) if (/^\d{4}-\d{2}-\d{2}$/.test(s.released)) expect(chart.checked >= s.released, `${chart.slug}: checked before ${s.release}`).toBe(true)
    }
  })
  it('names its sources with a release date and link, and uses four-digit years', () => {
    for (const { chart } of charts) {
      expect(chart.sources.length, chart.slug).toBeGreaterThan(0)
      for (const s of chart.sources) {
        expect(s.released, chart.slug).toMatch(/^(\d{4}(-\d{2}(-\d{2})?)?|not stated)$/)
        expect(s.url, chart.slug).toMatch(/^https?:\/\//)
      }
      expect(chart.punches.period, chart.slug).not.toMatch(/\b'\d{2}\b/)
    }
  })
})

describe('copy', () => {
  const text = JSON.stringify(topics)
  it('has no em dashes', () => expect(text).not.toContain('—'))
  it('avoids stock phrases', () => {
    for (const phrase of ['dive into', 'deep dive', 'unlock', 'insights', 'at a glance', 'comprehensive', "it's worth noting", 'tapestry', 'delve', 'robust', 'seamless', 'leverage', 'empower', 'key takeaways', 'shed light'])
      expect(text.toLowerCase(), phrase).not.toContain(phrase)
  })
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

describe('headline figures read a value from data', () => {
  const figures = [
    ...topics.flatMap((t) => t.figures.map((f) => [`${t.slug} hero: ${f.label}`, f] as const)),
    ...Object.entries(tiles).map(([slug, t]) => [`${slug} tile`, t.figure] as const),
    ...home.newest.rows.map((r) => [`home: ${r.measure}`, { chart: r.chart, series: r.series, x: r.x, label: r.measure }] as const),
  ]
  it('every hero, tile and home figure', () => {
    for (const [name, f] of figures) {
      const { text } = figureValue(f).value
      expect(text, name).toMatch(/\d/)
      // A count of a crore or more reads in million or billion, never as eight or more raw digits.
      expect(text.replace(/[^\d.]/g, '').split('.')[0]!.length, name).toBeLessThan(8)
    }
  })
})

describe('chart features', () => {
  it('gives each assembly its own panel and majority line', () => {
    const chart = placed('assembly-elections-2025-2026').chart as Of<'bars'>
    const svg = renderPlot(chart, 'chart', 'wide').html
    expect(svg.match(/MAJORITY \d+/g)?.length).toBe(chart.panels?.length)
  })
  it('shows a confidence interval in the table as published', () => {
    const chart = placed('maternal-mortality-by-state').chart as Of<'states'>
    const [lo, hi] = statesOf(chart).india!.interval!
    expect(tableOf(chart).rows.find((r) => r.key === 'india')?.cells[1]?.shown.text).toBe(`${lo} to ${hi}`)
  })
})
