# Crime and justice

Data gathered on 25 Nov 2026 from the National Crime Records Bureau (NCRB, Ministry of Home Affairs) and from Ministry of Law and Justice answers in the Lok Sabha and the Rajya Sabha. The CSVs keep the publishers' digits. No rate was computed here. One value is derived: the undertrial share of prisoners for the years where NCRB prints only the counts (marked `derived` in `prisons-india-trend.csv`).

On 27 Nov 2026 we added six CSVs from the same Crime in India 2024 (Volumes II and III) and revised Prison Statistics India 2024 files: crimes against Scheduled Castes and Scheduled Tribes, deaths in police custody, cases against police personnel, deaths in prisons, human trafficking and missing children. The sha256 of each file was the same on both days.

The Crime and justice topic (`src/content/topics/crime-and-justice.ts`) uses these files, since 25 Nov 2026. "Proposed charts" at the end lists the charts it was built from.

## Questions this topic answers

1. How many cognizable crimes do the police record, per lakh people, in each state, and how has the national rate changed?
2. How many murders are recorded in each state?
3. How many crimes against women are recorded, per lakh women, in each state?
4. What share of cases do the police charge-sheet, and what share of trials end in a conviction?
5. How crowded are the prisons, and what share of prisoners have not been convicted (undertrials)?
6. How many cases wait in the district courts and the High Courts, and how many have waited more than 10 years?
7. What do the police record on crimes against Scheduled Castes and Scheduled Tribes, deaths in police custody and in prisons, cases against police personnel, human trafficking and missing children?

## Sources

