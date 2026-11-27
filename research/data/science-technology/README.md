# Science and technology

Data for the India by Numbers topic "Science and technology" (`/science-and-technology/`). Its
charts read the five patent CSVs in this folder and three World Bank WDI CSVs in
[`../international/`](../international/README.md) (research spending, researchers and journal
articles). Two more publishers have the data this topic most needs, India's own research spending
and the price of mobile data, but ask for permission by mail before reuse (see "Held back").

Read on 27 Nov 2026 (UTC; 26 Nov 2026 in India).

## Questions this topic answers

1. How many patent applications are filed in India each year, and how many come from Indian
   residents?
2. Which states file the most patent applications?
3. Who files: educational institutions, individuals, startups or companies?
4. How many patents does India grant, and how many are in force?
5. In which fields of invention do people file?
6. How does India's spending on research and its number of researchers compare with other
   countries? (WDI)
7. How many scientific articles do researchers in India publish? (WDI)

## About the sources

- **IP India.** The Office of the Controller General of Patents, Designs, Trade Marks and
  Geographical Indications (CGPDTM), under the Department for Promotion of Industry and Internal
  Trade, publishes one annual report each financial year (April to March). Each report reprints ten
  years of patent filings (Appendix C) and of grants and patents in force (Appendix D).
- **Release dates.** The reports give no release date. The annual report page shows "Published on
  02-05-2026" for the English edition of almost every year from 2002-03 to 2024-25, which looks like
  the date of a re-upload, not of first release. The 2024-25 PDF was created on 24 Nov 2025; the
  2022-23 PDF on 16 Jan 2024; the 2014-15 PDF on 9 Jun 2016.
- **Resident.** Appendix C splits filings into residents and three routes for non-residents:
  ordinary applications, convention applications (claiming priority from an earlier filing abroad
  under the Paris Convention) and national phase applications under the Patent Cooperation Treaty
  (PCT). The category table calls residents "Indian" and non-residents "Foreign"; the totals agree
  with Appendix C for 2021-22 to 2024-25.
- **Educational institutions.** The category table has five categories of applicant: natural
  person, startup, small entity, educational institution, and other than natural person. It gives
  educational institutions 0 in 2020-21 and 7,405 in 2021-22. The Patents (Amendment) Rules, 2021
  (September 2021) gave educational institutions their own lower fees.

Headline values in the report text (Annual Report 2024-25, Chapter 2):

| Statement | Value | Where |
| --- | --- | --- |
| Patent applications filed in 2024-25 | 110375, up 19.75% from 92168 | Chapter 2, section 1 |
| Filed by Indian applicants | 68201, up 32.23% from 51574; "Domestic filing is 61.79% of the total applications filed as compared to 55.96% during last year" | Chapter 2, section 1.1 |
| Filed by foreign applicants | 42174, up 3.89% from 40594 | Chapter 2, section 1.1 |
| Patents granted in 2024-25 | 33504, of which 10682 to Indian applicants; down 67.49% from 103057 in 2023-24 | Chapter 2, section 5 |
| Patents in force | "As on April 1, 2025 the number of patents in force was 230480 out of which 50848 belonged to Indian patentees" | Chapter 2, section 5 |
| Top filing states | Tamil Nadu (15440), Karnataka (8371), Maharashtra (7893), Uttar Pradesh (5703), Punjab (4461), Telangana (4293) | Chapter 2, section 1.2 |
| Applications examined | 73165 in 2020-21 to 15726 in 2024-25 | Chapter 1, Table "Trends in Patent Applications" |

## Sources

