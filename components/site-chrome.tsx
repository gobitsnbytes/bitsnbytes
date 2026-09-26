"use client";

import { Suspense, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { Footer } from "@/components/chrome/footer";
import { Loader } from "@/components/chrome/loader";
import { Nav } from "@/components/chrome/nav";
import { FloatingAiAssistant } from "@/components/client-only-components";
import { ExperienceProvider } from "@/components/experience-provider";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { CursorLabel } from "@/components/riot/cursor-label";
import { cn } from "@/lib/utils";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPosterRoute = pathname === "/fork";
  const isCinematicRoute = pathname === "/minecraft";
  const isQnARoute = pathname === "/qna";

  // <Loader /> stays first in both branches so switching branches never re-mounts it.
  if (isPosterRoute || isCinematicRoute) {
    return (
      <>
        <Loader />
        {children}
        <CookieConsentBanner />
      </>
    );
  }

  // overflow-x-clip (not hidden) on the wrappers: hidden would make them scroll containers and break
  // sticky + ScrollTrigger pins. The page background is the body's halftone-field.
  return (
    <>
      <Loader />
      <ExperienceProvider>
        <div className={cn("flex min-h-screen flex-col overflow-x-clip", isQnARoute && "h-screen min-h-0 overflow-hidden")}>
          <Nav />
          <main id="main-content" className={cn("w-full flex-1 overflow-x-clip", isQnARoute && "h-full overflow-hidden")}>
            {children}
          </main>
          {!isQnARoute && <Footer />}
          <Suspense fallback={null}>{!isQnARoute && <FloatingAiAssistant />}</Suspense>
          <CookieConsentBanner />
        </div>
        <CursorLabel />
      </ExperienceProvider>
    </>
  );
}
