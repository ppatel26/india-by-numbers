# Agriculture

Data for the India by Numbers topic "Agriculture" (`/agriculture/`). Its eight charts read the five NSS
round 77 CSVs only. No page reads the four ASG CSVs until the ministry gives permission (see
"Licence" under "Gaps and cautions"). Two publishers give the data:

- **MoSPI, NSS round 77** (NSS Report No. 587). A survey of agricultural households in rural India
  in 2019: income by source, debt, sources of loans, land possessed and operational holdings. It
  repeats parts of NSS round 70 (2013) and round 59 (2003).
- **Ministry of Agriculture and Farmers Welfare, Agricultural Statistics at a Glance 2024-25.**
  Area, production and yield of rice, wheat and pulses for India from 1950-51 to 2024-25, yield by
  state from 2005-06, production of the major states in 2023-24 and 2024-25, and the Agriculture
  Census 2015-16 holdings table. This is the second source that a council member asked for: it
  gives the topic a time series, not only the 2019 cross-section.

Read on 25 Nov 2026.

## Questions this topic answers

1. How much does an agricultural household earn in a month, and from what: wages, crops, animals,
   or a non-farm business? How does this change with the land the household has?
2. Which states have the highest and the lowest farm household incomes?
3. What share of agricultural households is in debt, and how large is the average loan?
4. Do they borrow from banks or from moneylenders, and where do moneylenders matter most?
5. How much land do agricultural households have? How many have less than 1 hectare?
6. Are farm holdings getting smaller? (NSS 2002-03 to 2018-19; Agriculture Census 2005-06 to 2015-16)
7. How have rice, wheat and pulse production and yield grown since 1950-51?
8. Which states get the highest yields, and how have state yields changed since 2005-06?

## About the sources

- **NSS round 77.** The National Statistical Office ran one survey of "Land and Livestock Holdings of
  Households and Situation Assessment of Agricultural Households" from 1 January to 31 December
  2019, in rural India only (Report 587, para 1.1.1). Each household had two visits: visit 1 from
  January to August 2019 for the period July to December 2018, and visit 2 from September to
  December 2019 for January to June 2019 (para 1.5 and page i). Visit 1 covered 58,035 households
  and visit 2 covered 56,894 (Highlights). The survey left out villages of the Andaman and Nicobar
  Islands that were hard to reach.
- **Agricultural household.** "A household receiving value of produce more than Rs. 4000/- from
  agricultural activities (e.g., cultivation of field crops, horticultural crops, fodder crops,
  plantation, animal husbandry, poultry, fishery, piggery, bee-keeping, vermiculture, sericulture,
  etc.) and having at least one member self-employed in agriculture either in the principal status or
  in subsidiary status during last 365 days" (para 1.6.3). Households that live only on farm labour,
  coastal fishing, rural crafts or agricultural services are not agricultural households. The survey
  estimated 93.094 million agricultural households, 54.0% of rural households (Highlights).
- **Income** is the sum of wages and salaries, rent from land leased out, and the net receipt from
  crop production, farming of animals and a non-farm business, for the agricultural year July 2018
  to June 2019 (para 3.5.1.1). Pensions and remittances are left out (para 3.5.1.4). MoSPI gives two
  sets: net receipts after "paid out" expenses only (Statement 5.1A), and after paid out and imputed
  expenses, such as farm-saved seed and unpaid family labour (Statement 5.1B). Wages, rent and
  non-farm business are the same in both sets.
- **Debt** is the loan outstanding, with interest, on the day of the visit-1 interview (January to
  August 2019; para 3.5.6.1). Table 29 labels these estimates with the visit-1 reference period, July
  to December 2018. The CSVs use the period `2019`.
- **Land possessed** is "land owned (including land under 'owner like possession') + land leased-in -
  land leased-out + land otherwise possessed" (para 2.18). Statement 1.3.1 uses the land of each
  household in July to December 2018 (visit 1).
- **Operational holding** is all land used wholly or partly for agricultural production by a
  household (para 3.2.4). Report 587 compares 2018-19 with 2012-13 and 2002-03 (Statements 2.8, 2.9).
