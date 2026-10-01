import React, { useState } from 'react'
import {
  Box,
  Button,
  HStack,
  IconButton,
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
  Bookmark,
  ArrowBigUp,
  Plus,
  Sparkles,
} from 'lucide-react'
import EmojiPicker, { EmojiClickData, Theme as EmojiTheme } from 'emoji-picker-react'
import { useAtom } from 'jotai'
import { toggleBionicAtom } from '@/state/atoms'
import type { ParagraphStat, SentenceEmojiReaction } from '@/lib/types'

export interface ParagraphUtilityToolbarProps {
  stats: {
    words: number
    characters: number
    readingMinutes: number
  }
  paragraphStat?: ParagraphStat | null
  onToggleBookmark?: (isBookmarked: boolean) => void
  onIncrementUpvote?: () => void
  onAddReaction?: (emoji: string) => void
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

const QUICK_EMOJIS = ['👍', '❤️', '💡', '🔥', '😮']

export function ParagraphUtilityToolbar({
  stats,
  paragraphStat,
  onToggleBookmark,
  onIncrementUpvote,
  onAddReaction,
  onToggleSkip,
  onUpdateStyle,
}: ParagraphUtilityToolbarProps) {
  const [showTypography, setShowTypography] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isBionicEnabled, toggleBionic] = useAtom(toggleBionicAtom)

  const isSkipped = paragraphStat?.is_skipped === 1
  const isBookmarked = paragraphStat?.is_bookmarked === 1
  const upvotes = paragraphStat?.upvotes_count || 0
  const currentFontFamily = paragraphStat?.custom_font_family || ''
  const currentFontSize = paragraphStat?.custom_font_size || 0

  let reactions: SentenceEmojiReaction[] = []
  try {
    if (paragraphStat?.emoji_reactions) {
      reactions = JSON.parse(paragraphStat.emoji_reactions)
    }
  } catch {
    reactions = []
  }

  function handleEmojiClick(data: EmojiClickData) {
    onAddReaction?.(data.emoji)
    setShowEmojiPicker(false)
  }

