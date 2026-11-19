"""Build the national and state health spending CSV from local NHA and WHO files."""

import argparse
import csv
import json
import re
import subprocess
from decimal import Decimal
from pathlib import Path

OOPE = "oope-share-of-the"
GHE = "ghe-share-of-the"
PUBLIC = "public-share-of-the"
THE = "percent of total health expenditure"
CHE = "percent of current health expenditure"
WHO = (
    ("out-of-pocket", "GHED_OOPSCHE_SHA2011", "oope-share-of-che", OOPE),
    ("government", "GHED_GGHE-DCHE_SHA2011", "gghed-share-of-che", GHE),
)


def pdf_text(raw, source):
    return subprocess.run(
        ["pdftotext", "-layout", raw / source / "report.pdf", "-"],
        check=True, capture_output=True, text=True, encoding="utf-8",
    ).stdout


def find_one(pattern, text):
    matches = re.findall(pattern, text, re.MULTILINE)
    if len(matches) != 1:
        raise ValueError(f"Expected one match for {pattern!r}, got {len(matches)}")
    return matches[0]


def decimal(value):
    return Decimal(value.replace(",", ""))


def share(part, total):
    return f"{decimal(part) * 100 / decimal(total):.2f}"


def row(period, series, value, source, source_kind, note="", *,
        geography="india", unit=THE, use="chart"):
    return {
        "geography": geography, "period": period, "series": series, "value": value,
        "unit": unit, "note": note, "year": period[:4], "source": source,
        "source_kind": source_kind, "use": use,
    }


def current_nha(raw, geographies):
    source = "nha-2023-24"
    report = pdf_text(raw, source)
    household = find_one(r"^[ \t]+6[ \t]+Out of Pocket Expenditure[ \t]+(64\.2[^\n]+)", report).split()
    government = find_one(r"^[ \t]+5[ \t]+Government Health[ \t]+(28\.6[^\n]+)", report).split()
    years = range(2013, 2024)
    for year, oop, gov in zip(years, household, government, strict=True):
        period = f"{year}-{(year + 1) % 100:02d}"
        notes = []
        if year <= 2016:
            notes.append("OOPE extrapolated from NSS 71st round (2014)")
        if year in (2017, 2018, 2019, 2023):
            notes.append("OOPE from NSS 75th round (2017-18)")
        if year >= 2022:
            notes.append("new data sources added from NHA 2022-23")
        yield row(period, OOPE, oop, source, "official", "; ".join(notes))
        yield row(period, GHE, gov, source, "official")

    # Table A.6. The preceding entry in the PDF is in the table of contents.
    table = report.split("Table A. 6: Key Health Financing Indicators for select States")[-1]
    table = table.split("Table A. 7")[0].splitlines()
    state_pattern = re.compile(r"\s+\d{1,2}\s+([A-Za-z ]+?)\s+((?:[\d.,]+\s+){10}[\d.,]+)")
    states = set()
    for index, line in enumerate(table):
        match = state_pattern.match(line)
        if not match:
            continue
        name, values = match.groups()
        continuation = table[index + 1].strip()
        if name in ("Andhra", "Madhya", "Himachal", "Uttar") and continuation == "Pradesh":
            name += " Pradesh"
        if name == "Jammu and" and continuation == "Kashmir":
            name += " Kashmir"
        slug = geographies[name]
        states.add(slug)
        values = values.split()
        yield row("2023-24", OOPE, values[9], source, "official",
                  "state estimate; OOPE from NSS 75th round (2017-18)", geography=slug)
        yield row("2023-24", GHE, values[4], source, "official", geography=slug)
    if len(states) != 21:
        raise ValueError(f"Expected 21 states in Table A.6, got {len(states)}")


