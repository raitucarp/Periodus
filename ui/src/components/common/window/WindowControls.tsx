import React from 'react'
import { HStack } from '@chakra-ui/react'
import { MinimizeButton } from './MinimizeButton'
import { MaximizeButton } from './MaximizeButton'
import { CloseButton } from './CloseButton'

export function WindowControls() {
  return (
    <HStack gap="0.25rem" ml="0.5rem" style={{ '--wails-draggable': 'no-drag' } as React.CSSProperties}>
      <MinimizeButton />
      <MaximizeButton />
      <CloseButton />
    </HStack>
  )
}

export * from './MinimizeButton'
export * from './MaximizeButton'
export * from './CloseButton'
