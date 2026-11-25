"""Build the disability CSVs from NSS round 76 (July to December 2018), Report 583.

Usage: python3 -I pipeline/health/build_disability.py [--raw raw/health] [--work work/health]
       [--out research/data/health] [--geo research/data/geography.csv]

Reads the API pages saved by pipeline/education/fetch_nss.py (<raw>/nss76-disability/i<code>.json,
NSS round 76, survey code 1) and the text of NSS Report 583 made by extract_text.sh
(<work>/nss76-583.txt). Writes the publisher's digits.

Checks every API value against the matching state table of the report (Tables 1.2, 4.1 and 32.1),
and every report row against the API. Also checks the all-India rows against Statements 1, 4 and
32. Stops on any difference.
"""
import argparse
import csv
import json
import re
import sys

ap = argparse.ArgumentParser()
ap.add_argument("--raw", default="raw/health")
ap.add_argument("--work", default="work/health")
ap.add_argument("--out", default="research/data/health")
ap.add_argument("--geo", default="research/data/geography.csv")
a = ap.parse_args()

geo = {r["name"].lower(): r["slug"] for r in csv.DictReader(open(a.geo))}
ALIAS = {"all india": "india", "all-india": "india", "a & n islands": "andaman-nicobar", "jammu & kashmir": "jammu-kashmir"}
# In 2018 Dadra and Nagar Haveli and Daman and Diu were two UTs. Neither is a current UT, so both are
# left out, as in the living standards topic (see the health README).
SKIP = {"dadra & nagar haveli", "daman & diu"}
SEX = {"Male": "male", "Female": "female", "Person": "person"}
SECTOR = {"Rural": "rural", "Urban": "urban", "Rural + Urban": "rural+urban"}
SECTORS = ("rural", "urban", "rural+urban")
SEXES = ("male", "female", "person")
TYPES = {  # API label: (slug, column of Table 4.1)
    "Locomotive disability": ("locomotor", 0),
    "Visual disability": ("visual", 1),
    "Hearing": ("hearing", 2),
    "Speech and Language disability": ("speech-and-language", 3),
    "Mental Retardness/Intellectual Disability": ("intellectual", 4),
    "Mental Illness": ("mental-illness", 5),
    "Other type of disability": ("other", 6),
    "Any disability": ("any", 7),
}
AID = {  # API label: (slug, column within a sex block of Table 32.1)
    "Received aid / help from Govt": ("government", 0),
    "Received aid/help from organisation other than Govt": ("other-organisation", 1),
    "Did not receive aid/help": ("none", 2),
    "All": ("all", 3),
}
PERIOD = "2018"
SURVEY = "NSS round 76 (Jul to Dec 2018)"
JK = "the state of Jammu and Kashmir before 31 October 2019, with Ladakh"


def norm(name):
    return re.sub(r"\s+", " ", name.strip().lower())


def slug(name):
    n = norm(name)
    s = ALIAS.get(n) or geo.get(n)
    if not s:
        sys.exit(f"unknown state name: {name!r}")
    return s


def api(code):
    return json.load(open(f"{a.raw}/nss76-disability/i{code}.json"))["records"]


def value(v):
    """The API drops a trailing zero (2 for the report's 2.0). Print one decimal, as the report does,
    after a check that the API gives no more digits than that."""
    v = v.strip()
    if "." in v and len(v.split(".")[1]) > 1:
        sys.exit(f"value {v} has more than 1 decimal")
    return f"{float(v):.1f}"


lines = open(f"{a.work}/nss76-583.txt", encoding="utf-8").read().splitlines()
ROW = re.compile(r"^(?P<name>[A-Za-z&.\- ]+?)\s+(?P<nums>(?:\d+\.\d+\s*)+)$")


