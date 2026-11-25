"""Build the Time Use Survey (TUS) CSVs from the eSankhyiki API and the 2024 report text.

First run pipeline/jobs/fetch_tus.sh (API JSON, report PDFs and their text).
Usage: python3 -I pipeline/jobs/build_tus.py --raw raw/jobs --work work/jobs --out research/data/jobs

Writes:
  jobs-time-use-india.csv          India, 2019 and 2024, from the API (indicators 6, 7 and 8).
  jobs-time-use-by-state-2024.csv  States and UTs, 2024, from Statement 7.1 of the 2024 report.
Checks the API values against the report tables and stops on any difference.
"""
import argparse
import csv
import json
import re

ap = argparse.ArgumentParser()
ap.add_argument("--raw", default="raw/jobs", help="folder with tus-api/ (eSankhyiki JSON)")
ap.add_argument("--work", default="work/jobs", help="folder with tus-2019/ and tus-2024/ report text")
ap.add_argument("--out", default="research/data/jobs")
ap.add_argument("--geo", default="research/data/geography.csv")
A = ap.parse_args()

ACTIVITY = {
    "(Major Division: 1) Employment and related activities": "employment",
    "(Major Division: 3) Unpaid domestic services for household members": "unpaid domestic services",
    "(Major Division: 4) Unpaid caregiving services for household members": "unpaid caregiving",
}
# Labels as the report tables start each row.
LABEL = {"employment": "Employment", "unpaid domestic services": "Unpaid domestic", "unpaid caregiving": "Unpaid caregiving"}
MEASURE = {
    "6": ("participation rate", "per cent of persons"),
    "7": ("minutes per participant", "minutes per day"),
    "8": ("minutes per person", "minutes per day"),
}
SEX = {"Male": "male", "Female": "female", "Person": "person"}
SECTOR = {"Rural": "rural", "Urban": "urban", "Combined": "rural+urban"}
AGE = {"15-59 Years": "15-59", "All (6 Years and Above)": "6+"}
SURVEY = {"2019": "TUS 2019 (Jan-Dec 2019)", "2024": "TUS 2024 (Jan-Dec 2024)"}
SECTORS = ["rural", "urban", "rural+urban"]
SEXES = ["male", "female", "person"]


def write(name, header, rows):
    with open(f"{A.out}/{name}", "w", newline="") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(header)
        w.writerows(rows)
    print(name, len(rows), "rows")


# ---- API: India ----
api = {}
for code, (measure, unit) in MEASURE.items():
    for r in json.load(open(f"{A.raw}/tus-api/tus-ind{code}.all.json"))["rows"]:
        if r["state"] != "All India":
            raise SystemExit(f"unexpected state {r['state']!r}")
        key = (r["year"], SEX[r["gender"]], SECTOR[r["sector"]], AGE[r["age_group"]], ACTIVITY[r["icatus_activity"]], measure)
        if key in api:
            raise SystemExit(f"duplicate {key}")
        value = r["value"]
        if measure == "participation rate":
            # The API drops a trailing zero (25 for 25.0). The report prints every rate to one decimal.
            if not re.fullmatch(r"\d+(\.\d)?", value):
                raise SystemExit(f"unexpected rate {value!r}")
            value = f"{float(value):.1f}"
        api[key] = (value, unit)
if len(api) != 324:
    raise SystemExit(f"expected 324 API values, got {len(api)}")

# The API gives wrong 2024 values for urban women in unpaid domestic services and caregiving:
# participation and minutes per participant, for every age group (README, "Gaps and cautions").
# For ages 6+ the report tables give the values; for ages 15-59 no report table does, so they stay empty.
API_FAULT = {("2024", "female", "urban", age, act, m)
             for age in ("15-59", "6+")
             for act in ("unpaid domestic services", "unpaid caregiving")
             for m in ("participation rate", "minutes per participant")}


# ---- Report text helpers ----
def lines(year):
    return open(f"{A.work}/tus-{year}/report.txt").read().split("\n")


def find(L, heading, start=0, then=None):
    """Index of the first line at or after start that begins (after spaces) with heading, and, if
    `then` is given, has `then` within the next 3 lines."""
    for i in range(start, len(L)):
        if L[i].strip().startswith(heading) and (then is None or any(then in x for x in L[i:i + 4])):
            return i
    raise SystemExit(f"not found: {heading} {then or ''}")


def nums(s):
    return re.findall(r"(?<![\w.])(\d+\.\d|\d+|-)(?![\w.])", s)


def row(L, i, end, label, n):
    """The n numbers of the row whose label starts with `label`, between lines i and end.
    Labels can wrap, so the numbers can sit on the label line or one of the next two."""
    for j in range(i, end):
        if re.sub(r"\s+", " ", L[j]).strip().startswith(label):
            for k in range(j, j + 3):
                v = nums(L[k])
                if len(v) == n:
                    return v
            raise SystemExit(f"no {n} numbers after {label!r} at line {j + 1}")
    raise SystemExit(f"row {label!r} not found after line {i + 1}")


def block(L, i, sex):
    """Line range of the male, female or person block of an age-group statement, from line i."""
    end = find(L, "Reference:", i)
    marks = [j for j in range(i, end) if L[j].strip() in SEXES]
    j = next(j for j in marks if L[j].strip() == sex)
    nxt = [m for m in marks if m > j]
    return j, (nxt[0] if nxt else end)


diffs, checked = [], 0


report = {}  # key -> (published value, table), for the API faults


