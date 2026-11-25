"""Build the Annual Survey of Industries (ASI) CSVs for the economy topic.

Reads:
  <work>/asi-2024-25-summary-results.txt  pdftotext -layout of the ASI 2024-25 Summary Results
  <work>/asi-2023-24-summary-results.txt  the same for ASI 2023-24 (a check on 2019-20 only)
  <raw>/api/asi-nic2008-allindia-total.all.json  eSankhyiki API, all-India, all industries, NIC 2008

Writes:
  <out>/asi-factory-sector-india.csv  factories in operation, persons engaged and GVA, 2008-09 to 2024-25
  <out>/asi-by-state-2024-25.csv      Statement 7A values and Statement 7B shares, by state and UT

Download the files first (see research/data/economy/README.md, section "Factories and small firms"):
  pipeline/common/fetch.sh --raw raw/economy/asi https://microdata.gov.in/NADA/index.php/catalog/309/download/6675 asi-2024-25-summary-results.pdf
  pipeline/common/fetch.sh --raw raw/economy/asi https://microdata.gov.in/NADA/index.php/catalog/256/download/3924 asi-2023-24-summary-results.pdf
  python3 -I pipeline/common/fetch_api.py --raw raw/economy/asi/api "https://api.mospi.gov.in/api/asi/getASIData?Format=JSON&classification_year=2008&sector_code=Combined&nic_type=2-digit&state_code=99&nic_code=99999" asi-nic2008-allindia-total 200
  pdftotext -layout raw/economy/asi/asi-2024-25-summary-results.pdf work/economy/asi/asi-2024-25-summary-results.txt
  pdftotext -layout raw/economy/asi/asi-2023-24-summary-results.pdf work/economy/asi/asi-2023-24-summary-results.txt

Usage: python3 -I pipeline/economy/build_asi.py [--raw raw/economy/asi] [--work work/economy/asi] [--out research/data/economy]
"""
import argparse
import csv
import json
import os
import re

# Statement 3A rows and the API indicator with the same content.
INDICATORS = {
    "factories-in-operation": ("Factories in Operation", "Factories in Operation", "number"),
    "persons-engaged": ("Total Persons Engaged", "Total Number of Persons Engaged", "persons"),
    "gva": ("GVA", "Gross Value Added", "rupees lakh"),
}

# Statement 7A and 7B state names, as printed, to geography slugs.
STATES = {
    "Maharashtra": "maharashtra", "Gujarat": "gujarat", "Tamil Nadu": "tamil-nadu", "Karnataka": "karnataka",
    "Uttar Pradesh": "uttar-pradesh", "Haryana": "haryana", "Rajasthan": "rajasthan", "Odisha": "odisha",
    "Andhra Pradesh": "andhra-pradesh", "Telangana": "telangana", "West Bengal": "west-bengal",
    "Madhya Pradesh": "madhya-pradesh", "Punjab": "punjab", "Uttarakhand": "uttarakhand", "Jharkhand": "jharkhand",
    "Chhattisgarh": "chhattisgarh", "Himachal Pradesh": "himachal-pradesh", "Dadra & N Haveli & Daman & Diu": "dnh-dd",
    "Keralam": "kerala", "Assam": "assam", "Sikkim": "sikkim", "Goa": "goa", "Bihar": "bihar",
    "Jammu and Kashmir": "jammu-kashmir", "Delhi": "delhi", "Puducherry": "puducherry", "Meghalaya": "meghalaya",
    "Chandigarh": "chandigarh", "Tripura": "tripura", "Arunachal Pradesh": "arunachal-pradesh", "Manipur": "manipur",
    "Nagaland": "nagaland", "Mizoram": "mizoram", "Ladakh": "ladakh", "A&N Islands": "andaman-nicobar",
    "All India": "india",
}

# Columns of Statement 7A (values) and 7B (percentage shares) that we keep.
COLS_7A = {"factories-in-operation": 0, "persons-engaged": 5, "gva": 9}
COLS_7B = {"factories-in-operation": 0, "persons-engaged": 5, "gva": 9}
UNITS = {"factories-in-operation": "number", "persons-engaged": "persons", "gva": "rupees lakh"}

SRC_3A = "ASI 2024-25 Summary Results, Statement 3A"
SRC_API = "eSankhyiki API, ASI, NIC 2008, all industries"


def statement_3a(text):
    """Statement 3A: {indicator: {year: value}} for the five years it prints."""
    start = text.index("Statement 3A: Value of Principal Characteristics")
    block = text[start : text.index("Statement 3B", start)].splitlines()
    years = next(re.findall(r"\d{4}-\d{2}", l) for l in block if len(re.findall(r"\d{4}-\d{2}", l)) == 5)
    out = {}
    for key, (label, _, _) in INDICATORS.items():
        line = next(l for l in block if re.match(rf"\s*{re.escape(label)}\s{{2,}}", l))
        nums = re.findall(r"(?<![\w.])\d+(?![\w.])", line)[-5:]
        out[key] = dict(zip(years, nums))
    return years, out


