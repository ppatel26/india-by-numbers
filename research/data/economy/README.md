# Economy

Data gathered on 17 Nov 2026 from MoSPI (NSO), the Reserve Bank of India (RBI), FBIL (through RBI) and PIB. All values are as published, except where a row says "derived". Initial read on 17 Nov 2026. See the publisher check for the 18 Nov update.

The main source is the MoSPI eSankhyiki API at `api.mospi.gov.in` (`getNASData` for national accounts, `getIIPData` for industrial production). Its values match the GDP press note of 31 Aug 2026 and the IIP release of 28 Oct 2026.

## Questions this topic answers

1. How fast is India's economy growing now, and how does that compare with the past 75 years?
2. How has the economy moved from farming to services?
3. Which states are richest and poorest per person, and which are growing fastest?
4. How is industry doing month by month?
5. How many rupees does a US dollar cost, and how has that changed?
6. How many people work in registered factories, and how many in small unincorporated firms?

## Charts

### E1. Quarterly GDP growth

- Type: column chart, one bar per quarter. Show the two bases as two colours, with a method break.
- Unit: % change in real GDP on the same quarter a year earlier.
- Geography: India. Period: Q1 2012-13 to Q2 2025-26 (base 2011-12) and Q1 2023-24 to Q1 2026-27 (base 2022-23).
- CSV: `gdp-growth-quarterly.csv` (column `nominal_growth` gives growth at current prices).
- Sentence: "Real GDP grew by 7.8% in April to June 2026 (Q1 of 2026-27), up from 6.9% a year earlier. The fastest quarter on the new 2022-23 base was January to March 2026, at 8.6%."
- Source: MoSPI, National Accounts, quarterly GDP growth rate (indicator 22), `getNASData`; press note "Quarterly Estimates of GDP for Q1 2026-27", 31 Aug 2026.
- Notes: the two bases overlap from 2023-24 to Q2 2025-26 and give different numbers for the same quarter (for example Q1 2025-26: 7.8% on base 2011-12, 6.9% on base 2022-23). Draw the new base where it exists. The old base shows the COVID-19 fall: -23.1% in Q1 2020-21.

### E2. Annual GDP growth since 1951-52

- Type: column chart, one bar per financial year. Mark the method break at 2023-24.
- Unit: % change in real GDP on the year before.
- Geography: India. Period: 1951-52 to 2025-26.
- CSV: `gdp-growth-annual.csv`
- Sentence: "India's economy grew by 7.8% in 2025-26. It shrank in six years since 1951: the largest fall was 5.78% in 2020-21, during COVID-19, and the one before that was 5.24% in 1979-80."
- Source: MoSPI, National Accounts. GDP at constant 2011-12 prices, Back series (1950-51 to 2011-12) and Current series (2011-12 to 2022-23, latest estimate for each year); published growth rates on base 2022-23 for 2023-24 to 2025-26.
- Notes: for 1951-52 to 2022-23 the growth rate is **derived** by us from published constant-price GDP levels (`method` column). We checked the derived values against RBI Handbook Table 227: 3.87% (2019-20), -5.78% (2020-21), 9.69% (2021-22) and 7.61% (2022-23) all match. 2025-26 is a Provisional Estimate; 2024-25 is a First Revised Estimate.

### E3. Farming, industry and services: shares of the economy since 1950-51

- Type: stacked area (or stacked bar every 5 years), three sectors.
- Unit: % of gross value added (GVA) at current prices.
- Geography: India. Period: 1950-51 to 2025-26. Method break at 2022-23 (two rows for that year, one per base).
- CSV: `gva-sector-shares.csv`
- Sentence: "In 1950-51 farming, forestry, fishing and mining made up 54% of India's output and services 31%. In 2025-26 services made up 54% and the primary sector 20%."
- Source: MoSPI, National Accounts, GVA by industry at current prices (indicator 1): Back series (base 2011-12), Current series (base 2011-12) and Current series (base 2022-23).
- Notes: shares are **derived** by us from published GVA levels. Primary = agriculture, livestock, forestry and fishing + mining and quarrying. Secondary = manufacturing + electricity, gas, water and utilities + construction. Tertiary = total GVA minus the two. These follow the sector grouping in the MoSPI press note of 31 Aug 2026. In 2022-23 the two bases differ by about 2 points for the primary sector (20.12% on base 2011-12, 22.04% on base 2022-23).

### E4. Income per person by state, 2024-25

- Type: ranked bar by state, and tile map by state.
- Unit: rupees per person per year (net state domestic product per capita), current prices. Constant 2011-12 prices are in the same CSV.
- Geography: 32 states and union territories, plus India. Period: 2024-25.
- CSV: `per-capita-nsdp-by-state.csv`
- Sentence: "In 2024-25 income per person was highest in Sikkim, at ₹6,46,183, and in Goa, at ₹6,36,703. It was lowest in Bihar, at ₹69,211: less than a ninth of Sikkim's. The national figure was ₹2,05,324."
- Source: MoSPI, state-wise per capita NSDP (indicator 25, base 2011-12), `getNASData`, for 30 states and UTs. Assam and Haryana, and the all-India figure (per capita net national income, base 2011-12), from RBI Handbook of Statistics on Indian Economy 2025-26, Tables 9 and 10.
- Notes: the India value is per capita net national income, the comparator RBI uses in the same table. 19 of the 32 states and UTs are above it. Assam and Haryana values are MoSPI data as on 1 Aug 2025 (RBI note); they are missing from the latest MoSPI release.

### E5. Economic growth by state, 2024-25

- Type: ranked bar by state, tile map by state.
- Unit: % change in real gross state domestic product (GSDP) on 2023-24, constant 2011-12 prices.
- Geography: 30 states and union territories, plus India. Period: 2024-25.
- CSV: `gsdp-growth-by-state.csv`
- Sentence: "Arunachal Pradesh grew fastest in 2024-25, at 13.8%, followed by Goa (12.0%) and Mizoram (11.3%). The Andaman and Nicobar Islands grew slowest, at 4.5%."
- Source: MoSPI, GSDP growth rate (indicator 26, base 2011-12), `getNASData`. India: GDP growth on base 2011-12, Provisional Estimate (6.4%), from the same API.
- Notes: state accounts are still on base 2011-12. The India value is on the same base, so it is not the 7.2% headline on base 2022-23. Only 15 states have 2025-26 figures, so we show 2024-25.

### E6. Industrial production, month by month

- Type: monthly line, with breaks at April 2013 and April 2024.
- Unit: % change in the Index of Industrial Production (IIP) on the same month a year earlier.
- Geography: India. The chart covers April 2006 to March 2013 on base 2004-05, April 2013 to March 2024 on base 2011-12, and April 2024 to September 2026 on base 2022-23.
- CSVs: `iip-growth-base-2004-05.csv` holds 132 published year-on-year rates from April 2006 to March 2017. `iip-growth-monthly.csv` holds base 2011-12 and base 2022-23, with mining, manufacturing, and electricity and gas for the latest base.
- Sentence: "Industrial output grew by 6.7% in September 2026, with manufacturing up 7.6% and electricity and gas up 11.2%. Mining fell by 6.2%."
- Source: MoSPI eSankhyiki `getIIPData`, all three bases. PIB published the latest release for MoSPI on 28 October 2026.
- The first 12 API growth rates on each base equal the index minus 100. Exclude those rates because they compare with the base-year average. Base 2004-05 supplies year-on-year rates for April 2012 to March 2013. The three bases give different rates in the overlap. September 2026 is a quick estimate. The final rate for August 2026 is 7.8%. The base 2011-12 series gives a fall of 57.3% in April 2020 during the lockdown.

### E7. Rupees per US dollar, yearly average, 1950 to 2025-26

