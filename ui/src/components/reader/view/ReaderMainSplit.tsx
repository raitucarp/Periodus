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
      px="1.5rem"
      pb="1.5rem"
      pt="0.5rem"
    >
      <Flex
        flex="1"
        h="full"
        w="full"
        rounded="2xl"
        borderWidth="0.0625rem"
        borderColor="glass.borderSubtle"
        bg="glass.container"
        backdropFilter="blur(2rem)"
        boxShadow="0 1rem 3rem {colors.blackA.8}, inset 0 0.0625rem 0.0625rem {colors.whiteA.2}"
        overflow="hidden"
      >
        <Flex flex="1" h="full" direction="column" overflow="hidden">
          {leftPane}
        </Flex>
        <Flex
          w="25rem"
          minW="22rem"
          maxW="28rem"
          h="full"
          direction="column"
          borderLeftWidth="0.0625rem"
          borderLeftColor="glass.borderSubtle"
          bg="glass.sidebar"
          overflow="hidden"
        >
          {rightPane}
        </Flex>
      </Flex>
    </Flex>
  )
}
