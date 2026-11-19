"""Build the Jobs history CSVs from official PDFs.

Run from the repo root: python3 -I pipeline/jobs/build_jobs_history.py
The raw paths and report tables are listed in research/data/jobs/README.md.
"""
import argparse
import csv
import re
import subprocess
from decimal import Decimal
from pathlib import Path

SEXES = ("male", "female", "person")
SECTORS = ("rural", "urban", "rural+urban")
STATUSES = ("own account worker and employer", "helper in household enterprise", "all self-employed",
            "regular wage/salary", "casual labour", "all")
INDUSTRIES = {
    "agriculture": "A",
    "mining & quarrying": "B",
    "manufacturing": "C",
    "electricity, water, etc.": "DE",
    "construction": "F",
    "trade, hotel & restaurant": "GI",
    "transport, storage & communications": "HJ",
    "other services": "KLMNOPQRSTU",
}
NSS = "NSS employment and unemployment survey"
NSS_EARLY = "NSS before the 30-day rule"
PLFS = "PLFS July to June"
USUAL = "usual status (ps+ss)"
PERIOD = r"20\d\d-\d\d"
DECIMAL = r"\d+\.\d"


def require(condition, message):
    if not condition:
        raise ValueError(message)


def pdf(raw, name):
    return subprocess.run(
        ["pdftotext", "-layout", str(raw / name / "report.pdf"), "-"],
        check=True, capture_output=True, text=True,
    ).stdout


def statement(report, number):
    match = re.search(rf"(?m)^ *Statement {number}: ", report)
    require(match, f"Statement {number} not found")
    return report[match.start():].split("\f", 1)[0]


def plfs_youth(report, number):
    block = statement(report, number)
    periods = re.findall(rf"PLFS \(({PERIOD})\)", next(line for line in block.splitlines()
                         if re.match(rf"^ *PLFS \({PERIOD}\)", line)))
    require(len(periods) >= 2, f"Statement {number}: expected at least two years")
    result = {}
    for sector in SECTORS:
        line = re.search(rf"(?m)^ *{re.escape(sector)} +(.+)$", block)
        values = re.findall(DECIMAL, line[1])
        require(len(values) == 3 * len(periods), f"Statement {number}: youth row {sector}")
        for (period, sex), value in zip(((p, s) for p in periods for s in SEXES), values):
            result[period, sector, sex] = value
    return result


def plfs_status(report, number):
    # The status statement can span several pages. Read the six-value rows up to its final period.
    start = re.search(rf"(?m)^ *Statement {number}: Percentage distribution of workers", report)
    require(start, f"Statement {number} not found")
    stop = re.search(rf"(?m)^ *Statement {number + 1}: ", report[start.end():])
    require(stop, f"Statement {number}: next statement not found")
    block = report[start.start():start.end() + stop.start()]
    result = {}
    period = sector = None
    for line in block.splitlines():
        line = line.strip()
        year = re.fullmatch(rf"PLFS \(({PERIOD})\)", line)
        if year:
            period = year[1]
        if line.replace(" ", "") in SECTORS:
            sector = line.replace(" ", "")
        row = re.fullmatch(rf"(male|female|person) +((?:{DECIMAL} +){{5}}{DECIMAL})", line)
        if row and period and sector:
            for status, value in zip(STATUSES, row[2].split()):
                result[period, sector, row[1], status] = value
    return result


def plfs_industry(report, number):
    block = statement(report, number)
    result = {}
    period = None
    label = None
    for line in block.splitlines():
        line = line.strip().lower()
        if line.startswith("note"):
            break
        year = re.fullmatch(rf"plfs \(({PERIOD})\)", line)
        if year:
            period = year[1]
            continue
        if not period:
            continue
        # Names sometimes wrap before or after the values.
        name, *values = re.split(rf"(?={DECIMAL})", line, maxsplit=1)
        name = name.strip()
        if name.startswith("transport,") or name == "communications":
            name = "transport, storage & communications"
        if name.startswith("electricity,") or name in ("water, etc.", "etc."):
            name = "electricity, water, etc."
        if name == "mining &":
            name = "mining & quarrying"
        if name in ("trade, hotel &", "restaurant"):
            name = "trade, hotel & restaurant"
        if name in INDUSTRIES or name == "all":
            label = name
        if values:
            values = values[0].split()
            require(label and len(values) == 9 and all(re.fullmatch(DECIMAL, v) for v in values),
                    f"Statement {number}: industry row {line!r}")
            for (sector, sex), value in zip(((a, s) for a in SECTORS for s in SEXES), values):
                key = (period, sector, sex, label)
                require(key not in result, f"Statement {number}: repeated industry row {key}")
                result[key] = value
            label = None
    return result


