<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/logo.png">
    <img alt="MediFlow AI" src="assets/logo.png" width="120">
  </picture>

  <h1>MediFlow AI</h1>
  <h3>AI Healthcare Navigation &bull; Patient Care Coordination &bull; Offline-First Intelligence</h3>

  <p><em>Multi-Agent AI orchestrating healthcare for 600M rural citizens — from symptom to specialist, online and off.</em></p>

  <br>

  <a href="https://mediflow-ai-olive.vercel.app"><img src="https://img.shields.io/badge/Live_Demo-Mediflow_AI-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo"></a>
  <a href="#-product-preview"><img src="https://img.shields.io/badge/Preview-Screenshots-6366f1?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Screenshots"></a>
  <a href="docs/ARCHITECTURE.md"><img src="https://img.shields.io/badge/Architecture-Mermaid-22c55e?style=for-the-badge&logo=diagramsdotnet&logoColor=white" alt="Architecture"></a>
  <a href="docs/AI.md"><img src="https://img.shields.io/badge/AI-Models-8b5cf6?style=for-the-badge&logo=openai&logoColor=white" alt="AI Models"></a>
  <a href="https://render.com/deploy?repo=https://github.com/tejshveeyerpurwad-hash/mediflow-ai-agent"><img src="https://img.shields.io/badge/Deploy-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Deploy"></a>

  <br>
  <br>

  <p>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-AGPLv3-8A2BE2?style=flat-square" alt="License"></a>
    <a href="#"><img src="https://img.shields.io/badge/Version-2.0.0-000?style=flat-square" alt="Version"></a>
    <a href="https://mediflow-api-opal.vercel.app/api/health"><img src="https://img.shields.io/endpoint?url=https%3A%2F%2Fmediflow-api-opal.vercel.app%2Fapi%2Fhealth&style=flat-square&label=Backend&color=22c55e" alt="Backend"></a>
    <a href="#"><img src="https://img.shields.io/badge/Build-Passing-22c55e?style=flat-square&logo=githubactions" alt="Build"></a>
    <a href="#"><img src="https://img.shields.io/badge/PWA-Enabled-6366f1?style=flat-square&logo=pwa" alt="PWA"></a>
    <a href="#"><img src="https://img.shields.io/badge/Coverage-7_Languages-FF6F00?style=flat-square" alt="Languages"></a>
    <a href="#"><img src="https://img.shields.io/badge/Diseases-101-ef4444?style=flat-square" alt="Diseases"></a>
    <a href="#"><img src="https://img.shields.io/badge/Offline-First-00C853?style=flat-square" alt="Offline"></a>
    <a href="https://github.com/tejshveeyerpurwad-hash/mediflow-ai-agent"><img src="https://img.shields.io/github/stars/tejshveeyerpurwad-hash/mediflow-ai-agent?style=flat-square&logo=github&label=Stars" alt="Stars"></a>
  </p>
</div>

<br>

---

## 📋 Table of Contents

<details open>
<summary><strong>Expand / Collapse</strong></summary>

<br>

