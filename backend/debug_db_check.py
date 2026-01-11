import database
import os
from dotenv import load_dotenv

load_dotenv()

print(f"SUPABASE_URL: {os.getenv('SUPABASE_URL')}")
# Don't print the full key for security, just check if it exists
print(f"SUPABASE_KEY exists: {bool(os.getenv('SUPABASE_SERVICE_ROLE_KEY'))}")

database.init_db()

print("\n--- Fetching ALL documents ---")
docs = database.get_documents(user_id=None)
print(f"Total documents found: {len(docs)}")
for doc in docs:
    print(f"ID: {doc.get('id')}, Filename: {doc.get('filename')}, UserID: {doc.get('user_id')}")

print("\n--- Done ---")
