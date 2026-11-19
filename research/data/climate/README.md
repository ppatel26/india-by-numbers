# Climate

The original data come from IMD, IMD Pune, CEA and MNRE (read 17 to 18 Nov 2026). The CSVs identify calculated values.

## Questions this topic answers

1. How much rain did the 2026 monsoon bring, and how does it compare with 125 years of records?
2. Which parts of India were short of rain in 2026?
3. How much warmer is India now, and which years were the warmest?
4. How fast is India moving its power capacity away from coal?
5. Which states have the most solar, wind and other renewable capacity?

## Charts

### C1. Monsoon rainfall since 1901

- Type: bar chart of departure from the long-period average (LPA), one bar per year. Option: line of rainfall in mm.
- Unit: mm, and % departure from LPA. LPA = 868.6 mm (1971 to 2020).
- Geography: India. Period: 1901 to 2026, June to September.
- CSV: `monsoon-rainfall-all-india-1901-2026.csv`
- Sentence: "India got 759.4 mm of rain in the 2026 monsoon, 12.6% below the long-period average. Only 12 monsoons since 1901 were drier."
- Source: IMD Pune, Climate Research and Services, "India (June-Sept) Rainfall", all-India table. 2026 value is from real-time data and matches the IMD season report of 30 Sep 2026.

### C2. 2026 monsoon by meteorological subdivision

- Type: ranked bar (diverging, % departure), 36 subdivisions. Colour by IMD category.
- Unit: % departure from normal; mm actual and normal.
- Geography: 36 IMD meteorological subdivisions, 4 homogeneous regions, India.
- Period: 1 Jun to 30 Sep 2026.
- CSV: `monsoon-2026-by-subdivision.csv` (column `states_covered` maps each subdivision to state slugs).
- Row order (18 Nov 2026): India and the four regions first, then the 36 subdivisions from the largest excess to the largest shortfall (ties by name). No value changed.
- Sentence: "17 of 36 subdivisions had deficient rain in 2026. Arunachal Pradesh was 44% short and Punjab 41% short. Odisha was the only subdivision with excess rain, at 29% above normal."
- Source: IMD National Weather Forecasting Centre, Special Daily Weather Report, 30 Sep 2026, Table-2 "Met. Subdivision-wise Seasonal Cumulative Rainfall Statistics".

### C3. 2026 monsoon month by month, by region

- Type: small multiples (one panel per region) or grouped bar, % departure by month.
- Unit: mm and % departure from LPA.
- Geography: India and 4 homogeneous regions. Period: June, July, August, September 2026 and the season.
- CSV: `monsoon-2026-by-month-and-region.csv`
- Column `month` (added 18 Nov 2026) is a display label: Jun, Jul, Aug, Sep, and Season for the June to September total. It changes no value.
- Sentence: "June 2026 brought 35% less rain than normal across India. In Central India, June rain was half of normal, then July was 33% above normal."
- Source: IMD Pune, "Rainfall statistics: monsoon season 2026" (rfstats.gif on the 2026 monsoon page); season report of 30 Sep 2026.

### C4. Annual mean temperature anomaly in India

- Type: line chart with the two warmest years labelled.
- Unit: °C from the 1991 to 2020 mean land surface air temperature.
- Geography: India. Period: 1901 to 2025, every year.
- CSV: `annual-temperature-anomaly-1901-2025.csv`. The older `warmest-years-temperature-anomaly.csv` records the six entries from the former ranked chart.
- Sources: IMD Pune, Mean Temperature table (S10), and IMD, Statement on the Climate of India during 2025 (S6).

### C5. Temperature in 2025 by season

- Type: bar chart (diverging around zero).
- Unit: °C anomaly against 1991 to 2020.
- Geography: India. Period: 2025, four seasons and the year.
- CSV: `temperature-anomaly-2025-by-season.csv`
- Column `season_name` (added 18 Nov 2026) is a display label, for example "Winter, Jan-Feb" and "Year 2025". The annual row is now the last row, so the year follows the four seasons. No value changed.
- Sentence: "January and February 2025 were 1.17°C warmer than the 1991 to 2020 average, the warmest winter since 1901."
- Source: IMD, "Statement on the Climate of India during 2025", 1 Jan 2026.

### C6. Installed power capacity by source