- The solid lines show RBI financial-year averages, and the dashed line shows IMF calendar-year estimates.
- `usd-inr-annual.csv` holds 20 IMF averages from January to December for 1950 to 1969 (`international estimate`). It holds 16 RBI averages from April to March for 1970-71 to 1985-86 (`official`, Table 133 released in 2002). The latest Table 133 supplies 40 averages and 40 end-of-year rates from 1986-87 to 2025-26 (`official`). Each row gives its source and `source_kind`.
- A US dollar cost ₹4.76 on average in calendar year 1950, according to the IMF. RBI gives an average of ₹7.56 for 1970-71 and ₹88.31 for 2025-26. At the end of March 2026 it cost ₹94.65.
- RBI used official exchange rates through 1991-92 and FEDAI indicative rates from 1992-93. It used RBI reference rates from May 2012 and FBIL reference rates from 10 July 2018.
- India devalued the rupee in September 1949, before the first average in this series. India pegged the rupee to sterling before 1971. The par rate changed from ₹4.76 to ₹7.50 per US dollar on 6 June 1966. The IMF average for calendar year 1966 is ₹6.36. India devalued the rupee in July 1991, introduced a dual rate in March 1992 and moved to one market rate in 1993. [RBI chronology, 1949](https://www.rbi.org.in/Scripts/chro_1935.aspx) · [RBI Report on Currency and Finance 1966-67, Notes on the Statements](https://web.archive.org/web/20261114093654id_/https://rbidocs.rbi.org.in/rdocs/Publications/PDFs/31CF10062020_1966ED505EE590504051B3AC56061AE190EC.PDF) · [RBI chronology, 1991 to 2000](https://www.rbi.org.in/Scripts/chro_1991.aspx)

**Overlap checks**

- The 2002 and 2026 editions of Table 133 match to four decimals in all 15 shared financial years, 1986-87 to 2000-01. This holds for both the averages and the end-of-year rates. The 2026 HTML table also matches all 80 values in the previous CSV.
- Compare IMF calendar-year averages with RBI Table 132 for the same calendar years. The 2002 table overlaps in 31 years (1970 to 2000). The largest difference is ₹0.9506 per US dollar in 1993 (RBI ₹31.4439, IMF ₹30.4933). The 2026 table overlaps in 38 years (1987 to 2024). The largest difference is ₹0.9525, also in 1993 (RBI ₹31.4458, IMF ₹30.4933).
- The Handbook HTML tables checked start at 1970-71 for financial-year averages. RBI's document server returned a bot check for the earlier Report on Currency and Finance PDFs. The Internet Archive copies of the 1965-66 and 1966-67 reports gave no table of annual dollar averages. The 1966-67 report confirms the par values. No published RBI financial-year averages were verified for 1950-51 to 1969-70.
- Rebuild from the five HTML and JSON data files listed below. Run `python3 -I pipeline/economy/build_usd_inr_annual.py`. The script prints the overlap checks.

### E8. The rupee in 2026, day by day

- Type: line, daily.
- Unit: rupees per US dollar (FBIL reference rate).
- Geography: India. Period: 1 Jan 2026 to 18 Nov 2026 (working days).
- CSV: `usd-inr-daily-2026.csv`
- Sentence: "On 18 November 2026 a dollar cost ₹93.3558, up from ₹89.9792 on 1 January. The rupee was weakest on 20 May 2026, at ₹96.8441 per dollar."
- Source: FBIL reference rates from the RBI Reference Rate Archive. The RBI home page confirms the 18 Nov 2026 rate as of 1:00 pm IST.

### E9. The rupee since 1998, month by month

- Type: line, monthly. On the topic page, E8, E9 and E7 share one card with a period switch.
- Unit: rupees per US dollar, monthly average of daily reference rates.
- Geography: India. Period: September 1998 to November 2026 (November is 1 to 18 November).
- CSV: `usd-inr-monthly.csv`. The `days` column counts the working days in each average; `source` names the rate.
- Source: RBI Reference Rate Archive (RBI reference rate, 25 Aug 1998 to 9 Jul 2018); FBIL reference rates from `https://www.fbil.org.in/wasdm/refrates/fetchfiltered` (10 Jul 2018 to 31 Dec 2025); `usd-inr-daily-2026.csv` (2026).
- **Derived.** We compute each monthly average. RBI publishes monthly averages (Handbook Table 205), but only from 2022.
- Check: the mean of all days in each financial year, 1999-00 to 2025-26, is within ₹0.08 of the Table 133 financial-year average (E7); 2025-26 matches to four decimals. Table 133 uses FEDAI rates to 2011-12, so small differences are expected. FBIL and the 2026 CSV agree on all 207 shared days.
- Gap: FBIL gives no rate for 1 to 15 Feb 2021 or 19 Feb 2021, and the RBI archive has no rows for those days. February 2021 is the average of 8 days.
- Rebuild: `python3 -I pipeline/economy/build_usd_inr_monthly.py`, after any change to `usd-inr-daily-2026.csv`.

### E10. Factory jobs and value added, 2008-09 to 2024-25

- Type: line, two panels (persons engaged; GVA). Factories in operation are a hidden series, shown in the table.
- Unit: persons; GVA in ₹ lakh at current prices, shown in ₹ lakh crore.
- Geography: India. Period: 2008-09 to 2024-25 (ASI years, NIC 2008).
- CSV: `asi-factory-sector-india.csv`. The `source` column names the release for each row.
- Sentence: "Factories engaged 2.10 crore people in 2024-25, up from 1.13 crore in 2008-09. Their gross value added was ₹26.94 lakh crore at current prices."
- Source: 2020-21 to 2024-25 from Statement 3A of the ASI 2024-25 Summary Results. 2008-09 to 2019-20 from the eSankhyiki API (`getASIData`, NIC 2008, all industries `nic_code=99999`, All India `state_code=99`, Combined).
- Checks (run `build_asi.py`): the API and Statement 3A agree for 2020-21 to 2023-24 on all three measures, except 2023-24 GVA (API 245833606, Statement 245833605 ₹ lakh). The 2023-24 Summary Results give the same 2019-20 values as the API. We use the Statement where one exists.
- Status: `Survey estimate`. MoSPI calls no year provisional, so the chart has no `Provisional` mark.
- Decision: the series starts in 2008-09, the first year on NIC 2008 in the API. The API also has NIC 2004 and NIC 1998 years. We did not join them, because the industry classification changes.

### E11. Factory jobs by state, 2024-25

- Type: tile map and ranked bar (`states`, `total`). State-profile row "Factory jobs".
- Unit: persons engaged.
- Geography: 35 states and UTs, plus India. Lakshadweep has no value. Period: 2024-25.
- CSV: `asi-by-state-2024-25.csv`: persons engaged, factories in operation and GVA from Statement 7A, with each state's share of India from Statement 7B (`share_of_india`).
- Sentence: "Tamil Nadu had the most factory jobs in 2024-25, at 31.48 lakh, or 14.99% of the national total. Maharashtra had 27.47 lakh and Gujarat 27.27 lakh."
- Decision: the chart shows the count, not the share of India. The count is the published value in Statement 7A. It reads in the same unit as E12, and the state pages compare each state with India, where a share would always be 100. The share stays in the CSV for the text.
- Lakshadweep: MoSPI surveyed fewer than 3 units, so it gives no separate estimate. Lakshadweep is in the All India row only, so the states add to 11 persons less than India (20996902 against 20996913).
- Coverage: 16 states count factories from 20 workers with power (40 without), the rest from 10 (20 without). See "Gaps and cautions".

### E12. Workers in small firms by state, 2025

- Type: tile map and ranked bar (`states`, `total`). State-profile row "Workers in small firms".
- Unit: workers. Geography: 36 states and UTs, plus India. Period: January to December 2025.
- CSV: `asuse-by-state-2025.csv` (workers and estimated establishments).
- Sentence: "Uttar Pradesh had the most workers in small unincorporated firms in 2025, at 1.86 crore. West Bengal had 1.33 crore and Maharashtra 1.17 crore."
- Source: eSankhyiki API, ASUSE indicator 27 (workers by nature of employment and gender, each state) with `sector_code=3` (combined), `gender_code=4` (all), `broad_activity_category_code=4` (all), `establishment_type_code=3` (all), `working_time` All; indicator 2 for establishments.
- Check: all 37 rows (36 states and UTs and all-India) agree with columns 10 and 11 of Table 26, block "BAC: All, Est.: All, Sec: Combined", in the ASUSE 2025 report.

### E13. Small firms and their workers, 2021-22 to 2025

- Type: line, India. Two series per measure: the three October to September rounds as a line, and 2025 as a dot after a method break.
- Unit: number. Period: ASUSE 2021-22, 2022-23, 2023-24 (each October to September) and 2025 (January to December).
- CSV: `asuse-india-rounds.csv`. `reference_period` holds the survey months, which place each round on the time axis.
- Sentence: "Small firms had 7.92 crore establishments and 12.81 crore workers in 2025. In 2021-22 they had 5.97 crore establishments and 9.79 crore workers."
- Check: 2022-23, 2023-24 and 2025 agree with Table 1 of the press note of 24 Mar 2026 (in hundreds) for both measures.
- Method break: ASUSE 2025 moved to the calendar year and to a new sample design (districts as strata, about 1.5 times the sample). MoSPI compares 2025 with 2023-24 in its press note. We keep the 2025 point apart and mark a break.

### E14. Where the central government's money comes from and goes, 2024-25

- Type: Sankey, three columns: five sources, one pool ("Central government"), six heads of spending.
- Unit: Rs crore (shown as Rs lakh crore). Period: 2024-25, accounts.
- CSV: `central-government-flows.csv`, made by `pipeline/economy/build_central_flows.py` from RBI
  Handbook 2025-26 Tables 86, 87, 88 and 89. 55 rows: 2022-23 to 2026-27, 11 flows a year.
  `status` is `accounts`, `revised estimate` (2025-26) or `budget estimate` (2026-27). `rbi_table`
  names the column of each value.
- Into the pool: direct taxes (net, Table 87 col 3), indirect taxes with GST (net, col 6), non-tax
  revenue (col 10), loan recoveries and disinvestment (Table 88 cols 6 and 7, added: `derived`), and
  borrowing and other liabilities (Table 86 col 2, the gross fiscal deficit).
- Out of the pool: interest payments (Table 89 col 4), subsidies (col 5), defence (cols 3 and 9,
  added: `derived`), other revenue spending (col 2 less cols 3, 4 and 5: `derived`), other capital
  outlay (col 8 less col 9: `derived`), loans and advances (col 7).
- One pool: the government pays from one fund, so no receipt is tied to a head. Every flow goes in
  to the pool or out of it, and no band joins a receipt to a head.
- Checks (the script stops on a gap of more than Rs 2 crore): flows in equal flows out; flows out
  equal total expenditure; total receipts plus the drawdown of cash balance equal total
  expenditure; direct and indirect taxes equal tax revenue (net); loan recoveries, disinvestment and
  the fiscal deficit less the drawdown equal capital receipts.
- Checked values, 2024-25: total expenditure 4652867 (Table 89 col 10); flows 4652868 in and
  4652868 out (Rs 1 crore of rounding); total receipts 4652260 (Table 87 col 14) plus drawdown 608
  (Table 86 col 8); gross fiscal deficit 1574431; tax revenue (net) 2500039 against direct and
  indirect taxes 2500038.
- Defence leaves out defence pensions (Table 89 note 4). They sit in other revenue spending.

### Two frames: do not add ASI and ASUSE

ASI covers registered factories: sections 2m(i) and 2m(ii) of the Factories Act, 1948 (10 or more workers with power, 20 or more without), registered bidi and cigar units, electricity units not registered with CEA, and since 2014-15 units with 100 or more employees on state business registers. ASUSE covers unincorporated non-farm establishments in manufacturing, trade and other services, without construction. It leaves out companies, LLPs and the units in the ASI frame. The two surveys have different reference periods (accounting year against survey months) and methods. The site never adds them.

## Headline figures

| Figure | Value | Period | Source |
| --- | --- | --- | --- |
| Real GDP growth, latest quarter | 7.8% | Q1 2026-27 (April to June 2026) | MoSPI press note, 31 Aug 2026 |
| Real GDP growth, latest year | 7.8% (Provisional Estimate) | 2025-26 | MoSPI eSankhyiki API, base 2022-23 |
| Industrial production growth | 6.7% (quick estimate) | September 2026 | PIB/MoSPI release, 28 Oct 2026 |
| Rupees per US dollar (FBIL reference rate) | 93.3558 | 18 Nov 2026, 1:00 pm IST | RBI home page and Reference Rate Archive |
| Income per person, India (per capita NNI, base 2011-12, current prices) | ₹2,05,324 | 2024-25 | RBI Handbook 2025-26, Table 9 |
| Highest and lowest state income per person | Sikkim ₹6,46,183; Bihar ₹69,211 | 2024-25 | MoSPI eSankhyiki API, base 2011-12 |

## Sources

| Publisher | Release or table | Release date | Data period | URL read | Read date | Licence | Raw file (sha256 in "Raw files") |
| --- | --- | --- | --- | --- | --- | --- | --- |
| MoSPI, NSO | Press Note on Quarterly Estimates of GDP for Q1 (April-June) 2026-27 | 31 Aug 2026, 4:00 pm | Q1 2026-27; revised Q1 2022-23 to Q4 2025-26 | https://www.mospi.gov.in/uploads/latestReleases/latest_release_1788172583113_d65a77cf-240e-4491-82ee-59f78618fa41_Press_Note_on_GDP_Estimates_for_Q1_2026-27.pdf | 17 Nov 2026 | Not stated | `economy/pdf/gdp_q1_2026-27_pressnote.pdf` |
| MoSPI, NSO | eSankhyiki API, National Accounts, base 2022-23 (GDP growth, GVA by industry) | New series 27 Feb 2026; updated 31 Aug 2026 | 2022-23 to 2025-26; Q1 2023-24 to Q1 2026-27 | https://api.mospi.gov.in/api/nas/getNASData?base_year=2022-23&series=Current | 17 Nov 2026 | Not stated | `economy/api/nas2223_*` |
| MoSPI, NSO | eSankhyiki API, National Accounts, base 2011-12, Current and Back series (GDP, GVA by industry, growth) | Back series and old current series (no longer updated) | 1950-51 to 2025-26 | https://api.mospi.gov.in/api/nas/getNASData?base_year=2011-12 | 17 Nov 2026 | Not stated | `economy/api/nas1112_*`, `economy/api/nas1112back_*` |
| MoSPI, NSO | eSankhyiki API, state accounts: per capita NSDP (indicator 25), GSDP growth (indicator 26), base 2011-12 | State data as released on 15 Apr 2026 (RBI Handbook note) | 2011-12 to 2025-26 | https://api.mospi.gov.in/api/nas/getNASData?base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=25 | 17 Nov 2026 | Not stated | `economy/api/nas1112_state_pcnsdp.all.json`, `nas1112_state_gsdpgr.all.json` |
| MoSPI, NSO | eSankhyiki API, IIP (base 2011-12 and base 2022-23), monthly | Monthly, on the 28th; latest 28 Oct 2026 | Apr 2012 to Mar 2026 (old); Apr 2023 to Sep 2026 (new) | https://api.mospi.gov.in/api/iip/getIIPData | 17 Nov 2026 | Not stated | `economy/api/iip1112_monthly_general.all.json`, `iip2223_monthly.all.json` |
| PIB for MoSPI | Quick Estimates of Index of Industrial Production and Use-Based Index for September 2026 (Base 2022-23=100) | 28 Oct 2026, 4:00 pm | Sep 2026 (quick), Aug 2026 (final) | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2329475 | 17 Nov 2026 | Not stated | `economy/pib/pib_2329475.html` |
| RBI | Handbook of Statistics on Indian Economy 2025-26, Tables 9 and 10: Per Capita NSDP, state-wise (current and constant prices) | 31 Jul 2026 | 2001-02 to 2025-26 | https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/9T_HBIE31072026A3F18AB442CE4A23BEC929D29B406162.XLSX ; .../10T_HBIE310720268B682995CC224C51B22FC6036E99B7D1.XLSX | 17 Nov 2026 | Not stated | `economy/rbi/9T_*.XLSX`, `10T_*.XLSX` |
| RBI | Handbook 2025-26, Table 133: Exchange rate of the rupee (financial year average and end-year) | 31 Jul 2026 | 1986-87 to 2025-26 | https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/133T_HBIE3107202637939AFB4EE946719F742BEB8AEC5E18.XLSX | 17 Nov 2026 | Not stated | `economy/rbi/133T_*.XLSX` |
| RBI | Handbook 2025-26, Table 133, HTML | 31 Jul 2026 | 1986-87 to 2025-26 | https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=23958 | 18 Nov 2026 | Not stated | `economy/usd-inr-2026-handbook-fy/table-133.html` |
| RBI | Handbook, Table 133, financial-year exchange rates | 8 Jan 2002 | 1970-71 to 2000-01 | https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=3615 | 18 Nov 2026 | Not stated | `economy/usd-inr-2002-handbook-fy/table-133.html` |
| IMF via DBnomics | International Financial Statistics, India, calendar-year average exchange rate | Not stated | 1950 to 2024 | https://api.db.nomics.world/v22/series/IMF/IFS/A.IN.ENDA_XDC_USD_RATE?observations=1 | 18 Nov 2026 | Not stated | `economy/usd-inr-imf-ifs/india-annual.json` |
| RBI | Handbook 2025-26, Table 227: growth rates at constant prices (cross-check) | 31 Jul 2026 | 2019-20 to 2025-26 | https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/227T_HBIE31072026194AD11D84C94DDFB2BC11DB074BA738.XLSX | 17 Nov 2026 | Not stated | `economy/rbi/227T_*.XLSX` |
| RBI (source FBIL) | Reference Rate Archive, USD | Daily | 1 Jan 2016 to 17 Nov 2026 (with gaps, see below) | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx | 17 Nov 2026 | Not stated | `economy/rbi/refrate_usd_*.html` |
| RBI | Home page, "Current Rates" box | Live | 17 Nov 2026 | https://www.rbi.org.in/ | 17 Nov 2026 | Not stated | `economy/rbi/rbi_home.html` |
| RBI | Reference Rate Archive, USD (RBI reference rate) | Daily | 25 Aug 1998 to 24 Jul 2018 | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx | 18 Nov 2026 | Not stated | `economy/rbi/refrate_usd_hist_*.html` |
| FBIL | Reference rates, USD/INR, public date-range feed | Daily | 10 Jul 2018 to 11 Nov 2026 | https://www.fbil.org.in/wasdm/refrates/fetchfiltered | 18 Nov 2026 | Not stated | `economy/fbil/refrates_*.json` |
| MoSPI, NSO | Annual Survey of Industries 2024-25, Summary Results for Factory Sector, Statements 3A, 7A, 7B | 4 Nov 2026 (PIB PRID 2332475; PDF created 29 Oct 2026; NADA entry 309 changed 4 Nov 2026) | 2020-21 to 2024-25 | https://microdata.gov.in/NADA/index.php/catalog/309/download/6675 | 25 Nov 2026 | Not stated | `economy/asi/asi-2024-25-summary-results.pdf` |
| MoSPI, NSO | Annual Survey of Industries 2023-24, Summary Results, Statement 3A (check of 2019-20 only) | Not stated (NADA entry 256) | 2019-20 to 2023-24 | https://microdata.gov.in/NADA/index.php/catalog/256/download/3924 | 25 Nov 2026 | Not stated | `economy/asi/asi-2023-24-summary-results.pdf` |
| MoSPI, NSO | eSankhyiki API, ASI (`getASIData`), NIC 2008, all industries, All India | Not stated | 2008-09 to 2023-24 | https://api.mospi.gov.in/api/asi/getASIData?Format=JSON&classification_year=2008&sector_code=Combined&nic_type=2-digit&state_code=99&nic_code=99999 | 25 Nov 2026 | Not stated | `economy/asi/api/asi-nic2008-allindia-total.*` |
| MoSPI, NSO | ASUSE 2025 (January to December 2025), full report, Table 26 | 6 May 2026 (PIB PRID 2258362; PDF created 3 May 2026) | 2025 | https://www.mospi.gov.in/uploads/publications_reports/publications_reports1778063953577_942565ce-f832-4fc4-aa99-90b0b2a5a6e1_ASUSE_2025_Full_Report.pdf | 25 Nov 2026 | Not stated | `economy/asuse/asuse-2025-full-report.pdf` |
| MoSPI, NSO | Press Note on ASUSE 2025 (factsheet), Table 1 | 24 Mar 2026 | 2022-23, 2023-24, 2025 | https://www.mospi.gov.in/uploads/latestReleases/latest_release_1774347321466_c16ddf22-bfff-4097-88a7-b3134e464d51_Press_Note_ASUSE_2025_English.pdf | 25 Nov 2026 | Not stated | `economy/asuse/asuse-2025-press-note.pdf` |
| MoSPI, NSO | eSankhyiki API, ASUSE (`getAsuseRecords`), indicators 2 and 27 | Not stated | 2021-22 to 2025 | https://api.mospi.gov.in/api/asuse/getAsuseRecords?Format=JSON&indicator_code=27&sector_code=3&gender_code=4&broad_activity_category_code=4&establishment_type_code=3 (workers); same with `indicator_code=2` and no `gender_code` (establishments) | 25 Nov 2026 | Not stated | `economy/asuse/api/asuse-*` |

| RBI | Handbook 2025-26, Tables 86 (deficit indicators), 87 (receipts), 88 (capital receipts) and 89 (expenditure) of the Central Government, HTML | 31 Jul 2026 | 1987-88 to 2026-27 BE | https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=23911 (Table 86; 23912, 23913 and 23914 for Tables 87 to 89) | 27 Nov 2026 | Reproduce accurately, acknowledge RBI | `economy/rbi/table-86.html` to `table-89.html`: 86 `006acc748e67c460ae13969df48c4e1d0b642067dc4f655855a260536c21d144`, 87 `31135eefbefb035c8cfe455af4596abb9dbf0956c2273582719967da50f06e38`, 88 `69fb3c950d56974809650d99b1ddeb06ae9ac62fbecd26bbc17066c849204ff2`, 89 `1eb514f668d8953b1b373682a544de1c270940e377becdba921ee899c128a2e1` |

Other Handbook tables (1, 2, 3, 5, 6, 157, 158, 159, 205, 223, 228) were downloaded as cross-checks. They are not used in a chart.

## Gaps and cautions

- **Base change, national accounts.** MoSPI moved GDP to base 2022-23 on 27 Feb 2026. The 2022-23 base covers 2022-23 onwards only. Older years are on base 2011-12. The two bases give different growth rates and sector shares for the same years. Mark the break on every chart.
- **Revisions.** The NAS release of 31 Aug 2026 revised 2022-23 to 2025-26. The RBI Handbook (31 Jul 2026) has the older numbers: 7.21% for 2023-24 and 7.1% for 2024-25, against 7.3% and 7.2% in the API now. Use the API values.
- **Derived values.** Annual growth before 2023-24 (E2) and all sector shares (E3) are computed by us from published levels. The `method` or `series` column says so.
- **States missing.** Per capita NSDP 2024-25: not found for Nagaland (latest 2023-24: ₹1,54,828 at current prices, RBI Table 9), Ladakh, Lakshadweep, and Dadra and Nagar Haveli and Daman and Diu. GSDP growth 2024-25: not found for Assam, Haryana, Nagaland, Ladakh, Lakshadweep, and Dadra and Nagar Haveli and Daman and Diu. MoSPI did not publish these in the release the API serves.
- **Jammu and Kashmir.** From 2019-20 the data cover the union territory of Jammu and Kashmir only, without Ladakh (RBI Table 9, note 2). Do not compare its level before and after 2019-20.
- **State base.** State accounts are on base 2011-12. Do not compare state growth with the national 2022-23-base headline.
- **2025-26 state data.** Only 15 states have 2025-26 figures. We used 2024-25 so that the ranked bar covers more states.
- **IIP base changes.** Base 2004-05 and base 2011-12 have 48 overlapping year-on-year rates from April 2013 to March 2017. All 48 differ. The greatest difference is 7.3 percentage points in April 2016 (-1.3% on base 2004-05 and 6.0% on base 2011-12). The 2011-12 and 2022-23 bases differ in all 24 months from April 2024 to March 2026. The greatest difference is 2.8 percentage points. Use the latest base with a year-on-year rate at each switch.
- **Exchange rate archive.** The RBI Reference Rate Archive starts on 25 Aug 1998 and returned no rows between 24 Jul 2018 and 12 Apr 2022. E9 takes those days from FBIL. The Handbook monthly table (205) covers 2022 to June 2026 only. On 18 Nov 2026 the RBI document server served a bot check page for Table 205, not the workbook. The 93.77 rupees per dollar on the 12 Nov RBI ticker (in `research/india-sources.md`) is still not traced to a dated source; the archive gives 93.7650 for 12 Nov 2026.
- **ASI coverage changes.** Since ASI 2014-15, units with 100 or more employees on state business registers are in scope. Sixteen states raised the Factories Act threshold to 20 workers with power and 40 without: Maharashtra and Rajasthan from 2015-16, Goa from 2022-23, Andhra Pradesh, Arunachal Pradesh, Assam, Gujarat, Haryana, Jammu and Kashmir, Odisha, Punjab, Tripura and Uttar Pradesh from 2023-24, and Bihar, Himachal Pradesh and Jharkhand from 2024-25 (Summary Results, para 1.1.3). Ladakh units are in from 2022-23, Lakshadweep from 2023-24. MoSPI does not mark these as breaks, so the E10 chart has none. The `know` notes give them.
- **ASI Lakshadweep.** No separate estimate in 2024-25 (fewer than 3 units surveyed). It is in All India only.
- **ASUSE period change.** 2021-22 to 2023-24 ran October to September; 2025 ran January to December, with a new sample design. E13 marks a method break.
- **ASUSE 2021-22 states.** The API gives Dadra and Nagar Haveli and Daman and Diu as two rows for 2021-22 and one merged row later. The by-state chart uses 2025 only, so this does not affect it.
- **PIB pages.** PIB served "Access Denied" to both `curl` and headless Chromium on 25 Nov 2026 for PRID 2332475 and 2258362. The release dates come from the source discovery backlog and the brief, and agree with the PDF creation dates and the NADA catalogue dates. The figures come from the MoSPI PDFs, not from PIB.
- **eSankhyiki rate limit.** The API answers "Too many requests" after about 40 quick calls. `build_asi.py` and `build_asuse.py` stop if a merged file has fewer rows than the API reported.
- **Licence.** None of the pages read states a reuse licence for these data.

## Rebuild

The CSVs are built by `pipeline/prices/build_prices_economy.py` (run with `python3 -I`), from the raw files in `raw/economy/` and `raw/prices/`. Raw downloads are not kept in the repository; the URL and sha256 below identify each file. The RBI document server (`rbidocs.rbi.org.in`) does not serve automated clients, so download the Handbook files by hand from the RBI website in a browser. The sha256 below identifies each file.

## Raw files

Paths are relative to `raw/`. Raw downloads are not kept in the repository; the URL and sha256 below identify each file. Files ending `.pN.json` are single API pages; `.all.json` merges them.

### E7 annual exchange rates

| File | URL read | Read date | Source kind | SHA-256 |
| --- | --- | --- | --- | --- |
| `economy/usd-inr-2002-handbook-fy/table-133.html` | https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=3615 | 18 Nov 2026 | official | `4f785ee53d5190ef88df77afaac35388ee72c74f7d0867687aefe00b9f8c68a2` |
| `economy/usd-inr-2026-handbook-fy/table-133.html` | https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=23958 | 18 Nov 2026 | official | `b67ea99898ba1fd6d7e6c7a8134ad3901de7ef5e861017783125e943476a1f8a` |
| `economy/usd-inr-2002-handbook-calendar/table-132.html` | https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=3614 | 18 Nov 2026 | official | `bd254c10044391b810722d3886706be30ecea84d655868081cea618be2929729` |
| `economy/usd-inr-2026-handbook-calendar/table-132.html` | https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=23957 | 18 Nov 2026 | official | `b316b830ea143edba710196b4cb6820c4f543486f21cc1ac805eb5b3ada349db` |
| `economy/usd-inr-imf-ifs/india-annual.json` | https://api.db.nomics.world/v22/series/IMF/IFS/A.IN.ENDA_XDC_USD_RATE?observations=1 | 18 Nov 2026 | international estimate | `3a7672363dcfd63d178b0219e5656742f4e7110f3bfd3fdd624f1ce4535da264` |
| `economy/usd-inr-rbi-rcf-1965-66/report.pdf` | https://web.archive.org/web/20261114093603id_/https://rbidocs.rbi.org.in/rdocs/Publications/PDFs/30CF10062020_19657B5EB9F13B3B47718270AB62C5142966.PDF | 18 Nov 2026 | archived copy | `0b9e8339aea7d8cc33b000d35f103c764a19bfa67473df8d53c060a06115ced9` |
| `economy/usd-inr-rbi-rcf-1966-67/report.pdf` | https://web.archive.org/web/20261114093654id_/https://rbidocs.rbi.org.in/rdocs/Publications/PDFs/31CF10062020_1966ED505EE590504051B3AC56061AE190EC.PDF | 18 Nov 2026 | archived copy | `7e6a75f95c9c04f702212ce586943bdfbb0eacbf1ddd0e713746a4f186876006` |
| `economy/usd-inr-rbi-chronology-1949/chronology.html` | https://www.rbi.org.in/Scripts/chro_1935.aspx | 18 Nov 2026 | official | `e175181fc346131209c0e7441a57cd09a4c4945c8bddb26b747352f7a7b6426b` |
| `economy/usd-inr-rbi-chronology-1991/chronology.html` | https://www.rbi.org.in/Scripts/chro_1991.aspx | 18 Nov 2026 | official | `46b7e92aab7316bd6c15918f6adaf747f1adf55866cbe9b3afd6643478cabcd4` |

### Other economy files

| File | Source URL | sha256 |
| --- | --- | --- |
| `economy/api/iip1112_monthly_general.all.json` | https://api.mospi.gov.in/api/iip/getIIPData?Format=JSON&base_year=2011-12&frequency=Monthly&category_code=4 (merged pages) | `a349209e480dc5e067d96b7f6c4ee3c281537a32deb812719703535cd6773e88` |
| `economy/api/iip1112_monthly_general.p1.json` | https://api.mospi.gov.in/api/iip/getIIPData?Format=JSON&base_year=2011-12&frequency=Monthly&category_code=4&limit=100&page=1 | `fffd1769cf73d06a7a339c0269bae19114dc9142d04a2d84b387d3df8d0bad89` |
| `economy/api/iip1112_monthly_general.p2.json` | https://api.mospi.gov.in/api/iip/getIIPData?Format=JSON&base_year=2011-12&frequency=Monthly&category_code=4&limit=100&page=2 | `fbafe46ebbeb531a7b43b7b0a90dd6b510bdecd415877a25267ad65d45d20ef6` |
| `economy/api/iip2223_monthly.all.json` | https://api.mospi.gov.in/api/iip/getIIPData?Format=JSON&base_year=2022-23&frequency=Monthly&category_code=4,12,2,13 (merged pages) | `edf5662e6f5f5c0f6dc6d223bac00533ca9dcde203aee8ec0c39009c2c990da8` |
| `economy/api/iip2223_monthly.p1.json` | https://api.mospi.gov.in/api/iip/getIIPData?Format=JSON&base_year=2022-23&frequency=Monthly&category_code=4,12,2,13&limit=100&page=1 | `95a6894bd472cd4b53186027764339dc6b7eed0855a4da5ef8f6abc8b6ce693f` |
| `economy/api/iip2223_monthly.p10.json` | https://api.mospi.gov.in/api/iip/getIIPData?Format=JSON&base_year=2022-23&frequency=Monthly&category_code=4,12,2,13&limit=100&page=10 | `745523084242c0b823018cb77e715d2bc55ad60cb92c50535915ceb11bb2e12d` |
| `economy/api/iip2223_monthly.p11.json` | https://api.mospi.gov.in/api/iip/getIIPData?Format=JSON&base_year=2022-23&frequency=Monthly&category_code=4,12,2,13&limit=100&page=11 | `fc1c80708a2c1f98386dcf545dc620c168ce50d98aa3df2dfec2d803881c9660` |
| `economy/api/iip2223_monthly.p12.json` | https://api.mospi.gov.in/api/iip/getIIPData?Format=JSON&base_year=2022-23&frequency=Monthly&category_code=4,12,2,13&limit=100&page=12 | `060474482f1ac25d2fe59f2e0141f0bcfda5546e704f08cabc1cb13a2bc3c6f3` |
| `economy/api/iip2223_monthly.p13.json` | https://api.mospi.gov.in/api/iip/getIIPData?Format=JSON&base_year=2022-23&frequency=Monthly&category_code=4,12,2,13&limit=100&page=13 | `89d8c1945b22f4ea77c22d920efbeada55524925a119e7ee010da4dd8db1ab2a` |
| `economy/api/iip2223_monthly.p14.json` | https://api.mospi.gov.in/api/iip/getIIPData?Format=JSON&base_year=2022-23&frequency=Monthly&category_code=4,12,2,13&limit=100&page=14 | `d35f83fb3805cde88447b3552620be59484d8da021e584cf3ee3fc9b9f6158d3` |
| `economy/api/iip2223_monthly.p15.json` | https://api.mospi.gov.in/api/iip/getIIPData?Format=JSON&base_year=2022-23&frequency=Monthly&category_code=4,12,2,13&limit=100&page=15 | `a478d3c0b47e72e463517f07f051f5b16dbee6872db4bfade5e07f7a6c600d98` |
| `economy/api/iip2223_monthly.p2.json` | https://api.mospi.gov.in/api/iip/getIIPData?Format=JSON&base_year=2022-23&frequency=Monthly&category_code=4,12,2,13&limit=100&page=2 | `0f505990a97ec4ff4bd1554ef416e0f086a30feba380dc87b289c4d3412112f8` |
| `economy/api/iip2223_monthly.p3.json` | https://api.mospi.gov.in/api/iip/getIIPData?Format=JSON&base_year=2022-23&frequency=Monthly&category_code=4,12,2,13&limit=100&page=3 | `eb7d169e41bbc8f0337b47833e95e5e17dabd551da273fc00e674224bac154be` |
| `economy/api/iip2223_monthly.p4.json` | https://api.mospi.gov.in/api/iip/getIIPData?Format=JSON&base_year=2022-23&frequency=Monthly&category_code=4,12,2,13&limit=100&page=4 | `3125606460479fe40e1f8cf9d36e11cd3221f31c2261d50079bdc43b5c551029` |
| `economy/api/iip2223_monthly.p5.json` | https://api.mospi.gov.in/api/iip/getIIPData?Format=JSON&base_year=2022-23&frequency=Monthly&category_code=4,12,2,13&limit=100&page=5 | `09b2d53bb5a39185ae1b76d779926c32e91904a9d8035dedb0b8bec004258ce1` |
| `economy/api/iip2223_monthly.p6.json` | https://api.mospi.gov.in/api/iip/getIIPData?Format=JSON&base_year=2022-23&frequency=Monthly&category_code=4,12,2,13&limit=100&page=6 | `25d7c09a2cba063b98f35a736ee8094d7fd3408a3f37d1e2aa1bfe7ed4434aa0` |
| `economy/api/iip2223_monthly.p7.json` | https://api.mospi.gov.in/api/iip/getIIPData?Format=JSON&base_year=2022-23&frequency=Monthly&category_code=4,12,2,13&limit=100&page=7 | `5fc606d00a2f809aae15865befbfa6117c3dd392e322728c35d06fd8368ef6e4` |
| `economy/api/iip2223_monthly.p8.json` | https://api.mospi.gov.in/api/iip/getIIPData?Format=JSON&base_year=2022-23&frequency=Monthly&category_code=4,12,2,13&limit=100&page=8 | `061ede686c372d81f274cb16c2386cd3933026aa8e029593eb6e8fac147d53f3` |
| `economy/api/iip2223_monthly.p9.json` | https://api.mospi.gov.in/api/iip/getIIPData?Format=JSON&base_year=2022-23&frequency=Monthly&category_code=4,12,2,13&limit=100&page=9 | `8b3f8366aedb587cf670ccb789022e567fd7028ea83b14e3fb1010b983b55f47` |
| `economy/api/nas1112_a_g22.all.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=22 (merged pages) | `cc9766e08a8a0f1f2896e09024758e1225893284c2edc255cc3d2cfdde4e0521` |
| `economy/api/nas1112_a_g22.p1.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=22&limit=100&page=1 | `56bac0099b4827246c0e78948b30ecd158834a6ad244b906c44edd3a14116a4e` |
| `economy/api/nas1112_a_gdp.all.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=5 (merged pages) | `a6b675d4ce3726d9bd8e686ff45de22f628ed53585dabd98ac83682e58adc026` |
| `economy/api/nas1112_a_gdp.p1.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=5&limit=100&page=1 | `8482d26df9cdd499e7e8b61829a6fbdb1df9d6736943074477289b6901dcacd5` |
| `economy/api/nas1112_a_growth.all.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=22 (merged pages) | `cc9766e08a8a0f1f2896e09024758e1225893284c2edc255cc3d2cfdde4e0521` |
| `economy/api/nas1112_a_growth.p1.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=22&limit=100&page=1 | `56bac0099b4827246c0e78948b30ecd158834a6ad244b906c44edd3a14116a4e` |
| `economy/api/nas1112_a_gva.all.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=1 (merged pages) | `cf2d4905d880b869eee25f4bd221fd5e85726e9880e4014b5a4ad4ba5a44e680` |
| `economy/api/nas1112_a_gva.p1.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=1&limit=100&page=1 | `f1f689d56ec842161139775bca3253f880889ad0e74facb5f7439a6955d30174` |
| `economy/api/nas1112_a_gva.p10.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=1&limit=100&page=10 | `09c8c4dc8933bfe3bc19c2d572bf8cab5eb6eac1139c6f2d17cd899b8ead1ea0` |
| `economy/api/nas1112_a_gva.p11.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=1&limit=100&page=11 | `ec693e09b6204337a5d94eab4fb703de50448434086ef6405447756677094d10` |
| `economy/api/nas1112_a_gva.p12.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=1&limit=100&page=12 | `0498cffcaf6329220f7e184be4dd0b0488b916d6ee12f4d46535c78f1965c02c` |
| `economy/api/nas1112_a_gva.p13.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=1&limit=100&page=13 | `804fbf98930d7808c21fc3d32aef62b2f47b1d65ca61c2945961dec6b4f155f0` |
| `economy/api/nas1112_a_gva.p14.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=1&limit=100&page=14 | `5771df0f306d5124de5563f0bc6c791ef3931061129e747947d9f69092da654f` |
| `economy/api/nas1112_a_gva.p15.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=1&limit=100&page=15 | `013c7eb7d729520d65e9d47520a285009e0424676dae148181cfc64ec8c07e1a` |
| `economy/api/nas1112_a_gva.p16.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=1&limit=100&page=16 | `3da796f6be34a49577838f57d1189e135c5eac307c7076208e71f89889068d52` |
| `economy/api/nas1112_a_gva.p2.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=1&limit=100&page=2 | `422d25a23e6f52f8ec78d1b38391dacebd801346f029cad8c71953c134485c76` |
| `economy/api/nas1112_a_gva.p3.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=1&limit=100&page=3 | `d72776e293463972b094420bc8b2d01177d38263d86393d8d999e16ad155911a` |
| `economy/api/nas1112_a_gva.p4.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=1&limit=100&page=4 | `30b2468f187032529778aedcc78051ac6f49644975d465613fa0210aa4059a32` |
| `economy/api/nas1112_a_gva.p5.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=1&limit=100&page=5 | `07a212cbd3f669e281d8a5c528dccdd5c1b47d8a8e6f8dce7c190edd21cca63c` |
| `economy/api/nas1112_a_gva.p6.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=1&limit=100&page=6 | `737cb9f002428e92df14e8d720984600de338cef2fc67ed0a3c47ad01b04a55b` |
| `economy/api/nas1112_a_gva.p7.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=1&limit=100&page=7 | `bfd631a2755cc7d927e5b174c2beccdae7a89b626377ef381bff10230022a463` |
| `economy/api/nas1112_a_gva.p8.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=1&limit=100&page=8 | `2ca880011b4242104461f4dbd78f6287af4a432ab14db6410fa1759a90ea54b9` |
| `economy/api/nas1112_a_gva.p9.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=1&limit=100&page=9 | `87e31ea754ee1a01ecd52e43f54fb72f43355f85ec6996537440379d267da634` |
| `economy/api/nas1112_q_g22.all.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Quarterly&indicator_code=22 (merged pages) | `7b6a054213933039cad92fec26e4c0d6c981cce0d79ff5ac8e3bdfac50703ce4` |
| `economy/api/nas1112_q_g22.p1.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Quarterly&indicator_code=22&limit=100&page=1 | `a2d99ddf6e6139acb4d0630774f13f5728fabc1cb571bc3a5243eed59358e4fe` |
| `economy/api/nas1112_state_gsdpgr.all.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=26&state_code=01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37 (merged pages) | `08e81cfdbe1cc7667257477f81c5e13a0f759dc25b7aaeba308327c9d1086b3a` |
| `economy/api/nas1112_state_gsdpgr.p1.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=26&state_code=01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37&limit=100&page=1 | `9c9756715c8b7b2cf9d6f23b51324e109e513ed67778409db7b03ab01335f25e` |
| `economy/api/nas1112_state_gsdpgr.p2.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=26&state_code=01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37&limit=100&page=2 | `632f0e37c63ec29a032a3f35b65cedf6a95547e5c912ed45fd09387d41a448a1` |
| `economy/api/nas1112_state_gsdpgr.p3.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=26&state_code=01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37&limit=100&page=3 | `402a069d9f5b677922c4950dbafdc6ad5706786f03cd857686152961c432eb39` |
| `economy/api/nas1112_state_gsdpgr.p4.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=26&state_code=01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37&limit=100&page=4 | `5e8b2f873dea7fc27290cec2c8f1de4830102357903a393d964b577ab351b6cb` |
| `economy/api/nas1112_state_gsdpgr.p5.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=26&state_code=01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37&limit=100&page=5 | `bbaf46ff7a8b7252ca409b05fbeb0e1d43dd11631831c0d5ce39e75950531fd7` |
| `economy/api/nas1112_state_pcnsdp.all.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=25&state_code=01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37 (merged pages) | `4fac369c54fa1d9c0a8f0c111c2a9067fa02e1e24d929f2af753d0d425d60bbc` |
| `economy/api/nas1112_state_pcnsdp.p1.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=25&state_code=01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37&limit=100&page=1 | `f660ef4daed867c27c838d2b467e79a2e9538aaaf4e1836c59a1b7b6a54e0819` |
| `economy/api/nas1112_state_pcnsdp.p2.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=25&state_code=01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37&limit=100&page=2 | `10c2ec8841982435b24f6b3d005a0687594c8900d6a3ec73b733347c57bd3ea7` |
| `economy/api/nas1112_state_pcnsdp.p3.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=25&state_code=01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37&limit=100&page=3 | `7d93c1b508475b9fa0700fbc35ac77429923e07ee43b380fb2d0415852c43aae` |
| `economy/api/nas1112_state_pcnsdp.p4.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=25&state_code=01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37&limit=100&page=4 | `16c9146f8b446cc6cb96a0c3a92208354b3eee0e4ca8565c3aec4f17a9a35468` |
| `economy/api/nas1112_state_pcnsdp.p5.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Current&frequency_code=Annually&indicator_code=25&state_code=01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37&limit=100&page=5 | `9665010bfa9a2c993302ef5c655333484b3c2a4e41006ae60b7d8218054e613c` |
| `economy/api/nas1112back_a_gdp.all.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Back&frequency_code=Annually&indicator_code=5 (merged pages) | `16dc3f3a22c5253e23179a8d8a21f97303b281f59f54ec61e6ee2ce5a651a7a5` |
| `economy/api/nas1112back_a_gdp.p1.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Back&frequency_code=Annually&indicator_code=5&limit=100&page=1 | `9e747a6186141a110142164c59d229de0eb22483dcdab8a044eee3480234fc45` |
| `economy/api/nas1112back_a_gva.all.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Back&frequency_code=Annually&indicator_code=1 (merged pages) | `0212281fe789d20b891924cd2c90d9978e5849f36dbe8b0b1c8d1194971a014f` |
| `economy/api/nas1112back_a_gva.p1.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Back&frequency_code=Annually&indicator_code=1&limit=100&page=1 | `6e3a5dca71e1b212a2ff509dc5809e38236ac2e9b52c97ccb314405c00834f58` |
| `economy/api/nas1112back_a_gva.p10.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Back&frequency_code=Annually&indicator_code=1&limit=100&page=10 | `5dfc4d38aa05f40382c8db95695b460ab570defe6e6593675b942f68daf7d2b0` |
| `economy/api/nas1112back_a_gva.p11.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Back&frequency_code=Annually&indicator_code=1&limit=100&page=11 | `0ba2c43bc6ae432fb2da21262f90b4ea5ac78acc9b8552091be17c486652c4c1` |
| `economy/api/nas1112back_a_gva.p12.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Back&frequency_code=Annually&indicator_code=1&limit=100&page=12 | `929036b4737afa82966333080755299d07d19a8a462f1a962c5af89f2a037eae` |
| `economy/api/nas1112back_a_gva.p13.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Back&frequency_code=Annually&indicator_code=1&limit=100&page=13 | `b9e400bf38d85a575371432c225266154c0e4e9dcceae1b1fc81ef675c8f769e` |
| `economy/api/nas1112back_a_gva.p14.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Back&frequency_code=Annually&indicator_code=1&limit=100&page=14 | `9d26c76848c194a624635b831689e87796b5d415359d55fe4f525ed043899456` |
| `economy/api/nas1112back_a_gva.p15.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Back&frequency_code=Annually&indicator_code=1&limit=100&page=15 | `2ad682e30619917c9c3ec008938b29cb06e82e25b647328fd5e41ed520009923` |
| `economy/api/nas1112back_a_gva.p16.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Back&frequency_code=Annually&indicator_code=1&limit=100&page=16 | `29d7aca810420f8ffc63fb6d675f729433a7af98803407c50d6dcc9144e4669e` |
| `economy/api/nas1112back_a_gva.p17.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Back&frequency_code=Annually&indicator_code=1&limit=100&page=17 | `471e667ed21f447db356e1fdf3b402ddb4058834150caff2c2f4261bd750e230` |
| `economy/api/nas1112back_a_gva.p18.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Back&frequency_code=Annually&indicator_code=1&limit=100&page=18 | `bf8aa00c2b9886fe628c4de1c41e587fcd7573474571ff33d3d3e87a1787301a` |
| `economy/api/nas1112back_a_gva.p2.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Back&frequency_code=Annually&indicator_code=1&limit=100&page=2 | `073974b4fc00584f0722f587626d2a1b4cf4e8119a155cc1c040cb17aae5f18d` |
| `economy/api/nas1112back_a_gva.p3.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Back&frequency_code=Annually&indicator_code=1&limit=100&page=3 | `1109931f4bb15102491108d80d34968499d1591fcd10f7fb816e86c9b2bbe726` |
| `economy/api/nas1112back_a_gva.p4.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Back&frequency_code=Annually&indicator_code=1&limit=100&page=4 | `f507c4354c00558f74dd870355697141f6335ebf2336ae33cad610b9a6ae0f2a` |
| `economy/api/nas1112back_a_gva.p5.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Back&frequency_code=Annually&indicator_code=1&limit=100&page=5 | `001bec7a4637698c4731a056dd5f4fd5219b7f895b10429ea3a70ce07bcb5700` |
| `economy/api/nas1112back_a_gva.p6.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Back&frequency_code=Annually&indicator_code=1&limit=100&page=6 | `5671168f334fde65dc085a5e1c70b977784938c5a8a7229275fab2d55c3ea06b` |
| `economy/api/nas1112back_a_gva.p7.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Back&frequency_code=Annually&indicator_code=1&limit=100&page=7 | `c99df404715ccd9c2ed2f4c7e7d8a1eabf247a880eb56f72a5e60c5c7868977f` |
| `economy/api/nas1112back_a_gva.p8.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Back&frequency_code=Annually&indicator_code=1&limit=100&page=8 | `d9b9bb1d86b3d4ced0acf3d430fa651ab58ba7ba6c5003939387f939d75927d4` |
| `economy/api/nas1112back_a_gva.p9.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2011-12&series=Back&frequency_code=Annually&indicator_code=1&limit=100&page=9 | `1e9d80ac87f9ca31bfb3ec0604149378052b1111519259e578a3ed395867c5b8` |
| `economy/api/nas2223_a_g21.all.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2022-23&series=Current&frequency_code=Annually&indicator_code=21 (merged pages) | `97349af4101bdfddbfeb0f7e96f055f081e76ca8298f221f892b437b3fd28e11` |
| `economy/api/nas2223_a_g21.p1.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2022-23&series=Current&frequency_code=Annually&indicator_code=21&limit=100&page=1 | `1051f10ba87ec0c4a261bf0e41e98e7076c8b25ee43b04a443395f2225b6759f` |
| `economy/api/nas2223_a_g22.all.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2022-23&series=Current&frequency_code=Annually&indicator_code=22 (merged pages) | `df58da91d7566784697d8aa6513c597cc73900c68d6d0a0e284b29170295c983` |
| `economy/api/nas2223_a_g22.p1.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2022-23&series=Current&frequency_code=Annually&indicator_code=22&limit=100&page=1 | `e0ffb360be58fbcd52ac7d3df9f9935e494fbaa2820e8a3adf40c4a9f57e5b7a` |
| `economy/api/nas2223_a_gva.all.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2022-23&series=Current&frequency_code=Annually&indicator_code=1 (merged pages) | `7b925179e5809e223419382ea7568d520706a9d10687ea8b33ff980444445732` |
| `economy/api/nas2223_a_gva.p1.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2022-23&series=Current&frequency_code=Annually&indicator_code=1&limit=100&page=1 | `609c0b002ef6a42c196dbe987c5f2ea0fea07217d8ed279651d97fd9ee1127b3` |
| `economy/api/nas2223_a_gva.p2.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2022-23&series=Current&frequency_code=Annually&indicator_code=1&limit=100&page=2 | `8774ba0abb8af066508a32511c447e2bc70a4d55c94862c70e305d005e583997` |
| `economy/api/nas2223_q_g21.all.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2022-23&series=Current&frequency_code=Quarterly&indicator_code=21 (merged pages) | `4f276aa000c2b805c81b176708d493e40179a3915b41c3c87cf98da10b75d597` |
| `economy/api/nas2223_q_g21.p1.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2022-23&series=Current&frequency_code=Quarterly&indicator_code=21&limit=100&page=1 | `919dc3251bfb886deb22288a43500a475736d5c7190333651ca49ec7593804ee` |
| `economy/api/nas2223_q_g21.p2.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2022-23&series=Current&frequency_code=Quarterly&indicator_code=21&limit=100&page=2 | `2606083ec4985ad5dafce5d17bb96d5f141d6bd0d596a9f3bea525cbede51881` |
| `economy/api/nas2223_q_g22.all.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2022-23&series=Current&frequency_code=Quarterly&indicator_code=22 (merged pages) | `23c88f6c08759bf39f7eea88cdeddcf239ac1cd6eed2f9858c341fd6476ad6e1` |
| `economy/api/nas2223_q_g22.p1.json` | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2022-23&series=Current&frequency_code=Quarterly&indicator_code=22&limit=100&page=1 | `c0e778ef030e1486d730cf0a3b1492eff1e7e8a568c97228af01007eb792fadc` |
| `economy/mcp/iip_meta_2223.json` | https://mcp.mospi.gov.in/mcp (MCP tools/call) | `c583b310117b757346e07cf841d1f7b3fdbf35dd6cd9064d3fc853a953031310` |
| `economy/mcp/nas22_meta.json` | https://mcp.mospi.gov.in/mcp (MCP tools/call) | `47024530193c9e3f92bc1f5b5b37d1a489204c43a77d2c5b5aaec8c962802423` |
| `economy/mcp/nas22_q_2223.json` | https://mcp.mospi.gov.in/mcp (MCP tools/call) | `bea798bc8776b76bd3f32c79fd3df91e74c96724cdef07c25e6f0dc13e1db443` |
| `economy/mcp/nas25_meta_2011-12.json` | https://mcp.mospi.gov.in/mcp (MCP tools/call) | `58064fa80cb2850424e756f7fd01870c120cd5f6d7ccc9b8796a807fb80f1f2c` |
| `economy/mcp/nas25_meta_2022-23.json` | https://mcp.mospi.gov.in/mcp (MCP tools/call) | `c2bc632c45166d6c973a6ed2c57d1de8aaa794b695d1e365ecfda6cf815a09f4` |
| `economy/mcp/rbi33_meta.json` | https://mcp.mospi.gov.in/mcp (MCP tools/call) | `6f7cffc6bca9003eebb907be7f03148a22c4dabe68fba1ec076527b6fa780c79` |
| `economy/mcp/rbi36_meta.json` | https://mcp.mospi.gov.in/mcp (MCP tools/call) | `854fc90779e51a78ada4aebc620d9edec57631d4e860872d51c6608a4b008e7e` |
| `economy/mcp_iip_indicators.json` | https://mcp.mospi.gov.in/mcp (MCP tools/call) | `01fb1771d3ee39f908740cb26e0ac13d301cff69f96502b4e6acba03977cee6f` |
| `economy/mcp_nas_indicators.json` | https://mcp.mospi.gov.in/mcp (MCP tools/call) | `dbb661189faa619014e8587d8cbe9ea97f2677834e58332c060adf6f6ba03ab4` |
| `economy/mcp_rbi_indicators.json` | https://mcp.mospi.gov.in/mcp (MCP tools/call) | `89c8dee6a7d69feb94f4f41f66a2ffd35ddc68ac8f5f9047fb2ba9ea9247f1d4` |
| `economy/pdf/gdp_q1.txt` | text extracted with pdftotext -layout from the PDF in the same folder | `7792234c42b0409957bde24d771cfdf91545c79c692578e57b06e6434636aef3` |
| `economy/pdf/gdp_q1_2026-27_pressnote.pdf` | https://www.mospi.gov.in/uploads/latestReleases/latest_release_1788172583113_d65a77cf-240e-4491-82ee-59f78618fa41_Press_Note_on_GDP_Estimates_for_Q1_2026-27.pdf | `152d9020853769fe4fe4433bec038a558aae1312bbb13ec072058e8dd5b0bc49` |
| `economy/pib/pib_2329475.html` | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2329475 (rendered in headless Chromium) | `953421ab83db67ec91c0f7130ec28f816f8f23b0d1608575e693d54cb9c62f75` |
| `economy/rbi/10T_HBIE310720268B682995CC224C51B22FC6036E99B7D1.XLSX` | https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/10T_HBIE310720268B682995CC224C51B22FC6036E99B7D1.XLSX | `4ce8c78e13d13bac6930908d4efa50c651ccba976adbf8adeb428c7b96d202db` |
| `economy/rbi/133T_HBIE3107202637939AFB4EE946719F742BEB8AEC5E18.XLSX` | https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/133T_HBIE3107202637939AFB4EE946719F742BEB8AEC5E18.XLSX | `a89a3c6f58cb5caf191bb0e9f9d83de8d671feaa4e7aca9931f9ba5a6f1d32fc` |
| `economy/rbi/157T_HBIE31072026FF7A80D77BB74B57ABCF49701AA16E82.XLSX` | https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/157T_HBIE31072026FF7A80D77BB74B57ABCF49701AA16E82.XLSX | `489f01fa124d9bbb7869498429fb90a117ec9488bdfa4ec543c6fed7bd331dc8` |
| `economy/rbi/158T_HBIE310720269B3D9B70E6764344877C18C9E1E80114.XLSX` | https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/158T_HBIE310720269B3D9B70E6764344877C18C9E1E80114.XLSX | `d5fbd2e5add6f13c80c44bb5d1c0fbe0708c759611a659bfc003bbe51cbdd429` |
| `economy/rbi/159T_HBIE31072026D1110923B5B44AC88B3800832B938C3E.XLSX` | https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/159T_HBIE31072026D1110923B5B44AC88B3800832B938C3E.XLSX | `4a2dbbb4572eb1d59e618141e580ce8f5cf28aba3ae1bd4a72db6065f925a6e1` |
| `economy/rbi/1T_HBIE310720260FBAA53A59A94B94A78CB8313C150B62.XLSX` | https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/1T_HBIE310720260FBAA53A59A94B94A78CB8313C150B62.XLSX | `5d9d86f40d813bb094d62b05cb6c43bd5ebf686520fa960beb94b9a47ab7338b` |
| `economy/rbi/205T_HBIE31072026B40F14BA1C1C40C9B8FDC62949CCB66B.XLSX` | https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/205T_HBIE31072026B40F14BA1C1C40C9B8FDC62949CCB66B.XLSX | `7b5bce2c176afbad7ad59aefa8481690231c5cdcaadef937989ee8bce788f700` |
| `economy/rbi/223T_HBIE310720266FEAA707965A4AA0924337A10D901600.XLSX` | https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/223T_HBIE310720266FEAA707965A4AA0924337A10D901600.XLSX | `c7e1535e2f48c93a0d8975f6681dcf55a3b9ea67f12b01f5ee712b80e17f8b28` |
| `economy/rbi/227T_HBIE31072026194AD11D84C94DDFB2BC11DB074BA738.XLSX` | https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/227T_HBIE31072026194AD11D84C94DDFB2BC11DB074BA738.XLSX | `49fe0af745cd5478fe4dbe9aa02d851c5f9ffea0ff93e9dcea5ae924c93a692c` |
| `economy/rbi/228T_HBIE310720266D944925ADC74FC0AB7E0911167C3F04.XLSX` | https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/228T_HBIE310720266D944925ADC74FC0AB7E0911167C3F04.XLSX | `84875d4d2b19748d47698fc425adedb7816eb865144d68ef37517b23df74d278` |
| `economy/rbi/2T_HBIE310720261ED415A38F9E465C9B9BEDEA897741FB.XLSX` | https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/2T_HBIE310720261ED415A38F9E465C9B9BEDEA897741FB.XLSX | `b5658b87860b77a5fcc1ba7eddfefca14781d4aca162e4e1a5e14dab16c1c502` |
| `economy/rbi/3T_HBIE3107202652095164B57C43B0B310E415B27E8B6C.XLSX` | https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/3T_HBIE3107202652095164B57C43B0B310E415B27E8B6C.XLSX | `3239dfe91fba7b10fb185b56710ed83104cd3856c88d05787308f799a8d218f9` |
| `economy/rbi/5T_HBIE310720269D892692410D4CDE90B8D8D010BDC6BD.XLSX` | https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/5T_HBIE310720269D892692410D4CDE90B8D8D010BDC6BD.XLSX | `7494270d06a5eb64129f4822e3cc615a401d2fbf8dfbcefc6c0eacd4604721d2` |
| `economy/rbi/6T_HBIE31072026B0ED4698A2884D62BBB82A7C93EC5D0B.XLSX` | https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/6T_HBIE31072026B0ED4698A2884D62BBB82A7C93EC5D0B.XLSX | `cc05531bb8dd789259addd58abaa79a2aedcb834e54298b23d35944b2be9d1a2` |
| `economy/rbi/9T_HBIE31072026A3F18AB442CE4A23BEC929D29B406162.XLSX` | https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/9T_HBIE31072026A3F18AB442CE4A23BEC929D29B406162.XLSX | `e68c3f831f95e194deb40301e307500a6ca320008de315663fb6d85f889fe948` |
| `economy/rbi/rbi_home.html` | https://www.rbi.org.in/ | `2d9eac9e0745225089c8588bca8faa0ff4712b4d3f2b47588784ec1ef92b065a` |
| `economy/rbi/refarchive.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx | `56304846b29f242d7a1eb3fac02bce8af7601e6674628d8608302242ce025f10` |
| `economy/rbi/refrate_usd_2016.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2016 to end of year or 17/11/2026) | `5d41f05862d4d33f162ec915c2cf56896614d0f7e2ece42e35f5e3072df1e987` |
| `economy/rbi/refrate_usd_2017.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2017 to end of year or 17/11/2026) | `15802453832a99330d5eef4b9932d4e63a8ab7a884e22236ab40f9f546d34682` |
| `economy/rbi/refrate_usd_2018.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2018 to end of year or 17/11/2026) | `dd27660cd144189bb817e44a628d6b02680aaa059c8e782d3e796be637b15de4` |
| `economy/rbi/refrate_usd_2019.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2019 to end of year or 17/11/2026) | `e71e62f8edc94315eed43127c3c9a367a35d4cf1bf03c95f243e59a94a4b240f` |
| `economy/rbi/refrate_usd_2020.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2020 to end of year or 17/11/2026) | `df6cdcd8907163770622b9ce90ac2e8f75d8e019bda3af107f1920b2dd3effe3` |
| `economy/rbi/refrate_usd_2021.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2021 to end of year or 17/11/2026) | `52b56063abf72a3cf8ab64735e2f334fc31bc87a0b962b7b88b877050798f976` |
| `economy/rbi/refrate_usd_2022.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2022 to end of year or 17/11/2026) | `6dfa82ed826d679c77b34433a70a03a737984330283ee4fd9543e0521296d543` |
| `economy/rbi/refrate_usd_2023.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2023 to end of year or 17/11/2026) | `f97209b8f65be43ef5e44f314f8ab530f3ca4efbb65caab674b555b1419bab9d` |
| `economy/rbi/refrate_usd_2024.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2024 to end of year or 17/11/2026) | `c2e519c670a55ad8131e6ed55cbebff1c6b8e5ffa608cae37af0412ff7369399` |
| `economy/rbi/refrate_usd_2025.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2025 to end of year or 17/11/2026) | `5a062616c3b972134bf4dc67baa4dcee71f2bba34165ceaca4b05b1a8800792f` |
| `economy/rbi/refrate_usd_2026.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2026 to end of year or 17/11/2026) | `1ec94498d7eadb2c32c6ac5f1b0653d0f15e80433333b7fa3b4bfccf5b00327b` |
| `economy/rbi/refrate_usd_jul_nov2026.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/07/2026 to 17/11/2026) | `f39a55547e670df3b091ecb0cf93dcb9368ea9853166b5be7f09a8e13bd000ff` |
| `economy/rbi/refrate_usd_hist_1998.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/1998 to 31/12/1998) | `adef65c4b67b8f7c25a80963eada794364e31b48bd2554ad811b3be385500f7a` |
| `economy/rbi/refrate_usd_hist_1999.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/1999 to 31/12/1999) | `f8488fe2982feb4afb2b26b4a548811239024b6d4bd3c905314d01b25c433943` |
| `economy/rbi/refrate_usd_hist_2000.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2000 to 31/12/2000) | `ec5fb564f2b3c344f9137e1e61a51cc39a538131087eaf77574623b86d290116` |
| `economy/rbi/refrate_usd_hist_2001.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2001 to 31/12/2001) | `702fc4b78695244cdbacbeff829fc2d29745f602280f540822574f9437871248` |
| `economy/rbi/refrate_usd_hist_2002.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2002 to 31/12/2002) | `29be9a7aee4686b7f21c468b0da6fcbdfc9b196bc1a171c10807d511a41f363b` |
| `economy/rbi/refrate_usd_hist_2003.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2003 to 31/12/2003) | `670e383592ab098374c4766bc0502ad729081efedb0241f260641b2b15542dcf` |
| `economy/rbi/refrate_usd_hist_2004.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2004 to 31/12/2004) | `26511d936dfb537a31861eb98831ee6d44b51e08d57f17081f0aa31d330c130a` |
| `economy/rbi/refrate_usd_hist_2005.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2005 to 31/12/2005) | `1b96b3ce68b890c802f1bf21824dbdba8f1cba2e629b2432f3361c8f74e2c075` |
| `economy/rbi/refrate_usd_hist_2006.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2006 to 31/12/2006) | `d12ba8a0589e557bb7d938dfa011d11a6acbd3af79f74d629157cdc06ccc19bd` |
| `economy/rbi/refrate_usd_hist_2007.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2007 to 31/12/2007) | `386f924fba0df799a56767b41db97d5674a9de0a0d6ca94acfc6ccc0cef600cb` |
| `economy/rbi/refrate_usd_hist_2008.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2008 to 31/12/2008) | `ec7faa233739fb8625a8632d0a3c9af1033c48a111a61213455fc867dd49b8c8` |
| `economy/rbi/refrate_usd_hist_2009.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2009 to 31/12/2009) | `df382a066025230a74efd43c5aeee78efc97c0755a5ca8bae430446733abf3f4` |
| `economy/rbi/refrate_usd_hist_2010.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2010 to 31/12/2010) | `ce2557e2717818b1c60e70c08c49bac9ca15b4d2dcacea59cf78a58a43a8f056` |
| `economy/rbi/refrate_usd_hist_2011.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2011 to 31/12/2011) | `9384f5a1677e60ae745b560ddd2e897ac7ee92de4f247080087cc5d5bd6fc170` |
| `economy/rbi/refrate_usd_hist_2012.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2012 to 31/12/2012) | `9fdbc2b9dbe46394762e0725d4ddbed7a3d20b812af53a299ede54d20d51f38b` |
| `economy/rbi/refrate_usd_hist_2013.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2013 to 31/12/2013) | `00752dd420cdda5f71dec3f632b09b56c9a0107883d723c4588f082ae0c3bffc` |
| `economy/rbi/refrate_usd_hist_2014.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2014 to 31/12/2014) | `1273290aa76a03c10220b53a8d56f047b40aae26278c009db2cc57bef7258bfb` |
| `economy/rbi/refrate_usd_hist_2015.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2015 to 31/12/2015) | `654159a80d8685086fb06f067c27cbbf2f39765877338200a6caa312a4bdf576` |
| `economy/rbi/refrate_usd_hist_2016.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2016 to 31/12/2016) | `67a2b5aea39fedd85fb51563b6d67acbafdf17051ab262d1d4ec29ad95e857ec` |
| `economy/rbi/refrate_usd_hist_2017.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2017 to 31/12/2017) | `c80af9cdd7804ecc9d782eeece8a87314da2994451718b8ebb5d979ac2b9fffc` |
| `economy/rbi/refrate_usd_hist_2018.html` | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx (POST, USD, 01/01/2018 to 31/07/2018) | `6cf4a5079c67cdcb31cc0db8ca35ed7ba0cf5ef3b61f115a2577e7ffd0dcf650` |
| `economy/fbil/refrates_2018.json` | https://www.fbil.org.in/wasdm/refrates/fetchfiltered?fromDate=2018-7-1&toDate=2018-12-31&authenticated=false | `f9e18238943bb109dd17c6ca6e5310a2039592baeb7ee33f525ed7d468166b5e` |
| `economy/fbil/refrates_2019.json` | https://www.fbil.org.in/wasdm/refrates/fetchfiltered?fromDate=2019-1-1&toDate=2019-12-31&authenticated=false | `bfddbe8955ddeed07c121df6aef102784e84c8a7efa1b29a132f55f20eb8c4ee` |
| `economy/fbil/refrates_2020.json` | https://www.fbil.org.in/wasdm/refrates/fetchfiltered?fromDate=2020-1-1&toDate=2020-12-31&authenticated=false | `dcb73e0a3a5491066bfaf6a4acfa854259d8cbf6dfc2bda0f57ee01d138f1b43` |
| `economy/fbil/refrates_2021.json` | https://www.fbil.org.in/wasdm/refrates/fetchfiltered?fromDate=2021-1-1&toDate=2021-12-31&authenticated=false | `3b5aa51e38633a12cbf394e4b190cc183b2e011a7ee9b8dd1221845bb7369417` |
| `economy/fbil/refrates_2022.json` | https://www.fbil.org.in/wasdm/refrates/fetchfiltered?fromDate=2022-1-1&toDate=2022-12-31&authenticated=false | `f4aff9ed6557ac4e659ebf274dbe4a4ce918b2dd0fb0c2dd5ba56f4c39f73811` |
| `economy/fbil/refrates_2023.json` | https://www.fbil.org.in/wasdm/refrates/fetchfiltered?fromDate=2023-1-1&toDate=2023-12-31&authenticated=false | `985b39534f14d8ccc287b6af60b3d9088f2a65aa3ea912b599c061944e09eec7` |
| `economy/fbil/refrates_2024.json` | https://www.fbil.org.in/wasdm/refrates/fetchfiltered?fromDate=2024-1-1&toDate=2024-12-31&authenticated=false | `b17448bafdf66aaf0c404309d04c46fd45e1aa3dd78cc93a10f9ddf93f6aafb4` |
| `economy/fbil/refrates_2025.json` | https://www.fbil.org.in/wasdm/refrates/fetchfiltered?fromDate=2025-1-1&toDate=2025-12-31&authenticated=false | `bd3ad1e723aa7f5313df3335c0cec7a290ce91b16424f1ee7f365f72389801fc` |
| `economy/fbil/refrates_2026.json` | https://www.fbil.org.in/wasdm/refrates/fetchfiltered?fromDate=2026-1-1&toDate=2026-11-18&authenticated=false | `2eb05d01d041194dbe8f0f2d104d66421d4e7a319e761e8626c126e30efd569f` |

