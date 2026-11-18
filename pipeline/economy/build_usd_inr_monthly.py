"""E9: monthly average of the daily rupee-dollar reference rate, September 1998 to November 2026.

Reads, from the repository root:
  raw/economy/rbi/refrate_usd_hist_<year>.html  RBI Reference Rate Archive, 1998 to 2018 (pipeline/economy/refrate.py)
  raw/economy/fbil/refrates_<year>.json     FBIL fetchfiltered, 2018 to 2025 (see research/data/economy/README.md)
  research/data/economy/usd-inr-daily-2026.csv  the 2026 daily series the site already shows
Writes research/data/economy/usd-inr-monthly.csv and prints the cross-checks.

Each day comes from one source: the RBI reference rate to 9 July 2018, the FBIL reference rate from
10 July 2018 (FBIL took over the benchmark that day) to 31 December 2025, and the 2026 daily CSV after.
A month's value is the plain mean of its working-day rates, rounded to four decimals.

Usage: python3 -I pipeline/economy/build_usd_inr_monthly.py
"""
import csv, glob, html, json, re, sys
from collections import defaultdict

RAW, OUT = "raw/economy", "research/data/economy"
FBIL_START, Y2026 = "2018-07-10", "2026-01-01"


def rbi_archive() -> dict[str, float]:
    days = {}
    for p in sorted(glob.glob(f"{RAW}/rbi/refrate_usd_hist_*.html")):
        if not re.search(r"refrate_usd_hist_(199[89]|20(0\d|1[0-8]))\.html$", p):
            continue
        t = re.sub(r"\s+", " ", html.unescape(re.sub("<[^>]+>", " ", open(p, encoding="utf-8", errors="replace").read())))
        t = t[t.find("USD (INR / 1 USD)") :]
        for dd, mm, yy, v in re.findall(r"(\d\d)/(\d\d)/(\d{4}) (\d+\.\d+)", t):
            days[f"{yy}-{mm}-{dd}"] = float(v)
    return days


def fbil() -> dict[str, float]:
    days = {}
    for p in sorted(glob.glob(f"{RAW}/fbil/refrates_*.json")):
        for r in json.load(open(p, encoding="utf-8")):
            if r["subProdName"] == "INR / 1 USD":
                days[r["processRunDate"][:10]] = float(r["rate"])
    return days


def daily_2026() -> dict[str, float]:
    with open(f"{OUT}/usd-inr-daily-2026.csv", encoding="utf-8") as f:
        return {r["date"]: float(r["value"]) for r in csv.DictReader(f)}


def agree(name: str, a: dict[str, float], b: dict[str, float]) -> None:
    both = sorted(set(a) & set(b))
    worst = max((abs(a[d] - b[d]), d) for d in both) if both else (0, "")
    print(f"check {name}: {len(both)} shared days, largest difference {worst[0]:.4f} on {worst[1]}")


rbi, fb, y26 = rbi_archive(), fbil(), daily_2026()
agree("RBI archive vs FBIL, July 2018", rbi, fb)
agree("FBIL vs 2026 daily CSV", fb, y26)

days = {d: v for d, v in rbi.items() if d < FBIL_START}
days |= {d: v for d, v in fb.items() if FBIL_START <= d < Y2026}
days |= y26

by_month: dict[str, list[float]] = defaultdict(list)
for d in sorted(days):
    by_month[d[:7]].append(days[d])
# August 1998 starts on the 25th, so the series starts in September.
by_month.pop("1998-08", None)

src = lambda m: "RBI reference rate" if m < FBIL_START[:7] else "RBI reference rate and FBIL reference rate" if m == FBIL_START[:7] else "FBIL reference rate"
rows = [["india", m, f"{sum(v) / len(v):.4f}", "rupees per US dollar", "monthly average of daily reference rates", len(v), src(m)] for m, v in sorted(by_month.items())]
with open(f"{OUT}/usd-inr-monthly.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f, lineterminator="\r\n")
    w.writerow(["geography", "period", "value", "unit", "measure", "days", "source"])
    w.writerows(rows)
print(f"wrote {len(rows)} months, {rows[0][1]} to {rows[-1][1]}; fewest days in a month: {min(r[5] for r in rows)}", file=sys.stderr)
