import React from 'react'
import { Box } from '@chakra-ui/react'

export function AmbientGrid() {
  return (
    <Box
      position="fixed"
      inset="0"
      pointerEvents="none"
      zIndex="0"
      opacity={0.35}
      layerStyle="ambientGrid"
      aria-hidden="true"
    />
  )
}