def state_table(title, ncols):
    """Every page of a state table: {page label: {slug: [ncols values]}}. A page starts at a line that
    starts with `title`. Its label is the next line that is not blank. It ends at the all-India row."""
    pages = {}
    for i, line in enumerate(lines):
        if not line.lstrip("\f").startswith(title):
            continue
        label = next(norm(l) for l in lines[i + 1:] if l.strip())
        rows = {}
        for l in lines[i + 1:i + 80]:
            m = ROW.match(l.strip())
            if not m:
                continue
            nums = m.group("nums").split()
            if len(nums) != ncols:
                sys.exit(f"{title} {label}: {len(nums)} values in {l.strip()!r}, expected {ncols}")
            if norm(m.group("name")) in SKIP:
                continue
            rows[slug(m.group("name"))] = nums
            if rows.get("india"):
                break
        if label in pages:
            sys.exit(f"{title}: two pages labelled {label!r}")
        if len(rows) != 35 or "india" not in rows:
            sys.exit(f"{title} {label}: {len(rows)} rows, expected India and 34 states and UTs")
        pages[label] = rows
    return pages


def statement(title, labels, ncols=3):
    """All-India rows of a statement: {(sector, row label): [ncols values]}. `labels` maps the start
    of a row's text (after the leading words that some rows share) to a row label."""
    start = next(i for i, l in enumerate(lines) if l.strip().startswith(title))
    out, sector = {}, None
    for l in lines[start + 1:start + 60]:
        t = norm(l)
        if t in SECTORS:
            sector = t
            continue
        if t.startswith("note"):
            break
        nums = re.findall(r"\d+\.\d", l)
        for key, label in labels.items():
            if re.search(r"\b" + re.escape(key), t) and len(nums) == ncols:  # 'males' must not match 'females'
                out[(sector, label)] = nums
    return out


class Check:
    def __init__(self):
        self.n = 0

    def table(self, name, report, have):
        """report and have: {key: value}. Both must agree in full."""
        bad = [k for k in report if k not in have or float(have[k]) != float(report[k])]
        extra = [k for k in have if k not in report]
        for k in bad[:10]:
            print(f"  MISMATCH {name} {k}: API {have.get(k)!r}, report {report[k]!r}")
        for k in extra[:10]:
            print(f"  NOT IN REPORT {name} {k}: API {have[k]!r}")
        print(f"check {name}: {len(report)} cells, {len(bad)} differ, {len(extra)} API values not in the table")
        if bad or extra:
            sys.exit(1)
        self.n += len(report)


chk = Check()


def collect(code, extra=None):
    """{(geography, sex, sector[, category]): value} from one API indicator, without the 2018 UTs."""
    have = {}
    for r in api(code):
        if norm(r["state"]) in SKIP:
            continue
        k = (slug(r["state"]), SEX[r["gender"]], SECTOR[r["sector"]])
        if extra:
            k += (extra(r),)
        if k in have:
            sys.exit(f"i{code}: duplicate API row {r}")
        have[k] = value(r["value"])
    return have


def note(g):
    return JK if g == "jammu-kashmir" else ""


# ---- Indicator 1: share of people with a disability (Table 1.2, Statement 1) ---------------
prev = collect(1)
rep = {}
(page,) = state_table("Table (1.2):", 9).values()
for g, v in page.items():
    for j, (sec, sex) in enumerate((s, x) for s in SECTORS for x in SEXES):
        rep[(g, sex, sec)] = v[j]
chk.table("Table 1.2 persons with disability", rep, prev)
st1 = statement("Statement 1:", {"males with disability": "male", "females with disability": "female",
                                 "persons with disability": "person"})
rep1 = {("india", sex, sec): v[SECTORS.index(sec)] for (_, sex), v in st1.items() for sec in SECTORS}
chk.table("Statement 1 persons with disability, all-India", rep1, {k: v for k, v in prev.items() if k[0] == "india"})
# Relative standard errors from Table RSE1 (Appendix D). The API has none.
rse = {}
(page,) = state_table("Table (RSE1):", 9).values()
for g, v in page.items():
    for j, (sec, sex) in enumerate((s, x) for s in SECTORS for x in SEXES):
        rse[(g, sex, sec)] = v[j]
if set(rse) != set(prev):
    sys.exit("Table RSE1 does not cover the same rows as indicator 1")
rows_prev = [[g, PERIOD, sex, sec, v, "% of persons", rse[(g, sex, sec)], "1", "NSS Report 583, Table 1.2; RSE Table RSE1", note(g)]
             for (g, sex, sec), v in prev.items()]

