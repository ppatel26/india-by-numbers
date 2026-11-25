# Education

Data for the India by Numbers "Education" topic. School data come from UDISE Flash Statistics (NIEPA and Ministry of Education) and UDISE+ (Ministry of Education, Department of School Education and Literacy). Higher education data come from the All India Survey on Higher Education (AISHE, Ministry of Education). Literacy comes from the PLFS 2025 survey (MoSPI) and the Census 2011 full count (ORGI).

Read on 17 Nov 2026.

## Questions this topic answers

1. How many children are in school, and how far do they get?
2. Which states keep children in school to class 12, and where do the most drop out?
3. Do schools have enough teachers, electricity, toilets for girls and internet?
4. How many young adults go on to college, and do more women go than men?
5. How many Indians can read and write?
6. What do families spend on school, and how many students go to government schools or take coaching?
7. How many years of schooling do adults have?

## About the sources

- **UDISE+** is an administrative census of schools. Schools upload their own data. The reference date for 2025-26 is 31 March 2026. From 2022-23, UDISE+ collects data for each student, not school totals. The booklet says the ratios are "strictly not comparable" with figures up to 2021-22. Population projections used for the ratios were also revised.
- UDISE+ 2025-26 comes in two layouts: the existing structure (primary 1-5, upper primary 6-8, secondary 9-10, higher secondary 11-12) and the NEP 2020 structure (foundational, preparatory, middle, secondary). These files use the **existing structure**, so they line up with earlier years. NEP-structure figures (for example "secondary GER 71.7%", which covers classes 9 to 12) are different measures. Do not mix the two.
- **Gross enrolment ratio (GER)** is enrolment at a level, of any age, divided by the population of the official age for that level. It can exceed 100.
- **AISHE** is a survey of higher education institutions. Institutions submit data voluntarily. GER for 2023-24 uses population projections based on Census 2011, age 18-23.

## Charts

### edu-1 School enrolment and dropout in India, 2012-13 to 2025-26

- Three line charts show enrolment, GER and dropout by level. Method breaks start in 2018-19 and 2022-23. The lines stop at each break.
- The India totals give students, gross enrolment ratios and dropout rates in per cent.
- File: `education-school-trend-india.csv`.
- Sentence: "In 2025-26, 24.72 crore children were enrolled from pre-primary to class 12, slightly more than the 24.69 crore of 2024-25. Primary enrolment (classes 1 to 5) fell to 10.19 crore, from 10.44 crore in 2024-25."
- Use UDISE Flash Statistics through 2017-18. Use UDISE+ Tables 3.1, 5.1 and 5.13 for 2018-19 to 2020-21. Use Table 1, "National Highlights", for 2021-22 to 2025-26. The chart converts counts to crore. The CSV keeps all published digits and records the source kind for each row.

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

### edu-9 Spending per school student by level and type of school

- Type: grouped bars (`school-spending-by-level-and-type`). Series: government, private aided, private unaided (recognised), all schools. Rows: five levels and all levels.
- Unit: rupees per student in the current academic year, at the prices of the survey (April to June 2025). Not deflated. Geography: India, rural and urban together. Period: 2025.
- File: `education-spending-per-student.csv`.
- Sentence: "In 2025 families spent ₹12,616 on average for each school student in the academic year. The figure was ₹2,863 in government schools and ₹28,693 in private unaided schools."
- Source: eSankhyiki API, NSS round 80, survey code 2, indicators 30, 31 and 32. Checked against NSS Report No. 595, Statements 2.3, 2.4 and 2.5.

### edu-10 Spending per school student by state

- Type: tile map and ranked bars (`school-spending-by-state`), with a state-profile row.
- Unit: rupees per student. Geography: all 36 states and UTs plus India. Period: 2025.
- File: `education-spending-per-student.csv` (level `all levels`, school type `all`, sex `person`, sector `rural+urban`).
- Sentence: "Among states, spending per student ranged from ₹5,656 in Bihar to ₹25,720 in Haryana. Chandigarh had the highest value of any state or UT, ₹49,711."
- Source: API indicator 30. Checked against NSS Report No. 595, Table 5.1.

### edu-11 Students in government schools by state

- Type: tile map and ranked bars (`government-school-share-by-state`), with a state-profile row.
- Unit: per cent of students from pre-primary to class 12. Geography: all 36 states and UTs plus India. Period: 2025.
- File: `education-school-type-by-state.csv`.
- Sentence: "Government schools taught 55.9% of students. The share was 81.7% in Bihar and 15.3% in Goa."
- Source: API indicator 24. Checked against NSS Report No. 595, Statement 1.2 and Table 2.

### edu-12 Students who take private coaching by state

- Type: tile map and ranked bars (`private-coaching-by-state`).
- Unit: per cent of students. Geography: all 36 states and UTs plus India. Period: 2025.
- File: `education-private-coaching.csv`.
- Sentence: "In 2025, 27.0% of school students took private coaching. In Tripura the share was 78.6%, and in West Bengal 74.6%."
- Source: API indicator 38. Checked against NSS Report No. 595, Statement 3.1 and Table 11.

### edu-13 Mean years of schooling by state, age 25 and over