def table_blocks(report, table):
    title = re.compile(rf"(?im)^ *table +\(?{table}\)? *:")
    matches = list(title.finditer(report))
    for i, match in enumerate(matches):
        yield report[match.start():matches[i + 1].start() if i + 1 < len(matches) else None]


def nss_pages(report, table):
    """Select the appendix tables headed All-India, by area and sex."""
    result = {}
    for block in table_blocks(report, table):
        header = re.search(
            r"(?im)^ *all-india +(?P<area>rural *\+ *urban|combined|rural|urban) +"
            r"(?P<sex>male *\+ *female|person[s]?|total|female|male) *$", block[:1200]
        )
        require(header, f"Table {table}: missing area or sex")
        sector = header["area"].lower().replace(" ", "").replace("combined", "rural+urban")
        sex = header["sex"].lower().replace(" ", "")
        if sex in ("male+female", "total", "persons"):
            sex = "person"
        require((sector, sex) not in result, f"Table {table}: repeated page {sector} {sex}")
        result[sector, sex] = block[header.end():].split("\f", 1)[0]
    require(len(result) in (6, 9), f"Table {table}: incomplete national tables")
    return result


def activity_rows(block, all_industries, width):
    """Read selected activity-code rows, with proportions followed by two counts."""
    rows = {}
    status = None
    activity = r"\d+(?: *(?:,|&|-) *\d+)*"
    industry_code = r"[\dx]+(?:-\d+)?"
    for line in block.splitlines():
        row = re.fullmatch(rf" *(?:({activity}) +)?({industry_code}) +"
                           rf"((?:(?:\d+|-) +){{{width - 1}}}(?:\d+|-)) *", line, re.I)
        if not row:
            continue
        if row[1]:
            status = row[1].replace(" ", "").replace(",", "&")
        industry = row[2].lower()
        values = [int(value) if value != "-" else 0 for value in row[3].split()]
        if industry == "x":
            if status in ("81", "11-81", "11-97", "11-99"):
                rows[status] = values
        elif industry in all_industries and status in ("11&12&21", "31", "41&51", "41-51", "11-51"):
            rows[status] = values
    return rows


def nss_population_50(block):
    # The 50th round prints alternating age columns on two lines.
    match = re.search(r"(?im)^ *ESTIMATED PERSONS \(00\)([^\n]*)\n *\n([^\n]*)", block)
    require(match, "NSS 50th round: missing age populations")
    first = re.findall(r"\d+", match[1])
    second = re.findall(r"\d+", match[2])
    require(len(first) == len(second) == 8, "NSS 50th round: age population columns")
    return [int(value) for pair in zip(first, second) for value in pair]


def percent(numerator, denominator):
    return f"{Decimal(numerator) * 100 / Decimal(denominator):.1f}"


def nss_annual(age_rows, age_column, exact_counts):
    employed = age_rows["11-51"]
    force = age_rows["11-81"]
    unemployment = age_rows["81"]
    counts = exact_counts
    return {
        "LFPR": (percent(force[age_column], 1000), str(force[age_column]), ""),
        "WPR": (percent(employed[age_column], 1000), str(employed[age_column]), ""),
        "UR": (percent(unemployment[-2 if counts else age_column], force[-2 if counts else age_column]),
               "", "unemployed divided by labour force, ages 15+"),
    }


def nss_status(rows):
    employed = rows["11-51"][-2]
    casual = rows.get("41&51", rows.get("41-51"))[-2]
    totals = {"all self-employed": rows["11&12&21"][-2], "regular wage/salary": rows["31"][-2],
              "casual labour": casual, "all": employed}
    require(abs(sum(totals.values()) - 2 * employed) <= 3, f"NSS worker counts do not add up: {totals}")
    return totals


def nss_youth_counts(block, rows, round_number):
    force, unemployed = rows["11-81"], rows["81"]
    if round_number == 55:
        # This table distributes each activity group by age, rather than each age by activity.
        return tuple(sum(row[3:6]) * row[-2] for row in (unemployed, force))
    if round_number == 50:
        population = nss_population_50(block)
    else:
        match = re.search(r"(?im)^ *estd\.? persons *\(00\) +([\d ]+)", block)
        population = [int(value) for value in match[1].split()]
    return tuple(sum(p * v for p, v in zip(population[3:6], row[3:6])) for row in (unemployed, force))


