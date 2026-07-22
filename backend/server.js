import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import cluster from 'cluster';
import os from 'os';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import path from 'path';

import app from './app.js';

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

const maxWorkers = process.env.WEB_CONCURRENCY
  ? parseInt(process.env.WEB_CONCURRENCY)
  : (process.env.RENDER === 'true' ? 1 : Math.min(os.cpus().length, 2));

if (isProduction && cluster.isPrimary && maxWorkers > 1) {
  console.log(`Primary ${process.pid} is running. Forking ${maxWorkers} workers for load balancing...`);

  for (let i = 0; i < maxWorkers; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  const PORT = process.env.PORT || 5000;
  const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`\ud83d\ude80 SwasthAI Core active on port ${PORT} (Mode: ${process.env.NODE_ENV || 'development'})`);
  });

  const wss = new WebSocketServer({ noServer: true });
  const activeTeles = new Map();
  const wsClients = new Set();

  server.on('upgrade', (request, socket, head) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    if (url.pathname === '/api/telemetry') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on('connection', (ws) => {
    wsClients.add(ws);
    console.log(`[WS] New client connected. Active: ${wsClients.size}`);

    activeTeles.forEach((val) => {
      ws.send(JSON.stringify(val));
    });

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        if (data.type === 'location_update') {
          activeTeles.set(data.requestId, data);
          const msgStr = JSON.stringify(data);
          wsClients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(msgStr);
            }
          });
        }
      } catch (err) {
        console.error('[WS error] Parsing failed:', err.message);
      }
    });

    ws.on('close', () => {
      wsClients.delete(ws);
      console.log(`[WS] Client disconnected. Active: ${wsClients.size}`);
    });
  });

  const monitorWatchdog = async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const aiRes = await fetch(`${AI_SERVICE_URL}/health`, { signal: controller.signal });
      clearTimeout(timeout);
      if (aiRes.ok && app.locals.serviceAlerts) {
        delete app.locals.serviceAlerts['ai-service'];
      } else if (!aiRes.ok && app.locals.serviceAlerts) {
        app.locals.serviceAlerts['ai-service'] = `HTTP ${aiRes.status}`;
      }
    } catch (err) {
      if (app.locals.serviceAlerts) {
        app.locals.serviceAlerts['ai-service'] = err.name === 'AbortError' ? 'timeout' : 'unreachable';
      }
      console.warn('[WATCHDOG] AI service health check failed:', err.message);
    }
  };

  const watchdogInterval = setInterval(monitorWatchdog, 30000);

  app.locals.wss = wss;
  app.locals.wsClients = wsClients;
  app.locals.activeTeles = activeTeles;
}
