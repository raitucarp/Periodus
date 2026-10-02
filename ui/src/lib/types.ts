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

export interface ModelConfig {
  provider: string
  model: string
  apiKey: string
  baseUrl: string
  temperature: number
  maxTokens: number
}

export interface EmbeddingConfig {
  provider: string
  model: string
  apiKey: string
  baseUrl: string
  dimensions: number
}

export interface VisionConfig {
  provider: string
  model: string
  apiKey: string
  baseUrl: string
}

export interface AISettings {
  scope: string
  useGlobal: boolean
  chat: ModelConfig
  embedding: EmbeddingConfig
  vision: VisionConfig
}

export interface ReadingSettings {
  scope: string
  fontFamily: string
  fontSize: number
  lineHeight: string
  maxWidth: string
  textAlign: string
}

export interface Prompt {
  id: string
  name: string
  description: string
  icon: string
  color_palette: string
  system_prompt: string
  user_prompt: string
  provider: string
  model: string
  temperature: number
  max_tokens: number
  is_builtin: number
  is_enabled: number
  sort_order: number
  scope: string
  book_id: string
  created_at: string
  updated_at: string
}

export interface ParagraphStat {
  book_id: string
  chapter_index: number
  paragraph_index: number
  visit_count: number
  is_skipped: number
  custom_font_family: string
  custom_font_size: number
  is_bookmarked: number
  upvotes_count: number
  emoji_reactions: string
  updated_at: string
}

export interface SentenceEmojiReaction {
  emoji: string
  count: number
}

export interface SentenceAnnotation {
  sentence_hash: string
  book_id: string
  chapter_index: number
  paragraph_index: number
  is_bookmarked: number
  is_collapsed?: number
  highlight_color: string
  upvotes_count: number
  emoji_reactions: string
  updated_at: string
}

export interface SentenceComment {
  id: string
  sentence_hash: string
  book_id: string
  content: string
  created_at: string
}

export interface ChapterHeatmapItem {
  chapter_index: number
  title: string
  paragraph_count: number
  total_visits: number
  visited_paragraphs: number
}
