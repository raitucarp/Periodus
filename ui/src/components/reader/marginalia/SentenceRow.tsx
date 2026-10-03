import React, { useState, useRef, useEffect, useMemo } from 'react'
import {
  Box,
  Button,
  Flex,
  Group,
  HStack,
  IconButton,
  Separator,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import {
  Bookmark,
  ArrowBigUp,
  ArrowBigDown,
  Highlighter,
  Plus,
  Minus,
  Trash2,
  Send,
  Pencil,
  Check,
  X,
} from 'lucide-react'
import { MdOutlineTextFields, MdAbc } from 'react-icons/md'
import EmojiPicker, { Theme as EmojiTheme, type EmojiClickData } from 'emoji-picker-react'
import { useAtomValue, useSetAtom } from 'jotai'
import { useColorMode } from '@/components/ui/color-mode'
import { BionicSentence } from '../bionic/BionicSentence'
import { RADIX_COLORS_ROW_1, RADIX_COLORS_ROW_2, RADIX_HEX_MAP } from '@/lib/radixColors'
import { sentenceFocusedLettersAtom, toggleSentenceLetterAtom } from '@/state/atoms'
import type { SentenceAnnotation, SentenceComment, SentenceEmojiReaction } from '@/lib/types'

const ALPHABET = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
]

function getLetterColor(count: number, max: number, isDark: boolean): { bg: string; border: string } {
  if (count <= 0) {
    return {
      bg: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
      border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.06)',
    }
  }
  const ratio = count / Math.max(max, 1)
  if (isDark) {
    // Subtle, low-distraction scale: from 0.12 (soft dark-gray) to 0.44 (medium gray)
    // Never pure white (1.0), so reading sentence text remains comfortable and distraction-free
    const alpha = (0.12 + ratio * 0.32).toFixed(2)
    const borderAlpha = (parseFloat(alpha) * 0.6).toFixed(2)
    return {
      bg: `rgba(255, 255, 255, ${alpha})`,
      border: `1px solid rgba(255, 255, 255, ${borderAlpha})`,
    }
  } else {
    // Subtle, low-distraction scale: from 0.10 (soft light-gray) to 0.42 (medium gray)
    // Never pitch black (1.0), readable gradient without stark contrast
    const alpha = (0.10 + ratio * 0.32).toFixed(2)
    const borderAlpha = (parseFloat(alpha) * 0.6).toFixed(2)
    return {
      bg: `rgba(0, 0, 0, ${alpha})`,
      border: `1px solid rgba(0, 0, 0, ${borderAlpha})`,
    }
  }
}


interface AutoResizeTextareaProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  minHeight?: number
  maxHeight?: number
  [key: string]: any
}

function AutoResizeTextarea({
  value,
  onChange,
  onKeyDown,
  placeholder,
  minHeight = 28,
  maxHeight = 240,
  ...rest
}: AutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    const newH = Math.min(maxHeight, Math.max(minHeight, el.scrollHeight))
    el.style.height = `${newH}px`
  }, [value, minHeight, maxHeight])

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      rows={1}
      resize="none"
      overflowY={textareaRef.current && textareaRef.current.scrollHeight > maxHeight ? 'auto' : 'hidden'}
      {...rest}
    />
  )
}

export interface SentenceRowProps {
  sentence: string
  sentenceHash: string
  sentenceIndex?: number
  totalSentences?: number
  showSeparator?: boolean
  annotation?: SentenceAnnotation
  comments: SentenceComment[]
  fontFamily?: string
  fontSize?: string | number
  lineHeight?: string | number
  onToggleBookmark: (hash: string, currentVal: boolean) => void
  onIncrementUpvote: (hash: string) => void
  onDecrementUpvote?: (hash: string) => void
  onSetHighlight: (hash: string, color: string) => void
  onAddReaction: (hash: string, emoji: string) => void
  onUpdateReaction?: (hash: string, emoji: string, delta: number) => void
  onAddComment: (hash: string, text: string) => void
  onDeleteComment: (commentId: string, hash: string) => void
  onUpdateComment?: (commentId: string, hash: string, newContent: string) => void
  onToggleCollapse?: (hash: string) => void
}

const DEFAULT_QUICK_EMOJIS = ['👍', '❤️', '💡']

