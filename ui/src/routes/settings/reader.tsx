import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { SettingsReaderTab } from '@/components/settings/modal/SettingsReaderTab'
import {
  useReadingSettingsQuery,
  useSaveReadingSettingsMutation,
} from '@/queries'
import { useTranslation } from '@/i18n'
import type { ReadingSettings } from '@/lib/types'

export const Route = createFileRoute('/settings/reader')({
  component: SettingsReaderRoute,
})

function SettingsReaderRoute() {
  const { t } = useTranslation()
  const { data: readingSettings } = useReadingSettingsQuery('global', '')
  const { mutate: saveReadingSettings } = useSaveReadingSettingsMutation()

  const currentSettings: ReadingSettings = readingSettings || {
    scope: 'global',
    fontFamily: 'Literata',
    fontSize: 18,
    lineHeight: 'reading',
    maxWidth: '800px',
    textAlign: 'left',
  }

  function handleUpdateSettings(updates: Partial<ReadingSettings>) {
    saveReadingSettings({
      ...currentSettings,
      ...updates,
    })
  }

  return (
    <SettingsReaderTab
      settings={currentSettings}
      onChange={handleUpdateSettings}
      fontFamilyLabel={t.settings.fontFamilyLabel}
      fontSizeLabel={t.settings.fontSizeLabel}
      lineHeightLabel={t.settings.lineHeightLabel}
      maxWidthLabel={t.settings.maxWidthLabel}
      textAlignLabel={t.settings.textAlignLabel}
      previewTitle={t.settings.previewTitle}
      previewText={t.settings.previewText}
    />
  )
}
