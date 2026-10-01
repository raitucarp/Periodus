import React from 'react'
import { Box } from '@chakra-ui/react'
import { AmbientAura } from './AmbientAura'
import { AmbientGrid } from './AmbientGrid'

export interface AmbientBackgroundProps {
  children?: React.ReactNode
}

export function AmbientBackground({ children }: AmbientBackgroundProps) {
  return (
    <Box position="relative" minH="100vh" w="full" bg="bg" overflowX="hidden">
      <AmbientAura />
      <AmbientGrid />
      <Box position="relative" zIndex={1} minH="100vh" w="full" display="flex" flexDirection="column">
        {children}
      </Box>
    </Box>
  )
}

export * from './AmbientAura'
export * from './AmbientGrid'
