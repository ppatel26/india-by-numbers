# Health

Data gathered on 17 Nov 2026 from primary sources: ORGI Sample Registration System (SRS), NFHS (IIPS for MoHFW), PIB and the National Health Accounts (NHSRC for MoHFW). All values are as published. Nothing is interpolated.

## Questions this topic answers

1. How many babies die before their first birthday, and how fast has that fallen since 1971?
2. How many women die from pregnancy and childbirth, and where is the risk highest?
3. How long do people in India live, and how large is the gap between states and between women and men?
4. Are children better nourished and better protected than five years ago?
5. How much of the health bill do households pay from their own pockets?

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

- Type: line for India (OOPE and government health expenditure, as a share of total health expenditure), with a method-break marker between 2016-17 and 2017-18. A ranked bar of the 21 states for 2023-24 as a second view.
- Unit: percent of total health expenditure (THE).
- Geography: India (2013-14 to 2023-24); 21 states (2023-24).
- CSV: `out-of-pocket-health-spending.csv`
- Sentence: "Households paid 42.7% of India's health bill out of their own pockets in 2023-24, down from 64.2% in 2013-14."
- Source: MoHFW and NHSRC, National Health Accounts Estimates for India 2023-24, Table 1 (India) and Table A.6 (states).

## Headline figures

| Figure | Value | Period | Source |
| --- | --- | --- | --- |
| Infant mortality rate | 24 per 1,000 live births (129 in 1971) | 2024 | SRS Bulletin 2024, Table 1 |
| Maternal mortality ratio | 87 per 100,000 live births (398 in 1997-98) | 2022-24 | SRS Special Bulletin on Maternal Mortality 2022-24 |
| Life expectancy at birth | 70.6 years (women 72.8, men 68.7) | 2020-24 | SRS Abridged Life Tables 2020-24, Statement 1 |
| Under-5 mortality rate | 28 per 1,000 live births | 2024 | SRS Statistical Report 2024, Statement 53 |
| Children under 5 stunted | 29.3% (35.5% in 2019-21) | 2023-24 | NFHS-6 India Fact Sheet (provisional) |
| Out-of-pocket share of health spending | 42.7% of total health expenditure (64.2% in 2013-14) | 2023-24 | National Health Accounts 2023-24, Table 1 |

Other national values in the sources: institutional births 90.6% (NFHS-6; 88.6% in NFHS-5); full immunisation, card only, 87.1% (83.8%); all women 15-49 anaemic 57.0% (NFHS-5, 2019-21); neonatal mortality rate 18 (2024).

## Sources

All read on 17 Nov 2026. Raw files are in `raw/health/` (not in the repo). No page stated a reuse licence, unless shown.

| Publisher | Release | Release date | Period | URL | sha256 of raw file |
| --- | --- | --- | --- | --- | --- |
| ORGI, Vital Statistics Division | SRS Bulletin 2024, Vol. 59 No. 1 | May 2026 (NADA entry created 20 May 2026) | 2024 | https://censusindia.gov.in/nada/index.php/catalog/47150/download/51394 | dbd5008ffba5122d222775fc711a3a050867f65f06d9a2afb513311dc7031d05 |
| ORGI | SRS Statistical Report 2024 | May 2026 | 2024 | https://censusindia.gov.in/nada/index.php/catalog/47152/download/51396 | f922a4a817e612c78a7827e4f526f69dc433d68c4af287b76d418337637c946a |
| ORGI | SRS Special Bulletin on Maternal Mortality in India 2022-24 | May 2026 | 2022-24 | https://censusindia.gov.in/nada/index.php/catalog/47151/download/51395 | 64496bdb2e245415b4fc682d01f56f14446d986c08723f3f74f4e51c0d5cb634 |
| ORGI | SRS Based Abridged Life Tables 2020-24 | May 2026 | 2020-24 | https://censusindia.gov.in/nada/index.php/catalog/47148/download/51393 | 148629ce39c9956fa6a2444ad606394b9104d40f9ac6efcebb1da7336461f19f |
| ORGI | SRS Compendium of India's Fertility and Mortality Indicators 1971-2013 | not stated in the file | 1971 to 2013 | https://censusindia.gov.in/nada/index.php/catalog/33218/download/37035 | 8085ab18a367ab6fe96718641c04de93c494522588135e72f51bb3dcb3394984 |
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
| MoHFW, NHSRC (NHA Technical Secretariat) | National Health Accounts Estimates for India 2023-24 | Foreword dated 7 Sep 2026; file posted in the Nov 2026 folder | 2013-14 to 2023-24 | https://nhsrcindia.org/sites/default/files/2026-11/NHA%20Report%202023-24.pdf | cf60c3fd530a585f9426595505c1301a2877e317adca4f8d17097c84e190e119 |

Parsing: `pdftotext -layout`, then `pipeline/health/build.py` run with `python3 -I`. The script checks row counts and some known values (for example IMR 129 in 1971 and 24 in 2024, NFHS-5 anaemia 57.0 for India).

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
- The release date of the National Health Accounts 2023-24: news reports say about 15 Nov 2026 (unverified). The PIB release was not opened.
