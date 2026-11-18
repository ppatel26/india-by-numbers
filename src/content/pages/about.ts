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
          text: `${SITE.author.name} builds and runs India by Numbers. It is an independent project, not affiliated with the Government of India or with any ministry, and no publisher reviews what we write. We take sides on no policy.`,
        },
      ],
      links: [`${SITE.author.name} on X`],
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
        { text: 'Licence: text, charts and data files CC BY 4.0; code MIT. Publisher data stays under each publisher’s terms.', style: 'lead' },
        {
          text: 'You may reuse our charts, text and processed data files under CC BY 4.0. Credit "India by Numbers" and link to the page. The figures in them come from publishers, and each publisher\'s terms still apply to its own material. Every PNG and SVG already carries the title, the hallmark and the source line, so the image keeps its provenance. The code that builds the site is open source under the MIT licence.',
        },
        {
          text: `None of our ${sources.publishers.list.length} publishers states an open reuse licence. The Sources page shows the terms of each.`,
        },
      ],
    },
    {
      id: 'languages',
      heading: 'Which languages does the site use?',
      hindi: 'भाषाएँ',
      body: [
        {
          text: `The site is in English. Topic names also appear in Hindi. Each state and union territory page gives its name in Hindi and in the state's own official language, in its own script: ${count.nativeScripts} scripts in all, from Bengali to Meetei Mayek and Urdu.`,
        },
        { text: 'Chart titles, notes and labels are in English for now.' },
      ],
    },
    {
      id: 'contact',
      heading: 'How do I contact you?',
      links: ['Report a problem'],
      body: [
        {
          text: 'To report a wrong figure, use "Report a problem" on any chart, or go to the Corrections page. We read every report, and each fix goes in the corrections log.',
        },
      ],
    },
    {
      id: 'privacy',
      heading: 'What do you record about visitors?',
      body: [
        {
          text: 'We count visits with Cloudflare Web Analytics: pages viewed, the site that sent you, your country and your type of device. It sets no cookies and does not follow you across other sites. The site stores your number format and your chosen state in your own browser only.',
        },
        {
          text: 'A report sent with "Report a problem" is kept with the page, your message and, if you give one, your email address. We use the email only to reply.',
        },
      ],
    },
  ],
}

export default about
