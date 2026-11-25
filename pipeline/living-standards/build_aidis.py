"""Household assets and debt CSVs from MoSPI NSS Report 588, All India Debt & Investment Survey 2019
(NSS round 77, January to December 2019; assets and debt as on 30 June 2018), and its press note of
10 Sep 2021.

First run pipeline/common/fetch.sh for the report and the press note, then
pipeline/living-standards/extract_text.sh.
Run: python3 -I pipeline/living-standards/build_aidis.py [--work work/living-standards]
     [--out research/data/living-standards] [--geo research/data/geography.csv]

Reads the layout text of Summary Statements 2, 7, 8 and 10, chapter Statements 3.8, 3.12 and 3.15,
RSE Statement R1, and the press note. Every state row must have exactly the number of cells the
table has; a "-" (no sample) is an empty value. The script stops if any check fails:
  - Statement 2 incidence of indebtedness equals the "All" column of Statement 7;
  - Statement 7: "institutional only" + "non-institutional only" + "both" is "All", within rounding;
  - Statement 8: institutional + non-institutional is at most 100, within rounding;
  - Statement 10: each row adds up to 100, within rounding;
  - the all-India rows equal Statements 3.8, 3.12 and 3.15, and the press note;
  - the checked values in CHECKS, read by eye from the report pages.
"""
import argparse
import csv
import os
import re
import sys

ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
ap.add_argument("--work", default="work/living-standards")
ap.add_argument("--out", default="research/data/living-standards")
ap.add_argument("--geo", default="research/data/geography.csv")
A = ap.parse_args()
os.makedirs(A.out, exist_ok=True)

LINES = open(f"{A.work}/aidis-588/report.txt", encoding="utf-8").read().splitlines()
PRESS = re.sub(r"\s+", " ", open(f"{A.work}/aidis-588/press-note.txt", encoding="utf-8").read())
PERIOD = "2018-06-30"
R588 = "NSS Report 588"
errors = []

# ---------------------------------------------------------------- geography

GEO = list(csv.DictReader(open(A.geo, encoding="utf-8")))
NAMES = {re.sub(r"[^a-z]", "", r["name"].lower().replace("&", "and")): r["slug"] for r in GEO}
ALIAS = {"allindia": "india", "aandnislands": "andaman-nicobar"}
# In 2018 these were two UTs; today they are one (dnh-dd). The CSVs leave them out (README).
OLD_UTS = {"dadraandnagarhaveli", "damananddiu"}


def slug(name):
    k = re.sub(r"[^a-z]", "", name.lower().replace("&", "and"))
    if k in OLD_UTS:
        return None
    s = ALIAS.get(k) or NAMES.get(k)
    if not s:
        sys.exit(f"unknown state name: {name!r}")
    return s


NUM = re.compile(r"-?\d[\d,]*(\.\d+)?|-")


def split_row(line):
    """Row name and cells: the name is the words before the first number or dash."""
    toks = line.split()
    i = 0
    while i < len(toks) and not NUM.fullmatch(toks[i]):
        i += 1
    return " ".join(toks[:i]), toks[i:]


def clean(cell):
    return "" if cell == "-" else cell.replace(",", "")


def state_table(start, ncols, label):
    """{slug: [cells]} from the line `start` to the All-India row. Stops on a row of the wrong width."""
    rows, names = {}, []
    for l in LINES[start + 1 : start + 80]:
        name, cells = split_row(l)
        if not name or not cells or name.lower().startswith(("statement", "nss report", "summary")):
            continue
        if not re.match(r"^[A-Z]", name) or name in ("AVA", "IOI", "State/UT"):
            continue
        if len(cells) != ncols:
            sys.exit(f"{label}: row {name!r} has {len(cells)} cells, expected {ncols}: {l.strip()!r}")
        names.append(name)
        s = slug(name)
        if s:
            rows[s] = [clean(c) for c in cells]
        if s == "india":
            if len(names) != 37:
                sys.exit(f"{label}: {len(names)} rows, expected 37 (36 states and UTs and All-India)")
            return rows
    sys.exit(f"{label}: no All-India row")


