import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import * as fs from "fs"
import * as path from "path"

dotenv.config({ path: ".env" })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.backend_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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
  console.log("Clearing existing embeddings from site_embeddings...")
  const { error: clearError } = await supabase
    .from("site_embeddings")
    .delete()
    .not("id", "is", null)

  if (clearError) {
    console.error("Failed to clear existing embeddings:", clearError)
    return
  }

  const filePaths = [
    { absPath: path.resolve(process.cwd(), "public/llms.txt"), endpoint: "/llms.txt" },
    { absPath: path.resolve(process.cwd(), "agents.md"), endpoint: "/agents.md" }
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

  for (const item of siteContent) {
    const safeSection = normalizeSectionKey(item.section)
    const key = `${item.page}-${safeSection}`

    console.log(`Embedding ${key} with ${EMBEDDING_MODEL} (${EMBEDDING_DIMENSIONS} dims)...`)
    try {
      const embedding = await generateEmbedding(item.content.replace(/\n/g, " ").trim())
      if (!Array.isArray(embedding) || embedding.length !== EMBEDDING_DIMENSIONS) {
        console.error(`Unexpected embedding shape for ${key}:`, embedding?.length)
        continue
      }

      const { error } = await supabase.from("site_embeddings").insert({
        page: item.page,
        section: safeSection,
        content: item.content,
        embedding,
      })
      if (error) console.error(`Failed to insert ${key}:`, error)
      else console.log(`Success inserted ${key}`)
    } catch (e) {
      console.error(`Local embedding failed for ${key}:`, e)
    }
  }

  console.log("Done embedding site.")
}

run()
