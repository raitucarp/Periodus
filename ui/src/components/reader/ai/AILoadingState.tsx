import React from 'react'
import { Center, Spinner, Text } from '@chakra-ui/react'

export interface AILoadingStateProps {
  label: string
}

export function AILoadingState({ label }: AILoadingStateProps) {
  return (
    <Center flex="1" flexDirection="column" gap="3" color="fg.muted">
      <Spinner size="md" colorPalette="ruby" />
      <Text textStyle="xs">{label}</Text>
    </Center>
  )
}
