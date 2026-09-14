import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://gjriuaexwaklsyctffli.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_iweaNpx9AFLO3zGSPng7xg_kZTEhcNk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase.from('projects').select('*').limit(1);
  if (error) {
    console.error("Error fetching projects:", error);
  } else {
    console.log("Projects table exists. Data:", data);
  }
}
check();
