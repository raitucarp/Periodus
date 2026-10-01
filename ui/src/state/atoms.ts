import { atom } from 'jotai'
import type { Book, Chapter, Paragraph } from '@/lib/types'
import { filter, find, includes, toLower, trim, isEmpty } from 'lodash-es'

// Primitive Base Atoms
export const booksAtom = atom<Book[]>([])
export const isBooksLoadingAtom = atom<boolean>(true)
export const isImportingAtom = atom<boolean>(false)
export const searchQueryAtom = atom<string>('')

export const selectedBookIdAtom = atom<string | null>(null)

export const currentChapterIdxAtom = atom<number>(1)
export const currentParagraphIdxAtom = atom<number>(1)
export const chaptersAtom = atom<Chapter[]>([])
export const paragraphsAtom = atom<Paragraph[]>([])
export const paragraphContentAtom = atom<string>('')
export const isParagraphLoadingAtom = atom<boolean>(false)

export interface AIAnalysisState {
  loading: boolean
  result: string | null
  action: 'explain' | 'summarize' | 'vocabulary' | null
  error: string | null
}

export const initialAIState: AIAnalysisState = {
  loading: false,
  result: null,
  action: null,
  error: null,
}

export const aiAnalysisStateAtom = atom<AIAnalysisState>(initialAIState)

export const isSettingsOpenAtom = atom<boolean>(false)
export const apiKeyAtom = atom<string>('')
export const isSavingApiKeyAtom = atom<boolean>(false)
export const apiKeySaveSuccessAtom = atom<boolean>(false)

// --- Derived Atoms ---

export const selectedBookAtom = atom<Book | null>(function computeSelectedBook(get) {
  const books = get(booksAtom)
  const selectedId = get(selectedBookIdAtom)
  if (!selectedId) return null
  return find(books, function matchById(book) {
    return book.id === selectedId
  }) || null
})

export const totalBooksCountAtom = atom<number>(function computeTotalBooksCount(get) {
  return get(booksAtom).length
})

export const isLibraryEmptyAtom = atom<boolean>(function computeIsLibraryEmpty(get) {
  return isEmpty(get(booksAtom))
})

export const filteredBooksAtom = atom<Book[]>(function computeFilteredBooks(get) {
  const books = get(booksAtom)
  const query = trim(toLower(get(searchQueryAtom)))
  if (!query) return books

  return filter(books, function matchQuery(book) {
    const titleMatch = includes(toLower(book.title), query)
    const authorMatch = includes(toLower(book.author), query)
    return titleMatch || authorMatch
  })
})

export const inProgressBooksAtom = atom<Book[]>(function computeInProgressBooks(get) {
  const filtered = get(filteredBooksAtom)
  return filter(filtered, function hasProgress(book) {
    return book.percent_complete > 0
  })
})

export const currentChapterAtom = atom<Chapter>(function computeCurrentChapter(get) {
  const chapters = get(chaptersAtom)
  const currentIdx = get(currentChapterIdxAtom)
  const selected = get(selectedBookAtom)
  const bookId = selected ? selected.id : ''

  const found = find(chapters, function matchChapter(ch) {
    return ch.chapter_index === currentIdx
  })

  if (found) return found

  return {
    id: `${bookId}_${currentIdx}`,
    book_id: bookId,
    title: `Chapter ${currentIdx}`,
    chapter_index: currentIdx,
    file_path: '',
    paragraph_count: get(paragraphsAtom).length,
    created_at: '',
  }
})

export const paragraphsCountInChapterAtom = atom<number>(function computeParagraphsCount(get) {
  return get(paragraphsAtom).length
})

export const percentInChapterAtom = atom<number>(function computePercentInChapter(get) {
  const total = get(paragraphsAtom).length
  const current = get(currentParagraphIdxAtom)
  if (total <= 0) return 0
  return Math.round((current / total) * 100)
})

export const hasPrevParagraphAtom = atom<boolean>(function computeHasPrev(get) {
  const pIdx = get(currentParagraphIdxAtom)
  const chIdx = get(currentChapterIdxAtom)
  return pIdx > 1 || chIdx > 1
})

export const hasNextParagraphAtom = atom<boolean>(function computeHasNext(get) {
  const pIdx = get(currentParagraphIdxAtom)
  const totalP = get(paragraphsAtom).length
  const chIdx = get(currentChapterIdxAtom)
  const totalCh = get(chaptersAtom).length
  return pIdx < totalP || chIdx < totalCh
})
