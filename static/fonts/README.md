# Self-hosted web fonts

| Family | Files | Source | License |
|---|---|---|---|
| Source Serif 4 (400, 400i, 600, 700, 700i) | `source-serif-4-*.woff2` | Adobe desktop TTFs, Latin subset via `tools/build-fonts.py` | SIL OFL 1.1 |
| Noto Serif SC (400, 600, 700) | `noto-serif-sc/*.woff2` | Google Fonts slices (API v35), mirrored via `tools/fetch-google-font.py` | SIL OFL 1.1 |
| IBM Plex Mono (400, 500, 600) | `ibm-plex-mono-*.woff2` | Google Fonts latin slices (v20), mirrored via `tools/fetch-google-font.py` | SIL OFL 1.1 |

The matching `@font-face` rules live in `assets/css/fonts/` and are imported by `assets/css/main.css`.
Noto Serif SC is split into 101 unicode-range slices per weight (Google's segmentation), so a page only
downloads the slices covering the characters it actually uses; visitors with the font installed locally
skip the download thanks to `local()` sources.
