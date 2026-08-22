<div align="center">
  <img src="assets/logo.png" alt="PralayDrishti Logo" width="500" />
  <p><b>AI-Powered Disaster Intelligence & Dynamic Triage Engine</b></p>
  
  <p>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
    <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
    <img src="https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue" alt="Framer Motion" />
    <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="FastAPI" />
    <img src="https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54" alt="Python" />
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Gemini" />
  </p>
</div>

<br/>

PralayDrishti is a comprehensive crisis management platform designed to operate in the most chaotic disaster scenarios. It takes unstructured, overwhelming SOS data and transforms it into prioritized, actionable operational clarity for rescue teams.

## 🚀 The Tech Stack

### Frontend & UI
- **Next.js (App Router):** Ultra-fast edge routing and API handling.
- **React 19 & Tailwind CSS 4:** Responsive, glassmorphic UI architecture.
- **Framer Motion:** Hardware-accelerated cinematic animations.
- **Leaflet & React-Leaflet:** Real-time geospatial mapping and heatmaps.

### Backend & Database
- **Python (FastAPI):** High-performance, asynchronous microservices.
- **Supabase:** Robust PostgreSQL database for real-time ticket state management and resilient disaster data storage.

### AI & Machine Learning
- **Google Gemini:** Core reasoning engine used to process chaotic, unstructured SOS payloads into structured operational intelligence.
- **NLP & Speech AI:** Custom Natural Language Processing algorithms for missing/found person linkage and native browser audio transcription.
- **Haversine Geo-Engine:** Algorithmic duplication protection based on spatial GPS radius mapping.

## 🧠 How It Works

PralayDrishti is built to survive when everything else fails. Here is the operational loop:

1. **The "Ghost" Network (Ultra-Low Bandwidth)**
   When cell towers collapse, our dependency-free `<10KB` Citizen Portal kicks in. It loads instantly on throttled 2G networks. If the network goes completely offline, it saves the SOS locally and auto-transmits via an **Offline Mesh-Network Queue** the second a signal is found.
   
2. **The "Blackbox" Audio Extract**
   Victims trapped in darkness can't type. They tap a single button and speak. The system transcribes the frantic audio in real-time, extracts keywords (e.g., "Flood", "Trapped"), and autonomously fills out the distress beacon.

3. **Dynamic TTC (Time-to-Criticality) Triage**
   When the Control Room receives thousands of pings, human guesswork fails. Our algorithmic engine mathematically computes survival windows based on hazard severity and environmental factors (e.g., trapped victims get a -40% survival penalty), instantly prioritizing who to save first.

4. **Command Center & Autonomous Recon**
   Operators view a live, auto-updating satellite map. Instead of risking a human rescue team blindly, operators can dispatch an **Autonomous Recon Drone** via a MAVLink uplink to stream thermal optics of the target zone before deploying ground units.

## ⚙️ How to Run Locally

You can spin up the entire architecture (Backend + Frontend) in seconds. 

### Prerequisites
- Node.js (v18+)
- Python (3.10+)

### 1. Boot the Application
We have included an automated launch script that provisions and starts both environments concurrently:

\`\`\`bash
# Clone the repository
git clone https://github.com/Aditya6743/PralayDrishti.git
cd PralayDrishti

# Execute the startup daemon
./start.sh
\`\`\`

### 2. Access the Grid
Once the script confirms the servers are live, navigate to:
- 🌐 **Control Room Dashboard:** [http://localhost:3000](http://localhost:3000)
- 📻 **Ultra-Low Bandwidth Portal:** [http://localhost:3000/report.html](http://localhost:3000/report.html)
- ⚙️ **Backend API Specs:** [http://localhost:8000/docs](http://localhost:8000/docs)
