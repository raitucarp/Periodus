import React from 'react'
import { Box, Heading, Text, Link, Code } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'motion/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useAtom } from 'jotai'
import { readingSettingsAtom } from '@/state/atoms'

export interface ParagraphReadingContentProps {
  content: string
  paragraphIndex: number
}

export function ParagraphReadingContent({ content, paragraphIndex }: ParagraphReadingContentProps) {
  const [readingSettings] = useAtom(readingSettingsAtom)

  const lineH =
    readingSettings.lineHeight === 'normal' || readingSettings.lineHeight === 'compact'
      ? 1.5
      : readingSettings.lineHeight === 'tall'
      ? 1.7
      : readingSettings.lineHeight === 'loose'
      ? 1.8
      : 2.2

  return (
    <Box
      flex="1"
      overflowY="auto"
      w="full"
      px="14"
      py="8"
      display="flex"
      flexDirection="column"
    >
      <Box maxW={readingSettings.maxWidth || 'readingMax'} w="full" mx="auto" my="auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={paragraphIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <Heading
                    as="h1"
                    fontFamily={readingSettings.fontFamily || 'heading'}
                    textStyle="reading.h1"
                    mb="5"
                    mt="2"
                  >
                    {children}
                  </Heading>
                ),
                h2: ({ children }) => (
                  <Heading
                    as="h2"
                    fontFamily={readingSettings.fontFamily || 'heading'}
                    textStyle="reading.h2"
                    mb="5"
                    mt="2"
                  >
                    {children}
                  </Heading>
                ),
                h3: ({ children }) => (
                  <Heading
                    as="h3"
                    fontFamily={readingSettings.fontFamily || 'heading'}
                    textStyle="reading.h3"
                    mb="4"
                    mt="2"
                  >
                    {children}
                  </Heading>
                ),
                h4: ({ children }) => (
                  <Heading
                    as="h4"
                    fontFamily={readingSettings.fontFamily || 'heading'}
                    textStyle="reading.h4"
                    mb="3"
                  >
                    {children}
                  </Heading>
                ),
                p: ({ children }) => (
                  <Text
                    as="p"
                    fontFamily={readingSettings.fontFamily || 'reading'}
                    fontSize={`${readingSettings.fontSize || 18}px`}
                    lineHeight={lineH}
                    textAlign={(readingSettings.textAlign as any) || 'left'}
                    color="fg"
                    mb="5"
                    _last={{ mb: 0 }}
                    wordBreak="break-word"
                  >
                    {children}
                  </Text>
                ),
                blockquote: ({ children }) => (
                  <Box
                    as="blockquote"
                    fontFamily={readingSettings.fontFamily || 'reading'}
                    fontSize={`${readingSettings.fontSize || 18}px`}
                    lineHeight={lineH}
                    layerStyle="readingQuoteBox"
                    pl="6"
                    pr="4"
                    py="3"
                    my="5"
                  >
                    {children}
                  </Box>
                ),
                strong: ({ children }) => (
                  <Text as="strong" fontWeight="bold" color="ruby.fg">
                    {children}
                  </Text>
                ),
                em: ({ children }) => (
                  <Text as="em" fontStyle="italic" color="fg">
                    {children}
                  </Text>
                ),
                a: ({ href, children }) => (
                  <Link
                    href={href}
                    color="ruby.fg"
                    textDecoration="underline"
                    textUnderlineOffset="0.2rem"
                  >
                    {children}
                  </Link>
                ),
                code: ({ children }) => (
                  <Code
                    textStyle="reading.code"
                    bg="whiteA.2"
                    px="1.5"
                    py="0.5"
                    rounded="sm"
                  >
                    {children}
                  </Code>
                ),
                hr: () => (
                  <Box
                    as="hr"
                    my="8"
                    border="none"
                    borderTopWidth="0.0625rem"
                    borderTopColor="glass.borderSubtle"
                  />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  )
}
