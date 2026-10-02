import React from 'react'
import { Box, Flex, HStack, Badge, Text, VStack } from '@chakra-ui/react'
import { Bookmark } from 'lucide-react'
import { ParagraphHeatmap } from '../heatmap/ParagraphHeatmap'
import { cleanChapterTitle } from '@/lib/sentence'
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
  const displayTitle = cleanChapterTitle(chapterTitle) || `Chapter ${chapterIndex}`

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
              {displayTitle}
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
          <HStack gap="0.5" align="baseline">
            <Text textStyle="xl" fontWeight="extrabold" color="fg" lineHeight="1">
              {currentParagraphIndex}
            </Text>
            <Text textStyle="sm" fontWeight="semibold" color="fg.muted" lineHeight="1">
              /{totalParagraphs}
            </Text>
          </HStack>
        </VStack>
      </Flex>
    </Box>
  )
}

