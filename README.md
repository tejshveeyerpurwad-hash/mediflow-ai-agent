<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/logo.png">
    <img alt="SwasthAI Guardian" src="assets/logo.png" width="100">
  </picture>
  <h1>SwasthAI Guardian</h1>
  <h3>Offline-First AI Healthcare Infrastructure for Rural India</h3>
  <p>AI-powered disease surveillance, autonomous outbreak detection, and emergency coordination for 600M+ rural citizens — working fully without internet.</p>
</div>

<p align="center">
  <a href="https://github.com/tejshveeyerpurwad-hash/SwasthAI-Guardian"><img src="https://img.shields.io/github/stars/tejshveeyerpurwad-hash/SwasthAI-Guardian?style=flat-square&logo=github&label=Stars" alt="Stars"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-AGPLv3-8A2BE2?style=flat-square" alt="License"></a>
  <a href="#"><img src="https://img.shields.io/badge/Version-1.0.0-000?style=flat-square" alt="Version"></a>
  <a href="#"><img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" alt="React 18"></a>
  <a href="#"><img src="https://img.shields.io/badge/Node-20-339933?style=flat-square&logo=node.js" alt="Node 20"></a>
  <a href="#"><img src="https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi" alt="FastAPI"></a>
  <a href="#"><img src="https://img.shields.io/badge/AWS-Aurora%20%7C%20DynamoDB-FF9900?style=flat-square&logo=amazonaws" alt="AWS"></a>
  <a href="#"><img src="https://img.shields.io/badge/Offline_First-Enabled-00C853?style=flat-square" alt="Offline First"></a>
  <a href="#"><img src="https://img.shields.io/badge/AI_Powered-SymptomNet-8A2BE2?style=flat-square" alt="AI Powered"></a>
  <a href="#"><img src="https://img.shields.io/badge/PWA-Compatible-5A0FC8?style=flat-square&logo=pwa" alt="PWA"></a>
  <a href="#"><img src="https://img.shields.io/badge/Healthcare-Clinical_Grade-E91E63?style=flat-square" alt="Healthcare"></a>
  <a href="#"><img src="https://img.shields.io/badge/Multilingual-7_Languages-FF6F00?style=flat-square" alt="Multilingual"></a>
  <a href="#"><img src="https://img.shields.io/badge/Deploy-Ready-0ABF53?style=flat-square" alt="Deploy"></a>
</p>

<p align="center">
  <a href="#startup-introduction">Introduction</a> •
  <a href="#problem-statement">Problem</a> •
  <a href="#solution">Solution</a> •
  <a href="#core-features">Features</a> •
  <a href="#technology-stack">Tech Stack</a> •
  <a href="#product-preview">Preview</a> •
  <a href="#ai-capabilities">AI</a> •
  <a href="#installation">Install</a> •
  <a href="#roadmap">Roadmap</a> •
  <a href="#business-vision">Vision</a>
</p>

---

## Startup Introduction

**SwasthAI Guardian** is a production-grade, offline-first healthcare intelligence platform built for rural public health networks. We bridge the gap between 1.4 million disconnected frontline ASHA workers and district command centers — replacing paper registers with AI-powered digital infrastructure that works without internet.

**The Mission.** Rural healthcare in India is broken not because of lack of effort, but because the tools available today assume always-on connectivity, smartphone literacy, and urban infrastructure. SwasthAI Guardian was built from the ground up for the 600,000 villages where none of these exist.

**The Impact.** By transforming low-connectivity clinical logs into real-time, auditable telemetry streams, our platform replaces slow paper-based tracking, automates infectious outbreak forecasting, and ensures closed-loop emergency dispatches — all while functioning fully offline.

We didn't build AI for doctors in cities. We built it for the villages that don't have one.

---

## Problem Statement

India's rural healthcare system faces interdependent challenges that technology has failed to address:

