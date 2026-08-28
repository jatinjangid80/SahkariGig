const express = require('express');
const router = express.Router();
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { authenticate } = require('../middleware/authMiddleware');

// In-memory store fallback for users when DB is connecting
const inMemoryUsers = [
  { id: 'admin-1', email: 'admin@gmail.com', name: 'Cooperative Admin', role: 'Admin' },
  { id: 'worker-1', email: 'rajesh@sahkarigig.org', name: 'Rajesh Kumar', role: 'Worker', status: 'active' },
  { id: 'customer-1', email: 'ananya@gmail.com', name: 'Ananya Sharma', role: 'Customer' }
];

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { email, password, fullName, role } = req.body;

  if (!email || !password || !fullName) {
    return sendError(res, 'Full name, email, and password are required.', 400);
  }

  const existingUser = inMemoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return sendError(res, 'An account with this email already exists.', 400);
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    email,
    name: fullName,
    role: role || 'Customer',
    status: role === 'Worker' ? 'pending' : 'active',
    createdAt: new Date().toISOString()
  };

  inMemoryUsers.push(newUser);

  // Generate simple base64 token
  const token = Buffer.from(JSON.stringify(newUser)).toString('base64');

  return sendSuccess(res, {
    user: newUser,
    token
  }, 'Account registered successfully!', 201);
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 'Email and password are required.', 400);
  }

  let user = inMemoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    // Auto-create account for smooth demo experience
    user = {
      id: `usr-${Date.now()}`,
      email,
      name: email.split('@')[0],
      role: email.includes('admin') ? 'Admin' : (email.includes('worker') ? 'Worker' : 'Customer'),
      status: 'active',
      createdAt: new Date().toISOString()
    };
    inMemoryUsers.push(user);
  }

  const token = Buffer.from(JSON.stringify(user)).toString('base64');

  return sendSuccess(res, {
    user,
    token
  }, 'Logged in successfully!');
});

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
  return sendSuccess(res, { user: req.user }, 'Current user profile retrieved.');
});

module.exports = router;
