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
        """
        Improved face detection with frame-by-frame processing and precise redaction.
        Uses Haar Cascade for reliability and black rectangles for redaction.
        """
        cap = cv2.VideoCapture(input_path)
        if not cap.isOpened():
            raise ValueError("Could not open video file")

        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

        # Initialize face detection model (Haar Cascade - more reliable)
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
        frame_count = 0
        print("DEBUG: Starting frame-by-frame face detection...", flush=True)
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            frame_count += 1
            if frame_count % 50 == 0:
                print(f"DEBUG: Processed {frame_count} frames", flush=True)

            # Convert to grayscale for face detection
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            
            # Detect faces in EVERY frame (not every 3rd)
            # Parameters: scaleFactor=1.1, minNeighbors=5 for better precision
            faces = face_cascade.detectMultiScale(
                gray,
                scaleFactor=1.1,
                minNeighbors=5,
                minSize=(30, 30),
                flags=cv2.CASCADE_SCALE_IMAGE
            )
            
            # Remove duplicate/overlapping detections using Non-Maximum Suppression
            if len(faces) > 0:
                faces = self._remove_overlapping_boxes(faces)
            
            # Redact each detected face with BLACK RECTANGLE
            for (x, y, w, h) in faces:
                # Add padding for better coverage (20% on each side)
                pad_w = int(w * 0.2)
                pad_h = int(h * 0.25)
                
                # Calculate padded coordinates
                x1 = max(0, x - pad_w)
                y1 = max(0, y - pad_h)
                x2 = min(width, x + w + pad_w)
                y2 = min(height, y + h + pad_h)
                
                # Draw solid black rectangle for redaction
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 0), -1)
            
            out.write(frame)

        cap.release()
        out.release()
        print(f"DEBUG: Face redaction complete. Processed {frame_count} frames", flush=True)
    
    def _remove_overlapping_boxes(self, boxes):
        """
        Remove duplicate/overlapping face detections using Non-Maximum Suppression.
        This prevents multiple boxes on the same face.
        """
        if len(boxes) == 0:
            return []
        
        # Convert to (x1, y1, x2, y2) format
        boxes_xyxy = []
        for (x, y, w, h) in boxes:
            boxes_xyxy.append([x, y, x + w, y + h])
        
        boxes_xyxy = np.array(boxes_xyxy)
        
        # Get coordinates
        x1 = boxes_xyxy[:, 0]
        y1 = boxes_xyxy[:, 1]
        x2 = boxes_xyxy[:, 2]
        y2 = boxes_xyxy[:, 3]
        
        # Calculate areas
        areas = (x2 - x1) * (y2 - y1)
        
        # Sort by bottom-right y coordinate
        indices = np.argsort(y2)
        
        keep = []
        while len(indices) > 0:
            # Pick the last box
            last = len(indices) - 1
            i = indices[last]
            keep.append(i)
            
            # Find overlapping boxes
            xx1 = np.maximum(x1[i], x1[indices[:last]])
            yy1 = np.maximum(y1[i], y1[indices[:last]])
            xx2 = np.minimum(x2[i], x2[indices[:last]])
            yy2 = np.minimum(y2[i], y2[indices[:last]])
            
            # Calculate overlap
            w = np.maximum(0, xx2 - xx1)
            h = np.maximum(0, yy2 - yy1)
            overlap = (w * h) / areas[indices[:last]]
            
            # Remove overlapping boxes (threshold 0.3 = 30% overlap)
            indices = np.delete(indices, np.concatenate(([last], np.where(overlap > 0.3)[0])))
        
        # Return non-overlapping boxes in original format
        result = []
        for i in keep:
            x, y, w, h = boxes[i]
            result.append((x, y, w, h))
        
        return result

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
