import { atom } from 'jotai'
import type { Book, Chapter, Paragraph, ReadingSettings, AISettings, Prompt } from '@/lib/types'
import { filter, find, includes, toLower, trim, isEmpty } from 'lodash-es'

// Primitive Base Atoms
export const booksAtom = atom<Book[]>([])
export const isBooksLoadingAtom = atom<boolean>(true)
export const hasLoadedBooksAtom = atom<boolean>(false)
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

export const defaultReadingSettings: ReadingSettings = {
  scope: 'global',
  fontFamily: 'Literata',
  fontSize: 21,
  lineHeight: 'reading',
  maxWidth: '800px',
  textAlign: 'left',
}

export const defaultAISettings: AISettings = {
  scope: 'global',
  useGlobal: true,
  chat: {
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    apiKey: '',
    baseUrl: '',
    temperature: 0.7,
    maxTokens: 2048,
  },
  embedding: {
    provider: 'gemini',
    model: 'text-embedding-004',
    apiKey: '',
    baseUrl: '',
    dimensions: 768,
  },
  vision: {
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    apiKey: '',
    baseUrl: '',
  },
}

export const readingSettingsAtom = atom<ReadingSettings>(defaultReadingSettings)
export const aiSettingsAtom = atom<AISettings>(defaultAISettings)
export const promptsListAtom = atom<Prompt[]>([])
export const settingsScopeAtom = atom<string>('global')
export const activeSettingsTabAtom = atom<string>('general')
export const activeAISubTabAtom = atom<string>('chat')

const storedBionic = typeof window !== 'undefined' ? localStorage.getItem('periodus_bionic_enabled') : null
export const isBionicEnabledAtom = atom<boolean>(
  storedBionic !== null ? storedBionic === 'true' : true
)
export const toggleBionicAtom = atom(
  (get) => get(isBionicEnabledAtom),
  (get, set) => {
    const next = !get(isBionicEnabledAtom)
    set(isBionicEnabledAtom, next)
    if (typeof window !== 'undefined') {
      localStorage.setItem('periodus_bionic_enabled', String(next))
    }
  }
)

const storedHeatmapColor = typeof window !== 'undefined' ? localStorage.getItem('periodus_heatmap_color') : null
export const heatmapColorAtom = atom<string>(storedHeatmapColor || 'blue')
export const setHeatmapColorAtom = atom(
  (get) => get(heatmapColorAtom),
  (get, set, newColor: string) => {
    set(heatmapColorAtom, newColor)
    if (typeof window !== 'undefined') {
      localStorage.setItem('periodus_heatmap_color', newColor)
    }
  }
)

const loadStoredParagraphColors = (): Record<string, string> => {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem('periodus_paragraph_colors')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export const paragraphColorsAtom = atom<Record<string, string>>(loadStoredParagraphColors())

export const setParagraphColorAtom = atom(
  null,
  (
    get,
    set,
    {
      bookId,
      chapterIndex,
      paragraphIndex,
      color,
    }: {
      bookId: string
      chapterIndex: number
      paragraphIndex: number
      color: string
    }
  ) => {
    const prev = get(paragraphColorsAtom)
    const key = `${bookId}_${chapterIndex}_${paragraphIndex}`
    const updated = { ...prev, [key]: color }
    set(paragraphColorsAtom, updated)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('periodus_paragraph_colors', JSON.stringify(updated))
      } catch (e) {
        console.error('Failed to save paragraph colors to localStorage', e)
      }
    }
  }
)

const loadStoredSentenceLetters = (): Record<string, string[]> => {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem('periodus_sentence_selected_letters')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export const sentenceFocusedLettersAtom = atom<Record<string, string[]>>(loadStoredSentenceLetters())

export const toggleSentenceLetterAtom = atom(
  null,
  (
    get,
    set,
    {
      sentenceHash,
      letter,
    }: {
      sentenceHash: string
      letter: string
    }
  ) => {
    const prev = get(sentenceFocusedLettersAtom)
    const currentList = prev[sentenceHash] || []
    const upper = letter.toUpperCase()
    let nextList: string[]
    if (currentList.includes(upper)) {
      nextList = currentList.filter((l) => l !== upper)
    } else {
      nextList = [...currentList, upper]
    }
    const nextMap = { ...prev }
    if (nextList.length === 0) {
      delete nextMap[sentenceHash]
    } else {
      nextMap[sentenceHash] = nextList
    }
    set(sentenceFocusedLettersAtom, nextMap)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('periodus_sentence_selected_letters', JSON.stringify(nextMap))
      } catch (e) {
        console.error('Failed to save sentence selected letters to localStorage', e)
      }
    }
  }
)

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
