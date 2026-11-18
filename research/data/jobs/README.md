# Jobs

Data for the India by Numbers "Jobs" topic. All values come from the Periodic Labour Force Survey (PLFS) of the National Statistics Office (NSO), Ministry of Statistics and Programme Implementation (MoSPI). PLFS is a household survey. Every value is a survey estimate.

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
- Source: MoSPI NSO, PLFS Quarterly Bulletins (CWS, age 15+). Old design: bulletins for Jul-Sep 2019, Jul-Sep 2020, Oct-Dec 2021 (press note), Jan-Mar 2023, Apr-Jun 2024 and Oct-Dec 2024. New design: bulletins for Apr-Jun 2025 and Jul-Sep 2026 (released 10 Nov 2026).

### jobs-3 Labour force participation, worker population and unemployment, by sex, every year

- Type: small multiples (LFPR, WPR, UR), lines for male, female, person. Two segments: agricultural years 2017-18 to 2023-24, and calendar years 2022 to 2025. Show them as two series, not one line.
- Unit: per cent. Geography: India. Period: 2017-18 to 2025.
- File: `jobs-lfpr-wpr-ur-annual.csv`.
- Sentence: "Female labour force participation rose from 23.3% in 2017-18 to 41.7% in 2023-24. In calendar year 2025 it was 40.0%, against 79.1% for men."
- Source: MoSPI NSO, PLFS Annual Report 2023-24 press note (23 Sep 2024), Tables 1 to 3; PLFS Annual Report 2025 (27 Mar 2026), Highlights Tables 1 to 3. Usual status (ps+ss), age 15+.

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

### jobs-6 What kind of work people do

- Type: stacked bar (own-account worker or employer, unpaid helper in a household enterprise, regular wage or salary, casual labour), one bar per year. Toggle: male, female; rural, urban.
- Unit: per cent of workers. Geography: India. Period: calendar years 2022 to 2025.
- File: `jobs-employment-status.csv`. The rows "all self-employed" and "all" are totals. Do not stack them.
- Sentence: "In 2025, 56.2% of workers were self-employed. Only 23.6% had a regular wage or salary, up from 22.4% in 2024. Casual labourers made up 20.2%."
- Source: MoSPI NSO, PLFS Annual Report 2025, Statement 7 (usual status ps+ss, all ages).

### jobs-7 Jobs by industry

- Type: stacked bar or ranked bar by industry. Toggle: male, female; rural, urban.
- Unit: per cent of workers. Geography: India. Period: calendar years 2022 to 2025.
- File: `jobs-employment-by-industry.csv`. The row "all" is the total.
- Sentence: "Agriculture still employed 43.0% of workers in 2025, down from 45.5% in 2022. For women the share was 59.8%."
- Source: MoSPI NSO, PLFS Annual Report 2025, Statement 8 (usual status ps+ss, all ages, NIC 2008).

### jobs-8 Youth unemployment

- Type: grouped bar or slope (2022 to 2025), by sex and by rural or urban.
- Unit: per cent of the labour force aged 15-29. Geography: India. Period: calendar years 2022 to 2025.
- File: `jobs-youth-unemployment-annual.csv`.
- Sentence: "In 2025, 9.9% of young people aged 15 to 29 in the labour force were unemployed. For young women in towns and cities the rate was 18.9%."
- Source: MoSPI NSO, PLFS Annual Report 2025, Statement 18 (usual status ps+ss).

## Headline figures

