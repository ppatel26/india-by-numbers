"""Sweep the MoSPI and ORGI survey catalogues and list what is new or unused.

Both offices run a NADA catalogue. Each lists every survey or report series the office has released.
This script downloads the full list from each one, saves the raw pages to --raw, and writes one CSV
per catalogue to --out. Each row says whether a topic README in research/data/ already cites that
catalogue entry.

It compares the new list with the CSV already in --out and prints:
  - entries that are new since the last sweep
  - entries the publisher changed since the last sweep
  - entries that no topic README cites (with --unused)

ORGI's catalogue also holds about 31,000 Census tables, one per area. The CSV keeps reports and
other documents only. The summary gives the table count.

Run from the repository root:
  python3 -I pipeline/common/catalogue_sweep.py
  python3 -I pipeline/common/catalogue_sweep.py --unused
"""

import argparse
import csv
import datetime as dt
import hashlib
import json
import re
import sys
import time
import urllib.request
from pathlib import Path

USER_AGENT = "IndiaByNumbers/1.0 (+https://indiabynumbers.org/about/)"
PAGE_SIZE = 1000
CATALOGUES = {
    "mospi-microdata": {
        "api": "https://microdata.gov.in/NADA/index.php/api/catalog/search",
        "entry": "https://microdata.gov.in/NADA/index.php/catalog/{id}",
        "cite": re.compile(r"microdata\.gov\.in/NADA/index\.php/catalog/(\d+)", re.I),
        "keep_tables": True,
    },
    "orgi-census": {
        "api": "https://censusindia.gov.in/nada/index.php/api/catalog/search",
        "entry": "https://censusindia.gov.in/nada/index.php/catalog/{id}",
        "cite": re.compile(r"censusindia\.gov\.in/nada/index\.php/catalog/(\d+)", re.I),
        "keep_tables": False,
    },
}
FIELDS = ["id", "idno", "type", "title", "year_start", "year_end", "created", "changed", "cited_by", "url"]


def fetch_json(url: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=120) as resp:
        return json.loads(resp.read())


def sweep(name: str, cfg: dict, raw: Path, pause: float) -> list[dict]:
    """Download every page of one catalogue. Return its rows."""
    rows: dict[str, dict] = {}
    page, total = 1, None
    raw.mkdir(parents=True, exist_ok=True)
    log = raw / "_log.tsv"
    while total is None or len(rows) < total:
        url = f"{cfg['api']}?ps={PAGE_SIZE}&page={page}"
        data = fetch_json(url)
        body = json.dumps(data, ensure_ascii=False).encode()
        path = raw / f"{name}-page-{page:03d}.json"
        path.write_bytes(body)
        with log.open("a") as fh:
            fh.write(f"{dt.datetime.now(dt.timezone.utc).isoformat()}\t{url}\t{path.name}\t{hashlib.sha256(body).hexdigest()}\n")
        result = data["result"]
        total = int(result["found"])
        batch = result.get("rows") or []
        if not batch:
            break
        for r in batch:
            rows[str(r["id"])] = r
        page += 1
        time.sleep(pause)
    if len(rows) != total:
        sys.exit(f"{name}: got {len(rows)} entries, the catalogue reports {total}")
    return list(rows.values())


def cited_ids(pattern: re.Pattern, readmes: list[Path]) -> dict[str, list[str]]:
    """Map each catalogue id to the topic folders whose README cites it."""
    cited: dict[str, list[str]] = {}
    for readme in readmes:
        for cid in set(pattern.findall(readme.read_text(errors="replace"))):
            cited.setdefault(cid, []).append(readme.parent.name)
    return cited


def clean(text: str | None) -> str:
    return " ".join((text or "").split())


def read_previous(path: Path) -> dict[str, dict]:
    if not path.exists():
        return {}
    with path.open(newline="") as fh:
        return {r["id"]: r for r in csv.DictReader(fh)}


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--raw", type=Path, default=Path("raw/catalogues"))
    ap.add_argument("--out", type=Path, default=Path("research/catalogues"))
    ap.add_argument("--data", type=Path, default=Path("research/data"))
    ap.add_argument("--only", choices=sorted(CATALOGUES), help="sweep one catalogue")
    ap.add_argument("--pause", type=float, default=1.0, help="seconds between page requests")
    ap.add_argument("--unused", action="store_true", help="also list entries no topic README cites")
    args = ap.parse_args()

    readmes = sorted(args.data.glob("*/README.md"))
    if not readmes:
        sys.exit(f"No topic READMEs under {args.data}. Run from the repository root.")
    args.out.mkdir(parents=True, exist_ok=True)
    today = dt.date.today().isoformat()

    for name, cfg in CATALOGUES.items():
        if args.only and name != args.only:
            continue
        rows = sweep(name, cfg, args.raw / today, args.pause)
        cited = cited_ids(cfg["cite"], readmes)
        tables = sum(1 for r in rows if r.get("type") == "table")
        kept = [r for r in rows if cfg["keep_tables"] or r.get("type") != "table"]
        out_rows = sorted(
            (
                {
                    "id": str(r["id"]),
                    "idno": clean(r.get("idno")),
                    "type": clean(r.get("type")),
                    "title": clean(r.get("title")),
                    "year_start": clean(str(r.get("year_start") or "")),
                    "year_end": clean(str(r.get("year_end") or "")),
                    "created": clean(r.get("created"))[:10],
                    "changed": clean(r.get("changed"))[:10],
                    "cited_by": " ".join(sorted(cited.get(str(r["id"]), []))),
                    "url": cfg["entry"].format(id=r["id"]),
                }
                for r in kept
            ),
            key=lambda r: int(r["id"]),
        )

        out_csv = args.out / f"{name}.csv"
        previous = read_previous(out_csv)
        new = [r for r in out_rows if r["id"] not in previous]
        changed = [r for r in out_rows if r["id"] in previous and r["changed"] != previous[r["id"]]["changed"]]
        gone = sorted(set(previous) - {r["id"] for r in out_rows}, key=int)

        with out_csv.open("w", newline="") as fh:
            w = csv.DictWriter(fh, fieldnames=FIELDS, lineterminator="\n")
            w.writeheader()
            w.writerows(out_rows)

        used = sum(1 for r in out_rows if r["cited_by"])
        print(f"## {name}: {len(rows)} entries ({tables} tables), {len(out_rows)} in {out_csv}, {used} cited by a topic README")
        if previous:
            print(f"   New since the last sweep: {len(new)}. Changed: {len(changed)}. Removed: {len(gone)}.")
            for label, items in (("NEW", new), ("CHANGED", changed)):
                for r in items:
                    print(f"   {label:7} {r['id']:>6} {r['changed']} {r['title'][:100]}")
            for gid in gone:
                print(f"   REMOVED {gid:>6} {previous[gid]['title'][:100]}")
        else:
            print("   First sweep: no earlier snapshot to compare.")
        if args.unused:
            for r in out_rows:
                if not r["cited_by"] and r["type"] != "table":
                    print(f"   UNUSED  {r['id']:>6} {r['year_end'] or '----':>4} {r['title'][:100]}")


if __name__ == "__main__":
    main()
