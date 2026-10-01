import React from 'react'
import { Flex, Input, Square } from '@chakra-ui/react'
import { Search } from 'lucide-react'

export interface LibrarySearchBarProps {
  placeholder: string
  query: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function LibrarySearchBar({ placeholder, query, onChange }: LibrarySearchBarProps) {
  return (
    <Flex position="relative" w="searchBar" align="center">
      <Square
        position="absolute"
        left="3"
        color="fg.subtle"
        pointerEvents="none"
        zIndex="2"
      >
        <Search size={16} />
      </Square>
      <Input
        placeholder={placeholder}
        value={query}
        onChange={onChange}
        pl="9"
        size="sm"
        w="full"
        layerStyle="glassInput"
      />
    </Flex>
  )
}
