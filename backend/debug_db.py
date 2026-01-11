import os
from dotenv import load_dotenv

# Load env vars from .env file
load_dotenv("backend/.env")

import database
import uuid

database.init_db()

try:
    print("Checking if table 'reversible_docs' exists...")
    res = database.supabase.table("reversible_docs").select("count", count="exact").execute()
    print(f"Table exists. Count: {res.count}")
except Exception as e:
    print(f"TABLE CHECK FAILED: {e}")

try:
    print("Attempting to save dummy reversible doc...")
    doc_id = database.save_reversible_doc(
        filename="test.txt",
        original_path="http://localhost/test_orig",
        redacted_path="http://localhost/test_redacted",
        password_hash="dummy_hash",
        user_id=str(uuid.uuid4())
    )
    if doc_id:
        print(f"SUCCESS: Doc saved with ID {doc_id}")
    else:
        print("FAILURE: Doc ID is None (check previous logs for error)")
except Exception as e:
    print(f"CRITICAL EXCEPTION: {e}")
