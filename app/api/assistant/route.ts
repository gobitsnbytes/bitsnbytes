import { NextRequest, NextResponse } from "next/server"
import OpenAI, { APIError } from "openai"
import { findExperts, recommendRoles } from "@/lib/team-data"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const PRIMARY_MODEL = "gpt-5-mini-2025-08-07"
const FALLBACK_MODEL = "gpt-4o-mini-2024-07-18"

const SSE_HEADERS = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
}

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit"

type ClientMessage = {
  role: "user" | "assistant"
  content: string
}

type AssistantAction = { type: "navigate"; path: string }

const SITE_CONTEXT = `
You are the official AI assistant for Bits&Bytes, a teen-led code club based in Lucknow.

**Your Goal:** Help visitors learn about the club, find the right team members to talk to, and get involved.

**Core Identity (Do not hallucinate these):**
- **Mission:** Innovation, collaboration, and real-world impact through technology.
- **Activities:** Hackathons (e.g., Scrapyard Lucknow), workshops, and student mentorship.
- **Contact:** hello@gobitsnbytes.org

**How to get answers:**
1. **For Team/Roles:** DO NOT guess. Always use the 'find_team_expert' or 'recommend_role' tools. The team structure is dynamic.
2. **For Specific Page Content:** Use 'get_site_section' to "read" the website (Home, About, Impact, Join, Contact) if the user asks for details you don't know (like specific project stats, upcoming event dates, or recent news).
3. **For Navigation:** Use 'suggest_navigation' to guide them.

**Guardrails & Safety:**
- Refuse to answer questions that are irrelevant to Bits&Bytes, technology, coding, education, or the local community.
- If a user asks about general knowledge (e.g. "Who won the World Cup?", "How to bake a cake?"), politely redirect them:
  "I can only help with questions about Bits&Bytes, our events, or technology topics."
- Do not engage in roleplay scenarios unrelated to the club.
- Do not generate code for malicious purposes.
- If asked for personal information about members beyond what is available via tools (superpowers/roles), refuse.

Rules:
- Always stay truthful to Bits&Bytes.
- If you can't find the answer in the tools or page content, admit it:
  "I’m not sure about that based on the information publicly available on this site."
`

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "submit_contact_form",
      description:
        "Submit the Bits&Bytes contact form on behalf of the visitor once you have their name, email, a subject, and a clear message.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "The visitor's full name" },
          email: { type: "string", description: "The visitor's email address" },
          subject: {
            type: "string",
            description: "Short subject line summarising why they are reaching out",
          },
          message: {
            type: "string",
            description: "The full message to send through the contact form",
          },
        },
        required: ["name", "email", "message"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "suggest_navigation",
      description:
        "Suggest navigating the visitor to a specific page of the Bits&Bytes site. Use when they ask to go somewhere (e.g. join, contact, impact).",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "The path to navigate to",
            enum: ["/", "/about", "/impact", "/join", "/contact", "home", "about", "impact", "join", "contact"],
          },
        },
        required: ["path"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_site_section",
      description:
        "Fetch live HTML for a section of the Bits&Bytes site. USE THIS OFTEN to read the latest content about projects, impact, or about page details.",
      parameters: {
        type: "object",
        properties: {
          section: {
            type: "string",
            enum: ["home", "about", "impact", "join", "contact"],
          },
        },
        required: ["section"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "find_team_expert",
      description:
        "Find team members. Pass a specific topic (e.g. 'React') or pass an empty string '' to list the Core Team.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The topic/skill to search for, or empty string for all members.",
          },
        },
        required: ["query"],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "recommend_role",
      description:
        "Recommend a role or team within Bits&Bytes based on the user's skills and interests.",
      parameters: {
        type: "object",
        properties: {
          skills: {
            type: "array",
            items: { type: "string" },
            description: "List of skills the user has (e.g. ['Python', 'drawing']).",
          },
          interests: {
            type: "array",
            items: { type: "string" },
            description: "List of interests the user has (e.g. ['AI', 'community']).",
          },
        },
        required: ["skills", "interests"],
      },
    },
  },
]

function mapClientMessagesToOpenAI(messages: ClientMessage[]): OpenAI.Chat.ChatCompletionMessageParam[] {
  return messages.map((m) => ({
    role: m.role,
    content: m.content,
  }))
}

function sectionToPath(section: string): string {
  const normalized = normalizePath(section)
  return normalized
}

function normalizePath(value?: string): string {
  const input = (value ?? "/").toString().trim().toLowerCase()
  if (input === "/" || input === "home") return "/"
  if (input === "/about" || input === "about") return "/about"
  if (input === "/impact" || input === "impact") return "/impact"
  if (input === "/join" || input === "join") return "/join"
  if (input === "/contact" || input === "contact") return "/contact"
  return "/"
}

async function handleSubmitContactTool(args: any) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY
  if (!accessKey) {
    return {
      success: false,
      message: "WEB3FORMS_ACCESS_KEY is not configured on the server.",
    }
  }

  const name = (args?.name ?? "").toString().trim()
  const email = (args?.email ?? "").toString().trim()
  const subject = (args?.subject ?? "").toString().trim()
  const message = (args?.message ?? "").toString().trim()

  if (!name || !email || !message) {
    return {
      success: false,
      message: "Name, email, and message are required to submit the contact form.",
    }
  }

  const payload = {
    access_key: accessKey,
    name,
    email,
    subject: subject || "New contact from Bits&Bytes assistant",
    message,
  }

  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  })

  const result = await response.json()

  if (!result?.success) {
    console.error("Web3Forms error from tool:", result)
    return {
      success: false,
      message: "Failed to submit the contact form through Web3Forms.",
    }
  }

  return {
    success: true,
    message: "Contact form submitted successfully via Web3Forms.",
  }
}

