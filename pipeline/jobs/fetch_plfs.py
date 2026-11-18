"""Fetch PLFS records from the MoSPI eSankhyiki API and save raw JSON pages.

Usage: python3 -I pipeline/jobs/fetch_plfs.py --raw raw/jobs <name> key=value [key=value ...]
Writes <raw>/<name>.json with all pages merged (records list plus request log).
The monthly series used by build_jobs.py:
  fetch_plfs.py --raw raw/jobs monthly-lfpr indicator_code=1 frequency_code=3
  fetch_plfs.py --raw raw/jobs monthly-wpr indicator_code=2 frequency_code=3
  fetch_plfs.py --raw raw/jobs monthly-ur indicator_code=3 frequency_code=3
"""
import argparse
import json
import os
import sys
import time
import urllib.parse
import urllib.request

BASE = "https://api.mospi.gov.in/api/plfs/getData"


def get(params):
    url = BASE + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": "IndiaByNumbers/1.0 (+https://indiabynumbers.org/about/)"})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=90) as r:
                return url, json.loads(r.read().decode("utf-8"))
        except Exception as e:  # noqa: BLE001
            err = e
            time.sleep(3 * (attempt + 1))
    raise SystemExit(f"failed {url}: {err}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--raw", default="raw/jobs")
    ap.add_argument("name")
    ap.add_argument("params", nargs="*", metavar="key=value")
    a = ap.parse_args()
    outdir, name = a.raw, a.name
    os.makedirs(outdir, exist_ok=True)
    params = dict(p.split("=", 1) for p in a.params)
    params["limit"] = "200"
    page = 1
    records, urls = [], []
    while True:
        params["page"] = str(page)
        url, d = get(params)
        urls.append(url)
        if not d.get("statusCode"):
            print("no data", url, d.get("msg"))
            break
        records.extend(d.get("data", []))
        meta = d.get("meta_data", {})
        if page >= int(meta.get("totalPages", 1)):
            break
        page += 1
    out = {"urls": urls, "fetched": time.strftime("%Y-%m-%dT%H:%M:%S%z"), "records": records}
    with open(f"{outdir}/{name}.json", "w") as f:
        json.dump(out, f, ensure_ascii=False)
    print(name, len(records), "records,", len(urls), "pages")


if __name__ == "__main__":
    main()
