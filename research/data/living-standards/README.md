# Housing and living standards

Data for a planned India by Numbers topic, "Housing and living standards". The topic is not on the
site yet. Household spending comes from the Household Consumption Expenditure Survey (HCES) 2022-23
and 2023-24. Internet use, digital skills, bank accounts, cooking fuel, drinking water and household
assets come from the Comprehensive Annual Modular Survey (CAMS) 2022-23, NSS round 79. The 2018
drinking water values come from NSS round 76. MoSPI's National Statistics Office (NSO) publishes all
three surveys.

Read on 25 Nov 2026.

## Questions this topic answers

1. How much does a household spend on each person in a month, in each state, in villages and in towns?
2. How has that spending grown since 1999-00, in current prices and in 2011-12 prices?
3. What share of spending goes on food, and how has it changed since 1999-00?
4. Is spending becoming more or less equal (the Gini coefficient)?
5. How many people can use the internet, and do women lag men?
6. How many young people and adults can copy and paste, send a file or send an email?
7. How many adults have a bank or mobile money account?
8. How many households cook with clean fuel and drink water from an improved source? Did water access change between 2018 and 2022-23?
9. How many households have a phone or a computer?

## About the sources

- **HCES.** A household survey of consumption. HCES 2022-23 ran from August 2022 to July 2023, and
  HCES 2023-24 from August 2023 to July 2024 (NSS Report 592, para 1.14.0). The 2023-24 estimates
  rest on 2,61,953 households (press note of 30 Jan 2025).
- **MPCE** is monthly per capita consumption expenditure: household consumption in a month divided by
  household size, in rupees.
- **With and without imputation.** MoSPI publishes two sets of MPCE figures. "Without imputation"
  follows the usual NSS practice. "With imputation" adds an imputed value for items that households
  got free through social welfare programmes: PDS and free grain, pulses, salt, sugar and edible oil,
  and free laptops, tablets, mobile handsets, bicycles, motorcycles, school uniforms and school shoes.
  Each free item takes the value of the same item bought from other sources (Report 592, para 2.3.0
  and the lists after it; para 3.2.0). Only the set without imputation compares with surveys before
  2022-23.
- **Method break between 2011-12 and 2022-23.** Report 592, section 1.12, "Issues related to
  comparability", lists four changes from HCES 2022-23: (i) the item list grew from about 347 items
  to 405; (ii) three questionnaires (food; consumables and services; durable goods) replaced a single
  one; (iii) the three questionnaires were canvassed in three monthly visits, not in one visit;
  (iv) interviews moved from pen and paper (PAPI) to computer-assisted (CAPI). MoSPI says these
  points "are required to be noted while comparing the results of HCES: 2023-24 with those of the
  surveys conducted in 2011-12 and earlier". The CSVs keep the earlier rounds. A chart must show a
  method break between 2011-12 and 2022-23.
- **Reference periods.** Table 3.3 of Report 592 says the 1999-00 and 2004-05 estimates use the Mixed
  Reference Period (MRP), and 2009-10 onwards the Modified MRP (MMRP). This is a second break, between
  2004-05 and 2009-10. `mpce-india-rounds.csv` carries it in `recall_period`. Table 3.11 (item shares)
  and Table 3.15 (Gini) do not state the reference period, so those CSVs do not carry one.
- **Prices.** Table 3.3 gives MPCE at current prices and at 2011-12 prices. MoSPI inflated the
  1999-00 to 2009-10 values with CPI(AL) (rural) and CPI(IW) (urban), and deflated the 2022-23 and
  2023-24 values with CPI(R) and CPI(U) (Table 3.3, note ii).
- **CAMS 2022-23** ran from July 2022 to June 2023. "Clean fuel" means that the primary source of energy
  for cooking is LPG or other natural gas, gobar gas or other biogas, electricity (including solar or
  wind generators) or a solar cooker. The share is of households with a cooking arrangement (Report
  590, section 7.5). "Improved principal source of drinking water" means 12 of 17 source types: bottled
  water, piped water into the dwelling, to the yard or plot, or from a neighbour, a public tap or
  standpipe, a tube well, a hand pump, a protected well, a public or private tanker truck, a protected
  spring and rainwater collection (section 7.6).
- **NSS round 76** ran from July to December 2018. Its "improved source of drinking water" uses the
  same 17 source types and the same 12 improved types as CAMS (Report 584, para 3.4.5). The 2018 and
  2022-23 shares therefore have one definition. The fieldwork periods differ (six months against twelve).

