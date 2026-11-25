"""Build the crop CSVs from Agricultural Statistics at a Glance 2024-25 (Ministry of Agriculture and
Farmers Welfare, Economics, Statistics and Evaluation Division).

Usage: python3 -I pipeline/agriculture/build_asg.py [--work work/agriculture]
       [--out research/data/agriculture] [--geo research/data/geography.csv]

Reads <work>/asg/asg-2024-25.txt (pdftotext -layout of the publisher's PDF, made by
extract_text.sh). Writes the publisher's digits:
  crop-area-production-yield-india.csv   Tables 2.4(a), 2.5(a), 2.10(a): rice, wheat, total pulses, 1950-51 to 2024-25
  crop-yield-by-state.csv                Tables 2.31 (rice, total of all seasons), 2.32 (wheat), 2.35 (total pulses), 2005-06 to 2024-25
  crop-production-by-state.csv           Tables 2.4(b), 2.5(b), 2.10(b): major states, 2023-24 and 2024-25
  operational-holdings-agriculture-census.csv  Table 5.1: Agriculture Census 2005-06, 2010-11, 2015-16, India
Stops if the all-India yield of a state-wise table differs from Table (a), if a major-state yield in
Table (b) differs from the state-wise yield table, if production / area does not give the yield within
rounding, or if a size group of Table 5.1 does not add up to the total within rounding.
"""
import argparse
import csv
import re
import sys

ap = argparse.ArgumentParser()
ap.add_argument("--work", default="work/agriculture")
ap.add_argument("--out", default="research/data/agriculture")
ap.add_argument("--geo", default="research/data/geography.csv")
a = ap.parse_args()

lines = open(f"{a.work}/asg/asg-2024-25.txt", encoding="utf-8").read().splitlines()
geo = {r["name"].lower(): r["slug"] for r in csv.DictReader(open(a.geo))}
ALIAS = {
    "all india": "india",
    "andaman & nicobar islands": "andaman-nicobar",
    "jammu & kashmir": "jammu-kashmir",
}
# Rows that are not a current state or UT: the two UTs that merged in 2020, and "Others".
SKIP = {"dadra & nagar haveli", "daman & diu", "others"}
YEARS = [f"{y}-{(y + 1) % 100:02d}" for y in range(2005, 2025)]
CROPS = {"rice": ("2.4", "2.31"), "wheat": ("2.5", "2.32"), "total pulses": ("2.10", "2.35")}
errors = []


def slug(name):
    n = re.sub(r"\s+", " ", name.strip().lower())
    s = ALIAS.get(n) or geo.get(n)
    if not s:
        sys.exit(f"unknown state name: {name!r}")
    return s


def starts(prefix):
    """Line numbers of the lines that start a table (its first page and its 'Contd.' pages)."""
    return [i for i, l in enumerate(lines) if re.match(r"\s*" + re.escape(prefix), l)]


def block(table):
    """Lines of a table, from its first title line to the 'Source:' line after its last page."""
    hits = starts(f"Table {table}")
    if not hits:
        sys.exit(f"Table {table} not found")
    end = next(i for i in range(hits[-1], len(lines)) if lines[i].strip().startswith("Source:"))
    return lines[hits[0]:end]


# ---- Table (a): all-India area, production, yield, irrigation -------------------------------------
ROW_A = re.compile(r"^\s*(\d{4}-\d{2})\s+([\d.]+)\s+([\d.]+)\s+(\d+)\s+([\d.]+|-)\s*$")


def table_a(table):
    rows = {}
    for l in block(f"{table}(a)") if starts(f"Table {table}(a)") else block(f"{table} (a)"):
        m = ROW_A.match(l)
        if m:
            year, area, prod, yld, irr = m.groups()
            if year in rows:
                sys.exit(f"Table {table}(a): {year} twice")
            rows[year] = {"area": area, "production": prod, "yield": yld, "irrigated": "" if irr == "-" else irr}
    years = list(rows)
    if years[0] != "1950-51" or years[-1] != "2024-25" or len(years) != 75:
        sys.exit(f"Table {table}(a): years {years[0]} to {years[-1]}, {len(years)} rows")
    return rows


# ---- Table (b): major states, 2023-24 and 2024-25 -------------------------------------------------
ROW_B = re.compile(r"^\s*([A-Z][A-Za-z &]+?)\s+" + r"\s+".join([r"([\d.]+)"] * 11) + r"\s*$")


