import React from 'react'
import { Box } from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useAtomValue } from 'jotai'
import { isBionicEnabledAtom } from '@/state/atoms'

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

  return (
    <Box
      as="span"
      display="inline"
      fontSize={fontSize}
      fontFamily={fontFamily}
      lineHeight={lineHeight}
      bg={
        highlightColor
          ? `color-mix(in srgb, var(--chakra-colors-${highlightColor}-subtle, rgba(255,220,100,0.2)) 60%, transparent)`
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
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>
              {effectiveBionic ? transformNodeWithBionic(children) : children}
            </a>
          ),
        }}
      >
        {sentence}
      </ReactMarkdown>
    </Box>
  )
}
