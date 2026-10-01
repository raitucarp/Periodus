import React from 'react'
import { Dialog, Portal } from '@chakra-ui/react'
import { match } from 'ts-pattern'
import { useSettings } from '@/hooks/useSettings'
import { useTranslation, type Locale } from '@/i18n'
import { SettingsSuccessBanner } from './SettingsSuccessBanner'
import { SettingsDialogContent } from './SettingsDialogContent'

export function SettingsModal() {
  const {
    isOpen,
    apiKey,
    isSaving,
    isSuccess,
    closeSettings,
    updateApiKeyInput,
    saveApiKey,
  } = useSettings()

  const { t, locale, changeLocale } = useTranslation()

  function handleOpenChange({ open }: { open: boolean }) {
    if (!open) {
      closeSettings()
    }
  }

  function handleInputChange({ target: { value } }: React.ChangeEvent<HTMLInputElement>) {
    updateApiKeyInput(value)
  }

  function handleSaveClick() {
    saveApiKey()
  }

  function handleCancelClick() {
    closeSettings()
  }

  function handleSelectLanguage(newLocale: Locale) {
    changeLocale(newLocale)
  }

  const successElement = match(isSuccess)
    .with(true, function renderSuccess() {
      return <SettingsSuccessBanner message={t.settings.savedSuccess} />
    })
    .with(false, function noSuccess() {
      return null
    })
    .exhaustive()

  const renderedDialog = (
    <Dialog.Root
      open={isOpen}
      onOpenChange={handleOpenChange}
      placement="center"
    >
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.700" backdropFilter="blur(0.25rem)" />
        <Dialog.Positioner>
          <SettingsDialogContent
            title={t.settings.title}
            description={t.settings.description}
            themeLabel={t.settings.themeSelection}
            themeDarkLabel={t.settings.themeDark}
            themeLightLabel={t.settings.themeLight}
            languageLabel={t.settings.languageSelection}
            apiKeyLabel={t.settings.apiKeyLabel}
            apiKeyPlaceholder={t.settings.apiKeyPlaceholder}
            apiKeyValue={apiKey}
            cancelLabel={t.settings.cancelBtn}
            saveLabel={t.settings.saveBtn}
            savingLabel={t.settings.savingBtn}
            isSaving={isSaving}
            locale={locale}
            successElement={successElement}
            onSelectLanguage={handleSelectLanguage}
            onApiKeyChange={handleInputChange}
            onCancel={handleCancelClick}
            onSave={handleSaveClick}
          />
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )

  return renderedDialog
}
