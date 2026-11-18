# Climate

Data gathered on 17 Nov 2026 from IMD, IMD Pune, CEA and MNRE. All values are as published. Read date for every source: 17 Nov 2026.

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
- Sentence: "17 of 36 subdivisions had deficient rain in 2026. Arunachal Pradesh was 44% short and Punjab 41% short. Odisha was the only subdivision with excess rain, at 29% above normal."
- Source: IMD National Weather Forecasting Centre, Special Daily Weather Report, 30 Sep 2026, Table-2 "Met. Subdivision-wise Seasonal Cumulative Rainfall Statistics".

### C3. 2026 monsoon month by month, by region

- Type: small multiples (one panel per region) or grouped bar, % departure by month.
- Unit: mm and % departure from LPA.
- Geography: India and 4 homogeneous regions. Period: June, July, August, September 2026 and the season.
- CSV: `monsoon-2026-by-month-and-region.csv`
- Sentence: "June 2026 brought 35% less rain than normal across India. In Central India, June rain was half of normal, then July was 33% above normal."
- Source: IMD Pune, "Rainfall statistics: monsoon season 2026" (rfstats.gif on the 2026 monsoon page); season report of 30 Sep 2026.

### C4. India's warmest years

- Type: ranked bar (horizontal).
- Unit: °C anomaly in annual mean land surface air temperature, against 1991 to 2020.
- Geography: India. Period: named years from 1901 to 2025.
- CSV: `warmest-years-temperature-anomaly.csv`
- Sentence: "2024 was India's warmest year since records began in 1901, at 0.65°C above the 1991 to 2020 average. 2025 was the eighth warmest, at 0.28°C above."
- Source: IMD, "Statement on the Climate of India during 2025", press release, 1 Jan 2026.

### C5. Temperature in 2025 by season

- Type: bar chart (diverging around zero).
- Unit: °C anomaly against 1991 to 2020.
- Geography: India. Period: 2025, four seasons and the year.
- CSV: `temperature-anomaly-2025-by-season.csv`
- Sentence: "January and February 2025 were 1.17°C warmer than the 1991 to 2020 average, the warmest winter since 1901."
- Source: IMD, "Statement on the Climate of India during 2025", 1 Jan 2026.

### C6. Installed power capacity by source

- Type: stacked bar (one bar per 31 March, plus 31 Oct 2026).
- Unit: MW.
- Geography: India (utilities). Period: 31 Mar 2014 to 31 Oct 2026.
- CSV: `installed-capacity-by-source-2014-2026.csv`
- Sentence: "Solar capacity grew from 2,632 MW in March 2014 to 174,547 MW in October 2026. Coal and lignite capacity grew from 145,273 MW to 231,438 MW." (231,438 MW is the sum of the published coal, 225,068 MW, and lignite, 6,370 MW.)
- Source: Central Electricity Authority, "Installed Capacity" monthly reports, editions for March 2014 to March 2026 and October 2026.

### C7. Non-fossil share of installed capacity

- Type: line. Option: add a second line for wind, solar and other RE only.
- Unit: % of total installed capacity.
- Geography: India. Period: 31 Mar 2014 to 31 Oct 2026.
- CSV: `non-fossil-share-of-capacity-2014-2026.csv`
- Sentence: "On 31 Oct 2026, non-fossil sources made up 55.45% of India's 563,113 MW of power capacity, up from 32.31% in March 2014."
- Source: CEA Installed Capacity reports. Shares before 2026 are derived from the published MW values. CEA itself prints 55.45% for 31 Oct 2026.

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

## Sources

All read on 17 Nov 2026. Raw files are under `raw/climate/` (not in the repo). No licence was stated on any of these pages unless noted.

