"""Read the all-India total row and the RES break-up from each CEA installed capacity report (pdftotext -layout).
First run pipeline/climate/extract_text.sh.
Run: python3 -I pipeline/climate/parse_cea.py --work work/climate [periods ...]
Writes <work>/cea_parsed.json for build_cea.py."""
import argparse, os, re, sys, json
PERIODS = ['2014-03','2015-03','2016-03','2017-03','2018-03','2019-03','2020-03','2021-03','2022-03','2023-03','2024-03','2025-03','2026-03','2026-10']
ap = argparse.ArgumentParser()
ap.add_argument('--work', default='work/climate')
ap.add_argument('periods', nargs='*', default=PERIODS)
_a = ap.parse_args()
out={}
for y in _a.periods:
    t=open(f"{_a.work}/ic_{y}.txt",errors='ignore').read().splitlines()
    i=next(k for k,l in enumerate(t) if re.search(r'^\s*ALL INDIA\s*$',l) or re.search(r'^\s*ALL INDIA\s+(State|Central|Private|Total)',l))
    tot=None
    for l in t[i-3:i+12]:
        m=re.match(r'^\s*(?:ALL INDIA\s+)?Total\s+([\d.\s]+)$',l)
        if m: tot=[float(x) for x in m.group(1).split()]; break
    # RES breakup line
    j=next(k for k,l in enumerate(t) if 'Break up of RES' in l)
    res=None
    for l in t[j:j+12]:
        nums=re.findall(r'\d+\.\d+',l)
        if len(nums)>=6 and re.match(r'^[\s\d.]+$',l): res=[float(x) for x in nums]; break
    hdr_lignite=any('Lignite' in l for l in t[:i])
    out[y]={'total_row':tot,'res':res,'lignite_col':hdr_lignite}
    print(y,hdr_lignite,tot,res)
json.dump(out,open(os.path.join(_a.work,'cea_parsed.json'),'w'),indent=1)
