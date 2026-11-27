"""Build the patent CSVs from the annual reports of the Office of the Controller General of Patents,
Designs, Trade Marks and Geographical Indications (CGPDTM, "IP India").

Usage: python3 -I pipeline/science-technology/build_patents.py [--work work/science-technology]
       [--out research/data/science-technology] [--geo research/data/geography.csv]

Run pipeline/science-technology/fetch.sh ipindia/ and extract_text.sh ipindia/ first. The script
reads the reading-order text (pdftotext -raw) of the 2024-25 and 2022-23 reports, where each table
cell is one token. The 2014-15 report is a scan: its Appendix C and D values are transcribed below
from the page images (PDF pages 39 and 40), and checked against the 2022-23 report where the two
overlap (2013-14 and 2014-15).

Writes five CSVs. Every value keeps the publisher's digits. The script stops on any difference:
  - Appendix C and D of the 2024-25 report against the same years (2015-16 to 2022-23) in the
    2022-23 report, and the transcribed 2014-15 values against the 2022-23 report (2013-14, 2014-15);
  - every Appendix C year: residents plus the three non-resident routes equal the grand total,
    except the years in C_SUM_EXCEPTIONS, where the publisher's own columns do not add up;
  - Appendix C and the "Trends in Patent Applications" table give the same filings;
  - Appendix B: the states add up to the TOTAL row, and the three routes of 2024-25 and 2023-24
    add up to the residents' filings in Appendix C;
  - the category table: each origin adds up to its total, and the Indian and foreign totals equal
    Appendix C, except for 2020-21 (CATEGORY_SUM_EXCEPTIONS);
  - Appendix E and F: the major fields add up to the total, and Appendix E1 and F1 add up to
    "Other fields", except in FIELD_SUM_EXCEPTIONS.
Each known difference is checked too, so the script stops if the publisher corrects it.
"""
import argparse
import csv
import re
import sys

ap = argparse.ArgumentParser()
ap.add_argument("--work", default="work/science-technology")
ap.add_argument("--out", default="research/data/science-technology")
ap.add_argument("--geo", default="research/data/geography.csv")
a = ap.parse_args()

AR = {
    "2024-25": "Annual Report 2024-25",
    "2022-23": "Annual Report 2022-23",
    "2014-15": "Annual Report 2014-15",
}
UNIT_APPS = "patent applications"
errors = []
checked = 0


def check(ok, msg):
    global checked
    checked += 1
    if not ok:
        errors.append(msg)


def pages(report):
    return open(f"{a.work}/ipindia/ar-{report}.raw.txt", encoding="utf-8").read().split("\f")


def tokens(report, marker):
    """The tokens of the first page that contains `marker` (spaces collapsed), from the marker on."""
    for p in pages(report):
        j = " ".join(p.split())
        n = j.find(marker)
        if n >= 0:
            return j[n + len(marker):].split()
    sys.exit(f"{report}: no page with {marker!r}")


def ints_after(toks, label, n, words=0):
    """The n numbers that follow the token sequence `label`, after at most `words` words (the rest of
    a label that wraps, such as "Applications under PCT"). A '*' after a number is dropped."""
    lab = label.split()
    for i in range(len(toks) - len(lab) + 1):
        if toks[i:i + len(lab)] == lab:
            out = []
            rest = toks[i + len(lab):]
            while words and rest and not re.fullmatch(r"\d+\*?", rest[0]):
                rest, words = rest[1:], words - 1
            for t in rest:
                if len(out) == n:
                    break
                m = re.fullmatch(r"(\d+)\*?", t)
                if not m:
                    sys.exit(f"not a number after {label!r}: {t!r}")
                out.append(m.group(1))
            if len(out) == n:
                return out
    sys.exit(f"label {label!r} not found")


def fy(start, n):
    return [f"{y}-{str(y + 1)[2:]}" for y in range(start, start + n)]


