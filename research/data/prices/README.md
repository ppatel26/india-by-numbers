# Prices

Data from MoSPI (NSO), the Reserve Bank of India (RBI) and Labour Bureau data published by RBI. The first collection was on 17 Nov 2026. See each source table for the read date. The CSV notes identify derived values.

The main source is the MoSPI eSankhyiki API at `api.mospi.gov.in`. It serves the same numbers as the eSankhyiki portal and the official MoSPI MCP server (`mcp.mospi.gov.in/mcp`). The October 2026 values match the MoSPI CPI press release of 12 Nov 2026, table by table.

## Questions this topic answers

1. How fast are prices rising in India now, and how does that compare with the RBI target?
2. Which states have the highest and the lowest inflation?
3. Which goods and services are driving inflation: food, fuel, housing or something else?
4. Is inflation higher in villages or in towns?
5. How has the RBI moved its policy rate in response?

## Charts

### P1. Consumer price inflation since 2012

- Type: line, with a shaded band for the RBI tolerance range (2% to 6%) and a reference line at the 4% target. Show a method break at January 2026.
- Unit: % change on the same month a year earlier.
- Geography: India. Period: January 2012 to October 2026, monthly. Combined (rural plus urban).
- CSV: `cpi-inflation-monthly.csv`, with the band in `inflation-target.csv`.
- Sentence: "Consumer prices rose by 6.09% in the year to October 2026, above the RBI's upper limit of 6%. The last rate above 6% was 6.21% in October 2024, on the old 2012 base. A year earlier, in October 2025, inflation was 0.25%, the lowest since the series began."
- Source: MoSPI, CPI (base 2012=100) back series for January 2012 to May 2013 and current series for January 2014 to December 2025; CPI (base 2024=100) current series for January to October 2026. API `getCPIIndex` (base 2012) and `getCPIData` (base 2024). October 2026 is provisional.
- Notes: the series has three gaps. MoSPI does not give a rate for June to December 2013 in either base-2012 series, or for April and May 2020 (COVID-19 lockdown). These rows are in the CSV with an empty value. The 2012 and 2024 series use different baskets and weights. Do not join them without the break marker.

### P2. Inflation by state, October 2026

- Type: ranked bar by state, and tile map by state.
- Unit: % change on October 2025.
- Geography: 36 states and union territories, plus India. Period: October 2026 (provisional).
- CSV: `cpi-inflation-by-state.csv` (sectors: combined, rural, urban).
- Sentence: "In October 2026 inflation was highest in Puducherry, at 7.96%, and lowest in Mizoram, at 2.85%. Among the large states, Tamil Nadu (7.29%), Telangana (7.26%) and Andhra Pradesh (7.25%) had the highest rates."
- Source: MoSPI, CPI (base 2024=100), state-wise general index, October 2026. Same values as Annexure III of the press release of 12 Nov 2026.
- Notes: all 36 states and union territories have a combined value. MoSPI warns that state indices for some items use thin samples.
- September 2026 rows: the same CSV also holds September 2026 (status `final`, 110 rows: combined and urban for India and all 36 states and UTs, rural for India and 35). They back the "Sep 2026" column and the change in percentage points on the Table tab. Parsed on 17 Nov 2026 from the same raw file, `prices/api/cpi24_general_allstates.all.json`, by `pipeline/prices/add_sep2026_states.py` (run with `python3 -I`). India, combined: 5.54% in September 2026.
- January to August 2026 rows: added on 18 Nov 2026 for the chart page timeline (status `final`, 880 rows: 110 per month, same sectors and coverage as September). Parsed from the same raw file, `prices/api/cpi24_general_allstates.all.json`, by `pipeline/prices/extend_jan_aug2026_states.py` (run with `python3 -I`). The script first checked that all 220 September and October rows in the raw file match the CSV exactly. The rows before were left unchanged; the CSV now has 1,100 data rows. India, combined: 2.74% in January 2026 and 4.83% in August 2026.

### P3. What is driving inflation: the 12 divisions, October 2026

- Type: horizontal bar, sorted by inflation. Show the weight of each division as a label or as bar thickness.
- Unit: % change on October 2025; weight in % of the basket.
- Geography: India. Period: October 2026 (provisional). Rural, urban and combined.
- CSV: `cpi-inflation-by-division-latest.csv`
- Sentence: "Food and drink, which makes up 36.75% of the basket, rose by 8.51% in the year to October 2026. Personal care and miscellaneous goods rose by 10.14%, and restaurants and hotels by 10.06%. Health rose by only 2.05%."
- Source: MoSPI, CPI (base 2024=100), division indices, October 2026; weights from Annexure I of the CPI press release of 12 Nov 2026.
- Notes: the divisions follow COICOP 2018. Division code 13 is "Personal care, social protection and miscellaneous goods and services"; there is no division 12 in the press release. The press release names gold and silver jewellery among the fastest-rising items (silver jewellery: 52.39%).

### P4. Inflation by division, month by month in 2026

- Type: small multiples, one line per division, January to October 2026.
- Unit: % change on the same month a year earlier.
- Geography: India. Period: January to October 2026. Rural, urban and combined.
- CSV: `cpi-inflation-by-division-2026.csv`
- Sentence: "Headline inflation rose in every month of 2026, from 2.74% in January to 6.09% in October."
- Source: MoSPI, CPI (base 2024=100), `getCPIData`, one request per month and sector.

### P5. Food, fuel, housing and clothing inflation, 2012 to 2025

- Type: small multiples or a line chart with a group picker.
- Unit: % change on the same month a year earlier.
- Geography: India, combined. Period: January 2012 to December 2025.
- CSV: `cpi-inflation-by-group-2012-base.csv`. The `series` column identifies the API series.
- Source: MoSPI, CPI (base 2012=100), back and current series.
- Back-series rates end in May 2013 for housing and all items, and December 2012 for the other groups. Current-series rates start in January 2014. The chart marks the switch and separates the lines. The CSV adds 106 published rates and 86 rows with an index and no rate. Housing covers urban areas.

### P6. Rural and urban inflation

- Type: line, two lines (rural, urban), with combined as an option.
- Unit: % change on the same month a year earlier.
- Geography: India. Period: January 2012 to October 2026. Breaks at January 2014 and January 2026.
- CSV: `cpi-inflation-rural-urban.csv`
- Sentence: "In October 2026 prices rose faster in villages than in towns: 6.63% in rural areas and 5.41% in urban areas."
- Source: MoSPI, CPI (base 2012=100) back and current series to December 2025, and CPI (base 2024=100) from January 2026.
- The back series gives rural rates through December 2012 and urban and combined rates through May 2013. The CSV adds 46 published rates and 26 rows with an index and no rate. The January 2026 break marks the start of base 2024=100, which uses a new basket and weights.

### P7. The RBI repo rate since 2001

- Type: step line.
- Unit: % a year.
- Geography: India. Period: 27 April 2001 to 18 November 2026. The latest change took effect on 7 October 2026.
- CSV: `repo-rate.csv`. The `regime` column separates the variable-auction and fixed-rate periods. The `change_bps` column gives the calculated change from the previous rate in the same period. The `status` column marks the derived 28 March 2004 endpoint and the 18 November 2026 snapshot.
- Sources: RBI Handbook 2010-11, Table 46, and RBI Handbook 2025-26, Table 40. The 2004 policy statement supplies the first fixed rate and its effective date. RBI policy statements and minutes confirm decisions from April 2025. The October 2026 MPC resolution supplies the latest change.
- The RBI launched the Liquidity Adjustment Facility on 5 June 2000 with variable auctions. Table 46 first reports a lending rate on 27 April 2001. The RBI switched to fixed rates on 29 March 2004. The chart marks this break and separates the lines. The Handbook uses the current term for the lending rate throughout, including before the October 2004 swap of the terms repo and reverse repo. The repo rate became the single independently varying policy rate on 3 May 2011.

### P8. Inflation over the long run, 1993-94 to 2025-26

