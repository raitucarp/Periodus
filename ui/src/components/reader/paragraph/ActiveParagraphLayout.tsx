import React from 'react'
import { Flex } from '@chakra-ui/react'

export interface ActiveParagraphLayoutProps {
  children: React.ReactNode
}

export function ActiveParagraphLayout({ children }: ActiveParagraphLayoutProps) {
  return (
    <Flex
      direction="column"
      h="full"
      w="full"
      overflow="hidden"
      position="relative"
    >
      {children}
    </Flex>
  )
}
