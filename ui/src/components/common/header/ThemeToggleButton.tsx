import React from 'react'
import { IconButton } from '@chakra-ui/react'
import { Sun, Moon } from 'lucide-react'
import { useColorMode } from '@/components/ui/color-mode'
import { match } from 'ts-pattern'

export interface ThemeToggleButtonProps {
  label: string
}

export function ThemeToggleButton({ label }: ThemeToggleButtonProps) {
  const { colorMode, toggleColorMode } = useColorMode()

  function handleToggleClick() {
    toggleColorMode()
  }

  const iconElement = match(colorMode)
    .with('dark', function renderSun() {
      return <Sun size="1rem" />
    })
    .with('light', function renderMoon() {
      return <Moon size="1rem" />
    })
    .exhaustive()

  return (
    <IconButton
      aria-label={label}
      title={label}
      colorPalette="gray"
      variant="outline"
      size="sm"
      onClick={handleToggleClick}
    >
      {iconElement}
    </IconButton>
  )
}
