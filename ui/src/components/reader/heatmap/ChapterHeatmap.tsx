import React from 'react'
import { Grid, Box } from '@chakra-ui/react'
import { useColorMode } from '@/components/ui/color-mode'
import { cleanChapterTitle } from '@/lib/sentence'
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
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const count = Math.max(totalChapters, heatmapItems.length, 1)

  // Map chapter_index -> stats
  const statsMap = new Map<number, ChapterHeatmapItem>()
  for (const item of heatmapItems) {
    statsMap.set(item.chapter_index, item)
  }

  return (
    <Grid
      autoFlow="column"
      autoColumns="max-content"
      gap="2px"
      alignItems="center"
      overflowX="auto"
      py="1"
      maxW="36rem"
      className="no-scrollbar"
    >
      {Array.from({ length: count }, function renderBox(_, i) {
        const chapterIdx = i + 1
        const stat = statsMap.get(chapterIdx)
        const visits = stat?.total_visits || 0
        const isCurrent = chapterIdx === currentChapterIndex
        const isShort = (stat?.paragraph_count ?? 0) <= 15

        // Color intensity:
        // 0 visits -> unified design token without border
        // 1-3 visits -> soft grass
        // 4-10 visits -> medium grass
        // >10 visits -> bright grass
        let bg = 'var(--chakra-colors-heatmap-empty)'
        let borderColor = 'transparent'

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

        const cleanTitle = stat?.title ? cleanChapterTitle(stat.title) : ''
        const tooltipText = `Chapter ${chapterIdx}${cleanTitle ? ': ' + cleanTitle : ''} • ${visits} visits (${stat?.visited_paragraphs || 0}/${stat?.paragraph_count || 0} read)`

        return (
          <Box
            key={chapterIdx}
            w={isShort ? '4px' : '10px'}
            minW={isShort ? '4px' : '10px'}
            maxW={isShort ? '4px' : '10px'}
            h="4"
            flexShrink={0}
            boxSizing="border-box"
            rounded="1px"
            cursor="pointer"
            title={tooltipText}
            style={{
              backgroundColor: bg,
              border: '1px solid ' + borderColor,
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
    </Grid>
  )
}
