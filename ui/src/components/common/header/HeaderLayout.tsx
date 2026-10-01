import React from 'react'
import { Flex } from '@chakra-ui/react'

export interface HeaderLayoutProps {
  children: React.ReactNode
}

export function HeaderLayout({ children }: HeaderLayoutProps) {
  return (
    <Flex
      as="header"
      position="sticky"
      top="0"
      zIndex="50"
      layerStyle="glassHeader"
      px="1.5rem"
      py="0.75rem"
      align="center"
      justify="space-between"
      w="full"
      userSelect="none"
      style={{ '--wails-draggable': 'drag' } as React.CSSProperties}
    >
      {children}
    </Flex>
  )
}
