'use client'

import React, { useState } from 'react';
import { X } from 'lucide-react';

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

// Brand colors from Bits&Bytes - solid colors only
const brandColors: Record<string, string> = {
  'deep-purple': '#3E1E68',
  'vibrant-pink': '#E45A92',
  'soft-coral': '#FFACAC',
  'rich-plum': '#5D2F77',
  'purple-pink': '#E45A92',
  'plum-coral': '#FFACAC',
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
      <div className={`grid gap-[5em] grid-cols-2 md:grid-cols-3 mx-auto py-[3em] overflow-visible ${className || ''}`}>
        {items.map((item, index) => (
          <button
            key={index}
            type="button"
            aria-label={item.label}
            onClick={() => handleCardClick(index)}
            className={`relative bg-transparent outline-none w-[4.5em] h-[4.5em] [perspective:24em] [transform-style:preserve-3d] [-webkit-tap-highlight-color:transparent] group cursor-pointer ${
              item.customClass || ''
            }`}
          >
            <span
              className="absolute top-0 left-0 w-full h-full rounded-[1.25em] block transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[100%_100%] rotate-[15deg] group-hover:[transform:rotate(25deg)_translate3d(-0.5em,-0.5em,0.5em)]"
              style={{
                ...getBackgroundStyle(item.color),
                boxShadow: '0.5em -0.5em 0.75em hsla(223, 10%, 10%, 0.15)'
              }}
            ></span>

            <span
              className="absolute top-0 left-0 w-full h-full rounded-[1.25em] bg-[hsla(0,0%,100%,0.15)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[80%_50%] flex backdrop-blur-[0.75em] [-webkit-backdrop-filter:blur(0.75em)] transform group-hover:[transform:translateZ(2em)]"
              style={{
                boxShadow: '0 0 0 0.1em hsla(0, 0%, 100%, 0.3) inset'
              }}
            >
              <span className="m-auto w-[1.5em] h-[1.5em] flex items-center justify-center" aria-hidden="true">
                {item.icon}
              </span>
            </span>

            <span className="absolute top-full left-0 right-0 text-center whitespace-nowrap leading-[2] text-base opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] translate-y-0 group-hover:opacity-100 group-hover:[transform:translateY(20%)]">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* Modal Overlay */}
      {activeCard !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={closeCard}
        >
          <div 
            className="relative w-full max-w-2xl glass-card p-8 shadow-xl hover:shadow-[var(--glow-strong)] text-foreground dark:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeCard}
              className="absolute top-6 right-6 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div 
                  className="p-3 rounded-2xl"
                  style={{ backgroundColor: brandColors[items[activeCard].color] || items[activeCard].color }}
                >
                  <div className="w-7 h-7 text-white">
                    {items[activeCard].icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold font-display">
                    {items[activeCard].label}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {items[activeCard].description}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {items[activeCard].content.map((point, idx) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-2xl border border-white/20 dark:border-white/10"
                  >
                    <div 
                      className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: brandColors[items[activeCard].color] || items[activeCard].color }}
                    />
                    <p className="text-sm leading-relaxed">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlassIcons;