export function SentenceRow({
  sentence,
  sentenceHash,
  sentenceIndex = 0,
  totalSentences = 1,
  showSeparator = false,
  annotation,
  comments,
  fontFamily,
  fontSize,
  lineHeight,
  onToggleBookmark,
  onIncrementUpvote,
  onDecrementUpvote,
  onSetHighlight,
  onAddReaction,
  onUpdateReaction,
  onAddComment,
  onDeleteComment,
  onUpdateComment,
  onToggleCollapse,
}: SentenceRowProps) {
  const [isSentenceHovered, setIsSentenceHovered] = useState(false)
  const [isRowHovered, setIsRowHovered] = useState(false)
  const [isCommentFocused, setIsCommentFocused] = useState(false)
  const [showFullPicker, setShowFullPicker] = useState(false)
  const [showHighlightPicker, setShowHighlightPicker] = useState(false)
  const [newCommentText, setNewCommentText] = useState('')

  const isCollapsed = annotation?.is_collapsed === 1
  const isBookmarked = annotation?.is_bookmarked === 1
  const upvotes = annotation?.upvotes_count || 0
  const highlightColor = annotation?.highlight_color || ''

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editCommentText, setEditCommentText] = useState('')
  const sentenceFocusedMap = useAtomValue(sentenceFocusedLettersAtom)
  const toggleSentenceLetter = useSetAtom(toggleSentenceLetterAtom)
  const focusedLetters = sentenceFocusedMap[sentenceHash] || []

  // Parse emoji reactions
  let reactions: SentenceEmojiReaction[] = []
  try {
    if (annotation?.emoji_reactions) {
      reactions = JSON.parse(annotation.emoji_reactions)
    }
  } catch {
    reactions = []
  }

  // 3 default emoji buttons + 1 dynamic emoji with the highest count (or the last one if tied)
  const quickEmojisToDisplay = useMemo(() => {
    const extraCandidates = reactions.filter(
      (r) => !DEFAULT_QUICK_EMOJIS.includes(r.emoji) && r.count > 0
    )

    let topExtraEmoji = '🔥' // default 4th emoji if no custom reactions exist
    if (extraCandidates.length > 0) {
      let maxCount = -1
      for (const r of extraCandidates) {
        if (r.count >= maxCount) {
          maxCount = r.count
          topExtraEmoji = r.emoji
        }
      }
    }

    return [...DEFAULT_QUICK_EMOJIS, topExtraEmoji]
  }, [reactions])

  const { colorMode } = useColorMode()
  const wordsCount = useMemo(() => sentence.trim().split(/\s+/).filter(Boolean).length, [sentence])
  const charsCount = sentence.length

  const alphabetStats = useMemo(() => {
    const counts: Record<string, number> = {}
    for (let i = 0; i < 26; i++) {
      counts[String.fromCharCode(65 + i)] = 0
    }
    let max = 0
    for (const char of sentence.toUpperCase()) {
      if (char >= 'A' && char <= 'Z') {
        counts[char] = (counts[char] || 0) + 1
        if (counts[char] > max) max = counts[char]
      }
    }
    return { counts, max }
  }, [sentence])


  function handleCommentSubmit(e?: React.FormEvent) {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    const trimmed = newCommentText.trim()
    if (!trimmed) return
    onAddComment(sentenceHash, trimmed)
    setNewCommentText('')
  }

  function handleSaveEdit(commentId: string) {
    const trimmed = editCommentText.trim()
    if (!trimmed) return
    onUpdateComment?.(commentId, sentenceHash, trimmed)
    setEditingCommentId(null)
    setEditCommentText('')
  }

  function handleEmojiClick(emojiData: EmojiClickData) {
    if (onUpdateReaction) {
      onUpdateReaction(sentenceHash, emojiData.emoji, 1)
    } else {
      onAddReaction(sentenceHash, emojiData.emoji)
    }
    setShowFullPicker(false)
  }

  const hasActiveActions = isBookmarked || upvotes !== 0 || Boolean(highlightColor) || reactions.length > 0
  const showCommentInput = isSentenceHovered || isRowHovered || isCommentFocused || newCommentText.length > 0

  return (
    <Box
      py="1.5"
      px="3"
      rounded="xl"
      transition="background-color 0.15s ease"
      _hover={{ bg: 'bg.subtle' }}
      onMouseEnter={function onRowEnter() {
        setIsRowHovered(true)
      }}
      onMouseLeave={function onRowLeave() {
        setIsRowHovered(false)
      }}
      position="relative"
    >
      {/* Seamless Continuous Timeline Vertical Line (from row top 0 to bottom 0 without gaps) */}
      {totalSentences > 1 && (
        <>
          {sentenceIndex !== 0 && (
            <Box
              position="absolute"
              left="19.5px"
              top="0"
              h="16px"
              w="1px"
              bg="fg.subtle"
              opacity={0.35}
              zIndex={1}
            />
          )}
          {sentenceIndex !== totalSentences - 1 && (
            <Box
              position="absolute"
              left="19.5px"
              top="28px"
              bottom="0"
              w="1px"
              bg="fg.subtle"
              opacity={0.35}
              zIndex={1}
            />
          )}
        </>
      )}

      {/* Horizontal Sentence Separator with clear gap from connector line */}
      {showSeparator && (
        <Box
          position="absolute"
          left="44px"
          right="12px"
          bottom="0"
          h="1px"
          bg="border.subtle"
          opacity={0.5}
          zIndex={1}
        />
      )}

      <Flex align="start" gap="3" w="full" position="relative">
        {/* Timeline Marker Column with Clickable Collapse Circle */}
        <Box
          position="relative"
          w="4"
          flexShrink={0}
          alignSelf="stretch"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          {/* Circle dot in front of sentence (non-transparent, higher z-index than vertical line) */}
          <Box
            position="absolute"
            top="15px"
            left="50%"
            transform="translateX(-50%)"
            w="3.5"
            h="3.5"
            rounded="full"
            bg={isCollapsed ? 'red.solid' : 'border.emphasized'}
            opacity={1}
            border={isCollapsed ? '2px solid var(--chakra-colors-red-subtle)' : 'none'}
            boxShadow={isCollapsed ? '0 0 8px var(--chakra-colors-red-focus)' : 'none'}
            zIndex={3}
            cursor="pointer"
            transition="all 0.18s cubic-bezier(0.4, 0, 0.2, 1)"
            _hover={{
              transform: 'translateX(-50%) scale(1.3)',
              bg: isCollapsed ? 'red.focus' : 'ruby.solid',
            }}
            title={isCollapsed ? 'Expand sentence' : 'Collapse sentence'}
            onClick={(e) => {
              e.stopPropagation()
              onToggleCollapse?.(sentenceHash)
            }}
          />
        </Box>

        {/* Left Column: Sentence & Action Bar (hovering here only reveals the action toolbar) */}
        <Box
          flex="1"
          minW="0"
          position="relative"
          onMouseEnter={function onEnter() {
            setIsSentenceHovered(true)
          }}
          onMouseLeave={function onLeave() {
            setIsSentenceHovered(false)
            setShowHighlightPicker(false)
          }}
        >
          {/* Sentence text container (truncated to 1 line with ellipsis when collapsed) */}
          <Box
            mb={isCollapsed ? '0' : '1.5'}
            whiteSpace={isCollapsed ? 'nowrap' : 'normal'}
            overflow={isCollapsed ? 'hidden' : 'visible'}
            textOverflow={isCollapsed ? 'ellipsis' : 'clip'}
            maxW="100%"
            cursor={isCollapsed ? 'pointer' : 'default'}
            onClick={isCollapsed ? () => onToggleCollapse?.(sentenceHash) : undefined}
            title={isCollapsed ? sentence : undefined}
            opacity={isCollapsed ? 0.75 : 1}
            transition="opacity 0.2s ease"
          >
            <BionicSentence
              sentence={sentence}
              highlightColor={highlightColor}
              fontFamily={fontFamily}
              fontSize={fontSize}
              lineHeight={lineHeight}
              focusedLetters={focusedLetters}
            />
          </Box>

          {/* In-flow Action Toolbar (hidden when collapsed) */}
          {!isCollapsed && (
            <Flex
              align="center"
              justify="space-between"
              w="full"
              m="0"
              p="0"
              h="8"
              minH="8"
              position="relative"
              opacity={isSentenceHovered || isRowHovered ? 1 : 0.82}
              transition="opacity 0.2s ease"
            >
              {/* Left Actions: Bookmark, Upvote, Downvote, Highlight (Twitter/X style subtle circular hover & colored icon) */}
              <HStack gap="2" align="center" m="0" p="0">
                {/* Bookmark Toggle */}
                <IconButton
                  size="xs"
                  h="8"
                  minW="8"
                  w="8"
                  rounded="full"
                  variant="ghost"
                  bg="transparent"
                  color={isBookmarked ? 'blue.fg' : 'fg.subtle'}
                  opacity={isBookmarked ? 1 : 0.65}
                  _hover={{
                    opacity: 1,
                    bg: 'color-mix(in srgb, var(--chakra-colors-blue-solid, #1d9bf0) 14%, transparent)',
                    color: 'blue.fg',
                  }}
                  aria-label="Bookmark"
                  title="Bookmark sentence"
                  onClick={function handleBookmark() {
                    onToggleBookmark(sentenceHash, isBookmarked)
                  }}
                >
                  <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
                </IconButton>

                {/* Upvote & Downvote Controls */}
                <HStack gap="1" align="center">
                  <Button
                    size="xs"
                    h="8"
                    px="2"
                    minW={upvotes > 0 ? undefined : '8'}
                    w={upvotes > 0 ? undefined : '8'}
                    rounded="full"
                    variant="ghost"
                    bg="transparent"
                    color={upvotes > 0 ? 'green.fg' : 'fg.subtle'}
                    opacity={upvotes > 0 ? 1 : 0.65}
                    _hover={{
                      opacity: 1,
                      bg: 'color-mix(in srgb, var(--chakra-colors-green-solid, #00ba7c) 14%, transparent)',
                      color: 'green.fg',
                    }}
                    title="Upvote sentence"
                    onClick={function handleUpvote() {
                      onIncrementUpvote(sentenceHash)
                    }}
                  >
                    <ArrowBigUp size={19} fill={upvotes > 0 ? 'currentColor' : 'none'} />
                    {upvotes > 0 && (
                      <Text textStyle="xs" fontWeight="bold">
                        {upvotes}
                      </Text>
                    )}
                  </Button>

                  <Button
                    size="xs"
                    h="8"
                    px={upvotes < 0 ? '2' : '1'}
                    minW={upvotes < 0 ? undefined : '8'}
                    w={upvotes < 0 ? undefined : '8'}
                    rounded="full"
                    variant="ghost"
                    bg="transparent"
                    color={upvotes < 0 ? 'red.fg' : 'fg.subtle'}
                    opacity={upvotes < 0 ? 1 : 0.65}
                    _hover={{
                      opacity: 1,
                      bg: 'color-mix(in srgb, var(--chakra-colors-red-solid, #f91880) 14%, transparent)',
                      color: 'red.fg',
                    }}
                    aria-label="Downvote sentence"
                    title="Downvote sentence"
                    onClick={function handleDownvote() {
                      onDecrementUpvote?.(sentenceHash)
                    }}
                  >
                    <ArrowBigDown size={19} fill={upvotes < 0 ? 'currentColor' : 'none'} />
                    {upvotes < 0 && (
                      <Text textStyle="xs" fontWeight="bold">
                        {Math.abs(upvotes)}
                      </Text>
                    )}
                  </Button>
                </HStack>

                {/* Highlight Color Picker */}
                <Box position="relative">
                  <IconButton
                    size="xs"
                    h="8"
                    minW="8"
                    w="8"
                    rounded="full"
                    variant="ghost"
                    bg="transparent"
                    color={
                      highlightColor
                        ? RADIX_HEX_MAP[highlightColor] || 'amber.fg'
                        : 'fg.subtle'
                    }
                    opacity={highlightColor ? 1 : 0.65}
                    _hover={{
                      opacity: 1,
                      bg: 'color-mix(in srgb, var(--chakra-colors-amber-solid, #f59e0b) 16%, transparent)',
                      color: highlightColor ? RADIX_HEX_MAP[highlightColor] || 'amber.fg' : 'amber.fg',
                    }}
                    aria-label="Highlight"
                    title="Highlight sentence"
                    onClick={function toggleHighlightPicker() {
                      setShowHighlightPicker(!showHighlightPicker)
                    }}
                  >
                    <Highlighter size={18} fill={highlightColor ? 'currentColor' : 'none'} />
                  </IconButton>

                  {showHighlightPicker && (
                    <Box
                      position="absolute"
                      bottom="calc(100% + 8px)"
                      left="0"
                      bg="bg.panel"
                      borderWidth="1px"
                      borderColor="border.subtle"
                      p="2"
                      rounded="xl"
                      shadow="2xl"
                      zIndex="dropdown"
                      display="flex"
                      flexDirection="column"
                      gap="1.5"
                      userSelect="none"
                    >
                      {/* Row 1 */}
                      <HStack gap="1.5" align="center">
                        {RADIX_COLORS_ROW_1.map((c) => (
                          <Box
                            key={c.name}
                            w="5"
                            h="5"
                            rounded="md"
                            bg={c.hex}
                            cursor="pointer"
                            role="button"
                            aria-label={c.label}
                            border="1px solid rgba(0,0,0,0.15)"
                            outline={highlightColor === c.name ? '2px solid var(--chakra-colors-fg)' : 'none'}
                            outlineOffset="1px"
                            transition="transform 0.12s ease"
                            _hover={{ transform: 'scale(1.22)' }}
                            title={c.label}
                            onClick={(e) => {
                              e.stopPropagation()
                              onSetHighlight(sentenceHash, c.name)
                              setShowHighlightPicker(false)
                            }}
                          />
                        ))}
                      </HStack>

                      {/* Row 2 */}
                      <HStack gap="1.5" align="center">
                        {RADIX_COLORS_ROW_2.map((c) => (
                          <Box
                            key={c.name}
                            w="5"
                            h="5"
                            rounded="md"
                            bg={c.hex}
                            cursor="pointer"
                            role="button"
                            aria-label={c.label}
                            border="1px solid rgba(0,0,0,0.15)"
                            outline={highlightColor === c.name ? '2px solid var(--chakra-colors-fg)' : 'none'}
                            outlineOffset="1px"
                            transition="transform 0.12s ease"
                            _hover={{ transform: 'scale(1.22)' }}
                            title={c.label}
                            onClick={(e) => {
                              e.stopPropagation()
                              onSetHighlight(sentenceHash, c.name)
                              setShowHighlightPicker(false)
                            }}
                          />
                        ))}
                        {/* Clear / None button */}
                        <IconButton
                          size="2xs"
                          w="5"
                          h="5"
                          minW="5"
                          variant="ghost"
                          rounded="md"
                          border="1px dashed"
                          borderColor="border.subtle"
                          title="Remove highlight"
                          _hover={{ bg: 'ruby.subtle', color: 'ruby.fg' }}
                          onClick={(e) => {
                            e.stopPropagation()
                            onSetHighlight(sentenceHash, '')
                            setShowHighlightPicker(false)
                          }}
                        >
                          <X size={12} />
                        </IconButton>
                      </HStack>
                    </Box>
                  )}
                </Box>
              </HStack>

              {/* Middle: Sentence Stats (words, chars) & 1-row Alphabet Heatmap */}
              <HStack gap="3.5" align="center" mx="auto" px="2" py="0.5" flexShrink={0} userSelect="none">
                {/* Sentence Word & Char Stats - Readable yet non-distracting scale, no wrapping */}
                <HStack
                  gap="2.5"
                  color="fg.subtle"
                  opacity={0.75}
                  _hover={{ opacity: 1 }}
                  transition="opacity 0.15s ease"
                  flexShrink={0}
                  whiteSpace="nowrap"
                >
                  <HStack gap="1.5" align="center" flexShrink={0} whiteSpace="nowrap">
                    <MdOutlineTextFields size={16} />
                    <Text fontSize="xs" color="fg.subtle" whiteSpace="nowrap">
                      <Text as="span" fontWeight="semibold" color="fg.muted">
                        {wordsCount}
                      </Text>{' '}
                      words
                    </Text>
                  </HStack>

                  <Separator orientation="vertical" h="3.5" borderColor="border.subtle" opacity={0.4} flexShrink={0} />

                  <HStack gap="1.5" align="center" flexShrink={0} whiteSpace="nowrap">
                    <MdAbc size={19} />
                    <Text fontSize="xs" color="fg.subtle" whiteSpace="nowrap">
                      <Text as="span" fontWeight="semibold" color="fg.muted">
                        {charsCount}
                      </Text>{' '}
                      chars
                    </Text>
                  </HStack>
                </HStack>

                <Separator orientation="vertical" h="3.5" borderColor="border.subtle" opacity={0.4} flexShrink={0} />

                {/* 1-row Alphabet Heatmap (26 letters A-Z, compact size, clickable only if letter exists in sentence) */}
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(26, 7.5px)"
                  gridTemplateRows="7px"
                  gap="1px"
                  alignItems="center"
                  p="0.5"
                  rounded="1px"
                  flexShrink={0}
                >
                  {ALPHABET.map((letter) => {
                    const count = alphabetStats.counts[letter] || 0
                    const hasOccurrences = count > 0
                    const { bg, border } = getLetterColor(count, alphabetStats.max, colorMode === 'dark')
                    const isFocused = focusedLetters.includes(letter)

                    return (
                      <Box
                        key={letter}
                        w="7.5px"
                        h="7px"
                        rounded="1px"
                        style={{
                          backgroundColor: bg,
                          border,
                          boxShadow: isFocused ? '0 0 0 1.5px var(--chakra-colors-blue-solid, #3b82f6)' : 'none',
                          transform: isFocused ? 'scale(1.25)' : undefined,
                          zIndex: isFocused ? 5 : undefined,
                          transition: 'transform 0.12s ease, box-shadow 0.12s ease',
                        }}
                        cursor={hasOccurrences ? 'pointer' : 'default'}
                        title={
                          hasOccurrences
                            ? `${letter}: ${count} occurrence${count === 1 ? '' : 's'}${isFocused ? ' (Active: click to deselect)' : ' (Click to toggle bold in sentence)'}`
                            : `${letter}: 0 occurrences`
                        }
                        _hover={
                          hasOccurrences
                            ? {
                                transform: 'scale(1.3)',
                                zIndex: 10,
                              }
                            : undefined
                        }
                        onClick={
                          hasOccurrences
                            ? (e) => {
                                e.stopPropagation()
                                toggleSentenceLetter({ sentenceHash, letter })
                              }
                            : undefined
                        }
                      />
                    )
                  })}
                </Box>
              </HStack>

              {/* Right: Borderless Ghost Emoji Bar + Added Badges to its right */}
              <HStack gap="1.5" align="center" m="0" p="0">
                {/* Borderless Ghost Emoji Buttons with Grayscale Effect (3 default + 1 top/latest reaction) */}
                <HStack gap="0.5" align="center" m="0" p="0" bg="transparent" borderWidth="0">
                  {quickEmojisToDisplay.map(function renderQuickEmoji(em) {
                    const isEmojiActive = reactions.some((r) => r.emoji === em && r.count > 0)
                    return (
                      <Button
                        key={em}
                        size="xs"
                        variant="ghost"
                        px="1.5"
                        h="8"
                        minW="8"
                        fontSize="sm"
                        bg="transparent"
                        borderWidth="0"
                        filter={isEmojiActive ? 'none' : 'grayscale(100%)'}
                        opacity={isEmojiActive ? 1 : 0.45}
                        transition="filter 0.2s ease, opacity 0.2s ease, transform 0.15s ease"
                        _hover={{
                          filter: 'none',
                          opacity: 1,
                          bg: 'bg.subtle',
                          transform: 'scale(1.2)',
                        }}
                        onClick={function sendQuickEmoji() {
                          if (onUpdateReaction) {
                            onUpdateReaction(sentenceHash, em, 1)
                          } else {
                            onAddReaction(sentenceHash, em)
                          }
                        }}
                      >
                        {em}
                      </Button>
                    )
                  })}
                  <IconButton
                    size="xs"
                    variant="ghost"
                    h="8"
                    minW="8"
                    rounded="full"
                    bg="transparent"
                    borderWidth="0"
                    color="fg.subtle"
                    opacity={0.55}
                    _hover={{ bg: 'bg.subtle', color: 'fg', opacity: 1 }}
                    aria-label="More Emojis"
                    title="Open full emoji picker"
                    onClick={function openPicker() {
                      setShowFullPicker(!showFullPicker)
                    }}
                  >
                    <Plus size={15} />
                  </IconButton>
                </HStack>

                {/* Added Emoji Badges (on the right of emoji buttons, no border, large emoji, top-right count badge, bottom-right minus button) */}
                {reactions.map(function renderActiveReaction(r) {
                  return (
                    <Box
                      key={r.emoji}
                      position="relative"
                      display="inline-flex"
                      alignItems="center"
                      justifyContent="center"
                      px="1"
                      py="0.5"
                      mx="1"
                      cursor="pointer"
                      userSelect="none"
                      title={`${r.emoji} • ${r.count} (Click to increase, - to decrease)`}
                      onClick={function inc() {
                        if (onUpdateReaction) {
                          onUpdateReaction(sentenceHash, r.emoji, 1)
                        } else {
                          onAddReaction(sentenceHash, r.emoji)
                        }
                      }}
                    >
                      {/* Large Emoji Character */}
                      <Text as="span" fontSize="lg" lineHeight="1">
                        {r.emoji}
                      </Text>

                      {/* Count Badge in Top Right Corner */}
                      <Box
                        position="absolute"
                        top="-4px"
                        right="-5px"
                        minW="3.5"
                        h="3.5"
                        px="1"
                        rounded="full"
                        bg="ruby.solid"
                        color="white"
                        fontSize="2xs"
                        fontWeight="bold"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        lineHeight="1"
                        zIndex={2}
                        pointerEvents="none"
                      >
                        {r.count}
                      </Box>

                      {/* Small Minus Button in Bottom Right Corner */}
                      <Box
                        position="absolute"
                        bottom="-4px"
                        right="-5px"
                        w="3.5"
                        h="3.5"
                        rounded="full"
                        bg="bg.panel"
                        color="fg.subtle"
                        borderWidth="1px"
                        borderColor="border.subtle"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        zIndex={2}
                        cursor="pointer"
                        _hover={{ color: 'ruby.fg', borderColor: 'ruby.focus', bg: 'ruby.subtle' }}
                        title="Decrease (-1, remove if 0)"
                        onClick={function dec(e) {
                          e.stopPropagation()
                          onUpdateReaction?.(sentenceHash, r.emoji, -1)
                        }}
                      >
                        <Minus size={8} />
                      </Box>
                    </Box>
                  )
                })}
              </HStack>
            </Flex>
          )}


          {/* Full Emoji Picker Popover */}
          {showFullPicker && (
            <Box position="absolute" right="0" zIndex="popover" mt="1" shadow="xl" rounded="xl" overflow="hidden">
              <EmojiPicker
                theme={EmojiTheme.AUTO}
                onEmojiClick={handleEmojiClick}
                width={300}
                height={380}
              />
            </Box>
          )}
        </Box>

        {/* Thin Connecting Line Between Left Sentence & Right Marginalia */}
        {!isCollapsed && (
          <Box
            w="6"
            h="1px"
            mt="4.5"
            bg="fg.subtle"
            opacity={showCommentInput ? 0.45 : 0}
            transition="opacity 0.2s ease"
            flexShrink={0}
          />
        )}

        {/* Right Column: Marginalia / Comments (Aligned with first line via pt="2.5", JetBrains Mono monospace font, larger text) */}
        {!isCollapsed && (
          <Box w="38%" minW="14rem" maxW="22rem" flexShrink={0} pt="2.5">
          <VStack align="stretch" gap="1.5">
            {/* Existing Comments List */}
            {comments.map(function renderComment(c, cIdx) {
              const isLast = cIdx === comments.length - 1
              const isEditing = editingCommentId === c.id

              return (
                <Flex key={c.id} align="start" gap="2" position="relative" role="group">
                  {/* Circle indicator in front of comment & vertical connector for multiple comments (only if > 1 note) */}
                  {comments.length > 1 && (
                    <Box
                      position="relative"
                      w="2"
                      flexShrink={0}
                      alignSelf="stretch"
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      {/* Circle dot marker */}
                      <Box
                        w="1.5"
                        h="1.5"
                        mt="1.5"
                        rounded="full"
                        bg="fg.subtle"
                        opacity={0.35}
                        zIndex={1}
                      />

                      {/* Vertical connector line between comments */}
                      {!isLast && (
                        <Box
                          position="absolute"
                          top="12px"
                          bottom="-6px"
                          w="1px"
                          bg="fg.subtle"
                          opacity={0.35}
                        />
                      )}
                    </Box>
                  )}

                  {/* Comment Content / Editor */}
                  {isEditing ? (
                    <VStack align="stretch" gap="1" flex="1">
                      <AutoResizeTextarea
                        size="xs"
                        variant="flushed"
                        value={editCommentText}
                        onChange={function onEditText(e: any) {
                          setEditCommentText(e.target.value)
                        }}
                        onKeyDown={function onEditKeyDown(e: any) {
                          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                            e.preventDefault()
                            handleSaveEdit(c.id)
                          } else if (e.key === 'Escape') {
                            e.preventDefault()
                            setEditingCommentId(null)
                          }
                        }}
                        minHeight={36}
                        fontSize="sm"
                        fontFamily="'JetBrains Mono', monospace"
                        fontWeight="400"
                        color="fg"
                        p="1"
                        borderBottomColor="ruby.focus"
                        _focus={{ borderBottomColor: 'ruby.solid' }}
                      />
                      <HStack justify="end" gap="1">
                        <IconButton
                          size="2xs"
                          variant="ghost"
                          colorPalette="gray"
                          aria-label="Cancel editing"
                          title="Cancel (Esc)"
                          onClick={function cancelEdit() {
                            setEditingCommentId(null)
                          }}
                        >
                          <X size={11} />
                        </IconButton>
                        <IconButton
                          size="2xs"
                          variant="solid"
                          colorPalette="ruby"
                          aria-label="Save comment"
                          title="Save note (Ctrl+Enter)"
                          onClick={function saveEdit() {
                            handleSaveEdit(c.id)
                          }}
                        >
                          <Check size={11} />
                        </IconButton>
                      </HStack>
                    </VStack>
                  ) : (
                    <>
                      {/* Comment Text: monospace JetBrains Mono, enlarged fontSize="sm", thin weight, multiline */}
                      <Text
                        fontSize="sm"
                        fontFamily="'JetBrains Mono', monospace"
                        fontWeight="400"
                        lineHeight="1.5"
                        color="fg.muted"
                        flex="1"
                        wordBreak="break-word"
                        whiteSpace="pre-wrap"
                        py="0.5"
                      >
                        {c.content}
                      </Text>

                      {/* Hover action group: Edit and Delete */}
                      <HStack
                        gap="0.5"
                        opacity={0}
                        _groupHover={{ opacity: 0.8 }}
                        transition="opacity 0.15s ease"
                      >
                        <IconButton
                          size="2xs"
                          variant="ghost"
                          colorPalette="gray"
                          aria-label="Edit comment"
                          title="Edit marginalia"
                          _hover={{ color: 'ruby.fg' }}
                          onClick={function triggerEdit() {
                            setEditingCommentId(c.id)
                            setEditCommentText(c.content)
                          }}
                        >
                          <Pencil size={11} />
                        </IconButton>
                        <IconButton
                          size="2xs"
                          variant="ghost"
                          colorPalette="gray"
                          aria-label="Delete comment"
                          title="Delete marginalia"
                          _hover={{ color: 'ruby.fg' }}
                          onClick={function removeComment() {
                            onDeleteComment(c.id, sentenceHash)
                          }}
                        >
                          <Trash2 size={11} />
                        </IconButton>
                      </HStack>
                    </>
                  )}
                </Flex>
              )
            })}

            {/* Seamless Editable Input ("No comment" placeholder, only visible on hover or when comments exist) */}
            <Box
              w="full"
              position="relative"
              opacity={showCommentInput ? 1 : 0}
              pointerEvents={showCommentInput ? 'auto' : 'none'}
              transition="opacity 0.2s ease"
            >
              <HStack gap="1" w="full" align="end">
                <AutoResizeTextarea
                  size="xs"
                  variant="flushed"
                  placeholder={comments.length > 0 ? 'Add note... (Ctrl+Enter to post)' : 'No note... (Ctrl+Enter to post)'}
                  value={newCommentText}
                  onFocus={function onFocus() {
                    setIsCommentFocused(true)
                  }}
                  onBlur={function onBlur() {
                    setIsCommentFocused(false)
                  }}
                  onChange={function onTextChange(e: any) {
                    setNewCommentText(e.target.value)
                  }}
                  onKeyDown={function handleKeyDown(e: any) {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                      e.preventDefault()
                      handleCommentSubmit()
                    }
                  }}
                  minHeight={32}
                  fontSize="sm"
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight="400"
                  color="fg.muted"
                  _placeholder={{ color: 'fg.subtle', fontStyle: 'italic', fontFamily: "'JetBrains Mono', monospace", fontSize: 'sm' }}
                  borderBottomColor={newCommentText ? 'ruby.focus' : 'transparent'}
                  _focus={{ borderBottomColor: 'ruby.solid' }}
                  px="1"
                  py="1"
                  flex="1"
                />
                {newCommentText.trim() && (
                  <IconButton
                    size="2xs"
                    variant="solid"
                    colorPalette="ruby"
                    aria-label="Submit note"
                    title="Submit note (Ctrl+Enter)"
                    onClick={function submit() {
                      handleCommentSubmit()
                    }}
                    mb="1"
                  >
                    <Send size={11} />
                  </IconButton>
                )}
              </HStack>
            </Box>
          </VStack>
        </Box>
        )}
      </Flex>
    </Box>
  )
}