def find(pattern, after=0, nth=0):
    hits = [i for i, l in enumerate(LINES) if i >= after and re.search(pattern, l)]
    if len(hits) <= nth:
        sys.exit(f"no line matches {pattern!r}")
    return hits[nth]


def near(a, b, tol):
    return abs(float(a or 0) - float(b or 0)) <= tol + 1e-9


PENDING = []


def write(name, header, rows):
    """Queue a CSV: the files are written only after every check passes."""
    PENDING.append((name, header, rows))


TYPES = {"rural": ["cultivator", "non-cultivator", "all"], "urban": ["self-employed", "others", "all"]}

# ---------------------------------------------------------------- Statement 2

S2_MEASURES = [
    ("average value of assets", "thousand rupees per household"),
    ("average debt", "thousand rupees per household"),
    ("average debt per indebted household", "thousand rupees per indebted household"),
    ("incidence of indebtedness", "% of households"),
    ("debt-asset ratio", "% of assets"),
]
s2 = {}
for n, sector in enumerate(["rural", "urban"]):
    i = find(r"^Statement 2: Average Value of Assets", nth=n)
    if sector.capitalize() not in " ".join(LINES[i + 1 : i + 4]):
        sys.exit(f"Statement 2, page {n + 1}: not the {sector} page")
    s2[sector] = state_table(i, 15, f"Statement 2 {sector}")

# RSE Statement R1: AVA, IOI, AOD for 18 major states and India.
i = find(r"^ *Statement R1: Relative Standard Error")
rse = {}
for l in LINES[i + 4 : i + 30]:
    name, cells = split_row(l)
    if name and len(cells) == 6:
        s = slug(name)
        for sector, part in (("rural", cells[:3]), ("urban", cells[3:])):
            ava, ioi, aod = part
            rse[(s, sector, "average value of assets")] = ava
            rse[(s, sector, "incidence of indebtedness")] = ioi
            rse[(s, sector, "average debt")] = aod
        if s == "india":
            break
if len({k[0] for k in rse}) != 19:
    sys.exit(f"Statement R1: {len({k[0] for k in rse})} rows, expected 19")

rows = []
for sector in ("rural", "urban"):
    for geo, cells in s2[sector].items():
        for t, htype in enumerate(TYPES[sector]):
            for m, (measure, unit) in enumerate(S2_MEASURES):
                v = cells[t * 5 + m]
                r = rse.get((geo, sector, measure), "") if htype == "all" else ""
                rows.append([geo, PERIOD, sector, htype, measure, v, unit, r, f"{R588}, Summary Statement 2" + ("; RSE Statement R1" if r else "")])
ASSETS_DEBT = rows
write("household-assets-and-debt-by-state.csv",
      ["geography", "period", "sector", "household_type", "measure", "value", "unit", "rse_percent", "report_table"], rows)

# ---------------------------------------------------------------- Statement 7

AGENCY7 = ["institutional only", "non-institutional only", "both", "all"]
s7 = {}
for sector in ("rural", "urban"):
    i = find(rf"Statement 7: Incidence of indebtedness .* in {sector} India for each State/UT")
    s7[sector] = state_table(i, 12, f"Statement 7 {sector}")

rows = []
for sector in ("rural", "urban"):
    if set(s7[sector]) != set(s2[sector]):
        errors.append(f"Statement 7 {sector}: states differ from Statement 2")
    for geo, cells in s7[sector].items():
        for t, htype in enumerate(TYPES[sector]):
            part = cells[t * 4 : t * 4 + 4]
            if not near(sum(float(c or 0) for c in part[:3]), part[3], 0.15):
                errors.append(f"Statement 7 {sector} {geo} {htype}: parts {part[:3]} do not add up to {part[3]}")
            ioi2 = s2[sector][geo][t * 5 + 3]
            if part[3] != ioi2:
                errors.append(f"Statement 7 {sector} {geo} {htype}: All {part[3]} but Statement 2 IOI {ioi2}")
            for agency, v in zip(AGENCY7, part):
                rows.append([geo, PERIOD, sector, htype, agency, v, "% of households", f"{R588}, Summary Statement 7"])
