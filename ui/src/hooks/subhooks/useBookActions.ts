import { useAtom, useSetAtom } from 'jotai'
import { isImportingAtom, selectedBookIdAtom } from '@/state/atoms'
import { BookService } from '@/lib/bindings'

export function useBookActions(onBooksChanged: () => Promise<void>) {
  const [isImporting, setIsImporting] = useAtom(isImportingAtom)
  const setSelectedBookId = useSetAtom(selectedBookIdAtom)

  async function importBook() {
    try {
      setIsImporting(true)
      const imported = await BookService.selectAndImportBook()
      if (imported) {
        await onBooksChanged()
        setSelectedBookId(imported.id)
      }
    } catch (error) {
      console.error('Failed to import EPUB book:', error)
      throw error
    } finally {
      setIsImporting(false)
    }
  }

  async function deleteBook(id: string) {
    try {
      await BookService.deleteBook(id)
      setSelectedBookId(function checkDeleted(currentId) {
        if (currentId === id) return null
        return currentId
      })
      await onBooksChanged()
    } catch (error) {
      console.error('Failed to delete book:', error)
      throw error
    }
  }

  return {
    isImporting,
    importBook,
    deleteBook,
  }
}
