import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes cache
      gcTime: 1000 * 60 * 30, // 30 minutes garbage collection
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export const queryKeys = {
  books: {
    all: ['books'] as const,
    detail: (id: string) => ['books', id] as const,
    progress: (id: string) => ['books', id, 'progress'] as const,
  },
  reader: {
    chapters: (bookId: string) => ['reader', bookId, 'chapters'] as const,
    paragraphs: (bookId: string, chapterIndex: number) =>
      ['reader', bookId, 'chapter', chapterIndex, 'paragraphs'] as const,
    content: (bookId: string, chapterIndex: number, paragraphIndex: number) =>
      ['reader', bookId, 'chapter', chapterIndex, 'paragraph', paragraphIndex, 'content'] as const,
    stats: (bookId: string, chapterIndex: number, paragraphIndex: number) =>
      ['reader', bookId, 'chapter', chapterIndex, 'paragraph', paragraphIndex, 'stats'] as const,
    chapterHeatmap: (bookId: string) => ['reader', bookId, 'heatmap', 'chapters'] as const,
    paragraphHeatmap: (bookId: string, chapterIndex: number) =>
      ['reader', bookId, 'chapter', chapterIndex, 'heatmap', 'paragraphs'] as const,
    sentenceAnnotations: (bookId: string, chapterIndex: number, paragraphIndex: number) =>
      ['reader', bookId, 'chapter', chapterIndex, 'paragraph', paragraphIndex, 'annotations'] as const,
    sentenceComments: (sentenceHash: string) =>
      ['reader', 'sentence', sentenceHash, 'comments'] as const,
    allComments: (bookId: string) => ['reader', bookId, 'allComments'] as const,
  },
  settings: {
    ai: (scope: string, bookId: string = '') => ['settings', 'ai', scope, bookId] as const,
    reading: (scope: string, bookId: string = '') => ['settings', 'reading', scope, bookId] as const,
    prompts: (bookId: string = '') => ['settings', 'prompts', bookId] as const,
  },
} as const
