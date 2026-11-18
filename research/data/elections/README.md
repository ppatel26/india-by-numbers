# Elections

Data for the India by Numbers elections topic. Read on 17 Nov 2026.

The ECI website (eci.gov.in) blocked every request from this machine with "406 Not Acceptable", in curl and in a browser. The live results site (results.eci.gov.in) answered, but it now shows only the October 2026 bye-elections. So ECI pages and reports below were read from Internet Archive copies of the original ECI URLs. The archive copy is byte-for-byte the file ECI served on the capture date. Each row in "Sources" gives the original ECI URL and the capture time. Re-fetch from eci.gov.in when it is reachable.

## Questions this topic answers

1. How many Indians can vote, and how has that changed since the first election in 1951-52?
2. What share of electors vote, and do women now vote as often as men?
3. Which states vote the most, and which the least?
4. How many women stand for the Lok Sabha, and how many win?
5. What were the results of the 2024 general election and of the state assembly elections in 2025 and 2026?

## Charts

### C1. Lok Sabha turnout, men and women, 1952 to 2024

- Type: line (three lines: total, men, women). Option: a second panel for the gap in percentage points.
- Unit: percent of electors who voted.
- Geography: India. Period: 18 general elections, 1951-52 to 2024.
- File: `lok-sabha-turnout-by-sex.csv`.
- Sentence: "In 2024, 65.8% of women electors voted, against 65.6% of men. In 1962, the figures were 46.6% and 62.0%."
- Source: S1, Table 5.6 (MoSPI, from Election Commission of India data).

### C2. Number of electors, 1952 to 2024

- Type: line, or stacked bar for men and women.
- Unit: million electors.
- Geography: India. Period: 1951-52 to 2024.
- File: `lok-sabha-electors.csv`.
- Sentence: "India had 978.0 million electors in 2024, up from 173.2 million at the first general election."
- Source: S1, Table 5.6.

### C3. Turnout by state, 2024 general election

- Type: ranked bar by state and tile map by state. Toggle: total or women.
- Unit: percent of electors. The file also has electors and voters in thousands.
- Geography: all 36 states and UTs, plus India.
- Period: 2024 general election (18th Lok Sabha).
- File: `lok-sabha-2024-turnout-by-state.csv`.
- Sentence: "66.10% of electors voted in 2024. Turnout was lowest in Bihar at 56.28% and highest in Lakshadweep at 84.98%."
- Source: S1, Table 5.7 (MoSPI, from ECI "General Elections, 2024 (18th Lok Sabha)").

### C4. Women candidates and women MPs, 1957 to 2024

- Type: line or bar (women candidates, women elected). Option: line of women's share of MPs.
- Unit: candidates; members; percent.
- Geography: India. Period: 1957 to 2024. No sex break-up exists for 1951-52.
- File: `lok-sabha-women-candidates-and-mps.csv`.
- Sentence: "800 women stood for the Lok Sabha in 2024, 9.6% of the 8,359 candidates. 74 of them won. In 1957, 45 women stood and 27 won."
- Source: S1, Table 5.2 (ECI and Lok Sabha Secretariat). The 2024 counts match ECI Report 33 (S3) exactly.

### C5. Lok Sabha seats and women MPs by state, 2024

