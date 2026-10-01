import { useEffect } from 'react'
import { useAtom } from 'jotai'
import {
  currentChapterIdxAtom,
  currentParagraphIdxAtom,
  paragraphsAtom,
  paragraphContentAtom,
  isParagraphLoadingAtom,
  chaptersAtom,
} from '@/state/atoms'
import { ReaderService } from '@/lib/bindings'
import type { Book } from '@/lib/types'

export function useParagraphNavigation({ id, current_paragraph_index, total_paragraphs }: Book) {
  const [currentChapterIdx, setCurrentChapterIdx] = useAtom(currentChapterIdxAtom)
  const [currentParagraphIdx, setCurrentParagraphIdx] = useAtom(currentParagraphIdxAtom)
  const [paragraphs, setParagraphs] = useAtom(paragraphsAtom)
  const [chapters] = useAtom(chaptersAtom)
  const [paragraphContent, setParagraphContent] = useAtom(paragraphContentAtom)
  const [isLoadingContent, setIsLoadingContent] = useAtom(isParagraphLoadingAtom)

  useEffect(function initParagraphIndex() {
    setCurrentParagraphIdx(current_paragraph_index || 1)
  }, [id])

  useEffect(function fetchChapterParagraphs() {
    async function loadParagraphs() {
      try {
        const data = await ReaderService.getParagraphs(id, currentChapterIdx)
        setParagraphs(data || [])
        setCurrentParagraphIdx(function boundIndex(prev) {
          if (prev <= (data?.length || 1)) return prev
          return 1
        })
      } catch (error) {
        console.error('Failed to load chapter paragraphs:', error)
      }
    }
    loadParagraphs()
  }, [id, currentChapterIdx])

  useEffect(function fetchActiveParagraphContent() {
    if (paragraphs.length === 0) return
    async function loadContent() {
      try {
        setIsLoadingContent(true)
        const text = await ReaderService.getParagraphContent(
          id,
          currentChapterIdx,
          currentParagraphIdx
        )
        setParagraphContent(text)

        const totalP = total_paragraphs || 1
        const percent = Math.min(
          100,
          Math.round(((currentChapterIdx - 1) * 20 + currentParagraphIdx) / totalP * 100)
        )
        await ReaderService.saveProgress(id, currentChapterIdx, currentParagraphIdx, percent)
      } catch (error) {
        console.error('Failed to load paragraph content:', error)
      } finally {
        setIsLoadingContent(false)
      }
    }
    loadContent()
  }, [id, currentChapterIdx, currentParagraphIdx, paragraphs.length])

  function goToPrevParagraph() {
    if (currentParagraphIdx > 1) {
      setCurrentParagraphIdx(function decrement(prev) {
        return prev - 1
      })
    } else if (currentChapterIdx > 1) {
      setCurrentChapterIdx(function prevChapter(ch) {
        return ch - 1
      })
    }
  }

  function goToNextParagraph() {
    if (currentParagraphIdx < paragraphs.length) {
      setCurrentParagraphIdx(function increment(prev) {
        return prev + 1
      })
    } else if (currentChapterIdx < chapters.length) {
      setCurrentChapterIdx(function nextChapter(ch) {
        return ch + 1
      })
      setCurrentParagraphIdx(1)
    }
  }

  return {
    currentParagraphIdx,
    paragraphs,
    paragraphContent,
    isLoadingContent,
    goToPrevParagraph,
    goToNextParagraph,
  }
}
