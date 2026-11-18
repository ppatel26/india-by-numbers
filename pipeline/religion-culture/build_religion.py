"""Build tidy CSVs for the religion-culture topic from the raw downloads.

Run: python3 -I pipeline/religion-culture/build_religion.py --raw raw/religion-culture --out research/data/religion-culture
Reads downloaded files as data only.
"""
import argparse, csv, re, sys, os
import xlrd, openpyxl

ap = argparse.ArgumentParser()
ap.add_argument('--raw', default='raw/religion-culture')
ap.add_argument('--out', default='research/data/religion-culture')
ap.add_argument('--geo', default='research/data/geography.csv')
args = ap.parse_args()
RAW, OUT = args.raw, args.out
os.makedirs(OUT, exist_ok=True)
GEO = {}
with open(args.geo) as f:
    for r in csv.DictReader(f):
        GEO[r['slug']] = r['name']
ORDER = ['india'] + list(GEO)

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
    'orissa': 'odisha', 'chhattisgarh': 'chhattisgarh', 'madhya pradesh': 'madhya-pradesh', 'gujarat': 'gujarat',
    'daman and diu': 'daman-diu', 'dadra and nagar haveli': 'dadra-nagar-haveli', 'maharashtra': 'maharashtra',
    'andhra pradesh': 'andhra-pradesh', 'karnataka': 'karnataka', 'goa': 'goa', 'lakshadweep': 'lakshadweep',
    'kerala': 'kerala', 'tamil nadu': 'tamil-nadu', 'puducherry': 'puducherry', 'pondicherry': 'puducherry',
    'andaman and nicobar islands': 'andaman-nicobar',
}
def slug_of(name):
    return ALIASES[norm(name)]

NOTE_AP = 'Census 2011 unit: undivided Andhra Pradesh, includes present-day Telangana'
NOTE_JK = 'Census 2011 unit: former state of Jammu and Kashmir, includes present-day Ladakh'
NOTE_TG = 'Not a separate unit in Census 2011 tables; counted in andhra-pradesh'
NOTE_LA = 'Not a separate unit in Census 2011 tables; counted in jammu-kashmir'
NOTE_DNHDD = 'Derived: sum of Dadra and Nagar Haveli and Daman and Diu as published in 2011'
def note_of(slug):
    return {'andhra-pradesh': NOTE_AP, 'jammu-kashmir': NOTE_JK, 'telangana': NOTE_TG, 'ladakh': NOTE_LA, 'dnh-dd': NOTE_DNHDD}.get(slug, '')

def write(name, header, rows):
    p = os.path.join(OUT, name)
    with open(p, 'w', newline='') as f:
        w = csv.writer(f); w.writerow(header); w.writerows(rows)
    print('wrote', p, len(rows))

REL = ['hindu', 'muslim', 'christian', 'sikh', 'buddhist', 'jain', 'other_religions_and_persuasions', 'religion_not_stated']
REL_LABEL = {'hindu': 'Hindu', 'muslim': 'Muslim', 'christian': 'Christian', 'sikh': 'Sikh', 'buddhist': 'Buddhist', 'jain': 'Jain',
             'other_religions_and_persuasions': 'Other religions and persuasions', 'religion_not_stated': 'Religion not stated'}

def read_c01(path):
    sh = xlrd.open_workbook(path).sheet_by_index(0)
    hdr = [str(x).strip() for x in sh.row_values(2)]
    assert hdr[7] == 'Total' and hdr[10] == 'Hindu' and hdr[13] == 'Muslim' and hdr[31] == 'Religion not stated', hdr
    data = {}
    for r in range(7, sh.nrows):
        v = sh.row_values(r)
        if not str(v[5]).strip():
            continue
        name = re.sub(r'^State - ', '', str(v[5])).strip()
        slug = slug_of(name)
        tru = str(v[6]).strip()
        total = int(v[7])
        vals = [int(v[c]) for c in (10, 13, 16, 19, 22, 25, 28, 31)]
        assert sum(vals) == total, (name, tru, sum(vals), total)
        data[(slug, tru)] = {'name': name, 'total': total, 'vals': dict(zip(REL, vals))}
    return data

c11 = read_c01(os.path.join(RAW, 'census', 'DDW00C-01%20MDDS.XLS'))
c01 = read_c01(os.path.join(RAW, 'census', 'PC01_C01_00.xls'))

def pct(a, b):
    return f'{a / b * 100:.2f}'

# 1. India 2011 by religion, total/rural/urban
rows = []
for res in ('Total', 'Rural', 'Urban'):
    d = c11[('india', res)]
    for k in REL:
        rows.append(['india', 2011, res.lower(), REL_LABEL[k], d['vals'][k], 'persons', pct(d['vals'][k], d['total']), 'Census 2011 C-01; share derived (persons / total x 100)'])
write('religion-india-2011.csv', ['geography', 'period', 'residence', 'religion', 'value', 'unit', 'share_pct', 'note'], rows)

