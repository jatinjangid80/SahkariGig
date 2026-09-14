import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const content = fs.readFileSync('src/supabase.ts', 'utf-8');
const urlMatch = content.match(/VITE_SUPABASE_URL\s*\|\|\s*'([^']+)'/);
const keyMatch = content.match(/VITE_SUPABASE_ANON_KEY\s*\|\|\s*'([^']+)'/);
const supabase = createClient(urlMatch[1], keyMatch[1]);

async function seed() {
  // Check if supervisor exists
  let { data: sups } = await supabase.from('supervisors').select('*');
  let supervisor_id;
  if (sups.length === 0) {
    const { data, error } = await supabase.from('supervisors').insert({
      name: 'Er. Vikramaditya Rathore',
      phone: '+91 9876543210',
      coop_name: 'Rajasthan Engineering Coop'
    }).select();
    if (error) console.error("Sup error", error);
    supervisor_id = data[0].id;
  } else {
    supervisor_id = sups[0].id;
  }

  // Check if project exists
  let { data: projs } = await supabase.from('projects').select('*');
  if (projs.length === 0) {
    const { data, error } = await supabase.from('projects').insert({
      name: 'Single Floor Villa — G+0',
      customer_name: 'Rajesh Kumar',
      supervisor_id: supervisor_id,
      location: 'Jaipur, Rajasthan',
      start_date: '15 Sep'
    }).select();
    if (error) console.error("Proj error", error);
    console.log("Seeded project", data[0].id);
  } else {
    console.log("Project exists", projs[0].id);
  }
}
seed();
