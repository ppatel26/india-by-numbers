"""Build tidy CSVs for research/data/prices and research/data/economy from the raw downloads.
Run: python3 -I pipeline/prices/build_prices_economy.py --raw-prices raw/prices --raw-economy raw/economy \
       --out-prices research/data/prices --out-economy research/data/economy
Reads JSON from the MoSPI API, Excel from the RBI Handbook, and HTML from the RBI reference-rate archive.
Executes nothing from the downloads."""
import argparse, csv, glob, json, os, re, subprocess, sys, html
import openpyxl

ap = argparse.ArgumentParser()
ap.add_argument("--raw-prices", default="raw/prices")
ap.add_argument("--raw-economy", default="raw/economy")
ap.add_argument("--out-prices", default="research/data/prices")
ap.add_argument("--out-economy", default="research/data/economy")
ap.add_argument("--geo", default="research/data/geography.csv")
args = ap.parse_args()
RAWP, RAWE = args.raw_prices, args.raw_economy
OUTP, OUTE = args.out_prices, args.out_economy
os.makedirs(OUTP, exist_ok=True); os.makedirs(OUTE, exist_ok=True)

MONTHS = {m: i for i, m in enumerate(["January", "February", "March", "April", "May", "June", "July",
                                       "August", "September", "October", "November", "December"], 1)}

# ---------- geography ----------
geo = list(csv.DictReader(open(args.geo)))
NAME2SLUG = {g["name"].lower(): g["slug"] for g in geo}
ALIASES = {
    "all india": "india", "andaman and nicobar islands": "andaman-nicobar", "andaman & nicobar islands": "andaman-nicobar",
    "jammu and kashmir": "jammu-kashmir", "jammu & kashmir": "jammu-kashmir", "nct of delhi": "delhi", "delhi": "delhi",
    "the dadra and nagar haveli and daman and diu": "dnh-dd",
}
def slug(name):
    n = re.sub(r"\s+", " ", name.strip()).lower()
    if n in ALIASES: return ALIASES[n]
    if n in NAME2SLUG: return NAME2SLUG[n]
    raise KeyError(name)
GEONAME = {g["slug"]: g["name"] for g in geo}; GEONAME["india"] = "India"

def write(path, header, rows):
    with open(path, "w", newline="") as f:
        w = csv.writer(f); w.writerow(header); w.writerows(rows)
    print(f"wrote {path} rows={len(rows)}")

def load(path): return json.load(open(path))["rows"]

# =====================================================================
# PRICES
# =====================================================================
c12 = load(f"{RAWP}/api/cpi12_allindia.all.json")
c12b = load(f"{RAWP}/api/cpi12back_allindia.all.json")
c24 = load(f"{RAWP}/api/cpi24_general_allstates.all.json")

def ym(y, m): return f"{int(y):04d}-{MONTHS[m]:02d}"

# P1 + P6: all-India general inflation, monthly, rural/urban/combined
gen = {}
for r in c12b:
    if r["subgroup"] == "General-Overall" and r["inflation"] is not None:
        gen[(ym(r["year"], r["month"]), r["sector"])] = (r["inflation"], r["index"], "2012=100", "back series", r["status"])
for r in c12:
    if r["subgroup"] == "General-Overall" and r["inflation"] is not None:
        gen[(ym(r["year"], r["month"]), r["sector"])] = (r["inflation"], r["index"], "2012=100", "current series", r["status"])
for r in c24:
    if r["state"] == "All India" and r["year"] == "2026" and r["inflation"] is not None:
        st = "provisional" if r["month"] == "October" else "final"
        gen[(ym(r["year"], r["month"]), r["sector"])] = (r["inflation"], r["index"], "2024=100", "current series", st)

def p_rows(sectors, start="2012-01"):
    rows = []
    periods = sorted({k[0] for k in gen} | {"2020-04", "2020-05"})
    for p in periods:
        if p < start: continue
        for s in sectors:
            v = gen.get((p, s))
            if not v and p in ("2020-04", "2020-05"):
                rows.append(["india", p, "", "percent", s.lower(), "2012=100", "current series", "", "F*",
                             "no inflation rate in source; index carries status flag F* (COVID-19 lockdown month)"])
            if v:
                note = ""
                if v[4] in ("F*", "F+"): note = "status flag " + v[4] + " in source"
                if p == "2026-01": note = "first month on base 2024=100; method break"
                rows.append(["india", p, v[0], "percent", s.lower(), v[2], v[3], v[1], v[4], note])
    return rows