| Challenge | Scale | Consequence |
|-----------|-------|-------------|
| **Healthcare Accessibility** | 600M people lack nearby specialists | Rural mortality rates 2-3x urban averages |
| **Offline Villages** | >65% of rural India has unreliable connectivity | Digital health solutions fail at the point of care |
| **ASHA Worker Burden** | 1.4M workers manage 600M patients with paper registers | 40% of working hours spent on manual paperwork |
| **Pregnancy Monitoring** | 27M pregnancies/year, mostly in rural areas | India accounts for 12% of global maternal deaths |
| **Emergency Response** | No coordinated ambulance dispatch in villages | Critical golden hour window routinely missed |
| **Disease Surveillance** | Outbreaks detected weeks late, if at all | Preventable epidemics spread to urban centers |
| **Government Scheme Access** | 20+ national health schemes, <30% awareness among eligible | Billions in allocated funds go unutilized |
| **Language Barriers** | 22 official languages, most health apps support 1-2 | Frontline workers cannot use English-only tools |

Existing telemedicine platforms assume reliable connectivity, modern smartphones, and English literacy — none of which reflect ground reality in rural India.

---

## Solution

SwasthAI Guardian solves these challenges with a **unified, offline-first platform** spanning patient care, ASHA workflows, and district administration:

<div align="center">

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SwasthAI Guardian Platform                        │
├────────────┬─────────────┬──────────────┬────────────┬─────────────────┤
│  Patient   │   ASHA      │   District   │    AI      │    Backend      │
│   App      │   Portal    │   Dashboard  │  Services  │    APIs         │
├────────────┼─────────────┼──────────────┼────────────┼─────────────────┤
│ Symptom    │ Triage Feed │ Live KPIs    │ SymptomNet │ Express REST    │
│ Checker    │ Maternal    │ Outbreak     │ (MLP)      │ JWT Auth        │
│ SOS        │ Records      │ Radar       │ Sakhi RAG  │ Event Dispatch  │
│ Schemes    │ Child       │ AI Intel     │ Outbreak   │ SSE Broadcasts  │
│ Telemed    │ Nutrition   │ Reports      │ Agent      │ Offline Sync    │
└────────────┴─────────────┴──────────────┴────────────┴─────────────────┘
                                         │
                    ┌────────────────────┴────────────────────┐
                    │            Cloud Infrastructure          │
                    │  Aurora PostgreSQL ── DynamoDB ── Groq  │
                    └─────────────────────────────────────────┘
