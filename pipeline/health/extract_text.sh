#!/bin/sh
# Make the text inputs of build_health.py from the raw PDFs.
# Usage: pipeline/health/extract_text.sh [--raw raw/health] [--work work/health]
set -e
raw=raw/health; work=work/health
while [ $# -gt 0 ]; do case "$1" in --raw) raw="$2"; shift 2;; --work) work="$2"; shift 2;; *) echo "unknown $1" >&2; exit 2;; esac; done
mkdir -p "$work"
t() { pdftotext -layout "$raw/$1" "$work/$2"; }
t srs-compendium-1971-2013.pdf compendium.txt
for y in 2014 2015 2016 2017 2018 2019 2020 2021 2022 2023 2024; do t srs-bulletin-$y.pdf srs-bulletin-$y.txt; done
t srs-statreport-2024.pdf srs-statreport-2024.txt
t mmr-bulletin-2022-24.pdf mmr-bulletin-2022-24.txt
t alt-2020-24.pdf alt-2020-24.txt
t nfhs6-factsheets.pdf nfhs6.txt
t crs-2024.pdf crs-2024.txt
t srs-cod-2021-23.pdf srs-cod-2021-23.txt
t srs-cod-2022-24.pdf srs-cod-2022-24.txt
