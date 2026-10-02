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
      px="6"
      pt="2.5"
      pb="3.5"
      borderTopWidth="1px"
      borderTopColor="border.subtle"
      bg="bg.panel"
      w="full"
      zIndex="base"
      gap="2.5"
    >
      {/* Progress Bar with Percentage beside it */}
      <HStack gap="3" w="full" align="center">
        <Box flex="1">
          <ParagraphProgressBar percent={percent} />
        </Box>
        <Text textStyle="xs" fontWeight="bold" color="fg.muted" flexShrink={0} minW="2.5rem" textAlign="right">
          {percent}%
        </Text>
      </HStack>

      {/* Status Bar (Left) and Navigation Buttons (Right) */}
      <Flex align="center" justify="space-between" gap="4" w="full">
        {/* Left Side: Word count, chars, paragraph actions, bionic toggle, style, skip */}
        <Box flex="1" minW="0" overflowX="auto" className="no-scrollbar">
          {utilityToolbar}
        </Box>

        {/* Right Side: Navigation Buttons & Keyboard Shortcut Hint */}
        <VStack align="end" gap="1.5" flexShrink={0}>
          <HStack gap="2.5">
            <Button
              variant="outline"
              colorPalette="gray"
              size="sm"
              w="28"
              justifyContent="center"
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
              w="28"
              justifyContent="center"
              onClick={onNext}
              disabled={!hasNext}
            >
              {navNextText}
              <ChevronRight size={16} />
            </Button>
          </HStack>

          <HStack gap="1.5" align="center" title={`${percentCompletedText} • ${keyboardHint}`}>
            <Text textStyle="2xs" color="fg.subtle">
              Shortcut:
            </Text>
            <HStack gap="1" align="center">
              <Kbd size="sm" fontFamily="mono">←</Kbd>
              <Text textStyle="2xs" color="fg.subtle">prev</Text>
            </HStack>
            <Text textStyle="2xs" color="fg.subtle">•</Text>
            <HStack gap="1" align="center">
              <Kbd size="sm" fontFamily="mono">→</Kbd>
              <Text textStyle="2xs" color="fg.subtle">or</Text>
              <Kbd size="sm" fontFamily="mono">Space</Kbd>
              <Text textStyle="2xs" color="fg.subtle">next</Text>
            </HStack>
          </HStack>
        </VStack>
      </Flex>
    </Flex>
  )
}
