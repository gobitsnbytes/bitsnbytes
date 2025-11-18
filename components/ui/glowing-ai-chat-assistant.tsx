"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import type { KeyboardEvent, ChangeEvent, MouseEvent as ReactMouseEvent } from "react"
import { useRouter } from "next/navigation"

import { Mic, Send, Info, Bot, X } from "lucide-react"

interface ChatMessage {
  id: number
  role: "user" | "assistant"
  content: string
}

const MAX_CHARS = 2000
const MAX_HISTORY = 40
const STORAGE_KEY = "bb-floating-assistant-state-v1"
const QUICK_PROMPTS = [
  "What is Bits&Bytes?",
  "Show me the impact stats.",
  "How can I join the club?",
  "Tell me about the core team.",
  "Take me to the contact page.",
]

type StreamPayload =
  | { type: "meta"; model: string }
  | { type: "token"; content: string }
  | { type: "done"; action?: { type: string; path?: string } | null }
  | { type: "error"; message?: string }

type StoredAssistantState = {
  messages?: ChatMessage[]
  isChatOpen?: boolean
  draft?: string
}

const FloatingAiAssistant: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [charCount, setCharCount] = useState(0)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [modelName, setModelName] = useState("gpt-4o-mini")
  const [hasHydrated, setHasHydrated] = useState(false)

  const chatRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const nextIdRef = useRef(1)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamControllerRef = useRef<AbortController | null>(null)
  const router = useRouter()

  const appendMessage = useCallback((newMessage: ChatMessage) => {
    setMessages((prev) => {
      const updated = [...prev, newMessage]
      return updated.length > MAX_HISTORY ? updated.slice(updated.length - MAX_HISTORY) : updated
    })
  }, [])

  const updateMessageContent = useCallback((messageId: number, updater: (prev: string) => string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, content: updater(m.content) } : m))
    )
  }, [])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [])

  useEffect(() => {
    if (!isChatOpen) return
    scrollToBottom()
  }, [messages, isChatOpen, scrollToBottom])

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as StoredAssistantState
        if (Array.isArray(parsed.messages)) {
          const sanitized = parsed.messages
            .filter(
              (m): m is ChatMessage =>
                m != null &&
                (m.role === "user" || m.role === "assistant") &&
                typeof m.content === "string"
            )
            .map((m, index) => ({
              ...m,
              id: typeof m.id === "number" ? m.id : index + 1,
            }))
          setMessages(sanitized.slice(-MAX_HISTORY))
          const maxId = sanitized.reduce((acc, m) => (m.id > acc ? m.id : acc), 0)
          nextIdRef.current = Math.max(maxId + 1, nextIdRef.current)
        }
        if (typeof parsed.isChatOpen === "boolean") {
          setIsChatOpen(parsed.isChatOpen)
        }
        if (typeof parsed.draft === "string") {
          setMessage(parsed.draft)
          setCharCount(parsed.draft.length)
        }
      }
    } catch (err) {
      console.error("Failed to restore assistant history:", err)
    } finally {
      setHasHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hasHydrated || typeof window === "undefined") return
    const payload: StoredAssistantState = {
      messages,
      isChatOpen,
      draft: message,
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch (err) {
      console.error("Failed to persist assistant history:", err)
    }
  }, [messages, isChatOpen, message, hasHydrated])

  useEffect(() => {
    return () => {
      streamControllerRef.current?.abort()
    }
  }, [])

  useEffect(() => {
    if (!isChatOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) return
      if (chatRef.current && !chatRef.current.contains(target)) {
        if (!target.closest(".floating-ai-button")) {
          setIsChatOpen(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isChatOpen])

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length > MAX_CHARS) return
    setMessage(value)
    setCharCount(value.length)
  }

  const handleQuickPrompt = (prompt: string) => {
    setIsChatOpen(true)
    setMessage(prompt)
    setCharCount(prompt.length)
    setTimeout(() => {
      textareaRef.current?.focus()
      textareaRef.current?.setSelectionRange(prompt.length, prompt.length)
    }, 0)
  }

  const handleSend = async () => {
    const trimmed = message.trim()
    if (!trimmed || isLoading) return

    const payloadMessages = [
      ...messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      {
        role: "user" as const,
        content: trimmed,
      },
    ]

    const userMessage: ChatMessage = {
      id: nextIdRef.current++,
      role: "user",
      content: trimmed,
    }

    appendMessage(userMessage)
    setMessage("")
    setCharCount(0)
    setIsLoading(true)
    setError(null)

    const assistantMessageId = nextIdRef.current++
    appendMessage({
      id: assistantMessageId,
      role: "assistant",
      content: "",
    })

    streamControllerRef.current?.abort()
    const controller = new AbortController()
    streamControllerRef.current = controller

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: payloadMessages }),
        signal: controller.signal,
      })

      const contentType = res.headers.get("content-type") ?? ""
      if (!res.ok || !contentType.includes("text/event-stream") || !res.body) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as { error?: string }).error ?? "Failed to reach assistant")
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""
      let navigatePath: string | null = null

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const events = buffer.split("\n\n")
        buffer = events.pop() ?? ""

        for (const event of events) {
          const dataLine = event
            .split("\n")
            .filter((line) => line.startsWith("data:"))
            .map((line) => line.replace(/^data:\s*/, ""))
            .join("")
          if (!dataLine) continue

          let payload: StreamPayload
          try {
            payload = JSON.parse(dataLine) as StreamPayload
          } catch {
            continue
          }

          if (payload.type === "meta" && "model" in payload) {
            setModelName(payload.model)
          } else if (payload.type === "token" && "content" in payload) {
            const chunk = payload.content
            updateMessageContent(assistantMessageId, (prev) => prev + chunk)
          } else if (payload.type === "error") {
            setError(payload.message ?? "Assistant stream error.")
          } else if (payload.type === "done") {
            const actionData = payload.action
            if (actionData?.type === "navigate" && typeof actionData.path === "string") {
              navigatePath = actionData.path
            }
          }
        }
      }

      updateMessageContent(assistantMessageId, (prev) =>
        prev && prev.trim().length > 0
          ? prev
          : "I'm not sure about that based on the information publicly available on this site."
      )

      if (navigatePath) {
        router.push(navigatePath)
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return
      }
      console.error(err)
      setError("Something went wrong while contacting the assistant.")
      updateMessageContent(assistantMessageId, (prev) => prev || "Sorry, I couldn't answer that right now.")
    } finally {
      streamControllerRef.current = null
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  const handleVoiceToggle = async () => {
    setVoiceError(null)

    // Stop recording if already active
    if (isRecording) {
      mediaRecorderRef.current?.stop()
      return
    }

    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setVoiceError("Voice capture is not supported in this browser.")
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      recorder.onstop = async () => {
        setIsRecording(false)
        stream.getTracks().forEach((t) => t.stop())

        if (!chunks.length) return

        const blob = new Blob(chunks, { type: "audio/webm" })
        const formData = new FormData()
        formData.append("audio", blob, "voice.webm")

        try {
          const res = await fetch("/api/assistant/voice", {
            method: "POST",
            body: formData,
          })

          const data = (await res.json()) as { text?: string; error?: string }

          if (!res.ok || data.error) {
            const message =
              data.error ?? "Failed to transcribe audio. Voice transcription may not be enabled for this project."
            setVoiceError(message)
            return
          }

          const text = data.text ?? ""

          if (text) {
            setMessage((prev) => {
              const prefix = prev ? (prev.endsWith("\n") ? "" : "\n") : ""
              const combined = `${prev ?? ""}${prefix}${text}`
              setCharCount(combined.length)
              return combined
            })
          }
        } catch (err) {
          console.error(err)
          setVoiceError("Could not transcribe your audio. Please try again.")
        }
      }

      mediaRecorderRef.current = recorder
      recorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error(err)
      setVoiceError("Could not access your microphone. Please check permissions.")
    }
  }

  const handleToggle = (e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsChatOpen((open) => {
      const next = !open
      if (next) {
        setTimeout(() => {
          textareaRef.current?.focus()
        }, 0)
      } else {
        streamControllerRef.current?.abort()
      }
      return next
    })
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 flex justify-end sm:inset-x-auto sm:right-6 sm:bottom-6">
      <div className="relative w-full max-w-[420px]">
        {/* Floating AI button */}
        <button
          className={`floating-ai-button relative ml-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-gradient-to-br from-[#3e1e68] to-[#e45a92] shadow-lg shadow-[#e45a92]/40 transition-all duration-300 hover:scale-110 hover:shadow-xl ${
            isChatOpen ? "rotate-90" : "rotate-0"
          }`}
          onClick={handleToggle}
          aria-label={isChatOpen ? "Close Bits&Bytes assistant" : "Open Bits&Bytes assistant"}
        >
          {/* Inner ring */}
          <div className="absolute inset-1 rounded-full border border-white/20" />

          {/* Icon */}
          <div className="relative z-10 flex items-center justify-center">
            {isChatOpen ? <X className="h-6 w-6 text-white" /> : <Bot className="h-6 w-6 text-white" />}
          </div>

          {/* Subtle glow */}
          <div className="pointer-events-none absolute inset-0 rounded-full bg-[#e45a92]/40 opacity-40 blur-lg" />
          <div className="pointer-events-none absolute inset-0 rounded-full bg-[#3e1e68]/40 opacity-40 blur-xl" />
        </button>

        {/* Chat panel */}
        {isChatOpen && (
          <div
            ref={chatRef}
            className="absolute bottom-16 right-0 w-full max-w-full origin-bottom-right animate-slide-in-up sm:w-[380px] sm:max-w-[420px]"
          >
            <div className="relative flex max-h-[70vh] flex-col overflow-hidden rounded-3xl border border-zinc-700/60 bg-zinc-950/95 shadow-2xl backdrop-blur-2xl sm:max-h-[520px]">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-3 pb-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-zinc-300">Bits&Bytes Assistant</span>
                    <span className="text-[0.65rem] text-zinc-500">
                      Answers from this site&apos;s public info only
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-2xl bg-zinc-800/70 px-2 py-1 text-[0.65rem] font-medium text-zinc-200">
                    {modelName}
                  </span>
                  <button
                    onClick={() => {
                      streamControllerRef.current?.abort()
                      setIsChatOpen(false)
                    }}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-100"
                    aria-label="Close assistant"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="mx-3 mb-2 h-[1px] bg-gradient-to-r from-transparent via-zinc-700/70 to-transparent" />
              <div className="flex flex-col gap-3 overflow-y-auto px-4 pb-4 pt-1 text-sm text-zinc-100">
                {messages.length === 0 && (
                  <>
                    <div className="rounded-2xl border border-zinc-700/80 bg-zinc-900/60 px-3 py-3 text-xs text-zinc-400">
                      Ask me anything about Bits&Bytes—our mission, team, hackathons, impact stats, or how to get
                      involved.
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => handleQuickPrompt(prompt)}
                          className="rounded-full border border-zinc-800/80 bg-zinc-900/50 px-3 py-1 text-[0.65rem] text-zinc-300 transition hover:border-[#e45a92] hover:text-white"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </>
                )}
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-[0.75rem] leading-relaxed sm:max-w-[80%] ${
                        m.role === "user"
                          ? "bg-[#e45a92] text-white"
                          : "border border-zinc-700/70 bg-zinc-900/80 text-zinc-100"
                      }`}
                    >
                      {m.content || (m.role === "assistant" ? "..." : "")}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Thinking...
                  </div>
                )}
                {error && <p className="text-xs text-red-400">{error}</p>}
                {voiceError && <p className="text-xs text-amber-400">{voiceError}</p>}
              </div>

              {/* Input */}
              <div className="border-t border-zinc-800/80 bg-zinc-950/80">
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    rows={3}
                    className="block w-full resize-none bg-transparent px-4 pb-10 pt-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
                    placeholder="Ask about our team, hackathons, impact, or how to join..."
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent" />
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-3 pb-3 pt-2">
                  <button
                    type="button"
                    onClick={() => void handleVoiceToggle()}
                    className={`group flex items-center gap-1 rounded-lg border px-2 py-1 text-[0.7rem] transition-colors ${
                      isRecording
                        ? "border-red-500/60 bg-red-500/20 text-red-300"
                        : "border-zinc-800/60 bg-zinc-900/80 text-zinc-500 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                    aria-label="Voice input"
                  >
                    <Mic className={`h-3 w-3 ${isRecording ? "animate-pulse text-red-400" : ""}`} />
                    <span>{isRecording ? "Listening..." : "Voice"}</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <span className="text-[0.7rem] text-zinc-500">
                      {charCount}/{MAX_CHARS}
                    </span>
                    <button
                      type="button"
                      onClick={() => void handleSend()}
                      disabled={!message.trim() || isLoading}
                      className="relative inline-flex h-9 items-center justify-center rounded-xl bg-gradient-to-r from-[#3e1e68] to-[#e45a92] px-3 text-xs font-semibold text-white shadow-lg shadow-[#e45a92]/30 transition-all hover:shadow-xl hover:shadow-[#e45a92]/40 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Send className="mr-1.5 h-3.5 w-3.5" />
                      Ask
                    </button>
                  </div>
                </div>

                {/* Footer helper */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800/80 px-3 py-2 text-[0.7rem] text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <Info className="h-3 w-3" />
                    <span>
                      Press{" "}
                      <kbd className="rounded border border-zinc-700 bg-zinc-900 px-1.5 py-0.5 font-mono text-[0.65rem]">
                        Shift + Enter
                      </kbd>{" "}
                      for a new line
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>Powered by openai/{modelName}</span>
                  </div>
                </div>
              </div>

              {/* Soft overlay accent */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-[#e45a9215] via-transparent to-[#3e1e6815]" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export { FloatingAiAssistant }


