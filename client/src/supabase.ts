import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gjriuaexwaklsyctffli.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_iweaNpx9AFLO3zGSPng7xg_kZTEhcNk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
