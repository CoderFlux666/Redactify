import os
import cv2
import numpy as np
import ffmpeg
import imageio_ffmpeg
import shutil
import time
import json
import traceback
from .audio_redaction import AudioRedactionService

class VideoRedactionService:
    def __init__(self):
        self.ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()
        # Derive ffprobe path
        ffmpeg_dir = os.path.dirname(self.ffmpeg_path)
        self.ffprobe_path = os.path.join(ffmpeg_dir, "ffprobe.exe")
        if not os.path.exists(self.ffprobe_path):
            self.ffprobe_path = "ffprobe" # Fallback to system path
            
        self.face_cascade = None
        self.audio_service = AudioRedactionService()

    async def process_video(self, file, upload_dir="uploads", output_dir="outputs"):
        os.makedirs(upload_dir, exist_ok=True)
        os.makedirs(output_dir, exist_ok=True)

        filename = file.filename
        
        # Log start
        print(f"\n--- New Request ---\nProcessing video: {filename}\n", flush=True)

        input_path = os.path.join(upload_dir, filename)
        temp_video_path = os.path.join(output_dir, f"temp_video_{filename}")
        # Use .aac for audio extraction to ensure valid container
        temp_audio_path = os.path.join(output_dir, f"temp_audio_{filename}.aac")
        redacted_audio_path = os.path.join(output_dir, f"redacted_audio_{filename}.wav")
        
        timestamp = int(time.time())
        output_filename = f"redacted_{timestamp}_{filename}"
        output_path = os.path.join(output_dir, output_filename)

        # Save uploaded file
        with open(input_path, "wb") as f:
            content = await file.read()
            f.write(content)

        try:
            # 1. Process Video (Face Redaction)
            print("DEBUG: Starting Face Redaction...", flush=True)
            self._redact_faces(input_path, temp_video_path)
            
            # 2. Process Audio (Extraction + Bleeping)
            print("DEBUG: Starting Audio Processing...", flush=True)
            has_audio = self._extract_audio(input_path, temp_audio_path)
            
            final_audio_path = None
            if has_audio:
                print("DEBUG: Audio extracted, starting redaction...", flush=True)
                
                # Transcribe and find sensitive intervals
                intervals = self.audio_service._analyze_audio_file(temp_audio_path)
                
                if intervals:
                    print(f"DEBUG: Found {len(intervals)} sensitive segments. Bleeping...", flush=True)
                    self.audio_service._bleep_audio(temp_audio_path, redacted_audio_path, intervals)
                    final_audio_path = redacted_audio_path
                else:
                    print("DEBUG: No sensitive audio found.", flush=True)
                    final_audio_path = temp_audio_path
            
            # 3. Merge Video and Audio
            print("DEBUG: Merging Video and Audio...", flush=True)
            self._merge_video_audio(temp_video_path, final_audio_path, output_path)
            
            return {
                "status": "success",
                "original_filename": filename,
                "redacted_filename": output_filename,
                "redacted_file_path": output_path,
                "method": "Video (Face Blur) + Audio (Bleep)"
            }

        except Exception as e:
            traceback.print_exc()
            error_msg = str(e)
            print(f"ERROR: {error_msg}")
            print(traceback.format_exc())
            return {"status": "error", "message": error_msg}
            
        finally:
            # Cleanup
            for p in [temp_video_path, temp_audio_path, redacted_audio_path]:
                if p and os.path.exists(p):
                    try:
                        os.remove(p)
                    except:
                        pass

    def _redact_faces(self, input_path, output_path):
        # Initialize DNN model lazily
        self.net = None
        self.face_cascade = None

        cap = cv2.VideoCapture(input_path)
        if not cap.isOpened():
            raise ValueError("Could not open video file")

        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

        frame_count = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            frame_count += 1
            if frame_count % 100 == 0:
                print(f"DEBUG: Processing frame {frame_count}", flush=True)

            # OpenCV DNN Face Detection
            if not hasattr(self, 'last_detections'):
                self.last_detections = []

            # Run detection every 3 frames
            if frame_count % 3 == 0:
                if not hasattr(self, 'net') or self.net is None:
                    prototxt = "deploy.prototxt"
                    model = "res10_300x300_ssd_iter_140000.caffemodel"
                    if not os.path.exists(prototxt) or not os.path.exists(model):
                         # Fallback to Haar
                         if self.face_cascade is None:
                            self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
                         gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                         faces = self.face_cascade.detectMultiScale(gray, 1.1, 4)
                         self.last_detections = []
                         for (x, y, w, h) in faces:
                             self.last_detections.append({'x': x, 'y': y, 'w': w, 'h': h})
                    else:
                        self.net = cv2.dnn.readNetFromCaffe(prototxt, model)
                
                if hasattr(self, 'net') and self.net is not None:
                    blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 1.0, (300, 300), (104.0, 177.0, 123.0))
                    self.net.setInput(blob)
                    dnn_detections = self.net.forward()
                    
                    self.last_detections = []
                    for i in range(0, dnn_detections.shape[2]):
                        confidence = dnn_detections[0, 0, i, 2]
                        if confidence > 0.3:
                            box = dnn_detections[0, 0, i, 3:7] * np.array([width, height, width, height])
                            (startX, startY, endX, endY) = box.astype("int")
                            w = endX - startX
                            h = endY - startY
                            self.last_detections.append({'x': startX, 'y': startY, 'w': w, 'h': h})
            
            detections = self.last_detections
            
            for det in detections:
                x, y, w, h = det['x'], det['y'], det['w'], det['h']
                # Add padding
                pad_w = int(w * 0.1)
                pad_h = int(h * 0.15)
                x = max(0, x - pad_w)
                y = max(0, y - pad_h)
                w = min(width - x, w + 2*pad_w)
                h = min(height - y, h + 2*pad_h)
                
                # Redact with black rectangle
                cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 0, 0), -1)
            
            out.write(frame)

        cap.release()
        out.release()

    def _extract_audio(self, input_path, output_path):
        import subprocess
        print(f"DEBUG: Extracting audio from {input_path} to {output_path}", flush=True)
        
        try:
            # Just try to extract audio directly. If it fails or is empty, we assume no audio.
            # ffmpeg -i input.mp4 -vn -acodec aac output.aac
            cmd = [
                self.ffmpeg_path,
                "-y",
                "-i", input_path,
                "-vn", # No video
                "-acodec", "aac", # Convert to aac
                output_path
            ]
            
            print(f"DEBUG: Running extraction command: {' '.join(cmd)}", flush=True)
            result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            
            if result.returncode != 0:
                print(f"WARNING: Audio extraction failed (might be no audio): {result.stderr}", flush=True)
                return False
            
            if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
                print(f"DEBUG: Audio extraction successful: {output_path}", flush=True)
                return True
            else:
                print("DEBUG: Extracted audio file is empty or missing.", flush=True)
                return False
                
        except Exception as e:
            print(f"ERROR: Exception during audio extraction: {e}", flush=True)
            return False

    def _merge_video_audio(self, video_path, audio_path, output_path):
        import subprocess
        print(f"DEBUG: Merging {video_path} + {audio_path} -> {output_path}", flush=True)
        
        if audio_path and os.path.exists(audio_path) and os.path.getsize(audio_path) > 0:
            # Use subprocess for direct control to ensure audio is mapped correctly
            # ffmpeg -i video -i audio -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 output
            
            cmd = [
                self.ffmpeg_path,
                "-y",
                "-i", video_path,
                "-i", audio_path,
                "-c:v", "libx264", # Re-encode video to ensure compatibility
                "-pix_fmt", "yuv420p",
                "-c:a", "aac",
                "-map", "0:v:0", # Take video from first input (temp_video)
                "-map", "1:a:0", # Take audio from second input (redacted_audio)
                "-shortest", # Finish when shortest input ends
                output_path
            ]
            
            print(f"DEBUG: Running merge command: {' '.join(cmd)}", flush=True)
            try:
                result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
                
                if result.returncode != 0:
                    print(f"ERROR: FFmpeg merge failed: {result.stderr}", flush=True)
                    # Fallback: copy video without audio
                    shutil.copy(video_path, output_path)
                else:
                    print("DEBUG: Merge successful", flush=True)
            except Exception as e:
                print(f"ERROR: Subprocess execution failed: {e}", flush=True)
                shutil.copy(video_path, output_path)
        else:
            print("DEBUG: No valid audio file found, just copying video", flush=True)
            shutil.copy(video_path, output_path)