- **Agricultural Statistics at a Glance (ASG)** is the yearly compendium of the Economics, Statistics
  and Evaluation Division (ES&E) of the Department of Agriculture and Farmers Welfare. The crop tables
  cite "E,S&E Division, DA&FW". Table 5.1 cites the Agriculture Census 2015-16.
- **Agriculture Census.** The Department runs a census of operational holdings every five years
  (portal `agcensus.da.gov.in`). The latest results on the portal and in ASG 2024-25 are for
  2015-16 (146,453,741 operational holdings on the portal; 146,454 thousand in ASG Table 5.1). The
  11th census, reference year 2021-22, was launched, but on 25 Nov 2026 the portal gave no
  2021-22 results. Its holdings by size are therefore taken from ASG Table 5.1.

## Sources

| Publisher | Release | Release date | Period | URL read | Read on | Licence | sha256 of raw file |
| --- | --- | --- | --- | --- | --- | --- | --- |
| MoSPI NSO | NSS Report No. 587, Situation Assessment of Agricultural Households and Land and Livestock Holdings of Households in Rural India, 2019 (NSS round 77; 4,264 pages) | September 2021 (cover page). The PDF was created on 10 Mar 2023; MoSPI does not say what changed | January to December 2019; income for July 2018 to June 2019 | https://www.mospi.gov.in/sites/default/files/publication_reports/Report_587m_0.pdf | 25 Nov 2026 | Not stated | 119bbf39626de4a58ec183cf2d327f6a9916116dbe3367570c0952d40f9dcd05 |
| MoSPI NSO | eSankhyiki API, NSS round 77, indicators 16, 24, 25 and 33 | Not stated by the API | As the report | https://api.mospi.gov.in/api/nss-77/getNss77Records?indicator_code=<n>&survey_code=1&Format=JSON&limit=200&page=<p> | 25 Nov 2026 | Not stated | See below |
| Ministry of Agriculture and Farmers Welfare, ES&E Division | Agricultural Statistics at a Glance 2024-25 (PEDS-271(E); 476 pages) | Not stated. The Preface is dated 8 Jul 2025 and the Secretary's Message 8 Jul 2025. The PDF was last changed on 18 Feb 2026 | 1950-51 to 2024-25 | https://desagri.gov.in/wp-content/uploads/2024/11/Agricultural-Statisitcs-at-a-Glance-2024-25_कृषि-सांख्यिकी-एक-झलक-2024–25-1.pdf (linked from https://desagri.gov.in/document-report/agricultural-statistics-at-a-glance-2024/) | 25 Nov 2026 | Reproduction "free of charge after taking proper permission by sending a mail to us", accurately and with the source "prominently acknowledged" (desagri.gov.in Website Policies) | bcb1b9e0da1b9b4eaf687d4f833ce506707d564388237844c69ae27b0e8eff17 |

### Raw files

The report was fetched with `pipeline/common/fetch.sh` at 22:35 UTC and ASG at 22:36 UTC. The API
pages were fetched between 22:37 and 22:40 UTC, and the indicator list at 22:47 UTC. The API takes
no survey code for round 77 (its documentation lists none); `fetch_nss.py` sends `survey_code=1`,
which the API ignores.

