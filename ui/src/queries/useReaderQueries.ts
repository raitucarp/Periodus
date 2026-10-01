import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AIService, ReaderService } from '@/lib/bindings'
import { queryKeys } from '@/lib/queryClient'
import type {
  Chapter,
  Paragraph,
  ReadingProgress,
  ParagraphStat,
  SentenceAnnotation,
  SentenceComment,
  ChapterHeatmapItem,
} from '@/lib/types'

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

// Paragraph Stats & Hits
export function useParagraphStatsQuery(bookId: string, chapterIndex: number, paragraphIndex: number) {
  return useQuery<ParagraphStat | null>({
    queryKey: queryKeys.reader.stats(bookId, chapterIndex, paragraphIndex),
    queryFn: async function fetchParagraphStats() {
      if (!bookId || !chapterIndex || !paragraphIndex) return null
      return await ReaderService.getParagraphStats(bookId, chapterIndex, paragraphIndex)
    },
    enabled: Boolean(bookId && chapterIndex && paragraphIndex),
  })
}

export function useIncrementParagraphVisitMutation() {
  const queryClient = useQueryClient()

  return useMutation<ParagraphStat | null, Error, { bookId: string; chapterIndex: number; paragraphIndex: number }>({
    mutationFn: async function performIncrement({ bookId, chapterIndex, paragraphIndex }) {
      return await ReaderService.incrementParagraphVisit(bookId, chapterIndex, paragraphIndex)
    },
    onSuccess: function onIncremented(_data, variables) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reader.stats(variables.bookId, variables.chapterIndex, variables.paragraphIndex),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.reader.chapterHeatmap(variables.bookId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.reader.paragraphHeatmap(variables.bookId, variables.chapterIndex),
      })
    },
  })
}

export function useUpdateParagraphStatsMutation() {
  const queryClient = useQueryClient()

  return useMutation<
    void,
    Error,
    {
      bookId: string
      chapterIndex: number
      paragraphIndex: number
      isSkipped: boolean
      customFontFamily: string
      customFontSize: number
      isBookmarked?: boolean
      upvotesCount?: number
      emojiReactions?: string
    }
  >({
    mutationFn: async function performUpdate(params) {
      await ReaderService.updateParagraphStats(
        params.bookId,
        params.chapterIndex,
        params.paragraphIndex,
        params.isSkipped,
        params.customFontFamily,
        params.customFontSize,
        params.isBookmarked ?? false,
        params.upvotesCount ?? 0,
        params.emojiReactions ?? '[]'
      )
    },
    onSuccess: function onUpdated(_data, variables) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reader.stats(variables.bookId, variables.chapterIndex, variables.paragraphIndex),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.reader.paragraphHeatmap(variables.bookId, variables.chapterIndex),
      })
    },
  })
}

export function useIncrementParagraphUpvoteMutation() {
  const queryClient = useQueryClient()

  return useMutation<
    number,
    Error,
    {
      bookId: string
      chapterIndex: number
      paragraphIndex: number
    }
  >({
    mutationFn: async function performIncrement(params) {
      return await ReaderService.incrementParagraphUpvote(params.bookId, params.chapterIndex, params.paragraphIndex)
    },
    onSuccess: function onUpdated(_data, variables) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reader.stats(variables.bookId, variables.chapterIndex, variables.paragraphIndex),
      })
    },
  })
}

// Heatmaps
export function useChapterHeatmapQuery(bookId: string) {
  return useQuery<ChapterHeatmapItem[]>({
    queryKey: queryKeys.reader.chapterHeatmap(bookId),
    queryFn: async function fetchChapterHeatmap() {
      if (!bookId) return []
      return await ReaderService.getChapterHeatmap(bookId)
    },
    enabled: Boolean(bookId),
  })
}

export function useParagraphHeatmapQuery(bookId: string, chapterIndex: number) {
  return useQuery<ParagraphStat[]>({
    queryKey: queryKeys.reader.paragraphHeatmap(bookId, chapterIndex),
    queryFn: async function fetchParagraphHeatmap() {
      if (!bookId || !chapterIndex) return []
      return await ReaderService.getParagraphHeatmap(bookId, chapterIndex)
    },
    enabled: Boolean(bookId && chapterIndex),
  })
}

