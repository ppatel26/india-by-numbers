"""Build jobs CSVs from PLFS text extracts (pdftotext -layout) and MoSPI API JSON.

First run pipeline/jobs/extract_text.sh (PDF text into the work folder).
Usage: python3 -I pipeline/jobs/build_jobs.py --raw raw/jobs --work work/jobs --out research/data/jobs
"""
import argparse
import csv
import json
import re
import sys

ap = argparse.ArgumentParser()
ap.add_argument("--raw", default="raw/jobs", help="folder with the eSankhyiki JSON")
ap.add_argument("--work", default="work/jobs", help="folder with the pdftotext output")
ap.add_argument("--out", default="research/data/jobs")
ap.add_argument("--geo", default="research/data/geography.csv")
_a = ap.parse_args()
WORK, RAW, OUT, GEO = _a.work, _a.raw, _a.out, _a.geo

geo = {}
for r in csv.DictReader(open(GEO)):
    geo[r["name"].lower()] = r["slug"]
ALIASES = {
    "andaman & n. island": "andaman-nicobar",
    "andaman & nicobar islands": "andaman-nicobar",
    "dadra & nagar haveli & daman & diu": "dnh-dd",
    "jammu & kashmir": "jammu-kashmir",
    "all india": "india",
}


def slug(name):
    n = name.strip().lower()
    if n in ALIASES:
        return ALIASES[n]
    if n in geo:
        return geo[n]
    raise SystemExit(f"unknown state {name!r}")


def lines(name):
    return open(f"{WORK}/{name}").read().split("\n")


def write(name, header, rows):
    with open(f"{OUT}/{name}", "w", newline="") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(header)
        w.writerows(rows)
    print(name, len(rows), "rows")


NUM = r"(\d+\.\d|\d+)"
ROW_RE = re.compile(r"^\s*([A-Za-z&.() ]+?)\s{2,}((?:\d+\.\d\s*)+)$")


def state_table(txt, start_pat, age_label, ncols=9):
    """Return {state: [9 values]} for the Table page whose age-group line matches."""
    L = lines(txt)
    out = {}
    for i, l in enumerate(L):
        if l.startswith(start_pat) or l.startswith("`" + start_pat):
            if L[i + 2].startswith("age group") and age_label in L[i + 2]:
                j = i + 3
                while j < len(L) and "Annual Report" not in L[j]:
                    m = ROW_RE.match(L[j])
                    if m:
                        vals = m.group(2).split()
                        out[m.group(1).strip()] = vals
                    j += 1
                return out
    raise SystemExit(f"table not found {start_pat} {age_label}")


COLS = [("rural", "male"), ("rural", "female"), ("rural", "person"),
        ("urban", "male"), ("urban", "female"), ("urban", "person"),
        ("rural+urban", "male"), ("rural+urban", "female"), ("rural+urban", "person")]


def expand(vals):
    """Map 9 or 3 (Chandigarh urban only -> 6) values to COLS."""
    if len(vals) == 9:
        return dict(zip(COLS, vals))
    if len(vals) == 6:  # urban-only UT (Chandigarh): urban and rural+urban
        return dict(zip(COLS[3:], vals))
    raise SystemExit(f"bad row {vals}")


SRC_AR25 = "MoSPI NSO, PLFS Annual Report 2025, Appendix A"

# ---------- Chart: female LFPR by state, and LFPR by state all sexes ----------
lfpr = state_table("report.txt", "Table (16.0)", "15 years and above")
rows = []
for st, vals in lfpr.items():
    e = expand(vals)
    for (sec, sex), v in e.items():
        if sec != "rural+urban":
            continue
        rows.append([slug(st), "2025", sex, v, "per cent", "PLFS 2025 (Jan-Dec 2025)", "usual status (ps+ss)", "15+"])
rows.sort(key=lambda r: (r[2], r[0]))
write("jobs-lfpr-by-state-2025.csv",
      ["geography", "period", "sex", "value", "unit", "survey_period", "activity_status", "age_group"], rows)

# ---------- Chart: UR by state (15+ and 15-29) ----------
rows = []
for age_label, age in (("15 years and above", "15+"), ("15-29 years", "15-29")):
    t = state_table("report.txt", "Table (18.0)", age_label)
    for st, vals in t.items():
        e = expand(vals)
        for (sec, sex), v in e.items():
            if sec != "rural+urban":
                continue
            rows.append([slug(st), "2025", age, sex, v, "per cent", "PLFS 2025 (Jan-Dec 2025)", "usual status (ps+ss)"])
