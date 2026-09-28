"""Synthesised score + sound effects, mixed under the narration.
   music: soft pad + bass + plucks + light drums, energy follows the scene (script.ENERGY), key/mood follows the story
   sfx:   pops, whooshes, stamps... placed from timeline.json (cues authored next to the narration in script.py)
   mix:   narration compressed, music side-chain ducked by the voice, -16 LUFS master
"""
import json, os, subprocess, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__)); B = os.path.join(HERE, "build")
SR = 44100
tl = json.load(open(f"{B}/timeline.json")); TOTAL = tl["total"]
N = int((TOTAL + 1.5) * SR)
rng = np.random.default_rng(3)
mf = lambda m: 440 * 2 ** ((m - 69) / 12)
tt = lambda d: np.arange(int(d * SR)) / SR


def add(buf, at, sig, g=1.0):
    i = int(at * SR)
    if i >= len(buf) or i < 0: return
    j = min(len(buf), i + len(sig)); buf[i:j] += sig[:j - i] * g


def lp(x, k):  # crude one-pole low-pass, k in (0,1]
    y = np.empty_like(x); a = 0.0
    for i in range(len(x)): a += k * (x[i] - a); y[i] = a
    return y


# ---------------- instruments ----------------
def pluck(f, d=.55):
    t = tt(d); env = np.exp(-t * 6.5) * (1 - np.exp(-t * 500))
    return (np.sin(2 * np.pi * f * t) + .35 * np.sin(4 * np.pi * f * t) + .12 * np.sin(6 * np.pi * f * t)) * env
def padn(f, d):
    t = tt(d); env = np.minimum(1, t / .9) * np.minimum(1, np.maximum(0, d - t) / .9)
    return sum(np.sin(2 * np.pi * f * (1 + x) * t) for x in (-.004, 0, .004)) / 3 * env
def bass(f, d=1.0):
    t = tt(d); env = np.exp(-t * 2.6) * (1 - np.exp(-t * 300))
    return (np.sin(2 * np.pi * f * t) + .3 * np.sin(4 * np.pi * f * t)) * env
def kick():
    t = tt(.32); ph = 2 * np.pi * np.cumsum(48 + 110 * np.exp(-t * 32)) / SR
    return np.sin(ph) * np.exp(-t * 11)
def hat():
    t = tt(.07); n = rng.standard_normal(len(t)); n = np.diff(n, prepend=0)
    return n * np.exp(-t * 70)
def snap():
    t = tt(.16); n = rng.standard_normal(len(t)); return lp(n, .5) * np.exp(-t * 28) + np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * .5


# ---------------- music ----------------
MAJ = [(36, [60, 64, 67, 71]), (33, [57, 60, 64, 67]), (41, [60, 65, 69, 72]), (43, [59, 62, 67, 71])]   # Cmaj7 Am7 Fmaj7 G6
MIN = [(33, [57, 60, 64, 69]), (41, [60, 65, 69, 72]), (38, [57, 62, 65, 69]), (40, [56, 59, 64, 68])]   # Am Fmaj7 Dm E
BPM = 92; BEAT = 60 / BPM; BAR = 4 * BEAT
scenes = tl["scenes"]; sc_of = lambda t: next((s for s in scenes if s["start"] <= t < s["start"] + s["dur"]), scenes[-1])
grid = np.arange(0, TOTAL + 1.5, .05)
E0 = np.array([tl["energy"][sc_of(t)["id"]] for t in grid])
k = int(2.2 / .05); E_s = np.convolve(np.pad(E0, (k, k), mode="edge"), np.ones(2 * k + 1) / (2 * k + 1), mode="valid")
energy = lambda t: float(E_s[min(len(E_s) - 1, int(t / .05))])

def minor_at(t):
    s = sc_of(t); loc = t - s["start"]
    return (s["id"] == "reputation" and loc < 14.4) or (s["id"] == "hook" and loc < 3.0 and False)

