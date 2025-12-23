import sqlite3
import json
from datetime import datetime
from typing import List, Dict, Optional

DB_NAME = "redactify.db"

def init_db():
    """Initialize the database with the documents table."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            original_content TEXT,
            redacted_content TEXT,
            method TEXT,
            file_type TEXT DEFAULT 'text',
            file_path TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def migrate_db():
    """Add new columns to existing database."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    try:
        cursor.execute("ALTER TABLE documents ADD COLUMN file_type TEXT DEFAULT 'text'")
        cursor.execute("ALTER TABLE documents ADD COLUMN file_path TEXT")
        print("Database migrated successfully.")
    except sqlite3.OperationalError:
        # Columns likely already exist
        pass
    conn.commit()
    conn.close()

def save_document(filename: str, original_content: Optional[str], redacted_content: Optional[str], method: str, file_type: str = "text", file_path: Optional[str] = None) -> int:
    """Save a redacted document to the database."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO documents (filename, original_content, redacted_content, method, file_type, file_path)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (filename, original_content, redacted_content, method, file_type, file_path))
    doc_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return doc_id

def get_documents() -> List[Dict]:
    """Retrieve all documents from the database."""
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM documents ORDER BY timestamp DESC')
    rows = cursor.fetchall()
    
    documents = []
    for row in rows:
        documents.append({
            "id": row["id"],
            "filename": row["filename"],
            "original_content": row["original_content"],
            "redacted_content": row["redacted_content"],
            "method": row["method"],
            "file_type": row["file_type"],
            "file_path": row["file_path"],
            "timestamp": row["timestamp"]
        })
    conn.close()
    return documents

def get_document(doc_id: int) -> Optional[Dict]:
    """Retrieve a single document by ID."""
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM documents WHERE id = ?', (doc_id,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return {
            "id": row["id"],
            "filename": row["filename"],
            "original_content": row["original_content"],
            "redacted_content": row["redacted_content"],
            "method": row["method"],
            "file_type": row["file_type"],
            "file_path": row["file_path"],
            "timestamp": row["timestamp"]
        }
    return None
