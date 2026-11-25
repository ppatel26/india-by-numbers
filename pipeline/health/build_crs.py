"""Build the CRS 2024 CSVs from the pdftotext output of the ORGI report.
Reads Statement 2 (estimated events and level of registration), Statements 10 and 11 (registered
births and deaths, 2024 column) and Statement 26 (sex ratio of registered births, 2017-2024).
First: pdftotext -layout raw/health/crs-2024.pdf work/health/crs-2024.txt (extract_text.sh does it).
Run: python3 -I pipeline/health/build_crs.py --work work/health --out research/data/health"""
import argparse, csv, re
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument("--work", default="work/health", help="folder with the pdftotext output")
ap.add_argument("--out", default="research/data/health")
ap.add_argument("--geo", default="research/data/geography.csv")
args = ap.parse_args()
TXT, OUT, GEO = Path(args.work) / "crs-2024.txt", Path(args.out), Path(args.geo)

geo = {r["name"]: r["slug"] for r in csv.DictReader(open(GEO))}
ALIAS = {
    "India": "india", "A & N Islands": "andaman-nicobar", "Jammu & Kashmir": "jammu-kashmir",
    "Jammu & Kashmir (J&K)": "jammu-kashmir", "D & N Haveli & Daman & Diu": "dnh-dd",
}
NAMES = sorted(list(geo) + list(ALIAS), key=len, reverse=True)
NUM = r"(?:\d+(?:\.\d+)?|N\.A\.)"


def slug(name):
    return ALIAS.get(name) or geo[name]


def row_name(line):
    """The state name at the start of a table row (after an optional serial number), or None."""
    s = re.sub(r"^\s*\d+\.\s+", "", line).strip()
    for n in NAMES:
        if s.startswith(n) and (len(s) == len(n) or s[len(n)] == " "):
            return n, s[len(n):].split()
    return None


text = TXT.read_text(encoding="utf-8", errors="replace").splitlines()


def block(title, end):
    i = next(k for k, l in enumerate(text) if l.strip().startswith(title) and k > 400)
    j = next(k for k in range(i + 1, len(text)) if text[k].strip().startswith(end))
    return text[i:j]


def write(name, header, rows):
    with open(OUT / name, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(header)
        w.writerows(rows)
    print(f"{name}: {len(rows)} rows")


# Statement 2: mid-year population ('000), estimated births and deaths, level of registration.
st2 = {}
for l in block("Statement 2: Estimated Events", "Note: Mid-Year Population"):
    r = row_name(l)
    if r and len(r[1]) == 5 and all(re.fullmatch(NUM, t) for t in r[1]):
        st2[slug(r[0])] = r[1]
assert len(st2) == 37, len(st2)
assert st2["india"] == ["1404910", "25709853", "8991424", "99.1", "99.4"]


# Statements 10 and 11: registered events, 2015 to 2024. Take the 2024 column (the last).
def registered(title, end):
    out, b = {}, block(title, end)
    for k, l in enumerate(b):
        r = row_name(l)
        if r and r[1] and re.fullmatch(r"\d+", r[1][-1]):
            out[slug(r[0])] = r[1][-1]
        # The merged UT spans three lines; its 2020-24 values sit on the line with serial "3.".
        if re.match(r"^\s*3\.\s+\d", l) and "D & N Haveli" in " ".join(b[k - 2:k + 2]):
            out["dnh-dd"] = l.split()[-1]
    # India's 2021 cell wraps onto the next line in the PDF, but the 2024 cell does not.
    return out


reg_births = registered("Statement 10: Number of registered births", "Note: N.A.")
reg_deaths = registered("Statement 11: Number of registered deaths", "Note: N.A.")
assert len(reg_births) == 37 and len(reg_deaths) == 37, (len(reg_births), len(reg_deaths))
assert reg_births["india"] == "25473389" and reg_deaths["india"] == "8938301"
for reg in (reg_births, reg_deaths):
    assert sum(int(v) for g, v in reg.items() if g != "india") == int(reg["india"])

rows = []
for g, (pop, eb, ed, lb, ld) in st2.items():
    for event, est, lor, reg in (("births", eb, lb, reg_births[g]), ("deaths", ed, ld, reg_deaths[g])):
        # The uncapped ratio is our division of two published counts (derived), for checks only.
        ratio = f"{100 * int(reg) / int(est):.1f}"
        note = "India: all registered events over all estimated events" if g == "india" else (
            "published level is 100.0; registered events exceed the estimate" if float(ratio) > 100 else "")
        rows.append([g, "2024", event, lor, "percent of estimated events", est, reg, pop, ratio, note])
write("crs-registration-level-by-state-2024.csv",
      ["geography", "period", "event", "value", "unit", "estimated_events", "registered_events",
       "mid_year_population_thousand", "registered_to_estimated_derived", "note"], rows)
# The published level never exceeds 100.0, while our ratio passes it for many states: ORGI caps it.
assert max(float(r[3]) for r in rows) == 100.0
for r in rows:
    if r[0] != "india":
        assert r[3] == "100.0" if float(r[8]) >= 100 else abs(float(r[3]) - float(r[8])) <= 0.1, r

# Statement 26: sex ratio of registered births, 2017-2024. No India row; the India value for 2024
# is in paragraph 3.18.1.
YEARS = [str(y) for y in range(2017, 2025)]
srb = {}
b = block("Statement 26: Sex Ratio at Birth (SRB) based on registered events", "Note : Sex Ratio")
for k, l in enumerate(b):
    r = row_name(l)
    if r and len(r[1]) == 8:
        srb[slug(r[0])] = r[1]
    elif r and r[0] == "Ladakh":
        srb["ladakh"] = [""] * 3 + r[1][-5:]
    if re.match(r"^\s*3\.\s+\d", l) and "D & N Haveli" in " ".join(b[k - 2:k + 2]):
        srb["dnh-dd"] = [""] * 3 + l.split()[-5:]
assert len(srb) == 36, len(srb)
para = " ".join(" ".join(text).split())
m = re.search(r"for the year 2024 for All India \(excluding figures of Sikkim\) stood at (\d+) females", para)
assert m and m.group(1) == "933"
rows = [["india", "2024", m.group(1), "girls per 1,000 boys, registered births", "excludes Sikkim; paragraph 3.18.1"]]
for g, vals in srb.items():
    for y, v in zip(YEARS, vals):
        note = ""
        if v == "N.A.":
            v, note = "", "not available"
        elif v == "" and g == "ladakh":
            note = "included in Jammu and Kashmir"
        elif v == "" and g == "dnh-dd":
            note = "published for Dadra and Nagar Haveli and for Daman and Diu separately"
        rows.append([g, y, v, "girls per 1,000 boys, registered births", note])
write("crs-sex-ratio-at-birth-by-state.csv", ["geography", "period", "value", "unit", "note"], rows)
s24 = {r[0]: r[2] for r in rows if r[1] == "2024"}
assert s24["arunachal-pradesh"] == "1050" and s24["nagaland"] == "806" and s24["sikkim"] == ""
