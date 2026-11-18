# Site specification: India by Numbers

Status: built as release 1 on 18 Nov 2026. Decisions taken in the build are marked "Decided".

This spec defines the pages, blocks, chart parts, data rules, map policy and voice for the first public release (release 1). Designers draw every page in Paper from this spec. The visual language is "Taksal" (see `docs/design-direction.md`). The build shape is in `docs/build-exploration.md`.

Evidence:

- UK by Numbers audit, 12 Nov 2026: `research/reference/` (screenshots, `extract/*.json`, `extract/narrative-values.csv`).
- Our World in Data (OWID), live pages seen on 17 Nov 2026 in a browser:
  - <https://ourworldindata.org/grapher/life-expectancy> (Line, Table and Map tabs, Download panel)
  - <https://ourworldindata.org/grapher/life-expectancy?tab=table>
  - <https://ourworldindata.org/grapher/life-expectancy?tab=map>
  - <https://ourworldindata.org/grapher/population> (data page below the chart)
  - <https://ourworldindata.org/faqs>, <https://ourworldindata.org/about>
  - <https://ourworldindata.org/easier-to-reuse-our-data> (21 Nov 2024)
  - <https://ourworldindata.org/data-insights/spotting-and-fixing-data-issues-how-we-help-improve-data-quality-on-and-off-our-publication> (26 Nov 2024)

UK by Numbers and OWID are related. The UK by Numbers About page says it was built by Hannah Ritchie, Deputy Editor at OWID, "independently of that project" (`screenshots/about-desktop.png`).

## What we saw

### UK by Numbers (audit)

- 313 pages: 1 home, 1 "All charts" index, 1 About, 22 topic pages, 288 chart pages (`extract/summary.json`).
- Chart types: 210 line, 37 bar, 37 horizontal bar, 2 Sankey, 1 pyramid, 1 treemap. Features: view toggle 112, map 32, add/remove picker 53, ranked bar 45, year slider 55, method break 21.
- Topic page: an "On this page" list of numbered parts on the left. A kicker, a title, and a two-paragraph intro. Parts ("Part 1") with a question as the title. Numbered sections ("1.1"). Each section has text, then one chart. Most topics end with "About the data" (`screenshots/derived/topic-desktop-age-structure-top.png`).
- Chart frame: title, one-sentence subtitle, a "UK by Numbers" badge, view tabs (Bar, Line, Map, Table), a filter menu, "Add/remove police forces", the chart, a play button and year slider, "Note:", "Source:", then "Download CSV", "Download PNG", "Embed" (`screenshots/chart-feature-ranked-bar-picker.png`).
- Ranked bar: the selected area and the national total are drawn in black (`chart-feature-ranked-bar-picker.png`).
- Method break: a dotted vertical line with "← Earlier method | Current method →" (`chart-type-line-provisional.png`).
- Map: a choropleth with a binned legend headed "England and Wales: 84.6" and a "No data" swatch (`state-map-view.png`).
- Chart page: the chart frame, then "About this data" (source link and notes), then "This chart appears in Crime." (`raw/site/charts/crime-rate-by-police-force/index.html`, read as text).
- Home: dark hero, "Search 288 charts and topics", "Try" chips, "Browse by topic" in seven groups, a text-only "Coming soon" line (`home-desktop.png`). The search shows a typeahead with TOPIC rows first and "See all 13 matching charts →" (`home-search-typeahead.png`).
- Gaps: no release date or data-period date on any chart. The footer says CC BY 4.0, but the About page says CC-BY-SA. The contact address reads "ourworldinata.org". About is hidden on small screens. 3 of 22 topics have no "About the data". No sitemap, feed or canonical tags (`research/reference/README.md`).

### Our World in Data (live, 17 Nov 2026)

