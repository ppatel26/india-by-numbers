"""Build the agricultural household CSVs from NSS round 77 (NSS Report No. 587, Situation Assessment
of Agricultural Households and Land and Livestock Holdings of Households in Rural India, 2019).

Usage: python3 -I pipeline/agriculture/build_nss77.py [--raw raw/agriculture] [--work work/agriculture]
       [--out research/data/agriculture] [--geo research/data/geography.csv]

Reads the API pages saved by pipeline/education/fetch_nss.py (<raw>/nss77/i<code>.json) and the
report text made by extract_text.sh (<work>/nss77-587/report.txt). The CSVs take the report's
statements and keep the publisher's digits. The script checks every statement value and stops on
any difference:
  - income (Statements 5.1A, 5.1B, 5.1A.1, 5.1B.1) against API indicators 24 and 25: exact;
  - debt (Statements 5.7, 5.7.1) and loan sources (Statement 5.8.1) against Table 29 of Appendix A
    (per 1000 / 10 = percent; a group of sources within the rounding of its parts). API indicator
    33 gives Andhra Pradesh's values under every state, so it is checked for Andhra Pradesh only,
    and the script stops if that fault changes;
  - land possessed (Statement 1.3.1) against API indicator 16 (estimated households, visit 1):
    count / total within 0.05 percentage points (the rounding of the published percentage);
  - operational holdings (Statement 2.9): the size categories add up to 100 within rounding.
It also stops if a statement lists a state that the API or Table 29 lacks.
"""
import argparse
import csv
import json
import re
import sys

ap = argparse.ArgumentParser()
ap.add_argument("--raw", default="raw/agriculture")
ap.add_argument("--work", default="work/agriculture")
ap.add_argument("--out", default="research/data/agriculture")
ap.add_argument("--geo", default="research/data/geography.csv")
a = ap.parse_args()

lines = open(f"{a.work}/nss77-587/report.txt", encoding="utf-8").read().splitlines()
geo = {r["name"].lower(): r["slug"] for r in csv.DictReader(open(a.geo))}
ALIAS = {"all india": "india", "jammu & kashmir": "jammu-kashmir"}
# The report and the API give two groups that are not a state: they are left out (see the README).
GROUPS = {"group of n e states", "n e states", "group of ne states", "group of uts"}
PERIOD = "2018-19"
errors = []
checked = 0


def slug(name):
    n = re.sub(r"\s+", " ", name.strip().lower())
    s = ALIAS.get(n) or geo.get(n)
    if not s:
        sys.exit(f"unknown state name: {name!r}")
    return s


def api(code):
    return json.load(open(f"{a.raw}/nss77/i{code}.json"))["records"]


NUM = r"-?\d[\d,]*(?:\.\d+)?"


def statement(title, ncols, last=("all india", "all sizes")):
    """{row name: [ncols values]} of the statement whose title line matches `title` (a regex).
    Reads from the title to the all-India or all-sizes row."""
    starts = [i for i, l in enumerate(lines) if re.search(title, l)]
    if len(starts) != 1:
        sys.exit(f"{title!r}: {len(starts)} title lines")
    rows = {}
    for l in lines[starts[0] + 1:starts[0] + 120]:
        # The row name is the text before the first run of two or more spaces.
        parts = re.split(r"\s{2,}", l.strip())
        name, nums = re.sub(r"\s+", " ", parts[0]), " ".join(parts[1:]).split()
        if re.fullmatch(NUM, name) or not name or len(nums) != ncols or not all(re.fullmatch(NUM, x) for x in nums):
            continue
        nums = [x.replace(",", "") for x in nums]
        rows[name] = nums
        if name.lower() in last:
            return rows
    sys.exit(f"{title!r}: no closing row")


