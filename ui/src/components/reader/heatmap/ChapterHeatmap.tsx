import React from 'react'
import { HStack, Box, Text } from '@chakra-ui/react'
import type { ChapterHeatmapItem } from '@/lib/types'

export interface ChapterHeatmapProps {
  totalChapters: number
  heatmapItems: ChapterHeatmapItem[]
  currentChapterIndex: number
  onSelectChapter: (index: number) => void
}

export function ChapterHeatmap({
  totalChapters,
  heatmapItems,
  currentChapterIndex,
  onSelectChapter,
}: ChapterHeatmapProps) {
  const count = Math.max(totalChapters, heatmapItems.length, 1)

  // Map chapter_index -> stats
  const statsMap = new Map<number, ChapterHeatmapItem>()
  for (const item of heatmapItems) {
    statsMap.set(item.chapter_index, item)
  }

  return (
    <HStack gap="1" align="center" overflowX="auto" py="1" maxW="32rem" className="no-scrollbar">
      {Array.from({ length: count }, function renderBox(_, i) {
        const chapterIdx = i + 1
        const stat = statsMap.get(chapterIdx)
        const visits = stat?.total_visits || 0
        const isCurrent = chapterIdx === currentChapterIndex

        // Radix Grass color intensity:
        // 0 visits -> subtle tomato-gray
        // 1-3 visits -> soft grass
        // 4-10 visits -> medium grass
        // >10 visits -> bright grass
        let bg = 'color-mix(in srgb, var(--chakra-colors-gray-subtle, #1f1f1f) 85%, var(--chakra-colors-tomato-muted, #e54d2e) 15%)'
        let borderColor = 'border.subtle'

        if (visits > 10) {
          bg = 'var(--chakra-colors-grass-solid, #30a46c)'
          borderColor = 'var(--chakra-colors-grass-focus, #30a46c)'
        } else if (visits >= 4) {
          bg = 'var(--chakra-colors-grass-muted, #297c53)'
          borderColor = 'var(--chakra-colors-grass-border, #20573e)'
        } else if (visits >= 1) {
          bg = 'var(--chakra-colors-grass-subtle, #183b2b)'
          borderColor = 'var(--chakra-colors-grass-border, #20573e)'
        }

        const tooltipText = `Chapter ${chapterIdx}${stat?.title ? ': ' + stat.title : ''} • ${visits} visits (${stat?.visited_paragraphs || 0}/${stat?.paragraph_count || 0} read)`

        return (
          <Box
            key={chapterIdx}
            w="2.5"
            h="4"
            rounded="xs"
            cursor="pointer"
            title={tooltipText}
            style={{
              backgroundColor: bg,
              boxShadow: isCurrent ? '0 0 0 1.5px var(--chakra-colors-grass-solid, #46a758)' : 'none',
              transition: 'transform 0.15s ease, opacity 0.15s ease',
            }}
            _hover={{
              transform: 'scale(1.25)',
              zIndex: 1,
            }}
            onClick={function handleChapterClick() {
              onSelectChapter(chapterIdx)
            }}
          />
        )
      })}
    </HStack>
  )
}
