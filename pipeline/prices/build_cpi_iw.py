"""Build the monthly CPI-IW history from published year-on-year rates.

Run with python3 -I from the repository root. The Prices README lists the
source files and hashes. Poppler's pdftotext reads the saved Labour Bureau PDFs.
"""

import csv
from calendar import month_name
from decimal import Decimal, ROUND_HALF_UP
from html import unescape
from pathlib import Path
import re
from statistics import mean
import subprocess


RAW = Path("raw/prices/cpi-iw")
DATA = Path("research/data/prices")
START, CHANGE, STOP = "1994-01", "2006-01", "2012-01"
LINK = Decimal("4.63")
RBI = "https://www.rbi.org.in/Scripts/PublicationsView.aspx?id="
LABOUR = "https://labourbureau.gov.in/uploads/pdf/"


def financial_months(year):
    return [f"{year + (offset >= 9)}-{(offset + 3) % 12 + 1:02d}" for offset in range(12)]


def html_cells(body):
    for row in re.findall(r"<tr\b[^>]*>(.*?)</tr>", body, re.I | re.S):
        yield [
            " ".join(unescape(re.sub(r"<[^>]*>", " ", cell)).split())
            for cell in re.findall(r"<td\b[^>]*>(.*?)</td>", row, re.I | re.S)
        ]


def rbi_rates(directory):
    body = (RAW / directory / "body.html").read_text(encoding="utf-8")
    cells = iter(html_cells(body))
    for row in cells:
        if row and re.match(r"Industrial Workers?\b", row[0], re.I) and "Food" not in row[0]:
            break
    rates = {}
    for row in cells:
        if not row or len(row) != 13 or not re.fullmatch(r"\d{4}-\d{2}", row[0]):
            break
        for month, value in zip(financial_months(int(row[0][:4])), row[1:], strict=True):
            if value in ("", "-"):
                continue
            if month in rates:
                raise ValueError(f"Duplicate {month} in {directory}")
            rates[month] = Decimal(value)
    if not rates:
        raise ValueError(f"No CPI-IW rates in {directory}")
    return rates


def pdf_text(directory, first, last):
    return subprocess.run(
        ["pdftotext", "-layout", "-f", str(first), "-l", str(last),
         str(RAW / directory / "body.pdf"), "-"],
        check=True, capture_output=True, text=True,
    ).stdout


def labour_rates(year):
    body = pdf_text(f"labour-{year}", 12, 12)
    if f"General and Food Inflation rates for the year {year}" not in body:
        raise ValueError(f"No Labour Bureau inflation table for {year}")
    names = "|".join(month_name[1:])
    rows = re.findall(rf"\b({names})\s+(\d+\.\d{{2}})\s+\d+\.\d{{2}}", body)
    if [name for name, _ in rows] != list(month_name[1:]):
        raise ValueError(f"Incomplete Labour Bureau inflation table for {year}")
    return {f"{year}-{i:02d}": Decimal(value) for i, (_, value) in enumerate(rows, 1)}


def labour_indices(directory, table, first, last):
    body = pdf_text(directory, first, last)
    body = body[body.index(f"TABLE {table}1: ALL-INDIA"):body.index(f"TABLE {table}2:")]
    indices = {}
    for section in re.split(r"Year\s*:\s*", body)[1:]:
        year = int(section[:4])
        row = re.search(r"General Index\s+100\.00[ \t]+([0-9 \t]+)", section)
        if not row:
            continue
        values = row[1].split()
        if len(values) != 12:
            continue
        for i, value in enumerate(values, 1):
            indices[f"{year}-{i:02d}"] = Decimal(value)
    return indices


def rate(current, previous):
    return (current / previous - 1) * 100


def check_overlap(name, first, second, tolerance=Decimal("0")):
    months = first.keys() & second.keys()
    if not months:
        raise ValueError(f"No overlapping rates for {name}")
    mismatches = [
        month for month in sorted(months)
        if abs(first[month] - second[month]) > tolerance
    ]
    if mismatches:
        raise ValueError(f"{name} differs in {mismatches}")
    print(f"{name}: {len(months)} rates agree within {tolerance} percentage points")


def check_indices(rates):
    old = labour_indices("labour-volume-iii", "C", 57, 63)
    new = labour_indices("labour-volume-iv", "D", 59, 64)
    # Volume IV, Table 2 gives the all-India factor from 2001 to 1982.
    linked = {**old, **{month: index * LINK for month, index in new.items()}}
    for month, published in rates.items():
        if START <= month < STOP:
            prior = f"{int(month[:4]) - 1}{month[4:]}"
            reconstructed = rate(linked[month], linked[prior])
            if reconstructed.quantize(published, ROUND_HALF_UP) != published:
                raise ValueError(f"Labour Bureau indices differ from the published rate for {month}")
    print("Labour Bureau indices reproduce all 216 chart rates at their published precision")

    annual = {
        row["period"]: Decimal(row["value"])
        for row in csv.DictReader((DATA / "cpi-annual-inflation-long-run.csv").read_text().splitlines())
        if row["series"] == "CPI-IW (industrial workers)"
    }
    print("FY, mean of monthly rates, change in mean index, RBI annual rate")
    for year in range(1993, 2012):
        fy = f"{year}-{(year + 1) % 100:02d}"
        months = financial_months(year)
        average_rate = mean(rates[month] for month in months)
        index_rate = rate(
            mean(linked[month] for month in months),
            mean(linked[month] for month in financial_months(year - 1)),
        )
        if index_rate.quantize(Decimal("0.1"), ROUND_HALF_UP) != annual[fy]:
            raise ValueError(f"Labour Bureau indices differ from the RBI annual rate for {fy}")
        print(f"{fy}, {average_rate:.2f}, {index_rate:.2f}, {annual[fy]}")


def main():
    early = rbi_rates("rbi-2008-variation")
    bridge = rbi_rates("rbi-2011-variation")
    later = rbi_rates("rbi-2014-variation")
    labour_2011 = labour_rates(2011)
    labour_2012 = labour_rates(2012)
    check_overlap("RBI 2008 vs 2004", early, rbi_rates("rbi-2004-variation"))
    check_overlap("RBI 2008 vs 2011", early, bridge)
    check_overlap("RBI 2011 vs 2014", bridge, later)
    check_overlap("Labour Bureau 2011 and 2012 vs RBI 2014", labour_2011 | labour_2012, later, Decimal("0.05"))

    published = bridge | early | labour_2011
    expected = [f"{year}-{month:02d}" for year in range(1994, 2012) for month in range(1, 13)]
    selected = sorted(month for month in published if START <= month < STOP)
    if selected != expected:
        raise ValueError(f"Missing CPI-IW months: {sorted(set(expected) - set(selected))}")
    check_indices(published | labour_2012)

    with (DATA / "cpi-iw-inflation-monthly.csv").open("w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file, lineterminator="\n")
        writer.writerow(("geography", "period", "value", "unit", "base", "source_kind", "derived", "source"))
        for month in selected:
            if month in labour_2011:
                source = LABOUR + "CPI_IW_AR_2011.pdf"
            elif month in early:
                source = RBI + "10771"
            else:
                source = RBI + "13832"
            writer.writerow((
                "india", month, published[month], "percent", "1982=100" if month < CHANGE else "2001=100",
                "official", "false", source,
            ))
    print(f"Wrote {len(selected)} published monthly rates from {selected[0]} to {selected[-1]}")


if __name__ == "__main__":
    main()
