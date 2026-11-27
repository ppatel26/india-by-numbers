"""Build the flows of the central government's money, from RBI Handbook Tables 86 to 89.

Reads the Handbook of Statistics on Indian Economy 2025-26 table pages (HTML), downloaded first:
  for n in 86 87 88 89; do
    pipeline/common/fetch.sh --raw raw/economy/rbi "https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=$((23825+n))" table-$n.html
  done

Usage: python3 -I pipeline/economy/build_central_flows.py [--raw raw/economy/rbi] [--out research/data/economy]

Writes central-government-flows.csv: for each year, five flows into one pool ("Central government")
and six flows out of it, in Rs crore.

Into the pool:
  - Direct taxes (net): Table 87, column 3.
  - Indirect taxes (net), with GST: Table 87, column 6.
  - Non-tax revenue: Table 87, column 10.
  - Loan recoveries and disinvestment: Table 88, columns 6 and 7, added (derived).
  - Borrowing and other liabilities: Table 86, column 2, the gross fiscal deficit.
Out of the pool:
  - Interest payments: Table 89, column 4.
  - Subsidies: Table 89, column 5.
  - Defence, revenue and capital: Table 89, columns 3 and 9, added (derived).
  - Other revenue spending: Table 89, column 2 less columns 3, 4 and 5 (derived).
  - Other capital outlay: Table 89, column 8 less column 9 (derived).
  - Loans and advances: Table 89, column 7.

The script stops on any difference larger than TOLERANCE (rounding in the published columns):
  - flows in equal flows out;
  - flows out equal total expenditure (Table 89, column 10);
  - total receipts (Table 87, column 14) plus the drawdown of cash balance (Table 86, column 8)
    equal total expenditure;
  - direct and indirect taxes equal tax revenue (net) (Table 87, column 2);
  - loan recoveries, disinvestment and the fiscal deficit less the drawdown equal capital receipts
    (Table 87, column 13).
"""
import argparse
import csv
import html
import re

ap = argparse.ArgumentParser()
ap.add_argument("--raw", default="raw/economy/rbi")
ap.add_argument("--out", default="research/data/economy")
a = ap.parse_args()

TOLERANCE = 2  # Rs crore
YEARS = ["2022-23", "2023-24", "2024-25", "2025-26", "2026-27"]
POOL = "Central government"
errors = []


def table(n):
    """Year -> list of numbers in column order (column 2 first). A dash is None."""
    t = open(f"{a.raw}/table-{n}.html", encoding="utf-8", errors="ignore").read()
    t = re.sub(r"<script.*?</script>|<style.*?</style>", "", t, flags=re.S)
    out = {}
    for r in re.findall(r"<tr.*?</tr>", t, flags=re.S | re.I):
        cells = [re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", c))).strip() for c in re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", r, flags=re.S | re.I)]
        if cells and re.fullmatch(r"\d{4}-\d{2}", cells[0]):
            out[cells[0]] = [None if c in ("-", "") else int(c.replace(",", "")) for c in cells[1:]]
    if not out:
        raise SystemExit(f"table {n}: no rows")
    return out


def col(tbl, year, c):
    """Column c of a Handbook table (column 1 is the year)."""
    v = tbl[year][c - 2]
    if v is None:
        raise SystemExit(f"no value in column {c} for {year}")
    return v


def check(ok, msg):
    if not ok:
        errors.append(msg)


t86, t87, t88, t89 = table(86), table(87), table(88), table(89)
STATUS = {"2025-26": "revised estimate", "2026-27": "budget estimate"}
rows = []
for y in YEARS:
    direct, indirect, nontax = col(t87, y, 3), col(t87, y, 6), col(t87, y, 10)
    recovery, disinvest = col(t88, y, 6), col(t88, y, 7)
    gfd, drawdown = col(t86, y, 2), col(t86, y, 8)
    rev, def_rev, interest, subsidies = col(t89, y, 2), col(t89, y, 3), col(t89, y, 4), col(t89, y, 5)
    loans, outlay, def_cap, total = col(t89, y, 7), col(t89, y, 8), col(t89, y, 9), col(t89, y, 10)
    into = [
        ("Direct taxes", direct, "", "Table 87, column 3"),
        ("Indirect taxes, with GST", indirect, "", "Table 87, column 6"),
        ("Non-tax revenue", nontax, "", "Table 87, column 10"),
        ("Loan recoveries and disinvestment", recovery + disinvest, "derived", "Table 88, columns 6 and 7, added"),
        ("Borrowing and other liabilities", gfd, "", "Table 86, column 2 (gross fiscal deficit)"),
    ]
    out = [
        ("Interest payments", interest, "", "Table 89, column 4"),
        ("Subsidies", subsidies, "", "Table 89, column 5"),
        ("Defence", def_rev + def_cap, "derived", "Table 89, columns 3 and 9, added"),
        ("Other revenue spending", rev - def_rev - interest - subsidies, "derived", "Table 89, column 2 less columns 3, 4 and 5"),
        ("Other capital outlay", outlay - def_cap, "derived", "Table 89, column 8 less column 9"),
        ("Loans and advances", loans, "", "Table 89, column 7"),
    ]
    s_in, s_out = sum(v for _, v, _, _ in into), sum(v for _, v, _, _ in out)
    check(abs(s_in - s_out) <= TOLERANCE, f"{y}: in {s_in}, out {s_out}")
    check(abs(s_out - total) <= TOLERANCE, f"{y}: out {s_out}, total expenditure {total}")
    check(abs(col(t87, y, 14) + drawdown - total) <= TOLERANCE, f"{y}: receipts {col(t87, y, 14)} + drawdown {drawdown}, total expenditure {total}")
    check(abs(direct + indirect - col(t87, y, 2)) <= TOLERANCE, f"{y}: direct + indirect {direct + indirect}, tax revenue {col(t87, y, 2)}")
    check(abs(recovery + disinvest + gfd - drawdown - col(t87, y, 13)) <= TOLERANCE, f"{y}: capital receipts {col(t87, y, 13)}")
    status = STATUS.get(y, "accounts")
    for name, v, derived, src in into:
        rows.append(["india", y, name, POOL, v, "Rs crore", derived, status, src])
    for name, v, derived, src in out:
        rows.append(["india", y, POOL, name, v, "Rs crore", derived, status, src])
    print(f"{y}: in {s_in}, out {s_out}, total expenditure {total}")

if errors:
    raise SystemExit("Checks failed:\n  " + "\n  ".join(errors))
with open(f"{a.out}/central-government-flows.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f, lineterminator="\n")
    w.writerow(["geography", "period", "from", "to", "value", "unit", "derived", "status", "rbi_table"])
    w.writerows(rows)
print(f"central-government-flows.csv: {len(rows)} rows")
