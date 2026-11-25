"""Build the NFHS adult indicators CSV: overweight or obese (indicators 76 and 77) and tobacco use
(98 and 99), NFHS-6 against NFHS-5, by state, from the NFHS-6 India and State/UT Fact Sheets.
Each NFHS-5 value printed in the fact sheets is checked against the NFHS-5 India report
(Tables 2.36, 10.20.1 and 10.20.2). The report also gives Manipur's NFHS-5 values, which the
fact sheets cannot (NFHS-6 did not survey Manipur).
First: pdftotext -layout raw/health/nfhs6-factsheets.pdf work/health/nfhs6.txt and
raw/health/nfhs-5-report.pdf work/health/nfhs-5-report.txt (extract_text.sh does both).
Run: python3 -I pipeline/health/build_nfhs_adult.py --work work/health --out research/data/health"""
import argparse, csv, re
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument("--work", default="work/health", help="folder with the pdftotext output")
ap.add_argument("--out", default="research/data/health")
ap.add_argument("--geo", default="research/data/geography.csv")
args = ap.parse_args()
WORK, OUT = Path(args.work), Path(args.out)

geo = {r["name"]: r["slug"] for r in csv.DictReader(open(args.geo))}
ALIAS = {
    "India": "india", "NCT of Delhi": "delhi", "Jammu & Kashmir": "jammu-kashmir",
    "Andaman & Nicobar Islands": "andaman-nicobar",
    "Dadra & Nagar Haveli and Daman & Diu": "dnh-dd", "The Dadra & Nagar Haveli and Daman & Diu": "dnh-dd",
}


def slug(name):
    name = " ".join(name.replace("*", "").split())
    return ALIAS.get(name) or geo[name]


IND = {"76": "overweight-women-15-49", "77": "overweight-men-15-49", "98": "tobacco-women-15-plus", "99": "tobacco-men-15-plus"}
LABEL = {
    "overweight-women-15-49": "Women age 15-49 who are overweight or obese (BMI 25.0 kg/m2 or more) (%)",
    "overweight-men-15-49": "Men age 15-49 who are overweight or obese (BMI 25.0 kg/m2 or more) (%)",
    "tobacco-women-15-plus": "Women age 15 years and above who use any kind of tobacco (%)",
    "tobacco-men-15-plus": "Men age 15 years and above who use any kind of tobacco (%)",
}
VAL = r"\(?\d+\.\d\)?|\*|na"

# 1. NFHS-6 fact sheets: on each indicator line, the last four cells are urban, rural, total
# (NFHS-6) and total (NFHS-5).
nf = (WORK / "nfhs6.txt").read_text(encoding="utf-8", errors="replace").splitlines()
# Stop at the appendix of relative standard errors, which repeats the indicator lines.
nf = nf[:next(i for i, l in enumerate(nf) if re.match(r"^\s*Appendix", l) and i > 400)]
found, state = {}, None
for l in nf:
    h = re.match(r"^\s+(.+?) - Key Indicators\s*$", l)
    if h:
        state = h.group(1).strip()
        continue
    m = re.match(r"^\s*(\d+)\.\s+(.*)$", l)
    if not m or state is None or m.group(1) not in IND:
        continue
    # Drop the label: the values follow a run of three or more spaces.
    cells = re.split(r"\s{3,}", m.group(2).strip())[1:]
    vals = [t for c in cells for t in c.split() if re.fullmatch(VAL, t)]
    if len(vals) != 4:
        raise SystemExit(f"bad values {state} {m.group(1)}: {l}")
    found.setdefault((slug(state), IND[m.group(1)]), vals)
states = list(dict.fromkeys(g for g, _ in found))
assert len(states) == 36 and "manipur" not in states, (len(states), states)
assert all((g, c) in found for g in states for c in IND.values())