// Sentence Annotations
export function useSentenceAnnotationsQuery(bookId: string, chapterIndex: number, paragraphIndex: number) {
  return useQuery<SentenceAnnotation[]>({
    queryKey: queryKeys.reader.sentenceAnnotations(bookId, chapterIndex, paragraphIndex),
    queryFn: async function fetchAnnotations() {
      if (!bookId || !chapterIndex || !paragraphIndex) return []
      return await ReaderService.getSentenceAnnotations(bookId, chapterIndex, paragraphIndex)
    },
    enabled: Boolean(bookId && chapterIndex && paragraphIndex),
  })
}

export function useSaveSentenceAnnotationMutation() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, SentenceAnnotation>({
    mutationFn: async function performSaveAnnotation(ann: SentenceAnnotation) {
      await ReaderService.saveSentenceAnnotation(ann)
    },
    onSuccess: function onAnnotationSaved(_data, variables) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reader.sentenceAnnotations(
          variables.book_id,
          variables.chapter_index,
          variables.paragraph_index
        ),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.reader.paragraphHeatmap(variables.book_id, variables.chapter_index),
      })
    },
  })
}

export function useIncrementSentenceUpvoteMutation() {
  const queryClient = useQueryClient()

  return useMutation<
    number,
    Error,
    { sentenceHash: string; bookId: string; chapterIndex: number; paragraphIndex: number }
  >({
    mutationFn: async function performUpvote({ sentenceHash, bookId, chapterIndex, paragraphIndex }) {
      return await ReaderService.incrementSentenceUpvote(sentenceHash, bookId, chapterIndex, paragraphIndex)
    },
    onSuccess: function onUpvoted(_data, variables) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reader.sentenceAnnotations(
          variables.bookId,
          variables.chapterIndex,
          variables.paragraphIndex
        ),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.reader.paragraphHeatmap(variables.bookId, variables.chapterIndex),
      })
    },
  })
}

// Sentence Comments (Marginalia)
export function useBookCommentsQuery(bookId: string) {
  return useQuery<SentenceComment[]>({
    queryKey: queryKeys.reader.allComments(bookId),
    queryFn: async function fetchAllBookComments() {
      if (!bookId) return []
      return await ReaderService.getParagraphComments(bookId)
    },
    enabled: Boolean(bookId),
  })
}

export function useSentenceCommentsQuery(sentenceHash: string) {
  return useQuery<SentenceComment[]>({
    queryKey: queryKeys.reader.sentenceComments(sentenceHash),
    queryFn: async function fetchComments() {
      if (!sentenceHash) return []
      return await ReaderService.getSentenceComments(sentenceHash)
    },
    enabled: Boolean(sentenceHash),
  })
}

export function useAddSentenceCommentMutation() {
  const queryClient = useQueryClient()

  return useMutation<
    void,
    Error,
    { id: string; sentenceHash: string; bookId: string; content: string; chapterIndex?: number; paragraphIndex?: number }
  >({
    mutationFn: async function performAddComment({ id, sentenceHash, bookId, content }) {
      await ReaderService.addSentenceComment(id, sentenceHash, bookId, content)
    },
    onSuccess: function onCommentAdded(_data, variables) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reader.allComments(variables.bookId),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.reader.sentenceComments(variables.sentenceHash),
      })
      if (variables.chapterIndex) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.reader.paragraphHeatmap(variables.bookId, variables.chapterIndex),
        })
      }
    },
  })
}

export function useDeleteSentenceCommentMutation() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { id: string; sentenceHash: string; bookId?: string; chapterIndex?: number }>({
    mutationFn: async function performDelete({ id }) {
      await ReaderService.deleteSentenceComment(id)
    },
    onSuccess: function onDeleted(_data, variables) {
      if (variables.bookId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.reader.allComments(variables.bookId),
        })
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.reader.sentenceComments(variables.sentenceHash),
      })
      if (variables.bookId && variables.chapterIndex) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.reader.paragraphHeatmap(variables.bookId, variables.chapterIndex),
        })
      }
    },
  })
}
