# Design direction: Taksal (टकसाल, the mint)

Status: built. The design boards (24, with real data) live in a separate design file; the live site follows them.

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

## Tokens

| Role | Value |
| --- | --- |
| Lac (brand ground: nav, hero, footer, the first poster, assay punch) | #89221C |
| Lac line (hairlines on lac only) | #A95043 |
| Reading ground and chart surface (one white) | #FFFFFF |
| Kajal (rare dark ground: methods) | #141211 |
| Ink / Slate (text on white) | #16181D (17.8:1) / #555B68 (6.8:1) |
| Text on lac / secondary text on lac | #FFFFFF (9.1:1) / #DDD6D4 (6.3:1; 13.0:1 on kajal) |
| Rule (hairlines on white) | #DCDAD6 |
| Chart: India (reference), selected state and series 1 to 4, other | ink #16181D; lac #AF2C1F, peacock #008A78, turmeric #B7850C, lapis #3A5BA8; other #9AA0A8 (bars #AEB3BB); India bar fills #3D424C |
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
| Crime and justice | kattha (catechu brown) | #78491E | white 7.6:1 |
| Living standards | firozi (turquoise) | #45C5B8 | ink 8.4:1 |
| Trade | manjistha (Indian madder) | #F28DA0 | ink 7.7:1 |
| Transport | neel (washed indigo) | #8CA8E7 | ink 7.5:1 |

Kattha (added 25 Nov 2026) sits at OKLCH L 0.452, C 0.086, H 60, in the gap between lac (H 27) and mehendi (H 122). Its nearest pigment is mehendi (OKLab distance 0.092).

Firozi (added 25 Nov 2026) is the third light pigment, at OKLCH L 0.750, C 0.112, H 186, and the first cool one. Its nearest pigment is haldi (OKLab distance 0.203). A dark teal at L 0.450 would sit within 0.04 of mor.

Chart colours, fixed order: #CC2827, #00909C, #7233BB, #279662, #1C6DDA, #AA8726, #A11C6C, #C46C23. The set passes every check in light and dark mode (worst adjacent colourblind pair ΔE 15.8). Slots 1 to 3 also pass all-pairs, for maps and scatter. India is always ink. The selected state is slot 1.

