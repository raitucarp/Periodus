import React from 'react'
import { Flex, Badge, Text } from '@chakra-ui/react'

export interface AIResultStateProps {
  badgeText: string
  resultText: string
}

export function AIResultState({ badgeText, resultText }: AIResultStateProps) {
  return (
    <Flex direction="column" color="fg" gap="3">
      <Badge
        colorPalette="ruby"
        variant="subtle"
        textStyle="analysis.badge"
        alignSelf="flex-start"
      >
        {badgeText}
      </Badge>
      <Text
        textStyle="analysis.body"
        whiteSpace="pre-wrap"
      >
        {resultText}
      </Text>
    </Flex>
  )
}
