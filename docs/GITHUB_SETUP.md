# GitHub Repository Setup Guide

This document provides a comprehensive guide for configuring the SwasthAI Guardian repository on GitHub for maximum discoverability, community engagement, and professional presentation.

---

## Repository Description

The repository description appears below the repository name on GitHub. It is the first thing visitors see.

### Short Description (156 chars max)

```
Offline-first AI healthcare platform for rural India. AI symptom checker, outbreak detection, maternal health tracking — working without internet.
```

### Full Description (for About section)

```
SwasthAI Guardian is a production-grade, offline-first B2B healthcare intelligence platform built for rural public health networks. It combines edge AI (ONNX in-browser inference), autonomous outbreak detection (LLM-powered agent), and dual-database architecture (Aurora PostgreSQL + DynamoDB) to replace paper-based workflows with AI-powered digital infrastructure — all functioning fully without internet connectivity.
```

---

## Repository Website

Set the Website URL in the GitHub repository sidebar:

```
https://swasth-ai-guardian-platform.vercel.app
```

This links to the live demo and appears prominently on the repository landing page.

---

## Repository Topics

Topics improve discoverability on GitHub. Add the following topics to the repository:

### Primary Topics
```
ai
healthcare
react
nodejs
fastapi
aws
pwa
offline-first
rural-health
```

### Secondary Topics
```
machine-learning
artificial-intelligence
telemedicine
india
opensource
```

### Additional Topics (optional)
```
public-health
disease-surveillance
maternal-health
rag
onnx
vercel
render
aurora-postgresql
dynamodb
```

**How to add:**
1. Go to your repository on GitHub
2. Click the gear icon next to "About" in the top right
3. Type each topic and press Enter
4. Click "Save"

---

## Social Preview Image

The social preview image appears when the repository URL is shared on social media, Slack, Discord, and in GitHub search results.

### Specifications

| Property | Value |
|----------|-------|
| Format | PNG |
| Dimensions | 1280 × 640 pixels |
| File name | `social-preview.png` |
| Location | `.github/social-preview.png` |

### Design Guidelines

1. **Logo** — SwasthAI Guardian logo centered at the top
2. **Tagline** — "Offline-First AI Healthcare for Rural India"
3. **Visual** — Clean design with the brand color palette (green primary, dark background)
4. **Elements** — Optionally include: globe icon, heartbeat line, network nodes to represent offline-first connectivity
5. **Do not include** — Screenshots, code, or busy backgrounds

### Content

```
Top-left:  SwasthAI Guardian logo
Center:    Tagline: "Offline-First AI Healthcare for Rural India"
Bottom:    Key badges: AI · Offline-First · PWA · AWS · Open Source
```

**How to set:**
1. Create the image at `.github/social-preview.png`
2. GitHub auto-detects it from this path
3. Alternatively, upload via repository Settings → Social preview → Upload image

---

## About Section

The About section appears in the right sidebar of the repository. Set it to:

```markdown
AI-powered healthcare platform for rural India. Symptom checker, outbreak detection, maternal health, emergency SOS — all working fully offline.

Built with React, Node.js, FastAPI, AWS (Aurora + DynamoDB).

▪ 101 disease classes · 7 languages · 1.4M ASHA workers
▪ Edge AI via ONNX · Cloud LLM via Groq
▪ Offline-first IndexedDB sync · Autonomous outbreak radar
```

**How to set:**
1. Go to repository → About (gear icon)
2. Paste into the description field
3. The website URL should point to the live demo

---

## Pinned Repositories Strategy

Pinned repositories appear at the top of your GitHub profile and organization page. Since SwasthAI Guardian is a monorepo, consider these strategies:

### Option 1: Monorepo (Current)

Pin only this repository with a custom description:

```
Offline-first AI healthcare platform for rural India. 101 diseases, 7 languages, autonomous outbreak detection.
```

### Option 2: Package Discovery (Future)

As the project grows, extract reusable packages and pin them:

| Repository | Description |
|-----------|-------------|
| `swasthai-guardian` | Main platform (monorepo) |
| `symptomnet` | Multilingual disease classification model (ONNX) |
| `sakhi-rag` | Clinical RAG engine with WHO/MoHFW guidelines |
| `offline-sync-queue` | IndexedDB transactional sync queue library |
| `swasthai-pwa-sdk` | Offline-first PWA toolkit for health apps |