| File under `raw/agriculture/` | Content | Records | Pages | SHA-256 |
| --- | --- | --- | --- | --- |
| `nss77-587/report.pdf` | NSS Report 587 | | 4,264 | `119bbf39626de4a58ec183cf2d327f6a9916116dbe3367570c0952d40f9dcd05` |
| `nss77/indicators.json` | NSS round 77 indicator list (33 indicators, codes 16 to 51) | 33 | 1 | `8a9b98d18006262bd913e33322699f42b04a72c2a7c64667f07568e5fdbea8db` |
| `nss77/swagger_user_nss77.yaml` | API documentation, `https://api.mospi.gov.in/layout/swagger_user_nss77.yaml` | | | `c4b276c9221bd2905b20bbaaf7639425a3da56ed26c4c25db539fac8f463dad5` |
| `nss77/i16.json` | Estimated number of households for each size class of land possessed | 1,488 | 8 | `53592bdf4b3e043d62f452fb06b8626c650c51c6bdffbd412ce50d9b9da567e6` |
| `nss77/i24.json` | Average monthly income per agricultural household (paid out expenses) | 21,168 | 106 | `655a4973f64544526ed0f749b60ec3f3ece9ed785f6e8ea7a445266375efd626` |
| `nss77/i25.json` | Average monthly income per agricultural household (paid out and imputed expenses) | 21,168 | 106 | `8d33d40bc93835d3d0158433daeb6232eb1a94843a91702c5173103fde4c78f9` |
| `nss77/i33.json` | Distribution of amount of loan outstanding by source of loan (faulty, see "Checks") | 5,704 | 29 | `9c3e155a82e3bf0b10beec982a587214d5a23f481ef811af90d547d191791623` |
| `asg/asg-2024-25.pdf` | Agricultural Statistics at a Glance 2024-25 | | 476 | `bcb1b9e0da1b9b4eaf687d4f833ce506707d564388237844c69ae27b0e8eff17` |
| `asg/asg-2024.pdf` | "Agricultural Statistics at a Glance 2024" (the earlier edition, data to 2023-24; PDF changed 11 Nov 2025). Read for the edition check only; no values used | | 296 | `1481bff6f80bcf30734608640b71466add53512597c6cefbdfdf06f4fbddbea4` |
| `asg/category.html` | ES&E page "Agriculture Statistics - At a Glance" | | | `55a003b5c907db7609bc9a1c457c55fe89e9e7ec34562d2e90bab9829e1550c8` |
| `asg/report-2024.html` | ES&E page "Agricultural Statistics at a Glance 2024", which links the 2024-25 PDF | | | `967712e9984215d09f0037258f8db6bccfbb3b6e1560e2c850ed41b055d9cb10` |
| `asg/feed.xml` | RSS feed of the ASG category (editions 2016 to 2024) | | | `3f62fff42c904e864b73115d20235dc88050cd8da32fee772b8b6760a82aa496` |
| `asg/website-policies.html` | desagri.gov.in Website Policies (copyright policy) | | | `7b7a38b0aeed9ee81ce4842bddd1637c0b48e053bc87747042055cb752404075` |
| `agcensus/https:__agcensus.da.gov.in_.html` | Agriculture Census portal home page | | | `f7f5368e5e17d8e898e28f8c72f0007b69188e708a59ba4efc3f5f818867af4d` |

The PDFs carry their URL and fetch time in `nss77-587/_log.tsv` and `asg/_log.tsv`. The file names
were shortened after the download; the hashes are of the files as downloaded.

## How the CSVs are made

Run, from the repository root:

```sh
python3 -I pipeline/education/fetch_nss.py --raw raw/agriculture/nss77 --round 77 --survey 1 16 24 25 33
pipeline/common/fetch.sh --raw raw/agriculture/nss77-587 <Report 587 URL above> report.pdf
pipeline/common/fetch.sh --raw raw/agriculture/asg <ASG 2024-25 URL above> asg-2024-25.pdf
pipeline/agriculture/extract_text.sh
python3 -I pipeline/agriculture/build_nss77.py
python3 -I pipeline/agriculture/build_asg.py
```

`extract_text.sh` writes `work/agriculture/<folder>/<file>.txt` with `pdftotext -layout`. The ASG
URL has Devanagari letters and an en dash in its file name; give it to `fetch.sh` percent-encoded, as
in `asg/_log.tsv`.

## CSVs

Every CSV is in long format. `geography` is a slug from `research/data/geography.csv`, or `india`.
`value` keeps the publisher's digits, without the Indian comma grouping. An empty value is a value
the publisher does not give. `report_table` names the table that the value comes from;
`api_indicator` names the API indicator it was checked against.

### `agri-household-income-by-source.csv`

