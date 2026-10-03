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
      rounded="none"
      m="0"
      color="fg.muted"
      h="full"
      w="12"
      minW="12"
      _hover={{
        bg: 'red.solid',
        color: 'white',
      }}
      _active={{
        bg: 'red.focus',
      }}
      onClick={handleCloseClick}
      style={{ '--wails-draggable': 'no-drag' } as React.CSSProperties}
    >
      <X size={14} strokeWidth={2} />
    </IconButton>
  )
}
