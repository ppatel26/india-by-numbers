"""Build the women in elected office CSVs: panchayats (MoPR) and state assemblies (MoSPI).

Usage: python3 -I pipeline/elections/build_representation.py [--raw raw/elections] [--out research/data/elections]
       [--geo research/data/geography.csv]

Reads:
  - <raw>/mopr/basic-statistics-pri-2025.pdf: Ministry of Panchayati Raj, Basic Statistics of Panchayati
    Raj Institutions 2025, Table 3.5 (elected representatives and women elected representatives by
    state, as on 31 Mar 2025) and Table 3.2 (the national totals), with pdftotext;
  - Table 5.4 of MoSPI, Women and Men in India 2025 (<raw>/mospi/women-and-men-2025.pdf, printed page
    232, PDF page 264), which is an image: its values are transcribed below from the page image.

Writes two CSVs and stops on any difference:
  - Table 3.5: the states add up to the Table 3.2 totals (24,14,943 and 11,69,896); each printed share
    equals women / all to two decimals, rounded or cut (MoPR does both).
  - Table 5.4: men + women = total for every row; the rows add up to the printed Total row (3721, 389,
    4110); each printed share is women / total rounded half up to a whole number, as the table's note says.
"""
import argparse
import csv
import re
import subprocess
import sys

ap = argparse.ArgumentParser()
ap.add_argument("--raw", default="raw/elections")
ap.add_argument("--out", default="research/data/elections")
ap.add_argument("--geo", default="research/data/geography.csv")
a = ap.parse_args()

errors = []
checked = 0


def check(ok, msg):
    global checked
    checked += 1
    if not ok:
        errors.append(msg)


geo = {r["name"].lower(): r["slug"] for r in csv.DictReader(open(a.geo))}
ALIAS = {
    "andaman &nico- bar islands": "andaman-nicobar",
    "dadra & nagar haveli and daman and diu": "dnh-dd",
    "jammu& kashmir": "jammu-kashmir",
    "jammu and kashmir": "jammu-kashmir",
}


def slug(name):
    n = re.sub(r"\s+", " ", name.strip().lower())
    s = ALIAS.get(n) or geo.get(n)
    if not s:
        sys.exit(f"unknown state: {name!r}")
    return s


