import React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Center, Spinner, Text } from '@chakra-ui/react'
import { ReaderView } from '@/components/reader/view'
import { useBookQuery } from '@/queries'

export const Route = createFileRoute('/reader/$bookId')({
  component: ReaderRoute,
})

function ReaderRoute() {
  const { bookId } = Route.useParams()
  const navigate = useNavigate()
  const { data: book, isLoading } = useBookQuery(bookId)

  function handleBack() {
    navigate({ to: '/' })
  }

  function handleOpenSettings() {
    navigate({ to: '/settings/ai' })
  }

  if (isLoading) {
    return (
      <Center minH="100vh" flexDirection="column" gap="3">
        <Spinner size="lg" colorPalette="ruby" />
        <Text textStyle="sm" color="fg.muted">
          Memuat buku...
        </Text>
      </Center>
    )
  }

  if (!book) {
    return (
      <Center minH="100vh" flexDirection="column" gap="3">
        <Text textStyle="md" fontWeight="semibold">
          Buku tidak ditemukan
        </Text>
      </Center>
    )
  }

  return (
    <ReaderView
      book={book}
      onBack={handleBack}
      onOpenSettings={handleOpenSettings}
    />
  )
}
