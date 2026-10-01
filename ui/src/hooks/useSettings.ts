import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import {
  isSettingsOpenAtom,
  settingsScopeAtom,
  readingSettingsAtom,
  aiSettingsAtom,
  promptsListAtom,
  booksAtom,
  selectedBookIdAtom,
} from '@/state/atoms'
import { SettingsService } from '@/lib/bindings'
import type { Prompt, ReadingSettings, AISettings } from '@/lib/types'

export function useSettings() {
  const [isOpen, setIsOpen] = useAtom(isSettingsOpenAtom)
  const [scope, setScope] = useAtom(settingsScopeAtom)
  const [readingSettings, setReadingSettings] = useAtom(readingSettingsAtom)
  const [aiSettings, setAiSettings] = useAtom(aiSettingsAtom)
  const [prompts, setPrompts] = useAtom(promptsListAtom)
  const [books] = useAtom(booksAtom)
  const [selectedBookId] = useAtom(selectedBookIdAtom)

  const [isSaving, setIsSaving] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Load settings on open or when scope changes
  useEffect(function syncSettings() {
    let isCancelled = false

    async function loadData() {
      try {
        const [readCfg, aiCfg, promptList] = await Promise.all([
          SettingsService.getReadingSettings(scope === 'global' ? '' : scope),
          SettingsService.getAISettings(scope === 'global' ? '' : scope),
          SettingsService.getPrompts(scope === 'global' ? '' : scope),
        ])
        if (!isCancelled) {
          if (readCfg) setReadingSettings(readCfg)
          if (aiCfg) setAiSettings(aiCfg)
          if (promptList) setPrompts(promptList)
        }
      } catch (err) {
        console.error('Failed to load settings:', err)
      }
    }

    if (isOpen) {
      loadData()
    }

    return () => {
      isCancelled = true
    }
  }, [isOpen, scope])

  // Initial load for reading settings on app mount
  useEffect(function initGlobalSettings() {
    SettingsService.getReadingSettings('')
      .then((cfg) => {
        if (cfg) setReadingSettings(cfg)
      })
      .catch((e) => console.error('Failed to init reading settings:', e))

    SettingsService.getPrompts('')
      .then((p) => {
        if (p) setPrompts(p)
      })
      .catch((e) => console.error('Failed to init prompts:', e))
  }, [])

  function openSettings(initialScope?: string) {
    if (initialScope) {
      setScope(initialScope)
    } else if (selectedBookId) {
      setScope(selectedBookId)
    } else {
      setScope('global')
    }
    setIsSuccess(false)
    setIsOpen(true)
  }

  function closeSettings() {
    setIsOpen(false)
    setIsSuccess(false)
  }

  function updateReadingSettings(updated: Partial<ReadingSettings>) {
    setReadingSettings((prev: ReadingSettings) => ({
      ...prev,
      ...updated,
      scope: scope === 'global' ? 'global' : scope,
    }))
  }

  function updateChatConfig(chat: Partial<AISettings['chat']>) {
    setAiSettings((prev: AISettings) => ({
      ...prev,
      chat: { ...prev.chat, ...chat },
    }))
  }

  function updateEmbeddingConfig(embedding: Partial<AISettings['embedding']>) {
    setAiSettings((prev: AISettings) => ({
      ...prev,
      embedding: { ...prev.embedding, ...embedding },
    }))
  }

  function updateVisionConfig(vision: Partial<AISettings['vision']>) {
    setAiSettings((prev: AISettings) => ({
      ...prev,
      vision: { ...prev.vision, ...vision },
    }))
  }

  function updateUseGlobal(useGlobal: boolean) {
    setAiSettings((prev: AISettings) => ({
      ...prev,
      useGlobal,
    }))
  }

  async function handleSavePrompt(prompt: Prompt) {
    await SettingsService.savePrompt(prompt)
    const updated = await SettingsService.getPrompts(scope === 'global' ? '' : scope)
    setPrompts(updated)
  }

  async function handleDeletePrompt(id: string) {
    await SettingsService.deletePrompt(id)
    const updated = await SettingsService.getPrompts(scope === 'global' ? '' : scope)
    setPrompts(updated)
  }

  async function handleResetPrompts() {
    await SettingsService.resetPrompts()
    const updated = await SettingsService.getPrompts(scope === 'global' ? '' : scope)
    setPrompts(updated)
  }

  async function saveAllSettings() {
    setIsSaving(true)
    setIsSuccess(false)
    try {
      await Promise.all([
        SettingsService.saveReadingSettings({
          ...readingSettings,
          scope: scope === 'global' ? 'global' : scope,
        }),
        SettingsService.saveAISettings({
          ...aiSettings,
          scope: scope === 'global' ? 'global' : scope,
        }),
      ])
      setIsSuccess(true)
      setTimeout(function autoClose() {
        setIsOpen(false)
        setIsSuccess(false)
      }, 900)
    } catch (err) {
      console.error('Failed to save settings:', err)
    } finally {
      setIsSaving(false)
    }
  }

  return {
    isOpen,
    scope,
    readingSettings,
    aiSettings,
    prompts,
    books,
    isSaving,
    isSuccess,
    openSettings,
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
  }
}
