"""Narration script -> voice track + timeline.

Each scene is a list of (text, pause_after_seconds). The pauses ARE the pacing:
long ones let a beat land, short ones (the "who invented it" rapid-fire) push the speed up.
Outputs:
  build/narration.wav   full voice track, aligned to the timeline
  build/timeline.json   scene/segment start+end times (used by the renderer and the audio mixer)
  build/timeline.js     same data for the browser (file:// friendly)
  build/burger_history.srt   captions
"""
import json, os, wave, hashlib
import numpy as np
import sherpa_onnx

HERE = os.path.dirname(os.path.abspath(__file__))
BUILD = os.path.join(HERE, "build")
VOICE = os.path.join(HERE, "assets", "vits-piper-en_US-lessac-medium")
os.makedirs(BUILD, exist_ok=True)

# (scene id, lead-in seconds before first word, tail seconds after last word, [(text, pause_after)])
SCENES = [
    ("hook", 1.2, 4.6, [
        ("Picture the most American meal you can think of.", 0.55),
        ("A burger. Fries. A milkshake.", 1.25),
        ("Except the burger isn't really American.", 0.7),
        ("And, strictly speaking, it isn't even ham.", 0.0),
    ]),
    ("hamburg", 0.5, 0.9, [
        ("The story starts in Hamburg, Germany, a big port city on the river Elbe.", 0.45),
        ("By the eighteen hundreds, cooks there were serving chopped, seasoned beef, often with onions.", 0.35),
        ("It became known as Hamburg steak.", 0.8),
        ("Then millions of Europeans left through Hamburg's docks, bound for America.", 0.35),
        ("And the food went with them.", 0.0),
    ]),
    ("sandwich", 0.5, 0.9, [
        ("In the United States, Hamburg steak was on restaurant menus by the late eighteen hundreds.", 0.45),
        ("But it was a knife-and-fork meal.", 0.6),
        ("What it needed was bread. Something a worker, a farmer, or a fairgoer could eat standing up.", 0.0),
    ]),
    ("claims", 0.5, 1.1, [
        ("So, who put it between two slices?", 0.7),
        ("Well. That depends who you ask.", 1.0),
        ("Wisconsin says eighteen eighty-five.", 0.18),
        ("New York says eighteen eighty-five, too.", 0.18),
        ("Oklahoma says eighteen ninety-one.", 0.18),
        ("Connecticut says nineteen hundred, and has a Library of Congress nod to show for it.", 0.18),
        ("Texas says sometime around the eighteen eighties.", 0.85),
        ("Nobody has the receipts.", 0.0),
    ]),
    ("reputation", 0.6, 1.0, [
        ("By nineteen oh six, the burger had a problem.", 0.5),
        ("Upton Sinclair's novel The Jungle exposed filthy meatpacking plants, and ground beef, which can hide almost anything, took the blame.", 0.55),
        ("Burgers became a food to be suspicious of.", 1.1),
        ("Then, in nineteen twenty-one, in Wichita, Kansas, White Castle opened.", 0.4),
        ("Everything was white, and stainless steel, and cooked in plain view.", 0.4),
        ("The message: nothing to hide.", 0.0),
    ]),
    ("postwar", 0.7, 1.0, [
        ("Then came the car.", 0.75),
        ("After the Second World War, America built highways, suburbs, and drive-ins.", 0.5),
        ("In nineteen forty-eight, two brothers in San Bernardino, California, cut their menu down to burgers, fries, and shakes, and ran the kitchen like an assembly line.", 0.5),
        ("A milkshake-machine salesman named Ray Kroc saw it, and in nineteen fifty-five he opened a franchise in Des Plaines, Illinois.", 0.6),
        ("You know how it went from there.", 0.0),
    ]),
    ("global", 0.4, 1.0, [
        ("The Big Mac arrived in nineteen sixty-seven.", 0.4),
        ("Today, McDonald's alone runs more than forty thousand restaurants, in over a hundred countries.", 0.6),
        ("The burger is so standard that in nineteen eighty-six, The Economist used the Big Mac to compare currencies around the world.", 0.0),
    ]),
    ("now", 0.6, 1.0, [
        ("Americans eat roughly fifty billion burgers a year.", 0.35),
        ("That's about three a week, for every person in the country.", 0.9),
        ("And the burger keeps changing.", 0.4),
        ("In twenty sixteen, plant-based patties went mainstream.", 0.35),
        ("Smash burgers took over menus and food trucks.", 0.5),
        ("But the formula hasn't moved much: ground meat, bread, and something on top.", 0.0),
    ]),
    ("outro", 0.8, 5.5, [
        ("A dish named after a German city.", 0.4),
        ("Claimed by at least five towns.", 0.4),
        ("Rescued by a coat of white paint, and spread by highways.", 0.9),
        ("The burger isn't one invention.", 0.6),
        ("It's a long argument that everyone keeps eating.", 0.0),
    ]),
]

