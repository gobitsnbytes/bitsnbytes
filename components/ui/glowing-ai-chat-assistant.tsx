"use client";

import { useState, useRef, useEffect, useCallback, useId, type ChangeEvent, type MouseEvent as ReactMouseEvent } from "react";
import { useRouter, usePathname } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown } from "lucide-react";

import { useOptionalExperience } from "@/components/experience-provider";
import { CubeMark } from "@/components/chrome/wordmark";
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

type FeedbackValue = "up" | "down" | null;

const MAX_HISTORY = 8;
const FEEDBACK_STORAGE_KEY = "bb-assistant-feedback-v1";
const QUICK_PROMPTS = [
  "Who founded bits&bytes™ and what are they working on?",
  "What makes bits&bytes™ different from other student tech networks?",
  "Tell me about India Innovates 2026 — what was it?",
  "How can I join bits&bytes™ as a student developer?",
  "What kind of projects do members ship?",
  "Show me all the past events and hackathons.",
  "Generate a cool sci-fi robot concept for me! 🤖",
];

// ─── Smart FAQ: instant answers without API calls ────────────────────────────
type FaqEntry = { patterns: string[]; answer: string };

const SMART_FAQ: FaqEntry[] = [
  {
    patterns: [
      "what is bits",
      "what is bitsnbytes",
      "bits&bytes™",
      "bits&bytes",
      "about bits",
      "tell me about bits",
    ],
    answer:
      '**bits&bytes™** is a teen-led builders network based in Lucknow, India. We run hackathons, workshops, and product-focused build programs led by students.\n\n[Learn more about us](/about "cta")\n\n[Who founded it?](# "follow-up")  \n[How can I join?](# "follow-up")',
  },
  {
    patterns: [
      "how to join",
      "how can i join",
      "join bits",
      "become a member",
      "sign up",
      "get involved",
      "membership",
    ],
    answer:
      'To join bits&bytes™ **completely free**:\n\n1. **Apply** — Fill the form on our join page\n2. **Join Discord/WhatsApp** — Connect with 1400+ student builders\n3. **Attend an event or workshop** — Start building with mentors\n4. **Ship projects** — Get paired with accountability partners\n\n**Requirements:** Be a student (ages 13–19), commit 2–4 hours/week, and stay active.\n\n[Apply now](/join "cta")\n[Join WhatsApp Community](https://chat.whatsapp.com/DvAIRLgEEBxISR8bsb9kVg "cta")',
  },
  {
    patterns: [
      "contact",
      "email",
      "reach out",
      "get in touch",
      "how to contact",
    ],
    answer:
      'You can reach us at:\n\n- **Email:** hello@gobitsnbytes.org\n- **WhatsApp Community:** https://chat.whatsapp.com/DvAIRLgEEBxISR8bsb9kVg\n- **LinkedIn:** [bits&bytes™](https://www.linkedin.com/company/gobitsbytes)\n\n[Contact Page](/contact "cta")',
  },
  {
    patterns: [
      "copilot dev days",
      "copilot event",
      "github copilot",
      "april 19",
      "cubispace",
    ],
    answer:
      '**GitHub Copilot Dev Days | Lucknow (Archive)**\n\n- **Date:** Sunday, April 19, 2026\n- **Time:** 10:00 AM - 2:00 PM IST\n- **Venue:** Cubispace, Jankipuram, Lucknow\n- **Status:** Registrations closed\n\n[View Event Archive](https://luma.com/xtxua1jl "cta")\n\n[What did the event cover?](# "follow-up")',
  },
  {
    patterns: [
      "lucknow build guild",
      "build guild",
      "hardware workshop",
      "shaurya",
    ],
    answer:
      '**Lucknow Build Guild (Archive)**\n\n- **Date:** April 19, 2026\n- **Venue:** SureStay by Best Western, Lucknow\n- **Format:** Free hardware workshop and meetup\n- **Host:** Shaurya\n\n[Visit Event Website](https://www.lucknow-build-guild.xyz/ "cta")\n[Host Linktree](https://linktr.ee/shauryaashu "cta")\n[Host GitHub](https://github.com/Shaurya-Ashu "cta")',
  },
  {
    patterns: [
      "india innovates",
      "hackathon 2026",
      "ii 2026",
      "india innovates 2026",
    ],
    answer:
      '**India Innovates 2026 (Archive)**\n\nThe world\'s largest civic tech hackathon. bits&bytes™ served as the **Official Executive Partner**.\n\n- **Date:** March 28, 2026\n- **Venue:** Bharat Mandapam, New Delhi\n- **Scale:** 1.26+ crore applicants → 28,000+ → 5,000+ → **15 finalist teams**\n- **Prize Pool:** ₹10 Lakh+ (₹1L/₹75K/₹50K/₹25K per domain)\n- **Domains:** Urban Solutions, Digital Democracy, Open Innovation\n- **Dignitaries:** Delhi CM Rekha Gupta, Bihar Assembly Speaker, MP Manoj Tiwari\n- **Media:** #IndiaInnovates2026 trended on X on event day\n\n[View official site](https://indiainnovates.org "cta")',
  },
  {
    patterns: ["execron", "execron 1.0", "iit kanpur hackathon", "techkriti"],
    answer:
      '**Execron 1.0 (Archive)**\n\nAI Hackathon & Workshop for teen builders at IIT Kanpur.\n\n- **Date:** March 19–22, 2026\n- **Venue:** IIT Kanpur\n- **Format:** 4-hour workshop + 24-hour hackathon sprint\n- **Target:** Classes 9–12 (Ages ~14–18)\n- **Topics:** AI & ML, Web Dev, App Dev, Cybersecurity, Cloud Computing\n- **Partner:** In collaboration with TechKriti \'26, ByteForge\n- **Team Size:** 1–4 members\n\n[View event details](https://byteforge.paxus.in/ "cta")',
  },
  {
    patterns: [
      "who founded",
      "founders",
      "who started",
      "who created",
      "team",
      "leadership",
      "core team",
    ],
    answer:
      '**bits&bytes™ Core Team:**\n\n- **Yash Singh** — Chief Executive Officer\n\n- **Akshat Kushwaha** — Chief Technology Officer\n\n- **Aadrika Maurya** — Chief Creative Officer & Chief Operating Officer\n\n- **Devaansh Pathak** — Chief Financial Officer\n\n- **Drishti Arora** — Chief Growth Officer\n\n- **Raghav** — Head of Operations\n\n- **Maryam Fatima** — Head of Brand & Media\n\n- **Srishti Singh** — Head of Partnerships & Institutional Relations\n\n- **Angel** — Head of Research & Strategy\n\n[Meet the team](/about "cta")',
  },
  {
    patterns: ["discord", "community link", "whatsapp group", "discord server"],
    answer:
      'Join the bits&bytes™ community here:\n\n[Join WhatsApp Community](https://chat.whatsapp.com/DvAIRLgEEBxISR8bsb9kVg "cta")\n\n[What events are coming up?](# "follow-up")',
  },
  {
    patterns: ["where are you", "location", "based in", "city", "lucknow"],
    answer:
      'We are based in **Lucknow, India**, and we collaborate with students and partners across other cities as well.\n\n[See events](/events "cta")',
  },
  {
    patterns: [
      "what do you do",
      "activities",
      "what does bits",
      "programs",
      "workshops",
      "what makes bits different",
      "why bits",
    ],
    answer:
      'At bits&bytes™ we build for **high-agency teen builders** who want to ship real products:\n\n- **Hackathons** — Regional hackathons, builder sprints, and 48-hour prototype builds\n- **Workshops** — Web dev, AI/ML, mobile apps, UI/UX, hardware building\n- **Build programs** — Portfolio-ready projects with mentorship at every stage\n- **Mentorship pods** — Pair programming, code reviews, and accountability partners\n\nWe treat participants like **ambitious builders**, not beginners. Every prompt becomes a prototype. You\'ll ship real impact.\n\n[View our projects](/projects "cta")',
  },
  {
    patterns: ["events", "upcoming event", "next event", "what events"],
    answer:
      '**Events Snapshot:**\n\n1. **Lucknow Build Guild** — Archived\n2. **GitHub Copilot Dev Days | Lucknow** — Archived\n3. **Execron 1.0** — Archived\n4. **India Innovates 2026** — Archived\n\n[View all events](/events "cta")\n\n[Tell me about Lucknow Build Guild](# "follow-up")',
  },
  {
    patterns: [
      "akshat achievement",
      "akshat's achievement",
      "what has akshat done",
      "akshat projects",
      "akshats' achievements",
    ],
    answer:
      '**Akshat Kushwaha** is Chief Technology Officer (CTO) at bits&bytes™, focused on production-grade systems, AI-native workflows, and platform reliability for network projects.\n\n[See our projects](/projects "cta")',
  },
];

