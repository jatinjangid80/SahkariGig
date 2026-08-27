const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ MONGODB_URI is not configured in .env. Running with in-memory status check fallback.');
    return { connected: false, mode: 'fallback' };
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB Atlas connected successfully.');
    return { connected: true, mode: 'atlas' };
  } catch (err) {
    console.error('❌ MongoDB Atlas connection error:', err.message);
    return { connected: false, error: err.message };
  }
}

module.exports = connectDB;
