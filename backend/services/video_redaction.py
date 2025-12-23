import os
import cv2
import numpy as np
import ffmpeg
import imageio_ffmpeg

class VideoRedactionService:
    def __init__(self):
        self.ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()
        # Derive ffprobe path
        ffmpeg_dir = os.path.dirname(self.ffmpeg_path)
        self.ffprobe_path = os.path.join(ffmpeg_dir, "ffprobe.exe")
        if not os.path.exists(self.ffprobe_path):
            self.ffprobe_path = "ffprobe" # Fallback to system path
            
        self.face_cascade = None

    async def process_video(self, file, upload_dir="uploads", output_dir="outputs"):
        # ... (unchanged) ...
        os.makedirs(upload_dir, exist_ok=True)
        os.makedirs(output_dir, exist_ok=True)

        filename = file.filename
        
        # Log start
        with open("backend_debug.log", "a") as log:
            log.write(f"\n--- New Request ---\nProcessing video: {filename}\n")

        input_path = os.path.join(upload_dir, filename)
        temp_video_path = os.path.join(output_dir, f"temp_{filename}")
        import time
        timestamp = int(time.time())
        output_filename = f"redacted_{timestamp}_{filename}"
        output_path = os.path.join(output_dir, output_filename)

        # Save uploaded file
        with open(input_path, "wb") as f:
            content = await file.read()
            f.write(content)

        # Process video frames
        # Initialize DNN model lazily
        self.net = None
        self.face_cascade = None

        cap = cv2.VideoCapture(input_path)
        if not cap.isOpened():
            raise ValueError("Could not open video file")

        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        print(f"DEBUG: Video info - {width}x{height} @ {fps}fps", flush=True)
        
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(temp_video_path, fourcc, fps, (width, height))

        frame_count = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            frame_count += 1
            if frame_count % 100 == 0:
                print(f"DEBUG: Processing frame {frame_count}", flush=True)

            # OpenCV DNN Face Detection
            # Initialize detections list for this frame
            if not hasattr(self, 'last_detections'):
                self.last_detections = []

            # Run detection only every 3 frames to speed up
            if frame_count % 3 == 0:
                if not hasattr(self, 'net') or self.net is None:
                    prototxt = "deploy.prototxt"
                    model = "res10_300x300_ssd_iter_140000.caffemodel"
                    if not os.path.exists(prototxt) or not os.path.exists(model):
                         # Fallback to Haar if models missing (safety)
                         if self.face_cascade is None:
                            self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
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
                    # Loop over detections
                    for i in range(0, dnn_detections.shape[2]):
                        confidence = dnn_detections[0, 0, i, 2]
                        
                        if confidence > 0.3: # Lower threshold for higher recall
                            box = dnn_detections[0, 0, i, 3:7] * np.array([width, height, width, height])
                            (startX, startY, endX, endY) = box.astype("int")
                            
                            w = endX - startX
                            h = endY - startY
                            self.last_detections.append({'x': startX, 'y': startY, 'w': w, 'h': h})
            
            # Use current or last detections
            detections = self.last_detections
            
            if len(detections) > 0:
                if frame_count % 30 == 0:
                     with open("backend_debug.log", "a") as log:
                        log.write(f"Frame {frame_count}: Found {len(detections)} faces (DNN)\n")

            for det in detections:
                x, y, w, h = det['x'], det['y'], det['w'], det['h']
                
                # Add padding
                pad_w = int(w * 0.1)
                pad_h = int(h * 0.15)
                
                x = max(0, x - pad_w)
                y = max(0, y - pad_h)
                w = min(width - x, w + 2*pad_w)
                h = min(height - y, h + 2*pad_h)
                
                cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 0, 0), -1)
            
            out.write(frame)

        cap.release()
        out.release()
        
        if os.path.exists(temp_video_path):
            print(f"DEBUG: Temp video size: {os.path.getsize(temp_video_path)} bytes")
        else:
            print("DEBUG: Temp video NOT created!")

        # Merge audio from original to processed video
        try:
            # Check if original has audio
            audio_stream = None
            try:
                # Try ffprobe first (if available)
                if self.ffprobe_path and self.ffprobe_path != "ffprobe" and os.path.exists(self.ffprobe_path):
                     probe = ffmpeg.probe(input_path, cmd=self.ffprobe_path)
                     audio_stream = next((s for s in probe['streams'] if s['codec_type'] == 'audio'), None)
                else:
                    raise FileNotFoundError("ffprobe not found")
            except (ffmpeg.Error, FileNotFoundError, OSError, Exception) as e:
                # Fallback: use ffmpeg -i and parse stderr
                print(f"DEBUG: Probe failed ({e}), trying ffmpeg -i...")
                try:
                    import subprocess
                    # ffmpeg -i input.mp4 -> stderr contains stream info
                    result = subprocess.run(
                        [self.ffmpeg_path, "-i", input_path],
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                        text=True
                    )
                    # Look for "Stream #0:1... Audio:" or similar
                    if "Audio:" in result.stderr:
                        print("DEBUG: Audio stream detected via ffmpeg output")
                        audio_stream = True # Just a flag
                    else:
                        print("DEBUG: No audio stream detected via ffmpeg output")
                except Exception as ex:
                    print(f"DEBUG: Fallback audio check failed: {ex}")

            print("DEBUG: Running FFmpeg merge...")
            if audio_stream:
                input_video = ffmpeg.input(temp_video_path)
                input_audio = ffmpeg.input(input_path)
                
                (
                    ffmpeg
                    .output(input_video.video, input_audio.audio, output_path, vcodec='libx264', acodec='aac', pix_fmt='yuv420p', vf='scale=-2:720')
                    .overwrite_output()
                    .run(cmd=self.ffmpeg_path, capture_stdout=True, capture_stderr=True)
                )
            else:
                # No audio, just convert temp video to h264 for better compatibility
                (
                    ffmpeg
                    .input(temp_video_path)
                    .output(output_path, vcodec='libx264', pix_fmt='yuv420p', vf='scale=-2:720')
                    .overwrite_output()
                    .run(cmd=self.ffmpeg_path, capture_stdout=True, capture_stderr=True)
                )
            print(f"DEBUG: FFmpeg success. Output size: {os.path.getsize(output_path)}")

        except ffmpeg.Error as e:
            err_msg = e.stderr.decode('utf8')
            print("ffmpeg error:", err_msg)
            with open("backend_debug.log", "a") as log:
                log.write(f"FFmpeg Error: {err_msg}\n")
            # Fallback: just return the temp video (might be large/unsupported codec)
            import shutil
            shutil.move(temp_video_path, output_path)
        
        # Cleanup temp
        if os.path.exists(temp_video_path) and os.path.exists(output_path):
            os.remove(temp_video_path)

        return {
            "status": "success",
            "original_filename": filename,
            "redacted_filename": output_filename,
            "redacted_file_path": output_path,
            "method": "Video Redaction (OpenCV Face Detection)"
        }