```

</div>

| Component | Purpose | Works Offline |
|-----------|---------|:---:|
| **Patient App** (React PWA) | AI symptom checking, SOS, government schemes, health records | Yes |
| **ASHA Portal** (React PWA) | Triage queue, maternal tracking, child nutrition, referrals | Yes |
| **District Dashboard** (React PWA) | Command center, outbreak radar, AI reports, system health | Yes* |
| **AI Services** (FastAPI) | Disease classification, RAG chatbot, outbreak detection | No |
| **Backend API** (Express) | REST + websocket + SSE, auth, sync reconciliation | No |
| **Cloud Infra** (AWS) | Aurora PostgreSQL (ACID), DynamoDB (telemetry) | No |

*\* Dashboard caches last-known state for offline viewing*

---

## Core Features

| Feature | Description |
|---------|-------------|
| **AI Symptom Checker** | Diagnoses 101 diseases across 7 languages via hybrid DL + ML ensemble. Runs in-browser via ONNX when offline. |
| **AI Skin Disease Detection** | CNN-based skin lesion analysis with severity assessment. Images compressed to <200KB for 2G upload. |
| **Emergency SOS** | One-tap ambulance dispatch with GPS, WebSocket tracking, and government 108 fallback. P1 priority routing. |
| **Offline-First Sync** | Transactional IndexedDB queue with idempotency keys. Zero data loss. Zero duplicates. |
| **ASHA Worker Portal** | Unified triage feed (P1–P4), maternal and child health records, referral management. |
| **District Command Center** | Live outbreak heatmaps, AI reasoning traces, system health monitoring, SSE alerts. |
| **Government Scheme Checker** | Automatic eligibility matching across 20+ national health schemes (JSY, PMMVY, Ayushman Bharat). |
| **Women's Health & Pregnancy** | WHO-protocol risk assessment, trimester tracking, blood pressure/sugar/vitals logging. |
| **Child Nutrition Tracking** | WHO Z-score classification: SAM (severe), MAM (moderate), Normal. Immunization scheduling. |
| **Village Health Heatmaps** | Geospatial risk visualization with lat/lng clustering and district-level aggregation. |
| **Autonomous Outbreak Radar** | LLM-powered agent scanning clinical data every 30 minutes. Real-time SSE broadcast. |
| **Sakhi RAG Assistant** | Grounded clinical chatbot with 243 WHO/MoHFW guideline chunks. Zero hallucination guarantee. |
| **Voice Assistant** | SpeechSynthesisUtterance output for low-literacy users. Multi-lingual. |
| **Medicine Reminder** | Scheduled alerts for TB/DOTS, chronic medication, vaccination follow-ups. |
| **Hospital Locator** | Nearest PHC/CHC/district hospital with directions, contact info, and bed availability. |
| **Analytics & Reports** | Automated CMO-ready CSV reports, compliance dashboards, NGO impact analytics. |

---

## Technology Stack

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" alt="AWS">
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
</p>

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Framer Motion, Recharts, Leaflet, PWA | Offline-first progressive web app |
| **Backend** | Node.js 20, Express 4, JWT, Zod, Helmet, WebSocket, AWS SDK v3 | REST API, auth, security, sync |
| **AI Service** | Python 3.10+, FastAPI, scikit-learn, Sentence Transformers, Groq SDK, ONNX Runtime | Disease classifier, RAG, outbreak agent |
| **Database** | Amazon Aurora PostgreSQL (ACID), Amazon DynamoDB (telemetry), SQLite (dev fallback) | Clinical records + event streams |
| **Infrastructure** | Vercel (frontend), Render (backend + AI), Docker, Groq LLM | Hosting, orchestration, inference |

---

## Architecture

![Architecture Diagram](docs/architecture-diagram.svg)

The platform follows a **decoupled, offline-first architecture** with three primary services:

1. **React PWA** (Vercel) — Offline-capable frontend with ONNX inference, IndexedDB sync queue, and local RAG cache. Runs fully without internet.
2. **Express.js API** (Render) — RESTful backend with JWT auth, event dispatcher, SSE broadcasts, and dual-database routing (Aurora + DynamoDB).
3. **FastAPI AI Service** (Render) — SymptomNet MLP classifier, Sakhi RAG engine, and autonomous Outbreak Agent.

Data flows through an **asynchronous Event Dispatcher** pattern: relational data (users, medical records, referrals) is committed to Amazon Aurora PostgreSQL for ACID compliance, while time-series telemetry (outbreak alerts, sync logs, emergency events) is routed through Amazon DynamoDB for high-throughput scaling.

> Detailed architecture documentation in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/system_architecture.md](docs/system_architecture.md).

---

## Product Demo

See SwasthAI Guardian in action — from patient symptom checking to real-time outbreak detection on the district command center.

![Product Demo](assets/demo/demo.gif)

> **▶ [Watch Full Demo](assets/demo/demo.mp4)** — 3-minute walkthrough covering the complete platform workflow.

---

## Product Preview

Real interfaces from the SwasthAI Guardian platform, showing the end-to-end experience across patient, provider, and admin workflows. Every screen is designed for low-connectivity environments, multilingual users, and sub-$50 Android devices.

### Welcome Experience

Multi-language onboarding (7 Indian languages) with role-based entry. Users select their role — Villager, ASHA Worker, or Admin — and authenticate via phone/OTP or Aadhaar QR scan. The interface adapts to the user's language and role instantly.

![Welcome Screen](assets/screenshots/01-welcome.png)

### Patient Experience

Patients register via phone number with OTP authentication. The personalized dashboard displays a health score, quick-access service cards (AI Symptom Checker, SOS, Schemes, Maternal Health), and village-level health alerts. All content in the user's preferred language.

![Patient Registration](assets/screenshots/03-registration.png)

![Patient Dashboard](assets/screenshots/05-patient-dashboard.png)

### Women's Health

Comprehensive pregnancy tracking following WHO protocols. Includes trimester management, vital signs logging (blood pressure, blood sugar, heart rate), risk level classification (Low / Medium / High), and due date tracking. Data syncs offline and updates automatically when connectivity returns.

![Women's Health](assets/screenshots/06-women-health.png)

### AI Features

The AI Symptom Checker diagnoses 101 diseases across 7 languages using a hybrid deep learning ensemble. Runs in-browser via ONNX when offline (<1ms inference). The Sakhi RAG assistant provides clinical guidance grounded in 243 WHO/MoHFW guideline chunks. All AI features are preceded by a DISHA-compliant privacy consent flow.

![AI Services Overview](assets/screenshots/02-features.png)

![Privacy & Consent](assets/screenshots/04-privacy.png)

### ASHA Worker Dashboard

Unified triage feed with P1–P4 priority routing. ASHA workers access maternal health records, child nutrition assessments with WHO Z-score classification (SAM/MAM/Normal), vaccination tracking, and referral management. Requests can be accepted, started, and completed with offline support.

![ASHA Dashboard](assets/screenshots/07-asha-dashboard.png)

### NGO Dashboard

Operational dashboard for NGO partners showing village-level health metrics, program outcomes, and grant-proof impact analytics. Includes real-time vaccination completion rates, malnutrition trends, and closed-loop referral tracking — purpose-built for donor reporting and compliance.

### District Command Center

Live outbreak heatmaps powered by the autonomous AI agent, AI reasoning traces with confidence scores, real-time system health monitoring (Aurora, DynamoDB, AI Service, IndexedDB), and SSE-broadcast alerts. District health officers can issue alerts, generate CMO-ready CSV reports, and monitor all villages from a single pane.

![District Command Center](assets/screenshots/08-district-dashboard.png)

### Mobile Experience

The platform is a fully installable Progressive Web App that works on sub-$50 Android devices. Features tap-target optimization (WCAG 2.5.5), 8-second API timeout for slow connections, and automatic image compression to <200KB for 2G uploads. All clinical workflows function completely offline.

---

## AI Capabilities

| Capability | Model / Method | Accuracy | Runs Offline |
|-----------|---------------|:--------:|:------------:|
| **Symptom Classification** | SymptomNet (Deep Learning MLP) + Logistic Regression | 71.1% (101 classes) | Yes (ONNX) |
| **Skin Disease Detection** | CNN-based image analysis with severity triage | Clinical-grade | No |
| **Risk Analysis** | WHO-protocol rule engine + ML confidence scoring | 100% protocol adherence | Yes |
| **Retrieval-Augmented Generation** | Sakhi RAG with 243 WHO/MoHFW chunks + Groq Llama-3.3-70B | F1=1.00 at threshold 0.45 | No |
| **Outbreak Detection** | Autonomous agent clustering + Groq LLM reasoning | 30-min cycle | No |
| **Voice AI** | SpeechSynthesisUtterance + Groq streaming | Multi-lingual | Yes |
| **Predictive Healthcare** | Symptom trend velocity + seasonal NVBDCP signals | Early warning system | No |

**The Hybrid Diagnostic Engine** uses a tiered ensemble approach designed for clinical safety:

- **Primary Tier — SymptomNet**: Multilingual Transformer embeddings (`paraphrase-multilingual-MiniLM-L12-v2`) for deep semantic understanding of symptoms in 7 languages. Runs in-browser via ONNX (<1ms) when offline.
- **Secondary Tier — Logistic Regression**: Keyword-based cross-verification when SymptomNet confidence is borderline. Hold-out accuracy: 71.1%.
- **Safety Tier — Rule Engine**: If confidence falls below 40%, the system refuses to guess. Falls back to verified MoHFW/WHO first-aid instructions. Zero hallucinations.
- **Edge Tier — ONNX + Local RAG**: Fully offline operation with lazy-loaded ONNX weights and IndexedDB-based fuzzy guideline retrieval.

> Full AI methodology including 5-fold stratified cross-validation, RAG calibration, and the complete 101-disease class list in [docs/ai_architecture.md](docs/ai_architecture.md) and [docs/AI.md](docs/AI.md).

---

## Platform Workflow

```
  Patient                     ASHA Worker                      District Command
     │                            │                                  │
     ▼                            ▼                                  ▼