INDEBTED_AGENCY = rows
write("indebtedness-by-credit-agency-by-state.csv",
      ["geography", "period", "sector", "household_type", "credit_agency", "value", "unit", "report_table"], rows)

# ---------------------------------------------------------------- Statement 8

i = find(r"Statement 8: Percentage distribution of outstanding cash debt as on 30.06.2018 by credit agencies")
s8 = state_table(i, 18, "Statement 8")
rows = []
for geo, cells in s8.items():
    for n, (sector, htype) in enumerate([(s, t) for s in ("rural", "urban") for t in TYPES[s]]):
        inst, non, total = cells[n * 3 : n * 3 + 3]
        if float(inst) + float(non) > float(total) + 0.1:
            errors.append(f"Statement 8 {geo} {sector} {htype}: {inst} + {non} is more than {total}")
        for agency, v in (("institutional", inst), ("non-institutional", non), ("all", total)):
            rows.append([geo, PERIOD, sector, htype, agency, v, "% of outstanding cash debt", f"{R588}, Summary Statement 8"])
DEBT_AGENCY_STATE = rows
write("debt-by-credit-agency-by-state.csv",
      ["geography", "period", "sector", "household_type", "credit_agency", "value", "unit", "report_table"], rows)

# ---------------------------------------------------------------- Statement 3.12 (India, each agency)

AGENCIES = [
    ("Scheduled commercial bank", "scheduled commercial bank", "institutional"),
    ("Regional rural bank", "regional rural bank", "institutional"),
    ("Co-operative society/bank", "co-operative society or bank", "institutional"),
    ("Co-operative bank", "co-operative bank", "institutional"),
    ("Insurance companies", "insurance companies", "institutional"),
    ("Provident fund", "provident fund", "institutional"),
    ("Employer", "employer", "institutional"),
    ("Financial institution", "financial institution", "institutional"),
    ("NBFCs including MFIs", "NBFCs including MFIs", "institutional"),
    ("Bank linked SHG/JLG", "bank-linked SHG or JLG", "institutional"),
    ("Non-bank linked SHG/JLG", "non-bank-linked SHG or JLG", "institutional"),
    ("Other institutional agencies", "other institutional agencies", "institutional"),
    ("All institutional agencies", "all institutional agencies", "total"),
    ("Landlord", "landlord", "non-institutional"),
    ("Agricultural moneylender", "agricultural moneylender", "non-institutional"),
    ("Professional moneylender", "professional moneylender", "non-institutional"),
    ("Input supplier", "input supplier", "non-institutional"),
    ("Relatives and friends", "relatives and friends", "non-institutional"),
    ("Chit fund", "chit fund", "non-institutional"),
    ("Market commission", "market commission agent or trader", "non-institutional"),
    ("Others", "other non-institutional agencies", "non-institutional"),
    ("All non-institutional", "all non-institutional agencies", "total"),
    ("All agencies", "all agencies", "total"),
]
start = find(r"^Statement 3.12: Percentage distribution of amount of outstanding cash debt")
s312, k = {}, 0
for l in LINES[start : start + 70]:
    if k == len(AGENCIES):
        break
    label = AGENCIES[k][0]
    nums = re.findall(r"\d+\.\d", l)
    # Two labels wrap onto the next line ("agent/traders", "agencies"): their numbers sit on the
    # first or the middle line.
    if l.strip().startswith(label) or (label in ("Market commission", "All non-institutional") and label in l):
        if len(nums) != 6:
            j = LINES.index(l, start)
            nums = re.findall(r"\d+\.\d", LINES[j + 1])
        if len(nums) != 6:
            sys.exit(f"Statement 3.12: {label!r} has {len(nums)} cells")
        s312[AGENCIES[k][1]] = nums
        k += 1
