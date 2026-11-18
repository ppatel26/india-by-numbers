# Publisher logos

The Sources page shows each publisher's own logo, so readers can recognise the office behind the data.
The logos belong to their publishers. They identify each office; they do not mean the office endorses
India by Numbers, which is independent and not affiliated with the Government of India. Most logos
include the State Emblem of India.

Where the publisher's website served the file, we took it from there. Where the site refused automated
requests (PIB, MoHFW, the Ministry of Education, ECI), we took the copy on Wikimedia Commons.

| File in `public/logos/` | Publisher | From | Source | sha256 of the downloaded file |
| --- | --- | --- | --- | --- |
| `mospi.webp` | MoSPI | Official website | <https://www.mospi.gov.in/assets/mospi-logo-D_cI9Etu.svg> | `6e15bd783ff723c8ff23640d3c0617fddd3ab8cd0d530fefcd88138bc803a70a` |
| `orgi.webp` | ORGI (Census of India 2027 logo) | Wikimedia Commons | <https://commons.wikimedia.org/wiki/File%3ALogo_of_the_Census_of_India.jpg> | `2ac3c2ab4408b86af6e3ece19a3b6d1ea9a9cca0c96d8f25ce9701b55d8dd1f5` |
| `moe.webp` | Ministry of Education | Wikimedia Commons | <https://commons.wikimedia.org/wiki/File%3AMinistry_of_Education_India.svg> | `4b2558f37f57f1359f3175bd1fa68995018faa17695f1871bb2a11705417c541` |
| `rbi.webp` | Reserve Bank of India | Wikimedia Commons | <https://commons.wikimedia.org/wiki/File%3AReserve_Bank_of_India_logo.svg> | `c7f12d50a3b12af4cc02790617a5da55c1d7c720d033fdb8dd9f6e0588501409` |
| `imd.webp` | India Meteorological Department | Official website | <https://mausam.imd.gov.in/responsive/img/logo/imd_logo_a.webp> | `ed56ca5e7b6e2d50e845730863f7f59e5253d5f24f85c5f5fbc8ccd63a49ee12` |
| `eci.webp` | Election Commission of India | Wikimedia Commons | <https://commons.wikimedia.org/wiki/File%3AElection_Commission_of_India_Logo.svg> | `15c24cfe98002950e4a4938fa6f2156bdde4fda80d536e5aa0e0e5bc68cf8ba9` |
| `pib.webp` | Press Information Bureau | Wikimedia Commons | <https://commons.wikimedia.org/wiki/File%3APress_Information_Bureau%2C_Government_of_India.jpg> | `1382ee8b44945ecd42bfffa11de1e25e92deae131cb837b8834e1adb08688335` |
| `cea.webp` | Central Electricity Authority (its site shows the State Emblem) | Official website | <https://cea.nic.in/images/CEA_Embulum_Logo.webp> | `133caea7f5acd5fd0bcbf55b41efabdb5045e64540c5308437411c5a772c5abf` |
| `iips.webp` | International Institute for Population Sciences | Official website | <https://www.iipsindia.ac.in/sites/all/themes/iips/images/IIPS-LOGO.png> | `a327891d489090f47e3b1f2666415aa0ab13be535e65e7c35cef53a6eacbdc91` |
| `mnre.webp` | Ministry of New and Renewable Energy | Wikimedia Commons | <https://commons.wikimedia.org/wiki/File%3AMinistry_of_New_and_Renewable_Energy_logo.png> | `0c7dd570af7c92b561e47a3732942fac5c1e52acf25c5e2ff5c9a56bf1dfc02e` |
| `mohfw.webp` | Ministry of Health and Family Welfare | Wikimedia Commons | <https://commons.wikimedia.org/wiki/File%3AMinistry_of_Health_India.svg> | `43914dbd182a6f745ac168b7a66025b64841e3eaec4018d923938a6f8f3fbe0f` |

Read on 18 Nov 2026.

## Rebuild

Downloads are untrusted data: keep them in their own folder and keep the scripts outside it.

```sh
python3 -I pipeline/logos/fetch_logos.py <empty download folder>
node pipeline/logos/make_logos.mjs <download folder> <work folder> public/logos
```

`make_logos.mjs` draws each SVG with resvg (which runs no scripts in a file), trims the margins and writes
a 128 px tall WebP. The page shows them at 56 px or less.
