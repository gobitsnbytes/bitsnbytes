"use client";

import { useState, useRef, useEffect, useCallback, useId, type ChangeEvent } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useMotionEnabled } from "@/components/experience-provider";
import { PromptBox, type PromptBoxRef } from "@/components/ui/chatgpt-prompt-input";
import {
  Caret,
  ConsoleBar,
  ConsoleButton,
  ErrorLine,
  LogEntry,
  MAX_CHARS,
  PromptList,
  STORAGE_KEY,
  StatusLine,
  consoleMarkdown,
  generateImage,
  keepUrl,
  loadChat,
  saveChat,
  streamAssistant,
  type ChatMessage,
} from "@/components/ui/chat-console";
import { cn } from "@/lib/utils";

const MAX_HISTORY = 20;
const QUICK_PROMPTS = [
  "Who started bits&bytes™?",
  "What makes this network different?",
  "What was India Innovates 2026?",
  "How do I join?",
  "What do members actually build?",
  "Show me past events.",
];
const PAGE_NAMES: Record<string, string> = {
  "/": "Home",
  "/about": "About",
  "/impact": "Impact",
  "/join": "Join",
  "/contact": "Contact",
  "/coc": "Code of Conduct",
  "/events": "Events",
  "/qna": "Q&A",
  "/faq": "FAQ",
};
const MARKDOWN = consoleMarkdown(true);