┌──────────┐              ┌──────────────┐                  ┌──────────────────┐
│ Symptom  │              │  Triage Feed  │                  │  Outbreak Radar   │
│ Check    │─────AI─────▶│  P1–P4 Queue  │                  │  Heatmaps         │
│ SOS      │              │  Maternal     │                  │  AI Intel         │
│ Schemes  │              │  Nutrition    │                  │  Reports          │
└──────────┘              └──────┬───────┘                  └──────────────────┘
                                 │                                      │
                                 ▼                                      ▼
                        ┌────────────────┐                    ┌──────────────────┐
                        │  Referral to   │                    │  Government      │
                        │  PHC / Doctor  │───────────────────▶│  Health Mission   │
                        └────────────────┘                    └──────────────────┘
```

1. **Patient** interacts with the app via voice or text in their local language. Symptoms are checked by AI (online or offline). SOS triggers emergency dispatch.
2. **ASHA Worker** receives triaged requests (P1–P4), tracks maternal health and child nutrition, manages referrals. All data syncs offline-first.
3. **Doctor / PHC** receives referrals with full clinical context. Closes the loop with outcomes.
4. **District Dashboard** aggregates data across villages, runs autonomous outbreak detection, and generates compliance reports.
5. **Government** receives CMO-ready reports for policy decisions and resource allocation.

---

## Folder Structure

```
swasthai-guardian/
├── frontend/                  # React + Vite PWA
│   ├── src/                   # Application source
│   ├── public/                # Static assets, PWA manifest
│   ├── tests/                 # Smoke tests
│   └── Dockerfile             # Nginx production build
├── backend/                   # Express.js REST API
│   ├── db/                    # Schema, auto-migrations, seeds
│   ├── routes/                # API route handlers
│   ├── middleware/             # Auth, IDOR policy, audit
│   ├── utils/                 # AI validator, sanitizer
│   ├── tests/                 # Smoke tests
│   └── server.js              # Application entry point
├── ai-service/                # FastAPI AI microservice
│   ├── main.py                # API endpoints
│   ├── outbreak_agent.py      # Autonomous outbreak detection
│   ├── rag_service.py         # Sakhi RAG engine
│   ├── skin_analyzer.py       # CNN-based skin triage
│   ├── model_def.py           # SymptomNet MLP definition
│   ├── train_*.py             # Training scripts
│   └── calibrate_rag.py       # RAG threshold calibration
├── docs/                      # Technical documentation
│   ├── README.md              # Documentation index
│   ├── ARCHITECTURE.md        # System architecture
│   ├── AI.md                  # AI system overview
│   ├── API.md                 # API reference
│   ├── DATABASE.md            # Database design
│   ├── ROADMAP.md             # Product roadmap
│   ├── BUSINESS.md            # Business strategy
│   ├── SECURITY.md            # Security & compliance
│   ├── CONTRIBUTING.md        # Contribution guide
│   ├── DEPLOYMENT_GUIDE.md    # Production deployment
│   ├── GITHUB_SETUP.md        # Repo optimization
│   └── system_architecture.md # Detailed design
├── assets/                    # Logos, screenshots, media
│   └── screenshots/           # Product screenshots
├── infra/                     # Infrastructure
│   └── dynamodb-tables.md     # DynamoDB specs
├── mobile/                    # Future native mobile app
├── docker-compose.yml         # Multi-service orchestration
├── DEPLOYMENT.md              # Production deployment guide
├── Procfile                   # Render process config
└── render.yaml                # Render Blueprint
```

---

## Installation

### Development — Docker

```bash
cp .env.example .env
# Edit .env with your API keys
docker-compose up --build
```

| Service | URL | Health Check |
|---------|-----|-------------|
| Frontend | `http://localhost` | SPA via Nginx |
| Backend API | `http://localhost:5000` | `GET /api/health` |
| AI Service | `http://localhost:8000` | `GET /health` |

