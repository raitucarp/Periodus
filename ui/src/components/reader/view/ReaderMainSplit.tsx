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
        <Flex flex="1" h="full" direction="column" overflow="hidden">
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
