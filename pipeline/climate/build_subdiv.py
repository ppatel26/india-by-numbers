"""Monsoon 2026 rainfall by meteorological subdivision. Values are transcribed from IMD SDWR 30 Sep 2026, Table-2.
Run: python3 -I pipeline/climate/build_subdiv.py --out research/data/climate"""
import argparse, csv, sys
ap = argparse.ArgumentParser()
ap.add_argument('--out', default='research/data/climate')
out = ap.parse_args().out
# Transcribed from IMD SDWR 30 Sep 2026, Table-2 (page 14 image). region, subdivision, actual, normal, dep, cat
rows = """central-india|Chhattisgarh|1191.0|1132.2|5|N|chhattisgarh
central-india|East Madhya Pradesh|1080.7|1043.4|4|N|madhya-pradesh
central-india|Gujarat Region|920.2|927.5|-1|N|gujarat;dnh-dd
central-india|Konkan & Goa|2453.0|2870.8|-15|N|maharashtra;goa
central-india|Madhya Maharashtra|693.5|747.4|-7|N|maharashtra
central-india|Marathwada|389.6|642.8|-39|D|maharashtra
central-india|Odisha|1482.3|1150.2|29|E|odisha
central-india|Saurashtra & Kutch|416.3|539.9|-23|D|gujarat;dnh-dd
central-india|Vidarbha|687.3|937.3|-27|D|maharashtra
central-india|West Madhya Pradesh|774.0|877.3|-12|N|madhya-pradesh
east-northeast-india|Arunachal Pradesh|932.7|1675.1|-44|D|arunachal-pradesh
east-northeast-india|Assam & Meghalaya|1064.5|1762.2|-40|D|assam;meghalaya
east-northeast-india|Bihar|676.1|992.2|-32|D|bihar
east-northeast-india|Gangetic West Bengal|1265.0|1166.8|8|N|west-bengal
east-northeast-india|Jharkhand|985.6|1022.9|-4|N|jharkhand
east-northeast-india|Nagaland, Manipur, Mizoram & Tripura|1031.1|1301.7|-21|D|nagaland;manipur;mizoram;tripura
east-northeast-india|Sub-Himalayan West Bengal & Sikkim|1692.4|1889.5|-10|N|west-bengal;sikkim
northwest-india|Haryana, Chandigarh & Delhi|333.0|430.7|-23|D|haryana;chandigarh;delhi
northwest-india|East Rajasthan|517.8|626.6|-17|N|rajasthan
northwest-india|East Uttar Pradesh|818.9|799.2|2|N|uttar-pradesh
northwest-india|Himachal Pradesh|662.1|734.4|-10|N|himachal-pradesh
northwest-india|Jammu, Kashmir & Ladakh|530.7|549.1|-3|N|jammu-kashmir;ladakh
northwest-india|Punjab|258.7|439.8|-41|D|punjab
northwest-india|Uttarakhand|1266.6|1162.7|9|N|uttarakhand
northwest-india|West Rajasthan|198.8|283.6|-30|D|rajasthan
northwest-india|West Uttar Pradesh|787.3|672.0|17|N|uttar-pradesh
south-peninsula|Andaman & Nicobar Islands|1767.8|1631.7|8|N|andaman-nicobar
south-peninsula|Coastal Andhra Pradesh & Yanam|501.1|601.4|-17|N|andhra-pradesh;puducherry
south-peninsula|Coastal Karnataka|2214.6|3093.9|-28|D|karnataka
south-peninsula|Kerala & Mahe|1451.8|2018.7|-28|D|kerala;puducherry
south-peninsula|Lakshadweep|729.5|1026.6|-29|D|lakshadweep
south-peninsula|North Interior Karnataka|333.1|480.8|-31|D|karnataka
south-peninsula|Rayalaseema|245.5|408.6|-40|D|andhra-pradesh
south-peninsula|South Interior Karnataka|471.4|678.4|-31|D|karnataka
south-peninsula|Tamil Nadu, Puducherry & Karaikal|262.0|328.4|-20|D|tamil-nadu;puducherry
south-peninsula|Telangana|605.1|734.8|-18|N|telangana"""
regions = {'central-india':('Central India','952.8','978.0','-3','N'),
 'east-northeast-india':('East and North East India','1017.1','1367.3','-26','D'),
 'northwest-india':('North West India','553.0','587.6','-6','N'),
 'south-peninsula':('South Peninsula India','542.0','716.2','-24','D')}
catname = {'N':'normal','D':'deficient','E':'excess'}
import re
def slug(s): return re.sub(r'-+','-',re.sub(r'[^a-z0-9]+','-',s.lower())).strip('-')
recs = [r.split('|') for r in rows.splitlines()]
assert len(recs) == 36
from collections import Counter
print(Counter(r[5] for r in recs))
with open(f'{out}/monsoon-2026-by-subdivision.csv','w',newline='') as f:
    w = csv.writer(f)
    w.writerow(['geography','geography_type','name','region','period','rainfall_mm','normal_mm','departure_pct','category','states_covered'])
    w.writerow(['india','country','Country as a whole','','2026-06-01/2026-09-30','759.4','868.6','-13','deficient',''])
    for k,(n,a,nm,d,c) in regions.items():
        w.writerow([k,'homogeneous-region',n,'','2026-06-01/2026-09-30',a,nm,d,catname[c],''])
    for reg,name,a,nm,d,c,st in recs:
        w.writerow([slug(name),'met-subdivision',name,reg,'2026-06-01/2026-09-30',a,nm,d,catname[c],st])