- Type: tile map and ranked bars (`mean-years-of-schooling-by-state`), with a state-profile row.
- Unit: years. Geography: all 36 states and UTs plus India. Period: 2022-23 (July 2022 to June 2023).
- File: `education-mean-years-schooling-by-state.csv` (ages 15+ and 25+; the chart shows 25+).
- Sentence: "In 2022-23 adults aged 25 and over had spent 7.5 years in school or college on average. Goa had 11.6 years. Andhra Pradesh and Rajasthan had 6.1."
- Source: eSankhyiki API, NSS round 79, survey code 1, indicator 3. Checked against NSS Report No. 590 (CAMS 2022-23), Table 3.

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
| MoSPI NSO | NSS Report No. 595, Comprehensive Modular Survey: Education, 2025 (NSS round 80) | 26 Aug 2025 (PDF created 26 Aug 2025; PIB release 2160863 of the same day, which returns HTTP 403 to scripts) | April to June 2025 | https://www.mospi.gov.in/uploads/publications_reports/publications_reports1757588642898_9ba30fe0-3677-478c-8d53-9a0d2ba107f0_CMS_E_2025L.pdf | 25 Nov 2026 | Not stated | 090c9fca5d11726b9696068dd5c2c9d3f355943c6534e77b3145611c0adfdd2b |
| MoSPI NSO | eSankhyiki API, NSS round 80, survey code 2 (CMS: Education), 18 indicators | Not stated by the API | April to June 2025 | https://api.mospi.gov.in/api/nss-80/getNss80Records (see "NSS education surveys" below) | 25 Nov 2026 | Not stated | See below |
| MoSPI NSO | NSS Report No. 590, Comprehensive Annual Modular Survey (CAMS), 2022-23 (NSS round 79) | 9 Oct 2024 (PDF created 9 Oct 2024) | July 2022 to June 2023 | https://www.mospi.gov.in/sites/default/files/publication_reports/CAMS%20Report_October_N.pdf | 25 Nov 2026 | Not stated | 5a73af6e4504e6a90b35cfb426100a1c2eba849233f267ddc0f90681404b7163 |
| MoSPI NSO | eSankhyiki API, NSS round 79, survey code 1 (CAMS), indicator 3 | Not stated by the API | July 2022 to June 2023 | https://api.mospi.gov.in/api/nss-79/getNss79Records?indicator_code=3&survey_code=1&Format=JSON | 25 Nov 2026 | Not stated | See below |

Raw downloads are not kept in the repository; the URL and sha256 above identify each file. The parsing script is `pipeline/education/build_education.py`. PDFs were turned into text with `pdftotext -layout` (`pipeline/education/extract_text.sh`).

### National school trend inputs

Read on 18 Nov 2026. The Ministry of Education, Department of School Education and Literacy, publishes the eight UDISE+ annual reports below. These rows have source kind `official`. Keep one raw file per directory under `raw/education/`.

| Release | Release date | Path under `raw/education/` | URL | SHA-256 |
| --- | --- | --- | --- | --- |
| UDISE+ 2018-19 report | Not stated. The DOCX was first printed on 2 Jul 2021 and last modified on 4 Jul 2022. | `udise-plus-2018-19/booklet.docx` | https://dashboard.udiseplus.gov.in/report2026/static/media/UDISE+2018_19_Booklet.61e6bf9d5e445574ee1d.docx | `27e729e05c8b1534ae70e1a6e4fee117452da07ce5c307d05e0e9a7848e1a212` |
| UDISE+ 2019-20 report | 2021 (PDF dated 8 Jul 2021) | `udise-plus-2019-20/booklet.pdf` | https://dashboard.udiseplus.gov.in/report2026/static/media/UDISE+2019_20_Booklet.2fea294ea7332fcb5f0c.pdf | `8a5d257e2374326e6f598d1174e8cea2d02b75a5a0f64ccf47ee3c7f8ce6487a` |
| UDISE+ 2020-21 report | 2022 (PDF dated 22 Feb 2022) | `udise-plus-2020-21/booklet.pdf` | https://dashboard.udiseplus.gov.in/report2026/static/media/UDISE+2020_21_Booklet.2cfe0df9249cc690d12d.pdf | `d24acf1be2fa867a7bc09ba089389393b969d27983d83729fb0819cf717db639` |
| UDISE+ 2021-22 booklet | 3 Nov 2022 | `udise-plus-2021-22/booklet.pdf` | https://dashboard.udiseplus.gov.in/report2026/static/media/UDISE+2021_22_Booklet.f55c1a60ed700e6c7892.pdf | `eeac0c2dcb98b224604c291b080935d98b26c119142dd98163a4c5b6182db6b5` |
| UDISE+ 2022-23 booklet, existing structure | 30 Dec 2024 | `udise-plus-2022-23/booklet.pdf` | https://dashboard.udiseplus.gov.in/report2026/static/media/UDISE+2022_23_Booklet_existing.d209e7c7516d77939da9.pdf | `59884f936772bc79ac7f007ae0f8330311c85b4f5cf748d6834672c0be8f08e6` |
| UDISE+ 2023-24 booklet, existing structure | 30 Dec 2024 | `udise-plus-2023-24/booklet.pdf` | https://dashboard.udiseplus.gov.in/report2026/static/media/UDISE+2023_24_Booklet_existing.309eabf9e4889db93bcb.pdf | `6a54fbf78e0ea7158aeeba568066a179aa133736e3bd9102c2c9e352bece71ac` |
| UDISE+ 2024-25 booklet, existing structure | 28 Aug 2025 | `udise-plus-2024-25/booklet.pdf` | https://dashboard.udiseplus.gov.in/report2026/static/media/UDISE+2024_25_Booklet_existing.118ba29d4773e6372f72.pdf | `cc66d03e1413722d2f5ab66f29ece3cdb3c21f7d736ac63f21efc3696ed7f4bf` |
| UDISE+ 2025-26 booklet, existing structure | 7 Jul 2026 | `udise-plus-2025-26/booklet.pdf` | https://dashboard.udiseplus.gov.in/report2026/static/media/UDISE+2025_26_Booklet_existing.edd7cd16d934a10377ba.pdf | `f20bfc4296acdb0f84a36f65587002c7899272ea67b6d91497a172a76982d9c4` |

