"""Publisher check of 18 Nov 2026: fetch the FBIL USD/INR reference rates for 17 and 18 Nov 2026 from the RBI archive.
First save the form page and the RBI home page into the raw folder:
  curl -sS -A Mozilla/5.0 -o raw/economy/refresh-2026-11-18/rbi_archive https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx
  curl -sS -A Mozilla/5.0 -o raw/economy/refresh-2026-11-18/rbi_home https://www.rbi.org.in/
Usage: python3 -I pipeline/economy/refresh_fetch_rates.py --raw raw/economy/refresh-2026-11-18
Writes <raw>/rbi_rates and <raw>/rbi_rates.headers. Then run refresh_append_rates.py.
"""
import argparse
from html.parser import HTMLParser
from pathlib import Path
import subprocess
import sys
from urllib.parse import urlencode

class Form(HTMLParser):
    def __init__(self):
        super().__init__()
        self.fields = {}

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if tag == "input" and attributes.get("name") in ("__VIEWSTATE", "__VIEWSTATEGENERATOR", "__EVENTVALIDATION"):
            self.fields[attributes["name"]] = attributes["value"]

ap = argparse.ArgumentParser()
ap.add_argument("--raw", default="raw/economy/refresh-2026-11-18")
raw = Path(ap.parse_args().raw)
parser = Form()
parser.feed((raw / "rbi_archive").read_text())
assert "__VIEWSTATE" in parser.fields
parser.fields.update(__EVENTTARGET="", __EVENTARGUMENT="", txtFromDate="17/11/2026", txtToDate="18/11/2026", chkUSD="on", btnSubmit="Submit")
url = "https://www.rbi.org.in/Scripts/ReferenceRateArchive.aspx"
subprocess.run(["curl", "-sS", "--max-time", "40", "--proto", "=https", "-A", "Mozilla/5.0",
                "-H", "Content-Type: application/x-www-form-urlencoded", "--referer", url,
                "--data-binary", "@-", "-D", str(raw / "rbi_rates.headers"), "-o", str(raw / "rbi_rates"),
                "-w", "%{http_code}\n", url], input=urlencode(parser.fields), text=True, check=True)