def clean(v):
    if v in ("*", "na"):
        return "", "not shown: fewer than 25 unweighted cases" if v == "*" else "not available"
    if v.startswith("("):
        return v.strip("()"), "based on 25-49 unweighted cases"
    return v, ""


# 2. NFHS-5 report tables, for the check and for Manipur.
rep = (WORK / "nfhs-5-report.txt").read_text(encoding="utf-8", errors="replace").splitlines()


def report_table(title, ncols, take):
    """Rows of a by-state table: {slug: {indicator: value}}. Long names wrap onto two lines."""
    out = {}
    starts = [k for k, l in enumerate(rep) if l.strip().startswith(title) and k > 1000]
    assert starts, title
    for s in starts:
        prev = ""
        for l in rep[s:s + 60]:
            m = re.match(r"^\s*([A-Za-z&. ]+?)\s+((?:\d+\.\d\s+){%d}\d+\.\d)\s*$" % (ncols - 1), l)
            if m:
                name = m.group(1).strip()
                if prev.strip() == "Dadra & Nagar Haveli and":
                    name = "Dadra & Nagar Haveli and " + name
                nums = m.group(2).split()
                out[slug(name)] = {k: nums[i] for k, i in take.items()}
            prev = l
    return out


tob = report_table("Table 2.36 Use of tobacco by the population age 15 and over by state", 6,
                   {"tobacco-women-15-plus": 2, "tobacco-men-15-plus": 5})
bmi_w = report_table("Table 10.20.1 Nutritional status of women by state", 9, {"overweight-women-15-49": 6})
bmi_m = report_table("Table 10.20.2 Nutritional status of men by state", 8, {"overweight-men-15-49": 5})
nfhs5 = {}
for t in (tob, bmi_w, bmi_m):
    for g, d in t.items():
        nfhs5.setdefault(g, {}).update(d)
assert len(nfhs5) == 37 and all(len(d) == 4 for d in nfhs5.values()), len(nfhs5)

mismatch = [(g, c, found[(g, c)][3], nfhs5[g][c]) for g in states for c in IND.values()
            if found[(g, c)][3].strip("()") != nfhs5[g][c]]
print("NFHS-5 values in the fact sheets that differ from the NFHS-5 report:", mismatch or "none")
assert not mismatch

rows = []
SRC6 = "NFHS-6 India and State/UT Fact Sheets (May 2026)"
for g in states:
    for c in IND.values():
        _, _, t6, t5 = found[(g, c)]
        for rnd, per, v in (("NFHS-6", "2023-24", t6), ("NFHS-5", "2019-21", t5)):
            val, note = clean(v)
            rows.append([g, per, rnd, c, LABEL[c], val, "percent", SRC6, note])
SRC5 = {"tobacco-women-15-plus": "Table 2.36", "tobacco-men-15-plus": "Table 2.36",
        "overweight-women-15-49": "Table 10.20.1", "overweight-men-15-49": "Table 10.20.2"}
for c in IND.values():
    rows.append(["manipur", "2023-24", "NFHS-6", c, LABEL[c], "", "percent", SRC6, "NFHS-6 did not survey Manipur"])
    rows.append(["manipur", "2019-21", "NFHS-5", c, LABEL[c], nfhs5["manipur"][c], "percent",
                 f"NFHS-5 India report (2022), {SRC5[c]}", ""])
with open(OUT / "nfhs-adult-indicators-by-state.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["geography", "period", "round", "indicator", "indicator_label", "value", "unit", "source_doc", "note"])
    w.writerows(rows)
print(f"nfhs-adult-indicators-by-state.csv: {len(rows)} rows")

v = {(r[0], r[2], r[3]): r[5] for r in rows}
assert v[("india", "NFHS-6", "tobacco-men-15-plus")] == "36.3" and v[("india", "NFHS-5", "tobacco-men-15-plus")] == "38.0"
assert v[("india", "NFHS-6", "overweight-women-15-49")] == "30.7" and v[("india", "NFHS-5", "overweight-women-15-49")] == "24.0"