From the repository root, run `python3 -I pipeline/education/build_school_trend.py` to write
`education-school-trend-india.csv`. The script reads Word table XML and uses `pdftotext -layout`
for the PDFs. The full education pipeline runs the same script.

### Historical school trend inputs

NIEPA, then called NUEPA, and the Ministry of Education, then called the Ministry of Human Resource
Development, published the Flash Statistics. Each historical row has source kind `archived copy`.
The archive timestamp is part of each capture URL. Read all files in this section on 18 Nov 2026.

| Release | Use | Path under `raw/education/` | Original URL | Capture URL | SHA-256 |
| --- | --- | --- | --- | --- | --- |
| DISE 2012-13 Elementary Flash Statistics (2013) | Enrolment p. 27 and GER p. 36, classes 1 to 8 | `flash-2012-13-elementary/report.pdf` | http://udise.in/Downloads/Publications/Documents/Flash%20Statistics%202012-13.pdf | https://web.archive.org/web/20220121184043id_/http://udise.in/Downloads/Publications/Documents/Flash%20Statistics%202012-13.pdf | `a2ce32d1c5bcac61967c68125fcd5601c253be7d77428d96c9261ffbf534f69d` |
| UDISE 2012-13 Secondary Flash Statistics (2013) | Enrolment p. 18 and GER p. 30, classes 9 to 12 | `flash-2012-13-secondary/report.pdf` | http://udise.in/Downloads/Publications/Documents/SEMIS-FLASH-Statistics-2012-13.pdf | https://web.archive.org/web/20220121184114id_/http://udise.in/Downloads/Publications/Documents/SEMIS-FLASH-Statistics-2012-13.pdf | `7b290729d7f7f260ee9f365e33393817146ac29106a7e57e0ad96773bcee9d11` |
| UDISE 2013-14 Flash Statistics (Jul 2014) | Enrolment Table 3.2, GER Table 3.17, dropout Table 3.15 for 2012-13 | `flash-2013-14/report.pdf` | http://udise.in/Downloads/Publications/Documents/U-DISE-SchoolEducationInIndia-2013-14.pdf | https://web.archive.org/web/20220119021654id_/http://udise.in/Downloads/Publications/Documents/U-DISE-SchoolEducationInIndia-2013-14.pdf | `75958bd596261a36b4e8bc460ccb42e55571c7c764d7d0923a248dcbb5a10927` |
| UDISE 2014-15 Flash Statistics (2015) | Enrolment Table 3.2, GER Table 3.26, dropout Table 3.19 for 2013-14 | `flash-2014-15/report.pdf` | http://www.dise.in/Downloads/Publications/Documents/U-DISE-SchoolEducationInIndia-2014-15.pdf | https://web.archive.org/web/20220214122726id_/http://www.dise.in/Downloads/Publications/Documents/U-DISE-SchoolEducationInIndia-2014-15.pdf | `fb2749a16f4daa154fe669d3236cbf9d8ae76bc25b8725c0f6f53d4022ea3e6a` |
| UDISE 2015-16 Flash Statistics (2016) | Enrolment Table 3.2, GER Table 3.28, dropout Table 3.20 for 2014-15 | `flash-2015-16/report.pdf` | http://udise.in/Downloads/Publications/Documents/U-DISE-SchoolEducationInIndia-2015-16.pdf | https://web.archive.org/web/20201222145336id_/http://udise.in/Downloads/Publications/Documents/U-DISE-SchoolEducationInIndia-2015-16.pdf | `439525e900e1587ce601977d03657d776c08685b5f803343e013f5408f881749` |
| UDISE 2016-17 Flash Statistics (2018) | Enrolment Table 1.31, GER Table 1.41, dropout Table 1.52 for the 2015-16 cohort | `udise-2016-17-wayback-2020/report.pdf` | http://udise.in/Downloads/Publications/Documents/Flash_Statistics_on_School_Education-2016-17.pdf | https://web.archive.org/web/20201228051951id_/http://udise.in/Downloads/Publications/Documents/Flash_Statistics_on_School_Education-2016-17.pdf | `e7d40520fad3eac4da8c868bf6e38fa6df1d106dad0b8a0bf11311241b8b2f76` |
| UDISE 2017-18 Flash Statistics, provisional (2020) | Enrolment Table 1.31, GER Table 1.41, dropout Table 1.52 for the 2016-17 cohort | `flash-2017-18-provisional/report.pdf` | http://udise.in/Downloads/Publications/Documents/Flash_Statistics_on_School_Education-2017-18_Provisional.pdf | https://web.archive.org/web/20210410164422id_/http://udise.in/Downloads/Publications/Documents/Flash_Statistics_on_School_Education-2017-18_Provisional.pdf | `b14c034ed03653ae1c2506cf6d4b3ce8a2dfe0df563b3969cfc0757d76f65073` |