def write(name, header, rows):
    with open(f"{a.out}/{name}", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(header)
        w.writerows(rows)
    print(f"{name}: {len(rows)} rows")


# ---------------------------------------------------------------- Appendix C: filings by route

ROUTES = [  # (key in the CSV, label in Appendix C)
    ("residents", "Residents"),
    ("non-residents, ordinary", "Ordinary"),
    ("non-residents, convention", "Convention"),
    ("non-residents, PCT national phase", "National Phase"),
    ("all applicants", "GRAND TOTAL"),
]

# Annual Report 2014-15, Appendix C (PDF page 39, printed page 35), transcribed from the page image.
C_2014_15 = {
    "residents": "4521 5314 6040 6161 7044 8312 8921 9911 10941 12071",
    "non-residents, ordinary": "1008 693 834 681 826 816 1031 1144 1228 1461",
    "non-residents, convention": "3509 3969 4453 4264 2986 3728 4280 4184 3704 3174",
    "non-residents, PCT national phase": "15467 19768 23891 25706 23431 26544 28965 28435 27078 26057",
    "all applicants": "24505 28940 35218 36812 34287 39400 43197 43674 42951 42763",
}
# Annual Report 2014-15, Appendix D (PDF page 40, printed page 36), transcribed from the page image.
# Columns: filed, requests for examination, abandoned under Sec. 9(1), abandoned under Sec. 21(1),
# granted (Indian, foreign), in force (Indian, foreign).
D_2014_15 = """
2005-06 24505 21926 414 894 1396 2924 4486 11933
2006-07 28940 20645 694 1121 1907 5632 3473 13593
2007-08 35218 22146 1066 479 3173 12088 7966 21722
2008-09 36812 30595 888 1075 2541 13520 6158 24664
2009-10 34287 28653 2720 5171 1725 4443 6781 30553
2010-11 39400 31493 185 5186 1273 6236 7301 32293
2011-12 43197 33811 698 3800 699 3682 7545 32444
2012-13 43674 36247 361 4559 716 3410 8308 35612
2013-14 42951 37474 224 6418 634 3592 7464 35168
2014-15 42763 34958 12 6970 684 5294 7561 35695
"""
# Years where the publisher's Appendix C columns do not add up to its grand total (see the README).
C_SUM_EXCEPTIONS = {"2006-07"}


def appendix_c(report, first, n):
    toks = tokens(report, "LAST 10 YEARS")
    years = fy(first, n)
    check(toks[1:1 + n] == years, f"{report} App C years {toks[1:1 + n]}")
    return {key: dict(zip(years, ints_after(toks, label, n, words=3))) for key, label in ROUTES}


c25 = appendix_c("2024-25", 2015, 10)
c23 = appendix_c("2022-23", 2013, 10)
c15 = {k: dict(zip(fy(2005, 10), v.split())) for k, v in C_2014_15.items()}
for key, _ in ROUTES:
    for y, v in c23[key].items():
        if y in c25[key]:
            check(c25[key][y] == v, f"App C {key} {y}: AR 2024-25 {c25[key][y]}, AR 2022-23 {v}")
        if y in c15[key]:
            check(c15[key][y] == v, f"App C {key} {y}: AR 2014-15 {c15[key][y]}, AR 2022-23 {v}")

app_rows = []
for report, table in (("2014-15", c15), ("2024-25", c25)):
    for y in table["residents"]:
        parts = sum(int(table[k][y]) for k, _ in ROUTES[:4])
        total = int(table["all applicants"][y])
        if y in C_SUM_EXCEPTIONS:
            check(parts != total, f"App C {y} now adds up: remove it from C_SUM_EXCEPTIONS")
        else:
            check(parts == total, f"App C {y}: parts {parts}, total {total}")
        for key, _ in ROUTES:
            app_rows.append(["india", y, key, table[key][y], UNIT_APPS, f"{AR[report]}, Appendix C"])

# "Trends in Patent Applications" (2024-25, page 9) gives the same filings and the grants.
trend = tokens("2024-25", "Table. Trends in Patent Applications")
t_filed = dict(zip(fy(2020, 5), ints_after(trend, "Filed", 5)))
t_granted = dict(zip(fy(2020, 5), ints_after(trend, "Granted", 5)))
for y, v in t_filed.items():
    check(c25["all applicants"][y] == v, f"filed {y}: App C {c25['all applicants'][y]}, trends table {v}")

write("patent-applications.csv", ["geography", "period", "applicant", "value", "unit", "report_table"], app_rows)

# ---------------------------------------------------------------- Appendix D: grants and patents in force

D_COLS = [
    ("applications filed", "all", UNIT_APPS),
    ("requests for examination", "all", "requests"),
    ("abandoned, no complete specification (Sec. 9(1))", "all", UNIT_APPS),
    ("abandoned, not put in order (Sec. 21(1))", "all", UNIT_APPS),
    ("patents granted", "indian", "patents"),
    ("patents granted", "foreign", "patents"),
    ("patents in force", "indian", "patents"),
    ("patents in force", "foreign", "patents"),
]


def appendix_d(report, first, n):
    toks = tokens(report, "MISCELLANEOUS INFORMATION RELATING TO PATENT")
    heads = "1 2 3 4 5 6 7 8 9".split()  # the column numbers under the heads
    i = next(k for k in range(len(toks)) if toks[k:k + 9] == heads)
    return {y: ints_after(toks[i + 9:], y, 8) for y in fy(first, n)}


d25 = appendix_d("2024-25", 2015, 10)
d23 = appendix_d("2022-23", 2013, 10)
d15 = {}
for line in D_2014_15.strip().splitlines():
    y, *vals = line.split()
    d15[y] = vals
for y, vals in d23.items():
    if y in d25:
        check(d25[y] == vals, f"App D {y}: AR 2024-25 {d25[y]}, AR 2022-23 {vals}")
    if y in d15:
        check(d15[y] == vals, f"App D {y}: AR 2014-15 {d15[y]}, AR 2022-23 {vals}")
for y, v in t_granted.items():
    check(int(d25[y][4]) + int(d25[y][5]) == int(v), f"granted {y}: App D {d25[y][4]}+{d25[y][5]}, trends table {v}")

# Appendix C and D differ on one year's filings (see the README). Every other year agrees.
D_FILED_DIFFERS = {"2019-20": ("56468", "56267")}
for table_c, table_d in ((c15, d15), (c25, d25)):
    for y in table_c["all applicants"]:
        pair = (table_c["all applicants"][y], table_d[y][0])
        if y in D_FILED_DIFFERS:
            check(pair == D_FILED_DIFFERS[y], f"{y}: App C and D filings now {pair}")
        else:
            check(pair[0] == pair[1], f"{y}: App C {pair[0]}, App D {pair[1]}")

grant_rows = []
for report, table in (("2014-15", d15), ("2024-25", d25)):
    for y, vals in table.items():
        for (measure, patentee, unit), v in zip(D_COLS, vals):
            if measure == "applications filed":
                continue  # Appendix C gives the filings, with the routes.
            grant_rows.append(["india", y, measure, patentee, v, unit, "", f"{AR[report]}, Appendix D"])
        # Derived (rule R3): all patentees, the sum of the Indian and foreign columns. Appendix D
        # gives no total; the trends table gives the grants for 2020-21 to 2024-25 (checked above).
        for measure, cols in (("patents granted", (4, 5)), ("patents in force", (6, 7))):
            total = sum(int(vals[c]) for c in cols)
            grant_rows.append(["india", y, measure, "all", str(total), "patents",
                               "sum of Indian and foreign patentees", f"{AR[report]}, Appendix D"])
write("patents-granted-and-in-force.csv",
      ["geography", "period", "measure", "patentee", "value", "unit", "derived", "report_table"], grant_rows)
# Checked value: "As on April 1, 2025 the number of patents in force was 230480" (Chapter 2, section 5).
check(sum(int(d25["2024-25"][c]) for c in (6, 7)) == 230480, "patents in force on 1 April 2025")

# ---------------------------------------------------------------- Appendix B: filings by state

geo = {r["name"].lower(): r["slug"] for r in csv.DictReader(open(a.geo))}
STATE_ALIAS = {
    "andaman & nicobar": "andaman-nicobar",
    "dadra and nagar haveli and daman diu": "dnh-dd",
    "jammu & kashmir": "jammu-kashmir",
}
b = tokens("2024-25", "ACCORDING TO STATE OF ORIGIN")
# Two pages: join the next page's tokens up to Appendix B1.
p = pages("2024-25")
for i, pg in enumerate(p):
    if "ACCORDING TO STATE OF ORIGIN" in " ".join(pg.split()):
        b = b + " ".join(p[i + 1].split()).split("APPENDIX - B 1")[0].split()
        break
heads = "2024-25 2023-24 2024-25 2023-24 2024-25 2023-24".split()
b = b[next(k for k in range(len(b)) if b[k:k + 6] == heads) + 6:]  # after the column heads
B_ROUTES = ["ordinary", "convention", "PCT national phase"]
state_vals = {}
name = []
i = 0
while i < len(b):
    t = b[i]
    if re.fullmatch(r"\d+", t):
        vals = b[i:i + 6]
        if not all(re.fullmatch(r"\d+", v) for v in vals):
            sys.exit(f"App B: bad row at {' '.join(name)!r}: {vals}")
        state_vals[" ".join(name)] = vals
        name = []
        i += 6
    elif t in ("Annual", "Office") and not name:
        # a page header: skip to the page number
        j = i
        while not re.fullmatch(r"\d+", b[j]):
            j += 1
        i = j + 1
    else:
        name.append(t)
        i += 1
total = state_vals.pop("TOTAL")
state_rows = []
sums = [0] * 6
for nm, vals in state_vals.items():
    slug = STATE_ALIAS.get(nm.lower()) or geo.get(nm.lower())
    if not slug:
        sys.exit(f"App B: unknown state {nm!r}")
    for k, v in enumerate(vals):
        sums[k] += int(v)
    for period, cols in (("2024-25", (0, 2, 4)), ("2023-24", (1, 3, 5))):
        for route, c in zip(B_ROUTES, cols):
            state_rows.append([slug, period, route, vals[c], UNIT_APPS, "", f"{AR['2024-25']}, Appendix B"])
        allv = sum(int(vals[c]) for c in cols)
        state_rows.append([slug, period, "all routes", str(allv), UNIT_APPS,
                           "sum of ordinary, convention and PCT national phase", f"{AR['2024-25']}, Appendix B"])
check([str(s) for s in sums] == total, f"App B: states add to {sums}, TOTAL {total}")
check(sum(int(total[c]) for c in (0, 2, 4)) == int(c25["residents"]["2024-25"]), "App B 2024-25 total vs residents")
check(sum(int(total[c]) for c in (1, 3, 5)) == int(c25["residents"]["2023-24"]), "App B 2023-24 total vs residents")
check(len(state_vals) == 35, f"App B: {len(state_vals)} states and UTs")
by = {(r[0], r[1], r[2]): r[3] for r in state_rows}
# Checked values: the report's text, section 1.2 ("Top filing States/Union Territories").
for slug, v in (("tamil-nadu", "15440"), ("karnataka", "8371"), ("maharashtra", "7893"), ("jharkhand", "757")):
    check(by[(slug, "2024-25", "all routes")] == v, f"App B {slug}: {by[(slug, '2024-25', 'all routes')]}, text {v}")
write("patent-applications-by-state.csv",
      ["geography", "period", "route", "value", "unit", "derived", "report_table"], state_rows)

# ---------------------------------------------------------------- Applicant categories

CATS = ["natural person", "startup", "small entity", "educational institution", "other than natural person"]
cat = tokens("2024-25", "Trends in Category-Wise Patent of Applications")
# Years where the categories do not add up to the publisher's Indian total (see the README).
CATEGORY_SUM_EXCEPTIONS = {("2020-21", "indian")}  # 24336 against 24326
cat_rows = []
for y in fy(2020, 5):
    v = ints_after(cat, y, 13)
    ind, fgn = v[0:10:2], v[1:10:2]
    for origin, vals, tot, ckey in (("indian", ind, v[10], "residents"), ("foreign", fgn, v[11], None)):
        s = sum(map(int, vals))
        if (y, origin) in CATEGORY_SUM_EXCEPTIONS:
            check(s != int(tot), f"categories {y} {origin} now add up: remove the exception")
        else:
            check(s == int(tot), f"categories {y} {origin}: {s}, total {tot}")
        for c, x in zip(CATS, vals):
            cat_rows.append(["india", y, c, origin, x, UNIT_APPS, f"{AR['2024-25']}, Chapter 2, Table: Trends in Category-Wise Patent of Applications"])
    check(v[10] == c25["residents"][y], f"categories {y}: Indian {v[10]}, App C residents {c25['residents'][y]}")
    nonres = sum(int(c25[k][y]) for k, _ in ROUTES[1:4])
    if y == "2020-21":  # the table gives 34167; Appendix C's routes add to 34177 (see the README)
        check((int(v[11]), nonres) == (34167, 34177), f"categories {y}: foreign {v[11]}, App C {nonres} changed")
    else:
        check(int(v[11]) == nonres, f"categories {y}: foreign {v[11]}, App C non-residents {nonres}")
    check(v[12] == c25["all applicants"][y], f"categories {y}: grand total {v[12]}")
write("patent-applications-by-applicant-type.csv",
      ["geography", "period", "applicant_type", "origin", "value", "unit", "report_table"], cat_rows)

# ---------------------------------------------------------------- Fields of invention

MAJOR = ["chemical", "pharmaceuticals", "polymer science and technology", "computer science and electronics",
         "communication", "electrical", "physics", "bio-medical", "mechanical engineering", "other fields"]
OTHER_E1 = ["biotechnology", "bio-chemistry", "food", "micro-biology", "metallurgy and material science", "textile",
            "civil engineering", "general engineering", "agro-chemicals", "agriculture engineering",
            "traditional knowledge", "miscellaneous"]
OTHER_F1 = OTHER_E1[:10]
# Where the publisher's field tables do not add up: (major fields, total, other fields' parts,
# "other fields"). See the README.
FIELD_SUM_EXCEPTIONS = {
    ("applications filed", "2020-21"): (58503, 58503, 7453, 7480),
    ("patents granted", "2024-25"): (33506, 33504, 2209, 2211),
}
field_rows = []
for measure, marker, other_marker, other in (
    ("applications filed", "APPENDIX-E NUMBER OF PATENT APPLICATIONS FILED", "APPENDIX-E1", OTHER_E1),
    ("patents granted", "APPENDIX-F NUMBER OF PATENTS GRANTED", "APPENDIX-F1", OTHER_F1),
):
    toks = tokens("2024-25", marker)
    def rows_from(ts):  # from the first year that is a row label, not the "FROM 2020-21 TO" title
        return ts[next(k for k in range(1, len(ts)) if ts[k] == "2020-21" and ts[k - 1] != "FROM"):]
    main_toks = rows_from(toks[:toks.index(other_marker)])
    other_toks = rows_from(toks[toks.index(other_marker):])
    for y in fy(2020, 5):
        v = ints_after(main_toks, y, 11)
        o = ints_after(other_toks, y, len(other))
        sums = (sum(map(int, v[:10])), int(v[10]), sum(map(int, o)), int(v[9]))
        if (measure, y) in FIELD_SUM_EXCEPTIONS:
            check(sums == FIELD_SUM_EXCEPTIONS[(measure, y)], f"{measure} {y}: sums changed to {sums}")
        else:
            check(sums[0] == sums[1] and sums[2] == sums[3], f"{measure} {y}: (fields, total, other parts, other) {sums}")
        app = "E" if measure == "applications filed" else "F"
        unit = UNIT_APPS if measure == "applications filed" else "patents"
        for f, x in zip(MAJOR + ["all fields"], v):
            field_rows.append(["india", y, measure, f, "major", x, unit, f"{AR['2024-25']}, Appendix {app}"])
        for f, x in zip(other, o):
            field_rows.append(["india", y, measure, f, "other", x, unit, f"{AR['2024-25']}, Appendix {app}1"])
    check(ints_after(main_toks, "2024-25", 11)[10] == (c25["all applicants"]["2024-25"] if measure == "applications filed" else t_granted["2024-25"]),
          f"{measure} 2024-25 total")
write("patents-by-field.csv",
      ["geography", "period", "measure", "field", "group", "value", "unit", "report_table"], field_rows)

if errors:
    print("\n".join(errors), file=sys.stderr)
    sys.exit(f"{len(errors)} of {checked} checks failed")
print(f"all {checked} checks passed")
