"""Build the living standards CSVs from HCES 2022-23 and 2023-24, CAMS 2022-23 and NSS round 76.

Usage: python3 -I pipeline/living-standards/build_living_standards.py [--raw raw/living-standards]
       [--work work/living-standards] [--out research/data/living-standards]
       [--geo research/data/geography.csv]

Reads the API pages saved by fetch_hces.py (<raw>/hces/i<code>.json) and by
pipeline/education/fetch_nss.py (<raw>/nss79/i<code>.json, <raw>/nss76/i<code>.json), and the
report text made by extract_text.sh (<work>/<folder>/report.txt). Writes the publisher's digits.
Checks every API value against the matching report table, and every report row against the API.
Stops on any difference. Values that only the report gives (rounds before 2022-23) come from the
report tables and say so in the `source` column.
"""
import argparse
import csv
import json
import re
import sys

ap = argparse.ArgumentParser()
ap.add_argument("--raw", default="raw/living-standards")
ap.add_argument("--work", default="work/living-standards")
ap.add_argument("--out", default="research/data/living-standards")
ap.add_argument("--geo", default="research/data/geography.csv")
a = ap.parse_args()

geo = {r["name"].lower(): r["slug"] for r in csv.DictReader(open(a.geo))}
ALIAS = {
    "all india": "india",
    "all-india": "india",
    "a & n islands": "andaman-nicobar",
    "andaman & n. island": "andaman-nicobar",
    "andaman & nicobar islands": "andaman-nicobar",
    "jammu & kashmir": "jammu-kashmir",
    "megahlaya": "meghalaya",  # CAMS Table 25 spelling
    "telengana": "telangana",  # CAMS Table 25 spelling
}
# NSS round 76 (2018) units that are not a current state or UT. They are left out (see the README).
NSS76_SKIP = {"dadra & nagar haveli", "daman & diu", "group of ne states", "group of north eastern states", "group of uts"}


def slug(name):
    n = re.sub(r"\s+", " ", name.strip().lower())
    if n.startswith("dadra") and "daman" in n:
        return "dnh-dd"
    s = ALIAS.get(n) or geo.get(n)
    if not s:
        sys.exit(f"unknown state name: {name!r}")
    return s


def text(folder):
    return open(f"{a.work}/{folder}/report.txt", encoding="utf-8").read().splitlines()


def api(folder, code):
    return json.load(open(f"{a.raw}/{folder}/i{code}.json"))["records"]


def fix(v, decimals):
    """The API drops trailing zeros (0.2 for the report's 0.200). Print the report's decimals,
    after a check that the API gives no more digits than that. '-' (no sample) becomes empty."""
    v = v.strip()
    if v in ("-", ""):
        return ""
    if "." in v and len(v.split(".")[1]) > decimals:
        sys.exit(f"value {v} has more than {decimals} decimals")
    return f"{float(v):.{decimals}f}" if decimals else str(int(float(v)))


def same(x, y):
    if x == "" or y == "":
        return x == y
    return float(x) == float(y)


# ---- Report text parsers -------------------------------------------------------------------
NUM = r"-|\d[\d,]*(?:\.\d+)?"
LINE = re.compile(r"^(?P<name>.*?)(?P<nums>(?:\s+(?:" + NUM + r"))+)\s*$")


def split(line, positions=False):
    """(name, [numbers]) for a line that ends in numbers, else (text, None). With `positions`,
    each number comes as (column where it ends, number)."""
    m = LINE.match(" " + line)
    if not m:
        return line.strip(), None
    if positions:
        start = m.start("nums")
        return m.group("name").strip(), [(start + t.end(), t.group().replace(",", ""))
                                         for t in re.finditer(r"\S+", m.group("nums"))]
    return m.group("name").strip(), [x.replace(",", "") for x in m.group("nums").split()]


