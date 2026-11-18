# Education

Data for the India by Numbers "Education" topic. School data come from UDISE+ (Ministry of Education, Department of School Education and Literacy). Higher education data come from the All India Survey on Higher Education (AISHE, Ministry of Education). Literacy comes from the PLFS 2025 survey (MoSPI) and the Census 2011 full count (ORGI).

Read on 17 Nov 2026.

## Questions this topic answers

1. How many children are in school, and how far do they get?
2. Which states keep children in school to class 12, and where do the most drop out?
3. Do schools have enough teachers, electricity, toilets for girls and internet?
4. How many young adults go on to college, and do more women go than men?
5. How many Indians can read and write?

## About the sources

- **UDISE+** is an administrative census of schools. Schools upload their own data. The reference date for 2025-26 is 31 March 2026. From 2022-23, UDISE+ collects data for each student, not school totals. The booklet says the ratios are "strictly not comparable" with figures up to 2021-22. Population projections used for the ratios were also revised.
- UDISE+ 2025-26 comes in two layouts: the existing structure (primary 1-5, upper primary 6-8, secondary 9-10, higher secondary 11-12) and the NEP 2020 structure (foundational, preparatory, middle, secondary). These files use the **existing structure**, so they line up with earlier years. NEP-structure figures (for example "secondary GER 71.7%", which covers classes 9 to 12) are different measures. Do not mix the two.
- **Gross enrolment ratio (GER)** is enrolment at a level, of any age, divided by the population of the official age for that level. It can exceed 100.
- **AISHE** is a survey of higher education institutions. Institutions submit data voluntarily. GER for 2023-24 uses population projections based on Census 2011, age 18-23.

## Charts

### edu-1 Children in school, by level, since 2020-21

- Type: line, small multiples (enrolment by level; GER by level; dropout rate by level). Method break marker between 2021-22 and 2022-23.
- Unit: students; GER (per cent of the age group); per cent. Geography: India. Period: 2020-21 to 2025-26.
- File: `education-school-trend-india.csv`.
- Sentence: "In 2025-26, 24.72 crore children were enrolled from pre-primary to class 12, slightly more than the 24.69 crore of 2024-25. Primary enrolment (classes 1 to 5) fell to 10.19 crore, from 10.44 crore in 2024-25."
- Source: UDISE+ booklets 2021-22 (gives 2020-21 and 2021-22), 2022-23, 2023-24, 2024-25 and 2025-26 (existing structure), Table 1 "National Highlights" in each.

### edu-2 Gross enrolment ratio by state

- Type: ranked bar by state and tile map by state. Toggle: level (primary, upper primary, elementary, secondary, higher secondary) and sex (boys, girls, total).
- Unit: GER, per cent of the official age group. Geography: all 36 states and UTs plus India. Period: 2025-26.
- File: `education-ger-school-by-state.csv`.
- Sentence: "At higher secondary level (classes 11 and 12), the GER in 2025-26 was 61.7 for India. It was 42.1 in Bihar and 91.9 in Kerala."
- Source: UDISE+ 2025-26 booklet (existing structure), Table 6.1, all social groups.

### edu-3 Dropout rate by state

- Type: ranked bar by state and tile map by state. Toggle: level (primary, upper primary, secondary) and sex.
- Unit: per cent of students in the level. Geography: all 36 states and UTs plus India. Period: 2025-26.
- File: `education-dropout-by-state.csv`.
- Sentence: "In 2025-26, 9.5% of students in classes 9 and 10 dropped out, down from 11.5% in 2024-25. The rate was highest in Karnataka (18.1%) and lowest in Chandigarh (1.3%)."
- Source: UDISE+ 2025-26 booklet (existing structure), Table 6.13. The 2024-25 value is from Table 1 of the 2024-25 booklet.

### edu-4 Pupils per teacher by state

- Type: ranked bar by state. Toggle: level.
- Unit: pupils per teacher. Geography: all 36 states and UTs plus India. Period: 2025-26.
- File: `education-ptr-by-state.csv`.
- Sentence: "India had 15 pupils for each teacher at secondary level in 2025-26. Jharkhand had 31, the highest of any state."
- Source: UDISE+ 2025-26 booklet (existing structure), Table 4.12.

### edu-5 Electricity, girls' toilets and internet in schools, by state