| # | Publisher | Release or table | Release date | Data period | URL | sha256 of raw file |
| --- | --- | --- | --- | --- | --- | --- |
| S1 | IMD (MoES) | Salient Features of the 2026 Southwest Monsoon Season (press release 5361) | 30 Sep 2026 | Jun to Sep 2026 | https://internal.imd.gov.in/press_release/20260930_pr_5361.pdf | 2eb8c406c0f8ec7248c64109e59f5312afd672fd36557d2e75a0bd0ae1437f4c |
| S2 | IMD NWFC | Special Daily Weather Report, 30 Sep 2026, page 14, Table-2 (image) | 30 Sep 2026 | 1 Jun to 30 Sep 2026 | https://mausam.imd.gov.in/backend/assets/pdf_to_img_nwfc_monsoon/14_IMD%20SDWR%2030%20September%202026_6abce82b302f8.png (linked from https://mausam.imd.gov.in/responsive/monsooninformation.php) | 7feac617a8e9a401abd55345c21966665a17b3f2a6f7c97f85dc74fbfd603cad |
| S3 | IMD Pune, CRS | India (June-Sept) Rainfall, all-India table, actual mm and % departure | Not stated; includes 2026 | 1901 to 2026 | https://imdpune.gov.in/cmpg/Product/Rainfall_Data.html | b8ec58473b4663e6afbe70d97b27072a8d2a90e60ed6d22a562c3e73f05a6759 |
| S4 | IMD Pune, CRS | Rainfall statistics, monsoon season 2026 (image) | Not stated | Jun to Sep 2026 | https://imdpune.gov.in/seasons_previous/swmonsoon/swmonsoon26/rfstats.gif | c1887a78140b00442925bf104aa1c44690a158289e084d62981e54729f715708 |
| S5 | IMD Pune, CRS | End of season report, SW monsoon 2026 (same text as S1, plus forecast verification) | Not stated | Jun to Sep 2026 | https://imdpune.gov.in/seasons_previous/swmonsoon/swmonsoon26/end_of_season_report.pdf | 14c8d348b85c68437f695e2a4dae74e3cd5305b07c028c1aeb7904f17a41f4bd |
| S6 | IMD (MoES) | Statement on the Climate of India during 2025 (press release 4602) | 1 Jan 2026 | 2025; trend 1901 to 2025 | https://internal.imd.gov.in/press_release/20260101_pr_4602.pdf | 93f4e4f0767dbe7c4b1abe2b1eba255fd4b0a4d03e2ae3e7594be680d76347c9 |
| S7 | CEA | Installed Capacity report, as on 31.10.2026 (PDF and Excel) | Monthly report; listed on 17 Nov 2026 | 31 Oct 2026 | https://cea.nic.in/api/dashboardReports/download-pdf/en/e555d23c-f02b-4c6a-8324-f6f8f02e32b2 and .../download-excel/en/e555d23c-f02b-4c6a-8324-f6f8f02e32b2 (list: https://cea.nic.in/reports/dashboardView?headingId=107&subHeadingId=1003&subSubHeadingId=10014&lang=en) | PDF 469533103e2656467468a92a0ed3f617d587a789cdb6f3bc2e56aea677258fcd; XLSX 7071b89cc58c9f90f181bb6b62ea530bb2e0c3310eda2383eea592acf9d4fc8e |
| S8 | CEA | Installed Capacity reports, March editions 2014 to 2026 | Monthly | 31 Mar of each year | Same list page; one download-pdf id per edition (see table below) | See table below |
| S9 | MNRE | State-wise (Location based) installed capacity of Renewable Power as on 31.10.2026 | 12 Nov 2026 | 31 Oct 2026 | https://mnre.gov.in/static/uploads/2026/11/4519bf2a3faca1ef18d71b8a267812a6.pdf (found through https://mnre.gov.in/cms/wp-json/wp/v2/media/23331) | 1a47d414a775f7824906148f12ccec59c6c9568a92bf3bc2e3b160125244797f |

CEA March editions (S8). URL pattern: `https://cea.nic.in/api/dashboardReports/download-pdf/en/<id>`.

| Edition | id | sha256 |
| --- | --- | --- |
| 2014-03 | ad188008-b0b5-478c-a020-9126c0356da0 | 264e6f33c872aa55cdea5d3237a401467fa203ee5829817cc05d3dfd207c9a69 |
| 2015-03 | 8620778a-0562-4107-9f28-d04b67d9ea0e | 22acbed6a45d9ecf99b57d4bac507f17d640dd1467b5eed9c25664b5c3abe107 |
| 2016-03 | 4d709c0f-6154-4ab8-a350-f773749d5d75 | 155038f50c9580289f5d5b32767f42850495c84fec04c7e13058a27919475fc7 |
| 2017-03 | 7d2b2ef4-24e4-4003-8b62-768cd2a7f9bb | 6f19d7817cf441e278875018268234882c97bd7489019157144c4ea29b938a7d |
| 2018-03 | f5145f09-0006-44b0-ae0b-7ceec4d03508 | a4d25ab9775bfd3b05ca3aef3774d52cb7d8acca0494351803aee11e7b742072 |
| 2019-03 | 70bdb226-87b9-4d3f-891c-b215a36dcf95 | 0f97554ae1ce81fe040dab8b0d5dcfcae7decaaca6c4a38ba9f28b5c2bed2ec5 |
| 2020-03 | 79b340bb-926e-4204-a02b-bd7bda898ad2 | 2c01b27acdb5076218362a02ddfa1a082ec392cdbdf97012731c17d5ed7620b1 |
| 2021-03 | a678ed94-3dd0-4219-a7af-9439ec62aa2a | 9c48c9fff23350567532cf75a460ef2b94f085a16db899d80d5a4e1a71533c67 |
| 2022-03 | e6c85dad-ddd8-4bcf-a4b4-0fd9d42c6e88 | eb81cb38a2d77b457f04461714cc4d9075570675b71ccc1da731f26f9e123049 |
| 2023-03 | cdb0a97e-ae95-45c0-b372-b8e775129f6e | 5befa505c12631de2cfc2c9117746e5f45a9d45179f4d768598677491595cbff |
| 2024-03 | d46f2691-9cf2-4a0a-ac53-817a4d5e9f29 | 92115eb6006f814bc27887c20739b39fc29041bd276635fa06f45a991afccc89 |
| 2025-03 | 5617fcb8-e486-485e-97b2-8a1203b28d70 | 03f262fc775ec00740a465311a3542f75135eeba32e52f8ef20c3ae9be405446 |
| 2026-03 | 0fd0398d-45fb-4108-8799-44f0325bbd79 | b5d9dbf33520d03bf1006d46cac713b1c5dd483efe6499bf5c4d60b6a79ea9f2 |

