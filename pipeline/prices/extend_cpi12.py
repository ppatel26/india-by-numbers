"""Add early published rates to the two base-2012 chart CSVs.

Run from the repository root with python3 -I. Pass --fetch to save the
MoSPI API responses before building. The current-series CSV rows come
from build_prices_economy.py or the checked-in CSVs.
"""

import argparse
import csv
import json
import time
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen


API = "https://api.mospi.gov.in/api/cpi/getCPIIndex"
USER_AGENT = "IndiaByNumbers/1.0 (+https://indiabynumbers.org/about/)"
FIRST_RATE = "2012-01"
FIRST_CURRENT_RATE = "2014-01"
SECTORS = ("Rural", "Urban", "Combined")


def months():
    for series, start in (("Back", 2011), ("Current", 2013)):
        for year in range(start, 2015):
            for month in range(1, 2 if year == 2014 else 13):
                yield series, f"{year}-{month:02d}"


def read_month(raw_dir, series, period, fetch):
    path = raw_dir / f"{series.lower()}-{period}" / "body.json"
    if fetch and not path.is_file():
        year, month = period.split("-")
        query = urlencode({
            "base_year": 2012, "series": series, "state_code": 99,
            "year": year, "month_code": int(month), "limit": 100, "page": 1,
        })
        request = Request(f"{API}?{query}", headers={"User-Agent": USER_AGENT})
        with urlopen(request, timeout=60) as response:
            body = response.read()
        json.loads(body)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(body)
        time.sleep(0.25)
    response = json.loads(path.read_bytes())
    rows = response["data"] or []
    total = response.get("meta_data", {}).get("totalRecords")
    if total is None and response["msg"] == "No Data Found":
        total = 0
    if not response["statusCode"] or total != len(rows):
        raise ValueError(f"Incomplete MoSPI response in {path}")
    keys = {(r["sector"], r["subgroup"]) for r in rows}
    if len(keys) != len(rows):
        raise ValueError(f"Duplicate MoSPI keys in {path}")
    return rows


def read_csv(path):
    with path.open(newline="") as source:
        reader = csv.DictReader(source)
        return reader.fieldnames, list(reader)


def write_csv(path, fields, rows):
    temporary = path.with_suffix(".tmp")
    with temporary.open("w", newline="") as output:
        writer = csv.DictWriter(output, fields)
        writer.writeheader()
        writer.writerows(rows)
    temporary.replace(path)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--raw", type=Path, default=Path("raw/prices/cpi-history"))
    parser.add_argument("--out", type=Path, default=Path("research/data/prices"))
    parser.add_argument("--fetch", action="store_true")
    args = parser.parse_args()

    observations = {}
    for series, period in months():
        for row in read_month(args.raw, series, period, args.fetch):
            group = row["subgroup"].removesuffix("-Overall")
            if row["subgroup"].endswith("-Overall") and (group == "General" or row["sector"] == "Combined"):
                observations.setdefault((period, row["sector"], group), {})[series] = row
    overlap = [records for records in observations.values() if records.keys() == {"Back", "Current"}]
    rates = [r for r in overlap if all(row["inflation"] is not None for row in r.values())]
    differences = sum(r["Back"]["index"] != r["Current"]["index"] for r in overlap)
    print(f"CPI overlap: {len(rates)} comparable rates. {differences}/{len(overlap)} published indices differ")
    build_csvs(args.out, observations)


def build_csvs(output, observations):
    sector_path = output / "cpi-inflation-rural-urban.csv"
    group_path = output / "cpi-inflation-by-group-2012-base.csv"
    sector_fields, sector_rows = read_csv(sector_path)
    group_fields, group_rows = read_csv(group_path)
    sector_rows = [r for r in sector_rows if r["period"] >= FIRST_CURRENT_RATE]
    group_rows = [r for r in group_rows if r["period"] >= FIRST_CURRENT_RATE]
    groups = {r["group"] for r in group_rows}

    current_rows = [
        (r, r["sector"].title(), "General") for r in sector_rows if r["period"] == FIRST_CURRENT_RATE
    ] + [(r, "Combined", r["group"]) for r in group_rows if r["period"] == FIRST_CURRENT_RATE]
    for row, sector, group in current_rows:
        api_row = observations[(FIRST_CURRENT_RATE, sector, group)]["Current"]
        if (row["value"], row["index"], row["status"]) != (
            api_row["inflation"], api_row["index"], api_row["status"]
        ):
            raise ValueError(f"MoSPI current series differs from the existing CSV: {row}")

    group_fields = [*group_fields, "series"] if "series" not in group_fields else group_fields
    for row in group_rows:
        row["series"] = "current series"

    for (period, sector, group), records in sorted(observations.items()):
        if period < FIRST_RATE and any(row["inflation"] is not None for row in records.values()):
            raise ValueError(f"MoSPI now publishes rates before {FIRST_RATE}")
        if not FIRST_RATE <= period < FIRST_CURRENT_RATE:
            continue
        available = [(series, row) for series, row in records.items() if row["inflation"] is not None]
        if len(available) > 1 and available[0][1]["inflation"] != available[1][1]["inflation"]:
            raise ValueError(f"Conflicting MoSPI rates for {(period, sector, group)}")
        series, row = available[-1] if available else next(reversed(records.items()))
        base = {
            "geography": "india", "period": period, "value": row["inflation"],
            "unit": "percent", "sector": sector.lower(), "base": "2012=100",
            "index": row["index"], "status": row["status"],
            "series": f"{series.lower()} series",
        }
        if group == "General":
            note = "" if available else "No inflation rate in the MoSPI API"
            sector_rows.append({**base, "note": note})
        if sector == "Combined" and group in groups:
            group_rows.append({**base, "group": group})

    sector_rows.sort(key=lambda row: (row["period"], SECTORS.index(row["sector"].title())))
    group_rows.sort(key=lambda row: (row["group"] != "General", row["group"], row["period"]))
    write_csv(sector_path, sector_fields, sector_rows)
    write_csv(group_path, group_fields, group_rows)
    print(f"Wrote {len(sector_rows)} sector rows and {len(group_rows)} group rows")


if __name__ == "__main__":
    main()
