import React from 'react'
import { Center, Heading, Text, Square } from '@chakra-ui/react'
import { Sparkles } from 'lucide-react'

export interface AIEmptyStateProps {
  title: string
  description: string
}

export function AIEmptyState({ title, description }: AIEmptyStateProps) {
  return (
    <Center flex="1" flexDirection="column" textAlign="center" p="5" color="fg.subtle">
      <Square mb="3" opacity="0.5">
        <Sparkles size={32} />
      </Square>
      <Heading as="h4" textStyle="card.title" color="fg.muted" mb="1">
        {title}
      </Heading>
      <Text textStyle="xs" lineHeight="tall" maxW="bookCardHeight">
        {description}
      </Text>
    </Center>
  )
}
