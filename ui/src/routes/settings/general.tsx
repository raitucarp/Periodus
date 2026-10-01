import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { SettingsGeneralTab } from '@/components/settings/modal/SettingsGeneralTab'
import { useTranslation } from '@/i18n'

export const Route = createFileRoute('/settings/general')({
  component: SettingsGeneralRoute,
})

function SettingsGeneralRoute() {
  const { t, locale, changeLocale } = useTranslation()

  return (
    <SettingsGeneralTab
      themeLabel={t.settings.themeSelection}
      themeDarkLabel={t.settings.themeDark}
      themeLightLabel={t.settings.themeLight}
      languageLabel={t.settings.languageSelection}
      locale={locale}
      onSelectLanguage={changeLocale}
    />
  )
}
