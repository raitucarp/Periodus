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
    scope,
    readingSettings,
    aiSettings,
    prompts,
    books,
    isSaving,
    isSuccess,
    closeSettings,
    setScope,
    updateReadingSettings,
    updateChatConfig,
    updateEmbeddingConfig,
    updateVisionConfig,
    updateUseGlobal,
    handleSavePrompt,
    handleDeletePrompt,
    handleResetPrompts,
    saveAllSettings,
  } = useSettings()

  const { t, locale, changeLocale } = useTranslation()

  function handleOpenChange({ open }: { open: boolean }) {
    if (!open) {
      closeSettings()
    }
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

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={handleOpenChange}
      placement="center"
    >
      <Portal>
        <Dialog.Backdrop bg="glass.backdrop" backdropFilter="blur(sm)" />
        <Dialog.Positioner>
          <SettingsDialogContent
            t={t}
            locale={locale}
            books={books}
            scope={scope}
            readingSettings={readingSettings}
            aiSettings={aiSettings}
            prompts={prompts}
            isSaving={isSaving}
            successElement={successElement}
            onSelectLanguage={handleSelectLanguage}
            onScopeChange={setScope}
            onUseGlobalChange={updateUseGlobal}
            onUpdateReadingSettings={updateReadingSettings}
            onUpdateChatConfig={updateChatConfig}
            onUpdateEmbeddingConfig={updateEmbeddingConfig}
            onUpdateVisionConfig={updateVisionConfig}
            onSavePrompt={handleSavePrompt}
            onDeletePrompt={handleDeletePrompt}
            onResetPrompts={handleResetPrompts}
            onCancel={closeSettings}
            onSave={saveAllSettings}
          />
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
