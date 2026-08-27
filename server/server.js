const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const { sendSuccess, sendError } = require('./utils/apiResponse');

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: '*' }));
app.use(express.json());

const PORT = process.env.PORT || 5001;

// Initialize DB connection
connectDB();

// --- PHASE 0 FOUNDATION ENDPOINTS ---

// 1. Health Check Endpoint
app.get('/api/health', (req, res) => {
  return sendSuccess(res, {
    status: 'healthy',
    version: '0.1.0-foundation',
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development'
  }, 'CoopGig API Foundation is operating normally.');
});

// 2. System Status Endpoint (Reports configuration status safely without exposing secret values)
app.get('/api/status', (req, res) => {
  const dbConfigured = Boolean(process.env.MONGODB_URI);
  const firebaseConfigured = Boolean(process.env.FIREBASE_PROJECT_ID || process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  const jwtConfigured = Boolean(process.env.JWT_SECRET);

  return sendSuccess(res, {
    application: 'CoopGig — Cooperative Gig Services Platform',
    phase: 'Phase 0 — Foundation',
    systemStatus: 'ONLINE',
    services: {
      backendServer: { status: 'configured', details: `Running on port ${PORT}` },
      mongoDbAtlas: { status: dbConfigured ? 'configured' : 'not_configured', details: dbConfigured ? 'URI present' : 'MONGODB_URI missing' },
      firebaseAuth: { status: firebaseConfigured ? 'configured' : 'not_configured', details: firebaseConfigured ? 'SDK active' : 'Default credentials' },
      jwtSecrets: { status: jwtConfigured ? 'configured' : 'not_configured', details: jwtConfigured ? 'Custom secret set' : 'Default fallback' }
    },
    supportedRoles: ['Customer', 'Worker', 'Cooperative Admin'],
    timestamp: new Date().toISOString()
  }, 'CoopGig System Status Report');
});

// 3. Contact Form Submission (Phase 0 Foundation API)
app.post('/api/contact', (req, res) => {
  const { name, email, role, message } = req.body;
  if (!name || !email || !message) {
    return sendError(res, 'Name, email, and message are required fields.', 400);
  }

  console.log(`[Contact Submission] Name: ${name}, Email: ${email}, Role: ${role || 'Customer'}`);
  return sendSuccess(res, {
    ticketId: `TICK-${Date.now()}`,
    receivedAt: new Date().toISOString()
  }, 'Thank you for contacting CoopGig! Our cooperative admin team will respond shortly.');
});

// 4. Global 404 Route Handler
app.use((req, res) => {
  return sendError(res, `Route handler for ${req.method} ${req.path} not found.`, 404);
});

// 5. Global Error Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  return sendError(res, 'Internal Server Error', 500, err.message);
});

// --- SOCKET.IO REAL-TIME CHAT (Dedicated Server Mode) ---
if (require.main === module) {
  const { Server } = require('socket.io');
  const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
  });

  const messages = [];

  io.on('connection', (socket) => {
    console.log('⚡ Client connected to Socket.io:', socket.id);

    socket.on('joinBooking', (bookingId) => {
      socket.join(bookingId);
    });

    socket.on('sendMessage', ({ bookingId, senderId, senderType, senderName, text }) => {
      const newMessage = {
        id: `msg-${Date.now()}`,
        bookingId,
        senderType,
        senderId,
        senderName,
        text,
        createdAt: new Date().toISOString()
      };
      messages.push(newMessage);
      io.to(bookingId).emit('newMessage', newMessage);
    });
  });

  server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 CoopGig Foundation Backend API Active!`);
    console.log(`📡 Listening on Port: ${PORT}`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
