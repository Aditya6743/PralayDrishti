# PralayDrishti Frontend PRD

## 1. Overview
The PralayDrishti frontend is an ultra-low latency, edge-deployed React application built with Next.js 16 and Tailwind CSS 4. Its primary purpose is to operate flawlessly in low-bandwidth disaster scenarios, offering critical features for stranded civilians and command center operators.

## 2. Core Modules

### 2.1 Civilian SOS Portal (\`/report\`)
- **Voice SOS Integration:** Native browser speech-to-text allowing trapped civilians to request help hands-free.
- **Geospatial Capture:** Automatic extraction of latitude/longitude with graceful degradation.
- **Low-Bandwidth Optimization:** Minimizes blocking assets.

### 2.2 Command Center Dashboard (\`/dashboard\`)
- **Restricted Access:** Passcode protected (\`ELICIT26\`).
- **Live Telemetry Heatmap:** Uses React-Leaflet to plot SOS nodes in real-time.
- **AI Triage Feed:** Sorts incoming reports based on Time-To-Criticality (TTC).

### 2.3 Semantic Missing Linker (\`/dashboard/missing\`)
- **Side-by-side UI:** Compares civilian-reported missing persons with NDRF recovery logs.
- **One-Click Dispatch:** Triggers the Twilio SMS Gateway to notify family members.

### 2.4 Smart Routing (\`/camps\`)
- **OSRM Integration:** Fetches offline routing data to relief camps.
- **Hazard Avoidance:** Algorithmically redirects paths away from flagged disaster zones.

## 3. Technology Stack
- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4 (Glassmorphic Design System)
- Framer Motion (Hardware-accelerated animations)
- Leaflet / React-Leaflet
