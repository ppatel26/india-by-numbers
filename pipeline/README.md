# Pipeline

The scripts in this folder made the CSVs in [`research/data/`](../research/data/). Some scripts
download publisher files. The other scripts convert those files to CSVs. Each topic README in
`research/data/<topic>/` names the release, the URL and the sha256 of each raw file.

Do not keep raw downloads in the repository. The URL and the sha256 in each topic README identify
each file.

## Downloads are untrusted data

- Keep downloads in `raw/<topic>/`. Keep text extracted from them in `work/<topic>/`. Git ignores both
  folders.
- Run every Python script with `python3 -I`. Isolated mode stops Python from loading modules from the
  current folder or the script folder, so a planted file such as `json.py` cannot run.
- Run the scripts from the repository root. Do not run them from inside `raw/`.
- The scripts read downloads only as data. No script runs code from a download. The exception is
  `common/text.mjs`, which loads a publisher page in headless Chromium.
- The scripts identify themselves as `IndiaByNumbers/1.0 (+https://indiabynumbers.org/about/)`. If a
  publisher blocks automated access, stop. Download the file by hand from the publisher's page and
  record its sha256 in the topic README.

## Requirements

- Python 3.11 or later, with `openpyxl` and `xlrd` (`python3 -m pip install openpyxl xlrd`).
- `pdftotext` from Poppler (`brew install poppler` or `apt install poppler-utils`).
- `curl`.
- Node and the repository dependencies (`pnpm install`), for `common/text.mjs` only.

## Run a topic

1. Download the files listed in the topic README into `raw/<topic>/`, with the folder layout shown in
   its "Raw files" table. The fetch scripts below do this for the API and form sources.
2. If the topic reads PDFs, extract their text:

   ```sh
   pipeline/<topic>/extract_text.sh --raw raw/<topic> --work work/<topic>
   ```

3. Build the CSVs:

   ```sh
   python3 -I pipeline/<topic>/<script>.py --raw raw/<topic> --out research/data/<topic>
   ```

Every builder has defaults: `--raw raw/<topic>`, `--work work/<topic>` and `--out research/data/<topic>`.
Builders that need state names read `--geo research/data/geography.csv`. Use `--help` to see the
options of a script.

Exceptions:

- `prices/build_prices_economy.py` writes two topics. It takes `--raw-prices`, `--raw-economy`,
  `--out-prices` and `--out-economy`.
- `education/build_education.py` also reads the PLFS report text from `--jobs-work work/jobs`. Run
  `pipeline/jobs/extract_text.sh` first.
- `international/fetch.sh` takes `--raw` only. `international/build_international.py` reads the UN DESA workbooks with `openpyxl`.
- `transport/fetch.sh` reads its URLs from `transport/sources.tsv`, in the same way as `crime/fetch.sh`.
  `transport/build_tourism.py` needs only `fetch.sh tourism/` and `extract_text.sh tourism/`.
- `crime/fetch.sh` reads its URLs from `crime/sources.tsv`. Give a path prefix to fetch part of the list, for example `pipeline/crime/fetch.sh pendency/`.
- `parse_d33.py`, `check_d33.py` and `parse_proj.py` take file paths. The `extract_text.sh` script of
  their topic runs them.

### Order of steps

Some CSVs were made in more than one step. Run the steps in this order:

| CSV | Steps |
| --- | --- |
| `prices/cpi-inflation-by-state.csv` | `build_prices_economy.py`, then `add_sep2026_states.py`, then `extend_jan_aug2026_states.py --write` (once only) |
| `economy/usd-inr-daily-2026.csv` | `build_prices_economy.py`, then `refresh_fetch_rates.py` and `refresh_append_rates.py` (adds 18 Nov 2026) |
| `climate/installed-capacity-*.csv`, `climate/non-fossil-*.csv` | `extract_text.sh`, then `parse_cea.py`, then `build_cea.py` |

## Scripts

