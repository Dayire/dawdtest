"""Render the HTML scenes to JPEG frames with headless Chromium (deterministic, frame = f(time)).

  python3 render.py --stills 5.0 20.0 ...     # global times in seconds -> build/stills/*.jpg (for review)
  python3 render.py --all [--workers 4]       # every frame -> build/frames/%05d.jpg
"""
import argparse, asyncio, json, os, subprocess, sys, glob
from playwright.async_api import async_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
BUILD = os.path.join(HERE, "build")
URL = "file://" + os.path.join(HERE, "web", "index.html")
FPS = 30


def prepare_footage():
    """Extract any clips listed in footage/manifest.json into frame sequences + manifest.js (see footage/README.md)."""
    mp = os.path.join(HERE, "footage", "manifest.json")
    items = json.load(open(mp)) if os.path.exists(mp) else []
    out = []
    for i, it in enumerate(items):
        src = os.path.join(HERE, "footage", it["file"])
        if not os.path.exists(src):
            print("  footage missing, skipped:", it["file"]); continue
        d = f"{i:02d}_{it['scene']}"
        dd = os.path.join(BUILD, "footage", d)
        os.makedirs(dd, exist_ok=True)
        if not glob.glob(dd + "/*.jpg"):
            cmd = ["ffmpeg", "-y", "-loglevel", "error", "-ss", str(it.get("in", 0))]
            if "dur" in it: cmd += ["-t", str(it["dur"])]
            cmd += ["-i", src, "-vf", f"fps={FPS},scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080", "-q:v", "3", dd + "/%05d.jpg"]
            subprocess.run(cmd, check=True)
        e = dict(it); e["dir"] = d; e["frames"] = len(glob.glob(dd + "/*.jpg")); out.append(e)
    open(os.path.join(HERE, "footage", "manifest.js"), "w").write("window.FOOTAGE=" + json.dumps(out) + ";")
    return out


async def worker(frames, outdir, pattern, q=92):
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args=["--allow-file-access-from-files", "--disable-web-security", "--font-render-hinting=none", "--no-sandbox"])
        pg = await b.new_page(viewport={"width": 1920, "height": 1080})
        pg.on("pageerror", lambda e: print("PAGE ERROR:", e, file=sys.stderr))
        pg.on("console", lambda m: print("console:", m.text, file=sys.stderr) if m.type in ("error", "warning") else None)
        await pg.goto(URL)
        await pg.evaluate("document.fonts.ready")
        for n, name in frames:
            await pg.evaluate(f"renderFrame({n})")
            await pg.screenshot(path=os.path.join(outdir, pattern % name), type="jpeg", quality=q)
        await b.close()


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--stills", type=float, nargs="*")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--workers", type=int, default=4)
    ap.add_argument("--range", type=int, nargs=2)
    a = ap.parse_args()
    prepare_footage()
    tl = json.load(open(os.path.join(BUILD, "timeline.json")))
    total = int(tl["total"] * FPS) + 1
    if a.stills:
        od = os.path.join(BUILD, "stills"); os.makedirs(od, exist_ok=True)
        await worker([(int(round(t * FPS)), f"{t:07.2f}") for t in a.stills], od, "s_%s.jpg", 88)
    if a.all:
        od = os.path.join(BUILD, "frames"); os.makedirs(od, exist_ok=True)
        lo, hi = a.range or (0, total)
        idx = list(range(lo, hi))
        chunks = [idx[i::a.workers] for i in range(a.workers)]
        await asyncio.gather(*[worker([(n, n) for n in c], od, "%05d.jpg") for c in chunks])


asyncio.run(main())
