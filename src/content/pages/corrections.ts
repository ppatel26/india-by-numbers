// Copy for the Corrections page and the Report a problem form.

export interface CorrectionRow {
  /** Dates as "12 Nov 2026". */
  reported: string
  fixed: string
  page: string
  change: string
  /** "Our error" or "The publisher's". */
  cause: string
}

export interface FormField {
  label: string
  placeholder: string
  hint?: string
  multiline?: boolean
  optional?: boolean
}

export interface CorrectionsPage {
  eyebrow: string
  heading: string
  log: {
    heads: { reported: string; fixed: string; page: string }
    empty: string
    rows: readonly CorrectionRow[]
  }
  policy: { heading: string; body: string }
  form: {
    heading: string
    intro: string
    fields: { page: FormField; problem: FormField; source: FormField; email: FormField }
    submit: string
    /** After the form is sent: success, or a problem we could not store. */
    status: { sent: string; error: string }
    links: { report: string; contact: string }
  }
}

const corrections: CorrectionsPage = {
  eyebrow: 'Corrections log',
  heading: 'What have we got wrong?',
  log: {
    heads: { reported: 'Reported', fixed: 'Fixed', page: 'Page and what changed' },
    empty: 'No corrections yet. When we fix an error, we list it here with the date and what changed.',
    rows: [],
  },
  policy: {
    heading: 'Our policy',
    body: "We reply to every report within 2 working days and fix or explain within 7 working days. A fixed error keeps a dated note on its chart for 12 months. A publisher revision is not a correction, so it goes in the change log above.",
  },
  form: {
    heading: 'Report a problem',
    intro: "Tell us what looks wrong. A link to the publisher's own figure helps us check fast.",
    fields: {
      page: { label: 'Page', placeholder: '', hint: 'Filled in when you come from a chart.' },
      problem: {
        label: 'What looks wrong',
        placeholder: "For example: the value for Kerala in October 2026 does not match MoSPI's table.",
        multiline: true,
      },
      source: { label: 'Source you checked', placeholder: 'Link or document name' },
      email: { label: 'Your email (optional)', placeholder: 'So we can reply', optional: true },
    },
    submit: 'Send report',
    status: {
      sent: 'Thank you. We have your report and will check it against the source.',
      error: 'We could not send the report. Say in a few words what looks wrong, then try again.',
    },
    links: { report: 'Report a problem', contact: 'Contact' },
  },
}

export default corrections
