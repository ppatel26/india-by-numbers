"""Transport CSVs from MoRTH "Road Accidents in India" (2024 and 2023 editions) and the MoSPI
National Household Travel Survey 2025-26 (fact sheet and its Appendix A and B workbooks).

First run pipeline/transport/fetch.sh and pipeline/transport/extract_text.sh.
Run: python3 -I pipeline/transport/build_transport.py [--raw raw/transport] [--work work/transport]
     [--out research/data/transport] [--geo research/data/geography.csv]

The MoRTH tables are read from the PDF word boxes (pdftotext -bbox). Each table has a row of column
numbers (1, 2, 3, ...). A value goes to the column whose number sits nearest to it, so a blank cell
stays blank. Many annexures are printed sideways; those pages are turned before they are read.
The script stops if a checked value differs from the published table, or if two tables that
should agree do not.
"""
import argparse, csv, html, os, re, statistics, sys

import openpyxl

ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
ap.add_argument('--raw', default='raw/transport')
ap.add_argument('--work', default='work/transport')
ap.add_argument('--out', default='research/data/transport')
ap.add_argument('--geo', default='research/data/geography.csv')
A = ap.parse_args()
os.makedirs(A.out, exist_ok=True)

# ---------------------------------------------------------------- geography

GEO = {r['slug'] for r in csv.DictReader(open(A.geo, encoding='utf-8'))}
NAMES = {}
for r in csv.DictReader(open(A.geo, encoding='utf-8')):
    NAMES[re.sub(r'[^a-z]', '', r['name'].lower().replace('&', 'and'))] = r['slug']
ALIAS = {
    'total': 'india', 'nationalaverage': 'india', 'allindia': 'india',
    'andamanandnicobarislands': 'andaman-nicobar', 'aandnislands': 'andaman-nicobar', 'andamanandnislands': 'andaman-nicobar',
    'dandnhavelianddamananddiu': 'dnh-dd', 'dnhavelianddamananddiu': 'dnh-dd',
    'keralam': 'kerala',  # NHTS workbooks use the name Keralam
    'orissa': 'odisha',  # one MoRTH annexure uses the old name
}

def slug(name):
    k = re.sub(r'[^a-z]', '', name.lower().replace('&', 'and'))
    s = ALIAS.get(k) or NAMES.get(k)
    if not s:
        sys.exit(f'unknown State/UT name: {name!r}')
    return s

def fail(msg):
    sys.exit('CHECK FAILED: ' + msg)

# ---------------------------------------------------------------- PDF word tables

NUM = re.compile(r'^-?[\d,]*\d(\.\d+)?$')

