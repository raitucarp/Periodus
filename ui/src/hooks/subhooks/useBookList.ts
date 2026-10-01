import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { booksAtom, isBooksLoadingAtom } from '@/state/atoms'
import { BookService } from '@/lib/bindings'

export function useBookList() {
  const [books, setBooks] = useAtom(booksAtom)
  const [isLoading, setIsLoading] = useAtom(isBooksLoadingAtom)

  async function loadBooks() {
    try {
      setIsLoading(true)
      const data = await BookService.getAllBooks()
      setBooks(data || [])
    } catch (error) {
      console.error('Failed to load books from database:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(function initBookList() {
    loadBooks()
  }, [])

  return {
    books,
    isLoading,
    loadBooks,
  }
}
