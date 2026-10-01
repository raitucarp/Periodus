import React from 'react'
import { HStack, Box } from '@chakra-ui/react'
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
    <HStack gap="1" align="center" overflowX="auto" py="1.5" w="full" className="no-scrollbar">
      {Array.from({ length: count }, function renderBox(_, i) {
        const pIdx = i + 1
        const stat = statsMap.get(pIdx)
        const visits = stat?.visit_count || 0
        const isSkipped = stat?.is_skipped === 1
        const isCurrent = pIdx === currentParagraphIndex

        // Radix Blue / Indigo scale:
        // 0 visits -> subtle dark/light surface gray
        // 1-2 visits -> blue subtle
        // 3-6 visits -> blue muted
        // >6 visits -> blue solid / vivid
        let bg = 'var(--chakra-colors-bg-subtle, #1a1a1a)'
        if (isSkipped) {
          bg = 'var(--chakra-colors-gray-muted, #333)'
        } else if (visits > 6) {
          bg = 'var(--chakra-colors-blue-solid, #0091ff)'
        } else if (visits >= 3) {
          bg = 'var(--chakra-colors-blue-muted, #0d3880)'
        } else if (visits >= 1) {
          bg = 'var(--chakra-colors-blue-subtle, #0d2847)'
        }

        const tooltip = `Paragraph ${pIdx} • ${visits} visits${isSkipped ? ' (Skipped)' : ''}`

        return (
          <Box
            key={pIdx}
            flex="1"
            minW="0.5rem"
            maxW="1.5rem"
            h="2"
            rounded="full"
            cursor="pointer"
            title={tooltip}
            style={{
              backgroundColor: bg,
              boxShadow: isCurrent ? '0 0 0 1.5px var(--chakra-colors-blue-solid, #0091ff)' : 'none',
              opacity: isSkipped ? 0.4 : 1,
              transition: 'transform 0.15s ease, background-color 0.15s ease',
            }}
            _hover={{
              transform: 'scaleY(1.75)',
            }}
            onClick={function handleParagraphClick() {
              onSelectParagraph(pIdx)
            }}
          />
        )
      })}
    </HStack>
  )
}
