---
title: Redactify Backend
emoji: 🔒
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
---

# Redactify Backend API

AI-powered document redaction platform with support for:
- Text redaction (PII detection)
- Audio redaction (speech-to-text + bleeping)
- Video redaction (face detection + audio)
- LLM dataset cleaning

## API Endpoints

- `GET /` - Health check
- `GET /documents` - Get document history
- `POST /upload` - Upload and redact text document
- `POST /redact/audio` - Redact audio file
- `POST /redact/video` - Redact video file
- `POST /clean-dataset` - Clean LLM dataset

## Tech Stack

- FastAPI
- Presidio (PII detection)
- Whisper AI (audio transcription)
- MediaPipe (face detection)
- OpenCV (video processing)

## Usage

Visit the API at: `https://YOUR_USERNAME-redactify-backend.hf.space`

Frontend: [Redactify App](https://redactify.vercel.app)
