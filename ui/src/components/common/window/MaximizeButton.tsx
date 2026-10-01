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
      rounded="md"
      color="fg.muted"
      h="1.75rem"
      w="1.75rem"
      minW="1.75rem"
      _hover={{
        bg: 'whiteA.2',
        color: 'fg',
      }}
      _active={{
        bg: 'whiteA.3',
      }}
      onClick={handleMaximizeClick}
      style={{ '--wails-draggable': 'no-drag' } as React.CSSProperties}
    >
      <Square size="0.75rem" strokeWidth={2} />
    </IconButton>
  )
}
