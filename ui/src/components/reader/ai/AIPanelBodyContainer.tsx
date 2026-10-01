import React from 'react'
import { Card } from '@chakra-ui/react'

export interface AIPanelBodyContainerProps {
  children: React.ReactNode
}

export function AIPanelBodyContainer({ children }: AIPanelBodyContainerProps) {
  return (
    <Card.Root
      flex="1"
      bg="bg.surface"
      borderWidth="0.0625rem"
      borderColor="border.subtle"
      rounded="xl"
      p="1.25rem"
      overflowY="auto"
      display="flex"
      flexDirection="column"
    >
      {children}
    </Card.Root>
  )
}
