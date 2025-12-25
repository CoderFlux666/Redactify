import os
import whisper
import ffmpeg
import imageio_ffmpeg
from presidio_analyzer import AnalyzerEngine
from typing import List

class AudioRedactionService:
    def __init__(self):
        self.model = None
        self.analyzer = AnalyzerEngine()
        self.ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()

    async def process_audio(self, file, upload_dir="uploads", output_dir="outputs"):
        if self.model is None:
            self.model = whisper.load_model("base")

        os.makedirs(upload_dir, exist_ok=True)
        os.makedirs(output_dir, exist_ok=True)

        filename = file.filename
        input_path = os.path.join(upload_dir, filename)
        output_filename = f"redacted_{filename}"
        output_path = os.path.join(output_dir, output_filename)

        # Save uploaded file
        with open(input_path, "wb") as f:
            content = await file.read()
            f.write(content)

        # Transcribe and find sensitive intervals
        mute_intervals = self._analyze_audio_file(input_path)

        # Apply redaction (bleeping)
        if mute_intervals:
            self._bleep_audio(input_path, output_path, mute_intervals)
        else:
            # If no redaction needed, just copy
            import shutil
            shutil.copy(input_path, output_path)

        return {
            "status": "success",
            "original_filename": filename,
            "redacted_filename": output_filename,
            "redacted_file_path": output_path,
            "method": "Audio Redaction (Whisper + Presidio + Bleep)"
        }

    def _analyze_audio_file(self, input_path):
        if self.model is None:
            self.model = whisper.load_model("base")
            
        # Transcribe with word timestamps
        result = self.model.transcribe(input_path, word_timestamps=True)
        segments = result["segments"]

        # Identify sensitive segments
        mute_intervals = []
        for segment in segments:
            if "words" not in segment:
                continue
                
            words = segment["words"]
            # Reconstruct text from words to ensure character offsets match
            text_from_words = "".join([w["word"] for w in words])
            
            # Analyze text for sensitive info
            results = self.analyzer.analyze(
                text=text_from_words, 
                language="en", 
                entities=[
                    "PERSON", "PHONE_NUMBER", "CREDIT_CARD", "EMAIL_ADDRESS", 
                    "US_SSN", "US_PASSPORT", "IBAN_CODE", "DATE_TIME", "NRP", "LOCATION"
                ]
            )
            
            if results:
                print(f"Found sensitive info in segment: {text_from_words}")
                
                # Map character offsets to time intervals
                # Create a map of character range -> time range
                current_pos = 0
                word_map = []
                for w in words:
                    w_len = len(w["word"])
                    word_map.append({
                        "char_start": current_pos,
                        "char_end": current_pos + w_len,
                        "t_start": w["start"],
                        "t_end": w["end"]
                    })
                    current_pos += w_len
                
                for entity in results:
                    e_start = entity.start
                    e_end = entity.end
                    
                    # Find words that overlap with this entity
                    entity_t_start = None
                    entity_t_end = None
                    
                    for wm in word_map:
                        # Check overlap
                        if max(e_start, wm["char_start"]) < min(e_end, wm["char_end"]):
                            if entity_t_start is None or wm["t_start"] < entity_t_start:
                                entity_t_start = wm["t_start"]
                            if entity_t_end is None or wm["t_end"] > entity_t_end:
                                entity_t_end = wm["t_end"]
                    
                    if entity_t_start is not None and entity_t_end is not None:
                        print(f"  Redacting entity '{text_from_words[e_start:e_end]}' at {entity_t_start}-{entity_t_end}")
                        mute_intervals.append((entity_t_start, entity_t_end))
        
        return mute_intervals

    def _bleep_audio(self, input_path, output_path, intervals):
        # 1. Mute the original audio during sensitive intervals
        between_filters = [f"between(t,{start},{end})" for start, end in intervals]
        enable_expr = "+".join(between_filters)
        
        # 2. Generate a 1000Hz sine wave
        # We want the sine wave to be audible ONLY during the sensitive intervals
        # So we apply volume=1 during intervals, and volume=0 otherwise.
        
        try:
            input_stream = ffmpeg.input(input_path)
            
            # Muted original
            muted = input_stream.filter("volume", 0, enable=enable_expr)
            
            # Beep track
            beep = ffmpeg.input(f"sine=f=1000:d=3600", f="lavfi") # 1 hour max duration
            beep = beep.filter("volume", 1, enable=enable_expr)
            beep = beep.filter("volume", 0, enable=f"not({enable_expr})") # Silence otherwise
            
            # Mix them
            output = ffmpeg.filter([muted, beep], 'amix', inputs=2, duration='first')
            
            (
                output
                .output(output_path)
                .overwrite_output()
                .run(cmd=self.ffmpeg_path, capture_stdout=True, capture_stderr=True)
            )
        except ffmpeg.Error as e:
            print("ffmpeg error:", e.stderr.decode('utf8'))
            raise e
