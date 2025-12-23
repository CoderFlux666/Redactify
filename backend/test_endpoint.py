import requests

url = "http://localhost:8000/redact/audio"
files = {'file': open('test.mp3', 'rb')}

try:
    response = requests.post(url, files=files)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
