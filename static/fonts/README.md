# Self-hosted web fonts

| Family | Files | Source | License |
|---|---|---|---|
| Source Serif 4 (400, 400i, 600, 700, 700i) | `source-serif-4-*.woff2` | Latin subsets of Adobe's desktop TTFs (fontTools/pyftsubset) | SIL OFL 1.1 |
| Noto Serif SC (400, 700) | `noto-serif-sc/*.woff2` | Google Fonts slices (API v35), mirrored via `tools/fetch-google-font.py` | SIL OFL 1.1 |
| JetBrains Mono (400, 400i, 500) | `jetbrains-mono-*.woff2` | Google Fonts latin slices, mirrored via `tools/fetch-google-font.py` | SIL OFL 1.1 |

The matching `@font-face` rules live in `assets/css/fonts/` and are imported by `assets/css/main.css`
(the Noto Serif SC declaration is loaded as a separate non-blocking stylesheet, see head/css.html).
Noto Serif SC is split into 101 unicode-range slices per weight (Google's segmentation), so a page only
downloads the slices covering the characters it actually uses; visitors with the font installed locally
skip the download thanks to `local()` sources.
