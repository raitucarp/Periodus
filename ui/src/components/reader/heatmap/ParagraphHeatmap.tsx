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
        const stat = statsMap.get(pIdx)
        const visits = stat?.visit_count || 0
        const isSkipped = stat?.is_skipped === 1
        const isCurrent = pIdx === currentParagraphIndex

        // Radix Blue scale:
        // 0 visits -> subtle tomato-gray tile with visible border (matches ChapterHeatmap)
        // 1-2 visits -> soft blue subtle
        // 3-5 visits -> medium blue muted
        // >5 visits -> vivid blue solid
        let bg = 'color-mix(in srgb, var(--chakra-colors-gray-subtle, #1f1f1f) 85%, var(--chakra-colors-tomato-muted, #e54d2e) 15%)'
        let border = '1px solid var(--chakra-colors-border-subtle, rgba(255, 255, 255, 0.12))'

        if (isSkipped) {
          bg = 'var(--chakra-colors-gray-muted, #333)'
          border = '1px dashed var(--chakra-colors-gray-8, #555)'
        } else if (visits > 5) {
          bg = 'var(--chakra-colors-blue-solid, #0091ff)'
          border = '1px solid var(--chakra-colors-blue-solid, #0091ff)'
        } else if (visits >= 3) {
          bg = 'var(--chakra-colors-blue-muted, #104278)'
          border = '1px solid var(--chakra-colors-blue-a8, #185fab)'
        } else if (visits >= 1) {
          bg = 'var(--chakra-colors-blue-subtle, #0d2847)'
          border = '1px solid var(--chakra-colors-blue-a5, #0f3d6c)'
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

