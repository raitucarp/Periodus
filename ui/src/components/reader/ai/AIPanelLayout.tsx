import React from 'react'
import { Flex } from '@chakra-ui/react'

export interface AIPanelLayoutProps {
  children: React.ReactNode
}

export function AIPanelLayout({ children }: AIPanelLayoutProps) {
  return (
    <Flex
      as="aside"
      direction="column"
      h="full"
      w="full"
      p="6"
      overflowY="auto"
    >
      {children}
    </Flex>
  )
}
