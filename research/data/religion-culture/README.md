# Religion and culture

Read the original topic tables on 17 Nov 2026. Read the national religion trend sources on 18 Nov 2026.

Census 2011 is the latest count of religion and language. The India religion trend also uses earlier censuses.
Census 2027 will ask about religion, caste and mother tongue again (questionnaire notified 14 Aug 2026).
No results from it are published yet. No newer official count of religion or language exists.

The religion tables count the religion reported to the Census. In 1981 most records use the religion
of the household head. The shares use published counts and cover the population in each religion table.

## Questions this topic answers

1. What religions do people in India report, and in what numbers?
2. How does the religious makeup differ between states?
3. How did the shares change between 1951 and 2011?
4. Which languages do people speak as their mother tongue?
5. What is the main language in each state?

## Charts

Source blocks give publisher, table and period. See "Sources" for URLs and checksums.

### rel-01: Population by religion, India, 2011

- Type: bar (horizontal), with counts and shares. Optional toggle: total, rural, urban.
- Unit: persons; percent of population (derived).
- Geography: India. Period: Census 2011.
- CSV: `religion-india-2011.csv`.
- Sentence: "In 2011, 966,257,353 people in India (79.80%) reported their religion as Hindu, 172,245,158
  (14.23%) as Muslim and 27,819,588 (2.30%) as Christian. 2,867,303 people (0.24%) did not state a religion."
- Source: ORGI, Census of India 2011, Table C-01 "Population by religious community", India.
- Notes: "Other religions and persuasions" (7,937,734) groups many smaller faiths. The largest within it
  is Sarna (4,957,467), per the C-01 appendix.

### rel-02: Religion by state, 2011

- Type: stacked bar by state (100%), and tile map by state for one religion at a time.
- Unit: percent of state population (derived); persons.
- Geography: India and 35 Census 2011 units mapped to geography.csv slugs. Period: Census 2011.
- CSV: `religion-by-state-2011.csv`.
- Sentence: "In 2011, Hindus were the largest group in 28 of 35 states and union territories. Muslims
  were the largest group in Lakshadweep (96.58%) and Jammu and Kashmir (68.31%), Sikhs in Punjab (57.69%),
  and Christians in Nagaland (87.93%), Mizoram (87.16%), Meghalaya (74.59%) and Arunachal Pradesh (30.26%)."
- Source: ORGI, Census of India 2011, Table C-01, India and States.
- Notes: `andhra-pradesh` is undivided (includes Telangana). `jammu-kashmir` includes Ladakh. `telangana`
  and `ladakh` rows are empty. `dnh-dd` is the sum of two 2011 UTs.

### rel-03: Population share by religion in India, 1951 to 2011

- The line chart uses three scales. The 1981 household-head values are separate points. The 1951
  Others category is also a separate point because the paper uses one combined category.
- Each row of `religion-india-1951-2011.csv` gives a published count and a derived share of all
  people covered by the religion table. `population_covered_type` identifies derived denominators.
- Run `python3 -I pipeline/religion-culture/build_religion_trend.py` from the repository root. The
  script uses verified transcriptions from the printed tables and reads the three workbooks.
- All 16 counts and shares for 2001 and 2011 match `religion-india-2001-2011.csv`. The eight 2011
  values also match the India total rows in `religion-india-2011.csv`.

#### Coverage and overlap checks

