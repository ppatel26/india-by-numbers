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
| SRS Cause of Death in India | 2022-24, 20 May 2026 (ORGI NADA 47147) | PDF: 2.1A cause groups by sex, 2.1C rural/urban, 2.3A top 10 causes, 3.4A and 3.6A by age, 4.1 specific causes | No. India, EAG and Assam, six zones | `in use`: `causes-of-death`, `top-causes-of-death` (with 2021-23) | Yes (2021-23) |
| Vital Statistics of India based on CRS | 2024, 1 Jul 2026 (ORGI NADA 47155) | PDF: Statement 2 level of registration by state, 10 to 12 registered events 2015-24, 26 sex ratio at birth 2017-24 | Yes, and districts | `in use`: `registration-of-births-and-deaths-by-state`, `sex-ratio-of-registered-births-by-state` | Yes (2019, 2022) |
| Report on MCCD | 2024, 16 Jul 2026 (ORGI NADA 47157) | PDF: Statement 2.11 share of deaths certified by state, 3.4 cause groups | Yes | `later`. Certified deaths are a biased subset. The certification rate by state is usable | Yes (2022) |
| National Health Profile | 2023 (PDF created 28 Jun 2024) | PDF: 6.2.1 sub-centres, PHCs and CHCs by state | Yes | `later`. Stale, and most tables repeat SRS and Census | Yes |
| NFHS-6 fact sheets | 2023-24, May 2026 | PDF: indicators 76 and 77 overweight, 98 and 99 tobacco | Yes, except Manipur | `in use`: `tobacco-use-by-state`, `overweight-by-state`. No anaemia indicator in the fact sheets | Yes (NFHS-5) |
| Time Use Survey 2024 | Report 28 Mar 2025 | API: 41 indicators, minutes per day by activity, sex, rural/urban, MPCE class | No state filter on the API | `in use`: `time-use-paid-unpaid-work`, `time-use-participation`, `women-unpaid-work-by-state` (state tables from the report) | Yes |
| NSS Health, Jan to Dec 2025 | Press note 20 Apr 2026 | Report PDF not yet found. Not on the API | Not confirmed | `later`. Find the report and its tables | No |
| NSS Modular Survey: Education 2025 | Results 26 Aug 2025 | API: 18 indicators, spending per student by level and school type, coaching | Yes, with sex and rural/urban | `in use`: `school-spending-by-level-and-type`, `school-spending-by-state`, `government-school-share-by-state`, `private-coaching-by-state` | No |
| CAMS, NSS round 79 | 2022-23, report 9 Oct 2024 | API: 28 indicators, schooling, NEET, internet use, bank accounts, clean cooking fuel, drinking water | Yes, with rural/urban | `in use`: `mean-years-of-schooling-by-state`. Internet use, ICT skills, bank accounts, assets, clean fuel, drinking water and latrines are in `research/data/living-standards/` (not on the site yet) | Yes |
| Annual Survey of Industries | 2024-25, 4 Nov 2026 | PDF: Statement 3A, 7A state values; Volume I tables 2, 4, 4a. API to 2023-24 only | Yes | `in use`: `factory-jobs-and-gva` (2008-09 to 2024-25), `factory-jobs-by-state` | Yes (2022-23) |
| ASUSE | 2025, report 6 May 2026 | API: 40+ indicators, 2021-22 to 2025, with state variants | Yes, with sex and rural/urban | `in use`: `small-firm-workers-by-state`, `small-firms-india` | Yes (2023-24) |
| IMD gridded data | 2025 | Grids, not tables | Rule R5 | `later`. Use IMD state tables first (rule R5) | Yes |
| UN DESA International Migrant Stock | 2024 (XLSX, files of 27 Jan and 7 Feb 2025) | Origin file Table 1: emigrants by sex, 1990-2024; destination and origin file Table 1: by destination country | No | `use`. Population: Indians living abroad, by destination. CC BY 3.0 IGO | Yes |

### New topics

These are the "Later" topics in `docs/site-spec.md`.

