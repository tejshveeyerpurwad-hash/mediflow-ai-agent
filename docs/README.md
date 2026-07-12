# Documentation

Welcome to the SwasthAI Guardian documentation hub. This directory contains all technical, architectural, business, and operational documentation for the platform.

## Quick Start

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture overview — services, data flow, deployment topology |
| [API.md](API.md) | Complete REST API reference — all endpoints, auth, request/response schemas |
| [DATABASE.md](DATABASE.md) | Database design — Aurora PostgreSQL schema, DynamoDB tables, migration strategy |
| [AI.md](AI.md) | AI engine architecture — SymptomNet, Sakhi RAG, Outbreak Agent, validation methodology |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Comprehensive production deployment — AWS, Vercel, Render, Docker, troubleshooting |
| [SECURITY.md](SECURITY.md) | Security architecture — DISHA/DPDP compliance, auth, encryption, audit trails |
| [BUSINESS.md](BUSINESS.md) | Business strategy — market sizing, pricing, GTM, competitive analysis |
| [ROADMAP.md](ROADMAP.md) | Product roadmap — 4-phase plan from foundation to national scale |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines — PR process, code style, code of conduct |
| [GITHUB_SETUP.md](GITHUB_SETUP.md) | GitHub repository optimization — topics, templates, community health files |
| [setup_guide.md](setup_guide.md) | Local development setup — Docker, manual installation, environment variables |
| [system_architecture.md](system_architecture.md) | Detailed system architecture — Mermaid diagrams, PostgreSQL schema reference |
| [ai_architecture.md](ai_architecture.md) | AI engine deep dive — validation methodology, model specifications |
| [offline_sync_strategy.md](offline_sync_strategy.md) | Offline sync architecture — IndexedDB queue, conflict resolution, idempotency |
| [repository_map.md](repository_map.md) | Complete codebase directory map with file-by-file descriptions |

## Supplementary Assets

- [architecture-diagram.svg](architecture-diagram.svg) — Visual system architecture diagram (embedded in README)
- [archive/](archive/) — Archived documents (hackathon materials, historical content)

## Conventions

- Documents use semantic line breaks and follow GitHub Flavored Markdown.
- Architecture decisions include rationale and trade-off analysis.
- API docs include curl examples and error response schemas.
- Security-sensitive configuration values are always referenced via environment variables.