| Publisher | Release | Release date | Period | URL read | Read on | Licence | sha256 of raw file |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CGPDTM (IP India) | Annual Report 2024-25 (180 pages) | Not stated. PDF created 24 Nov 2025 | 2015-16 to 2024-25 | https://ipindia.gov.in/storage/uploads/docs-operator/7a8f0ca4-5a8e-416e-b8d4-5647ec352bb9.pdf | 27 Nov 2026 | Free reuse with credit (below) | f4d0d9c72d0fc3f7d1dafea570f956a2f842957fbd81733ddab9c95d7b8d6ffd |
| CGPDTM (IP India) | Annual Report 2022-23 (176 pages). Checks only | Not stated. PDF created 16 Jan 2024 | 2013-14 to 2022-23 | https://ipindia.gov.in/storage/uploads/docs-operator/99572504-9d0f-46df-b99c-4d156aa6a93c.pdf | 27 Nov 2026 | As above | 3ba584b390cb12baa0bc07201df1236f710f96e5ba935e223f9f9cc59e73165d |
| CGPDTM (IP India) | Annual Report 2014-15 (100 pages, a scan) | Not stated. PDF created 9 Jun 2016 | 2005-06 to 2014-15 | https://ipindia.gov.in/storage/uploads/docs-operator/d6c55361-1cf1-46a7-b98f-01cbd944b657.pdf | 27 Nov 2026 | As above | 13418bae649d1ac3b99876c5809155962b0595b71c39e2839c7ca5dacda3c780 |

The annual report list is at https://ipindia.gov.in/annual-report.

### Licence

The ipindia.gov.in Copyright Policy (raw file `ipindia/copyright-policy.html`): "Material featured
on this website may be reproduced free of charge in any format or medium without requiring specific
permission, subject to the conditions below. This is in accordance with the Government of India's
policy on the reuse of public information. The material must be reproduced accurately and not used
in a derogatory manner or in a misleading context. Wherever the material is being published or
issued to others, the source must be prominently acknowledged as "Office of the Controller General
of Patents, Designs and Trade Marks, Government of India (ipindia.gov.in)"." Every chart names the
office and the report.

### Raw files

Fetched with `pipeline/science-technology/fetch.sh` between 04:40 and 04:42 UTC on 27 Nov 2026.
Each folder's `_log.tsv` has the URL, the sha256 and the time.

| File under `raw/science-technology/` | Content | Pages | SHA-256 |
| --- | --- | --- | --- |
| `ipindia/annual-report-page.html` | Annual report list | | `1a2749efd115ad24fa9499a7c7d9aa2969c51bf81cd984d0aa67238c6f2e946e` |
| `ipindia/copyright-policy.html` | Copyright Policy | | `474dba74e0af8c1634555934dd4c7bd346a889fa587e83a88c38ecce2daf8fe4` |
| `ipindia/ar-2024-25.pdf` | Annual Report 2024-25 | 180 | `f4d0d9c72d0fc3f7d1dafea570f956a2f842957fbd81733ddab9c95d7b8d6ffd` |
| `ipindia/ar-2022-23.pdf` | Annual Report 2022-23 (checks) | 176 | `3ba584b390cb12baa0bc07201df1236f710f96e5ba935e223f9f9cc59e73165d` |
| `ipindia/ar-2014-15.pdf` | Annual Report 2014-15 (scan) | 100 | `13418bae649d1ac3b99876c5809155962b0595b71c39e2839c7ca5dacda3c780` |
| `ipindia/ar-2019-20.pdf` | Annual Report 2019-20. Not used: a scan with no text layer, and its years are in the 2024-25 report | 127 | `b57f434267e681d920593f8df9e58e0d9a31aaa9fcc20c79d43abdf6be3d0910` |
| `ipindia/ar-2009-10.pdf` | Annual Report 2009-10. Not used: a scan, and its years are in the 2014-15 report | 86 | `a48b0b3feb15a4746577b4ca0bfd0eee1ac743f3cfbac5149826bf3d1e4b4271` |
| `ipindia/ar-2004-05.pdf` | Annual Report 2004-05. Not used yet: years before 2005-06 | 72 | `afd6c7666e0427934286be3234ff6c2b911e8b7f0c7012dc2842204ae9f0bd84` |

## How the CSVs are made

Run, from the repository root:

```sh
pipeline/science-technology/fetch.sh ipindia/
pipeline/science-technology/extract_text.sh ipindia/
python3 -I pipeline/science-technology/build_patents.py
```

