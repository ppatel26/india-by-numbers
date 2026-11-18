# Population

Data gathered on 17 Nov 2026 from ORGI (Census of India and the Sample Registration System) and the
MoHFW National Commission on Population. Every value below was read from the publisher's own file on
that date.

The latest full count is Census 2011. It is 15 years old. Census 2027 is in progress and has no results
yet. Values for 2026 are projections, not counts. Values for 2024 come from the SRS, a sample survey.

## Questions this topic answers

1. How many people live in India, and how fast has the number grown since 1901?
2. Where do people live: which states are largest, and how urban is each state?
3. How many people will live in India and in each state in 2026, and in 2036?
4. How many children do women have, and how does this differ by state?
5. How many girls are born for every 1,000 boys, and is the ratio rising?

## Census 2027 status (read 17 Nov 2026)

Census 2027 is the 16th census. No population figures from it are published yet.

| Step | Where | Dates | Source |
| --- | --- | --- | --- |
| House-listing (phase I) | All states and UTs, 30 days each | 1 Apr 2026 to 30 Sep 2026 | Gazette S.O. 99(E), 7 Jan 2026 (catalog 47084) |
| Population count | Ladakh and snow-bound areas of J&K, Himachal Pradesh, Uttarakhand | Self-count 17 to 31 Aug 2026; door to door 1 to 30 Sep 2026; revision 1 to 5 Oct 2026; reference date 00:00, 1 Oct 2026 | Gazette S.O. 4301(E), 3 Aug 2026 (catalog 47160) |
| Population count | Goa, Uttar Pradesh, Punjab, Uttarakhand (non-snow-bound areas) | Self-count 16 to 30 Nov 2026; door to door 1 Dec 2026 to 4 Jan 2027; revision 5 to 9 Jan 2027; reference date 00:00, 5 Jan 2027 | Gazette S.O. 4729(E), 5 Sep 2026 (catalog 47171) |
| Population count | All other states and UTs, except Manipur "till further declaration" | Self-count 10 to 24 Jan 2027; door to door 25 Jan to 28 Feb 2027; revision 1 to 5 Mar 2027; reference date 00:00, 1 Mar 2027 | Gazette S.O. 5913(E), 30 Oct 2026 (catalog 47179) |

Note: research/india-sources.md gives the poll-bound state dates (16 to 30 Nov 2026, 1 Dec 2026 to
4 Jan 2027). The gazette confirms them. It also gives the 5 Jan 2027 reference date for those four
states. The 2025 notification (S.O. 2681(E), 16 Jun 2025) set 1 Mar 2027 as the main reference date.

## Charts

Source blocks give publisher, release, period and file. See "Sources" for URLs and checksums.

### pop-01: India's population at each census, 1901 to 2011

- Type: line (or column), with the decadal growth rate as a second view.
- Unit: persons; percent change since the previous census.
- Geography: India. Period: census years 1901 to 2011.
- CSV: `population-census-1901-2011.csv`.
- Sentence: "India counted 1,210,854,977 people in 2011, up from 361,088,090 in 1951. Growth over the
  decade to 2011 was 17.70%, the slowest since 1941 to 1951 (13.31%)."
- Source: ORGI, Census of India 2011, Table A-02 "Decadal variation in population 1901-2011", India.
- Notes: the CSV `note` column carries the A-02 footnotes (Assam 1981 and J&K 1991 are interpolated;
  no census was held there in those years).

### pop-02: Population of each state, 2011, and growth 2001 to 2011

- Type: ranked bar by state, tile map by state. Toggle between population and decadal growth.
- Unit: persons; percent.
- Geography: India and 35 Census 2011 units mapped to geography.csv slugs. Period: 2011; 2001 to 2011.
- CSV: `population-by-state-2011.csv`.
- Sentence: "Uttar Pradesh had 199,812,341 people in 2011, more than any other state. Nagaland was the
  only state whose population fell between 2001 and 2011 (-0.58%)."
- Source: ORGI, Census of India 2011, Table A-02, India and States.
- Notes: `andhra-pradesh` is undivided Andhra Pradesh (with Telangana). `jammu-kashmir` is the former
  state (with Ladakh). `telangana` and `ladakh` rows are empty. `dnh-dd` is the sum of two 2011 UTs.

### pop-03: Share of people living in towns, by state, 2011

- Type: ranked bar by state, tile map by state.
- Unit: percent of population (derived); persons.
- Geography: India and 35 Census 2011 units. Period: 2011.
- CSV: `urban-share-by-state-2011.csv`.
- Sentence: "In 2011, 31.14% of India's people lived in urban areas. The share was 97.50% in Delhi
  and 10.03% in Himachal Pradesh."
- Source: ORGI, Census of India 2011, Table A-01 "Number of villages, towns, households, population and
  area".