| Topic | Source | Latest release | Status | DFI |
| --- | --- | --- | --- | --- |
| Crime and justice | NCRB Crime in India | 2024 (release date not stated by NCRB). PDF volumes, found through the English view of the year page (`pipeline/crime/ncrb_files.mjs`) | `data ready` in `research/data/crime/`: crime rate, murder, crimes against women, charge-sheeting and conviction by state; India from 1981. 2024 is a method break (BNS from 1 Jul 2024) | Yes (2023) |
| Crime and justice | NCRB Prison Statistics India | 2024, revised with West Bengal data (file dated 15 Sep 2026) | `data ready`: occupancy and undertrial share by state; India 2014-2024 | Yes (2023) |
| Crime and justice | Court pendency by state | Lok Sabha and Rajya Sabha answers of the Ministry of Law and Justice, 31 Dec 2021 to 2025 and 8 other dates. The DoJ compilation PDF returned HTTP 403 | `data ready`: district courts by state; 25 High Courts and the Supreme Court | Yes |
| Housing and living standards | HCES 2023-24 | API: MPCE by state, class and social group, item shares, Gini. Final report (NSS Report 592, 30 Jan 2025) checked 25 Nov 2026: no table on possession of durable goods and no table on cooking fuel, only the share of spending on durable goods. CAMS Table 22 (phone, computer) and Table 25 (clean fuel) fill part of the gap | `use`: data in `research/data/living-standards/` (not on the site yet) | Yes |
| Housing and living standards | CAMS 2022-23 | See above | `use` | Yes |
| Housing and living standards | NSS round 76, Report 584, water, sanitation, hygiene and housing (Jul to Dec 2018) | API (NSS76C, 12 indicators, state and rural/urban); PDF Statements 2.1, 3.1, 6.1, 12.1, 25.2 | `use`: improved drinking water (same definition as CAMS) in `research/data/living-standards/`. The API swaps Tripura and Uttarakhand in indicator 16; the CSV uses Statement 6.1. Cooking fuel, latrine and house type do not match CAMS or HCES | No |
| Housing and living standards | Census 2011 houselisting tables (HL-14 amenities and assets, HL-06 water, HL-07 lighting) | XLSX per district on the ORGI catalogue. No all-population state file found yet | `use`. Find the state-level table IDs first | Partly |
| Poverty and inequality | HCES 2023-24 | See above | `use` | Yes |
| Poverty and inequality | NSS round 77, Report 588, Debt and Investment Survey 2019 | 10 Sep 2021 (press note). PDF only, 1,919 pages: Summary Statements 2, 7, 8 and 10 by state, read from the layout text and checked against Statements 3.8, 3.12, 3.15 and the press note (`pipeline/living-standards/build_aidis.py`). Values as on 30 June 2018 | `in use` (Living standards): `household-debt-by-state`, `household-assets-and-debt`, `household-debt-by-lender`, `household-debt-by-interest-rate`, and 1 state-profile row. Statements 3 (social group), 4 (assets held) and 11 to 15 not read | Partly |
| Transport | MoRTH Road Accidents in India | 2024 edition on the MoRTH site (release date not stated by MoRTH; PDF last changed 15 Jun 2026), found through the MoRTH documents API (`pipeline/transport/morth_reports.mjs`). Read from PDF word boxes | `data ready` in `research/data/transport/`: accidents, deaths, injuries, rates per lakh and severity by state (2023, 2024); India 1970-2024; deaths by road user (India 2023-24, states 2024); helmet and seat-belt non-use by state (2024). West Bengal 2024 recast from e-DAR totals | Yes |
| Transport | MoRTH Road Transport Year Book | 2019-20 | `later`. Stale | Yes |
| Transport | NSS Household Travel Survey 2025-26 | Fact sheet and press note, 5 Oct 2026. Tables 1 to 7, Appendix A Tables 1 to 5 and Appendix B RSE Tables 1 to 4 (XLSX). No full report yet, and no trip distance table | `data ready`: mode to work and to education by state, sector and sex, with RSE; share travelling 1 km or more; overnight trips (India) | No |
| Trade | RBI Handbook, balance of payments, foreign trade and reserves | 2025-26, 31 Jul 2026: Tables 111 to 131, 144 and 241. The XLSX links (rbidocs) serve a bot check to scripts; the HTML tables on www.rbi.org.in load | `data ready` in `research/data/trade-payments/`: current account and parts 1996-97 to 2025-26, current account to GDP from 1987-88, BPM6 detail 2022-23 to 2025-26, trade from 1987-88, commodities and partners, reserves from 1968-69. National only | Yes |
| Trade | DGCI&S tradestat | 2025-26 | `later`. No reuse terms, no download | Yes |
| Money and payments | RBI Payment System Indicators | October 2026 (release date not stated). 65 monthly releases from June 2021, read as HTML (`PSIUserView.aspx?Id=1` to `65`) | `data ready` in `research/data/trade-payments/`: UPI, NEFT, RTGS, IMPS, cards and other systems, June 2020 to October 2026, and cards, ATMs and PoS terminals. National only | Yes |
| Money and payments | RBI Basic Statistical Returns | June 2026, quarterly | `later`. State tables are only on DBIE, which did not load | Yes |
| International | World Bank WDI API | Updated 11 Nov 2026 | `use`. CC BY 4.0, except third-party series inside WDI | Yes |
| International | ILOSTAT API | Works with no key | `use` for comparisons only (rule R6). CC BY 4.0 for datasets since 3 May 2023. Its India rows are ILO's own processing of PLFS unit-level data, so for India alone use MoSPI | Yes |
| Agriculture | NSS round 77, Report 587, Situation Assessment of Agricultural Households and Land and Livestock Holdings, 2019 | API (NSS77, 33 indicators, including income and loans); PDF Statements and detailed tables 1 to 49. API indicator 33 (loans) repeats Andhra Pradesh under every state, so debt and loans come from the report, checked against Table 29 | `in use` in Agriculture (8 charts) from `research/data/agriculture/`: income by source by state and land size (2018-19), debt and loan sources by state (2019), land possessed by size class (2018), operational holdings 2002-03 to 2018-19. Rural agricultural households only | No |
| Agriculture | Ministry of Agriculture and Farmers Welfare, Agricultural Statistics at a Glance 2024-25 | Preface 8 Jul 2025 (release date not stated; PDF changed 18 Feb 2026). PDF tables: area, production and yield of rice, wheat and pulses, India 1950-51 to 2024-25 (Tables 2.4(a), 2.5(a), 2.10(a)), yield by state 2005-06 to 2024-25 (2.31, 2.32, 2.35), major states 2023-24 and 2024-25 (2.4(b), 2.5(b), 2.10(b)) | `data ready`: the second agriculture source, with a time series. Reuse needs permission by email (desagri.gov.in Website Policies) | No |
| Agriculture | Agriculture Census (operational holdings by size class) | 2015-16 is the latest on the census portal on 25 Nov 2026. The 2021-22 census was launched; no results on the portal | `data ready` for India 2005-06 to 2015-16 through ASG Table 5.1. `later` for state tables and 2021-22 | No |
| Tourism | NSS Report 597, Domestic Tourism in India (Jul 2025 to Jun 2026) | 23 Sep 2026 (press note and MoSPI release list): Statements 3.1, 3.2, 3.13, 3.15, 3.16, 3.19; Appendix A Tables 1, 15, 19 (XLSX). Not on the API | `in use` in Transport: `overnight-trip-households-by-state` (derived from Table 1, checked against Statement 3.1), `overnight-trips-by-purpose`, `overnight-trip-spending-by-purpose`, `overnight-trip-spending-by-item`. Same-day trips by state (Statement 3.16) are in `research/data/transport/`, not charted | No |
| Disability | NSS round 76, Report 583, Persons with Disabilities (Jul to Dec 2018) | API (NSS76, survey code 1, 13 indicators, state, sex, rural/urban); PDF Tables 1.2, 4.1, 32.1 and RSE1 | `in use` (Health): `disability-by-state`, `disability-by-type`, `disability-aid-received`, `disability-government-aid-by-state`. All 4,527 API values match the report. Certificate (Statement 32.2) and work (Statement 35) are report-only and not used yet | No |

