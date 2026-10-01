import React from 'react'
import { HStack, Heading, Badge } from '@chakra-ui/react'

export interface BrandTitleProps {
  title: string
  subtitle: string
}

export function BrandTitle({ title, subtitle }: BrandTitleProps) {
  return (
    <HStack gap="0.625rem" align="center">
      <Heading
        as="h1"
        fontFamily="heading"
        fontSize="1.25rem"
        fontWeight="bold"
        letterSpacing="0.08em"
        textTransform="uppercase"
        backgroundImage="linear-gradient(135deg, #ffffff 40%, {colors.whiteA.8} 100%)"
        style={{
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {title}
      </Heading>
      <Badge
        colorPalette="ruby"
        variant="subtle"
        rounded="full"
        px="0.625rem"
        py="0.125rem"
        textStyle="xs"
        fontWeight="semibold"
        letterSpacing="wider"
        borderWidth="0.0625rem"
        borderStyle="solid"
        borderColor="rubyA.5"
        boxShadow="0 0 0.75rem -0.125rem {colors.rubyA.6}"
      >
        {subtitle}
      </Badge>
    </HStack>
  )
}
