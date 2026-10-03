import * as WailsAIService from '../bindings/github.com/raitucarp/periodus/internal/service/aiservice'
import * as WailsBookService from '../bindings/github.com/raitucarp/periodus/internal/service/bookservice'
import * as WailsReaderService from '../bindings/github.com/raitucarp/periodus/internal/service/readerservice'
import * as WailsSettingsService from '../bindings/github.com/raitucarp/periodus/internal/service/settingsservice'
import * as DbModels from '../bindings/github.com/raitucarp/periodus/internal/db/models'
import type {
  Book,
  Chapter,
  Paragraph,
  ReadingProgress,
  AISettings,
  ReadingSettings,
  Prompt,
  ParagraphStat,
  SentenceAnnotation,
  SentenceComment,
  ChapterHeatmapItem,
} from './types'

// Check if running inside Wails desktop environment
export function isWailsEnv(): boolean {
  if (typeof window === 'undefined') return false
  const w = window as any
  return Boolean(
    w._wails?.environment ||
    w.chrome?.webview ||
    w.__wails ||
    (w._wails && 'flags' in w._wails && 'environment' in w._wails)
  )
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

  async incrementParagraphVisit(bookId: string, chapterIndex: number, paragraphIndex: number): Promise<ParagraphStat | null> {
    if (!isWailsEnv()) return null
    return (await WailsReaderService.IncrementParagraphVisit(bookId, chapterIndex, paragraphIndex)) as unknown as ParagraphStat
  },

  async getParagraphStats(bookId: string, chapterIndex: number, paragraphIndex: number): Promise<ParagraphStat | null> {
    if (!isWailsEnv()) return null
    return (await WailsReaderService.GetParagraphStats(bookId, chapterIndex, paragraphIndex)) as unknown as ParagraphStat | null
  },

  async updateParagraphStats(
    bookId: string,
    chapterIndex: number,
    paragraphIndex: number,
    isSkipped: boolean,
    customFontFamily: string,
    customFontSize: number,
    isBookmarked: boolean = false,
    upvotesCount: number = 0,
    emojiReactions: string = '[]'
  ): Promise<void> {
    if (!isWailsEnv()) return
    await WailsReaderService.UpdateParagraphStats(
      bookId,
      chapterIndex,
      paragraphIndex,
      isSkipped,
      customFontFamily,
      customFontSize,
      isBookmarked,
      upvotesCount,
      emojiReactions
    )
  },

  async incrementParagraphUpvote(bookId: string, chapterIndex: number, paragraphIndex: number): Promise<number> {
    if (!isWailsEnv()) return 1
    return await WailsReaderService.IncrementParagraphUpvote(bookId, chapterIndex, paragraphIndex)
  },

  async getChapterHeatmap(bookId: string): Promise<ChapterHeatmapItem[]> {
    if (!isWailsEnv()) return []
    return (await WailsReaderService.GetChapterHeatmap(bookId)) as unknown as ChapterHeatmapItem[]
  },

  async getParagraphHeatmap(bookId: string, chapterIndex: number): Promise<ParagraphStat[]> {
    if (!isWailsEnv()) return []
    return (await WailsReaderService.GetParagraphHeatmap(bookId, chapterIndex)) as unknown as ParagraphStat[]
  },

  async getSentenceAnnotations(bookId: string, chapterIndex: number, paragraphIndex: number): Promise<SentenceAnnotation[]> {
    if (!isWailsEnv()) return []
    return (await WailsReaderService.GetSentenceAnnotations(bookId, chapterIndex, paragraphIndex)) as unknown as SentenceAnnotation[]
  },

  async saveSentenceAnnotation(ann: SentenceAnnotation): Promise<void> {
    if (!isWailsEnv()) return
    await WailsReaderService.SaveSentenceAnnotation(new DbModels.SentenceAnnotation(ann as any))
  },

  async incrementSentenceUpvote(sentenceHash: string, bookId: string, chapterIndex: number, paragraphIndex: number): Promise<number> {
    if (!isWailsEnv()) return 1
    return await WailsReaderService.IncrementSentenceUpvote(sentenceHash, bookId, chapterIndex, paragraphIndex)
  },

  async getSentenceComments(sentenceHash: string): Promise<SentenceComment[]> {
    if (!isWailsEnv()) return []
    return (await WailsReaderService.GetSentenceComments(sentenceHash)) as unknown as SentenceComment[]
  },

  async getParagraphComments(bookId: string): Promise<SentenceComment[]> {
    if (!isWailsEnv()) return []
    return (await WailsReaderService.GetParagraphComments(bookId)) as unknown as SentenceComment[]
  },

  async addSentenceComment(id: string, sentenceHash: string, bookId: string, content: string): Promise<void> {
    if (!isWailsEnv()) return
    await WailsReaderService.AddSentenceComment(id, sentenceHash, bookId, content)
  },

  async deleteSentenceComment(id: string): Promise<void> {
    if (!isWailsEnv()) return
    await WailsReaderService.DeleteSentenceComment(id)
  },

  async updateSentenceComment(id: string, content: string): Promise<void> {
    if (!isWailsEnv()) return
    await WailsReaderService.UpdateSentenceComment(id, content)
  },
}

