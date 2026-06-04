"use client";

import { ChevronRightIcon } from "@radix-ui/react-icons";
import * as Color from "color-bits";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import React, {
  useCallback,
  useEffect,
  useMemo,
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

// Helper function to convert any CSS color to rgba
export const getRGBA = (
  cssColor: React.CSSProperties["color"],
  fallback: string = "rgba(180, 180, 180)",
): string => {
  if (typeof window === "undefined") return fallback;
  if (!cssColor) return fallback;

  try {
    if (typeof cssColor === "string" && cssColor.startsWith("var(")) {
      const element = document.createElement("div");
      element.style.color = cssColor;
      document.body.appendChild(element);
      const computedColor = window.getComputedStyle(element).color;
      document.body.removeChild(element);
      return Color.formatRGBA(Color.parse(computedColor));
    }
    return Color.formatRGBA(Color.parse(cssColor));
  } catch (e) {
    console.error("Color parsing failed:", e);
    return fallback;
  }
};

export const colorWithOpacity = (color: string, opacity: number): string => {
  if (!color.startsWith("rgb")) return color;
  return Color.formatRGBA(Color.alpha(Color.parse(color), opacity));
};

export function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    function checkQuery() {
      const result = window.matchMedia(query);
      setValue(result.matches);
    }
    checkQuery();
    window.addEventListener("resize", checkQuery);
    const mediaQuery = window.matchMedia(query);
    mediaQuery.addEventListener("change", checkQuery);
    return () => {
      window.removeEventListener("resize", checkQuery);
      mediaQuery.removeEventListener("change", checkQuery);
    };
  }, [query]);

  return value;
}

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  maxOpacity?: number;
  text?: string;
  fontSize?: number;
  fontWeight?: number | string;
}

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 3,
  gridGap = 3,
  flickerChance = 0.2,
  color = "#B4B4B4",
  width,
  height,
  className,
  maxOpacity = 0.15,
  text = "",
  fontSize = 140,
  fontWeight = 600,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const memoizedColor = useMemo(() => getRGBA(color), [color]);

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number,
    ) => {
      ctx.clearRect(0, 0, width, height);
      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = width;
      maskCanvas.height = height;
      const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
      if (!maskCtx) return;

      if (text) {
        maskCtx.save();
        maskCtx.scale(dpr, dpr);
        maskCtx.fillStyle = "white";
        maskCtx.font = `${fontWeight} ${fontSize}px "Helvetica Now Display", "Helvetica Neue", Helvetica, Arial, sans-serif`;
        maskCtx.textAlign = "center";
        maskCtx.textBaseline = "middle";
        maskCtx.fillText(text, width / (2 * dpr), height / (2 * dpr));
        maskCtx.restore();
      }

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * (squareSize + gridGap) * dpr;
          const y = j * (squareSize + gridGap) * dpr;
          const squareWidth = squareSize * dpr;
          const squareHeight = squareSize * dpr;
          const maskData = maskCtx.getImageData(
            x,
            y,
            squareWidth,
            squareHeight,
          ).data;
          const hasText = maskData.some(
            (value, index) => index % 4 === 0 && value > 0,
          );
          const opacity = squares[i * rows + j];
          const finalOpacity = hasText
            ? Math.min(1, opacity * 3 + 0.4)
            : opacity;
          ctx.fillStyle = colorWithOpacity(memoizedColor, finalOpacity);
          ctx.fillRect(x, y, squareWidth, squareHeight);
        }
      }
    },
    [memoizedColor, squareSize, gridGap, text, fontSize, fontWeight],
  );

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, width: number, height: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const cols = Math.ceil(width / (squareSize + gridGap));
      const rows = Math.ceil(height / (squareSize + gridGap));
      const squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity;
      }
      return { cols, rows, squares, dpr };
    },
    [squareSize, gridGap, maxOpacity],
  );

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) {
          squares[i] = Math.random() * maxOpacity;
        }
      }
    },
    [flickerChance, maxOpacity],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let gridParams: ReturnType<typeof setupCanvas>;

    const updateCanvasSize = () => {
      const newWidth = width || container.clientWidth;
      const newHeight = height || container.clientHeight;
      setCanvasSize({ width: newWidth, height: newHeight });
      gridParams = setupCanvas(canvas, newWidth, newHeight);
    };
    updateCanvasSize();

    let lastTime = 0;
    const animate = (time: number) => {
      if (!isInView) return;
      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;
      updateSquares(gridParams.squares, deltaTime);
      drawGrid(
        ctx,
        canvas.width,
        canvas.height,
        gridParams.cols,
        gridParams.rows,
        gridParams.squares,
        gridParams.dpr,
      );
      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(() => updateCanvasSize());
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0 },
    );
    intersectionObserver.observe(canvas);

    if (isInView) animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [setupCanvas, updateSquares, drawGrid, width, height, isInView]);

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
  const tablet = useMediaQuery("(max-width: 1024px)");

  return (
    <footer
      id="footer"
      className="w-full pb-0 mt-12 sm:mt-16 border-t border-[rgba(208,207,206,0.16)] bg-[rgba(18,15,10,0.78)] backdrop-blur-xl"
    >
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(151,25,44,0.24),rgba(252,146,13,0.08)_48%,rgba(18,15,10,0.72))] p-5 shadow-[var(--shadow-card)] sm:p-6">
          <div className="absolute inset-0 bg-grid-faint opacity-25" />
          <div className="relative grid gap-6 lg:grid-cols-[18rem_1fr] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/72">
                <ShieldCheck className="h-3.5 w-3.5 text-[var(--bb-orange-100)]" />
                Trust Center
              </div>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/68">
                The public rules for a teen-led network: safety, privacy, brand stewardship, and participation standards.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {legalLinks.map((link) => (
                <Link
                  key={link.url}
                  href={link.url}
                  className="group rounded-xl border border-white/10 bg-black/15 p-3 text-left transition-[background-color,border-color,transform] duration-200 ease-out hover:border-white/22 hover:bg-white/[0.075] active:scale-[0.98]"
                >
                  <span className="flex items-center justify-between gap-2 text-sm font-bold text-white">
                    {link.title}
                    <ChevronRightIcon className="h-4 w-4 text-white/44 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                  </span>
                  <span className="mt-2 block text-xs leading-snug text-white/54">
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between p-6 sm:p-10 max-w-6xl mx-auto">
        <div className="flex flex-col items-start justify-start gap-y-4 max-w-xs">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative grid h-10 w-10 place-items-center rounded-[10px] border border-[rgba(208,207,206,0.16)] bg-[var(--bb-neutral-100)] text-white shadow-[0_8px_24px_rgba(151,25,44,0.24)]">
              <Image
                src="/logo.svg"
                alt="bits&bytes™ logo"
                width={30}
                height={30}
                className="h-7 w-7 object-contain"
                priority
              />
            </div>
            <div>
              <p className="font-display text-base font-semibold text-foreground">
                bits&bytes™
              </p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Teen-led
              </p>
            </div>
          </Link>
          <p className="tracking-tight text-muted-foreground text-sm leading-relaxed">
            India's independent, teen-led builder network. Connecting the country's most ambitious teenage developers and designers to ship software from scratch.
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(208,207,206,0.18)] bg-[rgba(151,25,44,0.16)] px-3 py-1.5 text-xs text-white/72 backdrop-blur-md transition-colors hover:border-[rgba(252,146,13,0.36)] hover:text-white"
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="pt-6 md:pt-0 md:w-1/2">
          <div className="flex flex-col items-start justify-start md:flex-row md:items-start md:justify-end gap-8 lg:gap-16">
            {footerLinks.map((column, columnIndex) => (
              <ul key={columnIndex} className="flex flex-col gap-y-2">
                <li className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-foreground">
                  {column.title}
                </li>
                {column.links.map((link) => (
                  <li
                    key={link.id}
                    className="group inline-flex cursor-pointer items-center justify-start gap-1 text-sm text-muted-foreground"
                  >
                    <Link
                      href={link.url}
                      className="transition-colors hover:text-foreground"
                    >
                      {link.title}
                    </Link>
                    <div className="flex size-4 items-center justify-center border border-border rounded translate-x-0 transform opacity-0 transition-transform transition-colors transition-opacity duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100">
                      <ChevronRightIcon className="h-3 w-3" />
                    </div>
                  </li>
                ))}
              </ul>
            ))}
            <div className="flex flex-col gap-y-2">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-foreground">
                Connect
              </p>
              <a
                href="mailto:hello@gobitsnbytes.org"
                className="text-white/70 hover:text-white transition-colors"
              >
                hello@gobitsnbytes.org
              </a>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                India
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-24 sm:h-32 md:h-48 relative mt-8 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-background z-10 from-40%" />
        <div className="absolute inset-0 mx-4">
          <FlickeringGrid
            text={tablet ? "B&B" : "bits&bytes™"}
            fontSize={tablet ? 50 : 80}
            className="absolute inset-0 h-full w-full"
            squareSize={2}
            gridGap={tablet ? 2 : 3}
            color="var(--brand-pink)"
            maxOpacity={0.22}
            flickerChance={0.08}
          />
          <FlickeringGrid
            text={tablet ? "B&B" : "bits&bytes™"}
            fontSize={tablet ? 50 : 80}
            className="absolute inset-0 h-full w-full"
            squareSize={2}
            gridGap={tablet ? 2 : 3}
            color="var(--brand-coral)"
            maxOpacity={0.32}
            flickerChance={0.12}
          />
          <FlickeringGrid
            text={tablet ? "B&B" : "bits&bytes™"}
            fontSize={tablet ? 50 : 80}
            className="absolute inset-0 h-full w-full"
            squareSize={2}
            gridGap={tablet ? 2 : 3}
            color="var(--brand-amber)"
            maxOpacity={0.18}
            flickerChance={0.06}
          />
        </div>
      </div>
      <div className="border-t border-[rgba(208,207,206,0.12)] py-4 px-4 w-full text-muted-foreground bg-[rgba(18,15,10,0.42)]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs text-center md:text-left">
          <p>© {new Date().getFullYear()} bits&bytes™ by GOBITSNBYTES FOUNDATION.</p>
          <p className="max-w-2xl text-[9px] sm:text-[10px] opacity-80 leading-relaxed text-center md:text-right">
            bits&bytes™ is a youth-led builder network operated by GOBITSNBYTES FOUNDATION, a Section 8 non-profit company in India.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default FlickeringFooter;
