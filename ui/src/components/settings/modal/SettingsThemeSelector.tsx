import React from 'react'
import { HStack, VStack, Text, Button } from '@chakra-ui/react'
import { Moon, Sun } from 'lucide-react'
import { useColorMode } from '@/components/ui/color-mode'

export interface SettingsThemeSelectorProps {
  label: string
  darkLabel: string
  lightLabel: string
}

export function SettingsThemeSelector({ label, darkLabel, lightLabel }: SettingsThemeSelectorProps) {
  const { colorMode, setColorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const isLight = colorMode === 'light'

  function handleChooseLight() {
    setColorMode('light')
  }

  function handleChooseDark() {
    setColorMode('dark')
  }

  return (
    <VStack align="stretch" gap="2" mb="5">
      <Text textStyle="modal.fieldLabel">
        {label}
      </Text>
      <HStack gap="3">
        <Button
          size="sm"
          colorPalette="ruby"
          variant={isLight ? 'solid' : 'outline'}
          onClick={handleChooseLight}
          flex="1"
        >
          <Sun size={14} />
          {lightLabel}
        </Button>
        <Button
          size="sm"
          colorPalette="ruby"
          variant={isDark ? 'solid' : 'outline'}
          onClick={handleChooseDark}
          flex="1"
        >
          <Moon size={14} />
          {darkLabel}
        </Button>
      </HStack>
    </VStack>
  )
}
