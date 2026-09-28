"""Assemble build/frames + build/mix.wav into the final MP4 (H.264 + AAC, 1080p30)."""
import os, subprocess, json
H = os.path.dirname(os.path.abspath(__file__)); B = f"{H}/build"
total = json.load(open(f"{B}/timeline.json"))["total"]
out = f"{H}/burger_history.mp4"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-stats", "-framerate", "30", "-i", f"{B}/frames/%05d.jpg", "-i", f"{B}/mix.wav",
                "-vf", "hqdn3d=5:4:8:7",  # tame per-frame film grain so the bitrate goes to picture, not noise
                "-c:v", "libx264", "-preset", "medium", "-crf", "23", "-maxrate", "3500k", "-bufsize", "9M", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k",
                "-t", f"{total:.3f}", "-movflags", "+faststart", out], check=True)
subprocess.run(["cp", f"{B}/burger_history.srt", f"{H}/burger_history.srt"])
print(out, os.path.getsize(out) // 1024 // 1024, "MB")
