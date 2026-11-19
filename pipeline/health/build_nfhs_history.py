"""Build the historical NFHS chart inputs from official reports and the live CSV.

Run from the repository root: python3 -I pipeline/health/build_nfhs_history.py
"""

import csv
from pathlib import Path
import re
import subprocess


RAW = Path("raw/health")
DATA = Path("research/data/health")
PERIODS = ("1992-93", "1998-99", "2005-06", "2015-16", "2019-21", "2023-24")
GROWTH = ("stunted", "wasted", "severely-wasted")
CARD = "full-immunisation-card"
RECALL = "full-immunisation-card-or-recall"
BIRTHS = "institutional-births"
ANAEMIA = "anaemia-women-15-49"
UNDER_FIVE = "under-five-who"
UNDER_THREE = "under-three-who"
FIELDS = ("geography", "period", "value", "unit", "round", "round_axis", "indicator", "basis", "source_doc", "note")


def read_csv(path):
    with path.open(newline="", encoding="utf-8") as file:
        return list(csv.DictReader(file))


def write_csv(name, rows):
    with (DATA / name).open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def read_report(round_number):
    path = RAW / f"nfhs-{round_number}" / "report.pdf"
    return subprocess.check_output(["pdftotext", "-layout", str(path), "-"], encoding="utf-8")


def report_page(report, title):
    pages = [page for page in report.split("\f") if re.search(r"^ *" + title + r" *$", page, re.MULTILINE)]
    if len(pages) != 1:
        raise ValueError(f"Expected one page for {title}, found {len(pages)}")
    return pages[0]


def decimals(line):
    return re.findall(r"(?<!\d)-?\d+\.\d+\b", line)


def row_values(page, label):
    lines = re.findall(rf"^ *{label} +[^\n]+", page, re.MULTILINE)
    if len(lines) != 1:
        raise ValueError(f"Expected one row for {label}, found {len(lines)}")
    return decimals(lines[0])


def trend_rows(page, label):
    return [decimals(line) for line in re.findall(rf"^ *{label}[^\n]*", page, re.MULTILINE)]


def state_growth(page):
    # Table 10.2 prints the same 11 numeric columns in each national report.
    # Rejoin the two parts of names that wrap across lines.
    page = re.sub(r"(Nicobar|and)\n +(?=Islands|Daman & Diu +\d)", r"\1 ", page)
    rows = {}
    for line in page.splitlines():
        columns = re.split(r" {2,}", line.strip())
        if len(columns) == 12 and all(re.fullmatch(r"-?\d+\.\d", value) for value in columns[1:]):
            state, _, stunted, _, severe, wasted, *_ = columns
            rows[state] = (stunted, wasted, severe)
    return rows


def observation(round_number, indicator, basis, value, source_doc, note="", geography="india"):
    return dict(
        geography=geography, period=PERIODS[round_number - 1], value=value, unit="percent",
        round=f"NFHS-{round_number}", round_axis=f"{round_number:04}", indicator=indicator,
        basis=basis, source_doc=source_doc, note=note,
    )