# Sound effects: (scene, segment index, offset seconds from segment start, kind)
SFX = [
    ("hook", 1, 0.05, "pop"), ("hook", 1, 0.85, "pop"), ("hook", 1, 1.55, "pop"),
    ("hook", 3, 2.35, "stamp"),
    ("hamburg", 0, 0.4, "ping"), ("hamburg", 2, 0.1, "pop"), ("hamburg", 3, 0.7, "whoosh"), ("hamburg", 4, 0.35, "pop"),
    ("sandwich", 0, 0.3, "whoosh"), ("sandwich", 2, 0.05, "pop"), ("sandwich", 2, 2.4, "thud"),
    ("claims", 2, 0.0, "slap"), ("claims", 3, 0.0, "slap"), ("claims", 4, 0.0, "slap"),
    ("claims", 5, 0.0, "slap"), ("claims", 6, 0.0, "slap"), ("claims", 7, 0.05, "stamp"),
    ("reputation", 1, 0.2, "whoosh"), ("reputation", 3, -0.95, "whoosh"), ("reputation", 3, 0.0, "chime"),
    ("postwar", 0, 0.0, "whoosh"), ("postwar", 3, 0.08, "pop"), ("postwar", 3, 3.4, "pop"), ("postwar", 4, 0.0, "ticks"),
    ("global", 1, 1.3, "ticks"), ("global", 2, 0.5, "pop"),
    ("now", 0, 0.4, "ticks"), ("now", 3, 0.06, "pop"), ("now", 4, 0.75, "thud"),
    ("outro", 4, 1.2, "chime"), ("hook", 3, 4.5, "chime"),
]

# music energy per scene (0 sparse .. 1 full) used by audio.py
ENERGY = {"hook": 0.25, "hamburg": 0.45, "sandwich": 0.5, "claims": 0.9, "reputation": 0.3,
          "postwar": 0.85, "global": 0.8, "now": 0.55, "outro": 0.3}


def main():
    cfg = sherpa_onnx.OfflineTtsConfig(
        model=sherpa_onnx.OfflineTtsModelConfig(
            vits=sherpa_onnx.OfflineTtsVitsModelConfig(
                model=f"{VOICE}/en_US-lessac-medium.onnx",
                tokens=f"{VOICE}/tokens.txt",
                data_dir=f"{VOICE}/espeak-ng-data",
                noise_scale=0.6, noise_scale_w=0.7, length_scale=1.06),
            num_threads=4, provider="cpu"))
    tts = sherpa_onnx.OfflineTts(cfg)
    sr = tts.sample_rate
    timeline, chunks, cursor = [], [], 0.0

    def put(samples, at):
        nonlocal chunks
        chunks.append((int(round(at * sr)), samples))

    for sid, lead, tail, segs in SCENES:
        t = lead
        seg_out = []
        for i, (text, pause) in enumerate(segs):
            # cache each line: the VITS sampler is stochastic, and cached takes keep timings (and the picture cues) stable
            cp = os.path.join(BUILD, "tts_cache", hashlib.md5(text.encode()).hexdigest() + ".npy")
            os.makedirs(os.path.dirname(cp), exist_ok=True)
            if os.path.exists(cp):
                s = np.load(cp)
            else:
                s = np.array(tts.generate(text, sid=0, speed=1.0).samples, dtype=np.float32)
                np.save(cp, s)
            dur = len(s) / sr
            put(s, cursor + t)
            seg_out.append({"text": text, "t0": round(t, 3), "t1": round(t + dur, 3)})
            t += dur + pause
        speech_end = seg_out[-1]["t1"]
        dur = speech_end + tail
        timeline.append({"id": sid, "start": round(cursor, 3), "dur": round(dur, 3), "segs": seg_out})
        print(f"{sid:11s} start {cursor:7.2f}  dur {dur:6.2f}")
        cursor += dur

    total = cursor
    out = np.zeros(int(total * sr) + sr, dtype=np.float32)
    for at, s in chunks:
        out[at:at + len(s)] += s
    out /= max(1e-6, np.abs(out).max()) / 0.9
    with wave.open(f"{BUILD}/narration.wav", "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((out * 32767).astype(np.int16).tobytes())

    sfx = []
    by = {s["id"]: s for s in timeline}
    for sid, seg, off, kind in SFX:
        sc = by[sid]
        sfx.append({"t": round(sc["start"] + sc["segs"][seg]["t0"] + off, 3), "kind": kind})
    meta = {"total": round(total, 3), "sr": sr, "scenes": timeline, "sfx": sorted(sfx, key=lambda x: x["t"]), "energy": ENERGY}
    json.dump(meta, open(f"{BUILD}/timeline.json", "w"), indent=1)
    open(f"{BUILD}/timeline.js", "w").write("window.TIMELINE=" + json.dumps(meta) + ";")

    def stamp(x):
        h, m, s = int(x // 3600), int(x % 3600 // 60), x % 60
        return f"{h:02d}:{m:02d}:{s:06.3f}".replace(".", ",")
    n = 1
    with open(f"{BUILD}/burger_history.srt", "w") as f:
        for sc in timeline:
            for sg in sc["segs"]:
                f.write(f"{n}\n{stamp(sc['start']+sg['t0'])} --> {stamp(sc['start']+sg['t1'])}\n{sg['text']}\n\n"); n += 1
    print(f"total {total:.1f}s ({total/60:.2f} min)")


if __name__ == "__main__":
    main()
