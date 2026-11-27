"""Derive patent applications per million people by state, 2024-25.

Usage: python3 -I pipeline/science-technology/per_million.py [--data research/data]

Reads two CSVs the site already holds, and writes one derived CSV:
  - science-technology/patent-applications-by-state.csv: applications by Indian residents in
    2024-25, all routes, by state of the applicant's address (Appendix B, Annual Report 2024-25);
  - science-technology/patent-applications.csv: the India total of applications by residents;
  - population/population-projections-2011-2036.csv: the Technical Group projection of persons on
    1 March 2025, in thousands (MoHFW, July 2020, Table 8).
Rate = applications / (population in thousands x 1,000) x 1,000,000, to two decimals.

The script stops if the states do not add up to the India total, or if a state has applications
but no population.
"""
import argparse
import csv

ap = argparse.ArgumentParser()
ap.add_argument("--data", default="research/data")
a = ap.parse_args()


def read(name):
    with open(f"{a.data}/{name}", encoding="utf-8") as f:
        return list(csv.DictReader(f))


apps = {r["geography"]: int(r["value"]) for r in read("science-technology/patent-applications-by-state.csv") if r["period"] == "2024-25" and r["route"] == "all routes"}
india = next(int(r["value"]) for r in read("science-technology/patent-applications.csv") if r["period"] == "2024-25" and r["applicant"] == "residents")
pop = {r["geography"]: int(r["value"]) for r in read("population/population-projections-2011-2036.csv") if r["period"] == "2025" and r["series"] == "persons"}

if sum(apps.values()) != india:
    raise SystemExit(f"states add up to {sum(apps.values())}, India residents {india}")
missing = sorted(set(apps) - set(pop))
if missing:
    raise SystemExit(f"no population for {missing}")

rows = []
for geo, n in [("india", india), *sorted(apps.items())]:
    rate = n / (pop[geo] * 1000) * 1e6
    rows.append([geo, "2024-25", f"{rate:.2f}", "applications per million people", n, pop[geo], "2025-03-01", "derived",
                 "Applications by residents, Annual Report 2024-25, Appendix B (India: Appendix C); population: Technical Group projection for 1 March 2025, Table 8"])

out = f"{a.data}/science-technology/patent-applications-per-million-by-state.csv"
with open(out, "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f, lineterminator="\n")
    w.writerow(["geography", "period", "value", "unit", "applications", "population_thousand", "population_date", "derived", "note"])
    w.writerows(rows)
print(f"{out}: {len(rows)} rows")