- Notes: the share is derived (urban persons / total persons x 100, 2 decimals). The counts are as published.

### pop-04: Projected population, India and states, 2011 to 2036

- Type: line for India; ranked bar by state for 2026; tile map by state.
- Unit: thousand persons, as on 1 March of each year.
- Geography: India and all 36 present-day units (Telangana, Ladakh and J&K UT are separate). Period: 2011 to 2036.
- CSV: `population-projections-2011-2036.csv`.
- Sentence: "The Technical Group projects 1,425,908 thousand people (142.6 crore) in India on 1 March 2026,
  and 1,522,288 thousand by 2036. Uttar Pradesh alone is projected at 242,859 thousand in 2026."
- Source: MoHFW, National Commission on Population, "Population Projections for India and States
  2011-2036: Report of the Technical Group on Population Projections", July 2020, Table 8.
- Notes: these are projections made in 2020 from Census 2011 and SRS trends. They are not counts and not
  forecasts. The report says the 2011 values are Census figures. `dnh-dd` is the sum of two columns.

### pop-05: Total fertility rate by state, 2019 to 2024

- Type: ranked bar by state (2024), small multiples or slope 2019 to 2024. Toggle total, rural, urban.
- Unit: children per woman.
- Geography: India and the 22 bigger states and UTs only. Period: 2019 to 2024 (annual).
- CSV: `tfr-by-state-2019-2024.csv`.
- Sentence: "Women in India had 1.9 children on average in 2024, below the replacement level of 2.1.
  Bihar had the highest rate (2.9) and Delhi the lowest (1.2). 16 of the 22 bigger states were below 2.1."
- Source: ORGI, SRS Statistical Report 2024, Table 15 (cross-checked with Statement 24).
- Notes: values are rounded to one decimal in the report. SRS does not publish TFR for the 14 smaller
  states and UTs. The report text gives national TFR of 5.2 in 1971 and 3.6 in 1991.

### pop-06: Birth rate, death rate and natural growth by state, 2024

- Type: tile map by state, ranked bar by state. Series toggle: birth rate, death rate, natural growth rate.
- Unit: per 1,000 population (infant mortality: per 1,000 live births).
- Geography: India and all 36 states and UTs. Period: 2024.
- CSV: `birth-death-rates-by-state-2024.csv`.
- Sentence: "India's birth rate was 18.3 per 1,000 people in 2024 and its death rate 6.4. Bihar had the
  highest birth rate (26.8) and Andaman and Nicobar Islands the lowest (9.9)."
- Source: ORGI, SRS Bulletin 2024, Volume 59 No. 1, Table 1.
- Notes: infant mortality for the smaller states and UTs is a 2022-24 average. Manipur is based on
  130 SRS units. The SRS report gives the national birth rate as 36.9 in 1971 and death rate as 14.9 in 1971.

### pop-07: Sex ratio at birth by state, 2018-20 to 2022-24

- Type: ranked bar by state (2022-24), slope from 2018-20 to 2022-24.
- Unit: girls born per 1,000 boys born (three-year averages).
- Geography: India and the 22 bigger states and UTs. Period: 2018-20 to 2022-24.
- CSV: `sex-ratio-at-birth-by-state.csv`.
- Sentence: "For every 1,000 boys born in India in 2022-24, 918 girls were born, up from 907 in 2018-20.
  Chhattisgarh had the highest ratio (978) and Uttarakhand the lowest (872)."
- Source: ORGI, SRS Statistical Report 2024, Table 16 (cross-checked with Statement 16).

### pop-08: Population pyramid, India, 2011

- Type: pyramid (males left, females right), 5-year age groups.
- Unit: persons.
- Geography: India. Period: Census 2011.
- CSV: `population-pyramid-2011.csv`.
- Sentence: "In 2011, the largest age group was children aged 10 to 14 (132,709,212). There were
  11,289,005 people aged 80 and over."
- Source: ORGI, Census of India 2011, Table C-14 "Population in five year age-group by residence and sex", India.
- Notes: 4,489,802 people had no age stated. The CSV keeps them as a separate row; leave them out of the
  pyramid and say so. For a current view, SRS 2024 gives 24.0% aged 0 to 14 and 9.7% aged 60+ (sample estimate).

## Headline figures

| Figure | Period | Source |
| --- | --- | --- |
| 1,210,854,977 people counted | Census 2011 (1 Mar 2011) | ORGI, Census 2011, Table A-02 |
| 1,425,908 thousand people projected (142.6 crore) | 1 Mar 2026 (projection) | MoHFW/NCP, Technical Group report, Jul 2020, Table 8 |
| Total fertility rate 1.9 children per woman | 2024 | ORGI, SRS Statistical Report 2024 |
| Birth rate 18.3 and death rate 6.4 per 1,000 people | 2024 | ORGI, SRS Bulletin 2024, Table 1 |
| 918 girls born per 1,000 boys | 2022-24 | ORGI, SRS Statistical Report 2024, Table 16 |
| 9.7% of people aged 60 or over | 2024 | ORGI, SRS Statistical Report 2024, Statement 3 |

