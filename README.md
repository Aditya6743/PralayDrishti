# PralayDrishti (प्रलय दृष्टि)
**AI-Powered Disaster Intelligence & Emergency Triage**

## Setup & Running

This is a complete Next.js 15 and FastAPI monorepo solving PS-16.

### 1. Backend (FastAPI)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
> **Note on DB & AI**: The backend automatically falls back to a local SQLite database (`pralaydrishti.db`) and a mock "Demo AI" if you do not provide `DATABASE_URL` and `GEMINI_API_KEY` in `.env`.

### 2. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

### 3. The Hackathon Demo Experience
1. Open [http://localhost:3000](http://localhost:3000)
2. Click **Launch Control Room**.
3. In the top right, click **SIMULATE DISASTER**.
4. Watch as 15 highly realistic, multilingual disaster reports stream in via WebSockets.
5. Watch the AI automatically cluster related reports, flag critical ones (e.g. "We're trapped on the second floor"), and route ambiguous ones to the **Human Review** tab.
6. Open the **Map** to see geospatial clustering.