- Chart ("grapher") tabs, in this order: Table, Map, Line, Bar. The Map tab adds the year to the title: "Life expectancy, 2023".
- Entity picker: a side panel "Add/remove countries and regions" with "Search for a country or region", "Sort by: Life expectancy, 2023", "Filter by type: All (265)", and a "Selection (6)" list with "Clear". Each row shows the latest value.
- Timeline: "Play time-lapse", "Jump to 1770", a range slider with "Start time" and "End time" handles, "Jump to 2023".
- Under the chart: "Data source: Riley (2005); Zijdeman et al. (2015); HMD (2025); UN WPP (2024)", then "OurWorldinData.org/life-expectancy | CC BY", and buttons "Download", "Share", "Enter full-screen".
- Table tab: columns "Country or region", start year, end year, "Trend" (sparkline), "Absolute Change", "Relative Change". A missing value is a dash with the label "No data for 1543". Filter and search sit above the table.
- Download panel, "Visualization" tab: "Image (PNG)" ("Suitable for most uses, widely compatible."), "Vector graphic (SVG)", and the option "Include terminology definitions at bottom of chart". It also offers "a live embed that always reflects our latest data updates, or a snapshot embed that stays fixed at the time you created it."
- Download panel, "Data" tab: "Source and citation", "Quick download" (a ZIP with "a CSV file, metadata in JSON format, and a README"), "Download full data" (21,565 rows) and "Download displayed data" (473 rows), a "Data API" with CSV and metadata JSON URLs, long or short column names, and code examples.
- Data page key facts (life expectancy): "Data source", "Unit: years", "Date range: 1543-2023", "Last updated: 2025-10-22", "Next expected update: 2026-12-18", "Managed by".
- Data page headings (population), in order: "What you should know about this indicator", "Related research and writing", "Explore charts that include this data", "Sources and processing", "This data is based on the following sources" (each with "Retrieved on", "Retrieved from", "Citation"), "How we process data at Our World in Data", "Combination of different sources", "Reuse this work", "Citations", "How to cite this page", "How to cite this data" ("In-line citation" and "Full citation", with an archived URL), "Download".
- Population key facts: "Last updated: July 15, 2024", "Next expected update: December 2026". The two pages use two date formats.
- A useful caveat line: "Breaks in the data may occur at the boundaries between sources due to their methodological differences."
- Licence: "All data, visualizations, and code produced by Our World in Data are completely open access under the Creative Commons BY license." Third-party data stays "subject to the license terms from the original providers."
- Quality: "we've built in-house tools that flag unusual patterns" (data insight, Nov 2024). "Our team regularly identifies and investigates data anomalies, often working with original data providers to correct errors." (Nov 2024).
- Gaps: the FAQ and About pages have no corrections policy and no update schedule. The only route is an email address and a feedback form.

## Sitemap

All URLs are lower case with a trailing slash. Slugs come from `research/data/geography.csv` for states and UTs.

| Page type | URL pattern | Release 1 | Pattern it follows |
| --- | --- | --- | --- |
| Home | `/` | Yes | UK home |
| Topics index | `/topics/` | Yes | UK "Browse by topic" and "Coming soon", as its own page |
| Topic page | `/<topic>/`, for example `/prices/` | Yes, 9 pages | UK topic page |
| Chart and data page | `/charts/<chart-slug>/` | Yes | OWID grapher and data page, UK chart page |
| Chart view state | `/charts/<chart-slug>/?tab=table&state=kerala&time=2011..2024&units=million` | Yes | OWID URL parameters |
| All charts | `/charts/` | Yes | UK "All charts" |
| Chart files | `/charts/<chart-slug>.csv`, `.png`, `.svg`, `.metadata.json` | Yes | OWID download panel |
| States index | `/states/` | Yes | New |
| State profile | `/states/<state-slug>/`, for example `/states/kerala/` | Yes, 36 pages | New (India-specific) |
| Sources | `/sources/` | Yes | New (UK and OWID list sources per chart only) |
| One publisher | `/sources/<publisher>/`, for example `/sources/mospi/` | Later | New |
| How we check (methods) | `/how-we-check/` | Yes | OWID "How we process data", made public and specific |
| Releases (changelog and calendar) | `/releases/`, feed at `/releases/feed.xml` | Yes | OWID "Last updated" and "Next expected update", as one page |
| Corrections | `/corrections/` | Yes | New (neither site has one) |
| About | `/about/` | Yes | UK About |
| Search | `/search/?q=<terms>` | Yes | UK typeahead, plus a results page |
| Hindi interface | `/hi/...` | Later. Decided: release 1 is in English, with topic names in Hindi and each state's name in Hindi and in its own official language and script (`research/data/state-languages.csv`). | New |
| Embed | `/charts/<chart-slug>/embed/` | Later | UK "Embed", OWID live and snapshot embeds |
| District pages | `/states/<state-slug>/<district-slug>/` | Later | New |
| Not found | any unknown path | Yes | Standard |
| Sitemap file | `/sitemap.xml` | Yes | UK has none |

Header navigation: Topics, States, All charts, How we check, About, search, the number switch (lakh and crore or million), (Decided: no language switch until the Hindi interface exists).

Footer: the one-line purpose, the licence in one sentence, links to Sources, Releases, Corrections, How we check and About, and the date of the last site build.

## Topics for release 1

Each topic gets a slug, a Taksal object (`docs/design-direction.md`) and parts in the UK style. The parts below are proposals. The data work in `research/data/` decides which charts each part can carry. Sources marked "to check" are not yet checked for reach, format, cadence or licence (`research/india-sources.md`).

