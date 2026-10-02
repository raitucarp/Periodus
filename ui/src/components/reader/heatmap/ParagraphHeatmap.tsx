import React from 'react'
import { Box } from '@chakra-ui/react'
import type { ParagraphStat } from '@/lib/types'

export interface ParagraphHeatmapProps {
  totalParagraphs: number
  stats: ParagraphStat[]
  currentParagraphIndex: number
  onSelectParagraph: (index: number) => void
}

export function ParagraphHeatmap({
  totalParagraphs,
  stats,
  currentParagraphIndex,
  onSelectParagraph,
}: ParagraphHeatmapProps) {
  const count = Math.max(totalParagraphs, stats.length, 1)

  // Map paragraph_index -> ParagraphStat
  const statsMap = new Map<number, ParagraphStat>()
  for (const s of stats) {
    statsMap.set(s.paragraph_index, s)
  }

  return (
    <Box
      display="grid"
      gridTemplateRows="repeat(3, 10px)"
      gridAutoFlow="column"
      gap="1.5px"
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

        // Blue scale for visited paragraphs / hits:
        // 0 visits -> subtle tomato-gray tile with visible border
        // 1-2 visits (or visited/current) -> vibrant medium blue (#1a5699)
        // 3-5 visits -> bright electric blue (#0070f3)
        // >5 visits -> solid vivid neon blue (#0091ff)
        let bg = 'color-mix(in srgb, var(--chakra-colors-gray-subtle, #1f1f1f) 85%, var(--chakra-colors-tomato-muted, #e54d2e) 15%)'
        let border = '1px solid var(--chakra-colors-border-subtle, rgba(255, 255, 255, 0.12))'

        if (isSkipped) {
          bg = 'var(--chakra-colors-gray-muted, #333)'
          border = '1px dashed var(--chakra-colors-gray-8, #555)'
        } else if (visits > 5) {
          bg = 'var(--chakra-colors-blue-solid, #0091ff)'
          border = '1px solid var(--chakra-colors-blue-solid, #0091ff)'
        } else if (visits >= 3) {
          bg = '#0070f3'
          border = '1px solid #3291ff'
        } else if (isVisited) {
          bg = '#1a5699'
          border = '1px solid var(--chakra-colors-blue-focus, #0070f3)'
        }

        const tooltip = `Paragraph ${pIdx} • ${visits} visits${isSkipped ? ' (Skipped)' : ''}`

        return (
          <Box
            key={pIdx}
            w="10px"
            h="10px"
            rounded="xs"
            cursor="pointer"
            title={tooltip}
            style={{
              backgroundColor: bg,
              border: isCurrent ? '1.5px solid var(--chakra-colors-blue-solid, #0091ff)' : border,
              boxShadow: isCurrent
                ? '0 0 0 1.5px var(--chakra-colors-blue-solid, #0091ff), 0 0 6px rgba(0, 145, 255, 0.6)'
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
    </Box>
  )
}

