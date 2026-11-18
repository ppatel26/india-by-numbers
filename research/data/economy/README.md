# Economy

Data gathered on 17 Nov 2026 from MoSPI (NSO), the Reserve Bank of India (RBI), FBIL (through RBI) and PIB. All values are as published, except where a row says "derived". Initial read on 17 Nov 2026. See the publisher check for the 18 Nov update.

The main source is the MoSPI eSankhyiki API at `api.mospi.gov.in` (`getNASData` for national accounts, `getIIPData` for industrial production). Its values match the GDP press note of 31 Aug 2026 and the IIP release of 28 Oct 2026.

## Questions this topic answers

1. How fast is India's economy growing now, and how does that compare with the past 75 years?
2. How has the economy moved from farming to services?
3. Which states are richest and poorest per person, and which are growing fastest?
4. How is industry doing month by month?
5. How many rupees does a US dollar cost, and how has that changed?

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

- Type: column chart (or line), monthly. Method break at April 2024 (start of the new-base growth series).
- Unit: % change in the Index of Industrial Production (IIP) on the same month a year earlier.
- Geography: India. Period: April 2012 to March 2026 (base 2011-12); April 2024 to September 2026 (base 2022-23). Sector rows (mining, manufacturing, electricity and gas) for the new base.
- CSV: `iip-growth-monthly.csv`
- Sentence: "Industrial output grew by 6.7% in September 2026, with manufacturing up 7.6% and electricity and gas up 11.2%. Mining fell by 6.2%."
- Source: MoSPI, IIP (base 2011-12 and base 2022-23), `getIIPData`; PIB release "Quick Estimates of Index of Industrial Production ... September 2026 (Base 2022-23=100)", 28 Oct 2026, 4:00 pm.
- Notes: September 2026 is a quick estimate; August 2026 is final (7.8%, revised from the 8.0% quick estimate). On the new base, the API's growth rates for April 2023 to March 2024 equal the index minus 100, so they compare with the base-year average, not with the same month. We dropped them. The old base shows the lockdown fall: -57.3% in April 2020.

### E7. Rupees per US dollar since 1986-87

- Type: line, financial-year average (end-of-year rate in the same CSV).
- Unit: rupees per US dollar.
- Geography: India. Period: 1986-87 to 2025-26.
- CSV: `usd-inr-annual.csv`
- Sentence: "A US dollar cost ₹12.78 on average in 1986-87 and ₹88.31 in 2025-26. At the end of March 2026 it cost ₹94.65."
- Source: RBI, Handbook of Statistics on Indian Economy 2025-26, Table 133.
- Notes: rates to 1991-92 are official rates; from 1992-93 FEDAI indicative rates; from May 2012 RBI reference rates; from 10 Jul 2018 FBIL reference rates (table notes). The 1991-92 and 1992-93 jumps reflect the 1991 devaluation and the move to a market rate.

### E8. The rupee in 2026, day by day

- Type: line, daily.
- Unit: rupees per US dollar (FBIL reference rate).
- Geography: India. Period: 1 Jan 2026 to 18 Nov 2026 (working days).
- CSV: `usd-inr-daily-2026.csv`
- Sentence: "On 18 November 2026 a dollar cost ₹93.3558, up from ₹89.9792 on 1 January. The rupee was weakest on 20 May 2026, at ₹96.8441 per dollar."
- Source: FBIL reference rates from the RBI Reference Rate Archive. The RBI home page confirms the 18 Nov 2026 rate as of 1:00 pm IST.

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
| RBI | Handbook 2025-26, Table 227: growth rates at constant prices (cross-check) | 31 Jul 2026 | 2019-20 to 2025-26 | https://rbidocs.rbi.org.in/rdocs/Publications/DOCs/227T_HBIE31072026194AD11D84C94DDFB2BC11DB074BA738.XLSX | 17 Nov 2026 | Not stated | `economy/rbi/227T_*.XLSX` |
| RBI (source FBIL) | Reference Rate Archive, USD | Daily | 1 Jan 2016 to 17 Nov 2026 (with gaps, see below) | https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx | 17 Nov 2026 | Not stated | `economy/rbi/refrate_usd_*.html` |
| RBI | Home page, "Current Rates" box | Live | 17 Nov 2026 | https://www.rbi.org.in/ | 17 Nov 2026 | Not stated | `economy/rbi/rbi_home.html` |

Other Handbook tables (1, 2, 3, 5, 6, 157, 158, 159, 205, 223, 228) were downloaded as cross-checks. They are not used in a chart.

## Gaps and cautions

- **Base change, national accounts.** MoSPI moved GDP to base 2022-23 on 27 Feb 2026. The 2022-23 base covers 2022-23 onwards only. Older years are on base 2011-12. The two bases give different growth rates and sector shares for the same years. Mark the break on every chart.
- **Revisions.** The NAS release of 31 Aug 2026 revised 2022-23 to 2025-26. The RBI Handbook (31 Jul 2026) has the older numbers: 7.21% for 2023-24 and 7.1% for 2024-25, against 7.3% and 7.2% in the API now. Use the API values.
- **Derived values.** Annual growth before 2023-24 (E2) and all sector shares (E3) are computed by us from published levels. The `method` or `series` column says so.
- **States missing.** Per capita NSDP 2024-25: not found for Nagaland (latest 2023-24: ₹1,54,828 at current prices, RBI Table 9), Ladakh, Lakshadweep, and Dadra and Nagar Haveli and Daman and Diu. GSDP growth 2024-25: not found for Assam, Haryana, Nagaland, Ladakh, Lakshadweep, and Dadra and Nagar Haveli and Daman and Diu. MoSPI did not publish these in the release the API serves.
- **Jammu and Kashmir.** From 2019-20 the data cover the union territory of Jammu and Kashmir only, without Ladakh (RBI Table 9, note 2). Do not compare its level before and after 2019-20.
- **State base.** State accounts are on base 2011-12. Do not compare state growth with the national 2022-23-base headline.
- **2025-26 state data.** Only 15 states have 2025-26 figures. We used 2024-25 so that the ranked bar covers more states.
- **IIP base change.** The 2011-12 series ends in March 2026; the 2022-23 series begins in April 2023 but its growth rates are only valid from April 2024 (see E6). The two series overlap from April 2024 to March 2026 with different values.
- **Exchange rate archive.** The RBI Reference Rate Archive returned no rows between 24 Jul 2018 and 12 Apr 2022. We did not need these days for E8. The Handbook monthly table (205) covers 2022 to June 2026 only. Long-run rates come from the financial-year table (E7). The 93.77 rupees per dollar on the 12 Nov RBI ticker (in `research/india-sources.md`) is still not traced to a dated source; the archive gives 93.7650 for 12 Nov 2026.
- **Licence.** None of the pages read states a reuse licence for these data.

## Rebuild

The CSVs are built by `pipeline/prices/build_prices_economy.py` (run with `python3 -I`), from the raw files in `raw/economy/` and `raw/prices/`. Raw downloads are not kept in the repository; the URL and sha256 below identify each file. The RBI document server (`rbidocs.rbi.org.in`) does not serve automated clients, so download the Handbook files by hand from the RBI website in a browser. The sha256 below identifies each file.

## Raw files

Paths are relative to `raw/`. Raw downloads are not kept in the repository; the URL and sha256 below identify each file. Files ending `.pN.json` are single API pages; `.all.json` merges them.

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
