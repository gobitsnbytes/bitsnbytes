"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChangeEvent } from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { safeJsonParse } from "@/lib/safe-json";

import { Bot, Trash, MapPin } from "lucide-react";
import {
  BookingHostGrid,
  SlotPicker,
  BookingConfirmCard,
  MeetingList,
  type BookingHost,
  type BookingSlotBlock,
  type BookingConfirmBlock,
  type MeetingItem,
} from "@/components/ui/booking-blocks";

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
}

type CountdownPayload = {
  event: string;
  date: string;
};

type MemberCardPayload = {
  name: string;
  role: string;
  photo?: string;
  socials?: {
    github?: string;
    linkedin?: string;
  };
};

type ProjectIdea = {
  title: string;
  description: string;
  tech_stack?: string[];
  difficulty?: "beginner" | "intermediate" | "advanced";
  why_it_fits_theme?: string;
};

function formatRemaining(ms: number) {
  if (ms <= 0) return { dd: "00", hh: "00", mm: "00", ss: "00", done: true };
  const totalSeconds = Math.floor(ms / 1000);
  const dd = Math.floor(totalSeconds / 86400);
  const hh = Math.floor((totalSeconds % 86400) / 3600);
  const mm = Math.floor((totalSeconds % 3600) / 60);
  const ss = totalSeconds % 60;
  return {
    dd: String(dd).padStart(2, "0"),
    hh: String(hh).padStart(2, "0"),
    mm: String(mm).padStart(2, "0"),
    ss: String(ss).padStart(2, "0"),
    done: false,
  };
}