def published_nss_youth(report, number, periods):
    block = statement(report, number)
    result = {}
    area = sex = None
    for line in block.splitlines():
        label = re.fullmatch(r" *(rural|urban) (male|female) *", line.lower())
        if label:
            area, sex = label.groups()
        row = re.fullmatch(r" *15-29 +([\d ]+) *", line)
        if row:
            values = row[1].split()
            require(area and len(values) == 4 * len(periods), f"Statement {number}: youth {line}")
            for period, value in zip(periods, values[1::4]):
                result[period, area, sex] = value
    require(len(result) == len(periods) * 4, f"Statement {number}: incomplete youth data")
    return result


def published_nss_status(report):
    block = statement(report, "5.9")
    result = {}
    area = sex = None
    for line in block.splitlines():
        label = re.fullmatch(r" *(rural|urban) (male|female)s *", line)
        if label:
            area, sex = label.groups()
        row = re.search(r"\((\d{4}-\d{2})\) +([\d ]+)$", line)
        if row and area and int(row[1][:4]) >= 1993:
            values = row[2].split()
            require(len(values) == 6, f"NSS Report 554, Statement 5.9: {line}")
            for category, value in zip(STATUSES[2:5], values[-3:]):
                result[row[1], area, sex, category] = value
    require(len(result) == 60, "NSS Report 554, Statement 5.9: incomplete employment shares")
    return result


def nss_industry(report):
    result = {}
    blocks = [block.split("\f", 1)[0] for block in table_blocks(report, "27")]
    for sector, heading in zip(SECTORS, ("rural", "urban", r"rural *\+ *urban")):
        sections = {}
        for block in blocks:
            if not re.search(rf"(?m)^all-India +{heading} *$", block[:700]):
                continue
            for section, *values in re.findall(r"(?m)^ *([A-U]) +"
                                                r"(\d+) +(\d+) +(\d+) +(\d+) +(\d+) +(\d+) *$", block):
                require(section not in sections, f"NSS 68: duplicate section {sector}, {section}")
                sections[section] = values[1::2]
        expected = "ABCDEFGHIJKLMNOPQRST" + ("" if sector == "rural" else "U")
        require(set(sections) == set(expected), f"NSS 68: industry sections {sector}")
        for index, sex in enumerate(SEXES):
            for industry, letters in INDUSTRIES.items():
                value = sum(int(sections[letter][index]) for letter in letters if letter in sections)
                derived = "sum of NIC 2008 sections" if len(letters) > 1 else ""
                result[sector, sex, industry] = (f"{Decimal(value) / 100:.2f}", derived)
            total = sum(int(v[index]) for v in sections.values())
            require(abs(total - 10000) <= 5, f"NSS 68: industry total {sector}, {sex}, {total}")
            result[sector, sex, "all"] = ("100.00", "")
    return result


def check_overlap(first, second, label, detail=True):
    overlap = first.keys() & second.keys()
    differences = {key: (first[key], second[key]) for key in sorted(overlap) if first[key] != second[key]}
    print(f"{label}: {len(overlap) - len(differences)}/{len(overlap)} values match")
    if detail:
        for key, values in differences.items():
            print(f"  {key}: {values[0]} vs {values[1]}")


def plfs_nss_ages(report, number, indicator):
    result = {}
    period = None
    lines = statement(report, number).splitlines()
    for index, line in enumerate(lines):
        year = re.fullmatch(rf" *(?:PLFS \()?({PERIOD})\)? *", line)
        if year:
            period = year[1]
        if line.strip() == "15 years":
            values = lines[index + 1].split()
            require(period and len(values) == 9, f"Statement {number}: ages 15+")
            for sex, value in zip(SEXES, values[-3:]):
                result[period, indicator, sex] = value
    require(len(result) == 12, f"Statement {number}: expected four periods")
    return result


def read_csv(path):
    with path.open(newline="") as source:
        return list(csv.DictReader(source))