The files below support discovery or checks. They supply no CSV rows.

| File | Source kind | Path under `raw/education/` | Original URL, where known | URL read | SHA-256 |
| --- | --- | --- | --- | --- | --- |
| UDISE Flash Statistics index | archived copy | `flash-publication-index/index.html` | http://udise.in/flash.htm | https://web.archive.org/web/20230109081523id_/http://udise.in/flash.htm | `a6b7686f86e28c61fd7aaf4e0e5dbcb3ad74b23c2ec701606fc51bc11a14d792` |
| NIEPA October 2026 publications catalogue, PDF p. 38 links the UDISE report | official | `niepa-publications-catalogue/report.pdf` | https://www.niepa.ac.in/download/Publications/2026/PUBLICATIONS_CATALOGUE_as_on_Oct%202026.pdf | Same as original | `9b2240de162e9700305409ce08adc125528cc72f5df081f6479dfbf949bed692` |
| UDISE 2017-18 Flash Statistics, as linked by NIEPA | third-party copy | `udise-2017-18-copy/report.pdf` | http://udise.in/Downloads/Publications/Documents/Flash_Statistics_on_School_Education-2017-18_Provisional.pdf | https://educationforallinindia.com/wp-content/uploads/2021/04/School-Education-in-India-Flash-Statistics-2017-18-NIEPA.pdf | `b14c034ed03653ae1c2506cf6d4b3ce8a2dfe0df563b3969cfc0757d76f65073` |
| UDISE 2014-15 Flash Statistics, second capture | archived copy | `flash-2014-15-udise/report.pdf` | http://udise.in/Downloads/Publications/Documents/U-DISE-SchoolEducationInIndia-2014-15.pdf | https://web.archive.org/web/20220119014147id_/http://udise.in/Downloads/Publications/Documents/U-DISE-SchoolEducationInIndia-2014-15.pdf | `fb2749a16f4daa154fe669d3236cbf9d8ae76bc25b8725c0f6f53d4022ea3e6a` |
| DISE 2014-15 Elementary Flash Statistics | archived copy | `flash-2014-15-elementary/report.pdf` | http://udise.in/Downloads/Publications/Documents/ElementaryFlash2014-15.pdf | https://web.archive.org/web/20220119061652id_/http://udise.in/Downloads/Publications/Documents/ElementaryFlash2014-15.pdf | `c8602a698f1f2d38de89d29481ae87742c80239ac02b29c8329ca4073955c198` |
| UDISE 2014-15 Secondary Flash Statistics | archived copy | `flash-2014-15-secondary/report.pdf` | http://udise.in/Downloads/Publications/Documents/SecondaryFlash%20Statistics-2014-15.pdf | https://web.archive.org/web/20220120060021id_/http://udise.in/Downloads/Publications/Documents/SecondaryFlash%20Statistics-2014-15.pdf | `9ffa3bfdf07fb9fced9d7b21ce1b780f17742c2ba46ecd88b5f587fc821cc966` |
| Ministry of Education, Educational Statistics at a Glance 2018 (ESAG) | archived copy | `esag-2018/report.pdf` | https://www.education.gov.in/sites/upload_files/mhrd/files/statistics-new/ESAG-2018.pdf | https://web.archive.org/web/20210323135145id_/https://www.education.gov.in/sites/upload_files/mhrd/files/statistics-new/ESAG-2018.pdf | `6a6bfa9a18b68618d29dc41956fcabe0340428a54c14274d79a397218c6ac402` |
| Ministry of Education, Educational Statistics at a Glance 2014 | third-party copy | `esag-2014-copy/report.pdf` | Unknown | https://www.educationforallinindia.com/educational_statistics_at_glance-MHRD_2014.pdf | `e5f1cbabdb419bed7d87bd44006bc50f2f8c455bec2180ca481068fba2cbd677` |
| Statistics on Education, MoSPI technical paper by Tilak, Panchamukhi and Biswal | official host | `mospi-education/report.pdf` | https://www.mospi.gov.in/sites/default/files/reports_and_publication/technical_paper/Them_Paper_Education.pdf | Same as original | `f42d891fe573eb8aa58cdaa7a9a91e7a6b1f93dbaf6eee561173895cb5e30aee` |

### Historical overlap checks

- **Copies.** The 2017-18 archived PDF matches the NIEPA catalogue's third-party PDF byte for byte.
  Both captures of the combined 2014-15 report also match byte for byte.
- **Enrolment.** The 2014-15 elementary and secondary reports agree with the combined report
  across the four levels. The 2016-17 and 2017-18 reports restate all four counts for 2014-15
  and 2015-16 exactly. The 2017-18 report also restates all four 2016-17 counts exactly.
  The 2016-17 national count for classes 11 and 12 includes the publisher's estimates for Andhra
  Pradesh and Karnataka. The two states lacked complete returns for those classes.
