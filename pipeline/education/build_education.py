"""Build education CSVs from UDISE+, AISHE and PLFS text extracts and the Census 2011 PCA workbook.

First run pipeline/education/extract_text.sh and pipeline/jobs/extract_text.sh (the PLFS report gives literacy).
Usage: python3 -I pipeline/education/build_education.py --raw raw/education --work work/education --out research/data/education
"""
import argparse
import csv
import os
import re
import sys

import openpyxl

ap = argparse.ArgumentParser()
ap.add_argument("--raw", default="raw/education", help="folder with census/DDW_PCA0000_2011_Indiastatedist.xlsx")
ap.add_argument("--work", default="work/education", help="folder with the pdftotext output")
ap.add_argument("--jobs-work", default="work/jobs", help="folder with the PLFS report text (report.txt)")
ap.add_argument("--out", default="research/data/education")
ap.add_argument("--geo", default="research/data/geography.csv")
_a = ap.parse_args()
EDU, JOBS, OUT, GEO = _a.work, _a.jobs_work, _a.out, _a.geo
CENSUS = os.path.join(_a.raw, "census", "DDW_PCA0000_2011_Indiastatedist.xlsx")

geo = {r["name"].lower(): r["slug"] for r in csv.DictReader(open(GEO))}
ALIASES = {
    "india": "india", "all india": "india",
    "andaman & nicobar islands": "andaman-nicobar", "a & n islands": "andaman-nicobar",
    "andaman & n. island": "andaman-nicobar",
    "daman & diu and dadra & nagar haveli": "dnh-dd", "dadra & nagar haveli & daman & diu": "dnh-dd",
    "d & n haveli and daman & diu": "dnh-dd",
    "jammu & kashmir": "jammu-kashmir", "jammu and kashmir": "jammu-kashmir",
}


def slug(name):
    n = re.sub(r"\s+", " ", name.strip().lower())
    if n in ALIASES:
        return ALIASES[n]
    if n in geo:
        return geo[n]
    raise SystemExit(f"unknown name {name!r}")


def lines(path):
    return open(path).read().split("\n")


def write(name, header, rows):
    with open(f"{OUT}/{name}", "w", newline="") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(header)
        w.writerows(rows)
    print(name, len(rows), "rows")


TOK = r"(?:\d+(?:\.\d+)?|-)"
ROW = re.compile(rf"^\s*(?:\d+\s+)?([A-Za-z][A-Za-z&.,() ]*?)\s{{2,}}((?:{TOK}\s+)*{TOK})\s*$")
NUMS = re.compile(rf"^\s*((?:{TOK}\s+)+{TOK})\s*$")
NUMS_SERIAL = re.compile(rf"^\s*\d+\s{{3,}}((?:{TOK}\s+)+{TOK})\s*$")
TEXT = re.compile(r"^\s*[A-Za-z][A-Za-z&.,() ]*\s*$")


def state_rows(L, title_prefix, stop=("Source:", "Table ", "AISHE 20"), serial=False):
    """Parse a state table that starts at the LAST line beginning with title_prefix."""
    starts = [i for i, l in enumerate(L) if l.strip().startswith(title_prefix)]
    if not starts:
        raise SystemExit(f"no table {title_prefix}")
    i = starts[-1] + 1
    out = []
    pending = ""
    while i < len(L):
        l = L[i]
        s = l.strip()
        if any(s.startswith(x) for x in stop):
            break
        m = ROW.match(l)
        if m and not s.startswith("("):
            name = (pending + " " + m.group(1)).strip() if pending and not m.group(1)[0].isupper() else m.group(1)
            out.append([name, m.group(2).split()])
            pending = ""
        elif (NUMS_SERIAL if serial else NUMS).match(l) and pending:
            out.append([pending, (NUMS_SERIAL if serial else NUMS).match(l).group(1).split()])
            pending = "__after__" + pending
        elif TEXT.match(l) and s:
            if pending.startswith("__after__"):
                out[-1][0] = out[-1][0] + " " + s
                pending = ""
            else:
                pending = (pending + " " + s).strip() if pending else s
        i += 1
    clean = []
    for name, vals in out:
        try:
            sl = slug(name)
        except SystemExit:
            continue  # header fragments
        clean.append((sl, name, vals))
    return clean


