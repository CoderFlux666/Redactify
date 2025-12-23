Write-Host "Starting Redactify in Production Mode..." -ForegroundColor Green

# Get the script's directory
$ScriptDir = $PSScriptRoot

# Backend
Write-Host "Starting Backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ScriptDir'; .\.venv\Scripts\Activate.ps1; cd backend; pip install -r requirements.txt; $env:API_BASE_URL='http://localhost:8000'; uvicorn main:app --host 0.0.0.0 --port 8000"

# Frontend
Write-Host "Building and Starting Frontend..." -ForegroundColor Cyan
Set-Location "$ScriptDir\frontend"

if (!(Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..."
    npm install
}

Write-Host "Starting frontend (Dev Mode due to build issues)..."
$env:NEXT_PUBLIC_API_URL = "http://localhost:8000"
npm run dev
