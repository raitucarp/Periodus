import { useAtom } from 'jotai'
import {
  apiKeyAtom,
  isSavingApiKeyAtom,
  apiKeySaveSuccessAtom,
} from '@/state/atoms'
import { SettingsService } from '@/lib/bindings'

export function useApiKeyStorage() {
  const [apiKey, setApiKey] = useAtom(apiKeyAtom)
  const [isSaving, setIsSaving] = useAtom(isSavingApiKeyAtom)
  const [isSuccess, setIsSuccess] = useAtom(apiKeySaveSuccessAtom)

  async function loadApiKey() {
    try {
      const key = await SettingsService.getApiKey()
      setApiKey(key || '')
    } catch (error) {
      console.error('Failed to load API key:', error)
    }
  }

  function updateApiKeyInput(newKey: string) {
    setApiKey(newKey)
  }

  async function saveApiKey() {
    try {
      setIsSaving(true)
      await SettingsService.saveApiKey(apiKey.trim())
      setIsSuccess(true)
    } catch (error) {
      console.error('Failed to save API key:', error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  function resetSuccess() {
    setIsSuccess(false)
  }

  return {
    apiKey,
    isSaving,
    isSuccess,
    loadApiKey,
    updateApiKeyInput,
    saveApiKey,
    resetSuccess,
  }
}