- 432 rows. India by size class of land possessed (seven classes and all sizes), and 28 states
  (all sizes). Six sources: `wages`, `leasing out of land`, `crop production`, `farming of animals`,
  `non-farm business`, `total`. Two sets: `expenses` is `paid out expenses` or `paid out and imputed
  expenses`. Period `2018-19` (July 2018 to June 2019).
- Unit: rupees per agricultural household per month, current prices. A net receipt can be negative
  (Haryana, farming of animals, paid out and imputed: -411).
- Source: Statements 5.1A, 5.1B (India by size class) and 5.1A.1, 5.1B.1 (states). Checked against
  API indicators 24 and 25 (social group "All", season "July 2018–June 2019"): every value agrees.
- Checked values: India total ₹10,218 with paid out expenses and ₹8,337 with imputed expenses
  (Statements 5.1A and 5.1A.1, page 129, and 5.1B.1, page 130); Punjab total ₹26,701 (Statement
  5.1A.1); Jharkhand total ₹4,895 (Statement 5.1A.1).

### `agri-household-debt.csv`

- 72 rows. India by size class of land possessed (seven classes and all sizes), and 28 states (all
  sizes). Two measures: `indebted agricultural households` (% of agricultural households) and
  `average outstanding loan` (rupees per agricultural household, indebted or not). Period `2019`.
- Source: Statements 5.7 (India) and 5.7.1 (states). Checked against columns 23 and 24 of Table 29 of
  Appendix A (one page for each state).
- Checked values: India 50.2% and ₹74,121 (Statement 5.7, page 93, and Statement 5.7.1, page 138);
  Andhra Pradesh 93.2% and ₹2,45,554; Nagaland 6.0% and ₹1,750 (Statement 5.7.1).

### `agri-household-loans-by-source.csv`

- 348 rows: India and 28 states, `2019`, 12 rows each. Ten sources as Statement 5.8.1 groups them
  (`scheduled commercial bank`, `regional rural bank`, `co-operative society`, `co-operative bank`,
  `self-help group (bank linked or not)`, `other institutional agencies`, `agricultural
  moneylender`, `professional moneylender`, `relatives and friends`, `other non-institutional
  agencies`), and two derived totals, `all institutional sources` and `all non-institutional
  sources`. `source_type` is `institutional` or `non-institutional`.
- Unit: % of the amount of loans outstanding.
- The two totals are `derived` (rule R3): the sum of the institutional columns (2 to 7) and of the
  non-institutional columns (8 to 11) of Statement 5.8.1. The `derived` column names the inputs. The
  report gives the all-India totals in Figure 5.9 (69.6 and 30.7), and the script checks the sums
  against them. Because each column is rounded, the two totals of a state can add to 99.9 or 100.1.
- Checked against the "all sizes" row of Table 29: a single source exactly (per 1000 / 10); a group of
  sources within 0.05 percentage points for each extra part (the rounding of the per 1000 values).
- Checked values: India scheduled commercial banks 44.5% (Statement 5.8.1, page 139, and Statement 5.8);
  Telangana professional moneylenders 41.3% (Statement 5.8.1); India all institutional sources 69.6%
  (derived; Figure 5.9, page 96).

### `land-possessed-by-size-class.csv`

- 696 rows: India and 28 states, three household types (`agricultural`, `non-agricultural`,
  `rural` for all rural households), seven size classes and `all sizes`. Period `July to December
  2018`. Unit: % of households of that type.
- Source: Statement 1.3.1 (three pages, one for each household type). Checked against API indicator
  16 (estimated households, visit 1): each published share is within 0.05 percentage points of the
  API count divided by the API total. API indicator 16 gives counts, not shares, so this check uses
  arithmetic on the API values; no CSV value is computed.
- Checked values: India agricultural households with 0.01 to 0.40 ha 34.2% (Statements 1.3 and
  1.3.1); West Bengal 65.5%; Andhra Pradesh 17.6% (Statement 1.3.1, page 102).

### `operational-holdings-nss.csv`

- 56 rows: India, seven size categories (with `all sizes`), share of holdings and share of area
  operated, for 2018-19, 2012-13 and 2002-03. 2002-03 has a kharif and a rabi value (`season`).
  Unit: %. The 2002-03 landless row is empty: the report gives no value.
