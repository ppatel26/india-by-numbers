"""Parse ECI GE 2024 report 33, constituency-wise detailed results (pdftotext -layout output).
Usage: python3 -I pipeline/elections/parse_d33.py <d33.txt> <d33.json>
extract_text.sh runs it with work/elections/d33.txt and work/elections/d33.json.
Writes all candidate and NOTA rows and the constituency list as one JSON object."""
import re, sys, json, collections
txt = open(sys.argv[1], encoding='utf-8').read().splitlines()
states = ["Andaman & Nicobar Islands","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chandigarh","Chhattisgarh",
 "Dadra & Nagar Haveli and Daman & Diu","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir","Jharkhand","Karnataka",
 "Kerala","Ladakh","Lakshadweep","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","NCT OF Delhi","Odisha",
 "Puducherry","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"]
nums = r'(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*$'
cand = re.compile(r'(Male|Female|Third)\s+(\d+)\s+(general|sc|st|bl)\s+(\S+).*?' + nums, re.I)
nota = re.compile(r'\bNOTA\s+NOTA\b.*?' + nums)
tot = re.compile(r'^\s*TOTAL\s+-\s+-\s+(\d+)\s+(\d+)\s+(\d+)\s+([\d.]+)')
hdr = re.compile(r'Constituency:\s*(\d+)\s*\.\s*(.+?)\s*\(\s*Total Electors\s*(\d+)\)')
state = None; pc = None; rows = []; pcs = []; unmatched = 0
for ln in txt:
    s = ln.strip()
    if s in states or s.title() in [x.title() for x in states]:
        state = s; continue
    m = hdr.search(ln)
    if m:
        pc = dict(state=state, no=int(m.group(1)), name=m.group(2), electors=int(m.group(3))); pcs.append(pc); continue
    m = cand.search(ln)
    if m:
        rows.append(dict(state=state, pc=pc['no'], pcname=pc['name'], sex=m.group(1).title(), party=m.group(4),
                         general=int(m.group(7)), postal=int(m.group(8)), total=int(m.group(9)), polled=int(m.group(5)), valid=int(m.group(6))))
        continue
    m = nota.search(ln)
    if m:
        rows.append(dict(state=state, pc=pc['no'], pcname=pc['name'], sex='', party='NOTA',
                         general=int(m.group(3)), postal=int(m.group(4)), total=int(m.group(5)), polled=int(m.group(1)), valid=int(m.group(2))))
        continue
    m = tot.search(ln)
    if m:
        pc['tot_general']=int(m.group(1)); pc['tot_postal']=int(m.group(2)); pc['tot']=int(m.group(3)); pc['turnout_pct']=m.group(4); continue
    if re.search(nums, ln): unmatched += 1; print('UNMATCHED', ln, file=sys.stderr)
json.dump(dict(rows=rows, pcs=pcs), open(sys.argv[2], 'w'))
print('pcs', len(pcs), 'rows', len(rows), 'unmatched', unmatched)
print('states', collections.Counter(p['state'] for p in pcs))
