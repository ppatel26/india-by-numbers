# Transport

Data gathered on 25 Nov 2026 from the Transport Research Wing of the Ministry of Road Transport and Highways (MoRTH) and from the National Statistics Office (NSO, MoSPI). The CSVs keep the publishers' digits. Every rate per lakh population and every severity figure is the publisher's own. The one exception is the share of households with an overnight trip by state, from NSS Report 597: it divides published counts and is marked `derived` (see "Decisions").

The Transport topic (`src/content/topics/transport.ts`) uses these files, since 25 Nov 2026. "Proposed charts" at the end lists the charts it was built from.

## Questions this topic answers

1. How many road accidents, deaths and injuries do the police record in each State/UT, and how many deaths per lakh people?
2. How have road accidents and deaths in India changed since 1970?
3. Who dies on the roads: pedestrians, people on two-wheelers, people in cars, trucks or buses?
4. How many people who died or were hurt did not wear a helmet or a seat belt?
5. How do students and workers travel to school or work (walk, bicycle, two-wheeler, bus), in rural and urban areas and in each State/UT?
6. What share of students and workers travel 1 km or more, and how do households travel on overnight trips?
7. What share of households make an overnight trip for leisure, family, pilgrimage, health or business, in each State/UT, and what does a trip cost?

## Sources

All read on 25 Nov 2026. MoRTH and MoSPI state no reuse licence on these pages. The sha256 of each raw file is in "Raw files" below.