## Publisher check on 18 Nov 2026

The RBI archive gives 93.5703 rupees per US dollar for 17 Nov and 93.3558 for 18 Nov, both from FBIL. The 17 Nov row was already in the CSV. The 18 Nov row is new and agrees with the RBI home page at 1:00 pm IST. All 212 CSV rows match the archive query for 1 Jan to 18 Nov 2026. FBIL's public feed showed rates through 11 Nov.

The eSankhyiki national accounts, state accounts and industrial production records match the 17 Nov extracts. The MoSPI release list and calendar show no newer GDP or IIP release. RBI still lists the July 2026 Handbook. The workbook links served HTML to this check, so the archived workbooks remain the basis for those series.

| Release or file checked | Release date | URL | Fetched | SHA-256 |
| --- | --- | --- | --- | --- |
| FBIL USD/INR reference rates for 17 and 18 Nov, RBI date-range result | 17 and 18 Nov 2026 | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx | 18 Nov 2026 | `1a91edf9b8a0feb061ec3af6e851bac143298ee5b07e18a2bc3286a92642afec` |
| FBIL USD/INR reference rates for 1 Jan to 18 Nov, RBI date-range result | Daily through 18 Nov 2026 | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx | 18 Nov 2026 | `a1808ae6afe7f7edf5130f5f77e611084674039f0500e3f2f64366ff76269228` |
| RBI Current Rates, source FBIL | 18 Nov 2026, 1:00 pm IST | https://www.rbi.org.in/ | 18 Nov 2026 | `2bc7550260255980fbc76339318b614f6b3a70a9056261ec044373eefc4f4b23` |
| FBIL public reference rate feed | Latest rate in this response 11 Nov 2026 | https://www.fbil.org.in/wasdm/refrates/fetch?authenticated=false | 18 Nov 2026 | `fd5a6ae4bf71c899c587ad7f83c97ef05a65052eed2e0c0b047010ab404250ee` |
| eSankhyiki quarterly GDP growth, page 1 | 31 Aug 2026 | https://api.mospi.gov.in/api/nas/getNASData?Format=JSON&base_year=2022-23&series=Current&frequency_code=Quarterly&indicator_code=22&limit=13&page=1 | 18 Nov 2026 | `d930ec6981626071e5c1ab912d24948ef55667c5d0e8597948294ca39318a7cf` |
| eSankhyiki IIP, page 1 | 28 Oct 2026 | https://api.mospi.gov.in/api/iip/getIIPData?Format=JSON&base_year=2022-23&frequency=Monthly&category_code=4,12,2,13&limit=100&page=1 | 18 Nov 2026 | `95a6894bd472cd4b53186027764339dc6b7eed0855a4da5ef8f6abc8b6ce693f` |
| MoSPI press release list, POST response | Live list | https://www.mospi.gov.in/api/latest-release/get-web-latest-release-list | 18 Nov 2026 | `7f3da46fedf29f0cb39396c7b2cc2896dab455ec01b10b6edccfc19649a80358` |
| MoSPI Advance Release Calendar, 2026-27 | 6 Nov 2026 upload | https://www.mospi.gov.in/uploads/documents/releaseCalender/1793948871564-ARC%202026-27%20updated%20till%20October%202026.pdf | 18 Nov 2026 | `5640fc8661b3ac5a16e72f2621151503fd5bc59a6281b21187b7e18ff4cbd149` |
| RBI Handbook list | 31 Jul 2026 edition | https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=Handbook%20of%20Statistics%20on%20Indian%20Economy | 18 Nov 2026 | `a6b0d174566dd5e0b3f5af0bcb60c60a0732364f6831cc6254a63e550db6e485` |

