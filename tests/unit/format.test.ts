import { describe, expect, it } from 'vitest'
import { fmt, formatNumber, ordinal } from '~/lib/format'

describe('formatNumber', () => {
  it('keeps the publisher digits', () => {
    expect(fmt(6.09, { unit: '%' }, '6.09')).toBe('6.09%')
    expect(fmt(5.5, { unit: '%' }, '5.50')).toBe('5.50%')
  })
  it('groups digits the Indian way, with an international alternative', () => {
    expect(formatNumber(361619, { unit: '₹', decimals: 0 })).toEqual({ text: '₹3,61,619', alt: '₹361,619' })
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
})

describe('ordinal', () => {
  it.each([
    [1, '1st'],
    [2, '2nd'],
    [3, '3rd'],
    [4, '4th'],
    [11, '11th'],
    [12, '12th'],
    [13, '13th'],
    [21, '21st'],
    [22, '22nd'],
    [36, '36th'],
  ])('%i', (n, s) => expect(ordinal(n)).toBe(s))
})
