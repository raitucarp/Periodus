import React from 'react'
import { Flex, HStack, Button, Text, Kbd, VStack, Box } from '@chakra-ui/react'
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
  utilityToolbar?: React.ReactNode
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
  utilityToolbar,
  onPrev,
  onNext,
}: ParagraphNavigationControlsProps) {
  return (
    <Flex
      as="footer"
      direction="column"
      flexShrink={0}
      mt="auto"
      px="8"
      pt="3"
      pb="4"
      borderTopWidth="1px"
      borderTopColor="border.subtle"
      bg="bg.panel"
      w="full"
      zIndex="base"
      gap="3"
    >
      {/* Cyan Line Area: Paragraph Utility Toolbar */}
      {utilityToolbar && (
        <Box w="full">
          {utilityToolbar}
        </Box>
      )}

      {/* Progress Bar */}
      <ParagraphProgressBar percent={percent} />

      {/* Navigation Buttons and Right-Aligned Hint */}
      <Flex align="center" justify="space-between" mt="1">
        <Box flex="1" />

        {/* Right-aligned Navigation & Hint (hint placed under Previous/Next buttons) */}
        <VStack align="end" gap="1.5">
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

          <HStack gap="1.5">
            <Text textStyle="2xs" color="fg.subtle">
              {percentCompletedText} • {keyboardHint}
            </Text>
            <Kbd size="sm" fontFamily="mono">←</Kbd>
            <Text textStyle="2xs" color="fg.subtle">/</Text>
            <Kbd size="sm" fontFamily="mono">→</Kbd>
          </HStack>
        </VStack>
      </Flex>
    </Flex>
  )
}