## Factories and small firms (ASI and ASUSE) raw files

Read on 25 Nov 2026. Paths start at `raw/`. Rebuild with `python3 -I pipeline/economy/build_asi.py` and `python3 -I pipeline/economy/build_asuse.py`. The docstring of each script lists the download commands. Text for the PDFs comes from `pdftotext -layout` into `work/economy/asi/` and `work/economy/asuse/`.

| File | URL read | SHA-256 |
| --- | --- | --- |
| `economy/asi/catalog309-related.html` | https://microdata.gov.in/NADA/index.php/catalog/309/related-materials | `8beda96dba97bb11074d2ea3e5b8c244cdbf5ae8081e8f1bb50c3d81fe3a96a3` |
| `economy/asi/asi-2024-25-summary-results.pdf` | https://microdata.gov.in/NADA/index.php/catalog/309/download/6675 | `aa8ce708e0f79dcd0f90c298efa71cae0ab810766607bb96f67b9549ac8e750b` |
| `economy/asi/catalog256-related.html` | https://microdata.gov.in/NADA/index.php/catalog/256/related-materials | `0e1e17c9f6dcaec70fdb74caac840f3835bfd7b4a7f6b7dc412704f4e55f9d56` |
| `economy/asi/asi-2023-24-summary-results.pdf` | https://microdata.gov.in/NADA/index.php/catalog/256/download/3924 | `3a737168229d96e67b24a5b8cc911a538828ed897326c04e51d78575a595ca65` |
| `economy/asi/api/asi-nic2008-allindia-total.all.json` | getASIData query above (merged pages) | `4abe851864c001d2b732b4d48fd42a3db049a5bd7f954662477921e1d66f4ce3` |
| `economy/asi/api/asi-nic2008-allindia-total.p1.json` | same, `&limit=200&page=1` | `6c03024b0c43e07a3cc6f84f52bc2b6d4b08c29d6bb15b73c2922175abcbe5b6` |
| `economy/asi/api/asi-nic2008-allindia-total.p2.json` | same, `&limit=200&page=2` | `a270725084b89b65a56b204c28d08a96cefcd48e0853078ad4b8232be2dec848` |
| `economy/asi/api/asi-nic2008-allindia-total.p3.json` | same, `&limit=200&page=3` | `710f4286fc69ca380a6f78e83eb32b9590c920cc476b424184f96c1e072d4935` |
| `economy/asi/api/asi-nic2008-allindia-total.p4.json` | same, `&limit=200&page=4` | `5b6747427534328fd274f92b6138af453b761b27468288a62c451f34561bf552` |
| `economy/asi/api/asi-nic2008-allindia-total.p5.json` | same, `&limit=200&page=5` | `5a627b317020f519e9856042e9f59e94c502d8eba889b64ab332b15b46d4e5a0` |
| `economy/asuse/catalog293-related.html` | https://microdata.gov.in/NADA/index.php/catalog/293/related-materials | `fe883730da6aef30618c1059726862123967339fa90e847f628547a8ccd55cdc` |
| `economy/asuse/asuse-2025-full-report.pdf` | ASUSE 2025 full report URL above | `334df2d5af4714c4dc451805b33cc278c991ac5cc2bdf704618c6ffa75fc847e` |
| `economy/asuse/asuse-2025-press-note.pdf` | ASUSE 2025 press note URL above | `11fb042b8b0f9d92af7c83a2763e23b10b67be01aec369b27e196a9f6a4b6a64` |
| `economy/asuse/api/asuse-workers-by-state.all.json` | getAsuseRecords indicator 27 query above (merged pages) | `9a53a009adb195264253ace6f6638addf3b15d5ba70ef6c001906d75293023af` |
| `economy/asuse/api/asuse-workers-by-state.p1.json` | same, `&limit=200&page=1` | `50fa6881f3a01c29a774cf69b0719a2c6fdbf5bac01a9c9c84f919c5e3f02855` |
| `economy/asuse/api/asuse-workers-by-state.p2.json` | same, `&limit=200&page=2` | `8f11cd186d3fa0de164b1d549b13ccec32a5eeee9e21bd1c407ea02a3bbf85d8` |
| `economy/asuse/api/asuse-workers-by-state.p3.json` | same, `&limit=200&page=3` | `7844c9cb6b1e053388554390b070718c9cc193c15d759d9c6fc93bcef15a524c` |
| `economy/asuse/api/asuse-establishments-by-state.all.json` | getAsuseRecords indicator 2 query above (merged pages) | `58f94a21b7adb0d2e311d402042ea43b1333c3dbd8a9a62539e7214ae332ac31` |
| `economy/asuse/api/asuse-establishments-by-state.p1.json` | same, `&limit=200&page=1` | `5fd63e3afddfc473de18601e955fc63b1d9b28753109fee6a30ac0211bcf7391` |

