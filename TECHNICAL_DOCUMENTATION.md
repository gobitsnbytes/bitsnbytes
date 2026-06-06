# bits&bytes™ Technical Documentation

## 1. Project Overview

**Purpose:** Official website and platform for bits&bytes™, a teen-led builders network operating nationwide in India. Serves as community hub, event platform, and AI-powered assistant system.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, Supabase (PostgreSQL), OpenAI/HackClub Proxy API, Vercel.

**Core Architecture:** Server-side rendered Next.js application with AI chat assistant backend (LLMOps + RAG), static site generation for audience pages, client-side React components for interactivity.

**Key Features:** Semantic search over site content, AI-powered Q&A, team member matching, project idea generation, contact/sponsor lead capture, rate limiting, multi-language support (English/Hindi).

**Scale:** 1400+ community members, 5+ recognized Forks, 4+ events, mean team age of 16.5 years, served via Vercel with production source maps disabled.

---

## 2. Directory Structure

```
.
├── app/                              # Next.js App Router
│   ├── layout.tsx                   # Root layout (fonts, metadata, theme)
│   ├── page.tsx                     # Home page (hero + stats)
│   ├── manifest.ts                  # PWA manifest config
│   ├── globals.css                  # Tailwind + global styles
│   ├── api/
│   │   ├── assistant/               # AI chat endpoint + sub-routes
│   │   │   ├── route.ts            # Main POST handler (SSE streaming)
│   │   │   ├── feedback/           # Chat feedback collection
│   │   │   ├── image/              # Image generation trigger
│   │   │   └── voice/              # Voice input (placeholder)
│   │   ├── join/route.ts           # Submit join requests → Supabase
│   │   ├── contact/                # Contact form submissions
│   │   └── discord/                # Discord OAuth integration
│   ├── about/                      # Core Team and 11 Volunteers listing
│   ├── contact/                    # Supabase + hCaptcha contact form
│   ├── events/                     # Archived events (Execron, India Innovates)
│   ├── faq/                        # Comprehensive FAQ accordion
│   ├── impact/                     # Network metrics and shipped projects
│   ├── join/, join-cohort/, fork/  # Static Notion application redirects
│   └── qna/                        # Full-page interactive chat interface
├── components/
│   ├── ui/                         # Shadcn/radix-ui components (40+ files)
│   ├── qna-chat-interface.tsx      # Chat interface with markdown rendering
│   ├── navigation.tsx              # Top nav + mobile menu
│   ├── footer.tsx                  # Site footer
│   ├── hero.tsx                    # Landing hero section
│   ├── page-background.tsx         # Animated WebGL background
│   ├── team-globe.tsx              # Three.js globe visualization
│   └── theme-provider.tsx          # next-themes wrapper
├── lib/
│   ├── supabase.ts                 # Supabase client init
│   ├── rag.ts                      # Embedding generation + vector search
│   ├── rate-limit.ts               # Token-bucket rate limiter
│   ├── sentiment.ts                # Frustration detection regex
│   ├── team-data.ts                # Team members + role matching logic
│   ├── theme.ts                    # Theme utilities (dark mode)
│   └── utils.ts                    # cn() classname merger
├── public/
│   ├── images/                     # Optimized AVIF/WebP
│   ├── partners/                   # Sponsor logos
│   ├── team/                       # Team member photos
│   ├── llms.txt                    # AI model registry
│   ├── sitemap.xml                 # SEO sitemap
│   └── globe.json                  # Three.js globe data
├── comic/                          # Comic/sticker generation
│   ├── compile_pdf.py              # PDF spreads from PNG panels
│   ├── nybble_gen.py               # Comic strip generator
│   └── panels/, panels_v2/         # Generated comic frames
├── scripts/
│   └── embed-site.ts               # Batch embed site content for RAG
├── types/
│   └── svg.d.ts                    # SVG module declarations
├── package.json                    # Dependencies + pnpm config
├── tsconfig.json                   # TypeScript config (strict mode)
├── next.config.mjs                 # Build-time git info injection
├── postcss.config.mjs              # Tailwind + PostCSS setup
├── components.json                 # Shadcn CLI config
├── vercel.json                     # Vercel deployment config
└── .env.example                    # Environment template
```

