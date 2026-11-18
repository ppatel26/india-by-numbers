"""Build the annual temperature anomaly CSV from the IMD Pune table and IMD statement."""

import csv
import re
import subprocess
from decimal import Decimal, ROUND_HALF_UP
from html.parser import HTMLParser
from pathlib import Path


class MeanTemperatureTable(HTMLParser):
    """Read only the Mean Temperature table in the IMD Pune page."""

    def __init__(self):
        super().__init__()
        self.reading = False
        self.cell = None
        self.row = []
        self.rows = []

    def handle_starttag(self, tag, attrs):
        if tag == "div" and dict(attrs).get("id") == "ne":
            self.reading = True
        if self.reading and tag in ("td", "th"):
            self.cell = ""

    def handle_data(self, data):
        if self.cell is not None:
            self.cell += data

    def handle_endtag(self, tag):
        if not self.reading:
            return
        if tag in ("td", "th"):
            self.row.append(self.cell.strip())
            self.cell = None
        if tag == "tr" and self.row:
            self.rows.append(self.row)
            self.row = []
        if tag == "table":
            self.reading = False


def statement_anomalies(path):
    text = subprocess.check_output(
        ["pdftotext", "-f", "2", "-l", "2", "-layout", path, "-"],
        text=True,
    )
    latest = re.search(
        r"annual mean land surface air temperature in 2025 was \+([\d.]+)°C above the"
        r"\s+1991–2020 long-term average",
        text,
    )
    warmest = re.search(r"descending order, are (.*?)\. Notably,", text, re.S)
    values = re.findall(r"(\d{4})\s+\(\+([\d.]+)°C\)", warmest[1])
    assert len(values) == 5
    return dict((int(year), value) for year, value in [*values, ("2025", latest[1])])


def main():
    raw = Path("raw/climate")
    table = MeanTemperatureTable()
    table.feed((raw / "imdseries/download").read_text())
    header, normal_row, *rows = table.rows
    assert header[:2] == ["Year", ""] and header[-1] == "Annual"
    assert normal_row[:2] == ["(1991-2020)", "NORM"]
    assert all(len(row) == len(header) and row[1] == "ACTL" for row in rows)
    assert [int(row[0]) for row in rows] == list(range(1901, 2026))

    normal = Decimal(normal_row[-1])
    annual = {int(row[0]): row[-1] for row in rows}
    derived = {year: Decimal(value) - normal for year, value in annual.items()}
    published = statement_anomalies(raw / "imd2025/download")
    for year, value in published.items():
        assert derived[year].quantize(Decimal(".01"), rounding=ROUND_HALF_UP) == Decimal(value), year
        print(year, "Pune:", derived[year], "statement:", value)
    ranked = sorted(derived, key=derived.get, reverse=True)
    assert ranked[:5] == list(published)[:5] and ranked[7] == 2025
    print("Warmest eight:", ranked[:8])

    output = Path("research/data/climate/annual-temperature-anomaly-1901-2025.csv")
    with output.open("w", newline="") as file:
        writer = csv.writer(file, lineterminator="\n")
        writer.writerow([
            "geography", "period", "value", "unit", "annual_mean_deg_c",
            "normal_deg_c", "base_period", "statement_anomaly_deg_c", "derived", "note",
        ])
        for year, anomaly in derived.items():
            latest = year == 2025
            writer.writerow([
                "india", year, published[year] if latest else anomaly, "degC", annual[year],
                normal, "1991-2020", published.get(year, ""), "no" if latest else "yes",
                "IMD climate statement" if latest else "IMD Pune annual mean minus normal",
            ])


if __name__ == "__main__":
    main()
