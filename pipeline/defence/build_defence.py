"""Build the defence CSVs from RBI Handbook Table 89 and PIB releases of the Ministry of Defence.

Usage: python3 -I pipeline/defence/build_defence.py [--raw raw/defence] [--out research/data/defence]

Run pipeline/defence/fetch.sh first. PIB answers scripts with HTTP 403, so its releases are read from
Internet Archive captures (sources.tsv). The PIB budget backgrounder is a PDF on static.pib.gov.in;
the script reads its text with pdftotext.

Writes three CSVs. Every value keeps the publisher's digits. The script stops on any difference:
  - Table 89: revenue expenditure (col 2) and capital expenditure (col 6) add up to total expenditure
    (col 10), and loans and advances (7) and capital outlay (8) add up to capital expenditure (6),
    within 1 crore of rounding; values checked against the printed page;
  - exports: each release's total equals its DPSU and private parts, and the year before in each
    release equals the earlier release;
  - budget split: the five shares add up to 100.
"""
import argparse
import csv
import html
import re
import subprocess
import sys

ap = argparse.ArgumentParser()
ap.add_argument("--raw", default="raw/defence")
ap.add_argument("--out", default="research/data/defence")
a = ap.parse_args()

errors = []
checked = 0


def check(ok, msg):
    global checked
    checked += 1
    if not ok:
        errors.append(msg)


def text(path):
    t = open(path, encoding="utf-8", errors="ignore").read()
    t = re.sub(r"<script.*?</script>|<style.*?</style>", "", t, flags=re.S)
    t = html.unescape(re.sub(r"<[^>]+>", " ", t))
    return re.sub(r"\s+", " ", t)


