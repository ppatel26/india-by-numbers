"""All-India June to September rainfall, 1901-2026, from the IMD Pune rainfall data page.
Run: python3 -I pipeline/climate/build_rain.py --raw raw/climate --out research/data/climate"""
import argparse, os, re, csv, sys
ap = argparse.ArgumentParser()
ap.add_argument('--raw', default='raw/climate')
ap.add_argument('--out', default='research/data/climate')
_a = ap.parse_args()
raw, outdir = os.path.join(_a.raw, 'imdpune_rainfall_data.html'), _a.out
h = open(raw, errors='ignore').read()
def section(sid, nxt):
    i = h.find(f'id="{sid}"'); j = h.find(f'id="{nxt}"') if nxt else len(h)
    t = re.sub(r'<[^>]+>', ' ', h[i:j]); return re.sub(r'\s+', ' ', t)
t = section('ai', 'nw')
# rows: YEAR JUN JUL AUG SEP JUN-SEP  then YEAR dep...
rows = re.findall(r'(?<![\d.])((?:19|20)\d\d) (-?[\d.]+) (-?[\d.]+) (-?[\d.]+) (-?[\d.]+) (-?[\d.]+)(?= )', t)
mm, dep = {}, {}
for r in rows:
    y = int(r[0]); vals = r[1:]
    if y not in mm: mm[y] = vals
    else: dep[y] = vals
years = sorted(mm)
assert years[0] == 1901 and years[-1] == 2026 and len(years) == 126, (years[0], years[-1], len(years))
assert set(dep) == set(mm)
with open(f'{outdir}/monsoon-rainfall-all-india-1901-2026.csv', 'w', newline='') as f:
    w = csv.writer(f)
    w.writerow(['geography', 'period', 'season', 'rainfall_mm', 'departure_pct_from_lpa', 'lpa_mm', 'lpa_base', 'note'])
    for y in years:
        note = 'real-time data; IMD season report 30 Sep 2026' if y == 2026 else ''
        w.writerow(['india', y, 'jun-sep', mm[y][4], dep[y][4], '868.6', '1971-2020', note])
print(len(years), mm[2026], dep[2026], mm[1901], dep[1901])
# rank of 2026 among years by mm
v = sorted(((float(mm[y][4]), y) for y in years))
print('lowest 15:', v[:15])
print('since 2001 lowest:', sorted(((float(mm[y][4]), y) for y in years if y >= 2001))[:6])
