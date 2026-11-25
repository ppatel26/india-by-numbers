#!/bin/bash
# Download the Time Use Survey (TUS) files that build_tus.py reads, and extract the report text.
# Usage: pipeline/jobs/fetch_tus.sh [--raw raw/jobs] [--work work/jobs]
# Writes the two MoSPI reports to <raw>/tus-2019/ and <raw>/tus-2024/ (with _log.tsv), three
# eSankhyiki API queries to <raw>/tus-api/, and the text of each report to <work>/tus-<year>/report.txt.
set -e
raw=raw/jobs; work=work/jobs
while [ $# -gt 0 ]; do case "$1" in --raw) raw="$2"; shift 2;; --work) work="$2"; shift 2;; *) echo "unknown $1" >&2; exit 2;; esac; done
here="$(dirname "$0")"

"$here/../common/fetch.sh" --raw "$raw/tus-2024" \
  "https://www.mospi.gov.in/sites/default/files/publication_reports/TUS_Report_2024_28.03.2025F.pdf" report.pdf
"$here/../common/fetch.sh" --raw "$raw/tus-2019" \
  "https://www.mospi.gov.in/sites/default/files/publication_reports/Report_TUS_2019_0.pdf" report.pdf

# Indicator 6: participation rate. 7: minutes per participant. 8: minutes per person.
# All three count every activity in a time slot ("irrespective of major activity").
# ICATUS major divisions: 33 employment and related activities, 99 unpaid domestic services,
# 128 unpaid caregiving services. Sectors rural, urban, combined; male, female, person; ages 15-59 and 6+.
for i in 6 7 8; do
  python3 -I "$here/../common/fetch_api.py" --raw "$raw/tus-api" \
    "https://api.mospi.gov.in/api/tus/getTusRecords?indicator_code=$i&year=2019,2024&sector_code=1,2,3&gender_code=1,2,4&age_group_code=3,5&icatus_activity_code=33,99,128&Format=JSON" \
    "tus-ind$i" 200
done
shasum -a 256 "$raw"/tus-api/*.p1.json

for y in 2019 2024; do
  mkdir -p "$work/tus-$y"
  pdftotext -layout "$raw/tus-$y/report.pdf" "$work/tus-$y/report.txt"
done
