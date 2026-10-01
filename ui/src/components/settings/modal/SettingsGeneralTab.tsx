import React from 'react'
import { VStack } from '@chakra-ui/react'
import type { Locale } from '@/i18n'
import { SettingsThemeSelector } from './SettingsThemeSelector'
import { SettingsLanguageSelector } from './SettingsLanguageSelector'

export interface SettingsGeneralTabProps {
  themeLabel: string
  themeDarkLabel: string
  themeLightLabel: string
  languageLabel: string
  locale: Locale
  onSelectLanguage: (loc: Locale) => void
}

export function SettingsGeneralTab({
  themeLabel,
  themeDarkLabel,
  themeLightLabel,
  languageLabel,
  locale,
  onSelectLanguage,
}: SettingsGeneralTabProps) {
  return (
    <VStack align="stretch" gap="5" py="2">
      <SettingsThemeSelector
        label={themeLabel}
        darkLabel={themeDarkLabel}
        lightLabel={themeLightLabel}
      />
      <SettingsLanguageSelector
        label={languageLabel}
        currentLocale={locale}
        onSelect={onSelectLanguage}
      />
    </VStack>
  )
}
