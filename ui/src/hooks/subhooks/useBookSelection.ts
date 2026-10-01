import { useAtom, useSetAtom } from 'jotai'
import {
  selectedBookIdAtom,
  searchQueryAtom,
} from '@/state/atoms'
import type { Book } from '@/lib/types'

export function useBookSelection() {
  const setSelectedBookId = useSetAtom(selectedBookIdAtom)
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom)

  function selectBook(book: Book) {
    setSelectedBookId(book.id)
  }

  function clearSelectedBook() {
    setSelectedBookId(null)
  }

  function updateSearchQuery(query: string) {
    setSearchQuery(query)
  }

  return {
    searchQuery,
    selectBook,
    clearSelectedBook,
    updateSearchQuery,
  }
}