- Type: tile map by state (seats) and ranked bar (women MPs or women's share).
- Unit: seats; members; percent of seats.
- Geography: all 36 states and UTs, plus India.
- Period: 18th Lok Sabha, as on 20 Dec 2024.
- File: `lok-sabha-2024-seats-and-women-mps-by-state.csv`.
- Sentence: "Uttar Pradesh elects 80 of the 543 MPs. West Bengal elected 11 women, the most of any state. 14 states and UTs elected no women."
- Source: S1, Table 5.3 (Lok Sabha Secretariat).

### C6. Seats and vote share by party, 2024 general election

- Type: bar (seats) beside bar (vote share). 18 parties, independents, and "others".
- Unit: seats; votes; percent of total valid votes.
- Geography: India. Period: 2024 general election.
- File: `lok-sabha-2024-party-results.csv`.
- Sentence: "The Bharatiya Janata Party won 240 of 543 seats with 36.93% of valid votes. The Indian National Congress won 99 seats with 21.4%."
- Selection rule: every party with at least 1% of valid votes or at least 5 seats. All other parties (725) are in one "others" row. Independents have their own row.
- Source: seats from S4 (ECI results page, final). Votes from S3 (ECI Report 33). Vote share as published in S2 (ECI Report 20) for the 6 national parties. For other parties, vote share is computed as votes / 638,990,692 total valid votes, the ECI denominator in Report 20.

### C7. NOTA share by state, 2024 general election

- Type: ranked bar by state; tile map.
- Unit: NOTA votes; percent of votes counted (valid votes plus NOTA).
- Geography: all 36 states and UTs, plus India.
- File: `lok-sabha-2024-nota-by-state.csv`.
- Sentence: "6,371,839 voters chose 'None of the above' in 2024, 0.99% of votes counted. The share was highest in Bihar, at 2.07%."
- Source: computed from S3 (ECI Report 33, every candidate and NOTA row in 542 constituencies).

### C8. State assembly elections, 2025 and 2026

- Type: small multiples, one per state: a seats bar by party and a turnout figure. Or a table.
- Unit: seats; percent of electors.
- Geography: Delhi and Bihar (2025); Assam, Kerala, Puducherry, Tamil Nadu and West Bengal (2026).
- Files: `assembly-2025-2026-seats-by-party.csv` (every party with a seat, as published) and `assembly-2025-2026-turnout.csv`.
- Sentence: "West Bengal recorded a provisional turnout of 92.47% in April 2026. Its previous highest was 84.72% in 2011."
- Sources: seats from S5 and S6 (ECI results pages). Turnout from S7, S10, S11 and S12 (ECI releases on PIB). Tamil Nadu electors from S13.
- No other state held a general assembly election in 2025 or 2026 up to 17 Nov 2026. The live results site shows only bye-elections (October 2026) after the May 2026 round.

## Headline figures

| Figure | Period | Source |
| --- | --- | --- |
| 978.0 million electors | 2024 general election | S1, Table 5.6 |
| 66.10% of electors voted | 2024 general election | S1, Table 5.7 |
| Women's turnout 65.8%, men's 65.6% | 2024 general election | S1, Table 5.6 |
| 74 women MPs, 13.62% of 543 seats | 18th Lok Sabha, 20 Dec 2024 | S1, Table 5.3 |
| 800 women among 8,359 candidates | 2024 general election | S1, Table 5.2; S3 |
| 0.99% of votes counted went to NOTA (6,371,839 votes) | 2024 general election | Computed from S3 |
| West Bengal's previous highest turnout: 84.72% | 2011 assembly election | S12: ECI via PIB, "West Bengal records highest-ever poll-participation since Independence", Release ID 2256756, 29 Apr 2026: "Previously, the highest poll-participation in WB was 84.72% (2011 GELA)", and the annexed table, row 30 "West Bengal 2011 LA". Checked 18 Nov 2026 |

## Sources

All read on 17 Nov 2026. "Archive" means the Internet Archive copy of the ECI URL, at the capture time shown.

| ID | Publisher | Release | Release date | Period | URL read | Licence | Raw file sha256 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | MoSPI, Social Statistics Division | Women and Men in India 2025: Selected Indicators and Data, chapter 5, Tables 5.2, 5.3, 5.6, 5.7 (pages 230, 231, 235 to 237) | 29 Apr 2026 (PIB release 2256593) | 1951-52 to 2024 | https://www.mospi.gov.in/uploads/publications_reports/publications_reports1777367728766_db830db0-1895-4032-82fe-f6daefed0f7f_Women_&_Men_in_India_2025__Complete_publication.pdf | Not stated | 92680514a52a4b106c8af90be674647be699ab9d15c73006207d3b325f82def7 |
| S2 | Election Commission of India | GE 2024 Statistical Report 20: Performance of National Parties | Dec 2024 (not stated on the file; PDF dated 25 Dec 2024, checked 18 Nov 2026) | 2024 | https://www.eci.gov.in/eci-backend/public/all_files/GE-2024-statistical-report/20-Performance-of-National-Parties.pdf (archive capture 2026-05-08 11:31 UTC) | Not stated | 1fd8c818d59f2de33119bbed865e1a62e037aacbecf8569f3ed0e20054a96979 |
| S3 | Election Commission of India | GE 2024 Statistical Report 33: Constituency Wise Detailed Results (542 PCs) | Dec 2024 (not stated on the file; PDF dated 25 Dec 2024, checked 18 Nov 2026) | 2024 | https://www.eci.gov.in/eci-backend/public/all_files/GE-2024-statistical-report/33-Constituency-Wise-Detailed-Result.pdf (archive capture 2026-07-24 08:20 UTC) | Not stated | 8c3e317c3922f4fe2a4e5ce7a7264dbffcfdd3cd547432283996d84dfa7244b9 |
| S4 | Election Commission of India | General Election to Parliamentary Constituencies: Trends & Results June 2024, party-wise results | Page last updated 05/06/2024 08:55 | 2024 | https://results.eci.gov.in/PcResultGenJune2024/index.htm (archive capture 2025-11-06 19:09 UTC) | Not stated | 58e2f9159493af38086e7d7a3593533d87849c0c7a5ceba35be836aecedfc963 |
| S5 | Election Commission of India | Trends & Results February 2025 (NCT of Delhi) | Page last updated 08/02/2025 20:42 | 2025 | https://results.eci.gov.in/ResultAcGenFeb2025/index.htm (archive capture 2025-10-25 14:23 UTC) | Not stated | eef0e7fb432ae514253d9fc6f0a4e6d05febf7aec5aa4a5045d53bedfb38ea5a |
| S5 | Election Commission of India | Trends & Results November 2025 (Bihar) | Not shown | 2025 | https://results.eci.gov.in/ResultAcGenNov2025/index.htm (archive capture 2026-04-10 21:39 UTC; gzip body) | Not stated | bb553d24434a166606b1a6d6a1b5a34cfc59a0426a1ce25eb1644eacdc05e9b6 |
| S6 | Election Commission of India | Trends & Results May 2026, index page | Page last updated 05/05/2026 16:18 | 2026 | https://results.eci.gov.in/ResultAcGenMay2026/index.htm (archive capture 2026-05-12 03:35 UTC) | Not stated | 66f0e5c79309d16407e8338e65fd362bfd77875a95e6042f2fb8de986dd41118 |
| S6 | Election Commission of India | Party-wise results, Assam (S03) | As above | 2026 | https://results.eci.gov.in/ResultAcGenMay2026/partywiseresult-S03.htm (capture 2026-05-12 02:58 UTC) | Not stated | 4ea5d51fc54c712d5d3c310510f7aaa41b2634210f8fabee02a2f48bfc88dd02 |
| S6 | Election Commission of India | Party-wise results, Kerala (S11) | As above | 2026 | https://results.eci.gov.in/ResultAcGenMay2026/partywiseresult-S11.htm (capture 2026-05-18 03:52 UTC) | Not stated | b2ead7bacee1da1248f94ac1a751048b64e39f3ba06d84982b8906dcb1883f49 |
| S6 | Election Commission of India | Party-wise results, Tamil Nadu (S22) | As above | 2026 | https://results.eci.gov.in/ResultAcGenMay2026/partywiseresult-S22.htm (capture 2026-08-16 11:51 UTC) | Not stated | 549aead452d91a3e6de10fdd20684a0a00457600fb6142674658c8416e296350 |
| S6 | Election Commission of India | Party-wise results, West Bengal (S25) | As above | 2026 | https://results.eci.gov.in/ResultAcGenMay2026/partywiseresult-S25.htm (capture 2026-07-10 11:23 UTC) | Not stated | 1e696fa663a1ce1b8f7f0733330105484fbf1aa6e9a2ba323a14e01f23297dd9 |
| S6 | Election Commission of India | Party-wise results, Puducherry (U07) | As above | 2026 | https://results.eci.gov.in/ResultAcGenMay2026/partywiseresult-U07.htm (capture 2026-05-12 03:11 UTC) | Not stated | d04ec31a20da90d3c6bc75302385ed0b6a471ded0364d7c2f8f07e31d1bf3d34 |
| S7 | ECI via PIB | Bihar Legislative Assembly elections: highest ever voter turnout of 67.13% (Release ID 2189428) | 12 Nov 2025 | Bihar 2025 | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2189428 | Not stated | e8448560992e326cbbbc0e2f45201eaed3707596edbe7f65c44214893c1c46ef |
| S8 | ECI via PIB | Bihar poll-day release, 66.91% (Release ID 2189034), superseded by S7 | 11 Nov 2025 | Bihar 2025 | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2189034&reg=48&lang=2 | Not stated | 74c1e72e6fbaf174e59b4e7c3c1a453b52b59e5fdbf6f38fd7597456add7a477 |
| S9 | ECI via PIB | General Election to Legislative Assembly of NCT of Delhi, 2025 (schedule; Release ID 2090923) | 7 Jan 2025 | Delhi 2025 | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2090923&reg=48&lang=2 | Not stated | 1d71680f2badcc4b2b7429b1fc82fca8e055bc9d5c6e112913da0dd09265da15 |
| S10 | ECI via PIB | Assam and Puducherry record highest-ever poll participation (Release ID 2250605) | 9 Apr 2026 | 2026 | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2250605&reg=48&lang=2 | Not stated | 03ab0c885d904f2e42bf7df8e9aee260b3cc28da7a3b7f7f195afe16d13b2f20 |
| S11 | ECI via PIB | Tamil Nadu and West Bengal (Phase I) poll participation (Release ID 2255010) | 23 Apr 2026 | 2026 | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2255010&reg=3&lang=2 | Not stated | 77d2c24de195df068ab595757c1f27025a86e314ee07656c20dedaa6092d99f6 |
| S12 | ECI via PIB | West Bengal records highest-ever poll-participation since Independence (Release ID 2256756) | 29 Apr 2026 | 2026 | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2256756&reg=3&lang=1 | Not stated | 67f5699fbd0715b10ddfb5187f13d2e4aac6b920e47c466a13068ab2ea2e1ea4 |
| S13 | Election Commission of India | Tamil Nadu 2026 Statistical Report 10: Detailed Results | Published by 8 May 2026 (S14) | 2026 | https://www.eci.gov.in/eci-backend/public//all_files/election_report/General_Election_to_the_Legislative_Assembly_of_Tamil_Nadu_2026_2026/10-Detailed_Results_1778165153.pdf (archive capture 2026-05-10 05:45 UTC) | Not stated | fe9f808a08ac53cc71b4edeba76a23b6533e9261220d36ead1b5bcda936a3834 |
| S14 | ECI via PIB | Index Cards and Statistical Reports published on ECINET (Release ID 2258991) | 8 May 2026 | 2026 | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2258991&reg=3&lang=1 | Not stated | ea4e340943a0669f41f103e66cc72a24d85ff2a149a9a711ffde4e6f97b69580 |
| S15 | Election Commission of India | Odisha assembly results June 2024 (used only for the party name "Biju Janata Dal") | 05/06/2024 | 2024 | https://results.eci.gov.in/AcResultGenJune2024/partywiseresult-S18.htm (capture 2024-06-18 13:54 UTC) | Not stated | a28866d5f86885eac08b757bf4b89af583a38632fa81305819fd7cf86725e917 |
| S16 | MoSPI via PIB | Release of "Women and Men in India 2025" (Release ID 2256593), for the S1 release date | 29 Apr 2026 | n/a | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2256593&reg=3&lang=1 | Not stated | c9731568093bd0a20d3d8b564d972c98f00ddc907dfc20a29d8f0d37820a0035 |

Raw files are in `raw/elections/` with a log (`_log.tsv`) of URL, sha256 and fetch time. Parsing scripts are in `pipeline/` (`parse_d33.py`, `check_d33.py`, `build_elections.py`, `build_party.py`, `build_ae.py`).

### How the values were taken

- S1 Tables 5.2, 5.3, 5.6 and 5.7 are drawn as vector graphics, so the PDF has no text layer for them. The values were transcribed from page renders at 2.5x, and doubtful digits were checked at 4x.
- Checks on Table 5.7: for every state, voters / electors was recomputed and compared with the published percentage. All 37 rows agree within 0.6 points. Lakshadweep is the only row that differs by more than 0.1 point, because its counts are rounded to thousands.
- Checks on Table 5.3: the state rows sum to 74 women MPs and 543 seats, as published.
- S3 was parsed with `pdftotext -layout`. The parse gives 542 constituencies and 8,901 rows (8,359 candidates and 542 NOTA rows). In every constituency the candidate votes sum to the published TOTAL row. National totals match S2: 977,965,560 electors, 638,990,692 valid votes, and BJP, INC, BSP, CPI(M), AAP and NPP votes exactly. Candidates by sex (7,553 men, 800 women, 6 third gender) and winners (468 men, 74 women) match S1 Table 5.2.

## Gaps and cautions

- **eci.gov.in was not reachable.** It returned "406 Not Acceptable" ("blocked due to suspicious behavior") to curl and to a browser. The old ECI site (old.eci.gov.in) timed out. ECI reports were read from Internet Archive copies. Re-check against eci.gov.in when possible.
- **Two national turnout values for 2024.** S1 Table 5.6 gives 65.7%. S1 Table 5.7 gives 66.10% (646,421 thousand voters / 977,966 thousand electors). The tables do not say why they differ. Show one value per chart and name the table. Do not mix them on one chart.
- **Surat.** The Surat seat in Gujarat was won unopposed in 2024, so there was no poll there. ECI reports and S1 Table 5.7 exclude it (542 constituencies). The seat count in S4 and S1 Table 5.3 includes it (543). The BJP seat count is 240 in S4 and 239 in S2 for this reason. Gujarat electors and turnout exclude Surat.
- **Party vote shares other than the 6 national parties are computed.** The values come from S3 vote counts divided by the S2 total of valid votes. ECI Report 21 (state parties) and Report 22 (unrecognised parties) were not reachable to check them. NOTA is not part of valid votes in the ECI denominator.
- **Party names.** Names are as ECI prints them, including spelling (for example "Thackrey"). The names for BSP (S2), BJD (S15) and ADMK (S6) come from other ECI pages because these parties won no Lok Sabha seats.
- **NOTA by state is computed** from S3. The denominator is votes counted (valid votes plus NOTA), including postal votes. No published ECI state-level NOTA table was reached. NOTA history for 2014 and 2019 was not found.
- **1951-52.** S1 dates the first general election "1952". The 1952 and 1957 totals were "calculated on the basis of valid votes polled". There is no sex break-up of turnout for 1952, 1957 and 1971, and no sex break-up of electors for 1952 and 1957.
- **Source inconsistencies, kept as published.** In S1 Table 5.2 for 1999, men elected (494) plus women elected (52) is 546, more than the 543 seats. In S1 Table 5.6 for 1991, men (261.8 million) plus women (234.5 million) is 496.3 million, not the 498.4 million total. Do not correct these values. Add a footnote if they are shown.
- **Women's share of MPs in 2024** is 13.62% of 543 seats (S1 Table 5.3, as on 20 Dec 2024). The derived share in `lok-sabha-women-candidates-and-mps.csv` is 13.7% of 542 members elected at the 2024 poll. Name the basis when you quote one of them.
- **Boundary changes.** Table 5.7 and 5.3 use 2024 boundaries: Jammu and Kashmir and Ladakh separate, Dadra and Nagar Haveli and Daman and Diu merged. Telangana and Andhra Pradesh are separate. Earlier general elections used other state boundaries, so no state series goes back before 2024 in this folder.
- **Assembly turnout 2026 is provisional.** The PIB values are poll-day figures uploaded by presiding officers. They exclude service voters and postal ballots, and some polling stations were not yet updated. ECI published final Index Cards and Statistical Reports on 8 May 2026 (S14), but only the Tamil Nadu detailed results (S13) were reachable. For Tamil Nadu, valid votes plus NOTA over electors is 85.91%. This is a derived value and is not the official turnout. News reports (ANI, 16 May 2026) cite ECI final turnouts such as 93.71% for West Bengal. These are unverified.
- **Bihar 2025 turnout (67.13%) is provisional.** S7 says that final figures come through the ECI Index Card.
- **Delhi 2025 turnout: not found.** The ECI site, the Delhi CEO site (ceodelhi.gov.in, timed out) and PIB searches gave no turnout release. All India Radio reports 60.54% citing ECI. That value is unverified and is not in the CSV.
- **West Bengal 2026 seats.** The archived statewide results page shows 293 of 294 seats. The CSV adds the 144-Falta re-poll result to that count. See the check below.
- **Assembly vote shares for 2025 and 2026: not found.** The results pages link to vote-share pages that the archive did not hold.
- **Puducherry** has 30 elected seats. Nominated members are not counted.
- **Licence.** No reuse licence was stated on any ECI or MoSPI file reached. Confirm before publication.

## Checks (18 Nov 2026)

- Re-fetched `Women and Men in India 2025` from MoSPI. The SHA-256 matched S1. All 37 geographies, including India, match for total turnout and women's turnout in Table 5.7 and seats and women MPs in Table 5.3. Examples include 56.28% total turnout in Bihar, 84.98% in Lakshadweep, 74 women MPs nationally and 11 in West Bengal. [MoSPI publication](https://www.mospi.gov.in/uploads/publications_reports/publications_reports1777367728766_db830db0-1895-4032-82fe-f6daefed0f7f_Women_&_Men_in_India_2025__Complete_publication.pdf)
- Compared party seats with a separate ECI results capture from 10 Jun 2024. BJP 240, INC 99, SP 37, AITC 29, YSRCP 4, TDP 16, DMK 22, CPI(M) 4, RJD 4, SHSUBT 9, JD(U) 12, SHS 7, AAAP 3, NCPSP 8, LJPRV 5 and independents 7 all match. The results chart includes NOTA in the denominator. Using the CSV vote counts and that denominator reproduces the chart for all 18 named parties. For example, BJP is 36.56% with NOTA and 36.93% of valid votes, and INC is 21.19% with NOTA and 21.40% of valid votes. [Separate ECI results capture](https://web.archive.org/web/20240610132210id_/https://results.eci.gov.in/PcResultGenJune2024/index.htm)
- Separate ECI constituency result captures confirm the NOTA counts and shares for Chandigarh (2,912 and 0.65%), Lakshadweep (133 and 0.27%) and Sikkim (2,527 and 0.66%). Each is a single-constituency state or UT. [Chandigarh](https://web.archive.org/web/20240604141306id_/https://results.eci.gov.in/PcResultGenJune2024/ConstituencywiseU021.htm) · [Lakshadweep](https://web.archive.org/web/20240604130823id_/https://results.eci.gov.in/PcResultGenJune2024/ConstituencywiseU061.htm) · [Sikkim](https://web.archive.org/web/20240604120138id_/https://results.eci.gov.in/PcResultGenJune2024/ConstituencywiseS211.htm)
- The ECI statistical report URLs returned HTTP 406. The live results home page loaded, but the June 2024 results returned HTTP 404. The ECI release on PIB reports phase turnout. The state rates above come from the consolidated figures in Table 5.7. [ECI on PIB](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2019225&reg=3&lang=1)
- ECI's result page for the 144-Falta re-poll lists Debangshu Panda (BJP) as the winner. Akashvani gives the declaration date as 24 May 2026. Changed BJP's West Bengal seat count from 207 to 208. The parties now sum to 294 seats. Updated the source note for all six West Bengal rows. The ECI page capture SHA-256 is `afde2f3ed8f254754f862d825592d584f567a1367d91a19335fbeb665ff0ec1c`. [ECI Falta result](https://web.archive.org/web/20260721171235id_/https://results.eci.gov.in/ResultAcGenMay2026/candidateswise-S25144.htm) · [Akashvani](https://newsonair.gov.in/bjp-candidate-debangshu-panda-wins-falta-assembly-seat-in-west-bengal-by-margin-of-1-09-lakh-votes/)

## Publisher check on 18 Nov 2026

ECI's live results site points to its October 2026 by-election results, dated 9 Oct. The PIB archive lists zero ECI press releases for November 2026. The MoSPI Women and Men in India 2025 report matches the 17 Nov checksum. The live ECI historical statistics and results URLs still return HTTP 406 or 404, so the archived copies remain the basis for those series.

| Release or file checked | Release date | URL | Fetched | SHA-256 |
| --- | --- | --- | --- | --- |
| ECI Assembly by-election results | 9 Oct 2026 | https://results.eci.gov.in/ResultAcByeOct2026/index.htm | 18 Nov 2026 | `3883f990577091ff715ed4ddb89895e4ee40e120073e0a4dbe17667f4c7a1018` |
| PIB ECI release list for November 2026, filtered POST response | Live list | https://www.pib.gov.in/AllRelease.aspx?reg=48&lang=1 | 18 Nov 2026 | `bb4029475a15c6e4c90c553d2f9349f2763ac29eca9902a59b7c618a53e69292` |
