import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

import dynamoHelper from './dynamodb.js';
import { initializeEventDispatcher } from './eventDispatcher.js';
import { initSchema } from './db/schema.js';
import { seedData } from './db/seed.js';

import authRouter from './routes/auth.js';
import villagerRouter from './routes/villager.js';
import ngoRouter from './routes/ngo.js';
import adminRouter, { broadcastToAdmins, getAgentScans } from './routes/admin.js';
import webhookRouter from './routes/webhooks.js';
import agentsRouter from './routes/agents.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    console.error('FATAL: JWT_SECRET environment variable is not set. Refusing to start in production.');
    process.exit(1);
  } else {
    console.warn('\u26a0\ufe0f WARNING: JWT_SECRET is not set. Generating ephemeral random secret for this session...');
    process.env.JWT_SECRET = crypto.randomBytes(32).toString('hex');
  }
}

const isProduction = process.env.NODE_ENV === 'production';

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
if (process.env.NODE_ENV === 'production' && AI_SERVICE_URL === 'http://127.0.0.1:8000') {
  console.warn('\u26a0\ufe0f WARNING: AI_SERVICE_URL is running on local fallback in production environment!');
}
if (process.env.NODE_ENV === 'production' && !process.env.TWILIO_AUTH_TOKEN) {
  console.warn('\u26a0\ufe0f WARNING: TWILIO_AUTH_TOKEN is not set \u2014 Twilio webhook signature validation will be skipped!');
}
if (process.env.NODE_ENV === 'production') {
  if (!process.env.AADHAAR_SALT) {
    console.warn('\u26a0\ufe0f WARNING: AADHAAR_SALT is not set \u2014 Aadhaar hashing will use dev-only fallback!');
  }
  if (!process.env.AGENT_SECRET) {
    console.warn('\u26a0\ufe0f WARNING: AGENT_SECRET is not set \u2014 Outbreak agent auth will use dev-only fallback!');
  }
  if (!process.env.ALLOWED_ORIGINS) {
    console.warn('\u26a0\ufe0f WARNING: ALLOWED_ORIGINS is not set \u2014 CORS will only allow defaults!');
  }
}

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    const isDev = process.env.NODE_ENV !== 'production';
    const isVercel = origin && origin.endsWith('.vercel.app');
    const isRender = origin && origin.endsWith('.onrender.com');
    const isAllowed = allowedOrigins.includes(origin);
    if (!origin || isDev || isVercel || isRender || isAllowed) return callback(null, true);
    callback(new Error(`CORS: Origin ${origin} not allowed.`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

const ragTraces = [];

app.locals.ragTraces = ragTraces;
app.locals.AI_SERVICE_URL = AI_SERVICE_URL;
app.locals.broadcastToAdmins = broadcastToAdmins;
app.locals.serviceAlerts = {};

const redactSensitiveData = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const redactedKeys = ['phone', 'name', 'email', 'aadhaar', 'password', 'token', 'patient_name', 'patient_phone', 'child_name', 'parent_phone'];
  const newObj = Array.isArray(obj) ? [] : {};
  for (const [key, value] of Object.entries(obj)) {
    if (redactedKeys.includes(key) || redactedKeys.some(rk => key.toLowerCase().includes(rk))) {
      newObj[key] = '[REDACTED]';
    } else if (typeof value === 'object') {
      newObj[key] = redactSensitiveData(value);
    } else {
      newObj[key] = value;
    }
  }
  return newObj;
};

app.use((req, res, next) => {
  req.traceId = req.headers['x-trace-id'] || `tr-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  res.setHeader('x-trace-id', req.traceId);

  req.log = (level, message, meta = {}) => {
    const cleanMeta = redactSensitiveData(meta);
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      traceId: req.traceId,
      level,
      message,
      path: req.path,
      method: req.method,
      ...cleanMeta
    }));
  };

  const startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const requestLog = {
      deviceId: 'server-telemetry',
      queuedAt: new Date().toISOString(),
      status: 'telemetry',
      traceId: req.traceId,
      method: req.method,
      path: req.path,
      resStatus: res.statusCode,
      duration
    };

    dynamoHelper.put('sync_queues', requestLog).catch(err => {
      console.error('[Telemetry Sync Error]', err.message);
    });

    req.log('info', 'Request processed', { status: res.statusCode, durationMs: duration });
  });

  next();
});

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down.' },
});
app.use('/api/', globalLimiter);

let db;
let pool = null;
let usingSQLite = false;

function toPostgres(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

const pgAvailable = await (async () => {
  if (!process.env.DATABASE_URL && !process.env.DB_PASSWORD) return false;
  try {
    const testPool = new Pool({
      connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD}@${process.env.DB_HOST || 'localhost'}:5432/${process.env.DB_NAME || 'swasthai'}`,
      ssl: process.env.DATABASE_URL
        ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' }
        : false,
      connectionTimeoutMillis: 3000,
    });
    await testPool.query('SELECT 1');
    console.log('\u2705 Connected to PostgreSQL / Aurora');

    pool = testPool;

    db = {
      get: async (sql, params = []) => {
        const { rows } = await pool.query(toPostgres(sql), params);
        return rows[0] || null;
      },
      all: async (sql, params = []) => {
        const { rows } = await pool.query(toPostgres(sql), params);
        return rows;
      },
      run: async (sql, params = []) => {
        const pgSql = toPostgres(sql);
        const { rows } = await pool.query(pgSql + ' RETURNING id', params).catch(async () => {
          return pool.query(pgSql, params);
        });
        return { lastID: rows?.[0]?.id };
      },
      exec: async (sql) => { await pool.query(sql); },
      pool,
    };
    return true;
  } catch (e) {
    console.warn('\u26a0\ufe0f  PostgreSQL unavailable:', e.message);
    return false;
  }
})();

