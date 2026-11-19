"""Build the separate base-2010 CPI series from MoSPI's published rates.

Run with python3 -I from the repository root. The Prices data README lists
the raw files and their hashes. Poppler's pdftotext reads the saved PDFs.
"""

import argparse
import csv
from datetime import datetime
from decimal import Decimal, ROUND_HALF_UP
from html import unescape
from pathlib import Path
import re
import subprocess


ARCHIVE = "https://web.archive.org/web/"
UPLOADS = "http://mospi.nic.in/Mospi_New/upload/"
PAPER = ARCHIVE + "20140718231112if_/" + UPLOADS + "Paper_on_Inflation_Rates_18June2014.pdf?status=1&menu_id=236"
SECTORS = ("rural", "urban", "combined")
GROUPS = {
    "Food and beverages": "Food and Beverages",
    "Fuel and light": "Fuel and Light",
    "Clothing, Bedding and footwear": "Clothing, Bedding and Footwear",
    "Miscellaneous": "Miscellaneous",
    "Housing": "Housing",
}
# Period finalised, raw directory, URL. The last release also checks a 2014 overlap.
RELEASES = (
    ("2013-03", "mospi-t4-20130517", ARCHIVE + "20130517084919if_/" + UPLOADS + "t4.pdf"),
    ("2013-05", "mospi-t4-jul2013", ARCHIVE + "20130809185517if_/" + UPLOADS + "t4.pdf"),
    ("2013-10", "mospi-t4-dec2013", ARCHIVE + "20131224184034if_/http://mospi.nic.in/mospi_new/upload/t4.pdf"),
    ("2013-11", "mospi-t4-feb2014", ARCHIVE + "20140209135925if_/" + UPLOADS + "t4.pdf"),
    ("2014-01", "mospi-t4-20140911", ARCHIVE + "20140911192956if_/http://mospi.nic.in/mospi_new/upload/t4.pdf"),
)
RATE = r"(-?\d+\.\d+)"
MONTH = r"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(12|13|14)"


def pdf_text(path, *options):
    return subprocess.run(
        ["pdftotext", "-layout", *options, str(path), "-"],
        capture_output=True, text=True, check=True,
    ).stdout


def month_rows(section, count):
    rates = {}
    for match in re.finditer(rf"^ *{MONTH}" + r" +" + r" +".join([RATE] * count), section, re.M):
        month, year, *values = match.groups()
        period = datetime.strptime(f"{month}-{year}", "%b-%y").strftime("%Y-%m")
        if period in rates:
            raise ValueError(f"Duplicate CPI row for {period}")
        rates[period] = values
    expected = {f"20{y}-{m:02d}" for y, end in [(12, 12), (13, 12), (14, 3)] for m in range(1, end + 1)}
    if rates.keys() != expected:
        raise ValueError(f"Missing CPI rows: {sorted(expected - rates.keys())}")
    return rates


def read_paper(raw):
    source = pdf_text(raw / "mospi-paper-pdf/body.pdf")
    if "2010 = 100" not in source:
        raise ValueError("The MoSPI paper does not identify the CPI base")
    table1 = source.split("Table 1: All India inflation rates", 1)[1].split("Table 2:", 1)[0]
    table2 = source.split("Table 2: All India Inflation Rates", 1)[1].split("Table 3.", 1)[0]
    rates = {
        (period, sector, "General"): (value, PAPER, "retrospective")
        for period, values in month_rows(table1, 3).items()
        for sector, value in zip(SECTORS, values, strict=True)
    }
    headings = "|".join(map(re.escape, GROUPS))
    sections = re.split(rf"^ *({headings})\s*$", table2, flags=re.M)
    if sections[1::2] != list(GROUPS):
        raise ValueError("Unexpected headings in MoSPI Table 2")
    for heading, section in zip(sections[1::2], sections[2::2], strict=True):
        # The housing table has a value only in the CPI (U) column.
        sector, count = ("urban", 1) if heading == "Housing" else ("combined", 3)
        for period, values in month_rows(section, count).items():
            rates[period, sector, GROUPS[heading]] = (values[-1], PAPER, "retrospective")
    return rates


