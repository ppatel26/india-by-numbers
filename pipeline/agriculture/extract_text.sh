#!/bin/sh
# Make the text inputs of build_nss77.py and build_asg.py from the raw PDFs (pdftotext -layout).
# Usage: pipeline/agriculture/extract_text.sh [--raw raw/agriculture] [--work work/agriculture]
set -e
raw=raw/agriculture; work=work/agriculture
while [ $# -gt 0 ]; do case "$1" in --raw) raw="$2"; shift 2;; --work) work="$2"; shift 2;; *) echo "unknown $1" >&2; exit 2;; esac; done
for f in "$raw"/*/*.pdf; do
  [ -f "$f" ] || continue
  d=$(basename "$(dirname "$f")"); b=$(basename "$f" .pdf)
  mkdir -p "$work/$d"
  pdftotext -layout "$f" "$work/$d/$b.txt"
done
