"""Build tidy CSVs for the population topic from the raw downloads.

First run pipeline/population/extract_text.sh (PDF text and projections table into the work folder).
Run: python3 -I pipeline/population/build_population.py --raw raw/population --work work/population --out research/data/population
Reads downloaded files as data only.
"""
import argparse, csv, re, sys, os
import xlrd, openpyxl

ap = argparse.ArgumentParser()
ap.add_argument('--raw', default='raw/population')
ap.add_argument('--work', default='work/population', help='folder with srs2024.txt, srsb2024.txt and proj_table8.csv')
ap.add_argument('--out', default='research/data/population')
ap.add_argument('--geo', default='research/data/geography.csv')
args = ap.parse_args()
RAW, OUT, WORK = args.raw, args.out, args.work
os.makedirs(OUT, exist_ok=True)

GEO = {}
with open(args.geo) as f:
    for r in csv.DictReader(f):
        GEO[r['slug']] = r['name']

def norm(s):
    s = str(s).lower().replace('&', 'and')
    s = re.sub(r'\(.*?\)', ' ', s)
    s = re.sub(r'[^a-z ]', ' ', s)
    s = re.sub(r'\b(state|nct of|the)\b', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()

ALIASES = {
    'india': 'india', 'jammu and kashmir': 'jammu-kashmir', 'himachal pradesh': 'himachal-pradesh',
    'punjab': 'punjab', 'chandigarh': 'chandigarh', 'uttarakhand': 'uttarakhand', 'uttaranchal': 'uttarakhand',
    'haryana': 'haryana', 'delhi': 'delhi', 'rajasthan': 'rajasthan', 'uttar pradesh': 'uttar-pradesh',
    'bihar': 'bihar', 'sikkim': 'sikkim', 'arunachal pradesh': 'arunachal-pradesh', 'nagaland': 'nagaland',
    'manipur': 'manipur', 'mizoram': 'mizoram', 'tripura': 'tripura', 'meghalaya': 'meghalaya',
    'assam': 'assam', 'west bengal': 'west-bengal', 'jharkhand': 'jharkhand', 'odisha': 'odisha',
    'orissa': 'odisha', 'chhattisgarh': 'chhattisgarh', 'chhatisgarh': 'chhattisgarh',
    'madhya pradesh': 'madhya-pradesh', 'gujarat': 'gujarat', 'daman and diu': 'daman-diu',
    'dadra and nagar haveli': 'dadra-nagar-haveli', 'maharashtra': 'maharashtra',
    'andhra pradesh': 'andhra-pradesh', 'karnataka': 'karnataka', 'goa': 'goa',
    'lakshadweep': 'lakshadweep', 'kerala': 'kerala', 'tamil nadu': 'tamil-nadu',
    'puducherry': 'puducherry', 'pondicherry': 'puducherry', 'andaman and nicobar islands': 'andaman-nicobar',
    'telangana': 'telangana', 'ladakh': 'ladakh',
    'dadra and nagar haveli and daman and diu': 'dnh-dd',
}

def slug_of(name):
    n = norm(name)
    if n in ALIASES:
        return ALIASES[n]
    raise KeyError(name)

NOTE_AP = 'Census 2011 unit: undivided Andhra Pradesh, includes present-day Telangana'
NOTE_JK = 'Census 2011 unit: former state of Jammu and Kashmir, includes present-day Ladakh'
NOTE_TG = 'Not a separate unit in Census 2011 tables; counted in andhra-pradesh'
NOTE_LA = 'Not a separate unit in Census 2011 tables; counted in jammu-kashmir'
NOTE_DNHDD = 'Derived: sum of Dadra and Nagar Haveli and Daman and Diu as published in 2011'

def census_note(slug):
    return {'andhra-pradesh': NOTE_AP, 'jammu-kashmir': NOTE_JK}.get(slug, '')

def write(name, header, rows):
    p = os.path.join(OUT, name)
    with open(p, 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(header)
        w.writerows(rows)
    print('wrote', p, len(rows))

def num(v):
    if isinstance(v, float):
        return int(v) if v == int(v) else v
    s = str(v).replace(',', '').replace('+', '').replace(' ', '').strip()
    if s in ('', '---', '-') or s.upper().startswith('N.A'):
        return None
    return float(s) if '.' in s else int(s)

# ---------- A-02: decadal variation 1901-2011 ----------
a2 = xlrd.open_workbook(os.path.join(RAW, 'census', '00%20A%202-India.xls')).sheet_by_index(0)
series = {}  # slug -> list of (year, persons, abs, pct, m, f, flag, name)
cur = None
for r in range(6, a2.nrows):
    v = a2.row_values(r)
    if str(v[2]).strip() and str(v[0]).strip():
        raw_name = str(v[2]).strip()
        cur = slug_of(re.sub(r'[\*\^\$#@]+', '', raw_name))
        series[cur] = {'name': re.sub(r'\s*[\*\^\$#@]+\s*$', '', raw_name).strip(), 'rows': []}
    if cur is None or v[3] in ('', None):
        continue
    yraw = str(v[3])
    m = re.search(r'(19|20)\d\d', yraw)
    if not m:
        continue
    year = int(m.group(0))
    flag = re.sub(r'[\d\.\s]', '', yraw)
    pct = v[6]
    if isinstance(pct, float):
        pct = round(pct, 2)  # Excel cell holds full precision; PDF shows 2 dp (17.70 for India 2011)
    else:
        pct = num(pct)
        if pct is not None and str(v[6]).strip().startswith('-'):
            pct = -abs(pct)
    ab = v[5]
    ab = num(ab)
    if ab is not None and str(v[5]).strip().startswith('-'):
        ab = -abs(ab)
    series[cur]['rows'].append((year, num(v[4]), ab, pct, num(v[7]), num(v[8]), flag))
    if r > 472:
        break

FLAG_NOTES = {
    '$': 'Sex split excludes Puducherry for this year (A-02 footnote $)',
    '@': 'Nagaland Tuensang and Mon not comparable for 1941-61 (A-02 footnote @)',
    '#': 'Assam 1981 interpolated, no census held (A-02 footnote #)',
    '+': 'Jammu and Kashmir 1991 interpolated, no census held (A-02 footnote +)',
    '++': 'Manipur 2001 includes estimated population of Mao Maram, Paomata and Purul sub-divisions (A-02 footnote ++)',
}
rows = []
for (year, p, ab, pct, mm, ff, flag) in series['india']['rows']:
    rows.append(['india', year, p, ab if ab is not None else '', f'{pct:.2f}' if pct is not None else '', mm, ff, 'persons', FLAG_NOTES.get(flag, '')])
write('population-census-1901-2011.csv',
      ['geography', 'period', 'population', 'change_since_previous_census', 'change_since_previous_census_pct', 'males', 'females', 'unit', 'note'], rows)

# ---------- By state 2011: population + growth 2001-2011 (A-02) ----------
rows = []
def get(slug, year):
    for t in series[slug]['rows']:
        if t[0] == year:
            return t
    raise KeyError((slug, year))
order = ['india'] + [s for s in GEO]
for slug in order:
    if slug == 'telangana':
        rows.append([slug, GEO[slug], '', 2011, 'population', '', 'persons', NOTE_TG]); rows.append([slug, GEO[slug], '', '2001-2011', 'decadal_growth_pct', '', 'percent', NOTE_TG]); continue
    if slug == 'ladakh':
        rows.append([slug, GEO[slug], '', 2011, 'population', '', 'persons', NOTE_LA]); rows.append([slug, GEO[slug], '', '2001-2011', 'decadal_growth_pct', '', 'percent', NOTE_LA]); continue
    if slug == 'dnh-dd':
        p11 = get('dadra-nagar-haveli', 2011)[1] + get('daman-diu', 2011)[1]
        p01 = get('dadra-nagar-haveli', 2001)[1] + get('daman-diu', 2001)[1]
        g = round((p11 - p01) / p01 * 100, 2)
        nm = 'Dadra & Nagar Haveli + Daman & Diu'
        rows.append([slug, GEO[slug], nm, 2011, 'population', p11, 'persons', NOTE_DNHDD])
        rows.append([slug, GEO[slug], nm, '2001-2011', 'decadal_growth_pct', f'{g:.2f}', 'percent', NOTE_DNHDD + '; growth computed from summed counts'])
        continue
    t11 = get(slug, 2011)
    nm = 'India' if slug == 'india' else series[slug]['name']
    name = 'India' if slug == 'india' else GEO[slug]
    rows.append([slug, name, nm, 2011, 'population', t11[1], 'persons', census_note(slug)])
    rows.append([slug, name, nm, '2001-2011', 'decadal_growth_pct', f'{t11[3]:.2f}', 'percent', census_note(slug)])
write('population-by-state-2011.csv', ['geography', 'name', 'name_as_published', 'period', 'series', 'value', 'unit', 'note'], rows)

# ---------- A-1: urban share by state 2011 ----------
wb = openpyxl.load_workbook(os.path.join(RAW, 'census', 'A-1_NO_OF_VILLAGES_TOWNS_HOUSEHOLDS_POPULATION_AND_AREA.xlsx'), read_only=True, data_only=True)
ws = wb.worksheets[0]
a1 = {}
for i, row in enumerate(ws.iter_rows(values_only=True)):
    if i < 4 or row[3] not in ('INDIA', 'STATE', 'UNION TERRITORY'):
        continue
    if row[1] != '000':
        continue
    slug = slug_of(re.sub(r'[@&\$#\*]+\s*$', '', str(row[4]).replace('@&', '').replace('$', '')).strip())
    a1.setdefault(slug, {'name': str(row[4]).replace('@&', '').replace('$', '').strip()})[row[5]] = row[10]
assert len(a1) == 36, sorted(a1)
rows = []
for slug in order:
    name = 'India' if slug == 'india' else GEO[slug]
    if slug in ('telangana', 'ladakh'):
        note = NOTE_TG if slug == 'telangana' else NOTE_LA
        for s, u in (('total_population', 'persons'), ('urban_population', 'persons'), ('urban_share_pct', 'percent')):
            rows.append([slug, name, '', 2011, s, '', u, note])
        continue
    if slug == 'dnh-dd':
        t = a1['dadra-nagar-haveli']['Total'] + a1['daman-diu']['Total']
        u = a1['dadra-nagar-haveli']['Urban'] + a1['daman-diu']['Urban']
        nm, note = 'Dadra & Nagar Haveli + Daman & Diu', NOTE_DNHDD
    else:
        t, u, nm, note = a1[slug]['Total'], a1[slug]['Urban'], a1[slug]['name'], census_note(slug)
    rows.append([slug, name, nm, 2011, 'total_population', t, 'persons', note])
    rows.append([slug, name, nm, 2011, 'urban_population', u, 'persons', note])
    rows.append([slug, name, nm, 2011, 'urban_share_pct', f'{u / t * 100:.2f}', 'percent', ('Derived: urban / total x 100. ' + note).strip()])
write('urban-share-by-state-2011.csv', ['geography', 'name', 'name_as_published', 'period', 'series', 'value', 'unit', 'note'], rows)
# cross-check A-1 totals vs A-02 2011
for slug in a1:
    if slug in series:
        assert a1[slug]['Total'] == get(slug, 2011)[1], slug

# ---------- C-14: pyramid 2011 ----------
c14 = xlrd.open_workbook(os.path.join(RAW, 'census', 'DDW-0000C-14.xls')).sheet_by_index(0)
rows = []
for r in range(7, c14.nrows):
    v = c14.row_values(r)
    if v[3] != 'India':
        break
    if v[4] == 'All ages':
        continue
    rows.append(['india', 2011, v[4], 'male', int(v[6]), 'persons'])
    rows.append(['india', 2011, v[4], 'female', int(v[7]), 'persons'])
write('population-pyramid-2011.csv', ['geography', 'period', 'age_group', 'sex', 'value', 'unit'], rows)

# ---------- Projections: Table 8 (1 March) ----------
proj = list(csv.DictReader(open(os.path.join(WORK, 'proj_table8.csv'))))
pj = {}
for r in proj:
    pj[(r['unit_code'], int(r['year']))] = r
rows = []
NOTE_PJ = 'Projection as on 1 March; 2011 values are Census 2011 counts as given in the report'
for slug in order:
    name = 'India' if slug == 'india' else GEO[slug]
    for y in range(2011, 2037):
        if slug == 'dnh-dd':
            a, b = pj[('dadra-nagar-haveli', y)], pj[('daman-diu', y)]
            p = int(a['persons_thousand']) + int(b['persons_thousand'])
            rows.append([slug, name, y, 'persons', p, 'thousand persons', 'Derived: sum of Dadra and Nagar Haveli and Daman and Diu columns. ' + NOTE_PJ])
            continue
        r = pj[(slug, y)]
        rows.append([slug, name, y, 'persons', int(r['persons_thousand']), 'thousand persons', NOTE_PJ])
write('population-projections-2011-2036.csv', ['geography', 'name', 'period', 'series', 'value', 'unit', 'note'], rows)

# ---------- SRS (values transcribed by parse from PDF text) ----------
srs = open(os.path.join(WORK, 'srs2024.txt'), encoding='utf-8').read().split('\n')
srsb = open(os.path.join(WORK, 'srsb2024.txt'), encoding='utf-8').read().split('\n')

def table_block(lines, title_regex, nrows=40):
    idx = [i for i, l in enumerate(lines) if re.search(title_regex, l)]
    i = idx[-1]
    return lines[i:i + nrows]

def parse_rows(block, ncols):
    out = {}
    for l in block:
        m = re.match(r'^\s*(?:\d+\.\s*)?([A-Za-z][A-Za-z &\.\*]+?)\s{2,}([\d\.\s]+)$', l)
        if not m:
            continue
        vals = m.group(2).split()
        if len(vals) != ncols:
            continue
        out[m.group(1).strip().rstrip('*').strip()] = vals
    return out

BIG = ['india', 'andhra-pradesh', 'assam', 'bihar', 'chhattisgarh', 'delhi', 'gujarat', 'haryana', 'himachal-pradesh',
       'jammu-kashmir', 'jharkhand', 'karnataka', 'kerala', 'madhya-pradesh', 'maharashtra', 'odisha', 'punjab',
       'rajasthan', 'tamil-nadu', 'telangana', 'uttar-pradesh', 'uttarakhand', 'west-bengal']

# TFR Table 15
blk = table_block(srs, r'Table 15: Annual Estimates of Total Fertility Rate', 32)
t15 = parse_rows(blk, 18)
rows = []
yrs = [2019, 2020, 2021, 2022, 2023, 2024]
got = {slug_of(k): v for k, v in t15.items()}
assert set(got) == set(BIG), set(BIG) ^ set(got)
for slug in BIG:
    v = got[slug]
    for k, res in enumerate(['total', 'rural', 'urban']):
        for j, y in enumerate(yrs):
            rows.append([slug, 'India' if slug == 'india' else GEO[slug], y, res, v[k * 6 + j], 'children per woman'])
# cross-check with Statement 24 (2024)
blk = table_block(srs, r'TFR \(Total Fertility Rate\) by Residence, India and Bigger States/UTs, 2024', 30)
s24 = {slug_of(k): v for k, v in parse_rows(blk, 3).items()}
for slug in BIG:
    assert s24[slug] == [got[slug][5], got[slug][11], got[slug][17]], (slug, s24[slug])
write('tfr-by-state-2019-2024.csv', ['geography', 'name', 'period', 'residence', 'value', 'unit'], rows)

# SRB Table 16
blk = table_block(srs, r'Table 16: Sex Ratio at Birth', 32)
t16 = {slug_of(k): v for k, v in parse_rows(blk, 15).items()}
assert set(t16) == set(BIG)
pers = ['2018-20', '2019-21', '2020-22', '2021-23', '2022-24']
rows = []
for slug in BIG:
    for k, res in enumerate(['total', 'rural', 'urban']):
        for j, p in enumerate(pers):
            rows.append([slug, 'India' if slug == 'india' else GEO[slug], p, res, t16[slug][k * 5 + j], 'females per 1,000 males at birth'])
blk = table_block(srs, r'Sex Ratio \(female per 1000 male\) at Birth by Residence,', 30)
s16 = {slug_of(k): v for k, v in parse_rows(blk, 3).items()}
for slug in BIG:
    assert s16[slug] == [t16[slug][4], t16[slug][9], t16[slug][14]], slug
write('sex-ratio-at-birth-by-state.csv', ['geography', 'name', 'period', 'residence', 'value', 'unit'], rows)

# Bulletin Table 1 (all states/UTs)
blk = table_block(srsb, r'Table 1: Estimated Birth Rate, Death Rate', 56)
# DNH&DD row is split over lines; join it
joined = []
for i, l in enumerate(blk):
    if re.match(r'^\s*3\. Dadra & Nagar Haveli\s*$', l):
        joined.append('Dadra and Nagar Haveli and Daman and Diu   ' + blk[i + 1].strip())
    elif 'and Daman & Diu' in l or (i > 0 and re.match(r'^\s*3\. Dadra', blk[i - 1] or '')):
        continue
    else:
        joined.append(l)
b1 = {}
for k, v in parse_rows(joined, 12).items():
    b1[slug_of(k)] = v
assert set(b1) == set(['india'] + list(GEO)), set(['india'] + list(GEO)) ^ set(b1)
SER = ['birth_rate', 'death_rate', 'natural_growth_rate', 'infant_mortality_rate']
UNITS = {'birth_rate': 'per 1,000 population', 'death_rate': 'per 1,000 population',
         'natural_growth_rate': 'per 1,000 population', 'infant_mortality_rate': 'per 1,000 live births'}
SMALL = {'arunachal-pradesh', 'goa', 'himachal-pradesh', 'manipur', 'meghalaya', 'mizoram', 'nagaland', 'sikkim', 'tripura',
         'andaman-nicobar', 'chandigarh', 'dnh-dd', 'ladakh', 'lakshadweep', 'puducherry'}
rows = []
for slug in ['india'] + list(GEO):
    v = b1[slug]
    for si, s in enumerate(SER):
        for ri, res in enumerate(['total', 'rural', 'urban']):
            note = ''
            if s == 'infant_mortality_rate' and slug in SMALL:
                note = 'IMR for smaller states and UTs is a three-year average, 2022-24'
            if slug == 'manipur':
                note = (note + '; ' if note else '') + 'Manipur estimates based on 130 SRS units'
            rows.append([slug, 'India' if slug == 'india' else GEO[slug], 2024, s, res, v[si * 3 + ri], UNITS[s], note])
write('birth-death-rates-by-state-2024.csv', ['geography', 'name', 'period', 'series', 'residence', 'value', 'unit', 'note'], rows)
# cross-check bulletin birth rate vs report Table 12 for bigger states (2024 total)
blk = table_block(srs, r'Table 12: Annual Estimates of Birth Rate', 32)
t12 = {slug_of(k): v for k, v in parse_rows(blk, 18).items()}
for slug in t12:
    assert t12[slug][5] == b1[slug][0], (slug, t12[slug][5], b1[slug][0])
print('all cross-checks passed')
