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
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import logo from "@public/logo.svg";

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

const socialLinks = [
  {
    href: "https://www.linkedin.com/company/gobitsbytes",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: "https://discord.gg/rjqPfwKKTE",
    label: "Discord",
    icon: MessageCircle,
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

export function FlickeringFooter() {
  const tablet = useMediaQuery("(max-width: 1024px)");

  return (
    <footer
      id="footer"
      className="w-full pb-0 mt-12 sm:mt-16 border-t border-white/20 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between p-6 sm:p-10 max-w-6xl mx-auto">
        <div className="flex flex-col items-start justify-start gap-y-4 max-w-xs">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-black text-white shadow-[0_8px_30px_rgba(228,90,146,0.4)]">
              <Image
                src="/logo.svg"
                alt="bits&bytes™ logo"
                width={28}
                height={28}
                className="h-6 w-6 object-contain"
                priority
              />
              <div className="absolute inset-0 rounded-xl border-2 border-[var(--brand-pink)]" />
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
          <p className="tracking-tight text-muted-foreground text-sm">
            Innovate. Collaborate. Hack. Born in India, spreading across
            India. No adults in the room.
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/50 px-3 py-1.5 text-xs backdrop-blur-md transition-colors hover:border-white/50 hover:text-foreground dark:bg-white/10"
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
                Based in Prayagraj, India
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
      <div className="border-t border-white/10 py-4 px-4 w-full text-muted-foreground bg-white/30 dark:bg-black/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs text-center md:text-left">
          <p>© {new Date().getFullYear()} bits&bytes™. Built with ❤️.</p>
          <p className="max-w-2xl text-[9px] sm:text-[10px] opacity-80 leading-relaxed text-center md:text-right">
            bits&bytes™ is run by GOBITSNBYTES FOUNDATION, a non-profit company incorporated under Section 8 of the Companies Act, 2013 (Uttar Pradesh, India). CIN: U85500UP2026NPL248652. Registered Address: 265/1 PATRAKAR COLONY, PRAYAGRAJ ASHOK NAGER, Allahabad, Uttar Pradesh - 211001.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default FlickeringFooter;
