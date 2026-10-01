import React from 'react'
import type { Book } from '@/lib/types'
import { HStack, Stack, Heading, Square } from '@chakra-ui/react'
import { map } from 'lodash-es'
import { BookCard } from '../card'

export interface ContinueReadingShelfProps {
  heading: string
  books: Book[]
  onSelect: (book: Book) => void
  onDelete: (id: string, e: React.MouseEvent) => void
}

export function ContinueReadingShelf({
  heading,
  books,
  onSelect,
  onDelete,
}: ContinueReadingShelfProps) {
  function renderBookCard(book: Book) {
    return (
      <BookCard
        key={`progress-${book.id}`}
        book={book}
        onSelect={onSelect}
        onDelete={onDelete}
      />
    )
  }

  const cards = map(books, renderBookCard)

  return (
    <Stack as="section" gap="1rem" mb="2.5rem">
      <HStack gap="0.5rem" align="center">
        <Square w="0.25rem" h="1.125rem" bg="ruby.solid" rounded="full" />
        <Heading as="h2" fontFamily="heading" size="md" color="fg" fontWeight="bold">
          {heading}
        </Heading>
      </HStack>

      <HStack
        gap="1.25rem"
        overflowX="auto"
        pb="1rem"
      >
        {cards}
      </HStack>
    </Stack>
  )
}
