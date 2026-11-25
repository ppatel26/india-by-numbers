"""Build the NCRB CSVs of the crime topic: Crime in India (CII) and Prison Statistics India (PSI).

Reads the text that pipeline/crime/extract_text.sh makes from the NCRB PDFs (one page per form feed).
Keeps NCRB's digits. Computes no rate. The only derived value is the undertrial share of prisoners
for years where NCRB prints the counts but not the share (marked `derived`).

Usage: python3 -I pipeline/crime/build_ncrb.py [--work work/crime] [--out research/data/crime]
"""
import argparse
import csv
import os
import re
import sys

# The State/UT order of every CII and PSI state table since CII 2020 and PSI 2020.
ORDER = [
    'andhra-pradesh', 'arunachal-pradesh', 'assam', 'bihar', 'chhattisgarh', 'goa', 'gujarat', 'haryana',
    'himachal-pradesh', 'jharkhand', 'karnataka', 'kerala', 'madhya-pradesh', 'maharashtra', 'manipur',
    'meghalaya', 'mizoram', 'nagaland', 'odisha', 'punjab', 'rajasthan', 'sikkim', 'tamil-nadu', 'telangana',
    'tripura', 'uttar-pradesh', 'uttarakhand', 'west-bengal', 'andaman-nicobar', 'chandigarh', 'dnh-dd',
    'delhi', 'jammu-kashmir', 'ladakh', 'lakshadweep', 'puducherry',
]
# The first word of the name NCRB prints for each slug. D&N Haveli often wraps onto the line above.
NAME = dict(zip(ORDER, [
    'andhra', 'arunachal', 'assam', 'bihar', 'chhattisgarh', 'goa', 'gujarat', 'haryana', 'himachal', 'jharkhand',
    'karnataka', 'kerala', 'madhya', 'maharashtra', 'manipur', 'meghalaya', 'mizoram', 'nagaland', 'odisha',
    'punjab', 'rajasthan', 'sikkim', 'tamil', 'telangana', 'tripura', 'uttar', 'uttarakhand', 'west', 'a',
    'chandigarh', '', 'delhi', 'jammu', 'ladakh', 'lakshadweep', 'puducherry',
]))
NUM = re.compile(r'^(-|-?[\d,]*\.?\d+)$')


def pages(work, path):
    with open(os.path.join(work, path), encoding='utf-8', errors='replace') as f:
        return f.read().split('\f')


def find(pg, title, part=None):
    """Index of the page whose heading is `title` (a table number), and 'Page part of n' if given."""
    for i, p in enumerate(pg):
        if re.search(r'^\s*TABLE\s*[-–]?\s*' + re.escape(title) + r'\b', p, re.M | re.I):
            if part is None or re.search(r'Page\s+%d\s+of' % part, p, re.I):
                return i
    sys.exit(f'table {title} page {part} not found')


def val(tok):
    return '' if tok == '-' else tok.replace(',', '')


def state_rows(page, ncols):
    """Map slug -> list of ncols values from one NCRB state table page, plus 'india'."""
    out = {}
    for line in page.split('\n'):
        toks = line.split()
        if not toks:
            continue
        up = line.upper()
        if 'TOTAL' in up and ('ALL INDIA' in up or 'ALL-INDIA' in up):
            nums = [t for t in toks if NUM.match(t)]
            out['india'] = [val(t) for t in nums[-ncols:]]
            continue
        if not re.match(r'^\d{1,2}$', toks[0]):
            continue
        sl = int(toks[0])
        if not 1 <= sl <= 36:
            continue
        rest = toks[1:]
        k = 0
        while k < len(rest) and not NUM.match(rest[k]):
            k += 1
        name, nums = ' '.join(rest[:k]).lower(), rest[k:]
        if len(nums) != ncols:
            continue
        slug = ORDER[sl - 1]
        if name and not name.startswith(NAME[slug]) and not (slug == 'dnh-dd' and name.startswith(('d', 'dnh'))):
            sys.exit(f'row {sl} is {name!r}, expected {slug}')
        out[slug] = [val(t) for t in nums]
    missing = [s for s in ORDER + ['india'] if s not in out]
    if missing:
        sys.exit(f'missing rows {missing} in page starting {page.strip()[:80]!r}')
    return out


