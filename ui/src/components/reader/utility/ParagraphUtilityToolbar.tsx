import React, { useState } from 'react'
import {
  Box,
  Button,
  HStack,
  NativeSelect,
  Separator,
  Text,
} from '@chakra-ui/react'
import {
  FastForward,
  Type,
  Clock,
  FileText,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react'
import type { ParagraphStat } from '@/lib/types'

export interface ParagraphUtilityToolbarProps {
  stats: {
    words: number
    characters: number
    readingMinutes: number
  }
  paragraphStat?: ParagraphStat | null
  onToggleSkip: (isSkipped: boolean) => void
  onUpdateStyle: (fontFamily: string, fontSize: number) => void
}

const FONT_FAMILIES = [
  { value: '', label: 'Default Reader Font' },
  { value: 'Literata', label: 'Literata (Book Serif)' },
  { value: 'Newsreader', label: 'Newsreader (Editorial)' },
  { value: 'Fraunces', label: 'Fraunces (Display)' },
  { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans' },
  { value: 'JetBrains Mono', label: 'JetBrains Mono' },
]

export function ParagraphUtilityToolbar({
  stats,
  paragraphStat,
  onToggleSkip,
  onUpdateStyle,
}: ParagraphUtilityToolbarProps) {
  const [showTypography, setShowTypography] = useState(false)

  const isSkipped = paragraphStat?.is_skipped === 1
  const currentFontFamily = paragraphStat?.custom_font_family || ''
  const currentFontSize = paragraphStat?.custom_font_size || 0

  return (
    <Box
      py="2"
      px="4"
      rounded="xl"
      bg="bg.panel"
      borderWidth="1px"
      borderColor={isSkipped ? 'amber.subtle' : 'border.subtle'}
      shadow="xs"
      w="full"
      transition="all 0.2s ease"
    >
      <HStack justify="space-between" align="center" flexWrap="wrap" gap="3">
        {/* Left Side: Stats (Word count, Char count, Reading time) */}
        <HStack gap="3" color="fg.muted">
          <HStack gap="1.5">
            <FileText size={13} />
            <Text textStyle="xs">
              <Text as="span" fontWeight="semibold" color="fg">
                {stats.words}
              </Text>{' '}
              words
            </Text>
          </HStack>

          <Separator orientation="vertical" h="3" borderColor="border.subtle" />

          <Text textStyle="xs">
            <Text as="span" fontWeight="semibold" color="fg">
              {stats.characters}
            </Text>{' '}
            chars
          </Text>

          <Separator orientation="vertical" h="3" borderColor="border.subtle" />

          <HStack gap="1">
            <Clock size={12} />
            <Text textStyle="xs">{stats.readingMinutes} min read</Text>
          </HStack>
        </HStack>

        {/* Right Side: Utilities (Skip Toggle, Typography Override) */}
        <HStack gap="2">
          {/* Typography Override Toggle */}
          <Button
            size="2xs"
            variant={currentFontFamily || currentFontSize ? 'solid' : 'ghost'}
            colorPalette={currentFontFamily || currentFontSize ? 'ruby' : 'gray'}
            onClick={function toggleTypo() {
              setShowTypography(!showTypography)
            }}
          >
            <SlidersHorizontal size={12} />
            <Text textStyle="2xs">Style</Text>
          </Button>

          {/* Skip Paragraph Toggle */}
          <Button
            size="2xs"
            variant={isSkipped ? 'solid' : 'outline'}
            colorPalette={isSkipped ? 'amber' : 'gray'}
            onClick={function handleSkip() {
              onToggleSkip(!isSkipped)
            }}
          >
            <FastForward size={12} />
            <Text textStyle="2xs">{isSkipped ? 'Skipped' : 'Skip'}</Text>
          </Button>
        </HStack>
      </HStack>

      {/* Typography Controls Popover */}
      {showTypography && (
        <Box mt="3" pt="3" borderTopWidth="1px" borderColor="border.subtle">
          <HStack gap="3" align="center">
            <HStack gap="2" flex="1">
              <Type size={13} color="var(--chakra-colors-fg-muted)" />
              <NativeSelect.Root size="xs" maxW="12rem">
                <NativeSelect.Field
                  value={currentFontFamily}
                  onChange={function onFontChange(e) {
                    onUpdateStyle(e.target.value, currentFontSize)
                  }}
                >
                  {FONT_FAMILIES.map(function renderF(f) {
                    return (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    )
                  })}
                </NativeSelect.Field>
              </NativeSelect.Root>
            </HStack>

            <HStack gap="1">
              <Button
                size="2xs"
                variant="outline"
                disabled={currentFontSize <= 12 && currentFontSize !== 0}
                onClick={function decreaseFont() {
                  const base = currentFontSize || 18
                  onUpdateStyle(currentFontFamily, Math.max(12, base - 1))
                }}
              >
                A-
              </Button>
              <Text textStyle="2xs" w="6" textAlign="center">
                {currentFontSize || 'Auto'}
              </Text>
              <Button
                size="2xs"
                variant="outline"
                disabled={currentFontSize >= 28}
                onClick={function increaseFont() {
                  const base = currentFontSize || 18
                  onUpdateStyle(currentFontFamily, Math.min(28, base + 1))
                }}
              >
                A+
              </Button>

              {(currentFontFamily || currentFontSize > 0) && (
                <Button
                  size="2xs"
                  variant="ghost"
                  colorPalette="ruby"
                  title="Reset custom style"
                  onClick={function resetStyle() {
                    onUpdateStyle('', 0)
                  }}
                >
                  <RotateCcw size={11} />
                </Button>
              )}
            </HStack>
          </HStack>
        </Box>
      )}
    </Box>
  )
}
