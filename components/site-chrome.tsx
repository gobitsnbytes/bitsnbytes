"use client";

import { Suspense, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import Footer from "@/components/footer";
import Navigation from "@/components/navigation";
import { PageBackground } from "@/components/page-background";
import { FloatingAiAssistant } from "@/components/client-only-components";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPosterRoute = pathname === "/fork";
  const isCinematicRoute = pathname === "/minecraft";
  const isQnARoute = pathname === "/qna";

  if (isPosterRoute || isCinematicRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <PageBackground />
      <div className={`relative z-10 flex min-h-screen flex-col overflow-x-hidden ${isQnARoute ? "h-screen overflow-hidden min-h-0" : ""}`}>
        <Navigation />
        <main className={`flex-1 w-full overflow-x-hidden ${isQnARoute ? "h-full overflow-hidden" : ""}`}>{children}</main>
        {!isQnARoute && <Footer />}
        <Suspense fallback={null}>
          {!isQnARoute && <FloatingAiAssistant />}
        </Suspense>
      </div>
    </>
  );
}
