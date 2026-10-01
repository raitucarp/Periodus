import React from 'react'
import { Box } from '@chakra-ui/react'

export function AmbientGrid() {
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      pointerEvents="none"
      zIndex={0}
      opacity={0.35}
      backgroundImage="radial-gradient({colors.whiteA.2} 0.0625rem, transparent 0.0625rem)"
      backgroundSize="1.5rem 1.5rem"
      aria-hidden="true"
    />
  )
}
