import React from 'react'
import {
  Dialog,
  CloseButton,
  HStack,
  Text,
  Square,
} from '@chakra-ui/react'
import { Key } from 'lucide-react'
import type { Locale } from '@/i18n'
import { SettingsLanguageSelector } from './SettingsLanguageSelector'
import { SettingsThemeSelector } from './SettingsThemeSelector'
import { SettingsApiKeyField } from './SettingsApiKeyField'
import { SettingsModalFooter } from './SettingsModalFooter'

export interface SettingsDialogContentProps {
  title: string
  description: string
  languageLabel: string
  themeLabel: string
  themeDarkLabel: string
  themeLightLabel: string
  apiKeyLabel: string
  apiKeyPlaceholder: string
  apiKeyValue: string
  cancelLabel: string
  saveLabel: string
  savingLabel: string
  isSaving: boolean
  locale: Locale
  successElement: React.ReactNode
  onSelectLanguage: (loc: Locale) => void
  onApiKeyChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onCancel: () => void
  onSave: () => void
}

export function SettingsDialogContent({
  title,
  description,
  languageLabel,
  themeLabel,
  themeDarkLabel,
  themeLightLabel,
  apiKeyLabel,
  apiKeyPlaceholder,
  apiKeyValue,
  cancelLabel,
  saveLabel,
  savingLabel,
  isSaving,
  locale,
  successElement,
  onSelectLanguage,
  onApiKeyChange,
  onCancel,
  onSave,
}: SettingsDialogContentProps) {
  return (
    <Dialog.Content
      bg="bg.surface"
      borderColor="border.subtle"
      borderWidth="0.0625rem"
      rounded="2xl"
      p="1.75rem"
      maxW="28.75rem"
    >
      <Dialog.Header pb="1rem">
        <HStack gap="0.75rem">
          <Square
            size="2.25rem"
            rounded="lg"
            bg="ruby.subtle"
            color="ruby.fg"
          >
            <Key size="1.125rem" />
          </Square>
          <Dialog.Title fontFamily="heading" color="fg" fontSize="1.125rem" fontWeight="bold">
            {title}
          </Dialog.Title>
        </HStack>
      </Dialog.Header>

      <Dialog.Body>
        <Text textStyle="sm" color="fg.muted" lineHeight="tall" mb="1.25rem">
          {description}
        </Text>

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

        <SettingsApiKeyField
          label={apiKeyLabel}
          placeholder={apiKeyPlaceholder}
          value={apiKeyValue}
          onChange={onApiKeyChange}
        />

        {successElement}
      </Dialog.Body>

      <Dialog.Footer pt="1rem">
        <SettingsModalFooter
          cancelLabel={cancelLabel}
          saveLabel={saveLabel}
          savingLabel={savingLabel}
          isSaving={isSaving}
          onCancel={onCancel}
          onSave={onSave}
        />
      </Dialog.Footer>

      <Dialog.CloseTrigger asChild>
        <CloseButton size="sm" onClick={onCancel} />
      </Dialog.CloseTrigger>
    </Dialog.Content>
  )
}
