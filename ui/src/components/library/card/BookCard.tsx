import React, { useState } from 'react'
import type { Book } from '@/lib/types'
import { match } from 'ts-pattern'
import { AnimatePresence } from 'motion/react'
import { useTranslation } from '@/i18n'
import { BookCoverImage } from './BookCoverImage'
import { BookCoverFallback } from './BookCoverFallback'
import { BookProgressBar } from './BookProgressBar'
import { BookDeleteButton } from './BookDeleteButton'
import { BookCaption } from './BookCaption'
import { BookCardLayout } from './BookCardLayout'

export interface BookCardProps {
  book: Book
  onSelect: (book: Book) => void
  onDelete: (id: string, e: React.MouseEvent) => void
}

export function BookCard({ book, onSelect, onDelete }: BookCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { t, format } = useTranslation()
  const { id, title, author, cover_path, total_paragraphs, percent_complete } = book

  const hasCover = Boolean(cover_path && cover_path.trim() !== '')
  const hasProgress = percent_complete > 0

  function handleCardClick() {
    onSelect(book)
  }

  function handleMouseEnter() {
    setIsHovered(true)
  }

  function handleMouseLeave() {
    setIsHovered(false)
  }

  function handleDeleteClick(event: React.MouseEvent) {
    onDelete(id, event)
  }

  const paragraphCountText = format(t.library.paragraphsCount, {
    count: total_paragraphs,
  })

  const authorOrFallback = match(Boolean(author))
    .with(true, function explicitAuthor() {
      return author
    })
    .with(false, function missingAuthor() {
      return t.library.unknownAuthor
    })
    .exhaustive()

  const subtitleText = match(Boolean(author))
    .with(true, function authorSub() {
      return author
    })
    .with(false, function countSub() {
      return paragraphCountText
    })
    .exhaustive()

  const coverElement = match(hasCover)
    .with(true, function renderCover() {
      return <BookCoverImage coverPath={cover_path} title={title} />
    })
    .with(false, function renderFallback() {
      return <BookCoverFallback title={title} author={authorOrFallback} />
    })
    .exhaustive()

  const progressBarElement = match(hasProgress)
    .with(true, function renderProgress() {
      return <BookProgressBar percent={percent_complete} />
    })
    .with(false, function noProgress() {
      return null
    })
    .exhaustive()

  const deleteButtonElement = match(isHovered)
    .with(true, function renderDelete() {
      return (
        <BookDeleteButton
          ariaLabel={t.library.deleteButtonAria}
          onDelete={handleDeleteClick}
        />
      )
    })
    .with(false, function noDelete() {
      return null
    })
    .exhaustive()

  const cardBorderColor = match(isHovered)
    .with(true, function activeBorder() {
      return 'ruby.solid'
    })
    .with(false, function normalBorder() {
      return 'border.subtle'
    })
    .exhaustive()

  const cardContent = (
    <BookCardLayout
      isHovered={isHovered}
      borderColor={cardBorderColor}
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      caption={
        <BookCaption
          title={title}
          subtitle={subtitleText}
          isHovered={isHovered}
        />
      }
    >
      {coverElement}
      {progressBarElement}
      <AnimatePresence>
        {deleteButtonElement}
      </AnimatePresence>
    </BookCardLayout>
  )

  return cardContent
}
