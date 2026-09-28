# The Burger: a short history (explainer video)

`burger_history.mp4` — 3:04, 1080p30. Captions in `burger_history.srt`.

## Rebuild
```
pip install pillow numpy playwright sherpa-onnx pyshp      # + ffmpeg, Chromium
python3 fetch_assets.py          # fonts + Natural Earth outlines (voice model: see script.py header)
python3 script.py                # narration + timeline (edit the script here)
python3 audio.py                 # score + SFX + mix
python3 render.py --all          # HTML/SVG scenes -> frames
python3 encode.py                # -> burger_history.mp4
python3 review.py <scene> t...   # contact sheet of stills for a scene (scene-local seconds)
```
Everything is a pure function of time (`web/scenes*.js`), timed off `build/timeline.json`.
The narration takes are cached in `build/tts_cache` so timings stay stable between runs.

## Real footage
See `footage/README.md`: add clips to `footage/manifest.json` and re-render; no code changes needed.
