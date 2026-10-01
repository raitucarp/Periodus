import * as WailsAIService from '../bindings/github.com/raitucarp/periodus/internal/service/aiservice'
import * as WailsBookService from '../bindings/github.com/raitucarp/periodus/internal/service/bookservice'
import * as WailsReaderService from '../bindings/github.com/raitucarp/periodus/internal/service/readerservice'
import * as WailsSettingsService from '../bindings/github.com/raitucarp/periodus/internal/service/settingsservice'
import type { Book, Chapter, Paragraph, ReadingProgress } from './types'

// Check if running inside Wails desktop environment
export function isWailsEnv(): boolean {
  return typeof window !== 'undefined' && ('_wails' in window || '__wails' in window)
}

export const BookService = {
  async getAllBooks(): Promise<Book[]> {
    if (!isWailsEnv()) {
      const stored = localStorage.getItem('periodus_mock_books')
      return stored ? JSON.parse(stored) : []
    }
    return (await WailsBookService.GetAllBooks()) as unknown as Book[]
  },

  async getBook(id: string): Promise<Book> {
    if (!isWailsEnv()) {
      const books: Book[] = JSON.parse(localStorage.getItem('periodus_mock_books') || '[]')
      const b = books.find((x) => x.id === id)
      if (!b) throw new Error('Book not found')
      return b
    }
    const book = await WailsBookService.GetBook(id)
    if (!book) throw new Error('Book not found')
    return book as unknown as Book
  },

  async selectAndImportBook(): Promise<Book | null> {
    if (!isWailsEnv()) {
      alert('File dialog is only available in Wails desktop app.')
      return null
    }
    const book = await WailsBookService.SelectAndImportBook()
    return (book as unknown as Book) || null
  },

  async deleteBook(id: string): Promise<void> {
    if (!isWailsEnv()) {
      const books: Book[] = JSON.parse(localStorage.getItem('periodus_mock_books') || '[]')
      localStorage.setItem('periodus_mock_books', JSON.stringify(books.filter((b) => b.id !== id)))
      return
    }
    await WailsBookService.DeleteBook(id)
  },
}

export const ReaderService = {
  async getChapters(bookId: string): Promise<Chapter[]> {
    if (!isWailsEnv()) {
      return [
        {
          id: `${bookId}_1`,
          book_id: bookId,
          chapter_index: 1,
          title: 'Chapter 1: The Beginning',
          file_path: '',
          paragraph_count: 5,
          created_at: new Date().toISOString(),
        },
      ]
    }
    return (await WailsReaderService.GetChapters(bookId)) as unknown as Chapter[]
  },

  async getParagraphs(bookId: string, chapterIndex: number): Promise<Paragraph[]> {
    if (!isWailsEnv()) {
      return Array.from({ length: 5 }, (_, i) => ({
        id: `${bookId}_${chapterIndex}_${i + 1}`,
        book_id: bookId,
        chapter_index: chapterIndex,
        paragraph_index: i + 1,
        file_path: '',
        content_preview: `Preview of sample paragraph ${i + 1}`,
        created_at: new Date().toISOString(),
      }))
    }
    return (await WailsReaderService.GetParagraphs(bookId, chapterIndex)) as unknown as Paragraph[]
  },

  async getParagraphContent(bookId: string, chapterIndex: number, paragraphIndex: number): Promise<string> {
    if (!isWailsEnv()) {
      return `Ini adalah contoh teks paragraf ke-${paragraphIndex} pada Chapter ${chapterIndex}. Teks ini disajikan dalam format Markdown yang rapi dengan dukungan navigasi dan analisis AI di panel kiri.`
    }
    return await WailsReaderService.GetParagraphContent(bookId, chapterIndex, paragraphIndex)
  },

  async saveProgress(bookId: string, chapterIndex: number, paragraphIndex: number, percent: number): Promise<void> {
    if (!isWailsEnv()) return
    await WailsReaderService.SaveProgress(bookId, chapterIndex, paragraphIndex, percent)
  },

  async getProgress(bookId: string): Promise<ReadingProgress | null> {
    if (!isWailsEnv()) return null
    return (await WailsReaderService.GetProgress(bookId)) as unknown as ReadingProgress | null
  },
}

export const AIService = {
  async analyzeParagraph(text: string, analysisType: 'explain' | 'summarize' | 'vocabulary'): Promise<string> {
    if (!isWailsEnv()) {
      await new Promise((r) => setTimeout(r, 900))
      switch (analysisType) {
        case 'summarize':
          return 'Ringkasan: Paragraf ini mendeskripsikan permulaan narasi dan suasana awal karakter.'
        case 'vocabulary':
          return '1. **Mencerahkan**: Memberi kejelasan atau inspirasi baru.\n2. **Konteks**: Lingkungan atau latar belakang situasi teks.'
        case 'explain':
        default:
          return 'Paragraf ini mengeksplorasi pengenalan bab dengan nada reflektif, mengajak pembaca mendalami latar suasana.'
      }
    }
    return await WailsAIService.AnalyzeParagraph(text, analysisType)
  },
}

export const SettingsService = {
  async getApiKey(): Promise<string> {
    if (!isWailsEnv()) {
      return localStorage.getItem('periodus_mock_gemini_key') || ''
    }
    return await WailsSettingsService.GetApiKey()
  },

  async saveApiKey(key: string): Promise<void> {
    if (!isWailsEnv()) {
      localStorage.setItem('periodus_mock_gemini_key', key)
      return
    }
    await WailsSettingsService.SaveApiKey(key)
  },
}