Files checked but not used for a chart:

| Publisher | File | URL | sha256 |
| --- | --- | --- | --- |
| MoSPI (NSO) | EnviStats India 2025 Vol. I (scanned PDF) | https://www.mospi.gov.in/sites/default/files/reports_and_publication/statistical_publication/EnviStats/Complete_ES1_2025.pdf | 2652fe6f272e33d69b69dbacbc439fbb6cdc8ca523aff6a52df39f8e276aea64 |
| PIB (MoEFCC) | India submits its 4th Biennial Update Report to the UNFCCC, 2 Jan 2025 | https://pib.gov.in/PressReleaseIframePage.aspx?PRID=2089589 | 10d570ef046a075fb5d49d88952d160027d32d7bfa311b223549604e54ad1352 |

Parsing scripts: `pipeline/climate/` (`build_rain.py`, `build_subdiv.py`, `parse_cea.py`, `build_cea.py`, `build_mnre.py`, `xlsx_dump.py`). Each script asserts the source totals: CEA parts sum to the grand total, MNRE state rows sum to their own totals and to 303,463 MW, and the subdivision categories count 18 normal, 17 deficient, 1 excess, as IMD reports.

## Gaps and cautions

- **Annual temperature series since 1901: not found as data.** IMD shows it only as a chart (Fig. 1 in S6). I tried the IMD press release, IMD Pune climate pages, the IMD Pune data portal (needs a login), and EnviStats India 2025 (a scanned PDF with only a 2001 to 2024 chart and no table). C4 and C5 use the values that IMD states in text. Do not join anomalies from older IMD statements: they used the 1981 to 2010 base.
- **State-wise monsoon rainfall for 2026: not found.** The IMD state rainfall page now shows only the post-monsoon period (from 1 Oct 2026). `hydro.imd.gov.in` did not resolve and `imdgeospatial.imd.gov.in` did not connect. C2 uses the 36 IMD meteorological subdivisions. They do not match state lines. Several states have more than one subdivision (Maharashtra 4, Karnataka 3, Rajasthan 2, Uttar Pradesh 2, Madhya Pradesh 2, Gujarat 2, Andhra Pradesh 2). Some subdivisions cover more than one state. Do not draw C2 on a state tile map.
- **C2 values are transcribed** from an image of the SDWR table (S2). See the check below.
- **2026 rainfall is real-time data.** IMD may revise it in the final monsoon report.
- **Small differences between IMD documents.** East and Northeast India season rain is 1017.1 mm in S2, S4 and the S1 highlights, but 1016.3 mm in S1 Table 1. The S1 text says June rain was 104 mm (37% short); its table says 106.8 mm (65% of LPA). The CSVs keep the table values. IMD rounds the season departure to -13% (S2) and gives -12.6% in S3 and S4.
- **Heatwave days: not found.** IMD did not publish a count of heatwave days for 2026 on the press release list or the IMD Pune pages that I checked. The 2025 climate statement gives about 35 heatwave deaths in 2025. That figure comes from media and disaster-management reports, so it is not used here.
- **Per-capita CO2: dropped.** The BUR-4 PDF on unfccc.int returned a bot check, not the file. MoEFCC hosts BUR-3 and the Third National Communication but not BUR-4. BUR-3 gives per-capita energy use but no per-capita emissions figure. PIB (2 Jan 2025) gives total 2020 emissions of 2,959 Mt CO2e without LULUCF and 2,437 Mt CO2e with LULUCF, but no per-capita value.
- **CEA method breaks (C6, C7):**
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
