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
    <Flex position="relative" w="20rem" align="center">
      <Square
        position="absolute"
        left="0.75rem"
        color="fg.subtle"
        pointerEvents="none"
        zIndex="2"
      >
        <Search size="1rem" />
      </Square>
      <Input
        placeholder={placeholder}
        value={query}
        onChange={onChange}
        pl="2.25rem"
        size="sm"
        w="full"
        bg="glass.input"
        backdropFilter="blur(1rem)"
        borderWidth="0.0625rem"
        borderColor="glass.borderSubtle"
        rounded="lg"
        color="fg"
        boxShadow="inset 0 0.0625rem 0.0625rem {colors.blackA.4}"
        _focus={{
          borderColor: 'ruby.solid',
          boxShadow: '0 0 1rem {colors.rubyA.6}',
        }}
      />
    </Flex>
  )
}
