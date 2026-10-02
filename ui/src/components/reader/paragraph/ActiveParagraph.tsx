import React, { useMemo } from 'react'
import { match } from 'ts-pattern'
import { useTranslation } from '@/i18n'
import { ParagraphHeaderInfo } from './ParagraphHeaderInfo'
import { ParagraphReadingContent } from './ParagraphReadingContent'
import { ParagraphNavigationControls } from './ParagraphNavigationControls'
import { ActiveParagraphLayout } from './ActiveParagraphLayout'
import { ParagraphUtilityToolbar } from '../utility/ParagraphUtilityToolbar'
import { calculateParagraphStats } from '@/lib/sentence'
import {
  useParagraphStatsQuery,
  useParagraphHeatmapQuery,
  useUpdateParagraphStatsMutation,
  useIncrementParagraphUpvoteMutation,
  useSentenceAnnotationsQuery,
  useSaveSentenceAnnotationMutation,
  useIncrementSentenceUpvoteMutation,
  useBookCommentsQuery,
  useAddSentenceCommentMutation,
  useDeleteSentenceCommentMutation,
  useUpdateSentenceCommentMutation,
} from '@/queries'
import type { ParagraphStat } from '@/lib/types'

export interface ActiveParagraphProps {
  bookId: string
  chapterTitle: string
  chapterIndex: number
  totalChapters: number
  paragraphIndex: number
  totalParagraphsInChapter: number
  chapterStats?: ParagraphStat[]
  content: string
  percentInChapter: number
  onPrev: () => void
  onNext: () => void
  onSelectParagraph?: (index: number) => void
  hasPrev: boolean
  hasNext: boolean
}

