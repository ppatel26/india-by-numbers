import { describe, expect, it } from 'vitest'
import { match, normalise, SYNONYMS, type Entry } from '~/lib/search'

const index: Entry[] = [
  { kind: 'Chart', title: 'Inflation by state', detail: 'Prices', href: '/charts/a/', words: normalise(`Inflation by state Prices ${SYNONYMS.prices}`) },
  { kind: 'Topic', title: 'Prices', detail: 'कीमतें', href: '/prices/', words: normalise(`Prices कीमतें ${SYNONYMS.prices}`) },
  { kind: 'State', title: 'Kerala', detail: 'കേരളം', href: '/states/kerala/', words: normalise('Kerala കേരളം केरल KL') },
]

describe('search', () => {
  it('puts topics first', () => expect(match(index, 'inflation').map((e) => e.kind)).toEqual(['Topic', 'Chart']))
  it('finds Hindi and Hinglish words', () => {
    expect(match(index, 'महंगाई')[0]?.href).toBe('/prices/')
    expect(match(index, 'mehngai')[0]?.href).toBe('/prices/')
  })
  it('finds a state by its own script', () => expect(match(index, 'കേരളം')[0]?.href).toBe('/states/kerala/'))
  it('needs every word', () => expect(match(index, 'inflation kerala')).toEqual([]))
})
