import React from 'react'
import type { Chapter } from '@/lib/types'
import { HStack, NativeSelect, Square } from '@chakra-ui/react'
import { Layers } from 'lucide-react'
import { map } from 'lodash-es'

export interface ReaderChapterSelectProps {
  currentChapterIdx: number
  chapters: Chapter[]
  formatOptionLabel: (ch: Chapter) => string
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

export function ReaderChapterSelect({
  currentChapterIdx,
  chapters,
  formatOptionLabel,
  onChange,
}: ReaderChapterSelectProps) {
  function renderOption(ch: Chapter) {
    const { id, chapter_index } = ch
    const label = formatOptionLabel(ch)
    return (
      <option key={id} value={chapter_index}>
        {label}
      </option>
    )
  }

  const options = map(chapters, renderOption)

  return (
    <HStack gap="2">
      <Square color="fg.muted">
        <Layers size={16} />
      </Square>
      <NativeSelect.Root size="sm" width="chapterSelectWidth">
        <NativeSelect.Field
          value={currentChapterIdx}
          onChange={onChange}
          bg="bg.surface"
          borderColor="border.subtle"
          color="fg"
        >
          {options}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </HStack>
  )
}
