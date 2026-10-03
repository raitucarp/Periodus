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
      zIndex="sticky"
      layerStyle="glassHeader"
      pl="6"
      pr="0"
      py="0"
      h="14"
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