def need_all(rows, label):
    got = {r[0] for r in rows}
    missing = set(geo.values()) - got
    if "india" not in got:
        missing.add("india")
    print(f"  {label}: {len(got)} geographies; missing {sorted(missing)}")


UD = lines(f"{EDU}/UDISE+2025_26_Booklet_existing.txt")
SRC_UD = "UDISE+ 2025-26 booklet (existing structure)"

# ---------- GER by state (Table 6.1) ----------
rows = []
t = state_rows(UD, "Table 6.1: Gross Enrolment Ratio (GER) by Gender")
need_all(t, "GER 6.1")
levels = ["primary (1-5)", "upper primary (6-8)", "elementary (1-8)", "secondary (9-10)", "higher secondary (11-12)"]
for sl, name, v in t:
    assert len(v) == 15, (name, v)
    for li, lev in enumerate(levels):
        for si, sex in enumerate(("boys", "girls", "total")):
            rows.append([sl, "2025-26", lev, sex, v[li * 3 + si], "ratio (per cent of age group)", "Table 6.1"])
write("education-ger-school-by-state.csv",
      ["geography", "period", "level", "sex", "value", "unit", "table"], rows)

# ---------- Dropout by state (Table 6.13) ----------
rows = []
t = state_rows(UD, "Table 6.13: Dropout Rate by level")
need_all(t, "Dropout 6.13")
for sl, name, v in t:
    assert len(v) == 9, (name, v)
    for li, lev in enumerate(["primary (1-5)", "upper primary (6-8)", "secondary (9-10)"]):
        for si, sex in enumerate(("boys", "girls", "total")):
            rows.append([sl, "2025-26", lev, sex, v[li * 3 + si], "per cent", "Table 6.13"])
write("education-dropout-by-state.csv",
      ["geography", "period", "level", "sex", "value", "unit", "table"], rows)

# ---------- PTR by state (Table 4.12) ----------
rows = []
t = state_rows(UD, "Table 4.12: Pupil Teacher Ratio")
need_all(t, "PTR 4.12")
for sl, name, v in t:
    assert len(v) == 4, (name, v)
    for lev, x in zip(["primary (1-5)", "upper primary (6-8)", "secondary (9-10)", "higher secondary (11-12)"], v):
        rows.append([sl, "2025-26", lev, x, "pupils per teacher", "Table 4.12"])
write("education-ptr-by-state.csv", ["geography", "period", "level", "value", "unit", "table"], rows)

# ---------- School facilities by state ----------
rows = []
for title, fac, tab in (("Table 8.6: Percentage of schools having functional electricity", "functional electricity", "Table 8.6"),
                        ("Table 8.8: Percentage of schools having functional girls toilets", "functional girls' toilet", "Table 8.8")):
    t = state_rows(UD, title)
    need_all(t, tab)
    for sl, name, v in t:
        rows.append([sl, "2025-26", fac, v[0], "per cent of schools", "published", f"{tab}, all management"])
# internet: Table 2.5 (continued) gives counts; share is derived here
t = state_rows(UD, "Table 2.5 (continued): State wise highlights")
need_all(t, "2.5 cont")
for sl, name, v in t:
    total, internet = int(v[0]), int(v[3])
    rows.append([sl, "2025-26", "internet facility", f"{100 * internet / total:.1f}", "per cent of schools",
                 f"derived: {internet} of {total} schools", "Table 2.5 (continued), columns 14 and 17"])
write("education-school-facilities-by-state.csv",
      ["geography", "period", "facility", "value", "unit", "value_type", "table"], rows)