if k != len(AGENCIES):
    sys.exit(f"Statement 3.12: read {k} of {len(AGENCIES)} rows")
COLS312 = [("rural", "cultivator"), ("rural", "non-cultivator"), ("rural", "all"),
           ("urban", "self-employed"), ("urban", "others"), ("urban", "all")]
rows = []
for c, (sector, htype) in enumerate(COLS312):
    for group, kinds in (("all institutional agencies", "institutional"), ("all non-institutional agencies", "non-institutional")):
        parts = sum(float(s312[a[1]][c]) for a in AGENCIES if a[2] == kinds)
        n = sum(1 for a in AGENCIES if a[2] == kinds)
        if not near(parts, s312[group][c], 0.05 * n):
            errors.append(f"Statement 3.12 {sector} {htype}: {kinds} parts {parts:.1f} against {s312[group][c]}")
    # The all-India row of Statement 8 must equal the totals of Statement 3.12.
    i8 = c * 3
    for agency, v in (("all institutional agencies", s8["india"][i8]), ("all non-institutional agencies", s8["india"][i8 + 1])):
        if s312[agency][c] != v:
            errors.append(f"Statement 3.12 {sector} {htype} {agency}: {s312[agency][c]} but Statement 8 {v}")
    for _, name, kind in AGENCIES:
        rows.append(["india", PERIOD, sector, htype, name, kind, s312[name][c], "% of outstanding cash debt", f"{R588}, Statement 3.12"])
DEBT_AGENCY_INDIA = rows
write("debt-by-credit-agency-india.csv",
      ["geography", "period", "sector", "household_type", "credit_agency", "agency_type", "value", "unit", "report_table"], rows)

# ---------------------------------------------------------------- Statement 10

BANDS = ["nil", "less than 6", "6 to 10", "10 to 15", "15 to 20", "20 to 25", "25 to 30", "30 to 50", "50 to 100", "100 or more", "all"]
s10 = {}
for n, agency in enumerate(["institutional", "non-institutional", "all"]):
    i = find(r"^Statement 10: Percentage distribution of amount of outstanding cash debt", nth=n)
    head = " ".join(LINES[i + 1 : i + 3])
    want = {"institutional": "Credit agency: Institutional", "non-institutional": "Credit agency: Non-institutional", "all": "Credit agency: All"}[agency]
    if want not in head:
        sys.exit(f"Statement 10, page {n + 1}: not {want!r}")
    s10[agency] = state_table(i, 22, f"Statement 10 {agency}")

# Statement 3.15: all-India, institutional, non-institutional and all, rural and urban.
i = find(r"^ *Statement 3.15: Percentage distribution of amount of outstanding cash debt")
s315 = {}
for l in LINES[i + 8 : i + 30]:
    toks = l.split()
    if toks and toks[0] in ("nil", "<6", "6-10", "10-15", "15-20", "20-25", "25-30", "30-50", "50-100", "≥100", "All"):
        if len(toks) != 7:
            sys.exit(f"Statement 3.15: {l.strip()!r}")
        s315[toks[0]] = toks[1:]
if len(s315) != 11:
    sys.exit(f"Statement 3.15: {len(s315)} rows, expected 11")
BAND_KEYS = ["nil", "<6", "6-10", "10-15", "15-20", "20-25", "25-30", "30-50", "50-100", "≥100", "All"]

rows = []
for a, agency in enumerate(["institutional", "non-institutional", "all"]):
    for geo, cells in s10[agency].items():
        for s, sector in enumerate(["rural", "urban"]):
            part = cells[s * 11 : s * 11 + 11]
            total = sum(float(c or 0) for c in part[:10])
            if part[10] and float(part[10]) > 0 and not near(total, part[10], 0.55):
                errors.append(f"Statement 10 {agency} {sector} {geo}: bands add up to {total:.1f}, not {part[10]}")
            if geo == "india":
                col = {"rural": 0, "urban": 3}[sector] + a
                for b, key in enumerate(BAND_KEYS):
                    if part[b] != s315[key][col]:
                        errors.append(f"Statement 10 {agency} {sector} {key}: {part[b]} but Statement 3.15 {s315[key][col]}")
            for band, v in zip(BANDS, part):
                rows.append([geo, PERIOD, sector, agency, band, v, "% of outstanding cash debt", f"{R588}, Summary Statement 10"])
