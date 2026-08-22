#!/bin/bash
trap "kill 0" EXIT

echo "Cleaning up old processes..."
lsof -ti:8000,8001,8002,3000 | xargs kill -9 2>/dev/null

echo "Starting PralayDrishti System (Next.js + FastAPI)..."

# Ensure venv exists in frontend/api
cd frontend
if [ ! -d ".venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
else
    source .venv/bin/activate
fi

echo "Starting Backend API (Port 8002)..."
cd api
uvicorn app.main:app --reload --port 8002 &
BACKEND_PID=$!

echo "Starting Frontend App (Port 3000)..."
cd ..
npm run dev
