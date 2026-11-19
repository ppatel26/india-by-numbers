"""Build the extended population tables. Run with python3 -I from the repo root."""

import csv
import gzip
import re
import subprocess
from collections import defaultdict
from decimal import Decimal
from pathlib import Path

import xlrd

DATA = Path("research/data/population")
RAW = Path("raw/population")
INDIA = "india"
OFFICIAL = "official"
PROJECTION = "official projection"
UN = "international estimate"
AGE_GROUPS = [f"{age}-{age + 4}" for age in range(0, 80, 5)] + ["80+"]
CENSUS_1961_AGES = AGE_GROUPS[:7] + ["35-44", "45-59", "60+"]
METRICS = {"birth_rate": "CBR", "death_rate": "CDR", "fertility_rate": "TFR"}
UN_RATES = "UN WPP 2024, Demographic Indicators, Medium"
SRS_COMPENDIUM = "SRS Compendium 1971-2013, Table 1"
MOHFW = "MoHFW Technical Group, July 2020"
STATE_GROUPS = [
    ("india", "jammu-kashmir", "himachal-pradesh"),
    ("punjab", "haryana", "delhi"),
    ("rajasthan", "uttar-pradesh", "bihar"),
    ("assam", "west-bengal", "jharkhand"),
    ("odisha", "chhattisgarh", "madhya-pradesh"),
    ("gujarat", "maharashtra", "andhra-pradesh"),
    ("karnataka", "kerala", "tamil-nadu"),
    ("chandigarh", "uttarakhand", "sikkim"),
    ("arunachal-pradesh", "nagaland", "manipur"),
    ("mizoram", "tripura", "meghalaya"),
    ("daman-diu", "dadra-nagar-haveli", "goa"),
    ("lakshadweep", "puducherry", "andaman-nicobar"),
    ("telangana", "ladakh"),
]


def read_csv(path):
    with path.open(newline="", encoding="utf-8-sig") as file:
        return list(csv.DictReader(file))


