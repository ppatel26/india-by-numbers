"""Lok Sabha turnout, electors, women candidates and MPs (MoSPI Women and Men in India 2025, transcribed) and
NOTA by state (ECI report 33). First run pipeline/elections/extract_text.sh.
Run: python3 -I pipeline/elections/build_elections.py --work work/elections --out research/data/elections"""
import argparse, csv, json, collections, sys, os
ap = argparse.ArgumentParser()
ap.add_argument('--work', default='work/elections', help='folder with d33.json')
ap.add_argument('--out', default='research/data/elections')
ap.add_argument('--geo', default='research/data/geography.csv')
_a = ap.parse_args()
OUT = _a.out; D33 = os.path.join(_a.work, 'd33.json')
SLUG = {
 'Andaman & Nicobar Islands':'andaman-nicobar','Andhra Pradesh':'andhra-pradesh','Arunachal Pradesh':'arunachal-pradesh','Assam':'assam',
 'Bihar':'bihar','Chandigarh':'chandigarh','Chhattisgarh':'chhattisgarh','Dadra & Nagar Haveli and Daman & Diu':'dnh-dd','Delhi':'delhi',
 'NCT OF Delhi':'delhi','Goa':'goa','Gujarat':'gujarat','Haryana':'haryana','Himachal Pradesh':'himachal-pradesh','Jammu & Kashmir':'jammu-kashmir',
 'Jammu and Kashmir':'jammu-kashmir','Jharkhand':'jharkhand','Karnataka':'karnataka','Kerala':'kerala','Ladakh':'ladakh','Lakshadweep':'lakshadweep',
 'Madhya Pradesh':'madhya-pradesh','Maharashtra':'maharashtra','Manipur':'manipur','Meghalaya':'meghalaya','Mizoram':'mizoram','Nagaland':'nagaland',
 'Odisha':'odisha','Puducherry':'puducherry','Punjab':'punjab','Rajasthan':'rajasthan','Sikkim':'sikkim','Tamil Nadu':'tamil-nadu','Telangana':'telangana',
 'Tripura':'tripura','Uttar Pradesh':'uttar-pradesh','Uttarakhand':'uttarakhand','West Bengal':'west-bengal','India':'india'}
geo = {r['slug']: r['name'] for r in csv.DictReader(open(_a.geo))}
def w(name, header, rows):
    with open(os.path.join(OUT, name), 'w', newline='') as f:
        c = csv.writer(f); c.writerow(header); c.writerows(rows)
    print(name, len(rows))

# MoSPI Women and Men in India 2025, Table 5.6 (transcribed from page 235)
t56 = """1952,,,173.2,,,61.2
1957,,,193.7,,,62.2
1962,113.9,102.4,216.4,62.0,46.6,55.4
1967,129.6,119.4,249.0,66.7,55.5,61.3
1971,143.6,130.6,274.2,,,55.3
1977,167.0,154.2,321.2,65.6,54.9,60.5
1980,185.2,170.3,355.6,62.2,51.2,56.9
1984,208.0,192.3,400.3,68.4,59.2,63.6
1989,262.0,236.9,498.9,66.1,57.3,62.0
1991,261.8,234.5,498.4,61.6,51.4,56.7
1996,309.8,282.8,592.6,62.1,53.4,57.9
1998,316.7,289.2,605.9,65.7,57.9,62.0
1999,323.8,295.7,619.5,63.9,55.6,59.9
2004,349.5,322.0,671.5,62.2,53.6,58.1
2009,374.7,342.2,716.9,60.3,55.8,58.1
2014,437.0,397.0,834.1,67.1,65.6,66.4
2019,473.4,438.5,911.9,67.0,67.2,67.4
2024,502.4,475.5,978.0,65.6,65.8,65.7"""
LS = {1952:'1st',1957:'2nd',1962:'3rd',1967:'4th',1971:'5th',1977:'6th',1980:'7th',1984:'8th',1989:'9th',1991:'10th',1996:'11th',1998:'12th',1999:'13th',2004:'14th',2009:'15th',2014:'16th',2019:'17th',2024:'18th'}
tr, el = [], []
for ln in t56.splitlines():
    y, em, ef, et, tm, tf, tt = ln.split(',')
    y = int(y)
    note = 'Total calculated on valid votes polled; no sex-wise break-up' if y in (1952, 1957) else ('No sex-wise break-up' if y == 1971 else '')
    if y >= 2014: note = 'Total includes third gender (others)'
    for s, v in (('total', tt), ('men', tm), ('women', tf)):
        tr.append(['india', y, LS[y], s, v, 'percent of electors', note if (v or s=='total') else 'not published'])
    gap = '' if not (tm and tf) else f"{float(tf)-float(tm):.1f}"
    tr.append(['india', y, LS[y], 'gap_women_minus_men', gap, 'percentage points', 'Derived: women minus men' if gap else 'not published'])
    for s, v in (('total', et), ('men', em), ('women', ef)):
        el.append(['india', y, LS[y], s, v, 'million electors', note.replace('Total calculated on valid votes polled; ', '') if note else ''])
