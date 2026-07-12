# Product Roadmap

## Introduction

This roadmap outlines the strategic development plan for SwasthAI Guardian. It is organized into four phases spanning from the current foundation through to a multi-state public health platform. Priorities are driven by field feedback from rural health workers, district health officers, and NGO partners.

---

## Current Status (Phase 1 — Foundation)

The platform is production-deployed and operational. All features listed below are live and tested.

### Core Platform
- [x] Hybrid AI diagnostic engine — 101 diseases, 7 languages, tiered ensemble (DL + ML + Rules)
- [x] Sakhi RAG — grounded clinical assistant with 243 WHO/MoHFW knowledge chunks
- [x] Offline-first sync — IndexedDB transactional queue with idempotency guarantees
- [x] Autonomous outbreak radar — 30-minute agentic loop with LLM reasoning
- [x] Multi-lingual PWA — 7 Indian languages, installable, works on low-spec Android
- [x] Admin command center — live KPIs, outbreak heatmaps, AI reasoning traces

### Clinical Modules
- [x] AI symptom checker with severity assessment
- [x] Maternal health risk assessment (WHO protocol)
- [x] Child malnutrition detection (WHO Z-scores: SAM/MAM)
- [x] Ambulance SOS with GPS + WebSocket tracking
- [x] Government scheme eligibility checker (20+ schemes)
- [x] PHQ-2 mental health screening

### Infrastructure
- [x] AWS dual-database architecture (Aurora PostgreSQL + DynamoDB)
- [x] Docker multi-service orchestration
- [x] CI/CD pipeline (Render Blueprint + Vercel)
- [x] Production security (Helmet, rate limiting, CORS, IDOR policy)
- [x] Comprehensive audit logging

---

## Phase 2 — Scale (Next 6 Months)

### Mobile & Access
- [ ] Native Android app with offline-first SDK
- [ ] WhatsApp-based health assistant for feature phones
- [ ] Voice interface in 7 Indian languages
- [ ] USSD-based symptom checker for basic phones

### Clinical Expansion
- [ ] Integration with state NHM (National Health Mission) databases
- [ ] Tele-radiology support with AI triage
- [ ] Chronic disease management module (hypertension, diabetes, TB)
- [ ] Mental health assessment expansion (PHQ-9, GAD-7)

### Operations
- [ ] Real-time ambulance fleet tracking with ETA prediction
- [ ] Automated compliance reporting for MoHFW
- [ ] Bulk village data import from government CSV formats
- [ ] District health officer mobile dashboard

### Platform
- [ ] Role-based analytics dashboards for NGOs and donors
- [ ] Multi-district support with configurable thresholds
- [ ] Enhanced SSE infrastructure for 10,000+ concurrent admin connections

---

## Phase 3 — Intelligence (6–12 Months)

### AI & ML
- [ ] Federated learning across district clusters (privacy-preserving)
- [ ] Predictive health risk scoring at individual patient level
- [ ] Drug inventory forecasting for village clinics
- [ ] Epidemiological trend prediction using time-series models

### Interoperability
- [ ] Integration with Ayushman Bharat Digital Mission (ABDM)
- [ ] FHIR-compliant API for third-party health systems
- [ ] HL7 message ingestion for hospital system integration
- [ ] Open API marketplace for third-party health apps

### Advanced Clinical Tools
- [ ] Pediatric diagnostic model (age-specific symptom interpretation)
- [ ] Geriatric care module with polypharmacy checks
- [ ] Wound and skin condition progression tracking
- [ ] Integration with wearable device data (SpO2, HR, BP)

---

## Phase 4 — Platform (12+ Months)

### Scale & Reach
- [ ] Multi-state rollout with state-specific protocol customization
- [ ] Integration with National Disease Surveillance Programme
- [ ] Support for all 22 scheduled Indian languages
- [ ] Partnership with state health missions for ASHA device distribution

### Advanced Capabilities
- [ ] Real-time epidemic simulation engine (agent-based modeling)
- [ ] Intervention simulator for CMOs (what-if analysis on heatmaps)
- [ ] Automated contact tracing during outbreak events
- [ ] Vaccine cold chain monitoring and logistics optimization

### Business
- [ ] Self-serve district onboarding portal
- [ ] Usage-based billing with free tier for NGOs
- [ ] Enterprise SLA tiers with dedicated infrastructure
- [ ] White-label option for state government deployments

---

## Release Cadence

| Track | Cadence | Description |
|-------|---------|-------------|
| Core Platform | Monthly | Feature releases, API changes, database migrations |
| AI Models | Quarterly | Model retraining, accuracy improvements, new disease classes |
| Security | Continuous | Vulnerability patches, dependency updates, audit improvements |
| Infrastructure | As needed | Scaling upgrades, region expansion, cost optimization |

---

## Prioritization Framework

Features are prioritized based on:

1. **Clinical Impact** — How many patients benefit directly?
2. **Offline Necessity** — Does this work without internet?
3. **ASH A Worker Feedback** — Direct input from field users
4. **District Officer Requirements** — Regulatory and reporting needs
5. **Implementation Complexity** — Engineering effort vs. impact

---

## Future Improvements

- [ ] Public feature voting portal for stakeholder input
- [ ] Quarterly roadmap review with advisory board
- [ ] Field trial program for experimental features
- [ ] Penetration testing and security audit before each major release
- [ ] Performance benchmarking against WHO health system targets