| Section | Description |
|---------|------------|
| [🚀 Executive Summary](#-executive-summary) | The problem, solution, and impact in 30 seconds |
| [❓ The Problem](#-the-problem) | Why rural healthcare is broken |
| [💡 The Solution](#-the-solution) | How MediFlow AI fixes it |
| [⭐ Why MediFlow AI is Different](#-why-mediflow-ai-is-different) | Key innovations & differentiators |
| [🏗️ System Architecture](#%EF%B8%8F-system-architecture) | Services, data flow, AI pipeline |
| [🔁 Product Workflow](#-product-workflow) | End-to-end patient journey |
| [🤖 AI Capabilities](#-ai-capabilities) | Models, pipelines, safety |
| [📸 Product Preview](#-product-preview) | Screenshots & walkthrough |
| [✨ Features](#-features) | Everything the platform does |
| [🛠️ Tech Stack](#%EF%B8%8F-tech-stack) | Every component & why |
| [📦 Installation](#-installation) | Docker, local, production |
| [📁 Project Structure](#-project-structure) | What goes where |
| [🔒 Security & Privacy](#-security--privacy) | Compliance, encryption, audit |
| [📈 Scalability](#-scalability) | From one village to the nation |
| [🗺️ Roadmap](#%EF%B8%8F-roadmap) | Now, Next, Future |
| [💼 Business Model](#-business-model) | Market, pricing, GTM |
| [👤 Founder](#-founder) | The team behind MediFlow AI |
| [🤝 Contributing](#-contributing) | How to help |
| [📄 License](#-license) | AGPLv3 |

</details>

<br>

---

## 🚀 Executive Summary

### The crisis

**600 million people** in rural India lack access to quality healthcare. **1.4 million ASHA workers** — the backbone of rural public health — manage patient records with **paper registers**. Meanwhile, **27 million pregnancies** occur annually in villages where the nearest doctor is hours away.

Existing digital health solutions fail because they assume reliable internet, English literacy, and modern smartphones. In rural India, none of these are guaranteed.

### The solution

**MediFlow AI** is an **offline-first, multi-agent AI platform** that transforms how healthcare reaches rural communities.

<p align="center">
  <table>
    <tr>
      <td align="center">🧠 <strong>Multi-Agent AI</strong><br>11 specialized agents orchestrate care</td>
      <td align="center">📡 <strong>Offline-First</strong><br>Works without internet</td>
      <td align="center">🗣️ <strong>7 Languages</strong><br>Voice + text in local languages</td>
    </tr>
    <tr>
      <td align="center">🚑 <strong>Emergency Intelligence</strong><br>GPS dispatch + WebSocket tracking</td>
      <td align="center">📊 <strong>District Command</strong><br>Real-time outbreak radar</td>
      <td align="center">🔒 <strong>Privacy by Design</strong><br>DISHA + DPDP Act compliant</td>
    </tr>
  </table>
</p>

### The impact

From a **villager's symptom** to a **district health officer's outbreak dashboard**, MediFlow AI creates a closed loop:

```
Patient Symptom → AI Triage → ASHA Worker → PHC Referral → Specialist → District Analytics → Government Policy
                                                                                                        ↑
                                                                                             Offline? No problem.
                                                                                      Everything syncs when connected.
```

> **"We didn't build AI for doctors in cities. We built it for the villages that don't have one."**

<br>

---

## ❓ The Problem

Rural India's healthcare crisis is a system failure, not a resource failure. The tools available today assume urban infrastructure — and that assumption costs lives.

<div align="center">
  <table>
    <tr>
      <td width="50%" valign="top">
        <h4>🏥 <strong>Access</strong></h4>
        <p><strong>600M</strong> people lack nearby specialists</p>
        <p><em>Rural mortality rates are 2–3× higher than urban</em></p>
      </td>
      <td width="50%" valign="top">
        <h4>📡 <strong>Connectivity</strong></h4>
        <p><strong>>65%</strong> of rural India has unreliable internet</p>
        <p><em>Digital health tools fail at the point of care</em></p>
      </td>
    </tr>
    <tr>
      <td width="50%" valign="top">
        <h4>📋 <strong>Paper Burden</strong></h4>
        <p><strong>1.4M</strong> ASHA workers use paper registers</p>
        <p><em>40% of working hours lost to manual paperwork</em></p>
      </td>
      <td width="50%" valign="top">
        <h4>🤰 <strong>Maternal Health</strong></h4>
        <p><strong>27M</strong> pregnancies/year in rural areas</p>
        <p><em>India accounts for 12% of global maternal deaths</em></p>
      </td>
    </tr>
    <tr>
      <td width="50%" valign="top">
        <h4>🚑 <strong>Emergency</strong></h4>
        <p>No coordinated ambulance dispatch in villages</p>
        <p><em>The golden hour window is routinely missed</em></p>
      </td>
      <td width="50%" valign="top">
        <h4>🦟 <strong>Surveillance</strong></h4>
        <p>Outbreaks detected <strong>weeks late</strong>, if at all</p>
        <p><em>Preventable epidemics spread to urban centers</em></p>
      </td>
    </tr>
    <tr>
      <td width="50%" valign="top">
        <h4>📜 <strong>Scheme Access</strong></h4>
        <p><strong>20+</strong> national health schemes, <strong><30%</strong> awareness</p>
        <p><em>Billions in allocated funds go unutilized</em></p>
      </td>
      <td width="50%" valign="top">
        <h4>🌐 <strong>Language</strong></h4>
        <p><strong>22</strong> official languages; most apps support 1–2</p>
        <p><em>Frontline workers cannot use English-only tools</em></p>
      </td>
    </tr>
  </table>
</div>

**The gap:** Existing telemedicine platforms assume reliable connectivity, modern smartphones, and English literacy — none of which reflect ground reality in rural India.

<br>

---

## 💡 The Solution

MediFlow AI replaces fragmented paper-based workflows with a **unified, offline-first, AI-powered platform** that connects every stakeholder:

<p align="center">
  <img src="https://img.shields.io/badge/Patient-0A9C6E?style=for-the-badge" alt="Patient">
  <img src="https://img.shields.io/badge/↔-000000?style=for-the-badge" alt="↔">
  <img src="https://img.shields.io/badge/ASHA_Worker-0EA5E9?style=for-the-badge" alt="ASHA">
  <img src="https://img.shields.io/badge/↔-000000?style=for-the-badge" alt="↔">
  <img src="https://img.shields.io/badge/PHC_Doctor-8B5CF6?style=for-the-badge" alt="Doctor">
  <img src="https://img.shields.io/badge/↔-000000?style=for-the-badge" alt="↔">
  <img src="https://img.shields.io/badge/District_Command-F59E0B?style=for-the-badge" alt="District">
  <img src="https://img.shields.io/badge/↔-000000?style=for-the-badge" alt="↔">
  <img src="https://img.shields.io/badge/Government-EF4444?style=for-the-badge" alt="Government">
</p>

| Component | What It Does | Works Offline |
|:----------|:-------------|:-------------:|
| **🧑‍⚕️ Patient App** | AI symptom checker, SOS dispatch, health records, scheme eligibility, hospital locator | ✅ Yes |
| **👩‍⚕️ ASHA Portal** | Triage queue (P1–P4), maternal tracking, child nutrition, referral management | ✅ Yes |
| **🏥 District Dashboard** | Live outbreak radar, AI intelligence, system health, SSE alerts, CSV reports | ✅ Yes* |
| **🤖 AI Services** | 11 specialized agents: intake, triage, OCR, summaries, care coordination, medication safety, hospital recommendations, appointments, doctor copilot, emergency, follow-up | ❌ Online |
| **🔌 Backend API** | REST + WebSocket + SSE, JWT auth, event dispatch, sync reconciliation | ❌ Online |
| **☁️ Cloud Infra** | Aurora PostgreSQL (ACID), DynamoDB (telemetry), Groq LLM, Bedrock | ❌ Online |

*\* Dashboard caches last-known state for offline viewing*

<br>

---

## ⭐ Why MediFlow AI is Different

### 🧠 Multi-Agent Intelligence
While most health apps use a single AI model, MediFlow AI deploys **11 specialized AI agents** that work together like a clinical team:

| Agent | Role |
|:------|:-----|
| **Patient Intake** | Collects symptoms, medical history, and demographics |
| **Medical Record Agent** | Manages structured health records |
| **OCR Agent** | Extracts data from prescriptions and lab reports |
| **Medical Summary** | Generates clinical summaries for referrals |
| **Care Coordinator** | Plans treatment pathways and follow-ups |
| **Medication Safety** | Checks drug interactions and allergies |
| **Hospital Recommender** | Finds nearest appropriate facility |
| **Appointment Scheduler** | Books and manages appointments |
| **Doctor Copilot** | Provides AI-assisted differential diagnosis |
| **Emergency Agent** | Triages emergencies and dispatches ambulances |
| **Follow-Up Agent** | Schedules and tracks post-care follow-ups |

### 📡 Offline-First Architecture
- **ONNX inference** runs symptom checking directly in the browser — no internet needed
- **IndexedDB transactional queue** ensures zero data loss when offline
- **Local RAG cache** provides clinical guidance without network calls
- **Automatic sync** when connectivity returns — no manual intervention

### 🚑 Emergency Intelligence
- **One-tap SOS** triggers ambulance dispatch with GPS coordinates
- **WebSocket telemetry** tracks ambulance location in real time
- **P1 priority routing** ensures critical cases reach care first
- **Government 108 fallback** when app-based dispatch isn't available

### 🗣️ Voice AI & Multilingual
- **7 Indian languages** — Hindi, Marathi, Tamil, Telugu, Bengali, English + Hinglish
- **Speech synthesis** for low-literacy users
- **Voice input** for hands-free operation during village visits

### 📊 District Command Center
- **Autonomous outbreak agent** scans clinical data every 30 minutes
- **LLM-powered reasoning** with confidence scores and trace IDs
- **Real-time SSE broadcasts** for instant alerting
- **CMO-ready CSV reports** for compliance and policy

### 🔒 Privacy by Design
- **DISHA 2023 consent modal** before any data collection
- **DPDP Act 2023** PII redaction in all logging
- **Aadhaar SHA-256 salted hashing** — no plaintext storage
- **Village-scoped IDOR controls** — workers only see their village data

<br>

---

## 🏗️ System Architecture

### High-Level Architecture

```mermaid
flowchart TB
    subgraph Frontend["Frontend — Vercel"]
        PWA["React PWA<br/>Vite + Tailwind + PWA"]
        ONNX["ONNX Runtime<br/>Browser Inference"]
        IDB["IndexedDB<br/>Offline Queue"]
        LRAG["Local RAG Cache"]
    end

    subgraph Backend["Backend — Express.js"]
        API["REST API<br/>JWT + Helmet + Rate Limit"]
        WS["WebSocket Server<br/>Telemetry + Alerts"]
        SSE["SSE Broadcast<br/>Real-time Events"]
        EVENT["Event Dispatcher<br/>Async Processing"]
    end

    subgraph AI["AI Service — FastAPI"]
        AGENT["Agent Orchestrator<br/>11 Specialized Agents"]
        SNET["SymptomNet<br/>MLP Classifier"]
        RAG["Sakhi RAG<br/>243 Guideline Chunks"]
        OA["Outbreak Agent<br/>30-min Autonomous Loop"]
        SKIN["Skin Analyzer<br/>CNN-based Triage"]
    end

    subgraph Storage["Storage Layer"]
        PG[("Aurora PostgreSQL<br/>ACID Compliance")]
        DDB[("DynamoDB<br/>High-Throughput")]
        SQLITE[("SQLite<br/>Dev Fallback")]
    end

    subgraph AIProviders["AI Providers"]
        GROQ["Groq<br/>Llama-3.3-70B"]
        BEDROCK["AWS Bedrock<br/>Claude Sonnet"]
        MOCK["Mock Provider<br/>Offline Fallback"]
    end

    PWA -->|"REST + WS"| API
    PWA --> ONNX
    PWA --> IDB
    PWA --> LRAG
    API --> EVENT
    API --> WS
    API --> SSE
    EVENT --> PG
    EVENT --> DDB
    API --> AI
    AI --> AGENT
    AGENT --> SNET
    AGENT --> RAG
    AGENT --> OA
    AGENT --> SKIN
    AGENT --> GROQ
    AGENT --> BEDROCK
    AGENT --> MOCK
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
    F->>F: ONNX inference<br/>(if offline)
    F->>B: Submit symptoms
    B->>A: Route to Agent Orchestrator
    A->>A: Patient Intake Agent
    A->>A: Medical Summary Agent
    A->>A: Care Coordinator Agent
    A-->>B: Care plan + recommendations
    B-->>F: Triage result + next steps
    F-->>P: Show in local language

    alt Emergency detected
        B->>B: Trigger SOS dispatch
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

### AI Agent Pipeline

```mermaid
flowchart LR
    subgraph Input["Input Layer"]
        TEXT["Text Symptoms"]
        IMAGE["Prescription Image"]
        VITALS["Vital Signs"]
        HISTORY["Medical History"]
    end

    subgraph Agents["Agent Layer"]
        PI["Patient Intake"]
        MR["Medical Record"]
        OCR["OCR Extraction"]
        MS["Medical Summary"]
        CC["Care Coordinator"]
    end

    subgraph Safety["Safety Layer"]
        GUARD["Clinical Guardrails"]
        CONSENT["DISHA Consent"]
        CONF["Confidence Check"]
        FALLBACK["Rule-based Fallback"]
    end

    subgraph Output["Output Layer"]
        TRIAGE["Triage Level P1-P4"]
        PLAN["Care Pathway"]
        REFER["Referral"]
        MEDS["Medication Check"]
        FOLLOW["Follow-up Plan"]
    end

    Input --> Agents
    Agents --> Safety
    Safety --> Output
```

<br>

---

## 🔁 Product Workflow

```mermaid
flowchart TD
    subgraph Patient_Journey["Patient Journey"]
        A1["👤 Patient<br/>Reports Symptoms"] --> A2["🤖 AI Triage<br/>SymptomNet + Agents"]
        A2 --> A3{"Emergency?"}
        A3 -->|"Yes 🚨"| A4["🚑 SOS Dispatch<br/>GPS + WebSocket"]
        A3 -->|"No"| A5["📋 Care Plan<br/>Triage + Recommendations"]
    end

    subgraph ASHA_Workflow["ASHA Workflow"]
        B1["👩‍⚕️ ASHA Worker<br/>Receives Alert"] --> B2["📱 Triage Feed<br/>P1-P4 Priority"]
        B2 --> B3["🤰 Maternal Check<br/>WHO Protocol"]
        B2 --> B4["👶 Child Nutrition<br/>Z-Score Assessment"]
        B2 --> B5["📝 Referral<br/>to PHC / Doctor"]
    end

    subgraph Clinical["Clinical Loop"]
        C1["🏥 PHC Doctor<br/>Receives Referral"] --> C2["💊 Treatment<br/>Prescription + Advice"]
        C2 --> C3["🔄 Follow-up<br/>Scheduled by AI Agent"]
        C3 --> C4["📊 Outcome<br/>Recorded in System"]
    end

    subgraph Command["District Command"]
        D1["📡 Outbreak Radar<br/>30-min AI Scan"] --> D2["🦟 Alert Detection<br/>LLM Reasoning"]
        D2 --> D3["📢 SSE Broadcast<br/>Real-time Alert"]
        D3 --> D4["📈 CMO Report<br/>Auto-generated CSV"]
    end

    A5 --> B1
    B5 --> C1
    C4 --> D1
    D4 --> E1["🏛️ Government<br/>Policy Decisions"]
```

<br>

---

## 🤖 AI Capabilities

### Model Pipeline

MediFlow AI uses a **tiered diagnostic ensemble** designed for clinical safety — never guessing when uncertain, always falling back to verified protocols.

```
                 ┌─────────────────────────────────────┐
                 │         Symptom Input                │
                 │    (Text / Voice / 7 Languages)       │
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

| Capability | Model | Accuracy | Offline |
|:-----------|:------|:--------:|:-------:|
| **Symptom Classification** | SymptomNet (MLP) + Logistic Regression | 71.1% (101 classes) | ✅ ONNX |
| **Skin Disease Detection** | CNN-based image analysis | Clinical-grade | ❌ |
| **Risk Analysis** | WHO protocol + ML confidence | 100% protocol adherence | ✅ |
| **RAG Assistant** | Sakhi — 243 guideline chunks + Groq Llama-3.3-70B | F1=1.00 @ 0.45 threshold | ❌ |
| **Outbreak Detection** | Autonomous agent + Groq LLM | 30-min cycle | ❌ |
| **Voice AI** | SpeechSynthesis + Groq streaming | 7 languages | ✅ |
| **Medication Safety** | Drug interaction agent | Clinical-grade | ❌ |
| **Doctor Copilot** | Multi-agent differential diagnosis | AI-assisted | ❌ |

### RAG Pipeline (Sakhi Assistant)

```mermaid
flowchart LR
    Q["User Question"] --> E["Embedding<br/>MiniLM-L12-v2"]
    E --> S["Vector Search<br/>243 Chunks"]
    S --> R["Retrieval<br/>Threshold ≥0.45"]
    R --> C["Context<br/>WHO/MoHFW Guidelines"]
    C --> L["LLM<br/>Groq Llama-3.3-70B"]
    L --> O["Grounded Response<br/>+ Source Citations"]
    L --> G["Guardrail<br/>Clinical Safety Check"]
```

### Guardrails & Safety

- **No diagnosis claims** — the system always says "consult a healthcare provider"
- **Confidence floor** — below 40%, the system refuses to guess
- **Conservative triage** — always errs toward higher acuity
- **DISHA consent gate** — no data collected without explicit permission
- **All responses cite sources** — WHO guideline sections included in every answer
- **Trace IDs** — every AI decision is logged with a unique trace for audit

<br>

---

## 📸 Product Preview

### 1️⃣ Patient Experience

| Welcome & Onboarding | Health Dashboard |
|:--------------------:|:----------------:|
| <img src="assets/screenshots/01-welcome.png" width="300" alt="Welcome"> | <img src="assets/screenshots/05-patient-dashboard.png" width="300" alt="Dashboard"> |
| Multi-language onboarding with role-based entry | Personalized health score + quick-access services |

### 2️⃣ AI-Powered Healthcare

| AI Symptom Checker | Privacy & Consent |
|:------------------:|:-----------------:|
| <img src="assets/screenshots/02-features.png" width="300" alt="AI Features"> | <img src="assets/screenshots/04-privacy.png" width="300" alt="Consent"> |
| 101 diseases across 7 languages | DISHA-compliant data consent flow |

| Medical Records & OCR | Medical Timeline |
|:--------------------:|:----------------:|
| Upload prescriptions for AI extraction | Chronological patient history |

### 3️⃣ ASHA Worker Portal

| Registration | Dashboard |
|:-----------:|:---------:|
| <img src="assets/screenshots/03-registration.png" width="300" alt="Registration"> | <img src="assets/screenshots/07-asha-dashboard.png" width="300" alt="ASHA"> |
| Offline-capable villager registration | Unified triage feed P1–P4 |

### 4️⃣ Women's Health

| Pregnancy Tracking |
|:-----------------:|
| <img src="assets/screenshots/06-women-health.png" width="300" alt="Women's Health"> |
| WHO-protocol trimester management |

### 5️⃣ District Command Center

| Outbreak Radar | Analytics |
|:-------------:|:---------:|
| <img src="assets/screenshots/08-district-dashboard.png" width="300" alt="District Dashboard"> |
| Live heatmaps + AI intelligence + System health |

### 6️⃣ Multi-Agent Pages (New)

| Care Coordination | Doctor Copilot | Medication Safety |
|:-----------------:|:--------------:|:-----------------:|
| Kanban board for patient triage | AI-assisted diagnosis | Drug interaction checker |

| Hospital Locator | Appointment Scheduler | Follow-Up Management |
|:----------------:|:--------------------:|:--------------------:|
| Nearest facility finder | Calendar + QR confirmation | Automated care plans |

<br>

---

## ✨ Features

### 🤖 AI & Intelligence

| Feature | Description |
|:--------|:------------|
| **Multi-Agent Orchestrator** | 11 specialized AI agents working in concert for end-to-end care |
| **AI Symptom Checker** | 101 diseases, 7 languages, hybrid DL+ML ensemble |
| **Doctor Copilot** | AI-assisted differential diagnosis for clinicians |
| **Medical Record OCR** | Extract structured data from prescription images |
| **Care Coordinator** | Automated care pathway planning and tracking |
| **Medication Safety Check** | Drug interaction detection and alternative suggestions |
| **Hospital Recommendation** | Nearest appropriate facility based on condition |
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
| **Government 108 Fallback** | Integration with national emergency number |
| **Offline Emergency Mode** | SOS works without internet connection |

### 👩‍⚕️ ASHA & Clinical Workflow

| Feature | Description |
|:--------|:------------|
| **Unified Triage Feed** | P1–P4 priority queue for daily workflow |
| **Maternal Health Tracking** | WHO-protocol trimester management |
| **Child Nutrition Assessment** | WHO Z-score classification (SAM/MAM/Normal) |
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

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| **Frontend** | React 18 + Vite 5 + Tailwind CSS 3 | Offline-first PWA with glassmorphism design |
| **Animation** | Framer Motion 12 | Fluid transitions and micro-interactions |
| **Maps** | Leaflet + React-Leaflet | Geospatial health visualization |
| **Charts** | Recharts | Analytics and health metrics |
| **Icons** | Lucide React | Consistent iconography across the platform |
| **Backend** | Node.js 22 + Express 4 | REST API with cluster mode and WebSocket |
| **Auth** | JWT + bcryptjs + Helmet | Secure authentication with rate limiting |
| **Validation** | Zod 4 | Runtime type safety and input validation |
| **AI Runtime** | FastAPI + Python 3.11 | High-performance async AI inference |
| **ML Models** | scikit-learn + ONNX | Disease classification with browser inference |
| **LLM** | Groq Llama-3.3-70B + AWS Bedrock | RAG chatbot + outbreak intelligence |
| **RAG** | Sentence Transformers | Multilingual embeddings for clinical guidelines |
| **Database** | Aurora PostgreSQL | ACID-compliant clinical records |
| **Telemetry** | DynamoDB | High-throughput event streams |
| **Dev DB** | SQLite + better-sqlite3 | Zero-config local development |
| **Hosting** | Vercel + Render | Serverless frontend + containerized backend |

<br>

---

## 📦 Installation

### 🚀 Quick Start — Docker

```bash
# Clone the repository
git clone https://github.com/tejshveeyerpurwad-hash/mediflow-ai-agent.git
cd mediflow-ai-agent

# Configure environment
cp .env.example .env
# Edit .env with your API keys (GROQ_API_KEY required for AI features)

# Launch all services
docker-compose up --build
```

| Service | URL | Health Check |
|:--------|:----|:-------------|
| Frontend | `http://localhost` | SPA via Nginx |
| Backend API | `http://localhost:5000` | `GET /api/health` |
| AI Service | `http://localhost:8000` | `GET /health` |

### 🔧 Manual Setup

#### Prerequisites

- Node.js 22+
- Python 3.11+
- npm 10+

#### 1. AI Service (start first)

```bash
cd ai-service
pip install -r requirements.txt
python generate_dataset.py
python train_disease_model.py
uvicorn main:app --reload --port 8000
```

#### 2. Backend

```bash
cd backend
cp .env.example .env
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

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

**Already deployed:**
- **Frontend:** [https://mediflow-ai-olive.vercel.app](https://mediflow-ai-olive.vercel.app)
- **Backend API:** [https://mediflow-api-opal.vercel.app](https://mediflow-api-opal.vercel.app)

**One-click Render (backend + AI service):**

[![Deploy to Render](https://img.shields.io/badge/Deploy_to_Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/deploy?repo=https://github.com/tejshveeyerpurwad-hash/mediflow-ai-agent)

### 🔐 Environment Variables

```bash
# ── Required ──────────────────────────────────────────
JWT_SECRET=<generate-random-32-char-string>
AADHAAR_SALT=<generate-random-32-char-string>
AGENT_SECRET=<generate-random-32-char-string>
GROQ_API_KEY=gsk_your_groq_api_key     # Get at console.groq.com
ADMIN_PASSCODE=<your-admin-passcode>

# ── AWS (production only) ─────────────────────────────
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=<iam-key>
AWS_SECRET_ACCESS_KEY=<iam-secret>
DATABASE_URL=postgresql://user:pass@host:5432/mediflow

# ── Optional ──────────────────────────────────────────
ALLOWED_ORIGINS=http://localhost:5173,https://mediflow-ai-olive.vercel.app
ENABLE_DEEP_MODEL=true                  # Requires ~500MB RAM
NODE_CLUSTER_WORKERS=1                  # Increase for multi-core
```

#### Deployment Checklist

- [ ] Generate unique secrets: `JWT_SECRET`, `AADHAAR_SALT`, `AGENT_SECRET`
- [ ] Provision Aurora PostgreSQL cluster (ap-south-1) for production
- [ ] Create 5 DynamoDB tables with GSIs for telemetry
- [ ] Create IAM user with `AmazonDynamoDBFullAccess`
- [ ] Deploy AI Service first, note its URL
- [ ] Deploy Backend with `AI_SERVICE_URL` pointing to AI Service
- [ ] Run seed script to populate initial data
- [ ] Verify `GET /api/health` returns all services online
- [ ] Deploy Frontend with `VITE_API_URL` pointing to backend
- [ ] **Never** set `ALLOW_DEMO_OTP` in production

<br>

---

## 📁 Project Structure

```
mediflow-ai-agent/
│
├── frontend/                         # React + Vite PWA (Vercel)
│   ├── src/
│   │   ├── pages/                    # 30+ page components
│   │   │   ├── PatientTimeline.jsx   # Medical history timeline
│   │   │   ├── MedicalRecordsPage.jsx # OCR document upload
│   │   │   ├── CareCoordinationPage.jsx # Kanban triage board
│   │   │   ├── MedicationSafetyPage.jsx # Drug interaction checker
│   │   │   ├── HospitalRecommendPage.jsx # Facility finder
│   │   │   ├── AppointmentPage.jsx   # Scheduler with calendar
│   │   │   └── DoctorDashboard.jsx   # AI copilot for clinicians
│   │   ├── components/               # Reusable UI components
│   │   ├── services/                 # API + agent service clients
│   │   ├── context/                  # Auth, language, voice state
│   │   └── hooks/                    # Custom React hooks
│   ├── public/                       # PWA manifest, icons
│   └── vercel.json                   # Vercel deployment config
│
├── backend/                          # Express.js API (Render/Vercel)
│   ├── app.js                        # Express app (for Vercel serverless)
│   ├── server.js                     # Server entry (app.listen + WebSocket)
│   ├── routes/                       # Auth, villager, NGO, admin, agents, webhooks
│   ├── middleware/                    # JWT auth, IDOR policy, audit logging
│   ├── db/                           # Schema, migrations, seed data
│   └── utils/                        # Sanitizer, validators, helpers
│
├── ai-service/                       # FastAPI AI (Render/Docker)
│   ├── main.py                       # API endpoints + multi-agent routes
│   ├── agents/                       # 11 specialized AI agents
│   │   ├── orchestrator.py           # Agent routing + provider selection
│   │   ├── base.py                   # Abstract agent base class
│   │   └── providers/               # Groq, Bedrock, Mock LLM providers
│   ├── rag_service.py                # Sakhi RAG engine (243 chunks)
│   ├── outbreak_agent.py             # Autonomous 30-min outbreak scanner
│   └── model_def.py                  # SymptomNet MLP architecture
│
├── api/                              # Vercel serverless function
│   └── index.js                      # Imports backend/app.js
│
├── docs/                             # Comprehensive documentation
│   ├── ARCHITECTURE.md               # System design
│   ├── AI.md                         # AI methodology
│   └── API.md                        # API reference
│
├── assets/                           # Logos, screenshots, media
├── infra/                            # Infrastructure specs
├── docker-compose.yml                # Multi-service orchestration
├── render.yaml                        # Render Blueprint config
├── DEPLOYMENT.md                      # Production deployment guide
└── .env.example                       # Environment variable template
```

<br>

---

## 🔒 Security & Privacy

### Compliance Framework

| Standard | Implementation |
|:---------|:---------------|
| **📜 DISHA 2023** | Active consent modal gate before any data collection |
| **🛡️ DPDP Act 2023** | Automated PII redaction in all logging layers |
| **⚖️ IT Act 2008** | JWT + role-based and village-scoped IDOR controls |
| **🏥 HIPAA Aligned** | TLS 1.3, Helmet.js headers, security audit logging |
| **🌍 WHO / MoHFW** | 243 clinical guideline chunks in RAG knowledge base |

### Security Measures

```
🔐 Authentication
├── JWT with configurable expiry
├── bcryptjs password hashing
├── Phone OTP + Aadhaar QR verification
├── 3-attempt exponential backoff lockout
└── Session timeout with idle detection

🔒 Data Protection
├── Aadhaar SHA-256 salted hashing
├── TLS 1.3 for all network traffic
├── AWS KMS encryption at rest
├── Non-root Docker containers
└── .env secrets never committed

📋 Audit & Monitoring
├── Every request has a unique trace ID
├── Structured JSON logging with PII redaction
├── Rate limiting: 100 req/min per IP
├── Helmet.js OWASP security headers
└── DISHA consent stored per device per user
```

<br>

---

## 📈 Scalability

MediFlow AI is architected to scale from a single village to the entire nation:

```mermaid
flowchart LR
    subgraph Village["One Village"]
        V["🏘️<br/>Village"]
        P["📱 Patients"]
        A["👩‍⚕️ ASHA"]
    end

    subgraph Block["Block Level"]
        B["🏥 PHC"]
        D["👨‍⚕️ Doctor"]
    end

    subgraph District["District Level"]
        DC["📊 Command Center"]
        DH["🏛️ CMO Office"]
    end

    subgraph State["State Level"]
        SH["🏥 State NHM"]
        SP["📋 Policy"]
    end

    subgraph National["National Level"]
        NM["🏛️ MoHFW"]
        ND["📈 National Dashboard"]
    end

    Village --> Block
    Block --> District
    District --> State
    State --> National
```

| Scale | Capability |
|:------|:-----------|
| **🏘️ Village** | Offline-first PWA, no internet required, local AI inference |
| **🏥 Block (PHC)** | Aggregated patient data, referral management, doctor copilot |
| **📊 District** | Outbreak radar, AI intelligence, CMO reports, SSE alerts |
| **🏛️ State** | Multi-district aggregation, NHM integration, compliance reporting |
| **🇮🇳 National** | Population health analytics, policy intelligence, national dashboard |

<br>

---

## 🗺️ Roadmap

### ✅ Now — Foundation

| Status | Milestone |
|:------:|:----------|
| ✅ | Hybrid AI diagnostic engine (101 diseases, 7 languages) |
| ✅ | Offline-first sync with IndexedDB transactional queue |
| ✅ | 11 specialized multi-agents for end-to-end care |
| ✅ | Autonomous outbreak radar (30-min LLM agent loop) |
| ✅ | Maternal & child health modules (WHO protocol) |
| ✅ | District command center with SSE live updates |
| ✅ | Government scheme eligibility engine (20+ schemes) |
| ✅ | OCR prescription extraction |
| ✅ | Medication safety checker |
| ✅ | Doctor copilot with differential diagnosis |
| ✅ | B2B multi-tenant architecture with IDOR isolation |

### 🔄 Next — Scale (Q3 2026)

| Status | Milestone |
|:------:|:----------|
| ⏳ | Native Android app with offline-first SDK |
| ⏳ | Integration with state NHM databases |
| ⏳ | WhatsApp-based health assistant for feature phones |
| ⏳ | Full voice interface in 7 languages |
| ⏳ | Real-time ambulance fleet tracking with ETA |
| ⏳ | Automated MoHFW compliance reporting |
| ⏳ | Tele-radiology with AI triage |

### 🔮 Future — Intelligence (Q4 2026–2027)

| Status | Milestone |
|:------:|:----------|
| 🔮 | Federated learning across district clusters |
| 🔮 | Predictive health risk scoring at individual level |
| 🔮 | Drug inventory forecasting for village clinics |
| 🔮 | ABDM (Ayushman Bharat Digital Mission) integration |
| 🔮 | Multi-state rollout with protocol customization |

<br>

---

## 💼 Business Model

### Market Opportunity

India's **public health IT market** is **$2.1B** growing at **15% CAGR**. Rural health tech has **<5% digital penetration** — the largest underserved segment in Indian healthcare.

### Who Adopts MediFlow AI?

| Stakeholder | Why They Adopt |
|:------------|:---------------|
| **🏥 Hospitals & PHCs** | Reduce paperwork, AI-assisted triage, closed-loop referrals |
| **🤝 NGOs** | Grant-proof impact analytics, program outcome tracking |
| **🏛️ District Health Officers** | Real-time outbreak radar, CMO-ready reports, compliance |
| **👩‍⚕️ ASHA Workers** | Replace paper registers, offline support, voice input |
| **🧑‍⚕️ Patients** | Access to AI triage, scheme awareness, emergency SOS |
| **📋 Government** | Population health intelligence, policy decision support |

### Pricing Model

| Tier | Who | Price | Includes |
|:-----|:----|:------|:---------|
| **🌱 NGO Starter** | Community health organizations | **Free** | Core features, up to 1,000 patients |
| **🏥 District Command** | CMO offices, district hospitals | **₹15,000/mo** | Full outbreak AI, analytics, reports |
| **🏛️ State Enterprise** | State health missions | **Custom** | Multi-district, customization, SLA |

### Go-to-Market

```
Direct Outreach → NGO Partnerships → State RFPs → National Platform
     (District       (PSI, CARE        (GeM         (MoHFW
      Health Officers)  India)          Portal)       Integration)
```

### Moat

1. **Offline-first architecture** — competitors require always-on connectivity
2. **Hybrid edge-to-cloud AI** — runs both in-browser and server-side
3. **11 specialized agents** — not a single model, but an orchestrated team
4. **Autonomous outbreak detection** — no other solution has this
5. **Dual-database design** — Aurora for ACID + DynamoDB for scale
6. **243 WHO/MoHFW grounded guidelines** — clinical depth no competitor matches

> Full business strategy, competitive analysis, and financial projections in [docs/BUSINESS.md](docs/BUSINESS.md).

<br>

---

## 👤 Founder

<div align="center">
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
</div>

<br>

---

## 🤝 Contributing

We welcome contributions from engineers, designers, healthcare professionals, and rural health advocates.

**Ways to contribute:**
- 🐛 Report bugs via [GitHub Issues](https://github.com/tejshveeyerpurwad-hash/mediflow-ai-agent/issues)
- 💡 Suggest features or improvements
- 🌐 Help with translations
- 📝 Improve documentation
- 🧪 Add tests
- 🔧 Submit pull requests

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for our contribution guidelines and code of conduct.

<br>

---

## 📄 License

This project is licensed under the **GNU Affero General Public License v3.0** — see [LICENSE](LICENSE) for full terms.

```
Copyright (c) 2026 Tejshvini Yerpurwad

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
```

<br>

---

<div align="center">
  <p>
    <a href="https://mediflow-ai-olive.vercel.app"><img src="https://img.shields.io/badge/Live_Demo-Mediflow_AI-000?style=flat-square&logo=vercel" alt="Demo"></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-AGPLv3-8A2BE2?style=flat-square" alt="License"></a>
    <a href="https://github.com/tejshveeyerpurwad-hash/mediflow-ai-agent"><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github" alt="GitHub"></a>
    <a href="docs/"><img src="https://img.shields.io/badge/Docs-6366f1?style=flat-square&logo=readthedocs" alt="Docs"></a>
    <a href="https://github.com/tejshveeyerpurwad-hash/mediflow-ai-agent/issues"><img src="https://img.shields.io/badge/Issues-ef4444?style=flat-square&logo=githubissues" alt="Issues"></a>
  </p>

  <p>
    <strong>Built with ❤️ by Tejshvini Yerpurwad</strong><br>
    <em>AI for Rural Healthcare &bull; MediFlow AI</em>
  </p>

  <p>
    <a href="#-table-of-contents">↑ Back to Top</a>
  </p>
</div>
