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
      px="14"
      pt="6"
      pb="4"
      borderBottomWidth="0.0625rem"
      borderBottomColor="glass.borderSubtle"
      w="full"
      zIndex="base"
    >
      <HStack gap="2">
        <Square color="ruby.solid">
          <Bookmark size={16} />
        </Square>
        <Text textStyle="sm" fontWeight="semibold" color="fg.muted">
          {chapterLabel}
        </Text>
      </HStack>

      <Badge
        colorPalette="ruby"
        variant="subtle"
        px="3"
        py="1"
        rounded="full"
        textStyle="xs"
        fontWeight="bold"
      >
        {paragraphOfTotal}
      </Badge>
    </Flex>
  )
}
