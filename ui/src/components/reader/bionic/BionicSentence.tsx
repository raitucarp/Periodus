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
  focusedLetters?: string[]
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

function applyLettersFocusToText(text: string, letters: string[]): React.ReactNode {
  if (!text) return null
  if (!letters || letters.length === 0) return text

  const targetSet = new Set(letters.map((l) => l.toUpperCase()))
  const escapedLetters = Array.from(targetSet).map((l) => l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const regex = new RegExp(`(${escapedLetters.join('|')})`, 'gi')
  const parts = text.split(regex)

  return parts.map((part, index) => {
    if (!part) return null
    if (targetSet.has(part.toUpperCase())) {
      return (
        <span
          key={index}
          style={{
            fontWeight: 800,
            opacity: 1,
            color: 'var(--chakra-colors-fg, inherit)',
          }}
        >
          {part}
        </span>
      )
    }
    return (
      <span
        key={index}
        style={{
          opacity: 0.25,
          fontWeight: 400,
          transition: 'opacity 0.15s ease',
        }}
      >
        {part}
      </span>
    )
  })
}

function transformNodeWithLettersFocus(children: React.ReactNode, letters: string[]): React.ReactNode {
  if (typeof children === 'string') {
    return applyLettersFocusToText(children, letters)
  }
  if (Array.isArray(children)) {
    return children.map((c, i) => (
      <React.Fragment key={i}>{transformNodeWithLettersFocus(c, letters)}</React.Fragment>
    ))
  }
  if (React.isValidElement(children) && (children.props as any)?.children) {
    return React.cloneElement(children as React.ReactElement<any>, {
      children: transformNodeWithLettersFocus((children.props as any).children, letters),
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
  focusedLetters,
}: BionicSentenceProps) {
  const globalBionicEnabled = useAtomValue(isBionicEnabledAtom)
  const effectiveBionic = isBionicEnabled ?? globalBionicEnabled

  const chapters = useAtomValue(chaptersAtom)
  const setCurrentChapterIdx = useSetAtom(currentChapterIdxAtom)
  const setCurrentParagraphIdx = useSetAtom(currentParagraphIdxAtom)
  const navigate = useNavigate()

  function renderContent(node: React.ReactNode): React.ReactNode {
    if (focusedLetters && focusedLetters.length > 0) {
      return transformNodeWithLettersFocus(node, focusedLetters)
    }
    if (effectiveBionic) {
      return transformNodeWithBionic(node)
    }
    return node
  }

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
          p: ({ children }) => <>{renderContent(children)}</>,
          em: ({ children }) => <em>{renderContent(children)}</em>,
          strong: ({ children }) => <strong>{renderContent(children)}</strong>,
          code: ({ children }) => (
            <code style={{ background: 'var(--chakra-colors-bg-muted)', padding: '0.1em 0.3em', borderRadius: '4px' }}>
              {renderContent(children)}
            </code>
          ),
          h1: ({ children }) => (
            <Box as="span" display="block" fontWeight="bold" fontSize="1.35em" my="1" color="fg">
              {renderContent(children)}
            </Box>
          ),
          h2: ({ children }) => (
            <Box as="span" display="block" fontWeight="bold" fontSize="1.2em" my="1" color="fg">
              {renderContent(children)}
            </Box>
          ),
          h3: ({ children }) => (
            <Box as="span" display="block" fontWeight="semibold" fontSize="1.1em" my="0.5" color="fg">
              {renderContent(children)}
            </Box>
          ),
          blockquote: ({ children }) => (
            <Box as="span" display="block" borderLeft="3px solid var(--chakra-colors-border)" pl="3" my="1" fontStyle="italic" color="fg.muted">
              {renderContent(children)}
            </Box>
          ),
          ul: ({ children }) => (
            <Box as="ul" m="0" pl="4" style={{ listStyleType: 'disc' }}>
              {children}
            </Box>
          ),
          ol: ({ children }) => (
            <Box as="ol" m="0" pl="4" style={{ listStyleType: 'decimal' }}>
              {children}
            </Box>
          ),
          li: ({ children }) => (
            <Box as="li" m="0" p="0" style={{ display: 'list-item' }}>
              {renderContent(children)}
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
                {renderContent(children)}
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
