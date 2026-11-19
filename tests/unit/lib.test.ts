/** The small libraries every page leans on: number formats, periods and search. */
import { describe, expect, it } from 'vitest'
import { fmt, formatNumber, ordinal } from '~/lib/format'
import { formatDate, longPeriod, parsePeriod, yyMmOf } from '~/lib/period'
import { match, normalise, SYNONYMS, type Entry } from '~/lib/search'

describe('formatNumber', () => {
  it('keeps the publisher digits', () => {
    expect(fmt(6.09, { unit: '%' }, '6.09')).toBe('6.09%')
    expect(fmt(5.5, { unit: '%' }, '5.50')).toBe('5.50%')
  })
  it('groups digits the Indian way, with an international alternative', () => {
    expect(formatNumber(61619, { unit: '₹', decimals: 0 })).toEqual({ text: '₹61,619' })
    expect(formatNumber(361619, { unit: '₹', scale: 'none', decimals: 0 })).toEqual({ text: '₹3,61,619', alt: '₹361,619' })
  })
  it('reads a lakh or more in lakh or crore unless told not to', () => {
    expect(formatNumber(157141, { unit: '₹', decimals: 0 })).toEqual({ text: '₹1.57 lakh', alt: '₹157,141' })
    expect(formatNumber(600000, { unit: '₹' }).text).toBe('₹6 lakh')
    expect(formatNumber(231438, {}).text).toBe('2.31 lakh')
    expect(fmt(999)).toBe('999')
  })
  it('writes crore and lakh, with billion and million in the other mode', () => {
    expect(formatNumber(1426000000, { scale: 'crore' })).toEqual({ text: '142.6 crore', alt: '1.43 billion' })
    expect(formatNumber(2500000, { scale: 'lakh' })).toEqual({ text: '25.0 lakh', alt: '2.50 million' })
    expect(formatNumber(1426000, { scale: 'crore', multiply: 1000 }).text).toBe('142.6 crore')
    expect(formatNumber(247219766, { scale: 'crore', decimals: 2 })).toEqual({ text: '24.72 crore', alt: '247.22 million' })
  })
  it('signs and units', () => {
    expect(fmt(0.65, { unit: '°C', signed: true }, '0.65')).toBe('+0.65°C')
    expect(fmt(-12.6, { unit: '%' }, '-12.6')).toBe('-12.6%')
    expect(fmt(1.2, { unit: 'pp', decimals: 2 })).toBe('1.20 pp')
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
