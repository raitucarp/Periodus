import React from 'react'
import { IconButton } from '@chakra-ui/react'
import { Minus } from 'lucide-react'
import { Window } from '@wailsio/runtime'
import { isWailsEnv } from '@/lib/bindings'

export interface MinimizeButtonProps {
  label?: string
}

export function MinimizeButton({ label = 'Minimize' }: MinimizeButtonProps) {
  function handleMinimizeClick() {
    if (isWailsEnv()) {
      Window.Minimise()
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
      onClick={handleMinimizeClick}
      style={{ '--wails-draggable': 'no-drag' } as React.CSSProperties}
    >
      <Minus size="0.875rem" strokeWidth={2} />
    </IconButton>
  )
}
