# India by Numbers

**[indiabynumbers.org](https://indiabynumbers.org)**: India's official statistics, checked and charted.

Nine topics (prices, the economy, jobs, population, health, education, elections, climate, and
religion and culture), 72 charts, and a profile of each of India's 28 states and 8 union territories
beside the national figure. The site follows the example of [UK by Numbers](https://ukbynumbers.org/)
and [Our World in Data](https://ourworldindata.org/).

Built by Parv ([@patel_parv](https://x.com/patel_parv)).

## How the numbers are checked

- Every value comes from a release by a government office: MoSPI, RBI, the Registrar General (Census
  and SRS), IIPS for the NFHS, the Ministry of Education, the Election Commission, IMD, CEA, MNRE and
  others. Each topic folder in [`research/data/`](research/data/) has a README with the release, its
  date, the link and the checksum of the file we read.
- The site prints the publisher's own digits. Each figure carries its period and, where it applies,
  a status word: Provisional, Projection, Survey estimate or Method break.
- Base-year changes stay visible. The CPI on base 2012=100 and on 2024=100 are two lines with a break,
  not one spliced line.
- A test fails the build if the text quotes a number that is not in the data.
- Every chart has a table, and CSV, PNG, SVG and JSON downloads.

## Contribute

**Found a wrong figure?** Use [Report a problem](https://indiabynumbers.org/corrections/#report) on
the site, or open a [wrong figure issue](../../issues/new?template=wrong-figure.yml) with a link to
the source you checked.

**Know a dataset that belongs here?** Open a [dataset issue](../../issues/new?template=dataset.yml):
the publisher, a link, and the question it answers. Pull requests that add data are welcome; see
[CONTRIBUTING.md](CONTRIBUTING.md).

## Run it

Node 24 and pnpm.

```sh
pnpm install
pnpm dev                      # http://localhost:4321
pnpm test                     # data, prose numbers, copy rules, formats, charts
pnpm build && pnpm test:e2e   # every page, link, file and interaction, through the Worker
pnpm check                    # types
pnpm deploy                   # Cloudflare, personal profile
```

## How it is built

| Path | What it holds |
| --- | --- |
| [`research/data/`](research/data/) | The data: one folder per topic, with CSVs and a README of sources. Also the 36 states and UTs, their official languages, and the release calendar. |
| [`pipeline/`](pipeline/) | The scripts that turned each publisher file into its CSV. |
| [`src/content/`](src/content/) | The copy and the chart definitions, as typed data (`types.ts`). |
| [`src/lib/`](src/lib/) | Build-time code: CSV reading, periods and number formats, the chart engine (`charts/`), state pages, chart files and social images. |
| [`src/components/`](src/components/), [`src/pages/`](src/pages/) | Astro components and routes. |
| [`src/scripts/`](src/scripts/) | Small browser scripts: chart tabs and tooltips, the lakh and million switch, the chosen state, search. |
| [`worker/`](worker/) | The Cloudflare Worker: static files, and the Report a problem form into D1. |
| [`docs/`](docs/) | The site spec and the design direction. |

Charts are drawn at build time from the CSVs, as SVG. One renderer makes each chart's page view, its
downloads and its social image. The site is static HTML on Cloudflare Workers.

## Licence

Code: [MIT](LICENSE). Text, charts and processed data files: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/);
credit "India by Numbers" and link to the page. Publisher data stays under each publisher's terms.
Fonts: SIL Open Font License.
