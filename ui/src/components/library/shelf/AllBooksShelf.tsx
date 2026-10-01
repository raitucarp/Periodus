import React from 'react'
import type { Book } from '@/lib/types'
import { Flex, HStack, Stack, Heading, Text, Square } from '@chakra-ui/react'
import { map, isEmpty } from 'lodash-es'
import { match } from 'ts-pattern'
import { BookCard } from '../card'

export interface AllBooksShelfProps {
  heading: string
  books: Book[]
  emptyMessage: string
  onSelect: (book: Book) => void
  onDelete: (id: string, e: React.MouseEvent) => void
}

export function AllBooksShelf({
  heading,
  books,
  emptyMessage,
  onSelect,
  onDelete,
}: AllBooksShelfProps) {
  function renderBookCard(book: Book) {
    return (
      <BookCard
        key={book.id}
        book={book}
        onSelect={onSelect}
        onDelete={onDelete}
      />
    )
  }

  const content = match(isEmpty(books))
    .with(true, function renderEmpty() {
      return (
        <Text textStyle="shelf.empty">
          {emptyMessage}
        </Text>
      )
    })
    .with(false, function renderGrid() {
      const cards = map(books, renderBookCard)
      return (
        <Flex wrap="wrap" gap="6">
          {cards}
        </Flex>
      )
    })
    .exhaustive()

  return (
    <Stack as="section" gap="4">
      <HStack gap="2" align="center">
        <Square w="shelfIndicatorWidth" h="shelfIndicatorHeight" bg="border.muted" rounded="full" />
        <Heading as="h2" textStyle="shelf.title">
          {heading}
        </Heading>
      </HStack>
      {content}
    </Stack>
  )
}
