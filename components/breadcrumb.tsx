import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * inkfish bracket path: `[ HOME / FAQ ]` in Space Mono. Colours come from the surrounding
 * tone scope (text-fg / text-signal), so it reads on paper and ink. Emits BreadcrumbList JSON-LD.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const fullItems: BreadcrumbItem[] = [{ name: "Home", href: "/" }, ...items];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: fullItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.href ? { item: `https://gobitsnbytes.org${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <nav
        aria-label="Breadcrumb"
        className={cn(
          "mb-6 flex items-baseline gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-fg",
          className,
        )}
      >
        <span aria-hidden className="opacity-60">
          [
        </span>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {fullItems.map((item, index) => {
            const isLast = index === fullItems.length - 1;
            return (
              <li key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <span aria-hidden className="opacity-40">
                    /
                  </span>
                )}
                {isLast || !item.href ? (
                  <span className="text-signal" aria-current={isLast ? "page" : undefined}>
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="opacity-75 underline-offset-4 transition-opacity hover:underline hover:opacity-100 focus-visible:opacity-100"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
        <span aria-hidden className="opacity-60">
          ]
        </span>
      </nav>
    </>
  );
}

export default Breadcrumbs;