- **Enrolment against Ministry summaries.** Chart 1 of UDISE+ 2019-20 gives 13.5, 6.5, 3.5 and
  2.0 crore for 2012-13. These agree with the Flash Statistics after rounding to one decimal
  crore. ESAG 2018 Table 27A rounds to lakh. For 2012-13 it gives 650 lakh in upper primary and
  200 lakh in higher secondary. The Flash counts round to 649 lakh and 199 lakh. For 2013-14
  it gives 664 lakh in upper primary. The Flash count rounds to 665 lakh. The other 13 counts
  for 2012-13 to 2015-16 agree at the table's precision.
- **GER.** ESAG 2018 Table 29A agrees with all 16 Flash Statistics totals for 2012-13 to
  2015-16 after rounding to one decimal place. ESAG Table 40 also agrees with all 12 totals
  for 2013-14 to 2015-16 at two decimals. The provisional 2013-14 figures in ESAG 2014
  Tables 6A and 7 differ from the later Flash Statistics figures at all four levels. The 2016-17
  and 2017-18 retrospectively report 2014-15 GER as 99.89, 90.26, 76.91 and 52.54 and 2015-16
  GER as 99.02, 91.82, 79.30 and 55.73. These differ from the annual editions, so the CSV uses
  the values from the edition for each year. The two later reports give the same 2016-17 GER.
  The retrospective UDISE+ 2019-20 text gives different 2012-13 GER values at all four levels
  (primary above 109%, then 84.1%, 69.2% and 40.1%). It does not explain the differences.
- **Dropout.** ESAG 2018 Table 32A agrees with all nine primary to secondary values for the
  2012-13 to 2014-15 cohorts in the 2013-14, 2014-15 and 2015-16 Flash Statistics.
  ESAG 2014 Table 10 gives cumulative dropout from class 1. The chart uses annual rates for each level.
- **Dropout dates.** The 2014-15 Flash Statistics use 2013-14 enrolment and 2014-15 repeaters.
  They label rates by the cohort start, 2013-14. Table 1.52 of both later Flash editions labels
  the same four national values (4.34, 3.77, 17.86 and 1.54) as 2014-15. It labels the 2014-15
  cohort's values (4.13, 4.03 and 17.06, with a dash for higher secondary) as 2015-16.
  The 2015-16 Flash Statistics Table 3.20 and 2017-18 Table 5.25 also match under these different
  year labels for the Andaman and Nicobar Islands and Andhra Pradesh. The 2016-17 edition and
  2017-18 edition give the same national totals in their 2016-17 row. Use the cohort start year
  for these UDISE rates. Keep the printed row year in the `table` column where it differs.
- **UDISE+ starts in 2018-19.** The 2017-18 Flash Statistics end with 2017-18 data. They supply
  no 2018-19 values for a direct overlap with UDISE+. Chart 1 in the 2019-20 UDISE+ report
  restates all four 2018-19 counts to one decimal crore. They agree with Table 3.1 of the 2018-19
  report at that precision.

### Historical access and gaps

- The original UDISE file links in the archived index return HTTP 404 after the HTTPS redirect.
  Direct requests to the old DISE host for the 2015-16 and 2016-17 reports return parking pages.
  The NIEPA publications page and catalogue give no NIEPA-hosted copy of the 2017-18 report.
  A guessed NIEPA file path for 2016-17 returns 404. The old school report cards publications
  list also returns 404. http://schoolreportcards.in/SRC-New/Links/DISEPublication.aspx
- The Ministry's statistics listing, linked older tables and candidate ESAG PDFs on
  education.gov.in return HTTP 403. The dsel.education.gov.in statistics list and candidate ESAG
  path return 404. The new DoSE&L and Higher Education sites and the Goa statistics page return
  HTTP 403. The old Higher Education subdomain fails DNS. PIB returns HTTP 403.
  https://www.education.gov.in/en/statistics-new
  https://www.education.gov.in/hi/statistics-new?shs_term_node_tid_depth=394&Apply=Apply
  https://dsel.education.gov.in/statistics
  https://www.dsel-education.gov.in/statistics
  https://education.goa.gov.in/statistical-publications/
- The UDISE+ archive and microdata catalogue timed out in the earlier check. The dashboard's
  archive page loads and links to UDISE+ reports from 2019-20. The Rajasthan mirror for 2013-14
  and the Ministry of Tribal Affairs statistics PDF time out. The NITI Aayog report returns
  HTTP 403. The MoSPI technical paper predates these years.
  https://data.udiseplus.gov.in/archive
  https://microdata.udiseplus.gov.in/
  https://dashboard.udiseplus.gov.in/udiseplus-archive/
  https://rajsmsa.nic.in/public/Documents/21-04-2015-160339~U-DISE_2013-14.pdf
  https://tribal.nic.in/ST/Statistics8518.pdf
  https://www.niti.gov.in/sites/default/files/2026-05/School-Education-System-in-India.pdf
- Internet Archive CDX requests timed out or failed to complete. The Wayback availability
  API found the snapshots above. The 2015-16 capture dated `20261115130506` and the 2016-17
  capture dated `20250425091931` contain HTML. The alternate 2017-18 capture dated
  `20220408235321` did not complete. The availability API found no capture for the candidate
  2017-18 path without the provisional suffix. The archived 2014-15 elementary and secondary
  editions and both ESAG editions provided checks. The NIEPA-linked copy confirms the
  archived 2017-18 report. General web searches and the third-party UDISE publications list
  provided links and no additional cohort rates. https://archive.org/wayback/available
  https://educationforallinindia.com/u-dise-publications/
