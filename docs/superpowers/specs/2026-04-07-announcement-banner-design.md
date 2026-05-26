# Announcement Banner System Design

## 1. Purpose and Context
Bits&Bytes frequently hosts new cohorts, hackathons, and events. To support these ongoing announcements without rewriting code, we are implementing a reusable `AnnouncementBanner` component. This component will provide a consistent, easily updatable way to feature high-priority announcements (such as the new Bits&Bytes Cohorts) at the top of pages.

## 2. Component Architecture

### Component Definition
- **File Location**: `components/ui/announcement-banner.tsx`
- **Name**: `AnnouncementBanner`

### Props Interface
```typescript
interface AnnouncementBannerProps {
  /** Path or URL to the banner graphic (e.g., "/banners/cohorts_banner.png") */
  imageUrl: string;
  /** Accessible alt text for the image */
  imageAlt?: string;
  /** Text to display inside the Call-To-Action button */
  ctaText: string;
  /** URL the Call-To-Action button should navigate to */
  ctaLink: string;
  /** Optional className for overriding styles on specific pages */
  className?: string;
}
```

## 3. Visual Design and Layout

- **Aesthetic**: The banner will utilize a "glassy" aesthetic to match the site's existing modern style (`bg-white/5`, `backdrop-blur-md`, `border border-white/10`, `rounded-2xl`).
- **Sizing**: 
  - Width: It will span the full width of its parent container (constrained by the site's standard `max-w-7xl` wrapper).
  - Height: Determined by the image's aspect ratio to ensure it fits perfectly (`w-full`, `h-auto`, `object-contain`).
- **Internal Layout (Flexbox)**:
  - The banner is a horizontal flex container (`flex-row`, `items-center`, `justify-between`).
  - **Left / Center area**: The image will take up the primary space, vertically centered.
  - **Right area**: The Call-To-Action (CTA) button will be aligned to the far right. The button will use the existing `<Button>` component or link styles with a high-contrast styling (e.g., `--brand-pink`) to stand out.

## 4. Integration Details (Homepage)

- **Placement**: The banner will be placed at the very top of the content in `app/page.tsx` (inside the `max-w-7xl` container, likely right before or directly inside the `HeroFuturistic` section).
- **Z-Indexing**: It will sit organically in the document flow, rendering behind the fixed `MiniNavbar` so that it naturally scrolls up and away as the user scrolls down the page.
- **Initial Content**:
  - `imageUrl`: `"/banners/cohorts_banner.png"`
  - `ctaText`: `"Join Cohort"`
  - `ctaLink`: `"https://www.gobitsnbytes.org/join-cohort"`
  - `imageAlt`: `"Introducing Bits&Bytes Cohorts"`
