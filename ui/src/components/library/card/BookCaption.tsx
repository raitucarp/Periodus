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
    <Stack gap="0.125rem" mt="0.5rem">
      <Heading
        as="h6"
        fontFamily="heading"
        size="xs"
        color={titleColor}
        fontWeight="semibold"
        truncate
      >
        {title}
      </Heading>
      <Text textStyle="xs" color="fg.muted" truncate>
        {subtitle}
      </Text>
    </Stack>
  )
}