---

## 3. Setup & Installation

### Prerequisites
- Node.js 20+ (recommended pnpm 9+)
- Supabase project with tables: `join_requests`, `contacts`, `sponsor_leads`, `chat_sessions`, `site_embeddings`
- HackClub Proxy API key (OpenAI models)
- Vercel account (deployment)

### Environment Variables
```bash
# .env.local (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
HACKCLUB_PROXY_API_KEY=your-hackclub-key
GOOGLE_SITE_VERIFICATION=your-verification-code
```

### Installation
```bash
# Install dependencies
pnpm install

# Run dev server (port 3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Production build (used by Vercel)
pnpm run build
```

### Database Setup (Supabase)
Required tables:

| Table | Columns | Purpose |
|-------|---------|---------|
| `join_requests` | `id`, `name`, `email`, `school`, `experience`, `interests`, `message`, `created_at` | Store member signup requests |
| `contacts` | `id`, `name`, `email`, `subject`, `message`, `source`, `created_at` | Store contact form submissions |
| `sponsor_leads` | `id`, `company_name`, `contact_name`, `email`, `sponsor_type`, `budget_range`, `goals`, `source`, `created_at` | Capture sponsorship inquiries |
| `chat_sessions` | `session_id`, `messages` (JSONB), `pathname`, `model`, `ip`, `created_at` | Store chat history |
| `site_embeddings` | `id`, `page`, `section`, `content`, `embedding` (vector 1536), `created_at` | Vector embeddings for RAG |

Required Supabase function (SQL):
```sql
create or replace function match_site_sections (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  page text,
  section text,
  content text,
  similarity float
)
language sql stable
as $$
  select
    site_embeddings.id,
    site_embeddings.page,
    site_embeddings.section,
    site_embeddings.content,
    1 - (site_embeddings.embedding <=> query_embedding) as similarity
  from site_embeddings
  where 1 - (site_embeddings.embedding <=> query_embedding) > match_threshold
  order by site_embeddings.embedding <=> query_embedding
  limit match_count;
$$;
```

---

## 4. Core Modules & Components

### 4.1 AI Assistant (`app/api/assistant/route.ts`)

**Function:** Multi-turn chat engine with tool calling, semantic caching, frustration detection, and strict RAG grounding contract to eliminate hallucinations.

**Input:** `{ messages: ClientMessage[], pathname: string, sessionId: string }`

**Output:** Server-Sent Events (SSE) stream with tokens, actions, metadata.

**Key Tools:**
- `search_site_content(query)` → Vector similarity search via RAG
- `find_team_expert(topic)` → Match user query to team members
- `recommend_role(skills, interests)` → Suggest role within network
- `suggest_navigation(path)` → Trigger client-side page navigation
- `submit_contact_form(name, email, message)` → Insert into Supabase
- `submit_sponsor_inquiry(company, contact, sponsor_type, goals)` → Sponsor capture
- `generate_image(prompt, model, aspect_ratio)` → Trigger image gen (Stable Diffusion 3 or Gemini)
- `generate_project_ideas(interests, tech_skills, theme)` → Suggest hackathon ideas

**Rate Limiting:** 10 requests/minute per IP (token bucket algorithm).

**Models Used:**
- Primary: `google/gemini-3-flash-preview`
- Fallback: `google/gemini-2.5-flash`
- Image Gen: `stable-diffusion-3` or `gemini-3.1`

**Semantic Cache:** 200-entry LRU cache; hits if cosine similarity ≥ 0.92.

**Frustration Detection:** Regex patterns for broken/confused/angry messages trigger empathy mode.

---

### 4.2 RAG (Retrieval-Augmented Generation) (`lib/rag.ts`)

**Function:** Embed document chunks and perform semantic search over site content.

**Key Functions:**

