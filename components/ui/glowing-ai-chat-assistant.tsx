\"use client\"

import React, { useState, useRef, useEffect } from \"react\"
import type { KeyboardEvent, ChangeEvent, MouseEvent as ReactMouseEvent } from \"react\"
import { useRouter } from \"next/navigation\"

import { Mic, Send, Info, Bot, X } from \"lucide-react\"

interface ChatMessage {
  id: number
  role: "user" | "assistant"
  content: string
}

const MAX_CHARS = 2000

const FloatingAiAssistant: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [charCount, setCharCount] = useState(0)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)

  const chatRef = useRef<HTMLDivElement | null>(null)
  const nextIdRef = useRef(1)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const router = useRouter()


  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length > MAX_CHARS) return
    setMessage(value)
    setCharCount(value.length)
  }

  const handleSend = async () => {
    const trimmed = message.trim()
    if (!trimmed || isLoading) return

    const userMessage: ChatMessage = {
      id: nextIdRef.current++,
      role: "user",
      content: trimmed,
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage("")
    setCharCount(0)
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            {
              role: "user" as const,
              content: trimmed,
            },
          ],
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to reach assistant")
      }

      const data = (await res.json()) as {
        answer?: string
        error?: string
        action?: { type: string; path?: string }
      }

      const answer = data.answer ?? data.error ?? "Sorry, I couldn't answer that right now."

      const assistantMessage: ChatMessage = {
        id: nextIdRef.current++,
        role: "assistant",
        content: answer,
      }

      setMessages((prev) => [...prev, assistantMessage])

      if (data.action?.type === "navigate" && data.action.path) {
        router.push(data.action.path)
      }
    } catch (err) {
      console.error(err)
      setError("Something went wrong while contacting the assistant.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  // Close chat when clicking outside
  useEffect(() => {
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
  }, [])

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

          if (!res.ok) {
            throw new Error("Failed to transcribe audio")
          }

          const data = (await res.json()) as { text?: string; error?: string }
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
    setIsChatOpen((open) => !open)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating AI button */}
      <button
        className={`floating-ai-button relative flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-gradient-to-br from-[#3e1e68] to-[#e45a92] shadow-lg shadow-[#e45a92]/40 transition-all duration-300 hover:scale-110 hover:shadow-xl ${
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
          className="absolute bottom-20 right-0 w-[360px] max-w-[90vw] origin-bottom-right animate-slide-in-up"
        >
          <div className="relative flex max-h-[480px] flex-col overflow-hidden rounded-3xl border border-zinc-700/60 bg-zinc-950/90 shadow-2xl backdrop-blur-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-3 pb-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-zinc-300">Bits&Bytes Assistant</span>
                  <span className="text-[0.65rem] text-zinc-500">Answers from this site&apos;s public info only</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-2xl bg-zinc-800/70 px-2 py-1 text-[0.65rem] font-medium text-zinc-200">
                  gpt-5-nano
                </span>
                <button
                  onClick={() => setIsChatOpen(false)}
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
                <div className="rounded-2xl border border-zinc-700/80 bg-zinc-900/60 px-3 py-3 text-xs text-zinc-400">
                  Ask me anything about Bits&Bytes—our mission, team, hackathons, impact stats, or how to get involved.
                </div>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                      m.role === "user"
                        ? "bg-[#e45a92] text-white"
                        : "bg-zinc-900/80 text-zinc-100 border border-zinc-700/70"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
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
              <div className="flex items-center justify-between px-3 pb-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void handleVoiceToggle()}
                    className={`group flex items-center gap-1 rounded-lg border px-2 py-1 text-[0.7rem] transition-colors ${
                      isRecording
                        ? "border-red-500/60 bg-red-500/20 text-red-300"
                        : "border-zinc-800/60 bg-zinc-900/80 text-zinc-500 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                    aria-label="Voice input (not yet implemented)"
                  >
                    <Mic className={`h-3 w-3 ${isRecording ? "animate-pulse text-red-400" : ""}`} />
                    <span>{isRecording ? "Listening..." : "Voice"}</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[0.7rem] text-zinc-500">
                    {charCount}/{MAX_CHARS}
                  </span>
                  <button
                    type="button"
                    onClick={() => void handleSend()}
                    disabled={!message.trim() || isLoading}
                    className="relative inline-flex h-9 items-center justify-center rounded-xl bg-gradient-to-r from-[#3e1e68] to-[#e45a92] px-3 text-xs font-semibold text-white shadow-lg shadow-[#e45a92]/30 transition-all disabled:cursor-not-allowed disabled:opacity-60 hover:shadow-xl hover:shadow-[#e45a92]/40"
                  >
                    <Send className="mr-1.5 h-3.5 w-3.5" />
                    Ask
                  </button>
                </div>
              </div>

              {/* Footer helper */}
              <div className="flex items-center justify-between border-t border-zinc-800/80 px-3 py-2 text-[0.7rem] text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <Info className="h-3 w-3" />
                  <span>
                    Press <kbd className="rounded border border-zinc-700 bg-zinc-900 px-1.5 py-0.5 font-mono text-[0.65rem]">Shift + Enter</kbd>{" "}
                    for a new line
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>Powered by openai/gpt-5-nano</span>
                </div>
              </div>
            </div>

            {/* Soft overlay accent */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-[#e45a9215] via-transparent to-[#3e1e6815]" />
          </div>
        </div>
      )}
    </div>
  )
}

export { FloatingAiAssistant }


