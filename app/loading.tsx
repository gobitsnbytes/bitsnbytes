"use client";

import { Terminal, TypingAnimation, AnimatedSpan } from "@/components/ui/terminal";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 transition-colors duration-300">
      <div className="w-full max-w-lg">
        <Terminal className="w-full bg-card">
          <TypingAnimation duration={15}>pnpm install --frozen-lockfile</TypingAnimation>
          <AnimatedSpan className="text-emerald-600 dark:text-emerald-400 font-bold">✔ Resolved 21 subdirectories and 24 files in 380ms</AnimatedSpan>
          <AnimatedSpan className="text-emerald-600 dark:text-emerald-400 font-bold">✔ Audited 82 dependencies successfully</AnimatedSpan>
          <TypingAnimation duration={15}>npx tsx scripts/embed-site.ts</TypingAnimation>
          <AnimatedSpan className="text-blue-600 dark:text-blue-400">ℹ Indexing public/llms.txt and AGENTS.md for RAG...</AnimatedSpan>
          <AnimatedSpan className="text-emerald-600 dark:text-emerald-400 font-bold">✔ Embedding generated with text-embedding-3-small</AnimatedSpan>
          <TypingAnimation duration={15}>pnpm run dev</TypingAnimation>
          <AnimatedSpan className="text-purple-600 dark:text-purple-400 font-bold">▲ Next.js 16.1.1 - Local: http://localhost:3000</AnimatedSpan>
          <AnimatedSpan className="font-black text-accent uppercase tracking-widest animate-pulse mt-2">
            🚀 SHIPPING BITS&BYTES™...
          </AnimatedSpan>
        </Terminal>
      </div>
    </div>
  );
}