def load_pages(path):
    s = open(path, encoding='utf-8').read()
    return [[(float(a), float(b), float(c), float(d), html.unescape(t)) for a, b, c, d, t in
             re.findall(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)</word>', p)]
            for p in re.split(r'<page ', s)[1:]]

def page_text(ws):
    return ' '.join(w[4] for w in ws)

def centred(ws, rotated):
    """Word centres. A sideways table is turned so that it reads left to right."""
    out = []
    for a, b, c, d, t in ws:
        cx, cy = (a + c) / 2, (b + d) / 2
        out.append((-cy, cx, t) if rotated else (cx, cy, t))
    return out

def label_row(ws, labels, tol=2.5):
    """y of the column-number row and the x centre of each column number in `labels`."""
    ints = [w for w in ws if re.fullmatch(r'\d+', w[2])]
    for w0 in sorted([w for w in ints if w[2] == str(labels[0])], key=lambda w: w[1]):
        row = sorted([w for w in ints if abs(w[1] - w0[1]) <= tol], key=lambda w: w[0])
        seq = []
        for w in row:
            if len(seq) < len(labels) and int(w[2]) == labels[len(seq)] and (not seq or w[0] > seq[-1][0]):
                seq.append(w)
        if len(seq) == len(labels):
            return w0[1], [w[0] for w in seq]
    raise ValueError(f'no column-number row {labels}')

def read_table(ws, labels, rotated, first_value_col=3):
    """Rows of a State/UT table, keyed by serial number, 'Total' or 'National'.
    Each row is {'name': text, column number: printed text}. Rows can also be anchored by year (Annexure 1)."""
    ws = centred(ws, rotated)
    ly, lx = label_row(ws, labels)
    col_of = dict(zip(labels, lx))
    gaps = [b - a for a, b in zip(lx, lx[1:])]
    anchors = []
    for w in ws:
        if w[1] <= ly + 2:
            continue
        if re.fullmatch(r'\d+', w[2]) and abs(w[0] - lx[0]) < gaps[0] / 2 and (int(w[2]) <= 40 or 1900 < int(w[2]) < 2100):  # not a page number
            anchors.append((w[1], int(w[2])))
        elif w[2] in ('Total', 'National') and lx[0] - gaps[0] / 2 < w[0] < lx[min(2, len(lx) - 1)]:
            anchors.append((w[1], w[2]))
    anchors.sort()
    ys = [a[0] for a in anchors]
    d = [b - a for a, b in zip(ys, ys[1:]) if b - a > 1]
    row_tol = min(d) / 2 if d else 5
    value_x0 = col_of[first_value_col] - gaps[labels.index(first_value_col) - 1] / 2
    # cells can sit off the centre of their column number by a constant amount: measure it
    cells = [w for w in ws if w[0] > value_x0 and (NUM.match(w[2]) or w[2] in ('-', 'NA'))
             and any(abs(w[1] - y) < row_tol for y in ys)]
    near = [w[0] - min(lx, key=lambda x: abs(x - w[0])) for w in cells]
    shift = statistics.median(near) if near else 0
    rows = {}
    for n_, (y, key) in enumerate(anchors):
        if key in rows:
            raise ValueError(f'duplicate row {key}')
        lo = (anchors[n_ - 1][0] + y) / 2 if n_ else y - 2 * row_tol
        hi = (anchors[n_ + 1][0] + y) / 2 if n_ + 1 < len(anchors) else y + 2 * row_tol
        name = [w for w in ws if lo < w[1] < hi and lx[0] + 2 < w[0] < lx[-1] + gaps[-1] / 2 and not NUM.match(w[2]) and w[2] not in ('-', '*', 'NA')]
        r = {'_y': y, 'name': ' '.join(w[2] for w in sorted(name, key=lambda w: (round((w[1] - y) / 4), w[0])))}
        for w in cells:
            if abs(w[1] - y) >= row_tol:
                continue
            x = w[0] - shift
            k = min(range(len(lx)), key=lambda i: abs(lx[i] - x))
            if abs(lx[k] - x) > gaps[min(k, len(gaps) - 1)] / 2:
                continue
            c = labels[k]
            if c in r:
                raise ValueError(f'two values in one cell: row {key}, column {c}: {r[c]!r}, {w[2]!r}')
            r[c] = w[2]
        rows[key] = r
    return rows

def find_page(pages, *phrases, start=0):
    hits = [i for i, ws in enumerate(pages) if i >= start and all(p in page_text(ws) for p in phrases)]
    if not hits:
        fail(f'no page with {phrases}')
    return hits[0]

def clean(v):
    """Publisher digits without the thousands separators. '-' and blank become ''."""
    if v is None or v in ('-', '', 'NA'):
        return ''
    return v.replace(',', '')

def state_rows(rows, n=36):
    """(slug, row) for the 36 States/UTs and India, in printed order. Checks the serial numbers."""
    got = [k for k in rows if isinstance(k, int)]
    if sorted(got) != list(range(1, n + 1)):
        fail(f'serial numbers {sorted(got)}')
    out = [(slug(rows[k]['name']), rows[k]) for k in range(1, n + 1)]
    tot = rows.get('Total') or rows.get('National')
    if tot:
        out.append(('india', tot))
    if len({s for s, _ in out}) != len(out):
        fail('a State/UT appears twice')
    return out

def write(name, header, rows):
    path = os.path.join(A.out, name)
    with open(path, 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f, lineterminator='\n')
        w.writerow(header)
        for r in rows:
            w.writerow([r.get(h, '') for h in header])
    print(f'{name}: {len(rows)} rows')
    return rows

def check(rows, name, want, **where):
    hit = [r for r in rows if all(str(r.get(k)) == str(v) for k, v in where.items())]
    if len(hit) != 1:
        fail(f'{name}: {len(hit)} rows for {where}')
    if hit[0]['value'] != str(want):
        fail(f'{name}: {where} is {hit[0]["value"]}, published {want}')

# ================================================================ MoRTH

rai24 = load_pages(os.path.join(A.work, 'morth/rai-2024.bbox.html'))
rai23 = load_pages(os.path.join(A.work, 'morth/rai-2023.bbox.html'))
txt24 = open(os.path.join(A.work, 'morth/rai-2024.txt'), encoding='utf-8').read()
RAI = 'Road Accidents in India 2024'

def annexure(pages, n, title, labels, rotated, start=150):
    i = find_page(pages, f'Annexure {n}', title, start=start)
    return read_table(pages[i], labels, rotated), i + 1

# --- road-accidents-by-state.csv: Annexures 2 to 6, years 2023 and 2024

SPEC = [  # annexure, title words, indicator, unit, {period: column}
    (2, 'Number of Road Accidents in India: 2021 to 2024', [
        ('accidents', 'road accidents', {'2023': 5, '2024': 6}),
        ('accidents-per-lakh-population', 'road accidents per lakh population', {'2023': 14, '2024': 15})]),
    (3, 'Number of Persons Killed in Road Accidents in India: 2021 to 2024', [
        ('deaths', 'persons killed', {'2023': 5, '2024': 6}),
        ('deaths-per-lakh-population', 'persons killed per lakh population', {'2023': 14, '2024': 15})]),
    (4, 'Number of Persons Injured in Road Accidents in India: 2021 to 2024', [
        ('injuries', 'persons injured', {'2023': 5, '2024': 6}),
        ('injuries-per-lakh-population', 'persons injured per lakh population', {'2023': 14, '2024': 15})]),
    (5, 'Number of Fatal Road Accidents in States/UTs: 2021 to 2024', [
        ('fatal-accidents', 'fatal road accidents', {'2023': 5, '2024': 6})]),
    (6, 'Severity* of Road Accidents in India (State/UT-wise): 2021 to 2024', [
        ('severity', 'persons killed per 100 road accidents', {'2023': 5, '2024': 6})]),
]
by_state, annex24 = [], {}
for n, title, inds in SPEC:
    ncols = 17 if n <= 4 else 7
    rows, pg = annexure(rai24, n, title.split(':')[0].split(' (')[0], list(range(1, ncols + 1)), n <= 4)
    annex24[n] = rows
    for g, r in state_rows(rows):
        for ind, unit, cols in inds:
            for period, c in cols.items():
                v = clean(r.get(c))
                by_state.append({'geography': g, 'period': period, 'indicator': ind, 'value': v, 'unit': unit,
                                 'table': f'{RAI}, Annexure {n}' + (' (National Average row)' if g == 'india' and n == 6 else ''),
                                 'note': '' if v else ('"NA" in the table' if r.get(c) == 'NA' else ('"-" in the table' if r.get(c) == '-' else 'blank in the table'))})
order = {g: i for i, g in enumerate(['india'] + [s for s, _ in state_rows(annex24[2])][:-1])}
by_state.sort(key=lambda r: (order[r['geography']], r['indicator'], r['period']))

# internal checks: States add up to India; Annexure 2 and 3 totals equal Annexure 1
for n, c in [(2, 6), (3, 6), (4, 6), (5, 6), (2, 5), (3, 5)]:
    rows = annex24[n]
    s = sum(int(clean(rows[k][c])) for k in range(1, 37))
    if s != int(clean(rows['Total'][c])):
        fail(f'Annexure {n} column {c}: States add to {s}, Total row {rows["Total"][c]}')

# 2023 values: RAI 2024 against the RAI 2023 edition
revisions = []
for n, title, cnt_col, rate_title in [(2, 'Total Number of Road Accidents in India: 2020 to 2023', 'accidents', 'accidents-per-lakh-population'),
                                      (3, 'Total Number of Persons Killed in Road Accidents in India: 2020 to 2023', 'deaths', 'deaths-per-lakh-population')]:
    i = find_page(rai23, f'Annexure {n}', title, start=130)
    first = read_table(rai23[i], list(range(1, 12)), False)
    second = read_table(rai23[i + 1], [1, 2, 12, 13, 14, 15, 16, 17], False, first_value_col=12)
    if 'Concld' not in page_text(rai23[i + 1]):
        fail(f'RAI 2023 Annexure {n}: second page not found')
    old = {}
    for g, r in state_rows(first):
        old[(g, cnt_col)] = clean(r.get(6))
    for g, r in state_rows(second):
        old[(g, rate_title)] = clean(r.get(15))
    for r in by_state:
        if r['period'] == '2023' and (r['geography'], r['indicator']) in old:
            o = old[(r['geography'], r['indicator'])]
            if o != r['value']:
                revisions.append((r['geography'], r['indicator'], o, r['value']))
print('2023 values revised between RAI 2023 and RAI 2024:', len(revisions))
for x in revisions:
    print('  ', x)

write('road-accidents-by-state.csv', ['geography', 'period', 'indicator', 'value', 'unit', 'table', 'note'], by_state)
check(by_state, 'road-accidents-by-state', 177175, geography='india', period='2024', indicator='deaths')
check(by_state, 'road-accidents-by-state', 67526, geography='tamil-nadu', period='2024', indicator='accidents')
check(by_state, 'road-accidents-by-state', '22.8', geography='chhattisgarh', period='2024', indicator='deaths-per-lakh-population')

# --- road-accidents-india-1970-2024.csv: Annexure 1

i = find_page(rai24, 'Annexure 1', 'Road Accidents, Persons Killed and Injured: 1970-2024', start=150)
ws = rai24[i]
# road length for 2021 and 2022 is printed with "(P)" stuck to the number
ws = [(a, b, c, d, t[:-3] + '' if t.endswith('(P)') else t) for a, b, c, d, t in ws]
provisional_words = [w for w in rai24[i] if w[4].endswith('(P)')]
a1 = read_table(ws, list(range(1, 17)), True, first_value_col=2)
COLS1 = {2: ('accidents', 'road accidents'), 3: ('deaths', 'persons killed'), 4: ('injuries', 'persons injured'),
         5: ('population', 'thousand persons'), 6: ('registered-motor-vehicles', 'thousand vehicles'), 7: ('road-length', 'km'),
         8: ('accidents-per-lakh-population', 'road accidents per lakh population'),
         9: ('accidents-per-10000-vehicles', 'road accidents per 10,000 vehicles'),
         10: ('accidents-per-10000-km-of-roads', 'road accidents per 10,000 km of roads'),
         11: ('deaths-per-lakh-population', 'persons killed per lakh population'),
         12: ('deaths-per-10000-vehicles', 'persons killed per 10,000 vehicles'),
         13: ('deaths-per-10000-km-of-roads', 'persons killed per 10,000 km of roads'),
         14: ('injuries-per-lakh-population', 'persons injured per lakh population'),
         15: ('injuries-per-10000-vehicles', 'persons injured per 10,000 vehicles'),
         16: ('injuries-per-10000-km-of-roads', 'persons injured per 10,000 km of roads')}
years = sorted(k for k in a1 if isinstance(k, int))
want_years = [1970, 1980, 1990] + list(range(1995, 2025))
if years != want_years:
    fail(f'Annexure 1 years {years}')
NOTES1 = {(1970, 7): 'road length for 1971 (footnote #)', (1980, 7): 'road length for 1981 (footnote ##)'}
if '9,14,979#' not in txt24 or '14,85,421' not in txt24:
    fail('Annexure 1 footnote markers not found')
if len(provisional_words) != 2:
    fail(f'Annexure 1: expected two provisional road lengths, found {len(provisional_words)}')
series = []
for y in years:
    r = a1[y]
    for c, (ind, unit) in COLS1.items():
        v = clean(r.get(c))
        note = NOTES1.get((y, c), '')
        status = ''
        if c == 7 and y in (2021, 2022):
            status = 'provisional'
        if not v:
            note = 'not available (footnote *)' if c == 7 and y >= 2023 else 'blank in the table'
        series.append({'geography': 'india', 'period': str(y), 'indicator': ind, 'value': v, 'unit': unit, 'status': status,
                       'table': f'{RAI}, Annexure 1', 'note': note})
for y in (2021, 2022):
    if not a1[y].get(7):
        fail(f'Annexure 1: road length {y} missing')
# Annexure 1 totals equal the Total rows of Annexures 2 to 4 for 2021 to 2024
for n, c1 in [(2, 2), (3, 3), (4, 4)]:
    for col, y in zip((3, 4, 5, 6), (2021, 2022, 2023, 2024)):
        if clean(a1[y][c1]) != clean(annex24[n]['Total'][col]):
            fail(f'Annexure 1 {y} column {c1} differs from Annexure {n}')
write('road-accidents-india-1970-2024.csv', ['geography', 'period', 'indicator', 'value', 'unit', 'status', 'table', 'note'], series)
check(series, 'road-accidents-india', 114100, period='1970', indicator='accidents')
check(series, 'road-accidents-india', 138383, period='2020', indicator='deaths')
check(series, 'road-accidents-india', '12.6', period='2024', indicator='deaths-per-lakh-population')

# --- road-deaths-by-road-user.csv: Table 4.4 (India, 2023 and 2024) and Annexure 29 (States/UTs, 2024)

USERS = [('Pedestrians', 'pedestrians'), ('Bicycles', 'bicycles'), ('Two-wheelers', 'two-wheelers'), ('Auto rickshaws', 'auto-rickshaws'),
         ('Cars, Taxis, Vans & LMVs', 'cars-taxis-vans-lmvs'), ('Trucks / Lorries', 'trucks-lorries'), ('Buses', 'buses'),
         ('Other non-motor vehicles (including e-rickshaw)', 'other-non-motorised-vehicles'), ('Others', 'others')]
p = find_page(rai24, 'Table 4.4: Comparison of persons killed in road accidents in terms of road-user categories', start=50)
t44 = txt24.split('\f')[p]
t44 = t44[t44.index('Table 4.4: Comparison'):]
lines = t44.split('\n')
road_user = []
def nums(line):
    return re.findall(r'-?[\d,]+\.?\d*', line)
for label, key in USERS:
    li = next(j for j, l in enumerate(lines) if l.strip().startswith(label))
    j = li
    while len(nums(lines[j])) < 3:  # 'Others' wraps: its numbers are on the next line
        j += 1
    k23, k24, _chg = nums(lines[j])[-3:]
    share = next(l for l in lines[j + 1:] if '% share in total' in l)
    s23, s24 = nums(share)[-2:]
    for period, v, s in (('2023', k23, s23), ('2024', k24, s24)):
        road_user.append({'geography': 'india', 'period': period, 'road_user': key, 'sex': 'person', 'indicator': 'deaths',
                          'value': clean(v), 'unit': 'persons killed', 'table': f'{RAI}, Table 4.4'})
        road_user.append({'geography': 'india', 'period': period, 'road_user': key, 'sex': 'person', 'indicator': 'share-of-deaths',
                          'value': clean(s), 'unit': 'per cent of persons killed', 'table': f'{RAI}, Table 4.4'})
tot = nums(next(l for l in lines if l.strip().startswith('Total')))
for period, v in (('2023', tot[0]), ('2024', tot[1])):
    road_user.append({'geography': 'india', 'period': period, 'road_user': 'all', 'sex': 'person', 'indicator': 'deaths',
                      'value': clean(v), 'unit': 'persons killed', 'table': f'{RAI}, Table 4.4'})
i = find_page(rai24, 'Male and Female Killed in Road Accidents in terms of Road User categories in 2024', 'Annexure 29', start=150)
a29a = read_table(rai24[i], list(range(1, 19)), True)
a29b = read_table(rai24[i + 1], [1, 2] + list(range(19, 31)), True, first_value_col=19)
if 'Concld' not in page_text(rai24[i + 1]):
    fail('Annexure 29: second page not found')
COLS29 = {'pedestrians': (3, 4, 5), 'bicycles': (6, 7, 8), 'two-wheelers': (9, 10, 11), 'auto-rickshaws': (13, 14, 15),
          'cars-taxis-vans-lmvs': (16, 17, 18), 'trucks-lorries': (19, 20, 21), 'buses': (22, 23, 24),
          'other-non-motorised-vehicles': (25, 26, 27), 'others': (28, 29, 30)}
first, second = dict(state_rows(a29a)), dict(state_rows(a29b))
deaths24 = {g: clean(r[6]) for g, r in state_rows(annex24[3])}
for g in first:
    total = 0
    for key, cols in COLS29.items():
        src = first[g] if cols[0] < 19 else second[g]
        m, f, t = (clean(src.get(c)) for c in cols)
        if int(m) + int(f) != int(t):
            fail(f'Annexure 29 {g} {key}: male + female != total')
        total += int(t)
        if g == 'india':
            t44v = next(r['value'] for r in road_user if r['period'] == '2024' and r['road_user'] == key and r['indicator'] == 'deaths')
            if float(t44v) != float(t):
                fail(f'Table 4.4 {key} 2024 {t44v} != Annexure 29 {t}')
        for sex, v in (('male', m), ('female', f), ('person', t)):
            road_user.append({'geography': g, 'period': '2024', 'road_user': key, 'sex': sex, 'indicator': 'deaths',
                              'value': v, 'unit': 'persons killed', 'table': f'{RAI}, Annexure 29'})
    if str(total) != deaths24[g]:
        fail(f'Annexure 29 {g}: road users add to {total}, Annexure 3 gives {deaths24[g]}')
road_user = [r for r in road_user if not (r['geography'] == 'india' and r['table'].endswith('Annexure 29') and r['sex'] == 'person')]
write('road-deaths-by-road-user.csv', ['geography', 'period', 'road_user', 'sex', 'indicator', 'value', 'unit', 'table'], road_user)
check(road_user, 'road-deaths-by-road-user', 81780, geography='india', period='2024', road_user='two-wheelers', sex='person', indicator='deaths')
check(road_user, 'road-deaths-by-road-user', 35221, geography='india', period='2023', road_user='pedestrians', sex='person', indicator='deaths')
check(road_user, 'road-deaths-by-road-user', 1739, geography='andhra-pradesh', period='2024', road_user='pedestrians', sex='person', indicator='deaths')

# --- road-deaths-helmet-seatbelt-by-state.csv: Annexures 37 and 38, Table 3.3

safety = []
COLS37 = {('driver', 'deaths'): 3, ('driver', 'grievous-injuries'): 5, ('driver', 'minor-injuries'): 6, ('driver', 'injuries'): 7,
          ('passenger', 'deaths'): 8, ('passenger', 'grievous-injuries'): 10, ('passenger', 'minor-injuries'): 11, ('passenger', 'injuries'): 12}
UNIT37 = {'deaths': 'persons killed', 'grievous-injuries': 'persons grievously injured', 'minor-injuries': 'persons with minor injuries',
          'injuries': 'persons injured'}
for n, title, device in [(37, 'Non-Use of Safety Device (Non Wearing of Helmet)', 'helmet'),
                         (38, 'Non-Use of Safety Device (Non-Wearing of Seat Belt)', 'seat-belt')]:
    rows, _ = annexure(rai24, n, title, list(range(1, 13)), False)
    for g, r in state_rows(rows):
        for (victim, ind), c in COLS37.items():
            v = clean(r.get(c))
            safety.append({'geography': g, 'period': '2024', 'device': device, 'victim': victim, 'indicator': ind, 'value': v,
                           'unit': UNIT37[ind], 'table': f'{RAI}, Annexure {n}', 'note': '' if v else 'blank in the table'})
    for c in COLS37.values():
        s = sum(int(clean(rows[k][c])) for k in range(1, 37))
        if s != int(clean(rows['Total'][c])):
            fail(f'Annexure {n} column {c}: States add to {s}, Total {rows["Total"][c]}')
# Table 3.3 gives the India totals
p = find_page(rai24, 'Table 3.3: Persons killed and injured due to non-use of safety devices', start=50)
t33 = txt24.split('\f')[p]
t33 = t33[t33.index('Table 3.3: Persons killed'):]
drv = nums(next(l for l in t33.split('\n') if l.strip().startswith('Driver')))
pas = nums(next(l for l in t33.split('\n') if l.strip().startswith('Passenger')))
for victim, vals in (('driver', drv), ('passenger', pas)):
    for (device, ind), v in zip([('helmet', 'deaths'), ('helmet', 'injuries'), ('seat-belt', 'deaths'), ('seat-belt', 'injuries')], vals):
        got = next(r['value'] for r in safety if r['geography'] == 'india' and r['device'] == device and r['victim'] == victim and r['indicator'] == ind)
        if got != clean(v):
            fail(f'Table 3.3 {device} {victim} {ind} {v} != Annexure total {got}')
write('road-deaths-helmet-seatbelt-by-state.csv', ['geography', 'period', 'device', 'victim', 'indicator', 'value', 'unit', 'table', 'note'], safety)
check(safety, 'helmet-seatbelt', 39470, geography='india', device='helmet', victim='driver', indicator='deaths')
check(safety, 'helmet-seatbelt', 6977, geography='india', device='seat-belt', victim='passenger', indicator='deaths')
check(safety, 'helmet-seatbelt', 2353, geography='andhra-pradesh', device='helmet', victim='driver', indicator='deaths')

# ================================================================ NHTS

PERIOD = '2025-26'
NHTS = 'NHTS 2025-26 fact sheet'
MODES = ['walk', 'bicycle', 'cycle-rickshaw', 'two-wheeler', 'car', 'auto-rickshaw', 'bus', 'train-metro-monorail-tram', 'rail', 'water', 'air', 'others']
MODE_HEAD = ['Walk', 'Bicycle', 'Cycle rickshaw/pull rickshaw', 'Two wheeler', 'car', 'Auto-rickshaw', 'Bus', 'Monorail/tram', 'Rail', 'Water', 'Air', 'Others']

def cell_text(c):
    """The value as the workbook shows it: the cell's number format sets the decimals."""
    v = c.value
    if v is None or v == '-':
        return ''
    if isinstance(v, str):
        return v.strip()
    m = re.fullmatch(r'0\.(0+)', c.number_format)
    if m:
        return f'{v:.{len(m.group(1))}f}'
    if c.number_format in ('0', 'General') and float(v).is_integer():
        return str(int(v))
    fail(f'unexpected number format {c.number_format!r} for {v}')

def nhts_blocks(path, head):
    """Nine blocks (sector x sex) of 37 rows: {(sector, sex): {slug: [cells]}}."""
    ws = openpyxl.load_workbook(path).worksheets[0]
    rows = list(ws.iter_rows())
    out = {}
    i = 0
    while i < len(rows):
        a = rows[i][0].value
        if isinstance(a, str) and a.strip() in ('Rural', 'Urban', 'Rural+Urban') and rows[i + 1][0].value in ('Male', 'Female', 'Person'):
            sector = {'Rural': 'rural', 'Urban': 'urban', 'Rural+Urban': 'rural+urban'}[a.strip()]
            sex = rows[i + 1][0].value.lower()
            hdr = [str(c.value).strip() for c in rows[i + 3] if c.value is not None]
            if hdr != head:
                fail(f'{os.path.basename(path)}: header {hdr}')
            if rows[i + 4][0].value != '(1)':
                fail(f'{os.path.basename(path)}: column numbers row missing')
            block = {}
            for r in rows[i + 5:i + 5 + 37]:
                block[slug(str(r[0].value))] = r[1:1 + len(head)]
            if len(block) != 37 or 'india' not in block:
                fail(f'{os.path.basename(path)} {sector} {sex}: {len(block)} rows')
            out[(sector, sex)] = block
            i += 42
        else:
            i += 1
    if len(out) != 9:
        fail(f'{os.path.basename(path)}: {len(out)} blocks')
    return out

geo_order = ['india'] + [s for s, _ in state_rows(annex24[2])][:-1]
gi = {g: i for i, g in enumerate(geo_order)}

modes = []
for purpose, t, rse_t, who in [('education', 3, 2, 'students of age 6 years and above travelling 1 km or more to an educational institution'),
                               ('work', 5, 4, 'workers of age 15 years and above travelling 1 km or more to a workplace')]:
    val = nhts_blocks(os.path.join(A.raw, f'nhts/appendix-a/table-{t}.xlsx'), MODE_HEAD)
    rse = nhts_blocks(os.path.join(A.raw, f'nhts/appendix-b/rse-table-{rse_t}.xlsx'), MODE_HEAD)
    for (sector, sex), block in val.items():
        for g, cells in block.items():
            for m, c, rc in zip(MODES, cells, rse[(sector, sex)][g]):
                modes.append({'geography': g, 'period': PERIOD, 'purpose': purpose, 'sector': sector, 'sex': sex, 'mode': m,
                              'value': cell_text(c), 'rse': cell_text(rc), 'unit': f'per cent of {who}',
                              'table': f'{NHTS}, Appendix A Table {t}; RSE from Appendix B Table {rse_t}'})
SO = {'rural': 0, 'urban': 1, 'rural+urban': 2}; XO = {'male': 0, 'female': 1, 'person': 2}
modes.sort(key=lambda r: (r['purpose'], gi[r['geography']], SO[r['sector']], XO[r['sex']], MODES.index(r['mode'])))

AGES_EDU = ['6-14 years', '15-29 years', '30 years and above', 'all (6 years and above)']
AGES_WORK = ['15-29 years', '15 – 59 years', '60 years and above', 'all (15 years and above)']
AGE_SLUG = {'6-14 years': '6-14', '15-29 years': '15-29', '30 years and above': '30+', 'all (6 years and above)': '6+',
            '15 – 59 years': '15-59', '60 years and above': '60+', 'all (15 years and above)': '15+'}
share = []
for purpose, t, rse_t, ages, who in [('education', 2, 1, AGES_EDU, 'students (current weekly status) who made trips of 1 km or more to an educational institution'),
                                     ('work', 4, 3, AGES_WORK, 'workers (current weekly status) who made trips of 1 km or more to a workplace')]:
    val = nhts_blocks(os.path.join(A.raw, f'nhts/appendix-a/table-{t}.xlsx'), ages)
    rse = nhts_blocks(os.path.join(A.raw, f'nhts/appendix-b/rse-table-{rse_t}.xlsx'), ages)
    for (sector, sex), block in val.items():
        for g, cells in block.items():
            for a, c, rc in zip(ages, cells, rse[(sector, sex)][g]):
                share.append({'geography': g, 'period': PERIOD, 'purpose': purpose, 'sector': sector, 'sex': sex, 'age_group': AGE_SLUG[a],
                              'value': cell_text(c), 'rse': cell_text(rc), 'unit': f'per cent of {who.split(" (")[0]} in the age group',
                              'table': f'{NHTS}, Appendix A Table {t}; RSE from Appendix B Table {rse_t}'})
share.sort(key=lambda r: (r['purpose'], gi[r['geography']], SO[r['sector']], XO[r['sex']]))

# --- travel-india-fact-sheet-2025-26.csv: fact sheet Tables 1 to 7

fs = open(os.path.join(A.work, 'nhts/factsheet.txt'), encoding='utf-8').read()

def fs_block(start, end):
    a = fs.index(start)
    b = fs.index(end, a)
    return fs[a:b].split('\n')

def fs_rows(lines, labels, ncols):
    """{label: [ncols numbers]} for each row label. The fact sheet is set in two columns, so a row can
    follow prose on the same line. A long label wraps: then its numbers stand alone on the next line."""
    out = {}
    tail = r'((?:\s+\d+(?:\.\d+)?){%d})\s*$' % ncols
    for lab in labels:
        pat = re.compile(r'(?<![\w/])' + re.escape(lab) + (r'(?![\w])' if lab[-1].isalnum() else ''))
        for j, l in enumerate(lines):
            if not pat.search(l):
                continue
            m = re.search(re.escape(lab) + r'[^\d]*?' + tail, l)
            if not m and j + 1 < len(lines) and not re.search(r'\d', l[pat.search(l).end():]):
                m = re.fullmatch(r'((?:\d+(?:\.\d+)?\s*){%d})' % ncols, lines[j + 1].strip())
            if m:
                out[lab] = m.group(1).split()
                break
        if lab not in out:
            fail(f'fact sheet: row {lab!r} not found')
    return out

fact = []
def add(table, cat_key, cat, sector, sex, age, v, unit):
    fact.append({'geography': 'india', 'period': PERIOD, 'table': f'{NHTS}, Table {table}', 'category_type': cat_key, 'category': cat,
                 'sector': sector, 'sex': sex, 'age_group': age, 'value': v, 'unit': unit})

FS_MODES = [('Walk', 'walk'), ('Bicycle', 'bicycle'), ('Cycle rickshaw', 'cycle-rickshaw'), ('Two wheeler', 'two-wheeler'), ('Car', 'car'),
            ('Auto-rickshaw', 'auto-rickshaw'), ('Bus', 'bus'), ('Train/', 'train-metro-monorail-tram'), ('Rail', 'rail'), ('Water', 'water'), ('Others', 'others')]
SECT = ['rural', 'urban', 'rural+urban']
# Table 1
b = fs_block('TABLE 1: PERCENTAGE OF STUDENTS', 'FACT SHEET ON HOUSEHOLD TRAVEL')
t1 = fs_rows(b, ['rural', 'urban', 'all India'], 3)
for lab, sector in (('rural', 'rural'), ('urban', 'urban'), ('all India', 'rural+urban')):
    for sex, v in zip(('male', 'female', 'person'), t1[lab]):
        add(1, 'purpose', 'education', sector, sex, '6+', v, 'per cent of students of age 6 years and above who made trips of 1 km or more to an educational institution')
# Tables 2 and 3
b = fs_block('TABLE 2: PERCENTAGE OF STUDENTS', 'TABLE 3:')
t2 = fs_rows(b, [m for m, _ in FS_MODES], 3)
b = fs_block('TABLE 3: PERCENTAGE OF STUDENTS', 'FACT SHEET ON HOUSEHOLD TRAVEL')
t3 = fs_rows(b, [m for m, _ in FS_MODES], 3)
for lab, m in FS_MODES:
    for sector, v in zip(SECT, t2[lab]):
        add(2, 'mode', m, sector, 'person', '6+', v, 'per cent of students of age 6 years and above travelling 1 km or more to an educational institution')
    for age, v in zip(('6-14', '15-29', '6+'), t3[lab]):
        add(3, 'mode', m, 'rural+urban', 'person', age, v, 'per cent of students in the age group travelling 1 km or more to an educational institution')
# Table 4
b = fs_block('TABLE 4: PERCENTAGE OF WORKERS', 'FACT SHEET ON HOUSEHOLD TRAVEL')
t4 = fs_rows(b, [m for m, _ in FS_MODES], 3)
for lab, m in FS_MODES:
    for sector, v in zip(SECT, t4[lab]):
        add(4, 'mode', m, sector, 'person', '15+', v, 'per cent of workers of age 15 years and above travelling 1 km or more to a workplace')
# Table 5
P5 = [('Seeking employment', 'seeking-employment-or-setting-up-business'), ('Own use production', 'own-use-production-of-goods'),
      ('Unpaid domestic services', 'unpaid-domestic-services'), ('Unpaid caregiving services', 'unpaid-caregiving-services'),
      ('Unpaid volunteering', 'unpaid-volunteering-training-work'), ('Learning', 'learning'),
      ('Socializing', 'socialising-communication-religious'), ('Culture', 'culture-leisure-sports-tourism'),
      ('Self-care', 'self-care-and-maintenance'), ('Return home', 'return-home')]
b = fs_block('Table 5: Percentage of persons', 'FACT SHEET ON HOUSEHOLD TRAVEL')
t5 = fs_rows(b, [p for p, _ in P5], 3)
for lab, cat in P5:
    for sex, v in zip(('male', 'female', 'person'), t5[lab]):
        add(5, 'purpose', cat, 'rural+urban', sex, '6+', v, 'per cent of persons of age 6 years and above who made trips for other purposes, by purpose (a person can report more than one)')
# Table 6
P6 = [('Employment and related', 'employment'), ('Seeking employment', 'seeking-employment-or-setting-up-business'),
      ('Own-use production', 'own-use-production-of-goods'), ('Unpaid domestic services', 'unpaid-domestic-services'),
      ('Unpaid caregiving services', 'unpaid-caregiving-services'), ('Unpaid volunteer', 'unpaid-volunteer-trainee-work'),
      ('Learning', 'learning'), ('Socializing', 'socialising-communication-religious'), ('Culture', 'culture-leisure-sports-tourism'),
      ('Self-care', 'self-care-and-maintenance'), ('Return home', 'return-home')]
b = fs_block('Table 6: Percentage of households', 'FACT SHEET ON HOUSEHOLD TRAVEL')
t6 = fs_rows(b, [p for p, _ in P6], 3)
for lab, cat in P6:
    for sector, v in zip(SECT, t6[lab]):
        add(6, 'overnight-purpose', cat, sector, 'all', 'all', v, 'per cent of households that made an overnight trip in the last 28 travel days (a household can report more than one purpose)')
# Table 7
FS7 = FS_MODES[:9] + [('Water', 'water'), ('Air', 'air'), ('Others', 'others')]
b = fs_block('Table 7: Percentage of households', 'FACT SHEET ON HOUSEHOLD TRAVEL')
b = b[next(j for j, l in enumerate(b) if 'primary mode of travel' in l):]
t7 = fs_rows(b, [m for m, _ in FS7[:3]] + ['Two wheeler', 'car', 'Auto-rickshaw', 'Bus', 'Train/', 'Rail', 'Water', 'Air', 'Others'], 3)
for lab, m in zip([m for m, _ in FS7[:3]] + ['Two wheeler', 'car', 'Auto-rickshaw', 'Bus', 'Train/', 'Rail', 'Water', 'Air', 'Others'],
                  ['walk', 'bicycle', 'cycle-rickshaw', 'two-wheeler', 'car', 'auto-rickshaw', 'bus', 'train-metro-monorail-tram', 'rail', 'water', 'air', 'others']):
    for sector, v in zip(SECT, t7[lab]):
        add(7, 'overnight-mode', m, sector, 'all', 'all', v, 'per cent of households that made an overnight trip in the last 28 travel days')

# fact sheet against the Appendix A all-India rows
def nh(rows, **w):
    hit = [r for r in rows if all(r[k] == v for k, v in w.items())]
    assert len(hit) == 1, (w, len(hit))
    return hit[0]['value']
for r in fact:
    if r['table'].endswith('Table 2') or r['table'].endswith('Table 4'):
        a = nh(modes, geography='india', purpose='education' if r['table'].endswith('2') else 'work', sector=r['sector'], sex='person', mode=r['category'])
        if float(a) != float(r['value']):
            fail(f'{r["table"]} {r["category"]} {r["sector"]}: fact sheet {r["value"]}, Appendix A {a}')
    if r['table'].endswith('Table 1'):
        a = nh(share, geography='india', purpose='education', sector=r['sector'], sex=r['sex'], age_group='6+')
        if float(a) != float(r['value']):
            fail(f'Table 1 {r["sector"]} {r["sex"]}: fact sheet {r["value"]}, Appendix A {a}')

write('travel-mode-by-state-2025-26.csv', ['geography', 'period', 'purpose', 'sector', 'sex', 'mode', 'value', 'rse', 'unit', 'table'], modes)
check(modes, 'travel-mode', '42.6', geography='india', purpose='work', sector='rural+urban', sex='person', mode='two-wheeler')
check(modes, 'travel-mode', '40.5', geography='india', purpose='education', sector='rural', sex='person', mode='walk')
check(modes, 'travel-mode', '56.9', geography='andhra-pradesh', purpose='work', sector='rural', sex='male', mode='two-wheeler')
write('travel-trip-share-by-state-2025-26.csv', ['geography', 'period', 'purpose', 'sector', 'sex', 'age_group', 'value', 'rse', 'unit', 'table'], share)
check(share, 'travel-trip-share', '66.4', geography='india', purpose='education', sector='rural+urban', sex='person', age_group='6+')
check(share, 'travel-trip-share', '60.3', geography='andhra-pradesh', purpose='education', sector='rural', sex='male', age_group='6-14')
check(share, 'travel-trip-share', '67.6', geography='delhi', purpose='work', sector='rural', sex='male', age_group='15-29')
write('travel-india-fact-sheet-2025-26.csv', ['geography', 'period', 'table', 'category_type', 'category', 'sector', 'sex', 'age_group', 'value', 'unit'], fact)
check(fact, 'fact-sheet', '55.8', table=f'{NHTS}, Table 7', category='bus', sector='rural+urban')
check(fact, 'fact-sheet', '70.2', table=f'{NHTS}, Table 6', category='socialising-communication-religious', sector='rural+urban')
check(fact, 'fact-sheet', '47.3', table=f'{NHTS}, Table 3', category='walk', age_group='6-14')

for rows in (by_state, series, road_user, safety, modes, share, fact):
    for r in rows:
        if r['geography'] not in GEO and r['geography'] != 'india':
            fail(f'geography {r["geography"]}')
print('all checks passed')
