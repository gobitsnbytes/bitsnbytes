import * as dotenv from "dotenv"
import * as fs from "fs"
import * as path from "path"

dotenv.config({ path: ".env" })

const upstashUrl = process.env.UPSTASH_VECTOR_REST_URL
const upstashToken = process.env.UPSTASH_VECTOR_REST_TOKEN
const hackclubProxyApiKey = process.env.HACKCLUB_PROXY_API_KEY

if (!upstashUrl || !upstashToken || !hackclubProxyApiKey) {
  console.warn("⚠️ Skipping site embeddings auto-generation: environment variables are missing (UPSTASH_VECTOR_REST_URL, UPSTASH_VECTOR_REST_TOKEN, or HACKCLUB_PROXY_API_KEY).")
  process.exit(0)
}

const EMBEDDING_MODEL = "openai/text-embedding-3-small"
const EMBEDDING_DIMENSIONS = 1536

type SiteChunk = { page: string; section: string; content: string }

function normalizeSectionKey(section: string): string {
  return section.substring(0, 50).replace(/[^a-zA-Z0-9_-]/g, "_")
}

function parseMarkdownToBlocks(markdown: string, page: string): SiteChunk[] {
  const blocks: SiteChunk[] = []
  const lines = markdown.split("\n")

  let currentSection = "Overview"
  let currentLines: string[] = []

  const flush = () => {
    const content = currentLines.join("\n").trim()
    if (!content) return

    const formattedContent =
      currentSection === "Overview"
        ? content
        : `## ${currentSection}\n\n${content}`

    blocks.push({
      page,
      section: currentSection,
      content: formattedContent,
    })
  }

  for (const line of lines) {
    const headerMatch = line.match(/^##\s+(.+)$/)

    if (headerMatch) {
      flush()
      currentSection = headerMatch[1].trim()
      currentLines = []
      continue
    }

    currentLines.push(line)
  }

  flush()
  return blocks
}

async function generateEmbedding(inputText: string): Promise<number[] | null> {
  const apiKey = process.env.HACKCLUB_PROXY_API_KEY
  if (!apiKey) {
    console.error("HACKCLUB_PROXY_API_KEY is not configured")
    return null
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
      input: inputText,
    }),
  })

  let response: any
  const textResponse = await raw.text()
  try {
    response = JSON.parse(textResponse)
  } catch {
    console.error("Embedding API returned non-JSON response")
    return null
  }

  if (response?.error?.message) {
    console.error("Embedding API error:", response.error.message)
    return null
  }

  if (!raw.ok) {
    console.error(`Embedding API HTTP ${raw.status}:`, response)
    return null
  }

  const embedding = response?.data?.[0]?.embedding
  if (!Array.isArray(embedding)) {
    return null
  }

  return embedding
}

async function run() {
  console.log("Clearing existing embeddings from Upstash Vector...")
  const clearRes = await fetch(`${upstashUrl}/reset`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${upstashToken}`,
    },
  })

  if (!clearRes.ok) {
    console.error("Failed to clear existing embeddings:", await clearRes.text())
    return
  }
  console.log("Upstash Vector Index cleared successfully.")

  const rootDir = process.cwd()
  const mdFiles = fs.readdirSync(rootDir).filter(f => f.endsWith(".md"))
  const publicDir = path.join(rootDir, "public")
  const txtFiles = fs.existsSync(publicDir) ? fs.readdirSync(publicDir).filter(f => f.endsWith(".txt")) : []

  const filePaths = [
    ...mdFiles.map(f => ({ absPath: path.resolve(rootDir, f), endpoint: `/${f}` })),
    ...txtFiles.map(f => ({ absPath: path.resolve(publicDir, f), endpoint: `/${f}` }))
  ]

  let siteContent: SiteChunk[] = []

  // Load and parse markdown
  for (const { absPath, endpoint } of filePaths) {
    if (fs.existsSync(absPath)) {
      const markdown = fs.readFileSync(absPath, "utf-8")
      const blocks = parseMarkdownToBlocks(markdown, endpoint)
      siteContent = siteContent.concat(blocks)
      console.log(`Parsed ${blocks.length} chunks from ${endpoint}`)
    } else {
      console.warn(`File not found: ${absPath}`)
    }
  }

  console.log(`Embedding ${siteContent.length} chunks...`)

  const upsertBatch: any[] = []

  for (const item of siteContent) {
    const safeSection = normalizeSectionKey(item.section)
    const key = `${item.page}-${safeSection}`

    console.log(`Generating embedding for ${key}...`)
    try {
      const embedding = await generateEmbedding(item.content.replace(/\n/g, " ").trim())
      if (!Array.isArray(embedding) || embedding.length !== EMBEDDING_DIMENSIONS) {
        console.error(`Unexpected embedding shape for ${key}:`, embedding?.length)
        continue
      }

      upsertBatch.push({
        id: key,
        vector: embedding,
        metadata: {
          page: item.page,
          section: safeSection,
          content: item.content,
        },
      })
      console.log(`Success queued ${key}`)
    } catch (e) {
      console.error(`Embedding generation failed for ${key}:`, e)
    }
  }

  if (upsertBatch.length > 0) {
    console.log(`Upserting ${upsertBatch.length} vectors to Upstash in batch...`)
    const res = await fetch(`${upstashUrl}/upsert`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${upstashToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(upsertBatch),
    })

    if (!res.ok) {
      console.error("Batch upsert failed:", await res.text())
    } else {
      console.log("Successfully upserted all vectors to Upstash!")
    }
  }

  console.log("Done embedding site.")
}

run()
