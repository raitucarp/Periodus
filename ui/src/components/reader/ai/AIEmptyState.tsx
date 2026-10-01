import React from 'react'
import { Center, Heading, Text, Square } from '@chakra-ui/react'
import { Sparkles } from 'lucide-react'

export interface AIEmptyStateProps {
  title: string
  description: string
}

export function AIEmptyState({ title, description }: AIEmptyStateProps) {
  return (
    <Center flex="1" flexDirection="column" textAlign="center" p="1.25rem" color="fg.subtle">
      <Square mb="0.75rem" opacity="0.5">
        <Sparkles size="2rem" />
      </Square>
      <Heading as="h4" fontFamily="heading" size="xs" color="fg.muted" mb="0.25rem">
        {title}
      </Heading>
      <Text textStyle="xs" lineHeight="tall" maxW="16.25rem">
        {description}
      </Text>
    </Center>
  )
}