| Script | CSVs written | Publisher |
| --- | --- | --- |
| `common/fetch.sh` | None. Downloads one file and logs URL and sha256 to `<raw>/_log.tsv` | Any |
| `common/fetch_api.py` | None. Downloads every page of a MoSPI API query | MoSPI (eSankhyiki API) |
| `common/fetch_batch.py` | None. Downloads a list of URLs, one folder each | Any |
| `common/text.mjs` | None. Saves the rendered HTML of a page with Playwright | PIB, RBI |
| `common/gunzip.py` | None. Decompresses pages that were saved gzipped | Any |
| `common/catalogue_sweep.py` | `research/catalogues/mospi-microdata.csv`, `research/catalogues/orgi-census.csv`. Lists every survey and report in each catalogue, marks the ones a topic README cites, and prints what is new since the last sweep (`research/source-discovery.md`) | MoSPI, ORGI (NADA catalogues) |
| `common/state_languages.py` | `state-languages.csv` (values entered by hand, with a source per row) | State and UT governments, Commissioner for Linguistic Minorities |
| `prices/fetch_cpi12.py` | None. Downloads CPI base 2012, one month per request | MoSPI |
| `prices/build_prices_economy.py` | `prices/`: `cpi-inflation-monthly`, `cpi-inflation-rural-urban`, `inflation-target`, `cpi-inflation-by-state` (October 2026), `cpi-inflation-by-division-2026`, `cpi-inflation-by-division-latest`, `cpi-inflation-by-group-2012-base`, `repo-rate`, `cpi-annual-inflation-long-run`. `economy/`: `gdp-growth-quarterly`, `gdp-growth-annual`, `gva-sector-shares`, `per-capita-nsdp-by-state`, `gsdp-growth-by-state`, `iip-growth-monthly`, `usd-inr-annual`, `usd-inr-daily-2026` | MoSPI, RBI |
| `prices/add_sep2026_states.py` | `cpi-inflation-by-state` (adds September 2026) | MoSPI |
| `prices/extend_jan_aug2026_states.py` | `cpi-inflation-by-state` (adds January to August 2026) | MoSPI |
| `prices/extract_text.sh`, `prices/cfpi_sources.tsv` | None. Text of the CFPI press releases, and their URLs for `fetch_batch.py` | MoSPI, PIB |
| `prices/cfpi_2026.py` | `cfpi-inflation-2026` | MoSPI, PIB |
| `economy/refrate.py` | None. Posts the RBI reference rate archive form | RBI (FBIL rates) |
| `economy/refresh_fetch_rates.py` | None. Fetches the 17 and 18 Nov 2026 rates | RBI (FBIL rates) |
| `economy/refresh_append_rates.py` | `usd-inr-daily-2026` (adds 18 Nov 2026) | RBI (FBIL rates) |
| `economy/build_asi.py` | `asi-factory-sector-india`, `asi-by-state-2024-25`. Reads the ASI Summary Results text and the eSankhyiki ASI API pages (fetched with `common/fetch_api.py`) | MoSPI (ASI) |
| `economy/build_asuse.py` | `asuse-by-state-2025`, `asuse-india-rounds`. Reads the eSankhyiki ASUSE API pages (fetched with `common/fetch_api.py`), and checks them against the report and press note text | MoSPI (ASUSE) |
| `population/extract_text.sh`, `population/parse_proj.py` | None. SRS text, and Table 8 of the projections report | ORGI, MoHFW |
| `population/build_population.py` | `population-census-1901-2011`, `population-by-state-2011`, `urban-share-by-state-2011`, `population-pyramid-2011`, `population-projections-2011-2036`, `tfr-by-state-2019-2024`, `sex-ratio-at-birth-by-state`, `birth-death-rates-by-state-2024` | ORGI (Census, SRS), MoHFW |
| `religion-culture/build_religion.py` | `religion-india-2011`, `religion-by-state-2011`, `religion-india-2001-2011`, `languages-india-2011`, `languages-top3-by-state-2011` | ORGI (Census) |
| `jobs/fetch_plfs.py` | None. Downloads PLFS series from the eSankhyiki API | MoSPI |
| `jobs/extract_text.sh` | None. Text of the PLFS reports and bulletins | MoSPI |
| `jobs/build_jobs.py` | `jobs-lfpr-by-state-2025`, `jobs-unemployment-by-state-2025`, `jobs-lfpr-wpr-ur-annual`, `jobs-youth-unemployment-annual`, `jobs-employment-status`, `jobs-employment-by-industry`, `jobs-unemployment-quarterly`, `jobs-monthly-lfpr-wpr-ur` | MoSPI (PLFS) |
| `jobs/fetch_tus.sh` | None. Downloads the TUS 2019 and 2024 reports and three eSankhyiki TUS queries, and extracts the report text | MoSPI (Time Use Survey) |
| `jobs/build_tus.py` | `jobs-time-use-india`, `jobs-time-use-by-state-2024`. Checks the API against the report tables | MoSPI (Time Use Survey) |
| `education/extract_text.sh` | None. Text of the UDISE+ booklets, the AISHE reports and the NSS reports 595 and 590 | Ministry of Education, MoSPI |
| `education/fetch_nss.py` | None. Downloads NSS indicators (rounds 76, 79 and 80) from the eSankhyiki API, one JSON file per indicator | MoSPI |
| `education/build_education.py` | `education-ger-school-by-state`, `education-dropout-by-state`, `education-ptr-by-state`, `education-school-facilities-by-state`, `education-school-trend-india`, `education-higher-ed-ger-by-state`, `education-higher-ed-ger-india`, `education-literacy-by-state` | Ministry of Education (UDISE+, AISHE), MoSPI (PLFS), ORGI (Census) |
| `education/build_cmse.py` | `education-spending-per-student`, `education-school-type-by-state`, `education-private-coaching`, `education-mean-years-schooling-by-state`. Checks the API values against the report tables | MoSPI (NSS: CMS: Education 2025, CAMS 2022-23) |
| `living-standards/fetch_hces.py` | None. Downloads the nine HCES indicators from the eSankhyiki API, one JSON file per indicator. NSS rounds 79 and 76 use `education/fetch_nss.py` | MoSPI (HCES) |
| `living-standards/extract_text.sh` | None. Text of NSS Reports 592, 591 (HCES), 590 (CAMS), 584 (NSS round 76) and 588 (AIDIS), and the AIDIS press note | MoSPI |
| `living-standards/build_living_standards.py` | `mpce-by-state`, `mpce-india-rounds`, `mpce-item-shares-india-rounds`, `food-share-by-state`, `gini-mpce`, `internet-and-ict-skills-by-state`, `bank-account-by-state`, `household-amenities-by-state`, `household-assets-by-state`. Checks every API value against the report tables | MoSPI (HCES 2022-23 and 2023-24, CAMS 2022-23, NSS round 76) |
| `living-standards/build_aidis.py` | `household-assets-and-debt-by-state`, `household-assets-and-debt-india`, `indebtedness-by-credit-agency-by-state`, `debt-by-credit-agency-by-state`, `debt-by-credit-agency-india`, `debt-by-interest-rate-by-state`. Reads Summary Statements 2, 7, 8 and 10 of Report 588; checks them against each other, against Statements 3.8, 3.12 and 3.15 and the press note, and writes nothing if a check fails | MoSPI (AIDIS 2019, NSS round 77) |
| `health/extract_text.sh` | None. Text of the SRS, MMR, life table, cause of death, CRS, NFHS-5, NFHS-6 and NHA reports, and NSS Report 583 | ORGI, IIPS, MoHFW, MoSPI |
| `health/build_health.py` | `imr-india-1971-2024`, `imr-by-state-2024`, `mmr-india-1997-2024`, `mmr-by-state-2022-24`, `life-expectancy-india-1970-2024`, `life-expectancy-by-state-2020-24`, `nfhs-key-indicators-by-state`, `out-of-pocket-health-spending`, `child-mortality-by-state-2024` | ORGI (SRS), IIPS and MoHFW (NFHS), PIB, MoHFW and NHSRC (NHA) |
| `health/build_crs.py` | `crs-registration-level-by-state-2024`, `crs-sex-ratio-at-birth-by-state` | ORGI (CRS) |
| `health/build_srs_cod.py` | `srs-causes-of-death-india` | ORGI (SRS) |
| `health/build_nfhs_adult.py` | `nfhs-adult-indicators-by-state` | IIPS and MoHFW (NFHS-6), IIPS and ICF (NFHS-5 report) |
| `health/build_disability.py` | `disability-by-state-2018`, `disability-by-type-2018`, `disability-aid-received-2018`. Reads the eSankhyiki NSS round 76 pages (survey code 1, fetched with `education/fetch_nss.py`) and checks every value against the tables of NSS Report 583 | MoSPI (NSS round 76) |
| `crime/fetch.sh`, `crime/sources.tsv` | None. Downloads every NCRB report and Parliament answer the crime topic reads, with `common/fetch.sh` | NCRB, Lok Sabha, Rajya Sabha |
| `crime/ncrb_files.mjs` | None. Lists the files of an NCRB year page in English (the site serves Hindi by default) | NCRB |
| `crime/find_answers.py` | None. Lists Ministry of Law and Justice answers and their files, from the Lok Sabha eLibrary or the Rajya Sabha question list | Lok Sabha, Rajya Sabha |
| `crime/extract_text.sh` | None. Text of the Crime in India, Prison Statistics India and Parliament answer PDFs | NCRB, Ministry of Law and Justice |
| `crime/build_ncrb.py` | `crime-by-state-2024`, `crime-india-trend`, `ipc-crimes-india-1981-2024`, `murder-by-state-2024`, `crimes-against-women-by-state-2024`, `police-and-court-disposal-by-state-2024`, `prisons-by-state-2024`, `prisons-india-trend` | NCRB (Crime in India, Prison Statistics India) |
| `crime/build_pendency.py` | `court-pendency-district-by-state`, `court-pendency-high-courts` | Ministry of Law and Justice (answers in the Lok Sabha and Rajya Sabha, citing NJDG) |
| `transport/fetch.sh`, `transport/sources.tsv` | None. Downloads the MoRTH reports, the NHTS fact sheet, press note and workbooks, and NSS Report 597 with its press note and Appendix A Tables 1, 15 and 19, with `common/fetch.sh`. Give a path prefix to fetch part of the list, for example `tourism/` | MoRTH, MoSPI |
| `transport/morth_reports.mjs` | None. Lists the documents in one group of the MoRTH reports page and saves the app's JSON responses (the site is a JavaScript app in Hindi) | MoRTH |
| `transport/extract_text.sh` | None. Layout text and word boxes of the MoRTH, NHTS and DTES PDFs. Takes a path prefix, as `fetch.sh` does | MoRTH, MoSPI |
| `transport/build_transport.py` | `road-accidents-by-state`, `road-accidents-india-1970-2024`, `road-deaths-by-road-user`, `road-deaths-helmet-seatbelt-by-state`, `travel-mode-by-state-2025-26`, `travel-trip-share-by-state-2025-26`, `travel-india-fact-sheet-2025-26`. Reads the MoRTH tables from word boxes; checks the RAI 2024 values for 2023 against RAI 2023 | MoRTH (Road Accidents in India 2024 and 2023), MoSPI (NHTS 2025-26) |
| `transport/build_tourism.py` | `tourism-households-by-state-2025-26`, `tourism-india-2025-26`. Reads Appendix A Tables 1, 15 and 19 (XLSX) and Statements 3.1, 3.2, 3.13, 3.15, 3.16 and 3.19 from the report text by position. Derives the State/UT share of households with an overnight trip, and stops if a checked value or a cross-table check differs | MoSPI (NSS Report 597, Domestic Tourism Expenditure Survey 2025-26) |
| `agriculture/extract_text.sh` | None. Text of NSS Report 587 and Agricultural Statistics at a Glance 2024-25. NSS round 77 uses `education/fetch_nss.py` | MoSPI, Ministry of Agriculture and Farmers Welfare |
| `agriculture/build_nss77.py` | `agri-household-income-by-source`, `agri-household-debt`, `agri-household-loans-by-source`, `land-possessed-by-size-class`, `operational-holdings-nss`. Checks the report statements against the API (indicators 16, 24, 25) and against Table 29 (API indicator 33 is faulty); stops on any difference | MoSPI (NSS round 77) |
| `agriculture/build_asg.py` | `crop-area-production-yield-india`, `crop-yield-by-state`, `crop-production-by-state`, `operational-holdings-agriculture-census`. Stops if a cross-table check fails | Ministry of Agriculture and Farmers Welfare (Agricultural Statistics at a Glance 2024-25, with the Agriculture Census 2015-16) |
| `science-technology/fetch.sh`, `science-technology/sources.tsv` | None. Downloads the IP India annual reports and copyright policy, and the DST NSTMIS and TRAI files that wait for permission, with `common/fetch.sh`. Give a path prefix to fetch part of the list, for example `ipindia/` | IP India, DST, TRAI |
| `science-technology/extract_text.sh` | None. Layout text and reading-order text (`pdftotext -raw`) of each PDF. Takes a path prefix | IP India, DST, TRAI |
| `science-technology/build_patents.py` | `patent-applications`, `patents-granted-and-in-force`, `patent-applications-by-state`, `patent-applications-by-applicant-type`, `patents-by-field`. Reads the 2024-25 and 2022-23 reports' reading-order text; holds the 2014-15 Appendix C and D values as transcribed from the scan's page images. Checks overlapping years across reports and every table's sums, and stops on a difference other than the known ones | IP India (CGPDTM Annual Reports 2024-25, 2022-23, 2014-15) |
| `defence/fetch.sh`, `defence/sources.tsv` | None. Downloads RBI Handbook Table 89, Internet Archive copies of the PIB defence releases and the PIB copyright policy (pib.gov.in refuses scripts), and two PIB backgrounder PDFs, with `common/fetch.sh` | RBI, PIB |
| `defence/build_defence.py` | `defence-spending-1987-2027`, `defence-exports`, `defence-budget-split-2026-27`. Checks Table 89's sums and printed values, each export release's parts and the overlap between releases, and the budget shares | RBI (Handbook Table 89), PIB (Ministry of Defence) |
| `trade-payments/fetch_handbook.sh` | None. Saves the RBI Handbook 2025-26 HTML tables (58, 111 to 131, 143, 144, 241), its Notes on Tables and the RBI website policy page, with `common/fetch.sh` | RBI |
| `trade-payments/fetch_psi.py` | None. Posts the Payment System Indicators archive form and saves all 65 monthly releases as HTML | RBI |
| `trade-payments/build_trade_payments.py` | `current-account-annual`, `bop-indicators-annual`, `bop-bpm6-annual`, `merchandise-trade-annual`, `merchandise-trade-by-commodity`, `merchandise-trade-by-partner`, `forex-reserves-end-march`, `payments-monthly`, `payments-annual`, `payment-infrastructure-monthly`. Stops if a checked value or a cross-table check differs | RBI (Handbook, Payment System Indicators), DGCI&S (trade tables in the Handbook) |
| `international/fetch.sh` | None. Downloads nine World Bank WDI series for one panel of countries, with their metadata, the WPP 2024 and ILOSTAT files used as checks, and the two UN DESA migrant stock workbooks, with `common/fetch.sh` | World Bank (WDI), UN DESA, ILO |
| `international/build_international.py` | `wdi-gdp-per-person-ppp`, `wdi-life-expectancy`, `wdi-fertility-rate`, `wdi-co2-per-person`, `wdi-women-labour-force-participation`, `wdi-rd-spending`, `wdi-researchers-per-million`, `wdi-journal-articles`, `wdi-armed-forces-share-of-labour-force`, `migrants-from-india-1990-2024`, `migrants-from-india-by-destination`. Stops if a checked value, a licence, the WDI update date, the WPP 2024 or ILOSTAT comparison, or the UN DESA totals differ | World Bank (WDI), UN DESA (International Migrant Stock 2024) |
| `climate/extract_text.sh`, `climate/parse_cea.py` | None. Text and word boxes of the CEA and MNRE PDFs, and the CEA totals | CEA, MNRE |
| `climate/build_rain.py` | `monsoon-rainfall-all-india-1901-2026` | IMD Pune |
| `climate/build_subdiv.py` | `monsoon-2026-by-subdivision` (values transcribed from an IMD table image) | IMD |
| `climate/build_cea.py` | `installed-capacity-by-source-2014-2026`, `non-fossil-share-of-capacity-2014-2026` | CEA |
| `climate/build_mnre.py` | `renewable-capacity-by-state-2026-10` | MNRE |
| `elections/get2026.sh` | None. Downloads archived ECI results pages for the 2026 assembly elections | ECI (Wayback Machine copies) |
| `elections/extract_text.sh`, `elections/parse_d33.py` | None. Text of ECI report 33, its parsed rows, and decompressed results pages | ECI |
| `elections/check_d33.py` | None. Checks that candidate votes add up to each constituency total | ECI |
| `elections/build_elections.py` | `lok-sabha-turnout-by-sex`, `lok-sabha-electors`, `lok-sabha-women-candidates-and-mps`, `lok-sabha-2024-turnout-by-state`, `lok-sabha-2024-seats-and-women-mps-by-state` (transcribed from MoSPI), `lok-sabha-2024-nota-by-state` | MoSPI (Women and Men in India 2025), ECI |
| `elections/build_party.py` | `lok-sabha-2024-party-results` | ECI |
| `elections/build_ae.py` | `assembly-2025-2026-seats-by-party` | ECI |

