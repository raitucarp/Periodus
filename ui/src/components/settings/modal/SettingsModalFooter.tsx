import React from 'react'
import { HStack, Button } from '@chakra-ui/react'

export interface SettingsModalFooterProps {
  cancelLabel: string
  saveLabel: string
  savingLabel: string
  isSaving: boolean
  onCancel: () => void
  onSave: () => void
}

export function SettingsModalFooter({
  cancelLabel,
  saveLabel,
  savingLabel,
  isSaving,
  onCancel,
  onSave,
}: SettingsModalFooterProps) {
  return (
    <HStack justify="flex-end" gap="0.75rem" w="full">
      <Button
        variant="outline"
        colorPalette="gray"
        size="sm"
        onClick={onCancel}
      >
        {cancelLabel}
      </Button>

      <Button
        size="sm"
        colorPalette="ruby"
        variant="solid"
        onClick={onSave}
        loading={isSaving}
        loadingText={savingLabel}
      >
        {saveLabel}
      </Button>
    </HStack>
  )
}