- Type: stacked area with breaks at changes in reporting coverage.
- Unit: MW.
- Geography: India (utilities). Period: 31 Dec 1947 to 31 Oct 2026. December observations for 1947 and 1950, selected March observations through 1997, then every March and October 2026.
- CSVs: `historic-installed-capacity-1947-2013.csv` and `installed-capacity-by-source-2014-2026.csv`.
- Sentence: "Solar capacity grew from 2,632 MW in March 2014 to 174,547 MW in October 2026. Coal and lignite capacity grew from 145,273 MW to 231,438 MW." (231,438 MW is the sum of the published coal, 225,068 MW, and lignite, 6,370 MW.)
- Sources: CEA growth booklet (S12), Executive Summary (S13), and Installed Capacity monthly reports (S7 and S8).

### C7. Non-fossil share of installed capacity

- Type: line chart. The second line gives the share of renewables excluding large hydro from March 2008.
- Unit: % of total installed capacity.
- Geography: India (utilities). Period: 31 Dec 1947 to 31 Oct 2026. Same observation dates as C6.
- CSV: `non-fossil-share-of-capacity-1947-2026.csv`. Its monthly portion comes from `non-fossil-share-of-capacity-2014-2026.csv`.
- Sentence: "On 31 Oct 2026, non-fossil sources made up 55.45% of India's 563,113 MW of power capacity, up from 32.31% in March 2014."
- Sources: same as C6. The shares use the published MW values. CEA prints the non-fossil shares for 31 Mar and 31 Oct 2026.

### C8. Renewable power capacity by state

- Type: ranked bar by state and tile map by state. Series switch: total RE (with large hydro), solar, wind.
- Unit: MW.
- Geography: all 36 states and UTs, plus India and an "Others" row from the source.
- Period: as on 31 Oct 2026.
- CSV: `renewable-capacity-by-state-2026-10.csv`
- Sentence: "Gujarat has the most renewable capacity, at 56,289 MW, followed by Rajasthan at 52,134 MW. Rajasthan leads on solar, with 45,628 MW."
- Source: MNRE, "State-wise (Location based) installed capacity of Renewable Power as on 31.10.2026", published 12 Nov 2026.

## Headline figures

| Figure | Value | Period | Source |
| --- | --- | --- | --- |
| Monsoon rainfall, India | 759.4 mm, 87% of LPA (LPA 868.6 mm, 1971 to 2020) | Jun to Sep 2026 | IMD, Salient features of the 2026 SW monsoon, 30 Sep 2026 |
| Rank of 2026 monsoon | 13th lowest since 1901, 4th lowest since 2001 | 1901 to 2026 | Same release |
| Subdivisions with deficient rain | 17 of 36 (42% of area) | Jun to Sep 2026 | Same release; SDWR 30 Sep 2026 |
| Annual temperature anomaly | +0.28°C, 8th warmest since 1901. Warmest: 2024, +0.65°C | 2025, base 1991 to 2020 | IMD Statement on the Climate of India during 2025, 1 Jan 2026 |
| Long-term warming trend | +0.68°C per 100 years | 1901 to 2025 | Same statement |
| Non-fossil share of power capacity | 55.45% of 563,113 MW | 31 Oct 2026 | CEA Installed Capacity report, Oct 2026 |
| Solar capacity | 174,547 MW (31.00% of total) | 31 Oct 2026 | CEA, Oct 2026; MNRE state table, 31 Oct 2026 |
| East and Northeast India, season rainfall, in the season report table (note on chart 1.2) | 1,016.3 mm (1,017.1 mm in the season table, S2 and S4) | Jun to Sep 2026 | IMD (MoES), Salient Features of the 2026 Southwest Monsoon Season, press release 5361, 30 Sep 2026, Table 1 "Season (June to September) Rainfall", row East & Northeast India (PDF page 4). Same table in the end of season report (S5), page 4. Checked 18 Nov 2026 |
| June rainfall, India, in the report text (note on chart 1.2) | 104 mm against a normal of 165.3 mm (the table gives 106.8 mm) | Jun 2026 | IMD (MoES), press release 5361, 30 Sep 2026, text on the monthly distribution: "Overall, the country received 104 mm of rainfall against the normal of 165.3 mm" (PDF page 8). Checked 18 Nov 2026 |
| Captive bagasse cogeneration added in the 2017 MNRE revision (About the data) | about 3,000 MW | 31 Mar 2014 to 31 Mar 2017 | CEA, Installed Capacity report as on 31.03.2014 (revised edition), page 1, note 2: "... due to addition of 3000 MW that was being used for captive consumption of the plants in Bagasse Co-generation projects which was not accounted for earlier" (MNRE letter 146/16/2017-P&C, 23.08.2017). Checked 18 Nov 2026 |

## Sources

All read on 17 Nov 2026. Raw downloads are not kept in the repository; the URL and sha256 below identify each file. No licence was stated on any of these pages unless noted.

