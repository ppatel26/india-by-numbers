"""Build the education CSVs from NSS round 80 (CMS: Education 2025) and round 79 (CAMS 2022-23).

Usage: python3 -I pipeline/education/build_cmse.py [--raw raw/education] [--work work/education]
       [--out research/data/education] [--geo research/data/geography.csv]

Reads the API pages saved by fetch_nss.py (<raw>/nss80/i<code>.json, <raw>/nss79/i<code>.json)
and the report text made by extract_text.sh (<work>/cmse-2025/report.txt,
<work>/cams-2022-23/report.txt). Writes the API values with the publisher's digits. Then it
checks each value against the report: every cell of the state tables named below, and the
all-India statements. It stops if any value differs.
"""
import argparse
import csv
import json
import re
import sys

ap = argparse.ArgumentParser()
ap.add_argument("--raw", default="raw/education")
ap.add_argument("--work", default="work/education")
ap.add_argument("--out", default="research/data/education")
ap.add_argument("--geo", default="research/data/geography.csv")
a = ap.parse_args()

geo = {r["name"].lower(): r["slug"] for r in csv.DictReader(open(a.geo))}
ALIAS = {
    "all-india": "india",
    "all india": "india",
    "a & n islands": "andaman-nicobar",
    "andaman & nicobar islands": "andaman-nicobar",
    "jammu & kashmir": "jammu-kashmir",
    "dadra & nagar haveli and daman & diu": "dnh-dd",
}


def slug(name):
    n = re.sub(r"\s+", " ", name.strip().lower())
    if n.startswith("dadra"):
        return "dnh-dd"
    s = ALIAS.get(n) or geo.get(n)
    if not s:
        sys.exit(f"unknown state name: {name!r}")
    return s


def load(rnd, code):
    return json.load(open(f"{a.raw}/nss{rnd}/i{code}.json"))["records"]


def val(v, decimals=None):
    """The API gives '-' where the report prints '-' (no sample observation): leave it empty.
    The API drops trailing zeros (27 for the report's 27.0). With `decimals`, print the value with
    the report's decimals, after a check that the API gives no more digits than that."""
    v = v.strip()
    if v == "-":
        return ""
    if decimals is None:
        return v
    if "." in v and len(v.split(".")[1]) > decimals:
        sys.exit(f"value {v} has more than {decimals} decimals")
    return f"{float(v):.{decimals}f}"


SECTOR = {"Rural": "rural", "Urban": "urban", "All": "rural+urban"}
SEX = {"Male": "male", "Female": "female", "Person": "person"}
LEVEL = {
    "Pre-Primary": "pre-primary",
    "Primary": "primary",
    "Middle": "middle",
    "Secondary": "secondary",
    "Higher Secondary": "higher secondary",
    "All Levels": "all levels",
}
TYPE = {
    "Government": "government",
    "Private Aided": "private aided",
    "Private Unaided (Recognised)": "private unaided (recognised)",
    "Others": "others",
    "All Non-Government": "all non-government",
    "All": "all",
}
ORDER_GEO = ["india"] + sorted(set(geo.values()))


def write(name, header, rows):
    rows.sort(key=lambda r: ORDER_GEO.index(r[0]))  # stable: India first, then states, API order within
    with open(f"{a.out}/{name}", "w", newline="") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(header)
        w.writerows(rows)
    print(f"{name}: {len(rows)} rows")


# ---- CMS: Education 2025 (NSS round 80, survey code 2) --------------------------------------
P80 = "2025"
UNIT_RS = "rupees"

spend = []
for r in load(80, 30):
    spend.append([slug(r["state"]), P80, LEVEL[r["level_of_enrollment"]], "all", SEX[r["gender"]],
                  SECTOR[r["sector"]], val(r["value"]), UNIT_RS, "30", "Table 5.1"])