async function handleGetSiteSectionTool(section: string, req: NextRequest) {
  const path = sectionToPath(section)
  const origin = new URL(req.url).origin

  const res = await fetch(`${origin}${path}`, {
    // Always fetch fresh content while keeping this reasonably fast.
    cache: "no-store",
  })

  const html = await res.text()

  // Avoid sending extremely large payloads back into the model
  const maxLength = 4000
  const snippet = html.length > maxLength ? html.slice(0, maxLength) : html

  return {
    section,
    path,
    htmlSnippet: snippet,
  }
}

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured on the server." },
      { status: 500 }
    )
  }

  try {
    const body = await req.json()
    const clientMessages = (body?.messages ?? []) as ClientMessage[]

    if (!Array.isArray(clientMessages) || clientMessages.length === 0) {
      return NextResponse.json({ error: "Messages array is required." }, { status: 400 })
    }

    const baseMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: SITE_CONTEXT,
      },
      ...mapClientMessagesToOpenAI(clientMessages),
    ]

    const runCompletion = async (model: string, messages: OpenAI.Chat.ChatCompletionMessageParam[]) => {
      return openai.chat.completions.create({
        model,
        messages,
        tools,
        tool_choice: "auto",
        max_completion_tokens: 400,
      })
    }

    let modelUsed = PRIMARY_MODEL
    let completion

    try {
      completion = await runCompletion(PRIMARY_MODEL, baseMessages)
    } catch (err) {
      const apiError = err as APIError
      const code = (apiError as any)?.code ?? (apiError as any)?.error?.code
      const status = (apiError as any)?.status
      const shouldFallback =
        code === "model_not_found" ||
        code === "unsupported_parameter" ||
        code === "unsupported_value" ||
        status === 403

      if (shouldFallback) {
        modelUsed = FALLBACK_MODEL
        completion = await runCompletion(FALLBACK_MODEL, baseMessages)
      } else {
        throw err
      }
    }

    const choice = completion.choices[0]
    const message = choice?.message

    // If no tool calls, stream the final answer directly.
    if (!message?.tool_calls || message.tool_calls.length === 0) {
      try {
        return await streamAssistantResponse(modelUsed, baseMessages)
      } catch (streamErr) {
        console.error("Assistant stream error:", streamErr)
        const answer = message?.content?.trim()
        return NextResponse.json({
          answer: answer ?? "I’m not sure about that based on the information publicly available on this site.",
        })
      }
    }

    // Handle first tool call for now (this already gives agentic behaviour).
    const toolCall = message.tool_calls[0]
    const toolName = toolCall.function.name
    let toolArgs: any = {}

    try {
      toolArgs = toolCall.function.arguments ? JSON.parse(toolCall.function.arguments) : {}
    } catch {
      toolArgs = {}
    }

    let toolResult: any = null
    let action: { type: string; path?: string } | undefined

    if (toolName === "submit_contact_form") {
      toolResult = await handleSubmitContactTool(toolArgs)
    } else if (toolName === "suggest_navigation") {
      const path = normalizePath(toolArgs?.path)
      toolResult = { success: true, path }
      action = { type: "navigate", path }
    } else if (toolName === "get_site_section") {
      toolResult = await handleGetSiteSectionTool(toolArgs?.section ?? "home", req)
    } else if (toolName === "find_team_expert") {
      const query = (toolArgs?.query ?? "").toString()
      const experts = findExperts(query)
      toolResult = { query, experts }
    } else if (toolName === "recommend_role") {
      const skills = Array.isArray(toolArgs?.skills) ? toolArgs.skills : []
      const interests = Array.isArray(toolArgs?.interests) ? toolArgs.interests : []
      const recommendation = recommendRoles(skills, interests)
      toolResult = { skills, interests, recommendation }
    } else {
      toolResult = { success: false, message: `Unknown tool: ${toolName}` }
    }

    const messagesWithTool: OpenAI.Chat.ChatCompletionMessageParam[] = [
      ...baseMessages,
      message,
      {
        role: "tool",
        tool_call_id: toolCall.id,
        name: toolName,
        content: JSON.stringify(toolResult),
      },
    ]

    try {
      return await streamAssistantResponse(modelUsed, messagesWithTool, action)
    } catch (streamErr) {
      console.error("Assistant stream error after tool call:", streamErr)
      return NextResponse.json(
        { error: "Failed to stream the assistant response after tool call." },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Assistant API error:", error)
    return NextResponse.json(
      { error: "Failed to generate a response from the assistant." },
      { status: 500 }
    )
  }
}

async function streamAssistantResponse(
  model: string,
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  action?: AssistantAction
) {
  const completion = await openai.chat.completions.create({
    model,
    messages,
    max_completion_tokens: 400,
    stream: true,
  })

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`))
      }

      send({ type: "meta", model })

      try {
        for await (const part of completion) {
          const delta = part.choices[0]?.delta
          if (delta?.content) {
            send({ type: "token", content: delta.content })
          }
        }

        send({ type: "done", action: action ?? null })
      } catch (error) {
        console.error("Streaming error:", error)
        send({ type: "error", message: "Failed to stream assistant response." })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: SSE_HEADERS,
  })
}