def early_nha(raw):
    # Figure 2.5 and Table 2.14 of the commission report on the 2001-02 accounts.
    source = "macroeconomics-and-health"
    commission = pdf_text(raw, source)
    total = find_one(r"Total spending: Rs ([\d,]+) crore out of a GDP", commission)
    households = find_one(r"^  Total +33253\.31 +(\d+\.\d+) +94457\.19", commission)
    fig = commission.split("Share of entities in total health spending", 1)[1].split("Total spending:", 1)[0]
    government = sum(
        decimal(find_one(rf"{level} Govt\.[^\n]*\n(?:Households[ \t]*\n)?[ \t]+(\d+\.\d+)%?", fig))
        for level in ("Central", "State", "Local")
    )
    yield row("2001-02", OOPE, share(households, total), source, "archived copy",
              "Derived from direct household payments in Table 2.14 and total spending in Figure 2.5")
    yield row("2001-02", GHE, str(government), source, "archived copy",
              "Sum of central, state and local government shares in Figure 2.5")

    source = "nha-2004-05"
    older = pdf_text(raw, source)
    total = find_one(r"^[ \t]+Total Health Expenditure +(1,337,763,206) +100 +4\.25", older)
    household = find_one(r"^[ \t]+Total Expenditure on Health +([\d,]+) +100\.00 +853\.99", older)
    yield row("2004-05", OOPE, share(household, total), source, "archived copy",
              "Derived from Tables 4.1 and 1.1")

    source = "nha-2013-14"
    comparison = pdf_text(raw, source)
    government = find_one(r"Total Govt\. Health Exp as % of THE +(\d+\.\d+) +28\.6", comparison)
    yield row("2004-05", GHE, government, source, "official", "Table 6 comparison of the two accounts")

    # Table 1.5 uses public expenditure and gives no out-of-pocket amounts.
    table = older.split("Table 1.5: Health Expenditure in India (in Rs. 000)", 1)[1].split("Notes:", 1)[0]
    public = find_one(r"^[ \t]+Public Expenditure +([\d, ]+)$", table).split()
    totals = find_one(r"^[ \t]+Total Health Expenditure +([\d, ]+)$", table).split()
    for year, spend, total in zip(range(2005, 2009), public, totals, strict=True):
        yield row(f"{year}-{year + 1 - 2000:02d}", PUBLIC, share(spend, total),
                  "nha-2004-05", "archived copy", "Provisional public expenditure share derived from Table 1.5")


def who_estimates(raw, indian_rows):
    preferred = {
        (r["year"], GHE if r["series"] == PUBLIC else r["series"])
        for r in indian_rows if r["geography"] == "india"
    }
    for filename, indicator, series, indian_series in WHO:
        data = json.loads((raw / "who-ghed" / filename / f"{filename}.json").read_text(encoding="utf-8"))
        values = data["value"]
        years = [r["TimeDim"] for r in values]
        if (data.get("@odata.nextLink") or sorted(years) != list(range(2000, 2024))
                or any(r["SpatialDim"] != "IND" or r["IndicatorCode"] != indicator
                       or decimal(r["Value"]) != round(Decimal(str(r["NumericValue"])), 2) for r in values)):
            raise ValueError(f"Unexpected WHO data for {indicator}")
        for estimate in sorted(values, key=lambda value: value["TimeDim"]):
            year = str(estimate["TimeDim"])
            use = "overlap" if (year, indian_series) in preferred else "chart"
            yield row(year, series, estimate["Value"], "who-ghed", "international estimate",
                      unit=CHE, use=use)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--raw", type=Path, default=Path("raw/health"))
    parser.add_argument("--out", type=Path, default=Path("research/data/health"))
    parser.add_argument("--geo", type=Path, default=Path("research/data/geography.csv"))
    args = parser.parse_args()
    with args.geo.open(encoding="utf-8", newline="") as file:
        geographies = {r["name"]: r["slug"] for r in csv.DictReader(file)}

    indian = [*early_nha(args.raw), *current_nha(args.raw, geographies)]
    rows = [*indian, *who_estimates(args.raw, indian)]
    keys = {(r["geography"], r["period"], r["series"]) for r in rows}
    if len(keys) != len(rows) or any(not 0 <= decimal(r["value"]) <= 100 for r in rows):
        raise ValueError("Duplicate rows or invalid shares")
    args.out.mkdir(parents=True, exist_ok=True)
    path = args.out / "out-of-pocket-health-spending.csv"
    with path.open("w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=list(rows[0]), lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)
    print(f"{path.name}: {len(rows)} rows")


if __name__ == "__main__":
    main()