def write(out, name, header, rows):
    with open(os.path.join(out, name), 'w', newline='') as f:
        w = csv.writer(f, lineterminator='\n')
        w.writerow(header)
        w.writerows(rows)
    print(f'{name}: {len(rows)} rows')


def check(label, got, want):
    if got != want:
        sys.exit(f'check failed: {label}: {got!r} != {want!r}')


GEOS = ['india'] + ORDER

# Crime in India 2024 -------------------------------------------------------------------------------


def cii_2024(work, out):
    v1 = pages(work, 'cii-2024/volume1.txt')
    v3 = pages(work, 'cii-2024/volume3.txt')
    t11 = state_rows(v1[find(v1, '1A.1')], 8)    # 2022, 2023, IPC, BNS, total 2024, pop, rate, CS rate
    t13 = state_rows(v1[find(v1, '1A.3')], 6)    # 2022, 2023, 2024, pop, rate, CS rate
    t2a = state_rows(v1[find(v1, '2A.1')], 6)
    t3a = state_rows(v1[find(v1, '3A.1')], 6)
    p1 = state_rows(v3[find(v3, '17A.2', 1)], 5)  # col 3-7
    p3 = state_rows(v3[find(v3, '17A.2', 3)], 6)  # col 13-18
    p4 = state_rows(v3[find(v3, '17A.2', 4)], 6)  # col 19-24
    c1 = state_rows(v3[find(v3, '18A.2', 1)], 5)  # col 3-7
    c3 = state_rows(v3[find(v3, '18A.2', 3)], 5)  # col 13-17
    c4 = state_rows(v3[find(v3, '18A.2', 4)], 5)  # col 18-22

    rate = 'cognizable crimes per lakh population'
    rows = []
    for g in GEOS:
        a, b = t13[g], t11[g]
        for i, y in enumerate(('2022', '2023', '2024')):
            rows.append([g, y, 'cases', 'ipc-bns-sll', a[i], 'cases', 'Table 1A.3'])
        for i, y in enumerate(('2022', '2023')):
            rows.append([g, y, 'cases', 'ipc-bns', b[i], 'cases', 'Table 1A.1'])
        rows.append([g, '2024', 'cases', 'ipc', b[2], 'cases', 'Table 1A.1'])
        rows.append([g, '2024', 'cases', 'bns', b[3], 'cases', 'Table 1A.1'])
        rows.append([g, '2024', 'cases', 'ipc-bns', b[4], 'cases', 'Table 1A.1'])
        rows.append([g, '2024', 'crime-rate', 'ipc-bns-sll', a[4], rate, 'Table 1A.3'])
        rows.append([g, '2024', 'crime-rate', 'ipc-bns', b[6], rate, 'Table 1A.1'])
        rows.append([g, '2024', 'mid-year-population', '', a[3], 'lakh persons', 'Table 1A.3'])
        check(f'{g} population 1A.1 = 1A.3', b[5], a[3])
    write(out, 'crime-by-state-2024.csv', ['geography', 'period', 'indicator', 'law', 'value', 'unit', 'table'], rows)
    check('India total cognizable crime rate 2024', t13['india'][4], '418.9')
    check('Kerala total cognizable crime rate 2024', t13['kerala'][4], '1389.0')
    check('Nagaland total cognizable crime rate 2024', t13['nagaland'][4], '61.6')

    rows = []
    for g in GEOS:
        a = t2a[g]
        for i, y in enumerate(('2022', '2023', '2024')):
            rows.append([g, y, 'cases', a[i], 'cases', 'Table 2A.1'])
        rows.append([g, '2024', 'murder-rate', a[4], 'murder cases per lakh population', 'Table 2A.1'])
        rows.append([g, '2024', 'chargesheeting-rate', a[5], 'percent', 'Table 2A.1'])
    write(out, 'murder-by-state-2024.csv', ['geography', 'period', 'indicator', 'value', 'unit', 'table'], rows)
    check('India murders 2024', t2a['india'][2], '27049')
    check('Jharkhand murder rate 2024', t2a['jharkhand'][4], '3.7')
    check('Uttar Pradesh murders 2024', t2a['uttar-pradesh'][2], '3218')

    rows = []
    for g in GEOS:
        a = t3a[g]
        for i, y in enumerate(('2022', '2023', '2024')):
            rows.append([g, y, 'cases', a[i], 'cases', 'Table 3A.1'])
        rows.append([g, '2024', 'crime-rate', a[4], 'crimes against women per lakh women', 'Table 3A.1'])
        rows.append([g, '2024', 'female-population', a[3], 'lakh women', 'Table 3A.1'])
        rows.append([g, '2024', 'chargesheeting-rate', a[5], 'percent', 'Table 3A.1'])
    write(out, 'crimes-against-women-by-state-2024.csv', ['geography', 'period', 'indicator', 'value', 'unit', 'table'], rows)
    check('India crimes against women rate 2024', t3a['india'][4], '64.6')
    check('Telangana crimes against women rate 2024', t3a['telangana'][4], '128.6')
    check('Delhi crimes against women 2024', t3a['delhi'][2], '13396')

    rows = []
    for g in GEOS:
        check(f'{g} charge-sheeting rate 17A.2 = 1A.1', p4[g][4], t11[g][7])
        rows += [
            [g, '2024', 'police', 'cases-for-investigation', p1[g][3], 'cases', 'Table 17A.2, col. 6'],
            [g, '2024', 'police', 'cases-chargesheeted', p3[g][5], 'cases', 'Table 17A.2, col. 18'],
            [g, '2024', 'police', 'cases-disposed-by-police', p4[g][0], 'cases', 'Table 17A.2, col. 19'],
            [g, '2024', 'police', 'cases-pending-investigation-at-year-end', p4[g][3], 'cases', 'Table 17A.2, col. 22'],
            [g, '2024', 'police', 'chargesheeting-rate', p4[g][4], 'percent', 'Table 17A.2, col. 23'],
            [g, '2024', 'courts', 'cases-for-trial', c1[g][2], 'cases', 'Table 18A.2, col. 5'],
            [g, '2024', 'courts', 'cases-convicted', c3[g][2], 'cases', 'Table 18A.2, col. 15'],
            [g, '2024', 'courts', 'trials-completed', c4[g][0], 'cases', 'Table 18A.2, col. 18'],
            [g, '2024', 'courts', 'cases-pending-trial-at-year-end', c4[g][2], 'cases', 'Table 18A.2, col. 20'],
            [g, '2024', 'courts', 'conviction-rate', c4[g][3], 'percent', 'Table 18A.2, col. 21'],
            [g, '2024', 'courts', 'pendency-percentage', c4[g][4], 'percent', 'Table 18A.2, col. 22'],
        ]
    write(out, 'police-and-court-disposal-by-state-2024.csv',
          ['geography', 'period', 'stage', 'indicator', 'value', 'unit', 'table'], rows)
    check('India charge-sheeting rate 2024', p4['india'][4], '72.1')
    check('India conviction rate 2024', c4['india'][3], '53.3')
    check('West Bengal conviction rate 2024', c4['west-bengal'][3], '7.1')

    # At a glance: IPC (from 2024 IPC and BNS) crimes, 1981 to 2024, page x of Volume I.
    glance = next(p for p in v1 if 'At a glance' in p and '1981' in p)
    rows = []
    for m in re.finditer(r'\b\d{1,2}\s+((?:19|20)\d\d)\s+(\d{6,7})\s+(\d+\.\d)\s+(\d+\.\d)', glance):
        y, inc, rt, cs = m.groups()
        law = 'ipc-bns' if y == '2024' else 'ipc'
        rows += [['india', y, 'cases', law, inc, 'cases'],
                 ['india', y, 'crime-rate', law, rt, 'IPC/BNS crimes per lakh population'],
                 ['india', y, 'chargesheeting-rate', law, cs, 'percent']]
    rows.sort(key=lambda r: (r[1], r[2]))
    check('At a glance years', len(rows), 44 * 3)
    write(out, 'ipc-crimes-india-1981-2024.csv', ['geography', 'period', 'indicator', 'law', 'value', 'unit'], rows)
    by = {(r[1], r[2]): r[4] for r in rows}
    check('1981 IPC crime rate', by[('1981', 'crime-rate')], '200.8')
    check('2020 IPC crime rate', by[('2020', 'crime-rate')], '314.3')
    check('2024 IPC/BNS cases', by[('2024', 'cases')], '3544608')