rows.sort(key=lambda r: (r[2], r[3], r[0]))
write("jobs-unemployment-by-state-2025.csv",
      ["geography", "period", "age_group", "sex", "value", "unit", "survey_period", "activity_status"], rows)

# ---------- Chart: annual LFPR, WPR, UR (15+, ps+ss), agri years + calendar years ----------
rows = []
L = lines("ar2324pn.txt")
# Tables 1-3 of the 2023-24 press note: rows "  2023-24   m f p m f p m f p"
tbl_titles = {"Table 1: Labour Force Participation Rate": "LFPR",
              "WPR": None, "Table 3: Unemployment Rate": "UR"}
current = None
seen = {}
for l in L:
    if "Table 1: Labour Force Participation Rate (LFPR) in usual status" in l:
        current = "LFPR"
    elif "Table 2" in l and "Worker Population Ratio" in l:
        current = "WPR"
    elif "Table 3: Unemployment Rate (UR) in usual status" in l:
        current = "UR"
    elif re.match(r"^\s*Table 4", l):
        current = None
    m = re.match(r"^\s*(20\d\d-\d\d)\s+((?:\d+\.\d\s+){8}\d+\.\d)\s*$", l)
    if m and current:
        key = (current, m.group(1))
        if key in seen:
            continue
        seen[key] = 1
        e = expand(m.group(2).split())
        for (sec, sex), v in e.items():
            if sec == "rural+urban":
                rows.append(["india", m.group(1), current, sex, v, "per cent", "agricultural year (Jul-Jun)",
                             "PLFS Annual Report 2023-24 press note, Tables 1-3"])
# check Table 2 got parsed (title may wrap); fall back on position
have = {r[2] for r in rows}
if have != {"LFPR", "WPR", "UR"}:
    raise SystemExit(f"agri-year tables incomplete: {have}")
L = lines("report.txt")
current = None
year = None
for i, l in enumerate(L[880:990]):
    if l.startswith("Table 1: Labour Force"):
        current = "LFPR"
    elif l.startswith("Table 2: Worker Population"):
        current = "WPR"
    elif l.startswith("Table 3: Unemployment Rate"):
        current = "UR"
    m = re.match(r"^\s*PLFS (20\d\d)\s*$", l)
    if m:
        year = m.group(1)
    m = re.match(r"^15 years and above\s+((?:\d+\.\d\s+){8}\d+\.\d)\s*$", l)
    if m and current and year:
        e = expand(m.group(1).split())
        for (sec, sex), v in e.items():
            if sec == "rural+urban":
                rows.append(["india", year, current, sex, v, "per cent", "calendar year (Jan-Dec)",
                             "PLFS Annual Report 2025, Highlights Tables 1-3"])
write("jobs-lfpr-wpr-ur-annual.csv",
      ["geography", "period", "indicator", "sex", "value", "unit", "period_type", "table"], rows)

# ---------- Chart: youth UR annual (Statement 18) ----------
rows = []
L = lines("report.txt")
i0 = next(i for i, l in enumerate(L) if l.startswith("Statement 18: Unemployment rates"))
sec = None
for l in L[i0:i0 + 25]:
    s = l.strip()
    if s in ("rural", "urban", "rural+urban"):
        sec = s
    m = re.match(r"^(male|female|person)\s+(\d+\.\d)\s+(\d+\.\d)\s+(\d+\.\d)\s+(\d+\.\d)$", s)
    if m and sec:
        for yr, v in zip(("2025", "2024", "2023", "2022"), m.groups()[1:]):
            rows.append(["india", yr, sec, m.group(1), v, "per cent", "15-29", "usual status (ps+ss)"])
write("jobs-youth-unemployment-annual.csv",
      ["geography", "period", "sector", "sex", "value", "unit", "age_group", "activity_status"], rows)

# ---------- Chart: status in employment (Statement 7) ----------
rows = []
i0 = next(i for i, l in enumerate(L) if l.startswith("Statement 7: Percentage distribution of workers"))
year = sec = None
cats = ["own account worker and employer", "helper in household enterprise", "all self-employed",
        "regular wage/salary", "casual labour", "all"]
