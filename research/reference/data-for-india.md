# Data For India reference audit

This file holds the audit of <https://www.dataforindia.com/>, done on 25 Nov 2026. It is reference
material for India by Numbers. It is not India data. Do not quote a Data For India figure on our
site. Most of their figures are their own estimates from unit-level survey data. Use this audit to
find the publisher releases behind their work, then read those releases ourselves.

The crawl stays out of this repository, because it is their content. This file keeps the findings.
Data For India is a private company in Chennai, founded by Rukmini S. Their articles, charts and
data are under CC BY 4.0.

## Coverage

| Item | Count |
| --- | --- |
| Articles read | 99: 74 topic articles and 25 "Measurement" explainers |
| Topics | 8: Population, Health, Economy, Living Conditions, Work, Law, Climate, Measurement |
| Chart embeds | 536 (527 unique charts) |
| Chart configs read | 527 of 527 |
| Outbound links in article bodies | 790, to 189 domains |

Each chart is an iframe from `charts.dataforindia.com`. The chart app reads
`assets.dataforindia.com/charts/<id>/config.json`. That file names the publisher and the dataset
in `chart.text.datasources`. The chart-level counts below come from those fields, not from the
article text.

## What they publish

- Long articles, each with 5 to 11 interactive charts (Apache ECharts), footnotes and a table view.
- "Measurement" explainers on how a survey works and where it goes wrong.
- Three newsletters: The Big Shift (weekly), Data Bytes (weekly), The Roundup (monthly).
- CSV downloads per chart (stated in their FAQ). No API.
- No state profile pages. No release calendar. No elections, prices, religion or language topics.

## Sources by chart

A chart can name more than one publisher, so the counts add to more than 527.

| Publisher | Charts | Datasets named |
| --- | --- | --- |
| NSO, MoSPI | 234 | PLFS (22 articles), NSS employment surveys (14), HCES (9), other NSS rounds (8), CAMS (5), ASI (3), MIS (2), NSS Social Consumption: Education (2), Price Statistics Division (2), ASUSE (2), Time Use Survey (2), CMS-Telecom (1), Housing Condition Survey (1), National Accounts (1) |
| IIPS | 66 | NFHS (20 articles) |
| World Bank | 38 | World Development Indicators (25 articles), Global Findex (1), Poverty and Inequality Platform (1) |
| SRS, ORGI | 35 | Statistical reports (8), Cause of Death in India (5), Special Bulletin on Maternal Mortality (1) |
| IMD | 31 | Temperature and rainfall, including gridded data (7 articles) |
| UN Population Division | 30 | World Population Prospects (10) |
| ORGI | 27 | Population projections (12), Census of India (9) |
| NCRB | 24 | Prison Statistics India (2), Crime in India (1) |
| RBI | 15 | DBIE (3), balance of payments (1) |
| Development Data Lab | 12 | eCourts case data (2) |
| IHME | 11 | Global Burden of Disease (4) |
| NJDG | 9 | Court pendency (2) |
| CRS, ORGI | 8 | Vital Statistics of India (3) |
| NDAP, NITI Aayog | 7 | MoRTH road data (2), TRAI (1) |
| Ministry of Education | 6 | AISHE (3), UDISE+ (1) |
| UN DESA | 6 | International migrant stock (1) |
| MoRTH | 6 | Road Accidents in India (2) |
| DGCI&S | 5 | Trade (1) |
| Digital Sansad | 4 | Parliament questions and answers (2) |
| CBHI, MoHFW | 3 | National Health Profile (1) |
| WHO | 3 | Global Health Observatory (2) |
| UNODC | 3 | Data portal (3) |
| ILO | 3 | ILOSTAT (2) |
| DHS Program | 2 | STATcompiler (2) |
| ITU | 2 | ICT indicators (2) |
| NCVBDC, MoHFW | 2 | Malaria surveillance (1) |
| One chart each | 7 | MoHFW immunisation schedule, IMF WEO, Labour Bureau, UN Demographic Yearbook, Commerce EIDB, International Road Federation |

## How they find sources

Their footnote links show the routes. Counts are links, then articles.

1. **Survey catalogues.** `microdata.gov.in/NADA` (28 links, 16 articles) and
   `censusindia.gov.in/nada` (33 links, 15 articles). Each catalogue lists every survey or report
   series that the office has released, with its reports and documents. They cite catalogue entries,
   for example CAMS (catalog 220), TUS 2024 (236), HCES 2023-24 (237), ASUSE 2023-24 (238),
   CMS-Telecom (239), PLFS 2025 (284), SRS Cause of Death 2021-23 (46176) and MCCD 2022 (45565).
2. **MoSPI report pages and method documents** (82 links, 35 articles). They read the field
   instructions, the sample design notes, Sources and Methods and the NSC papers. These documents
   name the other surveys and the administrative sources that feed an estimate.
3. **Parliament answers and PIB** (`sansad.in` 5 links, `pib.gov.in` 14 links). They use these
   for figures that have no other release: court pendency by year, weather station counts and
   programme totals.
4. **Programme and regulator sites.** NCVBDC (malaria), NHM, Jal Shakti (tap connections), TRAI,
   NJDG and eCourts, the UDISE+ dashboard, MoRTH, CBHI, tradestat (Commerce). NDAP gives them
   MoRTH and TRAI tables.
5. **Literature.** DOI, EPW, JSTOR, PubMed, ScienceDirect and CEDA links (more than 60). Papers
   point them to datasets and to known faults in the data.
6. **Beat writers.** Each writer covers one area (economy, health, law, climate). The
   Measurement series shows that they read each survey's method in depth.

## Their findings on data quality

Check these against the publisher before we act on them. Do not cite Data For India for them.

- **PLFS 2022-23, Assam.** One first-stage unit (FSU 10386, South Salmara-Mankachar) has a weight
  about 650 times the district average. They say it distorts Assam and the all-India 2022-23 sex
  ratio, and that NSO acknowledged it in a technical clarification (`/plfs-assam/`). Our jobs data
  uses PLFS 2022-23. Check whether any value we show is affected.
- **NFHS sex ratio.** Every NFHS round has more women than the Census or RGI benchmark. The gap
  runs from 22 (Chhattisgarh) to 168 (Bihar) per 1,000 men (`/nfhs-sex-ratio/`).
- **SRS deaths.** In 7 of 18 states, registered deaths (CRS) exceed the SRS estimate, by up to
  47%. They argue that the SRS undercounts deaths (`/crs-srs-accuracy/`).
- **Road deaths.** The SRS estimate for 2022 (about 271,300) is almost twice the MoRTH police
  count (`/road-accident-deaths-measurement/`).
- **HCES.** Urban non-response rose from 5.1% (1993-94) to 12.3% (2023-24). The "affluent"
  sampling rule changed between rounds (`/affluent-sampling/`).
- **Malaria.** NCVBDC counts and MCCD certified deaths are far below the SRS and IHME estimates
  (`/measuring-malaria/`).
- **Literacy.** Survey literacy rates rest on what respondents say. Nobody is tested
  (`/measuring-literacy/`).

## What we have and they do not

Elections (ECI). Religion and language (Census 2011). Monthly CPI by state and division, the repo
rate, CPI-IW and the exchange rate. IIP, quarterly GDP and state GSDP growth. Power capacity (CEA,
MNRE). The 2026 monsoon by subdivision. School data by state (UDISE+). Out-of-pocket health
spending (NHA). Profiles for all 36 states and UTs. A release calendar. A checksum for each source
file.
