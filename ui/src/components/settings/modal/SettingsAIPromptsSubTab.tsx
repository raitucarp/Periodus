import React, { useState, useMemo } from 'react'
import { VStack, Text } from '@chakra-ui/react'
import {
  PromptCard,
  PromptFormModal,
  PromptListToolbar,
} from '@/components/settings/prompts'
import type { Prompt } from '@/lib/types'

export interface SettingsAIPromptsSubTabProps {
  prompts: Prompt[]
  currentScope: string
  onSavePrompt: (prompt: Prompt) => Promise<void>
  onDeletePrompt: (id: string) => Promise<void>
  onResetPrompts: () => Promise<void>
}

export function SettingsAIPromptsSubTab({
  prompts,
  currentScope: _currentScope,
  onSavePrompt,
  onDeletePrompt,
  onResetPrompts,
}: SettingsAIPromptsSubTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [isResetting, setIsResetting] = useState(false)

  const filteredPrompts = useMemo(
    function computeFilteredPrompts() {
      const q = searchQuery.toLowerCase().trim()
      if (!q) return prompts
      return prompts.filter(function matchQuery(p) {
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.user_prompt.toLowerCase().includes(q)
        )
      })
    },
    [prompts, searchQuery]
  )

  const enabledCount = useMemo(
    function computeEnabledCount() {
      return prompts.filter((p) => p.is_enabled === 1).length
    },
    [prompts]
  )

  function handleAddNew() {
    setSelectedPrompt(null)
    setIsModalOpen(true)
  }

  function handleEdit(p: Prompt) {
    setSelectedPrompt(p)
    setIsModalOpen(true)
  }

  function handleCloseModal() {
    setIsModalOpen(false)
    setSelectedPrompt(null)
  }

  async function handleToggleEnabled(prompt: Prompt, enabled: boolean) {
    await onSavePrompt({
      ...prompt,
      is_enabled: enabled ? 1 : 0,
    })
  }

  async function handleResetDefaults() {
    setIsResetting(true)
    try {
      await onResetPrompts()
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <VStack align="stretch" gap="4">
      <PromptListToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddNew={handleAddNew}
        onResetDefaults={handleResetDefaults}
        totalCount={prompts.length}
        enabledCount={enabledCount}
        isResetting={isResetting}
      />

      <VStack align="stretch" gap="2.5">
        {filteredPrompts.length === 0 ? (
          <Text textStyle="xs" color="fg.muted" textAlign="center" py="6">
            No prompts found matching your search.
          </Text>
        ) : (
          filteredPrompts.map(function renderPromptCard(p) {
            return (
              <PromptCard
                key={p.id}
                prompt={p}
                onEdit={handleEdit}
                onDelete={onDeletePrompt}
                onToggleEnabled={handleToggleEnabled}
              />
            )
          })
        )}
      </VStack>

      {isModalOpen && (
        <PromptFormModal
          isOpen={isModalOpen}
          promptToEdit={selectedPrompt}
          onClose={handleCloseModal}
          onSave={onSavePrompt}
        />
      )}
    </VStack>
  )
}
