"""Build the international CSVs from the files in raw/international/.

Run pipeline/international/fetch.sh first. Then, from the repository root:

    python3 -I pipeline/international/build_international.py

Reads the World Bank WDI API responses (nine series, one panel of countries, one WDI update) and
the UN DESA International Migrant Stock 2024 workbooks. Writes eleven CSVs to
research/data/international/. Every value keeps the publisher's digits: WDI values are copied from
the JSON text, UN DESA counts from the cells.

The script stops with an error if a checked value (CHECKS) or a cross-check differs:
- every WDI response carries the same "lastupdated" date, and each series states CC BY-4.0;
- WDI life expectancy and fertility match UN WPP 2024 (medium variant) for the seven countries;
- WDI women's labour force participation matches the ILOSTAT copy of the ILO modelled series;
- each UN DESA sheet states CC BY 3.0 IGO;
- the India row of the origin file equals the India row (destination World) of the
  destination-and-origin file, and the destination countries add up to it, for every year and sex.
"""
import argparse, csv, gzip, json, os, sys

WDI_RELEASE = "2026-11-11"
# Rule R6: one panel for every chart. Never change it to change India's rank.
PANEL = ["IND", "BGD", "PAK", "NPL", "LKA", "CHN", "IDN", "WLD"]

# (file, WDI code, unit, first WPP projection year or None, status for every row)
# A series may lack some panel countries; MISSING lists them, and the script checks the list.
SERIES = [
    ("wdi-gdp-per-person-ppp.csv", "NY.GDP.PCAP.PP.KD", "constant 2021 international $", None, ""),
    ("wdi-life-expectancy.csv", "SP.DYN.LE00.IN", "years", 2024, ""),
    ("wdi-fertility-rate.csv", "SP.DYN.TFRT.IN", "births per woman", 2024, ""),
    ("wdi-co2-per-person.csv", "EN.GHG.CO2.PC.CE.AR5", "t CO2e per person", None, ""),
    ("wdi-women-labour-force-participation.csv", "SL.TLF.CACT.FE.ZS", "% of women aged 15+", None, "modelled estimate"),
    ("wdi-rd-spending.csv", "GB.XPD.RSDV.GD.ZS", "% of GDP", None, ""),
    ("wdi-researchers-per-million.csv", "SP.POP.SCIE.RD.P6", "researchers per million people", None, ""),
    ("wdi-journal-articles.csv", "IP.JRN.ARTC.SC", "articles", None, ""),
    ("wdi-armed-forces-share-of-labour-force.csv", "MS.MIL.TOTL.TF.ZS", "% of labour force", None, ""),
]
# Panel countries with no value at all in a series (UNESCO UIS has no R&D survey for Bangladesh).
MISSING = {
    "GB.XPD.RSDV.GD.ZS": {"BGD"},
    "SP.POP.SCIE.RD.P6": {"BGD"},
}

ORIGIN = "undesa/undesa_pd_2024_ims_stock_by_sex_and_origin.xlsx"
DEST_ORIGIN = "undesa/undesa_pd_2024_ims_stock_by_sex_destination_and_origin.xlsx"
YEARS = [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024]
SEXES = ["total", "male", "female"]
INDIA_CODE = 356
WORLD_CODE = 900
# The ten largest destinations in 2024, as the chart lists them. The script checks the ranking.
TOP10 = ["United Arab Emirates", "United States of America", "Saudi Arabia", "Pakistan", "Kuwait",
         "United Kingdom", "Canada", "Australia", "Oman", "Qatar"]

