import React, { useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Group,
  HStack,
  IconButton,
  Input,
  Separator,
  Text,
  VStack,
} from '@chakra-ui/react'
import {
  Bookmark,
  ArrowBigUp,
  Highlighter,
  Plus,
  Trash2,
  Send,
} from 'lucide-react'
import EmojiPicker, { Theme as EmojiTheme, type EmojiClickData } from 'emoji-picker-react'
import { BionicSentence } from '../bionic/BionicSentence'
import type { SentenceAnnotation, SentenceComment, SentenceEmojiReaction } from '@/lib/types'

export interface SentenceRowProps {
  sentence: string
  sentenceHash: string
  annotation?: SentenceAnnotation
  comments: SentenceComment[]
  fontFamily?: string
  fontSize?: string | number
  lineHeight?: string | number
  onToggleBookmark: (hash: string, currentVal: boolean) => void
  onIncrementUpvote: (hash: string) => void
  onSetHighlight: (hash: string, color: string) => void
  onAddReaction: (hash: string, emoji: string) => void
  onAddComment: (hash: string, text: string) => void
  onDeleteComment: (commentId: string, hash: string) => void
}

const QUICK_EMOJIS = ['👍', '❤️', '💡', '🔖', '🔥', '🤯']
const HIGHLIGHT_COLORS = [
  { name: 'none', label: 'Clear', color: '' },
  { name: 'amber', label: 'Warm Amber', color: 'amber' },
  { name: 'ruby', label: 'Ruby Red', color: 'ruby' },
  { name: 'teal', label: 'Teal Mint', color: 'teal' },
  { name: 'indigo', label: 'Indigo Purple', color: 'indigo' },
]

