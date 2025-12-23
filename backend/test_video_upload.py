import requests
import os

url = "http://localhost:8000/redact/video"
files = {'file': open('test_video.mp4', 'rb')}

try:
    print("Uploading video...")
    response = requests.post(url, files=files)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        # Check if file exists in outputs
        import json
        data = response.json()
        # The response is a FileResponse, so we can't parse JSON directly if it returns the file content.
        # Wait, the endpoint returns FileResponse, not JSON!
        # That explains why I can't see the filename in the response body.
        # I need to check the Content-Disposition header or just check the outputs dir.
        print(f"Headers: {response.headers}")
        
except Exception as e:
    print(f"Error: {e}")
