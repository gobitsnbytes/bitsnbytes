"use client";

import { Suspense, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { Footer } from "@/components/chrome/footer";
import { Loader } from "@/components/chrome/loader";
import { Nav } from "@/components/chrome/nav";
import { SoundProvider } from "@/components/chrome/sound/provider";
import { FloatingAiAssistant } from "@/components/client-only-components";
import { ExperienceProvider } from "@/components/experience-provider";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { CursorLabel } from "@/components/riot/cursor-label";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // overflow-x-clip (not hidden) on the wrappers: hidden would make them scroll containers and break
  // sticky + ScrollTrigger pins. The page background is the body's halftone-field.
  return (
    <>
      <Loader />
      <ExperienceProvider>
        <div className="flex min-h-screen flex-col overflow-x-clip">
          <Nav />
          <main id="main-content" className="w-full flex-1 overflow-x-clip">
            {children}
          </main>
          <Footer />
          {/* /qna is the assistant's own page; everywhere else it stays closed until [C] opens it. */}
          <Suspense fallback={null}>{pathname !== "/qna" && <FloatingAiAssistant />}</Suspense>
          <CookieConsentBanner />
        </div>
        <CursorLabel />
        <SoundProvider />
      </ExperienceProvider>
    </>
  );
}