function matchFaq(input: string): string | null {
  const lower = input.toLowerCase().trim();
  if (lower.length < 3) return null;
  for (const entry of SMART_FAQ) {
    for (const pattern of entry.patterns) {
      if (lower.includes(pattern) || pattern.includes(lower)) {
        return entry.answer;
      }
    }
  }
  return null;
}

const MARKDOWN = consoleMarkdown(false);
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
// Acid marker highlight (DESIGN.md: acid = marker), removed after 5s.
const HIGHLIGHT_CLASS = "bb-ai-highlight";
const HIGHLIGHT_STYLE =
  "background:#ffe600;color:#120f0a;outline:2px solid #120f0a;padding:0 2px;transition:background 0.4s,outline 0.4s;";

/**
 * Floating assistant on every route except /qna: a square window-chrome launcher bottom-right that
 * opens a stripe.dev-style console. Hidden while the cookie banner (also bottom-right) is open; the
 * mobile chapter chip lives bottom-left, so the two never meet.
 */
const FloatingAiAssistant = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelName, setModelName] = useState("");
  const [hasHydrated, setHasHydrated] = useState(false);
  const [feedbackMap, setFeedbackMap] = useState<Record<number, FeedbackValue>>({});
  const [sessionId] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    const existing = window.sessionStorage.getItem("bb-session-id");
    if (existing) return existing;
    const newId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    window.sessionStorage.setItem("bb-session-id", newId);
    return newId;
  });
  const [showProactive, setShowProactive] = useState(false);
  const ctaClickedRef = useRef(false);

  const experience = useOptionalExperience();
  const motionOn = experience?.motionEnabled ?? false;
  const lenis = experience?.lenis ?? null;
  const panelId = useId();
  const titleId = useId();

  const chatRef = useRef<HTMLDivElement | null>(null);
  const launcherRef = useRef<HTMLButtonElement | null>(null);
  const promptBoxRef = useRef<PromptBoxRef | null>(null);
  const logRef = useRef<HTMLDivElement | null>(null);
  const nextIdRef = useRef(1);
  const streamControllerRef = useRef<AbortController | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const appendMessage = useCallback((newMessage: ChatMessage) => {
    setMessages((prev) => [...prev, newMessage].slice(-MAX_HISTORY));
  }, []);

  const updateMessageContent = useCallback((messageId: number, updater: (prev: string) => string) => {
    setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, content: updater(m.content) } : m)));
  }, []);

  // Keep the newest entry in view (scrolls the log only, never the page).
  useEffect(() => {
    const log = logRef.current;
    if (!isChatOpen || !log) return;
    log.scrollTo({ top: log.scrollHeight, behavior: motionOn ? "smooth" : "auto" });
  }, [messages, isLoading, isChatOpen, motionOn]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (isChatOpen) {
      setShowProactive(false);
      return;
    }

    const proactiveKey = "bb-proactive-shown";
    if (sessionStorage.getItem(proactiveKey)) return;

    const timer = setTimeout(() => {
      setShowProactive(true);
      sessionStorage.setItem(proactiveKey, "true");
    }, 15000);

    return () => clearTimeout(timer);
  }, [isChatOpen, hasHydrated, pathname]);

  useEffect(() => {
    try {
      const stored = loadChat(MAX_HISTORY);
      setMessages(stored.messages);
      nextIdRef.current = Math.max(stored.nextId, nextIdRef.current);
      if (stored.isChatOpen !== null) setIsChatOpen(stored.isChatOpen);
      if (stored.draft !== null) setMessage(stored.draft);
    } catch (err) {
      console.error("Failed to restore assistant history:", err);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hasHydrated) saveChat({ messages, isChatOpen, draft: message }, true);
  }, [messages, isChatOpen, message, hasHydrated]);

  useEffect(() => () => streamControllerRef.current?.abort(), []);

  useEffect(() => {
    if (!isChatOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (chatRef.current && !chatRef.current.contains(target)) {
        // The launcher toggles itself; the image lightbox is portalled outside the panel.
        if (!target.closest(".floating-ai-button, [data-chat-overlay]")) {
          setIsChatOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isChatOpen]);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > MAX_CHARS) return;
    setMessage(e.target.value);
  };

  const handleQuickPrompt = useCallback((prompt: string) => {
    setIsChatOpen(true);
    setMessage(prompt);
    setTimeout(() => {
      promptBoxRef.current?.focus();
    }, 0);
  }, []);

  // Follow-up links and booking blocks inside replies send their prompt through this event.
  useEffect(() => {
    const onPrompt = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (typeof detail === "string") handleQuickPrompt(detail);
    };
    window.addEventListener("bb:qna-prompt", onPrompt);
    return () => window.removeEventListener("bb:qna-prompt", onPrompt);
  }, [handleQuickPrompt]);

  /**
   * Robust text highlighter.
   * 1. Walks all text nodes in <main> (falls back to <body>) looking for the snippet.
   * 2. Splits the matching text node and wraps the matching part in a <mark>.
   * 3. Scrolls the mark into view (through Lenis when it runs) and removes it after 5 s.
   * Handles multi-word phrases and is case-insensitive.
   */
  const performHighlight = (snippet: string) => {
    if (!snippet || typeof document === "undefined") return;
    const query = snippet.trim();
    if (!query) return;

    const root = document.querySelector("main") ?? document.body;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);

    // Clean up any existing highlights first
    document.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach((el) => {
      const parent = el.parentNode;
      if (!parent) return;
      while (el.firstChild) parent.insertBefore(el.firstChild, el);
      parent.removeChild(el);
    });

    let highlightedEl: HTMLElement | null = null;
    let node: Node | null;

    while ((node = walker.nextNode())) {
      const text = node.nodeValue ?? "";
      const idx = text.toLowerCase().indexOf(query.toLowerCase());
      if (idx === -1) continue;

      // Skip nodes inside the chat overlay itself
      const parent = node.parentElement;
      if (!parent) continue;
      if (chatRef.current?.contains(parent)) continue;

      // Split the text node: [before][match][after]
      const before = text.slice(0, idx);
      const match = text.slice(idx, idx + query.length);
      const after = text.slice(idx + query.length);

      const mark = document.createElement("mark");
      mark.className = HIGHLIGHT_CLASS;
      mark.setAttribute("style", HIGHLIGHT_STYLE);
      mark.textContent = match;

      const fragment = document.createDocumentFragment();
      if (before) fragment.appendChild(document.createTextNode(before));
      fragment.appendChild(mark);
      if (after) fragment.appendChild(document.createTextNode(after));

      parent.replaceChild(fragment, node);
      highlightedEl = mark;
      break; // highlight the first match only
    }

    if (highlightedEl) {
      const target = highlightedEl;
      if (lenis) lenis.scrollTo(target, { offset: -window.innerHeight / 2 + target.offsetHeight / 2 });
      else target.scrollIntoView({ behavior: motionOn ? "smooth" : "auto", block: "center" });
      // Fade out after 5 s then unwrap
      setTimeout(() => {
        target.style.setProperty("background", "transparent", "important");
        target.style.setProperty("outline", "none", "important");
        target.style.setProperty("color", "inherit", "important");
        setTimeout(() => {
          const p = target.parentNode;
          if (!p) return;
          while (target.firstChild) p.insertBefore(target.firstChild, target);
          p.removeChild(target);
        }, 500);
      }, 5000);
    }
  };

  // ─── Feedback helpers ──────────────────────────────────────────────────────
  const handleFeedback = useCallback(
    (messageId: number, value: FeedbackValue, messageContent?: string) => {
      setFeedbackMap((prev) => {
        const isRemoving = prev[messageId] === value;
        const newValue = isRemoving ? null : value;
        const next = { ...prev, [messageId]: newValue };

        try {
          const stored = JSON.parse(localStorage.getItem(FEEDBACK_STORAGE_KEY) ?? "[]");
          stored.push({
            messageId,
            feedback: newValue,
            timestamp: new Date().toISOString(),
            model: modelName,
          });
          localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(stored.slice(-200)));

          // Post to Supabase
          if (newValue !== null && sessionId) {
            fetch("/api/assistant/feedback", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                sessionId,
                messageId,
                feedback: newValue,
                messageText: messageContent || "",
                model: modelName,
              }),
            }).catch((E) => console.error("Feedback post error", E));
          }
        } catch {}
        return next;
      });
    },
    [modelName, sessionId],
  );

  const handleSend = async (manualMessagePayload?: string) => {
    const textToUse = typeof manualMessagePayload === "string" ? manualMessagePayload : message;
    const trimmed = textToUse.trim();
    if (!trimmed || isLoading) return;

    // ─── Smart FAQ: try instant answer first ──────────────────────────────
    const faqAnswer = matchFaq(trimmed);
    if (faqAnswer) {
      appendMessage({ id: nextIdRef.current++, role: "user", content: trimmed });
      appendMessage({ id: nextIdRef.current++, role: "assistant", content: faqAnswer });
      setMessage("");
      return;
    }

    const payloadMessages = [
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: trimmed },
    ];

    appendMessage({ id: nextIdRef.current++, role: "user", content: trimmed });
    if (typeof manualMessagePayload !== "string") setMessage("");
    setIsLoading(true);
    setError(null);

    const assistantMessageId = nextIdRef.current++;
    appendMessage({ id: assistantMessageId, role: "assistant", content: "" });
    const update = (updater: (prev: string) => string) => updateMessageContent(assistantMessageId, updater);

    streamControllerRef.current?.abort();
    const controller = new AbortController();
    streamControllerRef.current = controller;
    let navigatePath: string | null = null;
    let highlightSnippet: string | null = null;

    try {
      await streamAssistant(
        {
          messages: payloadMessages,
          pathname,
          sessionId,
          pageText: typeof document !== "undefined" ? document.body.innerText.trim().slice(0, 3000) : "",
        },
        controller.signal,
        {
          model: setModelName,
          token: (chunk) => update((prev) => prev + chunk),
          error: setError,
          done: (action) => {
            if (action?.type === "navigate" && typeof action.path === "string") {
              navigatePath = action.path;
            } else if (action?.type === "highlight" && typeof action.textSnippet === "string") {
              const snippet = action.textSnippet;
              highlightSnippet = snippet;
              setTimeout(() => performHighlight(snippet), 120);
            } else if (action?.type === "generate_image") {
              generateImage(action, update);
            }
          },
        },
      );

      update((prev) => {
        if (prev && prev.trim().length > 0) return prev;
        if (navigatePath) return "Taking you there! 🚀";
        if (highlightSnippet) return "Here's what I found for you! ✨";
        return "I'm not sure about that based on the information publicly available on this site.";
      });

      if (navigatePath) router.push(navigatePath);
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

  const sendMessage = (text: string) => {
    setIsChatOpen(true);
    void handleSend(text);
  };

  useEffect(() => {
    const nudges: Record<string, { delayMs: number; text: string }> = {
      "/join": {
        delayMs: 45_000,
        text: "need help figuring out which role fits you?",
      },
      "/events": {
        delayMs: 30_000,
        text: "want me to walk you through the upcoming events?",
      },
      "/contact": {
        delayMs: 20_000,
        text: "want me to help you send a message to the team directly?",
      },
    };

    const config = nudges[pathname];
    if (!config) return;

    const shownKey = `bb-proactive-nudge-${pathname}`;
    if (typeof window !== "undefined" && window.sessionStorage.getItem(shownKey)) return;

    let timer: number | null = null;

    const schedule = () => {
      if (timer) window.clearTimeout(timer);
      if (ctaClickedRef.current || isLoading) return;
      timer = window.setTimeout(() => {
        if (ctaClickedRef.current) return;
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(shownKey, "true");
        }
        sendMessage(config.text);
      }, config.delayMs);
    };

    const interactionHandler = () => schedule();
    const clickHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("a[href], button, [role='button'], [data-tally-open]")) {
        ctaClickedRef.current = true;
        if (timer) window.clearTimeout(timer);
        return;
      }
      schedule();
    };

    schedule();
    window.addEventListener("mousemove", interactionHandler);
    window.addEventListener("keydown", interactionHandler);
    window.addEventListener("scroll", interactionHandler, { passive: true });
    window.addEventListener("touchstart", interactionHandler, { passive: true });
    window.addEventListener("click", clickHandler);

    return () => {
      if (timer) window.clearTimeout(timer);
      window.removeEventListener("mousemove", interactionHandler);
      window.removeEventListener("keydown", interactionHandler);
      window.removeEventListener("scroll", interactionHandler);
      window.removeEventListener("touchstart", interactionHandler);
      window.removeEventListener("click", clickHandler);
      ctaClickedRef.current = false;
    };
  }, [pathname, isLoading]);

  const close = () => {
    streamControllerRef.current?.abort();
    setIsChatOpen(false);
    launcherRef.current?.focus();
  };

  const handleToggle = (e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsChatOpen((open) => {
      const next = !open;
      if (next) {
        setTimeout(() => {
          promptBoxRef.current?.focus();
        }, 0);
      } else {
        streamControllerRef.current?.abort();
      }
      return next;
    });
  };

  const clear = () => {
    setMessages([]);
    setMessage("");
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const last = messages[messages.length - 1];
  const enter = motionOn ? { duration: 0.22, ease: EASE_OUT } : { duration: 0 };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6 [body:has(aside[aria-label^=Cookie])_&]:hidden">
      <div className="relative">
        {/* Proactive note */}
        <AnimatePresence initial={false}>
          {showProactive && !isChatOpen && (
            <motion.div
              role="status"
              initial={{ opacity: 0, y: motionOn ? 8 : 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: motionOn ? 6 : 0 }}
              transition={enter}
              className="absolute bottom-full right-0 mb-3 w-[224px] border-3 border-ink bg-paper text-ink shadow-[4px_4px_0_0_var(--ink)] [--focus-ring:var(--cobalt)]"
            >
              <div className="flex items-center justify-between gap-2 border-b-2 border-ink bg-orange py-1 pl-2.5 pr-1">
                <span className="truncate font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
                  bits&bytes™ Assistant
                </span>
                <button
                  type="button"
                  onClick={() => setShowProactive(false)}
                  aria-label="Dismiss"
                  className="grid size-6 shrink-0 cursor-pointer place-items-center font-mono text-xs font-bold hover:bg-ink hover:text-paper"
                >
                  ✕
                </button>
              </div>
              <p className="px-3 py-2.5 text-[13px] font-semibold leading-snug">
                {pathname === "/events"
                  ? "Want help registering for an event? 🎟️"
                  : pathname === "/join"
                    ? "I can help you join the club! 💡"
                    : pathname === "/contact"
                      ? "Need to reach someone specific? Ask me! 👋"
                      : "Hey! Want to know what we do? 🚀"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Launcher: a tiny window — orange title bar with three lights over an ink body with the cube mark. */}
        <button
          ref={launcherRef}
          type="button"
          onClick={handleToggle}
          aria-expanded={isChatOpen}
          aria-controls={isChatOpen ? panelId : undefined}
          aria-label={isChatOpen ? "Close bits&bytes™ assistant" : "Open bits&bytes™ assistant"}
          data-cursor-label={isChatOpen ? "CLOSE" : "OPEN CONSOLE"}
          className="floating-ai-button ml-auto flex cursor-pointer flex-col border-3 border-ink bg-ink text-cream shadow-[4px_4px_0_0_var(--orange)] transition-[transform,box-shadow] duration-100 ease-riot hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--orange)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none motion-reduce:transition-none dark:border-cream"
        >
          <span aria-hidden className="flex h-3.5 w-full items-center gap-[3px] border-b-2 border-ink bg-orange px-1">
            <span className="size-1.5 bg-burgundy" />
            <span className="size-1.5 bg-acid" />
            <span className="size-1.5 bg-slime" />
          </span>
          <span aria-hidden className="flex h-11 min-w-11 items-center justify-center gap-2 px-2.5">
            {isChatOpen ? (
              <span className="grid size-6 place-items-center font-mono text-base font-bold">✕</span>
            ) : (
              <CubeMark className="size-6" />
            )}
            <span className="hidden font-mono text-[11px] font-bold uppercase tracking-[0.14em] sm:inline">
              {isChatOpen ? "Esc" : "Ask"}
            </span>
          </span>
        </button>

        {/* Console */}
        <AnimatePresence initial={false}>
          {isChatOpen && (
            <motion.div
              ref={chatRef}
              id={panelId}
              role="dialog"
              aria-modal="false"
              aria-labelledby={titleId}
              data-lenis-prevent=""
              initial={{ opacity: 0, y: motionOn ? 12 : 0, scale: motionOn ? 0.97 : 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: motionOn ? 8 : 0, scale: motionOn ? 0.98 : 1 }}
              transition={enter}
              onKeyDown={(event) => {
                if (event.key !== "Escape") return;
                event.stopPropagation();
                close();
              }}
              className="tone-ink fixed inset-x-3 bottom-[5.5rem] top-24 flex origin-bottom-right flex-col border-3 border-line shadow-[8px_8px_0_0_var(--orange)] sm:absolute sm:inset-auto sm:bottom-[calc(100%+14px)] sm:right-0 sm:h-[min(560px,calc(100svh-200px))] sm:w-[400px]"
            >
              <ConsoleBar title="bits&bytes™ Assistant" titleId={titleId}>
                {messages.length > 0 && (
                  <ConsoleButton onClick={clear} aria-label="Clear chat" title="Clear chat">
                    Clear
                  </ConsoleButton>
                )}
                <ConsoleButton onClick={close} aria-label="Close assistant" title="Close assistant">
                  ✕
                </ConsoleButton>
              </ConsoleBar>

              <div
                ref={logRef}
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3.5 py-2 font-mono text-[12.5px] leading-relaxed"
                aria-live="polite"
                aria-relevant="additions text"
              >
                {messages.length === 0 && (
                  <div className="flex flex-col gap-3 py-2">
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] opacity-85">
                      Ask about our team, hackathons, or how to get involved.
                    </p>
                    <PromptList prompts={QUICK_PROMPTS} onPick={handleQuickPrompt} />
                  </div>
                )}

                <ol>
                  {messages.map((m, index) => {
                    const feedback = feedbackMap[m.id];
                    return (
                      <LogEntry
                        key={m.id}
                        role={m.role}
                        index={index}
                        footer={
                          m.role === "assistant" && m.content && m.content.length > 0 && !isLoading ? (
                            <div className="mt-2 flex items-center gap-1.5">
                              {(["up", "down"] as const).map((value) => (
                                <button
                                  key={value}
                                  type="button"
                                  onClick={() => handleFeedback(m.id, value, m.content)}
                                  aria-pressed={feedback === value}
                                  aria-label={value === "up" ? "Good response" : "Bad response"}
                                  title={value === "up" ? "Good response" : "Bad response"}
                                  className="grid size-7 cursor-pointer place-items-center border-2 border-line/50 transition-colors hover:bg-cream hover:text-ink aria-pressed:border-line aria-pressed:bg-orange aria-pressed:text-ink"
                                >
                                  {value === "up" ? <ThumbsUp className="size-3" /> : <ThumbsDown className="size-3" />}
                                </button>
                              ))}
                              {feedback && (
                                <span className="ml-1.5 font-mono text-[10px] font-bold text-signal">
                                  {feedback === "up" ? "Thanks!" : "Noted, we'll improve"}
                                </span>
                              )}
                            </div>
                          ) : null
                        }
                      >
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
                    );
                  })}
                </ol>
                {isLoading && <StatusLine>Thinking...</StatusLine>}
                {error && <ErrorLine>{error}</ErrorLine>}
              </div>

              <div className="shrink-0 border-t-3 border-line p-3">
                <PromptBox
                  ref={promptBoxRef}
                  value={message}
                  onChange={handleInputChange}
                  onSubmitMessage={(msg: string) => void handleSend(msg)}
                  maxChars={MAX_CHARS}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export { FloatingAiAssistant };
