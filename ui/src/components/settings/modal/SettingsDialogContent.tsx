import React from 'react'
import {
  Dialog,
  CloseButton,
  HStack,
  Text,
  Square,
  Tabs,
  Box,
} from '@chakra-ui/react'
import { Sliders, BookOpen, Sparkles, SlidersHorizontal } from 'lucide-react'
import type { Locale, TranslationSchema } from '@/i18n'
import type { AISettings, Book, Prompt, ReadingSettings } from '@/lib/types'
import { SettingsGeneralTab } from './SettingsGeneralTab'
import { SettingsReaderTab } from './SettingsReaderTab'
import { SettingsAITab } from './SettingsAITab'
import { SettingsModalFooter } from './SettingsModalFooter'

export interface SettingsDialogContentProps {
  t: TranslationSchema
  locale: Locale
  books: Book[]
  scope: string
  readingSettings: ReadingSettings
  aiSettings: AISettings
  prompts: Prompt[]
  isSaving: boolean
  successElement: React.ReactNode
  onSelectLanguage: (loc: Locale) => void
  onScopeChange: (scope: string) => void
  onUseGlobalChange: (useGlobal: boolean) => void
  onUpdateReadingSettings: (updated: Partial<ReadingSettings>) => void
  onUpdateChatConfig: (chat: Partial<AISettings['chat']>) => void
  onUpdateEmbeddingConfig: (emb: Partial<AISettings['embedding']>) => void
  onUpdateVisionConfig: (vision: Partial<AISettings['vision']>) => void
  onSavePrompt: (prompt: Prompt) => Promise<void>
  onDeletePrompt: (id: string) => Promise<void>
  onResetPrompts: () => Promise<void>
  onCancel: () => void
  onSave: () => void
}

export function SettingsDialogContent({
  t,
  locale,
  books,
  scope,
  readingSettings,
  aiSettings,
  prompts,
  isSaving,
  successElement,
  onSelectLanguage,
  onScopeChange,
  onUseGlobalChange,
  onUpdateReadingSettings,
  onUpdateChatConfig,
  onUpdateEmbeddingConfig,
  onUpdateVisionConfig,
  onSavePrompt,
  onDeletePrompt,
  onResetPrompts,
  onCancel,
  onSave,
}: SettingsDialogContentProps) {
  return (
    <Dialog.Content
      bg="bg.surface"
      borderColor="border.subtle"
      borderWidth="0.0625rem"
      rounded="2xl"
      p="6"
      maxW="settingsModalWide"
      w="full"
      boxShadow="2xl"
    >
      <Dialog.Header pb="3">
        <HStack justify="space-between" align="center">
          <HStack gap="3">
            <Square
              size="brandLogo"
              rounded="lg"
              bg="ruby.subtle"
              color="ruby.fg"
            >
              <SlidersHorizontal size={18} />
            </Square>
            <Box>
              <Dialog.Title textStyle="modal.title">
                {t.settings.title}
              </Dialog.Title>
              <Text textStyle="modal.description">
                {t.settings.description}
              </Text>
            </Box>
          </HStack>
        </HStack>
      </Dialog.Header>

      <Dialog.Body py="2">
        <Tabs.Root defaultValue="general" variant="line" size="md">
          <Tabs.List borderBottomWidth="0.0625rem" borderColor="border.subtle" mb="4" gap="4">
            <Tabs.Trigger value="general" gap="2" pb="2">
              <Sliders size={15} />
              {t.settings.tabGeneral}
            </Tabs.Trigger>
            <Tabs.Trigger value="reader" gap="2" pb="2">
              <BookOpen size={15} />
              {t.settings.tabReader}
            </Tabs.Trigger>
            <Tabs.Trigger value="ai" gap="2" pb="2">
              <Sparkles size={15} />
              {t.settings.tabAI}
            </Tabs.Trigger>
          </Tabs.List>

          {/* General Tab */}
          <Tabs.Content value="general" py="1">
            <SettingsGeneralTab
              themeLabel={t.settings.themeSelection}
              themeDarkLabel={t.settings.themeDark}
              themeLightLabel={t.settings.themeLight}
              languageLabel={t.settings.languageSelection}
              locale={locale}
              onSelectLanguage={onSelectLanguage}
            />
          </Tabs.Content>

          {/* Reader Tab */}
          <Tabs.Content value="reader" py="1">
            <SettingsReaderTab
              settings={readingSettings}
              onChange={onUpdateReadingSettings}
              fontFamilyLabel={t.settings.fontFamilyLabel}
              fontSizeLabel={t.settings.fontSizeLabel}
              lineHeightLabel={t.settings.lineHeightLabel}
              maxWidthLabel={t.settings.maxWidthLabel}
              textAlignLabel={t.settings.textAlignLabel}
              previewTitle={t.settings.previewTitle}
              previewText={t.settings.previewText}
            />
          </Tabs.Content>

          {/* AI Tab */}
          <Tabs.Content value="ai" py="1">
            <SettingsAITab
              books={books}
              currentScope={scope}
              aiSettings={aiSettings}
              prompts={prompts}
              onScopeChange={onScopeChange}
              onUseGlobalChange={onUseGlobalChange}
              onUpdateChatConfig={onUpdateChatConfig}
              onUpdateEmbeddingConfig={onUpdateEmbeddingConfig}
              onUpdateVisionConfig={onUpdateVisionConfig}
              onSavePrompt={onSavePrompt}
              onDeletePrompt={onDeletePrompt}
              onResetPrompts={onResetPrompts}
              scopeLabel={t.settings.scopeLabel}
              scopeGlobalLabel={t.settings.scopeGlobal}
              useGlobalConfigLabel={t.settings.useGlobalConfig}
              aiSubTabChatLabel={t.settings.aiSubTabChat}
              aiSubTabEmbeddingLabel={t.settings.aiSubTabEmbedding}
              aiSubTabVisionLabel={t.settings.aiSubTabVision}
              aiSubTabPromptsLabel={t.settings.aiSubTabPrompts}
              providerLabel={t.settings.providerLabel}
              modelLabel={t.settings.modelLabel}
              apiKeyLabel={t.settings.apiKeyLabel}
              baseUrlLabel={t.settings.baseUrlLabel}
              tempLabel={t.settings.tempLabel}
              maxTokensLabel={t.settings.maxTokensLabel}
              dimensionsLabel={t.settings.dimensionsLabel}
            />
          </Tabs.Content>
        </Tabs.Root>

        {successElement}
      </Dialog.Body>

      <Dialog.Footer pt="3">
        <SettingsModalFooter
          cancelLabel={t.settings.cancelBtn}
          saveLabel={t.settings.saveBtn}
          savingLabel={t.settings.savingBtn}
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
