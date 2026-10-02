import React from 'react'
import type { Book, Chapter } from '@/lib/types'
import { AIAnalysisPanel } from '../ai'
import { ActiveParagraph } from '../paragraph'
import { useReader } from '@/hooks/useReader'
import { useTranslation } from '@/i18n'
import { useChapterHeatmapQuery } from '@/queries'
import { ReaderTopNav } from './ReaderTopNav'
import { ReaderChapterSelect } from './ReaderChapterSelect'
import { ReaderMainSplit } from './ReaderMainSplit'
import { ReaderLayout } from './ReaderLayout'
import { cleanChapterTitle } from '@/lib/sentence'

export interface ReaderViewProps {
  book: Book
  onBack: () => void
  onOpenSettings: () => void
}

export function ReaderView({ book, onBack, onOpenSettings }: ReaderViewProps) {
  const { title: bookTitle, author } = book
  const {
    chapters,
    currentChapter,
    currentChapterIdx,
    currentParagraphIdx,
    paragraphsCountInChapter,
    paragraphContent,
    chapterStats,
    percentInChapter,
    hasPrev,
    hasNext,
    goToPrevParagraph,
    goToNextParagraph,
    goToParagraph,
    changeChapter,
  } = useReader(book)

  const { data: chapterHeatmapData = [] } = useChapterHeatmapQuery(book.id)
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
      title: cleanChapterTitle(title),
      paragraphCountLabel,
    })
  }

  const readerLayout = (
    <ReaderLayout>
      <ReaderTopNav
        bookTitle={bookTitle}
        author={author}
        totalChapters={chapters.length || 1}
        chapterHeatmapData={chapterHeatmapData}
        currentChapterIndex={currentChapterIdx}
        onSelectChapter={changeChapter}
        backLabel={t.reader.backToCatalog}
        onBack={handleBackClick}
        onOpenSettings={handleOpenSettings}
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
            bookId={book.id}
            chapterTitle={cleanChapterTitle(currentChapter?.title || '')}
            chapterIndex={currentChapterIdx}
            totalChapters={chapters.length || 1}
            paragraphIndex={currentParagraphIdx}
            totalParagraphsInChapter={paragraphsCountInChapter || 1}
            chapterStats={chapterStats}
            content={paragraphContent}
            percentInChapter={percentInChapter}
            onPrev={goToPrevParagraph}
            onNext={goToNextParagraph}
            onSelectParagraph={goToParagraph}
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