# Size classes of land possessed: the report's label -> the API's label -> the CSV's label.
SIZES = [("< 0.01", "<0.01", "less than 0.01 ha"), ("0.01 - 0.40", "0.01 - 0.40", "0.01 to 0.40 ha"),
         ("0.40 - 1.00", "0.41 - 1.00", "0.41 to 1.00 ha"), ("1.01 - 2.00", "1.01 - 2.00", "1.01 to 2.00 ha"),
         ("2.01 - 4.00", "2.01 - 4.00", "2.01 to 4.00 ha"), ("4.01 - 10.00", "4.01 - 10.00", "4.01 to 10.00 ha"),
         ("10.00 +", "10.00+", "more than 10.00 ha"), ("all sizes", "All Size", "all sizes")]


def compare(what, report, api_value, scale=1, tol=0.0):
    """Check one report value against the API value (times `scale`)."""
    global checked
    checked += 1
    if api_value is None:
        errors.append(f"{what}: report {report}, no value to check against")
        return
    if abs(float(report) - float(api_value) * scale) > tol + 1e-9:
        errors.append(f"{what}: report {report}, check value {api_value}")


# ---- Income: Statements 5.1A, 5.1B (India by size class) and 5.1A.1, 5.1B.1 (states) ---------------
SOURCES = ["wages", "leasing out of land", "crop production", "farming of animals", "non-farm business", "total"]
API_SOURCE = ["Income From Wages (rs.)", "Income From Leasing Out of Land (rs.)", "Net Receipt From Crop Production (rs.)",
              "Net Receipt From Farming of Animals (rs.)", "Net Receipt From Non-farm Business (rs.)", "Total Income (rs.)"]
income = []
for code, basis, sz, st in ((24, "paid out expenses", r"Statement 5\.1A: Average monthly income", r"Statement 5\.1A\.1:"),
                            (25, "paid out and imputed expenses", r"Statement 5\.1B: Average monthly income", r"Statement 5\.1B\.1:")):
    A = {(r["state"].lower(), r["Land_Possessed(hectares)"], r["sub_indicator"]): r["value"] for r in api(code)
         if r["Social Group"] == "All" and r["season"] == "July 2018–June 2019"}
    by_size = statement(sz, 6)
    for rep, api_label, label in SIZES:
        vals = by_size.get(rep)
        if vals is None:
            sys.exit(f"Statement {sz}: no row {rep}")
        for src, api_src, v in zip(SOURCES, API_SOURCE, vals):
            compare(f"income {basis} India {rep} {src}", v, A.get(("all india", api_label, api_src)))
            income.append({"geography": "india", "period": PERIOD, "land_possessed": label, "source": src,
                           "expenses": basis, "value": v, "unit": "rupees per household per month",
                           "api_indicator": code, "report_table": sz.split(":")[0].replace("\\", "")})
    by_state = statement(st, 6)
    api_states = {k[0] for k in A} - {"all india", "group of ne states", "group of uts"}
    rep_states = {k.lower() for k in by_state} - GROUPS - {"all india"}
    if api_states != rep_states:
        errors.append(f"{st}: states differ: API only {api_states - rep_states}, report only {rep_states - api_states}")
    for name, vals in by_state.items():
        api_name = "group of ne states" if name.lower() == "group of n e states" else name.lower()
        for src, api_src, v in zip(SOURCES, API_SOURCE, vals):
            compare(f"income {basis} {name} {src}", v, A.get((api_name, "All Size", api_src)))
        if name.lower() in GROUPS or name.lower() == "all india":
            continue
        for src, v in zip(SOURCES, vals):
            income.append({"geography": slug(name), "period": PERIOD, "land_possessed": "all sizes", "source": src,
                           "expenses": basis, "value": v, "unit": "rupees per household per month",
                           "api_indicator": code, "report_table": st.split(":")[0].replace("\\", "")})
    # The all-India row of the state statement and of the size class statement must agree.
    if by_state["all India"] != by_size["all sizes"]:
        errors.append(f"{st}: all India {by_state['all India']} differs from {sz} {by_size['all sizes']}")

