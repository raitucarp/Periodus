import React, { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { SettingsAITab } from '@/components/settings/modal/SettingsAITab'
import {
  useAISettingsQuery,
  useSaveAISettingsMutation,
  usePromptsQuery,
  useSavePromptMutation,
  useDeletePromptMutation,
  useResetPromptsMutation,
  useBooksQuery,
} from '@/queries'
import { useTranslation } from '@/i18n'
import type { AISettings, Prompt } from '@/lib/types'

export const Route = createFileRoute('/settings/ai')({
  component: SettingsAIRoute,
})

function SettingsAIRoute() {
  const { t } = useTranslation()
  const [scope, setScope] = useState<string>('global')

  const { data: booksData } = useBooksQuery()
  const books = booksData || []

  const targetBookId = scope === 'global' ? '' : scope
  const { data: aiSettingsData } = useAISettingsQuery(scope, targetBookId)
  const { mutate: saveAISettings } = useSaveAISettingsMutation()

  const { data: promptsData } = usePromptsQuery(targetBookId)
  const prompts = promptsData || []

  const { mutateAsync: savePrompt } = useSavePromptMutation()
  const { mutateAsync: deletePrompt } = useDeletePromptMutation()
  const { mutateAsync: resetPrompts } = useResetPromptsMutation()

  const defaultAISettings: AISettings = {
    scope: scope || 'global',
    useGlobal: true,
    chat: {
      provider: 'gemini',
      model: 'gemini-2.5-flash',
      apiKey: '',
      baseUrl: '',
      temperature: 0.7,
      maxTokens: 2048,
    },
    embedding: {
      provider: 'gemini',
      model: 'text-embedding-004',
      apiKey: '',
      baseUrl: '',
      dimensions: 768,
    },
    vision: {
      provider: 'gemini',
      model: 'gemini-2.5-flash',
      apiKey: '',
      baseUrl: '',
    },
  }

  const aiSettings = aiSettingsData || defaultAISettings

  function handleScopeChange(newScope: string) {
    setScope(newScope)
  }

  function handleUseGlobalChange(useGlobal: boolean) {
    saveAISettings({
      ...aiSettings,
      useGlobal,
    })
  }

  function handleUpdateChatConfig(chatUpdates: Partial<AISettings['chat']>) {
    saveAISettings({
      ...aiSettings,
      chat: { ...aiSettings.chat, ...chatUpdates },
    })
  }

  function handleUpdateEmbeddingConfig(embUpdates: Partial<AISettings['embedding']>) {
    saveAISettings({
      ...aiSettings,
      embedding: { ...aiSettings.embedding, ...embUpdates },
    })
  }

  function handleUpdateVisionConfig(visionUpdates: Partial<AISettings['vision']>) {
    saveAISettings({
      ...aiSettings,
      vision: { ...aiSettings.vision, ...visionUpdates },
    })
  }

  async function handleSavePrompt(prompt: Prompt) {
    await savePrompt(prompt)
  }

  async function handleDeletePrompt(id: string) {
    await deletePrompt(id)
  }

  async function handleResetPrompts() {
    await resetPrompts()
  }

  return (
    <SettingsAITab
      books={books}
      currentScope={scope}
      aiSettings={aiSettings}
      prompts={prompts}
      onScopeChange={handleScopeChange}
      onUseGlobalChange={handleUseGlobalChange}
      onUpdateChatConfig={handleUpdateChatConfig}
      onUpdateEmbeddingConfig={handleUpdateEmbeddingConfig}
      onUpdateVisionConfig={handleUpdateVisionConfig}
      onSavePrompt={handleSavePrompt}
      onDeletePrompt={handleDeletePrompt}
      onResetPrompts={handleResetPrompts}
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
  )
}