The ASI 2024-25 Volume I (catalogue 309, download 6674) and the ASUSE 2025 field instructions (catalogue 293, download 4984) were read for definitions only. The eSankhyiki API documentation is the OpenAPI file at `https://api.mospi.gov.in/layout/swagger_user_asi.yaml` and `.../swagger_user_asuse.yaml`. The metadata workbooks it links to returned HTML on 25 Nov 2026.

## IIP historical source files

Source: MoSPI eSankhyiki, monthly general index on base 2004-05 through March 2017, with early samples from the 2011-12 and 2022-23 series. Read on 18 Nov 2026. Paths start at `raw/`.

Run `python3 -I pipeline/economy/build_iip_2004.py` from the repository root to build `iip-growth-base-2004-05.csv`. The script checks both API pages for complete monthly coverage and compares the rates with the base 2011-12 CSV.

| File | Request URL | SHA-256 |
| --- | --- | --- |
| `economy/iip-history/page-1/body.json` | https://api.mospi.gov.in/api/iip/getIIPData?Format=JSON&base_year=2004-05&frequency=Monthly&category_code=4&limit=100&page=1 | `38c02c391fe1bd4d0fd910ec0586c08ebb6a90fb6803360b084ecafc13f98375` |
| `economy/iip-history/page-2/body.json` | https://api.mospi.gov.in/api/iip/getIIPData?Format=JSON&base_year=2004-05&frequency=Monthly&category_code=4&limit=100&page=2 | `322f67e9f0df7fb57178875e2704acd09539895d6b347ca07053d7fdaae8fba1` |
| `economy/iip-history/2011-base-sample/body.json` | https://api.mospi.gov.in/api/iip/getIIPData?Format=JSON&base_year=2011-12&frequency=Monthly&category_code=4&year=2012,2013&limit=100&page=1 | `0b2b22925d52d6e4beb9ffcfbed2bad8b6d215aefc6efcc18c2230a6bd82c1a9` |
| `economy/iip-history/2022-base-sample/body.json` | https://api.mospi.gov.in/api/iip/getIIPData?Format=JSON&base_year=2022-23&frequency=Monthly&category_code=4&year=2023,2024&limit=100&page=1 | `0396c92a2ce5c878e82ebd9f3f1a3f486cb74cb4a690e16b7f6e02d9e87d1184` |
