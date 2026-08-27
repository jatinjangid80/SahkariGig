const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://gjriuaexwaklsyctffli.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_iweaNpx9AFLO3zGSPng7xg_kZTEhcNk';

let supabase = null;

try {
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false
      }
    });
    console.log('⚡ Supabase PostgreSQL Client initialized successfully.');
  } else {
    console.warn('⚠️ Supabase credentials missing in environment.');
  }
} catch (err) {
  console.error('❌ Failed to initialize Supabase client:', err.message);
}

module.exports = {
  supabase,
  supabaseUrl,
  isConfigured: Boolean(supabase)
};
