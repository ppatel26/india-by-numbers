"""Domestic tourism CSVs from MoSPI NSS Report 597, Domestic Tourism in India (NSS round 80,
July 2025 to June 2026): the report text and its Appendix A Tables 1, 15 and 19 (XLSX).

First run pipeline/transport/fetch.sh tourism/ and pipeline/transport/extract_text.sh tourism/.
Run: python3 -I pipeline/transport/build_tourism.py [--raw raw/transport] [--work work/transport]
     [--out research/data/transport] [--geo research/data/geography.csv]

The report statements are read from the layout text by position: each number goes to the column
whose header sits nearest to it, so a blank cell (Chandigarh has no rural sample) stays blank.
The workbooks are read cell by cell. The script stops if a checked value differs from the published
table, or if two tables that should agree do not.
"""
import argparse, csv, os, re, sys
from decimal import Decimal, ROUND_HALF_UP

import openpyxl

ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
ap.add_argument('--raw', default='raw/transport')
ap.add_argument('--work', default='work/transport')
ap.add_argument('--out', default='research/data/transport')
ap.add_argument('--geo', default='research/data/geography.csv')
A = ap.parse_args()
os.makedirs(A.out, exist_ok=True)

PERIOD = '2025-26'
R597 = 'NSS Report 597'
SECTORS = ['rural', 'urban', 'rural+urban']

# ---------------------------------------------------------------- geography

GEO = [r for r in csv.DictReader(open(A.geo, encoding='utf-8'))]
NAMES = {re.sub(r'[^a-z]', '', r['name'].lower().replace('&', 'and')): r['slug'] for r in GEO}
ALIAS = {
    'allindia': 'india',
    'aandnislands': 'andaman-nicobar',
    'dadraandnagarhavelianddamananddiu': 'dnh-dd', 'dadraandnhavelianddamananddiu': 'dnh-dd',
    'keralam': 'kerala',  # MoSPI uses the name Keralam
}

def slug(name):
    k = re.sub(r'[^a-z]', '', str(name).lower().replace('&', 'and'))
    s = ALIAS.get(k) or NAMES.get(k)
    if not s:
        sys.exit(f'unknown State/UT name: {name!r}')
    return s

def fail(msg):
    sys.exit('CHECK FAILED: ' + msg)

def write(name, header, rows):
    with open(os.path.join(A.out, name), 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f, lineterminator='\n')
        w.writerow(header)
        for r in rows:
            w.writerow([r.get(h, '') for h in header])
    print(f'{name}: {len(rows)} rows')

def one(rows, **where):
    hit = [r for r in rows if all(str(r.get(k)) == str(v) for k, v in where.items())]
    if len(hit) != 1:
        fail(f'{len(hit)} rows for {where}')
    return hit[0]

def check(rows, name, want, **where):
    got = one(rows, **where)['value']
    if got != str(want):
        fail(f'{name}: {where} is {got}, published {want}')

def pct(a, b):
    """A share from two published counts: a / b x 100, one decimal, rounded half up."""
    return str((Decimal(a) * 100 / Decimal(b)).quantize(Decimal('0.1'), rounding=ROUND_HALF_UP))

# ---------------------------------------------------------------- report text

txt = open(os.path.join(A.work, 'tourism/report-597.txt'), encoding='utf-8').read()

def block(start, end):
    a = txt.index(start)
    return txt[a:txt.index(end, a)].split('\n')

NUMBER = re.compile(r'(?<![\w.])\d[\d,]*(?:\.\d+)?(?![\w.])')