def write_csv(out, stem, fields, rows):
    with (out / f"jobs-{stem}-history.csv").open("w", newline="") as file:
        writer = csv.writer(file, lineterminator="\n")
        writer.writerow(("geography", "period", "value", "unit", *fields,
                         "period_basis", "plot_period", "table", "derived", "published_per_1000"))
        for period, value, unit, dimensions, basis, source, derived, published in sorted(
            rows, key=lambda row: (row[0], row[3])
        ):
            writer.writerow(("india", period, value, unit, *dimensions, basis,
                             f"{period[:4]}-07-01", source, derived, published))
    print(f"{stem}: {len(rows)} rows")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--raw", type=Path, default=Path("raw/jobs"))
    parser.add_argument("--current", type=Path, default=Path("research/data/jobs"))
    parser.add_argument("--out", type=Path, default=Path("research/data/jobs"))
    args = parser.parse_args()
    raw, out = args.raw, args.out

    nss_specs = [
        (50, "1993-94", "nss-50-full", "409", "30B", 18, ("0-9",), "32B", 11),
        (55, "1999-00", "nss-55-part2", "458", "46", 18, ("01-93", "01-99"), "48B", 10),
        (61, "2004-05", "nss-61-part1", "515", "19", 18, ("01-93", "01-99"), None, None),
        (66, "2009-10", "nss-66-catalog-pdf", "537", "20", 18, ("01-93", "01-99"), None, None),
        (68, "2011-12", "nss-68", "554", "18", 18, ("01-96", "01-99"), None, None),
    ]

    report66 = pdf(raw, "nss-66-catalog-pdf")
    report68 = pdf(raw, "nss-68")
    youth_nss = published_nss_youth(report66, "6.4", ("1993-94", "1999-00", "2004-05", "2009-10"))
    youth_check = published_nss_youth(report68, "6.4", ("1999-00", "2004-05", "2009-10", "2011-12"))
    check_overlap(youth_nss, youth_check, "NSS 537 / 554, ages 15 to 29")
    youth_nss.update(youth_check)
    status_nss = published_nss_status(report68)

    annual, youth, status, industry = [], [], [], []
    nss_ages, nss_status_check = {}, {}
    for round_number, period, file, report_number, table, width, codes, education, ed_width in nss_specs:
        basis = NSS_EARLY if round_number < 61 else NSS
        report = {66: report66, 68: report68}.get(round_number)
        if report is None:
            report = pdf(raw, file)
        if round_number == 61:
            # PDF text extraction splits the urban persons sample count in Table 19.
            report = report.replace("946833 7711 8", "946833 77118")
        source = f"NSS Report {report_number}, Table {table}"
        pages = nss_pages(report, table)
        records = {key: activity_rows(page, codes, width) for key, page in pages.items()}
        ages = records
        if education:
            ages = {key: activity_rows(page, codes, ed_width)
                    for key, page in nss_pages(report, education).items()}
        for sex in SEXES:
            age_source = f"NSS Report {report_number}, Table {education}" if education else source
            rates = nss_annual(ages["rural+urban", sex], -3 if education else -4, bool(education))
            for indicator, (value, published, derived) in rates.items():
                nss_ages[period, indicator, sex] = value
                annual.append((period, value, "per cent", (indicator, sex, "15+", USUAL), basis, age_source,
                               derived, published))

        worker_counts = {key: nss_status(rows) for key, rows in records.items()}
        youth_counts = {key: nss_youth_counts(page, records[key], round_number) for key, page in pages.items()}
        for sex in SEXES:
            if ("rural+urban", sex) not in worker_counts:
                worker_counts["rural+urban", sex] = {
                    category: sum(worker_counts[area, sex][category] for area in ("rural", "urban"))
                    for category in worker_counts["rural", sex]
                }
                youth_counts["rural+urban", sex] = tuple(sum(counts) for counts in
                    zip(youth_counts["rural", sex], youth_counts["urban", sex]))

        for (sector, sex), totals in worker_counts.items():
            for category, count in totals.items():
                key = (period, sector, sex, category)
                published = status_nss.get(key, "")
                calculated = percent(count, totals["all"])
                nss_status_check[key] = calculated
                value = percent(int(published), 1000) if published else calculated
                status_source = "NSS Report 554, Statement 5.9" if published else source
                derived = "" if published else "category workers divided by all workers"
                status.append((period, value, "per cent of workers", (sector, sex, category, "all ages", USUAL),
                               basis, status_source, derived, published))
        for (sector, sex), counts in youth_counts.items():
            published = youth_nss.get((period, sector, sex), "")
            youth_source = f"NSS Report {'537' if period == '1993-94' else '554'}, Statement 6.4" if published else source
            value = percent(int(published), 1000) if published else percent(*counts)
            derived = "" if published else "estimated from the published age groups 15-19, 20-24 and 25-29"
            youth.append((period, value, "per cent", (sector, sex, "15-29", USUAL), basis, youth_source, derived, published))

    check_overlap(nss_status_check, {k: percent(int(v), 1000) for k, v in status_nss.items()},
                  "NSS appendix counts / published employment shares")
    for (sector, sex, category), (value, derived) in nss_industry(report68).items():
        industry.append(("2011-12", value, "per cent of workers", (sector, sex, category, "all ages", USUAL),
                         NSS, "NSS Report 554, Table 27", derived, ""))

    annual_report = pdf(raw, "plfs-2017-18")
    age_check = {**plfs_nss_ages(annual_report, 8, "LFPR"), **plfs_nss_ages(annual_report, 11, "WPR")}
    agri_annual, cal_annual = {}, {}
    for row in read_csv(args.current / "jobs-lfpr-wpr-ur-annual.csv"):
        key = (row["period"], row["indicator"], row["sex"])
        if row["period_type"].startswith("agricultural"):
            agri_annual[key] = row["value"]
            annual.append((row["period"], row["value"], "per cent",
                           (row["indicator"], row["sex"], "15+", USUAL), PLFS, row["table"], "", ""))
        else:
            cal_annual[key] = row["value"]
    check_overlap(nss_ages, age_check, "NSS reports / PLFS 2017-18, ages 15+")
    check_overlap(agri_annual, age_check, "PLFS 2023-24 press note / 2017-18 report, ages 15+")
    check_overlap({(p[:4], *key): v for (p, *key), v in agri_annual.items()}, cal_annual,
                  "Annual rates with same start year, July to June / calendar", detail=False)

    reports = (
        ("2020-21", pdf(raw, "plfs-2020-21"), (26, 12, 13), 4),
        ("2023-24", pdf(raw, "plfs-2023-24"), (16, 6, 7), 3),
    )
    checks = (
        ("2018-19", pdf(raw, "plfs-2018-19"), (26, 12, 13)),
        ("2019-20", pdf(raw, "plfs-2019-20"), (26, 12, 13)),
        ("2021-22", pdf(raw, "plfs-2021-22-official"), (26, 12, 13)),
        ("2022-23", pdf(raw, "plfs-2022-23"), (16, 6, 7)),
    )
    measures = (
        ("Youth unemployment", plfs_youth, youth, ("15-29", USUAL), "per cent", 9,
         "jobs-youth-unemployment-annual.csv", ("sector", "sex")),
        ("Employment status", plfs_status, status, ("all ages", USUAL), "per cent of workers", 54,
         "jobs-employment-status.csv", ("sector", "sex", "status")),
        ("Industry", plfs_industry, industry, ("all ages", USUAL), "per cent of workers", 81,
         "jobs-employment-by-industry.csv", ("sector", "sex", "industry")),
    )
    for i, (name, extract, target, dimensions, unit, per_year, filename, columns) in enumerate(measures):
        all_values = {}
        for release, report, numbers, years in reports:
            number = numbers[i]
            values = extract(report, number)
            require(len(values) == years * per_year, f"PLFS {release}, Statement {number}: {len(values)} rows")
            for (period, *key), value in values.items():
                target.append((period, value, unit, (*key, *dimensions), PLFS,
                               f"PLFS Annual Report {release}, Statement {number}", "", ""))
            all_values.update(values)
        for release, report, numbers in checks:
            check_overlap(all_values, extract(report, numbers[i]), f"PLFS {release} overlap, {name}")
        calendar = {(row["period"], *(row[c] for c in columns)): row["value"]
                    for row in read_csv(args.current / filename)}
        check_overlap({(p[:4], *key): v for (p, *key), v in all_values.items()}, calendar,
                      f"{name} with same start year, July to June / calendar", detail=False)

    write_csv(out, "annual-rates", ("indicator", "sex", "age_group", "activity_status"), annual)
    write_csv(out, "youth-unemployment", ("sector", "sex", "age_group", "activity_status"), youth)
    write_csv(out, "employment-status", ("sector", "sex", "status", "age_group", "activity_status"), status)
    write_csv(out, "employment-by-industry", ("sector", "sex", "industry", "age_group", "activity_status"), industry)


if __name__ == "__main__":
    main()