## Sources

| Publisher | Release | Release date | Period | URL read | Read on | Licence | sha256 of raw file |
| --- | --- | --- | --- | --- | --- | --- | --- |
| MoSPI NSO | NSS Report No. 592, Survey on Household Consumption Expenditure: 2023-24 (225 pages) | 30 Jan 2025 (press note of the same day; PDF created 30 Jan 2025) | August 2023 to July 2024, with 1999-00 to 2022-23 in Tables 3.3, 3.11 and 3.15 | https://www.mospi.gov.in/sites/default/files/publication_reports/Final_Report_HCES_2023-24L.pdf | 25 Nov 2026 | Not stated | 368deb9c858dcc71c3bf0e6cad096a31b5b337a724cf92a113637f3302ea268e |
| MoSPI NSO | Press note, Household Consumption Expenditure Survey: 2023-24 (detailed report) | 30 Jan 2025 | August 2023 to July 2024 | https://www.mospi.gov.in/sites/default/files/press_release/HCES_Report202324_Press_Note_30012025.pdf | 25 Nov 2026 | Not stated | 34e7e8bf64c8e78094dc338064f3c68e848021209f4bee8bc9849b329d3d74ca |
| MoSPI NSO | Factsheet, HCES 2023-24 (read for the durables check only; no values used) | 27 Dec 2024 (press note of 30 Jan 2025) | August 2023 to July 2024 | https://www.mospi.gov.in/sites/default/files/publication_reports/HCES%20FactSheet%202023-24.pdf | 25 Nov 2026 | Not stated | 31d4ce93ce9396b4042d226408b6d12e4be2006e0b716a0d63995d913b13f76e |
| MoSPI NSO | NSS Report No. 591, Survey on Household Consumption Expenditure: 2022-23 (228 pages) | June 2024 (press note of 30 Jan 2025; PDF created 7 Jun 2024) | August 2022 to July 2023 | https://www.mospi.gov.in/sites/default/files/publication_reports/Report_591_HCES_2022-23New.pdf | 25 Nov 2026 | Not stated | e17d43c092043b466711b2bfc2f8e0f42af6dcddd1da57897db91845747fecaf |
| MoSPI NSO | NSS Report No. 590, Comprehensive Annual Modular Survey (CAMS), 2022-23 (NSS round 79; 195 pages) | 9 Oct 2024 (PDF created 9 Oct 2024) | July 2022 to June 2023 | https://www.mospi.gov.in/sites/default/files/publication_reports/CAMS%20Report_October_N.pdf | 25 Nov 2026 | Not stated | 5a73af6e4504e6a90b35cfb426100a1c2eba849233f267ddc0f90681404b7163 (the same file as in the education README) |
| MoSPI NSO | NSS Report No. 584, Drinking Water, Sanitation, Hygiene and Housing Condition in India (NSS round 76; 284 pages) | 22 Nov 2019 (PDF created 22 Nov 2019) | July to December 2018 | https://www.mospi.gov.in/sites/default/files/publication_reports/Report_584_final_0.pdf | 25 Nov 2026 | Not stated | 691c93d088251e32fa08c6e7898513fb71fbf18c14a0c65f583552c79ab91ac2 |
| MoSPI NSO | eSankhyiki API, HCES, indicators 1, 4 and 9 | Not stated by the API | 2022-23 and 2023-24 | https://api.mospi.gov.in/api/hces/getHcesRecords?indicator_code=<n>&Format=JSON&limit=200&page=<p> | 25 Nov 2026 | Not stated | See below |
| MoSPI NSO | eSankhyiki API, NSS round 79, survey code 1 (CAMS), indicators 14, 18, 19, 21 to 24, 27, 28 | Not stated by the API | July 2022 to June 2023 | https://api.mospi.gov.in/api/nss-79/getNss79Records?indicator_code=<n>&survey_code=1&Format=JSON&limit=200&page=<p> | 25 Nov 2026 | Not stated | See below |
| MoSPI NSO | eSankhyiki API, NSS round 76, survey code 2, indicator 16 | Not stated by the API | July to December 2018 | https://api.mospi.gov.in/api/nss-76/getNss76Records?indicator_code=16&survey_code=2&Format=JSON&limit=200&page=<p> | 25 Nov 2026 | Not stated | See below |

### Raw files

