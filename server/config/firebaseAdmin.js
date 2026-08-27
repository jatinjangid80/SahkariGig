let admin;
try {
  admin = require('firebase-admin');
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
  }
} catch (err) {
  console.warn('⚠️ Firebase Admin SDK running in mock/demo mode:', err.message);
  admin = null;
}

module.exports = admin;
