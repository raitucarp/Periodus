/**
 * Splits paragraph text into discrete sentences using Intl.Segmenter or regex fallback.
 */
export function splitIntoSentences(text: string): string[] {
  const trimmed = text.trim()
  if (!trimmed) return []

  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    try {
      const segmenter = new (Intl as any).Segmenter('en', { granularity: 'sentence' })
      const segments = Array.from(segmenter.segment(trimmed))
      const results = segments
        .map((s: any) => s.segment.trim())
        .filter((s: string) => s.length > 0)
      if (results.length > 0) return results
    } catch {
      // fallback to regex below
    }
  }

  // Regex fallback matching sentence terminators (. ! ?) followed by whitespace or quote
  const rawSentences = trimmed.match(/[^.!?]+[.!?]+["']?|[^.!?]+$/g)
  if (!rawSentences) return [trimmed]

  return rawSentences
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

/**
 * Computes a deterministic SHA-256 hash string for a sentence.
 */
export async function computeSentenceHash(sentence: string): Promise<string> {
  const normalized = sentence.trim().toLowerCase()
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder()
    const data = encoder.encode(normalized)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  }

  // Fast deterministic fallback if Web Crypto is unavailable
  let hash = 0
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return 's_' + Math.abs(hash).toString(16)
}

/**
 * Calculates paragraph reading statistics (words, characters, reading time, sentences).
 */
export function calculateParagraphStats(text: string): {
  words: number
  characters: number
  readingMinutes: number
  sentences: number
} {
  const characters = text.length
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const sentences = splitIntoSentences(text).length
  // Average reading speed: 200 words per minute
  const readingMinutes = Math.max(1, Math.round((words / 200) * 10) / 10)

  return {
    words,
    characters,
    readingMinutes,
    sentences,
  }
}

/**
 * Strips markdown links, formatting (bold/italic/code), and HTML tags from a chapter title.
 * e.g. "[*Chapter One*](toc.xhtml#toc-chapter001)" -> "Chapter One"
 */
export function cleanChapterTitle(title: string): string {
  if (!title) return ''
  let cleaned = title
  // 1. Extract markdown links: [link text](url) -> link text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  // 2. Strip HTML tags: <tag>text</tag> -> text
  cleaned = cleaned.replace(/<[^>]*>/g, '')
  // 3. Strip bold/italics: **text**, *text*, __text__, _text_
  cleaned = cleaned.replace(/(\*\*|__)(.*?)\1/g, '$2')
  cleaned = cleaned.replace(/(\*|_)(.*?)\1/g, '$2')
  // 4. Strip strikethrough and inline code
  cleaned = cleaned.replace(/~~(.*?)~~/g, '$1')
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1')
  // 5. Trim
  return cleaned.trim()
}

