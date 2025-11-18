'use client'

import { useTheme } from 'next-themes'

export function useIsDarkTheme() {
  const { resolvedTheme } = useTheme()
  return resolvedTheme === 'dark'
}

export function useThemeClasses(lightValue = '', darkValue = '') {
  const isDark = useIsDarkTheme()
  return isDark ? darkValue || lightValue : lightValue || darkValue
}