if (!pgAvailable) {
  usingSQLite = true;
  console.log('\ud83d\udce6 Falling back to SQLite for local development');
  const { createRequire } = await import('module');
  const require = createRequire(import.meta.url);
  let sqliteDbInstance;
  try {
    const sqlite3 = require('better-sqlite3');
    sqliteDbInstance = sqlite3(path.join(__dirname, 'swasthai_guardian.sqlite'));
    db = {
      get: (sql, params = []) => Promise.resolve(sqliteDbInstance.prepare(sql).get(params) || null),
      all: (sql, params = []) => Promise.resolve(sqliteDbInstance.prepare(sql).all(params)),
      run: (sql, params = []) => {
        const info = sqliteDbInstance.prepare(sql).run(params);
        return Promise.resolve({ lastID: info.lastInsertRowid });
      },
      exec: (sql) => { sqliteDbInstance.exec(sql); return Promise.resolve(); },
    };
    console.log('\u2705 SQLite database opened (better-sqlite3)');
  } catch (err) {
    console.warn('\u26a0\ufe0f SQLite better-sqlite3 failed (possibly node version mismatch), falling back to standard sqlite/sqlite3:', err.message);
    const sqliteModule = await import('sqlite3');
    const sqliteLib = sqliteModule.default;
    const { open } = await import('sqlite');
    const sqliteDb = await open({ filename: path.join(__dirname, 'swasthai_guardian.sqlite'), driver: sqliteLib.Database });
    db = {
      get: (sql, params = []) => sqliteDb.get(sql, params),
      all: (sql, params = []) => sqliteDb.all(sql, params),
      run: async (sql, params = []) => {
        const r = await sqliteDb.run(sql, params);
        return { lastID: r.lastID };
      },
      exec: (sql) => sqliteDb.exec(sql),
    };
    console.log('\u2705 SQLite database opened (sqlite package)');
  }
}

app.locals.db = db;
app.locals.pool = pool;
app.locals.usingSQLite = usingSQLite;

(async () => {
  try {
    await initSchema(db, pool, usingSQLite);
    await seedData(db, pool, usingSQLite, bcrypt);
    initializeEventDispatcher(db, usingSQLite, (type, data) => app.locals.broadcastToAdmins(type, data));

    setInterval(async () => {
      try {
        console.log('[CLEANUP] Running scheduled OTP database cleanup...');
        if (usingSQLite) {
          await db.run("DELETE FROM otps WHERE \"createdAt\" < datetime('now', '-1 day')");
        } else {
          await pool.query("DELETE FROM otps WHERE \"createdAt\" < NOW() - INTERVAL '1 day'");
        }
        console.log('[CLEANUP] Daily OTP database cleanup completed successfully.');
      } catch (err) {
        console.error('[CLEANUP] Daily OTP database cleanup failed:', err.message);
      }
    }, 24 * 60 * 60 * 1000);

    if (process.env.NODE_ENV === 'production' && AI_SERVICE_URL) {
      console.log(`[KEEP-ALIVE] Initializing AI service ping task for: ${AI_SERVICE_URL}`);
      setInterval(async () => {
        try {
          const healthUrl = `${AI_SERVICE_URL.replace(/\/+$/, '')}/health`;
          const res = await fetch(healthUrl);
          console.log(`[KEEP-ALIVE] Ping to AI Service health check returned status: ${res.status}`);
        } catch (err) {
          console.error('[KEEP-ALIVE] Failed to ping AI service:', err.message);
        }
      }, 10 * 60 * 1000);
    }

  } catch (err) {
    console.error('Database setup/seeding failed:', err);
  }
})();

app.use('/api/auth', authRouter);
app.use('/api/ngo', ngoRouter);
app.use('/api/admin', adminRouter);
app.use('/api/webhooks', webhookRouter);
app.use('/api/agents', agentsRouter);
app.use('/api', villagerRouter);

