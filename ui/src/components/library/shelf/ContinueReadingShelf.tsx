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
    <Stack as="section" gap="4" mb="10">
      <HStack gap="2" align="center">
        <Square w="shelfIndicatorWidth" h="shelfIndicatorHeight" bg="ruby.solid" rounded="full" />
        <Heading as="h2" textStyle="shelf.title">
          {heading}
        </Heading>
      </HStack>

      <HStack
        gap="5"
        overflowX="auto"
        pb="4"
      >
        {cards}
      </HStack>
    </Stack>
  )
}