### Current Recommendation

For now, pin the main repository. As the ecosystem grows, extract the AI model (`symptomnet`) and the sync queue library as separate open-source packages.

---

## Release Strategy

### Versioning

Follow **Semantic Versioning** (SemVer 2.0):

```
MAJOR.MINOR.PATCH
```

| Bump | When | Example |
|------|------|---------|
| MAJOR | Breaking API/database changes | `2.0.0` |
| MINOR | New features (backward compatible) | `1.1.0` |
| PATCH | Bug fixes, security patches | `1.0.1` |

### Current Version

`v1.0.0` — Initial production release

### Release Cadence

| Type | Cadence | Description |
|------|---------|-------------|
| Core releases | Monthly | Feature releases, API changes |
| Patch releases | As needed | Bug fixes, security patches |
| AI model releases | Quarterly | Model retraining, accuracy improvements |

### Release Process

1. **Branch**: Merge changes to `main`
2. **Tag**: Create a signed Git tag
   ```bash
   git tag -s v1.1.0 -m "v1.1.0: Add voice assistant, expand to 9 languages"
   git push origin v1.1.0
   ```
3. **GitHub Release**: Create release from tag
   - Title: `v1.1.0 — Voice Assistant & Language Expansion`
   - Description: Bullet-list of changes, migration notes, contributors
   - Attach: Source code (auto-generated)
4. **Changelog**: Update CHANGELOG.md with the new version notes

### Release Notes Template

```markdown
## v1.1.0 — Voice Assistant & Language Expansion

### Features
- Voice assistant in 7 languages (SpeechSynthesisUtterance)
- Expanded disease coverage to 101 classes
- New government scheme: Ayushman Bharat Digital Mission integration

### Improvements
- 15% faster ONNX inference in browser
- Reduced IndexedDB sync latency by 40%

### Bug Fixes
- Fixed duplicate outbreak alerts during network flapping
- Corrected Aadhaar Verhoeff checksum validation

### Security
- Updated dependencies: Helmet.js, Zod
- Added rate limiting to AI endpoints

### Migration Notes
- No database migration required
- Frontend will auto-update via PWA service worker

### Contributors
@dgboy-ai, @contributor1
```

---

## GitHub Discussions

Enable GitHub Discussions for community engagement:

### Categories to Enable

| Category | Description | Format |
|----------|-------------|--------|
| 📢 **Announcements** | Project updates, releases, security advisories | Announcement only (admins) |
| 💡 **Ideas** | Feature requests and suggestions | Open discussion |
| ❓ **Q&A** | Questions about using the platform | Q&A format |
| 🏥 **Use Cases** | Real-world deployments, pilot programs | Open discussion |
| 🤝 **Partnerships** | NGO, government, and research collaborations | Open discussion |
| 🙌 **Show and Tell** | Community deployments and integrations | Open discussion |

### Setup Instructions

1. Repository → Settings → Features → Discussions → **Set up discussions**
2. Create the categories listed above
3. Pin a "Welcome" post with:
   - Link to documentation ([docs/](docs/))
   - Link to contributing guide ([CONTRIBUTING.md](docs/CONTRIBUTING.md))
   - Link to the live demo
   - Code of conduct reminder

---

## GitHub Projects

Use GitHub Projects (the new Projects Experience) for roadmap tracking:

### Suggested Board: "SwasthAI Guardian Roadmap"

| Column | Purpose | Automation |
|--------|---------|------------|
| 🗄️ Backlog | Ideas not yet scheduled | Manual |
| 📋 To Do | Issues assigned to current milestone | Auto-add when milestone set |
| 👷 In Progress | Being actively worked on | Auto-move when PR opened |
| ✅ Done | Completed in current milestone | Auto-close when PR merged |

### Suggested Board: "Sprint Tasks"

| Column | Purpose |
|--------|---------|
| 🔜 Upcoming | Next sprint candidate |
| 📋 To Do | Sprint backlog |
| 👷 In Progress | Active work |
| 👀 Review | PR/code review |
| ✅ Done | Completed |

### Automation Rules

- When an issue is added to a milestone → move to "To Do"
- When a PR is opened linked to an issue → move to "In Progress"
- When a PR is merged → move issue to "Done"

---

## Issue Templates

Create issue templates in `.github/ISSUE_TEMPLATE/` to standardize bug reports and feature requests.

