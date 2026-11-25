# Source discovery

This file sets how we find data sources, and lists the sources we found and do not use yet. It
replaces the "first check" approach in `india-sources.md`, which checked six portal home pages.

Status on 25 Nov 2026: most of phase 1 is done (see the plan at the end). No chart uses these
sources yet.

## Why we missed sources

The audit of Data For India (`reference/data-for-india.md`) found sources that we do not use.
There are three causes.

1. **Topic first.** We chose 9 topics, then looked for a release for each chart. We did not
   research the "Later" topics in `docs/site-spec.md`: Crime, Housing and water, Migration, Trade,
   Poverty and inequality, Transport. NCRB is still under "Not yet checked" in `india-sources.md`.
2. **Home pages, not catalogues.** We checked six portal home pages. We did not list what each
   office releases. MoSPI and ORGI each run a NADA catalogue that lists every survey and report
   series. Data For India links to those catalogue entries more than to any other route.
3. **Release documents only.** We read the release that holds the figure. We did not read the
   method documents, Parliament answers or papers that name the other sources.

Some of the gaps also sit inside our own topics: SRS Cause of Death and CRS (health), the Time Use
Survey (jobs), ASI and ASUSE (economy), and IMD gridded data (climate).

## The process

Do these steps for each topic, and once a quarter for the full site.

1. **Sweep the catalogues.** Run `python3 -I pipeline/common/catalogue_sweep.py --unused`. It
   saves each catalogue page to `raw/catalogues/<date>/` with its sha256, and writes
   `research/catalogues/<catalogue>.csv`. It prints the entries that are new or changed since the
   last snapshot, and the entries that no topic README cites. Each new entry goes in the backlog
   below with a status.
   - MoSPI: `https://microdata.gov.in/NADA/index.php/api/catalog/search?ps=1000`. It returned
     187 surveys on 25 Nov 2026.
   - ORGI: `https://censusindia.gov.in/nada/index.php/api/catalog/search?ps=1000&page=N`, pages 1
     to 41. It returned 40,276 entries on 25 Nov 2026 (31,245 tables, 8,846 documents).
   - Also list: the MoSPI "download reports" page, the NDAP dataset list (by ministry) and the
     data.gov.in catalogue.
2. **List the office's own series.** For each ministry in a topic, read its annual report and its
   statistical yearbook. Note every recurring release: NCRB, MoRTH, CBHI, TRAI, DGCI&S, RBI, CEA,
   IMD, MoE.
3. **Read the method documents.** For each survey we use, read the field instructions and the
   sample design note. Note every other survey or register they name.
4. **Search Parliament answers and PIB.** Search `sansad.in` and `pib.gov.in` by topic. Use these
   to find figures that have no other release, and to find the release a minister cites.
5. **Mine peer sites.** List the outbound links of Data For India, UK by Numbers, Our World in Data
   and others. For each link to a publisher, find the release and log it. Never take the peer's
   figure.
6. **Check each candidate.** For each source, record:
   - whether the publisher gives the figure in a published table, or only as unit-level data
   - the latest period, the cadence and the next release date
   - state coverage, and the breakdowns (sex, rural/urban, age, social group)
   - the licence
   - the page that the source would fill, or the chart it would improve
7. **Log the result.** Each source gets one row in the backlog, with a status: `use`, `later`,
   `rejected` and the reason, or `to check`.

## Rules for sources

These follow the README rule: the site prints the publisher's own digits.

Decided on 25 Nov 2026. The owner decided R1 and R2. A council of three models (GPT 6.2 Sol,
Gemini 4 Neon, Muse Wonder 1.0) gave independent judgements on R3 to R6. Each judgement weighed
trust, accuracy, effort, licence risk and reader value.

### R1. Approved publishers

Use Indian government offices and international bodies: the World Bank, ILO, UNODC, ITU, UNESCO,
DHS, UN, WHO and IMF. Never take a figure from Data For India or any other peer site.

### R2. Non-government data

Do not use IHME, Development Data Lab, CMIE or other private or academic datasets.

### R3. Survey estimates (council: 3 of 3)

