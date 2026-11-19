"""Build repo-rate.csv from RBI HTML saved in raw/prices/repo.

Run from the repository root with python3 -I. See the Prices data README
for the releases, paths and hashes.
"""

import argparse
import csv
from datetime import datetime
from decimal import Decimal
from html import unescape
from pathlib import Path
import re


EARLY_SOURCE = "RBI Handbook of Statistics on Indian Economy 2010-11, Table 46"
CURRENT_SOURCE = "RBI Handbook of Statistics on Indian Economy 2025-26, Table 40"
AUCTION_END = "2004-03-28"
FIXED_START = "2004-03-29"
FIXED_START_SOURCE = "RBI Annual Policy Statement for 2004-05, paragraph 74"
CHECKED = "2026-11-18"

# Cross-check each Governor's Statement from April 2025 and each 2026 MPC resolution.
MEETINGS = (
    ("2025-04-09", "apr-2025/body.html", "6.00", True),
    ("2025-06-06", "jun-2025/body.html", "5.50", True),
    ("2025-08-06", "aug-2025/body.html", "5.50", False),
    ("2025-10-01", "oct-2025/body.html", "5.50", False),
    ("2025-12-05", "dec-2025/body.html", "5.25", True),
    ("2026-02-06", "feb-2026/body.html", "5.25", False),
    ("2026-04-08", "apr-2026/statement.html", "5.25", False),
    ("2026-06-05", "jun-2026/statement.html", "5.25", False),
    ("2026-08-05", "aug-2026/statement.html", "5.25", False),
    ("2026-10-07", "oct-2026/statement.html", "5.50", True),
)


def plain_text(source):
    return " ".join(unescape(re.sub(r"<[^>]*>", " ", source)).split())


def content(path):
    source = path.read_text(encoding="utf-8")
    start = source.index("Date : ")
    end = source.index('class="footer"', start)
    return source[start:end]


def handbook(path, columns):
    rates = {}
    for row in re.split(r"</tr>", content(path), flags=re.IGNORECASE):
        cells = [
            plain_text(cell)
            for cell in re.findall(r"<td\b[^>]*>(.*?)</td>", row, re.IGNORECASE | re.DOTALL)
        ]
        if len(cells) != columns or not re.fullmatch(r"\d{2}-\d{2}-\d{4}", cells[0]):
            continue
        if not re.fullmatch(r"\d+(?:\.\d+)?", cells[2]):
            continue
        period = datetime.strptime(cells[0], "%d-%m-%Y").date().isoformat()
        if period in rates:
            raise ValueError(f"Duplicate date in {path}: {period}")
        rates[period] = cells[2]
    if not rates:
        raise ValueError(f"No repo rates found in {path}")
    return dict(sorted(rates.items()))


def decision(path, period, expected, changed):
    source = plain_text(content(path))
    date = datetime.fromisoformat(period)
    if not re.search(rf"Date : {date:%b} 0?{date.day}, {date.year}", source):
        raise ValueError(f"Wrong release date in {path}")
    clause = r"by \d+ (?:basis points(?: \(bps\))?|bps) to" if changed else "unchanged at"
    match = re.search(
        rf"(?:policy )?repo rate(?: under the liquidity adjustment facility \(LAF\))? {clause} (\d+\.\d+) per cent",
        source, re.IGNORECASE,
    )
    if not match or Decimal(match[1]) != Decimal(expected):
        raise ValueError(f"RBI decision in {path} differs from {expected}")
    return match[1]


def dates_with_changes(rates):
    last = None
    for period, published in rates.items():
        value = Decimal(published)
        if value != last:
            yield period, published
        last = value