| # | Publisher | Release or table | Release date | Data period | URL | sha256 of raw file |
| --- | --- | --- | --- | --- | --- | --- |
| S1 | IMD (MoES) | Salient Features of the 2026 Southwest Monsoon Season (press release 5361) | 30 Sep 2026 | Jun to Sep 2026 | https://internal.imd.gov.in/press_release/20260930_pr_5361.pdf | 2eb8c406c0f8ec7248c64109e59f5312afd672fd36557d2e75a0bd0ae1437f4c |
| S2 | IMD NWFC | Special Daily Weather Report, 30 Sep 2026, page 14, Table-2 (image) | 30 Sep 2026 | 1 Jun to 30 Sep 2026 | https://mausam.imd.gov.in/backend/assets/pdf_to_img_nwfc_monsoon/14_IMD%20SDWR%2030%20September%202026_6abce82b302f8.png (linked from https://mausam.imd.gov.in/responsive/monsooninformation.php) | 7feac617a8e9a401abd55345c21966665a17b3f2a6f7c97f85dc74fbfd603cad |
| S3 | IMD Pune, CRS | India (June-Sept) Rainfall, all-India table, actual mm and % departure | Not stated; includes 2026 | 1901 to 2026 | https://imdpune.gov.in/cmpg/Product/Rainfall_Data.html | b8ec58473b4663e6afbe70d97b27072a8d2a90e60ed6d22a562c3e73f05a6759 |
| S4 | IMD Pune, CRS | Rainfall statistics, monsoon season 2026 (image) | Not stated | Jun to Sep 2026 | https://imdpune.gov.in/seasons_previous/swmonsoon/swmonsoon26/rfstats.gif | c1887a78140b00442925bf104aa1c44690a158289e084d62981e54729f715708 |
| S5 | IMD Pune, CRS | End of season report, SW monsoon 2026 (same text as S1, plus forecast verification) | Not stated | Jun to Sep 2026 | https://imdpune.gov.in/seasons_previous/swmonsoon/swmonsoon26/end_of_season_report.pdf | 14c8d348b85c68437f695e2a4dae74e3cd5305b07c028c1aeb7904f17a41f4bd |
| S6 | IMD (MoES) | Statement on the Climate of India during 2025 (press release 4602) | 1 Jan 2026 | 2025; trend 1901 to 2025 | https://internal.imd.gov.in/press_release/20260101_pr_4602.pdf | 93f4e4f0767dbe7c4b1abe2b1eba255fd4b0a4d03e2ae3e7594be680d76347c9 |
| S7 | CEA | Installed Capacity report, as on 31.10.2026 (PDF and Excel) | Monthly report; listed on 17 Nov 2026 | 31 Oct 2026 | https://cea.nic.in/api/dashboardReports/download-pdf/en/30fb43c2-dbf0-49f4-be3d-95546a5fbe90 and .../download-excel/en/30fb43c2-dbf0-49f4-be3d-95546a5fbe90 (list: https://cea.nic.in/reports/dashboardView?headingId=107&subHeadingId=1003&subSubHeadingId=10014&lang=en) | PDF 469533103e2656467468a92a0ed3f617d587a789cdb6f3bc2e56aea677258fcd; XLSX 7071b89cc58c9f90f181bb6b62ea530bb2e0c3310eda2383eea592acf9d4fc8e |
| S8 | CEA | Installed Capacity reports, March editions 2014 to 2026 | Monthly | 31 Mar of each year | Same list page; one download-pdf id per edition (see table below) | See table below |
| S9 | MNRE | State-wise (Location based) installed capacity of Renewable Power as on 31.10.2026 | 12 Nov 2026 | 31 Oct 2026 | https://mnre.gov.in/static/uploads/2026/11/4519bf2a3faca1ef18d71b8a267812a6.pdf (found through https://mnre.gov.in/cms/wp-json/wp/v2/media/23331) | 1a47d414a775f7824906148f12ccec59c6c9568a92bf3bc2e3b160125244797f |

CEA March editions (S8). URL pattern: `https://cea.nic.in/api/dashboardReports/download-pdf/en/<id>`.

