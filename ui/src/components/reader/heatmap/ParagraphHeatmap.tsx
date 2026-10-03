import React from 'react'
import { Grid, Box } from '@chakra-ui/react'
import { useAtomValue } from 'jotai'
import { heatmapColorAtom, paragraphColorsAtom } from '@/state/atoms'
import { getRadixScale } from '@/lib/radixColors'
import { useColorMode } from '@/components/ui/color-mode'
import type { ParagraphStat } from '@/lib/types'

export interface ParagraphHeatmapProps {
  totalParagraphs: number
  stats: ParagraphStat[]
  currentParagraphIndex: number
  onSelectParagraph: (index: number) => void
  bookId?: string
  chapterIndex?: number
}

export function ParagraphHeatmap({
  totalParagraphs,
  stats,
  currentParagraphIndex,
  onSelectParagraph,
  bookId = '',
  chapterIndex = 1,
}: ParagraphHeatmapProps) {
  const defaultHeatmapColor = useAtomValue(heatmapColorAtom)
  const paragraphColors = useAtomValue(paragraphColorsAtom)
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  const count = Math.max(totalParagraphs, stats.length, 1)

  // Map paragraph_index -> ParagraphStat
  const statsMap = new Map<number, ParagraphStat>()
  for (const s of stats) {
    statsMap.set(s.paragraph_index, s)
  }

  return (
    <Grid
      templateRows="repeat(3, 10px)"
      autoFlow="column"
      autoColumns="10px"
      gap="2px"
      alignItems="center"
      p="1"
      maxW="full"
      className="no-scrollbar"
    >
      {Array.from({ length: count }, function renderBox(_, i) {
        const pIdx = i + 1
        const isCurrent = pIdx === currentParagraphIndex
        const stat = statsMap.get(pIdx)
        const visits = stat?.visit_count || 0
        const hasInteractions = stat?.is_bookmarked === 1 || (stat?.upvotes_count || 0) > 0
        const isVisited = visits > 0 || isCurrent || hasInteractions
        const isSkipped = stat?.is_skipped === 1

        const pKey = `${bookId}_${chapterIndex}_${pIdx}`
        const pColor = paragraphColors[pKey] || defaultHeatmapColor || 'blue'
        const scale = getRadixScale(pColor, isDark)

        const solidColor = scale[`${pColor}9`] || '#0090ff'
        const strongColor = scale[`${pColor}8`] || '#0070f3'
        const mediumColor = scale[`${pColor}6`] || '#1a5699'
        const mediumBorder = scale[`${pColor}7`] || '#0070f3'
        const strongBorder = scale[`${pColor}9`] || '#3291ff'
        const solidBorder = scale[`${pColor}10`] || '#0091ff'

        // Background for unvisited paragraphs (unified design token with chapter heatmap):
        let bg = 'var(--chakra-colors-heatmap-empty)'
        let border = '1px solid transparent'

        if (isSkipped) {
          bg = 'var(--chakra-colors-gray-muted, #333)'
          border = '1px dashed var(--chakra-colors-gray-8, #555)'
        } else if (visits > 5) {
          bg = solidColor
          border = `1px solid ${solidBorder}`
        } else if (visits >= 3) {
          bg = strongColor
          border = `1px solid ${strongBorder}`
        } else if (isVisited) {
          bg = mediumColor
          border = `1px solid ${mediumBorder}`
        }

        const tooltip = `Paragraph ${pIdx} • ${visits} visits${isSkipped ? ' (Skipped)' : ''}`

        return (
          <Box
            key={pIdx}
            w="10px"
            h="10px"
            minW="10px"
            minH="10px"
            boxSizing="border-box"
            rounded="1px"
            cursor="pointer"
            title={tooltip}
            style={{
              backgroundColor: bg,
              border: isCurrent ? `1px solid ${solidColor}` : border,
              boxShadow: isCurrent
                ? `0 0 0 1.5px ${solidColor}, 0 0 6px ${solidColor}99`
                : 'none',
              opacity: isSkipped ? 0.35 : 1,
              transition: 'transform 0.12s ease, background-color 0.15s ease',
            }}
            _hover={{
              transform: 'scale(1.35)',
              zIndex: 10,
            }}
            onClick={function handleParagraphClick() {
              onSelectParagraph(pIdx)
            }}
          />
        )
      })}
    </Grid>
  )
}