- Take survey figures from tables or APIs that an approved publisher releases.
- Do not compute an estimate from unit-level survey data. Publish no figure that needs survey
  weights we applied ourselves.
- Use unit-level files only for internal checks, where their terms allow it.
- If the publisher has no table for a breakdown, leave it out.
- Simple arithmetic on published values is allowed: a growth rate from published levels, or a
  share from published counts. Mark it `derived` and name the inputs. Check it against any
  published equivalent.

### R4. Live dashboards (council: 3 of 3)

- Use a dated release first: an annual report, a PIB release or a Parliament answer.
- Take a dashboard figure only when no dated release gives it.
- Save the raw response. Record the URL, the filters, the fetch time in IST and the sha256.
- Mark the figure `Snapshot`. State the date and time it shows, and the publisher's reference date
  if it gives one.
- Keep each snapshot as a new dated record. Do not update a snapshot in place.
- Do not join snapshots to a series of dated releases without a method break.
- Many dashboards rest on what states report. Say so in "About the data". `Snapshot` does not mean
  that anyone audited the figure.

### R5. IMD gridded data (council: 2 of 3)

GPT and Muse allowed state means with conditions. Gemini rejected them: the 1° temperature grid is
too coarse for small states, and the state boundary file carries legal and political risk. The
rule keeps the state means and adds Gemini's points as conditions.

- Use IMD's published national, subdivision and state tables first. Save IMD's seasonal state
  tables at release, because IMD removes older seasons from its live pages.
- A state mean from an IMD grid is allowed only when no IMD table gives the measure and period.
  Mark it `derived`.
- Name the grid product, its version and resolution, the state boundary file and its date, and
  the weighting method. Publish the code.
- Use an official boundary file. State its source once, on the climate page.
- Do not publish a state mean for a state that covers fewer than 10 grid cells. With the 1°
  temperature grid, this leaves out the small states and UTs.
- Check each state mean against IMD's published state or subdivision figure. State the tolerance
  in the topic README. Do not publish a mean that fails the check.
- Do not ship a map until the map policy in `docs/site-spec.md` is settled.

### R6. International comparisons (council: 3 of 3 on the split rule)

- Use the Indian publisher for a figure about India alone, on topic pages and state profiles.
- Use an international series for India alone only where the Indian publisher has no figure for
  that measure or period. Show a method break where the source changes.
- In a chart that compares countries, take every country, India included, from one international
  series, one release and one period. Name the series, the publisher and the vintage on the chart.
- Where the international figure for India differs from the Indian publisher's figure by a
  material amount, say so in one sentence.
- Mark a modelled series `Modelled estimate`, for example ILO modelled estimates. Mark future
  years `Projection`. Give the UN WPP revision and variant.
- Default countries: Bangladesh, Pakistan, Nepal, Sri Lanka, China and Indonesia, plus the world
  value where the series gives one. GPT and Muse proposed the same six countries. Gemini proposed
  Brazil and the United States as well. Add a country only for a reason, and record the reason in
  the topic README. Never change the countries to change India's rank.
- Record the reuse terms of each international series. They differ: WDI is CC BY 4.0, while
  IMF, ITU and DHS terms are narrower.

### Risks the council raised

- **Revisions at the same URL.** The World Bank, ILO and UN revise whole histories. A checksum of
  today's file does not protect last year's chart. Keep a copy of each vintage we print, with the
  release version on each value.
- **Raw files are not public.** `raw/` is not in git, so a reader cannot check a sha256 after a
  government URL breaks. Archive the raw files (R2, as `docs/build-exploration.md` proposes).
- **Licences.** Our processed CSVs are CC BY 4.0. Some publishers give no licence, and ORGI
  pages say "Rights Reserved". Record the terms of each publisher before we add its data.
- **New status words.** `Snapshot` and `Modelled estimate` need a type in `src/content/types.ts`
  and a test, so that no page drops them.

## Backlog

