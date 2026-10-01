import React from 'react'
import { Text, Button, Center, VStack, Box } from '@chakra-ui/react'
import { AlertCircle } from 'lucide-react'

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
    <Center flex="1" my="auto" py="8" px="4">
      <VStack gap="2.5" maxW="16rem" textAlign="center">
        <Box color="fg.subtle">
          <AlertCircle size={24} />
        </Box>
        <Text textStyle="sm" fontWeight="semibold" color="fg.muted">
          {problemHeading}
        </Text>
        <Text textStyle="xs" color="fg.subtle">
          {errorMessage}
        </Text>
        <Button
          size="xs"
          variant="outline"
          colorPalette="gray"
          mt="2"
          onClick={onOpenSettings}
        >
          {settingsLabel}
        </Button>
      </VStack>
    </Center>
  )
}
