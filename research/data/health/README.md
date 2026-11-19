# Health

Data gathered on 17 and 18 Nov 2026 from ORGI, IIPS, PIB, MoHFW, NHSRC and WHO. The notes identify shares calculated from published figures. No values were interpolated.

## Questions this topic answers

1. How many babies die before their first birthday, and how fast has that fallen since 1971?
2. How many women die from pregnancy and childbirth, and where is the risk highest?
3. How long do people in India live, and how large is the gap between states and between women and men?
4. How have child nutrition and care changed across the NFHS rounds?
5. How much of the health bill do households pay from their own pockets?
6. How has India's sex ratio at birth changed?

## Charts

### H1. Infant mortality since 1971

- Type: line. Series: total, rural, urban.
- Unit: infant deaths per 1,000 live births.
- Geography: India. Period: 1971 to 2024, annual.
- CSV: `imr-india-1971-2024.csv`
- Sentence: "In 1971, 129 of every 1,000 babies born in India died before their first birthday. In 2024, the rate was 24, or about 1 in 42."
- Source: ORGI, SRS Compendium of India's Fertility and Mortality Indicators 1971-2013, Table 1 (1971 to 2013); SRS Bulletin, Table 1, one per year (2014 to 2024; the 2024 bulletin is Vol. 59 No. 1, May 2026).

### H2. Infant mortality by state, 2024

- Type: ranked bar by state, and tile map by state. All 36 states and UTs, plus India.
- Unit: infant deaths per 1,000 live births.
- Geography: 36 states and UTs. Period: 2024.
- CSV: `imr-by-state-2024.csv`. The `estimate_basis` column marks the 15 smaller states and UTs, whose rate is a three-year pool (2022-24). Rural and urban rates are given for India and the 21 bigger states only.
- Sentence: "Chhattisgarh had the highest infant mortality rate in 2024, at 36 per 1,000 live births. Kerala had the lowest of the bigger states, at 8."
- Source: ORGI, SRS Bulletin 2024 (Vol. 59 No. 1, May 2026), Table 1.
- Extra table for a view toggle: `child-mortality-by-state-2024.csv` has the under-5 mortality rate (U5MR, by sex and residence) and the neonatal mortality rate (NMR) for India and the 22 states in the SRS Statistical Report 2024, Statements 53 and 48. U5MR was 28 for India; it ranged from 9 in Kerala to 41 in Madhya Pradesh and Uttar Pradesh.

### H3. Maternal mortality since 1997-98

- Type: line (one point per pooled period).
- Unit: maternal deaths per 100,000 live births (maternal mortality ratio, MMR).
- Geography: India. Period: 1997-98 to 2022-24.
- CSV: `mmr-india-1997-2024.csv`
- Sentence: "India's maternal mortality ratio fell from 398 per 100,000 live births in 1997-98 to 87 in 2022-24. The SDG target is below 70."
- Source: ORGI, SRS Compendium 1971-2013, Table 13 (1997-98 to 2011-13); SRS Special Bulletin on Maternal Mortality in India 2022-24 (May 2026), trend chart labels (2014-16 to 2022-24).

### H4. Maternal mortality by state, 2022-24

- Type: ranked bar by state, with 95% confidence interval whiskers.
- Unit: maternal deaths per 100,000 live births.
- Geography: India, 19 bigger states, "other states" as one group, and 3 regional subtotals. Period: 2022-24.
- CSV: `mmr-by-state-2022-24.csv`
- Sentence: "Uttar Pradesh had the highest maternal mortality ratio in 2022-24, at 154 per 100,000 live births. Kerala had the lowest, at 24."
- Source: ORGI, SRS Special Bulletin on Maternal Mortality in India 2022-24 (May 2026), Table 1.

### H5. Life expectancy at birth since 1970-75

- Type: line. Series: total, male, female (residence total). Rural and urban are also in the CSV.
- Unit: years.
- Geography: India. Period: 1970-75 to 2020-24, five-year moving periods (plot at `mid_year`).
- CSV: `life-expectancy-india-1970-2024.csv`
- Sentence: "A baby born in India in 2020-24 could expect to live 70.6 years, up from 49.7 years in 1970-75. Women live 4.1 years longer than men: 72.8 against 68.7."
- Source: ORGI, SRS Based Abridged Life Tables 2020-24 (May 2026), Statement 1.

### H6. Life expectancy at birth by state and sex, 2020-24

- Type: ranked dot plot by state (female and male dots per state), or ranked bar of the total.
- Unit: years.
- Geography: India and 22 states (the 21 bigger states and Himachal Pradesh). Period: 2020-24.
- CSV: `life-expectancy-by-state-2020-24.csv`
- Sentence: "Life expectancy at birth ranges from 64.7 years in Chhattisgarh to 75.6 years in Kerala, a gap of almost 11 years."
- Source: ORGI, SRS Based Abridged Life Tables 2020-24 (May 2026), Statement 3.

### H7. Child nutrition and care by state: NFHS-6 against NFHS-5

- Type: small multiples of slope charts (NFHS-5 to NFHS-6) or ranked bars, one panel per indicator. Tile map for any one indicator.
- Indicators: children under 5 stunted, wasted, severely wasted; institutional births; children 12-23 months fully vaccinated (card only, and card or recall); all women 15-49 anaemic (NFHS-5 only).
- Unit: percent.
- Geography: India and 35 states and UTs in NFHS-6 (no Manipur). Anaemia: India and all 36.
- Period: NFHS-5 (2019-21) and NFHS-6 (2023-24).
- CSV: `nfhs-key-indicators-by-state.csv`
- Sentence: "29.3% of children under 5 in India were stunted in 2023-24, down from 35.5% in 2019-21. Stunting fell in 33 of the 35 states and UTs surveyed."
- Source: IIPS and MoHFW, NFHS-6 (2023-24) India and State/UT Fact Sheets (May 2026, provisional), which print NFHS-5 totals beside NFHS-6. Anaemia: PIB release 1782638 (Ministry of Women and Child Development, 17 Dec 2021), Annexure-I, citing NFHS-5.

