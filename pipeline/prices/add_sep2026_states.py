"""Append September 2026 state CPI rows (base 2024=100) to research/data/prices/cpi-inflation-by-state.csv.
Run after build_prices_economy.py:
  python3 -I pipeline/prices/add_sep2026_states.py --raw raw/prices --out research/data/prices
Reads <raw>/api/cpi24_general_allstates.all.json as data only. Idempotent: drops existing 2026-09 rows first."""
import argparse, csv, json, os, re, sys
ap = argparse.ArgumentParser()
ap.add_argument("--raw", default="raw/prices")
ap.add_argument("--out", default="research/data/prices")
ap.add_argument("--geo", default="research/data/geography.csv")
args = ap.parse_args()
RAW = os.path.join(args.raw, "api/cpi24_general_allstates.all.json")
OUT = os.path.join(args.out, "cpi-inflation-by-state.csv")
geo = list(csv.DictReader(open(args.geo)))
N2S = {g["name"].lower(): g["slug"] for g in geo}
AL = {"all india": "india", "andaman and nicobar islands": "andaman-nicobar", "andaman & nicobar islands": "andaman-nicobar",
      "jammu and kashmir": "jammu-kashmir", "jammu & kashmir": "jammu-kashmir", "nct of delhi": "delhi",
      "the dadra and nagar haveli and daman and diu": "dnh-dd"}
def slug(n):
    n = re.sub(r"\s+", " ", n.strip()).lower()
    return AL.get(n) or N2S[n]
rows = json.load(open(RAW))["rows"]
keep = [r for r in csv.DictReader(open(OUT)) if r["period"] != "2026-09"]
hdr = ["geography", "period", "value", "unit", "sector", "base", "index", "status"]
new, seen = [], set()
for r in rows:
    if r["year"] == "2026" and r["month"] == "September":
        k = (slug(r["state"]), r["sector"].lower())
        assert k not in seen, k; seen.add(k)
        new.append({"geography": k[0], "period": "2026-09", "value": r["inflation"] or "", "unit": "percent",
                    "sector": k[1], "base": "2024=100", "index": r["index"] or "", "status": "final"})
new.sort(key=lambda r: (r["sector"], r["geography"] != "india", r["geography"]))
with open(OUT, "w", newline="") as f:
    w = csv.DictWriter(f, hdr); w.writeheader(); w.writerows(keep + new)
comb = {r["geography"] for r in new if r["sector"] == "combined"}
print("added", len(new), "rows; combined geographies", len(comb), "missing", sorted(set(N2S.values()) - comb))
print("empty values", [(r["geography"], r["sector"]) for r in new if not r["value"]])