hdr_cpi = ["geography", "period", "value", "unit", "sector", "base", "series", "index", "status", "note"]
p1 = p_rows(["Combined"])
# make the 2013 gap explicit
have = {r[1] for r in p1}
for m in range(6, 13):
    p = f"2013-{m:02d}"
    if p not in have:
        p1.append(["india", p, "", "percent", "combined", "2012=100", "", "", "", "not published in API: back series ends May 2013, current series inflation starts Jan 2014"])
p1.sort(key=lambda r: r[1])
write(f"{OUTP}/cpi-inflation-monthly.csv", hdr_cpi, p1)
write(f"{OUTP}/cpi-inflation-rural-urban.csv", hdr_cpi, p_rows(["Rural", "Urban", "Combined"], "2014-01"))

write(f"{OUTP}/inflation-target.csv",
      ["period_start", "period_end", "target", "lower_tolerance", "upper_tolerance", "unit", "measure"],
      [["2016-08-05", "2021-03-31", 4, 2, 6, "percent", "CPI Combined, year on year"],
       ["2021-04-01", "2026-03-31", 4, 2, 6, "percent", "CPI Combined, year on year"],
       ["2026-04-01", "2031-03-31", 4, 2, 6, "percent", "CPI Combined, year on year"]])

# P2: by state, Oct 2026
rows = []
for r in c24:
    if r["year"] == "2026" and r["month"] == "October":
        rows.append([slug(r["state"]), "2026-10", r["inflation"] or "", "percent", r["sector"].lower(), "2024=100", r["index"] or "", "provisional"])
rows.sort(key=lambda r: (r[4], r[0] != "india", r[0]))
write(f"{OUTP}/cpi-inflation-by-state.csv", ["geography", "period", "value", "unit", "sector", "base", "index", "status"], rows)
missing = sorted(set(GEONAME) - {r[0] for r in rows if r[4] == "combined"})
print("P2 missing geographies:", missing)

# P3/P4: divisions, 2026, from per-month page files
WEIGHTS = {  # Annexure I, CPI press release for October 2026 (combined weights, base 2024)
    "Food and beverages": ("01", "36.75"), "Paan, tobacco and intoxicants": ("02", "2.99"),
    "Clothing and footwear": ("03", "6.38"), "Housing, water, electricity, gas and other fuels": ("04", "17.66"),
    "Furnishings, household equipment and routine household maintenance": ("05", "4.47"), "Health": ("06", "6.10"),
    "Transport": ("07", "8.80"), "Information and communication": ("08", "3.61"),
    "Recreation, sport and culture": ("09", "1.52"), "Education services": ("10", "3.33"),
    "Restaurants and accommodation services": ("11", "3.35"),
    "Personal care, social protection and miscellaneous goods and services": ("13", "5.04"),
    "CPI (General)": ("00", "100.00")}
div = []
for f in sorted(glob.glob(f"{RAWP}/api/cpi24_groups_2026_m*_s*.json")):
    for r in json.load(open(f))["data"]:
        if r["group"] is None:
            code, w = WEIGHTS[r["division"]]
            st = "provisional" if r["month"] == "October" else "final"
            div.append(["india", ym(r["year"], r["month"]), r["inflation"], "percent", r["sector"].lower(), code, r["division"], w, r["index"], "2024=100", st])
div.sort(key=lambda r: (r[1], r[4], r[5]))
hdr_div = ["geography", "period", "value", "unit", "sector", "division_code", "division", "weight_combined", "index", "base", "status"]
write(f"{OUTP}/cpi-inflation-by-division-2026.csv", hdr_div, div)
write(f"{OUTP}/cpi-inflation-by-division-latest.csv", hdr_div, [r for r in div if r[1] == "2026-10"])

# P5: groups on base 2012, 2014-2025, combined
GROUPS = ["General-Overall", "Food and Beverages-Overall", "Consumer Food Price-Overall", "Pan, Tobacco and Intoxicants-Overall",
          "Clothing and Footwear-Overall", "Housing-Overall", "Fuel and Light-Overall", "Miscellaneous-Overall"]
