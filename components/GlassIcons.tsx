"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

export interface GlassIconsItem {
  icon: React.ReactElement;
  color: string;
  label: string;
  description: string;
  content: string[];
  customClass?: string;
}

export interface GlassIconsProps {
  items: GlassIconsItem[];
  className?: string;
}

// Brand colors from bits&bytes™ - reference CSS variables from the canonical palette
const brandColors: Record<string, string> = {
  "deep-purple": "var(--bb-deep-purple)",
  "vibrant-pink": "var(--bb-pink)",
  "soft-coral": "var(--bb-orange-20)",
  "rich-plum": "var(--bb-plum)",
  "purple-pink": "var(--bb-pink)",
  "plum-coral": "var(--bb-orange-20)",
};

const GlassIcons: React.FC<GlassIconsProps> = ({ items, className }) => {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const getBackgroundStyle = (color: string): React.CSSProperties => {
    if (brandColors[color]) {
      return { background: brandColors[color] };
    }
    return { background: color };
  };

  const handleCardClick = (index: number) => {
    setActiveCard(activeCard === index ? null : index);
  };

  const closeCard = () => {
    setActiveCard(null);
  };

  return (
    <>
      {/* Responsive grid - 2 cols on mobile, 3 on tablet+ */}
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8 md:gap-12 lg:gap-16 mx-auto py-8 sm:py-12 md:py-16 px-2 sm:px-4 md:px-0 w-full max-w-full overflow-hidden ${className || ""}`}
      >
        {items.map((item, index) => (
          <button
            key={index}
            type="button"
            aria-label={item.label}
            onClick={() => handleCardClick(index)}
            className={`relative bg-transparent outline-none flex flex-col items-center justify-center [-webkit-tap-highlight-color:transparent] group cursor-pointer w-full max-w-[140px] sm:max-w-none mx-auto ${
              item.customClass || ""
            }`}
          >
            {/* Icon container - responsive sizing */}
            <div className="relative w-14 h-14 sm:w-[4.5rem] sm:h-[4.5rem] md:w-20 md:h-20 [perspective:24em] [transform-style:preserve-3d]">
              {/* Ambient glow background matching icon color */}
              <span
                className="absolute top-0 left-0 w-full h-full rounded-2xl sm:rounded-[1.25em] -z-10 scale-125 sm:scale-150 opacity-30 sm:opacity-40 blur-lg sm:blur-xl transition-opacity duration-300"
                style={getBackgroundStyle(item.color)}
              ></span>

              <span
                className="absolute top-0 left-0 w-full h-full rounded-2xl sm:rounded-[1.25em] block transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[100%_100%] rotate-[15deg] group-hover:[transform:rotate(25deg)_translate3d(-0.5em,-0.5em,0.5em)] group-active:[transform:rotate(20deg)_translate3d(-0.25em,-0.25em,0.25em)]"
                style={{
                  ...getBackgroundStyle(item.color),
                  boxShadow: "0.5em -0.5em 0.75em hsla(223, 10%, 10%, 0.15)",
                }}
              ></span>

              <span
                className="absolute top-0 left-0 w-full h-full rounded-2xl sm:rounded-[1.25em] bg-[hsla(0,0%,100%,0.15)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[80%_50%] flex backdrop-blur-[0.75em] [-webkit-backdrop-filter:blur(0.75em)] transform group-hover:[transform:translateZ(2em)] group-active:[transform:translateZ(1em)]"
                style={{
                  boxShadow: "0 0 0 0.1em hsla(0, 0%, 100%, 0.3) inset",
                }}
              >
                <span
                  className="m-auto w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center"
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
              </span>
            </div>

            {/* Label - always visible on mobile, hover on desktop */}
            <span className="mt-2 sm:mt-4 text-center text-[11px] sm:text-sm md:text-base font-medium text-foreground/80 dark:text-white/80 sm:opacity-0 sm:translate-y-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] group-hover:opacity-100 group-hover:translate-y-1 truncate max-w-full">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* Modal Overlay - improved mobile styling */}
      {activeCard !== null && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
          onClick={closeCard}
        >
          <div
            className="relative w-full sm:max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient glow background matching icon color */}
            <div
              className="absolute inset-0 -z-10 scale-110 opacity-30 blur-3xl rounded-2xl hidden sm:block"
              style={{
                backgroundColor:
                  brandColors[items[activeCard].color] ||
                  items[activeCard].color,
              }}
            />
            {/* Main card - full width on mobile, rounded on desktop */}
            <div className="relative glass-card p-5 sm:p-6 md:p-8 shadow-xl hover:shadow-[var(--glow-strong)] text-foreground dark:text-white rounded-t-3xl sm:rounded-3xl">
              {/* Close button */}
              <button
                onClick={closeCard}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 sm:p-1.5 rounded-full sm:rounded-lg bg-white/10 sm:bg-transparent hover:bg-white/20 sm:hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex items-start gap-3 sm:gap-4 pr-8">
                  <div
                    className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shrink-0"
                    style={{
                      backgroundColor:
                        brandColors[items[activeCard].color] ||
                        items[activeCard].color,
                    }}
                  >
                    <div className="w-5 h-5 sm:w-7 sm:h-7 text-white">
                      {items[activeCard].icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold font-display">
                      {items[activeCard].label}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                      {items[activeCard].description}
                    </p>
                  </div>
                </div>

                {/* Content points */}
                <div className="space-y-2 sm:space-y-3">
                  {items[activeCard].content.map((point, idx) => (
                    <div
                      key={idx}
                      className="glass-card flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg"
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-1.5 sm:mt-2 shrink-0"
                        style={{
                          backgroundColor:
                            brandColors[items[activeCard].color] ||
                            items[activeCard].color,
                        }}
                      />
                      <p className="text-xs sm:text-sm leading-relaxed">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile bottom safe area */}
              <div className="h-4 sm:hidden" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlassIcons;