### H8. Out-of-pocket health spending

- Type: line for India. The annual Indian series breaks at the 2017-18 survey change. A marker shows the addition of new sources in 2022-23. The state view ranks the 21 states for 2023-24.
- Unit: percent of total health expenditure (THE) for Indian sources. Percent of current health expenditure (CHE) for WHO. THE includes capital spending. CHE excludes it. Indian government health expenditure (GHE) can include donor funds channelled through government. WHO measures domestic general government health expenditure (GGHE-D).
- Geography: India (2000 to 2023-24); 21 states (2023-24).
- CSV: `out-of-pocket-health-spending.csv`. The `period` column keeps each publisher's period label. The `year` column holds the year used to align sources. The `source_kind` column gives `official`, `archived copy` or `international estimate`. The `source` column identifies the release. The `use` column marks rows for the chart and WHO rows kept for overlap checks.
- Sentence: "Households paid 42.7% of India's health bill out of their own pockets in 2023-24, down from 64.2% in 2013-14."

#### Indian accounts and WHO estimates

- **2001-02.** The standalone MoHFW report was unavailable. Use the archived MoHFW commission report. Divide the direct household payments in Table 2.14 (₹72,758.71 crore, extrapolated from the NSS) by total spending in Figure 2.5 (₹1,08,732 crore). This gives 66.92% out of pocket. The 68.8% household slice in Figure 2.5 covers household spending as a whole. Add the three government slices (7.2%, 14.4% and 2.2%) for 23.8%. This sum covers central, state and local governments. The 2004-05 NHA says its reassessment found that the 2001-02 method overestimated out-of-pocket spending (p. 18).
- **2004-05.** Divide archived NHA Table 4.1 out-of-pocket spending by Table 1.1 total spending. The result is 69.52%. Table 6 of the 2013-14 NHA cites those amounts and prints 69.4%. Keep the ratio from the original amounts. Use the 22.5% government share from the 2013-14 comparison. The 2004-05 report gives 19.67% for the narrower public spending measure in Table 1.1. Both early accounts use SHA 1.0. The annual accounts use SHA 2011.
- **2005-06 to 2008-09.** Divide public expenditure by total expenditure in Table 1.5 of the archived 2004-05 NHA. Keep these provisional shares in a separate series. The 2007-08 input is a revised estimate. The 2008-09 input is a budget estimate. The table gives no direct household payments.
- **2013-14 to 2023-24.** Keep the published India shares from Table 1 of the 2023-24 NHA. State shares come from Table A.6. The 2013-14 results match Table 6 of the 2013-14 report at 64.2% and 28.6%.
- **WHO 2000 to 2023.** Use the published values of `GHED_OOPSCHE_SHA2011` and `GHED_GGHE-DCHE_SHA2011` for India. The December 2025 workbook has both shares through 2023 for India. Use the WHO shares where the chart has no corresponding Indian figure. Keep the other WHO values in the CSV for comparison. Use separate solid series for Indian values and dashed series for WHO estimates. The early Indian benchmarks each have one point per share.
- **Gaps.** No source checked supplied either comparable share before 2000. The 2005 commission report gives household amounts for 1995-96 and 2003-04 but no matching total expenditure in Table 2.14. The ministry's [Health Sector Financing by Centre and States-UTs PDF](https://mohfw-dohfw.gov.in/static/uploads/2025/10/1fbdeda91f31ab2efbeb61c54dce63b7.pdf) and the [2013-14 to 2015-16 edition](https://mohfw-dohfw.gov.in/static/uploads/2025/10/6b5f71ce0dba20e70f2d172eee6b0c0c.pdf) returned HTTP 403. No figures were taken from them.

#### Overlap checks

Match the WHO year to the start of the Indian financial year and keep the published period labels. Differences are WHO minus India, in percentage points. The Indian column uses THE and the WHO column uses CHE. Indian public expenditure replaces the government column for the four provisional periods.

| NHA period | WHO year | India out of pocket | WHO out of pocket | Difference | India government or public | WHO domestic government | Difference |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 2001-02 | 2001 | 66.92 | 74.11 | +7.19 | 23.8 | 18.88 | -4.92 |
| 2004-05 | 2004 | 69.52 | 72.48 | +2.96 | 22.5 | 17.98 | -4.52 |
| 2005-06 | 2005 | | | | 22.72 | 20.13 | -2.59 |
| 2006-07 | 2006 | | | | 23.82 | 20.51 | -3.31 |
| 2007-08 | 2007 | | | | 25.09 | 20.90 | -4.19 |
| 2008-09 | 2008 | | | | 26.70 | 22.63 | -4.07 |
| 2013-14 | 2013 | 64.2 | 69.07 | +4.87 | 28.6 | 23.07 | -5.53 |
| 2014-15 | 2014 | 62.6 | 67.01 | +4.41 | 29.0 | 23.66 | -5.34 |
| 2015-16 | 2015 | 60.6 | 64.66 | +4.06 | 30.6 | 25.64 | -4.96 |
| 2016-17 | 2016 | 58.7 | 63.21 | +4.51 | 32.4 | 26.84 | -5.56 |
| 2017-18 | 2017 | 48.8 | 55.11 | +6.31 | 40.8 | 32.95 | -7.85 |
| 2018-19 | 2018 | 48.2 | 53.23 | +5.03 | 40.6 | 34.29 | -6.31 |
| 2019-20 | 2019 | 47.1 | 52.00 | +4.90 | 41.4 | 35.07 | -6.33 |
| 2020-21 | 2020 | 44.4 | 49.51 | +5.11 | 42.8 | 36.25 | -6.55 |
| 2021-22 | 2021 | 39.4 | 45.11 | +5.71 | 48.0 | 40.40 | -7.60 |
| 2022-23 | 2022 | 43.4 | 44.54 | +1.14 | 43.7 | 40.40 | -3.30 |
| 2023-24 | 2023 | 42.7 | 43.89 | +1.19 | 43.5 | 39.02 | -4.48 |

