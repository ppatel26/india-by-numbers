"""Lok Sabha 2024 seats and votes by party, from ECI report 33 (votes) and the ECI party-wise results page (seats).
First run pipeline/elections/extract_text.sh.
Run: python3 -I pipeline/elections/build_party.py --raw raw/elections --work work/elections --out research/data/elections"""
import argparse, json, collections, re, sys, csv, os
ap = argparse.ArgumentParser()
ap.add_argument('--raw', default='raw/elections')
ap.add_argument('--work', default='work/elections', help='folder with d33.json')
ap.add_argument('--out', default='research/data/elections')
_a = ap.parse_args()
OUT, D33, IDX = _a.out, os.path.join(_a.work, 'd33.json'), os.path.join(_a.raw, 'eci_results_pc2024_index.htm')
d = json.load(open(D33)); pv = collections.Counter()
for r in d['rows']: pv[r['party']] += r['total']
nota = pv.pop('NOTA'); valid = sum(pv.values()); assert valid == 638990692
t = open(IDX, encoding='utf-8').read(); t = re.sub(r'<[^>]+>', ' ', t); t = re.sub(r'\s+', ' ', t).replace('&amp;', '&')
seg = t[t.index('Party Won Leading Total') + len('Party Won Leading Total '):t.index('Total 543 0 543')]
seats, names = {}, {}
for m in re.finditer(r'(.+?) - (\S+) (\d+) 0 (\d+) ', seg):
    names[m.group(2)] = m.group(1).strip(); seats[m.group(2)] = int(m.group(4))
names.update({'BSP': 'Bahujan Samaj Party', 'BJD': 'Biju Janata Dal', 'ADMK': 'All India Anna Dravida Munnetra Kazhagam'})
pub = {'BJP': '36.93', 'INC': '21.4', 'BSP': '2.06', 'CPI(M)': '1.78', 'AAAP': '1.12', 'NPEP': '0.07'}
keep = [p for p, v in pv.most_common() if p != 'IND' and (100*v/valid >= 1 or seats.get(p, 0) >= 5)]
rows = []
for p in keep:
    share = pub.get(p) or f"{100*pv[p]/valid:.2f}"
    basis = 'published in ECI Report 20' if p in pub else 'computed from ECI Report 33'
    rows.append(['india', 2024, p, names[p], seats.get(p, 0), pv[p], share, f'Vote share {basis}'])
rows.append(['india', 2024, 'IND', 'Independent', seats['IND'], pv['IND'], f"{100*pv['IND']/valid:.2f}", 'Vote share computed from ECI Report 33'])
oth = [p for p in pv if p not in keep and p != 'IND']
os_seats = sum(seats.get(p, 0) for p in oth); ov = sum(pv[p] for p in oth)
rows.append(['india', 2024, 'OTHERS', f'All other parties ({len(oth)})', os_seats, ov, f"{100*ov/valid:.2f}", 'Vote share computed from ECI Report 33'])
assert sum(r[4] for r in rows) == 543 and sum(r[5] for r in rows) == valid
with open(os.path.join(OUT, 'lok-sabha-2024-party-results.csv'), 'w', newline='') as f:
    c = csv.writer(f); c.writerow(['geography','period','party_abbr','party_name','seats_won','votes','vote_share_pct','notes']); c.writerows(rows)
for r in rows: print(r)
print('others parties', len(oth), 'NOTA', nota)
