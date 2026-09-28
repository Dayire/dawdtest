"""Assemble build/frames + build/mix.wav into the final MP4 (H.264 + AAC, 1080p30)."""
import os, subprocess, json
H = os.path.dirname(os.path.abspath(__file__)); B = f"{H}/build"
total = json.load(open(f"{B}/timeline.json"))["total"]
out = f"{H}/burger_history.mp4"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-stats", "-framerate", "30", "-i", f"{B}/frames/%05d.jpg", "-i", f"{B}/mix.wav",
                "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
                "-t", f"{total:.3f}", "-movflags", "+faststart", out], check=True)
subprocess.run(["cp", f"{B}/burger_history.srt", f"{H}/burger_history.srt"])
print(out, os.path.getsize(out) // 1024 // 1024, "MB")