| Topic | Slug | Proposed parts | Main sources |
| --- | --- | --- | --- |
| Population | `population` | How many people live in India? How old is India's population? Births and deaths. Population across the states. How might the population change? About the data. | Census of India (ORGI), Sample Registration System (ORGI), population projections (to check) |
| Prices | `prices` | How fast are prices rising? What is driving inflation? Prices across the states. The inflation target. About the data. | MoSPI (CPI, base 2024=100 from Jan 2026), RBI |
| Economy | `economy` | How fast is the economy growing? How has GDP per person changed? Industry and services. The states' economies. About the data. | MoSPI (National Accounts, base 2022-23; IIP), RBI |
| Jobs | `jobs` | How many people work? How many people are unemployed? What kind of work do people do? What do people earn? Jobs across the states. About the data. | MoSPI (PLFS) |
| Health | `health` | How long do people live? Child and maternal health. Nutrition. Health across the states. About the data. | SRS (ORGI), NFHS (to check) |
| Education | `education` | How many children are in school? Literacy. Schools and teachers. Education across the states. About the data. | UDISE+ (to check), Census of India, MoSPI surveys (to check) |
| Elections | `elections` | How many people vote? Women voters and candidates. Seats and votes by state. About the data. | Election Commission of India (to check) |
| Climate | `climate` | How has India's temperature changed? The monsoon. Greenhouse gas emissions. Climate across the states. About the data. | IMD (to check), India's reports to the UNFCCC (to check) |
| Religion and culture | `religion-and-culture` | Religion in India. Languages. Religion and language across the states. About the data. | Census of India (latest full count is 2011; Census 2027 counting runs to 4 Jan 2027) |

Note: `docs/build-exploration.md` scoped the MVP at 6 topics. Release 1 adds Elections, Climate, and Religion and culture, for 9 topics.

### Later

Show these on the topics index under "Coming later", as text with no links (the UK "Coming soon" pattern, `home-desktop.png`):

Public finance, Energy, Air quality, Crime, Housing and water, Agriculture, Migration, Trade, Poverty and inequality, Transport.

## Page anatomy

Each list gives the blocks from top to bottom. "UK" and "OWID" name the pattern each block follows. Taksal rules apply to all pages: one object per page at the top, no cards for figures or charts, charts on the white ground under a 1 px rule, and a hallmark on every figure.

### Home (`/`)

1. Header. Wordmark, navigation, search, number switch. UK header (`home-desktop.png`).
2. Hero on lac. The Indus seal object, the site name, one line ("India's official statistics, checked and charted"), and search: "Search N charts, topics and states". Under it, "Try" with four terms, for example "inflation", "unemployment", "Kerala", "turnout". UK hero (`home-desktop.png`, `home-mobile.png`).
3. Latest figures. A ledger of five to seven hero numbers, one per row. Each row has the figure, a plain label, the change from the last period, and the hallmark. Example rows (checked 17 Nov 2026, `docs/design-direction.md`): CPI inflation 6.09%, Oct 2026, Provisional, MoSPI; real GDP growth 7.8%, Q1 FY 2026-27, MoSPI; unemployment 5.0%, Sep 2026, persons 15+, CWS, MoSPI PLFS. Each row links to its chart page. New (UK has no figures on the home page).
4. Browse by topic. Nine topics in a ruled list. Each item has the topic coin, the name, one question, and the number of charts. UK "Browse by topic".
5. Coming later. One text line with the later topics. UK "Coming soon".
6. States. A small tile map of the 36 states and UTs. Each tile links to its state profile. Under it: "Choose a state or union territory". New.
7. Latest releases. The five most recent entries from `/releases/`: date, publisher, release, what we changed. Link "All releases". New (OWID "Latest" is articles, not releases).
8. How we check. One sentence on the hallmark and a link to `/how-we-check/`. New.
9. Footer.

### Topics index (`/topics/`)

1. Header.
2. Title "Topics", one line on what a topic page holds.
3. Topic list. One ruled row per topic: coin, name, the part titles in one line, number of charts, "Last updated" date. UK home topic list, extended.
4. Coming later. The later topics as text. UK "Coming soon".
5. Footer.

### Topic page (`/<topic>/`)

Follows the UK topic page (`screenshots/derived/topic-desktop-age-structure-top.png`, `topic-desktop-*.png`).

1. Header.
2. Object. The topic object at the top. Taksal rule 1.
3. Title block. Kicker (topic name in mono), title, two intro paragraphs: the questions the page answers, then what the page holds. UK intro.
4. Key figures. Three or four hero numbers with hallmarks, in a ledger. New.
5. "Last updated" and "Next release" line, with dates and a link to `/releases/`. OWID key facts, at topic level.
6. "On this page". A numbered list of parts. Sticky on the left at desktop. A menu button on mobile. UK (`topic-mobile-section-menu-open.png`).
7. Parts. Each part has a heavy rule, the kicker "Part 1", and a question as the title. UK parts.
8. Sections inside each part. Number ("1.1"), heading, two to four short paragraphs, then one chart frame. The text quotes values from the chart's CSV. A build check compares them. UK sections.
9. "Across the states" part. A tile map and a ranked bar with an India reference line. Each state name links to its state profile. UK "Age across the UK" and other local-area parts.
10. "About the data" part. Required on every topic. How each measure is defined, survey or count, period kind, base year, method breaks, coverage gaps. UK "About the data" (missing on 3 UK topics).
11. Sources. Every release used on the page, with publisher, title, release date and link. New at topic level.
12. Footer.

