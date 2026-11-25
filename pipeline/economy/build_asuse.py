"""Build the ASUSE (Annual Survey of Unincorporated Sector Enterprises) CSVs for the economy topic.

Reads:
  <raw>/api/asuse-workers-by-state.all.json         eSankhyiki indicator 27, all workers, all activities, combined
  <raw>/api/asuse-establishments-by-state.all.json  eSankhyiki indicator 2, all establishments, combined
  <work>/asuse-2025-full-report.txt                 pdftotext -layout of the ASUSE 2025 report (check of Table 26)
  <work>/asuse-2025-press-note.txt                  pdftotext -layout of the press note of 24 Mar 2026 (check of Table 1)

Writes:
  <out>/asuse-by-state-2025.csv  workers and establishments by state and UT, January to December 2025
  <out>/asuse-india-rounds.csv   workers and establishments, India, the four rounds 2021-22 to 2025

Download the files first (see research/data/economy/README.md, section "Factories and small firms"):
  python3 -I pipeline/common/fetch_api.py --raw raw/economy/asuse/api "https://api.mospi.gov.in/api/asuse/getAsuseRecords?Format=JSON&indicator_code=27&sector_code=3&gender_code=4&broad_activity_category_code=4&establishment_type_code=3" asuse-workers-by-state 200
  python3 -I pipeline/common/fetch_api.py --raw raw/economy/asuse/api "https://api.mospi.gov.in/api/asuse/getAsuseRecords?Format=JSON&indicator_code=2&sector_code=3&broad_activity_category_code=4&establishment_type_code=3" asuse-establishments-by-state 200
  pipeline/common/fetch.sh --raw raw/economy/asuse <full report URL> asuse-2025-full-report.pdf
  pipeline/common/fetch.sh --raw raw/economy/asuse <press note URL> asuse-2025-press-note.pdf
  pdftotext -layout raw/economy/asuse/asuse-2025-full-report.pdf work/economy/asuse/asuse-2025-full-report.txt
  pdftotext -layout raw/economy/asuse/asuse-2025-press-note.pdf work/economy/asuse/asuse-2025-press-note.txt

Usage: python3 -I pipeline/economy/build_asuse.py [--raw raw/economy/asuse] [--work work/economy/asuse] [--out research/data/economy]
"""
import argparse
import csv
import json
import os
import re

# API state names to geography slugs. 2021-22 gives Dadra and Nagar Haveli and Daman and Diu as two
# rows; we use only 2025 by state, so those two names are not mapped.
API_STATES = {
    "Andaman & Nicobar Islands": "andaman-nicobar", "Andhra Pradesh": "andhra-pradesh", "Arunachal Pradesh": "arunachal-pradesh",
    "Assam": "assam", "Bihar": "bihar", "Chandigarh": "chandigarh", "Chhattisgarh": "chhattisgarh",
    "Dadra & Nagar Haveli and Daman & Diu": "dnh-dd", "Delhi": "delhi", "Goa": "goa", "Gujarat": "gujarat",
    "Haryana": "haryana", "Himachal Pradesh": "himachal-pradesh", "Jammu & Kashmir": "jammu-kashmir", "Jharkhand": "jharkhand",
    "Karnataka": "karnataka", "Kerala": "kerala", "Ladakh": "ladakh", "Lakshadweep": "lakshadweep", "Madhya Pradesh": "madhya-pradesh",
    "Maharashtra": "maharashtra", "Manipur": "manipur", "Meghalaya": "meghalaya", "Mizoram": "mizoram", "Nagaland": "nagaland",
    "Odisha": "odisha", "Puduchery": "puducherry", "Punjab": "punjab", "Rajasthan": "rajasthan", "Sikkim": "sikkim",
    "Tamil Nadu": "tamil-nadu", "Telangana": "telangana", "Tripura": "tripura", "Uttar Pradesh": "uttar-pradesh",
    "Uttarakhand": "uttarakhand", "West Bengal": "west-bengal", "All India": "india",
}

# Report Table 26 state names to geography slugs.
REPORT_STATES = {**{k: v for k, v in API_STATES.items() if "&" not in k and k != "Puduchery"},
                 "A & N Islands": "andaman-nicobar", "D & N Haveli and Daman & Diu": "dnh-dd", "Jammu & Kashmir": "jammu-kashmir",
                 "Puducherry": "puducherry", "all-India": "india"}
REPORT_STATES.pop("All India")

# Survey periods: ASUSE 2021-22 to 2023-24 ran October to September; ASUSE 2025 ran January to December.
REFERENCE = {"2021-22": "2021-10/2022-09", "2022-23": "2022-10/2023-09", "2023-24": "2023-10/2024-09", "2025": "2025-01/2025-12"}

SRC = "eSankhyiki API, ASUSE"


