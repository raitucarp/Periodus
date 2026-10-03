import React from 'react'
import { IconButton } from '@chakra-ui/react'
import { Square } from 'lucide-react'
import { Window } from '@wailsio/runtime'
import { isWailsEnv } from '@/lib/bindings'

export interface MaximizeButtonProps {
  label?: string
}

export function MaximizeButton({ label = 'Maximize' }: MaximizeButtonProps) {
  function handleMaximizeClick() {
    if (isWailsEnv()) {
      Window.ToggleMaximise()
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
      w="11"
      minW="11"
      _hover={{
        bg: 'whiteA.3',
        color: 'fg',
      }}
      _active={{
        bg: 'whiteA.4',
      }}
      onClick={handleMaximizeClick}
      style={{ '--wails-draggable': 'no-drag' } as React.CSSProperties}
    >
      <Square size={12} strokeWidth={2} />
    </IconButton>
  )
}
