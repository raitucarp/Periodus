import React from 'react'
import { Flex, HStack, Badge, Text, Square } from '@chakra-ui/react'
import { Bookmark } from 'lucide-react'

export interface ParagraphHeaderInfoProps {
  chapterLabel: string
  paragraphOfTotal: string
}

export function ParagraphHeaderInfo({ chapterLabel, paragraphOfTotal }: ParagraphHeaderInfoProps) {
  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      flexShrink={0}
      px="3.5rem"
      pt="1.5rem"
      pb="1rem"
      borderBottomWidth="0.0625rem"
      borderBottomColor="glass.borderSubtle"
      w="full"
      zIndex={1}
    >
      <HStack gap="0.5rem">
        <Square color="ruby.solid">
          <Bookmark size="1rem" />
        </Square>
        <Text textStyle="sm" fontWeight="semibold" color="fg.muted">
          {chapterLabel}
        </Text>
      </HStack>

      <Badge
        colorPalette="ruby"
        variant="subtle"
        px="0.75rem"
        py="0.25rem"
        rounded="full"
        textStyle="xs"
        fontWeight="bold"
      >
        {paragraphOfTotal}
      </Badge>
    </Flex>
  )
}
