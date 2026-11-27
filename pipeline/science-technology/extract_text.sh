#!/bin/sh
# Make the text inputs of the science and technology builders from the raw PDFs.
# Usage: pipeline/science-technology/extract_text.sh [--raw raw/science-technology] [--work work/science-technology] [path prefix, for example ipindia/]
# Each PDF gives a layout text file (pdftotext -layout) and a reading-order text file (pdftotext -raw,
# <name>.raw.txt), both with pages split by form feeds. The IP India builder reads the raw text,
# where each table cell is one token in reading order.
set -e
raw=raw/science-technology; work=work/science-technology; prefix=
while [ $# -gt 0 ]; do case "$1" in --raw) raw="$2"; shift 2;; --work) work="$2"; shift 2;; -*) echo "unknown $1" >&2; exit 2;; *) prefix="$1"; shift;; esac; done
grep -v '^#' "$(dirname "$0")/sources.tsv" | cut -f1 | grep '\.pdf$' | while read -r path; do
  case "$path" in "$prefix"*) ;; *) continue ;; esac
  mkdir -p "$work/$(dirname "$path")"
  pdftotext -layout "$raw/$path" "$work/${path%.pdf}.txt" 2>/dev/null
  pdftotext -raw "$raw/$path" "$work/${path%.pdf}.raw.txt" 2>/dev/null
done
