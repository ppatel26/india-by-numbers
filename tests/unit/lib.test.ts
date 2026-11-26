/** The small libraries every page leans on: number formats, periods, search and the objects. */
import { existsSync, readdirSync } from 'node:fs'
import { scaleLinear } from 'd3-scale'
import { describe, expect, it } from 'vitest'
import { TOPICS } from '~/content/types'
import { yGrid } from '~/lib/charts/axes'
import { renderPlot } from '~/lib/charts'
import { placed } from '~/content'
import { EMBLEM_ALT, hasEmblem } from '~/lib/emblems'
import { both, fmt, formatNumber, ordinal } from '~/lib/format'
import { formatDate, longPeriod, parsePeriod, yyMmOf } from '~/lib/period'
import { match, normalise, SYNONYMS, type Entry } from '~/lib/search'

describe('formatNumber', () => {
  it('keeps the publisher digits', () => {
    expect(fmt(6.09, { unit: '%' }, '6.09')).toBe('6.09%')
    expect(fmt(5.5, { unit: '%' }, '5.50')).toBe('5.50%')
  })
  it('groups digits the international way, with the Indian way as the alternative', () => {
    expect(formatNumber(61619, { unit: '₹', decimals: 0 })).toEqual({ text: '₹61,619' })
    expect(formatNumber(361619, { unit: '₹', scale: 'none', decimals: 0 })).toEqual({ text: '₹361,619', alt: '₹3,61,619' })
  })
  it('reads a lakh or more in lakh or crore in the other mode unless told not to', () => {
    expect(formatNumber(157141, { unit: '₹', decimals: 0 })).toEqual({ text: '₹157,141', alt: '₹1.57 lakh' })
    expect(formatNumber(600000, { unit: '₹' }).alt).toBe('₹6 lakh')
    expect(formatNumber(231438, {}).alt).toBe('2.31 lakh')
    expect(fmt(999)).toBe('999')
  })
  it('writes billion and million, with crore and lakh in the other mode', () => {
    expect(formatNumber(1426000000, { scale: 'crore' })).toEqual({ text: '1.43 billion', alt: '142.6 crore' })
    expect(formatNumber(2500000, { scale: 'lakh' })).toEqual({ text: '2.50 million', alt: '25.0 lakh' })
    expect(formatNumber(205324, { unit: '₹', scale: 'lakh', decimals: 2 })).toEqual({ text: '₹205,324', alt: '₹2.05 lakh' })
    expect(formatNumber(1426000, { scale: 'crore', multiply: 1000 }).alt).toBe('142.6 crore')
    expect(formatNumber(247219766, { scale: 'crore', decimals: 2 })).toEqual({ text: '247.22 million', alt: '24.72 crore' })
  })
  it('builds a string in both forms, for tooltips and callouts', () => {
    expect(both(() => `People: ${fmt(1426000000, { scale: 'crore' })}`)).toEqual({ text: 'People: 1.43 billion', alt: 'People: 142.6 crore' })
    expect(both(() => `Rate: ${fmt(6.09, { unit: '%' }, '6.09')}`)).toEqual({ text: 'Rate: 6.09%' })
    // Outside both, the default form is back.
    expect(fmt(1426000000, { scale: 'crore' })).toBe('1.43 billion')
  })
  it('gives chart labels and tooltips their lakh and crore form', () => {
    const html = renderPlot(placed('population-by-census').chart, 'chart', 'wide').html
    expect(html).toContain('data-alt="121.1 crore in 2011">1.21 billion in 2011')
    expect(html).toContain('data-tip="1951\nCensus count: 361.1 million\nProjected: No data" data-tip-alt="1951\nCensus count: 36.1 crore\nProjected: No data"')
  })
  it('multiplies without floating-point noise', () => {
    // 30,00,000 crore is ₹30 lakh crore, not ₹30.00 lakh crore from 30.000000000000004.
    expect(formatNumber(3000000, { unit: '₹', multiply: 1e-5, suffix: ' lakh crore' }).text).toBe('₹30 lakh crore')
    expect(formatNumber(150000, { unit: '₹', multiply: 1e-5, suffix: ' lakh crore' }).text).toBe('₹1.5 lakh crore')
  })
  it('signs and units', () => {
    expect(fmt(0.65, { unit: '°C', signed: true }, '0.65')).toBe('+0.65°C')
    expect(fmt(-12.6, { unit: '%' }, '-12.6')).toBe('-12.6%')
    expect(fmt(1.2, { unit: 'pp', decimals: 2 })).toBe('1.20 pp')
    expect(fmt(441730.1, { unit: 'US$', multiply: 1e-3, decimals: 1, suffix: ' billion' })).toBe('US$441.7 billion')
    expect(fmt(-25365, { unit: 'US$', multiply: 1e-3, decimals: 1, suffix: ' billion' })).toBe('-US$25.4 billion')
  })
  it('writes ordinals', () => {
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 36].map(ordinal)).toEqual(['1st', '2nd', '3rd', '4th', '11th', '12th', '13th', '21st', '22nd', '36th'])
  })
})

