import React from 'react'
import { IconButton } from '@chakra-ui/react'
import { Settings as SettingsIcon } from 'lucide-react'

export interface SettingsButtonProps {
  label: string
  onClick: () => void
}

export function SettingsButton({ label, onClick }: SettingsButtonProps) {
  return (
    <IconButton
      aria-label={label}
      title={label}
      colorPalette="gray"
      variant="outline"
      size="sm"
      onClick={onClick}
    >
      <SettingsIcon size="1rem" />
    </IconButton>
  )
}
