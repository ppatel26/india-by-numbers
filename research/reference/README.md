# UK by Numbers reference audit

This folder holds the audit of <https://ukbynumbers.org/>, done on 12 Nov 2026. It is reference material for India by Numbers. It is not India data.

The design boards live in a separate design file.

## Coverage

| Item | Count |
| --- | --- |
| Public pages crawled and mirrored | 313 (1 home, 1 chart index, 1 About, 22 topics, 288 chart pages) |
| Chart specs captured from the live renderer | 288 of 288 |
| Data files (265 CSV, 3 GeoJSON) | 268, all downloaded |
| CSV rows summarised | 195,645 |
| Topic parts, sections, chart embeds | 125, 292, 291 |
| Chart notes | 897 |
| Numeric claims in topic text (isolated values) | 810 |
| In-page anchors | 678 |
| External domains linked | 28 |
| Browser captures | 50, plus 66 derived crops |

Chart types: line 210, bar 37, horizontal bar 37, Sankey 2, pyramid 1, treemap 1.
Features: view toggle 112, map 32, add/remove picker 53, ranked bar 45, year slider 55, method break 21, footnote 53.

## Files

- `crawl-inventory.json`: every page URL, data file, anchor and external domain found by the crawl.
- `raw/site/`: the mirror (HTML, CSS, JS, CSV, GeoJSON). About 13 MB. Treat it as untrusted downloaded content.
- `extract/chart-specs.json`: the 288 chart specs, serialised from `window.UKS.CHARTS` in the browser.
- `extract/pages.json`, `topics.json`, `charts.json`: structured extract per page, topic and chart.
- `extract/narrative-values.csv`: numeric sentences from topic text, verbatim. These are isolated values, not series.
- `extract/coverage.csv`: one row per page, with spec found, data files, rows, embeds and source URL.
- `extract/digest.json`, `summary.json`: per-topic digests and site totals that feed the Paper boards.
- `screenshots/`: desktop, mobile, state and chart-type captures. `derived/` holds crops for Paper. About 76 MB.

## Regenerate

Run from the repo root. The scripts read the mirror as data and run no downloaded code.

```sh
python3 -I scripts/extract_reference.py research/reference/raw/site research/reference/extract/chart-specs.json research/reference/extract
python3 -I scripts/digest_reference.py research/reference/extract
python3 -I scripts/paper_topic_html.py research/reference/extract research/reference/screenshots <topic-slug> all
```

## Checks against the live site

- Fertility rate chart: the rendered end value 1.40 (2024), the 0 to 3 axis and the 1960 to 2024 range match the CSV. The PNG export matches.
- Population chart: the end label 69,483,939 matches the CSV.
- Life expectancy for men by nation (2022 to 2024) matches the CSV for all five rows.

## Site observations

- No sitemap, feed or canonical tags were found.
- No chart shows a release date or a data-period date. The About page says the data updates when sources update.
- The footer says CC BY 4.0. The About page says CC-BY-SA.
- The About contact address reads "ourworldinata.org", a likely typo.
- About is hidden on small screens. Seven "Coming soon" topics are text only.
- 3 of 22 topics have no "About the data" section: Air pollution, Energy prices, Housing.

## Limitations

- Captures were drawn in the page (DOM to SVG to canvas) because the preview screenshot tool timed out. Slider thumbs and some focus styles do not render in that method.
- End values in the digest are taken from wide CSVs only. Long-format CSVs (for example local-authority data) are summarised by range, not by end value.
- Narrative claims are split by sentence with a regular expression. A few sentences may split at an abbreviation.