for r in load(80, 31):
    if r["type_of_school"] == "All":
        continue  # the same estimate as level 'All Levels' of indicator 30 (checked below)
    spend.append([slug(r["state"]), P80, "all levels", TYPE[r["type_of_school"]], SEX[r["gender"]],
                  SECTOR[r["sector"]], val(r["value"]), UNIT_RS, "31", "Table 5.2"])
for r in load(80, 32):
    spend.append([slug(r["state"]), P80, LEVEL[r["level_of_enrollment"]], TYPE[r["type_of_school"]],
                  "person", SECTOR[r["sector"]], val(r["value"]), UNIT_RS, "32", "Table 6"])

# Indicator 31 'All' must equal indicator 30 'All Levels'.
i30_all = {(r["state"], r["gender"], r["sector"]): r["value"] for r in load(80, 30) if r["level_of_enrollment"] == "All Levels"}
for r in load(80, 31):
    if r["type_of_school"] == "All" and i30_all[(r["state"], r["gender"], r["sector"])] != r["value"]:
        sys.exit(f"indicator 31 'All' differs from indicator 30 'All Levels': {r}")

types = []
for r in load(80, 24):
    types.append([slug(r["state"]), P80, TYPE[r["type_of_school"]], SEX[r["gender"]], SECTOR[r["sector"]],
                  val(r["value"], 1), "% of students", "24", "Table 2"])

coach = []
for r in load(80, 38):
    coach.append([slug(r["state"]), P80, LEVEL[r["level_of_enrollment"]], SEX[r["gender"]], SECTOR[r["sector"]],
                  val(r["value"], 1), "% of students", "38", "Table 11"])

# ---- CAMS 2022-23 (NSS round 79, survey code 1) ---------------------------------------------
mys = []
for r in load(79, 3):
    mys.append([slug(r["state"]), "2022-23", r["age_group"].replace(" years and above", "+"), SEX[r["gender"]],
                SECTOR[r["sector"]], val(r["value"], 1), "years", "3", "Table 3"])

# ---- Checks against the report text -------------------------------------------------------
NUM = r"(-|\d[\d,]*(?:\.\d+)?)"
ROW = re.compile(r"^\s*(.*?)\s+" + r"\s+".join([NUM] * 9) + r"\s*$")


def state_table(text, title, sub):
    """Rows of one appendix page: {slug: [9 values]} in the order rural, urban, rural+urban x male, female, person."""
    lines = text.splitlines()
    for i, line in enumerate(lines):
        if line.strip().startswith(title) and any(l.strip().lower() == sub for l in lines[i + 1:i + 4]):
            out, pending = {}, ""
            for l in lines[i + 4:i + 60]:
                m = ROW.match(l)
                if m:
                    name = (pending + " " + m.group(1)).strip()
                    pending = ""
                    if name.startswith("("):
                        continue
                    out[slug(name)] = [x.replace(",", "") for x in m.groups()[1:]]
                    if slug(name) == "india":
                        return out
                elif l.strip() and not l.strip().startswith("&") and not l.strip().lower().startswith(("state", "rural", "(")):
                    pending = l.strip() if l.strip().lower().startswith("dadra") else pending
            sys.exit(f"{title} / {sub}: no all-India row")
    sys.exit(f"{title} / {sub}: page not found")


def check(name, text, title, sub, rows, pick):
    """Compare every cell of a report page with the CSV rows picked by `pick(row) -> (slug, col) or None`."""
    table = state_table(text, title, sub)
    have = {}
    for r in rows:
        k = pick(r)
        if k:
            have[k] = r
    n = bad = 0
    cols = [(s, x) for s in ("rural", "urban", "rural+urban") for x in ("male", "female", "person")]
    for g, cells in table.items():
        for (sector, sex), cell in zip(cols, cells):
            r = have.get((g, sector, sex))
            if r is None:
                sys.exit(f"{name}: no CSV row for {g} {sector} {sex}")
            v = r[-4]  # value, unit, api_indicator, report_table end every row
            want = "" if cell == "-" else cell
            n += 1
            if float(v or "nan") != float(want or "nan") and not (v == want == ""):
                bad += 1
                print(f"  MISMATCH {name} {g} {sector} {sex}: API {v!r}, report {cell!r}")
    print(f"check {name}: {len(table)} rows, {n} cells, {bad} differ")
    if bad:
        sys.exit(1)


