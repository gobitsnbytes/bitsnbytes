"use client";

import { useEffect, useState, type ComponentProps, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { Components } from "react-markdown";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

import { safeJsonParse } from "@/lib/safe-json";
import {
  BookingHostGrid,
  SlotPicker,
  BookingConfirmCard,
  MeetingList,
  dispatchPrompt,
  type BookingHost,
  type BookingSlotBlock,
  type BookingConfirmBlock,
  type MeetingItem,
} from "@/components/ui/booking-blocks";
import { cn } from "@/lib/utils";

/*
 * Shared pieces of the two assistant consoles (the floating [C] console + /qna): session storage, the SSE
 * reader, the image action, the markdown block renderers and the stripe.dev-style console chrome.
 * The consoles render inside a `tone-ink` scope, so everything here uses the tone tokens
 * (fg / line / signal / surface-2) instead of fixed colours.
 */

export interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
}

export type AssistantAction = {
  type: string;
  path?: string;
  textSnippet?: string;
  prompt?: string;
  modelChoice?: string;
  aspectRatio?: string;
  formData?: unknown;
};

type StreamPayload =
  | { type: "meta"; model: string }
  | { type: "token"; content: string }
  | { type: "done"; action?: AssistantAction | null }
  | { type: "error"; message?: string };

/** Transcript and draft only. Open/closed is never stored (an old isChatOpen key is simply ignored). */
type StoredChat = { messages?: ChatMessage[]; draft?: string };

/** One key for both consoles (they are never mounted together: /qna drops the floating one). */
export const STORAGE_KEY = "bb-floating-assistant-state-v1";
export const MAX_CHARS = 2000;
const LOADER = "%%GENERATE_LOADER%%";

/** Restores the saved session. Throws on malformed storage (callers log and carry on). */
export function loadChat(maxHistory: number) {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  const parsed: StoredChat = stored ? JSON.parse(stored) : {};
  const sanitized = (Array.isArray(parsed.messages) ? parsed.messages : [])
    .filter(
      (m): m is ChatMessage =>
        m != null && (m.role === "user" || m.role === "assistant") && typeof m.content === "string",
    )
    .map((m, index) => ({ ...m, id: typeof m.id === "number" ? m.id : index + 1 }));
  return {
    messages: sanitized.slice(-maxHistory),
    nextId: sanitized.reduce((max, m) => Math.max(max, m.id), 0) + 1,
    draft: typeof parsed.draft === "string" ? parsed.draft : null,
  };
}

/** Persists the session. stripImages swaps base64 images for a placeholder so localStorage stays small. */
export function saveChat(state: StoredChat, stripImages = false) {
  const messages = stripImages
    ? state.messages?.map((m) => ({
        ...m,
        content: m.content.replace(
          /data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g,
          "https://placehold.co/600x400/27272a/e45a92?text=Image+Removed+For+Storage",
        ),
      }))
    : state.messages;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, messages }));
  } catch (err) {
    console.error("Failed to persist assistant history:", err);
  }
}

/** POSTs to /api/assistant and feeds the server-sent events to the handlers. Throws on HTTP failure. */
export async function streamAssistant(
  body: unknown,
  signal: AbortSignal,
  on: {
    model: (name: string) => void;
    token: (chunk: string) => void;
    error: (message: string) => void;
    done: (action: AssistantAction | null | undefined) => void;
  },
) {
  const res = await fetch("/api/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
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

      if (payload.type === "meta" && "model" in payload) on.model(payload.model);
      else if (payload.type === "token" && "content" in payload) on.token(payload.content);
      else if (payload.type === "error") on.error(payload.message ?? "Assistant stream error.");
      else if (payload.type === "done") on.done(payload.action);
    }
  }
}

/** generate_image action: shows the loader block, then swaps in the image (or the failure note). */
export function generateImage(action: AssistantAction, update: (updater: (prev: string) => string) => void) {
  const { prompt, modelChoice, aspectRatio } = action;
  const swap = (text: string) => update((prev) => prev.replace(LOADER, text));
  update((prev) => `${prev}\n\n${LOADER}\n\n`);
  fetch("/api/assistant/image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, modelChoice, aspectRatio }),
  })
    .then((r) => r.json())
    .then((data) =>
      swap(data.base64 ? `![Generated Image](${data.base64})` : `*Failed to generate image: ${data.error || "Unknown error"}*`),
    )
    .catch(() => swap("*Image generation failed.*"));
}