rows = []
for r in c12:
    if r["subgroup"] in GROUPS and r["inflation"] is not None and r["sector"] == "Combined":
        rows.append(["india", ym(r["year"], r["month"]), r["inflation"], "percent", "combined", r["subgroup"].replace("-Overall", ""), r["index"], "2012=100", r["status"]])
rows = sorted({tuple(x) for x in rows}, key=lambda r: (r[5] != "General", r[5], r[1]))
write(f"{OUTP}/cpi-inflation-by-group-2012-base.csv", ["geography", "period", "value", "unit", "sector", "group", "index", "base", "status"], rows)

# Add verified CPI history to P5 and P6. Build P7 from the RBI's HTML tables.
subprocess.run([sys.executable, "-I", "pipeline/prices/extend_cpi12.py",
                "--raw", f"{RAWP}/cpi-history", "--out", OUTP], check=True)
subprocess.run([sys.executable, "-I", "pipeline/prices/build_repo_rate.py",
                "--raw", f"{RAWP}/repo", "--out", f"{OUTP}/repo-rate.csv"], check=True)

# P8: annual CPI inflation long run (Handbook Table 236)
wb = openpyxl.load_workbook(glob.glob(f"{RAWP}/rbi/236T_*.XLSX")[0], data_only=True)
ws = wb.worksheets[0]
rows, base_iw, base_c = [], "", ""
for row in ws.iter_rows(min_row=7, values_only=True):
    lab = row[1]
    if isinstance(lab, str) and lab.startswith("(Base"):
        m = re.search(r"Base\s*:?\s*([0-9\-]+)\s*=\s*100", lab)
        if "CPI - IW" in lab or "CPI- IW" in lab or "IW" in lab: base_iw = m.group(1) + "=100" if m else base_iw
        if "CPI All" in lab or "CPI (Rural" in lab or "All India" in lab: base_c = m.group(1) + "=100" if m else base_c
        continue
    if not (isinstance(lab, str) and re.match(r"\d{4}-\d{2}", lab)): continue
    fy, flag = lab[:7], lab[7:]
    iw, comb = row[2], row[7]
    note = {"*": "2012=100, April to December 2025 only", "#": "2024=100, January to March 2026 only"}.get(flag, "")
    if isinstance(iw, (int, float)) and flag in ("", "#"):
        rows.append(["india", fy, f"{iw:g}", "percent", "CPI-IW (industrial workers)", "Labour Bureau", ""])
    cv = comb
    if isinstance(cv, str) and cv.strip(" *#") not in ("", "-"):
        cv = float(cv.strip(" *#"))
    if isinstance(cv, (int, float)):
        rows.append(["india", fy, f"{cv:g}", "percent", "CPI Combined (all India)", "NSO, MoSPI", note])
write(f"{OUTP}/cpi-annual-inflation-long-run.csv", ["geography", "period", "value", "unit", "series", "publisher", "note"], rows)

# =====================================================================
# ECONOMY
# =====================================================================
REV_ORDER = ["First Advance Estimates", "Second Advance Estimates", "Provisional Estimates", "First Revised Estimates",
             "Second Revised Estimates", "Third Revised Estimates", "Final Estimates", "Additional Revision"]
def latest(rows, key):
    best = {}
    for r in rows:
        k = key(r); rk = REV_ORDER.index(r["revision"]) if r["revision"] in REV_ORDER else -1
        if k not in best or rk > best[k][0]: best[k] = (rk, r)
    return {k: v[1] for k, v in best.items()}

# E1 quarterly GDP growth
rows = []
for r in load(f"{RAWE}/api/nas1112_q_g22.all.json"):
    if r["constant_price"]:
        rows.append(["india", f"{r['year']} {r['quarter']}", r["constant_price"], "percent", "real (constant prices)", "2011-12", r["current_price"] or ""])
for r in load(f"{RAWE}/api/nas2223_q_g22.all.json"):
    rows.append(["india", f"{r['year']} {r['quarter']}", r["constant_price"], "percent", "real (constant prices)", "2022-23", r["current_price"] or ""])
rows.sort(key=lambda r: (r[5], r[1]))
write(f"{OUTE}/gdp-growth-quarterly.csv", ["geography", "period", "value", "unit", "measure", "base", "nominal_growth"], rows)

