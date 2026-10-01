import React from 'react'
import { Flex, HStack, Button, Text, Square, Separator, VStack } from '@chakra-ui/react'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { WindowControls } from '@/components/common/window'
import { ChapterHeatmap } from '../heatmap/ChapterHeatmap'
import type { ChapterHeatmapItem } from '@/lib/types'

export interface ReaderTopNavProps {
  bookTitle: string
  author?: string
  totalChapters?: number
  chapterHeatmapData?: ChapterHeatmapItem[]
  currentChapterIndex?: number
  onSelectChapter?: (idx: number) => void
  backLabel: string
  onBack: () => void
  children?: React.ReactNode
}

export function ReaderTopNav({
  bookTitle,
  author,
  totalChapters = 1,
  chapterHeatmapData = [],
  currentChapterIndex = 1,
  onSelectChapter = () => {},
  backLabel,
  onBack,
  children,
}: ReaderTopNavProps) {
  return (
    <Flex
      as="header"
      position="sticky"
      top="0"
      zIndex="sticky"
      align="center"
      justify="space-between"
      px="6"
      py="2.5"
      layerStyle="glassHeader"
      w="full"
      userSelect="none"
      style={{ '--wails-draggable': 'drag' } as React.CSSProperties}
    >
      {/* Left Area: Catalog Button & 2-Line Author/Title */}
      <HStack gap="3" style={{ '--wails-draggable': 'no-drag' } as React.CSSProperties}>
        <Button
          variant="outline"
          colorPalette="gray"
          size="sm"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          {backLabel}
        </Button>

        <HStack gap="2.5" ml="1">
          <Square color="ruby.solid" size="1.75rem" rounded="md" bg="ruby.subtle">
            <BookOpen size={15} />
          </Square>
          <VStack align="start" gap="0">
            {author && (
              <Text textStyle="2xs" color="fg.subtle" fontWeight="medium" lineHeight="1.2">
                {author}
              </Text>
            )}
            <Text
              textStyle="sm"
              fontWeight="bold"
              color="fg"
              maxW="18rem"
              truncate
              title={bookTitle}
              lineHeight="1.2"
            >
              {bookTitle}
            </Text>
          </VStack>
        </HStack>
      </HStack>

      {/* Middle Area: Green Line Chapter Calendar Heatmap */}
      <HStack
        flex="1"
        justify="center"
        px="4"
        style={{ '--wails-draggable': 'no-drag' } as React.CSSProperties}
      >
        <ChapterHeatmap
          totalChapters={totalChapters}
          heatmapItems={chapterHeatmapData}
          currentChapterIndex={currentChapterIndex}
          onSelectChapter={onSelectChapter}
        />
      </HStack>

      {/* Right Area: Chapter Selector, Additional Tools & Window Controls */}
      <HStack gap="3" align="center" style={{ '--wails-draggable': 'no-drag' } as React.CSSProperties}>
        {children}
        <Separator orientation="vertical" h="dividerHeight" borderColor="border.subtle" mx="1" />
        <WindowControls />
      </HStack>
    </Flex>
  )
}