On a CHE basis, the out-of-pocket shares in Table 2 of the latest NHA match WHO to one decimal place from 2017-18 to 2021-22. The last two Indian shares are 49.9% and 48.5%. The WHO shares are 44.54% and 43.89%. The government shares also differ on a CHE basis. For 2023-24 the Indian government current share was 36.0%, and WHO reports 39.02% for 2023.

#### Raw health spending files

Read all files on 18 Nov 2026. Store them as data under `raw/health/`. Use the WHO workbook to cross-check the API values. Build the CSV from the PDFs and the two JSON files with `python3 -I pipeline/health/build_health_spending.py` at the repository root. The script calls `pdftotext -layout`.

| Raw file under `raw/health/` | Source kind | URL | SHA-256 |
| --- | --- | --- | --- |
| `macroeconomics-and-health/report.pdf` | archived copy | https://archive.org/download/PARI.report-of-the-national-commission-on-macroeconomics-and-health/report-of-the-national-commission-on-macroeconomics-and-health.pdf | `25fd60c008a4a980a0dd3d3e254befdc31831da4c13823ea2ab94d1b926058d6` |
| `nha-2004-05/report.pdf` | archived copy | https://archive.org/download/PARI.national-health-accounts-2004-05/national-health-accounts-2004-05.pdf | `8e9d739e36dbffd5ea3e9cfe22e155f6ba18cd7aaee6e216edebcf699cc11c65` |
| `nha-2013-14/report.pdf` | official | https://nhsrcindia.org/sites/default/files/2021-06/NATIONAL%20HEALTH%20ACCOUNTS-%20Estimates%20for%20India-2013-14.pdf | `672eac9b24fb5edfe7d737ff13ebf58a116f2970602835163b55c47ee5e4189d` |
| `nha-2023-24/report.pdf` | official | https://nhsrcindia.org/sites/default/files/2026-11/NHA%20Report%202023-24.pdf | `cf60c3fd530a585f9426595505c1301a2877e317adca4f8d17097c84e190e119` |
| `who-ghed/out-of-pocket/out-of-pocket.json` | international estimate | https://ghoapi.azureedge.net/api/GHED_OOPSCHE_SHA2011?$filter=SpatialDim%20eq%20%27IND%27 | `091b6d22056e5dfb4560fc6cf0b9e05e3fb6d282ebf0b23be05d5f3b2aab0842` |
| `who-ghed/government/government.json` | international estimate | https://ghoapi.azureedge.net/api/GHED_GGHE-DCHE_SHA2011?$filter=SpatialDim%20eq%20%27IND%27 | `660f01bc7c22acdb3cd452a5c10ad4c186d70f9221a159d6a321a30a3eed4204` |
| `who-ghed/workbook/indicators.xlsx` | international estimate | https://apps.who.int/nha/database/Home/IndicatorsDownload/en | `8cf7c04ede53281ab9003353806b55329068a090d32a68e8df1766676a886b3c` |

### H9. NFHS national trends and state stunting history

The original national chart compared NFHS-5 and NFHS-6. The national time series uses four chart cards, so each method change has its own marker. `nfhs-india-history.csv` contains 42 India observations. `basis` identifies the group or method. `mid_year` is the middle year of each round's fieldwork (NFHS-5: 2020), which places the round on the time axis. `source_doc` and `note` identify the table and coverage. All estimates retain the published digits.

| Chart | Rounds and source | Comparability |
| --- | --- | --- |
| Child stunting and wasting | NFHS-2 and NFHS-3, NFHS-3 Table 10.3. NFHS-3 and NFHS-4, each report's Table 10.2. NFHS-5 and NFHS-6, NFHS-6 India fact sheet. | The NFHS-3 report places both early rounds on the WHO 2006 growth standards for the last two children under age 3 of ever-married women. Keep those estimates on dashed lines. Start the under-5 lines at NFHS-3. Omit the original NFHS-1 and NFHS-2 estimates on the NCHS reference. NFHS-1 also did not measure height in five states, as NFHS-2 explains in §7.5. |
| Births in health facilities | NFHS-1 to NFHS-3, NFHS-3 Table 8.23. NFHS-3 and NFHS-4, NFHS-4 Table 8.27. NFHS-5 and NFHS-6, NFHS-6 India fact sheet. | The early estimate covers the last two births in three years to ever-married women. The later estimate uses all births. NFHS-3 to NFHS-5 use five years. NFHS-3 gives 40.8% and 38.7% on the two bases. Show both at the break. |
| Full childhood vaccination | NFHS-1 Table 9.10, NFHS-2 Table 6.9 and NFHS-3 and NFHS-4 Table 9.3 for card seen. NFHS-3 and NFHS-4 Table 9.6 for card or recall. NFHS-6 India fact sheet for NFHS-5 and NFHS-6. | Early card-only rates cover children whose cards the interviewer saw. Keep them separate from the late fact-sheet rates. The early card-or-recall trend uses the basic doses in the national reports. NFHS-5 first records pentavalent doses alongside DPT, so split the card-or-recall line at NFHS-5 too. NFHS-2 Table 6.9 limits its estimates to surviving children among the two most recent births in three years. The NFHS-3 report uses NFHS-1 and NFHS-2 in its published trend table. |
| Anaemia among women | NFHS-2 and NFHS-3, NFHS-3 Table 10.24.1. NFHS-4, Table 10.21.1. NFHS-5, PIB release 1782638. | Keep the ever-married and all-women estimates on separate lines. Both are for ages 15 to 49. NFHS-3 reports both and excludes Nagaland. NFHS-1 did not test haemoglobin. NFHS-6 did not report anaemia. |

`nfhs-stunting-history-by-state.csv` contains 107 observations. NFHS-4 Table 10.2 adds India and 33 current states and UTs, including Andhra Pradesh and Telangana. Exclude the NFHS-4 Jammu and Kashmir row because it includes Ladakh. Exclude the separate Dadra and Nagar Haveli and Daman and Diu rows because NFHS-5 and NFHS-6 report a single UT. Omit the three NFHS-4 points for these current UTs. The NFHS-5 report, Table 10.2, supplies Manipur (23.4%). The rest of NFHS-5 and all of NFHS-6 come from the existing `nfhs-key-indicators-by-state.csv`. Manipur has no NFHS-6 estimate.

