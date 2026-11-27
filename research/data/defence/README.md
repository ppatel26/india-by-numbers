# Defence

Data for the India by Numbers topic "Defence" (`/defence/`). Three CSVs here, and one WDI CSV in
[`../international/`](../international/README.md) (armed forces as a share of the labour force).

Read on 27 Nov 2026 (UTC).

## Questions this topic answers

1. How much does the central government spend on defence, and how much of it is capital?
2. What share of central government spending goes to defence?
3. How is the 2026-27 Ministry of Defence budget split?
4. How much defence equipment does India export, and how much comes from public and private exporters?
5. How large are India's armed forces against its neighbours, as a share of the labour force? (WDI)

## About the sources

- **RBI Handbook Table 89**, "Major Heads of Expenditure of the Central Government", gives revenue
  and capital expenditure, with defence, interest and subsidies, from 1987-88. Its note 4: "Defence
  expenditure is exclusive of expenditure on Defence pensions and Civil expenditure." Note 1: "Data for
  2025-26 are Revised Estimates and data for 2026-27 are Budget Estimates." Source line: "Budget
  documents of the Government of India." The RBI reuse terms are in `../trade-payments/README.md`.
- **PIB** publishes the Ministry of Defence's press releases and backgrounders. pib.gov.in answers
  scripts and headless browsers with HTTP 403 (as in `../education/README.md` and
  `../prices/README.md`). The releases are read from Internet Archive captures. Three captures were
  requested on 27 Nov 2026 with the Archive's "save" service; their capture times are in the URLs.
  The backgrounder PDFs on static.pib.gov.in download directly.
- **PIB licence.** The PIB Copyright Policy (Internet Archive capture of 10 Nov 2025, file
  `pib/copyright-policy.wayback.html`): "Material featured on this website may be reproduced free of
  charge and there is no need for any prior approval for using the content. The permission to
  reproduce this material shall not extend to any third-party material. ... The material must be
  reproduced accurately and not used in a derogatory manner or in a misleading context. Wherever the
  material is being published or issued to others, the source must be prominently acknowledged."
- **Pensions.** RBI leaves out defence pensions. The PIB budget backgrounder's ₹7.85 lakh crore
  counts them (21.84% of it) and the civil organisations (3.64%). The design council (26 Nov 2026,
  3 of 3) chose RBI as the only long series, and the PIB split as a separate chart. Never join them.

Headline values in the PIB releases:

| Statement | Value | Where |
| --- | --- | --- |
| Defence exports, 2025-26 | Rs 38,424 crore; DPSUs Rs 21,071 crore (54.84%), private sector Rs 17,353 crore (45.16%); exporters 145, up from 128 | PIB 2248124, 2 Apr 2026 |
| Defence exports, 2024-25 and 2023-24 | Rs 23,622 crore (private 15,233, DPSUs 8,389); Rs 21,083 crore (private 15,209, DPSUs 5,874) | PIB 2117348, 1 Apr 2025 |
| Defence exports, 2016-17 to 2022-23 | Table: 1,521; 4,682; 10,745; 9,115; 8,434; 12,814; 15,920 (Rs crore). The text says "approx. Rs 16,000 crore" for 2022-23 | PIB 1912885, 1 Apr 2023 |
| Ministry of Defence allocation, 2026-27 | ₹7.85 lakh crore, "14.67% of total Central Government expenditure" | PIB backgrounder, 3 Feb 2026 |
| Defence production, 2024-25 | Rs 1,50,590 crore (PIB 2154551, 9 Aug 2025); Rs 1,54,071 crore (PIB 2273854, 17 Jun 2026) | Two releases, two values |
| Defence production, 2025-26 | ₹1,78,000 crore; DPSUs and other PSUs about 76%, private sector 24% | PIB 2273854, 17 Jun 2026 |

## Sources

