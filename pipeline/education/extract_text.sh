#!/bin/sh
# Make the text inputs of build_education.py and build_cmse.py from the raw PDFs.
# The output name is the PDF name without its content hash, for example
# UDISE+2025_26_Booklet_existing.edd7cd16d934a10377ba.pdf -> UDISE+2025_26_Booklet_existing.txt
# Usage: pipeline/education/extract_text.sh [--raw raw/education] [--work work/education]
set -e
raw=raw/education; work=work/education
while [ $# -gt 0 ]; do case "$1" in --raw) raw="$2"; shift 2;; --work) work="$2"; shift 2;; *) echo "unknown $1" >&2; exit 2;; esac; done
mkdir -p "$work"
for f in "$raw"/UDISE+20*_Booklet*.pdf; do
  [ -f "$f" ] || continue
  b=$(basename "$f" .pdf); b=${b%.*}
  pdftotext -layout "$f" "$work/$b.txt"
done
if [ -f "$raw/udise-plus-2025-26/booklet.pdf" ]; then
  pdftotext -layout "$raw/udise-plus-2025-26/booklet.pdf" "$work/UDISE+2025_26_Booklet_existing.txt"
fi
# NSS reports, read by build_cmse.py: CMS: Education 2025 and CAMS 2022-23.
for d in cmse-2025 cams-2022-23; do
  if [ -f "$raw/$d/report.pdf" ]; then
    mkdir -p "$work/$d"
    pdftotext -layout "$raw/$d/report.pdf" "$work/$d/report.txt"
  fi
done
pdftotext -layout "$raw/aishe-2023-24-final.pdf" "$work/aishe-2023-24-final.txt"
pdftotext -layout "$raw/aishe-ger-timeseries-2011pop.pdf" "$work/aishe-ger-timeseries-2011pop.txt"
