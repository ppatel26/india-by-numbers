/** Counts that page copy states, computed from the topic modules and the geography table. */
import { charts, topics } from '../index'
import { places } from '~/lib/geography'

export const count = {
  charts: charts.length,
  topics: topics.length,
  /** States and union territories. */
  places: places.length,
  states: places.filter((p) => p.type === 'state').length,
  uts: places.filter((p) => p.type === 'ut').length,
}
