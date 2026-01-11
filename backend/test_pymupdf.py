import fitz
import sys

print(f"Python version: {sys.version}")
try:
    print(f"PyMuPDF version: {fitz.VersionBind}")
    doc = fitz.open()
    print("Successfully created new PDF doc")
except Exception as e:
    print(f"Error: {e}")
