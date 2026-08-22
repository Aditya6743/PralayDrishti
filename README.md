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

PralayDrishti is a comprehensive crisis management platform designed to operate in the most chaotic disaster scenarios. It takes unstructured, overwhelming SOS data and transforms it into prioritized, actionable operational clarity for rescue teams.

## 🚀 The Tech Stack

### Frontend & UI
- **Next.js 16 (App Router):** Ultra-fast edge routing and API handling.
- **React 19 & Tailwind CSS 4:** Responsive, glassmorphic UI architecture built for military-grade operational clarity.
- **Leaflet & OSRM:** Real-time geospatial mapping, heatmaps, and hazard-aware offline routing.

### Backend, Database & Comms
- **Supabase (PostgreSQL):** Resilient database with custom pgBouncer session pooling configuration for high-volume disaster data.
- **Twilio REST API:** Direct integration for real-time mass SMS broadcasts and rescue unit dispatch notifications.
- **Python (FastAPI):** High-performance, asynchronous microservices.

### AI & Machine Learning
- **Semantic Vector Linker:** A 384-dimensional embedding engine that mathematically cross-references civilian Missing Person registries with Control Room recovery logs.
- **Google Gemini & NLP:** Core reasoning engine used to process chaotic audio SOS payloads into structured intelligence.
- **Haversine Geo-Engine:** Algorithmic duplication protection based on spatial GPS radius mapping.

## 🧠 How It Works

PralayDrishti is built to survive when everything else fails. Here is the operational loop:

### 1. SOS & Smart Grid Reduction
Civilians report emergencies using multilingual voice SOS, or explicitly **"Mark as Safe"**. Checking in safely instantly pings the backend and mathematically shrinks the active search grid, dynamically reallocating NDRF rescue bandwidth to actual casualties.

### 2. Live Infrastructure Routing
When civilians need to find shelter, a standard map route might get them killed. Our system uses live **Reverse Geocoding** to map their city, cross-references live Relief Camp capacities, and computes a physical **OSRM offline route** to safety that algorithmically navigates *around* active hazard zones.

### 3. AI Vector Matching & Dispatch
A frantic family member files a missing person report with a vague description. A rescue worker later files a recovered person report with a different vague description. Our **384-dimensional AI Vector Engine** instantly links them with 98% confidence. The commander clicks *Notify Rescue Unit*, triggering the **Twilio SMS Pipeline** to physically buzz the family member's phone.

### 4. Dynamic TTC Triage
When the Control Room receives thousands of pings, human guesswork fails. Our engine mathematically computes survival windows based on hazard severity and environmental factors (e.g., trapped victims get a -40% survival penalty), instantly prioritizing who to save first on a live heat-map.

## ⚙️ How to Run Locally

You can spin up the entire architecture in seconds. 

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- Twilio API Keys (Set in `.env.local`)
- Supabase Project (Database URL required)

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
