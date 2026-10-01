import React from 'react'
import { match } from 'ts-pattern'
import { useTranslation } from '@/i18n'
import { ParagraphHeaderInfo } from './ParagraphHeaderInfo'
import { ParagraphReadingContent } from './ParagraphReadingContent'
import { ParagraphNavigationControls } from './ParagraphNavigationControls'
import { ActiveParagraphLayout } from './ActiveParagraphLayout'

export interface ActiveParagraphProps {
  chapterTitle: string
  chapterIndex: number
  totalChapters: number
  paragraphIndex: number
  totalParagraphsInChapter: number
  content: string
  percentInChapter: number
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}

export function ActiveParagraph({
  chapterTitle,
  chapterIndex,
  totalChapters,
  paragraphIndex,
  totalParagraphsInChapter,
  content,
  percentInChapter,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: ActiveParagraphProps) {
  const { t, format } = useTranslation()

  function handlePrevClick() {
    onPrev()
  }

  function handleNextClick() {
    onNext()
  }

  const chapterLabelText = format(t.reader.chapterLabel, {
    index: chapterIndex,
    total: totalChapters,
    title: chapterTitle,
  })

  const paragraphOfTotalText = format(t.reader.paragraphOfTotal, {
    current: paragraphIndex,
    total: totalParagraphsInChapter,
  })

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

  const paragraphLayout = (
    <ActiveParagraphLayout>
      <ParagraphHeaderInfo
        chapterLabel={chapterLabelText}
        paragraphOfTotal={paragraphOfTotalText}
      />
      <ParagraphReadingContent
        content={textToDisplay}
        paragraphIndex={paragraphIndex}
      />
      <ParagraphNavigationControls
        percentCompletedText={percentCompletedText}
        keyboardHint={t.reader.keyboardHint}
        navPreviousText={t.reader.navPrevious}
        navNextText={t.reader.navNext}
        hasPrev={hasPrev}
        hasNext={hasNext}
        percent={percentInChapter}
        onPrev={handlePrevClick}
        onNext={handleNextClick}
      />
    </ActiveParagraphLayout>
  )

  return paragraphLayout
}