### `.github/ISSUE_TEMPLATE/bug_report.md`

```markdown
---
name: Bug Report
about: Report a bug to help us improve
title: "[BUG] "
labels: bug
assignees: ''
---

**Describe the Bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain the issue.

**Environment (please complete):**
- Device: [e.g. Samsung Galaxy M15, iPhone 12]
- OS: [e.g. Android 14, iOS 17]
- Browser: [e.g. Chrome 120, Safari 17]
- Network: [e.g. Online, Offline, 2G, WiFi]
- App Version: [e.g. v1.0.0]

**Logs**
```
Paste any relevant error logs or console output here.
```

**Additional Context**
Add any other context about the problem here.
```

### `.github/ISSUE_TEMPLATE/feature_request.md`

```markdown
---
name: Feature Request
about: Suggest an idea for SwasthAI Guardian
title: "[FEATURE] "
labels: enhancement
assignees: ''
---

**Is your feature request related to a problem?**
A clear description of the problem. Ex. "ASHA workers in Varanasi district need..."

**Describe the Solution**
A clear description of what you want to happen.

**Describe Alternatives**
Alternative solutions or features you've considered.

**Impact**
How does this feature help rural health outcomes?
- [ ] Improves clinical accuracy
- [ ] Improves offline functionality
- [ ] Adds new language/locale support
- [ ] Reduces ASHA worker burden
- [ ] Enhances admin reporting

**Additional Context**
Add any context, diagrams, or references (WHO guidelines, MoHFW protocols, etc.).
```

### `.github/ISSUE_TEMPLATE/config.yml`

```yaml
blank_issues_enabled: false
contact_links:
  - name: Documentation
    url: https://github.com/dgboy-ai/SwasthAI-Guardian-Platform/tree/main/docs
    about: Check our documentation before opening an issue
  - name: Security Issue
    url: https://github.com/dgboy-ai/SwasthAI-Guardian-Platform/security/policy
    about: Report security vulnerabilities here
  - name: Discussions
    url: https://github.com/dgboy-ai/SwasthAI-Guardian-Platform/discussions
    about: Ask questions and discuss ideas in Discussions
```

---

## Pull Request Template

### `.github/PULL_REQUEST_TEMPLATE.md`

```markdown
## Description

Closes #(issue-number)

Brief description of the changes.

## Type of Change

- [ ] 🐛 Bug fix
- [ ] ✨ New feature
- [ ] 📝 Documentation update
- [ ] ♻️ Refactor
- [ ] ⚡ Performance improvement
- [ ] 🔒 Security fix
- [ ] 🧪 Test addition/update

## Affected Components

- [ ] Frontend (React PWA)
- [ ] Backend (Express API)
- [ ] AI Service (FastAPI)
- [ ] Database (Aurora / DynamoDB)
- [ ] Infrastructure (Docker / Render / Vercel)
- [ ] Documentation

## Testing

- [ ] All existing tests pass
- [ ] New tests added for this change
- [ ] Manual testing completed

## Screenshots (if applicable)

## Checklist

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented complex code for future maintainers
- [ ] I have updated the documentation accordingly
- [ ] My changes generate no new warnings
- [ ] Any dependent changes have been merged

## Additional Notes
```

---

## Community Health Files

### `.github/CODE_OF_CONDUCT.md`

```markdown
# Code of Conduct

## Our Pledge

We as members, contributors, and leaders pledge to make participation in the
SwasthAI Guardian community a harassment-free experience for everyone,
regardless of age, body size, visible or invisible disability, ethnicity,
sex characteristics, gender identity and expression, level of experience,
education, socio-economic status, nationality, personal appearance, race,
caste, color, religion, or sexual identity and orientation.

We pledge to act and interact in ways that contribute to an open, welcoming,
diverse, inclusive, and healthy community.

## Our Standards

Examples of behavior that contributes to a positive environment:

- Demonstrating empathy and kindness toward other people
- Being respectful of differing opinions, viewpoints, and experiences
- Giving and gracefully accepting constructive feedback
- Accepting responsibility and apologizing to those affected by our mistakes
- Focusing on what is best not just for us as individuals, but for the
  rural communities we serve

Examples of unacceptable behavior:

- The use of sexualized language or imagery, and sexual attention or advances
- Trolling, insulting or derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate in a
  professional setting

## Enforcement Responsibilities

Community leaders are responsible for clarifying and enforcing our standards
of acceptable behavior and will take appropriate and fair corrective action in
response to any behavior that they deem inappropriate, threatening, offensive,
or harmful.

## Scope

This Code of Conduct applies within all community spaces, and also applies
when an individual is officially representing the community in public spaces.

## Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported to the community leaders responsible for enforcement at
tejshveeyerpurwad@gmail.com. All complaints will be reviewed and investigated
promptly and fairly.

## Attribution

This Code of Conduct is adapted from the [Contributor Covenant](https://www.contributor-covenant.org),
version 2.1, available at
https://www.contributor-covenant.org/version/2/1/code_of_conduct.html.
```

