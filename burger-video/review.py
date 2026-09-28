"""python3 review.py <scene> t1 t2 ...   (scene-local seconds) -> build/review_<scene>.jpg contact sheet"""
import sys, json, subprocess, glob, os
from PIL import Image
H = os.path.dirname(os.path.abspath(__file__))
tl = json.load(open(f"{H}/build/timeline.json"))
sc = {s["id"]: s for s in tl["scenes"]}[sys.argv[1]]
ts = [float(x) for x in sys.argv[2:]]
for f in glob.glob(f"{H}/build/stills/*.jpg"): os.remove(f)
subprocess.run(["python3", f"{H}/render.py", "--stills"] + [str(sc["start"] + t) for t in ts], check=True)
fs = sorted(glob.glob(f"{H}/build/stills/*.jpg"))
w = 800; ims = [Image.open(f).resize((w, w * 9 // 16)) for f in fs]
cols = 2; rows = (len(ims) + 1) // 2
S = Image.new("RGB", (cols * w, rows * w * 9 // 16))
for i, im in enumerate(ims): S.paste(im, ((i % cols) * w, (i // cols) * w * 9 // 16))
out = f"{H}/build/review_{sys.argv[1]}.jpg"; S.save(out); print(out)