def statement(lines, labels, header, ncols):
    """[(label, [ncols values])] read by position. `header` is a line pattern whose numbered cells
    "(2)", "(3)", ... give the x position of each value column. Each label must start its line
    (after spaces), with its numbers on the same line. Labels are found in order, so a label that
    repeats ("all") is read once for each time it is given. A blank cell gives ''."""
    hi = next(j for j, l in enumerate(lines) if re.search(header, l))
    xs = [m.start() + len(m.group()) / 2 for m in re.finditer(r'\(\d+\)', lines[hi])][1:]
    if len(xs) != ncols:
        fail(f'header {header!r}: {len(xs)} value columns, want {ncols}')
    out, start = [], hi + 1
    for lab in labels:
        pat = re.compile(r'^\s*' + re.escape(lab) + r'(?![\w])', re.I)
        j = next((j for j in range(start, len(lines)) if pat.search(lines[j])), None)
        if j is None:
            fail(f'row {lab!r} not found after {header!r}')
        l = lines[j]
        nums = [(m.start() + len(m.group()) / 2, m.group().replace(',', '')) for m in NUMBER.finditer(l, pat.search(l).end())]
        if not nums:
            fail(f'row {lab!r}: no values')
        row = [''] * ncols
        for x, v in nums:
            k = min(range(ncols), key=lambda i: abs(xs[i] - x))
            if row[k]:
                fail(f'row {lab!r}: two values in column {k + 2}')
            row[k] = v
        out.append((lab, row))
        start = j + 1
    return out

# ---------------------------------------------------------------- workbooks

def sheet_blocks(path, ncols):
    """{sector: {slug: [values of columns 2 .. ncols+1]}} from a State/UT workbook with one block per sector."""
    ws = openpyxl.load_workbook(path).worksheets[0]
    rows = [[c.value for c in r] for r in ws.iter_rows()]
    out, sector = {}, None
    for r in rows:
        cells = [str(v).strip() for v in r if v is not None]
        if len(cells) == 1 and cells[0] in SECTORS:  # the sector heading of a block
            sector = cells[0]
            out[sector] = {}
            continue
        if sector and isinstance(r[0], str) and isinstance(r[1], int):
            out[sector][slug(r[0])] = r[1:1 + ncols]
    if sorted(out) != sorted(SECTORS):
        fail(f'{os.path.basename(path)}: sectors {sorted(out)}')
    for s, b in out.items():
        want = 36 if s == 'rural' else 37  # Chandigarh has no rural sample
        if len(b) != want or 'india' not in b:
            fail(f'{os.path.basename(path)} {s}: {len(b)} rows')
    return out

geo_order = ['india'] + [r['slug'] for r in GEO if r['type'] in ('state', 'ut')]
gi = {g: i for i, g in enumerate(geo_order)}

# ================================================================ households by State/UT

T1 = f'{R597}, Appendix A Table 1'
T19 = f'{R597}, Appendix A Table 19'
t1 = sheet_blocks(os.path.join(A.raw, 'tourism/appendix-a/table-1.xlsx'), 8)
t19 = sheet_blocks(os.path.join(A.raw, 'tourism/appendix-a/table-19.xlsx'), 6)

# Statement 3.16: same-day trips by State/UT, as published
b = block('Statement 3.16: Percentage of households reporting at least one same-day trip', 'Ref: Table 19')
names316 = [n.group(1) for n in (re.match(r'^\s{2,}([A-Za-z][A-Za-z.&\- ]+?)\s{2,}\d', l) for l in b) if n]
s316 = dict(statement(b, names316, r'\(1\)\s+\(2\)\s+\(3\)\s+\(4\)', 3))
if len(s316) != 37:
    fail(f'Statement 3.16: {len(s316)} rows')