## Sources

Read date for all rows: 17 Nov 2026. Raw downloads are not kept in the repository; the URL and sha256 below identify each file.
Parsing scripts: pipeline/population/extract_text.sh, pipeline/population/parse_proj.py and pipeline/population/build_population.py (run with `python3 -I`).

| Publisher | Release / table | Release date | Data period | URL read | Licence | sha256 of raw file |
| --- | --- | --- | --- | --- | --- | --- |
| ORGI, Census of India | Census 2011 Table A-02, Decadal variation in population 1901-2011, India (Excel) | Catalog entry 1 Jun 2022 (Census 2011 final table) | 1901 to 2011 | https://censusindia.gov.in/nada/index.php/catalog/43333/download/47001/00%20A%202-India.xls | Not stated. Catalog: "Rights Reserved" (ORGI) | 56023511381e6fd632242f9a1a28c9faca5c403314bc34da78393534fbd23afc |
| ORGI, Census of India | Same table, PDF (used to confirm display of 17.70) | As above | 1901 to 2011 | https://censusindia.gov.in/nada/index.php/catalog/43333/download/47002/00%20A%202-India.pdf | As above | dd0aaf68e0aabb8b3bd59b72d85fbc97ccb960046593229240f5c54bc591dfed |
| ORGI, Census of India | Census 2011 Table A-01, Villages, towns, households, population and area | Catalog entry 5 May 2022 | 2011 | https://censusindia.gov.in/nada/index.php/catalog/42526/download/46152/A-1_NO_OF_VILLAGES_TOWNS_HOUSEHOLDS_POPULATION_AND_AREA.xlsx | As above | 6b649697ed5993da834b674173dab68e1ef9abb97e234155a80884c2fa4584f5 |
| ORGI, Census of India | Census 2011 Table C-14, Population in five year age-group by residence and sex, India | Catalog entry 19 Jan 2021 | 2011 | https://censusindia.gov.in/nada/index.php/catalog/1541/download/4618/DDW-0000C-14.xls | As above | af359200c2b71f814d1d3c5807244ddbc09acf8fe9ab4816cb34908fad44c6be |
| ORGI, Vital Statistics Division | SRS Statistical Report 2024 (363 pages) | 20 May 2026 | 2024 (SRB: 2018-20 to 2022-24) | https://censusindia.gov.in/nada/index.php/catalog/47152/download/51396/SRS_STAT_2024.pdf | As above | f922a4a817e612c78a7827e4f526f69dc433d68c4af287b76d418337637c946a |
| ORGI, Vital Statistics Division | SRS Bulletin 2024, Volume 59 No. 1 | 20 May 2026 | 2024 | https://censusindia.gov.in/nada/index.php/catalog/47150/download/51394/SRS_Bulletin_2024_Vol_59_No_1.pdf | As above | dbd5008ffba5122d222775fc711a3a050867f65f06d9a2afb513311dc7031d05 |
| MoHFW, National Commission on Population | Population Projections for India and States 2011-2036, Report of the Technical Group (270 pages) | Report dated July 2020 (file uploaded Oct 2025) | 2011 to 2036 | https://www.mohfw-dohfw.gov.in/static/uploads/2025/10/1c3c2048814bd3747f44e661f8547055.pdf (linked from censusindia.gov.in "Population Projections") | Not stated | bf867a344d5eead958235dd03c75a3fc2a39187072f6ddedcbab3cc3720e8417 |
| ORGI | Gazette S.O. 2681(E): Census 2027 to be taken; reference dates | 16 Jun 2025 | Census 2027 | https://censusindia.gov.in/nada/index.php/catalog/45572/download/49769/GAZ_NOTIFICATION_07.pdf | As above | 2310d16519452ef20ccdfe6224e2a64a69bcb9f998c2eb87ec6832f51c14d61e |
| ORGI | Gazette S.O. 99(E): house-listing 1 Apr to 30 Sep 2026 | 7 Jan 2026 | Census 2027 | https://censusindia.gov.in/nada/index.php/catalog/47084/download/51329/GAZ_NOTIFICATION_10.pdf | As above | 281014b6e48b73fb3cc6edabc866595474ac69ba0e7aa695138e895016be11d3 |
| ORGI | Gazette S.O. 4301(E): count in Ladakh and snow-bound areas | 3 Aug 2026 | Census 2027 | https://censusindia.gov.in/nada/index.php/catalog/47160/download/51406/GAZ_NOTIFICATION_13.pdf | As above | f6fd449851d340d6fdc64c7376bb23ece05f7d886c36e3aaf640bf9bd4a4ef43 |
| ORGI | Gazette S.O. 4729(E): count in Goa, UP, Punjab, Uttarakhand | 5 Sep 2026 | Census 2027 | https://censusindia.gov.in/nada/index.php/catalog/47171/download/51418/GAZ_NOTIFICATION_18.pdf | As above | 131c0d5e698cb1bc37046022b39b5f6f34eee04a0ecd9522f1d09c5c31838c6c |
| ORGI | Gazette S.O. 5913(E): count in all other states, 25 Jan to 28 Feb 2027 | 30 Oct 2026 | Census 2027 | https://censusindia.gov.in/nada/index.php/catalog/47179/download/51426/GAZ_NOTIFICATION_20.pdf | As above | 6b7ce2e97c7cfeb9dd8cc0b3c8f1b29dd36d9212c6c4383391ded4389b121625 |

