import React from 'react'
import { Text } from '@chakra-ui/react'

export interface LibraryStatsProps {
  countText: string
}

export function LibraryStats({ countText }: LibraryStatsProps) {
  return (
    <Text textStyle="sm" color="fg.muted">
      {countText}
    </Text>
  )
}
