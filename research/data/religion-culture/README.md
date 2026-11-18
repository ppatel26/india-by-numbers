# Religion and culture

Data gathered on 17 Nov 2026 from ORGI (Census of India). Every value was read from the publisher's own
file on that date.

All religion and language figures here come from Census 2011, the latest count. They are 15 years old.
Census 2027 will ask about religion, caste and mother tongue again (questionnaire notified 14 Aug 2026).
No results from it are published yet. No newer official count of religion or language exists.

Religion data in this folder reports what people told the census. Shares are exact arithmetic on the
published counts. Use the census category names as given.

## Questions this topic answers

1. What religions do people in India report, and in what numbers?
2. How does the religious makeup differ between states?
3. How did the shares change between the 2001 and 2011 censuses?
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

### rel-03: Religion shares, India, 2001 and 2011

- Type: slope chart or paired bar.
- Unit: percent of population (derived); persons.
- Geography: India. Period: Census 2001 and Census 2011.
- CSV: `religion-india-2001-2011.csv`.
- Sentence: "The Hindu share of the population was 79.80% in 2011, against 80.46% in 2001. The Muslim
  share was 14.23%, against 13.43%."
- Source: ORGI, Census of India 2001 and 2011, Table C-01, India.
- Notes: the 2001 total (1,028,610,328) leaves out three sub-divisions of Senapati district, Manipur,
  so it is 127,108 lower than the A-02 total that includes their estimate. Shares are not affected in a
  visible way, but say so in the chart note.

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

Read date for all rows: 17 Nov 2026. Raw files are in raw/religion-culture/ (not in the repo).
Parsing script: pipeline/build_religion.py (run with `python3 -I`).

| Publisher | Release / table | Release date | Data period | URL read | Licence | sha256 of raw file |
| --- | --- | --- | --- | --- | --- | --- |
| ORGI, Census of India | Census 2011 Table C-01, Population by religious community, India and States (Excel) | Catalog entry 21 Jan 2021 | 2011 | https://censusindia.gov.in/nada/index.php/catalog/11361/download/14474/DDW00C-01%20MDDS.XLS | Not stated. Catalog: "Rights Reserved" (ORGI) | c3fee2bb235f4ef511d9aaeceaf5f8026b48908f813c6d1cc06413a6c8a0d9cd |
| ORGI, Census of India | Census 2011 Table C-01 Appendix, communities under "Other religions and persuasions" | Catalog entry 21 Jan 2021 | 2011 | https://censusindia.gov.in/nada/index.php/catalog/11398/download/14511/DDW00C-01%20Appendix%20MDDS.xlsx | As above | e82148f2c8e2b7c757efcbcf8940169941b7b718627ed43210341e291022a79b |
| ORGI, Census of India | Census 2001 Table C-01, Population by religious community, India and States | Catalog entry 13 Feb 2021 | 2001 | https://censusindia.gov.in/nada/index.php/catalog/21462/download/24594/PC01_C01_00.xls | As above | b459efe12563a9a11650de36fa13570b619c9df4c136f07624593e59c745cc4e |
| ORGI, Census of India | Census 2011 Table C-16, Population by mother tongue, India and States (language statement) | Catalog entry 4 Jul 2022 | 2011 | https://censusindia.gov.in/nada/index.php/catalog/10191/download/13303/DDW-C16-STMT-MDDS-0000.XLSX | As above | b800cd544d7196c9bbc3c88ec1814138b8b7c8d4ccb7a5a2263a84e4bbf28f83 |
| ORGI | Gazette S.O. 4505(E): questions for Census 2027 phase II (includes religion, SC/ST/caste, mother tongue) | 14 Aug 2026 | Census 2027 | https://censusindia.gov.in/nada/index.php/catalog/47163/download/51410/GAZ_NOTIFICATION_15.pdf | As above | 02a1273c2f61c2f29f01969d801a6d66436225a28f581341df4c4058d8ae2170 |

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
