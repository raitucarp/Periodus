import React from 'react'
import { Card, Heading, Text, Square, Stack } from '@chakra-ui/react'
import { BookOpen } from 'lucide-react'

export interface BookCoverFallbackProps {
  title: string
  author: string
}

export function BookCoverFallback({ title, author }: BookCoverFallbackProps) {
  return (
    <Card.Body
      w="full"
      h="full"
      p="4"
      display="flex"
      justifyContent="space-between"
      bg="bg.muted"
    >
      <Square
        size="iconBadge"
        rounded="md"
        bg="ruby.solid"
        color="ruby.contrast"
      >
        <BookOpen size={16} />
      </Square>

      <Stack gap="1">
        <Heading
          as="h5"
          textStyle="card.title"
          color="fg"
          lineHeight="snug"
          lineClamp={3}
        >
          {title}
        </Heading>
        <Text
          textStyle="card.author"
          truncate
        >
          {author}
        </Text>
      </Stack>
    </Card.Body>
  )
}
