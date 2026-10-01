import type { ThemeProviderProps } from "next-themes"
import { ThemeProvider, useTheme } from "next-themes"
import React from "react"

export interface ColorModeProviderProps extends ThemeProviderProps {}

export function ColorModeProvider({ children, ...restProps }: ColorModeProviderProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange {...restProps}>
      {children}
    </ThemeProvider>
  )
}

export type ColorMode = "light" | "dark"

export interface UseColorModeReturn {
  colorMode: ColorMode
  setColorMode: (colorMode: ColorMode) => void
  toggleColorMode: () => void
}

export function useColorMode(): UseColorModeReturn {
  const { resolvedTheme, setTheme } = useTheme()

  function toggleColorMode() {
    setTheme(resolvedTheme === "light" ? "dark" : "light")
  }

  function handleSetColorMode(mode: ColorMode) {
    setTheme(mode)
  }

  return {
    colorMode: (resolvedTheme === "light" ? "light" : "dark") as ColorMode,
    setColorMode: handleSetColorMode,
    toggleColorMode,
  }
}

export function useColorModeValue<T>(light: T, dark: T): T {
  const { colorMode } = useColorMode()
  if (colorMode === "light") {
    return light
  }
  return dark
}