def write_csv(name, header, rows):
    with (DATA / name).open("w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file, lineterminator="\n")
        writer.writerow(header)
        writer.writerows(rows)


def pdf_text(path):
    return subprocess.check_output(
        ["pdftotext", "-layout", str(RAW / path), "-"], encoding="utf-8"
    )


def un_india(path):
    with gzip.open(RAW / path, "rt", encoding="utf-8-sig", newline="") as file:
        return [
            row for row in csv.DictReader(file)
            if row["ISO3_code"] == "IND" and 1950 <= int(row["Time"]) <= 2026
        ]


def srs_rates():
    rates = {}
    first_page = next(page for page in pdf_text("srs-compendium/compendium.pdf").split("\f")
                      if re.search(r"^1971\s+36\.9\s", page, re.M))
    for line in first_page.splitlines():
        match = re.fullmatch(r"\s*(19\d{2}|20\d{2})\*?\s+([\d.\s]+)", line)
        if match:
            year = int(match[1])
            values = match[2].split()
            assert len(values) == 15, line
            rates[year] = (tuple(values[index] for index in (0, 3, 12)), SRS_COMPENDIUM)
    assert list(rates) == list(range(1971, 2014))

    for edition, start in ((2018, 2013), (2024, 2019)):
        report = pdf_text(f"srs{edition}/report.pdf")
        totals = []
        for number in (12, 13, 15):
            page = re.split(rf"Table {number}: Annual Estimates", report, flags=re.I)[1].split("\f", 1)[0]
            row = re.search(r"^India\s+((?:\d+\.\d+\s+){18})", page, re.M)
            assert row, (edition, number)
            totals.append(row[1].split()[:6])
        for year, values in enumerate(zip(*totals), start):
            if year in rates:
                assert rates[year][0] == values, (year, rates[year], values)
            else:
                rates[year] = (values, f"SRS Statistical Report {edition}, Tables 12, 13 and 15")
    assert list(rates) == list(range(1971, 2025))
    assert rates[2024][0] == ("18.3", "6.4", "1.9")
    return rates


def show_comparison(label, differences):
    largest = max(differences, key=lambda year: abs(differences[year]))
    print(f"{label}: {len(differences)} years, signed range "
          f"{min(differences.values()):+.3f} to {max(differences.values()):+.3f}; "
          f"largest in {largest}; last {max(differences)} = {differences[max(differences)]:+.3f}")


def national_rates(wpp, srs):
    rows = []
    for index, (metric, column) in enumerate(METRICS.items()):
        show_comparison(metric, {
            year: Decimal(values[index]) - Decimal(wpp[year][column])
            for year, (values, _) in srs.items()
        })
        for year, row in wpp.items():
            if year in srs:
                values, source = srs[year]
                rows.append((year, metric, values[index], "srs", OFFICIAL, source))
            else:
                basis = "wpp_estimate" if year < 1971 else "wpp_projection"
                rows.append((year, metric, row[column], basis, UN, UN_RATES))
    write_csv("vital-rates-india-1950-2026.csv",
              ["period", "series", "value", "basis", "source_kind", "source"], rows)


def national_srb(wpp, report):
    def girls(year):
        return Decimal(100000) / Decimal(wpp[year]["SRB"])

    srs = {
        int(row["mid_year"]): row
        for row in read_csv(DATA.parent / "health/sex-ratio-at-birth-india.csv")
        if row["residence"] == "total"
    }
    assert list(srs) == list(range(1999, 2024))
    show_comparison("SRS SRB minus annual WPP at the middle year", {
        year: Decimal(row["value"]) - girls(year) for year, row in srs.items()
    })
    table = report.split("PROJECTED VALUES OF SEX RATIO AT BIRTH FOR INDIA AND MAJOR STATES:", 1)[1].split("\f", 1)[0]
    assumptions = re.search(r"^India\s+906\s+896\s+(\d+)\s+(\d+)\s+\d+", table, re.M)
    assert assumptions and assumptions[2] == "905"
    print(f"2026 SRB: MoHFW {assumptions[2]}, UN {girls(2026):.2f}")
    print(f"2021 SRB: MoHFW {assumptions[1]}, SRS 2020-22 {srs[2021]['value']}")
    rows = [
        (year, year, round(girls(year), 3), "wpp_estimate", UN, UN_RATES)
        for year in range(1950, 1999)
    ]
    rows += [
        (year, row["period"], row["value"], "srs", OFFICIAL, row["source_doc"])
        for year, row in srs.items()
    ]
    rows += [
        (year, year, assumptions[index], "mohfw", PROJECTION, f"{MOHFW}, Table 6")
        for index, year in enumerate((2021, 2026), 1)
    ]
    write_csv("sex-ratio-at-birth-india-1950-2026.csv",
              ["year", "period", "value", "basis", "source_kind", "source"], rows)


def age_tables(report, wpp_age):
    page = next(page for page in report.split("\f") if re.search(
        r"Projected Population By Age and Sex as on 01st March[^\n]*\n\s+INDIA\b", page
    ))
    census, projection = page.split("2026", 1)
    by_age = {}
    for year, section in ((2011, census), (2026, projection)):
        for line in section.splitlines():
            cells = line.replace(",", "").split()
            if cells and cells[0] in AGE_GROUPS:
                assert len(cells) == 10, line
                by_age[year, cells[0]] = [int(value) * 1000 for value in cells[2:4]]
    assert len(by_age) == 34
    assert by_age[2026, "0-4"] == [56943000, 51767000]
    assert abs(sum(sum(by_age[2026, age]) for age in AGE_GROUPS) - 1425908000) <= 34000

    un_counts = defaultdict(int)
    for row in wpp_age:
        age = "80+" if int(row["AgeGrpStart"]) >= 80 else row["AgeGrp"]
        for sex, column in (("male", "PopMale"), ("female", "PopFemale")):
            un_counts[int(row["Time"]), age, sex] += int(Decimal(row[column]) * 1000)
    census_counts = {
        (r["age_group"], r["sex"]): int(r["value"])
        for r in read_csv(DATA / "population-pyramid-2011.csv") if r["age_group"] in AGE_GROUPS
    }
    for year in (2011, 2026):
        differences = {
            (age, sex): (census_counts[age, sex] if year == 2011 else by_age[year, age][i])
            - un_counts[year, age, sex]
            for age in AGE_GROUPS for i, sex in enumerate(("male", "female"))
        }
        print(f"{year} age counts, Indian source minus UN: sum {sum(differences.values())}, "
              f"range {min(differences.values())} to {max(differences.values())}, "
              f"under five {differences['0-4', 'male'] + differences['0-4', 'female']}")
    print(f"2011 smoothed MoHFW minus Census, under five: "
          f"{sum(by_age[2011, '0-4']) - sum(census_counts['0-4', sex] for sex in ('male', 'female'))}")
    rows = [
        (INDIA, 1951, age, sex, un_counts[1951, age, sex], "persons", UN,
         "UN WPP 2024, Population by Age and Sex, Medium")
        for age in AGE_GROUPS for sex in ("male", "female")
    ] + [
        (INDIA, 2026, age, sex, by_age[2026, age][i], "persons", PROJECTION, f"{MOHFW}, Table 18")
        for age in AGE_GROUPS for i, sex in enumerate(("male", "female"))
    ]
    early_page = next(page for page in pdf_text("census-1961/tables.pdf").split("\f")
                      if "438,936,918" in page and "66,102,638" in page)
    early_rows = {}
    for line in early_page.split("NORTHERN ZONE", 1)[0].splitlines():
        cells = line.replace(",", "").split()
        if cells and cells[0] in CENSUS_1961_AGES:
            persons, male, female = map(int, cells[1:4])
            assert persons == male + female
            early_rows[cells[0]] = (male, female)
    assert list(early_rows) == CENSUS_1961_AGES
    assert sum(sum(counts) for counts in early_rows.values()) + 176469 == 438936918
    un_1961 = sum(un_counts[1961, age, sex] for age in AGE_GROUPS for sex in ("male", "female"))
    print(f"1961 age counts: Census C-III with stated age {438936918 - 176469:,}; UN {un_1961:,}")
    rows += [
        (INDIA, 1961, age, sex, early_rows[age][i], "persons", OFFICIAL, "Census 1961, C-III Part A")
        for age in CENSUS_1961_AGES for i, sex in enumerate(("male", "female"))
    ]
    write_csv("population-pyramid-1951-2026.csv",
              ["geography", "period", "age_group", "sex", "value", "unit", "source_kind", "source"],
              sorted(rows, key=lambda row: row[1]))


def growth(projections):
    rows = []
    for slug in (r["geography"] for r in read_csv(DATA / "urban-share-by-state-2011.csv")
                 if r["series"] == "urban_share_pct"):
        start, end = (projections[slug, year] for year in (2011, 2026))
        value = (Decimal(end) / Decimal(start) - 1) * 100
        note = f"2011 base: {start:,} thousand. 2026 projection: {end:,} thousand."
        rows.append((slug, "2011-2026", round(value, 2), PROJECTION, f"{MOHFW}, Table 8", note))
    assert len(rows) == 37
    write_csv("population-growth-by-state-2011-2026.csv",
              ["geography", "period", "value", "source_kind", "source", "note"], rows)

    counts = [(int(r["period"]), int(r["population"]))
              for r in read_csv(DATA / "population-census-1901-2011.csv")]
    periods = [(first, last, OFFICIAL, "Census 2011, Table A-02")
               for first, last in zip(counts, counts[1:])]
    # Calculate growth over each interval using the published endpoints.
    periods.append((counts[-1], (2026, projections[INDIA, 2026] * 1000), PROJECTION, f"{MOHFW}, Table 8"))
    write_csv("population-growth-india-1901-2026.csv",
              ["year", "period", "value", "source_kind", "source"], [
        (end_year, f"{start_year}-{end_year}",
         round(100 * ((end / start) ** (1 / (end_year - start_year)) - 1), 3), kind, source)
        for (start_year, start), (end_year, end), kind, source in periods
    ])


def urban_projection(report, projections):
    table = re.split(r"\f\s+TABLE - 10\s*\n", report, maxsplit=1)[1]
    table = re.split(r"\f\s+TABLE\s*[–-]\s*11\b", table, maxsplit=1)[0]
    pages = [page for page in table.split("\f") if "Urban Population to Total Population" in page]
    assert len(pages) == len(STATE_GROUPS)
    values = {}
    for page, group in zip(pages, STATE_GROUPS):
        assert all(slug.split("-")[0].upper() in page.upper()
                   for slug in group if slug not in {"daman-diu", "dadra-nagar-haveli"})
        years = range(2011, 2027) if INDIA in group else (2011, 2026)
        for year in years:
            row = re.search(rf"^\s*{year}\s+((?:\d+\.\d+\s+){{{3 * len(group)}}})", page, re.M)
            assert row, (group, year)
            values.update({
                (slug, year): value for slug, value in zip(group, row[1].split()[::3])
                if slug == INDIA or year in (2011, 2026)
            })

    combined_ut = next(page for page in report.split("\f")
                       if "Projected Urban Population by Sex as on 1st March" in page
                       and "DAMAN & DIU" in page and "HAVELI" in page)
    for year in (2011, 2026):
        row = re.search(rf"^{year}\s+((?:[\d,]+\s+){{9}})", combined_ut, re.M)
        assert row, year
        daman, dadra, _ = (int(value.replace(",", "")) for value in row[1].split()[::3])
        del values["daman-diu", year], values["dadra-nagar-haveli", year]
        values["dnh-dd", year] = round(Decimal(daman + dadra) / projections["dnh-dd", year] * 100, 2)
    assert len(values) == 88 and values[INDIA, 2011] == "31.14" and values[INDIA, 2026] == "36.01"

    boundary_changes = {"andhra-pradesh", "jammu-kashmir", "telangana", "ladakh"}
    states = {
        r["geography"]: Decimal(values[r["geography"], 2011]) - Decimal(r["value"])
        for r in read_csv(DATA / "urban-share-by-state-2011.csv")
        if r["series"] == "urban_share_pct" and r["geography"] not in boundary_changes | {INDIA}
    }
    assert len(states) == 32
    low, high = min(states, key=states.get), max(states, key=states.get)
    print(f"2011 urban share, MoHFW minus Census: {states[low]:+.2f} ({low}) to {states[high]:+.2f} ({high})")

    un = un_urban_shares()
    show_comparison("MoHFW urban share minus WUP", {
        year: Decimal(values[INDIA, year]) - un[year] for year in range(2011, 2026)
    })
    write_csv("urban-share-projected-2012-2026.csv",
              ["geography", "period", "value", "source_kind", "source"], [
        (slug, year, value, PROJECTION, f"{MOHFW}, Tables 8 and 9" if slug == "dnh-dd" else f"{MOHFW}, Table 10")
        for (slug, year), value in values.items() if year > 2011
    ])


def un_urban_shares():
    return {
        int(row["Year"]): Decimal(row["Urban"])
        for row in read_csv(RAW / "wpp-2024/share-of-population-urban.csv") if row["Code"] == "IND"
    }


def urban_history():
    study = pdf_text("census-urban/urban-study.pdf")
    early = re.search(r"^\s*INDIA\s+(10\.84(?:\s+\d+\.\d+){8})\*", study, re.M)
    assert early
    rows = [(year, value, OFFICIAL, "ORGI Urbanisation Study, Appendix Table VI.2")
            for year, value in zip(range(1901, 1982, 10), early[1].split())]
    report = pdf_text("nfhs-1992/india.pdf")
    shares = re.search(r"^\s*Percent urban\s+19\.9\s+23\.7\s+(26\.1)", report, re.M)
    assert shares
    rows.append((1991, shares[1], OFFICIAL, "IIPS NFHS-1, Table 1.1, citing ORGI"))
    sheet = xlrd.open_workbook(RAW / "census-2001/pca.xls").sheet_by_index(0)
    assert sheet.row_values(0)[6:11] == ["LEVEL", "NAME", "TRU", "No_HH", "TOT_P"]
    totals = {sheet.cell_value(i, 8): int(sheet.cell_value(i, 10)) for i in range(1, 4)}
    assert totals["Rural"] + totals["Urban"] == totals["Total"]
    rows.append((2001, round(100 * Decimal(totals["Urban"]) / totals["Total"], 2),
                 OFFICIAL, "Census 2001, Primary Census Abstract"))
    census_2011 = next(r["value"] for r in read_csv(DATA / "urban-share-by-state-2011.csv")
                       if r["geography"] == INDIA and r["series"] == "urban_share_pct")
    rows.append((2011, census_2011, OFFICIAL, "Census 2011, Table A-01"))
    un = un_urban_shares()
    differences = {year: Decimal(value) - un[year] for year, value, _, _ in rows if year in un}
    show_comparison("Census urban share minus WUP", differences)
    print(f"1991 Census urban share minus WUP: {differences[1991]:+.3f}")
    write_csv("urban-share-india-1901-2011.csv", ["period", "value", "source_kind", "source"], rows)


def projected_rates(report, wpp, srs):
    # Use the report's names to identify state rows. Keep its combined north-east group out of state views.
    def slug(name):
        name = name.strip().lower().removesuffix(" (ut)")
        return {"nct of delhi": "delhi", "jammu & kashmir": "jammu-kashmir"}.get(name, name.replace(" ", "-"))

    tfr = {}
    tfr_table = report.split("PROJECTED LEVELS OF TOTAL FERTILITY RATES (TFR)", 1)[1].split("\f", 1)[0]
    # The PDF wraps one Karnataka value onto the next row.
    tfr_table = re.sub(
        r"(KARNATAKA[^\n]*?1\.72)\s+1\.61\s+1\.60\s+1\.64",
        r"\1 1.64 1.61 1.60", tfr_table,
    )
    for name, numbers in re.findall(r"^([A-Za-z &()]+?)\s+((?:\d+\.\d+\s+){6})", tfr_table, re.M):
        tfr[slug(name)] = numbers.split()
    assert len(tfr) == 23 and tfr[INDIA][4] == "1.81"

    srb = {}
    srb_table = report.split("PROJECTED VALUES OF SEX RATIO AT BIRTH FOR INDIA AND MAJOR STATES:", 1)[1].split("\f", 1)[0]
    for name, numbers in re.findall(r"^([A-Za-z &()]+?)\s+((?:\d{3}\s+){5})", srb_table, re.M):
        srb[slug(name)] = numbers.split()
    assert set(tfr) == set(srb) and srb[INDIA][3] == "905"

    cbr = {}
    cdr = {}
    for page in report.split("\f"):
        heading = re.search(r"Demographic Indicators : 2011-2035\s+([^\n]+)", page)
        if not heading:
            continue
        name = heading[1]
        # Odisha is named once on its page, in the Table 17 heading.
        if name.startswith("Indicator"):
            assert re.search(r"^\s*ODISHA\s*$", page, re.M)
            name = "ODISHA"
        geography = slug(name)
        if geography not in tfr:
            continue
        for table, label in ((cbr, "Birth"), (cdr, "Death")):
            row = re.search(rf"Crude {label} Rate \(C[BD]R\)\s+((?:\d+\.\d+\s+){{5}})", page)
            assert row, (name, label)
            table[geography] = row[1].split()
    assert set(tfr) == set(cbr) == set(cdr) and cbr[INDIA][3] == "14.4" and cdr[INDIA][3] == "7.1"

    for i, (metric, table, column) in enumerate((
        ("birth_rate", cbr, "CBR"), ("death_rate", cdr, "CDR"), ("fertility_rate", tfr, "TFR")
    )):
        mo = Decimal(table[INDIA][3 if i < 2 else 4])
        same_period = sum(Decimal(srs[year][0][i]) for year in range(2016, 2021)) / 5
        mo_same_period = table[INDIA][1 if i < 2 else 2]
        print(f"{metric}: MoHFW 2026-30 {mo}, WPP 2026 {wpp[2026][column]}, "
              f"SRS 2024 {srs[2024][0][i]}; 2016-20 SRS mean {same_period}, MoHFW {mo_same_period}")

    rows = []
    for metric, table, index, period, table_number in (
        ("fertility_rate", tfr, 4, "2026-30", "3"),
        ("birth_rate", cbr, 3, "2026-30", "17A"),
        ("death_rate", cdr, 3, "2026-30", "17A"),
        ("sex_ratio_at_birth", srb, 3, "2026", "6"),
    ):
        rows.extend((slug, period, metric, values[index], PROJECTION, f"{MOHFW}, Table {table_number}")
                    for slug, values in table.items())
    write_csv("vital-rates-projected-by-state.csv",
              ["geography", "period", "series", "value", "source_kind", "source"], rows)


def main():
    wpp = {int(row["Time"]): row for row in un_india("wpp-2024/WPP2024_Demographic_Indicators_Medium.csv.gz")}
    assert list(wpp) == list(range(1950, 2027))
    report = pdf_text("mohfw/archived.pdf")
    projections = {
        (r["geography"], int(r["period"])): int(r["value"])
        for r in read_csv(DATA / "population-projections-2011-2036.csv")
        if r["series"] == "persons"
    }
    census = read_csv(DATA / "population-census-1901-2011.csv")
    show_comparison("Census population minus WPP 1 July, in thousands", {
        int(row["period"]): Decimal(row["population"]) / 1000 - Decimal(wpp[int(row["period"])]["TPopulation1July"])
        for row in census if int(row["period"]) in wpp
    })
    show_comparison("MoHFW 1 March population minus WPP 1 July, in thousands", {
        year: projections[INDIA, year] - Decimal(wpp[year]["TPopulation1July"])
        for year in range(2011, 2027)
    })
    print(f"2026 population: MoHFW {projections[INDIA, 2026]} thousand; "
          f"WPP 1 January {wpp[2026]['TPopulation1Jan']}, 1 July {wpp[2026]['TPopulation1July']}")
    print(f"WPP July growth 2011 to 2026: "
          f"{100 * (Decimal(wpp[2026]['TPopulation1July']) / Decimal(wpp[2011]['TPopulation1July']) - 1):.2f}%")
    srs = srs_rates()
    national_rates(wpp, srs)
    national_srb(wpp, report)
    age_tables(report, un_india("wpp-2024/age.csv.gz"))
    growth(projections)
    urban_projection(report, projections)
    urban_history()
    projected_rates(report, wpp, srs)


if __name__ == "__main__":
    main()
