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
      px="14"
      pt="4"
      pb="5"
      borderTopWidth="0.0625rem"
      borderTopColor="glass.borderSubtle"
      bg="glass.sidebar"
      w="full"
      zIndex="base"
    >
      <ParagraphProgressBar percent={percent} />
      <Flex align="center" justify="space-between" mt="2">
        <HStack gap="1.5">
          <Text textStyle="xs" color="fg.subtle">
            {percentCompletedText} • {keyboardHint}
          </Text>
          <Kbd size="sm" fontFamily="mono">←</Kbd>
          <Text textStyle="xs" color="fg.subtle">/</Text>
          <Kbd size="sm" fontFamily="mono">→</Kbd>
        </HStack>

        <HStack gap="3">
          <Button
            variant="outline"
            colorPalette="gray"
            size="sm"
            onClick={onPrev}
            disabled={!hasPrev}
          >
            <ChevronLeft size={16} />
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
            <ChevronRight size={16} />
          </Button>
        </HStack>
      </Flex>
    </Flex>
  )
}