- Type: line by financial year, two series: CPI for industrial workers (CPI-IW) and CPI Combined.
- Unit: % change in the average index for the year.
- Geography: India. Period: 1993-94 to 2025-26 (CPI-IW); 2012-13 to 2025-26 (CPI Combined).
- CSV: `cpi-annual-inflation-long-run.csv`
- Sentence: "Inflation for industrial workers reached 13.1% in 1998-99 and 12.4% in 2009-10. In 2024-25 it was 3.4%."
- Source: RBI, Handbook of Statistics on Indian Economy 2025-26, Table 236 (data from the Labour Bureau and NSO).
- Notes: CPI-IW changed base in 2005-06 (2001=100) and 2020-21 (2016=100); RBI links the series with factors given in the table notes. For 2025-26 the CPI Combined value is split: 1.7% for April to December 2025 (base 2012) and 3.1% for January to March 2026 (base 2024).

### P9. Food inflation (Consumer Food Price Index, CFPI), 2026

- Type: a line on chart P4 (2026 divisions), and the second headline figure.
- Unit: % change on the same month a year earlier.
- Geography: India. Period: January to October 2026, monthly. Rural, urban and combined.
- CSV: `cfpi-inflation-2026.csv` (columns geography, period, value, unit, sector, base, status).
- Sentence: "Food inflation, on the Consumer Food Price Index, was 8.94% in October 2026, up from 2.13% in January."
- Source: MoSPI, Press Releases of Consumer Price Index on base 2024=100, January to October 2026, table "National Level Indices" (page 1). The eSankhyiki API serves no CFPI series, so the values come from the releases. Each month's final value is the one in the next month's release; October 2026 is provisional (release of 12 Nov 2026). The May 2026 release was read on PIB (Release ID 2272112, posted 12 Jun 2026, 4:00 pm).
- Notes: the CFPI is not the same as the "Food and beverages" division (8.51% in October 2026). It covers food items only, with its own weights. March 2026 rural moved from 3.96% (provisional) to 3.95% (final); the CSV holds the final value.
- Rebuild: `pipeline/prices/cfpi_2026.py` (run with `python3 -I`), from the raw files in `raw/prices/cfpi/cfpi-*`. Raw downloads are not kept in the repository; the URL and sha256 in "CFPI raw files" identify each file. The script checks each value against the release text. Built on 18 Nov 2026.

## Headline figures

| Figure | Value | Period | Source |
| --- | --- | --- | --- |
| Consumer price inflation (CPI Combined) | 6.09% | October 2026, provisional | MoSPI CPI press release, 12 Nov 2026 |
| Food inflation (Consumer Food Price Index) | 8.94% | October 2026, provisional | MoSPI CPI press release, 12 Nov 2026 |
| Rural / urban inflation | 6.63% / 5.41% | October 2026, provisional | MoSPI CPI press release, 12 Nov 2026 |
| Highest and lowest state inflation | Puducherry 7.96%; Mizoram 2.85% | October 2026, provisional | MoSPI eSankhyiki, CPI base 2024 |
| RBI policy repo rate | 5.50% (raised by 0.25 points) | from 7 Oct 2026 | RBI Governor's Statement, 7 Oct 2026; RBI home page, 17 Nov 2026 |
| RBI inflation target | 4%, tolerance 2% to 6% | 1 Apr 2026 to 31 Mar 2031 | RBI, Monetary Policy Framework page (fs_overview.aspx?fn=2752) |

## Sources

| Publisher | Release or table | Release date | Data period | URL read | Read date | Licence | Raw file (sha256 in "Raw files") |
| --- | --- | --- | --- | --- | --- | --- | --- |
| MoSPI, NSO | Press Release of Consumer Price Index on base 2024=100 for October 2026 | 12 Nov 2026, 4:00 pm | Oct 2026 (provisional), Sep 2026 (final) | https://www.mospi.gov.in/uploads/latestReleases/latest_release_1794478693814_7c90e80f-9e64-4aa4-b44a-1dc727b0fed9_Press_Release_of_CPI_for_October_2026_.pdf | 17 Nov 2026 | Not stated | `prices/pdf/cpi_oct2026_pr.pdf` |
| MoSPI, NSO | eSankhyiki API, CPI base 2024=100, `getCPIData` (Current and Back series) | Updated with each monthly release; latest 12 Nov 2026 | Jan 2025 to Oct 2026 (Current); 2013 to 2024 (Back, all-India only) | https://api.mospi.gov.in/api/cpi/getCPIData | 17 Nov 2026 | Not stated | `prices/api/cpi24_*` |
| MoSPI, NSO | eSankhyiki API, CPI base 2012=100, `getCPIIndex` (Current and Back series) | Final series; last month December 2025 | Jan 2011 to May 2013 (Back); Jan 2013 to Dec 2025 (Current) | https://api.mospi.gov.in/api/cpi/getCPIIndex | 17 Nov 2026 | Not stated | `prices/api/cpi12_allindia.all.json`, `prices/api/cpi12back_allindia.all.json` |
| MoSPI | Home page data (tiles and latest releases) | Live | Tiles: CPI Oct 2026, IIP Sep 2026, GDP Q1 2026-27 | https://www.mospi.gov.in/api/main-site/get-home-main-site-data | 17 Nov 2026 | Not stated | `prices/mospi_main-site_get-home-main-site-data.json` |
| RBI | Handbook of Statistics on Indian Economy 2025-26, Table 40: Major Monetary Policy Rates and Reserve Requirements | 31 Jul 2026 (file date in name) | 26 Apr 2008 to 5 Dec 2025 | https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/40T_HBIE31072026FF3E894445944DA8A3C011F1653F999A.XLSX | 17 Nov 2026 | Not stated | `prices/rbi/40T_*.XLSX` |
| RBI | Governor's Statement, 7 Oct 2026 (repo rate raised to 5.50%) | 7 Oct 2026 | MPC meeting 5 to 7 Oct 2026 | https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63744 | 17 Nov 2026 | Not stated | `prices/rbi/pr63744.html` |
| RBI | Governor's Statements, 8 Apr, 5 Jun and 5 Aug 2026 (repo rate unchanged at 5.25%) | 8 Apr, 5 Jun, 5 Aug 2026 | MPC meetings 2026 | https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=62515 ; ...prid=62864 ; ...prid=63288 | 17 Nov 2026 | Not stated | `prices/rbi/pr62515.html`, `pr62864.html`, `pr63288.html` |
| RBI | Monetary Policy Framework overview (inflation target retained on 25 Mar 2026 for 1 Apr 2026 to 31 Mar 2031) | Live page | 2016 to 2031 | https://www.rbi.org.in/scripts/fs_overview.aspx?fn=2752 | 17 Nov 2026 | Not stated | `prices/rbi/fs_overview_2752.html` |
| RBI | Handbook of Statistics on Indian Economy 2025-26, Table 236: Consumer Price Index (Average of Months) - Annual Variation | 31 Jul 2026 | 1993-94 to 2025-26 | https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/236T_HBIE310720260380CC1834364289AF00337B7FFD8336.XLSX | 17 Nov 2026 | Not stated | `prices/rbi/236T_*.XLSX` |
| RBI | Home page, "Current Rates" box | Live | 17 Nov 2026 | https://www.rbi.org.in/ | 17 Nov 2026 | Not stated | `economy/rbi/rbi_home.html` |
| MoSPI, NSO | Press Releases of Consumer Price Index on base 2024=100, January to October 2026 (CFPI rows, page 1) | 12 Feb, 12 Mar, 13 Apr, 12 May, 12 Jun, 13 Jul, 12 Aug, 14 Sep, 12 Oct and 12 Nov 2026, 4:00 pm (embargo line of each release) | Jan to Oct 2026 | See "CFPI raw files" | 18 Nov 2026 | Not stated | `prices/cfpi/cfpi-*` |

Handbook tables 163 and 243 (monthly CPI indices and variation) were also downloaded as a cross-check. They are not used in a chart.

## Gaps and cautions

