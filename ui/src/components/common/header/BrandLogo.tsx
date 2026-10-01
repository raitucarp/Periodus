import React from 'react'
import { Square } from '@chakra-ui/react'

export interface BrandLogoProps {
  icon: React.ReactNode
}

export function BrandLogo({ icon }: BrandLogoProps) {
  return (
    <Square
      size="brandLogo"
      layerStyle="brandLogoSquare"
      transition="transform 0.2s ease"
      _hover={{
        transform: 'scale(1.04)',
      }}
    >
      {icon}
    </Square>
  )
}
