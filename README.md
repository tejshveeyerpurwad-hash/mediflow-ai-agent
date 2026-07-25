<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/demo/thumbnail.png">
    <img alt="MediFlow AI" src="assets/demo/thumbnail.png" width="100">
  </picture>
</p>

<h1 align="center">MediFlow AI</h1>
<h3 align="center">Multi-Agent AI Healthcare for 600 Million Rural Indians</h3>

<p align="center">
  <em>From symptom to specialist, online and off. 11 specialized AI agents orchestrate care across patients, ASHA workers, PHC doctors, and district command centers — no internet required.</em>
</p>

<p align="center">
  <a href="https://mediflow-ai-olive.vercel.app"><img src="https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel" alt="Live Demo"></a>
  <a href="#-product-preview"><img src="https://img.shields.io/badge/Preview-Screenshots-6366f1?style=for-the-badge&logo=googlechrome" alt="Screenshots"></a>
  <a href="docs/ARCHITECTURE.md"><img src="https://img.shields.io/badge/Architecture-Diagrams-22c55e?style=for-the-badge&logo=diagramsdotnet" alt="Architecture"></a>
  <a href="docs/AI.md"><img src="https://img.shields.io/badge/AI_Engine-White_Paper-8b5cf6?style=for-the-badge&logo=openai" alt="AI"></a>
  <a href="docs/BUSINESS.md"><img src="https://img.shields.io/badge/Business-Strategy-f59e0b?style=for-the-badge&logo=chartline" alt="Business"></a>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-AGPLv3-8A2BE2?style=flat-square" alt="License"></a>
  <a href="#"><img src="https://img.shields.io/badge/Version-2.0.0-000?style=flat-square" alt="Version"></a>
  <a href="https://mediflow-api-opal.vercel.app/api/health"><img src="https://img.shields.io/badge/Backend-Vercel_Serverless-22c55e?style=flat-square&logo=vercel" alt="Backend"></a>
  <a href="#"><img src="https://img.shields.io/badge/Build-CI_Passing-22c55e?style=flat-square&logo=githubactions" alt="CI"></a>
  <a href="#"><img src="https://img.shields.io/badge/PWA-Offline_First-6366f1?style=flat-square&logo=pwa" alt="PWA"></a>
  <a href="#"><img src="https://img.shields.io/badge/Languages-7-FF6F00?style=flat-square" alt="Languages"></a>
  <a href="#"><img src="https://img.shields.io/badge/Diseases-101-ef4444?style=flat-square" alt="Diseases"></a>
  <a href="#"><img src="https://img.shields.io/badge/Offline-First-00C853?style=flat-square" alt="Offline"></a>
</p>

<br>

---

## 📋 Table of Contents

