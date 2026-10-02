import React, { useState } from 'react'
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
  Highlighter,
  Plus,
  Trash2,
  Send,
  Pencil,
  Check,
  X,
} from 'lucide-react'
import EmojiPicker, { Theme as EmojiTheme, type EmojiClickData } from 'emoji-picker-react'
import { BionicSentence } from '../bionic/BionicSentence'
import type { SentenceAnnotation, SentenceComment, SentenceEmojiReaction } from '@/lib/types'

export interface SentenceRowProps {
  sentence: string
  sentenceHash: string
  sentenceIndex?: number
  totalSentences?: number
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
  onUpdateComment?: (commentId: string, hash: string, newContent: string) => void
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
  sentenceIndex = 0,
  totalSentences = 1,
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
  onUpdateComment,
}: SentenceRowProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showFullPicker, setShowFullPicker] = useState(false)
  const [showHighlightPicker, setShowHighlightPicker] = useState(false)
  const [newCommentText, setNewCommentText] = useState('')

  const isBookmarked = annotation?.is_bookmarked === 1
  const upvotes = annotation?.upvotes_count || 0
  const highlightColor = annotation?.highlight_color || ''

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editCommentText, setEditCommentText] = useState('')

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

  function handleSaveEdit(commentId: string) {
    const trimmed = editCommentText.trim()
    if (!trimmed) return
    onUpdateComment?.(commentId, sentenceHash, trimmed)
    setEditingCommentId(null)
    setEditCommentText('')
  }

  function handleEmojiClick(emojiData: EmojiClickData) {
    onAddReaction(sentenceHash, emojiData.emoji)
    setShowFullPicker(false)
  }

  return (
    <Box
      pt="4.5"
      pb="3"
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
      <Flex align="start" gap="3" w="full" position="relative">
        {/* Sentence Timeline Connector (Only if totalSentences > 1) */}
        {totalSentences > 1 && (
          <Box
            position="relative"
            w="3"
            flexShrink={0}
            alignSelf="stretch"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            {/* Vertical connector line from top */}
            {sentenceIndex !== 0 && (
              <Box
                position="absolute"
                top="-18px"
                bottom="calc(100% - 10px)"
                w="1px"
                bg="fg.subtle"
                opacity={0.35}
              />
            )}

            {/* Circle dot in front of sentence (slightly bigger, 10px) */}
            <Box
              position="absolute"
              top="8px"
              w="2.5"
              h="2.5"
              rounded="full"
              borderWidth="1.5px"
              borderColor="fg.subtle"
              bg="bg"
              zIndex={1}
            />

            {/* Vertical connector line to bottom */}
            {sentenceIndex !== totalSentences - 1 && (
              <Box
                position="absolute"
                top="18px"
                bottom="-18px"
                w="1px"
                bg="fg.subtle"
                opacity={0.35}
              />
            )}
          </Box>
        )}

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

          {/* Action Toolbar */}
          <Flex
            align="center"
            justify="space-between"
            w="full"
            mt="1.5"
            minH="7"
            position="relative"
          >
            {/* Left Actions: Bookmark, Upvote, Highlight, Separator */}
            <HStack
              gap="1.5"
              align="center"
              opacity={isHovered || isBookmarked || upvotes > 0 || Boolean(highlightColor) ? 1 : 0}
              transition="opacity 0.2s ease"
              pointerEvents={isHovered || isBookmarked || upvotes > 0 || Boolean(highlightColor) ? 'auto' : 'none'}
            >
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

              {/* Separator between action buttons and emojis (only when hovered) */}
              <Separator
                orientation="vertical"
                h="3.5"
                borderColor="border.subtle"
                mx="0.5"
                opacity={isHovered ? 1 : 0}
                transition="opacity 0.2s ease"
              />
            </HStack>

            {/* Right: Grouped & Attached Emoji Bar (ONLY visible when hovered) */}
            <Group
              attached
              opacity={isHovered ? 1 : 0}
              transition="opacity 0.2s ease"
              pointerEvents={isHovered ? 'auto' : 'none'}
            >
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
          mt="2.5"
          bg="fg.subtle"
          opacity={isHovered || comments.length > 0 ? 0.45 : 0.15}
          transition="opacity 0.2s ease"
          flexShrink={0}
        />

        {/* Right Column: Marginalia / Comments (No border, circle marker, thin Plus Jakarta Sans font) */}
        <Box w="38%" minW="14rem" maxW="22rem" flexShrink={0}>
          <VStack align="stretch" gap="2">
            {/* Existing Comments List */}
            {comments.map(function renderComment(c, cIdx) {
              const isLast = cIdx === comments.length - 1
              const isEditing = editingCommentId === c.id

              return (
                <Flex key={c.id} align="start" gap="2" position="relative" role="group">
                  {/* Circle indicator in front of comment & vertical connector for multiple comments */}
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
                      borderWidth="1px"
                      borderColor="fg.subtle"
                      bg="bg"
                      zIndex={1}
                    />

                    {/* Vertical connector line between comments */}
                    {!isLast && (
                      <Box
                        position="absolute"
                        top="12px"
                        bottom="-8px"
                        w="1px"
                        bg="fg.subtle"
                        opacity={0.35}
                      />
                    )}
                  </Box>

                  {/* Comment Content / Editor */}
                  {isEditing ? (
                    <VStack align="stretch" gap="1" flex="1">
                      <Textarea
                        size="xs"
                        variant="flushed"
                        value={editCommentText}
                        onChange={function onEditText(e) {
                          setEditCommentText(e.target.value)
                        }}
                        onKeyDown={function onEditKeyDown(e) {
                          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                            e.preventDefault()
                            handleSaveEdit(c.id)
                          } else if (e.key === 'Escape') {
                            e.preventDefault()
                            setEditingCommentId(null)
                          }
                        }}
                        fontSize="xs"
                        fontFamily="'Plus Jakarta Sans', sans-serif"
                        fontWeight="300"
                        color="fg"
                        rows={2}
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
                          title="Save (Ctrl+Enter)"
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
                      {/* Comment Text: no border, slightly larger font, Plus Jakarta Sans, thin weight 300, multiline */}
                      <Text
                        fontSize="xs"
                        fontFamily="'Plus Jakarta Sans', sans-serif"
                        fontWeight="300"
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

            {/* Seamless Editable Input ("No comment" placeholder, multiline textarea, Ctrl+Enter to send) */}
            <Box w="full" position="relative">
              <HStack gap="1" w="full" align="end">
                {comments.length === 0 && (
                  <Box
                    w="1.5"
                    h="1.5"
                    mb="2"
                    rounded="full"
                    borderWidth="1px"
                    borderColor="fg.subtle"
                    bg="transparent"
                    opacity={0.3}
                    flexShrink={0}
                  />
                )}
                <Textarea
                  size="xs"
                  variant="flushed"
                  placeholder="No comment... (Ctrl+Enter to post)"
                  value={newCommentText}
                  onChange={function onTextChange(e) {
                    setNewCommentText(e.target.value)
                  }}
                  onKeyDown={function handleKeyDown(e) {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                      e.preventDefault()
                      handleCommentSubmit()
                    }
                  }}
                  rows={1}
                  fontSize="xs"
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                  fontWeight="300"
                  color="fg.muted"
                  _placeholder={{ color: 'fg.subtle', fontStyle: 'italic', fontWeight: '300' }}
                  borderBottomColor={newCommentText ? 'ruby.focus' : 'transparent'}
                  _focus={{ borderBottomColor: 'ruby.solid' }}
                  px="1"
                  py="1"
                  flex="1"
                  minH="24px"
                />
                {newCommentText.trim() && (
                  <IconButton
                    size="2xs"
                    variant="solid"
                    colorPalette="ruby"
                    aria-label="Submit comment"
                    title="Submit comment (Ctrl+Enter)"
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
      </Flex>
    </Box>
  )
}