All read on 25 Nov 2026. NCRB pages say "All Rights Reserved" and state no reuse licence. The Parliament answers carry no licence of their own, but the sansad.in portal that holds them does (read 27 Nov 2026, https://sansad.in/ls/privacyPolicy): "Contents of this portal may not be reproduced partially or fully, without due permission from the Parliament of India and National Informatics Centre." The two pendency CSVs are therefore listed in `src/content/gated.ts` and no page shows them until that permission is kept (council, 27 Nov 2026, 3 of 3). The sha256 of each raw file is in "Raw files" below.

| Publisher | Release | Release date | Period | Link |
| --- | --- | --- | --- | --- |
| NCRB | Crime in India 2024, Volumes I to III (CII 2024) | Not stated. NCRB gives no date on the year page or in the volumes. News reports give 6 May 2026. The volume PDFs were created on 7 Apr 2026 and last changed between 10 Apr and 13 May 2026 (PDF metadata). Charts use "not stated" | Calendar year 2024 | [Year page](https://www.ncrb.gov.in/crime-in-india-year-wise.html?year=2024&keyword=), English view |
| NCRB | Crime in India 2017 to 2023, Volume I of each | Earlier releases, one a year | 2015 to 2023, three years in each edition | Year pages, `year=2017` to `year=2023` |
| NCRB | Prison Statistics India 2024, revised report "with West Bengal data" (PSI 2024) | File dated 15 Sep 2026 ("PSI-2024Ason15092026"). The first release was on 6 May 2026 | As on 31 Dec 2024 | [Year page](https://www.ncrb.gov.in/prison-statistics-india-year-wise.html?year=2024) |
| NCRB | Prison Statistics India 2016 to 2023, Executive Summary of each | Earlier releases | As on 31 Dec 2014 to 2023 | Year pages, `year=2016` to `year=2023` |
| Ministry of Law and Justice, Department of Justice | Lok Sabha unstarred questions 2142 (1 Aug 2025), 3501 (13 Mar 2026), 5553 (27 Mar 2026), 3295 and 3371 (7 Aug 2026); 2362 (13 Feb 2026, check only) | Date of each answer | As on the date in each annexure | [Lok Sabha questions](https://sansad.in/ls/questions/questions-and-answers) |
| Ministry of Law and Justice, Department of Justice | Rajya Sabha unstarred questions 3113 (19 Mar 2026) and 597 (23 Jul 2026) | Date of each answer | As on the date in each annexure | [Rajya Sabha questions](https://sansad.in/rs/questions/questions-and-answers) |

### How the files were found

- **NCRB year pages.** The site serves Hindi by default. The Hindi page for 2024 says "कोई रिकॉर्ड नहीं मिला" (no records found), and the Hindi pages for 2022 and 2023 list only the front matter. This is why the backlog found no files. The URL with `/en/` returns "The page you are trying to access doesn't exist". The page's own language switch posts to `/api/language/set`. After that post, the English page lists the volumes. `pipeline/crime/ncrb_files.mjs` does this.
- **Parliament answers.** The Lok Sabha list on sansad.in reads the Lok Sabha eLibrary (a DSpace API). The Rajya Sabha list reads `rsdoc.nic.in`. `pipeline/crime/find_answers.py` queries both. Searches covered Law and Justice answers from 1 Jul 2025 (Lok Sabha) and sessions 270 and 271 (Rajya Sabha). Each answer used here has a full State/UT table. Answers with only national totals, or with one state, were not used.
- **Department of Justice compilation** (`doj.gov.in/static/uploads/2026/04/c393f1e761f310476a68fe8f1f87c16a.pdf`): HTTP 403 "Access Denied" from the Akamai edge, to curl and to headless Chromium, on 25 Nov 2026. Not used. Per the pipeline rule, the fetch stopped there. The compilation repeats answers that sansad.in also publishes.
- **National Human Rights Commission (NHRC).** Not used. NHRC asks for permission by mail before its data are reused, and its counts of deaths in custody differ from NCRB counts. The design council decided to show NCRB counts only and never to combine the two. The custody charts say so.
- **data.gov.in.** Not used. The NCRB PDFs held every table we need, so the fallback was not tried.

## Method breaks

### Bharatiya Nyaya Sanhita (BNS), from 1 July 2024

CII 2024 records the change in its Glossary, section D, "Changes/Improvements in Crime in India-2024 Publication":

> New Criminal Laws 'Bharatiya Nyay Sanhita (BNS)' and 'Bharatiya Nagrik Suraksha Sanhita (BNSS)' have been notified by MHA's Gazette Notification dated 23rd Feb, 2024, making provisions for the law to be implemented from 1st July, 2024. Consequent to the implementation of New Criminal Laws, the data collection formats for Crime in India – 2024 Publication have been revised to collect IPC & BNS data separately. In the revised formats, the cases registered under IPC & BNS were presented separately to reflect the changes as per the New Criminal Laws. However, its police & court disposals were tabulated collectively to ensure better representation/ comparability and consistency of the data.

What this means for the files:

- **Cases registered** have IPC and BNS columns, and a combined total (Tables 1.2, 1A.1, 1A.4). In 2024, 19,03,047 cases were registered under the IPC and 16,41,561 under the BNS, 35,44,608 in total (Table 1A.1). `crime-by-state-2024.csv` keeps all three (`law` = `ipc`, `bns`, `ipc-bns`).
- **Rates, crimes against women, murder, charge-sheeting and conviction** are given only for IPC and BNS together. NCRB prints no BNS-only rate.
- **Crime heads changed.** Item 12 of section D: simple hurt (Section 323 IPC), adulteration of food and drugs (272-276 IPC) and criminal intimidation (506 IPC) are non-cognizable under the BNS and are left out of Chapter 1 and Chapters 17 to 19. Cognizable simple hurt is kept for the period up to 30 June 2024 only. Item 11: attempt to commit suicide, sedition and unnatural offences are left out because the BNS deleted them. The Snapshots page says: "The decrease in cases of 'Hurt or Grievous Hurt' may be attributed to the changes in BNS, where the Sections of 'Hurt or Grievous Hurt' have been merged and exclusion Simple Hurt being a non-cognizable offence." Hurt fell from 6,36,767 cases (2023) to 4,41,996 (2024).
- **Treat 2024 as a method break** for every IPC or total series: the 2024 national rate (418.9, against 448.3 in 2023) is not a like-for-like change. Murder (Section 302 IPC, Section 103 BNS) and the crimes against women heads map section by section (Glossary, section A), but the totals for women also gain new BNS heads (for example Section 69, sexual intercourse by deceitful means: 1,325 cases).
- **Prisons.** PSI 2024 says it combines BNS and IPC data in Chapter 5 (offence-wise). The occupancy and undertrial tables used here do not depend on the law.

### Population base of the rates

NCRB computes every rate itself. We copy its rates and do not recompute them.

| CII edition | Base that the edition states | Years in our files |
| --- | --- | --- |
| 2024 | "Mid-Year Projected Population of respective States/UTs of 2024 based on 2011 census (Report of the Technical Group on Population Projections, July, 2020, National Commission on Population, Ministry of Health & Family Welfare)" (Volume I, Disclaimer and Limitations, item 3). Women: the same report, female population (Methodology, B(b)) | 2022 to 2024 |
| 2020 to 2023 | Technical Group on Population Projections, July 2020 | 2020, 2021 |
| 2018, 2019 | Technical Group on Population Projections, November 2019 | 2018, 2019 |
| 2017 | "Registrar General of India estimated population of 2017" (Table 1.1); "based on 2001 Census" (Table 2A.1 note) | 2017 |

- Each edition reprints the earlier years with their original population. For example, 2018 shows 13,233.8 lakh in CII 2018, 2019 and 2020. So a rate keeps the base of its own year's edition. `crime-india-trend.csv` gives the base in `population_base`.
- Mark breaks at 2018 (projection of November 2019) and 2020 (projection of July 2020), as well as 2024 (BNS).
- The 2024 standalone file "Disclaimer & Limitations" on the year page still says "of 2022", and the standalone "Methodology" file says "1st January to 31st December 2023". Volume I itself says 2024 on both pages. We follow Volume I.

## Notes on each CSV

All rows use `geography` slugs from `research/data/geography.csv`, or `india`. Missing values are empty.

### `crime-by-state-2024.csv` (407 rows)

- India and 36 States/UTs. CII 2024 Table 1A.3 (total cognizable crimes, IPC/BNS and SLL: cases 2022 to 2024, rate 2024, mid-year population 2024) and Table 1A.1 (IPC/BNS: cases 2022, 2023; IPC, BNS and combined cases 2024; rate 2024).
- `indicator`: `cases`, `crime-rate` (cognizable crimes per lakh population), `mid-year-population` (lakh). `law`: `ipc-bns-sll` (all cognizable crimes), `ipc-bns`, `ipc`, `bns`. "SLL" means special and local laws.
- The script checks that the population in Table 1A.1 equals the one in Table 1A.3 for every row.

### `crime-india-trend.csv` (114 rows)

- India, 2015 to 2024. `crime_head`: `all-cognizable` (Table 1.1 of each edition: cases and rate for IPC/BNS, SLL and the total, and the mid-year population), `murder` (Table 2A.1), `crimes-against-women` (Table 3A.1).
- Counts come from the latest edition that prints the year, because NCRB revises them. For example, 2019 murders are 28,918 in CII 2019 and 28,915 in CII 2020 and 2021. `edition` and `table` name the source of each row.
- Murder and women rates are printed only in the year's own edition, so they start in 2017 (the earliest edition read). Counts start in 2015.
- The 2020 total rate (487.8) is a peak; NCRB does not explain it in the tables we read.

### `ipc-crimes-india-1981-2024.csv` (132 rows)

- India, 1981 to 2024, from "At a glance - IPC/BNS Crimes over the years 1981 - 2024" (CII 2024, Volume I, page x): cases, crime rate and charge-sheeting rate. `law` is `ipc` to 2023 and `ipc-bns` for 2024.
- One release, but each rate keeps the population of its own year. The page does not name the bases. It covers IPC crimes only, not SLL.

### `murder-by-state-2024.csv` (185 rows)

- India and 36 States/UTs, CII 2024 Table 2A.1: cases 2022 to 2024, murder rate 2024 (per lakh population), charge-sheeting rate 2024. Murder is Section 302 IPC and Section 103 BNS combined.
- Ladakh's charge-sheeting rate is "-" in the table and empty here.

### `crimes-against-women-by-state-2024.csv` (222 rows)

- India and 36 States/UTs, CII 2024 Table 3A.1 "Crime against Women (IPC+SLL)": cases 2022 to 2024, rate 2024 per lakh women, female mid-year population 2024 (lakh), charge-sheeting rate 2024.

### `police-and-court-disposal-by-state-2024.csv` (407 rows)

- India and 36 States/UTs, IPC and BNS cases together. Police: CII 2024 Table 17A.2 (cases for investigation, charge-sheeted, disposed of, pending at the end of the year, charge-sheeting rate). Courts: Table 18A.2 (cases for trial, convicted, trials completed, pending at the end of the year, conviction rate, pendency percentage). The `table` column names the column number.
- NCRB's formulas, printed in the tables: charge-sheeting rate = cases charge-sheeted / cases disposed of by police x 100 (col. 18 / col. 19); conviction rate = cases convicted / trials completed x 100 (col. 15 / col. 18).
- The charge-sheeting rate in Table 17A.2 equals the rate in Table 1A.1 for all 37 rows (checked by the script).
- Table 17A.2 marks Manipur's pending investigation figure as provisional: "Data of Pending Investigation is provisional due to pending clarifications from Manipur".

### `prisons-by-state-2024.csv` (629 rows)

- India and 36 States/UTs, as on 31 Dec 2024, from the revised PSI 2024. Table 1.2: capacity, inmates and occupancy rate by sex (`male`, `female`, `transgender`, `total`). Table 2.1: convicts, undertrials and detenues. Table 2.2: undertrial and convict share of all inmates.
- NCRB's formula (Table 1.2): occupancy rate = inmate population / total capacity x 100. Above 100 means overcrowding.
- Transgender occupancy is "-" where a state has no transgender capacity; empty here.

### `prisons-india-trend.csv` (77 rows)

- India, as on 31 Dec 2014 to 2024: prisons, capacity, inmates, occupancy rate (published), convicts, undertrials, and the undertrial share. Each year comes from the latest PSI Executive Summary that prints it (each prints three years).
- The undertrial share is `derived` for every year: undertrials / inmates x 100, to one decimal, from the two published counts. It matches the share NCRB prints for its own year in PSI 2018 (69.4%), PSI 2020 (76.1%), PSI 2023 (73.5%) and PSI 2024 (72.5%, Table 2.2).
- PSI 2018 and PSI 2019 used West Bengal's 2017 data for 2018 and 2019 ("Due to non-receipt of data from West Bengal ..."). PSI 2020 and PSI 2021 print different 2018 and 2019 figures with no footnote (2018 inmates: 4,66,084 in PSI 2019, 4,66,802 in PSI 2020). We use the later figures.

### `court-pendency-district-by-state.csv` (814 rows)

- India and 36 States/UTs. Cases pending in the District and Subordinate Courts, from eight answers. Every annexure says its source is the National Judicial Data Grid (NJDG).
- `period` is the "as on" date of the annexure (YYYY-MM-DD). LS 3295 gives five years with no date. LS 2362 dates the same values for 2023, 2024 and 2025 to 31 December (the script checks all 36 rows), so those rows carry `YYYY-12-31`. 2021 and 2022 keep the year only, with a note.
- `case_type`: `all`, `civil`, `criminal` (LS 3501 only). `pending_for`: `all`, or `more-than-N-years` (RS 3113, RS 597, LS 3371).
- `india` rows are the Total row of each annexure. In all 14 tables, the State/UT rows add up to the Total row in every column (checked by the script).
- Dates: 28 Jul 2025 (LS 2142), 31 Dec 2021 to 2025 (LS 3295), 9 Mar 2026 (LS 3501), 13 Mar 2026 (RS 3113), 23 Mar 2026 (LS 5553), 16 Jul 2026 (RS 597), 28 Jul 2026 (LS 3295), 30 Jul 2026 (LS 3371).

### `court-pendency-high-courts.csv` (593 rows)

- The Supreme Court (`supreme-court`), the 25 High Courts and `high-courts-total` (the Total row, which leaves out the Supreme Court). `geography` is `india`; `court` names the court and `jurisdiction` lists the States/UTs it serves. LS 2142 gives no Supreme Court row.
- Same answers, dates and columns as the district file.

### `crimes-against-scs-sts-by-state-2024.csv` (444 rows)

- India and 36 States/UTs, CII 2024 Volume II, Table 7A.1 (Scheduled Castes, p. 655) and Table 7C.1 (Scheduled Tribes, p. 761). `group`: `scheduled-castes`, `scheduled-tribes`. `indicator`: `cases` (2022 to 2024), `population` (the group's population at Census 2011, lakh; `period` is `2011`), `crime-rate` (2024, per lakh people of the group), `chargesheeting-rate` (2024, percent).
- NCRB's footnote: "Atrocities refers to Crimes committed against SCs by Non-SCs/STs. Cases under only IPC (without SC/ST Act) have been excluded as those cases refers to Crime against SCs by SCs/STs." The same note applies to STs.
- **Population base.** The rate uses the "Actual Population of SCs [STs] as per the Population Census 2011 (RGI)", not the 2024 projection that the other CII rates use. Do not compare it with the total crime rate.
- NCRB prints "-" for the rate where it prints the group's population as 0.0 lakh: for SCs, Arunachal Pradesh, Nagaland, Andaman and Nicobar Islands and Lakshadweep; for STs, Haryana, Punjab, Chandigarh, Delhi and Puducherry. Empty here. Mizoram (SC population 0.0 lakh as printed) still gets a rate: 2 cases give 164.2. Ladakh (SC population 0.0 lakh) gets 0.0 from 0 cases.
- Manipur: 1 case against STs in 2022, 3,399 in 2023 and 289 in 2024. The table gives no reason.
- Charge-sheeting rates are "-" where no case was disposed of; empty here.

### `deaths-in-police-custody-2024.csv` (1,110 rows)

- India and 36 States/UTs, CII 2024 Volume III. `remand`: `not-on-remand` (Table 16A.1, p. 1173: "Persons Not on Remand includes Persons Arrested and yet to be produced before court"), `in-remand` (Table 16A.2, p. 1174: "Persons in remand includes Persons in Police/Judicial Remand"), `all` (Table 16A.2, col. 14, and Table 16A.3).
- `indicator`: `deaths-reported`, `magisterial-enquiries-ordered`, `judicial-enquiries-ordered`, then cases (`cases-registered`, `cases-chargesheeted`, `cases-convicted`, `cases-acquitted-or-discharged`) and policemen (`policemen-arrested`, `policemen-chargesheeted`, `policemen-convicted`, `policemen-acquitted-or-discharged`). `cause` (Table 16A.3, p. 1175, "Reasons of Custodial Deaths"): `suicide`, `illness-or-death-in-hospital-during-treatment`, `injuries-sustained-prior-to-police-custody`, `injuries-in-police-custody-due-to-physical-assault-by-police`, `while-escaping-from-custody`, `road-accident-or-journey-connected-with-investigation`, `others`, or `all`.
- 65 deaths in 2024: 40 not on remand, 25 on remand. Cases were registered over 6 and 7 of them; no charge-sheet, conviction or arrest is recorded in 2024.
- The cause is the one that the state police report. It is not the finding of an enquiry.

### `cases-against-police-personnel-2024.csv` (100 rows)

- CII 2024 Volume III. `category` `all`: Table 16A.5 "Cases Registered against State Police Personnel" (p. 1177), cases registered, India and 36 States/UTs. `category` `human-right-violation`: Table 16A.6 "Cases Registered against State Police Personnel for Human Right Violation" (p. 1178), India only, by `incidence` (`encounter-killing`, `deaths-in-custody`, `illegal-detention`, `torture-causing-hurt-or-injury`, `extortion`, `others`, `all`), with nine columns: cases registered, final reports submitted, charge-sheeted, convicted, acquitted or discharged, and policemen arrested, charge-sheeted, convicted, acquitted or discharged.
- The category name is NCRB's own ("Human Right Violation" in the table title, "Human Rights Violation" in the contents). The site quotes the table title.
- From Table 16A.5 we keep only the cases registered (col. 3). The column heads of cols. 4 to 12 are printed out of line in the PDF text, and we could not match them to the columns with confidence.
- Chandigarh reports 4,069 of the 6,269 cases in Table 16A.5. The table gives no reason.

### `prison-deaths-2024.csv` (518 rows)

- India and 36 States/UTs, revised PSI 2024, Table 8.1 (p. 189: natural, un-natural, cause not known, total), Table 8.2 (p. 190: ageing, illness) and Table 8.4 (p. 193: suicide, execution, murder by inmates, assault by outside elements, firing, negligence or excess by jail personnel, accidental, others).
- `cause_group`: `natural`, `unnatural`, `not-known`, `all`. `cause` is `all` on the group totals.
- All 57 deaths with the cause not known are in Rajasthan. The Executive Summary says: "Rajasthan has reported that causes of 63 deaths in 2022, 35 deaths in 2023 and 57 deaths in 2024 were not known."
- These are deaths of prison inmates (judicial custody). They are not the deaths in police custody of CII Table 16A. Do not add the two.

### `human-trafficking-by-state-2024.csv` (962 rows)

- India and 36 States/UTs, CII 2024 Volume III. Table 14.1 (p. 1152): cases 2022 and 2023, cases 2024 under the IPC, under the BNS and both (`law` `ipc`, `bns`, `ipc-bns`), mid-year projected population, rate and charge-sheeting rate. Tables 14.3 (p. 1157, victims trafficked) and 14.4 (p. 1158, victims rescued), by `age` (`below-18`, `above-18`, `all`) and `sex` (`male`, `female`, `total`).
- NCRB: "Human Trafficking data published is based on annual data as provided by States/UTs from their Anti Human Trafficking Units". The chapter text adds: "This data represents only those human trafficking cases which are reported to respective AHTUs."
- **Rate or count.** NCRB prints a rate ("Cases Reported per 1 lakh population") to one decimal. It is 0.2 for India and 0.0 or 0.1 in 23 of the 36 States/UTs, so it does not separate the states. The chart shows the counts with `total: true`, as the district pendency chart does, and says that they are counts. The rate stays in the CSV.
- Rescued victims "include victims from previous year cases or cases registered in other States" (Table 14.4 note).

### `missing-children-by-state-2024.csv` (888 rows)

- India and 36 States/UTs, CII 2024 Volume III, Table 15.1 "Missing and Traced Children (Below 18 Years)" (pp. 1167 and 1168), by `sex` (`boys`, `girls`, `transgender`, `total`).
- **Counting periods.** `untraced-from-previous-years` (children missing before 2024 and not traced by the start of 2024), `missing-in-year` (reported missing in 2024), `total-missing` (the two together), `traced-in-year` (traced during 2024, whenever they went missing: "Total Recovered Data includes Missing Children from previous years"), `recovery-percentage` (NCRB: traced / total missing x 100), `untraced-at-year-end`.
- The recovery percentage is "-" for Mizoram and Lakshadweep, which report no missing children; empty here.

## Gaps and cautions

**Recorded crime is not all crime**

- NCRB counts FIRs that the police register. Its "Word of Caution" (CII 2024, page ix) says: "'Rise in crime' and 'increase in registration of crime by police' are clearly two different things", and "Increase in crime numbers in a State police data may in fact be on account of certain citizen centric police initiatives, like launching of e-FIR facility or women Helpdesks". It also says that comparing states on these data alone "will be too simplistic and is best avoided". Every state table carries the footnote "States/UTs may not be compared purely on the basis of crime figures".
- So a high rate can mean better registration, not more crime, and a low rate can mean under-registration. Kerala (1,389.0) and Delhi (1,360.2) have the highest total rates in 2024; Nagaland (61.6) and Dadra and Nagar Haveli and Daman and Diu (42.7) the lowest. Say this caution on every state chart.
- **Principal offence rule.** "If many offences are registered in a single FIR case, only the most heinous crime i.e. the one that attracts maximum punishment will be considered as counting unit" (Methodology, B(a)). Lesser offences in the same FIR are not counted, so head-wise counts understate them.
- NCRB gives "no weightage ... to the gravity or nature of the crime". The total adds a murder and a liquor-law case as one each. SLL cases (for example 7,97,026 under state prohibition acts in 2024) are a large part of the total. Gujarat's total rate (847.0) is far above its IPC/BNS rate (227.7).
- Manipur's 2023 IPC count (19,192, against 3,029 in 2022 and 4,572 in 2024) and its 10.4% charge-sheeting rate in 2024 are outliers. The tables give no reason.

**Prisons**

- PSI 2024 was revised. The first release (6 May 2026) used West Bengal's 2023 data. NCRB received West Bengal's 2024 data on 13 Jul 2026 and released the revised report (file dated 15 Sep 2026). Both versions stay on the NCRB site. We use the revised report. Old values from the first release:

  | Geography | Measure | First release (6 May 2026) | Revised (15 Sep 2026) |
  | --- | --- | ---: | ---: |
  | West Bengal | Inmates | 25,774 | 23,244 |
  | West Bengal | Occupancy rate | 120.0% | 108.2% |
  | West Bengal | Undertrial share | 78.7% | 76.3% |
  | India | Inmates | 5,11,542 | 5,09,012 |
  | India | Occupancy rate | 112.7% | 112.2% |
  | India | Undertrial share | 72.6% | 72.5% |

- The prison figures are a count on one day (31 December), not an average over the year.
- The undertrial share counts all undertrials, including people held for a short time. It does not show how long they have been held.

**Court pendency**

- The answers quote NJDG on the stated date. NJDG is a live dashboard and changes as courts update it. Counts for nearby dates can differ by more than the change in pendency could explain. Gujarat: 19,67,723 (9 Mar 2026), 20,69,656 (13 Mar 2026), 15,60,074 (23 Mar 2026). Do not read a change between two nearby dates as a trend. Use the year-end series of LS 3295 for a trend.
- **LS 3371 "More than 5 years".** Its counts are below the "More than 10 years" counts for some courts (Allahabad High Court: 4,89,981 over 10 years, 2,41,591 "more than 5 years"). The column probably counts cases pending 5 to 10 years: RS 597 gives 1,48,45,848 district cases over 5 years and 54,37,032 over 10 years on 16 Jul 2026; the difference, 94,08,816, is close to LS 3371's 93,97,617 on 30 Jul 2026. The answer does not say so. We keep the label and a note, and the chart should not use this column. RS 597 gives cumulative age bands (more than 30, 20, 10, 5 and 1 year).
- LS 3501 (9 Mar 2026) has a Meghalaya row where civil (4,917) plus criminal (4,917) does not equal the total (16,671). We keep the published digits and a note. Some LS 3501 numbers are printed with irregular commas (for example "6,076,736", "31,1033", "51,40"); the digits are kept.
- Pendency is a count of cases, not a rate. States with more people have more cases. The answers give no population or judge base.

**Scheduled Castes and Tribes, custody, trafficking and missing children (added 27 Nov 2026)**

- Every table here says "As per data provided by States/UTs". Most also say "States/UTs may not be compared purely on the basis of crime figures". The state charts have no rank.
- The SC and ST rates use the Census 2011 population of each group; the other CII rates use the 2024 projection.
- Deaths in police custody (CII Table 16A) and deaths in prisons (PSI Chapter 8) are separate counts from separate tables. NCRB does not reconcile them, and we do not add them.
- NHRC counts of deaths in custody are not used (see "How the files were found").
- Only 2024 was read. A trend in custodial deaths, trafficking or missing children would need the same tables from earlier CII editions.
- No city tables (Chapters 7B and 7D) were read.

**State boundaries**

- **Ladakh and Jammu and Kashmir** are separate UTs from 31 Oct 2019. CII and PSI 2024 have a row for each. CII 2017 to 2019 India totals include the former state. LS 3295 leaves Ladakh blank for 2021 and 2022 (empty in the CSV); the answer does not say whether the Jammu and Kashmir row includes it. One High Court serves both (`jammu-kashmir-ladakh`).
- **Dadra and Nagar Haveli and Daman and Diu** merged on 26 Jan 2020. CII 2024, PSI 2024 and every pendency answer give one row (`dnh-dd`). The Bombay High Court serves it.
- **Telangana** has its own rows in every source here (all are after 2014). The Telangana High Court is separate from the Andhra Pradesh High Court.
- **High Courts and states.** Seven High Courts serve more than one State/UT (Bombay, Calcutta, Gauhati, Jammu and Kashmir and Ladakh, Kerala, Madras, Punjab and Haryana). Do not put High Court pendency on a state map.
- NCRB's Delhi row is the whole UT. City tables (not used) use 2011 Census populations, so city and state rates are not comparable (Disclaimer, item 3).

**Not covered**

- Murder and women rates before 2017, and counts before 2015: CII 2016 and earlier were not read.
- A conviction rate or charge-sheeting rate trend: possible from earlier CII Volume III tables, not built.
- Prison data before 2014: PSI 2015 and earlier were not read.
- Pendency answers before July 2025 (Lok Sabha) and before session 270 (Rajya Sabha) were not searched.

## Checks (25 and 27 Nov 2026)

`build_ncrb.py` and `build_pendency.py` stop with an error if any of these values differs. Each value was read from the text of the publisher's PDF, which `pdftotext -layout` keeps in table order. Page numbers are the printed page numbers.

| CSV | Value checked | Published table |
| --- | --- | --- |
| `crime-by-state-2024.csv` | India 418.9; Kerala 1,389.0; Nagaland 61.6 (total cognizable crime rate, 2024) | CII 2024 Table 1A.3, p. 13 |
| `crime-india-trend.csv` | 2015 total rate 374.1 (CII 2017 Table 1.1); 2020 total rate 487.8 (CII 2022 Table 1.1); 2019 murders 28,915 (CII 2021 Table 2A.1); 2021 crimes against women rate 64.5 (CII 2021 Table 3A.1) | As named |
| `ipc-crimes-india-1981-2024.csv` | 1981 rate 200.8; 2020 rate 314.3; 2024 cases 35,44,608 | CII 2024, At a glance, p. x |
| `murder-by-state-2024.csv` | India 27,049 murders; Uttar Pradesh 3,218; Jharkhand rate 3.7 | CII 2024 Table 2A.1, p. 233 |
| `crimes-against-women-by-state-2024.csv` | India rate 64.6; Telangana 128.6; Delhi 13,396 cases | CII 2024 Table 3A.1, p. 281 |
| `police-and-court-disposal-by-state-2024.csv` | India charge-sheeting rate 72.1 (Table 17A.2, p. 1204); India conviction rate 53.3; West Bengal conviction rate 7.1 (Table 18A.2, p. 1288) | CII 2024 Volume III |
| `prisons-by-state-2024.csv` | India occupancy 112.2%; Delhi 194.6% (Table 1.2, p. 20); Bihar undertrial share 87.2% (Table 2.2, p. 47) | PSI 2024, revised |
| `prisons-india-trend.csv` | 2014 occupancy 117.4% (PSI 2016); 2022 occupancy 131.4% (PSI 2024); 2024 undertrial share 72.5% (derived, equals PSI 2024 Table 2.2) | Executive Summaries |
| `court-pendency-district-by-state.csv` | Uttar Pradesh 1,19,90,328 on 30 Jul 2026 (LS 3371 Annexure-II); Lakshadweep 26 over 10 years on 16 Jul 2026 (RS 597 Annexure-II); Bihar 32,76,696 in 2021 (LS 3295 Annexure-II) | As named |
| `court-pendency-high-courts.csv` | Allahabad 12,28,281 and Supreme Court 95,954 on 30 Jul 2026 (LS 3371 Annexure-I); Madras criminal 75,555 on 9 Mar 2026 (LS 3501 Annexure-I) | As named |
| `crimes-against-scs-sts-by-state-2024.csv` | India 55,698 cases and rate 27.7, Uttar Pradesh 14,642, Madhya Pradesh rate 68.5 (Table 7A.1, p. 655); India 9,966 cases and rate 9.5, Manipur 3,399 in 2023, Punjab rate "-" (Table 7C.1, p. 761) | CII 2024 Volume II |
| `deaths-in-police-custody-2024.csv` | India 65 deaths, 40 not on remand, 22 suicides, 28 from illness or in hospital; Gujarat 17 (Tables 16A.1 to 16A.3, pp. 1173 to 1175) | CII 2024 Volume III |
| `cases-against-police-personnel-2024.csv` | India 6,269, Chandigarh 4,069 (Table 16A.5, p. 1177); 13 human right violation cases, 4 encounter killings, 6 deaths in custody (Table 16A.6, p. 1178) | CII 2024 Volume III |
| `prison-deaths-2024.csv` | India 1,953 deaths, 1,727 natural, 1,652 from illness, 126 suicides; Rajasthan 57 not known; Uttar Pradesh 330 (Tables 8.1, 8.2, 8.4, pp. 189 to 193) | PSI 2024, revised |
| `human-trafficking-by-state-2024.csv` | India 2,135 cases, Telangana 423 (Table 14.1, p. 1152); India 6,018 victims, 2,297 below 18, Odisha 1,039 (Table 14.3, p. 1157); India 5,839 rescued (Table 14.4) | CII 2024 Volume III |
| `missing-children-by-state-2024.csv` | India 98,375 missing in 2024, 98,826 traced, 67.1%; West Bengal 15,849 missing; Odisha 26.4%; Mizoram "-" (Table 15.1, pp. 1167 and 1168) | CII 2024 Volume III |

Other checks in the scripts: the states in each pendency table add up to its Total row; in every table added on 27 Nov 2026, the 36 State/UT rows add up to the India row in each count column; the parts of each row add up to its total (IPC + BNS trafficking cases; Table 16A.1 + 16A.2 deaths = the Table 16A.2 total = the Table 16A.3 total; the reasons in 16A.3; the six types in 16A.6; natural + un-natural + not known = total, and Tables 8.2 and 8.4 = the natural and un-natural columns of 8.1; previous years + 2024 = total missing, and total missing - traced = untraced, for boys, girls and transgender children); LS 2362 equals LS 3295 for 2023 to 2025; inmates in PSI Table 1.2 equal inmates in Table 2.1; inmates in the two Executive Summary tables agree for every year.

## Raw files

Read 25 Nov 2026. Paths are relative to `raw/crime/`. `pipeline/crime/sources.tsv` lists the same paths and URLs. Run from the repository root:

```sh
pipeline/crime/fetch.sh                    # downloads every file in sources.tsv; logs sha256 to raw/crime/<dir>/_log.tsv
pipeline/crime/extract_text.sh             # pdftotext -layout, one .txt per PDF in work/crime/
python3 -I pipeline/crime/build_ncrb.py
# or only the parts added on 27 Nov 2026, which need only cii-2024/volume2, cii-2024/volume3 and psi-2024/report-revised:
# python3 -I pipeline/crime/build_ncrb.py --only sc-st custody trafficking-missing prison-deaths
python3 -I pipeline/crime/build_pendency.py
```

NCRB file URLs start with `https://www.ncrb.gov.in/uploads/`. Lok Sabha eLibrary URLs start with `https://elibrary.sansad.in/server/api/core/bitstreams/`.

| Raw file | Release | URL (after the prefix) | SHA-256 |
| --- | --- | --- | --- |
| `cii-2024/volume1.pdf` | CII 2024, Volume I | `files/11CrimeinIndia2024-VolumeI.pdf` | `5c119c907c8b194e0bcde8cf6ef63392ff9923dfb159a8780607f54719a79cb8` |
| `cii-2024/volume2.pdf` | CII 2024, Volume II (Glossary, Disclaimer, and Tables 7A.1 and 7C.1 from 27 Nov 2026) | `files/2CrimeinIndia2024-VolumeII.pdf` | `423af46b6704338d9241fc95411fbca706b70662e79becdd4dc8f7ab0c16ae50` |
| `cii-2024/volume3.pdf` | CII 2024, Volume III (Chapters 17A and 18A; Chapters 14, 15 and 16A from 27 Nov 2026) | `files/3CrimeinIndia2024-VolumeIII1.pdf` | `ab326640371b167c0d98fed0bf747274c559b9b33d9017ed91c80799f9be2fc0` |
| `cii-2024/glossary.pdf` | CII 2024, Glossary | `files/13Glossary2024.pdf` | `1463e99cb3faba5502fd5fa2399035c01082ddab6b6cefc03d6ec87af4c5b53a` |
| `cii-2024/methodology.pdf` | CII 2024, Methodology (standalone) | `files/7CIIMethodology2024.pdf` | `1afe0176ddd67ce146daf741f8294b4986528448c6c7099163120c88900877f7` |
| `cii-2024/disclaimer.pdf` | CII 2024, Disclaimer and Limitations (standalone) | `files/6DisclaimerandLimitations1.pdf` | `eb2bfa25523301ddbd2e04b4f358bbfc66e2c696374783ca68aaac9ea400a6a7` |
| `cii-2024/word-of-caution.pdf` | CII 2024, A Word of Caution | `files/8WordofCaution2024.pdf` | `f2295d3cc2cc3aa92aebfb1d7a0ff127ac484f6449602beb920e4852860382e3` |
| `cii-2024/snapshots-states.pdf` | CII 2024, Snapshots (States/UTs) | `files/9ACII2024Snapshots-StateandUTs.pdf` | `207d0209b447104d88f4ef5f239d470857b81d4a21dfd3aaf6fb82683d0b2060` |
| `cii-2024/population.pdf` | CII 2024, Annexure (population) | `files/12Population2024.pdf` | `e68cdbd06c96f823c3fe03e82aeded719bc3bcdfe52b650da6a467d9778ab62c` |
| `cii-2024/foreword.pdf` | CII 2024, Foreword (image only, no text) | `files/5FOREWORD-CII-2024.pdf` | `3ffb4303d681355625d9c9af9e3fdc9f24ab0e5dde28531bf728e11f4fea0356` |
| `cii-2023/volume1.pdf` | CII 2023, Volume I | `files/1CrimeinIndia2023PartI1.pdf` | `e7331959b62406cb6a569e5c9735421c6a0215277b0443f6c5b52d9c266cb7f9` |
| `cii-2022/volume1.pdf` | CII 2022, Volume I | `nationalcrimerecordsbureau/custom/1701607577CrimeinIndia2022Book1.pdf` | `7c5ee3128b0b6bc7c068f986961eaf40bb383d9f241ff75ad3a38e4ab3c23e8d` |
| `cii-2021/volume1.pdf` | CII 2021, Volume I | `nationalcrimerecordsbureau/custom/1696831798CII2021Volume1.pdf` | `73fdca563e0ef7a867341ce9083bf744598f6a8ee92ce9988740627862399397` |
| `cii-2020/volume1.pdf` | CII 2020, Volume I | `nationalcrimerecordsbureau/post/16959885631653645869CII2020Volume1.pdf` | `103f1dd03bf707d006da5da3ad60ce8c51ed010dfef03b848f81161facdf9bb0` |
| `cii-2019/volume1.pdf` | CII 2019, Volume I | `nationalcrimerecordsbureau/custom/1653730573_CII%202019%20Volume%201.pdf` | `84a381dc748716ef97dafdd44b202102bc43d833b5f67c10799f667f03ce6bd0` |
| `cii-2018/volume1.pdf` | CII 2018, Volume I | `nationalcrimerecordsbureau/custom/1653734481_Crime%20in%20India%202018%20-%20Volume%201_3_0_0.pdf` | `07d9b0b12281729a284639d900d942550082965a97de4366c90f38e5327ed8c8` |
| `cii-2017/volume1.pdf` | CII 2017, Volume I | `nationalcrimerecordsbureau/post/16959893381653885627CrimeinIndia2017-Volume100.pdf` | `c57a514b3dcd6412d93f50637ac0dc37dad0b9e7b34288c07a8931e764f63059` |
| `psi-2024/report-revised.pdf` | PSI 2024, revised report with West Bengal data (Chapter 8 from 27 Nov 2026) | `files/PSI-2024Ason15092026.pdf` | `357736d1e63bf0a3b8638d5d61b366585c560047009a9adcb97b15d92c5a1ace` |
| `psi-2024/report-original.pdf` | PSI 2024, first release of 6 May 2026 | `files/PSI-2024ason260220261.pdf` | `4f82f813fe1fb36d7a8ec07a0d81891662aabb1933b0c8129719a5d29346cdb4` |
| `psi-2024/disclaimer-corrigendum.pdf` | PSI 2024, Disclaimer and Corrigendum | `files/DisclaimerCorrigendum-20241.pdf` | `d3b03e9a857bc2e4535f2a4be422ad601017e210179b7339555cf0766c9e6bbf` |
| `psi-2024/methodology.pdf` | PSI 2024, Methodology | `files/Methodology-20241.pdf` | `f2feba1b5f9fc959757611a03ec2e089be7a65e20a578ba11d34ca5b5ee88f31` |
| `psi-2024/executive-summary.pdf` | PSI 2024, Executive Summary (revised figures) | `files/ExecutiveSummary-2024.pdf` | `a95ed28ba81f25130c4aa9ae241d5b276069d5916db4b2949243911dda10d367` |
| `psi-2023/report.pdf` | PSI 2023 (read for the West Bengal coverage only) | `files/PSI-20231.pdf` | `d9bf975c473fb47798a2dbda1caf3452edbfca43246cdf9fc6660081ff229e3b` |
| `psi-2023/executive-summary.pdf` | PSI 2023, Executive Summary | `files/ExecutiveSummary2023.pdf` | `e90749ccbc365280187caff9fbd6055efe3bbcb5ff50385d6bb62a0a534ff7d8` |
| `psi-2022/executive-summary.pdf` | PSI 2022, Executive Summary | `nationalcrimerecordsbureau/custom/psiyearwise2022/170161282705ExecutiveSummary2022.pdf` | `bddbd9e4ea6a0601475f44ef8498ea47a80ae6a16c48fcd61db5f8c38484562a` |
| `psi-2021/executive-summary.pdf` | PSI 2021, Executive Summary | `nationalcrimerecordsbureau/custom/1670309599_Executive_ncrb_Summary-2021.pdf` | `cc9df26b4d7772264848459cc5e108094325e222901601f6518c9b397bb929b0` |
| `psi-2020/executive-summary.pdf` | PSI 2020, Executive Summary | `2022/July/11/custom/psi/executive_ncrb_summary-2020.pdf` | `991789c09bfae31a7797d1e4a21c7ec0e9e40f4e64c1776c7f4a1f2ec537c285` |
| `psi-2019/executive-summary.pdf` | PSI 2019, Executive Summary | `nationalcrimerecordsbureau/post/1679133917Executive-Summary-2019.pdf` | `d0ea73ed017397c9957c20d701eb5153f1c0f6645ca35b055646f5c66c73666b` |
| `psi-2018/executive-summary.pdf` | PSI 2018, Executive Summary | `2022/July/11/custom/psi/psi-executive-summary-2018.pdf` | `046a160c100786003a04b328cc8563712cb60545f4f4c1bc086728388cf3a7fd` |
| `psi-2017/executive-summary.pdf` | PSI 2017, Executive Summary | `2022/July/11/custom/psi/psi-executive-summary-2017.pdf` | `3724dd61ef92b30366374a48301f4f30744c33d6c492d583927d028117e787b5` |
| `psi-2016/executive-summary.pdf` | PSI 2016, Executive Summary | `2022/July/11/custom/psi/psi-executive-summary-2016.pdf` | `bf7dcbdc5e63615b0afdb88bc068c23c720fec05bdd52418a2ff457d2d623061` |
| `pendency/ls/ls-2142-2025-08-01.pdf` | Lok Sabha USQ 2142, "Backlog of Pending Cases", 1 Aug 2025 | `e2576c20-33d4-4e98-b2e0-a74d5489d1cd/content` | `db1fa98f99a7302a2252162a8c2c10c65ee17064d5c16d0b5047ead6e22ab3e5` |
| `pendency/ls/ls-2362-2026-02-13.pdf` | Lok Sabha USQ 2362, "Pendency of Cases", 13 Feb 2026 (check only) | `8d55130f-4a93-4ed4-a67e-78a1892462db/content` | `69feb96cb9a764240f87014d6723d2651c8ca9f0bbead6e4d768847d0905c17f` |
| `pendency/ls/ls-3501-2026-03-13.pdf` | Lok Sabha USQ 3501, "Pendency of Cases in Courts", 13 Mar 2026 | `bc189bf0-c9e6-436c-b9e0-2f37abc15f5e/content` | `f90f38e1b564b09ccf22f7b4c1517fececa4097ecd5fa2645851220b91b278a2` |
| `pendency/ls/ls-5553-2026-03-27.pdf` | Lok Sabha USQ 5553, "Current Number of Pending Cases in Courts", 27 Mar 2026 | `a341dc3a-8b4b-4025-8c3d-5bc23dde0209/content` | `407f645ce004cd4f94a4dd75b417c578653b4087c56d948d13ea2a26312b6bc1` |
| `pendency/ls/ls-3295-2026-08-07.pdf` | Lok Sabha USQ 3295, "Case Pendency in Judiciary", 7 Aug 2026 | `66563714-2b9c-4a02-884f-3893b5b6e128/content` | `c49e011d36433bea5e2bed82c6427d731bb01f195e893c4f225142d8a192a5ac` |
| `pendency/ls/ls-3371-2026-08-07.pdf` | Lok Sabha USQ 3371, "Cases Pendency and e-Courts Project", 7 Aug 2026 | `https://sansad.in/getFile/lsapps/loksabhaquestions/annex/188/AU3371_Lq6K9K.pdf` (the eLibrary copy has the same sha256) | `da028b60785b79b058f3ec6c97bfa6ed1041e3dceff471fc75d997d4e62d1ca7` |
| `pendency/rs/rs-3113-2026-03-19.pdf` | Rajya Sabha USQ 3113, "Pendency of cases", 19 Mar 2026 | `https://sansad.in/getFile/annex/270/AU3113_pQVi82.pdf?source=pqars` | `49c3f58508ac3c3fdb33ba4562fe4650c97d57d8ada8c9097d8231cec97962f0` |
| `pendency/rs/rs-597-2026-07-23.pdf` | Rajya Sabha USQ 597, "Pending cases in Indian courts", 23 Jul 2026 | `https://sansad.in/getFile/annex/271/AU597_ZRzDHo.pdf?source=pqars` | `dea16ae6dcd284d0f6b88456ae8f14f8b1c40cb63602ec8a472781a9e6b38ff1` |

## Proposed charts

Kinds are from `src/content/types.ts`. Status words: state charts of recorded crime need the registration caution; pendency charts quote a dated Parliament answer (not `Snapshot`, because each answer is a dated release, rule R4).

| Slug | Kind | CSV and rows | Period | Why |
| --- | --- | --- | --- | --- |
| `crime-rate-by-state` | `states` | `crime-by-state-2024.csv`, `indicator=crime-rate`, `law=ipc-bns-sll` | 2024 | The headline NCRB measure for every State/UT, with India's 418.9. Copy must carry the registration caution. |
| `crime-rate-india` | `line` | `crime-india-trend.csv`, `crime_head=all-cognizable`, `indicator=crime-rate`, three `law` series | 2015 to 2024 | Shows the national rate and its split into IPC/BNS and SLL, with breaks at 2018, 2020 and 2024 (BNS). |
| `murder-rate-by-state` | `states` | `murder-by-state-2024.csv`, `indicator=murder-rate` | 2024 | One well-defined crime head (Section 302 IPC, Section 103 BNS), beside the total rate. |
| `crimes-against-women-by-state` | `states` | `crimes-against-women-by-state-2024.csv`, `indicator=crime-rate` | 2024 | Rate per lakh women, the NCRB measure most often asked about. |
| `chargesheeting-and-conviction-by-state` | `dots` | `police-and-court-disposal-by-state-2024.csv`, `indicator` in (`chargesheeting-rate`, `conviction-rate`) | 2024 | Two dots per state show where cases stop: at the police or in court (West Bengal: 90.6% charge-sheeted, 7.1% convicted). |
| `prison-occupancy-by-state` | `states` | `prisons-by-state-2024.csv`, `indicator=occupancy-rate`, `sex=total` | 31 Dec 2024 | Overcrowding by state (Delhi 194.6%), with 100% as the reference. |
| `undertrials-by-state` | `states` | `prisons-by-state-2024.csv`, `indicator=undertrial-share` | 31 Dec 2024 | 72.5% of prisoners are undertrials. The share ranges from 42.5% (Andaman and Nicobar Islands) to 97.4% (Dadra and Nagar Haveli and Daman and Diu); Lakshadweep's 100.0% is 5 inmates. |
| `prisons-india` | `line` (two panels) | `prisons-india-trend.csv`, `occupancy-rate` and `undertrial-share` | 2014 to 2024 | The national trend of both prison measures; the share is `derived`. |
| `district-court-pendency-by-state` | `states` (`total: true`) | `court-pendency-district-by-state.csv`, `period=2026-07-30`, `case_type=all`, `pending_for=all` | 30 Jul 2026 | 4,99,11,920 cases pending, by State/UT. Counts, not a rate: say so. |
| `court-pendency-india` | `columns` | `court-pendency-district-by-state.csv` (`india`) and `court-pendency-high-courts.csv` (`high-courts-total`), periods 2021 to 2025-12-31 | 2021 to 2025 | The year-end trend from one answer (LS 3295), district courts and High Courts side by side. |
| `crimes-against-scheduled-castes-by-state` | `states` (`noRank`) | `crimes-against-scs-sts-by-state-2024.csv`, `group=scheduled-castes`, `indicator=crime-rate` | 2024 | NCRB gives a rate, so the chart uses it, as the other recorded-crime state charts do. Base: Census 2011 SC population. |
| `crimes-against-scheduled-tribes-by-state` | `states` (`noRank`) | same file, `group=scheduled-tribes` | 2024 | As above, for STs. |
| `deaths-in-police-custody-by-cause` | `bars` | `deaths-in-police-custody-2024.csv`, `geography=india`, `remand=all`, the seven causes | 2024 | The 65 deaths by the cause the police recorded (Table 16A.3). |
| `prison-deaths-by-cause` | `bars` | `prison-deaths-2024.csv`, `geography=india`, the causes with at least one death and `not-known` | 2024 | Kept apart from police custody. |
| `cases-against-police-human-right-violation` | `bars` | `cases-against-police-personnel-2024.csv`, `category=human-right-violation`, `indicator=cases-registered` | 2024 | NCRB's own category, quoted. India only. |
| `human-trafficking-by-state` | `states` (`noRank`, `total`) | `human-trafficking-by-state-2024.csv`, `indicator=cases`, `law=ipc-bns` | 2024 | Counts, not the rate: the rate is 0.0 or 0.1 in 23 States/UTs (see the CSV notes). |
| `missing-children-traced-by-state` | `states` (`noRank`) | `missing-children-by-state-2024.csv`, `indicator=recovery-percentage`, `sex=total` | 2024 | NCRB's recovery percentage; the subtitle states both counting periods. |

Not proposed: a High Court map (seven courts serve several States/UTs), the LS 3371 "more than 5 years" column (see cautions), and a BNS-only series (NCRB gives no BNS-only rate).