- Dropout for the 2017-18 cohort remains unverified for all levels. It requires a return for the
  following year, when UDISE+ already used online collection. The 2017-18 Flash Statistics
  stop with 2017-18 returns. The UDISE+ report publishes its own 2018-19 rates. The original
  Ministry links, archived Flash Statistics, ESAG, official mirror leads and the
  NIEPA-linked copy above supplied no separate comparable value. Higher secondary dropout is
  also absent in 2012-13 and 2014-15. The relevant national totals show a dash. The UDISE+
  series gives annual rates through class 10.

## NSS education surveys (CMS: Education 2025, CAMS 2022-23)

Read on 25 Nov 2026. The API pages were fetched between 20:09 and 20:17 UTC with
`pipeline/education/fetch_nss.py`. The reports were fetched with `pipeline/common/fetch.sh`.

- **API routes.** The eSankhyiki documentation page lists NSS rounds 77 and 78 only. Rounds 79 and 80
  answer at `https://api.mospi.gov.in/api/nss-<round>/getNss<round>Records?indicator_code=<n>&survey_code=<s>&Format=JSON&limit=200&page=<p>`.
  The API refuses a `limit` above 200. Round 80 has an indicator list at
  `/api/nss-80/getIndicatorList?survey_code=2` (18 indicators, codes 23 to 42). Round 79 has no list
  route: the script tried codes 1 to 40, and codes 1 to 28 return data. Code 3 is mean years of schooling.
  Round 80, survey code 1, is a different survey (mobile phone and internet use); it is not used here.
- **Reports.** NSS Report No. 595 (186 pages) and NSS Report No. 590 (195 pages), saved as
  `cmse-2025/report.pdf` and `cams-2022-23/report.pdf`. The text is in `work/education/<folder>/report.txt`
  (`pdftotext -layout`).
- **PIB.** PIB release 2160863 (26 Aug 2025) returns HTTP 403 to curl and to headless Chromium. It was
  not read. The report PDF carries the same date.

| File under `raw/education/` | Indicator | Records | Pages | SHA-256 |
| --- | --- | --- | --- | --- |
| `nss79/i3.json` | Mean years of schooling in formal education | 666 | 4 | `040eaef71ada35b2436d6639ad4d139bb7bb85d92b4e3b5069cd0e1c11e7e71d` |
| `nss80/indicators.json` | Indicator list | 18 | 1 | `bb0a98df1698239000a9e67c49f1e5997ae13a9da8a4f2bcf95b26051c999405` |
| `nss80/i23.json` | Distribution of students enrolled in school education by level of current enrolment | 1665 | 9 | `cdd5112005d6ae4e6511ae79811907d5d9183c5c78e7dc52c2d2c9157f02c29b` |
| `nss80/i24.json` | Distribution of students currently enrolled in school education by type of school | 1332 | 7 | `05871d67fc18e140aaccfdff5cf871291f63c940bca94cbe18ba583ac1938ff5` |
| `nss80/i25.json` | Distribution of students currently enrolled in school education | 6660 | 34 | `1c87e87bc9283da6a024b80565e83798a4ba3dc53ca975b090eeb5ed6490e184` |
| `nss80/i28.json` | Percentage of students reported expenditure on course fees by level of current enrolment | 1998 | 10 | `f9b19ed0a4240d8e03e4ff1a9cc1c6307de1bb5fb52b25bcadc9f7e9be7622eb` |
| `nss80/i29.json` | Percentage of students reported expenditure on course fees by type of school | 1998 | 10 | `85090621e0c58f4b5f8e6f02b9c90b392c1ddc897ee0d345d2ffd22baee064d8` |
| `nss80/i30.json` | Average expenditure (₹) per student on school education by level of current enrolment | 1998 | 10 | `565d4d67ed60a862370947a0d120b46980ab97efb4f28bc969d72fb93e3fa4d1` |
| `nss80/i31.json` | Average expenditure (₹) per student on school education by type of school | 1998 | 10 | `6a31b8ad89933143b6fd8ba7ac8a207a64fbc5542edc254c7ef4d37118b17695` |
| `nss80/i32.json` | Average expenditure (₹) per student on school expenditure during the current academic year | 2220 | 12 | `8a5f41623ed4938ab396f25b97e7bbfe1606923b973100ec0477a4be1da90f30` |
| `nss80/i33.json` | Average expenditure (₹) per student on school education by items of expenditure | 1998 | 10 | `e767f5b2bcc5c6897640bb29fad43a3f7b323e66e6e1a51fb5dc839e40612e1b` |
| `nss80/i34.json` | Average expenditure (₹) per reported student on school education by level of current enrolment | 1998 | 10 | `cd0aa2d90cab61aa7a3a183b5dd4f5b6b25d0277eef63c13096e3580e68e1611` |
| `nss80/i35.json` | Average expenditure (₹) per reported student on school education | 1998 | 10 | `c5c373cf00d33cbccaee3eb7b091e7833c78ba725053b1a1424d8bcb19def8ca` |
| `nss80/i36.json` | Average expenditure (₹) per reported student on school expenditure during the current academic year by type of school for each level of enrolment | 2220 | 12 | `d82dbdbd4b03ca9205e4c6c3070df12dbe0a387bd83e15b9f6d8a91223e2577b` |
| `nss80/i37.json` | Average expenditure (₹) per reported student in school education | 1998 | 10 | `a43f35a5896bd31e8c00bf69a1e23867093b965e67a9eee4f8cf7f78b1b2990b` |
| `nss80/i38.json` | Percentage of students who were taking/had taken private coaching during the current academic year | 1998 | 10 | `3b362d21771202df11e7598349c6e31e363d814c5cdd1a5659f3367a0b2e872c` |
| `nss80/i39.json` | Average expenditure (₹) on private coaching per student during the current academic year by level of current enrolment | 1998 | 10 | `6f086c4ed169196a9ec5b2456a6ed46cc3443d9481161944d7e059497168164b` |
| `nss80/i40.json` | Average expenditure (₹) on private coaching per reported student during the current academic year by level of current enrolment | 1998 | 10 | `0474b43f90f6730e78e8970db55a874935900529dccc323a58c03975bb9255dc` |
| `nss80/i41.json` | Percentage of students reported a single source of funding for their educational expenses and distribution of the first major source of funding for education expenditure | 1998 | 10 | `f3b0e43e1657239e12910647c24cafabb716afe4e38f59f2a0dbc340a39dd9e8` |
| `nss80/i42.json` | Percentage of households reporting erstwhile members currently attending school education along with average expenditure (₹) incurred per household and their distribution by number of such erstwhile members | 666 | 4 | `536663b024bc7161bd438f8533c8ceec1c4d14e309607bce1d1d9c6af27667b4` |

