"""Join ORGI Table 16 releases and check values in the shared periods.

Run from the repository root: python3 -I pipeline/health/build_sex_ratio_at_birth.py
"""

import csv
from pathlib import Path
import re
import subprocess


RAW = Path("raw/health")
OUTPUT = Path("research/data/health/sex-ratio-at-birth-india.csv")
COMPENDIUM = "SRS Compendium 1971-2013, Table 16"
RESIDENCES = ("total", "rural", "urban")
FIELDS = ("geography", "period", "value", "unit", "residence", "mid_year", "source_doc")


def read_pdf(directory):
    path = RAW / directory / "report.pdf"
    return subprocess.check_output(["pdftotext", "-layout", str(path), "-"], encoding="utf-8")


def india_row(page):
    match = re.search(r"^India\*? +((?:\d{3} +)*\d{3}) *$", page, re.MULTILINE)
    if not match:
        raise ValueError("India row missing from Table 16")
    return match[1].split()


def compendium():
    title = "Sex ratio (female per 1000 male) at birth by residence,"
    pages = [
        page for page in read_pdf("srs-compendium").split("\f")
        if re.search(r"^ *" + re.escape(title) + r" *$", page, re.MULTILINE)
    ]
    assert len(pages) == 3
    for residence, page in zip(RESIDENCES, pages, strict=True):
        assert re.search(r"\b" + residence.capitalize() + r"\b", page)
        years = re.search(r"^states +((?:\d{4} +)*\d{4}) *$", page, re.MULTILINE)[1].split()
        assert years == [str(year) for year in range(1999, 2013)]
        for middle, value in zip(map(int, years), india_row(page), strict=True):
            yield (middle, residence), value


def annual_report(year):
    title = r"Table 16: Sex ratio at birth \(female per 1000 male\) by residence,"
    pages = [page for page in read_pdf(f"srs-{year}").split("\f") if re.search(title, page, re.IGNORECASE)]
    assert len(pages) == 1
    page = pages[0]
    periods = re.search(r"^bigger States/UTs +([^\n]+)", page, re.IGNORECASE | re.MULTILINE)[1].split()
    keys = [(middle, residence) for residence in RESIDENCES for middle in range(year - 5, year)]
    assert periods == [period(middle) for middle, _ in keys]
    return dict(zip(keys, india_row(page), strict=True))


def period(middle):
    return f"{middle - 1}-{(middle + 1) % 100:02d}"


def main():
    sources = [
        (COMPENDIUM, dict(compendium())),
        *((f"SRS Statistical Report {year}, Table 16", annual_report(year)) for year in (2017, 2019, 2020, 2024)),
    ]
    joined = {}
    for source, values in sources:
        overlaps = set(joined) & set(values)
        for key in sorted(overlaps):
            previous, previous_source = joined[key]
            if values[key] != previous:
                raise ValueError(f"{key}: {source} prints {values[key]}, {previous_source} prints {previous}")
        print(f"{source}: {len(overlaps)} matching observations in shared periods")
        for key, value in values.items():
            joined[key] = value, source
    assert set(joined) == {(year, residence) for year in range(1999, 2024) for residence in RESIDENCES}
    assert joined[1999, "total"][0] == "898" and joined[2023, "total"][0] == "918"

    with OUTPUT.open("w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(FIELDS)
        for (middle, residence), (value, source) in sorted(joined.items()):
            writer.writerow(("india", period(middle), value, "females per 1,000 males at birth", residence, middle, source))


if __name__ == "__main__":
    main()