/** /qna console: full-height stripe.dev-style window in riot chrome (streams /api/assistant). */
export function QnAChatInterface({ className }: { className?: string }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelName, setModelName] = useState("assistant");
  const [hasHydrated, setHasHydrated] = useState(false);
  const motion = useMotionEnabled();
  const titleId = useId();

  const promptBoxRef = useRef<PromptBoxRef | null>(null);
  const logRef = useRef<HTMLDivElement | null>(null);
  const nextIdRef = useRef(1);
  const streamControllerRef = useRef<AbortController | null>(null);

  const appendMessage = useCallback((newMessage: ChatMessage) => {
    setMessages((prev) => [...prev, newMessage].slice(-MAX_HISTORY));
  }, []);

  const updateMessageContent = useCallback((messageId: number, updater: (prev: string) => string) => {
    setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, content: updater(m.content) } : m)));
  }, []);

  // Keep the newest entry in view (scrolls the log only, never the page).
  useEffect(() => {
    const log = logRef.current;
    log?.scrollTo({ top: log.scrollHeight, behavior: motion ? "smooth" : "auto" });
  }, [messages, isLoading, motion]);

  useEffect(() => {
    try {
      const stored = loadChat(MAX_HISTORY);
      setMessages(stored.messages);
      nextIdRef.current = Math.max(stored.nextId, nextIdRef.current);
      if (stored.draft !== null) setMessage(stored.draft);
    } catch (err) {
      console.error("Failed to restore assistant history:", err);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hasHydrated) saveChat({ messages, draft: message });
  }, [messages, message, hasHydrated]);

  useEffect(() => () => streamControllerRef.current?.abort(), []);

  const handleQuickPrompt = useCallback((prompt: string) => {
    setMessage(prompt);
    setTimeout(() => promptBoxRef.current?.focus(), 0);
  }, []);

  // Suggested asks on the page, follow-up links and booking blocks all send prompts through this event.
  useEffect(() => {
    const onPrompt = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (typeof detail === "string") handleQuickPrompt(detail);
    };
    window.addEventListener("bb:qna-prompt", onPrompt);
    return () => window.removeEventListener("bb:qna-prompt", onPrompt);
  }, [handleQuickPrompt]);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > MAX_CHARS) return;
    setMessage(e.target.value);
  };

  const handleSend = async (manualMessagePayload?: string) => {
    const trimmed = (typeof manualMessagePayload === "string" ? manualMessagePayload : message).trim();
    if (!trimmed || isLoading) return;

    const payloadMessages = [
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: trimmed },
    ];

    appendMessage({ id: nextIdRef.current++, role: "user", content: trimmed });
    setMessage("");
    setIsLoading(true);
    setError(null);

    const assistantMessageId = nextIdRef.current++;
    appendMessage({ id: assistantMessageId, role: "assistant", content: "" });
    const update = (updater: (prev: string) => string) => updateMessageContent(assistantMessageId, updater);

    streamControllerRef.current?.abort();
    const controller = new AbortController();
    streamControllerRef.current = controller;
    let navigatePath: string | null = null;

    try {
      await streamAssistant({ messages: payloadMessages }, controller.signal, {
        model: setModelName,
        token: (chunk) => update((prev) => prev + chunk),
        error: setError,
        done: (action) => {
          if (action?.type === "navigate" && typeof action.path === "string") navigatePath = action.path;
          else if (action?.type === "generate_image") generateImage(action, update);
        },
      });

      update((prev) => {
        const pageName = navigatePath ? (PAGE_NAMES[navigatePath] ?? navigatePath) : "";
        if (prev && prev.trim().length > 0) {
          // A navigate action after a written answer becomes a CTA the user can follow.
          return navigatePath && !prev.includes(navigatePath)
            ? `${prev}\n\n[Go to ${pageName}](${navigatePath} "cta")`
            : prev;
        }
        if (navigatePath) return `I can take you to the ${pageName} page — [Go to ${pageName}](${navigatePath} "cta")`;
        return "I don't have enough information to answer that. Feel free to ask about our events, team, community, or how to join bits&bytes™!";
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong while contacting the assistant.");
      update((prev) => prev || "Sorry, I couldn't answer that right now.");
    } finally {
      streamControllerRef.current = null;
      setIsLoading(false);
    }
  };

  const clear = () => {
    setMessages([]);
    setMessage("");
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const last = messages[messages.length - 1];

  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        "tone-ink flex min-h-0 w-full flex-col border-3 border-line shadow-[10px_10px_0_0_var(--orange)]",
        className,
      )}
    >
      <ConsoleBar title="bits&bytes™ QnA" titleId={titleId} titleAs="h2">
        <ConsoleButton
          onClick={clear}
          disabled={messages.length === 0}
          aria-label="Clear chat session"
          title="Clear chat session"
        >
          Clear Chat
        </ConsoleButton>
      </ConsoleBar>

      <p className="flex shrink-0 items-center gap-2 border-b border-line/30 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] opacity-80">
        <span aria-hidden className="size-2 bg-slime" />
        Verified from public project sources
      </p>

      <div
        ref={logRef}
        className="min-h-0 flex-1 overflow-y-auto px-4 py-3 font-mono text-[13px] leading-relaxed sm:px-6"
        aria-live="polite"
        aria-relevant="additions text"
      >
        {messages.length === 0 && (
          <div className="mx-auto flex max-w-3xl flex-col gap-5 py-4">
            <div className="border-l-3 border-signal pl-4">
              <p className="font-sans text-lg font-black uppercase leading-tight tracking-[-0.01em] text-signal">
                Start with a real question, get a grounded answer.
              </p>
              <p className="mt-2 font-serif text-sm leading-relaxed opacity-90">
                Ask about events, team, partnerships, or how bits&bytes™ actually runs. Every reply is anchored in public
                site sources.
              </p>
            </div>
            <PromptList prompts={QUICK_PROMPTS} onPick={handleQuickPrompt} />
          </div>
        )}

        <ol>
          {messages.map((m, index) => (
            <LogEntry key={m.id} role={m.role} index={index}>
              {m.role === "user" ? (
                m.content
              ) : (
                <>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} urlTransform={keepUrl} components={MARKDOWN}>
                    {m.content || "..."}
                  </ReactMarkdown>
                  {isLoading && m.id === last?.id ? <Caret /> : null}
                </>
              )}
            </LogEntry>
          ))}
        </ol>
        {isLoading && <StatusLine>Thinking...</StatusLine>}
        {error && <ErrorLine>{error}</ErrorLine>}
      </div>

      <div className="shrink-0 border-t-3 border-line p-3 sm:p-4">
        <PromptBox
          ref={promptBoxRef}
          value={message}
          onChange={handleInputChange}
          onSubmitMessage={(msg: string) => handleSend(msg)}
          maxChars={MAX_CHARS}
        />
      </div>

      <p className="flex shrink-0 flex-wrap justify-between gap-x-4 gap-y-1 border-t border-line/30 bg-surface-2 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] opacity-90">
        <span>{messages.length > 0 ? `Model: ${modelName}` : null}</span>
        <span aria-hidden>[{String(messages.length).padStart(2, "0")}/{MAX_HISTORY}]</span>
      </p>
    </section>
  );
}