**NFHS overlap checks**

- The NFHS-4 report, Table 10.3, repeats NFHS-3 stunting, wasting and severe wasting at 48.0%, 19.8% and 6.4%. The NFHS-5 report, Table 10.3, repeats NFHS-4 at 38.4%, 21.0% and 7.4%. The NFHS-5 report matches all three India values from the NFHS-6 fact sheet at 35.5%, 19.3% and 7.7%.
- All 36 shared NFHS-5 stunting estimates (India and 35 states and UTs) match between NFHS-5 Table 10.2 and the NFHS-5 columns in the NFHS-6 fact sheets.
- NFHS-3 Table 8.12 agrees with the NFHS-4 trend table on 38.7% for all births. NFHS-5 Table 8.29 repeats NFHS-4 at 78.9% and agrees with the NFHS-6 fact sheet on the NFHS-5 value of 88.6%.
- The NFHS-1 and NFHS-2 source-of-information tables give the same national card-or-recall estimates as NFHS-3 Table 9.6 (35.4% and 42.0%). NFHS-4 Table 9.6 repeats NFHS-3 at 43.5%. NFHS-5 Table 9.6 repeats NFHS-4 at 62.0% and agrees with the NFHS-6 fact sheet on the NFHS-5 estimate of 76.6%. NFHS-5 Table 9.3 reports 74.2% for the share of all children whose doses are documented by card. That tabulation is different from the fact-sheet card-only rate of 83.8%. Keep the fact-sheet estimate and use it only with its paired NFHS-6 estimate.
- NFHS-4 Table 10.21.1 repeats NFHS-3 anaemia among all women at 55.3%. NFHS-5 Table 10.23.1 repeats NFHS-4 at 53.1% and agrees with the PIB NFHS-5 estimate of 57.0%. NFHS-2 Table 7.6 reports 51.8% among ever-married women, the same as the NFHS-3 trend table.

### H10. Sex ratio at birth in India, 1998-00 to 2022-24

`sex-ratio-at-birth-india.csv` contains 75 observations for total, rural and urban residence across 25 overlapping three-year periods. The line uses the national total. The SRS Compendium starts at 1998-00. Its table labels each window by the middle year. The CSV gives both the middle year and the full period. All ratios retain the published integers.

Use Table 16 from each source. Use the newest report for a period with more than one source. The compendium supplies 1998-00 to 2010-12. The 2017 report supplies 2011-13 and 2012-14. The 2019 report supplies 2013-15. The 2020 report supplies 2014-16 to 2017-19. The 2024 report supplies 2018-20 to 2022-24.

The releases agree in every overlap checked, for total, rural and urban. The compendium and 2017 report share 2011-13. The 2019 report shares 2013-15 to 2015-17 with the 2017 report. The 2020 report shares 2014-16 to 2017-19 with the 2019 report. The 2024 report shares 2018-20 with the 2020 report. Table 16 in 2024 also agrees with the existing population CSV for all 15 India observations. The ORGI corrigendum for the 2015 to 2020 reports changes other tables and leaves Table 16 intact.

ORGI replaced its sample in 2004 and 2014. The chart marks both years. Some three-year periods straddle a sample change. The line follows ORGI's continuous series for the same national ratio.

### History source files

