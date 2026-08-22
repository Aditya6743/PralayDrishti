<div align="center">
  <img src="assets/logo.png" alt="PralayDrishti Logo" width="500" />
  <p><b>AI-Powered Disaster Intelligence & Dynamic Triage Engine</b></p>
  
  <p>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
    <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=twilio&logoColor=white" alt="Twilio" />
    <img src="https://img.shields.io/badge/Python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54" alt="Python" />
    <img src="https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Gemini" />
  </p>
</div>

<br/>

## 🚨 The Problem
During natural disasters (floods, earthquakes), emergency control rooms are overwhelmed with thousands of unstructured, frantic distress calls. Networks throttle, rescue teams deploy blindly without spatial context, and separated families have no centralized way to find each other. **Human guesswork in triage costs lives.**

## 💡 The Solution
**PralayDrishti** is a comprehensive crisis management platform built to survive when everything else fails. It ingests unstructured civilian SOS data, mathematically computes survival windows, and transforms the chaos into prioritized, actionable operational clarity for NDRF rescue forces.

---

## ✨ Key Features

- **🎙️ Multilingual Voice SOS:** Civilians can report emergencies in Hindi, English, or Hinglish via an ultra-low bandwidth portal. The AI auto-transcribes and extracts the hazard.
- **🗺️ Live Hazard Routing:** Maps dynamic OSRM offline routes to the nearest Relief Camps, algorithmically avoiding flooded or dangerous zones.
- **🧠 384-D Semantic Linker:** An AI vector engine that mathematically links separated family members by cross-referencing civilian reports with NDRF recovery logs.
- **📡 Twilio Dispatch Pipeline:** Instant mass SMS broadcasts to civilians and automated dispatch pings to field commanders via Twilio REST APIs.
- **✅ Smart Grid Reduction:** A "Mark As Safe" feature that actively shrinks the rescue search space by removing safe civilians from the active operational grid.
- **⏱️ Dynamic TTC Triage:** Calculates a rigid Time-To-Criticality (TTC) survival window based on the hazard, forcing commanders to focus on the highest-risk casualties first.

---

## 🏗️ System Architecture Pipeline

The data flows from a stranded civilian through the AI engine and directly into the Commander's dashboard in milliseconds.

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

## 🚀 The Tech Stack

### Frontend & UI
- **Next.js 16 (App Router):** Ultra-fast edge routing and API handling.
- **React 19 & Tailwind CSS 4:** Responsive, glassmorphic UI architecture built for military-grade operational clarity.
- **Leaflet & OSRM:** Real-time geospatial mapping and hazard-aware offline routing.

### Backend, Database & Comms
- **Supabase (PostgreSQL):** Resilient database with custom pgBouncer session pooling configuration to handle extreme concurrency.
- **Twilio REST API:** Direct integration for real-time mass SMS broadcasts and rescue unit dispatch notifications.

### AI & Machine Learning
- **Semantic Vector Linker:** Connects public registries to recovery logs bypassing exact keyword matching.
- **Google Gemini:** Transforms frantic, unformatted text into structured JSON logic.

---

## ⚙️ How to Run Locally

### Prerequisites
- Node.js (v18+)
- Twilio API Keys (Set in `.env.local`)
- Supabase Project 

### 1. Boot the Application
\`\`\`bash
# Clone the repository
git clone https://github.com/Aditya6743/PralayDrishti.git
cd PralayDrishti/frontend

# Install dependencies and start the Next.js server
npm install
npm run dev
\`\`\`

### 2. Access the Grid
- 🌐 **Civilian Portal:** [http://localhost:3000](http://localhost:3000)
- 🔒 **Command Center:** [http://localhost:3000/dashboard](http://localhost:3000/dashboard) (Passcode: ELICIT26)
- 🗺️ **Infrastructure Scanner:** [http://localhost:3000/camps](http://localhost:3000/camps)
