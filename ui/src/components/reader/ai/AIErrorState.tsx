import React from 'react'
import { Card, Text, Button } from '@chakra-ui/react'

export interface AIErrorStateProps {
  problemHeading: string
  errorMessage: string
  settingsLabel: string
  onOpenSettings: () => void
}

export function AIErrorState({
  problemHeading,
  errorMessage,
  settingsLabel,
  onOpenSettings,
}: AIErrorStateProps) {
  return (
    <Card.Root
      p="4"
      rounded="md"
      bg="ruby.subtle"
      borderWidth="0.0625rem"
      borderColor="ruby.border"
      color="ruby.fg"
    >
      <Text textStyle="analysis.errorHeading" mb="1">
        {problemHeading}
      </Text>
      <Text textStyle="analysis.errorMessage" mb="3">
        {errorMessage}
      </Text>
      <Button
        size="xs"
        colorPalette="ruby"
        variant="solid"
        onClick={onOpenSettings}
        alignSelf="flex-start"
      >
        {settingsLabel}
      </Button>
    </Card.Root>
  )
}