The reports were fetched with `pipeline/common/fetch.sh`, between 20:41 and 20:47 UTC. The API pages
were fetched between 20:40 and 20:50 UTC. The HCES API is not in the eSankhyiki documentation list;
its route and its nine indicators are in the documentation file
`https://api.mospi.gov.in/layout/swagger_user_hces.yaml`. The API refuses a `limit` above 200.

| File under `raw/living-standards/` | Content | Records | Pages | SHA-256 |
| --- | --- | --- | --- | --- |
| `hces-2023-24/report.pdf` | NSS Report 592 | | 225 | `368deb9c858dcc71c3bf0e6cad096a31b5b337a724cf92a113637f3302ea268e` |
| `hces-2023-24/press-note-report.pdf` | Press note, 30 Jan 2025 | | 11 | `34e7e8bf64c8e78094dc338064f3c68e848021209f4bee8bc9849b329d3d74ca` |
| `hces-2023-24/factsheet.pdf` | Factsheet HCES 2023-24 | | 23 | `31d4ce93ce9396b4042d226408b6d12e4be2006e0b716a0d63995d913b13f76e` |
| `hces-2022-23/report.pdf` | NSS Report 591 | | 228 | `e17d43c092043b466711b2bfc2f8e0f42af6dcddd1da57897db91845747fecaf` |
| `cams-2022-23/report.pdf` | NSS Report 590 | | 195 | `5a73af6e4504e6a90b35cfb426100a1c2eba849233f267ddc0f90681404b7163` |
| `nss76-584/report.pdf` | NSS Report 584 | | 284 | `691c93d088251e32fa08c6e7898513fb71fbf18c14a0c65f583552c79ab91ac2` |
| `hces/i1.json` | Average monthly per capita consumption expenditure (MPCE) | 296 | 2 | `e20641f6a38d2392ce2a30dd4f511819c8a3844863144a2dba4aa5c4b5187712` |
| `hces/i2.json` | MPCE over 12 fractile classes (fetched, not used) | 1924 | 10 | `71944e3ed0ed18f9e6cf69e41d7e71e46e0c7fde37cb267c1a7ade3b3533e20a` |
| `hces/i3.json` | MPCE over broad categories in 30 days (fetched, not used) | 9176 | 46 | `8e438ed714ebfa04c2177feff004b081aa622877a1e3acff579408afa6714e41` |
| `hces/i4.json` | Percentage share of MPCE over broad categories in 30 days | 9176 | 46 | `7dd791b60b19c11757c17176451352ba016fab3f4edb5d12f459bc3effefe66e` |
| `hces/i5.json` | Average per capita monthly quantity consumption (fetched, not used) | 740 | 4 | `c8c82f96a57c46ff04b7fbc692c9ad6d2e4973aa28c7ef09a4436bfb77c51d89` |
| `hces/i6.json` | Average monthly per capita value of consumption (fetched, not used) | 1480 | 8 | `fb02d16a3c9342844adb17235526cfc2f21d1c58ed51678c916fcc1d79fdd424` |
| `hces/i7.json` | MPCE across household types (fetched, not used) | 1924 | 10 | `8760d52122092baa24cb0dc238d1891875c6c89ae167aebc399bd1a0d68ca27e` |
| `hces/i8.json` | MPCE across social groups (fetched, not used) | 1480 | 8 | `86c039ea76d3adebac800e341361bd9a25b53b0ab0d96e0d30790b6064bd7ff4` |
| `hces/i9.json` | Gini coefficient for per capita consumption expenditure | 296 | 2 | `11047665c1cbeb60b8eb4a84bdec4dfe2bf3ffd3ecae55f07a06f24aa110ac4e` |
| `nss79/i14.json` | Persons with a bank, other financial institution or mobile money account (age 18+) | 333 | 2 | `a9b694d874f48194e65e74efd3859f225cd1cf3a379528fcb3b5acedbd9865de` |
| `nss79/i18.json` | Persons able to use internet | 999 | 5 | `8b5b454b7f4cee7b928ad4146e55adc2e4a228175aaa6ce0a22b4104ae827be6` |
| `nss79/i19.json` | Persons who used internet during the last 3 months | 999 | 5 | `332f1303ec5f591b5fce3e73b1dc3602eb1dd55b471e3036713122a60ca7ea02` |
| `nss79/i21.json` | Persons who sent messages with attached files | 999 | 5 | `27eb723e11d5abe063bfe903e5027ddd5e47d4a26784b577ec72816d6b04fa19` |
| `nss79/i22.json` | Persons who used copy and paste tools | 999 | 5 | `ff46ae3dface8d8d9ca491f277d37c0e950d1d9d79ee0bf51015ad8946e0bd06` |
| `nss79/i23.json` | Persons who can search the internet, send or receive emails, bank online | 3996 | 20 | `1d7802e1a4582c445e914e9d2a946d115e909aeae20ae92d466c94b9ccdf6f01` |
| `nss79/i24.json` | Households possessing different assets | 222 | 2 | `ff08e1863b39b35720aa96d3d9d7af146bec294b0da5625c2e1023bf2b454b04` |
| `nss79/i27.json` | Households using clean fuel for cooking | 111 | 1 | `9437c15a165ead77162ec266661e49d5f0c42d183348e423acd7085dbefca1bc` |
| `nss79/i28.json` | Households with improved drinking water and improved latrine | 222 | 2 | `43583e5ca4905d6e6aba15a4a8bc6bfcd6117a523a8445c2812e3d55a933eab6` |
| `nss76/indicators.json` | NSS round 76, survey code 2, indicator list (12 indicators) | 12 | 1 | `58601b46108c302b356beaca81ebddc6404e7926c9c7bcc5e02437177c72d9e7` |
| `nss76/i16.json` | Households having improved source of drinking water | 4212 | 22 | `ab352b578f0add3e1c9a993e9c97a1a5aca0553a96abcf42e6d456d78a1d94c0` |

