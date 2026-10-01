import React from 'react'
import type { Book, Chapter } from '@/lib/types'
import { AIAnalysisPanel } from '../ai'
import { ActiveParagraph } from '../paragraph'
import { useReader } from '@/hooks/useReader'
import { useTranslation } from '@/i18n'
import { ReaderTopNav } from './ReaderTopNav'
import { ReaderChapterSelect } from './ReaderChapterSelect'
import { ReaderMainSplit } from './ReaderMainSplit'
import { ReaderLayout } from './ReaderLayout'

export interface ReaderViewProps {
  book: Book
  onBack: () => void
  onOpenSettings: () => void
}

export function ReaderView({ book, onBack, onOpenSettings }: ReaderViewProps) {
  const { title: bookTitle } = book
  const {
    chapters,
    currentChapter,
    currentChapterIdx,
    currentParagraphIdx,
    paragraphsCountInChapter,
    paragraphContent,
    percentInChapter,
    hasPrev,
    hasNext,
    goToPrevParagraph,
    goToNextParagraph,
    changeChapter,
  } = useReader(book)

  const { t, format } = useTranslation()

  function handleBackClick() {
    onBack()
  }

  function handleChapterSelectChange({ target: { value } }: React.ChangeEvent<HTMLSelectElement>) {
    changeChapter(Number(value))
  }

  function handleOpenSettings() {
    onOpenSettings()
  }

  function formatChapterOption({ chapter_index, title, paragraph_count }: Chapter): string {
    const paragraphCountLabel = format(t.reader.paragraphCountLabel, {
      count: paragraph_count,
    })
    return format(t.reader.chapterOption, {
      index: chapter_index,
      title,
      paragraphCountLabel,
    })
  }

  const readerLayout = (
    <ReaderLayout>
      <ReaderTopNav
        bookTitle={bookTitle}
        backLabel={t.reader.backToCatalog}
        onBack={handleBackClick}
      >
        <ReaderChapterSelect
          currentChapterIdx={currentChapterIdx}
          chapters={chapters}
          formatOptionLabel={formatChapterOption}
          onChange={handleChapterSelectChange}
        />
      </ReaderTopNav>
      <ReaderMainSplit
        leftPane={
          <ActiveParagraph
            chapterTitle={currentChapter.title}
            chapterIndex={currentChapterIdx}
            totalChapters={chapters.length || 1}
            paragraphIndex={currentParagraphIdx}
            totalParagraphsInChapter={paragraphsCountInChapter || 1}
            content={paragraphContent}
            percentInChapter={percentInChapter}
            onPrev={goToPrevParagraph}
            onNext={goToNextParagraph}
            hasPrev={hasPrev}
            hasNext={hasNext}
          />
        }
        rightPane={
          <AIAnalysisPanel
            paragraphText={paragraphContent}
            onOpenSettings={handleOpenSettings}
          />
        }
      />
    </ReaderLayout>
  )

  return readerLayout
}