| Publisher | Release | Release date | Period | Link |
| --- | --- | --- | --- | --- |
| MoRTH, Transport Research Wing | Road Accidents in India 2024 (RAI 2024) | Not stated. The report gives no date. The MoRTH list (`backend/api/documents/Road Accidents in India`) gives `published_date` 2024-01-01 for this edition, which is before the end of the data year, so it is a placeholder and not a release date. The PDF was last changed on 15 Jun 2026 (PDF metadata). The MoRTH metadata file for the series gives "Last Posted Date 13-05-2026". No PIB release was found. Charts use "not stated" | Calendar year 2024 (2021 to 2024 in the state annexures; 1970 to 2024 in Annexure 1) | [Reports page](https://morth.gov.in/#/documents/reports), group "Road Accidents in India" |
| MoRTH, Transport Research Wing | Road Accidents in India 2023 (RAI 2023), for a check of the 2023 values only | Not stated. The list gives 2023-01-01. PDF created 26 Aug 2025 | Calendar year 2023 | Same page |
| MoRTH, Transport Research Wing | Metadata for "Road Accidents in India" (3 pages) | "Last Posted Date 13-05-2026" | Series | Same page |
| NSO, MoSPI | Fact Sheet, Household Travel in India 2025-26, from the first National Household Travel Survey (NHTS), with Appendix A (17 State/UT tables, XLSX) and Appendix B (6 RSE tables, XLSX) | 5 Oct 2026: the press note is "Dated: 05th October, 2026", and the MoSPI release list gives `published_year` 2026-10-05 | July 2025 to June 2026 (`2025-26` in the CSVs) | [Fact sheet PDF](https://www.mospi.gov.in/uploads/publications_reports/publications_reports1791198151034_8d52ad0c-75ba-4040-a445-32c2ca98958e_Factsheet_-_NHTS.pdf); the XLSX links are inside it, on pages 19 and 20 |
| NSO, MoSPI | Press note, National Household Travel Survey July 2025 to June 2026 | 5 Oct 2026 | Same | [Press note PDF](https://www.mospi.gov.in/uploads/latestReleases/latest_release_1791197961812_aef550fd-c694-4955-9e26-296148e3714d_Press_Note_-_NHTS.pdf) |
| NSO, MoSPI | NSS Report 597, Domestic Tourism in India (Domestic Tourism Expenditure Survey, DTES), NSS round 80, with Appendix A (22 tables, XLSX) and Appendix C (RSE tables R1 to R4) | 23 Sep 2026: the press note is dated "23rd September, 2026", and the MoSPI release list gives `published_year` 2026-09-23. The report cover says "September, 2026" | July 2025 to June 2026 (`2025-26` in the CSVs). Overnight trips: last 365 days or last 30 days, by leading purpose. Same-day trips: last 30 days | [Report PDF](https://www.mospi.gov.in/uploads/publications_reports/publications_reports1790160086463_10b96a4e-35b0-416b-83b7-9cb3b364ca8c_DomesticTourism_report_597_(1).pdf); the XLSX links are inside it, on pages A1 to A3 (PDF pages 64 to 66) |
| NSO, MoSPI | Press note, Domestic Tourism Expenditure Survey NSS 80th round (July 2025 to June 2026) | 23 Sep 2026 | Same | [Press note PDF](https://www.mospi.gov.in/uploads/latestReleases/latest_release_1790159417509_e87601c9-a7f3-4290-9600-46c078186d81_Press_Note_DTES_220926.pdf) |

### How the files were found

- **MoRTH editions.** `morth.gov.in` is a JavaScript app that serves Hindi by default, and its page `#/documents/reports` lists document groups only. `pipeline/transport/morth_reports.mjs` opens the page in headless Chromium, clicks "View all" on the group "भारत में सड़क दुर्घटनाएँ" (Road Accidents in India) and saves each JSON response. The group comes from `https://morth.gov.in/backend/api/documents/Road%20Accidents%20in%20India`: 19 documents, the editions for 2008 to 2024, a 2018 corrigendum and the metadata file. The same URL fetched with curl gives the same sha256, so `fetch.sh` fetches it directly.
- **A 2024 edition exists** on the MoRTH site ("Road Accident in India - 2024", 36,711 KB). The backlog row said "not confirmed". It is now confirmed, and this topic uses it.
- **NHTS workbooks.** The fact sheet's Appendix A and B are lists of hyperlinks. The URLs were read from the PDF link annotations (pypdf). Tables A1 to A5 and B1 to B4 were fetched. Tables A6 to A17 (time of travel, time taken, cost, other purposes, overnight trips by State/UT) and B5, B6 were not used.
- **DTES workbooks.** The Appendix A list in Report 597 is a list of hyperlinks to `https://www.mospi.gov.in/uploads/documents/DTES_tables/`. The URLs were read from the PDF link annotations (pypdf). Tables 1, 15 and 19 were fetched. The other 19 tables (religion, social group, visitor purpose, mode, stay, nights, destination, month, reimbursement, tourism services, same-day trips by purpose and spending) were not used. The DTES is not on the eSankhyiki API.
- **Release date of the DTES.** The MoSPI release list API (POST `{"lang":"en","page_no":3}`) gives the press note with `published_year` 2026-09-23. The saved response is `raw/transport/tourism/pages/latest-release-p3.json`. The report is not on the release list; its cover says "September, 2026", and its PDF was last changed on 23 Sep 2026 (PDF metadata). Charts use 2026-09-23.
- **Release date of NHTS.** The MoSPI release list API (`https://www.mospi.gov.in/api/latest-release/get-web-latest-release-list`, POST `{"lang":"en","page_no":2}`) gives the press note with `published_year` 2026-10-05. The press note itself is dated 5 Oct 2026. The saved response is `raw/transport/nhts/pages/latest-release-p2.json`.

### Decisions

| Decision | Reason |
| --- | --- |
| Use RAI 2024 for all MoRTH figures, RAI 2023 only as a check | RAI 2024 is the latest edition on the MoRTH site. Rule: the latest release that prints the year. |
| State CSV keeps 2023 and 2024 only | The brief asks for the latest year and the year before. Annexures 2 to 4 also print 2021 and 2022; the script can add them. |
| Keep MoRTH's rates per lakh population; compute none | MoRTH prints them (Annexures 2 to 4, columns 12 to 15). |
| Read the MoRTH tables from word boxes, not from layout text | The layout text shifts values left where a cell is blank. Example: Ladakh in Annexure 3 has blank 2021 and 2022 shares and a blank 2021 rate; the layout text puts its 2022 to 2024 rates under 2021 to 2023. The word-box reader puts each value under its own column number. |
| `road-deaths-by-road-user.csv`: India from Table 4.4, States/UTs from Annexure 29 | Table 4.4 gives 2023 and 2024 and the shares. Annexure 29 gives 2024 by State/UT and sex. Annexure 29's India "Total" by sex is kept; its India totals are the same as Table 4.4 (checked), so they are not repeated. |
| Keep "6,308.0", "5,659.0", "6.80", "6.70" in Table 4.4 as printed (`6308.0`, `5659.0`, `6.80`, `6.70`) | Rule: the publisher's digits. Annexure 29 prints 5,659 for 2024 auto-rickshaws; the script checks that the two are equal. |
| NHTS: values written with the decimals of the cell's number format (`0.0`) | The workbooks store numbers such as `100` and `0`; MoSPI shows them as 100.0 and 0.0. |
| NHTS "-" cells are empty | The workbooks do not define "-". Chandigarh has no rural sample (Table A1: "-" rural FSUs), and its rural rows are all "-". |
| Keep the RSE beside each NHTS value | Many State/UT values have a high relative standard error. A chart can then leave out or flag weak values. |
| NHTS is used through its published tables (rule R3) | No figure needs our own weights. |
| No distance table | The fact sheet and Appendix A give no trip distance, although the press note lists "distances travelled" as a survey aspect. The fact sheet gives time taken (Fig. 4, 10; Tables A10, A11) instead. Not used. |
| SRS context is text only | The brief asks for no chart. See "Gaps and cautions". |
| DTES: share of households with an overnight trip by State/UT is `derived` | Table 1 prints counts only (households, and households that reported an overnight trip, in hundreds). Statement 3.1 prints the share for India alone. The CSV computes column 3 / column 2 x 100, to one decimal (rule R3), and the script checks that India rural, urban and rural+urban equal Statement 3.1 (35.2, 37.7, 36.1). MoSPI's own State/UT share of same-day trips (Statement 3.16) is the same calculation on Table 19; the script checks all 110 published values of Statement 3.16 against Table 19. |
| DTES: India trips and spending from Statement 3.2 and Table 15 | Statement 3.2 prints trips per 100 households; Table 15 prints spending per trip by item for rural, urban and rural+urban. Statements 3.13 and 3.15 repeat parts of Table 15; the script checks them. Statement 3.2 is checked against the trip counts in Table 15 and the households in Table 1. |
| DTES: keep the two reference periods apart | MoSPI counts trips for holidaying, pilgrimage, health and shopping over the last 365 days, and trips for business, social, education and other purposes over the last 30 days. Every row has `reference_period`. Do not add the two groups or rank one against the other. |
| DTES: no RSE beside the State/UT shares | Appendix C gives RSEs for trip counts and spending per trip by State/UT and sector, not for the share of households. The highest RSE of the trip counts is 61.41% (Mizoram urban, 30-day trips). |

## Method notes

- **Police records.** RAI counts road accidents that the State/UT police record (FIRs). The metadata file: "Not based on a sample survey. The dataset is derived from complete enumeration of all police-reported road accidents across States / UTs." A death counts if it happens within 30 days of the accident: "incorporating a grace period of 30 days for conversion of injury cases into fatalities" (metadata, 3.3).
- **Population base of the rates.** Annexure 1, source note 2: "Population: For year 2021 onwards, as per projections of Registrar General of India (July, 2020)". Earlier years use the population printed in column 5 of Annexure 1. MoRTH does not name the base for each earlier year.
- **Severity** is "Road accident deaths per 100 accidents" (Annexure 6, note 1). India's row is "National Average".
- **West Bengal 2024 was recast.** RAI 2024, section 10: "The data for 2024 for West Bengal and Durgapur-Asansol city was not furnished in the prescribed reporting formats ... only aggregate data generated through the Electronic Detailed Accident Report (e-DAR) system was available. Hence, for the year 2024, the road accident data pertaining to West Bengal and Durgapur–Asansol city has been recast". The breakdowns for West Bengal 2024 (road user, helmet, seat belt) follow "the reporting structure and classification pattern followed by the State Police Department for the year 2023". Treat West Bengal's 2024 breakdowns as a method break.
- **Late report.** Section 10.4: the 2024 report "has witnessed a delay on account of the ongoing transition towards the implementation of the Electronic Detailed Accident Report (e-DAR) system". e-DAR data was not used, except for West Bengal.
- **NHTS travel** is any movement of 1 km or more. A trip's primary mode is the mode that covered the longest distance. "Two wheeler" includes ride-hail and rental two-wheelers; "Car" includes taxis and ride-hail cars; "Auto-rickshaw" includes e-rickshaws; "Bus" includes school, company and inter-city buses; "Train/Monorail/Tram" (`train-metro-monorail-tram`) includes metro and suburban rail; "Rail" (`rail`) is the other rail (the fact sheet calls it "Inter-city rail" on page 17). Students are aged 6 and above (current weekly status), workers 15 and above. Reference periods: 90 travel days for students, 30 travel days for fixed workplaces, one travel day for non-fixed workplaces and other purposes, 28 travel days for overnight trips.

- **DTES trips.** An overnight trip is a round trip by household members outside their usual environment, of at least 12 hours that include midnight to 5 am, and of not more than 180 days (Report 597, paragraph 2.5). Regular movements (to work or school, or weekly shopping and visits) are not trips. The leading purpose of a trip is the purpose without which no member would have made it. A same-day trip is a trip outside the usual environment that is not an overnight trip.
- **DTES and NHTS.** Report 597, paragraph 1.8.1: "the major concepts and definitions used in them are dissimilar. Hence the survey results of DTES and NHTS are not strictly comparable." The NHTS counts overnight trips over 28 travel days; the DTES over 365 or 30 days by purpose.
- **DTES and earlier rounds.** Paragraph 1.7.3: pilgrimage trips moved from the 30-day to the 365-day reference period in round 80, so the results "are not strictly comparable with those of NSS 72nd round" (2014-15). No earlier round is in the CSVs.

## Notes on each CSV

All rows use `geography` slugs from `research/data/geography.csv`, or `india`. Missing values are empty, with a `note` where the file has one.

### `road-accidents-by-state.csv` (592 rows)

- India and 36 States/UTs, 2023 and 2024, RAI 2024. `indicator`: `accidents`, `accidents-per-lakh-population` (Annexure 2); `deaths`, `deaths-per-lakh-population` (Annexure 3); `injuries`, `injuries-per-lakh-population` (Annexure 4); `fatal-accidents` (Annexure 5); `severity` (Annexure 6).
- The States/UTs add up to the Total row in Annexures 2 to 5 for 2023 and 2024 (checked by the script).
- **2023 in the two editions.** Every 2023 count and rate in Annexures 2 and 3 of RAI 2024 equals RAI 2023, except Lakshadweep deaths: "-" in RAI 2023, 0 in RAI 2024. No value was revised.
- In 2024, Tamil Nadu had the most accidents (67,526) and Uttar Pradesh the most deaths (24,118). Deaths per lakh people were highest in Tamil Nadu (23.9), Chhattisgarh (22.8) and Telangana (20.8), against 12.6 for India.

### `road-accidents-india-1970-2024.csv` (495 rows)

- India, Annexure 1 of RAI 2024: 1970, 1980, 1990 and every year from 1995 to 2024 (33 years). The years are uneven: a line chart must not join 1970, 1980, 1990 and 1995 as if they were a year apart.
- `indicator`: accidents, deaths, injuries, population (thousand), registered motor vehicles (thousand), road length (km), and the nine rates (per lakh population, per 10,000 vehicles, per 10,000 km of roads for accidents, deaths and injuries).
- Road length for 1970 is for 1971 ("#"), for 1980 is for 1981 ("##"), and for 2021 and 2022 is provisional (`status`). Road length, vehicles and the rates per vehicle and per km are empty for 2023 and 2024 ("Figures for road length for the year 2023 and 2024 are not available").
- Annexure 1, note 3: "Data have been reconciled for West Bengal for the calender year 2015 to 2017, 2019 & 2020 and Tamil Nadu for the calender year 2017 to 2020."
- Road length and vehicles are for the financial year; accidents are for the calendar year (notes 5 and 6).
- The 2021 to 2024 counts equal the Total rows of Annexures 2 to 4 (checked).

### `road-deaths-by-road-user.csv` (1,028 rows)

- India, 2023 and 2024, Table 4.4: deaths and share of deaths for nine road-user categories, and the total. States/UTs, 2024, Annexure 29: deaths by category and sex (`male`, `female`, `person`); India by sex.
- Categories: `pedestrians`, `bicycles`, `two-wheelers`, `auto-rickshaws`, `cars-taxis-vans-lmvs`, `trucks-lorries`, `buses`, `other-non-motorised-vehicles` ("Other non-motor vehicles (including e-rickshaw)"), `others` ("other motor vehicles, animal drawn vehicle, cycle rickshaws, hand carts, & other persons").
- A road user is the person killed (pedestrian, or a driver or passenger of that vehicle), not the vehicle that hit them. Annexures 29(a) to 29(i) give the impacting vehicle; not used.
- Checks: for every State/UT, the nine categories add up to its deaths in Annexure 3; male plus female equals the total in every cell; Table 4.4 equals the Annexure 29 Total row for 2024.
- Two-wheeler riders were 46.2% of road deaths in 2024 (81,780), pedestrians 20.6% (36,526).

### `road-deaths-helmet-seatbelt-by-state.csv` (592 rows)

- India and 36 States/UTs, 2024. Annexure 37 (`device` = `helmet`, "Non-Wearing of Helmet") and Annexure 38 (`seat-belt`). `victim`: `driver`, `passenger`. `indicator`: `deaths`, `grievous-injuries`, `minor-injuries`, `injuries`.
- India rows equal Table 3.3 (checked). In 2024, 54,122 people who did not wear a helmet died (39,470 drivers, 14,652 passengers), and 14,466 who did not wear a seat belt.
- These are victims who were not wearing the device, as the police recorded it. MoRTH gives no count of victims who wore one, so no share of helmet use can be made.

### `travel-mode-by-state-2025-26.csv` (7,992 rows)

- India and 36 States/UTs, NHTS 2025-26, Appendix A Table 3 (`purpose` = `education`) and Table 5 (`work`). `sector`: `rural`, `urban`, `rural+urban`. `sex`: `male`, `female`, `person`. Twelve modes. `rse` is the relative standard error (per cent) from Appendix B Tables 2 and 4.
- The values are per cent of those who travelled 1 km or more for that purpose, so the modes add to about 100 for each group.
- The all-India rows equal fact sheet Table 2 (education) and Table 4 (work) for rural, urban and rural+urban (checked). 2,635 cells are empty ("-").
- Two-wheelers carry 42.6% of workers who travel 1 km or more to work across India, from 5.7% in Nagaland to 92.7% in Puducherry.

### `travel-trip-share-by-state-2025-26.csv` (2,664 rows)

- India and 36 States/UTs, Appendix A Table 2 (students who made trips of 1 km or more to an educational institution, by age 6-14, 15-29, 30+ and 6+) and Table 4 (workers who made trips of 1 km or more to a workplace, by age 15-29, 15-59, 60+ and 15+). RSE from Appendix B Tables 1 and 3.
- The all-India 6+ rows equal fact sheet Table 1 (checked). 66.4% of students and, in urban areas, 64.1% of workers travel 1 km or more.

### `travel-india-fact-sheet-2025-26.csv` (207 rows)

- India, fact sheet Tables 1 to 7, read from the PDF text: Table 1 (students travelling 1 km or more), Table 2 (mode to education by sector), Table 3 (mode to education by age group), Table 4 (mode to work by sector), Table 5 (purpose of other trips, by sex), Table 6 (purpose of overnight trips, by sector) and Table 7 (mode of overnight trips, by sector).
- Tables 5 and 6 allow more than one purpose per person or household, so their rows add to more than 100. "Return home from out of home activity" is near 100 by design.
- Table 7 prints "14" for rural inter-city rail; kept as `14`.
- 11.3% of households made an overnight trip in 28 travel days (fact sheet text, not in a table; not in the CSV). Among them, 55.8% used a bus and 17.7% inter-city rail.

### `tourism-households-by-state-2025-26.csv` (777 rows)

- India and 36 States/UTs, DTES 2025-26. `sector`: `rural`, `urban`, `rural+urban`. `trip_type`: `all`, `overnight`, `same-day`.
- From Table 1: `households`, overnight `households-with-trip`, `trips-365-days` and `trips-30-days` (all in hundreds, as printed), and `share-of-households-with-trip` (`derived`, see "Decisions"). From Table 19: same-day `households-with-trip`. From Statement 3.16: same-day `share-of-households-with-trip`, as published.
- Chandigarh has no rural sample: its rural rows are empty, with a note.
- 36.1% of households across India reported an overnight trip (35.2% rural, 37.7% urban). Among States/UTs, the share was lowest in Meghalaya (18.7%) and highest in Lakshadweep (62.9%).

### `tourism-india-2025-26.csv` (348 rows)

- India, DTES 2025-26. `measure`: `overnight-trips-per-100-households` (Statement 3.2), `average-spending-per-overnight-trip` (Table 15, rupees, by `item` and `sector`), `share-of-same-day-trip-spending` (Statement 3.19, rural and urban). `reference_period`: `365-days` or `30-days`. `purpose`: the eight leading purposes and `all`. `purpose_period` joins the two (`all-365-days`, `social-30-days`), so each bar in a chart has its own key.
- Table 15 items: `package`, `non-package` (the sum of the next seven), `accommodation`, `food-and-drink`, `transport`, `shopping`, `recreation-religious-cultural-sporting`, `medical`, `others`, `total`. Each value is rounded, so items can differ from the total by a few rupees.
- Pilgrimage was the leading purpose of 16.1 overnight trips per 100 households in 365 days; social visits of 16.1 per 100 households in 30 days. A health trip cost ₹32,167 on average, the most of any purpose.

## Gaps and cautions

**Police records undercount road deaths**

- MoRTH counts only accidents that the police record. RAI 2024, section 10.8 (ii): "There is a possibility of under-reporting of fatalities in police-reported data, particularly in cases where deaths occur in hospitals after 30 days and are not captured due to lack of linkage between police and hospital databases. Further, any offence where the human being causing the accident cannot be identified may go unreported."
- Survey-based estimates of road deaths are higher than the police counts. The SRS Cause of Death 2022-24 survey (`research/data/health/srs-causes-of-death-india.csv`) puts injuries of all kinds at 10.5% of all deaths in India (Table 2.1A); our SRS file has no separate road traffic row, so no survey count is set beside MoRTH here.
- MoRTH is the only government series of road deaths by State/UT. Say on each chart that it counts police-recorded deaths within 30 days.
- No figure in this topic comes from dataforindia.com or any other peer site (rule R1).

**State comparisons**

- A low rate can mean fewer deaths or fewer records. Lakshadweep (0 deaths in 2024), Manipur (2.2 per lakh) and Nagaland (2.8) are far below India. Manipur's accidents fell from 508 (2022) to 299 (2024); the report gives no reason.
- West Bengal 2024 was recast from e-DAR totals (see "Method notes"). Its counts are valid totals; its breakdowns follow its 2023 pattern.
- Ladakh's 2021 rate and 2021 and 2022 shares are blank in Annexures 2 to 4; they are not in our periods.
- Annexure 29 (first page) writes "Orissa"; the script maps it to `odisha`.

**NHTS**

- The NHTS is a sample survey. Many State/UT values have a high RSE: among walk, bicycle, two-wheeler and bus in the rural+urban person rows, 60 of 294 values have an RSE above 25%. Small States/UTs (Lakshadweep, Andaman and Nicobar Islands, Ladakh, Puducherry, Dadra and Nagar Haveli and Daman and Diu) have the highest RSEs. Show the RSE or leave out values above a set limit; the limit is a chart decision.
- Chandigarh has no rural sample.
- MoSPI's caution (fact sheet, page 4): "Users are strictly advised not to compare the data or findings from National Household Travel Survey (NHTS) and Domestic Tourism Expenditure Survey (DTES)." The two surveys define a trip and an overnight trip differently.
- NHTS counts only trips of 1 km or more. A child who walks 800 m to school is not in the travel tables.
- The workbooks name Kerala "Keralam"; mapped to `kerala`.
- This is the first round. There is no earlier NHTS to compare with.

**DTES**

- The DTES is a sample survey of 2,46,113 households. Appendix C gives RSEs of State/UT trip counts and spending; many small States/UTs are above 15%. Lakshadweep (240 sample households) and Ladakh (360) have the smallest samples.
- Overnight trips for holidaying, pilgrimage, health and shopping (365 days) and for business, social, education and other purposes (30 days) are two separate counts. A household "with an overnight trip" made one of the first kind in 365 days or one of the second kind in 30 days.
- The trip and spending figures are per trip, not per person. Spending is all spending related to the trip, before, during or after it, whoever paid: the household, or an institution such as a government office (Report 597, paragraph 2.16).
- MoSPI's caution against comparing the DTES with the NHTS applies here (see "Method notes").

**Not covered**

- Road length and registered vehicles after 2022 (MoRTH prints none for 2023 and 2024). The Road Transport Year Book is stale (2019-20).
- Accidents by road category (National Highways, State Highways), by cause (speeding, drunk driving), by time of day, in cities: RAI 2024 prints them (Tables 2.1 to 3.8, Annexures 9 to 28 and 35 to 50); not built.
- Trip distance (not published), time taken and trip cost by State/UT (Appendix A Tables 6 to 13); not built.
- Monthly or 2025 road accident data: Parliament answers give e-DAR figures for 2025 and 2026 marked as provisional. Not used: a dated MoRTH report comes first (rule R4).

## Checks (25 Nov 2026)

`build_transport.py` stops with an error if any of these values differs. Each MoRTH value was read from the word boxes of the publisher's PDF; each NHTS value from the publisher's XLSX or the fact sheet text.

| CSV | Value checked | Published table |
| --- | --- | --- |
| `road-accidents-by-state.csv` | India deaths 2024: 1,77,175 (Annexure 3); Tamil Nadu accidents 2024: 67,526 (Annexure 2); Chhattisgarh deaths per lakh population 2024: 22.8 (Annexure 3) | RAI 2024, pp. 114, 115 |
| `road-accidents-india-1970-2024.csv` | 1970 accidents: 1,14,100; 2020 deaths: 1,38,383; 2024 deaths per lakh population: 12.6 | RAI 2024, Annexure 1, p. 113 |
| `road-deaths-by-road-user.csv` | Two-wheeler deaths 2024: 81,780 and pedestrian deaths 2023: 35,221 (Table 4.4, p. 63); Andhra Pradesh pedestrian deaths 2024: 1,739 (Annexure 29, p. 156) | RAI 2024 |
| `road-deaths-helmet-seatbelt-by-state.csv` | India drivers killed, no helmet: 39,470; India passengers killed, no seat belt: 6,977 (Table 3.3 and the Total rows); Andhra Pradesh drivers killed, no helmet: 2,353 (Annexure 37, p. 175) | RAI 2024 |
| `travel-mode-by-state-2025-26.csv` | India, workers, rural+urban, two-wheeler: 42.6 (Table 4); India, students, rural, walk: 40.5 (Table 2); Andhra Pradesh, workers, rural, male, two-wheeler: 56.9 (Table A5) | NHTS fact sheet and Appendix A |
| `travel-trip-share-by-state-2025-26.csv` | India, students 6+, rural+urban: 66.4 (Table 1); Andhra Pradesh, rural male students 6-14: 60.3 (Table A2); Delhi, rural male workers 15-29: 67.6 (Table A4) | NHTS |
| `tourism-households-by-state-2025-26.csv` | India share of households with an overnight trip, rural: 35.2, and rural+urban: 36.1 (derived, equal to Statement 3.1); Tamil Nadu households with an overnight trip, rural+urban: 1,06,804 hundred (Table 1); Tripura households with a same-day trip, rural+urban: 89.7 (Statement 3.16) | Report 597, pp. 13, 31, 32; Appendix A Table 1 |
| `tourism-india-2025-26.csv` | Overnight trips per 100 households, pilgrimage, rural: 15.5 (Statement 3.2); spending per health trip, rural+urban: ₹32,167, urban: ₹41,649; per business trip, rural: ₹5,179; transport on a holiday trip: ₹3,685 (Table 15, Statements 3.13, 3.15); same-day spending on shopping, rural: 51.2% (Statement 3.19) | Report 597, pp. 14, 28, 30, 35; Appendix A Table 15 |
| `travel-india-fact-sheet-2025-26.csv` | Overnight trips by bus, rural+urban: 55.8 (Table 7); overnight trips for socialising and religious practice: 70.2 (Table 6); students aged 6-14 who walk: 47.3 (Table 3) | NHTS fact sheet, pp. 6, 16, 17 |

`build_tourism.py` also stops with an error if Statement 3.1 differs from the derived India shares, if any of the 110 values of Statement 3.16 differs from the same share on Table 19, if any value of Statements 3.13 and 3.15 differs from Table 15, if Statement 3.2 differs by more than 0.05 from the Table 15 trip counts over the Table 1 households, if package plus non-package differs from the total in Table 15, or if Tables 1 and 19 give different household counts.

Other checks in `build_transport.py`: States/UTs add up to India in Annexures 2 to 5, 37 and 38; Annexure 1 equals the Total rows of Annexures 2 to 4 for 2021 to 2024; Annexure 29 adds up to Annexure 3 for every State/UT; Table 4.4 equals Annexure 29; Table 3.3 equals the Total rows of Annexures 37 and 38; fact sheet Tables 1, 2 and 4 equal the all-India rows of Appendix A Tables 2, 3 and 5; every geography is in `geography.csv`.

## Raw files

Read 25 Nov 2026. Paths are relative to `raw/transport/`. `pipeline/transport/sources.tsv` lists the same paths and URLs. Run from the repository root:

```sh
pipeline/transport/fetch.sh                        # downloads every file in sources.tsv; logs sha256 to raw/transport/<dir>/_log.tsv
pipeline/transport/extract_text.sh                 # pdftotext -layout and -bbox, one .txt and one .bbox.html per PDF in work/transport/
python3 -I pipeline/transport/build_transport.py
python3 -I pipeline/transport/build_tourism.py    # DTES only; needs fetch.sh tourism/ and extract_text.sh tourism/
```

`node pipeline/transport/morth_reports.mjs raw/transport/morth/pages` lists the MoRTH editions again (optional). MoRTH file URLs start with `https://morth.gov.in/backend/documents/uploaded/`. NHTS workbook URLs start with `https://www.mospi.gov.in/uploads/documents/documents/`.

| Raw file | Release | URL (after the prefix) | SHA-256 |
| --- | --- | --- | --- |
| `morth/rai-2024.pdf` | Road Accidents in India 2024 | `Road%20Accidents%20in%20India%20-%202024.pdf` | `70a2cf4a92c7074d13502a84ce25d606ce4655d4e7e79d49740c97fd908600ea` |
| `morth/rai-2023.pdf` | Road Accidents in India 2023 | `Road-Accident-in-India-2023-Publications.pdf` | `901505420d5b387052ac51e36b4bdce0274f6326b614f9ebcee6e7954d45b5b0` |
| `morth/rai-metadata.pdf` | Metadata, Road Accidents in India | `Road%20Accidents%20in%20India.pdf` | `f6160ec2fcde1c7ed639b51b73135a93daf5964499e5cab9aaadfae3f4c2d318` |
| `morth/rai-documents-api.json` | MoRTH list of the 19 documents in the group | `https://morth.gov.in/backend/api/documents/Road%20Accidents%20in%20India` | `d440bd11d6926f53979fbedf9ae9dd00a16478bed2e9f3a5847f168b85b56038` |
| `nhts/factsheet.pdf` | NHTS 2025-26 fact sheet | `https://www.mospi.gov.in/uploads/publications_reports/publications_reports1791198151034_8d52ad0c-75ba-4040-a445-32c2ca98958e_Factsheet_-_NHTS.pdf` | `45b4b3ee7025061cf4e2047620bfb8012466674cc0f00d256a7266580e5c7a5e` |
| `nhts/press-note.pdf` | NHTS press note, 5 Oct 2026 | `https://www.mospi.gov.in/uploads/latestReleases/latest_release_1791197961812_aef550fd-c694-4955-9e26-296148e3714d_Press_Note_-_NHTS.pdf` | `a8777e3ddeadf2b2de180d163fab77057cb304be5784bc41d5cb40e42a86df1f` |
| `nhts/appendix-a/table-1.xlsx` | Appendix A Table 1, sample by State/UT | `1791197116459-Table_1.xlsx` | `d245bcd24ac66b6d8b98f2837427ab12fcaf05925be2980ed88d91943ab4bd8b` |
| `nhts/appendix-a/table-2.xlsx` | Appendix A Table 2, students travelling | `1791197103761-Table_2.xlsx` | `82739b21cf8689628d6732ca2e636524d04cb79ff340c2185d457c2fd935d89e` |
| `nhts/appendix-a/table-3.xlsx` | Appendix A Table 3, mode to education | `1791197092617-Table_3.xlsx` | `8bf528de4b2c5e887150c62750c4cc4066ccd23021ec6d92bda9089df282c364` |
| `nhts/appendix-a/table-4.xlsx` | Appendix A Table 4, workers travelling | `1791197078795-Table_4.xlsx` | `c76e51d064947f1e0bda6876632463e4f3f78f36d5225bfc7503c265aca7394b` |
| `nhts/appendix-a/table-5.xlsx` | Appendix A Table 5, mode to work | `1791197068068-Table_5.xlsx` | `189acce86756bc284373c83c00b525ec02e77d0289791e2dd079720e6dc9fd1f` |
| `nhts/appendix-b/rse-table-1.xlsx` | Appendix B Table 1, RSE of Table A2 | `1791196798629-RSE_Table_1.xlsx` | `2d94861e4aa624e18b08f342a89f919ff87d14fd3798b90accdd30b746a7bf6a` |
| `nhts/appendix-b/rse-table-2.xlsx` | Appendix B Table 2, RSE of Table A3 | `1791196810096-RSE_Table_2.xlsx` | `a0f62cffd5e76d73fedd4caaf761de3e6fe22a1f2225fc7ff78ce6a29f366a29` |
| `nhts/appendix-b/rse-table-3.xlsx` | Appendix B Table 3, RSE of Table A4 | `1791196820650-RSE_Table_3.xlsx` | `681776f43e7cbabffe051910baa17e511284c6eb46e995434111f7f22792d818` |
| `nhts/appendix-b/rse-table-4.xlsx` | Appendix B Table 4, RSE of Table A5 | `1791196831860-RSE_Table_4.xlsx` | `4190753f496417f16244aff7cf3eced17ab78b74606aa852cb80e7054224b994` |
| `tourism/report-597.pdf` | NSS Report 597, Domestic Tourism in India | `https://www.mospi.gov.in/uploads/publications_reports/publications_reports1790160086463_10b96a4e-35b0-416b-83b7-9cb3b364ca8c_DomesticTourism_report_597_(1).pdf` | `3d201d09a142b0cc5f270202dba1ae8bf990339f80214fc4624532f42dbab8d2` |
| `tourism/press-note.pdf` | DTES press note, 23 Sep 2026 | `https://www.mospi.gov.in/uploads/latestReleases/latest_release_1790159417509_e87601c9-a7f3-4290-9600-46c078186d81_Press_Note_DTES_220926.pdf` | `2307b6e00ef8892e8e2491bbebf795464066e586c33cc5d0f4a026489f6a601a` |
| `tourism/appendix-a/table-1.xlsx` | Report 597, Appendix A Table 1, households and overnight trips by State/UT | `https://www.mospi.gov.in/uploads/documents/DTES_tables/Table1.xlsx` | `87114d121ef7845677ec8cea1faf35cb2ebbfed0d5df1aaea657cfc6d2ed63d0` |
| `tourism/appendix-a/table-15.xlsx` | Report 597, Appendix A Table 15, spending per overnight trip by item | `https://www.mospi.gov.in/uploads/documents/DTES_tables/Table15.xlsx` | `c46e95d506b538f418e05382a53440da58b39df4e684b9c692291654f7380ed8` |
| `tourism/appendix-a/table-19.xlsx` | Report 597, Appendix A Table 19, households and same-day trips by State/UT | `https://www.mospi.gov.in/uploads/documents/DTES_tables/Table19.xlsx` | `dd5b5cd6482d6c9d341b74c51788aa294f5a375814c9450f17a82819cafcc1b8` |
| `tourism/pages/latest-release-p3.json` | MoSPI release list, page 3 (DTES release date), POST `{"lang":"en","page_no":3}` | `https://www.mospi.gov.in/api/latest-release/get-web-latest-release-list` | `170525f9d3d9bcdd4bb9cc1769b28c2c165c7fecd91887f0643b26c7bc264233` |
| `nhts/pages/latest-release-p2.json` | MoSPI release list, page 2 (NHTS release date), POST `{"lang":"en","page_no":2}` | `https://www.mospi.gov.in/api/latest-release/get-web-latest-release-list` | `8e85a4331f50c10a71e593758f9c1396e8942caaa7b59c32c92e44fc7fe5056b` |

## Proposed charts

Kinds are from `src/content/types.ts`. Every MoRTH chart needs the note "police-recorded; deaths within 30 days". Every NHTS State/UT chart needs the RSE caution, and the status word Survey estimate.

| Slug | Kind | CSV and rows | Period | Why |
| --- | --- | --- | --- | --- |
| `road-deaths-per-lakh-by-state` | `states` (`better: 'low'`) | `road-accidents-by-state.csv`, `indicator=deaths-per-lakh-population`, `period=2024` | 2024 | The headline measure for every State/UT: Tamil Nadu 23.9 and Chhattisgarh 22.8 against India's 12.6. |
| `road-deaths-india` | `line` (two panels) | `road-accidents-india-1970-2024.csv`, `indicator` in (`deaths`, `accidents`) | 1970 to 2024 | Deaths rose from 14,500 (1970) to 1,77,175 (2024) while accidents stayed between 3.7 lakh and 5.1 lakh a year from 2001: deaths rose faster than accidents. Mark the uneven years before 1995. |
| `road-deaths-per-lakh-india` | `line` | `road-accidents-india-1970-2024.csv`, `indicator=deaths-per-lakh-population` | 1970 to 2024 | The risk per person, 2.7 to 12.6 per lakh. RAI 2024 links the 2020 fall to the Covid-19 pandemic and the nationwide lockdown. |
| `road-deaths-by-road-user` | `bars` (two periods) | `road-deaths-by-road-user.csv`, `geography=india`, `indicator=share-of-deaths`, `period` in (2023, 2024) | 2023, 2024 | 46.2% of the people killed in 2024 were on two-wheelers and 20.6% were pedestrians. |
| `road-accident-severity-by-state` | `states` (`better: 'low'`) | `road-accidents-by-state.csv`, `indicator=severity`, `period=2024` | 2024 | Deaths per 100 accidents show where an accident is most likely to kill (India 36.3). Kerala records many accidents but few deaths per accident (7.9); Mizoram (93.2) and Punjab (78.5) the reverse. |
| `helmet-and-seat-belt-deaths` | `bars` (stacked, driver and passenger) | `road-deaths-helmet-seatbelt-by-state.csv`, `geography=india`, `indicator=deaths` | 2024 | 54,122 deaths without a helmet and 14,466 without a seat belt. Counts only: MoRTH gives no base for a share. |
| `commute-mode-to-work` | `bars` (rural and urban grouped) | `travel-mode-by-state-2025-26.csv`, `geography=india`, `purpose=work`, `sex=person`, `sector` in (`rural`, `urban`) | 2025-26 | Two-wheelers carry 52.3% of urban workers; in rural areas walking (36.6%) is almost as common as two-wheelers (37.1%). |
| `commute-mode-to-school` | `bars` (rural and urban grouped) | `travel-mode-by-state-2025-26.csv`, `geography=india`, `purpose=education`, `sex=person`, `sector` in (`rural`, `urban`) | 2025-26 | Walking (37.0%), bus (29.5%) and bicycle (15.8%) carry most students. |
| `two-wheeler-commute-by-state` | `states` | `travel-mode-by-state-2025-26.csv`, `purpose=work`, `sector=rural+urban`, `sex=person`, `mode=two-wheeler` | 2025-26 | From 5.7% (Nagaland) to 92.7% (Puducherry). Pairs with the two-wheeler death share on the same page. Needs the RSE caution. |
| `overnight-trip-mode` | `bars` | `travel-india-fact-sheet-2025-26.csv`, `table=NHTS 2025-26 fact sheet, Table 7`, `sector=rural+urban` | 2025-26 | Buses (55.8%) and inter-city rail (17.7%) carry most overnight household trips. |

| `overnight-trip-households-by-state` | `states` | `tourism-households-by-state-2025-26.csv`, `sector=rural+urban`, `trip_type=overnight`, `indicator=share-of-households-with-trip` | 2025-26 | 36.1% of households across India, from 18.7% in Meghalaya to 62.9% in Lakshadweep. `derived` share. |
| `overnight-trips-by-purpose` | `bars` (rural and urban grouped) | `tourism-india-2025-26.csv`, `measure=overnight-trips-per-100-households` | 2025-26 | Pilgrimage, health and social visits lead. Label the two reference periods. |
| `overnight-trip-spending-by-purpose` | `bars` (rural and urban grouped) | `tourism-india-2025-26.csv`, `measure=average-spending-per-overnight-trip`, `item=total` | 2025-26 | Health trips cost the most. |
| `overnight-trip-spending-by-item` | `bars` (stacked by item) | `tourism-india-2025-26.csv`, `measure=average-spending-per-overnight-trip`, `sector=rural+urban` | 2025-26 | Medical care is most of a health trip; transport is the largest part of a holiday or pilgrimage. |

Not proposed yet: same-day trips by State/UT (Statement 3.16, in the CSV) and same-day spending by item (Statement 3.19, in the CSV), for a later part.

Not proposed: a State/UT chart of road-user deaths as a share (it needs a derived share; Annexure 29 gives counts only), and a chart that sets NHTS beside the tourism survey (MoSPI advises against it).
