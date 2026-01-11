import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_KEY")

if not url or not key:
    print("Error: Supabase credentials not found.")
    exit(1)

supabase = create_client(url, key)

try:
    print("1. Attempting to insert test document...")
    test_data = {
        "filename": "debug_test.txt",
        "method": "Debug Script",
        "file_type": "text",
        "user_id": "debug_user",
        "original_content": "test",
        "redacted_content": "test"
    }
    insert_response = supabase.table("documents").insert(test_data).execute()
    print(f"Insert successful: {insert_response.data}")

    print("\n2. Fetching all documents again...")
    response = supabase.table("documents").select("*").execute()
    documents = response.data
    
    print(f"Total documents found: {len(documents)}")
    
    if len(documents) > 0:
        print("\nSample documents (first 5):")
        for i, doc in enumerate(documents[:5]):
            print(f"[{i}] ID: {doc.get('id')} | Filename: {doc.get('filename')} | User ID: {doc.get('user_id')}")
            
except Exception as e:
    print(f"Error: {e}")