# Crime in India, India series from each edition ----------------------------------------------------

POP_BASE = {
    2017: 'Registrar General of India estimated population of 2017 (Table 2A.1 note: based on 2001 Census)',
    2018: 'Technical Group on Population Projections, November 2019, National Commission on Population, MoHFW',
    2019: 'Technical Group on Population Projections, November 2019, National Commission on Population, MoHFW',
}
JULY_2020 = 'Technical Group on Population Projections, July 2020, National Commission on Population, MoHFW'


def india_row(page):
    for line in page.split('\n'):
        if 'TOTAL ALL INDIA' in line.upper():
            return [val(t) for t in line.split() if NUM.match(t)]
    sys.exit('no India row')


def cii_trend(work, out):
    t11, murder, women = {}, {}, {}
    for ed in range(2017, 2025):
        pg = pages(work, f'cii-{ed}/volume1.txt')
        p = pg[find(pg, '1.1')]
        for m in re.finditer(r'^\s*\d\s+(20\d\d)\s+([\d.]+)\s+(\d+)\s+(\d+)\s+(\d+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*$', p, re.M):
            t11.setdefault(int(m.group(1)), {})[ed] = m.groups()[1:]
        for store, tb in ((murder, '2A.1'), (women, '3A.1')):
            r = india_row(pg[find(pg, tb)])
            cases = r[:3]
            pop, rt = (r[4], r[5]) if ed <= 2019 else (r[3], r[4])
            for k, y in enumerate(range(ed - 2, ed + 1)):
                store.setdefault(y, {})[ed] = (cases[k], pop if y == ed else None, rt if y == ed else None)
    rows = []
    for y in sorted(t11):
        ed = max(t11[y])  # the latest edition that prints the year carries NCRB's revisions
        pop, ipc, sll, tot, r_ipc, r_sll, r_tot, _ = t11[y][ed]
        base = POP_BASE.get(y, JULY_2020) if y >= 2017 else 'not stated: the edition reprints the population of CII ' + str(y)
        tb = f'CII {ed}, Table 1.1'
        rows += [
            ['india', str(y), 'all-cognizable', 'cases', 'ipc-bns-sll', tot, 'cases', ed, tb, ''],
            ['india', str(y), 'all-cognizable', 'cases', 'ipc-bns', ipc, 'cases', ed, tb, ''],
            ['india', str(y), 'all-cognizable', 'cases', 'sll', sll, 'cases', ed, tb, ''],
            ['india', str(y), 'all-cognizable', 'crime-rate', 'ipc-bns-sll', r_tot, 'cognizable crimes per lakh population', ed, tb, base],
            ['india', str(y), 'all-cognizable', 'crime-rate', 'ipc-bns', r_ipc, 'cognizable crimes per lakh population', ed, tb, base],
            ['india', str(y), 'all-cognizable', 'crime-rate', 'sll', r_sll, 'cognizable crimes per lakh population', ed, tb, base],
            ['india', str(y), 'all-cognizable', 'mid-year-population', '', pop, 'lakh persons', ed, tb, base],
        ]
    for head, store, tb, unit in (('murder', murder, '2A.1', 'murder cases per lakh population'),
                                  ('crimes-against-women', women, '3A.1', 'crimes against women per lakh women')):
        for y in sorted(store):
            ed = max(store[y])
            rows.append(['india', str(y), head, 'cases', '', store[y][ed][0], 'cases', ed, f'CII {ed}, Table {tb}', ''])
            if y in store[y]:  # the rate is printed only in the year's own edition
                _, pop, rt = store[y][y]
                base = POP_BASE.get(y, JULY_2020)
                rows.append(['india', str(y), head, 'crime-rate', '', rt, unit, y, f'CII {y}, Table {tb}', base])
                if head == 'crimes-against-women':
                    rows.append(['india', str(y), head, 'female-population', '', pop, 'lakh women', y, f'CII {y}, Table {tb}', base])
    rows.sort(key=lambda r: (r[2] != 'all-cognizable', r[2], r[1], r[3], r[4]))
    write(out, 'crime-india-trend.csv', ['geography', 'period', 'crime_head', 'indicator', 'law', 'value', 'unit',
                                         'edition', 'table', 'population_base'], rows)
    by = {(r[1], r[2], r[3], r[4]): r[5] for r in rows}
    check('2015 total cognizable rate', by[('2015', 'all-cognizable', 'crime-rate', 'ipc-bns-sll')], '374.1')
    check('2020 total cognizable rate', by[('2020', 'all-cognizable', 'crime-rate', 'ipc-bns-sll')], '487.8')
    check('2017 murder rate', by[('2017', 'murder', 'crime-rate', '')], '2.2')
    check('2019 murders (CII 2021)', by[('2019', 'murder', 'cases', '')], '28915')
    check('2021 crimes against women rate', by[('2021', 'crimes-against-women', 'crime-rate', '')], '64.5')


