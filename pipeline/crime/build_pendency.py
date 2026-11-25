"""Build the court pendency CSVs from Ministry of Law and Justice answers in Parliament.

Each answer gives, in an annexure, the cases pending in the District and Subordinate Courts by
State/UT, and in the Supreme Court and each High Court, as the National Judicial Data Grid showed
them on a stated date. Each date is its own period. The script keeps the digits of the answer. It
checks the rows against the answer's Total row and prints any difference; it does not change a value.

Usage: python3 -I pipeline/crime/build_pendency.py [--work work/crime] [--out research/data/crime]
"""
import argparse
import csv
import os
import re
import sys

STATES = {  # name prefix in the answers -> geography slug (longest prefix wins)
    'andaman': 'andaman-nicobar', 'andhra': 'andhra-pradesh', 'arunachal': 'arunachal-pradesh', 'assam': 'assam',
    'bihar': 'bihar', 'chandigarh': 'chandigarh', 'chhattisgarh': 'chhattisgarh', 'delhi': 'delhi', 'goa': 'goa',
    'gujarat': 'gujarat', 'haryana': 'haryana', 'himachal': 'himachal-pradesh', 'jammu': 'jammu-kashmir',
    'jharkhand': 'jharkhand', 'karnataka': 'karnataka', 'kerala': 'kerala', 'ladakh': 'ladakh',
    'lakshadweep': 'lakshadweep', 'u.t of lakshadweep': 'lakshadweep', 'madhya': 'madhya-pradesh',
    'maharashtra': 'maharashtra', 'manipur': 'manipur', 'meghalaya': 'meghalaya', 'mizoram': 'mizoram',
    'nagaland': 'nagaland', 'odisha': 'odisha', 'orissa': 'odisha', 'puducherry': 'puducherry', 'punjab': 'punjab',
    'rajasthan': 'rajasthan', 'sikkim': 'sikkim', 'tamil': 'tamil-nadu', 'telangana': 'telangana',
    'the dadra': 'dnh-dd', 'dadra': 'dnh-dd', 'tripura': 'tripura', 'uttar pradesh': 'uttar-pradesh',
    'uttarakhand': 'uttarakhand', 'west bengal': 'west-bengal',
}
COURTS = {  # court slug -> (name prefix after removing "High Court", "of", "for State of"), jurisdiction
    'supreme-court': ('supreme', 'india'),
    'allahabad': ('allahabad', 'uttar-pradesh'),
    'bombay': ('bombay', 'maharashtra;goa;dnh-dd'),
    'calcutta': ('calcutta', 'west-bengal;andaman-nicobar'),
    'gauhati': ('gauhati', 'assam;arunachal-pradesh;mizoram;nagaland'),
    'telangana': ('telangana', 'telangana'),
    'andhra-pradesh': ('andhra', 'andhra-pradesh'),
    'chhattisgarh': ('chhattisgarh', 'chhattisgarh'),
    'delhi': ('delhi', 'delhi'),
    'gujarat': ('gujarat', 'gujarat'),
    'himachal-pradesh': ('himachal', 'himachal-pradesh'),
    'jammu-kashmir-ladakh': ('jammu', 'jammu-kashmir;ladakh'),
    'jharkhand': ('jharkhand', 'jharkhand'),
    'karnataka': ('karnataka', 'karnataka'),
    'kerala': ('kerala', 'kerala;lakshadweep'),
    'madhya-pradesh': ('madhya', 'madhya-pradesh'),
    'manipur': ('manipur', 'manipur'),
    'meghalaya': ('meghalaya', 'meghalaya'),
    'punjab-haryana': ('punjab', 'punjab;haryana;chandigarh'),
    'rajasthan': ('rajasthan', 'rajasthan'),
    'sikkim': ('sikkim', 'sikkim'),
    'tripura': ('tripura', 'tripura'),
    'uttarakhand': ('uttarakhand', 'uttarakhand'),
    'madras': ('madras', 'tamil-nadu;puducherry'),
    'orissa': ('orissa', 'odisha'),
    'patna': ('patna', 'bihar'),
}
COURT_PREFIX = {v[0]: k for k, v in COURTS.items()}
NUM = re.compile(r'^-?[\d,]+(\.\d+)?$')
SL = re.compile(r'^([A-Z]\.|\d{1,2}\.?)$')

