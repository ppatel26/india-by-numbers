// Copy for the About page.

import { count } from './counts'
import { SITE } from '~/lib/site'
import sources from './sources'

export interface Section {
  /** Anchor for links from the footer. */
  id: string
  heading: string
  /** Hindi heading, when the section has one. */
  hindi?: string
  /** Paragraphs in order. `lead` paragraphs are set bold; `aside` paragraphs are set small and grey. */
  body: readonly { text: string; style?: 'lead' | 'aside' }[]
  links?: readonly string[]
}

export interface AboutPage {
  breadcrumb: string
  title: string
  hindi: string
  intro: string
  sections: readonly Section[]
}

const about: AboutPage = {
  breadcrumb: 'Project / About',
  title: 'About India by Numbers',
  hindi: 'परिचय',
  intro: 'Charts of India\'s official statistics. Free, non-partisan, and not a government website.',
  sections: [
    {
      id: 'what',
      heading: 'What',
      body: [
        {
          text: `${count.charts} charts on ${count.topics} topics from ${sources.publishers.list.length} official publishers. Every figure shows its source, period and status. No account needed.`,
        },
      ],
    },
    {
      id: 'who',
      heading: 'Who',
      body: [
        {
          text: `Built by ${SITE.author.name}. Independent of the Government of India and of every publisher. No publisher reviews what we write.`,
        },
      ],
      links: [`${SITE.author.name} on X`],
    },
    {
      id: 'why',
      heading: 'Why',
      body: [
        {
          text: 'The data is good but hard to reach: PDF bulletins, Excel tables and portals that move. We put each figure in one place, tie it to its release, and say when a method changes or a value is missing.',
        },
      ],
    },
    {
      id: 'models',
      heading: 'Inspired by',
      body: [
        {
          text: 'UK by Numbers, for short topic pages of plain charts. Our World in Data, for a source line and a data page behind every chart. Neither is involved.',
        },
      ],
    },
    {
      id: 'objects',
      heading: 'The objects',
      body: [
        {
          text: 'The object at the top of each topic, such as the punch-marked coin for Prices, is made with an image model and labelled as a recast. It is decoration, not data.',
        },
      ],
    },
    {
      id: 'reuse',
      heading: 'Reuse',
      body: [
        { text: 'Text, charts and data files: CC BY 4.0. Code: MIT.', style: 'lead' },
        {
          text: `Credit "India by Numbers" and link to the page. Each publisher's terms still apply to its figures; none of our ${sources.publishers.list.length} publishers states an open licence.`,
        },
      ],
    },
    {
      id: 'languages',
      heading: 'Languages',
      hindi: 'भाषाएँ',
      body: [
        {
          text: `English, with topic names in Hindi. Each state page also gives the state's name in Hindi and in its own official language: ${count.nativeScripts} scripts in all.`,
        },
      ],
    },
    {
      id: 'contact',
      heading: 'Contact',
      links: ['Report a problem'],
      body: [
        {
          text: 'Use "Report a problem" on any chart, or the Corrections page. Every fix goes in the corrections log.',
        },
      ],
    },
    {
      id: 'privacy',
      heading: 'Privacy',
      body: [
        {
          text: 'Cloudflare Web Analytics counts visits, with no cookies and no tracking across sites. Your number format and chosen state stay in your browser. A problem report keeps your message and, if you give one, your email, which we use only to reply.',
        },
      ],
    },
  ],
}

export default about