# E2 annual GDP growth, long run
back = {r["year"].replace("1999-2000", "1999-00"): float(r["constant_price"]) for r in load(f"{RAWE}/api/nas1112back_a_gdp.all.json")}
cur = {k[0]: r for k, r in latest(load(f"{RAWE}/api/nas1112_a_gdp.all.json"), lambda r: (r["year"],)).items()}
levels = dict(back)
for y, r in cur.items():
    if y <= "2022-23": levels[y] = float(r["constant_price"])
ys = sorted(levels)
rows = []
for a, b in zip(ys, ys[1:]):
    g = (levels[b] / levels[a] - 1) * 100
    src = "back series" if b <= "2011-12" else f"current series ({cur[b]['revision']})"
    rows.append(["india", b, f"{g:.2f}", "percent", "2011-12", "derived from constant-price GDP levels", src])
for r in load(f"{RAWE}/api/nas2223_a_g22.all.json"):
    rows.append(["india", r["year"], r["constant_price"], "percent", "2022-23", "published growth rate", r["revision"]])
rows.sort(key=lambda r: (r[1], r[4]))
write(f"{OUTE}/gdp-growth-annual.csv", ["geography", "period", "value", "unit", "base", "method", "estimate"], rows)
print("check vs RBI HBIE T227 (2019-20 3.87, 2020-21 -5.78, 2021-22 9.69, 2022-23 7.61):",
      [(r[1], r[2]) for r in rows if r[1] in ("2019-20", "2020-21", "2021-22", "2022-23")])

# E3 GVA shares by broad sector, current prices
PRIM = ["Agriculture, Livestock, Forestry and Fishing", "Mining and Quarrying"]
SEC = ["Manufacturing", "Electricity, Gas, Water Supply & Other Utility Services", "Construction"]
def shares(rows_, base, label, only_years=None):
    by = {}
    for r in rows_:
        if r["subindustry"] or r.get("institutional_sector"): continue
        if r["industry"] in PRIM + SEC + ["Total Gross Value Added"] and r["current_price"]:
            by.setdefault(r["year"].replace("1999-2000", "1999-00"), {})[r["industry"]] = float(r["current_price"])
    out = []
    for y, d in sorted(by.items()):
        if only_years and not only_years(y): continue
        if "Total Gross Value Added" not in d or any(k not in d for k in PRIM + SEC): continue
        t = d["Total Gross Value Added"]; p = sum(d[k] for k in PRIM); s = sum(d[k] for k in SEC)
        for sec, v in (("primary", p), ("secondary", s), ("tertiary", t - p - s)):
            out.append(["india", y, f"{v / t * 100:.2f}", "percent of GVA", sec, base, label])
    return out
rows = shares(load(f"{RAWE}/api/nas1112back_a_gva.all.json"), "2011-12", "back series", lambda y: y < "2011-12")
cur_gva = list(latest(load(f"{RAWE}/api/nas1112_a_gva.all.json"), lambda r: (r["year"], r["industry"], r["subindustry"], r.get("institutional_sector"))).values())
rows += shares(cur_gva, "2011-12", "current series, latest estimate", lambda y: y <= "2022-23")
rows += shares(load(f"{RAWE}/api/nas2223_a_gva.all.json"), "2022-23", "current series")
write(f"{OUTE}/gva-sector-shares.csv", ["geography", "period", "value", "unit", "sector", "base", "series"], rows)

# E4 per capita NSDP by state, 2024-25
pc = load(f"{RAWE}/api/nas1112_state_pcnsdp.all.json")
rows = []
for r in pc:
    if r["year"] == "2024-25" and r["current_price"]:
        rows.append([slug(r["state"]), "2024-25", r["current_price"], "rupees", "current prices", "2011-12", "MoSPI NAS API"])
        rows.append([slug(r["state"]), "2024-25", r["constant_price"], "rupees", "constant 2011-12 prices", "2011-12", "MoSPI NAS API"])
def hbie(table, colname, year):
    wb = openpyxl.load_workbook(glob.glob(f"{RAWE}/rbi/{table}T_*.XLSX")[0], data_only=True)
    for ws in wb.worksheets:
        hdr = [c.value for c in ws[5]]
        for row in ws.iter_rows(min_row=22, values_only=True):
            if row[1] == year:
                for h, v in zip(hdr, row):
                    if h and colname in str(h) and isinstance(v, (int, float)): return v