# One entry per annexure table: file (under work/crime/pendency), the answer, the table, the text that
# starts it, and the meaning of each number column as (period, case_type, pending_for).
ALL = ('all', 'all')
SPECS = [
    dict(file='ls/ls-2142-2025-08-01', house='Lok Sabha', kind='Unstarred', q='2142', date='2025-08-01',
         table='district', annex='Annexure-I', start='Cases pending in District and Subordinate Courts as on 28.07.2025',
         cols=[('2025-07-28',) + ALL]),
    dict(file='ls/ls-2142-2025-08-01', house='Lok Sabha', kind='Unstarred', q='2142', date='2025-08-01',
         table='high', annex='Annexure-II', start='Cases pending in High Courts as on 28.07.2025',
         cols=[('2025-07-28',) + ALL]),
    dict(file='ls/ls-3295-2026-08-07', house='Lok Sabha', kind='Unstarred', q='3295', date='2026-08-07',
         table='district', annex='Annexure-II', start='Number of cases pending in the Subordinate Courts',
         cols=[('2021',) + ALL, ('2022',) + ALL, ('2023-12-31',) + ALL, ('2024-12-31',) + ALL,
               ('2025-12-31',) + ALL, ('2026-07-28',) + ALL]),
    dict(file='ls/ls-3295-2026-08-07', house='Lok Sabha', kind='Unstarred', q='3295', date='2026-08-07',
         table='high', annex='Annexure-I', start='Number of cases pending in the Supreme Court and High Courts',
         cols=[('2021',) + ALL, ('2022',) + ALL, ('2023-12-31',) + ALL, ('2024-12-31',) + ALL,
               ('2025-12-31',) + ALL, ('2026-07-28',) + ALL]),
    dict(file='ls/ls-3501-2026-03-13', house='Lok Sabha', kind='Unstarred', q='3501', date='2026-03-13',
         table='district', annex='Annexure-II', start='Pendency of cases in District & Subordinate Courts, state-wise',
         cols=[('2026-03-09', 'civil', 'all'), ('2026-03-09', 'criminal', 'all'), ('2026-03-09',) + ALL]),
    dict(file='ls/ls-3501-2026-03-13', house='Lok Sabha', kind='Unstarred', q='3501', date='2026-03-13',
         table='high', annex='Annexure-I', start='Pendency of cases in Supreme Court of India and High Courts',
         cols=[('2026-03-09', 'civil', 'all'), ('2026-03-09', 'criminal', 'all'), ('2026-03-09',) + ALL]),
    dict(file='rs/rs-3113-2026-03-19', house='Rajya Sabha', kind='Unstarred', q='3113', date='2026-03-19',
         table='district', annex='Annexure-II', start='more than five years, in the District & Subordinate Courts',
         cols=[('2026-03-13',) + ALL, ('2026-03-13', 'all', 'more-than-5-years')]),
    dict(file='rs/rs-3113-2026-03-19', house='Rajya Sabha', kind='Unstarred', q='3113', date='2026-03-19',
         table='high', annex='Annexure-I', start='than five years, in the Supreme Court and High Courts',
         cols=[('2026-03-13',) + ALL, ('2026-03-13', 'all', 'more-than-5-years')]),
    dict(file='ls/ls-5553-2026-03-27', house='Lok Sabha', kind='Unstarred', q='5553', date='2026-03-27',
         table='district', annex='Annexure-II', start='Pending cases in Subordinate Courts, as on 23.03.2026',
         cols=[('2026-03-23',) + ALL]),
    dict(file='ls/ls-5553-2026-03-27', house='Lok Sabha', kind='Unstarred', q='5553', date='2026-03-27',
         table='high', annex='Annexure-I', start='Pending cases in Supreme Court and High Courts, as on 23.03.2026',
         cols=[('2026-03-23',) + ALL]),
    dict(file='rs/rs-597-2026-07-23', house='Rajya Sabha', kind='Unstarred', q='597', date='2026-07-23',
         table='district', annex='Annexure-II', start='State-wise, in the District & Subordinate Courts',
         cols=[('2026-07-16', 'all', f'more-than-{n}-years') for n in (30, 20, 10, 5)]
         + [('2026-07-16', 'all', 'more-than-1-year'), ('2026-07-16',) + ALL]),
    dict(file='rs/rs-597-2026-07-23', house='Rajya Sabha', kind='Unstarred', q='597', date='2026-07-23',
         table='high', annex='Annexure-I', start='State-wise, in the Supreme Court and High Courts',
         cols=[('2026-07-16', 'all', f'more-than-{n}-years') for n in (30, 20, 10, 5)]
         + [('2026-07-16', 'all', 'more-than-1-year'), ('2026-07-16',) + ALL]),
    dict(file='ls/ls-3371-2026-08-07', house='Lok Sabha', kind='Unstarred', q='3371', date='2026-08-07',
         table='district', annex='Annexure-II', start='Cases pending in District & Subordinate Courts, as on 30.07.2026',
         cols=[('2026-07-30',) + ALL, ('2026-07-30', 'all', 'more-than-10-years'),
               ('2026-07-30', 'all', 'more-than-5-years')]),
    dict(file='ls/ls-3371-2026-08-07', house='Lok Sabha', kind='Unstarred', q='3371', date='2026-08-07',
         table='high', annex='Annexure-I', start='Cases pending in the Supreme Court and High Courts, as on 30.07.2026',
         cols=[('2026-07-30',) + ALL, ('2026-07-30', 'all', 'more-than-10-years'),
               ('2026-07-30', 'all', 'more-than-5-years')]),
]
# Check only: LS 2362 (13 Feb 2026) dates the year columns of LS 3295 to 31 December.
CHECK_2362 = dict(file='ls/ls-2362-2026-02-13', table='district', start='Pending cases in District & Subordinate Courts, along with',
                  cols=[('2023-12-31',) + ALL, ('2024-12-31',) + ALL, ('2025-12-31',) + ALL, ('increase', 'all', 'all')])

