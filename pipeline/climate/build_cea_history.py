"""Extend the CEA capacity charts from the booklet and Executive Summary archive."""

import csv
import re
import subprocess
from collections import defaultdict
from datetime import datetime
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path


RAW = Path("raw/climate")
OUT = Path("research/data/climate")
GROWTH = "Growth of Electricity Sector in India, 1947 to 2025"
EXECUTIVE = "Executive Summary, March"
BREAKDOWN = "Growth of Electricity Sector in India, 1947 to 2023, Chart 8B"
MAIN_MODES = ("hydro", "thermal", "nuclear", "res", "total")
RENEWABLE_MODES = ("small-hydro", "wind", "bio-power", "waste-to-energy", "solar")
NUMBER = r"\d[\d,]*(?:\.\d+)?"


def pages(directory):
    text = subprocess.check_output(
        ["pdftotext", "-layout", RAW / directory / "download", "-"], text=True,
    )
    return text.split("\f")


def numbers(line):
    return [Decimal(text.replace(",", "")) for text in re.findall(NUMBER, line)]


def read_growth():
    table = next(page for page in pages("ceagrowth2025alt")
                 if "Installed Generation Capacity - Mode-wise" in page and "31.12.47" in page)
    data = {}
    for line in table.splitlines():
        row = re.match(r"\s*\d+\s+(\d\d\.\d\d\.)(\d{4}|\d\d)\s+(?:\([^)]*\)\s+)?(.*)", line)
        if not row:
            continue
        year = int(row[2])
        if len(row[2]) == 2:
            year += 2000 if year < 47 else 1900
        date = datetime.strptime(f"{row[1]}{year}", "%d.%m.%Y")
        coal, gas, diesel, thermal, nuclear, hydro, res, _, total = numbers(row[3])
        data[date.date().isoformat()] = dict(zip(
            ("coal-incl-lignite", "gas", "diesel", "thermal", "nuclear", "hydro", "res", "total"),
            (coal, gas, diesel, thermal, nuclear, hydro, res, total),
        ))
    assert len(data) == 25
    return data


def read_legacy_summary():
    page = next(page for page in pages("cea-exec-2006")
                if "Growth Of Installed Capacity Since Sixth Plans" in page and "March, 2003" in page)
    rows = {}
    for year in range(1998, 2006):
        line = next(line for line in page.splitlines() if line.startswith(f"March, {year}"))
        _, hydro, thermal, wind, *other_res, nuclear, total = numbers(line)
        rows[f"{year}-03-31"] = {
            "hydro": hydro, "thermal": thermal, "wind": wind,
            "nuclear": nuclear, "total": total,
            **({"other-res": other_res[0]} if other_res else {}),
        }
    return rows


def read_executive(year):
    national = re.compile(r"^\s*ALL INDIA(?:[ \t]+State|[ \t]*$)", re.M)
    page = next(page for page in pages(f"cea-exec-{year}")
                if "ALL INDIA INSTALLED CAPACITY (IN MW) OF POWER STATIONS" in page
                and national.search(page))
    total_row = next(line for line in page[national.search(page).end():].splitlines()
                     if re.match(r"\s*Total\s+\d", line))
    values = numbers(total_row)
    if year <= 2007:
        hydro, *thermal_parts, nuclear, res, total = values
    else:
        *thermal_parts, nuclear, hydro, res, total = values
    coal, gas, diesel, thermal = thermal_parts
    assert abs(coal + gas + diesel - thermal) <= Decimal(".01"), year
    return dict(zip(
        ("coal-incl-lignite", "gas", "diesel", "thermal", "nuclear", "hydro", "res", "total"),
        (coal, gas, diesel, thermal, nuclear, hydro, res, total),
    ))


def read_review(directory):
    page = next(page for page in pages(directory)
                if "GROWTH OF INSTALLED CAPACITY - MODE-WISE" in page.upper()
                and "31.12.1950" in page)
    rows = {}
    for match in re.finditer(r"(\d{2}\.\d{2}\.\d{4})"
                             r"(?:[ \t]*\n[ \t]*\d+|[ \t]*(?:\([^)]*\))?)"
                             r"[ \t]+((?:\d+[ \t]+){4}\d+)[ \t]*$", page, re.M):
        period = datetime.strptime(match[1], "%d.%m.%Y").date().isoformat()
        rows[period] = dict(zip(MAIN_MODES, numbers(match[2])))
    return rows


def read_renewable_breakdown():
    page = next(page for page in pages("ceagrowth2023")
                if "during last 15 years" in page and "WASTE TO ENERGY" in page)
    lines = [
        numbers(next(line for line in page.splitlines() if line.lstrip().startswith(label + " ")))
        for label in ("SHP", "WIND", "BIOMASS", "WASTE TO ENERGY", "SOLAR")
    ]
    return {f"{year}-03-31": dict(zip(RENEWABLE_MODES, values))
            for year, values in enumerate(zip(*lines, strict=True), 2009)}


