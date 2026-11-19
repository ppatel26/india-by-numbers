"""Build the national school trend from annual UDISE+ reports.

Run at the repository root: python3 -I pipeline/education/build_school_trend.py
Requires Poppler's pdftotext. Read downloaded PDF and DOCX files as data only.
"""

import argparse
import csv
import re
import subprocess
from pathlib import Path
from xml.etree import ElementTree
from zipfile import ZipFile


LEVELS = (
    "primary (1-5)",
    "upper primary (6-8)",
    "secondary (9-10)",
    "higher secondary (11-12)",
)
PRE_PRIMARY = "pre-primary"
TOTAL = "total (pre-primary to higher secondary)"

PARAMS = [
    ("enrolment", "pre-primary", r"Enrolment in Pre[- ]Primary"),
    ("enrolment", "primary (1-5)", r"Enrolment in Primary"),
    ("enrolment", "upper primary (6-8)", r"Enrolment in Upper Primary"),
    ("enrolment", "secondary (9-10)", r"Enrolment in Secondary"),
    ("enrolment", "higher secondary (11-12)", r"Enrolment in Higher Secondary"),
    ("enrolment", "total (pre-primary to higher secondary)", r"Total Number of Enrolments \(Pre-Primary to Higher Secondary\)"),
    ("GER", "primary (1-5)", r"Gross Enrolment Ratio \(GER\) – Primary"),
    ("GER", "upper primary (6-8)", r"Gross Enrolment Ratio \(GER\) – Upper Primary"),
    ("GER", "secondary (9-10)", r"Gross Enrolment Ratio \(GER\) – Secondary"),
    ("GER", "higher secondary (11-12)", r"Gross Enrolment Ratio \(GER\) – Higher Secondary"),
    ("dropout rate", "primary (1-5)", r"Dropout Rates - Primary"),
    ("dropout rate", "upper primary (6-8)", r"Dropout Rates – Upper Primary"),
    ("dropout rate", "secondary (9-10)", r"Dropout Rates - Secondary"),
    ("PTR", "primary (1-5)", r"PTR at Primary level"),
    ("PTR", "secondary (9-10)", r"PTR at Secondary level"),
    ("schools", "all schools", r"Total Number of Schools-?"),
    ("teachers", "all teachers", r"Total Number of teachers"),
]
UNITS = {"enrolment": "students", "GER": "ratio (per cent of age group)", "dropout rate": "per cent",
         "PTR": "pupils per teacher", "schools": "schools", "teachers": "teachers"}

DETAIL_TABLES = {
    "3.1": ("enrolment", (TOTAL, PRE_PRIMARY, *LEVELS), (0, 1, 2, 3, 5, 6), 7),
    "5.1": ("GER", LEVELS, (2, 5, 11, 14), 15),
    "5.13": ("dropout rate", LEVELS[:3], (2, 5, 8), 9),
}
WORD_NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}


def word_rows(path):
    with ZipFile(path) as document:
        root = ElementTree.fromstring(document.read("word/document.xml"))
    for element in root.find("w:body", WORD_NS):
        if element.tag.endswith("}p"):
            yield "".join(t.text or "" for t in element.findall(".//w:t", WORD_NS))
        elif element.tag.endswith("}tbl"):
            for row in element.findall("w:tr", WORD_NS):
                yield "\t".join(
                    "".join(t.text or "" for t in cell.findall(".//w:t", WORD_NS))
                    for cell in row.findall("w:tc", WORD_NS)
                )


def pdf_text(path):
    return subprocess.run(
        ["pdftotext", "-layout", str(path), "-"], check=True, capture_output=True, text=True
    ).stdout


def detailed_rows(folder, year):
    if year == "2018-19":
        lines = word_rows(folder / "booklet.docx")
    else:
        lines = pdf_text(folder / "booklet.pdf").splitlines()
    found = {}
    table = None
    for line in lines:
        heading = re.match(r"\s*Table (\d+\.\d+):", line)
        if heading:
            table = heading[1]
        if table not in DETAIL_TABLES or not re.match(r"\s*India\s+[\d,.]+", line):
            continue
        values = line.split()[1:]
        indicator, levels, columns, width = DETAIL_TABLES[table]
        if table in found or len(values) != width:
            raise ValueError(f"{year}, Table {table}: unexpected India row {line}")
        found[table] = [
            ("india", year, values[column].replace(",", ""), UNITS[indicator], indicator, level,
             f"UDISE+ {year} report, Table {table}", "published")
            for level, column in zip(levels, columns, strict=True)
        ]
    if found.keys() != DETAIL_TABLES.keys():
        raise ValueError(f"{year}: found only Tables {list(found)}")
    return [row for table in DETAIL_TABLES for row in found[table]]


def highlights(folder, year):
    lines = pdf_text(folder / "booklet.pdf").split("\n")
    start = max(i for i, line in enumerate(lines) if line.strip().startswith("Table 1: National Highlights"))
    block = lines[start:start + 200]
    years = ("2020-21", year) if year == "2021-22" else (year,)
    for indicator, level, label in PARAMS:
        pattern = re.compile(rf"^\s*{label}\s+((?:\d+(?:\.\d+)?\s+)*\d+(?:\.\d+)?)\s*$")
        match = next((m for line in block if (m := pattern.match(line))), None)
        if match is None:
            print(f"{year}, Table 1: {indicator}, {level} is unavailable")
            continue
        for period, value in zip(years, match[1].split(), strict=True):
            yield (
                "india", period, value, UNITS[indicator], indicator, level,
                f"UDISE+ {year} booklet, Table 1", "published",
            )


def build(raw, out):
    rows = []
    for year in ("2018-19", "2019-20", "2020-21"):
        rows.extend(detailed_rows(raw / f"udise-plus-{year}", year))
    first_2020 = {(r[4], r[5]): r[2] for r in rows if r[1] == "2020-21"}
    overlap = {}
    for year in ("2021-22", "2022-23", "2023-24", "2024-25", "2025-26"):
        for row in highlights(raw / f"udise-plus-{year}", year):
            key = row[4:6]
            if row[1] == "2020-21" and key in first_2020:
                overlap[key] = row[2]
            else:
                rows.append(row)
    if first_2020 != overlap:
        raise ValueError(f"2020-21 differs from the 2021-22 booklet: {first_2020} vs {overlap}")
    print(f"2020-21: all {len(overlap)} overlap values match the 2021-22 booklet")

    with (out / "education-school-trend-india.csv").open("w", newline="") as file:
        writer = csv.writer(file, lineterminator="\n")
        writer.writerow(["geography", "period", "value", "unit", "indicator", "level", "table", "value_type"])
        writer.writerows(sorted(rows, key=lambda row: row[1]))
    print(f"education-school-trend-india.csv: {len(rows)} rows")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--raw", type=Path, default=Path("raw/education"))
    parser.add_argument("--out", type=Path, default=Path("research/data/education"))
    args = parser.parse_args()
    build(args.raw, args.out)
