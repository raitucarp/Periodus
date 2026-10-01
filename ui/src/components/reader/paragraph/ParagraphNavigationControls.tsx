import React from 'react'
import { Flex, HStack, Button, Text, Kbd } from '@chakra-ui/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ParagraphProgressBar } from './ParagraphProgressBar'

export interface ParagraphNavigationControlsProps {
  percentCompletedText: string
  keyboardHint: string
  navPreviousText: string
  navNextText: string
  hasPrev: boolean
  hasNext: boolean
  percent: number
  onPrev: () => void
  onNext: () => void
}

export function ParagraphNavigationControls({
  percentCompletedText,
  keyboardHint,
  navPreviousText,
  navNextText,
  hasPrev,
  hasNext,
  percent,
  onPrev,
  onNext,
}: ParagraphNavigationControlsProps) {
  return (
    <Flex
      as="footer"
      direction="column"
      flexShrink={0}
      mt="auto"
      px="3.5rem"
      pt="1rem"
      pb="1.25rem"
      borderTopWidth="0.0625rem"
      borderTopColor="glass.borderSubtle"
      bg="glass.sidebar"
      w="full"
      zIndex={1}
    >
      <ParagraphProgressBar percent={percent} />
      <Flex align="center" justify="space-between" mt="0.5rem">
        <HStack gap="0.375rem">
          <Text textStyle="xs" color="fg.subtle">
            {percentCompletedText} • {keyboardHint}
          </Text>
          <Kbd size="sm" fontFamily="mono">←</Kbd>
          <Text textStyle="xs" color="fg.subtle">/</Text>
          <Kbd size="sm" fontFamily="mono">→</Kbd>
        </HStack>

        <HStack gap="0.75rem">
          <Button
            variant="outline"
            colorPalette="gray"
            size="sm"
            onClick={onPrev}
            disabled={!hasPrev}
          >
            <ChevronLeft size="1rem" />
            {navPreviousText}
          </Button>

          <Button
            colorPalette="ruby"
            variant="solid"
            size="sm"
            onClick={onNext}
            disabled={!hasNext}
          >
            {navNextText}
            <ChevronRight size="1rem" />
          </Button>
        </HStack>
      </Flex>
    </Flex>
  )
}
