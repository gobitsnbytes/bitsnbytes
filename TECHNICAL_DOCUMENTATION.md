# bits&bytes™ Technical Notes

## Overview

This repository powers the public bits&bytes™ website, event archive, join/contact flows, and AI assistant. It is a Next.js App Router application deployed on Vercel with Supabase-backed data and RAG.

## Runtime Stack

| Layer | Tech |
|---|---|
| Web | Next.js 16, React 19, TypeScript 5 |
| Styling | Tailwind CSS 4, Radix UI, Framer Motion |
| Data | Supabase/Postgres |
| AI | OpenAI SDK against Hack Club proxy endpoints |
| Embeddings | `openai/text-embedding-3-small` |
| Hosting | Vercel |
| Package manager | pnpm |

## Important Paths

```text
app/                         Routes, layouts, API handlers
app/api/assistant/route.ts    Streaming AI assistant endpoint
app/api/join/route.ts         Join form ingestion
app/api/contact/route.ts      Contact form ingestion
components/navigation.tsx     Site navigation wrapper
components/ui/mini-navbar.tsx Fixed responsive navbar
components/ui/hero-futuristic.tsx Homepage hero, event carousel, movie modal
lib/events-data.ts            Shared event metadata
lib/rag.ts                    Embedding generation and vector search
public/llms.txt               Public LLM/RAG context
scripts/embed-site.ts         RAG embedding refresh
```

## Homepage Media

The hero event carousel reads from `lib/events-data.ts`.

Image loading rules:

- First visible slide may use priority loading.
- Future slides should be preloaded quietly.
- Use stable aspect ratios to prevent layout shift.
- Use the `bg-dither-brand` texture as a calm fallback instead of heavy shimmer.

The "Watch movie" CTA opens:

```text
public/movie/bnb-movie.mp4
```

The video opens inside an in-page dialog, starts after the user click, keeps audio enabled, and hides browser controls.

## Event State

Hack4Good v0 is archived. Its shared status lives in `lib/events-data.ts` and should remain consistent across:

- homepage hero carousel
- `/events`
- `public/llms.txt`
- `AGENTS.md`

## AI Assistant Contract

The assistant should answer from:

- live page context sent by the client
- Supabase semantic search over `site_embeddings`

Primary environment variables:

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

## RAG Refresh

The embedding script currently indexes:

- `public/llms.txt`
- `AGENTS.md`

Refresh after content changes:

```bash
pnpm tsx scripts/embed-site.ts
```

The Husky pre-push hook runs the embedding refresh when tracked source paths change.

## Supabase Expectations

At minimum, the app expects:

| Table | Purpose |
|---|---|
| `join_requests` | Membership applications |
| `contacts` | Contact form submissions |
| `sponsor_leads` | Partnership inquiries |
| `chat_sessions` | Assistant sessions and feedback |
| `site_embeddings` | RAG chunks and vectors |

`site_embeddings` should support vector similarity lookup through the `match_site_sections` function used by `lib/rag.ts`.

## Build And Deployment

```bash
pnpm install
pnpm build
pnpm start
```

Vercel uses `vercel.json`. `next.config.mjs` injects git metadata at build time and configures image formats, security headers, redirects, and package aliases.

## Maintenance Rules

- Use pnpm.
- Keep `AGENTS.md` and `public/llms.txt` synchronized when public org context changes.
- Keep `DESIGN.md` and `brand-guideline.md` synchronized when brand standards change.
- Avoid adding root Markdown files unless they are canonical and maintained.
- Do not rely on `typescript.ignoreBuildErrors` as a quality gate. Run lint/build before shipping.
