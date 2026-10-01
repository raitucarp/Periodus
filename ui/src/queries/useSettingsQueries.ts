import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SettingsService } from '@/lib/bindings'
import { queryKeys } from '@/lib/queryClient'
import type { AISettings, Prompt, ReadingSettings } from '@/lib/types'

export function useAISettingsQuery(scope: string, bookId: string = '') {
  return useQuery<AISettings>({
    queryKey: queryKeys.settings.ai(scope, bookId),
    queryFn: async function fetchAISettings() {
      const targetId = scope === 'book' ? bookId : ''
      return await SettingsService.getAISettings(targetId)
    },
  })
}

export function useSaveAISettingsMutation() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, AISettings>({
    mutationFn: async function performSaveAISettings(settings: AISettings) {
      await SettingsService.saveAISettings(settings)
    },
    onSuccess: function onAISettingsSaved(_data, _variables) {
      queryClient.invalidateQueries({
        queryKey: ['settings', 'ai'],
      })
    },
  })
}

export function useReadingSettingsQuery(scope: string, bookId: string = '') {
  return useQuery<ReadingSettings>({
    queryKey: queryKeys.settings.reading(scope, bookId),
    queryFn: async function fetchReadingSettings() {
      const targetId = scope === 'book' ? bookId : ''
      return await SettingsService.getReadingSettings(targetId)
    },
  })
}

export function useSaveReadingSettingsMutation() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, ReadingSettings>({
    mutationFn: async function performSaveReadingSettings(settings: ReadingSettings) {
      await SettingsService.saveReadingSettings(settings)
    },
    onSuccess: function onReadingSettingsSaved() {
      queryClient.invalidateQueries({
        queryKey: ['settings', 'reading'],
      })
    },
  })
}

export function usePromptsQuery(bookId: string = '') {
  return useQuery<Prompt[]>({
    queryKey: queryKeys.settings.prompts(bookId),
    queryFn: async function fetchPrompts() {
      return await SettingsService.getPrompts(bookId)
    },
  })
}

export function useSavePromptMutation() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, Prompt>({
    mutationFn: async function performSavePrompt(prompt: Prompt) {
      await SettingsService.savePrompt(prompt)
    },
    onSuccess: function onPromptSaved() {
      queryClient.invalidateQueries({
        queryKey: ['settings', 'prompts'],
      })
    },
  })
}

export function useDeletePromptMutation() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: async function performDeletePrompt(id: string) {
      await SettingsService.deletePrompt(id)
    },
    onSuccess: function onPromptDeleted() {
      queryClient.invalidateQueries({
        queryKey: ['settings', 'prompts'],
      })
    },
  })
}

export function useResetPromptsMutation() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, void>({
    mutationFn: async function performResetPrompts() {
      await SettingsService.resetPrompts()
    },
    onSuccess: function onPromptsReset() {
      queryClient.invalidateQueries({
        queryKey: ['settings', 'prompts'],
      })
    },
  })
}
