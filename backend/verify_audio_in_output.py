import requests
import os
import subprocess
import sys
import shutil
import time

# Configuration
API_URL = "http://localhost:8000"
VIDEO_ENDPOINT = f"{API_URL}/redact/video"
TEST_VIDEO = "test_video_with_audio.mp4"
OUTPUT_DIR = "outputs"

def verify_audio():
    print(f"--- Verifying Audio in Redacted Video ---")
    
    # 1. Upload Video
    print(f"Uploading {TEST_VIDEO}...")
    try:
        with open(TEST_VIDEO, 'rb') as f:
            files = {'file': f}
            response = requests.post(VIDEO_ENDPOINT, files=files)
            
        if response.status_code != 200:
            print(f"ERROR: Upload failed with status {response.status_code}")
            print(response.text)
            return False
            
        data = response.json()
        if data.get("status") != "success":
            print(f"ERROR: API returned failure: {data}")
            return False
            
        redacted_filename = data.get("redacted_filename")
        redacted_url = data.get("url")
        print(f"Success! Redacted file: {redacted_filename}")
        print(f"URL: {redacted_url}")
        
    except Exception as e:
        print(f"ERROR: Exception during upload: {e}")
        return False

    # 2. Download Result (or find it locally since we are on the server)
    # Since we are running locally, we can just check the outputs folder
    local_path = os.path.join(OUTPUT_DIR, redacted_filename)
    if not os.path.exists(local_path):
        print(f"ERROR: Output file not found at {local_path}")
        return False
        
    print(f"Found output file at {local_path}")
    
    # 3. Check for Audio Stream using ffprobe
    print("Checking for audio stream...")
    try:
        import imageio_ffmpeg
        ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
        ffmpeg_dir = os.path.dirname(ffmpeg_exe)
        ffprobe_cmd = os.path.join(ffmpeg_dir, "ffprobe.exe")
        
        if not os.path.exists(ffprobe_cmd):
            print(f"WARNING: ffprobe not found at {ffprobe_cmd}. Trying 'ffprobe' from PATH.")
            ffprobe_cmd = "ffprobe" 
            
        print(f"DEBUG: Using ffprobe at: {ffprobe_cmd}")
            
        cmd = [
            ffprobe_cmd,
            "-v", "error",
            "-select_streams", "a:0",
            "-show_entries", "stream=codec_type",
            "-of", "default=noprint_wrappers=1:nokey=1",
            local_path
        ]
        
        try:
            result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            output = result.stdout.strip()
            
            if output == "audio":
                print("PASS: Audio stream detected via ffprobe!")
                return True
        except FileNotFoundError:
            print("WARNING: ffprobe execution failed (FileNotFound). Falling back to ffmpeg -i")
            
        # Fallback: use ffmpeg -i
        print("DEBUG: Trying ffmpeg -i fallback...")
        cmd = [ffmpeg_exe, "-i", local_path]
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if "Audio:" in result.stderr:
             print("PASS: Audio stream detected via ffmpeg output!")
             return True
        else:
             print("FAIL: No audio stream detected in ffmpeg output.")
             return False
            
    except Exception as e:
        print(f"ERROR: Exception during check: {e}")
        return False

if __name__ == "__main__":
    if verify_audio():
        sys.exit(0)
    else:
        sys.exit(1)
