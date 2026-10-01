import { useAtomValue } from 'jotai'
import {
  currentChapterAtom,
  paragraphsCountInChapterAtom,
  percentInChapterAtom,
  hasPrevParagraphAtom,
  hasNextParagraphAtom,
} from '@/state/atoms'
import type { Book } from '@/lib/types'
import { useChapterNavigation } from './subhooks/useChapterNavigation'
import { useParagraphNavigation } from './subhooks/useParagraphNavigation'
import { useReaderKeyboard } from './subhooks/useReaderKeyboard'

export function useReader(book: Book) {
  const { chapters, currentChapterIdx, changeChapter } = useChapterNavigation(book)
  const {
    currentParagraphIdx,
    paragraphContent,
    isLoadingContent,
    goToPrevParagraph,
    goToNextParagraph,
    goToParagraph,
    chapterStats,
  } = useParagraphNavigation(book)

  const currentChapter = useAtomValue(currentChapterAtom)
  const paragraphsCountInChapter = useAtomValue(paragraphsCountInChapterAtom)
  const percentInChapter = useAtomValue(percentInChapterAtom)
  const hasPrev = useAtomValue(hasPrevParagraphAtom)
  const hasNext = useAtomValue(hasNextParagraphAtom)

  useReaderKeyboard({
    hasPrev,
    hasNext,
    onPrev: goToPrevParagraph,
    onNext: goToNextParagraph,
  })

  return {
    chapters,
    currentChapter,
    currentChapterIdx,
    currentParagraphIdx,
    paragraphsCountInChapter,
    paragraphContent,
    chapterStats,
    isLoadingContent,
    percentInChapter,
    hasPrev,
    hasNext,
    goToPrevParagraph,
    goToNextParagraph,
    goToParagraph,
    changeChapter,
  }
}
