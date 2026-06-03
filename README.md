# bits&bytes™ Official Website

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/gobitsnbytes/bitsnbytes)

Official platform for bits&bytes™, a teen-led coding community based in Lucknow, India. This repository powers the public website, community pages, and an AI assistant with retrieval and tool-calling support.

## What This Project Includes

- Next.js App Router website for community pages, events, projects, join, and contact.
- AI assistant API with SSE streaming responses and tool-calling flows.
- Semantic search (RAG) over selected site content using embeddings.
- Supabase-backed forms and chat session persistence.
- Production-oriented frontend with 3D/interactive UI components.

## Tech Stack

- Framework: Next.js 16, React 19, TypeScript 5
- Styling/UI: Tailwind CSS 4, Radix UI, custom animated components
- Data: Supabase (PostgreSQL)
- AI: OpenAI SDK against Hack Club proxy endpoints
- Deployment: Vercel
- Package manager: pnpm

## Getting Started

### 1. Prerequisites

- Node.js 20+
- pnpm 9+
- A Supabase project
- A Hack Club proxy API key for AI endpoints

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in values.

Required in practice (based on current code paths):

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
HACKCLUB_PROXY_API_KEY=...
GOOGLE_SITE_VERIFICATION=...
```

Optional:

```env
NVIDIA_KEY=...
```

Notes:
- `HACKCLUB_PROXY_API_KEY` is required for the assistant and embedding generation.
- `NVIDIA_KEY` is required only for the Stable Diffusion image generation branch.

### 4. Run Locally

```bash
pnpm dev
```

App runs at `http://localhost:3000`.

## Available Scripts

- `pnpm dev` - Run development server
- `pnpm build` - Production build
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Project Structure

```text
.
|- app/                     # Next.js App Router pages and API routes
|  |- api/
|  |  |- assistant/         # AI assistant, feedback, image, voice
|  |  |- join/              # Join form ingestion
|  |  |- discord/           # Discord-related endpoint(s)
|  |- about/ contact/ events/ impact/ join/ projects/ faq/ ...
|- components/              # Shared and UI components
|- lib/                     # RAG, Supabase, rate limit, sentiment, team logic
|- public/                  # Static assets (images, llms.txt, sitemap, etc.)
|- scripts/embed-site.ts    # Embeds selected docs into site_embeddings table
|- comic/                   # Comic/sticker generation utilities
```

## API Overview

### `POST /api/assistant`

Main AI assistant endpoint.

- Input: user message history, current pathname, session ID
- Output: `text/event-stream` (SSE) with token streaming and final action payload
- Includes:
	- rate limiting (`10 requests/min/IP`)
	- intent bypass for fast navigation/contact/WhatsApp responses
	- tool-calling loop
	- model fallback behavior
	- optional semantic response cache

### `POST /api/join`

Stores join requests in Supabase `join_requests`.

Required fields:
- `name`
- `email`
- `message`

Optional fields:
- `school`
- `experience`
- `interests` (array, stored as comma-separated text)

### `POST /api/assistant/feedback`

Appends per-message feedback into `chat_sessions.feedback` in Supabase.

### `POST /api/assistant/image`

Image generation endpoint used by assistant tools.

- Stable Diffusion path: NVIDIA endpoint (`NVIDIA_KEY`)
- Gemini path: Hack Club proxy (`HACKCLUB_PROXY_API_KEY`)

## Database Expectations (Supabase)

At minimum, the code currently assumes tables like:

- `join_requests`
- `chat_sessions`
- `site_embeddings`
- `contacts`
- `sponsor_leads`

Also expected:
- vector search support for embeddings (used by RAG search flows)

See `TECHNICAL_DOCUMENTATION.md` for deeper schema and function examples.

## Embedding Site Content for RAG

The script `scripts/embed-site.ts` currently reads:

- `public/llms.txt`
- `AGENTS.md`

Then it generates embeddings and inserts chunks into `site_embeddings`.

Run with:

```bash
pnpm tsx scripts/embed-site.ts
```

(Use your preferred TS runtime if `tsx` is not installed globally.)

## Deployment

Configured for Vercel via `vercel.json`.

- Install command: `pnpm install`
- Build command: `pnpm run build`
- Framework: `nextjs`

The app also injects git metadata at build time in `next.config.mjs`.

## Operational Notes

- `next.config.mjs` currently has `typescript.ignoreBuildErrors: true`.
	- This avoids type-check build blocking, but can hide production issues.
- Rate limiting in `lib/rate-limit.ts` is in-memory.
	- For multi-instance consistency, move to Redis or a shared store.

## Documentation

- High-level technical reference: `TECHNICAL_DOCUMENTATION.md`
- Organization and team handbook used for assistant context: `AGENTS.md`

## Contributing

1. Create a feature branch.
2. Make focused changes.
3. Run lint/build locally.
4. Open a PR with context and screenshots for UI work.

## License

This repository does not currently include a license file. Add one if you intend to allow reuse/distribution under specific terms.
