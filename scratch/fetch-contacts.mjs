import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.backend_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAllForms() {
  const tables = ['contacts', 'sponsor_leads', 'join_requests'];

  for (const table of tables) {
    console.log(`Fetching from table: ${table}...`);
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error querying ${table}:`, error.message);
      continue;
    }

    console.log(`Found ${data.length} entries in '${table}'.`);
    if (data.length > 0) {
      console.log(JSON.stringify(data, null, 2));
    }
    console.log('-'.repeat(40));
  }
}

checkAllForms();