### How the CSVs are made

Run, from the repository root:

```sh
python3 -I pipeline/education/fetch_nss.py --raw raw/education/nss80 --round 80 --survey 2
python3 -I pipeline/education/fetch_nss.py --raw raw/education/nss79 --round 79 --survey 1 --scan 40
pipeline/common/fetch.sh --raw raw/education/cmse-2025 <report URL above> report.pdf
pipeline/common/fetch.sh --raw raw/education/cams-2022-23 <report URL above> report.pdf
pipeline/education/extract_text.sh
python3 -I pipeline/education/build_cmse.py
```

| CSV | API indicators | Report tables | Rows |
| --- | --- | --- | --- |
| `education-spending-per-student.csv` | 30 (by level), 31 (by type of school, all levels), 32 (level by type, persons only) | Statements 2.3, 2.4, 2.5; Tables 5.1, 5.2, 6 | 5,883 |
| `education-school-type-by-state.csv` | 24 | Statement 1.2; Table 2 | 1,332 |
| `education-private-coaching.csv` | 38 | Statement 3.1; Table 11 | 1,998 |
| `education-mean-years-schooling-by-state.csv` | Round 79, indicator 3 | Report 590, Table 3 | 666 |

Columns: `level` (pre-primary, primary, middle, secondary, higher secondary, all levels), `school_type`
(government, private aided, private unaided (recognised), others, all non-government, all), `sex`
(male, female, person), `sector` (rural, urban, rural+urban), `unit` (rupees per student in the current
academic year; per cent of students; years), `api_indicator`, `report_table`. Indicator 32 has no sex
split, so its rows carry `person`. Indicator 31's "All" rows equal indicator 30's "All Levels" rows
(the script checks this) and are left out.

### Checks done on 25 Nov 2026

`build_cmse.py` compares the API values with the report text and stops on any difference.

- Every cell (9 columns by 37 rows) of every page of Table 5.1 (6 pages), Table 5.2 (6 pages),
  Table 2 (4 pages) and Table 11 (6 pages) of Report 595: 7,326 values. All agree. The all-India
  rows of these tables are Statements 2.3, 2.4, 1.2 and 3.1.
- All 60 values of Statement 2.5 (all-India spending by level and type of school). All agree.
- Both pages of Table 3 of Report 590 (ages 15+ and 25+): 666 values. All agree.
- Three values on the built page, read against the report: Bihar ₹5,656 (Table 5.1, all levels),
  Bihar 81.7% in government schools (Table 2), Bihar 52.5% taking coaching (Table 11). India: ₹2,863
  in government schools (Statement 2.4), 55.9% (Statement 1.2), 27.0% (Statement 3.1), 7.5 years
  (Report 590, highlight 02 and Table 3).
- Table 6 (state spending by level and type of school) is not checked cell by cell. Its all-India
  values (Statement 2.5) are.

### Decisions

- **Digits.** The API drops trailing zeros: it gives `27` where the report prints 27.0. For indicators
  24, 38 and round 79 indicator 3, where the report prints one decimal in every cell, the script
  prints one decimal. It stops if the API gives more digits. Rupee values are whole numbers in both.
- **Prices.** Spending is in rupees at the prices of the survey. It is not deflated.
- **Period.** The CMS: Education fieldwork ran from April to June 2025. Spending covers the current
  academic year, paid or due. The CSVs label the period `2025`. CAMS covers July 2022 to June 2023,
  labelled `2022-23`.
- **Missing values.** The report and the API print `-` (no sample observation), for example rural
  Chandigarh. The CSVs leave these empty.
- **Source records.** Each chart names the report (dated) and the API (release date not stated).
- **Name.** The site copy writes "CMS: Education 2025" and "CAMS 2022-23". The content tests reject
  the word in the full survey names.
- **CAMS chart.** Report 590 also gives ICT skills by state (indicators 21 to 23, for example copy and
  paste or sending email, ages 15-24). Mean years of schooling at age 25 and over is the clearest
  single education measure, so it is the only CAMS chart here. The education page now has 13 charts.
  The ICT and other CAMS indicators are left for the planned living standards topic.