- Type: small multiples of ranked bars, or a tile map per facility.
- Unit: per cent of schools. Geography: all 36 states and UTs plus India. Period: 2025-26.
- File: `education-school-facilities-by-state.csv`. The `value_type` column says which values are published and which are derived. Row order (18 Nov 2026): internet rows first, India and then the states and UTs from the highest share to the lowest; the other facilities follow in the same state order. No value changed.
- Sentence: "Two in three schools (67.4%) had internet in 2025-26. In West Bengal it was one in five (19.7%)."
- Source: UDISE+ 2025-26 booklet (existing structure): Table 8.6 (functional electricity), Table 8.8 (functional girls' toilets), Table 2.5 continued (internet, number of schools). Internet shares are derived as schools with internet divided by total schools. The India value (67.4%) matches the published figure in Table 1.

### edu-6 College enrolment ratio by state

- Type: tile map by state and ranked bar. Toggle: male, female, total.
- Unit: GER, per cent of population aged 18-23. Geography: all 36 states and UTs plus India. Period: 2023-24.
- File: `education-higher-ed-ger-by-state.csv`.
- Sentence: "In 2023-24, India's higher education GER was 30.0. It ranged from 7.1 in Lakshadweep to 72.3 in Puducherry. Among large states, Tamil Nadu was highest at 52.3 and Bihar lowest at 17.7."
- Source: AISHE 2023-24 final report, Table 19 (all categories, based on 2011 population).

### edu-7 College enrolment ratio over time, women and men

- Type: line, female and male.
- Unit: GER, per cent of population aged 18-23. Geography: India. Period: 2011-12 to 2023-24.
- File: `education-higher-ed-ger-india.csv`.
- Sentence: "Women overtook men in higher education in 2017-18. In 2023-24 the GER was 31.2 for women and 28.9 for men."
- Source: AISHE "Time series for GER based on 2011 Pop Projection" (2011-12 to 2021-22) and AISHE 2023-24 final report, Table 47 (2022-23 and 2023-24).

### edu-8 Literacy by state

- Type: ranked bar by state for 2025 (survey), with Census 2011 as a second marker where the state existed in 2011. Toggle: male, female, person.
- Unit: per cent of persons aged 7 and over. Geography: 36 states and UTs plus India (2025); 34 plus India (2011). Period: 2025 and 2011.
- File: `education-literacy-by-state.csv`. The `source_type` column separates the survey estimate from the census count.
- Sentence: "The 2011 Census counted 72.98% of people aged 7 and over as literate. The PLFS survey estimated 81.1% in 2025. For women, the 2025 estimate was 74.9%, against 87.5% for men."
- Source: MoSPI NSO, PLFS Annual Report 2025, Appendix A, Table (7) (rural+urban, age 7+). ORGI, Census 2011 Primary Census Abstract, India and states (rates derived from counts).

## Headline figures

| Figure | Value | Period | Source |
| --- | --- | --- | --- |
| Students, pre-primary to class 12 | 24.72 crore (247,219,766) | 2025-26 | UDISE+ 2025-26, Table 1 |
| GER, higher secondary (classes 11-12) | 61.7 | 2025-26 | UDISE+ 2025-26, Table 1 |
| Dropout rate, secondary (classes 9-10) | 9.5% | 2025-26 | UDISE+ 2025-26, Table 1 |
| Schools with internet | 67.4% | 2025-26 | UDISE+ 2025-26, Table 1 |
| Higher education GER, age 18-23 | 30.0 (women 31.2, men 28.9) | 2023-24 | AISHE 2023-24, Table 19 |
| Literacy rate, age 7+ | 81.1% (survey estimate) | 2025 | PLFS Annual Report 2025, Table (7) |
| GER, secondary (classes 9-12), NEP structure (reference only, a different measure) | 71.7 | 2025-26 | Ministry of Education, UDISE+ 2025-26 booklet, NEP structure, 7 Jul 2026, Table 1 "National Highlights of UDISE+ data, 2025-26", row "Gross Enrolment Ratio (GER) – Secondary" (PDF page 28). Checked 18 Nov 2026 |
| GER, Scheduled Tribes, 2022-23 (two values in one report; not charted) | 23.5 and 22.6 | 2022-23 | Ministry of Education, AISHE Final Report 2023-24, 8 Jul 2026: highlights, "This was 23.5 in 2022-23" (PDF page 20); text on ST GER, "from 22.6 in 2022-23" (PDF page 79). Checked 18 Nov 2026 |

## Sources

| Publisher | Release | Release date | Period | URL read | Read on | Licence | sha256 of raw file |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Ministry of Education, DoSE&L | UDISE+ 2025-26 booklet, existing structure | 7 Jul 2026 | 2025-26 (reference date 31 Mar 2026) | https://dashboard.udiseplus.gov.in/report2026/static/media/UDISE+2025_26_Booklet_existing.edd7cd16d934a10377ba.pdf | 17 Nov 2026 | Not stated | f20bfc4296acdb0f84a36f65587002c7899272ea67b6d91497a172a76982d9c4 |
| Ministry of Education, DoSE&L | UDISE+ 2025-26 booklet, NEP structure (reference only, not used in CSVs) | 7 Jul 2026 | 2025-26 | https://dashboard.udiseplus.gov.in/report2026/static/media/UDISE+2025_26_Booklet_nep.94ceae1e8c2210549d21.pdf | 17 Nov 2026 | Not stated | d212a8c04deb55689bae658e49c65cee4b7ed6190dfa604df5a09ae0702c408c |
| Ministry of Education, DoSE&L | UDISE+ 2024-25 booklet, existing structure | 28 Aug 2025 (PIB release 2161543, checked 18 Nov 2026; PDF dated the same day) | 2024-25 | https://dashboard.udiseplus.gov.in/report2026/static/media/UDISE+2024_25_Booklet_existing.118ba29d4773e6372f72.pdf | 17 Nov 2026 | Not stated | cc66d03e1413722d2f5ab66f29ece3cdb3c21f7d736ac63f21efc3696ed7f4bf |
| Ministry of Education, DoSE&L | UDISE+ 2023-24 booklet, existing structure | 30 Dec 2024 (PDF date, checked 18 Nov 2026; the ministry page for this booklet was created 27 Dec 2024) | 2023-24 | https://dashboard.udiseplus.gov.in/report2026/static/media/UDISE+2023_24_Booklet_existing.309eabf9e4889db93bcb.pdf | 17 Nov 2026 | Not stated | 6a54fbf78e0ea7158aeeba568066a179aa133736e3bd9102c2c9e352bece71ac |
| Ministry of Education, DoSE&L | UDISE+ 2022-23 booklet, existing structure | 30 Dec 2024 (PDF date, checked 18 Nov 2026; released with the 2023-24 booklet) | 2022-23 | https://dashboard.udiseplus.gov.in/report2026/static/media/UDISE+2022_23_Booklet_existing.d209e7c7516d77939da9.pdf | 17 Nov 2026 | Not stated | 59884f936772bc79ac7f007ae0f8330311c85b4f5cf748d6834672c0be8f08e6 |
| Ministry of Education, DoSE&L | UDISE+ 2021-22 booklet | 3 Nov 2022 (PIB release 1873307, checked 18 Nov 2026; PDF dated the same day) | 2020-21 and 2021-22 | https://dashboard.udiseplus.gov.in/report2026/static/media/UDISE+2021_22_Booklet.f55c1a60ed700e6c7892.pdf | 17 Nov 2026 | Not stated | eeac0c2dcb98b224604c291b080935d98b26c119142dd98163a4c5b6182db6b5 |
| PIB (Ministry of Education) | UDISE+ 2025-26 release, PRID 2282141 | 7 Jul 2026, 6:10 PM | 2025-26 | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2282141 | 17 Nov 2026 | Not stated | b9f6f12d35101a7b0e519d87419ed6c4757aaa360e1e5e690a092861279eeb18 |
| Ministry of Education, DoHE | AISHE Final Report 2023-24 | 8 Jul 2026 | 2023-24, with 2019-20 to 2022-23 in Table 47 | https://cdnbbsr.s3waas.gov.in/s392049debbe566ca5782a3045cf300a3c/uploads/2026/07/202607131602421770.pdf (linked from https://aishe.gov.in/) | 17 Nov 2026 | Not stated | 2f99b6cfd00c1131620be85f41ed3f57a433b81cb0ce0906dbf5ac11874b7fa9 |
| Ministry of Education, DoHE | AISHE time series for GER based on 2011 population projection | File uploaded Jun 2025 | 2011-12 to 2021-22 | https://cdnbbsr.s3waas.gov.in/s392049debbe566ca5782a3045cf300a3c/uploads/2025/06/202506041164303308.pdf | 17 Nov 2026 | Not stated | b542dc154153376fd349901968294622bb4f1c8fd3b335dc1837e32ba2eb21b0 |
| PIB (Ministry of Education) | AISHE 2022-23 and 2023-24 release, PRID 2282525 | 8 Jul 2026, 5:56 PM | 2022-23, 2023-24 | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2282525 | 17 Nov 2026 | Not stated | 4ec92bdef633ebc80434029b57eff7007f7f0d92e6c0e7dcd7209e283aa32d74 |
| MoSPI NSO | PLFS Annual Report 2025, Appendix A, Table (7), literacy | 27 Mar 2026 (revised file dated 29 May 2026) | Jan to Dec 2025 | https://www.mospi.gov.in/uploads/publications_reports/publications_reports1780040415321_0624fb13-fb47-40bc-b470-7c7e9635c3ef_PLFS_2025_F_REV_29052026.pdf | 17 Nov 2026 | Not stated | 134bf2de5e4b1142d3bae4899c90ec5be3bf5ec03a2ff4b3f7b0bba34eee0da7 (same raw file as the jobs topic, `raw/jobs/`) |
| ORGI, Census of India | Census 2011 Primary Census Abstract, India, states and districts (DDW_PCA0000_2011_Indiastatedist.xlsx) | 30 Apr 2013 (PIB release 95372, "Census 2011: Abstract- Primary Data Released", checked 18 Nov 2026) | 1 Mar 2011 | https://censusindia.gov.in/nada/index.php/catalog/6191/download/9268/DDW_PCA0000_2011_Indiastatedist.xlsx | 17 Nov 2026 | Not stated | 7a8f70d46c43b5dd30eefe920f251752f69f6af8589594c21ac06499074646f5 |

Raw downloads are not kept in the repository; the URL and sha256 above identify each file. The parsing script is `pipeline/education/build_education.py`. PDFs were turned into text with `pdftotext -layout` (`pipeline/education/extract_text.sh`).

## Checks done

- All five state tables from UDISE+ 2025-26 (6.1, 6.13, 4.12, 8.6, 8.8) and Table 2.5 parse to 37 rows (36 states and UTs plus India).
- Derived internet share for India (989,191 of 1,466,682 schools, 67.4%) equals the published share in Table 1. The PIB release also gives 67.4%.
- Census 2011 literacy derived from counts gives 72.98% for India, 94.00% for Kerala and 61.80% for Bihar. These match the published Census 2011 rates.
- AISHE Table 47 (All India, 2019-20 to 2021-22) matches the 2011-population time series file.
- Meghalaya's low share for functional electricity (28.7%) and West Bengal's for internet (19.7%) were checked against the counts in Table 2.5.

## Gaps and cautions

- **UDISE+ break in 2022-23.** Student-level data collection and new population projections began in 2022-23. Primary GER fell from 103.39 (2021-22) to 96.2 (2022-23) and dropout rates jumped (primary 1.45% to 7.8%). This is mostly a change of method. Show a break marker. Do not describe the 2021-22 to 2022-23 change as a real fall in enrolment.
- **Year-on-year UDISE+ values are as first published.** Each year comes from that year's booklet. Later booklets do not restate earlier years in Table 1.
- **UDISE+ trend before 2020-21: not collected.** The 2019-20 and 2020-21 booklets have a different layout. I did not parse them.
- **GER above 100.** Many states show GER above 100 (Meghalaya primary 184.7). This means over-age or under-age enrolment, cross-state enrolment, or a low population projection. Cap nothing; explain it in the chart note.
- **Small UTs.** The UDISE+ booklet warns that ratios for UTs and some small states changed with the new population projections. Chandigarh's higher secondary GER (108.2) and similar values need a note.
- **Girls' toilet and electricity.** Table 1 reports "having electricity connection" (95.0%) and "girls' toilet facility" (98.5%). The state file uses the "functional" versions (93.5% and 95.8%), which are lower. Do not mix them.
- **AISHE is two years behind.** The latest AISHE report is 2023-24, released 8 Jul 2026. AISHE 2024-25 was not found. AISHE GER uses projections from Census 2011.
- **AISHE internal inconsistency.** The AISHE 2023-24 highlights give ST GER of 23.5 for 2022-23 in one sentence and 22.6 in another. Table 47 gives 22.6. The CSVs do not include ST rows.
- **AISHE small UTs.** Ladakh SC GER is 0.0 and several UTs have no SC or ST value. The state CSV has the all-categories rows only.
- **Literacy, two different measures.** Census 2011 is a full count and the latest one. PLFS 2025 is a sample survey estimate. The gap between 72.98% (2011) and 81.1% (2025) mixes real change with a change of method. Do not draw a line between them; show them as separate markers.
- **Census 2011 boundaries.** Andhra Pradesh in 2011 includes present Telangana. Jammu and Kashmir includes present Ladakh. So Telangana and Ladakh have no 2011 row, and the 2011 Andhra Pradesh and Jammu and Kashmir rows are not comparable with 2025. Dadra and Nagar Haveli and Daman and Diu were separate UTs in 2011; the 2011 dnh-dd row adds their counts.
- **Census 2011 literacy rates are derived.** They are literates divided by (total population minus population aged 0 to 6), from the PCA counts. Values are shown to 2 decimals, the same precision as published Census rates.
- **Census 2027 is under way.** House-listing ran from April to September 2026. Population enumeration runs to early 2027. New literacy counts will replace the 2011 values.
- **Licence.** None of the pages read states a reuse licence.

## Publisher check on 18 Nov 2026

PIB release 2282141 and both UDISE+ 2025-26 booklets are from 7 Jul 2026. The PIB release body matches the 17 Nov copy. The two booklet files also match their 17 Nov checksums.

PIB agrees with the existing-structure data for total teachers (10,273,020), upper primary enrolment ratio (89.6%), dropout (3.6%), pupils per teacher (17), and schools with internet (67.4%). The CSVs still use the existing-structure booklet. Table 1 supplies the national trend, Tables 6.1, 6.13 and 4.12 supply the state ratios, and Tables 2.5, 8.6 and 8.8 supply school facilities. The internet rate also has PIB confirmation.

PIB's secondary enrolment ratio (71.7%), dropout (7.0%) and pupils per teacher (21) agree with Table 1 of the NEP booklet for classes 9 to 12. The existing-structure values for classes 9 and 10 are 81.5%, 9.5% and 15. PIB gives 95.0% for schools with an electricity connection and 98.5% for schools with girls' toilets. The existing-structure facilities CSV uses the functional measures, 93.5% and 95.8% for India.

The AISHE final report list still starts at 2023-24. The final report, GER time series, PLFS literacy report and Census Primary Census Abstract match the 17 Nov checksums.

| Release or file checked | Release date | URL | Fetched | SHA-256 |
| --- | --- | --- | --- | --- |
| UDISE+ 2025-26 booklet, existing structure | 7 Jul 2026 | https://dashboard.udiseplus.gov.in/report2026/static/media/UDISE+2025_26_Booklet_existing.edd7cd16d934a10377ba.pdf | 18 Nov 2026 | `f20bfc4296acdb0f84a36f65587002c7899272ea67b6d91497a172a76982d9c4` |
| UDISE+ 2025-26 booklet, NEP structure | 7 Jul 2026 | https://dashboard.udiseplus.gov.in/report2026/static/media/UDISE+2025_26_Booklet_nep.94ceae1e8c2210549d21.pdf | 18 Nov 2026 | `d212a8c04deb55689bae658e49c65cee4b7ed6190dfa604df5a09ae0702c408c` |
| PIB PRID 2282141, English release | 7 Jul 2026, 6:10 pm IST | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2282141&reg=48&lang=1 | 18 Nov 2026 | `a1eeee49e575fb3e87f62427ae0663f056cb51e7a6fc39eb1a3f6f4a959c2011` |
| AISHE Final Report 2023-24 | 8 Jul 2026 | https://cdnbbsr.s3waas.gov.in/s392049debbe566ca5782a3045cf300a3c/uploads/2026/07/202607131602421770.pdf | 18 Nov 2026 | `2f99b6cfd00c1131620be85f41ed3f57a433b81cb0ce0906dbf5ac11874b7fa9` |
| AISHE final report list | Live list | https://aishe.gov.in/aishe-final-report/ | 18 Nov 2026 | `76891e08f340198d6f4eda5cb2cf4c06b982eb06bd611250f27c37a3d3c86636` |
