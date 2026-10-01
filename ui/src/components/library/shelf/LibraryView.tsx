import React from 'react'
import type { Book } from '@/lib/types'
import { isEmpty } from 'lodash-es'
import { match } from 'ts-pattern'
import { useLibrary } from '@/hooks/useLibrary'
import { useTranslation } from '@/i18n'
import { LibraryTopBar } from './LibraryTopBar'
import { ContinueReadingShelf } from './ContinueReadingShelf'
import { AllBooksShelf } from './AllBooksShelf'
import { LibraryLayout } from './LibraryLayout'

export function LibraryView() {
  const {
    books,
    inProgressBooks,
    totalBooksCount,
    searchQuery,
    updateSearchQuery,
    selectBook,
    deleteBook,
  } = useLibrary()

  const { t, format } = useTranslation()

  function handleSearchChange({ target: { value } }: React.ChangeEvent<HTMLInputElement>) {
    updateSearchQuery(value)
  }

  function handleSelectBook(book: Book) {
    selectBook(book)
  }

  function handleDeleteBook(id: string, { stopPropagation }: React.MouseEvent) {
    stopPropagation()
    if (window.confirm(t.library.deleteBookConfirm)) {
      deleteBook(id)
    }
  }

  const hasInProgress = !isEmpty(inProgressBooks)

  const inProgressSection = match(hasInProgress)
    .with(true, function renderInProgress() {
      return (
        <ContinueReadingShelf
          heading={t.library.continueReadingHeading}
          books={inProgressBooks}
          onSelect={handleSelectBook}
          onDelete={handleDeleteBook}
        />
      )
    })
    .with(false, function noInProgress() {
      return null
    })
    .exhaustive()

  const totalCountText = format(t.library.totalBooksCount, { count: totalBooksCount })
  const noMatchText = format(t.library.noBooksFound, { query: searchQuery })

  const libraryContent = (
    <LibraryLayout>
      <LibraryTopBar
        placeholder={t.library.searchPlaceholder}
        query={searchQuery}
        countText={totalCountText}
        onSearchChange={handleSearchChange}
      />
      {inProgressSection}
      <AllBooksShelf
        heading={t.library.allBooksHeading}
        books={books}
        emptyMessage={noMatchText}
        onSelect={handleSelectBook}
        onDelete={handleDeleteBook}
      />
    </LibraryLayout>
  )

  return libraryContent
}