function CountdownCard({ payload }: { payload: CountdownPayload }) {
  const [now, setNow] = useState(() => Date.now());
  const target = new Date(payload.date).getTime();

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (!Number.isFinite(target)) {
    return (
      <div className="my-2 p-3 rounded-none bg-red-100 border-2 border-red-500 text-red-700 text-xs font-bold font-mono">
        Invalid countdown date format.
      </div>
    );
  }

  const remaining = formatRemaining(target - now);
  return (
    <div className="my-3 rounded-none border border-[#120f0a]/15 dark:border-[#faf8f5]/15 bg-[#faf8f5]/50 dark:bg-[#120f0a]/50 p-4 text-[#120f0a] dark:text-[#faf8f5]">
      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#97192c]">
        Event Countdown
      </p>
      <h4 className="mt-1 text-sm font-normal font-accent-sans uppercase tracking-tight text-[#120f0a] dark:text-[#faf8f5]">{payload.event}</h4>
      {remaining.done ? (
        <p className="mt-2 text-xs font-bold text-emerald-600">This event has started.</p>
      ) : (
        <div className="mt-3 grid grid-cols-4 gap-2 text-center">
          {[
            { label: "DD", value: remaining.dd },
            { label: "HH", value: remaining.hh },
            { label: "MM", value: remaining.mm },
            { label: "SS", value: remaining.ss },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-none border border-[#120f0a]/15 dark:border-[#faf8f5]/15 bg-[#faf8f5] dark:bg-[#120f0a] px-2 py-2"
            >
              <div className="text-base font-normal font-accent-sans text-[#120f0a] dark:text-[#faf8f5]">{item.value}</div>
              <div className="text-[9px] font-mono font-bold text-[#120f0a]/60 dark:text-[#faf8f5]/60 uppercase">{item.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TeamMemberCard({ payload }: { payload: MemberCardPayload }) {
  return (
    <div className="my-3 rounded-none border border-[#120f0a]/15 dark:border-[#faf8f5]/15 bg-[#faf8f5]/50 dark:bg-[#120f0a]/50 p-4 text-[#120f0a] dark:text-[#faf8f5]">
      <div className="flex items-center gap-3">
        {payload.photo ? (
          <img
            src={payload.photo}
            alt={payload.name}
            className="h-12 w-12 rounded-none object-cover border border-[#120f0a] dark:border-[#faf8f5] grayscale"
          />
        ) : (
          <div className="h-12 w-12 rounded-none border border-[#120f0a]/15 dark:border-[#faf8f5]/15 bg-[#120f0a]/5 dark:bg-[#faf8f5]/5" />
        )}
        <div>
          <p className="text-sm font-normal font-accent-sans uppercase tracking-tight text-[#120f0a] dark:text-[#faf8f5]">{payload.name}</p>
          <span className="inline-flex mt-1.5 rounded-none border border-[#120f0a]/30 dark:border-[#faf8f5]/30 bg-transparent px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase text-[#97192c] dark:text-[#fc920d]">
            {payload.role}
          </span>
        </div>
      </div>
      {(payload.socials?.github || payload.socials?.linkedin) && (
        <div className="mt-4 flex items-center gap-2">
          {payload.socials.github && (
            <a
              href={payload.socials.github}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-mono font-bold uppercase tracking-wider rounded-none border border-[#120f0a] dark:border-[#faf8f5] bg-transparent px-2.5 py-1 text-[#120f0a] dark:text-[#faf8f5] hover:bg-[#120f0a] dark:hover:bg-[#faf8f5] hover:text-[#faf8f5] dark:hover:text-[#120f0a] active:scale-[0.98] transition-all duration-200"
            >
              GitHub
            </a>
          )}
          {payload.socials.linkedin && (
            <a
              href={payload.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-mono font-bold uppercase tracking-wider rounded-none border border-[#120f0a] dark:border-[#faf8f5] bg-transparent px-2.5 py-1 text-[#120f0a] dark:text-[#faf8f5] hover:bg-[#120f0a] dark:hover:bg-[#faf8f5] hover:text-[#faf8f5] dark:hover:text-[#120f0a] active:scale-[0.98] transition-all duration-200"
            >
              LinkedIn
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function ProjectCards({ ideas }: { ideas: ProjectIdea[] }) {
  return (
    <div className="my-4 space-y-4">
      {ideas.map((idea, idx) => (
        <div
          key={`${idea.title}-${idx}`}
          className="rounded-none border border-[#120f0a]/15 dark:border-[#faf8f5]/15 bg-[#faf8f5]/50 dark:bg-[#120f0a]/50 p-4 text-[#120f0a] dark:text-[#faf8f5]"
        >
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="text-sm font-normal font-accent-sans uppercase tracking-tight text-[#120f0a] dark:text-[#faf8f5]">{idea.title}</p>
            {idea.difficulty && (
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider rounded-none border border-[#120f0a]/30 dark:border-[#faf8f5]/30 bg-transparent px-2 py-0.5 text-[#120f0a] dark:text-[#faf8f5]">
                {idea.difficulty}
              </span>
            )}
          </div>
          <p className="mt-2 text-xs font-serif-brand text-[#120f0a]/80 dark:text-[#faf8f5]/80 leading-relaxed">{idea.description}</p>
          {Array.isArray(idea.tech_stack) && idea.tech_stack.length > 0 && (
            <p className="mt-3 text-[10px] font-mono uppercase tracking-widest text-[#97192c] dark:text-[#fc920d]">
              Stack: {idea.tech_stack.join(" • ")}
            </p>
          )}
          {idea.why_it_fits_theme && (
            <p className="mt-2 text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-none px-2.5 py-1.5 inline-block">
              Theme fit: {idea.why_it_fits_theme}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

const MAX_CHARS = 2000;
const MAX_HISTORY = 20;
const STORAGE_KEY = "bb-floating-assistant-state-v1";
const QUICK_PROMPTS = [
  "Who started bits&bytes™?",
  "What makes this network different?",
  "What was India Innovates 2026?",
  "How do I join?",
  "What do members actually build?",
  "Show me past events.",
];

type StreamPayload =
  | { type: "meta"; model: string }
  | { type: "token"; content: string }
  | {
      type: "done";
      action?: { type: string; path?: string; textSnippet?: string } | null;
    }
  | { type: "error"; message?: string };

type StoredAssistantState = {
  messages?: ChatMessage[];
  draft?: string;
};

import { PromptBox } from "@/components/ui/chatgpt-prompt-input";
import { cn } from "@/lib/utils";

export function QnAChatInterface({ className }: { className?: string }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelName, setModelName] = useState("assistant");
  const [hasHydrated, setHasHydrated] = useState(false);
  const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  // Using `any` ref to bridge custom PromptBoxRef since it exposes .focus()
  const promptBoxRef = useRef<{
    focus: () => void;
    setValue: (val: string) => void;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const nextIdRef = useRef(1);
  const streamControllerRef = useRef<AbortController | null>(null);


  const appendMessage = useCallback((newMessage: ChatMessage) => {
    setMessages((prev) => {
      const updated = [...prev, newMessage];
      return updated.length > MAX_HISTORY
        ? updated.slice(updated.length - MAX_HISTORY)
        : updated;
    });
  }, []);

  const updateMessageContent = useCallback(
    (messageId: number, updater: (prev: string) => string) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, content: updater(m.content) } : m,
        ),
      );
    },
    [],
  );

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StoredAssistantState;
        if (Array.isArray(parsed.messages)) {
          const sanitized = parsed.messages
            .filter(
              (m): m is ChatMessage =>
                m != null &&
                (m.role === "user" || m.role === "assistant") &&
                typeof m.content === "string",
            )
            .map((m, index) => ({
              ...m,
              id: typeof m.id === "number" ? m.id : index + 1,
            }));
          setMessages(sanitized.slice(-MAX_HISTORY));
          const maxId = sanitized.reduce(
            (acc, m) => (m.id > acc ? m.id : acc),
            0,
          );
          nextIdRef.current = Math.max(maxId + 1, nextIdRef.current);
        }
        if (typeof parsed.draft === "string") {
          setMessage(parsed.draft);
        }
      }
    } catch (err) {
      console.error("Failed to restore assistant history:", err);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated || typeof window === "undefined") return;
    const payload: StoredAssistantState = {
      messages,
      draft: message,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.error("Failed to persist assistant history:", err);
    }
  }, [messages, message, hasHydrated]);

  useEffect(() => {
    return () => {
      streamControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    const handleExternalPrompt = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      if (typeof customEvent.detail === "string") {
        handleQuickPrompt(customEvent.detail);
      }
    };

    window.addEventListener("bb:qna-prompt", handleExternalPrompt);
    return () => {
      window.removeEventListener("bb:qna-prompt", handleExternalPrompt);
    };
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length > MAX_CHARS) return;
    setMessage(value);
  };

  const handleQuickPrompt = (prompt: string) => {
    setMessage(prompt);
    setTimeout(() => {
      promptBoxRef.current?.focus();
    }, 0);
  };

  const handleSend = async (manualMessagePayload?: string) => {
    const textToUse =
      typeof manualMessagePayload === "string" ? manualMessagePayload : message;
    const trimmed = textToUse.trim();
    if (!trimmed || isLoading) return;

    const payloadMessages = [
      ...messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      {
        role: "user" as const,
        content: trimmed,
      },
    ];

    const userMessage: ChatMessage = {
      id: nextIdRef.current++,
      role: "user",
      content: trimmed,
    };

    appendMessage(userMessage);
    setMessage("");
    setIsLoading(true);
    setError(null);

    const assistantMessageId = nextIdRef.current++;
    appendMessage({
      id: assistantMessageId,
      role: "assistant",
      content: "",
    });

    streamControllerRef.current?.abort();
    const controller = new AbortController();
    streamControllerRef.current = controller;

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: payloadMessages }),
        signal: controller.signal,
      });

      const contentType = res.headers.get("content-type") ?? "";
      if (!res.ok || !contentType.includes("text/event-stream") || !res.body) {
        const raw = await res.text().catch(() => "");
        if (raw.includes("Vercel Security Checkpoint")) {
          throw new Error(
            "Chat request blocked by Vercel Security Checkpoint. Please try again, or ask the site admin to disable Bot Protection for /api/assistant.",
          );
        }
        let parsedError = "";
        try {
          parsedError = (JSON.parse(raw) as { error?: string })?.error ?? "";
        } catch {
          parsedError = "";
        }
        throw new Error(parsedError || "Failed to reach assistant");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let navigatePath: string | null = null;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          const dataLine = event
            .split("\n")
            .filter((line) => line.startsWith("data:"))
            .map((line) => line.replace(/^data:\s*/, ""))
            .join("");
          if (!dataLine) continue;

          let payload: StreamPayload;
          try {
            payload = JSON.parse(dataLine) as StreamPayload;
          } catch {
            continue;
          }

          if (payload.type === "meta" && "model" in payload) {
            setModelName(payload.model);
          } else if (payload.type === "token" && "content" in payload) {
            const chunk = payload.content;
            updateMessageContent(assistantMessageId, (prev) => prev + chunk);
          } else if (payload.type === "error") {
            setError(payload.message ?? "Assistant stream error.");
          } else if (payload.type === "done") {
            const actionData = payload.action;
            if (
              actionData?.type === "navigate" &&
              typeof actionData.path === "string"
            ) {
              navigatePath = actionData.path;
            } else if (actionData?.type === "generate_image") {
              const { prompt, modelChoice, aspectRatio } = actionData as any;
              updateMessageContent(
                assistantMessageId,
                (prev) => prev + "\n\n%%GENERATE_LOADER%%\n\n",
              );

              fetch("/api/assistant/image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, modelChoice, aspectRatio }),
              })
                .then((r) => r.json())
                .then((data) => {
                  console.log("Image generation returned from API:", data);
                  if (data.base64) {
                    updateMessageContent(assistantMessageId, (prev) =>
                      prev.replace(
                        "%%GENERATE_LOADER%%",
                        `![Generated Image](${data.base64})`,
                      ),
                    );
                  } else {
                    updateMessageContent(assistantMessageId, (prev) =>
                      prev.replace(
                        "%%GENERATE_LOADER%%",
                        `*Failed to generate image: ${data.error || "Unknown error"}*`,
                      ),
                    );
                  }
                })
                .catch((err) => {
                  updateMessageContent(assistantMessageId, (prev) =>
                    prev.replace(
                      "%%GENERATE_LOADER%%",
                      `*Image generation failed.*`,
                    ),
                  );
                });
            }
          }
        }
      }

      updateMessageContent(assistantMessageId, (prev) => {
        if (prev && prev.trim().length > 0) {
          // If we got a navigate action but the assistant already wrote content,
          // append a CTA link so the user can navigate voluntarily
          if (navigatePath && !prev.includes(navigatePath)) {
            const PAGE_NAMES: Record<string, string> = {
              "/": "Home", "/about": "About", "/impact": "Impact",
              "/join": "Join", "/contact": "Contact", "/coc": "Code of Conduct",
              "/events": "Events", "/qna": "Q&A", "/faq": "FAQ",
            };
            const pageName = PAGE_NAMES[navigatePath] ?? navigatePath;
            return prev + `\n\n[Go to ${pageName}](${navigatePath} "cta")`;
          }
          return prev;
        }
        if (navigatePath) {
          const PAGE_NAMES: Record<string, string> = {
            "/": "Home", "/about": "About", "/impact": "Impact",
            "/join": "Join", "/contact": "Contact", "/coc": "Code of Conduct",
            "/events": "Events", "/qna": "Q&A", "/faq": "FAQ",
          };
          const pageName = PAGE_NAMES[navigatePath] ?? navigatePath;
          return `I can take you to the ${pageName} page — [Go to ${pageName}](${navigatePath} "cta")`;
        }
        return "I don't have enough information to answer that. Feel free to ask about our events, team, community, or how to join bits&bytes™!";
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
      console.error(err);
      const errMsg =
        err instanceof Error
          ? err.message
          : "Something went wrong while contacting the assistant.";
      setError(errMsg);
      updateMessageContent(
        assistantMessageId,
        (prev) => prev || "Sorry, I couldn't answer that right now.",
      );
    } finally {
      streamControllerRef.current = null;
      setIsLoading(false);
    }
  };

  const markdownComponents = useMemo(() => ({
    p: ({ children }: any) => {
      const text = Array.isArray(children)
        ? children.join("")
        : String(children);
      if (text.includes("%%GENERATE_LOADER%%")) {
        return (
          <div className="relative overflow-hidden rounded-none bg-[#faf8f5] dark:bg-[#120f0a] w-full aspect-video border border-[#120f0a]/15 dark:border-[#faf8f5]/15 flex items-center justify-center p-4 my-2">
            <div className="flex flex-col items-center gap-3 relative z-10">
              <div className="flex gap-1.5 justify-center">
                <div
                  className="h-2 w-2 rounded-none bg-[#97192c] dark:bg-[#fc920d] animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="h-2 w-2 rounded-none bg-[#fc920d] animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="h-2 w-2 rounded-none bg-[#97192c] dark:bg-[#fc920d] animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#120f0a] dark:text-[#faf8f5] animate-pulse">
                Synthesizing Pixels
              </span>
            </div>
          </div>
        );
      }
      return <p className="leading-relaxed">{children}</p>;
    },
    img: ({ src, alt }: any) => {
      if (!src) return null;
      const isLoaded = loadedImages[src];
      return (
        <div 
          className="relative overflow-hidden border border-[#120f0a] dark:border-[#faf8f5] shadow-[4px_4px_0px_0px_#120f0a] dark:shadow-[4px_4px_0px_0px_#faf8f5] hover:shadow-[5px_5px_0px_0px_#120f0a] dark:hover:shadow-[5px_5px_0px_0px_#faf8f5] my-3 w-full aspect-video bg-[#120f0a]/5 dark:bg-[#faf8f5]/5 cursor-zoom-in group hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
          onClick={() => setActiveLightboxImage(src)}
        >
          {!isLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#faf8f5] dark:bg-[#120f0a] animate-pulse z-10">
              <div className="flex gap-1.5 justify-center mb-2">
                <div className="h-2 w-2 rounded-none bg-[#97192c] animate-ping" />
                <div className="h-2 w-2 rounded-none bg-[#fc920d] animate-ping [animation-delay:0.2s]" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#120f0a] dark:text-[#faf8f5]">
                Decoding Image...
              </span>
            </div>
          )}
          <img
            src={src}
            alt={alt || "Generated visual"}
            onLoad={() => {
              setLoadedImages(prev => ({ ...prev, [src]: true }));
            }}
            className={`w-full h-full object-cover transition-opacity duration-300 grayscale ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
      );
    },
    a: ({ href, title, children, ...props }: any) => {
      if (title === "button" || title === "cta") {
        return (
          <a
            href={href}
            className="inline-flex my-2 w-full sm:w-auto items-center justify-center rounded-none bg-[#97192c] hover:bg-[#fc920d] text-white hover:text-[#120f0a] border border-[#120f0a] dark:border-[#faf8f5] px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 active:scale-[0.98] focus-visible:outline-none cursor-pointer"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          >
            {children}
          </a>
        );
      }
      if (title === "follow-up") {
        return (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              const promptText = Array.isArray(children)
                ? children.join("")
                : String(children);
              handleQuickPrompt(promptText);
            }}
            className="block w-full mt-3 text-left rounded-none border border-[#120f0a]/15 dark:border-[#faf8f5]/15 bg-[#faf8f5] dark:bg-[#120f0a] px-4 py-3 text-xs font-mono font-bold uppercase tracking-tight text-[#120f0a] dark:text-[#faf8f5] hover:border-[#120f0a] dark:hover:border-[#faf8f5] transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            ↳ {children}
          </button>
        );
      }
      if (href?.startsWith("#")) {
        return (
          <a
            href={href}
            className="text-[#97192c] dark:text-[#fc920d] hover:underline font-mono font-bold transition-colors"
            {...props}
          >
            {children}
          </a>
        );
      }
      if (
        href?.includes("google.com/maps") ||
        href?.includes("maps.app.goo.gl")
      ) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open venue on Google Maps"
            className="mt-4 mb-2 flex flex-col gap-2 rounded-none border border-[#120f0a]/15 dark:border-[#faf8f5]/15 bg-[#faf8f5]/50 dark:bg-[#120f0a]/50 p-4 text-[#120f0a] dark:text-[#faf8f5] transition-all duration-200 active:scale-[0.98] group no-underline"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none border border-[#120f0a]/15 dark:border-[#faf8f5]/15 bg-[#120f0a]/5 dark:bg-[#faf8f5]/5 text-[#120f0a] dark:text-[#faf8f5]">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-normal font-accent-sans uppercase tracking-tight text-sm m-0 text-[#120f0a] dark:text-[#faf8f5]">
                  View Venue on Map
                </h4>
                <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#97192c] dark:text-[#fc920d] m-0 mt-0.5">
                  Opens in Google Maps
                </p>
              </div>
            </div>
          </a>
        );
      }
      return (
        <a
          href={href}
          className="text-[#97192c] dark:text-[#fc920d] hover:underline font-mono font-bold transition-colors"
          target="_blank"
          rel="noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    },
    code: ({ className, children, ...props }: any) => {
      const match = /language-([\w-]+)/.exec(className || "");
      const language = match?.[1];
      const isChart = language === "chart";
      const isDiscordWidget = language === "discord-widget";
      const isCountdown = language === "countdown";
      const isMemberCard = language === "member_card";
      const isProjectCard = language === "project_card";
      const isBookingHostGrid = language === "booking_host_grid";
      const isBookingSlots = language === "booking_slots";
      const isBookingConfirm = language === "booking_confirm";
      const isMeetingList = language === "meeting_list";

      if (isDiscordWidget) {
        const serverId = String(children).trim();
        return (
          <div className="my-4 rounded-none overflow-hidden border border-[#120f0a]/15 dark:border-[#faf8f5]/15 bg-[#faf8f5] dark:bg-[#120f0a]">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#5865F2]/10 border-b border-[#120f0a]/15 dark:border-[#faf8f5]/15">
              <svg
                className="w-4 h-4 text-[#5865F2]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.015.04.034.048a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
              </svg>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5865F2]">
                India Innovates · Discord
              </span>
            </div>
            <iframe
              src={`https://discord.com/widget?id=${serverId}&theme=dark`}
              width="100%"
              height="400"
              frameBorder="0"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
              className="block"
            />
          </div>
        );
      }
      if (isChart) {
        try {
          const rawData = String(children).replace(/\n$/, "");
          const data = safeJsonParse<any[]>(rawData, "generic", []);
          if (Array.isArray(data) && data.length > 0) {
            return (
              <div className="my-6 h-64 w-full rounded-none bg-[#faf8f5] dark:bg-[#120f0a] p-4 border border-[#120f0a]/15 dark:border-[#faf8f5]/15 px-2 sm:px-4 relative">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={data}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -20,
                      bottom: 0,
                    }}
                  >
                    <XAxis
                      dataKey="name"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      stroke="currentColor"
                    />
                    <Tooltip
                      cursor={{
                        fill: "currentColor",
                        opacity: 0.1,
                      }}
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        border: "1px solid var(--border)",
                        borderRadius: "0px",
                        color: "var(--foreground)",
                        fontFamily: "monospace",
                        fontSize: "11px",
                        fontWeight: "bold",
                      }}
                      itemStyle={{ color: "#97192c" }}
                    />
                    <Bar
                      dataKey="value"
                      fill="#fc920d"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      maxBarSize={50}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            );
          }
        } catch (e) {
          return (
            <div className="my-2 p-3 rounded-none bg-red-100 border-2 border-red-500 text-red-700 text-sm font-bold font-mono">
              Error visualizing chart data
            </div>
          );
        }
      }

      if (isCountdown) {
        try {
          const payload = safeJsonParse<CountdownPayload | null>(
            String(children).replace(/\n$/, ""),
            "countdown",
            null
          );
          if (payload?.event && payload?.date) {
            return <CountdownCard payload={payload} />;
          }
        } catch (e) {
          console.error("Failed to parse countdown data", e);
        }
        return (
          <div className="my-2 p-3 rounded-none bg-red-100 border-2 border-red-500 text-red-700 text-sm font-bold font-mono">
            Error visualizing countdown data
          </div>
        );
      }

      if (isMemberCard) {
        try {
          const payload = safeJsonParse<MemberCardPayload | null>(
            String(children).replace(/\n$/, ""),
            "member_card",
            null
          );
          if (payload?.name && payload?.role) {
            return <TeamMemberCard payload={payload} />;
          }
        } catch (e) {
          console.error(
            "Failed to parse member card data",
            e,
          );
        }
        return (
          <div className="my-2 p-3 rounded-none bg-red-100 border-2 border-red-500 text-red-700 text-sm font-bold font-mono">
            Error visualizing member card data
          </div>
        );
      }

      if (isProjectCard) {
        try {
          const payload = safeJsonParse<any>(
            String(children).replace(/\n$/, ""),
            "project_card",
            null
          );
          const ideas: ProjectIdea[] = Array.isArray(payload)
            ? payload
            : Array.isArray(payload?.ideas)
              ? payload.ideas
              : [];
          if (ideas.length > 0) {
            return <ProjectCards ideas={ideas.slice(0, 3)} />;
          }
        } catch (e) {
          console.error(
            "Failed to parse project card data",
            e,
          );
        }
        return (
          <div className="my-2 p-3 rounded-none bg-red-100 border-2 border-red-500 text-red-700 text-sm font-bold font-mono">
            Error visualizing project card data
          </div>
        );
      }

      if (isBookingHostGrid) {
        try {
          const raw = safeJsonParse<BookingHost[]>(String(children).replace(/\n$/, ""), "booking_host_grid", []);
          if (Array.isArray(raw)) return <BookingHostGrid hosts={raw} />;
        } catch { /* fall through */ }
        return <div className="my-2 p-3 bg-red-100 border-2 border-red-500 text-red-700 text-xs font-mono">Error rendering host grid</div>;
      }

      if (isBookingSlots) {
        try {
          const raw = safeJsonParse<BookingSlotBlock | null>(String(children).replace(/\n$/, ""), "booking_slots", null);
          if (raw) return <SlotPicker data={raw} />;
        } catch { /* fall through */ }
        return <div className="my-2 p-3 bg-red-100 border-2 border-red-500 text-red-700 text-xs font-mono">Error rendering slot picker</div>;
      }

      if (isBookingConfirm) {
        try {
          const raw = safeJsonParse<BookingConfirmBlock | null>(String(children).replace(/\n$/, ""), "booking_confirm", null);
          if (raw) return <BookingConfirmCard data={raw} />;
        } catch { /* fall through */ }
        return <div className="my-2 p-3 bg-red-100 border-2 border-red-500 text-red-700 text-xs font-mono">Error rendering booking confirm</div>;
      }

      if (isMeetingList) {
        try {
          const raw = safeJsonParse<MeetingItem[]>(String(children).replace(/\n$/, ""), "meeting_list", []);
          if (Array.isArray(raw)) return <MeetingList meetings={raw} />;
        } catch { /* fall through */ }
        return <div className="my-2 p-3 bg-red-100 border-2 border-red-500 text-red-700 text-xs font-mono">Error rendering meeting list</div>;
      }

      const isInline = !match;
      return (
        <code
          className={`${
            isInline
              ? "rounded-none bg-[#120f0a]/5 dark:bg-[#faf8f5]/5 border border-[#120f0a]/10 dark:border-[#faf8f5]/10 px-1.5 py-0.5 text-[0.85em] font-mono text-[#97192c] dark:text-[#fc920d]"
              : "block rounded-none bg-[#120f0a] dark:bg-[#1e0509]/30 p-4 text-[0.85em] overflow-x-auto border border-[#120f0a]/15 dark:border-[#faf8f5]/15 text-[#faf8f5] my-4 shadow-none custom-scrollbar font-mono"
          } ${className || ""}`}
          {...props}
        >
          {children}
        </code>
      );
    },
  }), [loadedImages, setActiveLightboxImage, handleQuickPrompt]);

  return (
    <div
      className={cn(
        "flex flex-col w-full h-[55vh] min-h-[420px] lg:h-[60vh] lg:min-h-[460px] xl:h-[65vh] xl:min-h-[500px] rounded-none border border-[#120f0a]/15 dark:border-[#faf8f5]/15 bg-[#faf8f5] dark:bg-[#120f0a] text-[#120f0a] dark:text-[#faf8f5] relative",
        className
      )}
      role="region"
      aria-label="bits&bytes™ chat assistant"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 border-b border-[#120f0a]/15 dark:border-[#faf8f5]/15 bg-[#faf8f5] dark:bg-[#120f0a] text-[#120f0a] dark:text-[#faf8f5] shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 border border-[#120f0a]/15 dark:border-[#faf8f5]/15 bg-[#faf8f5] dark:bg-[#120f0a] text-[#120f0a] dark:text-[#faf8f5] rounded-none select-none">
            <Bot className="w-5 h-5 text-current" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base sm:text-lg font-normal font-accent-sans text-[#120f0a] dark:text-[#faf8f5] uppercase tracking-tight flex items-center gap-2 leading-none">
              bits&bytes™ QnA
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
            </h1>
            <span className="text-[10px] font-mono tracking-widest text-[#120f0a]/65 dark:text-[#faf8f5]/65 uppercase mt-1">
              Verified from public project sources
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {messages.length > 0 && (
            <span className="hidden sm:inline-block border border-[#120f0a]/15 dark:border-[#faf8f5]/15 bg-transparent px-3 py-1 text-[9px] font-mono text-[#120f0a] dark:text-[#faf8f5] rounded-none">
              Model: {modelName}
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              setMessages([]);
              setMessage("");
              window.localStorage.removeItem(STORAGE_KEY);
            }}
            className={`flex h-9 items-center justify-center gap-2 rounded-none bg-[#faf8f5] dark:bg-[#120f0a] px-3 text-xs font-mono font-bold uppercase border border-[#120f0a] dark:border-[#faf8f5] transition-all duration-200 active:scale-[0.98] focus-visible:outline-none cursor-pointer ${messages.length === 0 ? "opacity-0 invisible" : "text-[#120f0a] dark:text-[#faf8f5] hover:bg-[#120f0a] dark:hover:bg-[#faf8f5] hover:text-[#faf8f5] dark:hover:text-[#120f0a]"}`}
            aria-label="Clear chat session"
            title="Clear chat session"
            disabled={messages.length === 0}
          >
            <Trash className="h-4 w-4" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        </div>
      </div>

      <div
        className={`flex-1 px-4 py-4 sm:px-6 relative text-[#120f0a] dark:text-[#faf8f5] scroll-smooth ${
          messages.length === 0 ? "overflow-y-hidden" : "overflow-y-auto"
        }`}
        aria-live="polite"
        aria-relevant="additions text"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-2 max-w-3xl mx-auto gap-3.5 pt-2 sm:pt-4">
            <div className="w-full border border-[#120f0a]/15 dark:border-[#faf8f5]/15 bg-[#faf8f5]/50 dark:bg-[#120f0a]/50 p-4 text-xs text-[#120f0a] dark:text-[#faf8f5] rounded-none relative">
              <p className="mb-1.5 text-sm font-normal font-accent-sans uppercase tracking-tight text-[#97192c] dark:text-[#fc920d] leading-none">
                Start with a real question, get a grounded answer.
              </p>
              <p className="font-serif-brand text-[#120f0a]/80 dark:text-[#faf8f5]/80 text-[11px] leading-relaxed">
                Ask about events, team, partnerships, or how bits&bytes™ actually
                runs. Every reply is anchored in public site sources.
              </p>
            </div>
            <div className="grid w-full gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleQuickPrompt(prompt)}
                  className="rounded-none border border-[#120f0a]/15 dark:border-[#faf8f5]/15 bg-[#faf8f5] dark:bg-[#120f0a] py-2 px-3 text-[10px] font-mono font-bold uppercase tracking-tight text-[#120f0a] dark:text-[#faf8f5] text-left transition hover:border-[#120f0a] dark:hover:border-[#faf8f5] focus-visible:outline-none group flex items-start gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <span className="text-[#97192c] dark:text-[#fc920d] font-bold group-hover:translate-x-0.5 transition-transform shrink-0">
                    ↳
                  </span>
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="space-y-6 flex flex-col pb-4">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                className={`flex w-full ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="hidden sm:flex self-end mr-3 mb-1 w-8 h-8 rounded-none bg-[#faf8f5] dark:bg-[#120f0a] items-center justify-center border border-[#120f0a] dark:border-[#faf8f5] flex-shrink-0 select-none">
                    <Bot className="w-4 h-4 text-[#120f0a] dark:text-[#faf8f5]" />
                  </div>
                )}
                <div
                  className={`w-fit max-w-[90%] sm:max-w-[85%] md:max-w-[75%] rounded-none px-5 py-3.5 text-sm leading-relaxed border border-[#120f0a] dark:border-[#faf8f5] break-words ${
                    m.role === "user"
                      ? "bg-[#97192c] text-[#faf8f5]"
                      : "bg-[#faf8f5] dark:bg-[#120f0a] text-[#120f0a] dark:text-[#faf8f5] prose dark:prose-invert prose-p:my-2 prose-headings:my-3 prose-headings:text-[#120f0a] dark:prose-headings:text-[#faf8f5] prose-headings:font-normal prose-headings:font-accent-sans prose-headings:uppercase prose-headings:tracking-tight prose-strong:text-[#120f0a] dark:prose-strong:text-[#faf8f5] prose-ul:my-2 prose-li:my-1 max-w-none font-serif-brand"
                  }`}
                >
                  {m.role === "user" ? (
                    m.content
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      urlTransform={(value) => value}
                      components={markdownComponents}
                    >
                      {m.content || "..."}
                    </ReactMarkdown>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="hidden sm:flex self-end mr-3 mb-1 w-8 h-8 rounded-none bg-[#faf8f5] dark:bg-[#120f0a] items-center justify-center border border-[#120f0a] dark:border-[#faf8f5] flex-shrink-0 select-none">
                <Bot className="w-4 h-4 text-[#120f0a] dark:text-[#faf8f5]" />
              </div>
              <div className="rounded-none border border-[#120f0a] dark:border-[#faf8f5] bg-[#faf8f5] dark:bg-[#120f0a] px-6 py-4 flex items-center gap-2 text-sm text-[#120f0a] dark:text-[#faf8f5]">
                <span className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full bg-[#97192c] animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="h-2 w-2 rounded-full bg-[#97192c] animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="h-2 w-2 rounded-full bg-[#97192c] animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </span>
              </div>
            </motion.div>
          )}
          <AnimatePresence initial={false}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="p-4 mx-auto w-full max-w-sm text-center rounded-none bg-red-100 border border-red-500 text-sm text-red-600 font-bold"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="p-3 sm:p-4 w-full bg-[#faf8f5] dark:bg-[#120f0a] border-t border-[#120f0a]/15 dark:border-[#faf8f5]/15 shrink-0 relative z-20">
        <PromptBox
          ref={promptBoxRef}
          value={message}
          onChange={handleInputChange}
          onSubmitMessage={(msg: string) => handleSend(msg)}
          className="bg-[#faf8f5] dark:bg-[#120f0a] border border-[#120f0a] dark:border-[#faf8f5] focus-within:ring-0 text-[#120f0a] dark:text-[#faf8f5]"
        />
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLightboxImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[90vh] overflow-hidden border border-[#120f0a] dark:border-[#faf8f5] bg-[#faf8f5] dark:bg-[#120f0a] p-2"
            >
              <img
                src={activeLightboxImage}
                alt="Enlarged view"
                className="max-w-full max-h-[80vh] object-contain"
              />
              <button
                type="button"
                onClick={() => setActiveLightboxImage(null)}
                className="absolute top-4 right-4 bg-[#97192c] hover:bg-[#fc920d] border border-[#120f0a] dark:border-[#faf8f5] h-10 w-10 flex items-center justify-center font-bold text-white shadow-none hover:shadow-none transition-colors duration-200 cursor-pointer active:scale-95"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