def check(table, key, published):
    global checked
    got = api[key][0]
    if key in API_FAULT:
        report[key] = (published, table)
        return
    checked += 1
    if float(got) != float(published):
        diffs.append(f"{table} {key}: API {got}, report {published}")


# National tables, ages 6+: three sectors by sex (9 columns).
for year, stmts in (("2024", {"1": "participation rate", "2": "minutes per participant", "3": "minutes per person"}),
                    ("2019", {"5": "participation rate", "6": "minutes per participant", "7": "minutes per person"})):
    L = lines(year)
    for s, measure in stmts.items():
        i = find(L, f"Statement {s}:")
        end = i + 60
        for act, label in LABEL.items():
            vals = row(L, i, end, label, 9)
            for c, (sector, sex) in enumerate((x, y) for x in SECTORS for y in SEXES):
                check(f"TUS {year} Statement {s}", (year, sex, sector, "6+", act, measure), vals[c])

# Age-group tables, rural+urban: columns 15-29, 15-59, 60+ in sex blocks.
for year, stmts in (("2024", {"5": "participation rate", "6": "minutes per participant"}),
                    ("2019", {"9": "participation rate", "10": "minutes per participant"})):
    L = lines(year)
    for s, measure in stmts.items():
        # 2019 prints the statement for rural, urban and rural+urban; 2024 prints rural+urban only.
        i = find(L, f"Statement {s}:", then="rural+urban") if year == "2019" else find(L, f"Statement {s}:")
        for sex in SEXES:
            a, b = block(L, i, sex)
            for act, label in LABEL.items():
                vals = row(L, a, b, label, 3)
                check(f"TUS {year} Statement {s}", (year, sex, "rural+urban", "15-59", act, measure), vals[1])


# ---- Report: states and UTs, Statement 7.1 (2024) ----
geo = {r["name"].lower(): r["slug"] for r in csv.DictReader(open(A.geo))}
ALIASES = {
    "a & n islands": "andaman-nicobar",
    "dadra & nagar haveli and daman & diu": "dnh-dd",
    "jammu & kashmir": "jammu-kashmir",
    "all india": "india",
}
L = lines("2024")
start = find(L, "Statement 7.1:")
stop = find(L, "Statement 8.1:")
states, current = {}, None
for j in range(start, stop):
    name = L[j].strip()
    slug = ALIASES.get(name.lower()) or geo.get(name.lower())
    if slug and re.match(r"^\s{20,}\S", L[j]):
        current = slug
        states[current] = {}
        continue
    if current:
        for act in ("unpaid domestic services", "unpaid caregiving"):
            if re.sub(r"\s+", " ", L[j]).strip().startswith(LABEL[act]):
                v = nums(L[j])
                if len(v) != 9 or act in states[current]:
                    raise SystemExit(f"bad row at line {j + 1}: {L[j]!r}")
                states[current][act] = v
if len(states) != 37 or any(len(v) != 2 for v in states.values()):
    raise SystemExit(f"expected 36 states and UTs plus India, got {len(states)}")

# The All India rows of Statement 7.1 must match the API (ages 6+).
for act in ("unpaid domestic services", "unpaid caregiving"):
    for c, (sector, sex) in enumerate((x, y) for x in SECTORS for y in SEXES):
        check("TUS 2024 Statement 7.1", ("2024", sex, sector, "6+", act, "minutes per person"), states["india"][act][c])

if diffs:
    raise SystemExit("API and report differ:\n" + "\n".join(diffs))
print(f"API matches the report tables in all {checked} values checked")

order = {"employment": 0, "unpaid domestic services": 1, "unpaid caregiving": 2}
rows = []
for k in sorted(api, key=lambda k: (k[5], k[3], k[0], SECTORS.index(k[2]), SEXES.index(k[1]), order[k[4]])):
    year, sex, sector, age, activity, measure = k
    value, unit = api[k]
    source = "eSankhyiki API"
    if k in API_FAULT:
        value, source = report.get(k, ("", "API value withheld: fails check, no report table"))
        if value:
            source = f"Time Use in India {year}, {source.split(' ', 2)[2]}"
    rows.append(["india", year, sex, sector, age, activity, measure, value, unit, SURVEY[year], source])
write("jobs-time-use-india.csv",
      ["geography", "period", "sex", "sector", "age_group", "activity", "measure", "value", "unit", "survey_period", "source"], rows)

rows = []
cell = lambda x: "" if x == "-" else x
for slug in sorted(states, key=lambda s: (s != "india", s)):
    for c, sex in enumerate(SEXES, start=6):  # rural+urban: columns 8 to 10 of the statement
        dom, care = states[slug]["unpaid domestic services"][c], states[slug]["unpaid caregiving"][c]
        base = [slug, "2024", sex, "rural+urban", "6+"]
        per = ["minutes per person"]
        rows.append(base + ["unpaid domestic services"] + per + [cell(dom), "minutes per day", "Statement 7.1", ""])
        rows.append(base + ["unpaid caregiving"] + per + [cell(care), "minutes per day", "Statement 7.1", ""])
        total = "" if "-" in (dom, care) else str(int(dom) + int(care))
        rows.append(base + ["unpaid domestic services and caregiving"] + per + [total, "minutes per day", "Statement 7.1", "derived"])
write("jobs-time-use-by-state-2024.csv",
      ["geography", "period", "sex", "sector", "age_group", "activity", "measure", "value", "unit", "table", "note"], rows)