### Checks on data we already show

- **PLFS 2022-23, Assam.** Done. NSO confirms the fault. We show no Assam value from that round,
  and the all-India rates show no break. The jobs README has the caution.
- **SRS and CRS deaths.** Done. ORGI's CRS level of registration is this comparison: each 2024
  estimate is the state's SRS rate times its mid-year population. Registered deaths are far below
  the estimate in Nagaland (26.8%), Arunachal Pradesh and Jharkhand, and far above it in
  Chandigarh and Delhi. The health README has the caution, and the registration chart says it.

## Plan

Each phase ends with the tests passing and a review. A council decides open questions (see the
rules above). It does not wait for the owner.

1. **Process.** Done on 25 Nov 2026: `pipeline/common/catalogue_sweep.py`, the first catalogue
   snapshots, the step 6 checks on the backlog, and the PLFS Assam check. Still to do: the rows
   marked `to check` (done the same day; the HCES durables tables on 25 Nov 2026: none), and an archive of the
   raw files. The `Snapshot` and `Modelled estimate` status
   words come with the first chart that needs each one (court pendency, an international
   comparison), because the How we check page gives a real figure for every status word.
2. **Fill current topics.** Done on 25 Nov 2026: 18 charts and 9 state-profile rows from SRS
   Cause of Death 2021-23 and 2022-24, CRS 2024, NFHS-6 tobacco and overweight, the Time Use Survey
   2019 and 2024, the Education survey 2025, CAMS 2022-23, ASI 2024-25 and ASUSE 2025. Each chart
   carries its own check date.
