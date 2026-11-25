# Jobs

Data for the India by Numbers "Jobs" topic. Values come from two MoSPI household surveys. The National Sample Survey (NSS) measured employment before the Periodic Labour Force Survey (PLFS). Every value is a survey estimate or a calculation from survey estimates.

Read on 17 Nov 2026.

## Questions this topic answers

1. How many people are out of work, and is the rate going up or down?
2. How many women work or look for work, and how does this differ by state?
3. Which states have the highest unemployment, and how hard is it for young people to find a job?
4. What kind of work do Indians do: own businesses, salaried jobs or casual labour?
5. Which industries employ the most people?

## Two measures, two survey designs

- **Current weekly status (CWS)**: activity in the 7 days before the survey. The monthly and quarterly bulletins use CWS.
- **Usual status (ps+ss)**: activity over the 365 days before the survey, principal plus subsidiary. The annual reports use it. Usual-status rates are lower than CWS rates (3.1% against 5.0% or so in 2025). Do not put the two on one axis.
- **Design change in January 2025.** PLFS moved to a new sample design. Monthly estimates started in April 2025. Quarterly estimates for rural and urban areas started in April to June 2025. Before 2025, quarterly bulletins covered urban areas only. Annual reports moved from the July to June "agricultural year" to the calendar year. MoSPI says to take these changes into account when comparing with releases up to December 2024.

## Charts

### jobs-1 Unemployment rate, month by month

- Type: line. Series: rural+urban, rural, urban (persons). Optional toggle: male, female, age 15-29.
- Unit: per cent of the labour force. Geography: India. Period: Apr 2025 to Oct 2026 (19 months).
- File: `jobs-monthly-lfpr-wpr-ur.csv` (filter `indicator=UR`, `age_group=15+`). The same file holds LFPR and WPR.
- Sentence: "In October 2026, 4.9% of people aged 15 and over who were working or looking for work were unemployed, down from 5.2% a year earlier."
- Source: MoSPI NSO, PLFS Monthly Bulletins, April 2025 to October 2026 (CWS, age 15+). Latest release 16 Nov 2026. Values from the MoSPI eSankhyiki API; March 2026 from the March 2026 press note.

### jobs-2 Urban unemployment since 2018, quarter by quarter

- Type: line with a method break marker at January 2025, and a gap for Jan to Mar 2025.
- Unit: per cent. Geography: India, urban areas. Period: Jul-Sep 2018 to Jul-Sep 2026.
- File: `jobs-unemployment-quarterly.csv` (filter `sector=urban`, `age_group=15+`). From Apr-Jun 2025 the file also has rural and rural+urban rows. Youth (15-29) rows are in the same file.
- Sentence: "Urban unemployment jumped to 20.8% in April to June 2020, during the first COVID-19 lockdown. By July to September 2026 it was 6.8%."
- Source: MoSPI NSO, PLFS Quarterly Bulletins (CWS, age 15+). Old design: bulletins for Jul-Sep 2019, Jul-Sep 2020, Apr-Jun 2021, Oct-Dec 2021 (press note), Jan-Mar 2022, Jan-Mar 2023, Apr-Jun 2024 and Oct-Dec 2024. New design: bulletins for Apr-Jun 2025 and Jul-Sep 2026 (released 10 Nov 2026).

### jobs-3 Labour force participation, worker population and unemployment by sex

- Small multiples for India, ages 15 and over, usual status (ps+ss).
- NSS rounds 50, 55, 61, 66 and 68 cover 1993-94, 1999-2000, 2004-05, 2009-10 and 2011-12. PLFS covers July to June years 2017-18 to 2023-24 and calendar years 2022 to 2025.
- Files `jobs-annual-rates-history.csv` and `jobs-lfpr-wpr-ur-annual.csv`. The history file uses the NSS appendix tables listed below and Tables 1 to 3 of the PLFS 2023-24 press note. The calendar values come from Highlights Tables 1 to 3 of the PLFS Annual Report 2025.

### jobs-4 Women in the labour force, by state

- Type: ranked bar by state and tile map by state. Toggle: female, male, person.
- Unit: per cent of women aged 15+. Geography: all 36 states and UTs plus India. Period: calendar year 2025.
- File: `jobs-lfpr-by-state-2025.csv` (filter `sex=female`).
- Sentence: "In 2025, 66.7% of women aged 15 and over in Sikkim were working or looking for work, five times the rate in Delhi (13.1%). The national rate was 40.0%."
- Source: MoSPI NSO, PLFS Annual Report 2025, Appendix A, Table 16.0 (usual status ps+ss, age 15+, rural+urban).

### jobs-5 Unemployment by state, all ages 15+ and youth 15-29

- Type: ranked bar by state and tile map by state. Toggle: age 15+, age 15-29.
- Unit: per cent. Geography: all 36 states and UTs plus India. Period: calendar year 2025.
- File: `jobs-unemployment-by-state-2025.csv`.
- Sentence: "In 2025, unemployment among people aged 15 and over ranged from 0.9% in Gujarat to 10.0% in the Andaman and Nicobar Islands. Among states, Goa had the highest rate, 8.3%."
- Source: MoSPI NSO, PLFS Annual Report 2025, Appendix A, Table 18.0 (usual status ps+ss, rural+urban).

