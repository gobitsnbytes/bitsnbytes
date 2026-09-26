"use client";

import { useState, useRef, useEffect, useCallback, useId, type ChangeEvent } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { ConsoleWindow } from "@/components/contact/console-window";
import { useMotionEnabled } from "@/components/experience-provider";
import { LAB_HOVER, LAB_TEXT, TableHeader } from "@/components/lab";
import { PromptBox, type PromptBoxRef } from "@/components/ui/chatgpt-prompt-input";
import {
  Caret,
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

/** /qna console: "/ LABEL" table header + the stripe.dev console window; streams /api/assistant. */
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

  // Nav [C] / menu Console: the floating console isn't mounted on /qna, so this prompt takes focus.
  useEffect(() => {
    const onOpen = () => promptBoxRef.current?.focus();
    window.addEventListener("bnb:console-open", onOpen);
    return () => window.removeEventListener("bnb:console-open", onOpen);
  }, []);

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
    <section aria-labelledby={titleId} className={cn("flex min-h-0 w-full flex-col gap-3", className)}>
      <TableHeader
        as="h2"
        label={<span id={titleId}>bits&bytes™ QnA</span>}
        count={messages.length}
        right={
          <span className="flex items-center gap-3">
            {messages.length > 0 ? <span className="max-sm:hidden">Model: {modelName}</span> : null}
            <button
              type="button"
              onClick={clear}
              disabled={messages.length === 0}
              aria-label="Clear chat session"
              title="Clear chat session"
              className={cn(
                "min-h-6 cursor-pointer border border-dotted border-current px-[5px] uppercase disabled:pointer-events-none disabled:opacity-40",
                LAB_HOVER,
              )}
            >
              Clear Chat
            </button>
          </span>
        }
      />

      <ConsoleWindow
        title="Verified from public project sources"
        className="flex min-h-0 flex-1 flex-col"
        bodyClassName="flex min-h-0 flex-1 flex-col"
      >
        {/* the page's only inner scroller: contained, thin tone-coloured bar, and Lenis leaves it alone */}
        <div
          ref={logRef}
          data-lenis-prevent
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 font-mono text-[13px] leading-relaxed [scrollbar-color:var(--line)_transparent] [scrollbar-width:thin] sm:px-6"
          aria-live="polite"
          aria-relevant="additions text"
        >
          <div className="mx-auto max-w-3xl">
            {messages.length === 0 && (
              <div className="flex flex-col gap-5 py-2">
                <div className="space-y-2">
                  <p className={LAB_TEXT.post}>Start with a real question, get a grounded answer.</p>
                  <p className={cn(LAB_TEXT.sm, "max-w-[60ch]")}>
                    Ask about events, team, partnerships, or how bits&bytes™ actually runs. Every reply is anchored in
                    public site sources.
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
        </div>

        <div className="shrink-0 border-t border-line p-3 sm:p-4">
          <PromptBox
            ref={promptBoxRef}
            value={message}
            onChange={handleInputChange}
            onSubmitMessage={(msg: string) => handleSend(msg)}
            maxChars={MAX_CHARS}
            className="mx-auto max-w-3xl"
          />
        </div>
      </ConsoleWindow>
    </section>
  );
}