households = []
for g in sorted(t1['rural+urban'], key=lambda g: gi[g]):
    for sector in SECTORS:
        r = t1[sector].get(g)
        rs = t19[sector].get(g)
        note = '' if r else 'no rural sample: not in the rural block of Table 1'
        def add(trip, ind, v, unit, table, note=note):
            households.append({'geography': g, 'period': PERIOD, 'sector': sector, 'trip_type': trip, 'indicator': ind,
                               'value': '' if v is None else str(v), 'unit': unit, 'table': table, 'note': note})
        add('all', 'households', r and r[0], 'hundred households', T1)
        add('overnight', 'households-with-trip', r and r[1], 'hundred households', T1)
        add('overnight', 'trips-365-days', r and r[2], 'hundred overnight trips completed in the last 365 days (holidaying, pilgrimage, health, shopping)', T1)
        add('overnight', 'trips-30-days', r and r[3], 'hundred overnight trips completed in the last 30 days (business, social, education, others)', T1)
        add('overnight', 'share-of-households-with-trip', r and pct(r[1], r[0]),
            'per cent of households that made at least one overnight trip (see note)', T1,
            note or 'derived: column 3 / column 2 x 100, one decimal. Households with a holidaying, pilgrimage, health or shopping trip in the last 365 days and/or a business, social, education or other trip in the last 30 days')
        add('same-day', 'households-with-trip', rs and rs[1], 'hundred households', T19)
        v316 = dict(zip(SECTORS, s316[next(n for n in s316 if slug(n) == g)]))[sector]
        add('same-day', 'share-of-households-with-trip', v316, 'per cent of households that made at least one same-day trip in the last 30 days',
            f'{R597}, Statement 3.16', '' if v316 else 'blank in Statement 3.16: no rural sample')
        # Statement 3.16 equals the same share computed from Table 19: the overnight share uses MoSPI's own method
        if rs and v316 and pct(rs[1], rs[0]) != v316:
            fail(f'Statement 3.16 {g} {sector}: {v316}, Table 19 gives {pct(rs[1], rs[0])}')
        if r and rs and r[0] != rs[0]:
            fail(f'{g} {sector}: households differ between Tables 1 and 19')

# Statement 3.1: India, as published
b = block('Statement 3.1: Percentage of households reporting at least one overnight trip', 'Ref: Table 1')
s31 = dict(statement(b, SECTORS, r'\(1\)\s+\(2\)\s+\(3\)', 2))
for sector in SECTORS:
    if s31[sector][0] != str(t1[sector]['india'][0]):
        fail(f'Statement 3.1 {sector}: households {s31[sector][0]}, Table 1 {t1[sector]["india"][0]}')
    check(households, 'Statement 3.1', s31[sector][1], geography='india', sector=sector, trip_type='overnight', indicator='share-of-households-with-trip')
# States add up to India in Table 1 (estimates in hundreds, so allow rounding)
for sector in SECTORS:
    for c in range(4):
        s = sum(v[c] for g, v in t1[sector].items() if g != 'india')
        if abs(s - t1[sector]['india'][c]) > 40:
            fail(f'Table 1 {sector} column {c + 2}: States add to {s}, All India {t1[sector]["india"][c]}')

write('tourism-households-by-state-2025-26.csv', ['geography', 'period', 'sector', 'trip_type', 'indicator', 'value', 'unit', 'table', 'note'], households)
check(households, 'households', '35.2', geography='india', sector='rural', trip_type='overnight', indicator='share-of-households-with-trip')
check(households, 'households', '36.1', geography='india', sector='rural+urban', trip_type='overnight', indicator='share-of-households-with-trip')
check(households, 'households', 106804, geography='tamil-nadu', sector='rural+urban', trip_type='overnight', indicator='households-with-trip')
check(households, 'households', '89.7', geography='tripura', sector='rural+urban', trip_type='same-day', indicator='share-of-households-with-trip')
check(households, 'households', '', geography='chandigarh', sector='rural', trip_type='overnight', indicator='share-of-households-with-trip')

# ================================================================ India: trips and spending

india = []
def add_india(table, measure, ref, purpose, item, sector, v, unit, note=''):
    india.append({'geography': 'india', 'period': PERIOD, 'table': table, 'measure': measure, 'reference_period': ref, 'purpose': purpose,
                  'item': item, 'sector': sector, 'value': v, 'unit': unit, 'note': note})

PURPOSES = [('holidaying', 'holidaying-leisure-recreation', '365-days'), ('pilgrimage', 'pilgrimage-religious', '365-days'),
            ('health', 'health-medical', '365-days'), ('shopping', 'shopping', '365-days'), ('all', 'all', '365-days'),
            ('business', 'business', '30-days'), ('social', 'social', '30-days'), ('education', 'education-training', '30-days'),
            ('others', 'others', '30-days'), ('all', 'all', '30-days')]