def state_pages(lines, title, ncols, skip=()):
    """Every page of a state table: a list of (header text, {slug: [ncols values]}). A page starts
    at a line that begins with `title` and ends at the all-India row. Wrapped Dadra rows and rows
    split over two lines are joined."""
    pages = []
    for i, line in enumerate(lines):
        if not line.strip().startswith(title):
            continue
        header, rows, pending, partial = [], {}, "", None
        for l in lines[i:i + 80]:
            name, pos = split(l, positions=True)
            nums = [x for _, x in pos] if pos is not None else None
            if nums is None or (not name and not partial and not pending):
                if nums is None and name:
                    if not rows:
                        header.append(name.lower())
                    if name.lower().startswith(("dadra", "haveli")):
                        pending = name
                continue
            if partial:  # second half of a row split over two lines: order the values by column
                pname, ppos = partial
                nums, name, partial = [x for _, x in sorted(ppos + pos)], pname, None
            full = (pending + " " + name).strip() if pending and not name.lower().startswith(("dadra",)) else name
            if re.sub(r"\s+", " ", full.lower()) in skip:  # before the Dadra join: 2018 has two separate UTs
                pending = ""
                continue
            if full.lower().startswith(("dadra", "haveli", "and daman")) or (pending and name.lower() in ("", "diu", "& diu")):
                full = "Dadra & Nagar Haveli and Daman & Diu"
            pending = ""
            if len(nums) < ncols and full.lower().startswith("dadra"):
                partial = (full, pos)
                continue
            if len(nums) != ncols:
                if not rows:  # a header line that ends in a number ('within 30')
                    header.append(name.lower())
                    continue
                break
            key = re.sub(r"\s+", " ", full.lower())
            if key in skip:
                continue
            rows[slug(full)] = nums
            if slug(full) == "india":
                pages.append((" | ".join(header), rows))
                break
    return pages


def page(lines, title, ncols, *subs, skip=()):
    """The one page of `title` whose header matches every string in `subs`."""
    def has(h, s):  # '=text' must be a whole header line; other strings may be part of the header
        return s[1:] in h.split(" | ") if s.startswith("=") else s in h

    hits = [rows for h, rows in state_pages(lines, title, ncols, skip) if all(has(h, s) for s in subs)]
    if len(hits) != 1:
        sys.exit(f"{title} {subs}: {len(hits)} pages found, expected 1")
    if len(hits[0]) < 30:
        sys.exit(f"{title} {subs}: only {len(hits[0])} rows")
    return hits[0]


class Check:
    def __init__(self):
        self.n = 0

    def table(self, name, report_rows, have):
        """report_rows: {key: value}; have: {key: value} from the API. Both must agree in full."""
        bad = [k for k in report_rows if k not in have or not same(have[k], report_rows[k])]
        extra = [k for k in have if k not in report_rows]
        for k in bad[:10]:
            print(f"  MISMATCH {name} {k}: API {have.get(k)!r}, report {report_rows[k]!r}")
        for k in extra[:10]:
            print(f"  NOT IN REPORT {name} {k}: API {have[k]!r}")
        print(f"check {name}: {len(report_rows)} cells, {len(bad)} differ, {len(extra)} API values not in the table")
        if bad or extra:
            sys.exit(1)
        self.n += len(report_rows)


chk = Check()
ORDER_GEO = ["india"] + sorted(set(geo.values()))


def write(name, header, rows):
    rows.sort(key=lambda r: ORDER_GEO.index(r[0]))  # stable: India first, then states
    with open(f"{a.out}/{name}", "w", newline="") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(header)
        w.writerows(rows)
    print(f"{name}: {len(rows)} rows")


# ==== HCES 2022-23 and 2023-24 ==============================================================
REPORT = {"2023-24": ("hces-2023-24", "NSS Report 592"), "2022-23": ("hces-2022-23", "NSS Report 591")}
H = {p: text(f) for p, (f, _) in REPORT.items()}
IMP = {"Without Imputation": "without", "With Imputation": "with"}
SEC = {"Rural": "rural", "Urban": "urban"}
RS = "rupees per person per month"

# ---- MPCE by state (API indicator 1, Statement 1; RSE from Tables C1 and C2) ----------------
mpce, have = [], {}
for r in api("hces", 1):
    k = (slug(r["state"]), r["year"], SEC[r["sector"]], IMP[r["imputation_type"]])
    if k in have:
        sys.exit(f"duplicate API row {k}")
    have[k] = fix(r["value"], 0)
rse = {}
for p, lines in H.items():
    rep = {}
    for g, v in page(lines, "Statement 1:", 4).items():
        for (sec, imp), x in zip([("rural", "without"), ("urban", "without"), ("rural", "with"), ("urban", "with")], v):
            rep[(g, p, sec, imp)] = x
    chk.table(f"MPCE {REPORT[p][1]} Statement 1", rep, {k: v for k, v in have.items() if k[1] == p})
    for t, imp in (("Table C1:", "without"), ("Table C2:", "with")):
        for g, v in page(lines, t, 6).items():
            rse[(g, p, "rural", imp)], rse[(g, p, "urban", imp)] = v[0], v[1]
