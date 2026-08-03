# bits&bytes™

official platform for bits&bytes™ — a fully student-led builder network based in Lucknow, serving ambitious teen builders across India.

the platform handles public brand pages, event archives, membership applications, and an on-page AI assistant backed by a Supabase vector RAG index.

---

## Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript 5
- **Styling & Motion**: Tailwind CSS 4, Radix UI primitives, Framer Motion
- **Database & RAG**: Supabase (PostgreSQL, vector search `site_embeddings`), Hack Club AI proxy
- **Package Manager**: `pnpm` (mandatory)
- **Deployment**: Vercel

---

## Local Setup

```bash
pnpm install
pnpm dev
```

open `http://localhost:3000`.

copy `.env.example` to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
HACKCLUB_PROXY_API_KEY=...
GOOGLE_SITE_VERIFICATION=...
```

---

## Scripts

```bash
pnpm dev      # local dev server
pnpm build    # production build
pnpm start    # start production build
pnpm lint     # type & lint check
```

always use `pnpm` for script execution and dependency changes.

---

## Project Structure

```text
app/                      Next.js routes and API handlers
components/               Shared UI, navigation, hero, assistant, sections
components/ui/            Reusable interface primitives and visual systems
lib/                      RAG pipeline, Supabase client, rate limiter, event data
public/                   Static images, logo SVG, video assets, llms.txt, sitemap
scripts/embed-site.ts     RAG embedding generator script
types/                    TypeScript interfaces and schema declarations
```

---

## Key Routes

- `/` — main hero, community metrics, active partner roster, and event carousel
- `/about` — team roles, origin story, and section 8 governance framework
- `/events` — archived hackathons (Hack4Good v0, Execron 1.0, Copilot Dev Days)
- `/impact` — builder throughput and evaluation metrics
- `/join` — membership application flow
- `/fork` — network map for local student chapters
- `/qna` — full-page AI assistant interface
- `/press` — vector logo marks and brand kit guidelines

---

## RAG & AI Assistant

the on-page AI assistant pulls context from two sources:
1. active client route state (`pathname` + page snippet)
2. `site_embeddings` table in Supabase generated via `openai/text-embedding-3-small`

to refresh vector embeddings after updating `public/llms.txt` or `AGENTS.md`:

```bash
pnpm tsx scripts/embed-site.ts
```

a husky `pre-push` hook automatically triggers embedding re-indexing when source files change.

---

## Brand Rules

- public brand name: **bits&bytes™**
- use **bitsnbytes** only in environments where `&` is restricted (domains, repository paths, package names, file directories).
- **GOBITSNBYTES FOUNDATION** is reserved exclusively for legal, regulatory, banking, and contract contexts.
- logo mark: `public/logo.svg` (white mark, sits on dark, burgundy `#97192C`, or orange `#FC920D` surfaces).
