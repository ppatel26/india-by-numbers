# Build exploration

Status: exploration only. Implementation and deployment are not approved.

## Shape

The reference site is static HTML with one CSS file, one D3 renderer and one chart spec per chart. Keep that shape. Add a reviewed data pipeline, because Indian sources change format and go offline.

## Update workflow

1. Watch: a scheduled job checks each publisher release page.
2. Fetch: store the raw file as published, with URL, fetch time and checksum.
3. Parse: one parser per source. A schema decodes the output. A failure is a typed error.
4. Diff: report new periods, revised values and text claims that no longer match.
5. Review: open a pull request. A person merges it. Nothing publishes on its own.
6. Build: static pages with SVG fallbacks, PNG and CSV downloads.

## Data model

- Topic: slug, bilingual title, parts.
- Section: id, bilingual heading, charts.
- ChartSpec: slug, type, series, views, format, caveats, notes.
- Series: id, unit, period kind (FY, CY, month, quarter, survey round), base year, geography level.
- Observation: series, period, geography code, value, status (final or provisional).
- Source: publisher, title, release URL.
- Release: source, released on, data to, fetched at, checksum, raw file key.
- Geography: code, bilingual name, level, valid from, valid to, successor of.

The UK spec fields carry over: type, x, series, format, views, picker, map, rankedBar, timeline, breaks, refLine, notes, source.

## Charts

One renderer reads a ChartSpec and uses D3 modules (scales, shapes, axes). It renders SVG at build time. JavaScript adds tooltips, view switches, the place picker and the number-system switch. Every chart has a table view and a CSV with a unit column. A build check compares numbers in the text with the data.

MVP chart types: line, bar, horizontal bar, ranked bar, small multiples. Later: pyramid, Sankey, treemap, maps.

## Stack (proposed)

- TypeScript and pnpm.
- Effect at the data boundary: Schema for decoding, typed errors and retries in fetch, parse and diff.
- XState: not needed for the MVP. The picker and view state fit in the URL. Revisit for timeline playback.
- Cloudflare: static assets on Workers or Pages, R2 for raw files, a Cron Trigger for the watch step. Declare resources with Alchemy.
- No deploy. Choose the Wrangler profile (personal or work) first.

## MVP scope

About 6 topics and 40 charts: Population, Prices, Growth, Jobs, Health, Education. National series, state ranked bars and tables, a latest-releases board, English pages with a Hindi interface shell, and the lakh and crore switch.

Later: district data, maps, full Hindi text, other scripts, timeline playback, third-party embeds.

Done means:

- Every chart traces to a stored raw file.
- Every number in the text matches its CSV.
- Every page passes keyboard and screen reader checks.
- The first screen loads under 150 KB.

## Open decisions

1. Site framework. Recommendation: Astro (static output, islands for interactivity).
2. Languages at launch.
3. Maps: official Survey of India boundaries, or no maps until obligations are confirmed.
4. Licence for our charts and text. (The reference site states two different licences.)
5. Wrangler profile and domain.
6. Who reviews data pull requests, and how fast.
7. Whether the name "India by Numbers" is free to use.
