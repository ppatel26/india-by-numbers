import { describe, expect, it } from 'vitest'
import { formatDate, longPeriod, parsePeriod, yyMmOf } from '~/lib/period'

describe('parsePeriod', () => {
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

  it('rejects unknown formats', () => {
    expect(() => parsePeriod('annual')).toThrow()
  })
})

describe('dates', () => {
  it('formats labels and running text', () => {
    expect(formatDate('2026-11-12')).toBe('12 Nov 2026')
    expect(formatDate('2026-11-12', 'long')).toBe('12 November 2026')
    expect(longPeriod('2026-10')).toBe('October 2026')
    expect(longPeriod('2024-25')).toBe('2024-25')
  })
})
