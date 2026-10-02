import type { Chapter } from './types'

export interface ResolvedLink {
  type: 'chapter' | 'hash' | 'external'
  chapterIndex?: number
  hash?: string
  url?: string
}

/**
 * Resolves a markdown link (href) from an EPUB into a target chapter index, anchor, or external link.
 * Handles patterns such as:
 * - "58_Footnote.xhtml#footnote_1" -> chapter 58
 * - "23_Epilogue.xhtml#footnote-034-backlink" -> chapter 23
 * - "chapter_5.html" -> chapter 5
 * - "ch_12" -> chapter 12
 * - "#footnote_1" -> hash anchor
 * - "https://..." -> external link
 */
export function resolveChapterTarget(href: string, chapters: Chapter[]): ResolvedLink | null {
  if (!href) return null

  // 1. External URLs
  if (/^(?:https?:|\/\/|mailto:)/i.test(href)) {
    return { type: 'external', url: href }
  }

  const [pathPart, hashPart] = href.split('#')

  if (pathPart) {
    const filename = pathPart.split('/').pop() || pathPart

    // Check leading number: "58_Footnote.xhtml" -> 58
    const leadingNumMatch = filename.match(/^(\d+)/)
    if (leadingNumMatch) {
      const idx = parseInt(leadingNumMatch[1], 10)
      if (chapters.some((c) => c.chapter_index === idx)) {
        return { type: 'chapter', chapterIndex: idx, hash: hashPart }
      }
    }

    // Check "ch_12", "chapter-12", "part12"
    const namedMatch = filename.match(/(?:ch(?:apter)?|part)[_-]?(\d+)/i)
    if (namedMatch) {
      const idx = parseInt(namedMatch[1], 10)
      if (chapters.some((c) => c.chapter_index === idx)) {
        return { type: 'chapter', chapterIndex: idx, hash: hashPart }
      }
    }

    // Check any integer in filename
    const anyNumMatch = filename.match(/(\d+)/)
    if (anyNumMatch) {
      const idx = parseInt(anyNumMatch[1], 10)
      if (chapters.some((c) => c.chapter_index === idx)) {
        return { type: 'chapter', chapterIndex: idx, hash: hashPart }
      }
    }

    // Match file_path ending or chapter ID
    const fileMatch = chapters.find(
      (c) => c.file_path && (c.file_path.includes(filename) || filename.includes(c.id))
    )
    if (fileMatch) {
      return { type: 'chapter', chapterIndex: fileMatch.chapter_index, hash: hashPart }
    }
  }

  // If only hash was provided: e.g. "#chapter_5" or "#footnote_1"
  if (hashPart) {
    const hashChMatch = hashPart.match(/(?:ch(?:apter)?)[_-]?(\d+)/i)
    if (hashChMatch) {
      const idx = parseInt(hashChMatch[1], 10)
      if (chapters.some((c) => c.chapter_index === idx)) {
        return { type: 'chapter', chapterIndex: idx, hash: hashPart }
      }
    }
    return { type: 'hash', hash: hashPart }
  }

  return null
}
