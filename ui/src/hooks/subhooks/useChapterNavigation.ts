import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { useNavigate } from '@tanstack/react-router'
import { chaptersAtom, currentChapterIdxAtom, currentParagraphIdxAtom } from '@/state/atoms'
import { ReaderService } from '@/lib/bindings'
import type { Book } from '@/lib/types'

export function useChapterNavigation({ id, current_chapter_index }: Book) {
  const [chapters, setChapters] = useAtom(chaptersAtom)
  const [currentChapterIdx, setCurrentChapterIdx] = useAtom(currentChapterIdxAtom)
  const [, setCurrentParagraphIdx] = useAtom(currentParagraphIdxAtom)
  const navigate = useNavigate()

  useEffect(function initChapterIndex() {
    setCurrentChapterIdx((prev) => prev || current_chapter_index || 1)
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
    try {
      ;(navigate as any)({
        to: '/reader/$bookId',
        params: { bookId: id },
        search: { chapter: newIndex, paragraph: 1 },
      })
    } catch {
      // Fallback
    }
  }

  return {
    chapters,
    currentChapterIdx,
    changeChapter,
  }
}