| Census | Coverage and check |
| --- | --- |
| 1951 | Paper 1 of 1963, pp. ii-vii, gives a population total of 361,088,090. Its religion columns exclude Jammu and Kashmir, Pondicherry and the North East Frontier Agency. The percentage denominator also excludes 268,602 people in Punjab because their religion breakdown was unavailable. The denominator of 357,248,383 is the sum of the published counts. All seven calculated shares match the printed shares to two decimals. The paper also says the 1951-61 total population growth comparison excludes Tuensang district of Nagaland because comparable 1951 figures are unavailable. |
| 1961 | Statement I in the 1971 report gives an India total of 439,072,582. This excludes Sikkim. Its religion columns exclude Arunachal Pradesh, where the Census could not use the general all-India schedule. Subtract Arunachal Pradesh's population of 336,558 for a denominator of 438,736,024. Paper 1 of 1963 gives a broader total of 439,234,771 and includes Sikkim separately. Its counts differ from the 1971 report's comparison row. Use Statement I because it puts 1961 and 1971 on the report's India boundary and splits Others and Religion not stated. |
| 1971 | Statement I and Union Table C-VII give 547,949,809. This India total excludes Sikkim, which the 1984 paper lists separately for 1971. The 1984 paper gives a different 1971 comparator total of 533,534,500 and excludes Assam from its India comparison. Use the 1972 release for 1971. The Hindu share is 82.73% from the counts. The release prints 82.72%. |
| 1981 | Table HH-15 gives 665,287,849 people. It says Assam was excluded because the census could not be held in the conditions prevailing there. Normal and houseless households use the head's religion. Institutional households use individual returns. The 1981 handbook also reports this method. Its Table 65 prints some shares at different rounding, for example 82.63% Hindu and 11.36% Muslim. The chart uses the Table HH-15 counts, which give 82.64% and 11.35%. |
| 1991 | Table C-9 excludes Jammu and Kashmir, where the census was not held. The workbook and Paper 1 of 1995 agree on the India total and all eight counts. The paper explains the gap of 16,052 between the counts and the total. The census could not be conducted in 33 villages of Akrani and Akkalkuwa tehsils of Dhule district, Maharashtra. ORGI included their population from secondary sources and had no further detail. Subtract it from 838,583,988 to get the religion denominator, 838,567,936. |
| 2001 | C-01 excludes Mao-Maram, Paomata and Purul sub-divisions of Senapati district, Manipur. Its total of 1,028,610,328 is 127,108 below Table A-02, which includes estimates for those areas. The 2011 drop-in article gives rounded 2001 shares plus approximate counts. The article rounds Hindu, Muslim, Christian, Sikh, Buddhist and Jain shares to the same one-decimal values as the C-01 counts. Its Other religions share is 0.6% from the unrounded counts (0.65% at two decimals). |
| 2011 | Use the national C-01 total of 1,210,854,977. All eight counts sum to that total. |

### lang-01: Languages by mother-tongue speakers, India, 2011

- Type: ranked bar (22 scheduled languages; option to show the largest non-scheduled ones).
- Unit: persons; percent of population (derived).
- Geography: India. Period: Census 2011.
- CSV: `languages-india-2011.csv`.
- Sentence: "In 2011, 528,347,193 people (43.63%) gave a mother tongue grouped under Hindi. Bengali came
  second with 97,237,669 (8.03%), then Marathi with 83,026,680 (6.86%)."
- Source: ORGI, Census of India 2011, Table C-16 "Population by mother tongue", India (language statement).
- Notes: Census groups mother tongues under a language. Hindi here includes Bhojpuri (50,579,447) and
  other mother tongues grouped under Hindi. The file has all 121 languages listed in C-16 plus "Others".
  Bhili/Bhilodi (10,413,637) is the largest language outside the Eighth Schedule.

### lang-03: Count of languages, India, 2011

- CSV: `languages-count-2011.csv` (added 18 Nov 2026). Derived: three rows that count the language rows of
  `languages-india-2011.csv`: 121 languages with 10,000 or more speakers, 22 scheduled (`scheduled_language`
  yes) and 99 other (no). The "Others" row is not counted. It backs the third headline figure.

### lang-02: Main languages in each state, 2011

- Type: tile map by state (colour by largest language), table of top 3 with shares.
- Unit: persons; percent of state population (derived).
- Geography: India and 35 Census 2011 units. Period: Census 2011.
- CSV: `languages-top3-by-state-2011.csv`.
- Sentence: "In 2011, 97.03% of people in Kerala gave Malayalam as their mother tongue. In Nagaland, the
  largest language, Konyak, was the mother tongue of 12.34%."
- Source: ORGI, Census of India 2011, Table C-16, India and States.
- Notes: the "Others" group is left out when ranking. Hindi is the largest language in 11 states and UTs.

## Headline figures

| Figure | Period | Source |
| --- | --- | --- |
| 79.80% of people reported Hindu, 14.23% Muslim, 2.30% Christian, 1.72% Sikh, 0.70% Buddhist, 0.37% Jain | Census 2011 | ORGI, Census 2011, Table C-01 |
| 2,867,303 people did not state a religion (0.24%) | Census 2011 | ORGI, Census 2011, Table C-01 |
| 43.63% gave a mother tongue grouped under Hindi | Census 2011 | ORGI, Census 2011, Table C-16 |
| 22 scheduled languages and 99 other languages listed, each with 10,000 or more speakers | Census 2011 | ORGI, Census 2011, Table C-16 |