## Gaps and cautions

- Census 2011 is the latest count. Label every Census figure "2011". Do not join Census 2011 counts to
  the 2026 projections as one series without a method note.
- Boundaries: Census 2011 has 35 units. Telangana (formed 2014) is inside undivided Andhra Pradesh. Ladakh
  (UT since 2019) is inside the former state of J&K. Dadra and Nagar Haveli and Daman and Diu were two UTs
  (merged 2020). The `dnh-dd` values are sums of the two published units, marked "Derived". I did not
  split Andhra Pradesh or J&K from district rows.
- Projections: the report is dated July 2020. It uses Census 2011 and SRS trends. It predates the SRS
  estimates for 2020 onward, so the 2026 values do not use the latest fertility and death rates. The report uses a cohort component method for 22 large
  units and the north-east as a group, and a mathematical method for Goa and the small UTs. The small-UT
  figures look odd: Daman and Diu is projected at 1,969 thousand in 2036 with 1,670 thousand males. Treat
  small-UT projections with care. Male plus female sometimes differs from persons by 1 (rounding in source).
- SRS gives TFR, sex ratio at birth and age structure only for the 22 bigger states and UTs. Birth rate,
  death rate and infant mortality are given for all 36. SRS values are sample estimates; the bulletin
  gives 95% confidence limits (Tables 2 and 3) which I did not copy.
- SRS 2024 sample frame is Census 2011. SRS values are rounded to one decimal (rates) or whole numbers (IMR, SRB).
- National long-run SRS series: the 2024 report has year-by-year values only for 2019 to 2024. Earlier
  years appear only as anchor points in the text (birth rate 36.9 in 1971, 33.9 in 1981, 29.5 in 1991,
  25.4 in 2001, 21.8 in 2011; TFR 5.2 in 1971, 4.5 in 1981, 3.6 in 1991). A full annual series needs the
  older SRS reports (catalog search "srsstat" lists reports back to 2013). Not collected.
- Age structure by state from SRS 2024 (Statements 5 to 7: shares aged 0 to 14, 15 to 59, 60+) is in the
  report but not in a CSV. Kerala had the highest share aged 60+ (15.1%), Assam the lowest (7.6%).
- Urban share is derived from counts. The Census 2011 definition of "urban" includes statutory towns and
  census towns.
- Licence: no open licence is stated on censusindia.gov.in or the MoHFW file. The catalog pages say
  "Rights Reserved". Confirm reuse terms before publishing.

## Publisher check on 18 Nov 2026

ORGI still lists the SRS Statistical Report and Bulletin for 2024. Both files match their 17 Nov checksums, along with the Census 2011 tables, Census 2027 gazette notices and population projections. The 16 Nov PIB notice describes self-enumeration for the next census phase.

| Release or file checked | Release date | URL | Fetched | SHA-256 |
| --- | --- | --- | --- | --- |
| ORGI SRS catalogue search | Live list | https://censusindia.gov.in/nada/index.php/catalog/?sk=SRS | 18 Nov 2026 | `46d3e7d88d806a2398ad407f2b9fd808ffd7248487d5af8c8be5ea4db103d57f` |
| ORGI SRS Statistical Report 2024 | 20 May 2026 | https://censusindia.gov.in/nada/index.php/catalog/47152/download/51396/SRS_STAT_2024.pdf | 18 Nov 2026 | `f922a4a817e612c78a7827e4f526f69dc433d68c4af287b76d418337637c946a` |
| ORGI Census 2027 catalogue search | Live list | https://censusindia.gov.in/nada/index.php/catalog/?sk=2027 | 18 Nov 2026 | `cc443d26b5f38ab98d7d9b9151b353fd7e3d8babb3cf899ae4d76f277222d2ad` |
| PIB PRID 2337054, Census 2027 phase II self-enumeration | 16 Nov 2026 | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2337054&reg=48&lang=1 | 18 Nov 2026 | `229d718662af42e7090dde234f91dede4b1f41924218fcc6586a16b37dc2739a` |