for k, v in have.items():
    g, p, sec, imp = k
    if k not in rse:
        sys.exit(f"no RSE for {k}")
    mpce.append([g, p, sec, imp, v, RS, rse[k], "1", f"{REPORT[p][1]}, Statement 1; RSE Table {'C1' if imp == 'without' else 'C2'}"])
mpce.sort(key=lambda r: (r[1], r[3] != "without", r[2]))

# ---- Gini by state (API indicator 9, Statements 9 and 15) and India 2011-12 (Table 3.15) ----
gini, have = [], {}
for r in api("hces", 9):
    have[(slug(r["state"]), r["year"], SEC[r["sector"]], IMP[r["imputation_type"]])] = fix(r["value"], 3)
for p, lines in H.items():
    for t, imp in (("Statement 9:", "without"), ("Statement 15:", "with")):
        rep, rep_mpce = {}, {}
        for g, v in page(lines, t, 4).items():
            rep[(g, p, "rural", imp)], rep[(g, p, "urban", imp)] = v[1], v[3]
            rep_mpce[(g, p, "rural", imp)], rep_mpce[(g, p, "urban", imp)] = v[0], v[2]
        chk.table(f"Gini {REPORT[p][1]} {t}", rep, {k: v for k, v in have.items() if k[1] == p and k[3] == imp})
        mp = {(r[0], r[1], r[2], r[3]): r[4] for r in mpce if r[1] == p and r[3] == imp}
        chk.table(f"MPCE {REPORT[p][1]} {t}", rep_mpce, mp)


def india_rows(lines, title, ncols, labels, stop=40):
    """Rows of an all-India table: {label: [values]} for the first rows whose name starts with each label."""
    for i, line in enumerate(lines):
        if line.strip().startswith(title):
            out = []
            for l in lines[i:i + stop]:
                name, nums = split(l)
                if nums and len(nums) == ncols and name.lower().startswith(labels):
                    out.append((name.lower(), nums))
            return out
    sys.exit(f"{title}: not found")


t315 = {}
# Report 592 gives 2011-12, 2022-23 and 2023-24; Report 591 gives 2011-12 and 2022-23. Both must agree.
for p, years in (("2023-24", ("2011-12", "2022-23", "2023-24")), ("2022-23", ("2011-12", "2022-23"))):
    rows = india_rows(H[p], "Table 3.15:", len(years), ("rural", "urban"), 15)
    if [n for n, _ in rows] != ["rural", "urban"]:
        sys.exit(f"{REPORT[p][1]} Table 3.15: unexpected rows {rows}")
    for name, v in rows:
        for y, x in zip(years, v):
            t315.setdefault((y, name), set()).add(x)
for k, v in t315.items():
    if len(v) != 1:
        sys.exit(f"Table 3.15 differs between Reports 591 and 592: {k} {v}")
rep = {("india", y, sec, "without"): v.pop() for (y, sec), v in t315.items()}
chk.table("Gini Report 592 Table 3.15 (2022-23, 2023-24)", {k: v for k, v in rep.items() if k[1] != "2011-12"},
          {k: v for k, v in have.items() if k[0] == "india" and k[3] == "without"})
for k, v in have.items():
    g, p, sec, imp = k
    gini.append([g, p, sec, imp, v, "Gini coefficient (0 to 1)", "9", f"{REPORT[p][1]}, Statement {'9' if imp == 'without' else '15'}"])
for (g, y, sec, imp), v in rep.items():
    if y == "2011-12":
        gini.append([g, y, sec, imp, v, "Gini coefficient (0 to 1)", "", "NSS Report 592, Table 3.15 (NSS round 68)"])
gini.sort(key=lambda r: (r[1], r[3] != "without", r[2]))

# ---- MPCE India over rounds (Table 3.3 of Report 592) ---------------------------------------
YEARS = ["1999-00", "2004-05", "2009-10", "2011-12", "2022-23", "2023-24"]
RECALL = {"1999-00": "MRP", "2004-05": "MRP", "2009-10": "MMRP", "2011-12": "MMRP", "2022-23": "MMRP", "2023-24": "MMRP"}
ROUND = {"1999-00": "NSS round 55", "2004-05": "NSS round 61", "2009-10": "NSS round 66", "2011-12": "NSS round 68",
         "2022-23": "HCES 2022-23", "2023-24": "HCES 2023-24"}
