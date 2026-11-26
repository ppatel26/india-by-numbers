import type { TopicSlug } from '~/content/types'

/** An object name: a topic, the home seal or the methods relief. */
export type EmblemName = TopicSlug | 'home' | 'methods'

/**
 * Alt text for the objects. Each is an AI recast, not a photo of a real object.
 * This is the one list of the objects that exist: each name here has `public/emblems/<name>.webp`
 * and `src/assets/emblems/<name>.png` (the methods relief is a .jpg). A topic with no entry has no
 * object yet. Its hero, medallion, home tile and social image leave the object out, and nothing
 * stands in for it (docs/design-direction.md, the Crime and justice interim rule).
 */
export const EMBLEM_ALT: Partial<Record<EmblemName, string>> & Record<'home' | 'methods', string> = {
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
  'crime-and-justice': 'A silver tarazu, the Indian beam balance, with two pans on chains',
  'living-standards': 'A silver three-tier tiffin carrier with a latch and a handle',
  trade: 'A silver model of an uru, the Indian Ocean trading ship, with a furled lateen sail',
  transport: 'A silver model of a Harappan two-wheeled cart with solid wheels',
  agriculture: 'A silver hal, the Indian ard plough, after the Banawali model',
}

/** The object's alt text, or undefined when the object is not made yet. */
export const emblemAlt = (name: EmblemName): string | undefined => EMBLEM_ALT[name]

/** True when this topic has its object. */
export const hasEmblem = (name: EmblemName): boolean => EMBLEM_ALT[name] !== undefined
