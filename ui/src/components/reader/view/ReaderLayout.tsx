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
      overflow="hidden"
      w="full"
      position="relative"
      bg={{
        _dark:
          'radial-gradient(130% 90% at 50% 0%, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.012) 45%, transparent 85%), var(--chakra-colors-bg)',
        _light:
          'radial-gradient(130% 90% at 50% 0%, rgba(0, 0, 0, 0.025) 0%, rgba(0, 0, 0, 0.006) 45%, transparent 85%), var(--chakra-colors-bg)',
      }}
    >
      {children}
    </Flex>
  )
}