| Edition | id | sha256 |
| --- | --- | --- |
| 2014-03 | 3d051401-772d-47aa-b037-6d51e5e6bbb4 | 264e6f33c872aa55cdea5d3237a401467fa203ee5829817cc05d3dfd207c9a69 |
| 2015-03 | 105d3845-aa1c-45fd-a721-31cb9c1476b8 | 22acbed6a45d9ecf99b57d4bac507f17d640dd1467b5eed9c25664b5c3abe107 |
| 2016-03 | 803a4ba1-757d-41a2-8b54-8f67b5765b9d | 155038f50c9580289f5d5b32767f42850495c84fec04c7e13058a27919475fc7 |
| 2017-03 | 91384aaa-75c6-4d53-b8b8-ff1ab6165aeb | 6f19d7817cf441e278875018268234882c97bd7489019157144c4ea29b938a7d |
| 2018-03 | a9c7dafe-4ec0-48a3-8a4c-ea14479b4151 | a4d25ab9775bfd3b05ca3aef3774d52cb7d8acca0494351803aee11e7b742072 |
| 2019-03 | 817be473-e30e-4c25-9f9c-c234d2d3966d | 0f97554ae1ce81fe040dab8b0d5dcfcae7decaaca6c4a38ba9f28b5c2bed2ec5 |
| 2020-03 | e0d59eec-a511-4374-a3a2-0797fb8de532 | 2c01b27acdb5076218362a02ddfa1a082ec392cdbdf97012731c17d5ed7620b1 |
| 2021-03 | 25385ffd-cf77-4b8f-942d-231f85d4daa8 | 9c48c9fff23350567532cf75a460ef2b94f085a16db899d80d5a4e1a71533c67 |
| 2022-03 | 6d2f22da-246c-41e3-8da9-c4542261c733 | eb81cb38a2d77b457f04461714cc4d9075570675b71ccc1da731f26f9e123049 |
| 2023-03 | 613e6546-8490-4b20-8274-f13a904ca5a6 | 5befa505c12631de2cfc2c9117746e5f45a9d45179f4d768598677491595cbff |
| 2024-03 | 768d25e8-7f39-4656-a9c8-2549263d0f1e | 92115eb6006f814bc27887c20739b39fc29041bd276635fa06f45a991afccc89 |
| 2025-03 | 4a1262fb-1426-4846-b1d0-811f662b84e3 | 03f262fc775ec00740a465311a3542f75135eeba32e52f8ef20c3ae9be405446 |
| 2026-03 | 36ba4e08-d75a-4d7b-bf9b-6dd02d2702b5 | b5d9dbf33520d03bf1006d46cac713b1c5dd483efe6499bf5c4d60b6a79ea9f2 |

Files checked but not used for a chart:

| Publisher | File | URL | sha256 |
| --- | --- | --- | --- |
| MoSPI (NSO) | EnviStats India 2025 Vol. I (scanned PDF) | https://www.mospi.gov.in/sites/default/files/reports_and_publication/statistical_publication/EnviStats/Complete_ES1_2025.pdf | 2652fe6f272e33d69b69dbacbc439fbb6cdc8ca523aff6a52df39f8e276aea64 |
| PIB (MoEFCC) | India submits its 4th Biennial Update Report to the UNFCCC, 2 Jan 2025 | https://pib.gov.in/PressReleaseIframePage.aspx?PRID=2089589 | 10d570ef046a075fb5d49d88952d160027d32d7bfa311b223549604e54ad1352 |

Parsing scripts: `pipeline/climate/` (`extract_text.sh`, `build_rain.py`, `build_subdiv.py`, `parse_cea.py`, `build_cea.py`, `build_mnre.py`). Each script asserts the source totals: CEA parts sum to the grand total, MNRE state rows sum to their own totals and to 303,463 MW, and the subdivision categories count 18 normal, 17 deficient, 1 excess, as IMD reports.

## Gaps and cautions

