"""State-wise renewable capacity on 31 Oct 2026, from the word boxes of the MNRE PDF (pdftotext -bbox).
First run pipeline/climate/extract_text.sh.
Run: python3 -I pipeline/climate/build_mnre.py --work work/climate --out research/data/climate"""
import argparse, os, re, csv, sys
ap = argparse.ArgumentParser()
ap.add_argument('--work', default='work/climate')
ap.add_argument('--out', default='research/data/climate')
ap.add_argument('--geo', default='research/data/geography.csv')
_a = ap.parse_args()
h=open(os.path.join(_a.work, 'mnre_bbox.html')).read(); geo=_a.geo; out=_a.out
ws=[(float(a),float(b),float(c),float(d),t) for a,b,c,d,t in re.findall(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)</word>',h)]
cols={225:'solar_ground_mounted',262:'solar_rooftop',299:'solar_hybrid_component',337:'solar_offgrid_kusum',374:'solar_total',411:'wind',456:'bio_bagasse_cogen',502:'bio_non_bagasse',540:'waste_to_energy',577:'waste_to_energy_offgrid',614:'bio_power_total',651:'small_hydro',688:'large_hydro',730:'total_re'}
anchors=[(w[1],int(w[4])) for w in ws if 60<w[0]<75 and re.fullmatch(r'\d+',w[4]) and w[1]>100]
anchors.sort()
assert [a[1] for a in anchors]==list(range(1,38)), anchors
ty=[w[1] for w in ws if w[4]=='Total' and w[0]>140][0]
NAMES=["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu & Kashmir","Jharkhand","Karnataka","Kerala","Ladakh","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman & Nicobar Islands","Chandigarh","Dadra & Nagar Haveli and Daman & Diu","Delhi","Lakshadweep","Puducherry","Others"]
names={k+1:v for k,v in enumerate(NAMES)}
data={sn:{} for _,sn in anchors}
total={}
for w in ws:
    if not re.fullmatch(r'\d+\.\d\d',w[4]): continue
    c=min(cols,key=lambda x:abs(x-w[2]))
    if abs(c-w[2])>3: continue
    if abs(w[1]-ty)<3: total[cols[c]]=w[4]; continue
    sn=min(anchors,key=lambda a:abs(a[0]-w[1]))[1]
    assert cols[c] not in data[sn], (sn,cols[c],w)
    data[sn][cols[c]]=w[4]
for sn in data: print(sn,names[sn],data[sn].get('solar_total'),data[sn].get('wind'),data[sn].get('total_re'))
print('TOTAL',total)
# checks
s=sum(float(data[sn].get('total_re',0)) for sn in data); print('sum total_re',round(s,2))
for sn in data:
    parts=sum(float(data[sn].get(k,0)) for k in ['solar_total','wind','bio_power_total','small_hydro','large_hydro'])
    assert abs(parts-float(data[sn]['total_re']))<0.05, (sn,parts,data[sn]['total_re'])
g={r['name'].lower():r['slug'] for r in csv.DictReader(open(geo))}
alias={'jammu & kashmir':'jammu-kashmir','andaman & nicobar islands':'andaman-nicobar','dadra & nagar haveli and daman & diu':'dnh-dd'}
keys=['solar_total','wind','bio_power_total','small_hydro','large_hydro','total_re','solar_ground_mounted','solar_rooftop','solar_hybrid_component','solar_offgrid_kusum']
with open(f'{out}/renewable-capacity-by-state-2026-10.csv','w',newline='') as f:
    w=csv.writer(f); w.writerow(['geography','name','period','series','value','unit','note'])
    for k in keys: w.writerow(['india','India','2026-10-31',k,total[k],'MW','all-India total incl. "Others"'])
    for sn in sorted(data):
        nm=names[sn]; slug=alias.get(nm.lower()) or g.get(nm.lower())
        if nm=='Others': slug='others'
        assert slug, nm
        for k in keys:
            w.writerow([slug,nm,'2026-10-31',k,data[sn].get(k,'') ,'MW','blank in source' if k not in data[sn] else ''])
    covered={alias.get(names[s].lower()) or g.get(names[s].lower()) for s in data}
    print('missing from geography:', set(g.values())-covered)
