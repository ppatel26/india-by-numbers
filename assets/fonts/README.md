# Fonts for chart images

The build renders PNG charts and social images with resvg, which needs TrueType files. These are the
same families the site loads from Fontsource. All are under the SIL Open Font License 1.1;
each family's copyright and licence is in `licences/`: Marcellus, Hanken Grotesk, Geist Mono, Tiro Devanagari Hindi, and the Noto Sans and Serif
families for Bengali, Devanagari, Gujarati, Gurmukhi, Kannada, Malayalam, Meetei Mayek, Oriya, Tamil,
Telugu, Tibetan and Nastaliq Urdu. Source: Google Fonts, downloaded 18 Nov 2026.

## One added glyph

Hanken Grotesk has no rupee sign (U+20B9). The three Hanken files here carry it, copied from Noto Sans
Devanagari and scaled to Hanken's cap height by `pipeline/fonts/add_rupee.py`, so rupee figures in chart
images stay in the same face. Both fonts are under the SIL OFL 1.1, and neither reserves its name.
