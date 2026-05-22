import { supabase } from "./supabase"

const EMBEDDING_MODEL = "openai/text-embedding-3-small"
const EMBEDDING_DIMENSIONS = 1536

export async function generateEmbedding(text: string): Promise<number[]> {
  const input = text.replace(/\n/g, " ").trim()
  if (!input) {
    throw new Error("Cannot generate embedding for empty input")
  }

  const apiKey = process.env.HACKCLUB_PROXY_API_KEY
  if (!apiKey) {
    throw new Error("HACKCLUB_PROXY_API_KEY is not configured")
  }

  const raw = await fetch("https://ai.hackclub.com/proxy/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      dimensions: EMBEDDING_DIMENSIONS,
      input,
    }),
  })

  const textResponse = await raw.text()

  let response: any
  try {
    response = JSON.parse(textResponse)
  } catch {
    throw new Error("Embedding API returned non-JSON response")
  }

  if (response?.error?.message) {
    throw new Error(`Embedding API error: ${response.error.message}`)
  }

  if (!raw.ok) {
    try {
      throw new Error(`Embedding API HTTP ${raw.status}: ${JSON.stringify(response)}`)
    } catch {
      throw new Error(`Embedding API HTTP ${raw.status}`)
    }
  }

  const embedding = response?.data?.[0]?.embedding
  if (!Array.isArray(embedding) || embedding.length === 0) {
    console.error("Embedding API returned an unexpected payload", {
      responseType: typeof response,
      hasData: Array.isArray(response?.data),
      firstItemType: typeof response?.data?.[0],
      model: response?.model,
    })
    throw new Error("Embedding API returned no embedding vector")
  }

  return embedding
}

export async function searchSiteContent(query: string, matchCount = 6): Promise<string[]> {
  let queryEmbedding: number[]
  try {
    queryEmbedding = await generateEmbedding(query)
  } catch (error) {
    console.error("Failed to generate query embedding:", error)
    return []
  }

  // This relies on a Postgres function:
  /*
    create or replace function match_site_sections (
      query_embedding vector(1536),
      match_threshold float,
      match_count int
    )
    returns table (
      id uuid,
      page text,
      section text,
      content text,
      similarity float
    )
    language sql stable
    as $$
      select
        site_embeddings.id,
        site_embeddings.page,
        site_embeddings.section,
        site_embeddings.content,
        1 - (site_embeddings.embedding <=> query_embedding) as similarity
      from site_embeddings
      where 1 - (site_embeddings.embedding <=> query_embedding) > match_threshold
      order by site_embeddings.embedding <=> query_embedding
      limit match_count;
    $$;
  */

  const { data, error } = await supabase.rpc("match_site_sections", {
    query_embedding: queryEmbedding,
    match_threshold: 0.25, // lowered to 0.25 to prevent empty results on shorter queries
    match_count: matchCount, // was 3 — too few for multi-part questions
  })

  if (error) {
    console.error("Error searching embeddings:", error)
    return []
  }

  return (data as any[]).map((d) => d.content)
}