Step 6 checks done on 25 Nov 2026, from the live publisher pages. "DFI" means that Data For India
uses the source. "API" means the MoSPI eSankhyiki API (`api.mospi.gov.in`). No publisher below
states a reuse licence, except RBI (reproduce "accurately and without modification", with
acknowledgement) and the World Bank (CC BY 4.0 by default). CBHI asks for "duly and prominently"
acknowledged reuse. ORGI and NCRB pages say only "Rights" or "All Rights Reserved".

### Fill our current topics

| Source | Latest release | Tables | States | Status | DFI |
| --- | --- | --- | --- | --- | --- |
| SRS Cause of Death in India | 2022-24, 20 May 2026 (ORGI NADA 47147) | PDF: 2.1A cause groups by sex, 2.1C rural/urban, 2.3A top 10 causes, 3.4A and 3.6A by age, 4.1 specific causes | No. India, EAG and Assam, six zones | `use`. Health: deaths by cause group and sex. No state chart | Yes (2021-23) |
| Vital Statistics of India based on CRS | 2024, 1 Jul 2026 (ORGI NADA 47155) | PDF: Statement 2 level of registration by state, 10 to 12 registered events 2015-24, 26 sex ratio at birth 2017-24 | Yes, and districts | `use`. Population, Health: registration level and sex ratio at birth by state | Yes (2019, 2022) |
| Report on MCCD | 2024, 16 Jul 2026 (ORGI NADA 47157) | PDF: Statement 2.11 share of deaths certified by state, 3.4 cause groups | Yes | `later`. Certified deaths are a biased subset. The certification rate by state is usable | Yes (2022) |
| National Health Profile | 2023 (PDF created 28 Jun 2024) | PDF: 6.2.1 sub-centres, PHCs and CHCs by state | Yes | `later`. Stale, and most tables repeat SRS and Census | Yes |
| NFHS-6 fact sheets | 2023-24, May 2026 | PDF: indicators 76 and 77 overweight, 98 and 99 tobacco | Yes, except Manipur | `use` for tobacco and overweight. No anaemia indicator in the fact sheets | Yes (NFHS-5) |
| Time Use Survey 2024 | Report 28 Mar 2025 | API: 41 indicators, minutes per day by activity, sex, rural/urban, MPCE class | No state filter on the API | `use`. Jobs: paid and unpaid work by sex, 2019 and 2024 | Yes |
| NSS Health, Jan to Dec 2025 | Press note 20 Apr 2026 | Report PDF not yet found. Not on the API | Not confirmed | `later`. Find the report and its tables | No |
| NSS Modular Survey: Education 2025 | Results 26 Aug 2025 | API: 18 indicators, spending per student by level and school type, coaching | Yes, with sex and rural/urban | `use`. Education: household spending on school and college | No |
| CAMS, NSS round 79 | 2022-23, report 9 Oct 2024 | API: 28 indicators, schooling, NEET, internet use, bank accounts, clean cooking fuel, drinking water | Yes, with rural/urban | `use`. Education, and the new living standards topic | Yes |
| Annual Survey of Industries | 2024-25, 4 Nov 2026 | PDF: Statement 3A, 7A state values; Volume I tables 2, 4, 4a. API to 2023-24 only | Yes | `use`. Economy, Jobs: factory jobs and GVA by state | Yes (2022-23) |
| ASUSE | 2025, report 6 May 2026 | API: 40+ indicators, 2021-22 to 2025, with state variants | Yes, with sex and rural/urban | `use`. Economy, Jobs: small firms and their workers | Yes (2023-24) |
| IMD gridded data | 2025 | Grids, not tables | Rule R5 | `later`. Use IMD state tables first (rule R5) | Yes |
| UN international migrant stock | 2024 | Not checked | No | `to check` | Yes |

### New topics

These are the "Later" topics in `docs/site-spec.md`.

