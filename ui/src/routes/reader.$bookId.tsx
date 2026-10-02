import React, { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Center, Spinner, Text } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { ReaderView } from '@/components/reader/view'
import { useBookQuery } from '@/queries'
import { currentChapterIdxAtom, currentParagraphIdxAtom } from '@/state/atoms'

interface ReaderSearchParams {
  chapter?: number
  paragraph?: number
}

export const Route = createFileRoute('/reader/$bookId')({
  validateSearch: (search: Record<string, unknown>): ReaderSearchParams => {
    const ch = Number(search.chapter)
    const p = Number(search.paragraph)
    return {
      chapter: !isNaN(ch) && ch > 0 ? ch : undefined,
      paragraph: !isNaN(p) && p > 0 ? p : undefined,
    }
  },
  component: ReaderRoute,
})

function ReaderRoute() {
  const { bookId } = Route.useParams()
  const search = Route.useSearch()
  const navigate = useNavigate()
  const { data: book, isLoading } = useBookQuery(bookId)

  const [currentChapterIdx, setCurrentChapterIdx] = useAtom(currentChapterIdxAtom)
  const [, setCurrentParagraphIdx] = useAtom(currentParagraphIdxAtom)

  // Sync TanStack Router URL search params -> reader atom
  useEffect(() => {
    if (search.chapter && search.chapter !== currentChapterIdx) {
      setCurrentChapterIdx(search.chapter)
      if (search.paragraph) {
        setCurrentParagraphIdx(search.paragraph)
      } else {
        setCurrentParagraphIdx(1)
      }
    }
  }, [search.chapter, search.paragraph, currentChapterIdx, setCurrentChapterIdx, setCurrentParagraphIdx])

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