### jobs-6 Workers by employment status

- Small multiples for self-employed workers, workers with a regular wage or salary, and casual labour. India, all ages, usual status (ps+ss).
- Five NSS rounds from 1993-94 to 2011-12, seven PLFS July to June years from 2017-18 to 2023-24 and four PLFS calendar years from 2022 to 2025.
- Files `jobs-employment-status-history.csv` and `jobs-employment-status.csv`. Use the three broad groups. The PLFS tables also split self-employment into own-account workers and employers, and helpers.

### jobs-7 Workers by industry

- The line chart follows eight broad industries from 1993-94 to 2025. It covers India, rural and urban workers of both sexes, all ages, usual status (ps+ss). It marks the 30-day rule in 2004-05, the start of PLFS in 2017-18 and the PLFS redesign in 2025. Dashed lines show overlapping calendar estimates from 2022 to 2024. A separate dot shows the 2025 estimate.
- The grouped bars compare 2011-12, 2017-18, 2022 and 2025. They also give the 2025 shares for women. The table includes all PLFS July to June years through 2023-24 and calendar years from 2022 to 2025.
- Both charts use `jobs-employment-by-industry-history.csv` and `jobs-employment-by-industry.csv`. Every row gives its `source_kind`. All sources are `official`.

#### Broad industry concordance

NSS Report 554, section 5.9.1 and Statement 5.11 (pages 114 to 116), compare eight broad groups across rounds. They are agriculture, mining and quarrying, manufacturing, electricity and water, construction, trade and hotels and restaurants, transport and storage and communications, and other services. NSS 50 used NIC 1987. NSS 55 and 61 used NIC 1998. NSS 66 used NIC 2004. NSS 68 and PLFS use NIC 2008. Statement 5.11 defines the eight NIC 2008 groups as A, B, C, D plus E, F, G plus I, H plus J, and K through U. The PLFS statements use the same groups.

Statement 5.11 publishes all-worker shares per 1,000 for rural men, rural women, urban men and urban women. For each industry before 2011-12, multiply each share by its group's estimated count of all usual-status workers. Divide the sum by the sum of the four worker counts. Convert to per cent and round to one decimal. The worker counts use activity codes 11 to 51, all ages, and are in hundreds. The electricity and water share for rural women is a dash in 1993-94 and 1999-2000. Use a zero share for those two entries and include their worker counts in the denominator. The eight shares can differ from 100% in total because of rounding.

| Period | Survey | Values used | Source kind |
| --- | --- | --- | --- |
| 1993-94 | NSS 50 | Report 554 Statement 5.11. Worker counts from Report 409 Table 30B. | `official` |
| 1999-2000 | NSS 55 | Report 554 Statement 5.11. Worker counts from Report 458 Part II Table 46. | `official` |
| 2004-05 | NSS 61 | Report 554 Statement 5.11. Worker counts from Report 515 Part I Table 19. | `official` |
| 2009-10 | NSS 66 | Report 554 Statement 5.11. Worker counts from Report 537 Table 20. | `official` |
| 2011-12 | NSS 68 | Report 554 Table 27. Sum NIC 2008 sections using the groups in Statement 5.11. | `official` |
| 2017-18 to 2020-21 | PLFS | Annual Report 2020-21, Statement 13. | `official` |
| 2021-22 to 2023-24 | PLFS | Annual Report 2023-24, Statement 7. | `official` |
| Calendar 2022 to 2025 | PLFS | Annual Report 2025, revised 29 May 2026, Statement 8. | `official` |

The raw PDFs for both charts have URLs, read dates and SHA-256 checksums under Annual history sources. The older round files supply worker counts. Report 537 Statement 5.9 provides an independent check on the cross-round shares.

### jobs-8 Youth unemployment

- Small multiples by area and sex, ages 15 to 29, usual status (ps+ss).
- Five NSS rounds from 1993-94 to 2011-12, seven PLFS July to June years from 2017-18 to 2023-24 and four PLFS calendar years from 2022 to 2025.
- Files `jobs-youth-unemployment-history.csv` and `jobs-youth-unemployment-annual.csv`.

## Annual history build

Run `python3 -I pipeline/jobs/build_jobs_history.py` from the repo root. Save each PDF to the path below under `raw/jobs/`. Fetch with User-Agent `IndiaByNumbers/1.0 (+https://indiabynumbers.org/about/)`. The script uses `pdftotext -layout` and the existing PLFS CSVs. It writes LF line endings. `period_basis` identifies the survey and period group. `plot_period` puts July to June estimates at the start of July. `table` identifies each observation's source. `derived` identifies calculated values. `published_per_1000` keeps the original digits when the script expresses a published NSS rate in per cent.

