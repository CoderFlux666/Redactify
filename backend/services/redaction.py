import os
import io
from typing import List
from fastapi import UploadFile
from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import OperatorConfig
from dotenv import load_dotenv
from openai import OpenAI
import pypdf
import docx
import fitz # PyMuPDF

load_dotenv()

class RedactionService:
    def __init__(self):
        self.analyzer = AnalyzerEngine()
        self.anonymizer = AnonymizerEngine()
        self.openai_key = os.getenv("OPENAI_API_KEY")
        self.client = OpenAI(api_key=self.openai_key) if self.openai_key else None

    def redact_with_presidio(self, text: str) -> str:
        results = self.analyzer.analyze(text=text, language='en')
        
        # Define the operator to replace with black blocks
        operators = {
            "DEFAULT": OperatorConfig("replace", {"new_value": "████████"})
        }
        
        anonymized_result = self.anonymizer.anonymize(
            text=text,
            analyzer_results=results,
            operators=operators
        )
        return anonymized_result.text

    def redact_with_gpt4(self, text: str) -> str:
        if not self.client:
            return self.redact_with_presidio(text)
            
        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an advanced redaction engine. Your task is to redact ALL Personally Identifiable Information (PII) and sensitive data from the text. This includes but is not limited to: Names, Email Addresses, Phone Numbers, Physical Addresses, Dates, Times, Credit Card Numbers, Social Security Numbers, Passport Numbers, Driver's License Numbers, and IP Addresses. Replace each instance of sensitive data with the exact string '████████'. Do not describe what you redacted, just return the text with the redactions applied."},
                    {"role": "user", "content": text}
                ],
                temperature=0
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"OpenAI Error: {e}")
            return self.redact_with_presidio(text) # Fallback

    def extract_text_from_pdf(self, content: bytes) -> str:
        try:
            pdf_file = io.BytesIO(content)
            reader = pypdf.PdfReader(pdf_file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text
        except Exception as e:
            print(f"PDF Extraction Error: {e}")
            return ""

    def extract_pages_from_pdf(self, content: bytes) -> List[str]:
        try:
            pdf_file = io.BytesIO(content)
            reader = pypdf.PdfReader(pdf_file)
            pages = []
            for page in reader.pages:
                text = page.extract_text()
                if not text:
                    text = "" # Ensure we have a string even if empty
                pages.append(text)
            return pages
        except Exception as e:
            print(f"PDF Page Extraction Error: {e}")
            return []

    def extract_text_from_docx(self, content: bytes) -> str:
        try:
            docx_file = io.BytesIO(content)
            doc = docx.Document(docx_file)
            text = ""
            for para in doc.paragraphs:
                text += para.text + "\n"
            return text
        except Exception as e:
            print(f"DOCX Extraction Error: {e}")
            return ""

    async def process_file(self, file: UploadFile) -> dict:
        content = await file.read()
        filename = file.filename.lower()
        text_content = ""
        
        try:
            if filename.endswith('.pdf'):
                text_content = self.extract_text_from_pdf(content)
            elif filename.endswith('.docx'):
                text_content = self.extract_text_from_docx(content)
            else:
                # Default to text
                text_content = content.decode('utf-8')
            
            if not text_content.strip():
                return {
                    "original_filename": file.filename,
                    "error": "Could not extract text from file.",
                    "status": "error"
                }

            # Use GPT-4 if key is available, otherwise fallback to Presidio
            if self.openai_key and self.openai_key != "your_api_key_here":
                redacted_text = self.redact_with_gpt4(text_content)
                method = "GPT-4"
            else:
                redacted_text = self.redact_with_presidio(text_content)
                method = "Presidio (Local)"

            return {
                "original_filename": file.filename,
                "original_content": text_content,
                "redacted_content": redacted_text,
                "method": method,
                "status": "success"
            }
        except Exception as e:
            return {
                "original_filename": file.filename,
                "error": f"Error processing file: {str(e)}",
                "status": "error"
            }

    def redact_pdf_file(self, content: bytes) -> bytes:
        """
        Redacts a PDF file by drawing black rectangles over sensitive text.
        Preserves the original layout.
        """
        print(f"DEBUG: Starting redact_pdf_file. Content size: {len(content)} bytes")
        try:
            doc = fitz.open(stream=content, filetype="pdf")
            print(f"DEBUG: Opened PDF. Pages: {len(doc)}")
            
            for page_num, page in enumerate(doc):
                text = page.get_text()
                if not text:
                    print(f"DEBUG: Page {page_num} has no text.")
                    continue
                
                # Analyze text to find PII
                results = self.analyzer.analyze(text=text, language='en')
                print(f"DEBUG: Page {page_num}: Found {len(results)} PII entities.")
                
                # For each result, find the bounding box and draw a rectangle
                for result in results:
                    # Get the sensitive text snippet
                    sensitive_text = text[result.start:result.end]
                    
                    # Search for this text on the page to get coordinates
                    # We use page.search_for which returns a list of Rect objects
                    areas = page.search_for(sensitive_text)
                    
                    for area in areas:
                        # Draw a black rectangle over the area
                        page.draw_rect(area, color=(0, 0, 0), fill=(0, 0, 0))
            
            # Save the modified PDF to bytes
            output_buffer = io.BytesIO()
            doc.save(output_buffer)
            result_bytes = output_buffer.getvalue()
            print(f"DEBUG: Finished redact_pdf_file. Result size: {len(result_bytes)} bytes")
            return result_bytes
            
        except Exception as e:
            print(f"PyMuPDF Redaction Error: {e}")
            import traceback
            traceback.print_exc()
            # Return original content if redaction fails (or handle error appropriately)
            # For safety, maybe return empty bytes or raise error
            return content
