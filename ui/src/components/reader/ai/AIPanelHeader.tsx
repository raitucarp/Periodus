import React from 'react'
import { Flex, HStack, Heading, Badge, Square } from '@chakra-ui/react'
import { Sparkles } from 'lucide-react'

export interface AIPanelHeaderProps {
  heading: string
  badge: string
}

export function AIPanelHeader({ heading, badge }: AIPanelHeaderProps) {
  return (
    <Flex as="header" align="center" justify="space-between" mb="1.25rem">
      <HStack gap="0.5rem">
        <Square color="ruby.solid">
          <Sparkles size="1.125rem" />
        </Square>
        <Heading as="h3" fontFamily="heading" size="sm" color="fg" letterSpacing="wide">
          {heading}
        </Heading>
      </HStack>

      <Badge
        colorPalette="gray"
        variant="outline"
        rounded="md"
        px="0.5rem"
        py="0.125rem"
        textStyle="xs"
      >
        {badge}
      </Badge>
    </Flex>
  )
}