### Development — Manual

```bash
# 1. AI Service (start first)
cd ai-service
pip install -r requirements.txt
python train_disease_model.py
python train_deep_model.py
python calibrate_rag.py
uvicorn main:app --reload --port 8000

# 2. Backend
cd backend
cp .env.example .env
npm install
npm run dev

# 3. Frontend
cd frontend
npm install
npm run dev
```

### Production Deployment

| Component | Provider | Configuration | Key Variables |
|-----------|----------|--------------|---------------|
| **Frontend** | Vercel | `frontend/` directory, Vite build | `VITE_API_URL` |
| **Backend** | Render | `backend/` directory, Node runtime | `JWT_SECRET`, `DATABASE_URL`, `GROQ_API_KEY` |
| **AI Service** | Render | `ai-service/` directory, Docker runtime | `GROQ_API_KEY`, `AGENT_SECRET` |
| **Database** | AWS Aurora | Serverless v2, ap-south-1 | `DATABASE_URL` |
| **Telemetry** | AWS DynamoDB | 5 tables, PAY_PER_REQUEST | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` |

**Boot order:** AI Service → Backend → Frontend (each waits for the previous health check).

### Environment Variables

```bash
# Required — generate unique random strings for each
JWT_SECRET=<32-char-random>
AADHAAR_SALT=<32-char-random>
AGENT_SECRET=<32-char-random>
GROQ_API_KEY=<groq-api-key>

