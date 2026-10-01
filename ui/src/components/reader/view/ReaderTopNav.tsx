import React from 'react'
import { Flex, HStack, Button, Text, Square, Separator } from '@chakra-ui/react'
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
      zIndex="sticky"
      align="center"
      justify="space-between"
      px="6"
      py="3"
      layerStyle="glassHeader"
      w="full"
      userSelect="none"
      style={{ '--wails-draggable': 'drag' } as React.CSSProperties}
    >
      <HStack gap="4" style={{ '--wails-draggable': 'no-drag' } as React.CSSProperties}>
        <Button
          variant="outline"
          colorPalette="gray"
          size="sm"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          {backLabel}
        </Button>

        <HStack gap="2">
          <Square color="ruby.solid">
            <BookOpen size={16} />
          </Square>
          <Text
            textStyle="sm"
            fontWeight="bold"
            color="fg"
            maxW="readerSidebarMin"
            truncate
          >
            {bookTitle}
          </Text>
        </HStack>
      </HStack>

      <HStack gap="3" align="center" style={{ '--wails-draggable': 'no-drag' } as React.CSSProperties}>
        {children}
        <Separator orientation="vertical" h="dividerHeight" borderColor="border.subtle" mx="1" />
        <WindowControls />
      </HStack>
    </Flex>
  )
}