| Function | Params | Returns | Purpose |
|----------|--------|---------|---------|
| `generateEmbedding(text)` | `text: string` | `number[]` (1536-dim) | Call HackClub Proxy to embed text |
| `searchSiteContent(query, matchCount)` | `query: string, matchCount?: number` | `string[]` | Search embeddings (default 6 matches) |

**Embedding Model:** `openai/text-embedding-3-small` (1536 dimensions).

**API Endpoint:** `https://ai.hackclub.com/proxy/v1/embeddings`

**Error Handling:** Returns empty array if API fails; logs detailed errors.

---

### 4.3 Team Data & Role Matching (`lib/team-data.ts` & `app/about/page.tsx`)

**Team Members:** The platform features 8 core leads (Yash Singh, Akshat Kushwaha, Aadrika Maurya, Devaansh Pathak, Drishti, Raghav, Maryam Fatima, Srishti Singh) and 11 active contributors categorized by Operations, Outreach, Creative, and Tech.

**Functions:**

| Function | Purpose | Output |
|----------|---------|--------|
| `findExperts(query)` | Search team by skill/topic | Matching members + their superpowers |
| `recommendRoles(skills, interests)` | Match user to network roles | Ranked department suggestions |

---

### 4.4 Rate Limiting (`lib/rate-limit.ts`)

**Algorithm:** Sliding-window token bucket (in-memory per Vercel instance).

**Implementation:**
```typescript
rateLimit(ip: string, config: { maxRequests: number, windowMs?: number }) 
  → { allowed: boolean, remaining: number, retryAfterMs: number }
```

**Cleanup:** Stale entries pruned every 5 minutes (entries older than 2 min removed).

**Limitation:** Per-instance; use Redis/Supabase for global limits.

---

### 4.5 Sentiment Detection (`lib/sentiment.ts`)

**Function:** `detectFrustration(message: string) → boolean`

**Patterns Detected (via regex):**
- Technical issues: `doesn't work`, `broken`, `crash`, `glitch`
- Confusion: `confusing`, `don't understand`, `help me`
- Anger: `useless`, `frustrated`, `pissed`, `wtf`
- Repeated attempts: `again`, `still not`, `tried everything`

**Minimum Input:** 5 characters (shorter messages ignored).

---

### 4.6 Chat Interface Component (`components/qna-chat-interface.tsx`)

**Features:**
- Multi-turn conversation with persisted session ID
- Markdown rendering (GFM tables, links, code blocks)
- Countdown cards for events
- Team member profile cards
- Project idea cards (difficulty badges)
- Chart rendering via Recharts
- Frustration detection + empathy mode
- Copy/clear message history

**Session Storage:** LocalStorage for persistence across refreshes.

---

### 4.7 UI Component Library (`components/ui/`)

**45+ optimized Shadcn/Radix components** including:
- Forms: Input, Textarea, Select, Checkbox, Radio, OTP
- Layout: Card, Dialog, Tabs, Accordion, Dropdown
- Display: Table, Progress, Badge, Avatar
- Animations: GlassContainer, EvervaultCard, FlickeringFooter
- 3D: Globe, ThreeShaper (Three.js)
- Data viz: Carousel, Gallery, Dock

**Styling:** CSS Variables (Tailwind 4 + PostCSS), dark mode via `next-themes`.

---

## 5. Data Flow

```
User Message
    ↓
[Rate Limit Check] → (429 if exceeded)
    ↓
[Intent Bypass Check] → (WhatsApp link / Navigation / Contact form shortcut)
    ↓
[Semantic Cache Check] → (Cache hit returns stored response)
    ↓
[Frustration Detection] → (Adds empathy hint to system prompt)
    ↓
[Generate Query Embedding] → (1536-dim vector via HackClub API)
    ↓
[OpenAI Tool-Call Loop] → (Primary/Fallback model)
    ├─ Tool: search_site_content
    │   └─ Supabase function: match_site_sections (vector similarity)
    ├─ Tool: find_team_expert
    │   └─ Local inference: hardcoded team data + keyword match
    ├─ Tool: recommend_role
    │   └─ Local inference: skill/interest matching
    ├─ Tool: submit_contact_form
    │   └─ Supabase: insert into contacts table
    ├─ Tool: suggest_navigation
    │   └─ Client action: trigger route change
    └─ [Tool Results] → Fed back to model for next turn
    ↓
[Stream Response via SSE] → Client receives tokens incrementally
    ↓
[Cache Latest Response] → Semantic cache (if non-session-specific)
    ↓
[Save Chat Session] → Background execution via Next.js after() API → Supabase: chat_sessions + IP/pathname/timestamp
```

