/** Topic tiles on the home page: two questions and one figure per topic. */
import type { Figure, TopicSlug } from '../types'

export interface Tile {
  questions: readonly [string, string]
  figure: Figure
}

const tiles: Readonly<Record<TopicSlug, Tile>> = {
  population: {
    questions: ['How many people live in India?', 'How many children do women have?'],
    figure: { chart: 'population-projection', series: 'projection', x: '2026', label: 'People, 1 Mar 2026' },
  },
  prices: {
    questions: ['How fast are prices rising?', 'Which states have the highest inflation?'],
    figure: { chart: 'cpi-inflation-by-state', label: 'Consumer price inflation' },
  },
  economy: {
    questions: ['How fast is the economy growing?', 'Which states earn most per person?'],
    figure: { chart: 'income-per-person-by-state', label: 'Income per person' },
  },
  trade: {
    questions: ['Does India spend more abroad than it earns?', 'How large are the foreign exchange reserves?'],
    figure: { chart: 'forex-reserves', series: 'total', label: 'Foreign exchange reserves, end of March 2026' },
  },
  jobs: {
    questions: ['How many people are out of work?', 'How many women work or look for work?'],
    figure: { chart: 'unemployment-rate-monthly', series: 'lfpr-women', label: 'Women in the labour force, ages 15+' },
  },
  'living-standards': {
    questions: ['How much do households spend on each person?', 'How many homes cook with clean fuel?'],
    figure: { chart: 'household-spending-by-state', series: 'rural', x: 'india', label: 'Rural spending per person, a month' },
  },
  agriculture: {
    questions: ['How much does a farm household earn?', 'How many farm households are in debt?'],
    figure: { chart: 'farm-income-by-state', label: 'Income of an agricultural household, a month' },
  },
  health: {
    questions: ['How many babies die before their first birthday?', 'How long do people in India live?'],
    figure: { chart: 'infant-mortality', series: 'total', label: 'Infant deaths per 1,000 live births' },
  },
  education: {
    questions: ['How many children are in school?', 'How many young adults go to college?'],
    figure: { chart: 'school-enrolment-trend', series: 'enrol-total-new', label: 'Students, pre-primary to class 12' },
  },
  elections: {
    questions: ['What share of electors vote?', 'How many women stand, and how many win?'],
    figure: { chart: 'lok-sabha-turnout-by-sex', series: 'total', x: '2024', label: 'Turnout, Lok Sabha 2024' },
  },
  'crime-and-justice': {
    questions: ['How much crime do the police record?', 'How full are the prisons?'],
    figure: { chart: 'undertrials-by-state', label: 'Prisoners who are undertrials' },
  },
  transport: {
    questions: ['How many people die on the roads?', 'How do people get to work and school?'],
    figure: { chart: 'road-deaths-india', series: 'deaths', label: 'Road deaths recorded by the police, 2024', format: { scale: 'none', decimals: 0 } },
  },
  climate: {
    questions: ['How much rain did the 2026 monsoon bring?', 'How fast is power moving away from coal?'],
    figure: { chart: 'non-fossil-capacity-share', series: 'non-fossil', label: 'Power capacity not from fossil fuels' },
  },
  'religion-and-culture': {
    questions: ['What religions do people in India report?', 'Which languages do people speak at home?'],
    figure: { chart: 'mother-tongues', series: 'share', x: 'Hindi', label: 'Gave a mother tongue grouped under Hindi' },
  },
}

export default tiles