# ---- Debt and loan sources: Table 29 of Appendix A ------------------------------------------------
# API indicator 33 is faulty: it gives Andhra Pradesh's values under every state and under All
# India (checked 25 Nov 2026, also with the state_code filter). The statements are checked against
# Table 29 of the report instead, and the API only for Andhra Pradesh. The script stops if the API
# fault changes, so that the README and this script get updated.
T29_SOURCES = ["Commercial Bank", "Regional Rural Bank", "Co-operative Society", "Co-operative Bank", "Insurance company",
               "P.F.", "Employer", "Financial Institutions", "NBFC Micro Finance", "Bank Linked SHG/JLG",
               "Non-bank Linked SHG/JLG", "Other Institutional Agencies", "Land Lord", "Agricultural Money Lender",
               "Professional Money Lender", "Input Supplier", "Relatives and Friends", "Chit Fund", "Market Comm Agent",
               "Others", "All"]
T29_NAME = {"all-india": "all india", "group of ne states": "group of n e states", "group of uts": "group of uts"}
t29 = {}  # state (report name, lower case) -> list of 8 rows (7 size classes and all sizes) of 25 values
for i, l in enumerate(lines):
    if not l.startswith("Table 29: Per 1000 distribution of amount of loan outstanding"):
        continue
    head = next(x for x in lines[i + 1:i + 5] if "Season:" in x)
    if "July 2018-December 2018" not in head:
        sys.exit(f"Table 29: unexpected season: {head!r}")
    name = re.sub(r"\s+", " ", head.split("Season:")[0].strip()).lower()
    name = T29_NAME.get(name, name)
    rows = []
    for x in lines[i + 5:i + 40]:
        parts = re.split(r"\s{2,}", x.strip())
        nums = " ".join(parts[1:]).split()
        if len(nums) == 25 and all(re.fullmatch(NUM, n) for n in nums):
            rows.append([n.replace(",", "") for n in nums])
        if parts[0] == "all sizes":
            break
    if len(rows) != 8 or name in t29:
        sys.exit(f"Table 29 {name}: {len(rows)} rows")
    t29[name] = rows
if len(t29) != 31:
    sys.exit(f"Table 29: {len(t29)} pages")


def t29_value(state, size_index, column):
    """Column number as printed in Table 29 (2 to 26)."""
    return t29[state][size_index][column - 2]


# The API fault: every state carries Andhra Pradesh's Table 29 values.
L = {}
for r in api(33):
    L.setdefault(r["state"].lower(), {})[(r["Land_Possessed(hectares)"], r["loan_outstanding"])] = r["value"]
AP = [[t29_value("andhra pradesh", k, c) for c in range(2, 25)] for k in range(8)]
API_LABELS = T29_SOURCES + ["No. per 1000 of Indebted Agricultural Households",
                            "Average Amount of Outstanding Loan per Agricultural Household (Rs.)"]
for st, vals in L.items():
    got = [[vals.get((api_label, x)) for x in API_LABELS] for _, api_label, _ in SIZES]
    if got != AP:
        sys.exit(f"API indicator 33, {st}: no longer equal to Andhra Pradesh's Table 29 values. "
                 "The API fault may be fixed: update this script and the README.")
checked += 23 * 8  # Andhra Pradesh: every API value agrees with Table 29

debt = []
s57 = statement(r"Statement 5\.7: Percentage of indebted", 3)
for k, (rep, api_label, label) in enumerate(SIZES):
    amount, pct, dist = s57[rep]
    compare(f"debt India {rep} amount", amount, t29_value("all india", k, 24))
    compare(f"debt India {rep} indebted", pct, t29_value("all india", k, 23), scale=0.1)
    for measure, v, unit in (("indebted agricultural households", pct, "% of agricultural households"),
                             ("average outstanding loan", amount, "rupees per agricultural household")):
        debt.append({"geography": "india", "period": "2019", "land_possessed": label, "measure": measure, "value": v,
                     "unit": unit, "report_table": "Statement 5.7"})
s571 = statement(r"Statement 5\.7\.1: Average amount", 2)
if set(n.lower() for n in s571) != set(t29):
    errors.append(f"Statement 5.7.1 and Table 29 list different states")
