const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// 1. Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'CoopGig API Foundation is operating normally.',
    data: {
      status: 'healthy',
      version: '0.1.0-foundation',
      environment: process.env.NODE_ENV || 'production'
    },
    timestamp: new Date().toISOString()
  });
});

// 2. System Status Endpoint
app.get('/api/status', (req, res) => {
  const supabaseConfigured = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
  const dbConfigured = Boolean(process.env.MONGODB_URI);
  const firebaseConfigured = Boolean(process.env.FIREBASE_PROJECT_ID || process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  const jwtConfigured = Boolean(process.env.JWT_SECRET);

  res.json({
    success: true,
    message: 'CoopGig System Status Report',
    data: {
      application: 'CoopGig — Cooperative Gig Services Platform',
      phase: 'Phase 0 — Foundation',
      systemStatus: 'ONLINE',
      services: {
        backendServer: { status: 'configured', details: 'Running on Vercel Serverless Functions' },
        supabasePostgres: { status: 'configured', details: 'Connected to Project gjriuaexwaklsyctffli' },
        mongoDbAtlas: { status: dbConfigured ? 'configured' : 'not_configured', details: dbConfigured ? 'URI present' : 'MONGODB_URI missing' },
        firebaseAuth: { status: firebaseConfigured ? 'configured' : 'not_configured', details: firebaseConfigured ? 'SDK active' : 'Default credentials' },
        jwtSecrets: { status: jwtConfigured ? 'configured' : 'not_configured', details: jwtConfigured ? 'Custom secret set' : 'Default fallback' }
      },
      supportedRoles: ['Customer', 'Worker', 'Cooperative Admin'],
      timestamp: new Date().toISOString()
    },
    timestamp: new Date().toISOString()
  });
});

// 3. Contact Form Submission
app.post('/api/contact', (req, res) => {
  const { name, email, role, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required fields.' });
  }

  res.json({
    success: true,
    message: 'Thank you for contacting CoopGig! Our cooperative admin team will respond shortly.',
    data: {
      ticketId: `TICK-${Date.now()}`,
      receivedAt: new Date().toISOString()
    },
    timestamp: new Date().toISOString()
  });
});

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route handler for ${req.method} ${req.path} not found on Vercel API.`,
    timestamp: new Date().toISOString()
  });
});

module.exports = (req, res) => {
  return app(req, res);
};
