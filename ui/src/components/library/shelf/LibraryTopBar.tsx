import React from 'react'
import { Flex } from '@chakra-ui/react'
import { LibrarySearchBar } from './LibrarySearchBar'
import { LibraryStats } from './LibraryStats'

export interface LibraryTopBarProps {
  placeholder: string
  query: string
  countText: string
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function LibraryTopBar({
  placeholder,
  query,
  countText,
  onSearchChange,
}: LibraryTopBarProps) {
  return (
    <Flex align="center" justify="space-between" mb="8" w="full">
      <LibrarySearchBar
        placeholder={placeholder}
        query={query}
        onChange={onSearchChange}
      />
      <LibraryStats countText={countText} />
    </Flex>
  )
}