- **Method break, January 2026.** CPI moved to base 2024=100 with a new basket (COICOP 2018 divisions, 12 divisions in place of 6 groups) and new weights. The 2012 series ends in December 2025. MoSPI also publishes a 2024-base "Back" series for all-India from 2013. Its inflation rates match the 2012 series (for example 6.21% in October 2024), so it is a rescaled link, not a new measure. We did not use it.
- **Gap, June to December 2013.** Not found. The 2012-base Back series stops at May 2013, and the 2012-base Current series gives no rate before January 2014. We tried both series in the API, month by month. The CSV marks these months as empty. Do not fill them in.
- **Gap, April and May 2020.** The API gives the index but no inflation rate for the general index, with status flag `F*`. These were the national lockdown months. The API does not define the flags `F*` and `F+`.
- **Provisional data.** October 2026 is provisional. MoSPI finalises it with the November release, due on 14 Dec 2026.
- **States.** All 36 states and union territories are present for October 2026. State indices use thinner samples than the national index. MoSPI says to use state-level item indices with caution.
- **Groups versus divisions.** P5 (2012 groups) and P3/P4 (2024 divisions) are not comparable. "Food and beverages" exists in both but with different contents and weights (36.75% in 2024).
- **Repo history before April 2001.** The facility began with variable auctions in June 2000. The Handbook's policy-rate table has no lending-rate setting for this first phase.
- **CPI-IW is not CPI Combined.** CPI-IW covers industrial workers only, and is compiled by the Labour Bureau. Label it clearly. Its base changed in 2005-06 and 2020-21.
- **A pagination fault in the API.** The base-2012 endpoint returned duplicate rows across pages (and so dropped others) when we paged through 13,104 rows. We refetched one month per request, checked that every month has unique keys, and used that file. The base-2024 endpoint did not show this fault (every key unique).
- **Licence.** None of the pages read states a reuse licence for these data.

## Rebuild

Run `python3 -I pipeline/prices/build_prices_economy.py` from the repository root to build the CSVs from `raw/prices/` and `raw/economy/`. To regenerate the two CPI extensions from the checked-in CSVs, run `python3 -I pipeline/prices/extend_cpi12.py`. Add `--fetch` to download the source responses first. Run `python3 -I pipeline/prices/build_repo_rate.py` to rebuild the repo rate CSV from the saved RBI pages. The URL and SHA-256 below identify each file.

## Historical overlap checks

- CPI, base 2012=100. The back and current extracts share 20 index observations in January to May 2013. All 20 indices differ. The current series supplies no rates for those months, so there are zero rates to compare. For example, the January 2013 combined index is 105.1 in the back series and 104.6 in the current series. The back series gives a rate of 10.52%. Keep the two series separate. The 11 entries in the January 2014 CSV boundary sample, three sector rows and eight group rows, match the current API rates, indices and status flags.
- RBI Handbook. Tables 46 and 40 agree on all 20 lending-rate dates from 12 June 2008 to 26 July 2011. Use Table 40 from June 2008. All 56 effective dates and rates in the previous CSV match the rebuilt data. The September 2010 edition of Table 46 omits the 24 January 2006 and 5 January 2009 entries. The September 2011 edition includes both.
- First fixed rate. Table 46 and paragraph 74 of the Annual Policy Statement for 2004-05 give 6.00%. Table 46 places the rate on 31 March 2004. The policy statement gives the effective date as 29 March 2004. It uses the term reverse repo for liquidity injection.
- RBI statements. The 9 April, 6 June and 5 December 2025 decisions agree with Table 40. The 6 August and 1 October 2025 statements confirm holds at 5.50%. The February, April, June and August 2026 statements and MPC resolutions confirm holds at 5.25%. The 7 October statement and resolution and the 21 October minutes confirm the rise to 5.50%. The RBI monetary policy list and home page confirmed on 18 November that October was the latest decision and 5.50% was still in effect.
- The Table 40 XLSX URL served an HTML bot challenge. The RBI's Table 40 HTML page supplied the data.

## Raw files

Paths are relative to `raw/`. Raw downloads are not kept in the repository; the URL and sha256 below identify each file. Files ending `.pN.json` are single API pages; `.all.json` merges them.

