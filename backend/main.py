import os
# Fix for OpenMP conflict (OMP: Error #15: Initializing libiomp5md.dll, but found libiomp5md.dll already initialized)
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from services.redaction import RedactionService
from services.audio_redaction import AudioRedactionService
from services.video_redaction import VideoRedactionService
from services.reversible_redaction import ReversibleRedactionService
from services.llm_cleaner import process_dataset
import imageio_ffmpeg
import uuid
import shutil
import database

app = FastAPI(title="Redactify API")

# Initialize Database
database.init_db()
database.migrate_db()

# Configure FFmpeg path
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

# Create directories
os.makedirs("outputs", exist_ok=True)
os.makedirs("uploads", exist_ok=True)

# Mount static directories
app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001", 
        "https://*.vercel.app",  # Vercel preview deployments
        # Add your production Vercel domain here after deployment:
        # "https://your-domain.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Services
redaction_service = RedactionService()
audio_service = AudioRedactionService()
video_service = VideoRedactionService()
reversible_service = ReversibleRedactionService()

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Redactify API is running"}

@app.get("/documents")
def get_documents(user_id: str = None):
    print(f"DEBUG: Fetching documents for user_id: {user_id}", flush=True)
    docs = database.get_documents(user_id)
    print(f"DEBUG: Found {len(docs)} documents", flush=True)
    return {"documents": docs}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...), user_id: str = Form(...)):
    result = await redaction_service.process_file(file)
    
    if result["status"] == "success":
        # Save to database
        database.save_document(
            filename=result["original_filename"],
            original_content=result["original_content"],
            redacted_content=result["redacted_content"],
            method=result.get("method", "Unknown"),
            file_type="text",
            user_id=user_id
        )
        
    return result

@app.post("/reversible/upload")
async def reversible_upload(file: UploadFile = File(...), password: str = Form(...), user_id: str = Form(...)):
    return await reversible_service.process_upload(file, password, user_id)

@app.post("/reversible/unlock")
async def reversible_unlock(doc_id: str = Form(...), password: str = Form(...)):
    return await reversible_service.unlock_document(doc_id, password)

@app.get("/reversible/{doc_id}")
async def get_reversible_doc_info(doc_id: str):
    return await reversible_service.get_public_doc_info(doc_id)

@app.post("/redact/audio")
async def redact_audio(file: UploadFile = File(...), user_id: str = Form(...)):
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
            file_path=url,
            user_id=user_id
        )
        return result
    
    return result

@app.post("/redact/video")
async def redact_video(file: UploadFile = File(...), user_id: str = Form(...)):
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
            file_path=url,
            user_id=user_id
        )
        return result
    
    return result

@app.post("/clean-dataset")
async def clean_dataset(file: UploadFile = File(...), text_column: str = "message", user_id: str = Form(...)):
    # Save uploaded file
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    os.makedirs("uploads", exist_ok=True)
    input_path = os.path.join("uploads", unique_filename)
    output_filename = f"cleaned_{unique_filename}"
    output_path = os.path.join("outputs", output_filename)
    
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        # Process dataset
        process_dataset(input_path, output_path, text_column, user_id)
        
        # Return URL
        base_url = os.getenv("API_BASE_URL", "http://localhost:8000")
        url = f"{base_url}/outputs/{output_filename}"
        
        return {
            "status": "success",
            "original_filename": file.filename,
            "cleaned_filename": output_filename,
            "url": url
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
