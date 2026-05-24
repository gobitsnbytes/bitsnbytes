import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.backend_SUPABASE_URL
const serviceRoleKey = process.env.backend_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL or service role key in env!")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function main() {
  console.log("Attempting to delete all rows from site_embeddings using service role key...")
  const { data, error } = await supabase
    .from("site_embeddings")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000") // delete all rows
  
  if (error) {
    console.error("Failed to delete rows:", error)
  } else {
    console.log("Deletion successful! Result data:", data)
  }

  // Count check
  const { count, error: countError } = await supabase
    .from("site_embeddings")
    .select("*", { count: "exact", head: true })
  
  if (countError) {
    console.error("Error fetching count:", countError)
  } else {
    console.log("Total embeddings remaining in site_embeddings:", count)
  }
}

main().catch(console.error)
