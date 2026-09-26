"use client";

import dynamic from "next/dynamic";

// Client-only (reads localStorage on first render). SiteChrome leaves it out on /qna, which has its own console.
export const FloatingAiAssistant = dynamic(
  () => import("@/components/ui/glowing-ai-chat-assistant").then((mod) => ({ default: mod.FloatingAiAssistant })),
  { ssr: false },
);
