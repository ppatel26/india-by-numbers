"""Build the national school trend from UDISE Flash Statistics and UDISE+ reports.

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


def archive_row(text, label, width):
    found = re.findall(rf"^[ \t]*{re.escape(label)}\*?[ \t]+(.+)$", text, re.MULTILINE)
    if len(found) != 1 or len(values := found[0].split()) != width:
        raise ValueError(f"Expected one {label} row with {width} values, found {found}")
    return values


def archive_rows(period, indicator, levels, values, release, table):
    for level, value in zip(levels, values, strict=True):
        # A dash is a suppressed or unavailable value in the report.
        if value == "-":
            continue
        if not re.fullmatch(r"\d+(?:\.\d+)?", value):
            raise ValueError(f"{release}, {table}: unexpected value {value!r}")
        yield ("india", period, value, UNITS[indicator], indicator, level,
               f"{release}, {table}", "published", "archived copy")


def historical_rows(raw):
    def pages(folder):
        # Poppler separates PDF pages with form feeds. Index by the PDF page number.
        return ["", *pdf_text(raw / folder / "report.pdf").split("\f")]

    elementary = pages("flash-2012-13-elementary")
    secondary = pages("flash-2012-13-secondary")
    for source, levels, tables in (
        ("DISE 2012-13 Elementary Flash Statistics", LEVELS[:2], (
            ("enrolment", "p. 27", archive_row(elementary[36], "All States", 16), (2, 5)),
            ("GER", "p. 36", archive_row(elementary[45], "All States", 15), (11, 13)),
        )),
        ("UDISE 2012-13 Secondary Flash Statistics", LEVELS[2:], (
            ("enrolment", "p. 18", archive_row(secondary[22], "All India", 9), (2, 5)),
            ("GER", "p. 30", archive_row(secondary[34], "All India", 12), (2, 5)),
        )),
    ):
        for indicator, page, values, columns in tables:
            yield from archive_rows("2012-13", indicator, levels,
                                    [values[i] for i in columns], source, page)

    for year, ger_page, ger_table, ger_columns, enrol_page, dropout_page, dropout_table, dropout_columns in (
        ("2013-14", 57, "3.17", (2, 5, 11, 14), 41, 55, "3.15", (2, 5, 8, 11)),
        ("2014-15", 70, "3.26", (3, 7, 15, 19), 43, 61, "3.19", (3, 7, 11, 15)),
        ("2015-16", 73, "3.28", (3, 7, 15, 19), 44, 63, "3.20", (3, 7, 14, 18)),
    ):
        report = pages(f"flash-{year}")
        release = f"UDISE {year} Flash Statistics"
        previous = f"{int(year[:4]) - 1}-{year[2:4]}"
        for period, indicator, values, table, columns in (
            (year, "enrolment", archive_row(report[enrol_page], "All India", 12), "3.2", (2, 5, 8, 11)),
            (year, "GER", archive_row(report[ger_page], "All India", ger_columns[-1] + 1), ger_table, ger_columns),
            (previous, "dropout rate", archive_row(report[dropout_page], "All India", dropout_columns[-1] + 1),
             dropout_table, dropout_columns),
        ):
            yield from archive_rows(period, indicator, LEVELS, [values[i] for i in columns],
                                    release, f"Table {table}")

    for year, folder, enrol_page, ger_page, dropout_page in (
        ("2016-17", "udise-2016-17-wayback-2020", 46, 51, 55),
        ("2017-18", "flash-2017-18-provisional", 49, 55, 59),
    ):
        report = pages(folder)
        release = f"UDISE {year} Flash Statistics"
        early, late = re.findall(
            r"^[ \t]*All Areas[ \t]*\n(.*?)^[ \t]*Rural Areas[ \t]*$",
            report[enrol_page], re.MULTILINE | re.DOTALL,
        )
        enrolment = [*archive_row(early, year, 9)[:6], *archive_row(late, year, 9)[:6]]
        yield from archive_rows(year, "enrolment", LEVELS, enrolment[2::3], release, "Table 1.31")
        ger = archive_row(report[ger_page].split("1.41:")[1].split("Scheduled Castes")[0], year, 15)
        yield from archive_rows(year, "GER", LEVELS, [ger[i] for i in (2, 5, 11, 14)], release, "Table 1.41")
        dropout = archive_row(report[dropout_page].split("1.52:")[1].split("Government")[0], year, 15)
        # These editions label the dropout row by the second year of data. Use the
        # cohort year, as in the earlier Flash Statistics and ESAG. See the README.
        cohort = f"{int(year[:4]) - 1}-{year[2:4]}"
        yield from archive_rows(cohort, "dropout rate", LEVELS, [dropout[i] for i in (2, 5, 11, 14)],
                                release, f"Table 1.52 (row {year})")


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
             f"UDISE+ {year} report, Table {table}", "published", "official")
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
                f"UDISE+ {year} booklet, Table 1", "published", "official",
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

    historical = sorted(historical_rows(raw), key=lambda row: (row[1], list(UNITS).index(row[4]), LEVELS.index(row[5])))
    with (out / "education-school-trend-india.csv").open("w", newline="") as file:
        writer = csv.writer(file, lineterminator="\n")
        writer.writerow(["geography", "period", "value", "unit", "indicator", "level", "table", "value_type", "source_kind"])
        writer.writerows(historical)
        writer.writerows(sorted(rows, key=lambda row: row[1]))
    print(f"education-school-trend-india.csv: {len(historical) + len(rows)} rows")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--raw", type=Path, default=Path("raw/education"))
    parser.add_argument("--out", type=Path, default=Path("research/data/education"))
    args = parser.parse_args()
    build(args.raw, args.out)
