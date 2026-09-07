#!/usr/bin/env python3
"""
Subset the desktop Source Serif 4 TTFs (https://github.com/adobe-fonts/source-serif,
SIL OFL 1.1) to the Latin range and write static/fonts/source-serif-4-*.woff2 plus
assets/css/fonts/source-serif-4.css.

CJK (Noto Serif SC) and IBM Plex Mono are mirrored from Google Fonts instead, see
tools/fetch-google-font.py.

Requires fontTools + brotli (pip install fonttools brotli).
Usage (from the theme root):  python3 tools/build-fonts.py --font-dir ~/Library/Fonts
"""
import argparse, os, subprocess, sys

# Google Fonts' "latin" range: covers Basic Latin, Latin-1, general punctuation, currency, arrows used in prose.
LATIN = ("U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,"
         "U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD")
FACES = [("SourceSerif4-Regular.ttf", 400, "normal"), ("SourceSerif4-It.ttf", 400, "italic"),
         ("SourceSerif4-Semibold.ttf", 600, "normal"), ("SourceSerif4-Bold.ttf", 700, "normal"),
         ("SourceSerif4-BoldIt.ttf", 700, "italic")]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--font-dir", default=os.path.expanduser("~/Library/Fonts"))
    ap.add_argument("--out", default="static/fonts")
    ap.add_argument("--css", default="assets/css/fonts/source-serif-4.css")
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True); os.makedirs(os.path.dirname(a.css), exist_ok=True)
    css = ["/* Source Serif 4 (SIL OFL 1.1), Latin subset built by tools/build-fonts.py. */"]
    for fname, w, style in FACES:
        src = next((os.path.join(d, fname) for d in [a.font_dir, "/Library/Fonts"] if os.path.exists(os.path.join(d, fname))), None)
        if not src: sys.exit(f"font not found: {fname}")
        out = f"source-serif-4-{w}{'i' if style == 'italic' else ''}.woff2"
        subprocess.run([sys.executable, "-m", "fontTools.subset", src, f"--output-file={os.path.join(a.out, out)}",
                        f"--unicodes={LATIN}", "--flavor=woff2", "--layout-features=*", "--no-hinting",
                        "--name-IDs=1,2,4,6,16,17", "--drop-tables+=DSIG"], check=True, capture_output=True)
        css.append('@font-face{font-family:"Source Serif 4";font-style:%s;font-weight:%d;font-display:swap;src:url(/fonts/%s) format("woff2");unicode-range:%s}'
                   % (style, w, out, LATIN.replace(",", ", ")))
        print("wrote", out, os.path.getsize(os.path.join(a.out, out)) // 1024, "KB")
    with open(a.css, "w", encoding="utf-8") as f: f.write("\n".join(css) + "\n")
    print("wrote", a.css)

if __name__ == "__main__":
    main()
