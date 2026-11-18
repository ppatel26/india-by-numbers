"""Publisher check of 18 Nov 2026: add the 18 Nov 2026 FBIL rate to usd-inr-daily-2026.csv.
Run after build_prices_economy.py and refresh_fetch_rates.py:
  python3 -I pipeline/economy/refresh_append_rates.py --raw raw/economy/refresh-2026-11-18 --out research/data/economy
Checks that the 17 Nov row in the CSV and the RBI home page agree with the archive, then appends the 18 Nov row once.
"""
import argparse
import csv
from decimal import Decimal
from html.parser import HTMLParser
import io
from pathlib import Path
import re
import sys

class TableRows(HTMLParser):
    def __init__(self):
        super().__init__()
        self.rows = []
        self.row = []
        self.cell = None

    def handle_starttag(self, tag, attrs):
        if tag == "tr":
            self.row = []
        if tag == "td":
            self.cell = []

    def handle_data(self, data):
        if self.cell is not None:
            self.cell.append(data)

    def handle_endtag(self, tag):
        if tag == "td" and self.cell is not None:
            self.row.append("".join(self.cell).strip())
            self.cell = None
        if tag == "tr" and len(self.row) == 2 and re.fullmatch(r"1[78]/11/2026", self.row[0]):
            date, rate = self.row
            self.rows.append(("2026-11-" + date[:2], f"{Decimal(rate):.4f}"))

ap = argparse.ArgumentParser()
ap.add_argument("--raw", default="raw/economy/refresh-2026-11-18")
ap.add_argument("--out", default="research/data/economy")
args = ap.parse_args()
raw = Path(args.raw)
parser = TableRows()
parser.feed((raw / "rbi_rates").read_text())
upstream = dict(parser.rows)
assert len(parser.rows) == len(upstream) == 2
home = (raw / "rbi_home").read_text()
match = re.search(r'INR / 1 USD\s*</th>\s*<td>\s*:\s*(\d+\.\d+)\s*</td>', home)
assert match and "1.00pm of November 18, 2026" in home and "Source : FBIL" in home
assert upstream["2026-11-18"] == match[1]

path = Path(args.out) / "usd-inr-daily-2026.csv"
data = path.read_bytes()
rows = list(csv.reader(io.StringIO(data.decode())))
dates = {row[1]: row[2] for row in rows[1:]}
assert len(dates) == len(rows) - 1
assert dates["2026-11-17"] == upstream["2026-11-17"]
if "2026-11-18" in dates:
    assert dates["2026-11-18"] == upstream["2026-11-18"]
else:
    assert rows[-1][1] == "2026-11-17" and data.endswith(b"\r\n")
    row = rows[-1].copy()
    row[1], row[2] = "2026-11-18", upstream["2026-11-18"]
    with path.open("ab") as out:
        out.write((",".join(row) + "\r\n").encode())
    print("Added", row)
print("Verified against RBI archive", sorted(upstream.items()))
