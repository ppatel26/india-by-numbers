# UK by Numbers reference audit

This folder holds the audit of <https://ukbynumbers.org/>, done on 12 Nov 2026. It is reference material for India by Numbers. It is not India data.

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

The crawl, its extracts and the screenshots stay out of this repository: they are UK by Numbers' own content (its footer gives CC BY 4.0, its About page CC-BY-SA). This README keeps the audit's findings. UK by Numbers is by Hannah Ritchie: <https://ukbynumbers.org/>.

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
