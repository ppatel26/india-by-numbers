# Data

Each topic folder has its own README. It names the publisher, the release, the release date, the
link, the date we read it and the sha256 of each file. This README covers the three shared files
in this folder. We typed these three files by hand. No publisher file was downloaded for them, so
they have no checksum.

## geography.csv

The 28 states and 8 union territories, with the slug the site uses for each one.

- Source: the First Schedule of the Constitution of India, as changed by the Jammu and Kashmir
  Reorganisation Act, 2019 (Ladakh became a UT) and the Dadra and Nagar Haveli and Daman and Diu
  (Merger of Union Territories) Act, 2019 (in force from 26 January 2020).
- Names: the short English names that the government and the statistical offices use.
- Checked: 18 Nov 2026.
- Boundary changes and how each data set handles them: the States and UTs page, "Which states does
  each data set cover?".

## state-languages.csv

The official languages of each state and UT, the language and script for its name on the site, and
its Hindi name.

- Built by `pipeline/common/state_languages.py`. The script holds the values. It downloads nothing.
- Source: each row has a `source_url`, and its `note` names the law or the report. The main sources
  are the 52nd report of the Commissioner for Linguistic Minorities, the state official language
  acts, and the state government websites.
- The Hindi names are typed by hand. A native speaker has not yet reviewed them.
- Checked: 18 Nov 2026.

## release-calendar.csv

The dates of the next releases, for the Releases page.

- Each row has a `source_url`: the publisher's own calendar or announcement page.
- `status` says how sure the date is:
  - `released`: the release is out.
  - `announced`: the publisher announced the date. MoSPI dates come from its advance release
    calendar for 2026-27.
  - `estimated`: our estimate from the publisher's usual cadence. The publisher did not announce it.
- Checked: 18 Nov 2026.
