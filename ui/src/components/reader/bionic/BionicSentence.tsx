import React from 'react'
import { Text, Box } from '@chakra-ui/react'

export interface BionicSentenceProps {
  sentence: string
  highlightColor?: string
  isBionicEnabled?: boolean
  fontSize?: string | number
  fontFamily?: string
  lineHeight?: string | number
}

export function BionicSentence({
  sentence,
  highlightColor,
  isBionicEnabled = true,
  fontSize,
  fontFamily,
  lineHeight,
}: BionicSentenceProps) {
  if (!isBionicEnabled) {
    return (
      <Text
        as="span"
        fontSize={fontSize}
        fontFamily={fontFamily}
        lineHeight={lineHeight}
        color="fg"
        bg={highlightColor ? `color-mix(in srgb, var(--chakra-colors-${highlightColor}-subtle, transparent) 50%, transparent)` : 'transparent'}
        px={highlightColor ? '1' : '0'}
        py="0.5"
        rounded="sm"
      >
        {sentence}
      </Text>
    )
  }

  // Split sentence by words and whitespace
  const tokens = sentence.split(/(\s+)/)

  return (
    <Box
      as="span"
      display="inline"
      fontSize={fontSize}
      fontFamily={fontFamily}
      lineHeight={lineHeight}
      bg={highlightColor ? `color-mix(in srgb, var(--chakra-colors-${highlightColor}-subtle, rgba(255,220,100,0.2)) 60%, transparent)` : 'transparent'}
      px={highlightColor ? '1.5' : '0'}
      py="0.5"
      rounded="md"
      transition="background-color 0.2s ease"
    >
      {tokens.map(function renderToken(token, index) {
        // If it's whitespace, return directly
        if (/^\s+$/.test(token)) {
          return <span key={index}>{token}</span>
        }

        // Calculate fixation length (bionic anchor)
        const len = token.length
        let fixationLen = 1
        if (len > 3 && len <= 6) {
          fixationLen = 2
        } else if (len > 6 && len <= 9) {
          fixationLen = 3
        } else if (len > 9) {
          fixationLen = 4
        }

        const fixation = token.slice(0, fixationLen)
        const remainder = token.slice(fixationLen)

        return (
          <span key={index} style={{ display: 'inline' }}>
            <span
              style={{
                fontWeight: 700,
                color: 'var(--chakra-colors-fg, inherit)',
                letterSpacing: '-0.01em',
              }}
            >
              {fixation}
            </span>
            <span
              style={{
                fontWeight: 400,
                opacity: 0.88,
                color: 'var(--chakra-colors-fg, inherit)',
              }}
            >
              {remainder}
            </span>
          </span>
        )
      })}
    </Box>
  )
}
