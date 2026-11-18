# Design direction: Taksal (टकसाल, the mint)

Status: in review. Page 03 of the Paper file holds the full site (24 boards) with real data. The design boards live in a separate design file.

Reference: the "Assay" brand exploration by @Yaxbuzz, <https://x.com/Yaxbuzz/status/2122222435160474082> (16 Nov 2026).

## Idea

A mint strikes a coin, tests its metal, and stamps a hallmark that says who vouches for it. The site does the same with numbers. Each page has one lit object from India's material record. The grounds stay calm, the charts stay flat, and every figure carries a hallmark.

The brand colour is lac (लाख), the resin India used for sealing wax on official documents. Its Sanskrit name, laksha, is the same word as lakh. Lac seals a document the way the hallmark vouches for a figure.

## Rules

1. One object per page, at the top. Charts never sit on top of an object.
2. Every figure carries the hallmark: maker (office), standard (unit), assay mark (our check), date letter (period). Add a status word when needed: Provisional, Projection, Survey estimate, Method break.
3. Mono margin labels hold real provenance only: source, period, unit, date checked.
4. "Latest" is a word, not a colour. A selected item uses weight and a 6 px lac dot, never a coloured side bar or chip.
5. The national flag is an exact SVG (IS 1 proportions, 24 spokes). It marks India as a whole and nothing else. Its colours never encode data. The State Emblem is not used.
6. Faith objects are welcome on faith and culture pages.
7. Lakh and crore by default, with a switch to million. Hindi in the interface from launch.
8. No cards for figures or charts. Figures sit in ruled ledger rows. Charts sit on the white ground under a 1 px rule. A tooltip or bottom sheet may keep one shadow ring.
9. Nothing decorates the hero. No guide circles or construction lines.

## Tokens (in the Paper file)

| Role | Value |
| --- | --- |
| Lac (brand ground: nav, hero, footer, P1, assay punch) | #89221C |
| Lac line (hairlines on lac only) | #A95043 |
| Reading ground and chart surface (one white) | #FFFFFF |
| Kajal (rare dark ground: methods) | #141211 |
| Ink / Slate (text on white) | #16181D (17.8:1) / #555B68 (6.8:1) |
| Text on lac / secondary text on lac | #FFFFFF (9.1:1) / #DDD6D4 (6.3:1; 13.0:1 on kajal) |
| Rule (hairlines on white) | #DCDAD6 |
| Chart: India (reference), selected state and series 1 to 4, other | ink #16181D; lac #AF2C1F, peacock #008A78, turmeric #B7850C, lapis #3A5BA8; other #9AA0A8 (bars #C9CCD1) |
| Chart: target band, gridlines | #F2F1EE, #ECEBE8 |
| Flag only (conventional screen values; the Flag Code gives no hex) | #FF9933, #FFFFFF, #138808, chakra #000080 |

The four series colours pass the dataviz palette validator on white. The worst colourblind pair (peacock and lac) has a separation of ΔE 11.5. India is drawn in ink as a reference, not as a categorical hue.

Retired in round 3: neel (the blue copied from the reference tweet), limestone grey, basalt, and marigold.

Type:

- Marcellus 400 for display caps, in steps of 96, 64, 44 and 32.
- Tiro Devanagari Hindi for display in Hindi.
- Hanken Grotesk 400 to 600 for UI, body text and numbers (tabular figures).
- Hind for body text in Devanagari.
- Geist Mono 400 at 11 px, uppercase with +0.08 em tracking, for labels.

## Colour system v2 (18 Nov 2026)

