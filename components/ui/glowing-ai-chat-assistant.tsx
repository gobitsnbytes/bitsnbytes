"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type {
  KeyboardEvent,
  ChangeEvent,
  MouseEvent as ReactMouseEvent,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { safeJsonParse } from "@/lib/safe-json";
import { PromptBox, PromptBoxRef } from "@/components/ui/chatgpt-prompt-input";

import {
  Bot,
  X,
  Trash,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

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
    <div className="my-3 rounded-none border-3 border-[#120f0a] bg-white p-4 text-[#120f0a] shadow-[4px_4px_0px_0px_#120f0a]">
      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#97192c]">
        Event Countdown
      </p>
      <h4 className="mt-1 text-sm font-black uppercase tracking-tight text-[#120f0a]">{payload.event}</h4>
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
              className="rounded-none border-2 border-[#120f0a] bg-[#fee9cf] px-2 py-2 shadow-[2px_2px_0px_0px_#120f0a]"
            >
              <div className="text-base font-black text-[#120f0a]">{item.value}</div>
              <div className="text-[9px] font-mono font-bold text-[#413f3b] uppercase">{item.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TeamMemberCard({ payload }: { payload: MemberCardPayload }) {
  return (
    <div className="my-3 rounded-none border-3 border-[#120f0a] bg-white p-4 text-[#120f0a] shadow-[4px_4px_0px_0px_#120f0a]">
      <div className="flex items-center gap-3">
        {payload.photo ? (
          <img
            src={payload.photo}
            alt={payload.name}
            className="h-12 w-12 rounded-none object-cover border-2 border-[#120f0a] shadow-[2px_2px_0px_0px_#120f0a]"
          />
        ) : (
          <div className="h-12 w-12 rounded-none border-2 border-[#120f0a] bg-[#fee9cf] shadow-[2px_2px_0px_0px_#120f0a]" />
        )}
        <div>
          <p className="text-sm font-black uppercase tracking-tight text-[#120f0a]">{payload.name}</p>
          <span className="inline-flex mt-1.5 rounded-none border-2 border-[#120f0a] bg-[#fee9cf] px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wide text-[#120f0a]">
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
              className="text-[10px] font-mono font-bold uppercase tracking-wider rounded-none border-2 border-[#120f0a] bg-white px-2.5 py-1 text-[#120f0a] shadow-[2px_2px_0px_0px_#120f0a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#120f0a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              GitHub
            </a>
          )}
          {payload.socials.linkedin && (
            <a
              href={payload.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-mono font-bold uppercase tracking-wider rounded-none border-2 border-[#120f0a] bg-white px-2.5 py-1 text-[#120f0a] shadow-[2px_2px_0px_0px_#120f0a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#120f0a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
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
          className="rounded-none border-3 border-[#120f0a] bg-white p-4 text-[#120f0a] shadow-[4px_4px_0px_0px_#120f0a]"
        >
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="text-sm font-black uppercase tracking-tight text-[#120f0a]">{idea.title}</p>
            {idea.difficulty && (
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider rounded-none border-2 border-[#120f0a] bg-[#fee9cf] px-2 py-0.5 text-[#120f0a]">
                {idea.difficulty}
              </span>
            )}
          </div>
          <p className="mt-2 text-xs font-semibold text-[#413f3b] leading-relaxed">{idea.description}</p>
          {Array.isArray(idea.tech_stack) && idea.tech_stack.length > 0 && (
            <p className="mt-3 text-[10px] font-mono font-bold uppercase tracking-wider text-[#97192c]">
              Stack: {idea.tech_stack.join(" • ")}
            </p>
          )}
          {idea.why_it_fits_theme && (
            <p className="mt-2 text-xs font-bold text-emerald-600 bg-emerald-50 border-2 border-emerald-500 rounded-none px-2.5 py-1.5 inline-block">
              Theme fit: {idea.why_it_fits_theme}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
}

type FeedbackValue = "up" | "down" | null;

const MAX_CHARS = 2000;
const MAX_HISTORY = 8;
const STORAGE_KEY = "bb-floating-assistant-state-v1";
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

type StreamPayload =
  | { type: "meta"; model: string }
  | { type: "token"; content: string }
  | {
      type: "done";
      action?: {
        type: string;
        path?: string;
        textSnippet?: string;
        formData?: any;
      } | null;
    }
  | { type: "error"; message?: string };

type StoredAssistantState = {
  messages?: ChatMessage[];
  isChatOpen?: boolean;
  draft?: string;
};

const FloatingAiAssistant: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelName, setModelName] = useState("");
  const [hasHydrated, setHasHydrated] = useState(false);
  const [feedbackMap, setFeedbackMap] = useState<Record<number, FeedbackValue>>(
    {},
  );
  const [sessionId] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    const existing = window.sessionStorage.getItem("bb-session-id");
    if (existing) return existing;
    const newId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    window.sessionStorage.setItem("bb-session-id", newId);
    return newId;
  });
  const [showProactive, setShowProactive] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null);
  const ctaClickedRef = useRef(false);

  const chatRef = useRef<HTMLDivElement | null>(null);
  const promptBoxRef = useRef<PromptBoxRef | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const nextIdRef = useRef(1);
  const streamControllerRef = useRef<AbortController | null>(null);
  const router = useRouter();
  const pathname = usePathname();

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
    if (!isChatOpen) return;
    scrollToBottom();
  }, [messages, isChatOpen, scrollToBottom]);

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
        if (typeof parsed.isChatOpen === "boolean") {
          setIsChatOpen(parsed.isChatOpen);
        }
        if (typeof parsed.draft === "string") {
          setMessage(parsed.draft);
          setCharCount(parsed.draft.length);
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

    // Clean base64 strings before saving so we don't blow up localStorage limit!
    const safeMessages = messages.map((m) => ({
      ...m,
      content: m.content.replace(
        /data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g,
        "https://placehold.co/600x400/27272a/e45a92?text=Image+Removed+For+Storage",
      ),
    }));

    const payload: StoredAssistantState = {
      messages: safeMessages,
      isChatOpen,
      draft: message,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.error("Failed to persist assistant history:", err);
    }
  }, [messages, isChatOpen, message, hasHydrated]);

  useEffect(() => {
    return () => {
      streamControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (!isChatOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (chatRef.current && !chatRef.current.contains(target)) {
        if (!target.closest(".floating-ai-button")) {
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
    const value = e.target.value;
    if (value.length > MAX_CHARS) return;
    setMessage(value);
    setCharCount(value.length);
  };

  const handleQuickPrompt = (prompt: string) => {
    setIsChatOpen(true);
    setMessage(prompt);
    setCharCount(prompt.length);
    setTimeout(() => {
      promptBoxRef.current?.focus();
    }, 0);
  };

  /**
   * Robust text highlighter.
   * 1. Walks all text nodes in <main> (falls back to <body>) looking for the snippet.
   * 2. Splits the matching text node and wraps the matching part in a <mark>.
   * 3. Scrolls the mark into view and removes it after 5 s.
   * Handles multi-word phrases and is case-insensitive.
   */
  const performHighlight = (snippet: string) => {
    if (!snippet || typeof document === "undefined") return;
    const query = snippet.trim();
    if (!query) return;

    const root = document.querySelector("main") ?? document.body;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);

    const HIGHLIGHT_CLASS = "bb-ai-highlight";
    const HIGHLIGHT_STYLE =
      "background:rgba(228,90,146,0.35);outline:2px solid rgba(228,90,146,0.8);border-radius:4px;padding:0 2px;transition:background 0.4s,outline 0.4s;";

    // Clean up any existing highlights first
    document.querySelectorAll(".bb-ai-highlight").forEach((el) => {
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
      highlightedEl.scrollIntoView({ behavior: "smooth", block: "center" });
      // Fade out after 5 s then unwrap
      setTimeout(() => {
        if (!highlightedEl) return;
        highlightedEl.style.setProperty(
          "background",
          "transparent",
          "important",
        );
        highlightedEl.style.setProperty("outline", "none", "important");
        setTimeout(() => {
          if (!highlightedEl?.parentNode) return;
          const p = highlightedEl.parentNode;
          while (highlightedEl.firstChild)
            p.insertBefore(highlightedEl.firstChild, highlightedEl);
          p.removeChild(highlightedEl);
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
          const stored = JSON.parse(
            localStorage.getItem(FEEDBACK_STORAGE_KEY) ?? "[]",
          );
          stored.push({
            messageId,
            feedback: newValue,
            timestamp: new Date().toISOString(),
            model: modelName,
          });
          localStorage.setItem(
            FEEDBACK_STORAGE_KEY,
            JSON.stringify(stored.slice(-200)),
          );

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

  const handleExport = () => {
    let md = "# bits&bytes™ Assistant Session\n\n";
    messages.forEach((m) => {
      const role = m.role === "user" ? "**You**" : "**Assistant**";
      md += `${role}:\n${m.content}\n\n`;
    });
    navigator.clipboard.writeText(md).then(() => {
      const el = document.getElementById("export-toast");
      if (el) {
        el.style.opacity = "1";
        setTimeout(() => (el.style.opacity = "0"), 2000);
      }
    });
  };

  const handleSend = async (manualMessagePayload?: string) => {
    const textToUse =
      typeof manualMessagePayload === "string" ? manualMessagePayload : message;
    const trimmed = textToUse.trim();
    if (!trimmed || isLoading) return;

    // ─── Smart FAQ: try instant answer first ──────────────────────────────
    const faqAnswer = matchFaq(trimmed);
    if (faqAnswer) {
      const userMsg: ChatMessage = {
        id: nextIdRef.current++,
        role: "user",
        content: trimmed,
      };
      const botMsg: ChatMessage = {
        id: nextIdRef.current++,
        role: "assistant",
        content: faqAnswer,
      };
      appendMessage(userMsg);
      appendMessage(botMsg);
      setMessage("");
      setCharCount(0);
      return;
    }

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
    if (typeof manualMessagePayload !== "string") {
      setMessage("");
      setCharCount(0);
    }
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
        body: JSON.stringify({
          messages: payloadMessages,
          pathname,
          sessionId,
          pageText:
            typeof document !== "undefined"
              ? document.body.innerText.trim().slice(0, 3000)
              : "",
        }),
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
      let highlightSnippet: string | null = null;

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
            } else if (
              actionData?.type === "highlight" &&
              typeof actionData.textSnippet === "string"
            ) {
              highlightSnippet = actionData.textSnippet;
              setTimeout(() => {
                performHighlight(actionData.textSnippet as string);
              }, 120);
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
        if (prev && prev.trim().length > 0) return prev;
        if (navigatePath) return "Taking you there! 🚀";
        if (highlightSnippet) return "Here's what I found for you! ✨";
        return "I'm not sure about that based on the information publicly available on this site.";
      });

      if (navigatePath) {
        router.push(navigatePath);
      }
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
          <div className="relative overflow-hidden rounded-none bg-white w-full aspect-video border-3 border-[#120f0a] flex items-center justify-center p-4 my-2 shadow-[4px_4px_0px_0px_#120f0a]">
            <div className="flex flex-col items-center gap-3 relative z-10">
              <div className="flex gap-1.5 justify-center">
                <div
                  className="h-2.5 w-2.5 rounded-none bg-[#97192c] border border-[#120f0a] animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="h-2.5 w-2.5 rounded-none bg-[#fc920d] border border-[#120f0a] animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="h-2.5 w-2.5 rounded-none bg-[#97192c] border border-[#120f0a] animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#120f0a] animate-pulse">
                Synthesizing Pixels
              </span>
            </div>
          </div>
        );
      }
      return <p className="my-1 text-[0.75rem]">{children}</p>;
    },
    img: ({ src, alt }: any) => {
      if (!src) return null;
      const isLoaded = loadedImages[src];
      return (
        <div 
          className="relative overflow-hidden border-3 border-[#120f0a] shadow-[4px_4px_0px_0px_#120f0a] my-3 w-full aspect-video bg-[#fee9cf]/20 cursor-zoom-in group hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#120f0a] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all duration-150"
          onClick={() => setActiveLightboxImage(src)}
        >
          {!isLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#eae8e4] animate-pulse z-10">
              <div className="flex gap-1.5 justify-center mb-2">
                <div className="h-2 w-2 rounded-none bg-[#97192c] animate-ping" />
                <div className="h-2 w-2 rounded-none bg-[#fc920d] animate-ping [animation-delay:0.2s]" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#120f0a]">
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
            className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
      );
    },
    h1: ({ children }: any) => (
      <h1 className="my-2 text-sm font-bold">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="my-2 text-sm font-semibold">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="my-1.5 text-xs font-semibold">
        {children}
      </h3>
    ),
    ul: ({ children }: any) => (
      <ul className="my-1 list-disc pl-4">
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="my-1 list-decimal pl-4">
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li className="my-0.5 text-[0.75rem]">
        {children}
      </li>
    ),
    strong: ({ children }: any) => (
      <strong className="font-bold">
        {children}
      </strong>
    ),
    a: ({ href, title, children, ...props }: any) => {
      if (title === "button" || title === "cta") {
        return (
          <a
            href={href}
            className="inline-flex mt-2 mb-1 w-full sm:w-auto items-center justify-center rounded-none bg-[#fc920d] border-2 border-[#120f0a] px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-[#120f0a] shadow-[2px_2px_0px_0px_#120f0a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#120f0a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-center"
            {...props}
          >
            {children}
          </a>
        );
      }
      if (title === "follow-up") {
        return (
          <button
            onClick={(e) => {
              e.preventDefault();
              const promptText = Array.isArray(children)
                ? children.join("")
                : String(children);
              handleQuickPrompt(promptText);
            }}
            className="block w-full mt-2 text-left rounded-none border-2 border-[#120f0a] bg-white px-3 py-2 text-xs text-[#120f0a] font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#120f0a] hover:bg-[#fee9cf] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#120f0a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            ↳ {children}
          </button>
        );
      }
      if (href?.startsWith("#")) {
        return (
          <a
            href={href}
            className="text-[#97192c] underline decoration-[#97192c]/30 underline-offset-2 hover:decoration-[#97192c] transition-colors font-bold"
            {...props}
          >
            {children}
          </a>
        );
      }
      return (
        <a
          href={href}
          className="text-[#97192c] hover:text-[#fc920d] underline decoration-[#97192c]/30 underline-offset-2 hover:decoration-[#fc920d] transition-colors font-black"
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
      const isCountdown = language === "countdown";
      const isMemberCard = language === "member_card";
      const isProjectCard = language === "project_card";

      if (isChart) {
        try {
          const rawData = String(children).replace(/\n$/, "");
          const data = safeJsonParse<any[]>(rawData, "generic", []);
          if (Array.isArray(data) && data.length > 0) {
            return (
              <div className="my-4 h-52 w-full border-3 border-[#120f0a] bg-white p-3 shadow-[4px_4px_0px_0px_#120f0a] rounded-none text-[#120f0a]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} stroke="#120f0a" fontWeight="bold" />
                    <Tooltip
                      contentStyle={{
                        background: "white",
                        border: "2px solid #120f0a",
                        borderRadius: "0px",
                        boxShadow: "2px 2px 0px 0px #120f0a",
                        fontSize: "10px",
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        color: "#120f0a"
                      }}
                    />
                    <Bar dataKey="value" fill="#97192c" radius={[0, 0, 0, 0]} stroke="#120f0a" strokeWidth={2} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            );
          }
        } catch (e) {
          console.error("Failed to parse chart data", e);
        }
        return (
          <div className="my-2 p-2 rounded-none bg-red-100 border-2 border-red-600 text-red-800 text-xs font-bold font-mono">
            Error loading chart data.
          </div>
        );
      }

      if (isCountdown) {
        try {
          const rawData = String(children).replace(/\n$/, "");
          const payload = safeJsonParse<CountdownPayload | null>(rawData, "generic", null);
          if (payload) {
            return <CountdownCard payload={payload} />;
          }
        } catch (e) {
          console.error("Failed to parse countdown data", e);
        }
        return (
          <div className="my-2 p-2 rounded-none bg-red-100 border-2 border-red-600 text-red-800 text-xs font-bold font-mono">
            Error loading countdown.
          </div>
        );
      }

      if (isMemberCard) {
        try {
          const rawData = String(children).replace(/\n$/, "");
          const payload = safeJsonParse<MemberCardPayload | null>(rawData, "generic", null);
          if (payload) {
            return <TeamMemberCard payload={payload} />;
          }
        } catch (e) {
          console.error("Failed to parse member card data", e);
        }
        return (
          <div className="my-2 p-2 rounded-none bg-red-100 border-2 border-red-600 text-red-800 text-xs font-bold font-mono">
            Error loading team member details.
          </div>
        );
      }

      if (isProjectCard) {
        try {
          const rawData = String(children).replace(/\n$/, "");
          const ideas = safeJsonParse<ProjectIdea[]>(rawData, "generic", []);
          if (ideas.length > 0) {
            return <ProjectCards ideas={ideas.slice(0, 3)} />;
          }
        } catch (e) {
          console.error("Failed to parse project card data", e);
        }
        return (
          <div className="my-2 p-2 rounded-none bg-red-100 border-2 border-red-600 text-red-800 text-xs font-bold font-mono">
            Error visualizing project ideas.
          </div>
        );
      }

      const isInline = !match;
      return (
        <code
          className={`${
            isInline
              ? "bg-[#eae8e4] text-[#97192c] border border-[#120f0a]/20 px-1 py-0.5 text-[0.7rem] rounded-none font-mono font-bold"
              : "block rounded-none bg-[#120f0a] p-3 text-[0.75rem] overflow-x-auto border-3 border-[#120f0a] text-white mt-2 mb-2 font-mono shadow-[2px_2px_0px_0px_#120f0a]"
          } ${className || ""}`}
          {...props}
        >
          {children}
        </code>
      );
    }
  }), [loadedImages, setActiveLightboxImage, handleQuickPrompt]);

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
    if (
      typeof window !== "undefined" &&
      window.sessionStorage.getItem(shownKey)
    )
      return;

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
      if (
        target.closest("a[href], button, [role='button'], [data-tally-open]")
      ) {
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
    window.addEventListener("touchstart", interactionHandler, {
      passive: true,
    });
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

  return (
    <div className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-50">
      <div className="relative">
        {/* Proactive tooltip */}
        <AnimatePresence initial={false}>
          {showProactive && !isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="absolute bottom-full right-0 mb-4 w-[200px] border-3 border-[#120f0a] bg-white text-[#120f0a] px-3 py-2.5 shadow-[4px_4px_0px_0px_#120f0a] rounded-none"
          >
            <button
              onClick={() => setShowProactive(false)}
              className="absolute top-1.5 right-1.5 p-0.5 text-[#120f0a]/60 hover:text-[#120f0a] transition-colors"
            >
              <X className="h-2.5 w-2.5" />
            </button>
            <p className="text-[0.7rem] text-[#120f0a] font-semibold pr-3 leading-snug">
              {pathname === "/events"
                ? "Want help registering for an event? 🎟️"
                : pathname === "/join"
                  ? "I can help you join the club! 💡"
                  : pathname === "/contact"
                    ? "Need to reach someone specific? Ask me! 👋"
                    : "Hey! Want to know what we do? 🚀"}
            </p>
            <div className="absolute -bottom-[7px] right-4 h-2.5 w-2.5 rotate-45 border-b-3 border-r-3 border-[#120f0a] bg-white" />
          </motion.div>
          )}
        </AnimatePresence>

        {/* Floating AI button */}
        <button
          className={`floating-ai-button relative ml-auto flex h-12 w-12 items-center justify-center rounded-none border-3 border-[#120f0a] bg-[#fc920d] text-[#120f0a] shadow-[4px_4px_0px_0px_#120f0a] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#120f0a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer ${
            isChatOpen ? "rotate-90" : "rotate-0"
          }`}
          onClick={handleToggle}
          aria-label={
            isChatOpen
              ? "Close bits&bytes™ assistant"
              : "Open bits&bytes™ assistant"
          }
        >
          <div className="relative z-10 flex items-center justify-center">
            {isChatOpen ? (
              <X className="h-5 w-5 text-[#120f0a]" />
            ) : (
              <Bot className="h-5 w-5 text-[#120f0a]" />
            )}
          </div>
        </button>

        {/* Chat panel */}
        <AnimatePresence initial={false}>
          {isChatOpen && (
            <motion.div
              ref={chatRef}
              initial={{ opacity: 0, y: 18, scale: 0.975 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.985 }}
              transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
              className="fixed inset-4 bottom-[4.5rem] sm:absolute sm:inset-auto sm:bottom-16 sm:right-0 w-auto sm:w-[360px] origin-bottom-right flex flex-col justify-end"
            >
            <div className="relative flex w-full max-h-[80vh] sm:max-h-[500px] flex-col overflow-hidden rounded-none border-4 border-[#120f0a] bg-white shadow-[8px_8px_0px_0px_#120f0a]">
              {/* Header — single clean row */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b-4 border-[#120f0a] bg-[#fee9cf] text-[#120f0a]">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-tight font-sans">
                    bits&bytes™ Assistant
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {messages.length > 0 && (
                    <button
                      onClick={() => {
                        setMessages([]);
                        setCharCount(0);
                        setMessage("");
                        window.localStorage.removeItem(STORAGE_KEY);
                      }}
                      className="inline-flex h-6 w-6 items-center justify-center rounded-none border-2 border-[#120f0a] bg-white text-[#120f0a] shadow-[1px_1px_0px_0px_#120f0a] hover:bg-[#fc920d] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                      aria-label="Clear chat"
                      title="Clear chat"
                    >
                      <Trash className="h-3 w-3" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      streamControllerRef.current?.abort();
                      setIsChatOpen(false);
                    }}
                    className="inline-flex h-6 w-6 items-center justify-center rounded-none border-2 border-[#120f0a] bg-white text-[#120f0a] shadow-[1px_1px_0px_0px_#120f0a] hover:bg-[#fc920d] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                    aria-label="Close assistant"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex flex-col gap-2.5 overflow-y-auto px-3 py-3 text-sm text-[#120f0a] bg-white [scrollbar-width:thin] scrollbar-color-[#97192c]_[#eae8e4]">
                {messages.length === 0 && (
                  <div className="flex flex-col gap-2.5">
                    <p className="text-[0.7rem] font-mono font-bold uppercase tracking-wider text-[#716f6c] px-1">
                      Ask about our team, hackathons, or how to get involved.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => handleQuickPrompt(prompt)}
                          className="rounded-none border-2 border-[#120f0a] bg-white px-2.5 py-1 text-[0.65rem] text-[#120f0a] font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#120f0a] hover:bg-[#fee9cf] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#120f0a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-none px-3 py-2 text-[0.75rem] leading-relaxed sm:max-w-[80%] border-2 border-[#120f0a] shadow-[2px_2px_0px_0px_#120f0a] ${
                        m.role === "user"
                          ? "bg-[#97192c] text-white"
                          : "bg-[#eae8e4] text-[#120f0a] prose prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5 max-w-none font-semibold"
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
                          {m.content +
                            (isLoading &&
                            m.id === messages[messages.length - 1]?.id
                              ? " ▋"
                              : "") || "..."}
                        </ReactMarkdown>
                      )}
                    </div>

                    {/* ─── Feedback buttons (assistant only, with content) ─── */}
                    {m.role === "assistant" &&
                      m.content &&
                      m.content.length > 0 &&
                      !isLoading && (
                        <div className="flex items-center gap-1.5 mt-1.5 ml-1">
                          <button
                            onClick={() =>
                              handleFeedback(m.id, "up", m.content)
                            }
                            className={`group/fb inline-flex items-center justify-center h-6 w-6 rounded-none border border-[#120f0a] bg-white text-[#120f0a] shadow-[1px_1px_0px_0px_#120f0a] hover:bg-[#fee9cf] transition-all duration-150 ${
                              feedbackMap[m.id] === "up"
                                ? "bg-[#fee9cf] border-2 border-[#120f0a] font-bold"
                                : ""
                            }`}
                            aria-label="Good response"
                            title="Good response"
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() =>
                              handleFeedback(m.id, "down", m.content)
                            }
                            className={`group/fb inline-flex items-center justify-center h-6 w-6 rounded-none border border-[#120f0a] bg-white text-[#120f0a] shadow-[1px_1px_0px_0px_#120f0a] hover:bg-[#fee9cf] transition-all duration-150 ${
                              feedbackMap[m.id] === "down"
                                ? "bg-red-100 border-2 border-red-600 font-bold"
                                : ""
                            }`}
                            aria-label="Bad response"
                            title="Bad response"
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </button>
                          {feedbackMap[m.id] && (
                            <span className="text-[0.6rem] text-[#97192c] font-mono font-bold ml-1.5 animate-in fade-in">
                              {feedbackMap[m.id] === "up"
                                ? "Thanks!"
                                : "Noted, we'll improve"}
                            </span>
                          )}
                        </div>
                      )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-[#716f6c] font-mono font-bold">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600" />
                    Thinking...
                  </div>
                )}
                <AnimatePresence initial={false}>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                      transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                      className="text-xs text-red-600 font-mono font-bold"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Input */}
              <div className="p-3.5 w-full bg-[#eae8e4] border-t-4 border-[#120f0a] shrink-0 relative z-20">
                <PromptBox
                  ref={promptBoxRef}
                  value={message}
                  onChange={handleInputChange}
                  onSubmitMessage={(msg: string) => void handleSend(msg)}
                  className="bg-white border-2 border-[#120f0a] focus-within:ring-0"
                />
              </div>
            </div>
            </motion.div>
          )}
        </AnimatePresence>
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
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl max-h-[90vh] overflow-hidden border-4 border-[#120f0a] bg-white p-2 shadow-[8px_8px_0px_0px_#120f0a]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeLightboxImage}
                alt="Enlarged visualization"
                className="max-w-full max-h-[80vh] object-contain block"
              />
              <button
                onClick={() => setActiveLightboxImage(null)}
                className="absolute top-4 right-4 bg-[#fc920d] border-2 border-[#120f0a] h-10 w-10 flex items-center justify-center font-bold text-[#120f0a] shadow-[2px_2px_0px_0px_#120f0a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#120f0a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { FloatingAiAssistant };
