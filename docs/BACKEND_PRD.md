# PralayDrishti Backend PRD

## 1. Overview
The PralayDrishti backend operates as a resilient microservice layer handling high-concurrency disaster telemetry. It relies heavily on Supabase (PostgreSQL) for persistence and Google Gemini / Twilio for external data processing and notification.

## 2. Core Modules

### 2.1 Next.js API Routes (\`frontend/src/app/api/\`)
- **\`/api/report\`:** Ingests raw SOS payloads, calculates initial severity/TTC, and pushes to Supabase. Includes fallback mechanisms if network connectivity to Supabase drops.
- **\`/api/sms\`:** Interfaces with Twilio REST API to dispatch real-time emergency broadcasts and family reunification texts.

### 2.2 Database Layer (Supabase)
- **Session Pooling (Port 5432):** Configured to use IPv4 pgBouncer to survive massive traffic spikes without exhausting database connections.
- **Tables:** \`reports\`, \`shelters\`, \`missing_logs\`

### 2.3 AI Semantic Linker
- **Vector Cross-Referencing:** Instead of strict SQL \`LIKE\` queries, missing persons are matched using contextual inference, heavily reducing false negatives in chaotic reporting environments.

## 3. Technology Stack
- Next.js Edge Functions
- Supabase (PostgreSQL + pgBouncer)
- Postgres.js (Driver optimized for connection pooling)
- Twilio REST API
- Google Gemini NLP
