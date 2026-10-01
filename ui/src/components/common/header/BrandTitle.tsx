import React from 'react'
import { HStack, Heading, Badge } from '@chakra-ui/react'

export interface BrandTitleProps {
  title: string
  subtitle: string
}

export function BrandTitle({ title, subtitle }: BrandTitleProps) {
  return (
    <HStack gap="2.5" align="center">
      <Heading
        as="h1"
        textStyle="brand.title"
        backgroundImage="{colors.gradient.brandTextTitle}"
        bgClip="text"
      >
        {title}
      </Heading>
      <Badge
        colorPalette="ruby"
        variant="subtle"
        textStyle="brand.badge"
        layerStyle="brandBadgeSubtle"
        px="2.5"
        py="0.5"
      >
        {subtitle}
      </Badge>
    </HStack>
  )
}
