import { useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import { booksAtom, isBooksLoadingAtom, hasLoadedBooksAtom } from '@/state/atoms'
import { BookService } from '@/lib/bindings'

export function useBookList() {
  const [books, setBooks] = useAtom(booksAtom)
  const [isLoading, setIsLoading] = useAtom(isBooksLoadingAtom)
  const [hasLoaded, setHasLoaded] = useAtom(hasLoadedBooksAtom)
  const isFetchingRef = useRef(false)

  async function loadBooks(force = false) {
    if (isFetchingRef.current && !force) return
    isFetchingRef.current = true
    try {
      setIsLoading(true)
      // Safety timeout: don't let loading screen stay stuck indefinitely if IPC stalls
      const fetchPromise = BookService.getAllBooks()
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout loading books from database')), 10000)
      )
      const data = await Promise.race([fetchPromise, timeoutPromise])
      setBooks(data || [])
    } catch (error) {
      console.error('Failed to load books from database:', error)
    } finally {
      setIsLoading(false)
      setHasLoaded(true)
      isFetchingRef.current = false
    }
  }

  useEffect(function initBookList() {
    if (!hasLoaded) {
      loadBooks()
    }
  }, [hasLoaded])

  return {
    books,
    isLoading,
    loadBooks: () => loadBooks(true),
  }
}