def main():
    nfhs1, nfhs2, nfhs3, nfhs4, nfhs5 = map(read_report, range(1, 6))
    existing = read_csv(DATA / "nfhs-key-indicators-by-state.csv")
    live = {(row["geography"], row["round"], row["indicator"]): row["value"] for row in existing}
    rows = []

    def add(round_number, indicator, basis, value, table, note=""):
        rows.append(observation(round_number, indicator, basis, value, f"NFHS-{round_number} India report, {table}", note))

    growth3 = state_growth(report_page(nfhs3, r"Table 10\.2 Nutritional status of children by state"))
    growth4 = state_growth(report_page(nfhs4, r"Table 10\.2 Nutritional status of children by state/union territory"))
    growth5 = {}
    for page in nfhs5.split("\f"):
        if re.match(r"\s*Table 10\.2 Nutritional status of children by state/union territory(?:\u2014Continued)?\s*\n", page):
            growth5.update(state_growth(page))
    if (len(growth3), len(growth4), len(growth5)) != (30, 37, 37):
        raise ValueError("Unexpected number of geographies in an NFHS Table 10.2")

    under_three = report_page(nfhs3, r"Table 10\.3 Trends in nutritional status of children")
    thresholds = trend_rows(under_three, r"Percentage below -[23] SD")
    stunting, wasting_severe, wasting = (thresholds[index] for index in (1, 2, 3))
    for round_number, column in ((2, 5), (3, 2)):
        for indicator, values in zip(GROWTH, (stunting, wasting, wasting_severe), strict=True):
            rows.append(observation(
                round_number, indicator, UNDER_THREE, values[column], "NFHS-3 India report, Table 10.3",
                "Last two children under age 3 of ever-married women, WHO standards",
            ))
    for round_number, growth in ((3, growth3), (4, growth4)):
        for indicator, value in zip(GROWTH, growth["India"], strict=True):
            add(round_number, indicator, UNDER_FIVE, value, "Table 10.2")

    births3 = report_page(nfhs3, r"Table 8\.23 Trends in maternal care indicators")
    birth_values = trend_rows(births3, r"Percentage of births delivered in a health facility")
    for round_number, value in zip((3, 2, 1), birth_values[-1], strict=True):
        rows.append(observation(
            round_number, BIRTHS, "last-two-births", value, "NFHS-3 India report, Table 8.23",
            "Last two births to ever-married women in the prior three years",
        ))
    births4 = report_page(nfhs4, r"Table 8\.27 Trends in maternal care indicators")
    birth_values = trend_rows(births4, r"Percentage of births delivered in a health facility")
    for round_number, value in zip((4, 3), birth_values[-1], strict=True):
        rows.append(observation(
            round_number, BIRTHS, "all-births", value, "NFHS-4 India report, Table 8.27",
            "All births in the prior five years",
        ))
    births5 = report_page(nfhs5, r"Table 8\.29 Trends in maternal care indicators")
    assert trend_rows(births5, r"Percentage of births delivered in a health facility")[-1] == [
        live["india", "NFHS-5", BIRTHS], birth_values[-1][0],
    ]

    vaccines3 = report_page(nfhs3, r"Table 9\.6 Trends over time in vaccinations")
    vaccines4 = report_page(nfhs4, r"Table 9\.6 Trends over time in vaccinations")
    all_basic3 = row_values(vaccines3, r"All basic vaccinations2")[-3:]
    all_basic4 = row_values(vaccines4, r"All basic vaccinations2")[-2:]
    assert all_basic3[0] == all_basic4[1]
    for round_number, value in zip((1, 2, 3, 4), (*reversed(all_basic3), all_basic4[0]), strict=True):
        table = "NFHS-3" if round_number < 4 else "NFHS-4"
        rows.append(observation(
            round_number, RECALL, "basic-vaccines-dpt", value, f"{table} India report, Table 9.6",
            "BCG, measles, and three doses each of DPT and polio excluding the polio birth dose",
        ))
    card_tables = (
        (nfhs1, r"Table 9\.10 Vec[^\n]*source of information", "9.10", -1),
        (nfhs2, r"Table 6\.9 Childhood vaccinations by source of information", "6.9", -2),
        (nfhs3, r"Table 9\.3 Vaccinations by source of information", "9.3", -2),
        (nfhs4, r"Table 9\.3 Vaccinations by source of information", "9.3", -3),
    )
    for round_number, (report, title, table, column) in enumerate(card_tables, start=1):
        values = trend_rows(report_page(report, title), r"Vaccination card +\d")
        add(round_number, CARD, "card-seen", values[-1][column], f"Table {table}",
            "Among children whose vaccination card was seen")
    vaccines5 = report_page(nfhs5, r"Table 9\.6 Trends over time in vaccinations")
    assert row_values(vaccines5, r"All basic vaccinations4")[-2:] == [live["india", "NFHS-5", RECALL], all_basic4[0]]

    anaemia3 = report_page(nfhs3, r"Table 10\.24\.1 Prevalence of anaemia in women\u2014Continued")
    for round_number in (2, 3):
        value = row_values(anaemia3, f"NFHS-{round_number}")[-1]
        rows.append(observation(
            round_number, ANAEMIA, "ever-married-women", value, "NFHS-3 India report, Table 10.24.1",
            "Ever-married women aged 15 to 49" + (". Excludes Nagaland." if round_number == 3 else ""),
        ))
    anaemia4 = report_page(nfhs4, r"Table 10\.21\.1 Prevalence of anaemia in women\u2014Continued")
    anaemia5 = report_page(nfhs5, r"Table 10\.23\.1 Prevalence of anaemia in women\u2014Continued")
    add(3, ANAEMIA, "all-women", row_values(anaemia3, r"Total(?= +\d)")[-1], "Table 10.24.1", "Excludes Nagaland.")
    add(4, ANAEMIA, "all-women", row_values(anaemia4, "Total")[-1], "Table 10.21.1")
    assert row_values(anaemia4, r"NFHS-3 \(2005-06\)")[-1] == rows[-2]["value"]
    assert row_values(anaemia5, "Total")[-1] == live["india", "NFHS-5", ANAEMIA]
    assert row_values(anaemia5, r"NFHS-4 \(2015-16\)")[-1] == rows[-1]["value"]

    bases = {**dict.fromkeys(GROWTH, UNDER_FIVE), BIRTHS: "all-births", CARD: "factsheet-card-only",
             RECALL: "factsheet-card-or-recall", ANAEMIA: "all-women"}
    for row in existing:
        if row["geography"] == "india" and row["indicator"] in bases:
            indicator = row["indicator"]
            note = "Provisional" if row["round"] == "NFHS-6" else row["note"]
            rows.append(observation(
                int(row["round"][-1]), indicator, bases[indicator], row["value"], row["source_doc"], note,
            ))
    rows.sort(key=lambda row: (row["round"], row["indicator"], row["basis"]))
    assert len(rows) == 42
    assert len({(row["round"], row["indicator"], row["basis"]) for row in rows}) == len(rows)
    assert all(growth5["India"][i] == live["india", "NFHS-5", indicator] for i, indicator in enumerate(GROWTH))

    state_rows = []
    changed_ut = {"Jammu & Kashmir", "Dadra & Nagar Haveli", "Daman & Diu"}
    slugs = {row["name"]: row["slug"] for row in read_csv(DATA.parent / "geography.csv")}
    slugs.update({
        "India": "india",
        "Andaman & Nicobar Islands": "andaman-nicobar",
        "Jammu & Kashmir": "jammu-kashmir",
        "Dadra & Nagar Haveli and Daman & Diu": "dnh-dd",
    })
    for state, (value, _, _) in growth5.items():
        if state != "Manipur":
            assert value == live[slugs[state], "NFHS-5", "stunted"], state
    for state, (value, _, _) in growth4.items():
        if state not in changed_ut:
            state_rows.append(observation(
                4, "stunted", UNDER_FIVE, value, "NFHS-4 India report, Table 10.2", geography=slugs[state],
            ))
    state_rows.append(observation(
        5, "stunted", UNDER_FIVE, growth5["Manipur"][0], "NFHS-5 India report, Table 10.2", geography="manipur",
    ))
    for row in existing:
        if row["indicator"] == "stunted":
            state_rows.append(observation(
                int(row["round"][-1]), "stunted", UNDER_FIVE, row["value"], row["source_doc"], row["note"], row["geography"],
            ))
    assert len(state_rows) == 107
    write_csv("nfhs-india-history.csv", rows)
    write_csv("nfhs-stunting-history-by-state.csv", sorted(state_rows, key=lambda row: (row["round"], row["geography"])))


if __name__ == "__main__":
    main()
