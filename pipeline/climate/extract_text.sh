#!/bin/sh
# Make the text inputs of parse_cea.py and build_mnre.py from the raw PDFs.
# Usage: pipeline/climate/extract_text.sh [--raw raw/climate] [--work work/climate]
set -e
raw=raw/climate; work=work/climate
while [ $# -gt 0 ]; do case "$1" in --raw) raw="$2"; shift 2;; --work) work="$2"; shift 2;; *) echo "unknown $1" >&2; exit 2;; esac; done
mkdir -p "$work"
for f in "$raw"/cea/ic_*.pdf; do pdftotext -layout "$f" "$work/$(basename "$f" .pdf).txt"; done
pdftotext -bbox "$raw/mnre/mnre_state_re_2026-10-31.pdf" "$work/mnre_bbox.html"