NOTE_3371_5Y = ("The answer labels this column 'More than 5 years'. Its counts are below the 'More than 10 years' "
                'counts for some courts, so read it as cases pending 5 to 10 years; do not chart it as a cumulative count')
NOTE_YEAR = 'LS 3295 gives the year only. LS 2362 dates the same columns for 2023 to 2025 to 31 December'


def norm(s):
    s = s.lower().replace('&', ' and ')
    s = re.sub(r'\b(the )?high court( of| for state of)?\b', ' ', s)
    s = re.sub(r'\bu\.t of\b', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()


def match(name, table):
    n = norm(name)
    if table == 'district':
        keys = [k for k in STATES if n.startswith(k)]
        return STATES[max(keys, key=len)] if keys else None
    if n.startswith('supreme'):
        return 'supreme-court'
    keys = [k for k in COURT_PREFIX if n.startswith(k)]
    return COURT_PREFIX[max(keys, key=len)] if keys else None


def split(line):
    toks = line.split()
    if toks and SL.match(toks[0]):
        toks = toks[1:]
    name = [t for t in toks if not NUM.match(t)]
    nums = [t.replace(',', '') for t in toks if NUM.match(t)]
    return ' '.join(name), nums


def parse(work, spec):
    with open(os.path.join(work, 'pendency', spec['file'] + '.txt'), encoding='utf-8') as f:
        text = f.read()
    i = text.find(spec['start'])
    if i < 0:
        sys.exit(f"{spec['file']}: start text not found")
    lines = text[i:].split('\n')[1:]
    n = len(spec['cols'])
    rows, total, pending, last = {}, None, '', ''
    k = 0
    while k < len(lines):
        name, nums = split(lines[k])
        nxt = split(lines[k + 1]) if k + 1 < len(lines) else ('', [])
        if name.lower().startswith('total'):
            total = nums
            break
        if 0 < len(nums) < n and not nxt[0] and len(nums) + len(nxt[1]) == n:
            nums = nxt[1] + nums  # a wrapped name pushed the last column onto the line above
            k += 1
            nxt = split(lines[k + 1]) if k + 1 < len(lines) else ('', [])
        if not nums:
            pending, last = (pending + ' ' + name).strip(), name
            k += 1
            continue
        slug = None
        for cand in (name, last + ' ' + name, pending + ' ' + name, name + ' ' + nxt[0]):
            slug = match(cand, spec['table'])
            if slug:
                break
        if slug and 0 < len(nums) <= n:
            if len(nums) < n:
                print(f"  {spec['file']}: {slug} has {len(nums)} of {n} values; the first columns are blank")
            if slug in rows:
                sys.exit(f"{spec['file']}: {slug} twice")
            rows[slug] = nums
        pending = last = ''
        k += 1
    want = set(STATES.values()) if spec['table'] == 'district' else set(COURTS)
    if spec['table'] == 'high' and spec['q'] in ('2142',):
        want.discard('supreme-court')
    missing = want - set(rows)
    if missing:
        sys.exit(f"{spec['file']} {spec['table']}: missing {sorted(missing)}")
    return rows, total


def check_total(spec, rows, total):
    n = len(spec['cols'])
    diffs = []
    for c in range(n):
        got = sum(int(float(r[c - (n - len(r))])) for s, r in rows.items() if s != 'supreme-court' and c - (n - len(r)) >= 0)
        if total and len(total) == n and str(got) != total[c].split('.')[0]:
            diffs.append(f'col {c + 1}: rows add to {got}, Total row {total[c]}')
    return diffs


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--work', default='work/crime')
    ap.add_argument('--out', default='research/data/crime')
    a = ap.parse_args()
    district, high, checked = [], [], 0
    parsed = {}
    for spec in SPECS:
        rows, total = parse(a.work, spec)
        parsed[(spec['q'], spec['table'])] = rows
        if not total or len(total) != len(spec['cols']):
            sys.exit(f"{spec['file']} {spec['table']}: no Total row to check against")
        diffs = check_total(spec, rows, total)
        for d in diffs:
            print(f"  {spec['house']} {spec['q']} {spec['table']}: {d}")
        checked += not diffs
        src = f"{spec['house']} {spec['kind'].lower()} question {spec['q']}, answered {spec['date']}, {spec['annex']}"
        n = len(spec['cols'])
        # The answer's Total row: India for the district table, all High Courts (Supreme Court not included) for the other.
        rows = dict(rows, **{('india' if spec['table'] == 'district' else 'high-courts-total'): total})
        for slug, nums in rows.items():
            vals = [''] * (n - len(nums)) + nums  # blank first columns (Ladakh, 2021 and 2022)
            for (period, case_type, pending_for), v in zip(spec['cols'], vals):
                note = ''
                if spec['q'] == '3371' and pending_for == 'more-than-5-years':
                    note = NOTE_3371_5Y
                elif spec['q'] == '3295' and period in ('2021', '2022'):
                    note = NOTE_YEAR
                if spec['q'] == '3295' and slug == 'ladakh' and not v:
                    note = 'The answer leaves Ladakh blank for this year'
                if spec['q'] == '3501' and case_type == 'all' and pending_for == 'all':
                    civ, cri = int(vals[0]), int(vals[1])
                    if civ + cri != int(v):
                        note = f'In the answer, civil ({civ}) plus criminal ({cri}) does not equal the total'
                if spec['table'] == 'district':
                    district.append([slug, period, v, 'cases', case_type, pending_for, src, note])
                else:
                    jur = COURTS[slug][1] if slug in COURTS else 'all High Courts (Supreme Court not included)'
                    high.append(['india', slug, jur, period, v, 'cases', case_type, pending_for, src, note])
    print(f'  {checked} of {len(SPECS)} tables add up to their Total row in every column')
    # LS 2362 has the same values as LS 3295 for 31 Dec 2023, 2024 and 2025.
    c2362, _ = parse(a.work, dict(CHECK_2362, q='2362'))
    r3295 = parsed[('3295', 'district')]
    for slug, nums in c2362.items():
        if nums[:3] != r3295[slug][-4:-1]:
            sys.exit(f'LS 2362 and LS 3295 differ for {slug}: {nums[:3]} {r3295[slug][-4:-1]}')
    print('  LS 2362 matches LS 3295 for 2023, 2024 and 2025 in all 36 States/UTs')
    order = lambda r: (r[0], r[1], r[4], r[5], r[6])
    with open(os.path.join(a.out, 'court-pendency-district-by-state.csv'), 'w', newline='') as f:
        w = csv.writer(f, lineterminator='\n')
        w.writerow(['geography', 'period', 'value', 'unit', 'case_type', 'pending_for', 'source', 'note'])
        w.writerows(sorted(district, key=order))
    with open(os.path.join(a.out, 'court-pendency-high-courts.csv'), 'w', newline='') as f:
        w = csv.writer(f, lineterminator='\n')
        w.writerow(['geography', 'court', 'jurisdiction', 'period', 'value', 'unit', 'case_type', 'pending_for', 'source', 'note'])
        w.writerows(sorted(high, key=lambda r: (r[1], r[3], r[6], r[7], r[8])))
    print(f'court-pendency-district-by-state.csv: {len(district)} rows')
    print(f'court-pendency-high-courts.csv: {len(high)} rows')
    by = {(r[0], r[1], r[4], r[5]): r[2] for r in district}
    for key, want in ((('uttar-pradesh', '2026-07-30', 'all', 'all'), '11990328'),
                      (('lakshadweep', '2026-07-16', 'all', 'more-than-10-years'), '26'),
                      (('bihar', '2021', 'all', 'all'), '3276696')):
        if by[key] != want:
            sys.exit(f'check failed {key}: {by[key]} != {want}')
    hb = {(r[1], r[3], r[6]): r[4] for r in high if r[7] == 'all'}
    for key, want in ((('allahabad', '2026-07-30', 'all'), '1228281'), (('supreme-court', '2026-07-30', 'all'), '95954'),
                      (('madras', '2026-03-09', 'criminal'), '75555')):
        if hb[key] != want:
            sys.exit(f'check failed {key}: {hb[key]} != {want}')


if __name__ == '__main__':
    main()
