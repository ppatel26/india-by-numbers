"""Build E7 from the RBI Handbook HTML tables and IMF IFS via DBnomics.

Run from the repository root with python3 -I. The Economy data README lists
the raw files and their URLs. This script reads the files as data only.
"""

import argparse
import csv
import json
import re
from decimal import Decimal
from html.parser import HTMLParser
from pathlib import Path


class TableRows(HTMLParser):
    def __init__(self):
        super().__init__()
        self.rows = []
        self.row = []
        self.cell = None

    def handle_starttag(self, tag, attrs):
        if tag == "tr":
            self.row = []
        elif tag == "td":
            self.cell = []

    def handle_data(self, data):
        if self.cell is not None:
            self.cell.append(data)

    def handle_endtag(self, tag):
        if tag == "td" and self.cell is not None:
            self.row.append(" ".join("".join(self.cell).split()))
            self.cell = None
        elif tag == "tr" and self.row:
            self.rows.append(self.row)
            self.row = []


def handbook(path, period_pattern, usd_columns):
    parser = TableRows()
    parser.feed(path.read_text(encoding="utf-8-sig"))
    result = {}
    for row in parser.rows:
        if not row or not re.fullmatch(period_pattern, row[0]):
            continue
        if row[0] in result:
            raise ValueError(f"{path}: duplicate period {row[0]}")
        cells = [cell for cell in row if cell]
        result[row[0]] = tuple(Decimal(cells[col]) for col in usd_columns)
    if not result:
        raise ValueError(f"{path}: no exchange rates found")
    return result


def imf_annual(path):
    payload = json.loads(path.read_text(encoding="utf-8"), parse_float=Decimal)
    [series] = payload["series"]["docs"]
    if series["provider_code"] != "IMF" or series["series_code"] != "A.IN.ENDA_XDC_USD_RATE":
        raise ValueError(f"{path}: expected IMF India calendar-year averages")
    return {
        period: (Decimal(value),)
        for period, value in zip(series["period"], series["value"], strict=True)
        if value not in ("NA", None)
    }


def compare(label, earlier, later, column=0):
    overlap = earlier.keys() & later.keys()
    differences = [(abs(earlier[p][column] - later[p][column]), p) for p in overlap]
    worst, period = max(differences)
    n = len(overlap)
    exact = sum(delta == 0 for delta, _ in differences)
    detail = f" on {period} ({earlier[period][column]} vs {later[period][column]})" if worst else ""
    print(f"{label}: {n} shared periods, {min(overlap)} to {max(overlap)}, "
          f"{exact} exact, largest difference {worst:.4f}{detail}")


def financial_year(year):
    return f"{year}-{(year + 1) % 100:02d}"


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("--raw", type=Path, default=Path("raw/economy"))
    cli.add_argument("--out", type=Path, default=Path("research/data/economy"))
    args = cli.parse_args()

    fy_pattern = r"\d{4}-\d{2}"
    older = handbook(args.raw / "usd-inr-2002-handbook-fy/table-133.html", fy_pattern, (3, 4))
    latest = handbook(args.raw / "usd-inr-2026-handbook-fy/table-133.html", fy_pattern, (3, 4))
    imf = imf_annual(args.raw / "usd-inr-imf-ifs/india-annual.json")
    compare("RBI 2002 vs RBI 2026, financial-year average", older, latest)
    compare("RBI 2002 vs RBI 2026, end of financial year", older, latest, column=1)

    for edition in (2002, 2026):
        calendar = handbook(args.raw / f"usd-inr-{edition}-handbook-calendar/table-132.html", r"\d{4}", (2,))
        compare(f"RBI {edition} vs IMF IFS, calendar-year average", calendar, imf)

    published = [
        (str(year), imf[str(year)][0], "calendar-year average", "international estimate", "IMF IFS via DBnomics")
        for year in range(1950, 1970)
    ]
    first_latest = int(min(latest)[:4])
    published.extend(
        (period, older[period][0], "financial-year average", "official", "RBI Handbook Table 133 (2002)")
        for period in map(financial_year, range(1970, first_latest))
    )
    for period in map(financial_year, range(first_latest, int(max(latest)[:4]) + 1)):
        average, end = latest[period]
        source = "RBI Handbook Table 133 (2026)"
        published.append((period, average, "financial-year average", "official", source))
        published.append((period, end, "end of financial year", "official", source))

    path = args.out / "usd-inr-annual.csv"
    with path.open("w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file, lineterminator="\n")
        writer.writerow(["geography", "period", "value", "unit", "measure", "source_kind", "source"])
        for period, value, measure, kind, source in published:
            writer.writerow(["india", period, format(value.normalize(), "f"), "rupees per US dollar", measure, kind, source])
    print(f"Wrote {len(published)} rows from {published[0][0]} to {published[-1][0]} to {path}")


if __name__ == "__main__":
    main()
