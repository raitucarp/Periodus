import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BookService } from '@/lib/bindings'
import { queryKeys } from '@/lib/queryClient'
import type { Book } from '@/lib/types'

export function useBooksQuery() {
  return useQuery<Book[]>({
    queryKey: queryKeys.books.all,
    queryFn: async function fetchBooks() {
      const books = await BookService.getAllBooks()
      return books || []
    },
  })
}

export function useBookQuery(id: string) {
  return useQuery<Book | null>({
    queryKey: queryKeys.books.detail(id),
    queryFn: async function fetchBook() {
      if (!id) return null
      const book = await BookService.getBook(id)
      return book || null
    },
    enabled: Boolean(id),
  })
}

export function useImportBookMutation() {
  const queryClient = useQueryClient()

  return useMutation<Book | null, Error, void>({
    mutationFn: async function performImport() {
      const imported = await BookService.selectAndImportBook()
      return imported
    },
    onSuccess: function onImportSuccess() {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all })
    },
  })
}

export function useDeleteBookMutation() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: async function performDelete(id: string) {
      await BookService.deleteBook(id)
    },
    onSuccess: function onDeleteSuccess(_data, deletedId) {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all })
      queryClient.removeQueries({ queryKey: queryKeys.books.detail(deletedId) })
    },
  })
}