- Source: Statement 2.9 of Report 587, which takes the earlier rounds from NSS Report No. 571.
  Report only; no API indicator gives it. The script checks that the categories add to 100 within
  rounding.
- Checked values: marginal holdings (up to 1 ha) 72.6% of holdings in 2018-19, 73.2% in 2012-13 and
  69.8% in 2002-03 (kharif) (Statement 2.9, page 58).

### `crop-area-production-yield-india.csv`

- 900 rows: India, rice, wheat and `total pulses`, 1950-51 to 2024-25, four measures: `area`
  (million hectares), `production` (million tonnes), `yield` (kg per hectare), `area under
  irrigation` (% of area; empty for 2024-25, and for some 1950s pulse years, where the table shows
  "-").
- Source: ASG 2024-25 Tables 2.4(a), 2.5(a) and 2.10(a).
- Checks: for every year, production / area gives the yield within the rounding of the two published
  values. The all-India yields of Tables 2.31, 2.32 and 2.35 (2005-06 to 2024-25) equal Table (a).
- Checked values: rice production 150.18 million tonnes and yield 2,929 kg per hectare in 2024-25
  (Table 2.4(a), page 49); wheat production 117.94 million tonnes in 2024-25 (Table 2.5(a)); pulses
  production 8.41 million tonnes in 1950-51 (Table 2.10(a), page 71).

### `crop-yield-by-state.csv`

- 2,000 rows: rice (33 states and UTs), wheat (34) and total pulses (33), 2005-06 to 2024-25. Unit:
  kg per hectare. Rice is the "Total" row of each state (all seasons). "NA" in the table is an empty
  value. Wheat rows for Goa, Lakshadweep, Mizoram and Puducherry are all empty.
- Source: ASG 2024-25 Tables 2.31 (rice), 2.32 (wheat) and 2.35 (total pulses).
- Checks: the yield of each major state in Tables 2.4(b), 2.5(b) and 2.10(b) equals this table.
- Checked values: Punjab wheat 5,123 in 2024-25 (Table 2.32, page 142); Uttar Pradesh rice 2,824 in
  2024-25 (Table 2.31, page 140); West Bengal rice 2,509 in 2005-06 (Table 2.31).

### `crop-production-by-state.csv`

- 363 rows: the 10 major producing states of each crop and India, 2023-24 and 2024-25: `area`,
  `share of India area`, `production`, `share of India production`, `yield`, and `area under
  irrigation` (2023-24 only).
- Source: ASG 2024-25 Tables 2.4(b), 2.5(b) and 2.10(b). ASG gives state production for these two
  years only. The India rows equal Table (a); production / area gives the yield within rounding.
- Checked values: Uttar Pradesh rice 20.76 million tonnes, 13.82% of India, in 2024-25 (Table 2.4(b),
  page 50); Punjab wheat 17.99 million tonnes in 2024-25 (Table 2.5(b)); Madhya Pradesh pulses 5.97
  million tonnes in 2023-24 (Table 2.10(b)).

### `operational-holdings-agriculture-census.csv`

- 90 rows: India, five size groups and all holdings, Agriculture Census 2005-06, 2010-11 and
  2015-16: `number of holdings` (thousand), `share of holdings` (%), `area operated` (thousand
  hectares), `share of area operated` (%), `average size` (hectares). `note` carries the table's
  marks: 2005-06 excludes Jharkhand; the 2015-16 average sizes are marked provisional ("(P)").
- Source: ASG 2024-25 Table 5.1 ("Department of Agriculture & Farmers Welfare (Agriculture Census
  2015-16)"). The script checks that the size groups add to the total within rounding.
- Checked values: 146,454 thousand holdings in 2015-16, average size 1.08 ha (Table 5.1, page 368;
  the Agriculture Census portal shows 146,453,741); marginal holdings 68.45% of holdings in 2015-16
  (Table 5.1).

## Checks done on 25 Nov 2026

