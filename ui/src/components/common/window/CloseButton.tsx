import React from 'react'
import { IconButton } from '@chakra-ui/react'
import { X } from 'lucide-react'
import { Window } from '@wailsio/runtime'
import { isWailsEnv } from '@/lib/bindings'

export interface CloseButtonProps {
  label?: string
}

export function CloseButton({ label = 'Close' }: CloseButtonProps) {
  function handleCloseClick() {
    if (isWailsEnv()) {
      Window.Close()
    }
  }

  return (
    <IconButton
      aria-label={label}
      variant="ghost"
      size="xs"
      rounded="md"
      color="fg.muted"
      h="windowControl"
      w="windowControl"
      minW="windowControl"
      _hover={{
        bg: 'redA.4',
        color: 'redA.11',
      }}
      _active={{
        bg: 'redA.5',
      }}
      onClick={handleCloseClick}
      style={{ '--wails-draggable': 'no-drag' } as React.CSSProperties}
    >
      <X size={14} strokeWidth={2} />
    </IconButton>
  )
}