# Prison Statistics India ---------------------------------------------------------------------------


def psi_2024(work, out):
    pg = pages(work, 'psi-2024/report-revised.txt')
    occ = state_rows(pg[find(pg, '1.2')], 12)   # capacity M F Tr T, inmates M F Tr T, occupancy M F Tr T
    i1 = find(pg, '2.1')
    types1 = state_rows(pg[i1], 8)             # convicts M F Tr T, undertrials M F Tr T
    types2 = state_rows(pg[i1 + 1], 9)         # detenues, others, total
    share = state_rows(pg[find(pg, '2.2')], 5)  # convicts, undertrials, detenues, others, total
    rows = []
    sexes = ('male', 'female', 'transgender', 'total')
    for g in GEOS:
        o = occ[g]
        for k, s in enumerate(sexes):
            rows.append([g, '2024', '2024-12-31', 'capacity', s, o[k], 'inmates', 'Table 1.2'])
            rows.append([g, '2024', '2024-12-31', 'inmates', s, o[4 + k], 'inmates', 'Table 1.2'])
            rows.append([g, '2024', '2024-12-31', 'occupancy-rate', s, o[8 + k], 'percent', 'Table 1.2'])
        rows.append([g, '2024', '2024-12-31', 'convicts', 'total', types1[g][3], 'inmates', 'Table 2.1'])
        rows.append([g, '2024', '2024-12-31', 'undertrials', 'total', types1[g][7], 'inmates', 'Table 2.1'])
        rows.append([g, '2024', '2024-12-31', 'detenues', 'total', types2[g][3], 'inmates', 'Table 2.1'])
        rows.append([g, '2024', '2024-12-31', 'undertrial-share', 'total', share[g][1], 'percent of all inmates', 'Table 2.2'])
        rows.append([g, '2024', '2024-12-31', 'convict-share', 'total', share[g][0], 'percent of all inmates', 'Table 2.2'])
        check(f'{g} inmates 1.2 = 2.1', o[7], types2[g][8])
    write(out, 'prisons-by-state-2024.csv', ['geography', 'period', 'as_on', 'indicator', 'sex', 'value', 'unit', 'table'], rows)
    check('India occupancy 2024', occ['india'][11], '112.2')
    check('Delhi occupancy 2024', occ['delhi'][11], '194.6')
    check('Bihar undertrial share 2024', share['bihar'][1], '87.2')

    # The report first released on 6 May 2026 used West Bengal's 2023 data. Print its values for the README.
    og = pages(work, 'psi-2024/report-original.txt')
    o_occ = state_rows(og[find(og, '1.2')], 12)
    o_share = state_rows(og[find(og, '2.2')], 5)
    for g in ('west-bengal', 'india'):
        print(f'  original release, {g}: inmates {o_occ[g][7]}, occupancy {o_occ[g][11]}, undertrial share {o_share[g][1]}')