def build(raw):
    early = handbook(raw / "table46-2011/body.html", 7)
    current = handbook(raw / "table40/table.html", 8)
    join = min(current)
    early_overlap = {p: Decimal(v) for p, v in early.items() if p >= join}
    current_overlap = {p: Decimal(v) for p, v in current.items() if p <= max(early)}
    if not early_overlap or early_overlap != current_overlap:
        raise ValueError("RBI Handbook repo rates differ in the overlap")
    print(f"Handbook overlap: {len(early_overlap)} effective dates match")
    policy = plain_text((raw / "policy-2004-statement/body.html").read_text(encoding="utf-8"))
    first_fixed = re.search(
        r"the reverse repo rate was reduced to (\d+\.\d+) per cent per annum with effect from March 29, 2004",
        policy,
    )
    if not first_fixed or Decimal(first_fixed[1]) != Decimal(early["2004-03-31"]):
        raise ValueError("The first fixed rate differs between the RBI statement and Handbook")
    del early["2004-03-31"]
    early[FIXED_START] = first_fixed[1]
    rates = dict(sorted(({p: v for p, v in early.items() if p < join} | current).items()))

    for period, file, expected, changed in MEETINGS:
        published = decision(raw / file, period, expected, changed)
        if period.startswith("2026"):
            resolution = raw / f"{file.split('/')[0]}-resolution/body.html"
            decision(resolution, period, expected, changed)
        if period in current:
            if not changed or Decimal(current[period]) != Decimal(published):
                raise ValueError(f"RBI Handbook and statement differ on {period}")
        elif changed:
            if period <= max(current):
                raise ValueError(f"RBI Handbook is missing a change on {period}")
            rates[period] = published
        elif Decimal(next(v for p, v in reversed(rates.items()) if p < period)) != Decimal(published):
            raise ValueError(f"RBI hold differs from prevailing rate on {period}")

    latest = max(rates)
    decision(raw / "oct-2026-minutes/statement.html", "2026-10-21", rates[latest], True)
    print(f"Verified {len(MEETINGS)} Governor's Statements, five MPC resolutions and the October minutes")
    home = plain_text((raw / "current-rates/index.html").read_text(encoding="utf-8"))
    snapshot = re.search(r"Policy Repo Rate\s*:\s*(\d+\.\d+)%", home)
    if not snapshot or Decimal(snapshot[1]) != Decimal(rates[latest]):
        raise ValueError("RBI current rate differs from the latest decision")

    rows = []
    previous = None
    for period, value in dates_with_changes(rates):
        regime = "auction" if period <= AUCTION_END else "fixed"
        source = EARLY_SOURCE if period < join else CURRENT_SOURCE
        if period == FIXED_START:
            source = FIXED_START_SOURCE
        if period > max(current):
            source = "RBI Governor's Statement and MPC Resolution, 7 Oct 2026"
        if rows and rows[-1][4] == "auction" and regime == "fixed":
            rows.append(("india", AUCTION_END, rows[-1][2], "percent", "auction", "", EARLY_SOURCE,
                         "derived", "Last published setting carried to the end of the auction period"))
            previous = None
        change = "" if previous is None else f"{(Decimal(value) - previous) * 100:+.0f}"
        rows.append(("india", period, value, "percent", regime, change, source, "published", ""))
        previous = Decimal(value)
    rows.append(("india", CHECKED, snapshot[1], "percent", "fixed", "", "RBI Current Rates",
                 "snapshot", "Rate in effect since 7 October 2026"))
    return rows


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--raw", type=Path, default=Path("raw/prices/repo"))
    parser.add_argument("--out", type=Path, default=Path("research/data/prices/repo-rate.csv"))
    args = parser.parse_args()
    rows = build(args.raw)
    temporary = args.out.with_suffix(".tmp")
    with temporary.open("w", newline="") as output:
        writer = csv.writer(output)
        writer.writerow(["geography", "period", "value", "unit", "regime", "change_bps", "source", "status", "note"])
        writer.writerows(rows)
    temporary.replace(args.out)
    print(f"Wrote {len(rows)} rows to {args.out}")


if __name__ == "__main__":
    main()