3. **New topic: Crime and justice.** Done on 25 Nov 2026: 10 charts from NCRB Crime in India 2024,
   Prison Statistics India 2024 and the court pendency answers in Parliament. Recorded-crime tables
   carry no rank. The object (a silver tarazu) waits for the owner's approval of image credits.
4. **New topic: Living standards.** Done on 25 Nov 2026: 10 charts from HCES 2022-23 and 2023-24,
   CAMS 2022-23 and NSS round 76. The object (a silver tiffin carrier) also waits.
5. **Further topics.** Done on 25 Nov 2026: Trade (8 charts, RBI Handbook 2025-26, India only),
   Transport (10 charts, MoRTH Road Accidents in India 2024 and the NSS Household Travel Survey
   2025-26), and a Digital payments part in Economy (3 charts, RBI Payment System Indicators).
   Money and payments waits for state banking tables (RBI Basic Statistical Returns).
6. **Next.** The council placed each source (25 Nov 2026):
   - Domestic tourism (NSS Report 597): a part in Transport, 3 of 3. Done on 25 Nov 2026: 4 charts and 1 state-profile row.
   - Disability (NSS Report 583): a part in Health, 3 of 3. Done on 25 Nov 2026: 4 charts and 1 state-profile row.
   - UN migrant stock: a part in Population, 3 of 3, linked from the remittances chart in Trade. Done on 25 Nov 2026: 2 charts.
   - World Bank WDI: comparison charts inside existing topics, 3 of 3. First five, by votes: GDP
     per person at PPP (Economy), life expectancy (Health), fertility rate (Population), CO2 per
     person (Climate), women's labour force participation, ILO modelled (Jobs). Done on 25 Nov 2026:
     5 charts, one WDI release (11 Nov 2026), one country panel, and the `Modelled estimate` status word.
   - Farm households (NSS Report 587): a new Agriculture topic, 2 of 3 (Muse voted to wait for a
     second agriculture source). It comes after the parts, with its own design council. Data ready on
     25 Nov 2026 in `research/data/agriculture/`, with Agricultural Statistics at a Glance 2024-25 as
     the second source. Done on 25 Nov 2026 with the NSS charts only: 8 charts and 3 state-profile
     rows. The crop charts wait for the ministry's permission.
   - Debt and investment (NSS Report 588): a part in Living standards, last, because the tables are
     only in a 1,919-page PDF. Done on 25 Nov 2026: 4 charts and 1 state-profile row. A sample of
     Statements 2, 7, 8 and 10 read cleanly, so the build reads all 36 states and UTs of each.
