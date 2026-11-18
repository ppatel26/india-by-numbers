# India sources: first check

Checked in a browser on 12 Nov 2026. Values are as each site showed them that day. Link each value to its release document before any use.

## Checked

| Publisher | Portal | Use for | Result on 12 Nov 2026 |
| --- | --- | --- | --- |
| MoSPI, National Statistics Office | mospi.gov.in | National Accounts, CPI, IIP, PLFS, HCES, ASI | Reachable. Served in Hindi. Tiles: IIP growth 6.7% (Sep 2026), inflation 6.09% (Oct 2026), real GDP growth 7.8% (Q1 FY 2026-27), unemployment 5.0% (Sep 2026). Recent releases: PLFS bulletin Jul to Sep 2026, CPI Oct 2026. |
| Reserve Bank of India, DBIE | data.rbi.org.in | Rates, money, credit, exchange rates, state statistics | Reachable. Ticker: policy repo 5.50%, reverse repo 3.35%, CRR 3.00%, SLR 18.00%, SDF 5.25%, CPI 6.09% (Oct-26), WACR 5.69% (Oct-26), 93.77 INR per USD. |
| Census of India, ORGI | censusindia.gov.in | Census tables, Sample Registration System | Reachable. Census 2027 in progress. House-listing ran 1 Apr to 30 Sep 2026. In some states, self-enumeration runs 16 to 30 Nov 2026 and door-to-door counting 1 Dec 2026 to 4 Jan 2027. Data tools use Census 2011. |
| NITI Aayog, NDAP | ndap.niti.gov.in | Harmonised state and district data | Reachable. Lists datasets by sector and by ministry. |
| Open Government Data | data.gov.in | Ministry dataset catalogue and APIs | Down: "Service Unavailable - Fail to connect". |
| NFHS (IIPS for MoHFW) | rchiips.org/nfhs | Health and nutrition by state and district | Not reachable: HTTPS certificate name error; the HTTP paths tried returned 404. |

## Re-check on 17 Nov 2026

A second check against release documents confirmed CPI 6.09% (Oct 2026, provisional), real GDP growth 7.8% (Q1 FY 2026-27), IIP 6.7% (Sep 2026, quick estimate), unemployment 5.0% (Sep 2026, persons 15+, CWS) and the repo rate of 5.50% (raised on 7 Oct 2026). The CPI base is 2024=100 from January 2026. The RBI target of 4% with a 2% to 6% band runs from 1 Apr 2026 to 31 Mar 2031. The 93.77 INR per USD value from the 12 Nov ticker could not be traced to a dated source. On 17 Nov 2026 the RBI homepage showed the FBIL reference rate as 93.5703.

## Not yet checked

Named from domain knowledge. Check reach, format, update rhythm and licence for each.

- NCRB: crime.
- CEA: electricity.
- CPCB: air quality.
- UDISE+: schools.
- Union Budget and CGA: public finance.
- PPAC: fuel.
- ECI: elections.
- IMD: weather.

## Gaps

1. Census 2011 is the latest full count on the data tools. Show the base year on every Census-based figure.
2. Portals go down. Fetch from publisher release pages. Store each raw file with its URL, fetch time and checksum.
3. Many releases are PDF or Excel. Write one parser per source, with a fixture test.
4. State and UT boundaries change over time. Keep a versioned geography table. Mark values that are not comparable.
5. GDP, CPI and IIP change base years. Store the base year with each series. Mark the join as a method break.
6. Confirm the reuse licence per publisher. Confirm the legal obligations for showing India's boundary before any map ships.