The scan of round 79 (`--scan 30`) also saved indicators 1 to 13, 15 to 17, 20, 25 and 26. They are
not used here. Education uses indicator 3 from its own copy.

## How the CSVs are made

Run, from the repository root:

```sh
python3 -I pipeline/living-standards/fetch_hces.py
python3 -I pipeline/education/fetch_nss.py --raw raw/living-standards/nss79 --round 79 --survey 1 14 18 19 21 22 23 24 27 28
python3 -I pipeline/education/fetch_nss.py --raw raw/living-standards/nss76 --round 76 --survey 2 16
pipeline/common/fetch.sh --raw raw/living-standards/hces-2023-24 <Report 592 URL above> report.pdf
pipeline/common/fetch.sh --raw raw/living-standards/hces-2022-23 <Report 591 URL above> report.pdf
pipeline/common/fetch.sh --raw raw/living-standards/cams-2022-23 <Report 590 URL above> report.pdf
pipeline/common/fetch.sh --raw raw/living-standards/nss76-584 <Report 584 URL above> report.pdf
pipeline/living-standards/extract_text.sh
python3 -I pipeline/living-standards/build_living_standards.py
```

`extract_text.sh` writes `work/living-standards/<folder>/report.txt` with `pdftotext -layout`.
`fetch_nss.py --round 76 --survey 2` with no codes saves the indicator list and then fetches all 12
indicators. Several are large and slow, so pass the code.

## CSVs

Every CSV is in long format. `geography` is a slug from `research/data/geography.csv`, or `india`.
`value` keeps the publisher's digits; the API drops trailing zeros (`0.2` for 0.200), so the script
prints the report's decimals after it checks that the API has no more digits than that. A `-` in the
report (no sample) is an empty value. `api_indicator` is the API indicator code; `report_table` names
the table that the value was checked against.

### `mpce-by-state.csv`

- 296 rows: 36 states and UTs plus India, 2022-23 and 2023-24, rural and urban, without and with
  imputation. Columns: `sector`, `imputation`, `rse_percent`.
- Unit: rupees per person per month, current prices.
- Source: API indicator 1. Checked against Statement 1 of Reports 592 and 591 (all 148 cells of each)
  and the MPCE columns of Statements 9 and 15. `rse_percent` is the relative standard error of the
  estimate from Table C1 (without imputation) and Table C2 (with imputation) of the same report.
- Checked values: Sikkim rural 2023-24 ₹9,377 (Report 592, Statement 1, page S1); Chhattisgarh rural
  2023-24 ₹2,739 (Statement 1); India urban 2023-24 ₹6,996 (Statement 1 and Table 3.3), RSE 1.59%
  (Table C1).

### `mpce-india-rounds.csv`

- 24 rows: India, rural and urban, six rounds (1999-00, 2004-05, 2009-10, 2011-12, 2022-23,
  2023-24), current prices and 2011-12 prices. Columns: `prices`, `recall_period` (MRP or MMRP, as
  Table 3.3 states), `survey`.
