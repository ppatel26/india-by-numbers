/** The search index (built into /search.json) and the matcher the page script uses. */
export interface Entry {
  kind: 'Topic' | 'State' | 'Chart' | 'Page'
  title: string
  /** Second line: subtitle, topic name or Hindi name. */
  detail: string
  href: string
  /** Lower-case words to match: title, detail and synonyms. */
  words: string
}

/** Words people type for each topic, in English, Hindi and Hinglish. */
export const SYNONYMS: Record<string, string> = {
  prices: 'inflation cpi mehngai mehangai महंगाई महँगाई कीमतें daam prices repo rbi',
  economy: 'gdp growth income iip industry rupee dollar exchange arthvyavastha अर्थव्यवस्था',
  trade: 'trade exports imports current account deficit remittances forex reserves foreign exchange gold balance of payments bop vyapar व्यापार niryat निर्यात aayat आयात',
  population: 'census people births deaths fertility tfr janasankhya जनसंख्या abadi आबादी',
  jobs: 'unemployment employment work labour plfs naukri नौकरी rozgar रोज़गार',
  'living-standards': 'living standards spending consumption mpce hces food internet bank account water drinking cooking fuel lpg gini kharch खर्च jeevan star जीवन स्तर',
  health: 'infant mortality imr life expectancy nfhs stunting maternal swasthya स्वास्थ्य',
  education: 'school literacy college enrolment udise aishe shiksha शिक्षा padhai',
  'science-and-technology': 'science technology research r&d innovation invention inventions patent patents patent office ip india intellectual property researchers journal articles startup startups vigyan विज्ञान takneek prodyogiki प्रौद्योगिकी avishkar आविष्कार',
  elections: 'vote voting turnout lok sabha mp eci chunav चुनाव matdan मतदान',
  'crime-and-justice': 'crime justice murder police prison prisons jail undertrial undertrials court courts pendency ncrb fir ipc bns conviction chargesheet apradh अपराध nyay न्याय jail जेल',
  transport: 'transport road accidents road deaths accident crash helmet seat belt seatbelt commute travel bus train rail two-wheeler two wheeler bike scooter pedestrian morth nhts parivahan परिवहन sadak durghatna सड़क दुर्घटना yatra यात्रा',
  agriculture: 'agriculture agricultural farm farms farmer farmers farming kisan किसान krishi कृषि kheti खेती crop crops land holding holdings loan loans debt moneylender moneylenders income nss',
  climate: 'monsoon rain rainfall temperature renewable solar coal power mausam मौसम jalvayu जलवायु',
  'religion-and-culture': 'religion language mother tongue hindu muslim census dharm धर्म bhasha भाषा',
}

export function normalise(s: string): string {
  return s.toLowerCase().normalize('NFC').replace(/[^\p{L}\p{N}\p{M}\s]/gu, ' ')
}

const ORDER: Record<Entry['kind'], number> = { Topic: 0, State: 1, Chart: 2, Page: 3 }

/** Entries that contain every word of the query, topics and states first. */
export function match(index: readonly Entry[], query: string, limit = Infinity): Entry[] {
  const terms = normalise(query).split(/\s+/).filter(Boolean)
  if (terms.length === 0) return []
  return index
    .filter((e) => terms.every((t) => e.words.includes(t)))
    .map((e) => ({ e, score: ORDER[e.kind] * 10 + (normalise(e.title).startsWith(terms[0]!) ? 0 : 5) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((x) => x.e)
}
