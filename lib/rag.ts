// Querying Upstash Vector DB instead of Supabase

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

  const upstashUrl = process.env.UPSTASH_VECTOR_REST_URL
  const upstashToken = process.env.UPSTASH_VECTOR_REST_TOKEN

  if (!upstashUrl || !upstashToken) {
    console.error("Upstash Vector credentials are not configured in RAG search")
    return []
  }

  try {
    const res = await fetch(`${upstashUrl}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${upstashToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vector: queryEmbedding,
        topK: matchCount,
        includeMetadata: true,
      }),
    })

    if (!res.ok) {
      console.error("Upstash query failed:", await res.text())
      return []
    }

    const data = await res.json()
    const results = data?.result || []
    
    // Filter results using similarity score threshold (0.25)
    const filtered = results.filter((r: any) => r.score >= 0.25)
    return filtered.map((r: any) => r.metadata?.content || "")
  } catch (err) {
    console.error("Error querying Upstash Vector:", err)
    return []
  }
}