for l in L[i0:i0 + 90]:
    s = l.strip()
    m = re.match(r"^PLFS (20\d\d)$", s)
    if m:
        year = m.group(1)
    if s in ("rural", "urban", "rural +urban", "rural+urban"):
        sec = s.replace(" ", "")
    m = re.match(r"^(male|female|person)\s+((?:\d+\.\d\s+){5}\d+\.\d)$", s)
    if m and year and sec:
        for c, v in zip(cats, m.group(2).split()):
            rows.append(["india", year, sec, m.group(1), c, v, "per cent of workers", "usual status (ps+ss)"])
write("jobs-employment-status.csv",
      ["geography", "period", "sector", "sex", "status", "value", "unit", "activity_status"], rows)

# ---------- Chart: broad industry (Statement 8) ----------
rows = []
i0 = next(i for i, l in enumerate(L) if l.startswith("Statement 8: Percentage distribution of workers"))
year = None
pending = None
for l in L[i0:i0 + 80]:
    s = l.strip()
    m = re.match(r"^PLFS (20\d\d)$", s)
    if m:
        year = m.group(1)
        continue
    if s == "transport, storage &":
        pending = "transport, storage & communications"
        continue
    m = re.match(r"^([a-z,&. ]+?)\s+((?:\d+\.\d\s+){8}\d+\.\d)$", s)
    m2 = re.match(r"^((?:\d+\.\d\s+){8}\d+\.\d)$", s)
    if m2 and pending:
        name, vals = pending, m2.group(1).split()
        pending = None
    elif m and year:
        name, vals = m.group(1).strip(), m.group(2).split()
    else:
        continue
    if name == "communications":
        continue
    e = expand(vals)
    for (sec, sex), v in e.items():
        rows.append(["india", year, sec, sex, name, v, "per cent of workers", "usual status (ps+ss)"])
write("jobs-employment-by-industry.csv",
      ["geography", "period", "sector", "sex", "industry", "value", "unit", "activity_status"], rows)

# ---------- Chart: quarterly urban UR (old QBs + new QBs) ----------
MONTHQ = {"July": "Q3", "October": "Q4", "January": "Q1", "April": "Q2"}
QLAB = {"Q1": "Jan-Mar", "Q2": "Apr-Jun", "Q3": "Jul-Sep", "Q4": "Oct-Dec"}
qrows = {}
old = [("qb-2019-jul-sep.txt", "PLFS Quarterly Bulletin Jul-Sep 2019, Statement 5"),
       ("qb-2020-jul-sep.txt", "PLFS Quarterly Bulletin Jul-Sep 2020, Statement 5"),
       ("qbpn-2021-oct-dec.txt", "PLFS Quarterly Bulletin Oct-Dec 2021 press note, Statement 3"),
       ("qb-2023-jan-mar.txt", "PLFS Quarterly Bulletin Jan-Mar 2023, Statement 5"),
       ("qb-2024-apr-jun.txt", "PLFS Quarterly Bulletin Apr-Jun 2024, Statement 5"),
       ("qb-2024-oct-dec.txt", "PLFS Quarterly Bulletin Oct-Dec 2024, Statement 5")]
for fn, src in old:
    L2 = lines(fn)
    if fn.startswith("qbpn"):
        i0 = next(i for i, l in enumerate(L2) if "Statement 3: UR (in per cent) in CWS in urban" in l)
        age = "15+"
        block = L2[i0:i0 + 15]
    else:
        i0 = next(i for i, l in enumerate(L2) if "Statement 5: Unemployment Rate" in l and "urban" in l)
        block = L2[i0:i0 + 30]
        age = None
    for l in block:
        s = l.strip()
        if s.startswith("age: 15-29"):
            age = "15-29"
        elif s.startswith("age: 15 years and above"):
            age = "15+"
        elif s.startswith("age: all ages"):
            age = "all ages"
        m = re.match(r"^(January|April|July|October)\s*[–-]\s*[A-Za-z]+\s+(20\d\d)\s+(\d+\.\d)\s+(\d+\.\d)\s+(\d+\.\d)$", s)
        if m and age in ("15+", "15-29"):
            q = f"{m.group(2)}-{MONTHQ[m.group(1)]}"
            for sex, v in zip(("male", "female", "person"), m.groups()[2:]):
                qrows[(q, "urban", sex, age)] = (v, src, "old design to Dec 2024: urban only")
# new design
newsrc = [("qb-2025-apr-jun.txt", "PLFS Quarterly Bulletin Apr-Jun 2025, Statement 5"),
          ("qb-2026-jul-sep.txt", "PLFS Quarterly Bulletin Jul-Sep 2026, Statement 5")]
