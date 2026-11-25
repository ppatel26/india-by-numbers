# International

Data for the "How does India compare?" parts of five topics (Economy, Health, Population,
Climate, Jobs), and for the "Indians living abroad" part of Population. Rule R6 in
[`research/source-discovery.md`](../../source-discovery.md) governs every chart here: each chart
that compares countries takes every country, India included, from one series, one release and one
period.

Read on 25 Nov 2026.

## Questions these data answer

1. How does India's GDP per person compare with its neighbours, China and the world, at purchasing power parity?
2. How do life expectancy and the fertility rate in India compare?
3. How much CO2 does India emit per person, against its neighbours and the world?
4. How many women in India are in the labour force, on one international definition?
5. How many people born in India live in other countries, and where?

## Sources

| Publisher | Release | Release date | Data period | Link | Read |
| --- | --- | --- | --- | --- | --- |
| World Bank | World Development Indicators (WDI), API v2, source 2 | 11 Nov 2026 (`"lastupdated": "2026-11-11"` on the source record and on every data response) | 1960 to 2025 (varies by series) | [WDI API](https://api.worldbank.org/v2/sources/2?format=json) | 25 Nov 2026 |
| UN DESA, Population Division | International Migrant Stock 2024: Origin (`undesa_pd_2024_ims_stock_by_sex_and_origin.xlsx`) | 7 Feb 2025 (`Last-Modified` header of the file; the workbook says "Copyright © 2024") | Mid-year 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024 | [International Migrant Stock](https://www.un.org/development/desa/pd/content/international-migrant-stock) | 25 Nov 2026 |
| UN DESA, Population Division | International Migrant Stock 2024: Destination and origin (`undesa_pd_2024_ims_stock_by_sex_destination_and_origin.xlsx`) | 27 Jan 2025 (`Last-Modified` header) | As above | As above | 25 Nov 2026 |
| UN DESA, Population Division | World Population Prospects 2024, Demographic Indicators, medium variant. Used only to check which WPP revision WDI carries | July 2024 | 1950 to 2100 | [CSV gzip](https://population.un.org/wpp/assets/Excel%20Files/1_Indicator%20(Standard)/CSV_FILES/WPP2024_Demographic_Indicators_Medium.csv.gz) | 25 Nov 2026 |
| ILO | ILOSTAT, `EAP_2WAP_SEX_AGE_RT_A` (ILO modelled estimates), India, women aged 15+. Used only as a check | Not stated | 2020 to 2027 | [ILOSTAT API](https://rplumber.ilo.org/data/indicator/?id=EAP_2WAP_SEX_AGE_RT_A&ref_area=IND&sex=SEX_F&classif1=AGE_YTHADULT_YGE15&timefrom=2020&format=.csv) | 25 Nov 2026 |

The WDI release date is the date WDI gives as "last updated". The vintage on each chart is that
date. WDI revises whole histories at the same URL, so the raw responses and their sha256 below
identify the vintage we print.

## Reuse terms

Each WDI series states its own licence in its metadata (`License_Type`). The script stops if any
of the five series does not say `CC BY-4.0`.

| Series | WDI code | `License_Type` | Original source (WDI metadata) |
| --- | --- | --- | --- |
| GDP per capita, PPP (constant 2021 international $) | `NY.GDP.PCAP.PP.KD` | CC BY-4.0 | International Comparison Program (ICP), World Bank, with Eurostat and OECD PPPs, World Bank staff estimates, OECD national accounts and the IMF World Economic Outlook |
| Life expectancy at birth, total (years) | `SP.DYN.LE00.IN` | CC BY-4.0 | UN Population Division, World Population Prospects; national statistical offices; Eurostat |
| Fertility rate, total (births per woman) | `SP.DYN.TFRT.IN` | CC BY-4.0 | UN Population Division, World Population Prospects; national statistical offices; Eurostat |
| Carbon dioxide (CO2) emissions excluding LULUCF per capita (t CO2e/capita) | `EN.GHG.CO2.PC.CE.AR5` | CC BY-4.0 | EDGAR Community GHG Database, Joint Research Centre (JRC), European Commission, with IEA data. Metadata: "dataset_ghg2024, date published: 2024" |
| Labor force participation rate, female (% of female population ages 15+) (modeled ILO estimate) | `SL.TLF.CACT.FE.ZS` | CC BY-4.0 | ILO Modelled Estimates database (ILOEST), "date accessed: January 17, 2026" |

The licence URL for all five is <https://datacatalog.worldbank.org/public-licenses#cc-by>. Credit
the World Bank, and name the original source.

UN DESA prints this line on every sheet of both workbooks: "Copyright © 2024 by United Nations,
made available under a Creative Commons license CC BY 3.0 IGO:
http://creativecommons.org/licenses/by/3.0/igo/". The script stops if a sheet lacks it. The
suggested citation is "United Nations Department of Economic and Social Affairs, Population
Division (2024). International Migrant Stock 2024." Document code: POP/DB/MIG/Stock/Rev.2024.

## Decisions

- **Panel.** India, Bangladesh, Pakistan, Nepal, Sri Lanka, China and Indonesia, plus the WDI world
  value: the default panel of rule R6. No country was added. The same panel is in every chart.
- **One period per chart.** Each chart shows two years for every country: 1990 and the latest year
  in which every country has a value that is not a projection. GDP: 2025. Life expectancy and
  fertility: 2023. CO2: 2024. Women's labour force participation: 2024.
- **WPP projections.** WDI life expectancy and fertility equal WPP 2024, medium variant, for all
  seven countries from 1990 to 2024, to the three decimals WDI prints (490 values; the script
  checks them). WPP 2024 gives estimates to 2023 and projections from 2024 (see
  `research/data/population/README.md`). The CSVs mark 2024 `projection`. The charts stop at 2023,
  so they carry no Projection word. WPP 2026 is not out: its file URL returned HTTP 404 on 25 Nov
  2026.
- **World values.** The world rows are WDI's own aggregates. For life expectancy and fertility they
  differ from WPP's world figures (2023 life expectancy: WDI 73.3302230276375, WPP 73.1694;
  fertility: WDI 2.1956672724205, WPP 2.2505). Use the WDI world value, so the whole chart comes from one release.
- **CO2 series.** WDI moved its CO2 series to a new source. The old series, `EN.ATM.CO2E.PC`,
  "CO2 emissions (metric tons per capita)", is now in the WDI Database Archives (source 57), with
  the source "Climate Watch Historical GHG Emissions (1990-2020). 2023. ... World Resources
  Institute". The WDI API returns "The indicator was not found. It may have been deleted or
  archived" for it under source 2. The current series is `EN.GHG.CO2.PC.CE.AR5`, from EDGAR (JRC),
  excluding land use, land-use change and forestry (LULUCF). Its metadata names the EDGAR 2024
  dataset, but its data run to 2024.
- **ILO modelled estimates.** WDI's women's labour force participation is the ILO modelled series.
  ILOSTAT's copy runs to 2027, so its latest years are ILO projections. WDI prints 2025; the chart
  uses 2024. The status column says `modelled estimate` on every row, and the chart carries the
  `Modelled estimate` word. ILOSTAT's India values for 2020 to 2025 equal WDI's (the script checks
  them).
- **Status words for the other WDI charts.** The WDI metadata for GDP, life expectancy, fertility
  and CO2 does not call the series modelled, so those charts carry no status word.
- **Migrant stock status.** No status word. "About the data" on the chart pages says how UN DESA
  made the 2024 estimates.
- **Top destinations.** The chart shows the ten countries with the most India-born migrants in
  2024. The script checks that the ten named in the chart are the top ten.

## Rebuild

```sh
pipeline/international/fetch.sh                                  # WDI, WPP 2024, ILOSTAT, UN DESA
python3 -I pipeline/international/build_international.py         # seven CSVs; stops if a check fails
```

The build reads the UN DESA workbooks with `openpyxl`.

## CSVs

The WDI CSVs have `country` (`india` for India, else the WDI name: `Bangladesh`, `Pakistan`,
`Nepal`, `Sri Lanka`, `China`, `Indonesia`, `World`), `iso3`, `period` (calendar year), `value`,
`unit`, `indicator` (the WDI code), `status` and `release`. They have no `geography` column, because
the countries are not in `geography.csv`; the charts pick rows by `country`. Values keep every digit
the WDI API prints. Years with no value are left out.

### `wdi-gdp-per-person-ppp.csv` (288 rows)

- `NY.GDP.PCAP.PP.KD`, constant 2021 international dollars, 1990 to 2025. 2025 values: India
  10,039.0708910587, China 25,066.5215296486, World 21,913.5094934531.
- India's national accounts in WDI are on base 2022-23 (WDI country metadata, "National accounts
  base year: 2022/23"). MoSPI publishes no figure at PPP.

### `wdi-life-expectancy.csv` (520 rows)

- `SP.DYN.LE00.IN`, years, 1960 to 2024. 2024 is `projection`. India 2023: 72.003. SRS gives 70.6
  years for India in 2020-24 (`health/life-expectancy-india-1970-2024.csv`).

### `wdi-fertility-rate.csv` (520 rows)

- `SP.DYN.TFRT.IN`, births per woman, 1960 to 2024. 2024 is `projection`. India 2023: 1.975. SRS
  gives 1.9 for 2023 (`population/tfr-by-state-2019-2024.csv`).

### `wdi-co2-per-person.csv` (440 rows)

- `EN.GHG.CO2.PC.CE.AR5`, tonnes of CO2 per person, excluding LULUCF, 1970 to 2024. India 2024:
  2.17365173535787. The site shows no Indian figure for CO2 per person.

### `wdi-women-labour-force-participation.csv` (288 rows)

- `SL.TLF.CACT.FE.ZS`, % of women aged 15 and over, 1990 to 2025, all `modelled estimate`. India
  2024: 32.415. PLFS gives 40.3% for calendar 2024, usual status (ps+ss), age 15+
  (`jobs/jobs-lfpr-wpr-ur-annual.csv`).

### `migrants-from-india-1990-2024.csv` (24 rows)

- Origin file, Table 1, the India row (location code 356): international migrants born in India
  (`geography` `india`), by `sex` (`total`, `male`, `female`), at mid-year 1990 to 2024, in persons.
- 2024: 1,85,33,845 in all, 1,19,02,243 men and 66,31,602 women. 1990: 65,75,416.

### `migrants-from-india-by-destination.csv` (2,976 rows)

- Destination and origin file, Table 1, rows with origin India (356) and a destination country
  (location code below 900). 124 destination countries, 8 years, 3 sexes. `destination` is the UN
  name without its note mark (`*`). `location_code` is the UN M49 code. `data_type` is UN DESA's
  "Data type" code (see "Gaps and cautions").
- The destination countries add up to the India total for every year and sex (the script checks it).
- Top ten in 2024: United Arab Emirates 32,48,545; United States of America 31,65,238; Saudi Arabia
  19,53,496; Pakistan 15,97,134; Kuwait 12,31,094; United Kingdom 10,44,779; Canada 10,15,630;
  Australia 8,76,074; Oman 8,03,105; Qatar 7,36,955.

## Checks done on 25 Nov 2026

`build_international.py` stops with an error if any of these values differs. Each value was read
from the raw file.

| CSV | Values checked | Published table |
| --- | --- | --- |
| `wdi-gdp-per-person-ppp.csv` | India 2025, 10039.0708910587; China 2025, 25066.5215296486; World 2025, 21913.5094934531 | WDI API, `NY.GDP.PCAP.PP.KD` |
| `wdi-life-expectancy.csv` | India 2023, 72.003; India 1990, 58.618; Sri Lanka 2023, 77.483 | WDI API, `SP.DYN.LE00.IN` |
| `wdi-fertility-rate.csv` | India 2023, 1.975; India 1990, 4.045; Pakistan 2023, 3.605 | WDI API, `SP.DYN.TFRT.IN` |
| `wdi-co2-per-person.csv` | India 2024, 2.17365173535787; China 2024, 9.31508933799393; World 2024, 4.69378456136626 | WDI API, `EN.GHG.CO2.PC.CE.AR5` |
| `wdi-women-labour-force-participation.csv` | India 2024, 32.415 (ILOSTAT); India 2025, 32.425; China 2025, 59.148 | WDI API, `SL.TLF.CACT.FE.ZS`; ILOSTAT |
| `migrants-from-india-1990-2024.csv` | 2024 total, 18533845; 1990 total, 6575416; 2024 women, 6631602 | Origin file, Table 1 |
| `migrants-from-india-by-destination.csv` | United Arab Emirates 2024, 3248545; United States of America 2024, 3165238; Saudi Arabia 2024 men, 1774426 | Destination and origin file, Table 1 |

Cross-checks that also stop the script:

- The WDI source record and all five data responses say "last updated 2026-11-11". No WDI row has an
  `obs_status`.
- WDI life expectancy and fertility equal WPP 2024 (medium variant) to three decimals for the seven
  countries, 1990 to 2024: 490 values.
- WDI women's labour force participation for India equals ILOSTAT for 2020 to 2025.
- The UN DESA India row of the origin file equals the "India to World" row of the destination and
  origin file, for all 24 values. The 124 destination countries add up to it.
- The ten destinations named in the chart are the ten largest in 2024.

## Gaps and cautions

- **WDI and the Indian publishers differ.** The site uses the Indian publisher for India alone
  (rule R6). The WDI figure for India appears only in a chart that compares countries. Where the
  two differ, the chart says so: life expectancy (WPP 72.003 in 2023, SRS 70.6 in 2020-24) and
  women's labour force participation (ILO 32.415% in 2024, PLFS 40.3%). Fertility is close (WPP
  1.975, SRS 1.9, both 2023).
- **WPP annual values** are, in WDI's words, "interpolated data from 5-year period data", which
  "may not reflect real events as much as observed data".
- **EDGAR accuracy.** The WDI metadata says fossil fuel and industry emissions are "roughly accurate
  to within 10% when aggregated to the global level and between 4% and 35% at the country level".
- **ILO modelled estimates** adjust national surveys to common definitions and fill gaps with a
  model. WDI: "Caution should be used when comparing ILO estimates with national estimates."
- **PPP.** WDI extrapolates the 2021 ICP PPPs to later years and the 2011 PPPs to earlier years.
- **Migrant stock 2024 is part new, part extrapolated.** UN DESA: "a total of 60 countries and areas
  received a full reassessment ... For the remaining countries and areas, the estimates generated in
  2024 reflect extrapolations of estimates published in the 2020 edition". The Pakistan value is
  the same in 2020 and 2024 (15,97,134).
- **Born in India, or Indian citizens.** UN DESA's "Data type" code says what each destination's
  estimate rests on: `B` data on the foreign-born, `C` data on foreign citizens, `R` refugees added,
  `I` imputed. The United Arab Emirates, Kuwait, Oman, Qatar and Bahrain are `C`, and Saudi Arabia
  `C R`: there the count is of Indian citizens, not of people born in India. The United States,
  the United Kingdom, Canada and Australia are `B` or `B R`.
- **Mid-year.** UN DESA counts are for 1 July of each year.
- **UN DESA files carry no release date.** The `Last-Modified` dates of the files are 27 Jan 2025
  and 7 Feb 2025.

## Raw files

Paths are relative to `raw/international/`. Read on 25 Nov 2026 (UTC times in `_log.tsv`). WDI
URL prefix: `https://api.worldbank.org/v2/`.

| File | URL | SHA-256 |
| --- | --- | --- |
| `wdi/source.json` | `sources/2?format=json` | `7196c4bf58e63a75c4576fef063b0fd96cba99c118f9c112dadc4afbbd2a0476` |
| `wdi/NY.GDP.PCAP.PP.KD.data.json` | `country/IND;BGD;PAK;NPL;LKA;CHN;IDN;WLD/indicator/NY.GDP.PCAP.PP.KD?source=2&format=json&per_page=2000` | `fe468aa24efd5a98087f459fdbc12834be629e497040687a956b424c63ade752` |
| `wdi/NY.GDP.PCAP.PP.KD.indicator.json` | `indicator/NY.GDP.PCAP.PP.KD?format=json` | `55af4b25be9dc57c2865bc4a208710e7405b00306f8381038d884841d3b1e686` |
| `wdi/NY.GDP.PCAP.PP.KD.metadata.json` | `sources/2/series/NY.GDP.PCAP.PP.KD/metadata?format=json` | `5caa3df13accfc956fcbd2be43745a0e70e661ebd60a78bc288e6f780d8499c5` |
| `wdi/SP.DYN.LE00.IN.data.json` | `country/IND;BGD;PAK;NPL;LKA;CHN;IDN;WLD/indicator/SP.DYN.LE00.IN?source=2&format=json&per_page=2000` | `ed3a86af1adb83d3d14bb5a030680e58e900fd76b11c18aac46db07fa7cabdab` |
| `wdi/SP.DYN.LE00.IN.indicator.json` | `indicator/SP.DYN.LE00.IN?format=json` | `a39cb6fddfbbb953053690366243dffe77a266c4deae79c46ce5a06da9f5fc31` |
| `wdi/SP.DYN.LE00.IN.metadata.json` | `sources/2/series/SP.DYN.LE00.IN/metadata?format=json` | `83d8ce9d276ba5fa1aad1846f135ec51b7bf5f7aff818b171c24945ed08acd68` |
| `wdi/SP.DYN.TFRT.IN.data.json` | `country/IND;BGD;PAK;NPL;LKA;CHN;IDN;WLD/indicator/SP.DYN.TFRT.IN?source=2&format=json&per_page=2000` | `42844d8f2dd268293c4b1721dc804fb3dd06306d9e961b704aa7383358eb1b91` |
| `wdi/SP.DYN.TFRT.IN.indicator.json` | `indicator/SP.DYN.TFRT.IN?format=json` | `3aec8c45c5a8e7a80b9d797bf4553e4130a3b6c2116c61b81ca1d4ebda3c040d` |
| `wdi/SP.DYN.TFRT.IN.metadata.json` | `sources/2/series/SP.DYN.TFRT.IN/metadata?format=json` | `cdbf1a5a698c7d431e3f8a1f65323c5e7dcecf508e9bfa3b862c1bb15a7b894c` |
| `wdi/EN.GHG.CO2.PC.CE.AR5.data.json` | `country/IND;BGD;PAK;NPL;LKA;CHN;IDN;WLD/indicator/EN.GHG.CO2.PC.CE.AR5?source=2&format=json&per_page=2000` | `403602e04e9c37ebb3ee81d9d0ddcf41528d47f98bc2e5defed7b808e75adeb4` |
| `wdi/EN.GHG.CO2.PC.CE.AR5.indicator.json` | `indicator/EN.GHG.CO2.PC.CE.AR5?format=json` | `53014d01bf92914b341953a5c2b0d3ff2790624d279f8040b29c4d9715ec4415` |
| `wdi/EN.GHG.CO2.PC.CE.AR5.metadata.json` | `sources/2/series/EN.GHG.CO2.PC.CE.AR5/metadata?format=json` | `6597c3f16cec20637a850685230e3de25828d31186ced6981040955476282690` |
| `wdi/SL.TLF.CACT.FE.ZS.data.json` | `country/IND;BGD;PAK;NPL;LKA;CHN;IDN;WLD/indicator/SL.TLF.CACT.FE.ZS?source=2&format=json&per_page=2000` | `c1b6b596e13c2b5761644b7aa307da530ee29409a1d3fb04f1cc7fe350d97d2f` |
| `wdi/SL.TLF.CACT.FE.ZS.indicator.json` | `indicator/SL.TLF.CACT.FE.ZS?format=json` | `9f57a27372d29ac71a6a810096c5b73001a8ae1090db6a2fe88f06b06d4daeec` |
| `wdi/SL.TLF.CACT.FE.ZS.metadata.json` | `sources/2/series/SL.TLF.CACT.FE.ZS/metadata?format=json` | `ced4caabf9644e5f55e290bbf19d065cbd0137367523eb1b80957872a60bc0a0` |
| `wdi/EN.ATM.CO2E.PC.indicator.json` | `indicator/EN.ATM.CO2E.PC?format=json` | `1225d496c4e8fbd636c3e6520d5ebc860dbe37c7876151ad7b2d0b22a799ee8f` |
| `wpp-2024/WPP2024_Demographic_Indicators_Medium.csv.gz` | [File](https://population.un.org/wpp/assets/Excel%20Files/1_Indicator%20(Standard)/CSV_FILES/WPP2024_Demographic_Indicators_Medium.csv.gz) (the same file as in the population README) | `286ac36bb1415e2e1ade03acfef0a29f0e4c087e2f78e38c48f50c5df89082bc` |
| `ilostat/EAP_2WAP_SEX_AGE_RT_A.IND.F.15plus.csv` | [ILOSTAT API](https://rplumber.ilo.org/data/indicator/?id=EAP_2WAP_SEX_AGE_RT_A&ref_area=IND&sex=SEX_F&classif1=AGE_YTHADULT_YGE15&timefrom=2020&format=.csv) | `da95f3f1a50901b354c91deff24a80c637c360d85c1aab193dc3c001aac81667` |
| `undesa/page.html` | [International Migrant Stock](https://www.un.org/development/desa/pd/content/international-migrant-stock) | `0943a5cf8afce54a84079fe4031a2a7ed43754004cd2bf24491ddc872b595262` |
| `undesa/undesa_pd_2024_ims_stock_by_sex_and_origin.xlsx` | [File](https://www.un.org/development/desa/pd/sites/www.un.org.development.desa.pd/files/undesa_pd_2024_ims_stock_by_sex_and_origin.xlsx) | `67a6683e3993805da8df1c014d24e5b824e657877559e4f674e14fc10362b94c` |
| `undesa/undesa_pd_2024_ims_stock_by_sex_destination_and_origin.xlsx` | [File](https://www.un.org/development/desa/pd/sites/www.un.org.development.desa.pd/files/undesa_pd_2024_ims_stock_by_sex_destination_and_origin.xlsx) | `0e10179d05186041a65cf5c6200943b2231701f9c1fd33cbbe21d23b8ea47316` |

Two downloads of each file, about seven minutes apart on 25 Nov 2026, gave the same sha256. The
ILOSTAT file and the archived CO2 record were downloaded once.
