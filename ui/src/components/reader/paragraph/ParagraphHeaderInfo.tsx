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
        <HStack gap="2.5" align="start" flexShrink={0} maxW="38%">
          <Box mt="0.5" color="ruby.solid">
            <Bookmark size={15} />
          </Box>
          <VStack align="start" gap="0">
            <Text textStyle="2xs" fontWeight="medium" color="fg.subtle">
              Chapter {chapterIndex} of {totalChapters}
            </Text>
            <Text textStyle="sm" fontWeight="semibold" color="fg" lineClamp={1}>
              {chapterTitle || `Chapter ${chapterIndex}`}
            </Text>
          </VStack>
        </HStack>

        {/* Center: 3-row Paragraph Calendar Heatmap */}
        <Box
          flex="1"
          display="flex"
          justifyContent="center"
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

        {/* Right Side: Paragraph Badge tucked towards right corner */}
        <Badge
          flexShrink={0}
          colorPalette="blue"
          variant="subtle"
          px="2.5"
          py="1"
          rounded="full"
          textStyle="2xs"
          fontWeight="semibold"
          letterSpacing="tight"
        >
          Paragraph {currentParagraphIndex} of {totalParagraphs}
        </Badge>
      </Flex>
    </Box>
  )
}