- **State-wise monsoon rainfall for 2026: not found.** The IMD state rainfall page now shows only the post-monsoon period (from 1 Oct 2026). `hydro.imd.gov.in` did not resolve and `imdgeospatial.imd.gov.in` did not connect. C2 uses the 36 IMD meteorological subdivisions. They do not match state lines. Several states have more than one subdivision (Maharashtra 4, Karnataka 3, Rajasthan 2, Uttar Pradesh 2, Madhya Pradesh 2, Gujarat 2, Andhra Pradesh 2). Some subdivisions cover more than one state. Do not draw C2 on a state tile map.
- **C2 values are transcribed** from an image of the SDWR table (S2). See the check below.
- **2026 rainfall is real-time data.** IMD may revise it in the final monsoon report.
- **Small differences between IMD documents.** East and Northeast India season rain is 1017.1 mm in S2, S4 and the S1 highlights, but 1016.3 mm in S1 Table 1. The S1 text says June rain was 104 mm (37% short); its table says 106.8 mm (65% of LPA). The CSVs keep the table values. IMD rounds the season departure to -13% (S2) and gives -12.6% in S3 and S4.
- **Heatwave days: not found.** IMD did not publish a count of heatwave days for 2026 on the press release list or the IMD Pune pages that I checked. The 2025 climate statement gives about 35 heatwave deaths in 2025. That figure comes from media and disaster-management reports, so it is not used here.
- **Per-capita CO2: dropped.** The BUR-4 PDF on unfccc.int returned a bot check, not the file. MoEFCC hosts BUR-3 and the Third National Communication but not BUR-4. BUR-3 gives per-capita energy use but no per-capita emissions figure. PIB (2 Jan 2025) gives total 2020 emissions of 2,959 Mt CO2e without LULUCF and 2,437 Mt CO2e with LULUCF, but no per-capita value.
- **CEA method breaks (C6, C7):**
  - CEA's legacy table lists wind separately from 1998 and lists a separate renewables value in 2005. The executive summaries give a broader renewables total from March 2006. At March 2008 CEA moved 1,168 MW of small hydro from conventional hydro to the renewables total.
  - Monthly reports use revised renewable figures from March 2014. The stack and the share chart split at March 1998, March 2006, March 2014 and March 2022.
  - Before March 2019 CEA had no lignite column. Lignite plants (for example NLC) appear under coal, so the CSV calls that series `coal-incl-lignite`.
  - In 2017 MNRE revised RES capacity for March 2014 to March 2017, mainly by adding about 3,000 MW of captive bagasse cogeneration. The CSV uses the revised values printed in those editions.
  - CEA counts off-grid RES from August 2021.
  - CEA temporarily removed plants under long outage: 2,825 MW coal, 4,400.84 MW gas and 100 MW nuclear from 30 Apr 2025; 370 MW coal and lignite, 978.4 MW gas and 300.861 MW diesel from 31 Aug 2026. This explains most of the fall in gas capacity in 2025 and 2026.
  - Capacity is for utilities only. Captive plants are not included.
- **Derived values.** All shares in C7 except 31 Oct 2026 and 31 Mar 2026 are computed from published MW: non-fossil = (nuclear + hydro + RES) / total. The CSV marks each derived value.
- **MNRE state table (C8)** is location based. It is not the same as the CEA state tables, which add each state's allocated share of central plants. Use MNRE for "capacity built in the state". An "Others" row (49.31 MW) has no state. Blank cells in the source are left blank in the CSV, not set to zero. Jammu and Kashmir and Ladakh are separate rows. Telangana and Andhra Pradesh are separate rows.
- **Licence.** None of the IMD, CEA or MNRE pages that I read stated a reuse licence. Confirm before publication.

## Checks (18 Nov 2026)

- Downloaded IMD's Special Daily Weather Report, 30 Sep 2026, Table 2, page 14. Compared rainfall, normal rainfall, departure and category in all 41 rows with the image. All 36 subdivisions, four homogeneous regions and the India row match. The subdivision counts also match the IMD season release (S1). SHA-256 of the image is `7feac617a8e9a401abd55345c21966665a17b3f2a6f7c97f85dc74fbfd603cad`. [IMD table](https://mausam.imd.gov.in/backend/assets/pdf_to_img_nwfc_monsoon/14_IMD%20SDWR%2030%20September%202026_6abce82b302f8.png) · [IMD season release](https://internal.imd.gov.in/press_release/20260930_pr_5361.pdf)

## Annual temperature series extension

| # | Publisher | Release and period | URL | Read date | Local raw file | SHA-256 |
| --- | --- | --- | --- | --- | --- | --- |
| S10 | IMD Pune, Climate Research and Services | All India Time Series of Temperature, Mean Temperature table. No release date stated. Heading says 1901 to 2024. The table runs to 2025. | https://imdpune.gov.in/cmpg/Product/allindia_temp.html | 18 Nov 2026 | `raw/climate/imdseries/download` | `12a16ecb8c05ad6648eb43643c27c824c2a89d77f973f5c2536521e577551d80` |
| S6 | IMD | Statement on the Climate of India during 2025, page 2, 1 Jan 2026 | https://internal.imd.gov.in/press_release/20260101_pr_4602.pdf | 18 Nov 2026 | `raw/climate/imd2025/download` | `93f4e4f0767dbe7c4b1abe2b1eba255fd4b0a4d03e2ae3e7594be680d76347c9` |
| S11 | IMD Pune, Climate Research and Services | Annual Climate Summary 2025, Table 3 and temperature summary. No release date stated. | https://imdpune.gov.in/cmpg/Product/Annual_Climate_Summary/annual_summary_2025.pdf | 18 Nov 2026 | `raw/climate/imdfull2025/download` | `3eb556f7567251d47dd4f273567296c168b8b8286ef4416be98827e413f1ca7e` |