---

## 6. API Reference

### 6.1 `POST /api/assistant`

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ],
  "pathname": "/about",
  "sessionId": "uuid-or-string"
}
```

**Response:** Server-Sent Events (text/event-stream)
```
data: {"type":"meta","model":"google/gemini-3-flash-preview"}
data: {"type":"token","content":"Hello"}
data: {"type":"token","content":" there"}
data: {"type":"done","action":{"type":"navigate","path":"/join"}}
```

**Status Codes:**
- `200`: Stream successful
- `400`: Invalid/missing messages array
- `429`: Rate limited (includes `Retry-After` header)
- `500`: Server error (AI API failure, Supabase error)

---

### 6.2 `POST /api/join`

**Request:**
```json
{
  "name": "Priya Kumar",
  "email": "priya@example.com",
  "school": "Delhi Public School",
  "experience": "1-2 years",
  "interests": ["AI", "Web Dev"],
  "message": "I want to join!"
}
```

**Response:**
```json
{ "success": true }
```

**Status Codes:**
- `200`: Inserted into `join_requests`
- `400`: Missing name/email/message
- `502`: Supabase error
- `500`: Exception

---

### 6.3 Supabase Tables Schema

#### `join_requests`
```sql
id uuid primary key
name text not null
email text not null
school text
experience text
interests text
message text not null
created_at timestamp default now()
```

#### `contacts`
```sql
id uuid primary key
name text not null
email text not null
subject text
message text not null
source text (default: 'assistant' or 'form')
created_at timestamp default now()
```

#### `sponsor_leads`
```sql
id uuid primary key
company_name text not null
contact_name text not null
email text not null
sponsor_type text ('title', 'gold', 'silver', 'inkind')
budget_range text
goals text not null
source text (default: 'assistant')
created_at timestamp default now()
```

#### `chat_sessions`
```sql
session_id text primary key
messages jsonb (array of { role, content })
pathname text
model text
ip text
created_at timestamp default now()
```

#### `site_embeddings`
```sql
id uuid primary key
page text
section text
content text
embedding vector(1536)
created_at timestamp default now()
```

---

## 7. Configuration & Environment

### Build-Time Git Info Injection (`next.config.mjs`)

Automatically captures at build time:
- `NEXT_PUBLIC_GIT_COMMIT_HASH`
- `NEXT_PUBLIC_GIT_COMMIT_SHORT`
- `NEXT_PUBLIC_GIT_BRANCH`
- `NEXT_PUBLIC_GIT_COMMIT_MESSAGE`
- `NEXT_PUBLIC_GIT_COMMIT_DATE`
- `NEXT_PUBLIC_BUILD_TIME`

**Usage:** Available in browser via `process.env.NEXT_PUBLIC_*`.

### Security Headers (`next.config.mjs`)

| Header | Value |
|--------|-------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` (2 years) |
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-Content-Type-Options` | `nosniff` |
| `Content-Security-Policy` | Complex; allows: HCaptcha, Tally, Discord, Vercel Analytics, Supabase |

### Image Optimization (`next.config.mjs`)

- Formats: AVIF, WebP (fallback: original)
- Remote patterns: All HTTPS domains allowed
- Vercel native optimization enabled

### TypeScript Config (`tsconfig.json`)

- **Target:** ES6
- **Mode:** Strict (strict: true, noEmit: true)
- **Module Resolution:** Bundler
- **Path Aliases:** `@/*` → root, `@public/*` → public/

### Tailwind Config (`postcss.config.mjs`)

**CSS Framework:** Tailwind CSS 4 with `@tailwindcss/postcss` plugin.

**Theme Colors (Figma System):**
- Primary (brand anchor): `#97192C` (burgundy base) — accent: `#3E1E68` (deep purple)
- Secondary: Pink, Blue (accent)
- Dark mode theme: Black background + white text

---

## 8. Known Edge Cases & Gotchas

### 8.1 Semantic Cache Session-Specificity

**Issue:** Cache returns old answers for "my data" / "my status" queries.

**Implementation:** `SESSION_SPECIFIC_REGEX` (`/\b(my|i|register|status)\b/i`) skips caching for session-specific queries.

### 8.2 Tool Argument Parsing Failures

**Issue:** LLM may return truncated JSON for tool calls (finish_reason=length).

**Handling:** 
1. Attempt JSON parse
2. If fails, try to repair (add closing braces)
3. If still fails, notify model and retry
4. If token limit hit during tool calls, skip tools and answer directly

### 8.3 Model Fallback

**Issue:** Primary model (`gemini-3-flash-preview`) may return 403/unsupported_parameter.

**Response:** Auto-fallback to `gemini-2.5-flash` with same message context.

### 8.4 Vercel Serverless Instance Limitations

**Issue:** Rate limiter is per-instance (not global). Multiple instances ≠ shared state.

**Workaround:** Use Redis or Supabase for global 10-req/min limit.

### 8.5 SSE Stream Connection Drops

**Issue:** Long-running chat may timeout on some proxies/networks.

**Mitigation:** Stream incremental tokens; keep-alive via periodic SSE pings (not yet implemented).

### 8.6 Supabase Anonymous Key Exposure

**Issue:** NEXT_PUBLIC_SUPABASE_ANON_KEY is publicly visible in browser.

**Mitigation:** 
- Supabase RLS (Row-Level Security) policies restrict writes to specific tables
- API routes use same credentials; no additional auth layer
- Verify RLS policies are correctly set before production

### 8.7 Image Generation Cold Start

**Issue:** First image gen call triggers 10s+ latency.

**Current Handling:** UI shows "generating" animation while `/api/assistant/image` endpoint processes in background.

### 8.8 Embedding Model Dimensions

**Standard:** 1536 dimensions for OpenAI text-embedding-3-small.

**Mismatch:** If switching to a different model (e.g., 384-dim), must recreate all embeddings in `site_embeddings` table.

### 8.9 Team Member Photos

**Path Convention:** Team photos stored in `/public/team/{name-slug}.jpg`. If missing, component uses Shadcn Avatar fallback.

### 8.10 Timezone Handling

**Context Injection:** Assistant receives current time in IST (Asia/Kolkata). Useful for event eligibility checks.

**Locale:** Hardcoded to "en-IN" in assistant system context for Indian event references.

---

## 9. Deployment & CI/CD

### Vercel Deployment

```bash
# Automatic on git push to main
git push origin main
```

**Build Command:** `pnpm run build`
**Install Command:** `pnpm install`
**Dev Command:** `pnpm run dev` (local only)
**Start Command:** `pnpm start` (production)

**Environment:** Set in Vercel dashboard under Settings → Environment Variables.

**Git Integration:** main branch → production; other branches → preview.

### Health Checks

- **Homepage:** `GET /` (200 OK, renders HTML)
- **API Assistant:** `POST /api/assistant` (valid token stream or 400)
- **Supabase Connectivity:** Check NEXT_PUBLIC_SUPABASE_URL availability

### Monitoring

- Vercel Analytics: `@vercel/speed-insights` + `@vercel/analytics` integrated
- Error logs: Check Vercel function logs for API errors
- Chat sessions: Query Supabase `chat_sessions` table for usage analytics

---

## 10. Scripts & Utilities

### `scripts/embed-site.ts`

**Purpose:** Batch-embed all site content for RAG.

**Usage:**
```bash
npx ts-node scripts/embed-site.ts
```

**Process:**
1. Walks site directory structure
2. Extracts text sections per page
3. Generates embeddings via HackClub API
4. Bulk inserts into `site_embeddings` table

---

## 11. Component Examples

### Chat Interface Initialization

```typescript
import { QnaChatInterface } from "@/components/qna-chat-interface"

export default function QnaPage() {
  return <QnaChatInterface />
}
// Component manages session ID, message history, streaming
```

### Team Member Display

```typescript
import { TEAM_MEMBERS } from "@/lib/team-data"

TEAM_MEMBERS.map(member => (
  <TeamCard
    name={member.name}
    role={member.role}
    superpowers={member.superpowers}
    department={member.department}
  />
))
```

### Rate Limiting Usage (in API route)

```typescript
import { rateLimit } from "@/lib/rate-limit"

const ip = req.headers.get("x-forwarded-for") || "anonymous"
const result = rateLimit(ip, { maxRequests: 10, windowMs: 60_000 })

if (!result.allowed) {
  return Response.json({ error: "Rate limited" }, { status: 429 })
}
```

---

## 12. Performance Optimizations

| Technique | Implementation |
|-----------|-----------------|
| **Code Splitting** | Next.js dynamic imports for heavy components (WebGLShader, Testimonial) |
| **Image Format** | AVIF/WebP via Vercel Image Optimization API |
| **CSS-in-JS** | Tailwind purged at build time (no runtime overhead) |
| **Font Loading** | `display: swap` for Poppins, Space Grotesk, JetBrains Mono |
| **SSE Streaming** | Tokens to browser as they're generated (TTFB optimized) |
| **Semantic Cache** | LRU 200-entry cache with cosine similarity (92% threshold) |
| **React Server Components** | App Router uses RSC by default (components.json: rsc: true) |
| **Production Source Maps** | Disabled (productionBrowserSourceMaps: false) |
| **Compression** | Gzip via Next.js compress: true |

**Vercel Speed Insights Target:**
- LCP < 2.5s
- INP < 200ms
- CLS < 0.1

---

## 13. Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| 429 Rate Limit | 10+ API calls/min from IP | Wait 60 seconds or use different IP |
| "HACKCLUB_PROXY_API_KEY not configured" | Missing env var | Set in .env.local + redeploy |
| Chat stuck on "generating" | Image endpoint timeout | Check `/api/assistant/image` logs |
| Embeddings don't match | Wrong model dimension | Verify text-embedding-3-small uses 1536 |
| Supabase connection fails | Invalid URL/anon key | Verify NEXT_PUBLIC_SUPABASE_* in .env |
| Git info shows "unknown" | Git not available at build | Ensure .git directory exists during build |
| Dark mode not persisting | next-themes not initialized | Check ThemeProvider wraps app in layout.tsx |
| Form won't submit | RLS policy denies insert | Verify Supabase RLS allows anon writes to specific tables |

---

## 14. Version Info

| Tool | Version |
|------|---------|
| Node | 20+ (recommended) |
| pnpm | 9+ |
| Next.js | 16.1.1 |
| React | 19.2.0 |
| TypeScript | 5 |
| Tailwind CSS | 4.1.9 |
| Supabase JS | 2.99.3 |
| OpenAI SDK | 4.76.0 |

**Last Updated:** March 18, 2026

---

## 15. Key Dependencies Graph

```
Next.js 16
├── React 19 + React DOM
├── Tailwind CSS 4
├── Radix UI (Button, Card, Dialog, etc.)
├── Framer Motion (animations)
├── GSAP (timeline animations)
├── Three.js + Three-Globe (3D)
├── React Markdown (chat rendering)
├── Zod (form validation)
├── React Hook Form (forms)
├── Supabase JS (DB client)
├── OpenAI SDK (API integration)
├── HCaptcha (bot protection)
├── Recharts (charts)
└── Vercel Speed Insights (monitoring)
```

---

## 16. Future Roadmap Notes

- [ ] Global rate limiter (Redis integration)
- [ ] Voice input support (Whisper API)
- [ ] Discord bot commands via `/api/discord` webhook
- [ ] Multi-language RAG (Hindi embeddings)
- [ ] Analytics dashboard (Supabase dashboards)
- [ ] Email notifications for leads (Resend.dev)