| Section | Description |
|---------|------------|
| [🚀 Elevator Pitch](#-elevator-pitch) | The problem, solution, and why it matters |
| [❓ The Problem](#-the-problem) | Rural healthcare's six systemic failures |
| [💡 The Solution](#-the-solution) | How MediFlow AI connects every stakeholder |
| [⚡ Why This Wins](#-why-this-wins) | Key innovations vs. existing solutions |
| [🏗️ Architecture](#%EF%B8%8F-architecture) | System design, data flow, AI pipeline |
| [🤖 AI Engine](#-ai-engine) | Models, accuracy, RAG pipeline, safety |
| [✨ Features](#-features) | Complete capability matrix |
| [📸 Product Preview](#-product-preview) | Walkthrough of every screen |
| [🛠️ Tech Stack](#%EF%B8%8F-tech-stack) | Every component, why we chose it |
| [📦 Getting Started](#-getting-started) | Docker, local, production |
| [📁 Repository Structure](#-repository-structure) | What goes where |
| [🔒 Security & Compliance](#-security--compliance) | DISHA, DPDP, HIPAA alignment |
| [📈 Scalability Model](#-scalability-model) | One village to the nation |
| [🗺️ Roadmap](#%EF%B8%8F-roadmap) | Now, next, and future |
| [💼 Business Model](#-business-model) | Market, pricing, GTM strategy |
| [🤝 Contributing](#-contributing) | How to help |
| [📄 License](#-license) | AGPLv3 |

<br>

---

## 🚀 Elevator Pitch

### The crisis

**600 million people** in rural India lack access to quality healthcare. **1.4 million ASHA workers** — the frontline of rural public health — manage patient records with **paper registers** while **27 million pregnancies** occur annually in villages hours from the nearest doctor.

Every digital health solution today fails because it assumes reliable internet, English literacy, and modern smartphones. In rural India, none of these exist.

### The solution

**MediFlow AI** is an **offline-first, multi-agent AI platform** connecting patients, ASHA workers, PHC doctors, and district health officers into one unified system — no internet required.

<p align="center">
  <code>Patient Symptom → AI Triage → ASHA Worker → PHC Referral → Specialist → District Analytics → Policy</code>
</p>

### Why it works

| Innovation | What it means |
|:-----------|:--------------|
| **11 specialized AI agents** | Not one model — a clinical team: intake, triage, OCR, coordinator, medication safety, hospital recs, appointments, doctor copilot, emergency, follow-up, outbreak detection |
| **ONNX browser inference** | Symptom checking runs in-browser — zero latency, zero data leaving the device |
| **IndexedDB transactional queue** | Every action saved locally, synced when connected — zero data loss |
| **7 Indian languages** | Hindi, Marathi, Tamil, Telugu, Bengali, English, Hinglish — voice + text |
| **Autonomous outbreak radar** | LLM agent scans clinical data every 30 minutes, alerts district command in real time |
| **DISHA + DPDP Act compliance** | Consent gate, Aadhaar hashing, PII redaction, village-scoped access control |

### The impact

> *"Not AI for doctors in cities. AI for the villages that don't have one."*

<br>

---

## ❓ The Problem

Rural India's healthcare crisis is a **system failure**, not a resource shortage:

| Dimension | The Numbers | Why It Matters |
|:----------|:------------|:---------------|
| 🏥 **Access** | 600M people lack nearby specialists | Rural mortality rates 2–3× higher than urban |
| 📡 **Connectivity** | >65% have unreliable internet | Digital health tools fail at the point of care |
| 📋 **Paper burden** | 1.4M ASHA workers on paper registers | 40% of working hours lost to manual paperwork |
| 🤰 **Maternal health** | 27M pregnancies/year in rural areas | India accounts for 12% of global maternal deaths |
| 🚑 **Emergency** | No coordinated ambulance dispatch | Golden hour missed routinely |
| 🦟 **Surveillance** | Outbreaks detected weeks late | Preventable epidemics spread to cities |
| 📜 **Scheme access** | 20+ national schemes, <30% awareness | Billions in allocated funds unutilized |
| 🌐 **Language** | 22 official languages, most apps support 1–2 | Frontline workers can't use English-only tools |

**The gap is clear:** telemedicine assumes connectivity, smartphones, and literacy. Rural India has none of these guaranteed.

<br>

---

## 💡 The Solution

MediFlow AI replaces fragmented paper workflows with a unified, offline-first platform:

```
                        ┌─────────────────────────────────────────────────────────────┐
                        │                    MediFlow AI Platform                      │
                        ├──────────┬──────────┬──────────┬──────────┬─────────────────┤
                        │  Patient │  ASHA    │   PHC    │ District │   Government     │
                        │   App    │  Portal  │  Doctor   │ Command  │                  │
                        ├──────────┼──────────┼──────────┼──────────┼─────────────────┤
                        │ Symptom  │ Triage   │ AI       │ Outbreak │ Policy           │
                        │ Checker  │ Queue    │ Copilot  │ Radar    │ Intelligence     │
                        │ SOS      │ Maternal │ Referral │ SSE      │ Compliance       │
                        │ Records  │ Tracking │ Follow-up│ Reports  │ Dashboards       │
                        │ Schemes  │ Vaccines │          │          │                  │
                        └──────────┴──────────┴──────────┴──────────┴─────────────────┘
```

| Component | Offline? | What it does |
|:----------|:--------:|:-------------|
| **🧑‍⚕️ Patient App** | ✅ Yes | AI symptom checker, SOS dispatch, health records, scheme eligibility, hospital locator, voice interface |
| **👩‍⚕️ ASHA Portal** | ✅ Yes | P1–P4 triage queue, maternal tracking, child nutrition, referrals, villager registration, vaccination schedules |
| **🏥 PHC Doctor** | ✅ Yes | AI-assisted differential diagnosis (copilot), referral management, treatment plans, follow-ups |
| **📊 District Command** | ✅ Cached | Live outbreak radar, AI intelligence traces, system health, SSE alerts, auto-generated CMO CSV reports |
| **🤖 AI Engine** | ❌ Online | 11 specialized agents, SymptomNet MLP, Sakhi RAG (243 WHO/MoHFW guidelines), outbreak agent, skin analyzer |
| **🔌 Backend API** | ❌ Online | REST + WebSocket + SSE, JWT auth, event dispatch, Aurora PostgreSQL + DynamoDB, telemetry |
| **☁️ Cloud Infra** | ❌ Online | Aurora PostgreSQL (ACID), DynamoDB (telemetry), Groq Llama-3.3-70B, AWS Bedrock, Vercel + Render |

> **Offline-first means:** everything works without internet. ONNX inference runs locally. IndexedDB queues transactions. Local RAG caches guidelines. Automatic sync when connected.

<br>

---

## ⚡ Why This Wins

### 🧠 Multi-Agent Architecture (not one model)

| Agent | Role | Technology |
|:------|:-----|:-----------|
| **Patient Intake** | Collects symptoms, history, demographics | FastAPI + Groq |
| **Medical Record** | Manages structured health records | Express + PostgreSQL |
| **OCR** | Extracts data from prescriptions | Groq vision |
| **Medical Summary** | Generates referral summaries | Groq Llama-3.3-70B |
| **Care Coordinator** | Plans treatment pathways | Multi-agent orchestration |
| **Medication Safety** | Drug interaction checker | Clinical rules + LLM |
| **Hospital Recommender** | Nearest appropriate facility | Geospatial + bed availability |
| **Appointment Scheduler** | Books and manages visits | Calendar + QR confirmation |
| **Doctor Copilot** | Differential diagnosis | Multi-agent reasoning |
| **Emergency** | P1–P4 triage + ambulance dispatch | GPS + WebSocket |
| **Follow-Up** | Post-care tracking + reminders | Automated scheduler |

### 📡 Offline-First by Design

```
┌─────────────────────────────────────────────────────────────────┐
│                    Browser (Offline-First)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ ONNX Runtime │  │  IndexedDB   │  │   Local RAG Cache    │   │
│  │  SymptomNet  │  │  Tx Queue    │  │  (WHO/MoHFW chunks)  │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
│         │                 │                       │              │
│         ▼                 ▼                       ▼              │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │              Sync Engine (auto when online)                  ││
│  └──────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### 🚑 Emergency Intelligence
- One-tap SOS with GPS → WebSocket ambulance tracking
- P1 priority routing → critical cases first
- Government 108 fallback when app dispatch unavailable

### 🗣️ Voice AI + 7 Languages
- Speech synthesis for low-literacy users
- Voice input for hands-free village visits
- Hindi, Marathi, Tamil, Telugu, Bengali, English, Hinglish

<br>

---

## 🏗️ Architecture

### System Topology

```mermaid
flowchart TB
    subgraph Frontend["Frontend — Vercel (PWA)"]
        PWA["React 18 + Vite<br/>Tailwind + Framer Motion"]
        ONNX["ONNX SymptomNet<br/>Browser Inference"]
        IDB["IndexedDB<br/>Offline Transaction Queue"]
        LRAG["Local RAG Cache<br/>WHO Guidelines"]
    end

    subgraph Backend["Backend — Express.js (Vercel/Render)"]
        API["REST API<br/>JWT + Helmet + Rate Limit"]
        WS["WebSocket<br/>Telemetry + Alerts"]
        SSE["SSE Broadcast<br/>Real-time Events"]
        EVENT["Event Dispatcher<br/>Async Processing"]
    end

    subgraph AI["AI Service — FastAPI (Render/Docker)"]
        ORCH["Agent Orchestrator<br/>11 Specialized Agents"]
        SNET["SymptomNet MLP<br/>101 Disease Classes"]
        RAG["Sakhi RAG<br/>243 Guideline Chunks"]
        OA["Outbreak Agent<br/>30-min Autonomous Loop"]
        SKIN["Skin Analyzer<br/>CNN-based Triage"]
    end

    subgraph Storage["Storage Layer"]
        PG[("Aurora PostgreSQL<br/>ACID — Medical Records")]
        DDB[("DynamoDB PAY_PER_REQUEST<br/>Telemetry + Outbreaks")]
        SQLITE[("SQLite<br/>Local Dev Fallback")]
    end

    subgraph AIProviders["AI Providers"]
        GROQ["Groq<br/>Llama-3.3-70B + 3.1-8B"]
        BEDROCK["AWS Bedrock<br/>Claude Sonnet"]
        MOCK["Mock Provider<br/>Offline/synthetic fallback"]
    end

    PWA -->|"REST + WebSocket"| API
    PWA --> ONNX
    PWA --> IDB
    PWA --> LRAG
    API --> EVENT
    API --> WS
    API --> SSE
    EVENT --> PG
    EVENT --> DDB
    API --> ORCH
    ORCH --> SNET
    ORCH --> RAG
    ORCH --> OA
    ORCH --> SKIN
    ORCH --> GROQ
    ORCH --> BEDROCK
    ORCH --> MOCK
    RAG --> PG
    OA --> DDB
```

### Data Flow

```mermaid
sequenceDiagram
    participant P as Patient
    participant F as Frontend PWA
    participant B as Backend API
    participant A as AI Service
    participant DB as Database
    participant D as District Dashboard

    P->>F: Reports symptoms (voice/text)
    F->>F: ONNX inference (if offline)
    F->>B: Submit symptoms
    B->>A: Route to Agent Orchestrator
    A->>A: Patient Intake → Summary → Coordinator
    A-->>B: Care plan + recommendations
    B-->>F: Triage result in local language
    F-->>P: Show result

    alt Emergency detected
        B->>B: SOS dispatch + GPS
        B->>D: SSE alert broadcast
        D->>D: Update outbreak radar
    end

    alt Follow-up needed
        A->>A: Follow-Up Agent schedules
        B->>F: Appointment reminder
    end

    F->>IDB: Cache offline
    IDB->>B: Sync when online
```

### AI Pipeline

```mermaid
flowchart LR
    subgraph Input["Input Layer"]
        TEXT["Text Symptoms"]
        IMAGE["Prescription Image"]
        VITALS["Vital Signs"]
        HISTORY["Medical History"]
    end

    subgraph Agents["Agent Orchestration"]
        PI["Patient Intake"]
        MR["Medical Record"]
        OCR["OCR Extraction"]
        MS["Medical Summary"]
        CC["Care Coordinator"]
    end

    subgraph Safety["Safety Guardrails"]
        GUARD["Clinical Safety Check"]
        CONSENT["DISHA Consent Gate"]
        CONF["Confidence ≥ 40%?"]
        FALLBACK["WHO/MoHFW First Aid<br/>Zero Hallucination"]
    end

    subgraph Output["Output"]
        TRIAGE["P1–P4 Priority"]
        PLAN["Care Pathway"]
        REFER["Referral"]
        MEDS["Medication Check"]
        FOLLOW["Follow-up Plan"]
    end

    Input --> Agents
    Agents --> Safety
    CONF -->|"≥40%"| Output
    CONF -->|"<40%"| FALLBACK
    FALLBACK --> Output
```

<br>

---

## 🤖 AI Engine

### Model Pipeline (Hybrid Ensemble)

```
                 ┌─────────────────────────────────────┐
                 │         Symptom Input                │
                 │    (Voice / Text / 7 Languages)      │
                 └──────────────┬──────────────────────┘
                                │
                                ▼
                 ┌─────────────────────────────────────┐
                 │    Primary: SymptomNet (MLP)         │
                 │    • Multilingual BERT embeddings    │
                 │    • 101 disease classes             │
                 │    • ONNX inference (<1ms offline)   │
                 └──────────────┬──────────────────────┘
                                │
                     ┌──────────┴──────────┐
                     ▼                     ▼
              ┌──────────────┐    ┌──────────────────┐
              │ Confidence   │    │ Confidence <70%  │
              │ ≥70%         │    │                  │
              └──────┬───────┘    └────────┬─────────┘
                     │                     │
                     ▼                     ▼
              ┌──────────────┐    ┌──────────────────┐
              │ Output       │    │ Secondary:        │
              │ Prediction   │───▶│ Logistic Regression│
              └──────────────┘    └────────┬─────────┘
                                           │
                                ┌──────────┴──────────┐
                                ▼                     ▼
                         ┌──────────────┐    ┌──────────────────┐
                         │ Confidence   │    │ Confidence <40%  │
                         │ ≥40%         │    │                  │
                         └──────┬───────┘    └────────┬─────────┘
                                │                     │
                                ▼                     ▼
                         ┌──────────────┐    ┌──────────────────┐
                         │ Output       │    │ Safety Fallback:  │
                         │ Prediction   │    │ WHO/MoHFW First Aid│
                         └──────────────┘    │ Zero Hallucination │
                                              └──────────────────┘
```

### Model Performance

| Capability | Model | Metric | Offline |
|:-----------|:------|:------:|:-------:|
| **Symptom Classification** | SymptomNet (MLP) + Logistic Regression | 71.1% accuracy (101 classes) | ✅ ONNX |
| **Skin Disease Detection** | CNN-based image analysis | Clinical-grade triage | ❌ |
| **Risk Analysis** | WHO protocol + ML confidence | 100% protocol adherence | ✅ |
| **Clinical Chatbot** | Sakhi RAG (243 chunks + Groq Llama-3.3-70B) | F1=1.00 @ 0.45 threshold | ❌ |
| **Outbreak Detection** | Autonomous agent + Groq LLM | 30-min cycle | ❌ |
| **Voice AI** | SpeechSynthesis + Groq streaming | 7 Indian languages | ✅ |
| **Medication Safety** | Drug interaction agent | Clinical-grade rules | ❌ |
| **Doctor Copilot** | Multi-agent differential diagnosis | AI-assisted | ❌ |

### RAG Pipeline (Sakhi Assistant)

```mermaid
flowchart LR
    Q["User Question"] --> E["Embedding<br/>MiniLM-L12-v2"]
    E --> S["Vector Search<br/>243 Guideline Chunks"]
    S --> R["Retrieval<br/>Threshold ≥0.45"]
    R --> C["Context<br/>WHO + MoHFW Guidelines"]
    C --> L["LLM<br/>Groq Llama-3.3-70B"]
    L --> O["Grounded Response<br/>+ Source Citations"]
    L --> G["Guardrail<br/>Clinical Safety Check"]
```

### Safety Guarantees

- **No diagnosis claims** — always says "consult a healthcare provider"
- **Confidence floor at 40%** — below this, refuses to guess
- **Conservative triage** — always errs toward higher acuity
- **DISHA consent gate** — no data collected without permission
- **Source citations** — every response includes WHO guideline section
- **Trace IDs** — every AI decision logged with unique audit ID

<br>

---

## ✨ Features

### 🧠 AI & Intelligence

| Feature | Description |
|:--------|:------------|
| **Multi-Agent Orchestrator** | 11 specialized AI agents working in concert |
| **AI Symptom Checker** | 101 diseases, 7 languages, hybrid DL+ML ensemble |
| **Doctor Copilot** | AI-assisted differential diagnosis for clinicians |
| **Medical Record OCR** | Extract structured data from prescription images |
| **Care Coordinator** | Automated care pathway planning and tracking |
| **Medication Safety Check** | Drug interaction detection and alternatives |
| **Hospital Recommendation** | Nearest appropriate facility by condition |
| **Smart Appointment Scheduling** | AI-optimized booking with calendar integration |
| **Emergency Triage Agent** | Instant P1–P4 classification with dispatch |
| **Follow-Up Automation** | Post-care tracking and reminder system |
| **Skin Disease Detection** | CNN-based image analysis with severity triage |
| **Sakhi RAG Assistant** | Grounded clinical chatbot, zero hallucinations |
| **Autonomous Outbreak Radar** | 30-min LLM agent scanning for disease clusters |

### 🚑 Emergency & Safety

| Feature | Description |
|:--------|:------------|
| **One-Tap SOS** | Emergency dispatch with GPS coordinates |
| **Real-Time Ambulance Tracking** | WebSocket telemetry for live vehicle location |
| **P1 Priority Routing** | Critical cases flagged instantly |
| **Government 108 Fallback** | National emergency number integration |
| **Offline Emergency Mode** | SOS works without internet connection |

### 👩‍⚕️ ASHA & Clinical Workflow

| Feature | Description |
|:--------|:------------|
| **Unified Triage Feed** | P1–P4 priority queue for daily workflow |
| **Maternal Health Tracking** | WHO-protocol trimester management |
| **Child Nutrition Assessment** | WHO Z-score (SAM/MAM/Normal) |
| **Vaccination Scheduling** | Immunization tracking with reminders |
| **Referral Management** | End-to-end referral with loop closure |
| **Villager Registration** | Offline-capable patient onboarding |
| **Medical Timeline** | Complete chronological patient history |

### 📊 District Administration

| Feature | Description |
|:--------|:------------|
| **Live Outbreak Heatmaps** | Geospatial risk visualization |
| **AI Intelligence Dashboard** | Model reasoning traces + confidence scores |
| **System Health Monitor** | Real-time status of all services |
| **SSE Broadcast Alerts** | Instant notifications to all connected clients |
| **CMO-Ready CSV Reports** | Auto-generated compliance reports |
| **Village Health Analytics** | Aggregated metrics across population |

### 📡 Offline & Sync

| Feature | Description |
|:--------|:------------|
| **ONNX Browser Inference** | Symptom checking without internet |
| **IndexedDB Transactional Queue** | Zero data loss when offline |
| **Local RAG Cache** | Clinical guidelines cached on device |
| **Automatic Sync** | Seamless reconciliation when online |
| **PWA Installable** | Works on sub-$50 Android devices |
| **2G Optimization** | 8s timeout, <200KB image compression |

### 🌐 Multilingual & Accessibility

| Feature | Description |
|:--------|:------------|
| **7 Indian Languages** | Hindi, Marathi, Tamil, Telugu, Bengali, English, Hinglish |
| **Voice Input** | Speech-to-text for hands-free operation |
| **Speech Synthesis** | Text-to-speech for low-literacy users |
| **Tap Target Optimization** | WCAG 2.5.5 compliant for rural users |

### 🔐 Security & Compliance

| Feature | Description |
|:--------|:------------|
| **DISHA 2023 Consent** | Active gate before data collection |
| **DPDP Act 2023 PII Redaction** | Automated in all logging layers |
| **Aadhaar SHA-256 Hashing** | No plaintext storage |
| **Village-Scoped IDOR** | Role-based data isolation |
| **JWT + Helmet** | Industry-standard authentication + headers |
| **Rate Limiting** | 100 req/min per IP with exponential backoff |
| **Audit Trails** | Every action has a unique trace ID |

<br>

---

## 📸 Product Preview

> **Note:** Screenshots are being finalized. Below is a walkthrough of every screen in the platform. Actual images are available in [`assets/screenshots/`](assets/screenshots/). A full demo video is being prepared at [`assets/demo/`](assets/demo/).

### 1️⃣ Patient Experience

| Screen | What It Does |
|:-------|:-------------|
| **Welcome & Onboarding** | Multi-language role-based entry (Patient / ASHA / Admin) |
| **AI Symptom Checker** | Report symptoms via text or voice in 7 languages |
| **Health Dashboard** | Personalized health score + quick-access services |
| **Medical Records & OCR** | Upload prescription images for AI extraction |
| **Medical Timeline** | Chronological health history with event markers |
| **Government Schemes** | Eligibility check for 20+ national health schemes |
| **Emergency SOS** | One-tap ambulance dispatch with GPS |

### 2️⃣ ASHA Worker Portal

| Screen | What It Does |
|:-------|:-------------|
| **Villager Registration** | Offline-capable onboarding with Aadhaar + phone |
| **Unified Triage Feed** | P1–P4 priority queue with voice-guided actions |
| **Maternal Health** | WHO-protocol trimester tracking (LMP, EDD, risk flags) |
| **Child Nutrition** | WHO Z-score classification (SAM/MAM/Normal) |
| **Vaccination Scheduler** | Immunization schedule with automated reminders |
| **Referral Management** | End-to-end referral to PHC with loop closure |

### 3️⃣ Doctor Copilot

| Screen | What It Does |
|:-------|:-------------|
| **AI-Assisted Diagnosis** | Differential diagnosis from symptoms + history |
| **Care Coordination** | Kanban-style patient triage board |
| **Medication Safety** | Drug interaction checker with alternatives |
| **Follow-Up Management** | Automated post-care tracking |

### 4️⃣ District Command Center

| Screen | What It Does |
|:-------|:-------------|
| **Outbreak Radar** | Geospatial heatmap with 30-min AI scan |
| **AI Intelligence** | Model reasoning traces with confidence scores |
| **System Health** | Real-time status of all services + telemetry |
| **SSE Broadcast** | Instant alerts to all connected clients |
| **CMO Reports** | Auto-generated CSV compliance reports |

### 5️⃣ Women's Health

| Screen | What It Does |
|:-------|:-------------|
| **Menstrual Health Tracker** | Cycle tracking with AI-predicted dates |
| **Pregnancy Risk Assessment** | WHO-protocol clinical thresholds |
| **Sakhi Chatbot** | Women's health AI assistant in local languages |

<br>

---

## 🛠️ Tech Stack

<div align="center">
  <table>
    <tr>
      <td align="center" width="25%">
        <h4>🎨 Frontend</h4>
        <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"><br>
        <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"><br>
        <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind"><br>
        <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer"><br>
        <img src="https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA"><br>
        <small>React 18 • Vite 5 • Tailwind 3 • Framer Motion • Leaflet • Recharts</small>
      </td>
      <td align="center" width="25%">
        <h4>⚙️ Backend</h4>
        <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node"><br>
        <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"><br>
        <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT"><br>
        <img src="https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="WebSocket"><br>
        <small>Express 4 • JWT • Zod • Helmet • AWS SDK v3 • better-sqlite3</small>
      </td>
      <td align="center" width="25%">
        <h4>🧠 AI Service</h4>
        <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"><br>
        <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"><br>
        <img src="https://img.shields.io/badge/scikit_learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white" alt="sklearn"><br>
        <img src="https://img.shields.io/badge/Groq-00E673?style=for-the-badge&logo=groq&logoColor=white" alt="Groq"><br>
        <small>FastAPI • scikit-learn • ONNX • Sentence Transformers • Groq SDK</small>
      </td>
      <td align="center" width="25%">
        <h4>☁️ Cloud & Infra</h4>
        <img src="https://img.shields.io/badge/AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" alt="AWS"><br>
        <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel"><br>
        <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"><br>
        <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render"><br>
        <small>Aurora • DynamoDB • Vercel • Docker • Render • Groq • Bedrock</small>
      </td>
    </tr>
  </table>
</div>

| Layer | Technology | Rationale |
|:------|:-----------|:----------|
| **Frontend** | React 18 + Vite 5 + Tailwind CSS 3 | Offline-first PWA with glassmorphism design, Framer Motion animations |
| **Maps** | Leaflet + React-Leaflet | Open-source geospatial health visualization |
| **Charts** | Recharts | Lightweight analytics for village health metrics |
| **Backend** | Node.js 22 + Express 4 | REST API with cluster mode + WebSocket + SSE |
| **Auth** | JWT + bcryptjs + Helmet | Secure auth with rate limiting + audit trails |
| **Validation** | Zod 4 | Runtime type safety + input sanitization |
| **AI Runtime** | FastAPI + Python 3.11 | Async multi-agent inference pipeline |
| **ML Models** | scikit-learn + ONNX | Browser-side disease classification |
| **LLM** | Groq Llama-3.3-70B + AWS Bedrock | RAG chatbot + outbreak intelligence |
| **RAG** | Sentence Transformers MiniLM-L12-v2 | Multilingual clinical embeddings |
| **Database** | Aurora PostgreSQL | ACID-compliant clinical records |
| **Telemetry** | DynamoDB PAY_PER_REQUEST | Millisecond-latency event streams |
| **Dev DB** | SQLite + better-sqlite3 | Zero-config local development |
| **Hosting** | Vercel + Render | Serverless frontend + containerized backend |

<br>

---

## 📦 Getting Started

### 🐳 Docker (recommended)

```bash
git clone https://github.com/tejshveeyerpurwad-hash/mediflow-ai-agent.git
cd mediflow-ai-agent

# Configure environment
cp .env.example .env
# Edit .env with your GROQ_API_KEY (get one at console.groq.com)

# Launch everything
docker-compose up --build
```

| Service | URL | Health |
|:--------|:----|:-------|
| Frontend | `http://localhost` | SPA via Nginx |
| Backend API | `http://localhost:5000` | `GET /api/health` |
| AI Service | `http://localhost:8000` | `GET /health` |

### 🔧 Manual Setup

#### Prerequisites
- Node.js 22+, Python 3.11+, npm 10+

#### 1. AI Service
```bash
cd ai-service
pip install -r requirements.txt
python generate_dataset.py && python train_disease_model.py
uvicorn main:app --reload --port 8000
```

#### 2. Backend
```bash
cd backend
cp .env.example .env      # Edit with your keys
npm install
npm run dev
```

#### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

### ☁️ Production Deployment

| Service | URL | Status |
|:--------|:----|:-------|
| **Frontend** | [mediflow-ai-olive.vercel.app](https://mediflow-ai-olive.vercel.app) | ✅ Live |
| **Backend API** | [mediflow-api-opal.vercel.app](https://mediflow-api-opal.vercel.app) | ✅ Live |

To deploy backend + AI service on Render:
1. Fork this repository to your GitHub account
2. Go to [dashboard.render.com](https://dashboard.render.com) → New Blueprint
3. Select your fork — `render.yaml` auto-configures both services
4. Set `GROQ_API_KEY` in Render dashboard Environment Variables

Full deployment guide: [`DEPLOYMENT.md`](./DEPLOYMENT.md)

### 🔐 Environment Variables

```bash
# Required
JWT_SECRET=          # Generate a random 32-char string
AADHAAR_SALT=        # Generate a random 32-char string
AGENT_SECRET=        # Generate a random 32-char string
GROQ_API_KEY=gsk_    # Get at console.groq.com
ADMIN_PASSCODE=      # Your admin access code

# AWS (production only)
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=   # IAM key with DynamoDB + RDS access
AWS_SECRET_ACCESS_KEY=
DATABASE_URL=postgresql://user:pass@host:5432/mediflow

# Optional
ALLOWED_ORIGINS=http://localhost:5173,https://mediflow-ai-olive.vercel.app
ENABLE_DEEP_MODEL=true
NODE_CLUSTER_WORKERS=1
```

<br>

---

## 📁 Repository Structure

```
mediflow-ai-agent/
│
├── frontend/                         # React + Vite PWA (Vercel)
│   ├── src/
│   │   ├── pages/                    # 34 page components
│   │   ├── components/               # Reusable UI components
│   │   ├── services/                 # API + agent service clients
│   │   ├── context/                  # Auth, language, voice state
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── store/                    # Zustand state management
│   │   ├── Admin/                    # District command center views
│   │   ├── NGO/                      # ASHA + NGO dashboard components
│   │   ├── Villager/                 # Patient-facing components
│   │   ├── utils/                    # Offline sync, PII redactor, TTS
│   │   └── constants/                # Version info, route paths
│   ├── public/                       # PWA manifest, icons, ONNX model
│   ├── tests/                        # PWA smoke tests
│   └── vercel.json                   # Vercel deployment config
│
├── backend/                          # Express.js API
│   ├── app.js                        # Express app (Vercel serverless)
│   ├── server.js                     # Server entry (listen + WebSocket)
│   ├── routes/                       # Auth, villager, NGO, admin, agents, webhooks
│   ├── middleware/                    # JWT auth, IDOR policy, audit logging
│   ├── db/                           # Schema, migrations, seed data
│   ├── seeds/                        # Seed scripts
│   ├── tests/                        # Smoke + policy tests
│   └── utils/                        # Sanitizer, validators
│
├── ai-service/                       # FastAPI AI (Render/Docker)
│   ├── main.py                       # API + agent routes
│   ├── agents/                       # 11 specialized AI agents
│   │   ├── orchestrator.py           # Agent routing + provider selection
│   │   ├── base.py                   # Abstract agent base class
│   │   └── providers/                # Groq, Bedrock, Mock LLM providers
│   ├── rag_service.py                # Sakhi RAG engine (243 chunks)
│   ├── outbreak_agent.py             # Autonomous 30-min scanner
│   └── model_def.py                  # SymptomNet MLP architecture
│
├── api/                              # Vercel serverless function
│   ├── index.js                      # Lambda entry point
│   └── package.json                  # Lambda dependencies
│
├── docs/                             # Documentation hub
│   ├── ARCHITECTURE.md               # System design
│   ├── AI.md                         # AI methodology
│   ├── API.md                        # REST API reference
│   ├── BUSINESS.md                   # Business strategy
│   ├── CONTRIBUTING.md               # Contribution guidelines
│   └── SECURITY.md                   # Security audit
│
├── infra/                            # Infrastructure specs
│   └── dynamodb-tables.md            # Table definitions + GSIs
│
├── assets/                           # Media assets
│   ├── screenshots/                  # App screenshots
│   └── demo/                         # Demo GIF + video
│
├── .github/workflows/                # CI pipeline
├── docker-compose.yml                # Multi-service orchestration
├── render.yaml                       # Render Blueprint
├── vercel.json                       # Vercel serverless config
├── DEPLOYMENT.md                     # Production deployment guide
└── .env.example                      # Environment template
```

<br>

---

## 🔒 Security & Compliance

### Regulatory Alignment

| Standard | Implementation |
|:---------|:---------------|
| **📜 DISHA 2023** | Active consent modal gate before any data collection; consent stored per device per user |
| **🛡️ DPDP Act 2023** | Automated PII redaction in all logging layers; Aadhaar SHA-256 salted hashing |
| **⚖️ IT Act 2008** | JWT + role-based and village-scoped IDOR controls; audit trails |
| **🏥 HIPAA Alignment** | TLS 1.3, Helmet.js OWASP headers, KMS encryption at rest |
| **🌍 WHO / MoHFW** | 243 clinical guideline chunks in RAG knowledge base |

### Security Architecture

```
🔐 Authentication          🔒 Data Protection          📋 Audit & Monitoring
──────────────────────     ──────────────────────     ─────────────────────────
JWT + configurable expiry  Aadhaar SHA-256 hashing    Unique trace ID per request
bcryptjs password hashing  TLS 1.3 for all traffic    Structured JSON logging
Phone OTP + Aadhaar QR     AWS KMS at rest encryption PII redaction automated
3-attempt lockout          Non-root Docker containers  Rate limit: 100 req/min
Session timeout + idle     .env secrets never pushed   Helmet.js OWASP headers
```

<br>

---

## 📈 Scalability Model

```mermaid
flowchart LR
    subgraph Village["🏘️ One Village"]
        V["Village"]
        P["📱 Patients"]
        A["👩‍⚕️ ASHA"]
    end

    subgraph Block["🏥 Block (PHC)"]
        B["PHC Clinic"]
        D["👨‍⚕️ Doctor"]
    end

    subgraph District["📊 District"]
        DC["Command Center"]
        DH["🏛️ CMO Office"]
    end

    subgraph State["🏛️ State"]
        SH["State NHM"]
        SP["📋 Policy"]
    end

    subgraph National["🇮🇳 National"]
        NM["MoHFW"]
        ND["National Dashboard"]
    end

    Village --> Block
    Block --> District
    District --> State
    State --> National
```

| Scale | Capability |
|:------|:-----------|
| **🏘️ Village** | Offline-first PWA, local AI inference, no internet required |
| **🏥 Block (PHC)** | Aggregated patient data, referral management, doctor copilot |
| **📊 District** | Outbreak radar, AI intelligence, CMO reports, SSE alerts |
| **🏛️ State** | Multi-district aggregation, NHM integration, compliance reporting |
| **🇮🇳 National** | Population health analytics, policy intelligence, national dashboard |

<br>

---

## 🗺️ Roadmap

### ✅ Now — Foundation

| Milestone | Status |
|:----------|:------:|
| Hybrid AI diagnostic engine (101 diseases, 7 languages) | ✅ |
| Offline-first sync with IndexedDB transactional queue | ✅ |
| 11 specialized multi-agents for end-to-end care | ✅ |
| Autonomous outbreak radar (30-min LLM agent loop) | ✅ |
| Maternal & child health modules (WHO protocol) | ✅ |
| District command center with SSE live updates | ✅ |
| Government scheme eligibility engine (20+ schemes) | ✅ |
| OCR prescription extraction | ✅ |
| Medication safety checker | ✅ |
| Doctor copilot with differential diagnosis | ✅ |
| B2B multi-tenant architecture with IDOR isolation | ✅ |

### 🔄 Next — Scale (Q3 2026)

| Milestone | Status |
|:----------|:------:|
| Native Android app with offline-first SDK | ⏳ |
| State NHM database integration | ⏳ |
| WhatsApp-based health assistant for feature phones | ⏳ |
| Full voice interface in all 7 languages | ⏳ |
| Real-time ambulance fleet tracking with ETA | ⏳ |
| Automated MoHFW compliance reporting | ⏳ |
| Tele-radiology with AI triage | ⏳ |

### 🔮 Future — Intelligence (Q4 2026–2027)

| Milestone | Status |
|:----------|:------:|
| Federated learning across district clusters | 🔮 |
| Predictive health risk scoring | 🔮 |
| Drug inventory forecasting for village clinics | 🔮 |
| ABDM (Ayushman Bharat Digital Mission) integration | 🔮 |
| Multi-state rollout with protocol customization | 🔮 |

<br>

---

## 💼 Business Model

### Market Opportunity

India's **public health IT market** is **$2.1B** growing at **15% CAGR**. Rural health technology has **<5% digital penetration** — the largest underserved segment in Indian healthcare.

### Stakeholders

| Who | Why They Adopt |
|:----|:---------------|
| **🏥 PHCs & Hospitals** | Reduce paperwork, AI-assisted triage, closed-loop referrals |
| **🤝 NGOs** | Grant-proof impact analytics, program outcome tracking |
| **🏛️ District Health Officers** | Real-time outbreak radar, CMO-ready reports, compliance |
| **👩‍⚕️ ASHA Workers** | Replace paper registers, offline support, voice input |
| **🧑‍⚕️ Patients** | AI triage access, scheme awareness, emergency SOS |
| **📋 Government** | Population health intelligence, policy decision support |

### Pricing

| Tier | Customer | Price | Includes |
|:-----|:---------|:------|:---------|
| **🌱 NGO Starter** | Community health orgs | **Free** | Core features, up to 1,000 patients |
| **🏥 District Command** | CMO offices, district hospitals | **₹15,000/mo** | Full outbreak AI, analytics, reports |
| **🏛️ State Enterprise** | State health missions | **Custom** | Multi-district, customization, SLA |

### Go-to-Market

```
Direct Outreach  →  NGO Partnerships  →  State RFPs  →  National Platform
(District Health    (PSI, CARE India)    (GeM Portal)    (MoHFW)
 Officers)
```

### Competitive Moat

1. **Offline-first** — competitors require always-on connectivity
2. **Edge-to-cloud hybrid AI** — runs in-browser AND server-side
3. **11 specialized agents** — orchestrated team, not a single model
4. **Autonomous outbreak detection** — no competitor has this
5. **Dual-database design** — Aurora (ACID) + DynamoDB (scale)
6. **243 WHO/MoHFW grounded guidelines** — clinical depth unmatched

> Full strategy, competitive analysis, and financial projections: [`docs/BUSINESS.md`](docs/BUSINESS.md)

<br>

---

## 👤 Team

<p align="center">
  <table>
    <tr>
      <td width="120" valign="top" align="center">
        <img src="https://github.com/tejshveeyerpurwad-hash.png" width="100" style="border-radius: 12px;">
      </td>
      <td valign="top">
        <h3>Tejshvini Yerpurwad</h3>
        <p><em>Founder & AI Engineer</em></p>
        <p>Building AI-powered healthcare infrastructure for rural India.</p>
        <p>
          • B.Tech CSE (AI & ML)<br>
          • Founder of MediFlow AI<br>
          • National Finalist – MBBQ 2026
        </p>
        <p>
          <a href="https://github.com/tejshveeyerpurwad-hash"><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github" alt="GitHub"></a>
          <a href="https://www.linkedin.com/in/tejshvini-yerpurwad-382aa3314"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin" alt="LinkedIn"></a>
        </p>
      </td>
    </tr>
  </table>
</p>

<br>

---

## 🤝 Contributing

We welcome contributions from engineers, designers, healthcare professionals, and rural health advocates.

**Ways to contribute:**
- 🐛 Report bugs: [GitHub Issues](https://github.com/tejshveeyerpurwad-hash/mediflow-ai-agent/issues)
- 💡 Suggest features or improvements
- 🌐 Help with translations
- 📝 Improve documentation
- 🧪 Add tests
- 🔧 Submit pull requests

See [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) for guidelines and code of conduct.

<br>

---

## 📄 License

**GNU Affero General Public License v3.0** — see [`LICENSE`](LICENSE) for full terms.

```
Copyright (c) 2026 Tejshvini Yerpurwad

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
```

<br>

---

<p align="center">
  <a href="https://mediflow-ai-olive.vercel.app"><img src="https://img.shields.io/badge/Live_Demo-Vercel-000?style=flat-square&logo=vercel" alt="Demo"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-AGPLv3-8A2BE2?style=flat-square" alt="License"></a>
  <a href="https://github.com/tejshveeyerpurwad-hash/mediflow-ai-agent"><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github" alt="GitHub"></a>
  <a href="docs/ARCHITECTURE.md"><img src="https://img.shields.io/badge/Docs-6366f1?style=flat-square&logo=readthedocs" alt="Docs"></a>
  <a href="https://github.com/tejshveeyerpurwad-hash/mediflow-ai-agent/issues"><img src="https://img.shields.io/badge/Issues-ef4444?style=flat-square&logo=githubissues" alt="Issues"></a>
</p>

<p align="center">
  <strong>Built by Tejshvini Yerpurwad</strong><br>
  <em>AI for Rural Healthcare · MediFlow AI</em>
</p>

<p align="center">
  <a href="#-table-of-contents">↑ Back to Top</a>
</p>