w('lok-sabha-turnout-by-sex.csv', ['geography','period','lok_sabha','series','value','unit','notes'], tr)
w('lok-sabha-electors.csv', ['geography','period','lok_sabha','series','value','unit','notes'], el)

# Table 5.2 (page 230)
t52 = """1952,489,1874,,,,,,
1957,494,1518,1473,467,31.7,45,27,60.0
1962,494,1985,1915,459,24.0,70,35,50.0
1967,520,2369,2302,490,21.3,67,30,44.8
1971,520,2784,2698,499,18.5,86,21,24.4
1977,542,2439,2369,523,22.1,70,19,27.1
1980,542,4620,4478,514,11.5,142,28,19.7
1984,542,5574,5406,500,9.2,164,42,25.6
1989,529,6160,5962,502,8.4,198,27,13.6
1991,521,8699,8374,484,5.8,325,37,11.4
1996,543,13952,13353,503,3.8,599,40,6.7
1998,543,4750,4476,500,11.2,274,43,15.7
1999,543,5155,4859,494,10.2,296,52,17.6
2004,543,5435,5080,498,9.8,355,45,12.7
2009,543,8070,7514,484,6.4,556,59,10.6
2014,543,8251,7583,481,6.3,668,62,9.3
2019,543,8054,7322,465,6.4,726,78,10.7
2024,542,8359,7553,468,6.2,800,74,9.3"""
rows = []
for ln in t52.splitlines():
    y, seats, tot, mc, me, mp, fc, fe, fp = ln.split(',')
    y = int(y); n = ''
    if y == 1952: n = 'Sex-wise break-up of candidates not available'
    if y == 1999: n = 'As published: men elected + women elected = 546, more than the 543 seats'
    if y == 2024: n = 'Total contesting includes 6 third gender candidates; 542 seats (Surat elected unopposed)'
    vals = [('seats_available', seats, 'seats'), ('candidates_total', tot, 'candidates'), ('candidates_men', mc, 'candidates'),
            ('candidates_women', fc, 'candidates'), ('elected_men', me, 'members'), ('elected_women', fe, 'members'),
            ('success_rate_men', mp, 'percent of candidates elected'), ('success_rate_women', fp, 'percent of candidates elected')]
    for s, v, u in vals: rows.append(['india', y, LS[y], s, v, u, n])
    if fe:
        rows.append(['india', y, LS[y], 'women_share_of_elected', f"{100*int(fe)/(int(fe)+int(me)):.1f}", 'percent of members elected', 'Derived: women elected / (men + women elected)'])
        rows.append(['india', y, LS[y], 'women_share_of_candidates', f"{100*int(fc)/int(tot):.1f}", 'percent of candidates', 'Derived: women candidates / total candidates'])
w('lok-sabha-women-candidates-and-mps.csv', ['geography','period','lok_sabha','series','value','unit','notes'], rows)

# Table 5.7 (pages 236-237), thousands
t57 = """Andaman & Nicobar Islands,151,96,63.75,316,203,64.16
Andhra Pradesh,21059,16911,80.30,41402,33859,81.78
Arunachal Pradesh,454,361,79.42,898,728,81.07
Assam,12246,10006,81.71,24572,20118,81.87
Bihar,36748,21847,59.45,77260,43481,56.28
Chandigarh,318,214,67.22,661,449,68.03
Chhattisgarh,10420,7525,72.22,20679,15083,72.94
Dadra & Nagar Haveli and Daman & Diu,201,146,72.73,417,298,71.44
Delhi,6990,4071,58.24,15215,8944,58.78
Goa,608,466,76.66,1180,908,76.99
Gujarat,23320,13189,56.55,48010,29162,60.74
Haryana,9429,5982,63.45,20188,13076,64.77
Himachal Pradesh,2799,2030,72.55,5712,4081,71.45
Jammu & Kashmir,4276,2410,56.36,8802,5163,58.65
Jharkhand,12689,8712,68.66,25878,17279,66.77
Karnataka,27356,19192,70.16,54772,38835,70.90
Kerala,14336,10303,71.86,27807,20033,72.04
Ladakh,92,67,72.81,191,136,71.19
Lakshadweep,29,24,85.46,58,49,84.98
Madhya Pradesh,27526,17680,64.23,56669,37972,67.01
Maharashtra,44629,26350,59.04,93062,57248,61.52
Manipur,1049,826,78.72,2051,1606,78.28
Meghalaya,1127,888,78.74,2230,1715,76.89
Mizoram,442,246,55.66,861,492,57.10
Nagaland,661,383,57.89,1325,767,57.84
Odisha,16616,12555,75.56,33717,25214,74.78
Puducherry,543,430,79.13,1024,811,79.24
Punjab,10177,6336,62.26,21567,13543,62.79
Rajasthan,25633,15561,60.71,53508,33212,62.07
Sikkim,232,185,79.63,467,389,83.26
Tamil Nadu,31722,22159,69.86,62405,43769,70.14
Telangana,16701,10903,65.28,33232,22032,66.30
Tripura,1424,1147,80.56,2871,2349,81.82
Uttar Pradesh,72056,41229,57.22,154403,87998,56.99
Uttarakhand,4023,2356,58.56,8431,4864,57.69
West Bengal,37399,29979,80.16,76125,60555,79.55
India,475480,312764,65.78,977966,646421,66.10"""
rows = []; bad = []
for ln in t57.splitlines():
    st, we, wv, wt, te, tv, tt = ln.split(',')
    slug = SLUG[st]
    # transcription check: ratio of thousands should be within 0.6 points of published %
    for a, b, p in ((wv, we, wt), (tv, te, tt)):
        if abs(100*int(a)/int(b) - float(p)) > 0.6: bad.append((st, a, b, p))
    n = 'Excludes Surat PC (elected unopposed)' if slug in ('gujarat', 'india') else ''
    for s, v, u in (('turnout_total', tt, 'percent of electors'), ('turnout_women', wt, 'percent of women electors'),
                    ('electors_total', te, 'thousand electors'), ('voters_total', tv, 'thousand voters'),
                    ('electors_women', we, 'thousand electors'), ('voters_women', wv, 'thousand voters')):
        rows.append([slug, geo.get(slug, 'India'), 2024, s, v, u, n])