def compare(label, older, newer, all_modes_limit=None):
    for period in sorted(older.keys() & newer.keys()):
        diff = {mode: newer[period][mode] - older[period][mode] for mode in MAIN_MODES}
        assert all(abs(diff[mode]) <= 1 for mode in ("hydro", "thermal", "nuclear")), (period, diff)
        if all_modes_limit is not None:
            assert all(abs(delta) <= all_modes_limit for delta in diff.values()), (period, diff)
        print(label, period, "later minus earlier, MW:", *diff.values())


def share(numerator, denominator):
    return (100 * numerator / denominator).quantize(Decimal(".01"), rounding=ROUND_HALF_UP)


def main():
    growth = read_growth()
    legacy = read_legacy_summary()
    executive = {f"{year}-03-31": read_executive(year) for year in range(2006, 2015)}
    review_2020 = read_review("ceareview2019")
    review_2025 = read_review("ceareview2024")
    breakdown = read_renewable_breakdown()
    assert len(review_2020) == 26 and len(review_2025) == 31
    assert len(breakdown) == 15

    latest = defaultdict(dict)
    with (OUT / "installed-capacity-by-source-2014-2026.csv").open(newline="") as file:
        for row in csv.DictReader(file):
            latest[row["period"]][row["source"]] = Decimal(row["value"])
    for row in latest.values():
        row["hydro"] = row["large-hydro"]
        row["res"] = sum(row[mode] for mode in RENEWABLE_MODES)
        row["thermal"] = sum(row.get(mode, 0) for mode in
                             ("coal-incl-lignite", "coal", "lignite", "gas", "diesel"))

    compare("Executive Summary to General Review 2020", executive, review_2020)
    compare("General Review 2020 to monthly reports", review_2020, latest, Decimal(".50"))
    compare("Growth booklet to monthly reports", growth, latest)
    compare("General Review 2025 to monthly reports", review_2025, latest)
    compare("Executive Summary to monthly reports", executive, latest)
    compare("Growth booklet to Executive Summary", growth, executive, Decimal("1"))
    compare("Growth booklet to General Review 2025 before 1998",
            {period: row for period, row in growth.items() if period < "1998"}, review_2025, Decimal("1"))
    assert legacy["2002-03-31"]["total"] == growth["2002-03-31"]["total"]
    assert legacy["2002-03-31"]["thermal"] - growth["2002-03-31"]["thermal"] == Decimal("120.54")
    for period in latest.keys() & breakdown.keys():
        assert all(abs(latest[period][mode] - breakdown[period][mode]) <= Decimal(".01")
                   for mode in RENEWABLE_MODES), period

    observations = {
        **{period: (row, GROWTH, "plan") for period, row in growth.items() if period < "1998"},
        **{period: (row, f"{EXECUTIVE} 2006, historical table", "legacy") for period, row in legacy.items()},
        **{period: (row, f"{EXECUTIVE} {period[:4]}", "executive")
           for period, row in executive.items() if period < "2014"},
    }
    assert sorted(period for period in observations if period >= "1997") == [
        f"{year}-03-31" for year in range(1997, 2014)
    ]

    capacity_rows = []
    share_rows = []
    for period, (row, release, method) in sorted(observations.items()):
        for mode, value in row.items():
            capacity_rows.append(["india", period, value, "MW", mode, release, "no"])
        renewables = row["res"] if "res" in row else row["wind"] + row.get("other-res", 0)
        hydro_and_res = row["hydro"] + renewables
        capacity_rows.append(["india", period, hydro_and_res, "MW", "hydro-and-res", release, "yes"])
        non_fossil = hydro_and_res + row["nuclear"]
        assert abs(non_fossil + row["thermal"] - row["total"]) <= 1, period
        share_rows.append([
            "india", period, share(non_fossil, row["total"]), "% of installed capacity",
            "non-fossil", method, release, "yes",
        ])
        # Small hydro classification changed in March 2008. The RES share starts there.
        if period >= "2008":
            share_rows.append([
                "india", period, share(renewables, row["total"]), "% of installed capacity",
                "wind-solar-other-re", method, release, "yes",
            ])
        if period in breakdown:
            assert abs(sum(breakdown[period].values()) - renewables) <= Decimal(".01"), period
            for mode, value in breakdown[period].items():
                capacity_rows.append(["india", period, value, "MW", mode, BREAKDOWN, "no"])

    with (OUT / "non-fossil-share-of-capacity-2014-2026.csv").open(newline="") as file:
        for row in csv.DictReader(file):
            period, series = row["period"], row["series"]
            method = "off-grid" if period >= "2022" else "monthly"
            published = series == "non-fossil" and period in {"2026-03-31", "2026-10-31"}
            share_rows.append([
                row["geography"], period, row["value"], row["unit"], series, method,
                "Installed Capacity monthly report", "no" if published else "yes",
            ])

    with (OUT / "historic-installed-capacity-1947-2013.csv").open("w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["geography", "period", "value", "unit", "source", "release", "derived"])
        writer.writerows(capacity_rows)
    with (OUT / "non-fossil-share-of-capacity-1947-2026.csv").open("w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["geography", "period", "value", "unit", "series", "method", "release", "derived"])
        writer.writerows(share_rows)


if __name__ == "__main__":
    main()
