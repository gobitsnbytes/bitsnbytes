import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const fullItems: BreadcrumbItem[] = [
    { name: "Home", href: "/" },
    ...items,
  ];

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
          "flex items-center space-x-1.5 text-xs font-mono text-foreground/70 mb-6 flex-wrap",
          className
        )}
      >
        <ol className="flex items-center space-x-1.5 flex-wrap">
          {fullItems.map((item, index) => {
            const isLast = index === fullItems.length - 1;
            return (
              <li key={index} className="flex items-center space-x-1.5">
                {index > 0 && (
                  <ChevronRight className="h-3 w-3 text-foreground/40 shrink-0" aria-hidden="true" />
                )}
                {isLast || !item.href ? (
                  <span
                    className="font-bold text-foreground underline decoration-primary decoration-2 underline-offset-4"
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-primary dark:hover:text-accent transition-colors flex items-center gap-1 font-semibold"
                  >
                    {index === 0 && <Home className="h-3 w-3 shrink-0" aria-hidden="true" />}
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

export default Breadcrumbs;
