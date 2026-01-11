from ultralytics import YOLO
import requests
import os

print("Imported ultralytics successfully.")

model_path = "yolov8n-face.pt"
if not os.path.exists(model_path):
    print("Downloading YOLOv8-face model...")
    try:
        url = "https://github.com/YapaLab/yolo-face/releases/download/1.0.0/yolov8n-face.pt"
        response = requests.get(url, stream=True)
        response.raise_for_status()
        with open(model_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print("Model downloaded successfully.")
    except Exception as e:
        print(f"Failed to download face model: {e}")
        print("Falling back to standard YOLOv8n...")
        model_path = "yolov8n.pt"

print(f"Loading model: {model_path}")
try:
    model = YOLO(model_path)
    print("Model loaded successfully.")
except Exception as e:
    print(f"Failed to load model: {e}")
