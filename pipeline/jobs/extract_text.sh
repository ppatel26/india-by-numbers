#!/bin/sh
# Make the text inputs of build_jobs.py (and the literacy table of build_education.py) from the raw PDFs.
# Usage: pipeline/jobs/extract_text.sh [--raw raw/jobs] [--work work/jobs]
set -e
raw=raw/jobs; work=work/jobs
while [ $# -gt 0 ]; do case "$1" in --raw) raw="$2"; shift 2;; --work) work="$2"; shift 2;; *) echo "unknown $1" >&2; exit 2;; esac; done
mkdir -p "$work"
t() { pdftotext -layout "$raw/$1" "$work/$2"; }
t plfs-ar2025-report-rev.pdf report.txt
t plfs-ar2023-24-pressnote.pdf ar2324pn.txt
for q in qb-2019-jul-sep qb-2020-jul-sep qb-2021-apr-jun qbpn-2021-oct-dec qb-2022-jan-mar qb-2023-jan-mar qb-2024-apr-jun qb-2024-oct-dec qb-2025-apr-jun qb-2026-jul-sep; do
  t $q.pdf $q.txt
done