def write(name, header, rows):
    with open(f"{a.out}/{name}", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(header)
        w.writerows(rows)
    print(f"{name}: {len(rows)} rows")


# ---------------------------------------------------------------- MoPR Table 3.5

MOPR = "MoPR, Basic Statistics of Panchayati Raj Institutions 2025"
text = subprocess.run(["pdftotext", "-layout", f"{a.raw}/mopr/basic-statistics-pri-2025.pdf", "-"],
                      capture_output=True, text=True, check=True).stdout
check("Reproduction is permitted provided an acknowledgement of the source is made." in text, "MoPR: reproduction line")
t32 = text[text.index("Table 3.2: Basic data on Panchayati Raj Institutions"):]
tot_er = int(re.search(r"Number of Elected Members of PRIs\s+([\d,]+)", t32).group(1).replace(",", ""))
tot_w = int(re.search(r"Number of Elected Women Representatives\s+([\d,]+)", t32).group(1).replace(",", ""))
t35 = text[text.index("Table 3.5 State-wise details"):text.index("Table 3.6 States/UTs")]
check("Data as on 31st March, 2025" in t35, "MoPR Table 3.5: date note")
# A row: serial number, category, name, three values. Two UT names wrap onto the lines around them.
rows = re.findall(r"^\s*(\d{1,2})\s+(?:State|Union)?\s*(.*?)\s{2,}(\d+|Nil|N/A)\s+(\d+|Nil|N/A)\s+([\d.]+|Nil|N/A)", t35, flags=re.M)
WRAPPED = {"29": "Andaman &Nico- bar Islands", "30": "Dadra & Nagar Haveli and Daman and Diu"}
# Why a state has no value: Table 3.5's remarks, shortened.
NO_VALUE = {
    "Nil": "Panchayats dissolved; elections not held yet (MoPR, 31 Mar 2025)",
    "N/A": "Not covered by Part IX of the Constitution (MoPR)",
}
check(len(rows) == 34, f"MoPR Table 3.5: {len(rows)} rows")
pri = []
s_er = s_w = 0
for sl, name, er, w, pct in rows:
    g = slug(WRAPPED.get(sl, name))
    if er.isdigit():
        s_er += int(er)
        s_w += int(w)
        # MoPR rounds some shares and cuts others to two decimals (Bihar 44.8053 prints 44.81,
        # Karnataka 52.8776 prints 52.87), so either form passes.
        exact = 100 * int(w) / int(er)
        check(pct in (f"{exact:.2f}", f"{int(exact * 100) / 100:.2f}"), f"MoPR {g}: share {pct}, computed {exact:.4f}")
        for measure, v, unit in (("elected representatives", er, "persons"), ("women elected representatives", w, "persons"),
                                 ("women share", pct, "% of elected representatives")):
            pri.append([g, "2025-03-31", measure, v, unit, "", "", f"{MOPR}, Table 3.5"])
    else:
        pri.append([g, "2025-03-31", "women share", "", "% of elected representatives", "", NO_VALUE[er], f"{MOPR}, Table 3.5"])
check((s_er, s_w) == (tot_er, tot_w) == (2414943, 1169896), f"MoPR: states add to {s_er}, {s_w}; Table 3.2 {tot_er}, {tot_w}")
pri += [["india", "2025-03-31", "elected representatives", str(tot_er), "persons", "", "", f"{MOPR}, Table 3.2"],
        ["india", "2025-03-31", "women elected representatives", str(tot_w), "persons", "", "", f"{MOPR}, Table 3.2"],
        # Derived (rule R3): MoPR prints no national share.
        ["india", "2025-03-31", "women share", f"{100 * tot_w / tot_er:.2f}", "% of elected representatives",
         "women elected representatives / elected representatives x 100, from Table 3.2", "", f"{MOPR}, Table 3.2"]]
write("panchayat-representatives-by-state-2025.csv",
      ["geography", "period", "measure", "value", "unit", "derived", "note", "report_table"], pri)

# ---------------------------------------------------------------- MoSPI Table 5.4 (transcribed)

WMI = "MoSPI, Women and Men in India 2025, Table 5.4 (source: Election Commission of India)"
# State, year of assembly election, men, women, women (%), total; as printed.
T54 = """
Andhra Pradesh|2024|153|22|13|175
Arunachal Pradesh|2024|47|3|6|50
Assam|2021|120|6|5|126
Bihar|2025|214|29|12|243
Chhattisgarh|2023|71|19|21|90
Delhi|2025|65|5|7|70
Goa|2022|37|3|8|40
Gujarat|2022|167|15|8|182
Haryana|2019|77|13|14|90
Himachal Pradesh|2022|67|1|1|68
Jammu and Kashmir|2014|87|3|3|90
Jharkhand|2019|69|12|15|81
Karnataka|2023|214|10|4|224
Kerala|2021|129|11|8|140
Madhya Pradesh|2023|203|27|12|230
Maharashtra|2019|266|22|8|288
Manipur|2022|55|5|8|60
Meghalaya|2023|57|3|5|60
Mizoram|2023|37|3|8|40
Nagaland|2023|58|2|3|60
Odisha|2024|136|11|7|147
Punjab|2022|104|13|11|117
Puducherry|2021|29|1|3|30
Rajasthan|2023|179|20|10|199
Sikkim|2024|28|4|13|32
Tamil Nadu|2021|222|12|5|234
Telangana|2023|109|10|8|119
Tripura|2023|51|9|15|60
Uttar Pradesh|2022|356|47|12|403
Uttarakhand|2022|62|8|11|70
West Bengal|2021|252|40|14|292
"""
TOTAL = (3721, 389, "9.46", 4110)
mla = []
sm = sw = st = 0
for line in T54.strip().splitlines():
    name, year, men, women, pct, total = line.split("|")
    g = slug(name)
    m_, w_, t_ = int(men), int(women), int(total)
    sm, sw, st = sm + m_, sw + w_, st + t_
    check(m_ + w_ == t_, f"Table 5.4 {name}: {m_} + {w_} != {t_}")
    # Rounded half up, as printed (Sikkim 12.5 prints 13).
    check(int(100 * w_ / t_ + 0.5) == int(pct), f"Table 5.4 {name}: share {pct}, computed {100 * w_ / t_:.2f}")
    for measure, v, unit in (("men", men, "MLAs"), ("women", women, "MLAs"), ("total", total, "MLAs"),
                             ("women share", pct, "% of MLAs, rounded to a whole number")):
        mla.append([g, year, measure, v, unit, f"Assembly election of {year}", WMI])
check((sm, sw, st) == (TOTAL[0], TOTAL[1], TOTAL[3]), f"Table 5.4: rows add to {sm}, {sw}, {st}")
check(f"{100 * TOTAL[1] / TOTAL[3]:.2f}" == TOTAL[2], "Table 5.4: India share")
mla += [["india", "", "men", str(TOTAL[0]), "MLAs", "Latest assembly in each state, elections from 2014 to 2025", WMI],
        ["india", "", "women", str(TOTAL[1]), "MLAs", "Latest assembly in each state, elections from 2014 to 2025", WMI],
        ["india", "", "total", str(TOTAL[3]), "MLAs", "Latest assembly in each state, elections from 2014 to 2025", WMI],
        ["india", "", "women share", TOTAL[2], "% of MLAs", "Latest assembly in each state, elections from 2014 to 2025", WMI]]
write("women-mlas-by-state.csv", ["geography", "election_year", "measure", "value", "unit", "note", "report_table"], mla)

if errors:
    print("\n".join(errors), file=sys.stderr)
    sys.exit(f"{len(errors)} of {checked} checks failed")
print(f"all {checked} checks passed")
