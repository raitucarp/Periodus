import React from 'react'
import {
  Box,
  Tabs,
  VStack,
} from '@chakra-ui/react'
import { MessageSquare, Binary, Eye, Sparkles } from 'lucide-react'
import type { AISettings, Prompt, Book } from '@/lib/types'
import { SettingsAIScopeSelector } from './SettingsAIScopeSelector'
import { SettingsAIChatSubTab } from './SettingsAIChatSubTab'
import { SettingsAIEmbeddingSubTab } from './SettingsAIEmbeddingSubTab'
import { SettingsAIVisionSubTab } from './SettingsAIVisionSubTab'
import { SettingsAIPromptsSubTab } from './SettingsAIPromptsSubTab'

export interface SettingsAITabProps {
  books: Book[]
  currentScope: string
  aiSettings: AISettings
  prompts: Prompt[]
  onScopeChange: (scope: string) => void
  onUseGlobalChange: (useGlobal: boolean) => void
  onUpdateChatConfig: (chat: Partial<AISettings['chat']>) => void
  onUpdateEmbeddingConfig: (emb: Partial<AISettings['embedding']>) => void
  onUpdateVisionConfig: (vision: Partial<AISettings['vision']>) => void
  onSavePrompt: (prompt: Prompt) => Promise<void>
  onDeletePrompt: (id: string) => Promise<void>
  onResetPrompts: () => Promise<void>
  scopeLabel: string
  scopeGlobalLabel: string
  useGlobalConfigLabel: string
  aiSubTabChatLabel: string
  aiSubTabEmbeddingLabel: string
  aiSubTabVisionLabel: string
  aiSubTabPromptsLabel: string
  providerLabel: string
  modelLabel: string
  apiKeyLabel: string
  baseUrlLabel: string
  tempLabel: string
  maxTokensLabel: string
  dimensionsLabel: string
}

export function SettingsAITab({
  books,
  currentScope,
  aiSettings,
  prompts,
  onScopeChange,
  onUseGlobalChange,
  onUpdateChatConfig,
  onUpdateEmbeddingConfig,
  onUpdateVisionConfig,
  onSavePrompt,
  onDeletePrompt,
  onResetPrompts,
  scopeLabel,
  scopeGlobalLabel,
  useGlobalConfigLabel,
  aiSubTabChatLabel,
  aiSubTabEmbeddingLabel,
  aiSubTabVisionLabel,
  aiSubTabPromptsLabel,
  providerLabel,
  modelLabel,
  apiKeyLabel,
  baseUrlLabel,
  tempLabel,
  maxTokensLabel,
  dimensionsLabel,
}: SettingsAITabProps) {
  const isBookScope = currentScope !== '' && currentScope !== 'global'
  const isInherited = isBookScope && aiSettings.useGlobal

  return (
    <VStack align="stretch" gap="3" py="2">
      {/* Scope Selector */}
      <SettingsAIScopeSelector
        books={books}
        currentScope={currentScope}
        useGlobal={aiSettings.useGlobal}
        onScopeChange={onScopeChange}
        onUseGlobalChange={onUseGlobalChange}
        scopeLabel={scopeLabel}
        scopeGlobalLabel={scopeGlobalLabel}
        useGlobalConfigLabel={useGlobalConfigLabel}
      />

      {/* Horizontal Sub-tabs for AI */}
      <Tabs.Root defaultValue="chat" orientation="horizontal" variant="subtle" size="sm">
        <Tabs.List w="full" borderBottomWidth="1px" borderColor="border.subtle" pb="2" gap="2">
          <Tabs.Trigger value="chat" gap="2" rounded="lg" px="3.5" py="2">
            <MessageSquare size={14} />
            {aiSubTabChatLabel}
          </Tabs.Trigger>
          <Tabs.Trigger value="embedding" gap="2" rounded="lg" px="3.5" py="2">
            <Binary size={14} />
            {aiSubTabEmbeddingLabel}
          </Tabs.Trigger>
          <Tabs.Trigger value="vision" gap="2" rounded="lg" px="3.5" py="2">
            <Eye size={14} />
            {aiSubTabVisionLabel}
          </Tabs.Trigger>
          <Tabs.Trigger value="prompts" gap="2" rounded="lg" px="3.5" py="2">
            <Sparkles size={14} />
            {aiSubTabPromptsLabel}
          </Tabs.Trigger>
        </Tabs.List>

        <Box w="full" pt="5">
          <Tabs.Content value="chat" py="0">
            <SettingsAIChatSubTab
              config={aiSettings.chat}
              onChange={onUpdateChatConfig}
              disabled={isInherited}
              providerLabel={providerLabel}
              modelLabel={modelLabel}
              apiKeyLabel={apiKeyLabel}
              baseUrlLabel={baseUrlLabel}
              tempLabel={tempLabel}
              maxTokensLabel={maxTokensLabel}
            />
          </Tabs.Content>

          <Tabs.Content value="embedding" py="0">
            <SettingsAIEmbeddingSubTab
              config={aiSettings.embedding}
              onChange={onUpdateEmbeddingConfig}
              disabled={isInherited}
              providerLabel={providerLabel}
              modelLabel={modelLabel}
              apiKeyLabel={apiKeyLabel}
              baseUrlLabel={baseUrlLabel}
              dimensionsLabel={dimensionsLabel}
            />
          </Tabs.Content>

          <Tabs.Content value="vision" py="0">
            <SettingsAIVisionSubTab
              config={aiSettings.vision}
              onChange={onUpdateVisionConfig}
              disabled={isInherited}
              providerLabel={providerLabel}
              modelLabel={modelLabel}
              apiKeyLabel={apiKeyLabel}
              baseUrlLabel={baseUrlLabel}
            />
          </Tabs.Content>

          <Tabs.Content value="prompts" py="0">
            <SettingsAIPromptsSubTab
              prompts={prompts}
              currentScope={currentScope}
              onSavePrompt={onSavePrompt}
              onDeletePrompt={onDeletePrompt}
              onResetPrompts={onResetPrompts}
            />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </VStack>
  )
}