rows = india_rows(H["2023-24"], "Table 3.3:", 6, ("rural", "urban"), 25)
if [n for n, _ in rows] != ["rural", "urban", "rural", "urban"]:
    sys.exit(f"Table 3.3: unexpected rows {rows}")
rounds = []
for (sec, v), prices in zip(rows, ["current prices", "current prices", "2011-12 prices", "2011-12 prices"]):
    for y, x in zip(YEARS, v):
        rounds.append(["india", y, sec, prices, x, RS, RECALL[y], ROUND[y], "NSS Report 592, Table 3.3"])
mp = {(r[0], r[1], r[2], r[3]): r[4] for r in mpce}
chk.table("MPCE Table 3.3 current prices (2022-23, 2023-24)",
          {("india", r[1], r[2], "without"): r[4] for r in rounds if r[3] == "current prices" and r[1] in ("2022-23", "2023-24")},
          {k: v for k, v in mp.items() if k[0] == "india" and k[3] == "without"})

# ---- Share of item groups in MPCE, India over rounds (Table 3.11R, 3.11U of Report 592) -----
GROUPS = [("cereal substitutes", "cereal substitutes"), ("cereal", "cereal"), ("gram", "gram"),
          ("pulses", "pulses and pulse products"), ("sugar", "sugar and salt"), ("milk", "milk and milk products"),
          ("vegetables", "vegetables"), ("fruits (fresh)", "fruits (fresh)"), ("fruits (dry)", "fruits (dry)"),
          ("egg", "egg, fish and meat"), ("edible oil", "edible oil"), ("spices", "spices"),
          ("beverages", "beverages, processed food, etc."), ("food: total", "food: total"),
          ("pan", "pan, tobacco and intoxicants"), ("fuel", "fuel and light"),
          ("toilet", "toilet articles and other household consumables"), ("education", "education"),
          ("medical (hosp", "medical (hospitalisation)"), ("medical (non", "medical (non-hospitalisation)"),
          ("conveyance", "conveyance"), ("consumer services", "consumer services excluding conveyance"),
          ("entertainment", "entertainment"), ("rent", "rent"), ("other taxes", "other taxes and cesses"),
          ("clothing", "clothing and bedding"), ("footwear", "footwear"), ("durable", "durable goods"),
          ("non-food: total", "non-food: total"), ("total expenditure", "total expenditure")]
# API item categories with one report row each (sugar, salt, toilet articles and other consumables
# are separate in the API and joined in Table 3.11).
API_GROUP = {"Cereal": "cereal", "Cereal Substitutes": "cereal substitutes", "Gram": "gram",
             "Milk and Milk Products": "milk and milk products", "Vegetables": "vegetables",
             "Fruits (fresh)": "fruits (fresh)", "Fruits (dry)": "fruits (dry)", "Egg, Fish & Meat": "egg, fish and meat",
             "Edible Oil": "edible oil", "Spices": "spices", "Beverages, Processed Food, etc.": "beverages, processed food, etc.",
             "Food Total": "food: total", "Pan, Tobacco & Intoxicants": "pan, tobacco and intoxicants",
             "Fuel and Light": "fuel and light", "Education": "education", "Medical (Hospitalization)": "medical (hospitalisation)",
             "Medical (Non- Hospitalization)": "medical (non-hospitalisation)", "Conveyance": "conveyance",
             "Consumer Services Excluding Conveyance": "consumer services excluding conveyance",
             "Entertainment": "entertainment", "Rent": "rent", "Other Taxes & Cesses": "other taxes and cesses",
             "Clothing & Bedding": "clothing and bedding", "Footwear": "footwear", "Durable Goods": "durable goods",
             "Non-Food Total": "non-food: total"}
# Table 3.11 row 'pulses and pulse products*' includes gram ('*includes gram'); the API's
# 'Pulses and Pulse Products' excludes it (Statement 4: '*excludes gram'). Not compared.


def group(name):
    for prefix, label in GROUPS:
        if name.startswith(prefix):
            return label
    return None