L2 = lines("qb-2025-apr-jun.txt")
i0 = next(i for i, l in enumerate(L2) if "Statement 5: Unemployment Rate (in per cent) in CWS during the quarter" in l)
blk = "\n".join(L2[i0:i0 + 14])
m15 = re.search(r"15 years and\s+((?:\d+\.\d\s+){8}\d+\.\d)", blk)
m29 = re.search(r"15-29 years\s+((?:\d+\.\d\s+){8}\d+\.\d)", blk)
for age, mm in (("15+", m15), ("15-29", m29)):
    for (sec, sex), v in expand(mm.group(1).split()).items():
        qrows[("2025-Q2", sec, sex, age)] = (v, newsrc[0][1], "new design from Jan 2025: rural and urban")
L2 = lines("qb-2026-jul-sep.txt")
i0 = next(i for i, l in enumerate(L2) if l.startswith("Statement 5: Unemployment Rate (in per cent) in CWS"))
age = None
QN = {"July-Sept": "Q3", "Oct-Dec": "Q4", "Jan-March": "Q1", "April-June": "Q2"}
for l in L2[i0:i0 + 30]:
    s = l.strip()
    if s.startswith("age: 15-29"):
        age = "15-29"
    elif s.startswith("age: 15 years and above"):
        age = "15+"
    elif s.startswith("age: all ages"):
        age = None
    m = re.match(r"^(July-Sept|Oct-Dec|Jan-March|April-June), (20\d\d)\s+((?:\d+\.\d\s+){8}\d+\.\d)$", s)
    if m and age:
        q = f"{m.group(2)}-{QN[m.group(1)]}"
        for (sec, sex), v in expand(m.group(3).split()).items():
            qrows[(q, sec, sex, age)] = (v, newsrc[1][1], "new design from Jan 2025: rural and urban")
rows = []
for (q, sec, sex, age), (v, src, design) in sorted(qrows.items()):
    y, qq = q.split("-")
    rows.append(["india", q, f"{QLAB[qq]} {y}", sec, sex, age, v, "per cent", "current weekly status (CWS)", design, src])
write("jobs-unemployment-quarterly.csv",
      ["geography", "period", "period_label", "sector", "sex", "age_group", "value", "unit", "activity_status",
       "survey_design", "table"], rows)

# ---------- Chart: monthly LFPR, WPR, UR (API, plus March 2026 from press note text) ----------
MON = {m: i for i, m in enumerate(["January", "February", "March", "April", "May", "June", "July", "August",
                                    "September", "October", "November", "December"], 1)}
SECT = {"rural": "rural", "urban": "urban", "rural + urban": "rural+urban"}
AGE = {"15 years and above": "15+", "15-29 years": "15-29", "All ages": "all ages"}
rows = []
for ind, fn in (("LFPR", "monthly-lfpr.json"), ("WPR", "monthly-wpr.json"), ("UR", "monthly-ur.json")):
    for r in json.load(open(f"{RAW}/{fn}"))["records"]:
        if r["state"] != "All India" or AGE[r["AgeGroup"]] == "all ages":
            continue
        p = f"{r['year']}-{MON[r['month']]:02d}"
        rows.append(["india", p, ind, SECT[r["sector"]], r["gender"], AGE[r["AgeGroup"]], f'{float(r["value"]):.1f}', "per cent",
                     "MoSPI eSankhyiki API (PLFS monthly)"])
# March 2026: missing from API on 17 Nov 2026. Values stated in text of the March 2026 press note.
mar = [("LFPR", "rural+urban", "person", "55.4"), ("LFPR", "rural", "person", "58.0"),
       ("LFPR", "urban", "person", "50.3"), ("LFPR", "rural+urban", "female", "34.4"),
       ("LFPR", "rural", "female", "38.9"),
       ("WPR", "rural+urban", "person", "52.6"), ("WPR", "rural", "person", "55.5"),
       ("WPR", "urban", "person", "46.8"),
       ("UR", "rural+urban", "person", "5.1"), ("UR", "urban", "person", "6.8")]
for ind, sec, sex, v in mar:
    rows.append(["india", "2026-03", ind, sec, sex, "15+", v, "per cent",
                 "PLFS Monthly Bulletin March 2026 press note (text)"])
rows.sort(key=lambda r: (r[2], r[3], r[4], r[5], r[1]))
write("jobs-monthly-lfpr-wpr-ur.csv",
      ["geography", "period", "indicator", "sector", "sex", "age_group", "value", "unit", "source_note"], rows)
