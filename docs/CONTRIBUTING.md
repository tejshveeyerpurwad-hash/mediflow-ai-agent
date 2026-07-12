# Contributing to SwasthAI Guardian

## Introduction

Thank you for your interest in contributing to SwasthAI Guardian! This document provides guidelines for contributing to the project, whether you're reporting bugs, suggesting features, improving documentation, or submitting code changes.

SwasthAI Guardian is a mission-driven project building healthcare infrastructure for rural India. Every contribution helps move us closer to a future where no village is more than a tap away from quality healthcare.

---

## Code of Conduct

This project is governed by the following principles:

- **Respect**: Treat all contributors with respect and professionalism
- **Inclusion**: Welcome contributors of all backgrounds and experience levels
- **Mission-first**: Keep the end-user — rural ASHA workers and patients — at the center of every decision
- **Quality**: Maintain high standards for code quality, security, and documentation

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Docker (recommended for local development)

### Setup

```bash
# Clone the repository
git clone https://github.com/dgboy-ai/SwasthAI-Guardian-Platform.git
cd SwasthAI-Guardian-Platform

# Copy environment template
cp .env.example .env

# Start all services with Docker (recommended)
docker-compose up --build

# Or run services individually:
# See docs/setup_guide.md for manual setup instructions
```

---

## How to Contribute

### Reporting Bugs

1. Check the [issue tracker](https://github.com/dgboy-ai/SwasthAI-Guardian-Platform/issues) for existing reports
2. If none exists, [create a new issue](https://github.com/dgboy-ai/SwasthAI-Guardian-Platform/issues/new)
3. Include:
   - Clear title and description
   - Steps to reproduce
   - Expected vs. actual behavior
   - Environment details (browser, OS, device)
   - Screenshots if applicable
   - Relevant log output

### Suggesting Features

1. [Open a feature request](https://github.com/dgboy-ai/SwasthAI-Guardian-Platform/issues/new)
2. Describe the problem you're solving, not just the solution
3. Explain how this benefits rural health workers or patients
4. Include any relevant context or research

### Improving Documentation

Documentation improvements are always welcome! See the [docs/](docs/) directory for existing documentation. Each document follows a standard structure:

- Introduction
- Main content with diagrams (Mermaid)
- Best practices
- Future improvements

### Submitting Code Changes

#### Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code |
| `develop` | Integration branch for features |
| `feature/*` | New features (`feature/offline-sync-v2`) |
| `fix/*` | Bug fixes (`fix/aadhaar-validation`) |
| `docs/*` | Documentation changes (`docs/api-refresh`) |

#### Development Workflow

1. Fork the repository
2. Create a feature branch from `develop`
3. Make your changes
4. Run tests and linting
5. Submit a pull request to `develop`

#### Commit Guidelines

Use clear, descriptive commit messages:

```
feat: add offline-capable PHQ-9 mental health assessment

- Implements full PHQ-9 questionnaire with scoring
- Stores results in IndexedDB for offline access
- Syncs to backend when connectivity is restored
- Includes automatic referral trigger for score >= 15
```

**Prefixes**: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, `security:`

#### Pull Request Process

1. Ensure your PR description clearly describes the change and motivation
2. Reference any related issues (e.g., `Closes #123`)
3. Update documentation if your change affects the API or architecture
4. Verify all automated checks pass
5. Request review from maintainers
6. Address review feedback promptly

---

## Development Guidelines

### Code Style

- **Frontend**: Follow existing React patterns (functional components, hooks)
- **Backend**: ES modules (`import`/`export`), async/await
- **AI Service**: Python type hints, PEP 8 conventions
- **All**: No commented-out code, no console.log in production, meaningful variable names

### Testing

| Layer | Tool | Location |
|-------|------|----------|
| Frontend smoke tests | Vite | `frontend/tests/` |
| Backend smoke tests | Node | `backend/tests/` |
| AI guardrail tests | Python | `ai-service/test_*.py` |
| Model accuracy tests | Python | `ai-service/train_*.py` output logs |

Run the full smoke test suite:

```bash
# Backend
cd backend && npm run smoke

# Frontend
cd frontend && npm run smoke:pwa

# AI Service
cd ai-service && python test_guardrail.py && python test_rural.py
```

### Documentation

- Each feature should include or update relevant docs
- Use Mermaid for diagrams (architecture, data flow, ERDs)
- Document API changes in the appropriate route handler header
- Keep the README.md and docs/ in sync with actual implementation

### Security

- Never commit secrets, API keys, or tokens
- Always use parameterized database queries
- Validate all user input with Zod schemas
- Add audit logging for admin-level actions
- Follow least-privilege principle for role-based access

---

## Project Structure

```
SwasthAI-Guardian/
├── frontend/               # React + Vite PWA
├── backend/                # Express.js REST API
├── ai-service/             # FastAPI AI microservice
├── docs/                   # Technical documentation
├── infra/                  # Infrastructure as code
├── mobile/                 # Future native mobile app
├── assets/                 # Media assets
└── DEPLOYMENT.md           # Production deployment guide
```

---

## Questions?

- Open a [discussion](https://github.com/dgboy-ai/SwasthAI-Guardian-Platform/discussions)
- Check existing [docs](docs/) for detailed technical information
- File an [issue](https://github.com/dgboy-ai/SwasthAI-Guardian-Platform/issues) for bugs or feature requests

---

## Future Improvements

- [ ] Add automated CI/CD pipeline with GitHub Actions (lint → test → build → deploy)
- [ ] Create contributor onboarding guide with video walkthrough
- [ ] Add style guide auto-formatters (Prettier, ESLint, Black)
- [ ] Set up automated API documentation generation
- [ ] Create good-first-issue labels for new contributors
- [ ] Add test coverage requirements for PRs
- [ ] Establish regular community calls for contributors
