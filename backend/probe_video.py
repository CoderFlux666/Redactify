import ffmpeg
import imageio_ffmpeg
import json
import os

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
file_path = "outputs/redacted_1766433988_6774633-uhd_3840_2160_30fps.mp4"

# Get ffprobe path (usually in same dir as ffmpeg)
ffmpeg_dir = os.path.dirname(ffmpeg_exe)
ffprobe_exe = os.path.join(ffmpeg_dir, "ffprobe.exe")
if not os.path.exists(ffprobe_exe):
    # Try generic name if specific one fails, or just rely on path if added
    ffprobe_exe = "ffprobe"

try:
    probe = ffmpeg.probe(file_path, cmd=ffprobe_exe)
    print(json.dumps(probe, indent=4))
except ffmpeg.Error as e:
    print(e.stderr.decode('utf8'))