| CSV | History rows | Source and calculation |
| --- | ---: | --- |
| `jobs-annual-rates-history.csv` | 108 | Ages 15 and over. NSS 409 Table 32B, 458 Table 48B, 515 Table 19, 537 Table 20 and 554 Table 18 give persons by usual activity. For participation use code 11 to 81. For worker population use code 11 to 51. Divide the unemployed (code 81) by the labour force (11 to 81) for unemployment. Use the estimates in hundreds for 1993-94 and 1999-2000 and the published rates per thousand of persons aged 15+ for the three later rounds. The latter unemployment estimates can differ slightly because the inputs are rounded. The PLFS July to June rows come from the 2023-24 press note. |
| `jobs-youth-unemployment-history.csv` | 108 | NSS Reports 537 and 554, Statement 6.4, publish the adjusted usual-status rate for rural and urban men and women aged 15 to 29. For the five other area and sex groups, sum the estimates for ages 15 to 19, 20 to 24 and 25 to 29. Use NSS 409 Table 30B, 458 Table 46, 515 Table 19, 537 Table 20 and 554 Table 18. Apply the tabulated proportions to the age-group totals. For 1999-2000, the table gives the age distribution within each activity, so apply it to the activity totals and sum rural and urban estimates for India. Compute the ratio of unemployed to labour force and round to one decimal. PLFS history comes from the 2020-21 (Statement 26) and 2023-24 (Statement 16) annual reports. Calendar values come from Statement 18 of the 2025 report. |
| `jobs-employment-status-history.csv` | 558 | NSS Report 554 Statement 5.9 publishes rural and urban shares for men and women for all five rounds. Use the appendix tables named in the youth row for the other groups. Compute shares from estimates in hundreds for codes 11, 12 and 21 (self-employed), 31 (regular wage or salary), 41 and 51 (casual labour) and 11 to 51 (all workers). Sum the rural and urban counts for 1999-2000. PLFS history comes from the 2020-21 (Statement 12) and 2023-24 (Statement 6) annual reports. Calendar values come from Statement 7 of the 2025 report. |
| `jobs-employment-by-industry-history.csv` | 680 | Before 2011-12, calculate national shares with Report 554 Statement 5.11 and the worker counts listed above. For 2011-12, group the sections in Table 27. The NSS rural table has no entry for section U. Keep two decimal places after conversion to per cent. Flag section sums as derived. PLFS history comes from the 2020-21 (Statement 13) and 2023-24 (Statement 7) annual reports. Check calendar values against Statement 8 of the 2025 report. |

From NSS 61 onward, subsidiary work required at least 30 days of work in the past year. NSS 50 and 55 used a shorter-time criterion. PLFS began in July 2017 with a different sample design, including a rotating urban panel. Calendar estimates from 2022 to 2024 overlap the July to June estimates. MoSPI switched the annual report to calendar years and changed the sample design in 2025. The time charts mark the start of the 30-day rule, the start of PLFS and the switch in 2025. Dashed lines identify the calendar estimates for 2022 to 2024. A separate dot marks the 2025 estimate from the new sample design.

### Annual history sources

All rows below are MoSPI files read on 18 Nov 2026. The PLFS 2025 revised report was checked again. Its checksum matches the earlier source entry.

| Raw directory under `raw/jobs/` (file `report.pdf`) | Release | Released | URL | SHA-256 |
| --- | --- | --- | --- | --- |
| `nss-50-full` | NSS Report 409, 50th round | Mar 1997 | https://www.mospi.gov.in/sites/default/files/publication_reports/409_final.pdf | `6b2c1b3b4b4cf6dfc8c537195b916ebdaad66a14a64f2bbcbe76deb02830a205` |
| `nss-55-part2` | NSS Report 458, 55th round, Part II | May 2001 | https://microdata.gov.in/NADA/index.php/catalog/90/download/6116 | `89172e06a4014da4fcc0180012b9059310690d6f519d6e4fd213fcdc1cf7627f` |
| `nss-61-part1` | NSS Report 515, 61st round, Part I | Sep 2006 | https://microdata.gov.in/NADA/index.php/catalog/109/download/4351 | `9c171944ec92dfc6b62840747638c066ae6242467c9ae833be7a27e19f09a083` |
| `nss-66-catalog-pdf` | NSS Report 537, 66th round | Nov 2011 | https://microdata.gov.in/NADA/index.php/catalog/124/download/4371 | `33bbb4216cf915c567e7b9f6c1b739ea90317afff3ca35e22b496eaa19fe121e` |
| `nss-68` | NSS Report 554, 68th round | Jan 2014 | https://www.mospi.gov.in/sites/default/files/publication_reports/nss_report_554_31jan14.pdf | `73ef9c2e0a15f7a6b98d9d2976fa2746e2e0db91fb5781a9fa4eb50449d4352f` |
| `plfs-2017-18` | PLFS Annual Report 2017-18 | May 2019 | https://www.mospi.gov.in/sites/default/files/publication_reports/Annual%20Report%2C%20PLFS%202017-18_31052019.pdf | `2ff169b5b587bfffb20da891dc664d0996c1ae902150f7b21b38d3707bb1b4e3` |
| `plfs-2018-19` | PLFS Annual Report 2018-19 | Jun 2020 | https://www.mospi.gov.in/sites/default/files/publication_reports/Annual_Report_PLFS_2018_19_HL.pdf | `c63f7cb1c80dc0f3f6204ab8b89de75a8e0a3638ea906eec0e96ec27261e07aa` |
| `plfs-2019-20` | PLFS Annual Report 2019-20 | Jul 2021 | https://www.mospi.gov.in/sites/default/files/publication_reports/Annual_Report_PLFS_2019_20F1.pdf | `916315d4396c4ee37614ad496ef19343d5849cca1fef2ca257419e3a92f32be4` |
| `plfs-2020-21` | PLFS Annual Report 2020-21 | Jun 2022 | https://www.mospi.gov.in/sites/default/files/publication_reports/Annual_Report_PLFS_2020%2021_0.pdf | `b73caddeb04a4da65ea59f8d0bb9c6b681fe7e7031f35052e108e0bf8638f666` |
| `plfs-2021-22-official` | PLFS Annual Report 2021-22 | Feb 2023 | https://www.mospi.gov.in/sites/default/files/publication_reports/AnnualReportPLFS2021-22F1.pdf | `a3a69de38eb89bf915f5f8309b39449dea202b3f7eb32e966c98d6994ad876e5` |
| `plfs-2022-23` | PLFS Annual Report 2022-23 | Oct 2023 | https://www.mospi.gov.in/sites/default/files/publication_reports/AR_PLFS_2022_23N.pdf | `c7695a00a16c1002a58dbc203cfcf0847e526adcd794dc200694b7f901cc696f` |
| `plfs-2023-24` | PLFS Annual Report 2023-24 | 23 Sep 2024 | https://www.mospi.gov.in/sites/default/files/publication_reports/AnnualReport_PLFS2023-24L2.pdf | `ab4ead2cee181a13c7ab40f164d2dceb46419cfb58f30f8baa58e35f79d33d39` |
| `plfs-2025` | PLFS Annual Report 2025, revised 29 May 2026 | 27 Mar 2026 | https://www.mospi.gov.in/uploads/publications_reports/publications_reports1780040415321_0624fb13-fb47-40bc-b470-7c7e9635c3ef_PLFS_2025_F_REV_29052026.pdf | `134bf2de5e4b1142d3bae4899c90ec5be3bf5ec03a2ff4b3f7b0bba34eee0da7` |

