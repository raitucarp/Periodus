import React from 'react'
import { HStack, Separator } from '@chakra-ui/react'
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
  onSelectLocale: (locale: Locale) => void
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
  onSelectLocale,
  onImport,
  onSettings,
}: HeaderRightSectionProps) {
  return (
    <HStack gap="3" align="center" h="full" style={{ '--wails-draggable': 'no-drag' } as React.CSSProperties}>
      <ThemeToggleButton label={themeToggleLabel} />
      <LanguageButton
        locale={locale}
        label={languageLabel}
        onSelectLocale={onSelectLocale}
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
      <Separator orientation="vertical" h="dividerHeight" borderColor="border.subtle" mx="1" />
      <WindowControls />
    </HStack>
  )
}