/* ─── Rich blocks ─────────────────────────────────────────────────────────── */

const LABEL = "font-mono text-[10px] font-bold uppercase tracking-[0.16em]";
const CARD =
  "my-3 whitespace-normal border-2 border-line bg-surface-2 p-4 font-sans text-fg shadow-[3px_3px_0_0_var(--shadow-color)]";
const SMALL_BTN =
  "border-2 border-line px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition-colors hover:bg-orange hover:text-ink";

function ErrorBlock({ children }: { children: ReactNode }) {
  return (
    <div className="my-2 whitespace-normal border-2 border-warm bg-warm/15 p-3 font-mono text-xs font-bold text-fg">
      {children}
    </div>
  );
}

type CountdownPayload = { event: string; date: string };

type MemberCardPayload = {
  name: string;
  role: string;
  photo?: string;
  socials?: { github?: string; linkedin?: string };
};

type ProjectIdea = {
  title: string;
  description: string;
  tech_stack?: string[];
  difficulty?: "beginner" | "intermediate" | "advanced";
  why_it_fits_theme?: string;
};

const pad2 = (n: number) => String(n).padStart(2, "0");

function CountdownCard({ payload }: { payload: CountdownPayload }) {
  const [now, setNow] = useState(() => Date.now());
  const target = new Date(payload.date).getTime();

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (!Number.isFinite(target)) return <ErrorBlock>Invalid countdown date format.</ErrorBlock>;

  const done = target - now <= 0;
  const total = Math.max(0, Math.floor((target - now) / 1000));
  const cells = [
    { label: "DD", value: pad2(Math.floor(total / 86400)) },
    { label: "HH", value: pad2(Math.floor((total % 86400) / 3600)) },
    { label: "MM", value: pad2(Math.floor((total % 3600) / 60)) },
    { label: "SS", value: pad2(total % 60) },
  ];

  return (
    <div className={CARD}>
      <p className={cn(LABEL, "text-signal")}>Event Countdown</p>
      <p className="mt-1 text-sm font-black uppercase tracking-[0.02em]">{payload.event}</p>
      {done ? (
        <p className="mt-2 text-xs font-bold text-slime">This event has started.</p>
      ) : (
        <div className="mt-3 grid grid-cols-4 gap-2 text-center">
          {cells.map((cell) => (
            <div key={cell.label} className="border-2 border-line px-2 py-2">
              <div className="font-display text-2xl leading-none">{cell.value}</div>
              <div className={cn(LABEL, "mt-1 opacity-75")}>{cell.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TeamMemberCard({ payload }: { payload: MemberCardPayload }) {
  return (
    <div className={CARD}>
      <div className="flex items-center gap-3">
        {payload.photo ? (
          <img src={payload.photo} alt={payload.name} className="size-12 border-2 border-line object-cover grayscale" />
        ) : (
          <div aria-hidden className="halftone size-12 border-2 border-line" />
        )}
        <div className="min-w-0">
          <p className="text-sm font-black uppercase tracking-[0.02em]">{payload.name}</p>
          <span className={cn(LABEL, "mt-1.5 inline-flex border-2 border-line px-2 py-0.5 text-signal")}>
            {payload.role}
          </span>
        </div>
      </div>
      {(payload.socials?.github || payload.socials?.linkedin) && (
        <div className="mt-4 flex items-center gap-2">
          {payload.socials.github && (
            <a href={payload.socials.github} target="_blank" rel="noreferrer" className={SMALL_BTN}>
              GitHub
            </a>
          )}
          {payload.socials.linkedin && (
            <a href={payload.socials.linkedin} target="_blank" rel="noreferrer" className={SMALL_BTN}>
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
    <div className="my-4 space-y-3 whitespace-normal">
      {ideas.map((idea, idx) => (
        <div key={`${idea.title}-${idx}`} className={cn(CARD, "my-0")}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-black uppercase tracking-[0.02em]">{idea.title}</p>
            {idea.difficulty && (
              <span className={cn(LABEL, "border-2 border-line px-2 py-0.5")}>{idea.difficulty}</span>
            )}
          </div>
          <p className="mt-2 font-serif text-sm leading-relaxed opacity-90">{idea.description}</p>
          {Array.isArray(idea.tech_stack) && idea.tech_stack.length > 0 && (
            <p className={cn(LABEL, "mt-3 text-signal")}>Stack: {idea.tech_stack.join(" • ")}</p>
          )}
          {idea.why_it_fits_theme && (
            <p className={cn(LABEL, "mt-2 inline-block border-2 border-slime px-2.5 py-1 text-slime")}>
              Theme fit: {idea.why_it_fits_theme}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function ChartBlock({ data }: { data: unknown[] }) {
  return (
    <div className="my-4 h-56 w-full whitespace-normal border-2 border-line bg-surface-2 p-3 text-fg">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} stroke="currentColor" />
          <Tooltip
            cursor={{ fill: "currentColor", opacity: 0.1 }}
            contentStyle={{
              background: "#120f0a",
              border: "2px solid #fee9cf",
              borderRadius: 0,
              color: "#faf8f5",
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              fontWeight: 700,
            }}
            itemStyle={{ color: "#fc920d" }}
          />
          <Bar dataKey="value" fill="#fc920d" stroke="currentColor" strokeWidth={1.5} maxBarSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function PixelLoader({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div aria-hidden className="flex gap-1.5">
        {["bg-burgundy", "bg-orange", "bg-cream"].map((tone, i) => (
          <span
            key={tone}
            className={cn("size-2.5 animate-riot-pulse motion-reduce:animate-none motion-off:animate-none", tone)}
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </div>
      <span className={LABEL}>{label}</span>
    </div>
  );
}

/**
 * Esc / backdrop / ✕ close; focus stays on ✕ (the only control). Portalled to <body> so a
 * transformed console can't trap the fixed overlay. Esc is stopped here so the floating console
 * (a React ancestor through the portal) doesn't close as well.
 */
function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return createPortal(
    <div
      data-chat-overlay=""
      role="dialog"
      aria-modal="true"
      aria-label="Enlarged view"
      onClick={onClose}
      onKeyDown={(event) => {
        if (event.key === "Tab") event.preventDefault();
        if (event.key !== "Escape") return;
        event.stopPropagation();
        onClose();
      }}
      className="fixed inset-0 z-[80] flex cursor-zoom-out items-center justify-center bg-ink/90 p-4 duration-200 animate-in fade-in motion-reduce:animate-none motion-off:animate-none"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative max-h-[90vh] max-w-5xl border-3 border-cream bg-ink p-2 shadow-[10px_10px_0_0_var(--orange)]"
      >
        <img src={src} alt="Enlarged view" className="block max-h-[80vh] max-w-full object-contain" />
        <button
          type="button"
          autoFocus
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid size-10 cursor-pointer place-items-center border-2 border-ink bg-orange font-mono font-bold text-ink [--focus-ring:var(--marker)]"
        >
          ✕
        </button>
      </div>
    </div>,
    document.body,
  );
}

function ImageBlock({ src, alt }: { src: string; alt?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Enlarge ${alt || "Generated visual"}`}
        className="relative my-3 block aspect-video w-full cursor-zoom-in overflow-hidden border-2 border-line bg-surface-2 shadow-[3px_3px_0_0_var(--shadow-color)] transition-transform duration-150 ease-riot hover:-translate-x-0.5 hover:-translate-y-0.5 motion-reduce:transition-none"
      >
        {!loaded && (
          <span className="absolute inset-0 z-10 grid place-items-center bg-surface-2">
            <PixelLoader label="Decoding Image..." />
          </span>
        )}
        <img
          src={src}
          alt={alt || "Generated visual"}
          onLoad={() => setLoaded(true)}
          className={cn("size-full object-cover transition-opacity duration-300", loaded ? "opacity-100" : "opacity-0")}
        />
      </button>
      {open && <Lightbox src={src} onClose={() => setOpen(false)} />}
    </>
  );
}

function DiscordWidget({ serverId }: { serverId: string }) {
  return (
    <div className="my-4 whitespace-normal border-2 border-line bg-surface-2">
      <div className={cn(LABEL, "flex items-center gap-2 border-b-2 border-line px-3 py-2")}>
        <span aria-hidden className="size-2 bg-cobalt" />
        India Innovates · Discord
      </div>
      <iframe
        title="India Innovates · Discord"
        src={`https://discord.com/widget?id=${serverId}&theme=dark`}
        width="100%"
        height="400"
        loading="lazy"
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        className="block border-0"
      />
    </div>
  );
}

/* ─── Markdown ────────────────────────────────────────────────────────────── */

const textOf = (children: ReactNode) => (Array.isArray(children) ? children.join("") : String(children));
const strip = (children: ReactNode) => String(children).replace(/\n$/, "");

const LINK = "font-bold text-signal underline decoration-2 underline-offset-2 hover:decoration-4";
const CTA =
  "my-2 inline-flex w-full items-center justify-center border-2 border-line bg-orange px-4 py-2.5 text-center font-mono text-xs font-bold uppercase tracking-[0.12em] text-ink no-underline shadow-[3px_3px_0_0_var(--shadow-color)] transition-[transform,box-shadow] duration-100 ease-riot hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--shadow-color)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none motion-reduce:transition-none sm:w-auto";

function renderCode(language: string | undefined, children: ReactNode, className?: string) {
  const raw = strip(children);
  switch (language) {
    case "discord-widget":
      return <DiscordWidget serverId={String(children).trim()} />;
    case "chart": {
      const data = safeJsonParse<unknown[]>(raw, "generic", []);
      if (Array.isArray(data) && data.length > 0) return <ChartBlock data={data} />;
      break;
    }
    case "countdown": {
      const payload = safeJsonParse<CountdownPayload | null>(raw, "countdown", null);
      if (payload?.event && payload?.date) return <CountdownCard payload={payload} />;
      return <ErrorBlock>Error visualizing countdown data</ErrorBlock>;
    }
    case "member_card": {
      const payload = safeJsonParse<MemberCardPayload | null>(raw, "member_card", null);
      if (payload?.name && payload?.role) return <TeamMemberCard payload={payload} />;
      return <ErrorBlock>Error visualizing member card data</ErrorBlock>;
    }
    case "project_card": {
      const payload = safeJsonParse<ProjectIdea[] | { ideas?: ProjectIdea[] } | null>(raw, "project_card", null);
      const ideas = Array.isArray(payload) ? payload : Array.isArray(payload?.ideas) ? payload.ideas : [];
      if (ideas.length > 0) return <ProjectCards ideas={ideas.slice(0, 3)} />;
      return <ErrorBlock>Error visualizing project card data</ErrorBlock>;
    }
    case "booking_host_grid": {
      const hosts = safeJsonParse<BookingHost[]>(raw, "booking_host_grid", []);
      if (Array.isArray(hosts)) return <BookingHostGrid hosts={hosts} />;
      return <ErrorBlock>Error rendering host grid</ErrorBlock>;
    }
    case "booking_slots": {
      const data = safeJsonParse<BookingSlotBlock | null>(raw, "booking_slots", null);
      if (data) return <SlotPicker data={data} />;
      return <ErrorBlock>Error rendering slot picker</ErrorBlock>;
    }
    case "booking_confirm": {
      const data = safeJsonParse<BookingConfirmBlock | null>(raw, "booking_confirm", null);
      if (data) return <BookingConfirmCard data={data} />;
      return <ErrorBlock>Error rendering booking confirm</ErrorBlock>;
    }
    case "meeting_list": {
      const meetings = safeJsonParse<MeetingItem[]>(raw, "meeting_list", []);
      if (Array.isArray(meetings)) return <MeetingList meetings={meetings} />;
      return <ErrorBlock>Error rendering meeting list</ErrorBlock>;
    }
  }

  const block = language !== undefined;
  return (
    <code
      className={cn(
        block
          ? "block overflow-x-auto whitespace-pre border-2 border-line bg-surface-2 p-3 text-[0.9em]"
          : "border border-line/40 bg-surface-2 px-1 py-0.5 text-[0.92em] text-signal",
        className,
      )}
    >
      {children}
    </code>
  );
}

function buildMarkdown(ctaNewTab: boolean): Components {
  return {
    p: ({ children }) =>
      textOf(children).includes(LOADER) ? (
        <div className="my-2 flex aspect-video w-full items-center justify-center border-2 border-line bg-surface-2 p-4">
          <PixelLoader label="Synthesizing Pixels" />
        </div>
      ) : (
        <p className="my-2 first:mt-0 last:mb-0">{children}</p>
      ),
    // Headings from the model never become page headings (one h1 per page).
    h1: ({ children }) => <p className="mb-1 mt-3 font-bold uppercase tracking-[0.08em] text-signal">{children}</p>,
    h2: ({ children }) => <p className="mb-1 mt-3 font-bold uppercase tracking-[0.08em] text-signal">{children}</p>,
    h3: ({ children }) => <p className="mb-1 mt-2 font-bold uppercase tracking-[0.06em]">{children}</p>,
    ul: ({ children }) => <ul className="my-2 list-[square] space-y-1 pl-5 marker:text-signal">{children}</ul>,
    ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5 marker:text-signal">{children}</ol>,
    li: ({ children }) => <li className="pl-1">{children}</li>,
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    blockquote: ({ children }) => <blockquote className="my-2 border-l-3 border-signal pl-3">{children}</blockquote>,
    hr: () => <hr className="my-3 border-t border-dashed border-line/40" />,
    table: ({ children }) => (
      <div className="my-3 overflow-x-auto whitespace-normal">
        <table className="w-full border-collapse text-left text-xs">{children}</table>
      </div>
    ),
    th: ({ children }) => <th className="border-b-2 border-line px-2 py-1 font-bold uppercase">{children}</th>,
    td: ({ children }) => <td className="border-b border-line/30 px-2 py-1 align-top">{children}</td>,
    pre: ({ children }) => <div className="my-3 whitespace-pre-wrap">{children}</div>,
    img: ({ src, alt }) => (typeof src === "string" && src ? <ImageBlock src={src} alt={alt} /> : null),
    a: ({ href, title, children }) => {
      if (title === "button" || title === "cta") {
        if (!ctaNewTab && href?.startsWith("/")) {
          return (
            <Link href={href} className={CTA}>
              {children}
            </Link>
          );
        }
        return (
          <a href={href} className={CTA} {...(ctaNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {children}
          </a>
        );
      }
      if (title === "follow-up") {
        return (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              dispatchPrompt(textOf(children));
            }}
            className="mt-2 block w-full cursor-pointer border-2 border-line/50 px-3 py-2 text-left font-mono text-xs font-bold uppercase tracking-[0.06em] transition-colors hover:border-line hover:bg-orange hover:text-ink"
          >
            ↳ {children}
          </button>
        );
      }
      if (href?.startsWith("#")) {
        return (
          <a href={href} className={LINK}>
            {children}
          </a>
        );
      }
      if (href?.includes("google.com/maps") || href?.includes("maps.app.goo.gl")) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open venue on Google Maps"
            className="mb-2 mt-4 flex items-center gap-3 whitespace-normal border-2 border-line bg-surface-2 p-3 no-underline transition-colors hover:bg-orange hover:text-ink"
          >
            <span aria-hidden className="grid size-9 shrink-0 place-items-center border-2 border-current font-mono text-sm">
              ⌖
            </span>
            <span>
              <span className="block font-sans text-sm font-black uppercase">View Venue on Map</span>
              <span className={cn(LABEL, "mt-0.5 block")}>Opens in Google Maps</span>
            </span>
          </a>
        );
      }
      return (
        <a href={href} className={LINK} target="_blank" rel="noreferrer">
          {children}
        </a>
      );
    },
    code: ({ className, children }) =>
      renderCode(/language-([\w-]+)/.exec(className || "")?.[1], children, className),
  };
}

const MARKDOWN = { sameTab: buildMarkdown(false), newTab: buildMarkdown(true) };

/** Stable react-markdown component map (stable identity keeps image state across streamed tokens). */
export function consoleMarkdown(ctaNewTab: boolean): Components {
  return ctaNewTab ? MARKDOWN.newTab : MARKDOWN.sameTab;
}

/** react-markdown pass-through so data: image URIs survive (the assistant returns base64 images). */
export const keepUrl = (value: string) => value;

/* ─── Console chrome ──────────────────────────────────────────────────────── */

/** Window title bar: three square lights, mono title, square controls on the right. */
export function ConsoleBar({
  title,
  titleId,
  children,
}: {
  title: ReactNode;
  titleId?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2 border-b-3 border-line bg-orange px-2.5 py-2 text-ink [--focus-ring:var(--ink)]">
      <span aria-hidden className="size-3 shrink-0 border-2 border-ink bg-burgundy" />
      <span aria-hidden className="size-3 shrink-0 border-2 border-ink bg-marker" />
      <span aria-hidden className="size-3 shrink-0 border-2 border-ink bg-slime" />
      <p
        id={titleId}
        className="ml-1.5 min-w-0 flex-1 truncate font-mono text-[11px] font-bold uppercase tracking-[0.12em]"
      >
        {title}
      </p>
      <div className="flex shrink-0 items-center gap-1.5">{children}</div>
    </div>
  );
}

/** Square mono control for the title bar ([CLEAR], [✕]). */
export function ConsoleButton({ className, ...props }: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-7 min-w-7 cursor-pointer items-center justify-center gap-1.5 border-2 border-ink bg-paper px-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-ink transition-colors hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}

/** One log row: numbered mono gutter (YOU / AI), body, optional footer (feedback). */
export function LogEntry({
  role,
  index,
  children,
  footer,
}: {
  role: ChatMessage["role"];
  index: number;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const user = role === "user";
  return (
    <li className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-3 border-b border-dashed border-line/25 py-3.5 duration-200 animate-in fade-in slide-in-from-bottom-1 last:border-b-0 motion-reduce:animate-none motion-off:animate-none">
      <span className={cn(LABEL, "pt-0.5 leading-snug", user ? "text-signal" : "opacity-75")}>
        {pad2(index + 1)}
        <br />
        {user ? "YOU" : "AI"}
      </span>
      <div className={cn("min-w-0 break-words", user && "whitespace-pre-wrap font-bold")}>
        {children}
        {footer}
      </div>
    </li>
  );
}

/** Blinking block caret for the streaming reply. */
export function Caret() {
  return (
    <span
      aria-hidden
      className="ml-1 inline-block h-3.5 w-2 translate-y-0.5 animate-riot-pulse bg-signal motion-reduce:animate-none motion-off:animate-none"
    />
  );
}

export function StatusLine({ children }: { children: ReactNode }) {
  return (
    <p className={cn(LABEL, "flex items-center gap-2 py-2 opacity-80")}>
      <span aria-hidden className="size-2 animate-riot-pulse bg-slime motion-reduce:animate-none motion-off:animate-none" />
      {children}
    </p>
  );
}

export function ErrorLine({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="my-2 border-2 border-warm bg-warm/15 px-3 py-2 font-mono text-xs font-bold">
      {children}
    </p>
  );
}

/** stripe.dev table-list of starter prompts: "/ 01  prompt  ↵", full-row fill on hover/focus. */
export function PromptList({ prompts, onPick }: { prompts: string[]; onPick: (prompt: string) => void }) {
  return (
    <ul className="border-t border-line/30">
      {prompts.map((prompt, index) => (
        <li key={prompt} className="border-b border-line/30">
          <button
            type="button"
            onClick={() => onPick(prompt)}
            className="group flex w-full cursor-pointer items-baseline gap-3 px-1 py-2.5 text-left font-mono text-[11px] font-bold uppercase tracking-[0.04em] transition-colors hover:bg-orange hover:text-ink focus-visible:bg-orange focus-visible:text-ink"
          >
            <span aria-hidden className="shrink-0 text-signal group-hover:text-ink group-focus-visible:text-ink">
              / {pad2(index + 1)}
            </span>
            <span className="min-w-0 flex-1">{prompt}</span>
            <span aria-hidden className="shrink-0 opacity-60">
              ↵
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