- Source: Report 592, Table 3.3. No API gives the rounds before 2022-23. The 2022-23 and 2023-24
  values at current prices are checked against API indicator 1.
- Checked values: rural 2011-12 ₹1,430 and urban 2011-12 ₹2,630 (Table 3.3, column 5); rural
  2023-24 at 2011-12 prices ₹2,079 (Table 3.3, second block).

### `mpce-item-shares-india-rounds.csv`

- 360 rows: India, rural and urban, six rounds, 30 item groups (with "food: total", "non-food: total"
  and "total expenditure"). Unit: % of MPCE.
- Source: Report 592, Tables 3.11R and 3.11U. The 2022-23 and 2023-24 values of the 26 groups that
  match one API category are checked against API indicator 4 (104 cells). Table 3.11 joins sugar and
  salt, and toilet articles and other household consumables; its "pulses and pulse products"
  includes gram, while the API's excludes it. Those rows are not compared.
- Checked values: rural food share 59.40% in 1999-00 and 47.04% in 2023-24 (Table 3.11R; para
  3.2.11.0 quotes both); urban food share 39.68% in 2023-24 (Table 3.11U).

### `food-share-by-state.csv`

- 592 rows: 36 states and UTs plus India, 2022-23 and 2023-24, rural and urban, without and with
  imputation, food and non-food. Unit: % of MPCE.
- Source: API indicator 4 ("Food Total" and "Non-Food Total"). Checked against rows 15 and 31 of
  Statements 4R, 4U (without imputation) and 11R, 11U (with imputation) of Reports 592 and 591: 1,184
  cells.
- Checked values: rural 2023-24 food share Andhra Pradesh 45.85%, Assam 53.22% and Delhi 40.32%
  (Report 592, Statement 4R, page S16).

### `gini-mpce.csv`

- 298 rows: 36 states and UTs plus India, 2022-23 and 2023-24, rural and urban, without and with
  imputation; and India 2011-12, rural and urban. Unit: Gini coefficient, 0 (equal) to 1.
- Source: API indicator 9, checked against Statements 9 and 15 of Reports 592 and 591 (296 cells).
  India 2011-12 is from Table 3.15 of Report 592; Table 3.15 of Report 591 gives the same values,
  and the script checks that they agree.
- Checked values: India urban 2011-12 0.363 (Table 3.15); India rural 2023-24 0.237 (Table 3.15 and
  Statement 9, page S36); Telangana rural 2023-24 0.164 (Statement 9 and Table 3.16).

### `internet-and-ict-skills-by-state.csv`

- 4,995 rows: 36 states and UTs plus India, 2022-23, five measures, three age groups (15-24, 15-29,
  15+), male, female and person, rural, urban and rural+urban. Unit: % of persons in the age group.
- Measures: `able to use internet` (indicator 18, Table 16), `used internet in last 3 months` (19,
  Table 17), `sent messages with attached files in last 3 months` (21, Table 19), `used copy and
  paste in last 3 months` (22, Table 20), `can send or receive email` (23, second column of Table 21).
- Checked against every page of Tables 16, 17, 19 and 20 (one page per age group, 333 cells each) and
  the 27 pages of Table 21 (one per sector, sex and age group): 4,995 cells.
- Checked values: Bihar rural women aged 15-24 able to use internet 66.5% (Table 16); Kerala rural
  persons aged 15-24 who used internet 98.3% (Table 17); Delhi urban women aged 15-24 who used copy
  and paste 87.3% (Table 20).

### `bank-account-by-state.csv`

- 333 rows: 36 states and UTs plus India, 2022-23, age 18+, male, female and person, rural, urban and
  rural+urban. Unit: % of persons aged 18 and over with an account, alone or jointly, in a bank, other
  financial institution or mobile money service provider.
- Source: API indicator 14, checked against Table 12 (333 cells).
- Checked values: Andhra Pradesh rural men 98.0%, Arunachal Pradesh women 82.1%, Gujarat women 87.7%
  (Table 12).

### `household-amenities-by-state.csv`

- 438 rows. CAMS 2022-23: `clean fuel for cooking` (indicator 27, Table 25),
  `improved principal source of drinking water` and `improved latrine (among households with a
  latrine)` (indicator 28, Table 26), each for 36 states and UTs plus India, rural, urban and
  rural+urban. NSS round 76, 2018: `improved principal source of drinking water` for 34 states and UTs
  plus India (Report 584, Statement 6.1, column 2). Unit: % of households. Columns: `survey`, `note`.
