"""Check the parsed report 33: candidate votes sum to each constituency total; print winners, seats and votes.
Usage: python3 -I pipeline/elections/check_d33.py work/elections/d33.json"""
import json, collections, sys
d = json.load(open(sys.argv[1])); rows, pcs = d['rows'], d['pcs']
bypc = collections.defaultdict(list)
for r in rows: bypc[(r['state'], r['pc'])].append(r)
bad = 0
for p in pcs:
    rs = bypc[(p['state'], p['no'])]
    s = sum(r['total'] for r in rs)
    if s != p.get('tot'): bad += 1; print('MISMATCH', p['state'], p['name'], s, p.get('tot'))
print('pc sum mismatches', bad)
cands = [r for r in rows if r['party'] != 'NOTA']
print('candidates', len(cands), collections.Counter(r['sex'] for r in cands))
win = {}
for k, rs in bypc.items():
    c = [r for r in rs if r['party'] != 'NOTA']
    w = max(c, key=lambda r: r['total']); win[k] = w
print('winners by sex', collections.Counter(w['sex'] for w in win.values()))
seats = collections.Counter(w['party'] for w in win.values())
print('seats', seats.most_common(12))
pv = collections.Counter()
for r in rows: pv[r['party']] += r['total']
allv = sum(pv.values()); valid_ex_nota = allv - pv['NOTA']
print('all votes incl NOTA', allv, 'excl NOTA', valid_ex_nota, 'NOTA', pv['NOTA'])
print('electors', sum(p['electors'] for p in pcs))
for k in ['BJP','INC','AAAP','BSP','CPI(M)','NPEP','SP','AITC']: print(k, pv[k])