def table_b(table):
    title = f"{table} (b)" if starts(f"Table {table} (b)") else f"{table}(b)"
    rows = {}
    for l in block(title):
        m = ROW_B.match(l)
        if m:
            v = m.groups()
            rows[slug(v[0])] = v[1:]
    if "india" not in rows or len(rows) != 11:
        sys.exit(f"{title}: {len(rows)} rows")
    return rows


# ---- State-wise yield tables ---------------------------------------------------------------------
TOK = r"(?:\d+|NA)"
ROW_Y = re.compile(r"^(?P<name>.*?)\s*(?P<season>Kharif|Rabi|Summer|Total)?\s+(?P<nums>" + TOK + r"(?:\s+" + TOK + r"){19})\s*$")
NAME_ONLY = re.compile(r"^\s*[A-Z&][A-Za-z &.]*\s*$")
NOT_NAME = re.compile(r"^\s*(Table|Source|NA-|State|Yield|Agricultural|Production|contd)", re.I)


def table_yield(table, seasons):
    """{slug: [20 values]} from a state-wise yield table. Wrapped state names ('Andhra' then
    'Pradesh') are joined. For rice, the 'Total' row of each state is kept."""
    states, cur, last_named = [], None, False
    for l in block(f"{table}:"):
        m = ROW_Y.match(l)
        if m:
            name = m.group("name").strip()
            if seasons and not m.group("season"):
                sys.exit(f"Table {table}: row without season: {l!r}")
            if not seasons and m.group("season"):
                sys.exit(f"Table {table}: unexpected season: {l!r}")
            if name:
                cur = {"name": name, "rows": {}}
                states.append(cur)
            elif cur is None:
                sys.exit(f"Table {table}: row without a state: {l!r}")
            last_named = bool(name)
            key = m.group("season") or "Total"
            if key in cur["rows"]:
                sys.exit(f"Table {table}: {cur['name']} {key} twice")
            cur["rows"][key] = m.group("nums").split()
        elif l.strip() and NAME_ONLY.match(l) and not NOT_NAME.match(l):
            # A name line with no numbers, right after a state's first row, continues its name.
            if not (cur and last_named):
                sys.exit(f"Table {table}: stray text {l!r}")
            cur["name"] += " " + l.strip()
    res = {}
    for st in states:
        n = re.sub(r"\s+", " ", st["name"].lower())
        if n in SKIP:
            continue
        s = slug(st["name"])
        if s in res:
            sys.exit(f"Table {table}: {s} twice")
        if "Total" not in st["rows"]:
            sys.exit(f"Table {table}: {s} has no Total row")
        res[s] = ["" if x == "NA" else x for x in st["rows"]["Total"]]
    return res


# ---- Build ---------------------------------------------------------------------------------------
india_rows, state_rows, prod_rows = [], [], []
UNIT_A = {"area": "million hectares", "production": "million tonnes", "yield": "kg per hectare", "irrigated": "% of area"}
MEASURE = {"area": "area", "production": "production", "yield": "yield", "irrigated": "area under irrigation"}

for crop, (ta, ty) in CROPS.items():
    A = table_a(ta)
    for year, r in A.items():
        # production / area gives the yield, within the rounding of the two published values.
        area, prod, yld = float(r["area"]), float(r["production"]), float(r["yield"])
        calc = prod / area * 1000
        tol = calc * (0.005 / area + 0.005 / prod) + 1
        if abs(calc - yld) > tol:
            errors.append(f"Table {ta}(a) {year}: {prod} / {area} = {calc:.0f}, yield {yld}")
        for k in ("area", "production", "yield", "irrigated"):
            india_rows.append({"geography": "india", "period": year, "crop": crop, "measure": MEASURE[k],
                               "value": r[k], "unit": UNIT_A[k], "report_table": f"Table {ta}(a)"})
    Y = table_yield(ty, seasons=(crop == "rice"))
    if "india" not in Y:
        sys.exit(f"Table {ty}: no All India row")
    for i, year in enumerate(YEARS):
        if Y["india"][i] != A[year]["yield"]:
            errors.append(f"{crop} {year}: Table {ty} All India {Y['india'][i]}, Table {ta}(a) {A[year]['yield']}")
    for s, vals in Y.items():
        if s == "india":
            continue
        for i, year in enumerate(YEARS):
            state_rows.append({"geography": s, "period": year, "crop": crop, "value": vals[i],
                               "unit": "kg per hectare", "report_table": f"Table {ty}"})
    B = table_b(ta)
    for s, v in B.items():
        a23, sh_a23, p23, sh_p23, y23, a24, sh_a24, p24, sh_p24, y24, irr = v
        ref = A if s == "india" else None
        for year, (ar, sa, pr, sp, yl) in (("2023-24", (a23, sh_a23, p23, sh_p23, y23)), ("2024-25", (a24, sh_a24, p24, sh_p24, y24))):
            expect = Y[s][YEARS.index(year)]
            if yl != expect:
                errors.append(f"{crop} {s} {year}: Table {ta}(b) yield {yl}, Table {ty} {expect}")
            if ref and (ref[year]["area"], ref[year]["production"]) != (ar, pr):
                errors.append(f"{crop} India {year}: Table {ta}(b) {ar}, {pr}; Table {ta}(a) {ref[year]['area']}, {ref[year]['production']}")
            calc = float(pr) / float(ar) * 1000
            if abs(calc - float(yl)) > calc * (0.005 / float(ar) + 0.005 / float(pr)) + 1:
                errors.append(f"Table {ta}(b) {s} {year}: {pr} / {ar} = {calc:.0f}, yield {yl}")
            for measure, value, unit in (("area", ar, "million hectares"), ("share of India area", sa, "% of India"),
                                         ("production", pr, "million tonnes"), ("share of India production", sp, "% of India"),
                                         ("yield", yl, "kg per hectare")):
                prod_rows.append({"geography": s, "period": year, "crop": crop, "measure": measure, "value": value,
                                  "unit": unit, "report_table": f"Table {ta}(b)"})
        prod_rows.append({"geography": s, "period": "2023-24", "crop": crop, "measure": "area under irrigation",
                          "value": irr, "unit": "% of area", "report_table": f"Table {ta}(b)"})
    print(f"{crop}: Table {ta}(a) {len(A)} years; Table {ty} {len(Y) - 1} states; Table {ta}(b) {len(B) - 1} states")

