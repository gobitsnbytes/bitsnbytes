import { NextRequest, NextResponse } from "next/server"
import OpenAI, { APIError } from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const PRIMARY_MODEL = "gpt-5-nano"
const FALLBACK_MODEL = "gpt-4.1-mini"

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit"

type ClientMessage = {
  role: "user" | "assistant"
  content: string
}

const SITE_CONTEXT = `
You are the official AI assistant for Bits&Bytes, a teen-led code club based in Lucknow.

Key facts:
- Bits&Bytes is a community of teen developers focused on innovation, collaboration, and real-world impact through technology.
- They host hackathons, run workshops on topics like web development and AI/ML, and encourage teens to connect and collaborate across schools.
- The club has 80+ members from around 10 different schools and has built 50+ projects.
- Bits&Bytes hosted Scrapyard Lucknow 2024, one of the first high-schooler-led hackathons in Lucknow, bringing together 40+ participants to build solutions to real-world problems and showcase projects.
- The team includes founders and leads for technical work, branding, content, outreach, design, and social media.
- Students can join by filling out the join form on the site, sharing their name, email, school, experience level, interests (e.g. web dev, mobile apps, AI/ML, game dev, design), and a short message about their goals.
- The club can be reached via email at hello@lucknow.codes.
 
You are AGENTIC but safe:
- You can call tools to submit the contact form on a visitor's behalf once you have their name, email, subject, and message.
- You can call tools to suggest navigation to a specific page (home, about, impact, join, contact). Use this when the user asks to "take me to..." or clearly wants a specific page.
- You can call tools to fetch live HTML for key site sections (home, about, impact, join, contact) when you need fresher or more detailed information.

Rules:
- Always stay truthful to Bits&Bytes and the site content.
- If you are asked about anything not covered by the site (e.g. internal operations, personal data, private contact details beyond hello@lucknow.codes, exact dates other than Scrapyard Lucknow 2024, or financials), say:
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
            enum: ["/", "/about", "/impact", "/join", "/contact"],
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
        "Fetch live HTML for a section of the Bits&Bytes site so you can answer with up-to-date, detailed information.",
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
]

function mapClientMessagesToOpenAI(messages: ClientMessage[]): OpenAI.Chat.ChatCompletionMessageParam[] {
  return messages.map((m) => ({
    role: m.role,
    content: m.content,
  }))
}

function sectionToPath(section: string): string {
  switch (section) {
    case "about":
      return "/about"
    case "impact":
      return "/impact"
    case "join":
      return "/join"
    case "contact":
      return "/contact"
    case "home":
    default:
      return "/"
  }
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
`

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
        temperature: 0.3,
        max_tokens: 400,
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

      if (code === "model_not_found" || status === 403) {
        modelUsed = FALLBACK_MODEL
        completion = await runCompletion(FALLBACK_MODEL, baseMessages)
      } else {
        throw err
      }
    }

    const choice = completion.choices[0]
    const message = choice?.message

    // If no tool calls, just return the answer.
    if (!message?.tool_calls || message.tool_calls.length === 0) {
      const answer = message?.content?.trim()
      return NextResponse.json({
        answer: answer ?? "I’m not sure about that based on the information publicly available on this site.",
      })
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
      const path = sectionToPath(toolArgs?.path ?? "/")
      toolResult = { success: true, path }
      action = { type: "navigate", path }
    } else if (toolName === "get_site_section") {
      toolResult = await handleGetSiteSectionTool(toolArgs?.section ?? "home", req)
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

    const finalCompletion = await openai.chat.completions.create({
      model: modelUsed,
      messages: messagesWithTool,
      temperature: 0.3,
      max_tokens: 400,
    })

    const finalAnswer = finalCompletion.choices[0]?.message?.content?.trim()

    return NextResponse.json({
      answer: finalAnswer ?? "I’ve completed the requested action.",
      action,
    })
  } catch (error) {
    console.error("Assistant API error:", error)
    return NextResponse.json(
      { error: "Failed to generate a response from the assistant." },
      { status: 500 }
    )
  }
}