def load(raw, name):
    rows = json.load(open(os.path.join(raw, "api", f"{name}.all.json"), encoding="utf-8"))["rows"]
    total = json.load(open(os.path.join(raw, "api", f"{name}.p1.json"), encoding="utf-8"))["meta_data"]["totalRecords"]
    if len(rows) != total:
        raise SystemExit(f"{name}: {len(rows)} rows, the API reported {total}. Fetch again.")
    return rows


def table_26(text):
    """Report Table 26, block "BAC:All Est.:All Sec:Combined": {slug: (column 10 all workers, column 11 estimated establishments)}."""
    start = text.index("Table 26: Estimated number of workers by nature of employment and gender for each State/UT")
    end = text.index("Table 27:", start)
    block = text[start:end]
    at = re.search(r"BAC:All\s+Est\.:All\s+Sec:Combined", block).end()
    out = {}
    for line in block[at:].splitlines():
        m = re.match(r"\s*([A-Za-z&][A-Za-z&. -]*?)\s{2,}((?:\d+\s+){10}\d+)\s*$", line)
        if not m:
            continue
        name, nums = m.group(1), m.group(2).split()
        if name not in REPORT_STATES:
            raise SystemExit(f"Table 26: unknown name {name!r}")
        out[REPORT_STATES[name]] = (nums[8], nums[9])
        if name == "all-India":
            break
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--raw", default="raw/economy/asuse")
    ap.add_argument("--work", default="work/economy/asuse")
    ap.add_argument("--out", default="research/data/economy")
    a = ap.parse_args()

    workers, estabs = {}, {}
    for r in load(a.raw, "asuse-workers-by-state"):
        assert (r["sector"], r["gender"], r["broad_activity_category"], r["establishment_type"]) == ("Combined", "All", "All", "All Establishments(All)")
        if r["working_time"] == "All":
            workers[(r["year"], r["state/UT"])] = r["value"]
    for r in load(a.raw, "asuse-establishments-by-state"):
        assert (r["sector"], r["broad_activity_category"], r["establishment_type"]) == ("Combined", "All", "All Establishments(All)")
        if r["establishments"] == "Estimated No. of Establishments":
            estabs[(r["year"], r["state/UT"])] = r["value"]

    # Check 2025 against report Table 26, every state and UT.
    t26 = table_26(open(os.path.join(a.work, "asuse-2025-full-report.txt"), encoding="utf-8").read())
    if set(t26) != set(API_STATES.values()):
        raise SystemExit(f"Table 26: missing {set(API_STATES.values()) - set(t26)}")
    bad = 0
    for name, slug in API_STATES.items():
        if (workers[("2025", name)], estabs[("2025", name)]) != t26[slug]:
            bad += 1
            print(f"check: {slug}: API {workers[('2025', name)]} workers, {estabs[('2025', name)]} establishments; Table 26 {t26[slug]}")
    print(f"check: Table 26 against the API, 2025: {len(t26) - bad} of {len(t26)} rows agree")

    # Check India rounds against Table 1 of the press note (in hundreds).
    note = open(os.path.join(a.work, "asuse-2025-press-note.txt"), encoding="utf-8").read()
    t1 = {}
    for label, key in (("Number of Establishments (in ’00)", "establishments"), ("Number of Workers (in ’00)", "workers")):
        line = next(l for l in note.splitlines() if label in l)
        t1[key] = dict(zip(["2022-23", "2023-24", "2025"], [n.replace(",", "") for n in re.findall(r"\d[\d,]+", line.split(")", 1)[1])]))
    for key, src in (("establishments", estabs), ("workers", workers)):
        for y, hundreds in t1[key].items():
            api = int(src[(y, "All India")])
            ok = round(api / 100) == int(hundreds)
            print(f"check: {key} {y}: API {api}, press note {hundreds} hundred: {'agree' if ok else 'DIFFER'}")

    rows = []
    for name, slug in API_STATES.items():
        for key, src in (("workers", workers), ("establishments", estabs)):
            rows.append({"geography": slug, "period": "2025", "reference_period": REFERENCE["2025"], "indicator": key,
                         "value": src[("2025", name)], "unit": "number", "source": SRC + " (report Table 26)"})
    path = os.path.join(a.out, "asuse-by-state-2025.csv")
    fields = ["geography", "period", "reference_period", "indicator", "value", "unit", "source"]
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields, lineterminator="\n")
        w.writeheader()
        w.writerows(rows)
    print(path, len(rows), "rows")

    rows = []
    for key, src in (("workers", workers), ("establishments", estabs)):
        for y, ref in REFERENCE.items():
            rows.append({"geography": "india", "period": y, "reference_period": ref, "indicator": key,
                         "value": src[(y, "All India")], "unit": "number", "source": SRC})
    path = os.path.join(a.out, "asuse-india-rounds.csv")
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields, lineterminator="\n")
        w.writeheader()
        w.writerows(rows)
    print(path, len(rows), "rows")


if __name__ == "__main__":
    main()
