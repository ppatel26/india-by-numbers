#!/bin/bash
# Download every raw file the international CSVs read, with pipeline/common/fetch.sh.
# Run from the repository root:
#   pipeline/international/fetch.sh [--raw raw/international]
# Each fetch appends file, URL, sha256 and UTC time to <raw>/_log.tsv.
set -e
raw="raw/international"
if [ "$1" = "--raw" ]; then raw="$2"; fi
fetch="pipeline/common/fetch.sh"
mkdir -p "$raw/wdi" "$raw/wpp-2024" "$raw/ilostat" "$raw/undesa"

# World Bank, World Development Indicators (WDI, source 2). The source record gives
# "lastupdated", the release date. For each indicator: the data for the panel, the indicator
# record and the series metadata (licence and source).
api="https://api.worldbank.org/v2"
# Rule R6 (research/source-discovery.md): the default panel. Never change it to change India's rank.
countries="IND;BGD;PAK;NPL;LKA;CHN;IDN;WLD"
indicators="NY.GDP.PCAP.PP.KD SP.DYN.LE00.IN SP.DYN.TFRT.IN EN.GHG.CO2.PC.CE.AR5 SL.TLF.CACT.FE.ZS"
"$fetch" --raw "$raw" "$api/sources/2?format=json" "wdi/source.json"
for i in $indicators; do
  "$fetch" --raw "$raw" "$api/country/$countries/indicator/$i?source=2&format=json&per_page=2000" "wdi/$i.data.json"
  "$fetch" --raw "$raw" "$api/indicator/$i?format=json" "wdi/$i.indicator.json"
  "$fetch" --raw "$raw" "$api/sources/2/series/$i/metadata?format=json" "wdi/$i.metadata.json"
done
# The CO2 series WDI used before: now in the WDI Database Archives (source 57).
"$fetch" --raw "$raw" "$api/indicator/EN.ATM.CO2E.PC?format=json" "wdi/EN.ATM.CO2E.PC.indicator.json"

# UN WPP 2024, to confirm which revision WDI carries for life expectancy and fertility.
"$fetch" --raw "$raw" "https://population.un.org/wpp/assets/Excel%20Files/1_Indicator%20(Standard)/CSV_FILES/WPP2024_Demographic_Indicators_Medium.csv.gz" "wpp-2024/WPP2024_Demographic_Indicators_Medium.csv.gz"

# ILOSTAT, the same ILO modelled series for India, to see how far its years run.
"$fetch" --raw "$raw" "https://rplumber.ilo.org/data/indicator/?id=EAP_2WAP_SEX_AGE_RT_A&ref_area=IND&sex=SEX_F&classif1=AGE_YTHADULT_YGE15&timefrom=2020&format=.csv" "ilostat/EAP_2WAP_SEX_AGE_RT_A.IND.F.15plus.csv"

# UN DESA Population Division, International Migrant Stock 2024.
desa="https://www.un.org/development/desa/pd/sites/www.un.org.development.desa.pd/files"
"$fetch" --raw "$raw" "https://www.un.org/development/desa/pd/content/international-migrant-stock" "undesa/page.html"
"$fetch" --raw "$raw" "$desa/undesa_pd_2024_ims_stock_by_sex_and_origin.xlsx" "undesa/undesa_pd_2024_ims_stock_by_sex_and_origin.xlsx"
"$fetch" --raw "$raw" "$desa/undesa_pd_2024_ims_stock_by_sex_destination_and_origin.xlsx" "undesa/undesa_pd_2024_ims_stock_by_sex_destination_and_origin.xlsx"