The legacy paths `NSS_Report_409.pdf`, `NSS_Report_458.pdf`, `NSS_Report_515.pdf`, `NSS_Report_537.pdf` and `Annual_Report_PLFS_2021_22_0.pdf` returned HTTP 404. The official routes in the table supplied the reports. No round required substituting a different age group. The two surveys do not cover the same years.

### Other official files read

Downloaded on 18 Nov 2026 during the source search. The build uses the files listed under Annual history sources.

| Raw path under `raw/jobs/` | Release or catalogue entry | Released | URL | SHA-256 |
| --- | --- | --- | --- | --- |
| `nss-50-key/report.pdf` | NSS Report 406, revised key results, 50th round | Oct 1996 | https://microdata.gov.in/NADA/index.php/catalog/77/download/4409 | `3158389d75b798c29417b7318830f6d389da0eb9b7c1f0996239028b66eda0ea` |
| `nss-50-unemployment/report.pdf` | NSS Report 418, unemployment, 50th round | Sep 1997 | https://microdata.gov.in/NADA/index.php/catalog/77/download/4413 | `94a90a1ebc1ac85f4497059b11f9ee9dbc56b27f946a067c27b8862863a578aa` |
| `nss-55-part1/report.pdf` | NSS Report 458, 55th round, Part I | May 2001 | https://microdata.gov.in/NADA/index.php/catalog/90/download/6106 | `42b48e2f44ef0214918dde1b9bf8b193bc56d45ffec057f9bef43817855ee603` |
| `nss-61-part2/report.pdf` | NSS Report 515, 61st round, Part II | Sep 2006 | https://microdata.gov.in/NADA/index.php/catalog/109/download/4352 | `7a7738bf8f74b57f25966581830489b97e9bc4acc89da06999154e10a7265002` |
| `nss-68-catalog-pdf/report.pdf` | NSS Report 554, 68th round, catalogue copy | Jan 2014 | https://microdata.gov.in/NADA/index.php/catalog/127/download/4291 | `73ef9c2e0a15f7a6b98d9d2976fa2746e2e0db91fb5781a9fa4eb50449d4352f` |
| `microdata-49/page.html` | NSS 38 employment survey | Live catalogue | https://microdata.gov.in/NADA/index.php/catalog/49/related-materials | `6e8f73811fd911856aba574ea45ff2502b11da64daada0df59538143d50c70d1` |
| `microdata-55/page.html` | NSS 43 employment survey | Live catalogue | https://microdata.gov.in/NADA/index.php/catalog/55/related-materials | `e2dd696c417d3e11f91797fb8df42eabe2bc0a38d2c6a30d83b930c0ad289a4a` |
| `microdata-71/page.html` | NSS 48 land and livestock survey | Live catalogue | https://microdata.gov.in/NADA/index.php/catalog/71/related-materials | `3539acf8024b503ed8dfc602551be89d085723b692978ef44808cd3fde33c2fb` |
| `microdata-77/page.html` | NSS 50 employment survey | Live catalogue | https://microdata.gov.in/NADA/index.php/catalog/77/related-materials | `ae920fcc5bb32326fed370c5d40acf227676fa1bb692b10b1b4ec992a69b7b53` |
| `microdata-90/page.html` | NSS 55 employment survey | Live catalogue | https://microdata.gov.in/NADA/index.php/catalog/90/related-materials | `c09a446c68d832da8a3f94ee72f23b707221171075373f93c4bdb4e786c284d6` |
| `microdata-109/page.html` | NSS 61 employment survey | Live catalogue | https://microdata.gov.in/NADA/index.php/catalog/109/related-materials | `9f129de9fa37995ff80e60a43d1afb4a236a812f9253b1a64bff994d4bff1670` |
| `microdata-124/page.html` | NSS 66 employment survey | Live catalogue | https://microdata.gov.in/NADA/index.php/catalog/124/related-materials | `08b808654a7129aef77cba31ba23dfa20403ffd0794cbb4a89aa0602f61b26f7` |
| `microdata-127/page.html` | NSS 68 employment survey | Live catalogue | https://microdata.gov.in/NADA/index.php/catalog/127/related-materials | `9d3bd6af2cc31a4c0303536c308a94fa42b0a2bbe59e4f7e58d5f411d8a539cb` |
| `microdata-213/page.html` | PLFS 2023-24 | Live catalogue | https://microdata.gov.in/NADA/index.php/catalog/213/related-materials | `000f38fa47bda8573fe696d20ab80b742510f9d43609dacc74b70a578cd05cb9` |
| `microdata-search/page.html` | Catalogue search for Employment and Unemployment | Live catalogue | https://microdata.gov.in/NADA/index.php/catalog/?sk=Employment+and+Unemployment&ps=100 | `9d37fcb4aa8d62c61ba959646754c5d83f239f7e82ad8e3e30fdea48a119e40b` |

