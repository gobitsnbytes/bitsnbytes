import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import { generateEmbedding } from "../lib/rag"

dotenv.config({ path: ".env" })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return -1
  let dot = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  if (normA === 0 || normB === 0) return -1
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

async function main() {
  const query = "who started bits and bytes"
  console.log(`Generating query embedding for: "${query}"...`)
  const qEmbed = await generateEmbedding(query)
  console.log("Query embedding length:", qEmbed.length)
  console.log("Query embedding first 5 values:", qEmbed.slice(0, 5))

  console.log("\nFetching all site_embeddings to compute similarity in JS...")
  const { data: records, error } = await supabase
    .from("site_embeddings")
    .select("id, page, section, content, embedding")
    .limit(20)

  if (error) {
    console.error("Failed to fetch records:", error)
    return
  }

  console.log(`Fetched ${records.length} records.`)
  for (const r of records) {
    const embedStr = r.embedding
    let embedArray: number[] = []
    if (typeof embedStr === "string") {
      // Sometimes supabase returns vector as a string e.g. "[0.1, 0.2, ...]"
      embedArray = JSON.parse(embedStr)
    } else if (Array.isArray(embedStr)) {
      embedArray = embedStr
    }

    const sim = cosineSimilarity(qEmbed, embedArray)
    console.log(`ID: ${r.id} | Page: ${r.page} | Section: ${r.section}`)
    console.log(`Embedding length: ${embedArray.length}`)
    console.log(`First 5 values: ${embedArray.slice(0, 5)}`)
    console.log(`JS Cosine Similarity: ${sim.toFixed(4)}`)
    console.log(`Snippet: ${r.content.substring(0, 100).replace(/\n/g, " ")}...\n`)
  }

  console.log("\nCalling match_site_sections RPC via Supabase client...")
  const { data: rpcData, error: rpcError } = await supabase.rpc("match_site_sections", {
    query_embedding: qEmbed,
    match_threshold: 0.0, // Set to 0.0 to see all similarities
    match_count: 5
  })

  if (rpcError) {
    console.error("RPC Error:", rpcError)
  } else {
    console.log("RPC returned:", rpcData)
  }
}

main().catch(console.error)
