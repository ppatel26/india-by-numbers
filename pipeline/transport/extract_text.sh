#!/bin/sh
# Make the text inputs of the transport builders from the raw PDFs.
# Usage: pipeline/transport/extract_text.sh [--raw raw/transport] [--work work/transport]
# Each PDF gives a layout text file (pdftotext -layout, pages split by form feeds) and a word-box
# file (pdftotext -bbox). The MoRTH builder reads the word boxes, so a blank cell stays blank.
set -e
raw=raw/transport; work=work/transport
while [ $# -gt 0 ]; do case "$1" in --raw) raw="$2"; shift 2;; --work) work="$2"; shift 2;; *) echo "unknown $1" >&2; exit 2;; esac; done
grep -v '^#' "$(dirname "$0")/sources.tsv" | cut -f1 | grep '\.pdf$' | while read -r path; do
  mkdir -p "$work/$(dirname "$path")"
  pdftotext -layout "$raw/$path" "$work/${path%.pdf}.txt" 2>/dev/null
  pdftotext -bbox "$raw/$path" "$work/${path%.pdf}.bbox.html" 2>/dev/null
done
