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
        <Text color="fg.muted" textStyle="sm">
          {emptyMessage}
        </Text>
      )
    })
    .with(false, function renderGrid() {
      const cards = map(books, renderBookCard)
      return (
        <Flex wrap="wrap" gap="1.5rem">
          {cards}
        </Flex>
      )
    })
    .exhaustive()

  return (
    <Stack as="section" gap="1rem">
      <HStack gap="0.5rem" align="center">
        <Square w="0.25rem" h="1.125rem" bg="border.muted" rounded="full" />
        <Heading as="h2" fontFamily="heading" size="md" color="fg" fontWeight="bold">
          {heading}
        </Heading>
      </HStack>
      {content}
    </Stack>
  )
}
