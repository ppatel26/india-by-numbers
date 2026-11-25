/**
 * Data files the site may not show yet. Each one waits for something only the owner can do,
 * such as asking a publisher for permission. No chart may read these files, and no prose may
 * quote a number that appears only in them (tests/unit/content.test.ts, tests/unit/prose.test.ts).
 * Remove a file from this list when the reason no longer holds.
 */
export interface GatedFile {
  /** Path under research/data. */
  file: string
  /** Why the site cannot show it yet. */
  reason: string
}

const ASG =
  'Agricultural Statistics at a Glance 2024-25: the publisher allows reuse only "after taking proper permission by sending a mail to us" (desagri.gov.in Website Policies). The owner has not asked yet.'

export const GATED: readonly GatedFile[] = [
  { file: 'agriculture/crop-area-production-yield-india.csv', reason: ASG },
  { file: 'agriculture/crop-yield-by-state.csv', reason: ASG },
  { file: 'agriculture/crop-production-by-state.csv', reason: ASG },
  { file: 'agriculture/operational-holdings-agriculture-census.csv', reason: ASG },
]

export const isGated = (file: string): boolean => GATED.some((g) => g.file === file)
