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
      onClick={handleMinimizeClick}
      style={{ '--wails-draggable': 'no-drag' } as React.CSSProperties}
    >
      <Minus size={14} strokeWidth={2} />
    </IconButton>
  )
}
