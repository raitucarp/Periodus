import React from 'react'
import { Flex } from '@chakra-ui/react'

export interface ReaderMainSplitProps {
  leftPane: React.ReactNode
  rightPane: React.ReactNode
}

export function ReaderMainSplit({ leftPane, rightPane }: ReaderMainSplitProps) {
  return (
    <Flex
      flex="1"
      overflow="hidden"
      w="full"
      px="6"
      pb="6"
      pt="2"
    >
      <Flex
        flex="1"
        h="full"
        w="full"
        layerStyle="glassContainer"
        overflow="hidden"
      >
        <Flex
          flex="1"
          h="full"
          direction="column"
          overflow="hidden"
          bg={{
            _light: 'rgba(255, 255, 255, 0.45)',
            _dark: 'rgba(15, 17, 21, 0.45)',
          }}
          backdropFilter="blur(20px)"
        >
          {leftPane}
        </Flex>
        <Flex
          w="readerSidebar"
          minW="readerSidebarMin"
          maxW="readerSidebarMax"
          h="full"
          direction="column"
          layerStyle="glassSidebar"
          overflow="hidden"
        >
          {rightPane}
        </Flex>
      </Flex>
    </Flex>
  )
}
