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

const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;


const PORT = process.env.PORT || 5001;

// Initialize DB connection
connectDB();

// Import API Routes
const authRoutes = require('./routes/authRoutes');
const workerRoutes = require('./routes/workerRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/categories', categoryRoutes);

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
  const supabaseConfigured = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);

  return sendSuccess(res, {
    application: 'CoopGig — Cooperative Gig Services Platform',
    phase: 'Phase 0 — Foundation',
    systemStatus: 'ONLINE',
    services: {
      backendServer: { status: 'configured', details: `Running on port ${PORT}` },
      supabasePostgres: { status: supabaseConfigured ? 'configured' : 'not_configured', details: supabaseConfigured ? 'Connected to Project gjriuaexwaklsyctffli' : 'Missing Supabase keys' },
      supabaseAuth: { status: supabaseConfigured ? 'configured' : 'not_configured', details: supabaseConfigured ? 'Auth Provider active' : 'Missing configuration' }
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

    socket.on('joinBooking', async (bookingId) => {
      socket.join(bookingId);
      // Fetch chat history from Supabase
      if (supabase) {
        const { data: history, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('booking_id', bookingId)
          .order('created_at', { ascending: true });
        
        if (!error && history) {
          const formattedHistory = history.map(msg => ({
            id: msg.id,
            bookingId: msg.booking_id,
            senderType: msg.sender_type,
            senderId: msg.sender_id,
            senderName: msg.sender_name,
            text: msg.text,
            createdAt: msg.created_at
          }));
          socket.emit('chatHistory', formattedHistory);
        } else {
          console.error("Error fetching chat history from Supabase:", error);
          socket.emit('chatHistory', []);
        }
      } else {
        const history = messages.filter(m => m.bookingId === bookingId);
        socket.emit('chatHistory', history);
      }
    });

    socket.on('sendMessage', async ({ bookingId, senderId, senderType, senderName, text }) => {
      let newMessage = {
        booking_id: bookingId,
        sender_type: senderType,
        sender_id: senderId,
        sender_name: senderName,
        text
      };
      
      let emittedMessage = {
        id: `msg-${Date.now()}`,
        bookingId,
        senderType,
        senderId,
        senderName,
        text,
        createdAt: new Date().toISOString()
      };

      if (supabase) {
        const { data, error } = await supabase
          .from('chat_messages')
          .insert(newMessage)
          .select()
          .single();
          
        if (!error && data) {
           emittedMessage = {
             id: data.id,
             bookingId: data.booking_id,
             senderType: data.sender_type,
             senderId: data.sender_id,
             senderName: data.sender_name,
             text: data.text,
             createdAt: data.created_at
           };
        } else {
          console.error("Error saving message to Supabase:", error);
        }
      } else {
        messages.push(emittedMessage);
      }
      
      io.to(bookingId).emit('newMessage', emittedMessage);
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
