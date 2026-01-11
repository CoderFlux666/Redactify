import os
import shutil
from typing import Optional, Dict
from fastapi import UploadFile
from passlib.context import CryptContext
import database
import uuid
from services.redaction import RedactionService
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import io

# Register Arial font (Windows)
try:
    pdfmetrics.registerFont(TTFont('Arial', 'arial.ttf'))
    FONT_NAME = 'Arial'
except Exception as e:
    print(f"Warning: Could not load Arial font: {e}. Falling back to Helvetica.")
    FONT_NAME = 'Helvetica'

# Password hashing setup
# Switched to argon2 to avoid bcrypt's 72-byte limit
try:
    pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
except Exception as e:
    print(f"CRITICAL ERROR: Failed to initialize password hashing. Missing dependencies? Error: {e}")
    # Fallback or re-raise depending on strictness, but for now just log
    pwd_context = None

class ReversibleRedactionService:
    def __init__(self):
        self.upload_dir = "uploads"
        self.output_dir = "outputs"
        os.makedirs(self.upload_dir, exist_ok=True)
        os.makedirs(self.output_dir, exist_ok=True)
        self.redaction_service = RedactionService()

    def verify_password(self, plain_password, hashed_password):
        if not pwd_context:
            raise RuntimeError("Password hashing not initialized. Check server logs for missing dependencies (passlib, argon2-cffi).")
        return pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password):
        if not pwd_context:
            raise RuntimeError("Password hashing not initialized. Check server logs for missing dependencies (passlib, argon2-cffi).")
        return pwd_context.hash(password)

    async def process_upload(self, file: UploadFile, password: str, user_id: str) -> Dict:
        try:
            print(f"DEBUG: Processing upload for user {user_id}")
            print(f"DEBUG: Password type: {type(password)}")
            print(f"DEBUG: Password length: {len(password)}")
            print(f"DEBUG: Password content (first 20): {password[:20]}")

            if len(password) > 72:
                print("DEBUG: Password too long, truncating for safety check but returning error.")
                return {
                    "status": "error", 
                    "message": f"Password too long (received {len(password)} chars). Max 72 allowed."
                }

            filename = file.filename
            # 1. Save original file
            file_ext = os.path.splitext(filename)[1]
            unique_filename = f"{uuid.uuid4()}{file_ext}"
            original_path = os.path.join(self.upload_dir, f"original_{unique_filename}")
            
            with open(original_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            # 2. Create "redacted" version
            # unique_filename already has extension, so we strip it for the redacted filename base
            base_name = os.path.splitext(unique_filename)[0]
            redacted_filename = f"redacted_{base_name}.pdf" 
            redacted_path = os.path.join(self.output_dir, redacted_filename)
            
            # Reset file pointer before reading
            await file.seek(0)
            # Extract content
            content = await file.read()
            
            if filename.lower().endswith('.pdf'):
                # Use PyMuPDF to redact directly on the PDF
                redacted_bytes = self.redaction_service.redact_pdf_file(content)
                with open(redacted_path, "wb") as f:
                    f.write(redacted_bytes)
            else:
                # Fallback for non-PDFs (DOCX, etc) - Convert to text and create simple PDF
                # (Keeping existing logic for non-PDFs or improving it slightly)
                text_content = ""
                if filename.lower().endswith('.docx'):
                    text_content = self.redaction_service.extract_text_from_docx(content)
                else:
                    text_content = content.decode('utf-8', errors='ignore')

                # Redact text
                redacted_text = self.redaction_service.redact_with_presidio(text_content)
                
                # Generate simple PDF
                try:
                    doc = SimpleDocTemplate(
                        redacted_path,
                        pagesize=letter,
                        rightMargin=72, leftMargin=72,
                        topMargin=72, bottomMargin=18
                    )
                    styles = getSampleStyleSheet()
                    flowables = []
                    flowables.append(Paragraph(f"Redacted Version: {filename}", styles["Heading1"]))
                    flowables.append(Spacer(1, 12))
                    
                    # Create a custom style with the registered font
                    body_style = ParagraphStyle(
                        'CustomBody',
                        parent=styles['BodyText'],
                        fontName=FONT_NAME,
                        fontSize=10,
                        leading=12
                    )

                    for paragraph in redacted_text.split('\n'):
                        if paragraph.strip():
                            flowables.append(Paragraph(paragraph, body_style))
                            flowables.append(Spacer(1, 6))
                    
                    doc.build(flowables)
                except Exception as e:
                    print(f"Error generating PDF from text: {e}")
                    shutil.copy(original_path, redacted_path)

            # 3. Hash password
            hashed_password = self.get_password_hash(password)

            # Generate URLs (assuming localhost for now, should be env var)
            base_url = os.getenv("API_BASE_URL", "http://localhost:8000")
            original_url = f"{base_url}/uploads/original_{unique_filename}"
            redacted_url = f"{base_url}/outputs/{redacted_filename}"

            # Save to Database
            doc_id = database.save_reversible_doc(
                filename=filename,
                original_path=original_url,
                redacted_path=redacted_url,
                password_hash=hashed_password,
                user_id=user_id
            )

            if doc_id:
                return {
                    "status": "success",
                    "doc_id": doc_id,
                    "redacted_url": redacted_url,
                    "filename": filename
                }
            else:
                return {"status": "error", "message": "Database save failed"}

        except Exception as e:
            print(f"Error in reversible upload: {e}")
            return {"status": "error", "message": str(e)}

    async def unlock_document(self, doc_id: str, password: str) -> Dict:
        try:
            doc = database.get_reversible_doc(doc_id)
            if not doc:
                return {"status": "error", "message": "Document not found"}

            if self.verify_password(password, doc["password_hash"]):
                return {
                    "status": "success",
                    "original_url": doc["original_file_path"]
                }
            else:
                return {"status": "error", "message": "Invalid password"}

        except Exception as e:
            print(f"Error unlocking document: {e}")
            return {"status": "error", "message": str(e)}

    async def get_public_doc_info(self, doc_id: str) -> Dict:
        try:
            doc = database.get_reversible_doc(doc_id)
            if not doc:
                return {"status": "error", "message": "Document not found"}
            
            return {
                "status": "success",
                "filename": doc["filename"],
                "redacted_url": doc["redacted_file_path"]
            }
        except Exception as e:
            print(f"Error fetching public doc info: {e}")
            return {"status": "error", "message": str(e)}