| Topic | Source | Latest release | Status | DFI |
| --- | --- | --- | --- | --- |
| Crime and justice | NCRB Crime in India | 2024 | `use`. Confirm the file format and the table numbers. The year page (`ncrb.gov.in/en/crime-in-india-year-wise.html?year=2024`) lists no files in its HTML, even when rendered in a browser (checked 25 Nov 2026). Try the table-contents pages, then the NCRB tables on data.gov.in | Yes (2023) |
| Crime and justice | NCRB Prison Statistics India | 2024 | `use`. Confirm the file format and the table numbers | Yes (2023) |
| Crime and justice | Court pendency by state | Ministry of Law and Justice answers in Parliament (data to 30 Jul 2026); NJDG dashboard as a `Snapshot` only (rule R4) | `use` the Parliament answers | Yes |
| Housing and living standards | HCES 2023-24 | API: MPCE by state, class and social group, item shares, Gini | `use`. Durables and cooking fuel tables `to check` in the final report | Yes |
| Housing and living standards | CAMS 2022-23 | See above | `use` | Yes |
| Housing and living standards | NSS round 76 water, sanitation and housing (2018); Census 2011 housing tables | Not checked | `to check` | No |
| Poverty and inequality | HCES 2023-24; NSS Debt and Investment (2019) | Not checked | `to check` | Partly |
| Transport | MoRTH Road Accidents in India | 2023 PDF found. A 2024 edition is not confirmed on the MoRTH site | `use`. Confirm the edition | Yes |
| Transport | MoRTH Road Transport Year Book | 2019-20 | `later`. Stale | Yes |
| Transport | NSS Household Travel Survey 2025-26 | Catalogued 5 Nov 2026 | `to check` | No |
| Trade | RBI Handbook, balance of payments | 2025-26, 31 Jul 2026, tables 124 to 131, with XLSX | `use` | Yes |
| Trade | DGCI&S tradestat | 2025-26 | `later`. No reuse terms, no download | Yes |
| Money and payments | RBI Payment System Indicators | October 2026, monthly XLSX | `use`. National only | Yes |
| Money and payments | RBI Basic Statistical Returns | June 2026, quarterly | `later`. State tables are only on DBIE, which did not load | Yes |
| International | World Bank WDI API | Updated 11 Nov 2026 | `use`. CC BY 4.0, except third-party series inside WDI | Yes |
| International | ILOSTAT API | Works with no key | `later`. Read the licence in a browser first | Yes |
| Agriculture | NSS Situation Assessment of Agricultural Households; Land and Livestock Holdings (2019) | Not checked | `to check` | No |
| Tourism | NSS Domestic Tourism Expenditure Survey 2025-26 | Catalogued 23 Sep 2026 | `to check` | No |
| Disability | NSS Persons with Disabilities, round 76 (2018) | Not checked | `to check` | No |

### Checks on data we already show

- **PLFS 2022-23, Assam.** Done. NSO confirms the fault. We show no Assam value from that round,
  and the all-India rates show no break. The jobs README has the caution.
- **SRS and CRS deaths.** Open. Compare CRS 2024 registered deaths by state with the SRS
  estimates. Add a caution to the health and population pages if the two sources differ.

## Plan

Each phase ends with the tests passing and a review. A council decides open questions (see the
rules above). It does not wait for the owner.

1. **Process.** Done on 25 Nov 2026: `pipeline/common/catalogue_sweep.py`, the first catalogue
   snapshots, the step 6 checks on the backlog, and the PLFS Assam check. Still to do: the rows
   marked `to check`, and an archive of the raw files. The `Snapshot` and `Modelled estimate` status
   words come with the first chart that needs each one (court pendency, an international
   comparison), because the How we check page gives a real figure for every status word.
2. **Fill current topics.** Next. All of these have status `use`: SRS Cause of Death 2022-24, CRS
   2024, NFHS-6 tobacco and overweight, the Time Use Survey 2024, the Education survey 2025, ASI
   2024-25 and ASUSE 2025. They add charts to pages that already exist, and the state profiles get
   new rows.
3. **New topic: Crime and justice.** It uses NCRB Crime in India 2024, Prison Statistics India
   2024 and the court pendency answers in Parliament. All give state tables.
4. **New topic: Housing and living standards.** It uses HCES 2023-24 and CAMS 2022-23.
5. **Further topics.** Transport, Trade, and Money and payments, in that order. Then Agriculture,
   Tourism and Disability.
