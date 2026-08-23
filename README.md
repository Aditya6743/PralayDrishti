<p align="center">
  <img src="docs/assets/logo.png" alt="PralayDrishti Logo" width="500" />
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" />
  <img alt="TailwindCSS" src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img alt="Twilio" src="https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=twilio&logoColor=white" />
  <img alt="Python" src="https://img.shields.io/badge/Python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54" />
  <img alt="Google Gemini" src="https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" />
</p>

# PralayDrishti 🚨

> Turning unstructured disaster chaos into prioritized operational clarity.

**PralayDrishti** is an AI-powered crisis management platform built to survive when everything else fails. It ingests unstructured civilian SOS data, mathematically computes survival windows, and transforms the chaos into actionable operational clarity for NDRF rescue forces.

**Tags:** `Emergency Tech` · `Disaster Response` · `AI Triage` · `Hackathon` · `Next.js` · `Supabase` · `Twilio` · `Gemini AI`

---

## 🚨 The Problem
During natural disasters (floods, earthquakes), emergency control rooms are overwhelmed with thousands of unstructured, frantic distress calls. Networks throttle, rescue teams deploy blindly without spatial context, and separated families have no centralized way to find each other. **Human guesswork in triage costs lives.**

## 💡 The Solution
PralayDrishti eliminates guesswork. The system acts as a smart filter, prioritizing critical casualties based on a dynamically calculated **Time-To-Criticality (TTC)** score, mapping safe infrastructure routes for civilians, and semantically matching missing persons using AI.

---

## 🏗️ System Architecture & Data Flow

```mermaid
graph TD
    %% Entities
    C[Stranded Civilian] -->|Voice SOS / Form| F
    S[Safe Civilian] -->|Mark As Safe| F
    
    %% Frontend
    subgraph Frontend [Next.js Edge]
        F[Citizen Portal]
    end
    
    %% Processing
    subgraph Backend [AI Engine & Processing]
        NLP[Google Gemini NLP]
        VEC[384-D Vector Engine]
        GEO[OSRM Geo-Routing]
    end
    
    %% Storage
    subgraph Database [Supabase]
        DB[(PostgreSQL + pgBouncer)]
    end
    
    %% Output
    subgraph Control Room [NDRF Dashboard]
        Dash[Live Heatmap Triage]
        SMS[Twilio SMS Gateway]
    end
    
    %% Flow
    F -->|Raw Text/Audio| NLP
    F -->|GPS Ping| GEO
    NLP -->|Structured JSON| DB
    GEO -->|Safe Route Data| F
    
    DB -->|Real-time Sync| Dash
    Dash -->|Match Missing Persons| VEC
    VEC -->|High Confidence Match| SMS
    SMS -->|Dispatch Alert| C
```

---

## 📂 Repository Structure

```
PralayDrishti/
├── frontend/                 # Core Next.js Application
│   ├── src/app/              # API Routes & Next 16 Pages
│   ├── src/components/       # Reusable React UI Components
│   └── src/lib/              # Database Drivers & Utilities
├── backend/                  # Legacy Python FastAPI Services (Data Science/Seeding)
│   ├── app/                  # Python endpoints & models
│   └── api/                  # Core Python business logic
├── docs/                     # Technical Documentation & Presentation Assets
│   ├── FRONTEND_PRD.md       # Frontend Architecture Docs
│   ├── BACKEND_PRD.md        # Backend Architecture Docs
│   ├── presentations/        # PPTX files for judges
│   └── assets/               # Image assets and logos
└── scripts/                  # Diagnostic, DB fixing, and automation scripts
```

---

## ✨ Key Features

- **🎙️ Multilingual Voice SOS:** Civilians report emergencies hands-free. AI auto-transcribes and extracts the hazard.
- **🗺️ Live Hazard Routing:** Maps dynamic OSRM offline routes to nearest Relief Camps, algorithmically avoiding flooded zones.
- **🧠 384-D Semantic Linker:** AI vector engine mathematically links separated family members by cross-referencing reports.
- **📡 Twilio Dispatch Pipeline:** Instant mass SMS broadcasts and dispatch pings to field commanders via Twilio REST APIs.
- **✅ Smart Grid Reduction:** Actively shrinks the rescue search space by removing safe civilians from the active operational grid.
- **⏱️ Dynamic TTC Triage:** Calculates a rigid Time-To-Criticality survival window based on the hazard.

---

## ⚙️ How to Run Locally

### Prerequisites
- Node.js (v18+)
- Twilio API Keys (Set in `frontend/.env.local`)
- Supabase Project 

### 1. Boot the Application
```bash
# Clone the repository
git clone https://github.com/Aditya6743/PralayDrishti.git
cd PralayDrishti/frontend

# Install dependencies and start the Next.js server
npm install
npm run dev
```

### 2. Access the Grid
- 🌐 **Civilian Portal:** [http://localhost:3000](http://localhost:3000)
- 🔒 **Command Center:** [http://localhost:3000/dashboard](http://localhost:3000/dashboard) (Passcode: **ELICIT26**)
- 🗺️ **Infrastructure Scanner:** [http://localhost:3000/camps](http://localhost:3000/camps)
- ✅ **Mark As Safe:** [http://localhost:3000/safe](http://localhost:3000/safe)