### Annual history overlap checks

- **Annual rates.** All 18 NSS participation and worker population rates for 2004-05, 2009-10 and 2011-12 agree with Statements 8 and 11 of the 2017-18 PLFS report. The six equivalent 2017-18 rates agree with the 2023-24 press note.
- **Youth unemployment.** Reports 537 and 554 agree on all 12 published rates for the three overlapping NSS rounds. The 2018-19, 2019-20, 2021-22 and 2022-23 PLFS reports agree with the extracted July to June series on all 99 common values.
- **Employment status.** The same four PLFS overlap checks agree on all 594 values. NSS appendix count ratios match 44 of 60 published shares by sex and area in Report 554 Statement 5.9. All 36 values match from 2004-05 onward. The earlier differences range from 0.1 to 1.0 percentage points. For example, the 1993-94 share of self-employed urban women is 44.8% in the appendix ratio and 45.8% in the published summary. Use the published summary for those groups. Use the appendix counts for groups absent from the summary, including all workers in India.
- **Industry.** The four PLFS overlap reports agree on all 891 values. All 32 extracted NSS groups for rural and urban men and women agree with Report 554 Statement 5.11 when rounded to the precision of that statement.
- **Broad industry history.** NSS Report 537 Statement 5.9 and Report 554 Statement 5.11 agree on all 128 entries for the four earlier rounds, including two dashes. For 2011-12, applying the national calculation to Statement 5.11 gives eight shares within 0.013 percentage points of Table 27. For example, it gives 48.904% for agriculture against 48.90% in Table 27. Both charts use Table 27 for 2011-12. All 32 shares by sex and area for 2017-18 agree between Statement 16 of the first PLFS annual report and Statement 13 of the 2020-21 report. All 324 calendar entries agree with PLFS Annual Report 2025 Statement 8, including totals.
- **July to June against calendar.** Match by start year to compare the overlapping windows in 2022 and 2023. Equal values account for 1 of 18 annual rates, 1 of 18 youth rates, 25 of 108 employment status shares and 64 of 162 industry shares. The last two counts include totals. The estimates cover different months. For example, participation for ages 15 and over was 59.6% in calendar 2024 and 60.1% in 2023-24.

## Headline figures

| Figure | Value | Period | Source |
| --- | --- | --- | --- |
| Unemployment rate, age 15+ (CWS) | 4.9% | October 2026 | PLFS Monthly Bulletin, released 16 Nov 2026 |
| Female labour force participation, age 15+ (CWS) | 35.0% | October 2026 | PLFS Monthly Bulletin, released 16 Nov 2026 |
| Unemployment rate, age 15+ (usual status) | 3.1% | 2025 (Jan to Dec) | PLFS Annual Report 2025, released 27 Mar 2026 |
| Youth unemployment rate, age 15-29 (usual status) | 9.9% | 2025 | PLFS Annual Report 2025 |
| Workers with a regular wage or salary | 23.6% of workers | 2025 | PLFS Annual Report 2025 |
| People aged 15+ in work (usual status) | 61.6 crore (41.6 crore men, 20.0 crore women) | 2025 | MoSPI NSO, Press Note on PLFS Annual Report 2025 [January 2025 - December 2025], 27 Mar 2026, page 4 of 14: "61.6 crore persons (aged 15 years and above) were employed, in usual status (ps+ss) ... of which 41.6 crore were male and 20.0 crore were female" (uses MoHFW population projections). Checked 18 Nov 2026 |

## Sources

