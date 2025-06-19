"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps, ThemeProvider as NextThemeProviderType } from "next-themes"
import type { FC } from "react"

interface CustomThemeProviderProps extends ThemeProviderProps {
  children: React.ReactNode
}

/**
 * ThemeProvider component that wraps next-themes with custom enhancements
 */
export const ThemeProvider: FC<CustomThemeProviderProps> = ({ children, ...props }) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
