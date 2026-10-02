import React, { useMemo, useState, useEffect } from 'react'
import { Box, VStack } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'motion/react'
import { useAtom } from 'jotai'
import { readingSettingsAtom } from '@/state/atoms'
import { splitIntoSentences, computeSentenceHash } from '@/lib/sentence'
import { SentenceRow } from '../marginalia/SentenceRow'
import type { SentenceAnnotation, SentenceComment } from '@/lib/types'

export interface ParagraphReadingContentProps {
  content: string
  bookId: string
  chapterIndex: number
  paragraphIndex: number
  customFontFamily?: string
  customFontSize?: number
  annotations?: SentenceAnnotation[]
  comments?: SentenceComment[]
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

interface HashedSentence {
  text: string
  hash: string
}

export function ParagraphReadingContent({
  content,
  paragraphIndex,
  customFontFamily,
  customFontSize,
  annotations = [],
  comments = [],
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
}: ParagraphReadingContentProps) {
  const [readingSettings] = useAtom(readingSettingsAtom)
  const [hashedSentences, setHashedSentences] = useState<HashedSentence[]>([])

  // Raw sentence splitting
  const sentences = useMemo(
    function computeSentences() {
      return splitIntoSentences(content)
    },
    [content]
  )

  // Compute sentence hashes asynchronously
  useEffect(
    function generateSentenceHashes() {
      let isCurrent = true
      async function runHash() {
        const list: HashedSentence[] = []
        for (const s of sentences) {
          const hash = await computeSentenceHash(s)
          list.push({ text: s, hash })
        }
        if (isCurrent) {
          setHashedSentences(list)
        }
      }
      runHash()
      return () => {
        isCurrent = false
      }
    },
    [sentences]
  )

  // Typography settings with per-paragraph overrides
  const activeFontFamily = customFontFamily || readingSettings.fontFamily || 'Literata'
  const activeFontSize = customFontSize ? `${customFontSize}px` : `${readingSettings.fontSize || 21}px`

  const lineH =
    readingSettings.lineHeight === 'normal' || readingSettings.lineHeight === 'compact'
      ? 1.5
      : readingSettings.lineHeight === 'tall'
      ? 1.7
      : readingSettings.lineHeight === 'loose'
      ? 1.8
      : 2.1

  // Maps for fast annotation & comment lookup
  const annotationMap = useMemo(
    function buildAnnotationMap() {
      const map = new Map<string, SentenceAnnotation>()
      for (const a of annotations) {
        map.set(a.sentence_hash, a)
      }
      return map
    },
    [annotations]
  )

  const commentsByHash = useMemo(
    function buildCommentsMap() {
      const map = new Map<string, SentenceComment[]>()
      for (const c of comments) {
        const existing = map.get(c.sentence_hash) || []
        existing.push(c)
        map.set(c.sentence_hash, existing)
      }
      return map
    },
    [comments]
  )

  return (
    <Box
      flex="1"
      overflowY="auto"
      w="full"
      px="8"
      pt="6"
      pb="10"
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="flex-start"
    >
      <Box w="full" maxW="100%">
        <AnimatePresence mode="wait">
          <motion.div
            key={paragraphIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <VStack align="stretch" gap="0">
              {hashedSentences.map(function renderSentenceItem(item, idx) {
                const ann = annotationMap.get(item.hash)
                const sentenceComments = commentsByHash.get(item.hash) || []

                return (
                  <SentenceRow
                    key={item.hash}
                    sentence={item.text}
                    sentenceHash={item.hash}
                    sentenceIndex={idx}
                    totalSentences={hashedSentences.length}
                    annotation={ann}
                    comments={sentenceComments}
                    fontFamily={activeFontFamily}
                    fontSize={activeFontSize}
                    lineHeight={lineH}
                    onToggleBookmark={onToggleBookmark}
                    onIncrementUpvote={onIncrementUpvote}
                    onDecrementUpvote={onDecrementUpvote}
                    onSetHighlight={onSetHighlight}
                    onAddReaction={onAddReaction}
                    onUpdateReaction={onUpdateReaction}
                    onAddComment={onAddComment}
                    onDeleteComment={onDeleteComment}
                    onUpdateComment={onUpdateComment}
                    onToggleCollapse={onToggleCollapse}
                  />
                )
              })}
            </VStack>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  )
}