cmse = open(f"{a.work}/cmse-2025/report.txt", encoding="utf-8").read()
cams = open(f"{a.work}/cams-2022-23/report.txt", encoding="utf-8").read()

# Every page of Tables 5.1, 5.2, 2 and 11. Their all-India rows are Statements 2.3, 2.4, 1.2 and 3.1.
for lvl in LEVEL.values():
    check(f"Table 5.1 {lvl}", cmse, "Table 5.1:", lvl, spend,
          lambda r, lvl=lvl: (r[0], r[5], r[4]) if r[2] == lvl and r[3] == "all" else None)
    check(f"Table 11 {lvl}", cmse, "Table 11:", lvl, coach,
          lambda r, lvl=lvl: (r[0], r[4], r[3]) if r[2] == lvl else None)
for st in list(TYPE.values()):
    sub = "all types" if st == "all" else st
    check(f"Table 5.2 {sub}", cmse, "Table 5.2:", sub, spend,
          lambda r, st=st: (r[0], r[5], r[4]) if r[2] == "all levels" and r[3] == st else None)
    if st not in ("all", "all non-government"):
        check(f"Table 2 {st}", cmse, "Table 2:", st, types,
              lambda r, st=st: (r[0], r[4], r[3]) if r[2] == st else None)
check("CAMS Table 3 age 25+", cams, "Table 3:", "age: 25 years and above", mys,
      lambda r: (r[0], r[4], r[3]) if r[2] == "25+" else None)
check("CAMS Table 3 age 15+", cams, "Table 3:", "age: 15 years and above", mys,
      lambda r: (r[0], r[4], r[3]) if r[2] == "15+" else None)

# Statement 2.5: all-India spending by type of school for each level (rural, urban, rural + urban).
m = re.search(r"Statement 2\.5:.*?\n(.*?)Statement 2\.6 provides", cmse, re.S)
block, stype, n = m.group(1), None, 0
names = {"government": "government", "private aided": "private aided",
         "private unaided (recognised)": "private unaided (recognised)", "others": "others"}
idx = {(r[2], r[3], r[5]): r[6] for r in spend if r[0] == "india" and r[8] == "32"}
for l in block.splitlines():
    s = l.strip().lower()
    if s in names:
        stype = names[s]
        continue
    mm = re.match(r"^\s*(pre-primary|primary|middle|secondary|higher secondary)\s+" + r"\s+".join([NUM] * 3) + r"\s*$", l, re.I)
    if mm and stype:
        for sector, cell in zip(("rural", "urban", "rural+urban"), mm.groups()[1:]):
            n += 1
            if idx[(mm.group(1).lower(), stype, sector)] != cell.replace(",", ""):
                sys.exit(f"Statement 2.5 {stype} {mm.group(1)} {sector}: API {idx[(mm.group(1).lower(), stype, sector)]}, report {cell}")
print(f"check Statement 2.5: {n} cells, 0 differ")
if n != 60:
    sys.exit("Statement 2.5: expected 60 cells")

write("education-spending-per-student.csv",
      ["geography", "period", "level", "school_type", "sex", "sector", "value", "unit", "api_indicator", "report_table"], spend)
write("education-school-type-by-state.csv",
      ["geography", "period", "school_type", "sex", "sector", "value", "unit", "api_indicator", "report_table"], types)
write("education-private-coaching.csv",
      ["geography", "period", "level", "sex", "sector", "value", "unit", "api_indicator", "report_table"], coach)
write("education-mean-years-schooling-by-state.csv",
      ["geography", "period", "age_group", "sex", "sector", "value", "unit", "api_indicator", "report_table"], mys)