| Figure | Value | Period | Source |
| --- | --- | --- | --- |
| Unemployment rate, age 15+ (CWS) | 4.9% | October 2026 | PLFS Monthly Bulletin, released 16 Nov 2026 |
| Female labour force participation, age 15+ (CWS) | 35.0% | October 2026 | PLFS Monthly Bulletin, released 16 Nov 2026 |
| Unemployment rate, age 15+ (usual status) | 3.1% | 2025 (Jan to Dec) | PLFS Annual Report 2025, released 27 Mar 2026 |
| Youth unemployment rate, age 15-29 (usual status) | 9.9% | 2025 | PLFS Annual Report 2025 |
| Workers with a regular wage or salary | 23.6% of workers | 2025 | PLFS Annual Report 2025 |
| People aged 15+ in work (usual status) | 61.6 crore (41.6 crore men, 20.0 crore women) | 2025 | PLFS Annual Report 2025 press note (uses MoHFW population projections) |

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
| MoSPI NSO | PLFS Quarterly Bulletin, January to March 2023 | 2023 (press note 29 May 2023) | Jan-Mar 2022 to Jan-Mar 2023 | https://www.mospi.gov.in/sites/default/files/publication_reports/QuarterlyBulletinPLFS%20JanuaryMarch2023.pdf | 17 Nov 2026 | Not stated | 3ed6f03f21037b9850d5c5aad90040d7e770a0b5d1f3a24db5609dee8ad55d0a |
| MoSPI NSO | Press note, PLFS Quarterly Bulletin October to December 2021 | Not on the file; archive date 27 Feb 2023 | Oct-Dec 2020 to Oct-Dec 2021 | https://www.mospi.gov.in/uploads/documents/Press_note_QB_October_December_20211651839674736.pdf | 17 Nov 2026 | Not stated | ffacca0c3e24496aec5db5c63549938f3ea422768a1584ba15f6d61c64fdc745 |
| MoSPI NSO | PLFS Quarterly Bulletin, July to September 2020 | Not checked | Jul-Sep 2019 to Jul-Sep 2020 | https://www.mospi.gov.in/sites/default/files/publication_reports/PLFS_Quarterly_Bulletin_Jul_Sep_2020.pdf | 17 Nov 2026 | Not stated | 8f32ac56cc98b39fecf52e50c6222041ebe124a100058a2aa8e8702a061f0efd |
| MoSPI NSO | PLFS Quarterly Bulletin, July to September 2019 | Not checked | Jul-Sep 2018 to Jul-Sep 2019 | https://www.mospi.gov.in/sites/default/files/publication_reports/Quarterly_Bulletin_July_September_2019_M.pdf | 17 Nov 2026 | Not stated | a43a0bcb8dd24d3c76c609cdb866c851a93b2f512092eed6326bc32bd534b7d4 |
| MoSPI NSO | PLFS Annual Report 2025 (revised file, name dated 29 May 2026) | 27 Mar 2026 (first release) | Jan to Dec 2025, with 2022 to 2024 | https://www.mospi.gov.in/uploads/publications_reports/publications_reports1780040415321_0624fb13-fb47-40bc-b470-7c7e9635c3ef_PLFS_2025_F_REV_29052026.pdf | 17 Nov 2026 | Not stated | 134bf2de5e4b1142d3bae4899c90ec5be3bf5ec03a2ff4b3f7b0bba34eee0da7 |
| MoSPI NSO | Press note, PLFS Annual Report 2025 | 27 Mar 2026 | Jan to Dec 2025 | https://www.mospi.gov.in/uploads/latestReleases/latest_release_1774607827733_3e8964a9-268b-4cc9-ad65-cfc8a9e32f08_Press_note_AR_PLFS_2025_23032025_V2.1_26032026_final.pdf | 17 Nov 2026 | Not stated | 07540aae40b5bbf54f974e174764e707861c16276dcb50c6469fbe87ea9ef8b8 |
| PIB (MoSPI) | PLFS Annual Report 2025, PRID 2246009 | 27 Mar 2026, 4:00 PM | Jan to Dec 2025 | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2246009 | 17 Nov 2026 | Not stated | 4c55f0f2fb95057191fc62be7e744bafc2df3048b23f66165e80cd714f2dba69 |
| MoSPI NSO | Press note, PLFS Annual Report July 2023 to June 2024 | 23 Sep 2024 | 2017-18 to 2023-24 | https://www.mospi.gov.in/uploads/documents/Press_note_AR_PLFS_2023_24_22092024.pdf | 17 Nov 2026 | Not stated | 969e90c48acef4c80885e1ae245f088ffdcc39511fcbd8cb1892f57587fb9ca1 |
| MoSPI | PLFS product page data (release list, upload times) | Live | Not applicable | https://www.mospi.gov.in/api/product/get-product-data (POST, product_id 69) | 17 Nov 2026 | Not stated | e4e0b60823e339ab3f54fc729072876e561192e4a8c4c6681fe51209200589d7 |

