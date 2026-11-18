"""Refetch CPI base 2012 all-India data one month per request, so each answer fits in one page.
Usage: python3 -I pipeline/prices/fetch_cpi12.py --raw raw/prices <series Current|Back> <years comma> <name.all.json>
Writes <raw>/api/<name.all.json>. Used for cpi12_allindia.all.json and cpi12back_allindia.all.json."""
import argparse, json, os, sys, time, urllib.request

ap = argparse.ArgumentParser()
ap.add_argument("--raw", default="raw/prices")
ap.add_argument("series", choices=["Current", "Back"])
ap.add_argument("years", help="comma-separated, for example 2014,2015")
ap.add_argument("name", help="output file name under <raw>/api/")
a = ap.parse_args()
os.makedirs(os.path.join(a.raw, "api"), exist_ok=True)
series, years, out = a.series, a.years.split(","), os.path.join(a.raw, "api", a.name)
rows, problems = [], []
for y in years:
    for m in range(1, 13):
        url = (f"https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series={series}&state_code=99"
               f"&year={y}&month_code={m}&limit=100&page=1")
        for attempt in range(3):
            try:
                d = json.loads(urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=60).read())
                break
            except Exception:
                time.sleep(2)
        data = d.get("data") or []
        tot = (d.get("meta_data") or {}).get("totalRecords", 0)
        if tot > 100: problems.append((y, m, tot))
        keys = {(r["sector"], r["subgroup"]) for r in data}
        if len(keys) != len(data): problems.append((y, m, "dup"))
        rows.extend(data)
        time.sleep(0.2)
json.dump({"source_url": "https://api.mospi.gov.in/api/cpi/getCPIIndex?base_year=2012&series=%s&state_code=99&year=<y>&month_code=<m>&limit=100&page=1" % series,
           "rows": rows}, open(out, "w"))
print(len(rows), "problems", problems)
