"""Fetch every page of a MoSPI API query and save the raw pages.
Usage: python3 -I pipeline/common/fetch_api.py --raw raw/<topic>/api <url-without-page> <name> [limit]
Writes <raw>/<name>.pN.json for each page and <raw>/<name>.all.json (merged data rows)."""
import argparse, json, os, sys, time, urllib.request

ap = argparse.ArgumentParser()
ap.add_argument("--raw", required=True, help="folder for the downloaded pages, for example raw/prices/api")
ap.add_argument("url")
ap.add_argument("name")
ap.add_argument("limit", nargs="?", type=int, default=1000)
args = ap.parse_args()
os.makedirs(args.raw, exist_ok=True)
base, out, limit = args.url, os.path.join(args.raw, args.name), args.limit
rows, page = [], 1
while True:
    url = f"{base}&limit={limit}&page={page}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    raw = urllib.request.urlopen(req, timeout=180).read()
    with open(f"{out}.p{page}.json", "wb") as f:
        f.write(raw)
    d = json.loads(raw)
    data = d.get("data") or []
    rows.extend(data)
    meta = d.get("meta_data") or {}
    tp = meta.get("totalPages", 1)
    print(f"page {page}/{tp} rows {len(data)} total {meta.get('totalRecords')}", file=sys.stderr)
    if page >= tp or not data:
        break
    page += 1
    time.sleep(0.3)
with open(f"{out}.all.json", "w") as f:
    json.dump({"source_url": base, "rows": rows}, f)
print(len(rows))
