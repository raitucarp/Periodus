import React, { useState, useRef, useEffect } from 'react'
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
  const [isSentenceHovered, setIsSentenceHovered] = useState(false)
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

  const hasActiveActions = isBookmarked || upvotes > 0 || Boolean(highlightColor)

  return (
    <Box
      py="2"
      px="3"
      rounded="xl"
      transition="background-color 0.15s ease"
      _hover={{ bg: 'bg.subtle' }}
      position="relative"
    >
      {/* Seamless Continuous Timeline Vertical Line (from row top 0 to bottom 0) */}
      {totalSentences > 1 && (
        <>
          {sentenceIndex !== 0 && (
            <Box
              position="absolute"
              left="17.5px"
              top="0"
              h="27px"
              w="1.5px"
              bg="fg.subtle"
              opacity={0.35}
              zIndex={1}
            />
          )}
          {sentenceIndex !== totalSentences - 1 && (
            <Box
              position="absolute"
              left="17.5px"
              top="27px"
              bottom="0"
              w="1.5px"
              bg="fg.subtle"
              opacity={0.35}
              zIndex={1}
            />
          )}
        </>
      )}

      <Flex align="start" gap="3" w="full" position="relative">
        {/* Timeline Marker Column */}
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
            {/* Circle dot in front of sentence (softer tone matching vertical line, harmonic in light & dark modes) */}
            <Box
              position="absolute"
              top="14px"
              w="2.5"
              h="2.5"
              rounded="full"
              bg="fg.muted"
              border="1.5px solid var(--chakra-colors-bg)"
              zIndex={2}
            />
          </Box>
        )}

        {/* Left Column: Sentence & Action Bar (hovering here only reveals the action toolbar) */}
        <Box
          flex="1"
          minW="0"
          onMouseEnter={function onEnter() {
            setIsSentenceHovered(true)
          }}
          onMouseLeave={function onLeave() {
            setIsSentenceHovered(false)
            setShowHighlightPicker(false)
          }}
        >
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

          {/* Action Toolbar (Only rendered when hovered or has active annotations) */}
          {(isSentenceHovered || hasActiveActions) && (
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
              opacity={isSentenceHovered || isBookmarked || upvotes > 0 || Boolean(highlightColor) ? 1 : 0}
              transition="opacity 0.2s ease"
              pointerEvents={isSentenceHovered || isBookmarked || upvotes > 0 || Boolean(highlightColor) ? 'auto' : 'none'}
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
                opacity={isSentenceHovered ? 1 : 0}
                transition="opacity 0.2s ease"
              />
            </HStack>

            {/* Right: Grouped & Attached Emoji Bar (ONLY visible when hovered) */}
            <Group
              attached
              opacity={isSentenceHovered ? 1 : 0}
              transition="opacity 0.2s ease"
              pointerEvents={isSentenceHovered ? 'auto' : 'none'}
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
        )}

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
          mt="4.5"
          bg="fg.subtle"
          opacity={isSentenceHovered || comments.length > 0 ? 0.45 : 0.15}
          transition="opacity 0.2s ease"
          flexShrink={0}
        />

        {/* Right Column: Marginalia / Comments (Aligned with first line via pt="2.5", JetBrains Mono monospace font, larger text) */}
        <Box w="38%" minW="14rem" maxW="22rem" flexShrink={0} pt="2.5">
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

            {/* Seamless Editable Input ("No comment" placeholder, multiline auto-resizing textarea, JetBrains Mono font) */}
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
                <AutoResizeTextarea
                  size="xs"
                  variant="flushed"
                  placeholder="No comment... (Ctrl+Enter to post)"
                  value={newCommentText}
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