CHECKS = [  # (csv, {column: value}, published value, where the publisher prints it)
    ("wdi-gdp-per-person-ppp.csv", dict(iso3="IND", period="2025"), "10039.0708910587", "WDI API, NY.GDP.PCAP.PP.KD"),
    ("wdi-gdp-per-person-ppp.csv", dict(iso3="CHN", period="2025"), "25066.5215296486", "WDI API, NY.GDP.PCAP.PP.KD"),
    ("wdi-gdp-per-person-ppp.csv", dict(iso3="WLD", period="2025"), "21913.5094934531", "WDI API, NY.GDP.PCAP.PP.KD"),
    ("wdi-life-expectancy.csv", dict(iso3="IND", period="2023"), "72.003", "WDI API, SP.DYN.LE00.IN"),
    ("wdi-life-expectancy.csv", dict(iso3="IND", period="1990"), "58.618", "WDI API, SP.DYN.LE00.IN"),
    ("wdi-life-expectancy.csv", dict(iso3="LKA", period="2023"), "77.483", "WDI API, SP.DYN.LE00.IN"),
    ("wdi-fertility-rate.csv", dict(iso3="IND", period="2023"), "1.975", "WDI API, SP.DYN.TFRT.IN"),
    ("wdi-fertility-rate.csv", dict(iso3="IND", period="1990"), "4.045", "WDI API, SP.DYN.TFRT.IN"),
    ("wdi-fertility-rate.csv", dict(iso3="PAK", period="2023"), "3.605", "WDI API, SP.DYN.TFRT.IN"),
    ("wdi-co2-per-person.csv", dict(iso3="IND", period="2024"), "2.17365173535787", "WDI API, EN.GHG.CO2.PC.CE.AR5"),
    ("wdi-co2-per-person.csv", dict(iso3="CHN", period="2024"), "9.31508933799393", "WDI API, EN.GHG.CO2.PC.CE.AR5"),
    ("wdi-co2-per-person.csv", dict(iso3="WLD", period="2024"), "4.69378456136626", "WDI API, EN.GHG.CO2.PC.CE.AR5"),
    ("wdi-women-labour-force-participation.csv", dict(iso3="IND", period="2024"), "32.415", "ILOSTAT, EAP_2WAP_SEX_AGE_RT_A"),
    ("wdi-women-labour-force-participation.csv", dict(iso3="IND", period="2025"), "32.425", "WDI API, SL.TLF.CACT.FE.ZS"),
    ("wdi-women-labour-force-participation.csv", dict(iso3="CHN", period="2025"), "59.148", "WDI API, SL.TLF.CACT.FE.ZS"),
    ("wdi-rd-spending.csv", dict(iso3="IND", period="2020"), "0.64558", "WDI API, GB.XPD.RSDV.GD.ZS"),
    ("wdi-rd-spending.csv", dict(iso3="CHN", period="2020"), "2.35712", "WDI API, GB.XPD.RSDV.GD.ZS"),
    ("wdi-rd-spending.csv", dict(iso3="WLD", period="2020"), "2.45606936077903", "WDI API, GB.XPD.RSDV.GD.ZS"),
    ("wdi-researchers-per-million.csv", dict(iso3="IND", period="2020"), "259.26325", "WDI API, SP.POP.SCIE.RD.P6"),
    ("wdi-researchers-per-million.csv", dict(iso3="IND", period="2000"), "110.62568", "WDI API, SP.POP.SCIE.RD.P6"),
    ("wdi-researchers-per-million.csv", dict(iso3="CHN", period="2020"), "1600.30633", "WDI API, SP.POP.SCIE.RD.P6"),
    ("wdi-journal-articles.csv", dict(iso3="IND", period="2023"), "228174.31", "WDI API, IP.JRN.ARTC.SC"),
    ("wdi-journal-articles.csv", dict(iso3="IND", period="1996"), "18904.78", "WDI API, IP.JRN.ARTC.SC"),
    ("wdi-armed-forces-share-of-labour-force.csv", dict(iso3="IND", period="2020"), "0.576119558133425", "WDI API, MS.MIL.TOTL.TF.ZS"),
    ("wdi-armed-forces-share-of-labour-force.csv", dict(iso3="IND", period="1990"), "0.409225569547725", "WDI API, MS.MIL.TOTL.TF.ZS"),
    ("wdi-armed-forces-share-of-labour-force.csv", dict(iso3="PAK", period="2020"), "1.25177962110476", "WDI API, MS.MIL.TOTL.TF.ZS"),
    ("migrants-from-india-1990-2024.csv", dict(period="2024", sex="total"), "18533845", "Origin file, Table 1, India"),
    ("migrants-from-india-1990-2024.csv", dict(period="1990", sex="total"), "6575416", "Origin file, Table 1, India"),
    ("migrants-from-india-1990-2024.csv", dict(period="2024", sex="female"), "6631602", "Origin file, Table 1, India"),
    ("migrants-from-india-by-destination.csv", dict(destination="United Arab Emirates", period="2024", sex="total"), "3248545", "Destination and origin file, Table 1"),
    ("migrants-from-india-by-destination.csv", dict(destination="United States of America", period="2024", sex="total"), "3165238", "Destination and origin file, Table 1"),
    ("migrants-from-india-by-destination.csv", dict(destination="Saudi Arabia", period="2024", sex="male"), "1774426", "Destination and origin file, Table 1"),
]


def fail(msg):
    sys.exit("check failed: " + msg)