# ---------- National trend (Table 1 of each booklet) ----------
PARAMS = [
    ("enrolment", "pre-primary", r"Enrolment in Pre[- ]Primary"),
    ("enrolment", "primary (1-5)", r"Enrolment in Primary"),
    ("enrolment", "upper primary (6-8)", r"Enrolment in Upper Primary"),
    ("enrolment", "secondary (9-10)", r"Enrolment in Secondary"),
    ("enrolment", "higher secondary (11-12)", r"Enrolment in Higher Secondary"),
    ("enrolment", "total (pre-primary to higher secondary)", r"Total Number of Enrolments \(Pre-Primary to Higher Secondary\)"),
    ("GER", "primary (1-5)", r"Gross Enrolment Ratio \(GER\) – Primary"),
    ("GER", "upper primary (6-8)", r"Gross Enrolment Ratio \(GER\) – Upper Primary"),
    ("GER", "secondary (9-10)", r"Gross Enrolment Ratio \(GER\) – Secondary"),
    ("GER", "higher secondary (11-12)", r"Gross Enrolment Ratio \(GER\) – Higher Secondary"),
    ("dropout rate", "primary (1-5)", r"Dropout Rates - Primary"),
    ("dropout rate", "upper primary (6-8)", r"Dropout Rates – Upper Primary"),
    ("dropout rate", "secondary (9-10)", r"Dropout Rates - Secondary"),
    ("PTR", "primary (1-5)", r"PTR at Primary level"),
    ("PTR", "secondary (9-10)", r"PTR at Secondary level"),
    ("schools", "all schools", r"Total Number of Schools-?"),
    ("teachers", "all teachers", r"Total Number of teachers"),
]
UNITS = {"enrolment": "students", "GER": "ratio (per cent of age group)", "dropout rate": "per cent",
         "PTR": "pupils per teacher", "schools": "schools", "teachers": "teachers"}
books = [("UDISE+2021_22_Booklet.txt", ["2020-21", "2021-22"]),
         ("UDISE+2022_23_Booklet_existing.txt", ["2022-23"]),
         ("UDISE+2023_24_Booklet_existing.txt", ["2023-24"]),
         ("UDISE+2024_25_Booklet_existing.txt", ["2024-25"]),
         ("UDISE+2025_26_Booklet_existing.txt", ["2025-26"])]
rows = []
for fn, years in books:
    L = lines(f"{EDU}/{fn}")
    i0 = [i for i, l in enumerate(L) if l.strip().startswith("Table 1: National Highlights")][-1]
    block = L[i0:i0 + 200]
    for ind, lev, pat in PARAMS:
        rx = re.compile(r"^\s*" + pat + r"\s+((?:\d+(?:\.\d+)?\s+)*\d+(?:\.\d+)?)\s*$")
        hit = next((rx.match(l) for l in block if rx.match(l)), None)  # first = all categories
        if not hit:
            print("  not found", fn, ind, lev)
            continue
        vals = hit.group(1).split()
        if len(vals) != len(years):
            raise SystemExit(f"{fn} {pat} {vals}")
        for y, v in zip(years, vals):
            rows.append(["india", y, ind, lev, v, UNITS[ind], f"UDISE+ {years[-1]} booklet, Table 1"])
write("education-school-trend-india.csv",
      ["geography", "period", "indicator", "level", "value", "unit", "table"], rows)

# ---------- AISHE: higher education GER by state (Table 19) and India trend ----------
AL = lines(f"{EDU}/aishe-2023-24-final.txt")
t = state_rows(AL, "Table 19.States/UTs-wise Gross Enrolment Ratio", stop=("AISHE 20", "Table 20"), serial=True)
need_all(t, "AISHE T19")
rows = []
for sl, name, v in t:
    for sex, x in zip(("male", "female", "total"), v[:3]):
        rows.append([sl, "2023-24", sex, x, "ratio (per cent of population aged 18-23)", "all categories",
                     "AISHE 2023-24, Table 19"])
write("education-higher-ed-ger-by-state.csv",
      ["geography", "period", "sex", "value", "unit", "social_group", "table"], rows)

rows = []
TS = lines(f"{EDU}/aishe-ger-timeseries-2011pop.txt")
for l in TS:
    m = re.match(r"^(20\d\d-\d\d)\s+((?:\d+\.\d\s+){8}\d+\.\d)\s*$", l.strip())
    if m:
        v = m.group(2).split()
        for sex, x in zip(("male", "female", "total"), v[:3]):
            rows.append(["india", m.group(1), sex, x, "ratio (per cent of population aged 18-23)",
                         "AISHE GER time series based on 2011 population projection"])