Run `python3 -I pipeline/climate/build_temperature.py` from the repository root. Read the Annual column in the Mean Temperature table. Keep every published digit in `annual_mean_deg_c`. Subtract the annual normal IMD Pune prints for 1991 to 2020 (25.09°C) with decimal arithmetic. Set `derived=yes` on the 1901 to 2024 rows. Use the published statement anomaly for 2025 and set `derived=no`. The `statement_anomaly_deg_c` column records all six values that the statement names. The chart displays two decimal places and marks the change in source at 2025. The two publishers' files use the same normal period.

| Year | Pune annual mean, °C | Mean minus 25.09°C | 2025 statement anomaly, °C |
| --- | ---: | ---: | ---: |
| 2024 | 25.7431 | +0.6531 | +0.65 |
| 2016 | 25.6305 | +0.5405 | +0.54 |
| 2009 | 25.4891 | +0.3991 | +0.40 |
| 2010 | 25.4804 | +0.3904 | +0.39 |
| 2017 | 25.4721 | +0.3821 | +0.38 |
| 2025 | 25.3704 | +0.2804 | +0.28 |

All six calculated anomalies round to the published values. The Pune annual means also reproduce the five warmest years in the same order and place 2025 eighth. The sixth and seventh years in the table are 2023 and 2022. The Annual Climate Summary confirms +0.28°C and gives the 2025 annual mean rounded to 25.37°C. The data.gov.in catalogue search returned HTTP 403. The direct IMD Pune table supplied the full series.

## Power capacity series extension

All files in this section are from CEA and were read on 18 Nov 2026. The live listings give periods for the Executive Summary and General Review PDFs. The individual files give the edition titles below.

| # | Release and table | Release date | URL | Local raw file | SHA-256 |
| --- | --- | --- | --- | --- | --- |
| S12 | Growth of Electricity Sector in India, 1947 to 2025, Table 2 | 3 Sep 2026 on the CEA list | https://cea.nic.in/whats-new/file?path=/home/cea_website/reports/general/en/Growth_Book_2025_1788430103505.pdf&mode=view | `raw/climate/ceagrowth2025alt/download` | `2cd402537db758d494038a3d12013de75d536b0fa4da84802d6aae856113b8e4` |
| S13 | Executive Summary archive, March 2006 to March 2014 editions | Not stated | https://cea.nic.in/reports/dashboardView?headingId=107&subHeadingId=1003&subSubHeadingId=10071&title=Executive%20Summary&lang=en | `raw/climate/ceaexec/download` | `b4509b96b582499407135edb404dfaca8e1cf5e0caf3288aafaaf0d4c218f949` |
| S14 | All India Electricity Statistics, General Review 2020, Table 1.2 | 2020 edition, through March 2019 | https://cea.nic.in/api/dashboardReports/download-pdf/en/c7700cc7-e5a3-4857-a265-8037cc2ff061 | `raw/climate/ceareview2019/download` | `36b6bf2763a902b5d851c2662b4da85dc2fc1397c2e6b2bf6a4fd196ed3a06c0` |
| S15 | All India Electricity Statistics, General Review 2025, Table 1.2 | 2025 edition, through March 2024 | https://cea.nic.in/api/dashboardReports/download-pdf/en/fa02d71e-25cc-4684-befd-4f840bb43dba | `raw/climate/ceareview2024/download` | `f710de8ee99efb4ae7b3381b32089ae60d766b863d978bff38b4f6354d8dd801` |
| S16 | Growth of Electricity Sector in India, 1947 to 2023, Chart 8B | 2 Sep 2026 on the CEA list | https://cea.nic.in/whats-new/file?path=%2Fhome%2Fcea_website%2Freports%2Fgeneral%2Fen%2FGrowth_Book_2023_merged.pdf&mode=view | `raw/climate/ceagrowth2023/download` | `6c2a117a1b039e69a202b81fc826a7b860142c41f7ed0021ab87880fd56cd32d` |

Executive Summary PDFs (S13). Each URL is `https://cea.nic.in/api/dashboardReports/download-pdf/en/<id>`. Each local path is `raw/climate/cea-exec-<year>/download`. Read the national total in the Installed Capacity table. Use the Growth of Installed Capacity Since Sixth Plans table in the March 2006 edition for 1998 to 2005. Use March 2014 only for comparison.

