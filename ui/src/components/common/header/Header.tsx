import React from 'react'
import { match } from 'ts-pattern'
import { useTranslation } from '@/i18n'
import { HeaderLayout } from './HeaderLayout'
import { HeaderLeftSection } from './HeaderLeftSection'
import { HeaderRightSection } from './HeaderRightSection'

export interface HeaderProps {
  onImport: () => void
  onOpenSettings: () => void
  isImporting?: boolean
}

export function Header({ onImport, onOpenSettings, isImporting = false }: HeaderProps) {
  const { t, locale, changeLocale } = useTranslation()

  function handleImportClick() {
    onImport()
  }

  function handleSettingsClick() {
    onOpenSettings()
  }

  function handleLanguageToggle() {
    const nextLocale = match(locale)
      .with('id', function toEn() {
        return 'en' as const
      })
      .with('en', function toId() {
        return 'id' as const
      })
      .exhaustive()

    changeLocale(nextLocale)
  }

  const importLabel = match(Boolean(isImporting))
    .with(true, function importing() {
      return t.header.importingButton
    })
    .with(false, function idle() {
      return t.header.importButton
    })
    .exhaustive()

  const renderedHeader = (
    <HeaderLayout>
      <HeaderLeftSection title={t.app.title} subtitle={t.app.subtitle} />
      <HeaderRightSection
        locale={locale}
        languageLabel={t.header.languageLabel}
        themeToggleLabel={t.header.themeToggleLabel}
        isImporting={Boolean(isImporting)}
        importLabel={importLabel}
        settingsLabel={t.header.settingsTitle}
        onLanguageToggle={handleLanguageToggle}
        onImport={handleImportClick}
        onSettings={handleSettingsClick}
      />
    </HeaderLayout>
  )

  return renderedHeader
}
