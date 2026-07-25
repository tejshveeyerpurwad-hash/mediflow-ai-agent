// Vercel serverless entry point
// Attempts to load the full backend app; falls back to a minimal health endpoint
// if module resolution fails (ensures /api/health always works on Vercel)

let handler;

try {
  const app = (await import('../backend/app.js')).default;
  handler = app;
} catch (err) {
  console.error('[Vercel Lambda] Could not load backend/app.js:', err.message);
  console.error('[Vercel Lambda] Falling back to minimal health endpoint');

  const express = (await import('express')).default;
  const fallbackApp = express();

  fallbackApp.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'SwasthAI Guardian Backend (Vercel fallback)',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      note: 'Full backend module failed to load. See server logs.',
      moduleError: err.message,
    });
  });

  fallbackApp.get('/api/health/detailed', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'SwasthAI Guardian Backend (Vercel fallback)',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      moduleError: err.message,
      databases: {
        aurora_postgresql: { status: 'unknown (fallback mode)' },
        dynamodb: { status: 'unknown (fallback mode)' },
      },
    });
  });

  fallbackApp.all('/api/*', (req, res) => {
    res.status(503).json({
      error: 'Backend module not available in serverless mode',
      detail: 'The full backend requires Node.js server environment with WebSocket support.',
      moduleError: err.message,
    });
  });

  handler = fallbackApp;
}

export default handler;
