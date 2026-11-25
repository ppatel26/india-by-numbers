#!/bin/sh
# Make the text inputs of the crime builders from the raw PDFs: one .txt per PDF, same path.
# Usage: pipeline/crime/extract_text.sh [--raw raw/crime] [--work work/crime]
# Pages stay separated by form feeds, so a builder can address a table by its PDF page.
set -e
raw=raw/crime; work=work/crime
while [ $# -gt 0 ]; do case "$1" in --raw) raw="$2"; shift 2;; --work) work="$2"; shift 2;; *) echo "unknown $1" >&2; exit 2;; esac; done
grep -v '^#' "$(dirname "$0")/sources.tsv" | cut -f1 | while read -r path; do
  mkdir -p "$work/$(dirname "$path")"
  pdftotext -layout "$raw/$path" "$work/${path%.pdf}.txt" 2>/dev/null
done