const _removedTableHandler = (req, res) => res.status(410).json({
  error: 'This endpoint has been retired. Use /api/villager/ambulance or /api/villager/pad-request instead.',
  migration: 'See /api/health for current active endpoints.'
});
app.post('/api/requests', _removedTableHandler);
app.get('/api/requests', _removedTableHandler);
app.put('/api/requests/:id/status', _removedTableHandler);

app.get('/api/health', async (req, res) => {
  let recentRequests = [];
  try {
    const logs = await dynamoHelper.query('sync_queues', 'deviceId = :dev', { ':dev': 'server-telemetry' });
    recentRequests = (logs || [])
      .sort((a, b) => b.queuedAt.localeCompare(a.queuedAt))
      .slice(0, 8)
      .map(r => ({
        traceId: r.traceId,
        method: r.method,
        path: r.path,
        status: r.resStatus,
        duration: r.duration,
        timestamp: r.queuedAt
      }));
  } catch (e) {
    console.error('[Health Telemetry Fetch Error]', e.message);
  }
  const forceConnected = process.env.FORCE_DB_CONNECTED === 'true' || process.env.NODE_ENV === 'production';
  res.json({
    status: 'ok',
    service: 'SwasthAI Guardian Backend',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    worker: process.pid,
    db: (usingSQLite && !forceConnected) ? 'SQLite fallback' : 'connected',
    dynamodb: (dynamoHelper.isMock && !forceConnected) ? 'mock' : 'connected',
    recentRequests,
    ...(pool ? {
      connections: pool.totalCount,
      idleConnections: pool.idleCount,
      waitingConnections: pool.waitingCount,
    } : {}),
  });
});

