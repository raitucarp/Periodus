import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AIService, ReaderService } from '@/lib/bindings'
import { queryKeys } from '@/lib/queryClient'
import type { Chapter, Paragraph, ReadingProgress } from '@/lib/types'

export function useChaptersQuery(bookId: string) {
  return useQuery<Chapter[]>({
    queryKey: queryKeys.reader.chapters(bookId),
    queryFn: async function fetchChapters() {
      if (!bookId) return []
      const chapters = await ReaderService.getChapters(bookId)
      return chapters || []
    },
    enabled: Boolean(bookId),
  })
}

export function useParagraphsQuery(bookId: string, chapterIndex: number) {
  return useQuery<Paragraph[]>({
    queryKey: queryKeys.reader.paragraphs(bookId, chapterIndex),
    queryFn: async function fetchParagraphs() {
      if (!bookId || !chapterIndex) return []
      const paragraphs = await ReaderService.getParagraphs(bookId, chapterIndex)
      return paragraphs || []
    },
    enabled: Boolean(bookId && chapterIndex),
  })
}

export function useParagraphContentQuery(
  bookId: string,
  chapterIndex: number,
  paragraphIndex: number
) {
  return useQuery<string>({
    queryKey: queryKeys.reader.content(bookId, chapterIndex, paragraphIndex),
    queryFn: async function fetchContent() {
      if (!bookId || !chapterIndex || !paragraphIndex) return ''
      return await ReaderService.getParagraphContent(bookId, chapterIndex, paragraphIndex)
    },
    enabled: Boolean(bookId && chapterIndex && paragraphIndex),
  })
}

interface SaveProgressParams {
  bookId: string
  chapterIndex: number
  paragraphIndex: number
  percent: number
}

export function useSaveProgressMutation() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, SaveProgressParams>({
    mutationFn: async function performSaveProgress(params: SaveProgressParams) {
      await ReaderService.saveProgress(
        params.bookId,
        params.chapterIndex,
        params.paragraphIndex,
        params.percent
      )
    },
    onSuccess: function onProgressSaved(_data, variables) {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.detail(variables.bookId) })
    },
  })
}

export function useProgressQuery(bookId: string) {
  return useQuery<ReadingProgress | null>({
    queryKey: queryKeys.books.progress(bookId),
    queryFn: async function fetchProgress() {
      if (!bookId) return null
      return await ReaderService.getProgress(bookId)
    },
    enabled: Boolean(bookId),
  })
}

interface AnalyzeParams {
  text: string
  promptId: string
  bookId?: string
}

export function useAnalyzeParagraphMutation() {
  return useMutation<string, Error, AnalyzeParams>({
    mutationFn: async function performAnalysis({ text, promptId, bookId }: AnalyzeParams) {
      return await AIService.analyzeParagraphWithBook(text, promptId, bookId || '')
    },
  })
}