def table_311(lines, title):
    out, pending, start = {}, "", None
    for i, line in enumerate(lines):
        if line.strip().startswith(title):
            start = i if start is None else start
    if start is None:
        sys.exit(f"{title}: not found")
    for i, line in enumerate(lines):
        if not line.strip().startswith(title):
            continue
        for l in lines[i + 1:i + 45]:
            name, nums = split(l)
            if nums is None:
                if name and name[0].islower():
                    pending = name.lower()
                continue
            if len(nums) != 6:
                continue
            label = group(name.lower()) if name and name != "#" else group(pending)
            pending = ""
            if not label:
                sys.exit(f"{title}: unknown row {l!r}")
            if label in out and out[label] != nums:
                sys.exit(f"{title}: row {label} twice with different values")
            out[label] = nums
            if label == "total expenditure":
                break
    missing = [g for _, g in GROUPS if g not in out]
    if missing:
        sys.exit(f"{title}: rows not found {missing}")
    return out


shares = []
api4 = {}
for r in api("hces", 4):
    api4[(slug(r["state"]), r["year"], SEC[r["sector"]], IMP[r["imputation_type"]], r["item_category"])] = fix(r["value"], 2)
for sec, t in (("rural", "Table 3.11R:"), ("urban", "Table 3.11U:")):
    tab = table_311(H["2023-24"], t)
    for _, label in GROUPS:
        for y, x in zip(YEARS, tab[label]):
            shares.append(["india", y, sec, label, x, "% of MPCE", ROUND[y], f"NSS Report 592, Table 3.11{sec[0].upper()}"])
    rep = {(y, cat): tab[label][YEARS.index(y)] for cat, label in API_GROUP.items() for y in ("2022-23", "2023-24")}
    chk.table(f"Item shares {t} (2022-23, 2023-24)", rep,
              {(k[1], k[4]): v for k, v in api4.items() if k[0] == "india" and k[2] == sec and k[3] == "without" and k[4] in API_GROUP})

# ---- Share of food in MPCE by state (API indicator 4; Statements 4R/4U and 11R/11U) ---------


def statement_row(lines, title, rowno):
    """Values of row `rowno` (for example '15.') across every page of a state-by-column statement."""
    vals = []
    for i, line in enumerate(lines):
        if not line.strip().startswith(title):
            continue
        for l in lines[i:i + 60]:
            m = re.match(r"^\s*" + re.escape(rowno) + r"\s+[a-z].*?((?:\s+(?:" + NUM + r"))+)\s*$", l)
            if m:
                vals.extend(x.replace(",", "") for x in m.group(1).split())
                break
    return vals


food = []
for p, lines in H.items():
    order = list(page(lines, "Statement 1:", 4).keys())
    for sec, imp, t in (("rural", "without", "Statement 4R:"), ("urban", "without", "Statement 4U:"),
                        ("rural", "with", "Statement 11R:"), ("urban", "with", "Statement 11U:")):
        for rowno, cat in (("15.", "Food Total"), ("31.", "Non-Food Total")):
            vals = statement_row(lines, t, rowno)
            if len(vals) != len(order):
                sys.exit(f"{REPORT[p][1]} {t} row {rowno}: {len(vals)} values for {len(order)} states")
            rep = {(g, p, sec, imp, cat): v for g, v in zip(order, vals)}
            chk.table(f"Food share {REPORT[p][1]} {t} {cat}", rep,
                      {k: v for k, v in api4.items() if k[1] == p and k[2] == sec and k[3] == imp and k[4] == cat})
            for (g, _, _, _, _), v in rep.items():
                st = "4" if imp == "without" else "11"
                food.append([g, p, sec, imp, "food" if cat == "Food Total" else "non-food", v, "% of MPCE", "4",
                             f"{REPORT[p][1]}, Statement {st}{sec[0].upper()}"])
food.sort(key=lambda r: (r[1], r[3] != "without", r[2], r[4]))

# ==== CAMS 2022-23 (NSS round 79, survey code 1) =============================================
C = text("cams-2022-23")
SECTOR = {"Rural": "rural", "Urban": "urban", "All": "rural+urban", "Rural + Urban": "rural+urban"}
SEX = {"Male": "male", "Female": "female", "Person": "person"}
AGE = {"15-24 years": "15-24", "15-29 years": "15-29", "15 years and above": "15+", "18 years and above": "18+"}
COLS9 = [(s, x) for s in ("rural", "urban", "rural+urban") for x in ("male", "female", "person")]


