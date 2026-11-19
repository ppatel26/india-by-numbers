"""Build the national religion trend from ORGI census tables.

Run from the repository root: python3 -I pipeline/religion-culture/build_religion_trend.py
Requires openpyxl and xlrd. Read the downloaded workbooks as data only.
"""

import argparse
import csv
from decimal import Decimal
from pathlib import Path

import openpyxl
import xlrd


RELIGIONS = (
    "Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain",
    "Other religions and persuasions", "Religion not stated",
)

# Transcribed India totals from the printed tables. The source and page numbers
# identify the rows because the scan's text layer has errors in some digits.
PRINTED = {
    1951: (
        "Census 1961, Paper 1 of 1963, pp. ii-vii",
        (303575474, 35414284, 8392038, 6219134, 180823, 1618406, 1848224),
        357248383,  # Sum the seven published counts for the areas in the religion table.
        "Excludes Jammu and Kashmir, Pondicherry, North East Frontier Agency and "
        "268,602 people in Punjab whose religion breakdown was unavailable. "
        "The last category is Others.",
    ),
    1961: (
        "Census 1971, Religion, Statement I, pp. 2-5",
        (366393102, 46938584, 10723560, 7845098, 3200333, 2027248, 1497111, 110988),
        439072582 - 336558,
        "The India row excludes Sikkim. Religion figures exclude Arunachal Pradesh.",
    ),
    1971: (
        "Census 1971, Religion, Statement I, pp. 2-5",
        (453292086, 61417934, 14223382, 10378797, 3812325, 2604646, 2184556, 36083),
        547949809,
        "The India row excludes Sikkim.",
    ),
    1981: (
        "Census 1981, Paper 3 of 1984, Table HH-15",
        (549779481, 75512439, 16165447, 13078146, 4719796, 3206038, 2766285, 60217),
        665287849,
        "Census could not be held in Assam. Uses the head's religion for normal "
        "and houseless households and individual returns for institutional households.",
    ),
}
MANIPUR_NOTE = (
    "Excludes the Mao-Maram, Paomata and Purul sub-divisions of Senapati district, Manipur."
)


def c09_1991(path):
    with path.open("rb") as file:
        workbook = openpyxl.load_workbook(file, read_only=True, data_only=True)
        row, = workbook.active.iter_rows(min_row=11, max_row=11, values_only=True)
        workbook.close()
    assert row[:5] == ("C09T", "01", "00", "India Excluding (J&K)", "Total"), row[:5]
    total, *counts = row[5::3]
    # Paper 1 of 1995, p. 12, gives the population included from secondary sources.
    return (
        "Census 1991, Table C-9",
        counts,
        total - 16052,
        "Excludes Jammu and Kashmir and 33 villages in Akrani and Akkalkuwa tehsils, "
        "Dhule district, Maharashtra, where the census could not be conducted.",
    )


def c01(path, year):
    sheet = xlrd.open_workbook(path).sheet_by_index(0)
    row = sheet.row_values(7)
    assert row[5:7] == ["INDIA", "Total"], row[:7]
    total, *counts = map(int, row[7::3])
    return f"Census {year}, Table C-01", counts, total, MANIPUR_NOTE if year == 2001 else ""


def build(raw, out):
    censuses = {
        **PRINTED,
        1991: c09_1991(raw / "census-1991-c09/table.xlsx"),
        2001: c01(raw / "census-2001-c01/table.xls", 2001),
        2011: c01(raw / "census-2011-c01/table.xls", 2011),
    }
    rows = []
    for year, (source, counts, total, note) in censuses.items():
        assert sum(counts) == total, (year, sum(counts), total)
        categories = (*RELIGIONS[:6], "Others") if year == 1951 else RELIGIONS
        for religion, count in zip(categories, counts, strict=True):
            rows.append([
                "india", year, count, "persons", religion, total,
                f"{Decimal(count) * 100 / total:.2f}", "derived",
                "derived" if year in (1951, 1961, 1991) else "published",
                "household head" if year == 1981 else "individual", source, note,
            ])

    with (out / "religion-india-1951-2011.csv").open("w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([
            "geography", "period", "value", "unit", "religion", "population_covered",
            "share_pct", "share_type", "population_covered_type", "method", "table", "note",
        ])
        writer.writerows(rows)
    print(f"religion-india-1951-2011.csv: {len(rows)} rows")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--raw", type=Path, default=Path("raw/religion-culture"))
    parser.add_argument("--out", type=Path, default=Path("research/data/religion-culture"))
    args = parser.parse_args()
    build(args.raw, args.out)
