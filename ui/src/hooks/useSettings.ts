import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { isSettingsOpenAtom } from '@/state/atoms'
import { useApiKeyStorage } from './subhooks/useApiKeyStorage'

export function useSettings() {
  const [isOpen, setIsOpen] = useAtom(isSettingsOpenAtom)
  const {
    apiKey,
    isSaving,
    isSuccess,
    loadApiKey,
    updateApiKeyInput,
    saveApiKey: persistApiKey,
    resetSuccess,
  } = useApiKeyStorage()

  useEffect(function handleSettingsOpened() {
    if (isOpen) {
      resetSuccess()
      loadApiKey()
    }
  }, [isOpen])

  function openSettings() {
    setIsOpen(true)
  }

  function closeSettings() {
    setIsOpen(false)
  }

  async function saveApiKey() {
    await persistApiKey()
    setTimeout(function autoCloseModal() {
      setIsOpen(false)
    }, 900)
  }

  return {
    isOpen,
    apiKey,
    isSaving,
    isSuccess,
    openSettings,
    closeSettings,
    updateApiKeyInput,
    saveApiKey,
  }
}
