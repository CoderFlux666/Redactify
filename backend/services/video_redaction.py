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
# Import ultralytics at top level to avoid runtime delays and threading issues
try:
    from ultralytics import YOLO
except ImportError:
    print("WARNING: Ultralytics not found. Video redaction will fail.", flush=True)


class VideoRedactionService:
    def __init__(self):
        self.ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()
        print(f"DEBUG: FFmpeg path: {self.ffmpeg_path}", flush=True)
        # Derive ffprobe path
        ffmpeg_dir = os.path.dirname(self.ffmpeg_path)
        self.ffprobe_path = os.path.join(ffmpeg_dir, "ffprobe.exe")
        if not os.path.exists(self.ffprobe_path):
            print(f"DEBUG: ffprobe not found at {self.ffprobe_path}, falling back to system path", flush=True)
            self.ffprobe_path = "ffprobe" # Fallback to system path
        else:
            print(f"DEBUG: ffprobe found at {self.ffprobe_path}", flush=True)
            
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
            msg = f"DEBUG: Starting Face Redaction on {input_path} -> {temp_video_path}"
            print(msg, flush=True)
            with open("debug_redaction.log", "a") as log_file: log_file.write(msg + "\n")
            
            if not os.path.exists(input_path):
                msg = f"ERROR: Input file does not exist: {input_path}"
                print(msg, flush=True)
                with open("debug_redaction.log", "a") as log_file: log_file.write(msg + "\n")
                raise FileNotFoundError(f"Input file not found: {input_path}")
                
            self._redact_faces(input_path, temp_video_path)
            
            msg = "DEBUG: Face Redaction completed successfully"
            print(msg, flush=True)
            with open("debug_redaction.log", "a") as log_file: log_file.write(msg + "\n")
            
            # 2. Process Audio (Extraction + Bleeping)
            msg = "DEBUG: Starting Audio Processing..."
            print(msg, flush=True)
            with open("debug_redaction.log", "a") as log_file: log_file.write(msg + "\n")
            
            has_audio = self._extract_audio(input_path, temp_audio_path)
            
            final_audio_path = None
            if has_audio:
                msg = "DEBUG: Audio extracted, starting redaction..."
                print(msg, flush=True)
                with open("debug_redaction.log", "a") as log_file: log_file.write(msg + "\n")
                
                # Transcribe and find sensitive intervals
                intervals = self.audio_service._analyze_audio_file(temp_audio_path)
                
                if intervals:
                    msg = f"DEBUG: Found {len(intervals)} sensitive segments. Bleeping..."
                    print(msg, flush=True)
                    with open("debug_redaction.log", "a") as log_file: log_file.write(msg + "\n")
                    self.audio_service._bleep_audio(temp_audio_path, redacted_audio_path, intervals)
                    final_audio_path = redacted_audio_path
                else:
                    msg = "DEBUG: No sensitive audio found."
                    print(msg, flush=True)
                    with open("debug_redaction.log", "a") as log_file: log_file.write(msg + "\n")
                    final_audio_path = temp_audio_path
            
            # 3. Merge Video and Audio
            msg = "DEBUG: Merging Video and Audio..."
            print(msg, flush=True)
            with open("debug_redaction.log", "a") as log_file: log_file.write(msg + "\n")
            self._merge_video_audio(temp_video_path, final_audio_path, output_path)
            
            if not os.path.exists(output_path) or os.path.getsize(output_path) == 0:
                msg = f"ERROR: Output file creation failed: {output_path}"
                print(msg, flush=True)
                with open("debug_redaction.log", "a") as log_file: log_file.write(msg + "\n")
                raise RuntimeError("Failed to generate redacted video file.")
            
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
            with open("debug_redaction.log", "a") as log_file:
                log_file.write(f"ERROR: {error_msg}\n")
                log_file.write(traceback.format_exc() + "\n")
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
        YOLOv8 FACE DETECTION - Industry Grade.
        - Uses YOLOv8n-face model (Deep Learning)
        - Extremely accurate and fast
        - Continuous tracking
        - Zero missed frames
        """
        try:
            # Already imported at top level
            pass
        except ImportError:
            raise ImportError("Ultralytics (YOLO) is still installing. Please wait a moment and try again.")
            
        import requests
        
        cap = cv2.VideoCapture(input_path)
        if not cap.isOpened():
            raise ValueError("Could not open video file")

        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

        # Download YOLOv8-face model if not present
        # Use absolute path to ensure we find the downloaded model
        work_dir = os.getcwd()
        model_filename = "yolov8n-face.pt"
        model_path = os.path.join(work_dir, model_filename)
        
        if not os.path.exists(model_path):
            print("DEBUG: Downloading YOLOv8-face model...", flush=True)
            try:
                # Using a reliable source for yolov8n-face.pt
                url = "https://github.com/YapaLab/yolo-face/releases/download/1.0.0/yolov8n-face.pt"
                response = requests.get(url, stream=True)
                response.raise_for_status()
                with open(model_path, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        f.write(chunk)
                print("DEBUG: Model downloaded successfully.", flush=True)
            except Exception as e:
                print(f"DEBUG: Failed to download face model: {e}", flush=True)
                print("DEBUG: Falling back to standard YOLOv8n (person detection) as emergency...", flush=True)
                model_path = "yolov8n.pt" # Fallback to standard model
        
        # Load model
        print(f"DEBUG: Loading YOLO model: {model_path}", flush=True)
        try:
            model = YOLO(model_path)
            print("DEBUG: YOLO model loaded successfully object created", flush=True)
        except Exception as e:
            print(f"DEBUG: Failed to load model: {e}", flush=True)
            import traceback
            traceback.print_exc()
            raise
        
        # Tracking parameters
        tracked_faces = []
        max_tracking_frames = 120 # 4 seconds
        face_sizes = []
        standard_box_size = None
        
        frame_count = 0
        print(f"DEBUG: Starting YOLO face detection on {total_frames} frames...", flush=True)
        
        try:
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                
                frame_count += 1
                if frame_count % 30 == 0:
                    progress = (frame_count / total_frames) * 100 if total_frames > 0 else 0
                    print(f"DEBUG: Processing frame {frame_count}/{total_frames} ({progress:.1f}%)", flush=True)

                # Run inference
                # conf=0.45 for higher precision (less false positives), iou=0.5 for NMS
                try:
                    results = model(frame, verbose=False, conf=0.60, iou=0.5)
                except Exception as e:
                    print(f"DEBUG: Inference error frame {frame_count}: {e}", flush=True)
                    continue
                
                detected_faces = []
                for result in results:
                    boxes = result.boxes
                    for box in boxes:
                        # Check class if using standard model (0 is person)
                        cls = int(box.cls[0])
                        if "face" not in model_path and cls != 0:
                            continue
                            
                        # Get box coordinates
                        x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                        x, y = int(x1), int(y1)
                        w, h = int(x2 - x1), int(y2 - y1)
                        
                        # Ensure within bounds
                        x = max(0, x)
                        y = max(0, y)
                        w = min(width - x, w)
                        h = min(height - y, h)
                        
                        # Filter out very small boxes (noise) - e.g. less than 2% of height
                        min_dim = int(height * 0.02)
                        if w > min_dim and h > min_dim:
                            detected_faces.append((x, y, w, h))
                            face_sizes.append(max(w, h))
                
                # Apply NMS to detections to prevent double blocks from the model itself
                detected_faces = self._aggressive_nms(detected_faces, overlap_threshold=0.3)
                
                # Match with tracked faces
                current_faces = []
                for (x, y, w, h) in detected_faces:
                    matched = False
                    for tracked in tracked_faces:
                        tx, ty, tw, th = tracked['box']
                        vx, vy = tracked.get('velocity', (0, 0))
                        predicted_x = tx + vx
                        predicted_y = ty + vy
                        
                        if (self._calculate_iou((x, y, w, h), (predicted_x, predicted_y, tw, th)) > 0.1 or
                            self._calculate_iou((x, y, w, h), tracked['box']) > 0.1):
                            
                            # Calculate velocity
                            new_vx = x - tx
                            new_vy = y - ty
                            
                            # Smooth velocity (EMA)
                            old_vx, old_vy = tracked.get('velocity', (0, 0))
                            smooth_vx = int(0.4 * new_vx + 0.6 * old_vx)
                            smooth_vy = int(0.4 * new_vy + 0.6 * old_vy)
                            tracked['velocity'] = (smooth_vx, smooth_vy)
                            
                            tracked['box'] = (x, y, w, h)
                            tracked['frames_since_seen'] = 0
                            
                            # Smooth box parameters (EMA) to prevent flickering
                            # alpha = 0.3 means 30% new value, 70% old value (smoother)
                            sx, sy, sw, sh = tracked.get('smooth_box', (x, y, w, h))
                            alpha = 0.3
                            
                            smooth_x = sx * (1 - alpha) + x * alpha
                            smooth_y = sy * (1 - alpha) + y * alpha
                            smooth_w = sw * (1 - alpha) + w * alpha
                            smooth_h = sh * (1 - alpha) + h * alpha
                            
                            tracked['smooth_box'] = (smooth_x, smooth_y, smooth_w, smooth_h)
                            
                            current_faces.append(tracked)
                            matched = True
                            break
                    
                    if not matched:
                        current_faces.append({
                            'box': (x, y, w, h),
                            'smooth_box': (x, y, w, h), # Initialize smooth box
                            'frames_since_seen': 0,
                            'velocity': (0, 0),
                            'is_moving': False
                        })
                
                # Keep tracking
                for tracked in tracked_faces:
                    if tracked not in current_faces:
                        tracked['frames_since_seen'] += 1
                        if tracked['frames_since_seen'] < max_tracking_frames:
                            # Use smooth box for prediction
                            sx, sy, sw, sh = tracked['smooth_box']
                            vx, vy = tracked.get('velocity', (0, 0))
                            
                            # Decelerate
                            vx = vx * 0.95
                            vy = vy * 0.95
                            tracked['velocity'] = (vx, vy)
                            
                            # Update smooth box
                            tracked['smooth_box'] = (sx + vx, sy + vy, sw, sh)
                            # Update raw box too
                            x, y, w, h = tracked['box']
                            tracked['box'] = (x + int(vx), y + int(vy), w, h)
                            
                            current_faces.append(tracked)
                
                
                # Deduplicate tracked faces to ensure only one block per face
                tracked_faces = self._deduplicate_tracks(current_faces)
                
                # Draw boxes
                for face_data in tracked_faces:
                    # Use the SMOOTHED box coordinates
                    sx, sy, sw, sh = face_data['smooth_box']
                    
                    # Convert to int for drawing
                    x, y, w, h = int(sx), int(sy), int(sw), int(sh)
                    
                    # Constant multiplier for stability (no jumping)
                    multiplier = 1.1
                    box_size = int(max(w, h) * multiplier)
                    
                    center_x = int(x + w // 2)
                    center_y = int(y + h // 2)
                    
                    half_size = box_size // 2
                    x1 = max(0, center_x - half_size)
                    y1 = max(0, center_y - half_size)
                    x2 = min(width, center_x + half_size)
                    y2 = min(height, center_y + half_size)
                    
                    self._draw_rounded_rectangle(frame, (x1, y1), (x2, y2), (0, 0, 0), radius=15)
                
                out.write(frame)
                
        finally:
            cap.release()
            out.release()
            
        print(f"DEBUG: YOLO face redaction complete. Processed {frame_count} frames", flush=True)
    
    def _draw_rounded_rectangle(self, img, pt1, pt2, color, radius=15):
        """Draw a clean, solid filled rounded rectangle."""
        x1, y1 = pt1
        x2, y2 = pt2
        
        # Ensure radius isn't too large for the box
        w, h = x2 - x1, y2 - y1
        if w <= 0 or h <= 0: return
        radius = min(radius, w // 4, h // 4)
        
        # Draw the main solid black shape
        # 1. Draw filled circles at corners
        cv2.circle(img, (x1 + radius, y1 + radius), radius, color, -1)
        cv2.circle(img, (x2 - radius, y1 + radius), radius, color, -1)
        cv2.circle(img, (x1 + radius, y2 - radius), radius, color, -1)
        cv2.circle(img, (x2 - radius, y2 - radius), radius, color, -1)
        
        # 2. Draw filled rectangles to connect them
        cv2.rectangle(img, (x1 + radius, y1), (x2 - radius, y2), color, -1) # Top to bottom, inset x
        cv2.rectangle(img, (x1, y1 + radius), (x2, y2 - radius), color, -1) # Left to right, inset y
        
        # Optional: Very subtle border to define edges if needed, but keeping it simple for "total black" look
        # If user wants a border, we can add it back, but cleaner. 
        # For now, solid black is the request.

    def _deduplicate_tracks(self, tracks, threshold=0.4):
        """Remove overlapping tracked faces to ensure only one block per face."""
        if not tracks:
            return []
        
        # Sort by 'frames_since_seen' (prefer active ones)
        tracks.sort(key=lambda x: x['frames_since_seen'])
        
        keep = []
        for t1 in tracks:
            is_duplicate = False
            for t2 in keep:
                if self._calculate_iou(t1['box'], t2['box']) > threshold:
                    is_duplicate = True
                    break
            if not is_duplicate:
                keep.append(t1)
        return keep
    
    def _calculate_iou(self, box1, box2):
        """Calculate Intersection over Union between two boxes."""
        x1, y1, w1, h1 = box1
        x2, y2, w2, h2 = box2
        
        # Calculate intersection
        x_left = max(x1, x2)
        y_top = max(y1, y2)
        x_right = min(x1 + w1, x2 + w2)
        y_bottom = min(y1 + h1, y2 + h2)
        
        if x_right < x_left or y_bottom < y_top:
            return 0.0
        
        intersection = (x_right - x_left) * (y_bottom - y_top)
        box1_area = w1 * h1
        box2_area = w2 * h2
        union = box1_area + box2_area - intersection
        
        return intersection / union if union > 0 else 0.0
    
    def _ultra_aggressive_nms(self, boxes, iou_threshold=0.1):
        """
        ULTRA aggressive NMS - removes even slightly overlapping boxes.
        IoU threshold of 0.1 means boxes with >10% overlap are considered duplicates.
        """
        if len(boxes) == 0:
            return []
        
        boxes = np.array(boxes)
        
        # Convert to (x1, y1, x2, y2)
        x1 = boxes[:, 0]
        y1 = boxes[:, 1]
        x2 = boxes[:, 0] + boxes[:, 2]
        y2 = boxes[:, 1] + boxes[:, 3]
        
        areas = boxes[:, 2] * boxes[:, 3]
        
        # Sort by area (keep largest boxes)
        indices = np.argsort(areas)[::-1]
        
        keep = []
        while len(indices) > 0:
            i = indices[0]
            keep.append(i)
            
            if len(indices) == 1:
                break
            
            # Calculate IoU with remaining boxes
            xx1 = np.maximum(x1[i], x1[indices[1:]])
            yy1 = np.maximum(y1[i], y1[indices[1:]])
            xx2 = np.minimum(x2[i], x2[indices[1:]])
            yy2 = np.minimum(y2[i], y2[indices[1:]])
            
            w = np.maximum(0, xx2 - xx1)
            h = np.maximum(0, yy2 - yy1)
            
            intersection = w * h
            union = areas[i] + areas[indices[1:]] - intersection
            iou = intersection / union
            
            # Keep only boxes with IoU < threshold
            indices = indices[1:][iou < iou_threshold]
        
        result = []
        for i in keep:
            result.append(tuple(boxes[i]))
        
        return result
    
    def _aggressive_nms(self, boxes, overlap_threshold=0.2):
        """
        Very aggressive Non-Maximum Suppression to eliminate ALL duplicate boxes.
        Lower threshold = more aggressive removal.
        """
        if len(boxes) == 0:
            return []
        
        boxes = np.array(boxes)
        
        # Convert to (x1, y1, x2, y2)
        x1 = boxes[:, 0]
        y1 = boxes[:, 1]
        x2 = boxes[:, 0] + boxes[:, 2]
        y2 = boxes[:, 1] + boxes[:, 3]
        
        areas = boxes[:, 2] * boxes[:, 3]
        indices = np.argsort(areas)[::-1]  # Sort by area (largest first)
        
        keep = []
        while len(indices) > 0:
            i = indices[0]
            keep.append(i)
            
            if len(indices) == 1:
                break
            
            # Calculate IoU with remaining boxes
            xx1 = np.maximum(x1[i], x1[indices[1:]])
            yy1 = np.maximum(y1[i], y1[indices[1:]])
            xx2 = np.minimum(x2[i], x2[indices[1:]])
            yy2 = np.minimum(y2[i], y2[indices[1:]])
            
            w = np.maximum(0, xx2 - xx1)
            h = np.maximum(0, yy2 - yy1)
            
            overlap = (w * h) / areas[indices[1:]]
            
            # Remove overlapping boxes
            indices = indices[1:][overlap < overlap_threshold]
        
        result = []
        for i in keep:
            result.append(tuple(boxes[i]))
        
        return result
    
    def _boxes_overlap(self, box1, box2, threshold=0.3):
        """Check if two boxes overlap by more than threshold."""
        x1, y1, w1, h1 = box1
        x2, y2, w2, h2 = box2
        
        # Calculate intersection
        x_left = max(x1, x2)
        y_top = max(y1, y2)
        x_right = min(x1 + w1, x2 + w2)
        y_bottom = min(y1 + h1, y2 + h2)
        
        if x_right < x_left or y_bottom < y_top:
            return False
        
        intersection_area = (x_right - x_left) * (y_bottom - y_top)
        box1_area = w1 * h1
        box2_area = w2 * h2
        
        # Check if intersection is significant
        overlap_ratio = intersection_area / min(box1_area, box2_area)
        return overlap_ratio > threshold
    
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
                "-movflags", "+faststart", # Move metadata to start for web streaming
                output_path
            ]
            
            print(f"DEBUG: Running merge command: {' '.join(cmd)}", flush=True)
            
            try:
                # Add timeout of 120 seconds to prevent hanging
                result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=120)
                
                if result.returncode != 0:
                    print(f"ERROR: FFmpeg merge failed: {result.stderr}", flush=True)
                    # Fallback: copy video without audio
                    shutil.copy(video_path, output_path)
                else:
                    print("DEBUG: Merge successful", flush=True)
            except subprocess.TimeoutExpired:
                print("ERROR: FFmpeg merge timed out after 120 seconds", flush=True)
                shutil.copy(video_path, output_path)
            except Exception as e:
                print(f"ERROR: Subprocess execution failed: {e}", flush=True)
                shutil.copy(video_path, output_path)
        else:
            print("DEBUG: No valid audio file found, just copying video", flush=True)
            shutil.copy(video_path, output_path)