- Checked against Tables 25 and 26 (333 cells) and the three pages of Statement 6.1 (105 cells).
- Checked values: India clean fuel 63.4% (Table 25 and Fig. 24.1); Jharkhand rural clean fuel 18.1%
  (Table 25); Kerala improved drinking water 54.4% (Table 26); India rural improved drinking water
  94.5% in 2018 (Statement 6 and Statement 6.1).

### `household-assets-by-state.csv`

- 222 rows: 36 states and UTs plus India, 2022-23, `telephone or mobile phone` and `computer (desktop
  or laptop)`, rural, urban and rural+urban. Unit: % of households.
- Source: API indicator 24, checked against Table 22 (222 cells).
- Checked values: India computer 9.9%, Delhi computer 27.8%, Andhra Pradesh rural telephone 87.8%
  (Table 22).

## Checks done on 25 Nov 2026

`build_living_standards.py` compares the API values with the report text and stops on any
difference. It also stops if the report has a row that the API lacks, or the API has a value that
the report table lacks. In all, 7,580 report cells agree. The CSVs above list three values each that
were also read by eye against the report page.

- **API fault, NSS round 76.** The API gives Tripura's improved drinking water values under
  Uttarakhand, and Uttarakhand's under Tripura, in all three sectors. Statement 6.1 of Report 584
  gives Tripura rural 84.7% and Uttarakhand rural 96.0%. Statement 2.1 settles it: the 12 improved
  sources of rural Tripura add up to 84.7 (0.1 + 3.6 + 9.9 + 1.4 + 17.8 + 18.2 + 28.5 + 5.1 + 0.1
  + 0.0 + 0.0 + 0.0). The CSV takes the report values, and the `note` column says so. The script
  checks for this exact swap and stops if the API changes, so the README and the script get updated.

## Decisions

- **Durable goods.** Reports 592 and 591 have no table on possession of durable goods (TV, fridge, air
  conditioner, washing machine, vehicles) and no table on cooking fuel. They give only the share of
  spending on durable goods (item 30 of Statements 3 and 4). The HCES questionnaire asks for the
  primary source of cooking energy (HCQ, Q4.21), but the report publishes no table from it. The
  factsheet and the press note have none either. By rule R3, the topic uses no unit-level figure, so
  it leaves these out. CAMS Table 22 gives the two assets that MoSPI publishes by state: a telephone
  or mobile phone, and a computer.
- **Cooking fuel in 2018.** Statement 25.2 of Report 584 splits cooking fuel into firewood and crop
  residue, LPG, dung cake, "others" and no cooking arrangement. The report does not split "others".
  The CAMS "clean fuel" share (LPG or natural gas, biogas, electricity, solar) cannot be made from these
  groups, and the 2018 LPG share is a different measure. Not used.
- **Latrines in 2018.** The round 76 API gives "persons regularly used improved latrine" (indicator
  20). CAMS gives households with an improved latrine among households with any latrine. These are
  different measures. Not used. Statement 15.1 of Report 584 has the household share with access to a
  latrine, which CAMS does not give.
- **House type.** Report 584 gives pucca and katcha houses by state (Statement 23 and 22.2). Neither
  CAMS nor HCES has a house type measure, so there is no comparison point. Not used here. It could
  serve a 2018-only chart later.
- **2018 geography.** In 2018, Dadra and Nagar Haveli and Daman and Diu were two UTs, and Jammu and
  Kashmir included Ladakh. The CSV leaves out the two old UTs and the "Group of NE States" and
  "Group of UTs" rows. It keeps Jammu and Kashmir as `jammu-kashmir`, with a note that the 2018 state
  included Ladakh.
- **Both MPCE sets.** The CSVs keep both the values with and without imputation, because MoSPI
  publishes both as headline figures. A chart should show one set. Use "without imputation" for any
  comparison with 2011-12 or earlier.
- **Age groups.** CAMS gives each person indicator for ages 15-24, 15-29 and 15 and over. The CSV
  keeps all three. Charts should name the age group.
- **Item group names.** The CSVs write "and" for "&" and "hospitalisation" for "hospitalization". The
  source names are in the report tables named in `report_table`.
