import React from 'react'
import { Flex, HStack, Heading, Badge, Square } from '@chakra-ui/react'
import { Sparkles } from 'lucide-react'

export interface AIPanelHeaderProps {
  heading: string
  badge: string
}

export function AIPanelHeader({ heading, badge }: AIPanelHeaderProps) {
  return (
    <Flex as="header" align="center" justify="space-between" mb="5">
      <HStack gap="2">
        <Square color="ruby.solid">
          <Sparkles size={18} />
        </Square>
        <Heading as="h3" textStyle="analysis.header">
          {heading}
        </Heading>
      </HStack>

      <Badge
        colorPalette="gray"
        variant="outline"
        rounded="md"
        px="2"
        py="0.5"
        textStyle="xs"
      >
        {badge}
      </Badge>
    </Flex>
  )
}
