/**
 * The 36 states and union territories, their tile on the map grid, and their
 * names. Source: research/data/geography.csv and state-languages.csv.
 * The grid is the 8 by 7 layout in docs/site-spec.md, "Map policy".
 */
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { DATA_DIR, rows } from './data'

export const INDIA = 'india'

export interface Place {
  slug: string
  name: string
  type: 'state' | 'ut'
  /** Tile label for a 64 px tile. A hyphen marks where it breaks onto two lines. */
  short: string
  /** Two-letter vehicle registration code, for small tiles. */
  code: string
  col: number
  row: number
  hindi?: string
  /** Official languages, as the state's language law names them. */
  official: readonly string[]
  /** The name in the state's own official language, when that is not English. */
  native?: { name: string; language: string; script: string; lang: string; rtl: boolean }
}

/** [slug, short label, code, column, row]. Row 1 is the north, column 1 the west. */
const TILES: readonly (readonly [string, string, string, number, number])[] = [
  ['jammu-kashmir', 'J&K', 'JK', 2, 1],
  ['ladakh', 'Ladakh', 'LA', 3, 1],
  ['punjab', 'Punjab', 'PB', 1, 2],
  ['himachal-pradesh', 'Himachal', 'HP', 2, 2],
  ['uttarakhand', 'Uttara-khand', 'UK', 3, 2],
  ['arunachal-pradesh', 'Arunachal', 'AR', 8, 2],
  ['chandigarh', 'Chandi-garh', 'CH', 1, 3],
  ['haryana', 'Haryana', 'HR', 2, 3],
  ['delhi', 'Delhi', 'DL', 3, 3],
  ['uttar-pradesh', 'UP', 'UP', 4, 3],
  ['bihar', 'Bihar', 'BR', 5, 3],
  ['sikkim', 'Sikkim', 'SK', 6, 3],
  ['assam', 'Assam', 'AS', 7, 3],
  ['nagaland', 'Nagaland', 'NL', 8, 3],
  ['rajasthan', 'Rajasthan', 'RJ', 2, 4],
  ['madhya-pradesh', 'MP', 'MP', 3, 4],
  ['chhattisgarh', 'Chhattis-garh', 'CG', 4, 4],
  ['jharkhand', 'Jharkhand', 'JH', 5, 4],
  ['west-bengal', 'W Bengal', 'WB', 6, 4],
  ['meghalaya', 'Meghalaya', 'ML', 7, 4],
  ['manipur', 'Manipur', 'MN', 8, 4],
  ['gujarat', 'Gujarat', 'GJ', 1, 5],
  ['dnh-dd', 'DNH & DD', 'DD', 2, 5],
  ['maharashtra', 'Maha-rashtra', 'MH', 3, 5],
  ['telangana', 'Telangana', 'TG', 4, 5],
  ['odisha', 'Odisha', 'OD', 5, 5],
  ['tripura', 'Tripura', 'TR', 7, 5],
  ['mizoram', 'Mizoram', 'MZ', 8, 5],
  ['goa', 'Goa', 'GA', 2, 6],
  ['karnataka', 'Karnataka', 'KA', 3, 6],
  ['andhra-pradesh', 'Andhra', 'AP', 4, 6],
  ['lakshadweep', 'Laksha-dweep', 'LD', 1, 7],
  ['kerala', 'Kerala', 'KL', 3, 7],
  ['tamil-nadu', 'Tamil Nadu', 'TN', 4, 7],
  ['puducherry', 'Puduch-erry', 'PY', 5, 7],
  ['andaman-nicobar', 'A&N', 'AN', 7, 7],
]

export const GRID = { cols: 8, rows: 7 } as const

/** BCP 47 codes, so browsers and screen readers read each name in its own language. */
const LANG_CODES: Readonly<Record<string, string>> = {
  Assamese: 'as', Bengali: 'bn', Gujarati: 'gu', Hindi: 'hi', Kannada: 'kn', Konkani: 'gom', Malayalam: 'ml',
  Manipuri: 'mni', Marathi: 'mr', Nepali: 'ne', Odia: 'or', Punjabi: 'pa', Tamil: 'ta', Telugu: 'te', Urdu: 'ur',
}

function load(): Place[] {
  const langFile = 'state-languages.csv'
  const langs = existsSync(join(DATA_DIR, langFile)) ? rows(langFile) : []
  const tiles = new Map(TILES.map((t) => [t[0], t]))
  const places = rows('geography.csv').map((g): Place => {
    const tile = tiles.get(g.slug!)
    if (!tile) throw new Error(`No tile for ${g.slug}`)
    const lang = langs.find((l) => l.slug === g.slug)
    return {
      slug: g.slug!,
      name: g.name!,
      type: g.type === 'ut' ? 'ut' : 'state',
      short: tile[1],
      code: tile[2],
      col: tile[3],
      row: tile[4],
      hindi: lang?.hindi_name || undefined,
      official: lang?.official_languages?.split(';').filter(Boolean) ?? [],
      native: lang?.native_name
        ? { name: lang.native_name, language: lang.display_language!, script: lang.script!, lang: LANG_CODES[lang.display_language!] ?? 'und', rtl: lang.script === 'Arabic' }
        : undefined,
    }
  })
  if (places.length !== 36) throw new Error(`Expected 36 places, got ${places.length}`)
  return places.sort((a, b) => a.name.localeCompare(b.name))
}

export const places: readonly Place[] = load()

const bySlug = new Map(places.map((p) => [p.slug, p]))

export function place(slug: string): Place {
  const p = bySlug.get(slug)
  if (!p) throw new Error(`Unknown state or UT: ${slug}`)
  return p
}

export const isPlace = (slug: string): boolean => bySlug.has(slug)

/** "India" or the state's name. */
export const geoName = (slug: string): string => (slug === INDIA ? 'India' : place(slug).name)