# 2. By state 2011 (total)
rows = []
for slug in ORDER:
    name = 'India' if slug == 'india' else GEO[slug]
    if slug in ('telangana', 'ladakh'):
        for k in REL:
            rows.append([slug, name, '', 2011, REL_LABEL[k], '', 'persons', '', note_of(slug)])
        continue
    if slug == 'dnh-dd':
        a, b = c11[('dadra-nagar-haveli', 'Total')], c11[('daman-diu', 'Total')]
        tot = a['total'] + b['total']
        vals = {k: a['vals'][k] + b['vals'][k] for k in REL}
        nm = 'Dadra & Nagar Haveli + Daman & Diu'
    else:
        d = c11[(slug, 'Total')]
        tot, vals, nm = d['total'], d['vals'], d['name']
    for k in REL:
        rows.append([slug, name, nm, 2011, REL_LABEL[k], vals[k], 'persons', pct(vals[k], tot), ('Share derived. ' + note_of(slug)).strip()])
write('religion-by-state-2011.csv', ['geography', 'name', 'name_as_published', 'period', 'religion', 'value', 'unit', 'share_pct', 'note'], rows)

# 3. India 2001 and 2011
rows = []
for year, d in ((2001, c01[('india', 'Total')]), (2011, c11[('india', 'Total')])):
    note = 'Census 2001 C-01. Total excludes Mao-Maram, Paomata and Purul sub-divisions of Senapati district, Manipur' if year == 2001 else 'Census 2011 C-01'
    for k in REL:
        rows.append(['india', year, REL_LABEL[k], d['vals'][k], 'persons', pct(d['vals'][k], d['total']), note + '; share derived'])
write('religion-india-2001-2011.csv', ['geography', 'period', 'religion', 'value', 'unit', 'share_pct', 'note'], rows)
print('2001 india total', c01[('india', 'Total')]['total'], '2011', c11[('india', 'Total')]['total'])
for k in REL:
    a, b = c01[('india', 'Total')]['vals'][k], c11[('india', 'Total')]['vals'][k]
    print(f'  {k}: 2001 {a} 2011 {b} growth {(b - a) / a * 100:.2f}%  share01 {pct(a, c01[("india","Total")]["total"])} share11 {pct(b, c11[("india","Total")]["total"])}')

# 4/5. Languages (C-16 statement: language groups)
wb = openpyxl.load_workbook(os.path.join(RAW, 'census', 'DDW-C16-STMT-MDDS-0000.XLSX'), read_only=True, data_only=True)
ws = wb.worksheets[0]
lang = {}  # slug -> list of (code, name, persons)
names = {}
for i, row in enumerate(ws.iter_rows(values_only=True)):
    if i < 6 or row[0] is None:
        continue
    code = str(row[5])
    if not code.endswith('000'):
        continue
    slug = slug_of(row[4])
    names[slug] = row[4]
    m = re.match(r'^\s*(\d+)\s+(.*?)\s*$', str(row[6]))
    num, lname = int(m.group(1)), m.group(2).strip().title()
    lang.setdefault(slug, []).append((num, lname, int(row[7])))

# Load populations from C-01 2011 totals to compute shares
def pop_of(slug):
    return c11[(slug, 'Total')]['total']
for slug in lang:
    s = sum(x[2] for x in lang[slug])
    assert s == pop_of(slug), (slug, s, pop_of(slug))

rows = []
ind = sorted(lang['india'], key=lambda x: -x[2])
rank_sched = 0
for num, lname, p in ind:
    sched = num <= 22
    if sched:
        rank_sched += 1
    rows.append(['india', 2011, lname, 'yes' if sched else ('no' if lname != 'Others' else 'n/a'), rank_sched if sched else '', p, 'persons', pct(p, pop_of('india')),
                 'Mother tongues grouped under the language as in C-16 statement; share derived'])
write('languages-india-2011.csv', ['geography', 'period', 'language', 'scheduled_language', 'rank_among_scheduled', 'value', 'unit', 'share_pct', 'note'], rows)

rows = []
for slug in ORDER:
    name = 'India' if slug == 'india' else GEO[slug]
    if slug in ('telangana', 'ladakh'):
        rows.append([slug, name, '', 2011, 1, '', '', 'persons', '', note_of(slug)])
        continue
    if slug == 'dnh-dd':
        comb = {}
        for s in ('dadra-nagar-haveli', 'daman-diu'):
            for num, lname, p in lang[s]:
                comb[(num, lname)] = comb.get((num, lname), 0) + p
        items = [(k[0], k[1], v) for k, v in comb.items()]
        tot = pop_of('dadra-nagar-haveli') + pop_of('daman-diu')
        nm = 'Dadra & Nagar Haveli + Daman & Diu'
    else:
        items, tot, nm = lang[slug], pop_of(slug), names[slug]
    top = sorted([x for x in items if x[1] != 'Others'], key=lambda x: -x[2])[:3]
    for rk, (num, lname, p) in enumerate(top, 1):
        rows.append([slug, name, nm, 2011, rk, lname, p, 'persons', pct(p, tot), ('Share derived. ' + note_of(slug)).strip()])
write('languages-top3-by-state-2011.csv', ['geography', 'name', 'name_as_published', 'period', 'rank', 'language', 'value', 'unit', 'share_pct', 'note'], rows)
