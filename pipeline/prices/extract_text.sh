#!/bin/sh
# Turn each CFPI press-release PDF into layout text for cfpi_2026.py.
# Usage: pipeline/prices/extract_text.sh [--raw raw/prices/cfpi]
# For every <raw>/cfpi-<mon>-XXXXXXXX/body that is a PDF, writes <raw>/cfpi-<mon>-XXXXXXXX.txt.
# The May release is a PIB web page, so it has no text file; cfpi_2026.py reads its HTML directly.
set -e
raw=raw/prices/cfpi
[ "$1" = "--raw" ] && raw="$2"
for d in "$raw"/cfpi-*/; do
  d=${d%/}
  if [ "$(head -c 4 "$d/body")" = "%PDF" ]; then
    pdftotext -layout "$d/body" "$d.txt"
  fi
done
