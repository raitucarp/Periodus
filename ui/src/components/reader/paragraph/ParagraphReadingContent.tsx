import React from 'react'
import { Box, Heading, Text, Link, Code } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'motion/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export interface ParagraphReadingContentProps {
  content: string
  paragraphIndex: number
}

export function ParagraphReadingContent({ content, paragraphIndex }: ParagraphReadingContentProps) {
  return (
    <Box
      flex="1"
      overflowY="auto"
      w="full"
      px="3.5rem"
      py="2rem"
      display="flex"
      flexDirection="column"
    >
      <Box maxW="46rem" w="full" mx="auto" my="auto">
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
                    fontFamily="heading"
                    fontSize="2rem"
                    fontWeight="bold"
                    lineHeight="1.3"
                    color="fg"
                    mb="1.25rem"
                    mt="0.5rem"
                  >
                    {children}
                  </Heading>
                ),
                h2: ({ children }) => (
                  <Heading
                    as="h2"
                    fontFamily="heading"
                    fontSize="1.625rem"
                    fontWeight="bold"
                    lineHeight="1.35"
                    color="fg"
                    mb="1.25rem"
                    mt="0.5rem"
                  >
                    {children}
                  </Heading>
                ),
                h3: ({ children }) => (
                  <Heading
                    as="h3"
                    fontFamily="heading"
                    fontSize="1.375rem"
                    fontWeight="semibold"
                    lineHeight="1.4"
                    color="fg"
                    mb="1rem"
                    mt="0.5rem"
                  >
                    {children}
                  </Heading>
                ),
                h4: ({ children }) => (
                  <Heading
                    as="h4"
                    fontFamily="heading"
                    fontSize="1.1875rem"
                    fontWeight="semibold"
                    lineHeight="1.4"
                    color="fg"
                    mb="0.75rem"
                  >
                    {children}
                  </Heading>
                ),
                p: ({ children }) => (
                  <Text
                    as="p"
                    fontFamily="reading"
                    fontSize="1.25rem"
                    lineHeight="2.2"
                    letterSpacing="0.01em"
                    color="fg"
                    mb="1.25rem"
                    _last={{ mb: 0 }}
                    wordBreak="break-word"
                  >
                    {children}
                  </Text>
                ),
                blockquote: ({ children }) => (
                  <Box
                    as="blockquote"
                    fontFamily="editorial"
                    fontSize="1.1875rem"
                    lineHeight="2.0"
                    borderLeftWidth="0.1875rem"
                    borderLeftStyle="solid"
                    borderLeftColor="ruby.solid"
                    bg="glass.sidebar"
                    pl="1.5rem"
                    pr="1rem"
                    py="0.75rem"
                    my="1.25rem"
                    roundedRight="lg"
                    fontStyle="italic"
                    color="fg.muted"
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
                    fontFamily="mono"
                    fontSize="0.9em"
                    bg="whiteA.2"
                    px="0.375rem"
                    py="0.125rem"
                    rounded="sm"
                  >
                    {children}
                  </Code>
                ),
                hr: () => (
                  <Box
                    as="hr"
                    my="2rem"
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
