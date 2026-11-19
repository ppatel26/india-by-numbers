"""Build health CSVs from pdftotext output and saved HTML.
First run pipeline/health/extract_text.sh (PDF text into the work folder).
Run: python3 -I pipeline/health/build_health.py --raw raw/health --work work/health --out research/data/health"""
import argparse, csv, html, re, subprocess, sys
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument("--raw", default="raw/health")
ap.add_argument("--work", default="work/health", help="folder with the pdftotext output")
ap.add_argument("--out", default="research/data/health")
ap.add_argument("--geo", default="research/data/geography.csv")
args = ap.parse_args()
TXT, RAW, OUT, GEO = map(Path, (args.work, args.raw, args.out, args.geo))
OUT.mkdir(parents=True, exist_ok=True)

geo = {r["name"]: r["slug"] for r in csv.DictReader(open(GEO))}
ALIAS = {
    "India": "india", "INDIA": "india", "NCT of Delhi": "delhi", "Delhi": "delhi",
    "Jammu & Kashmir": "jammu-kashmir", "Jammu and Kashmir": "jammu-kashmir",
    "Andaman & Nicobar Islands": "andaman-nicobar", "A & N Islands": "andaman-nicobar",
    "Andaman and Nicobar Islands": "andaman-nicobar",
    "Dadra & Nagar Haveli and Daman & Diu": "dnh-dd", "Dadra & Nagar Haveli and D&D": "dnh-dd",
    "The Dadra & Nagar Haveli and Daman & Diu": "dnh-dd",
    "Dadra & Nagar Haveli and Daman & Diu": "dnh-dd",
}


def slug(name):
    name = " ".join(name.replace("*", "").split())
    if name in ALIAS:
        return ALIAS[name]
    if name in geo:
        return geo[name]
    raise KeyError(name)


def lines(name):
    return (TXT / name).read_text(encoding="utf-8", errors="replace").splitlines()


