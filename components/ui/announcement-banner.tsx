import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GlassContainer } from "@/components/ui/glass-container";

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
    <GlassContainer
      containerClassName={cn("relative w-full shadow-lg", className)}
      className="relative h-20 w-full p-0 sm:h-24 md:h-28"
      glowColor="none"
      animated={false}
    >
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/15 to-black/40" />

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-end p-3 sm:p-4">
        <Button
          asChild
          variant="ghost"
          className="pointer-events-auto h-10 rounded-full border border-white/35 bg-transparent px-5 text-sm font-black text-white backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
        >
          <Link href={ctaLink} className="inline-flex items-center gap-2">
            {ctaText}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </GlassContainer>
  );
}