## CSVs that differ from a fresh run

The scripts are kept as they ran. Some CSVs were edited after the script wrote them:

- Line endings only: `prices/cfpi-inflation-2026.csv` has CRLF line endings (the script writes LF).
  Five election CSVs have LF line endings (the scripts write CRLF): `lok-sabha-2024-nota-by-state`,
  `lok-sabha-2024-party-results`, `lok-sabha-2024-seats-and-women-mps-by-state`,
  `lok-sabha-2024-turnout-by-state` and `lok-sabha-women-candidates-and-mps`.
- Row order only: `climate/monsoon-2026-by-subdivision.csv` and
  `education/education-school-facilities-by-state.csv`.
- Edited values or notes: `elections/assembly-2025-2026-seats-by-party.csv` (West Bengal after the
  Falta re-poll, see the elections README), and the note text in `elections/lok-sabha-electors.csv`
  and `elections/lok-sabha-turnout-by-sex.csv`.

These CSVs have no script. For the topic CSVs, the topic README says how the values were taken:
`climate/monsoon-2026-by-month-and-region.csv`, `climate/temperature-anomaly-2025-by-season.csv`,
`climate/warmest-years-temperature-anomaly.csv`, `elections/assembly-2025-2026-turnout.csv`,
`religion-culture/languages-count-2011.csv`, `geography.csv` and `release-calendar.csv`.

## Topic objects

`emblems/cutout.py` cuts each topic's silver object out of the coloured backdrop it was generated on,
so it sits on any ground: `public/emblems/*.webp` for the site and `src/assets/emblems/*.png` for the
social images. The generated source images are not kept in the repository.
A topic can have no object yet: it then has no entry in the script's `FILES` map and no alt text in
`src/lib/emblems.ts`, and the site leaves its object out. Add both when the object is approved.
