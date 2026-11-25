"""Download every monthly release of the RBI Payment System Indicators (PSI) as HTML.

The PSI page (https://www.rbi.org.in/Scripts/PSIUserView.aspx?Id=N) lists its archive by year
through an ASP.NET form. This script posts the form for each year, reads the month links, and saves
each month page to <raw>/psi/psi-<yyyy-mm>.html. It logs file, URL, sha256 and fetch time (UTC)
to <raw>/_log.tsv, in the same format as pipeline/common/fetch.sh.

The XLSX and PDF files that each page links to are on rbidocs.rbi.org.in. That server answers
automated clients (curl and headless Chromium) with a JavaScript bot check, so this script reads
the HTML tables, which hold the same figures.

Usage: python3 -I pipeline/trade-payments/fetch_psi.py --raw raw/trade-payments [--years 2021-2026]
"""
import argparse, hashlib, html, os, re, sys, time, urllib.error, urllib.parse, urllib.request
from datetime import datetime, timezone

UA = "IndiaByNumbers/1.0 (+https://indiabynumbers.org/about/)"
BASE = "https://www.rbi.org.in/Scripts/PSIUserView.aspx"
MONTHS = {m: i for i, m in enumerate(
    ["january", "february", "march", "april", "may", "june", "july", "august", "september",
     "october", "november", "december"], 1)}
MONTHS["decmber"] = 12  # RBI spells December 2024 as "Decmber" in the archive list


def get(url, data=None):
    """Fetch a page. On an HTTP error, wait and try again."""
    headers = {"User-Agent": UA}
    if data:  # RBI answers HTTP 418 to a GET that carries a form Content-Type
        headers["Content-Type"] = "application/x-www-form-urlencoded"
    req = urllib.request.Request(url, data=data, method="POST" if data else "GET", headers=headers)
    for wait in (0, 20, 60, 180):
        time.sleep(wait)
        try:
            return urllib.request.urlopen(req, timeout=120).read()
        except urllib.error.HTTPError as e:
            print("HTTP %d for %s, waiting" % (e.code, url), file=sys.stderr)
    sys.exit("RBI refused %s four times" % url)


def log(raw, name, url, body):
    h = hashlib.sha256(body).hexdigest()
    with open(os.path.join(raw, "_log.tsv"), "a") as f:
        f.write("%s\t%s\t%s\t%s\n" % (name, url, h, datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%MZ")))
    return h


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--raw", default="raw/trade-payments")
    ap.add_argument("--years", default="2021-2026")
    a = ap.parse_args()
    y0, y1 = (int(x) for x in a.years.split("-"))
    os.makedirs(os.path.join(a.raw, "psi"), exist_ok=True)
    first = get(BASE + "?Id=1").decode("utf-8", "replace")

    def val(n):
        m = re.search(r'name="%s"[^>]*value="([^"]*)"' % re.escape(n), first)
        return html.unescape(m.group(1)) if m else ""

    links = {}
    for y in range(y1, y0 - 1, -1):
        d = {k: val(k) for k in ["__VIEWSTATE", "__VIEWSTATEGENERATOR", "__EVENTVALIDATION"]}
        d.update({"__EVENTTARGET": "", "__EVENTARGUMENT": "", "hdnYear": str(y), "UsrFontCntr$btn": ""})
        r = get(BASE + "?Id=1", urllib.parse.urlencode(d).encode()).decode("utf-8", "replace")
        for m in re.finditer(r'href=["\']?PSIUserView\.aspx\?Id=(\d+)["\']?[^>]*>(.*?)</a>', r, re.S):
            t = re.sub(r"<[^>]+>", "", m.group(2)).strip()
            mm = re.search(r"-\s*([A-Za-z]+)\s+(\d{4})", t)
            if not mm or mm.group(1).lower() not in MONTHS:
                sys.exit("cannot read month from link text: %r" % t)
            links["%s-%02d" % (mm.group(2), MONTHS[mm.group(1).lower()])] = int(m.group(1))
        time.sleep(1)
    print("months listed:", len(links), min(links), "to", max(links))
    for ym, i in sorted(links.items()):
        name = "psi/psi-%s.html" % ym
        url = "%s?Id=%d" % (BASE, i)
        body = get(url)
        open(os.path.join(a.raw, name), "wb").write(body)
        print(name, url, log(a.raw, name, url, body))
        time.sleep(1)


if __name__ == "__main__":
    main()
