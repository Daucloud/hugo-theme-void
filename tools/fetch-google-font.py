#!/usr/bin/env python3
"""
Mirror a Google Fonts family into the theme so nothing is fetched from Google at
runtime (fonts.googleapis.com is unreachable from mainland China).

Downloads the css2 stylesheet with a modern browser UA (so Google returns woff2 +
unicode-range slices), saves every slice under static/fonts/<slug>/ and writes
assets/css/fonts/<slug>.css with the URLs rewritten to /fonts/<slug>/… .

Usage (from the theme root):
  python3 tools/fetch-google-font.py "Noto Serif SC" --weights 400 700 \
      --local 'Noto Serif SC' 'NotoSerifSC-Regular' 'Source Han Serif SC' 'SourceHanSerifSC-Regular'
  python3 tools/fetch-google-font.py "IBM Plex Mono" --weights 400 500 600 --subset latin

The committed noto-serif-sc / ibm-plex-mono files were produced this way (Google Fonts API v35 / v20).
"""
import argparse, os, re, sys, urllib.parse, urllib.request

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/128.0 Safari/537.36")

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("family")
    ap.add_argument("--weights", nargs="+", default=["400"])
    ap.add_argument("--subset", help="only keep slices whose /* subset */ comment matches, e.g. latin")
    ap.add_argument("--local", nargs="*", default=[], help="local() font names tried before downloading (regular weight)")
    ap.add_argument("--local-bold", nargs="*", default=[], help="local() names for weight 700")
    ap.add_argument("--out-dir", default="static/fonts")
    ap.add_argument("--css-dir", default="assets/css/fonts")
    a = ap.parse_args()
    slug = a.family.lower().replace(" ", "-")
    out = os.path.join(a.out_dir, slug); os.makedirs(out, exist_ok=True); os.makedirs(a.css_dir, exist_ok=True)
    css_out = [f"/* {a.family}: mirrored from Google Fonts by tools/fetch-google-font.py. */"]
    for w in a.weights:
        url = "https://fonts.googleapis.com/css2?" + urllib.parse.urlencode({"family": f"{a.family}:wght@{w}", "display": "swap"})
        css = get(url).decode("utf-8")
        blocks = re.findall(r"(?:/\* ([\w-]+) \*/\s*)?@font-face\s*\{(.*?)\}", css, re.S)
        i = 0
        for subset, body in blocks:
            if a.subset and subset != a.subset: continue
            src = re.search(r"url\((https:[^)]+)\)", body).group(1)
            rng = re.search(r"unicode-range:\s*([^;]+);", body).group(1).strip()
            name = f"{slug}-{w}-{i:03d}.woff2"; i += 1
            with open(os.path.join(out, name), "wb") as f: f.write(get(src))
            local = a.local_bold if (w == "700" and a.local_bold) else a.local
            local_src = "".join(f'local("{n}"),' for n in local)
            css_out.append('@font-face{font-family:"%s";font-style:normal;font-weight:%s;font-display:swap;src:%surl(/fonts/%s/%s) format("woff2");unicode-range:%s}'
                           % (a.family, w, local_src, slug, name, re.sub(r"\s+", " ", rng)))
        print(f"{a.family} {w}: {i} slices")
    path = os.path.join(a.css_dir, slug + ".css")
    with open(path, "w", encoding="utf-8") as f: f.write("\n".join(css_out) + "\n")
    print("wrote", path)

if __name__ == "__main__":
    main()
