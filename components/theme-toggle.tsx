'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { cn } from '@/lib/utils'

type ThemeToggleProps = {
  className?: string
  size?: 'sm' | 'md'
}

const sizeClasses: Record<Required<ThemeToggleProps>['size'], string> = {
  sm: 'h-9 w-9',
  md: 'h-11 w-11',
}

export function ThemeToggle({ className, size = 'md' }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === 'dark'
  const srLabel = mounted ? `Use ${isDark ? 'light' : 'dark'} theme` : 'Toggle color theme'

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      className={cn(
        'group relative inline-flex items-center justify-center rounded-full border border-white/20 bg-[var(--brand-pink)] p-0.5 text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-white/10',
        sizeClasses[size],
        className,
      )}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      <span className="sr-only">{srLabel}</span>
      <span
      className={cn(
          'absolute inset-px rounded-full bg-background/60 backdrop-blur-xl transition-colors duration-300 dark:bg-background/40',
        )}
      />
      <Sun
        aria-hidden="true"
        className={cn(
          'relative h-5 w-5 rotate-0 scale-100 opacity-100 transition-all duration-300 group-hover:text-accent-foreground',
          mounted && isDark && '-rotate-90 scale-0 opacity-0',
        )}
      />
      <Moon
        aria-hidden="true"
        className={cn(
          'absolute h-5 w-5 rotate-90 scale-0 opacity-0 transition-all duration-300 group-hover:text-accent-foreground',
          mounted && isDark && 'rotate-0 scale-100 opacity-100',
        )}
      />
    </button>
  )
}

export default ThemeToggle

