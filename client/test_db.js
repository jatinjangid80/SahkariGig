import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read config to get supabase URL and KEY
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://gjriuaexwaklsyctffli.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'dummy'; // need to get this from client/src/supabase.ts

console.log("Reading supabase.ts");
const content = fs.readFileSync('src/supabase.ts', 'utf-8');
const urlMatch = content.match(/VITE_SUPABASE_URL\s*\|\|\s*'([^']+)'/);
const keyMatch = content.match(/VITE_SUPABASE_ANON_KEY\s*\|\|\s*'([^']+)'/);

if (!urlMatch || !keyMatch) {
  console.log("Could not find supabase credentials");
  process.exit(1);
}

const supabase = createClient(urlMatch[1], keyMatch[1]);

async function check() {
  const { data: projs } = await supabase.from('projects').select('*');
  console.log('Projects:', projs);
  
  const { data: sups } = await supabase.from('supervisors').select('*');
  console.log('Supervisors:', sups);
  
  const { data: workers } = await supabase.from('workers').select('*').limit(3);
  console.log('Workers:', workers);
}
check();