`build_nss77.py` compares 1,784 report values with the API or with Table 29 and stops on any
difference. `build_asg.py` stops if a cross-table check fails. Both ran with no difference. The CSVs
above list three values each that were also read by eye against the report page.

- **API fault, NSS round 77 indicator 33.** The API gives Andhra Pradesh's loan values under every
  state and under All India: 31 identical sets. A query with `state_code=5` (Chhattisgarh) returns
  the same values. Andhra Pradesh's values match Table 29 of the report. The debt and loan CSVs
  therefore use the report statements, checked against Table 29. The script checks for this exact
  fault and stops if the API changes, so the README and the script get updated.
- **Table 29 label.** Table 29 prints the second size class as "0.01 - 0.04"; it is 0.01 to 0.40 ha.
  Statements 1.3.1 and 5.1A print the third class as "0.40 - 1.00"; the API and the class limits make
  it 0.41 to 1.00 ha. The CSVs use `0.01 to 0.40 ha` and `0.41 to 1.00 ha`.
- **ASG file changed after the Preface.** The contents page of the PDF names Table 2.1 "Normal
  Estimates (Average of 2019-20 to 2023-24)", but the table itself says "Average of 2020-21 to
  2024-25". The PDF was last changed on 18 Feb 2026. The crop values for 2024-25 may therefore be
  later than the Preface date. ASG gives no status (advance, final) for the 2024-25 crop values.
  The rice values for 2022-23 and 2023-24 are the same in the earlier "2024" edition.

## Decisions

- **2012-13 income.** Neither Report 587 nor the API gives the 2012-13 income of NSS round 70, so the
  CSV has no 2012-13 value. It would also not compare directly. Round 77 adds income from leasing
  out land, which round 70 did not collect (para 1.6.6), and round 70 had no imputed expenses (para
  1.6.5). MoSPI asks for "due care" in any comparison (para 3.5.1.5). The nearest match is the
  paid-out set of round 77, less the rent from land. A future update could add round 70 from its
  own report (NSS Report No. 576) with a method break.
- **Groups of states.** The report and the API give two groups (para 3.0.1.1). "Group of NE States"
  joins Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim and Tripura, which the report
  also gives one by one. "Group of UTs" joins Andaman and Nicobar Islands, Chandigarh, Dadra and Nagar
  Haveli, Daman and Diu, Lakshadweep and Puducherry, because each has fewer than 300 sample rural
  households. The groups have no slug in `geography.csv`, so the CSVs leave them out. No UT other
  than Jammu and Kashmir has a value of its own.
- **Jammu and Kashmir.** NSS round 77 (2019) and ASG up to 2019-20 treat Jammu and Kashmir with Ladakh.
  ASG gives Ladakh separately from 2020-21 for wheat and pulses. The CSVs use `jammu-kashmir` as the
  publisher names it.
- **Old UTs and "Others".** ASG gives Dadra and Nagar Haveli and Daman and Diu separately (they merged
  in 2020), and an "Others" row. They have no slug, so the yield CSV leaves them out.
- **Telangana and Andhra Pradesh.** ASG gives Telangana values from 2010-11, before the state was
  formed in 2014. The tables do not say whether the Andhra Pradesh values before 2010-11 include
  Telangana. A chart that crosses 2010-11 for either state needs a note.
- **Which second source.** ASG gives a 75-year series for India and a 20-year series by state, in
  one dated release, with PDF tables. The Agriculture Census gives land holdings once in five years,
  and its latest published round is 2015-16. So ASG is the main second source, and the census holdings
  come through ASG Table 5.1. Both are rule R1 publishers.
- **Rice seasons.** Table 2.31 gives rice yield by season (kharif, rabi, and summer from 2022-23).
  The CSV keeps only the state total, because the seasons change in 2022-23.
- **Indicators not used.** The API has 33 NSS round 77 indicators. Livestock, crop sales, MSP
  awareness, crop insurance and loss, and technical advice (indicators 21 to 23, 26 to 32, 34 to 51)
  are not in a CSV. They suit later charts.

## Gaps and cautions

