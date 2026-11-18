"""Post the RBI Reference Rate Archive form for USD and save the result page.
First save the form page: curl -sS -A 'IndiaByNumbers/1.0 (+https://indiabynumbers.org/about/)' -o raw/economy/rbi/refarchive.html https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx
Usage: python3 -I pipeline/economy/refrate.py --raw raw/economy <from dd/mm/yyyy> <to dd/mm/yyyy> <out name>
Reads <raw>/rbi/refarchive.html and writes <raw>/rbi/<out name>, for example refrate_usd_2026.html."""
import argparse, os, re, sys, html, urllib.request, urllib.parse

ap = argparse.ArgumentParser()
ap.add_argument("--raw", default="raw/economy")
ap.add_argument("frm"); ap.add_argument("to"); ap.add_argument("name")
a = ap.parse_args()
form, frm, to, out = os.path.join(a.raw, "rbi", "refarchive.html"), a.frm, a.to, os.path.join(a.raw, "rbi", a.name)
s = open(form, encoding="utf-8", errors="replace").read()
def val(n):
    m = re.search(r'name="%s"[^>]*value="([^"]*)"' % re.escape(n), s) or re.search(r'value="([^"]*)"[^>]*name="%s"' % re.escape(n), s)
    return html.unescape(m.group(1)) if m else ""
data = {k: val(k) for k in ["__VIEWSTATE", "__VIEWSTATEGENERATOR", "__EVENTVALIDATION"]}
data.update({"__EVENTTARGET": "", "__EVENTARGUMENT": "", "txtFromDate": frm, "txtToDate": to,
             "chkUSD": "on", "btnSubmit": "Submit"})
req = urllib.request.Request("https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx",
                             data=urllib.parse.urlencode(data).encode(), method="POST",
                             headers={"User-Agent": "IndiaByNumbers/1.0 (+https://indiabynumbers.org/about/)", "Content-Type": "application/x-www-form-urlencoded",
                                      "Referer": "https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx"})
r = urllib.request.urlopen(req, timeout=120).read()
open(out, "wb").write(r)
t = re.sub(r"\s+", " ", html.unescape(re.sub("<[^>]+>", " ", r.decode("utf-8", "replace"))))
i = t.find("USD")
print(len(r), t[i - 200 : i + 1500])