| File | Source URL | sha256 |
| --- | --- | --- |
| `prices/api/cpi12_allindia.all.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Current&state_code=99&year=<y>&month_code=<m>&limit=100&page=1 (merged pages) | `43d29e4182e57e8b3a3c822af9fe5bae826a01dd27df514e6006aaba82c7a29a` |
| `prices/api/cpi12back_allindia.all.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=<y>&month_code=<m>&limit=100&page=1 (merged pages) | `fc9e4df0b6b36e609cb32f2f5733b76ddc34c194ce36bfb2f3f509673624e290` |
| `prices/api/cpi24_general_allstates.all.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2025,2026&division_code=0 (merged pages) | `d83325e68d70e19d8320dd9ec7dab7dacebe78b33ad756b582e882af60420e5c` |
| `prices/api/cpi24_general_allstates.p1.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2025,2026&division_code=0&limit=100&page=1 | `65336e4d30d3d6526c023d17ae564e2c6f923fe4ebb8fac62be79e1f940f0a53` |
| `prices/api/cpi24_general_allstates.p10.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2025,2026&division_code=0&limit=100&page=10 | `2b113e35d2af1b47eb552e5eb987be654fe6664a198352c35fb32f5de0a73401` |
| `prices/api/cpi24_general_allstates.p11.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2025,2026&division_code=0&limit=100&page=11 | `4a804945d66dfa48c8e1acb05d3d2de02e6e1f953824497c0dfa31a6640a7d98` |
| `prices/api/cpi24_general_allstates.p12.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2025,2026&division_code=0&limit=100&page=12 | `b047fbd308be68625a4ffe71dfb09af7415c2724d7168812602acb8dc5532e71` |
| `prices/api/cpi24_general_allstates.p13.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2025,2026&division_code=0&limit=100&page=13 | `5dcd73b92c19b9f9dc9a6065b292349cc5f94b462900fffddd80f0006b7a0806` |
| `prices/api/cpi24_general_allstates.p14.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2025,2026&division_code=0&limit=100&page=14 | `bd441b56e479f5b476c4279e9a872865609da3926065f70386a88fc5696ec776` |
| `prices/api/cpi24_general_allstates.p15.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2025,2026&division_code=0&limit=100&page=15 | `27664394fe6be76f5f81dab8f87cd32a58eb6c18a9f6258cbc53d38da7e0756a` |
| `prices/api/cpi24_general_allstates.p16.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2025,2026&division_code=0&limit=100&page=16 | `7bba83b3227b6511ad3532d7104bc4be59197ae0b5fa7f417337feb02f37c38a` |
| `prices/api/cpi24_general_allstates.p17.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2025,2026&division_code=0&limit=100&page=17 | `81c612b4cdcc4fba2e04fae0de34a4ab73c9b1e3644f320f106e7eed1d121a56` |
| `prices/api/cpi24_general_allstates.p18.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2025,2026&division_code=0&limit=100&page=18 | `ccc67c4680054434141999e128664e4be3b88a957a5334763753724a5f811210` |
| `prices/api/cpi24_general_allstates.p19.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2025,2026&division_code=0&limit=100&page=19 | `203da1680d185c8378339d0d80e182c21579b28a90d75b70d2d0efe050472d14` |
| `prices/api/cpi24_general_allstates.p2.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2025,2026&division_code=0&limit=100&page=2 | `33246cb5cfffff42afb5fe696e448f382f9560c88c2572580faa0162a35a49db` |
| `prices/api/cpi24_general_allstates.p20.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2025,2026&division_code=0&limit=100&page=20 | `810e4915e7cf785c33bd2e01e0c33c2f4c61ce6eead6f2fe5536c8790d42d2c1` |
| `prices/api/cpi24_general_allstates.p21.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2025,2026&division_code=0&limit=100&page=21 | `e3f9341dd4811e204bd8e3d2854ce391ce571196c6d4da0561e129e85c7cc33a` |
| `prices/api/cpi24_general_allstates.p22.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2025,2026&division_code=0&limit=100&page=22 | `6ddc63223c8e1ef452346af564e0456a7010e4ece5b8c1ebac8a64d8d4765413` |
| `prices/api/cpi24_general_allstates.p23.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2025,2026&division_code=0&limit=100&page=23 | `b8e19082a2d3de9be6e2e32aa2bbe75714a1ca5f009ae2de48fe21d043d3bef8` |
| `prices/api/cpi24_general_allstates.p24.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2025,2026&division_code=0&limit=100&page=24 | `a4f3d933af999ade6cf1582dc61061654920cefe25a566ba00188f5790b57112` |
| `prices/api/cpi24_general_allstates.p25.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2025,2026&division_code=0&limit=100&page=25 | `1dc1199fa491db962354bb1653b5e21ea61c895505350cc6e0f9a5492905f186` |
| `prices/api/cpi24_general_allstates.p3.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2025,2026&division_code=0&limit=100&page=3 | `cdad768f66a391a126dd570cd9d887b72d574ece212c349708efa7b453880121` |
| `prices/api/cpi24_general_allstates.p4.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2025,2026&division_code=0&limit=100&page=4 | `0295248baacfe17d96dc20ee7d32f976b1a9179d36d792227d0d6e554087ea34` |
| `prices/api/cpi24_general_allstates.p5.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2025,2026&division_code=0&limit=100&page=5 | `53f1c179c1486e08e945c4112a6d6a7665245f804e6db01267985f4073398466` |
| `prices/api/cpi24_general_allstates.p6.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2025,2026&division_code=0&limit=100&page=6 | `eb47f4d06fd576ced841ca8d2472c3360ff2b29b2a5ae326412114e1650cc0e6` |
| `prices/api/cpi24_general_allstates.p7.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2025,2026&division_code=0&limit=100&page=7 | `5ccbde0e9e867b9ef4f7c50772c5ba8f8512fd9f0afa8968b3977f93e7bb19ca` |
| `prices/api/cpi24_general_allstates.p8.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2025,2026&division_code=0&limit=100&page=8 | `c417ca4a2782ae2b5cf3e436c44ad8587151a72858a43f7885bf8cd7e2515a18` |
| `prices/api/cpi24_general_allstates.p9.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2025,2026&division_code=0&limit=100&page=9 | `fc19871dd526609780e2675813f4f982f07365b778243c8e62f9655052ecd6bc` |
| `prices/api/cpi24_groups_2026_m10_s1.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=10&state_code=1&sector_code=1&limit=100&page=1 | `777b5147cc08f81e1e73363972f9545e58a98fcd97b5d6a31a711aa43b0ab999` |
| `prices/api/cpi24_groups_2026_m10_s2.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=10&state_code=1&sector_code=2&limit=100&page=1 | `a41a71596371971fed5abcbbb806159ecc2035a28912a3e0285a2ff04a5143ab` |
| `prices/api/cpi24_groups_2026_m10_s3.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=10&state_code=1&sector_code=3&limit=100&page=1 | `50d5e31c38e4e07268eb22789ad7972dc0566fe1fdc30ca81d2cb14b9cd711c5` |
| `prices/api/cpi24_groups_2026_m1_s1.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=1&state_code=1&sector_code=1&limit=100&page=1 | `d79981896d9f8c9d2da07617db55b2cddb855b30b624f2d8511c5b61a36778a0` |
| `prices/api/cpi24_groups_2026_m1_s2.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=1&state_code=1&sector_code=2&limit=100&page=1 | `53ff516640caa708f1c17129bf688666ca867375f56975d6a3612206200e4add` |
| `prices/api/cpi24_groups_2026_m1_s3.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=1&state_code=1&sector_code=3&limit=100&page=1 | `357160ad2cbfab5c6697f65ca0b435d79e118b13b48c23db4be627b74181df74` |
| `prices/api/cpi24_groups_2026_m2_s1.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=2&state_code=1&sector_code=1&limit=100&page=1 | `cec4433e899a86d6b96a5e647f5522ae19ae62662eb084bbb29e834ff3083fcb` |
| `prices/api/cpi24_groups_2026_m2_s2.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=2&state_code=1&sector_code=2&limit=100&page=1 | `493838332668130708da6f3bab26c7ebb109a99ae81ed83840e820f749022842` |
| `prices/api/cpi24_groups_2026_m2_s3.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=2&state_code=1&sector_code=3&limit=100&page=1 | `c4370f14854d66faa56e708d0fc1c3e2ee3264e7100248338e33cb8ebebdef7b` |
| `prices/api/cpi24_groups_2026_m3_s1.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=3&state_code=1&sector_code=1&limit=100&page=1 | `379775eca3af659936d0cf9eaa3d28ebe0d20d323ce33dea9e463aa244cdb7f6` |
| `prices/api/cpi24_groups_2026_m3_s2.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=3&state_code=1&sector_code=2&limit=100&page=1 | `0481a57fb1447e89ac79f4c3eb8fe1ed3cdbb162a4e0cb9226a91f9b7180bbd6` |
| `prices/api/cpi24_groups_2026_m3_s3.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=3&state_code=1&sector_code=3&limit=100&page=1 | `968d8987ec610e239dddd1207ffe9ddc5d526dd715ad094a1c618c1ca9dc5ca8` |
| `prices/api/cpi24_groups_2026_m4_s1.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=4&state_code=1&sector_code=1&limit=100&page=1 | `31273c9e1c418b109daea2793abcc108f9b99954b89fcabcc5f7020c9d54307d` |
| `prices/api/cpi24_groups_2026_m4_s2.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=4&state_code=1&sector_code=2&limit=100&page=1 | `b76951433950f1665d6999eb0f55823b1c1d07939b977f2f213b303ccf894dcf` |
| `prices/api/cpi24_groups_2026_m4_s3.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=4&state_code=1&sector_code=3&limit=100&page=1 | `96ecaeff48ebf9635bef422907a23a1a8e596f4c5726bd4a9a509c9690a7d911` |
| `prices/api/cpi24_groups_2026_m5_s1.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=5&state_code=1&sector_code=1&limit=100&page=1 | `a7f520ac3dc3e0592aacf749524a84ab3e3adcba9a47f157c05dcee019c9af14` |
| `prices/api/cpi24_groups_2026_m5_s2.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=5&state_code=1&sector_code=2&limit=100&page=1 | `0ce2f07dac374dc2f2aea810e6d940fe4e4ad0412ddf78a36bcd6473f2e69998` |
| `prices/api/cpi24_groups_2026_m5_s3.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=5&state_code=1&sector_code=3&limit=100&page=1 | `037d20244e4b9d7606c9736e4719b86e770264531da7b9492542b83da20af7f4` |
| `prices/api/cpi24_groups_2026_m6_s1.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=6&state_code=1&sector_code=1&limit=100&page=1 | `fb1438b9c7462028df8d2f8e5179fb4959d295163dfe1b2a47f6e72d41127e79` |
| `prices/api/cpi24_groups_2026_m6_s2.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=6&state_code=1&sector_code=2&limit=100&page=1 | `15f5ce04d8912eb0f51aeeda6758075668c78e58eb4b692b5149b95f79541f82` |
| `prices/api/cpi24_groups_2026_m6_s3.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=6&state_code=1&sector_code=3&limit=100&page=1 | `ff64d1ad0a05595f6f0106b0e90f0146c89f25a6d831cb03ee0068871d7e1ef7` |
| `prices/api/cpi24_groups_2026_m7_s1.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=7&state_code=1&sector_code=1&limit=100&page=1 | `c0c226f915d73f2e6fc3d69427081ba2fb389f4cb278348c162b7f6b989d80bc` |
| `prices/api/cpi24_groups_2026_m7_s2.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=7&state_code=1&sector_code=2&limit=100&page=1 | `38ab350e5b78f1d20b39d851240cbaa73689a1dbc0482f12b88ea31e5c887311` |
| `prices/api/cpi24_groups_2026_m7_s3.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=7&state_code=1&sector_code=3&limit=100&page=1 | `469f10af54ede67119e5fdf021f2ae7de75317acbd26e2b1688f9224a7bc4bb5` |
| `prices/api/cpi24_groups_2026_m8_s1.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=8&state_code=1&sector_code=1&limit=100&page=1 | `8b555304ca09bc994ba16b23555d7485f323c1968797e4298ee88349d6555178` |
| `prices/api/cpi24_groups_2026_m8_s2.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=8&state_code=1&sector_code=2&limit=100&page=1 | `2f166212c6ba6f9f79d0ffabfc806315f7e360940b5ecf99e890b71403f65f01` |
| `prices/api/cpi24_groups_2026_m8_s3.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=8&state_code=1&sector_code=3&limit=100&page=1 | `347d057359ec2d533537672a6e49a86f46d7c7b9b111bcc1693b184c983329cf` |
| `prices/api/cpi24_groups_2026_m9_s1.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=9&state_code=1&sector_code=1&limit=100&page=1 | `9b6169948ff1ea94f656eb5a1df1e14bafa42758b72674c2f6253725d6c00f76` |
| `prices/api/cpi24_groups_2026_m9_s2.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=9&state_code=1&sector_code=2&limit=100&page=1 | `eee20f1901130d5dcc3deb5d9b5953606b5f12b737d6f2a428f770631088985f` |
| `prices/api/cpi24_groups_2026_m9_s3.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2026&month_code=9&state_code=1&sector_code=3&limit=100&page=1 | `0db6c379ae34c0df99c681376264d68f4550bdbeafa3cba9c4189c89f227a454` |
| `prices/api/cpi24back_general.all.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Back&state_code=1&division_code=0 (merged pages) | `26eec131bcb65b823ef691155ced26350afd133b149466a8561800e68a09590b` |
| `prices/api/cpi24back_general.p1.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Back&state_code=1&division_code=0&limit=100&page=1 | `a619c0ee10a47f79b595b5990dee4bcfb1471666a69fd707b66f85d7011a230e` |
| `prices/api/cpi24back_general.p2.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Back&state_code=1&division_code=0&limit=100&page=2 | `78acf5a938f1d68e987b9facb20510e456d55ef4ba27c02a053284550d1ef216` |
| `prices/api/cpi24back_general.p3.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Back&state_code=1&division_code=0&limit=100&page=3 | `4313f3c321761dbd2323639dacfdb9e13a516d5b462a946f0781b3d8dff9a0fc` |
| `prices/api/cpi24back_general.p4.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Back&state_code=1&division_code=0&limit=100&page=4 | `f96a19582ee86439a244f2eabd1e3a9af4cdc7cf9dc45670419ee61a71b3e1d5` |
| `prices/api/cpi24back_general.p5.json` | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Back&state_code=1&division_code=0&limit=100&page=5 | `121d94565313d7e8bf91cf1913f9a9b35f6c7d39dfa17506309a1d0b2eb6d753` |
| `prices/esankhyiki_llms.txt` | https://esankhyiki.mospi.gov.in/llms.txt | `1280f190ea405cf576a77121f8a45199c7759841439d1efbdbde8be871884ce4` |
| `prices/mcp_cpi_indicators.json` | https://mcp.mospi.gov.in/mcp (MCP tools/call) | `17c4197cd76029ade39766c4ac87401c049d7421ccc373dc8b5a159296848d4b` |
| `prices/mcp_cpi_meta2012.json` | https://mcp.mospi.gov.in/mcp (MCP tools/call) | `47dfbf9bebdd85a705cc5709e5ce585f35c46c30dcff926c6776373fbae736b1` |
| `prices/mcp_cpi_meta2024.json` | https://mcp.mospi.gov.in/mcp (MCP tools/call) | `aa1e84faba93a9590e8d07802d8dfebb248014c5eb6568465219fc1d78a9f69b` |
| `prices/mcp_cpi_meta2024back.json` | https://mcp.mospi.gov.in/mcp (MCP tools/call) | `942fbe8cf3b69e527a27073229ebb9b943ac126a807256e04bf7feac391c9fbb` |
| `prices/mcp_tools.json` | https://mcp.mospi.gov.in/mcp (MCP tools/call) | `bfedf22be2884d1e8456e865dffcc55b94172af5912501076b94f11c37309e97` |
| `prices/mospi_documents_get-latest-release-calender.json` | https://www.mospi.gov.in/api/documents/get-latest-release-calender | `df90dce23a48de8904597f4666dd84da02fbf213bd759dc56a6bfab4def8a435` |
| `prices/mospi_home.html` | https://www.mospi.gov.in/ | `73cb24e40467e48a1db02df1800f5a08898bd8ab3b7e62857bebba6e74f530c6` |
| `prices/mospi_main-site_get-home-main-site-data.json` | https://www.mospi.gov.in/api/main-site/get-home-main-site-data | `73d2e6795d8aa32aace2b456467815059fec95b6052c1ae049151fb67e5e94f2` |
| `prices/pdf/cpi_oct2026_pr.pdf` | https://www.mospi.gov.in/uploads/latestReleases/latest_release_1794478693814_7c90e80f-9e64-4aa4-b44a-1dc727b0fed9_Press_Release_of_CPI_for_October_2026_.pdf | `ef81780a6b0198bd10cefec46f68362fdf9f82b7912fdb476309986976a8240d` |
| `prices/pdf/cpi_oct2026_pr.txt` | text extracted with pdftotext -layout from the PDF in the same folder | `5bb17217d58d8376ded214bd846a0cf7a2f3f9dae5aca9c4761354449e7f62ae` |
| `prices/rbi/163T_HBIE3107202614BC4318E5204F5596C41CBF5C5C7863.XLSX` | https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/163T_HBIE3107202614BC4318E5204F5596C41CBF5C5C7863.XLSX | `953beafd3e505f708a2b7c0a63e5345cf13974f58687764e9de6096929a2a096` |
| `prices/rbi/236T_HBIE310720260380CC1834364289AF00337B7FFD8336.XLSX` | https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/236T_HBIE310720260380CC1834364289AF00337B7FFD8336.XLSX | `4c6921988f31a34a39d732cf1d0ffd8b2996b38461f44ab02f76d8c12398499f` |
| `prices/rbi/243T_HBIE31072026A3C0546A907841AC9F3E62D6E639C052.XLSX` | https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/243T_HBIE31072026A3C0546A907841AC9F3E62D6E639C052.XLSX | `3a85013f7cb0d056aba8094eda6a0c9d8248f4218471f763efd8eafab5c217e0` |
| `prices/rbi/40T_HBIE31072026FF3E894445944DA8A3C011F1653F999A.XLSX` | https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/40T_HBIE31072026FF3E894445944DA8A3C011F1653F999A.XLSX | `7ac18abb846add2e7aace7cb7ec262318616b60f1f0b1e1631511dd1522d160e` |
| `prices/rbi/annualpolicy.html` | https://www.rbi.org.in/scripts/annualpolicy.aspx | `0d00f9a881a9c029bc9f9a994adfb379dbe735831f0b352cac5cd8f41e746f7e` |
| `prices/rbi/fs_overview_2752.html` | https://www.rbi.org.in/scripts/fs_overview.aspx?fn=2752 | `4adb8785f553bb718e4ec4f6960d4bac64c7e9e9d0d50c34f91c881f043176ca` |
| `prices/rbi/hbie_tables.txt` | list of Excel links parsed from the Handbook page | `32f2306ebc871f2e0626094dfd9cf0a262c1da9b92f2b3fdb18e0c8ccf51ddf5` |
| `prices/rbi/hbs_economy.html` | https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=Handbook%20of%20Statistics%20on%20Indian%20Economy | `391e8077c40ed8d06e7f5b4655f73a401995aee3a643c3b5f23827ac3ee548ec` |
| `prices/rbi/pr62515.html` | https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=62515 | `67c8415f96efaf89b7ce853a14fb7d3f0954e9a596b88f719e3044d2c8818d8e` |
| `prices/rbi/pr62864.html` | https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=62864 | `58369fd4dceed876b8dbe0de9e3ed609a324f393ca2de30faf8e3fee684bf962` |
| `prices/rbi/pr63288.html` | https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63288 | `24549831c2a92d03f288f4cbfbe02e9ad4da85a320453890fa2416ab707049b6` |
| `prices/rbi/pr63744.html` | https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63744 | `e218332d2189c079c08e8eabfdd3565c50f2f7b15067aa3719b8143108cfc137` |

## CFPI raw files

Saved on 18 Nov 2026 under `raw/prices/cfpi/` with `pipeline/common/fetch_batch.py` and `pipeline/prices/cfpi_sources.tsv`. Raw downloads are not kept in the repository; the URL and sha256 below identify each file. Text extracted with `pdftotext -layout` (`pipeline/prices/extract_text.sh`).

| Release | Released | URL | sha256 |
| --- | --- | --- | --- |
| January 2026 | 12 Feb 2026 | https://www.mospi.gov.in/uploads/latestReleases/latest_release_1770891893893_6b458c0a-c327-4fef-a554-41131ea67273_Press_Relase_of_CPI_for_Jan26.pdf | `cd4d8fd861a43f4467237813bc6e9a943bf56b471d1baefae9ba1d3d240a00bb` |
| February 2026 | 12 Mar 2026 | https://www.mospi.gov.in/uploads/latestReleases/latest_release_1773310539387_714ce3b5-4644-4aef-b2e3-64433640a9c3_Press_Release_of_CPI_February_2026.pdf | `76631a0fbb35b7ee7dac6e1d77a8e81705f8db0278ea72c9399eb76246953bc1` |
| March 2026 | 13 Apr 2026 | https://www.mospi.gov.in/uploads/latestReleases/latest_release_1776075408775_60ad93d0-aedc-405b-864a-d1e965e7ba40_Press_Release_of_CPI_March_2026.pdf | `3ce90fcdd386beb354d6fdf9c2bb8115ac7c18e6195e61e33f4508083e681908` |
| April 2026 | 12 May 2026 | https://www.mospi.gov.in/uploads/PressRelease/CPI%20Press%20Release%20of%20April%202026.pdf | `80c82154b48f349bb4618d16f44774720bc817926b4566e6276e97ada3a8a7b8` |
| May 2026 (PIB page) | 12 Jun 2026 | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2272112&reg=48&lang=1 | `1a6e67880d6568c9663b6fc8011934d7ca032548986c351cfd4ef15014484b82` |
| June 2026 | 13 Jul 2026 | https://www.mospi.gov.in/uploads/latestReleases/latest_release_1783937698596_1013f1a1-3400-41aa-b4f4-5bbff10db7b7_Press_Release_of_CPI_for_June_2026.pdf | `20a61f0d4c339c2cfa005c9889ab73f5c36ebc664ccd9a628314a066aecf5c89` |
| July 2026 | 12 Aug 2026 | https://www.mospi.gov.in/uploads/latestReleases/latest_release_1786529680747_3113661d-1a2b-4b9a-af06-b340193ef9a0_Press_Release_CPI_July_2026.pdf | `f0c031b3177cec8ef13b54f62d71e42835d4eb713eb6e69996260dc5b016cfe4` |
| August 2026 | 14 Sep 2026 | https://www.mospi.gov.in/uploads/latestReleases/latest_release_1789381904344_6c792dcf-8a9f-4fca-93d3-99d833bdb358_Press_Release_of_CPI_for_August_2026.pdf | `efed906339562651b94218b35079f4fc3a04f6aa43c0d6901bde8985478fda57` |
| September 2026 | 12 Oct 2026 | https://www.mospi.gov.in/uploads/latestReleases/latest_release_1791800601071_643518af-5320-4e52-b78c-75c92b83885b_Press_Release_for_the_month_of_September,_2026.pdf | `a6087e10a1bdb64ebdc9dc32f80605d2905d147602d41cce5879871b5ccefa37` |
| October 2026 | 12 Nov 2026 | https://www.mospi.gov.in/uploads/latestReleases/latest_release_1794478693814_7c90e80f-9e64-4aa4-b44a-1dc727b0fed9_Press_Release_of_CPI_for_October_2026_.pdf | `ef81780a6b0198bd10cefec46f68362fdf9f82b7912fdb476309986976a8240d` |

## Publisher check on 18 Nov 2026

MoSPI still lists the 12 Nov October CPI release. The eSankhyiki current and back general CPI records on base 2024 and the three sector division extracts for January to October match the previous data. The November 2026 query returned no data. The CFPI press release PDFs match their previous checksums. The RBI policy repo rate remains 5.50%, and the policy page still gives 2 to 4 Dec for the next meeting. The July Handbook is still listed. Its workbook links served HTML to this check.

| Release or file checked | Release date | URL | Fetched | SHA-256 |
| --- | --- | --- | --- | --- |
| MoSPI press release list, POST response | Live list | https://www.mospi.gov.in/api/latest-release/get-web-latest-release-list | 18 Nov 2026 | `7f3da46fedf29f0cb39396c7b2cc2896dab455ec01b10b6edccfc19649a80358` |
| eSankhyiki CPI base 2024, page 1 | 12 Nov 2026 | https://api.mospi.gov.in/api/cpi/getCPIData?base_year=2024&series=Current&year=2025,2026&division_code=0&limit=100&page=1 | 18 Nov 2026 | `65336e4d30d3d6526c023d17ae564e2c6f923fe4ebb8fac62be79e1f940f0a53` |
| eSankhyiki CPI base 2012, final month sample | December 2025 data | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Current&state_code=99&year=2025&month_code=12&limit=100&page=1 | 18 Nov 2026 | `c3830c74c1b4cf247feb367dc91eb87ae1381128ac1adc5b45093bcea0069f1d` |
| RBI monetary policy list | Live list | https://www.rbi.org.in/scripts/annualpolicy.aspx | 18 Nov 2026 | `0d00f9a881a9c029bc9f9a994adfb379dbe735831f0b352cac5cd8f41e746f7e` |
| RBI Current Rates | 18 Nov 2026 snapshot | https://www.rbi.org.in/ | 18 Nov 2026 | `2bc7550260255980fbc76339318b614f6b3a70a9056261ec044373eefc4f4b23` |

## Repo rate history source files

All files in this table are from the RBI. Read on 18 Nov 2026. Paths start at `raw/`.

| File | Release | URL | SHA-256 |
| --- | --- | --- | --- |
| `prices/repo/table46-2011/body.html` | Handbook 2010-11, Table 46, 15 Sep 2011 | https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=13634 | `43b2f637de8146a47186627501e293cd7791c0d3c9417878187c5de2f43c06e6` |
| `prices/repo/table46-2010/body.html` | Handbook 2009-10, Table 46, 15 Sep 2010 | https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=12737 | `deb36ec2e8adb8349686d9c896911ab43e8938068b8fd96b1c5aab75ea56c739` |
| `prices/repo/table40/table.html` | Handbook 2025-26, Table 40, 31 Jul 2026 | https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=23865 | `d4bf2436c9427f6e57c67748d6ca48bd8647777a71ead58e7daa08f26a755786` |
| `prices/repo/policy-launch/body.html` | Monetary and Credit Policy for 2000-01, 27 Apr 2000, Annexure I | https://www.rbi.org.in/Scripts/BS_ViewMonetaryCreditPolicy.aspx?Id=2261 | `08009721c0ce34f0217399a8a07c9b7fa309c4f66d1f7febd7ed2b733ccca5e4` |
| `prices/repo/policy-2001-statement/body.html` | Monetary and Credit Policy for 2001-02, 19 Apr 2001, paragraphs 51 to 56 | https://www.rbi.org.in/Scripts/BS_ViewMonetaryCreditPolicy.aspx?Id=2260 | `e92892b4542bf43456562358bc673359f2631c90611e90b5613f13cb1e8ac4e8` |
| `prices/repo/policy-2004-statement/body.html` | Annual Policy Statement for 2004-05, 18 May 2004, paragraphs 73 and 74 | https://www.rbi.org.in/Scripts/BS_ViewMonetaryCreditPolicy.aspx?Id=1634 | `f677674bbd5c9a0102d47fe7e90910a7d9222d0b76ecdcac78ff63bcbd4a5ed7` |
| `prices/repo/apr-2025/body.html` | Governor's Statement, 9 Apr 2025 | https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=60177 | `417fc0cfb51a157b7c4a3d5da6b43fd63b1efc089b0e5fe6a1ef6ee6da2641aa` |
| `prices/repo/jun-2025/body.html` | Governor's Statement, 6 Jun 2025 | https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=60605 | `f64d0dcbfbb6e9e83ec808225fcb8fae371045a787bb7a9fa0b9047c2c8e110d` |
| `prices/repo/aug-2025/body.html` | Governor's Statement, 6 Aug 2025 | https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=60958 | `a388fa42e9f9181b29c53810ad4bc105bfa0183572475bb891d88a5f9b17ed66` |
| `prices/repo/oct-2025/body.html` | Governor's Statement, 1 Oct 2025 | https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=61333 | `094b754d520d24c2fdc52fc20044baa2926edc357d2e7599103714e2dc0f842d` |
| `prices/repo/dec-2025/body.html` | Governor's Statement, 5 Dec 2025 | https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=61750 | `447b35edb55b2c52c0b621daaa74ab3ba4b4f6bc090007b0ad0a5884cfc7856b` |
| `prices/repo/feb-2026/body.html` | Governor's Statement, 6 Feb 2026 | https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=62170 | `3a8fd5a047b515d454a060b2ccd77b9e17866a5fd483a15df5e15a72f43ac96c` |
| `prices/repo/apr-2026/statement.html` | Governor's Statement, 8 Apr 2026 | https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=62515 | `0dfb170a0ed96490d79e80983d9636ae6f950af50459c175ee29ae84b3a854db` |
| `prices/repo/jun-2026/statement.html` | Governor's Statement, 5 Jun 2026 | https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=62864 | `b1931ffbed3836e851f683c2d1b2c9bdb8b27ab58db5c436b8c4549fc9519eb0` |
| `prices/repo/aug-2026/statement.html` | Governor's Statement, 5 Aug 2026 | https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63288 | `fbde0fbfc45263b60d70af3e57da2493b9ba20d9eb8e18be8c3714762d71428b` |
| `prices/repo/oct-2026/statement.html` | Governor's Statement, 7 Oct 2026 | https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63744 | `9b6c2fba13ae387f9208a923a451d9dfa313e93970ae1edb3122087ad6d3bcfc` |
| `prices/repo/feb-2026-resolution/body.html` | MPC resolution, 6 Feb 2026 | https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=62169 | `248778789de1a2f474d7934036cb987675b25549950220ae767abf4bb72fcebd` |
| `prices/repo/apr-2026-resolution/body.html` | MPC resolution, 8 Apr 2026 | https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=62514 | `042ba8e1db251851f4fad82354be58d4492d95369e23a372217856a44fed5655` |
| `prices/repo/jun-2026-resolution/body.html` | MPC resolution, 5 Jun 2026 | https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=62863 | `d55f4b523851775c9a77460b61aacb2bc46f54541d09bcb60723ccd196cb8872` |
| `prices/repo/aug-2026-resolution/body.html` | MPC resolution, 5 Aug 2026 | https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63287 | `6996ee5916d09860eb6c2d7a50cc8f081e4bb682200f279b9102bee6c07c6627` |
| `prices/repo/oct-2026-resolution/body.html` | MPC resolution, 7 Oct 2026 | https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63742 | `1965c5ceb907531660ed33bb5b0d8f7e1b359e0edb63e1da8f448b4533c63bba` |
| `prices/repo/oct-2026-minutes/statement.html` | MPC minutes, 21 Oct 2026 | https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63839 | `dd1eda5735274bdff689af15885148866b82f88bae023adbf032f73878d964ca` |
| `prices/repo/policy-list/index.html` | Monetary policy archive, 2026-27 | https://www.rbi.org.in/scripts/annualpolicy.aspx | `49fc04d45d455b25dc2d332f3d7377d4799a651ec0e3742f217c8433e158c4c9` |
| `prices/repo/policy-2026/index.html` | Monetary policy archive, 2025-26 (select the year in the form) | https://www.rbi.org.in/scripts/annualpolicy.aspx | `b329de5256603080434c81ceb2e54bec203887d709f5dea08e429cfb120f8dfc` |
| `prices/repo/current-rates/index.html` | Current Rates, live | https://www.rbi.org.in/ | `2c56c5564aafb76febfd2ae66e022992c5a6cd3cbac9fb4ba3c5df950b0717d9` |
| `prices/repo/table40-xlsx/body` | Table 40 workbook request (HTML challenge response) | https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/40T_HBIE31072026FF3E894445944DA8A3C011F1653F999A.XLSX | `42db3c655d35e920d091ec7bdff1af6c77657ab20a3f15a6c11b7c5f972dd4ae` |

## CPI history source files

Source: MoSPI eSankhyiki, base 2012=100. The final current series ends in December 2025. Read on 18 Nov 2026. Paths start at `raw/`.

| File | Request URL | SHA-256 |
| --- | --- | --- |
| `prices/cpi-history/back-2011-01/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2011&month_code=1&limit=100&page=1 | `aafa72479e2eb53eafb73026a2826afb4bfc92ac2db488c84e3e2d804f5ae9b8` |
| `prices/cpi-history/back-2011-02/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2011&month_code=2&limit=100&page=1 | `312e01e73c17f8c5883b97a7e9c11daa22ff5c57a7c064ab648dc68512cb192a` |
| `prices/cpi-history/back-2011-03/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2011&month_code=3&limit=100&page=1 | `3191459020732e557d1022213bce1db34b77cd002606c0eaed0b3d2c095af420` |
| `prices/cpi-history/back-2011-04/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2011&month_code=4&limit=100&page=1 | `e30d470f769f3f48591f413f1bf91c5cf65f76d69606e6581a36be7f06a44a75` |
| `prices/cpi-history/back-2011-05/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2011&month_code=5&limit=100&page=1 | `0547fbbea1ba9388fa814f587c74c41f27144fd69f9e4696d8252152128ccb5d` |
| `prices/cpi-history/back-2011-06/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2011&month_code=6&limit=100&page=1 | `5fe1700b3059930eab0331829b5fb811e764223e5dc099b34a0ee5f064fa1410` |
| `prices/cpi-history/back-2011-07/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2011&month_code=7&limit=100&page=1 | `67888f69461162a3a8de673fca4e0fdb4a4ba7ba6b48f1c4a4d9e0b951559001` |
| `prices/cpi-history/back-2011-08/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2011&month_code=8&limit=100&page=1 | `bbc2882b8101aee96d038f813d7f8c1d01e1a5e731b7a17420345d2580f9b56d` |
| `prices/cpi-history/back-2011-09/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2011&month_code=9&limit=100&page=1 | `317ca50653f1c46a3fbc2c81df6ff8ae631ab645003d777b739fe473dc59c06e` |
| `prices/cpi-history/back-2011-10/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2011&month_code=10&limit=100&page=1 | `83688b044e72241dfd2e46cc209a3cffb2c929d1235e3af4809be44fe3579e02` |
| `prices/cpi-history/back-2011-11/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2011&month_code=11&limit=100&page=1 | `1668954c20f4bdc3a304920e9dc46e5a10831d8ab00dd0eee5026414a8674acf` |
| `prices/cpi-history/back-2011-12/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2011&month_code=12&limit=100&page=1 | `d6cbaa8d4188d071882988aca6f7f27d5d564822385c87caada311a4e2deae3f` |
| `prices/cpi-history/back-2012-01/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2012&month_code=1&limit=100&page=1 | `1080f3007636790d471453da89627bf0a40b00a0b5ab558275330e65f01c69c5` |
| `prices/cpi-history/back-2012-02/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2012&month_code=2&limit=100&page=1 | `6cfbbd8c722d8024bef33c7c40e064187dfdc69d5f2576ef0c5d6a0c681ab0dd` |
| `prices/cpi-history/back-2012-03/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2012&month_code=3&limit=100&page=1 | `0c6ca36d8cb03b51e46cc9f1b658d83b0d998b3d1fba1669bf0452679f29adc6` |
| `prices/cpi-history/back-2012-04/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2012&month_code=4&limit=100&page=1 | `bc16646e6c04ba317b2ed3e24d84210d26b4428875b7f7169b6e94aeefec1bd3` |
| `prices/cpi-history/back-2012-05/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2012&month_code=5&limit=100&page=1 | `6ad7e9130d9884b81d434ad5ef3bfa2cb228316938f76ec2ee028c93cc2853b5` |
| `prices/cpi-history/back-2012-06/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2012&month_code=6&limit=100&page=1 | `6ac2d6989359375dffce670ddf4bfe243f62f3ac5e74024c0008aac11ef84457` |
| `prices/cpi-history/back-2012-07/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2012&month_code=7&limit=100&page=1 | `cd34c300279cef95ada3f9ca00f5817f88275e90542192ef593c19ccfdf89909` |
| `prices/cpi-history/back-2012-08/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2012&month_code=8&limit=100&page=1 | `d258e9821e42d8952fe061aac6bd4cf7eceba535b1fa98b6e1ba273f7d468959` |
| `prices/cpi-history/back-2012-09/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2012&month_code=9&limit=100&page=1 | `cbd614a2d6acc423686966f9f311bf77f5e85dbb9e3c49c086e1a858e3dd8c27` |
| `prices/cpi-history/back-2012-10/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2012&month_code=10&limit=100&page=1 | `457d69494b711a2d5be5a8046a769ef7c280218be384c99c0775496a3060e0af` |
| `prices/cpi-history/back-2012-11/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2012&month_code=11&limit=100&page=1 | `a9123ddd4e1fa6f3866d0c6dba99bac9d8bebc9a68a692d4ce300e9157caece1` |
| `prices/cpi-history/back-2012-12/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2012&month_code=12&limit=100&page=1 | `039e9b5efca06f98c934765f72593747d90c4e627ffcc9ad71b1d7ded7bc6510` |
| `prices/cpi-history/back-2013-01/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2013&month_code=1&limit=100&page=1 | `3f311722f4d14b1e95a9a1dbf0eb5565af727c04fcf36f8993ac5f9d7c2528af` |
| `prices/cpi-history/back-2013-02/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2013&month_code=2&limit=100&page=1 | `0f83a99e3a44bc098961da21c5520d265b9e64c36e04d69dcf4b24de68b67c90` |
| `prices/cpi-history/back-2013-03/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2013&month_code=3&limit=100&page=1 | `159e641448e4b9c4c4723030ed817792645723bd5c6e246ffab78977313cb459` |
| `prices/cpi-history/back-2013-04/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2013&month_code=4&limit=100&page=1 | `ea2e28a6106d1d7e6a16bf7437d46a3b7208ebe563bc47a81d15563f41d7f39f` |
| `prices/cpi-history/back-2013-05/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2013&month_code=5&limit=100&page=1 | `7a28ddfbc16f9259fea01df17a87179438af9b751476d666ebdadc683d75e0bc` |
| `prices/cpi-history/back-2013-06/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2013&month_code=6&limit=100&page=1 | `ab8bc9dd51190bee5da5478bd2e8b37074c787b085ca82efe1c6371148ca8c53` |
| `prices/cpi-history/back-2013-07/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2013&month_code=7&limit=100&page=1 | `ab8bc9dd51190bee5da5478bd2e8b37074c787b085ca82efe1c6371148ca8c53` |
| `prices/cpi-history/back-2013-08/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2013&month_code=8&limit=100&page=1 | `ab8bc9dd51190bee5da5478bd2e8b37074c787b085ca82efe1c6371148ca8c53` |
| `prices/cpi-history/back-2013-09/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2013&month_code=9&limit=100&page=1 | `ab8bc9dd51190bee5da5478bd2e8b37074c787b085ca82efe1c6371148ca8c53` |
| `prices/cpi-history/back-2013-10/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2013&month_code=10&limit=100&page=1 | `ab8bc9dd51190bee5da5478bd2e8b37074c787b085ca82efe1c6371148ca8c53` |
| `prices/cpi-history/back-2013-11/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2013&month_code=11&limit=100&page=1 | `ab8bc9dd51190bee5da5478bd2e8b37074c787b085ca82efe1c6371148ca8c53` |
| `prices/cpi-history/back-2013-12/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2013&month_code=12&limit=100&page=1 | `ab8bc9dd51190bee5da5478bd2e8b37074c787b085ca82efe1c6371148ca8c53` |
| `prices/cpi-history/back-2014-01/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Back&state_code=99&year=2014&month_code=1&limit=100&page=1 | `ab8bc9dd51190bee5da5478bd2e8b37074c787b085ca82efe1c6371148ca8c53` |
| `prices/cpi-history/current-2013-01/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Current&state_code=99&year=2013&month_code=1&limit=100&page=1 | `a3d8a18117f29810b655a651965f62d944e35af183b1805beac04f2539ba9058` |
| `prices/cpi-history/current-2013-02/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Current&state_code=99&year=2013&month_code=2&limit=100&page=1 | `da261cdd6bc54976db09233c69d4df601e112bf684d478afb8af409a97ac2b86` |
| `prices/cpi-history/current-2013-03/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Current&state_code=99&year=2013&month_code=3&limit=100&page=1 | `4b5f844e20111cc955dd7f4632a107046ae612563dc96616dada2c293542af6f` |
| `prices/cpi-history/current-2013-04/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Current&state_code=99&year=2013&month_code=4&limit=100&page=1 | `376c3bc0f6c5ec2afe65715419dc1dfa4edb8162e5a87c85edb75de606f72a8d` |
| `prices/cpi-history/current-2013-05/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Current&state_code=99&year=2013&month_code=5&limit=100&page=1 | `352cc8b9d2e8caa236d9e84b926ef945da611937711bd987f5ea24fed0c030e4` |
| `prices/cpi-history/current-2013-06/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Current&state_code=99&year=2013&month_code=6&limit=100&page=1 | `4f9c248a3166e66481593c85e8b834f7c5ae287607806ee880522e4686ffd937` |
| `prices/cpi-history/current-2013-07/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Current&state_code=99&year=2013&month_code=7&limit=100&page=1 | `bb81b7debbb5afe3b6a5aeb6c1069c9096977b445aa701e29a53600642218184` |
| `prices/cpi-history/current-2013-08/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Current&state_code=99&year=2013&month_code=8&limit=100&page=1 | `4859c70dce44b2866e9fed486d9f80618e6f52b7820859ab84c731a05359ccda` |
| `prices/cpi-history/current-2013-09/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Current&state_code=99&year=2013&month_code=9&limit=100&page=1 | `df4ea93116435da2afe8d1292c1f2b06d1403c07d2d0aed0ee1e1aec4a554549` |
| `prices/cpi-history/current-2013-10/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Current&state_code=99&year=2013&month_code=10&limit=100&page=1 | `c331b7b2bb53da09aa19fb8fc2f3789412d7b58c25b951c3261387bae9dd544a` |
| `prices/cpi-history/current-2013-11/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Current&state_code=99&year=2013&month_code=11&limit=100&page=1 | `9507a06287d706b9125c306c0d8e238915f5455cf5dd28f741f795df2eb032a3` |
| `prices/cpi-history/current-2013-12/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Current&state_code=99&year=2013&month_code=12&limit=100&page=1 | `2b2dc4c8f20f9a98ae3fa9ae93fc4087fe5e8dc1263b56bdafaa9681fb6811be` |
| `prices/cpi-history/current-2014-01/body.json` | https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=Current&state_code=99&year=2014&month_code=1&limit=100&page=1 | `ba136cb2eecc4f197c827e84082341fee6fc4fde10f143d09c192352d658850f` |
