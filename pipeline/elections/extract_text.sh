#!/bin/sh
# Make the inputs of build_elections.py, build_party.py and build_ae.py from the raw downloads:
# report 33 PDF -> text -> d33.json, and the results pages decompressed where they were saved gzipped.
# Usage: pipeline/elections/extract_text.sh [--raw raw/elections] [--work work/elections]
set -e
raw=raw/elections; work=work/elections
while [ $# -gt 0 ]; do case "$1" in --raw) raw="$2"; shift 2;; --work) work="$2"; shift 2;; *) echo "unknown $1" >&2; exit 2;; esac; done
here=$(dirname "$0")
mkdir -p "$work"
pdftotext -layout "$raw/eci_ge2024_33_constituency_detailed.pdf" "$work/d33.txt"
python3 -I "$here/parse_d33.py" "$work/d33.txt" "$work/d33.json"
python3 -I "$here/../common/gunzip.py" "$raw/eci_results_ac_nov2025_bihar_index.htm" "$work/bihar_index.htm"
for slug in assam kerala puducherry tamil-nadu west-bengal; do
  python3 -I "$here/../common/gunzip.py" "$raw/eci_results_ac_may2026_$slug.htm" "$work/${slug}_2026.htm"
done
