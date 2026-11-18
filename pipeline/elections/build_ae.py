"""Assembly elections 2025 and 2026: seats won by party, from the ECI party-wise results pages.
First run pipeline/elections/get2026.sh (archived 2026 pages) and pipeline/elections/extract_text.sh.
Run: python3 -I pipeline/elections/build_ae.py --raw raw/elections --work work/elections --out research/data/elections"""
import argparse, re, csv, sys, os
ap = argparse.ArgumentParser()
ap.add_argument('--raw', default='raw/elections')
ap.add_argument('--work', default='work/elections', help='folder with the decompressed results pages')
ap.add_argument('--out', default='research/data/elections')
_a = ap.parse_args()
OUT = _a.out; W = os.path.join(_a.work, ''); R = os.path.join(_a.raw, '')
pages = {'delhi': (R+'eci_results_ac_feb2025_delhi_index.htm', 2025, 70), 'bihar': (W+'bihar_index.htm', 2025, 243),
         'assam': (W+'assam_2026.htm', 2026, 126), 'kerala': (W+'kerala_2026.htm', 2026, 140), 'puducherry': (W+'puducherry_2026.htm', 2026, 30),
         'tamil-nadu': (W+'tamil-nadu_2026.htm', 2026, 234), 'west-bengal': (W+'west-bengal_2026.htm', 2026, 294)}
names = {'delhi':'Delhi','bihar':'Bihar','assam':'Assam','kerala':'Kerala','puducherry':'Puducherry','tamil-nadu':'Tamil Nadu','west-bengal':'West Bengal'}
rows = []
for slug, (f, yr, total) in pages.items():
    t = open(f, encoding='utf-8', errors='replace').read()
    t = re.sub(r'<script.*?</script>|<style.*?</style>|<!--.*?-->', ' ', t, flags=re.S)
    t = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', t)).replace('&amp;', '&')
    i = t.index('Party Won Leading Total') + len('Party Won Leading Total ')
    j = t.index(' Total ', i)
    seg = t[i:j] + ' '
    tot = int(re.match(r' Total (\d+) 0 (\d+)', t[j:]).group(2))
    s = 0
    for m in re.finditer(r'(.+?) - (\S+) (\d+) 0 (\d+) ', seg):
        rows.append([slug, names[slug], yr, m.group(2), m.group(1).strip(), int(m.group(4)), total,
                     'Results declared for 293 of 294 seats on the archived page; re-poll in 144-Falta on 21 May 2026' if slug == 'west-bengal' else ''])
        s += int(m.group(4))
    assert s == tot, (slug, s, tot)
    print(slug, tot, '/', total)
with open(os.path.join(OUT, 'assembly-2025-2026-seats-by-party.csv'), 'w', newline='') as f:
    c = csv.writer(f); c.writerow(['geography','name','period','party_abbr','party_name','seats_won','assembly_seats','notes']); c.writerows(rows)
print(len(rows))