- **Rural agricultural households only.** NSS round 77 covers rural India. Its income and debt figures
  are for agricultural households (54.0% of rural households), not for all farmers and not for farm
  labourers. They are not the incomes of all rural households.
- **Debt is not comparable with the Debt and Investment Survey.** NSS Report 588 (AIDIS, also round
  77) gives the share of indebted rural "cultivator" households. The report says the two are "not
  comparable" (para 1.8.3).
- **Income is nominal.** The incomes are in current prices of 2018-19. Do not compare them with later
  prices without a deflator.
- **Small samples.** The report gives a state only if it has at least 300 sample rural households
  (para 3.0.1.1). Some cells still rest on few households. Table 29 prints the sample count of each
  cell: in Arunachal Pradesh, loans from relatives and friends (23.5% of the amount) rest on 34
  sample households.
- **Possible error in ASG.** Table 2.35 gives Meghalaya's pulse yield as 469 kg per hectare in 2023-24,
  against 1,468 in 2022-23 and 1,469 in 2024-25 (Table 2.35, page 151). The CSV keeps 469, the publisher's digit. A chart
  that uses it needs a note, or should leave it out.
- **Area under irrigation for pulses** rises from 24.06% in 2022-23 to 34.87% in 2023-24 (Table
  2.10(a)). The table gives no reason.
- **Licence.** desagri.gov.in allows reproduction "after taking proper permission by sending a mail
  to us". Before a page shows the ASG figures, the owner should send that request and keep the reply.
  MoSPI states no licence.
- **Agriculture Census 2021-22.** Not released on the census portal on 25 Nov 2026. Check again
  before the topic goes live.

## Proposed charts

Kinds are from `src/content/types.ts`.

| Slug | Kind | CSV | Period | Why |
| --- | --- | --- | --- | --- |
| `farm-income-by-source` | `bars` (stacked, by size class of land possessed) | `agri-household-income-by-source.csv` (India, paid out expenses) | 2018-19 | The core figure: ₹10,218 a month, and wages, not crops, are the largest source for households with less than 1 ha |
| `farm-income-by-state` | `states` | `agri-household-income-by-source.csv` (total, all sizes, paid out expenses) | 2018-19 | From ₹4,895 in Jharkhand to ₹29,348 in Meghalaya and ₹26,701 in Punjab |
| `farm-households-in-debt-by-state` | `states` | `agri-household-debt.csv` (indebted agricultural households) | 2019 | Half of agricultural households are in debt, and more than 90% in Andhra Pradesh and Telangana |
| `farm-debt-by-land-size` | `columns` | `agri-household-debt.csv` (India, by size class) | 2019 | Debt grows with land: ₹26,883 for less than 0.01 ha to ₹7,91,132 for more than 10 ha |
| `farm-loans-banks-and-moneylenders` | `bars` (stacked to 100, by state) | `agri-household-loans-by-source.csv` (the two derived totals) | 2019 | Where moneylenders still matter: 57.6% of loan amounts in Telangana come from non-institutional sources |
| `land-possessed-by-farm-households` | `columns` | `land-possessed-by-size-class.csv` (India, agricultural households) | July to December 2018 | Seven in ten agricultural households have 1 ha or less |
| `farm-holdings-getting-smaller` | `line` (`joined`) | `operational-holdings-agriculture-census.csv` (average size, all holdings) | 2005-06 to 2015-16 | Average holding fell from 1.23 ha to 1.08 ha (2005-06 excludes Jharkhand: a note) |
| `rice-wheat-pulses-production` | `line` | `crop-area-production-yield-india.csv` (production) | 1950-51 to 2024-25 | Seventy-five years of the main food crops, from one publisher |
| `crop-yields-over-time` | `line` | `crop-area-production-yield-india.csv` (yield) | 1950-51 to 2024-25 | Rice yield rose from 668 to 2,929 kg per hectare; pulses lag |
| `wheat-yield-by-state` | `dots` (2005-06 hollow, 2024-25 filled) | `crop-yield-by-state.csv` (wheat) | 2005-06 and 2024-25 | Which states gained most; Punjab and Haryana lead |