| Edition | id | SHA-256 |
| --- | --- | --- |
| March 2006 | f81a5818-9dff-483a-bc0f-081b04c0bca4 | `1f1ae867ad5927aef10b9557f1136778ea2bfa57a12d574bb6be1a131e49943b` |
| March 2007 | d41e49df-8379-423d-aea3-c8bb4695478c | `32192b2eb0da4d84746e2df72f02b7868572a85e5e2934690100ccdc87929755` |
| March 2008 | c23317e4-78cc-456e-85e1-7144490c0a1b | `782a9e4c2c6f662109e8984c7d8a7ea46414fac03c3bcca05a60564aa7b4cf1c` |
| March 2009 | 89584095-6d22-4081-9348-2016fc4b1b8e | `173c7d0f3fa00e24da2a9b10c8a150dd263cfd531a88d2774b2133e0dac39a80` |
| March 2010 | 2bbef50d-aae6-4a59-9e74-b94c8cd84034 | `9572c2beee6696bbfbaab259c80f7407a331a847a957b18858c892c6663f994c` |
| March 2011 | cbc3a9e1-3e10-43ea-860e-6dc25e6d2f1f | `71a4ade585b2bc66408502b8db43f9d1e01a6f48a93f6f0ec2430b9e979dcfb4` |
| March 2012 | 6655a384-0a8e-48c7-9727-a76a4cf6ead2 | `4e1bad021940d38a88615e854ab9eb020717df6b5f76f7017361101af3d4c051` |
| March 2013 | d94c4e69-89ae-4805-9c02-f966c4f20a6c | `d29438f8cd221a509d6e3f0a0585a4a4f616ae4d59ffdc6b8d68bf99ef75c325` |
| March 2014 | 3c43ba1d-f204-45ec-b5df-01d4dacc9b73 | `71d6a650dcec1fa21f3912e6075d4739a4f015a77db79a2dcb6d1256a3d0b9a2` |

Run `python3 -I pipeline/climate/build_cea_history.py` from the repository root. Keep the existing monthly CSVs as inputs. The script generates two CRLF CSVs. The `release` column identifies where each observation comes from. The `derived` column identifies calculations.

- `historic-installed-capacity-1947-2013.csv` keeps the digits CEA prints, with grouping commas removed. It preserves each published source breakdown where available. It adds a derived `hydro-and-res` group for the historical stack. This group adds hydro to published RES, or to wind and the separately listed renewables where the legacy table uses those columns. Thermal and nuclear make up the other two bands. This grouping keeps the March 2008 small hydro transfer within one band. The chart starts a new stack with the detailed monthly sources in March 2014. Straight segments connect the selected historical dates within each method.
- `non-fossil-share-of-capacity-1947-2026.csv` adds historical shares and keeps the monthly values. The non-fossil share is 100 times (nuclear + hydro + other renewables) divided by total installed capacity. The share of other renewables is 100 times RES divided by total. It starts in March 2008 with the newer small hydro split. The script rounds derived shares to two decimal places. It preserves the two shares that CEA prints in 2026, 53.21% for March and 55.45% for October. The `method` column records the coverage used by each segment.
- The booklet gives 31 December for 1947 and 1950 and 31 March for its other dates. The booklet and archive supply annual 31 March observations from 1997. Earlier years between published dates remain absent from the CSV.

### Overlap checks

- **Booklet against the General Review before 1998.** In the 12 shared observations from December 1950 through March 1997, every broad mode and total agrees exactly or differs by at most 1 MW. In March 1990 the two publications differ by 1 MW each for hydro and thermal. Their totals agree.
- **Booklet against the legacy Executive Summary.** Both give 105,046 MW in March 2002. The Executive Summary gives 120.54 MW more thermal capacity and reports 1,507.46 MW of wind where the booklet gives 1,628 MW of RES. The March 1997 legacy row puts 61912 MW under thermal and leaves the separate renewables cells blank. The booklet allocates 61010 MW to thermal and 902 MW to RES. The share line breaks when the legacy table takes over in 1998 and when the annual summaries take over in 2006.
- **Booklet and General Review against the March Executive Summaries.** For March 2007 and 2012, the booklet is within 1 MW of the summary for each broad mode and the total. For 2007 to 2013, every broad mode and total in General Review 2020 is within 0.84 MW of the executive summaries. The five RES categories in Chart 8B add to the executive RES total in 2009 to 2013 within 0.01 MW. They match the monthly components within 0.01 MW in every shared year from 2014 to 2023.
- **March 2014 Executive Summary against the revised March 2014 monthly report.** The coal, gas, diesel, nuclear and hydro values match. The Executive Summary uses September 2013 RES of 29,462.55 MW. The revised monthly report gives 34,988.00 MW for March 2014. The two totals differ by 5,525.44 MW. Keep the revised monthly figures and mark the break.
- **General Review and growth booklet against monthly reports.** General Review 2020 matches all five broad figures within 0.50 MW in each of the six shared years from 2014 to 2019. General Review 2025 has 862.00 to 1,770.37 MW more RES than the monthly reports for 2014 to 2021. Its 2022 to 2024 figures match within 0.50 MW. The 2025 booklet has the same larger RES values as General Review 2025 in the shared years 2017 to 2021. The booklet matches monthly reports within 0.50 MW for 2022 to 2025. Retain the monthly report edition for the monthly segment. The script prints each difference in the order hydro, thermal, nuclear, RES, total.
- **Grouping changes inside the monthly reports.** Before March 2019, coal includes lignite. The stack uses one colour for both. The first March observation that includes off-grid renewable capacity is 2022. Its rule marks the start of a new segment in both charts. CEA also removed plants on long outage in April 2025 and August 2026.

