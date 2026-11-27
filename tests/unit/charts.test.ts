/** Layout maths of the newer chart kinds: treemap tiles, Sankey flows, and every view at each width. */
import { describe, expect, it } from 'vitest'
import { charts } from '~/content'
import { renderPlot, viewsOf } from '~/lib/charts'
import { depths, imbalances, layoutFlows } from '~/lib/charts/flows'
import { squarify, type Rect } from '~/lib/charts/treemap'

const area = (r: Rect) => r.w * r.h
const overlap = (a: Rect, b: Rect) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y))

describe('squarify', () => {
  const rect = { x: 10, y: 20, w: 600, h: 400 }
  const items = [6, 6, 4, 3, 2, 2, 1].map((value, i) => ({ key: `k${i}`, value }))
  const tiles = squarify(items, rect)

  it('gives each item an area in proportion to its value', () => {
    const total = items.reduce((a, i) => a + i.value, 0)
    for (const t of tiles) expect(area(t)).toBeCloseTo((t.value / total) * area(rect), 6)
  })
  it('fills the rectangle and stays inside it', () => {
    expect(tiles.reduce((a, t) => a + area(t), 0)).toBeCloseTo(area(rect), 6)
    for (const t of tiles) {
      expect(t.x).toBeGreaterThanOrEqual(rect.x - 1e-9)
      expect(t.y).toBeGreaterThanOrEqual(rect.y - 1e-9)
      expect(t.x + t.w).toBeLessThanOrEqual(rect.x + rect.w + 1e-9)
      expect(t.y + t.h).toBeLessThanOrEqual(rect.y + rect.h + 1e-9)
    }
  })
  it('never overlaps two tiles', () => {
    for (let i = 0; i < tiles.length; i++) for (let j = i + 1; j < tiles.length; j++) expect(overlap(tiles[i]!, tiles[j]!)).toBeLessThan(1e-6)
  })
  it('keeps tiles near square', () => {
    for (const t of tiles) expect(Math.max(t.w / t.h, t.h / t.w)).toBeLessThan(3)
  })
  it('gives no tile to a part of 0', () => {
    expect(squarify([{ value: 5 }, { value: 0 }], rect)).toHaveLength(1)
    expect(squarify([], rect)).toEqual([])
  })
})

describe('Sankey flows', () => {
  const flows = [
    { from: 'tax', to: 'pool', value: 60 },
    { from: 'borrowing', to: 'pool', value: 40 },
    { from: 'pool', to: 'interest', value: 25 },
    { from: 'pool', to: 'other', value: 75 },
  ]
  it('reconcile when every middle node balances', () => {
    expect(imbalances(flows)).toEqual([])
  })
  it('name a node that does not balance', () => {
    expect(imbalances([...flows.slice(0, 3), { from: 'pool', to: 'other', value: 74 }])).toEqual([{ node: 'pool', in: 100, out: 99 }])
    expect(imbalances([...flows.slice(0, 3), { from: 'pool', to: 'other', value: 74 }], 1)).toEqual([])
  })
  it('put starts in the first column and ends in the last', () => {
    const d = depths(flows)
    expect([d.get('tax'), d.get('pool'), d.get('interest')]).toEqual([0, 1, 2])
  })
  it('fail on a loop', () => {
    expect(() => depths([...flows, { from: 'other', to: 'tax', value: 1 }])).toThrow(/loop/)
  })
  it('lay out bands that add up to their nodes', () => {
    const { nodes, links } = layoutFlows(flows, 300, 10)
    for (const n of nodes) {
      const out = links.filter((l) => l.from === n.key).reduce((a, l) => a + l.width, 0)
      const into = links.filter((l) => l.to === n.key).reduce((a, l) => a + l.width, 0)
      expect(Math.max(out, into)).toBeCloseTo(n.y1 - n.y0, 6)
    }
    // The fullest column fills the height.
    const col = (c: number) => nodes.filter((n) => n.col === c)
    expect(col(0).at(-1)!.y1 - col(0)[0]!.y0).toBeCloseTo(300, 6)
  })
})

describe('the newer chart kinds', () => {
  const kinds = new Set(['scatter', 'slope', 'treemap', 'sankey'])
  it('render at every width', () => {
    for (const { chart } of charts)
      if (kinds.has(chart.kind))
        for (const v of viewsOf(chart)) if (v !== 'table') for (const w of ['wide', 'half', 'narrow'] as const) expect(renderPlot(chart, v, w).html, `${chart.slug} ${w}`).toMatch(/^<svg/)
  })
  it('draw no fitted line on a scatter, and mark India with lines, not a dot', () => {
    for (const { chart } of charts) {
      if (chart.kind !== 'scatter') continue
      const html = renderPlot(chart, 'chart', 'wide').html
      expect(html, chart.slug).not.toContain('data-geo="india"')
      expect(html, chart.slug).toContain('class="india"')
    }
  })
})
