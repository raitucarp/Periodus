import React from 'react'
import { HStack, Box } from '@chakra-ui/react'
import type { Locale } from '@/i18n'
import { LanguageButton } from './LanguageButton'
import { ThemeToggleButton } from './ThemeToggleButton'
import { ImportButton } from './ImportButton'
import { SettingsButton } from './SettingsButton'
import { WindowControls } from '@/components/common/window'

export interface HeaderRightSectionProps {
  locale: Locale
  languageLabel: string
  themeToggleLabel: string
  isImporting: boolean
  importLabel: string
  settingsLabel: string
  onLanguageToggle: () => void
  onImport: () => void
  onSettings: () => void
}

export function HeaderRightSection({
  locale,
  languageLabel,
  themeToggleLabel,
  isImporting,
  importLabel,
  settingsLabel,
  onLanguageToggle,
  onImport,
  onSettings,
}: HeaderRightSectionProps) {
  return (
    <HStack gap="0.75rem" align="center" style={{ '--wails-draggable': 'no-drag' } as React.CSSProperties}>
      <ThemeToggleButton label={themeToggleLabel} />
      <LanguageButton
        locale={locale}
        label={languageLabel}
        onToggle={onLanguageToggle}
      />
      <ImportButton
        isImporting={isImporting}
        label={importLabel}
        onClick={onImport}
      />
      <SettingsButton
        label={settingsLabel}
        onClick={onSettings}
      />
      <Box w="0.0625rem" h="1.25rem" bg="border.subtle" mx="0.25rem" />
      <WindowControls />
    </HStack>
  )
}
