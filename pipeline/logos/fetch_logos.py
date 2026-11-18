"""Download the publisher logos for the Sources page. See pipeline/logos/README.md.
Usage: python3 -I pipeline/logos/fetch_logos.py <empty download folder>
"""
import hashlib, json, sys, urllib.parse, urllib.request
from pathlib import Path
UA = {"User-Agent": "IndiaByNumbers/1.0 (+https://indiabynumbers.org/about/)"}
out = Path(sys.argv[1])
official = {
    "mospi.svg": "https://www.mospi.gov.in/assets/mospi-logo-D_cI9Etu.svg",
    "imd.webp": "https://mausam.imd.gov.in/responsive/img/logo/imd_logo_a.webp",
    "cea.webp": "https://cea.nic.in/images/CEA_Embulum_Logo.webp",
    "iips.png": "https://www.iipsindia.ac.in/sites/all/themes/iips/images/IIPS-LOGO.png",
}
commons = {
    "rbi-commons.svg": "File:Reserve Bank of India logo.svg",
    "eci.svg": "File:Election Commission of India Logo.svg",
    "census.jpg": "File:Logo of the Census of India.jpg",
    "mnre.png": "File:Ministry of New and Renewable Energy logo.png",
    "moe.svg": "File:Ministry of Education India.svg",
    "mohfw.svg": "File:Ministry of Health India.svg",
    "pib-commons.jpg": "File:Press Information Bureau, Government of India.jpg",
}
def commons_url(title):
    q = urllib.parse.urlencode({"action": "query", "titles": title, "prop": "imageinfo", "iiprop": "url", "format": "json"})
    r = json.loads(urllib.request.urlopen(urllib.request.Request("https://commons.wikimedia.org/w/api.php?" + q, headers=UA), timeout=30).read())
    page = next(iter(r["query"]["pages"].values()))
    return page["imageinfo"][0]["url"], "https://commons.wikimedia.org/wiki/" + urllib.parse.quote(title.replace(" ", "_"))
log = []
for name, url in official.items():
    log.append((name, url, url))
for name, title in commons.items():
    u, page = commons_url(title)
    log.append((name, u, page))
for name, url, page in log:
    try:
        data = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40).read()
        (out / name).write_bytes(data)
        print(f"{name}\t{len(data)}\t{hashlib.sha256(data).hexdigest()[:16]}\t{page}")
    except Exception as e:
        print(f"{name}\tFAIL {e}\t{url}")
