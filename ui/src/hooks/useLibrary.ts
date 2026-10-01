import { useAtomValue } from 'jotai'
import {
  selectedBookAtom,
  totalBooksCountAtom,
  isLibraryEmptyAtom,
  filteredBooksAtom,
  inProgressBooksAtom,
} from '@/state/atoms'
import { useBookList } from './subhooks/useBookList'
import { useBookActions } from './subhooks/useBookActions'
import { useBookSelection } from './subhooks/useBookSelection'

export function useLibrary() {
  const { isLoading, loadBooks } = useBookList()
  const { isImporting, importBook, deleteBook } = useBookActions(loadBooks)
  const { searchQuery, selectBook, clearSelectedBook, updateSearchQuery } = useBookSelection()

  const books = useAtomValue(filteredBooksAtom)
  const inProgressBooks = useAtomValue(inProgressBooksAtom)
  const totalBooksCount = useAtomValue(totalBooksCountAtom)
  const isLibraryEmpty = useAtomValue(isLibraryEmptyAtom)
  const selectedBook = useAtomValue(selectedBookAtom)

  return {
    books,
    inProgressBooks,
    totalBooksCount,
    isLibraryEmpty,
    selectedBook,
    isLoading,
    isImporting,
    searchQuery,
    loadBooks,
    importBook,
    deleteBook,
    selectBook,
    clearSelectedBook,
    updateSearchQuery,
  }
}