DEBT_ROI = rows
write("debt-by-interest-rate-by-state.csv",
      ["geography", "period", "sector", "credit_agency", "interest_rate_band", "value", "unit", "report_table"], rows)

# ---------------------------------------------------------------- India in rupees: Statement 3.8 and the press note

i = find(r"^ *Statement 3.8: IOI and AOD and AODL as on 30.06.2018")
s38 = {}
sector = None
for l in LINES[i : i + 20]:
    if l.strip() in ("Rural", "Urban"):
        sector = l.strip().lower()
        continue
    m = re.match(r"^\s*(Cultivator|Non-cultivator|All|Self-employed|Others)\s+(\d+\.\d)\s+([\d,]+)\s+([\d,]+)\s*$", l)
    if m:
        if not sector:
            sys.exit("Statement 3.8: a row before the Rural label")
        s38[(sector, m[1].lower())] = [m[2], m[3].replace(",", ""), m[4].replace(",", "")]
if len(s38) != 6:
    sys.exit(f"Statement 3.8: {len(s38)} rows, expected 6")


def press(pattern):
    m = re.search(pattern, PRESS)
    if not m:
        sys.exit(f"press note: no match for {pattern!r}")
    return [g.replace(",", "") for g in m.groups()]


R = r"Rs\. ?([\d,]+)"
ava = {}
v = press(rf"Average value of asset per household was {R} in Rural India \({R} for cultivator households, {R} for non-cultivator households\)")
ava.update({("rural", "all"): v[0], ("rural", "cultivator"): v[1], ("rural", "non-cultivator"): v[2]})
v = press(rf"Average value of asset per household was {R} in Urban India \({R} for self-employed households, {R} for other households\)")
ava.update({("urban", "all"): v[0], ("urban", "self-employed"): v[1], ("urban", "others"): v[2]})
aod_p = press(rf"Average amount of debt was {R} among rural households \({R} for cultivator households, {R} for non-cultivator households\)")
aod_p += press(rf"Average amount of debt was {R} among urban households \({R} for self-employed households, {R} for other households\)")
aodl_p = press(rf"Average amount of debt was {R} among indebted households in Rural India \({R} for cultivator households, {R} for non-cultivator households\)")
aodl_p += press(rf"Average amount of debt was {R} among indebted households in Urban India \({R} for self-employed households, {R} for other households\)")

ORDER = [("rural", "all"), ("rural", "cultivator"), ("rural", "non-cultivator"), ("urban", "all"), ("urban", "self-employed"), ("urban", "others")]
rows = []
for n, (sector, htype) in enumerate(ORDER):
    ioi, aod, aodl = s38[(sector, htype)]
    if aod != aod_p[n] or aodl != aodl_p[n]:
        errors.append(f"Statement 3.8 {sector} {htype}: {aod}, {aodl} but press note {aod_p[n]}, {aodl_p[n]}")
    t = TYPES[sector].index(htype)
    st2 = s2[sector]["india"][t * 5 : t * 5 + 5]
    # Statement 2 prints thousands of rupees: each rupee value must round to it.
    for name, rupees, thousand in (("AVA", ava[(sector, htype)], st2[0]), ("AOD", aod, st2[1]), ("AODL", aodl, st2[2])):
        if round(int(rupees) / 1000) != int(thousand):
            errors.append(f"{sector} {htype} {name}: {rupees} rupees does not round to Statement 2's {thousand} thousand")
    if ioi != st2[3]:
        errors.append(f"Statement 3.8 {sector} {htype}: IOI {ioi} but Statement 2 {st2[3]}")
    for measure, value, unit, table in (
        ("average value of assets", ava[(sector, htype)], "rupees per household", "Press note of 10 Sep 2021; rounds to Summary Statement 2"),
        ("average debt", aod, "rupees per household", f"{R588}, Statement 3.8; press note"),
        ("average debt per indebted household", aodl, "rupees per indebted household", f"{R588}, Statement 3.8; press note"),
        ("incidence of indebtedness", ioi, "% of households", f"{R588}, Statement 3.8 and Summary Statement 2"),
    ):
        rows.append(["india", PERIOD, sector, htype, measure, value, unit, table])
