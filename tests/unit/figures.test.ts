import { describe, expect, it } from 'vitest'
import home from '~/content/pages/home'
import tiles from '~/content/pages/tiles'
import { topics } from '~/content'
import { figureValue } from '~/lib/figures'

describe('headline figures read a value from data', () => {
  const figures = [
    ...topics.flatMap((t) => t.figures.map((f) => [`${t.slug} hero: ${f.label}`, f] as const)),
    ...Object.entries(tiles).map(([slug, t]) => [`${slug} tile`, t.figure] as const),
    ...home.newest.rows.map((r) => [`home: ${r.measure}`, { chart: r.chart, series: r.series, x: r.x, label: r.measure }] as const),
  ]
  it.each(figures)('%s', (_, f) => {
    expect(figureValue(f).value.text).toMatch(/\d/)
  })
})
