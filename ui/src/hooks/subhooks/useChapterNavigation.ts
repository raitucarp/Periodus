import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { chaptersAtom, currentChapterIdxAtom, currentParagraphIdxAtom } from '@/state/atoms'
import { ReaderService } from '@/lib/bindings'
import type { Book } from '@/lib/types'

export function useChapterNavigation({ id, current_chapter_index }: Book) {
  const [chapters, setChapters] = useAtom(chaptersAtom)
  const [currentChapterIdx, setCurrentChapterIdx] = useAtom(currentChapterIdxAtom)
  const [, setCurrentParagraphIdx] = useAtom(currentParagraphIdxAtom)

  useEffect(function initChapterIndex() {
    setCurrentChapterIdx(current_chapter_index || 1)
  }, [id])

  useEffect(function fetchBookChapters() {
    async function loadChapters() {
      try {
        const data = await ReaderService.getChapters(id)
        setChapters(data || [])
      } catch (error) {
        console.error('Failed to load chapters:', error)
      }
    }
    loadChapters()
  }, [id])

  function changeChapter(newIndex: number) {
    setCurrentChapterIdx(newIndex)
    setCurrentParagraphIdx(1)
  }

  return {
    chapters,
    currentChapterIdx,
    changeChapter,
  }
}