- **Periods.** HCES periods are `2022-23` and `2023-24` (August to July). CAMS is `2022-23` (July to
  June). NSS round 76 is `2018` (July to December). Rounds before 2022-23 use the labels of Table 3.3
  (`1999-00`, `2004-05`, `2009-10`, `2011-12`).
- **HCES fractile classes, household types and social groups** (API indicators 2, 7 and 8) were
  fetched but are not in a CSV. They suit a later Poverty and inequality topic.

## Gaps and cautions

- **Small samples.** CAMS: "it is important to consider the limited sample size of specific
  indicators, and/ or domains like small states or union territories" (Report 590, page 34). CAMS
  surveyed 80 urban households in Chandigarh, 159 urban households in Lakshadweep and 160 urban
  households in Ladakh (Table 27). HCES 2023-24 gives relative standard errors in Table C1. Most are
  under 5%, but some are much higher: Telangana urban 16.87%, Dadra and Nagar Haveli and Daman and
  Diu rural 13.42%, Chandigarh urban 11.52%, Lakshadweep urban 11.50% and Ladakh urban 10.56%. The
  `rse_percent` column carries these. State charts should mark small UTs or show the RSE.
- **Totals.** CAMS warns that survey-based estimated totals are used to compute rates and ratios only.
  None of these CSVs has a total.
- **Method breaks.** HCES 2022-23 and later against 2011-12 and earlier (see "About the sources"),
  and MRP (1999-00, 2004-05) against MMRP (2009-10 onwards).
- **Not deflated.** `mpce-by-state.csv` is in current prices. Only Table 3.3 gives 2011-12 prices,
  and only for India.
- **No state series before 2022-23** in these CSVs. Earlier NSS rounds have state tables in their own
  reports (for example Report 558 for 2011-12); they are not read here.
- **Census 2011 houselisting** (amenities and assets for every household) is not used. It is a full
  count, not a survey, and it is 15 years old.

## Proposed charts

Kinds are from `src/content/types.ts`.

| Slug | Kind | CSV | Period | Why |
| --- | --- | --- | --- | --- |
| `household-spending-by-state` | `dots` (rural and urban per state; Map tab on rural) | `mpce-by-state.csv` (without imputation) | 2023-24 | The core living-standards figure for every state, and the rural-urban gap in one row |
| `household-spending-over-time` | `line` (`joined`, method break after 2011-12) | `mpce-india-rounds.csv` (2011-12 prices) | 1999-00 to 2023-24 | Real growth over 25 years, with MoSPI's own deflators and the method break shown |
| `food-share-of-spending` | `line` (`joined`, method break after 2011-12) | `mpce-item-shares-india-rounds.csv` (food: total) | 1999-00 to 2023-24 | Food fell from 59.40% to 47.04% of rural spending: a classic sign of rising living standards |
| `food-share-by-state` | `states` | `food-share-by-state.csv` (rural, without imputation) | 2023-24 | Where food still takes half the budget |
| `consumption-inequality` | `columns` (rural and urban) | `gini-mpce.csv` (India, without imputation) | 2011-12, 2022-23, 2023-24 | MoSPI's measure of how equal spending is, with the method break marked |
| `clean-cooking-fuel-by-state` | `states` | `household-amenities-by-state.csv` (rural+urban) | 2022-23 | 63.4% nationally, under 40% in some states; a direct health and time measure |
| `safe-drinking-water-by-state` | `dots` (2018 hollow, 2022-23 filled) | `household-amenities-by-state.csv` (improved drinking water, rural+urban) | 2018 and 2022-23 | Same definition in both surveys; shows the states that lag (Kerala, Lakshadweep, Manipur) |
| `internet-use-women-and-men` | `dots` (female, male; Map tab on person) | `internet-and-ict-skills-by-state.csv` (used internet in last 3 months, 15+, rural+urban) | 2022-23 | The gender gap in internet use by state |
| `digital-skills` | `bars` (grouped female and male) | `internet-and-ict-skills-by-state.csv` (India, 15-24, four skill measures) | 2022-23 | What young people can do online, beyond access |
| `bank-accounts-women-and-men` | `dots` (female, male) | `bank-account-by-state.csv` (18+, rural+urban) | 2022-23 | Financial inclusion by state and sex |

A possible eleventh chart: `households-with-a-computer` (`states`, `household-assets-by-state.csv`,
2022-23). It is the only household asset that MoSPI publishes by state, apart from the phone.