for name, (amount, pct) in s571.items():
    compare(f"debt {name} amount", amount, t29_value(name.lower(), 7, 24))
    compare(f"debt {name} indebted", pct, t29_value(name.lower(), 7, 23), scale=0.1)
    if name.lower() in GROUPS or name.lower() == "all india":
        continue
    for measure, v, unit in (("indebted agricultural households", pct, "% of agricultural households"),
                             ("average outstanding loan", amount, "rupees per agricultural household")):
        debt.append({"geography": slug(name), "period": "2019", "land_possessed": "all sizes", "measure": measure,
                     "value": v, "unit": unit, "report_table": "Statement 5.7.1"})
if s571["all India"] != s57["all sizes"][:2]:
    errors.append("Statement 5.7.1 all India differs from Statement 5.7 all sizes")

# Columns 2 to 11 of Statement 5.8.1, with the Table 29 sources that make up each one.
LOAN_COLS = [
    ("scheduled commercial bank", "institutional", ["Commercial Bank"]),
    ("regional rural bank", "institutional", ["Regional Rural Bank"]),
    ("co-operative society", "institutional", ["Co-operative Society"]),
    ("co-operative bank", "institutional", ["Co-operative Bank"]),
    ("self-help group (bank linked or not)", "institutional", ["Bank Linked SHG/JLG", "Non-bank Linked SHG/JLG"]),
    ("other institutional agencies", "institutional", ["Insurance company", "P.F.", "Employer", "Financial Institutions",
                                                       "NBFC Micro Finance", "Other Institutional Agencies"]),
    ("agricultural moneylender", "non-institutional", ["Agricultural Money Lender"]),
    ("professional moneylender", "non-institutional", ["Professional Money Lender"]),
    ("relatives and friends", "non-institutional", ["Relatives and Friends"]),
    ("other non-institutional agencies", "non-institutional", ["Land Lord", "Input Supplier", "Chit Fund", "Market Comm Agent", "Others"]),
]
# Figure 5.9 of the report gives the all-India institutional and non-institutional shares.
FIG59 = {"institutional": "69.6", "non-institutional": "30.7"}
loans = []
s581 = statement(r"Statement 5\.8\.1: Percentage distribution of amount", 11)
for name, vals in s581.items():
    t_name = "group of n e states" if name.lower() == "n e states" else name.lower()
    if vals[-1] != "100.0":
        errors.append(f"Statement 5.8.1 {name}: all = {vals[-1]}")
    totals = {"institutional": 0.0, "non-institutional": 0.0}
    for (label, kind, parts), v in zip(LOAN_COLS, vals):
        per1000 = sum(int(t29_value(t_name, 7, 2 + T29_SOURCES.index(p))) for p in parts)
        # A group of sources: the sum of rounded per 1000 values may differ by 0.5 per 1000 a part.
        compare(f"loans {name} {label}", v, per1000, scale=0.1, tol=0.05 * (len(parts) - 1))
        totals[kind] += float(v)
    if name.lower() == "all india":
        for kind, want in FIG59.items():
            if f"{totals[kind]:.1f}" != want:
                errors.append(f"loans India {kind}: columns add to {totals[kind]:.1f}, Figure 5.9 gives {want}")
    if t_name in GROUPS:
        continue
    g = slug(name)
    for (label, kind, parts), v in zip(LOAN_COLS, vals):
        loans.append({"geography": g, "period": "2019", "source": label, "source_type": kind, "value": v,
                      "unit": "% of outstanding loan amount", "derived": "", "report_table": "Statement 5.8.1"})
    for kind in ("institutional", "non-institutional"):
        loans.append({"geography": g, "period": "2019", "source": f"all {kind} sources", "source_type": kind,
                      "value": f"{totals[kind]:.1f}", "unit": "% of outstanding loan amount",
                      "derived": f"sum of the {kind} columns of Statement 5.8.1", "report_table": "Statement 5.8.1"})

# ---- Land possessed: Statement 1.3.1 (states), three household types -------------------------------
HH = {"agricultural": "Agricultural Households", "non-agricultural": "Non-agricultural Households", "rural": "All Households"}
N = {}
for r in api(16):
    if r["visit_name"] == "Visit 1":
        N[(r["state"].lower(), r["household_classification"], r["Land_Possessed(hectares)"])] = r["value"]
