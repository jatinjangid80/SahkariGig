import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://gjriuaexwaklsyctffli.supabase.co';
const supabaseAnonKey = 'sb_publishable_iweaNpx9AFLO3zGSPng7xg_kZTEhcNk';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
async function test() {
  const { data, error } = await supabase.from('reviews').select('*').limit(1);
  console.log("Error:", error);
  console.log("Data:", data);
}
test();