export function ActiveParagraph({
  bookId,
  chapterTitle,
  chapterIndex,
  totalChapters,
  paragraphIndex,
  totalParagraphsInChapter,
  chapterStats = [],
  content,
  percentInChapter,
  onPrev,
  onNext,
  onSelectParagraph = () => {},
  hasPrev,
  hasNext,
}: ActiveParagraphProps) {
  const { t, format } = useTranslation()

  // Queries for paragraph-level stats and annotations
  const { data: paragraphStat } = useParagraphStatsQuery(bookId, chapterIndex, paragraphIndex)
  const { mutate: updateParagraphStats } = useUpdateParagraphStatsMutation()

  const { data: annotations = [] } = useSentenceAnnotationsQuery(bookId, chapterIndex, paragraphIndex)
  const { mutate: saveAnnotation } = useSaveSentenceAnnotationMutation()
  const { mutate: incrementUpvote } = useIncrementSentenceUpvoteMutation()

  // Load all marginalia comments for the book
  const { data: allComments = [] } = useBookCommentsQuery(bookId)

  // Live heatmap query
  const { data: liveHeatmap = [] } = useParagraphHeatmapQuery(bookId, chapterIndex)

  const { mutate: addComment } = useAddSentenceCommentMutation()
  const { mutate: deleteComment } = useDeleteSentenceCommentMutation()
  const { mutate: updateComment } = useUpdateSentenceCommentMutation()

  // Reading statistics (words, characters, reading minutes)
  const readingStats = useMemo(
    function computeReadingMetrics() {
      return calculateParagraphStats(content || '')
    },
    [content]
  )

  const { mutate: incrementParagraphUpvote } = useIncrementParagraphUpvoteMutation()

  function handleToggleSkip(isSkipped: boolean) {
    updateParagraphStats({
      bookId,
      chapterIndex,
      paragraphIndex,
      isSkipped,
      customFontFamily: paragraphStat?.custom_font_family || '',
      customFontSize: paragraphStat?.custom_font_size || 0,
      isBookmarked: paragraphStat?.is_bookmarked === 1,
      upvotesCount: paragraphStat?.upvotes_count || 0,
      emojiReactions: paragraphStat?.emoji_reactions || '[]',
    })
  }

  function handleUpdateStyle(customFontFamily: string, customFontSize: number) {
    updateParagraphStats({
      bookId,
      chapterIndex,
      paragraphIndex,
      isSkipped: paragraphStat?.is_skipped === 1,
      customFontFamily,
      customFontSize,
      isBookmarked: paragraphStat?.is_bookmarked === 1,
      upvotesCount: paragraphStat?.upvotes_count || 0,
      emojiReactions: paragraphStat?.emoji_reactions || '[]',
    })
  }

  function handleToggleParagraphBookmark(currentVal: boolean) {
    updateParagraphStats({
      bookId,
      chapterIndex,
      paragraphIndex,
      isSkipped: paragraphStat?.is_skipped === 1,
      customFontFamily: paragraphStat?.custom_font_family || '',
      customFontSize: paragraphStat?.custom_font_size || 0,
      isBookmarked: !currentVal,
      upvotesCount: paragraphStat?.upvotes_count || 0,
      emojiReactions: paragraphStat?.emoji_reactions || '[]',
    })
  }

  function handleIncrementParagraphUpvote() {
    incrementParagraphUpvote({
      bookId,
      chapterIndex,
      paragraphIndex,
    })
  }

  function handleAddParagraphReaction(emoji: string) {
    let reactions: Array<{ emoji: string; count: number }> = []
    try {
      if (paragraphStat?.emoji_reactions) {
        reactions = JSON.parse(paragraphStat.emoji_reactions)
      }
    } catch {
      reactions = []
    }

    const idx = reactions.findIndex((r) => r.emoji === emoji)
    if (idx >= 0) {
      reactions[idx].count += 1
    } else {
      reactions.push({ emoji, count: 1 })
    }

    updateParagraphStats({
      bookId,
      chapterIndex,
      paragraphIndex,
      isSkipped: paragraphStat?.is_skipped === 1,
      customFontFamily: paragraphStat?.custom_font_family || '',
      customFontSize: paragraphStat?.custom_font_size || 0,
      isBookmarked: paragraphStat?.is_bookmarked === 1,
      upvotesCount: paragraphStat?.upvotes_count || 0,
      emojiReactions: JSON.stringify(reactions),
    })
  }

  function handleToggleBookmark(sentenceHash: string, currentVal: boolean) {
    const existing = annotations.find((a) => a.sentence_hash === sentenceHash)
    saveAnnotation({
      sentence_hash: sentenceHash,
      book_id: bookId,
      chapter_index: chapterIndex,
      paragraph_index: paragraphIndex,
      is_bookmarked: currentVal ? 0 : 1,
      highlight_color: existing?.highlight_color || '',
      upvotes_count: existing?.upvotes_count || 0,
      emoji_reactions: existing?.emoji_reactions || '[]',
      updated_at: new Date().toISOString(),
    })
  }

  function handleIncrementUpvote(sentenceHash: string) {
    const existing = annotations.find((a) => a.sentence_hash === sentenceHash)
    const currentUpvotes = existing?.upvotes_count || 0
    saveAnnotation({
      sentence_hash: sentenceHash,
      book_id: bookId,
      chapter_index: chapterIndex,
      paragraph_index: paragraphIndex,
      is_bookmarked: existing?.is_bookmarked || 0,
      highlight_color: existing?.highlight_color || '',
      upvotes_count: currentUpvotes + 1,
      emoji_reactions: existing?.emoji_reactions || '[]',
      updated_at: new Date().toISOString(),
    })
  }

  function handleDecrementUpvote(sentenceHash: string) {
    const existing = annotations.find((a) => a.sentence_hash === sentenceHash)
    const currentUpvotes = existing?.upvotes_count || 0
    saveAnnotation({
      sentence_hash: sentenceHash,
      book_id: bookId,
      chapter_index: chapterIndex,
      paragraph_index: paragraphIndex,
      is_bookmarked: existing?.is_bookmarked || 0,
      highlight_color: existing?.highlight_color || '',
      upvotes_count: currentUpvotes - 1,
      emoji_reactions: existing?.emoji_reactions || '[]',
      updated_at: new Date().toISOString(),
    })
  }

  function handleSetHighlight(sentenceHash: string, color: string) {
    const existing = annotations.find((a) => a.sentence_hash === sentenceHash)
    saveAnnotation({
      sentence_hash: sentenceHash,
      book_id: bookId,
      chapter_index: chapterIndex,
      paragraph_index: paragraphIndex,
      is_bookmarked: existing?.is_bookmarked || 0,
      highlight_color: color,
      upvotes_count: existing?.upvotes_count || 0,
      emoji_reactions: existing?.emoji_reactions || '[]',
      updated_at: new Date().toISOString(),
    })
  }

  function handleUpdateReaction(sentenceHash: string, emoji: string, delta: number) {
    const existing = annotations.find((a) => a.sentence_hash === sentenceHash)
    let reactions: Array<{ emoji: string; count: number }> = []
    try {
      if (existing?.emoji_reactions) {
        reactions = JSON.parse(existing.emoji_reactions)
      }
    } catch {
      reactions = []
    }

    const idx = reactions.findIndex((r) => r.emoji === emoji)
    if (idx >= 0) {
      reactions[idx].count += delta
      if (reactions[idx].count <= 0) {
        reactions.splice(idx, 1)
      }
    } else if (delta > 0) {
      reactions.push({ emoji, count: delta })
    }

    saveAnnotation({
      sentence_hash: sentenceHash,
      book_id: bookId,
      chapter_index: chapterIndex,
      paragraph_index: paragraphIndex,
      is_bookmarked: existing?.is_bookmarked || 0,
      highlight_color: existing?.highlight_color || '',
      upvotes_count: existing?.upvotes_count || 0,
      emoji_reactions: JSON.stringify(reactions),
      updated_at: new Date().toISOString(),
    })
  }

  function handleAddReaction(sentenceHash: string, emoji: string) {
    handleUpdateReaction(sentenceHash, emoji, 1)
  }

  function handleAddComment(sentenceHash: string, text: string) {
    const id = 'c_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
    addComment({
      id,
      sentenceHash,
      bookId,
      content: text,
      chapterIndex,
      paragraphIndex,
    })
  }

  function handleDeleteComment(commentId: string, sentenceHash: string) {
    deleteComment({
      id: commentId,
      sentenceHash,
      bookId,
      chapterIndex,
    })
  }

  function handleUpdateComment(commentId: string, sentenceHash: string, newContent: string) {
    updateComment({
      id: commentId,
      sentenceHash,
      bookId,
      content: newContent,
    })
  }

  const percentCompletedText = format(t.reader.percentCompleted, {
    percent: percentInChapter,
  })

  const textToDisplay = match(Boolean(content))
    .with(true, function hasContent() {
      return content
    })
    .with(false, function noContent() {
      return t.reader.loadingContent
    })
    .exhaustive()

  return (
    <ActiveParagraphLayout>
      <ParagraphHeaderInfo
        chapterIndex={chapterIndex}
        totalChapters={totalChapters}
        chapterTitle={chapterTitle}
        currentParagraphIndex={paragraphIndex}
        totalParagraphs={totalParagraphsInChapter}
        paragraphStats={liveHeatmap.length > 0 ? liveHeatmap : chapterStats}
        onSelectParagraph={onSelectParagraph}
      />

      <ParagraphReadingContent
        content={textToDisplay}
        bookId={bookId}
        chapterIndex={chapterIndex}
        paragraphIndex={paragraphIndex}
        customFontFamily={paragraphStat?.custom_font_family}
        customFontSize={paragraphStat?.custom_font_size}
        annotations={annotations}
        comments={allComments}
        onToggleBookmark={handleToggleBookmark}
        onIncrementUpvote={handleIncrementUpvote}
        onDecrementUpvote={handleDecrementUpvote}
        onSetHighlight={handleSetHighlight}
        onAddReaction={handleAddReaction}
        onUpdateReaction={handleUpdateReaction}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
        onUpdateComment={handleUpdateComment}
      />

      <ParagraphNavigationControls
        percentCompletedText={percentCompletedText}
        keyboardHint={t.reader.keyboardHint}
        navPreviousText={t.reader.navPrevious}
        navNextText={t.reader.navNext}
        hasPrev={hasPrev}
        hasNext={hasNext}
        percent={percentInChapter}
        utilityToolbar={
          <ParagraphUtilityToolbar
            stats={readingStats}
            paragraphStat={paragraphStat}
            onToggleBookmark={handleToggleParagraphBookmark}
            onIncrementUpvote={handleIncrementParagraphUpvote}
            onAddReaction={handleAddParagraphReaction}
            onToggleSkip={handleToggleSkip}
            onUpdateStyle={handleUpdateStyle}
          />
        }
        onPrev={onPrev}
        onNext={onNext}
      />
    </ActiveParagraphLayout>
  )
}