music = np.zeros(N)
t0 = .4; bar_i = 0
while t0 < TOTAL + 1:
    prog = MIN if minor_at(t0) else MAJ
    root, tones = prog[(bar_i // 2) % 4]
    e = energy(t0)
    add(music, t0, padn(mf(tones[0] - 12), 2 * BAR + .8), .085 * (.6 + e))
    add(music, t0, padn(mf(tones[2] - 12), 2 * BAR + .8), .07 * (.6 + e))
    if True:
        for step in range(8):                      # eighth notes in this bar
            tm = t0 + step * BEAT / 2; e = energy(tm)
            if e > .35 and step % 1 == 0:
                pat = [0, 1, 2, 3, 2, 1, 3, 2][step]
                add(music, tm, pluck(mf(tones[pat] + (12 if step % 4 == 3 else 0))), .09 * min(1, (e - .25) * 2))
            if step % 4 == 0 and e > .3: add(music, tm, bass(mf(root + 12 * 0 + 12)), .2 * min(1, e * 1.4))
            if step in (0, 4) and e > .6: add(music, tm, kick(), .42 * min(1, (e - .4) * 2.5))
            if step in (2, 6) and e > .75: add(music, tm, snap(), .18)
            if step % 2 == 1 and e > .65: add(music, tm, hat(), .05)
    bar_i += 1; t0 += BAR
# fade in/out
tg = np.arange(N) / SR
music *= np.minimum(1, tg / 1.5) * np.minimum(1, np.maximum(0, TOTAL + 1.2 - tg) / 3.0)
music /= max(1e-6, np.abs(music).max()) / .6

# ---------------- sfx ----------------
def s_pop():
    t = tt(.16); f = 900 * np.exp(-t * 14) + 220
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 26)
def s_ping():
    t = tt(.9); return (np.sin(2 * np.pi * 1318 * t) + .4 * np.sin(2 * np.pi * 1976 * t)) * np.exp(-t * 5) * (1 - np.exp(-t * 800))
def s_whoosh():
    d = .7; t = tt(d); n = rng.standard_normal(len(t)); out = np.zeros(len(t))
    fc = 300 + 3200 * (t / d) ** 2
    a = np.exp(-2 * np.pi * fc / SR); y = 0.0; y2 = 0.0
    for i in range(len(t)):
        y = (1 - a[i]) * n[i] + a[i] * y; y2 = (1 - a[i]) * y + a[i] * y2; out[i] = y - y2
    env = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.5
    out = out / (np.abs(out).max() + 1e-9)
    return out * env
def s_thud():
    t = tt(.4); ph = 2 * np.pi * np.cumsum(38 + 80 * np.exp(-t * 25)) / SR
    return np.sin(ph) * np.exp(-t * 9) + lp(rng.standard_normal(len(t)), .1) * np.exp(-t * 40) * .5
def s_slap():
    t = tt(.14); n = lp(rng.standard_normal(len(t)), .6) * np.exp(-t * 50)
    return n * 1.4 + s_pop()[:len(t)] * .5
def s_stamp():
    t = tt(.5); n = lp(rng.standard_normal(len(t)), .25) * np.exp(-t * 22)
    th = s_thud(); th = np.pad(th, (0, len(t) - len(th)))
    return th * 1.1 + n * .9
def s_chime():
    out = np.zeros(int(1.8 * SR))
    for i, m in enumerate([84, 88, 91, 96]):
        t = tt(1.4); add(out, i * .09, np.sin(2 * np.pi * mf(m) * t) * np.exp(-t * 3.2) * (1 - np.exp(-t * 900)), .5)
    return out
def s_ticks():
    out = np.zeros(int(1.7 * SR)); x = 0.0; gap = .16
    while x < 1.55:
        t = tt(.03); add(out, x, np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 160), .8); x += gap; gap = max(.045, gap * .86)
    return out

SFX = dict(pop=(s_pop, .8), ping=(s_ping, .5), whoosh=(s_whoosh, .55), thud=(s_thud, .9), slap=(s_slap, .8), stamp=(s_stamp, 1.0), chime=(s_chime, .45), ticks=(s_ticks, .5))
cache = {k: v[0]() for k, v in SFX.items()}
sfx = np.zeros(N)
for ev in tl["sfx"]: add(sfx, ev["t"], cache[ev["kind"]], SFX[ev["kind"]][1])
sfx /= max(1e-6, np.abs(sfx).max()) / .8

def wr(name, x):
    with wave.open(f"{B}/{name}.wav", "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())
wr("music", music); wr("sfx", sfx)

# ---------------- mix ----------------
fc = ("[0:a]aresample=44100,highpass=f=80,acompressor=threshold=0.09:ratio=3:attack=5:release=90:makeup=2,apad,asplit=2[nar][sc];"
      "[1:a]volume=0.5[mus];[mus][sc]sidechaincompress=threshold=0.015:ratio=9:attack=15:release=450[musd];"
      "[2:a]volume=0.75[fx];"
      f"[nar][musd][fx]amix=inputs=3:normalize=0:duration=longest,atrim=0:{TOTAL + 1.0:.2f},loudnorm=I=-16:TP=-1.5:LRA=11[out]")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{B}/narration.wav", "-i", f"{B}/music.wav", "-i", f"{B}/sfx.wav",
                "-filter_complex", fc, "-map", "[out]", "-ar", "44100", f"{B}/mix.wav"], check=True)
print("mix ok", os.path.getsize(f"{B}/mix.wav") // 1024, "KB")