for name, s in (("Assam", "assam"), ("Haryana", "haryana"), ("All", "india")):
    v9, v10 = hbie(9, name, "2024-25"), hbie(10, name, "2024-25")
    lab = "RBI HBIE 2025-26 Table 9/10" + (" (All-India per capita NNI)" if s == "india" else " (MoSPI data as on 1 Aug 2025)")
    rows.append([s, "2024-25", str(v9), "rupees", "current prices", "2011-12", lab])
    rows.append([s, "2024-25", str(v10), "rupees", "constant 2011-12 prices", "2011-12", lab])
rows.sort(key=lambda r: (r[4], r[0] != "india", r[0]))
write(f"{OUTE}/per-capita-nsdp-by-state.csv", ["geography", "period", "value", "unit", "price_basis", "base", "source"], rows)
print("E4 missing:", sorted(set(GEONAME) - {r[0] for r in rows}))

# E5 GSDP growth by state, 2024-25
rows = []
for r in load(f"{RAWE}/api/nas1112_state_gsdpgr.all.json"):
    if r["year"] == "2024-25" and r["constant_price"]:
        rows.append([slug(r["state"]), "2024-25", r["constant_price"], "percent", "real (constant 2011-12 prices)", "2011-12", "GSDP"])
ind = [r for r in load(f"{RAWE}/api/nas1112_a_g22.all.json") if r["year"] == "2024-25" and r["revision"] == "Provisional Estimates"][0]
rows.append(["india", "2024-25", ind["constant_price"], "percent", "real (constant 2011-12 prices)", "2011-12", "GDP, Provisional Estimates on base 2011-12"])
rows.sort(key=lambda r: (r[0] != "india", r[0]))
write(f"{OUTE}/gsdp-growth-by-state.csv", ["geography", "period", "value", "unit", "measure", "base", "aggregate"], rows)
print("E5 missing:", sorted(set(GEONAME) - {r[0] for r in rows}))

# E6 IIP growth monthly
rows = []
for r in load(f"{RAWE}/api/iip1112_monthly_general.all.json"):
    if r["growth_rate"] not in (None, ""):
        rows.append(["india", ym(r["year"], r["month"]), r["growth_rate"], "percent", "General", "2011-12", r["index"]])
for r in load(f"{RAWE}/api/iip2223_monthly.all.json"):
    p = ym(r["year"], r["month"])
    if r["sub_category"] or p < "2024-04": continue  # growth before Apr 2024 compares with the base-year average, not the same month
    rows.append(["india", p, r["growth_rate"], "percent", r["category"], "2022-23", r["index"]])
rows = sorted({tuple(x) for x in rows}, key=lambda r: (r[5], r[4] != "General", r[4], r[1]))
write(f"{OUTE}/iip-growth-monthly.csv", ["geography", "period", "value", "unit", "category", "base", "index"], rows)

# E7 rupee per dollar, financial-year average and end-year (Handbook Table 133)
wb = openpyxl.load_workbook(glob.glob(f"{RAWE}/rbi/133T_*.XLSX")[0], data_only=True)
rows = []
for ws in wb.worksheets:
    for row in ws.iter_rows(min_row=7, values_only=True):
        if isinstance(row[1], str) and re.match(r"\d{4}-\d{2}$", row[1]) and isinstance(row[4], (int, float)):
            rows.append(["india", row[1], f"{row[4]}", "rupees per US dollar", "financial-year average"])
            if isinstance(row[5], (int, float)): rows.append(["india", row[1], f"{row[5]}", "rupees per US dollar", "end of financial year"])
write(f"{OUTE}/usd-inr-annual.csv", ["geography", "period", "value", "unit", "measure"], rows)

# E8 daily FBIL reference rate, 2026
t = open(f"{RAWE}/rbi/refrate_usd_2026.html", encoding="utf-8", errors="replace").read()
t = re.sub(r"\s+", " ", html.unescape(re.sub("<[^>]+>", " ", t)))
t = t[t.find("USD (INR / 1 USD)"):]
d = {f"{y}-{m}-{dd}": v for dd, m, y, v in re.findall(r"(\d{2})/(\d{2})/(\d{4}) (\d+\.\d+)", t)}
rows = [["india", k, d[k], "rupees per US dollar", "FBIL reference rate"] for k in sorted(d)]
write(f"{OUTE}/usd-inr-daily-2026.csv", ["geography", "date", "value", "unit", "measure"], rows)
