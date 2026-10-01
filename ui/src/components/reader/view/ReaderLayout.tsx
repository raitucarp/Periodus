import React from 'react'
import { Flex } from '@chakra-ui/react'

export interface ReaderLayoutProps {
  children: React.ReactNode
}

export function ReaderLayout({ children }: ReaderLayoutProps) {
  return (
    <Flex
      direction="column"
      h="100vh"
      bg="bg"
      overflow="hidden"
      w="full"
    >
      {children}
    </Flex>
  )
}