| Publisher | Release | Release date | Period | URL read | Read on | Licence | sha256 of raw file |
| --- | --- | --- | --- | --- | --- | --- | --- |
| MoSPI NSO | PLFS Monthly Bulletin, October 2026 (full bulletin) | 16 Nov 2026 | Jun to Oct 2026 | https://www.mospi.gov.in/uploads/publications_reports/publications_reports1794821821618_7cec3a56-a5c5-4a5e-a347-3b5e1b5f4a63_Monthly_Bulletin_PLFS_Oct_2026.pdf | 17 Nov 2026 | Not stated | 0f26e1fc3d6b3f2555b45918120cf2d22f566152b804137095e4da08edf08fdc |
| MoSPI NSO | Press note, PLFS Monthly Bulletin October 2026 | 16 Nov 2026 | Oct 2025 to Oct 2026 | https://www.mospi.gov.in/uploads/latestreleasesfiles/1794825935157-Monthly_Press_note_PLFS_Oct_2026.pdf | 17 Nov 2026 | Not stated | 158b2bb96c19464254ad1f0584789d5ea515da3dbda3e7eedfd04dec39515631 |
| MoSPI NSO | Press note, PLFS Monthly Bulletin March 2026 (rev V2) | 15 Apr 2026 | Mar 2026 | https://www.mospi.gov.in/uploads/latestreleasesfiles/1776249342330-Monthly_Press_note_March_2026_rev_V2.pdf | 17 Nov 2026 | Not stated | c29fee5392c14e4953df17dd4084235020c4f26b923c096edc7b1b2ba64208a5 |
| MoSPI NSO | eSankhyiki API, PLFS monthly LFPR, WPR, UR (all pages merged) | Updated with each bulletin | Apr 2025 to Oct 2026 | https://api.mospi.gov.in/api/plfs/getData?indicator_code=1&frequency_code=3 (also indicator_code=2 and 3) | 17 Nov 2026 | Not stated | LFPR 380a96f12485e7576791d4ccba909cea54db350ebb23aee0b94208400bad272f; WPR 07f47edfeac826585decbbfdb9d476f3791dd7a70c4c9caaa9b9d0ccac8e47b0; UR 336b6486ff11af827fbd244349fa1b7056ffeb069415d47f48c024affba4be43 |
| MoSPI NSO | PLFS Quarterly Bulletin, July to September 2026 | 10 Nov 2026 | Jul-Sep 2025 to Jul-Sep 2026 | https://www.mospi.gov.in/uploads/publications_reports/publications_reports1794297172776_05eae330-7f2d-45ec-84c5-07031201ecf1_PLFS_QB_July-Sept_2026_m.pdf | 17 Nov 2026 | Not stated | 16fee8073720fedff1f4fcfed661faf702f655fd7aeaf3585aadba276c8a083a |
| MoSPI NSO | PLFS Quarterly Bulletin, April to June 2025 | 18 Aug 2025 | Apr-Jun 2025 | https://www.mospi.gov.in/uploads/publications_reports/publications_reports1757323377120_dab45d40-9160-4804-8ac0-387846ebd44d_QuarterlyBulletinPLFS_April_June_2025.pdf | 17 Nov 2026 | Not stated | 12c703b73aa2745be292430ccd2ffa0ee8bee268fc0319bc2ffa2e18c43c31ba |
| MoSPI NSO | PLFS Quarterly Bulletin, October to December 2024 | 2025 (archive lists 16 Jan 2025) | Oct-Dec 2023 to Oct-Dec 2024 | https://www.mospi.gov.in/sites/default/files/publication_reports/PLFS_Quarterly_Bulletin_Oct-Dec24.pdf | 17 Nov 2026 | Not stated | b3dfae2f3181195ae5cbb30e3c3a69e6050276f6abe04a040aa185ba78d3637f |
| MoSPI NSO | PLFS Quarterly Bulletin, April to June 2024 | 16 Aug 2024 | Apr-Jun 2023 to Apr-Jun 2024 | https://www.mospi.gov.in/sites/default/files/publication_reports/Quarterly_Bulletin_PLFS_April_June_2024.pdf | 17 Nov 2026 | Not stated | 21dbf203a9e1db7e4078d68ca5f1f8e4d7794715d2ccc0dd282c94c1e10b28a8 |
| MoSPI NSO | PLFS Quarterly Bulletin, January to March 2022 | 2022 | Jan-Mar 2021 to Jan-Mar 2022 | https://www.mospi.gov.in/sites/default/files/publication_reports/Quarterly%20Bulletin%20PLFS%20January%20-%20March%202022.pdf | 18 Nov 2026 | Not stated | 990ed5bb74fb382a290ba9ddb2534cdaa6b1d0fda56a28dcd01d1014b6d3ecff |
| MoSPI NSO | PLFS Quarterly Bulletin, April to June 2021 | 2021 | Apr-Jun 2020 to Apr-Jun 2021 | https://www.mospi.gov.in/sites/default/files/publication_reports/Quarterly%20Bulletin%20PLFS%20April-June%202021.pdf | 18 Nov 2026 | Not stated | 5580a25ad456058f82720971deb2b5f571542ca53e3aab94450ceddd01c24ea7 |
| MoSPI NSO | PLFS Quarterly Bulletin, January to March 2023 | 2023 (press note 29 May 2023) | Jan-Mar 2022 to Jan-Mar 2023 | https://www.mospi.gov.in/sites/default/files/publication_reports/QuarterlyBulletinPLFS%20JanuaryMarch2023.pdf | 17 Nov 2026 | Not stated | 3ed6f03f21037b9850d5c5aad90040d7e770a0b5d1f3a24db5609dee8ad55d0a |
| MoSPI NSO | Press note, PLFS Quarterly Bulletin October to December 2021 | Not on the file; archive date 27 Feb 2023 | Oct-Dec 2020 to Oct-Dec 2021 | https://www.mospi.gov.in/uploads/documents/Press_note_QB_October_December_20211651839674736.pdf | 17 Nov 2026 | Not stated | ffacca0c3e24496aec5db5c63549938f3ea422768a1584ba15f6d61c64fdc745 |
| MoSPI NSO | PLFS Quarterly Bulletin, July to September 2020 | 2 Aug 2021 (PIB release 1741589 and the cover date, checked 18 Nov 2026) | Jul-Sep 2019 to Jul-Sep 2020 | https://www.mospi.gov.in/sites/default/files/publication_reports/PLFS_Quarterly_Bulletin_Jul_Sep_2020.pdf | 17 Nov 2026 | Not stated | 8f32ac56cc98b39fecf52e50c6222041ebe124a100058a2aa8e8702a061f0efd |
| MoSPI NSO | PLFS Quarterly Bulletin, July to September 2019 | Oct 2020 (no cover date; PDF dated 16 Oct 2020, checked 18 Nov 2026) | Jul-Sep 2018 to Jul-Sep 2019 | https://www.mospi.gov.in/sites/default/files/publication_reports/Quarterly_Bulletin_July_September_2019_M.pdf | 17 Nov 2026 | Not stated | a43a0bcb8dd24d3c76c609cdb866c851a93b2f512092eed6326bc32bd534b7d4 |
| MoSPI NSO | PLFS Annual Report 2025 (revised file, name dated 29 May 2026) | 27 Mar 2026 (first release) | Jan to Dec 2025, with 2022 to 2024 | https://www.mospi.gov.in/uploads/publications_reports/publications_reports1780040415321_0624fb13-fb47-40bc-b470-7c7e9635c3ef_PLFS_2025_F_REV_29052026.pdf | 17 Nov 2026 | Not stated | 134bf2de5e4b1142d3bae4899c90ec5be3bf5ec03a2ff4b3f7b0bba34eee0da7 |
| MoSPI NSO | Press note, PLFS Annual Report 2025 | 27 Mar 2026 | Jan to Dec 2025 | https://www.mospi.gov.in/uploads/latestReleases/latest_release_1774607827733_3e8964a9-268b-4cc9-ad65-cfc8a9e32f08_Press_note_AR_PLFS_2025_23032025_V2.1_26032026_final.pdf | 17 Nov 2026 | Not stated | 07540aae40b5bbf54f974e174764e707861c16276dcb50c6469fbe87ea9ef8b8 |
| PIB (MoSPI) | PLFS Annual Report 2025, PRID 2246009 | 27 Mar 2026, 4:00 PM | Jan to Dec 2025 | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2246009 | 17 Nov 2026 | Not stated | 4c55f0f2fb95057191fc62be7e744bafc2df3048b23f66165e80cd714f2dba69 |
| MoSPI NSO | Press note, PLFS Annual Report July 2023 to June 2024 | 23 Sep 2024 | 2017-18 to 2023-24 | https://www.mospi.gov.in/uploads/documents/Press_note_AR_PLFS_2023_24_22092024.pdf | 17 Nov 2026 | Not stated | 969e90c48acef4c80885e1ae245f088ffdcc39511fcbd8cb1892f57587fb9ca1 |
| MoSPI | PLFS product page data (release list, upload times) | Live | Not applicable | https://www.mospi.gov.in/api/product/get-product-data (POST, product_id 69) | 17 Nov 2026 | Not stated | e4e0b60823e339ab3f54fc729072876e561192e4a8c4c6681fe51209200589d7 |

