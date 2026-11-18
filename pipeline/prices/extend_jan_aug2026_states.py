"""Append Jan-Aug 2026 state CPI (base 2024=100) rows to research/data/prices/cpi-inflation-by-state.csv.
Run after add_sep2026_states.py. Without --write it only checks and prints.
  python3 -I pipeline/prices/extend_jan_aug2026_states.py --raw raw/prices --out research/data/prices --write
Reads <raw>/api/cpi24_general_allstates.all.json as data only. Not idempotent: run it once on a CSV without Jan-Aug rows."""
import argparse, json, os, sys, csv, re
ap = argparse.ArgumentParser()
ap.add_argument("--raw", default="raw/prices")
ap.add_argument("--out", default="research/data/prices")
ap.add_argument("--write", action="store_true", help="append the rows; otherwise only check")
args = ap.parse_args()
raw = os.path.join(args.raw, "api/cpi24_general_allstates.all.json")
path = os.path.join(args.out, "cpi-inflation-by-state.csv")
write = args.write
rows = json.load(open(raw))["rows"]
MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]
SPECIAL = {"All India": "india", "Andaman And Nicobar Islands": "andaman-nicobar", "NCT of Delhi": "delhi",
           "The Dadra And Nagar Haveli And Daman And Diu": "dnh-dd", "Jammu And Kashmir": "jammu-kashmir"}
def slug(s): return SPECIAL.get(s) or re.sub(r"[^a-z]+", "-", s.lower()).strip("-")
with open(path, newline="") as f:
    existing = list(csv.DictReader(f))
header = list(existing[0].keys())
slugs = {r["geography"] for r in existing}
have = {(r["geography"], r["period"], r["sector"]) for r in existing}
# verify Sep and Oct match existing rows exactly
ex = {(r["geography"], r["period"], r["sector"]): r for r in existing}
mism = 0; matched = 0
for r in rows:
    if r["year"] != "2026": continue
    m = MONTHS.index(r["month"]) + 1
    key = (slug(r["state"]), f"2026-{m:02d}", r["sector"].lower())
    if key[0] not in slugs: print("UNKNOWN SLUG", r["state"], key[0]); continue
    if key in ex:
        e = ex[key]; matched += 1
        if e["value"] != r["inflation"] or e["index"] != r["index"]: mism += 1; print("MISMATCH", key, e["value"], r["inflation"], e["index"], r["index"])
print("checked Sep/Oct rows", matched, "mismatches", mism)
new = []
for r in rows:
    if r["year"] != "2026": continue
    m = MONTHS.index(r["month"]) + 1
    if m > 8: continue
    key = (slug(r["state"]), f"2026-{m:02d}", r["sector"].lower())
    assert key not in have
    if r["inflation"] in (None, ""): print("NULL", key); continue
    new.append({"geography": key[0], "period": key[1], "value": r["inflation"], "unit": "percent",
                "sector": key[2], "base": "2024=100", "index": r["index"], "status": "final"})
order = {"combined": 0, "rural": 1, "urban": 2}
new.sort(key=lambda x: (-int(x["period"][5:]), order[x["sector"]], x["geography"] != "india", x["geography"]))
print("new rows", len(new), "periods", sorted({n["period"] for n in new}))
for p in ["2026-01", "2026-08"]:
    for n in new:
        if n["period"] == p and n["sector"] == "combined" and n["geography"] in ("india", "tamil-nadu"): print(n)
if write:
    with open(path, "a", newline="") as f:
        w = csv.DictWriter(f, fieldnames=header, lineterminator="\r\n")
        for n in new: w.writerow(n)
    print("appended")
