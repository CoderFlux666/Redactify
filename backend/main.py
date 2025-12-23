from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from services.redaction import RedactionService
from services.audio_redaction import AudioRedactionService
from services.video_redaction import VideoRedactionService
import os
import imageio_ffmpeg

import database

app = FastAPI(title="Redactify API")

# Initialize Database
database.init_db()
database.migrate_db()

# Configure FFmpeg path
import shutil
ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
work_dir = os.getcwd()
bin_dir = os.path.join(work_dir, "bin")
os.makedirs(bin_dir, exist_ok=True)
target_ffmpeg = os.path.join(bin_dir, "ffmpeg.exe")

if not os.path.exists(target_ffmpeg):
    shutil.copy(ffmpeg_exe, target_ffmpeg)
    print(f"Copied FFmpeg to {target_ffmpeg}")

os.environ["PATH"] = bin_dir + os.pathsep + os.environ["PATH"]
print(f"Added {bin_dir} to PATH")
print(f"FFmpeg configured at: {target_ffmpeg}")

# Create outputs directory if not exists
os.makedirs("outputs", exist_ok=True)

app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print(f"DEBUG: VideoRedactionService imported from: {VideoRedactionService}")
redaction_service = RedactionService()
audio_service = AudioRedactionService()
video_service = VideoRedactionService()

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Redactify API is running"}

@app.get("/documents")
def get_documents():
    return {"documents": database.get_documents()}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    result = await redaction_service.process_file(file)
    
    if result["status"] == "success":
        # Save to database
        database.save_document(
            filename=result["original_filename"],
            original_content=result["original_content"],
            redacted_content=result["redacted_content"],
            method=result.get("method", "Unknown"),
            file_type="text"
        )
        
    return result

@app.post("/redact/audio")
async def redact_audio(file: UploadFile = File(...)):
    result = await audio_service.process_audio(file)
    if result["status"] == "success":
        # Return the URL to the file
        base_url = os.getenv("API_BASE_URL", "http://localhost:8000")
        url = f"{base_url}/outputs/{result['redacted_filename']}"
        result["url"] = url
        
        # Save to database
        database.save_document(
            filename=result["original_filename"],
            original_content=None,
            redacted_content=None,
            method="Audio Redaction",
            file_type="audio",
            file_path=url
        )
        return result
    
    return result

@app.post("/redact/video")
async def redact_video(file: UploadFile = File(...)):
    result = await video_service.process_video(file)
    
    if result["status"] == "success":
        # Return URL for static serving
        base_url = os.getenv("API_BASE_URL", "http://localhost:8000")
        url = f"{base_url}/outputs/{result['redacted_filename']}"
        result["url"] = url
        
        # Save to database
        database.save_document(
            filename=result["original_filename"],
            original_content=None,
            redacted_content=None,
            method="Video Redaction",
            file_type="video",
            file_path=url
        )
        return result
    
    return result
