import React from 'react'
import { Heading, Text, Stack } from '@chakra-ui/react'
import { match } from 'ts-pattern'

export interface BookCaptionProps {
  title: string
  subtitle: string
  isHovered: boolean
}

export function BookCaption({ title, subtitle, isHovered }: BookCaptionProps) {
  const titleColor = match(isHovered)
    .with(true, function activeColor() {
      return 'ruby.fg'
    })
    .with(false, function normalColor() {
      return 'fg'
    })
    .exhaustive()

  return (
    <Stack gap="0.5" mt="2">
      <Heading
        as="h6"
        textStyle="card.title"
        color={titleColor}
        truncate
      >
        {title}
      </Heading>
      <Text textStyle="card.author" truncate>
        {subtitle}
      </Text>
    </Stack>
  )
}
