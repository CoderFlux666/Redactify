import database
import os
from dotenv import load_dotenv
import uuid

load_dotenv()
database.init_db()

print("\n--- Testing DB Write ---")
test_id = str(uuid.uuid4())
print(f"Attempting to insert document with user_id: {test_id}")

doc_id = database.save_document(
    filename="test_db_write.txt",
    original_content="test",
    redacted_content="****",
    method="Test",
    file_type="text",
    user_id=test_id
)

print(f"Result ID: {doc_id}")

if doc_id and doc_id != -1 and doc_id != 0:
    print("Write SUCCESS. Now reading back...")
    docs = database.get_documents(user_id=test_id)
    print(f"Found {len(docs)} documents for this user.")
    for d in docs:
        print(d)
else:
    print("Write FAILED.")