ASSETS_INDIA = rows
write("household-assets-and-debt-india.csv",
      ["geography", "period", "sector", "household_type", "measure", "value", "unit", "report_table"], rows)

# ---------------------------------------------------------------- values read by eye from the report

CHECKS = [
    # household-assets-and-debt-by-state.csv (Summary Statement 2, pages S2 and S3)
    (ASSETS_DEBT, ("telangana", "rural", "all", "incidence of indebtedness"), "67.2"),
    (ASSETS_DEBT, ("kerala", "urban", "all", "average debt"), "233"),
    (ASSETS_DEBT, ("nagaland", "rural", "all", "incidence of indebtedness"), "6.6"),
    # indebtedness-by-credit-agency-by-state.csv (Summary Statement 7, pages S21 and S22)
    (INDEBTED_AGENCY, ("india", "rural", "all", "non-institutional only"), "10.2"),
    (INDEBTED_AGENCY, ("andhra-pradesh", "rural", "cultivator", "both"), "31.9"),
    (INDEBTED_AGENCY, ("delhi", "rural", "cultivator", "non-institutional only"), ""),
    # debt-by-credit-agency-by-state.csv (Summary Statement 8, page S23)
    (DEBT_AGENCY_STATE, ("india", "rural", "all", "institutional"), "66.1"),
    (DEBT_AGENCY_STATE, ("telangana", "rural", "all", "non-institutional"), "59.2"),
    (DEBT_AGENCY_STATE, ("assam", "urban", "all", "institutional"), "98.7"),
    # debt-by-credit-agency-india.csv (Statement 3.12, pages 30 and 31)
    (DEBT_AGENCY_INDIA, ("india", "rural", "all", "professional moneylender"), "16.5"),
    (DEBT_AGENCY_INDIA, ("india", "urban", "all", "scheduled commercial bank"), "68.4"),
    (DEBT_AGENCY_INDIA, ("india", "rural", "all", "relatives and friends"), "6.8"),
    # debt-by-interest-rate-by-state.csv (Summary Statement 10, pages S25 to S27)
    (DEBT_ROI, ("india", "rural", "non-institutional", "20 to 25"), "44.0"),
    (DEBT_ROI, ("india", "urban", "institutional", "6 to 10"), "50.7"),
    (DEBT_ROI, ("rajasthan", "rural", "non-institutional", "20 to 25"), "85.1"),
    # household-assets-and-debt-india.csv (Statement 3.8 and the press note)
    (ASSETS_INDIA, ("india", "rural", "all", "average value of assets"), "1592379"),
    (ASSETS_INDIA, ("india", "rural", "all", "average debt"), "59748"),
    (ASSETS_INDIA, ("india", "urban", "all", "average debt per indebted household"), "536861"),
]
for rows, key, want in CHECKS:
    got = [r for r in rows if (r[0], r[2], r[3], r[4]) == key]
    if len(got) != 1:
        errors.append(f"check {key}: {len(got)} rows")
        continue
    value = got[0][6] if rows is DEBT_AGENCY_INDIA else got[0][5]
    if value != want:
        errors.append(f"check {key}: {value!r}, the report prints {want!r}")

if errors:
    print("\n".join(errors), file=sys.stderr)
    sys.exit(f"{len(errors)} checks failed")
for name, header, rows in PENDING:
    with open(f"{A.out}/{name}", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(header)
        w.writerows(rows)
    print(f"{name}: {len(rows)} rows")
print(f"all checks passed ({len(CHECKS)} values read by eye)")
