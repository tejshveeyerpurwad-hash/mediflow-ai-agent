# MediFlow AI — Deployment Guide

## Architecture

```
Frontend (Vercel) ──rewrite──► Backend (Render) ──► AI Service (Render)
  mediflow-ai-olive.vercel.app    mediflow-backend.onrender.com    mediflow-ai-service.onrender.com
```

## ✅ Already Deployed

| Service | URL | Status |
|---------|-----|--------|
| **Frontend (Vercel)** | https://mediflow-ai-olive.vercel.app | ✅ Live |
| Frontend (alias) | https://mediflow-7h975vrll-tejshveeyerpurwad-hashs-projects.vercel.app | ✅ Live |

---

## 🚀 Deploy Backend + AI Service to Render

### Option 1: One-Click Blueprint (Recommended)

1. Go to **https://dashboard.render.com/**
2. Click **New** → **Blueprint**
3. Connect your GitHub repo: `tejshveeyerpurwad-hash/mediflow-ai-agent`
4. Render will auto-detect `render.yaml` and create both services:
   - `mediflow-backend` (Node.js Express API)
   - `mediflow-ai-service` (Python FastAPI via Docker)
5. Click **Apply**

### Option 2: Manual Setup

#### Backend (mediflow-backend)

- **Runtime:** Node
- **Build Command:** `cd backend && npm install`
- **Start Command:** `cd backend && node server.js`
- **Plan:** Free

#### Required Environment Variables (set in Render Dashboard):

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_ENV` | `production` | |
| `JWT_SECRET` | *(generate)* | Render can auto-generate |
| `AADHAAR_SALT` | *(generate)* | Render can auto-generate |
| `AGENT_SECRET` | *(generate)* | Render can auto-generate |
| `ADMIN_PASSCODE` | *(your choice)* | For admin login |
| `ALLOWED_ORIGINS` | `https://mediflow-ai-olive.vercel.app,http://localhost:5173` | |
| `GROQ_API_KEY` | `gsk_...` | Get from https://console.groq.com |
| `AI_SERVICE_URL` | `https://mediflow-ai-service.onrender.com` | Auto-linked via blueprint |

**Disk:** Mount `/data` with 1GB for SQLite.

#### AI Service (mediflow-ai-service)

- **Runtime:** Docker
- **Docker Context:** `ai-service`
- **Dockerfile Path:** `ai-service/Dockerfile`
- **Plan:** Free

#### Required Environment Variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `GROQ_API_KEY` | `gsk_...` | Same key as backend |
| `BACKEND_URL` | `https://mediflow-backend.onrender.com` | Auto-linked via blueprint |

---

## 🔗 After Deployment

### Update Vercel Rewrites

Once Render services are live, update `frontend/vercel.json` with the actual backend URL:

```json
{ "source": "/api/(.*)", "destination": "https://mediflow-backend.onrender.com/api/$1" }
```

Then redeploy:

```bash
cd frontend
vercel --prod
```

### Update VITE_API_URL (if needed)

```bash
echo "https://mediflow-backend.onrender.com" | vercel env add VITE_API_URL production
vercel --prod
```

---

## ✅ Verification Checklist

- [ ] Frontend loads: https://mediflow-ai-olive.vercel.app
- [ ] Backend health: `https://mediflow-backend.onrender.com/api/health` → 200
- [ ] AI Service health: `https://mediflow-ai-service.onrender.com/health` → 200
- [ ] Login works (villager OTP / NGO passcode)
- [ ] Symptom Checker loads and returns results
- [ ] Timeline page loads
- [ ] OCR upload works
- [ ] No CORS errors in browser console
- [ ] No mixed content warnings

---

## 📦 Environment Files

- Root: `.env.example` — all required vars documented
- AI: `ai-service/.env.example` — AI-specific vars
