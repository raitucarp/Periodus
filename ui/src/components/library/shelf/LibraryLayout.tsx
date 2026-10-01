import React from 'react'
import { Container } from '@chakra-ui/react'

export interface LibraryLayoutProps {
  children: React.ReactNode
}

export function LibraryLayout({ children }: LibraryLayoutProps) {
  return (
    <Container maxW="containerMax" px="9" py="6" pb="16">
      {children}
    </Container>
  )
}
