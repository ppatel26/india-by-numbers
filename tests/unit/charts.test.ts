/** Chart features that need more than "it renders": panels, timelines, intervals, heat tables. */
import { describe, expect, it } from 'vitest'
import { placed } from '~/content'
import { renderPlot } from '~/lib/charts'
import { statesOf, timelineOf, type Of } from '~/lib/charts/model'
import { heat, tableOf } from '~/lib/charts/table'

describe('chart features', () => {
  it('draws one panel per assembly, each with its majority line', () => {
    const svg = renderPlot(placed('assembly-elections-2025-2026').chart, 'chart', 'wide').html
    for (const state of ['Delhi 2025, 70 seats', 'Bihar 2025, 243 seats', 'West Bengal 2026, 294 seats']) expect(svg).toContain(`>${state}<`)
    expect(svg).toContain('MAJORITY 148')
  })

  it('steps the state inflation map through each month, ending on the chart itself', () => {
    const chart = placed('cpi-inflation-by-state').chart as Of<'states'>
    const steps = timelineOf(chart)
    expect(steps.map((s) => s.label)).toEqual(['Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026'])
    expect(statesOf(steps.at(-1)!.chart).india?.raw).toBe(statesOf(chart).india?.raw)
    expect(statesOf(steps[0]!.chart).india?.raw).toBe('2.74')
  })

  it('reads confidence intervals and shows them in the table', () => {
    const chart = placed('maternal-mortality-by-state').chart as Of<'states'>
    expect(statesOf(chart).india?.interval).toEqual([78, 95])
    const t = tableOf(chart)
    expect(t.columns).toContain('95% interval')
    expect(t.rows.find((r) => r.key === 'india')?.cells[1]?.shown.text).toBe('78 to 95')
  })

  it('colours heat-table cells by bin', () => {
    expect(heat([40, 60, 80, 90, 97], 10)).toBe('seq-1')
    expect(heat([40, 60, 80, 90, 97], 99)).toBe('seq-6')
    const cells = tableOf(placed('school-facilities-by-state').chart).rows.flatMap((r) => r.cells)
    expect(cells.every((c) => c.raw === '' || c.fill)).toBe(true)
  })
})