def psi_trend(work, out):
    occ, demo = {}, {}
    for ed in range(2016, 2025):
        t = open(os.path.join(work, f'psi-{ed}/executive-summary.txt'), encoding='utf-8', errors='replace').read()
        for m in re.finditer(r'^\s*(20\d\d)#?\s+([\d,]+)#?\s+([\d,]+)\s+([\d,]+)\s+([\d.]+)\s*%', t, re.M):
            occ.setdefault(int(m.group(1)), {})[ed] = [g.replace(',', '') for g in m.groups()[1:]]
        for m in re.finditer(r'^\s*(20\d\d)#?\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)\s+([\d,]+)\s*$', t, re.M):
            demo.setdefault(int(m.group(1)), {})[ed] = [g.replace(',', '') for g in m.groups()[1:]]
    rows = []
    for y in sorted(occ):
        ed = max(occ[y])
        src = f'PSI {ed}, Executive Summary'
        prisons, cap, inm, rate = occ[y][ed]
        de = max(demo[y])
        conv, ut, det, oth, tot = demo[y][de]
        check(f'{y} inmates in both tables', tot, inm)
        share = f'{100 * int(ut) / int(tot):.1f}'
        rows += [
            ['india', str(y), f'{y}-12-31', 'prisons', prisons, 'prisons', ed, src, ''],
            ['india', str(y), f'{y}-12-31', 'capacity', cap, 'inmates', ed, src, ''],
            ['india', str(y), f'{y}-12-31', 'inmates', inm, 'inmates', ed, src, ''],
            ['india', str(y), f'{y}-12-31', 'occupancy-rate', rate, 'percent', ed, src, ''],
            ['india', str(y), f'{y}-12-31', 'convicts', conv, 'inmates', de, src, ''],
            ['india', str(y), f'{y}-12-31', 'undertrials', ut, 'inmates', de, src, ''],
            ['india', str(y), f'{y}-12-31', 'undertrial-share', share, 'percent of all inmates', de, src,
             'derived: undertrials / inmates x 100, one decimal'],
        ]
    write(out, 'prisons-india-trend.csv', ['geography', 'period', 'as_on', 'indicator', 'value', 'unit', 'edition', 'source', 'note'], rows)
    by = {(r[1], r[3]): r[4] for r in rows}
    check('2014 occupancy', by[('2014', 'occupancy-rate')], '117.4')
    check('2022 occupancy', by[('2022', 'occupancy-rate')], '131.4')
    check('2024 undertrial share (published 72.5 in PSI 2024 Table 2.2)', by[('2024', 'undertrial-share')], '72.5')


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--work', default='work/crime')
    ap.add_argument('--out', default='research/data/crime')
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    cii_2024(a.work, a.out)
    cii_trend(a.work, a.out)
    psi_2024(a.work, a.out)
    psi_trend(a.work, a.out)


if __name__ == '__main__':
    main()
