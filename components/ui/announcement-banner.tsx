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