# ---- Indicator 2: share of people by broad type of disability (Table 4.1, Statement 4) -----
types = collect(2, lambda r: TYPES[r["disability_type"].strip()][0])
rep = {}
for label, page in state_table("Table (4.1):", 8).items():
    sec, sex = label.split()
    for g, v in page.items():
        for t, col in TYPES.values():
            rep[(g, sex, sec, t)] = v[col]
chk.table("Table 4.1 broad type of disability", rep, types)
st4 = {}
start = next(i for i, l in enumerate(lines) if l.strip().startswith("Statement 4:"))
sec = None
for l in lines[start + 1:start + 40]:
    t = norm(l)
    if t in SECTORS:
        sec = t
        continue
    if t.startswith("note"):
        break
    for label, (ty, _) in TYPES.items():
        key = {"Locomotive disability": "locomotor disability", "Hearing": "hearing disability",
               "Mental Retardness/Intellectual Disability": "mental retardation/ intellectual disability"}.get(label, label.lower())
        if key in t and not (key == "mental illness" and "retardation" in t):
            nums = re.findall(r"\d+\.\d", l)
            if len(nums) != 3:
                sys.exit(f"Statement 4: {l.strip()!r}")
            for sex, x in zip(SEXES, nums):
                st4[("india", sex, sec, ty)] = x
chk.table("Statement 4 broad type of disability, all-India", st4, {k: v for k, v in types.items() if k[0] == "india"})
# The 'any disability' column must repeat indicator 1.
chk.table("Table 4.1 any disability against indicator 1", {k[:3]: v for k, v in rep.items() if k[3] == "any"}, prev)
rows_types = [[g, PERIOD, t, sex, sec, v, "% of persons", "2", "NSS Report 583, Table 4.1", note(g)]
              for (g, sex, sec, t), v in types.items()]

# ---- Indicator 13: receipt of aid or help (Table 32.1, Statement 32) -----------------------
aid = collect(13, lambda r: AID[r["status_of_receipt_of_aid_help"].strip()][0])
rep = {}
for sec, page in state_table("Table (32.1):", 12).items():
    for g, v in page.items():
        for si, sex in enumerate(SEXES):
            for c, col in AID.values():
                rep[(g, sex, sec, c)] = v[si * 4 + col]
chk.table("Table 32.1 receipt of aid or help", rep, aid)
st32 = statement("Statement 32:", {"received aid/help from government": "government",
                                   "received aid/help from organisation other than government": "other-organisation",
                                   "did not receive aid/help": "none", "all ": "all"})
st32 = {("india", sex, sec, c): v[i] for (sec, c), v in st32.items() for i, sex in enumerate(SEXES)}
chk.table("Statement 32 receipt of aid or help, all-India", st32, {k: v for k, v in aid.items() if k[0] == "india"})
rows_aid = [[g, PERIOD, c, sex, sec, v, "% of persons with disability", "13", "NSS Report 583, Table 32.1", note(g)]
            for (g, sex, sec, c), v in aid.items()]

print(f"all checks passed: {chk.n} report cells agree with the API")

# ==== Write ==================================================================================
ORDER_GEO = ["india"] + sorted(set(geo.values()))


def write(name, header, rows, key, rse=False):
    rows.sort(key=lambda r: (ORDER_GEO.index(r[0]),) + key(r))
    with open(f"{a.out}/{name}", "w", newline="") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(["geography", "period"] + header + ["value", "unit"] + (["rse_percent"] if rse else [])
                   + ["api_indicator", "report_table", "note"])
        w.writerows(rows)
    print(f"{name}: {len(rows)} rows")


TORDER = [t for t, _ in TYPES.values()]
AORDER = [c for c, _ in AID.values()]
write("disability-by-state-2018.csv", ["sex", "sector"], rows_prev,
      lambda r: (SECTORS.index(r[3]), SEXES.index(r[2])), rse=True)
write("disability-by-type-2018.csv", ["disability_type", "sex", "sector"], rows_types,
      lambda r: (SECTORS.index(r[4]), SEXES.index(r[3]), TORDER.index(r[2])))
write("disability-aid-received-2018.csv", ["aid", "sex", "sector"], rows_aid,
      lambda r: (SECTORS.index(r[4]), SEXES.index(r[3]), AORDER.index(r[2])))
