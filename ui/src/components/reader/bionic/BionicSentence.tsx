import React from 'react'
import { Box } from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useAtomValue, useSetAtom } from 'jotai'
import { useNavigate } from '@tanstack/react-router'
import {
  isBionicEnabledAtom,
  chaptersAtom,
  currentChapterIdxAtom,
  currentParagraphIdxAtom,
} from '@/state/atoms'
import { resolveChapterTarget } from '@/lib/navigation'
import { RADIX_HEX_MAP } from '@/lib/radixColors'

export interface BionicSentenceProps {
  sentence: string
  highlightColor?: string
  isBionicEnabled?: boolean
  fontSize?: string | number
  fontFamily?: string
  lineHeight?: string | number
}

function applyBionicToText(text: string): React.ReactNode {
  if (!text) return null

  // Split sentence by words and whitespace
  const tokens = text.split(/(\s+)/)

  return tokens.map(function renderToken(token, index) {
    if (/^\s+$/.test(token)) {
      return token
    }

    // Match leading punctuation, word characters, and trailing punctuation
    const match = token.match(/^([^\p{L}\p{N}]*)([\p{L}\p{N}]+)([^\p{L}\p{N}]*)$/u)
    if (!match) {
      const len = token.length
      let fixationLen = 1
      if (len > 3 && len <= 6) fixationLen = 2
      else if (len > 6 && len <= 9) fixationLen = 3
      else if (len > 9) fixationLen = 4

      const fixation = token.slice(0, fixationLen)
      const remainder = token.slice(fixationLen)

      return (
        <span key={index} style={{ display: 'inline' }}>
          <span style={{ fontWeight: 700, color: 'var(--chakra-colors-fg, inherit)' }}>
            {fixation}
          </span>
          <span style={{ fontWeight: 400, opacity: 0.9, color: 'var(--chakra-colors-fg, inherit)' }}>
            {remainder}
          </span>
        </span>
      )
    }

    const [, leadingPunct, word, trailingPunct] = match
    const len = word.length
    let fixationLen = 1
    if (len > 3 && len <= 6) fixationLen = 2
    else if (len > 6 && len <= 9) fixationLen = 3
    else if (len > 9) fixationLen = 4

    const fixation = word.slice(0, fixationLen)
    const remainder = word.slice(fixationLen)

    return (
      <span key={index} style={{ display: 'inline' }}>
        {leadingPunct}
        <span style={{ fontWeight: 700, color: 'var(--chakra-colors-fg, inherit)' }}>
          {fixation}
        </span>
        <span style={{ fontWeight: 400, opacity: 0.9, color: 'var(--chakra-colors-fg, inherit)' }}>
          {remainder}
        </span>
        {trailingPunct}
      </span>
    )
  })
}

function transformNodeWithBionic(children: React.ReactNode): React.ReactNode {
  if (typeof children === 'string') {
    return applyBionicToText(children)
  }
  if (Array.isArray(children)) {
    return children.map((c, i) => (
      <React.Fragment key={i}>{transformNodeWithBionic(c)}</React.Fragment>
    ))
  }
  if (React.isValidElement(children) && (children.props as any)?.children) {
    return React.cloneElement(children as React.ReactElement<any>, {
      children: transformNodeWithBionic((children.props as any).children),
    })
  }
  return children
}

export function BionicSentence({
  sentence,
  highlightColor,
  isBionicEnabled,
  fontSize,
  fontFamily,
  lineHeight,
}: BionicSentenceProps) {
  const globalBionicEnabled = useAtomValue(isBionicEnabledAtom)
  const effectiveBionic = isBionicEnabled ?? globalBionicEnabled

  const chapters = useAtomValue(chaptersAtom)
  const setCurrentChapterIdx = useSetAtom(currentChapterIdxAtom)
  const setCurrentParagraphIdx = useSetAtom(currentParagraphIdxAtom)
  const navigate = useNavigate()

  return (
    <Box
      as="span"
      display="inline"
      fontSize={fontSize}
      fontFamily={fontFamily}
      lineHeight={lineHeight}
      bg={
        highlightColor
          ? `color-mix(in srgb, var(--chakra-colors-${highlightColor}-solid, ${RADIX_HEX_MAP[highlightColor] || '#ffc53d'}) 28%, transparent)`
          : 'transparent'
      }
      px={highlightColor ? '1.5' : '0'}
      py="0.5"
      rounded="md"
      transition="background-color 0.2s ease"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <>{effectiveBionic ? transformNodeWithBionic(children) : children}</>,
          em: ({ children }) => <em>{effectiveBionic ? transformNodeWithBionic(children) : children}</em>,
          strong: ({ children }) => <strong>{children}</strong>,
          code: ({ children }) => (
            <code style={{ background: 'var(--chakra-colors-bg-muted)', padding: '0.1em 0.3em', borderRadius: '4px' }}>
              {children}
            </code>
          ),
          h1: ({ children }) => (
            <Box as="span" display="block" fontWeight="bold" fontSize="1.35em" my="1" color="fg">
              {effectiveBionic ? transformNodeWithBionic(children) : children}
            </Box>
          ),
          h2: ({ children }) => (
            <Box as="span" display="block" fontWeight="bold" fontSize="1.2em" my="1" color="fg">
              {effectiveBionic ? transformNodeWithBionic(children) : children}
            </Box>
          ),
          h3: ({ children }) => (
            <Box as="span" display="block" fontWeight="semibold" fontSize="1.1em" my="0.5" color="fg">
              {effectiveBionic ? transformNodeWithBionic(children) : children}
            </Box>
          ),
          blockquote: ({ children }) => (
            <Box as="span" display="block" borderLeft="3px solid var(--chakra-colors-border)" pl="3" my="1" fontStyle="italic" color="fg.muted">
              {children}
            </Box>
          ),
          hr: () => <Box as="span" display="block" my="2" borderBottom="1px solid var(--chakra-colors-border)" />,
          a: ({ href, children }) => {
            const resolved = href ? resolveChapterTarget(href, chapters) : null
            const isInternal = Boolean(resolved?.type === 'chapter')

            return (
              <a
                href={href}
                target={isInternal ? undefined : '_blank'}
                rel={isInternal ? undefined : 'noreferrer'}
                style={{
                  textDecoration: 'underline',
                  color: isInternal ? 'var(--chakra-colors-ruby-solid, #e53e3e)' : 'inherit',
                  cursor: 'pointer',
                  fontWeight: isInternal ? 600 : 'normal',
                }}
                onClick={(e) => {
                  if (!href) return
                  if (resolved?.type === 'chapter' && resolved.chapterIndex) {
                    e.preventDefault()
                    e.stopPropagation()
                    setCurrentChapterIdx(resolved.chapterIndex)
                    setCurrentParagraphIdx(1)
                    try {
                      ;(navigate as any)({
                        search: (prev: any) => ({ ...prev, chapter: resolved.chapterIndex }),
                      })
                    } catch {
                      // Router search update fallback
                    }
                  }
                }}
              >
                {effectiveBionic ? transformNodeWithBionic(children) : children}
              </a>
            )
          },
        }}
      >
        {sentence}
      </ReactMarkdown>
    </Box>
  )
}
