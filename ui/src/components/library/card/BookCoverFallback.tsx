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
      p="1rem"
      display="flex"
      justifyContent="space-between"
      bg="bg.muted"
    >
      <Square
        size="2rem"
        rounded="md"
        bg="ruby.solid"
        color="ruby.contrast"
      >
        <BookOpen size="1rem" />
      </Square>

      <Stack gap="0.25rem">
        <Heading
          as="h5"
          fontFamily="heading"
          size="sm"
          color="fg"
          lineHeight="snug"
          lineClamp={3}
        >
          {title}
        </Heading>
        <Text
          textStyle="xs"
          color="fg.muted"
          truncate
        >
          {author}
        </Text>
      </Stack>
    </Card.Body>
  )
}