| Publisher | Release | Release date | Period | URL read | Read on | Licence | sha256 of raw file |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RBI | Handbook of Statistics on Indian Economy 2025-26, Table 89 | 31 Jul 2026 ("Date : Jul 31, 2026") | 1987-88 to 2026-27 BE | https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=23914 | 27 Nov 2026 | Reproduce accurately, acknowledge RBI | 1eb514f668d8953b1b373682a544de1c270940e377becdba921ee899c128a2e1 |
| PIB for MoD | Press release 1912885, defence exports 2016-17 to 2022-23 | 1 Apr 2023 | 2016-17 to 2022-23 | https://web.archive.org/web/20250718200616/https://www.pib.gov.in/PressReleasePage.aspx?PRID=1912885 | 27 Nov 2026 | PIB Copyright Policy (above) | 2c78217541bcf32f722055be0b63153491cc143eaa426322c3807e8593c31003 |
| PIB for MoD | Press release 2117348, defence exports 2024-25 | 1 Apr 2025 | 2023-24, 2024-25 | https://web.archive.org/web/20261127053745/https://www.pib.gov.in/PressReleasePage.aspx?PRID=2117348&reg=48&lang=2 | 27 Nov 2026 | As above | 1e9757e061c0416d6ed8e1dddced7dcfeaef41245ed179d19791d5fd80b21f72 |
| PIB for MoD | Press release 2248124, defence exports 2025-26 | 2 Apr 2026 | 2024-25, 2025-26 | https://web.archive.org/web/20261127054446/https://www.pib.gov.in/PressReleasePage.aspx?PRID=2248124&reg=48&lang=2 | 27 Nov 2026 | As above | 55b19d5684189119446bca68db3de2d02db4b1f8a95ba245fcdfc11654f017ef |
| PIB | Backgrounder "Defence in Union Budget 2026-27" (4 pages) | 3 Feb 2026 | 2026-27 BE | https://static.pib.gov.in/WriteReadData/specificdocs/documents/2026/feb/doc202623778301.pdf | 27 Nov 2026 | As above | 766163b1820fbeb740421c46c5d10dbf2fbe68d2aa7e2b26695a09f5fdc1f0c8 |

### Raw files

Fetched with `pipeline/defence/fetch.sh` between 05:31 and 05:45 UTC on 27 Nov 2026. Each folder's
`_log.tsv` has the URL, the sha256 and the time.

| File under `raw/defence/` | Content | SHA-256 |
| --- | --- | --- |
| `rbi/table-89.html` | Handbook Table 89 | `1eb514f668d8953b1b373682a544de1c270940e377becdba921ee899c128a2e1` |
| `rbi/notes-on-tables.html` | Handbook "Notes on Tables" (no note for Table 89) | `4a0ca0818073170c5a9924ca0082868d86840a07c1ee101ff5c032bca000d41b` |
| `pib/copyright-policy.wayback.html` | PIB Copyright Policy, capture of 10 Nov 2025 | `d858de2414ddd0ccd94d98b40f0f75fe7535be53e4c9668b0cf175af5c56c673` |
| `pib/pr-1912885.wayback.html` | Exports 2016-17 to 2022-23 | `2c78217541bcf32f722055be0b63153491cc143eaa426322c3807e8593c31003` |
| `pib/pr-2117348.wayback.html` | Exports 2024-25 | `1e9757e061c0416d6ed8e1dddced7dcfeaef41245ed179d19791d5fd80b21f72` |
| `pib/pr-2248124.wayback.html` | Exports 2025-26 | `55b19d5684189119446bca68db3de2d02db4b1f8a95ba245fcdfc11654f017ef` |
| `pib/pr-2154551.wayback.html` | Production 2024-25 (9 Aug 2025). Read for the production values; no CSV | `311a50bc1f4a099bd101f5935a07c5e84dda236f297eb66db85352cd91d1f5f3` |
| `pib/pr-2273854.wayback.html` | Backgrounder "The Defence Decade" (17 Jun 2026). Read for the production values; no CSV | `3d8e960dad53a14f4b64f653e9017ae34b750a9241f33bec36b18a42b934e65b` |
| `pib/budget-2026-27.pdf` | Backgrounder "Defence in Union Budget 2026-27" | `766163b1820fbeb740421c46c5d10dbf2fbe68d2aa7e2b26695a09f5fdc1f0c8` |
| `pib/backgrounder-2025-11-20.pdf` | Backgrounder "Defence Atmanirbharta: Record Production and Exports" (20 Nov 2025). Read; no CSV | `320830b35d2f167a15b1074ce405f4e1e0c5bdaa7c748c20368ed09ec6f39411` |

