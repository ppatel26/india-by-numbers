# India by Numbers

India's official statistics, checked and charted. A static site in the spirit of
[UK by Numbers](https://ukbynumbers.org/) and [Our World in Data](https://ourworldindata.org/).

Live: <https://indiabynumbers.org>. Built by Parv ([@patel_parv](https://x.com/patel_parv)).

## What is here

| Path | What it holds |
| --- | --- |
| `research/data/` | The data: publisher CSVs per topic, with a README for each (release, date, URL, sha256, gaps). Also `geography.csv`, `state-languages.csv` and `release-calendar.csv`. |
| `src/content/` | The content model (`types.ts`), one module per topic (copy and chart definitions), and page copy (`pages/`). |
| `src/lib/` | Build-time code: CSV reading, periods and number formats, the chart engine (`charts/`), state pages (`profile.ts`), chart files and social images (`render.ts`, `og.ts`, `shape.ts`). |
| `src/components/`, `src/pages/` | Astro components and routes. |
| `src/scripts/` | Small browser scripts: chart tabs and tooltips, the number switch, the selected state, search, list filters. |
| `worker/` | The Cloudflare Worker: static files, plus `POST /api/report` into D1. |
| `docs/` | Site spec and the Taksal design direction. |
| `tests/` | Unit tests (Vitest) and end-to-end tests (Playwright). |

Every number on the site is read from `research/data` at build time and printed with the publisher's
digits. One renderer makes each chart's page view, its PNG and SVG files and its social image.

## Run it

Node 24 and pnpm.

```sh
pnpm install
pnpm dev            # http://localhost:4321
pnpm build          # static site in dist/
pnpm test           # unit tests: data, prose numbers, copy rules, formats
pnpm build && pnpm test:e2e   # every page, link, file and interaction, through the real Worker
pnpm check          # astro check and the Worker types
```

## Deploy

Cloudflare Workers on the personal account (`wrangler auth activate personal` binds this folder).

```sh
pnpm deploy
pnpm exec wrangler d1 migrations apply india-by-numbers --remote   # after a new migration
```

## Add or update data

1. Put the publisher file's values in a CSV under `research/data/<topic>/`, and record the release,
   date, URL and sha256 in that folder's README.
2. Point a chart at it in `src/content/topics/<topic>.ts` (a `Pick`: file, `where`, `x`, `y`).
3. Run `pnpm test`. The prose test fails if the copy quotes a number that is not in the data.
4. Change `SITE.checked` in `src/lib/site.ts` when a full check is done.