def apply_final_releases(rates, raw):
    for period, directory, url in RELEASES:
        name = datetime.fromisoformat(period + "-01").strftime("%B %Y")
        source = " ".join(pdf_text(raw / directory / "body.pdf", "-f", "1", "-l", "1").split())
        combined = re.search(rf"compared to {RATE}% \(final\) for (?:the )?previous month of {name}", source)
        rural_urban = re.search(
            rf"Inflation rates \(final\) for rural and urban areas for {name} are {RATE}% and {RATE}%",
            source,
        )
        if not combined or not rural_urban or "BASE 2010=100" not in source:
            raise ValueError(f"No final rates for {period} in {directory}")
        for sector, value in zip(SECTORS, (*rural_urban.groups(), combined[1]), strict=True):
            key = (period, sector, "General")
            if Decimal(value) != Decimal(rates[key][0]):
                raise ValueError(f"Next release and MoSPI paper differ for {key}")
            rates[key] = (value, url, "final")


def check_handbook(rates, raw):
    body = (raw / "rbi-2014-variation/body.html").read_text(encoding="utf-8")
    table = {}
    sector = None
    for row in re.findall(r"<tr\b[^>]*>(.*?)</tr>", body, re.S | re.I):
        cells = [
            " ".join(unescape(re.sub(r"<[^>]*>", " ", cell)).split())
            for cell in re.findall(r"<td\b[^>]*>(.*?)</td>", row, re.S | re.I)
        ]
        if len(cells) == 2:
            sector = cells[0].split()[2].lower() if cells[0].startswith("New CPI ") else None
        if sector is None or len(cells) != 13 or cells[0] not in ("2012-13", "2013-14"):
            continue
        year = int(cells[0][:4])
        for offset, published in enumerate(cells[1:]):
            period = f"{year + (offset >= 9)}-{(offset + 3) % 12 + 1:02d}"
            if period.startswith("2013") and (period, sector, "General") in rates:
                table[period, sector, "General"] = Decimal(published)
    expected = {
        key: Decimal(rate[0]).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP)
        for key, rate in rates.items() if key[0].startswith("2013") and key[2] == "General"
    }
    if table.keys() != expected.keys():
        raise ValueError("The RBI Handbook does not cover all 2013 all-items rates")
    differences = [key for key in table if table[key] != expected[key]]
    for key in differences:
        original = Decimal(rates[key][0])
        if abs(table[key] - original) > Decimal("0.05"):
            raise ValueError(f"RBI Handbook comparison differs for {key}: {table[key]} vs {original}")
        print(f"RBI rounding at {key}: {table[key]} vs published {original}")
    print(f"RBI Handbook: {len(table) - len(differences)} of {len(table)} rates match after rounding")


def selected_rows(rates, data):
    selections = {}
    for file in ("cpi-inflation-monthly.csv", "cpi-inflation-rural-urban.csv", "cpi-inflation-by-group-2012-base.csv"):
        overlaps = []
        with (data / file).open(newline="") as source:
            for row in csv.DictReader(source):
                group = row.get("group", "General")
                if group not in {"General", "Housing", "Food and Beverages", "Fuel and Light", "Clothing and Footwear"}:
                    continue
                source_group = "Clothing, Bedding and Footwear" if group == "Clothing and Footwear" else group
                sector = "urban" if group == "Housing" else row["sector"]
                key = (row["period"], sector, source_group)
                available = rates.get(key)
                if not available:
                    continue
                if row["value"]:
                    old, existing = Decimal(available[0]), Decimal(row["value"])
                    overlaps.append((key, old, existing))
                elif row["period"].startswith("2013"):
                    selections[key] = available
        print(f"{file}: {len(overlaps)} overlaps, {sum(old != existing for _, old, existing in overlaps)} differ")
        for key, old, existing in overlaps:
            print(f"  {', '.join(key)}: {old} vs {existing}")
    return selections


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--raw", type=Path, default=Path("raw/prices/cpi2010"))
    parser.add_argument("--data", type=Path, default=Path("research/data/prices"))
    args = parser.parse_args()
    rates = read_paper(args.raw)
    apply_final_releases(rates, args.raw)
    check_handbook(rates, args.raw)
    selected = selected_rows(rates, args.data)
    if len(selected) != 69:
        raise ValueError(f"Expected 69 unique missing 2013 rates, found {len(selected)}")
    path = args.data / "cpi-inflation-2013-base-2010.csv"
    temporary = path.with_suffix(".tmp")
    with temporary.open("w", newline="") as output:
        writer = csv.writer(output, lineterminator="\n")
        writer.writerow(["geography", "period", "value", "unit", "sector", "group", "base", "status", "source_kind", "source_url"])
        for (period, sector, group), (value, url, status) in sorted(selected.items()):
            writer.writerow(["india", period, value, "percent", sector, group, "2010=100", status, "archived copy", url])
    temporary.replace(path)
    print(f"Wrote {len(selected)} rows to {path}")


if __name__ == "__main__":
    main()