## Sources

Read date for all rows: 17 Nov 2026. Raw downloads are not kept in the repository; the URL and sha256 below identify each file.
Parsing script: pipeline/religion-culture/build_religion.py (run with `python3 -I`).

| Publisher | Release / table | Release date | Data period | URL read | Licence | sha256 of raw file |
| --- | --- | --- | --- | --- | --- | --- |
| ORGI, Census of India | Census 2011 Table C-01, Population by religious community, India and States (Excel) | Catalog entry 21 Jan 2021 | 2011 | https://censusindia.gov.in/nada/index.php/catalog/11361/download/14474/DDW00C-01%20MDDS.XLS | Not stated. Catalog: "Rights Reserved" (ORGI) | c3fee2bb235f4ef511d9aaeceaf5f8026b48908f813c6d1cc06413a6c8a0d9cd |
| ORGI, Census of India | Census 2011 Table C-01 Appendix, communities under "Other religions and persuasions" | Catalog entry 21 Jan 2021 | 2011 | https://censusindia.gov.in/nada/index.php/catalog/11398/download/14511/DDW00C-01%20Appendix%20MDDS.xlsx | As above | e82148f2c8e2b7c757efcbcf8940169941b7b718627ed43210341e291022a79b |
| ORGI, Census of India | Census 2001 Table C-01, Population by religious community, India and States | Catalog entry 13 Feb 2021 | 2001 | https://censusindia.gov.in/nada/index.php/catalog/21462/download/24594/PC01_C01_00.xls | As above | b459efe12563a9a11650de36fa13570b619c9df4c136f07624593e59c745cc4e |
| ORGI, Census of India | Census 2011 Table C-16, Population by mother tongue, India and States (language statement) | Catalog entry 4 Jul 2022 | 2011 | https://censusindia.gov.in/nada/index.php/catalog/10191/download/13303/DDW-C16-STMT-MDDS-0000.XLSX | As above | b800cd544d7196c9bbc3c88ec1814138b8b7c8d4ccb7a5a2263a84e4bbf28f83 |
| ORGI | Gazette S.O. 4505(E): questions for Census 2027 phase II (includes religion, SC/ST/caste, mother tongue) | 14 Aug 2026 | Census 2027 | https://censusindia.gov.in/nada/index.php/catalog/47163/download/51410/GAZ_NOTIFICATION_15.pdf | As above | 02a1273c2f61c2f29f01969d801a6d66436225a28f581341df4c4058d8ae2170 |

### National religion trend inputs

ORGI published all the files below. Read on 18 Nov 2026. Paths are under `raw/religion-culture/`.

