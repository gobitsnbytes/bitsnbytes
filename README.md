# bits&bytes™ Official Website

Official public platform for bits&bytes™, a fully student-led builder network based in Lucknow and serving ambitious teen builders across India.

The site includes the public brand pages, event archives, join/contact flows, and an AI assistant powered by page context plus a Supabase-backed RAG index.

## Stack

- Next.js 16, React 19, TypeScript 5
- Tailwind CSS 4, Radix UI, Framer Motion
- Supabase for forms, chat persistence, and vector search
- Hack Club proxy for chat, embeddings, and image generation
- Vercel deployment
- Package manager: pnpm

## Local Setup

```bash
pnpm install
pnpm dev
```

The app runs at `http://localhost:3000`.

Copy `.env.example` to `.env.local` and provide:

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

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

Use pnpm for all project work.

## Project Structure

```text
app/                      Next.js routes and API handlers
components/               Shared UI, navigation, hero, assistant, sections
components/ui/            Reusable interface primitives and visual systems
lib/                      RAG, Supabase, rate limit, team/event data, utilities
public/                   Static images, logo, video, llms.txt, sitemap
scripts/embed-site.ts     RAG embedding refresh script
types/                    Type declarations
```

## Key Routes

- `/` homepage with hero, stats, partners, and story sections
- `/about` team and mission
- `/events` archived hackathons, workshops, and partner events
- `/impact` community statistics and outcomes
- `/join` membership application
- `/fork` Fork network map
- `/qna` full-page AI assistant
- `/press` brand assets and media context

## Events Context

Hack4Good v0 is now an archived event. Shared event state lives in `lib/events-data.ts`, and the homepage hero pulls its event carousel from that file.

The homepage movie CTA opens `public/movie/bnb-movie.mp4` in an in-page video frame.

## Brand Notes

The public name is **bits&bytes™**. Use **bitsnbytes** only where the ampersand is impractical, such as domains, handles, repository names, packages, or file paths. Use **GOBITSNBYTES FOUNDATION** only for legal, regulatory, contract, invoice, and official correspondence contexts.

`public/logo.svg` is the white logo mark. Keep it on dark, burgundy, or orange surfaces unless a monochrome/dark variant is intentionally provided.

See `brand-guideline.md`, `DESIGN.md`, and `public/llms.txt` for the current brand kit.

## AI Assistant And RAG

The assistant answers using:

- live route/page context from the client
- semantic search over `site_embeddings` in Supabase

The RAG refresh script currently indexes:

- `public/llms.txt`
- `AGENTS.md`

Refresh after content changes:

```bash
pnpm tsx scripts/embed-site.ts
```

The Husky pre-push hook also runs the embedding step when tracked source paths change.

## Production Notes

- Vercel config lives in `vercel.json`.
- `next.config.mjs` injects git metadata at build time.
- `typescript.ignoreBuildErrors` is currently enabled, so run lint/type checks before production-sensitive changes.
- In-memory rate limiting is suitable for simple deployments; use a shared store if the API runs across multiple instances.