The first Lac palette read as "black, brown and white". Version 2 gives each topic its own Indian pigment and widens the chart palette. Values were built in OKLCH (Emil colour skill method: equal lightness, equal share of each hue's chroma ceiling) and checked with the dataviz palette validator.

Topic pigments (hero ground, home and topics tiles, topic tag; never a data colour):

| Topic | Pigment | Hex | Text |
| --- | --- | --- | --- |
| Prices | lac (sealing wax) | #99221F | white 8.1:1 |
| Population | rani (Jaipur rani pink) | #902061 | white 8.2:1 |
| Elections | jamuni (voting-ink violet) | #6731A8 | white 8.1:1 |
| Education | lapis | #1952A2 | white 7.6:1 |
| Climate | mor (peacock) | #1E6066 | white 7.2:1 |
| Health | neem | #1E6534 | white 7.1:1 |
| Jobs | mehendi | #4D5D1A | white 7.3:1 |
| Economy | haldi (turmeric) | #E5B736 | ink 9.4:1 |
| Religion and culture | kesar (saffron) | #F48E2F | ink 7.4:1 |

Chart colours, fixed order: #CC2827, #00909C, #7233BB, #279662, #1C6DDA, #AA8726, #A11C6C, #C46C23. The set passes every check in light and dark mode (worst adjacent colourblind pair ΔE 15.8). Slots 1 to 3 also pass all-pairs, for maps and scatter. India is always ink. The selected state is slot 1.

Map ramps: sequential mor, 6 steps (#50C1C7 to #0D4346); diverging lapis to lac around the India value, with a neutral midpoint. Maps are tile grids (one equal tile per state or UT), so no boundary is drawn.

Entity colours are fixed site-wide (for example women slot 3, men slot 2, rural slot 4, urban slot 5, ages 15-29 slot 8). The full table lives in the kit board on page 03.

Heroes are small: topic heroes are 320 px with a 280 px emblem, and the first chart starts above 900 px.

## Objects

Made with Paper's image models: nano-banana-2-1 for objects, nano-banana-pro for the Nataraja, and quiver-arrow-telos for the vector hallmark seal. The seal ("Seal v2") shows a zebu and a ritual stand with no script, so it invents no writing. The raster Indus seal on lac follows the same design and also carries no script.

| Topic | Object | Material |
| --- | --- | --- |
| Home, brand | Indus stamp seal | Silver |
| Prices | Punch-marked karshapana | Silver |
| Methods, about the data | Merchant and scribe relief | Red sandstone |
| Religion, culture | Nataraja, Chola style | Silver |
| Elections | Inked finger | Silver, with violet ink |
| Climate | Samrat Yantra, Jantar Mantar | Sandstone |
| Jobs | Charkha | Silver |
| Population, Prices, Economy, Health, Education | Topic coins: procession, karshapana, wheat and gear, vaccine vial and stethoscope, palm-leaf book and slate | Silver |

Production rules:

- For kajal, generate the object on pure black and use the Screen blend.
- For white, generate it on pure white, raise brightness to 1.14 and use the Multiply blend.
- For lac, generate it on a flat sealing-wax red backdrop (hex 89221C, no gradient, no vignette). Use the normal blend and a radial mask to melt the edges. Screen on lac turns silver pink.
- Use one key light from the top left and a three-quarter view. Put no text on the object.

## Boards on page 02

- P1, P2, P3: posters, one object each. P1 "Every number has a source" on lac. P2 "How often India counts" on white. P3 "You should not have to take our word for it" on kajal.
- F1: foundations. Colour, chart series, type, the hallmark, the flag.
- F2: the object library and production rules.
- H1: homepage at 1440.
- T1: topic page, Prices, at 1440.
- M1, M2, M3: mobile home, chart with a pinned readout, hallmark sheet.

Real figures, checked against primary sources on 17 Nov 2026:

- CPI inflation 6.09%, Oct 2026, provisional (MoSPI). CPI base is 2024=100 from January 2026; the 2012=100 series ends in December 2025.
- Real GDP growth 7.8%, Q1 FY 2026-27 (MoSPI, base 2022-23).
- IIP growth 6.7%, Sep 2026, quick estimate (MoSPI).
- Unemployment 5.0%, Sep 2026, persons 15+, Current Weekly Status (MoSPI PLFS).
- Policy repo rate 5.50%, raised on 7 Oct 2026 (RBI).
- ₹93.57 per US$, FBIL reference rate, 17 Nov 2026 (shown on RBI's homepage). The earlier ₹93.77 could not be traced and was removed.
- RBI inflation target 4% with a band of 2% to 6%, retained for 1 Apr 2026 to 31 Mar 2031.

All chart lines and bars are illustrative and labelled so.

## Open points

- The Hindi copy needs native-speaker review.
- The objects are AI recasts. Each one is captioned as a recast, and none stands in for data.