export function SentenceRow({
  sentence,
  sentenceHash,
  annotation,
  comments,
  fontFamily,
  fontSize,
  lineHeight,
  onToggleBookmark,
  onIncrementUpvote,
  onSetHighlight,
  onAddReaction,
  onAddComment,
  onDeleteComment,
}: SentenceRowProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showFullPicker, setShowFullPicker] = useState(false)
  const [showHighlightPicker, setShowHighlightPicker] = useState(false)
  const [newCommentText, setNewCommentText] = useState('')

  const isBookmarked = annotation?.is_bookmarked === 1
  const upvotes = annotation?.upvotes_count || 0
  const highlightColor = annotation?.highlight_color || ''

  // Parse emoji reactions
  let reactions: SentenceEmojiReaction[] = []
  try {
    if (annotation?.emoji_reactions) {
      reactions = JSON.parse(annotation.emoji_reactions)
    }
  } catch {
    reactions = []
  }

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

  function handleEmojiClick(emojiData: EmojiClickData) {
    onAddReaction(sentenceHash, emojiData.emoji)
    setShowFullPicker(false)
  }

  return (
    <Box
      py="2.5"
      px="3"
      rounded="xl"
      transition="background-color 0.15s ease"
      _hover={{ bg: 'bg.subtle' }}
      onMouseEnter={function onEnter() {
        setIsHovered(true)
      }}
      onMouseLeave={function onLeave() {
        setIsHovered(false)
        setShowHighlightPicker(false)
      }}
      position="relative"
    >
      <Flex align="start" gap="4" w="full">
        {/* Left Column: Sentence & Action Bar */}
        <Box flex="1" minW="0">
          <Box mb="1.5">
            <BionicSentence
              sentence={sentence}
              highlightColor={highlightColor}
              fontFamily={fontFamily}
              fontSize={fontSize}
              lineHeight={lineHeight}
            />
          </Box>

          {/* Emoji Reaction Badges */}
          {reactions.length > 0 && (
            <HStack gap="1.5" flexWrap="wrap" mb="1.5">
              {reactions.map(function renderReaction(r) {
                return (
                  <Button
                    key={r.emoji}
                    size="xs"
                    variant="surface"
                    colorPalette="gray"
                    rounded="full"
                    px="2.5"
                    py="1"
                    h="auto"
                    onClick={function incrementReaction() {
                      onAddReaction(sentenceHash, r.emoji)
                    }}
                  >
                    <span>{r.emoji}</span>
                    <Text as="span" textStyle="xs" fontWeight="semibold" ml="1">
                      {r.count}
                    </Text>
                  </Button>
                )
              })}
            </HStack>
          )}

          {/* Action Toolbar (Visible on hover or if annotated) */}
          <Flex
            align="center"
            justify="space-between"
            w="full"
            opacity={isHovered || isBookmarked || upvotes > 0 ? 1 : 0}
            transition="opacity 0.2s ease"
            mt="1.5"
            position="relative"
          >
            {/* Left Actions: Bookmark, Upvote, Highlight, Separator */}
            <HStack gap="1.5" align="center">
              {/* Bookmark Toggle */}
              <IconButton
                size="xs"
                variant={isBookmarked ? 'solid' : 'ghost'}
                colorPalette={isBookmarked ? 'ruby' : 'gray'}
                aria-label="Bookmark"
                title="Bookmark sentence"
                onClick={function handleBookmark() {
                  onToggleBookmark(sentenceHash, isBookmarked)
                }}
              >
                <Bookmark size={15} fill={isBookmarked ? 'currentColor' : 'none'} />
              </IconButton>

              {/* Upvote Button (Repeatable) */}
              <Button
                size="xs"
                variant={upvotes > 0 ? 'subtle' : 'ghost'}
                colorPalette={upvotes > 0 ? 'ruby' : 'gray'}
                px="2"
                h="7"
                rounded="md"
                title="Applaud / Upvote sentence"
                onClick={function handleUpvote() {
                  onIncrementUpvote(sentenceHash)
                }}
              >
                <ArrowBigUp size={16} fill={upvotes > 0 ? 'currentColor' : 'none'} />
                {upvotes > 0 && (
                  <Text textStyle="xs" fontWeight="bold">
                    {upvotes}
                  </Text>
                )}
              </Button>

              {/* Highlight Color Picker */}
              <IconButton
                size="xs"
                variant={highlightColor ? 'solid' : 'ghost'}
                colorPalette={highlightColor ? (highlightColor as any) : 'gray'}
                aria-label="Highlight"
                title="Highlight sentence"
                onClick={function toggleHighlightPicker() {
                  setShowHighlightPicker(!showHighlightPicker)
                }}
              >
                <Highlighter size={15} />
              </IconButton>

              {showHighlightPicker && (
                <HStack
                  position="absolute"
                  top="-9"
                  left="0"
                  bg="bg.panel"
                  borderWidth="1px"
                  borderColor="border.subtle"
                  p="1"
                  rounded="lg"
                  shadow="md"
                  zIndex="dropdown"
                  gap="1"
                >
                  {HIGHLIGHT_COLORS.map(function renderColorBtn(hc) {
                    return (
                      <Button
                        key={hc.name}
                        size="xs"
                        variant={highlightColor === hc.color ? 'solid' : 'ghost'}
                        colorPalette={hc.color ? (hc.color as any) : 'gray'}
                        onClick={function selectColor() {
                          onSetHighlight(sentenceHash, hc.color)
                          setShowHighlightPicker(false)
                        }}
                      >
                        {hc.label}
                      </Button>
                    )
                  })}
                </HStack>
              )}

              {/* Separator between action buttons and emojis */}
              <Separator orientation="vertical" h="3.5" borderColor="border.subtle" mx="0.5" />
            </HStack>

            {/* Right: Grouped & Attached Emoji Bar */}
            <Group attached>
              {QUICK_EMOJIS.map(function renderQuickEmoji(em) {
                return (
                  <Button
                    key={em}
                    size="xs"
                    variant="subtle"
                    colorPalette="gray"
                    px="1.5"
                    h="7"
                    fontSize="xs"
                    onClick={function sendQuickEmoji() {
                      onAddReaction(sentenceHash, em)
                    }}
                  >
                    {em}
                  </Button>
                )
              })}
              <IconButton
                size="xs"
                variant="subtle"
                colorPalette="gray"
                h="7"
                aria-label="More Emojis"
                title="Open full emoji picker"
                onClick={function openPicker() {
                  setShowFullPicker(!showFullPicker)
                }}
              >
                <Plus size={13} />
              </IconButton>
            </Group>
          </Flex>

          {/* Full Emoji Picker Popover */}
          {showFullPicker && (
            <Box position="absolute" zIndex="popover" mt="2" shadow="xl" rounded="xl" overflow="hidden">
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
        <Box
          w="6"
          h="1px"
          alignSelf="center"
          bg={isHovered || comments.length > 0 ? 'ruby.focus' : 'border.subtle'}
          opacity={isHovered || comments.length > 0 ? 0.8 : 0.25}
          transition="all 0.2s ease"
          flexShrink={0}
        />

        {/* Right Column: Marginalia / Comments (Smaller font size) */}
        <Box w="38%" minW="14rem" maxW="20rem" flexShrink={0}>
          <VStack align="stretch" gap="1.5">
            {/* Existing Comments List */}
            {comments.map(function renderComment(c) {
              return (
                <Flex
                  key={c.id}
                  justify="space-between"
                  align="start"
                  bg="bg.panel"
                  borderWidth="1px"
                  borderColor="border.subtle"
                  p="2"
                  rounded="lg"
                  shadow="2xs"
                  gap="2"
                  _hover={{ borderColor: 'border.muted' }}
                >
                  <Text textStyle="2xs" color="fg.muted" flex="1" wordBreak="break-word">
                    {c.content}
                  </Text>
                  <IconButton
                    size="2xs"
                    variant="ghost"
                    colorPalette="gray"
                    aria-label="Delete comment"
                    title="Delete marginalia"
                    opacity={0.6}
                    _hover={{ opacity: 1, color: 'ruby.fg' }}
                    onClick={function removeComment() {
                      onDeleteComment(c.id, sentenceHash)
                    }}
                  >
                    <Trash2 size={11} />
                  </IconButton>
                </Flex>
              )
            })}

            {/* Seamless Editable Input ("No comment" placeholder, borderless when empty) */}
            <form onSubmit={handleCommentSubmit} style={{ width: '100%' }}>
              <HStack gap="1" w="full">
                <Input
                  size="2xs"
                  variant="flushed"
                  placeholder="No comment..."
                  value={newCommentText}
                  onChange={function onTextChange(e) {
                    setNewCommentText(e.target.value)
                  }}
                  onKeyDown={function handleKeyDown(e) {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleCommentSubmit()
                    }
                  }}
                  fontSize="2xs"
                  color="fg.muted"
                  _placeholder={{ color: 'fg.subtle', fontStyle: 'italic' }}
                  borderBottomColor={newCommentText ? 'ruby.focus' : 'transparent'}
                  _focus={{ borderBottomColor: 'ruby.solid' }}
                  px="1"
                  flex="1"
                />
                {newCommentText.trim() && (
                  <IconButton
                    size="2xs"
                    variant="solid"
                    colorPalette="ruby"
                    type="submit"
                    aria-label="Submit comment"
                  >
                    <Send size={11} />
                  </IconButton>
                )}
              </HStack>
            </form>
          </VStack>
        </Box>
      </Flex>
    </Box>
  )
}
