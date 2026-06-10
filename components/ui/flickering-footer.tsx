"use client";

import { ChevronRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import Image from "next/image";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import {
  Github,
  Instagram,
  Linkedin,
  MapPin,
  ShieldCheck,
} from "lucide-react";

// IMPECCABLE_PREFLIGHT: context=pass product=pass command_reference=pass shape=not_required image_gate=skipped:using_css_styling_no_new_image_assets_needed mutation=open

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  className?: string;
  text?: string;
  fontSize?: number;
  fontWeight?: number | string;
}

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 10,
  gridGap = 2,
  flickerChance = 0.8,
  className,
  text = "",
  fontSize = 90,
  fontWeight = 900,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInViewRef = useRef(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Holds animation state to prevent trigger updates / re-renders
  const stateRef = useRef<{
    cols: number;
    rows: number;
    squares: Float32Array;
    hasTextGrid: Uint8Array;
    dpr: number;
  }>({
    cols: 0,
    rows: 0,
    squares: new Float32Array(0),
    hasTextGrid: new Uint8Array(0),
    dpr: 1,
  });

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) return;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const cols = Math.ceil(width / (squareSize + gridGap));
    const rows = Math.ceil(height / (squareSize + gridGap));

    const squares = new Float32Array(cols * rows);
    for (let i = 0; i < squares.length; i++) {
      squares[i] = Math.random();
    }

    // Generate offscreen text mask to sample active pixels
    const hasTextGrid = new Uint8Array(cols * rows);
    if (text) {
      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = canvas.width;
      maskCanvas.height = canvas.height;
      const maskCtx = maskCanvas.getContext("2d");
      if (maskCtx) {
        maskCtx.fillStyle = "white";
        // Using brand primary font Helvetica Now or Arial Black for clean readability in grid
        maskCtx.font = `${fontWeight} ${fontSize * dpr}px "Helvetica Now", "Arial Black", -apple-system, sans-serif`;
        // Apply letter spacing to prevent pixel overlap in low-res grid
        if ("letterSpacing" in maskCtx) {
          (maskCtx as any).letterSpacing = `${8 * dpr}px`;
        }
        maskCtx.textAlign = "center";
        maskCtx.textBaseline = "middle";
        maskCtx.fillText(text, maskCanvas.width / 2, maskCanvas.height / 2);

        const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height).data;

        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const cx = Math.floor((i * (squareSize + gridGap) + squareSize / 2) * dpr);
            const cy = Math.floor((j * (squareSize + gridGap) + squareSize / 2) * dpr);
            if (cx >= 0 && cx < maskCanvas.width && cy >= 0 && cy < maskCanvas.height) {
              const idx = (cy * maskCanvas.width + cx) * 4;
              // If pixel is set (opaque alpha), mark it as part of text
              hasTextGrid[i * rows + j] = maskData[idx + 3] > 60 ? 1 : 0;
            }
          }
        }
      }
    }

    stateRef.current = { cols, rows, squares, hasTextGrid, dpr };
    setCanvasSize({ width, height });
  }, [squareSize, gridGap, text, fontSize, fontWeight]);

  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { cols, rows, squares, hasTextGrid, dpr } = stateRef.current;
    if (cols === 0 || rows === 0) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Curated Neobrutalist Brandkit colors
    const brandColors = [
      "#97192c", // Burgundy base
      "#fc920d", // Orange pop
      "#fee9cf", // Light warm orange/cream
      "#120f0a", // Core Charcoal/Black
      "#df8e74", // Warm Accent range
    ];

    const actualSquareSize = squareSize * dpr;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * (squareSize + gridGap) * dpr;
        const y = j * (squareSize + gridGap) * dpr;

        const idx = i * rows + j;
        const isText = hasTextGrid[idx] === 1;
        const val = squares[idx];

        if (isText) {
          // Inside text mask: 85% chance of colorful active state
          if (val > 0.15) {
            const colorIdx = Math.floor(((val - 0.15) / 0.85) * brandColors.length);
            const color = brandColors[Math.min(colorIdx, brandColors.length - 1)];

            ctx.fillStyle = color;
            ctx.fillRect(x, y, actualSquareSize, actualSquareSize);

            // Bold crisp outline
            ctx.strokeStyle = "#120f0a";
            ctx.lineWidth = 1 * dpr;
            ctx.strokeRect(x, y, actualSquareSize, actualSquareSize);
          } else {
            // Faint grid tile for empty bits inside text
            ctx.strokeStyle = "rgba(18, 15, 10, 0.08)";
            ctx.lineWidth = 0.5 * dpr;
            ctx.strokeRect(x, y, actualSquareSize, actualSquareSize);
          }
        } else {
          // Outside text mask: 1.5% chance of standalone highlights
          if (val > 0.985) {
            const colorIdx = Math.floor(((val - 0.985) / 0.015) * brandColors.length);
            const color = brandColors[Math.min(colorIdx, brandColors.length - 1)];

            ctx.fillStyle = color;
            ctx.fillRect(x, y, actualSquareSize, actualSquareSize);

            ctx.strokeStyle = "#120f0a";
            ctx.lineWidth = 1 * dpr;
            ctx.strokeRect(x, y, actualSquareSize, actualSquareSize);
          } else {
            // Normal empty grid tile
            ctx.strokeStyle = "rgba(18, 15, 10, 0.04)";
            ctx.lineWidth = 0.5 * dpr;
            ctx.strokeRect(x, y, actualSquareSize, actualSquareSize);
          }
        }
      }
    }
  }, [squareSize, gridGap]);

  const updateSquares = useCallback((deltaTime: number) => {
    const { squares } = stateRef.current;
    for (let i = 0; i < squares.length; i++) {
      if (Math.random() < flickerChance * deltaTime) {
        squares[i] = Math.random();
      }
    }
  }, [flickerChance]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    setupCanvas();

    let animationFrameId: number;
    let lastTime = 0;

    const animate = (time: number) => {
      // Capped deltaTime to prevent jumps when backgrounded
      const deltaTime = lastTime === 0 ? 0.016 : (time - lastTime) / 1000;
      const cappedDelta = Math.min(deltaTime, 0.1);
      lastTime = time;

      if (isInViewRef.current) {
        updateSquares(cappedDelta);
        drawGrid();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    const resizeObserver = new ResizeObserver(() => {
      setupCanvas();
      drawGrid();
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [setupCanvas, drawGrid, updateSquares]);

  return (
    <div
      ref={containerRef}
      className={cn("h-full w-full", className)}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{ width: canvasSize.width, height: canvasSize.height }}
      />
    </div>
  );
};

const DiscordIcon = ({ className, ...props }: React.ComponentProps<"svg">) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.894.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.92 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.009c.12.099.246.197.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
  </svg>
);

const socialLinks = [
  {
    href: "https://www.linkedin.com/company/gobitsbytes",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: "https://discord.gg/rjqPfwKKTE",
    label: "Discord",
    icon: DiscordIcon,
  },
  { href: "https://github.com/gobitsnbytes", label: "GitHub", icon: Github },
  {
    href: "https://www.instagram.com/gobitsnbytes",
    label: "Instagram",
    icon: Instagram,
  },
];

const footerLinks = [
  {
    title: "Explore",
    links: [
      { id: 1, title: "About", url: "/about" },
      { id: 2, title: "Impact", url: "/impact" },
      { id: 3, title: "Join", url: "/join" },
      { id: 4, title: "Contact", url: "/contact" },
      { id: 10, title: "Press Kit", url: "/press" },
    ],
  },
  {
    title: "Legal & Safety",
    links: [
      { id: 5, title: "FAQ", url: "/faq" },
      { id: 6, title: "Code of Conduct", url: "/coc" },
      { id: 7, title: "Terms of Service", url: "/terms" },
      { id: 8, title: "Privacy Policy", url: "/privacy" },
      { id: 9, title: "IP Policy", url: "/ip" },
    ],
  },
];

const legalLinks = [
  {
    title: "Terms",
    url: "/terms",
    label: "Participation, Forks, money, and authority",
  },
  {
    title: "Privacy",
    url: "/privacy",
    label: "Data handling, minors, and guardian requests",
  },
  {
    title: "Code of Conduct",
    url: "/coc",
    label: "Safety, reporting, enforcement, and standards",
  },
  {
    title: "IP Policy",
    url: "/ip",
    label: "Brand use, logos, open-source, and claims",
  },
  {
    title: "Press Kit",
    url: "/press",
    label: "Official logos, facts, colors, and media contact",
  },
];

export function FlickeringFooter() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function checkSize() {
      setIsMobile(window.innerWidth < 768);
    }
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return (
    <footer
      id="footer"
      className="w-full pb-0 mt-16 sm:mt-24 border-t-4 border-[#120f0a] bg-[#eae8e4] text-[#120f0a] relative z-10 selection:bg-[#fc920d] selection:text-[#120f0a]"
    >
      {/* Background stipple texture */}
      <div className="absolute inset-0 bg-noise-texture opacity-[0.05] pointer-events-none z-0" />

      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8 relative z-10">
        
        {/* Trust Center Panel - Styled as a bold Neobrutalist block */}
        <div className="relative overflow-hidden border-4 border-[#120f0a] bg-white p-6 md:p-8 shadow-[8px_8px_0px_0px_#120f0a] rounded-none">
          <div className="relative grid gap-6 lg:grid-cols-[20rem_1fr] lg:items-start">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 border-2 border-[#120f0a] bg-[#fc920d] text-[#120f0a] px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_#120f0a] rounded-none">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                Trust Center
              </div>
              <p className="text-sm leading-relaxed text-[#413f3b] font-medium max-w-xs">
                The public rules for a teen-led network: safety, privacy, brand stewardship, and participation standards.
              </p>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {legalLinks.map((link) => (
                <Link
                  key={link.url}
                  href={link.url}
                  className="group border-3 border-[#120f0a] bg-white p-4 text-left shadow-[4px_4px_0px_0px_#120f0a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#120f0a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-150 rounded-none text-[#120f0a] flex flex-col justify-between"
                >
                  <div>
                    <span className="flex items-center justify-between gap-2 text-sm font-black uppercase tracking-tight text-[#120f0a]">
                      {link.title}
                      <ChevronRightIcon className="h-4 w-4 text-[#120f0a]/50 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                    </span>
                    <span className="mt-2 block text-xs leading-snug text-[#716f6c]">
                      {link.label}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Sitemap / Links Section */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between p-6 sm:p-10 max-w-6xl mx-auto relative z-10 gap-8 md:gap-4 mt-8">
        
        {/* Brand Description Column */}
        <div className="flex flex-col items-start justify-start gap-y-4 max-w-xs">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative grid h-10 w-10 place-items-center border-3 border-[#120f0a] bg-white text-[#120f0a] shadow-[3px_3px_0px_0px_#120f0a] rounded-none group-hover:bg-[#fc920d] group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0px_0px_#120f0a] transition-all">
              <Image
                src="/logo.svg"
                alt="bits&bytes™ logo"
                width={28}
                height={28}
                className="h-6 w-6 object-contain"
                priority
              />
            </div>
            <div>
              <p className="font-sans text-lg font-black text-[#120f0a] leading-none uppercase tracking-tight">
                bits&bytes™
              </p>
              <p className="text-[10px] uppercase font-mono font-bold tracking-[0.25em] text-[#97192c] mt-0.5">
                Teen-led
              </p>
            </div>
          </Link>
          <p className="text-[#413f3b] text-sm leading-relaxed font-medium">
            India's independent, teen-led builder network. Connecting the country's most ambitious teenage developers and designers to ship software from scratch.
          </p>
          
          {/* Social Badges */}
          <div className="flex flex-wrap gap-2 mt-2">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 border-2 border-[#120f0a] bg-white text-[#120f0a] px-3 py-1.5 text-xs font-mono font-bold shadow-[3px_3px_0px_0px_#120f0a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#120f0a] hover:bg-[#fc920d] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all rounded-none"
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Directory Columns */}
        <div className="pt-4 md:pt-0 md:w-1/2">
          <div className="flex flex-col sm:flex-row items-start justify-start md:justify-end gap-8 lg:gap-16">
            {footerLinks.map((column, columnIndex) => (
              <ul key={columnIndex} className="flex flex-col gap-y-2.5 w-full sm:w-auto">
                <li className="text-xs font-black uppercase tracking-[0.25em] text-[#97192c] border-b border-[#120f0a]/15 pb-2 mb-2">
                  {column.title}
                </li>
                {column.links.map((link) => (
                  <li
                    key={link.id}
                    className="group inline-flex cursor-pointer items-center justify-start gap-1 text-sm font-bold text-[#413f3b] hover:text-[#fc920d] hover:translate-x-1 transition-all duration-150"
                  >
                    <Link href={link.url}>
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
            
            <div className="flex flex-col gap-y-2.5 w-full sm:w-auto">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#97192c] border-b border-[#120f0a]/15 pb-2 mb-2">
                Connect
              </p>
              <a
                href="mailto:hello@gobitsnbytes.org"
                className="text-sm font-mono font-bold text-[#120f0a] underline hover:text-[#fc920d] transition-colors"
              >
                hello@gobitsnbytes.org
              </a>
              <p className="flex items-center gap-2 text-sm font-semibold text-[#413f3b]">
                <MapPin className="h-4 w-4 shrink-0 text-[#97192c]" />
                Lucknow, India
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chunky Neobrutalist Halftone / Pixel Display Grid */}
      <div className="w-full h-32 sm:h-44 md:h-56 relative mt-8 z-0 border-t-4 border-[#120f0a] bg-white overflow-hidden">
        <div className="absolute inset-0 mx-0">
          <FlickeringGrid
            text="bitsnbytes"
            fontSize={isMobile ? 55 : 95}
            className="absolute inset-0 h-full w-full bg-white"
            squareSize={isMobile ? 8 : 12}
            gridGap={2}
            flickerChance={0.7}
          />
        </div>
      </div>

      {/* Copyright bottom bar - Solid Deep Charcoal */}
      <div className="border-t-4 border-[#120f0a] py-6 px-4 w-full bg-[#120f0a] text-[#d0cfce] relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-1 font-mono">
            <p className="font-black text-white uppercase tracking-tight">
              bits&amp;bytes™ by GOBITSNBYTES FOUNDATION
            </p>
            <p className="text-[#a09f9d]">
              © {new Date().getFullYear()} GOBITSNBYTES FOUNDATION. All rights reserved. | gobitsnbytes.org
            </p>
          </div>
          <p className="max-w-2xl text-[9px] sm:text-[10px] opacity-80 leading-relaxed font-serif text-[#a09f9d] text-center md:text-right">
            bits&amp;bytes™ is a student-led builder network operated by GOBITSNBYTES FOUNDATION, a Section 8 non-profit company registered in India.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default FlickeringFooter;
