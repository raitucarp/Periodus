import React from 'react'
import { Flex, HStack, Button, Text, Square, Box } from '@chakra-ui/react'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { WindowControls } from '@/components/common/window'

export interface ReaderTopNavProps {
  bookTitle: string
  backLabel: string
  onBack: () => void
  children?: React.ReactNode
}

export function ReaderTopNav({ bookTitle, backLabel, onBack, children }: ReaderTopNavProps) {
  return (
    <Flex
      as="header"
      position="sticky"
      top="0"
      zIndex="50"
      align="center"
      justify="space-between"
      px="1.5rem"
      py="0.75rem"
      layerStyle="glassHeader"
      w="full"
      userSelect="none"
      style={{ '--wails-draggable': 'drag' } as React.CSSProperties}
    >
      <HStack gap="1rem" style={{ '--wails-draggable': 'no-drag' } as React.CSSProperties}>
        <Button
          variant="outline"
          colorPalette="gray"
          size="sm"
          onClick={onBack}
        >
          <ArrowLeft size="1rem" />
          {backLabel}
        </Button>

        <HStack gap="0.5rem">
          <Square color="ruby.solid">
            <BookOpen size="1rem" />
          </Square>
          <Text
            textStyle="sm"
            fontWeight="bold"
            color="fg"
            maxW="22rem"
            truncate
          >
            {bookTitle}
          </Text>
        </HStack>
      </HStack>

      <HStack gap="0.75rem" align="center" style={{ '--wails-draggable': 'no-drag' } as React.CSSProperties}>
        {children}
        <Box w="0.0625rem" h="1.25rem" bg="border.subtle" mx="0.25rem" />
        <WindowControls />
      </HStack>
    </Flex>
  )
}
