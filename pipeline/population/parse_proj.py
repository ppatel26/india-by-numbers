"""Parse Table 8 (population on 1 March, 2011 to 2036) of the MoHFW population projections report.
Usage: python3 -I pipeline/population/parse_proj.py <proj.txt> <proj_table8.csv>
extract_text.sh runs it with work/population/proj.txt and work/population/proj_table8.csv."""
import re, sys, csv
txt = open(sys.argv[1], encoding='utf-8', errors='replace').read().split('\n')
# Locate Table 8 body: from second "TABLE – 8" to the second "TABLE - 9"/"TABLE – 9"
idx8 = [i for i,l in enumerate(txt) if re.search(r'TABLE\s*[–-]\s*8\b', l)]
idx9 = [i for i,l in enumerate(txt) if re.search(r'TABLE\s*[–-]\s*9\b', l)]
s = idx8[1]; e = [i for i in idx9 if i > s][0]
blocks = [
 ['india','jammu-kashmir','himachal-pradesh'],
 ['punjab','haryana','delhi'],
 ['rajasthan','uttar-pradesh','bihar'],
 ['assam','west-bengal','jharkhand'],
 ['odisha','chhattisgarh','madhya-pradesh'],
 ['gujarat','maharashtra','andhra-pradesh'],
 ['karnataka','kerala','tamil-nadu'],
 ['chandigarh','uttarakhand','sikkim'],
 ['arunachal-pradesh','nagaland','manipur'],
 ['mizoram','tripura','meghalaya'],
 ['daman-diu','dadra-nagar-haveli','goa'],
 ['lakshadweep','puducherry','andaman-nicobar'],
 ['telangana','ladakh'],
]
expect = [['INDIA','JAMMU','HIMACHAL'],['PUNJAB','HARYANA','DELHI'],['RAJASTHAN','UTTAR','BIHAR'],['ASSAM','WEST BENGAL','JHARKHAND'],['ODISHA','CHHATTISGARH','MADHYA'],['GUJARAT','MAHARASHTRA','ANDHRA'],['KARNATAKA','KERALA','TAMIL'],['CHANDIGARH','UTTARAKHAND','SIKKIM'],['ARUNACHAL','NAGALAND','MANIPUR'],['MIZORAM','TRIPURA','MEGHALAYA'],['DAMAN','DADRA','GOA'],['LAKSHADWEEP','PUDUCHERRY','ANDAMAN'],['TELANGANA','LADAKH']]
body = txt[s:e]
# split into blocks at each line starting with 'Year'
yi = [i for i,l in enumerate(body) if re.match(r'^\s*Year\b', l)]
assert len(yi) == 13, len(yi)
rows = []
for b,(start) in enumerate(yi):
    hdr = ' '.join(body[max(0,start-3):start+1]).upper()
    for k in expect[b]:
        assert k in hdr, (b,k,hdr)
    end = yi[b+1] if b+1 < len(yi) else len(body)
    years = {}
    for l in body[start:end]:
        m = re.match(r'^\s*(20[1-3]\d)\s+(.*)$', l)
        if not m: continue
        nums = [int(x.replace(',','')) for x in re.findall(r'[\d,]+', m.group(2))]
        n = 3*len(blocks[b])
        assert len(nums) == n, (b, l)
        years[int(m.group(1))] = nums
    assert sorted(years) == list(range(2011,2037)), (b, sorted(years))
    for y, nums in sorted(years.items()):
        for j, slug in enumerate(blocks[b]):
            p, mm, f = nums[3*j:3*j+3]
            rows.append((slug, y, p, mm, f))
w = csv.writer(open(sys.argv[2],'w',newline=''))
w.writerow(['unit_code','year','persons_thousand','males_thousand','females_thousand'])
for r in rows: w.writerow(r)
# check: sum of states = india per year (approx)
for y in (2011, 2026, 2036):
    tot = sum(r[2] for r in rows if r[1]==y and r[0]!='india')
    ind = [r[2] for r in rows if r[1]==y and r[0]=='india'][0]
    print(y, 'india', ind, 'sum states', tot, 'diff', ind-tot)
    for r in rows:
        if r[1]==y and r[2] != r[3]+r[4]: print('  sex mismatch', r)
