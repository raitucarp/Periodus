import { useEffect, useState, useMemo } from 'react'
import { useAtom } from 'jotai'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryClient'
import {
  currentChapterIdxAtom,
  currentParagraphIdxAtom,
  paragraphsAtom,
  paragraphContentAtom,
  isParagraphLoadingAtom,
  chaptersAtom,
} from '@/state/atoms'
import { ReaderService } from '@/lib/bindings'
import type { Book, ParagraphStat } from '@/lib/types'

export function useParagraphNavigation({ id, current_paragraph_index, total_paragraphs }: Book) {
  const queryClient = useQueryClient()
  const [currentChapterIdx, setCurrentChapterIdx] = useAtom(currentChapterIdxAtom)
  const [currentParagraphIdx, setCurrentParagraphIdx] = useAtom(currentParagraphIdxAtom)
  const [paragraphs, setParagraphs] = useAtom(paragraphsAtom)
  const [chapters] = useAtom(chaptersAtom)
  const [paragraphContent, setParagraphContent] = useAtom(paragraphContentAtom)
  const [isLoadingContent, setIsLoadingContent] = useAtom(isParagraphLoadingAtom)
  const [chapterStats, setChapterStats] = useState<ParagraphStat[]>([])

  useEffect(function initParagraphIndex() {
    setCurrentParagraphIdx(current_paragraph_index || 1)
  }, [id])

  useEffect(function fetchChapterParagraphs() {
    async function loadParagraphs() {
      try {
        const [data, stats] = await Promise.all([
          ReaderService.getParagraphs(id, currentChapterIdx),
          ReaderService.getParagraphHeatmap(id, currentChapterIdx),
        ])
        setParagraphs(data || [])
        setChapterStats(stats || [])
        setCurrentParagraphIdx(function boundIndex(prev) {
          if (data && data.length > 0) {
            if (prev <= data.length) return prev
            return data.length
          }
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

        // Increment visit counter in background and update local chapterStats & query cache
        ReaderService.incrementParagraphVisit(id, currentChapterIdx, currentParagraphIdx)
          .then((updatedStat) => {
            if (updatedStat) {
              setChapterStats((prev) => {
                const filtered = prev.filter((s) => s.paragraph_index !== currentParagraphIdx)
                return [...filtered, updatedStat]
              })

              // Immediately update React Query cache for paragraphHeatmap so it lights up without delay
              queryClient.setQueryData<ParagraphStat[]>(
                queryKeys.reader.paragraphHeatmap(id, currentChapterIdx),
                (old = []) => {
                  const filtered = old.filter((s) => s.paragraph_index !== currentParagraphIdx)
                  return [...filtered, updatedStat]
                }
              )
            }
            queryClient.invalidateQueries({
              queryKey: queryKeys.reader.paragraphHeatmap(id, currentChapterIdx),
            })
            queryClient.invalidateQueries({
              queryKey: queryKeys.reader.chapterHeatmap(id),
            })
          })
          .catch((err) => console.error('Failed to increment visit:', err))

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

  const statsMap = useMemo(
    function computeStatsMap() {
      const map = new Map<number, ParagraphStat>()
      for (const s of chapterStats) {
        map.set(s.paragraph_index, s)
      }
      return map
    },
    [chapterStats]
  )

  function goToPrevParagraph() {
    let target = currentParagraphIdx - 1
    while (target >= 1) {
      const stat = statsMap.get(target)
      if (!stat || stat.is_skipped !== 1) break
      target--
    }

    if (target >= 1) {
      setCurrentParagraphIdx(target)
    } else if (currentChapterIdx > 1) {
      const prevChIdx = currentChapterIdx - 1
      const prevCh = chapters.find((c) => c.chapter_index === prevChIdx)
      const lastP = prevCh?.paragraph_count && prevCh.paragraph_count > 0 ? prevCh.paragraph_count : 1

      // Verify and set accurate paragraph count if available
      ReaderService.getParagraphs(id, prevChIdx)
        .then((prevParas) => {
          if (prevParas && prevParas.length > 0) {
            setCurrentParagraphIdx(prevParas.length)
          }
        })
        .catch(() => {})

      setCurrentChapterIdx(prevChIdx)
      setCurrentParagraphIdx(lastP)
    }
  }

  function goToNextParagraph() {
    let target = currentParagraphIdx + 1
    while (target <= paragraphs.length) {
      const stat = statsMap.get(target)
      if (!stat || stat.is_skipped !== 1) break
      target++
    }

    if (target <= paragraphs.length) {
      setCurrentParagraphIdx(target)
    } else if (currentChapterIdx < chapters.length) {
      setCurrentChapterIdx(currentChapterIdx + 1)
      setCurrentParagraphIdx(1)
    }
  }

  function goToParagraph(index: number) {
    if (index >= 1 && index <= paragraphs.length) {
      setCurrentParagraphIdx(index)
    }
  }

  return {
    currentParagraphIdx,
    paragraphs,
    chapterStats,
    paragraphContent,
    isLoadingContent,
    goToPrevParagraph,
    goToNextParagraph,
    goToParagraph,
  }
}
