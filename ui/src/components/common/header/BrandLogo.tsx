import React from 'react'
import { Square } from '@chakra-ui/react'

export interface BrandLogoProps {
  icon: React.ReactNode
}

export function BrandLogo({ icon }: BrandLogoProps) {
  return (
    <Square
      size="2.25rem"
      rounded="lg"
      bg="linear-gradient(135deg, #e5484d 0%, #c42b33 100%)"
      color="#ffffff"
      boxShadow="0 0 1.25rem {colors.rubyA.8}, inset 0 0.0625rem 0.0625rem {colors.whiteA.5}"
      borderWidth="0.0625rem"
      borderStyle="solid"
      borderColor="whiteA.3"
      transition="transform 0.2s ease"
      _hover={{
        transform: 'scale(1.04)',
      }}
    >
      {icon}
    </Square>
  )
}
