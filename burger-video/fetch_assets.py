"""Fetch fonts (Google Fonts, latin subset) and country outlines (Natural Earth via geopandas wheel)."""
import re, json, zipfile, glob, urllib.request, os, subprocess
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
os.makedirs("fonts", exist_ok=True)
fams = {"ArchivoBlack": "Archivo+Black", "Inter": "Inter:wght@400;600;800", "Caveat": "Caveat:wght@600", "DMSerif": "DM+Serif+Display"}
css_out = []
for name, q in fams.items():
    req = urllib.request.Request(f"https://fonts.googleapis.com/css2?family={q}&display=swap", headers={"User-Agent": UA})
    css = urllib.request.urlopen(req).read().decode()
    for m in re.finditer(r"/\* latin \*/\s*@font-face \{(.*?)\}", css, re.S):
        block = m.group(1)
        url = re.search(r"url\((https://[^)]+)\)", block).group(1)
        weight = re.search(r"font-weight:\s*(\d+)", block).group(1)
        fam = re.search(r"font-family:\s*'([^']+)'", block).group(1)
        fn = f"fonts/{name}-{weight}.woff2"
        open(fn, "wb").write(urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA})).read())
        css_out.append(f"@font-face{{font-family:'{fam}';font-weight:{weight};src:url({fn.split("/")[-1]}) format('woff2');}}")
open("fonts/fonts.css", "w").write("\n".join(css_out))
print("\n".join(css_out))

# country outlines
z = zipfile.ZipFile(glob.glob("/tmp/gp/geopandas-*.whl")[0])
names = [n for n in z.namelist() if "naturalearth_lowres" in n]
print(names)
z.extractall("/tmp/gp/x", names)
