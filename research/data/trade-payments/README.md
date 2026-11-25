# Trade and payments

Data for future site pages on trade, the balance of payments and digital payments. No topic uses
these CSVs yet. The parent task decides whether they become a Trade topic, a Money and payments
topic, or new parts of the Economy topic. "Proposed charts" at the end gives a recommendation.

All values come from the Reserve Bank of India (RBI). Read on 25 Nov 2026.

## Questions these data answer

1. Does India spend more abroad than it earns (the current account balance), and how large is the gap against GDP?
2. Which parts fill the gap: goods trade, services, money sent home by Indians abroad, or income on investments?
3. How much does India export and import, and which goods and partner countries matter most?
4. How large are India's foreign exchange reserves, and how many months of imports do they cover?
5. How fast is digital payment growing: UPI, cards, NEFT, RTGS and IMPS, month by month?
6. How many cards, ATMs and card terminals does India have?

## Sources

| Publisher | Release | Release date | Data period | Link | Read |
| --- | --- | --- | --- | --- | --- |
| RBI | Handbook of Statistics on the Indian Economy 2025-26: Tables 58, 111 to 131, 143, 144, 241, and "Notes on Tables" | 31 Jul 2026 ("Date : Jul 31, 2026" on every table page) | 1968-69 to 2025-26 (varies by table) | [Handbook list](https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=Handbook%20of%20Statistics%20on%20Indian%20Economy); each table is `https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=<23825 + table number>` | 25 Nov 2026 |
| RBI | Payment System Indicators (PSI), monthly, June 2021 to October 2026 (65 releases) | Not stated. The pages give no release date | June 2020 to October 2026, and financial years 2020-21 to 2025-26 | [PSI, October 2026](https://www.rbi.org.in/Scripts/PSIUserView.aspx?Id=65); the release for month N is `PSIUserView.aspx?Id=N`, with Id 1 = June 2021 | 25 Nov 2026 |
| RBI | Website policies, "Copyright Policy" | Not stated | Not applicable | [Disclaimer and Website Policies](https://www.rbi.org.in/Scripts/Disclaimer.aspx) | 25 Nov 2026 |

**Reuse terms.** The RBI Copyright Policy says: "The material featured on this website may be
reproduced accurately and without modification, subject to appropriate acknowledgement of the RBI
as the source. However, the permission to reproduce this material does not extend to any material
which is identified as being copyright of a third party." Every chart must name the RBI. Tables 111
to 123 (foreign trade) name the Directorate General of Commercial Intelligence and Statistics
(DGCI&S) as "Source". They do not mark the figures as third-party copyright. Name both on a trade
chart: "RBI, Handbook of Statistics on the Indian Economy 2025-26, Table 111 (source: DGCI&S)".

**Status words.** RBI uses these words, and the `status` column keeps them:

- Balance of payments (Tables 124 to 131): "Data for 2025-26 are preliminary estimates." Column value `preliminary estimate`.
- Table 241: "Data for 2024-25 relate to Revised Estimates while 2025-26 are Provisional Estimates." Values `revised estimate`, `provisional estimate`.
- Foreign trade: Tables 111 and 113, 2025-26 provisional and 2024-25 revised; Table 115, 2023-24 and 2024-25 revised; Table 119, 2021-22 to 2024-25 revised. Values `provisional`, `revised`.
- PSI: "Note: 1. Data is provisional." on every release. Value `provisional` on every row.

Proposed: on the site, all of these take the `Provisional` status word.

## How the files were read

- **The XLSX files are blocked to scripts.** Each Handbook table and each PSI release links an XLSX
  and a PDF on `rbidocs.rbi.org.in`. On 25 Nov 2026 that server returned an HTML page with a
  JavaScript bot check (F5 `TSPD`) instead of the file, to `curl` and to headless Chromium
  (Playwright with the project User-Agent). The economy topic met the same block on 18 Nov 2026.
- **Decision: read the HTML tables.** `www.rbi.org.in` serves each Handbook table and each PSI
  release as an HTML table, to `curl`, with the project User-Agent. These are RBI's own tables, with
  the same figures as the XLSX. The economy topic used the same route for Table 133.
  `pipeline/common/text.mjs` was not needed, because the HTML pages load without a browser.
- **PSI archive.** The PSI page lists its archive by year through an ASP.NET form.
  `fetch_psi.py` posts the form for 2021 to 2026 and saves each month. The archive has 65 releases,
  from June 2021 (Id 1) to October 2026 (Id 65). The form returns no releases for 2016 to 2020. RBI
  spells December 2024 "Decmber" in the archive list.
- **HTTP 418.** RBI answered HTTP 418 to a GET request that carried a form `Content-Type` header.
  `fetch_psi.py` sends that header only with the form post.
- **Checksums change.** The HTML pages carry changing ASP.NET form state. Two downloads of the same
  table page on 25 Nov 2026, about 20 minutes apart, gave different sha256 values for 25 of the
  26 Handbook pages (only Table 58 kept its sha256). The sha256 in "Raw files" identifies the files
  that made the CSVs. The checked values below identify the content.

## Rebuild

```sh
pipeline/trade-payments/fetch_handbook.sh                      # Handbook tables and RBI policy page
python3 -I pipeline/trade-payments/fetch_psi.py                # 65 PSI releases
python3 -I pipeline/trade-payments/build_trade_payments.py     # ten CSVs; stops if a check fails
```

Every fetch appends file, URL, sha256 and UTC time to `raw/trade-payments/_log.tsv`.

## CSVs

Every CSV has `geography` (always `india`), `period`, `value` and `unit`. Values keep RBI's digits.
The script removes only the Indian digit-group commas that some PSI cells carry (`12,93,080`).
A "-" in the table gives an empty value.

### `current-account-annual.csv` (2,420 rows)

- The current account and its parts, 1996-97 to 2025-26, in US$ million and ₹ crore.
- `item`, `flow` (`receipts`, `payments`, `net`), `rbi_label` (the row as RBI prints it), `table`, `status`.
- Tables 128 (US$) and 129 (₹), "Key Components of India's Balance of Payments", 1996-97 to 2025-26:
  merchandise exports (f.o.b.) and imports (c.i.f.), trade balance, invisibles (net), current account,
  capital account and its parts, overall balance, reserves change, IMF and SDR allocation.
- Tables 130 (US$) and 131 (₹), "Invisibles by Category of Transactions", 2006-07 to 2025-26:
  services (`services`, with `travel`, `transportation`, `insurance`,
  `government-not-included-elsewhere`, `miscellaneous-services`), primary income (`income`, with
  `investment-income`, `compensation-of-employees`), `private-transfers` (mostly remittances) and
  `official-transfers`, each as receipts, payments and net. Invisibles receipts and payments come
  from Table 130; invisibles net comes from Table 128 only.
- A negative current account is a deficit. A negative "reserves change" is an increase in reserves
  (RBI's label: "increase -/ decrease +").
- Decision: Tables 128 to 131 give the longest series in one presentation. Table 126 (BPM6) starts in
  2022-23 only.

### `bop-indicators-annual.csv` (429 rows)

- Table 241, "Balance of Payments Indicators", 1987-88 to 2025-26: exports, imports, invisibles and
  current receipts as a share of GDP; current receipts to current payments; current account to GDP;
  net foreign investment to exports and to GDP; import cover of reserves in months.
- `indicator`, `rbi_label`, `gdp_base`, `status`. This is the only RBI table found that prints the
  current account as a share of GDP. RBI heads the column "CAD / GDP", but the sign shows the
  balance: -0.61 in 2025-26 is a deficit, 0.93 in 2020-21 a surplus. The slug is
  `current-account-balance-to-gdp`.
- `gdp_base` follows the table note: GDP at current market prices on base 1999-2000 up to 2003-04,
  2004-05 for 2004-05 to 2010-11, 2011-12 for 2011-12 to 2021-22, and 2022-23 from 2022-23. Show a
  method break at each change.

### `bop-bpm6-annual.csv` (960 rows)

- Table 126, "Standard Presentation of India's Balance of Payments as per BPM6", US$ million,
  2022-23 to 2025-26. All 80 rows, with RBI's `code` (for example `1.A.b.9`, telecommunications,
  computer and information services), `item`, and `flow` (`credit`, `debit`, `net`).
- Use this file for the BPM6 detail: goods split into general merchandise, merchanting and
  non-monetary gold; 12 service types; primary and secondary income; the financial account.
- Table 127 (₹) was downloaded and not used.

### `merchandise-trade-annual.csv` (351 rows)

- Table 111, "India's Foreign Trade - US Dollar", 1987-88 to 2025-26. `flow` (`exports`, `imports`,
  `trade-balance`) by `product` (`oil`, `non-oil`, `total`), US$ million, one decimal.
- These are DGCI&S customs figures. They differ from the BoP merchandise figures in
  `current-account-annual.csv`; see "Gaps and cautions".

### `merchandise-trade-by-commodity.csv` (384 rows)

- Tables 113 (exports) and 115 (imports), "Major Commodities", US$ million, 2020-21 to 2025-26.
  31 commodity groups and the total for each flow, with RBI's `commodity_no` and name.
- Top export groups in 2025-26: Engineering Goods (122,433.8), Petroleum Products (53,828.1),
  Electronic Goods (47,962.3), Drugs & Pharmaceuticals (31,116.3), Organic & Inorganic Chemicals
  (28,673.4), Gems & Jewellery (28,208.3).
- Top import groups in 2025-26: Petroleum, Crude & products (1,73,941.9), Electronic goods
  (1,16,176.2), Gold (71,977.3), Machinery, electrical & non-electrical (61,730.4), Other
  Commodities (37,314.9), Transport equipment (34,756.0).
- The groups are RBI's 31 groups, not a full classification. "Other Commodities" is a residual.

### `merchandise-trade-by-partner.csv` (530 rows)

- Table 119, "Direction of Foreign Trade - US Dollar", 2021-22 to 2025-26, exports and imports.
- `level`: `group` (OECD, OPEC, Eastern Europe, Asia, Africa, Latin America, Others, Unspecified),
  `region` (European Union, North America, Asia and Oceania, Other OECD, SAARC, Other Asian
  Countries), `country` (the 40 countries RBI names), `total`. `group` and `region` name the parent.
- RBI lists only selected countries under each group ("Of which:"), so countries do not add up to
  their group.

### `forex-reserves-end-march.csv` (580 rows)

- Table 144, "Foreign Exchange Reserves", end of each financial year, 1968-69 to 2025-26. `period`
  is the financial year; `as_on` is its last day (2025-26 is 31 Mar 2026).
- `component`: `sdrs`, `gold`, `foreign-currency-assets`, `reserve-tranche-position`, `total`, each
  in ₹ crore and US$ million. RBI marks negligible values "-"; these rows are empty, with `note`.
- Total at end-March 2026: US$ 6,91,108 million.

### `payments-monthly.csv` (2,772 rows)

- PSI Parts I and II, volume (lakh transactions) and value (₹ crore), June 2020 to October 2026
  (77 months), for 18 items: `rtgs`, `neft`, `imps`, `upi`, `nach-credit`, `nach-debit`,
  `retail-credit-transfers`, `card-payments`, `credit-cards`, `debit-cards`,
  `prepaid-payment-instruments`, `paper-based-instruments`, `total-retail-payments`,
  `total-payments`, `total-digital-payments`, `mobile-payments`, `internet-payments`,
  `cash-withdrawal-at-atms`.
- Each release prints four columns: the last full financial year, the same month a year earlier,
  the month before, and the release month. So each month is printed up to three times.
- Decision: each row takes the value from the latest release that prints the month. `release`
  names it. Reason: RBI revises earlier months, and the latest print is RBI's current figure. The
  crime topic takes counts from the latest edition for the same reason.
- June 2020 to May 2021 come only from the "same month a year earlier" column of the June 2021 to
  May 2022 releases.
- `rbi_label` drops RBI's footnote marks (@, $, #, *). Their meanings are in "Gaps and cautions".
- `card-payments` (RBI row 4) is credit cards plus debit cards. RBI splits each card row into "PoS
  based" and "Others". The Handbook note on Table 58 says card data "pertains to Scheduled
  Commercial Banks (excluding Regional Rural Banks) and Payment Banks only".
- Cash withdrawal at ATMs is not a payment. It is in the file for a comparison with cash.

### `payments-annual.csv` (216 rows)

- PSI financial-year column, 2020-21 to 2025-26, same 18 items and the same latest-print rule.
- Check: Handbook Table 58 (2021-22 to 2025-26, volume in whole lakh, value in whole ₹ crore)
  agrees within rounding with all 80 values compared (8 items, 5 years, volume and value).

### `payment-infrastructure-monthly.csv` (693 rows)

- PSI Part III, in lakh, end of month, June 2020 to October 2026: `cards`, `credit-cards`,
  `debit-cards`, `ppis` (prepaid instruments), `atms` or `atms-and-crms`, `micro-atms`,
  `pos-terminals`, `bharat-qr`, `upi-qr`. Same latest-print rule.
- UPI QR is empty for June to August 2020 ("-"; RBI: "New inclusion w.e.f. September 2020").

## Checks done on 25 Nov 2026

`build_trade_payments.py` stops with an error if any of these values differs. Each value was read
from the RBI HTML table text.

| CSV | Values checked | Published table |
| --- | --- | --- |
| `current-account-annual.csv` | Current account 2025-26 US$ -25,365 million and 2020-21 US$ 23,912 million (Table 128); private transfer receipts 2025-26 US$ 1,55,120 million (Table 130); current account 2025-26 ₹ -2,20,852 crore (Table 129) | Handbook Tables 128 to 130 |
| `bop-indicators-annual.csv` | Current account to GDP -0.61% (2025-26) and -4.29% (2011-12); import cover 17.38 months (2020-21) | Table 241 |
| `bop-bpm6-annual.csv` | 1.A.b.9 net 2025-26 US$ 1,79,302 million; current account net 2023-24 US$ -26,033 million; personal transfers credit 2024-25 US$ 1,32,065 million | Table 126 |
| `merchandise-trade-annual.csv` | Exports 2025-26 US$ 4,41,730.1 million; imports 1987-88 US$ 17,155.7 million; trade balance 2025-26 US$ -3,33,248.1 million | Table 111 |
| `merchandise-trade-by-commodity.csv` | Engineering Goods exports 2025-26 US$ 1,22,433.8 million (Table 113); gold imports 2025-26 US$ 71,977.3 million; total imports 2024-25 US$ 7,21,200.2 million (Table 115) | Tables 113, 115 |
| `merchandise-trade-by-partner.csv` | Exports to the USA 2025-26 US$ 87,316.0 million; imports from China 2025-26 US$ 1,31,633.4 million; total imports 2025-26 US$ 7,76,013.6 million | Table 119 |
| `forex-reserves-end-march.csv` | Total end-March 2026 US$ 6,91,108 million; total end-March 1969 US$ 769 million; gold end-March 2026 ₹ 10,94,309 crore | Table 144 |
| `payments-monthly.csv` | UPI volume October 2026, 2,54,666.92 lakh; RTGS value October 2026, ₹ 2,34,53,839 crore; UPI value October 2025, ₹ 27,27,791 crore | PSI October 2026 |
| `payments-annual.csv` | UPI volume 2025-26, 24,16,168.86 lakh; total digital payments value 2025-26, ₹ 32,51,03,565 crore; RTGS value 2025-26, ₹ 22,73,72,648 crore | PSI October 2026 |
| `payment-infrastructure-monthly.csv` | PoS terminals October 2026, 107.12 lakh; credit cards October 2026, 1,267.16 lakh; UPI QR October 2025, 7,174.34 lakh | PSI October 2026 |

Cross-table checks that also stop the script:

- Table 130 invisibles net equals Table 128 invisibles net in all 20 years; Table 131 equals Table 129.
- Table 124 (overall BoP, 2020-21 to 2025-26) current account net equals Table 128, and its services net and services receipts equal Table 130, in all 6 years.
- Table 126 goods net (1.A.a) equals the Table 128 trade balance in all 4 years.
- Each PSI release: the title month matches the file, and the header months are the release month, the month before and the same month a year earlier. All 18 flow items and 9 infrastructure items are present.
- Each Handbook page carries "Date : Jul 31, 2026".

The script also reports, without stopping: the Table 58 comparison (0 of 80 differ by more than
rounding), and the difference between Table 111 and Table 115 for 2024-25 imports (below).

## Gaps and cautions

- **Two presentations of the current account.** Tables 124 and 128 to 131 follow RBI's older
  presentation (receipts and payments, "invisibles"). Table 126 follows the IMF Balance of Payments
  Manual, 6th edition (BPM6). They give different current account balances for the same year:
  2022-23, US$ -67,055 million (Table 128) against US$ -66,984 million (Table 126); 2025-26,
  US$ -25,365 million against US$ -25,240 million. Goods are the same in both. Do not mix the two
  in one chart. Use one table per chart and name it.
- **BPM5 and BPM6, and other coverage changes.** The Handbook gives the BPM6 standard presentation
  (Table 126) for 2022-23 to 2025-26 only. Tables 128 to 131 run as one series from 1996-97. The
  Handbook "Notes on Tables" (for Tables 124 to 131, 143 and 241) give no year in which RBI moved
  from BPM5 to BPM6. They list these changes inside the series:
  - "'Compensation of Employees' has been shown under the head, 'Income' with effect from 1997-98;
    earlier, 'Compensation of Employees' was recorded under the head 'Services - Miscellaneous'."
  - "Data on business services are available only from 2004-05 onwards".
  - FDI "up to 1999-2000 comprise mainly equity capital"; from 2000-01 it also includes reinvested
    earnings and other capital. This affects `foreign-investment` and `investment-income`.
  - Gold and silver brought in by Indians returning from abroad are in imports, with a contra entry
    in private transfer receipts, "since 1992-93".
  - "The item 'Non-monetary Gold' is shown separately within the goods account as per the IMF's
    Balance of Payments Manual (6th edition)."
  A chart that starts before 2000-01 must say that FDI coverage changed. A services chart by type
  must start in 2004-05 or say that business services are missing before it.
- **Customs and BoP trade differ.** Table 111 (DGCI&S, customs) gives exports of US$ 4,41,730.1
  million in 2025-26. Table 128 (BoP, f.o.b.) gives US$ 4,46,147 million. Imports: US$ 7,74,978.2
  million (customs) against US$ 7,83,435 million (BoP). The BoP adds and removes items by method
  (timing, valuation, goods that do not cross the border). Use Table 111 for trade charts and Table
  128 for the current account. Never mix them.
- **Handbook tables disagree on 2024-25 imports.** Table 111 gives US$ 7,21,131.5 million;
  Tables 115 and 119 give US$ 7,21,200.2 million. Table 115 marks 2023-24 and 2024-25 as revised,
  Table 111 only 2024-25. Table 119 also gives 2025-26 totals (exports US$ 4,41,745.9 million,
  imports US$ 7,76,013.6 million) above Table 111. Each CSV keeps its own table's figures.
- **Revisions in the Handbook.** 2025-26 is preliminary or provisional in every table; 2024-25 is
  revised. The next Handbook (estimated July 2027, from the 31 Jul 2026 date of this edition) will
  change them. Keep the old values in this README when that happens (CONTRIBUTING.md, step 4).
- **PSI revisions.** 676 of the 2,772 monthly values change by more than rounding between the first
  and the latest print. UPI, NEFT, RTGS and IMPS never change. Card values change by up to 3.01%
  (debit card volume, May 2021). Internet payments change most: the value for June 2021 rose from
  ₹ 34,68,700 crore (June 2021 release) to ₹ 67,09,926 crore (June 2022 release). Do not chart
  internet payments without a caution, or leave them out.
- **PSI definition breaks.**
  - RBI note 3: "The data from November 2019 onwards for card payments (Debit/Credit cards) and
    Prepaid Payment Instruments (PPIs) may not be comparable with earlier months/ periods". All data
    here start in June 2020, after this break.
  - RBI note 2: "ECS (Debit and Credit) has been merged with NACH with effect from January 31, 2020."
    Also before these data.
  - ATMs: up to the November 2021 release the row is "Number of ATMs"; from the December 2021 release
    it is "Number of ATMs and CRMs" (cash recycler machines), with the note "#: Data reported by
    Co-operative Banks, LABs and RRBs included with effect from Dec 2021". The CSV keeps the two as
    `atms` (June to November 2020) and `atms-and-crms` (December 2020 onwards, as printed a year
    later). Show a method break between them.
  - Marks on RBI labels: "@: New inclusion w.e.f. November 2019" (UPI, AePS, internet payments and
    others); "$: Inclusion separately initiated from November 2019 - would have been part of other
    items hitherto"; "*: New inclusion w.e.f. September 2020; Includes only static UPI QR Code".
  - RBI note 4: "Only domestic financial transactions are considered." Failed transactions,
    chargebacks and reversals are excluded.
- **No PSI release dates.** The PSI pages give no release date. The source record says "not stated".
- **No earlier PSI in this format.** The archive starts with the June 2021 release, so the monthly
  series starts in June 2020. We did not look for earlier monthly payment data in other RBI releases.
- **National only.** None of these tables gives state figures. A trade or payments page would add
  nothing to the state profiles.
- **Not used.** Tables 112, 114, 116 (₹ trade), 117 and 118 (commodities by country), 120 (₹
  direction), 121 to 123 (trade indices), 125 and 127 (₹ BoP) and 143 (foreign investment) were
  downloaded and not used. PSI Part IV (international card use) and Part V (payment fraud) were not
  used. The exchange rate (Table 133) and the repo rate are in `research/data/economy/` and
  `research/data/prices/`; this folder does not repeat them.

## Raw files

Paths are relative to `raw/trade-payments/`. URL prefix: `https://www.rbi.org.in/Scripts/`. Read on
25 Nov 2026 (UTC times in `_log.tsv`).

| File | URL (after the prefix) | SHA-256 |
| --- | --- | --- |
| `pages/disclaimer.html` | `Disclaimer.aspx` | `d4f032b100976c3f851555e83bfd3bb3c562d00a4294ba441f19b1fb1682d550` |
| `handbook/list.html` | `AnnualPublications.aspx?head=Handbook%20of%20Statistics%20on%20Indian%20Economy` | `4a7d077150e12e2b9192616671c8a55623b9ef94659e77bacf344265d3f234e6` |
| `handbook/notes-on-tables.html` | `PublicationsView.aspx?id=24071` | `af97c7eb2c21d01c875b8325ea7f940075cd950f5da1d50038671b7e580ab132` |
| `handbook/table-58.html` | `PublicationsView.aspx?id=23883` | `2cc048891173b198983db9d9a8a9fb8a8a4062a9d14e8fd806793e1594e78dab` |
| `handbook/table-111.html` | `PublicationsView.aspx?id=23936` | `27ad12d27f09107183c829d13133d33510ca6aa48856740621f6af4bf12fba4f` |
| `handbook/table-112.html` | `PublicationsView.aspx?id=23937` | `0d58b9051937aae095d8c49822525b4a32a3f4012758c592e5687073bcd7b00d` |
| `handbook/table-113.html` | `PublicationsView.aspx?id=23938` | `eed6c263463e7d453beb3f2061b5456b07734a7490d0d7dd4a38587fcaf396b7` |
| `handbook/table-114.html` | `PublicationsView.aspx?id=23939` | `98fe28c6b6f9230dc13f7e7c68d6ee69783e283108726778b256e114d4b14e46` |
| `handbook/table-115.html` | `PublicationsView.aspx?id=23940` | `c2f7ea0d456e10182e23c81da0fa8d61fbf09afc9d04700769e613913b17a9ad` |
| `handbook/table-116.html` | `PublicationsView.aspx?id=23941` | `11596e01ebb8c334d53442fbb7055b38bf5ca96d61b9372862cdcbd22c051f57` |
| `handbook/table-117.html` | `PublicationsView.aspx?id=23942` | `861d7fe85a9f1ed0d88134457b23dd6e70ac4d8a8a24f432bbcd7cba4eaf550b` |
| `handbook/table-118.html` | `PublicationsView.aspx?id=23943` | `038ec7a1505d820ea3b5c7e99d50afd4849306b35617bcbf923dae8d604a3ab2` |
| `handbook/table-119.html` | `PublicationsView.aspx?id=23944` | `ba704495b3366eaa55e14b1ea420a21ec29d8b9f8b6f17f32e5b2ba4eaaf5397` |
| `handbook/table-120.html` | `PublicationsView.aspx?id=23945` | `32a9f82a871d545f44ad901301fc30d387ebcc01d0ee5132f919074754cd1b37` |
| `handbook/table-121.html` | `PublicationsView.aspx?id=23946` | `c440efacce67f2381298329c57aa126efe56e4c9af64c2a26e1e0a39b01e97cc` |
| `handbook/table-122.html` | `PublicationsView.aspx?id=23947` | `eaf7b102d47decf93884e4e33242275913fe8b1655dd9ab65e9346c2d2d7af1c` |
| `handbook/table-123.html` | `PublicationsView.aspx?id=23948` | `8f0d2c9f4872ff9ee82e62756511a207d2642839b12230b18ae5b627bac1f3d6` |
| `handbook/table-124.html` | `PublicationsView.aspx?id=23949` | `9940ec0e76fb6fd92a83ffc65a69647b1140a7c14963e93770e5ccfefee41b74` |
| `handbook/table-125.html` | `PublicationsView.aspx?id=23950` | `acd0db3868b0cd1af79c424dd8cd29e18fc47ff0dee02f2ba065612af2898194` |
| `handbook/table-126.html` | `PublicationsView.aspx?id=23951` | `ef69c9648de5d778571b8a05276e7c845de803c68c3bb2e7f2c1de6213bb056f` |
| `handbook/table-127.html` | `PublicationsView.aspx?id=23952` | `3e4ef5eeb1c43ded88fcd75529b0d4876ce028def63159f813a3ece22bdeee12` |
| `handbook/table-128.html` | `PublicationsView.aspx?id=23953` | `ec33d684104a3e26723234fd8d1ee4f63c895d0f6c2704bfa9b41e1f07f78665` |
| `handbook/table-129.html` | `PublicationsView.aspx?id=23954` | `349da5ac40bf933d994d7a06ee803e728bfa56fd6083409a54eb8e5b57a8217e` |
| `handbook/table-130.html` | `PublicationsView.aspx?id=23955` | `56d5ee43ac9b649b25e8296683f54f2f0b1152e8c2371e21c7cad01dbde2b138` |
| `handbook/table-131.html` | `PublicationsView.aspx?id=23956` | `1661348f855e6e474a100d2f8a006bfedc51083b8d71d17fd3a4552f05db3ad6` |
| `handbook/table-143.html` | `PublicationsView.aspx?id=23968` | `a0b983e9ace6040e47995daf4807d3e96d76c014513c7b79201ec677f7945da3` |
| `handbook/table-144.html` | `PublicationsView.aspx?id=23969` | `0b1a203f5ade632b526fc2b822ba28a4f1d8dfe53760a0fa0512154f675bfbf9` |
| `handbook/table-241.html` | `PublicationsView.aspx?id=24066` | `96b22899ec6cab540cd2c1959916a8da4c881f1aa74d3c72d09dbd689599ae2f` |
| `psi/psi-2021-06.html` | `PSIUserView.aspx?Id=1` | `6cd9e8b31f2b29770bacba2cd2b615275612358dd57065866d348f2b2a24f4cb` |
| `psi/psi-2021-07.html` | `PSIUserView.aspx?Id=2` | `661a2339ee0450b912479b539f8288b152f0467081e93aeba90810ddbaf78fa0` |
| `psi/psi-2021-08.html` | `PSIUserView.aspx?Id=3` | `bb97ce375eb2797a5ca73adcd3240f9ecd2f5f574fad93d78969175b4cdd936d` |
| `psi/psi-2021-09.html` | `PSIUserView.aspx?Id=4` | `40b8b2f0030a27a09d0e84b02ad1164af0db62b2ee2aa023fced293e9dbce5c0` |
| `psi/psi-2021-10.html` | `PSIUserView.aspx?Id=5` | `784b52797f1626fb7facc39758ae79f7322fdbe6dec963f3d8759193b93acd1f` |
| `psi/psi-2021-11.html` | `PSIUserView.aspx?Id=6` | `b10e28c702bc15ea5d77c7e0bedcadf2560aa0fdae446ec9eba5a4149e7892ae` |
| `psi/psi-2021-12.html` | `PSIUserView.aspx?Id=7` | `901333411356409405e5204fc5fc558e3bd4fd320c64ff6da6a5c4f5dff15f9d` |
| `psi/psi-2022-01.html` | `PSIUserView.aspx?Id=8` | `e1183f96873d6dffdb05cc60b028f6f61dada3adceff40ed6f7b6136178a44ca` |
| `psi/psi-2022-02.html` | `PSIUserView.aspx?Id=9` | `a5b6203766c9ff773741c39b96da17852afa67961ddfc308e557b483c3e57555` |
| `psi/psi-2022-03.html` | `PSIUserView.aspx?Id=10` | `bd3b6cbefbb2118213ab3c54fc6d75d001f446121956c627a8dcb63e9fdedeb1` |
| `psi/psi-2022-04.html` | `PSIUserView.aspx?Id=11` | `34803f2a0e8f0989e77784c54ffeb544dd6de2aa88fa297f02eb106ec1c9e6ec` |
| `psi/psi-2022-05.html` | `PSIUserView.aspx?Id=12` | `7ef074d41db5e2ecc771158b38f35fde836f858cc1c7889781390eb05ce18b41` |
| `psi/psi-2022-06.html` | `PSIUserView.aspx?Id=13` | `bf954b976b76fa8479fcb75556c8ab793704ffb7e0d76f63054e99fff66aa53b` |
| `psi/psi-2022-07.html` | `PSIUserView.aspx?Id=14` | `e8666d54edfd510d9ea0959430176bb2aeb309d8d2348ff3daf1ba87576a90e6` |
| `psi/psi-2022-08.html` | `PSIUserView.aspx?Id=15` | `87d8d817748229b0e452aac7ca7995bf3f8ee02e84c6acab2375d2f4d264a768` |
| `psi/psi-2022-09.html` | `PSIUserView.aspx?Id=16` | `0f4f05fa148732f09846d821b35821a0bb974a9b5b5f564b2c75a011afeb9198` |
| `psi/psi-2022-10.html` | `PSIUserView.aspx?Id=17` | `4b2e1121acfd3ed632c3178a9e806a8568c60c385f53b652e7527e8ad763f786` |
| `psi/psi-2022-11.html` | `PSIUserView.aspx?Id=18` | `683e212e620acd5ee3f0bd69b9949c7cadf63a3b4274a07608d77601f38c0140` |
| `psi/psi-2022-12.html` | `PSIUserView.aspx?Id=19` | `dd636012d97f951a78ed84f0070975ba3b00712a06579475fa5f140009430b9d` |
| `psi/psi-2023-01.html` | `PSIUserView.aspx?Id=20` | `5cf80131e44171818e815da49fc8e9fe8b83e52e07add9b1e4591b3f03f5dccd` |
| `psi/psi-2023-02.html` | `PSIUserView.aspx?Id=21` | `53e01f18e6a4d936778c154155431fcce545242ee3c992ad48bd8e9a4bd7a545` |
| `psi/psi-2023-03.html` | `PSIUserView.aspx?Id=22` | `22a311ce2947c8d811f02dd40ecbf046ba4d07c0cb2249a2fdd9cdd706695802` |
| `psi/psi-2023-04.html` | `PSIUserView.aspx?Id=23` | `a917b063be0cb629ade0aa07b928c0c1c3e94c114ab8b275bde32a28688187c0` |
| `psi/psi-2023-05.html` | `PSIUserView.aspx?Id=24` | `c85ce4aaad4b6671c40f28946e35715f5c2c1d14ffa38027978b365354ab9a21` |
| `psi/psi-2023-06.html` | `PSIUserView.aspx?Id=25` | `ea7815da932572ed3272ac3cddb8b7bc645092f58c762d4c76b6014aedba4488` |
| `psi/psi-2023-07.html` | `PSIUserView.aspx?Id=26` | `51347f0539aba1f24ac066081179b4cdfbd8f6bd64ba4f0c59dd8b37154eb19f` |
| `psi/psi-2023-08.html` | `PSIUserView.aspx?Id=27` | `a8005ea1f6203ccdf29fe9c796868c06569169fc5d918d90a67b016ed3b7feec` |
| `psi/psi-2023-09.html` | `PSIUserView.aspx?Id=28` | `63f142851a503ad1b2745264d68ed9ba7e2d5c92a4c7392e5baa6261e8f60da3` |
| `psi/psi-2023-10.html` | `PSIUserView.aspx?Id=29` | `68a71ad6ac17b3fde1e1e928b92b1b2f6b6f9821e0831a31fdea268c6e10338d` |
| `psi/psi-2023-11.html` | `PSIUserView.aspx?Id=30` | `525370c51273aff29a200a95303d7deef7f2ce8064d7b8ae0b595db88fde6cf7` |
| `psi/psi-2023-12.html` | `PSIUserView.aspx?Id=31` | `11839129ac1140029d62eac539d7af34eaf36982696eb9c779b4fe02f825a2a5` |
| `psi/psi-2024-01.html` | `PSIUserView.aspx?Id=32` | `1904d952742d0c42e8a52c7814d265fa640d84cf087506e2a598ba0be31710f4` |
| `psi/psi-2024-02.html` | `PSIUserView.aspx?Id=33` | `9606d55f3009c4ef2fc70188b83b2582ede96e87730063a5d93015bc8f7634a9` |
| `psi/psi-2024-03.html` | `PSIUserView.aspx?Id=34` | `5de5c6ed0813d0e47829ac56ba2240588d1e7e1a29220a9b3e92848426af5db2` |
| `psi/psi-2024-04.html` | `PSIUserView.aspx?Id=35` | `427a9760dece3b016fd2a6d8d2f3fb845f5382f76f8741c8aeef05e526b39ef4` |
| `psi/psi-2024-05.html` | `PSIUserView.aspx?Id=36` | `585d5d719f1d476f16e66ab1c15ed59cae8abfcbb6626a35e42fa84e32b90702` |
| `psi/psi-2024-06.html` | `PSIUserView.aspx?Id=37` | `1f934430b390d2be617312ab896679a4e741647439aed155660d3e8dccd87c48` |
| `psi/psi-2024-07.html` | `PSIUserView.aspx?Id=38` | `1c62eccb9184aa031aee7cf26cea6da19ffbe82a6c64da79f9499197a54006a0` |
| `psi/psi-2024-08.html` | `PSIUserView.aspx?Id=39` | `00c8c40fa5c452a8776fa88a1b075ae3b7baebaa13769b75cd9722bd2d871fd6` |
| `psi/psi-2024-09.html` | `PSIUserView.aspx?Id=40` | `522549d061efcff7e36771af6b27a84048c2118a6c4a0e1cc74b4559b2c116a6` |
| `psi/psi-2024-10.html` | `PSIUserView.aspx?Id=41` | `caf6c80b9ed667aa859111a5dc72a507165ef084cdde441aaa53396ccdaf2fc5` |
| `psi/psi-2024-11.html` | `PSIUserView.aspx?Id=42` | `8533e22853bbe5351e0cfbe8744221a88b62d6bd90e7357def641d3bcfe4c2bd` |
| `psi/psi-2024-12.html` | `PSIUserView.aspx?Id=43` | `ca232904de75b974d20cc11bd58f4f09b928117cc3161d9e0c8e592812850662` |
| `psi/psi-2025-01.html` | `PSIUserView.aspx?Id=44` | `a6dedb564f5da67621d8ccae7c14cd6c128046212e20251f39be08983f0209a3` |
| `psi/psi-2025-02.html` | `PSIUserView.aspx?Id=45` | `cc6122e9ca30b2a755eb3fccb591d57d62ce4e1a599359d77238853100ef34a2` |
| `psi/psi-2025-03.html` | `PSIUserView.aspx?Id=46` | `078a161a9ec8e40b97cb132b5b72a81d675a11ddd52937ab0c42ce40978ccab1` |
| `psi/psi-2025-04.html` | `PSIUserView.aspx?Id=47` | `ee75d1eb9203872288691f7809792251e6e5fc32cb0d15d3e8bf5cd5e6ec0712` |
| `psi/psi-2025-05.html` | `PSIUserView.aspx?Id=48` | `0a85e9067d71a7d291ca09da2d20bd6e4fc81b6db54d4d1b08b7ea4e0f71c1d7` |
| `psi/psi-2025-06.html` | `PSIUserView.aspx?Id=49` | `2a9da74444a7248e10a8c491d91b4bf1e6fc50a24d18fc54de4e6438d3235058` |
| `psi/psi-2025-07.html` | `PSIUserView.aspx?Id=50` | `3526e1ddaf7435c12b91a80b72111cf9f25d3a19417786a6c8c2e88157b6ece2` |
| `psi/psi-2025-08.html` | `PSIUserView.aspx?Id=51` | `415f1c49fefd5425dbcdd5e57bee4f59fee6620bf44119b2bde484eb508162b8` |
| `psi/psi-2025-09.html` | `PSIUserView.aspx?Id=52` | `21ce37aa415253680d488efb599018fd51156aed9b9876a7949e9a057393d6db` |
| `psi/psi-2025-10.html` | `PSIUserView.aspx?Id=53` | `cb05f49503c23224a3a491aaf79ddb37727752351c0121c54fddbc6e42321aff` |
| `psi/psi-2025-11.html` | `PSIUserView.aspx?Id=54` | `8462f6cef1448665a9a75790ac7c06394ca801d2f312eca5c3e31a334ffa6032` |
| `psi/psi-2025-12.html` | `PSIUserView.aspx?Id=55` | `33a023e03b86ccbb6e7a6cbc2b48690c642c0a77f6add2724744281b9cafc68b` |
| `psi/psi-2026-01.html` | `PSIUserView.aspx?Id=56` | `f3259aa58e7d3f67742ed6c2c6b90b09e831a0c9b0d0b3342fae06c551c4cd32` |
| `psi/psi-2026-02.html` | `PSIUserView.aspx?Id=57` | `09d29b455736966719da60ca3ff37298af0772bb720638ebbdb0a538f641351f` |
| `psi/psi-2026-03.html` | `PSIUserView.aspx?Id=58` | `846d3cc172a2ae2571743783fbe05cb7f37d8a5f776cc46c1548094103bb0252` |
| `psi/psi-2026-04.html` | `PSIUserView.aspx?Id=59` | `b677bcb2bc17ed058c7be445b13d35eb1d51d0b68ef28757977c81af45c436a3` |
| `psi/psi-2026-05.html` | `PSIUserView.aspx?Id=60` | `3e7ade097bfaf43156a820701bb18d1448a083f0f33e648c758661619ed52da6` |
| `psi/psi-2026-06.html` | `PSIUserView.aspx?Id=61` | `66b4957dcc71951f40e9f618cf927d3d710a93ceffb4edd094869cfc516a4139` |
| `psi/psi-2026-07.html` | `PSIUserView.aspx?Id=62` | `32e2773f73680e31a8cc283f498d544ea61d8d8f1b9333941467449a725f349f` |
| `psi/psi-2026-08.html` | `PSIUserView.aspx?Id=63` | `3be9a4ba2148e5b83d5cd9f9db53d176af4534f5b2455369805a600a05d498ad` |
| `psi/psi-2026-09.html` | `PSIUserView.aspx?Id=64` | `dd8ed0caca62b410f8451397bc6bbed108c41c8c7ecb33aa47d41c206fc57569` |
| `psi/psi-2026-10.html` | `PSIUserView.aspx?Id=65` | `1122ee30089c6b4e22937bc728a42b1ece5cc54832bfe5de54b971daa9b970dd` |

## Proposed charts

Kinds are from `src/content/types.ts`. Every chart carries `Provisional` for 2025-26 (and for all
PSI months).

| Slug | Kind | CSV and rows | Period | Why |
| --- | --- | --- | --- | --- |
| `current-account-balance` | `columns` (sign colours) | `bop-indicators-annual.csv`, `indicator=current-account-balance-to-gdp` | 1987-88 to 2025-26 | The headline: deficit or surplus as a share of GDP, with 1990-91 (-3.01), 2011-12 and 2012-13 (-4.29, -4.81) and the 2020-21 surplus (0.93). Method breaks at each GDP base. |
| `current-account-parts` | `columns` (stacked, with the current account as a line in the table) | `current-account-annual.csv`, `unit=US$ million`, items `trade-balance` (Table 128), `services`, `private-transfers`, `income` (Table 130), `flow=net` | 2006-07 to 2025-26 | Shows why the deficit stays small: a large goods deficit offset by services and remittances. |
| `remittances` | `line` | `current-account-annual.csv`, `item=private-transfers`, `flow=receipts`, `unit=US$ million` | 2006-07 to 2025-26 | Money sent home by Indians abroad: a common reader question, with one RBI series for 20 years. |
| `merchandise-exports-imports` | `line` | `merchandise-trade-annual.csv`, `product=total`, `flow` in (`exports`, `imports`) | 1987-88 to 2025-26 | Long trade series from one table, with the oil split available. |
| `top-exports` | `bars` | `merchandise-trade-by-commodity.csv`, `flow=exports`, `period=2025-26`, without `Total` | 2025-26 | What India sells. Engineering goods lead; electronic goods grew from 11,093.3 in 2020-21 to 47,962.3. |
| `top-imports` | `bars` | `merchandise-trade-by-commodity.csv`, `flow=imports`, `period=2025-26`, without `Total` | 2025-26 | What India buys: oil, electronics and gold. |
| `trade-partners` | `dots` (`by: partner`) | `merchandise-trade-by-partner.csv`, `level=country`, `period=2025-26`, two series `exports` and `imports` | 2025-26 | Shows surplus partners (USA) beside deficit partners (China, Russia). |
| `forex-reserves` | `area` (stacked) | `forex-reserves-end-march.csv`, `unit=US$ million`, the four components | 1968-69 to 2025-26 | The rise of reserves since 1991, and the recent growth of gold. Import cover (Table 241) can go in the table or in `know`. |
| `upi-transactions` | `line` | `payments-monthly.csv`, `item=upi`, `measure=volume` | June 2020 to October 2026 | The fastest-growing payment system; monthly volume in lakh, shown in crore. |
| `digital-payments-by-system` | `line` (panels: volume, value) | `payments-monthly.csv`, items `upi`, `neft`, `imps`, `credit-cards`, `debit-cards` | June 2020 to October 2026 | UPI against older systems: debit card use falls while credit card value grows. RTGS value is far larger and needs its own panel or a note. |

### Recommendation

Make a **Trade** topic now, with the first eight charts. Put the two payments charts in the
**Economy** topic as a new part, "Digital payments", and do not make a Money and payments topic yet.

Reasons:

- Trade has seven CSVs, long annual series (to 1968-69 for reserves and 1987-88 for trade) and
  enough questions for a full page.
- Payments has three CSVs, national only, from mid-2020. Two or three charts do not fill a topic
  page. The other Money and payments source in the backlog (RBI Basic Statistical Returns, state
  banking data) is `later`, because its state tables are only on DBIE.
- Economy already holds the exchange rate and the RBI repo rate is in Prices, so a payments part
  sits beside related RBI series. If BSR state tables become available, move the payments part into
  a Money and payments topic with them.
- The exchange-rate charts can stay in Economy. A Trade page can link to them.