# Statement 3.2: overnight trips per 100 households
b = block('Statement 3.2: Average number of overnight trips per 100 households', 'Ref: Table 1 & Table 12')
s32 = statement(b, [p for p, _, _ in PURPOSES], r'\(1\)\s+\(2\)\s+\(3\)\s+\(4\)', 3)
for (lab, vals), (_, purpose, ref) in zip(s32, PURPOSES):
    for sector, v in zip(SECTORS, vals):
        add_india(f'{R597}, Statement 3.2', 'overnight-trips-per-100-households', ref, purpose, '', sector, v,
                  f'overnight trips completed in the last {ref.split("-")[0]} days per 100 households (all households)')

# Table 15: average spending per overnight trip, by item, for each leading purpose and sector
T15 = f'{R597}, Appendix A Table 15'
ITEMS = [('package component', 'package'), ('non-package component', 'non-package'), ('accommodation', 'accommodation'),
         ('food and drink', 'food-and-drink'), ('transport', 'transport'), ('shopping', 'shopping'),
         ('recreation religious, cultural and sporting activities', 'recreation-religious-cultural-sporting'),
         ('medical and health-related activities', 'medical'), ('others', 'others'), ('total expenditure', 'total')]
TRIPS = {'estd. no. of overnight trips  (last 365 days)': '365-days', 'estd. no. of overnight trips  (last 30 days)': '30-days'}
ws = openpyxl.load_workbook(os.path.join(A.raw, 'tourism/appendix-a/table-15.xlsx')).worksheets[0]
rows15 = [[c.value for c in r][:11] for r in ws.iter_rows()]
t15, trips15, sector = {}, {}, None
for r in rows15:
    if r[0] == 'All India':
        sector = next(v for v in r[1:] if v)
        t15[sector] = {}
    elif sector and r[1] in ('holidaying, leisure and recreation',):
        head = [str(v).strip() for v in r[1:11]]
        if head != ['holidaying, leisure and recreation', 'pilgrimage& religious activities', 'health & medical', 'shopping', 'all',
                    'business', 'social', 'education & training', 'others', 'all']:
            fail(f'Table 15 {sector}: header {head}')
    elif sector and isinstance(r[0], str) and r[0].strip() in dict(ITEMS):
        t15[sector][dict(ITEMS)[r[0].strip()]] = r[1:11]
    elif sector and isinstance(r[0], str) and r[0] in TRIPS:
        trips15[(sector, TRIPS[r[0]])] = r[1:11]
if sorted(t15) != sorted(SECTORS) or any(len(v) != len(ITEMS) for v in t15.values()):
    fail(f'Table 15 blocks: { {k: len(v) for k, v in t15.items()} }')
for sector in SECTORS:
    for item, vals in t15[sector].items():
        for v, (_, purpose, ref) in zip(vals, PURPOSES):
            add_india(T15, 'average-spending-per-overnight-trip', ref, purpose, item, sector, str(v), 'rupees per overnight trip')
    # package + non-package = total; the seven non-package items add to non-package (each value is rounded)
    for k in range(10):
        p, n, t = (t15[sector][i][k] for i in ('package', 'non-package', 'total'))
        if abs(p + n - t) > 1:
            fail(f'Table 15 {sector} column {k + 2}: package {p} + non-package {n} != total {t}')
        s = sum(t15[sector][i][k] for _, i in ITEMS[2:9])
        if abs(s - n) > 4:
            fail(f'Table 15 {sector} column {k + 2}: items add to {s}, non-package {n}')