def write(name, header, rows):
    with open(f"{a.out}/{name}", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(header)
        w.writerows(rows)
    print(f"{name}: {len(rows)} rows")


def num(s):
    return s.replace(",", "")


# ---------------------------------------------------------------- RBI Handbook Table 89

T89 = "RBI Handbook of Statistics on Indian Economy 2025-26, Table 89"
t = text(f"{a.raw}/rbi/table-89.html")
check("Date : Jul 31, 2026" in t, "Table 89: release date changed")
check("Table 89 : Major Heads of Expenditure of the Central Government" in t, "Table 89: title changed")
check("Defence expenditure is exclusive of expenditure on Defence pensions and Civil expenditure" in t, "Table 89: pension note changed")
check("Data for 2025-26 are Revised Estimates and data for 2026-27 are Budget Estimates" in t, "Table 89: status note changed")
body = t[t.index("1 2 3 4 5 6 7 8 9 10") + len("1 2 3 4 5 6 7 8 9 10"):t.index("Notes :")]
rows = re.findall(r"(\d{4}-\d{2}) ((?:\d+ ){8}\d+)", body)
COLS = ["revenue expenditure", "revenue expenditure: defence", "revenue expenditure: interest payments",
        "revenue expenditure: subsidies", "capital expenditure", "capital expenditure: loans and advances",
        "capital expenditure: capital outlay", "capital outlay: defence", "total expenditure"]
STATUS = {"2025-26": "revised estimate", "2026-27": "budget estimate"}
spend = []
years = []
for year, vals in rows:
    v = [int(x) for x in vals.split()]
    years.append(year)
    # The parts are rounded to the crore, so a sum can differ from the printed total by 1.
    check(abs(v[0] + v[4] - v[8]) <= 1, f"Table 89 {year}: revenue + capital {v[0] + v[4]}, total {v[8]}")
    check(abs(v[5] + v[6] - v[4]) <= 1, f"Table 89 {year}: loans + outlay {v[5] + v[6]}, capital {v[4]}")
    for col, x in zip(COLS, v):
        spend.append(["india", year, col, str(x), "₹ crore", "", STATUS.get(year, ""), T89])
    # Derived (rule R3): defence spending = revenue defence (col 3) + capital outlay on defence (col 9).
    spend.append(["india", year, "defence: revenue and capital", str(v[1] + v[7]), "₹ crore",
                  "sum of columns 3 and 9", STATUS.get(year, ""), T89])
    # Derived (rule R3): the share of defence in total expenditure, to two decimals.
    spend.append(["india", year, "defence: share of total expenditure", f"{100 * (v[1] + v[7]) / v[8]:.2f}",
                  "% of total expenditure", "(column 3 + column 9) / column 10 x 100", STATUS.get(year, ""), T89])
check(years[0] == "1987-88" and years[-1] == "2026-27" and len(years) == 40, f"Table 89 years {years[0]} to {years[-1]}, {len(years)}")
by = {(r[1], r[2]): r[3] for r in spend}
# Checked values, read from the printed page.
for (y, c), want in {("1987-88", "revenue expenditure: defence"): "8861", ("1987-88", "capital outlay: defence"): "3107",
                     ("2024-25", "revenue expenditure: defence"): "290965", ("2024-25", "capital outlay: defence"): "159768",
                     ("2026-27", "revenue expenditure: defence"): "365479", ("2026-27", "capital outlay: defence"): "229106",
                     ("2026-27", "total expenditure"): "5347315"}.items():
    check(by[(y, c)] == want, f"Table 89 {y} {c}: {by[(y, c)]}, page {want}")
write("defence-spending-1987-2027.csv",
      ["geography", "period", "measure", "value", "unit", "derived", "status", "release"], spend)

# ---------------------------------------------------------------- PIB: defence exports

exports = []
p = text(f"{a.raw}/pib/pr-1912885.wayback.html")
check("Posted On: 01 APR 2023" in p, "PR 1912885 date")
m = re.search(r"\(Rs in crores\) Financial Year Total Export Value (.*?) India is now", p)
pairs = re.findall(r"(\d{4}-\d{2}) ([\d,]+)", m.group(1))
check([y for y, _ in pairs] == [f"{y}-{str(y + 1)[2:]}" for y in range(2016, 2023)], f"PR 1912885 years {pairs}")
for y, v in pairs:
    exports.append(["india", y, "all exporters", num(v), "₹ crore", "", "PIB release 1912885, 1 Apr 2023"])

p = text(f"{a.raw}/pib/pr-2117348.wayback.html")
check("Posted On: 01 APR 2025" in p, "PR 2117348 date")
check("record high of Rs 23,622 crore" in p and "which were Rs 21,083 crore" in p, "PR 2117348 totals")
m = re.search(r"private sector and DPSUs have contributed Rs ([\d,]+) crore and Rs ([\d,]+) crore respectively in defence exports of 2024-25, whereas the corresponding figures for FY 2023-24 were Rs ([\d,]+) crore and Rs ([\d,]+) crore", p)
pv25, dp25, pv24, dp24 = (num(x) for x in m.groups())
check(int(pv25) + int(dp25) == 23622, "PR 2117348: 2024-25 parts")
check(int(pv24) + int(dp24) == 21083, "PR 2117348: 2023-24 parts")
src = "PIB release 2117348, 1 Apr 2025"
for y, tot, pv, dp in (("2023-24", "21083", pv24, dp24), ("2024-25", "23622", pv25, dp25)):
    exports += [["india", y, "all exporters", tot, "₹ crore", "", src],
                ["india", y, "private sector", pv, "₹ crore", "", src],
                ["india", y, "DPSUs", dp, "₹ crore", "", src]]

p = text(f"{a.raw}/pib/pr-2248124.wayback.html")
check("Posted On: 02 APR 2026" in p, "PR 2248124 date")
check("all-time high of Rs 38,424 crore" in p and "previous fiscal year’s figure of Rs 23,622 crore" in p, "PR 2248124 totals")
m = re.search(r"private sector accounted for Rs ([\d,]+) crore worth of defence exports, while DPSUs contributed Rs ([\d,]+) crore\. Their respective figures in the previous financial year stood at Rs ([\d,]+) crore and Rs ([\d,]+) crore", p)
pv26, dp26, pv25b, dp25b = (num(x) for x in m.groups())
check(int(pv26) + int(dp26) == 38424, "PR 2248124: 2025-26 parts")
check((pv25b, dp25b) == (pv25, dp25), "PR 2248124: 2024-25 parts differ from PR 2117348")
src = "PIB release 2248124, 2 Apr 2026"
exports += [["india", "2025-26", "all exporters", "38424", "₹ crore", "", src],
            ["india", "2025-26", "private sector", pv26, "₹ crore", "", src],
            ["india", "2025-26", "DPSUs", dp26, "₹ crore", "", src]]
write("defence-exports.csv", ["geography", "period", "exporter", "value", "unit", "note", "release"], exports)

# ---------------------------------------------------------------- PIB: the 2026-27 defence budget

pdf = subprocess.run(["pdftotext", "-raw", f"{a.raw}/pib/budget-2026-27.pdf", "-"], capture_output=True, text=True, check=True).stdout
pdf = re.sub(r"\s+", " ", pdf)
check("₹7.85 lakh crore allocated to the Ministry of Defence in Union Budget 2026" in pdf, "budget PDF: total")
m = re.search(r"([\d.]+) ?% of the Defence Budget allocation is for capital expenditure, ([\d.]+) ?% for revenue expenditure on sustenance and operational preparedness ?, ([\d.]+) ?% for revenue expenditure on pay and allowances, ([\d.]+) ?% for defence pensions, and ([\d.]+) ?% for civil organisations", pdf)
if not m:
    sys.exit("budget PDF: split sentence not found")
parts = ["capital expenditure", "revenue: sustenance and operational preparedness", "revenue: pay and allowances",
         "defence pensions", "civil organisations"]
shares = m.groups()
check(abs(sum(float(x) for x in shares) - 100) < 0.005, f"budget split adds to {sum(float(x) for x in shares)}")
budget = [["india", "2026-27", part, s, "% of Ministry of Defence allocation", "budget estimate",
           "PIB backgrounder, Defence in Union Budget 2026-27, 3 Feb 2026"] for part, s in zip(parts, shares)]
write("defence-budget-split-2026-27.csv", ["geography", "period", "head", "value", "unit", "status", "release"], budget)

if errors:
    print("\n".join(errors), file=sys.stderr)
    sys.exit(f"{len(errors)} of {checked} checks failed")
print(f"all {checked} checks passed")