print('t57 ratio check failures', bad)
assert len({r[0] for r in rows}) == 37
w('lok-sabha-2024-turnout-by-state.csv', ['geography','name','period','series','value','unit','notes'], rows)

# Table 5.3 (page 231)
t53 = """Andaman & Nicobar Islands,0,1,0
Andhra Pradesh,3,25,12
Arunachal Pradesh,0,2,0
Assam,1,14,7
Bihar,5,40,13
Chandigarh,0,1,0
Chhattisgarh,3,11,27
Dadra & Nagar Haveli and Daman & Diu,1,2,50
Delhi,2,7,29
Goa,0,2,0
Gujarat,4,26,15
Haryana,1,10,10
Himachal Pradesh,1,4,25
Jammu & Kashmir,0,5,0
Jharkhand,2,14,14
Karnataka,3,28,11
Kerala,0,20,0
Ladakh,0,1,0
Lakshadweep,0,1,0
Madhya Pradesh,6,29,21
Maharashtra,7,48,15
Manipur,0,2,0
Meghalaya,0,2,0
Mizoram,0,1,0
Nagaland,0,1,0
Odisha,4,21,19
Puducherry,0,1,0
Punjab,1,13,8
Rajasthan,3,25,12
Sikkim,0,1,0
Tamil Nadu,5,39,13
Telangana,2,17,12
Tripura,1,2,50
Uttar Pradesh,7,80,9
Uttarakhand,1,5,20
West Bengal,11,42,26
India,74,543,13.62"""
rows = []; sw = ss = 0
for ln in t53.splitlines():
    st, wm, seats, pct = ln.split(',')
    slug = SLUG[st]
    if slug != 'india': sw += int(wm); ss += int(seats)
    for s, v, u in (('seats', seats, 'seats'), ('women_mps', wm, 'members'), ('women_share', pct, 'percent of seats')):
        rows.append([slug, geo.get(slug, 'India'), 2024, s, v, u, 'Lok Sabha Secretariat, as on 20.12.2024'])
print('t53 sums', sw, ss)
w('lok-sabha-2024-seats-and-women-mps-by-state.csv', ['geography','name','period','series','value','unit','notes'], rows)

# ECI Report 33: NOTA by state and party votes
d = json.load(open(D33)); cr = d['rows']; pcs = d['pcs']
nota = collections.Counter(); allv = collections.Counter(); elec = collections.Counter()
for r in cr:
    s = SLUG[r['state']]; allv[s] += r['total']; allv['india'] += r['total']
    if r['party'] == 'NOTA': nota[s] += r['total']; nota['india'] += r['total']
for p in pcs: elec[SLUG[p['state']]] += p['electors']; elec['india'] += p['electors']
rows = []
for s in sorted(allv, key=lambda k: (k != 'india', k)):
    n = 'Computed from ECI Report 33 (542 PCs; excludes Surat)' if s in ('gujarat', 'india') else 'Computed from ECI Report 33'
    rows.append([s, geo.get(s, 'India'), 2024, 'nota_votes', nota[s], 'votes', n])
    rows.append([s, geo.get(s, 'India'), 2024, 'nota_share', f"{100*nota[s]/allv[s]:.2f}", 'percent of votes counted (valid votes plus NOTA)', n])
w('lok-sabha-2024-nota-by-state.csv', ['geography','name','period','series','value','unit','notes'], rows)
print('NOTA india', nota['india'], allv['india'], 100*nota['india']/allv['india'])