Raw downloads are not kept in the repository; the URL and sha256 above identify each file. Scripts are in `pipeline/jobs/` (`fetch_plfs.py`, `extract_text.sh`, `build_jobs.py`). PDFs were turned into text with `pdftotext -layout`.

## Checks done

- State LFPR and UR (15+ and 15-29) from Tables 16.0 and 18.0 match the eSankhyiki API for PLFS 2025 in all 345 rows compared.
- Monthly UR from the API matches Statement 3 of the October 2026 bulletin for June to October 2026, and the October 2026 press note chart for October 2025 to October 2026.
- Quarterly values for April to June 2025 match between the API and the bulletin.
- Headline values in the 2025 press note (LFPR 59.3%, WPR 57.4%, UR 3.1%, youth UR 9.9%, regular wage 23.6%, self-employed 56.2%) match the report tables.

## Gaps and cautions

- **March 2026 is missing from the eSankhyiki API** (the month list skips March). I took the March 2026 values from sentences in the March 2026 press note: overall, rural and urban LFPR and WPR, female LFPR (overall and rural), overall UR (5.1%) and urban UR (6.8%). Rural UR and the male, female and youth splits for March 2026 are not in the file. The full March 2026 bulletin (with tables) was not found; the archive lists only bulletins up to October 2025.
- **The API's historical quarterly series has errors.** For April to June 2019, the API gives 21.6% for urban persons aged 15+, which is the 15-29 value. The bulletin gives 8.8%. The API also gives 8.1% for July to September 2019, against 8.3% in two bulletins. For this reason the quarterly chart uses bulletin tables, not the API.
- **No quarterly estimate for January to March 2025.** The old urban series ends with October to December 2024. The new series starts with April to June 2025.
- **Youth (15-29) quarterly urban rows for October 2020 to December 2021** come from the Apr-Jun 2021 and Jan-Mar 2022 bulletins (added 18 Nov 2026). The Oct-Dec 2021 press note gives age 15+ only. Where these bulletins overlap the others, all 33 values agree.
- **PLFS 2022-23 (July to June) has one Assam village with a very high sampling weight.** NSO's
  "Technical clarification regarding high multiplier value in PLFS 2022-23" (microdata catalogue
  210, download 5399, created 12 Jun 2025) says that the weight "disproportionately influenced the
  state-level estimates for Assam", and asks users to take care. NSO did not revise the report or
  the data. The redesigned PLFS from January 2025 fixes the sample design. In the 2022-23 report
  (Table 1a), the Assam sample sex ratio is 669, against 939 in 2021-22 and 978 in 2023-24, and the
  all-India ratio is 943, against 968 and 981. We show no Assam value from PLFS 2022-23. The
  all-India LFPR, WPR and UR for 2022-23 (jobs-3, jobs-6, jobs-7, jobs-8) show no break against the
  years before and after. Checked 25 Nov 2026. Do not use Assam values from PLFS 2022-23.
