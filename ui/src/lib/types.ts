export interface Book {
  id: string
  title: string
  author: string
  description: string
  publisher: string
  language: string
  cover_path: string
  source_file_path: string
  total_chapters: number
  total_paragraphs: number
  created_at: string
  updated_at: string
  current_chapter_index: number
  current_paragraph_index: number
  percent_complete: number
  last_read_at: string
}

export interface Chapter {
  id: string
  book_id: string
  chapter_index: number
  title: string
  file_path: string
  paragraph_count: number
  created_at: string
}

export interface Paragraph {
  id: string
  book_id: string
  chapter_index: number
  paragraph_index: number
  file_path: string
  content_preview: string
  created_at: string
}

export interface ReadingProgress {
  book_id: string
  current_chapter_index: number
  current_paragraph_index: number
  percent_complete: number
  last_read_at: string
}