def cams_persons(code, tab, measure, sub=None):
    """A persons indicator by state, sector, sex and age group, checked against every page of `tab`."""
    rows, have = [], {}
    for r in api("nss79", code):
        if sub and r.get("sub_indicator") != sub:
            continue
        k = (slug(r["state"]), AGE[r["age_group"]], SECTOR[r["sector"]], SEX[r["gender"]])
        if k in have:
            sys.exit(f"duplicate API row {code} {k}")
        have[k] = fix(r["value"], 1)
    for age in sorted({k[1] for k in have}):
        label = {"15-24": "age: 15-24 years", "15-29": "age: 15-29 years", "15+": "age: 15 years and above",
                 "18+": "age: 18 years and above"}[age]
        rep = {}
        for g, v in page(C, tab, 9, label).items():
            for (sec, sex), x in zip(COLS9, v):
                rep[(g, age, sec, sex)] = x
        chk.table(f"CAMS {tab} {measure} {age}", rep, {k: v for k, v in have.items() if k[1] == age})
    for (g, age, sec, sex), v in have.items():
        rows.append([g, "2022-23", measure, age, sex, sec, v, "% of persons", str(code), f"NSS Report 590, {tab.rstrip(':')}"])
    return rows


ict = []
ict += cams_persons(18, "Table 16:", "able to use internet")
ict += cams_persons(19, "Table 17:", "used internet in last 3 months")
ict += cams_persons(21, "Table 19:", "sent messages with attached files in last 3 months")
ict += cams_persons(22, "Table 20:", "used copy and paste in last 3 months")
# Table 21: one page per sector, sex and age group; four columns, the second is email.
have = {}
for r in api("nss79", 23):
    if r["sub_indicator"] == "percentage of persons who can send or receive emails":
        have[(slug(r["state"]), AGE[r["age_group"]], SECTOR[r["sector"]], SEX[r["gender"]])] = fix(r["value"], 1)
for age in ("15-24", "15-29", "15+"):
    label = {"15-24": "age: 15-24 years", "15-29": "age: 15-29 years", "15+": "age: 15 years and above"}[age]
    for sec in ("rural", "urban", "rural+urban"):
        for sex in ("male", "female", "person"):
            head = f"{'all' if sec == 'rural+urban' else sec} {sex}"
            rep = {(g, age, sec, sex): v[1] for g, v in page(C, "Table 21:", 4, head, label).items()}
            chk.table(f"CAMS Table 21 email {age} {sec} {sex}", rep,
                      {k: v for k, v in have.items() if k[1:] == (age, sec, sex)})
for (g, age, sec, sex), v in have.items():
    ict.append([g, "2022-23", "can send or receive email", age, sex, sec, v, "% of persons", "23", "NSS Report 590, Table 21"])
ict.sort(key=lambda r: (r[2], r[3], r[5], r[4]))

bank = cams_persons(14, "Table 12:", "has a bank or mobile money account")
bank.sort(key=lambda r: (r[5], r[4]))

# ---- Households: assets (Table 22), clean cooking fuel (Table 25), water and latrine (Table 26)
COLS3 = ["rural", "urban", "rural+urban"]


def cams_households(code, tab, ncols, measures):
    """measures: [(sub_indicator or None, measure name, first column)]."""
    rows = []
    tabrows = page(C, tab, ncols)
    for sub, measure, col in measures:
        have = {}
        for r in api("nss79", code):
            if sub and r["sub_indicator"] != sub:
                continue
            have[(slug(r["state"]), SECTOR[r["sector"]])] = fix(r["value"], 1)
        rep = {(g, sec): v[col + j] for g, v in tabrows.items() for j, sec in enumerate(COLS3)}
        chk.table(f"CAMS {tab} {measure}", rep, have)
        for (g, sec), v in have.items():
            rows.append([g, "2022-23", measure, sec, v, "% of households", "CAMS 2022-23 (NSS round 79)", str(code),
                         f"NSS Report 590, {tab.rstrip(':')}", ""])
    return rows


assets = cams_households(24, "Table 22:", 6, [
    ("Telephone (including landline) /mobile phone (including smartphone)", "telephone or mobile phone", 0),
    ("Computer (desktop PC, laptop)", "computer (desktop or laptop)", 3)])