const mockDefaultPrompts: Prompt[] = [
  {
    id: 'prompt-explain',
    name: 'Explain Nuance',
    description: 'Explain literary nuances, historical/cultural context, and subtext of the selected paragraph',
    icon: 'Sparkles',
    color_palette: 'ruby',
    system_prompt: 'You are a thoughtful reading companion and literary scholar. Analyze the selected text, illuminating subtext, historical/cultural context, metaphorical depth, and emotional resonance in clean, accessible markdown.',
    user_prompt: 'Analyze and explain the context, subtext, and literary nuances of the following passage:\n\n{{text}}',
    provider: '',
    model: '',
    temperature: 0.7,
    max_tokens: 2048,
    is_builtin: 1,
    is_enabled: 1,
    sort_order: 1,
    scope: 'global',
    book_id: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prompt-summarize',
    name: 'Quick Summary',
    description: 'Summarize key ideas and narrative events in 1-2 punchy, concise sentences',
    icon: 'FileText',
    color_palette: 'amber',
    system_prompt: 'You are an expert reading assistant. Distill the essence of the selected text into a punchy, accurate 1-2 sentence summary.',
    user_prompt: 'Provide a concise 1-2 sentence summary capturing the essence of the following passage:\n\n{{text}}',
    provider: '',
    model: '',
    temperature: 0.5,
    max_tokens: 1024,
    is_builtin: 1,
    is_enabled: 1,
    sort_order: 2,
    scope: 'global',
    book_id: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prompt-vocabulary',
    name: 'Vocabulary & Idioms',
    description: 'Identify notable vocabulary words, archaic phrases, idioms, and literary expressions',
    icon: 'Languages',
    color_palette: 'teal',
    system_prompt: 'You are a multilingual etymologist and linguist. Identify notable vocabulary words, archaic phrases, literary terms, or idioms from the text, explaining their definitions and nuances concisely.',
    user_prompt: 'Identify key vocabulary, rare terms, or idioms in the following passage and explain their meanings:\n\n{{text}}',
    provider: '',
    model: '',
    temperature: 0.3,
    max_tokens: 2048,
    is_builtin: 1,
    is_enabled: 1,
    sort_order: 3,
    scope: 'global',
    book_id: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prompt-critic',
    name: 'Literary Critique',
    description: 'Critique prose style, pacing, tone, and author techniques',
    icon: 'Brain',
    color_palette: 'purple',
    system_prompt: 'You are a perceptive literary critic. Critique the prose style, pacing, tone, and literary techniques employed by the author in this passage.',
    user_prompt: 'Provide a critical review of the prose style, voice, tone, and narrative techniques in the following excerpt:\n\n{{text}}',
    provider: '',
    model: '',
    temperature: 0.7,
    max_tokens: 2048,
    is_builtin: 1,
    is_enabled: 1,
    sort_order: 4,
    scope: 'global',
    book_id: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const AIService = {
  async analyzeParagraph(text: string, promptId: string): Promise<string> {
    return this.analyzeParagraphWithBook(text, promptId, '')
  },

  async analyzeParagraphWithBook(text: string, promptId: string, bookId: string = ''): Promise<string> {
    if (!isWailsEnv()) {
      await new Promise((r) => setTimeout(r, 800))
      const prompts = await SettingsService.getPrompts(bookId)
      const p = prompts.find((item) => item.id === promptId) || prompts[0]
      return `### ${p?.name || 'Analisis AI'}\n\nAnalisis berbasis model terhadap kutipan terpilih:\n\n> *"${text.slice(0, 120)}..."*\n\nParagraf ini mengeksplorasi nuansa reflektif dan memperkaya pemahaman pembaca terhadap atmosfer cerita.`
    }
    return await WailsAIService.AnalyzeParagraphWithBook(text, promptId, bookId)
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

  async getAISettings(bookId: string = ''): Promise<AISettings> {
    if (!isWailsEnv()) {
      const key = bookId ? `periodus_ai_${bookId}` : 'periodus_ai_global'
      const val = localStorage.getItem(key)
      if (val) return JSON.parse(val)
      return {
        scope: bookId || 'global',
        useGlobal: true,
        chat: {
          provider: 'gemini',
          model: 'gemini-2.5-flash',
          apiKey: localStorage.getItem('periodus_mock_gemini_key') || '',
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
    }
    const res = await WailsSettingsService.GetAISettings(bookId)
    return (res as unknown as AISettings) || {
      scope: bookId || 'global',
      useGlobal: true,
      chat: { provider: 'gemini', model: 'gemini-2.5-flash', apiKey: '', baseUrl: '', temperature: 0.7, maxTokens: 2048 },
      embedding: { provider: 'gemini', model: 'text-embedding-004', apiKey: '', baseUrl: '', dimensions: 768 },
      vision: { provider: 'gemini', model: 'gemini-2.5-flash', apiKey: '', baseUrl: '' },
    }
  },

  async saveAISettings(settings: AISettings): Promise<void> {
    if (!isWailsEnv()) {
      const key = settings.scope && settings.scope !== 'global' ? `periodus_ai_${settings.scope}` : 'periodus_ai_global'
      localStorage.setItem(key, JSON.stringify(settings))
      return
    }
    await WailsSettingsService.SaveAISettings(new DbModels.AISettings(settings as any))
  },

  async getReadingSettings(bookId: string = ''): Promise<ReadingSettings> {
    if (!isWailsEnv()) {
      const key = bookId ? `periodus_reading_${bookId}` : 'periodus_reading_global'
      const val = localStorage.getItem(key)
      if (val) return JSON.parse(val)
      return {
        scope: bookId || 'global',
        fontFamily: 'Literata',
        fontSize: 21,
        lineHeight: 'reading',
        maxWidth: '800px',
        textAlign: 'left',
      }
    }
    const res = await WailsSettingsService.GetReadingSettings(bookId)
    return (res as unknown as ReadingSettings) || {
      scope: bookId || 'global',
      fontFamily: 'Literata',
      fontSize: 21,
      lineHeight: 'reading',
      maxWidth: '800px',
      textAlign: 'left',
    }
  },

  async saveReadingSettings(settings: ReadingSettings): Promise<void> {
    if (!isWailsEnv()) {
      const key = settings.scope && settings.scope !== 'global' ? `periodus_reading_${settings.scope}` : 'periodus_reading_global'
      localStorage.setItem(key, JSON.stringify(settings))
      return
    }
    await WailsSettingsService.SaveReadingSettings(new DbModels.ReadingSettings(settings as any))
  },

  async getPrompts(bookId: string = ''): Promise<Prompt[]> {
    if (!isWailsEnv()) {
      const stored = localStorage.getItem('periodus_custom_prompts')
      return stored ? JSON.parse(stored) : mockDefaultPrompts
    }
    const res = await WailsSettingsService.GetPrompts(bookId)
    return (res as unknown as Prompt[]) || []
  },

  async savePrompt(prompt: Prompt): Promise<void> {
    if (!isWailsEnv()) {
      const current = await this.getPrompts(prompt.book_id || '')
      const idx = current.findIndex((p) => p.id === prompt.id)
      if (idx >= 0) {
        current[idx] = prompt
      } else {
        current.push(prompt)
      }
      localStorage.setItem('periodus_custom_prompts', JSON.stringify(current))
      return
    }
    await WailsSettingsService.SavePrompt(new DbModels.Prompt(prompt as any))
  },

  async deletePrompt(id: string): Promise<void> {
    if (!isWailsEnv()) {
      const current = await this.getPrompts()
      localStorage.setItem('periodus_custom_prompts', JSON.stringify(current.filter((p) => p.id !== id)))
      return
    }
    await WailsSettingsService.DeletePrompt(id)
  },

  async resetPrompts(): Promise<void> {
    if (!isWailsEnv()) {
      localStorage.removeItem('periodus_custom_prompts')
      return
    }
    await WailsSettingsService.ResetPrompts()
  },
}
