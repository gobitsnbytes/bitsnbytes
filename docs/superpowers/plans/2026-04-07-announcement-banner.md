# Announcement Banner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a reusable, glassy-styled Announcement Banner component and integrate it at the top of the homepage to feature the new Cohorts graphic.

**Architecture:** A standalone React server/client component (`components/ui/announcement-banner.tsx`) using Next.js `next/image` for the banner graphic and Tailwind CSS for styling. It will be imported into `app/page.tsx` and placed immediately inside the main content flow, styled to fit the site's `max-w-7xl` container and sit naturally behind the fixed navigation.

**Tech Stack:** Next.js (App Router), React, Tailwind CSS, Lucide React (icons)

---

### Task 1: Create the AnnouncementBanner Component

**Files:**
- Create: `components/ui/announcement-banner.tsx`

- [ ] **Step 1: Write the component implementation**

Write the complete code for the reusable banner component. Since the project does not have automated unit tests configured (based on `package.json`), this will be visually verified.

```tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnnouncementBannerProps {
  imageUrl: string;
  imageAlt?: string;
  ctaText: string;
  ctaLink: string;
  className?: string;
}

export function AnnouncementBanner({
  imageUrl,
  imageAlt = "Announcement",
  ctaText,
  ctaLink,
  className,
}: AnnouncementBannerProps) {
  return (
    <div 
      className={cn(
        "relative w-full overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10",
        "flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 gap-4 sm:gap-6",
        "shadow-lg",
        className
      )}
    >
      {/* Image Container - Grows to take available space */}
      <div className="relative w-full sm:flex-1 h-16 sm:h-20 md:h-24 flex items-center justify-center sm:justify-start">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-contain object-center sm:object-left"
          priority
        />
      </div>
      
      {/* CTA Button Container - Shrinks to fit content */}
      <div className="flex-shrink-0 z-10 w-full sm:w-auto">
        <Link
          href={ctaLink}
          className="flex w-full sm:w-auto items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[var(--brand-pink)] px-6 py-2.5 text-sm font-black text-white transition-all hover:brightness-110 active:scale-95 shadow-md"
        >
          {ctaText}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/announcement-banner.tsx
git commit -m "feat: create reusable AnnouncementBanner component"
```

---

### Task 2: Integrate Banner into Homepage

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Import the component in `app/page.tsx`**

Add the import at the top of the file, around line 17:

```tsx
import { AnnouncementBanner } from "@/components/ui/announcement-banner";
```

- [ ] **Step 2: Insert the banner into the main layout**

Find the `Home` component export (around line 52) and modify the main `<div>` content to include the banner inside a `max-w-7xl` wrapper, directly above `HeroFuturistic`. Wait to insert it exactly here to ensure it sits behind the fixed `MiniNavbar` and lines up with the content padding:

```tsx
export default function Home() {
  return (
    <>
      <WebGLShader />
      <div className="flex flex-col w-full max-w-full overflow-x-hidden">
        {/* Added Announcement Banner Container */}
        <div className="relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-6 pt-24 sm:pt-28 pb-0 lg:pt-32 lg:pb-2">
          <AnnouncementBanner
            imageUrl="/banners/cohorts_banner.png"
            imageAlt="Introducing Bits&Bytes Cohorts"
            ctaText="Join Cohort"
            ctaLink="https://www.gobitsnbytes.org/join-cohort"
          />
        </div>

        <HeroFuturistic />
```

- [ ] **Step 3: Run dev server to verify visually**

Run: `npm run dev` or `pnpm dev`
Expected: The banner appears at the top of the homepage content, underneath the floating header when scrolled to the top, and displays the banner image next to a right-aligned CTA button.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: integrate cohorts announcement banner on homepage"
```
