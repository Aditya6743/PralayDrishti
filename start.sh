#!/bin/bash
echo "Starting PralayDrishti System (Next.js + FastAPI)..."

# Start Backend
echo "Starting Backend API (Port 8000)..."
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!

# Start Frontend
echo "Starting Frontend App (Port 3000)..."
cd ../frontend
npm run dev

# Cleanup on exit
kill $BACKEND_PID