def load(path):
    """A WDI JSON response, with every number kept as its text."""
    with open(path, encoding="utf-8") as f:
        return json.load(f, parse_float=str, parse_int=str)


def write(out, name, header, rows):
    with open(os.path.join(out, name), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(header)
        w.writerows(rows)
    print("%s: %d rows" % (name, len(rows)))


# ---------------------------------------------------------------------------------------------
# World Bank WDI


def metadata(raw, code):
    m = load(os.path.join(raw, "wdi", code + ".metadata.json"))
    var = m["source"][0]["concept"][0]["variable"][0]
    if var["id"] != code:
        fail("%s: metadata is for %s" % (code, var["id"]))
    return {x["id"]: x["value"] for x in var["metatype"]}


def build_wdi(raw, out):
    src = load(os.path.join(raw, "wdi", "source.json"))[1][0]
    if src["code"] != "WDI" or src["lastupdated"] != WDI_RELEASE:
        fail("WDI source record: %s, last updated %s" % (src["code"], src["lastupdated"]))
    release = "WDI, last updated " + WDI_RELEASE
    for name, code, unit, proj_from, status in SERIES:
        meta = metadata(raw, code)
        if meta.get("License_Type") != "CC BY-4.0":
            fail("%s: licence is %r" % (code, meta.get("License_Type")))
        page, data = load(os.path.join(raw, "wdi", code + ".data.json"))
        if page["lastupdated"] != WDI_RELEASE or page["pages"] != "1":
            fail("%s: page %s" % (code, page))
        rows = []
        for r in data:
            if r["indicator"]["id"] != code:
                fail("%s: row for %s" % (code, r["indicator"]["id"]))
            iso3 = r["countryiso3code"]
            if iso3 not in PANEL:
                fail("%s: country %s is not in the panel" % (code, iso3))
            if r["obs_status"]:
                fail("%s: %s %s has status %r" % (code, iso3, r["date"], r["obs_status"]))
            value = r["value"] or ""
            if value == "":
                continue
            row_status = status
            if proj_from and int(r["date"]) >= proj_from:
                row_status = "projection"
            country = "india" if iso3 == "IND" else r["country"]["value"]
            rows.append([country, iso3, r["date"], value, unit, code, row_status, release])
        if {r[1] for r in rows} != set(PANEL) - MISSING.get(code, set()):
            fail("%s: panel is %s" % (code, sorted({r[1] for r in rows})))
        rows.sort(key=lambda r: (PANEL.index(r[1]), r[2]))
        write(out, name, ["country", "iso3", "period", "value", "unit", "indicator", "status", "release"], rows)


def check_wpp(raw, out):
    """WDI life expectancy and fertility for the seven countries equal WPP 2024, medium variant, to 3 decimals."""
    wpp = {}
    with gzip.open(os.path.join(raw, "wpp-2024", "WPP2024_Demographic_Indicators_Medium.csv.gz"), "rt", encoding="utf-8", errors="replace") as f:
        for r in csv.DictReader(f):
            if r["ISO3_code"] in PANEL and r["Variant"] == "Medium" and 1990 <= int(r["Time"]) <= 2024:
                wpp[(r["ISO3_code"], r["Time"])] = {"SP.DYN.LE00.IN": r["LEx"], "SP.DYN.TFRT.IN": r["TFR"]}
    n = 0
    for name, code in (("wdi-life-expectancy.csv", "SP.DYN.LE00.IN"), ("wdi-fertility-rate.csv", "SP.DYN.TFRT.IN")):
        for r in csv.DictReader(open(os.path.join(out, name), encoding="utf-8")):
            k = (r["iso3"], r["period"])
            if r["iso3"] == "WLD" or k not in wpp:
                continue
            if abs(float(r["value"]) - float(wpp[k][code])) > 0.0005 + 1e-9:
                fail("%s %s %s: WDI %s, WPP 2024 %s" % (code, k[0], k[1], r["value"], wpp[k][code]))
            n += 1
    if n != 2 * 7 * 35:
        fail("WPP comparison covered %d values" % n)
    print("WPP 2024: %d WDI values match to 3 decimals" % n)


def check_ilostat(raw, out):
    """WDI women's labour force participation for India equals the ILOSTAT modelled series."""
    ilo = {}
    with open(os.path.join(raw, "ilostat", "EAP_2WAP_SEX_AGE_RT_A.IND.F.15plus.csv"), encoding="utf-8-sig") as f:
        for r in csv.DictReader(f):
            ilo[r["time"]] = r["obs_value"]
    wdi = {r["period"]: r["value"] for r in csv.DictReader(open(os.path.join(out, "wdi-women-labour-force-participation.csv"), encoding="utf-8")) if r["iso3"] == "IND"}
    for y in range(2020, 2026):
        if float(ilo[str(y)]) != float(wdi[str(y)]):
            fail("ILOSTAT %d: %s, WDI %s" % (y, ilo[str(y)], wdi[str(y)]))
    print("ILOSTAT: India 2020-2025 match WDI; ILOSTAT runs to %s" % max(ilo))


# ---------------------------------------------------------------------------------------------
# UN DESA International Migrant Stock 2024


def sheet_rows(path, sheet):
    import openpyxl  # imported here so the WDI part runs without it

    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    for name in wb.sheetnames:
        if name == "Table of contents":
            continue
        top = [c for row in wb[name].iter_rows(max_row=8, values_only=True) for c in row if isinstance(c, str)]
        if not any("CC BY 3.0 IGO" in c for c in top):
            fail("%s, %s: no CC BY 3.0 IGO line" % (os.path.basename(path), name))
    return list(wb[sheet].iter_rows(values_only=True))


def counts(row, first):
    """The 24 counts: both sexes, males, females, each 1990 to 2024."""
    out = {}
    for si, sex in enumerate(SEXES):
        for yi, y in enumerate(YEARS):
            v = row[first + si * 8 + yi]
            if not isinstance(v, int):
                fail("count %r for %s %d" % (v, sex, y))
            out[(y, sex)] = v
    return out


def build_migrants(raw, out):
    rows = sheet_rows(os.path.join(raw, ORIGIN), "Table 1")
    if rows[10][5:13] != tuple(YEARS) or rows[10][4] != "Location code":
        fail("origin file: header %r" % (rows[10],))
    india = [r for r in rows[11:] if r[4] == INDIA_CODE]
    if len(india) != 1 or india[0][1] != "India":
        fail("origin file: India row")
    origin = counts(india[0], 5)
    write(out, "migrants-from-india-1990-2024.csv", ["geography", "period", "sex", "value", "unit", "table"],
          [["india", y, s, origin[(y, s)], "persons", "International Migrant Stock 2024: Origin, Table 1"] for s in SEXES for y in YEARS])

    rows = sheet_rows(os.path.join(raw, DEST_ORIGIN), "Table 1")
    if rows[10][7:15] != tuple(YEARS) or rows[10][4] != "Location code of destination" or rows[10][6] != "Location code of origin":
        fail("destination and origin file: header %r" % (rows[10],))
    from_india = [r for r in rows[11:] if r[6] == INDIA_CODE]
    world = [r for r in from_india if r[4] == WORLD_CODE]
    if len(world) != 1 or counts(world[0], 7) != origin:
        fail("destination and origin file: India to World differs from the origin file")
    # Country codes are below 900; regions and groups use 900 and above.
    countries = [r for r in from_india if r[4] < WORLD_CODE]
    data = [(r[1].rstrip("*").strip(), r[4], r[3] or "", counts(r, 7)) for r in countries]
    for k in origin:
        if sum(c[k] for _, _, _, c in data) != origin[k]:
            fail("destinations do not add up to the India total for %s" % (k,))
    ranked = [d[0] for d in sorted(data, key=lambda d: -d[3][(2024, "total")])][:10]
    if ranked != TOP10:
        fail("top ten destinations in 2024: %r" % ranked)
    out_rows = [[name, code, dtype, y, s, c[(y, s)], "persons"] for name, code, dtype, c in data for s in SEXES for y in YEARS]
    write(out, "migrants-from-india-by-destination.csv", ["destination", "location_code", "data_type", "period", "sex", "value", "unit"], out_rows)
    print("UN DESA: %d destination countries add up to the India total for every year and sex" % len(data))


def run_checks(out):
    for name, where, want, table in CHECKS:
        hits = [r for r in csv.DictReader(open(os.path.join(out, name), encoding="utf-8")) if all(r[k] == v for k, v in where.items())]
        if len(hits) != 1 or hits[0]["value"] != want:
            fail("%s %s: %r, expected %s (%s)" % (name, where, [h["value"] for h in hits], want, table))
    print("%d checked values match" % len(CHECKS))


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--raw", default="raw/international")
    ap.add_argument("--out", default="research/data/international")
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    build_wdi(a.raw, a.out)
    check_wpp(a.raw, a.out)
    check_ilostat(a.raw, a.out)
    build_migrants(a.raw, a.out)
    run_checks(a.out)


if __name__ == "__main__":
    main()
