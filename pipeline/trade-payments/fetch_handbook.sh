#!/bin/bash
# Download the HTML pages of the RBI Handbook of Statistics on the Indian Economy 2025-26
# (released 31 Jul 2026) that the trade-payments CSVs read, the Handbook list page, and the RBI
# website policy page that states the reuse terms.
# Usage: pipeline/trade-payments/fetch_handbook.sh [--raw raw/trade-payments]
# Each table page is https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=<23825 + table number>.
# The list page links each table to its XLSX on rbidocs.rbi.org.in. That server answers scripts with
# a JavaScript bot check, so this script reads the HTML tables, which hold the same figures.
set -e
raw="raw/trade-payments"
if [ "$1" = "--raw" ]; then raw="$2"; fi
here="$(cd "$(dirname "$0")/.." && pwd)"
fetch="$here/common/fetch.sh"
"$fetch" --raw "$raw" "https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=Handbook%20of%20Statistics%20on%20Indian%20Economy" handbook/list.html
# 58: payment system indicators (annual). 111 to 131: foreign trade and balance of payments.
# 143: foreign investment. 144: foreign exchange reserves. 241: balance of payments indicators.
for t in 58 $(seq 111 131) 143 144 241; do
  "$fetch" --raw "$raw" "https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=$((23825 + t))" "handbook/table-$t.html"
  sleep 1
done
"$fetch" --raw "$raw" "https://www.rbi.org.in/Scripts/Disclaimer.aspx" pages/disclaimer.html