Read 18 Nov 2026. Paths are relative to `raw/health/`. The PDF reports come from IIPS and its partners, and ORGI. The DHS Program hosts the IIPS reports. The [IIPS NFHS project site](https://rchiips.org/NFHS/) and its [NFHS-4 India fact sheet](https://rchiips.org/NFHS/pdf/NFHS4/India.pdf) failed certificate validation. The alternate IIPS NFHS project site also failed certificate validation for the NFHS-6 fact sheets. The MoHFW PDF and PIB release 2266600 returned HTTP 403. The historical build uses the previously verified NFHS-6 values already in `nfhs-key-indicators-by-state.csv`. The source register below gives the URLs and hashes for those fact sheets and the PIB anaemia release.

| Raw file | Publisher and release | URL | SHA-256 |
| --- | --- | --- | --- |
| `nfhs-1/report.pdf` | IIPS for MoHFW, NFHS-1 India report, Aug 1995, DHS Program archive | https://dhsprogram.com/pubs/pdf/FRIND1/FRIND1.pdf | `424f8612d23fa2a6fbf506a33d1d19c0f39386c90c23b26a79c483f92c126555` |
| `nfhs-2/report.pdf` | IIPS and ORC Macro, NFHS-2 India report, Oct 2000, DHS Program archive | https://dhsprogram.com/pubs/pdf/FRIND2/FRIND2.pdf | `08c7b5cb1776a2ac9247f69e639cd1a31328181f3d0aa89dfb12973d03655a32` |
| `nfhs-3/report.pdf` | IIPS and Macro International, NFHS-3 India report, Sep 2007, DHS Program archive | https://dhsprogram.com/pubs/pdf/FRIND3/FRIND3-Vol1AndVol2.pdf | `c1fb9db3227ef6dea264bd5babdbbd9fabcb5a80c640bfdfb12c9d070d3a270f` |
| `nfhs-4/report.pdf` | IIPS and ICF, NFHS-4 India report, Dec 2017, DHS Program archive | https://dhsprogram.com/pubs/pdf/FR339/FR339.pdf | `ae829501207767caf54c935f696bb4a39c4ee763f2261d2c1a87ded89cc1e19d` |
| `nfhs-5/report.pdf` | IIPS and ICF, NFHS-5 India report, Vol. I, Mar 2022 cover date, DHS Program archive | https://dhsprogram.com/pubs/pdf/FR375/FR375.pdf | `ce1fa5e3c93e5f0019583688e0431c9ec1c2c028b624a4dd76f07c5f5e81128a` |
| `srs-compendium/report.pdf` | ORGI, SRS Compendium 1971-2013, 2014 | https://censusindia.gov.in/nada/index.php/catalog/33218/download/37035 | `8085ab18a367ab6fe96718641c04de93c494522588135e72f51bb3dcb3394984` |
| `srs-2017/report.pdf` | ORGI, SRS Statistical Report 2017, 2020 catalogue year | https://censusindia.gov.in/nada/index.php/catalog/44373/download/48042/SRS_STAT_2017.pdf | `a82bf4df15f910ca769441349972303e5213a8160c5fc00d511a2f308330e5f4` |
| `srs-2019/report.pdf` | ORGI, SRS Statistical Report 2019, 1 Mar 2022 catalogue date | https://censusindia.gov.in/nada/index.php/catalog/44375/download/48046/SRS_STAT_2019.pdf | `50efe7a9f00db7df697f4f71ee8db0c4991a4a80f35f6a02d204689809f79ac9` |
| `srs-2020/report.pdf` | ORGI, SRS Statistical Report 2020, 22 Sep 2022 catalogue date | https://censusindia.gov.in/nada/index.php/catalog/44376/download/48048/SRS_STAT_2020.pdf | `aae760b4f2b4d16bfa275a6f0690c19bc203bdd7ef7f82bfd66fe3304373e56a` |
| `srs-2024/report.pdf` | ORGI, SRS Statistical Report 2024, 20 May 2026 | https://censusindia.gov.in/nada/index.php/catalog/47152/download/51396 | `f922a4a817e612c78a7827e4f526f69dc433d68c4af287b76d418337637c946a` |
| `srs-corrigendum/report.pdf` | ORGI, Corrigendum No. 09/6/2020-VS(SRS), date not stated | https://censusindia.gov.in/nada/index.php/catalog/44375/download/48047/Corrigendum_to_SRS_Reports.pdf | `04e3f41129a113be3292dc05c7e5b5d460880b00fa93a158cfc2168cead8e861` |
| `srs-catalog/index.html` | ORGI, statistical report catalogue search, live list | https://censusindia.gov.in/nada/index.php/catalog/?sk=SRS%20Statistical%20Report | `f5cc57d82a839b9de11b71c3c155e1c356f73116f17ae1d7e4ebd8f` |
| `srs-2007-search/source` | ORGI, 2007 report catalogue search, live list | https://censusindia.gov.in/nada/index.php/catalog/?sk=SRS%20Statistical%20Report%202007 | `11a20dd0b335e3fadc97e712fb86bcd19bd18f17178bb9d6a68a9685b6c17ffe` |
| `srs-2010-search/source` | ORGI, 2010 report catalogue search, live list | https://censusindia.gov.in/nada/index.php/catalog/?sk=SRS%20Statistical%20Report%202010 | `9f6ba300f519475c4ea13f13ddbf17d966341da1a996b91eda41249c2fd297ff` |
| `srs-2016-catalog/source` | ORGI, SRS Statistical Report 2016 catalogue entry, live page | https://censusindia.gov.in/nada/index.php/catalog/44372 | `f455235403c42a49bae8cba4fb92b988373c7af06a00f0ccf6f3d4d406827a33` |
| `srs-2017-catalog/source` | ORGI, SRS Statistical Report 2017 catalogue entry, live page | https://censusindia.gov.in/nada/index.php/catalog/44373 | `fcdb4f0017085fa809415bb6b963f819b9438d714b768be95f7226b454ca334b` |
| `srs-2019-catalog/source` | ORGI, SRS Statistical Report 2019 catalogue entry, live page | https://censusindia.gov.in/nada/index.php/catalog/44375 | `c2cfbc9d1ee8b435ef2b4a0a1ee9f7e0cd276300999b2899b96a6c6f3ae98254` |
| `srs-2020-catalog/source` | ORGI, SRS Statistical Report 2020 catalogue entry, live page | https://censusindia.gov.in/nada/index.php/catalog/44376 | `96b2441cd432a76afa393c91e6c81def26bbbe73654bef3a2fef24b18175715e` |

To rebuild the three history CSVs, run both scripts from the repository root. They call `pdftotext -layout` on the local raw PDFs and keep the published digits.

```sh
python3 -I pipeline/health/build_nfhs_history.py
python3 -I pipeline/health/build_sex_ratio_at_birth.py
```

## Headline figures

| Figure | Value | Period | Source |
| --- | --- | --- | --- |
| Infant mortality rate | 24 per 1,000 live births (129 in 1971) | 2024 | SRS Bulletin 2024, Table 1 |
| Maternal mortality ratio | 87 per 100,000 live births (398 in 1997-98) | 2022-24 | SRS Special Bulletin on Maternal Mortality 2022-24 |
| Life expectancy at birth | 70.6 years (women 72.8, men 68.7) | 2020-24 | SRS Abridged Life Tables 2020-24, Statement 1 |
| Under-5 mortality rate | 28 per 1,000 live births | 2024 | SRS Statistical Report 2024, Statement 53 |
| Children under 5 stunted | 29.3% (35.5% in 2019-21) | 2023-24 | NFHS-6 India Fact Sheet (provisional) |
| Out-of-pocket share of health spending | 42.7% of total health expenditure (64.2% in 2013-14) | 2023-24 | National Health Accounts 2023-24, Table 1 |
| Kerala, total health spending per person (note on chart 4.2) | Rs 13,605 | 2023-24 | MoHFW and NHSRC, National Health Accounts Estimates for India 2023-24, Nov 2026, Annexure A.2, Table A.6 "Key Health Financing Indicators for select States", row 10 Kerala, THE per capita in Rs (PDF page 87). Checked 18 Nov 2026 |
| SDG target for maternal mortality (reference line on chart 1.2) | less than 70 per 100,000 live births | by 2030 | ORGI, SRS Special Bulletin on Maternal Mortality in India 2022-24, 20 May 2026, page 1, paragraph 2: "The target 3.1 of Sustainable Development Goals (SDG) ... aims at reducing the global maternal mortality ratio to less than 70 per 100,000 live births". Checked 18 Nov 2026 |

Other national values in the sources: institutional births 90.6% (NFHS-6; 88.6% in NFHS-5); full immunisation, card only, 87.1% (83.8%); all women 15-49 anaemic 57.0% (NFHS-5, 2019-21); neonatal mortality rate 18 (2024).

## Sources

All read on 17 Nov 2026. Raw downloads are not kept in the repository; the URL and sha256 below identify each file. No page stated a reuse licence, unless shown.

| Publisher | Release | Release date | Period | URL | sha256 of raw file |
| --- | --- | --- | --- | --- | --- |
| ORGI, Vital Statistics Division | SRS Bulletin 2024, Vol. 59 No. 1 | 20 May 2026 (catalogue "Date published 2026-05-20", catalog/47150, checked 18 Nov 2026) | 2024 | https://censusindia.gov.in/nada/index.php/catalog/47150/download/51394 | dbd5008ffba5122d222775fc711a3a050867f65f06d9a2afb513311dc7031d05 |
| ORGI | SRS Statistical Report 2024 | May 2026 | 2024 | https://censusindia.gov.in/nada/index.php/catalog/47152/download/51396 | f922a4a817e612c78a7827e4f526f69dc433d68c4af287b76d418337637c946a |
| ORGI | SRS Special Bulletin on Maternal Mortality in India 2022-24 | 20 May 2026 (catalogue "Date published 2026-05-20", catalog/47151, checked 18 Nov 2026) | 2022-24 | https://censusindia.gov.in/nada/index.php/catalog/47151/download/51395 | 64496bdb2e245415b4fc682d01f56f14446d986c08723f3f74f4e51c0d5cb634 |
| ORGI | SRS Based Abridged Life Tables 2020-24 | 18 May 2026 (catalogue "Date published 2026-05-18", catalog/47148, checked 18 Nov 2026) | 2020-24 | https://censusindia.gov.in/nada/index.php/catalog/47148/download/51393 | 148629ce39c9956fa6a2444ad606394b9104d40f9ac6efcebb1da7336461f19f |
| ORGI | SRS Compendium of India's Fertility and Mortality Indicators 1971-2013 | 2014 (not stated in the file; catalogue "Date published 2014-01-01", a year-only entry, catalog/33218, checked 18 Nov 2026) | 1971 to 2013 | https://censusindia.gov.in/nada/index.php/catalog/33218/download/37035 | 8085ab18a367ab6fe96718641c04de93c494522588135e72f51bb3dcb3394984 |
| ORGI | SRS Bulletin 2014 | Jul 2016 | 2014 | https://censusindia.gov.in/nada/index.php/catalog/42707/download/46377 | 5302df7b315488089813884737f312fdc3d4e6b823f75e9ac7d8ca53df732c31 |
| ORGI | SRS Bulletin 2015 | see file | 2015 | https://censusindia.gov.in/nada/index.php/catalog/42683/download/46353 | e7efe2b6fc6b829876ae80d492629b8ba65bcc321f50ed752951d90f7b1e4dbe |
| ORGI | SRS Bulletin 2016 | see file | 2016 | https://censusindia.gov.in/nada/index.php/catalog/42684/download/46354 | fe6c0a9ffda61e431205585c90439cca6ed423d78baa1250e8df8906e740a0f5 |
| ORGI | SRS Bulletin 2017 | see file | 2017 | https://censusindia.gov.in/nada/index.php/catalog/42685/download/46355 | 3950fda237c4efb56e149cb633fa7396e18b88cbb074c038e45d144a0ec44651 |
| ORGI | SRS Bulletin 2018 | see file | 2018 | https://censusindia.gov.in/nada/index.php/catalog/42682/download/46352 | 496746ad7fcb3a34720c24b7b8bf58163cc05510bb3e4ef5ea6c6353f24cfd4b |
| ORGI | SRS Bulletin 2019 | see file | 2019 | https://censusindia.gov.in/nada/index.php/catalog/42686/download/46356 | e25573cd9e22986ee9f60ef2a66603c06efdb32db96c46e4a5dcb7dd395a9c32 |
| ORGI | SRS Bulletin 2020 | see file | 2020 | https://censusindia.gov.in/nada/index.php/catalog/42687/download/46357 | 8a856a36183d5be151cb49957bf7bb52328ef6c8ced5d8a2e8caa19b40f6d2ea |
| ORGI | SRS Bulletin 2021 | see file | 2021 | https://censusindia.gov.in/nada/index.php/catalog/45562/download/49759 | db72a93941ff24f1cd6ce6905b9b435b3df3ec924e1db4db718ac8b083bc9071 |
| ORGI | SRS Bulletin 2022 | see file | 2022 | https://censusindia.gov.in/nada/index.php/catalog/45567/download/49764 | beac875ea33ba0881a38d98bc184087ea83880ab7e34bc9d52f324d11d43d71b |
| ORGI | SRS Bulletin 2023, Vol. 58 No. 1 | Sep 2025 | 2023 | https://censusindia.gov.in/nada/index.php/catalog/46178/download/50426 | 8d52d81b06bb4c010ea8e3fa39bd9b04fc67e8e803218d9dd3ff699288b0b25b |
| IIPS for MoHFW | NFHS-6 (2023-24) India and State/UT Fact Sheets (provisional) | 29 May 2026 | 2023-24 (fieldwork May 2023 to Dec 2024); NFHS-5 2019-21 | https://www.nfhsiips.in/nfhsuser/assets/National%20Family%20Health%20Survey%20(NFHS-6)%202023-2024%20Fact%20Sheets.pdf | 59dec561e837bea060b6684a75caca84e0c982ed9e2670848521755f2ab267f9 |
| PIB (MoHFW) | "Union Health Ministry Releases National Family Health Survey - 6", Release ID 2266600 | 29 May 2026 | 2023-24 | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2266600 | caeb939052f8106e8fb4f7477defc2c1d85ec350d4361e349517aa8c222c08f0 |
| PIB (MoHFW) | "Update on NFHS-6", Release ID 2294277 (Rajya Sabha reply) | 4 Aug 2026 | n/a | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2294277 | 0f533189750ee1ddfb2e6e9afc8bf8d37e9983b013636d587f69ae499bf6bcd0 |
| PIB (Ministry of Women and Child Development) | "Study on impact of PMMVY", Release 1782638, Annexure-I (Lok Sabha reply) | 17 Dec 2021 | NFHS-5, 2019-21 | https://www.pib.gov.in/PressReleasePage.aspx?PRID=1782638 | 70eeb06710894aec3ded97d2d9c649faeb82f125206a935af1a394e4aa59d612 |
| MoHFW, NHSRC (NHA Technical Secretariat) | National Health Accounts Estimates for India 2023-24 | Public release confirmed by 15 Nov 2026 (PIB PRID 2336478). Foreword dated 7 Sep 2026. PDF dated 6 Nov 2026 | 2013-14 to 2023-24 | https://nhsrcindia.org/sites/default/files/2026-11/NHA%20Report%202023-24.pdf | cf60c3fd530a585f9426595505c1301a2877e317adca4f8d17097c84e190e119 |

Parsing: `pdftotext -layout` (`pipeline/health/extract_text.sh`), then `pipeline/health/build_health.py` run with `python3 -I`. The script checks row counts and some known values (for example IMR 129 in 1971 and 24 in 2024, NFHS-5 anaemia 57.0 for India).

## Gaps and cautions

**Coverage by state**

- SRS life tables, U5MR, NMR and the state MMR cover only the bigger states. Life expectancy covers 21 bigger states plus Himachal Pradesh. MMR covers 19 states. The rest are in one "other states" group (`other-states` in the CSV). The CSV also has three regional subtotals (`eag-assam-subtotal`, `south-subtotal`, `other-subtotal`). These slugs are not in `geography.csv`. Do not put them on a map.
- SRS IMR covers all 36 states and UTs. For the 15 smaller states and UTs, the 2024 value is a three-year pool (2022-24). Manipur is based on 130 SRS units only. Its rate of 2 is the lowest, but treat it with care.
- NFHS-6 has no data for Manipur. The survey was not done there.
- The National Health Accounts give state OOPE shares for 21 states only. NHSRC says small states, UTs and the North-East are left out because the survey samples there are too small.

**Boundary changes and series breaks**

- SRS state series before 2014 do not split Andhra Pradesh and Telangana. The compendium MMR for 1997-98 to 2011-13 groups Bihar with Jharkhand, Madhya Pradesh with Chhattisgarh, and Uttar Pradesh with Uttarakhand. Only the India series is used for those years.
- SRS "Jammu & Kashmir" covers the UT of Jammu and Kashmir. Ladakh has its own SRS estimate. The NHA state table says "Jammu and Kashmir includes the erstwhile state", so it includes Ladakh.
- IMR for India excludes Jammu and Kashmir in 1991 to 1997. Before 1995 it excludes Mizoram. Nagaland (rural) is left out from 1995 to 2003. The `note` column marks the J&K years only; the other two notes are in the compendium.
- Life expectancy for India in 1987-91 to 1997-01 excludes Jammu and Kashmir (marked in the CSV). The early periods are five-year blocks (1970-75, 1976-80, 1981-85, 1986-90). After that the periods are five-year moving averages that overlap. Plot them at `mid_year`.
- Life expectancy fell from 70.0 (2016-20) to 69.8 (2017-21) and then rose again. These periods include the COVID-19 years. The life tables do not give a reason.
- The ORGI catalogue lists MMR bulletins for 2007-09, 2010-12, 2011-13 and then 2014-16 onward. A search for "Maternal Mortality" found none for 2012-14 or 2013-15, so the series jumps from 2011-13 to 2014-16. The periods before 2010-12 are not consecutive either. The 2014-16 to 2022-24 values are the labels on the trend chart in the 2022-24 bulletin. The earlier bulletins (2014-16 to 2021-23) were not opened to check them one by one.
- OOPE: up to 2016-17 the NHA used figures extrapolated from NSS 71st round (2014, six-month recall). From 2017-18 it used NSS 75th round (2017-18, one-year recall, bigger sample). NHSRC says the change in OOPE "may be attributed to several factors" including this. Show a method break between 2016-17 and 2017-18. NHA 2022-23 also added new data sources (HCES 2022-23, ASUSE and others). The OOPE share rose from 39.4% (2021-22) to 43.4% (2022-23). Do not read the 2021-22 low point as a clean trend.
- NHA state OOPE still rests on the 2017-18 NSS round. Kerala (65.2%) and Uttar Pradesh (67.1%) have the highest shares. Kerala's high share sits beside high total spending (Rs 13,605 per person), so the share alone does not show hardship.

**NFHS**

- NFHS-6 results are provisional, as the fact sheets say.
- NFHS-6 fact sheets leave out anaemia. PIB (4 Aug 2026) says MoHFW will use anaemia figures from a separate ICMR survey that uses venous blood. That survey has not been found. The anaemia values in H7 are NFHS-5 (2019-21) only. Do not compare them with a future ICMR figure, because the test method is different.
- NFHS-6 fact sheets also leave out IMR, NMR and U5MR. Use SRS for child mortality.
- The NFHS-5 values in `nfhs-key-indicators-by-state.csv` (except anaemia) are as printed in the NFHS-6 fact sheets. They were not checked against the NFHS-5 fact sheets, because those sheets could not be reached (see below). A few may differ if IIPS recalculated them.
- Two immunisation measures exist. The PIB headline (87.1%) uses vaccination cards only. The card-or-recall measure is lower (82.6%). Name the measure on the chart.
- Values in brackets in the fact sheets (25 to 49 unweighted cases) are kept and marked in the `note` column (Chandigarh and Lakshadweep immunisation). Values shown as "*" (fewer than 25 cases) would be blank; none of the chosen indicators had one.
- Stunting rose in Andaman and Nicobar Islands (22.5% to 26.7%) and Lakshadweep (32.0% to 34.1%). Samples there are small.

**Access**

- nfhsiips.in: the TLS certificate (CN nfhsiips.in, issued by eMudhra) expired on 16 Nov 2026 at 05:42 GMT, one day before the read. The file was fetched with certificate checks off. The certificate fingerprint at read time was SHA-256 D1:E8:0E:37:70:7B:FC:F1:FA:8C:66:A5:82:51:F8:40:23:0B:3E:F3:11:FA:3A:9C:5A:A8:28:4D:15:0A:59:95. The India values in the file (stunting 29.3%, institutional births 90.6%, full immunisation 87.1%) match the PIB release of 29 May 2026, which was fetched with valid TLS. Re-fetch the file when the certificate is renewed and compare the sha256.
- The NFHS-6 state and district compendiums on nfhsiips.in need a guest login. They were not used.
- rchiips.org (NFHS-5 fact sheets): not used. Its certificate is for a different name (nfhs.in) and has expired. HTTP paths returned 404.
- mohfw.gov.in: its NFHS-5 page (basicpage-14) and publication list load by JavaScript. The PDF links could not be read. main.mohfw.gov.in did not resolve.
- NFHS-5 anaemia by state comes from a PIB Lok Sabha answer, not from an IIPS file. Check it against the NFHS-5 fact sheets when rchiips.org works.

**Not found**

- Life expectancy for the 14 smaller states and UTs: not published by SRS.
- U5MR and NMR for smaller states and UTs: not published by SRS.
- NFHS-6 anaemia: not released (see above).

## Checks (18 Nov 2026)

- Downloaded the 29 May 2026 fact sheets from MoHFW with valid HTTPS. The ministry PDF has SHA-256 `6b7d4eef047ddc5f37b6afa3935dab997a3b7ffff51ceb609eead44c34e25994`. Its bytes differ from the IIPS copy. The rchiips.org and IIPS certificates did not validate. A separate IIPS download without certificate verification matched the original SHA-256 `59dec561e837bea060b6684a75caca84e0c982ed9e2670848521755f2ab267f9`. [MoHFW media index](https://master-mohfw-dohfw.digifootprint.gov.in/cms/wp-json/wp/v2/media?search=NFHS) · [MoHFW PDF](https://www.mohfw-dohfw.gov.in/static/uploads/2026/05/111ff4a13ca36b5cabb7f94aec5bb0ce.pdf)
- Checked ten NFHS-6 values and the corresponding ten NFHS-5 values across five geographies in both PDFs. All 20 values matched the CSV. The table gives percentages in the order NFHS-6, NFHS-5.

| Geography | Indicator | NFHS-6 | NFHS-5 |
| --- | --- | ---: | ---: |
| India | Institutional births | 90.6 | 88.6 |
| India | Full vaccination, card or recall | 82.6 | 76.6 |
| India | Full vaccination, card only | 87.1 | 83.8 |
| India | Stunting | 29.3 | 35.5 |
| India | Wasting | 19.0 | 19.3 |
| India | Severe wasting | 5.2 | 7.7 |
| Andhra Pradesh | Institutional births | 98.4 | 96.5 |
| Arunachal Pradesh | Severe wasting | 8.0 | 6.5 |
| Assam | Stunting | 30.3 | 35.3 |
| Bihar | Stunting | 35.6 | 42.9 |
- The release date of the National Health Accounts 2023-24: news reports say about 15 Nov 2026 (unverified). The PIB release was not opened.

## Publisher check on 18 Nov 2026

ORGI still lists the 2024 SRS statistical report and bulletin, the 2022-24 maternal mortality bulletin and the 2020-24 life tables. Their checksums match the initial read. The Ministry of Health still lists the NFHS-6 fact sheets from 29 May. Its PDF matches the previous ministry copy. The IIPS download failed its TLS certificate check.

NHSRC still lists the 2023-24 National Health Accounts as its latest report. The PDF matches the 17 Nov checksum. PIB PRID 2336478 confirms that the Ministry had released the report by 15 Nov 2026 and repeats its headline 42.7% share for household out-of-pocket spending in 2023-24.

| Release or file checked | Release date | URL | Fetched | SHA-256 |
| --- | --- | --- | --- | --- |
| ORGI SRS catalogue search | Live list | https://censusindia.gov.in/nada/index.php/catalog/?sk=SRS | 18 Nov 2026 | `46d3e7d88d806a2398ad407f2b9fd808ffd7248487d5af8c8be5ea4db103d57f` |
| ORGI SRS Statistical Report 2024 | 20 May 2026 | https://censusindia.gov.in/nada/index.php/catalog/47152/download/51396/SRS_STAT_2024.pdf | 18 Nov 2026 | `f922a4a817e612c78a7827e4f526f69dc433d68c4af287b76d418337637c946a` |
| MoHFW NFHS-6 fact sheets | 29 May 2026 | https://www.mohfw-dohfw.gov.in/static/uploads/2026/05/111ff4a13ca36b5cabb7f94aec5bb0ce.pdf | 18 Nov 2026 | `6b7d4eef047ddc5f37b6afa3935dab997a3b7ffff51ceb609eead44c34e25994` |
| MoHFW NFHS media list | Live list | https://master-mohfw-dohfw.digifootprint.gov.in/cms/wp-json/wp/v2/media?search=NFHS&per_page=50 | 18 Nov 2026 | `19c1583e169d4232fabb85d3d013acfbcc1b95cafd1c1dbf58d386bdca401826` |
| NHSRC National Health Accounts Estimates for India 2023-24 | Public release confirmed by 15 Nov 2026 | https://nhsrcindia.org/sites/default/files/2026-11/NHA%20Report%202023-24.pdf | 18 Nov 2026 | `cf60c3fd530a585f9426595505c1301a2877e317adca4f8d17097c84e190e119` |
| PIB PRID 2336478, National Health Accounts 2023-24 | 15 Nov 2026, 2:13 pm IST | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2336478&reg=48&lang=1 | 18 Nov 2026 | `d412ad2b2eeb6805cb9190045e7347e6512fdc7c0f62da79100cb01bb76e4784` |
