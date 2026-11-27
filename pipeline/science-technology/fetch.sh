#!/bin/bash
# Download the science and technology topic files listed in pipeline/science-technology/sources.tsv into raw/science-technology/.
# Usage: pipeline/science-technology/fetch.sh [--raw raw/science-technology] [path prefix, for example ipindia/]
# Each file goes through common/fetch.sh, which logs its URL, sha256 and time to <raw>/<dir>/_log.tsv.
set -e
raw=raw/science-technology
if [ "$1" = "--raw" ]; then raw="$2"; shift 2; fi
prefix="${1:-}"
here="$(dirname "$0")"
grep -v '^#' "$here/sources.tsv" | while IFS=$'\t' read -r path url; do
  case "$path" in "$prefix"*) ;; *) continue ;; esac
  dir="$raw/$(dirname "$path")"
  printf '%s ' "$path"
  "$here/../common/fetch.sh" --raw "$dir" "$url" "$(basename "$path")" | tail -1
done
