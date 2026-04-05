# Bits&Bytes — Official Site

Production website for [gobitsnbytes.org](https://gobitsnbytes.org), India's teen-led code club. Built with Next.js 16 App Router, React 19, Tailwind CSS v4, and Supabase. Ships an AI chat assistant backed by the Hack Club AI Proxy (Gemini), RAG over a Supabase pgvector store, image generation via the NVIDIA API, and voice transcription via Whisper. Deployed on Vercel; uses pnpm exclusively.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Directory Structure](#2-directory-structure)
3. [Setup & Installation](#3-setup--installation)
4. [Core Modules & Components](#4-core-modules--components)
5. [Data Flow](#5-data-flow)
6. [API Reference](#6-api-reference)
7. [Config Options](#7-config-options)
8. [Supabase Schema](#8-supabase-schema)
9. [Known Edge Cases & Gotchas](#9-known-edge-cases--gotchas)
10. [Changelog](#10-changelog)

---

## 1. Project Overview

| Property | Value |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, Radix UI, shadcn/ui, Framer Motion, GSAP |
| AI | Hack Club AI Proxy → Gemini 3 Flash (primary) / Gemini 2.5 Flash (fallback) |
| Vector DB | Supabase pgvector (`site_embeddings` table, `text-embedding-3-small`, 1536-dim) |
| Database | Supabase (PostgreSQL) |
| Deploy | Vercel (auto-deploy on `main`) |
| Package manager | pnpm (required) |
| Language | TypeScript (strict mode, `ignoreBuildErrors: true`) |

The site serves as both a public-facing club portal and an operational backend: membership forms, contact submissions, an AI assistant with tool-calling, semantic search over site content, and event discovery all run through this single Next.js application.

---

## 2. Directory Structure

```
bitsnbytes/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout: fonts, metadata, JSON-LD, ThemeProvider, Analytics
│   ├── page.tsx                # Homepage (hero, stats, features, testimonials, partners)
│   ├── template.tsx            # Shared route template (page transitions)
│   ├── loading.tsx             # Global Suspense loading UI
│   ├── manifest.ts             # PWA web manifest
│   ├── robots.ts               # robots.txt generation (Next.js Metadata API)
│   ├── opengraph-image.tsx     # Dynamic OG image generation
│   ├── globals.css             # Global styles, CSS variables, Tailwind base
│   ├── about/                  # /about — org story, team case study, values
│   ├── coc/                    # /coc — Code of Conduct
│   ├── contact/                # /contact — contact form (hCaptcha + Supabase)
│   ├── events/                 # /events — event listings with gallery & update banner
│   ├── faq/                    # /faq — accordion FAQ
│   ├── impact/                 # /impact — stats visualization, globe
│   ├── join/                   # /join — membership form (Tally embed + custom form)
│   ├── projects/               # /projects — shipped projects showcase
│   ├── qna/                    # /qna — standalone QnA chat page (full-viewport)
│   └── api/
│       ├── assistant/
│       │   ├── route.ts        # POST /api/assistant — main AI chat (SSE streaming)
│       │   ├── image/route.ts  # POST /api/assistant/image — AI image generation
│       │   ├── voice/route.ts  # POST /api/assistant/voice — Whisper transcription
│       │   └── feedback/route.ts # POST /api/assistant/feedback — thumbs up/down
│       └── join/route.ts       # POST /api/join — membership form submission
│
├── components/
│   ├── navigation.tsx          # Re-exports MiniNavbar
│   ├── footer.tsx              # Re-exports FlickeringFooter
│   ├── hero.tsx                # Legacy hero (superseded by hero-futuristic)
│   ├── page-background.tsx     # Full-page background layer
│   ├── page-section.tsx        # Reusable section wrapper (eyebrow + title + desc)
│   ├── qna-chat-interface.tsx  # Full chat UI: SSE consumer, markdown renderer, special cards
│   ├── team-card.tsx           # Individual team member card
│   ├── team-case-study.tsx     # About page team section
│   ├── team-globe.tsx          # Three.js globe (impact page)
│   ├── impact-visualization.tsx # Charts and impact stats
│   ├── partners.tsx            # Partner logo carousel
│   ├── client-only-components.tsx # Lazy exports for FloatingAiAssistant
│   ├── loading-wrapper.tsx     # LoadingInline / LoadingFull helpers
│   ├── theme-provider.tsx      # next-themes wrapper
│   ├── GlassIcons.tsx          # Icon grid with glass morphism
│   ├── GlassSurface.tsx        # Reusable glass-morphism surface
│   ├── infinite-moving-cards-demo.tsx
│   └── ui/                     # shadcn/ui components + custom UI primitives
│       ├── button.tsx, input.tsx, label.tsx, textarea.tsx, card.tsx
│       ├── hero-futuristic.tsx # Homepage hero with animated text
│       ├── web-gl-shader.tsx   # Full-screen WebGL background shader
│       ├── features-8.tsx      # Bento-grid feature cards
│       ├── glass-container.tsx # Glass morphism container
│       ├── glowing-card.tsx    # Card with animated glow border
│       ├── mini-navbar.tsx     # Top navigation bar
│       ├── flickering-footer.tsx # Animated footer
│       ├── gallery4.tsx        # Masonry/grid image gallery
│       ├── globe.tsx           # Three.js globe wrapper
│       ├── cpu-architecture.tsx # Animated CPU diagram (demo)
│       ├── entropy-demo.tsx    # Entropy visualization
│       ├── neon-raymarcher.tsx # WebGL raymarching effect
│       ├── infinite-moving-cards.tsx
│       ├── design-testimonial.tsx
│       └── … (40+ additional UI components)
│
├── lib/
│   ├── rag.ts                  # Embedding generation + pgvector semantic search
│   ├── rate-limit.ts           # In-memory token-bucket rate limiter
│   ├── sentiment.ts            # Keyword-based frustration detection
│   ├── supabase.ts             # Supabase client singleton
│   ├── team-data.ts            # Team member records + findExperts / recommendRoles
│   ├── theme.ts                # Theme utilities
│   └── utils.ts                # cn() (clsx + tailwind-merge)
│
├── scripts/
│   └── embed-site.ts           # One-shot ingestion: markdown → embeddings → Supabase
│
├── types/
│   └── svg.d.ts                # SVG module type declaration
│
├── public/
│   ├── logo.svg
│   ├── og-image.png
│   ├── llms.txt                # LLM-readable site summary (for AI crawlers)
│   ├── sitemap.xml
│   ├── robots.txt
│   ├── globe.json              # GeoJSON data for Three.js globe
│   ├── images/
│   ├── team/                   # Team member photos
│   ├── partners/               # Partner logos
│   └── event_pictures/
│
├── next.config.mjs             # Next.js config (git info injection, CSP, image domains)
├── vercel.json                 # Vercel deploy config (pnpm, security headers)
├── tsconfig.json               # TypeScript config (strict, path aliases @/* and @public/*)
├── postcss.config.mjs          # PostCSS for Tailwind v4
└── .env.example                # Environment variable template
```

---

## 3. Setup & Installation

### Prerequisites

- Node.js ≥ 18
- pnpm ≥ 8 (`npm i -g pnpm`)
- Supabase project with pgvector enabled
- Hack Club AI Proxy API key

### Install & Run

```bash
# Clone and install
git clone https://github.com/gobitsnbytes/bitsnbytes
cd bitsnbytes
pnpm install

# Configure environment
cp .env.example .env
# Fill in values — see Config Options section

# Development server
pnpm dev

# Production build
pnpm build
pnpm start

# Lint
pnpm lint
```

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon/public key |
| `HACKCLUB_PROXY_API_KEY` | ✅ | Hack Club AI Proxy key (LLM + embeddings + Whisper) |
| `GOOGLE_SITE_VERIFICATION` | ⚠️ | Google Search Console verification token |
| `OSM_API_KEY` | ⚠️ | Required to enable voice transcription endpoint |
| `NVIDIA_KEY` | ⚠️ | NVIDIA API key for Stable Diffusion 3 image generation |

> `NEXT_PUBLIC_*` variables are bundled into the client at build time. Never store secrets in `NEXT_PUBLIC_*` variables.

### Ingest Site Content for RAG

After populating `.env`, run the embedding ingestion script once (or whenever site content changes significantly):

```bash
# Requires ts-node or tsx
npx tsx scripts/embed-site.ts
```

This reads markdown files from `public/llms.txt` and similar sources, chunks them by `##` headings, calls the Hack Club embedding API, and upserts into the `site_embeddings` Supabase table.

---

## 4. Core Modules & Components

### `lib/rag.ts`

| Function | Signature | Description |
|---|---|---|
| `generateEmbedding` | `(text: string) → Promise<number[]>` | Calls Hack Club proxy `/embeddings` with `text-embedding-3-small` (1536 dims). Throws on empty input or API error. |
| `searchSiteContent` | `(query: string, matchCount?: number) → Promise<string[]>` | Generates query embedding, calls Supabase `match_site_sections` RPC (threshold 0.5), returns array of matching content strings. Returns `[]` on error. |

**Dependencies:** `lib/supabase.ts`, `HACKCLUB_PROXY_API_KEY`

---

### `lib/rate-limit.ts`

In-memory token-bucket rate limiter. **Per-instance only** — not shared across Vercel serverless invocations.

| Function | Signature | Description |
|---|---|---|
| `rateLimit` | `(key: string, config: RateLimitConfig) → RateLimitResult` | Consumes one token for `key`. Refills the bucket after `windowMs`. Runs cleanup every 5 minutes to evict stale entries. |

```ts
type RateLimitConfig  = { maxRequests: number; windowMs?: number }  // windowMs default: 60_000
type RateLimitResult  = { allowed: boolean; remaining: number; retryAfterMs: number }
```

---

### `lib/sentiment.ts`

| Function | Signature | Description |
|---|---|---|
| `detectFrustration` | `(message: string) → boolean` | Matches against 14 regex patterns for frustration, confusion, anger, and repeated-attempt signals. Returns `false` for messages shorter than 5 characters. |

---

### `lib/team-data.ts`

Exports `TEAM_MEMBERS: TeamMember[]` (6 members) and two search functions used by the AI assistant:

| Function | Signature | Description |
|---|---|---|
| `findExperts` | `(query: string) → TeamMember[]` | Returns members whose `superpowers` or `talkToMeWhen` entries contain words from the query (case-insensitive). |
| `recommendRoles` | `(skills: string[], interests: string[]) → TeamMember[]` | Scores members by overlap between input skills/interests and member superpowers; returns top matches. |

---

### `lib/supabase.ts`

Singleton Supabase client created with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Imported by API routes and `lib/rag.ts`.

---

### `lib/utils.ts`

```ts
cn(...inputs: ClassValue[]): string
// Merges Tailwind classes via clsx + tailwind-merge
```

---

### `components/qna-chat-interface.tsx`

Full-featured chat UI. Consumes the `/api/assistant` SSE stream. Renders standard Markdown via `react-markdown` + `remark-gfm`, plus five custom fenced-code-block renderers:

| Language tag | Rendered as |
|---|---|
| `chart` | Recharts `BarChart` from JSON payload |
| `countdown` | Live countdown card (`{ event, date }`) |
| `member_card` | Team member card with photo + social links |
| `project_card` | Array of project idea cards |
| `(none / text)` | Standard code block |

Supports voice input (records audio → `POST /api/assistant/voice` → prefills text input), thumbs-up/down feedback, conversation reset, and assistant-initiated navigation via `action: { type: "navigate", path }` events.

---

### `scripts/embed-site.ts`

Standalone Node.js ingestion script (run with `tsx`). Reads markdown, parses it into chunks split on `##` headings, generates embeddings via Hack Club proxy, and upserts to `site_embeddings` using `(page, section)` as the upsert key. Normalizes section keys to `[a-zA-Z0-9_-]` (max 50 chars).

---

## 5. Data Flow

### AI Chat (Happy Path)

```
Browser                     /api/assistant                  External
  │                               │                             │
  │──POST {messages, sessionId}──▶│                             │
  │                               │──generateEmbedding()──────▶ Hack Club /embeddings
  │                               │◀──number[1536]─────────────│
  │                               │  check semanticCache (cosine similarity ≥ 0.92)
  │                               │  if hit → stream cached response
  │                               │  else:
  │                               │──chat.completions.create()─▶ Hack Club /chat (Gemini 3 Flash)
  │                               │  ← tool_calls if needed:
  │                               │    search_site_content → lib/rag.ts → Supabase RPC
  │                               │    find_team_expert    → lib/team-data.ts
  │                               │    submit_contact_form → Supabase contacts table
  │                               │    suggest_navigation  → sends action to client
  │                               │    generate_image      → POST /api/assistant/image
  │◀──SSE stream (tokens)─────────│                             │
  │  {type:"meta",model}          │                             │
  │  {type:"token",content}...    │                             │
  │  {type:"done",action}         │──upsert chat_sessions──────▶ Supabase
  │                               │──addSemanticCacheEntry()    │
```

### Contact / Join Form

```
Browser → POST /api/join or Supabase direct (contact page)
        → Supabase: join_requests or contacts table
        → NextResponse.json({ success: true })
```

---

## 6. API Reference

### `POST /api/assistant`

Streaming AI chat assistant. Returns Server-Sent Events.

**Request body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `messages` | `{role:"user"\|"assistant", content:string}[]` | ✅ | Conversation history |
| `sessionId` | `string` | ✅ | UUID for session persistence |
| `pathname` | `string` | ⚠️ | Current page path (provides context to the LLM) |

**Response:** `text/event-stream`

| Event type | Payload | Description |
|---|---|---|
| `meta` | `{ model: string }` | Emitted first; identifies the model used |
| `token` | `{ content: string }` | One text chunk |
| `done` | `{ action: AssistantAction \| null }` | Stream end; optional client action |
| `error` | `{ message: string }` | Error state |

**`AssistantAction` discriminated union:**

```ts
{ type: "navigate";       path: string }
{ type: "highlight";      textSnippet: string }
{ type: "generate_image"; prompt: string; modelChoice: string; aspectRatio: string }
```

**Rate limit:** 15 req / 60 s per IP (in-memory, per Vercel instance).

**Model fallback:** Primary `google/gemini-3-flash-preview` → fallback `google/gemini-2.5-flash` on `APIError`.

**Semantic cache:** In-process LRU-style cache (max 200 entries). Hits when cosine similarity ≥ 0.92 and the query contains no session-specific words (`my`, `i`, `register`, `status`).

**Intent trie bypass:** Certain high-frequency intents (WhatsApp link, navigation, contact form) are matched via a `KeywordTrie` + prototype embedding similarity and answered without an LLM call.

---

### `POST /api/assistant/image`

AI image generation.

**Request body:**

| Field | Type | Default | Description |
|---|---|---|---|
| `prompt` | `string` | — | Image description; auto-enhanced for quality |
| `modelChoice` | `"stable-diffusion-3"` \| other | — | `"stable-diffusion-3"` uses NVIDIA API; otherwise Hack Club proxy |
| `aspectRatio` | `string` | `"16:9"` | Aspect ratio for SD3 |

**Response:** `{ success: true, base64: "data:image/jpeg;base64,..." }` or `{ error: string }`

---

### `POST /api/assistant/voice`

Whisper speech-to-text transcription.

**Request:** `multipart/form-data` with field `audio` (Blob).

**Response:** `{ text: string }` or graceful `{ unavailable: true }` when the proxy project lacks Whisper access.

**Guard:** Returns 500 immediately if `OSM_API_KEY` is not set.

---

### `POST /api/assistant/feedback`

Appends a feedback entry to the `feedback` JSONB column of an existing `chat_sessions` row.

**Request body:**

| Field | Type | Required |
|---|---|---|
| `sessionId` | `string` | ✅ |
| `messageId` | `string` | ✅ |
| `feedback` | `"up"` \| `"down"` | ✅ |
| `messageText` | `string` | ⚠️ |
| `model` | `string` | ⚠️ |

---

### `POST /api/join`

Membership form submission.

**Request body:**

| Field | Type | Required |
|---|---|---|
| `name` | `string` | ✅ |
| `email` | `string` | ✅ |
| `message` | `string` | ✅ |
| `school` | `string` | ⚠️ |
| `experience` | `string` | ⚠️ |
| `interests` | `string[]` | ⚠️ |

**Response:** `{ success: true }` (200) or `{ error: string }` (400/502/500)

---

## 7. Config Options

### `next.config.mjs`

| Option | Value | Effect |
|---|---|---|
| `typescript.ignoreBuildErrors` | `true` | TypeScript errors do not fail CI build |
| `serverExternalPackages` | `["sharp","onnxruntime-node"]` | Excluded from server-side bundling |
| `images.formats` | `['image/avif','image/webp']` | Next.js image optimization formats |
| `images.remotePatterns` | `https://**` | All HTTPS image sources allowed |
| `reactStrictMode` | `true` | Double-invokes effects in dev |
| `productionBrowserSourceMaps` | `false` | Source maps disabled in prod |
| `compress` | `true` | gzip compression |
| `turbopack.root` | `process.cwd()` | Explicit Turbopack root |

**Build-time git env vars** (injected at build, read-only at runtime):

| Variable | Source |
|---|---|
| `NEXT_PUBLIC_GIT_COMMIT_HASH` | `git rev-parse HEAD` |
| `NEXT_PUBLIC_GIT_COMMIT_SHORT` | `git rev-parse --short HEAD` |
| `NEXT_PUBLIC_GIT_BRANCH` | `git rev-parse --abbrev-ref HEAD` |
| `NEXT_PUBLIC_GIT_COMMIT_MESSAGE` | `git log -1 --pretty=%s` |
| `NEXT_PUBLIC_GIT_COMMIT_DATE` | `git log -1 --pretty=%ci` |
| `NEXT_PUBLIC_BUILD_TIME` | `new Date().toISOString()` |
| `NEXT_PUBLIC_REPO_URL` | Hard-coded `https://github.com/gobitsnbytes/bitsnbytes` |

**Content Security Policy** (from `next.config.mjs` headers):
- `script-src` allows: `'unsafe-eval'`, `'unsafe-inline'`, Vercel Analytics, Tally, hCaptcha, Cloudflare Insights
- `connect-src` allows: Vercel vitals, hCaptcha, `*.supabase.co`, Cloudflare
- `frame-src` allows: Tally, hCaptcha, Discord

### `vercel.json`

| Setting | Value |
|---|---|
| `buildCommand` | `pnpm run build` |
| `installCommand` | `pnpm install` |
| `framework` | `nextjs` |
| Auto-deploy | `main` branch only |

Static asset cache headers: `/fonts/**` and `/images/**` → `Cache-Control: public, max-age=31536000, immutable`

---

## 8. Supabase Schema

### Tables

#### `site_embeddings`
Used by the RAG pipeline.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | PK |
| `page` | `text` | Page identifier (e.g. `"about"`) |
| `section` | `text` | Section heading (normalized, max 50 chars) |
| `content` | `text` | Chunk text |
| `embedding` | `vector(1536)` | Requires `pgvector` extension |

**Required Postgres function:**

```sql
create or replace function match_site_sections (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (id uuid, page text, section text, content text, similarity float)
language sql stable as $$
  select id, page, section, content,
    1 - (embedding <=> query_embedding) as similarity
  from site_embeddings
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;
```

#### `chat_sessions`

| Column | Type | Notes |
|---|---|---|
| `session_id` | `text` | PK (upsert key) |
| `messages` | `jsonb` | Full conversation array |
| `pathname` | `text` | Page path at time of chat |
| `model` | `text` | Model used |
| `ip_hash` | `text` | Hashed client IP |
| `feedback` | `jsonb` | Default `'[]'` — array of feedback entries |
| `updated_at` | `timestamptz` | Last activity |

#### `join_requests`

| Column | Type | Required |
|---|---|---|
| `name` | `text` | ✅ |
| `email` | `text` | ✅ |
| `message` | `text` | ✅ |
| `school` | `text` | nullable |
| `experience` | `text` | nullable |
| `interests` | `text` | nullable (comma-separated) |

#### `contacts`

| Column | Type | Required |
|---|---|---|
| `name` | `text` | ✅ |
| `email` | `text` | ✅ |
| `message` | `text` | ✅ |
| `subject` | `text` | nullable |
| `source` | `text` | Hard-coded `"website"` |

---

## 9. Known Edge Cases & Gotchas

- **Rate limiter is per-instance**: `lib/rate-limit.ts` uses an in-process `Map`. On Vercel, concurrent cold starts produce independent instances with independent counters. For strict global limits, replace with a Redis- or Supabase-backed implementation.

- **TypeScript build errors ignored**: `typescript.ignoreBuildErrors: true` in `next.config.mjs` means type errors do not fail the Vercel build. Run `tsc --noEmit` locally to catch issues.

- **Semantic cache is ephemeral**: The in-process semantic cache (`semanticCache` Map, max 200 entries) is cleared on every cold start and is not shared across instances.

- **Voice transcription silently degrades**: If the Hack Club proxy project lacks Whisper access, `POST /api/assistant/voice` returns `{ unavailable: true }` (200) instead of an error. The client must check this field.

- **hCaptcha site key is hard-coded**: The site key `50b2fe65-b00b-4b9e-ad62-3ba471098be2` is embedded directly in `app/contact/page.tsx`. There is no `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` env var.

- **`OSM_API_KEY` guards voice route but is unrelated to OSM**: The env var name is misleading — it acts purely as a feature flag for the voice endpoint, not as an OpenStreetMap key.

- **Git info falls back gracefully**: `next.config.mjs` wraps `execSync` calls in try/catch; if git is unavailable at build time (e.g. a zip download), all `NEXT_PUBLIC_GIT_*` vars are set to `"unknown"`.

- **`@xenova/transformers`** is listed as a dependency but no import was found in the primary app code. It may be a leftover or used in a branch-specific feature.

- **`serverExternalPackages: ["sharp","onnxruntime-node"]`**: Required because `onnxruntime-node` (a transitive dep of `@xenova/transformers`) cannot be bundled by webpack.

- **App Router page hydration**: Several pages use `"use client"` at the top level (e.g. `app/events/page.tsx`, `app/join/page.tsx`). These pages are not server-rendered HTML; JavaScript must execute before content is visible.

- **WebGL shader SSR**: `web-gl-shader.tsx` is always loaded with `ssr: false` via `next/dynamic`. Any server-rendered context relying on it will receive `null` during SSR.

- **Events page Important Update banner**: Auto-dismisses on scroll past 80px using a passive scroll event listener (see `app/events/page.tsx`).

---

## 10. Changelog

Only two commits are available in this shallow clone:

| Commit | Message |
|---|---|
| `a9ee81e` | `fix: Update language response handling to default to English and only use Hindi or Hinglish upon explicit request` |
| `d6b6be7` | `feat: Add CPU architecture demo and QnA assistant layouts; update sitemap and robots.txt for SEO` |

Version is `0.1.0` (see `package.json`). No `CHANGELOG.md` or git tags exist.