# Statement 3.13: rural+urban, by item, equals Table 15
b = block('Statement 3.13: Average expenditure (in Rs.) per overnight trip by categories', 'Ref: Table 15')
LAB313 = ['holidaying,', 'pilgrimage &', 'health & medical', 'shopping', 'business', 'social', 'education &', 'others']
s313 = dict(statement(b, LAB313, r'\(1\)\s+\(2\)\s+\(3\)', 9))
ITEM313 = ['package', 'accommodation', 'food-and-drink', 'transport', 'shopping', 'recreation-religious-cultural-sporting', 'medical', 'others', 'total']
for lab, (_, purpose, ref) in zip(LAB313, [p for p in PURPOSES if p[1] != 'all']):
    for item, v in zip(ITEM313, s313[lab]):
        check(india, 'Statement 3.13', v, table=T15, sector='rural+urban', purpose=purpose, reference_period=ref, item=item)

# Statement 3.15: rural and urban totals equal Table 15
b = block('Statement 3.15: Average expenditure (in Rs.) per overnight trips for each leading', 'Ref: Table 12 &15')
s315 = statement(b, [p for p, _, _ in PURPOSES], r'\(1\)\s+\(2\)\s+\(3\)', 2)
for (lab, vals), (_, purpose, ref) in zip(s315, PURPOSES):
    for sector, v in zip(('rural', 'urban'), vals):
        check(india, 'Statement 3.15', v, table=T15, sector=sector, purpose=purpose, reference_period=ref, item='total')

# Statement 3.2 against the trip counts of Table 15 and the households of Table 1
for (_, purpose, ref), k in zip(PURPOSES, range(10)):
    for sector in SECTORS:
        n = trips15[(sector, ref)][k]
        want = one(india, table=f'{R597}, Statement 3.2', sector=sector, purpose=purpose, reference_period=ref)['value']
        got = n * 100 / t1[sector]['india'][0]
        if abs(got - float(want)) > 0.051:
            fail(f'Statement 3.2 {purpose} {sector}: {want}, Tables 15 and 1 give {got:.2f}')
    if trips15[('rural+urban', ref)][4 if ref == '365-days' else 9] != t1['rural+urban']['india'][2 if ref == '365-days' else 3]:
        fail(f'Table 15 trips {ref} differ from Table 1')

# Statement 3.19: same-day trip spending by item
b = block('Statement 3.19: Item-wise share (in %) of trip expenditure for same-day trips', 'Ref: Table 21')
ITEM319 = [('package component', 'package'), ('accommodation', 'accommodation'), ('food', 'food-and-drink'), ('transport', 'transport'),
           ('shopping', 'shopping'), ('recreation, religious etc.', 'recreation-religious-cultural-sporting'), ('medical', 'medical'),
           ('others', 'others'), ('all', 'total')]
s319 = dict(statement(b, [l for l, _ in ITEM319], r'\(1\)\s+\(2\)\s+\(3\)', 2))
for lab, item in ITEM319:
    for sector, v in zip(('rural', 'urban'), s319[lab]):
        add_india(f'{R597}, Statement 3.19', 'share-of-same-day-trip-spending', '30-days', 'all', item, sector, v,
                  'per cent of spending on same-day trips completed in the last 30 days')

write('tourism-india-2025-26.csv', ['geography', 'period', 'table', 'measure', 'reference_period', 'purpose', 'item', 'sector', 'value', 'unit', 'note'], india)
check(india, 'trips', '15.5', measure='overnight-trips-per-100-households', purpose='pilgrimage-religious', sector='rural')
check(india, 'trips', '16.1', measure='overnight-trips-per-100-households', purpose='social', sector='rural+urban')
check(india, 'spending', 32167, measure='average-spending-per-overnight-trip', purpose='health-medical', item='total', sector='rural+urban')
check(india, 'spending', 41649, measure='average-spending-per-overnight-trip', purpose='health-medical', item='total', sector='urban')
check(india, 'spending', 5179, measure='average-spending-per-overnight-trip', purpose='business', item='total', sector='rural')
check(india, 'spending', 3685, measure='average-spending-per-overnight-trip', purpose='holidaying-leisure-recreation', item='transport', sector='rural+urban')
check(india, 'same-day', '51.2', measure='share-of-same-day-trip-spending', item='shopping', sector='rural')

for r in households:
    if r['geography'] != 'india' and r['geography'] not in NAMES.values():
        fail(f'geography {r["geography"]}')
print('all checks passed')
