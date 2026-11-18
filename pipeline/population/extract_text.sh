#!/bin/sh
# Make the text inputs of build_population.py from the raw PDFs.
# Usage: pipeline/population/extract_text.sh [--raw raw/population] [--work work/population]
set -e
raw=raw/population; work=work/population
while [ $# -gt 0 ]; do case "$1" in --raw) raw="$2"; shift 2;; --work) work="$2"; shift 2;; *) echo "unknown $1" >&2; exit 2;; esac; done
mkdir -p "$work"
pdftotext -layout "$raw/srs/SRS_STAT_2024.pdf" "$work/srs2024.txt"
pdftotext -layout "$raw/srs/SRS_Bulletin_2024_Vol_59_No_1.pdf" "$work/srsb2024.txt"
pdftotext -layout "$raw/proj/proj_mohfw_2025.pdf" "$work/proj.txt"
python3 -I "$(dirname "$0")/parse_proj.py" "$work/proj.txt" "$work/proj_table8.csv"
