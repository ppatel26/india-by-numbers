#!/bin/bash
# Download the transport topic files listed in pipeline/transport/sources.tsv into raw/transport/.
# Usage: pipeline/transport/fetch.sh [--raw raw/transport] [path prefix, for example nhts/]
# Each file goes through common/fetch.sh, which logs its URL, sha256 and time to <raw>/<dir>/_log.tsv.
set -e
raw=raw/transport
if [ "$1" = "--raw" ]; then raw="$2"; shift 2; fi
prefix="${1:-}"
here="$(dirname "$0")"
grep -v '^#' "$here/sources.tsv" | while IFS=$'\t' read -r path url; do
  case "$path" in "$prefix"*) ;; *) continue ;; esac
  dir="$raw/$(dirname "$path")"
  printf '%s ' "$path"
  "$here/../common/fetch.sh" --raw "$dir" "$url" "$(basename "$path")" | tail -1
done
