"""Build research/data/prices/cfpi-inflation-2026.csv from the MoSPI CPI press releases.

Values are transcribed from each release's key statistics table (rural, urban, combined), and
checked here against the text extracted with `pdftotext -layout` (or the PIB page for May).
Each month's final value comes from the next month's release; October 2026 is provisional.
Raw layout: one folder per release, <raw>/cfpi-<mon>-XXXXXXXX/ with `body`, made by
pipeline/common/fetch_batch.py, and <raw>/cfpi-<mon>-XXXXXXXX.txt made by pipeline/prices/extract_text.sh.
Run: python3 -I pipeline/prices/cfpi_2026.py --raw raw/prices/cfpi --out research/data/prices
"""
import argparse
import csv
import glob
import html
import os
import re
import sys

ap = argparse.ArgumentParser()
ap.add_argument('--raw', default='raw/prices/cfpi')
ap.add_argument('--out', default='research/data/prices')
args = ap.parse_args()
raw, out = args.raw, os.path.join(args.out, 'cfpi-inflation-2026.csv')

# month: (release key holding the value, rural, urban, combined, status)
VALUES = {
    '2026-01': ('feb', '1.96', '2.44', '2.13', 'final'),
    '2026-02': ('mar', '3.46', '3.48', '3.47', 'final'),
    '2026-03': ('apr', '3.95', '3.71', '3.87', 'final'),
    '2026-04': ('may', '4.26', '4.10', '4.20', 'final'),
    '2026-05': ('jun', '4.85', '4.66', '4.78', 'final'),
    '2026-06': ('jul', '5.45', '5.09', '5.32', 'final'),
    '2026-07': ('aug', '5.79', '5.05', '5.52', 'final'),
    '2026-08': ('sep', '6.17', '5.64', '5.97', 'final'),
    '2026-09': ('oct', '8.06', '7.18', '7.74', 'final'),
    '2026-10': ('oct', '9.09', '8.68', '8.94', 'provisional'),
}


def text(key: str) -> str:
    if key == 'may':
        t = open(glob.glob(f'{raw}/cfpi-may-*/body')[0], encoding='utf-8', errors='replace').read()
        t = re.sub(r'<script.*?</script>|<style.*?</style>', '', t, flags=re.S)
        return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', t)))
    return re.sub(r'\s+', ' ', open(glob.glob(f'{raw}/cfpi-{key}-*.txt')[0]).read())


rows = []
for period, (key, r, u, c, status) in VALUES.items():
    t = text(key)
    # The three values appear in this order, near "CFPI", in the release.
    if not re.search(rf'{re.escape(r)}\s+{re.escape(u)}\s+{re.escape(c)}', t):
        sys.exit(f'{period}: {r} {u} {c} not found in the {key} release')
    for sector, v in (('rural', r), ('urban', u), ('combined', c)):
        rows.append({'geography': 'india', 'period': period, 'value': v, 'unit': 'percent', 'sector': sector, 'base': '2024=100', 'status': status})

with open(out, 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=['geography', 'period', 'value', 'unit', 'sector', 'base', 'status'], lineterminator='\n')
    w.writeheader()
    w.writerows(rows)
print(len(rows), 'rows')
