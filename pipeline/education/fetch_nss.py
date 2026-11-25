"""Fetch NSS survey indicators from the MoSPI eSankhyiki API and save raw JSON.

Usage: python3 -I pipeline/education/fetch_nss.py --raw raw/education/nss80 --round 80 --survey 2 [codes]
Writes <raw>/indicators.json (the API's indicator list, where the round has one) and
<raw>/i<code>.json for each indicator: all pages merged, with the request URLs and fetch time.
With no codes, fetches every indicator in the list. NSS round 79 has no list endpoint: pass the
codes, or --scan N to try codes 1 to N.

The runs used by the education topic:
  fetch_nss.py --raw raw/education/nss80 --round 80 --survey 2          (CMS: Education 2025)
  fetch_nss.py --raw raw/education/nss79 --round 79 --survey 1 --scan 40 (CAMS 2022-23)

Other topics use the same script:
  fetch_nss.py --raw raw/living-standards/nss76 --round 76 --survey 2 16  (NSS Report 584, drinking water)
  fetch_nss.py --raw raw/health/nss76-disability --round 76 --survey 1     (NSS Report 583, disability)
"""
import argparse
import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request

HOST = "https://api.mospi.gov.in"
UA = "IndiaByNumbers/1.0 (+https://indiabynumbers.org/about/)"


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    err = None
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                return json.loads(r.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            # A refusal or a rate limit is final: stop and download by hand from the publisher's page.
            if e.code in (401, 403, 429, 451):
                raise SystemExit(f"{url}: HTTP {e.code}. The publisher refused the request; download the file by hand.")
            err = e
        except json.JSONDecodeError:
            # The API answers unknown routes with its HTML documentation page.
            return None
        except (urllib.error.URLError, TimeoutError) as e:
            err = e
        time.sleep(3 * (attempt + 1))
    raise SystemExit(f"failed {url}: {err}")


def fetch_indicator(rnd, survey, code):
    base = f"{HOST}/api/nss-{rnd}/getNss{rnd}Records"
    records, urls, page = [], [], 1
    while True:
        params = {"indicator_code": code, "survey_code": survey, "Format": "JSON", "limit": 200, "page": page}
        url = base + "?" + urllib.parse.urlencode(params)
        d = get(url)
        urls.append(url)
        if not d or not d.get("statusCode") and not d.get("data"):
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
    ap.add_argument("--raw", required=True)
    ap.add_argument("--round", required=True, help="NSS round, for example 80")
    ap.add_argument("--survey", required=True, help="survey_code within the round")
    ap.add_argument("--scan", type=int, help="try indicator codes 1 to N (rounds with no indicator list)")
    ap.add_argument("codes", nargs="*", type=int)
    a = ap.parse_args()
    os.makedirs(a.raw, exist_ok=True)
    codes = a.codes
    if not codes and not a.scan:
        url = f"{HOST}/api/nss-{a.round}/getIndicatorList?survey_code={a.survey}"
        d = get(url)
        if not d:
            raise SystemExit(f"{url}: no indicator list. Pass the codes or --scan N.")
        with open(f"{a.raw}/indicators.json", "w") as f:
            json.dump({"url": url, "fetched": time.strftime("%Y-%m-%dT%H:%M:%S%z"), **d}, f, ensure_ascii=False)
        codes = sorted(r["indicator_code"] for r in d["data"])
    if a.scan:
        codes = list(range(1, a.scan + 1))
    for code in codes:
        out = fetch_indicator(a.round, a.survey, code)
        if not out["records"]:
            print(f"i{code}: no data")
            continue
        with open(f"{a.raw}/i{code}.json", "w") as f:
            json.dump(out, f, ensure_ascii=False)
        print(f"i{code}: {len(out['records'])} records, {len(out['urls'])} pages, {out['records'][0]['indicator']}")


if __name__ == "__main__":
    main()