- **Method breaks.** Do not join the old and new quarterly series without a break marker. Do not join agricultural-year (July to June) and calendar-year annual series. MoSPI also published calendar-year estimates for 2022 to 2024 in the 2025 report; these overlap 2022-23 and 2023-24 but are not the same numbers (for example LFPR 59.6% for 2024 against 60.1% for 2023-24).
- **CWS against usual status.** Monthly and quarterly rates use CWS. Annual rates use usual status (ps+ss). The 2025 usual-status UR (3.1%) is lower than any month's CWS UR in 2025 (4.7% to 5.6%).
- **Small states and UTs.** The report warns that sample sizes for smaller states and UTs may not support reliable estimates. Treat Lakshadweep, Andaman and Nicobar Islands, Ladakh, Chandigarh and Dadra and Nagar Haveli and Daman and Diu with care. Chandigarh has urban rows only.
- **Geography.** All 36 states and UTs in `geography.csv` are present for 2025. Dadra and Nagar Haveli and Daman and Diu is one UT. Ladakh is separate from Jammu and Kashmir.
- **Absolute numbers.** The 61.6 crore workers figure uses MoHFW population projections, not a census count.
- **EPFO net payroll additions: not collected.** It is administrative data, not a measure of new jobs. I did not fetch it in this pass.
- **Wages.** PLFS also publishes average earnings (eSankhyiki indicators 6 to 8). Not collected in this pass.
- **Licence.** None of the pages read states a reuse licence.

## Publisher check on 18 Nov 2026

The latest MoSPI monthly release remains the October 2026 bulletin of 16 Nov. The annual 2025 report and July to September 2026 quarterly bulletin match their earlier file checksums. All three monthly eSankhyiki series and the annual and quarterly comparison queries for the charts match their prior records.

| Release or file checked | Release date | URL | Fetched | SHA-256 |
| --- | --- | --- | --- | --- |
| MoSPI press release list, POST response | Live list | https://www.mospi.gov.in/api/latest-release/get-web-latest-release-list | 18 Nov 2026 | `7f3da46fedf29f0cb39396c7b2cc2896dab455ec01b10b6edccfc19649a80358` |
| MoSPI PLFS product list, POST for product 69 | Live list | https://www.mospi.gov.in/api/product/get-product-data | 18 Nov 2026 | `e4e0b60823e339ab3f54fc729072876e561192e4a8c4c6681fe51209200589d7` |
| PLFS monthly labour force participation rate, page 1 | 16 Nov 2026 | https://api.mospi.gov.in/api/plfs/getData?indicator_code=1&frequency_code=3&limit=200&page=1 | 18 Nov 2026 | `66e8396effd0afd16a5f01a4a1ee4a708032b99ccd8aa67876692e411789d58f` |
| PLFS monthly worker population ratio, page 1 | 16 Nov 2026 | https://api.mospi.gov.in/api/plfs/getData?indicator_code=2&frequency_code=3&limit=200&page=1 | 18 Nov 2026 | `02bf957321cc4f2a092cd9999af7efa59e3d7d7042e10f7586ee176f4c30b978` |
| PLFS monthly unemployment rate, page 1 | 16 Nov 2026 | https://api.mospi.gov.in/api/plfs/getData?indicator_code=3&frequency_code=3&limit=200&page=1 | 18 Nov 2026 | `727e58cb4067ace6dce37527d1a449495fe44885797e2922c61d777117d892d8` |
