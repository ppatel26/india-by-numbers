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
| `education/fetch_nss.py` | None. Downloads NSS indicators (rounds 79 and 80) from the eSankhyiki API, one JSON file per indicator | MoSPI |
| `education/build_education.py` | `education-ger-school-by-state`, `education-dropout-by-state`, `education-ptr-by-state`, `education-school-facilities-by-state`, `education-school-trend-india`, `education-higher-ed-ger-by-state`, `education-higher-ed-ger-india`, `education-literacy-by-state` | Ministry of Education (UDISE+, AISHE), MoSPI (PLFS), ORGI (Census) |
| `education/build_cmse.py` | `education-spending-per-student`, `education-school-type-by-state`, `education-private-coaching`, `education-mean-years-schooling-by-state`. Checks the API values against the report tables | MoSPI (NSS: CMS: Education 2025, CAMS 2022-23) |
| `living-standards/fetch_hces.py` | None. Downloads the nine HCES indicators from the eSankhyiki API, one JSON file per indicator. NSS rounds 79 and 76 use `education/fetch_nss.py` | MoSPI (HCES) |
| `living-standards/extract_text.sh` | None. Text of NSS Reports 592, 591 (HCES), 590 (CAMS) and 584 (NSS round 76) | MoSPI |
| `living-standards/build_living_standards.py` | `mpce-by-state`, `mpce-india-rounds`, `mpce-item-shares-india-rounds`, `food-share-by-state`, `gini-mpce`, `internet-and-ict-skills-by-state`, `bank-account-by-state`, `household-amenities-by-state`, `household-assets-by-state`. Checks every API value against the report tables | MoSPI (HCES 2022-23 and 2023-24, CAMS 2022-23, NSS round 76) |
| `health/extract_text.sh` | None. Text of the SRS, MMR, life table, cause of death, CRS, NFHS-5, NFHS-6 and NHA reports | ORGI, IIPS, MoHFW |
| `health/build_health.py` | `imr-india-1971-2024`, `imr-by-state-2024`, `mmr-india-1997-2024`, `mmr-by-state-2022-24`, `life-expectancy-india-1970-2024`, `life-expectancy-by-state-2020-24`, `nfhs-key-indicators-by-state`, `out-of-pocket-health-spending`, `child-mortality-by-state-2024` | ORGI (SRS), IIPS and MoHFW (NFHS), PIB, MoHFW and NHSRC (NHA) |
| `health/build_crs.py` | `crs-registration-level-by-state-2024`, `crs-sex-ratio-at-birth-by-state` | ORGI (CRS) |
| `health/build_srs_cod.py` | `srs-causes-of-death-india` | ORGI (SRS) |
| `health/build_nfhs_adult.py` | `nfhs-adult-indicators-by-state` | IIPS and MoHFW (NFHS-6), IIPS and ICF (NFHS-5 report) |
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
