"""Installed capacity by source and non-fossil share, from the output of parse_cea.py.
Run: python3 -I pipeline/climate/build_cea.py --work work/climate --out research/data/climate"""
import argparse, os, json, csv, sys
ap = argparse.ArgumentParser()
ap.add_argument('--work', default='work/climate')
ap.add_argument('--out', default='research/data/climate')
_a = ap.parse_args()
d = json.load(open(os.path.join(_a.work, 'cea_parsed.json'))); out = _a.out
asof = {'2014-03':'2014-03-31','2015-03':'2015-03-31','2016-03':'2016-03-31','2017-03':'2017-03-31','2018-03':'2018-03-31','2019-03':'2019-03-31','2020-03':'2020-03-31','2021-03':'2021-03-31','2022-03':'2022-03-31','2023-03':'2023-03-31','2024-03':'2024-03-31','2025-03':'2025-03-31','2026-03':'2026-03-31','2026-10':'2026-10-31'}
rows=[]; share=[]
for y,v in d.items():
    t=v['total_row']; r=v['res']
    if not v['lignite_col']:
        coal,gas,diesel,therm,nuc,hyd,res,grand=t; lig=None; cname='coal-incl-lignite'
    else:
        coal,lig,gas,diesel,therm,nuc,hyd,res=t[:8]; grand=t[-1]; cname='coal'
    sh,wind,bio,wte,sol,rtot=r
    assert abs(rtot-res)<0.05, y
    assert abs(sh+wind+bio+wte+sol-rtot)<0.1, (y, sh+wind+bio+wte+sol, rtot)
    assert abs(therm+nuc+hyd+res-grand)<0.1, (y, therm+nuc+hyd+res, grand)
    note = 'RES revised by MNRE letter of 23.08.2017' if y in ('2014-03','2015-03','2016-03','2017-03') else ''
    if y=='2026-10': note='latest monthly report'
    cats=[(cname,coal),('lignite',lig),('gas',gas),('diesel',diesel),('nuclear',nuc),('large-hydro',hyd),('small-hydro',sh),('wind',wind),('bio-power',bio),('waste-to-energy',wte),('solar',sol)]
    for c,val in cats:
        if val is None: continue
        rows.append(['india',asof[y],c,f'{val:.2f}','MW',note])
    rows.append(['india',asof[y],'total',f'{grand:.2f}','MW',note])
    nf=nuc+hyd+res; re_ex=res
    share.append(['india',asof[y],'non-fossil',f'{100*nf/grand:.2f}','% of installed capacity','derived: (nuclear + hydro + RES) / total, from published MW'])
    share.append(['india',asof[y],'renewable-incl-large-hydro',f'{100*(hyd+res)/grand:.2f}','% of installed capacity','derived from published MW'])
    share.append(['india',asof[y],'wind-solar-other-re',f'{100*res/grand:.2f}','% of installed capacity','derived from published MW'])
    share.append(['india',asof[y],'solar',f'{100*sol/grand:.2f}','% of installed capacity','derived from published MW'])
    print(y, round(grand), 'nonfossil %.2f'%(100*nf/grand), 'solar', sol, 'coal', coal, lig)
with open(f'{out}/installed-capacity-by-source-2014-2026.csv','w',newline='') as f:
    w=csv.writer(f); w.writerow(['geography','period','source','value','unit','note']); w.writerows(rows)
with open(f'{out}/non-fossil-share-of-capacity-2014-2026.csv','w',newline='') as f:
    w=csv.writer(f); w.writerow(['geography','period','series','value','unit','note']); w.writerows(share)