hh_names = {k[1] for k in N}
land = []
for hh, api_hh in HH.items():
    if api_hh not in hh_names:
        sys.exit(f"API indicator 16: no household type {api_hh!r}; it has {sorted(hh_names)}")
    rows = statement(r"Statement 1\.3\.1: Percentage distribution of " + hh + r" households", 8)
    for name, vals in rows.items():
        api_name = "group of ne states" if name.lower() == "group of n e states" else name.lower()
        total = N.get((api_name, api_hh, "All Size"))
        for (rep, api_label, label), v in zip(SIZES, vals):
            n = N.get((api_name, api_hh, api_label))
            share = None if n is None or total is None else int(n) / int(total) * 100
            compare(f"land {hh} {name} {rep}", v, share, tol=0.05)
            if name.lower() in GROUPS:
                continue
            land.append({"geography": slug(name), "period": "July to December 2018", "household_type": hh,
                         "land_possessed": label, "value": v, "unit": "% of households",
                         "api_indicator": 16, "report_table": "Statement 1.3.1"})

# ---- Operational holdings: Statement 2.9 (India, 2018-19, 2012-13, 2002-03) ------------------------
CATS = [("Landless (<=0.002)", "landless", "up to 0.002 ha"), ("Marginal (0.002-1.000)", "marginal", "0.002 to 1.000 ha"),
        ("Small (1.000-2.000)", "small", "1.000 to 2.000 ha"), ("Semi-medium (2.000-4.000)", "semi-medium", "2.000 to 4.000 ha"),
        ("Medium (4.000-10.000)", "medium", "4.000 to 10.000 ha"), ("Large (>10.000)", "large", "more than 10.000 ha"),
        ("all sizes", "all sizes", "all sizes")]
i29 = next(i for i, l in enumerate(lines) if "Statement 2.9: Percentage distribution of number of operational" in l)
holdings = []
COLS = [("2018-19", "", "share of holdings"), ("2012-13", "", "share of holdings"), ("2002-03", "kharif", "share of holdings"),
        ("2002-03", "rabi", "share of holdings"), ("2018-19", "", "share of area operated"), ("2012-13", "", "share of area operated"),
        ("2002-03", "kharif", "share of area operated"), ("2002-03", "rabi", "share of area operated")]
for rep, cat, size in CATS:
    l = next((l for l in lines[i29:i29 + 30] if l.strip().startswith(rep)), None)
    if l is None:
        sys.exit(f"Statement 2.9: no row {rep}")
    nums = re.findall(r"\d+\.\d", l[l.index(rep) + len(rep):])
    cols = COLS if len(nums) == 8 else [c for c in COLS if c[0] != "2002-03"] if len(nums) == 4 else None
    if cols is None:
        sys.exit(f"Statement 2.9 {rep}: {nums}")
    got = dict(zip(cols, nums))
    for c in COLS:
        period, season, measure = c
        holdings.append({"geography": "india", "period": period, "season": season, "size_category": cat,
                         "size_class": size, "measure": measure, "value": got.get(c, ""), "unit": "%",
                         "report_table": "Statement 2.9"})
for c in COLS:
    parts = [float(r["value"]) for r in holdings if (r["period"], r["season"], r["measure"]) == c and r["value"] and r["size_category"] != "all sizes"]
    if abs(sum(parts) - 100) > 0.35:
        errors.append(f"Statement 2.9 {c}: categories add to {sum(parts):.1f}")

if errors:
    sys.exit(f"{len(errors)} differences:\n" + "\n".join(errors))
print(f"{checked} report values agree with the API or with Table 29")


def write(name, rows):
    with open(f"{a.out}/{name}", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0]), lineterminator="\n")
        w.writeheader()
        w.writerows(rows)
    print(f"{name}: {len(rows)} rows")


write("agri-household-income-by-source.csv", income)
write("agri-household-debt.csv", debt)
write("agri-household-loans-by-source.csv", loans)
write("land-possessed-by-size-class.csv", land)
write("operational-holdings-nss.csv", holdings)