describe('periods', () => {
  it.each([
    ['2026', 'year', '2026', 2026],
    ['2026-10', 'month', 'Oct 2026', 2026 + 9 / 12],
    ['2014-03-31', 'day', '31 Mar 2014', null],
    ['2012-13 Q1', 'fy-quarter', 'Q1 2012-13', 2012.25],
    ['2018-Q3', 'quarter', 'Jul-Sep 2018', 2018.5],
    ['2026-06-01/2026-09-30', 'range', 'Jun to Sep 2026', null],
    ['2026-06/2026-09', 'range', 'Jun to Sep 2026', null],
  ])('%s', (s, kind, label, t) => {
    const p = parsePeriod(s)
    expect(p.kind).toBe(kind)
    expect(p.label).toBe(label)
    if (t !== null) expect(p.t).toBeCloseTo(t)
  })
  it('reads a YYYY-NN column as months or spans from the whole column', () => {
    expect(yyMmOf(['2012-01', '2012-02', '2012-03'])).toBe('month')
    expect(yyMmOf(['1997-98', '1999-01', '2001-03'])).toBe('span')
    expect(yyMmOf(['2010-11', '2011-12'])).toBe('span')
    expect(parsePeriod('1999-01', 'span').label).toBe('1999-01')
    expect(parsePeriod('2011-12').kind).toBe('span')
    expect(parsePeriod('2026-10').kind).toBe('month')
  })
  it('rejects unknown formats', () => expect(() => parsePeriod('annual')).toThrow())
  it('formats labels and running text', () => {
    expect(formatDate('2026-11-12')).toBe('12 Nov 2026')
    expect(formatDate('2026-11-12', 'long')).toBe('12 November 2026')
    expect(longPeriod('2026-10')).toBe('October 2026')
    expect(longPeriod('2024-25')).toBe('2024-25')
  })
})

describe('search', () => {
  const index: Entry[] = [
    { kind: 'Chart', title: 'Inflation by state', detail: 'Prices', href: '/charts/a/', words: normalise(`Inflation by state Prices ${SYNONYMS.prices}`) },
    { kind: 'Topic', title: 'Prices', detail: 'कीमतें', href: '/prices/', words: normalise(`Prices कीमतें ${SYNONYMS.prices}`) },
    { kind: 'State', title: 'Kerala', detail: 'കേരളം', href: '/states/kerala/', words: normalise('Kerala കേരളം केरल KL') },
  ]
  it('puts topics first', () => expect(match(index, 'inflation').map((e) => e.kind)).toEqual(['Topic', 'Chart']))
  it('finds Hindi, Hinglish and a state in its own script', () => {
    expect(match(index, 'महंगाई')[0]?.href).toBe('/prices/')
    expect(match(index, 'mehngai')[0]?.href).toBe('/prices/')
    expect(match(index, 'കേരളം')[0]?.href).toBe('/states/kerala/')
  })
  it('needs every word', () => expect(match(index, 'inflation kerala')).toEqual([]))
})

describe('objects', () => {
  const named = Object.keys(EMBLEM_ALT)
  it('has both image files for every object with alt text', () => {
    for (const name of named) {
      expect(existsSync(`public/emblems/${name}.webp`), name).toBe(true)
      expect(existsSync(`src/assets/emblems/${name}.${name === 'methods' ? 'jpg' : 'png'}`), name).toBe(true)
    }
  })
  it('has alt text for every image file, so no object goes undescribed', () => {
    for (const dir of ['public/emblems', 'src/assets/emblems']) for (const f of readdirSync(dir)) expect(named, `${dir}/${f}`).toContain(f.replace(/\.\w+$/, ''))
  })
  it('lets a topic have no object yet', () => {
    for (const t of TOPICS) expect(hasEmblem(t), t).toBe(named.includes(t))
  })
})

describe('axis ticks', () => {
  const ticksOf = (grid: string) => ({
    text: [...grid.matchAll(/>([^<>]+)<\/text>/g)].map((m) => m[1]),
    alt: [...grid.matchAll(/data-alt="([^"]+)"/g)].map((m) => m[1]),
  })
  it('keep a decimal on half-lakh ticks when the lakh scale is automatic', () => {
    const grid = String(yGrid(scaleLinear().domain([0, 200000]).range([100, 0]), [0, 50000, 100000, 150000, 200000], 0, 100, {}))
    expect(ticksOf(grid)).toEqual({ text: ['0', '50,000', '100,000', '150,000', '200,000'], alt: ['0.5', '1.0', '1.5', '2.0 lakh'] })
  })
  it('use one international unit on every tick of a crore axis', () => {
    const grid = String(yGrid(scaleLinear().domain([0, 1.6e9]).range([100, 0]), [0, 4e8, 8e8, 1.2e9, 1.6e9], 0, 100, { scale: 'crore' }))
    expect(ticksOf(grid)).toEqual({ text: ['0', '0.4', '0.8', '1.2', '1.6 billion'], alt: ['40', '80', '120', '160 crore'] })
  })
})