  return (
    <Box position="relative">
      <HStack align="center" gap="2.5" flexWrap="nowrap">
        {/* Stats: Word count, Char count, Reading time */}
        <HStack gap="2" color="fg.muted" flexShrink={0}>
          <HStack gap="1">
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
            <Text textStyle="xs">{stats.readingMinutes} min</Text>
          </HStack>
        </HStack>

        <Separator orientation="vertical" h="3.5" borderColor="border.subtle" mx="0.5" flexShrink={0} />

        {/* Paragraph-level Actions: Bookmark, Upvote, Emojis */}
        <HStack gap="1" flexShrink={0}>
          {/* Paragraph Bookmark Toggle */}
          <IconButton
            size="xs"
            variant={isBookmarked ? 'solid' : 'ghost'}
            colorPalette={isBookmarked ? 'ruby' : 'gray'}
            aria-label="Bookmark paragraph"
            title="Bookmark paragraph"
            onClick={function handleBookmark() {
              onToggleBookmark?.(isBookmarked)
            }}
          >
            <Bookmark size={14} fill={isBookmarked ? 'currentColor' : 'none'} />
          </IconButton>

          {/* Paragraph Upvote */}
          <Button
            size="xs"
            variant={upvotes > 0 ? 'subtle' : 'ghost'}
            colorPalette={upvotes > 0 ? 'ruby' : 'gray'}
            px="2"
            h="7"
            rounded="md"
            title="Applaud / Upvote paragraph"
            onClick={function handleUpvote() {
              onIncrementUpvote?.()
            }}
          >
            <ArrowBigUp size={15} fill={upvotes > 0 ? 'currentColor' : 'none'} />
            {upvotes > 0 && (
              <Text textStyle="xs" fontWeight="bold">
                {upvotes}
              </Text>
            )}
          </Button>

          {/* Existing Reaction Badges */}
          {reactions.map(function renderReaction(r) {
            return (
              <Button
                key={r.emoji}
                size="xs"
                variant="surface"
                colorPalette="gray"
                rounded="full"
                px="2"
                py="0.5"
                h="6"
                onClick={function clickReaction() {
                  onAddReaction?.(r.emoji)
                }}
              >
                <span>{r.emoji}</span>
                <Text as="span" textStyle="2xs" fontWeight="semibold" ml="1">
                  {r.count}
                </Text>
              </Button>
            )
          })}

          {/* Quick Emojis */}
          <HStack gap="0.5">
            {QUICK_EMOJIS.map(function renderQuickEmoji(em) {
              return (
                <Button
                  key={em}
                  size="xs"
                  variant="ghost"
                  px="1"
                  h="7"
                  fontSize="xs"
                  onClick={function clickQuickEmoji() {
                    onAddReaction?.(em)
                  }}
                >
                  {em}
                </Button>
              )
            })}
            <IconButton
              size="xs"
              variant="ghost"
              colorPalette="gray"
              aria-label="More emojis"
              title="Add emoji reaction to paragraph"
              onClick={function togglePicker() {
                setShowEmojiPicker(!showEmojiPicker)
              }}
            >
              <Plus size={13} />
            </IconButton>
          </HStack>
        </HStack>

        <Separator orientation="vertical" h="3.5" borderColor="border.subtle" mx="0.5" flexShrink={0} />

        {/* Utilities: Bionic Reading Toggle, Style Override, Skip */}
        <HStack gap="1.5" flexShrink={0}>
          {/* Bionic Reading Toggle */}
          <Button
            size="xs"
            variant={isBionicEnabled ? 'subtle' : 'ghost'}
            colorPalette={isBionicEnabled ? 'teal' : 'gray'}
            title="Toggle Bionic Reading (anchor fixation)"
            onClick={function handleToggleBionic() {
              toggleBionic()
            }}
          >
            <Sparkles size={13} />
            <Text textStyle="xs">Bionic</Text>
          </Button>

          {/* Typography Override Toggle */}
          <Button
            size="xs"
            variant={currentFontFamily || currentFontSize ? 'solid' : 'ghost'}
            colorPalette={currentFontFamily || currentFontSize ? 'ruby' : 'gray'}
            onClick={function toggleTypo() {
              setShowTypography(!showTypography)
            }}
          >
            <SlidersHorizontal size={13} />
            <Text textStyle="xs">Style</Text>
          </Button>

          {/* Skip Paragraph Toggle */}
          <Button
            size="xs"
            variant={isSkipped ? 'solid' : 'outline'}
            colorPalette={isSkipped ? 'amber' : 'gray'}
            onClick={function handleSkip() {
              onToggleSkip(!isSkipped)
            }}
          >
            <FastForward size={13} />
            <Text textStyle="xs">{isSkipped ? 'Skipped' : 'Skip'}</Text>
          </Button>
        </HStack>
      </HStack>

      {/* Full Emoji Picker Popover */}
      {showEmojiPicker && (
        <Box
          position="absolute"
          bottom="100%"
          left="120px"
          mb="2"
          zIndex="popover"
          shadow="xl"
          rounded="xl"
          overflow="hidden"
        >
          <EmojiPicker
            theme={EmojiTheme.AUTO}
            onEmojiClick={handleEmojiClick}
            width={300}
            height={380}
          />
        </Box>
      )}

      {/* Typography Controls Popover */}
      {showTypography && (
        <Box
          position="absolute"
          bottom="100%"
          left="200px"
          mb="2"
          p="3"
          bg="bg.panel"
          borderWidth="1px"
          borderColor="border.subtle"
          rounded="xl"
          shadow="lg"
          zIndex="popover"
        >
          <HStack gap="3" align="center">
            <HStack gap="2">
              <Type size={14} color="var(--chakra-colors-fg-muted)" />
              <NativeSelect.Root size="xs" minW="11rem">
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
                size="xs"
                variant="outline"
                disabled={currentFontSize <= 12 && currentFontSize !== 0}
                onClick={function decreaseFont() {
                  const base = currentFontSize || 18
                  onUpdateStyle(currentFontFamily, Math.max(12, base - 1))
                }}
              >
                A-
              </Button>
              <Text textStyle="xs" w="6" textAlign="center">
                {currentFontSize || 'Auto'}
              </Text>
              <Button
                size="xs"
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
                  size="xs"
                  variant="ghost"
                  colorPalette="ruby"
                  title="Reset custom style"
                  onClick={function resetStyle() {
                    onUpdateStyle('', 0)
                  }}
                >
                  <RotateCcw size={12} />
                </Button>
              )}
            </HStack>
          </HStack>
        </Box>
      )}
    </Box>
  )
}