# AWS (required for production)
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=<iam-key>
AWS_SECRET_ACCESS_KEY=<iam-secret>
DATABASE_URL=postgresql://user:pass@host:5432/swasthai

# Optional
ALLOWED_ORIGINS=http://localhost:5173
ENABLE_DEEP_MODEL=true   # requires ~500MB RAM
NODE_CLUSTER_WORKERS=1   # increase for multi-core hosts
```

### Deployment Checklist

- [ ] Generate unique secrets: `JWT_SECRET`, `AADHAAR_SALT`, `AGENT_SECRET`
- [ ] Provision Aurora PostgreSQL cluster (ap-south-1)
- [ ] Create 5 DynamoDB tables with GSIs
- [ ] Create IAM user with `AmazonDynamoDBFullAccess`
- [ ] Deploy AI Service first (Render), note the URL
- [ ] Deploy Backend (Render) with `AI_SERVICE_URL` pointing to AI Service
- [ ] Run `node seed.js` on backend to populate initial data
- [ ] Verify `GET /api/health/detailed` reports all services online
- [ ] Deploy Frontend (Vercel) with `VITE_API_URL` pointing to backend
- [ ] `ALLOW_DEMO_OTP` **must not** be set in production

> **Comprehensive production guide** with step-by-step AWS, Render, Vercel, and Docker instructions in [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md).

---

## Roadmap

### Now — Foundation
- [x] Hybrid AI diagnostic engine (101 diseases, 7 languages)
- [x] Offline-first sync with IndexedDB transactional queue
- [x] Autonomous outbreak radar (30-min LLM agent loop)
- [x] Maternal & child health modules (WHO protocol)
- [x] Admin command center with SSE live updates
- [x] Government scheme eligibility engine (20+ schemes)
- [x] B2B multi-tenant architecture with IDOR isolation

### Next — Scale (Q3 2026)
- [ ] Native Android app with offline-first SDK
- [ ] Integration with state NHM databases
- [ ] WhatsApp-based health assistant for feature phones
- [ ] Voice interface in 7 languages
- [ ] Real-time ambulance fleet tracking with ETA
- [ ] Automated MoHFW compliance reporting

### Future — Intelligence (Q4 2026–2027)
- [ ] Federated learning across district clusters
- [ ] Predictive health risk scoring at individual level
- [ ] Drug inventory forecasting for village clinics
- [ ] ABDM (Ayushman Bharat Digital Mission) integration
- [ ] Tele-radiology with AI triage
- [ ] Multi-state rollout with protocol customization

> Full roadmap with 4-phase timeline in [docs/ROADMAP.md](docs/ROADMAP.md).

---

## Business Vision

SwasthAI Guardian is positioned as the **national operating system for rural public health**.

**Market.** India's public health IT market is $2.1B and growing at 15% CAGR. Rural health tech has <5% digital penetration — the largest underserved segment in Indian healthcare.

**Model.** B2B SaaS with tiered pricing:
- **NGO Starter** — Free for community health organizations
- **District Command** — ₹15,000/month for CMO offices with full outbreak AI
- **State Enterprise** — Custom pricing for multi-district state deployments

**Go-to-Market.** Direct outreach to district health officers → NGO partnerships (PSI, CARE India) → State health mission RFPs via GeM → National platform.

**Moat.** Offline-first architecture, hybrid edge-to-cloud AI, autonomous outbreak detection, dual-database design (Aurora + DynamoDB), and deep clinical grounding in 243 WHO/MoHFW guidelines — none of our competitors combine these capabilities.

> Business strategy, competitive analysis, and financial projections in [docs/BUSINESS.md](docs/BUSINESS.md).

---

## Security & Privacy

| Standard | Implementation |
|----------|---------------|
| **DISHA 2023** | Active consent modal gate before data collection |
| **DPDP Act 2023** | Automated PII redaction in all logging layers |
| **IT Act 2008** | JWT + role-based and village-scoped IDOR controls |
| **HIPAA Aligned** | TLS 1.3, AWS KMS encryption, security audit logging |
| **WHO / MoHFW** | 243 clinical guideline chunks in RAG knowledge base |

Additional measures: Aadhaar SHA-256 salted hashing, rate limiting on all endpoints, Helmet.js security headers, non-root Docker containers, 3-attempt exponential backoff, and structured audit trails with trace IDs.

> Complete security documentation in [docs/SECURITY.md](docs/SECURITY.md).

---

## Founder

| | |
|---|---|
| <img src="https://github.com/tejshveeyerpurwad-hash.png" width="140" style="border-radius:50%;"> | **Tejshvini Yerpurwad**<br><br>Founder & AI Engineer<br>Building AI-powered healthcare infrastructure for rural India.<br><br>• B.Tech CSE (AI & ML)<br>• Founder of SwasthAI Guardian<br>• National Finalist – MBBQ 2026<br><br>GitHub: https://github.com/tejshveeyerpurwad-hash<br>LinkedIn: https://www.linkedin.com/in/tejshvini-yerpurwad-382aa3314 |

---

## Contributors

We welcome contributions from engineers, designers, healthcare professionals, and rural health advocates. See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for our contribution guidelines and code of conduct.

---

## License

This project is licensed under the **GNU Affero General Public License v3.0**. See [LICENSE](LICENSE) for full terms.

---

## Contact

| | |
|---|---|
| **Website** | Coming Soon |
| **GitHub** | [github.com/tejshveeyerpurwad-hash/SwasthAI-Guardian](https://github.com/tejshveeyerpurwad-hash/SwasthAI-Guardian) |
| **Issues** | [github.com/tejshveeyerpurwad-hash/SwasthAI-Guardian/issues](https://github.com/tejshveeyerpurwad-hash/SwasthAI-Guardian/issues) |
| **Documentation** | [docs/](docs/) |

---

<div align="center">
  <p>Built with ❤️ by Tejshvini Yerpurwad</p>
  <p>AI for Rural Healthcare • SwasthAI Guardian</p>
</div>
