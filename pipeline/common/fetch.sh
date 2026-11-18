#!/bin/bash
# Download one publisher file and log its URL, sha256 and fetch time.
# Usage: pipeline/common/fetch.sh --raw raw/<topic> <url> <outname>
# Saves to <raw>/<outname> and appends a line to <raw>/_log.tsv. Prints the sha256.
set -e
if [ "$1" != "--raw" ] || [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ]; then
  echo "usage: $0 --raw <raw-dir> <url> <outname>" >&2; exit 2
fi
raw="$2"; url="$3"; name="$4"
mkdir -p "$raw"
out="$raw/$name"
curl -sS -L -m 900 -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36" -o "$out" -w "%{http_code} %{size_download}\n" "$url"
h=$(shasum -a 256 "$out" | cut -d' ' -f1)
printf "%s\t%s\t%s\t%s\n" "$name" "$url" "$h" "$(date -u +%Y-%m-%dT%H:%MZ)" >> "$raw/_log.tsv"
echo "$h"
