import os
from supabase import create_client, Client
from typing import List, Dict, Optional
from datetime import datetime

# Initialize Supabase Client
url: str = None
key: str = None

supabase: Client = None

def init_db():
    """Initialize Supabase client."""
    global supabase, url, key
    
    # Ensure env vars are loaded
    from dotenv import load_dotenv
    load_dotenv()
    
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_KEY")

    if url and key:
        try:
            print(f"DEBUG: Initializing Supabase with URL: {url} and Key: {key[:5]}...", flush=True)
            supabase = create_client(url, key)
            print("Supabase client initialized successfully.", flush=True)
        except Exception as e:
            print(f"Error initializing Supabase client: {e}", flush=True)
    else:
        print(f"Warning: SUPABASE_URL or SUPABASE_KEY not found. URL present: {bool(url)}, Key present: {bool(key)}", flush=True)

def migrate_db():
    """No-op for Supabase as schema is managed via SQL editor."""
    pass

def _ensure_initialized():
    """Ensure Supabase client is initialized."""
    global supabase
    if not supabase:
        print("DEBUG: Supabase client is None, attempting lazy initialization...", flush=True)
        init_db()
    return supabase is not None

def save_document(filename: str, original_content: Optional[str], redacted_content: Optional[str], method: str, file_type: str = "text", file_path: Optional[str] = None, user_id: Optional[str] = None) -> int:
    """Save a redacted document to Supabase."""
    """Save a redacted document to Supabase."""
    if not _ensure_initialized():
        print("Error: Supabase client not initialized even after retry.", flush=True)
        return -1
        
    data = {
        "filename": filename,
        "original_content": original_content,
        "redacted_content": redacted_content,
        "method": method,
        "file_type": file_type,
        "file_path": file_path,
        "user_id": user_id
    }
    
    try:
        print(f"DEBUG: Attempting to save document: {filename}, user_id: {user_id}")
        with open("backend_db_debug.log", "a") as f:
            f.write(f"Saving doc: {filename}, user_id: {user_id}\n")
            
        response = supabase.table("documents").insert(data).execute()
        
        # Return the ID of the inserted row (assuming it returns a list of inserted rows)
        if response.data and len(response.data) > 0:
            doc_id = response.data[0]['id']
            print(f"DEBUG: Document saved successfully with ID: {doc_id}")
            with open("backend_db_debug.log", "a") as f:
                f.write(f"Success. ID: {doc_id}\n")
            return doc_id
        
        print("DEBUG: Document saved but no ID returned (or empty response)")
        with open("backend_db_debug.log", "a") as f:
            f.write("Saved but no ID returned.\n")
        return 0
    except Exception as e:
        print(f"Error saving document to Supabase: {e}")
        with open("backend_db_debug.log", "a") as f:
            f.write(f"Error saving doc: {e}\n")
        return -1

def get_documents(user_id: Optional[str] = None) -> List[Dict]:
    """Retrieve documents from Supabase, optionally filtered by user_id."""
    """Retrieve documents from Supabase, optionally filtered by user_id."""
    if not _ensure_initialized():
        return []
        
    try:
        query = supabase.table("documents").select("*").order("id", desc=True)
        
        if user_id:
            query = query.eq("user_id", user_id)
            
        response = query.execute()
        data = response.data
        
        # Polyfill timestamp if missing (since created_at is missing from DB)
        for doc in data:
            if "created_at" not in doc and "timestamp" not in doc:
                doc["timestamp"] = datetime.utcnow().isoformat()
            elif "created_at" in doc:
                doc["timestamp"] = doc["created_at"]
                
        return data
    except Exception as e:
        print(f"Error fetching documents from Supabase: {e}")
        return []

def get_document(doc_id: int) -> Optional[Dict]:
    """Retrieve a single document by ID."""
    if not _ensure_initialized():
        return None
        
    try:
        response = supabase.table("documents").select("*").eq("id", doc_id).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
        return None
    except Exception as e:
        print(f"Error fetching document {doc_id} from Supabase: {e}")
        return None

def save_reversible_doc(filename: str, original_path: str, redacted_path: str, password_hash: str, user_id: str) -> Optional[str]:
    """Save a reversible document record."""
    if not _ensure_initialized():
        return None
        
    data = {
        "filename": filename,
        "original_file_path": original_path,
        "redacted_file_path": redacted_path,
        "password_hash": password_hash,
        "user_id": user_id
    }
    
    try:
        response = supabase.table("reversible_docs").insert(data).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]['id']
        return None
    except Exception as e:
        print(f"Error saving reversible doc: {e}")
        with open("backend_db_error.log", "a") as f:
            f.write(f"Error saving reversible doc: {e}\n")
        return None

def get_reversible_doc(doc_id: str) -> Optional[Dict]:
    """Retrieve a reversible document by ID."""
    if not _ensure_initialized():
        return None
        
    try:
        response = supabase.table("reversible_docs").select("*").eq("id", doc_id).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
        return None
    except Exception as e:
        print(f"Error fetching reversible doc: {e}")
        return None