### Chart and data page (`/charts/<chart-slug>/`)

Follows OWID's grapher and data page, with the UK chart page's notes and "This chart appears in" link.

1. Header.
2. Breadcrumb. Topic, then part. UK "This chart appears in", moved to the top.
3. Chart frame (see "Chart components"). Title, subtitle, hallmark, status words, tabs Chart, Table, Map, the state picker, the timeline, the chart, notes, source line, actions (Download, Share). OWID grapher (`grapher/life-expectancy`); UK chart frame (`chart-feature-ranked-bar-picker.png`).
4. Key facts. A ledger: Publisher; Release (title and link); Released on; Period covered; Unit; Geography; Base year; Status; Checked by us on; Last updated on this site; Next expected release. OWID key facts ("Unit", "Date range", "Last updated", "Next expected update").
5. What you should know about this figure. Three to six plain bullets: what it measures, what it leaves out, comparability across states and years. OWID "What you should know about this indicator"; UK "About this data" notes.
6. Method breaks and revisions. A dated list. Each item says what changed and whether values on each side compare. New (UK shows breaks only on the chart).
7. Sources and processing. Per source: publisher, release title, release URL, released on, fetched on, file checksum, link to the stored raw file. Then "How we process this figure": the numbered steps for this chart (parse, convert unit, derive rate, join series). OWID "This data is based on the following sources", "Notes on our processing step for this indicator".
8. Reuse this work. Licence in one sentence. "How to cite this page" and "How to cite this data" (in-line and full), each with a dated snapshot URL. OWID "Reuse this work" and "Citations".
9. Download. CSV of the full data and of the displayed data, metadata JSON, PNG, SVG. OWID download panel.
10. Related. "This chart appears in" with the topic section link, other charts in the same part, and state profiles that use this chart. UK and OWID "Related charts".
11. Report a problem. A link to `/corrections/` with the chart slug filled in. New.
12. Footer.

On mobile, the chart frame comes first. Key facts and later blocks follow in the same order. UK mobile (`chart-mobile-ranked-bar.png`).

### All charts (`/charts/`)

1. Header.
2. Title "All charts", one line: "Every chart has a table, a source and a CSV."
3. Search box with a count ("N charts"). UK (`screenshots/derived/charts-index-top.png`).
4. Filters: topic, chart type, has state data, status word.
5. List grouped by topic. One ruled row per chart: type glyph, title, subtitle, period, last updated. UK list, as ledger rows, not cards (Taksal rule 8).
6. Footer.

### States index (`/states/`)

1. Header.
2. Title "States and union territories", one line: "One state's figures beside India's, on every topic."
3. Tile map of the 36 states and UTs (see "Map policy"). Each tile links to the profile. No colour encoding on this page.
4. List in two groups: "States (28)" and "Union territories (8)", in alphabetical order, with the Hindi name beside each.
5. Search filter for the list.
6. Note on geography changes: which states and UTs were formed or merged in the period the site covers, and how we show their earlier data.
7. Footer.

### State profile (`/states/<state-slug>/`)

Our India-specific addition. It puts one state's figures beside India's on every topic.

1. Header.
2. Title block. Kicker "State" or "Union territory", the name in English and Hindi, and a small tile map with this state's tile in lac.
3. Geography note, when needed. For example, data before the state or UT was formed, or a merged UT. Links to `/how-we-check/#geography`.
4. Key figures beside India. A ledger with one row per topic: indicator, this state's value, India's value, rank among the states and UTs with data ("8th of 36"), period, hallmark. Missing values say "No data" and why, for example "Not in survey sample".
5. One section per topic, in topic order. Each has a heading, one or two sentences, and one or two compact charts: a line with this state in lac and India in ink, and a ranked bar with this state highlighted and an India reference line. A link: "See all Prices charts".
6. Data gaps. A list of topics or charts with no data for this state.
7. Sources used on this page.
8. Previous and next state, and a link to `/states/`.
9. Footer.

### Sources (`/sources/`)

1. Header.
2. Title "Sources", one line: "Every figure on this site comes from one of these publishers."
3. Publisher list. One section per publisher: full name and short name, what we use, release page link, update cadence, licence terms and their status (confirmed or to check), date we last fetched, number of charts that use it.
4. Sources we do not use, and why (for example, a portal that is often down, or data with no licence for reuse).
5. Footer.