## How the CSVs are made

```sh
pipeline/defence/fetch.sh
python3 -I pipeline/defence/build_defence.py
```

An Internet Archive capture URL can change if the Archive re-captures a page; the sha256 above
identifies the copy read.

## CSVs

### `defence-spending-1987-2027.csv`

- 440 rows: India, 1987-88 to 2026-27, eleven `measure` values: the nine columns of Table 89 as
  printed (revenue expenditure and its defence, interest and subsidies parts; capital expenditure,
  loans and advances, capital outlay and its defence part; total expenditure), and two derived
  values (rule R3; the `derived` column says how): `defence: revenue and capital` (columns 3 + 9),
  and `defence: share of total expenditure` ((3 + 9) / 10 x 100, two decimals).
- Unit: ₹ crore at current prices, or %. `status`: `revised estimate` (2025-26), `budget estimate`
  (2026-27), else empty (accounts).
- Checked values: revenue defence 8861 and capital outlay defence 3107 in 1987-88; 290965 and 159768
  in 2024-25; 365479 and 229106 in 2026-27; total expenditure 5347315 in 2026-27.
- Derived values on the page: 2024-25, defence 450733 crore and 9.69% of total expenditure; 1987-88,
  11968 crore and 17.53%.

### `defence-exports.csv`

- 16 rows: 2016-17 to 2025-26, `exporter` `all exporters`, and from 2023-24 also `DPSUs` and
  `private sector`. Unit: ₹ crore at current prices. `release` names the PIB release.

### `defence-budget-split-2026-27.csv`

- 5 rows: the shares of the 2026-27 Ministry of Defence allocation: capital expenditure 27.95, revenue
  on sustenance and operational preparedness 20.17, revenue on pay and allowances 26.40, defence
  pensions 21.84, civil organisations 3.64. Unit: %. Budget estimate.

## Checks

`build_defence.py` runs 104 checks and stops if any fails:

- Table 89: the release date, title, the pension and status notes; revenue plus capital equals total
  expenditure, and loans and advances plus capital outlay equal capital expenditure, within 1 crore
  of rounding, for all 40 years (the parts are rounded to the crore: 2013-14, 2016-17, 2018-19,
  2024-25 and 2026-27 differ by 1); seven values against the printed page.
- Exports: each release's date; the DPSU and private values add up to each total; the 2024-25 parts in
  the 2026 release equal the 2025 release; the 2016-17 to 2022-23 table has every year.
- Budget split: the five shares add up to 100.

## Gaps and cautions

- **Current prices.** All rupee values are nominal. There is no defence deflator.
- **PIB revises.** Defence production for 2024-25 is Rs 1,50,590 crore in the release of 9 Aug 2025
  and Rs 1,54,071 crore in the backgrounder of 17 Jun 2026. No production chart is built: PIB gives
  only scattered years (2014-15, 2019-20, 2020-21, 2023-24, 2024-25, 2025-26), with changing values.
- **Promotional wording.** PIB releases say "record", "skyrocket" and "all-time high". The site prints
  the figures only.
- **Held back.** The WDI military expenditure and arms trade series (`MS.MIL.XPND.*`, `MS.MIL.MPRT.KD`,
  `MS.MIL.XPRT.KD`) carry "SIPRI terms and conditions", which need authorisation. The Ministry of
  Defence (mod.gov.in) and the Department of Defence Production (ddpmod.gov.in) websites allow reuse
  only "after taking proper permission by sending a mail to us". indiabudget.gov.in refused scripts.
- **No states.** Defence is a central subject; there is no state breakdown.
