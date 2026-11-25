"""Fetch HCES indicators from the MoSPI eSankhyiki API and save raw JSON.

Usage: python3 -I pipeline/living-standards/fetch_hces.py [--raw raw/living-standards/hces] [codes]
Writes <raw>/i<code>.json for each indicator: all pages merged, with the request URLs and the
fetch time. With no codes, fetches indicators 1 to 9 (the nine in the API's documentation,
https://api.mospi.gov.in/layout/swagger_user_hces.yaml). The route is
/api/hces/getHcesRecords?indicator_code=<n>&Format=JSON&limit=200&page=<p>.
"""
import argparse
import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request

BASE = "https://api.mospi.gov.in/api/hces/getHcesRecords"
UA = "IndiaByNumbers/1.0 (+https://indiabynumbers.org/about/)"


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    err = None
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                return json.loads(r.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            # A refusal or a rate limit is final: stop and download by hand from the publisher's page.
            if e.code in (401, 403, 429, 451):
                raise SystemExit(f"{url}: HTTP {e.code}. The publisher refused the request; download the file by hand.")
            err = e
        except json.JSONDecodeError:
            raise SystemExit(f"{url}: the reply is not JSON. Check the route.")
        except (urllib.error.URLError, TimeoutError) as e:
            err = e
        time.sleep(3 * (attempt + 1))
    raise SystemExit(f"failed {url}: {err}")


def fetch(code):
    records, urls, page = [], [], 1
    while True:
        params = {"indicator_code": code, "Format": "JSON", "limit": 200, "page": page}
        url = BASE + "?" + urllib.parse.urlencode(params)
        d = get(url)
        urls.append(url)
        if not d.get("statusCode"):
            break
        records.extend(d.get("data") or [])
        meta = d.get("meta_data") or {}
        if page >= int(meta.get("totalPages", 1)) or not d.get("data"):
            break
        page += 1
        time.sleep(0.3)
    return {"urls": urls, "fetched": time.strftime("%Y-%m-%dT%H:%M:%S%z"), "records": records}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--raw", default="raw/living-standards/hces")
    ap.add_argument("codes", nargs="*", type=int)
    a = ap.parse_args()
    os.makedirs(a.raw, exist_ok=True)
    for code in a.codes or range(1, 10):
        out = fetch(code)
        if not out["records"]:
            print(f"i{code}: no data")
            continue
        with open(f"{a.raw}/i{code}.json", "w") as f:
            json.dump(out, f, ensure_ascii=False)
        print(f"i{code}: {len(out['records'])} records, {len(out['urls'])} pages, {out['records'][0]['indicator']}")


if __name__ == "__main__":
    main()