def statement_rows(text, title, end, ncols):
    """Rows of a by-state statement: {state name: [numbers as printed]}."""
    start = text.index(title)
    block = text[start : text.index(end, start)].splitlines()
    rows = {}
    for line in block:
        m = re.match(r"\s*([A-Za-z&][A-Za-z&. ]*?)\s{2,}([\d.\s]+)$", line)
        if not m or m.group(1) not in STATES:
            continue
        nums = m.group(2).split()
        if len(nums) != ncols:
            raise SystemExit(f"{title}: {m.group(1)} has {len(nums)} numbers, expected {ncols}")
        rows[m.group(1)] = nums
    return rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--raw", default="raw/economy/asi")
    ap.add_argument("--work", default="work/economy/asi")
    ap.add_argument("--out", default="research/data/economy")
    a = ap.parse_args()

    text = open(os.path.join(a.work, "asi-2024-25-summary-results.txt"), encoding="utf-8").read()
    years, s3a = statement_3a(text)
    old_years, old_3a = statement_3a(open(os.path.join(a.work, "asi-2023-24-summary-results.txt"), encoding="utf-8").read())

    api_path = os.path.join(a.raw, "api", "asi-nic2008-allindia-total.all.json")
    api_rows = json.load(open(api_path, encoding="utf-8"))["rows"]
    first_page = json.load(open(os.path.join(a.raw, "api", "asi-nic2008-allindia-total.p1.json"), encoding="utf-8"))
    total = first_page["meta_data"]["totalRecords"]
    if len(api_rows) != total:
        raise SystemExit(f"API: {len(api_rows)} rows, the API reported {total}. Fetch again.")
    api = {}
    for r in api_rows:
        assert r["state"] == "All India" and r["nic_code"] == "99999" and r["sector"] == "Combined" and r["nic_classification"] == 2008
        for key, (_, name, _) in INDICATORS.items():
            if r["indicator"] == name:
                api.setdefault(key, {})[r["year"]] = r["value"]

    # Checks: the API against Statement 3A of both editions, where they overlap.
    for key in INDICATORS:
        for y in years:
            if y in api[key] and api[key][y] != s3a[key][y]:
                print(f"check: {key} {y}: API {api[key][y]}, Statement 3A (2024-25) {s3a[key][y]}")
        for y in old_years:
            if old_3a[key][y] != s3a[key].get(y, old_3a[key][y]):
                print(f"check: {key} {y}: Statement 3A 2023-24 {old_3a[key][y]}, 2024-25 {s3a[key][y]}")
            if y in api[key] and api[key][y] != old_3a[key][y]:
                print(f"check: {key} {y}: API {api[key][y]}, Statement 3A (2023-24) {old_3a[key][y]}")
    print("check: API years", min(api["gva"]), "to", max(api["gva"]))

    # India series: Statement 3A for its five years, the API for the years before.
    out = []
    for key, (_, _, unit) in INDICATORS.items():
        for y in sorted(set(api[key]) | set(years)):
            if y in years:
                out.append({"geography": "india", "period": y, "indicator": key, "value": s3a[key][y], "unit": unit, "source": SRC_3A})
            else:
                out.append({"geography": "india", "period": y, "indicator": key, "value": api[key][y], "unit": unit, "source": SRC_API})
    path = os.path.join(a.out, "asi-factory-sector-india.csv")
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["geography", "period", "indicator", "value", "unit", "source"], lineterminator="\n")
        w.writeheader()
        w.writerows(out)
    print(path, len(out), "rows")

    # States: Statement 7A values, 7B shares.
    s7a = statement_rows(text, "Statement 7A: Value of Principal Characteristics by State/UT", "Statement 7B", 12)
    s7b = statement_rows(text, "Statement 7B: Percentage Distribution", "Statement 8A", 11)
    for name, rows_ in (("7A", s7a), ("7B", s7b)):
        if set(rows_) != set(STATES):
            raise SystemExit(f"Statement {name}: missing {set(STATES) - set(rows_)}")
    for key, col in COLS_7A.items():
        india = int(s7a["All India"][col])
        states = sum(int(v[col]) for k, v in s7a.items() if k != "All India")
        print(f"check: {key}: states add to {states}, All India {india} (Lakshadweep is in All India only)")
        if india != int(s3a[key]["2024-25"]):
            raise SystemExit(f"{key}: 7A All India {india} differs from 3A {s3a[key]['2024-25']}")
    rows = []
    for key, col in COLS_7A.items():
        for name, slug in STATES.items():
            share = s7b[name][COLS_7B[key]]
            rows.append({"geography": slug, "period": "2024-25", "indicator": key, "value": s7a[name][col], "unit": UNITS[key], "share_of_india": share})
        # Lakshadweep: MoSPI gives no separate estimate (fewer than 3 units surveyed).
        rows.append({"geography": "lakshadweep", "period": "2024-25", "indicator": key, "value": "", "unit": UNITS[key], "share_of_india": ""})
    path = os.path.join(a.out, "asi-by-state-2024-25.csv")
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["geography", "period", "indicator", "value", "unit", "share_of_india"], lineterminator="\n")
        w.writeheader()
        w.writerows(rows)
    print(path, len(rows), "rows")


if __name__ == "__main__":
    main()