def write(name, header, rows):
    with open(OUT / name, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(header)
        w.writerows(rows)
    print(f"{name}: {len(rows)} rows")


# 1. IMR India 1971-2024 (total, rural, urban)
imr = {}
comp = lines("compendium.txt")
start = next(i for i, l in enumerate(comp) if "Annual estimates of Birth rate, Death rate, Natural growth rate, Infant mortality rate" in l and i > 1000)
for l in comp[start:start + 80]:
    m = re.match(r"^(\d{4})(\*?)\s+" + r"\s+".join([r"([\d.]+)"] * 15) + r"\s*$", l)
    if m:
        y, star = m.group(1), m.group(2)
        v = m.groups()[2:]
        imr[int(y)] = (v[9], v[10], v[11], "SRS Compendium 1971-2013, Table 1", "excludes Jammu and Kashmir" if star else "")
    if l.strip().startswith("2013"):
        break
for y in range(2014, 2025):
    b = lines(f"srs-bulletin-{y}.txt")
    i = next(i for i, l in enumerate(b) if re.search(r"Table 1: Estimated Birth Rate, Death Rate, Natural Growth Rate and Infant Mortality Rate", l, re.I))
    for l in b[i:i + 12]:
        nums = re.findall(r"\d+\.\d|\b\d+\b", l)
        if re.match(r"^\s*(India)?\s*[\d.]+", l) and len(re.findall(r"\d+\.\d", l)) == 9 and len(nums) == 12:
            imr[y] = (nums[9], nums[10], nums[11], f"SRS Bulletin {y}, Table 1", "")
            break
    else:
        raise SystemExit(f"IMR India row not found {y}")
rows = []
for y in sorted(imr):
    t, r, u, src, note = imr[y]
    for series, v in (("total", t), ("rural", r), ("urban", u)):
        rows.append(["india", y, series, v, "infant deaths per 1,000 live births", src, note])
write("imr-india-1971-2024.csv", ["geography", "period", "series", "value", "unit", "source_doc", "note"], rows)
assert imr[1971][0] == "129" and imr[2024][0] == "24" and imr[2013][0] == "40"

# 2. IMR by state 2024 (Table 1 of SRS Bulletin 2024)
b = lines("srs-bulletin-2024.txt")
i = next(i for i, l in enumerate(b) if "Table 1: Estimated Birth Rate" in l)
j = next(k for k in range(i, len(b)) if "Table 2" in b[k])
rows, group = [], "india"
pending = None
for l in b[i:j]:
    s = l.strip()
    if s.startswith("Bigger States"):
        group = "bigger"; continue
    if s.startswith("Smaller States"):
        group = "smaller"; continue
    if s.startswith("Union Territories"):
        group = "ut"; continue
    m = re.match(r"^\s*(?:\d+\.\s+)?([A-Za-z&*. ]+?)\s+((?:[\d.]+\s+){11}[\d.]+)\s*$", l)
    if s.startswith("3. Dadra"):
        pending = "Dadra & Nagar Haveli and Daman & Diu"; continue
    if pending and re.match(r"^\s+[\d.]+(\s+[\d.]+){11}\s*$", l):
        nums = l.split(); name = pending; pending = None
    elif m:
        name, nums = m.group(1), m.group(2).split()
    else:
        continue
    basis = "single year 2024" if group in ("india", "bigger") else "three-year pooled 2022-24"
    note = "based on 130 SRS units" if "Manipur" in name else ""
    rows.append([slug(name), "2024", nums[9], "infant deaths per 1,000 live births", group, basis, nums[10] if group in ("india", "bigger") else "", nums[11] if group in ("india", "bigger") else "", note])
write("imr-by-state-2024.csv", ["geography", "period", "value", "unit", "srs_group", "estimate_basis", "rural", "urban", "note"], rows)
assert len(rows) == 37, len(rows)

# 3. MMR India over time
mmr = [("1997-98", "398"), ("1999-01", "327"), ("2001-03", "301"), ("2004-06", "254"), ("2007-09", "212"),
       ("2010-12", "178"), ("2011-13", "167")]
ct = "\n".join(comp)
assert re.search(r"INDIA TOTAL\s+398\s+327\s+301\s+254\s+212\s+178\s+167", ct)
mm = "\n".join(lines("mmr-bulletin-2022-24.txt"))
m = re.search(r"130\s+122\s+113\s+103\s+97\s+93\s+88\s+88\s+87", mm, re.S)
assert m, "MMR trend labels"
later = list(zip(["2014-16", "2015-17", "2016-18", "2017-19", "2018-20", "2019-21", "2020-22", "2021-23", "2022-24"],
                 m.group(0).split()))
rows = [["india", p, v, "maternal deaths per 100,000 live births", "SRS Compendium 1971-2013, Table 13", ""] for p, v in mmr]
rows += [["india", p, v, "maternal deaths per 100,000 live births", "SRS Special Bulletin on Maternal Mortality 2022-24, chart labels", ""] for p, v in later]
write("mmr-india-1997-2024.csv", ["geography", "period", "value", "unit", "source_doc", "note"], rows)

# 4. MMR by state 2022-24
rows = []
for l in lines("mmr-bulletin-2022-24.txt"):
    m = re.match(r"^\s*([A-Za-z ]+?)\s+(\d+)\s+\((\d+),\s*(\d+)\)\s+(\d+)\s+([\d.]+)%\s*$", l)
    if not m:
        continue
    name = m.group(1).strip()
    if "SUBTOTAL" in name:
        continue
    if name == "Other states":
        g, grp = "other-states", "other"
    elif name == "INDIA":
        g, grp = "india", "india"
    else:
        g, grp = slug(name), ""
    rows.append([g, "2022-24", m.group(2), "maternal deaths per 100,000 live births", m.group(3), m.group(4), m.group(5), m.group(6)])
# subtotal rows have the label on a previous line; capture them separately
txt = "\n".join(lines("mmr-bulletin-2022-24.txt"))
for lab, g in (("EAG AND ASSAM\nSUBTOTAL", "eag-assam-subtotal"), ("SOUTH SUBTOTAL", "south-subtotal"), ("OTHER SUBTOTAL", "other-subtotal")):
    m = re.search(lab.replace("\n", r"\s*\n\s*") + r"\s+(\d+)\s+\((\d+),\s*(\d+)\)\s+(\d+)\s+([\d.]+)%", txt)
    assert m, lab
    rows.append([g, "2022-24", m.group(1), "maternal deaths per 100,000 live births", m.group(2), m.group(3), m.group(4), m.group(5)])
write("mmr-by-state-2022-24.csv", ["geography", "period", "value", "unit", "ci95_lower", "ci95_upper", "maternal_mortality_rate_per_100000_women_15_49", "lifetime_risk_pct"], rows)
assert len(rows) == 24, len(rows)

# 5. Life expectancy India 1970-75 to 2020-24
alt = lines("alt-2020-24.txt")
i = next(i for i, l in enumerate(alt) if l.strip().startswith("Expectation of life at birth by Sex and Residence, India*"))
rows = []
for l in alt[i:i + 50]:
    m = re.match(r"^\s*(\d{4}-\d{2})(#?)\s+(\d{4})\s+" + r"\s+".join([r"([\d.]+)"] * 9) + r"\s*$", l)
    if m:
        p, hsh, mid = m.group(1), m.group(2), m.group(3)
        v = m.groups()[3:]
        note = "excludes Jammu and Kashmir" if hsh else ""
        for k, (res, sex) in enumerate([(r, s) for r in ("total", "rural", "urban") for s in ("total", "male", "female")]):
            rows.append(["india", p, mid, res, sex, v[k], "years", note])
write("life-expectancy-india-1970-2024.csv", ["geography", "period", "mid_year", "residence", "sex", "value", "unit", "note"], rows)
assert len(rows) == 38 * 9, len(rows)

# 6. Life expectancy by state 2020-24
i = next(i for i, l in enumerate(alt) if "Expectation of life at birth by Sex and Residence, India and bigger" in l)
rows = []
for l in alt[i:i + 40]:
    m = re.match(r"^\s*([A-Za-z&* ]+?)\s+" + r"\s+".join([r"([\d.]+)"] * 9) + r"\s*$", l)
    if m:
        g = slug(m.group(1))
        v = m.groups()[1:]
        for k, (res, sex) in enumerate([(r, s) for r in ("total", "rural", "urban") for s in ("total", "male", "female")]):
            rows.append([g, "2020-24", res, sex, v[k], "years"])
write("life-expectancy-by-state-2020-24.csv", ["geography", "period", "residence", "sex", "value", "unit"], rows)
assert len(rows) == 23 * 9, len(rows)

# 7. NFHS-6 and NFHS-5 key indicators by state, plus NFHS-5 anaemia (PIB annexure)
nf = lines("nfhs6.txt")
app = next(i for i, l in enumerate(nf) if re.match(r"^\s*Appendix", l) and i > 400) if any(re.match(r"^\s*Appendix", l) for l in nf[400:]) else len(nf)
IND = {"35": "institutional-births", "45": "full-immunisation-card", "44": "full-immunisation-card-or-recall",
       "69": "stunted", "70": "wasted", "71": "severely-wasted"}
LABEL = {"institutional-births": "Institutional births (%)",
         "full-immunisation-card": "Children age 12-23 months fully vaccinated, based on vaccination card only (%)",
         "full-immunisation-card-or-recall": "Children age 12-23 months fully vaccinated, based on card or mother's recall (%)",
         "stunted": "Children under 5 years who are stunted (height-for-age) (%)",
         "wasted": "Children under 5 years who are wasted (weight-for-height) (%)",
         "severely-wasted": "Children under 5 years who are severely wasted (weight-for-height) (%)"}
VAL = r"(\(?[\d.]+\)?|\*|na)"
state = None
found = {}
for k, l in enumerate(nf[:app]):
    h = re.match(r"^\s+(.+?) - Key Indicators\s*$", l)
    if h:
        state = h.group(1).strip(); continue
    m = re.match(r"^\s*(\d+)\.\s", l)
    if not m or state is None or m.group(1) not in IND:
        continue
    code = IND[m.group(1)]
    # collect value cells from the label line and its wrapped lines, up to the next item
    block = [l]
    for nxt in nf[k + 1:k + 5]:
        if re.match(r"^\s*\d+\.\s", nxt) or re.search(r"Key Indicators|^\S", nxt):
            break
        block.append(nxt)
    vals = []
    for bl in block:
        segs = [s for s in re.split(r"\s{3,}", bl.strip()) if s]
        # the first segment of the label line is label text
        for s in segs[1:] if bl is l else segs:
            for tok in s.split():
                if re.fullmatch(VAL, tok):
                    vals.append(tok)
        if bl is l and len(segs) == 1 and re.fullmatch(VAL, segs[0]):
            vals.append(segs[0])
    if len(vals) != 4:
        raise SystemExit(f"bad values {state} {code}: {vals} {block}")
    if (state, code) in found:
        continue
    found[(state, code)] = tuple(vals)
rows = []


def clean(v):
    if v in ("*", "na"):
        return "", "not shown: fewer than 25 unweighted cases" if v == "*" else "not available"
    if v.startswith("("):
        return v.strip("()"), "based on 25-49 unweighted cases"
    return v, ""


states = []
for (s, c) in found:
    if s not in states:
        states.append(s)
for s in states:
    for c in IND.values():
        u, r, t6, t5 = found[(s, c)]
        for rnd, per, v in (("NFHS-6", "2023-24", t6), ("NFHS-5", "2019-21", t5)):
            val, note = clean(v)
            rows.append([slug(s), per, rnd, c, LABEL[c], val, "percent", "NFHS-6 India and State/UT Fact Sheets (May 2026)", note])
# anaemia NFHS-5 from PIB 1782638 annexure
ph = (RAW / "pib-1782638.html").read_text(encoding="utf-8", errors="replace")
seg = ph[ph.find("<u>Annexure-I</u>"):]
seg = seg[:seg.find("</table>")]
cells = [" ".join(html.unescape(re.sub(r"<[^>]+>", " ", c)).split()) for c in re.findall(r"<td[^>]*>(.*?)</td>", seg, re.S | re.I)]
an = []
for a in range(len(cells) - 2):
    if re.fullmatch(r"\d+", cells[a]) and re.fullmatch(r"[\d.]+", cells[a + 2]) and not re.fullmatch(r"[\d.]+", cells[a + 1]):
        an.append((cells[a + 1], cells[a + 2]))
    if cells[a] in ("India", "INDIA", "All India") and re.fullmatch(r"[\d.]+", cells[a + 1]):
        an.append(("India", cells[a + 1]))
for name, v in an:
    rows.append([slug(name), "2019-21", "NFHS-5", "anaemia-women-15-49", "All women age 15-49 years who are anaemic (%)", v, "percent", "PIB release 1782638 (17 Dec 2021), Annexure-I", ""])
pt = " ".join(html.unescape(re.sub(r"<[^>]+>", " ", ph)).split())
mi = re.search(r"([\d.]+) percent women in the age group of 15-49 years are estimated to be anaemic in the country", pt)
assert mi and mi.group(1) == "57.0"
rows.append(["india", "2019-21", "NFHS-5", "anaemia-women-15-49", "All women age 15-49 years who are anaemic (%)", mi.group(1), "percent", "PIB release 1782638 (17 Dec 2021), text", ""])
print("anaemia rows", len(an) + 1, an[-3:])
assert len(an) == 36
write("nfhs-key-indicators-by-state.csv", ["geography", "period", "round", "indicator", "indicator_label", "value", "unit", "source_doc", "note"], rows)

# 8. OOPE share: India time series and states 2023-24
subprocess.run(
    [sys.executable, "-I", Path(__file__).with_name("build_health_spending.py"),
     "--raw", RAW, "--out", OUT, "--geo", GEO],
    check=True,
)

# Extra: U5MR and NMR by state 2024 (Statements 53 and 48)
sr = lines("srs-statreport-2024.txt")
rows = []
i = next(i for i, l in enumerate(sr) if l.strip() == "Statement 53" and i > 8000)
for l in sr[i:i + 35]:
    m = re.match(r"^\s*([A-Za-z&* ]+?)\s+" + r"\s+".join([r"(\d+)"] * 9) + r"\s*$", l)
    if m:
        v = m.groups()[1:]
        note = "three-year pooled 2022-24" if "*" in m.group(1) else ""
        rows.append([slug(m.group(1)), "2024", "u5mr", v[0], v[3], v[6], v[1], v[2], "deaths under age 5 per 1,000 live births", note])
i = next(i for i, l in enumerate(sr) if l.strip() == "Statement 48" and i > 8000)
for l in sr[i:i + 35]:
    m = re.match(r"^\s*([A-Za-z&* ]+?)\s+(\d+)\s+(\d+)\s+(\d+)\s+[\d.]+\s+[\d.]+\s+[\d.]+\s*$", l)
    if m:
        note = "three-year pooled 2022-24" if "*" in m.group(1) else ""
        rows.append([slug(m.group(1)), "2024", "nmr", m.group(2), m.group(3), m.group(4), "", "", "neonatal deaths (under 29 days) per 1,000 live births", note])
write("child-mortality-by-state-2024.csv", ["geography", "period", "indicator", "total", "rural", "urban", "male", "female", "unit", "note"], rows)
assert sum(1 for r in rows if r[2] == "u5mr") == 23 and sum(1 for r in rows if r[2] == "nmr") == 23
