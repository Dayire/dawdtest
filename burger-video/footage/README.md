# Dropping in real footage

The video is built so real archival/stock clips can be layered in with **no code changes**.
Right now `manifest.json` is empty, so the film is all motion graphics.

1. Put clips in this folder (any format ffmpeg reads).
2. List them in `manifest.json`, e.g.:

```json
[
  {"scene": "hamburg", "file": "hamburg_harbor.mp4", "t0": 1.0, "t1": 6.0, "mode": "window",
   "rect": [1080, 240, 640, 420], "rot": 2, "in": 12},
  {"scene": "postwar", "file": "drive_in_1950s.mp4", "t0": 3.0, "t1": 7.5, "mode": "full", "in": 0}
]
```

| key | meaning |
|---|---|
| `scene` | hook, hamburg, sandwich, claims, reputation, postwar, global, now, outro |
| `t0`,`t1` | seconds *within that scene* the clip is visible (see `build/timeline.json` for each line's timing) |
| `mode` | `full` = full-bleed b-roll under the vignette/grain; `window` = taped-photo style inset at `rect` `[x,y,w,h]` (1920x1080 space) |
| `in` / `dur` | start offset / length taken from the source file (seconds) |
| `filter` | optional CSS filter, default is a light "archival" sepia + contrast |

3. `python3 render.py --all` then `python3 encode.py`.

Note: `full` clips sit *above* the scene graphics, so use `window` mode (or shorten `t0..t1`) where
you want the cut-out illustrations to stay visible.

## Where to get it (all free/public domain)
- **Prelinger Archives** (archive.org) — 1940s-60s ads and educational films: drive-ins, diners, car culture, suburbs
- **Library of Congress** — Free to Use and Reuse sets; early film of ports, ships, city life
- **Wikimedia Commons** — categories: *Hamburg harbour*, *Hamburgers*, *Diners*, *Ocean liners*
- **NARA / US National Archives** — WWII-era and postwar footage
- **Pexels / Pixabay** — modern stock: griddles, smash burgers, plant-based patties

Suggested slots: hamburg (harbor, ships, emigrants), reputation (1900s meatpacking/city stills), postwar
(highway, drive-in, diner counter), global (busy streets abroad), now (griddle, smash burger, plant-based patty).
