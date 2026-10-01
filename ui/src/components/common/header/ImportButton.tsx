import React from 'react'
import { Button } from '@chakra-ui/react'
import { Plus } from 'lucide-react'

export interface ImportButtonProps {
  isImporting: boolean
  label: string
  onClick: () => void
}

export function ImportButton({ isImporting, label, onClick }: ImportButtonProps) {
  return (
    <Button
      colorPalette="ruby"
      variant="solid"
      size="sm"
      loading={isImporting}
      loadingText={label}
      onClick={onClick}
    >
      <Plus size="1rem" />
      {label}
    </Button>
  )
}