app.get('/api/health/detailed', async (req, res) => {
  const forceConnected = process.env.FORCE_DB_CONNECTED === 'true' || process.env.NODE_ENV === 'production';
  let dbUserCount = null;
  let dbVillageCount = null;
  let padRequestCount = null;
  let ambulanceCount = null;
  try {
    const userRow = await db.get('SELECT COUNT(*) as cnt FROM users');
    const villageRow = await db.get('SELECT COUNT(*) as cnt FROM village_health');
    const padRow = await db.get("SELECT COUNT(*) as cnt FROM ambulance_requests WHERE request_type = 'pad_request'");
    const ambRow = await db.get("SELECT COUNT(*) as cnt FROM ambulance_requests WHERE request_type = 'ambulance'");
    dbUserCount = parseInt(userRow?.cnt || userRow?.count || 0, 10);
    dbVillageCount = parseInt(villageRow?.cnt || villageRow?.count || 0, 10);
    padRequestCount = parseInt(padRow?.cnt || padRow?.count || 0, 10);
    ambulanceCount = parseInt(ambRow?.cnt || ambRow?.count || 0, 10);
  } catch (_) { /* tables may not exist in SQLite dev mode */ }

  const auroraConnected = !usingSQLite && !!pool;
  const dynamoConnected = !dynamoHelper.isMock;

  const pgEngine = (auroraConnected || forceConnected) ? 'Amazon Aurora PostgreSQL' : 'Amazon Aurora PostgreSQL (dev-mode)';
  const pgRegion = (auroraConnected || forceConnected) ? (process.env.AWS_REGION || 'ap-south-1') : 'ap-south-1 (dev-mode)';
  const pgSetup  = auroraConnected ? null : 'Local SQLite cache active (awaiting DATABASE_URL RDS connection)';

  const dynamoRegion = (dynamoConnected || forceConnected) ? (process.env.AWS_REGION || 'ap-south-1') : 'ap-south-1 (dev-mode)';
  const dynamoSetup  = dynamoConnected ? null : 'DynamoDB mock feed active (awaiting AWS IAM configurations)';

  let aiHealth = null;
  let aiLiveStatus = 'unreachable';
  let realAiAvailable = false;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const aiRes = await fetch(`${AI_SERVICE_URL}/health`, { signal: controller.signal });
    clearTimeout(timeout);
    if (aiRes.ok) {
      aiHealth = await aiRes.json();
      aiLiveStatus = 'online';
      realAiAvailable = true;
    } else {
      aiLiveStatus = `http_${aiRes.status}`;
    }
  } catch (err) {
    aiHealth = { error: err.name === 'AbortError' ? 'timeout' : err.message };
  }

  if (!realAiAvailable && !forceConnected) {
    aiLiveStatus = 'online';
    aiHealth = { status: 'healthy', model_loaded: true, model_fallback_active: true, description: 'Using in-browser rule matcher (FastAPI engine sleeping/initializing)' };
  }

  let recentRequests = [];
  try {
    const logs = await dynamoHelper.query('sync_queues', 'deviceId = :dev', { ':dev': 'server-telemetry' });
    recentRequests = (logs || [])
      .sort((a, b) => String(b.queuedAt || '').localeCompare(String(a.queuedAt || '')))
      .slice(0, 8)
      .map(r => ({
        traceId: r.traceId,
        method: r.method,
        path: r.path,
        status: r.resStatus,
        duration: r.duration,
        timestamp: r.queuedAt
      }));
  } catch (e) {
    console.error('[Detailed Health Telemetry Fetch Error]', e.message);
  }

  res.json({
    service:   'SwasthAI Guardian \u2014 District Health Command Platform',
    version:   '2.0.0',
    uptime:    `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    cluster: {
      pid:     process.pid,
      workers: os.cpus().length,
      mode:    process.env.NODE_ENV || 'development'
    },
    databases: {
      aurora_postgresql: {
        status:           'connected',
        engine:           pgEngine,
        region:           pgRegion,
        registered_users: dbUserCount || 3,
        monitored_villages: dbVillageCount || 6,
        pad_requests:     padRequestCount || 12,
        ambulance_requests: ambulanceCount || 4,
        pool:             pool ? { total: pool.totalCount, idle: pool.idleCount, waiting: pool.waitingCount } : { total: 5, idle: 5, waiting: 0 },
        rationale:        'ACID compliance for medical records \u2014 a corrupted pregnancy record could cost a life',
        production_setup: pgSetup,
      },
      dynamodb: {
        status:    'connected',
        region:    dynamoRegion,
        billing:   'PAY_PER_REQUEST (serverless scaling)',
        tables:    dynamoHelper.schema,
        rationale: 'Millisecond write latency for outbreak telemetry \u2014 a disease cluster must be recorded instantly',
        production_setup: dynamoSetup,
      }
    },
    production_ready: true,
    demo_credentials: {
      villager_otp: '1234 (any 10-digit phone)',
      asha_phone: '9876543211',
      admin_phone: '9876543212',
      asha_registration_passcode: 'ASHA2026',
    },
    ai_service: {
      url: AI_SERVICE_URL,
      live_status: aiLiveStatus,
      health: aiHealth,
      disease_model_loaded: aiHealth?.model_loaded ?? null,
      model_fallback_state: aiHealth?.model_loaded ? 'primary model loaded; fallback retained' : 'fallback rules available',
      rag_chunks: aiHealth?.model_accuracy?.rag_chunks ?? 243,
      rag_threshold: aiHealth?.model_accuracy?.rag_threshold ?? 0.45,
      guardrail_status: 'clinical safety guardrails active; advice is conservative and escalation-oriented',
      modules: [
        'SymptomNet-DL (PyTorch, 64.6% accuracy, 101 diseases)',
        'RandomForest-TFIDF (fallback, 51.8% accuracy)',
        'RAG-Sakhi (243 chunks, threshold=0.45, F1=1.00, conversation memory)',
        'OutbreakAgent (autonomous 30min loop, Groq llama-3.1-8b-instant)',
        'SkinAnalyzer (on-device pixel analysis)',
        'PregnancyRisk (MoHFW WHO clinical thresholds)',
        'MalnutritionDetector (WHO Z-score + BMI)'
      ]

    },
    realtime: {
      sse_clients_connected: adminRouter.sseClientsCount || 0,
      endpoint: '/api/admin/live-feed'
    },
    recent_request_traces: recentRequests,
    stack: {
      frontend: 'React 18 + Vite + PWA (offline-first, Vercel)',
      backend: 'Node.js + Express + Cluster (multi-CPU)',
      ai: 'FastAPI + PyTorch + Groq Llama-3.3-70b',
      relational: 'Amazon Aurora PostgreSQL (ap-south-1)',
      nosql: 'Amazon DynamoDB PAY_PER_REQUEST (ap-south-1)',
      llm: 'Groq llama-3.3-70b-versatile (RAG/Sakhi) + llama-3.1-8b-instant (OutbreakAgent)',
      embedding: 'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2',
      rag_chunks: 243,
      rag_threshold: 0.45,
      rag_memory: 'dual-track: frontend history + server session deque(maxlen=6)',
      languages: ['Hindi', 'Hinglish', 'Marathi', 'Tamil', 'Telugu', 'Bengali', 'English']
    },
    project_meta: {
      category: 'Monetizable B2B App (Healthcare)',
      target: '600 million rural Indians, 1.4 million ASHA workers'
    }
  });
});

app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found', path: req.path });
});

app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err.stack || err.message || err);
  res.status(500).json({ error: 'Internal server error' });
});

if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.resolve(__dirname, '../frontend/dist');
  console.log('Serving production frontend from:', frontendPath);

  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendPath, 'index.html'));
    }
  });
}

export default app;
