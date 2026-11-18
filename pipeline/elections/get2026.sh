#!/bin/bash
# Fetch the archived ECI party-wise results pages of the May 2026 assembly elections (Wayback Machine copies)
# and decompress them for build_ae.py.
# Usage: pipeline/elections/get2026.sh [--raw raw/elections] [--work work/elections]
set -e
raw=raw/elections; work=work/elections
while [ $# -gt 0 ]; do case "$1" in --raw) raw="$2"; shift 2;; --work) work="$2"; shift 2;; *) echo "unknown $1" >&2; exit 2;; esac; done
here=$(dirname "$0")
mkdir -p "$work"
while read ts code slug; do
  "$here/../common/fetch.sh" --raw "$raw" "http://web.archive.org/web/${ts}id_/https://results.eci.gov.in/ResultAcGenMay2026/partywiseresult-$code.htm" eci_results_ac_may2026_$slug.htm >/dev/null
  python3 -I "$here/../common/gunzip.py" "$raw/eci_results_ac_may2026_$slug.htm" "$work/${slug}_2026.htm"
done <<LIST
20260512025830 S03 assam
20260518035243 S11 kerala
20260816115156 S22 tamil-nadu
20260710112353 S25 west-bengal
20260512031116 U07 puducherry
LIST
