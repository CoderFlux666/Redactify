import requests
import os

url = "https://github.com/YapaLab/yolo-face/releases/download/1.0.0/yolov8n-face.pt"
model_path = "yolov8n-face.pt"

print(f"Downloading {model_path} from {url}...")

try:
    response = requests.get(url, stream=True)
    response.raise_for_status()
    
    with open(model_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
            
    print(f"Successfully downloaded {model_path}")
    print(f"File size: {os.path.getsize(model_path)} bytes")
    
except Exception as e:
    print(f"Error downloading model: {e}")