### Publisher listings

Read these live pages on 18 Nov 2026. Legacy CEA booklet addresses returned HTTP 404. The current CEA updates page links the booklet.

| Publisher and page | URL | Local raw file | SHA-256 |
| --- | --- | --- | --- |
| CEA, All Updates | https://cea.nic.in/whats-new/all-updates?lang=en | `raw/climate/ceaupdates/download` | `db71138bbf6a040f8668b4e476324aa5363ce3d90d1daabf2f354b4e18ce6991` |
| CEA, General Review | https://cea.nic.in/reports/dashboardView?headingId=107&subHeadingId=1001&subSubHeadingId=10084&title=General%20Review&lang=en | `raw/climate/ceageneral/download` | `5cebe30d9006dddb46726174b451953aa08d1e893ba6d70c3ce2b73f2c310a39` |
| CEA, Installed Capacity | https://cea.nic.in/reports/dashboardView?headingId=107&subHeadingId=1003&subSubHeadingId=10014&lang=en | `raw/climate/cealist/download` | `99450ef793436f680e7f4984e579bf0e947086b4ca6a25e1d3614709c3f54bf8` |
| IMD Pune, Climate Monitoring | https://imdpune.gov.in/lrfindex.php | `raw/climate/imdmonitor/download` | `21edc142d506348101dc70b1303037e875738142e39155890b39c79fd78de74a` |
| IMD Pune, Annual Climate Summary | https://imdpune.gov.in/cmpg/Product/acs.php | `raw/climate/imdacs/download` | `ba88eca6d008935a0867e6417b64e6ed19c045b4fb8c91b6fa23c7b2ebac7b90` |

## Publisher check on 18 Nov 2026

The IMD monsoon and annual temperature files match their earlier checksums. The October monthly climate summary is still the latest, and the new IMD press notices concern weather forecasts. The CEA list still ends in October 2026. Its download addresses changed for October and the March reports. The October PDF and workbook and all 13 March PDFs match their earlier checksums. The MNRE October state capacity PDF also matches.

| Release or file checked | Release date | URL | Fetched | SHA-256 |
| --- | --- | --- | --- | --- |
| IMD press release list | Live list | https://internal.imd.gov.in/pages/press_release_mausam.php | 18 Nov 2026 | `19a8772b773cc53425d08e58a162968d17eb872d879bcfa2485d2f1767c0e29b` |
| IMD Pune monthly climate summary list | Latest period October 2026 | https://imdpune.gov.in/mcs.php | 18 Nov 2026 | `32bda92c6fc5942bc3f586eb5adf9bc3cb7a8c8a63fec659e3a88d914044886a` |
| CEA installed capacity report list | Latest period 31 Oct 2026 | https://cea.nic.in/reports/dashboardView?headingId=107&subHeadingId=1003&subSubHeadingId=10014&lang=en | 18 Nov 2026 | `bd43ed25bacbacc2c3bd78101a191ecdf48603be33249056013eaa2360676948` |
| MNRE state-wise renewable power capacity, October | 12 Nov 2026 | https://mnre.gov.in/static/uploads/2026/11/4519bf2a3faca1ef18d71b8a267812a6.pdf | 18 Nov 2026 | `1a47d414a775f7824906148f12ccec59c6c9568a92bf3bc2e3b160125244797f` |
| MNRE media uploads from 17 to 18 Nov | Live list | https://mnre.gov.in/cms/wp-json/wp/v2/media?after=2026-11-16T00:00:00&before=2026-11-19T00:00:00&per_page=100 | 18 Nov 2026 | `69502ba9a77fd5dc75138dd5e6a99836cfc1d5d279b71d9dcad83c7fd15a2fde` |
