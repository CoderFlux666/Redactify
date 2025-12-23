from fastapi.testclient import TestClient
from main import app
import io

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "Redactify API is running"}

def test_upload_text_file():
    # Create a dummy file
    file_content = b"My name is John Doe and I live in New York."
    files = {"file": ("test.txt", file_content, "text/plain")}
    
    response = client.post("/upload", files=files)
    
    assert response.status_code == 200
    data = response.json()
    print("Response:", data)
    
    assert data["status"] == "success"
    assert "<PERSON>" in data["redacted_content"]
    assert "John Doe" not in data["redacted_content"]
    assert "<LOCATION>" in data["redacted_content"] or "New York" not in data["redacted_content"]

if __name__ == "__main__":
    try:
        test_read_root()
        print("Root endpoint test passed.")
        test_upload_text_file()
        print("Upload endpoint test passed.")
    except Exception as e:
        print(f"Test failed: {e}")