i0 = next(i for i, l in enumerate(AL) if l.strip().startswith("Table 47. Gross Enrollment Ratio"))
for l in AL[i0 + 6:i0 + 13]:
    if "A & N Islands" in l:
        break
    m = re.match(r"^(2022-23|2023-24)\s+(\d+\.\d)\s+(\d+\.\d)\s+(\d+\.\d)", l.strip())
    if m:
        for sex, x in zip(("male", "female", "total"), m.groups()[1:]):
            rows.append(["india", m.group(1), sex, x, "ratio (per cent of population aged 18-23)",
                         "AISHE 2023-24, Table 47 (All India)"])
rows.sort(key=lambda r: (r[2], r[1]))
write("education-higher-ed-ger-india.csv", ["geography", "period", "sex", "value", "unit", "table"], rows)

# ---------- Literacy: PLFS 2025 (survey) and Census 2011 (count) ----------
rows = []
JL = lines(f"{JOBS}/report.txt")
starts = [i for i, l in enumerate(JL) if l.startswith("Table (7): Literacy rate")]
for i in starts:
    if JL[i + 2].strip() != "rural+urban":
        continue
    j = i + 3
    while "Annual Report" not in JL[j]:
        m = re.match(r"^([A-Za-z&.() ]+?)\s{2,}((?:\d+\.\d\s+){5}\d+\.\d)\s*$", JL[j])
        if m:
            v = m.group(2).split()
            for sex, x in (("male", v[0]), ("female", v[2]), ("person", v[4])):
                rows.append([slug(m.group(1)), "2025", sex, x, "per cent of persons aged 7+",
                             "PLFS 2025 (survey, Jan-Dec 2025)", "PLFS Annual Report 2025, Appendix Table (7)", ""])
        j += 1
plfs_n = len({r[0] for r in rows})
print("  PLFS literacy geographies", plfs_n)

wb = openpyxl.load_workbook(CENSUS, read_only=True, data_only=True)
ws = wb.worksheets[0]
hdr = None
cnt = {}
for r in ws.iter_rows(values_only=True):
    if hdr is None:
        hdr = r
        continue
    d = dict(zip(hdr, r))
    if d["TRU"] != "Total" or d["Level"] not in ("India", "STATE"):
        continue
    cnt[d["Name"]] = (d["TOT_P"] - d["P_06"], d["P_LIT"], d["TOT_M"] - d["M_06"], d["M_LIT"],
                      d["TOT_F"] - d["F_06"], d["F_LIT"])
CMAP = {"India": "india", "JAMMU & KASHMIR": "jammu-kashmir", "NCT OF DELHI": "delhi",
        "ANDAMAN & NICOBAR ISLANDS": "andaman-nicobar"}
note = {"andhra-pradesh": "undivided Andhra Pradesh, includes present Telangana",
        "jammu-kashmir": "former state, includes present Ladakh",
        "dnh-dd": "sum of Dadra & Nagar Haveli and Daman & Diu counts"}
merged = {}
for name, c in cnt.items():
    if name in ("DADRA & NAGAR HAVELI", "DAMAN & DIU"):
        merged[name] = c
        continue
    sl = CMAP.get(name) or slug(name.title().replace("And", "and"))
    for sex, (pop, lit) in (("person", c[0:2]), ("male", c[2:4]), ("female", c[4:6])):
        rows.append([sl, "2011", sex, f"{100 * lit / pop:.2f}", "per cent of persons aged 7+",
                     "Census 2011 (full count)", "derived from Census 2011 PCA counts: literates / (population - age 0-6)",
                     note.get(sl, "")])
if len(merged) == 2:
    a, b = merged.values()
    s = [x + y for x, y in zip(a, b)]
    for sex, (pop, lit) in (("person", s[0:2]), ("male", s[2:4]), ("female", s[4:6])):
        rows.append(["dnh-dd", "2011", sex, f"{100 * lit / pop:.2f}", "per cent of persons aged 7+",
                     "Census 2011 (full count)", "derived from Census 2011 PCA counts: literates / (population - age 0-6)",
                     note["dnh-dd"]])
rows.sort(key=lambda r: (r[1], r[2], r[0]))
write("education-literacy-by-state.csv",
      ["geography", "period", "sex", "value", "unit", "source_type", "table", "boundary_note"], rows)
