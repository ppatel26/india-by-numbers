"""Build the SRS cause-of-death CSV from the pdftotext output of two ORGI reports:
SRS Cause of Death in India 2021-2023 and 2022-2024. Reads Table 2.1A (major cause groups by sex)
and Table 2.3A (top 10 causes, all ages) from each.
First: pdftotext -layout on raw/health/srs-cod-2021-23.pdf and srs-cod-2022-24.pdf
(pipeline/health/extract_text.sh does it).
Run: python3 -I pipeline/health/build_srs_cod.py --work work/health --out research/data/health"""
import argparse, csv, re
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument("--work", default="work/health", help="folder with the pdftotext output")
ap.add_argument("--out", default="research/data/health")
args = ap.parse_args()
WORK, OUT = Path(args.work), Path(args.out)

EDITIONS = {"2021-23": "srs-cod-2021-23.txt", "2022-24": "srs-cod-2022-24.txt"}
# Table 2.1A rows, in the published order, with the start of each label.
GROUPS = [
    ("non-communicable", "Non-Communicable diseases"),
    ("communicable-maternal-perinatal-nutritional", "Communicable,"),
    ("injuries", "Injuries"),
    ("ill-defined", "Symptoms, signs and Ill-defined"),
]
# Table 2.3A causes: our key and the start of ORGI's label.
CAUSES = {
    "Cardiovascular diseases": "cardiovascular",
    "Malignant and other Neoplasms": "neoplasms",
    "Respiratory diseases": "respiratory-diseases",
    "Digestive diseases": "digestive",
    "Respiratory infections": "respiratory-infections",
    "Fever of unknown origin": "fever-unknown-origin",
    "Unintentional injuries: Other Than Motor Vehicle": "unintentional-injuries-other",
    "Diabetes mellitus": "diabetes",
    "Genito-urinary diseases": "genito-urinary",
    "Ill-defined/All other symptoms, signs and abnormal": "ill-defined",
    "All Other Remaining Causes": "all-other",
}
SEXES = ("male", "female", "person")


def table(lines, title, end):
    # Skip the list of tables at the front of the report.
    i = next(k for k, l in enumerate(lines) if title in l and k > 300)
    j = next(k for k in range(i + 1, len(lines)) if end(lines[k]))
    return lines[i:j]


rows = []
for period, name in EDITIONS.items():
    lines = (WORK / name).read_text(encoding="utf-8", errors="replace").splitlines()
    edition = f"SRS Cause of Death in India {period[:4]}-20{period[-2:]}"

    # Table 2.1A: each data line holds male n, %, female n, %, person n, %.
    t = table(lines, "Table 2.1A - Distribution of Deaths by Major Cause Groups", lambda l: "P a g e" in l)
    data = [l for l in t if re.fullmatch(r"\s*(?:[A-Za-z, ]+?\s+)?(\d+\s+[\d.]+\s+){2}\d+\s+[\d.]+\s*", l)]
    assert len(data) == 4, (period, data)
    text = "\n".join(t)
    pos = [text.find(label) for _, label in GROUPS]
    assert all(p >= 0 for p in pos) and pos == sorted(pos), (period, pos)
    total = 0.0
    for (key, _), l in zip(GROUPS, data):
        nums = re.findall(r"\d+(?:\.\d+)?", l)[-6:]
        for k, sex in enumerate(SEXES):
            rows.append(["india", period, "cause-group", key, "", sex, nums[2 * k + 1], "percent of deaths", nums[2 * k],
                         f"{edition}, Table 2.1A", ""])
        total += float(nums[5])
    assert abs(total - 100) < 0.15, (period, total)
    # The Total row: 100.0 per sex, and the sample deaths coded (printed as 89,106 and 1,51,472).
    # The counts sit on the Total line or wrap onto the next line.
    counts = re.findall(r"\d{1,3}(?:,\d{2,3})+", text[text.find("\nTotal"):])
    assert len(counts) == 3, (period, counts)
    n = [int(c.replace(",", "")) for c in counts]
    assert n[0] + n[1] == n[2], (period, n)
    for sex, n in zip(SEXES, counts):
        rows.append(["india", period, "cause-group", "total", "", sex, "100.0", "percent of deaths", n.replace(",", ""),
                     f"{edition}, Table 2.1A", "sample deaths coded"])

    # Table 2.3A: rank, cause, male %, female %, person %. Long labels wrap onto the next line.
    t = table(lines, "Table 2.3A – Top 10 Causes of Deaths in India", lambda l: l.startswith("Note:"))
    seen = 0
    for l in t:
        m = re.match(r"^\s*(\d+)?\s*([A-Za-z][A-Za-z/:,\- ]+?)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*$", l)
        if not m:
            continue
        label = m.group(2).strip()
        key = next(v for c, v in CAUSES.items() if label.startswith(c[:30]))
        rank = m.group(1) or ""
        note = "ORGI ranks this group last: it holds deaths that could not be diagnosed" if key == "ill-defined" else ""
        for sex, v in zip(SEXES, m.groups()[2:]):
            rows.append(["india", period, "top-10", key, rank, sex, v, "percent of deaths", "", f"{edition}, Table 2.3A", note])
        seen += 1
    assert seen == 11, (period, seen)

with open(OUT / "srs-causes-of-death-india.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["geography", "period", "table", "cause", "rank", "sex", "value", "unit", "sample_deaths", "source_doc", "note"])
    w.writerows(rows)
print(f"srs-causes-of-death-india.csv: {len(rows)} rows")

v = {(r[1], r[2], r[3], r[5]): r[6] for r in rows}
assert v[("2022-24", "cause-group", "non-communicable", "person")] == "60.1"
assert v[("2022-24", "cause-group", "ill-defined", "female")] == "12.9"
assert v[("2021-23", "cause-group", "communicable-maternal-perinatal-nutritional", "person")] == "23.4"
assert v[("2022-24", "top-10", "cardiovascular", "person")] == "32.1"
assert v[("2021-23", "top-10", "respiratory-infections", "person")] == "9.3"
for period in EDITIONS:
    s = sum(float(v[(period, "top-10", k, "person")]) for k in CAUSES.values())
    assert abs(s - 100) < 0.15, (period, s)
