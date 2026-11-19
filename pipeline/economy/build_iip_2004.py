"""Build iip-growth-base-2004-05.csv from two eSankhyiki API pages.

Run from the repository root with python3 -I. See the Economy data README
for the request URLs and hashes.
"""

import argparse
from calendar import month_name
import csv
from decimal import Decimal
import json
from pathlib import Path


def read_rates(raw):
    rates = {}
    months = {name: number for number, name in enumerate(month_name)}
    for page in (1, 2):
        path = raw / f"page-{page}" / "body.json"
        data = json.loads(path.read_bytes())
        if not data["statusCode"] or data["meta_data"]["page"] != page:
            raise ValueError(f"Unexpected MoSPI response in {path}")
        for row in data["data"]:
            period = f"{row['year']}-{months[row['month']]:02d}"
            if period in rates or row["base_year"] != "2004-05" or row["category"] != "General":
                raise ValueError(f"Unexpected MoSPI row for {period}")
            rates[period] = row
    expected = [f"{year}-{month:02d}" for year in range(2005, 2018) for month in range(1, 13)
                if "2005-04" <= f"{year}-{month:02d}" <= "2017-03"]
    if sorted(rates) != expected:
        raise ValueError("The MoSPI IIP series does not cover all 144 months")
    return rates


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--raw", type=Path, default=Path("raw/economy/iip-history"))
    parser.add_argument("--out", type=Path, default=Path("research/data/economy"))
    args = parser.parse_args()
    rates = read_rates(args.raw)
    with (args.out / "iip-growth-monthly.csv").open(newline="") as source:
        overlap = [
            abs(Decimal(r["value"]) - Decimal(rates[r["period"]]["growth_rate"]))
            for r in csv.DictReader(source)
            if r["base"] == "2011-12" and r["period"] >= "2013-04" and r["period"] in rates
        ]
    if len(overlap) != 48:
        raise ValueError("Expected 48 overlapping months with the 2011-12 series")
    print(f"IIP overlap: {sum(x != 0 for x in overlap)}/{len(overlap)} differ. Largest gap {max(overlap)} pp")

    destination = args.out / "iip-growth-base-2004-05.csv"
    temporary = destination.with_suffix(".tmp")
    with temporary.open("w", newline="") as output:
        writer = csv.writer(output)
        writer.writerow(["geography", "period", "value", "unit", "category", "base", "index"])
        for period, row in sorted(rates.items()):
            if period < "2006-04":
                # The API compares these first 12 observations with the base-year average.
                if Decimal(row["growth_rate"]) != Decimal(row["index"]) - 100:
                    raise ValueError(f"Unexpected first-year growth rate for {period}")
                continue
            writer.writerow(["india", period, row["growth_rate"], "percent", "General", "2004-05", row["index"]])
    temporary.replace(destination)


if __name__ == "__main__":
    main()