`extract_text.sh` writes the layout text and the reading-order text (`pdftotext -raw`, `.raw.txt`)
of each PDF to `work/science-technology/`. The builder reads the reading-order text, where each
table cell is one token.

The 2014-15 report is a scan. Its OCR text layer is out of order, so the builder holds the values
of Appendix C and D as transcribed from the page images (PDF pages 39 and 40, printed pages 35 and
36), and checks 2013-14 and 2014-15 against the 2022-23 report.

## CSVs

Every CSV is in long format, with `geography` (`india` or a slug from `research/data/geography.csv`),
`period` (a financial year), `value` and `unit`. `value` keeps the publisher's digits. `report_table`
names the report and table the value comes from.

### `patent-applications.csv`

- 100 rows: India, 2005-06 to 2024-25, five `applicant` values: `residents`, `non-residents,
  ordinary`, `non-residents, convention`, `non-residents, PCT national phase` and `all applicants`
  (the published grand total). Unit: patent applications.
- Source: Appendix C of the Annual Report 2014-15 (2005-06 to 2014-15) and of the Annual Report
  2024-25 (2015-16 to 2024-25).
- Checked values: 2024-25, residents 68201 and all applicants 110375; 2005-06, residents 4521 and all
  applicants 24505.

### `patents-granted-and-in-force.csv`

- 180 rows: India, 2005-06 to 2024-25. `measure`: `patents granted`, `patents in force`, `requests
  for examination`, `abandoned, no complete specification (Sec. 9(1))`, `abandoned, not put in order
  (Sec. 21(1))`. `patentee`: `indian`, `foreign` or `all`.
- Source: Appendix D of the Annual Reports 2014-15 and 2024-25.
- The `all` rows of patents granted and patents in force are `derived` (rule R3): the sum of the
  Indian and foreign columns, which Appendix D gives without a total. For 2020-21 to 2024-25 the
  sum equals the "Granted" row of the trends table, and for 1 April 2025 the 230480 patents in force
  of the report text (the script checks both).
- Checked values: 2024-25, granted 10682 Indian and 22822 foreign; 2023-24, 25082 and 77975; in force
  on 1 April 2025, 50848 Indian and 179632 foreign.

### `patent-applications-by-state.csv`

- 280 rows: 35 states and UTs, 2023-24 and 2024-25, four `route` values: `ordinary`,
  `convention`, `PCT national phase` and `all routes`. Lakshadweep is not in Appendix B.
- Source: Appendix B of the Annual Report 2024-25, "Applications for patent filed in the year
  2024-25 as against 2023-24 according to state of origin".
- `all routes` is `derived` (rule R3): the sum of the three routes. The report text quotes these sums
  for the top states (Tamil Nadu 15440, Karnataka 8371, Maharashtra 7893), and the script checks
  them.
- The states add up to the TOTAL row (67822 ordinary, 225 convention, 154 PCT in 2024-25), and the
  three routes add up to the residents in Appendix C: 68201 in 2024-25 and 51574 in 2023-24.

### `patent-applications-by-applicant-type.csv`

- 50 rows: India, 2020-21 to 2024-25, five `applicant_type` values (`natural person`, `startup`,
  `small entity`, `educational institution`, `other than natural person`), `origin` `indian` or
  `foreign`.
- Source: Chapter 2, section 1.3, "Trends in Category-Wise Patent of Applications", Annual Report
  2024-25.
- Checked values: 2024-25, educational institutions 37681 Indian; natural persons 17170 Indian;
  startups 2680 Indian.

### `patents-by-field.csv`

- 220 rows: India, 2020-21 to 2024-25, `measure` `applications filed` or `patents granted`. `group`
  `major` is the ten fields of Appendix E and F plus `all fields` (the published total); `group`
  `other` is the fields of Appendix E1 and F1, which add up to the major field `other fields`.