- **Two state charts for chart 3.** The government share and the coaching share are different
  measures, so each gets its own `states` chart, not one chart with two series.
- **Ranks.** Spending, the government share and the coaching share have no `better` end, so state pages
  show their rank without calling it good or bad. Mean years of schooling uses `better: 'high'`.
- **Others.** The bars chart leaves out "Others" (unrecognised private and other schools, 0.8% of
  students). The CSV keeps it.

### Gaps and cautions

- **Not for state estimates.** Report 595, section 1.7: "The survey was not designed for the
  generation of sub-national level estimates." RSE Table 1 gives relative standard errors above 25% for
  all-levels spending in Arunachal Pradesh (25.34), Chandigarh (25.18), Dadra and Nagar Haveli and
  Daman and Diu (44.99), Ladakh (27.77), Lakshadweep (26.11) and Puducherry (33.11). India: 1.49.
  The report gives no RSE for the government share or the coaching share.
- **No comparison with NSS round 75 (2017-18).** Report 595, section 1.2: round 75 covered all levels of
  education, counted coaching inside education spending, and left anganwadis out of pre-primary.
- **Spending excludes private coaching.** The API gives coaching spending separately (indicators 39
  and 40). They are in `raw/` but not charted.
- **School type is the household's report.** UDISE+ counts enrolment from school returns, so the
  government share can differ from UDISE+ figures.

## Checks done

- All 13 values from Tables 3.1, 5.1 and 5.13 of the original 2020-21 report match Table 1 of the
  2021-22 booklet exactly. The CSV uses the earlier report for these 13 values. The other 2020-21
  rows already in the CSV come from Table 1 of the 2021-22 booklet. All 100 previous CSV values match.
- The 2018-19 and 2019-20 enrolment counts agree to one decimal crore with Chart 1 of the 2020-21 report.
  Section 2.5.2 of that report restates the 2018-19 gross enrolment ratios. Primary and secondary match
  exactly. Upper primary (87.74) and higher secondary (50.14) round to the original 87.7 and 50.1.
  The charts in the later reports do not give exact earlier dropout figures.
- All five state tables from UDISE+ 2025-26 (6.1, 6.13, 4.12, 8.6, 8.8) and Table 2.5 parse to 37 rows (36 states and UTs plus India).
- Derived internet share for India (989,191 of 1,466,682 schools, 67.4%) equals the published share in Table 1. The PIB release also gives 67.4%.
- Census 2011 literacy derived from counts gives 72.98% for India, 94.00% for Kerala and 61.80% for Bihar. These match the published Census 2011 rates.
- AISHE Table 47 (All India, 2019-20 to 2021-22) matches the 2011-population time series file.
- Meghalaya's low share for functional electricity (28.7%) and West Bengal's for internet (19.7%) were checked against the counts in Table 2.5.

## Gaps and cautions

- **UDISE+ break in 2022-23.** Student-level data collection and new population projections began in 2022-23. Primary GER fell from 103.39 (2021-22) to 96.2 (2022-23) and dropout rates jumped (primary 1.45% to 7.8%). This is mostly a change of method. Show a break marker. Do not describe the 2021-22 to 2022-23 change as a real fall in enrolment.
- **UDISE to UDISE+ in 2018-19.** UDISE used paper school returns and digitised them at block or district
  level. UDISE+ introduced mandatory online upload and built-in validation checks. The chart has a
  break at 2018-19. The 2018-19 file on the dashboard is the Ministry's annual report. Its metadata
  shows a later save. The original release date and revision history remain unverified.
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

### Historical literacy sources checked on 18 Nov 2026

The optional literacy trend needs comparable national rates and a verified age denominator. The
2011 provisional slides cover 2001 and 2011. Their provisional 2011 rate is 74.04%. The final Primary
Census Abstract rate used on the site is 72.98%. The 1991 literacy study recalculates 1981 on an age
7 and over basis. Its national comparison excludes both Assam and Jammu and Kashmir. The candidate
files below do not establish the full 1951 to 2011 series on the requested basis.

| Release | Path under `raw/education/` | URL | SHA-256 |
| --- | --- | --- | --- |
| ORGI, Census 2011 Provisional Population Totals (2011) | `census-2011-provisional/report.pdf` | https://censusindia.gov.in/nada/index.php/catalog/42611/download/46274/Census%20of%20India%202011-Provisional%20Population%20Totals.pdf | `3e05f353f60f786503293396727feeedc566cb32a5b3b2e49f0248fdbc756965` |
| ORGI catalogue, Literacy Trends in the 1980s in India (1993) | `census-1991-literacy/report.pdf` | https://censusindia.gov.in/nada/index.php/catalog/31287/download/34468/29910_1991_LIT.pdf | `af5f29ab8656c1015d8d28a278702f6b363973304640387883ceba9e76f960cb` |
| ORGI, Census 1991 Final Population Totals, Paper 2 of 1992. The download timed out. | `census-1991-final/report.pdf` (partial download) | https://censusindia.gov.in/nada/index.php/catalog/33033/download/36851/48952_1991_PPT.pdf | `ac7cd438bad29af0710b80cf2ea80337573b9b8e03eae97d641960e39c4ce531` (partial bytes) |