Map ramps: sequential mor, 6 steps from very light to very dark (#D2EFEF to #0A3A3D), so neighbouring bins read apart; tile text takes ink or white by contrast; diverging lapis to lac around the India value, with a neutral midpoint. Maps are tile grids (one equal tile per state or UT), so no boundary is drawn.

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
| Crime and justice | Tarazu, the Indian beam balance (not yet made) | Silver |
| Living standards | Stacked tiffin carrier (not yet made) | Silver |
| Trade | Uru, the Indian Ocean trading ship (not yet made) | Silver |
| Transport | Harappan two-wheeled cart with solid wheels (not yet made) | Silver |

Production rules:

- For kajal, generate the object on pure black and use the Screen blend.
- For white, generate it on pure white, raise brightness to 1.14 and use the Multiply blend.
- For lac, generate it on a flat sealing-wax red backdrop (hex 89221C, no gradient, no vignette). Use the normal blend and a radial mask to melt the edges. Screen on lac turns silver pink.
- Use one key light from the top left and a three-quarter view. Put no text on the object.

### Crime and justice (decided 25 Nov 2026)

A council of three models (GPT 6.2 Sol, Gemini 4 Neon, Muse Wonder 1.0) chose the name, the
pigment, the object and the interim:

- Name "Crime and justice", slug `crime-and-justice`: 3 of 3. It covers recorded crime, prisons
  and courts, and keeps the search word "crime".
- Pigment kattha #78491E: 2 of 3 chose kattha. This value matches the lightness of the other dark
  pigments. It avoids red, which reads as blood or alarm.
- Object: a silver tarazu beam balance, 3 of 3. It is from India's material record of weighing.
  It shows no police gear, no faith symbol and no State Emblem. A gavel is out: Indian judges do
  not use one.
- Prompt: "Three-quarter studio view of a traditional Indian tarazu beam balance in brushed silver,
  a curved beam and two level shallow pans on short silver links, one soft key light from the top
  left, no text or engravings, centred on a flat matte kattha backdrop (#78491E), no gradient, no
  vignette." Generate it with nano-banana-2-1, then cut it out with `pipeline/emblems/cutout.py`.
- Interim, 2 of 3: publish the topic with no object until the owner approves the image credits.
  The hero, the medallion and the social image leave the object slot out. Nothing stands in for it.
  Muse voted to hold the topic until the object exists.

### Living standards (decided 25 Nov 2026)

The same council chose:

- Name "Living standards", slug `living-standards`: 3 of 3. It covers household spending, food
  share, the consumption Gini, cooking fuel, drinking water, phones and computers, internet use,
  digital skills and bank accounts. It has no income, poverty line or housing stock, and the intro
  says so. "Poverty and inequality" stays on the Later list, for a poverty measure. "Housing and
  water" becomes "Housing", because water is now covered (2 of 3).
- Pigment firozi #45C5B8 with ink text: 2 of 3 chose a light teal (GPT zangaar #47C2A9, Gemini
  firozi #45C5B8). Firozi sits further from every other pigment and gives more contrast. Muse
  proposed ratanjot #6A4475, a dark plum, 0.095 from rani.
- Object: a plain silver stacked tiffin carrier, 2 of 3. It shows household meals, school and
  work, with no faith, class or caste mark. Gemini proposed a lota, which can read as ritual.
- Prompt: "Three-quarter studio view of one closed three-tier Indian tiffin carrier in brushed
  silver, with a plain side latch and loop handle, one soft key light from the top left, no text or
  engravings, centred on a flat matte firozi backdrop (#45C5B8), no gradient, no vignette." On a
  light ground, give the silver crisp shadows, as for haldi and kesar.
- Interim: the Crime and justice rule, 3 of 3. Publish with no object until the owner approves
  the image credits.

### Trade (decided 25 Nov 2026)

- Name "Trade", slug `trade`: 3 of 3. The intro says that the topic is India only and covers goods,
  services, remittances, the current account and foreign exchange reserves. The exchange rate stays
  in Economy, and digital payments join Economy as a part.
- Pigment manjistha #F28DA0 with ink text: 2 of 3 chose a light madder rose (GPT #F28DA0, Gemini
  #F28A96). Manjistha was itself an Indian export dye. #F28DA0 sits further from kesar (OKLab 0.125)
  and gives more contrast (7.7:1). Muse proposed peori #60552C, 0.048 from mehendi.
- Object: a silver trading ship, 2 of 3 (Gemini a Beypore uru, Muse a pattamar). GPT proposed a
  folded length of Coromandel chintz.
- Prompt: "Three-quarter studio view of a traditional Beypore uru Indian Ocean trading vessel in
  brushed silver, a curved hull with one furled lateen sail, crisp shadows, one soft key light from
  the top left, no text, flags or engravings, centred on a flat matte manjistha backdrop (#F28DA0),
  no gradient, no vignette."
- Interim: 3 of 3. Publish with no object until the owner approves the image credits.

### Transport (decided 25 Nov 2026)

The first round split three ways. A second round, with every member's reasons in front of it,
settled each point.

- Name "Transport", slug `transport`: 3 of 3 by the end (Gemini in round 1, GPT and Muse in round
  2). It matches the Later list and keeps a stable address when rail, aviation, freight or vehicle
  data arrive. The intro says what is not covered yet. The parts are road safety and household
  travel.
- Pigment neel (washed indigo) #8CA8E7 with ink text: 2 of 3 (GPT, Muse). Neel is an Indian dye.
  It has the widest gap from the other pigments (OKLab 0.136 to firozi) at L 0.735. Gemini proposed
  aasmani #74B3F3, a colour word, 0.120 from firozi.
- Object: a silver Harappan two-wheeled cart with solid disc wheels, 3 of 3 by the end. It comes
  from the material record, like the Indus seal. Solid wheels keep a clear shape at tile size and
  avoid any echo of the Ashoka Chakra or the Dharmachakra.
- Prompt: "Three-quarter studio view of an ancient Harappan two-wheeled cart in brushed silver,
  with solid disc wheels, a simple slatted frame and twin front shafts, crisp shadows, one soft key
  light from the top left, no text or engravings, centred on a flat matte neel backdrop (#8CA8E7),
  no gradient, no vignette."
- Interim: 3 of 3. Publish with no object until the owner approves the image credits.

## The design boards

- Three posters, one object each: "Every number has a source" on lac, "How often India counts" on white, and "You should not have to take our word for it" on kajal.
- Foundations: colour, chart series, type, the hallmark and the flag.
- The object library and its production rules.
- The home page and a topic page (Prices) at 1440 px.
- Mobile: the home page, a chart with a pinned readout, and the hallmark sheet.

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