assets.sort(key=lambda r: (r[2], r[3]))
amen = []
amen += cams_households(27, "Table 25:", 3, [(None, "clean fuel for cooking", 0)])
amen += cams_households(28, "Table 26:", 6, [
    ("Improved principal sources of drinking water", "improved principal source of drinking water", 0),
    ("Improved latrine (among households with access to latrine)", "improved latrine (among households with a latrine)", 3)])

# ---- NSS round 76 (July to December 2018): improved source of drinking water ---------------
N = text("nss76-584")
have = {}
for r in api("nss76", 16):
    if re.sub(r"\s+", " ", r["state"].strip().lower()) in NSS76_SKIP:
        continue
    if r["quintile_class"] != "All (quintile class)" or \
            re.sub(r"\s+", " ", r["households_percentage"]).strip() != "Households having access to improved source of drinking water":
        continue
    if (slug(r["state"]), SECTOR[r["sector"]]) in have:
        sys.exit(f"duplicate API row {r}")
    have[(slug(r["state"]), SECTOR[r["sector"]])] = fix(r["value"], 1)
rep = {}
for sec, head in (("rural", "=rural"), ("urban", "=urban"), ("rural+urban", "=rural+urban")):
    for g, v in page(N, "Statement 6.1:", 6, head, skip=NSS76_SKIP).items():
        rep[(g, sec)] = v[0]
# Known API fault (read 25 Nov 2026): the API gives Tripura's values under Uttarakhand and
# Uttarakhand's under Tripura. Statement 2.1 confirms the report: Tripura's rural improved sources
# add up to 84.7. The CSV takes the report values. Stop if the fault is gone or changes.
for sec in ("rural", "urban", "rural+urban"):
    t, u = ("tripura", sec), ("uttarakhand", sec)
    if not (same(have[t], rep[u]) and same(have[u], rep[t]) and not same(rep[t], rep[u])):
        sys.exit(f"NSS 76 API: the Tripura and Uttarakhand swap is not as recorded ({sec}). Update the script and README.")
    have[t], have[u] = have[u], have[t]
chk.table("NSS 76 Statement 6.1 improved source of drinking water (API with Tripura and Uttarakhand swapped back)", rep, have)
for (g, sec), v in rep.items():
    note = "the state of Jammu and Kashmir before 31 October 2019, with Ladakh" if g == "jammu-kashmir" else ""
    amen.append([g, "2018", "improved principal source of drinking water", sec, v, "% of households",
                 "NSS round 76 (Jul to Dec 2018)", "16", "NSS Report 584, Statement 6.1", note])
    if g in ("tripura", "uttarakhand"):
        amen[-1][-1] = "report value; the API gives Tripura and Uttarakhand swapped"
amen.sort(key=lambda r: (r[2], r[1], r[3]))

# ==== Write ==================================================================================
write("mpce-by-state.csv", ["geography", "period", "sector", "imputation", "value", "unit", "rse_percent",
                            "api_indicator", "report_table"], mpce)
write("mpce-india-rounds.csv", ["geography", "period", "sector", "prices", "value", "unit", "recall_period",
                                "survey", "report_table"], rounds)
write("mpce-item-shares-india-rounds.csv", ["geography", "period", "sector", "item_group", "value", "unit",
                                            "survey", "report_table"], shares)
write("food-share-by-state.csv", ["geography", "period", "sector", "imputation", "item_group", "value", "unit",
                                  "api_indicator", "report_table"], food)
write("gini-mpce.csv", ["geography", "period", "sector", "imputation", "value", "unit", "api_indicator",
                        "report_table"], gini)
write("internet-and-ict-skills-by-state.csv", ["geography", "period", "measure", "age_group", "sex", "sector",
                                               "value", "unit", "api_indicator", "report_table"], ict)
write("bank-account-by-state.csv", ["geography", "period", "measure", "age_group", "sex", "sector", "value",
                                    "unit", "api_indicator", "report_table"], bank)
write("household-amenities-by-state.csv", ["geography", "period", "measure", "sector", "value", "unit", "survey",
                                           "api_indicator", "report_table", "note"], amen)
write("household-assets-by-state.csv", ["geography", "period", "measure", "sector", "value", "unit", "survey",
                                        "api_indicator", "report_table", "note"], assets)
print(f"all checks passed: {chk.n} report cells")
