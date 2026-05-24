import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import { searchSiteContent } from "../lib/rag"

dotenv.config({ path: ".env" })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function main() {
  console.log("--- Checking site_embeddings table count ---")
  const { count, error } = await supabase
    .from("site_embeddings")
    .select("*", { count: "exact", head: true })
  
  if (error) {
    console.error("Error fetching count:", error)
  } else {
    console.log("Total embeddings in site_embeddings:", count)
  }

  console.log("\n--- Sample records from site_embeddings ---")
  const { data: records, error: fetchError } = await supabase
    .from("site_embeddings")
    .select("id, page, section, content")
    .limit(10)

  if (fetchError) {
    console.error("Error fetching samples:", fetchError)
  } else {
    for (const r of records || []) {
      console.log(`ID: ${r.id} | Page: ${r.page} | Section: ${r.section}`)
      console.log(`Content snippet: ${r.content.substring(0, 150).replace(/\n/g, " ")}...\n`)
    }
  }

  console.log("\n--- Testing RAG search for 'who started bits and bytes' ---")
  const results = await searchSiteContent("who started bits and bytes")
  console.log("Search Results:")
  results.forEach((res, i) => {
    console.log(`[Result ${i + 1}]:`)
    console.log(res)
    console.log("-".repeat(40))
  })
}

main().catch(console.error)