| Release | Release date | Local path | URL | SHA-256 |
| --- | --- | --- | --- | --- |
| Census 1961, Religion, Paper 1 of 1963 | 1963 | `census-1961-paper/report.pdf` | https://censusindia.gov.in/nada/index.php/catalog/31326/download/34507/53027_1961_REL.pdf | `1865419bd2855286199ea1d7479269b2390ce4445ca945627b9b376d1b8a9850` |
| Census 1971, Religion, Series 1 | 1972 | `census-1971-religion/report.pdf` | https://censusindia.gov.in/nada/index.php/catalog/31626/download/34807/24477_1971_REI.pdf | `ae2f34771312e5b99542186d9a61e30001ffb97fdc08ed6b68228317a885ff63` |
| Census 1981, Household Population by Religion of Head of Household, Paper 3 of 1984 | 1984 | `census-1981-religion/report.pdf` | https://censusindia.gov.in/nada/index.php/catalog/30879/download/34060/26795_1981_HH.pdf | `64fc02ea663d8e3b42295b10b7b7d857476bc04c347d1370d69c41701c277b94` |
| Census 1991, Table C-9, Religion, India | 17 Nov 2021 (catalogue entry) | `census-1991-c09/table.xlsx` | https://censusindia.gov.in/nada/index.php/catalog/35737/download/39400/1991-C09T-0100.xlsx | `62c7d9070465ff07637b197176f6e5a3764483173376b2872762fa0fcb0041ba` |
| Census 1991, Religion, Paper 1 of 1995 | 1995 | `census-1991-paper/report.pdf` | https://censusindia.gov.in/nada/index.php/catalog/32995/download/36813/48848_1991_REL.pdf | `a1a356e8c09ada29c603904061c53a9dc434aa037a3a1590d24787d1536adba2` |
| Census 2001, Table C-01, India | 13 Feb 2021 (catalogue entry) | `census-2001-c01/table.xls` | https://censusindia.gov.in/nada/index.php/catalog/21462/download/24594/PC01_C01_00.xls | `b459efe12563a9a11650de36fa13570b619c9df4c136f07624593e59c745cc4e` |
| Census 2011, Table C-01, India | 21 Jan 2021 (catalogue entry) | `census-2011-c01/table.xls` | https://censusindia.gov.in/nada/index.php/catalog/11361/download/14474/DDW00C-01%20MDDS.XLS | `c3fee2bb235f4ef511d9aaeceaf5f8026b48908f813c6d1cc06413a6c8a0d9cd` |
| Census 1981, A Hand Book of Population Statistics (cross-check) | 1988 | `census-1981-handbook/report.pdf` | https://censusindia.gov.in/nada/index.php/catalog/28122/download/31304/49962_1981_POR.pdf | `fd173d4d7a1ce63a9e5cffd170ce275adbfc9af933e9527cba8e3111bae8ec15` |
| Census 2011, Drop-in-Article No. 4, Distribution of Population by Religions (cross-check) | 2011 | `orgi-drop-in-article-04/article.pdf` | https://censusindia.gov.in/nada/index.php/catalog/40443/download/44077/DROP_IN_ARTICLE-04.pdf | `6aecb0686fc3a8e5b393e449e0dfcabbc02e47cff811c8bbfb14e4b812afb8c9` |

## Gaps and cautions

- No official count of religion or language after Census 2011 exists. Census 2027 will collect both
  (items 9, 10 and 14 of the phase II household schedule). In most states the count and its revision
  round end on 5 Mar 2027.
- NFHS-5 (2019-21, IIPS for MoHFW) reports the religion of household heads. It is a sample survey, not a
  census. I could not reach it: rchiips.org failed the TLS certificate check and the HTTP path returned 404
  (same result as in research/india-sources.md). Not found.
- Boundaries: Census 2011 has 35 units. Telangana is inside undivided Andhra Pradesh, and Ladakh inside
  the former state of J&K. I did not split them from district rows. `dnh-dd` values are sums of the two
  2011 UTs, marked "Derived".
- Shares are derived from counts (2 decimals). Census published counts, not these exact percentages in
  the tables used.
- Language is mother tongue as reported, grouped by the Census into languages. It is not "languages
  spoken". Bilingual and trilingual counts are in Table C-17, which I did not process.
- Religion 2001 to 2011: the 2001 C-01 total excludes three Manipur sub-divisions. Uttarakhand
  (Uttaranchal), Odisha (Orissa) and Puducherry (Pondicherry) appear under older names in 2001.
- Licence: no open licence is stated. The catalog pages say "Rights Reserved". Confirm reuse terms
  before publishing.

## Publisher check on 18 Nov 2026

The Census religion and language tables and the Census 2027 question notice all match their 17 Nov checksums. The ORGI catalogue shows no newer religion or mother-tongue counts.

| Release or file checked | Release date | URL | Fetched | SHA-256 |
| --- | --- | --- | --- | --- |
| ORGI Census 2027 catalogue search | Live list | https://censusindia.gov.in/nada/index.php/catalog/?sk=2027 | 18 Nov 2026 | `cc443d26b5f38ab98d7d9b9151b353fd7e3d8babb3cf899ae4d76f277222d2ad` |
| ORGI Census 2011 Table C-01, religion | Catalogue entry 21 Jan 2021 | https://censusindia.gov.in/nada/index.php/catalog/11361/download/14474/DDW00C-01%20MDDS.XLS | 18 Nov 2026 | `c3fee2bb235f4ef511d9aaeceaf5f8026b48908f813c6d1cc06413a6c8a0d9cd` |
| ORGI Census 2011 Table C-16, mother tongue | Catalogue entry 4 Jul 2022 | https://censusindia.gov.in/nada/index.php/catalog/10191/download/13303/DDW-C16-STMT-MDDS-0000.XLSX | 18 Nov 2026 | `b800cd544d7196c9bbc3c88ec1814138b8b7c8d4ccb7a5a2263a84e4bbf28f83` |
