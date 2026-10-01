import React from 'react'
import { Container } from '@chakra-ui/react'

export interface LibraryLayoutProps {
  children: React.ReactNode
}

export function LibraryLayout({ children }: LibraryLayoutProps) {
  return (
    <Container maxW="85rem" px="2.25rem" py="1.5rem" pb="4rem">
      {children}
    </Container>
  )
}