- From 2022-23 the office prints pharmaceuticals as 0 and counts them in `chemical` ("Chemical
  Applications includes Pharmaceutical Applications"). Compare `chemical` across 2021-22 and 2022-23
  only with this in mind.
- Checked values: 2024-25, computer science and electronics, 29494 filed and 10058 granted.

### WDI CSVs in `../international/`

`wdi-rd-spending.csv` (`GB.XPD.RSDV.GD.ZS`), `wdi-researchers-per-million.csv`
(`SP.POP.SCIE.RD.P6`) and `wdi-journal-articles.csv` (`IP.JRN.ARTC.SC`). See that folder's README.

## Checks

`build_patents.py` runs 158 checks and stops if any fails:

- The years that overlap in two reports agree: Appendix C and D of the 2024-25 report against the
  2022-23 report (2015-16 to 2022-23), and the transcribed 2014-15 values against the 2022-23 report
  (2013-14 and 2014-15). Every value agrees.
- Appendix C: residents and the three non-resident routes add up to the grand total each year, except
  2006-07 (below). Appendix C equals the trends table for 2020-21 to 2024-25.
- Appendix C and Appendix D give the same filings each year, except 2019-20 (below).
- Appendix B: the states add up to the TOTAL row, and the total equals Appendix C residents. The
  report text's state totals equal the derived sums.
- The category table: categories add up to each origin's total, and the totals equal Appendix C,
  except 2020-21 (below).
- Appendix E and F: the fields add up to the total, and E1 and F1 add up to "other fields", except
  the two cells below.

Each known difference is checked too, so the script stops if a later report corrects it.

## Gaps and cautions

- **The publisher's tables do not always add up.** The CSVs keep the printed values.
  - 2006-07, Appendix C (2014-15 report): residents 5314 plus the non-resident routes (693, 3969,
    19768) make 29744, against a grand total of 28940. Appendix D also gives 28940.
  - 2019-20: Appendix C gives 56468 applications, Appendix D 56267. Both the 2022-23 and the 2024-25
    reports print both.
  - 2020-21, category table: Indian categories add up to 24336 against an Indian total of 24326,
    and the foreign total is 34167 against 34177 in Appendix C. The grand total, 58503, agrees.
  - 2020-21, Appendix E1: the other fields add up to 7453, against 7480 in Appendix E.
  - 2024-25, Appendix F: the major fields add up to 33506, against a total of 33504. Appendix F1
    adds up to 2209, against "other fields" 2211: the 2 appears to sit in "other fields".
- **Grants swing.** Grants were 34134 in 2022-23, 103057 in 2023-24 and 33504 in 2024-25. The
  report gives no reason. Applications examined fell from 73165 in 2020-21 to 15726 in 2024-25, and
  disposals from 126003 to 40606 between 2023-24 and 2024-25. The office recruited 407 examiners in
  January 2025 (Annual Report 2024-25). Read a year's grants as the office's output, not as the
  year's inventions.
- **State of origin is an address.** The state is the address of the Indian applicant.
- **Counts, not rates.** No chart divides by population or by GDP. A per-person rate would be a
  derived value with a second source.
- **Before 2005-06.** The 2004-05 report has text, and older reports are listed back to 2002-03.
  Not built yet.

## Held back

Both of these were read on 27 Nov 2026, and both websites allow reuse only "after taking proper
permission by sending a mail to us": the same terms as Agricultural Statistics at a Glance in
Agriculture. No CSV is built from them yet, and no page quotes them. The owner must send the request
and keep the reply.

| Publisher | Release | Pages | What it has | SHA-256 |
| --- | --- | --- | --- | --- |
| DST, NSTMIS | Research and Development Statistics at a Glance 2025-26 (PDF created 29 Jul 2026), `https://www.nstmis-dst.org/Pdfs/RD%20STATISTICS%20AT%20A%20GLANCE%202025-26.pdf` | 33 | Summary charts of national R&D spending | `09839a889108586da48a565cc96e6c3537e1af9affb78901b652ffd2f77ebd7d` |
| DST, NSTMIS | S&T Indicators Tables 2025-26 (PDF created 29 Jul 2026), `https://www.nstmis-dst.org/Pdfs/ST%20INDICATORS%20TABLES%202025-26.pdf` | 63 | National R&D spending and its ratio to GDP from 1995-96, by sector from 1970-71, researchers, PhDs, and patent tables taken from IP India | `5f469b78fd151c8a3b32e278e04a3c30c31aa1585ead682c947bd6eac728611e` |
| DST, NSTMIS | R&D Statistics at a Glance 2022-23 and S&T Indicators Tables 2022-23 (the previous edition) | 23, 54 | As above, to 2020-21 | `8928f5ba993bb6e85c1c978637f70d31e8008e1b741f54d99805ceed55e61de3`, `7a659a7b7c5e39d5284c33035fa3c535b32e0fef08dac559b8376b68959ad12f` |
| DST, NSTMIS | Copyrights Policy and Regular Publications pages | | Licence; list of editions | `4c306110732d4e14d726e60053ff0a407ccfb13bddeec4c2e03336b3aa88b117`, `1d7631cf4c3c84db4ea46cfd03bfa6b27bc73c650396cc70e5a0f2bb40b43d34` |
| TRAI | The Indian Telecom Services Yearly Performance Indicators 2025-26 (PDF created 5 Oct 2026), `https://trai.gov.in/sites/default/files/2026-10/YIR_05102026_0.pdf`, with Press Release No. 127/2026 | 147, 11 | Revenue per GB of wireless data, data used per subscriber, internet subscribers per 100 people by state | `bb1f68bee1b81c7c4059026d4d38357926cb9d7d69328830a8965e1bba6a3bc3`, `0be7f714c506646f131b76c56ac20c489fd659b4ec01313afb2300b1bc01e1cd` |
| TRAI | Yearly Performance Indicators 2024-25 and 2023-24 | 176, 161 | As above, for the earlier years | `f43d5a3be0d568ab2b8a23a7db8219bcbc3d4b5d1a717d29cc275f3796aaef98`, `5c03d0fbd17b03af39525ae8241792d419fc93d1a27606cb110cc6562677ed7b` |
| TRAI | Website Policy page | | Licence | `81bc766d879da3a5b19ca41763a0f31f044774b00d5e3d68efadc472eebcab46` |

Notes for when permission comes:

- DST's Table 3 joins three GDP series (2004-05, 2011-12 and 2022-23 bases) and a new national
  survey (2024-25, the first since 2018-19). Its R&D spending rises sharply between 2020-21 and
  2021-22, mostly in the private sector. Show a method break there, and mark 2024-25 and 2025-26
  as estimates (the table's note: "*Estimated").
- TRAI's yearly reports start with 2022-23. A longer price series needs the quarterly reports.
- data.gov.in may carry parts of both under the Government Open Data License - India, which needs no
  request. Not checked: its data files need an API key.

## Proposed charts

Kinds are from `src/content/types.ts`. All nine are on the topic page.

| Part | Chart | Kind | Data |
| --- | --- | --- | --- |
| How many patents do Indians apply for? | `patent-applications` | columns, stacked | `patent-applications.csv` |
| | `patent-applications-by-state` | states, with a 2023-24 to 2024-25 timeline | `patent-applications-by-state.csv`, all routes |
| | `patent-applications-by-applicant-type` | columns, stacked | `patent-applications-by-applicant-type.csv`, Indian |
| How many patents does India grant? | `patents-granted` | columns, stacked | `patents-granted-and-in-force.csv` |
| | `patents-in-force` | line | `patents-granted-and-in-force.csv` |
| | `patents-by-field` | bars, two panels | `patents-by-field.csv`, 2024-25, major fields without pharmaceuticals |
| How does India's research compare? | `rd-spending-comparison` | dots, 2000 and 2020 | `../international/wdi-rd-spending.csv` |
| | `researchers-comparison` | dots, 2000 and 2020 | `../international/wdi-researchers-per-million.csv` |
| | `journal-articles` | line, India | `../international/wdi-journal-articles.csv` |
