import React from 'react'
import { Box, Flex, HStack, Badge, Text, VStack } from '@chakra-ui/react'
import { Bookmark } from 'lucide-react'
import { ParagraphHeatmap } from '../heatmap/ParagraphHeatmap'
import type { ParagraphStat } from '@/lib/types'

export interface ParagraphHeaderInfoProps {
  chapterIndex: number
  totalChapters: number
  chapterTitle: string
  currentParagraphIndex: number
  totalParagraphs: number
  paragraphStats?: ParagraphStat[]
  onSelectParagraph?: (index: number) => void
}

export function ParagraphHeaderInfo({
  chapterIndex,
  totalChapters,
  chapterTitle,
  currentParagraphIndex,
  totalParagraphs,
  paragraphStats = [],
  onSelectParagraph = () => {},
}: ParagraphHeaderInfoProps) {
  return (
    <Box
      as="header"
      flexShrink={0}
      px="6"
      py="3"
      borderBottomWidth="1px"
      borderBottomColor="border.subtle"
      w="full"
      zIndex="base"
    >
      <Flex align="center" justify="space-between" gap="4">
        {/* Left Side: 2-line Chapter Info with tight left padding */}
        <HStack gap="2.5" align="start" flexShrink={0} maxW="40%">
          <Box mt="0.5" color="ruby.solid">
            <Bookmark size={16} />
          </Box>
          <VStack align="start" gap="0.5">
            <Text textStyle="xs" fontWeight="medium" color="fg.subtle">
              Chapter {chapterIndex} of {totalChapters}
            </Text>
            <Text textStyle="md" fontWeight="bold" color="fg" lineClamp={1}>
              {chapterTitle || `Chapter ${chapterIndex}`}
            </Text>
          </VStack>
        </HStack>

        {/* Right-aligned: 3-row Paragraph Calendar Heatmap */}
        <Box
          flex="1"
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          overflowX="auto"
          className="no-scrollbar"
          px="2"
        >
          <ParagraphHeatmap
            totalParagraphs={totalParagraphs}
            stats={paragraphStats}
            currentParagraphIndex={currentParagraphIndex}
            onSelectParagraph={onSelectParagraph}
          />
        </Box>

        {/* Right Side: 2-line Paragraph Status */}
        <VStack align="end" gap="0.5" flexShrink={0}>
          <Text textStyle="xs" fontWeight="medium" color="fg.subtle">
            Paragraph
          </Text>
          <HStack gap="0" align="baseline">
            <Text textStyle="md" fontWeight="bold" color="fg">
              {currentParagraphIndex}
            </Text>
            <Text textStyle="xs" fontWeight="medium" color="fg.muted">
              /{totalParagraphs}
            </Text>
          </HStack>
        </VStack>
      </Flex>
    </Box>
  )
}

