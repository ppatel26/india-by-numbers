import type { TopicSlug } from '~/content/types'

/** Alt text for the topic objects. Each is an AI recast, not a photo of a real object. */
export const EMBLEM_ALT: Record<TopicSlug | 'home' | 'methods', string> = {
  home: 'A silver stamp seal with a zebu bull and a ritual stand, after the Indus seals',
  methods: 'A red sandstone relief of a merchant and a scribe weighing goods',
  prices: 'A silver punch-marked coin (karshapana) with a sun, a wheel, an elephant and a tree',
  population: 'A silver octagonal medal showing a procession of people',
  economy: 'A silver medal with a wheat sheaf, a gear and a river',
  jobs: 'A silver charkha, the spinning wheel',
  health: 'A silver medal with a vaccine vial and a stethoscope',
  education: 'A silver medal with a palm-leaf book and a slate',
  elections: 'A silver hand with the inked index finger of a voter',
  climate: 'A silver model of the Samrat Yantra sundial at Jantar Mantar',
  'religion-and-culture': 'A silver Nataraja in the Chola style',
}
