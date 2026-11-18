# Contributing

Thank you for helping. The site has one rule above all: every number must come from an official
release, with its period, and anyone must be able to check it.

## Report a wrong figure

Use [Report a problem](https://indiabynumbers.org/corrections/#report) on the site, or open a
"Report a wrong figure" issue. Give the page, the value you see, the value you expected, and a link
to the publisher's release with the table or page number. Publisher revisions are welcome too: they
go on the Releases page, not the Corrections log.

## Suggest a dataset

Open a "Suggest a dataset" issue. Good candidates are:

- published by a government office (a ministry, the RBI, a statutory body), not a news report;
- released on a known cadence, so the chart can stay current;
- available for India, and ideally for each state and union territory.

## Add or update data

1. **Read the publisher's file.** Keep the downloaded file out of the repository. Write a script in
   `pipeline/<topic>/` that reads it and writes the CSV.
2. **Write the CSV** in `research/data/<topic>/`. Use long format: one row per value, with
   `geography` (a slug from `research/data/geography.csv`, or `india`), `period`, `value` and
   `unit`, plus any columns that split the series (sector, sex, base). Keep the publisher's digits.
   Leave missing values empty; never fill them in.
3. **Record the source** in the topic README: publisher, release title, release date, link, the
   date you read it, and the file's sha256. Note method breaks and gaps.
4. **For a revision**, keep the old value and the revision date in the README.
5. **Chart it** in `src/content/topics/<topic>.ts`. A chart picks rows with a `Pick` (file, `where`,
   `x`, `y`). See `src/content/types.ts` for the chart kinds.
6. **Run the tests.** `pnpm test` fails if the copy quotes a number that is not in the data, if a
   chart reads no rows, or if a source has no release date. `pnpm build && pnpm test:e2e` checks
   every page and link.

## Writing

Plain, number first: "In 2024, 11 in every 1,000 babies born in Tamil Nadu died before their first
birthday, against 24 across India." Short sentences, active voice, lakh and crore, "percentage
points" for a change in a rate, no em dashes. `docs/site-spec.md` has the full voice guide and the
words to avoid.

## Code

TypeScript and Astro, with pnpm on Node 24. Keep code small and typed. Charts are SVG strings made at
build time (`src/lib/charts/`), so a chart looks the same on the page, in its downloads and in its
social image. Run `pnpm check`, `pnpm test` and the end-to-end tests before you open a pull request.