Raw files are in `raw/jobs/`. Parsing scripts are in `pipeline/` (`fetch_plfs.py`, `build_jobs.py`). PDFs were turned into text with `pdftotext -layout`.

## Checks done

- State LFPR and UR (15+ and 15-29) from Tables 16.0 and 18.0 match the eSankhyiki API for PLFS 2025 in all 345 rows compared.
- Monthly UR from the API matches Statement 3 of the October 2026 bulletin for June to October 2026, and the October 2026 press note chart for October 2025 to October 2026.
- Quarterly values for April to June 2025 match between the API and the bulletin.
- Headline values in the 2025 press note (LFPR 59.3%, WPR 57.4%, UR 3.1%, youth UR 9.9%, regular wage 23.6%, self-employed 56.2%) match the report tables.

## Gaps and cautions

- **March 2026 is missing from the eSankhyiki API** (the month list skips March). I took the March 2026 values from sentences in the March 2026 press note: overall, rural and urban LFPR and WPR, female LFPR (overall and rural), overall UR (5.1%) and urban UR (6.8%). Rural UR and the male, female and youth splits for March 2026 are not in the file. The full March 2026 bulletin (with tables) was not found; the archive lists only bulletins up to October 2025.
- **The API's historical quarterly series has errors.** For April to June 2019, the API gives 21.6% for urban persons aged 15+, which is the 15-29 value. The bulletin gives 8.8%. The API also gives 8.1% for July to September 2019, against 8.3% in two bulletins. For this reason the quarterly chart uses bulletin tables, not the API.
- **No quarterly estimate for January to March 2025.** The old urban series ends with October to December 2024. The new series starts with April to June 2025.
- **Youth (15-29) quarterly urban rows are missing for October 2020 to December 2021.** The Oct-Dec 2021 press note gives age 15+ only. The full bulletin for that quarter was not downloaded.
- **Method breaks.** Do not join the old and new quarterly series without a break marker. Do not join agricultural-year (July to June) and calendar-year annual series. MoSPI also published calendar-year estimates for 2022 to 2024 in the 2025 report; these overlap 2022-23 and 2023-24 but are not the same numbers (for example LFPR 59.6% for 2024 against 60.1% for 2023-24).
- **CWS against usual status.** Monthly and quarterly rates use CWS. Annual rates use usual status (ps+ss). The 2025 usual-status UR (3.1%) is lower than any month's CWS UR in 2025 (4.7% to 5.6%).
- **Small states and UTs.** The report warns that sample sizes for smaller states and UTs may not support reliable estimates. Treat Lakshadweep, Andaman and Nicobar Islands, Ladakh, Chandigarh and Dadra and Nagar Haveli and Daman and Diu with care. Chandigarh has urban rows only.
- **Geography.** All 36 states and UTs in `geography.csv` are present for 2025. Dadra and Nagar Haveli and Daman and Diu is one UT. Ladakh is separate from Jammu and Kashmir.
- **Absolute numbers.** The 61.6 crore workers figure uses MoHFW population projections, not a census count.
- **EPFO net payroll additions: not collected.** It is administrative data, not a measure of new jobs. I did not fetch it in this pass.
- **Wages.** PLFS also publishes average earnings (eSankhyiki indicators 6 to 8). Not collected in this pass.
- **Licence.** None of the pages read states a reuse licence.