### How we check (`/how-we-check/`)

Kajal page with the merchant and scribe relief (Taksal poster P3, "You should not have to take our word for it").

1. Header.
2. Object and title.
3. The hallmark. The four punches and the status words, each with an example.
4. Our checks, in order: watch, fetch, parse, diff, review, build (`docs/build-exploration.md`). One paragraph each. Say what a person checks and what a machine checks.
5. Revisions and base-year changes.
6. Numbers and dates: lakh, crore, the million switch, fiscal years, survey rounds.
7. Geography: the versioned state and UT table, and how we treat changes.
8. Maps: why we use a tile grid (see "Map policy").
9. What we do not do: no forecasts of our own, no joins across method breaks without a mark, no figures without a source.
10. Limits of the data.
11. Footer.

### Releases (`/releases/`)

1. Header.
2. Title "Releases", one line: "What changed on this site, and what is due next."
3. Due next. A calendar list of expected publisher releases for the next 60 days: date, publisher, release, affected charts. OWID "Next expected update", collected in one place.
4. Change log. Newest first: date, chart, kind of change (new period, revision, method break, new chart, correction), old and new value where one changed, link.
5. Filters by topic and by kind. A feed link.
6. Footer.

### Corrections (`/corrections/`)

1. Header.
2. Title "Corrections", and the policy in four sentences.
3. Report a problem. A form: page URL (filled from the referring chart), what looks wrong, source you checked, optional email. An email address as a fallback.
4. Corrections log. Newest first: date reported, date fixed, page, what was wrong, what we changed, cause (our error or a publisher revision), credit (with the reporter's consent).
5. Footer.

### About (`/about/`)

Follows the UK About page (`about-desktop.png`), with the gaps fixed.

1. Header.
2. Title "About India by Numbers".
3. What it is. Free, non-partisan, not a government website.
4. Who built it and how it is funded.
5. Credit to UK by Numbers and Our World in Data as models.
6. Can I reuse the charts and data? One licence, stated the same way as in the footer.
7. Languages. English and Hindi, and the status of each.
8. Contact. An address we have tested. A link to `/corrections/`.
9. Footer.

About is visible on all screen sizes. The UK site hides it on small screens.

### Search (`/search/?q=`)

1. Header search with a typeahead. Rows are labelled TOPIC, STATE or a topic name for charts, then "See all N matching charts →". UK typeahead (`home-search-typeahead.png`).
2. Results page. Groups in order: Topics, States, Charts, Sources. Each chart row shows title, subtitle and period.
3. Synonyms: English, Hindi and common Hinglish terms map to the same results ("mehngai", "महंगाई" and "inflation" all find Prices).
4. No results: suggest the topics list and the later topics.

## Chart components

### Chart types

| Type | Use | Required parts | Reference |
| --- | --- | --- | --- |
| Line with method break | Series over time that cross a base-year or method change, for example CPI 2012=100 and 2024=100 | Dotted vertical rule at the break, labels "← Earlier method" and "Current method →" (or the base years), a gap in the line at the break, end label with value | UK `chart-type-line-provisional.png`, `chart-feature-method-breaks.png` |
| Ranked bar with India reference line | Compare 36 states and UTs in one period | Bars sorted by value, India as a vertical ink line with a label "India 6.1%", selected state in lac, value labels, "No data" rows at the end | UK `chart-feature-ranked-bar-picker.png` (national total as a black bar; we use a line so India does not take a rank) |
| Tile map of 36 states and UTs | Where a value is high or low, at one period | Equal tiles in the grid below, binned sequential colour, legend headed by India's value, hatched "No data" tile, tile labels, a table fallback | UK `state-map-view.png` legend; OWID map "No data" |
| Small multiples | One series across many states, or many series for one state | Shared y scale by default, India drawn in ink in every panel, panel title is the state name | UK "Facet" button (`chart-feature-method-breaks.png`) |
| Stacked bar | Shares that add to 100%, for example workers by type of work | Segments in a fixed order, direct labels, total shown | UK `chart-type-stacked-sectors.png` |
| Population pyramid | Age and sex structure | Men left, women right, five-year groups, a period selector | UK `chart-type-pyramid.png` |
| Slope chart | Change between two periods for each state | Two columns, state labels at both ends, India in ink | New |
| Hero number | One headline figure | Figure, label, change from previous period, hallmark, status word, link to the chart | New (Taksal H1 ledger) |

### The chart frame

Every chart, on every page, sits in the same frame. The order is fixed.

1. Title. A plain noun phrase or a short sentence, with the place and, for one-period charts, the period. Examples: "Consumer price inflation in India", "Unemployment rate by state, 2025-26". UK titles follow this form: "Net migration to the UK", "Crime rate by police force area, year ending June 2026".
2. Subtitle. One sentence that gives the measure, the unit and the period. Example: "Annual change in the Consumer Price Index (2024=100), %, Jan 2026 to Oct 2026."
3. Hallmark. Four punches in mono, in this order:
   - Office: the publisher, for example "MoSPI".
   - Unit: "%", "₹ crore", "per 1,000 live births".
   - Our check: "Checked 17 Nov 2026", linked to the check record.
   - Period: "Oct 2026", "FY 2025-26", "NFHS-5 (2019-21)".
4. Status words, when they apply. One or more, beside the hallmark:
   - Provisional: the publisher marks the figure as provisional and will revise it.
   - Projection: a figure for a future period from a model. Draw projections as a dashed line.
   - Survey estimate: a figure from a sample survey. Show the margin of error when the publisher gives one.
   - Method break: the definition, base year or geography changed inside the series.
5. Tabs: Chart, Table, Map. Show Map only when the chart has state data. The tab label "Chart" stays the same for every chart type. OWID tabs; UK view toggle.
6. Controls: the state picker ("Add or remove states", with search and "Sort by"), filters, and the number switch. OWID entity picker; UK add/remove picker.
7. The chart. End labels on lines, value labels on bars. India in ink, the selected state in lac.
8. Timeline. A play button, the start year, a range slider, the end year. OWID and UK timeline.
9. Notes. "Note:" lines for caveats that change how to read the chart. UK "Note:".
10. Source line. "Source: MoSPI, Consumer Price Index, October 2026 release (12 Nov 2026)." Publisher, release title, release date.
11. Actions: Download (PNG, SVG, CSV, metadata), Share (link with the current view), and Embed later. The PNG and SVG carry the title, hallmark, status words and source line, so a reused image keeps its provenance. OWID download panel.

The Table tab shows every value in the chart. For time series it adds "Absolute change" and "Relative change" columns for the selected range (OWID table). A missing value shows "No data" with the reason in the cell label.

## Data quality standards

### What every published figure carries

| Field | Example |
| --- | --- |
| Value with unit | 6.09% |
| Period, with its kind | Oct 2026 (month); FY 2026-27 (fiscal year); Q1 FY 2026-27 (quarter); NFHS-5, 2019-21 (survey round) |
| Geography, with version | India; Kerala (boundary as of the period) |
| Publisher and release | MoSPI, CPI release for October 2026 |
| Release date and URL | the date the publisher released it, and a link to the release document |
| Fetch record | fetch time, file checksum, stored raw file |
| Our check date | Checked 17 Nov 2026 |
| Status word | Provisional, Projection, Survey estimate, Method break, or none (final) |
| Base year, if any | 2024=100; base 2022-23 |
| Next expected release | from the publisher's calendar, or "Not announced" |

A figure that cannot carry all of these does not publish. A figure from a portal, not a release document, is not a source until we trace it. Example: the 93.77 INR per US$ ticker value could not be traced and was removed (`research/india-sources.md`).

### Revisions

- Keep every vintage. Never overwrite a value without a record.
- When a publisher revises a figure, the chart shows the new value. The Table tab marks the cell "Revised" with the old value and the date. The change goes into `/releases/`.
- A figure stays "Provisional" until the publisher marks it final.

### Base-year and method changes

- Store the base year with every series. CPI uses 2024=100 from January 2026. The 2012=100 series ends in December 2025. GDP uses base 2022-23.
- Show a base-year change as a method break on the chart, and list it on the chart page.
- Show both series where they overlap. Do not splice them into one line. If the publisher gives a linking factor, we may show a linked series, labelled as linked, with the factor and its source.
- Geography changes (new states, merged UTs) are method breaks too. The state profile says which periods compare.

### Citation

- On the chart: the source line (publisher, release, release date).
- On the chart page: "How to cite this page" and "How to cite this data", in-line and full, with a dated snapshot URL. This follows OWID.
- Example in-line citation: "MoSPI, CPI (2024=100), Oct 2026 release; India by Numbers."
- One licence for our text, charts and code: CC BY 4.0 (to confirm). The footer, About page and every chart say the same thing. Publisher data stays under the publisher's terms. `/sources/` lists each publisher's terms and whether we have confirmed them.

### Corrections

- Anyone can report a problem from any chart page or from `/corrections/`.
- We reply within 2 working days and fix or explain within 7 working days (proposed targets).
- A fixed error gets a note on the affected chart for 12 months and a row in the corrections log.
- A publisher revision is not a correction. It goes in `/releases/` only.
- When we find an error in a publisher's own data, we tell the publisher and record it. OWID does this too (data insight, Nov 2024).

### Update cadence

| Release | Publisher | Rhythm |
| --- | --- | --- |
| CPI | MoSPI | Monthly |
| IIP | MoSPI | Monthly (quick estimate, then revised) |
| PLFS | MoSPI | Monthly and quarterly bulletins, annual report |
| GDP | MoSPI | Quarterly, with annual revisions |
| Policy rates | RBI | At each monetary policy meeting |
| SRS | ORGI | Annual |
| NFHS | IIPS for MoHFW | Rounds several years apart |
| Census | ORGI | Each census; Census 2027 counting runs to 4 Jan 2027 |
| Elections | ECI | After each election |

Rhythms to confirm per source before launch. Our target: a reviewed update within 5 working days of a publisher release (proposed). Nothing publishes on its own. A person merges each update (`docs/build-exploration.md`).

### Compared with the two models

| Standard | UK by Numbers (audit, 12 Nov 2026) | OWID (seen 17 Nov 2026) | India by Numbers |
| --- | --- | --- | --- |
| Data period on the chart | In some titles only. No release date on any chart. | Date range in key facts | Period punch on every figure |
| Last updated | None | "Last updated" | Last updated and publisher release date |
| Next update | "Updated in line with updates from the underlying data sources" (About) | "Next expected update" | Next expected release, plus `/releases/` calendar |
| Licence | Footer CC BY 4.0, About CC-BY-SA (mismatch) | CC BY for own work; third-party terms kept | One licence, one wording everywhere |
| Citation | Source line and source link | Page and data citations, in-line and full, archived URL | Same as OWID, with a dated snapshot |
| Method breaks | On 21 charts, as a dotted line | Notes in text ("Breaks in the data may occur...") | On the chart and in a dated list on the chart page |
| Provisional values | One chart dims provisional values | Not seen on the pages checked | Status word on every affected figure |
| Processing notes | Notes per chart | "How we process data", per-indicator notes | Per-chart steps, raw file and checksum |
| Corrections | Email in About (address has a typo) | Email and feedback form; no policy page | Policy, form and public log |
| About the data | Missing on 3 of 22 topics | Per data page | Required on every topic |
| Downloads | CSV, PNG, Embed | PNG, SVG, ZIP (CSV, JSON, README), API | CSV, PNG, SVG, metadata JSON; Embed later |
| Date format | Varies | Two formats seen ("2025-10-22", "July 15, 2024") | One format: "17 Nov 2026" |

## Map policy

Use a tile grid map: one equal square tile for each of the 36 states and UTs. Do not draw geographic outlines.

Reasons:

1. Small states and UTs stay visible. On an outline map, Chandigarh, Delhi, Goa, Puducherry, Lakshadweep, and the DNH and DD UT are too small to see or click.
2. A tile grid does not draw India's external boundary. India requires maps that show its boundary to follow the official boundary of the Survey of India. A tile grid shows no boundary, so it avoids that risk. Confirm the legal position before any outline map ships (`research/india-sources.md`, gap 6).
3. Equal tiles give each state and UT the same weight. That is right for rates. For totals, pair the map with a ranked bar so size is not lost.

Rules:

- Every map has a Table tab and a ranked bar view.
- The legend shows India's value at the top, as in the UK map legend ("England and Wales: 84.6", `state-map-view.png`).
- A missing value is a hatched tile with "No data" in the legend and the reason in the tooltip.
- UTs carry a small corner mark so readers can tell them from states.
- Island UTs (Lakshadweep, Andaman and Nicobar Islands) sit one empty column away from the mainland, to show the sea.
- Tiles never use flag colours (Taksal rule 5).
- District maps (later) need a different solution. Do not start them until the legal position is confirmed.

### Tile grid layout (draft)

8 columns by 7 rows. Row 1 is the north. Column 1 is the west. Names are from `research/data/geography.csv`. The layout is roughly geographic. Review it with the designers before use.

| Row | Col 1 | Col 2 | Col 3 | Col 4 | Col 5 | Col 6 | Col 7 | Col 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | | Jammu and Kashmir (UT) | Ladakh (UT) | | | | | |
| 2 | Punjab | Himachal Pradesh | Uttarakhand | | | | | Arunachal Pradesh |
| 3 | Chandigarh (UT) | Haryana | Delhi (UT) | Uttar Pradesh | Bihar | Sikkim | Assam | Nagaland |
| 4 | | Rajasthan | Madhya Pradesh | Chhattisgarh | Jharkhand | West Bengal | Meghalaya | Manipur |
| 5 | Gujarat | Dadra and Nagar Haveli and Daman and Diu (UT) | Maharashtra | Telangana | Odisha | | Tripura | Mizoram |
| 6 | | Goa | Karnataka | Andhra Pradesh | | | | |
| 7 | Lakshadweep (UT) | | Kerala | Tamil Nadu | Puducherry (UT) | | Andaman and Nicobar Islands (UT) | |

Count: 28 states and 8 UTs, 36 tiles. Short tile labels for small sizes (draft): J&K, Ladakh, Punjab, Himachal, Uttarakhand, Arunachal, Chandigarh, Haryana, Delhi, UP, Bihar, Sikkim, Assam, Nagaland, Rajasthan, MP, Chhattisgarh, Jharkhand, W Bengal, Meghalaya, Manipur, Gujarat, DNH & DD, Maharashtra, Telangana, Odisha, Tripura, Mizoram, Goa, Karnataka, Andhra, Lakshadweep, Kerala, Tamil Nadu, Puducherry, A&N Islands. The tooltip and the Table tab always use the full name.

## Voice

Write to ASD-STE100: the answer first, short sentences, active voice, one term for one concept. No em dashes.

### Rules, with examples

1. Lead with the year and the number.
   "In 2024, 11 in every 1,000 babies born in Tamil Nadu died before their first birthday."
2. Name the period kind when it is not a calendar year.
   "In FY 2024-25, income per person across India was ₹2,05,324."
3. Compare with a plain ratio when the ratio is the point.
   "[Group A] outnumber [group B] by about two to one."
4. Give a rare event as "one in N", then the exact figure.
   "About one in [N]: [exact figure]% of [group], in [year]."
5. Say what an index value means.
   "An index of 200 means prices have doubled since the base year."
6. Rank with the size of the group.
   "Tamil Nadu had the 3rd highest inflation of 36 states and UTs in October 2026."
7. State the start and end of a change in one sentence.
   "[Thing], which was [value] in [year], is now [value]."
8. Say where the data changes method, and when.
   "CPI moved to base 2024=100 in January 2026; earlier months use base 2012=100."
9. Explain a term where it first appears.
   "The repo rate, the rate at which the RBI lends to banks, is 5.50%."
10. Mark a turning point with its date.
    "Since [year], [measure A] has been higher than [measure B]."

Do not copy these UK habits:

- Pointers to the interface in the text, such as telling the reader to use a tab. The chart frame shows its tabs. Put the finding in the sentence.
- Filler openings, such as "As you can see in the chart". Start with the period: "In 2024".
- Unchecked text: typos and stray commas. Check spelling and grammar before a page publishes.

### India-specific rules

- Lakh and crore by default. 1 lakh = 1,00,000. 1 crore = 1,00,00,000. Use Indian digit grouping in full figures: 1,40,00,000.
- The number switch changes every figure on the page, the charts, the tables and the downloads' display labels. "1.4 crore" becomes "14 million". "₹2.5 lakh crore" becomes "₹2.5 trillion". CSV files always hold the plain number with a unit column.
- Put ₹ before the number with no space: ₹93.57.
- Fiscal years: "FY 2026-27" (1 April 2026 to 31 March 2027). Quarters: "Q1 FY 2026-27 (Apr to Jun 2026)". Calendar years stay plain: "2025".
- Survey rounds: the name, the round and the years, "NFHS-5 (2019-21)".
- Index base: "2024=100", with no spaces. GDP base: "base 2022-23".
- Dates: "17 Nov 2026" in labels, "17 November 2026" in text.
- Change in a rate: "percentage points", not "%". Write "rose by 0.4 percentage points", not "rose by 0.4%".
- Hindi: the interface, topic names, chart titles, axis labels, status words and hallmark labels are in Hindi from launch. Use the digits 0 to 9 on Hindi pages too. All Hindi text needs native-speaker review before launch. Draft labels: जनसंख्या (Population), कीमतें (Prices), अर्थव्यवस्था (Economy), रोज़गार (Jobs), स्वास्थ्य (Health), शिक्षा (Education), चुनाव (Elections), जलवायु (Climate), धर्म और संस्कृति (Religion and culture); अनंतिम (Provisional), प्रक्षेपण (Projection), सर्वेक्षण अनुमान (Survey estimate), पद्धति में बदलाव (Method break).
- Name states and UTs as in `research/data/geography.csv`. Say "states and union territories" in full the first time on a page, then "states and UTs".
- Name the publisher in full the first time, with the short name after it: "the National Statistics Office (NSO), MoSPI".

### Words to avoid

These read as AI-written or as marketing. Do not use them in titles, text, buttons or alt text:

"dive into", "deep dive", "explore the data", "unlock", "insights", "at a glance", "comprehensive", "it's worth noting", "landscape", "tapestry", "journey", "delve", "navigate the", "in today's world", "robust", "seamless", "leverage", "empower", "game-changer", "key takeaways", "shed light on", "paint a picture", "a testament to", "rich data", "powerful".

Use plain verbs instead: "see", "compare", "find", "shows", "rose", "fell".

## Open points

1. Confirm the legal position on India's boundary before any outline map or district map.
2. Check each tile's neighbours on the tile grid.
3. Confirm the correction and update targets (2, 7 and 5 working days).
4. Get a native-speaker review of all Hindi labels.
