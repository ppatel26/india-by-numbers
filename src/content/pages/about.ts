// About. Copy is verbatim from the board, with copy rules applied.

import { count } from './counts'
import sources from './sources'

export interface Section {
  /** Anchor for links from the footer. */
  id: string
  heading: string
  /** Hindi heading, where the board has one. */
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
  intro: 'A free, non-partisan site of charts about India, built from official statistics. It is not a government website.',
  sections: [
    {
      id: 'what',
      heading: 'What is it?',
      body: [
        {
          text: `India by Numbers shows India's official statistics as plain charts, with the source, period and status on every figure. The first release has ${count.charts} charts on ${count.topics} topics, from ${sources.publishers.list.length} publishers. It is free and needs no account.`,
        },
      ],
    },
    {
      id: 'who',
      heading: 'Who makes it?',
      body: [
        {
          text: 'An independent project. It is not affiliated with the Government of India or with any ministry, and no publisher reviews what we write. We take sides on no policy.',
        },
        // DECIDE: the board adds a placeholder line, "The names of the people who make it, and any
        // funding, will be listed here before launch." Left out: add the names and funding, or
        // confirm there is none, before launch.
      ],
    },
    {
      id: 'why',
      heading: 'Why?',
      body: [
        {
          text: "India's statistics offices publish good data, but it is hard to reach. The figures sit in PDF bulletins, Excel tables, images of tables and portals that change address. IMD, for example, publishes monsoon rainfall by subdivision, not by state. A reader who wants to know how fast prices are rising, or how many children leave school in their state, has to know which office to ask and how to read its tables. We bring those figures into one place, tie each one to its release, and say plainly when a method changes or a value is missing.",
        },
      ],
    },
    {
      id: 'models',
      heading: 'Who do we learn from?',
      body: [
        {
          text: 'UK by Numbers, built by Hannah Ritchie, gave us the shape: short topic pages, each a set of charts with one plain sentence about what the chart shows.',
        },
        {
          text: 'Our World in Data gave us the standard for sources: a source line on every chart, a data page behind it, a citation you can copy, and files anyone can download.',
        },
        { text: 'Neither site is involved in this project. We name them because we copied their good habits.', style: 'aside' },
      ],
    },
    {
      id: 'objects',
      heading: 'What are the objects?',
      body: [
        {
          text: 'Each topic has one object from India\'s material record at the top of its page: a punch-marked silver coin for Prices, a charkha for Jobs, a Chola-style Nataraja for Religion and culture, a sandstone relief of a merchant and a scribe for How we check.',
        },
        { text: 'We made these objects with image models and label each one as a recast. None stands in for data.', style: 'lead' },
      ],
    },
    {
      id: 'reuse',
      heading: 'Can I reuse the charts and data?',
      body: [
        // Board: "Licence: CC BY 4.0 for our charts, text and code." copy G sets the licence line.
        { text: "Licence: CC BY 4.0. Publisher data stays under each publisher's terms.", style: 'lead' },
        {
          text: 'Use our charts, text and code for any purpose. Credit "India by Numbers" and link to the page. Every PNG and SVG already carries the title, the hallmark and the source line, so the image keeps its provenance.',
        },
        {
          text: `None of our ${sources.publishers.list.length} publishers states an open reuse licence. The Sources page shows the terms of each.`,
        },
      ],
    },
    {
      id: 'hindi',
      heading: 'Is it in Hindi?',
      hindi: 'क्या यह हिंदी में है?',
      body: [
        {
          text: 'The interface is in English and Hindi from launch: the menus, topic names, chart titles, axis labels, status words and hallmark labels. Use the EN / हिंदी switch at the top of any page. Hindi pages use the digits 0 to 9.',
        },
        { text: 'Chart notes and longer text stay in English for now.' },
      ],
    },
    {
      id: 'contact',
      heading: 'How do I contact you?',
      // DECIDE: the board gives no target for "Contact". copy: no placeholder email.
      links: ['Report a problem', 'Contact'],
      body: [
        {
          text: 'To report a wrong figure, use "Report a problem" on any chart, or go to the Corrections page. We reply within 2 working days.',
        },
      ],
    },
  ],
}

export default about