### `.github/SUPPORT.md`

```markdown
# Support

## Where to Get Help

### Documentation
Start with our [documentation](https://github.com/dgboy-ai/SwasthAI-Guardian-Platform/tree/main/docs).
It covers architecture, API reference, deployment, and contributing.

### GitHub Discussions
Ask questions and share ideas in [Discussions](https://github.com/dgboy-ai/SwasthAI-Guardian-Platform/discussions).

### Bug Reports
Open a [bug report](https://github.com/dgboy-ai/SwasthAI-Guardian-Platform/issues/new?template=bug_report.md).

### Feature Requests
Suggest new features via [feature request](https://github.com/dgboy-ai/SwasthAI-Guardian-Platform/issues/new?template=feature_request.md).

### Security Vulnerabilities
Report security issues to tejshveeyerpurwad@gmail.com. Do not open public issues.

### Commercial Support
For enterprise deployments, district pilots, or partnership inquiries, contact
tejshveeyerpurwad@gmail.com.
```

### `.github/FUNDING.yml`

```yaml
# These are supported funding model platforms

github: # Replace with up to 4 GitHub Sponsors usernames
patreon: # Replace with a single Patreon username
open_collective: # Replace with a single Open Collective username
ko_fi: # Replace with a single Ko-fi username
tidelift: # Replace with a single Tidelift platform-name/package-name
community_bridge: # Replace with a single Community Bridge project-name
liberapay: # Replace with a single Liberapay username
issuehunt: # Replace with a single IssueHunt username
otechie: # Replace with a single Otechie username
custom: # Replace with up to 4 custom sponsorship URLs e.g., ['link1', 'link2']
```

---

## File Layout Summary

The following files should be created for optimal GitHub repository quality:

```
.github/
├── workflows/
│   └── ci.yml                    # (already exists)
├── ISSUE_TEMPLATE/
│   ├── bug_report.md             # Create
│   ├── feature_request.md        # Create
│   └── config.yml                # Create
├── PULL_REQUEST_TEMPLATE.md      # Create
├── CODE_OF_CONDUCT.md            # Create
├── SUPPORT.md                    # Create
├── FUNDING.yml                   # Create (configure later)
└── social-preview.png            # Create (1280×640 PNG)

docs/
├── CONTRIBUTING.md               # (already exists at docs/CONTRIBUTING.md)
├── SECURITY.md                   # (already exists at docs/SECURITY.md)
└── GITHUB_SETUP.md               # This file
```

---

## Action Items

- [ ] Set repository description on GitHub
- [ ] Set repository website URL to live demo
- [ ] Add all suggested topics
- [ ] Create `.github/social-preview.png` (1280×640)
- [ ] Create `.github/ISSUE_TEMPLATE/bug_report.md`
- [ ] Create `.github/ISSUE_TEMPLATE/feature_request.md`
- [ ] Create `.github/ISSUE_TEMPLATE/config.yml`
- [ ] Create `.github/PULL_REQUEST_TEMPLATE.md`
- [ ] Create `.github/CODE_OF_CONDUCT.md`
- [ ] Create `.github/SUPPORT.md`
- [ ] Create `.github/FUNDING.yml` with relevant links
- [ ] Enable Discussions in repository Settings
- [ ] Set up Discussion categories
- [ ] Pin a welcome post in Discussions
- [ ] Enable GitHub Projects (new experience)
- [ ] Create a Roadmap project board
- [ ] Create a Sprint Tasks project board
- [ ] Set project board automation rules
- [ ] Verify `docs/CONTRIBUTING.md` is linked from repository
- [ ] Verify `docs/SECURITY.md` is linked from repository
