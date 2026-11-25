"""Build the trade-payments CSVs from the RBI HTML tables in raw/trade-payments/.

Run fetch_handbook.sh and fetch_psi.py first. Then, from the repository root:

    python3 -I pipeline/trade-payments/build_trade_payments.py

Reads the HTML tables of the RBI Handbook of Statistics on the Indian Economy 2025-26 (released
31 Jul 2026) and the 65 monthly releases of the RBI Payment System Indicators (June 2021 to
October 2026). Writes ten CSVs to research/data/trade-payments/. Every value keeps the digits RBI
prints; the script removes only the Indian digit-group commas. "-" and empty cells stay empty.

The script stops with an error if a checked value (CHECKS) or a cross-table check differs.
"""
import argparse, collections, csv, html, os, re, sys

FY_RE = re.compile(r"^\d{4}-\d{2}$")
NUM_RE = re.compile(r"^-?\d+(\.\d+)?$")
MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]


def fail(msg):
    sys.exit("check failed: " + msg)


def text(cell):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", cell))).strip()


def table_rows(path, start=None, stop=None):
    """Return the rows of an HTML page as lists of cell texts, from `start` to `stop` (substrings)."""
    s = open(path, encoding="utf-8", errors="replace").read()
    s = re.sub(r"<script.*?</script>|<style.*?</style>", "", s, flags=re.S)
    if start is not None:
        i = s.find(start)
        if i < 0:
            fail("%s: %r not found" % (path, start))
        s = s[i:]
    if stop is not None:
        j = s.find(stop)
        if j > 0:
            s = s[:j]
    rows = []
    for r in re.findall(r"<tr.*?</tr>", s, re.S):
        cells = [text(c) for c in re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", r, re.S)]
        if any(cells):
            rows.append(cells)
    return rows


def num(cell, where):
    """Publisher value with digit-group commas removed. '-' and '' give ''."""
    v = cell.replace(",", "").replace(" ", "")
    if v in ("", "-"):
        return ""
    if not NUM_RE.match(v):
        fail("%s: not a number: %r" % (where, cell))
    return v


def page_date(path):
    s = text(open(path, encoding="utf-8", errors="replace").read())
    m = re.search(r"Date : ([A-Z][a-z]{2} \d{1,2}, \d{4})", s)
    if not m or m.group(1) != "Jul 31, 2026":
        fail("%s: release date is %r, expected Jul 31, 2026" % (path, m and m.group(1)))


# ---------------------------------------------------------------------------------------------
# Handbook tables


def merge_blocks(path, blocks):
    """Join year blocks that repeat the same rows. Rows keep the order of the first block."""
    labels = [l for l, _ in blocks[0]]
    for b in blocks[1:]:
        if [l for l, _ in b] != labels:
            fail("%s: year blocks have different rows" % path)
    return [(l, {k: v for b in blocks for k, v in b[i][1].items()}) for i, l in enumerate(labels)]


def wide_years(path, header):
    """Tables with one column per year (128 to 131, 113, 115, 241). Yields (label, {year: value})."""
    page_date(path)
    years, blocks = None, []
    for r in table_rows(path, start="Date :"):
        if r[0].replace(" ", "").startswith(header.replace(" ", "")):
            years = r[1:]
            if not all(FY_RE.match(y) for y in years):
                fail("%s: bad year header %r" % (path, r))
            blocks.append([])
            continue
        if years is None or all(c.isdigit() for c in r) or r[0].startswith(("Note", "(")):
            continue
        if len(r) != len(years) + 1:
            continue
        blocks[-1].append((r[0], {y: num(v, "%s %s %s" % (path, r[0], y)) for y, v in zip(years, r[1:])}))
    return merge_blocks(path, blocks)


def cdn_years(path, header, flows):
    """Tables with flow columns under each year (124, 126, 119). Yields (label, {(year, flow): value})."""
    page_date(path)
    years, blocks = None, []
    rows = table_rows(path, start="Date :")
    for k, r in enumerate(rows):
        if r[0].replace(" ", "").startswith(header.replace(" ", "")):
            years = r[1:]
            if rows[k + 1] != flows * len(years):
                fail("%s: flow header %r" % (path, rows[k + 1]))
            blocks.append([])
            continue
        if years is None or all(c.isdigit() for c in r) or r[0].startswith(("Note", "(")) or r == flows * len(years):
            continue
        if len(r) != len(years) * len(flows) + 1:
            continue
        cols = [(y, f) for y in years for f in flows]
        blocks[-1].append((r[0], {c: num(v, "%s %s %s" % (path, r[0], c)) for c, v in zip(cols, r[1:])}))
    return merge_blocks(path, blocks)


KEY_ITEMS = {  # Table 128/129 labels, in order: (item slug, flow)
    "I. Merchandise": None,
    "A) Exports, f.o.b.": ("merchandise-exports", "receipts"),
    "B) Imports, c.i.f.": ("merchandise-imports", "payments"),
    "Trade balance (A-B)": ("trade-balance", "net"),
    "II. Invisibles, net": ("invisibles", "net"),
    "III. Current account (I+II)": ("current-account", "net"),
    "IV. Capital account (A to F)": ("capital-account", "net"),
    "A) Foreign Investment": ("foreign-investment", "net"),
    "B) External assistance, net": ("external-assistance", "net"),
    "C) Commercial borrowings, net": ("commercial-borrowings", "net"),
    "D) Rupee debt service": ("rupee-debt-service", "net"),
    "E) NRI deposits, net": ("nri-deposits", "net"),
    "F) Other capital": ("other-capital", "net"),
    "V. Overall balance (III+IV)": ("overall-balance", "net"),
    "VI. Monetary movements (VII+VIII+IX)": ("monetary-movements", "net"),
    "VII. Reserves (increase -/ decrease +)": ("reserves-change", "net"),
    "VIII. IMF, net": ("imf", "net"),
    "IX. SDR allocation": ("sdr-allocation", "net"),
}
INVIS_ITEMS = {  # Table 130/131 net rows; each is followed by Receipts and Payments rows
    "I. Non-factor Services, Net (i to v)": "services",
    "i) Travel, Net": "travel",
    "ii) Transportation, Net": "transportation",
    "iii) Insurance, Net": "insurance",
    "iv) G.n.i.e., Net": "government-not-included-elsewhere",
    "v) Miscellaneous, Net": "miscellaneous-services",
    "II. Income, Net": "income",
    "i) Investment income, Net": "investment-income",
    "ii) Compensation of Employees, Net": "compensation-of-employees",
    "III. Private Transfers, Net": "private-transfers",
    "IV. Official Transfers, Net": "official-transfers",
    "V. Invisibles, Net (I to IV)": "invisibles",
}


def bop_status(year):
    return "preliminary estimate" if year == "2025-26" else ""


def current_account(raw):
    rows = []
    for table, unit in (("128", "US$ million"), ("129", "₹ crore")):
        data = wide_years(os.path.join(raw, "handbook/table-%s.html" % table), "Item/ Year")
        if [l for l, _ in data] != list(KEY_ITEMS):
            fail("Table %s labels %r" % (table, sorted({l for l, _ in data} ^ set(KEY_ITEMS))))
        for label, vals in data:
            if KEY_ITEMS[label] is None:
                continue
            item, flow = KEY_ITEMS[label]
            for y, v in vals.items():
                rows.append(dict(period=y, item=item, flow=flow, value=v, unit=unit,
                                 rbi_label=label, table="Table %s" % table, status=bop_status(y)))
    for table, unit in (("130", "US$ million"), ("131", "₹ crore")):
        data = wide_years(os.path.join(raw, "handbook/table-%s.html" % table), "Item/ Year")
        cur = None
        for label, vals in data:
            if label in INVIS_ITEMS:
                cur, flow, rbi = INVIS_ITEMS[label], "net", label
            elif label in ("Receipts", "Payments") and cur:
                flow, rbi = label.lower(), "%s: %s" % (cur, label)
            else:
                fail("Table %s: unknown row %r" % (table, label))
            if cur == "invisibles" and flow == "net":
                continue  # same as Table 128/129 'II. Invisibles, net' (checked below)
            for y, v in vals.items():
                rows.append(dict(period=y, item=cur, flow=flow, value=v, unit=unit,
                                 rbi_label=label if flow == "net" else rbi, table="Table %s" % table,
                                 status=bop_status(y)))
    # Cross-checks: Table 130 invisibles net = Table 128 invisibles net, all years.
    for t_key, t_inv in (("128", "130"), ("129", "131")):
        key = dict(wide_years(os.path.join(raw, "handbook/table-%s.html" % t_key), "Item/ Year"))
        inv = dict(wide_years(os.path.join(raw, "handbook/table-%s.html" % t_inv), "Item/ Year"))
        for y, v in inv["V. Invisibles, Net (I to IV)"].items():
            if key["II. Invisibles, net"][y] != v:
                fail("Table %s invisibles %s %s != Table %s %s" % (t_inv, y, v, t_key, key["II. Invisibles, net"][y]))
    # Table 124 (overall BoP, 2020-21 to 2025-26): current account and services net equal 128 and 130.
    t124 = dict(cdn_years(os.path.join(raw, "handbook/table-124.html"), "Item/Year", ["Credit", "Debit", "Net"]))
    t128 = dict(wide_years(os.path.join(raw, "handbook/table-128.html"), "Item/ Year"))
    t130_list = wide_years(os.path.join(raw, "handbook/table-130.html"), "Item/ Year")
    t130 = dict(t130_list)
    receipts = {}  # 'Receipts' labels repeat, so take the row after each services net row
    for k, (label, vals) in enumerate(t130_list):
        if label == "I. Non-factor Services, Net (i to v)":
            receipts.update(t130_list[k + 1][1])
    for (y, f), v in t124["Total Current account (1+2)"].items():
        if f == "Net" and v != t128["III. Current account (I+II)"][y]:
            fail("Table 124 current account %s %s != Table 128 %s" % (y, v, t128["III. Current account (I+II)"][y]))
    for (y, f), v in t124["a) Services"].items():
        if f == "Net" and v != t130["I. Non-factor Services, Net (i to v)"][y]:
            fail("Table 124 services %s" % y)
        if f == "Credit" and v != receipts[y]:
            fail("Table 124 services receipts %s" % y)
    return rows


GDP_BASE = [("2003-04", "1999-2000"), ("2010-11", "2004-05"), ("2021-22", "2011-12"), ("9999-99", "2022-23")]
T241_COLS = [
    ("exports-to-gdp", "Trade: Exports / GDP", "percent"),
    ("imports-to-gdp", "Trade: Imports / GDP", "percent"),
    ("invisibles-receipts-to-gdp", "Invisibles: Receipts / GDP", "percent"),
    ("invisibles-payments-to-gdp", "Invisibles: Payments / GDP", "percent"),
    ("invisibles-net-to-gdp", "Invisibles: Net / GDP", "percent"),
    ("current-receipts-to-gdp", "Current Account: Current Receipts / GDP", "percent"),
    ("current-receipts-to-current-payments", "Current Account: Current Receipts / Current Payments", "percent"),
    ("current-account-balance-to-gdp", "Current Account: CAD / GDP", "percent"),
    ("net-foreign-investment-to-exports", "Capital Account: Net Foreign Investment / Exports", "percent"),
    ("net-foreign-investment-to-gdp", "Capital Account: Net Foreign Investment / GDP", "percent"),
    ("import-cover-of-reserves", "Import Cover of Reserves (in months)", "months"),
]


def bop_indicators(raw):
    path = os.path.join(raw, "handbook/table-241.html")
    page_date(path)
    rows = []
    for r in table_rows(path, start="Date :"):
        if r[0].startswith("Exports / GDP"):
            want = ["Exports / GDP", "Imports / GDP", "Receipts / GDP", "Payments / GDP", "Net / GDP",
                    "Current Receipts / GDP", "Current Receipts / Current Payments", "CAD / GDP",
                    "Net Foreign Investment / Exports", "Net Foreign Investment / GDP"]
            if r != want:
                fail("Table 241 header %r" % r)
            continue
        if not FY_RE.match(r[0]):
            continue
        if len(r) != 12:
            fail("Table 241 row %r" % r)
        y = r[0]
        status = {"2024-25": "revised estimate", "2025-26": "provisional estimate"}.get(y, "")
        base = next(b for last, b in GDP_BASE if y <= last)
        for (ind, label, unit), v in zip(T241_COLS, r[1:]):
            rows.append(dict(period=y, indicator=ind, value=num(v, "241 %s %s" % (y, ind)), unit=unit,
                             rbi_label=label, gdp_base="" if unit == "months" else base, status=status))
    return rows


def bpm6(raw):
    data = cdn_years(os.path.join(raw, "handbook/table-126.html"), "Item/Year", ["Credit", "Debit", "Net"])
    rows, seen = [], set()
    for label, vals in data:
        m = re.match(r"^(\d+(?:\.[0-9A-Za-z]+)*)\s+(.*)$", label)
        if not m:
            fail("Table 126 row without a code: %r" % label)
        code, name = m.groups()
        if code in seen:
            fail("Table 126 code %s twice" % code)
        seen.add(code)
        for (y, f), v in vals.items():
            rows.append(dict(period=y, code=code, item=name, flow=f.lower(), value=v, unit="US$ million",
                             status=bop_status(y)))
    # Goods net (1.A.a) equals the Table 128 trade balance in every year.
    t128 = dict(wide_years(os.path.join(raw, "handbook/table-128.html"), "Item/ Year"))
    for r in rows:
        if r["code"] == "1.A.a" and r["flow"] == "net" and r["value"] != t128["Trade balance (A-B)"][r["period"]]:
            fail("Table 126 goods net %s != Table 128" % r["period"])
    return rows


def trade_status(table, y):
    revised = {"111": ["2024-25"], "113": ["2024-25"], "115": ["2023-24", "2024-25"],
               "119": ["2021-22", "2022-23", "2023-24", "2024-25"]}[table]
    return "provisional" if y == "2025-26" else ("revised" if y in revised else "")


def merchandise_annual(raw):
    path = os.path.join(raw, "handbook/table-111.html")
    page_date(path)
    rows = []
    hdr = None
    for r in table_rows(path, start="Date :"):
        if r[0] == "Year":
            hdr = r
            continue
        if r[:3] == ["Oil", "Non-Oil", "Total"]:
            if r != ["Oil", "Non-Oil", "Total"] * 3:
                fail("Table 111 header %r" % r)
            continue
        if not FY_RE.match(r[0]):
            continue
        if hdr != ["Year", "Exports", "Imports", "Trade Balance"] or len(r) != 10:
            fail("Table 111 row %r" % r)
        cols = [(f, p) for f in ("exports", "imports", "trade-balance") for p in ("oil", "non-oil", "total")]
        for (f, p), v in zip(cols, r[1:]):
            rows.append(dict(period=r[0], flow=f, product=p, value=num(v, "111 " + r[0]), unit="US$ million",
                             status=trade_status("111", r[0])))
    return rows


def by_commodity(raw):
    rows, totals = [], {}
    for table, flow in (("113", "exports"), ("115", "imports")):
        for label, vals in wide_years(os.path.join(raw, "handbook/table-%s.html" % table), "Commodity / Year"):
            m = re.match(r"^(\d+)\.\s+(.*)$", label)
            if m:
                no, name = m.groups()
            elif label in ("Total Exports", "Total Imports"):
                no, name = "", "Total"
                totals[flow] = vals
            else:
                fail("Table %s row %r" % (table, label))
            for y, v in vals.items():
                rows.append(dict(period=y, flow=flow, commodity_no=no, commodity=name, value=v,
                                 unit="US$ million", table="Table %s" % table, status=trade_status(table, y)))
    return rows, totals


def by_partner(raw):
    data = cdn_years(os.path.join(raw, "handbook/table-119.html"), "Group/Country", ["Export", "Import"])
    rows, group, region = [], "", ""
    for label, vals in data:
        if label == "Of which:":
            continue
        if re.match(r"^[IVX]+\.\s", label):
            level, group, region, name = "group", re.sub(r"^[IVX]+\.\s+", "", label), "", None
        elif re.match(r"^[A-D]\.\s", label):
            level, region, name = "region", re.sub(r"^[A-D]\.\s+", "", label), None
        elif re.match(r"^\d+\s?\.\s?", label):
            level, name = "country", re.sub(r"^\d+\s?\.\s?", "", label)
        elif label == "Total":
            level, group, region, name = "total", "", "", "Total"
        else:
            fail("Table 119 row %r" % label)
        partner = name or (region if level == "region" else group)
        for (y, f), v in vals.items():
            rows.append(dict(period=y, partner=partner, level=level, group=group,
                             region=region if level == "country" else "",
                             flow={"Export": "exports", "Import": "imports"}[f], value=v, unit="US$ million",
                             status=trade_status("119", y)))
    return rows


def reserves(raw):
    path = os.path.join(raw, "handbook/table-144.html")
    page_date(path)
    rows = []
    comps = ["sdrs", "gold", "foreign-currency-assets", "reserve-tranche-position", "total"]
    for r in table_rows(path, start="Date :"):
        if r[0] == "End of Financial Year":
            if r[1:] != ["SDRs ##", "Gold #", "Foreign Currency Assets*", "Reserve Tranche Position", "Total"]:
                fail("Table 144 header %r" % r)
            continue
        if not FY_RE.match(r[0]):
            continue
        if len(r) != 11:
            fail("Table 144 row %r" % r)
        end = "%d-03-31" % (int(r[0][:4]) + 1)
        for k, v in enumerate(r[1:]):
            comp, unit = comps[k // 2], ("₹ crore", "US$ million")[k % 2]
            rows.append(dict(period=r[0], as_on=end, component=comp, value=num(v, "144 " + r[0]), unit=unit,
                             note="negligible ('-' in Table 144)" if v.strip() == "-" else ""))
    return rows


# ---------------------------------------------------------------------------------------------
# Payment System Indicators

PSI_ITEMS = {  # (part, label without markers) -> item slug
    ("I", "1 Credit Transfers - RTGS"): "rtgs",
    ("I", "2 Credit Transfers - Retail"): "retail-credit-transfers",
    ("I", "2.3 IMPS"): "imps",
    ("I", "2.4 NACH Cr"): "nach-credit",
    ("I", "2.5 NEFT"): "neft",
    ("I", "2.6 UPI"): "upi",
    ("I", "3.2 NACH Dr"): "nach-debit",
    ("I", "4 Card Payments"): "card-payments",
    ("I", "4.1 Credit Cards"): "credit-cards",
    ("I", "4.2 Debit Cards"): "debit-cards",
    ("I", "5 Prepaid Payment Instruments"): "prepaid-payment-instruments",
    ("I", "6 Paper-based Instruments"): "paper-based-instruments",
    ("I", "Total Retail Payments (2+3+4+5+6)"): "total-retail-payments",
    ("I", "Total Payments (1+2+3+4+5+6)"): "total-payments",
    ("I", "Total Digital Payments (1+2+3+4+5)"): "total-digital-payments",
    ("II", "1 Mobile Payments (mobile app based)"): "mobile-payments",
    ("II", "2 Internet Payments (Netbanking / internet browser based)"): "internet-payments",
    ("II", "3. Cash Withdrawal at ATMs"): "cash-withdrawal-at-atms",
}
PSI_INFRA = {
    "1 Number of Cards": "cards",
    "1.1 Credit Cards": "credit-cards",
    "1.2 Debit Cards": "debit-cards",
    "2 Number of PPIs": "ppis",
    "3 Number of ATMs": "atms",
    "3 Number of ATMs and CRMs": "atms-and-crms",
    "4 Number of Micro ATMs": "micro-atms",
    "5 Number of PoS Terminals": "pos-terminals",
    "6 Bharat QR": "bharat-qr",
    "7 UPI QR": "upi-qr",
}


def clean_label(s):
    s = re.sub(r"\s*[@$#*]\s*", " ", s).strip()
    s = s.replace("Total - Retail", "Total Retail")
    return re.sub(r"\s+", " ", s)


def month_no(name):
    k = name.strip().lower()[:3]
    if k not in MONTHS:
        fail("month %r" % name)
    return MONTHS.index(k) + 1


def ym(y, m):
    return "%04d-%02d" % (y, m)


def add_months(p, n):
    y, m = int(p[:4]), int(p[5:])
    t = y * 12 + m - 1 + n
    return ym(t // 12, t % 12 + 1)


def psi_columns(year_row, month_row, release, first):
    """Column periods for Parts I and II (first='FY') or Part III (first='As on')."""
    a, b, c, d = year_row[-4:] if first == "As on" else year_row[:4]
    if first == "FY":
        if not re.match(r"^FY \d{4}-\d{2}$", a):
            fail("%s: FY header %r" % (release, a))
        c0 = a[3:]
    else:
        m = re.match(r"^As on March (\d{4})$", a)
        if not m:
            fail("%s: as-on header %r" % (release, a))
        c0 = ym(int(m.group(1)), 3)
    m = re.match(r"^(\d{4}) ([A-Za-z]+)$", b)
    if not m:
        fail("%s: header %r" % (release, b))
    c1 = ym(int(m.group(1)), month_no(m.group(2)))
    c2 = ym(int(c), month_no(month_row[0]))
    c3 = ym(int(d), month_no(month_row[1]))
    if (c1, c2, c3) != (add_months(release, -12), add_months(release, -1), release):
        fail("%s: columns are %s %s %s" % (release, c1, c2, c3))
    return c0, c1, c2, c3


def parse_psi(path, release):
    s = open(path, encoding="utf-8", errors="replace").read()
    title = re.search(r"Payment System Indicators - ([A-Za-z]+) (\d{4})", text(s))
    if not title or ym(int(title.group(2)), month_no(title.group(1))) != release:
        fail("%s: title %r" % (path, title and title.group(0)))
    flows, infra = [], []
    for part, start, stop in (("I", "PART I -", "PART II -"), ("II", "PART II -", "PART III -"),
                              ("III", "PART III -", "PART IV")):
        rows = table_rows(path, start=start, stop=stop)
        cols = None
        for k, r in enumerate(rows):
            first = "As on" if part == "III" else "FY"
            if any(x.startswith(first) for x in r[:2]) and cols is None:
                cols = psi_columns([x for x in r if x], rows[k + 1], release, first)
                continue
            if cols is None:
                continue
            label = clean_label(r[0])
            if part in ("I", "II") and (part, label) in PSI_ITEMS:
                if len(r) != 9:
                    fail("%s: row %r" % (release, r))
                for j, v in enumerate(r[1:]):
                    flows.append(dict(item=PSI_ITEMS[(part, label)], label=label,
                                      measure=("volume", "value")[j // 4], col=j % 4, period=cols[j % 4],
                                      value=num(v, "%s %s" % (release, label)), raw=v, release=release))
            elif part == "III" and label in PSI_INFRA:
                if len(r) != 5:
                    fail("%s: row %r" % (release, r))
                for j, v in enumerate(r[1:]):
                    infra.append(dict(item=PSI_INFRA[label], label=label, col=j, period=cols[j],
                                      value=num(v, "%s %s" % (release, label)), raw=v, release=release))
    got = {f["item"] for f in flows}
    if got != set(PSI_ITEMS.values()):
        fail("%s: items missing %s" % (release, set(PSI_ITEMS.values()) - got))
    got = {f["item"] for f in infra}
    if len(got) != 9:
        fail("%s: infrastructure items %s" % (release, sorted(got)))
    return flows, infra


def latest(prints, key):
    """For each key, the print from the latest release. Also count keys whose prints differ."""
    best, values = {}, collections.defaultdict(set)
    for p in prints:
        k = key(p)
        values[k].add(p["value"])
        if k not in best or p["release"] > best[k]["release"]:
            best[k] = p
    differ = sorted(k for k, v in values.items() if len(v) > 1)
    return best, differ


def payments(raw):
    files = sorted(f for f in os.listdir(os.path.join(raw, "psi")) if re.match(r"psi-\d{4}-\d{2}\.html$", f))
    if len(files) != 65:
        fail("expected 65 PSI releases, found %d" % len(files))
    flows, infra = [], []
    for f in files:
        a, b = parse_psi(os.path.join(raw, "psi", f), f[4:11])
        flows += a
        infra += b
    # Monthly: columns 1 to 3. Annual: column 0 (the last full financial year).
    canon = lambda i: "atms" if i in ("atms", "atms-and-crms") else i
    monthly, m_diff = latest([p for p in flows if p["col"] > 0], lambda p: (p["item"], p["measure"], p["period"]))
    annual, a_diff = latest([p for p in flows if p["col"] == 0], lambda p: (p["item"], p["measure"], p["period"]))
    stock, s_diff = latest([p for p in infra if p["col"] > 0], lambda p: (canon(p["item"]), p["period"]))
    unit = {"volume": "lakh", "value": "₹ crore"}

    def out(d):
        rows = []
        for k in sorted(d, key=lambda k: (k[-1], k[:-1])):
            p = d[k]
            row = dict(period=p["period"], item=p["item"], rbi_label=p["label"])
            if "measure" in p:
                row.update(measure=p["measure"], value=p["value"], unit=unit[p["measure"]])
            else:
                row.update(value=p["value"], unit="lakh")
            row.update(release="PSI %s" % p["release"], status="provisional",
                       note="not available ('-')" if p["raw"].strip() == "-" else "")
            rows.append(row)
        return rows

    return out(monthly), out(annual), out(stock), (m_diff, a_diff, s_diff), flows, infra


def check_t58(raw, annual):
    """Handbook Table 58 (2021-22 to 2025-26): volume in whole lakh, value in whole ₹ crore."""
    path = os.path.join(raw, "handbook/table-58.html")
    page_date(path)
    names = {"1. Large Value Credit Transfers - RTGS": "rtgs", "2.4 IMPS": "imps", "2.6 NEFT": "neft",
             "2.7 UPI": "upi", "4.1 Credit Cards": "credit-cards", "4.2 Debit Cards": "debit-cards",
             "5. Prepaid Payment Instruments": "prepaid-payment-instruments",
             "Total Digital Payments (1+2+3+4+5)": "total-digital-payments"}
    psi = {(r["item"], r["measure"], r["period"]): r["value"] for r in annual}
    years, n, bad = None, 0, []
    for r in table_rows(path, start="Date :"):
        if r[0] == "" and all(FY_RE.match(x) for x in r[1:]):
            years = r[1:]
            continue
        if years and r[0] in names and len(r) == 2 * len(years) + 1:
            for k, y in enumerate(years):
                for j, meas in enumerate(("volume", "value")):
                    t = r[1 + 2 * k + j]
                    p = psi.get((names[r[0]], meas, y))
                    n += 1
                    if p is None or abs(float(p) - float(t)) > 0.5:
                        bad.append((names[r[0]], meas, y, p, t))
    return n, bad


# ---------------------------------------------------------------------------------------------

CHECKS = [  # (csv, {column: value}, published value, where RBI prints it)
    ("current-account-annual.csv", dict(period="2025-26", item="current-account", unit="US$ million"), "-25365", "Table 128"),
    ("current-account-annual.csv", dict(period="2020-21", item="current-account", unit="US$ million"), "23912", "Table 128"),
    ("current-account-annual.csv", dict(period="2025-26", item="private-transfers", flow="receipts", unit="US$ million"), "155120", "Table 130"),
    ("current-account-annual.csv", dict(period="2025-26", item="current-account", unit="₹ crore"), "-220852", "Table 129"),
    ("bop-indicators-annual.csv", dict(period="2025-26", indicator="current-account-balance-to-gdp"), "-0.61", "Table 241"),
    ("bop-indicators-annual.csv", dict(period="2011-12", indicator="current-account-balance-to-gdp"), "-4.29", "Table 241"),
    ("bop-indicators-annual.csv", dict(period="2020-21", indicator="import-cover-of-reserves"), "17.38", "Table 241"),
    ("bop-bpm6-annual.csv", dict(period="2025-26", code="1.A.b.9", flow="net"), "179302", "Table 126"),
    ("bop-bpm6-annual.csv", dict(period="2023-24", code="1", flow="net"), "-26033", "Table 126"),
    ("bop-bpm6-annual.csv", dict(period="2024-25", code="1.C.1.1", flow="credit"), "132065", "Table 126"),
    ("merchandise-trade-annual.csv", dict(period="2025-26", flow="exports", product="total"), "441730.1", "Table 111"),
    ("merchandise-trade-annual.csv", dict(period="1987-88", flow="imports", product="total"), "17155.7", "Table 111"),
    ("merchandise-trade-annual.csv", dict(period="2025-26", flow="trade-balance", product="total"), "-333248.1", "Table 111"),
    ("merchandise-trade-by-commodity.csv", dict(period="2025-26", flow="exports", commodity="Engineering Goods"), "122433.8", "Table 113"),
    ("merchandise-trade-by-commodity.csv", dict(period="2025-26", flow="imports", commodity="Gold"), "71977.3", "Table 115"),
    ("merchandise-trade-by-commodity.csv", dict(period="2024-25", flow="imports", commodity="Total"), "721200.2", "Table 115"),
    ("merchandise-trade-by-partner.csv", dict(period="2025-26", flow="exports", partner="U S A"), "87316.0", "Table 119"),
    ("merchandise-trade-by-partner.csv", dict(period="2025-26", flow="imports", partner="People’s Republic of China"), "131633.4", "Table 119"),
    ("merchandise-trade-by-partner.csv", dict(period="2025-26", flow="imports", partner="Total"), "776013.6", "Table 119"),
    ("forex-reserves-end-march.csv", dict(period="2025-26", component="total", unit="US$ million"), "691108", "Table 144"),
    ("forex-reserves-end-march.csv", dict(period="1968-69", component="total", unit="US$ million"), "769", "Table 144"),
    ("forex-reserves-end-march.csv", dict(period="2025-26", component="gold", unit="₹ crore"), "1094309", "Table 144"),
    ("payments-monthly.csv", dict(period="2026-10", item="upi", measure="volume"), "254666.92", "PSI October 2026"),
    ("payments-monthly.csv", dict(period="2026-10", item="rtgs", measure="value"), "23453839", "PSI October 2026"),
    ("payments-monthly.csv", dict(period="2025-10", item="upi", measure="value"), "2727791", "PSI October 2026"),
    ("payments-annual.csv", dict(period="2025-26", item="upi", measure="volume"), "2416168.86", "PSI October 2026"),
    ("payments-annual.csv", dict(period="2025-26", item="total-digital-payments", measure="value"), "325103565", "PSI October 2026"),
    ("payments-annual.csv", dict(period="2025-26", item="rtgs", measure="value"), "227372648", "PSI October 2026"),
    ("payment-infrastructure-monthly.csv", dict(period="2026-10", item="pos-terminals"), "107.12", "PSI October 2026"),
    ("payment-infrastructure-monthly.csv", dict(period="2026-10", item="credit-cards"), "1267.16", "PSI October 2026"),
    ("payment-infrastructure-monthly.csv", dict(period="2025-10", item="upi-qr"), "7174.34", "PSI October 2026"),
]


def write(out, name, rows, cols):
    rows = [dict(geography="india", **r) for r in rows]
    cols = ["geography"] + cols
    with open(os.path.join(out, name), "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=cols, lineterminator="\n")
        w.writeheader()
        w.writerows(rows)
    periods = sorted({r["period"] for r in rows})
    print("%-38s %5d rows  %s to %s" % (name, len(rows), periods[0], periods[-1]))
    return rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--raw", default="raw/trade-payments")
    ap.add_argument("--out", default="research/data/trade-payments")
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    built = {}
    built["current-account-annual.csv"] = write(a.out, "current-account-annual.csv", current_account(a.raw),
                                                ["period", "item", "flow", "value", "unit", "rbi_label", "table", "status"])
    built["bop-indicators-annual.csv"] = write(a.out, "bop-indicators-annual.csv", bop_indicators(a.raw),
                                               ["period", "indicator", "value", "unit", "rbi_label", "gdp_base", "status"])
    built["bop-bpm6-annual.csv"] = write(a.out, "bop-bpm6-annual.csv", bpm6(a.raw),
                                         ["period", "code", "item", "flow", "value", "unit", "status"])
    built["merchandise-trade-annual.csv"] = write(a.out, "merchandise-trade-annual.csv", merchandise_annual(a.raw),
                                                  ["period", "flow", "product", "value", "unit", "status"])
    com, totals = by_commodity(a.raw)
    built["merchandise-trade-by-commodity.csv"] = write(a.out, "merchandise-trade-by-commodity.csv", com,
                                                        ["period", "flow", "commodity_no", "commodity", "value", "unit", "table", "status"])
    built["merchandise-trade-by-partner.csv"] = write(a.out, "merchandise-trade-by-partner.csv", by_partner(a.raw),
                                                      ["period", "partner", "level", "group", "region", "flow", "value", "unit", "status"])
    built["forex-reserves-end-march.csv"] = write(a.out, "forex-reserves-end-march.csv", reserves(a.raw),
                                                  ["period", "as_on", "component", "value", "unit", "note"])
    monthly, annual, stock, diffs, flows, infra = payments(a.raw)
    built["payments-monthly.csv"] = write(a.out, "payments-monthly.csv", monthly,
                                          ["period", "item", "measure", "value", "unit", "rbi_label", "release", "status", "note"])
    built["payments-annual.csv"] = write(a.out, "payments-annual.csv", annual,
                                         ["period", "item", "measure", "value", "unit", "rbi_label", "release", "status", "note"])
    built["payment-infrastructure-monthly.csv"] = write(a.out, "payment-infrastructure-monthly.csv", stock,
                                                        ["period", "item", "value", "unit", "rbi_label", "release", "status", "note"])

    for name, where, want, src in CHECKS:
        hits = [r for r in built[name] if all(r[k] == v for k, v in where.items())]
        if len(hits) != 1 or hits[0]["value"] != want:
            fail("%s %s: got %s, %s prints %s" % (name, where, [h["value"] for h in hits], src, want))
    print("checked values: %d of %d match" % (len(CHECKS), len(CHECKS)))

    # Reports (not stops): differences that the README records.
    t111 = {(r["period"], r["flow"]): r["value"] for r in built["merchandise-trade-annual.csv"] if r["product"] == "total"}
    for flow, vals in totals.items():
        for y, v in vals.items():
            if t111[(y, flow)] != v:
                print("note: Table 111 %s %s is %s; commodity table total is %s" % (flow, y, t111[(y, flow)], v))
    n, bad = check_t58(a.raw, annual)
    print("Table 58 check: %d values, %d differ by more than rounding" % (n, len(bad)))
    for b in bad:
        print("  ", b)
    m_diff, a_diff, s_diff = diffs
    print("PSI prints that differ between releases: monthly flows %d, annual %d, infrastructure %d"
          % (len(m_diff), len(a_diff), len(s_diff)))
    for k in m_diff[:15]:
        print("  ", k, sorted({(p["release"], p["value"]) for p in flows
                               if p["col"] > 0 and (p["item"], p["measure"], p["period"]) == k}))


if __name__ == "__main__":
    main()
