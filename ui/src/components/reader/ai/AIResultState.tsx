import React from 'react'
import { Flex, Badge, Text } from '@chakra-ui/react'

export interface AIResultStateProps {
  badgeText: string
  resultText: string
}

export function AIResultState({ badgeText, resultText }: AIResultStateProps) {
  return (
    <Flex direction="column" color="fg" gap="0.75rem">
      <Badge
        colorPalette="ruby"
        variant="subtle"
        textTransform="uppercase"
        letterSpacing="wider"
        textStyle="2xs"
        alignSelf="flex-start"
      >
        {badgeText}
      </Badge>
      <Text
        fontFamily="analysis"
        textStyle="sm"
        lineHeight="1.8"
        whiteSpace="pre-wrap"
      >
        {resultText}
      </Text>
    </Flex>
  )
}
