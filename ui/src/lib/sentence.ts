/**
 * Strips YAML frontmatter (---\n...\n---) from markdown text, extracting title if present.
 */
export function stripFrontmatter(text: string): { title?: string; content: string } {
  if (!text) return { content: '' }
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const match = normalized.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*([\r\n]*[\s\S]*)?$/)
  if (!match) return { content: text.trim() }

  const rawMeta = match[1] || ''
  const remaining = (match[2] || '').trim()

  let title: string | undefined
  const titleMatch = rawMeta.match(/^title:\s*(.*)$/im)
  if (titleMatch) {
    title = titleMatch[1].trim().replace(/^["']|["']$/g, '')
  }

  return { title, content: remaining }
}

const listItemRegex = /^\s*([*+-]|\d+[.)])\s+/

function isListItemStart(line: string): boolean {
  return listItemRegex.test(line)
}

function isIndentedContinuation(line: string): boolean {
  return /^\s{2,}\S/.test(line)
}

function splitStandardSentences(
  text: string,
  placeholders: { key: string; original: string }[]
): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    try {
      const segmenter = new (Intl as any).Segmenter('en', { granularity: 'sentence' })
      const raw = Array.from(segmenter.segment(text)).map((s: any) => s.segment)
      const stitched: string[] = []
      let buffer = ''

      for (let i = 0; i < raw.length; i++) {
        buffer += raw[i]

        while (i + 1 < raw.length) {
          const next = raw[i + 1]
          const trailingClosing = next.match(/^((?:[*_~`"')\]]|__MD_LINK_\d+__)+)(?:\s+|$)/)
          if (trailingClosing) {
            const attached = trailingClosing[1]
            buffer += attached
            const rest = next.slice(attached.length)
            raw[i + 1] = rest
            if (!rest.trim()) {
              i++
            }
            continue
          }
          break
        }

        const t = buffer.trim()
        if (t) {
          let restored = t
          for (const p of placeholders) {
            restored = restored.replace(p.key, p.original)
          }
          stitched.push(restored)
        }
        buffer = ''
      }

      if (stitched.length > 0) return stitched
    } catch {
      // fallback to regex below
    }
  }

  // Regex fallback matching sentence terminators (. ! ?) followed by any attached closing delimiters or links
  const rawSentences = text.match(/[^.!?]+[.!?]+(?:[*_~`"')\]]|__MD_LINK_\d+__)*|[^.!?]+$/g)
  if (!rawSentences) {
    let restored = text.trim()
    for (const p of placeholders) {
      restored = restored.replace(p.key, p.original)
    }
    return [restored]
  }

  return rawSentences
    .map((s) => {
      let restored = s.trim()
      for (const p of placeholders) {
        restored = restored.replace(p.key, p.original)
      }
      return restored
    })
    .filter((s) => s.length > 0)
}

/**
 * Splits paragraph text into discrete sentences using markdown-aware Intl.Segmenter or regex fallback.
 * Preserves inline markdown formatting (*, **, _, `, ~, links, footnotes) so sentence boundaries
 * do not split across or break markdown markup.
 * Also treats each markdown list item (ul, ol) as an individual sentence.
 */
export function splitIntoSentences(text: string): string[] {
  const { content } = stripFrontmatter(text)
  const trimmed = content.trim()
  if (!trimmed) return []

  // Protect markdown links [text](url "title"), images ![alt](url), and footnotes [^id] with safe placeholders
  const placeholders: { key: string; original: string }[] = []
  const protectedText = trimmed.replace(
    /!?\[(?:\\.|[^\]])*\]\((?:\\.|[^)])*\)|\[\^[a-zA-Z0-9_-]+\]/g,
    (match) => {
      const key = `__MD_LINK_${placeholders.length}__`
      placeholders.push({ key, original: match })
      return key
    }
  )

  const lines = protectedText.split('\n')
  const hasList = lines.some((l) => isListItemStart(l))

  if (hasList) {
    const sentences: string[] = []
    let textBuffer: string[] = []

    function flushTextBuffer() {
      if (textBuffer.length > 0) {
        const textChunk = textBuffer.join('\n').trim()
        if (textChunk) {
          sentences.push(...splitStandardSentences(textChunk, placeholders))
        }
        textBuffer = []
      }
    }

    let currentListItem: string[] = []

    function flushCurrentListItem() {
      if (currentListItem.length > 0) {
        let itemText = currentListItem.join('\n').trim()
        if (itemText) {
          for (const p of placeholders) {
            itemText = itemText.replace(p.key, p.original)
          }
          sentences.push(itemText)
        }
        currentListItem = []
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lineTrimmed = line.trim()

      if (!lineTrimmed) {
        flushCurrentListItem()
        flushTextBuffer()
        continue
      }

      if (isListItemStart(line)) {
        flushTextBuffer()
        flushCurrentListItem()
        currentListItem.push(line)
      } else if (currentListItem.length > 0 && isIndentedContinuation(line)) {
        currentListItem.push(line)
      } else {
        flushCurrentListItem()
        textBuffer.push(line)
      }
    }

    flushCurrentListItem()
    flushTextBuffer()

    if (sentences.length > 0) {
      return sentences
    }
  }

  return splitStandardSentences(protectedText, placeholders)
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
  const { content } = stripFrontmatter(text)
  const characters = content.length
  const words = content.trim().split(/\s+/).filter(Boolean).length
  const sentences = splitIntoSentences(content).length
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
  // 5. Strip enclosing quotes if any
  cleaned = cleaned.replace(/^["']|["']$/g, '')
  return cleaned.trim()
}
