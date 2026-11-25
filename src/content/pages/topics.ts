// Copy for the Topics index.

import type { TopicSlug } from '../types'
import { count } from './counts'

export interface TopicRow {
  questions: readonly string[]
  latest: { date: string; label: string }
  next: { date: string; label: string }
}

export interface TopicsPage {
  breadcrumb: string
  title: string
  hindi: string
  /** For search engines and link previews; not shown on the page. */
  description: string
  counts: { topics: string; charts: string; states: string }
  row: {
    questionsLabel: string
    latestLabel: string
    nextLabel: string
    go: (name: string) => string
    charts: (n: number) => string
  }
  rows: Readonly<Record<TopicSlug, TopicRow>>
  comingLater: { heading: string; intro: string; topics: readonly string[] }
  allCharts: {
    heading: string
    link: string
    searchPlaceholder: string
    filters: readonly string[]
    count: (n: number) => string
  }
}

const topics: TopicsPage = {
  breadcrumb: 'Home / Topics',
  title: 'Topics',
  hindi: 'विषय',
  description: `${count.topics} topics and ${count.charts} charts of India's official statistics, with the release behind each figure.`,
  counts: { topics: 'Topics', charts: 'Charts', states: 'States and UTs' },
  row: {
    questionsLabel: 'Questions it answers',
    latestLabel: 'Latest release',
    nextLabel: 'Next expected',
    go: (name) => `Go to ${name}`,
    charts: (n) => `${n} charts`,
  },
  rows: {
    population: {
      questions: [
        'How many people live in India, and how fast has the number grown since 1901?',
        'Where do people live: which states are largest, and how urban is each state?',
        'How many people will live in India and each state in 2026 and 2036?',
        'How many children do women have, and how does this differ by state?',
        'How many girls are born for every 1,000 boys, and is the ratio rising?',
      ],
      latest: { date: '20 May 2026', label: 'SRS Statistical Report 2024, ORGI' },
      next: { date: 'Not announced', label: 'Census 2027 counting runs to 28 Feb 2027. No results date yet.' },
    },
    prices: {
      questions: [
        'How fast are prices rising, and how does that compare with the RBI target?',
        'Which states have the highest and the lowest inflation?',
        'What drives inflation: food, fuel, housing or something else?',
        'Is inflation higher in villages or in towns?',
        'How has the RBI moved its policy rate in response?',
      ],
      latest: { date: '12 Nov 2026', label: 'CPI for October 2026, MoSPI' },
      next: { date: '14 Dec 2026', label: 'CPI for November 2026. October becomes final.' },
    },
    economy: {
      questions: [
        'How fast is the economy growing, against the past 75 years?',
        'How has the economy moved from farming to services?',
        'Which states are richest and poorest per person, and which are growing fastest?',
        'How is industry doing month by month?',
        'How many rupees does a US dollar cost, and how has that changed?',
      ],
      latest: { date: '18 Nov 2026', label: 'FBIL reference rate, via RBI' },
      next: { date: '30 Nov 2026', label: 'IIP for October 2026 and GDP for Q2 FY 2026-27' },
    },
    jobs: {
      questions: [
        'How many people are out of work, and is the rate going up or down?',
        'How many women work or look for work, and how does this differ by state?',
        'Which states have the highest unemployment, and how many young people are out of work?',
        'What kind of work do Indians do: own businesses, salaried jobs or casual labour?',
        'Which industries employ the most people?',
      ],
      latest: { date: '16 Nov 2026', label: 'PLFS Monthly Bulletin, October 2026' },
      next: { date: 'Not announced', label: 'MoSPI publishes the PLFS bulletin every month.' },
    },
    health: {
      questions: [
        'How many babies die before their first birthday, and how fast has that fallen since 1971?',
        'How many women die from pregnancy and childbirth, and where is the risk highest?',
        'How long do people live, and how wide are the gaps between states and between women and men?',
        'Are children better nourished and better protected than five years ago?',
        'How much of the health bill do households pay from their own pockets?',
      ],
      latest: { date: '29 May 2026', label: 'NFHS-6 fact sheets, IIPS for MoHFW' },
      next: { date: 'Not announced', label: 'No release date published.' },
    },
    education: {
      questions: [
        'How many children are in school, and how far do they get?',
        'Which states keep children in school to class 12, and where do the most drop out?',
        'Do schools have enough teachers, electricity, toilets for girls and internet?',
        'How many young adults go on to college, and do more women go than men?',
        'How many Indians can read and write?',
      ],
      latest: { date: '8 Jul 2026', label: 'AISHE 2023-24, Ministry of Education' },
      next: { date: 'Not announced', label: 'UDISE+ and AISHE are published once a year.' },
    },
    elections: {
      questions: [
        'How many Indians can vote, and how has that changed since 1951-52?',
        'What share of electors vote, and do women now vote as often as men?',
        'Which states vote the most, and which the least?',
        'How many women stand for the Lok Sabha, and how many win?',
        'Who won the 2024 general election, and the state elections of 2025 and 2026?',
      ],
      latest: { date: '8 May 2026', label: 'ECI statistical reports, 2026 assembly elections' },
      next: { date: 'Not announced', label: 'ECI publishes reports after each election.' },
    },
    'crime-and-justice': {
      questions: [
        'How many crimes do the police record per lakh people, in India and in each state?',
        'How many murders and crimes against women do the police record?',
        'What share of cases end in a charge-sheet, and what share of trials in a conviction?',
        'How full are the prisons, and how many prisoners are undertrials?',
        'How many cases wait in the district courts and the High Courts?',
      ],
      latest: { date: '15 Sep 2026', label: 'Prison Statistics India 2024, revised, NCRB' },
      next: { date: 'Not announced', label: 'NCRB publishes Crime in India once a year. No date announced.' },
    },
    climate: {
      questions: [
        'How much rain did the 2026 monsoon bring, against 125 years of records?',
        'Which parts of India were short of rain in 2026?',
        'How much warmer is India now, and which years were the warmest?',
        'How fast is India moving its power capacity away from coal?',
        'Which states have the most solar, wind and other renewable capacity?',
      ],
      latest: { date: '12 Nov 2026', label: 'MNRE state renewable capacity, 31 Oct 2026' },
      next: { date: 'Not announced', label: 'CEA and MNRE publish capacity every month.' },
    },
    'living-standards': {
      questions: [
        'How much does a household spend on each person in a month, in villages and in towns?',
        'How has that spending grown since 1999-00, after prices?',
        'What share of spending goes on food?',
        'How many households cook with clean fuel and have an improved source of drinking water?',
        'How many people use the internet, and how many adults have a bank account?',
      ],
      latest: { date: '30 Jan 2025', label: 'HCES 2023-24 report, MoSPI' },
      next: { date: 'Not announced', label: 'No release date published.' },
    },
    'religion-and-culture': {
      questions: [
        'What religions do people in India report, and in what numbers?',
        'How does the religious makeup differ between states?',
        'How did the shares change between the 2001 and 2011 censuses?',
        'Which languages do people speak as their mother tongue?',
        'What is the main language in each state?',
      ],
      latest: { date: 'Census 2011', label: 'Latest full count. Tables C-01 and C-16.' },
      next: { date: 'Not announced', label: 'Census 2027 asks religion and mother tongue. No results date yet.' },
    },
  },
  comingLater: {
    heading: 'Coming later',
    intro: 'These topics have no pages yet.',
    topics: [
      'Public finance',
      'Energy',
      'Air quality',
      'Housing',
      'Agriculture',
      'Migration',
      'Trade',
      'Poverty and inequality',
      'Transport',
    ],
  },
  allCharts: {
    heading: 'All charts',
    link: 'Go to All charts',
    searchPlaceholder: `Search ${count.charts} charts, for example "turnout"`,
    filters: [`Topic: All ${count.topics}`, 'Chart type: All', 'Has state data', 'Status: Any'],
    count: (n) => `${n} charts`,
  },
}

export default topics