# ---- Table 5.1: Agriculture Census, operational holdings by size group ---------------------------
GROUPS = ["Marginal", "Small", "Semi-Medium", "Medium", "Large", "All Holdings"]
SIZE = {"Marginal": "less than 1 ha", "Small": "1 to 2 ha", "Semi-Medium": "2 to 4 ha", "Medium": "4 to 10 ha",
        "Large": "10 ha and above", "All Holdings": "all sizes"}
ROUNDS = ["2005-06", "2010-11", "2015-16"]
census, blk = [], block("5.1:")
for g in GROUPS:
    idx = next((i for i, l in enumerate(blk) if l.strip().startswith(g + " ") or l.strip() == g), None)
    if idx is None:
        sys.exit(f"Table 5.1: no row {g}")
    nums = re.findall(r"[\d.]+", blk[idx][len(g) + blk[idx].index(g):])
    # The share line follows the row, after a page footer for "Medium".
    shares = next(x for x in (re.findall(r"\(([\d.]+)\)", l) for l in blk[idx + 1:]) if len(x) >= 2)
    if len(nums) != 9 or len(shares) != 6:
        sys.exit(f"Table 5.1 {g}: {nums} {shares}")
    for j, period in enumerate(ROUNDS):
        for measure, value, unit in (("number of holdings", nums[j], "thousand holdings"),
                                     ("share of holdings", shares[j], "% of holdings"),
                                     ("area operated", nums[3 + j], "thousand hectares"),
                                     ("share of area operated", shares[3 + j], "% of area operated"),
                                     ("average size", nums[6 + j], "hectares")):
            census.append({"geography": "india", "period": period, "size_group": g.lower(), "size_class": SIZE[g],
                           "measure": measure, "value": value, "unit": unit,
                           "note": "excludes Jharkhand" if period == "2005-06" else ("provisional average size" if period == "2015-16" and measure == "average size" else ""),
                           "report_table": "Table 5.1"})
for period in ROUNDS:
    for measure in ("number of holdings", "area operated"):
        parts = [float(r["value"]) for r in census if r["period"] == period and r["measure"] == measure and r["size_group"] != "all holdings"]
        total = next(float(r["value"]) for r in census if r["period"] == period and r["measure"] == measure and r["size_group"] == "all holdings")
        if abs(sum(parts) - total) > 3:
            errors.append(f"Table 5.1 {period} {measure}: groups add to {sum(parts)}, total {total}")

if errors:
    sys.exit("check failed:\n" + "\n".join(errors))


def write(name, rows):
    with open(f"{a.out}/{name}", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0]), lineterminator="\n")
        w.writeheader()
        w.writerows(rows)
    print(f"{name}: {len(rows)} rows")


write("crop-area-production-yield-india.csv", india_rows)
write("crop-yield-by-state.csv", state_rows)
write("crop-production-by-state.csv", prod_rows)
write("operational-holdings-agriculture-census.csv", census)
